import React, { useMemo, useRef } from 'react';
import type {
  CharacterAnchorCoordinates,
  CharacterAnimationState,
  CharacterExpression,
  CharacterLayerDefinition,
  CharacterLayerId,
  CompanionPosition,
} from '@webmate/shared';
import {
  CHARACTER_BASE_HEIGHT,
  CHARACTER_BASE_WIDTH,
  CHARACTER_RENDERED_HEIGHT,
  CHARACTER_RENDERED_WIDTH,
  CHARACTER_RIG_SCALE,
} from '@webmate/shared';
import characterManifest from '../../assets/character/manifests/character.manifest.json';
import {
  useCharacterAnimation,
  type PointingAnimationDriver,
  type PointingTarget,
  type TalkingAnimationDriver,
} from './animation';
import { characterArtworkRegistry } from './artwork';
import { CharacterLayerRenderer } from './CharacterLayers';
import { getExpressionConfig } from './expressions.config';
import type { CharacterAssetRegistry } from './types';

export interface CharacterRigProps {
  /** Current facial expression preset (default: 'normal') */
  expression?: CharacterExpression;
  /** High-level animation behavioral state (default: 'idle') */
  animationState?: CharacterAnimationState;
  /** Uniform scale multiplier (default: CHARACTER_RIG_SCALE = 0.65) */
  scale?: number;
  /** Width in pixels override (default: CHARACTER_RENDERED_WIDTH or CHARACTER_BASE_WIDTH * scale) */
  width?: number;
  /** Height in pixels override (default: CHARACTER_RENDERED_HEIGHT or CHARACTER_BASE_HEIGHT * scale) */
  height?: number;
  /** Enable development wireframe visualization of anchors and slots (default: false) */
  showDevRig?: boolean;
  /** Whether the companion is undergoing active pointer drag (dampens/pauses motion) */
  isDragging?: boolean;
  /** Declarative viewport target (HTMLElement or DOMRect) to point toward */
  pointingTarget?: PointingTarget | null;
  /** Current floating companion viewport position (used for docked/post-drag pointing accuracy) */
  companionPosition?: CompanionPosition | null;
  /** Optional callback providing access to the TalkingAnimationDriver interface */
  onTalkingDriverReady?: (driver: TalkingAnimationDriver) => void;
  /** Optional callback providing access to the PointingAnimationDriver interface */
  onPointingDriverReady?: (driver: PointingAnimationDriver) => void;
  /** Optional callback invoked if dynamic pointing ends internally */
  onPointingStop?: () => void;
  /** Optional registry of loaded SVG layer fragments */
  assetRegistry?: CharacterAssetRegistry;
  /** Optional container class name */
  className?: string;
  /** Optional inline style overrides */
  style?: React.CSSProperties;
}

/**
 * Standard Articulated Vector Rig Renderer for WebMate Original Mascot
 *
 * Requirements fulfilled:
 * - Transparent renderer: no cards, backgrounds, or opaque planes behind the character.
 * - Configurable scale with stable dimensions preserving standard viewBox "0 0 200 250".
 * - Fully driven by expression and animation-state props.
 * - Independent multi-layer rendering based on character manifest z-indexes and anchors.
 * - Safe missing asset handling: renders cleanly with zero crashes when assets are absent.
 * - Development-only wireframe mode (showDevRig) for anchor and slot alignment calibration.
 * - Decoupled from animation controllers (GSAP timelines to be layered in subsequent step).
 */
