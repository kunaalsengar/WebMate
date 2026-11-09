import type { CompanionPosition, DockSide } from '@webmate/shared';
import {
  CHARACTER_BASE_HEIGHT,
  CHARACTER_BASE_WIDTH,
  CHARACTER_RENDERED_HEIGHT,
  CHARACTER_RENDERED_WIDTH,
  CHARACTER_RIG_SCALE,
  COMPANION_CARD_HEIGHT,
  COMPANION_CARD_WIDTH,
  COMPANION_HEIGHT,
  COMPANION_WIDTH,
  COMPOSITE_COMPANION_HEIGHT,
  COMPOSITE_COMPANION_WIDTH,
} from '@webmate/shared';

export {
  CHARACTER_BASE_HEIGHT,
  CHARACTER_BASE_WIDTH,
  CHARACTER_RENDERED_HEIGHT,
  CHARACTER_RENDERED_WIDTH,
  CHARACTER_RIG_SCALE,
  COMPANION_CARD_HEIGHT,
  COMPANION_CARD_WIDTH,
  COMPANION_HEIGHT,
  COMPANION_WIDTH,
  COMPOSITE_COMPANION_HEIGHT,
  COMPOSITE_COMPANION_WIDTH,
};

/**
 * Screen margin constraint (in pixels).
 * Maintains a comfortable 16–24px spacing from viewport boundaries when space allows.
 */
export const SCREEN_MARGIN = 20;

/**
 * Movement threshold (in pixels) required to distinguish an intentional drag gesture
 * from an in-place tap or click.
 */
export const DRAG_THRESHOLD_PX = 4;

/**
 * Calculates the default initial bottom-right docked position for a given viewport size.
 *
 * Small Viewport Safety:
 * - If viewportWidth < COMPANION_WIDTH, snaps x = 0.
 * - If viewportHeight < COMPANION_HEIGHT, snaps y = 0.
 * - When space allows, preserves 20px right margin and 24px bottom margin.
 * - Never returns negative coordinates.
 */
export function calculateDefaultPosition(
  viewportWidth: number,
  viewportHeight: number
): CompanionPosition {
  const x =
    viewportWidth < COMPANION_WIDTH
      ? 0
      : Math.max(0, viewportWidth - COMPANION_WIDTH - SCREEN_MARGIN);
  const y =
    viewportHeight < COMPANION_HEIGHT
      ? 0
      : Math.max(0, viewportHeight - COMPANION_HEIGHT - 24);

  return {
    x,
    y,
    dockSide: 'right',
  };
}

/**
 * Clamps coordinates so that the companion remains within the visible viewport
 * during an active drag interaction.
 *
 * Small Viewport Safety:
 * - If the viewport cannot fit the companion in either axis, clamps that axis strictly to 0.
 * - Never returns negative coordinates.
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
    x: viewportWidth < COMPANION_WIDTH ? 0 : Math.min(Math.max(x, 0), maxX),
    y: viewportHeight < COMPANION_HEIGHT ? 0 : Math.min(Math.max(y, 0), maxY),
  };
}

/**
 * Snaps the companion to the nearest horizontal edge (left or right) upon release.
 * Preserves the vertical coordinate while clamping it to safe viewport margins.
 *
 * Small Viewport Safety:
 * - If viewportWidth < COMPANION_WIDTH, positions at x = 0.
 * - If viewportHeight < COMPANION_HEIGHT, positions at y = 0.
 * - Preserves 20px screen margins whenever physical space permits.
 * - Never returns negative coordinates.
 */
