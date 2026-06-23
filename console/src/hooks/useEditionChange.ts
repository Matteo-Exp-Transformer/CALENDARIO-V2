/**
 * Hook per il cambio edition di un tenant sandbox.
 *
 * COSA FA:
 *   Chiama callConsoleAdmin({ action: 'update_edition', ... }) e notifica il chiamante
 *   con l'esito (successo / errore). Non gestisce lo stato della lista tenant: il refresh
 *   dei dati è responsabilità del componente padre tramite il callback onSuccess.
 *
 * COSA NON FA:
 *   - Non scrive direttamente nel DB (solo tramite Edge Function).
 *   - Non gestisce sandbox check: quella logica resta nel componente (isSandboxTenant).
 *
 * PATTERN USO:
 *   const { changeEdition, state } = useEditionChange()
 *   await changeEdition(tenantId, 'pro')
 *   if (state.status === 'success') { ... }
 */

import { useState, useCallback } from 'react'
import { callConsoleAdmin } from '@console/lib/consoleAdminClient'
import type { Edition } from '@console/lib/editionUtils'

// ---------------------------------------------------------------------------
// Stato della chiamata
// ---------------------------------------------------------------------------

type ChangeState =
  | { status: 'idle' }
  | { status: 'loading'; tenantId: string; targetEdition: Edition }
  | { status: 'success'; tenantId: string; newEdition: Edition }
  | { status: 'error'; tenantId: string; message: string }

export interface UseEditionChangeReturn {
  /** Stato corrente della chiamata. */
  state: ChangeState
  /**
   * Avvia il cambio edition per un tenant.
   * @param tenantId  - UUID del tenant da modificare.
   * @param edition   - Nuova edition da applicare.
   */
  changeEdition: (tenantId: string, edition: Edition) => Promise<void>
  /** Resetta lo stato a 'idle' (utile per chiudere i feedback dopo che l'utente li ha letti). */
  reset: () => void
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useEditionChange(): UseEditionChangeReturn {
  const [state, setState] = useState<ChangeState>({ status: 'idle' })

  const changeEdition = useCallback(async (tenantId: string, edition: Edition) => {
    // Evita chiamate doppie se una è già in corso.
    if (state.status === 'loading') return

    setState({ status: 'loading', tenantId, targetEdition: edition })

    const result = await callConsoleAdmin({
      action: 'update_edition',
      tenant_id: tenantId,
      edition,
    })

    if (result.error) {
      setState({
        status: 'error',
        tenantId,
        // Il messaggio include il contesto se la function non è configurata:
        // "VITE_CONSOLE_ADMIN_FUNCTION_URL non impostata. …"
        message: result.error.error,
      })
      return
    }

    setState({ status: 'success', tenantId, newEdition: edition })
  }, [state.status])

  const reset = useCallback(() => {
    setState({ status: 'idle' })
  }, [])

  return { state, changeEdition, reset }
}
