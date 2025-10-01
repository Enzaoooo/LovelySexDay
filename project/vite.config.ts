import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/LovelySexDay/', // ajuste para o nome do seu repositório
  build: {
    outDir: 'docs', // pasta usada pelo GitHub Pages
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
