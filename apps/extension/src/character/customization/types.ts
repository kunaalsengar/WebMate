import type { CharacterAnchorCoordinates, CharacterLayerId } from '@webmate/shared';
import characterManifest from '../../../assets/character/manifests/character.manifest.json';

/**
 * Security & size limits for user-imported SVG layer customization (v1).
 */
export const CUSTOMIZATION_LIMITS = {
  MAX_SVG_FILE_BYTES: 100 * 1024, // 100 KB raw upload cap per file
  MAX_SVG_TEXT_LENGTH: 100_000, // 100k chars raw XML cap
  MAX_SVG_NODE_COUNT: 600, // Max AST elements per layer
  MAX_SVG_NESTING_DEPTH: 16, // Max nested group/tspan depth
  MAX_SVG_PATH_LENGTH: 32_768, // Max path `d` / `points` attribute length
  MAX_SVG_ATTR_LENGTH: 512, // Max general attribute string length
  MAX_SVG_COLOR_LENGTH: 64, // Max solid color literal length
  MAX_SVG_TEXT_NODE_LENGTH: 128, // Max characters inside <text>/<tspan>
  MAX_SVG_TRANSFORM_OPS: 16, // Max chained SVG transform operations
  MAX_SVG_NUMERIC_ABS: 100_000, // Finite coordinate magnitude bound
  MAX_LAYER_AST_JSON_BYTES: 80 * 1024, // 80 KB serialized JSON cap per layer
  MAX_TOTAL_CUSTOM_ASSETS_BYTES: 1_500 * 1024, // ~1.5 MB aggregate cap across all 12 layers
  MAX_FILENAME_LENGTH: 255,
} as const;

export const PLACEMENT_BOUNDS = {
  MIN_OFFSET_X: -100,
  MAX_OFFSET_X: 100,
  MIN_OFFSET_Y: -125,
  MAX_OFFSET_Y: 125,
  MIN_SCALE: 0.25,
  MAX_SCALE: 3.0,
} as const;

/**
 * Allowed SVG geometry & safe vector text tags for v1 custom layer imports.
 * Excludes <defs>, gradients, filters, <style>, <use>, <image>, <script>, <foreignObject>, and SMIL animations.
 */
export const ALLOWED_SVG_TAGS = [
  'g',
  'path',
  'circle',
  'ellipse',
  'rect',
  'polygon',
  'polyline',
  'line',
  'text',
  'tspan',
] as const;

export type AllowedSvgTag = (typeof ALLOWED_SVG_TAGS)[number];

/**
 * Parsed SVG viewBox coordinates normalized in SVG units.
 */
export interface SvgViewBox {
  minX: number;
  minY: number;
  width: number;
  height: number;
}

/**
 * Non-destructive visual placement and viewBox normalization settings for a customized layer.
 */
export interface LayerPlacementOffset {
  offsetX: number;
  offsetY: number;
  scale: number;
  fitMode: 'preserve-200x250' | 'fit-source-viewbox';
}

export const DEFAULT_LAYER_PLACEMENT: LayerPlacementOffset = {
  offsetX: 0,
  offsetY: 0,
  scale: 1,
  fitMode: 'preserve-200x250',
};

/**
 * Validated, pure-data SVG element node rendered cleanly via React.createElement (never raw HTML).
 */
export interface SafeSvgNode {
  tag: AllowedSvgTag;
  attrs: Record<string, string>;
  text?: string;
  children?: SafeSvgNode[];
}

/**
 * Result produced when validating and sanitizing a raw imported SVG string.
 */
export interface SanitizedSvgDocument {
  sourceViewBox: string;
  parsedViewBox: SvgViewBox;
  suggestedFitMode: LayerPlacementOffset['fitMode'];
  nodes: SafeSvgNode[];
  nodeCount: number;
  maxDepth: number;
  byteSize: number;
}

export type SvgValidationResult =
  | { ok: true; value: SanitizedSvgDocument }
  | { ok: false; errors: string[] };

/**
 * Per-layer persisted customization payload stored under chrome.storage.local.
 */
export interface StoredCustomLayerAsset {
  layerId: CharacterLayerId;
  fileName: string;
  byteSize: number;
  sourceViewBox: string;
  parsedViewBox: SvgViewBox;
  nodes: SafeSvgNode[];
  placement: LayerPlacementOffset;
  updatedAt: number;
}

export type CustomCharacterLayersMap = Partial<Record<CharacterLayerId, StoredCustomLayerAsset>>;

/**
 * Root schema stored in chrome.storage.local for Phase 2 Step 2B asset customization.
 */
export interface StoredCharacterAssetCustomization {
  version: 1;
  layers: CustomCharacterLayersMap;
  updatedAt: number;
}

