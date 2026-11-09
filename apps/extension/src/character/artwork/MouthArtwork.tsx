import React from 'react';
import type { CharacterExpression } from '@webmate/shared';
import { ARTWORK_PALETTE } from './palette';

export interface MouthArtworkProps {
  expression?: CharacterExpression;
  className?: string;
}

/**
 * Layer 10: Swappable Mouth Geometries Artwork
 *
 * Articulates around manifest mouth anchor (105, 105).
 * Connects with TalkingAnimationDriver for organic text-stream token pulse scaling
 * without conflicting with expression switching.
 */
export const MouthArtwork: React.FC<MouthArtworkProps> = ({
  expression = 'normal',
  className = '',
}) => {
  switch (expression) {
    case 'happy':
      return (
        <g className={`character-artwork-mouth mouth-happy ${className}`}>
          {/* Wide joyful open grin with teeth and tongue */}
          <path
            d="M 96 103 Q 104 115 114 103 Z"
            fill={ARTWORK_PALETTE.mouthCavity}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
            strokeLinejoin="round"
          />
          {/* Upper teeth band */}
          <path
            d="M 97 103.5 L 113 103.5 C 112 105.5 106 106.5 105 106.5 C 104 106.5 98 105.5 97 103.5 Z"
            fill={ARTWORK_PALETTE.teethWhite}
          />
          {/* Rounded pink tongue */}
          <path
            d="M 100 110 C 102 107.5 108 107.5 110 110 C 109 113 102 113 100 110 Z"
            fill={ARTWORK_PALETTE.tonguePink}
          />
          {/* Top lip curve stroke */}
          <path
            d="M 95 103 Q 104 105 115 103"
            fill="none"
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
            strokeLinecap="round"
          />
        </g>
      );

    case 'talking':
    case 'explaining':
      return (
        <g className={`character-artwork-mouth mouth-talking ${className}`}>
          {/* Articulate open speaking mouth (optimized for TalkingAnimationDriver scaling) */}
          <path
            d="M 98 104 C 99 109 110 109 112 104 C 110 102.5 100 102.5 98 104 Z"
            fill={ARTWORK_PALETTE.mouthCavity}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
            strokeLinejoin="round"
          />
          {/* Visible upper teeth tip */}
          <path
            d="M 99.5 104 L 110.5 104 C 110 105.2 107 105.8 105 105.8 C 103 105.8 100 105.2 99.5 104 Z"
            fill={ARTWORK_PALETTE.teethWhite}
          />
          {/* Soft tongue curve */}
          <path
            d="M 101.5 107 C 103 106 107 106 108.5 107 C 107.5 108.5 102.5 108.5 101.5 107 Z"
            fill={ARTWORK_PALETTE.tonguePink}
          />
          {/* Outer lip line */}
          <path
            d="M 97 103.5 C 100 105 109 105 113 103.5"
            fill="none"
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
            strokeLinecap="round"
          />
        </g>
      );

    case 'surprised':
      return (
        <g className={`character-artwork-mouth mouth-surprised ${className}`}>
          {/* Cute vertical open "O" mouth */}
          <ellipse
            cx="104.5"
            cy="106"
            rx="4.5"
            ry="6.0"
            fill={ARTWORK_PALETTE.mouthCavity}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
          />
          {/* Small tongue hint */}
          <ellipse
            cx="104.5"
            cy="108.5"
            rx="3.0"
            ry="2.0"
            fill={ARTWORK_PALETTE.tonguePink}
          />
        </g>
      );

    case 'thinking':
      return (
        <g className={`character-artwork-mouth mouth-thinking ${className}`}>
          {/* Small pursed wavy thoughtful mouth */}
          <path
            d="M 99 106 Q 103 104 107 107 Q 110 105 112 106"
            fill="none"
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>
      );

    case 'confused':
      return (
        <g className={`character-artwork-mouth mouth-confused ${className}`}>
          {/* Asymmetric sideways wavy mouth */}
          <path
            d="M 97 106 Q 101 108.5 105 105 Q 109 103.5 113 106"
            fill="none"
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>
      );

    case 'sleeping':
      return (
        <g className={`character-artwork-mouth mouth-sleeping ${className}`}>
          {/* Relaxed slightly open sleepy mouth droop */}
          <path
            d="M 100 105 Q 104 108 109 105"
            fill={ARTWORK_PALETTE.mouthCavity}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>
      );

    case 'normal':
    default:
      return (
        <g className={`character-artwork-mouth mouth-normal ${className}`}>
          {/* Cheerful playful cartoon smirk */}
          <path
            d="M 97 104 C 101 106.5 109 106.5 113 103.5"
            fill="none"
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
            strokeLinecap="round"
          />
          {/* Right cheek smile corner crease */}
          <path
            d="M 112.5 102 C 114 103 114 104.5 113 105.5"
            fill="none"
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      );
  }
};
