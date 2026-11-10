import { create } from 'zustand';
import type {
  CharacterAnimationState,
  CharacterExpression,
  CompanionPosition,
  DockSide,
} from '@webmate/shared';
import type { PointingTarget } from '../character/animation';
import type {
  CustomCharacterLayersMap,
  CustomizationStorageWarning,
  CustomizationStorageWarningCode,
  LoadCustomCharacterAssetsResult,
} from '../character/customization';
import { calculateDefaultPosition } from './docking';

const INCOMPATIBLE_POINTING_STATES = new Set<CharacterAnimationState>([
  'waving',
  'thinking',
  'explaining',
  'happy',
  'sleeping',
]);

const FATAL_STORAGE_WARNING_CODES = new Set<CustomizationStorageWarningCode>([
  'storage_read_failed',
  'unsupported_version',
  'corrupted_layers_container',
]);

function resolveCustomAssetsError(result: LoadCustomCharacterAssetsResult): string | null {
  if (result.unsupportedVersion !== null) {
    const versionWarning = result.warnings.find((w) => w.code === 'unsupported_version');
    if (versionWarning) {
      return versionWarning.message;
    }
  }

  for (const warning of result.warnings) {
    if (FATAL_STORAGE_WARNING_CODES.has(warning.code)) {
      return warning.message;
    }
    if (warning.code === 'corrupted_root' && Object.keys(result.layers).length === 0) {
      return warning.message;
    }
  }

  return null;
}

/**
 * State contract for WebMate's floating companion runtime store.
 */
export interface CompanionState {
  /** Current 2D coordinates and dock orientation */
  position: CompanionPosition;
  /** Whether an active drag gesture is currently underway */
  isDragging: boolean;
  /** Visibility toggle for the companion */
  isVisible: boolean;
  /** True once saved position has been loaded from storage */
  isInitialized: boolean;
  /** Active UI tab (baseline for future chat/info panels) */
  activeTab: string;
  /** Active character expression preset */
  characterExpression: CharacterExpression;
  /** Active character animation behavioral state */
  characterAnimationState: CharacterAnimationState;
  /** Toggle for development wireframe preview of character anchors and slots */
  showDevRig: boolean;
  /** Active viewport target for dynamic character pointing (HTMLElement or DOMRect) */
  pointingTarget: PointingTarget | null;
  /** Validated custom per-layer SVG assets hydrated from local storage */
  customLayers: CustomCharacterLayersMap;
  /** True while an asynchronous customization storage read is in flight */
  isCustomAssetsLoading: boolean;
  /** True after initial storage hydration or live storage sync has completed */
  hasLoadedCustomAssets: boolean;
  /** Timestamp of the currently hydrated customization record, if any */
  customAssetsUpdatedAt: number | null;
  /** Serialized UTF-8 byte count of the hydrated customization record */
  customAssetsSerializedBytes: number;
  /** True when stored customization contained invalid fields, bad layer slots, or version mismatch */
  customAssetsHasCorruptedData: boolean;
  /** Unsupported schema version reported when stored record version does not match v1 */
  unsupportedCustomAssetsVersion: number | string | null;
  /** Structured warnings describing ignored layers, unsupported versions, or unavailable storage */
  customAssetsWarnings: CustomizationStorageWarning[];
  /** Fatal load or schema error message, if any */
  customAssetsError: string | null;

  /** Action to update complete position and dockSide */
  setPosition: (position: CompanionPosition) => void;
  /** Action to update 2D coordinates without changing dockSide */
  setCoordinates: (coords: { x: number; y: number }) => void;
  /** Action to update dockSide orientation */
  setDockSide: (dockSide: DockSide) => void;
  /** Action to toggle drag state */
  setIsDragging: (isDragging: boolean) => void;
  /** Action to toggle visibility */
  setIsVisible: (isVisible: boolean) => void;
  /** Action to change active tab */
  setActiveTab: (tab: string) => void;
  /** Action to change character expression */
  setCharacterExpression: (expression: CharacterExpression) => void;
  /** Action to change character animation state */
  setCharacterAnimationState: (state: CharacterAnimationState) => void;
  /** Action to toggle developer rig wireframe mode */
  setShowDevRig: (show: boolean) => void;
  /** Points the mascot dynamically toward an HTMLElement or viewport bounding rectangle */
  pointAt: (target: PointingTarget) => void;
  /** Interrupts active pointing and settles mascot back to neutral/resting pose */
  stopPointing: () => void;
  /** Action to set initialized position from storage or defaults */
  initializePosition: (position: CompanionPosition) => void;
  /** Action to reset position to default bottom-right */
  resetPosition: (viewportWidth: number, viewportHeight: number) => void;
  /** Action to update customization loading status */
  setCustomAssetsLoading: (isLoading: boolean) => void;
  /** Action applying a validated LoadCustomCharacterAssetsResult to runtime state */
  applyHydratedCustomAssets: (result: LoadCustomCharacterAssetsResult) => void;
  /** Action to record or clear a customization load/sync error message */
  setCustomAssetsError: (error: string | null) => void;
  /** Action resetting runtime customization state back to the empty default state */
  clearCustomAssetsState: () => void;
}

