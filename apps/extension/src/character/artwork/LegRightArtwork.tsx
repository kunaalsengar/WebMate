import React from 'react';
import { ARTWORK_PALETTE } from './palette';

export interface LegRightArtworkProps {
  className?: string;
}

/**
 * Layer 3: Foreground Right Leg & Sneaker Artwork
 *
 * Articulates from right hip anchor (112, 200).
 * Sits in foreground leg plane.
 * Features warm peach calf skin, white athletic ankle sock, and matching cyan sneaker.
 */
export const LegRightArtwork: React.FC<LegRightArtworkProps> = ({ className = '' }) => {
  return (
    <g className={`character-artwork-leg-right ${className}`}>
      {/* 1. Calf Skin */}
      <path
        d="M 107 194 L 107 222 C 107 223 109 224 112 224 C 115 224 117 223 117 222 L 117 194 Z"
        fill={ARTWORK_PALETTE.skinBase}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        strokeLinejoin="round"
      />
      {/* Calf subtle inner shadow */}
      <path
        d="M 115 196 L 115 222 C 115 223 114 223.5 113 223.5 L 113 196 Z"
        fill={ARTWORK_PALETTE.skinShadow}
      />

      {/* 2. Athletic Sock */}
      <path
        d="M 105.5 221 C 105.5 220 108 219.5 112 219.5 C 116 219.5 118.5 220 118.5 221 L 119 227 C 119 228 116 228.5 112 228.5 C 108 228.5 105 228 105 227 Z"
        fill={ARTWORK_PALETTE.sockWhite}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        strokeLinejoin="round"
      />
      {/* Sock ribbing accent line */}
      <path
        d="M 106.5 224 C 109 223.5 115 223.5 117.5 224"
        fill="none"
        stroke={ARTWORK_PALETTE.sockShadow}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* 3. Sporty Cyan Sneaker (Foreground angle) */}
      {/* Sneaker main upper */}
      <path
        d="M 108 226 C 106 227 103 230 102.5 233 C 102 235.5 102.5 237 104 237 L 128 237 C 129 237 129.5 235.5 129 234 C 128 231 123 227 119 226 Z"
        fill={ARTWORK_PALETTE.sneakerTeal}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        strokeLinejoin="round"
      />

      {/* Sneaker white curved speed swoosh / side stripe */}
      <path
        d="M 108 232 Q 115 230 122 233.5"
        fill="none"
        stroke={ARTWORK_PALETTE.sneakerWhite}
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* White rubber toe cap (facing slightly right/forward) */}
      <path
        d="M 123 231.5 C 125 232 128.5 232 129 234 C 129.5 235.5 129 237 128 237 L 123 237 Z"
        fill={ARTWORK_PALETTE.sneakerWhite}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
        strokeLinejoin="round"
      />

      {/* Sneaker white rubber midsole & black bottom tread */}
      <path
        d="M 101.5 236 L 130 236 C 131 236 131.2 237.5 130.5 239 L 101 239 C 100.5 237.5 100.8 236 101.5 236 Z"
        fill={ARTWORK_PALETTE.sneakerWhite}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        strokeLinejoin="round"
      />
      {/* Bottom grip tread */}
      <line
        x1="102"
        y1="239"
        x2="130"
        y2="239"
        stroke={ARTWORK_PALETTE.sneakerTread}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Elastic laces */}
      <line x1="113" y1="228" x2="117" y2="230" stroke={ARTWORK_PALETTE.sneakerLace} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="113" y1="231" x2="117" y2="233" stroke={ARTWORK_PALETTE.sneakerLace} strokeWidth="1.2" strokeLinecap="round" />
    </g>
  );
};
