import React from 'react';
import { ARTWORK_PALETTE } from '../../artwork/palette';
import { HAIR_COLOR_PALETTES, SKIN_TONE_PALETTES } from '../palettes';
import type { HairColorId, HairStyleId, HeadStyleId, SkinToneId } from '../types';

export interface HeadVariantArtworkProps {
  headStyle: HeadStyleId;
  skinTone: SkinToneId;
  hairStyle: HairStyleId;
  hairColor: HairColorId;
  className?: string;
}

function getFaceContourPath(headStyle: HeadStyleId): string {
  switch (headStyle) {
    case 'soft-oval':
      return 'M 68 78 C 68 62 80 51 100 51 C 120 51 132 62 132 78 C 134 90 132 103 125 111 C 118 117 109 119 100 119 C 91 119 82 117 75 111 C 68 103 66 90 68 78 Z';
    case 'sporty-sharp':
      return 'M 67 77 C 67 63 79 52 100 52 C 121 52 133 63 133 77 C 134 88 133 97 128 105 C 121 113 110 118 100 120 C 90 118 79 113 72 105 C 67 97 66 88 67 77 Z';
    case 'classic-glasses':
    case 'sport-headband':
    case 'classic-chibi':
    default:
      return 'M 67 78 C 66 65 78 52 100 52 C 122 52 134 65 133 78 C 136 86 137 96 132 104 C 126 113 114 119 100 119 C 86 119 74 113 68 104 C 63 96 64 86 67 78 Z';
  }
}

