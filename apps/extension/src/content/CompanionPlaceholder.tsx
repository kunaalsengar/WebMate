import React from 'react';
import { COMPANION_CARD_HEIGHT, COMPANION_CARD_WIDTH } from '@webmate/shared';

export interface CompanionPlaceholderProps {
  /** Indicates whether the container is actively being dragged by pointer */
  isDragging?: boolean;
  /** Whether the built-in Avatar Studio customizer panel is open */
  isCustomizerOpen?: boolean;
  /** Number of canonical rig layers customized away from original artwork */
  customLayerCount?: number;
  /** Toggles the Shadow DOM Avatar Studio interface */
  onToggleCustomizer?: () => void;
  /** Optional ref for restoring keyboard focus when the customizer closes */
  customizeButtonRef?: React.RefObject<HTMLButtonElement>;
}

/**
 * Minimal Companion Placeholder UI Component
 *
 * Rendered inside the isolated Shadow DOM (<webmate-root>).
 * Phase 1, Step 3: Wrapped by FloatingCompanion for draggable interaction
 * and viewport edge docking.
 */
export const CompanionPlaceholder: React.FC<CompanionPlaceholderProps> = ({
  isDragging = false,
  isCustomizerOpen = false,
  customLayerCount = 0,
  onToggleCustomizer,
  customizeButtonRef,
}) => {
  const statusLabel =
    customLayerCount > 0 ? `${customLayerCount} Styled` : 'Companion Ready';

  return (
    <div
      id="webmate-companion-card"
      className="webmate-card flex items-center select-none text-slate-100"
      style={{
        width: `${COMPANION_CARD_WIDTH}px`,
        height: `${COMPANION_CARD_HEIGHT}px`,
        padding: '0 8px',
        gap: '6px',
        boxSizing: 'border-box',
        backgroundColor: '#0F172A',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: isDragging ? '#3B82F6' : isCustomizerOpen ? '#60A5FA' : '#334155',
        borderRadius: '12px',
        color: '#F8FAFC',
        boxShadow: isDragging
          ? '0 25px 35px -5px rgba(0, 0, 0, 0.6), 0 12px 16px -6px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.4)'
          : '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
        transform: isDragging ? 'scale(1.025)' : 'none',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Companion Logo Icon */}
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          width: '32px',
          height: '32px',
          backgroundColor: '#2563EB',
          borderRadius: '8px',
          flexShrink: 0,
        }}
      >
        <span
          style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '11px', letterSpacing: '0.03em' }}
        >
          WM
        </span>
      </div>

      {/* Companion Identity & Status */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minWidth: 0,
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span
            style={{
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '12.5px',
              lineHeight: '1.2',
              whiteSpace: 'nowrap',
            }}
          >
            WebMate
          </span>
          <span
            style={{
              fontSize: '9px',
              lineHeight: '1.2',
              padding: '1px 4px',
              backgroundColor: '#172554',
              color: '#93C5FD',
              border: '1px solid rgba(30, 64, 175, 0.7)',
              borderRadius: '4px',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            }}
          >
            v0.1
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '9999px',
              backgroundColor: customLayerCount > 0 ? '#60A5FA' : '#34D399',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              color: '#94A3B8',
              fontSize: '10.5px',
              lineHeight: '1.2',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Interactive Avatar Studio Trigger */}
      {onToggleCustomizer && (
        <button
          ref={customizeButtonRef}
          type="button"
          className={`webmate-customize-trigger ${isCustomizerOpen ? 'is-open' : ''}`}
          aria-expanded={isCustomizerOpen}
          aria-controls="webmate-customizer-panel"
          aria-label={isCustomizerOpen ? 'Close mascot avatar studio' : 'Customize mascot avatar'}
          title={isCustomizerOpen ? 'Close avatar studio' : 'Customize avatar'}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onToggleCustomizer();
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
          >
            <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M3.5 13C4.2 10.6 5.9 9.5 8 9.5C10.1 9.5 11.8 10.6 12.5 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span>Style</span>
        </button>
      )}
    </div>
  );
};

export default CompanionPlaceholder;
