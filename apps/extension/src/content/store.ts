import { create } from 'zustand';
import type {
  CharacterAnimationState,
  CharacterExpression,
  CompanionPosition,
  DockSide,
} from '@webmate/shared';
import type { PointingTarget } from '../character/animation';
import type { ChatMessage, ChatMessageStatus } from '../character/chat';
import {
  areAvatarCustomizationsEqual,
  DEFAULT_AVATAR_CUSTOMIZATION,
  normalizeAvatarCustomization,
  resetSectionInConfig,
  type AvatarCustomizationConfig,
  type CustomizationSectionId,
  type CustomizationStorageWarning,
  type CustomizationStorageWarningCode,
  type LimbEditTarget,
  type LoadCustomCharacterAssetsResult,
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
  'corrupted_selections_container',
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
    if (
      warning.code === 'corrupted_root' &&
      areAvatarCustomizationsEqual(result.customization, DEFAULT_AVATAR_CUSTOMIZATION)
    ) {
      return warning.message;
    }
  }

  return null;
}

const DUPLICATE_USER_SUBMIT_WINDOW_MS = 250;
let fallbackIdCounter = 0;

function createUniqueId(prefix: 'conv' | 'msg'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  fallbackIdCounter += 1;
  const randomSegment = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now()}_${fallbackIdCounter}_${randomSegment}`;
}

function normalizeMessageContent(content: string): string {
  return content.replace(/\r\n?/g, '\n').trim();
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

  /** Validated built-in avatar selections hydrated from local storage */
  avatarCustomization: AvatarCustomizationConfig;
  /** True while an asynchronous customization storage read is in flight */
  isCustomAssetsLoading: boolean;
  /** True after initial storage hydration or live storage sync has completed */
  hasLoadedCustomAssets: boolean;
  /** Timestamp of the currently hydrated customization record, if any */
  customAssetsUpdatedAt: number | null;
  /** True when stored customization contained invalid fields, bad keys, or version mismatch */
  customAssetsHasCorruptedData: boolean;
  /** Unsupported schema version reported when stored record version does not match v2 */
  unsupportedCustomAssetsVersion: number | string | null;
  /** Structured warnings describing ignored options, unsupported versions, or unavailable storage */
  customAssetsWarnings: CustomizationStorageWarning[];
  /** Fatal load, schema, or sync error message, if any */
  customAssetsError: string | null;

  /** Whether the Shadow DOM Avatar Studio customizer panel is currently open */
  isCustomizerOpen: boolean;
  /** Currently inspected studio customization section */
  selectedSectionId: CustomizationSectionId;
  /** Symmetrical edit target for Arms & Hands (both sides vs left/right individually) */
  armEditTarget: LimbEditTarget;
  /** Symmetrical edit target for Shoes & Footwear (both sides vs left/right individually) */
  shoeEditTarget: LimbEditTarget;
  /** Unsaved live-preview draft configuration while studio is open; null when closed */
  draftAvatarCustomization: AvatarCustomizationConfig | null;
  /** True while persisting or clearing avatar settings in chrome.storage.local */
  isSavingCustomAssets: boolean;

  /** Whether the conversational WebMate chat drawer is currently open (independent of Avatar Studio) */
  isChatOpen: boolean;
  /** Active in-memory conversation messages (not persisted to browser storage in Step 3.2) */
  messages: ChatMessage[];
  /** Identifier for the active conversation session, initialized on first message */
  conversationId: string | null;
  /** Reserved flag for future assistant streaming/generation state */
  isGenerating: boolean;

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
  /** Action resetting runtime customization state back to the default built-in mascot */
  clearCustomAssetsState: () => void;

  /** Opens the Shadow DOM Avatar Studio UI and seeds live draft state from saved settings */
  openCustomizer: (sectionId?: CustomizationSectionId) => void;
  /** Closes the Shadow DOM Avatar Studio UI and discards unapplied preview state */
  closeCustomizer: () => void;
  /** Switches the currently selected category/section in the Avatar Studio */
  setSelectedSectionId: (sectionId: CustomizationSectionId) => void;
  /** Sets the symmetrical edit mode for Arms & Hands */
  setArmEditTarget: (target: LimbEditTarget) => void;
  /** Sets the symmetrical edit mode for Shoes & Footwear */
  setShoeEditTarget: (target: LimbEditTarget) => void;
  /** Applies one or more built-in option changes to the live draft preview */
  updateDraftCustomization: (patch: Partial<AvatarCustomizationConfig>) => void;
  /** Resets only the active section (or active limb side) in the live draft back to defaults */
  resetDraftSection: (sectionId: CustomizationSectionId, limbTarget?: LimbEditTarget) => void;
  /** Resets all avatar options in the live draft back to default mascot */
  resetAllDraftCustomizations: () => void;
  /** Reverts pending live draft changes back to saved settings */
  discardDraftCustomizations: () => void;
  /** Updates saving indicator for customization persistence writes */
  setSavingCustomAssets: (isSaving: boolean) => void;
  /** Atomically applies a newly persisted customization payload to saved and draft state */
  applySavedCustomAssets: (result: LoadCustomCharacterAssetsResult) => void;

  /** Opens the WebMate chat drawer independently of Avatar Studio */
  openChat: () => void;
  /** Closes the WebMate chat drawer without resetting mascot position or Avatar Studio */
  closeChat: () => void;
  /** Toggles the WebMate chat drawer visibility */
  toggleChat: () => void;
  /** Validates, trims, deduplicates, and appends a local user message immutably */
  addUserMessage: (content: string) => ChatMessage | null;
  /** Appends an assistant message cleanly (reserved for future AI backend integration) */
  addAssistantMessage: (content: string, status?: ChatMessageStatus) => ChatMessage | null;
  /** Clears current local messages, conversation ID, and generation flag without altering UI position or Studio */
  clearConversation: () => void;
  /** Updates generation flag cleanly for future AI integration */
  setGenerating: (isGenerating: boolean) => void;
}

/**
 * Zustand store managing the companion's positioning, docking state, character rig, and Avatar Studio.
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

  avatarCustomization: { ...DEFAULT_AVATAR_CUSTOMIZATION },
  isCustomAssetsLoading: false,
  hasLoadedCustomAssets: false,
  customAssetsUpdatedAt: null,
  customAssetsHasCorruptedData: false,
  unsupportedCustomAssetsVersion: null,
  customAssetsWarnings: [],
  customAssetsError: null,

  isCustomizerOpen: false,
  selectedSectionId: 'head-face',
  armEditTarget: 'both',
  shoeEditTarget: 'both',
  draftAvatarCustomization: null,
  isSavingCustomAssets: false,
  isChatOpen: false,
  messages: [],
  conversationId: null,
  isGenerating: false,

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
    set((state) => {
      const nextSaved = { ...result.customization };
      let nextDraft = state.draftAvatarCustomization;

      if (state.isCustomizerOpen) {
        if (
          nextDraft === null ||
          areAvatarCustomizationsEqual(nextDraft, state.avatarCustomization)
        ) {
          nextDraft = { ...nextSaved };
        }
      }

      return {
        avatarCustomization: nextSaved,
        draftAvatarCustomization: nextDraft,
        isCustomAssetsLoading: false,
        hasLoadedCustomAssets: true,
        customAssetsUpdatedAt: result.updatedAt,
        customAssetsHasCorruptedData: result.hasCorruptedData,
        unsupportedCustomAssetsVersion: result.unsupportedVersion,
        customAssetsWarnings: [...result.warnings],
        customAssetsError: resolveCustomAssetsError(result),
      };
    }),
  setCustomAssetsError: (customAssetsError) => set({ customAssetsError }),
  clearCustomAssetsState: () =>
    set((state) => ({
      avatarCustomization: { ...DEFAULT_AVATAR_CUSTOMIZATION },
      draftAvatarCustomization: state.isCustomizerOpen
        ? { ...DEFAULT_AVATAR_CUSTOMIZATION }
        : null,
      isCustomAssetsLoading: false,
      hasLoadedCustomAssets: true,
      customAssetsUpdatedAt: null,
      customAssetsHasCorruptedData: false,
      unsupportedCustomAssetsVersion: null,
      customAssetsWarnings: [],
      customAssetsError: null,
    })),

  openCustomizer: (sectionId) =>
    set((state) => ({
      isCustomizerOpen: true,
      selectedSectionId: sectionId ?? state.selectedSectionId,
      draftAvatarCustomization:
        state.draftAvatarCustomization ?? { ...state.avatarCustomization },
    })),
  closeCustomizer: () =>
    set({
      isCustomizerOpen: false,
      draftAvatarCustomization: null,
      isSavingCustomAssets: false,
    }),
  setSelectedSectionId: (selectedSectionId) => set({ selectedSectionId }),
  setArmEditTarget: (armEditTarget) => set({ armEditTarget }),
  setShoeEditTarget: (shoeEditTarget) => set({ shoeEditTarget }),
  updateDraftCustomization: (patch) =>
    set((state) => {
      const base = state.draftAvatarCustomization ?? state.avatarCustomization;
      const next = normalizeAvatarCustomization({ ...base, ...patch });
      if (areAvatarCustomizationsEqual(next, base)) {
        return state;
      }
      return { draftAvatarCustomization: next };
    }),
  resetDraftSection: (sectionId, limbTarget = 'both') =>
    set((state) => {
      const base = state.draftAvatarCustomization ?? state.avatarCustomization;
      const next = resetSectionInConfig(base, sectionId, limbTarget);
      if (areAvatarCustomizationsEqual(next, base)) {
        return state;
      }
      return { draftAvatarCustomization: next };
    }),
  resetAllDraftCustomizations: () =>
    set((state) => {
      const base = state.draftAvatarCustomization ?? state.avatarCustomization;
      if (areAvatarCustomizationsEqual(base, DEFAULT_AVATAR_CUSTOMIZATION)) {
        return state;
      }
      return { draftAvatarCustomization: { ...DEFAULT_AVATAR_CUSTOMIZATION } };
    }),
  discardDraftCustomizations: () =>
    set((state) => ({
      draftAvatarCustomization: state.isCustomizerOpen
        ? { ...state.avatarCustomization }
        : null,
    })),
  setSavingCustomAssets: (isSavingCustomAssets) => set({ isSavingCustomAssets }),
  applySavedCustomAssets: (result) =>
    set((state) => ({
      avatarCustomization: { ...result.customization },
      draftAvatarCustomization: state.isCustomizerOpen
        ? { ...result.customization }
        : null,
      isSavingCustomAssets: false,
      isCustomAssetsLoading: false,
      hasLoadedCustomAssets: true,
      customAssetsUpdatedAt: result.updatedAt,
      customAssetsHasCorruptedData: result.hasCorruptedData,
      unsupportedCustomAssetsVersion: result.unsupportedVersion,
      customAssetsWarnings: [...result.warnings],
      customAssetsError: resolveCustomAssetsError(result),
    })),

  openChat: () => set({ isChatOpen: true }),
  closeChat: () => set({ isChatOpen: false }),
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  addUserMessage: (content) => {
    const trimmed = normalizeMessageContent(content);
    if (trimmed.length === 0) {
      return null;
    }

    const now = Date.now();
    let createdMessage: ChatMessage | null = null;

    set((state) => {
      if (state.isGenerating) {
        return state;
      }

      const lastMessage = state.messages[state.messages.length - 1];
      if (
        lastMessage &&
        lastMessage.role === 'user' &&
        lastMessage.content === trimmed &&
        now - lastMessage.createdAt < DUPLICATE_USER_SUBMIT_WINDOW_MS
      ) {
        return state;
      }

      const message: ChatMessage = {
        id: createUniqueId('msg'),
        role: 'user',
        content: trimmed,
        createdAt: now,
        status: 'sent',
      };
      createdMessage = message;

      return {
        conversationId: state.conversationId ?? createUniqueId('conv'),
        messages: [...state.messages, message],
      };
    });

    return createdMessage;
  },
  addAssistantMessage: (content, status = 'sent') => {
    const normalized = normalizeMessageContent(content);
    if (normalized.length === 0 && status !== 'pending' && status !== 'error') {
      return null;
    }

    let createdMessage: ChatMessage | null = null;

    set((state) => {
      const message: ChatMessage = {
        id: createUniqueId('msg'),
        role: 'assistant',
        content: normalized,
        createdAt: Date.now(),
        status,
      };
      createdMessage = message;

      return {
        conversationId: state.conversationId ?? createUniqueId('conv'),
        messages: [...state.messages, message],
      };
    });

    return createdMessage;
  },
  clearConversation: () =>
    set({
      messages: [],
      conversationId: null,
      isGenerating: false,
    }),
  setGenerating: (isGenerating) => set({ isGenerating }),
}));
