import React from 'react';
import { ARTWORK_PALETTE } from './palette';

export interface ArmRightArtworkProps {
  className?: string;
}

/**
 * Layer 5: Articulated Foreground Right Arm Artwork
 *
 * Articulates from right shoulder anchor (130, 135).
 * Sits in foreground arm plane.
 * Coordinates with GSAP waving (up to 52° lift), explaining (directional pointing),
 * and thinking (hand near chin) timelines.
 */
export const ArmRightArtwork: React.FC<ArmRightArtworkProps> = ({ className = '' }) => {
  return (
    <g className={`character-artwork-arm-right ${className}`}>
      {/* 1. Upper Arm Sleeve Cuff (Red-Orange) */}
      <path
        d="M 122 131 C 125 128 133 127 136 130 L 137 140 C 134 143 127 144 124 142 Z"
        fill={ARTWORK_PALETTE.shirtBase}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        strokeLinejoin="round"
      />
      {/* Sleeve cuff inner shadow */}
      <path
        d="M 124 142 C 127 144 134 143 137 140 L 138 141 C 135 144 128 145 125 143 Z"
        fill={ARTWORK_PALETTE.shirtShadow}
      />

      {/* 2. Bare Forearm Skin */}
      <path
        d="M 126.5 142 L 133 166 C 133.5 168 135 170 137 170 L 144 167 C 145.5 165 145 163 144.5 161 L 135 140 Z"
        fill={ARTWORK_PALETTE.skinBase}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        strokeLinejoin="round"
      />
      {/* Forearm subtle soft shadow */}
      <path
        d="M 135 140 L 144.5 161 C 144.5 162 144 164 142 165 L 134 142 Z"
        fill={ARTWORK_PALETTE.skinShadow}
      />

      {/* 3. Articulated Hand (Expressive cartoon hand with defined thumb and fingers) */}
      <path
        d="M 134 168 
           C 131 171 130 176 132 180 
           C 134 184 139 184 142 181 
           C 145 178 145 172 143 169 
           Z"
        fill={ARTWORK_PALETTE.skinBase}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        strokeLinejoin="round"
      />
      {/* Defined Thumb */}
      <path
        d="M 135 171 C 137 173 137 176 135 178"
        fill="none"
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
        strokeLinecap="round"
      />
      {/* Defined Finger Knuckle Creases */}
      <path
        d="M 137 179 C 139 180 140 179 141 177"
        fill="none"
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </g>
  );
};
