/// <reference types="vite/client" />

// Variabili d'ambiente tipizzate per la Console super-admin.
// Valori reali in console/.env.local (gitignored).
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
