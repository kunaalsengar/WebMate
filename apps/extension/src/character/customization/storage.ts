import {
  DEFAULT_AVATAR_CUSTOMIZATION,
  extractCustomizationOverrides,
  isValidAvatarConfigKey,
  isValidCustomizationField,
  normalizeAvatarCustomization,
} from './catalog';
import type {
  AvatarCustomizationConfig,
  AvatarCustomizationPartial,
  StoredCharacterAssetCustomization,
} from './types';

/**
 * Independent chrome.storage.local key for WebMate Phase 2 character customization.
 * Intentionally isolated from companion positioning (webmate_companion_position) and animation state.
 */
export const STORAGE_KEY_CUSTOM_CHARACTER_ASSETS = 'webmate_custom_character_assets' as const;

/**
 * Current persisted built-in avatar customization schema version (v2).
 */
export const CUSTOM_CHARACTER_ASSETS_SCHEMA_VERSION = 2 as const;

export type CustomizationStorageWarningCode =
  | 'storage_unavailable'
  | 'storage_read_failed'
  | 'corrupted_root'
  | 'unsupported_version'
  | 'corrupted_selections_container'
  | 'corrupted_root_timestamp'
  | 'unknown_selection_key'
  | 'invalid_selection_value';

export interface CustomizationStorageWarning {
  code: CustomizationStorageWarningCode;
  field?: string;
  message: string;
}

export interface LoadCustomCharacterAssetsResult {
  /** Normalized complete built-in avatar configuration (invalid stored fields fall back to default independently) */
  customization: AvatarCustomizationConfig;
  /** Document timestamp when present and valid; null if absent or invalid */
  updatedAt: number | null;
  /** True if stored data contained malformed fields or unsupported version */
  hasCorruptedData: boolean;
  /** Populated with stored schema version when unsupported (e.g. legacy v1), without mutating storage */
  unsupportedVersion: number | string | null;
  /** Structured warnings describing ignored fields, version mismatches, or read failures */
  warnings: CustomizationStorageWarning[];
}

export type SaveCustomCharacterAssetsErrorCode =
  | 'storage_unavailable'
  | 'invalid_input'
  | 'quota_exceeded'
  | 'storage_write_failed';

export type SaveCustomCharacterAssetsResult =
  | {
      ok: true;
      record: StoredCharacterAssetCustomization;
      customization: AvatarCustomizationConfig;
    }
  | {
      ok: false;
      code: SaveCustomCharacterAssetsErrorCode;
      message: string;
    };

export type ResetCustomCharacterAssetsResult =
  | { ok: true }
  | {
      ok: false;
      code: 'storage_unavailable' | 'storage_remove_failed';
      message: string;
    };

interface BrowserStorageAreaLike {
  get(keys?: string | string[] | Record<string, unknown> | null): Promise<Record<string, unknown>>;
  set(items: Record<string, unknown>): Promise<void>;
  remove(keys: string | string[]): Promise<void>;
}

interface GlobalBrowserLike {
  browser?: {
    storage?: {
      local?: Partial<BrowserStorageAreaLike>;
    };
  };
}

const FORBIDDEN_OBJECT_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const ALLOWED_ROOT_KEYS = new Set(['version', 'selections', 'updatedAt']);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function hasOnlyAllowedKeys(obj: Record<string, unknown>, allowedKeys: ReadonlySet<string>): boolean {
  for (const key of Object.keys(obj)) {
    if (FORBIDDEN_OBJECT_KEYS.has(key) || !allowedKeys.has(key)) {
      return false;
    }
  }
  return true;
}

/**
 * Resolves extension local storage following WebExtension / Chrome MV3 conventions
 * without importing polyfills at module load time.
 */
function getLocalStorageArea(): BrowserStorageAreaLike | null {
  try {
    const maybeBrowser = (globalThis as GlobalBrowserLike).browser;
    const browserLocal = maybeBrowser?.storage?.local;
    if (
      browserLocal &&
      typeof browserLocal.get === 'function' &&
      typeof browserLocal.set === 'function' &&
      typeof browserLocal.remove === 'function'
    ) {
      return browserLocal as BrowserStorageAreaLike;
    }

    if (
      typeof chrome !== 'undefined' &&
      chrome.storage &&
      chrome.storage.local &&
      typeof chrome.storage.local.get === 'function' &&
      typeof chrome.storage.local.set === 'function' &&
      typeof chrome.storage.local.remove === 'function'
    ) {
      return chrome.storage.local as unknown as BrowserStorageAreaLike;
    }
  } catch {
    return null;
  }

  return null;
}

