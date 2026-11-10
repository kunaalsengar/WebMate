import React, { useRef } from 'react';
import {
  CUSTOMIZATION_CATEGORY_GROUPS,
  CUSTOMIZATION_SECTION_BY_ID,
  isSectionCustomized,
  isSectionDirty,
  type AvatarCustomizationConfig,
  type CustomizationSectionId,
} from '../../character/customization';

export interface LayerListSidebarProps {
  selectedSectionId: CustomizationSectionId;
  draftConfig: AvatarCustomizationConfig;
  savedConfig: AvatarCustomizationConfig;
  onSelectSection: (sectionId: CustomizationSectionId) => void;
}

const ORDERED_SECTION_IDS: readonly CustomizationSectionId[] =
  CUSTOMIZATION_CATEGORY_GROUPS.flatMap((group) => group.sectionIds);

/**
 * Displays all 9 Avatar Studio customization groups mapped to the 12 canonical rig layers,
 * showing customized vs default badges, unsaved indicators, and keyboard arrow navigation.
 */
export const LayerListSidebar: React.FC<LayerListSidebarProps> = ({
  selectedSectionId,
  draftConfig,
  savedConfig,
  onSelectSection,
}) => {
  const buttonRefs = useRef<Partial<Record<CustomizationSectionId, HTMLButtonElement | null>>>({});

  const focusAndSelectSection = (sectionId: CustomizationSectionId) => {
    onSelectSection(sectionId);
    buttonRefs.current[sectionId]?.focus();
  };

  const handleButtonKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    sectionId: CustomizationSectionId
  ) => {
    const currentIndex = ORDERED_SECTION_IDS.indexOf(sectionId);
    if (currentIndex === -1) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      e.stopPropagation();
      const nextId = ORDERED_SECTION_IDS[(currentIndex + 1) % ORDERED_SECTION_IDS.length];
      focusAndSelectSection(nextId);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      e.stopPropagation();
      const prevId =
        ORDERED_SECTION_IDS[
          (currentIndex - 1 + ORDERED_SECTION_IDS.length) % ORDERED_SECTION_IDS.length
        ];
      focusAndSelectSection(prevId);
    } else {
      e.stopPropagation();
    }
  };

  return (
    <nav className="webmate-layer-list" aria-label="Avatar customization categories">
      {CUSTOMIZATION_CATEGORY_GROUPS.map((group) => (
        <div key={group.id} className="webmate-layer-group">
          <div className="webmate-layer-group-title">{group.title}</div>
          <div className="webmate-layer-group-items">
            {group.sectionIds.map((sectionId) => {
              const section = CUSTOMIZATION_SECTION_BY_ID[sectionId];
              if (!section) return null;

              const isSelected = sectionId === selectedSectionId;
              const isCustom = isSectionCustomized(draftConfig, sectionId);
              const isDirty = isSectionDirty(draftConfig, savedConfig, sectionId);

              return (
                <button
                  key={sectionId}
                  ref={(el) => {
                    buttonRefs.current[sectionId] = el;
                  }}
                  type="button"
                  aria-pressed={isSelected}
                  className={`webmate-layer-item ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => onSelectSection(sectionId)}
                  onKeyDown={(e) => handleButtonKeyDown(e, sectionId)}
                >
                  <span className="webmate-layer-item-name">{section.shortLabel}</span>
                  <span className="webmate-layer-item-badges">
                    {isDirty && (
                      <span
                        className="webmate-layer-dirty-dot"
                        title="Unsaved change"
                        aria-label="Unsaved change"
                      />
                    )}
                    <span
                      className={`webmate-layer-status-tag ${
                        isCustom ? 'is-custom' : 'is-default'
                      }`}
                    >
                      {isCustom ? 'Styled' : 'Default'}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
};
