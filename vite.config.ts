import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

const root = import.meta.dirname;

/**
 * Published articles are prerendered to `journal/<id>/index.html` by
 * `scripts/generate-pages.mjs`. They are added to the build inputs so every
 * article ships as its own crawlable document.
 */
const articleInputs: Record<string, string> = (() => {
  const inputs: Record<string, string> = {};
  const journalDirectory = path.resolve(root, 'journal');
  try {
    for (const entry of fs.readdirSync(journalDirectory, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const file = path.join(journalDirectory, entry.name, 'index.html');
      if (fs.existsSync(file)) inputs[`article-${entry.name}`] = file;
    }
  } catch {
    // No journal directory yet.
  }
  return inputs;
})();

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(root, './src'),
      },
      {
        find: /^react-resizable-panels$/,
        replacement: path.resolve(
          root,
          './src/shims/react-resizable-panels.ts'
        ),
      },
    ],
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        home: path.resolve(root, 'index.html'),
        projects: path.resolve(root, 'projects/index.html'),
        gallery: path.resolve(root, 'gallery/index.html'),
        services: path.resolve(root, 'services/index.html'),
        journal: path.resolve(root, 'journal/index.html'),
        experience: path.resolve(root, 'experience/index.html'),
        contact: path.resolve(root, 'contact/index.html'),
        techStack: path.resolve(root, 'tech-stack/index.html'),
        admin: path.resolve(root, 'onionbipulking/index.html'),
        ...articleInputs,
      },
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    allowedHosts: true,
  }
});
