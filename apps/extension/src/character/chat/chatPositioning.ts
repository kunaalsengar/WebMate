import { COMPANION_HEIGHT, COMPANION_WIDTH, type CompanionPosition } from '@webmate/shared';
import type { ChatDrawerLayout, ChatDrawerPlacement } from './chat.types';

export interface ComputeChatDrawerLayoutInput {
  viewportWidth: number;
  viewportHeight: number;
  companionPosition: CompanionPosition;
  isDragging: boolean;
  isAvatarStudioOpen: boolean;
}

const MIN_SIDE_DRAWER_WIDTH = 280;
const IDEAL_SIDE_DRAWER_WIDTH = 396;
const IDEAL_STACKED_DRAWER_WIDTH = 420;
const MAX_DRAWER_HEIGHT = 600;
const MAX_STACKED_HEIGHT = 520;
const MIN_STACKED_VERTICAL_SPACE = 200;

function clamp(value: number, min: number, max: number): number {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

/**
 * Estimates Avatar Studio panel width using the exact responsive rules in style.css
 * so the chat drawer avoids overlapping the customizer when both are open.
 */
function getAvatarStudioReservedSpan(
  viewportWidth: number,
  dockSide: CompanionPosition['dockSide']
): { occupiedStart: number; occupiedEnd: number; sideGap: number } | null {
  if (viewportWidth <= 719) {
    return null;
  }

  const studioWidth =
    viewportWidth <= 899
      ? Math.min(468, viewportWidth - 284)
      : Math.min(680, viewportWidth - 292);

  if (studioWidth <= 0) {
    return null;
  }

  // Avatar Studio anchors on the side opposite the mascot with a 16px edge margin.
  if (dockSide === 'right') {
    return {
      occupiedStart: 16,
      occupiedEnd: 16 + studioWidth,
      sideGap: 14,
    };
  }

  return {
    occupiedStart: viewportWidth - 16 - studioWidth,
    occupiedEnd: viewportWidth - 16,
    sideGap: 14,
  };
}

/**
 * Computes fixed viewport coordinates and sizing for ChatDrawer relative to the floating mascot.
 * - Attaches to the inward side of the docked mascot when horizontal space permits.
 * - Avoids overlapping both the floating mascot and Avatar Studio (when open on wide viewports).
 * - Falls back cleanly above or below the mascot on narrow/mobile viewports without modifying saved position.
 */
export function computeChatDrawerLayout(
  input: ComputeChatDrawerLayoutInput
): ChatDrawerLayout {
  const safeViewportW = Math.max(240, Math.round(input.viewportWidth || 1280));
  const safeViewportH = Math.max(240, Math.round(input.viewportHeight || 800));
  const margin = safeViewportW < 480 ? 10 : 16;
  const gap = safeViewportW < 480 ? 10 : 14;

  const mascotLeft = input.companionPosition.x;
  const mascotRight = mascotLeft + COMPANION_WIDTH;
  const mascotTop = input.companionPosition.y;
  const mascotBottom = mascotTop + COMPANION_HEIGHT;

  // Use live center while dragging so the drawer smoothly tracks side availability without saving position.
  const mascotSide = input.isDragging
    ? mascotLeft + COMPANION_WIDTH / 2 < safeViewportW / 2
      ? 'left'
      : 'right'
    : input.companionPosition.dockSide;

  const studioSpan = input.isAvatarStudioOpen
    ? getAvatarStudioReservedSpan(safeViewportW, input.companionPosition.dockSide)
    : null;

  let availableSideWidth = 0;
  let minLeftBound = margin;
  let maxRightBound = safeViewportW - margin;

  if (mascotSide === 'right') {
    minLeftBound =
      studioSpan && input.companionPosition.dockSide === 'right'
        ? Math.max(margin, studioSpan.occupiedEnd + studioSpan.sideGap)
        : margin;
    availableSideWidth = mascotLeft - gap - minLeftBound;
  } else {
    maxRightBound =
      studioSpan && input.companionPosition.dockSide === 'left'
        ? Math.min(safeViewportW - margin, studioSpan.occupiedStart - studioSpan.sideGap)
        : safeViewportW - margin;
    availableSideWidth = maxRightBound - (mascotRight + gap);
  }

  // 1. Wide / Desktop / Tablet Side Attachment Mode (never covers mascot)
  if (availableSideWidth >= MIN_SIDE_DRAWER_WIDTH) {
    const width = Math.floor(Math.min(IDEAL_SIDE_DRAWER_WIDTH, availableSideWidth));
    const maxHeight = Math.max(220, safeViewportH - margin * 2);
    const height = Math.floor(Math.min(MAX_DRAWER_HEIGHT, maxHeight));

    const preferredLeft =
      mascotSide === 'right' ? mascotLeft - gap - width : mascotRight + gap;
    const left = Math.round(
      clamp(preferredLeft, margin, Math.max(margin, safeViewportW - width - margin))
    );

    // Bottom-align cleanly with the mascot container, clamped within safe viewport bounds.
    const preferredTop = mascotBottom - height;
    const top = Math.round(
      clamp(preferredTop, margin, Math.max(margin, safeViewportH - height - margin))
    );

    const placement: ChatDrawerPlacement =
      mascotSide === 'right' ? 'left-of-mascot' : 'right-of-mascot';

    return { left, top, width, height, maxHeight, placement };
  }

  // 2. Narrow / Mobile Stacked Mode (anchors cleanly above or below mascot)
  const usableWidth = Math.max(200, safeViewportW - margin * 2);
  let width = Math.floor(Math.min(IDEAL_STACKED_DRAWER_WIDTH, usableWidth));

  // Center on compact mobile screens; align toward mascot edge on wider panes.
  let preferredLeft =
    safeViewportW <= 719
      ? Math.round((safeViewportW - width) / 2)
      : mascotSide === 'right'
        ? safeViewportW - margin - width
        : margin;

  // On tablet/laptop where both Avatar Studio and Chat are open above/below mascot, keep clear of Studio horizontally if >= 240px remains.
  if (studioSpan) {
    if (mascotSide === 'right') {
      const studioClearLeft = studioSpan.occupiedEnd + studioSpan.sideGap;
      const clearWidth = safeViewportW - margin - studioClearLeft;
      if (clearWidth >= 240) {
        width = Math.floor(Math.min(width, clearWidth));
        preferredLeft = safeViewportW - margin - width;
      }
    } else {
      const studioClearRight = studioSpan.occupiedStart - studioSpan.sideGap;
      const clearWidth = studioClearRight - margin;
      if (clearWidth >= 240) {
        width = Math.floor(Math.min(width, clearWidth));
        preferredLeft = margin;
      }
    }
  }

  const left = Math.round(
    clamp(preferredLeft, margin, Math.max(margin, safeViewportW - width - margin))
  );

  const spaceAbove = Math.floor(mascotTop - gap - margin);
  const spaceBelow = Math.floor(safeViewportH - margin - (mascotBottom + gap));
  const placeAbove = spaceAbove >= spaceBelow;
  const maxHeight = Math.max(180, safeViewportH - margin * 2);

  if (placeAbove && spaceAbove >= MIN_STACKED_VERTICAL_SPACE) {
    const height = Math.floor(Math.min(MAX_STACKED_HEIGHT, spaceAbove));
    const top = Math.round(clamp(mascotTop - gap - height, margin, safeViewportH - height - margin));
    return { left, top, width, height, maxHeight: spaceAbove, placement: 'above-mascot' };
  }

  if (!placeAbove && spaceBelow >= MIN_STACKED_VERTICAL_SPACE) {
    const height = Math.floor(Math.min(MAX_STACKED_HEIGHT, spaceBelow));
    const top = Math.round(clamp(mascotBottom + gap, margin, safeViewportH - height - margin));
    return { left, top, width, height, maxHeight: spaceBelow, placement: 'below-mascot' };
  }

  // Extreme constrained viewport fallback (stays strictly within viewport bounds).
  const fallbackHeight = Math.floor(Math.min(440, maxHeight));
  const fallbackTop = Math.round(
    clamp(margin, margin, Math.max(margin, safeViewportH - fallbackHeight - margin))
  );

  return {
    left,
    top: fallbackTop,
    width,
    height: fallbackHeight,
    maxHeight,
    placement: placeAbove ? 'above-mascot' : 'below-mascot',
  };
}
