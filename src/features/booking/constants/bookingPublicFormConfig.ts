import type { BookingType } from '@/types/booking'
import type { CarouselItem, CarouselSlideIcon } from '@/types/menu'

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

/**
 * Campi della card Prenota che possono essere personalizzati dal ristoratore
 * sovrascrivendo il preset collegato. La bandierina booleana indica:
 * `true` = personalizzato dal ristoratore (resta anche se il preset cambia)
 * `false`/`undefined` = ereditato dal preset (segue il preset live)
 */
export type SubTabOverridableField =
  | 'label'
  | 'description'
  | 'price_per_person'
  | 'hidden_item_ids'
  | 'hidden_category_keys'

export type SubTabFieldOverrides = Partial<Record<SubTabOverridableField, boolean>>

export interface SubTab {
  id: string
  display: 'cards' | 'carousel'
  label: string
  icon?: SubTabIcon
  preset_id?: string
  price_per_person?: number
  /** Omesso o true = ingredienti bloccati; false = cliente puo modificarli e non ha prezzo fisso. */
  is_fixed_menu?: boolean
  description?: string
  hidden_category_keys?: string[]
  hidden_item_ids?: string[]
  carousel_items?: CarouselItem[]
  /**
   * Tracking personalizzazioni vs preset.
   * Vedi `bookingFormResolver.ts` per il comportamento «aggiorna solo se non personalizzato».
   */
  field_overrides?: SubTabFieldOverrides
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
  /**
   * XOR presentazione sottotab per questa modalità.
   * null = non ancora scelto (prima sottotab non ancora salvata).
   * Calcolato dalla maggioranza di sub_tabs[].display al primo parse di dati legacy.
   */
  sub_tabs_presentation: 'cards' | 'carousel' | null
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

function parseCarouselSlideIcon(value: unknown): CarouselSlideIcon | undefined {
  return typeof value === 'string' && SUB_TAB_ICONS.includes(value as SubTabIcon)
    ? (value as CarouselSlideIcon)
    : undefined
}

/** Migra testi legacy da livello sottotab alla prima slide; il carosello puo mantenere il prezzo fisso. */
export function migrateLegacyCarouselSubTab(tab: SubTab): SubTab {
  if (tab.display !== 'carousel') return tab

  const items = tab.carousel_items ?? []
  if (items.length === 0) {
    return {
      ...tab,
      price_per_person: tab.price_per_person,
      description: undefined,
    }
  }

  const migratedItems: CarouselItem[] = items.map((item, idx) => {
    if (idx !== 0) return item
    return {
      ...item,
      eyebrow: item.eyebrow?.trim() || tab.label?.trim() || undefined,
      title: item.title?.trim() || undefined,
      description: item.description?.trim() || tab.description?.trim() || undefined,
      icon: item.icon ?? tab.icon,
    }
  })

  const first = migratedItems[0]
  const label = first.eyebrow?.trim() || first.title?.trim() || tab.label

  return {
    ...tab,
    label,
    description: undefined,
    price_per_person: tab.price_per_person,
    icon: undefined,
    carousel_items: migratedItems,
  }
}

export function parseSubTabFromUnknown(raw: unknown): SubTab | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const o = raw as Record<string, unknown>
  const legacyType = o.type === 'preset' || o.type === 'manual' ? o.type : null
  const display =
    o.display === 'carousel' || o.sub_tabs_display === 'carousel'
      ? 'carousel'
      : ('cards' as const)
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
  const hidden_category_keys = Array.isArray(o.hidden_category_keys)
    ? o.hidden_category_keys.filter((v): v is string => typeof v === 'string' && v.trim().length > 0).map((v) => v.trim())
    : undefined
  const hidden_item_ids = Array.isArray(o.hidden_item_ids)
    ? o.hidden_item_ids.filter((v): v is string => typeof v === 'string' && v.trim().length > 0).map((v) => v.trim())
    : undefined
  const carousel_items = Array.isArray(o.carousel_items)
    ? o.carousel_items
        .filter((v): v is CarouselItem => {
          if (!v || typeof v !== 'object' || Array.isArray(v)) return false
          const item = v as Partial<CarouselItem>
          return typeof item.image_url === 'string' && item.image_url.trim().length > 0
        })
        .map((v, idx) => ({
          image_url: v.image_url,
          eyebrow: typeof v.eyebrow === 'string' && v.eyebrow.trim() ? v.eyebrow.trim() : undefined,
          title: typeof v.title === 'string' && v.title.trim() ? v.title.trim() : undefined,
          description:
            typeof v.description === 'string' && v.description.trim() ? v.description.trim() : undefined,
          icon: parseCarouselSlideIcon((v as Partial<CarouselItem>).icon),
          sort_order: typeof v.sort_order === 'number' ? v.sort_order : idx,
        }))
    : undefined

