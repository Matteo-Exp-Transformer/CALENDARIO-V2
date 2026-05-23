import type { BookingType } from '@/types/booking'

/** Placeholder textarea editor promo in tab Menu. */
export const MENU_PROMO_PLACEHOLDER = 'Inserisci una promo'

/** Promo banner configurabile dall’admin (una o più righe, con filtro per tipologia prenotazione). */
export interface MenuPromo {
  id: string
  /** Nome interno admin (non mostrato al cliente in pagina Prenota). */
  label: string
  message: string
  /** Tipologie per cui mostrare questo testo (almeno una). */
  booking_types: BookingType[]
  /** Se `false`, non mostrata in pagina Prenota per quella riga. */
  visible_on_booking?: boolean
}

/** Anteprima breve del testo promo (fallback lista admin se manca il nome). */
export function menuPromoMessageSummary(message: string): string {
  const line = message.trim().split(/\n/)[0] ?? ''
  if (!line) return 'Promo senza testo'
  return line.length > 72 ? `${line.slice(0, 72)}…` : line
}

/** Etichetta admin: nome promo, oppure anteprima del testo per righe legacy senza nome. */
export function getMenuPromoAdminLabel(promo: MenuPromo): string {
  const label = promo.label?.trim()
  if (label) return label
  return menuPromoMessageSummary(promo.message)
}

/** Opzioni allineate al `<select booking_type>` del form pubblico. */
export const MENU_PROMO_BOOKING_TYPE_OPTIONS: { value: BookingType; label: string }[] = [
  { value: 'tavolo', label: 'Prenota un tavolo' },
  { value: 'rinfresco_laurea', label: 'Rinfresco di Laurea' },
  { value: 'menu_prezzo_fisso', label: 'Menu a prezzo fisso' },
]

export function isMenuPromoVisibleOnBooking(p: MenuPromo): boolean {
  return p.visible_on_booking !== false
}

/** Tutte le promo visibili per la tipologia scelta (ordine salvato in admin). */
export function listMenuPromoMessagesForBookingType(
  bookingType: BookingType,
  promos: MenuPromo[],
): string[] {
  const rows = promos.filter(
    (p) =>
      isMenuPromoVisibleOnBooking(p) &&
      Boolean(p.message?.trim()) &&
      p.booking_types.includes(bookingType),
  )
  return rows.map((p) => p.message.trim())
}

/** Nomi promo visibili al momento della prenotazione (solo label non vuote, ordine admin). */
export function listMenuPromoLabelsForBookingType(
  bookingType: BookingType,
  promos: MenuPromo[],
): string[] {
  const rows = promos.filter(
    (p) =>
      isMenuPromoVisibleOnBooking(p) &&
      Boolean(p.message?.trim()) &&
      p.booking_types.includes(bookingType),
  )
  return rows.map((p) => p.label?.trim()).filter((label): label is string => Boolean(label))
}

/** Normalizza `menu_promo_labels` da DB (JSONB array o stringa JSON). */
export function parseMenuPromoLabelsFromBooking(raw: unknown): string[] {
  if (raw == null) return []
  if (Array.isArray(raw)) {
    return raw.map((item) => String(item ?? '').trim()).filter((label) => label.length > 0)
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (!trimmed) return []
    try {
      const parsed = JSON.parse(trimmed) as unknown
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item ?? '').trim()).filter((label) => label.length > 0)
      }
    } catch {
      return [trimmed]
    }
  }
  return []
}

/**
 * Label promo da mostrare in admin: snapshot salvato sulla prenotazione,
 * oppure fallback dalle impostazioni correnti se manca (prenotazioni precedenti al deploy).
 */
export function resolveMenuPromoLabelsForBooking(
  booking: { booking_type?: BookingType | null; menu_promo_labels?: unknown },
  promos: MenuPromo[],
): string[] {
  const saved = parseMenuPromoLabelsFromBooking(booking.menu_promo_labels)
  if (saved.length > 0) return saved
  return listMenuPromoLabelsForBookingType(booking.booking_type ?? 'tavolo', promos)
}
