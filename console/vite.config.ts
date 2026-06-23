import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Console super-admin — sotto-progetto isolato.
// NON importa nulla da ../src: client e chiavi Supabase sono separati dall'app di Matteo.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Alias locale alla Console; non collide con @/ dell'app root.
      '@console': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Porta separata per non collidere con l'app di Matteo (5173).
    port: 5174,
  },
  build: {
    outDir: 'dist',
  },
})
