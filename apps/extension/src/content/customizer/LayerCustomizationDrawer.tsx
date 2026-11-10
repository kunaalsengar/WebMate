import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CharacterExpression, DockSide } from '@webmate/shared';
import {
  areAvatarCustomizationsEqual,
  CUSTOMIZABLE_LAYER_METADATA,
  CUSTOMIZATION_SECTION_BY_ID,
  CUSTOMIZATION_SECTIONS,
  DEFAULT_AVATAR_CUSTOMIZATION,
  getCustomizedCanonicalLayerIds,
} from '../../character/customization';
import type { CharacterAssetRegistry } from '../../character/types';
import { useCompanionStore, type CompanionState } from '../store';
import { LayerAppearanceEditor } from './LayerAppearanceEditor';
import { LayerListSidebar } from './LayerListSidebar';
import { MascotLivePreview } from './MascotLivePreview';
import { saveCustomizerDraftChanges } from './persistence';

export interface LayerCustomizationDrawerProps {
  /** Companion's docked viewport side so the drawer anchors cleanly without overlapping the mascot */
  dockSide: DockSide;
  /** Merged artwork registry driving both preview and live webpage mascot */
  assetRegistry: CharacterAssetRegistry;
  /** Reference to the trigger button so closing returns focus cleanly */
  customizeButtonRef?: React.RefObject<HTMLButtonElement>;
}

/**
 * Shadow DOM Snapchat/Bitmoji-style Avatar Studio panel using exclusively built-in
 * WebMate layered vector options with real-time preview, per-section resets,
 * explicit Save / Discard actions, and chrome.storage.local synchronization.
 */
