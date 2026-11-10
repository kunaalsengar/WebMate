import type { CharacterLayerId } from '@webmate/shared';
import {
  APPAREL_COLOR_PALETTES,
  BLUSH_COLOR_PALETTES,
  BOTTOM_COLOR_PALETTES,
  EYEBROW_COLOR_OPTIONS,
  EYE_COLOR_PALETTES,
  FX_COLOR_OPTIONS,
  HAIR_COLOR_PALETTES,
  SHOE_COLOR_PALETTES,
  SKIN_TONE_PALETTES,
  resolveEyebrowHex,
  type SwatchOption,
} from './palettes';
import {
  CUSTOMIZATION_CATEGORY_GROUPS,
  type ApparelColorId,
  type ArmSleeveStyleId,
  type AvatarCustomizationConfig,
  type AvatarCustomizationPartial,
  type BlushColorId,
  type BlushStyleId,
  type BodyStyleId,
  type BottomColorId,
  type BottomStyleId,
  type CustomizationCategoryGroupId,
  type CustomizationSectionId,
  type EyebrowColorId,
  type EyebrowStyleId,
  type EyeColorId,
  type EyeStyleId,
  type FxColorId,
  type FxStyleId,
  type HairColorId,
  type HairStyleId,
  type HandStyleId,
  type HeadStyleId,
  type LimbEditTarget,
  type MouthStyleId,
  type ShadowStyleId,
  type ShoeColorId,
  type ShoeStyleId,
  type SkinToneId,
  type TopStyleId,
} from './types';

export interface StyleOptionItem<Id extends string> {
  id: Id;
  label: string;
  badge?: string;
}

/**
 * Default configuration matching the original canonical 12-layer WebMate mascot artwork 1:1.
 */
export const DEFAULT_AVATAR_CUSTOMIZATION: Readonly<AvatarCustomizationConfig> = {
  headStyle: 'classic-chibi',
  skinTone: 'warm-peach',
  hairStyle: 'messy-swept',
  hairColor: 'charcoal-ink',
  eyeStyle: 'classic-anime',
  eyeColor: 'midnight-ink',
  eyebrowStyle: 'thick-cartoon',
  eyebrowColor: 'auto',
  mouthStyle: 'classic-smirk',
  blushStyle: 'anime-stripes',
  blushColor: 'coral-pink',
  bodyStyle: 'classic',
  topStyle: 'bolt-tee',
  topColor: 'poppy-orange',
  bottomStyle: 'classic-shorts',
  bottomColor: 'mustard-amber',
  armLeftStyle: 'match-outfit',
  armRightStyle: 'match-outfit',
  handLeftStyle: 'classic',
  handRightStyle: 'classic',
  shoeLeftStyle: 'sport-sneaker',
  shoeLeftColor: 'speed-cyan',
  shoeRightStyle: 'sport-sneaker',
  shoeRightColor: 'speed-cyan',
  shadowStyle: 'classic-dual',
  fxStyle: 'classic-anime',
  fxColor: 'auto',
};

export const HEAD_STYLE_OPTIONS: readonly StyleOptionItem<HeadStyleId>[] = [
  { id: 'classic-chibi', label: 'Classic Chibi', badge: 'Original' },
  { id: 'soft-oval', label: 'Soft Oval' },
  { id: 'sporty-sharp', label: 'Defined Jaw' },
  { id: 'classic-glasses', label: 'Geek Frames' },
  { id: 'sport-headband', label: 'Sweatband' },
];

export const HAIR_STYLE_OPTIONS: readonly StyleOptionItem<HairStyleId>[] = [
  { id: 'messy-swept', label: 'Side-Swept', badge: 'Original' },
  { id: 'clean-crop', label: 'Clean Crop' },
  { id: 'fluffy-curls', label: 'Fluffy Curls' },
  { id: 'side-part', label: 'Neat Part' },
  { id: 'spiky-energy', label: 'Spiky Tuft' },
  { id: 'layered-bob', label: 'Shaggy Bob' },
  { id: 'snap-cap', label: 'Snapback Cap' },
];

export const EYE_STYLE_OPTIONS: readonly StyleOptionItem<EyeStyleId>[] = [
  { id: 'classic-anime', label: 'Classic Shine', badge: 'Original' },
  { id: 'almond-cool', label: 'Cool Almond' },
  { id: 'starry-bright', label: 'Starry Bright' },
  { id: 'sleepy-chill', label: 'Chill Half-Lid' },
  { id: 'dot-minimal', label: 'Minimal Ink' },
];

