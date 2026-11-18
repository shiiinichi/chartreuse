import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist/lib',
    target: 'es2022',
    cssTarget: ['chrome123', 'firefox128', 'safari17.5'],
    lib: {
      entry: { chartreuse: 'src/system/index.ts', tokens: 'src/system/tokens.ts' },
      formats: ['es'],
      fileName: (_format, name) => `${name}.js`,
      cssFileName: 'chartreuse',
    },
    rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react', 'react-markdown', 'remark-gfm'] },
  },
});
