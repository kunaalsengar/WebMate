import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import type { CharacterAnimationState, CompanionPosition } from '@webmate/shared';
import { buildBlinkTimeline } from './definitions';
import { AnimationLifecycleManager } from './lifecycle';
import {
  isPrefersReducedMotion,
  resolveRigElements,
  syncHeadTransformAfterReactRender,
} from './motionUtils';
import {
  calculatePointingPose,
  isElementTarget,
  resolveRigViewportBounds,
  type PointingArm,
  type PointingPose,
  type PointingTarget,
} from './pointingGeometry';
import type {
  AnimationBuildContext,
  CharacterAnimationHookOptions,
  CharacterRigLayerElements,
  PointingAnimationDriver,
  TalkingAnimationDriver,
} from './types';

const GESTURE_STATES_OVERRIDING_POINTING = new Set<string>([
  'waving',
  'thinking',
  'explaining',
  'happy',
  'sleeping',
]);

/**
 * Controller class coordinating high-level animation states, natural periodic blinking,
 * event-driven talking cadence, dynamic element pointing, drag pause/resume, and GSAP lifecycle.
 */
export class CharacterAnimationController {
  private lifecycle = new AnimationLifecycleManager();
  private blinkTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private isSpeakingActive = false;
  private isDraggingActive = false;
  private wasDragging = false;
  private isReducedMotion = false;
  private speechPulseTween: gsap.core.Tween | null = null;
  private speechSettleTween: gsap.core.Tween | null = null;
  private lastState: string | null = null;
  private lastExpression: string | null = null;

  // Dynamic pointing state and tracking listeners
  private pointingTarget: PointingTarget | null = null;
  private isPointingActive = false;
  private currentPointingPose: PointingPose | null = null;
  private currentPointingArm: PointingArm | null = null;
  private latestContext: AnimationBuildContext | null = null;
  private latestCompanionPosition: CompanionPosition | null = null;
  private onPointingStopCallback: (() => void) | undefined;
  private scrollResizeRafId: number | null = null;
  private isTrackingListenersAttached = false;

  /**
   * Updates playback state when props or viewport environment changes.
   */
  public updateState(
    ctx: AnimationBuildContext,
    state: string,
    isDragging: boolean,
    options?: {
      companionPosition?: CompanionPosition | null;
      onPointingStop?: () => void;
    }
  ): void {
    const dragEnded = this.wasDragging && !isDragging;
    this.wasDragging = isDragging;
    this.isDraggingActive = isDragging;
    this.isReducedMotion = ctx.isReducedMotion;
    this.latestContext = ctx;

    if (options?.companionPosition !== undefined) {
      this.latestCompanionPosition = options.companionPosition;
    }
    if (options?.onPointingStop !== undefined) {
      this.onPointingStopCallback = options.onPointingStop;
    }

    // 1. Dragging optimization: pause animations and settle speech tweens to prioritize 60fps dragging
    if (isDragging) {
      this.killSpeechTweens(true, ctx.targets);
      this.cancelPendingTrackingRaf();
      this.lifecycle.pause();
      this.clearBlinkTimer();
      return;
    } else {
      this.lifecycle.resume();
    }

    // 2. Kill or safely settle speech tweens on state transitions
    const stateChanged = this.lastState !== null && this.lastState !== state;
    const expressionChanged =
      this.lastExpression !== null && this.lastExpression !== ctx.expression;
    if (stateChanged) {
      if (this.lastState === 'talking' && state !== 'talking') {
        this.isSpeakingActive = false;
      }
      this.killSpeechTweens(true, ctx.targets);

      // Explicit gesture states (waving, thinking, happy, sleeping, explaining) override active pointing
      if (this.isPointingActive && GESTURE_STATES_OVERRIDING_POINTING.has(state)) {
        this.clearPointingState();
        this.onPointingStopCallback?.();
      }
    }
    this.lastState = state;
    this.lastExpression = ctx.expression;

    // 3. If pointing is active, keep the pointing pose articulated instead of starting conflicting timelines
    if (this.isPointingActive && this.pointingTarget) {
      if (expressionChanged && ctx.targets.head) {
        // React updates `#layer-head`'s SVG transform attribute when expression headTiltDeg changes;
        // restore GSAP's cached matrix so the pointing head pose and neck pivot remain aligned.
        syncHeadTransformAfterReactRender(ctx.targets.head, ctx.anchors.head);
      }
      if (dragEnded || stateChanged || expressionChanged || !this.currentPointingPose) {
        this.recomputeAndApplyPointing(false);
      }
      this.scheduleNextBlink(ctx, state);
      return;
    }

    // 4. Play primary state timeline when not pointing
    this.lifecycle.playState(state as CharacterAnimationState, ctx);

    // 5. Schedule periodic natural eye blinking if state allows
    this.scheduleNextBlink(ctx, state);
  }