export const EYEBROW_STYLE_OPTIONS: readonly StyleOptionItem<EyebrowStyleId>[] = [
  { id: 'thick-cartoon', label: 'Bold Classic', badge: 'Original' },
  { id: 'sleek-arched', label: 'Sleek Taper' },
  { id: 'bushy-energetic', label: 'Bushy Tuft' },
  { id: 'short-minimal', label: 'Short Clean' },
];

export const MOUTH_STYLE_OPTIONS: readonly StyleOptionItem<MouthStyleId>[] = [
  { id: 'classic-smirk', label: 'Playful Smirk', badge: 'Original' },
  { id: 'cheerful-smile', label: 'Warm Smile' },
  { id: 'cat-whisker', label: 'Cute :3 Grin' },
  { id: 'cool-grin', label: 'Tooth Grin' },
];

export const BLUSH_STYLE_OPTIONS: readonly StyleOptionItem<BlushStyleId>[] = [
  { id: 'anime-stripes', label: 'Anime Stripes', badge: 'Original' },
  { id: 'soft-rosy', label: 'Soft Glow' },
  { id: 'cute-freckles', label: 'Freckles' },
  { id: 'star-stamp', label: 'Cheek Stars' },
  { id: 'none', label: 'No Blush' },
];

export const BODY_STYLE_OPTIONS: readonly StyleOptionItem<BodyStyleId>[] = [
  { id: 'classic', label: 'Classic Chibi', badge: 'Original' },
  { id: 'athletic', label: 'Athletic V' },
  { id: 'cozy-chibi', label: 'Relaxed Fit' },
];

export const TOP_STYLE_OPTIONS: readonly StyleOptionItem<TopStyleId>[] = [
  { id: 'bolt-tee', label: 'Bolt Graphic Tee', badge: 'Original' },
  { id: 'solid-tee', label: 'Crewneck Tee' },
  { id: 'classic-hoodie', label: 'Cozy Hoodie' },
  { id: 'varsity-jacket', label: 'Varsity Jacket' },
  { id: 'collared-polo', label: 'Collared Polo' },
  { id: 'striped-sweater', label: 'Striped Crew' },
];

export const BOTTOM_STYLE_OPTIONS: readonly StyleOptionItem<BottomStyleId>[] = [
  { id: 'classic-shorts', label: 'Casual Shorts', badge: 'Original' },
  { id: 'athletic-shorts', label: 'Track Shorts' },
  { id: 'denim-jeans', label: 'Denim Jeans' },
  { id: 'cozy-joggers', label: 'Cuffed Joggers' },
];

export const ARM_SLEEVE_OPTIONS: readonly StyleOptionItem<ArmSleeveStyleId>[] = [
  { id: 'match-outfit', label: 'Match Top', badge: 'Original' },
  { id: 'short-sleeve', label: 'Short Cuff' },
  { id: 'long-sleeve', label: 'Long Sleeve' },
  { id: 'sport-band', label: 'Sport Band' },
  { id: 'cozy-glove', label: 'Street Glove' },
];

export const HAND_STYLE_OPTIONS: readonly StyleOptionItem<HandStyleId>[] = [
  { id: 'classic', label: 'Relaxed Fist', badge: 'Original' },
  { id: 'open-palm', label: 'Open Wave' },
  { id: 'peace-gesture', label: 'Peace Sign' },
];

export const SHOE_STYLE_OPTIONS: readonly StyleOptionItem<ShoeStyleId>[] = [
  { id: 'sport-sneaker', label: 'Sport Sneaker', badge: 'Original' },
  { id: 'high-top', label: 'High-Top' },
  { id: 'slip-on', label: 'Canvas Slip-On' },
  { id: 'running-shoe', label: 'Aero Runner' },
];

export const SHADOW_STYLE_OPTIONS: readonly StyleOptionItem<ShadowStyleId>[] = [
  { id: 'classic-dual', label: 'Dual Contact', badge: 'Original' },
  { id: 'clean-oval', label: 'Soft Oval' },
  { id: 'glow-ring', label: 'Ambient Ring' },
  { id: 'none', label: 'No Shadow' },
];

export const FX_STYLE_OPTIONS: readonly StyleOptionItem<FxStyleId>[] = [
  { id: 'classic-anime', label: 'Anime Expressive', badge: 'Original' },
  { id: 'minimal-clean', label: 'Soft Minimal' },
  { id: 'comic-pop', label: 'Comic Bold' },
  { id: 'none', label: 'No FX' },
];

export const SKIN_TONE_SWATCHES: readonly SwatchOption<SkinToneId>[] = Object.values(
  SKIN_TONE_PALETTES
).map((item) => ({
  id: item.id,
  label: item.label,
  swatchHex: item.base,
}));

