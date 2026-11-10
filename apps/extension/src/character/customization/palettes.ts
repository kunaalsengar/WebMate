import { ARTWORK_PALETTE } from '../artwork/palette';
import type {
  ApparelColorId,
  BlushColorId,
  BottomColorId,
  EyebrowColorId,
  EyeColorId,
  FxColorId,
  HairColorId,
  ShoeColorId,
  SkinToneId,
} from './types';

export interface SwatchOption<Id extends string> {
  id: Id;
  label: string;
  swatchHex: string;
  isAuto?: boolean;
}

export interface SkinTonePalette {
  id: SkinToneId;
  label: string;
  base: string;
  shadow: string;
  highlight: string;
}

export const SKIN_TONE_PALETTES: Record<SkinToneId, SkinTonePalette> = {
  'warm-peach': {
    id: 'warm-peach',
    label: 'Warm Peach',
    base: ARTWORK_PALETTE.skinBase,
    shadow: ARTWORK_PALETTE.skinShadow,
    highlight: ARTWORK_PALETTE.skinHighlight,
  },
  'fair-porcelain': {
    id: 'fair-porcelain',
    label: 'Porcelain',
    base: '#FFEADF',
    shadow: '#F5CDB9',
    highlight: '#FFF6F0',
  },
  'golden-honey': {
    id: 'golden-honey',
    label: 'Golden Honey',
    base: '#F3C68F',
    shadow: '#DEA363',
    highlight: '#FDE0BA',
  },
  'warm-caramel': {
    id: 'warm-caramel',
    label: 'Caramel',
    base: '#D99962',
    shadow: '#BA7842',
    highlight: '#EBB688',
  },
  'rich-cocoa': {
    id: 'rich-cocoa',
    label: 'Rich Cocoa',
    base: '#A86B43',
    shadow: '#854E2B',
    highlight: '#C48A62',
  },
  'deep-espresso': {
    id: 'deep-espresso',
    label: 'Espresso',
    base: '#75462C',
    shadow: '#542F1B',
    highlight: '#966143',
  },
};

export interface HairColorPalette {
  id: HairColorId;
  label: string;
  base: string;
  shine: string;
  shadow: string;
}

export const HAIR_COLOR_PALETTES: Record<HairColorId, HairColorPalette> = {
  'charcoal-ink': {
    id: 'charcoal-ink',
    label: 'Charcoal Ink',
    base: ARTWORK_PALETTE.hairBase,
    shine: ARTWORK_PALETTE.hairShine,
    shadow: ARTWORK_PALETTE.hairShadow,
  },
  'espresso-brown': {
    id: 'espresso-brown',
    label: 'Espresso',
    base: '#3E2318',
    shine: '#6B4230',
    shadow: '#24120B',
  },
  'warm-chestnut': {
    id: 'warm-chestnut',
    label: 'Chestnut',
    base: '#7C3F1D',
    shine: '#AA5E35',
    shadow: '#53270F',
  },
  'golden-blonde': {
    id: 'golden-blonde',
    label: 'Golden Blonde',
    base: '#EAB308',
    shine: '#FDE047',
    shadow: '#CA8A04',
  },
  'copper-ginger': {
    id: 'copper-ginger',
    label: 'Copper',
    base: '#D9480F',
    shine: '#FB923C',
    shadow: '#9A3412',
  },
  'midnight-blue': {
    id: 'midnight-blue',
    label: 'Midnight Blue',
    base: '#1E3A8A',
    shine: '#60A5FA',
    shadow: '#172554',
  },
  'frost-silver': {
    id: 'frost-silver',
    label: 'Frost Silver',
    base: '#94A3B8',
    shine: '#E2E8F0',
    shadow: '#64748B',
  },
  'berry-rose': {
    id: 'berry-rose',
    label: 'Berry Rose',
    base: '#BE185D',
    shine: '#F472B6',
    shadow: '#831843',
  },
};

export interface EyeColorPalette {
  id: EyeColorId;
  label: string;
  pupil: string;
  irisRim: string;
}

export const EYE_COLOR_PALETTES: Record<EyeColorId, EyeColorPalette> = {
  'midnight-ink': {
    id: 'midnight-ink',
    label: 'Midnight Ink',
    pupil: ARTWORK_PALETTE.pupilDark,
    irisRim: ARTWORK_PALETTE.irisNavy,
  },
  'cobalt-blue': {
    id: 'cobalt-blue',
    label: 'Cobalt Blue',
    pupil: '#1E3A8A',
    irisRim: '#3B82F6',
  },
  'emerald-green': {
    id: 'emerald-green',
    label: 'Emerald',
    pupil: '#065F46',
    irisRim: '#10B981',
  },
  'warm-hazel': {
    id: 'warm-hazel',
    label: 'Warm Hazel',
    pupil: '#78350F',
    irisRim: '#D97706',
  },
  'violet-glow': {
    id: 'violet-glow',
    label: 'Violet',
    pupil: '#5B21B6',
    irisRim: '#8B5CF6',
  },
};

