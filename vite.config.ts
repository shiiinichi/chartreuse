import { defineConfig } from 'vite';

export default defineConfig({
  server: { host: '127.0.0.1', port: 5173 },
  build: { outDir: 'dist/site', target: 'es2022', cssTarget: ['chrome123', 'firefox128', 'safari17.5'] },
});
