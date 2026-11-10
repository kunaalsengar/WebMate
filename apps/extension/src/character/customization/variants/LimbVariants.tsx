import React from 'react';
import { ARTWORK_PALETTE } from '../../artwork/palette';
import {
  APPAREL_COLOR_PALETTES,
  BOTTOM_COLOR_PALETTES,
  SHOE_COLOR_PALETTES,
  SKIN_TONE_PALETTES,
} from '../palettes';
import type {
  ApparelColorId,
  ArmSleeveStyleId,
  BottomColorId,
  BottomStyleId,
  HandStyleId,
  ShoeColorId,
  ShoeStyleId,
  SkinToneId,
  TopStyleId,
} from '../types';

/* ============================================================================
   1. ARM VARIANT ARTWORK (Layer 2: layer-arm-left, Layer 5: layer-arm-right)
   ============================================================================ */

export interface ArmVariantArtworkProps {
  side: 'left' | 'right';
  armStyle: ArmSleeveStyleId;
  handStyle: HandStyleId;
  topStyle: TopStyleId;
  topColor: ApparelColorId;
  skinTone: SkinToneId;
  className?: string;
}

function resolveEffectiveSleeveMode(
  armStyle: ArmSleeveStyleId,
  topStyle: TopStyleId
): 'short' | 'long' | 'varsity-long' | 'striped-long' | 'band' | 'glove' {
  switch (armStyle) {
    case 'short-sleeve':
      return 'short';
    case 'long-sleeve':
      return 'long';
    case 'sport-band':
      return 'band';
    case 'cozy-glove':
      return 'glove';
    case 'match-outfit':
    default:
      if (topStyle === 'varsity-jacket') return 'varsity-long';
      if (topStyle === 'striped-sweater') return 'striped-long';
      if (topStyle === 'classic-hoodie') return 'long';
      return 'short';
  }
}

