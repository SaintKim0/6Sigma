import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// GitHub Pages: workflow sets VITE_BASE=/6Sigma/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
})

