import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for framework
          'vendor': ['@pesca-dev/atomicity'],

          // Blog dependencies - lazy loaded
          'blog': [
            'marked',
            'marked-highlight',
          ],

          // Syntax highlighting - lazy loaded
          'highlight': [
            'highlight.js/lib/core',
            'highlight.js/lib/languages/javascript',
            'highlight.js/lib/languages/typescript',
            'highlight.js/lib/languages/python',
            'highlight.js/lib/languages/rust',
            'highlight.js/lib/languages/json',
            'highlight.js/lib/languages/bash',
            'highlight.js/lib/languages/yaml',
            'highlight.js/lib/languages/markdown',
            'highlight.js/lib/languages/xml',
          ],
        },
      },
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  // Enable source maps for better debugging
  optimizeDeps: {
    exclude: ['@pesca-dev/atomicity'],
  },
});
