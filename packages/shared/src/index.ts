/**
 * @webmate/shared
 *
 * Shared TypeScript definitions, interfaces, and protocol contracts across the
 * WebMate Chrome extension and backend API services.
 *
 * NOTE: This package defines data contracts for upcoming phases.
 * Concrete implementations will be added in Phases 1-4.
 */

/**
 * Facial expressions for the WebMate companion rig.
 *
 * NOTE: 'talking' (stream-triggered mouth oscillation) and 'sleeping' (slumped
 * posture with snot bubble and Zzz FX) are behavioral/display states rather
 * than strictly static facial expressions. They are included here as visual
 * preset targets alongside pure facial expressions.
 */
export type CharacterExpression =
  | 'normal'
  | 'happy'
  | 'thinking'
  | 'surprised'
  | 'confused'
  | 'explaining'
  | 'talking'
  | 'sleeping';

/**
 * 8 Technical Animation States for procedural and timeline playback.
 * Kept strictly separate from facial expressions to enable composable motion.
 */
export type CharacterAnimationState =
  | 'idle'
  | 'blinking'
  | 'waving'
  | 'thinking'
  | 'explaining'
  | 'talking'
  | 'happy'
  | 'sleeping';

/**
 * High-level character state union for the extension state store.
 * Preserves complete backward compatibility with Phase 0 definitions.
 */
export type CharacterState = CharacterAnimationState | 'pointing' | 'surprised' | 'confused';

/**
 * Horizontal edge docking orientation for the floating companion container.
 */
export type DockSide = 'left' | 'right';

/**
 * Coordinate position and docking configuration for the floating companion.
 */
export interface CompanionPosition {
  x: number;
  y: number;
  dockSide: DockSide;
}

/**
 * Schema for companion positioning persisted in chrome.storage.local.
 * Includes proportional vertical offset for responsive window height restoration.
 */
export interface StoredCompanionPosition {
  x: number;
  y: number;
  dockSide: DockSide;
  relativeY: number;
  updatedAt: number;
}

/**
 * Structural definition for character rig anchor coordinates (pivot points).
 */
export interface CharacterAnchorCoordinates {
  x: number;
  y: number;
}

/**
 * Canonical layer IDs for the 12-slot articulated WebMate vector rig.
 */
export type CharacterLayerId =
  | 'layer-shadow'
  | 'layer-leg-left'
  | 'layer-leg-right'
  | 'layer-body'
  | 'layer-arm-left'
  | 'layer-arm-right'
  | 'layer-head'
  | 'layer-blush'
  | 'layer-eyebrows'
  | 'layer-eyes'
  | 'layer-mouth'
  | 'layer-fx';

/**
 * Metadata definition for an articulated vector rig layer.
 */
export interface CharacterLayerDefinition {
  id: string;
  zIndex: number;
  source?: string;
  anchor?: string;
  dynamic?: boolean;
  description?: string;
}

/**
 * Character manifest describing layer topology and anchor points.
 */
export interface CharacterManifest {
  name: string;
  version: string;
  viewBox: string;
  anchors: Record<string, CharacterAnchorCoordinates>;
  layers: CharacterLayerDefinition[];
}

/**
 * Configuration schema for an individual facial expression preset.
 */
export interface CharacterExpressionConfig {
  id: CharacterExpression;
  label: string;
  eyebrowsVariant: string;
  eyesVariant: string;
  mouthVariant: string;
  blushOpacity: number;
  fxVariant: string | null;
  headTiltDeg: number;
  description: string;
}

/**
 * Character rig base dimensions (conforming to character.manifest.json viewBox "0 0 200 250").
 */
export const CHARACTER_BASE_WIDTH = 200;
export const CHARACTER_BASE_HEIGHT = 250;

/**
 * Standard scale factor for the CharacterRig in the floating companion.
 */
export const CHARACTER_RIG_SCALE = 0.65;

/**
 * Rendered dimensions for the scaled CharacterRig (130×163 px).
 */
export const CHARACTER_RENDERED_WIDTH = Math.round(CHARACTER_BASE_WIDTH * CHARACTER_RIG_SCALE); // 130
export const CHARACTER_RENDERED_HEIGHT = Math.round(CHARACTER_BASE_HEIGHT * CHARACTER_RIG_SCALE); // 163

/**
 * Pixel dimensions for the companion card badge (conforming to CompanionPlaceholder).
 */
export const COMPANION_CARD_WIDTH = 232;
export const COMPANION_CARD_HEIGHT = 68;

/**
 * Composite pixel dimensions of the entire floating companion component
 * (130×163px CharacterRig stacked vertically directly above 232×68px CompanionCard = 232×231px).
 */
export const COMPOSITE_COMPANION_WIDTH = Math.max(CHARACTER_RENDERED_WIDTH, COMPANION_CARD_WIDTH); // 232
export const COMPOSITE_COMPANION_HEIGHT = CHARACTER_RENDERED_HEIGHT + COMPANION_CARD_HEIGHT; // 231

/**
 * Canonical companion dimensions for positioning, clamping, and edge docking calculations.
 */
export const COMPANION_WIDTH = COMPOSITE_COMPANION_WIDTH;
export const COMPANION_HEIGHT = COMPOSITE_COMPANION_HEIGHT;

/**
 * Runtime configuration contract for the CharacterRig component.
 */
export interface CharacterRigConfig {
  expression: CharacterExpression;
  animationState: CharacterAnimationState;
  scale: number;
  showDevRig?: boolean;
}

/**
 * Standardized message envelope for internal Chrome runtime messaging
 * between Content Scripts, Shadow DOM injected UI, and Background Service Worker.
 */
export interface ExtensionMessage<T = unknown> {
  type: string;
  payload: T;
  source: 'content-script' | 'popup' | 'background' | 'shadow-dom';
  timestamp: number;
}

/**
 * Standardized API response format for backend endpoints.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}

/**
 * Health check status response structure.
 */
export interface HealthStatus {
  status: 'ok' | 'degraded' | 'down';
  service: string;
  version: string;
  timestamp: string;
}

/**
 * Page analysis request payload contract (Planned for Phase 4).
 */
export interface PageAnalysisRequest {
  url: string;
  title: string;
  selectedText?: string;
  metaDescription?: string;
}

/**
 * Element inspection request contract (Planned for Phase 4).
 */
export interface ElementInspectionRequest {
  selector?: string;
  tagName: string;
  innerText: string;
  attributes: Record<string, string>;
  boundingBox?: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}
