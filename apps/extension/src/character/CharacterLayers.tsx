import React from 'react';
import type { LayerRenderProps } from './types';

/**
 * Developer wireframe guide rendered strictly when showDevRig is true.
 * Visualizes the layer's pivot anchor coordinates without fabricating character artwork.
 */
const DevAnchorGuide: React.FC<{
  x: number;
  y: number;
  label: string;
  color?: string;
}> = ({ x, y, label, color = '#60A5FA' }) => (
  <g className="dev-anchor-guide" pointerEvents="none">
    {/* Target Circle */}
    <circle
      cx={x}
      cy={y}
      r="4"
      fill="none"
      stroke={color}
      strokeWidth="1"
      strokeDasharray="2,2"
      opacity="0.8"
    />
    {/* Center Crosshair */}
    <line
      x1={x - 6}
      y1={y}
      x2={x + 6}
      y2={y}
      stroke={color}
      strokeWidth="1"
      opacity="0.9"
    />
    <line
      x1={x}
      y1={y - 6}
      x2={x}
      y2={y + 6}
      stroke={color}
      strokeWidth="1"
      opacity="0.9"
    />
    {/* Coordinate & Slot Label */}
    <text
      x={x}
      y={y - 8}
      fill={color}
      fontSize="7"
      fontFamily="monospace"
      textAnchor="middle"
      opacity="0.85"
    >
      {label} ({x},{y})
    </text>
  </g>
);

/**
 * Layer 0: Ground Contact Shadow Plane
 */
export const ShadowLayer: React.FC<LayerRenderProps> = ({
  anchor,
  visible,
  showDevRig,
  customContent,
}) => {
  if (!visible) return null;

  return (
    <g id="layer-shadow" className="character-layer layer-shadow">
      {customContent}
      {showDevRig && (
        <g>
          {/* Subtle ground plane indicator in dev mode */}
          <ellipse
            cx={anchor.x}
            cy={anchor.y}
            rx="36"
            ry="7"
            fill="rgba(15, 23, 42, 0.25)"
          />
          <DevAnchorGuide x={anchor.x} y={anchor.y} label="shadow" color="#94A3B8" />
        </g>
      )}
    </g>
  );
};

/**
 * Layer 1: Background Left Leg & Sneaker
 */
export const LegLeftLayer: React.FC<LayerRenderProps> = ({
  anchor,
  visible,
  showDevRig,
  transform,
  customContent,
}) => {
  if (!visible) return null;

  return (
    <g
      id="layer-leg-left"
      className="character-layer layer-leg-left"
      transform={transform}
    >
      {customContent}
      {showDevRig && (
        <DevAnchorGuide x={anchor.x} y={anchor.y} label="leg-L" color="#38BDF8" />
      )}
    </g>
  );
};

/**
 * Layer 2: Background Support Arm (Left)
 */
export const ArmLeftLayer: React.FC<LayerRenderProps> = ({
  anchor,
  visible,
  showDevRig,
  transform,
  customContent,
}) => {
  if (!visible) return null;

  return (
    <g
      id="layer-arm-left"
      className="character-layer layer-arm-left"
      transform={transform}
    >
      {customContent}
      {showDevRig && (
        <DevAnchorGuide x={anchor.x} y={anchor.y} label="arm-L" color="#38BDF8" />
      )}
    </g>
  );
};

/**
 * Layer 3: Foreground Right Leg & Sneaker
 */
export const LegRightLayer: React.FC<LayerRenderProps> = ({
  anchor,
  visible,
  showDevRig,
  transform,
  customContent,
}) => {
  if (!visible) return null;

  return (
    <g
      id="layer-leg-right"
      className="character-layer layer-leg-right"
      transform={transform}
    >
      {customContent}
      {showDevRig && (
        <DevAnchorGuide x={anchor.x} y={anchor.y} label="leg-R" color="#38BDF8" />
      )}
    </g>
  );
};

/**
 * Layer 4: Torso, Red Shirt & Yellow Shorts
 */
export const BodyLayer: React.FC<LayerRenderProps> = ({
  anchor,
  visible,
  showDevRig,
  transform,
  customContent,
}) => {
  if (!visible) return null;

  return (
    <g
      id="layer-body"
      className="character-layer layer-body"
      transform={transform}
    >
      {customContent}
      {showDevRig && (
        <DevAnchorGuide x={anchor.x} y={anchor.y} label="torso" color="#EF4444" />
      )}
    </g>
  );
};

/**
 * Layer 5: Articulated Foreground Right Arm (Waving & Pointing)
 */
export const ArmRightLayer: React.FC<LayerRenderProps> = ({
  anchor,
  visible,
  showDevRig,
  transform,
  customContent,
}) => {
  if (!visible) return null;

  return (
    <g
      id="layer-arm-right"
      className="character-layer layer-arm-right"
      transform={transform}
    >
      {customContent}
      {showDevRig && (
        <DevAnchorGuide x={anchor.x} y={anchor.y} label="arm-R" color="#38BDF8" />
      )}
    </g>
  );
};

