import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  publicDir: 'assets',
  build: {
    outDir: 'dist',
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    
    // Asset optimization
    assetsInlineLimit: 4096,
    
    // CSS optimization
    cssCodeSplit: true,
    
    // Source maps for production debugging
    sourcemap: false,
  },
  server: {
    port: 5173,
    open: '/lp.html'
  },
  
  // CSS preprocessing
  css: {
    devSourcemap: false,
  },
  
  // Asset handling
  assetsInclude: ['**/*.webp', '**/*.mp4'],
})
