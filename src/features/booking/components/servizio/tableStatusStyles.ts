import type { TableLiveStatus } from '@/features/booking/hooks/useTableStatuses'

/**
 * Stili condivisi dei 5 stati tavolo (D24).
 *
 * PERCHÉ un modulo a parte: gli stessi colori servono alla vista a elenco
 * (AssignmentMapPanel), alla piantina di servizio (ServicePlanMap) e alla
 * modale di assegnazione rapida. Tenerli in un solo posto evita che una vista
 * dica "In ritardo" in rosso e un'altra in arancione.
 */

export const STATUS_CLASSES: Record<TableLiveStatus, string> = {
  free:     'bg-emerald-100 border-emerald-300',
  upcoming: 'bg-cyan-100 border-cyan-400',
  occupied: 'bg-amber-100 border-amber-400',
  late:     'bg-red-100 border-red-400',
  leaving:  'bg-violet-100 border-violet-300',
}

export const STATUS_LABEL: Record<TableLiveStatus, string> = {
  free:     'Libero',
  upcoming: 'In arrivo',
  occupied: 'Occupato',
  late:     'In ritardo',
  leaving:  'In uscita',
}

/** Badge inline per ogni stato — colori coerenti con STATUS_CLASSES. */
export const STATUS_BADGE_CLASSES: Record<TableLiveStatus, string> = {
  free:     'bg-emerald-200 text-emerald-800',
  upcoming: 'bg-cyan-200 text-cyan-800',
  occupied: 'bg-amber-200 text-amber-800',
  late:     'bg-red-200 text-red-800',
  leaving:  'bg-violet-200 text-violet-800',
}

/** Ordine di visualizzazione della legenda: dal tavolo libero al fine turno. */
export const STATUS_LEGEND_ORDER: TableLiveStatus[] = [
  'free',
  'upcoming',
  'occupied',
  'late',
  'leaving',
]
