import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ⚠️ Change 'tn-budget' to match your GitHub repository name exactly
export default defineConfig({
  plugins: [react()],
  base: '/TN/',
})
