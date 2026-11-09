import { create } from 'zustand';
import type {
  CharacterAnimationState,
  CharacterExpression,
  CompanionPosition,
  DockSide,
} from '@webmate/shared';
import { calculateDefaultPosition } from './docking';

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
  /** Action to set initialized position from storage or defaults */
  initializePosition: (position: CompanionPosition) => void;
  /** Action to reset position to default bottom-right */
  resetPosition: (viewportWidth: number, viewportHeight: number) => void;
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

  setPosition: (position) => set({ position }),
  setCoordinates: ({ x, y }) =>
    set((state) => ({ position: { ...state.position, x, y } })),
  setDockSide: (dockSide) =>
    set((state) => ({ position: { ...state.position, dockSide } })),
  setIsDragging: (isDragging) => set({ isDragging }),
  setIsVisible: (isVisible) => set({ isVisible }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setCharacterExpression: (characterExpression) => set({ characterExpression }),
  setCharacterAnimationState: (characterAnimationState) => set({ characterAnimationState }),
  setShowDevRig: (showDevRig) => set({ showDevRig }),
  initializePosition: (position) =>
    set({ position, isInitialized: true }),
  resetPosition: (viewportWidth, viewportHeight) =>
    set({
      position: calculateDefaultPosition(viewportWidth, viewportHeight),
      isInitialized: true,
    }),
}));
