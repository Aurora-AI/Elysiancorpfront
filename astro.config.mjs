import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://astro.build/config
// output: 'static' (Astro v6 default) — pages are SSG by default.
// In Astro v6, 'hybrid' was removed; 'static' now supports server endpoints
// via `export const prerender = false` per-file.
// adapter: vercel — required to run those server endpoints on Vercel.
export default defineConfig({
  output: 'static',
  adapter: vercel(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
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
      external: ['remotion', '@remotion/player', '@react-three/fiber', '@react-three/drei', 'three']
    },
    optimizeDeps: {
      exclude: ['remotion', '@remotion/player']
    }
  },
});
