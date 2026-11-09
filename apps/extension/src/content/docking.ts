import type { CompanionPosition, DockSide } from '@webmate/shared';

/**
 * Dimensions and layout constants for the WebMate floating companion.
 * Kept strictly in sync with CompanionPlaceholder dimensions.
 */
export const COMPANION_WIDTH = 232;
export const COMPANION_HEIGHT = 68;

/**
 * Screen margin constraint (in pixels).
 * Maintains a comfortable 16–24px spacing from viewport boundaries when docked.
 */
export const SCREEN_MARGIN = 20;

/**
 * Movement threshold (in pixels) required to distinguish an intentional drag gesture
 * from an in-place tap or click.
 */
export const DRAG_THRESHOLD_PX = 4;

/**
 * Calculates the default initial bottom-right docked position for a given viewport size.
 */
export function calculateDefaultPosition(
  viewportWidth: number,
  viewportHeight: number
): CompanionPosition {
  const x = Math.max(SCREEN_MARGIN, viewportWidth - COMPANION_WIDTH - SCREEN_MARGIN);
  const y = Math.max(SCREEN_MARGIN, viewportHeight - COMPANION_HEIGHT - 24);

  return {
    x,
    y,
    dockSide: 'right',
  };
}

/**
 * Clamps coordinates so that the companion remains fully within the visible viewport
 * during an active drag interaction.
 */
export function clampToViewport(
  x: number,
  y: number,
  viewportWidth: number,
  viewportHeight: number
): { x: number; y: number } {
  const maxX = Math.max(0, viewportWidth - COMPANION_WIDTH);
  const maxY = Math.max(0, viewportHeight - COMPANION_HEIGHT);

  return {
    x: Math.min(Math.max(x, 0), maxX),
    y: Math.min(Math.max(y, 0), maxY),
  };
}

/**
 * Snaps the companion to the nearest horizontal edge (left or right) upon release.
 * Preserves the vertical coordinate while clamping it to the safe viewport margin.
 */
export function calculateDockPosition(
  x: number,
  y: number,
  viewportWidth: number,
  viewportHeight: number
): CompanionPosition {
  // Determine nearest horizontal edge based on card horizontal midpoint
  const cardCenterX = x + COMPANION_WIDTH / 2;
  const isLeft = cardCenterX < viewportWidth / 2;
  const dockSide: DockSide = isLeft ? 'left' : 'right';

  // Calculate snapped horizontal coordinate
  const snappedX = isLeft
    ? SCREEN_MARGIN
    : Math.max(SCREEN_MARGIN, viewportWidth - COMPANION_WIDTH - SCREEN_MARGIN);

  // Preserve vertical position within screen margins
  const minY = SCREEN_MARGIN;
  const maxY = Math.max(minY, viewportHeight - COMPANION_HEIGHT - SCREEN_MARGIN);
  const snappedY = Math.min(Math.max(y, minY), maxY);

  return {
    x: snappedX,
    y: snappedY,
    dockSide,
  };
}

/**
 * Re-aligns a docked companion to updated viewport dimensions while strictly preserving
 * its existing dock side ('left' or 'right') and clamping its vertical coordinate.
 *
 * Avoids recalculating nearest edges during window resize so that user-chosen
 * docking orientation never flips unintentionally.
 */
export function recalculateDockedPosition(
  position: CompanionPosition,
  viewportWidth: number,
  viewportHeight: number
): CompanionPosition {
  const { dockSide, y } = position;

  // Recalculate horizontal coordinate preserving existing dockSide
  const x =
    dockSide === 'left'
      ? SCREEN_MARGIN
      : Math.max(SCREEN_MARGIN, viewportWidth - COMPANION_WIDTH - SCREEN_MARGIN);

  // Clamp vertical position within safe viewport margins
  const minY = SCREEN_MARGIN;
  const maxY = Math.max(minY, viewportHeight - COMPANION_HEIGHT - SCREEN_MARGIN);
  const clampedY = Math.min(Math.max(y, minY), maxY);

  return {
    x,
    y: clampedY,
    dockSide,
  };
}

/**
 * Computes a normalized vertical ratio (0.0 to 1.0) representing the vertical position
 * within the allowable margin space. Used for responsive restoration across different window heights.
 */
export function calculateRelativeY(y: number, viewportHeight: number): number {
  const availableHeight = viewportHeight - COMPANION_HEIGHT - 2 * SCREEN_MARGIN;
  if (availableHeight <= 0) {
    return 0;
  }
  const offset = y - SCREEN_MARGIN;
  return Math.min(Math.max(offset / availableHeight, 0), 1);
}

/**
 * Calculates concrete viewport coordinates from a saved dock side and normalized vertical ratio.
 */
export function calculatePositionFromRelativeY(
  dockSide: DockSide,
  relativeY: number,
  viewportWidth: number,
  viewportHeight: number
): CompanionPosition {
  const x =
    dockSide === 'left'
      ? SCREEN_MARGIN
      : Math.max(SCREEN_MARGIN, viewportWidth - COMPANION_WIDTH - SCREEN_MARGIN);

  const availableHeight = Math.max(0, viewportHeight - COMPANION_HEIGHT - 2 * SCREEN_MARGIN);
  const y = SCREEN_MARGIN + relativeY * availableHeight;

  return {
    x,
    y,
    dockSide,
  };
}