  const preset_id =
    legacyType !== 'manual' && typeof o.preset_id === 'string' && o.preset_id.trim()
      ? o.preset_id.trim()
      : undefined

  const field_overrides = parseFieldOverridesFromUnknown(o.field_overrides)

  const parsed: SubTab = {
    id,
    display,
    label,
    icon,
    preset_id,
    price_per_person,
    is_fixed_menu: typeof o.is_fixed_menu === 'boolean' ? o.is_fixed_menu : undefined,
    description: display === 'carousel' ? undefined : description,
    hidden_category_keys,
    hidden_item_ids,
    carousel_items,
    field_overrides,
  }

  return display === 'carousel' ? migrateLegacyCarouselSubTab(parsed) : parsed
}

const OVERRIDABLE_FIELDS: SubTabOverridableField[] = [
  'label',
  'description',
  'price_per_person',
  'hidden_item_ids',
  'hidden_category_keys',
]

function parseFieldOverridesFromUnknown(raw: unknown): SubTabFieldOverrides | undefined {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined
  const obj = raw as Record<string, unknown>
  const result: SubTabFieldOverrides = {}
  let hasAny = false
  for (const key of OVERRIDABLE_FIELDS) {
    if (typeof obj[key] === 'boolean') {
      result[key] = obj[key] as boolean
      hasAny = true
    }
  }
  return hasAny ? result : undefined
}

export function migrateOverridesToSubTabs(overrides: SubTabOverride[]): SubTab[] {
  return overrides
    .filter((o) => o.preset_id && o.custom_label.trim())
    .map((o) => ({
      id: `legacy-${o.preset_id}`,
      display: 'cards' as const,
      label: o.custom_label.trim(),
      preset_id: o.preset_id,
    }))
}

/**
 * Allinea `sub_tabs[].label` (Etichetta card) con `sub_tabs_overrides` legacy:
 * se la label salvata coincide ancora col nome del preset staff ma esiste un override
 * con etichetta personalizzata, usa l'override per la pagina Prenota.
 */
export function applyLegacySubTabLabelOverrides(
  subTabs: SubTab[],
  legacyOverrides: SubTabOverride[] | undefined,
  staffPresets: { id: string; name: string }[],
): SubTab[] {
  if (!legacyOverrides?.length) return subTabs
  return subTabs.map((tab) => {
    if (!tab.preset_id) return tab
    const override = legacyOverrides.find((o) => o.preset_id === tab.preset_id)
    const custom = override?.custom_label?.trim()
    if (!custom) return tab
    const label = tab.label?.trim() ?? ''
    const presetName = staffPresets.find((p) => p.id === tab.preset_id)?.name?.trim()
    if (!label) return { ...tab, label: custom }
    if (presetName && label === presetName && custom !== label) {
      return { ...tab, label: custom }
    }
    return tab
  })
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
      sub_tabs_presentation: null,
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
      sub_tabs_presentation: null,
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
      sub_tabs_presentation: null,
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
      sub_tabs_presentation: mode.sub_tabs_presentation ?? null,
      sub_tabs: (mode.sub_tabs ?? []).map((tab): SubTab => {
        const display: SubTab['display'] = tab.display === 'carousel' ? 'carousel' : 'cards'
        const base: SubTab = {
          ...tab,
          display,
          label: tab.label.trim(),
          is_fixed_menu: display === 'cards' && tab.is_fixed_menu === false ? false : undefined,
          price_per_person: display === 'cards' && tab.is_fixed_menu === false ? undefined : tab.price_per_person,
          hidden_category_keys: tab.hidden_category_keys?.filter((v) => v.trim()) ?? undefined,
          hidden_item_ids: tab.hidden_item_ids?.filter((v) => v.trim()) ?? undefined,
          carousel_items: tab.carousel_items,
          field_overrides: tab.field_overrides,
        }
        if (display === 'carousel') {
          return migrateLegacyCarouselSubTab({
            ...base,
            description: undefined,
            icon: undefined,
          })
        }
        return {
          ...base,
          description: tab.description?.trim() ? tab.description.trim() : undefined,
        }
      }),
    })),
  }
}
