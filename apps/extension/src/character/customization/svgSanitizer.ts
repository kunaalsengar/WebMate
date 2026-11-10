import { CHARACTER_BASE_HEIGHT, CHARACTER_BASE_WIDTH, type CharacterAnchorCoordinates, type CharacterLayerId } from '@webmate/shared';
import {
  ALLOWED_SVG_TAGS,
  CANONICAL_CHARACTER_LAYER_IDS,
  CUSTOMIZATION_LIMITS,
  DEFAULT_LAYER_PLACEMENT,
  PLACEMENT_BOUNDS,
  type AllowedSvgTag,
  type LayerPlacementOffset,
  type SafeSvgNode,
  type SanitizedSvgDocument,
  type StoredCustomLayerAsset,
  type SvgValidationResult,
  type SvgViewBox,
} from './types';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';
const XMLNS_NAMESPACE = 'http://www.w3.org/2000/xmlns/';
const XHTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
const SODIPODI_NAMESPACE = 'http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd';
const INKSCAPE_NAMESPACE = 'http://www.inkscape.org/namespaces/inkscape';

const ALLOWED_TAG_SET = new Set<string>(ALLOWED_SVG_TAGS);
const CANONICAL_LAYER_SET = new Set<string>(CANONICAL_CHARACTER_LAYER_IDS);

const STRIPPED_METADATA_TAGS = new Set(['metadata', 'title', 'desc']);

const DANGEROUS_EXECUTABLE_TAGS = new Set([
  'script',
  'foreignobject',
  'iframe',
  'object',
  'embed',
  'applet',
  'canvas',
  'audio',
  'video',
  'form',
  'input',
  'button',
  'textarea',
  'select',
]);

const GRADIENT_AND_DEFS_TAGS = new Set([
  'defs',
  'lineargradient',
  'radialgradient',
  'stop',
  'pattern',
  'hatch',
  'hatchpath',
  'meshgradient',
  'meshrow',
  'meshpatch',
]);

const STYLESHEET_TAGS = new Set(['style', 'link']);
const REFERENCE_AND_MEDIA_TAGS = new Set(['use', 'symbol', 'image']);
const CLIP_MASK_TAGS = new Set(['clippath', 'mask']);
const SMIL_ANIMATION_TAGS = new Set([
  'animate',
  'animatetransform',
  'animatemotion',
  'animatecolor',
  'set',
  'mpath',
]);

const SHARED_PRESENTATION_ATTRS = new Set([
  'fill',
  'fill-opacity',
  'fill-rule',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-miterlimit',
  'stroke-dasharray',
  'stroke-dashoffset',
  'stroke-opacity',
  'opacity',
  'clip-rule',
  'transform',
  'vector-effect',
]);

const TEXT_PRESENTATION_ATTRS = new Set([
  'x',
  'y',
  'dx',
  'dy',
  'font-size',
  'font-weight',
  'font-style',
  'font-family',
  'text-anchor',
  'dominant-baseline',
  'letter-spacing',
]);

const ALLOWED_ATTRS_BY_TAG: Record<AllowedSvgTag, ReadonlySet<string>> = {
  g: new Set([...SHARED_PRESENTATION_ATTRS]),
  path: new Set([...SHARED_PRESENTATION_ATTRS, 'd']),
  circle: new Set([...SHARED_PRESENTATION_ATTRS, 'cx', 'cy', 'r']),
  ellipse: new Set([...SHARED_PRESENTATION_ATTRS, 'cx', 'cy', 'rx', 'ry']),
  rect: new Set([...SHARED_PRESENTATION_ATTRS, 'x', 'y', 'width', 'height', 'rx', 'ry']),
  polygon: new Set([...SHARED_PRESENTATION_ATTRS, 'points']),
  polyline: new Set([...SHARED_PRESENTATION_ATTRS, 'points']),
  line: new Set([...SHARED_PRESENTATION_ATTRS, 'x1', 'y1', 'x2', 'y2']),
  text: new Set([...SHARED_PRESENTATION_ATTRS, ...TEXT_PRESENTATION_ATTRS]),
  tspan: new Set([...SHARED_PRESENTATION_ATTRS, ...TEXT_PRESENTATION_ATTRS]),
};

const HARMLESS_STRIPPED_ATTRS = new Set([
  'id',
  'class',
  'data-name',
  'xml:space',
]);

const NAMED_SVG_COLORS = new Set([
  'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black',
  'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse',
  'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue',
  'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey', 'darkkhaki',
  'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon',
  'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise',
  'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick',
  'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod',
  'gray', 'green', 'greenyellow', 'grey', 'honeydew', 'hotpink', 'indianred', 'indigo',
  'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue',
  'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey',
  'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray',
  'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta',
  'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple',
  'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise',
  'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite',
  'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod',
  'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink',
  'plum', 'powderblue', 'purple', 'rebeccapurple', 'red', 'rosybrown', 'royalblue',
  'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver',
  'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue',
  'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white',
  'whitesmoke', 'yellow', 'yellowgreen',
]);

const SAFE_FONT_FAMILIES = new Set([
  'sans-serif',
  'serif',
  'monospace',
  'cursive',
  'fantasy',
  'system-ui',
  'inherit',
]);

const UNSUPPORTED_CSS_PROPERTIES = new Set([
  'filter',
  'backdrop-filter',
  'clip-path',
  'mask',
  'mask-image',
  'background',
  'background-image',
  'animation',
  'transition',
  'behavior',
  '-moz-binding',
]);

const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

const STRICT_FLOAT_REGEX = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/;
const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const CONTROL_CHAR_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function measureUtf8Bytes(input: string): number {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(input).length;
  }
  return input.length * 2;
}

function parseStrictFiniteNumber(raw: string): number | null {
  const trimmed = raw.trim();
  if (!STRICT_FLOAT_REGEX.test(trimmed)) {
    return null;
  }
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || Math.abs(parsed) > CUSTOMIZATION_LIMITS.MAX_SVG_NUMERIC_ABS) {
    return null;
  }
  return parsed;
}

function parseSvgNumericLength(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withoutPx = trimmed.toLowerCase().endsWith('px')
    ? trimmed.slice(0, -2).trim()
    : trimmed;
  return parseStrictFiniteNumber(withoutPx);
}

