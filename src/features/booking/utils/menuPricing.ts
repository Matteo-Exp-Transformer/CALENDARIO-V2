import type { BookingRequest } from '@/types/booking'

export interface MenuPriceDisplay {
  // Prezzo Menù: prezzo a persona
  prezzoMenu: number
  prezzoMenuLabel: string
  breakdownLabel?: string
  
  // Prezzo Totale: prezzo totale prenotazione (con tiramisu se presente)
  prezzoTotale: number | null
  prezzoTotaleLabel: string | null
  
  // Campi legacy per retrocompatibilità
  totalLabel: string
  totalPerPerson: number
  basePerPerson: number
}

export const buildMenuPriceDisplay = (
  menu_total_per_person?: number | null,
  menu_total_booking?: number | null
): MenuPriceDisplay | null => {
  if (!menu_total_per_person || menu_total_per_person <= 0) {
    return null
  }

  const prezzoMenu = menu_total_per_person
  const basePerPerson = prezzoMenu
  
  const prezzoMenuLabel = `€${prezzoMenu.toFixed(2)}/persona`
  const breakdownLabel = undefined

  const prezzoTotale = menu_total_booking ?? null
  const prezzoTotaleLabel = prezzoTotale !== null
    ? `€${prezzoTotale.toFixed(2)}`
    : null

  return {
    prezzoMenu,
    prezzoMenuLabel,
    breakdownLabel,
    prezzoTotale,
    prezzoTotaleLabel,
    // Legacy fields per retrocompatibilità
    totalLabel: prezzoMenuLabel,
    totalPerPerson: prezzoMenu,
    basePerPerson
  }
}

export const getMenuPriceDisplayFromBooking = (booking: BookingRequest): MenuPriceDisplay | null => {
  return buildMenuPriceDisplay(
    booking.menu_total_per_person,
    booking.menu_total_booking
  )
}

/** Prezzi da DB (`menu_total_*`) oppure derivati dalla selezione rinfresco (come nelle card dettaglio). */
export function getResolvedMenuPriceDisplay(booking: BookingRequest): MenuPriceDisplay | null {
  const fromDb = getMenuPriceDisplayFromBooking(booking)

  if (booking.booking_type === 'rinfresco_laurea' && booking.menu_selection?.items) {
    const baseTotal = booking.menu_selection.items
      .filter((item) => !item.name.toLowerCase().includes('tiramis'))
      .reduce((sum, item) => sum + (item.totalPrice || item.price), 0)
    const tiramisuTotal = booking.menu_selection.tiramisu_total || 0
    const totalBooking = baseTotal * (booking.num_guests || 0) + tiramisuTotal

    const overlay = {
      prezzoMenu: baseTotal,
      prezzoMenuLabel: `€${baseTotal.toFixed(2)}/persona`,
      breakdownLabel: undefined,
      prezzoTotale: totalBooking,
      prezzoTotaleLabel: `€${totalBooking.toFixed(2)}`,
      totalLabel: `€${baseTotal.toFixed(2)}/persona`,
      totalPerPerson: baseTotal,
      basePerPerson: baseTotal,
    }

    if (fromDb) {
      return overlay
    }
    if (baseTotal > 0 || tiramisuTotal > 0) {
      return overlay
    }
    return null
  }

  return fromDb
}

