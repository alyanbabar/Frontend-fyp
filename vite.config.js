import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for this project.
// `react()` enables JSX support and fast refresh during development.
export default defineConfig({
  plugins: [react()],
})
