/**
 * Modale "Elimina azienda" (F12 — REQ-003).
 *
 * DEC-038: eliminazione protetta — hard-delete irreversibile.
 *   Prima di abilitare il pulsante "Elimina definitivamente", Matteo deve
 *   RISCRIVERE IL NOME ESATTO dell'azienda nel campo di conferma.
 *
 * CONFRONTO CASE-SENSITIVE (IMPORTANTE — differisce da DeleteUserModal):
 *   Il server delete_tenant confronta: confirm_name.trim() !== existingOrg.name
 *   Il confronto è case-sensitive (usa trim() ma NON toLowerCase).
 *   Al contrario, delete_admin_user usa toLowerCase su entrambi i lati (case-insensitive).
 *   Il gate client replica ESATTAMENTE il comportamento server:
 *     confirmInput.trim() === tenant.name  (nessun toLowerCase)
 *   Questo è documentato nell'UI con la nota "maiuscole comprese".
 *   (DEC-051: allineamento comportamento server-client per delete_tenant)
 *
 * ERRORE 409 — DUE CASI:
 *   1. confirm_name non corrisponde → errore di confronto (gate client lo previene, ma
 *      il server ricontrolla).
 *   2. Dati operativi presenti (prenotazioni, clienti, ecc.) → errore FK dal DB.
 *      In questo caso il messaggio del server menziona PLAN-DB-006. L'UI lo mostra
 *      in modo comprensibile e suggerisce l'azione corretta.
 *
 * COSA VIENE RIMOSSO (avviso obbligatorio DEC-038):
 *   - L'organizzazione (riga organizations)
 *   - Tutti i feature flag del tenant (tenant_features)
 *   - Tutte le impostazioni del tenant (restaurant_settings)
 *   - Tutti gli utenti admin del tenant (admin_users + utenti Supabase Auth)
 *   - ⚠️ NON vengono rimossi automaticamente dati operativi (prenotazioni, clienti, ecc.)
 *     se presenti → in quel caso il delete fallisce con errore FK e serve PLAN-DB-006.
 *
 * GESTIONE FUNCTION NON DEPLOYATA: stesso pattern di RestaurantSettingsPanel.
 */

import { useState, useCallback, useEffect } from 'react'
import type { UseTenantMutationsReturn } from '@console/hooks/useTenantMutations'

// ---------------------------------------------------------------------------
// Tipi
// ---------------------------------------------------------------------------

export interface DeleteTenantTarget {
  id: string
  name: string
  slug: string
  edition: string
}

