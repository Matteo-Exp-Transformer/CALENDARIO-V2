/**
 * Hook per salvare un'impostazione ristorante via callConsoleAdmin.
 *
 * COSA FA:
 *   Chiama callConsoleAdmin({ action: 'upsert_restaurant_setting', tenant_id, setting_key, value })
 *   e gestisce lo stato loading/success/error.
 *
 * RESTRIZIONE SANDBOX:
 *   Questo hook non verifica isSandboxTenant — quella logica resta nel componente
 *   (RestaurantSettingsPanel disabilita i controlli per i non-sandbox). Il gate forte
 *   è lato server (Edge Function + RLS).
 *
 * VALIDAZIONE:
 *   Il chiamante deve validare il valore PRIMA di chiamare saveSetting.
 *   Questo hook non ri-valida: si fida che il valore passato sia già stato
 *   controllato dal componente con il validator del registro.
 *
 * NOTA FUNCTION NON DEPLOYATA:
 *   Se VITE_CONSOLE_ADMIN_FUNCTION_URL non è impostata, callConsoleAdmin restituisce
 *   un errore esplicito. Lo stato diventa 'error' con quel messaggio — nessun crash.
 *
 * STATI:
 *   idle       → nessuna operazione in corso
 *   loading    → chiamata in corso (tenantId + settingKey della chiamata attiva)
 *   success    → operazione riuscita
 *   error      → errore (messaggio)
 */

import { useState, useCallback } from 'react'
import { callConsoleAdmin } from '@console/lib/consoleAdminClient'

// ---------------------------------------------------------------------------
// Tipi stato
// ---------------------------------------------------------------------------

type SaveState =
  | { status: 'idle' }
  | { status: 'loading'; tenantId: string; settingKey: string }
  | { status: 'success'; tenantId: string; settingKey: string }
  | { status: 'error'; tenantId: string; settingKey: string; message: string }

export interface UseSettingSaveReturn {
  state: SaveState
  saveSetting: (tenantId: string, settingKey: string, value: unknown) => Promise<void>
  reset: () => void
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useSettingSave(): UseSettingSaveReturn {
  const [state, setState] = useState<SaveState>({ status: 'idle' })

  const saveSetting = useCallback(
    async (tenantId: string, settingKey: string, value: unknown) => {
      // Ignora click multipli se già in corso.
      if (state.status === 'loading') return

      setState({ status: 'loading', tenantId, settingKey })

      const result = await callConsoleAdmin({
        action: 'upsert_restaurant_setting',
        tenant_id: tenantId,
        setting_key: settingKey,
        value,
      })

      if (result.error) {
        setState({
          status: 'error',
          tenantId,
          settingKey,
          message: result.error.error,
        })
        return
      }

      setState({ status: 'success', tenantId, settingKey })
    },
    [state.status],
  )

  const reset = useCallback(() => {
    setState({ status: 'idle' })
  }, [])

  return { state, saveSetting, reset }
}
