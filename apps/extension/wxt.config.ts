import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'WebMate',
    description: 'Your interactive AI-powered browser companion',
    version: '0.1.0',
    permissions: [
      'activeTab',
      'storage',
      'scripting',
    ],
    action: {
      default_title: 'WebMate',
    },
  },
});
