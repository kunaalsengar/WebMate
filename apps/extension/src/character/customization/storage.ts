import type { CharacterLayerId } from '@webmate/shared';
import { validateSafeSvgNodes, validateStoredCustomLayerAsset } from './svgSanitizer';
import {
  CANONICAL_CHARACTER_LAYER_IDS,
  CUSTOMIZATION_LIMITS,
  PLACEMENT_BOUNDS,
  type CustomCharacterLayersMap,
  type StoredCharacterAssetCustomization,
  type StoredCustomLayerAsset,
} from './types';

/**
 * Independent chrome.storage.local key for WebMate Phase 2 Step 2B custom SVG layer assets.
 * Intentionally isolated from companion positioning (webmate_companion_position) and animation state.
 */
export const STORAGE_KEY_CUSTOM_CHARACTER_ASSETS = 'webmate_custom_character_assets' as const;

/**
 * Current persisted customization document schema version (v1).
 */
export const CUSTOM_CHARACTER_ASSETS_SCHEMA_VERSION = 1 as const;

export type CustomizationStorageWarningCode =
  | 'storage_unavailable'
  | 'storage_read_failed'
  | 'corrupted_root'
  | 'unsupported_version'
  | 'corrupted_layers_container'
  | 'corrupted_root_timestamp'
  | 'unknown_layer_key'
  | 'invalid_layer_asset'
  | 'aggregate_limit_exceeded';

export interface CustomizationStorageWarning {
  code: CustomizationStorageWarningCode;
  layerId?: string;
  message: string;
}

export interface LoadCustomCharacterAssetsResult {
  /** Validated custom layers keyed by canonical rig layer ID (invalid slots omitted independently) */
  layers: CustomCharacterLayersMap;
  /** Document timestamp when present and valid; null if absent or invalid */
  updatedAt: number | null;
  /** UTF-8 byte count of the validated serialized customization record */
  serializedBytes: number;
  /** True if stored data contained malformed fields or unsupported version */
  hasCorruptedData: boolean;
  /** Populated with stored schema version when unsupported, without mutating storage */
  unsupportedVersion: number | string | null;
  /** Structured warnings describing ignored layers, version mismatches, or read failures */
  warnings: CustomizationStorageWarning[];
}

export type SaveCustomCharacterAssetsErrorCode =
  | 'storage_unavailable'
  | 'invalid_input'
  | 'layer_validation_failed'
  | 'layer_size_exceeded'
  | 'aggregate_limit_exceeded'
  | 'quota_exceeded'
  | 'storage_write_failed';

export type SaveCustomCharacterAssetsResult =
  | {
      ok: true;
      record: StoredCharacterAssetCustomization;
      serializedBytes: number;
    }
  | {
      ok: false;
      code: SaveCustomCharacterAssetsErrorCode;
      message: string;
      failedLayerIds: CharacterLayerId[];
      serializedBytes?: number;
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

const CANONICAL_LAYER_SET = new Set<string>(CANONICAL_CHARACTER_LAYER_IDS);
const FORBIDDEN_OBJECT_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const CONTROL_CHAR_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

const ALLOWED_ROOT_KEYS = new Set(['version', 'layers', 'updatedAt']);
const ALLOWED_LAYER_ASSET_KEYS = new Set([
  'layerId',
  'fileName',
  'byteSize',
  'sourceViewBox',
  'parsedViewBox',
  'nodes',
  'placement',
  'updatedAt',
]);
const ALLOWED_VIEWBOX_KEYS = new Set(['minX', 'minY', 'width', 'height']);
const ALLOWED_PLACEMENT_KEYS = new Set(['offsetX', 'offsetY', 'scale', 'fitMode']);

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

function measureUtf8StringBytes(input: string): number {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(input).length;
  }
  let bytes = 0;
  for (let i = 0; i < input.length; i += 1) {
    const code = input.charCodeAt(i);
    if (code <= 0x7f) {
      bytes += 1;
    } else if (code <= 0x7ff) {
      bytes += 2;
    } else if (code >= 0xd800 && code <= 0xdbff) {
      const next = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
      if (next >= 0xdc00 && next <= 0xdfff) {
        i += 1;
        bytes += 4;
      } else {
        bytes += 3;
      }
    } else {
      bytes += 3;
    }
  }
  return bytes;
}

/**
 * Computes exact UTF-8 serialized JSON byte length rather than UTF-16 string length.
 */
