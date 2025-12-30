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
export default defineConfig({
  plugins: [react()],
})