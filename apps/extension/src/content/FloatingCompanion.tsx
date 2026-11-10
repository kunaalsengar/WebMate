import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { CHARACTER_RIG_SCALE } from '@webmate/shared';
import { CharacterRig } from '../character/CharacterRig';
import type { PointingAnimationDriver, PointingTarget } from '../character/animation';
import { characterArtworkRegistry } from '../character/artwork';
import { ChatDrawer } from '../character/chat';
import {
  buildMergedArtworkRegistry,
  getCustomizedCanonicalLayerIds,
} from '../character/customization';
import { CompanionPlaceholder } from './CompanionPlaceholder';
import { LayerCustomizationDrawer } from './customizer';
import { useCustomCharacterAssetsSync } from './customizationSync';
import { useCompanionStore, type CompanionState } from './store';
import { useDraggable } from './useDraggable';

/**
 * Isolated-world runtime API exposed on extension window for manual inspection and future triggers.
 */
export interface WebMateCompanionApi {
  pointAt: (target: PointingTarget) => void;
  stopPointing: () => void;
  isPointing: () => boolean;
  getCurrentPose: () => ReturnType<PointingAnimationDriver['getCurrentPose']>;
  getStore: () => typeof useCompanionStore;
}

declare global {
  interface Window {
    __WEBMATE__?: WebMateCompanionApi;
  }
}

/**
 * Floating Companion Component
 *
 * Requirements fulfilled:
 * - Wraps the companion in a GPU-accelerated fixed container with translate3d positioning.
 * - Handles pointer-based dragging across mouse, touch, and pen devices.
 * - Enforces viewport edge docking snap on pointer release with safe 16-24px margins.
 * - Mounts transparent CharacterRig foundation without any opaque backing card behind the character.
 * - Coordinates dynamic target pointing across scroll, resize, and drag/dock transitions.
 * - Preserves existing navy-and-white CompanionPlaceholder card.
 * - Maintains Shadow DOM isolation, grab/grabbing cursors, and touch/selection safety.
 */
