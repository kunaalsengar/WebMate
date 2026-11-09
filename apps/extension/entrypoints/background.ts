import { defineBackground } from 'wxt/sandbox';

/**
 * WebMate Extension Background Service Worker
 *
 * Phase 0: Baseline lifecycle initialization.
 * Chrome Manifest V3 service worker entrypoint.
 */
export default defineBackground(() => {
  console.log('[WebMate] Background service worker initialized (Phase 0).');

  // Listen for extension installation or update
  browser.runtime.onInstalled.addListener((details) => {
    console.log('[WebMate] Extension installed/updated:', details.reason);
  });
});
