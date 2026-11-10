import type { CharacterAnchorCoordinates, CharacterLayerId } from '@webmate/shared';
import characterManifest from '../../../assets/character/manifests/character.manifest.json';

/**
 * Built-in head contour & facial accessory variant identifiers (Layer 6: layer-head).
 */
export type HeadStyleId =
  | 'classic-chibi'
  | 'soft-oval'
  | 'sporty-sharp'
  | 'classic-glasses'
  | 'sport-headband';

/**
 * Built-in coordinated skin tone swatch identifiers (head, ears, neck, arms, legs).
 */
export type SkinToneId =
  | 'warm-peach'
  | 'fair-porcelain'
  | 'golden-honey'
  | 'warm-caramel'
  | 'rich-cocoa'
  | 'deep-espresso';

/**
 * Built-in hairstyle variant identifiers (Layer 6: layer-head).
 */
export type HairStyleId =
  | 'messy-swept'
  | 'clean-crop'
  | 'fluffy-curls'
  | 'side-part'
  | 'spiky-energy'
  | 'layered-bob'
  | 'snap-cap';

/**
 * Built-in hair color swatch identifiers.
 */
export type HairColorId =
  | 'charcoal-ink'
  | 'espresso-brown'
  | 'warm-chestnut'
  | 'golden-blonde'
  | 'copper-ginger'
  | 'midnight-blue'
  | 'frost-silver'
  | 'berry-rose';

/**
 * Built-in expression-reactive eye style identifiers (Layer 9: layer-eyes).
 */
export type EyeStyleId =
  | 'classic-anime'
  | 'almond-cool'
  | 'starry-bright'
  | 'sleepy-chill'
  | 'dot-minimal';

/**
 * Built-in eye / iris color swatch identifiers.
 */
export type EyeColorId =
  | 'midnight-ink'
  | 'cobalt-blue'
  | 'emerald-green'
  | 'warm-hazel'
  | 'violet-glow';

/**
 * Built-in expression-reactive eyebrow style identifiers (Layer 8: layer-eyebrows).
 */
export type EyebrowStyleId =
  | 'thick-cartoon'
  | 'sleek-arched'
  | 'bushy-energetic'
  | 'short-minimal';

/**
 * Built-in eyebrow color swatch identifiers ('auto' tracks the active hair color).
 */
export type EyebrowColorId =
  | 'auto'
  | 'charcoal-ink'
  | 'espresso-brown'
  | 'warm-chestnut'
  | 'golden-blonde'
  | 'copper-ginger'
  | 'slate-gray';

/**
 * Built-in expression-reactive mouth style identifiers (Layer 10: layer-mouth).
 */
export type MouthStyleId =
  | 'classic-smirk'
  | 'cheerful-smile'
  | 'cat-whisker'
  | 'cool-grin';

/**
 * Built-in expression-reactive cheek blush style identifiers (Layer 7: layer-blush).
 */
export type BlushStyleId =
  | 'anime-stripes'
  | 'soft-rosy'
  | 'cute-freckles'
  | 'star-stamp'
  | 'none';

/**
 * Built-in blush tint swatch identifiers.
 */
export type BlushColorId =
  | 'coral-pink'
  | 'rose-red'
  | 'warm-apricot'
  | 'soft-lavender';

/**
 * Built-in torso proportion variant identifiers (Layer 4: layer-body).
 */
export type BodyStyleId = 'classic' | 'athletic' | 'cozy-chibi';

/**
 * Built-in shirt & outerwear garment identifiers (Layer 4: layer-body + matching arm sleeves).
 */
export type TopStyleId =
  | 'bolt-tee'
  | 'solid-tee'
  | 'classic-hoodie'
  | 'varsity-jacket'
  | 'collared-polo'
  | 'striped-sweater';

/**
 * Built-in apparel color swatch identifiers for tops and sleeves.
 */
export type ApparelColorId =
  | 'poppy-orange'
  | 'webmate-cobalt'
  | 'navy-slate'
  | 'mint-emerald'
  | 'sunny-gold'
  | 'crimson-red'
  | 'royal-violet'
  | 'cloud-white';