function clampFinite(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function formatNumeric(value: number): string {
  const rounded = Math.round(value * 10000) / 10000;
  return Object.is(rounded, -0) ? '0' : String(rounded);
}

function parsePercentageOrUnitNumber(token: string, maxNumber: number): number | null {
  const trimmed = token.trim();
  if (trimmed.endsWith('%')) {
    const pct = parseStrictFiniteNumber(trimmed.slice(0, -1));
    if (pct === null || pct < 0 || pct > 100) return null;
    return (pct / 100) * maxNumber;
  }
  const num = parseStrictFiniteNumber(trimmed);
  if (num === null || num < 0 || num > maxNumber) return null;
  return num;
}

function parseAlphaComponent(token: string): number | null {
  const trimmed = token.trim();
  if (trimmed.endsWith('%')) {
    const pct = parseStrictFiniteNumber(trimmed.slice(0, -1));
    if (pct === null || pct < 0 || pct > 100) return null;
    return pct / 100;
  }
  const num = parseStrictFiniteNumber(trimmed);
  if (num === null || num < 0 || num > 1) return null;
  return num;
}

/**
 * Validates and normalizes solid SVG fill/stroke color literals.
 * Rejects gradients/url(), currentColor, var(), calc(), expression(), and external URI tokens.
 */
export function validateSolidSvgColor(
  rawValue: string,
  attrName: string
): { ok: true; value: string } | { ok: false; error: string } {
  const trimmed = rawValue.trim();
  if (!trimmed || trimmed.length > CUSTOMIZATION_LIMITS.MAX_SVG_COLOR_LENGTH) {
    return {
      ok: false,
      error: `Invalid ${attrName} color value (empty or exceeds ${CUSTOMIZATION_LIMITS.MAX_SVG_COLOR_LENGTH} characters).`,
    };
  }

  const lower = trimmed.toLowerCase();

  if (lower.includes('url(')) {
    return {
      ok: false,
      error: `Unsupported v1 SVG feature in ${attrName}: url(...) gradient/pattern references are not supported. Use solid colors instead.`,
    };
  }

  if (lower === 'currentcolor') {
    return {
      ok: false,
      error: `Unsupported v1 color keyword 'currentColor' in ${attrName}. Specify an explicit solid color, 'none', or 'transparent'.`,
    };
  }

  if (
    lower.includes('var(') ||
    lower.includes('calc(') ||
    lower.includes('env(') ||
    lower.includes('expression(') ||
    lower.includes('javascript:') ||
    lower.includes('vbscript:') ||
    lower.includes('data:') ||
    lower.includes('http:') ||
    lower.includes('https:')
  ) {
    return {
      ok: false,
      error: `Disallowed dynamic CSS function or URI in ${attrName} attribute.`,
    };
  }

  if (lower === 'none' || lower === 'transparent') {
    return { ok: true, value: lower };
  }

  if (HEX_COLOR_REGEX.test(trimmed)) {
    return { ok: true, value: trimmed };
  }

  if (NAMED_SVG_COLORS.has(lower)) {
    return { ok: true, value: lower };
  }

  const fnMatch = /^(rgb|rgba|hsl|hsla)\(([^()]+)\)$/i.exec(trimmed);
  if (!fnMatch) {
    return {
      ok: false,
      error: `Invalid solid color '${trimmed}' in ${attrName}. Supported formats: hex (#RGB/#RRGGBB), rgb()/rgba(), hsl()/hsla(), named colors, 'none', or 'transparent'.`,
    };
  }

  const fnName = fnMatch[1].toLowerCase();
  const inner = fnMatch[2].trim();

  let channelsPart = inner;
  let slashAlpha: string | null = null;
  if (inner.includes('/')) {
    if (inner.includes(',')) {
      return { ok: false, error: `Invalid ${fnName}() syntax combining commas with '/' alpha in ${attrName}.` };
    }
    const slashParts = inner.split('/');
    if (slashParts.length !== 2) {
      return { ok: false, error: `Invalid ${fnName}() alpha syntax in ${attrName}.` };
    }
    channelsPart = slashParts[0].trim();
    slashAlpha = slashParts[1].trim();
  }

  const tokens = channelsPart.includes(',')
    ? channelsPart.split(',').map((t) => t.trim())
    : channelsPart.split(/\s+/).map((t) => t.trim());

  if (slashAlpha !== null) {
    if (tokens.length !== 3) {
      return { ok: false, error: `Invalid ${fnName}() channel count in ${attrName}.` };
    }
    tokens.push(slashAlpha);
  }

  if (tokens.length !== 3 && tokens.length !== 4) {
    return { ok: false, error: `Invalid ${fnName}() arguments in ${attrName}.` };
  }

  if (fnName === 'rgb' || fnName === 'rgba') {
    const r = parsePercentageOrUnitNumber(tokens[0], 255);
    const g = parsePercentageOrUnitNumber(tokens[1], 255);
    const b = parsePercentageOrUnitNumber(tokens[2], 255);
    if (r === null || g === null || b === null) {
      return { ok: false, error: `Invalid RGB channel values in ${attrName}.` };
    }
    if (tokens.length === 4) {
      const a = parseAlphaComponent(tokens[3]);
      if (a === null) {
        return { ok: false, error: `Invalid alpha value in ${attrName}.` };
      }
      return {
        ok: true,
        value: `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${formatNumeric(a)})`,
      };
    }
    return {
      ok: true,
      value: `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`,
    };
  }

  // hsl / hsla
  const hueRaw = tokens[0].toLowerCase().endsWith('deg')
    ? tokens[0].slice(0, -3).trim()
    : tokens[0];
  const h = parseStrictFiniteNumber(hueRaw);
  const s = parsePercentageOrUnitNumber(tokens[1], 100);
  const l = parsePercentageOrUnitNumber(tokens[2], 100);
  if (h === null || !tokens[1].endsWith('%') || !tokens[2].endsWith('%') || s === null || l === null) {
    return { ok: false, error: `Invalid HSL values in ${attrName}.` };
  }
  if (tokens.length === 4) {
    const a = parseAlphaComponent(tokens[3]);
    if (a === null) {
      return { ok: false, error: `Invalid HSLA alpha value in ${attrName}.` };
    }
    return {
      ok: true,
      value: `hsla(${formatNumeric(h)}, ${formatNumeric(s)}%, ${formatNumeric(l)}%, ${formatNumeric(a)})`,
    };
  }
  return {
    ok: true,
    value: `hsl(${formatNumeric(h)}, ${formatNumeric(s)}%, ${formatNumeric(l)}%)`,
  };
}

/**
 * Strictly parses and reconstructs SVG transform lists.
 * Supports only matrix(6), translate(1-2), scale(1-2), rotate(1|3), skewX(1), skewY(1) with finite numbers.
 */
export function validateAndNormalizeTransform(
  rawValue: string
): { ok: true; value: string } | { ok: false; error: string } {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return { ok: false, error: 'Empty transform attribute is invalid.' };
  }
  if (trimmed.length > CUSTOMIZATION_LIMITS.MAX_SVG_ATTR_LENGTH) {
    return {
      ok: false,
      error: `Transform attribute exceeds maximum length of ${CUSTOMIZATION_LIMITS.MAX_SVG_ATTR_LENGTH} characters.`,
    };
  }

  const normalizedOps: string[] = [];
  const fnPattern = /(matrix|translate|scale|rotate|skewX|skewY)\s*\(\s*([^()]*)\s*\)/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = fnPattern.exec(trimmed)) !== null) {
    // Only allow commas and whitespace between transform functions
    const gap = trimmed.slice(cursor, match.index);
    if (!/^[\s,]*$/.test(gap)) {
      return {
        ok: false,
        error: `Unsupported or malformed syntax in transform near '${gap.trim()}'.`,
      };
    }

    if (normalizedOps.length >= CUSTOMIZATION_LIMITS.MAX_SVG_TRANSFORM_OPS) {
      return {
        ok: false,
        error: `Transform exceeds limit of ${CUSTOMIZATION_LIMITS.MAX_SVG_TRANSFORM_OPS} chained operations.`,
      };
    }

    const fnName = match[1];
    const argsStr = match[2].trim();
    if (!argsStr) {
      return { ok: false, error: `Transform function ${fnName}() requires numeric arguments.` };
    }

    const rawArgs = argsStr.split(/[\s,]+/).filter(Boolean);
    const args: number[] = [];
    for (const rawArg of rawArgs) {
      const parsed = parseStrictFiniteNumber(rawArg);
      if (parsed === null) {
        return {
          ok: false,
          error: `Transform function ${fnName}() contains invalid or non-finite numeric argument '${rawArg}'.`,
        };
      }
      args.push(parsed);
    }

    const validArgCount =
      (fnName === 'matrix' && args.length === 6) ||
      ((fnName === 'translate' || fnName === 'scale') && (args.length === 1 || args.length === 2)) ||
      (fnName === 'rotate' && (args.length === 1 || args.length === 3)) ||
      ((fnName === 'skewX' || fnName === 'skewY') && args.length === 1);

    if (!validArgCount) {
      return {
        ok: false,
        error: `Transform function ${fnName}() has invalid argument count (${args.length}).`,
      };
    }

    normalizedOps.push(`${fnName}(${args.map(formatNumeric).join(' ')})`);
    cursor = fnPattern.lastIndex;
  }

  const trailing = trimmed.slice(cursor);
  if (!/^[\s,]*$/.test(trailing) || normalizedOps.length === 0) {
    return {
      ok: false,
      error: `Unsupported or malformed SVG transform attribute '${trimmed.slice(0, 64)}'.`,
    };
  }

  return { ok: true, value: normalizedOps.join(' ') };
}

