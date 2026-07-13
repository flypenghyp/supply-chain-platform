import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['antd', '@ant-design/icons', 'react-router-dom', 'react', 'react-dom']
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        entryFileNames: `assets/index-[hash].js`,
        chunkFileNames: `assets/chunk-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
        format: 'iife',
        name: 'App',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-router-dom': 'ReactRouterDOM'
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  },
  proxy: {
    '/api': {
      target: 'http://localhost:5001',
      changeOrigin: true,
    }
  }
})
