import React from 'react';
import type { CharacterExpression } from '@webmate/shared';
import { ARTWORK_PALETTE } from '../../artwork/palette';
import { resolveFxTintHex } from '../palettes';
import type { FxColorId, FxStyleId, ShadowStyleId } from '../types';

/* ============================================================================
   1. GROUND SHADOW VARIANT ARTWORK (Layer 0: layer-shadow)
   ============================================================================ */

export interface ShadowVariantArtworkProps {
  shadowStyle: ShadowStyleId;
  className?: string;
}

export const ShadowVariantArtwork: React.FC<ShadowVariantArtworkProps> = ({
  shadowStyle,
  className = '',
}) => {
  if (shadowStyle === 'none') {
    return null;
  }

  switch (shadowStyle) {
    case 'clean-oval':
      return (
        <g className={`character-artwork-shadow shadow-oval ${className}`} pointerEvents="none">
          <ellipse cx="100" cy="240" rx="43" ry="7.5" fill="rgba(15, 23, 42, 0.14)" />
          <ellipse cx="100" cy="240" rx="28" ry="4.5" fill="rgba(15, 23, 42, 0.24)" />
        </g>
      );

    case 'glow-ring':
      return (
        <g className={`character-artwork-shadow shadow-ring ${className}`} pointerEvents="none">
          <ellipse
            cx="100"
            cy="240"
            rx="44"
            ry="8"
            fill="rgba(37, 99, 235, 0.12)"
            stroke="rgba(59, 130, 246, 0.55)"
            strokeWidth="1.5"
            strokeDasharray="6,3"
          />
          <ellipse cx="100" cy="240" rx="30" ry="4.5" fill="rgba(15, 23, 42, 0.22)" />
        </g>
      );

    case 'classic-dual':
    default:
      return (
        <g className={`character-artwork-shadow ${className}`} pointerEvents="none">
          <ellipse cx="100" cy="240" rx="44" ry="8" fill={ARTWORK_PALETTE.shadowSoft} />
          <ellipse cx="84" cy="240" rx="18" ry="5" fill={ARTWORK_PALETTE.shadowCore} />
          <ellipse cx="116" cy="240" rx="18" ry="5" fill={ARTWORK_PALETTE.shadowCore} />
        </g>
      );
  }
};

/* ============================================================================
   2. EMOTIONAL FX VARIANT ARTWORK (Layer 11: layer-fx)
   ============================================================================ */

export interface FxVariantArtworkProps {
  expression?: CharacterExpression;
  fxStyle: FxStyleId;
  fxColor: FxColorId;
  className?: string;
}

