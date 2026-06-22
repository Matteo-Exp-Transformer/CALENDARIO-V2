/**
 * Modale "Crea utente admin" (F11 — REQ-001 scrittura).
 *
 * COSA FA:
 *   Form con email + password + nome (opzionale) + selezione azienda (dropdown
 *   popolato da organizations esistenti). Chiama create_admin_user via
 *   useAdminUserMutations. Dopo successo notifica il genitore (refetch lista).
 *
 * DEC-041: email + password impostati da Matteo; l'admin entra subito.
 * DEC-037: l'azione vale su qualunque azienda del progetto TEST (non solo sandbox).
 *
 * GESTIONE FUNCTION NON DEPLOYATA:
 *   Se callConsoleAdmin ritorna errore (es. URL non configurata), l'errore è
 *   mostrato inline nel modale senza crash — stesso pattern di RestaurantSettingsPanel.
 *
 * VALIDAZIONE CLIENT-SIDE:
 *   email non vuota, password minimo 8 caratteri, azienda selezionata.
 *   La validazione più robusta avviene lato server (Edge Function).
 *
 * RESPONSIVE:
 *   Overlay fisso con modale centrato; si adatta a 375px (max-width 95vw).
 */

import { useState, useCallback, useEffect } from 'react'
import type { UseAdminUserMutationsReturn } from '@console/hooks/useAdminUserMutations'

// ---------------------------------------------------------------------------
// Tipi
// ---------------------------------------------------------------------------

export interface OrgOption {
  id: string
  name: string
  slug: string
}

interface CreateUserModalProps {
  organizations: OrgOption[]
  mutations: UseAdminUserMutationsReturn
  onSuccess: () => void
  onClose: () => void
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function CreateUserModal({
  organizations,
  mutations,
  onSuccess,
  onClose,
}: CreateUserModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [tenantId, setTenantId] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const { state, createUser, resetCreate } = mutations
  const createState = state.create
  const isLoading = createState.status === 'loading'

  // Dopo successo: notifica genitore e chiudi il modale.
  useEffect(() => {
    if (createState.status === 'success') {
      onSuccess()
      onClose()
      resetCreate()
    }
  }, [createState.status, onSuccess, onClose, resetCreate])

  // Chiudi con Escape.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isLoading, onClose])

  const validate = useCallback((): string | null => {
    if (!email.trim()) return 'Email obbligatoria.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return 'Formato email non valido.'
    if (password.length < 8)
      return 'La password deve avere almeno 8 caratteri.'
    if (!tenantId) return 'Seleziona un\'azienda.'
    return null
  }, [email, password, tenantId])

  const handleSubmit = useCallback(async () => {
    const err = validate()
    if (err) {
      setValidationError(err)
      return
    }
    setValidationError(null)
    await createUser({
      email: email.trim(),
      password,
      name: name.trim() || undefined,
      tenant_id: tenantId,
    })
  }, [validate, createUser, email, password, name, tenantId])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !isLoading) void handleSubmit()
    },
    [isLoading, handleSubmit],
  )

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true" aria-labelledby="create-user-title">
      <div style={modalStyle}>
        {/* Intestazione */}
        <div style={modalStyles.header}>
          <h3 id="create-user-title" style={modalStyles.title}>Nuovo utente admin</h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            style={modalStyles.closeBtn}
            aria-label="Chiudi"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div style={modalStyles.body}>
          {/* Email */}
          <label style={modalStyles.label} htmlFor="cu-email">Email *</label>
          <input
            id="cu-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="admin@ristorante.it"
            style={modalStyles.input}
            autoComplete="off"
          />

          {/* Password */}
          <label style={modalStyles.label} htmlFor="cu-password">Password * (min 8 caratteri)</label>
          <input
            id="cu-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="••••••••"
            style={modalStyles.input}
            autoComplete="new-password"
          />

          {/* Nome (opzionale) */}
          <label style={modalStyles.label} htmlFor="cu-name">Nome (opzionale)</label>
          <input
            id="cu-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Mario Rossi"
            style={modalStyles.input}
          />

          {/* Selezione azienda */}
          <label style={modalStyles.label} htmlFor="cu-tenant">Azienda *</label>
          <select
            id="cu-tenant"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            disabled={isLoading}
            style={modalStyles.select}
          >
            <option value="">— seleziona un'azienda —</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name} (/{org.slug})
              </option>
            ))}
          </select>

          {/* Errore di validazione client */}
          {validationError && (
            <div style={modalStyles.validationError}>{validationError}</div>
          )}

          {/* Errore dal server (function non deployata o altro) */}
          {createState.status === 'error' && (
            <div style={modalStyles.serverError}>
              <strong>Errore:</strong> {createState.message}
            </div>
          )}
        </div>

        {/* Footer pulsanti */}
        <div style={modalStyles.footer}>
          <button
            onClick={onClose}
            disabled={isLoading}
            style={modalStyles.cancelBtn}
          >
            Annulla
          </button>
          <button
            onClick={() => void handleSubmit()}
            disabled={isLoading}
            style={{
              ...modalStyles.confirmBtn,
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Creazione…' : 'Crea utente'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stili inline — palette coerente con UserList/RestaurantSettingsPanel.
// ---------------------------------------------------------------------------

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.65)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '1rem',
}

