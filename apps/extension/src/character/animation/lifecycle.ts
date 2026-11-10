import gsap from 'gsap';
import { ANIMATION_BUILDERS } from './definitions';
import { applyLayerAnchorPivots, resetLayerTransforms } from './motionUtils';
import type { PointingPose } from './pointingGeometry';
import {
  buildPointingResetTimeline,
  buildPointingTimeline,
  type PointingTimelineOptions,
} from './pointingMotion';
import type { AnimationBuildContext, CharacterRigLayerElements } from './types';
import type { CharacterAnimationState } from '@webmate/shared';

/**
 * Manages GSAP animation lifecycle, state transitions, interruption safety,
 * duplicate prevention, pointing pose transitions, and clean unmount teardown.
 */
export class AnimationLifecycleManager {
  private activeContext: gsap.Context | null = null;
  private activeTimeline: gsap.core.Timeline | null = null;
  private overlayTimeline: gsap.core.Timeline | null = null;
  private pointingTimeline: gsap.core.Timeline | null = null;
  private currentState: CharacterAnimationState | null = null;
  private isPaused = false;

  /**
   * Plays a requested animation state timeline.
   *
   * Safety Guarantees:
   * - Prevents duplicate timelines if the requested state is already active.
   * - Safely kills and cleans up previous active timeline upon interruption.
   * - Reverts GSAP context on scope change.
   */
  public playState(
    state: CharacterAnimationState,
    ctx: AnimationBuildContext
  ): void {
    // 1. Avoid redundant duplicate initialization
    if (this.currentState === state && this.activeTimeline && this.activeTimeline.isActive()) {
      return;
    }

    // 2. Kill any currently running timelines safely
    this.killActiveTimelines();

    // 3. Clear previous context before opening a new scoped context
    if (this.activeContext) {
      this.activeContext.revert();
      this.activeContext = null;
    }

    // 4. Create scoped GSAP context on the container element
    this.activeContext = gsap.context(() => {
      // Ensure layer anchors and pivots are properly calibrated
      applyLayerAnchorPivots(ctx.targets, ctx.anchors);

      // Retrieve builder for requested state
      const builder = ANIMATION_BUILDERS[state];
      if (builder) {
        this.activeTimeline = builder(ctx);
        if (this.isPaused && this.activeTimeline) {
          this.activeTimeline.pause();
        }
      } else {
        // Fallback: reset to neutral resting pose
        resetLayerTransforms(ctx.targets);
      }
    }, ctx.scope);

    this.currentState = state;
  }

  /**
   * Plays a non-destructive secondary overlay animation (e.g. periodic eye blink)
   * on top of the primary body state timeline without interrupting it.
   */
  public playOverlay(
    builder: (ctx: AnimationBuildContext) => gsap.core.Timeline | null,
    ctx: AnimationBuildContext
  ): void {
    if (this.isPaused) return;

    if (this.overlayTimeline) {
      this.overlayTimeline.kill();
      this.overlayTimeline = null;
    }

    if (this.activeContext) {
      this.activeContext.add(() => {
        this.overlayTimeline = builder(ctx);
      });
    }
  }

  /**
   * Ensures an active GSAP context exists for scoped animation updates.
   */
  private ensureContext(ctx: AnimationBuildContext): gsap.Context {
    if (!this.activeContext) {
      this.activeContext = gsap.context(() => {
        applyLayerAnchorPivots(ctx.targets, ctx.anchors);
      }, ctx.scope);
    }
    return this.activeContext;
  }

  /**
   * Kills any running primary timeline without reverting GSAP transforms so the rig
   * can transition smoothly into a dynamic pointing pose.
   */
  public suspendPrimaryTimeline(): void {
    if (this.activeTimeline) {
      this.activeTimeline.kill();
      this.activeTimeline = null;
    }
    this.currentState = null;
  }

  /**
   * Transitions or updates the character rig into a target pointing pose.
   * Kills any prior pointing timeline before spawning the new one to avoid accumulation.
   */
  public playPointingPose(
    ctx: AnimationBuildContext,
    pose: PointingPose,
    options: PointingTimelineOptions = {}
  ): void {
    this.suspendPrimaryTimeline();
    this.killPointingTimeline();

    const context = this.ensureContext(ctx);
    context.add(() => {
      this.pointingTimeline = buildPointingTimeline(ctx, pose, options);
      if (this.isPaused && this.pointingTimeline) {
        this.pointingTimeline.pause();
      }
    });
  }

  /**
   * Smoothly resets pointing transforms back to neutral (or snaps in reduced-motion)
   * without disturbing unrelated secondary overlays or mouth speech scale.
   */
  public stopPointingPose(
    ctx: AnimationBuildContext,
    onComplete?: () => void
  ): void {
    this.killPointingTimeline();

    let resetCompletedSync = false;
    const context = this.ensureContext(ctx);
    context.add(() => {
      const tl = buildPointingResetTimeline(ctx, () => {
        if (this.pointingTimeline) {
          this.pointingTimeline = null;
          onComplete?.();
        } else {
          resetCompletedSync = true;
        }
      });
      this.pointingTimeline = tl;
      if (this.isPaused && this.pointingTimeline) {
        this.pointingTimeline.pause();
      }
    });

    if (resetCompletedSync) {
      this.pointingTimeline = null;
      onComplete?.();
    }
  }

  /**
   * Safely kills any active pointing transition timeline.
   */
  public killPointingTimeline(): void {
    if (this.pointingTimeline) {
      this.pointingTimeline.kill();
      this.pointingTimeline = null;
    }
  }

  /**
   * Pauses active timelines (e.g. when dragging starts or tab is backgrounded).
   */
  public pause(): void {
    this.isPaused = true;
    if (this.activeTimeline && this.activeTimeline.isActive()) {
      this.activeTimeline.pause();
    }
    if (this.overlayTimeline && this.overlayTimeline.isActive()) {
      this.overlayTimeline.pause();
    }
    if (this.pointingTimeline && this.pointingTimeline.isActive()) {
      this.pointingTimeline.pause();
    }
  }

  /**
   * Resumes paused timelines (e.g. when dragging finishes).
   */
  public resume(): void {
    this.isPaused = false;
    if (this.activeTimeline && this.activeTimeline.paused()) {
      this.activeTimeline.resume();
    }
    if (this.overlayTimeline && this.overlayTimeline.paused()) {
      this.overlayTimeline.resume();
    }
    if (this.pointingTimeline && this.pointingTimeline.paused()) {
      this.pointingTimeline.resume();
    }
  }

  /**
   * Returns current active animation state.
   */
  public getCurrentState(): CharacterAnimationState | null {
    return this.currentState;
  }

  /**
   * Safely kills and cleans up all active, overlay, and pointing timelines.
   */
  private killActiveTimelines(): void {
    if (this.activeTimeline) {
      this.activeTimeline.kill();
      this.activeTimeline = null;
    }
    if (this.overlayTimeline) {
      this.overlayTimeline.kill();
      this.overlayTimeline = null;
    }
    this.killPointingTimeline();
  }

  /**
   * Complete component unmount teardown.
   *
   * Reverts all GSAP inline styles, kills all active timelines, and releases
   * references to prevent memory leaks and zombie animation frames.
   */
  public cleanup(targets?: CharacterRigLayerElements): void {
    this.killActiveTimelines();

    if (this.activeContext) {
      this.activeContext.revert();
      this.activeContext = null;
    }

    if (targets) {
      resetLayerTransforms(targets);
    }

    this.currentState = null;
    this.isPaused = false;
  }
}

