import React from 'react';
import { CharacterRig } from '../CharacterRig';
import type { CharacterAssetRegistry } from '../types';
import type { SuggestedPromptIconKind, SuggestedPromptItem } from './chat.types';

export interface ChatWelcomeProps {
  assetRegistry: CharacterAssetRegistry;
  suggestedPrompts: readonly SuggestedPromptItem[];
  onSelectPrompt: (prompt: SuggestedPromptItem) => void;
  isShortLayout?: boolean;
}

const PromptIcon: React.FC<{ kind: SuggestedPromptIconKind }> = ({ kind }) => {
  switch (kind) {
    case 'page':
      return (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect
            x="2.5"
            y="2"
            width="11"
            height="12"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M5 5.5H11M5 8.2H11M5 10.9H8.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'write':
      return (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M11.2 2.6L13.4 4.8L5.6 12.6L2.6 13.4L3.4 10.4L11.2 2.6Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'summary':
      return (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M3 4.2H13M3 8H10.5M3 11.8H8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="12.2" cy="11.5" r="1.4" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      );
    case 'question':
    default:
      return (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M6.3 6.3C6.5 5.3 7.2 4.8 8.1 4.8C9 4.8 9.7 5.4 9.7 6.2C9.7 7 9.1 7.4 8.5 7.8C8.1 8.1 7.9 8.4 7.9 9"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="8" cy="11.2" r="0.8" fill="currentColor" />
        </svg>
      );
  }
};

/**
 * Empty conversational welcome state displaying the canonical CharacterRig mascot,
 * welcoming copy, and clickable prompt foundation cards.
 */
export const ChatWelcome: React.FC<ChatWelcomeProps> = ({
  assetRegistry,
  suggestedPrompts,
  onSelectPrompt,
  isShortLayout = false,
}) => {
  const stopHostKeyLeak = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={`webmate-chat-welcome ${isShortLayout ? 'is-short' : ''}`}>
      <div className="webmate-chat-welcome-hero">
        <div className="webmate-chat-welcome-mascot" aria-hidden="true">
          <CharacterRig
            expression="happy"
            animationState="idle"
            scale={isShortLayout ? 0.34 : 0.42}
            assetRegistry={assetRegistry}
          />
        </div>

        <h3 className="webmate-chat-welcome-heading">How can I help today?</h3>
        <p className="webmate-chat-welcome-desc">
          I can help break down webpages, summarize key points, draft clear writing, or answer questions alongside your browsing.
        </p>
      </div>

      <div className="webmate-chat-welcome-prompts" role="group" aria-label="Suggested prompts">
        {suggestedPrompts.map((item) => (
          <button
            key={item.id}
            type="button"
            className="webmate-chat-prompt-card"
            onClick={() => onSelectPrompt(item)}
            onKeyDown={stopHostKeyLeak}
          >
            <span className="webmate-chat-prompt-icon" aria-hidden="true">
              <PromptIcon kind={item.iconKind} />
            </span>
            <span className="webmate-chat-prompt-copy">
              <span className="webmate-chat-prompt-title">{item.title}</span>
              <span className="webmate-chat-prompt-desc">{item.description}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

