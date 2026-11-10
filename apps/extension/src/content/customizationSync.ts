import { useEffect } from 'react';
import {
  hydrateStoredCustomizationRecord,
  loadCustomCharacterAssets,
  STORAGE_KEY_CUSTOM_CHARACTER_ASSETS,
  type LoadCustomCharacterAssetsResult,
} from '../character/customization';
import { useCompanionStore } from './store';

type StorageChangeMap = Record<string, { oldValue?: unknown; newValue?: unknown }>;
type StorageChangedListener = (changes: StorageChangeMap, areaName: string) => void;

interface StorageOnChangedEventLike {
  addListener(callback: StorageChangedListener): void;
  removeListener(callback: StorageChangedListener): void;
}

interface GlobalBrowserStorageEventsLike {
  browser?: {
    storage?: {
      onChanged?: Partial<StorageOnChangedEventLike>;
    };
  };
}

/**
 * Monotonic epoch guarding async initial hydration and manual refreshes against
 * newer storage.onChanged deliveries or teardown events.
 */
let latestSyncEpoch = 0;

/**
 * Resolves extension storage.onChanged without importing browser polyfills at module load time,
 * preventing crashes in non-extension contexts.
 */
function getStorageOnChangedEvent(): StorageOnChangedEventLike | null {
  try {
    const maybeBrowser = (globalThis as GlobalBrowserStorageEventsLike).browser;
    const browserOnChanged = maybeBrowser?.storage?.onChanged;
    if (
      browserOnChanged &&
      typeof browserOnChanged.addListener === 'function' &&
      typeof browserOnChanged.removeListener === 'function'
    ) {
      return browserOnChanged as StorageOnChangedEventLike;
    }

    if (
      typeof chrome !== 'undefined' &&
      chrome.storage &&
      chrome.storage.onChanged &&
      typeof chrome.storage.onChanged.addListener === 'function' &&
      typeof chrome.storage.onChanged.removeListener === 'function'
    ) {
      return chrome.storage.onChanged as unknown as StorageOnChangedEventLike;
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Starts live synchronization for built-in avatar customization selections:
 * 1. Registers the local storage.onChanged listener BEFORE starting async hydration so
 *    updates committed mid-load are never missed.
 * 2. Uses latestSyncEpoch so slower in-flight initial reads cannot overwrite newer updates.
 * 3. Returns an idempotent cleanup callback removing the exact registered listener reference.
 */
export function startCustomCharacterAssetsSync(): () => void {
  let isDisposed = false;
  const onChanged = getStorageOnChangedEvent();

  const handleStorageChanged: StorageChangedListener = (changes, areaName) => {
    if (isDisposed || areaName !== 'local' || !changes) {
      return;
    }

    if (!Object.prototype.hasOwnProperty.call(changes, STORAGE_KEY_CUSTOM_CHARACTER_ASSETS)) {
      return;
    }

    // Advance epoch immediately so any slower in-flight hydration cannot clobber this change.
    latestSyncEpoch += 1;

    try {
      const change = changes[STORAGE_KEY_CUSTOM_CHARACTER_ASSETS];
      const hydrated = hydrateStoredCustomizationRecord(change?.newValue);
      useCompanionStore.getState().applyHydratedCustomAssets(hydrated);
    } catch (error) {
      console.warn('[WebMate] Failed to process storage.onChanged customization update:', error);
      useCompanionStore
        .getState()
        .setCustomAssetsError(
          error instanceof Error && error.message
            ? `Failed to synchronize avatar customization: ${error.message}`
            : 'Failed to synchronize avatar customization.'
        );
    }
  };

  if (onChanged) {
    try {
      onChanged.addListener(handleStorageChanged);
    } catch (error) {
      console.warn('[WebMate] Unable to register storage.onChanged listener:', error);
    }
  }

  const requestEpoch = ++latestSyncEpoch;
  useCompanionStore.getState().setCustomAssetsLoading(true);

  void (async () => {
    try {
      const result = await loadCustomCharacterAssets();
      if (isDisposed || requestEpoch !== latestSyncEpoch) {
        return;
      }
      useCompanionStore.getState().applyHydratedCustomAssets(result);
    } catch (error) {
      if (isDisposed || requestEpoch !== latestSyncEpoch) {
        return;
      }
      console.warn('[WebMate] Failed to hydrate avatar customization:', error);
      const store = useCompanionStore.getState();
      store.setCustomAssetsLoading(false);
      store.setCustomAssetsError(
        error instanceof Error && error.message
          ? `Failed to load avatar customization: ${error.message}`
          : 'Failed to load avatar customization from storage.'
      );
    }
  })();

  return () => {
    if (isDisposed) {
      return;
    }
    isDisposed = true;
    latestSyncEpoch += 1;

    if (onChanged) {
      try {
        onChanged.removeListener(handleStorageChanged);
      } catch (error) {
        console.warn('[WebMate] Failed to remove storage.onChanged listener:', error);
      }
    }
  };
}

/**
 * Triggers an on-demand re-hydration from chrome.storage.local protected by the shared epoch.
 */
export async function refreshCustomCharacterAssets(): Promise<LoadCustomCharacterAssetsResult> {
  const requestEpoch = ++latestSyncEpoch;
  useCompanionStore.getState().setCustomAssetsLoading(true);

  const result = await loadCustomCharacterAssets();
  if (requestEpoch === latestSyncEpoch) {
    useCompanionStore.getState().applyHydratedCustomAssets(result);
  }
  return result;
}

/**
 * React lifecycle hook binding avatar customization hydration and cross-tab sync
 * to the mounted FloatingCompanion component.
 */
export function useCustomCharacterAssetsSync(): void {
  useEffect(() => {
    return startCustomCharacterAssetsSync();
  }, []);
}
