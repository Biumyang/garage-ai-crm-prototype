import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/garage-ai-crm-prototype/',
  plugins: [react()],
})