/**
 * Built-in shorts & pants variant identifiers (Layer 4 torso waist + Layers 1 & 3 full pant cuffs).
 */
export type BottomStyleId =
  | 'classic-shorts'
  | 'athletic-shorts'
  | 'denim-jeans'
  | 'cozy-joggers';

/**
 * Built-in bottoms color swatch identifiers.
 */
export type BottomColorId =
  | 'mustard-amber'
  | 'indigo-denim'
  | 'deep-navy'
  | 'charcoal-gray'
  | 'olive-cargo'
  | 'warm-khaki';

/**
 * Built-in sleeve & accessory options for articulated arms (Layer 2 & Layer 5).
 */
export type ArmSleeveStyleId =
  | 'match-outfit'
  | 'short-sleeve'
  | 'long-sleeve'
  | 'sport-band'
  | 'cozy-glove';

/**
 * Built-in articulated hand shape options (Layer 2 & Layer 5).
 */
export type HandStyleId = 'classic' | 'open-palm' | 'peace-gesture';

/**
 * Built-in footwear silhouette variants (Layer 1 & Layer 3).
 */
export type ShoeStyleId =
  | 'sport-sneaker'
  | 'high-top'
  | 'slip-on'
  | 'running-shoe';

/**
 * Built-in footwear primary color swatches.
 */
export type ShoeColorId =
  | 'speed-cyan'
  | 'varsity-red'
  | 'webmate-blue'
  | 'obsidian-black'
  | 'sunny-yellow'
  | 'forest-mint'
  | 'lavender-pop';

/**
 * Built-in ground contact shadow styles (Layer 0: layer-shadow).
 */
export type ShadowStyleId = 'classic-dual' | 'clean-oval' | 'glow-ring' | 'none';

/**
 * Built-in expression-reactive emotional FX styles (Layer 11: layer-fx).
 */
export type FxStyleId = 'classic-anime' | 'minimal-clean' | 'comic-pop' | 'none';

/**
 * Built-in FX tint override options ('auto' uses per-mood canonical colors).
 */
export type FxColorId = 'auto' | 'gold-spark' | 'sky-cyan' | 'rose-pink' | 'violet-aura';

/**
 * Complete resolved configuration selecting built-in WebMate vector options across all 12 rig layers.
 */
export interface AvatarCustomizationConfig {
  headStyle: HeadStyleId;
  skinTone: SkinToneId;
  hairStyle: HairStyleId;
  hairColor: HairColorId;
  eyeStyle: EyeStyleId;
  eyeColor: EyeColorId;
  eyebrowStyle: EyebrowStyleId;
  eyebrowColor: EyebrowColorId;
  mouthStyle: MouthStyleId;
  blushStyle: BlushStyleId;
  blushColor: BlushColorId;
  bodyStyle: BodyStyleId;
  topStyle: TopStyleId;
  topColor: ApparelColorId;
  bottomStyle: BottomStyleId;
  bottomColor: BottomColorId;
  armLeftStyle: ArmSleeveStyleId;
  armRightStyle: ArmSleeveStyleId;
  handLeftStyle: HandStyleId;
  handRightStyle: HandStyleId;
  shoeLeftStyle: ShoeStyleId;
  shoeLeftColor: ShoeColorId;
  shoeRightStyle: ShoeStyleId;
  shoeRightColor: ShoeColorId;
  shadowStyle: ShadowStyleId;
  fxStyle: FxStyleId;
  fxColor: FxColorId;
}

/**
 * Sparse customization override record persisted in chrome.storage.local.
 */
export type AvatarCustomizationPartial = Partial<AvatarCustomizationConfig>;

/**
 * Persisted storage schema v2 for built-in avatar selections (no uploaded SVGs or binary files).
 */
export interface StoredCharacterAssetCustomization {
  version: 2;
  selections: AvatarCustomizationPartial;
  updatedAt: number;
}

/**
 * Target filter when customizing symmetrical limbs together or individually.
 */
export type LimbEditTarget = 'both' | 'left' | 'right';

/**
 * User-facing studio customization categories matching avatar features & rig anatomy.
 */
