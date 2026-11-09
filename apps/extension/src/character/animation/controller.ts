import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { buildBlinkTimeline } from './definitions';
import { AnimationLifecycleManager } from './lifecycle';
import { isPrefersReducedMotion, resolveRigElements } from './motionUtils';
import type {
  AnimationBuildContext,
  CharacterAnimationHookOptions,
  CharacterRigLayerElements,
  TalkingAnimationDriver,
} from './types';

/**
 * Controller class coordinating high-level animation states, natural periodic blinking,
 * event-driven talking cadence, drag pause/resume, and GSAP lifecycle.
 */
export class CharacterAnimationController {
  private lifecycle = new AnimationLifecycleManager();
  private blinkTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private isSpeakingActive = false;
  private isDraggingActive = false;
  private isReducedMotion = false;
  private speechPulseTween: gsap.core.Tween | null = null;
  private speechSettleTween: gsap.core.Tween | null = null;
  private lastState: string | null = null;

  /**
   * Updates playback state when props or viewport environment changes.
   */
  public updateState(
    ctx: AnimationBuildContext,
    state: string,
    isDragging: boolean
  ): void {
    this.isDraggingActive = isDragging;
    this.isReducedMotion = ctx.isReducedMotion;

    // 1. Dragging optimization: pause animations and settle speech tweens to prioritize 60fps pointer dragging
    if (isDragging) {
      this.killSpeechTweens(true, ctx.targets);
      this.lifecycle.pause();
      this.clearBlinkTimer();
      return;
    } else {
      this.lifecycle.resume();
    }

    // 2. Kill or safely settle speech tweens on state changes so they don't compete with primary timeline
    if (this.lastState !== null && this.lastState !== state) {
      if (this.lastState === 'talking' && state !== 'talking') {
        this.isSpeakingActive = false;
      }
      this.killSpeechTweens(true, ctx.targets);
    }
    this.lastState = state;

    // 3. Play primary state timeline
    this.lifecycle.playState(state as any, ctx);

    // 4. Schedule periodic natural eye blinking if state allows
    this.scheduleNextBlink(ctx, state);
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
        // Do not animate mouth in reduced-motion mode; keep in neutral resting pose
        if (this.isReducedMotion || isPrefersReducedMotion()) {
          const targets = targetsProvider();
          if (targets?.mouth) {
            gsap.set(targets.mouth, { scaleY: 1.0, scaleX: 1.0 });
          }
          return;
        }

        // Only trigger a mouth pulse when speaking is active and the companion is not being dragged
        if (!this.isSpeakingActive || this.isDraggingActive) {
          return;
        }

        const targets = targetsProvider();
        if (!targets || !targets.mouth) return;

        // Kill any previous active speech tweens before triggering new pulse
        this.killSpeechTweens(false);

        // Quick organic mouth shape inflection timed with token arrival
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

        // Keep mouth in neutral resting pose in reduced-motion mode
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

        // Kill active pulse and previous settle tweens immediately
        this.killSpeechTweens(false);

        if (!targets || !targets.mouth) return;

        // If dragging or in reduced-motion mode, settle immediately without running a tween
        if (this.isDraggingActive || this.isReducedMotion || isPrefersReducedMotion()) {
          gsap.set(targets.mouth, { scaleY: 1.0, scaleX: 1.0 });
          return;
        }

        // Safely settle the mouth to its neutral pose
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
   * Schedules natural periodic eye blinking layered over continuous idle/talking poses.
   */
  private scheduleNextBlink(ctx: AnimationBuildContext, state: string): void {
    this.clearBlinkTimer();

    // Do not schedule automatic blinks during sleep, explicit blinking, or reduced motion
    if (state === 'sleeping' || state === 'blinking' || ctx.isReducedMotion) {
      return;
    }

    // Random interval between 3.5s and 6.0s for organic feeling
    const intervalMs = Math.floor(Math.random() * 2500) + 3500;

    this.blinkTimeoutId = setTimeout(() => {
      // Re-query targets to ensure elements are live
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
   * Cleans up all GSAP timelines and timers upon unmount.
   */
  public cleanup(targets?: CharacterRigLayerElements): void {
    this.clearBlinkTimer();
    this.isSpeakingActive = false;
    this.killSpeechTweens(true, targets);
    this.lifecycle.cleanup(targets);
    this.lastState = null;
    this.isDraggingActive = false;
    this.isReducedMotion = false;
  }
}

/**
 * Custom React hook binding CharacterRig SVG elements to the CharacterAnimationController.
 */
export function useCharacterAnimation(options: CharacterAnimationHookOptions): {
  talkingDriver: TalkingAnimationDriver;
} {
  const {
    svgRef,
    animationState,
    expression = 'normal',
    isDragging = false,
    anchors,
    onTalkingDriverReady,
  } = options;

  const controllerRef = useRef<CharacterAnimationController | null>(null);

  // Lazy-initialize controller instance
  if (!controllerRef.current) {
    controllerRef.current = new CharacterAnimationController();
  }

  const targetsRef = useRef<CharacterRigLayerElements | null>(null);

  // Talking driver interface exposed to parent components / stream consumers
  const talkingDriver = useMemo(() => {
    return controllerRef.current!.getTalkingDriver(() => targetsRef.current);
  }, []);

  // Expose stable talkingDriver to parent callback if supplied
  useEffect(() => {
    if (onTalkingDriverReady) {
      onTalkingDriverReady(talkingDriver);
    }
  }, [onTalkingDriverReady, talkingDriver]);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    // Resolve SVG layer elements
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

    const controller = controllerRef.current;
    if (controller) {
      controller.updateState(buildContext, animationState, isDragging);
    }

    return () => {
      if (controller) {
        controller.cleanup(targets);
      }
    };
  }, [svgRef, animationState, expression, isDragging, anchors]);

  return { talkingDriver };
}
