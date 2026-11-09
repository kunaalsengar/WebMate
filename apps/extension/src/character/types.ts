import type {
  CharacterAnchorCoordinates,
  CharacterAnimationState,
  CharacterExpression,
  CharacterLayerId,
} from '@webmate/shared';

/**
 * Render properties passed to individual layer components within CharacterLayers.
 */
export interface LayerRenderProps {
  /** Unique layer identifier matching the manifest */
  layerId: CharacterLayerId;
  /** Stack order within the SVG hierarchy */
  zIndex: number;
  /** Primary pivot coordinate for transforms */
  anchor: CharacterAnchorCoordinates;
  /** Visibility toggle for the layer */
  visible: boolean;
  /** Current facial expression preset */
  expression: CharacterExpression;
  /** Current procedural animation state */
  animationState: CharacterAnimationState;
  /** Development mode flag showing anchor crosshairs and slot guides */
  showDevRig: boolean;
  /** Additional CSS/SVG transform string (e.g. rotate, scale) */
  transform?: string;
  /** Opacity multiplier (0.0 to 1.0) */
  opacity?: number;
  /** Optional custom SVG content injected into this layer */
  customContent?: React.ReactNode;
}

/**
 * Function signature for dynamic layer asset renderers that respond to expression/animation props.
 */
export type CharacterAssetRenderFunction = (props: LayerRenderProps) => React.ReactNode;

/**
 * Registry holding optional loaded SVG layer fragments.
 * Supports either direct React.ReactNode elements or dynamic render functions.
 * When an asset slot is empty (null/undefined), the rig renders cleanly without crashing.
 */
export type CharacterAssetRegistry = Partial<
  Record<CharacterLayerId, React.ReactNode | CharacterAssetRenderFunction>
>;

