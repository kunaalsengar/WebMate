import React, { useEffect, useRef } from 'react';
import type { ChatMessage } from './chat.types';

export interface ChatComposerProps {
  draftText: string;
  onChangeDraft: (nextText: string) => void;
  onSendMessage: (content: string) => ChatMessage | null;
  onRequestClose: () => void;
  isGenerating?: boolean;
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
}

const MAX_TEXTAREA_HEIGHT_PX = 120;
const MIN_TEXTAREA_HEIGHT_PX = 24;

/**
 * Functional multiline chat composer with Enter submit, Shift+Enter newline,
 * whitespace trimming, auto-resizing, disabled attachment placeholder, and focus preservation.
 */
export const ChatComposer: React.FC<ChatComposerProps> = ({
  draftText,
  onChangeDraft,
  onSendMessage,
  onRequestClose,
  isGenerating = false,
  textareaRef: externalTextareaRef,
}) => {
  const internalRef = useRef<HTMLTextAreaElement | null>(null);
  const inputRef = externalTextareaRef ?? internalRef;

  const canSend = draftText.trim().length > 0 && !isGenerating;

  // Keep textarea height synced cleanly to multiline content up to a safe cap.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const nextHeight = Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT_PX);
    el.style.height = `${Math.max(MIN_TEXTAREA_HEIGHT_PX, nextHeight)}px`;
    el.style.overflowY = el.scrollHeight > MAX_TEXTAREA_HEIGHT_PX ? 'auto' : 'hidden';
  }, [draftText, inputRef]);

  const submitCurrentMessage = () => {
    const trimmed = draftText.trim();
    if (!trimmed || isGenerating) {
      return;
    }

    const createdMessage = onSendMessage(trimmed);
    if (createdMessage !== null) {
      onChangeDraft('');
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();

    if (e.key === 'Escape') {
      e.preventDefault();
      onRequestClose();
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submitCurrentMessage();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitCurrentMessage();
  };

  const stopHostKeyLeak = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="webmate-chat-composer-wrapper">
      <form className="webmate-chat-composer-shell" onSubmit={handleSubmit}>
        <textarea
          ref={inputRef}
          className="webmate-chat-composer-input"
          rows={1}
          value={draftText}
          placeholder="Message WebMate..."
          aria-label="Message WebMate"
          onChange={(e) => onChangeDraft(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div className="webmate-chat-composer-bar">
          <div className="webmate-chat-composer-tools">
            <button
              type="button"
              className="webmate-chat-attach-btn"
              disabled
              aria-disabled="true"
              aria-label="Attachments (coming soon)"
              title="Attachments will be available in a future update"
              onKeyDown={stopHostKeyLeak}
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M10.8 5.2L6.3 9.7C5.7 10.3 4.8 10.3 4.2 9.7C3.6 9.1 3.6 8.2 4.2 7.6L9.4 2.4C10.5 1.3 12.2 1.3 13.3 2.4C14.4 3.5 14.4 5.2 13.3 6.3L7.8 11.8C6.2 13.4 3.6 13.4 2 11.8C0.4 10.2 0.4 7.6 2 6L6.6 1.4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <span className="webmate-chat-composer-hint">Shift + Enter for new line</span>
          </div>

          <button
            type="submit"
            className={`webmate-chat-send-btn ${canSend ? 'is-ready' : ''}`}
            disabled={!canSend}
            aria-label="Send message"
            title={canSend ? 'Send message' : 'Enter a message first'}
            onKeyDown={stopHostKeyLeak}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M8 12.75V3.5M8 3.5L4.25 7.25M8 3.5L11.75 7.25"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

