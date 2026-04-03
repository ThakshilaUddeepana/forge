import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Increase chunk size warning to avoid noise
    chunkSizeWarningLimit: 1000,
    // Aggressive code splitting for production
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React vendor chunk
          'vendor-react': ['react', 'react-dom', 'react-router-dom', 'react-redux', '@reduxjs/toolkit'],
          // Three.js in its own chunk (it's huge)
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          // Fabric.js in its own chunk
          'vendor-fabric': ['fabric'],
          // UI library
          'vendor-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-tabs',
            '@radix-ui/react-scroll-area',
            'lucide-react',
          ],
        },
      },
    },
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // Remove all console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.warn'],
      },
    },
    // Enable source maps for debugging (disable in prod if not needed)
    sourcemap: false,
    // Target modern browsers for smaller output
    target: 'es2020',
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      'react', 'react-dom', 'react-router-dom', 'react-redux', '@reduxjs/toolkit',
      'three', '@react-three/fiber', '@react-three/drei',
      'stats.js',
    ],
  },
});
