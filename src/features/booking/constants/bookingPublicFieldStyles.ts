/** Larghezza piena form /prenota — allineata al box header (solo px-4/px-6 del container pagina). */
export const BOOKING_PUBLIC_CONTENT_WIDTH = 'w-full min-w-0'

/**
 * Padding interno del box bianco header (solo testo titolo/descrizione).
 * Non usarlo sulle card tipologia/sottotab: lì serve allineare il bordo esterno del box header.
 */
export const BOOKING_PUBLIC_PAGE_HEADER_INSET = 'px-[13px] md:px-[29px]'

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

/** @deprecated alias */
export const BOOKING_PUBLIC_FIELD_WRAP = BOOKING_PUBLIC_CONTENT_WIDTH

/** Card campo: label in alto a sinistra + valore sotto. */
export const BOOKING_PUBLIC_FIELD_BOX =
  'flex w-full min-h-[3.75rem] flex-col items-start justify-start rounded-lg border border-slate-200 bg-white px-4 py-2 text-left focus-within:border-warm-wood focus-within:ring-2 focus-within:ring-warm-wood/40'

export const BOOKING_PUBLIC_FIELD_INNER_LABEL =
  'pointer-events-none text-left text-sm font-bold leading-tight text-warm-wood sm:text-base'

export const BOOKING_PUBLIC_FIELD_INNER_INPUT =
  'mt-0.5 w-full min-w-0 flex-1 border-0! bg-transparent p-0 text-sm font-bold text-warm-wood shadow-none ring-0! focus:outline-none focus:ring-0! sm:text-base'

/** @deprecated usa BOOKING_PUBLIC_FIELD_BOX + INNER_* */
export const BOOKING_PUBLIC_FIELD_INPUT = BOOKING_PUBLIC_FIELD_BOX
