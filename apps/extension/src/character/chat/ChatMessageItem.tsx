import React from 'react';
import type { ChatMessage } from './chat.types';

export interface ChatMessageItemProps {
  message: ChatMessage;
}

const timeFormatter =
  typeof Intl !== 'undefined' && typeof Intl.DateTimeFormat === 'function'
    ? new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: '2-digit',
      })
    : null;

function formatMessageTime(timestamp: number): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  if (timeFormatter) {
    return timeFormatter.format(date);
  }
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatIsoTimestamp(timestamp: number): string | undefined {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return date.toISOString();
}

/**
 * Renders a single local conversation message strictly as plain text.
 * Supports right-aligned user bubbles and left-aligned WebMate assistant rows
 * ready for future AI integration without interpreting HTML or running scripts.
 */
export const ChatMessageItem: React.FC<ChatMessageItemProps> = React.memo(({ message }) => {
  const isUser = message.role === 'user';
  const formattedTime = formatMessageTime(message.createdAt);
  const isoTimestamp = formatIsoTimestamp(message.createdAt);
  const statusClass =
    message.status === 'error'
      ? 'is-error'
      : message.status === 'pending'
        ? 'is-pending'
        : 'is-sent';

  return (
    <article
      className={`webmate-chat-message ${isUser ? 'is-user' : 'is-assistant'} ${statusClass}`}
      aria-label={isUser ? 'Your message' : 'WebMate message'}
    >
      {!isUser && (
        <div className="webmate-chat-message-avatar" aria-hidden="true">
          WM
        </div>
      )}

      <div className="webmate-chat-message-column">
        <div className="webmate-chat-message-bubble">{message.content}</div>

        {(formattedTime || !isUser) && (
          <div className="webmate-chat-message-meta">
            {!isUser && <span className="webmate-chat-message-sender">WebMate</span>}
            {formattedTime && (
              <time className="webmate-chat-message-time" dateTime={isoTimestamp}>
                {formattedTime}
              </time>
            )}
          </div>
        )}
      </div>
    </article>
  );
});

ChatMessageItem.displayName = 'ChatMessageItem';

