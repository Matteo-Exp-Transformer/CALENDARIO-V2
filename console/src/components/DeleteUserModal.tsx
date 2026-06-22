/**
 * Modale "Elimina utente admin" (F11 — REQ-001 scrittura).
 *
 * DEC-038: eliminazione protetta — hard-delete irreversibile.
 *   Prima di abilitare il pulsante "Elimina definitivamente", Matteo deve
 *   RISCRIVERE L'EMAIL ESATTA dell'utente nel campo di conferma.
 *   Il confronto è case-insensitive (coerente con la rivalidazione lato server,
 *   che fa toLowerCase su entrambi i lati) e avviene ANCHE nell'Edge Function;
 *   il gate UI impedisce di inviare se non combacia.
 *
 * PERCHÉ QUESTO APPROCCIO:
 *   - Evita eliminazioni accidentali da click doppio o mobile.
 *   - La riscrittura dell'email forza un atto intenzionale esplicito.
 *   - La rivalidazione server garantisce che neanche una chiamata diretta
 *     all'Edge possa aggirare il check (DEC-038, Defense in Depth).
 *
 * GESTIONE FUNCTION NON DEPLOYATA: stesso pattern di RestaurantSettingsPanel.
 *   Se callConsoleAdmin ritorna errore, il messaggio è mostrato inline.
 */

import { useState, useCallback, useEffect } from 'react'
import type { UseAdminUserMutationsReturn } from '@console/hooks/useAdminUserMutations'

// ---------------------------------------------------------------------------
// Tipi
// ---------------------------------------------------------------------------

export interface DeleteUserTarget {
  id: string
  email: string
  name: string | null
}

