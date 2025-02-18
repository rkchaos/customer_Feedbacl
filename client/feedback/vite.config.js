import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    global: 'window',
  },
  // Suppress specific React deprecation warnings in development
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})
