/**
 * Hook per leggere le impostazioni ristorante (restaurant_settings) di un tenant.
 *
 * LETTURA:
 *   Usa il client pubblico (supabase anon) per leggere le righe restaurant_settings
 *   filtrate per tenant_id. La policy RLS su restaurant_settings potrebbe bloccare
 *   la lettura anonima (stessa situazione di tenant_features in F6). Se la query
 *   restituisce un errore, l'hook segnala 'rls-blocked' o 'error' con messaggio
 *   esplicativo — nessun crash.
 *
 * GESTIONE RLS BLOCCATA:
 *   Se la query lancia un errore HTTP (codice 42501 o simile) → stato 'rls-blocked'.
 *   Se la query ha successo ma restituisce 0 righe → stato 'ok' con valori default.
 *   Questo è il comportamento atteso finché non viene aggiunta la policy SELECT
 *   per gli utenti autenticati (vedi PLAN-DB-005 se necessario).
 *
 * VALORI MOSTRATI:
 *   Per ogni setting esposta, l'hook restituisce:
 *   - currentValue: valore letto dal DB (o default se assente)
 *   - storedInDb: true se esiste una riga per quella chiave, false se assente
 *   Il componente può mostrare "default" per le righe assenti vs valore salvato.
 *
 * REFETCH:
 *   Il caller può incrementare refetchKey per forzare un re-fetch post-scrittura.
 */

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@console/lib/supabaseClient'
import {
  EXPOSED_SETTINGS,
  parseExposedSettingFromDb,
  type ExposedSetting,
  type ExposedSettingValue,
} from '@console/lib/restaurantSettings'

// ---------------------------------------------------------------------------
// Riga grezza dal DB
// ---------------------------------------------------------------------------

interface SettingRow {
  tenant_id: string
  setting_key: string
  setting_value: unknown // jsonb
  updated_at: string
}

// ---------------------------------------------------------------------------
// Stato per ogni impostazione esposta
// ---------------------------------------------------------------------------

export interface SettingState {
  setting: ExposedSetting
  /** Valore corrente: dal DB se presente, altrimenti il default del registro. */
  currentValue: ExposedSettingValue
  /** True se esiste una riga nel DB per questa chiave (vs valore default implicito). */
  storedInDb: boolean
  /** Timestamp dell'ultimo aggiornamento (null se non in DB). */
  updatedAt: string | null
}

// ---------------------------------------------------------------------------
// Stato dell'hook
// ---------------------------------------------------------------------------

export type RestaurantSettingsLoadState =
  | { status: 'loading' }
  | { status: 'ok'; settings: SettingState[] }
  | { status: 'rls-blocked'; message: string }
  | { status: 'error'; message: string }

export interface UseRestaurantSettingsReturn {
  state: RestaurantSettingsLoadState
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Legge le impostazioni ristorante per un tenant dal DB.
 *
 * @param tenantId   - UUID del tenant (organizations.id).
 * @param refetchKey - Incrementa per forzare un re-fetch (es. dopo un salvataggio).
 */
export function useRestaurantSettings(
  tenantId: string,
  refetchKey: number,
): UseRestaurantSettingsReturn {
  const [state, setState] = useState<RestaurantSettingsLoadState>({ status: 'loading' })
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    setState({ status: 'loading' })

    void (async () => {
      const { data, error } = await supabase
        .from('restaurant_settings')
        .select('tenant_id, setting_key, setting_value, updated_at')
        .eq('tenant_id', tenantId)

      if (!mountedRef.current) return

      if (error) {
        // Codice 42501 = insufficient_privilege (RLS blocca la SELECT).
        const isRls =
          error.code === '42501' ||
          error.message?.toLowerCase().includes('permission denied') ||
          error.message?.toLowerCase().includes('row-level security')

        if (isRls) {
          setState({
            status: 'rls-blocked',
            message:
              'La lettura di restaurant_settings è bloccata dalla RLS con il client anonimo. ' +
              'Aggiungere una policy SELECT che permetta la lettura agli utenti autenticati. ' +
              'Vedere PLAN-DB-005 (da generare se necessario).',
          })
        } else {
          setState({ status: 'error', message: error.message })
        }
        return
      }

      // Indicizza le righe per chiave.
      const rowByKey = new Map<string, SettingRow>()
      for (const row of (data ?? []) as SettingRow[]) {
        rowByKey.set(row.setting_key, row)
      }

      // Componi lo stato per ogni setting esposta.
      const settings: SettingState[] = EXPOSED_SETTINGS.map((s) => {
        const row = rowByKey.get(s.key)
        return {
          setting: s,
          currentValue: parseExposedSettingFromDb(s, row?.setting_value ?? null),
          storedInDb: row !== undefined,
          updatedAt: row?.updated_at ?? null,
        }
      })

      setState({ status: 'ok', settings })
    })()

    return () => {
      mountedRef.current = false
    }
  }, [tenantId, refetchKey])

  return { state }
}
