import { useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@console/lib/supabaseClient'
import { isEmailAllowed } from '@console/lib/authAllowlist'

/**
 * Stati possibili dell'autenticazione.
 *
 * - 'loading'      : stiamo ancora verificando la sessione iniziale (getSession async).
 * - 'unauthenticated' : nessuna sessione attiva → mostra LoginScreen.
 * - 'denied'       : sessione valida Supabase, ma email fuori allowlist → logout + messaggio.
 * - 'authenticated': sessione valida + email in allowlist → mostra AppShell.
 */
export type AuthState =
  | { status: 'loading' }
  | { status: 'unauthenticated' }
  | { status: 'denied'; email: string }
  | { status: 'authenticated'; user: User; session: Session }

/**
 * Hook che gestisce la sessione Supabase Auth + controllo allowlist.
 *
 * Flusso:
 * 1. Al mount: getSession() per recuperare la sessione già esistente (cookie/localStorage).
 * 2. onAuthStateChange: aggiorna lo stato a ogni cambio (login, logout, refresh token).
 * 3. Se la sessione esiste ma l'email non è in allowlist → signOut automatico + stato 'denied'.
 *
 * Perché non usiamo solo onAuthStateChange:
 *   Con SSR/strict mode, onAuthStateChange può non firedare INITIAL_SESSION in modo affidabile
 *   su tutti i browser. La combinazione getSession() + listener è il pattern consigliato da
 *   Supabase per le SPA (docs.supabase.com/docs/guides/auth/auth-helpers/auth-ui#setup).
 */
export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({ status: 'loading' })

  useEffect(() => {
    let mounted = true

    /**
     * Calcola il nuovo AuthState dato una sessione (o null).
     * Se la sessione c'è ma l'email non è in allowlist, fa signOut e torna 'denied'.
     */
    async function resolveSession(session: Session | null): Promise<void> {
      if (!session) {
        if (mounted) setAuthState({ status: 'unauthenticated' })
        return
      }

      const email = session.user.email
      if (!isEmailAllowed(email)) {
        // Email fuori allowlist: termina la sessione Supabase e notifica.
        // Usiamo signOut() per pulire i token dal localStorage.
        await supabase.auth.signOut()
        if (mounted) {
          setAuthState({
            status: 'denied',
            email: email ?? '(email sconosciuta)',
          })
        }
        return
      }

      if (mounted) {
        setAuthState({
          status: 'authenticated',
          user: session.user,
          session,
        })
      }
    }

    // 1. Recupera la sessione corrente (potrebbe già esserci da una visita precedente).
    supabase.auth.getSession().then(({ data: { session } }) => {
      resolveSession(session)
    })

    // 2. Ascolta i cambi futuri (SIGNED_IN dopo magic link, SIGNED_OUT dopo logout).
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      resolveSession(session)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return authState
}
