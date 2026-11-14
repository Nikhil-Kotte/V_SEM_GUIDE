import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from https://nikhil-kotte.github.io/V_SEM_GUIDE/ — every asset URL must respect this base.
export default defineConfig({
  base: '/V_SEM_GUIDE/',
  plugins: [react()],
  // vmThreads: on Node 22.23.5 the default worker pool fails to load vitest itself ("reading 'config'").
  test: { environment: 'node', pool: 'vmThreads' },
})
