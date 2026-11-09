/**
 * WebMate Articulated Character Animation Subsystem
 *
 * Provides a modular, GSAP-powered procedural animation engine for the WebMate CharacterRig:
 * - Controller: Coordinates state transitions, speech token pacing, and periodic blinking.
 * - Definitions: Procedural GSAP timelines for all 8 canonical animation states.
 * - Lifecycle: Safe GSAP context scoping, interruption handling, and clean unmount teardown.
 * - Utilities: Anchor-based transform origin calibration and prefers-reduced-motion safety.
 */

export * from './types';
export * from './motionUtils';
export * from './definitions';
export * from './lifecycle';
export * from './controller';

