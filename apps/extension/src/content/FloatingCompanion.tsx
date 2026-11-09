import React, { useRef } from 'react';
import { CompanionPlaceholder } from './CompanionPlaceholder';
import { useDraggable } from './useDraggable';

/**
 * Floating Companion Component
 *
 * Requirements fulfilled:
 * - Wraps the companion in a GPU-accelerated fixed container with translate3d positioning.
 * - Handles pointer-based dragging across mouse, touch, and pen devices.
 * - Enforces viewport edge docking snap on pointer release with safe 16-24px margins.
 * - Applies grab / grabbing cursor states.
 * - Disables user selection and page touch-scrolling during drag.
 * - Applies smooth spring transitions when snapping to docked edge and instant response during drag.
 * - Subtly elevates the card while dragging.
 */
export const FloatingCompanion: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { position, isDragging, isInitialized, dragProps } = useDraggable();

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
      <CompanionPlaceholder isDragging={isDragging} />
    </div>
  );
};

export default FloatingCompanion;

