import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    include: ['src/**/*.test.{ts,tsx}', 'src/**/__tests__/**/*.{ts,tsx}', 'scripts/**/*.test.mjs'],
  },
  resolve: {
    alias: {
      '@': path.resolve('./src'),
      '@library': path.resolve('../aurora-visual-assets'),
    },
  },
});
