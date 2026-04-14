/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.BASE_URL,
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: resolve(__dirname, './src/test/setup.ts'),
    exclude: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/e2e/**'],
  },
});
