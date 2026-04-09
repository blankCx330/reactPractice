import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo.png'],
      manifest: {
        name: '天气咨询',
        short_name: '天气',
        description: '智能天气查询应用',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'logo-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'logo-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        // 运行时缓存策略
        runtimeCaching: [
          {
            // 缓存天气 API
            urlPattern: /^https:\/\/geoapi\.qweather\.com/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'weather-api',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60, // 5分钟过期
              },
            },
          },
          {
            // 缓存静态资源（包括字体）
            urlPattern: /^https:\/\/.*\.(js|css|png|jpg|svg|woff|woff2|ttf)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-resources',
            },
          },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
