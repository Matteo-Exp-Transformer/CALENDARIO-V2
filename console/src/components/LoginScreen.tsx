import { useState } from 'react'
import { supabase } from '@console/lib/supabaseClient'

type SubmitState =
  | { status: 'idle' }
  | { status: 'signing-in' }
  | { status: 'error'; message: string }

/**
 * Schermata di login con email + password.
 *
 * Perché email + password (e non Magic Link):
 *   - C'è un solo utente (Matteo): imposta le credenziali una volta e poi entra direttamente.
 *   - La sessione viene salvata da Supabase in localStorage → dopo il primo accesso non
 *     viene più richiesta (finché non si fa logout o il token non scade).
 *   - Nessuna dipendenza dall'invio email / click sul link a ogni accesso.
 *
 * Flusso:
 *   1. Matteo inserisce email + password e clicca "Entra".
 *   2. supabase.auth.signInWithPassword crea la sessione → onAuthStateChange in useAuth
 *      aggiorna lo stato → l'app mostra AppShell.
 *
 * Note sicurezza:
 *   - Il controllo allowlist avviene in useAuth DOPO l'autenticazione: anche con credenziali
 *     valide, se l'email non è in allowlist l'app fa signOut e mostra "accesso negato".
 *   - L'utente va creato una volta sul DB TEST (Supabase Auth). Per rinforzare l'allowlist
 *     lato DB/RLS vedi PLAN-DB-002.
 */

interface LoginScreenProps {
  /** Messaggio da mostrare quando l'utente ha una sessione ma è fuori allowlist. */
  deniedEmail?: string
}

export function LoginScreen({ deniedEmail }: LoginScreenProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedEmail = email.trim()
    if (!trimmedEmail || !password) return

    setSubmitState({ status: 'signing-in' })

    const { error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    })

    if (error) {
      // Messaggio generico per non rivelare se l'email è registrata o meno.
      setSubmitState({
        status: 'error',
        message: 'Email o password non corretti.',
      })
      return
    }
    // Successo: onAuthStateChange in useAuth porta l'app su AppShell.
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

        {/* Form email + password */}
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
            disabled={submitState.status === 'signing-in'}
            style={styles.input}
            autoComplete="email"
            autoFocus
          />

          <label htmlFor="console-password" style={styles.label}>
            Password
          </label>
          <input
            id="console-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={submitState.status === 'signing-in'}
            style={styles.input}
            autoComplete="current-password"
          />

          {submitState.status === 'error' && (
            <p style={styles.errorText}>{submitState.message}</p>
          )}

          <button
            type="submit"
            disabled={submitState.status === 'signing-in' || !email.trim() || !password}
            style={{
              ...styles.button,
              opacity: submitState.status === 'signing-in' || !email.trim() || !password ? 0.5 : 1,
              cursor: submitState.status === 'signing-in' || !email.trim() || !password ? 'not-allowed' : 'pointer',
            }}
          >
            {submitState.status === 'signing-in' ? 'Accesso in corso…' : 'Entra'}
          </button>
        </form>

        {/* Note */}
        <p style={styles.note}>
          Accesso riservato · La sessione resta salvata su questo dispositivo
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