export const HAIR_COLOR_SWATCHES: readonly SwatchOption<HairColorId>[] = Object.values(
  HAIR_COLOR_PALETTES
).map((item) => ({
  id: item.id,
  label: item.label,
  swatchHex: item.base,
}));

export const EYE_COLOR_SWATCHES: readonly SwatchOption<EyeColorId>[] = Object.values(
  EYE_COLOR_PALETTES
).map((item) => ({
  id: item.id,
  label: item.label,
  swatchHex: item.irisRim,
}));

export const EYEBROW_COLOR_SWATCHES: readonly SwatchOption<EyebrowColorId>[] =
  EYEBROW_COLOR_OPTIONS;

export const BLUSH_COLOR_SWATCHES: readonly SwatchOption<BlushColorId>[] = Object.values(
  BLUSH_COLOR_PALETTES
).map((item) => ({
  id: item.id,
  label: item.label,
  swatchHex: item.base,
}));

export const APPAREL_COLOR_SWATCHES: readonly SwatchOption<ApparelColorId>[] = Object.values(
  APPAREL_COLOR_PALETTES
).map((item) => ({
  id: item.id,
  label: item.label,
  swatchHex: item.base,
}));

export const BOTTOM_COLOR_SWATCHES: readonly SwatchOption<BottomColorId>[] = Object.values(
  BOTTOM_COLOR_PALETTES
).map((item) => ({
  id: item.id,
  label: item.label,
  swatchHex: item.base,
}));

export const SHOE_COLOR_SWATCHES: readonly SwatchOption<ShoeColorId>[] = Object.values(
  SHOE_COLOR_PALETTES
).map((item) => ({
  id: item.id,
  label: item.label,
  swatchHex: item.primary,
}));

export const FX_COLOR_SWATCHES: readonly SwatchOption<FxColorId>[] = FX_COLOR_OPTIONS.map(
  (item) => ({
    id: item.id,
    label: item.label,
    swatchHex: item.swatchHex,
    isAuto: item.isAuto,
  })
);

export const AVATAR_CONFIG_KEYS = Object.keys(
  DEFAULT_AVATAR_CUSTOMIZATION
) as readonly (keyof AvatarCustomizationConfig)[];

const VALID_FIELD_SETS: { [K in keyof AvatarCustomizationConfig]: ReadonlySet<string> } = {
  headStyle: new Set(HEAD_STYLE_OPTIONS.map((o) => o.id)),
  skinTone: new Set(Object.keys(SKIN_TONE_PALETTES)),
  hairStyle: new Set(HAIR_STYLE_OPTIONS.map((o) => o.id)),
  hairColor: new Set(Object.keys(HAIR_COLOR_PALETTES)),
  eyeStyle: new Set(EYE_STYLE_OPTIONS.map((o) => o.id)),
  eyeColor: new Set(Object.keys(EYE_COLOR_PALETTES)),
  eyebrowStyle: new Set(EYEBROW_STYLE_OPTIONS.map((o) => o.id)),
  eyebrowColor: new Set(EYEBROW_COLOR_OPTIONS.map((o) => o.id)),
  mouthStyle: new Set(MOUTH_STYLE_OPTIONS.map((o) => o.id)),
  blushStyle: new Set(BLUSH_STYLE_OPTIONS.map((o) => o.id)),
  blushColor: new Set(Object.keys(BLUSH_COLOR_PALETTES)),
  bodyStyle: new Set(BODY_STYLE_OPTIONS.map((o) => o.id)),
  topStyle: new Set(TOP_STYLE_OPTIONS.map((o) => o.id)),
  topColor: new Set(Object.keys(APPAREL_COLOR_PALETTES)),
  bottomStyle: new Set(BOTTOM_STYLE_OPTIONS.map((o) => o.id)),
  bottomColor: new Set(Object.keys(BOTTOM_COLOR_PALETTES)),
  armLeftStyle: new Set(ARM_SLEEVE_OPTIONS.map((o) => o.id)),
  armRightStyle: new Set(ARM_SLEEVE_OPTIONS.map((o) => o.id)),
  handLeftStyle: new Set(HAND_STYLE_OPTIONS.map((o) => o.id)),
  handRightStyle: new Set(HAND_STYLE_OPTIONS.map((o) => o.id)),
  shoeLeftStyle: new Set(SHOE_STYLE_OPTIONS.map((o) => o.id)),
  shoeLeftColor: new Set(Object.keys(SHOE_COLOR_PALETTES)),
  shoeRightStyle: new Set(SHOE_STYLE_OPTIONS.map((o) => o.id)),
  shoeRightColor: new Set(Object.keys(SHOE_COLOR_PALETTES)),
  shadowStyle: new Set(SHADOW_STYLE_OPTIONS.map((o) => o.id)),
  fxStyle: new Set(FX_STYLE_OPTIONS.map((o) => o.id)),
  fxColor: new Set(FX_COLOR_OPTIONS.map((o) => o.id)),
};

