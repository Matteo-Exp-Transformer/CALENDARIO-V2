/**
 * Hook per accendere/spegnere un add-on (feature_key) via callConsoleAdmin.
 *
 * COSA FA:
 *   Chiama callConsoleAdmin({ action: 'upsert_tenant_feature', tenant_id, feature_key, is_enabled })
 *   e notifica il chiamante con l'esito (successo / errore).
 *
 * RESTRIZIONE SANDBOX:
 *   Questo hook non verifica isSandboxTenant — quella logica resta nel componente
 *   (FeatureFlagsPanel non monta i toggle per i non-sandbox). Il gate forte è lato server.
 *
 * STATI GESTITI:
 *   idle       → nessuna operazione in corso
 *   loading    → chiamata in corso (tenantId + featureKey della chiamata attiva)
 *   success    → operazione riuscita (tenantId + featureKey + is_enabled risultante)
 *   error      → errore (tenantId + featureKey + messaggio)
 *
 * NOTA FUNCTION NON DEPLOYATA:
 *   Se VITE_CONSOLE_ADMIN_FUNCTION_URL non è impostata, callConsoleAdmin restituisce
 *   un errore esplicito. Lo stato diventa 'error' con quel messaggio — nessun crash.
 */

import { useState, useCallback } from 'react'
import { callConsoleAdmin } from '@console/lib/consoleAdminClient'

// ---------------------------------------------------------------------------
// Tipi stato
// ---------------------------------------------------------------------------

type ToggleState =
  | { status: 'idle' }
  | { status: 'loading'; tenantId: string; featureKey: string }
  | { status: 'success'; tenantId: string; featureKey: string; isEnabled: boolean }
  | { status: 'error'; tenantId: string; featureKey: string; message: string }

export interface UseFeatureToggleReturn {
  state: ToggleState
  toggleFeature: (tenantId: string, featureKey: string, isEnabled: boolean) => Promise<void>
  reset: () => void
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useFeatureToggle(): UseFeatureToggleReturn {
  const [state, setState] = useState<ToggleState>({ status: 'idle' })

  const toggleFeature = useCallback(
    async (tenantId: string, featureKey: string, isEnabled: boolean) => {
      // Ignora click multipli se già in corso.
      if (state.status === 'loading') return

      setState({ status: 'loading', tenantId, featureKey })

      const result = await callConsoleAdmin({
        action: 'upsert_tenant_feature',
        tenant_id: tenantId,
        feature_key: featureKey,
        is_enabled: isEnabled,
      })

      if (result.error) {
        setState({
          status: 'error',
          tenantId,
          featureKey,
          message: result.error.error,
        })
        return
      }

      setState({ status: 'success', tenantId, featureKey, isEnabled })
    },
    [state.status],
  )

  const reset = useCallback(() => {
    setState({ status: 'idle' })
  }, [])

  return { state, toggleFeature, reset }
}
