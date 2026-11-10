import React, { useEffect, useRef } from 'react';
import type { CharacterAssetRegistry } from '../types';
import type { ChatMessage, SuggestedPromptItem } from './chat.types';
import { ChatMessageItem } from './ChatMessageItem';
import { ChatWelcome } from './ChatWelcome';

export interface ChatMessageListProps {
  messages: readonly ChatMessage[];
  assetRegistry: CharacterAssetRegistry;
  suggestedPrompts: readonly SuggestedPromptItem[];
  onSelectPrompt: (prompt: SuggestedPromptItem) => void;
  isShortLayout?: boolean;
}

const BOTTOM_SNAP_THRESHOLD_PX = 56;

function isScrolledNearBottom(el: HTMLElement): boolean {
  const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
  return distanceFromBottom <= BOTTOM_SNAP_THRESHOLD_PX;
}

/**
 * Scrollable conversation surface displaying either the ChatWelcome empty state
 * or the active local message history with smart bottom-anchoring scroll behavior.
 */
export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  assetRegistry,
  suggestedPrompts,
  onSelectPrompt,
  isShortLayout = false,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const stackRef = useRef<HTMLDivElement | null>(null);
  const isNearBottomRef = useRef(true);
  const prevMessageCountRef = useRef(0);

  // Track user scroll position passively so reading older messages is never interrupted.
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      isNearBottomRef.current = isScrolledNearBottom(container);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll to bottom when opening a conversation, sending a new message, or following near bottom.
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const prevCount = prevMessageCountRef.current;
    prevMessageCountRef.current = messages.length;

    if (messages.length === 0) {
      isNearBottomRef.current = true;
      container.scrollTop = 0;
      return;
    }

    const appendedMessage = messages.length > prevCount;
    const latestMessage = messages[messages.length - 1];
    const shouldForceScroll = appendedMessage && latestMessage?.role === 'user';

    if (shouldForceScroll || isNearBottomRef.current) {
      isNearBottomRef.current = true;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  // Keep bottom anchored across viewport or drawer resizes when already near bottom.
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || messages.length === 0 || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(() => {
      if (isNearBottomRef.current) {
        container.scrollTop = container.scrollHeight;
      }
    });

    observer.observe(container);
    if (stackRef.current) {
      observer.observe(stackRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [messages.length]);

  return (
    <div
      ref={scrollContainerRef}
      className="webmate-chat-message-list"
      role="log"
      aria-live="polite"
      aria-label="Conversation history"
    >
      {messages.length === 0 ? (
        <ChatWelcome
          assetRegistry={assetRegistry}
          suggestedPrompts={suggestedPrompts}
          onSelectPrompt={onSelectPrompt}
          isShortLayout={isShortLayout}
        />
      ) : (
        <div ref={stackRef} className="webmate-chat-messages-stack">
          {messages.map((message) => (
            <ChatMessageItem key={message.id} message={message} />
          ))}
        </div>
      )}
    </div>
  );
};