export const EYEBROW_COLOR_OPTIONS: readonly SwatchOption<EyebrowColorId>[] = [
  { id: 'auto', label: 'Match Hair', swatchHex: '#334155', isAuto: true },
  { id: 'charcoal-ink', label: 'Charcoal Ink', swatchHex: ARTWORK_PALETTE.eyebrowColor },
  { id: 'espresso-brown', label: 'Espresso', swatchHex: '#3E2318' },
  { id: 'warm-chestnut', label: 'Chestnut', swatchHex: '#7C3F1D' },
  { id: 'golden-blonde', label: 'Blonde', swatchHex: '#CA8A04' },
  { id: 'copper-ginger', label: 'Copper', swatchHex: '#C2410C' },
  { id: 'slate-gray', label: 'Slate', swatchHex: '#475569' },
];

export function resolveEyebrowHex(eyebrowColor: EyebrowColorId, hairColor: HairColorId): string {
  switch (eyebrowColor) {
    case 'auto': {
      if (hairColor === 'frost-silver') return '#475569';
      if (hairColor === 'golden-blonde') return '#A16207';
      return HAIR_COLOR_PALETTES[hairColor].base;
    }
    case 'charcoal-ink':
      return ARTWORK_PALETTE.eyebrowColor;
    case 'espresso-brown':
      return '#3E2318';
    case 'warm-chestnut':
      return '#7C3F1D';
    case 'golden-blonde':
      return '#CA8A04';
    case 'copper-ginger':
      return '#C2410C';
    case 'slate-gray':
      return '#475569';
  }
}

export interface BlushColorPalette {
  id: BlushColorId;
  label: string;
  base: string;
  highlight: string;
}

export const BLUSH_COLOR_PALETTES: Record<BlushColorId, BlushColorPalette> = {
  'coral-pink': {
    id: 'coral-pink',
    label: 'Coral Rose',
    base: ARTWORK_PALETTE.blushPink,
    highlight: ARTWORK_PALETTE.blushHighlight,
  },
  'rose-red': {
    id: 'rose-red',
    label: 'Berry Pink',
    base: '#F43F5E',
    highlight: '#FDA4AF',
  },
  'warm-apricot': {
    id: 'warm-apricot',
    label: 'Apricot',
    base: '#FB923C',
    highlight: '#FDBA74',
  },
  'soft-lavender': {
    id: 'soft-lavender',
    label: 'Lavender',
    base: '#C084FC',
    highlight: '#E9D5FF',
  },
};

export interface ApparelColorPalette {
  id: ApparelColorId;
  label: string;
  base: string;
  shadow: string;
  highlight: string;
  collar: string;
}

export const APPAREL_COLOR_PALETTES: Record<ApparelColorId, ApparelColorPalette> = {
  'poppy-orange': {
    id: 'poppy-orange',
    label: 'Poppy Orange',
    base: ARTWORK_PALETTE.shirtBase,
    shadow: ARTWORK_PALETTE.shirtShadow,
    highlight: ARTWORK_PALETTE.shirtHighlight,
    collar: ARTWORK_PALETTE.collarBase,
  },
  'webmate-cobalt': {
    id: 'webmate-cobalt',
    label: 'WebMate Blue',
    base: '#2563EB',
    shadow: '#1D4ED8',
    highlight: '#60A5FA',
    collar: '#1E40AF',
  },
  'navy-slate': {
    id: 'navy-slate',
    label: 'Midnight Navy',
    base: '#1E293B',
    shadow: '#0F172A',
    highlight: '#475569',
    collar: '#0F172A',
  },
  'mint-emerald': {
    id: 'mint-emerald',
    label: 'Emerald',
    base: '#10B981',
    shadow: '#059669',
    highlight: '#34D399',
    collar: '#047857',
  },
  'sunny-gold': {
    id: 'sunny-gold',
    label: 'Sunny Gold',
    base: '#F59E0B',
    shadow: '#D97706',
    highlight: '#FBBF24',
    collar: '#B45309',
  },
  'crimson-red': {
    id: 'crimson-red',
    label: 'Crimson',
    base: '#E11D48',
    shadow: '#BE123C',
    highlight: '#FB7185',
    collar: '#9F1239',
  },
  'royal-violet': {
    id: 'royal-violet',
    label: 'Royal Violet',
    base: '#7C3AED',
    shadow: '#6D28D9',
    highlight: '#A78BFA',
    collar: '#5B21B6',
  },
  'cloud-white': {
    id: 'cloud-white',
    label: 'Crisp White',
    base: '#F8FAFC',
    shadow: '#CBD5E1',
    highlight: '#FFFFFF',
    collar: '#E2E8F0',
  },
};