  /**
   * Synchronizes updated companion viewport coordinates (e.g., after dock snap or window resize).
   */
  public updateCompanionPosition(position: CompanionPosition | null | undefined): void {
    const normalized = position ?? null;
    if (
      normalized?.x === this.latestCompanionPosition?.x &&
      normalized?.y === this.latestCompanionPosition?.y &&
      normalized?.dockSide === this.latestCompanionPosition?.dockSide
    ) {
      return;
    }

    this.latestCompanionPosition = normalized;

    if (this.isPointingActive && this.pointingTarget && !this.isDraggingActive) {
      this.recomputeAndApplyPointing(false);
    }
  }

  /**
   * Points the mascot dynamically toward an HTMLElement or viewport bounding rectangle.
   */
  public pointAt(target: PointingTarget): void {
    if (!target) return;

    if (isElementTarget(target) && 'isConnected' in target && !target.isConnected) {
      return;
    }

    const isSameTarget = this.isPointingActive && this.pointingTarget === target;
    this.pointingTarget = target;
    this.isPointingActive = true;

    this.attachTrackingListeners();

    if (this.isDraggingActive || !this.latestContext) {
      return;
    }

    this.recomputeAndApplyPointing(isSameTarget);
    this.scheduleNextBlink(this.latestContext, this.lastState ?? 'idle');
  }

  /**
   * Interrupts pointing safely, detaches viewport listeners, and restores neutral/base pose.
   */
  public stopPointing(notifyExternal = false): void {
    if (!this.isPointingActive && !this.pointingTarget && !this.currentPointingPose) {
      this.detachTrackingListeners();
      return;
    }

    this.clearPointingState();

    if (notifyExternal) {
      this.onPointingStopCallback?.();
    }

    if (this.isDraggingActive) {
      this.lifecycle.killPointingTimeline();
      return;
    }

    const ctx = this.latestContext;
    if (!ctx) return;

    const resumeState = (this.lastState ?? 'idle') as CharacterAnimationState;
    this.lifecycle.stopPointingPose(ctx, () => {
      if (!this.isPointingActive && !this.isDraggingActive && this.latestContext === ctx) {
        this.lifecycle.playState(resumeState, ctx);
        this.scheduleNextBlink(ctx, resumeState);
      }
    });
  }

  /**
   * Reports whether dynamic pointing is currently active.
   */
  public isPointing(): boolean {
    return this.isPointingActive;
  }

  /**
   * Returns the latest resolved PointingPose if pointing is active.
   */
  public getCurrentPointingPose(): PointingPose | null {
    return this.currentPointingPose;
  }

  /**
   * Returns a stable public driver interface controlling dynamic pointing.
   */
  public getPointingDriver(): PointingAnimationDriver {
    return {
      pointAt: (target: PointingTarget) => this.pointAt(target),
      stopPointing: () => this.stopPointing(true),
      isPointing: () => this.isPointing(),
      getCurrentPose: () => this.getCurrentPointingPose(),
    };
  }

  /**
   * Recomputes the target vector and applies the GSAP pointing pose.
   */
  private recomputeAndApplyPointing(isTrackingUpdate: boolean): void {
    if (
      !this.isPointingActive ||
      !this.pointingTarget ||
      !this.latestContext ||
      this.isDraggingActive
    ) {
      return;
    }

    const ctx = this.latestContext;
    const svgEl =
      ctx.scope.tagName.toLowerCase() === 'svg'
        ? (ctx.scope as SVGSVGElement)
        : null;
    const rigBounds = resolveRigViewportBounds(svgEl, this.latestCompanionPosition);
    if (!rigBounds) {
      return;
    }

    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    const pose = calculatePointingPose({
      target: this.pointingTarget,
      rigBounds,
      anchors: ctx.anchors,
      viewportWidth,
      viewportHeight,
      dockSide: this.latestCompanionPosition?.dockSide,
      previousArm: this.currentPointingArm,
    });

    if (!pose) {
      // Target detached or became invalid; stop pointing gracefully
      this.stopPointing(true);
      return;
    }

    this.currentPointingPose = pose;
    this.currentPointingArm = pose.arm;
    this.lifecycle.playPointingPose(ctx, pose, { isTrackingUpdate });
  }

  /**
   * Resets internal pointing target fields and detaches viewport tracking listeners.
   */
  private clearPointingState(): void {
    this.pointingTarget = null;
    this.isPointingActive = false;
    this.currentPointingPose = null;
    this.currentPointingArm = null;
    this.detachTrackingListeners();
  }