export const CharacterRig: React.FC<CharacterRigProps> = ({
  expression = 'normal',
  animationState = 'idle',
  scale = CHARACTER_RIG_SCALE,
  width,
  height,
  showDevRig = false,
  isDragging = false,
  pointingTarget,
  companionPosition = null,
  onTalkingDriverReady,
  onPointingDriverReady,
  onPointingStop,
  assetRegistry = characterArtworkRegistry,
  className = '',
  style = {},
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // 1. Resolve expression configuration
  const expConfig = useMemo(() => getExpressionConfig(expression), [expression]);

  // 2. Computed viewport dimensions using shared base and rendered constants
  const computedWidth =
    width ?? (scale === CHARACTER_RIG_SCALE ? CHARACTER_RENDERED_WIDTH : Math.round(CHARACTER_BASE_WIDTH * scale));
  const computedHeight =
    height ?? (scale === CHARACTER_RIG_SCALE ? CHARACTER_RENDERED_HEIGHT : Math.round(CHARACTER_BASE_HEIGHT * scale));

  // 3. Anchors lookup from manifest
  const anchors: Record<string, CharacterAnchorCoordinates> = characterManifest.anchors;

  // 4. Bind GSAP character animation subsystem
  useCharacterAnimation({
    svgRef,
    animationState,
    expression,
    isDragging,
    anchors,
    pointingTarget,
    companionPosition,
    onTalkingDriverReady,
    onPointingDriverReady,
    onPointingStop,
  });

  // 5. Sorted layers by z-index ascending
  const sortedLayers: CharacterLayerDefinition[] = useMemo(() => {
    return [...characterManifest.layers].sort((a, b) => a.zIndex - b.zIndex);
  }, []);

  // 5. Compute dynamic transforms for layers based on expression presets
  const getLayerTransform = (layerId: CharacterLayerId, anchor: CharacterAnchorCoordinates): string | undefined => {
    if (layerId === 'layer-head' && expConfig.headTiltDeg !== 0) {
      return `rotate(${expConfig.headTiltDeg} ${anchor.x} ${anchor.y})`;
    }
    return undefined;
  };

  return (
    <div
      className={`webmate-character-rig-container inline-block select-none ${className}`}
      style={{
        width: `${computedWidth}px`,
        height: `${computedHeight}px`,
        background: 'transparent',
        overflow: 'visible',
        pointerEvents: 'none',
        ...style,
      }}
      role="img"
      aria-label={`WebMate Mascot Companion (${expression}, ${animationState})`}
    >
      <svg
        ref={svgRef}
        viewBox={characterManifest.viewBox}
        width={computedWidth}
        height={computedHeight}
        style={{
          display: 'block',
          overflow: 'visible',
          background: 'transparent',
        }}
      >
        <defs>
          {/* Defs block reserved for runtime clipping paths and gradients */}
        </defs>

        {/* Development Coordinate Grid (shown only when showDevRig is enabled) */}
        {showDevRig && (
          <g id="dev-grid" opacity="0.6">
            <rect
              x="0"
              y="0"
              width="200"
              height="250"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="0.75"
              strokeDasharray="4,4"
            />
            <text
              x="6"
              y="12"
              fill="#38BDF8"
              fontSize="7"
              fontFamily="monospace"
            >
              RIG VIEWBOX (200x250)
            </text>
          </g>
        )}

        {/* Root Character Group */}
        <g id="shinchan-rig-root">
          {sortedLayers.map((layer) => {
            const layerId = layer.id as CharacterLayerId;
            const anchor = layer.anchor ? anchors[layer.anchor] : { x: 100, y: 125 };
            const rawAsset = assetRegistry[layerId];
            const transform = getLayerTransform(layerId, anchor);
            const opacity = layerId === 'layer-blush' ? expConfig.blushOpacity : 1.0;
            const customContent =
              typeof rawAsset === 'function'
                ? rawAsset({
                    layerId,
                    zIndex: layer.zIndex,
                    anchor,
                    visible: true,
                    expression,
                    animationState,
                    showDevRig,
                    transform,
                    opacity,
                  })
                : rawAsset;

            return (
              <CharacterLayerRenderer
                key={layerId}
                layerId={layerId}
                zIndex={layer.zIndex}
                anchor={anchor}
                visible={true}
                expression={expression}
                animationState={animationState}
                showDevRig={showDevRig}
                transform={transform}
                opacity={opacity}
                customContent={customContent}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default CharacterRig;

