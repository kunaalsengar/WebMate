import React from 'react';
import ReactDOM from 'react-dom/client';
import type { ContentScriptContext, ShadowRootUi } from 'wxt/client';
import { createShadowRootUi } from 'wxt/client';
import { FloatingCompanion } from './FloatingCompanion';

/**
 * References to WebMate's own actively mounted instance and DOM nodes.
 * Used for strict instance tracking without querying or modifying host-owned DOM elements.
 */
let activeUiInstance: ShadowRootUi | null = null;
let activeHostElement: HTMLElement | null = null;
let activeReactRoot: ReactDOM.Root | null = null;

/**
 * Clears internal state references.
 */
function cleanupTrackedState(): void {
  activeUiInstance = null;
  activeHostElement = null;
  activeReactRoot = null;
}

/**
 * Validates whether the current page is a supported target for WebMate injection.
 * Prevents injection into internal browser schemes, XML feeds, or unsupported documents.
 */
export function isSupportedPage(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  const { protocol } = window.location;

  // Only allow standard web protocols
  if (protocol !== 'http:' && protocol !== 'https:') {
    return false;
  }

  // Ensure document is an HTML document (exclude raw SVG, XML, or PDF viewers)
  if (!(document instanceof HTMLDocument)) {
    return false;
  }

  return true;
}

/**
 * Checks if WebMate's own UI instance is actively mounted and connected to the DOM.
 * Handles stale references if the host page removed the container.
 */
export function isAlreadyMounted(): boolean {
  if (!activeHostElement) {
    return false;
  }

  // Verify that WebMate's own tracked host element is still connected to the DOM
  if (activeHostElement.isConnected) {
    return true;
  }

  // Stale reference detected (container was removed externally by host page)
  cleanupTrackedState();
  return false;
}

/**
 * Mounts WebMate's React application into an isolated Shadow DOM container (<webmate-root>).
 *
 * Requirements fulfilled:
 * - Mounts only once per page (idempotent, tracks WebMate's own instance).
 * - Avoids modifying or replacing existing host page DOM nodes.
 * - Encapsulates React inside an open Shadow Root.
 * - Connects lifecycle hooks to WXT ContentScriptContext for safe teardown.
 */
export async function mountWebMate(ctx: ContentScriptContext): Promise<ShadowRootUi | null> {
  // 1. Guard against unsupported URLs and non-HTML documents
  if (!isSupportedPage()) {
    console.debug('[WebMate] Current URL is not a supported HTTP/HTTPS webpage. Skipping mount.');
    return null;
  }

  // 2. Idempotency guard: depend on WebMate's own tracked instance (handles stale references)
  if (isAlreadyMounted()) {
    console.debug('[WebMate] WebMate instance already actively mounted on this page. Skipping duplicate mount.');
    return activeUiInstance;
  }

  // If a stale instance was present, finalize cleanup before re-mounting
  if (activeUiInstance || activeReactRoot || activeHostElement) {
    unmountWebMate();
  }

  try {
    // 3. Create isolated Shadow Root UI using WXT client framework
    const ui = await createShadowRootUi(ctx, {
      name: 'webmate-root',
      position: 'inline',
      anchor: 'body',
      append: 'last',
      onMount: (container, _shadow, shadowHost) => {
        // Track the exact host element created by WebMate
        if (shadowHost instanceof HTMLElement) {
          activeHostElement = shadowHost;
        }

        // Create an isolated sub-container for the React tree
        const appWrapper = document.createElement('div');
        appWrapper.id = 'webmate-app-root';
        container.appendChild(appWrapper);

        // Mount React 18 application and store root reference
        const root = ReactDOM.createRoot(appWrapper);
        activeReactRoot = root;
        root.render(React.createElement(FloatingCompanion));

        return root;
      },
      onRemove: (root) => {
        // WXT owns the primary React root teardown
        if (root) {
          try {
            root.unmount();
          } catch (err) {
            console.warn('[WebMate] Error during React root unmount:', err);
          }
        }
        activeReactRoot = null;
      },
    });

    // 4. Mount container to the host DOM
    ui.mount();
    activeUiInstance = ui;

    // Fallback assignment in case shadowHost was not captured in onMount
    if (!activeHostElement && ui.shadowHost instanceof HTMLElement) {
      activeHostElement = ui.shadowHost;
    }

    // 5. Register cleanup when the content script context is invalidated
    ctx.onInvalidated(() => {
      console.debug('[WebMate] Content script invalidated. Cleaning up WebMate Shadow DOM...');
      unmountWebMate();
    });

    console.debug('[WebMate] Content script and Shadow DOM mounted successfully.');
    return ui;
  } catch (error) {
    console.error('[WebMate] Failed to mount Shadow DOM container:', error);
    cleanupTrackedState();
    return null;
  }
}

/**
 * Safely removes only WebMate's own UI instance and unmounts its React root.
 * Never touches or removes any elements created by the host page.
 */
export function unmountWebMate(): void {
  // 1. Prefer letting WXT's onRemove() own the React root teardown when activeUiInstance exists
  if (activeUiInstance) {
    const ui = activeUiInstance;
    activeUiInstance = null;
    try {
      ui.remove();
    } catch (err) {
      console.warn('[WebMate] Error during UI removal:', err);
    }
  }

  // 2. Safe fallback: unmount React root if no active UI instance handled it
  if (activeReactRoot) {
    try {
      activeReactRoot.unmount();
    } catch (err) {
      console.warn('[WebMate] Error unmounting React root fallback:', err);
    }
    activeReactRoot = null;
  }

  // 3. Fallback: If WebMate's own host element is still connected to DOM, remove only it
  if (activeHostElement && activeHostElement.isConnected && activeHostElement.parentNode) {
    try {
      activeHostElement.parentNode.removeChild(activeHostElement);
    } catch (err) {
      console.warn('[WebMate] Error removing host element:', err);
    }
  }

  activeHostElement = null;
}

