import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    drop: ['console'],
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 200,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return undefined;
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/scheduler/')
          ) {
            return 'react-vendor';
          }
          if (
            id.includes('/react-markdown') ||
            id.includes('/remark-') ||
            id.includes('/unified') ||
            id.includes('/mdast-') ||
            id.includes('/micromark') ||
            id.includes('/decode-named-character-reference') ||
            id.includes('/character-entities') ||
            id.includes('/property-information') ||
            id.includes('/hast-util-') ||
            id.includes('/space-separated-tokens') ||
            id.includes('/comma-separated-tokens') ||
            id.includes('/web-namespaces') ||
            id.includes('/zwitch') ||
            id.includes('/vfile') ||
            id.includes('/bail') ||
            id.includes('/is-plain-obj') ||
            id.includes('/trough') ||
            id.includes('/trim-lines') ||
            id.includes('/devlop') ||
            id.includes('/estree-util-') ||
            id.includes('/html-url-attributes') ||
            id.includes('/ccount') ||
            id.includes('/escape-string-regexp') ||
            id.includes('/markdown-table') ||
            id.includes('/longest-streak')
          ) {
            return 'markdown-vendor';
          }
          return undefined;
        },
      },
    },
  },
});
