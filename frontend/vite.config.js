import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  // Base path used when deploying the app to GitHub Pages
  base: '/algo-visual-engine/',
  // // React plugin for JSX and Fast Refresh support
  plugins: [react()],
  // Development server configuration
  server: {
    port: 3000,
    // Forward API requests to the backend server running on port 5000
    proxy: {
      '/sort': 'http://localhost:5000',
      '/list-vs-set': 'http://localhost:5000',
      '/health': 'http://localhost:5000',
    }
  }
})
