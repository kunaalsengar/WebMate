import React from 'react';
import { ARTWORK_PALETTE } from './palette';

export interface ArmLeftArtworkProps {
  className?: string;
}

/**
 * Layer 2: Background Left Arm Artwork
 *
 * Articulates from left shoulder anchor (70, 135).
 * Sits in background plane behind torso.
 * Features red-orange short sleeve cuff, smooth peach forearm, and stylized relaxed hand.
 */
export const ArmLeftArtwork: React.FC<ArmLeftArtworkProps> = ({ className = '' }) => {
  return (
    <g className={`character-artwork-arm-left ${className}`}>
      {/* 1. Upper Arm Sleeve Cuff (Red-Orange) */}
      <path
        d="M 64 130 C 67 127 75 128 78 131 L 76 142 C 73 144 66 143 63 140 Z"
        fill={ARTWORK_PALETTE.shirtBase}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        strokeLinejoin="round"
      />
      {/* Sleeve cuff inner shadow */}
      <path
        d="M 63 140 C 66 143 73 144 76 142 L 75 144 C 71 146 65 144 62 141 Z"
        fill={ARTWORK_PALETTE.shirtShadow}
      />

      {/* 2. Bare Forearm Skin */}
      <path
        d="M 66 140 L 61 166 C 60.5 168 62 170 64 170 L 71 168 C 73 167 73.5 165 73.5 163 L 73.5 142 Z"
        fill={ARTWORK_PALETTE.skinBase}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        strokeLinejoin="round"
      />
      {/* Forearm subtle soft shadow */}
      <path
        d="M 66 140 L 61 166 C 61 167 61.5 168 63 168 L 64 141 Z"
        fill={ARTWORK_PALETTE.skinShadow}
      />

      {/* 3. Stylized Hand (Relaxed fist / mitten with thumb) */}
      <path
        d="M 61 168 C 58 171 57 176 59 180 C 61 184 66 184 69 181 C 72 178 72 172 70 169 Z"
        fill={ARTWORK_PALETTE.skinBase}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        strokeLinejoin="round"
      />
      {/* Thumb curve */}
      <path
        d="M 62 171 C 60 173 60 176 62 177"
        fill="none"
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
        strokeLinecap="round"
      />
      {/* Subtle finger knuckle crease */}
      <path
        d="M 64 179 C 66 180 67 179 68 177"
        fill="none"
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </g>
  );
};
