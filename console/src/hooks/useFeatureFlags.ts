/**
 * Hook per leggere i tenant_features di un tenant e calcolare l'effetto combinato
 * edition + override.
 *
 * LETTURA:
 *   Usa il client pubblico (supabase anon) per leggere tenant_features.
 *   L'unica policy su tenant_features è `admin_manage_tenant_features` (role: authenticated,
 *   cmd: ALL, qual: tenant_id = current_admin_tenant_id()). La funzione current_admin_tenant_id()
 *   cerca l'email JWT nella tabella admin_users — l'utente Console NON è in admin_users, quindi
 *   la policy filtra via tutte le righe silenziosamente (Supabase RLS non lancia errore, restituisce
 *   array vuoto). Questo significa che il pannello mostrerà l'effetto "solo bundle" (nessun override)
 *   anche se ci fossero righe in tenant_features — vedi PLAN-DB-004 per la soluzione.
 *
 * GESTIONE ERRORE RLS:
 *   Se la query lancia un errore HTTP (codice 42501 o simile), l'hook restituisce
 *   status 'rls-blocked' con messaggio esplicativo. Se invece la query ha successo ma
 *   restituisce 0 righe (caso attuale), lo stato è 'ok' con array vuoto.
 *
 * EFFETTO COMBINATO:
 *   Chiama buildFeatureDetails(edition, overrideRows) per calcolare per ogni feature:
 *   active, source, override (row raw).
 *
 * REFETCH:
 *   Il caller può incrementare il prop refetchKey per forzare un re-fetch dopo
 *   un'operazione di scrittura.
 */

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@console/lib/supabaseClient'
import {
  buildFeatureDetails,
  type FeatureDetail,
  type TenantFeatureRow,
} from '@console/lib/features'
import type { Edition } from '@console/lib/editionUtils'

// ---------------------------------------------------------------------------
// Stato dell'hook
// ---------------------------------------------------------------------------

export type FeatureFlagsLoadState =
  | { status: 'loading' }
  | { status: 'ok'; details: FeatureDetail[] }
  | { status: 'rls-blocked'; message: string }
  | { status: 'error'; message: string }

export interface UseFeatureFlagsReturn {
  state: FeatureFlagsLoadState
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Legge tenant_features per un tenant e calcola i FeatureDetail combinati.
 *
 * @param tenantId   - UUID del tenant (organizations.id).
 * @param edition    - Edition corrente del tenant.
 * @param refetchKey - Incrementa per forzare un re-fetch (es. dopo un toggle).
 */
export function useFeatureFlags(
  tenantId: string,
  edition: Edition,
  refetchKey: number,
): UseFeatureFlagsReturn {
  const [state, setState] = useState<FeatureFlagsLoadState>({ status: 'loading' })
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    setState({ status: 'loading' })

    void (async () => {
      const { data, error } = await supabase
        .from('tenant_features')
        .select(
          'tenant_id, feature_key, enabled, source, notes, activated_at, expires_at, created_by',
        )
        .eq('tenant_id', tenantId)

      if (!mountedRef.current) return

      if (error) {
        // Codice 42501 = insufficient_privilege (RLS blocca la SELECT).
        // In Supabase il codice PostgreSQL è nella proprietà `code` dell'errore.
        const isRls =
          error.code === '42501' ||
          error.message?.toLowerCase().includes('permission denied') ||
          error.message?.toLowerCase().includes('row-level security')

        if (isRls) {
          setState({
            status: 'rls-blocked',
            message:
              'La lettura di tenant_features è bloccata dalla RLS con il client anonimo. ' +
              'Per abilitarla: aggiungere una policy SELECT su tenant_features che permetta ' +
              'la lettura agli utenti autenticati (o service role). Proposta in PLAN-DB.',
          })
        } else {
          setState({ status: 'error', message: error.message })
        }
        return
      }

      const rows = (data ?? []) as TenantFeatureRow[]
      const details = buildFeatureDetails(edition, rows)

      setState({ status: 'ok', details })
    })()

    return () => {
      mountedRef.current = false
    }
  // edition e tenantId cambiano raramente ma se cambiano occorre ricaricare.
  // refetchKey è il trigger esplicito post-scrittura.
  }, [tenantId, edition, refetchKey])

  return { state }
}
