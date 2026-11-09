import gsap from 'gsap';
import { MOTION_EASINGS } from './motionUtils';
import type { AnimationBuildContext, AnimationTimelineBuilder } from './types';

/**
 * 1. IDLE ANIMATION
 * Subtle continuous breathing, gentle vertical bobbing, and shadow contraction.
 */
export const buildIdleTimeline: AnimationTimelineBuilder = (ctx: AnimationBuildContext) => {
  const { targets, isReducedMotion } = ctx;
  const tl = gsap.timeline({ repeat: isReducedMotion ? 0 : -1, yoyo: true });

  if (isReducedMotion) {
    if (targets.body) tl.to(targets.body, { y: 0, duration: 0.1 });
    return tl;
  }

  // Torso subtle breathing bob
  if (targets.body) {
    tl.to(
      targets.body,
      {
        y: -3,
        duration: 2.0,
        ease: MOTION_EASINGS.smooth,
      },
      0
    );
  }

  // Head follows with gentle delayed micro-bob and tilt
  if (targets.head) {
    tl.to(
      targets.head,
      {
        y: -3.5,
        rotation: 1.2,
        duration: 2.0,
        ease: MOTION_EASINGS.smooth,
      },
      0.08
    );
  }

  // Arms subtle natural sway
  if (targets.armLeft) {
    tl.to(
      targets.armLeft,
      {
        rotation: -2,
        duration: 2.0,
        ease: MOTION_EASINGS.smooth,
      },
      0
    );
  }
  if (targets.armRight) {
    tl.to(
      targets.armRight,
      {
        rotation: 2.5,
        duration: 2.0,
        ease: MOTION_EASINGS.smooth,
      },
      0
    );
  }

  // Ground shadow contracts slightly at apex of breathing
  if (targets.shadow) {
    tl.to(
      targets.shadow,
      {
        scaleX: 0.94,
        opacity: 0.85,
        duration: 2.0,
        ease: MOTION_EASINGS.smooth,
      },
      0
    );
  }

  return tl;
};

/**
 * 2. BLINKING ANIMATION
 * Quick procedural squash and stretch of the eyelids and pupil group.
 */
export const buildBlinkTimeline: AnimationTimelineBuilder = (ctx: AnimationBuildContext) => {
  const { targets, isReducedMotion } = ctx;
  if (!targets.eyes || isReducedMotion) return null;

  const tl = gsap.timeline();

  // Rapid eyelid squash
  tl.to(targets.eyes, {
    scaleY: 0.08,
    duration: 0.09,
    ease: MOTION_EASINGS.blink,
  });

  // Micro eyebrow dip accompanying eyelid descent
  if (targets.eyebrows) {
    tl.to(
      targets.eyebrows,
      {
        y: 0.8,
        duration: 0.09,
        ease: MOTION_EASINGS.blink,
      },
      0
    );
  }

  // Quick eyelid reopening
  tl.to(targets.eyes, {
    scaleY: 1.0,
    duration: 0.12,
    ease: MOTION_EASINGS.snappy,
  });

  if (targets.eyebrows) {
    tl.to(
      targets.eyebrows,
      {
        y: 0,
        duration: 0.12,
        ease: MOTION_EASINGS.snappy,
      },
      0.09
    );
  }

  return tl;
};

/**
 * 3. WAVING ANIMATION
 * Greeting gesture articulates right arm around shoulder pivot with natural lateral wave.
 */
export const buildWavingTimeline: AnimationTimelineBuilder = (ctx: AnimationBuildContext) => {
  const { targets, isReducedMotion } = ctx;
  const tl = gsap.timeline();

  if (isReducedMotion) {
    // Avoid non-essential arm movement and lateral wave; return static timeline
    return tl;
  }

  // Lift arm to greeting height
  if (targets.armRight) {
    tl.to(targets.armRight, {
      rotation: 52,
      duration: 0.38,
      ease: MOTION_EASINGS.backOut,
    });
  }

  // Friendly slight head tilt
  if (targets.head) {
    tl.to(
      targets.head,
      {
        rotation: -4,
        y: -1.5,
        duration: 0.38,
        ease: MOTION_EASINGS.smooth,
      },
      0
    );
  }

  // Perform 3 oscillating waves
  if (targets.armRight) {
    tl.to(targets.armRight, { rotation: 32, duration: 0.18, ease: MOTION_EASINGS.smooth })
      .to(targets.armRight, { rotation: 54, duration: 0.18, ease: MOTION_EASINGS.smooth })
      .to(targets.armRight, { rotation: 32, duration: 0.18, ease: MOTION_EASINGS.smooth })
      .to(targets.armRight, { rotation: 54, duration: 0.18, ease: MOTION_EASINGS.smooth })
      .to(targets.armRight, { rotation: 40, duration: 0.22, ease: MOTION_EASINGS.smooth });
  }

  // Head gently recenters
  if (targets.head) {
    tl.to(
      targets.head,
      {
        rotation: 0,
        y: 0,
        duration: 0.3,
        ease: MOTION_EASINGS.smooth,
      },
      '-=0.2'
    );
  }

  return tl;
};

