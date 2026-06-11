import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served as a GitHub Pages project site at https://neilp211.github.io/xonos-lucy/
export default defineConfig({
  base: '/xonos-lucy/',
  plugins: [react()],
})
