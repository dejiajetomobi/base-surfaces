import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    proxy: {
      '/api/wise-rates': {
        target: 'https://wise.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/wise-rates/, '/rates/live'),
      },
    },
  },
});
