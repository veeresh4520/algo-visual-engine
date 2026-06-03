import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/algo-visual-engine/',
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/sort': 'http://localhost:5000',
      '/list-vs-set': 'http://localhost:5000',
      '/health': 'http://localhost:5000',
    }
  }
})
