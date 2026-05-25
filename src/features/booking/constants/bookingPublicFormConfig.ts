import type { BookingType } from '@/types/booking'

export interface BookingMode {
  id: string
  booking_type: BookingType
  enabled: boolean
  label: string
  description: string
  icon: 'utensils' | 'cloche' | 'chef-hat'
  sub_tabs_enabled: boolean
  sub_tabs_display: 'horizontal'
  sub_tabs: []
}

export interface BookingPublicFormConfig {
  page_title: string
  page_description: string
  booking_modes: BookingMode[]
}

export const DEFAULT_BOOKING_FORM_CONFIG: BookingPublicFormConfig = {
  page_title: 'Richiesta Prenotazione',
  page_description:
    'Compilando questo form invierai una richiesta allo staff. Ti contatteremo al più presto per comunicarti l\'esito!',
  booking_modes: [
    {
      id: 'tavolo',
      booking_type: 'tavolo',
      enabled: true,
      label: 'Prenota un Tavolo',
      description: 'Semplice prenotazione tavolo senza menu predefinito.',
      icon: 'utensils',
      sub_tabs_enabled: false,
      sub_tabs_display: 'horizontal',
      sub_tabs: [],
    },
    {
      id: 'menu_prezzo_fisso',
      booking_type: 'menu_prezzo_fisso',
      enabled: true,
      label: 'Menu a Prezzo Fisso',
      description: 'Scegli il tuo menu componendo le portate a prezzo fisso.',
      icon: 'cloche',
      sub_tabs_enabled: false,
      sub_tabs_display: 'horizontal',
      sub_tabs: [],
    },
    {
      id: 'rinfresco_laurea',
      booking_type: 'rinfresco_laurea',
      enabled: true,
      label: 'Rinfresco di Laurea',
      description: 'Organizza il tuo rinfresco di laurea con menu personalizzato.',
      icon: 'chef-hat',
      sub_tabs_enabled: false,
      sub_tabs_display: 'horizontal',
      sub_tabs: [],
    },
  ],
}