function isStorageQuotaError(error: unknown): boolean {
  if (!error) return false;
  const detail =
    error instanceof Error
      ? `${error.name} ${error.message}`.toLowerCase()
      : String(error).toLowerCase();

  return (
    detail.includes('quota') ||
    detail.includes('quota_bytes') ||
    detail.includes('quotaexceedederror') ||
    detail.includes('ns_error_dom_quota')
  );
}

function createEmptyLoadResult(
  partial?: Partial<LoadCustomCharacterAssetsResult>
): LoadCustomCharacterAssetsResult {
  return {
    customization: { ...DEFAULT_AVATAR_CUSTOMIZATION },
    updatedAt: null,
    hasCorruptedData: false,
    unsupportedVersion: null,
    warnings: [],
    ...partial,
  };
}

/**
 * Validates and hydrates a raw value read from storage (or storage.onChanged) without mutating
 * the underlying persisted record. Invalid fields fall back independently to built-in defaults.
 */
export function hydrateStoredCustomizationRecord(
  rawValue: unknown
): LoadCustomCharacterAssetsResult {
  if (rawValue === undefined || rawValue === null) {
    return createEmptyLoadResult();
  }

  const warnings: CustomizationStorageWarning[] = [];

  if (!isPlainObject(rawValue)) {
    warnings.push({
      code: 'corrupted_root',
      message:
        'Stored character customization data is malformed. Using default mascot appearance without overwriting saved data.',
    });
    return createEmptyLoadResult({
      hasCorruptedData: true,
      warnings,
    });
  }

  const rawVersion = rawValue.version;
  if (rawVersion !== CUSTOM_CHARACTER_ASSETS_SCHEMA_VERSION) {
    const versionDisplay =
      typeof rawVersion === 'number' || typeof rawVersion === 'string'
        ? rawVersion
        : 'unknown';

    warnings.push({
      code: 'unsupported_version',
      message:
        rawVersion === 1
          ? 'Found legacy v1 local SVG customization data. Using default built-in mascot options until you save or reset.'
          : `Unsupported character customization schema version (${String(versionDisplay)}). Expected version ${CUSTOM_CHARACTER_ASSETS_SCHEMA_VERSION}.`,
    });

    return createEmptyLoadResult({
      hasCorruptedData: true,
      unsupportedVersion: versionDisplay,
      warnings,
    });
  }

  let hasCorruptedData = false;

  if (!hasOnlyAllowedKeys(rawValue, ALLOWED_ROOT_KEYS)) {
    hasCorruptedData = true;
    warnings.push({
      code: 'corrupted_root',
      message: 'Stored customization root record contained unexpected properties that were ignored.',
    });
  }

  let rootUpdatedAt: number | null = null;
  if (
    typeof rawValue.updatedAt === 'number' &&
    Number.isFinite(rawValue.updatedAt) &&
    rawValue.updatedAt > 0
  ) {
    rootUpdatedAt = rawValue.updatedAt;
  } else {
    hasCorruptedData = true;
    warnings.push({
      code: 'corrupted_root_timestamp',
      message: 'Stored customization root timestamp is missing or invalid.',
    });
  }

  const rawSelections = rawValue.selections;
  if (!isPlainObject(rawSelections)) {
    warnings.push({
      code: 'corrupted_selections_container',
      message:
        'Stored avatar selections container is invalid. Falling back to default mascot options.',
    });
    return createEmptyLoadResult({
      updatedAt: rootUpdatedAt,
      hasCorruptedData: true,
      warnings,
    });
  }

  const validatedPartial: AvatarCustomizationPartial = {};

  for (const [key, value] of Object.entries(rawSelections)) {
    if (FORBIDDEN_OBJECT_KEYS.has(key) || !isValidAvatarConfigKey(key)) {
      hasCorruptedData = true;
      warnings.push({
        code: 'unknown_selection_key',
        field: key,
        message: `Unrecognized avatar customization option '${key}' was ignored.`,
      });
      continue;
    }

    if (value === undefined) {
      continue;
    }

    if (!isValidCustomizationField(key, value)) {
      hasCorruptedData = true;
      warnings.push({
        code: 'invalid_selection_value',
        field: key,
        message: `Stored value for '${key}' is not a valid built-in option and fell back to default.`,
      });
      continue;
    }

    (validatedPartial as Record<string, string>)[key] = value;
  }

  return {
    customization: normalizeAvatarCustomization(validatedPartial),
    updatedAt: rootUpdatedAt,
    hasCorruptedData,
    unsupportedVersion: null,
    warnings,
  };
}

