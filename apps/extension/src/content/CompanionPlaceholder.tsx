import React from 'react';
import { COMPANION_CARD_HEIGHT, COMPANION_CARD_WIDTH } from '@webmate/shared';

export interface CompanionPlaceholderProps {
  /** Indicates whether the container is actively being dragged by pointer */
  isDragging?: boolean;
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
}) => {
  return (
    <div
      id="webmate-companion-card"
      className="webmate-card flex items-center gap-3 px-3.5 py-3 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-black/40 select-none text-slate-100"
      style={{
        width: `${COMPANION_CARD_WIDTH}px`,
        height: `${COMPANION_CARD_HEIGHT}px`,
        boxSizing: 'border-box',
        backgroundColor: '#0F172A',
        borderColor: isDragging ? '#3B82F6' : '#334155',
        color: '#F8FAFC',
        boxShadow: isDragging
          ? '0 25px 35px -5px rgba(0, 0, 0, 0.6), 0 12px 16px -6px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.4)'
          : '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
        transform: isDragging ? 'scale(1.025)' : 'none',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Companion Logo Icon / Avatar Placeholder */}
      <div
        className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 shadow-inner"
        style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#2563EB',
          borderRadius: '8px',
        }}
      >
        <span
          className="text-white font-bold text-xs tracking-wider"
          style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '13px' }}
        >
          WM
        </span>
      </div>

      {/* Companion Identity & Status */}
      <div className="flex flex-col min-w-0 justify-center">
        <div className="flex items-center gap-1.5">
          <span
            className="text-sm font-semibold text-white tracking-tight leading-tight truncate"
            style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '14px', lineHeight: '1.2' }}
          >
            WebMate
          </span>
          <span
            className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800/60"
            style={{
              fontSize: '10px',
              padding: '1px 5px',
              backgroundColor: '#172554',
              color: '#93C5FD',
              borderColor: '#1E40AF',
              borderRadius: '4px',
            }}
          >
            v0.1
          </span>
        </div>

        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse"
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '9999px',
              backgroundColor: '#34D399',
            }}
          />
          <span
            className="text-[11px] text-slate-400 font-medium truncate"
            style={{ color: '#94A3B8', fontSize: '11px', lineHeight: '1.2' }}
          >
            Companion Ready
          </span>
        </div>
      </div>
    </div>
  );
};

export default CompanionPlaceholder;

