import React, { useCallback, useEffect, useRef } from 'react';
import { CharacterRig } from '../character/CharacterRig';
import type { PointingAnimationDriver, PointingTarget } from '../character/animation';
import { characterArtworkRegistry } from '../character/artwork';
import { CompanionPlaceholder } from './CompanionPlaceholder';
import { CHARACTER_RIG_SCALE } from '@webmate/shared';
import { useCompanionStore } from './store';
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
  const pointingDriverRef = useRef<PointingAnimationDriver | null>(null);
  const { position, isDragging, isInitialized, dragProps } = useDraggable();
  const { characterExpression, characterAnimationState, showDevRig, pointingTarget } =
    useCompanionStore();

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
          assetRegistry={characterArtworkRegistry}
        />
        {/* Existing Navy-and-White Companion Badge */}
        <CompanionPlaceholder isDragging={isDragging} />
      </div>
    </div>
  );
};

export default FloatingCompanion;
