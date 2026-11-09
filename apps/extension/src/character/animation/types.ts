import type { gsap } from 'gsap';
import type {
  CharacterAnchorCoordinates,
  CharacterAnimationState,
  CharacterExpression,
  CharacterLayerId,
} from '@webmate/shared';

/**
 * References to animatable layer group elements within the SVG CharacterRig.
 */
export interface CharacterRigLayerElements {
  /** Root `<g id="shinchan-rig-root">` group */
  root: SVGGElement | null;
  /** `#layer-shadow`: Ground drop shadow ellipse */
  shadow: SVGGElement | null;
  /** `#layer-leg-left`: Background left leg */
  legLeft: SVGGElement | null;
  /** `#layer-arm-left`: Background left arm */
  armLeft: SVGGElement | null;
  /** `#layer-leg-right`: Foreground right leg */
  legRight: SVGGElement | null;
  /** `#layer-body`: Torso, t-shirt, and shorts */
  body: SVGGElement | null;
  /** `#layer-arm-right`: Foreground articulated right arm */
  armRight: SVGGElement | null;
  /** `#layer-head`: Head contour and hair */
  head: SVGGElement | null;
  /** `#layer-blush`: Cheek blush overlay */
  blush: SVGGElement | null;
  /** `#layer-eyebrows`: Left and right eyebrows */
  eyebrows: SVGGElement | null;
  /** `#layer-eyes`: Sclera and pupil layers */
  eyes: SVGGElement | null;
  /** `#layer-mouth`: Swappable mouth shapes */
  mouth: SVGGElement | null;
  /** `#layer-fx`: Emotional overlays (Zzz, sparkles, sweat drop) */
  fx: SVGGElement | null;
}

/**
 * Coordinate dictionary of pivot anchors mapped from character.manifest.json.
 */
export type RigAnchors = Record<string, CharacterAnchorCoordinates>;

/**
 * Contextual configuration passed into state-specific timeline builder functions.
 */
export interface AnimationBuildContext {
  /** Scope container element for GSAP context scoping */
  scope: SVGSVGElement | SVGGElement;
  /** Resolved layer elements inside the SVG rig */
  targets: CharacterRigLayerElements;
  /** Semantic pivot anchor coordinates */
  anchors: RigAnchors;
  /** Whether prefers-reduced-motion is enabled in system/browser */
  isReducedMotion: boolean;
  /** Current static facial expression */
  expression: CharacterExpression;
}

/**
 * Factory signature for procedural animation timeline builders.
 */
export type AnimationTimelineBuilder = (
  ctx: AnimationBuildContext
) => gsap.core.Timeline | null;

/**
 * Event-driven mouth animation interface for future AI text-stream token integration.
 *
 * NOTE: Paces mouth shape pulses to incoming text tokens rather than continuous rhythmic
 * mouth oscillation or true audio lip-sync.
 */
export interface TalkingAnimationDriver {
  /** Triggers an event-driven mouth pulse when speaking is active and companion is not being dragged */
  pushSpeechToken: (token?: string) => void;
  /** Activates the speaking lifecycle */
  startSpeaking: () => void;
  /** Deactivates speaking and settles the mouth to its neutral resting pose */
  stopSpeaking: () => void;
  /** Reports speaking lifecycle state */
  isSpeaking: () => boolean;
}

/**
 * Options configuring the character animation controller hook.
 */
export interface CharacterAnimationHookOptions {
  /** Ref to the SVG element hosting the character rig */
  svgRef: React.RefObject<SVGSVGElement | null>;
  /** High-level animation behavioral state */
  animationState: CharacterAnimationState;
  /** Current facial expression preset */
  expression?: CharacterExpression;
  /** Whether the companion is actively undergoing pointer drag */
  isDragging?: boolean;
  /** Anchor coordinates dictionary from manifest */
  anchors: RigAnchors;
  /** Optional callback providing access to the stable TalkingAnimationDriver interface */
  onTalkingDriverReady?: (driver: TalkingAnimationDriver) => void;
  /** Optional callback fired when animation transitions occur */
  onStateTransition?: (fromState: CharacterAnimationState, toState: CharacterAnimationState) => void;
}