  /**
   * Scroll handler (recalculates on next animation frame strictly for DOM element targets).
   */
  private readonly handleScroll = (): void => {
    if (!this.isPointingActive || this.isDraggingActive || !isElementTarget(this.pointingTarget)) {
      return;
    }
    this.scheduleTrackingUpdate();
  };

  /**
   * Resize handler (recalculates on next animation frame for any pointing target).
   */
  private readonly handleResize = (): void => {
    if (!this.isPointingActive || this.isDraggingActive || !this.pointingTarget) {
      return;
    }
    this.scheduleTrackingUpdate();
  };

  private scheduleTrackingUpdate(): void {
    if (this.scrollResizeRafId !== null || typeof requestAnimationFrame !== 'function') {
      return;
    }
    this.scrollResizeRafId = requestAnimationFrame(() => {
      this.scrollResizeRafId = null;
      this.recomputeAndApplyPointing(true);
    });
  }

  private cancelPendingTrackingRaf(): void {
    if (this.scrollResizeRafId !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(this.scrollResizeRafId);
      this.scrollResizeRafId = null;
    }
  }

  /**
   * Attaches passive capture scroll/resize listeners idempotently.
   */
  private attachTrackingListeners(): void {
    if (this.isTrackingListenersAttached || typeof window === 'undefined') {
      return;
    }
    window.addEventListener('scroll', this.handleScroll, { passive: true, capture: true });
    window.addEventListener('resize', this.handleResize, { passive: true });
    this.isTrackingListenersAttached = true;
  }

  /**
   * Detaches scroll/resize listeners and cancels any queued tracking frame.
   */
  private detachTrackingListeners(): void {
    this.cancelPendingTrackingRaf();
    if (!this.isTrackingListenersAttached || typeof window === 'undefined') {
      return;
    }
    window.removeEventListener('scroll', this.handleScroll, { capture: true });
    window.removeEventListener('resize', this.handleResize);
    this.isTrackingListenersAttached = false;
  }

  /**
   * Safely kills and cleans up all active speech-related tweens (pulse and settle).
   * Optionally resets the mouth element to neutral scale.
   */
  public killSpeechTweens(settleToNeutral = false, targets?: CharacterRigLayerElements | null): void {
    if (this.speechPulseTween) {
      this.speechPulseTween.kill();
      this.speechPulseTween = null;
    }
    if (this.speechSettleTween) {
      this.speechSettleTween.kill();
      this.speechSettleTween = null;
    }
    if (settleToNeutral && targets?.mouth) {
      gsap.set(targets.mouth, { scaleY: 1.0, scaleX: 1.0 });
    }
  }

  /**
   * Event-driven talking driver interface for future AI text-stream token pacing.
   */
  public getTalkingDriver(
    targetsProvider: () => CharacterRigLayerElements | null
  ): TalkingAnimationDriver {
    return {
      /** Triggers an event-driven mouth pulse when speaking is active and companion is not being dragged */
      pushSpeechToken: (_token?: string) => {
        if (this.isReducedMotion || isPrefersReducedMotion()) {
          const targets = targetsProvider();
          if (targets?.mouth) {
            gsap.set(targets.mouth, { scaleY: 1.0, scaleX: 1.0 });
          }
          return;
        }

        if (!this.isSpeakingActive || this.isDraggingActive) {
          return;
        }

        const targets = targetsProvider();
        if (!targets || !targets.mouth) return;

        this.killSpeechTweens(false);

        this.speechPulseTween = gsap.to(targets.mouth, {
          scaleY: 1.25,
          scaleX: 1.05,
          duration: 0.08,
          yoyo: true,
          repeat: 1,
          ease: 'power1.out',
          onComplete: () => {
            this.speechPulseTween = null;
          },
        });
      },

      /** Activates the speaking lifecycle */
      startSpeaking: () => {
        this.isSpeakingActive = true;
        this.killSpeechTweens(false);

        if (this.isReducedMotion || isPrefersReducedMotion()) {
          const targets = targetsProvider();
          if (targets?.mouth) {
            gsap.set(targets.mouth, { scaleY: 1.0, scaleX: 1.0 });
          }
        }
      },

      /** Deactivates speaking and settles the mouth to its neutral resting pose */
      stopSpeaking: () => {
        this.isSpeakingActive = false;
        const targets = targetsProvider();

        this.killSpeechTweens(false);

        if (!targets || !targets.mouth) return;

        if (this.isDraggingActive || this.isReducedMotion || isPrefersReducedMotion()) {
          gsap.set(targets.mouth, { scaleY: 1.0, scaleX: 1.0 });
          return;
        }

        this.speechSettleTween = gsap.to(targets.mouth, {
          scaleY: 1.0,
          scaleX: 1.0,
          duration: 0.15,
          ease: 'sine.out',
          onComplete: () => {
            this.speechSettleTween = null;
          },
        });
      },

      /** Reports speaking lifecycle state */
      isSpeaking: () => this.isSpeakingActive,
    };
  }

