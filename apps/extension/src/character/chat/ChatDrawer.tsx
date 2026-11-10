import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CompanionPosition } from '@webmate/shared';
import type { CharacterAssetRegistry } from '../types';
import { ChatComposer } from './ChatComposer';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';
import { computeChatDrawerLayout } from './chatPositioning';
import {
  DEFAULT_SUGGESTED_PROMPTS,
  type ChatMessage,
  type SuggestedPromptItem,
} from './chat.types';

export interface ChatDrawerProps {
  /** Whether the conversational chat drawer is visible */
  isOpen: boolean;
  /** Closes the chat drawer without altering mascot position or Avatar Studio */
  onClose: () => void;
  /** Active in-memory conversation messages from the companion store */
  messages: readonly ChatMessage[];
  /** Reserved generation flag for future AI integration */
  isGenerating: boolean;
  /** Appends a validated local user message and starts a conversation ID if needed */
  onSendMessage: (content: string) => ChatMessage | null;
  /** Resets active conversation messages, conversation ID, and generation state */
  onNewConversation: () => void;
  /** Current mascot viewport coordinates and dock side */
  companionPosition: CompanionPosition;
  /** True while the floating mascot is being actively dragged */
  isDragging: boolean;
  /** True when Avatar Studio is open so positioning avoids overlap on desktop */
  isAvatarStudioOpen: boolean;
  /** Canonical character artwork registry reflecting active built-in customizations */
  assetRegistry: CharacterAssetRegistry;
  /** Trigger element reference for restoring focus cleanly on close */
  restoreFocusRef?: React.RefObject<HTMLButtonElement>;
}

/**
 * Shadow DOM conversational chat drawer anchored beside WebMate.
 * Coordinates viewport-aware positioning, keyboard accessibility, focus restoration,
 * local conversation state, and New Chat resets without mutating mascot position or Studio state.
 */
export const ChatDrawer: React.FC<ChatDrawerProps> = React.memo(
  ({
    isOpen,
    onClose,
    messages,
    isGenerating,
    onSendMessage,
    onNewConversation,
    companionPosition,
    isDragging,
    isAvatarStudioOpen,
    assetRegistry,
    restoreFocusRef,
  }) => {
    const drawerRef = useRef<HTMLElement | null>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const composerInputRef = useRef<HTMLTextAreaElement>(null);
    const focusRafRef = useRef<number | null>(null);
    const wasOpenRef = useRef(false);

    const [draftText, setDraftText] = useState('');
    const [viewportSize, setViewportSize] = useState(() => ({
      width: typeof window !== 'undefined' ? window.innerWidth : 1280,
      height: typeof window !== 'undefined' ? window.innerHeight : 800,
    }));

    // Keep viewport metrics fresh on window resize with proper cleanup.
    useEffect(() => {
      if (typeof window === 'undefined') return;

      const handleResize = () => {
        setViewportSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener('resize', handleResize, { passive: true });
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    // Cancel any queued focus animation frame on unmount.
    useEffect(() => {
      return () => {
        if (focusRafRef.current !== null) {
          cancelAnimationFrame(focusRafRef.current);
          focusRafRef.current = null;
        }
      };
    }, []);

    // Move focus cleanly into the composer on open and restore trigger focus on close.
    useEffect(() => {
      if (isOpen && !wasOpenRef.current) {
        wasOpenRef.current = true;
        const rafId = requestAnimationFrame(() => {
          composerInputRef.current?.focus();
        });
        return () => cancelAnimationFrame(rafId);
      }

      if (!isOpen && wasOpenRef.current) {
        wasOpenRef.current = false;

        const rootNode = restoreFocusRef?.current?.getRootNode();
        const activeElement =
          rootNode instanceof ShadowRoot ? rootNode.activeElement : document.activeElement;
        const customizerPanel =
          rootNode instanceof ShadowRoot
            ? rootNode.getElementById('webmate-customizer-panel')
            : null;
        const customizeTrigger =
          rootNode instanceof ShadowRoot
            ? rootNode.querySelector('.webmate-customize-trigger')
            : null;
        const isFocusInStudio =
          Boolean(
            customizerPanel &&
              activeElement instanceof Node &&
              customizerPanel.contains(activeElement)
          ) || activeElement === customizeTrigger;

        if (!isFocusInStudio) {
          const rafId = requestAnimationFrame(() => {
            restoreFocusRef?.current?.focus();
          });
          return () => cancelAnimationFrame(rafId);
        }
      }

      wasOpenRef.current = isOpen;
      return undefined;
    }, [isOpen, restoreFocusRef]);

    const layout = useMemo(
      () =>
        computeChatDrawerLayout({
          viewportWidth: viewportSize.width,
          viewportHeight: viewportSize.height,
          companionPosition,
          isDragging,
          isAvatarStudioOpen,
        }),
      [
        viewportSize.width,
        viewportSize.height,
        companionPosition,
        isDragging,
        isAvatarStudioOpen,
      ]
    );

    const scheduleComposerFocus = useCallback((cursorEnd?: number) => {
      if (focusRafRef.current !== null) {
        cancelAnimationFrame(focusRafRef.current);
      }
      focusRafRef.current = requestAnimationFrame(() => {
        focusRafRef.current = null;
        const el = composerInputRef.current;
        if (!el) return;
        el.focus();
        if (typeof cursorEnd === 'number') {
          el.setSelectionRange(cursorEnd, cursorEnd);
        }
      });
    }, []);

    const handleNewConversation = useCallback(() => {
      onNewConversation();
      setDraftText('');
      scheduleComposerFocus();
    }, [onNewConversation, scheduleComposerFocus]);

    const handleSelectPrompt = useCallback(
      (prompt: SuggestedPromptItem) => {
        setDraftText(prompt.promptText);
        scheduleComposerFocus(prompt.promptText.length);
      },
      [scheduleComposerFocus]
    );

    const handleChangeDraft = useCallback((nextText: string) => {
      setDraftText(nextText);
    }, []);

    const handleDrawerKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
      e.stopPropagation();
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    if (!isOpen) {
      return null;
    }

    const isCompactWidth = layout.width < 340;
    const isShortHeight = layout.height < 410;

    return (
      <aside
        ref={drawerRef}
        id="webmate-chat-drawer"
        className={`webmate-chat-drawer placement-${layout.placement} ${
          isCompactWidth ? 'is-compact' : ''
        } ${isShortHeight ? 'is-short' : ''} ${isDragging ? 'is-repositioning' : ''}`}
        role="dialog"
        aria-modal="false"
        aria-labelledby="webmate-chat-title"
        style={{
          left: `${layout.left}px`,
          top: `${layout.top}px`,
          width: `${layout.width}px`,
          height: `${layout.height}px`,
          maxHeight: `${layout.maxHeight}px`,
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onKeyDown={handleDrawerKeyDown}
      >
        <ChatHeader
          onNewConversation={handleNewConversation}
          onClose={onClose}
          closeButtonRef={closeButtonRef}
        />

        <ChatMessageList
          messages={messages}
          assetRegistry={assetRegistry}
          suggestedPrompts={DEFAULT_SUGGESTED_PROMPTS}
          onSelectPrompt={handleSelectPrompt}
          isShortLayout={isShortHeight}
        />

        <ChatComposer
          draftText={draftText}
          onChangeDraft={handleChangeDraft}
          onSendMessage={onSendMessage}
          onRequestClose={onClose}
          isGenerating={isGenerating}
          textareaRef={composerInputRef}
        />
      </aside>
    );
  }
);

ChatDrawer.displayName = 'ChatDrawer';
