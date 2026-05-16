import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useTenantContext } from '@/contexts/TenantContext'
import { toast } from 'react-toastify'
import { logger } from '@/lib/logger'
import { SERVICE_SLOTS_QUERY_KEY } from './useServiceSlots'

/**
 * Override temporaneo di una fascia oraria: per un intervallo di date, i valori
 * max_turns / max_guests sostituiscono quelli base di service_slots. Scaduto
 * l'intervallo la fascia torna automaticamente ai valori base — nessun job.
 */
export interface ServiceSlotOverride {
  id: string
  tenant_id: string
  service_slot_id: string
  date_from: string // YYYY-MM-DD
  date_to: string   // YYYY-MM-DD (incluso)
  max_turns: number | null
  max_guests: number | null
  created_at: string
}

export type ServiceSlotOverrideInsert = {
  service_slot_id: string
  date_from: string
  date_to: string
  max_turns: number | null
  max_guests: number | null
}

/** Durata utente dell'override. 'forever' = nessun override, modifica il valore base. */
export type OverrideScope = 'forever' | 'today' | 'week' | 'month'

export const SERVICE_SLOT_OVERRIDES_QUERY_KEY = 'service_slot_overrides'

// ─────────────────────────────────────────────
// Helper date (date di calendario, fuso locale — non orari di prenotazione)
// ─────────────────────────────────────────────

/** Data odierna in formato YYYY-MM-DD nel fuso locale (no UTC shift). */
export function todayLocalISODate(now: Date = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Dato uno scope e la data di oggi, restituisce [date_from, date_to] inclusi.
 * 'today'  → oggi..oggi
 * 'week'   → oggi..domenica di questa settimana (lunedì = primo giorno)
 * 'month'  → oggi..ultimo giorno del mese corrente
 * Ritorna null per 'forever' (nessun override).
 */
export function resolveScopeDateRange(
  scope: OverrideScope,
  now: Date = new Date(),
): { date_from: string; date_to: string } | null {
  if (scope === 'forever') return null

  const from = todayLocalISODate(now)

  if (scope === 'today') {
    return { date_from: from, date_to: from }
  }

  if (scope === 'week') {
    // getDay(): 0=domenica..6=sabato. Settimana lunedì→domenica.
    const dow = now.getDay()
    const daysToSunday = dow === 0 ? 0 : 7 - dow
    const sunday = new Date(now)
    sunday.setDate(now.getDate() + daysToSunday)
    return { date_from: from, date_to: todayLocalISODate(sunday) }
  }

  // month: ultimo giorno del mese corrente (giorno 0 del mese successivo)
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return { date_from: from, date_to: todayLocalISODate(lastDay) }
}

/** Durata in giorni di un override (inclusivo). Usata per "vince il più specifico". */
function overrideSpanDays(o: ServiceSlotOverride): number {
  const a = new Date(o.date_from + 'T00:00:00')
  const b = new Date(o.date_to + 'T00:00:00')
  return Math.round((b.getTime() - a.getTime()) / 86_400_000) + 1
}

/**
 * Risolve l'override applicabile a una fascia in una certa data.
 * Regola decisa con l'utente: "vince il più specifico" → tra gli override che
 * coprono `date`, vince quello con l'intervallo più corto; a parità, il più recente.
 * Ritorna null se nessun override copre quella data (→ usare i valori base).
 */
export function resolveSlotOverride(
  overrides: ServiceSlotOverride[],
  serviceSlotId: string,
  date: string,
): ServiceSlotOverride | null {
  const candidates = overrides.filter(
    (o) =>
      o.service_slot_id === serviceSlotId &&
      o.date_from <= date &&
      date <= o.date_to,
  )
  if (candidates.length === 0) return null

  return candidates.reduce((best, cur) => {
    const bs = overrideSpanDays(best)
    const cs = overrideSpanDays(cur)
    if (cs < bs) return cur
    if (cs > bs) return best
    return cur.created_at > best.created_at ? cur : best
  })
}

/** True se la fascia ha almeno un override ancora attivo da oggi in poi. */
export function hasActiveOverride(
  overrides: ServiceSlotOverride[],
  serviceSlotId: string,
  now: Date = new Date(),
): ServiceSlotOverride | null {
  const today = todayLocalISODate(now)
  const active = overrides
    .filter((o) => o.service_slot_id === serviceSlotId && o.date_to >= today)
    .sort((a, b) => (a.date_to < b.date_to ? 1 : -1))
  return active[0] ?? null
}

// ─────────────────────────────────────────────
// Query + mutation
// ─────────────────────────────────────────────

export function useServiceSlotOverrides() {
  const { tenantId } = useTenantContext()

  return useQuery({
    queryKey: [SERVICE_SLOT_OVERRIDES_QUERY_KEY, tenantId],
    queryFn: async (): Promise<ServiceSlotOverride[]> => {
      const { data, error } = await supabase
        .from('service_slot_overrides')
        .select('*')
        .eq('tenant_id', tenantId!)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as ServiceSlotOverride[]
    },
    enabled: !!tenantId,
  })
}

export function useCreateServiceSlotOverride() {
  const queryClient = useQueryClient()
  const { tenantId } = useTenantContext()

  return useMutation({
    mutationFn: async (input: ServiceSlotOverrideInsert) => {
      // RPC a parametro jsonb singolo: firma univoca, immune a PGRST202 (come update_service_slot).
      const payload: Record<string, string | number | null> = {
        tenant_id: tenantId!,
        service_slot_id: input.service_slot_id,
        date_from: input.date_from,
        date_to: input.date_to,
        max_turns: input.max_turns,
        max_guests: input.max_guests,
      }
      const { data, error } = await supabase.rpc('insert_service_slot_override', { payload })
      if (error) throw error
      return (data as ServiceSlotOverride[])[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SERVICE_SLOT_OVERRIDES_QUERY_KEY, tenantId] })
      // Il capacity check legge service_slots + overrides: invalida anche le fasce.
      queryClient.invalidateQueries({ queryKey: [SERVICE_SLOTS_QUERY_KEY, tenantId] })
    },
    onError: (error: Error) => {
      logger.error('[useCreateServiceSlotOverride] error', error)
      toast.error(error.message || 'Errore nel salvataggio della modifica a tempo')
    },
  })
}
