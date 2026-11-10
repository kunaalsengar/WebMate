import React from 'react';
import type { CharacterExpression } from '@webmate/shared';
import { ARTWORK_PALETTE } from '../../artwork/palette';
import {
  BLUSH_COLOR_PALETTES,
  EYE_COLOR_PALETTES,
  resolveEyebrowHex,
} from '../palettes';
import type {
  BlushColorId,
  BlushStyleId,
  EyebrowColorId,
  EyebrowStyleId,
  EyeColorId,
  EyeStyleId,
  HairColorId,
  MouthStyleId,
} from '../types';

/* ============================================================================
   1. EYEBROWS VARIANT ARTWORK (Layer 8: layer-eyebrows)
   ============================================================================ */

export interface EyebrowsVariantArtworkProps {
  expression?: CharacterExpression;
  eyebrowStyle: EyebrowStyleId;
  eyebrowColor: EyebrowColorId;
  hairColor: HairColorId;
  className?: string;
}

export const EyebrowsVariantArtwork: React.FC<EyebrowsVariantArtworkProps> = ({
  expression = 'normal',
  eyebrowStyle,
  eyebrowColor,
  hairColor,
  className = '',
}) => {
  const color = resolveEyebrowHex(eyebrowColor, hairColor);

  const strokeWidth = (() => {
    switch (eyebrowStyle) {
      case 'sleek-arched':
        return expression === 'sleeping' ? 2.2 : 2.5;
      case 'bushy-energetic':
        return expression === 'sleeping' ? 4.4 : 4.8;
      case 'short-minimal':
        return expression === 'sleeping' ? 2.8 : 3.2;
      case 'thick-cartoon':
      default:
        return expression === 'sleeping' ? 3.2 : 3.6;
    }
  })();

  const renderPaths = (): { left: string; right: string; isWavyLeft?: boolean } => {
    if (eyebrowStyle === 'short-minimal') {
      switch (expression) {
        case 'happy':
          return { left: 'M 78 69 Q 85 65 92 69', right: 'M 108 69 Q 115 65 122 69' };
        case 'thinking':
          return { left: 'M 78 67 Q 85 64 92 68', right: 'M 109 76 L 122 73' };
        case 'surprised':
          return { left: 'M 78 65 Q 85 61 92 65', right: 'M 108 65 Q 115 61 122 65' };
        case 'confused':
          return {
            left: 'M 78 71 Q 83 67 87 72 Q 90 73 92 70',
            right: 'M 109 75 L 122 70',
            isWavyLeft: true,
          };
        case 'explaining':
          return { left: 'M 78 73 L 92 70', right: 'M 108 70 L 122 73' };
        case 'sleeping':
          return { left: 'M 79 75 Q 85 77 91 76', right: 'M 109 76 Q 115 77 121 75' };
        case 'talking':
        case 'normal':
        default:
          return { left: 'M 78 73 Q 85 70 92 72', right: 'M 108 72 Q 115 70 122 73' };
      }
    }

    if (eyebrowStyle === 'sleek-arched') {
      switch (expression) {
        case 'happy':
          return { left: 'M 74 70 C 79 62 88 62 94 68', right: 'M 106 68 C 112 62 121 62 126 70' };
        case 'thinking':
          return { left: 'M 74 68 C 79 62 87 62 94 68', right: 'M 106 77 C 113 75 120 73 126 71' };
        case 'surprised':
          return { left: 'M 74 64 C 80 58 88 58 94 65', right: 'M 106 65 C 112 58 120 58 126 64' };
        case 'confused':
          return {
            left: 'M 74 71 Q 80 65 86 72 Q 91 74 94 69',
            right: 'M 106 75 C 113 73 120 70 126 68',
            isWavyLeft: true,
          };
        case 'explaining':
          return { left: 'M 74 74 C 81 71 88 69 95 68', right: 'M 105 68 C 112 69 119 71 126 74' };
        case 'sleeping':
          return { left: 'M 75 75 C 81 77 89 77 94 76', right: 'M 106 76 C 111 77 119 77 125 75' };
        case 'talking':
        case 'normal':
        default:
          return { left: 'M 74 73 C 79 67 88 66 95 72', right: 'M 105 72 C 112 66 121 67 126 73' };
      }
    }

    // thick-cartoon & bushy-energetic share the bold geometric stance (bushy adds extra bristle accent)
    switch (expression) {
      case 'happy':
        return { left: 'M 74 70 C 80 64 89 64 95 69', right: 'M 105 69 C 111 64 120 64 126 70' };
      case 'thinking':
        return { left: 'M 74 67 C 80 63 88 64 94 69', right: 'M 106 77 C 112 75 120 74 126 72' };
      case 'surprised':
        return { left: 'M 74 65 C 80 60 88 60 94 66', right: 'M 106 66 C 112 60 120 60 126 65' };
      case 'confused':
        return {
          left: 'M 74 72 Q 80 67 86 73 Q 91 75 94 70',
          right: 'M 106 76 C 112 74 120 72 126 69',
          isWavyLeft: true,
        };
      case 'explaining':
        return { left: 'M 74 74 C 80 72 88 71 95 69', right: 'M 105 69 C 112 71 120 72 126 74' };
      case 'sleeping':
        return { left: 'M 75 75 C 81 76 89 77 94 76', right: 'M 106 76 C 111 77 119 76 125 75' };
      case 'talking':
      case 'normal':
      default:
        return { left: 'M 74 74 C 80 69 88 69 94 73', right: 'M 106 73 C 112 69 120 69 126 74' };
    }
  };

  const { left, right } = renderPaths();
  const opacity = expression === 'sleeping' ? 0.85 : 1;

  return (
    <g className={`character-artwork-eyebrows eyebrows-${expression} ${className}`}>
      <path
        d={left}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
      />
      <path
        d={right}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
      />
      {eyebrowStyle === 'bushy-energetic' && (
        <g opacity={opacity} pointerEvents="none">
          <path d="M 73 73 L 71 70" stroke={color} strokeWidth="2.1" strokeLinecap="round" />
          <path d="M 127 73 L 129 70" stroke={color} strokeWidth="2.1" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
};

/* ============================================================================
   2. EYES VARIANT ARTWORK (Layer 9: layer-eyes)
   ============================================================================ */

export interface EyesVariantArtworkProps {
  expression?: CharacterExpression;
  eyeStyle: EyeStyleId;
  eyeColor: EyeColorId;
  className?: string;
}

export const EyesVariantArtwork: React.FC<EyesVariantArtworkProps> = ({
  expression = 'normal',
  eyeStyle,
  eyeColor,
  className = '',
}) => {
  const palette = EYE_COLOR_PALETTES[eyeColor] ?? EYE_COLOR_PALETTES['midnight-ink'];

  // Happy crescents & Sleeping slits adapt cleanly across all eye styles
  if (expression === 'happy') {
    const strokeW = eyeStyle === 'almond-cool' ? 2.8 : 3.2;
    return (
      <g className={`character-artwork-eyes eyes-happy ${className}`}>
        <path
          d="M 77 91 C 80 84 89 84 93 91"
          fill="none"
          stroke={ARTWORK_PALETTE.strokeDark}
          strokeWidth={strokeW}
          strokeLinecap="round"
        />
        <line
          x1="91"
          y1="91"
          x2="93.5"
          y2="93"
          stroke={ARTWORK_PALETTE.strokeDark}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M 107 91 C 111 84 120 84 123 91"
          fill="none"
          stroke={ARTWORK_PALETTE.strokeDark}
          strokeWidth={strokeW}
          strokeLinecap="round"
        />
        <line
          x1="121"
          y1="91"
          x2="123.5"
          y2="93"
          stroke={ARTWORK_PALETTE.strokeDark}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </g>
    );
  }

  if (expression === 'sleeping') {
    return (
      <g className={`character-artwork-eyes eyes-sleeping ${className}`}>
        <path
          d="M 77 89 C 81 91 89 91 93 89"
          fill="none"
          stroke={ARTWORK_PALETTE.strokeDark}
          strokeWidth="3.0"
          strokeLinecap="round"
        />
        <line
          x1="77"
          y1="89"
          x2="74.5"
          y2="91"
          stroke={ARTWORK_PALETTE.strokeDark}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M 107 89 C 111 91 119 91 123 89"
          fill="none"
          stroke={ARTWORK_PALETTE.strokeDark}
          strokeWidth="3.0"
          strokeLinecap="round"
        />
        <line
          x1="123"
          y1="89"
          x2="125.5"
          y2="91"
          stroke={ARTWORK_PALETTE.strokeDark}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    );
  }

  if (expression === 'surprised') {
    const rOuter = eyeStyle === 'dot-minimal' ? 7 : 8;
    const rPupil = eyeStyle === 'dot-minimal' ? 2.6 : 3.0;
    return (
      <g className={`character-artwork-eyes eyes-surprised ${className}`}>
        <circle
          cx="85"
          cy="88"
          r={rOuter}
          fill={ARTWORK_PALETTE.scleraWhite}
          stroke={ARTWORK_PALETTE.strokeDark}
          strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        />
        <circle cx="85" cy="88" r={rPupil + 1.1} fill={palette.irisRim} opacity="0.4" />
        <circle cx="85" cy="88" r={rPupil} fill={palette.pupil} />
        <circle cx="84" cy="87" r="1.0" fill={ARTWORK_PALETTE.eyeCatchlight} />

        <circle
          cx="115"
          cy="88"
          r={rOuter}
          fill={ARTWORK_PALETTE.scleraWhite}
          stroke={ARTWORK_PALETTE.strokeDark}
          strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        />
        <circle cx="115" cy="88" r={rPupil + 1.1} fill={palette.irisRim} opacity="0.4" />
        <circle cx="115" cy="88" r={rPupil} fill={palette.pupil} />
        <circle cx="114" cy="87" r="1.0" fill={ARTWORK_PALETTE.eyeCatchlight} />
      </g>
    );
  }

  if (expression === 'thinking') {
    return (
      <g className={`character-artwork-eyes eyes-thinking ${className}`}>
        <ellipse
          cx="85"
          cy="88"
          rx="8"
          ry={eyeStyle === 'almond-cool' ? 6.2 : 7}
          fill={ARTWORK_PALETTE.scleraWhite}
          stroke={ARTWORK_PALETTE.strokeDark}
          strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        />
        <circle cx="87" cy="85.5" r="4.4" fill={palette.irisRim} />
        <circle cx="87" cy="85.5" r="2.8" fill={palette.pupil} />
        <circle cx="85.8" cy="84.2" r="1.5" fill={ARTWORK_PALETTE.eyeCatchlight} />
        <path
          d="M 76 86 C 79 81 90 81 94 86"
          fill="none"
          stroke={ARTWORK_PALETTE.strokeDark}
          strokeWidth="2.6"
          strokeLinecap="round"
        />

        <ellipse
          cx="115"
          cy="88"
          rx="8"
          ry={eyeStyle === 'almond-cool' ? 6.2 : 7}
          fill={ARTWORK_PALETTE.scleraWhite}
          stroke={ARTWORK_PALETTE.strokeDark}
          strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        />
        <circle cx="117" cy="85.5" r="4.4" fill={palette.irisRim} />
        <circle cx="117" cy="85.5" r="2.8" fill={palette.pupil} />
        <circle cx="115.8" cy="84.2" r="1.5" fill={ARTWORK_PALETTE.eyeCatchlight} />
        <path
          d="M 106 86 C 109 81 120 81 124 86"
          fill="none"
          stroke={ARTWORK_PALETTE.strokeDark}
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </g>
    );
  }

  if (expression === 'confused') {
    return (
      <g className={`character-artwork-eyes eyes-confused ${className}`}>
        <ellipse
          cx="85"
          cy="88"
          rx="8"
          ry="7.5"
          fill={ARTWORK_PALETTE.scleraWhite}
          stroke={ARTWORK_PALETTE.strokeDark}
          strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        />
        <circle cx="85.5" cy="88" r="4.4" fill={palette.irisRim} />
        <circle cx="85.5" cy="88" r="2.8" fill={palette.pupil} />
        <circle cx="84" cy="86.5" r="1.5" fill={ARTWORK_PALETTE.eyeCatchlight} />
        <path
          d="M 76 86 C 80 81 90 81 94 86"
          fill="none"
          stroke={ARTWORK_PALETTE.strokeDark}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        <ellipse
          cx="115"
          cy="89"
          rx="8"
          ry="5.5"
          fill={ARTWORK_PALETTE.scleraWhite}
          stroke={ARTWORK_PALETTE.strokeDark}
          strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        />
        <circle cx="114.5" cy="89" r="3.8" fill={palette.irisRim} />
        <circle cx="114.5" cy="89" r="2.4" fill={palette.pupil} />
        <circle cx="113.5" cy="87.8" r="1.2" fill={ARTWORK_PALETTE.eyeCatchlight} />
        <path
          d="M 106 87 C 110 84 119 84 124 87"
          fill="none"
          stroke={ARTWORK_PALETTE.strokeDark}
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      </g>
    );
  }

  // Open resting/speaking states ('normal' | 'talking' | 'explaining') — showcase selected EyeStyleId
  switch (eyeStyle) {
    case 'almond-cool':
      return (
        <g className={`character-artwork-eyes eyes-normal eyes-almond ${className}`}>
          {/* Left Sleek Almond Eye */}
          <path
            d="M 75 88 C 78 82 90 82 94 87 C 92 94 79 94 75 88 Z"
            fill={ARTWORK_PALETTE.scleraWhite}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
            strokeLinejoin="round"
          />
          <circle cx="85.5" cy="88" r="4.3" fill={palette.irisRim} />
          <circle cx="85.5" cy="88" r="2.7" fill={palette.pupil} />
          <circle cx="83.9" cy="86.3" r="1.5" fill={ARTWORK_PALETTE.eyeCatchlight} />
          <path
            d="M 74 87.5 C 78 81 89 81 94.5 85.5"
            fill="none"
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth="2.9"
            strokeLinecap="round"
          />

          {/* Right Sleek Almond Eye */}
          <path
            d="M 106 87 C 110 82 122 82 125 88 C 121 94 108 94 106 87 Z"
            fill={ARTWORK_PALETTE.scleraWhite}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
            strokeLinejoin="round"
          />
          <circle cx="114.5" cy="88" r="4.3" fill={palette.irisRim} />
          <circle cx="114.5" cy="88" r="2.7" fill={palette.pupil} />
          <circle cx="112.9" cy="86.3" r="1.5" fill={ARTWORK_PALETTE.eyeCatchlight} />
          <path
            d="M 105.5 85.5 C 111 81 122 81 126 87.5"
            fill="none"
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth="2.9"
            strokeLinecap="round"
          />
        </g>
      );

    case 'starry-bright':
      return (
        <g className={`character-artwork-eyes eyes-normal eyes-starry ${className}`}>
          {[85, 115].map((cx) => (
            <g key={cx}>
              <ellipse
                cx={cx}
                cy="88"
                rx="8.5"
                ry="8.0"
                fill={ARTWORK_PALETTE.scleraWhite}
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              />
              <circle cx={cx} cy="88.2" r="5.3" fill={palette.irisRim} />
              <circle cx={cx} cy="88.2" r="3.4" fill={palette.pupil} />
              {/* Large glossy sparkle star */}
              <polygon
                points={`${cx - 1.8},84.2 ${cx - 1.1},85.8 ${cx + 0.5},86.5 ${cx - 1.1},87.2 ${cx - 1.8},88.8 ${cx - 2.5},87.2 ${cx - 4.1},86.5 ${cx - 2.5},85.8`}
                fill={ARTWORK_PALETTE.eyeCatchlight}
              />
              <circle cx={cx + 2.4} cy="90.6" r="1.1" fill={ARTWORK_PALETTE.eyeCatchlight} />
              <path
                d={`M ${cx - 9} 85.5 C ${cx - 6} 79.5 ${cx + 6} 79.5 ${cx + 9} 85.5`}
                fill="none"
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </g>
          ))}
        </g>
      );

    case 'sleepy-chill':
      return (
        <g className={`character-artwork-eyes eyes-normal eyes-chill ${className}`}>
          {[85, 115].map((cx) => (
            <g key={cx}>
              <ellipse
                cx={cx}
                cy="89"
                rx="8.0"
                ry="5.8"
                fill={ARTWORK_PALETTE.scleraWhite}
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              />
              {/* Relaxed half-lid shadow band */}
              <path
                d={`M ${cx - 7.5} 86.5 C ${cx - 4} 83 ${cx + 4} 83 ${cx + 7.5} 86.5 L ${cx + 7.5} 88 L ${cx - 7.5} 88 Z`}
                fill={ARTWORK_PALETTE.scleraShadow}
              />
              <circle cx={cx} cy="89.5" r="3.9" fill={palette.irisRim} />
              <circle cx={cx} cy="89.5" r="2.4" fill={palette.pupil} />
              <circle cx={cx - 1.4} cy="88.3" r="1.2" fill={ARTWORK_PALETTE.eyeCatchlight} />
              {/* Heavy relaxed upper eyelid bar */}
              <line
                x1={cx - 8.5}
                y1="86.5"
                x2={cx + 8.5}
                y2="86.5"
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth="2.9"
                strokeLinecap="round"
              />
            </g>
          ))}
        </g>
      );

    case 'dot-minimal':
      return (
        <g className={`character-artwork-eyes eyes-normal eyes-minimal ${className}`}>
          {[85, 115].map((cx) => (
            <g key={cx}>
              <ellipse
                cx={cx}
                cy="88"
                rx="4.6"
                ry="5.8"
                fill={palette.pupil}
                stroke={palette.irisRim}
                strokeWidth="1.8"
              />
              <circle cx={cx - 1.5} cy="85.8" r="1.5" fill={ARTWORK_PALETTE.eyeCatchlight} />
            </g>
          ))}
        </g>
      );

    case 'classic-anime':
    default:
      return (
        <g className={`character-artwork-eyes eyes-normal ${className}`}>
          {/* Left Eye */}
          <ellipse
            cx="85"
            cy="88"
            rx="8.2"
            ry="7.2"
            fill={ARTWORK_PALETTE.scleraWhite}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
          />
          <path
            d="M 77.5 86 C 80 82 89 82 92.5 86 C 90 84 81 84 77.5 86 Z"
            fill={ARTWORK_PALETTE.scleraShadow}
          />
          <circle cx="85" cy="88" r="4.8" fill={palette.irisRim} />
          <circle cx="85" cy="88" r="3.2" fill={palette.pupil} />
          <circle cx="83.2" cy="85.8" r="1.8" fill={ARTWORK_PALETTE.eyeCatchlight} />
          <circle cx="87.2" cy="89.6" r="0.9" fill={ARTWORK_PALETTE.eyeCatchlight} />
          <path
            d="M 76 86 C 79 81 90 81 94 86"
            fill="none"
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Right Eye */}
          <ellipse
            cx="115"
            cy="88"
            rx="8.2"
            ry="7.2"
            fill={ARTWORK_PALETTE.scleraWhite}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
          />
          <path
            d="M 107.5 86 C 110 82 119 82 122.5 86 C 120 84 111 84 107.5 86 Z"
            fill={ARTWORK_PALETTE.scleraShadow}
          />
          <circle cx="115" cy="88" r="4.8" fill={palette.irisRim} />
          <circle cx="115" cy="88" r="3.2" fill={palette.pupil} />
          <circle cx="113.2" cy="85.8" r="1.8" fill={ARTWORK_PALETTE.eyeCatchlight} />
          <circle cx="117.2" cy="89.6" r="0.9" fill={ARTWORK_PALETTE.eyeCatchlight} />
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

/* ============================================================================
   3. MOUTH VARIANT ARTWORK (Layer 10: layer-mouth)
   ============================================================================ */

export interface MouthVariantArtworkProps {
  expression?: CharacterExpression;
  mouthStyle: MouthStyleId;
  className?: string;
}

export const MouthVariantArtwork: React.FC<MouthVariantArtworkProps> = ({
  expression = 'normal',
  mouthStyle,
  className = '',
}) => {
  switch (expression) {
    case 'happy':
      return (
        <g className={`character-artwork-mouth mouth-happy ${className}`}>
          <path
            d="M 96 103 Q 104 115 114 103 Z"
            fill={ARTWORK_PALETTE.mouthCavity}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
            strokeLinejoin="round"
          />
          <path
            d="M 97 103.5 L 113 103.5 C 112 105.5 106 106.5 105 106.5 C 104 106.5 98 105.5 97 103.5 Z"
            fill={ARTWORK_PALETTE.teethWhite}
          />
          <path
            d="M 100 110 C 102 107.5 108 107.5 110 110 C 109 113 102 113 100 110 Z"
            fill={ARTWORK_PALETTE.tonguePink}
          />
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
          <path
            d="M 98 104 C 99 109 110 109 112 104 C 110 102.5 100 102.5 98 104 Z"
            fill={ARTWORK_PALETTE.mouthCavity}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
            strokeLinejoin="round"
          />
          <path
            d="M 99.5 104 L 110.5 104 C 110 105.2 107 105.8 105 105.8 C 103 105.8 100 105.2 99.5 104 Z"
            fill={ARTWORK_PALETTE.teethWhite}
          />
          <path
            d="M 101.5 107 C 103 106 107 106 108.5 107 C 107.5 108.5 102.5 108.5 101.5 107 Z"
            fill={ARTWORK_PALETTE.tonguePink}
          />
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
          <ellipse
            cx="104.5"
            cy="106"
            rx="4.5"
            ry="6.0"
            fill={ARTWORK_PALETTE.mouthCavity}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
          />
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
      switch (mouthStyle) {
        case 'cheerful-smile':
          return (
            <g className={`character-artwork-mouth mouth-normal mouth-smile ${className}`}>
              <path
                d="M 95.5 103 C 100 108.5 109 108.5 113.5 103"
                fill="none"
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
                strokeLinecap="round"
              />
              <path
                d="M 94.5 102.5 C 95 103.5 96 104 97 103.5"
                fill="none"
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <path
                d="M 112 103.5 C 113 104 114 103.5 114.5 102.5"
                fill="none"
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </g>
          );

        case 'cat-whisker':
          return (
            <g className={`character-artwork-mouth mouth-normal mouth-cat ${className}`}>
              <path
                d="M 96 103.5 C 98 107.5 102.5 107.5 104.5 103.5 C 106.5 107.5 111 107.5 113 103.5"
                fill="none"
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );

        case 'cool-grin':
          return (
            <g className={`character-artwork-mouth mouth-normal mouth-grin ${className}`}>
              <path
                d="M 95.5 102.5 C 100 103.8 109 103.8 113.5 102.5 C 112.5 107.5 108.5 109.5 104.5 109.5 C 100.5 109.5 96.5 107.5 95.5 102.5 Z"
                fill={ARTWORK_PALETTE.teethWhite}
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <line
                x1="101.5"
                y1="103"
                x2="101.5"
                y2="108.5"
                stroke="#CBD5E1"
                strokeWidth="1.0"
              />
              <line
                x1="107.5"
                y1="103"
                x2="107.5"
                y2="108.5"
                stroke="#CBD5E1"
                strokeWidth="1.0"
              />
            </g>
          );

        case 'classic-smirk':
        default:
          return (
            <g className={`character-artwork-mouth mouth-normal ${className}`}>
              <path
                d="M 97 104 C 101 106.5 109 106.5 113 103.5"
                fill="none"
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
                strokeLinecap="round"
              />
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
  }
};

/* ============================================================================
   4. BLUSH VARIANT ARTWORK (Layer 7: layer-blush)
   ============================================================================ */

export interface BlushVariantArtworkProps {
  blushStyle: BlushStyleId;
  blushColor: BlushColorId;
  className?: string;
}

export const BlushVariantArtwork: React.FC<BlushVariantArtworkProps> = ({
  blushStyle,
  blushColor,
  className = '',
}) => {
  if (blushStyle === 'none') {
    return null;
  }

  const palette = BLUSH_COLOR_PALETTES[blushColor] ?? BLUSH_COLOR_PALETTES['coral-pink'];

  switch (blushStyle) {
    case 'soft-rosy':
      return (
        <g className={`character-artwork-blush blush-soft ${className}`} pointerEvents="none">
          <ellipse cx="76" cy="102" rx="9" ry="5" fill={palette.base} opacity="0.72" />
          <ellipse cx="76" cy="101.5" rx="5.5" ry="2.8" fill={palette.highlight} opacity="0.55" />
          <ellipse cx="124" cy="102" rx="9" ry="5" fill={palette.base} opacity="0.72" />
          <ellipse cx="124" cy="101.5" rx="5.5" ry="2.8" fill={palette.highlight} opacity="0.55" />
        </g>
      );

    case 'cute-freckles':
      return (
        <g className={`character-artwork-blush blush-freckles ${className}`} pointerEvents="none">
          <ellipse cx="76" cy="102" rx="7.5" ry="4" fill={palette.base} opacity="0.38" />
          <circle cx="72" cy="101" r="1.15" fill={palette.base} />
          <circle cx="76" cy="103" r="1.15" fill={palette.base} />
          <circle cx="80" cy="100.8" r="1.15" fill={palette.base} />

          <ellipse cx="124" cy="102" rx="7.5" ry="4" fill={palette.base} opacity="0.38" />
          <circle cx="120" cy="100.8" r="1.15" fill={palette.base} />
          <circle cx="124" cy="103" r="1.15" fill={palette.base} />
          <circle cx="128" cy="101" r="1.15" fill={palette.base} />
        </g>
      );

    case 'star-stamp':
      return (
        <g className={`character-artwork-blush blush-stars ${className}`} pointerEvents="none">
          <ellipse cx="76" cy="102" rx="7" ry="3.8" fill={palette.base} opacity="0.45" />
          <polygon
            points="76,98.2 77.1,100.6 79.7,101 77.8,102.7 78.3,105.2 76,104 73.7,105.2 74.2,102.7 72.3,101 74.9,100.6"
            fill={palette.highlight}
            stroke={palette.base}
            strokeWidth="0.9"
            strokeLinejoin="round"
          />

          <ellipse cx="124" cy="102" rx="7" ry="3.8" fill={palette.base} opacity="0.45" />
          <polygon
            points="124,98.2 125.1,100.6 127.7,101 125.8,102.7 126.3,105.2 124,104 121.7,105.2 122.2,102.7 120.3,101 122.9,100.6"
            fill={palette.highlight}
            stroke={palette.base}
            strokeWidth="0.9"
            strokeLinejoin="round"
          />
        </g>
      );

    case 'anime-stripes':
    default:
      return (
        <g className={`character-artwork-blush blush-stripes ${className}`} pointerEvents="none">
          <ellipse cx="76" cy="102" rx="8" ry="4.5" fill={palette.base} opacity="0.75" />
          <line
            x1="73"
            y1="104"
            x2="76"
            y2="100"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.8"
          />
          <line
            x1="77"
            y1="104"
            x2="80"
            y2="100"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.8"
          />

          <ellipse cx="124" cy="102" rx="8" ry="4.5" fill={palette.base} opacity="0.75" />
          <line
            x1="121"
            y1="104"
            x2="124"
            y2="100"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.8"
          />
          <line
            x1="125"
            y1="104"
            x2="128"
            y2="100"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>
      );
  }
};
