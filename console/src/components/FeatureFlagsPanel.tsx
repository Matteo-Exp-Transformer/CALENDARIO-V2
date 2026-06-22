/**
 * Pannello feature flag per un tenant (F6).
 *
 * COMPORTAMENTO:
 *   - Legge tenant_features dal DB tramite useFeatureFlags.
 *   - Mostra ogni feature con: stato ON/OFF risultante, sorgente (bundle / override),
 *     eventuale scadenza override.
 *   - Per i tenant SANDBOX: toggle per accendere/spegnere ogni add-on via
 *     callConsoleAdmin('upsert_tenant_feature').
 *   - Per i tenant NON-SANDBOX: tutto in sola lettura (nessun controllo).
 *
 * EFFETTO COMBINATO:
 *   buildFeatureDetails() (in lib/features.ts) calcola per ogni feature:
 *     - active: ON/OFF risultante da edition + override
 *     - source: 'bundle' | 'override-on' | 'override-off' | 'absent'
 *     - override: la riga raw dal DB (per mostrare note/scadenza)
 *
 * GESTIONE FUNCTION NON DEPLOYATA (DEC-021/PLAN-DB-003):
 *   Se VITE_CONSOLE_ADMIN_FUNCTION_URL non è impostata, callConsoleAdmin restituisce
 *   un errore esplicito. Il toggle mostra quel messaggio senza crash dell'app.
 *
 * GESTIONE RLS BLOCCATA:
 *   Se la policy SELECT su tenant_features non è configurata per il client anon,
 *   l'hook restituisce status 'rls-blocked' con un messaggio esplicativo.
 *
 * NOTA organizations.qr_menu_enabled:
 *   Non viene letta qui (LEGACY, DEC-008). L'add-on QR si attiva con feature_key 'qrMenu'.
 */

import { useState, useCallback, useEffect } from 'react'
import { useFeatureFlags } from '@console/hooks/useFeatureFlags'
import { useFeatureToggle } from '@console/hooks/useFeatureToggle'
import { isSandboxTenant } from '@console/lib/sandbox'
import type { Edition } from '@console/lib/editionUtils'
import type { FeatureDetail } from '@console/lib/features'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface FeatureFlagsPanelProps {
  tenantId: string
  edition: Edition
}

// ---------------------------------------------------------------------------
// Componente principale
// ---------------------------------------------------------------------------

