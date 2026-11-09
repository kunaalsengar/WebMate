import React from 'react';
import { ARTWORK_PALETTE } from './palette';

export interface LegLeftArtworkProps {
  className?: string;
}

/**
 * Layer 1: Background Left Leg & Sneaker Artwork
 *
 * Articulates from left hip anchor (88, 200).
 * Features warm peach calf skin, white athletic ankle sock, and a sporty cyan sneaker.
 */
export const LegLeftArtwork: React.FC<LegLeftArtworkProps> = ({ className = '' }) => {
  return (
    <g className={`character-artwork-leg-left ${className}`}>
      {/* 1. Calf Skin */}
      <path
        d="M 83 194 L 83 222 C 83 223 85 224 88 224 C 91 224 93 223 93 222 L 93 194 Z"
        fill={ARTWORK_PALETTE.skinBase}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        strokeLinejoin="round"
      />
      {/* Calf subtle inner shadow */}
      <path
        d="M 83 196 L 83 222 C 83 223 85 223.5 86 223.5 L 86 196 Z"
        fill={ARTWORK_PALETTE.skinShadow}
      />

      {/* 2. Athletic Sock */}
      <path
        d="M 81.5 221 C 81.5 220 84 219.5 88 219.5 C 92 219.5 94.5 220 94.5 221 L 95 227 C 95 228 92 228.5 88 228.5 C 84 228.5 81 228 81 227 Z"
        fill={ARTWORK_PALETTE.sockWhite}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        strokeLinejoin="round"
      />
      {/* Sock ribbing accent line */}
      <path
        d="M 82.5 224 C 85 223.5 91 223.5 93.5 224"
        fill="none"
        stroke={ARTWORK_PALETTE.sockShadow}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* 3. Sporty Cyan Sneaker */}
      {/* Sneaker main upper */}
      <path
        d="M 81 226 C 77 227 72 231 71 234 C 70.5 235.5 71 237 72 237 L 96 237 C 97.5 237 98 235.5 97.5 233 C 97 230 94 227 92 226 Z"
        fill={ARTWORK_PALETTE.sneakerTeal}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        strokeLinejoin="round"
      />

      {/* Sneaker white curved speed swoosh / side stripe */}
      <path
        d="M 78 233.5 Q 85 230 92 232"
        fill="none"
        stroke={ARTWORK_PALETTE.sneakerWhite}
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* White rubber toe cap */}
      <path
        d="M 71 234 C 71.5 232 75 231 77 231.5 L 77 237 L 72 237 C 71 237 70.8 235.5 71 234 Z"
        fill={ARTWORK_PALETTE.sneakerWhite}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
        strokeLinejoin="round"
      />

      {/* Sneaker white rubber midsole & black bottom tread */}
      <path
        d="M 69.5 236 L 97.5 236 C 98.5 236 99 237.5 98.5 239 L 69 239 C 68.5 237.5 68.8 236 69.5 236 Z"
        fill={ARTWORK_PALETTE.sneakerWhite}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        strokeLinejoin="round"
      />
      {/* Bottom grip tread */}
      <line
        x1="70"
        y1="239"
        x2="98"
        y2="239"
        stroke={ARTWORK_PALETTE.sneakerTread}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Elastic laces */}
      <line x1="82" y1="228" x2="86" y2="230" stroke={ARTWORK_PALETTE.sneakerLace} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="83" y1="231" x2="87" y2="233" stroke={ARTWORK_PALETTE.sneakerLace} strokeWidth="1.2" strokeLinecap="round" />
    </g>
  );
};
