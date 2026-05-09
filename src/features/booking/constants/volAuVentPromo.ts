import type { BookingType } from '@/types/booking'

/** Soglia €/persona per l’omaggio automatico “Mini Rustici Misti” nel flusso rinfresco. */
export const VOL_AU_VENT_THRESHOLD_EUR = 17 as const

/** Testo predefinito del banner promo: vuoto per nuovi tenant, compilabile da pannello admin. */
export const DEFAULT_VOL_AU_VENT_PROMO_MESSAGE = ''

/** Placeholder mostrato nell'editor admin quando il testo promo è vuoto. */
export const VOL_AU_VENT_PROMO_PLACEHOLDER = 'Inserisci una promo nella sezione menù'

/** Promo banner configurabile dall’admin (una o più righe, con filtro per tipologia prenotazione). */
export interface VolAuVentPromo {
  id: string
  message: string
  /** Tipologie per cui mostrare questo testo (almeno una). */
  booking_types: BookingType[]
  /** Se `false`, non mostrata in pagina Prenota per quella riga. */
  visible_on_booking?: boolean
}

/** Opzioni allineate al `<select booking_type>` del form pubblico. */
export const VOL_AU_VENT_PROMO_BOOKING_TYPE_OPTIONS: { value: BookingType; label: string }[] = [
  { value: 'tavolo', label: 'Prenota un tavolo' },
  { value: 'rinfresco_laurea', label: 'Rinfresco di Laurea' },
  { value: 'menu_prezzo_fisso', label: 'Menu a prezzo fisso' },
]

export function isVolAuVentPromoVisibleOnBooking(p: VolAuVentPromo): boolean {
  return p.visible_on_booking !== false
}

/**
 * Messaggio da mostrare sopra al menu nel form pubblico: prima promo visibile che matcha la tipologia,
 * altrimenti il messaggio legacy (`booking_vol_au_vent_promo_message`).
 */
export function resolveVolAuVentPromoMessage(
  bookingType: BookingType,
  promos: VolAuVentPromo[],
  legacyMessage: string,
): string {
  const list = listVolAuVentPromoMessagesForBookingType(bookingType, promos, legacyMessage)
  return list[0] ?? ''
}

/** Tutte le promo visibili per la tipologia scelta (ordine salvato in admin); se nessuna, solo legacy come elemento unico. */
export function listVolAuVentPromoMessagesForBookingType(
  bookingType: BookingType,
  promos: VolAuVentPromo[],
  legacyMessage: string,
): string[] {
  const legacy = legacyMessage.trim()
  const rows = promos.filter(
    (p) =>
      isVolAuVentPromoVisibleOnBooking(p) &&
      p.message.trim() &&
      p.booking_types.includes(bookingType),
  )
  if (rows.length > 0) {
    return rows.map((p) => p.message.trim())
  }
  if (legacy) {
    return [legacy]
  }
  return []
}
