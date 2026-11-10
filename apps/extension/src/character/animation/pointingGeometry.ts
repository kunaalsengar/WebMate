import {
  CHARACTER_BASE_HEIGHT,
  CHARACTER_BASE_WIDTH,
  CHARACTER_RENDERED_HEIGHT,
  CHARACTER_RENDERED_WIDTH,
  COMPOSITE_COMPANION_WIDTH,
  type CharacterAnchorCoordinates,
  type CompanionPosition,
  type DockSide,
} from '@webmate/shared';
import type { RigAnchors } from './types';

/**
 * Viewport-relative rectangle accepted by the pointing API.
 * Compatible with DOMRect, DOMRectReadOnly, and plain bounding boxes.
 */
export interface PointingRect {
  left: number;
  top: number;
  width: number;
  height: number;
  right?: number;
  bottom?: number;
  x?: number;
  y?: number;
}

/**
 * Target input accepted by the WebMate dynamic pointing system.
 */
export type PointingTarget = HTMLElement | DOMRect | PointingRect;

/**
 * Side of the mascot character used for pointing articulation.
 */
export type PointingArm = 'left' | 'right';

/**
 * Viewport bounding box of the rendered CharacterRig SVG element.
 */
export interface RigViewportBounds {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * 2D transform values applied cleanly to individual rig SVG layers.
 */
export interface PointingLayerTransform {
  x?: number;
  y?: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
}

/**
 * Resolved target vector and coordinated anatomical pose for all pointing layers.
 */
export interface PointingPose {
  /** Selected pointing arm ('left' or 'right') */
  arm: PointingArm;
  /** Target center in viewport pixel coordinates */
  targetPoint: { x: number; y: number };
  /** Clockwise SVG rotation angle for #layer-arm-left (degrees) */
  armLeftRotation: number;
  /** Clockwise SVG rotation angle for #layer-arm-right (degrees) */
  armRightRotation: number;
  /** Direction vector angle from rig chest center to target (degrees, +X = 0, +Y = 90) */
  directionAngleDeg: number;
  /** Euclidean viewport distance from rig chest center to target */
  distancePx: number;
  /** Full pointing + shoulder-tracking transform for #layer-arm-left */
  armLeft: PointingLayerTransform;
  /** Full pointing + shoulder-tracking transform for #layer-arm-right */
  armRight: PointingLayerTransform;
  /** Coordinated torso lean */
  body: PointingLayerTransform;
  /** Coordinated head tilt/look offset */
  head: PointingLayerTransform;
  /** Subtle eye gaze tracking */
  eyes: PointingLayerTransform;
  /** Coordinated eyebrow horizontal/rotation match (y preserved for blink overlay) */
  eyebrows: PointingLayerTransform;
  /** Coordinated mouth offset (scaleX/scaleY preserved for TalkingAnimationDriver) */
  mouth: PointingLayerTransform;
  /** Coordinated blush follow */
  blush: PointingLayerTransform;
  /** Coordinated FX follow */
  fx: PointingLayerTransform;
  /** Ground shadow weight-shift follow */
  shadow: PointingLayerTransform;
}

/**
 * Options for computing a full pointing pose.
 */
export interface PointingCalculationOptions {
  target: PointingTarget;
  rigBounds: RigViewportBounds;
  anchors: RigAnchors;
  viewportWidth: number;
  viewportHeight: number;
  dockSide?: DockSide;
  previousArm?: PointingArm | null;
}

// Resting arm vectors derived from ArmLeftArtwork & ArmRightArtwork geometries:
// Left arm: shoulder (70, 135) -> hand center (64, 176) => dx = -6, dy = 41
const LEFT_ARM_REST_ANGLE_DEG = Math.atan2(41, -6) * (180 / Math.PI); // ~ +98.33 deg
// Right arm: shoulder (130, 135) -> hand center (138, 176) => dx = 8, dy = 41
const RIGHT_ARM_REST_ANGLE_DEG = Math.atan2(41, 8) * (180 / Math.PI); // ~ +78.96 deg

// Anatomical shoulder joint bounds keeping forearm/hand clearly outside head/ear and shorts/torso silhouette:
// - Left arm (rest +98.33°): [+20°, +140°] spans +118.3° (down-left clear of shorts) through -121.7° (up-left clear of left ear)
// - Right arm (rest +78.96°): [-140°, -22°] spans -61.0° (up-right clear of right ear) through +57.0° (down-right clear of shorts)
const MIN_LEFT_ARM_ROTATION = 20;
const MAX_LEFT_ARM_ROTATION = 140;
const MIN_RIGHT_ARM_ROTATION = -140;
const MAX_RIGHT_ARM_ROTATION = -22;

const POINTING_ARM_EXTENSION_SCALE = 1.18;
const NEAR_OVERLAP_EXTENSION_SCALE = 1.08;
const POINTING_ARM_REACH_SVG = 2.0;

const ARM_SWITCH_DEADZONE_PX = 8;
const ARM_SWITCH_HYSTERESIS_PX = 18;
const NEAR_OVERLAP_DISTANCE_PX = 14;

/**
 * Type guard checking whether a pointing target is a live DOM element.
 */
export function isElementTarget(target: PointingTarget | null | undefined): target is HTMLElement {
  return (
    target !== null &&
    target !== undefined &&
    typeof target === 'object' &&
    typeof (target as HTMLElement).getBoundingClientRect === 'function'
  );
}

/**
 * Resolves the target's representative viewport coordinates.
 *
 * Behavior:
 * - Returns null for detached elements or invalid rectangles.
 * - For rectangles intersecting the viewport (including partially clipped elements
 *   and oversized sections), targets the center of the visible intersection.
 * - For completely off-screen targets (e.g. scrolled above/below viewport), preserves
 *   the true directional center so the mascot points accurately toward off-screen regions.
 */
export function resolveTargetViewportPoint(
  target: PointingTarget,
  viewportWidth: number,
  viewportHeight: number
): { x: number; y: number } | null {
  let rawLeft: number;
  let rawTop: number;
  let rawWidth: number;
  let rawHeight: number;

  if (isElementTarget(target)) {
    if ('isConnected' in target && !target.isConnected) {
      return null;
    }
    const rect = target.getBoundingClientRect();
    rawLeft = rect.left;
    rawTop = rect.top;
    rawWidth = rect.width;
    rawHeight = rect.height;
  } else if (target && typeof target === 'object') {
    const rect = target as PointingRect;
    rawLeft = Number.isFinite(rect.left) ? rect.left : rect.x ?? NaN;
    rawTop = Number.isFinite(rect.top) ? rect.top : rect.y ?? NaN;
    rawWidth = Number.isFinite(rect.width)
      ? Math.max(0, rect.width)
      : Number.isFinite(rect.right)
        ? Math.max(0, (rect.right as number) - rawLeft)
        : 0;
    rawHeight = Number.isFinite(rect.height)
      ? Math.max(0, rect.height)
      : Number.isFinite(rect.bottom)
        ? Math.max(0, (rect.bottom as number) - rawTop)
        : 0;
  } else {
    return null;
  }

  if (
    !Number.isFinite(rawLeft) ||
    !Number.isFinite(rawTop) ||
    !Number.isFinite(rawWidth) ||
    !Number.isFinite(rawHeight)
  ) {
    return null;
  }

  const rawRight = rawLeft + rawWidth;
  const rawBottom = rawTop + rawHeight;

  const vw = Number.isFinite(viewportWidth) && viewportWidth > 0 ? viewportWidth : 1280;
  const vh = Number.isFinite(viewportHeight) && viewportHeight > 0 ? viewportHeight : 800;

  const intersectsX = rawLeft <= vw && rawRight >= 0;
  const intersectsY = rawTop <= vh && rawBottom >= 0;

  if (intersectsX && intersectsY) {
    const visLeft = Math.max(0, rawLeft);
    const visRight = Math.min(vw, rawRight);
    const visTop = Math.max(0, rawTop);
    const visBottom = Math.min(vh, rawBottom);
    return {
      x: (visLeft + visRight) / 2,
      y: (visTop + visBottom) / 2,
    };
  }

  return {
    x: (rawLeft + rawRight) / 2,
    y: (rawTop + rawBottom) / 2,
  };
}

/**
 * Resolves the SVG CharacterRig's rendered viewport bounds.
 *
 * When companionPosition is supplied (from useCompanionStore), uses its authoritative
 * destination coordinates so post-drag dock snapping points accurately right away
 * without waiting for the 280ms CSS transform snap transition to finish.
 */
export function resolveRigViewportBounds(
  svgElement: SVGSVGElement | null,
  companionPosition?: CompanionPosition | null
): RigViewportBounds | null {
  const rect = svgElement ? svgElement.getBoundingClientRect() : null;
  const width = rect && rect.width > 0 ? rect.width : CHARACTER_RENDERED_WIDTH;
  const height = rect && rect.height > 0 ? rect.height : CHARACTER_RENDERED_HEIGHT;

  if (
    companionPosition &&
    Number.isFinite(companionPosition.x) &&
    Number.isFinite(companionPosition.y)
  ) {
    const horizontalInset = Math.max(0, (COMPOSITE_COMPANION_WIDTH - width) / 2);
    return {
      left: companionPosition.x + horizontalInset,
      top: companionPosition.y,
      width,
      height,
    };
  }

  if (rect && rect.width > 0 && rect.height > 0) {
    return {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    };
  }

  return null;
}

/**
 * Converts an anchor coordinate in the 200x250 SVG rig space to viewport pixels.
 */
export function svgAnchorToViewport(
  anchor: CharacterAnchorCoordinates,
  rigBounds: RigViewportBounds
): { x: number; y: number } {
  return {
    x: rigBounds.left + (anchor.x / CHARACTER_BASE_WIDTH) * rigBounds.width,
    y: rigBounds.top + (anchor.y / CHARACTER_BASE_HEIGHT) * rigBounds.height,
  };
}

/**
 * Selects left vs right arm with hysteresis near horizontal centerline to prevent jitter.
 */
export function selectPointingArm(
  dxFromCenter: number,
  previousArm?: PointingArm | null,
  dockSide?: DockSide
): PointingArm {
  if (previousArm && Math.abs(dxFromCenter) <= ARM_SWITCH_HYSTERESIS_PX) {
    return previousArm;
  }

  if (dxFromCenter < -ARM_SWITCH_DEADZONE_PX) {
    return 'left';
  }
  if (dxFromCenter > ARM_SWITCH_DEADZONE_PX) {
    return 'right';
  }

  // Tie-break on dockSide so pointing favors the webpage interior
  if (dockSide === 'left') return 'right';
  if (dockSide === 'right') return 'left';

  return dxFromCenter < 0 ? 'left' : 'right';
}

/**
 * Normalizes an angle difference continuously within [minBound, minBound + 360).
 */
function wrapAngleIntoRange(angleDeg: number, minBoundDeg: number): number {
  let result = angleDeg;
  const maxBoundDeg = minBoundDeg + 360;
  while (result < minBoundDeg) result += 360;
  while (result >= maxBoundDeg) result -= 360;
  return result;
}

/**
 * Clamps a numeric value cleanly between min and max.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculates the clockwise SVG rotation angle (degrees) needed for the chosen arm
 * to point from its shoulder anchor toward the relative target vector (dx, dy).
 */
export function calculatePointingArmRotation(
  arm: PointingArm,
  dx: number,
  dy: number
): number {
  if (dx === 0 && dy === 0) {
    return arm === 'left' ? 40 : -40;
  }

  const targetAngleDeg = Math.atan2(dy, dx) * (180 / Math.PI);

  if (arm === 'left') {
    // Left arm articulates clockwise outward on the left side;
    // split wrap cleanly along the opposite horizontal (+X, 0 deg) axis.
    const rawDelta = targetAngleDeg - LEFT_ARM_REST_ANGLE_DEG;
    const wrapped = wrapAngleIntoRange(rawDelta, -LEFT_ARM_REST_ANGLE_DEG);
    return clamp(wrapped, MIN_LEFT_ARM_ROTATION, MAX_LEFT_ARM_ROTATION);
  }

  // Right arm articulates counter-clockwise outward on the right side;
  // split wrap cleanly along the opposite horizontal (-X, +-180 deg) axis.
  const rawDelta = targetAngleDeg - RIGHT_ARM_REST_ANGLE_DEG;
  const wrapped = wrapAngleIntoRange(rawDelta, -(180 + RIGHT_ARM_REST_ANGLE_DEG));
  return clamp(wrapped, MIN_RIGHT_ARM_ROTATION, MAX_RIGHT_ARM_ROTATION);
}

/**
 * Computes the complete target direction vector and natural coordinated mascot pose.
 */
export function calculatePointingPose(
  options: PointingCalculationOptions
): PointingPose | null {
  const {
    target,
    rigBounds,
    anchors,
    viewportWidth,
    viewportHeight,
    dockSide,
    previousArm,
  } = options;

  const targetPoint = resolveTargetViewportPoint(target, viewportWidth, viewportHeight);
  if (!targetPoint) {
    return null;
  }

  const leftShoulderAnchor = anchors.leftShoulder ?? { x: 70, y: 135 };
  const rightShoulderAnchor = anchors.rightShoulder ?? { x: 130, y: 135 };
  const torsoAnchor = anchors.torso ?? { x: 100, y: 170 };
  const chestCenterAnchor = {
    x: (leftShoulderAnchor.x + rightShoulderAnchor.x) / 2,
    y: (leftShoulderAnchor.y + rightShoulderAnchor.y) / 2,
  };

  const chestCenterVP = svgAnchorToViewport(chestCenterAnchor, rigBounds);
  const dxFromCenter = targetPoint.x - chestCenterVP.x;
  const dyFromCenter = targetPoint.y - chestCenterVP.y;
  const distancePx = Math.hypot(dxFromCenter, dyFromCenter);
  const directionAngleDeg = Math.atan2(dyFromCenter, dxFromCenter) * (180 / Math.PI);

  const arm = selectPointingArm(dxFromCenter, previousArm, dockSide);

  let armLeftRotation = 0;
  let armRightRotation = 0;
  const isNearOverlap = distancePx < NEAR_OVERLAP_DISTANCE_PX;

  if (isNearOverlap) {
    // Graceful attentive outward gesture when target directly overlaps the companion
    if (arm === 'left') {
      armLeftRotation = 52;
      armRightRotation = -5;
    } else {
      armRightRotation = -52;
      armLeftRotation = 5;
    }
  } else if (arm === 'left') {
    const leftShoulderVP = svgAnchorToViewport(leftShoulderAnchor, rigBounds);
    armLeftRotation = calculatePointingArmRotation(
      'left',
      targetPoint.x - leftShoulderVP.x,
      targetPoint.y - leftShoulderVP.y
    );
    // Subtle natural counterbalance on non-pointing right arm
    armRightRotation = clamp(-Math.abs(armLeftRotation) * 0.06 - 3, -12, -3);
  } else {
    const rightShoulderVP = svgAnchorToViewport(rightShoulderAnchor, rigBounds);
    armRightRotation = calculatePointingArmRotation(
      'right',
      targetPoint.x - rightShoulderVP.x,
      targetPoint.y - rightShoulderVP.y
    );
    // Subtle natural counterbalance on non-pointing left arm
    armLeftRotation = clamp(Math.abs(armRightRotation) * 0.06 + 3, 3, 12);
  }

  // Normalized directional influence (-1..1) kept gentle for organic, non-exaggerated posture
  const normDx = clamp(dxFromCenter / 240, -1, 1);
  const normDy = clamp(dyFromCenter / 240, -1, 1);

  const bodyRotation = Number((normDx * 3.5).toFixed(2));
  const bodyX = Number((normDx * 1.8).toFixed(2));
  const bodyY = Number((normDy < 0 ? normDy * 1.1 : normDy * 0.7).toFixed(2));

  // Keep independent arm cuffs rigidly tracked onto leaning torso shoulder sockets,
  // plus subtle longitudinal extension along the resolved pointing direction.
  const bodyRotRad = bodyRotation * (Math.PI / 180);
  const computeTorsoPointDelta = (point: CharacterAnchorCoordinates): { x: number; y: number } => {
    const vx = point.x - torsoAnchor.x;
    const vy = point.y - torsoAnchor.y;
    const cos = Math.cos(bodyRotRad);
    const sin = Math.sin(bodyRotRad);
    return {
      x: bodyX + vx * (cos - 1) - vy * sin,
      y: bodyY + vx * sin + vy * (cos - 1),
    };
  };

  const leftSocketDelta = computeTorsoPointDelta(leftShoulderAnchor);
  const rightSocketDelta = computeTorsoPointDelta(rightShoulderAnchor);

  const pointingWorldAngleRad =
    ((arm === 'left'
      ? LEFT_ARM_REST_ANGLE_DEG + armLeftRotation
      : RIGHT_ARM_REST_ANGLE_DEG + armRightRotation) *
      Math.PI) /
    180;
  const reachAmount = isNearOverlap ? 1.0 : POINTING_ARM_REACH_SVG;
  const reachX = Math.cos(pointingWorldAngleRad) * reachAmount;
  const reachY = Math.sin(pointingWorldAngleRad) * reachAmount;

  const pointingScaleY = isNearOverlap ? NEAR_OVERLAP_EXTENSION_SCALE : POINTING_ARM_EXTENSION_SCALE;
  const roundedLeftRotation = Number(armLeftRotation.toFixed(2));
  const roundedRightRotation = Number(armRightRotation.toFixed(2));

  const armLeft: PointingLayerTransform = {
    x: Number((leftSocketDelta.x + (arm === 'left' ? reachX : 0)).toFixed(2)),
    y: Number((leftSocketDelta.y + (arm === 'left' ? reachY : 0)).toFixed(2)),
    rotation: roundedLeftRotation,
    scaleX: 1,
    scaleY: arm === 'left' ? pointingScaleY : 1,
  };

  const armRight: PointingLayerTransform = {
    x: Number((rightSocketDelta.x + (arm === 'right' ? reachX : 0)).toFixed(2)),
    y: Number((rightSocketDelta.y + (arm === 'right' ? reachY : 0)).toFixed(2)),
    rotation: roundedRightRotation,
    scaleX: 1,
    scaleY: arm === 'right' ? pointingScaleY : 1,
  };

  const headRotation = Number(clamp(normDx * 5.0 + normDx * normDy * 1.0, -5.8, 5.8).toFixed(2));
  const headX = Number((normDx * 2.8).toFixed(2));
  const headY = Number((normDy * 1.4).toFixed(2));

  // Subtle eye gaze tracking toward target while remaining centered inside sclera
  const eyeX = Number((headX + normDx * 2.2).toFixed(2));
  const eyeY = Number((headY + normDy * 1.2).toFixed(2));

  // Mouth pivot in motionUtils.ts sits ~10px above head pivot (105,105 vs 100,115),
  // so apply proportional horizontal compensation to keep facial features aligned on tilt
  const headRotRad = headRotation * (Math.PI / 180);
  const mouthX = Number((headX + Math.sin(headRotRad) * 10).toFixed(2));

  return {
    arm,
    targetPoint,
    armLeftRotation: roundedLeftRotation,
    armRightRotation: roundedRightRotation,
    directionAngleDeg: Number(directionAngleDeg.toFixed(2)),
    distancePx: Number(distancePx.toFixed(2)),
    armLeft,
    armRight,
    body: { x: bodyX, y: bodyY, rotation: bodyRotation },
    head: { x: headX, y: headY, rotation: headRotation },
    eyes: { x: eyeX, y: eyeY, rotation: headRotation },
    // Note: eyebrows.y intentionally omitted so periodic blinking never collides
    eyebrows: { x: Number((headX + normDx * 1.0).toFixed(2)), rotation: headRotation },
    // Note: mouth scaleX/scaleY intentionally omitted so TalkingAnimationDriver owns speech pulse
    mouth: { x: mouthX, y: headY, rotation: headRotation },
    blush: { x: headX, y: headY, rotation: headRotation },
    fx: { x: headX, y: headY, rotation: headRotation },
    shadow: { x: Number((normDx * 1.1).toFixed(2)) },
  };
}