export const HeadVariantArtwork: React.FC<HeadVariantArtworkProps> = ({
  headStyle,
  skinTone,
  hairStyle,
  hairColor,
  className = '',
}) => {
  const skin = SKIN_TONE_PALETTES[skinTone] ?? SKIN_TONE_PALETTES['warm-peach'];
  const hair = HAIR_COLOR_PALETTES[hairColor] ?? HAIR_COLOR_PALETTES['charcoal-ink'];
  const facePath = getFaceContourPath(headStyle);

  const renderBackHair = () => {
    switch (hairStyle) {
      case 'clean-crop':
        return (
          <path
            d="M 64 82 C 62 66 68 46 84 41 C 94 38 106 38 116 41 C 132 46 138 66 136 82 Z"
            fill={hair.base}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
            strokeLinejoin="round"
          />
        );
      case 'fluffy-curls':
        return (
          <path
            d="M 59 84 C 53 74 56 58 65 51 C 68 41 79 35 90 36 C 97 32 107 32 114 37 C 125 36 135 43 137 53 C 145 60 146 75 140 84 Z"
            fill={hair.base}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
            strokeLinejoin="round"
          />
        );
      case 'side-part':
        return (
          <path
            d="M 63 82 C 60 66 66 46 81 40 C 94 35 110 35 122 41 C 136 48 140 67 137 82 Z"
            fill={hair.base}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
            strokeLinejoin="round"
          />
        );
      case 'spiky-energy':
        return (
          <path
            d="M 60 83 L 55 71 L 63 65 L 59 50 L 70 48 L 72 34 L 85 40 L 96 27 L 106 38 L 118 29 L 122 43 L 136 40 L 134 54 L 144 62 L 137 73 L 140 83 Z"
            fill={hair.base}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
            strokeLinejoin="round"
          />
        );
      case 'layered-bob':
        return (
          <g>
            {/* Fuller bob silhouette framing below cheekbones behind ears */}
            <path
              d="M 59 82 C 56 64 64 42 82 37 C 94 34 106 34 118 37 C 136 42 144 64 141 82 C 144 96 141 111 131 116 L 125 104 L 75 104 L 69 116 C 59 111 56 96 59 82 Z"
              fill={hair.base}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
          </g>
        );
      case 'snap-cap':
        return (
          <path
            d="M 63 83 C 62 72 64 56 76 48 L 124 48 C 136 56 138 72 137 83 Z"
            fill={hair.base}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
            strokeLinejoin="round"
          />
        );
      case 'messy-swept':
      default:
        return (
          <path
            d="M 62 82 C 58 72 62 50 78 42 C 88 36 112 36 122 42 C 138 50 142 72 138 82 Z"
            fill={hair.base}
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
            strokeLinejoin="round"
          />
        );
    }
  };

  const renderFrontHair = () => {
    switch (hairStyle) {
      case 'clean-crop':
        return (
          <g>
            <path
              d="M 65 73 C 67 60 76 47 100 47 C 124 47 133 60 135 73 C 131 66 121 59 100 59 C 79 59 69 66 65 73 Z"
              fill={hair.base}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            <path
              d="M 82 51 C 94 49 106 49 118 51"
              fill="none"
              stroke={hair.shine}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </g>
        );
      case 'fluffy-curls':
        return (
          <g>
            <path
              d="M 63 75 C 60 66 65 55 74 53 C 77 45 87 42 94 46 C 101 41 112 43 116 49 C 125 46 135 53 135 63 C 140 67 139 73 136 76 C 131 67 123 63 115 65 C 109 61 103 61 98 65 C 92 60 84 61 78 65 C 72 64 66 69 63 75 Z"
              fill={hair.base}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            <path
              d="M 81 51 C 86 48 92 48 96 51"
              fill="none"
              stroke={hair.shine}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M 106 50 C 111 47 117 48 121 52"
              fill="none"
              stroke={hair.shine}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        );
      case 'side-part':
        return (
          <g>
            {/* Sculpted asymmetric part from left temple */}
            <path
              d="M 64 74 C 66 57 78 46 99 45 C 118 44 132 53 136 72 C 131 65 123 62 114 62 C 103 62 93 60 84 55 C 78 62 71 67 64 74 Z"
              fill={hair.base}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            <path
              d="M 88 50 C 98 47 112 48 121 52"
              fill="none"
              stroke={hair.shine}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </g>
        );
      case 'spiky-energy':
        return (
          <g>
            <path
              d="M 64 73 C 67 62 74 52 84 48 L 91 37 L 98 47 L 106 36 L 112 48 C 123 51 132 61 136 73 L 128 65 L 121 67 L 114 61 L 106 66 L 100 60 L 94 67 L 86 61 L 78 66 L 72 64 Z"
              fill={hair.base}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            <path
              d="M 86 52 L 97 50 L 112 52"
              fill="none"
              stroke={hair.shine}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        );
      case 'layered-bob':
        return (
          <g>
            {/* Front fringe + tapered cheek-hugging locks behind eye planes */}
            <path
              d="M 63 75 C 65 58 76 47 100 47 C 124 47 135 58 137 75 C 132 68 123 64 114 65 L 109 59 L 102 65 C 94 61 84 61 76 66 C 70 67 66 70 63 75 Z"
              fill={hair.base}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            {/* Front cheekbone side locks (x < 71 and x > 129, clear of eyes & blush) */}
            <path
              d="M 65 74 C 61 86 63 99 69 109 C 70 101 69 90 69 80 Z"
              fill={hair.base}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
              strokeLinejoin="round"
            />
            <path
              d="M 135 74 C 139 86 137 99 131 109 C 130 101 131 90 131 80 Z"
              fill={hair.base}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
              strokeLinejoin="round"
            />
            <path
              d="M 83 51 C 94 49 107 49 117 52"
              fill="none"
              stroke={hair.shine}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        );
      case 'snap-cap':
        return (
          <g>
            {/* Peeking sideburn hair below cap */}
            <path
              d="M 66 69 C 64 76 65 82 67 86 C 69 81 69 75 68 69 Z"
              fill={hair.base}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
              strokeLinejoin="round"
            />
            <path
              d="M 134 69 C 136 76 135 82 133 86 C 131 81 131 75 132 69 Z"
              fill={hair.base}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
              strokeLinejoin="round"
            />
            {/* Streetwear snapback cap dome */}
            <path
              d="M 63 63 C 64 42 80 34 100 34 C 120 34 136 42 137 63 Z"
              fill="#1E3A8A"
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            {/* Front panel contrast wedge */}
            <path
              d="M 86 35 C 94 34 106 34 114 35 L 118 60 L 82 60 Z"
              fill="#2563EB"
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
              strokeLinejoin="round"
            />
            {/* Cap crown top button */}
            <ellipse
              cx="100"
              cy="34"
              rx="4"
              ry="2"
              fill="#F8FAFC"
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth="1.3"
            />
            {/* Curved cap brim cleanly above eyebrows */}
            <path
              d="M 62 61 C 78 55 122 55 142 61 C 144 63 141 66 135 65 C 118 61 82 61 65 65 C 61 65 60 62 62 61 Z"
              fill="#0F172A"
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            {/* Minimal cap patch emblem */}
            <rect x="94" y="45" width="12" height="7" rx="2" fill="#F8FAFC" />
          </g>
        );
      case 'messy-swept':
      default:
        return (
          <g>
            {/* Crown spiky tufts */}
            <path
              d="M 85 41 L 88 34 L 95 38 L 102 33 L 107 38 L 115 36 L 112 43"
              fill={hair.base}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            {/* Side-swept front bangs */}
            <path
              d="M 64 74 C 66 65 70 56 80 50 C 88 45 102 46 114 49 C 126 53 134 60 137 72 C 134 70 128 68 124 72 C 120 66 113 62 106 63 C 98 64 94 70 91 74 C 88 66 82 63 76 66 C 71 68 67 71 64 74 Z"
              fill={hair.base}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            {/* Temple sideburn locks */}
            <path
              d="M 124 71 C 127 75 128 80 127 84 C 125 82 124 78 123 75 Z"
              fill={hair.base}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
              strokeLinejoin="round"
            />
            <path
              d="M 67 76 C 65 80 65 84 66 87 C 67 84 68 81 69 79 Z"
              fill={hair.base}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
              strokeLinejoin="round"
            />
            <path
              d="M 83 49 C 92 46 104 46 113 49 C 110 50 102 48 94 48 C 88 48 84 49 83 49 Z"
              fill={hair.shine}
            />
            <path
              d="M 74 56 C 78 54 82 54 85 55"
              stroke={hair.shine}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        );
    }
  };

  return (
    <g className={`character-artwork-head ${className}`}>
      {/* 1. NECK & UNDER-CHIN SHADOW */}
      <path
        d="M 94 114 L 93 125 C 93 126 95 127 100 127 C 105 127 107 126 107 125 L 106 114 Z"
        fill={skin.shadow}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
        strokeLinejoin="round"
      />

      {/* 2. EARS */}
      <path
        d="M 66 88 C 59 89 58 97 61 101 C 63 103 66 103 68 100 Z"
        fill={skin.base}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        strokeLinejoin="round"
      />
      <path
        d="M 64 92 C 61.5 94 62 98 64 99"
        fill="none"
        stroke={skin.shadow}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M 134 88 C 141 89 142 97 139 101 C 137 103 134 103 132 100 Z"
        fill={skin.base}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        strokeLinejoin="round"
      />
      <path
        d="M 136 92 C 138.5 94 138 98 136 99"
        fill="none"
        stroke={skin.shadow}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* 3. BACK HAIR VOLUME */}
      {renderBackHair()}

      {/* 4. FACE SKIN BASE */}
      <path
        d={facePath}
        fill={skin.base}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        strokeLinejoin="round"
      />

      {/* Chin soft curvature shadow */}
      <path
        d="M 88 116 C 94 118.5 106 118.5 112 116 C 108 118 104 119 100 119 C 96 119 92 118 88 116 Z"
        fill={skin.shadow}
      />

      {/* 5. NOSE */}
      <path
        d="M 98 96 C 99 94.5 101 94.5 102 96 C 101.5 97 99 97 98 96 Z"
        fill={skin.shadow}
      />
      <path
        d="M 99.5 94.5 L 100.5 96"
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* 6. OPTIONAL HEADWEAR / EYEWEAR INTEGRATED CLEANLY BEHIND EYES LAYER */}
      {headStyle === 'classic-glasses' && (
        <g className="head-glasses" pointerEvents="none">
          {/* Left & Right Earpiece Stems */}
          <line
            x1="65"
            y1="86"
            x2="73"
            y2="86"
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <line
            x1="127"
            y1="86"
            x2="135"
            y2="86"
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Left Lens Rim (spacious around sclera rx=8.2, ry=7.2 at 85,88) */}
          <rect
            x="72.5"
            y="78"
            width="24"
            height="19.5"
            rx="7"
            fill="#E0F2FE"
            fillOpacity="0.28"
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth="2.3"
          />
          {/* Right Lens Rim (at 115,88) */}
          <rect
            x="103.5"
            y="78"
            width="24"
            height="19.5"
            rx="7"
            fill="#E0F2FE"
            fillOpacity="0.28"
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth="2.3"
          />
          {/* Nose Bridge */}
          <path
            d="M 96.5 86 C 98.5 84.5 101.5 84.5 103.5 86"
            fill="none"
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth="2.1"
            strokeLinecap="round"
          />
        </g>
      )}

      {headStyle === 'sport-headband' && (
        <g className="head-sweatband" pointerEvents="none">
          {/* Ribbon ties on temple */}
          <path
            d="M 66 59 L 58 55 L 61 61 L 57 65 L 66 63 Z"
            fill="#2563EB"
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          {/* Forehead athletic band */}
          <path
            d="M 65 62 C 78 55 122 55 135 62 L 136 68 C 122 61 78 61 64 68 Z"
            fill="#2563EB"
            stroke={ARTWORK_PALETTE.strokeDark}
            strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
            strokeLinejoin="round"
          />
          <path
            d="M 72 62 C 88 58 112 58 128 62"
            fill="none"
            stroke="#F8FAFC"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* 7. FRONT HAIR BANGS / CAP OVERLAY */}
      {renderFrontHair()}
    </g>
  );
};

