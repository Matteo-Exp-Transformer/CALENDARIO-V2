/** Blocco centrato al 75% — campi, card menù mobile, sezioni form /prenota. */
export const BOOKING_PUBLIC_CONTENT_WIDTH = 'mx-auto w-3/4 max-w-full min-w-0'

/** @deprecated alias */
export const BOOKING_PUBLIC_FIELD_WRAP = BOOKING_PUBLIC_CONTENT_WIDTH

/** Card campo: label in alto a sinistra + valore sotto. */
export const BOOKING_PUBLIC_FIELD_BOX =
  'flex w-full min-h-[3.75rem] flex-col items-start justify-start rounded-lg border border-slate-200 bg-white px-4 py-2 text-left focus-within:border-warm-wood focus-within:ring-2 focus-within:ring-warm-wood/40'

export const BOOKING_PUBLIC_FIELD_INNER_LABEL =
  'pointer-events-none text-left text-xs font-bold leading-tight text-warm-wood sm:text-sm'

export const BOOKING_PUBLIC_FIELD_INNER_INPUT =
  'mt-0.5 w-full min-w-0 flex-1 border-0! bg-transparent p-0 text-xs font-bold text-warm-wood shadow-none ring-0! focus:outline-none focus:ring-0! sm:text-sm'

/** @deprecated usa BOOKING_PUBLIC_FIELD_BOX + INNER_* */
export const BOOKING_PUBLIC_FIELD_INPUT = BOOKING_PUBLIC_FIELD_BOX
