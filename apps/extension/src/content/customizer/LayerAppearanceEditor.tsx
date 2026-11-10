import React from 'react';
import type { CharacterExpression } from '@webmate/shared';
import {
  APPAREL_COLOR_SWATCHES,
  ARM_SLEEVE_OPTIONS,
  BLUSH_COLOR_SWATCHES,
  BLUSH_STYLE_OPTIONS,
  BODY_STYLE_OPTIONS,
  BOTTOM_COLOR_SWATCHES,
  BOTTOM_STYLE_OPTIONS,
  BuiltInThumbnail,
  DEFAULT_AVATAR_CUSTOMIZATION,
  EYEBROW_COLOR_SWATCHES,
  EYEBROW_STYLE_OPTIONS,
  EYE_COLOR_SWATCHES,
  EYE_STYLE_OPTIONS,
  FX_COLOR_SWATCHES,
  FX_STYLE_OPTIONS,
  HAIR_COLOR_SWATCHES,
  HAIR_STYLE_OPTIONS,
  HAND_STYLE_OPTIONS,
  HEAD_STYLE_OPTIONS,
  isSectionCustomized,
  MOUTH_STYLE_OPTIONS,
  SHADOW_STYLE_OPTIONS,
  SHOE_COLOR_SWATCHES,
  SHOE_STYLE_OPTIONS,
  SKIN_TONE_SWATCHES,
  TOP_STYLE_OPTIONS,
  type AvatarCustomizationConfig,
  type CustomizationSectionDescriptor,
  type CustomizationSectionId,
  type LimbEditTarget,
  type StyleOptionItem,
  type SwatchOption,
  type ThumbnailSubject,
} from '../../character/customization';

export interface LayerAppearanceEditorProps {
  section: CustomizationSectionDescriptor;
  draftConfig: AvatarCustomizationConfig;
  armEditTarget: LimbEditTarget;
  shoeEditTarget: LimbEditTarget;
  previewExpression: CharacterExpression;
  onChangePreviewExpression: (expression: CharacterExpression) => void;
  onChangeArmEditTarget: (target: LimbEditTarget) => void;
  onChangeShoeEditTarget: (target: LimbEditTarget) => void;
  onUpdateDraft: (patch: Partial<AvatarCustomizationConfig>) => void;
  onResetSection: (sectionId: CustomizationSectionId, limbTarget?: LimbEditTarget) => void;
}

