import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // In production, fall back to the Render backend if VITE_API_URL is not set
  const apiUrl =
    env.VITE_API_URL ||
    (mode === 'production'
      ? 'https://chilli-nursery.onrender.com/api'
      : 'http://localhost:5000/api')

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl),
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
  }
})
