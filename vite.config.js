import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            'react-markdown',
            'react-syntax-highlighter'
          ],
          markdown: [
            'markdown-to-jsx',
            'gray-matter',
            'front-matter'
          ]
        }
      }
    }
  }
})
