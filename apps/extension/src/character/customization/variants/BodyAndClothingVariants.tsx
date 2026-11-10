import React from 'react';
import { ARTWORK_PALETTE } from '../../artwork/palette';
import { APPAREL_COLOR_PALETTES, BOTTOM_COLOR_PALETTES } from '../palettes';
import type { ApparelColorId, BodyStyleId, BottomColorId, BottomStyleId, TopStyleId } from '../types';

export interface BodyVariantArtworkProps {
  bodyStyle: BodyStyleId;
  topStyle: TopStyleId;
  topColor: ApparelColorId;
  bottomStyle: BottomStyleId;
  bottomColor: BottomColorId;
  className?: string;
}

export const BodyVariantArtwork: React.FC<BodyVariantArtworkProps> = ({
  bodyStyle,
  topStyle,
  topColor,
  bottomStyle,
  bottomColor,
  className = '',
}) => {
  const top = APPAREL_COLOR_PALETTES[topColor] ?? APPAREL_COLOR_PALETTES['poppy-orange'];
  const bottom = BOTTOM_COLOR_PALETTES[bottomColor] ?? BOTTOM_COLOR_PALETTES['mustard-amber'];
  const isLightTop = topColor === 'cloud-white' || topColor === 'sunny-gold';
  const contrastAccent = topColor === 'cloud-white' ? '#1E293B' : '#F8FAFC';

  // Torso outline coordinates keyed by BodyStyleId while preserving shoulder (74/126,130) and neck (94/106,123)
  const torsoBounds = (() => {
    switch (bodyStyle) {
      case 'athletic':
        return {
          bodyPath:
            'M 72 130 C 77 125 90 123 100 123 C 110 123 123 125 128 130 L 122 173 C 113 175.5 104 176 100 176 C 96 176 87 175.5 78 173 Z',
          shadowPath:
            'M 118 130 C 122 133 127 137 126 146 L 122 173 C 117 174.5 112 175.5 108 175.5 L 112 142 Z',
          hemPath: 'M 79 172 Q 100 176 121 172',
          ribPath: 'M 78 168 Q 100 171 122 168 L 122 173 C 113 175.5 104 176 100 176 C 96 176 87 175.5 78 173 Z',
          leftWaistX: 78,
          rightWaistX: 122,
        };
      case 'cozy-chibi':
        return {
          bodyPath:
            'M 73 130 C 78 126 90 123 100 123 C 110 123 122 126 127 130 L 127.5 173 C 117 176.5 106 177.5 100 177.5 C 94 177.5 83 176.5 72.5 173 Z',
          shadowPath:
            'M 117 130 C 121 133 127 138 127 148 L 127.5 173 C 121 175 115 176.5 110 176.5 L 113 142 Z',
          hemPath: 'M 75 172.5 Q 100 177.5 125 172.5',
          ribPath: 'M 73 168 Q 100 172 127 168 L 127.5 173 C 117 176.5 106 177.5 100 177.5 C 94 177.5 83 176.5 72.5 173 Z',
          leftWaistX: 74,
          rightWaistX: 126,
        };
      case 'classic':
      default:
        return {
          bodyPath:
            'M 74 130 C 78 126 90 123 100 123 C 110 123 122 126 126 130 L 125 173 C 115 175 105 176 100 176 C 95 176 85 175 75 173 Z',
          shadowPath:
            'M 116 130 C 120 133 125 137 125 145 L 125 173 C 120 174.5 114 175.5 110 175.5 L 112 142 Z',
          hemPath: 'M 77 172 Q 100 176 123 172',
          ribPath: 'M 75.5 168 Q 100 171.5 124.5 168 L 125 173 C 115 175 105 176 100 176 C 95 176 85 175 75 173 Z',
          leftWaistX: 76,
          rightWaistX: 124,
        };
    }
  })();

  const renderBottoms = () => {
    switch (bottomStyle) {
      case 'athletic-shorts':
        return (
          <g className="bottoms-athletic-shorts">
            <path
              d="M 76 172 L 73.5 194 C 73.5 197 76.5 198.5 81 198.5 L 95 198.5 C 97.5 198.5 99 196.5 100 193.5 C 101 196.5 102.5 198.5 105 198.5 L 119 198.5 C 123.5 198.5 126.5 197 126.5 194 L 124 172 Z"
              fill={bottom.base}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            {/* Track side stripes */}
            <path
              d="M 76.5 176 L 75 196.5"
              fill="none"
              stroke="#F8FAFC"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M 123.5 176 L 125 196.5"
              fill="none"
              stroke="#F8FAFC"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M 100 185 L 100 193.5"
              fill="none"
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
              strokeLinecap="round"
            />
            {/* Drawstring waist peeking cleanly */}
            <path
              d="M 97 175 L 96 181 M 103 175 L 104 181"
              fill="none"
              stroke="#F8FAFC"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        );

      case 'denim-jeans':
        return (
          <g className="bottoms-denim-jeans">
            {/* Waist and upper thighs joining cleanly with trousers on legs */}
            <path
              d="M 76 172 L 74 196 L 96 196 C 98 196 99 194 100 192 C 101 194 102 196 104 196 L 126 196 L 124 172 Z"
              fill={bottom.base}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            <path
              d="M 100 192 C 101 194 102 196 104 196 L 126 196 L 125 174 C 121 178 115 182 109 183 L 100 192 Z"
              fill={bottom.shadow}
              opacity="0.65"
            />
            {/* Jeans fly stitch + brass button */}
            <path
              d="M 100 175 L 100 189"
              fill="none"
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
              strokeLinecap="round"
            />
            <circle
              cx="100"
              cy="177.5"
              r="1.6"
              fill="#FBBF24"
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth="0.9"
            />
            {/* Curved jeans pocket stitches */}
            <path
              d="M 76 178 C 81 182 86 183 89 179"
              fill="none"
              stroke={bottom.highlight}
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <path
              d="M 124 178 C 119 182 114 183 111 179"
              fill="none"
              stroke={bottom.highlight}
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </g>
        );

      case 'cozy-joggers':
        return (
          <g className="bottoms-cozy-joggers">
            <path
              d="M 76 172 L 74.5 196.5 L 95.5 196.5 C 97.5 196.5 99 194.5 100 192.5 C 101 194.5 102.5 196.5 104.5 196.5 L 125.5 196.5 L 124 172 Z"
              fill={bottom.base}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            <path
              d="M 100 192.5 C 101 194.5 102.5 196.5 104.5 196.5 L 125.5 196.5 L 124.5 174 C 120 178 115 182 109 183 L 100 192.5 Z"
              fill={bottom.shadow}
              opacity="0.55"
            />
            {/* Drawstring waist ties */}
            <path
              d="M 97.5 175.5 L 96.5 183 M 102.5 175.5 L 103.5 183"
              fill="none"
              stroke="#F8FAFC"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M 100 186 L 100 192.5"
              fill="none"
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
              strokeLinecap="round"
            />
          </g>
        );

      case 'classic-shorts':
      default:
        return (
          <g className="bottoms-classic-shorts">
            <path
              d="M 76 172 L 74 195 C 74 198 77 199 82 199 L 96 199 C 98 199 99 197 100 194 C 101 197 102 199 104 199 L 118 199 C 123 199 126 198 126 195 L 124 172 Z"
              fill={bottom.base}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            <path
              d="M 100 194 C 101 197 102 199 104 199 L 118 199 C 123 199 126 198 126 195 L 125 174 C 122 178 116 182 110 183 L 100 194 Z"
              fill={bottom.shadow}
            />
            <path
              d="M 100 186 L 100 194"
              fill="none"
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
              strokeLinecap="round"
            />
            <path
              d="M 77 178 C 82 181 85 186 86 191"
              fill="none"
              stroke={bottom.shadow}
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <path
              d="M 123 178 C 118 181 115 186 114 191"
              fill="none"
              stroke={bottom.shadow}
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </g>
        );
    }
  };

  const renderTop = () => {
    switch (topStyle) {
      case 'solid-tee':
        return (
          <g className="top-solid-tee">
            <path
              d={torsoBounds.bodyPath}
              fill={top.base}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            <path d={torsoBounds.shadowPath} fill={top.shadow} />
            <path
              d="M 77 132 C 82 128 92 126 96 126 L 95 128 C 90 128 82 130 78 134 Z"
              fill={top.highlight}
            />
            <path
              d={torsoBounds.hemPath}
              fill="none"
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M 88 123 C 92 127 108 127 112 123 C 114 125 113 129 108 131 C 103 132.5 97 132.5 92 131 C 87 129 86 125 88 123 Z"
              fill={top.collar}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
              strokeLinejoin="round"
            />
          </g>
        );

      case 'classic-hoodie':
        return (
          <g className="top-classic-hoodie">
            <path
              d={torsoBounds.bodyPath}
              fill={top.base}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            <path d={torsoBounds.shadowPath} fill={top.shadow} />
            {/* Ribbed bottom waistband */}
            <path
              d={torsoBounds.ribPath}
              fill={top.collar}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            {/* Cozy hood cowl around neck */}
            <path
              d="M 84 123 C 89 120 111 120 116 123 C 118 128 114 134 106 136 L 100 135 L 94 136 C 86 134 82 128 84 123 Z"
              fill={top.shadow}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
              strokeLinejoin="round"
            />
            {/* Drawstrings */}
            <line
              x1="95"
              y1="134"
              x2="94"
              y2="147"
              stroke={contrastAccent}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <line
              x1="105"
              y1="134"
              x2="106"
              y2="147"
              stroke={contrastAccent}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <circle cx="94" cy="147" r="1.1" fill={contrastAccent} />
            <circle cx="106" cy="147" r="1.1" fill={contrastAccent} />
            {/* Kangaroo front pocket */}
            <path
              d="M 87 154 L 113 154 L 117 167 L 83 167 Z"
              fill={top.shadow}
              opacity="0.45"
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </g>
        );

      case 'varsity-jacket':
        return (
          <g className="top-varsity-jacket">
            <path
              d={torsoBounds.bodyPath}
              fill={top.base}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            <path d={torsoBounds.shadowPath} fill={top.shadow} />
            {/* Striped ribbed hem & collar */}
            <path
              d={torsoBounds.ribPath}
              fill="#0F172A"
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            <path
              d="M 79 170.5 Q 100 174 121 170.5"
              fill="none"
              stroke="#F8FAFC"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M 87 123 C 92 128 108 128 113 123 C 115 126 113 130 107 132 C 102 133 98 133 93 132 C 87 130 85 126 87 123 Z"
              fill="#0F172A"
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
              strokeLinejoin="round"
            />
            {/* Center snap placket */}
            <line
              x1="100"
              y1="132"
              x2="100"
              y2="169"
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth="1.4"
            />
            {[138, 147, 156, 165].map((cy) => (
              <circle
                key={cy}
                cx="100"
                cy={cy}
                r="1.7"
                fill={contrastAccent}
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth="0.9"
              />
            ))}
            {/* Pocket welts & W badge */}
            <line
              x1="80"
              y1="158"
              x2="86"
              y2="164"
              stroke={contrastAccent}
              strokeWidth="2.0"
              strokeLinecap="round"
            />
            <line
              x1="120"
              y1="158"
              x2="114"
              y2="164"
              stroke={contrastAccent}
              strokeWidth="2.0"
              strokeLinecap="round"
            />
            <rect
              x="106"
              y="137"
              width="9"
              height="9"
              rx="2"
              fill={contrastAccent}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth="1.1"
            />
          </g>
        );

      case 'collared-polo':
        return (
          <g className="top-collared-polo">
            <path
              d={torsoBounds.bodyPath}
              fill={top.base}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            <path d={torsoBounds.shadowPath} fill={top.shadow} />
            <path
              d={torsoBounds.hemPath}
              fill="none"
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {/* Center button placket */}
            <rect
              x="97"
              y="128"
              width="6"
              height="16"
              rx="2"
              fill={top.highlight}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth="1.1"
            />
            <circle cx="100" cy="134" r="1.2" fill={contrastAccent} />
            <circle cx="100" cy="140" r="1.2" fill={contrastAccent} />
            {/* Left & Right Polo Collar Lapels */}
            <path
              d="M 86 123 L 94 123 L 100 130 L 90 134 Z"
              fill={contrastAccent}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            <path
              d="M 114 123 L 106 123 L 100 130 L 110 134 Z"
              fill={contrastAccent}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </g>
        );

      case 'striped-sweater':
        return (
          <g className="top-striped-sweater">
            <path
              d={torsoBounds.bodyPath}
              fill={top.base}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            {/* Chest crisp horizontal stripes */}
            <path
              d="M 74.5 141 Q 100 144 125.5 141 L 125 147 Q 100 150 75 147 Z"
              fill={contrastAccent}
              opacity={isLightTop ? 0.85 : 0.92}
            />
            <path
              d="M 75 154 Q 100 157 125 154 L 125 159.5 Q 100 162.5 75 159.5 Z"
              fill={contrastAccent}
              opacity={isLightTop ? 0.85 : 0.92}
            />
            {/* Re-stroke outer torso contour so stripes stay cleanly inside border */}
            <path
              d={torsoBounds.bodyPath}
              fill="none"
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            <path d={torsoBounds.shadowPath} fill={top.shadow} opacity="0.35" />
            <path
              d={torsoBounds.ribPath}
              fill={top.collar}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            <path
              d="M 88 123 C 92 127 108 127 112 123 C 114 125 113 129 108 131 C 103 132.5 97 132.5 92 131 C 87 129 86 125 88 123 Z"
              fill={top.collar}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
              strokeLinejoin="round"
            />
          </g>
        );

      case 'bolt-tee':
      default:
        return (
          <g className="top-bolt-tee">
            <path
              d={torsoBounds.bodyPath}
              fill={top.base}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
              strokeLinejoin="round"
            />
            <path d={torsoBounds.shadowPath} fill={top.shadow} />
            <path
              d="M 77 132 C 82 128 92 126 96 126 L 95 128 C 90 128 82 130 78 134 Z"
              fill={top.highlight}
            />
            <path
              d={torsoBounds.hemPath}
              fill="none"
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M 88 123 C 92 127 108 127 112 123 C 114 125 113 129 108 131 C 103 132.5 97 132.5 92 131 C 87 129 86 125 88 123 Z"
              fill={top.collar}
              stroke={ARTWORK_PALETTE.strokeDark}
              strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
              strokeLinejoin="round"
            />
            {/* Stylized Lightning Bolt Emblem */}
            <g className="shirt-emblem" pointerEvents="none">
              <polygon
                points="95,142 101,142 98,148 104,148 97,159 99,151 94,151"
                fill={ARTWORK_PALETTE.emblemWhite}
                stroke={ARTWORK_PALETTE.strokeDark}
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <polygon
                points="96,143 100,143 97.5,148.5 103,148.5 97.5,157 99,151.5 94.5,151.5"
                fill={ARTWORK_PALETTE.emblemYellow}
              />
            </g>
          </g>
        );
    }
  };

  return (
    <g className={`character-artwork-body ${className}`}>
      {renderBottoms()}
      {renderTop()}
    </g>
  );
};

