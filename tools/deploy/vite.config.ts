import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    ssr: 'tools/deploy/entry.ts',
    outDir: 'outputs/deploy-data',
    emptyOutDir: true,
    target: 'node22',
    minify: false,
  },
});
