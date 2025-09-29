import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  publicDir: 'assets',
  build: {
    outDir: 'dist'
  },
  server: {
    port: 5173,
    open: '/lp.html'
  }
})
