import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Variabili d\'ambiente Supabase mancanti. Controlla il file .env.local'
  )
}

/** Client autenticato — per operazioni admin (rispetta RLS) */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    flowType: 'pkce',
  },
  global: {
    headers: { 'X-Client-Info': 'booking-admin' },
  },
})

/** Helpers */
export function handleSupabaseError(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message
  }
  return 'Si è verificato un errore. Riprova più tardi.'
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) return null
  return user
}

/** Imposta il tenant corrente per le policy RLS */
export async function setCurrentTenant(tenantId: string) {
  const { error } = await (supabase.rpc as any)('set_tenant', { tid: tenantId })
  if (error) console.error('Errore impostazione tenant:', error)
}