export type CustomizationCategoryGroupId =
  | 'head-face'
  | 'hair'
  | 'eyes-eyebrows'
  | 'mouth-expression'
  | 'body'
  | 'clothing'
  | 'arms-hands'
  | 'legs-shoes'
  | 'shadow-effects';

/**
 * Selectable customization section IDs in the Avatar Studio sidebar.
 */
export type CustomizationSectionId =
  | 'head-face'
  | 'hair'
  | 'eyes'
  | 'eyebrows'
  | 'mouth'
  | 'blush'
  | 'body'
  | 'clothing-top'
  | 'clothing-bottom'
  | 'arms'
  | 'shoes'
  | 'shadow'
  | 'fx';

/**
 * Metadata describing a selectable studio section and its canonical rig layer mapping.
 */
export interface CustomizationSectionDescriptor {
  id: CustomizationSectionId;
  groupId: CustomizationCategoryGroupId;
  label: string;
  shortLabel: string;
  primaryLayerId: CharacterLayerId;
  affectedLayerIds: readonly CharacterLayerId[];
  slotLabel: string;
  isExpressionReactive: boolean;
  supportsColor: boolean;
  description: string;
  expressionNote?: string;
}

/**
 * Category group descriptor displayed in the Avatar Studio navigation.
 */
export interface CustomizationCategoryGroupDescriptor {
  id: CustomizationCategoryGroupId;
  title: string;
  sectionIds: readonly CustomizationSectionId[];
}

/**
 * Canonical rig layer metadata backed directly by character.manifest.json.
 */
export interface CustomizableLayerDescriptor {
  layerId: CharacterLayerId;
  label: string;
  zIndex: number;
  anchorName: string;
  anchor: CharacterAnchorCoordinates;
  isExpressionReactive: boolean;
  description: string;
}

const LAYER_LABELS: Record<CharacterLayerId, { label: string; isExpressionReactive: boolean }> = {
  'layer-shadow': { label: 'Ground Shadow', isExpressionReactive: false },
  'layer-leg-left': { label: 'Left Leg & Shoe', isExpressionReactive: false },
  'layer-arm-left': { label: 'Left Arm', isExpressionReactive: false },
  'layer-leg-right': { label: 'Right Leg & Shoe', isExpressionReactive: false },
  'layer-body': { label: 'Torso & Outfit', isExpressionReactive: false },
  'layer-arm-right': { label: 'Right Arm', isExpressionReactive: false },
  'layer-head': { label: 'Head & Hair', isExpressionReactive: false },
  'layer-blush': { label: 'Cheek Blush', isExpressionReactive: true },
  'layer-eyebrows': { label: 'Eyebrows', isExpressionReactive: true },
  'layer-eyes': { label: 'Eyes', isExpressionReactive: true },
  'layer-mouth': { label: 'Mouth', isExpressionReactive: true },
  'layer-fx': { label: 'Emotional FX', isExpressionReactive: true },
};

const anchorsRecord = characterManifest.anchors as Record<string, CharacterAnchorCoordinates>;

/**
 * Ordered list of all 12 canonical rig layers from character.manifest.json.
 */
export const CUSTOMIZABLE_LAYER_METADATA: readonly CustomizableLayerDescriptor[] =
  [...characterManifest.layers]
    .sort((a, b) => a.zIndex - b.zIndex)
    .map((layer) => {
      const layerId = layer.id as CharacterLayerId;
      const anchorName = layer.anchor ?? 'head';
      const anchor = anchorsRecord[anchorName] ?? { x: 100, y: 125 };
      const meta = LAYER_LABELS[layerId];

      return {
        layerId,
        label: meta.label,
        zIndex: layer.zIndex,
        anchorName,
        anchor,
        isExpressionReactive: meta.isExpressionReactive,
        description: layer.description ?? '',
      };
    });

export const CANONICAL_CHARACTER_LAYER_IDS: readonly CharacterLayerId[] =
  CUSTOMIZABLE_LAYER_METADATA.map((item) => item.layerId);

/**
 * All 9 Snapchat-style customization categories mapped honestly to built-in WebMate artwork.
 */
