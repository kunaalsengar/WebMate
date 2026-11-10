import React, { useState } from 'react';
import type { CharacterExpression } from '@webmate/shared';
import { CharacterRig } from '../../character/CharacterRig';
import { EXPRESSION_CONFIGS } from '../../character/expressions.config';
import type { CharacterAssetRegistry } from '../../character/types';

export interface MascotLivePreviewProps {
  /** Merged artwork registry reflecting active draft customizations */
  assetRegistry: CharacterAssetRegistry;
  /** Number of customized canonical rig layers in the active preview */
  customCount: number;
  /** True when the draft differs from saved storage */
  hasUnsavedChanges: boolean;
  /** Optional controlled preview expression mood */
  previewExpression?: CharacterExpression;
  /** Optional callback invoked when the user switches preview mood */
  onChangePreviewExpression?: (expression: CharacterExpression) => void;
}

const PREVIEW_EXPRESSION_OPTIONS = Object.values(EXPRESSION_CONFIGS);

/**
 * Embedded live preview stage rendering the real CharacterRig component with active
 * built-in avatar selections, mood preview selector, and optional anchor guides.
 */
export const MascotLivePreview: React.FC<MascotLivePreviewProps> = ({
  assetRegistry,
  customCount,
  hasUnsavedChanges,
  previewExpression: controlledExpression,
  onChangePreviewExpression,
}) => {
  const [uncontrolledExpression, setUncontrolledExpression] =
    useState<CharacterExpression>('normal');
  const [showAnchors, setShowAnchors] = useState(false);

  const activeExpression = controlledExpression ?? uncontrolledExpression;
  const setExpression = onChangePreviewExpression ?? setUncontrolledExpression;

  const stopHostKeyLeak = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  return (
    <section
      className="webmate-preview-card"
      aria-label="Live mascot preview"
    >
      <div className="webmate-preview-header">
        <span className="webmate-preview-title">Live Preview</span>
        <span
          className={`webmate-preview-pill ${
            hasUnsavedChanges
              ? 'is-unsaved'
              : customCount > 0
                ? 'is-custom'
                : 'is-default'
          }`}
        >
          {hasUnsavedChanges
            ? 'Unsaved Edits'
            : customCount > 0
              ? `${customCount} Styled`
              : 'Default'}
        </span>
      </div>

      <div className="webmate-preview-stage">
        <CharacterRig
          expression={activeExpression}
          animationState="idle"
          scale={0.56}
          showDevRig={showAnchors}
          assetRegistry={assetRegistry}
        />
      </div>

      <div className="webmate-preview-controls">
        <div className="webmate-preview-select-group">
          <label
            htmlFor="webmate-preview-expression"
            className="webmate-preview-control-label"
          >
            Preview mood
          </label>
          <select
            id="webmate-preview-expression"
            className="webmate-preview-select"
            value={activeExpression}
            onChange={(e) => setExpression(e.target.value as CharacterExpression)}
            onKeyDown={stopHostKeyLeak}
          >
            {PREVIEW_EXPRESSION_OPTIONS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className={`webmate-anchors-toggle ${showAnchors ? 'is-active' : ''}`}
          aria-pressed={showAnchors}
          onClick={() => setShowAnchors((prev) => !prev)}
          onKeyDown={stopHostKeyLeak}
        >
          Anchors
        </button>
      </div>
    </section>
  );
};