  /**
   * Schedules natural periodic eye blinking layered over continuous idle/talking/pointing poses.
   */
  private scheduleNextBlink(ctx: AnimationBuildContext, state: string): void {
    this.clearBlinkTimer();

    if (state === 'sleeping' || state === 'blinking' || ctx.isReducedMotion) {
      return;
    }

    const intervalMs = Math.floor(Math.random() * 2500) + 3500;

    this.blinkTimeoutId = setTimeout(() => {
      this.lifecycle.playOverlay(buildBlinkTimeline, ctx);
      this.scheduleNextBlink(ctx, state);
    }, intervalMs);
  }

  /**
   * Clears pending blink timer.
   */
  private clearBlinkTimer(): void {
    if (this.blinkTimeoutId !== null) {
      clearTimeout(this.blinkTimeoutId);
      this.blinkTimeoutId = null;
    }
  }

  /**
   * Cleans up all GSAP timelines, listeners, and timers upon unmount.
   */
  public cleanup(targets?: CharacterRigLayerElements): void {
    this.clearBlinkTimer();
    this.clearPointingState();
    this.latestContext = null;
    this.latestCompanionPosition = null;
    this.onPointingStopCallback = undefined;
    this.isSpeakingActive = false;
    this.killSpeechTweens(true, targets);
    this.lifecycle.cleanup(targets);
    this.lastState = null;
    this.lastExpression = null;
    this.wasDragging = false;
    this.isDraggingActive = false;
    this.isReducedMotion = false;
  }
}

/**
 * Custom React hook binding CharacterRig SVG elements to the CharacterAnimationController.
 */
export function useCharacterAnimation(options: CharacterAnimationHookOptions): {
  talkingDriver: TalkingAnimationDriver;
  pointingDriver: PointingAnimationDriver;
} {
  const {
    svgRef,
    animationState,
    expression = 'normal',
    isDragging = false,
    anchors,
    pointingTarget,
    companionPosition = null,
    onTalkingDriverReady,
    onPointingDriverReady,
    onPointingStop,
  } = options;

  const controllerRef = useRef<CharacterAnimationController | null>(null);

  if (!controllerRef.current) {
    controllerRef.current = new CharacterAnimationController();
  }

  const targetsRef = useRef<CharacterRigLayerElements | null>(null);
  const prevPointingTargetPropRef = useRef<PointingTarget | null | undefined>(undefined);
  const latestPositionRef = useRef<CompanionPosition | null>(companionPosition);
  latestPositionRef.current = companionPosition;

  const talkingDriver = useMemo(() => {
    return controllerRef.current!.getTalkingDriver(() => targetsRef.current);
  }, []);

  const pointingDriver = useMemo(() => {
    return controllerRef.current!.getPointingDriver();
  }, []);

  useEffect(() => {
    if (onTalkingDriverReady) {
      onTalkingDriverReady(talkingDriver);
    }
  }, [onTalkingDriverReady, talkingDriver]);

  useEffect(() => {
    if (onPointingDriverReady) {
      onPointingDriverReady(pointingDriver);
    }
  }, [onPointingDriverReady, pointingDriver]);

  // 1. Primary animation state and drag lifecycle updates
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const targets = resolveRigElements(svgEl);
    targetsRef.current = targets;

    const isReducedMotion = isPrefersReducedMotion();

    const buildContext: AnimationBuildContext = {
      scope: svgEl,
      targets,
      anchors,
      isReducedMotion,
      expression,
    };

    controllerRef.current?.updateState(buildContext, animationState, isDragging, {
      companionPosition: latestPositionRef.current,
      onPointingStop,
    });
  }, [svgRef, animationState, expression, isDragging, anchors, onPointingStop]);

  // 2. Keep pointing coordinates calibrated when docked/repositioned
  useEffect(() => {
    controllerRef.current?.updateCompanionPosition(companionPosition);
  }, [companionPosition]);

  // 3. Synchronize declarative pointingTarget prop changes without interfering with imperative driver calls
  useEffect(() => {
    const prev = prevPointingTargetPropRef.current;
    prevPointingTargetPropRef.current = pointingTarget;

    if (pointingTarget) {
      controllerRef.current?.pointAt(pointingTarget);
    } else if (prev !== undefined && prev !== null) {
      controllerRef.current?.stopPointing(false);
    }
  }, [pointingTarget]);

  // 4. Unmount cleanup
  useEffect(() => {
    const controller = controllerRef.current;
    return () => {
      controller?.cleanup(targetsRef.current ?? undefined);
    };
  }, []);

  return { talkingDriver, pointingDriver };
}
