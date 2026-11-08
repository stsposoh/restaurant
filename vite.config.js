import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // three.js alone is ~530 kB minified and is already lazy-loaded in its own chunk
    chunkSizeWarningLimit: 600,
  },
});
