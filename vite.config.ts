import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
      '~pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '~widgets': fileURLToPath(new URL('./src/widgets', import.meta.url)),
      '~features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '~shared': fileURLToPath(new URL('./src/shared', import.meta.url))
    }
  }
})