export const FloatingCompanion: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mascotButtonRef = useRef<HTMLButtonElement>(null);
  const customizeButtonRef = useRef<HTMLButtonElement>(null);
  const pointingDriverRef = useRef<PointingAnimationDriver | null>(null);
  const { position, isDragging, isInitialized, dragProps } = useDraggable();
  useCustomCharacterAssetsSync();

  const characterExpression = useCompanionStore(
    (state: CompanionState) => state.characterExpression
  );
  const characterAnimationState = useCompanionStore(
    (state: CompanionState) => state.characterAnimationState
  );
  const showDevRig = useCompanionStore((state: CompanionState) => state.showDevRig);
  const pointingTarget = useCompanionStore((state: CompanionState) => state.pointingTarget);
  const avatarCustomization = useCompanionStore(
    (state: CompanionState) => state.avatarCustomization
  );
  const isCustomizerOpen = useCompanionStore((state: CompanionState) => state.isCustomizerOpen);
  const draftAvatarCustomization = useCompanionStore(
    (state: CompanionState) => state.draftAvatarCustomization
  );
  const openCustomizer = useCompanionStore((state: CompanionState) => state.openCustomizer);
  const closeCustomizer = useCompanionStore((state: CompanionState) => state.closeCustomizer);
  const isChatOpen = useCompanionStore((state: CompanionState) => state.isChatOpen);
  const toggleChat = useCompanionStore((state: CompanionState) => state.toggleChat);
  const closeChat = useCompanionStore((state: CompanionState) => state.closeChat);
  const messages = useCompanionStore((state: CompanionState) => state.messages);
  const isGenerating = useCompanionStore((state: CompanionState) => state.isGenerating);
  const addUserMessage = useCompanionStore((state: CompanionState) => state.addUserMessage);
  const clearConversation = useCompanionStore(
    (state: CompanionState) => state.clearConversation
  );

  const effectiveCustomization = useMemo(
    () =>
      isCustomizerOpen && draftAvatarCustomization !== null
        ? draftAvatarCustomization
        : avatarCustomization,
    [isCustomizerOpen, draftAvatarCustomization, avatarCustomization]
  );

  const customLayerCount = useMemo(
    () => getCustomizedCanonicalLayerIds(effectiveCustomization).length,
    [effectiveCustomization]
  );

  const assetRegistry = useMemo(
    () => buildMergedArtworkRegistry(effectiveCustomization, characterArtworkRegistry),
    [effectiveCustomization]
  );

  const handleToggleCustomizer = useCallback(() => {
    if (isCustomizerOpen) {
      closeCustomizer();
    } else {
      openCustomizer();
    }
  }, [closeCustomizer, isCustomizerOpen, openCustomizer]);

  const handlePointingDriverReady = useCallback((driver: PointingAnimationDriver) => {
    pointingDriverRef.current = driver;
  }, []);

  const handlePointingStop = useCallback(() => {
    const store = useCompanionStore.getState();
    if (store.pointingTarget !== null) {
      store.stopPointing();
    }
  }, []);

  // Expose isolated-world companion API safely for extension control & manual verification
  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.__WEBMATE__ = {
      pointAt: (target: PointingTarget) => useCompanionStore.getState().pointAt(target),
      stopPointing: () => useCompanionStore.getState().stopPointing(),
      isPointing: () => pointingDriverRef.current?.isPointing() ?? false,
      getCurrentPose: () => pointingDriverRef.current?.getCurrentPose() ?? null,
      getStore: () => useCompanionStore,
    };

    return () => {
      if (typeof window !== 'undefined' && window.__WEBMATE__) {
        delete window.__WEBMATE__;
      }
      pointingDriverRef.current = null;
    };
  }, []);

  return (
    <>
      <div
        id="webmate-floating-container"
        ref={containerRef}
        {...dragProps}
        role="region"
        aria-label="WebMate Floating Companion"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: isDragging
            ? 'none'
            : 'transform 0.28s cubic-bezier(0.2, 0.9, 0.3, 1)',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          opacity: isInitialized ? 1 : 0,
          pointerEvents: 'auto',
          zIndex: 2147483647,
          willChange: isDragging ? 'transform' : 'auto',
        }}
      >
        <div className="webmate-companion-composite flex flex-col items-center">
          {/* Interactive Mascot Trigger (toggles Chat Drawer cleanly without colliding with drag) */}
          <button
            ref={mascotButtonRef}
            type="button"
            className={`webmate-mascot-trigger ${isChatOpen ? 'is-chat-open' : ''} ${
              isDragging ? 'is-dragging' : ''
            }`}
            draggable={false}
            aria-expanded={isChatOpen}
            aria-controls="webmate-chat-drawer"
            aria-label={isChatOpen ? 'Close WebMate chat' : 'Open WebMate chat'}
            title={isChatOpen ? 'Close WebMate chat' : 'Chat with WebMate'}
            onClick={toggleChat}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && isChatOpen) {
                e.preventDefault();
                e.stopPropagation();
                closeChat();
              }
            }}
          >
            {/* Transparent Articulated Mascot Character Rig */}
            <CharacterRig
              expression={characterExpression}
              animationState={characterAnimationState}
              scale={CHARACTER_RIG_SCALE}
              showDevRig={showDevRig}
              isDragging={isDragging}
              pointingTarget={pointingTarget}
              companionPosition={position}
              onPointingDriverReady={handlePointingDriverReady}
              onPointingStop={handlePointingStop}
              assetRegistry={assetRegistry}
            />
          </button>
          {/* Navy-and-White Companion Badge */}
          <CompanionPlaceholder
            isDragging={isDragging}
            isCustomizerOpen={isCustomizerOpen}
            customLayerCount={customLayerCount}
            onToggleCustomizer={handleToggleCustomizer}
            customizeButtonRef={customizeButtonRef}
          />
        </div>
      </div>

      {/* Shadow DOM Built-in Avatar Studio Interface */}
      <LayerCustomizationDrawer
        dockSide={position.dockSide}
        assetRegistry={assetRegistry}
        customizeButtonRef={customizeButtonRef}
      />

      {/* Shadow DOM Conversational Chat Drawer */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={closeChat}
        messages={messages}
        isGenerating={isGenerating}
        onSendMessage={addUserMessage}
        onNewConversation={clearConversation}
        companionPosition={position}
        isDragging={isDragging}
        isAvatarStudioOpen={isCustomizerOpen}
        assetRegistry={assetRegistry}
        restoreFocusRef={mascotButtonRef}
      />
    </>
  );
};

export default FloatingCompanion;