const modalStyle: React.CSSProperties = {
  background: '#0f172a',
  border: '1px solid #334155',
  borderRadius: '12px',
  width: '100%',
  maxWidth: '440px',
  boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
}

const modalStyles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.25rem 0.75rem',
    borderBottom: '1px solid #1e293b',
  } as React.CSSProperties,

  title: {
    margin: 0,
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#f1f5f9',
  } as React.CSSProperties,

  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#64748b',
    fontSize: '1.2rem',
    lineHeight: 1,
    cursor: 'pointer',
    padding: '0',
    fontFamily: 'inherit',
  } as React.CSSProperties,

  body: {
    padding: '1rem 1.25rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.35rem',
  } as React.CSSProperties,

  label: {
    fontSize: '0.72rem',
    fontWeight: 600,
    color: '#94a3b8',
    letterSpacing: '0.03em',
    marginTop: '0.35rem',
  } as React.CSSProperties,

  input: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '6px',
    color: '#f1f5f9',
    fontSize: '0.8375rem',
    padding: '0.45rem 0.65rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
  } as React.CSSProperties,

  select: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '6px',
    color: '#f1f5f9',
    fontSize: '0.8375rem',
    padding: '0.45rem 0.65rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
    cursor: 'pointer',
  } as React.CSSProperties,

  validationError: {
    background: '#1c0505',
    border: '1px solid #7f1d1d',
    borderRadius: '5px',
    padding: '0.35rem 0.6rem',
    color: '#fca5a5',
    fontSize: '0.75rem',
    marginTop: '0.2rem',
  } as React.CSSProperties,

  serverError: {
    background: '#450a0a',
    border: '1px solid #7f1d1d',
    borderRadius: '5px',
    padding: '0.45rem 0.6rem',
    color: '#fca5a5',
    fontSize: '0.75rem',
    lineHeight: 1.5,
    marginTop: '0.2rem',
  } as React.CSSProperties,

  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem 1rem',
    borderTop: '1px solid #1e293b',
  } as React.CSSProperties,

  cancelBtn: {
    background: 'transparent',
    border: '1px solid #334155',
    borderRadius: '6px',
    color: '#94a3b8',
    fontSize: '0.8rem',
    padding: '0.4rem 0.9rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
  } as React.CSSProperties,

  confirmBtn: {
    background: '#1e3a5f',
    border: '1px solid #2563eb',
    borderRadius: '6px',
    color: '#93c5fd',
    fontSize: '0.8rem',
    fontWeight: 700,
    padding: '0.4rem 0.9rem',
    fontFamily: 'inherit',
    transition: 'opacity 0.15s',
  } as React.CSSProperties,
} as const
