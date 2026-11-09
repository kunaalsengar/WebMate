import React from 'react';
import { ARTWORK_PALETTE } from './palette';

export interface ShadowArtworkProps {
  className?: string;
}

/**
 * Layer 0: Ground Contact Shadow Artwork
 *
 * Renders a soft, organic contact shadow beneath the character's sneakers.
 * Scales dynamically with the GSAP idle breathing and hop timelines around (100, 240).
 */
export const ShadowArtwork: React.FC<ShadowArtworkProps> = ({ className = '' }) => {
  return (
    <g className={`character-artwork-shadow ${className}`} pointerEvents="none">
      {/* Outer soft ambient shadow */}
      <ellipse
        cx="100"
        cy="240"
        rx="44"
        ry="8"
        fill={ARTWORK_PALETTE.shadowSoft}
      />
      {/* Core foot contact shadow (left foot) */}
      <ellipse
        cx="84"
        cy="240"
        rx="18"
        ry="5"
        fill={ARTWORK_PALETTE.shadowCore}
      />
      {/* Core foot contact shadow (right foot) */}
      <ellipse
        cx="116"
        cy="240"
        rx="18"
        ry="5"
        fill={ARTWORK_PALETTE.shadowCore}
      />
    </g>
  );
};
