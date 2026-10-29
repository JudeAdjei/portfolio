import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build`         -> normal static site in dist/ (deploy to Netlify / Vercel / GitHub Pages)
// `npm run build:single`  -> one self-contained HTML file in dist-single/ (used for the Claude Artifact preview)
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: mode === 'single' ? [react(), viteSingleFile()] : [react()],
  build: mode === 'single'
    ? { outDir: 'dist-single', assetsInlineLimit: 100_000_000, cssCodeSplit: false }
    : { outDir: 'dist', chunkSizeWarningLimit: 900 },
}));
