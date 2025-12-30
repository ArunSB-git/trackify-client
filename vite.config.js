import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5174,       // <-- change your port here
//     strictPort: true, // <-- fail if port is already in use
//   },
// });

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // listen on all network interfaces
    strictPort: false,   // don’t fail if port is in use locally
    port: 5174           // optional local dev port
  },
  preview: {
    host: true, 
    port: process.env.PORT || 4173,               // use Render’s dynamic port
    allowedHosts: ['trackify-client-wy2i.onrender.com'] // whitelist Render host
  },
  build: {
    chunkSizeWarningLimit: 1000 // optional: avoid large chunk warnings
  }
})