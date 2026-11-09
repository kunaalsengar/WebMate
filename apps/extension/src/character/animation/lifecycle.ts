import gsap from 'gsap';
import { ANIMATION_BUILDERS } from './definitions';
import { applyLayerAnchorPivots, resetLayerTransforms } from './motionUtils';
import type { AnimationBuildContext, CharacterRigLayerElements } from './types';
import type { CharacterAnimationState } from '@webmate/shared';

/**
 * Manages GSAP animation lifecycle, state transitions, interruption safety,
 * duplicate prevention, and clean unmount teardown for the character rig.
 */
export class AnimationLifecycleManager {
  private activeContext: gsap.Context | null = null;
  private activeTimeline: gsap.core.Timeline | null = null;
  private overlayTimeline: gsap.core.Timeline | null = null;
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
  }

  /**
   * Returns current active animation state.
   */
  public getCurrentState(): CharacterAnimationState | null {
    return this.currentState;
  }

  /**
   * Safely kills and cleans up all active and overlay timelines.
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

