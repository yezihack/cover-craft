import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/cover-craft/' : '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 7005,
  },
  build: {
    rollupOptions: {
      onLog(_level, log) {
        if (log.code === 'INVALID_ANNOTATION' &&
            log.message.includes('@vueuse/core')) {
          return
        }
      },
    },
  },
})