/**
 * 4. THINKING ANIMATION
 * Pensive pose with head tilt, contemplative chin gesture, and slow subtle breathing.
 */
export const buildThinkingTimeline: AnimationTimelineBuilder = (ctx: AnimationBuildContext) => {
  const { targets, isReducedMotion } = ctx;
  const tl = gsap.timeline();

  if (isReducedMotion) {
    // Avoid non-essential head, arm, body and eyebrow movement; return static timeline
    return tl;
  }

  // Head tilt around neck pivot
  if (targets.head) {
    tl.to(
      targets.head,
      {
        rotation: 9,
        y: -1,
        duration: 0.45,
        ease: MOTION_EASINGS.smooth,
      },
      0
    );
  }

  // Right arm elevates toward chin
  if (targets.armRight) {
    tl.to(
      targets.armRight,
      {
        rotation: -38,
        duration: 0.45,
        ease: MOTION_EASINGS.backOut,
      },
      0
    );
  }

  // Eyebrows furrow slightly
  if (targets.eyebrows) {
    tl.to(
      targets.eyebrows,
      {
        y: -1.5,
        rotation: 2.5,
        duration: 0.4,
        ease: MOTION_EASINGS.smooth,
      },
      0
    );
  }

  // Subtle breathing loop while in thinking pose
  if (targets.body) {
    tl.to(
      targets.body,
      {
        y: -2,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: MOTION_EASINGS.smooth,
      },
      0.45
    );
  }

  return tl;
};

/**
 * 5. EXPLAINING ANIMATION
 * Expressive communicative posture with directional gesture and rhythmic nods.
 */
export const buildExplainingTimeline: AnimationTimelineBuilder = (ctx: AnimationBuildContext) => {
  const { targets, isReducedMotion } = ctx;
  const tl = gsap.timeline();

  if (isReducedMotion) {
    // Avoid non-essential head, arm, body and eyebrow movement; return static timeline
    return tl;
  }

  // Body leans subtly forward into presentation
  if (targets.body) {
    tl.to(
      targets.body,
      {
        x: 1.5,
        y: -1,
        duration: 0.35,
        ease: MOTION_EASINGS.smooth,
      },
      0
    );
  }

  // Right arm gestures outward toward presentation space
  if (targets.armRight) {
    tl.to(
      targets.armRight,
      {
        rotation: -28,
        duration: 0.4,
        ease: MOTION_EASINGS.backOut,
      },
      0
    );
  }

  // Head nods in affirmative cadence
  if (targets.head) {
    tl.to(
      targets.head,
      {
        rotation: -3,
        y: 1.2,
        duration: 0.35,
        ease: MOTION_EASINGS.smooth,
      },
      0
    );
  }

  // Communicative rhythmic arm inflection loop
  if (targets.armRight) {
    tl.to(
      targets.armRight,
      {
        rotation: -35,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: MOTION_EASINGS.smooth,
      },
      0.4
    );
  }

  return tl;
};

/**
 * 6. TALKING ANIMATION
 * Conversational presence (gentle head and eyebrow cadence) while mouth articulation
 * is driven strictly by incoming speech-stream token events via TalkingAnimationDriver.
 *
 * NOTE: The mouth element is initialized to neutral resting pose ({ scaleY: 1.0, scaleX: 1.0 })
 * exactly once using gsap.set() outside the timeline. The primary talking timeline never animates
 * targets.mouth or its scale properties, ensuring the speech driver is the sole owner of mouth animation.
 */
export const buildTalkingTimeline: AnimationTimelineBuilder = (ctx: AnimationBuildContext) => {
  const { targets, isReducedMotion } = ctx;

  // Initialize mouth to neutral resting pose exactly once outside the timeline
  if (targets.mouth) {
    gsap.set(targets.mouth, { scaleY: 1.0, scaleX: 1.0 });
  }

  const tl = gsap.timeline({ repeat: isReducedMotion ? 0 : -1 });

  if (isReducedMotion) {
    return tl;
  }

  // Subtle conversational head bob
  if (targets.head) {
    tl.to(
      targets.head,
      {
        y: 1.2,
        duration: 0.26,
        repeat: 1,
        yoyo: true,
        ease: MOTION_EASINGS.smooth,
      },
      0
    );
  }

  // Eyebrow conversational inflection pulse
  if (targets.eyebrows) {
    tl.to(
      targets.eyebrows,
      {
        y: -1.2,
        duration: 0.2,
        repeat: 1,
        yoyo: true,
        ease: MOTION_EASINGS.smooth,
      },
      0
    );
  }

  return tl;
};

