import type { BookingType } from '@/types/booking'

export type SubTabIcon = 'utensils' | 'cloche' | 'chef-hat' | 'star' | 'leaf'
export const BOOKING_MODE_ICONS = [
  'utensils',
  'cloche',
  'chef-hat',
  'wine',
  'coffee',
  'pizza',
  'hamburger',
  'bowl-steam',
  'cake',
  'martini',
] as const
export type BookingModeIcon = (typeof BOOKING_MODE_ICONS)[number]

export const BOOKING_HEADER_FONT_OPTIONS = [
  {
    id: 'playfair',
    label: 'Playfair Display',
    fontFamily: '"Playfair Display", Georgia, serif',
  },
  {
    id: 'cormorant',
    label: 'Cormorant Garamond',
    fontFamily: '"Cormorant Garamond", Georgia, serif',
  },
  {
    id: 'libre-baskerville',
    label: 'Libre Baskerville',
    fontFamily: '"Libre Baskerville", Georgia, serif',
  },
  {
    id: 'cinzel',
    label: 'Cinzel',
    fontFamily: '"Cinzel", Georgia, serif',
  },
  {
    id: 'montserrat',
    label: 'Montserrat',
    fontFamily: '"Montserrat", Inter, system-ui, sans-serif',
  },
  {
    id: 'mistral',
    label: 'Mistral',
    fontFamily: '"Mistral", "Brush Script MT", "Segoe Script", cursive',
  },
  {
    id: 'thirsty-script',
    label: 'Thirsty Script',
    fontFamily: '"Thirsty Script", "Lobster", "Pacifico", cursive',
  },
] as const

export type BookingHeaderFontId = (typeof BOOKING_HEADER_FONT_OPTIONS)[number]['id']

export type BookingHeaderTextTarget = 'restaurant_name' | 'page_title' | 'page_description'

export interface BookingHeaderTextStyle {
  font: BookingHeaderFontId
  color: string
}

export type BookingHeaderStyles = Record<BookingHeaderTextTarget, BookingHeaderTextStyle>

export const DEFAULT_BOOKING_HEADER_STYLES: BookingHeaderStyles = {
  restaurant_name: { font: 'playfair', color: '#6b4226' },
  page_title: { font: 'playfair', color: '#6b4226' },
  page_description: { font: 'montserrat', color: '#4a2d19' },
}

const BOOKING_HEADER_FONT_IDS = BOOKING_HEADER_FONT_OPTIONS.map((font) => font.id)
const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/

export function isBookingHeaderFontId(value: unknown): value is BookingHeaderFontId {
  return typeof value === 'string' && BOOKING_HEADER_FONT_IDS.includes(value as BookingHeaderFontId)
}

export function getBookingHeaderFontFamily(font: BookingHeaderFontId): string {
  return BOOKING_HEADER_FONT_OPTIONS.find((option) => option.id === font)?.fontFamily
    ?? BOOKING_HEADER_FONT_OPTIONS[0].fontFamily
}

/** Dimensioni responsive intestazione Prenota — admin (anteprima nel campo) e pagina pubblica. */
export const BOOKING_HEADER_FONT_SIZE: Record<BookingHeaderTextTarget, string> = {
  restaurant_name: 'clamp(1.75rem, 5.2vw, 2.125rem)',
  page_title: 'clamp(1.5rem, 4.2vw, 1.875rem)',
  page_description: 'clamp(1rem, 2.8vw, 1.0625rem)',
}

export function getBookingHeaderFontSize(target: BookingHeaderTextTarget): string {
  return BOOKING_HEADER_FONT_SIZE[target]
}

export function getBookingHeaderTextStyle(
  target: BookingHeaderTextTarget,
  headerStyles: BookingHeaderStyles,
): {
  fontFamily: string
  color: string
  fontSize: string
  lineHeight: number
} {
  const style = headerStyles[target] ?? DEFAULT_BOOKING_HEADER_STYLES[target]
  return {
    fontFamily: getBookingHeaderFontFamily(style.font),
    color: style.color,
    fontSize: BOOKING_HEADER_FONT_SIZE[target],
    lineHeight: target === 'page_description' ? 1.42 : 1.15,
  }
}

export function normalizeBookingHeaderColor(value: unknown, fallback: string): string {
  return typeof value === 'string' && HEX_COLOR_RE.test(value.trim()) ? value.trim() : fallback
}

export function parseBookingHeaderStylesFromUnknown(raw: unknown): BookingHeaderStyles {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return DEFAULT_BOOKING_HEADER_STYLES
  const obj = raw as Record<string, unknown>
  const targets: BookingHeaderTextTarget[] = ['restaurant_name', 'page_title', 'page_description']

  return targets.reduce<BookingHeaderStyles>((acc, target) => {
    const fallback = DEFAULT_BOOKING_HEADER_STYLES[target]
    const row = obj[target]
    const value = row && typeof row === 'object' && !Array.isArray(row)
      ? (row as Record<string, unknown>)
      : {}
    acc[target] = {
      font: isBookingHeaderFontId(value.font) ? value.font : fallback.font,
      color: normalizeBookingHeaderColor(value.color, fallback.color),
    }
    return acc
  }, { ...DEFAULT_BOOKING_HEADER_STYLES })
}

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
  icon: BookingModeIcon
  sub_tabs_enabled: boolean
  sub_tabs_display: 'horizontal' | 'carousel'
  sub_tabs: SubTab[]
  /** @deprecated Migrato a runtime in `sub_tabs` se vuoto. */
  sub_tabs_overrides?: SubTabOverride[]
}

export interface BookingPublicFormConfig {
  page_title: string
  page_description: string
  header_styles: BookingHeaderStyles
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
  header_styles: DEFAULT_BOOKING_HEADER_STYLES,
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

/** Trim solo al salvataggio — mai in onChange, altrimenti la barra spaziatrice non funziona mentre si digita. */
export function normalizeBookingPublicFormConfig(
  config: BookingPublicFormConfig,
): BookingPublicFormConfig {
  return {
    page_title: config.page_title.trim(),
    page_description: config.page_description.trim(),
    header_styles: parseBookingHeaderStylesFromUnknown(config.header_styles),
    booking_modes: config.booking_modes.map((mode) => ({
      ...mode,
      label: mode.label.trim(),
      description: mode.description.trim(),
      sub_tabs: (mode.sub_tabs ?? []).map((tab) => ({
        ...tab,
        label: tab.label.trim(),
        description: tab.description?.trim() ? tab.description.trim() : undefined,
      })),
    })),
  }
}