function validateSvgPathData(
  rawValue: string
): { ok: true; value: string } | { ok: false; error: string } {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return { ok: false, error: 'Empty path `d` attribute is invalid.' };
  }
  if (trimmed.length > CUSTOMIZATION_LIMITS.MAX_SVG_PATH_LENGTH) {
    return {
      ok: false,
      error: `Path data exceeds maximum length of ${CUSTOMIZATION_LIMITS.MAX_SVG_PATH_LENGTH} characters.`,
    };
  }
  if (!/^[MmZzLlHhVvCcSsQqTtAa0-9eE+\-.,\s]+$/.test(trimmed)) {
    return {
      ok: false,
      error: 'Path `d` attribute contains unsupported characters.',
    };
  }
  if (!/^[Mm]/.test(trimmed)) {
    return {
      ok: false,
      error: 'Path `d` attribute must begin with a MoveTo command (M or m).',
    };
  }

  // Verify all numeric literals inside path data parse finitely with zero leftover malformed tokens
  const withoutCommands = trimmed.replace(/[MmZzLlHhVvCcSsQqTtAa]/g, ' ');
  const numberTokenRegex = /[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/g;
  const leftover = withoutCommands.replace(numberTokenRegex, (token) => {
    const parsed = parseStrictFiniteNumber(token);
    return parsed === null ? ' INVALID ' : ' ';
  });

  if (/[^\s,]/.test(leftover)) {
    return {
      ok: false,
      error: 'Path `d` attribute contains malformed or out-of-range numeric coordinates.',
    };
  }

  return { ok: true, value: trimmed };
}

function validatePointsList(
  rawValue: string,
  tag: 'polygon' | 'polyline'
): { ok: true; value: string } | { ok: false; error: string } {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return { ok: false, error: `<${tag}> points attribute cannot be empty.` };
  }
  if (trimmed.length > CUSTOMIZATION_LIMITS.MAX_SVG_PATH_LENGTH) {
    return {
      ok: false,
      error: `<${tag}> points attribute exceeds maximum length of ${CUSTOMIZATION_LIMITS.MAX_SVG_PATH_LENGTH} characters.`,
    };
  }

  const rawTokens = trimmed.split(/[\s,]+/).filter(Boolean);
  if (rawTokens.length < 4 || rawTokens.length % 2 !== 0) {
    return {
      ok: false,
      error: `<${tag}> points must contain an even number (>= 4) of coordinate numbers.`,
    };
  }

  const parsedNumbers: string[] = [];
  for (const token of rawTokens) {
    const parsed = parseStrictFiniteNumber(token);
    if (parsed === null) {
      return {
        ok: false,
        error: `<${tag}> points contains invalid or non-finite coordinate '${token}'.`,
      };
    }
    parsedNumbers.push(formatNumeric(parsed));
  }

  return { ok: true, value: parsedNumbers.join(' ') };
}

function validateAttributeValueForTag(
  tag: AllowedSvgTag,
  attrName: string,
  rawValue: string
): { ok: true; value: string } | { ok: false; error: string } {
  if (!ALLOWED_ATTRS_BY_TAG[tag].has(attrName)) {
    return {
      ok: false,
      error: `Attribute '${attrName}' is not permitted on <${tag}> in v1 custom SVG layers.`,
    };
  }

  if (CONTROL_CHAR_REGEX.test(rawValue)) {
    return { ok: false, error: `Control characters are not allowed in attribute '${attrName}'.` };
  }

  const trimmed = rawValue.trim();

  if (attrName === 'd') {
    return validateSvgPathData(trimmed);
  }
  if (attrName === 'points') {
    if (tag !== 'polygon' && tag !== 'polyline') {
      return { ok: false, error: `Attribute 'points' is invalid on <${tag}>.` };
    }
    return validatePointsList(trimmed, tag);
  }

  if (trimmed.length > CUSTOMIZATION_LIMITS.MAX_SVG_ATTR_LENGTH) {
    return {
      ok: false,
      error: `Attribute '${attrName}' on <${tag}> exceeds max length of ${CUSTOMIZATION_LIMITS.MAX_SVG_ATTR_LENGTH} characters.`,
    };
  }

  switch (attrName) {
    case 'fill':
    case 'stroke':
      return validateSolidSvgColor(trimmed, attrName);

    case 'fill-rule':
    case 'clip-rule': {
      const lower = trimmed.toLowerCase();
      if (lower !== 'nonzero' && lower !== 'evenodd') {
        return { ok: false, error: `Invalid ${attrName} '${trimmed}' on <${tag}>.` };
      }
      return { ok: true, value: lower };
    }

    case 'stroke-linecap': {
      const lower = trimmed.toLowerCase();
      if (lower !== 'butt' && lower !== 'round' && lower !== 'square') {
        return { ok: false, error: `Invalid stroke-linecap '${trimmed}' on <${tag}>.` };
      }
      return { ok: true, value: lower };
    }

    case 'stroke-linejoin': {
      const lower = trimmed.toLowerCase();
      if (lower !== 'miter' && lower !== 'round' && lower !== 'bevel') {
        return { ok: false, error: `Invalid stroke-linejoin '${trimmed}' on <${tag}>.` };
      }
      return { ok: true, value: lower };
    }

    case 'vector-effect': {
      const lower = trimmed.toLowerCase();
      if (lower !== 'none' && lower !== 'non-scaling-stroke') {
        return { ok: false, error: `Unsupported vector-effect '${trimmed}' on <${tag}>.` };
      }
      return { ok: true, value: lower };
    }

    case 'transform':
      return validateAndNormalizeTransform(trimmed);

    case 'opacity':
    case 'fill-opacity':
    case 'stroke-opacity': {
      const n = parseStrictFiniteNumber(trimmed);
      if (n === null || n < 0 || n > 1) {
        return {
          ok: false,
          error: `Attribute '${attrName}' on <${tag}> must be a finite number between 0 and 1.`,
        };
      }
      return { ok: true, value: formatNumeric(n) };
    }

    case 'r':
    case 'rx':
    case 'ry':
    case 'width':
    case 'height':
    case 'stroke-width':
    case 'stroke-miterlimit': {
      const n = parseSvgNumericLength(trimmed);
      if (n === null || n < 0) {
        return {
          ok: false,
          error: `Attribute '${attrName}' on <${tag}> must be a finite non-negative number.`,
        };
      }
      if (attrName === 'stroke-miterlimit' && n < 1) {
        return { ok: false, error: `stroke-miterlimit on <${tag}> must be >= 1.` };
      }
      return { ok: true, value: formatNumeric(n) };
    }

    case 'font-size': {
      const n = parseSvgNumericLength(trimmed);
      if (n === null || n <= 0) {
        return {
          ok: false,
          error: `font-size on <${tag}> must be a positive finite number.`,
        };
      }
      return { ok: true, value: formatNumeric(n) };
    }

    case 'cx':
    case 'cy':
    case 'x':
    case 'y':
    case 'dx':
    case 'dy':
    case 'x1':
    case 'y1':
    case 'x2':
    case 'y2':
    case 'stroke-dashoffset':
    case 'letter-spacing': {
      const n = parseSvgNumericLength(trimmed);
      if (n === null) {
        return {
          ok: false,
          error: `Attribute '${attrName}' on <${tag}> must be a finite numeric coordinate.`,
        };
      }
      return { ok: true, value: formatNumeric(n) };
    }

    case 'stroke-dasharray': {
      const lower = trimmed.toLowerCase();
      if (lower === 'none') return { ok: true, value: 'none' };
      const parts = trimmed.split(/[\s,]+/).filter(Boolean);
      if (parts.length === 0 || parts.length > 64) {
        return { ok: false, error: `Invalid stroke-dasharray on <${tag}>.` };
      }
      const nums: string[] = [];
      for (const part of parts) {
        const n = parseSvgNumericLength(part);
        if (n === null || n < 0) {
          return {
            ok: false,
            error: `stroke-dasharray on <${tag}> must contain finite non-negative numbers.`,
          };
        }
        nums.push(formatNumeric(n));
      }
      return { ok: true, value: nums.join(' ') };
    }

    case 'font-weight': {
      const lower = trimmed.toLowerCase();
      if (lower === 'normal' || lower === 'bold') {
        return { ok: true, value: lower };
      }
      const n = parseStrictFiniteNumber(trimmed);
      if (n === null || n < 100 || n > 900) {
        return { ok: false, error: `Invalid font-weight '${trimmed}' on <${tag}>.` };
      }
      return { ok: true, value: String(Math.round(n)) };
    }

    case 'font-style': {
      const lower = trimmed.toLowerCase();
      if (lower !== 'normal' && lower !== 'italic' && lower !== 'oblique') {
        return { ok: false, error: `Invalid font-style '${trimmed}' on <${tag}>.` };
      }
      return { ok: true, value: lower };
    }

    case 'font-family': {
      const lower = trimmed.toLowerCase();
      if (!SAFE_FONT_FAMILIES.has(lower)) {
        return {
          ok: false,
          error: `Unsupported font-family '${trimmed}' in v1. Allowed generic fonts: ${[...SAFE_FONT_FAMILIES].join(', ')}.`,
        };
      }
      return { ok: true, value: lower };
    }

    case 'text-anchor': {
      const lower = trimmed.toLowerCase();
      if (lower !== 'start' && lower !== 'middle' && lower !== 'end') {
        return { ok: false, error: `Invalid text-anchor '${trimmed}' on <${tag}>.` };
      }
      return { ok: true, value: lower };
    }

    case 'dominant-baseline': {
      const lower = trimmed.toLowerCase();
      if (
        lower !== 'auto' &&
        lower !== 'central' &&
        lower !== 'middle' &&
        lower !== 'hanging'
      ) {
        return { ok: false, error: `Invalid dominant-baseline '${trimmed}' on <${tag}>.` };
      }
      return { ok: true, value: lower };
    }

    default:
      return { ok: false, error: `Attribute '${attrName}' is not permitted on <${tag}>.` };
  }
}

