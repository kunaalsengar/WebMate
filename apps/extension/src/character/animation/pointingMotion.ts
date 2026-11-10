import gsap from 'gsap';
import { applyLayerAnchorPivots, MOTION_EASINGS } from './motionUtils';
import type { PointingPose } from './pointingGeometry';
import type { AnimationBuildContext } from './types';

/**
 * Configuration options when building or updating a GSAP pointing timeline.
 */
export interface PointingTimelineOptions {
  /**
   * True when updating from live scroll/resize/drag tracking so motion tracks fluidly
   * without repeating spring overshoot curves.
   */
  isTrackingUpdate?: boolean;
  /**
   * Forces immediate zero-duration placement (e.g. reduced-motion accessibility).
   */
  immediate?: boolean;
}

/**
 * Builds or applies the GSAP pointing pose onto the SVG character rig layers.
 *
 * Isolation guarantees:
 * - Never animates `eyes.scaleY` or `eyebrows.y` during tracking so organic eye blinking stays independent.
 * - Never animates `mouth.scaleX` or `mouth.scaleY` so `TalkingAnimationDriver` retains exclusive ownership.
 * - Under `isReducedMotion`, places layers cleanly into a static accessible pose via `gsap.set()`.
 */
export function buildPointingTimeline(
  ctx: AnimationBuildContext,
  pose: PointingPose,
  options: PointingTimelineOptions = {}
): gsap.core.Timeline | null {
  const { targets, anchors, isReducedMotion } = ctx;
  const { isTrackingUpdate = false, immediate = false } = options;

  applyLayerAnchorPivots(targets, anchors);

  if (isReducedMotion || immediate) {
    if (targets.armLeft) {
      gsap.set(targets.armLeft, {
        rotation: pose.armLeft.rotation ?? pose.armLeftRotation,
        x: pose.armLeft.x ?? 0,
        y: pose.armLeft.y ?? 0,
        scaleX: pose.armLeft.scaleX ?? 1,
        scaleY: pose.armLeft.scaleY ?? 1,
      });
    }
    if (targets.armRight) {
      gsap.set(targets.armRight, {
        rotation: pose.armRight.rotation ?? pose.armRightRotation,
        x: pose.armRight.x ?? 0,
        y: pose.armRight.y ?? 0,
        scaleX: pose.armRight.scaleX ?? 1,
        scaleY: pose.armRight.scaleY ?? 1,
      });
    }
    if (targets.body) {
      gsap.set(targets.body, {
        x: pose.body.x ?? 0,
        y: pose.body.y ?? 0,
        rotation: pose.body.rotation ?? 0,
        scaleX: 1,
        scaleY: 1,
      });
    }
    if (targets.head) {
      gsap.set(targets.head, {
        x: pose.head.x ?? 0,
        y: pose.head.y ?? 0,
        rotation: pose.head.rotation ?? 0,
      });
    }
    if (targets.blush) {
      gsap.set(targets.blush, {
        x: pose.blush.x ?? 0,
        y: pose.blush.y ?? 0,
        rotation: pose.blush.rotation ?? 0,
      });
    }
    if (targets.fx) {
      gsap.set(targets.fx, {
        x: pose.fx.x ?? 0,
        y: pose.fx.y ?? 0,
        rotation: pose.fx.rotation ?? 0,
      });
    }
    if (targets.eyebrows) {
      gsap.set(targets.eyebrows, {
        x: pose.eyebrows.x ?? 0,
        y: 0,
        rotation: pose.eyebrows.rotation ?? 0,
      });
    }
    if (targets.eyes) {
      gsap.set(targets.eyes, {
        x: pose.eyes.x ?? 0,
        y: pose.eyes.y ?? 0,
        rotation: pose.eyes.rotation ?? 0,
      });
    }
    if (targets.mouth) {
      gsap.set(targets.mouth, {
        x: pose.mouth.x ?? 0,
        y: pose.mouth.y ?? 0,
        rotation: pose.mouth.rotation ?? 0,
      });
    }
    if (targets.shadow) {
      gsap.set(targets.shadow, {
        x: pose.shadow.x ?? 0,
        scaleX: 1,
        opacity: 1,
      });
    }
    return null;
  }

  const tl = gsap.timeline();
  const armDuration = isTrackingUpdate ? 0.14 : 0.34;
  const poseDuration = isTrackingUpdate ? 0.14 : 0.28;
  const pointingArmEase = isTrackingUpdate ? MOTION_EASINGS.snappy : MOTION_EASINGS.backOut;
  const bodyPoseEase = MOTION_EASINGS.smooth;

  if (targets.armLeft) {
    tl.to(
      targets.armLeft,
      {
        rotation: pose.armLeft.rotation ?? pose.armLeftRotation,
        x: pose.armLeft.x ?? 0,
        y: pose.armLeft.y ?? 0,
        scaleX: pose.armLeft.scaleX ?? 1,
        scaleY: pose.armLeft.scaleY ?? 1,
        duration: armDuration,
        ease: pose.arm === 'left' ? pointingArmEase : bodyPoseEase,
      },
      0
    );
  }

  if (targets.armRight) {
    tl.to(
      targets.armRight,
      {
        rotation: pose.armRight.rotation ?? pose.armRightRotation,
        x: pose.armRight.x ?? 0,
        y: pose.armRight.y ?? 0,
        scaleX: pose.armRight.scaleX ?? 1,
        scaleY: pose.armRight.scaleY ?? 1,
        duration: armDuration,
        ease: pose.arm === 'right' ? pointingArmEase : bodyPoseEase,
      },
      0
    );
  }

  if (targets.body) {
    tl.to(
      targets.body,
      {
        x: pose.body.x ?? 0,
        y: pose.body.y ?? 0,
        rotation: pose.body.rotation ?? 0,
        scaleX: 1,
        scaleY: 1,
        duration: poseDuration,
        ease: bodyPoseEase,
      },
      0
    );
  }

  if (targets.head) {
    tl.to(
      targets.head,
      {
        x: pose.head.x ?? 0,
        y: pose.head.y ?? 0,
        rotation: pose.head.rotation ?? 0,
        duration: poseDuration,
        ease: bodyPoseEase,
      },
      0
    );
  }

  if (targets.blush) {
    tl.to(
      targets.blush,
      {
        x: pose.blush.x ?? 0,
        y: pose.blush.y ?? 0,
        rotation: pose.blush.rotation ?? 0,
        duration: poseDuration,
        ease: bodyPoseEase,
      },
      0
    );
  }

  if (targets.fx) {
    tl.to(
      targets.fx,
      {
        x: pose.fx.x ?? 0,
        y: pose.fx.y ?? 0,
        rotation: pose.fx.rotation ?? 0,
        duration: poseDuration,
        ease: bodyPoseEase,
      },
      0
    );
  }

  if (targets.eyebrows) {
    tl.to(
      targets.eyebrows,
      {
        x: pose.eyebrows.x ?? 0,
        rotation: pose.eyebrows.rotation ?? 0,
        duration: poseDuration,
        ease: bodyPoseEase,
      },
      0
    );
  }

  if (targets.eyes) {
    tl.to(
      targets.eyes,
      {
        x: pose.eyes.x ?? 0,
        y: pose.eyes.y ?? 0,
        rotation: pose.eyes.rotation ?? 0,
        duration: poseDuration,
        ease: bodyPoseEase,
      },
      0
    );
  }

  if (targets.mouth) {
    tl.to(
      targets.mouth,
      {
        x: pose.mouth.x ?? 0,
        y: pose.mouth.y ?? 0,
        rotation: pose.mouth.rotation ?? 0,
        duration: poseDuration,
        ease: bodyPoseEase,
      },
      0
    );
  }

  if (targets.shadow) {
    tl.to(
      targets.shadow,
      {
        x: pose.shadow.x ?? 0,
        scaleX: 1,
        opacity: 1,
        duration: poseDuration,
        ease: bodyPoseEase,
      },
      0
    );
  }

  return tl;
}

