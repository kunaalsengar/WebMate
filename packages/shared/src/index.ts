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
 * Facial expressions for the Shinchan companion rig.
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
 * Structural definition for character rig anchor coordinates (pivot points).
 */
export interface CharacterAnchorCoordinates {
  x: number;
  y: number;
}

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