export const ArmVariantArtwork: React.FC<ArmVariantArtworkProps> = ({
  side,
  armStyle,
  handStyle,
  topStyle,
  topColor,
  skinTone,
  className = '',
}) => {
  const top = APPAREL_COLOR_PALETTES[topColor] ?? APPAREL_COLOR_PALETTES['poppy-orange'];
  const skin = SKIN_TONE_PALETTES[skinTone] ?? SKIN_TONE_PALETTES['warm-peach'];
  const mode = resolveEffectiveSleeveMode(armStyle, topStyle);

  const isVarsity = mode === 'varsity-long';
  const varsitySleeveFill = topColor === 'cloud-white' ? '#1E293B' : '#F8FAFC';
  const sleeveFill = isVarsity ? varsitySleeveFill : top.base;
  const sleeveShadow = isVarsity
    ? topColor === 'cloud-white'
      ? '#0F172A'
      : '#CBD5E1'
    : top.shadow;

  const isGloved = mode === 'glove';
  const isLongSleeve = mode === 'long' || mode === 'varsity-long' || mode === 'striped-long';
  const isLeft = side === 'left';

  const renderHand = () => {
    const handFill = isGloved ? '#1E293B' : skin.base;
    const tipSkin = skin.base;

    if (isLeft) {
      if (handStyle === 'open-palm') {
        return (
          <g className="hand-open-left">
            {/* Open waving palm centered around (64, 176) */}
            <path
              d="M 62 167 L 56 172 C 55 173.5 56.5 175 58 174 L 60 173 L 57 180 C 56.5 181.5 58 182.5 59.5 181.5 L 62 178 L 61.5 183 C 61.5 184.5 63.5 184.5 64 183 L 65.5 178 L 67 182.5 C 67.5 183.8 69.5 183.2 69.5 181.5 L 69 175 L 70 169 Z"
              fill={handFill}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            {isGloved && (
              <path
                d="M 59 179 L 61.5 183 L 64 182.5 L 67 182.5 L 69.2 181"
                fill="none"
                stroke={tipSkin}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            )}
          </g>
        );
      }

      if (handStyle === 'peace-gesture') {
        return (
          <g className="hand-peace-left">
            {/* Compact fist base + twin peace fingers extending downward */}
            <path
              d="M 60 168 C 58 170 58 174 59.5 176 L 58.5 183.5 C 58.5 185 61 185 61.8 183.2 L 63.5 177.5 L 65.2 183.2 C 66 185 68.5 184.6 68.5 183 L 68 176.5 C 70.5 175 71.5 171 69.5 168.5 Z"
              fill={handFill}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            {isGloved && (
              <>
                <circle cx="60" cy="183" r="1.4" fill={tipSkin} />
                <circle cx="67" cy="183" r="1.4" fill={tipSkin} />
              </>
            )}
            <path
              d="M 61 171 C 62 173 64 173 65 171.5"
              fill="none"
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </g>
        );
      }

      // Classic relaxed fist centered at (64, 176)
      return (
        <g className="hand-classic-left">
          <path
            d="M 61 168 C 58 171 57 176 59 180 C 61 184 66 184 69 181 C 72 178 72 172 70 169 Z"
            fill={handFill}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
            strokeLinejoin="round"
          />
          {isGloved && (
            <path
              d="M 59 178 C 61 182 66 182 69 179"
              fill="none"
              stroke={tipSkin}
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          )}
          <path
            d="M 62 171 C 60 173 60 176 62 177"
            fill="none"
            stroke={isGloved ? '#94A3B8' : ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
            strokeLinecap="round"
          />
          <path
            d="M 64 179 C 66 180 67 179 68 177"
            fill="none"
            stroke={isGloved ? '#94A3B8' : ARTWORK_PALETTE.strokeDark}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>
      );
    }

    // Right arm hand geometries centered around (138, 176)
    if (handStyle === 'open-palm') {
      return (
        <g className="hand-open-right">
          <path
            d="M 134 169 L 134 176 L 133.5 182 C 133.5 183.5 135.5 184 136 182.5 L 137.5 178 L 139 183.2 C 139.5 184.5 141.5 184.2 141.5 182.5 L 141 177.5 L 143.5 181.5 C 145 182.5 146.5 181.5 146 180 L 143 173.5 L 145.5 174.5 C 147 175 148 173.5 146.5 172 L 141.5 167 Z"
            fill={handFill}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
            strokeLinejoin="round"
          />
          {isGloved && (
            <path
              d="M 134 181.5 L 139.5 182.8 L 144.5 180.5"
              fill="none"
              stroke={tipSkin}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          )}
        </g>
      );
    }

    if (handStyle === 'peace-gesture') {
      return (
        <g className="hand-peace-right">
          <path
            d="M 133.5 168.5 C 131.5 171 132.5 175 135 176.5 L 134.5 183 C 134.5 184.6 137 185 137.8 183.2 L 139.5 177.5 L 141.2 183.2 C 142 185 144.5 185 144.5 183.5 L 143.5 176 C 145 174 145 170 143 168 Z"
            fill={handFill}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
            strokeLinejoin="round"
          />
          {isGloved && (
            <>
              <circle cx="136" cy="183" r="1.4" fill={tipSkin} />
              <circle cx="143" cy="183" r="1.4" fill={tipSkin} />
            </>
          )}
          <path
            d="M 138 171.5 C 139 173 141 173 142 171"
            fill="none"
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>
      );
    }

    // Classic right fist
    return (
      <g className="hand-classic-right">
        <path
          d="M 134 168 C 131 171 130 176 132 180 C 134 184 139 184 142 181 C 145 178 145 172 143 169 Z"
          fill={handFill}
          stroke={ARTWORK_PALETTE.strokeDark}
          strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
          strokeLinejoin="round"
        />
        {isGloved && (
          <path
            d="M 133 179 C 136 182 141 182 143 178"
            fill="none"
            stroke={tipSkin}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        )}
        <path
          d="M 135 171 C 137 173 137 176 135 178"
          fill="none"
          stroke={isGloved ? '#94A3B8' : ARTWORK_PALETTE.strokeDark}
          strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
          strokeLinecap="round"
        />
        <path
          d="M 137 179 C 139 180 140 179 141 177"
          fill="none"
          stroke={isGloved ? '#94A3B8' : ARTWORK_PALETTE.strokeDark}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </g>
    );
  };

  if (isLeft) {
    return (
      <g className={`character-artwork-arm-left ${className}`}>
        {/* Forearm — full sleeve fabric or bare skin */}
        <path
          d="M 66 140 L 61 166 C 60.5 168 62 170 64 170 L 71 168 C 73 167 73.5 165 73.5 163 L 73.5 142 Z"
          fill={isLongSleeve ? sleeveFill : skin.base}
          stroke={ARTWORK_PALETTE.strokeDark}
          strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
          strokeLinejoin="round"
        />
        <path
          d="M 66 140 L 61 166 C 61 167 61.5 168 63 168 L 64 141 Z"
          fill={isLongSleeve ? sleeveShadow : skin.shadow}
        />

        {mode === 'striped-long' && (
          <>
            <line
              x1="64"
              y1="147"
              x2="73"
              y2="147"
              stroke={topColor === 'cloud-white' ? '#1E293B' : '#F8FAFC'}
              strokeWidth="3.2"
            />
            <line
              x1="62.5"
              y1="156"
              x2="73"
              y2="156"
              stroke={topColor === 'cloud-white' ? '#1E293B' : '#F8FAFC'}
              strokeWidth="3.2"
            />
          </>
        )}

        {/* Long sleeve rib cuff or short sleeve cuff */}
        {isLongSleeve ? (
          <path
            d="M 64 130 C 67 127 75 128 78 131 L 76 144 C 73 145 66 144 63 141 Z"
            fill={sleeveFill}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
            strokeLinejoin="round"
          />
        ) : (
          <>
            <path
              d="M 64 130 C 67 127 75 128 78 131 L 76 142 C 73 144 66 143 63 140 Z"
              fill={top.base}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            <path
              d="M 63 140 C 66 143 73 144 76 142 L 75 144 C 71 146 65 144 62 141 Z"
              fill={top.shadow}
            />
          </>
        )}

        {/* Wrist cuff accents */}
        {isLongSleeve && (
          <path
            d="M 61 163 L 72.5 162 L 71.5 167 L 60.5 167 Z"
            fill={isVarsity ? '#0F172A' : top.collar}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        )}
        {(mode === 'band' || mode === 'glove') && (
          <g>
            <path
              d="M 61.5 160 L 73 159 L 72 166 L 60.5 166 Z"
              fill={mode === 'glove' ? '#06B6D4' : '#0F172A'}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <line
              x1="61.5"
              y1="163"
              x2="72"
              y2="162.5"
              stroke="#F8FAFC"
              strokeWidth="1.5"
            />
          </g>
        )}

        {renderHand()}
      </g>
    );
  }

  return (
    <g className={`character-artwork-arm-right ${className}`}>
      {/* Right Forearm */}
      <path
        d="M 126.5 142 L 133 166 C 133.5 168 135 170 137 170 L 144 167 C 145.5 165 145 163 144.5 161 L 135 140 Z"
        fill={isLongSleeve ? sleeveFill : skin.base}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        strokeLinejoin="round"
      />
      <path
        d="M 135 140 L 144.5 161 C 144.5 162 144 164 142 165 L 134 142 Z"
        fill={isLongSleeve ? sleeveShadow : skin.shadow}
      />

      {mode === 'striped-long' && (
        <>
          <line
            x1="128"
            y1="147"
            x2="138"
            y2="147"
            stroke={topColor === 'cloud-white' ? '#1E293B' : '#F8FAFC'}
            strokeWidth="3.2"
          />
          <line
            x1="130.5"
            y1="156"
            x2="142"
            y2="156"
            stroke={topColor === 'cloud-white' ? '#1E293B' : '#F8FAFC'}
            strokeWidth="3.2"
          />
        </>
      )}

      {isLongSleeve ? (
        <path
          d="M 122 131 C 125 128 133 127 136 130 L 137 141 C 134 144 127 145 124 144 Z"
          fill={sleeveFill}
          stroke={ARTWORK_PALETTE.strokeDark}
          strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
          strokeLinejoin="round"
        />
      ) : (
        <>
          <path
            d="M 122 131 C 125 128 133 127 136 130 L 137 140 C 134 143 127 144 124 142 Z"
            fill={top.base}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
            strokeLinejoin="round"
          />
          <path
            d="M 124 142 C 127 144 134 143 137 140 L 138 141 C 135 144 128 145 125 143 Z"
            fill={top.shadow}
          />
        </>
      )}

      {isLongSleeve && (
        <path
          d="M 131.5 162 L 144 162 L 144.5 167 L 132.5 167 Z"
          fill={isVarsity ? '#0F172A' : top.collar}
          stroke={ARTWORK_PALETTE.strokeDark}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      )}
      {(mode === 'band' || mode === 'glove') && (
        <g>
          <path
            d="M 131 159 L 143.5 159.5 L 144.5 166 L 132.5 166 Z"
            fill={mode === 'glove' ? '#06B6D4' : '#0F172A'}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <line
            x1="132"
            y1="162.5"
            x2="144"
            y2="162.5"
            stroke="#F8FAFC"
            strokeWidth="1.5"
          />
        </g>
      )}

      {renderHand()}
    </g>
  );
};

/* ============================================================================
   2. LEG & SHOE VARIANT ARTWORK (Layer 1: layer-leg-left, Layer 3: layer-leg-right)
   ============================================================================ */

export interface LegVariantArtworkProps {
  side: 'left' | 'right';
  shoeStyle: ShoeStyleId;
  shoeColor: ShoeColorId;
  bottomStyle: BottomStyleId;
  bottomColor: BottomColorId;
  skinTone: SkinToneId;
  className?: string;
}

export const LegVariantArtwork: React.FC<LegVariantArtworkProps> = ({
  side,
  shoeStyle,
  shoeColor,
  bottomStyle,
  bottomColor,
  skinTone,
  className = '',
}) => {
  const shoe = SHOE_COLOR_PALETTES[shoeColor] ?? SHOE_COLOR_PALETTES['speed-cyan'];
  const bottom = BOTTOM_COLOR_PALETTES[bottomColor] ?? BOTTOM_COLOR_PALETTES['mustard-amber'];
  const skin = SKIN_TONE_PALETTES[skinTone] ?? SKIN_TONE_PALETTES['warm-peach'];
  const isLeft = side === 'left';
  const isFullLengthPants = bottomStyle === 'denim-jeans' || bottomStyle === 'cozy-joggers';

  const renderLegAndSock = () => {
    if (isLeft) {
      if (isFullLengthPants) {
        return (
          <g className="leg-pants-left">
            {/* Trouser leg cleanly bridging hip waist y=194..225 */}
            <path
              d="M 79.5 194 L 80 224 C 82 225.5 94 225.5 96 224 L 96 194 Z"
              fill={bottom.base}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            <path
              d="M 80 196 L 80 223.5 L 84 224 L 84 196 Z"
              fill={bottom.shadow}
              opacity="0.55"
            />
            {bottomStyle === 'cozy-joggers' && (
              <rect
                x="80.5"
                y="221"
                width="15"
                height="5"
                rx="2"
                fill={bottom.shadow}
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth="1.4"
              />
            )}
            {bottomStyle === 'denim-jeans' && (
              <path
                d="M 81 222.5 Q 88 224 95 222.5"
                fill="none"
                stroke={bottom.highlight}
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            )}
          </g>
        );
      }

      return (
        <g className="leg-bare-left">
          <path
            d="M 83 194 L 83 222 C 83 223 85 224 88 224 C 91 224 93 223 93 222 L 93 194 Z"
            fill={skin.base}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
            strokeLinejoin="round"
          />
          <path
            d="M 83 196 L 83 222 C 83 223 85 223.5 86 223.5 L 86 196 Z"
            fill={skin.shadow}
          />
          <path
            d="M 81.5 221 C 81.5 220 84 219.5 88 219.5 C 92 219.5 94.5 220 94.5 221 L 95 227 C 95 228 92 228.5 88 228.5 C 84 228.5 81 228 81 227 Z"
            fill={ARTWORK_PALETTE.sockWhite}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
            strokeLinejoin="round"
          />
          <path
            d="M 82.5 224 C 85 223.5 91 223.5 93.5 224"
            fill="none"
            stroke={ARTWORK_PALETTE.sockShadow}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>
      );
    }

    // Right leg
    if (isFullLengthPants) {
      return (
        <g className="leg-pants-right">
          <path
            d="M 104 194 L 104 224 C 106 225.5 118 225.5 120 224 L 120.5 194 Z"
            fill={bottom.base}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
            strokeLinejoin="round"
          />
          <path
            d="M 116 196 L 116 224 L 120 223.5 L 120 196 Z"
            fill={bottom.shadow}
            opacity="0.55"
          />
          {bottomStyle === 'cozy-joggers' && (
            <rect
              x="104.5"
              y="221"
              width="15"
              height="5"
              rx="2"
              fill={bottom.shadow}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth="1.4"
            />
          )}
          {bottomStyle === 'denim-jeans' && (
            <path
              d="M 105 222.5 Q 112 224 119 222.5"
              fill="none"
              stroke={bottom.highlight}
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          )}
        </g>
      );
    }

    return (
      <g className="leg-bare-right">
        <path
          d="M 107 194 L 107 222 C 107 223 109 224 112 224 C 115 224 117 223 117 222 L 117 194 Z"
          fill={skin.base}
          stroke={ARTWORK_PALETTE.strokeDark}
          strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
          strokeLinejoin="round"
        />
        <path
          d="M 115 196 L 115 222 C 115 223 114 223.5 113 223.5 L 113 196 Z"
          fill={skin.shadow}
        />
        <path
          d="M 105.5 221 C 105.5 220 108 219.5 112 219.5 C 116 219.5 118.5 220 118.5 221 L 119 227 C 119 228 116 228.5 112 228.5 C 108 228.5 105 228 105 227 Z"
          fill={ARTWORK_PALETTE.sockWhite}
          stroke={ARTWORK_PALETTE.strokeDark}
          strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
          strokeLinejoin="round"
        />
        <path
          d="M 106.5 224 C 109 223.5 115 223.5 117.5 224"
          fill="none"
          stroke={ARTWORK_PALETTE.sockShadow}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </g>
    );
  };

  const renderShoe = () => {
    if (isLeft) {
      switch (shoeStyle) {
        case 'high-top':
          return (
            <g className="shoe-hightop-left">
              {/* High ankle collar */}
              <path
                d="M 81 220 L 94 220 L 97 233 C 97.5 235.5 97 237 96 237 L 72 237 C 71 237 70.5 235.5 71 233.5 C 72 230.5 76.5 228 80 227 Z"
                fill={shoe.primary}
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
                strokeLinejoin="round"
              />
              {/* Padded collar band */}
              <rect
                x="80.5"
                y="220"
                width="14"
                height="4.5"
                rx="2"
                fill={ARTWORK_PALETTE.sneakerWhite}
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth="1.3"
              />
              <circle
                cx="89"
                cy="230"
                r="2.4"
                fill={ARTWORK_PALETTE.sneakerWhite}
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth="1"
              />
              <path
                d="M 71 234 C 71.5 232 75 231 77 231.5 L 77 237 L 72 237 C 71 237 70.8 235.5 71 234 Z"
                fill={ARTWORK_PALETTE.sneakerWhite}
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
                strokeLinejoin="round"
              />
              <path
                d="M 69.5 236 L 97.5 236 C 98.5 236 99 237.5 98.5 239 L 69 239 C 68.5 237.5 68.8 236 69.5 236 Z"
                fill={ARTWORK_PALETTE.sneakerWhite}
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
                strokeLinejoin="round"
              />
              <line
                x1="70"
                y1="239"
                x2="98"
                y2="239"
                stroke={ARTWORK_PALETTE.sneakerTread}
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </g>
          );

        case 'slip-on':
          return (
            <g className="shoe-slipon-left">
              <path
                d="M 81 227 C 76 228 71.5 231 71 234.5 C 70.8 236 71.2 237 72 237 L 96.5 237 C 97.5 237 98 235.5 97.5 233 C 97 230 94 227.5 92 227 Z"
                fill={shoe.primary}
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
                strokeLinejoin="round"
              />
              {/* Elastic gore insert & crisp stitched vamp */}
              <polygon
                points="85,227.5 89,227.5 87,231.5"
                fill={ARTWORK_PALETTE.sneakerWhite}
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth="0.9"
                strokeLinejoin="round"
              />
              <path
                d="M 73 233 C 77 232 82 232.5 86 234"
                fill="none"
                stroke={ARTWORK_PALETTE.sneakerWhite}
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <path
                d="M 69.5 236 L 97.5 236 C 98.5 236 99 237.5 98.5 239 L 69 239 C 68.5 237.5 68.8 236 69.5 236 Z"
                fill={ARTWORK_PALETTE.sneakerWhite}
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
                strokeLinejoin="round"
              />
              <line
                x1="70"
                y1="239"
                x2="98"
                y2="239"
                stroke={ARTWORK_PALETTE.sneakerTread}
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </g>
          );

        case 'running-shoe':
          return (
            <g className="shoe-runner-left">
              <path
                d="M 81 225.5 C 76 227 71.5 231 70 234.5 L 97 235.5 C 98 233 95 227.5 93 226 Z"
                fill={shoe.primary}
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
                strokeLinejoin="round"
              />
              {/* Heel stabilizer clip */}
              <path
                d="M 91 226.5 L 94.5 228 L 96.5 235 L 91.5 235 Z"
                fill={shoe.dark}
              />
              {/* Dual aero stripes */}
              <path
                d="M 75 232.5 L 88 229.5 M 78 234 L 91 231.5"
                fill="none"
                stroke={ARTWORK_PALETTE.sneakerWhite}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              {/* Wedge sculpted midsole */}
              <path
                d="M 68.5 235 C 78 234 89 234.5 99 235.5 L 99 239 L 68.5 239 C 67.5 237.5 68 236 68.5 235 Z"
                fill={ARTWORK_PALETTE.sneakerWhite}
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
                strokeLinejoin="round"
              />
              <line
                x1="69"
                y1="239"
                x2="98.5"
                y2="239"
                stroke={shoe.primary}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </g>
          );

        case 'sport-sneaker':
        default:
          return (
            <g className="shoe-sneaker-left">
              <path
                d="M 81 226 C 77 227 72 231 71 234 C 70.5 235.5 71 237 72 237 L 96 237 C 97.5 237 98 235.5 97.5 233 C 97 230 94 227 92 226 Z"
                fill={shoe.primary}
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
                strokeLinejoin="round"
              />
              <path
                d="M 78 233.5 Q 85 230 92 232"
                fill="none"
                stroke={ARTWORK_PALETTE.sneakerWhite}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M 71 234 C 71.5 232 75 231 77 231.5 L 77 237 L 72 237 C 71 237 70.8 235.5 71 234 Z"
                fill={ARTWORK_PALETTE.sneakerWhite}
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
                strokeLinejoin="round"
              />
              <path
                d="M 69.5 236 L 97.5 236 C 98.5 236 99 237.5 98.5 239 L 69 239 C 68.5 237.5 68.8 236 69.5 236 Z"
                fill={ARTWORK_PALETTE.sneakerWhite}
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
                strokeLinejoin="round"
              />
              <line
                x1="70"
                y1="239"
                x2="98"
                y2="239"
                stroke={ARTWORK_PALETTE.sneakerTread}
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <line
                x1="82"
                y1="228"
                x2="86"
                y2="230"
                stroke={ARTWORK_PALETTE.sneakerLace}
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <line
                x1="83"
                y1="231"
                x2="87"
                y2="233"
                stroke={ARTWORK_PALETTE.sneakerLace}
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </g>
          );
      }
    }

    // Right shoe variants (foreground angle)
    switch (shoeStyle) {
      case 'high-top':
        return (
          <g className="shoe-hightop-right">
            <path
              d="M 106 220 L 119 220 L 120 227 C 123.5 228 128 230.5 129 233.5 C 129.5 235.5 129 237 128 237 L 104 237 C 102.5 237 102 235.5 102.5 233 Z"
              fill={shoe.primary}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            <rect
              x="105.5"
              y="220"
              width="14"
              height="4.5"
              rx="2"
              fill={ARTWORK_PALETTE.sneakerWhite}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth="1.3"
            />
            <circle
              cx="111"
              cy="230"
              r="2.4"
              fill={ARTWORK_PALETTE.sneakerWhite}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth="1"
            />
            <path
              d="M 123 231.5 C 125 232 128.5 232 129 234 C 129.5 235.5 129 237 128 237 L 123 237 Z"
              fill={ARTWORK_PALETTE.sneakerWhite}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
              strokeLinejoin="round"
            />
            <path
              d="M 101.5 236 L 130 236 C 131 236 131.2 237.5 130.5 239 L 101 239 C 100.5 237.5 100.8 236 101.5 236 Z"
              fill={ARTWORK_PALETTE.sneakerWhite}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            <line
              x1="102"
              y1="239"
              x2="130"
              y2="239"
              stroke={ARTWORK_PALETTE.sneakerTread}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </g>
        );

      case 'slip-on':
        return (
          <g className="shoe-slipon-right">
            <path
              d="M 108 227 C 106 227.5 103 230 102.5 233 C 102 235.5 102.5 237 104 237 L 128 237 C 128.8 237 129.2 236 129 234.5 C 128.5 231 124 228 119 227 Z"
              fill={shoe.primary}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            <polygon
              points="111,227.5 115,227.5 113,231.5"
              fill={ARTWORK_PALETTE.sneakerWhite}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth="0.9"
              strokeLinejoin="round"
            />
            <path
              d="M 114 234 C 118 232.5 123 232 127 233"
              fill="none"
              stroke={ARTWORK_PALETTE.sneakerWhite}
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M 101.5 236 L 130 236 C 131 236 131.2 237.5 130.5 239 L 101 239 C 100.5 237.5 100.8 236 101.5 236 Z"
              fill={ARTWORK_PALETTE.sneakerWhite}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            <line
              x1="102"
              y1="239"
              x2="130"
              y2="239"
              stroke={ARTWORK_PALETTE.sneakerTread}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </g>
        );

      case 'running-shoe':
        return (
          <g className="shoe-runner-right">
            <path
              d="M 107 226 C 105 227.5 102 233 103 235.5 L 130 234.5 C 128.5 231 124 227 119 225.5 Z"
              fill={shoe.primary}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            <path
              d="M 109 226.5 L 105.5 228 L 103.5 235 L 108.5 235 Z"
              fill={shoe.dark}
            />
            <path
              d="M 112 229.5 L 125 232.5 M 109 231.5 L 122 234"
              fill="none"
              stroke={ARTWORK_PALETTE.sneakerWhite}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M 101 235.5 C 111 234.5 122 234 131.5 235 C 132 236 132.5 237.5 131.5 239 L 101 239 Z"
              fill={ARTWORK_PALETTE.sneakerWhite}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            <line
              x1="101.5"
              y1="239"
              x2="131"
              y2="239"
              stroke={shoe.primary}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </g>
        );

      case 'sport-sneaker':
      default:
        return (
          <g className="shoe-sneaker-right">
            <path
              d="M 108 226 C 106 227 103 230 102.5 233 C 102 235.5 102.5 237 104 237 L 128 237 C 129 237 129.5 235.5 129 234 C 128 231 123 227 119 226 Z"
              fill={shoe.primary}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            <path
              d="M 108 232 Q 115 230 122 233.5"
              fill="none"
              stroke={ARTWORK_PALETTE.sneakerWhite}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M 123 231.5 C 125 232 128.5 232 129 234 C 129.5 235.5 129 237 128 237 L 123 237 Z"
              fill={ARTWORK_PALETTE.sneakerWhite}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
              strokeLinejoin="round"
            />
            <path
              d="M 101.5 236 L 130 236 C 131 236 131.2 237.5 130.5 239 L 101 239 C 100.5 237.5 100.8 236 101.5 236 Z"
              fill={ARTWORK_PALETTE.sneakerWhite}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            <line
              x1="102"
              y1="239"
              x2="130"
              y2="239"
              stroke={ARTWORK_PALETTE.sneakerTread}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <line
              x1="113"
              y1="228"
              x2="117"
              y2="230"
              stroke={ARTWORK_PALETTE.sneakerLace}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <line
              x1="113"
              y1="231"
              x2="117"
              y2="233"
              stroke={ARTWORK_PALETTE.sneakerLace}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </g>
        );
    }
  };

  return (
    <g className={`character-artwork-leg-${side} ${className}`}>
      {renderLegAndSock()}
      {renderShoe()}
    </g>
  );
};

