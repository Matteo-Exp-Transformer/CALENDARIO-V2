import { useMemo } from 'react'
import { useFeatures } from '@/hooks/useFeatures'
import { useTables, type RestaurantTable } from '@/features/booking/hooks/useServizioTables'

export interface TableModeResult {
  /** true solo se edition Pro/Enterprise E almeno un tavolo attivo. È l'UNICA fonte di verità
   * per il predicato "modalità-tavoli" (D49): tutti i consumer (motore disponibilità, walk-in,
   * capienza sala) devono leggere questo hook anziché replicare la logica.
   *
   * CORTOCIRCUITO DELIBERATO: in Classic, features.tableAssignments è false quindi isTableMode
   * non dipende mai dal risultato di useTables — evita query al DB per utenti Classic e
   * garantisce che la capienza per-fascia standard resti intatta (D1). */
  isTableMode: boolean
  /** Tavoli attivi del tenant (già filtrati da useTables: active=true). Lista vuota in Classic. */
  activeTables: RestaurantTable[]
  /** Capienza fisica della sala = somma dei posti di ogni tavolo attivo (D46).
   * È il tetto da usare al posto di service_slots.max_guests quando isTableMode è true.
   * Vale 0 quando isTableMode è false (Classic o Pro senza tavoli). */
  totalCovers: number
}

/**
 * Predicato unico "modalità-tavoli" per S4 Motore disponibilità.
 *
 * Perché un hook dedicato invece di inline nei consumer:
 * - Singola fonte di verità per D49: cambiare la definizione qui si propaga ovunque.
 * - Il cortocircuito Classic evita che useTables venga abilitato per tenants non-Pro
 *   (queryFn di useTables usa `supabase` admin — non adatto al form pubblico anonimo).
 */
export function useTableMode(): TableModeResult {
  const features = useFeatures()

  // useTables è sempre chiamato (Rules of Hooks), ma la query resta disabilitata se
  // tenantId è null (già gestito dentro useTables con enabled: Boolean(tenantId)).
  // Quando features.tableAssignments è false (Classic) ignoriamo comunque i dati.
  const { data: allActiveTables = [] } = useTables()

  return useMemo(() => {
    // CORTOCIRCUITO: in Classic tableAssignments è false → modalità-tavoli mai attiva
    if (!features.tableAssignments) {
      return { isTableMode: false, activeTables: [], totalCovers: 0 }
    }

    const activeTables = allActiveTables
    const isTableMode = activeTables.length >= 1
    const totalCovers = isTableMode
      ? activeTables.reduce((sum, t) => sum + t.capacity, 0)
      : 0

    return { isTableMode, activeTables, totalCovers }
  }, [features.tableAssignments, allActiveTables])
}