export const CUSTOMIZATION_CATEGORY_GROUPS: readonly CustomizationCategoryGroupDescriptor[] = [
  { id: 'head-face', title: 'Head & Face', sectionIds: ['head-face'] },
  { id: 'hair', title: 'Hair', sectionIds: ['hair'] },
  { id: 'eyes-eyebrows', title: 'Eyes & Eyebrows', sectionIds: ['eyes', 'eyebrows'] },
  { id: 'mouth-expression', title: 'Mouth & Expression', sectionIds: ['mouth', 'blush'] },
  { id: 'body', title: 'Body', sectionIds: ['body'] },
  { id: 'clothing', title: 'Clothing', sectionIds: ['clothing-top', 'clothing-bottom'] },
  { id: 'arms-hands', title: 'Arms & Hands', sectionIds: ['arms'] },
  { id: 'legs-shoes', title: 'Legs & Shoes', sectionIds: ['shoes'] },
  { id: 'shadow-effects', title: 'Shadow & Effects', sectionIds: ['shadow', 'fx'] },
];

export const CUSTOMIZATION_SECTIONS: readonly CustomizationSectionDescriptor[] = [
  {
    id: 'head-face',
    groupId: 'head-face',
    label: 'Head Shape & Skin Tone',
    shortLabel: 'Face & Skin',
    primaryLayerId: 'layer-head',
    affectedLayerIds: ['layer-head', 'layer-arm-left', 'layer-arm-right', 'layer-leg-left', 'layer-leg-right'],
    slotLabel: 'layer-head · z40',
    isExpressionReactive: false,
    supportsColor: true,
    description:
      'Choose a built-in head contour, eyewear or headband accent, and coordinated skin tone across face and limbs.',
  },
  {
    id: 'hair',
    groupId: 'hair',
    label: 'Hairstyle & Hair Color',
    shortLabel: 'Hairstyle',
    primaryLayerId: 'layer-head',
    affectedLayerIds: ['layer-head'],
    slotLabel: 'layer-head · z40',
    isExpressionReactive: false,
    supportsColor: true,
    description:
      'Pick a built-in mascot hairstyle and color tint anchored cleanly to the head pivot.',
  },
  {
    id: 'eyes',
    groupId: 'eyes-eyebrows',
    label: 'Eye Shape & Color',
    shortLabel: 'Eyes',
    primaryLayerId: 'layer-eyes',
    affectedLayerIds: ['layer-eyes'],
    slotLabel: 'layer-eyes · z52',
    isExpressionReactive: true,
    supportsColor: true,
    description:
      'Select an expressive eye silhouette and pupil tint with natural GSAP blinking preserved.',
    expressionNote:
      'Adapts automatically across all 8 expressions (normal, happy crescents, thinking, surprised, sleeping, and blinking).',
  },
  {
    id: 'eyebrows',
    groupId: 'eyes-eyebrows',
    label: 'Eyebrow Style',
    shortLabel: 'Eyebrows',
    primaryLayerId: 'layer-eyebrows',
    affectedLayerIds: ['layer-eyebrows'],
    slotLabel: 'layer-eyebrows · z50',
    isExpressionReactive: true,
    supportsColor: true,
    description:
      'Pick bold, sleek, bushy, or compact cartoon eyebrows that articulate with every mood.',
    expressionNote:
      'Dynamically raises, furrows, and arches across all 8 mascot expressions.',
  },
  {
    id: 'mouth',
    groupId: 'mouth-expression',
    label: 'Mouth Style',
    shortLabel: 'Mouth',
    primaryLayerId: 'layer-mouth',
    affectedLayerIds: ['layer-mouth'],
    slotLabel: 'layer-mouth · z55',
    isExpressionReactive: true,
    supportsColor: false,
    description:
      'Switch the resting smile character while keeping expression shapes and speech token pulses active.',
    expressionNote:
      'Keeps dynamic grinning, thinking, surprise O-mouth, and speech pulsing intact across moods.',
  },
  {
    id: 'blush',
    groupId: 'mouth-expression',
    label: 'Cheek Blush Style',
    shortLabel: 'Cheek Blush',
    primaryLayerId: 'layer-blush',
    affectedLayerIds: ['layer-blush'],
    slotLabel: 'layer-blush · z45',
    isExpressionReactive: true,
    supportsColor: true,
    description:
      'Customize cheek blush markings and tint shown during cheerful and sleepy expressions.',
    expressionNote:
      'Cheek blush opacity is controlled by expression state (most visible in Happy and Sleeping moods).',
  },
  {
    id: 'body',
    groupId: 'body',
    label: 'Body Silhouette',
    shortLabel: 'Body Build',
    primaryLayerId: 'layer-body',
    affectedLayerIds: ['layer-body'],
    slotLabel: 'layer-body · z20',
    isExpressionReactive: false,
    supportsColor: false,
    description:
      'Adjust the built-in torso proportion while preserving shoulder, hip, and neck joint alignments.',
  },
  {
    id: 'clothing-top',
    groupId: 'clothing',
    label: 'Tops & Outerwear',
    shortLabel: 'Tops & Jackets',
    primaryLayerId: 'layer-body',
    affectedLayerIds: ['layer-body', 'layer-arm-left', 'layer-arm-right'],
    slotLabel: 'layer-body · z20',
    isExpressionReactive: false,
    supportsColor: true,
    description:
      'Dress your mascot in built-in t-shirts, hoodies, varsity jackets, polo shirts, or striped sweaters.',
  },
  {
    id: 'clothing-bottom',
    groupId: 'clothing',
    label: 'Shorts & Pants',
    shortLabel: 'Bottoms & Pants',
    primaryLayerId: 'layer-body',
    affectedLayerIds: ['layer-body', 'layer-leg-left', 'layer-leg-right'],
    slotLabel: 'layer-body · z20',
    isExpressionReactive: false,
    supportsColor: true,
    description:
      'Switch between casual shorts, athletic side-stripe shorts, denim jeans, and cuffed joggers.',
  },
  {
    id: 'arms',
    groupId: 'arms-hands',
    label: 'Arms, Sleeves & Hands',
    shortLabel: 'Arms & Hands',
    primaryLayerId: 'layer-arm-right',
    affectedLayerIds: ['layer-arm-left', 'layer-arm-right'],
    slotLabel: 'layer-arm-left / right',
    isExpressionReactive: false,
    supportsColor: false,
    description:
      'Choose sleeve lengths, sporty wristbands or gloves, and hand shapes synced or customized per side.',
  },
  {
    id: 'shoes',
    groupId: 'legs-shoes',
    label: 'Shoes & Footwear',
    shortLabel: 'Shoes & Kicks',
    primaryLayerId: 'layer-leg-right',
    affectedLayerIds: ['layer-leg-left', 'layer-leg-right'],
    slotLabel: 'layer-leg-left / right',
    isExpressionReactive: false,
    supportsColor: true,
    description:
      'Pick built-in sneakers, high-tops, slip-ons, or running trainers in custom colorways.',
  },
  {
    id: 'shadow',
    groupId: 'shadow-effects',
    label: 'Ground Shadow Style',
    shortLabel: 'Shadow',
    primaryLayerId: 'layer-shadow',
    affectedLayerIds: ['layer-shadow'],
    slotLabel: 'layer-shadow · z0',
    isExpressionReactive: false,
    supportsColor: false,
    description:
      'Choose how the mascot anchors visually onto the page below its sneakers.',
  },
  {
    id: 'fx',
    groupId: 'shadow-effects',
    label: 'Emotional FX Overlay',
    shortLabel: 'Visual FX',
    primaryLayerId: 'layer-fx',
    affectedLayerIds: ['layer-fx'],
    slotLabel: 'layer-fx · z60',
    isExpressionReactive: true,
    supportsColor: true,
    description:
      'Select the graphic style and color accent for sparkles, question marks, sweat drops, and sleeping Zzzs.',
    expressionNote:
      'Visual FX appear dynamically in Happy, Thinking, Surprised, Confused, and Sleeping moods.',
  },
];

export const CUSTOMIZATION_SECTION_BY_ID: Readonly<
  Record<CustomizationSectionId, CustomizationSectionDescriptor>
> = CUSTOMIZATION_SECTIONS.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<CustomizationSectionId, CustomizationSectionDescriptor>
);