/**
 * Promotes safe, flat inline CSS presentation properties into validated SVG presentation attrs,
 * rejecting stylesheets, URLs, filters, clip-paths, masks, and CSS injections.
 */
function parseAndValidateInlineStyle(
  rawStyle: string,
  targetTag: AllowedSvgTag | 'svg',
  outAttrs: Record<string, string>,
  errors: string[]
): { hiddenByDisplay: boolean } {
  let hiddenByDisplay = false;
  if (rawStyle.length > CUSTOMIZATION_LIMITS.MAX_SVG_ATTR_LENGTH * 4) {
    errors.push(`Inline style on <${targetTag}> exceeds maximum permitted length.`);
    return { hiddenByDisplay };
  }

  const lowerAll = rawStyle.toLowerCase();
  if (
    lowerAll.includes('url(') ||
    lowerAll.includes('expression(') ||
    lowerAll.includes('@import') ||
    lowerAll.includes('javascript:') ||
    lowerAll.includes('vbscript:') ||
    lowerAll.includes('data:') ||
    lowerAll.includes('http://') ||
    lowerAll.includes('https://')
  ) {
    errors.push(
      `Unsupported or unsafe CSS construct (url/expression/URI) in style attribute on <${targetTag}>.`
    );
    return { hiddenByDisplay };
  }

  const declarations = rawStyle.split(';');
  for (const decl of declarations) {
    const trimmedDecl = decl.trim();
    if (!trimmedDecl) continue;

    const colonIndex = trimmedDecl.indexOf(':');
    if (colonIndex <= 0) {
      errors.push(`Malformed CSS declaration '${trimmedDecl}' in style attribute on <${targetTag}>.`);
      continue;
    }

    const prop = trimmedDecl.slice(0, colonIndex).trim().toLowerCase();
    const val = trimmedDecl.slice(colonIndex + 1).trim();

    if (UNSUPPORTED_CSS_PROPERTIES.has(prop)) {
      errors.push(
        `Unsupported v1 SVG style property '${prop}' on <${targetTag}>. Filters, masks, clip-paths, and animations are not supported in v1.`
      );
      continue;
    }

    if (prop === 'display') {
      const v = val.toLowerCase();
      if (v === 'none') {
        hiddenByDisplay = true;
      } else if (v !== 'inline' && v !== 'block') {
        errors.push(`Unsupported style display value '${val}' on <${targetTag}>.`);
      }
      continue;
    }

    if (prop === 'visibility') {
      const v = val.toLowerCase();
      if (v === 'hidden' || v === 'collapse') {
        hiddenByDisplay = true;
      } else if (v !== 'visible') {
        errors.push(`Unsupported style visibility value '${val}' on <${targetTag}>.`);
      }
      continue;
    }

    const effectiveTag: AllowedSvgTag = targetTag === 'svg' ? 'g' : targetTag;
    const validated = validateAttributeValueForTag(effectiveTag, prop, val);
    if (!validated.ok) {
      errors.push(validated.error);
      continue;
    }

    outAttrs[prop] = validated.value;
  }

  return { hiddenByDisplay };
}

function describeDisallowedTag(tagLower: string): string {
  if (DANGEROUS_EXECUTABLE_TAGS.has(tagLower)) {
    return `Disallowed security-sensitive element <${tagLower}> is not permitted.`;
  }
  if (GRADIENT_AND_DEFS_TAGS.has(tagLower)) {
    return `Unsupported v1 SVG feature: <${tagLower}> definitions/gradients/patterns are not supported. Export vector shapes with solid fills and strokes.`;
  }
  if (tagLower === 'filter' || tagLower.startsWith('fe')) {
    return `Unsupported v1 SVG feature: filter element <${tagLower}> is not supported in v1.`;
  }
  if (STYLESHEET_TAGS.has(tagLower)) {
    return `Unsupported v1 SVG feature: <${tagLower}> stylesheets are not supported. Export SVGs with inline presentation attributes instead of CSS rules.`;
  }
  if (REFERENCE_AND_MEDIA_TAGS.has(tagLower)) {
    return `Unsupported v1 SVG feature: <${tagLower}> external references or embedded bitmaps are not supported. Use inline vector geometry only.`;
  }
  if (CLIP_MASK_TAGS.has(tagLower)) {
    return `Unsupported v1 SVG feature: <${tagLower}> clipping/masking is not supported in v1.`;
  }
  if (SMIL_ANIMATION_TAGS.has(tagLower)) {
    return `Unsupported v1 SVG feature: SMIL animation element <${tagLower}> is not supported; WebMate controls animation via GSAP.`;
  }
  return `Unsupported SVG element <${tagLower}> is not permitted in v1 custom layers.`;
}

