import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import path from 'path';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src'),
        '@library': path.resolve('../aurora-visual-assets'),
      },
    },
    server: {
      fs: {
        allow: [
          path.resolve('.'),
          path.resolve('../aurora-visual-assets'),
        ],
      },
    },
  },
});