/**
 * Zustand store managing the companion's positioning, docking state, and character rig.
 */
export const useCompanionStore = create<CompanionState>((set) => ({
  position: { x: 0, y: 0, dockSide: 'right' },
  isDragging: false,
  isVisible: true,
  isInitialized: false,
  activeTab: 'chat',
  characterExpression: 'normal',
  characterAnimationState: 'idle',
  showDevRig: false,
  pointingTarget: null,
  customLayers: {},
  isCustomAssetsLoading: false,
  hasLoadedCustomAssets: false,
  customAssetsUpdatedAt: null,
  customAssetsSerializedBytes: 0,
  customAssetsHasCorruptedData: false,
  unsupportedCustomAssetsVersion: null,
  customAssetsWarnings: [],
  customAssetsError: null,

  setPosition: (position) => set({ position }),
  setCoordinates: ({ x, y }) =>
    set((state) => ({ position: { ...state.position, x, y } })),
  setDockSide: (dockSide) =>
    set((state) => ({ position: { ...state.position, dockSide } })),
  setIsDragging: (isDragging) => set({ isDragging }),
  setIsVisible: (isVisible) => set({ isVisible }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setCharacterExpression: (characterExpression) => set({ characterExpression }),
  setCharacterAnimationState: (characterAnimationState) =>
    set((state) => ({
      characterAnimationState,
      pointingTarget: INCOMPATIBLE_POINTING_STATES.has(characterAnimationState)
        ? null
        : state.pointingTarget,
    })),
  setShowDevRig: (showDevRig) => set({ showDevRig }),
  pointAt: (pointingTarget) =>
    set((state) => ({
      pointingTarget,
      characterAnimationState: INCOMPATIBLE_POINTING_STATES.has(state.characterAnimationState)
        ? 'idle'
        : state.characterAnimationState,
    })),
  stopPointing: () => set({ pointingTarget: null }),
  initializePosition: (position) =>
    set({ position, isInitialized: true }),
  resetPosition: (viewportWidth, viewportHeight) =>
    set({
      position: calculateDefaultPosition(viewportWidth, viewportHeight),
      isInitialized: true,
    }),
  setCustomAssetsLoading: (isCustomAssetsLoading) =>
    set((state) => ({
      isCustomAssetsLoading,
      customAssetsError: isCustomAssetsLoading ? null : state.customAssetsError,
    })),
  applyHydratedCustomAssets: (result) =>
    set({
      customLayers: { ...result.layers },
      isCustomAssetsLoading: false,
      hasLoadedCustomAssets: true,
      customAssetsUpdatedAt: result.updatedAt,
      customAssetsSerializedBytes: result.serializedBytes,
      customAssetsHasCorruptedData: result.hasCorruptedData,
      unsupportedCustomAssetsVersion: result.unsupportedVersion,
      customAssetsWarnings: [...result.warnings],
      customAssetsError: resolveCustomAssetsError(result),
    }),
  setCustomAssetsError: (customAssetsError) => set({ customAssetsError }),
  clearCustomAssetsState: () =>
    set({
      customLayers: {},
      isCustomAssetsLoading: false,
      hasLoadedCustomAssets: true,
      customAssetsUpdatedAt: null,
      customAssetsSerializedBytes: 0,
      customAssetsHasCorruptedData: false,
      unsupportedCustomAssetsVersion: null,
      customAssetsWarnings: [],
      customAssetsError: null,
    }),
}));
