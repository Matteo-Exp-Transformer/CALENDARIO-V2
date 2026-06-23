/**
 * Modale "Modifica utente admin" (F11 — REQ-001 scrittura).
 *
 * COSA FA:
 *   Form pre-compilato con name, email e azienda dell'utente selezionato.
 *   Chiama update_admin_user via useAdminUserMutations. Dopo successo notifica
 *   il genitore (refetch lista).
 *
 * CAMPI MODIFICABILI: name, email, tenant_id (azienda associata).
 *   La email viene propagata sia in admin_users sia in Auth (lato Edge).
 *
 * DEC-037: l'azione vale su qualunque utente/azienda del progetto TEST.
 *
 * GESTIONE FUNCTION NON DEPLOYATA: stesso pattern di CreateUserModal.
 */

import { useState, useCallback, useEffect } from 'react'
import type { UseAdminUserMutationsReturn } from '@console/hooks/useAdminUserMutations'
import type { OrgOption } from '@console/components/CreateUserModal'

// ---------------------------------------------------------------------------
// Tipi
// ---------------------------------------------------------------------------

export interface EditUserTarget {
  id: string
  email: string
  name: string | null
  tenant_id: string
}

interface EditUserModalProps {
  user: EditUserTarget
  organizations: OrgOption[]
  mutations: UseAdminUserMutationsReturn
  onSuccess: () => void
  onClose: () => void
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function EditUserModal({
  user,
  organizations,
  mutations,
  onSuccess,
  onClose,
}: EditUserModalProps) {
  const [email, setEmail] = useState(user.email)
  const [name, setName] = useState(user.name ?? '')
  const [tenantId, setTenantId] = useState(user.tenant_id)
  const [validationError, setValidationError] = useState<string | null>(null)

  const { state, updateUser, resetUpdate } = mutations
  const updateState = state.update
  const isLoading = updateState.status === 'loading'

  // Dopo successo: notifica genitore e chiudi.
  useEffect(() => {
    if (updateState.status === 'success') {
      onSuccess()
      onClose()
      resetUpdate()
    }
  }, [updateState.status, onSuccess, onClose, resetUpdate])

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
    if (!tenantId) return 'Seleziona un\'azienda.'
    return null
  }, [email, tenantId])

  const handleSubmit = useCallback(async () => {
    const err = validate()
    if (err) {
      setValidationError(err)
      return
    }
    setValidationError(null)

    // Passa solo i campi che potrebbero essere cambiati.
    await updateUser({
      admin_user_id: user.id,
      name: name.trim() || undefined,
      tenant_id: tenantId !== user.tenant_id ? tenantId : undefined,
      email: email.trim() !== user.email ? email.trim() : undefined,
    })
  }, [validate, updateUser, user, name, tenantId, email])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !isLoading) void handleSubmit()
    },
    [isLoading, handleSubmit],
  )

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true" aria-labelledby="edit-user-title">
      <div style={modalStyle}>
        {/* Intestazione */}
        <div style={modalStyles.header}>
          <h3 id="edit-user-title" style={modalStyles.title}>Modifica utente</h3>
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
          {/* Info utente corrente */}
          <p style={modalStyles.currentInfo}>
            Stai modificando:{' '}
            <span style={modalStyles.emailMonospace}>{user.email}</span>
          </p>

          {/* Email */}
          <label style={modalStyles.label} htmlFor="eu-email">Email</label>
          <input
            id="eu-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            style={modalStyles.input}
            autoComplete="off"
          />

          {/* Nome */}
          <label style={modalStyles.label} htmlFor="eu-name">Nome</label>
          <input
            id="eu-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Nome e cognome"
            style={modalStyles.input}
          />

          {/* Azienda */}
          <label style={modalStyles.label} htmlFor="eu-tenant">Azienda associata</label>
          <select
            id="eu-tenant"
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

          {/* Errore dal server */}
          {updateState.status === 'error' && (
            <div style={modalStyles.serverError}>
              <strong>Errore:</strong> {updateState.message}
            </div>
          )}
        </div>

        {/* Footer */}
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
            {isLoading ? 'Salvataggio…' : 'Salva modifiche'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stili inline — coerenti con CreateUserModal / RestaurantSettingsPanel.
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

  currentInfo: {
    fontSize: '0.75rem',
    color: '#64748b',
    margin: '0 0 0.4rem',
    lineHeight: 1.5,
  } as React.CSSProperties,

  emailMonospace: {
    fontFamily: 'monospace',
    fontSize: '0.8em',
    color: '#93c5fd',
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
