import './style.css';
import { defineContentScript } from 'wxt/sandbox';
import { mountWebMate } from '../../src/content/mount';

/**
 * WebMate Content Script Entrypoint
 *
 * Runs on supported HTTP and HTTPS websites.
 * Attaches the <webmate-root> custom element and mounts the React application
 * inside an open Shadow DOM to guarantee total CSS and DOM isolation from host pages.
 */
export default defineContentScript({
  matches: ['http://*/*', 'https://*/*'],
  cssInjectionMode: 'ui',
  runAt: 'document_idle',
  async main(ctx) {
    console.debug('[WebMate] Initializing WebMate content script...');
    await mountWebMate(ctx);
  },
});

