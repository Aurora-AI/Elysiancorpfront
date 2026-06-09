import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import path from 'path';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  vite: {
    resolve: {
      modules: [path.resolve('./node_modules'), 'node_modules'],
      alias: {
        '@': path.resolve('./src'),
        '@library': path.resolve('../aurora-visual-assets'),
        'framer-motion': path.resolve('./node_modules/framer-motion'),
        'class-variance-authority': path.resolve('./node_modules/class-variance-authority'),
        'lucide-react': path.resolve('./node_modules/lucide-react'),
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
    ssr: {
      noExternal: ['@library', 'framer-motion', 'class-variance-authority', 'lucide-react'],
      external: ['remotion', '@remotion/player']
    },
    optimizeDeps: {
      exclude: ['remotion', '@remotion/player']
    }
  },
});
