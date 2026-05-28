/** Larghezza piena form /prenota — allineata al box header (solo px-4/px-6 del container pagina). */
export const BOOKING_PUBLIC_CONTENT_WIDTH = 'w-full min-w-0'

/** Card tipologia + sottotab: stessa larghezza del box header. */
export const BOOKING_PUBLIC_WIDE_CARDS_WIDTH = 'w-full min-w-0'

/**
 * Larghezza di una card in riga a N colonne uguali (gap-1.5, sm:gap-2),
 * come le card tipologia con `flex-1`. Usata dalle sottotab scrollabili.
 */
export function bookingPublicRowCardWidthClass(columnCount: number): string {
  if (columnCount <= 1) {
    return 'w-full max-w-full shrink-0'
  }
  if (columnCount === 2) {
    return 'w-[calc((100%_-_0.375rem)/2)] max-w-[calc((100%_-_0.375rem)/2)] sm:w-[calc((100%_-_0.5rem)/2)] sm:max-w-[calc((100%_-_0.5rem)/2)] shrink-0'
  }
  if (columnCount === 3) {
    return 'w-[calc((100%_-_0.75rem)/3)] max-w-[calc((100%_-_0.75rem)/3)] sm:w-[calc((100%_-_1rem)/3)] sm:max-w-[calc((100%_-_1rem)/3)] shrink-0'
  }
  return 'w-[calc((100%_-_1.125rem)/4)] max-w-[calc((100%_-_1.125rem)/4)] sm:w-[calc((100%_-_1.5rem)/4)] sm:max-w-[calc((100%_-_1.5rem)/4)] shrink-0'
}

/** Card campo single-row: label a sinistra + valore a destra sulla stessa riga.
 *  Altezza compatta uniforme per tutte le caselle (nome, email, telefono, data, ora, ospiti).
 *  bg-white/75 + backdrop-blur-sm = velo trasparente sulla foto di sfondo.
 *  Mobile: 2.5rem (40px), sm+ 2.75rem (44px). */
export const BOOKING_PUBLIC_FIELD_BOX =
  'flex w-full min-h-[2.5rem] sm:min-h-[2.75rem] flex-row items-center gap-2 sm:gap-3 rounded-lg border border-slate-200 bg-white/75 backdrop-blur-sm px-3 py-1 sm:px-4 sm:py-1.5 text-left focus-within:border-warm-wood focus-within:ring-2 focus-within:ring-warm-wood/40'

export const BOOKING_PUBLIC_FIELD_INNER_LABEL =
  'pointer-events-none shrink-0 whitespace-nowrap text-left text-xs font-bold leading-tight text-warm-wood sm:text-sm'

export const BOOKING_PUBLIC_FIELD_INNER_INPUT =
  'w-full min-w-0 flex-1 border-0! bg-transparent p-0 text-right text-sm font-bold text-warm-wood shadow-none ring-0! focus:outline-none focus:ring-0! sm:text-base'