interface DeleteUserModalProps {
  user: DeleteUserTarget
  mutations: UseAdminUserMutationsReturn
  onSuccess: () => void
  onClose: () => void
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function DeleteUserModal({
  user,
  mutations,
  onSuccess,
  onClose,
}: DeleteUserModalProps) {
  // L'utente deve riscrivere l'email esatta per sbloccare il pulsante.
  const [confirmInput, setConfirmInput] = useState('')

  const { state, deleteUser, resetDelete } = mutations
  const deleteState = state.delete
  const isLoading = deleteState.status === 'loading'

  // Il pulsante "Elimina definitivamente" è abilitato solo se l'input combacia.
  // Confronto case-insensitive per coerenza col server (che fa toLowerCase su entrambi i lati).
  const emailMatches = confirmInput.trim().toLowerCase() === user.email.toLowerCase()

  // Dopo successo: notifica genitore e chiudi.
  useEffect(() => {
    if (deleteState.status === 'success') {
      onSuccess()
      onClose()
      resetDelete()
    }
  }, [deleteState.status, onSuccess, onClose, resetDelete])

  // Chiudi con Escape.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isLoading, onClose])

  const handleDelete = useCallback(async () => {
    // Gate client-side: non inviare se l'email non combacia.
    if (!emailMatches || isLoading) return
    await deleteUser({
      admin_user_id: user.id,
      confirm_email: confirmInput,
    })
  }, [emailMatches, isLoading, deleteUser, user.id, confirmInput])

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true" aria-labelledby="delete-user-title">
      <div style={modalStyle}>
        {/* Intestazione — rossa per sottolineare la distruttività */}
        <div style={modalStyles.header}>
          <h3 id="delete-user-title" style={modalStyles.title}>
            Elimina utente
          </h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            style={modalStyles.closeBtn}
            aria-label="Chiudi"
          >
            ×
          </button>
        </div>

        {/* Corpo */}
        <div style={modalStyles.body}>
          {/* Avviso irreversibilità */}
          <div style={modalStyles.warningBanner} role="alert">
            <strong>Azione irreversibile.</strong>
            {' '}Questo utente sarà eliminato definitivamente dal DB e da Supabase Auth.
            Non è possibile annullare l'operazione.
          </div>

          {/* Dettagli utente da eliminare */}
          <div style={modalStyles.userInfo}>
            <span style={modalStyles.userInfoLabel}>Utente:</span>{' '}
            <span style={modalStyles.emailMonospace}>{user.email}</span>
            {user.name && (
              <span style={modalStyles.userName}> ({user.name})</span>
            )}
          </div>

          {/* Campo di conferma: riscrivere l'email esatta */}
          <label style={modalStyles.label} htmlFor="du-confirm">
            Per confermare, riscrivi l'email esatta:
          </label>
          <input
            id="du-confirm"
            type="text"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            disabled={isLoading}
            placeholder={user.email}
            style={{
              ...modalStyles.input,
              borderColor: confirmInput.length > 0 && !emailMatches
                ? '#ef4444'
                : '#334155',
            }}
            autoComplete="off"
            spellCheck={false}
          />

          {/* Feedback visivo sulla corrispondenza */}
          {confirmInput.length > 0 && !emailMatches && (
            <p style={modalStyles.mismatchHint}>
              L'email non corrisponde. Deve essere esattamente: <em>{user.email}</em>
            </p>
          )}
          {emailMatches && (
            <p style={modalStyles.matchHint}>Email corrisponde — il pulsante è sbloccato.</p>
          )}

          {/* Errore dal server (function non deployata o mismatch server-side) */}
          {deleteState.status === 'error' && (
            <div style={modalStyles.serverError}>
              <strong>Errore:</strong> {deleteState.message}
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
            onClick={() => void handleDelete()}
            disabled={!emailMatches || isLoading}
            title={!emailMatches ? 'Riscrivi l\'email per sbloccare' : 'Elimina definitivamente'}
            style={{
              ...modalStyles.deleteBtn,
              opacity: !emailMatches || isLoading ? 0.4 : 1,
              cursor: !emailMatches || isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Eliminazione…' : 'Elimina definitivamente'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stili inline — toni rossi per evidenziare la distruttività (DEC-038).
// Palette coerente con UserList / RestaurantSettingsPanel.
// ---------------------------------------------------------------------------

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.75)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '1rem',
}

const modalStyle: React.CSSProperties = {
  background: '#0f172a',
  border: '1px solid #7f1d1d',
  borderRadius: '12px',
  width: '100%',
  maxWidth: '420px',
  boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
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
    color: '#fca5a5',
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
    gap: '0.5rem',
  } as React.CSSProperties,

  warningBanner: {
    background: '#450a0a',
    border: '1px solid #7f1d1d',
    borderRadius: '6px',
    padding: '0.6rem 0.75rem',
    color: '#fca5a5',
    fontSize: '0.8rem',
    lineHeight: 1.6,
  } as React.CSSProperties,

  userInfo: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    padding: '0.1rem 0',
  } as React.CSSProperties,

  userInfoLabel: {
    fontWeight: 600,
    color: '#64748b',
    fontSize: '0.75rem',
    letterSpacing: '0.03em',
  } as React.CSSProperties,

  emailMonospace: {
    fontFamily: 'monospace',
    fontSize: '0.85em',
    color: '#93c5fd',
  } as React.CSSProperties,

  userName: {
    color: '#64748b',
    fontSize: '0.8em',
  } as React.CSSProperties,

  label: {
    fontSize: '0.72rem',
    fontWeight: 600,
    color: '#94a3b8',
    letterSpacing: '0.03em',
    marginTop: '0.25rem',
  } as React.CSSProperties,

  input: {
    background: '#1e293b',
    border: '1px solid',
    borderRadius: '6px',
    color: '#f1f5f9',
    fontSize: '0.8375rem',
    padding: '0.45rem 0.65rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
    fontFamily: 'monospace',
    transition: 'border-color 0.15s',
  } as React.CSSProperties,

  mismatchHint: {
    fontSize: '0.7rem',
    color: '#f87171',
    margin: 0,
    lineHeight: 1.5,
  } as React.CSSProperties,

  matchHint: {
    fontSize: '0.7rem',
    color: '#86efac',
    margin: 0,
  } as React.CSSProperties,

  serverError: {
    background: '#450a0a',
    border: '1px solid #7f1d1d',
    borderRadius: '5px',
    padding: '0.45rem 0.6rem',
    color: '#fca5a5',
    fontSize: '0.75rem',
    lineHeight: 1.5,
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

  deleteBtn: {
    background: '#450a0a',
    border: '1px solid #7f1d1d',
    borderRadius: '6px',
    color: '#fca5a5',
    fontSize: '0.8rem',
    fontWeight: 700,
    padding: '0.4rem 0.9rem',
    fontFamily: 'inherit',
    transition: 'opacity 0.15s',
  } as React.CSSProperties,
} as const
