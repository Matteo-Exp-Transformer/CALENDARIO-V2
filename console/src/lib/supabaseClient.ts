import { createClient } from '@supabase/supabase-js'

// Client Supabase della Console — usa solo la chiave pubblica (anon/publishable).
// La service role key NON appartiene qui: le scritture privilegiate passano da Edge Functions.
// Variabili lette da .env.local (non committato) tramite import.meta.env (Vite).

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[Console] VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY sono richieste. ' +
    'Copia console/.env.example in console/.env.local e inserisci i valori reali.'
  )
}

// Client isolato dalla Console: NON condivide stato con il client dell'app di Matteo.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
