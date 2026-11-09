import type { CompanionPosition, DockSide, StoredCompanionPosition } from '@webmate/shared';
import {
  calculateDockPosition,
  calculatePositionFromRelativeY,
  calculateRelativeY,
} from './docking';

export const STORAGE_KEY_POSITION = 'webmate_companion_position';

/**
 * Checks if the Chrome Storage API is available in the current runtime context.
 */
function isChromeStorageAvailable(): boolean {
  return (
    typeof chrome !== 'undefined' &&
    Boolean(chrome.storage) &&
    Boolean(chrome.storage.local)
  );
}

/**
 * Loads and validates the companion's persisted position from chrome.storage.local.
 *
 * Requirements fulfilled:
 * - Validates saved coordinates against the current viewport dimensions before restoring.
 * - Restores proportional vertical position using relativeY across differing screen heights.
 * - Gracefully falls back to null if storage is unavailable or coordinates are invalid.
 * - Stores no user data, browsing history, or website content.
 */
export async function loadSavedPosition(
  viewportWidth: number,
  viewportHeight: number
): Promise<CompanionPosition | null> {
  if (!isChromeStorageAvailable()) {
    console.debug('[WebMate] chrome.storage.local is unavailable in this environment.');
    return null;
  }

  try {
    const result = await chrome.storage.local.get(STORAGE_KEY_POSITION);
    const data = result?.[STORAGE_KEY_POSITION] as Partial<StoredCompanionPosition> | undefined;

    if (!data || typeof data !== 'object') {
      return null;
    }

    const { dockSide, relativeY, x, y } = data;

    // Validate dockSide enum
    const validDockSide: DockSide | null =
      dockSide === 'left' || dockSide === 'right' ? dockSide : null;

    if (!validDockSide) {
      return null;
    }

    // Prefer proportional vertical position for responsive fidelity
    if (typeof relativeY === 'number' && !isNaN(relativeY) && relativeY >= 0 && relativeY <= 1) {
      return calculatePositionFromRelativeY(
        validDockSide,
        relativeY,
        viewportWidth,
        viewportHeight
      );
    }

    // Fallback: validate absolute numeric coordinates and clamp to current viewport
    if (typeof x === 'number' && typeof y === 'number' && !isNaN(x) && !isNaN(y)) {
      return calculateDockPosition(x, y, viewportWidth, viewportHeight);
    }

    return null;
  } catch (error) {
    console.warn('[WebMate] Failed to load companion position from storage:', error);
    return null;
  }
}

/**
 * Persists the companion's docked position to chrome.storage.local.
 *
 * Requirements fulfilled:
 * - Invoked only upon drag completion, never on every pointer movement.
 * - Stores dockSide, absolute coordinates, and relative vertical percentage.
 * - Does not store website content, URL data, or personal identifiers.
 */
export async function saveCompanionPosition(
  position: CompanionPosition,
  viewportHeight: number
): Promise<boolean> {
  if (!isChromeStorageAvailable()) {
    return false;
  }

  try {
    const relativeY = calculateRelativeY(position.y, viewportHeight);
    const record: StoredCompanionPosition = {
      x: Math.round(position.x),
      y: Math.round(position.y),
      dockSide: position.dockSide,
      relativeY: Math.round(relativeY * 10000) / 10000,
      updatedAt: Date.now(),
    };

    await chrome.storage.local.set({ [STORAGE_KEY_POSITION]: record });
    return true;
  } catch (error) {
    console.warn('[WebMate] Failed to save companion position to storage:', error);
    return false;
  }
}