export const FxVariantArtwork: React.FC<FxVariantArtworkProps> = ({
  expression = 'normal',
  fxStyle,
  fxColor,
  className = '',
}) => {
  if (fxStyle === 'none') {
    return null;
  }

  const customTint = resolveFxTintHex(fxColor);
  const sparkleColor = customTint ?? ARTWORK_PALETTE.fxSparkle;
  const questionColor = customTint ?? ARTWORK_PALETTE.fxQuestion;
  const sweatColor = customTint ?? ARTWORK_PALETTE.fxSweat;
  const zzzColor = customTint ?? ARTWORK_PALETTE.fxZzz;
  const burstStroke = customTint ?? ARTWORK_PALETTE.strokeDark;

  if (fxStyle === 'minimal-clean') {
    switch (expression) {
      case 'happy':
        return (
          <g className={`character-artwork-fx fx-minimal-happy ${className}`} pointerEvents="none">
            <circle cx="60" cy="68" r="2.8" fill={sparkleColor} opacity="0.85" />
            <circle cx="139" cy="65" r="2.4" fill={sparkleColor} opacity="0.85" />
            <circle cx="144" cy="74" r="1.4" fill={sparkleColor} opacity="0.65" />
          </g>
        );
      case 'thinking':
        return (
          <g className={`character-artwork-fx fx-minimal-thinking ${className}`} pointerEvents="none">
            <circle cx="127" cy="61" r="1.6" fill={questionColor} opacity="0.7" />
            <circle cx="132" cy="53" r="2.3" fill={questionColor} opacity="0.85" />
            <circle cx="139" cy="44" r="3.1" fill={questionColor} />
          </g>
        );
      case 'confused':
        return (
          <g className={`character-artwork-fx fx-minimal-confused ${className}`} pointerEvents="none">
            <path
              d="M 134 75 C 132.5 72 135 69 135 69 C 135 69 137.5 72 136 75 C 135.4 76.2 134.6 76.2 134 75 Z"
              fill={sweatColor}
              opacity="0.9"
            />
          </g>
        );
      case 'surprised':
        return (
          <g className={`character-artwork-fx fx-minimal-surprised ${className}`} pointerEvents="none">
            <circle cx="62" cy="56" r="2.2" fill={burstStroke} opacity="0.7" />
            <circle cx="138" cy="56" r="2.2" fill={burstStroke} opacity="0.7" />
          </g>
        );
      case 'sleeping':
        return (
          <g className={`character-artwork-fx fx-minimal-sleeping ${className}`} pointerEvents="none">
            <text x="123" y="54" fill={zzzColor} fontSize="8.5" fontFamily="sans-serif" fontWeight="700">
              z
            </text>
            <text
              x="131"
              y="45"
              fill={zzzColor}
              fontSize="7"
              fontFamily="sans-serif"
              fontWeight="700"
              opacity="0.7"
            >
              z
            </text>
          </g>
        );
      default:
        return null;
    }
  }

  if (fxStyle === 'comic-pop') {
    switch (expression) {
      case 'happy':
        return (
          <g className={`character-artwork-fx fx-comic-happy ${className}`} pointerEvents="none">
            <g transform="translate(59, 66)">
              <polygon
                points="0,-9 2.5,-2.5 9,0 2.5,2.5 0,9 -2.5,2.5 -9,0 -2.5,-2.5"
                fill={sparkleColor}
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </g>
            <g transform="translate(140, 62)">
              <polygon
                points="0,-8 2.2,-2.2 8,0 2.2,2.2 0,8 -2.2,2.2 -8,0 -2.2,-2.2"
                fill={sparkleColor}
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </g>
          </g>
        );
      case 'thinking':
        return (
          <g className={`character-artwork-fx fx-comic-thinking ${className}`} pointerEvents="none">
            <g transform="translate(133, 52)">
              <path
                d="M -4 -9 C -5 -15 6 -17 8 -11 C 9 -6 2 -4 1 -0.5 L 1 1.5"
                fill="none"
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth="4.4"
                strokeLinecap="round"
              />
              <path
                d="M -4 -9 C -5 -15 6 -17 8 -11 C 9 -6 2 -4 1 -0.5 L 1 1.5"
                fill="none"
                stroke={questionColor}
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <circle
                cx="1"
                cy="6"
                r="2.0"
                fill={questionColor}
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth="1.1"
              />
            </g>
          </g>
        );
      case 'confused':
        return (
          <g className={`character-artwork-fx fx-comic-confused ${className}`} pointerEvents="none">
            <path
              d="M 132 76 C 129.5 71 135 65 135 65 C 135 65 140.5 71 138 76 C 136.5 78.8 133.5 78.8 132 76 Z"
              fill={sweatColor}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth="1.6"
            />
            <path
              d="M 134 72 C 133.5 74.5 134.5 76 135 76"
              stroke="#FFFFFF"
              strokeWidth="1.1"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        );
      case 'surprised':
        return (
          <g className={`character-artwork-fx fx-comic-surprised ${className}`} pointerEvents="none">
            <line
              x1="58"
              y1="59"
              x2="50"
              y2="50"
              stroke={burstStroke}
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <line
              x1="142"
              y1="59"
              x2="150"
              y2="50"
              stroke={burstStroke}
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <line
              x1="100"
              y1="30"
              x2="100"
              y2="21"
              stroke={burstStroke}
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <line
              x1="78"
              y1="34"
              x2="74"
              y2="26"
              stroke={burstStroke}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <line
              x1="122"
              y1="34"
              x2="126"
              y2="26"
              stroke={burstStroke}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </g>
        );
      case 'sleeping':
        return (
          <g className={`character-artwork-fx fx-comic-sleeping ${className}`} pointerEvents="none">
            <text
              x="120"
              y="52"
              fill={zzzColor}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth="0.6"
              fontSize="11"
              fontFamily="sans-serif"
              fontWeight="900"
            >
              Z
            </text>
            <text
              x="130"
              y="41"
              fill={zzzColor}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth="0.5"
              fontSize="9"
              fontFamily="sans-serif"
              fontWeight="900"
            >
              Z
            </text>
            <g transform="translate(108, 104)">
              <ellipse
                cx="0"
                cy="0"
                rx="5.5"
                ry="5.5"
                fill={ARTWORK_PALETTE.fxBubble}
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth="1.4"
              />
              <path
                d="M -2 -2 C -1 -3.5 2 -3.5 3 -2"
                fill="none"
                stroke={ARTWORK_PALETTE.fxBubbleSheen}
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </g>
          </g>
        );
      default:
        return null;
    }
  }

  // 'classic-anime' (Original style geometry, optionally tinted)
  switch (expression) {
    case 'happy':
      return (
        <g className={`character-artwork-fx fx-happy ${className}`} pointerEvents="none">
          <g transform="translate(60, 68)">
            <polygon points="0,-7 2,-2 7,0 2,2 0,7 -2,2 -7,0 -2,-2" fill={sparkleColor} />
            <circle cx="0" cy="0" r="1.5" fill="#FFFFFF" />
          </g>
          <g transform="translate(138, 64)">
            <polygon points="0,-6 1.8,-1.8 6,0 1.8,1.8 0,6 -1.8,1.8 -6,0 -1.8,-1.8" fill={sparkleColor} />
            <circle cx="0" cy="0" r="1.2" fill="#FFFFFF" />
          </g>
          <circle cx="144" cy="74" r="1.4" fill={sparkleColor} />
        </g>
      );

    case 'thinking':
      return (
        <g className={`character-artwork-fx fx-thinking ${className}`} pointerEvents="none">
          <g transform="translate(132, 54)">
            <path
              d="M -3 -8 C -4 -13 4 -15 6 -10 C 7 -6 2 -4 1 -1 L 1 1"
              fill="none"
              stroke={questionColor}
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <circle cx="1" cy="4.5" r="1.4" fill={questionColor} />
          </g>
        </g>
      );

    case 'confused':
      return (
        <g className={`character-artwork-fx fx-confused ${className}`} pointerEvents="none">
          <path
            d="M 133 76 C 131 72 135 68 135 68 C 135 68 139 72 137 76 C 136 78 134 78 133 76 Z"
            fill={sweatColor}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth="1.2"
          />
          <path
            d="M 134 73 C 133.5 75 134.5 76 135 76"
            stroke="#FFFFFF"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      );

    case 'surprised':
      return (
        <g className={`character-artwork-fx fx-surprised ${className}`} pointerEvents="none">
          <line
            x1="58"
            y1="58"
            x2="52"
            y2="52"
            stroke={burstStroke}
            strokeWidth="2.0"
            strokeLinecap="round"
          />
          <line
            x1="142"
            y1="58"
            x2="148"
            y2="52"
            stroke={burstStroke}
            strokeWidth="2.0"
            strokeLinecap="round"
          />
          <line
            x1="100"
            y1="30"
            x2="100"
            y2="24"
            stroke={burstStroke}
            strokeWidth="2.0"
            strokeLinecap="round"
          />
        </g>
      );

    case 'sleeping':
      return (
        <g className={`character-artwork-fx fx-sleeping ${className}`} pointerEvents="none">
          <text x="122" y="52" fill={zzzColor} fontSize="10" fontFamily="sans-serif" fontWeight="bold">
            Z
          </text>
          <text
            x="131"
            y="42"
            fill={zzzColor}
            fontSize="8"
            fontFamily="sans-serif"
            fontWeight="bold"
            opacity="0.85"
          >
            z
          </text>
          <text
            x="138"
            y="34"
            fill={zzzColor}
            fontSize="6"
            fontFamily="sans-serif"
            fontWeight="bold"
            opacity="0.65"
          >
            z
          </text>
          <g transform="translate(108, 104)">
            <ellipse
              cx="0"
              cy="0"
              rx="5"
              ry="5"
              fill={ARTWORK_PALETTE.fxBubble}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth="1.0"
            />
            <path
              d="M -2 -2 C -1 -3.5 2 -3.5 3 -2"
              fill="none"
              stroke={ARTWORK_PALETTE.fxBubbleSheen}
              strokeWidth="1.0"
              strokeLinecap="round"
            />
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

