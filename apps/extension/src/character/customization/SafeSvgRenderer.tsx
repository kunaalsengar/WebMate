import React, { useMemo } from 'react';
import {
  CHARACTER_BASE_HEIGHT,
  CHARACTER_BASE_WIDTH,
  type CharacterAnchorCoordinates,
  type CharacterLayerId,
} from '@webmate/shared';
import { characterArtworkRegistry } from '../artwork/registry';
import type { CharacterAssetRegistry, LayerRenderProps } from '../types';
import {
  computeLayerPlacementTransform,
  sanitizeLayerPlacement,
  validateSafeSvgNodes,
  validateStoredCustomLayerAsset,
} from './svgSanitizer';
import {
  CANONICAL_CHARACTER_LAYER_IDS,
  CUSTOMIZATION_LIMITS,
  DEFAULT_LAYER_PLACEMENT,
  type CustomCharacterLayersMap,
  type LayerPlacementOffset,
  type SafeSvgNode,
  type StoredCustomLayerAsset,
  type SvgViewBox,
} from './types';

/**
 * Explicit allowlist mapping sanitized SVG XML attribute names to camelCase React SVG props.
 */
const SVG_ATTR_TO_REACT_PROP: Record<string, keyof React.SVGAttributes<SVGElement>> = {
  fill: 'fill',
  'fill-opacity': 'fillOpacity',
  'fill-rule': 'fillRule',
  stroke: 'stroke',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'stroke-opacity': 'strokeOpacity',
  opacity: 'opacity',
  'clip-rule': 'clipRule',
  transform: 'transform',
  'vector-effect': 'vectorEffect',
  d: 'd',
  cx: 'cx',
  cy: 'cy',
  r: 'r',
  rx: 'rx',
  ry: 'ry',
  x: 'x',
  y: 'y',
  width: 'width',
  height: 'height',
  points: 'points',
  x1: 'x1',
  y1: 'y1',
  x2: 'x2',
  y2: 'y2',
  dx: 'dx',
  dy: 'dy',
  'font-size': 'fontSize',
  'font-weight': 'fontWeight',
  'font-style': 'fontStyle',
  'font-family': 'fontFamily',
  'text-anchor': 'textAnchor',
  'dominant-baseline': 'dominantBaseline',
  'letter-spacing': 'letterSpacing',
};

function isValidSvgViewBox(viewBox: SvgViewBox | null | undefined): viewBox is SvgViewBox {
  if (!viewBox || typeof viewBox !== 'object') return false;
  return (
    Number.isFinite(viewBox.minX) &&
    Number.isFinite(viewBox.minY) &&
    Number.isFinite(viewBox.width) &&
    Number.isFinite(viewBox.height) &&
    viewBox.width > 0 &&
    viewBox.height > 0 &&
    Math.abs(viewBox.minX) <= CUSTOMIZATION_LIMITS.MAX_SVG_NUMERIC_ABS &&
    Math.abs(viewBox.minY) <= CUSTOMIZATION_LIMITS.MAX_SVG_NUMERIC_ABS &&
    viewBox.width <= CUSTOMIZATION_LIMITS.MAX_SVG_NUMERIC_ABS &&
    viewBox.height <= CUSTOMIZATION_LIMITS.MAX_SVG_NUMERIC_ABS
  );
}

function toSafeAnchor(anchor: CharacterAnchorCoordinates | null | undefined): CharacterAnchorCoordinates {
  if (anchor && Number.isFinite(anchor.x) && Number.isFinite(anchor.y)) {
    return anchor;
  }
  return { x: CHARACTER_BASE_WIDTH / 2, y: CHARACTER_BASE_HEIGHT / 2 };
}

function toReactSvgProps(
  attrs: Record<string, string>,
  key: string
): React.ClassAttributes<SVGElement> & React.SVGAttributes<SVGElement> {
  const props: Record<string, string> = { key };

  for (const [attrName, attrValue] of Object.entries(attrs)) {
    if (!Object.prototype.hasOwnProperty.call(SVG_ATTR_TO_REACT_PROP, attrName)) {
      continue;
    }
    const reactProp = SVG_ATTR_TO_REACT_PROP[attrName];
    props[reactProp] = attrValue;
  }

  return props as unknown as React.ClassAttributes<SVGElement> & React.SVGAttributes<SVGElement>;
}

/**
 * Recursively converts a validated SafeSvgNode AST into React SVG elements.
 * Never injects raw SVG strings or uses dangerouslySetInnerHTML.
 */
function renderSafeSvgNode(
  node: SafeSvgNode,
  key: string,
  depth: number
): React.ReactElement | null {
  if (depth > CUSTOMIZATION_LIMITS.MAX_SVG_NESTING_DEPTH + 1) {
    return null;
  }

  const reactProps = toReactSvgProps(node.attrs, key);
  const childNodes: React.ReactNode[] = [];

  if ((node.tag === 'text' || node.tag === 'tspan') && typeof node.text === 'string' && node.text.length > 0) {
    childNodes.push(node.text);
  }

  if (node.children && node.children.length > 0) {
    for (let i = 0; i < node.children.length; i += 1) {
      const renderedChild = renderSafeSvgNode(node.children[i], `${key}-${i}`, depth + 1);
      if (renderedChild !== null) {
        childNodes.push(renderedChild);
      }
    }
  }

  if (childNodes.length === 0) {
    return React.createElement(node.tag, reactProps);
  }

  return React.createElement(node.tag, reactProps, ...childNodes);
}

