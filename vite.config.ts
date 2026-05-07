import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['icons/favicon-v2.ico', 'icons/apple-touch-icon-v2.png'],
      manifest: {
        name: 'CalendarBackup',
        short_name: 'CalBackup',
        description: 'Sistema di prenotazioni per ristoranti',
        start_url: '/admin',
        scope: '/',
        display: 'standalone',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        icons: [
          {
            src: '/icons/icon-192-v2.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512-v2.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/apple-touch-icon-v2.png',
            sizes: '180x180',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            // Do not cache Supabase API/auth requests to avoid stale tenant/auth data.
            urlPattern: ({ url, request }) =>
              !url.hostname.includes('supabase.co') &&
              ['style', 'script', 'font', 'image', 'manifest'].includes(request.destination),
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173
  }
})