/**
 * Smoothly restores pointing-modified layers back to neutral pose (or snaps immediately
 * when `isReducedMotion` is enabled) without disturbing speech mouth scale or blinking.
 */
export function buildPointingResetTimeline(
  ctx: AnimationBuildContext,
  onComplete?: () => void
): gsap.core.Timeline | null {
  const { targets, isReducedMotion } = ctx;

  if (isReducedMotion) {
    const resetTargets = [
      targets.armLeft,
      targets.armRight,
      targets.body,
      targets.head,
      targets.blush,
      targets.fx,
      targets.eyes,
      targets.mouth,
    ].filter((el): el is SVGGElement => Boolean(el));

    if (resetTargets.length > 0) {
      gsap.set(resetTargets, { x: 0, y: 0, rotation: 0 });
    }
    const scaleResetArms = [targets.armLeft, targets.armRight].filter(
      (el): el is SVGGElement => Boolean(el)
    );
    if (scaleResetArms.length > 0) {
      gsap.set(scaleResetArms, { scaleX: 1, scaleY: 1 });
    }
    if (targets.eyebrows) {
      gsap.set(targets.eyebrows, { x: 0, rotation: 0 });
    }
    if (targets.shadow) {
      gsap.set(targets.shadow, { x: 0 });
    }

    onComplete?.();
    return null;
  }

  const tl = gsap.timeline({ onComplete });
  const duration = 0.24;
  const ease = MOTION_EASINGS.smooth;

  const fullResetTargets = [
    targets.armLeft,
    targets.armRight,
    targets.body,
    targets.head,
    targets.blush,
    targets.fx,
    targets.eyes,
    targets.mouth,
  ].filter((el): el is SVGGElement => Boolean(el));

  if (fullResetTargets.length > 0) {
    tl.to(fullResetTargets, { x: 0, y: 0, rotation: 0, duration, ease }, 0);
  }

  const scaleResetArms = [targets.armLeft, targets.armRight].filter(
    (el): el is SVGGElement => Boolean(el)
  );
  if (scaleResetArms.length > 0) {
    tl.to(scaleResetArms, { scaleX: 1, scaleY: 1, duration, ease }, 0);
  }

  if (targets.eyebrows) {
    tl.to(targets.eyebrows, { x: 0, rotation: 0, duration, ease }, 0);
  }

  if (targets.shadow) {
    tl.to(targets.shadow, { x: 0, duration, ease }, 0);
  }

  return tl;
}

