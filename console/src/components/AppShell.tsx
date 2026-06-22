// App shell con elenco ristoranti (F2) + logout (F3).
import type { User } from '@supabase/supabase-js'
import { useState } from 'react'
import { supabase } from '@console/lib/supabaseClient'
import { RestaurantList } from './RestaurantList'

interface AppShellProps {
  /** Utente autenticato (da useAuth). Usato per mostrare l'email in header. */
  user: User
}

export function AppShell({ user }: AppShellProps) {
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    // signOut() invalida il token localmente e chiama l'endpoint Supabase.
    // onAuthStateChange in useAuth riceverà SIGNED_OUT e aggiornerà lo stato.
    await supabase.auth.signOut()
    // Non serve setLoggingOut(false): dopo signOut il componente viene smontato
    // perché App.tsx tornerà a mostrare LoginScreen.
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#0f172a',
      fontFamily: 'system-ui, sans-serif',
      color: '#f1f5f9',
    }}>
      {/* Header */}
      <header style={{
        background: '#1e293b',
        borderBottom: '1px solid #334155',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        <span style={{ fontWeight: 700, fontSize: '1rem', flex: 1 }}>Console super-admin</span>

        {/* Email utente autenticato */}
        <span style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.email}
        </span>

        {/* Pulsante logout */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            background: 'transparent',
            border: '1px solid #475569',
            borderRadius: '6px',
            color: '#94a3b8',
            fontSize: '0.75rem',
            padding: '0.3rem 0.65rem',
            cursor: loggingOut ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap' as const,
            opacity: loggingOut ? 0.5 : 1,
          }}
        >
          {loggingOut ? 'Uscita…' : 'Esci'}
        </button>
      </header>

      {/* Main content area */}
      <main style={{ padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
        <RestaurantList />
      </main>
    </div>
  )
}
