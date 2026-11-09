import React from 'react';
import type { CharacterExpression } from '@webmate/shared';
import { ARTWORK_PALETTE } from './palette';

export interface EyesArtworkProps {
  expression?: CharacterExpression;
  className?: string;
}

/**
 * Layer 9: Expressive Eyes Artwork (Sclera, Pupils & Catchlights)
 *
 * Articulates with head neck pivot (100, 115).
 * Squashes dynamically during GSAP natural eye blinking (scaleY: 0.1 -> 1.0).
 * Renders distinct eye geometries for all 8 expressions (open, happy crescents,
 * glancing, surprised contracted pupils, and sleeping slits).
 */
export const EyesArtwork: React.FC<EyesArtworkProps> = ({
  expression = 'normal',
  className = '',
}) => {
  // Render distinct eye geometries based on current companion expression
  switch (expression) {
    case 'happy':
      return (
        <g className={`character-artwork-eyes eyes-happy ${className}`}>
          {/* Left Eye: Joyful smiling anime crescent curve */}
          <path
            d="M 77 91 C 80 84 89 84 93 91"
            fill="none"
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Left cute lower lash tick */}
          <line x1="91" y1="91" x2="93.5" y2="93" stroke={ARTWORK_PALETTE.strokeDark} strokeWidth="1.6" strokeLinecap="round" />

          {/* Right Eye: Joyful smiling anime crescent curve */}
          <path
            d="M 107 91 C 111 84 120 84 123 91"
            fill="none"
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Right cute lower lash tick */}
          <line x1="121" y1="91" x2="123.5" y2="93" stroke={ARTWORK_PALETTE.strokeDark} strokeWidth="1.6" strokeLinecap="round" />
        </g>
      );

    case 'thinking':
      return (
        <g className={`character-artwork-eyes eyes-thinking ${className}`}>
          {/* Left Eye Sclera */}
          <ellipse cx="85" cy="88" rx="8" ry="7" fill={ARTWORK_PALETTE.scleraWhite} stroke={ARTWORK_PALETTE.strokeDark} strokeWidth={ARTWORK_PALETTE.strokeWidthBase} />
          {/* Left Pupil (Glancing up-right) */}
          <circle cx="87" cy="85.5" r="4.2" fill={ARTWORK_PALETTE.pupilDark} />
          <circle cx="85.8" cy="84.2" r="1.5" fill={ARTWORK_PALETTE.eyeCatchlight} />
          {/* Left Upper Lash Line */}
          <path d="M 76 86 C 79 81 90 81 94 86" fill="none" stroke={ARTWORK_PALETTE.strokeDark} strokeWidth="2.6" strokeLinecap="round" />

          {/* Right Eye Sclera */}
          <ellipse cx="115" cy="88" rx="8" ry="7" fill={ARTWORK_PALETTE.scleraWhite} stroke={ARTWORK_PALETTE.strokeDark} strokeWidth={ARTWORK_PALETTE.strokeWidthBase} />
          {/* Right Pupil (Glancing up-right) */}
          <circle cx="117" cy="85.5" r="4.2" fill={ARTWORK_PALETTE.pupilDark} />
          <circle cx="115.8" cy="84.2" r="1.5" fill={ARTWORK_PALETTE.eyeCatchlight} />
          {/* Right Upper Lash Line */}
          <path d="M 106 86 C 109 81 120 81 124 86" fill="none" stroke={ARTWORK_PALETTE.strokeDark} strokeWidth="2.6" strokeLinecap="round" />
        </g>
      );

    case 'surprised':
      return (
        <g className={`character-artwork-eyes eyes-surprised ${className}`}>
          {/* Left Eye: Wide open circular sclera */}
          <circle cx="85" cy="88" r="8" fill={ARTWORK_PALETTE.scleraWhite} stroke={ARTWORK_PALETTE.strokeDark} strokeWidth={ARTWORK_PALETTE.strokeWidthBase} />
          {/* Left Pupil: Contracted shock dot */}
          <circle cx="85" cy="88" r="2.8" fill={ARTWORK_PALETTE.pupilDark} />
          <circle cx="84" cy="87" r="1.0" fill={ARTWORK_PALETTE.eyeCatchlight} />

          {/* Right Eye: Wide open circular sclera */}
          <circle cx="115" cy="88" r="8" fill={ARTWORK_PALETTE.scleraWhite} stroke={ARTWORK_PALETTE.strokeDark} strokeWidth={ARTWORK_PALETTE.strokeWidthBase} />
          {/* Right Pupil: Contracted shock dot */}
          <circle cx="115" cy="88" r="2.8" fill={ARTWORK_PALETTE.pupilDark} />
          <circle cx="114" cy="87" r="1.0" fill={ARTWORK_PALETTE.eyeCatchlight} />
        </g>
      );

    case 'confused':
      return (
        <g className={`character-artwork-eyes eyes-confused ${className}`}>
          {/* Left Eye: Wide, curious */}
          <ellipse cx="85" cy="88" rx="8" ry="7.5" fill={ARTWORK_PALETTE.scleraWhite} stroke={ARTWORK_PALETTE.strokeDark} strokeWidth={ARTWORK_PALETTE.strokeWidthBase} />
          <circle cx="85.5" cy="88" r="4.2" fill={ARTWORK_PALETTE.pupilDark} />
          <circle cx="84" cy="86.5" r="1.5" fill={ARTWORK_PALETTE.eyeCatchlight} />
          <path d="M 76 86 C 80 81 90 81 94 86" fill="none" stroke={ARTWORK_PALETTE.strokeDark} strokeWidth="2.5" strokeLinecap="round" />

          {/* Right Eye: Skeptical slight squint */}
          <ellipse cx="115" cy="89" rx="8" ry="5.5" fill={ARTWORK_PALETTE.scleraWhite} stroke={ARTWORK_PALETTE.strokeDark} strokeWidth={ARTWORK_PALETTE.strokeWidthBase} />
          <circle cx="114.5" cy="89" r="3.6" fill={ARTWORK_PALETTE.pupilDark} />
          <circle cx="113.5" cy="87.8" r="1.2" fill={ARTWORK_PALETTE.eyeCatchlight} />
          <path d="M 106 87 C 110 84 119 84 124 87" fill="none" stroke={ARTWORK_PALETTE.strokeDark} strokeWidth="2.8" strokeLinecap="round" />
        </g>
      );

    case 'sleeping':
      return (
        <g className={`character-artwork-eyes eyes-sleeping ${className}`}>
          {/* Left Eye: Flat closed peaceful slit */}
          <path
            d="M 77 89 C 81 91 89 91 93 89"
            fill="none"
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth="3.0"
            strokeLinecap="round"
          />
          {/* Left cute outer sleepy eyelash */}
          <line x1="77" y1="89" x2="74.5" y2="91" stroke={ARTWORK_PALETTE.strokeDark} strokeWidth="1.5" strokeLinecap="round" />

          {/* Right Eye: Flat closed peaceful slit */}
          <path
            d="M 107 89 C 111 91 119 91 123 89"
            fill="none"
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth="3.0"
            strokeLinecap="round"
          />
          {/* Right cute outer sleepy eyelash */}
          <line x1="123" y1="89" x2="125.5" y2="91" stroke={ARTWORK_PALETTE.strokeDark} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );

    case 'talking':
    case 'explaining':
    case 'normal':
    default:
      return (
        <g className={`character-artwork-eyes eyes-normal ${className}`}>
          {/* ========================================================
              LEFT EYE (Standard Large Anime Eye)
              ======================================================== */}
          {/* Sclera white oval */}
          <ellipse
            cx="85"
            cy="88"
            rx="8.2"
            ry="7.2"
            fill={ARTWORK_PALETTE.scleraWhite}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
          />
          {/* Sclera upper lid soft shadow */}
          <path
            d="M 77.5 86 C 80 82 89 82 92.5 86 C 90 84 81 84 77.5 86 Z"
            fill={ARTWORK_PALETTE.scleraShadow}
          />
          {/* Pupil / Iris */}
          <circle
            cx="85"
            cy="88"
            r="4.6"
            fill={ARTWORK_PALETTE.pupilDark}
          />
          {/* Primary reflection sparkle */}
          <circle
            cx="83.2"
            cy="85.8"
            r="1.8"
            fill={ARTWORK_PALETTE.eyeCatchlight}
          />
          {/* Secondary tiny reflection twinkle */}
          <circle
            cx="87.2"
            cy="89.6"
            r="0.9"
            fill={ARTWORK_PALETTE.eyeCatchlight}
          />
          {/* Defined upper eyelash contour */}
          <path
            d="M 76 86 C 79 81 90 81 94 86"
            fill="none"
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* ========================================================
              RIGHT EYE (Standard Large Anime Eye)
              ======================================================== */}
          {/* Sclera white oval */}
          <ellipse
            cx="115"
            cy="88"
            rx="8.2"
            ry="7.2"
            fill={ARTWORK_PALETTE.scleraWhite}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
          />
          {/* Sclera upper lid soft shadow */}
          <path
            d="M 107.5 86 C 110 82 119 82 122.5 86 C 120 84 111 84 107.5 86 Z"
            fill={ARTWORK_PALETTE.scleraShadow}
          />
          {/* Pupil / Iris */}
          <circle
            cx="115"
            cy="88"
            r="4.6"
            fill={ARTWORK_PALETTE.pupilDark}
          />
          {/* Primary reflection sparkle */}
          <circle
            cx="113.2"
            cy="85.8"
            r="1.8"
            fill={ARTWORK_PALETTE.eyeCatchlight}
          />
          {/* Secondary tiny reflection twinkle */}
          <circle
            cx="117.2"
            cy="89.6"
            r="0.9"
            fill={ARTWORK_PALETTE.eyeCatchlight}
          />
          {/* Defined upper eyelash contour */}
          <path
            d="M 106 86 C 109 81 120 81 124 86"
            fill="none"
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </g>
      );
  }
};