/**
 * Layer 6: Head Contour & Hair
 */
export const HeadLayer: React.FC<LayerRenderProps> = ({
  anchor,
  visible,
  showDevRig,
  transform,
  customContent,
}) => {
  if (!visible) return null;

  return (
    <g
      id="layer-head"
      className="character-layer layer-head"
      transform={transform}
    >
      {customContent}
      {showDevRig && (
        <DevAnchorGuide x={anchor.x} y={anchor.y} label="head" color="#FBBF24" />
      )}
    </g>
  );
};

/**
 * Layer 7: Cheek Blush Overlays
 */
export const BlushLayer: React.FC<LayerRenderProps> = ({
  anchor,
  visible,
  showDevRig,
  opacity = 0,
  customContent,
}) => {
  if (!visible) return null;

  return (
    <g
      id="layer-blush"
      className="character-layer layer-blush"
      opacity={showDevRig ? (opacity > 0 ? opacity : 0.85) : opacity}
    >
      {customContent}
      {showDevRig && (
        <DevAnchorGuide x={anchor.x - 22} y={anchor.y - 13} label="blush" color="#F472B6" />
      )}
    </g>
  );
};

/**
 * Layer 8: Thick Black Eyebrows
 */
export const EyebrowsLayer: React.FC<LayerRenderProps> = ({
  anchor,
  visible,
  showDevRig,
  transform,
  customContent,
}) => {
  if (!visible) return null;

  return (
    <g
      id="layer-eyebrows"
      className="character-layer layer-eyebrows"
      transform={transform}
    >
      {customContent}
      {showDevRig && (
        <DevAnchorGuide x={anchor.x + 5} y={anchor.y - 40} label="eyebrows" color="#818CF8" />
      )}
    </g>
  );
};

/**
 * Layer 9: Eyes & Pupils (Squash Blinking)
 */
export const EyesLayer: React.FC<LayerRenderProps> = ({
  anchor,
  visible,
  showDevRig,
  transform,
  customContent,
}) => {
  if (!visible) return null;

  return (
    <g
      id="layer-eyes"
      className="character-layer layer-eyes"
      transform={transform}
    >
      {customContent}
      {showDevRig && (
        <DevAnchorGuide x={anchor.x} y={anchor.y - 27} label="eyes" color="#38BDF8" />
      )}
    </g>
  );
};

/**
 * Layer 10: Swappable Mouth Geometries (Stream-Triggered Speech)
 */
export const MouthLayer: React.FC<LayerRenderProps> = ({
  anchor,
  visible,
  showDevRig,
  transform,
  customContent,
}) => {
  if (!visible) return null;

  return (
    <g
      id="layer-mouth"
      className="character-layer layer-mouth"
      transform={transform}
    >
      {customContent}
      {showDevRig && (
        <DevAnchorGuide x={anchor.x} y={anchor.y} label="mouth" color="#E11D48" />
      )}
    </g>
  );
};

/**
 * Layer 11: Emotional FX Overlays (Zzz, Sweat Drop, Snot Bubble, Sparkles)
 */
export const EffectsLayer: React.FC<LayerRenderProps> = ({
  anchor,
  visible,
  showDevRig,
  customContent,
}) => {
  if (!visible) return null;

  return (
    <g id="layer-fx" className="character-layer layer-fx">
      {customContent}
      {showDevRig && (
        <DevAnchorGuide x={anchor.x + 25} y={anchor.y - 60} label="fx" color="#A855F7" />
      )}
    </g>
  );
};

/**
 * Dispatcher mapping layer IDs to their respective React layer component.
 */
export const CharacterLayerRenderer: React.FC<LayerRenderProps> = (props) => {
  switch (props.layerId) {
    case 'layer-shadow':
      return <ShadowLayer {...props} />;
    case 'layer-leg-left':
      return <LegLeftLayer {...props} />;
    case 'layer-arm-left':
      return <ArmLeftLayer {...props} />;
    case 'layer-leg-right':
      return <LegRightLayer {...props} />;
    case 'layer-body':
      return <BodyLayer {...props} />;
    case 'layer-arm-right':
      return <ArmRightLayer {...props} />;
    case 'layer-head':
      return <HeadLayer {...props} />;
    case 'layer-blush':
      return <BlushLayer {...props} />;
    case 'layer-eyebrows':
      return <EyebrowsLayer {...props} />;
    case 'layer-eyes':
      return <EyesLayer {...props} />;
    case 'layer-mouth':
      return <MouthLayer {...props} />;
    case 'layer-fx':
      return <EffectsLayer {...props} />;
    default:
      return null;
  }
};

