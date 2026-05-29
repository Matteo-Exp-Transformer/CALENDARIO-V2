import { cn } from '@/lib/utils'

/** Viewport minimo (px) per riepilogo laterale sticky + griglia form a 2 colonne. Sotto: riepilogo sotto il form. */
export const BOOKING_PUBLIC_SUMMARY_SIDEBAR_MIN_PX = 1256

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
  'w-full min-w-0 flex-1 border-0! bg-transparent p-0 text-left text-sm font-bold text-warm-wood shadow-none ring-0! focus:outline-none focus:ring-0! sm:text-base'

/** Casella testo libero (es. Altre Richieste): label sopra, area che cresce con il contenuto su tutti i breakpoint. */
export const BOOKING_PUBLIC_FIELD_BOX_MULTILINE =
  'flex w-full min-h-[2.5rem] sm:min-h-[2.75rem] flex-col items-stretch gap-1 rounded-lg border border-slate-200 bg-white/75 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2.5 text-left focus-within:border-warm-wood focus-within:ring-2 focus-within:ring-warm-wood/40'

export const BOOKING_PUBLIC_FIELD_INNER_LABEL_MULTILINE =
  'shrink-0 text-left text-xs font-bold leading-snug text-warm-wood sm:text-sm'

export const BOOKING_PUBLIC_FIELD_INNER_TEXTAREA =
  'w-full min-w-0 resize-none overflow-hidden break-words border-0! bg-transparent p-0 text-left text-sm font-bold leading-snug text-warm-wood shadow-none ring-0! placeholder:text-warm-wood/50 focus:outline-none focus:ring-0! sm:text-base sm:leading-normal'

/** Messaggio errore campo singolo — bianco solo con sfondo full-page (`public_booking_page_background` senza striscia). */
export function publicFormFieldErrorClass(lightTextOnDarkBackground: boolean): string {
  return cn(
    'text-start text-sm font-semibold',
    lightTextOnDarkBackground ? 'text-white' : 'text-red-500',
  )
}

/** Errori data/ora — box rosso su sfondo chiaro; bianco su full-page. */
export function publicFormDateTimeErrorClass(lightTextOnDarkBackground: boolean): string {
  return lightTextOnDarkBackground
    ? 'text-start text-sm font-semibold text-white'
    : 'text-sm text-red-600 rounded-lg border border-red-200 bg-red-50 p-3'
}

/** Errori sezione (tipologia, menù) — bianco solo su full-page. */
export function publicFormSectionErrorClass(
  lightTextOnDarkBackground: boolean,
  align: 'left' | 'center' = 'left',
): string {
  return cn(
    'text-sm font-semibold',
    align === 'center' && 'text-center',
    align === 'left' && 'text-left',
    lightTextOnDarkBackground ? 'text-white' : 'text-red-500',
  )
}

/** Disponibilità slot — box rosso su sfondo chiaro; bianco su full-page. */
export function publicFormSlotAvailabilityErrorClass(lightTextOnDarkBackground: boolean): string {
  return lightTextOnDarkBackground
    ? 'text-left text-sm font-semibold text-white'
    : 'rounded-lg border border-red-200 bg-red-50 p-4 text-left text-sm font-semibold text-red-700'
}