function parseRootViewBox(root: Element, errors: string[]): SvgViewBox | null {
  const rawViewBox = root.getAttribute('viewBox');
  if (rawViewBox !== null) {
    const parts = rawViewBox.trim().split(/[\s,]+/).filter(Boolean);
    if (parts.length !== 4) {
      errors.push('Invalid SVG viewBox attribute: expected exactly 4 finite numbers.');
      return null;
    }

    const minX = parseStrictFiniteNumber(parts[0]);
    const minY = parseStrictFiniteNumber(parts[1]);
    const width = parseStrictFiniteNumber(parts[2]);
    const height = parseStrictFiniteNumber(parts[3]);

    if (
      minX === null ||
      minY === null ||
      width === null ||
      height === null ||
      width <= 0 ||
      height <= 0
    ) {
      errors.push('Invalid SVG viewBox values: width and height must be positive finite numbers.');
      return null;
    }

    return { minX, minY, width, height };
  }

  // Fallback: inspect explicit numeric width/height on root <svg>
  const rawWidth = root.getAttribute('width');
  const rawHeight = root.getAttribute('height');
  if (rawWidth && rawHeight) {
    const w = parseSvgNumericLength(rawWidth);
    const h = parseSvgNumericLength(rawHeight);
    if (w !== null && h !== null && w > 0 && h > 0) {
      return { minX: 0, minY: 0, width: w, height: h };
    }
  }

  errors.push(
    'Missing valid SVG viewBox attribute (expected "0 0 200 250" or explicit positive width/height).'
  );
  return null;
}

function checkStrippedMetadataSubtree(el: Element, errors: string[]): void {
  const descendants = el.getElementsByTagName('*');
  for (let i = 0; i < descendants.length; i += 1) {
    const desc = descendants[i];
    const local = desc.localName.toLowerCase();
    if (
      DANGEROUS_EXECUTABLE_TAGS.has(local) ||
      STYLESHEET_TAGS.has(local) ||
      desc.namespaceURI === XHTML_NAMESPACE
    ) {
      errors.push(`Disallowed element <${desc.tagName}> found inside metadata section.`);
      return;
    }
  }
}

function validateAndCheckAttributeSafety(
  attr: Attr,
  elTag: AllowedSvgTag | 'svg',
  isRootSvg: boolean,
  errors: string[]
): { kind: 'ignore' } | { kind: 'style'; value: string } | { kind: 'attr'; name: string; value: string } {
  const nameLower = attr.name.toLowerCase();

  // Strictly reject all inline DOM event handler attributes
  if (nameLower.startsWith('on')) {
    errors.push(`Disallowed event handler attribute '${attr.name}' on <${elTag}>.`);
    return { kind: 'ignore' };
  }

  // Strictly block links and external resource reference attributes
  if (
    nameLower === 'href' ||
    nameLower === 'xlink:href' ||
    attr.localName.toLowerCase() === 'href' ||
    nameLower === 'src' ||
    nameLower === 'action' ||
    nameLower === 'formaction' ||
    nameLower === 'poster' ||
    nameLower === 'data' ||
    nameLower === 'codebase'
  ) {
    errors.push(`Unsupported v1 external/URI reference attribute '${attr.name}' on <${elTag}>.`);
    return { kind: 'ignore' };
  }

  // Handle XML namespace declarations cleanly
  if (attr.namespaceURI === XMLNS_NAMESPACE || nameLower === 'xmlns' || nameLower.startsWith('xmlns:')) {
    if (!isRootSvg) {
      errors.push(`Unexpected XML namespace declaration '${attr.name}' on child element <${elTag}>.`);
      return { kind: 'ignore' };
    }
    if (nameLower === 'xmlns' && attr.value !== SVG_NAMESPACE) {
      errors.push(`Invalid root SVG xmlns '${attr.value}'. Expected '${SVG_NAMESPACE}'.`);
      return { kind: 'ignore' };
    }
    if (attr.value === XHTML_NAMESPACE) {
      errors.push(`XHTML namespace declaration ('${attr.name}') is not permitted in SVG artwork.`);
      return { kind: 'ignore' };
    }
    return { kind: 'ignore' };
  }

  // Handle namespaced attributes cleanly
  if (attr.namespaceURI !== null && attr.namespaceURI !== SVG_NAMESPACE) {
    if (attr.namespaceURI === XML_NAMESPACE && nameLower === 'xml:space') {
      return { kind: 'ignore' };
    }
    if (
      (attr.namespaceURI === SODIPODI_NAMESPACE && nameLower.startsWith('sodipodi:')) ||
      (attr.namespaceURI === INKSCAPE_NAMESPACE && nameLower.startsWith('inkscape:'))
    ) {
      return { kind: 'ignore' };
    }
    errors.push(`Unsupported non-SVG namespaced attribute '${attr.name}' on <${elTag}>.`);
    return { kind: 'ignore' };
  }

  if (HARMLESS_STRIPPED_ATTRS.has(nameLower) || nameLower.startsWith('data-')) {
    return { kind: 'ignore' };
  }

  if (isRootSvg) {
    if (
      nameLower === 'viewbox' ||
      nameLower === 'width' ||
      nameLower === 'height' ||
      nameLower === 'version' ||
      nameLower === 'baseprofile' ||
      nameLower === 'preserveaspectratio'
    ) {
      return { kind: 'ignore' };
    }
  }

  if (nameLower === 'style') {
    return { kind: 'style', value: attr.value };
  }

  return { kind: 'attr', name: attr.name, value: attr.value };
}

/**
 * Validates and sanitizes an untrusted raw SVG file string into a pure-data AST.
 * Enforces XML strictness, SVG namespace isolation, depth/node/length budgets,
 * solid colors, finite numbers, strict transforms, and v1 feature restrictions.
 */