export interface SafeSvgAstGraphicProps {
  /** Sanitized pure-data SVG AST nodes (re-validated defensively before rendering) */
  nodes: SafeSvgNode[];
  /** Parsed source SVG viewBox used for aspect-preserving placement */
  parsedViewBox: SvgViewBox;
  /** Optional placement offset, scale, and fit mode */
  placement?: LayerPlacementOffset;
  /** Layer pivot coordinates inside the 200x250 character space */
  anchor: CharacterAnchorCoordinates;
  /** Optional SVG group class name */
  className?: string;
}

/**
 * Pure React SVG element tree renderer for sanitized custom vector geometry.
 * Applies user placement transforms inside an inner <g> wrapper so GSAP continues
 * animating the outer canonical #layer-* wrapper unobstructed.
 */
export const SafeSvgAstGraphic: React.FC<SafeSvgAstGraphicProps> = ({
  nodes,
  parsedViewBox,
  placement = DEFAULT_LAYER_PLACEMENT,
  anchor,
  className = 'custom-layer-artwork',
}) => {
  const safeNodes = useMemo(() => {
    const check = validateSafeSvgNodes(nodes);
    return check.ok ? check.nodes : null;
  }, [nodes]);

  const renderedChildren = useMemo(() => {
    if (!safeNodes) return null;
    return safeNodes.map((node, index) => renderSafeSvgNode(node, `custom-svg-${index}`, 1));
  }, [safeNodes]);

  const safePlacement = useMemo(() => sanitizeLayerPlacement(placement), [placement]);

  const viewBoxValid = isValidSvgViewBox(parsedViewBox);
  const safeAnchor = toSafeAnchor(anchor);

  const placementTransform = useMemo(() => {
    if (!viewBoxValid) return undefined;
    return computeLayerPlacementTransform(parsedViewBox, safePlacement, safeAnchor);
  }, [
    viewBoxValid,
    parsedViewBox.minX,
    parsedViewBox.minY,
    parsedViewBox.width,
    parsedViewBox.height,
    safePlacement,
    safeAnchor.x,
    safeAnchor.y,
  ]);

  if (!renderedChildren || !viewBoxValid) {
    return null;
  }

  return (
    <g className={className} pointerEvents="none" transform={placementTransform}>
      {renderedChildren}
    </g>
  );
};

export interface CustomLayerArtworkProps {
  /** Persisted or staged custom layer asset descriptor */
  asset: StoredCustomLayerAsset;
  /** Canonical layer anchor coordinate passed down by CharacterRig */
  anchor: CharacterAnchorCoordinates;
  /** Optional canonical layer ID constraint enforced during runtime validation */
  expectedLayerId?: CharacterLayerId;
  /** Optional SVG group class name */
  className?: string;
}

/**
 * Validated custom artwork wrapper for a single character rig layer slot.
 * Independently returns null if the asset fails runtime re-validation.
 */
export const CustomLayerArtwork: React.FC<CustomLayerArtworkProps> = ({
  asset,
  anchor,
  expectedLayerId,
  className = 'custom-layer-artwork',
}) => {
  const validatedAsset = useMemo(
    () => validateStoredCustomLayerAsset(asset, expectedLayerId),
    [asset, expectedLayerId]
  );

  if (!validatedAsset) {
    return null;
  }

  return (
    <SafeSvgAstGraphic
      nodes={validatedAsset.nodes}
      parsedViewBox={validatedAsset.parsedViewBox}
      placement={validatedAsset.placement}
      anchor={anchor}
      className={className}
    />
  );
};

/**
 * Composes validated custom SVG layer assets over the default 12-layer character registry.
 * Any missing or invalid custom layer record falls back independently to the original artwork
 * while preserving GSAP pivots, expression controls, blinking, speech, and dynamic pointing.
 */
export function buildMergedArtworkRegistry(
  customLayers: CustomCharacterLayersMap | null | undefined,
  fallbackRegistry: CharacterAssetRegistry = characterArtworkRegistry
): CharacterAssetRegistry {
  if (!customLayers || typeof customLayers !== 'object') {
    return fallbackRegistry;
  }

  const merged: CharacterAssetRegistry = { ...fallbackRegistry };
  let hasOverrides = false;

  for (const layerId of CANONICAL_CHARACTER_LAYER_IDS) {
    const candidate = customLayers[layerId];
    if (!candidate) {
      continue;
    }

    const validatedAsset = validateStoredCustomLayerAsset(candidate, layerId);
    if (!validatedAsset) {
      continue;
    }

    hasOverrides = true;
    merged[layerId] = (props: LayerRenderProps) => (
      <CustomLayerArtwork
        asset={validatedAsset}
        anchor={props.anchor}
        expectedLayerId={layerId}
      />
    );
  }

  return hasOverrides ? merged : fallbackRegistry;
}

