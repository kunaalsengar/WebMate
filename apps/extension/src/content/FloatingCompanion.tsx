import React, { useRef } from 'react';
import { CharacterRig } from '../character/CharacterRig';
import { characterArtworkRegistry } from '../character/artwork';
import { CompanionPlaceholder } from './CompanionPlaceholder';
import { CHARACTER_RIG_SCALE } from '@webmate/shared';
import { useCompanionStore } from './store';
import { useDraggable } from './useDraggable';

/**
 * Floating Companion Component
 *
 * Requirements fulfilled:
 * - Wraps the companion in a GPU-accelerated fixed container with translate3d positioning.
 * - Handles pointer-based dragging across mouse, touch, and pen devices.
 * - Enforces viewport edge docking snap on pointer release with safe 16-24px margins.
 * - Mounts transparent CharacterRig foundation without any opaque backing card behind the character.
 * - Preserves existing navy-and-white CompanionPlaceholder card.
 * - Maintains Shadow DOM isolation, grab/grabbing cursors, and touch/selection safety.
 */
export const FloatingCompanion: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { position, isDragging, isInitialized, dragProps } = useDraggable();
  const { characterExpression, characterAnimationState, showDevRig } = useCompanionStore();

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
          assetRegistry={characterArtworkRegistry}
        />
        {/* Existing Navy-and-White Companion Badge */}
        <CompanionPlaceholder isDragging={isDragging} />
      </div>
    </div>
  );
};

export default FloatingCompanion;