interface DeleteTenantModalProps {
  tenant: DeleteTenantTarget
  mutations: UseTenantMutationsReturn
  onSuccess: () => void
  onClose: () => void
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export function DeleteTenantModal({
  tenant,
  mutations,
  onSuccess,
  onClose,
}: DeleteTenantModalProps) {
  // L'utente deve riscrivere il nome esatto per sbloccare il pulsante.
  const [confirmInput, setConfirmInput] = useState('')

  const { state, deleteTenant, resetDelete } = mutations
  const deleteState = state.delete
  const isLoading = deleteState.status === 'loading'

  /**
   * Il pulsante "Elimina definitivamente" è abilitato solo se l'input combacia.
   * Confronto case-sensitive con trim() — STESSO comportamento del server:
   *   server: confirm_name.trim() !== existingOrg.name  (case-sensitive)
   * NON usiamo toLowerCase — diverso da DeleteUserModal (che lo usa per le email).
   * (DEC-051)
   */
  const nameMatches = confirmInput.trim() === tenant.name

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
    // Gate client-side: non inviare se il nome non combacia.
    if (!nameMatches || isLoading) return
    await deleteTenant({
      tenant_id: tenant.id,
      confirm_name: confirmInput,
    })
  }, [nameMatches, isLoading, deleteTenant, tenant.id, confirmInput])

  // Determina se l'errore è un 409 da dati operativi (PLAN-DB-006) o un altro tipo.
  const errorMessage = deleteState.status === 'error' ? deleteState.message : null
  const isOperationalDataError = errorMessage?.includes('PLAN-DB-006') ?? false

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true" aria-labelledby="delete-tenant-title">
      <div style={modalStyle}>
        {/* Intestazione — rossa per sottolineare la distruttività */}
        <div style={modalStyles.header}>
          <h3 id="delete-tenant-title" style={modalStyles.title}>
            Elimina azienda
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
          {/* Avviso irreversibilità con dettaglio di cosa viene rimosso */}
          <div style={modalStyles.warningBanner} role="alert">
            <strong>Azione irreversibile.</strong>
            {' '}Questa azienda sarà eliminata definitivamente. Verranno rimossi:
            <ul style={modalStyles.removalList}>
              <li>L'organizzazione e tutti i suoi dati di configurazione</li>
              <li>Tutti i feature flag e le impostazioni del tenant</li>
              <li>Tutti gli utenti admin associati (+ account Supabase Auth)</li>
            </ul>
            <strong style={modalStyles.warningHighlight}>
              Attenzione:
            </strong>
            {' '}Se esistono dati operativi (prenotazioni, clienti, fasce orarie, ecc.),
            il delete <em>fallirà</em> con un errore — servono prima la pulizia manuale
            o l'esecuzione di <strong>PLAN-DB-006</strong> (ON DELETE CASCADE) da parte di Matteo.
          </div>

          {/* Dettagli azienda da eliminare */}
          <div style={modalStyles.tenantInfo}>
            <span style={modalStyles.tenantInfoLabel}>Azienda:</span>{' '}
            <span style={modalStyles.tenantName}>{tenant.name}</span>
            <span style={modalStyles.tenantSlug}> (/{tenant.slug})</span>
            <span style={modalStyles.tenantEdition}> · {tenant.edition}</span>
          </div>

          {/* Campo di conferma: riscrivere il nome esatto */}
          <label style={modalStyles.label} htmlFor="dt-confirm">
            Per confermare, riscrivi il nome esatto dell'azienda (maiuscole comprese):
          </label>
          <input
            id="dt-confirm"
            type="text"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            disabled={isLoading}
            placeholder={tenant.name}
            style={{
              ...modalStyles.input,
              borderColor: confirmInput.length > 0 && !nameMatches
                ? '#ef4444'
                : '#334155',
            }}
            autoComplete="off"
            spellCheck={false}
          />

          {/* Feedback visivo sulla corrispondenza */}
          {confirmInput.length > 0 && !nameMatches && (
            <p style={modalStyles.mismatchHint}>
              Il nome non corrisponde. Deve essere esattamente:{' '}
              <em style={modalStyles.expectedName}>{tenant.name}</em>
              <br />
              <span style={modalStyles.caseSensitiveNote}>
                Il confronto è case-sensitive (maiuscole e minuscole contano).
              </span>
            </p>
          )}
          {nameMatches && (
            <p style={modalStyles.matchHint}>Nome corrisponde — il pulsante è sbloccato.</p>
          )}

          {/* Errore dal server */}
          {errorMessage && (
            <div style={modalStyles.serverError}>
              {isOperationalDataError ? (
                <>
                  <strong>Impossibile eliminare:</strong> esistono dati operativi collegati
                  (prenotazioni, clienti, ecc.) in altre tabelle.
                  <br />
                  <br />
                  Per eliminare questo tenant occorre una delle due opzioni:
                  <ol style={modalStyles.planList}>
                    <li>Svuotare manualmente i dati nelle tabelle collegate, poi riprovare.</li>
                    <li>
                      Chiedere a Matteo di eseguire{' '}
                      <strong>PLAN-DB-006</strong> (ON DELETE CASCADE su organizations),
                      che rimuoverà automaticamente i dati collegati.
                    </li>
                  </ol>
                  <details style={modalStyles.errorDetails}>
                    <summary style={modalStyles.errorDetailsSummary}>Dettaglio tecnico</summary>
                    <span style={modalStyles.errorDetailsText}>{errorMessage}</span>
                  </details>
                </>
              ) : (
                <>
                  <strong>Errore:</strong> {errorMessage}
                </>
              )}
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
            disabled={!nameMatches || isLoading}
            title={!nameMatches ? 'Riscrivi il nome esatto per sbloccare' : 'Elimina definitivamente'}
            style={{
              ...modalStyles.deleteBtn,
              opacity: !nameMatches || isLoading ? 0.4 : 1,
              cursor: !nameMatches || isLoading ? 'not-allowed' : 'pointer',
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
// Palette coerente con DeleteUserModal / UserList.
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
  maxWidth: '480px',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
}

const modalStyles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.25rem 0.75rem',
    borderBottom: '1px solid #1e293b',
    position: 'sticky' as const,
    top: 0,
    background: '#0f172a',
    zIndex: 1,
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
    padding: '0.75rem',
    color: '#fca5a5',
    fontSize: '0.8rem',
    lineHeight: 1.65,
  } as React.CSSProperties,

  removalList: {
    margin: '0.35rem 0 0.35rem 1.25rem',
    padding: 0,
    fontSize: '0.78rem',
    color: '#fca5a5',
    lineHeight: 1.6,
  } as React.CSSProperties,

  warningHighlight: {
    color: '#fcd34d',
  } as React.CSSProperties,

  tenantInfo: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    padding: '0.1rem 0',
  } as React.CSSProperties,

  tenantInfoLabel: {
    fontWeight: 600,
    color: '#64748b',
    fontSize: '0.75rem',
    letterSpacing: '0.03em',
  } as React.CSSProperties,

  tenantName: {
    fontWeight: 600,
    color: '#e2e8f0',
    fontSize: '0.85em',
  } as React.CSSProperties,

  tenantSlug: {
    fontFamily: 'monospace',
    fontSize: '0.8em',
    color: '#64748b',
  } as React.CSSProperties,

  tenantEdition: {
    fontSize: '0.75em',
    color: '#475569',
    fontStyle: 'italic' as const,
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

  expectedName: {
    fontFamily: 'monospace',
    color: '#fca5a5',
  } as React.CSSProperties,

  caseSensitiveNote: {
    color: '#f59e0b',
    fontSize: '0.68rem',
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
    padding: '0.6rem 0.75rem',
    color: '#fca5a5',
    fontSize: '0.75rem',
    lineHeight: 1.6,
  } as React.CSSProperties,

  planList: {
    margin: '0.4rem 0 0.2rem 1.2rem',
    padding: 0,
    color: '#fca5a5',
    fontSize: '0.75rem',
    lineHeight: 1.7,
  } as React.CSSProperties,

  errorDetails: {
    marginTop: '0.5rem',
  } as React.CSSProperties,

  errorDetailsSummary: {
    cursor: 'pointer',
    color: '#94a3b8',
    fontSize: '0.7rem',
  } as React.CSSProperties,

  errorDetailsText: {
    display: 'block',
    marginTop: '0.3rem',
    fontFamily: 'monospace',
    fontSize: '0.65rem',
    color: '#64748b',
    wordBreak: 'break-all' as const,
  } as React.CSSProperties,

  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem 1rem',
    borderTop: '1px solid #1e293b',
    position: 'sticky' as const,
    bottom: 0,
    background: '#0f172a',
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
