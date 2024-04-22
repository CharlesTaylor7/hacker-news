import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/hacker-news/',
  plugins: [react()],
  esbuild: {
    keepNames: true,
  },
  css: {
    postcss: {
      plugins: [     
        require('tailwindcss'),
      ]
    },
  },
  optimizeDeps: {
    force: true,
  },
})
