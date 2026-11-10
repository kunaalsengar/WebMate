import gsap from 'gsap';
import type { CharacterRigLayerElements, RigAnchors } from './types';

/**
 * Standardized easing curves for natural cartoon-like character motion.
 */
export const MOTION_EASINGS = {
  smooth: 'sine.inOut',
  gentle: 'power1.inOut',
  bounceOut: 'bounce.out',
  backOut: 'back.out(1.5)',
  backIn: 'back.in(1.2)',
  elasticOut: 'elastic.out(1, 0.5)',
  blink: 'power2.inOut',
  snappy: 'power2.out',
} as const;

/**
 * Detects whether the user has enabled system-level prefers-reduced-motion.
 */
export function isPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Resolves all 12 articulated layer elements from within the SVG rig scope.
 */
export function resolveRigElements(scope: Element): CharacterRigLayerElements {
  const query = (selector: string): SVGGElement | null =>
    scope.querySelector<SVGGElement>(selector);

  return {
    root: query('#shinchan-rig-root'),
    shadow: query('#layer-shadow'),
    legLeft: query('#layer-leg-left'),
    armLeft: query('#layer-arm-left'),
    legRight: query('#layer-leg-right'),
    body: query('#layer-body'),
    armRight: query('#layer-arm-right'),
    head: query('#layer-head'),
    blush: query('#layer-blush'),
    eyebrows: query('#layer-eyebrows'),
    eyes: query('#layer-eyes'),
    mouth: query('#layer-mouth'),
    fx: query('#layer-fx'),
  };
}

interface GsapSvgTransformCache {
  svg?: boolean;
  uncache?: number;
  originIsAbsolute?: boolean;
  xOrigin?: number;
  yOrigin?: number;
  xOffset?: number;
  yOffset?: number;
}

function getGsapSvgCache(el: SVGGElement): GsapSvgTransformCache | undefined {
  return (el as unknown as { _gsap?: GsapSvgTransformCache })._gsap;
}

function isSvgPivotCalibrated(el: SVGGElement, anchor: { x: number; y: number }): boolean {
  const cache = getGsapSvgCache(el);
  if (
    !cache ||
    !cache.svg ||
    cache.uncache ||
    !cache.originIsAbsolute ||
    el.getAttribute('data-svg-origin') !== `${anchor.x} ${anchor.y}`
  ) {
    return false;
  }

  const dx = Math.abs((cache.xOrigin ?? Number.NaN) - anchor.x);
  const dy = Math.abs((cache.yOrigin ?? Number.NaN) - anchor.y);
  const offX = Math.abs(cache.xOffset ?? 0);
  const offY = Math.abs(cache.yOffset ?? 0);

  return dx < 0.05 && dy < 0.05 && offX < 0.05 && offY < 0.05;
}

/**
 * Calibrates SVG transform origins for each layer group based on manifest anchor coordinates.
 * Uses GSAP's absolute SVG viewBox `svgOrigin` exclusively (never relative CSS `transformOrigin`)
 * so rotational and scale transforms articulate around anatomically accurate joint pivots.
 */
export function applyLayerAnchorPivots(
  targets: CharacterRigLayerElements,
  anchors: RigAnchors
): void {
  const headAnchor = anchors.head ?? { x: 100, y: 115 };
  const torsoAnchor = anchors.torso ?? { x: 100, y: 170 };
  const leftShoulder = anchors.leftShoulder ?? { x: 70, y: 135 };
  const rightShoulder = anchors.rightShoulder ?? { x: 130, y: 135 };
  const leftHip = anchors.leftHip ?? { x: 88, y: 200 };
  const rightHip = anchors.rightHip ?? { x: 112, y: 200 };
  const mouthAnchor = anchors.mouth ?? { x: 105, y: 105 };
  const shadowAnchor = anchors.shadow ?? { x: 100, y: 240 };

  const setPivot = (el: SVGGElement | null, anchor: { x: number; y: number }) => {
    if (!el || isSvgPivotCalibrated(el, anchor)) {
      return;
    }

    if (!getGsapSvgCache(el)) {
      el.setAttribute('data-svg-origin', `${anchor.x} ${anchor.y}`);
    }

    gsap.set(el, {
      svgOrigin: `${anchor.x} ${anchor.y}`,
      smoothOrigin: false,
    });
  };

  setPivot(targets.shadow, shadowAnchor);
  setPivot(targets.legLeft, leftHip);
  setPivot(targets.legRight, rightHip);
  setPivot(targets.armLeft, leftShoulder);
  setPivot(targets.armRight, rightShoulder);
  setPivot(targets.body, torsoAnchor);
  setPivot(targets.head, headAnchor);
  setPivot(targets.blush, headAnchor);
  setPivot(targets.eyebrows, headAnchor);
  setPivot(targets.eyes, headAnchor);
  setPivot(targets.mouth, mouthAnchor);
  setPivot(targets.fx, headAnchor);
}

/**
 * Re-synchronizes `#layer-head`'s SVG DOM transform attribute with GSAP's transform cache
 * after React re-renders `transform` for expression `headTiltDeg` changes.
 */
export function syncHeadTransformAfterReactRender(
  headEl: SVGGElement | null,
  headAnchor?: { x: number; y: number }
): void {
  if (!headEl) return;
  const anchor = headAnchor ?? { x: 100, y: 115 };
  const cache = getGsapSvgCache(headEl);
  if (cache && cache.svg && cache.originIsAbsolute && !cache.uncache) {
    gsap.set(headEl, {
      x: '+=0',
      y: '+=0',
      rotation: '+=0',
    });
    return;
  }

  gsap.set(headEl, {
    svgOrigin: `${anchor.x} ${anchor.y}`,
    smoothOrigin: false,
  });
}

/**
 * Resets all active transforms on layer targets back to neutral resting values.
 */
export function resetLayerTransforms(targets: CharacterRigLayerElements): void {
  const elements = [
    targets.root,
    targets.shadow,
    targets.legLeft,
    targets.armLeft,
    targets.legRight,
    targets.body,
    targets.armRight,
    targets.head,
    targets.blush,
    targets.eyebrows,
    targets.eyes,
    targets.mouth,
    targets.fx,
  ].filter((el): el is SVGGElement => Boolean(el));

  if (elements.length > 0) {
    gsap.set(elements, {
      x: 0,
      y: 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      clearProps: 'transform',
    });
  }
}