export const LayerCustomizationDrawer: React.FC<LayerCustomizationDrawerProps> = React.memo(
  ({ dockSide, assetRegistry, customizeButtonRef }) => {
    const closeBtnRef = useRef<HTMLButtonElement | null>(null);
    const wasOpenRef = useRef(false);

    const isCustomizerOpen = useCompanionStore(
      (state: CompanionState) => state.isCustomizerOpen
    );
    const selectedSectionId = useCompanionStore(
      (state: CompanionState) => state.selectedSectionId
    );
    const armEditTarget = useCompanionStore(
      (state: CompanionState) => state.armEditTarget
    );
    const shoeEditTarget = useCompanionStore(
      (state: CompanionState) => state.shoeEditTarget
    );
    const avatarCustomization = useCompanionStore(
      (state: CompanionState) => state.avatarCustomization
    );
    const draftAvatarCustomization = useCompanionStore(
      (state: CompanionState) => state.draftAvatarCustomization
    );
    const isSavingCustomAssets = useCompanionStore(
      (state: CompanionState) => state.isSavingCustomAssets
    );
    const customAssetsHasCorruptedData = useCompanionStore(
      (state: CompanionState) => state.customAssetsHasCorruptedData
    );
    const unsupportedCustomAssetsVersion = useCompanionStore(
      (state: CompanionState) => state.unsupportedCustomAssetsVersion
    );
    const customAssetsWarnings = useCompanionStore(
      (state: CompanionState) => state.customAssetsWarnings
    );
    const customAssetsError = useCompanionStore(
      (state: CompanionState) => state.customAssetsError
    );

    const closeCustomizer = useCompanionStore(
      (state: CompanionState) => state.closeCustomizer
    );
    const setSelectedSectionId = useCompanionStore(
      (state: CompanionState) => state.setSelectedSectionId
    );
    const setArmEditTarget = useCompanionStore(
      (state: CompanionState) => state.setArmEditTarget
    );
    const setShoeEditTarget = useCompanionStore(
      (state: CompanionState) => state.setShoeEditTarget
    );
    const updateDraftCustomization = useCompanionStore(
      (state: CompanionState) => state.updateDraftCustomization
    );
    const resetDraftSection = useCompanionStore(
      (state: CompanionState) => state.resetDraftSection
    );
    const resetAllDraftCustomizations = useCompanionStore(
      (state: CompanionState) => state.resetAllDraftCustomizations
    );
    const discardDraftCustomizations = useCompanionStore(
      (state: CompanionState) => state.discardDraftCustomizations
    );

    const [previewExpression, setPreviewExpression] =
      useState<CharacterExpression>('normal');
    const [saveFeedback, setSaveFeedback] = useState<{
      kind: 'success' | 'error';
      text: string;
    } | null>(null);
    const [showClosePrompt, setShowClosePrompt] = useState(false);

    const activeDraft = draftAvatarCustomization ?? avatarCustomization;
    const customLayerCount = useMemo(
      () => getCustomizedCanonicalLayerIds(activeDraft).length,
      [activeDraft]
    );
    const isAllDefaults = useMemo(
      () => areAvatarCustomizationsEqual(activeDraft, DEFAULT_AVATAR_CUSTOMIZATION),
      [activeDraft]
    );
    const isSavedAllDefaults = useMemo(
      () => areAvatarCustomizationsEqual(avatarCustomization, DEFAULT_AVATAR_CUSTOMIZATION),
      [avatarCustomization]
    );
    const hasUnsavedChanges = useMemo(
      () => !areAvatarCustomizationsEqual(activeDraft, avatarCustomization),
      [activeDraft, avatarCustomization]
    );
    const needsCorruptedCleanup =
      isAllDefaults &&
      (customAssetsHasCorruptedData || unsupportedCustomAssetsVersion !== null);
    const canSave = (hasUnsavedChanges || needsCorruptedCleanup) && !isSavingCustomAssets;
    const canResetAll =
      (!isAllDefaults || !isSavedAllDefaults || needsCorruptedCleanup) &&
      !isSavingCustomAssets;

    const selectedDescriptor =
      CUSTOMIZATION_SECTION_BY_ID[selectedSectionId] ?? CUSTOMIZATION_SECTIONS[0];

    // Transfer keyboard focus smoothly when opening and closing
    useEffect(() => {
      if (isCustomizerOpen && !wasOpenRef.current) {
        setSaveFeedback(null);
        setShowClosePrompt(false);
        const rafId = requestAnimationFrame(() => {
          closeBtnRef.current?.focus();
        });
        wasOpenRef.current = true;
        return () => cancelAnimationFrame(rafId);
      }

      if (!isCustomizerOpen && wasOpenRef.current) {
        wasOpenRef.current = false;
        setShowClosePrompt(false);
        setSaveFeedback(null);
        const rafId = requestAnimationFrame(() => {
          customizeButtonRef?.current?.focus();
        });
        return () => cancelAnimationFrame(rafId);
      }

      wasOpenRef.current = isCustomizerOpen;
      return undefined;
    }, [isCustomizerOpen, customizeButtonRef]);

    // Dismiss stale success banner when draft is edited again
    useEffect(() => {
      if (hasUnsavedChanges && saveFeedback?.kind === 'success') {
        setSaveFeedback(null);
      }
      if (!hasUnsavedChanges) {
        setShowClosePrompt(false);
      }
    }, [hasUnsavedChanges, saveFeedback]);

    const handleRequestClose = useCallback(() => {
      if (isSavingCustomAssets) return;
      if (hasUnsavedChanges) {
        setShowClosePrompt(true);
        return;
      }
      closeCustomizer();
    }, [closeCustomizer, hasUnsavedChanges, isSavingCustomAssets]);

    const handleSave = useCallback(async (): Promise<boolean> => {
      setSaveFeedback(null);
      const outcome = await saveCustomizerDraftChanges();

      if (!outcome.ok) {
        setSaveFeedback({ kind: 'error', text: outcome.message });
        return false;
      }

      if (outcome.skippedWrite) {
        setSaveFeedback({ kind: 'success', text: 'Already up to date' });
      } else if (outcome.cleared) {
        setSaveFeedback({ kind: 'success', text: 'Default mascot restored' });
      } else {
        setSaveFeedback({ kind: 'success', text: 'Avatar saved' });
      }

      return true;
    }, []);

    const handleSaveAndClose = useCallback(async () => {
      const ok = await handleSave();
      if (ok) {
        closeCustomizer();
      }
    }, [closeCustomizer, handleSave]);

    const handlePanelKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
      e.stopPropagation();
      if (e.key === 'Escape') {
        e.preventDefault();
        handleRequestClose();
      }
    };

    if (!isCustomizerOpen) {
      return null;
    }

    const panelAnchorClass = dockSide === 'left' ? 'anchor-right' : 'anchor-left';

    return (
      <aside
        id="webmate-customizer-panel"
        className={`webmate-customizer-panel ${panelAnchorClass}`}
        role="dialog"
        aria-modal="false"
        aria-labelledby="webmate-customizer-title"
        onPointerDown={(e) => e.stopPropagation()}
        onKeyDown={handlePanelKeyDown}
      >
        {/* Navy Identity Header */}
        <header className="webmate-customizer-header">
          <div className="webmate-customizer-header-left">
            <div className="webmate-customizer-logo" aria-hidden="true">
              WM
            </div>
            <div className="webmate-customizer-title-group">
              <h2 id="webmate-customizer-title" className="webmate-customizer-title">
                WebMate Avatar Studio
              </h2>
              <span className="webmate-customizer-subtitle">
                {customLayerCount} of {CUSTOMIZABLE_LAYER_METADATA.length} rig layers customized
              </span>
            </div>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            className="webmate-customizer-close-btn"
            aria-label="Close avatar studio"
            onClick={handleRequestClose}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 4L12 12M12 4L4 12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        {/* Storage Integrity / Schema Warnings (Read-Only Non-Destructive Alerts) */}
        {(customAssetsError || customAssetsWarnings.length > 0) && (
          <div className="webmate-customizer-banners">
            {customAssetsError && (
              <div className="webmate-banner is-error" role="alert">
                <strong>Storage notice:</strong> {customAssetsError}
              </div>
            )}
            {!customAssetsError && customAssetsWarnings.length > 0 && (
              <div className="webmate-banner is-warning" role="status">
                <strong>Notice:</strong>{' '}
                {customAssetsWarnings.map((w) => w.message).join(' ')}
              </div>
            )}
          </div>
        )}

        {/* Unsaved Changes Confirmation Bar When Closing */}
        {showClosePrompt && (
          <div className="webmate-close-confirm-bar" role="alertdialog" aria-label="Unsaved changes">
            <span className="webmate-close-confirm-text">
              Save avatar changes before closing?
            </span>
            <div className="webmate-close-confirm-actions">
              <button
                type="button"
                className="webmate-btn-primary webmate-btn-compact"
                disabled={isSavingCustomAssets}
                onClick={() => void handleSaveAndClose()}
              >
                Save &amp; Close
              </button>
              <button
                type="button"
                className="webmate-btn-ghost-danger webmate-btn-compact"
                disabled={isSavingCustomAssets}
                onClick={() => closeCustomizer()}
              >
                Discard &amp; Close
              </button>
              <button
                type="button"
                className="webmate-btn-secondary webmate-btn-compact"
                disabled={isSavingCustomAssets}
                onClick={() => setShowClosePrompt(false)}
              >
                Keep Editing
              </button>
            </div>
          </div>
        )}

        {/* Main Responsive Two-Column Workspace */}
        <div className="webmate-customizer-body">
          <div className="webmate-customizer-sidebar">
            <MascotLivePreview
              assetRegistry={assetRegistry}
              customCount={customLayerCount}
              hasUnsavedChanges={hasUnsavedChanges}
              previewExpression={previewExpression}
              onChangePreviewExpression={setPreviewExpression}
            />
            <LayerListSidebar
              selectedSectionId={selectedDescriptor.id}
              draftConfig={activeDraft}
              savedConfig={avatarCustomization}
              onSelectSection={setSelectedSectionId}
            />
          </div>

          <div className="webmate-customizer-main">
            <LayerAppearanceEditor
              section={selectedDescriptor}
              draftConfig={activeDraft}
              armEditTarget={armEditTarget}
              shoeEditTarget={shoeEditTarget}
              previewExpression={previewExpression}
              onChangePreviewExpression={setPreviewExpression}
              onChangeArmEditTarget={setArmEditTarget}
              onChangeShoeEditTarget={setShoeEditTarget}
              onUpdateDraft={(patch) => {
                setSaveFeedback(null);
                updateDraftCustomization(patch);
              }}
              onResetSection={(sectionId, limbTarget) => {
                setSaveFeedback(null);
                resetDraftSection(sectionId, limbTarget);
              }}
            />
          </div>
        </div>

        {/* Footer Persistence & Reset Controls */}
        <footer className="webmate-customizer-footer">
          <div className="webmate-footer-left">
            <button
              type="button"
              className="webmate-btn-ghost-danger"
              disabled={!canResetAll}
              onClick={() => {
                setSaveFeedback(null);
                resetAllDraftCustomizations();
              }}
            >
              Reset All
            </button>
          </div>

          <div className="webmate-footer-right">
            <div className="webmate-save-status" aria-live="polite">
              {saveFeedback ? (
                <span
                  className={`webmate-status-text ${
                    saveFeedback.kind === 'error' ? 'is-error' : 'is-success'
                  }`}
                >
                  {saveFeedback.text}
                </span>
              ) : hasUnsavedChanges ? (
                <span className="webmate-status-text is-unsaved">Unsaved changes</span>
              ) : null}
            </div>

            <button
              type="button"
              className="webmate-btn-secondary"
              disabled={!hasUnsavedChanges || isSavingCustomAssets}
              onClick={() => {
                setSaveFeedback(null);
                discardDraftCustomizations();
              }}
            >
              Discard
            </button>

            <button
              type="button"
              className="webmate-btn-primary"
              disabled={!canSave}
              onClick={() => void handleSave()}
            >
              {isSavingCustomAssets ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </footer>
      </aside>
    );
  }
);

LayerCustomizationDrawer.displayName = 'LayerCustomizationDrawer';
