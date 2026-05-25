import type { BookingType } from '@/types/booking'

export type SubTabIcon = 'utensils' | 'cloche' | 'chef-hat' | 'star' | 'leaf'

export interface SubTab {
  id: string
  type: 'preset' | 'manual'
  label: string
  icon?: SubTabIcon
  preset_id?: string
  price_per_person?: number
  description?: string
}

/** @deprecated Usare `sub_tabs[]` con type preset. Mantenuto per migrazione runtime da DB. */
export interface SubTabOverride {
  preset_id: string
  custom_label: string
}

export interface BookingMode {
  id: string
  booking_type: BookingType
  enabled: boolean
  label: string
  description: string
  icon: 'utensils' | 'cloche' | 'chef-hat'
  sub_tabs_enabled: boolean
  sub_tabs_display: 'horizontal' | 'carousel'
  sub_tabs: SubTab[]
  /** @deprecated Migrato a runtime in `sub_tabs` se vuoto. */
  sub_tabs_overrides?: SubTabOverride[]
}

export interface BookingPublicFormConfig {
  page_title: string
  page_description: string
  booking_modes: BookingMode[]
}

const SUB_TAB_ICONS: SubTabIcon[] = ['utensils', 'cloche', 'chef-hat', 'star', 'leaf']

export function parseSubTabFromUnknown(raw: unknown): SubTab | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const o = raw as Record<string, unknown>
  const type = o.type === 'preset' || o.type === 'manual' ? o.type : null
  if (!type) return null
  const id = typeof o.id === 'string' && o.id.trim() ? o.id.trim() : null
  const label = typeof o.label === 'string' ? o.label.trim() : ''
  if (!id || !label) return null

  const icon =
    typeof o.icon === 'string' && SUB_TAB_ICONS.includes(o.icon as SubTabIcon)
      ? (o.icon as SubTabIcon)
      : undefined

  let price_per_person: number | undefined
  if (typeof o.price_per_person === 'number' && o.price_per_person >= 0) {
    price_per_person = o.price_per_person
  }

  const description = typeof o.description === 'string' ? o.description.trim() : undefined

  if (type === 'preset') {
    const preset_id = typeof o.preset_id === 'string' && o.preset_id.trim() ? o.preset_id.trim() : undefined
    if (!preset_id) return null
    return { id, type, label, icon, preset_id, price_per_person, description }
  }

  return { id, type, label, icon, price_per_person, description }
}

export function migrateOverridesToSubTabs(overrides: SubTabOverride[]): SubTab[] {
  return overrides
    .filter((o) => o.preset_id && o.custom_label.trim())
    .map((o) => ({
      id: `legacy-${o.preset_id}`,
      type: 'preset' as const,
      label: o.custom_label.trim(),
      preset_id: o.preset_id,
    }))
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