export function calculateDockPosition(
  x: number,
  y: number,
  viewportWidth: number,
  viewportHeight: number
): CompanionPosition {
  // Determine nearest horizontal edge based on composite companion horizontal midpoint
  const companionCenterX = x + COMPANION_WIDTH / 2;
  const isLeft = companionCenterX < viewportWidth / 2;
  const dockSide: DockSide = isLeft ? 'left' : 'right';

  // Calculate horizontal coordinate
  let snappedX: number;
  if (viewportWidth < COMPANION_WIDTH) {
    snappedX = 0;
  } else if (viewportWidth < COMPANION_WIDTH + 2 * SCREEN_MARGIN) {
    snappedX = isLeft ? 0 : Math.max(0, viewportWidth - COMPANION_WIDTH);
  } else {
    snappedX = isLeft
      ? SCREEN_MARGIN
      : Math.max(SCREEN_MARGIN, viewportWidth - COMPANION_WIDTH - SCREEN_MARGIN);
  }

  // Calculate vertical coordinate
  let snappedY: number;
  if (viewportHeight < COMPANION_HEIGHT) {
    snappedY = 0;
  } else if (viewportHeight < COMPANION_HEIGHT + 2 * SCREEN_MARGIN) {
    snappedY = Math.min(Math.max(y, 0), viewportHeight - COMPANION_HEIGHT);
  } else {
    const minY = SCREEN_MARGIN;
    const maxY = viewportHeight - COMPANION_HEIGHT - SCREEN_MARGIN;
    snappedY = Math.min(Math.max(y, minY), maxY);
  }

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
 *
 * Small Viewport Safety:
 * - If viewportWidth < COMPANION_WIDTH, positions at x = 0.
 * - If viewportHeight < COMPANION_HEIGHT, positions at y = 0.
 * - Preserves 20px screen margins whenever physical space permits.
 * - Never returns negative coordinates.
 */
export function recalculateDockedPosition(
  position: CompanionPosition,
  viewportWidth: number,
  viewportHeight: number
): CompanionPosition {
  const { dockSide, y } = position;

  let x: number;
  if (viewportWidth < COMPANION_WIDTH) {
    x = 0;
  } else if (viewportWidth < COMPANION_WIDTH + 2 * SCREEN_MARGIN) {
    x = dockSide === 'left' ? 0 : Math.max(0, viewportWidth - COMPANION_WIDTH);
  } else {
    x =
      dockSide === 'left'
        ? SCREEN_MARGIN
        : Math.max(SCREEN_MARGIN, viewportWidth - COMPANION_WIDTH - SCREEN_MARGIN);
  }

  let clampedY: number;
  if (viewportHeight < COMPANION_HEIGHT) {
    clampedY = 0;
  } else if (viewportHeight < COMPANION_HEIGHT + 2 * SCREEN_MARGIN) {
    clampedY = Math.min(Math.max(y, 0), viewportHeight - COMPANION_HEIGHT);
  } else {
    const minY = SCREEN_MARGIN;
    const maxY = viewportHeight - COMPANION_HEIGHT - SCREEN_MARGIN;
    clampedY = Math.min(Math.max(y, minY), maxY);
  }

  return {
    x,
    y: clampedY,
    dockSide,
  };
}

/**
 * Computes a normalized vertical ratio (0.0 to 1.0) representing the vertical position
 * within the allowable viewport space. Used for responsive restoration across different window heights.
 *
 * Intermediate & Small Viewport Handling:
 * 1. If viewportHeight <= COMPANION_HEIGHT, returns 0.
 * 2. If physicalAvailableHeight < 2 * SCREEN_MARGIN, calculates normalized position using
 *    y / physicalAvailableHeight to preserve relative position in intermediate viewports.
 * 3. Otherwise, retains normal margin-adjusted calculation:
 *    (y - SCREEN_MARGIN) / (physicalAvailableHeight - 2 * SCREEN_MARGIN).
 * 4. Strictly prevents division by zero and clamps ratio between 0 and 1.
 */
export function calculateRelativeY(y: number, viewportHeight: number): number {
  if (viewportHeight <= COMPANION_HEIGHT) {
    return 0;
  }

  const physicalAvailableHeight = viewportHeight - COMPANION_HEIGHT;
  if (physicalAvailableHeight <= 0) {
    return 0;
  }

  let ratio: number;
  if (physicalAvailableHeight < 2 * SCREEN_MARGIN) {
    ratio = y / physicalAvailableHeight;
  } else {
    const marginAdjustedAvailableHeight = physicalAvailableHeight - 2 * SCREEN_MARGIN;
    if (marginAdjustedAvailableHeight <= 0) {
      return 0;
    }
    ratio = (y - SCREEN_MARGIN) / marginAdjustedAvailableHeight;
  }

  if (!Number.isFinite(ratio)) {
    return 0;
  }

  return Math.min(Math.max(ratio, 0), 1);
}

/**
 * Calculates concrete viewport coordinates from a saved dock side and normalized vertical ratio.
 *
 * Small Viewport Safety:
 * - If viewportWidth < COMPANION_WIDTH, positions at x = 0.
 * - If viewportHeight < COMPANION_HEIGHT, positions at y = 0.
 * - Preserves 20px screen margins whenever physical space permits.
 * - Never returns negative coordinates.
 */
export function calculatePositionFromRelativeY(
  dockSide: DockSide,
  relativeY: number,
  viewportWidth: number,
  viewportHeight: number
): CompanionPosition {
  let x: number;
  if (viewportWidth < COMPANION_WIDTH) {
    x = 0;
  } else if (viewportWidth < COMPANION_WIDTH + 2 * SCREEN_MARGIN) {
    x = dockSide === 'left' ? 0 : Math.max(0, viewportWidth - COMPANION_WIDTH);
  } else {
    x =
      dockSide === 'left'
        ? SCREEN_MARGIN
        : Math.max(SCREEN_MARGIN, viewportWidth - COMPANION_WIDTH - SCREEN_MARGIN);
  }

  let y: number;
  if (viewportHeight < COMPANION_HEIGHT) {
    y = 0;
  } else if (viewportHeight < COMPANION_HEIGHT + 2 * SCREEN_MARGIN) {
    const availableHeight = Math.max(0, viewportHeight - COMPANION_HEIGHT);
    const clampedRatio = Number.isFinite(relativeY) ? Math.min(Math.max(0, relativeY), 1) : 0;
    y = Math.round(clampedRatio * availableHeight);
  } else {
    const availableHeight = viewportHeight - COMPANION_HEIGHT - 2 * SCREEN_MARGIN;
    const clampedRatio = Number.isFinite(relativeY) ? Math.min(Math.max(0, relativeY), 1) : 0;
    y = SCREEN_MARGIN + clampedRatio * availableHeight;
  }

  return {
    x,
    y,
    dockSide,
  };
}
