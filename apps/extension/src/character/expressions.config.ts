import type { CharacterExpression, CharacterExpressionConfig } from '@webmate/shared';

/**
 * Complete expression configurations for the 8 canonical WebMate companion expressions.
 * Maps high-level expressions to feature variants, transform offsets, blush opacity, and emotional FX.
 */
export const EXPRESSION_CONFIGS: Record<CharacterExpression, CharacterExpressionConfig> = {
  normal: {
    id: 'normal',
    label: 'Normal',
    eyebrowsVariant: 'eyebrows_relaxed',
    eyesVariant: 'eyes_centered',
    mouthVariant: 'mouth_smirk',
    blushOpacity: 0.0,
    fxVariant: null,
    headTiltDeg: 0,
    description: 'Natural relaxed eyebrows with gentle arch, centered round pupils, and characteristic subtle smile.',
  },
  happy: {
    id: 'happy',
    label: 'Happy',
    eyebrowsVariant: 'eyebrows_raised_arch',
    eyesVariant: 'eyes_smiling_crescents',
    mouthVariant: 'mouth_open_grin',
    blushOpacity: 0.85,
    fxVariant: 'fx_sparkles',
    headTiltDeg: 2,
    description: 'High raised eyebrows, smiling crescent eyes, wide open smile with visible tongue, and rosy cheeks.',
  },
  thinking: {
    id: 'thinking',
    label: 'Thinking',
    eyebrowsVariant: 'eyebrows_asymmetric_furrow',
    eyesVariant: 'eyes_glance_up_right',
    mouthVariant: 'mouth_pursed_wavy',
    blushOpacity: 0.0,
    fxVariant: 'fx_question_mark',
    headTiltDeg: 8,
    description: 'Left eyebrow arched high, right furrowed downward, eyes glanced up-right, and pursed wavy mouth.',
  },
  surprised: {
    id: 'surprised',
    label: 'Surprised',
    eyebrowsVariant: 'eyebrows_high_above_hairline',
    eyesVariant: 'eyes_contracted_dots',
    mouthVariant: 'mouth_vertical_oval',
    blushOpacity: 0.0,
    fxVariant: 'fx_sweat_pop',
    headTiltDeg: 0,
    description: 'Eyebrows shooting past hairline, contracted small pupils surrounded by wide sclera, and vertical oval mouth.',
  },
  confused: {
    id: 'confused',
    label: 'Confused',
    eyebrowsVariant: 'eyebrows_wavy_confused',
    eyesVariant: 'eyes_squint_asymmetric',
    mouthVariant: 'mouth_lateral_wavy',
    blushOpacity: 0.0,
    fxVariant: 'fx_sweat_drop',
    headTiltDeg: 15,
    description: 'Asymmetric wavy eyebrows, head tilted 15 degrees, lateral wavy mouth, and blue temple sweat drop.',
  },
  explaining: {
    id: 'explaining',
    label: 'Explaining',
    eyebrowsVariant: 'eyebrows_focused_inward',
    eyesVariant: 'eyes_direct_forward',
    mouthVariant: 'mouth_speaking_open',
    blushOpacity: 0.0,
    fxVariant: null,
    headTiltDeg: -4,
    description: 'Confident inward-slanted eyebrows, direct forward gaze, and open speaking mouth gesture.',
  },
  talking: {
    id: 'talking',
    label: 'Talking',
    eyebrowsVariant: 'eyebrows_expressive_pulse',
    eyesVariant: 'eyes_centered',
    mouthVariant: 'mouth_stream_oscillation',
    blushOpacity: 0.0,
    fxVariant: null,
    headTiltDeg: 0,
    description: 'Dynamic mouth shape cycling (closed, half, open) timed to text streaming with gentle eyebrow emphasis.',
  },
  sleeping: {
    id: 'sleeping',
    label: 'Sleeping',
    eyebrowsVariant: 'eyebrows_relaxed_droop',
    eyesVariant: 'eyes_closed_slits',
    mouthVariant: 'mouth_droop_relaxed',
    blushOpacity: 0.15,
    fxVariant: 'fx_snot_bubble_zzz',
    headTiltDeg: -8,
    description: 'Flat curved eye slits, relaxed drooping mouth, expanding/contracting snot bubble, and floating Zzz particles.',
  },
};

/**
 * Safe accessor for expression configurations with fallback to 'normal'.
 */
export function getExpressionConfig(expression?: CharacterExpression): CharacterExpressionConfig {
  if (expression && EXPRESSION_CONFIGS[expression]) {
    return EXPRESSION_CONFIGS[expression];
  }
  return EXPRESSION_CONFIGS.normal;
}

