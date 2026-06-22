import { useState } from 'react'
import { supabase } from '@console/lib/supabaseClient'

type SendState =
  | { status: 'idle' }
  | { status: 'sending' }
  | { status: 'sent'; email: string }
  | { status: 'error'; message: string }

/**
 * Schermata di login con Magic Link (passwordless email OTP).
 *
 * Perché Magic Link e non email+password:
 *   - C'è un solo utente (Matteo): niente gestione password dimenticata, niente reset flow.
 *   - Il Magic Link è più sicuro: la password non esiste, quindi non può essere intercettata.
 *   - Esperienza mobile ottimale: Matteo può autenticarsi dal telefono senza digitare password.
 *
 * Flusso:
 *   1. Matteo inserisce l'email e clicca "Invia link".
 *   2. Supabase invia una email con un link a 6 cifre OTP o un link magico.
 *   3. Matteo clicca il link → la sessione viene creata → onAuthStateChange in useAuth
 *      aggiorna lo stato → l'app mostra AppShell.
 *
 * Note sicurezza:
 *   - Il controllo allowlist avviene in useAuth DOPO che Supabase ha autenticato l'utente.
 *   - Questo significa che Supabase invierà il link anche a email non in allowlist
 *     (il link arriverà, ma al click l'app farà signOut e mostrerà il messaggio di accesso negato).
 *   - Per rinforzare l'allowlist lato DB/RLS, vedi PLAN-DB-002. Il blocco dell'invio
 *     OTP a livello Supabase Auth richiederebbe un Auth Hook dedicato (non ancora pianificato).
 */

interface LoginScreenProps {
  /** Messaggio da mostrare quando l'utente ha una sessione ma è fuori allowlist. */
  deniedEmail?: string
}