export interface BottomColorPalette {
  id: BottomColorId;
  label: string;
  base: string;
  shadow: string;
  highlight: string;
}

export const BOTTOM_COLOR_PALETTES: Record<BottomColorId, BottomColorPalette> = {
  'mustard-amber': {
    id: 'mustard-amber',
    label: 'Mustard Gold',
    base: ARTWORK_PALETTE.shortsBase,
    shadow: ARTWORK_PALETTE.shortsShadow,
    highlight: ARTWORK_PALETTE.shortsHighlight,
  },
  'indigo-denim': {
    id: 'indigo-denim',
    label: 'Indigo Denim',
    base: '#2563EB',
    shadow: '#1E40AF',
    highlight: '#60A5FA',
  },
  'deep-navy': {
    id: 'deep-navy',
    label: 'Deep Navy',
    base: '#1E293B',
    shadow: '#0F172A',
    highlight: '#334155',
  },
  'charcoal-gray': {
    id: 'charcoal-gray',
    label: 'Charcoal',
    base: '#475569',
    shadow: '#334155',
    highlight: '#64748B',
  },
  'olive-cargo': {
    id: 'olive-cargo',
    label: 'Olive Green',
    base: '#65A30D',
    shadow: '#4D7C0F',
    highlight: '#84CC16',
  },
  'warm-khaki': {
    id: 'warm-khaki',
    label: 'Warm Khaki',
    base: '#D97706',
    shadow: '#B45309',
    highlight: '#F59E0B',
  },
};

export interface ShoeColorPalette {
  id: ShoeColorId;
  label: string;
  primary: string;
  dark: string;
}

export const SHOE_COLOR_PALETTES: Record<ShoeColorId, ShoeColorPalette> = {
  'speed-cyan': {
    id: 'speed-cyan',
    label: 'Speed Cyan',
    primary: ARTWORK_PALETTE.sneakerTeal,
    dark: ARTWORK_PALETTE.sneakerTealDark,
  },
  'varsity-red': {
    id: 'varsity-red',
    label: 'Varsity Red',
    primary: '#EF4444',
    dark: '#B91C1C',
  },
  'webmate-blue': {
    id: 'webmate-blue',
    label: 'Cobalt Blue',
    primary: '#2563EB',
    dark: '#1D4ED8',
  },
  'obsidian-black': {
    id: 'obsidian-black',
    label: 'Obsidian',
    primary: '#1E293B',
    dark: '#0F172A',
  },
  'sunny-yellow': {
    id: 'sunny-yellow',
    label: 'Sunny Yellow',
    primary: '#EAB308',
    dark: '#CA8A04',
  },
  'forest-mint': {
    id: 'forest-mint',
    label: 'Mint Green',
    primary: '#10B981',
    dark: '#047857',
  },
  'lavender-pop': {
    id: 'lavender-pop',
    label: 'Violet Pop',
    primary: '#8B5CF6',
    dark: '#6D28D9',
  },
};

export interface FxColorOption {
  id: FxColorId;
  label: string;
  swatchHex: string;
  isAuto?: boolean;
  tintHex: string | null;
}

export const FX_COLOR_OPTIONS: readonly FxColorOption[] = [
  { id: 'auto', label: 'Mood Auto', swatchHex: '#334155', isAuto: true, tintHex: null },
  { id: 'gold-spark', label: 'Gold Spark', swatchHex: '#FBBF24', tintHex: '#FBBF24' },
  { id: 'sky-cyan', label: 'Sky Cyan', swatchHex: '#38BDF8', tintHex: '#38BDF8' },
  { id: 'rose-pink', label: 'Rose Pink', swatchHex: '#FB7185', tintHex: '#FB7185' },
  { id: 'violet-aura', label: 'Violet', swatchHex: '#A855F7', tintHex: '#A855F7' },
];

export function resolveFxTintHex(fxColor: FxColorId): string | null {
  return FX_COLOR_OPTIONS.find((item) => item.id === fxColor)?.tintHex ?? null;
}

