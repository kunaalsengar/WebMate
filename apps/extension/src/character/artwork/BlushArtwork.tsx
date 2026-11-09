import React from 'react';
import { ARTWORK_PALETTE } from './palette';

export interface BlushArtworkProps {
  className?: string;
  opacity?: number;
}

/**
 * Layer 7: Cheek Blush Artwork
 *
 * Sits over the cheeks on either side of the anime face.
 * Dynamic opacity is modulated by expression state (e.g. 0.85 on happy, 0.15 on sleeping).
 */
export const BlushArtwork: React.FC<BlushArtworkProps> = ({ className = '' }) => {
  return (
    <g className={`character-artwork-blush ${className}`} pointerEvents="none">
      {/* Left Cheek Blush */}
      <ellipse
        cx="76"
        cy="102"
        rx="8"
        ry="4.5"
        fill={ARTWORK_PALETTE.blushPink}
        opacity="0.75"
      />
      {/* Left Cheek cute anime diagonal blush strokes */}
      <line x1="73" y1="104" x2="76" y2="100" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <line x1="77" y1="104" x2="80" y2="100" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />

      {/* Right Cheek Blush */}
      <ellipse
        cx="124"
        cy="102"
        rx="8"
        ry="4.5"
        fill={ARTWORK_PALETTE.blushPink}
        opacity="0.75"
      />
      {/* Right Cheek cute anime diagonal blush strokes */}
      <line x1="121" y1="104" x2="124" y2="100" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <line x1="125" y1="104" x2="128" y2="100" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
    </g>
  );
};