export function sanitizeSvgString(rawSvg: string): SvgValidationResult {
  const errors: string[] = [];

  if (typeof rawSvg !== 'string') {
    return { ok: false, errors: ['SVG input must be text content.'] };
  }

  const normalizedInput = rawSvg.replace(/^\uFEFF/, '').trim();
  if (!normalizedInput) {
    return { ok: false, errors: ['SVG file is empty.'] };
  }

  if (CONTROL_CHAR_REGEX.test(normalizedInput)) {
    return { ok: false, errors: ['SVG file contains disallowed binary or control characters.'] };
  }

  if (normalizedInput.length > CUSTOMIZATION_LIMITS.MAX_SVG_TEXT_LENGTH) {
    return {
      ok: false,
      errors: [
        `SVG exceeds maximum length of ${CUSTOMIZATION_LIMITS.MAX_SVG_TEXT_LENGTH} characters.`,
      ],
    };
  }

  const byteSize = measureUtf8Bytes(normalizedInput);
  if (byteSize > CUSTOMIZATION_LIMITS.MAX_SVG_FILE_BYTES) {
    return {
      ok: false,
      errors: [
        `SVG file (${Math.ceil(byteSize / 1024)} KB) exceeds the ${CUSTOMIZATION_LIMITS.MAX_SVG_FILE_BYTES / 1024} KB limit.`,
      ],
    };
  }

  // Block XML DTDs, entities (XXE/billion laughs), and stylesheet processing instructions before parsing
  if (
    /<!\s*(?:DOCTYPE|ENTITY|ELEMENT|ATTLIST|NOTATION)\b/i.test(normalizedInput) ||
    /<\?\s*xml-stylesheet\b/i.test(normalizedInput)
  ) {
    return {
      ok: false,
      errors: [
        'XML DOCTYPE, ENTITY declarations, and stylesheet processing instructions are not permitted for security reasons.',
      ],
    };
  }

  if (typeof DOMParser === 'undefined') {
    return {
      ok: false,
      errors: ['DOMParser is unavailable in the current runtime environment.'],
    };
  }

  const doc = new DOMParser().parseFromString(normalizedInput, 'image/svg+xml');
  const root = doc.documentElement;

  if (
    !root ||
    doc.getElementsByTagName('parsererror').length > 0 ||
    root.localName.toLowerCase() === 'parsererror'
  ) {
    return {
      ok: false,
      errors: ['Invalid SVG markup: failed strict XML parsing.'],
    };
  }

  if (root.localName !== 'svg') {
    return {
      ok: false,
      errors: [`Invalid root element <${root.tagName}>. Root element must be <svg>.`],
    };
  }

  const expectedRootNs = root.namespaceURI;
  if (expectedRootNs !== SVG_NAMESPACE && expectedRootNs !== null) {
    return {
      ok: false,
      errors: [`Invalid SVG root namespace '${expectedRootNs}'. Expected '${SVG_NAMESPACE}'.`],
    };
  }

  const parsedViewBox = parseRootViewBox(root, errors);
  if (!parsedViewBox || errors.length > 0) {
    return { ok: false, errors };
  }

  // Extract safe inherited presentation defaults on root <svg> (if any)
  const rootPresentationAttrs: Record<string, string> = {};
  let pendingRootStyle: string | null = null;
  let rootHidden = false;

  for (let i = 0; i < root.attributes.length; i += 1) {
    const inspected = validateAndCheckAttributeSafety(root.attributes[i], 'svg', true, errors);
    if (inspected.kind === 'style') {
      pendingRootStyle = inspected.value;
    } else if (inspected.kind === 'attr') {
      const validated = validateAttributeValueForTag('g', inspected.name, inspected.value);
      if (!validated.ok) {
        errors.push(validated.error);
      } else {
        rootPresentationAttrs[inspected.name] = validated.value;
      }
    }
  }

  if (pendingRootStyle !== null) {
    const styleResult = parseAndValidateInlineStyle(
      pendingRootStyle,
      'svg',
      rootPresentationAttrs,
      errors
    );
    rootHidden = styleResult.hiddenByDisplay;
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  let totalNodeCount = 0;
  let maxObservedDepth = 0;

  const visitElement = (
    el: Element,
    depth: number,
    parentTag: AllowedSvgTag | 'svg'
  ): SafeSvgNode | null => {
    if (errors.length >= 10) return null;

    const tagLower = el.localName.toLowerCase();

    // Safely discard editor/semantic metadata tags after verifying zero embedded dangerous tags
    if (el.namespaceURI === expectedRootNs && STRIPPED_METADATA_TAGS.has(tagLower)) {
      checkStrippedMetadataSubtree(el, errors);
      return null;
    }

    // Strict namespace matching for all rendered SVG geometry elements
    if (el.namespaceURI !== expectedRootNs) {
      errors.push(
        `Disallowed non-SVG namespace '${el.namespaceURI ?? 'none'}' on element <${el.tagName}>.`
      );
      return null;
    }

    if (!ALLOWED_TAG_SET.has(tagLower)) {
      errors.push(describeDisallowedTag(tagLower));
      return null;
    }

    const safeTag = tagLower as AllowedSvgTag;

    if (safeTag === 'tspan' && parentTag !== 'text' && parentTag !== 'tspan') {
      errors.push('<tspan> elements may only appear inside <text> or <tspan> elements.');
      return null;
    }

    totalNodeCount += 1;
    if (totalNodeCount > CUSTOMIZATION_LIMITS.MAX_SVG_NODE_COUNT) {
      errors.push(
        `SVG exceeds maximum allowed element count of ${CUSTOMIZATION_LIMITS.MAX_SVG_NODE_COUNT}.`
      );
      return null;
    }

    if (depth > CUSTOMIZATION_LIMITS.MAX_SVG_NESTING_DEPTH) {
      errors.push(
        `SVG exceeds maximum allowed nesting depth of ${CUSTOMIZATION_LIMITS.MAX_SVG_NESTING_DEPTH}.`
      );
      return null;
    }

    if (depth > maxObservedDepth) {
      maxObservedDepth = depth;
    }

    const attrs: Record<string, string> = {};
    let inlineStyle: string | null = null;

    for (let i = 0; i < el.attributes.length; i += 1) {
      const inspected = validateAndCheckAttributeSafety(el.attributes[i], safeTag, false, errors);
      if (inspected.kind === 'style') {
        inlineStyle = inspected.value;
      } else if (inspected.kind === 'attr') {
        const validated = validateAttributeValueForTag(safeTag, inspected.name, inspected.value);
        if (!validated.ok) {
          errors.push(validated.error);
        } else {
          attrs[inspected.name] = validated.value;
        }
      }
    }

    let isHidden = false;
    if (inlineStyle !== null) {
      const styleRes = parseAndValidateInlineStyle(inlineStyle, safeTag, attrs, errors);
      isHidden = styleRes.hiddenByDisplay;
    }

    const textSegments: Array<{ kind: 'text'; value: string } | { kind: 'node'; node: SafeSvgNode }> =
      [];
    let hasElementChildren = false;
    let totalTextChars = 0;

    for (let i = 0; i < el.childNodes.length; i += 1) {
      const child = el.childNodes[i];
      if (child.nodeType === 1) {
        // Element node
        const safeChild = visitElement(child as Element, depth + 1, safeTag);
        if (safeChild) {
          hasElementChildren = true;
          textSegments.push({ kind: 'node', node: safeChild });
        }
      } else if (child.nodeType === 3 || child.nodeType === 4) {
        // Text / CDATA node
        const rawText = child.textContent ?? '';
        if (safeTag === 'text' || safeTag === 'tspan') {
          if (CONTROL_CHAR_REGEX.test(rawText)) {
            errors.push(`Disallowed control characters in <${safeTag}> text content.`);
          } else {
            const collapsed = rawText.replace(/\s+/g, ' ');
            if (collapsed.trim().length > 0) {
              totalTextChars += collapsed.trim().length;
              textSegments.push({ kind: 'text', value: collapsed });
            }
          }
        } else if (rawText.trim().length > 0) {
          errors.push(`Unexpected text content inside non-text element <${safeTag}>.`);
        }
      }
    }

    if ((safeTag === 'text' || safeTag === 'tspan') && totalTextChars > CUSTOMIZATION_LIMITS.MAX_SVG_TEXT_NODE_LENGTH) {
      errors.push(
        `<${safeTag}> text exceeds maximum length of ${CUSTOMIZATION_LIMITS.MAX_SVG_TEXT_NODE_LENGTH} characters.`
      );
    }

    if (isHidden) {
      return null;
    }

    const node: SafeSvgNode = { tag: safeTag, attrs };
    if (safeTag === 'text' || safeTag === 'tspan') {
      if (!hasElementChildren) {
        const joined = textSegments
          .map((seg) => (seg.kind === 'text' ? seg.value : ''))
          .join('')
          .trim();
        if (joined.length > 0) {
          node.text = joined;
        }
      } else {
        const children: SafeSvgNode[] = [];
        for (const seg of textSegments) {
          if (seg.kind === 'node') {
            children.push(seg.node);
          } else {
            const trimmedSeg = seg.value.trim();
            if (trimmedSeg.length > 0) {
              totalNodeCount += 1;
              if (
                totalNodeCount > CUSTOMIZATION_LIMITS.MAX_SVG_NODE_COUNT ||
                depth + 1 > CUSTOMIZATION_LIMITS.MAX_SVG_NESTING_DEPTH
              ) {
                errors.push('SVG exceeds element count or nesting depth limits inside <text>.');
                return null;
              }
              children.push({ tag: 'tspan', attrs: {}, text: seg.value });
            }
          }
        }
        if (children.length > 0) {
          node.children = children;
        }
      }
    } else {
      const children = textSegments
        .filter((seg): seg is { kind: 'node'; node: SafeSvgNode } => seg.kind === 'node')
        .map((seg) => seg.node);
      if (children.length > 0) {
        node.children = children;
      }
    }

    return node;
  };

  let sanitizedChildren: SafeSvgNode[] = [];
  if (!rootHidden) {
    for (let i = 0; i < root.childNodes.length; i += 1) {
      const child = root.childNodes[i];
      if (child.nodeType === 1) {
        const safeChild = visitElement(child as Element, 1, 'svg');
        if (safeChild) {
          sanitizedChildren.push(safeChild);
        }
      } else if ((child.nodeType === 3 || child.nodeType === 4) && (child.textContent ?? '').trim().length > 0) {
        errors.push('Unexpected text content directly under root <svg>.');
      }
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  if (sanitizedChildren.length === 0) {
    return {
      ok: false,
      errors: ['SVG contains no visible geometry elements to render.'],
    };
  }

  // Wrap children in a presentation <g> if root <svg> carried explicit fill/stroke/opacity attrs
  if (Object.keys(rootPresentationAttrs).length > 0) {
    if (
      totalNodeCount + 1 > CUSTOMIZATION_LIMITS.MAX_SVG_NODE_COUNT ||
      maxObservedDepth + 1 > CUSTOMIZATION_LIMITS.MAX_SVG_NESTING_DEPTH
    ) {
      return {
        ok: false,
        errors: ['SVG exceeds element count or nesting limits after root presentation wrapping.'],
      };
    }
    sanitizedChildren = [
      {
        tag: 'g',
        attrs: rootPresentationAttrs,
        children: sanitizedChildren,
      },
    ];
    totalNodeCount += 1;
    maxObservedDepth += 1;
  }

  const serializedBytes = measureUtf8Bytes(JSON.stringify(sanitizedChildren));
  if (serializedBytes > CUSTOMIZATION_LIMITS.MAX_LAYER_AST_JSON_BYTES) {
    return {
      ok: false,
      errors: [
        `Sanitized SVG AST (${Math.ceil(serializedBytes / 1024)} KB) exceeds the ${CUSTOMIZATION_LIMITS.MAX_LAYER_AST_JSON_BYTES / 1024} KB per-layer storage limit.`,
      ],
    };
  }

  const sourceViewBox = `${formatNumeric(parsedViewBox.minX)} ${formatNumeric(parsedViewBox.minY)} ${formatNumeric(parsedViewBox.width)} ${formatNumeric(parsedViewBox.height)}`;
  const isStandardRigViewBox =
    Math.abs(parsedViewBox.minX) < 0.01 &&
    Math.abs(parsedViewBox.minY) < 0.01 &&
    Math.abs(parsedViewBox.width - CHARACTER_BASE_WIDTH) < 0.01 &&
    Math.abs(parsedViewBox.height - CHARACTER_BASE_HEIGHT) < 0.01;

  return {
    ok: true,
    value: {
      sourceViewBox,
      parsedViewBox,
      suggestedFitMode: isStandardRigViewBox ? 'preserve-200x250' : 'fit-source-viewbox',
      nodes: sanitizedChildren,
      nodeCount: totalNodeCount,
      maxDepth: maxObservedDepth,
      byteSize,
    },
  };
}

/**
 * Fully re-validates an untrusted SafeSvgNode[] AST tree (used both during storage hydration
 * and before runtime React rendering to ensure tampered storage values cannot execute).
 */
export function validateSafeSvgNodes(
  rawNodes: unknown
): { ok: true; nodes: SafeSvgNode[] } | { ok: false; error: string } {
  if (!Array.isArray(rawNodes) || rawNodes.length === 0) {
    return { ok: false, error: 'Custom SVG AST must be a non-empty array of nodes.' };
  }

  let nodeCount = 0;

  const validateNode = (
    rawNode: unknown,
    depth: number,
    parentTag: AllowedSvgTag | 'svg'
  ): SafeSvgNode | null => {
    if (!isPlainObject(rawNode)) {
      return null;
    }

    for (const key of Object.keys(rawNode)) {
      if (FORBIDDEN_KEYS.has(key) || (key !== 'tag' && key !== 'attrs' && key !== 'text' && key !== 'children')) {
        return null;
      }
    }

    const rawTag = rawNode.tag;
    if (typeof rawTag !== 'string' || !ALLOWED_TAG_SET.has(rawTag)) {
      return null;
    }
    const safeTag = rawTag as AllowedSvgTag;

    if (safeTag === 'tspan' && parentTag !== 'text' && parentTag !== 'tspan') {
      return null;
    }

    nodeCount += 1;
    if (
      nodeCount > CUSTOMIZATION_LIMITS.MAX_SVG_NODE_COUNT ||
      depth > CUSTOMIZATION_LIMITS.MAX_SVG_NESTING_DEPTH
    ) {
      return null;
    }

    if (!isPlainObject(rawNode.attrs)) {
      return null;
    }

    const validatedAttrs: Record<string, string> = {};
    for (const [attrKey, attrVal] of Object.entries(rawNode.attrs)) {
      if (FORBIDDEN_KEYS.has(attrKey) || typeof attrVal !== 'string') {
        return null;
      }
      const res = validateAttributeValueForTag(safeTag, attrKey, attrVal);
      if (!res.ok) {
        return null;
      }
      validatedAttrs[attrKey] = res.value;
    }

    let safeText: string | undefined;
    if (rawNode.text !== undefined) {
      if (
        (safeTag !== 'text' && safeTag !== 'tspan') ||
        typeof rawNode.text !== 'string' ||
        rawNode.text.length > CUSTOMIZATION_LIMITS.MAX_SVG_TEXT_NODE_LENGTH ||
        CONTROL_CHAR_REGEX.test(rawNode.text)
      ) {
        return null;
      }
      safeText = rawNode.text;
    }

    let safeChildren: SafeSvgNode[] | undefined;
    if (rawNode.children !== undefined) {
      if (!Array.isArray(rawNode.children)) {
        return null;
      }
      safeChildren = [];
      for (const child of rawNode.children) {
        const validatedChild = validateNode(child, depth + 1, safeTag);
        if (!validatedChild) {
          return null;
        }
        safeChildren.push(validatedChild);
      }
    }

    const cleanNode: SafeSvgNode = { tag: safeTag, attrs: validatedAttrs };
    if (safeText !== undefined) cleanNode.text = safeText;
    if (safeChildren && safeChildren.length > 0) cleanNode.children = safeChildren;
    return cleanNode;
  };

  const validatedNodes: SafeSvgNode[] = [];
  for (const item of rawNodes) {
    const clean = validateNode(item, 1, 'svg');
    if (!clean) {
      return { ok: false, error: 'Stored custom SVG AST failed integrity or security validation.' };
    }
    validatedNodes.push(clean);
  }

  return { ok: true, nodes: validatedNodes };
}

/**
 * Validates and clamps a LayerPlacementOffset structure.
 */
export function sanitizeLayerPlacement(rawPlacement: unknown): LayerPlacementOffset {
  if (!isPlainObject(rawPlacement)) {
    return { ...DEFAULT_LAYER_PLACEMENT };
  }

  const offsetX =
    typeof rawPlacement.offsetX === 'number'
      ? clampFinite(rawPlacement.offsetX, PLACEMENT_BOUNDS.MIN_OFFSET_X, PLACEMENT_BOUNDS.MAX_OFFSET_X)
      : 0;
  const offsetY =
    typeof rawPlacement.offsetY === 'number'
      ? clampFinite(rawPlacement.offsetY, PLACEMENT_BOUNDS.MIN_OFFSET_Y, PLACEMENT_BOUNDS.MAX_OFFSET_Y)
      : 0;
  const scale =
    typeof rawPlacement.scale === 'number'
      ? clampFinite(rawPlacement.scale, PLACEMENT_BOUNDS.MIN_SCALE, PLACEMENT_BOUNDS.MAX_SCALE)
      : 1;
  const fitMode =
    rawPlacement.fitMode === 'fit-source-viewbox'
      ? 'fit-source-viewbox'
      : 'preserve-200x250';

  return {
    offsetX: Math.round(offsetX * 100) / 100,
    offsetY: Math.round(offsetY * 100) / 100,
    scale: Math.round(scale * 1000) / 1000,
    fitMode,
  };
}

/**
 * Validates a complete persisted custom layer record read from chrome.storage.local,
 * performing full AST re-validation and byte-size checks.
 */
export function validateStoredCustomLayerAsset(
  rawAsset: unknown,
  expectedLayerId?: CharacterLayerId
): StoredCustomLayerAsset | null {
  if (!isPlainObject(rawAsset)) {
    return null;
  }

  const { layerId, fileName, byteSize, sourceViewBox, parsedViewBox, nodes, placement, updatedAt } =
    rawAsset;

  if (typeof layerId !== 'string' || !CANONICAL_LAYER_SET.has(layerId)) {
    return null;
  }
  if (expectedLayerId && layerId !== expectedLayerId) {
    return null;
  }

  if (
    typeof fileName !== 'string' ||
    fileName.trim().length === 0 ||
    fileName.length > CUSTOMIZATION_LIMITS.MAX_FILENAME_LENGTH ||
    CONTROL_CHAR_REGEX.test(fileName)
  ) {
    return null;
  }

  if (
    typeof byteSize !== 'number' ||
    !Number.isFinite(byteSize) ||
    byteSize <= 0 ||
    byteSize > CUSTOMIZATION_LIMITS.MAX_SVG_FILE_BYTES
  ) {
    return null;
  }

  if (typeof sourceViewBox !== 'string' || sourceViewBox.length > 128) {
    return null;
  }

  if (!isPlainObject(parsedViewBox)) {
    return null;
  }
  const { minX, minY, width, height } = parsedViewBox;
  if (
    typeof minX !== 'number' ||
    typeof minY !== 'number' ||
    typeof width !== 'number' ||
    typeof height !== 'number' ||
    !Number.isFinite(minX) ||
    !Number.isFinite(minY) ||
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    Math.abs(minX) > CUSTOMIZATION_LIMITS.MAX_SVG_NUMERIC_ABS ||
    Math.abs(minY) > CUSTOMIZATION_LIMITS.MAX_SVG_NUMERIC_ABS ||
    width <= 0 ||
    height <= 0 ||
    width > CUSTOMIZATION_LIMITS.MAX_SVG_NUMERIC_ABS ||
    height > CUSTOMIZATION_LIMITS.MAX_SVG_NUMERIC_ABS
  ) {
    return null;
  }

  const astCheck = validateSafeSvgNodes(nodes);
  if (!astCheck.ok) {
    return null;
  }

  const serializedBytes = measureUtf8Bytes(JSON.stringify(astCheck.nodes));
  if (serializedBytes > CUSTOMIZATION_LIMITS.MAX_LAYER_AST_JSON_BYTES) {
    return null;
  }

  const sanitizedPlacement = sanitizeLayerPlacement(placement);
  const safeUpdatedAt =
    typeof updatedAt === 'number' && Number.isFinite(updatedAt) && updatedAt > 0
      ? updatedAt
      : Date.now();

  return {
    layerId: layerId as CharacterLayerId,
    fileName: fileName.trim(),
    byteSize,
    sourceViewBox,
    parsedViewBox: { minX, minY, width, height },
    nodes: astCheck.nodes,
    placement: sanitizedPlacement,
    updatedAt: safeUpdatedAt,
  };
}

/**
 * Computes the composed SVG `transform` attribute aligning an imported SVG's coordinates
 * and user placement adjustments around the layer's manifest anchor inside `200×250`.
 */
export function computeLayerPlacementTransform(
  parsedViewBox: SvgViewBox,
  placement: LayerPlacementOffset,
  anchor: CharacterAnchorCoordinates
): string | undefined {
  const parts: string[] = [];

  const hasUserAdjustment =
    Math.abs(placement.offsetX) > 0.001 ||
    Math.abs(placement.offsetY) > 0.001 ||
    Math.abs(placement.scale - 1) > 0.001;

  if (hasUserAdjustment) {
    parts.push(
      `translate(${formatNumeric(anchor.x + placement.offsetX)} ${formatNumeric(anchor.y + placement.offsetY)})`
    );
    if (Math.abs(placement.scale - 1) > 0.001) {
      parts.push(`scale(${formatNumeric(placement.scale)})`);
    }
    parts.push(`translate(${formatNumeric(-anchor.x)} ${formatNumeric(-anchor.y)})`);
  }

  if (placement.fitMode === 'fit-source-viewbox') {
    const isAlreadyStandard =
      Math.abs(parsedViewBox.minX) < 0.01 &&
      Math.abs(parsedViewBox.minY) < 0.01 &&
      Math.abs(parsedViewBox.width - CHARACTER_BASE_WIDTH) < 0.01 &&
      Math.abs(parsedViewBox.height - CHARACTER_BASE_HEIGHT) < 0.01;

    if (!isAlreadyStandard) {
      const fitScale = Math.min(
        CHARACTER_BASE_WIDTH / parsedViewBox.width,
        CHARACTER_BASE_HEIGHT / parsedViewBox.height
      );
      const tx =
        (CHARACTER_BASE_WIDTH - parsedViewBox.width * fitScale) / 2 -
        parsedViewBox.minX * fitScale;
      const ty =
        (CHARACTER_BASE_HEIGHT - parsedViewBox.height * fitScale) / 2 -
        parsedViewBox.minY * fitScale;

      parts.push(`translate(${formatNumeric(tx)} ${formatNumeric(ty)})`);
      parts.push(`scale(${formatNumeric(fitScale)})`);
    }
  }

  return parts.length > 0 ? parts.join(' ') : undefined;
}