export const LayerAppearanceEditor: React.FC<LayerAppearanceEditorProps> = ({
  section,
  draftConfig,
  armEditTarget,
  shoeEditTarget,
  previewExpression,
  onChangePreviewExpression,
  onChangeArmEditTarget,
  onChangeShoeEditTarget,
  onUpdateDraft,
  onResetSection,
}) => {
  const stopHostKeyLeak = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  const activeLimbTarget: LimbEditTarget | undefined =
    section.id === 'arms'
      ? armEditTarget
      : section.id === 'shoes'
        ? shoeEditTarget
        : undefined;

  const canResetSection = (() => {
    const d = DEFAULT_AVATAR_CUSTOMIZATION;
    if (section.id === 'arms' && armEditTarget !== 'both') {
      return armEditTarget === 'left'
        ? draftConfig.armLeftStyle !== d.armLeftStyle ||
            draftConfig.handLeftStyle !== d.handLeftStyle
        : draftConfig.armRightStyle !== d.armRightStyle ||
            draftConfig.handRightStyle !== d.handRightStyle;
    }
    if (section.id === 'shoes' && shoeEditTarget !== 'both') {
      return shoeEditTarget === 'left'
        ? draftConfig.shoeLeftStyle !== d.shoeLeftStyle ||
            draftConfig.shoeLeftColor !== d.shoeLeftColor
        : draftConfig.shoeRightStyle !== d.shoeRightStyle ||
            draftConfig.shoeRightColor !== d.shoeRightColor;
    }
    return isSectionCustomized(draftConfig, section.id);
  })();

  const renderSwatchStrip = <Id extends string>(
    heading: string,
    swatches: readonly SwatchOption<Id>[],
    selectedId: Id | null,
    onSelect: (id: Id) => void
  ) => {
    const activeSwatch = swatches.find((item) => item.id === selectedId);
    return (
      <div className="webmate-section-block">
        <div className="webmate-section-header-row">
          <span className="webmate-section-heading">{heading}</span>
          {activeSwatch && (
            <span className="webmate-swatch-active-name">{activeSwatch.label}</span>
          )}
        </div>
        <div className="webmate-swatch-row" role="group" aria-label={heading}>
          {swatches.map((swatch) => {
            const isSelected = swatch.id === selectedId;
            return (
              <button
                key={swatch.id}
                type="button"
                aria-label={`${swatch.label}${isSelected ? ' (selected)' : ''}`}
                aria-pressed={isSelected}
                title={swatch.label}
                className={`webmate-swatch-btn ${isSelected ? 'is-selected' : ''} ${
                  swatch.isAuto ? 'is-auto' : ''
                }`}
                onClick={() => onSelect(swatch.id)}
                onKeyDown={stopHostKeyLeak}
              >
                <span
                  className="webmate-swatch-chip"
                  style={{ backgroundColor: swatch.swatchHex }}
                >
                  {swatch.isAuto && <span className="webmate-swatch-auto-tag">A</span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCardGrid = <Id extends string>(
    heading: string,
    options: readonly StyleOptionItem<Id>[],
    selectedId: Id | null,
    getSubject: (id: Id) => ThumbnailSubject,
    onSelect: (id: Id) => void
  ) => (
    <div className="webmate-section-block">
      <div className="webmate-section-header-row">
        <span className="webmate-section-heading">{heading}</span>
      </div>
      <div className="webmate-studio-grid" role="group" aria-label={heading}>
        {options.map((option) => {
          const isSelected = option.id === selectedId;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              className={`webmate-studio-card ${isSelected ? 'is-selected' : ''}`}
              onClick={() => onSelect(option.id)}
              onKeyDown={stopHostKeyLeak}
            >
              {isSelected && (
                <span className="webmate-check-pill" aria-hidden="true">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2.5 6.2L5 8.7L9.5 3.6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
              <div className="webmate-thumb-stage">
                <BuiltInThumbnail subject={getSubject(option.id)} config={draftConfig} />
              </div>
              <div className="webmate-studio-card-footer">
                <span className="webmate-studio-card-label">{option.label}</span>
                {option.badge && (
                  <span className="webmate-studio-card-badge">{option.badge}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderLimbTargetToggle = (
    target: LimbEditTarget,
    onChange: (next: LimbEditTarget) => void,
    differs: boolean,
    label: string
  ) => (
    <div className="webmate-limb-bar">
      <div className="webmate-field-row">
        <span className="webmate-field-label">{label}</span>
        <div className="webmate-segmented" role="group" aria-label={label}>
          {(['both', 'left', 'right'] as const).map((sideOption) => (
            <button
              key={sideOption}
              type="button"
              className={`webmate-segment-btn ${target === sideOption ? 'is-selected' : ''}`}
              aria-pressed={target === sideOption}
              onClick={() => onChange(sideOption)}
              onKeyDown={stopHostKeyLeak}
            >
              {sideOption === 'both'
                ? 'Both'
                : sideOption === 'left'
                  ? 'Left'
                  : 'Right'}
            </button>
          ))}
        </div>
      </div>
      {target === 'both' && differs && (
        <p className="webmate-limb-diff-hint">
          Left &amp; Right currently differ — pick an option below to match both sides.
        </p>
      )}
    </div>
  );

  const renderSectionControls = () => {
    switch (section.id) {
      case 'head-face':
        return (
          <>
            {renderSwatchStrip(
              'Skin Tone',
              SKIN_TONE_SWATCHES,
              draftConfig.skinTone,
              (skinTone) => onUpdateDraft({ skinTone })
            )}
            {renderCardGrid(
              'Head Shape & Eyewear',
              HEAD_STYLE_OPTIONS,
              draftConfig.headStyle,
              (headStyle) => ({ kind: 'head', headStyle }),
              (headStyle) => onUpdateDraft({ headStyle })
            )}
          </>
        );

      case 'hair':
        return (
          <>
            {renderSwatchStrip(
              'Hair Color',
              HAIR_COLOR_SWATCHES,
              draftConfig.hairColor,
              (hairColor) => onUpdateDraft({ hairColor })
            )}
            {renderCardGrid(
              'Hairstyles & Caps',
              HAIR_STYLE_OPTIONS,
              draftConfig.hairStyle,
              (hairStyle) => ({ kind: 'hair', hairStyle }),
              (hairStyle) => onUpdateDraft({ hairStyle })
            )}
          </>
        );

      case 'eyes':
        return (
          <>
            {renderSwatchStrip(
              'Iris & Pupil Color',
              EYE_COLOR_SWATCHES,
              draftConfig.eyeColor,
              (eyeColor) => onUpdateDraft({ eyeColor })
            )}
            {renderCardGrid(
              'Eye Style',
              EYE_STYLE_OPTIONS,
              draftConfig.eyeStyle,
              (eyeStyle) => ({ kind: 'eyes', eyeStyle }),
              (eyeStyle) => onUpdateDraft({ eyeStyle })
            )}
          </>
        );

      case 'eyebrows':
        return (
          <>
            {renderSwatchStrip(
              'Eyebrow Color',
              EYEBROW_COLOR_SWATCHES,
              draftConfig.eyebrowColor,
              (eyebrowColor) => onUpdateDraft({ eyebrowColor })
            )}
            {renderCardGrid(
              'Eyebrow Shape',
              EYEBROW_STYLE_OPTIONS,
              draftConfig.eyebrowStyle,
              (eyebrowStyle) => ({ kind: 'eyebrows', eyebrowStyle }),
              (eyebrowStyle) => onUpdateDraft({ eyebrowStyle })
            )}
          </>
        );

      case 'mouth':
        return renderCardGrid(
          'Resting Smile & Mouth Style',
          MOUTH_STYLE_OPTIONS,
          draftConfig.mouthStyle,
          (mouthStyle) => ({ kind: 'mouth', mouthStyle }),
          (mouthStyle) => onUpdateDraft({ mouthStyle })
        );

      case 'blush':
        return (
          <>
            {renderCardGrid(
              'Cheek Blush Style',
              BLUSH_STYLE_OPTIONS,
              draftConfig.blushStyle,
              (blushStyle) => ({ kind: 'blush', blushStyle }),
              (blushStyle) => onUpdateDraft({ blushStyle })
            )}
            {draftConfig.blushStyle !== 'none' &&
              renderSwatchStrip(
                'Blush Tint',
                BLUSH_COLOR_SWATCHES,
                draftConfig.blushColor,
                (blushColor) => onUpdateDraft({ blushColor })
              )}
          </>
        );

      case 'body':
        return renderCardGrid(
          'Torso Build & Fit',
          BODY_STYLE_OPTIONS,
          draftConfig.bodyStyle,
          (bodyStyle) => ({ kind: 'body', bodyStyle }),
          (bodyStyle) => onUpdateDraft({ bodyStyle })
        );

      case 'clothing-top':
        return (
          <>
            {renderSwatchStrip(
              'Top Color',
              APPAREL_COLOR_SWATCHES,
              draftConfig.topColor,
              (topColor) => onUpdateDraft({ topColor })
            )}
            {renderCardGrid(
              'Shirts, Hoodies & Jackets',
              TOP_STYLE_OPTIONS,
              draftConfig.topStyle,
              (topStyle) => ({ kind: 'top', topStyle }),
              (topStyle) => onUpdateDraft({ topStyle })
            )}
          </>
        );

      case 'clothing-bottom':
        return (
          <>
            {renderSwatchStrip(
              'Bottoms Color',
              BOTTOM_COLOR_SWATCHES,
              draftConfig.bottomColor,
              (bottomColor) => onUpdateDraft({ bottomColor })
            )}
            {renderCardGrid(
              'Shorts & Pants',
              BOTTOM_STYLE_OPTIONS,
              draftConfig.bottomStyle,
              (bottomStyle) => ({ kind: 'bottom', bottomStyle }),
              (bottomStyle) => onUpdateDraft({ bottomStyle })
            )}
          </>
        );

      case 'arms': {
        const armsDiffer =
          draftConfig.armLeftStyle !== draftConfig.armRightStyle ||
          draftConfig.handLeftStyle !== draftConfig.handRightStyle;
        const selectedSleeve =
          armEditTarget === 'left'
            ? draftConfig.armLeftStyle
            : armEditTarget === 'right'
              ? draftConfig.armRightStyle
              : draftConfig.armLeftStyle === draftConfig.armRightStyle
                ? draftConfig.armLeftStyle
                : null;
        const selectedHand =
          armEditTarget === 'left'
            ? draftConfig.handLeftStyle
            : armEditTarget === 'right'
              ? draftConfig.handRightStyle
              : draftConfig.handLeftStyle === draftConfig.handRightStyle
                ? draftConfig.handLeftStyle
                : null;

        return (
          <>
            {renderLimbTargetToggle(
              armEditTarget,
              onChangeArmEditTarget,
              armsDiffer,
              'Edit Side'
            )}
            {renderCardGrid(
              'Sleeves & Wrist Accessories',
              ARM_SLEEVE_OPTIONS,
              selectedSleeve,
              (armStyle) => ({ kind: 'arm-sleeve', armStyle }),
              (armStyle) => {
                if (armEditTarget === 'left') {
                  onUpdateDraft({ armLeftStyle: armStyle });
                } else if (armEditTarget === 'right') {
                  onUpdateDraft({ armRightStyle: armStyle });
                } else {
                  onUpdateDraft({ armLeftStyle: armStyle, armRightStyle: armStyle });
                }
              }
            )}
            {renderCardGrid(
              'Hand Pose Shape',
              HAND_STYLE_OPTIONS,
              selectedHand,
              (handStyle) => ({ kind: 'hand', handStyle }),
              (handStyle) => {
                if (armEditTarget === 'left') {
                  onUpdateDraft({ handLeftStyle: handStyle });
                } else if (armEditTarget === 'right') {
                  onUpdateDraft({ handRightStyle: handStyle });
                } else {
                  onUpdateDraft({ handLeftStyle: handStyle, handRightStyle: handStyle });
                }
              }
            )}
          </>
        );
      }

      case 'shoes': {
        const shoesDiffer =
          draftConfig.shoeLeftStyle !== draftConfig.shoeRightStyle ||
          draftConfig.shoeLeftColor !== draftConfig.shoeRightColor;
        const selectedShoeStyle =
          shoeEditTarget === 'left'
            ? draftConfig.shoeLeftStyle
            : shoeEditTarget === 'right'
              ? draftConfig.shoeRightStyle
              : draftConfig.shoeLeftStyle === draftConfig.shoeRightStyle
                ? draftConfig.shoeLeftStyle
                : null;
        const selectedShoeColor =
          shoeEditTarget === 'left'
            ? draftConfig.shoeLeftColor
            : shoeEditTarget === 'right'
              ? draftConfig.shoeRightColor
              : draftConfig.shoeLeftColor === draftConfig.shoeRightColor
                ? draftConfig.shoeLeftColor
                : null;

        return (
          <>
            {renderLimbTargetToggle(
              shoeEditTarget,
              onChangeShoeEditTarget,
              shoesDiffer,
              'Edit Shoe'
            )}
            {renderSwatchStrip(
              'Footwear Colorway',
              SHOE_COLOR_SWATCHES,
              selectedShoeColor,
              (shoeColor) => {
                if (shoeEditTarget === 'left') {
                  onUpdateDraft({ shoeLeftColor: shoeColor });
                } else if (shoeEditTarget === 'right') {
                  onUpdateDraft({ shoeRightColor: shoeColor });
                } else {
                  onUpdateDraft({ shoeLeftColor: shoeColor, shoeRightColor: shoeColor });
                }
              }
            )}
            {renderCardGrid(
              'Sneaker & Shoe Silhouette',
              SHOE_STYLE_OPTIONS,
              selectedShoeStyle,
              (shoeStyle) => ({
                kind: 'shoe',
                shoeStyle,
                shoeColor: selectedShoeColor ?? draftConfig.shoeRightColor,
              }),
              (shoeStyle) => {
                if (shoeEditTarget === 'left') {
                  onUpdateDraft({ shoeLeftStyle: shoeStyle });
                } else if (shoeEditTarget === 'right') {
                  onUpdateDraft({ shoeRightStyle: shoeStyle });
                } else {
                  onUpdateDraft({ shoeLeftStyle: shoeStyle, shoeRightStyle: shoeStyle });
                }
              }
            )}
          </>
        );
      }

      case 'shadow':
        return renderCardGrid(
          'Ground Contact Shadow',
          SHADOW_STYLE_OPTIONS,
          draftConfig.shadowStyle,
          (shadowStyle) => ({ kind: 'shadow', shadowStyle }),
          (shadowStyle) => onUpdateDraft({ shadowStyle })
        );

      case 'fx':
        return (
          <>
            {renderCardGrid(
              'Emotional FX Style',
              FX_STYLE_OPTIONS,
              draftConfig.fxStyle,
              (fxStyle) => ({ kind: 'fx', fxStyle }),
              (fxStyle) => onUpdateDraft({ fxStyle })
            )}
            {draftConfig.fxStyle !== 'none' &&
              renderSwatchStrip(
                'FX Accent Color',
                FX_COLOR_SWATCHES,
                draftConfig.fxColor,
                (fxColor) => onUpdateDraft({ fxColor })
              )}
          </>
        );
    }
  };

  const showBlushPreviewHelper =
    section.id === 'blush' &&
    draftConfig.blushStyle !== 'none' &&
    previewExpression !== 'happy' &&
    previewExpression !== 'sleeping';

  const showFxPreviewHelper =
    section.id === 'fx' &&
    draftConfig.fxStyle !== 'none' &&
    (previewExpression === 'normal' ||
      previewExpression === 'talking' ||
      previewExpression === 'explaining');

  return (
    <div className="webmate-editor-pane">
      {/* Studio Feature Header */}
      <div className="webmate-editor-layer-header">
        <div className="webmate-editor-layer-title-row">
          <h3 className="webmate-editor-layer-title">{section.label}</h3>
          <div className="webmate-editor-header-actions">
            <span className="webmate-editor-slot-pill">{section.slotLabel}</span>
            <button
              type="button"
              className="webmate-link-btn"
              disabled={!canResetSection}
              onClick={() => onResetSection(section.id, activeLimbTarget)}
              onKeyDown={stopHostKeyLeak}
            >
              Reset Section
            </button>
          </div>
        </div>
        <p className="webmate-editor-layer-desc">{section.description}</p>
      </div>

      {/* Expression Reactivity Helper */}
      {section.isExpressionReactive && section.expressionNote && (
        <div className="webmate-expression-note" role="note">
          <div className="webmate-expression-note-top">
            <span className="webmate-expression-note-badge">Expression-Reactive Slot</span>
            {(showBlushPreviewHelper || showFxPreviewHelper) && (
              <div className="webmate-preview-quick-moods">
                <button
                  type="button"
                  className="webmate-quick-mood-btn"
                  onClick={() => onChangePreviewExpression('happy')}
                  onKeyDown={stopHostKeyLeak}
                >
                  Preview in Happy Mood
                </button>
                {showFxPreviewHelper && (
                  <button
                    type="button"
                    className="webmate-quick-mood-btn"
                    onClick={() => onChangePreviewExpression('sleeping')}
                    onKeyDown={stopHostKeyLeak}
                  >
                    Sleeping Zzz
                  </button>
                )}
              </div>
            )}
          </div>
          <p className="webmate-expression-note-text">{section.expressionNote}</p>
        </div>
      )}

      {renderSectionControls()}
    </div>
  );
};
