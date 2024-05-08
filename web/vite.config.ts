import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/react-decorated-text' : '',
  plugins: [react()],
  resolve: {
    alias: {
      '@letientai299/react-decorated-text': resolve(__dirname, '../lib/src'),
    },
  },
});
