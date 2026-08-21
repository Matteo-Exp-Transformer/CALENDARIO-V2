import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    // supabase/functions/** sono test Deno (import https://…), si eseguono con `deno test`, non Vitest.
    exclude: [
      'node_modules',
      'dist',
      'e2e/**',
      '.claude/**',
      'agenti-locali/**',
      'supabase/functions/**',
      // Console super-admin: sotto-progetto isolato, ha la sua pipeline separata.
      'console/**',
      // docs/Archives: 192 file di test di progetti passati, raccolti per errore da Vitest.
      // Erano l'unica causa del rosso globale: senza, la suite e 163 file / 1346 test verdi.
      // Aperto come SK-0 in docs/MetaSkillSystem/PLAN_V0.md §4-bis.
      'docs/Archives/**',
    ],
    env: {
      VITE_SUPABASE_URL: 'https://test.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'test-anon-key-xxxxxxxxxxxxxxxxxxxxxxxxxxx',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        lines: 50,
        functions: 50,
        branches: 50,
        statements: 50,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