export function FeatureFlagsPanel({ tenantId, edition }: FeatureFlagsPanelProps) {
  // refetchKey: incrementato dopo ogni toggle riuscito per rileggere tenant_features.
  const [refetchKey, setRefetchKey] = useState(0)
  const sandbox = isSandboxTenant(tenantId)

  const { state: flagsState } = useFeatureFlags(tenantId, edition, refetchKey)
  const { state: toggleState, toggleFeature, reset: resetToggle } = useFeatureToggle()

  // Quando il toggle ha successo per questo tenant, forza il re-fetch delle feature.
  // Usa useEffect per eseguire il side-effect post-render (stesso pattern di EditionSelector).
  const isSuccessForThisTenant =
    toggleState.status === 'success' && toggleState.tenantId === tenantId
  useEffect(() => {
    if (isSuccessForThisTenant) {
      setRefetchKey((k) => k + 1)
    }
    // isSuccessForThisTenant è derivato da toggleState: cambia solo quando il toggle completa.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessForThisTenant])

  const handleToggle = useCallback(
    (featureKey: string, currentActive: boolean) => {
      if (!sandbox) return
      void toggleFeature(tenantId, featureKey, !currentActive)
    },
    [sandbox, tenantId, toggleFeature],
  )

  const anyLoadingForTenant =
    toggleState.status === 'loading' && toggleState.tenantId === tenantId

  const isToggleLoading = (featureKey: string) =>
    toggleState.status === 'loading' &&
    toggleState.tenantId === tenantId &&
    toggleState.featureKey === featureKey

  const isToggleError = (featureKey: string) =>
    toggleState.status === 'error' &&
    toggleState.tenantId === tenantId &&
    toggleState.featureKey === featureKey

  const isToggleSuccess = (featureKey: string) =>
    toggleState.status === 'success' &&
    toggleState.tenantId === tenantId &&
    toggleState.featureKey === featureKey

  return (
    <div style={panelStyles.container}>
      <p style={panelStyles.sectionLabel}>Feature flags</p>

      {/* Stato loading */}
      {flagsState.status === 'loading' && (
        <p style={panelStyles.dimText}>Caricamento feature…</p>
      )}

      {/* Errore RLS bloccato */}
      {flagsState.status === 'rls-blocked' && (
        <div style={panelStyles.warnBox}>
          <strong>RLS bloccata — lettura tenant_features</strong>
          <br />
          {flagsState.message}
        </div>
      )}

      {/* Errore generico */}
      {flagsState.status === 'error' && (
        <div style={panelStyles.errorBox}>
          <strong>Errore lettura feature</strong>
          <br />
          {flagsState.message}
        </div>
      )}

      {/* Lista feature */}
      {flagsState.status === 'ok' && (
        <div style={panelStyles.featureList}>
          {flagsState.details.map((detail) => (
            <FeatureRow
              key={detail.key}
              detail={detail}
              sandbox={sandbox}
              loading={isToggleLoading(detail.key)}
              anyLoadingForTenant={anyLoadingForTenant}
              showError={isToggleError(detail.key)}
              errorMessage={
                isToggleError(detail.key) && toggleState.status === 'error'
                  ? toggleState.message
                  : ''
              }
              showSuccess={isToggleSuccess(detail.key)}
              onToggle={handleToggle}
              onResetFeedback={resetToggle}
            />
          ))}
        </div>
      )}

      {/* Badge sola lettura (non sandbox) */}
      {!sandbox && flagsState.status === 'ok' && (
        <p style={panelStyles.readOnlyHint}>
          Solo lettura — modifica disponibile solo sui tenant sandbox
        </p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Riga singola feature
// ---------------------------------------------------------------------------

interface FeatureRowProps {
  detail: FeatureDetail
  sandbox: boolean
  loading: boolean
  anyLoadingForTenant: boolean
  showError: boolean
  errorMessage: string
  showSuccess: boolean
  onToggle: (featureKey: string, currentActive: boolean) => void
  onResetFeedback: () => void
}

function FeatureRow({
  detail,
  sandbox,
  loading,
  anyLoadingForTenant,
  showError,
  errorMessage,
  showSuccess,
  onToggle,
  onResetFeedback,
}: FeatureRowProps) {
  const { key, label, active, source, override } = detail

  const sourceTxt = sourceText(source)
  const srcColor = sourceColor(source)

  // Informazione scadenza override (solo se presente).
  const expiresInfo = override?.expires_at ? formatExpiry(override.expires_at) : null

  return (
    <div>
      <div style={panelStyles.featureRow}>
        {/* Dot ON/OFF */}
        <span
          style={{
            ...panelStyles.statusDot,
            background: active ? '#22c55e' : '#475569',
          }}
          title={active ? 'Attiva' : 'Non attiva'}
        />

        {/* Nome feature */}
        <span style={{ ...panelStyles.featureLabel, color: active ? '#f1f5f9' : '#64748b' }}>
          {label}
        </span>

        {/* Sorgente (badge) */}
        <span style={{ ...panelStyles.sourceChip, color: srcColor }}>
          {sourceTxt}
        </span>

        {/* Scadenza override */}
        {expiresInfo && (
          <span style={panelStyles.expiryText} title={`Scade: ${expiresInfo.full}`}>
            scade {expiresInfo.short}
          </span>
        )}

        {/* Toggle button (solo sandbox) */}
        {sandbox && (
          <button
            onClick={() => onToggle(key, active)}
            disabled={loading || anyLoadingForTenant}
            style={{
              ...panelStyles.toggleBtn,
              background: active ? '#1e3a5f' : '#1a2a1a',
              borderColor: active ? '#2563eb' : '#374151',
              color: active ? '#93c5fd' : '#6b7280',
              cursor: loading || anyLoadingForTenant ? 'not-allowed' : 'pointer',
              opacity: anyLoadingForTenant && !loading ? 0.5 : 1,
            }}
            aria-label={active ? `Spegni ${label}` : `Accendi ${label}`}
            aria-pressed={active}
          >
            {loading ? '…' : active ? 'ON' : 'OFF'}
          </button>
        )}
      </div>

      {/* Feedback inline errore */}
      {showError && (
        <div style={panelStyles.inlineError}>
          <span style={{ flex: 1 }}>{errorMessage}</span>
          <button
            onClick={onResetFeedback}
            style={panelStyles.closeFeedback}
            aria-label="Chiudi errore"
          >
            ×
          </button>
        </div>
      )}

      {/* Feedback inline successo */}
      {showSuccess && (
        <div style={panelStyles.inlineSuccess}>
          <span style={{ flex: 1 }}>Salvato</span>
          <button
            onClick={onResetFeedback}
            style={panelStyles.closeFeedback}
            aria-label="Chiudi"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Helpers presentazionali
// ---------------------------------------------------------------------------

function sourceText(src: FeatureDetail['source']): string {
  switch (src) {
    case 'bundle':       return 'bundle'
    case 'override-on':  return '+override'
    case 'override-off': return '-override'
    case 'absent':       return '—'
  }
}

function sourceColor(src: FeatureDetail['source']): string {
  switch (src) {
    case 'bundle':       return '#0ea5e9'  // blu: inclusa nell'edition
    case 'override-on':  return '#22c55e'  // verde: add-on aggiunto
    case 'override-off': return '#f97316'  // arancio: disabilitata esplicitamente
    case 'absent':       return '#374151'  // grigio: assente
  }
}

function formatExpiry(expiresAt: string): { short: string; full: string } {
  const d = new Date(expiresAt)
  const full = d.toLocaleString('it-IT')
  const short = d.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
  return { short, full }
}

// ---------------------------------------------------------------------------
// Stili inline — nessuna dipendenza da file CSS dell'app di Matteo.
// ---------------------------------------------------------------------------

const panelStyles = {
  container: {
    marginTop: '0.5rem',
  } as React.CSSProperties,

  sectionLabel: {
    fontSize: '0.7rem',
    color: '#64748b',
    margin: '0 0 0.5rem',
    fontWeight: 500,
    letterSpacing: '0.03em',
    textTransform: 'uppercase' as const,
  } as React.CSSProperties,

  dimText: {
    fontSize: '0.75rem',
    color: '#475569',
    fontStyle: 'italic',
    margin: '0.25rem 0',
  } as React.CSSProperties,

  warnBox: {
    background: '#1c1400',
    border: '1px solid #854d0e',
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
    color: '#fcd34d',
    fontSize: '0.75rem',
    lineHeight: 1.6,
  } as React.CSSProperties,

  errorBox: {
    background: '#450a0a',
    border: '1px solid #7f1d1d',
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
    color: '#fca5a5',
    fontSize: '0.75rem',
    lineHeight: 1.6,
  } as React.CSSProperties,

  featureList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.15rem',
  } as React.CSSProperties,

  featureRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    minHeight: '1.75rem',
  } as React.CSSProperties,

  statusDot: {
    flexShrink: 0,
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    display: 'inline-block',
  } as React.CSSProperties,

  featureLabel: {
    flex: 1,
    fontSize: '0.8rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  } as React.CSSProperties,

  sourceChip: {
    fontSize: '0.65rem',
    fontWeight: 600,
    fontFamily: 'monospace',
    flexShrink: 0,
  } as React.CSSProperties,

  expiryText: {
    fontSize: '0.65rem',
    color: '#f59e0b',
    flexShrink: 0,
    cursor: 'help',
  } as React.CSSProperties,

  toggleBtn: {
    flexShrink: 0,
    border: '1px solid',
    borderRadius: '4px',
    fontSize: '0.65rem',
    fontWeight: 700,
    padding: '0.15rem 0.45rem',
    fontFamily: 'monospace',
    transition: 'opacity 0.15s',
    minWidth: '32px',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  inlineError: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    background: '#450a0a',
    border: '1px solid #7f1d1d',
    borderRadius: '4px',
    padding: '0.25rem 0.5rem',
    color: '#fca5a5',
    fontSize: '0.7rem',
    lineHeight: 1.5,
    marginTop: '0.2rem',
    marginBottom: '0.1rem',
  } as React.CSSProperties,

  inlineSuccess: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    background: '#14532d',
    border: '1px solid #166534',
    borderRadius: '4px',
    padding: '0.25rem 0.5rem',
    color: '#86efac',
    fontSize: '0.7rem',
    lineHeight: 1.5,
    marginTop: '0.2rem',
    marginBottom: '0.1rem',
  } as React.CSSProperties,

  closeFeedback: {
    flexShrink: 0,
    background: 'transparent',
    border: 'none',
    color: 'inherit',
    fontSize: '0.9rem',
    lineHeight: 1,
    cursor: 'pointer',
    padding: '0',
    opacity: 0.7,
    fontFamily: 'inherit',
  } as React.CSSProperties,

  readOnlyHint: {
    fontSize: '0.65rem',
    color: '#374151',
    marginTop: '0.5rem',
    fontStyle: 'italic',
  } as React.CSSProperties,
} as const
