/**
 * Tipologie di prenotazione con flusso menù / ingredienti (stesso di "Rinfresco di Laurea").
 */
export function bookingTypeUsesMenuSelections(bookingType: string | null | undefined): boolean {
  return bookingType === 'rinfresco_laurea' || bookingType === 'menu_prezzo_fisso'
}
