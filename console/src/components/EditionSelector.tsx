/**
 * Controllo inline per cambiare l'edition di un tenant sandbox.
 *
 * REGOLA SANDBOX (RULE-2):
 *   Questo componente è pensato per essere montato SOLO su tenant sandbox (console-classic,
 *   console-pro). Il controllo isSandboxTenant è nel componente genitore (OrgCard in
 *   RestaurantList). Se per errore viene montato su un non-sandbox, non causa danni: la
 *   chiamata alla Edge Function è il gate lato server.
 *
 * STATI GESTITI:
 *   - idle/loading: mostra i tre bottoni di selezione edition (disabilitati durante loading).
 *   - success: banner verde con la nuova edition (si chiude con reset o scompare al refetch).
 *   - error: banner rosso con il messaggio (include "function non configurata" se manca env).
 *
 * FEEDBACK "FUNCTION NON CONFIGURATA":
 *   L'helper callConsoleAdmin restituisce un errore esplicito se
 *   VITE_CONSOLE_ADMIN_FUNCTION_URL non è impostata. Quel messaggio appare nell'error banner
 *   senza crash dell'app.
 *
 * NOTA TEST E2E:
 *   La scrittura reale sul DB (update_edition) è testabile solo dopo che Matteo deploya
 *   la Edge Function e imposta VITE_CONSOLE_ADMIN_FUNCTION_URL (PLAN-DB-003).
 *   Finché non è deployata, il click produce il banner di errore "function non configurata".
 */

import { useEffect } from 'react'
import { useEditionChange } from '@console/hooks/useEditionChange'
import { editionLabel, editionBadgeColors, type Edition } from '@console/lib/editionUtils'

const EDITIONS: Edition[] = ['classic', 'pro', 'enterprise']

interface EditionSelectorProps {
  tenantId: string
  currentEdition: Edition
  /**
   * Chiamato dopo un cambio riuscito. Il genitore usa questo callback per
   * rileggere organizations dal DB e aggiornare la lista.
   */
  onSuccess: () => void
}

export function EditionSelector({ tenantId, currentEdition, onSuccess }: EditionSelectorProps) {
  const { state, changeEdition, reset } = useEditionChange()

  const isMyLoading = state.status === 'loading' && state.tenantId === tenantId
  const isMySuccess = state.status === 'success' && state.tenantId === tenantId
  const isMyError = state.status === 'error' && state.tenantId === tenantId

  // Quando la chiamata ha successo, notifica il genitore per il refetch.
  // useEffect garantisce che sia un side-effect post-render, non durante il render.
  useEffect(() => {
    if (isMySuccess) {
      onSuccess()
    }
    // onSuccess è stabile (definita nel genitore); aggiungerla sarebbe corretto ma
    // causa re-run non desiderati se non è memoizzata → la escludiamo intenzionalmente.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMySuccess])

  const handleChange = (edition: Edition) => {
    if (edition === currentEdition) return
    if (isMyLoading) return
    void changeEdition(tenantId, edition)
  }

  return (
    <div>
      {/* Bottoni di selezione edition */}
      <p style={selectorStyles.label}>Cambia edition:</p>
      <div style={selectorStyles.buttonGroup}>
        {EDITIONS.map((edition) => {
          const isCurrent = edition === currentEdition
          const badge = editionBadgeColors(edition)
          const isSpinning = isMyLoading && state.targetEdition === edition
          return (
            <button
              key={edition}
              onClick={() => handleChange(edition)}
              disabled={isMyLoading || isCurrent}
              aria-pressed={isCurrent}
              style={{
                ...selectorStyles.editionBtn,
                background: isCurrent ? badge.bg : 'transparent',
                color: isCurrent ? badge.text : '#94a3b8',
                borderColor: isCurrent ? badge.bg : '#475569',
                opacity: isMyLoading ? 0.6 : 1,
                cursor: isMyLoading || isCurrent ? 'not-allowed' : 'pointer',
              }}
            >
              {isSpinning ? '…' : editionLabel(edition)}
            </button>
          )
        })}
      </div>

      {/* Indicatore loading testuale */}
      {isMyLoading && (
        <p style={selectorStyles.loadingHint}>Aggiornamento in corso…</p>
      )}

      {/* Feedback successo */}
      {isMySuccess && (
        <div style={feedbackStyles.successBox} role="status">
          <span>
            Edition aggiornata a <strong>{editionLabel(state.newEdition)}</strong>.
            La lista si sta aggiornando…
          </span>
          <button onClick={reset} style={feedbackStyles.closeBtn} aria-label="Chiudi">×</button>
        </div>
      )}

      {/* Feedback errore (include "function non configurata" se manca la env) */}
      {isMyError && (
        <div style={feedbackStyles.errorBox} role="alert">
          <span>{state.message}</span>
          <button onClick={reset} style={feedbackStyles.closeBtn} aria-label="Riprova">×</button>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stili inline — nessuna dipendenza da file CSS dell'app di Matteo.
// ---------------------------------------------------------------------------

const selectorStyles = {
  label: {
    fontSize: '0.7rem',
    color: '#64748b',
    margin: '0.5rem 0 0.35rem',
    fontWeight: 500,
    letterSpacing: '0.03em',
    textTransform: 'uppercase' as const,
  } as React.CSSProperties,

  buttonGroup: {
    display: 'flex',
    gap: '0.35rem',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,

  editionBtn: {
    border: '1px solid',
    borderRadius: '6px',
    fontSize: '0.7rem',
    fontWeight: 700,
    padding: '0.25rem 0.6rem',
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
    transition: 'opacity 0.15s',
    fontFamily: 'inherit',
  } as React.CSSProperties,

  loadingHint: {
    fontSize: '0.7rem',
    color: '#64748b',
    marginTop: '0.35rem',
    fontStyle: 'italic',
  } as React.CSSProperties,
} as const

const feedbackStyles = {
  successBox: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '0.5rem',
    background: '#14532d',
    border: '1px solid #166534',
    borderRadius: '6px',
    padding: '0.5rem 0.6rem',
    color: '#86efac',
    fontSize: '0.75rem',
    marginTop: '0.5rem',
    lineHeight: 1.5,
  } as React.CSSProperties,

  errorBox: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '0.5rem',
    background: '#450a0a',
    border: '1px solid #7f1d1d',
    borderRadius: '6px',
    padding: '0.5rem 0.6rem',
    color: '#fca5a5',
    fontSize: '0.75rem',
    marginTop: '0.5rem',
    lineHeight: 1.5,
  } as React.CSSProperties,

  closeBtn: {
    flexShrink: 0,
    background: 'transparent',
    border: 'none',
    color: 'inherit',
    fontSize: '1rem',
    lineHeight: 1,
    cursor: 'pointer',
    padding: '0',
    opacity: 0.7,
    fontFamily: 'inherit',
  } as React.CSSProperties,
} as const