/**
 * 7. HAPPY ANIMATION
 * Joyful bounce reaction with spring dynamics, raised celebration arms, and shadow sync.
 */
export const buildHappyTimeline: AnimationTimelineBuilder = (ctx: AnimationBuildContext) => {
  const { targets, isReducedMotion } = ctx;
  const tl = gsap.timeline();

  if (isReducedMotion) {
    // Avoid non-essential hop, bounce and arm swings; return static timeline
    return tl;
  }

  // Anticipatory compression crouch
  if (targets.body) {
    tl.to(targets.body, {
      y: 2,
      scaleY: 0.95,
      duration: 0.1,
      ease: MOTION_EASINGS.gentle,
    });
  }

  // Joyful vertical hop
  if (targets.body) {
    tl.to(targets.body, {
      y: -11,
      scaleY: 1.05,
      duration: 0.28,
      ease: MOTION_EASINGS.backOut,
    });
  }

  // Arms swing upward in celebration
  if (targets.armLeft) {
    tl.to(
      targets.armLeft,
      {
        rotation: -42,
        duration: 0.28,
        ease: MOTION_EASINGS.backOut,
      },
      '-=0.28'
    );
  }
  if (targets.armRight) {
    tl.to(
      targets.armRight,
      {
        rotation: 45,
        duration: 0.28,
        ease: MOTION_EASINGS.backOut,
      },
      '-=0.28'
    );
  }

  // Shadow contracts during apex of hop
  if (targets.shadow) {
    tl.to(
      targets.shadow,
      {
        scaleX: 0.8,
        opacity: 0.6,
        duration: 0.28,
        ease: MOTION_EASINGS.smooth,
      },
      '-=0.28'
    );
  }

  // Settle back to ground with spring bounce
  if (targets.body) {
    tl.to(targets.body, {
      y: 0,
      scaleY: 1.0,
      duration: 0.42,
      ease: MOTION_EASINGS.bounceOut,
    });
  }
  if (targets.shadow) {
    tl.to(
      targets.shadow,
      {
        scaleX: 1.0,
        opacity: 1.0,
        duration: 0.38,
        ease: MOTION_EASINGS.smooth,
      },
      '-=0.42'
    );
  }

  // Arms return to resting pose
  if (targets.armLeft) {
    tl.to(targets.armLeft, { rotation: 0, duration: 0.35, ease: MOTION_EASINGS.smooth }, '-=0.35');
  }
  if (targets.armRight) {
    tl.to(targets.armRight, { rotation: 0, duration: 0.35, ease: MOTION_EASINGS.smooth }, '-=0.35');
  }

  return tl;
};

/**
 * 8. SLEEPING ANIMATION
 * Relaxed posture with slumped torso, drooping head, and slow deep breathing cycle.
 */
export const buildSleepingTimeline: AnimationTimelineBuilder = (ctx: AnimationBuildContext) => {
  const { targets, isReducedMotion } = ctx;
  const tl = gsap.timeline();

  // Torso slumps downward
  if (targets.body) {
    tl.to(
      targets.body,
      {
        y: 4.5,
        duration: 0.6,
        ease: MOTION_EASINGS.smooth,
      },
      0
    );
  }

  // Head droops forward and tilts
  if (targets.head) {
    tl.to(
      targets.head,
      {
        y: 6.5,
        rotation: -7.5,
        duration: 0.6,
        ease: MOTION_EASINGS.smooth,
      },
      0
    );
  }

  // Arms hang relaxed
  if (targets.armLeft) {
    tl.to(targets.armLeft, { rotation: -6, duration: 0.6, ease: MOTION_EASINGS.smooth }, 0);
  }
  if (targets.armRight) {
    tl.to(targets.armRight, { rotation: 7, duration: 0.6, ease: MOTION_EASINGS.smooth }, 0);
  }

  // Very slow rhythmic breathing cycle
  if (!isReducedMotion && targets.body) {
    tl.to(
      targets.body,
      {
        y: 2.5,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: MOTION_EASINGS.smooth,
      },
      0.6
    );
  }

  return tl;
};

/**
 * Registry mapping all 8 CharacterAnimationState names to their respective timeline builders.
 */
export const ANIMATION_BUILDERS: Record<string, AnimationTimelineBuilder> = {
  idle: buildIdleTimeline,
  blinking: buildBlinkTimeline,
  waving: buildWavingTimeline,
  thinking: buildThinkingTimeline,
  explaining: buildExplainingTimeline,
  talking: buildTalkingTimeline,
  happy: buildHappyTimeline,
  sleeping: buildSleepingTimeline,
};

