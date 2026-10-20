import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(import.meta.dirname, './src'),
      },
      {
        find: /^react-resizable-panels$/,
        replacement: path.resolve(
          import.meta.dirname,
          './src/shims/react-resizable-panels.ts'
        ),
      },
    ],
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        home: path.resolve(import.meta.dirname, 'index.html'),
        projects: path.resolve(import.meta.dirname, 'projects/index.html'),
        gallery: path.resolve(import.meta.dirname, 'gallery/index.html'),
        services: path.resolve(import.meta.dirname, 'services/index.html'),
        journal: path.resolve(import.meta.dirname, 'journal/index.html'),
        experience: path.resolve(import.meta.dirname, 'experience/index.html'),
        contact: path.resolve(import.meta.dirname, 'contact/index.html'),
        techStack: path.resolve(import.meta.dirname, 'tech-stack/index.html'),
        admin: path.resolve(import.meta.dirname, 'onionbipulking/index.html'),
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
