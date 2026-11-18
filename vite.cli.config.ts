import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: false,
  build: {
    ssr: 'src/cli/chartreuse-cli.mjs',
    target: 'node20',
    outDir: 'dist/lib',
    emptyOutDir: false,
    rollupOptions: { output: { entryFileNames: 'chartreuse-cli.mjs' } },
  },
});