export function measureUtf8JsonBytes(value: unknown): number {
  try {
    const json = JSON.stringify(value);
    if (typeof json !== 'string') {
      return 0;
    }
    return measureUtf8StringBytes(json);
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}

/**
 * Resolves the browser extension local storage area following WebExtension / Chrome MV3 conventions
 * without importing browser polyfills that throw in non-extension contexts.
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
    layers: {},
    updatedAt: null,
    serializedBytes: 0,
    hasCorruptedData: false,
    unsupportedVersion: null,
    warnings: [],
    ...partial,
  };
}

interface DetailedLayerCheck {
  ok: true;
  asset: StoredCustomLayerAsset;
  astSerializedBytes: number;
}

interface DetailedLayerFailure {
  ok: false;
  reason: string;
  sizeExceeded: boolean;
}

/**
 * Validates all stored layer fields independently (layerId, filename, byteSize, viewBox,
 * SVG AST nodes + UTF-8 JSON size, placement bounds, and timestamp) with diagnostic messages.
 */
function validateLayerAssetDetailed(
  rawAsset: unknown,
  expectedLayerId: CharacterLayerId
): DetailedLayerCheck | DetailedLayerFailure {
  if (!isPlainObject(rawAsset)) {
    return {
      ok: false,
      reason: `Layer '${expectedLayerId}' record is not a valid object.`,
      sizeExceeded: false,
    };
  }

  if (!hasOnlyAllowedKeys(rawAsset, ALLOWED_LAYER_ASSET_KEYS)) {
    return {
      ok: false,
      reason: `Layer '${expectedLayerId}' contains unexpected or disallowed properties.`,
      sizeExceeded: false,
    };
  }

  if (rawAsset.layerId !== expectedLayerId) {
    return {
      ok: false,
      reason: `Layer record '${expectedLayerId}' has mismatched layerId '${String(rawAsset.layerId)}'.`,
      sizeExceeded: false,
    };
  }

  const { fileName, byteSize, sourceViewBox, parsedViewBox, nodes, placement, updatedAt } =
    rawAsset;

  if (
    typeof fileName !== 'string' ||
    fileName.trim().length === 0 ||
    fileName.length > CUSTOMIZATION_LIMITS.MAX_FILENAME_LENGTH ||
    CONTROL_CHAR_REGEX.test(fileName)
  ) {
    return {
      ok: false,
      reason: `Layer '${expectedLayerId}' has an invalid filename.`,
      sizeExceeded: false,
    };
  }

  if (typeof byteSize !== 'number' || !Number.isFinite(byteSize) || byteSize <= 0) {
    return {
      ok: false,
      reason: `Layer '${expectedLayerId}' has an invalid SVG byte size.`,
      sizeExceeded: false,
    };
  }

  if (byteSize > CUSTOMIZATION_LIMITS.MAX_SVG_FILE_BYTES) {
    return {
      ok: false,
      reason: `Layer '${expectedLayerId}' raw SVG size (${Math.ceil(byteSize / 1024)} KB) exceeds the ${CUSTOMIZATION_LIMITS.MAX_SVG_FILE_BYTES / 1024} KB limit.`,
      sizeExceeded: true,
    };
  }

  if (
    typeof sourceViewBox !== 'string' ||
    sourceViewBox.trim().length === 0 ||
    sourceViewBox.length > 128 ||
    CONTROL_CHAR_REGEX.test(sourceViewBox)
  ) {
    return {
      ok: false,
      reason: `Layer '${expectedLayerId}' has an invalid sourceViewBox string.`,
      sizeExceeded: false,
    };
  }

  if (!isPlainObject(parsedViewBox) || !hasOnlyAllowedKeys(parsedViewBox, ALLOWED_VIEWBOX_KEYS)) {
    return {
      ok: false,
      reason: `Layer '${expectedLayerId}' has malformed viewBox metadata.`,
      sizeExceeded: false,
    };
  }

  const { minX, minY, width, height } = parsedViewBox;
  if (
    typeof minX !== 'number' ||
    typeof minY !== 'number' ||
    typeof width !== 'number' ||
    typeof height !== 'number' ||
    !Number.isFinite(minX) ||
    !Number.isFinite(minY) ||
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    Math.abs(minX) > CUSTOMIZATION_LIMITS.MAX_SVG_NUMERIC_ABS ||
    Math.abs(minY) > CUSTOMIZATION_LIMITS.MAX_SVG_NUMERIC_ABS ||
    width <= 0 ||
    height <= 0 ||
    width > CUSTOMIZATION_LIMITS.MAX_SVG_NUMERIC_ABS ||
    height > CUSTOMIZATION_LIMITS.MAX_SVG_NUMERIC_ABS
  ) {
    return {
      ok: false,
      reason: `Layer '${expectedLayerId}' parsedViewBox dimensions are out of bounds or non-positive.`,
      sizeExceeded: false,
    };
  }

  const viewBoxParts = sourceViewBox.trim().split(/[\s,]+/).filter(Boolean);
  if (viewBoxParts.length !== 4 || viewBoxParts.some((part) => !Number.isFinite(Number(part)))) {
    return {
      ok: false,
      reason: `Layer '${expectedLayerId}' sourceViewBox string is malformed.`,
      sizeExceeded: false,
    };
  }

  if (!isPlainObject(placement) || !hasOnlyAllowedKeys(placement, ALLOWED_PLACEMENT_KEYS)) {
    return {
      ok: false,
      reason: `Layer '${expectedLayerId}' has malformed placement configuration.`,
      sizeExceeded: false,
    };
  }

  const { offsetX, offsetY, scale, fitMode } = placement;
  if (
    typeof offsetX !== 'number' ||
    typeof offsetY !== 'number' ||
    typeof scale !== 'number' ||
    !Number.isFinite(offsetX) ||
    !Number.isFinite(offsetY) ||
    !Number.isFinite(scale) ||
    offsetX < PLACEMENT_BOUNDS.MIN_OFFSET_X ||
    offsetX > PLACEMENT_BOUNDS.MAX_OFFSET_X ||
    offsetY < PLACEMENT_BOUNDS.MIN_OFFSET_Y ||
    offsetY > PLACEMENT_BOUNDS.MAX_OFFSET_Y ||
    scale < PLACEMENT_BOUNDS.MIN_SCALE ||
    scale > PLACEMENT_BOUNDS.MAX_SCALE ||
    (fitMode !== 'preserve-200x250' && fitMode !== 'fit-source-viewbox')
  ) {
    return {
      ok: false,
      reason: `Layer '${expectedLayerId}' placement values are invalid or out of allowed bounds.`,
      sizeExceeded: false,
    };
  }

  if (typeof updatedAt !== 'number' || !Number.isFinite(updatedAt) || updatedAt <= 0) {
    return {
      ok: false,
      reason: `Layer '${expectedLayerId}' has an invalid timestamp.`,
      sizeExceeded: false,
    };
  }

  const astCheck = validateSafeSvgNodes(nodes);
  if (!astCheck.ok) {
    return {
      ok: false,
      reason: `Layer '${expectedLayerId}' (${fileName.trim()}): ${astCheck.error}`,
      sizeExceeded: false,
    };
  }

  const astSerializedBytes = measureUtf8JsonBytes(astCheck.nodes);
  if (astSerializedBytes > CUSTOMIZATION_LIMITS.MAX_LAYER_AST_JSON_BYTES) {
    return {
      ok: false,
      reason: `Layer '${expectedLayerId}' serialized SVG AST (${Math.ceil(astSerializedBytes / 1024)} KB) exceeds the ${CUSTOMIZATION_LIMITS.MAX_LAYER_AST_JSON_BYTES / 1024} KB limit.`,
      sizeExceeded: true,
    };
  }

  const normalizedAsset = validateStoredCustomLayerAsset(rawAsset, expectedLayerId);
  if (!normalizedAsset) {
    return {
      ok: false,
      reason: `Layer '${expectedLayerId}' failed stored asset integrity verification.`,
      sizeExceeded: false,
    };
  }

  return {
    ok: true,
    asset: normalizedAsset,
    astSerializedBytes,
  };
}

/**
 * Validates and hydrates a raw value read from storage (or storage.onChanged) without ever
 * mutating the underlying persisted record. Invalid layers are rejected independently so
 * intact layers remain usable.
 */
export function hydrateStoredCustomizationRecord(
  rawValue: unknown
): LoadCustomCharacterAssetsResult {
  // Missing value in chrome.storage.local is treated as a clean default (zero custom assets).
  if (rawValue === undefined || rawValue === null) {
    return createEmptyLoadResult();
  }

  const warnings: CustomizationStorageWarning[] = [];

  if (!isPlainObject(rawValue)) {
    warnings.push({
      code: 'corrupted_root',
      message:
        'Stored character customization data is corrupted (expected an object). Using default character artwork without overwriting saved data.',
    });
    return createEmptyLoadResult({
      hasCorruptedData: true,
      warnings,
    });
  }

  // Strictly handle schema versioning without inventing automatic migrations
  const rawVersion = rawValue.version;
  if (rawVersion !== CUSTOM_CHARACTER_ASSETS_SCHEMA_VERSION) {
    const versionDisplay =
      typeof rawVersion === 'number' || typeof rawVersion === 'string'
        ? rawVersion
        : 'unknown';

    warnings.push({
      code: 'unsupported_version',
      message: `Unsupported character customization schema version (${String(versionDisplay)}). Expected version ${CUSTOM_CHARACTER_ASSETS_SCHEMA_VERSION}. Saved data was preserved untouched.`,
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

  const rawLayers = rawValue.layers;
  if (!isPlainObject(rawLayers)) {
    warnings.push({
      code: 'corrupted_layers_container',
      message:
        'Stored customization layers container is invalid. Ignoring custom layers without overwriting storage.',
    });
    return createEmptyLoadResult({
      updatedAt: rootUpdatedAt,
      hasCorruptedData: true,
      warnings,
    });
  }

  const validLayers: CustomCharacterLayersMap = {};

  for (const [layerKey, rawLayerAsset] of Object.entries(rawLayers)) {
    if (FORBIDDEN_OBJECT_KEYS.has(layerKey) || !CANONICAL_LAYER_SET.has(layerKey)) {
      hasCorruptedData = true;
      warnings.push({
        code: 'unknown_layer_key',
        layerId: layerKey,
        message: `Unrecognized custom layer slot '${layerKey}' in storage was ignored.`,
      });
      continue;
    }

    if (rawLayerAsset === undefined) {
      continue;
    }

    const layerId = layerKey as CharacterLayerId;
    const check = validateLayerAssetDetailed(rawLayerAsset, layerId);

    if (!check.ok) {
      hasCorruptedData = true;
      warnings.push({
        code: 'invalid_layer_asset',
        layerId,
        message: check.reason,
      });
      continue;
    }

    validLayers[layerId] = check.asset;
  }

  // Enforce ~1.5 MB aggregate UTF-8 byte budget on hydrated payload; if exceeded, drop trailing
  // layers in reverse manifest order so unaffected earlier layers stay intact.
  const keyBytes = measureUtf8StringBytes(STORAGE_KEY_CUSTOM_CHARACTER_ASSETS);
  const orderedIds = [...CANONICAL_CHARACTER_LAYER_IDS].filter(
    (id) => validLayers[id] !== undefined
  );
  let candidateRecord: StoredCharacterAssetCustomization = {
    version: CUSTOM_CHARACTER_ASSETS_SCHEMA_VERSION,
    layers: { ...validLayers },
    updatedAt: rootUpdatedAt ?? Date.now(),
  };
  let serializedBytes = measureUtf8JsonBytes(candidateRecord) + keyBytes;

  if (serializedBytes > CUSTOMIZATION_LIMITS.MAX_TOTAL_CUSTOM_ASSETS_BYTES) {
    hasCorruptedData = true;
    for (let i = orderedIds.length - 1; i >= 0; i -= 1) {
      if (serializedBytes <= CUSTOMIZATION_LIMITS.MAX_TOTAL_CUSTOM_ASSETS_BYTES) {
        break;
      }
      const droppedId = orderedIds[i];
      delete candidateRecord.layers[droppedId];
      warnings.push({
        code: 'aggregate_limit_exceeded',
        layerId: droppedId,
        message: `Custom layer '${droppedId}' exceeded the aggregate ${Math.round(CUSTOMIZATION_LIMITS.MAX_TOTAL_CUSTOM_ASSETS_BYTES / 1024)} KB storage budget and was omitted.`,
      });
      serializedBytes = measureUtf8JsonBytes(candidateRecord) + keyBytes;
    }
  }

  return {
    layers: candidateRecord.layers,
    updatedAt: rootUpdatedAt,
    serializedBytes,
    hasCorruptedData,
    unsupportedVersion: null,
    warnings,
  };
}

/**
 * Loads and fully re-validates persisted custom SVG layer assets from extension local storage.
 * Never throws and never silently overwrites corrupted or unsupported-version data.
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
    console.warn('[WebMate] Failed to read custom character assets from storage:', error);
    return createEmptyLoadResult({
      warnings: [
        {
          code: 'storage_read_failed',
          message:
            error instanceof Error && error.message
              ? `Failed to read custom character assets: ${error.message}`
              : 'Failed to read custom character assets from local storage.',
        },
      ],
    });
  }
}

/**
 * Validates the entire outgoing customization map (schema, per-layer AST & metadata, UTF-8
 * per-layer and aggregate byte budgets) and persists it atomically under chrome.storage.local.
 */
export async function saveCustomCharacterAssets(
  layers: CustomCharacterLayersMap
): Promise<SaveCustomCharacterAssetsResult> {
  if (!isPlainObject(layers)) {
    return {
      ok: false,
      code: 'invalid_input',
      message: 'Custom character layers payload must be a plain object.',
      failedLayerIds: [],
    };
  }

  for (const key of Object.keys(layers)) {
    if (FORBIDDEN_OBJECT_KEYS.has(key) || !CANONICAL_LAYER_SET.has(key)) {
      return {
        ok: false,
        code: 'invalid_input',
        message: `Cannot save unrecognized or disallowed character layer key '${key}'.`,
        failedLayerIds: [],
      };
    }
  }

  const validatedLayers: CustomCharacterLayersMap = {};
  const failedLayerIds: CharacterLayerId[] = [];
  const failureReasons: string[] = [];
  let hasSizeExceeded = false;

  for (const layerId of CANONICAL_CHARACTER_LAYER_IDS) {
    const candidate = layers[layerId];
    if (candidate === undefined) {
      continue;
    }

    const check = validateLayerAssetDetailed(candidate, layerId);
    if (!check.ok) {
      failedLayerIds.push(layerId);
      failureReasons.push(check.reason);
      if (check.sizeExceeded) {
        hasSizeExceeded = true;
      }
      continue;
    }

    validatedLayers[layerId] = check.asset;
  }

  if (failedLayerIds.length > 0) {
    return {
      ok: false,
      code: hasSizeExceeded ? 'layer_size_exceeded' : 'layer_validation_failed',
      message: failureReasons.join(' '),
      failedLayerIds,
    };
  }

  const outgoingRecord: StoredCharacterAssetCustomization = {
    version: CUSTOM_CHARACTER_ASSETS_SCHEMA_VERSION,
    layers: validatedLayers,
    updatedAt: Date.now(),
  };

  // Account for both the serialized JSON record and the storage key UTF-8 bytes
  const recordBytes = measureUtf8JsonBytes(outgoingRecord);
  const keyBytes = measureUtf8StringBytes(STORAGE_KEY_CUSTOM_CHARACTER_ASSETS);
  const totalSerializedBytes = recordBytes + keyBytes;

  if (totalSerializedBytes > CUSTOMIZATION_LIMITS.MAX_TOTAL_CUSTOM_ASSETS_BYTES) {
    return {
      ok: false,
      code: 'aggregate_limit_exceeded',
      message: `Total customization size (${Math.ceil(totalSerializedBytes / 1024)} KB) exceeds the ${Math.round(CUSTOMIZATION_LIMITS.MAX_TOTAL_CUSTOM_ASSETS_BYTES / 1024)} KB storage limit. Remove or simplify custom layers and try again.`,
      failedLayerIds: [],
      serializedBytes: totalSerializedBytes,
    };
  }

  const storageArea = getLocalStorageArea();
  if (!storageArea) {
    return {
      ok: false,
      code: 'storage_unavailable',
      message: 'Extension local storage is unavailable in this runtime context.',
      failedLayerIds: [],
      serializedBytes: totalSerializedBytes,
    };
  }

  try {
    await storageArea.set({ [STORAGE_KEY_CUSTOM_CHARACTER_ASSETS]: outgoingRecord });
    return {
      ok: true,
      record: outgoingRecord,
      serializedBytes: totalSerializedBytes,
    };
  } catch (error) {
    console.warn('[WebMate] Failed to save custom character assets to storage:', error);
    if (isStorageQuotaError(error)) {
      return {
        ok: false,
        code: 'quota_exceeded',
        message:
          'Extension local storage quota exceeded while saving custom artwork. Remove or simplify custom layers and try again.',
        failedLayerIds: [],
        serializedBytes: totalSerializedBytes,
      };
    }

    return {
      ok: false,
      code: 'storage_write_failed',
      message:
        error instanceof Error && error.message
          ? `Failed to save custom character assets: ${error.message}`
          : 'Failed to save custom character assets to local storage.',
      failedLayerIds: [],
      serializedBytes: totalSerializedBytes,
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
    console.warn('[WebMate] Failed to remove custom character assets from storage:', error);
    return {
      ok: false,
      code: 'storage_remove_failed',
      message:
        error instanceof Error && error.message
          ? `Failed to reset custom character assets: ${error.message}`
          : 'Failed to remove custom character assets from local storage.',
    };
  }
}
