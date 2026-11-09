/**
 * @webmate/shared
 *
 * Shared TypeScript definitions, interfaces, and protocol contracts across the
 * WebMate Chrome extension and backend API services.
 *
 * NOTE: This package defines data contracts for future phases.
 * Concrete implementations will be added in Phases 1-4.
 */

/**
 * High-level emotional and behavioral states for the companion character.
 * Planned for character animation driver in Phase 2.
 */
export type CharacterState =
  | 'idle'
  | 'thinking'
  | 'talking'
  | 'pointing'
  | 'happy'
  | 'surprised'
  | 'confused';

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
