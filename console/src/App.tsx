import { useAuth } from './hooks/useAuth'
import { AppShell } from './components/AppShell'
import { LoginScreen } from './components/LoginScreen'

/**
 * Root dell'app Console.
 *
 * F3: auth reale con Supabase Auth (Magic Link passwordless) + gate allowlist email.
 *
 * Flusso stati:
 *   loading       → schermata di caricamento (evita flash di login)
 *   unauthenticated → LoginScreen (form invio magic link)
 *   denied        → LoginScreen con banner "accesso negato" (email fuori allowlist)
 *   authenticated → AppShell (elenco ristoranti + logout)
 *
 * Sicurezza: il gate allowlist è UX (lato client). La difesa forte è la RLS del DB.
 * Vedi docs/Console-Skill/plan-per-matteo/PLAN-DB-002-allowlist-auth.md.
 */
function App() {
  const auth = useAuth()

  // Stato iniziale: getSession() è asincrono; mostriamo uno schermo nero per evitare flash.
  if (auth.status === 'loading') {
    return (
      <div style={{
        minHeight: '100dvh',
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        color: '#475569',
        fontSize: '0.875rem',
      }}>
        Caricamento…
      </div>
    )
  }

  if (auth.status === 'authenticated') {
    return <AppShell user={auth.user} />
  }

  // 'unauthenticated' o 'denied' → LoginScreen (con o senza banner accesso negato)
  return (
    <LoginScreen
      deniedEmail={auth.status === 'denied' ? auth.email : undefined}
    />
  )
}

export default App