/**
 * Loads and validates persisted built-in avatar selections from extension local storage.
 * Never throws and never overwrites unsupported or corrupted data automatically.
 */
export async function loadCustomCharacterAssets(): Promise<LoadCustomCharacterAssetsResult> {
  const storageArea = getLocalStorageArea();
  if (!storageArea) {
    return createEmptyLoadResult({
      warnings: [
        {
          code: 'storage_unavailable',
          message: 'Extension local storage is unavailable in this runtime context.',
        },
      ],
    });
  }

  try {
    const rawResult = await storageArea.get(STORAGE_KEY_CUSTOM_CHARACTER_ASSETS);
    const rawValue =
      rawResult && Object.prototype.hasOwnProperty.call(rawResult, STORAGE_KEY_CUSTOM_CHARACTER_ASSETS)
        ? rawResult[STORAGE_KEY_CUSTOM_CHARACTER_ASSETS]
        : undefined;
    return hydrateStoredCustomizationRecord(rawValue);
  } catch (error) {
    console.warn('[WebMate] Failed to read avatar customization from storage:', error);
    return createEmptyLoadResult({
      warnings: [
        {
          code: 'storage_read_failed',
          message:
            error instanceof Error && error.message
              ? `Failed to read avatar customization: ${error.message}`
              : 'Failed to read avatar customization from local storage.',
        },
      ],
    });
  }
}

/**
 * Persists built-in avatar selections (only non-default deltas) atomically under chrome.storage.local.
 */
export async function saveCustomCharacterAssets(
  config: AvatarCustomizationConfig
): Promise<SaveCustomCharacterAssetsResult> {
  if (!isPlainObject(config)) {
    return {
      ok: false,
      code: 'invalid_input',
      message: 'Avatar customization payload must be a valid configuration object.',
    };
  }

  const normalized = normalizeAvatarCustomization(config);
  const sparseSelections = extractCustomizationOverrides(normalized);

  const outgoingRecord: StoredCharacterAssetCustomization = {
    version: CUSTOM_CHARACTER_ASSETS_SCHEMA_VERSION,
    selections: sparseSelections,
    updatedAt: Date.now(),
  };

  const storageArea = getLocalStorageArea();
  if (!storageArea) {
    return {
      ok: false,
      code: 'storage_unavailable',
      message: 'Extension local storage is unavailable in this runtime context.',
    };
  }

  try {
    await storageArea.set({ [STORAGE_KEY_CUSTOM_CHARACTER_ASSETS]: outgoingRecord });
    return {
      ok: true,
      record: outgoingRecord,
      customization: normalized,
    };
  } catch (error) {
    console.warn('[WebMate] Failed to save avatar customization to storage:', error);
    if (isStorageQuotaError(error)) {
      return {
        ok: false,
        code: 'quota_exceeded',
        message: 'Extension local storage quota exceeded while saving avatar settings.',
      };
    }

    return {
      ok: false,
      code: 'storage_write_failed',
      message:
        error instanceof Error && error.message
          ? `Failed to save avatar customization: ${error.message}`
          : 'Failed to save avatar customization to local storage.',
    };
  }
}

/**
 * Clears only the custom character assets key from extension local storage, preserving all
 * companion positioning, docking, and unrelated extension storage data.
 */
export async function resetCustomCharacterAssets(): Promise<ResetCustomCharacterAssetsResult> {
  const storageArea = getLocalStorageArea();
  if (!storageArea) {
    return {
      ok: false,
      code: 'storage_unavailable',
      message: 'Extension local storage is unavailable in this runtime context.',
    };
  }

  try {
    await storageArea.remove(STORAGE_KEY_CUSTOM_CHARACTER_ASSETS);
    return { ok: true };
  } catch (error) {
    console.warn('[WebMate] Failed to remove avatar customization from storage:', error);
    return {
      ok: false,
      code: 'storage_remove_failed',
      message:
        error instanceof Error && error.message
          ? `Failed to reset avatar customization: ${error.message}`
          : 'Failed to remove avatar customization from local storage.',
    };
  }
}
