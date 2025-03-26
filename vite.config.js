import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },

  plugins: [
    vue(),
  ],

  optimizeDeps: {
    include: ['codemirror', 'codemirror-editor-vue3']
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  test: {
    globals: true,
    environment: 'jsdom'
  }
})