export type LayerCustomizationCategory = 'body-limbs' | 'head-face' | 'shadow-fx';

/**
 * Descriptive metadata for each of the 12 canonical WebMate character rig layers.
 */
export interface CustomizableLayerDescriptor {
  layerId: CharacterLayerId;
  label: string;
  category: LayerCustomizationCategory;
  zIndex: number;
  anchorName: string;
  anchor: CharacterAnchorCoordinates;
  isExpressionReactive: boolean;
  description: string;
  expressionNote?: string;
}

const LAYER_UI_META: Record<
  CharacterLayerId,
  {
    label: string;
    category: LayerCustomizationCategory;
    isExpressionReactive: boolean;
    expressionNote?: string;
  }
> = {
  'layer-shadow': {
    label: 'Ground Shadow',
    category: 'shadow-fx',
    isExpressionReactive: false,
  },
  'layer-leg-left': {
    label: 'Left Leg & Shoe',
    category: 'body-limbs',
    isExpressionReactive: false,
  },
  'layer-arm-left': {
    label: 'Left Arm',
    category: 'body-limbs',
    isExpressionReactive: false,
  },
  'layer-leg-right': {
    label: 'Right Leg & Shoe',
    category: 'body-limbs',
    isExpressionReactive: false,
  },
  'layer-body': {
    label: 'Torso, Shirt & Shorts',
    category: 'body-limbs',
    isExpressionReactive: false,
  },
  'layer-arm-right': {
    label: 'Right Arm (Pointing)',
    category: 'body-limbs',
    isExpressionReactive: false,
  },
  'layer-head': {
    label: 'Head & Hair',
    category: 'head-face',
    isExpressionReactive: false,
  },
  'layer-blush': {
    label: 'Cheek Blush',
    category: 'head-face',
    isExpressionReactive: true,
    expressionNote:
      'Expression-reactive layer: one custom SVG applies across all expressions (expression opacity still modulates automatically). Resetting restores default dynamic blush.',
  },
  'layer-eyebrows': {
    label: 'Eyebrows',
    category: 'head-face',
    isExpressionReactive: true,
    expressionNote:
      'Expression-reactive layer: one custom SVG applies across all expressions instead of per-expression eyebrow shapes. Resetting restores original dynamic eyebrows.',
  },
  'layer-eyes': {
    label: 'Eyes',
    category: 'head-face',
    isExpressionReactive: true,
    expressionNote:
      'Expression-reactive layer: one custom SVG applies across all expressions (blinking squash continues around head pivot). Resetting restores original dynamic eyes.',
  },
  'layer-mouth': {
    label: 'Mouth',
    category: 'head-face',
    isExpressionReactive: true,
    expressionNote:
      'Expression-reactive layer: one custom SVG applies across all expressions (speech scaling pulses around mouth pivot). Resetting restores original dynamic mouth shapes.',
  },
  'layer-fx': {
    label: 'Emotional FX Overlay',
    category: 'shadow-fx',
    isExpressionReactive: true,
    expressionNote:
      'Expression-reactive layer: one custom SVG applies persistently across all expressions rather than switching by mood. Resetting restores expression-triggered FX.',
  },
};

const anchorsRecord = characterManifest.anchors as Record<string, CharacterAnchorCoordinates>;

/**
 * Canonical ordered list of all 12 customizable rig layers backed directly by character.manifest.json.
 */
export const CUSTOMIZABLE_LAYER_METADATA: readonly CustomizableLayerDescriptor[] =
  [...characterManifest.layers]
    .sort((a, b) => a.zIndex - b.zIndex)
    .map((layer) => {
      const layerId = layer.id as CharacterLayerId;
      const anchorName = layer.anchor ?? 'head';
      const anchor = anchorsRecord[anchorName] ?? { x: 100, y: 125 };
      const ui = LAYER_UI_META[layerId];

      return {
        layerId,
        label: ui.label,
        category: ui.category,
        zIndex: layer.zIndex,
        anchorName,
        anchor,
        isExpressionReactive: ui.isExpressionReactive,
        description: layer.description ?? '',
        expressionNote: ui.expressionNote,
      };
    });

export const CUSTOMIZABLE_LAYER_BY_ID: Readonly<
  Record<CharacterLayerId, CustomizableLayerDescriptor>
> = CUSTOMIZABLE_LAYER_METADATA.reduce(
  (acc, item) => {
    acc[item.layerId] = item;
    return acc;
  },
  {} as Record<CharacterLayerId, CustomizableLayerDescriptor>
);

export const CANONICAL_CHARACTER_LAYER_IDS: readonly CharacterLayerId[] =
  CUSTOMIZABLE_LAYER_METADATA.map((item) => item.layerId);

