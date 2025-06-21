import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

// Vite config with alias paths
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@containers': path.resolve(__dirname, 'src/containers'),
      '@context': path.resolve(__dirname, 'src/context'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@utilities': path.resolve(__dirname, 'src/utilities'),
    },
  },
  server: {
    port: 3000,
  },
});
