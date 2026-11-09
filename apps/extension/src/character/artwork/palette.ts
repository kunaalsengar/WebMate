/**
 * WebMate Original Mascot — Artwork Palette & Styling Constants
 *
 * Defines unified color tokens, stroke treatments, and shading constants for the
 * original 2D boy mascot across all 12 articulated SVG layers.
 */

export const ARTWORK_PALETTE = {
  // Outlines & Line Art
  strokeDark: '#0F172A',      // Primary crisp cartoon ink outline
  strokeMedium: '#1E293B',    // Secondary internal feature lines
  strokeMuted: '#475569',     // Subtle fold/crease lines
  strokeWidthBase: 2.0,       // Standard character outline stroke width
  strokeWidthFine: 1.4,       // Secondary detail stroke width
  strokeWidthHeavy: 2.4,      // Outer silhouette emphasis

  // Skin Tones (Warm Anime Peach)
  skinBase: '#FDE2B8',        // Natural radiant warm peach skin
  skinShadow: '#F6CA94',      // Soft anatomical shadow (under chin, inner ear)
  skinHighlight: '#FFF3E0',   // Subtle nose/forehead light bounce

  // Hair (Unique Dark Messy Side-Swept)
  hairBase: '#0F172A',        // Deep rich charcoal-black base
  hairShine: '#334155',       // Stylized specular sheen highlight
  hairShadow: '#020617',      // Deep inner hair shadow

  // Eyes & Eyebrows
  scleraWhite: '#FFFFFF',     // Clean eye white
  scleraShadow: '#E2E8F0',    // Upper eyelid sclera drop shadow
  pupilDark: '#0F172A',       // Deep pupil center
  irisNavy: '#1E293B',        // Deep iris rim
  eyeCatchlight: '#FFFFFF',   // Bright reflection dots
  eyebrowColor: '#0F172A',    // Thick expressive eyebrow color

  // Cheeks & Blush
  blushPink: '#FB7185',       // Warm coral-rose cheek glow
  blushHighlight: '#FDA4AF',  // Subtle cheek sparkle

  // Apparel — Red-Orange Top
  shirtBase: '#FF5722',       // Vibrant energetic poppy red-orange
  shirtShadow: '#E64A19',     // Torso side and underarm shadow
  shirtHighlight: '#FF7043',  // Shoulder and chest fold highlight
  collarBase: '#F4511E',      // Crew neck ribbing
  emblemYellow: '#FEF08A',    // Chest lightning/W emblem yellow
  emblemWhite: '#FFFFFF',     // Chest emblem white

  // Apparel — Mustard Yellow Shorts
  shortsBase: '#F59E0B',      // Rich warm mustard yellow
  shortsShadow: '#D97706',    // Pocket and inseam fold shadow
  shortsHighlight: '#FBBF24', // Outer thigh light bounce

  // Footwear & Socks
  sockWhite: '#F8FAFC',       // Clean white athletic sock
  sockShadow: '#E2E8F0',      // Ankle fold shadow
  sneakerTeal: '#06B6D4',     // Energetic cyan/teal sneaker upper
  sneakerTealDark: '#0891B2', // Sneaker heel/sole shadow
  sneakerWhite: '#F8FAFC',    // Rubber toe cap and sole wall
  sneakerTread: '#0F172A',    // Sneaker bottom grip tread
  sneakerLace: '#FFFFFF',     // Elastic lace accents

  // Mouth & Tongue
  mouthCavity: '#991B1B',     // Deep mouth cavity (maroon/crimson)
  tonguePink: '#F43F5E',      // Cute pink tongue
  teethWhite: '#FFFFFF',      // Upper teeth band

  // Emotional FX
  fxSparkle: '#FBBF24',       // Happy star burst gold
  fxSweat: '#38BDF8',         // Surprised/confused sweat drop cyan
  fxQuestion: '#818CF8',      // Thinking question mark indigo
  fxZzz: '#A855F7',           // Sleeping particle purple
  fxBubble: 'rgba(56, 189, 248, 0.45)', // Translucent snot bubble
  fxBubbleSheen: '#E0F2FE',   // Snot bubble highlight arc

  // Ground Contact Shadow
  shadowCore: 'rgba(15, 23, 42, 0.28)',
  shadowSoft: 'rgba(15, 23, 42, 0.16)',
} as const;
