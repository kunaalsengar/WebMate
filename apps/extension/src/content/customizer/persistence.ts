import {
  areAvatarCustomizationsEqual,
  DEFAULT_AVATAR_CUSTOMIZATION,
  resetCustomCharacterAssets,
  saveCustomCharacterAssets,
  type LoadCustomCharacterAssetsResult,
} from '../../character/customization';
import { useCompanionStore } from '../store';

export type SaveDraftOutcome =
  | {
      ok: true;
      skippedWrite: boolean;
      cleared: boolean;
    }
  | {
      ok: false;
      message: string;
    };

/**
 * Persists pending built-in avatar studio selections via chrome.storage.local helpers.
 * Clears storage cleanly when all options return to defaults, and skips writes when unchanged.
 */
export async function saveCustomizerDraftChanges(): Promise<SaveDraftOutcome> {
  const initialState = useCompanionStore.getState();

  if (initialState.isSavingCustomAssets) {
    return {
      ok: false,
      message: 'A save operation is already in progress.',
    };
  }

  const draftConfig = initialState.draftAvatarCustomization ?? initialState.avatarCustomization;
  const savedConfig = initialState.avatarCustomization;
  const hasDraftDiff = !areAvatarCustomizationsEqual(draftConfig, savedConfig);
  const isAllDefaults = areAvatarCustomizationsEqual(draftConfig, DEFAULT_AVATAR_CUSTOMIZATION);
  const needsCorruptedCleanup =
    isAllDefaults &&
    (initialState.customAssetsHasCorruptedData ||
      initialState.unsupportedCustomAssetsVersion !== null);

  if (!hasDraftDiff && !needsCorruptedCleanup) {
    return {
      ok: true,
      skippedWrite: true,
      cleared: false,
    };
  }

  initialState.setSavingCustomAssets(true);

  try {
    if (isAllDefaults) {
      const resetResult = await resetCustomCharacterAssets();
      if (!resetResult.ok) {
        return {
          ok: false,
          message: resetResult.message,
        };
      }

      useCompanionStore.getState().clearCustomAssetsState();
      return {
        ok: true,
        skippedWrite: false,
        cleared: true,
      };
    }

    const saveResult = await saveCustomCharacterAssets(draftConfig);
    if (!saveResult.ok) {
      return {
        ok: false,
        message: saveResult.message,
      };
    }

    const hydratedResult: LoadCustomCharacterAssetsResult = {
      customization: saveResult.customization,
      updatedAt: saveResult.record.updatedAt,
      hasCorruptedData: false,
      unsupportedVersion: null,
      warnings: [],
    };

    useCompanionStore.getState().applySavedCustomAssets(hydratedResult);

    return {
      ok: true,
      skippedWrite: false,
      cleared: false,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error && error.message
          ? `Failed to save customization changes: ${error.message}`
          : 'Failed to save customization changes.',
    };
  } finally {
    useCompanionStore.getState().setSavingCustomAssets(false);
  }
}
