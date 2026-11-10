import React from 'react';

export interface ChatHeaderProps {
  onNewConversation: () => void;
  onClose: () => void;
  closeButtonRef?: React.RefObject<HTMLButtonElement>;
}

/**
 * Minimal WebMate header with brand identity, assistant label, visual new-chat control, and close button.
 */
export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onNewConversation,
  onClose,
  closeButtonRef,
}) => {
  const stopHostKeyLeak = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  return (
    <header className="webmate-chat-header">
      <div className="webmate-chat-header-brand">
        <div className="webmate-chat-brand-avatar" aria-hidden="true">
          WM
        </div>
        <div className="webmate-chat-brand-copy">
          <h2 id="webmate-chat-title" className="webmate-chat-title">
            WebMate
          </h2>
          <span className="webmate-chat-subtitle">AI Assistant</span>
        </div>
      </div>

      <div className="webmate-chat-header-actions">
        <button
          type="button"
          className="webmate-chat-header-btn webmate-chat-new-btn"
          aria-label="New conversation"
          title="New conversation"
          onClick={onNewConversation}
          onKeyDown={stopHostKeyLeak}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M8 3.25V12.75M3.25 8H12.75"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
          <span className="webmate-chat-new-btn-label">New chat</span>
        </button>

        <button
          ref={closeButtonRef}
          type="button"
          className="webmate-chat-header-btn webmate-chat-close-btn"
          aria-label="Close WebMate chat"
          title="Close chat"
          onClick={onClose}
          onKeyDown={stopHostKeyLeak}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M4 4L12 12M12 4L4 12"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