export function isValidAvatarConfigKey(key: string): key is keyof AvatarCustomizationConfig {
  return Object.prototype.hasOwnProperty.call(VALID_FIELD_SETS, key);
}

export function isValidCustomizationField<K extends keyof AvatarCustomizationConfig>(
  key: K,
  value: unknown
): value is AvatarCustomizationConfig[K] {
  return typeof value === 'string' && VALID_FIELD_SETS[key].has(value);
}

/**
 * Merges a partial selection record onto DEFAULT_AVATAR_CUSTOMIZATION, ignoring invalid values.
 */
export function normalizeAvatarCustomization(
  partial?: AvatarCustomizationPartial | null
): AvatarCustomizationConfig {
  const result: AvatarCustomizationConfig = { ...DEFAULT_AVATAR_CUSTOMIZATION };
  if (!partial || typeof partial !== 'object') {
    return result;
  }

  for (const key of AVATAR_CONFIG_KEYS) {
    const candidate = partial[key];
    if (isValidCustomizationField(key, candidate)) {
      (result as Record<keyof AvatarCustomizationConfig, string>)[key] = candidate;
    }
  }

  return result;
}

/**
 * Extracts only keys differing from DEFAULT_AVATAR_CUSTOMIZATION so storage stays compact.
 */
export function extractCustomizationOverrides(
  config: AvatarCustomizationConfig
): AvatarCustomizationPartial {
  const sparse: AvatarCustomizationPartial = {};
  for (const key of AVATAR_CONFIG_KEYS) {
    if (config[key] !== DEFAULT_AVATAR_CUSTOMIZATION[key]) {
      (sparse as Record<keyof AvatarCustomizationConfig, string>)[key] = config[key];
    }
  }
  return sparse;
}

export function areAvatarCustomizationsEqual(
  a: AvatarCustomizationConfig | null | undefined,
  b: AvatarCustomizationConfig | null | undefined
): boolean {
  const resolvedA = a ?? DEFAULT_AVATAR_CUSTOMIZATION;
  const resolvedB = b ?? DEFAULT_AVATAR_CUSTOMIZATION;

  for (const key of AVATAR_CONFIG_KEYS) {
    if (resolvedA[key] !== resolvedB[key]) {
      return false;
    }
  }
  return true;
}

const SECTION_OWNED_KEYS: Record<
  CustomizationSectionId,
  readonly (keyof AvatarCustomizationConfig)[]
> = {
  'head-face': ['headStyle', 'skinTone'],
  hair: ['hairStyle', 'hairColor'],
  eyes: ['eyeStyle', 'eyeColor'],
  eyebrows: ['eyebrowStyle', 'eyebrowColor'],
  mouth: ['mouthStyle'],
  blush: ['blushStyle', 'blushColor'],
  body: ['bodyStyle'],
  'clothing-top': ['topStyle', 'topColor'],
  'clothing-bottom': ['bottomStyle', 'bottomColor'],
  arms: ['armLeftStyle', 'armRightStyle', 'handLeftStyle', 'handRightStyle'],
  shoes: ['shoeLeftStyle', 'shoeLeftColor', 'shoeRightStyle', 'shoeRightColor'],
  shadow: ['shadowStyle'],
  fx: ['fxStyle', 'fxColor'],
};

export function isSectionCustomized(
  config: AvatarCustomizationConfig,
  sectionId: CustomizationSectionId
): boolean {
  return SECTION_OWNED_KEYS[sectionId].some(
    (key) => config[key] !== DEFAULT_AVATAR_CUSTOMIZATION[key]
  );
}

export function isSectionDirty(
  draftConfig: AvatarCustomizationConfig,
  savedConfig: AvatarCustomizationConfig,
  sectionId: CustomizationSectionId
): boolean {
  return SECTION_OWNED_KEYS[sectionId].some(
    (key) => draftConfig[key] !== savedConfig[key]
  );
}

export function isCategoryGroupCustomized(
  config: AvatarCustomizationConfig,
  groupId: CustomizationCategoryGroupId
): boolean {
  const group = CUSTOMIZATION_CATEGORY_GROUPS.find((item) => item.id === groupId);
  return group ? group.sectionIds.some((sectionId) => isSectionCustomized(config, sectionId)) : false;
}

