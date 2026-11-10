export type ChatMessageRole = 'user' | 'assistant';

export type ChatMessageStatus = 'sent' | 'pending' | 'error';

/**
 * Conversation message model managed in the WebMate companion store.
 */
export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
  createdAt: number;
  status?: ChatMessageStatus;
}

export type SuggestedPromptIconKind = 'page' | 'write' | 'summary' | 'question';

/**
 * Starter prompt displayed on the ChatWelcome empty state.
 */
export interface SuggestedPromptItem {
  id: string;
  title: string;
  description: string;
  promptText: string;
  iconKind: SuggestedPromptIconKind;
}

export type ChatDrawerPlacement =
  | 'left-of-mascot'
  | 'right-of-mascot'
  | 'above-mascot'
  | 'below-mascot';

/**
 * Computed viewport-safe fixed geometry for the WebMate chat drawer.
 */
export interface ChatDrawerLayout {
  left: number;
  top: number;
  width: number;
  height: number;
  maxHeight: number;
  placement: ChatDrawerPlacement;
}

export const DEFAULT_SUGGESTED_PROMPTS: readonly SuggestedPromptItem[] = [
  {
    id: 'explain-page',
    title: 'Explain this webpage',
    description: 'Clarify key sections and context',
    promptText: 'Explain what this webpage is about in clear, simple points.',
    iconKind: 'page',
  },
  {
    id: 'help-write',
    title: 'Help me write something',
    description: 'Draft, polish, or refine wording',
    promptText: 'Help me write a clear, natural message for ',
    iconKind: 'write',
  },
  {
    id: 'summarize-content',
    title: 'Summarize this content',
    description: 'Pull out the main takeaways',
    promptText: 'Summarize the main takeaways from this content concisely.',
    iconKind: 'summary',
  },
  {
    id: 'answer-question',
    title: 'Answer a question',
    description: 'Explore a topic or clear up doubts',
    promptText: 'Can you help answer a question about ',
    iconKind: 'question',
  },
];

