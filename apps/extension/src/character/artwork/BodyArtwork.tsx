import React from 'react';
import { ARTWORK_PALETTE } from './palette';

export interface BodyArtworkProps {
  className?: string;
}

/**
 * Layer 4: Torso, Shirt & Shorts Artwork
 *
 * Articulates from torso anchor (100, 170).
 * Features:
 * - Poppy red-orange crewneck t-shirt with stylized gold/white chest emblem.
 * - Contrasting warm mustard yellow shorts with pocket creases and center inseam.
 */
export const BodyArtwork: React.FC<BodyArtworkProps> = ({ className = '' }) => {
  return (
    <g className={`character-artwork-body ${className}`}>
      {/* ========================================================
          1. MUSTARD YELLOW SHORTS (Layered underneath shirt hem)
          ======================================================== */}
      {/* Shorts main silhouette */}
      <path
        d="M 76 172 
           L 74 195 C 74 198 77 199 82 199 L 96 199 C 98 199 99 197 100 194 
           C 101 197 102 199 104 199 L 118 199 C 123 199 126 198 126 195 
           L 124 172 Z"
        fill={ARTWORK_PALETTE.shortsBase}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        strokeLinejoin="round"
      />

      {/* Shorts right side & inseam fold shadow */}
      <path
        d="M 100 194 C 101 197 102 199 104 199 L 118 199 C 123 199 126 198 126 195 L 125 174 C 122 178 116 182 110 183 L 100 194 Z"
        fill={ARTWORK_PALETTE.shortsShadow}
      />
      {/* Inseam divider stroke */}
      <path
        d="M 100 186 L 100 194"
        fill="none"
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
        strokeLinecap="round"
      />
      {/* Left pocket seam */}
      <path
        d="M 77 178 C 82 181 85 186 86 191"
        fill="none"
        stroke={ARTWORK_PALETTE.shortsShadow}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Right pocket seam */}
      <path
        d="M 123 178 C 118 181 115 186 114 191"
        fill="none"
        stroke={ARTWORK_PALETTE.shortsShadow}
        strokeWidth="1.3"
        strokeLinecap="round"
      />

      {/* ========================================================
          2. RED-ORANGE T-SHIRT (Torso Main)
          ======================================================== */}
      {/* Shirt main body */}
      <path
        d="M 74 130 
           C 78 126 90 123 100 123 
           C 110 123 122 126 126 130 
           L 125 173 
           C 115 175 105 176 100 176 
           C 95 176 85 175 75 173 
           Z"
        fill={ARTWORK_PALETTE.shirtBase}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        strokeLinejoin="round"
      />

      {/* Shirt right flank depth shadow */}
      <path
        d="M 116 130 C 120 133 125 137 125 145 L 125 173 C 120 174.5 114 175.5 110 175.5 L 112 142 Z"
        fill={ARTWORK_PALETTE.shirtShadow}
      />

      {/* Shirt subtle left shoulder fold highlight */}
      <path
        d="M 77 132 C 82 128 92 126 96 126 L 95 128 C 90 128 82 130 78 134 Z"
        fill={ARTWORK_PALETTE.shirtHighlight}
      />

      {/* Bottom shirt hem fold curve */}
      <path
        d="M 77 172 Q 100 176 123 172"
        fill="none"
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* ========================================================
          3. CREWNECK COLLAR & NECK RECESS
          ======================================================== */}
      {/* Collar ribbing band */}
      <path
        d="M 88 123 C 92 127 108 127 112 123 C 114 125 113 129 108 131 C 103 132.5 97 132.5 92 131 C 87 129 86 125 88 123 Z"
        fill={ARTWORK_PALETTE.collarBase}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
        strokeLinejoin="round"
      />

      {/* ========================================================
          4. ORIGINAL CHEST GRAPHIC: STYLIZED "W" LIGHTNING EMBLEM
          ======================================================== */}
      <g className="shirt-emblem" pointerEvents="none">
        {/* Emblem outer white backing */}
        <polygon
          points="95,142 101,142 98,148 104,148 97,159 99,151 94,151"
          fill={ARTWORK_PALETTE.emblemWhite}
          stroke={ARTWORK_PALETTE.strokeDark}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Emblem inner gold bolt */}
        <polygon
          points="96,143 100,143 97.5,148.5 103,148.5 97.5,157 99,151.5 94.5,151.5"
          fill={ARTWORK_PALETTE.emblemYellow}
        />
      </g>
    </g>
  );
};
