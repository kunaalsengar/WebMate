import React from 'react';
import type { CharacterExpression } from '@webmate/shared';
import { ARTWORK_PALETTE } from './palette';

export interface EffectsArtworkProps {
  expression?: CharacterExpression;
  className?: string;
}

/**
 * Layer 11: Emotional FX Overlays Artwork
 *
 * Articulates with head pivot (100, 115).
 * Renders optional anime emotional FX (sparkles for happy, question mark for thinking,
 * sweat drops for surprised/confused, and Zzz floating letters with snot bubble for sleeping).
 */
export const EffectsArtwork: React.FC<EffectsArtworkProps> = ({
  expression = 'normal',
  className = '',
}) => {
  switch (expression) {
    case 'happy':
      return (
        <g className={`character-artwork-fx fx-happy ${className}`} pointerEvents="none">
          {/* Left Sparkle Star */}
          <g transform="translate(60, 68)">
            <polygon points="0,-7 2,-2 7,0 2,2 0,7 -2,2 -7,0 -2,-2" fill={ARTWORK_PALETTE.fxSparkle} />
            <circle cx="0" cy="0" r="1.5" fill="#FFFFFF" />
          </g>
          {/* Right Sparkle Star */}
          <g transform="translate(138, 64)">
            <polygon points="0,-6 1.8,-1.8 6,0 1.8,1.8 0,6 -1.8,1.8 -6,0 -1.8,-1.8" fill={ARTWORK_PALETTE.fxSparkle} />
            <circle cx="0" cy="0" r="1.2" fill="#FFFFFF" />
          </g>
          {/* Tiny twinkle dot */}
          <circle cx="144" cy="74" r="1.4" fill={ARTWORK_PALETTE.fxSparkle} />
        </g>
      );

    case 'thinking':
      return (
        <g className={`character-artwork-fx fx-thinking ${className}`} pointerEvents="none">
          {/* Thoughtful Indigo Question Mark floating above right temple */}
          <g transform="translate(132, 54)">
            <path
              d="M -3 -8 C -4 -13 4 -15 6 -10 C 7 -6 2 -4 1 -1 L 1 1"
              fill="none"
              stroke={ARTWORK_PALETTE.fxQuestion}
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <circle cx="1" cy="4.5" r="1.4" fill={ARTWORK_PALETTE.fxQuestion} />
          </g>
        </g>
      );

    case 'confused':
      return (
        <g className={`character-artwork-fx fx-confused ${className}`} pointerEvents="none">
          {/* Classic Anime Temple Sweat Drop */}
          <path
            d="M 133 76 C 131 72 135 68 135 68 C 135 68 139 72 137 76 C 136 78 134 78 133 76 Z"
            fill={ARTWORK_PALETTE.fxSweat}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth="1.2"
          />
          {/* Sweat drop sheen highlight */}
          <path d="M 134 73 C 133.5 75 134.5 76 135 76" stroke="#FFFFFF" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        </g>
      );

    case 'surprised':
      return (
        <g className={`character-artwork-fx fx-surprised ${className}`} pointerEvents="none">
          {/* Anime Surprise Action Rays around head */}
          <line x1="58" y1="58" x2="52" y2="52" stroke={ARTWORK_PALETTE.strokeDark} strokeWidth="2.0" strokeLinecap="round" />
          <line x1="142" y1="58" x2="148" y2="52" stroke={ARTWORK_PALETTE.strokeDark} strokeWidth="2.0" strokeLinecap="round" />
          <line x1="100" y1="30" x2="100" y2="24" stroke={ARTWORK_PALETTE.strokeDark} strokeWidth="2.0" strokeLinecap="round" />
        </g>
      );

    case 'sleeping':
      return (
        <g className={`character-artwork-fx fx-sleeping ${className}`} pointerEvents="none">
          {/* Floating Zzz letters drifting upward */}
          <text x="122" y="52" fill={ARTWORK_PALETTE.fxZzz} fontSize="10" fontFamily="sans-serif" fontWeight="bold">Z</text>
          <text x="131" y="42" fill={ARTWORK_PALETTE.fxZzz} fontSize="8" fontFamily="sans-serif" fontWeight="bold" opacity="0.85">z</text>
          <text x="138" y="34" fill={ARTWORK_PALETTE.fxZzz} fontSize="6" fontFamily="sans-serif" fontWeight="bold" opacity="0.65">z</text>

          {/* Cute translucent anime snot bubble expanding from nose/mouth */}
          <g transform="translate(108, 104)">
            <ellipse cx="0" cy="0" rx="5" ry="5" fill={ARTWORK_PALETTE.fxBubble} stroke={ARTWORK_PALETTE.strokeDark} strokeWidth="1.0" />
            <path d="M -2 -2 C -1 -3.5 2 -3.5 3 -2" fill="none" stroke={ARTWORK_PALETTE.fxBubbleSheen} strokeWidth="1.0" strokeLinecap="round" />
          </g>
        </g>
      );

    case 'talking':
    case 'explaining':
    case 'normal':
    default:
      return null;
  }
};
