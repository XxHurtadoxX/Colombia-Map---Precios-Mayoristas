import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // Proxy para el servicio DANE SIPSA evitando CORS
      '/sipsaWS': {
        target: 'https://appweb.dane.gov.co',
        changeOrigin: true,
        secure: true,
        // Mantener la ruta /sipsaWS para el servicio SOAP
        rewrite: (path) => path,
      }
    }
  },
  plugins: [react()]
})
