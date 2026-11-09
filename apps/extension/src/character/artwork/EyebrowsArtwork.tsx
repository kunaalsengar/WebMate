import React from 'react';
import type { CharacterExpression } from '@webmate/shared';
import { ARTWORK_PALETTE } from './palette';

export interface EyebrowsArtworkProps {
  expression?: CharacterExpression;
  className?: string;
}

/**
 * Layer 8: Thick Expressive Eyebrows Artwork
 *
 * Articulates with head neck pivot (100, 115).
 * Renders two thick, expressive cartoon eyebrows with distinct paths tailored to
 * the 8 canonical character expressions.
 */
export const EyebrowsArtwork: React.FC<EyebrowsArtworkProps> = ({
  expression = 'normal',
  className = '',
}) => {
  switch (expression) {
    case 'happy':
      return (
        <g className={`character-artwork-eyebrows eyebrows-happy ${className}`}>
          {/* Left eyebrow: high joyful arch */}
          <path
            d="M 74 70 C 80 64 89 64 95 69"
            fill="none"
            stroke={ARTWORK_PALETTE.eyebrowColor}
            strokeWidth="3.6"
            strokeLinecap="round"
          />
          {/* Right eyebrow: high joyful arch */}
          <path
            d="M 105 69 C 111 64 120 64 126 70"
            fill="none"
            stroke={ARTWORK_PALETTE.eyebrowColor}
            strokeWidth="3.6"
            strokeLinecap="round"
          />
        </g>
      );

    case 'thinking':
      return (
        <g className={`character-artwork-eyebrows eyebrows-thinking ${className}`}>
          {/* Left eyebrow: arched high in contemplation */}
          <path
            d="M 74 67 C 80 63 88 64 94 69"
            fill="none"
            stroke={ARTWORK_PALETTE.eyebrowColor}
            strokeWidth="3.6"
            strokeLinecap="round"
          />
          {/* Right eyebrow: furrowed downward toward nose */}
          <path
            d="M 106 77 C 112 75 120 74 126 72"
            fill="none"
            stroke={ARTWORK_PALETTE.eyebrowColor}
            strokeWidth="3.6"
            strokeLinecap="round"
          />
        </g>
      );

    case 'surprised':
      return (
        <g className={`character-artwork-eyebrows eyebrows-surprised ${className}`}>
          {/* Left eyebrow: shot high above eye */}
          <path
            d="M 74 65 C 80 60 88 60 94 66"
            fill="none"
            stroke={ARTWORK_PALETTE.eyebrowColor}
            strokeWidth="3.6"
            strokeLinecap="round"
          />
          {/* Right eyebrow: shot high above eye */}
          <path
            d="M 106 66 C 112 60 120 60 126 65"
            fill="none"
            stroke={ARTWORK_PALETTE.eyebrowColor}
            strokeWidth="3.6"
            strokeLinecap="round"
          />
        </g>
      );

    case 'confused':
      return (
        <g className={`character-artwork-eyebrows eyebrows-confused ${className}`}>
          {/* Left eyebrow: wavy inquisitive wiggle */}
          <path
            d="M 74 72 Q 80 67 86 73 Q 91 75 94 70"
            fill="none"
            stroke={ARTWORK_PALETTE.eyebrowColor}
            strokeWidth="3.4"
            strokeLinecap="round"
          />
          {/* Right eyebrow: downward skeptical slant */}
          <path
            d="M 106 76 C 112 74 120 72 126 69"
            fill="none"
            stroke={ARTWORK_PALETTE.eyebrowColor}
            strokeWidth="3.6"
            strokeLinecap="round"
          />
        </g>
      );

    case 'explaining':
      return (
        <g className={`character-artwork-eyebrows eyebrows-explaining ${className}`}>
          {/* Left eyebrow: confident inward slant */}
          <path
            d="M 74 74 C 80 72 88 71 95 69"
            fill="none"
            stroke={ARTWORK_PALETTE.eyebrowColor}
            strokeWidth="3.6"
            strokeLinecap="round"
          />
          {/* Right eyebrow: confident inward slant */}
          <path
            d="M 105 69 C 112 71 120 72 126 74"
            fill="none"
            stroke={ARTWORK_PALETTE.eyebrowColor}
            strokeWidth="3.6"
            strokeLinecap="round"
          />
        </g>
      );

    case 'sleeping':
      return (
        <g className={`character-artwork-eyebrows eyebrows-sleeping ${className}`}>
          {/* Left eyebrow: relaxed droop */}
          <path
            d="M 75 75 C 81 76 89 77 94 76"
            fill="none"
            stroke={ARTWORK_PALETTE.eyebrowColor}
            strokeWidth="3.2"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Right eyebrow: relaxed droop */}
          <path
            d="M 106 76 C 111 77 119 76 125 75"
            fill="none"
            stroke={ARTWORK_PALETTE.eyebrowColor}
            strokeWidth="3.2"
            strokeLinecap="round"
            opacity="0.85"
          />
        </g>
      );

    case 'talking':
    case 'normal':
    default:
      return (
        <g className={`character-artwork-eyebrows eyebrows-normal ${className}`}>
          {/* Left eyebrow: classic thick cartoon arch */}
          <path
            d="M 74 74 C 80 69 88 69 94 73"
            fill="none"
            stroke={ARTWORK_PALETTE.eyebrowColor}
            strokeWidth="3.6"
            strokeLinecap="round"
          />
          {/* Right eyebrow: classic thick cartoon arch */}
          <path
            d="M 106 73 C 112 69 120 69 126 74"
            fill="none"
            stroke={ARTWORK_PALETTE.eyebrowColor}
            strokeWidth="3.6"
            strokeLinecap="round"
          />
        </g>
      );
  }
};