export function LoginScreen({ deniedEmail }: LoginScreenProps) {
  const [email, setEmail] = useState('')
  const [sendState, setSendState] = useState<SendState>({ status: 'idle' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedEmail = email.trim()
    if (!trimmedEmail) return

    setSendState({ status: 'sending' })

    const { error } = await supabase.auth.signInWithOtp({
      email: trimmedEmail,
      options: {
        // shouldCreateUser: false evita la creazione di utenti nuovi non in allowlist.
        // ATTENZIONE: se Matteo non è ancora registrato in Supabase Auth, questa opzione
        // impedisce il primo login. Impostare a true SOLO per il primo setup, poi tornare a false.
        // Alternativa robusta: creare Matteo manualmente in Supabase Dashboard → Auth → Users.
        shouldCreateUser: false,
      },
    })

    if (error) {
      // Supabase restituisce un errore generico se l'utente non esiste e shouldCreateUser=false.
      // Mostriamo sempre un messaggio generico per non rivelare se l'email è registrata o meno.
      setSendState({
        status: 'error',
        message: 'Impossibile inviare il link. Verifica l\'email o contatta il supporto.',
      })
      return
    }

    setSendState({ status: 'sent', email: trimmedEmail })
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.icon}>🔧</div>
          <h1 style={styles.title}>Console super-admin</h1>
          <p style={styles.subtitle}>Solo per Matteo · Area privata</p>
        </div>

        {/* Messaggio accesso negato */}
        {deniedEmail && (
          <div style={styles.deniedBox}>
            <strong>Accesso negato</strong>
            <br />
            L'email <code style={styles.code}>{deniedEmail}</code> non è autorizzata
            ad accedere alla Console. Usa l'account corretto.
          </div>
        )}

        {/* Form invio Magic Link */}
        {sendState.status !== 'sent' && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <label htmlFor="console-email" style={styles.label}>
              Email
            </label>
            <input
              id="console-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="matteo@esempio.com"
              required
              disabled={sendState.status === 'sending'}
              style={styles.input}
              autoComplete="email"
              autoFocus
            />

            {sendState.status === 'error' && (
              <p style={styles.errorText}>{sendState.message}</p>
            )}

            <button
              type="submit"
              disabled={sendState.status === 'sending' || !email.trim()}
              style={{
                ...styles.button,
                opacity: sendState.status === 'sending' || !email.trim() ? 0.5 : 1,
                cursor: sendState.status === 'sending' || !email.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {sendState.status === 'sending' ? 'Invio in corso…' : 'Invia link di accesso'}
            </button>
          </form>
        )}

        {/* Conferma invio */}
        {sendState.status === 'sent' && (
          <div style={styles.sentBox}>
            <div style={styles.sentIcon}>✉️</div>
            <p style={styles.sentTitle}>Link inviato</p>
            <p style={styles.sentText}>
              Controlla la casella di posta di{' '}
              <strong style={{ color: '#93c5fd' }}>{sendState.email}</strong>.
              <br />
              Clicca il link nell'email per accedere.
            </p>
            <button
              onClick={() => setSendState({ status: 'idle' })}
              style={styles.resendButton}
            >
              Reinvia o cambia email
            </button>
          </div>
        )}

        {/* Note */}
        <p style={styles.note}>
          Accesso tramite Magic Link · Nessuna password
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0f172a',
    fontFamily: 'system-ui, sans-serif',
    padding: '1rem',
  } as React.CSSProperties,

  card: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '12px',
    padding: '2rem',
    maxWidth: '400px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.25rem',
  } as React.CSSProperties,

  header: {
    textAlign: 'center' as const,
  } as React.CSSProperties,

  icon: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  } as React.CSSProperties,

  title: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#f8fafc',
    margin: '0 0 0.25rem',
  } as React.CSSProperties,

  subtitle: {
    fontSize: '0.875rem',
    color: '#94a3b8',
    margin: 0,
  } as React.CSSProperties,

  deniedBox: {
    background: '#450a0a',
    border: '1px solid #7f1d1d',
    borderRadius: '8px',
    padding: '0.875rem 1rem',
    color: '#fca5a5',
    fontSize: '0.8rem',
    lineHeight: 1.6,
  } as React.CSSProperties,

  code: {
    fontFamily: 'monospace',
    fontSize: '0.8rem',
    background: '#7f1d1d',
    padding: '0.1rem 0.3rem',
    borderRadius: '4px',
  } as React.CSSProperties,

  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  } as React.CSSProperties,

  label: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#cbd5e1',
    letterSpacing: '0.02em',
  } as React.CSSProperties,

  input: {
    background: '#0f172a',
    border: '1px solid #475569',
    borderRadius: '8px',
    padding: '0.625rem 0.75rem',
    color: '#f1f5f9',
    fontSize: '0.9375rem',
    width: '100%',
    boxSizing: 'border-box' as const,
    outline: 'none',
    // Focus via CSS inline non supportato; accettabile per ora (A11Y: il browser mostra outline nativo)
  } as React.CSSProperties,

  errorText: {
    margin: 0,
    fontSize: '0.8rem',
    color: '#fca5a5',
    lineHeight: 1.5,
  } as React.CSSProperties,

  button: {
    background: '#1d4ed8',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.625rem 1rem',
    fontSize: '0.9rem',
    fontWeight: 600,
    width: '100%',
    transition: 'background 0.15s',
  } as React.CSSProperties,

  sentBox: {
    textAlign: 'center' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '0.5rem',
  } as React.CSSProperties,

  sentIcon: {
    fontSize: '2rem',
  } as React.CSSProperties,

  sentTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#f8fafc',
    margin: 0,
  } as React.CSSProperties,

  sentText: {
    fontSize: '0.875rem',
    color: '#94a3b8',
    lineHeight: 1.6,
    margin: 0,
    textAlign: 'center' as const,
  } as React.CSSProperties,

  resendButton: {
    background: 'transparent',
    border: 'none',
    color: '#60a5fa',
    fontSize: '0.8rem',
    cursor: 'pointer',
    textDecoration: 'underline',
    marginTop: '0.25rem',
    padding: 0,
  } as React.CSSProperties,

  note: {
    textAlign: 'center' as const,
    fontSize: '0.75rem',
    color: '#475569',
    margin: 0,
  } as React.CSSProperties,
} as const
