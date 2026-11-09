import React from 'react';
import { ARTWORK_PALETTE } from './palette';

export interface HeadArtworkProps {
  className?: string;
}

/**
 * Layer 6: Head Contour, Hairstyle & Features Artwork
 *
 * Articulates from neck/head anchor (100, 115).
 * Features:
 * - Rounded anime chibi head contour with soft chubby cheeks.
 * - Cute stylized ears with inner helix detailing.
 * - Unique dark, slightly messy side-swept hairstyle with stylized specular highlights.
 * - Small cute button nose at (99, 96).
 */
export const HeadArtwork: React.FC<HeadArtworkProps> = ({ className = '' }) => {
  return (
    <g className={`character-artwork-head ${className}`}>
      {/* ========================================================
          1. NECK & UNDER-CHIN SHADOW
          ======================================================== */}
      <path
        d="M 94 114 L 93 125 C 93 126 95 127 100 127 C 105 127 107 126 107 125 L 106 114 Z"
        fill={ARTWORK_PALETTE.skinShadow}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
        strokeLinejoin="round"
      />

      {/* ========================================================
          2. EARS (Behind face, layered over neck)
          ======================================================== */}
      {/* Left Ear */}
      <path
        d="M 66 88 C 59 89 58 97 61 101 C 63 103 66 103 68 100 Z"
        fill={ARTWORK_PALETTE.skinBase}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        strokeLinejoin="round"
      />
      {/* Left inner ear helix */}
      <path
        d="M 64 92 C 61.5 94 62 98 64 99"
        fill="none"
        stroke={ARTWORK_PALETTE.skinShadow}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Right Ear */}
      <path
        d="M 134 88 C 141 89 142 97 139 101 C 137 103 134 103 132 100 Z"
        fill={ARTWORK_PALETTE.skinBase}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        strokeLinejoin="round"
      />
      {/* Right inner ear helix */}
      <path
        d="M 136 92 C 138.5 94 138 98 136 99"
        fill="none"
        stroke={ARTWORK_PALETTE.skinShadow}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* ========================================================
          3. HEAD SILHOUETTE & SKIN
          ======================================================== */}
      {/* Back hair volume base */}
      <path
        d="M 62 82 
           C 58 72 62 50 78 42 
           C 88 36 112 36 122 42 
           C 138 50 142 72 138 82 
           Z"
        fill={ARTWORK_PALETTE.hairBase}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        strokeLinejoin="round"
      />

      {/* Face skin base */}
      <path
        d="M 67 78 
           C 66 65 78 52 100 52 
           C 122 52 134 65 133 78 
           C 136 86 137 96 132 104 
           C 126 113 114 119 100 119 
           C 86 119 74 113 68 104 
           C 63 96 64 86 67 78 
           Z"
        fill={ARTWORK_PALETTE.skinBase}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        strokeLinejoin="round"
      />

      {/* Chin soft curvature shadow */}
      <path
        d="M 88 116 C 94 118.5 106 118.5 112 116 C 108 118 104 119 100 119 C 96 119 92 118 88 116 Z"
        fill={ARTWORK_PALETTE.skinShadow}
      />

      {/* ========================================================
          4. NOSE (Cute small button nose)
          ======================================================== */}
      {/* Tiny nose tip shadow dot */}
      <path
        d="M 98 96 C 99 94.5 101 94.5 102 96 C 101.5 97 99 97 98 96 Z"
        fill={ARTWORK_PALETTE.skinShadow}
      />
      {/* Subtle nose highlight stroke */}
      <path
        d="M 99.5 94.5 L 100.5 96"
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* ========================================================
          5. UNIQUE SIDE-SWEPT MESSY DARK HAIRSTYLE
          ======================================================== */}
      {/* Crown spiky tufts (messy character detail) */}
      <path
        d="M 85 41 L 88 34 L 95 38 L 102 33 L 107 38 L 115 36 L 112 43"
        fill={ARTWORK_PALETTE.hairBase}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        strokeLinejoin="round"
      />

      {/* Side-swept front bangs & layered forelocks */}
      <path
        d="M 64 74 
           C 66 65 70 56 80 50 
           C 88 45 102 46 114 49 
           C 126 53 134 60 137 72 
           C 134 70 128 68 124 72 
           C 120 66 113 62 106 63 
           C 98 64 94 70 91 74 
           C 88 66 82 63 76 66 
           C 71 68 67 71 64 74 
           Z"
        fill={ARTWORK_PALETTE.hairBase}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthBase}
        strokeLinejoin="round"
      />

      {/* Right side swept lock layering down to temple */}
      <path
        d="M 124 71 C 127 75 128 80 127 84 C 125 82 124 78 123 75 Z"
        fill={ARTWORK_PALETTE.hairBase}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
        strokeLinejoin="round"
      />

      {/* Left temple sideburn lock */}
      <path
        d="M 67 76 C 65 80 65 84 66 87 C 67 84 68 81 69 79 Z"
        fill={ARTWORK_PALETTE.hairBase}
        stroke={ARTWORK_PALETTE.strokeDark}
        strokeWidth={ARTWORK_PALETTE.strokeWidthFine}
        strokeLinejoin="round"
      />

      {/* Stylized hair specular sheen / highlight arc */}
      <path
        d="M 83 49 C 92 46 104 46 113 49 C 110 50 102 48 94 48 C 88 48 84 49 83 49 Z"
        fill={ARTWORK_PALETTE.hairShine}
      />
      <path
        d="M 74 56 C 78 54 82 54 85 55"
        stroke={ARTWORK_PALETTE.hairShine}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>
  );
};
