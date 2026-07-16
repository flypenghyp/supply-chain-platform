import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: './',
  root: fileURLToPath(new URL('.', import.meta.url)),
  appType: 'spa',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  optimizeDeps: {
    include: ['antd', '@ant-design/icons', 'react-router-dom', 'react', 'react-dom', 'rc-util', '@rc-component/util']
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    },
    target: 'es2015',
    rollupOptions: {
      output: {
        format: 'umd',
        name: 'App',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-router-dom': 'ReactRouterDOM'
        }
      }
    },
    minify: 'esbuild',
    sourcemap: false
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  server: {
    port: 5175,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      }
    }
  }
})