export function resetSectionInConfig(
  config: AvatarCustomizationConfig,
  sectionId: CustomizationSectionId,
  limbTarget: LimbEditTarget = 'both'
): AvatarCustomizationConfig {
  const next: AvatarCustomizationConfig = { ...config };

  if (sectionId === 'arms' && limbTarget !== 'both') {
    if (limbTarget === 'left') {
      next.armLeftStyle = DEFAULT_AVATAR_CUSTOMIZATION.armLeftStyle;
      next.handLeftStyle = DEFAULT_AVATAR_CUSTOMIZATION.handLeftStyle;
    } else {
      next.armRightStyle = DEFAULT_AVATAR_CUSTOMIZATION.armRightStyle;
      next.handRightStyle = DEFAULT_AVATAR_CUSTOMIZATION.handRightStyle;
    }
    return next;
  }

  if (sectionId === 'shoes' && limbTarget !== 'both') {
    if (limbTarget === 'left') {
      next.shoeLeftStyle = DEFAULT_AVATAR_CUSTOMIZATION.shoeLeftStyle;
      next.shoeLeftColor = DEFAULT_AVATAR_CUSTOMIZATION.shoeLeftColor;
    } else {
      next.shoeRightStyle = DEFAULT_AVATAR_CUSTOMIZATION.shoeRightStyle;
      next.shoeRightColor = DEFAULT_AVATAR_CUSTOMIZATION.shoeRightColor;
    }
    return next;
  }

  for (const key of SECTION_OWNED_KEYS[sectionId]) {
    (next as Record<keyof AvatarCustomizationConfig, string>)[key] =
      DEFAULT_AVATAR_CUSTOMIZATION[key];
  }
  return next;
}

/**
 * Returns the exact set of canonical rig layers whose rendered output differs from the
 * original 12-layer artwork registry for the provided configuration.
 */
export function getCustomizedCanonicalLayerIds(
  config: AvatarCustomizationConfig
): CharacterLayerId[] {
  const customized: CharacterLayerId[] = [];
  const d = DEFAULT_AVATAR_CUSTOMIZATION;

  const skinChanged = config.skinTone !== d.skinTone;
  const topChanged = config.topStyle !== d.topStyle || config.topColor !== d.topColor;
  const bottomChanged =
    config.bottomStyle !== d.bottomStyle || config.bottomColor !== d.bottomColor;

  if (config.shadowStyle !== d.shadowStyle) {
    customized.push('layer-shadow');
  }
  if (
    skinChanged ||
    bottomChanged ||
    config.shoeLeftStyle !== d.shoeLeftStyle ||
    config.shoeLeftColor !== d.shoeLeftColor
  ) {
    customized.push('layer-leg-left');
  }
  if (
    skinChanged ||
    config.armLeftStyle !== d.armLeftStyle ||
    config.handLeftStyle !== d.handLeftStyle ||
    (config.armLeftStyle === 'match-outfit' && topChanged)
  ) {
    customized.push('layer-arm-left');
  }
  if (
    skinChanged ||
    bottomChanged ||
    config.shoeRightStyle !== d.shoeRightStyle ||
    config.shoeRightColor !== d.shoeRightColor
  ) {
    customized.push('layer-leg-right');
  }
  if (config.bodyStyle !== d.bodyStyle || topChanged || bottomChanged) {
    customized.push('layer-body');
  }
  if (
    skinChanged ||
    config.armRightStyle !== d.armRightStyle ||
    config.handRightStyle !== d.handRightStyle ||
    (config.armRightStyle === 'match-outfit' && topChanged)
  ) {
    customized.push('layer-arm-right');
  }
  if (
    config.headStyle !== d.headStyle ||
    skinChanged ||
    config.hairStyle !== d.hairStyle ||
    config.hairColor !== d.hairColor
  ) {
    customized.push('layer-head');
  }
  if (config.blushStyle !== d.blushStyle || config.blushColor !== d.blushColor) {
    customized.push('layer-blush');
  }
  if (
    config.eyebrowStyle !== d.eyebrowStyle ||
    resolveEyebrowHex(config.eyebrowColor, config.hairColor) !==
      resolveEyebrowHex(d.eyebrowColor, d.hairColor)
  ) {
    customized.push('layer-eyebrows');
  }
  if (config.eyeStyle !== d.eyeStyle || config.eyeColor !== d.eyeColor) {
    customized.push('layer-eyes');
  }
  if (config.mouthStyle !== d.mouthStyle) {
    customized.push('layer-mouth');
  }
  if (config.fxStyle !== d.fxStyle || config.fxColor !== d.fxColor) {
    customized.push('layer-fx');
  }

  return customized;
}

