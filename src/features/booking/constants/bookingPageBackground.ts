/** Tile PNG in `public/booking/tiles/` (nome file = id + `.png`). Estendibile senza modifiche al tipo. */
export const BOOKING_PAGE_TILE_IDS = [
  'tile-01',
  'tile-02',
  'tile-03',
  'tile-04',
  'tile-05',
  'tile-06',
  'tile-07',
  'tile-08',
  'tile-09',
  'tile-10',
  'tile-11',
  'tile-12',
  'tile-13',
  'tile-14',
  'tile-15',
] as const

export type BookingPageTileId = (typeof BOOKING_PAGE_TILE_IDS)[number]

/**
 * Sfondo neutro se uno slot gradiente e selezionato ma `css` e ancora `null`
 * (anteprima admin + pagina Prenota).
 */
export const BOOKING_PAGE_GRADIENT_PLACEHOLDER_CSS =
  'linear-gradient(180deg, #e2e8f0 0%, #f8fafc 100%)'

/** Gradienti CSS salvati come id stringa (stesso setting `public_booking_page_background`). */
export const BOOKING_PAGE_GRADIENT_PRESETS = [
  { id: 'gradient-01', css: null as string | null },
  { id: 'gradient-02', css: null as string | null },
  { id: 'gradient-03', css: null as string | null },
  { id: 'gradient-04', css: null as string | null },
  { id: 'gradient-05', css: null as string | null },
  { id: 'gradient-06', css: null as string | null },
  { id: 'gradient-07', css: null as string | null },
  { id: 'gradient-08', css: null as string | null },
  { id: 'gradient-09', css: null as string | null },
  { id: 'gradient-10', css: null as string | null },
  { id: 'gradient-11', css: null as string | null },
  { id: 'gradient-12', css: null as string | null },
] as const

export type BookingPageGradientPreset = (typeof BOOKING_PAGE_GRADIENT_PRESETS)[number]
export type BookingPageGradientId = BookingPageGradientPreset['id']

export const BOOKING_PAGE_GRADIENT_IDS = BOOKING_PAGE_GRADIENT_PRESETS.map((g) => g.id)

export type BookingPageBackgroundId = BookingPageTileId | BookingPageGradientId

/** Default uguale alla prima texture del preset (ordine alfabetico UUID). */
export const DEFAULT_BOOKING_PAGE_TILE: BookingPageTileId = 'tile-01'
export const DEFAULT_BOOKING_PAGE_BACKGROUND: BookingPageBackgroundId = DEFAULT_BOOKING_PAGE_TILE

export function isBookingPageTileId(value: string): value is BookingPageTileId {
  return (BOOKING_PAGE_TILE_IDS as readonly string[]).includes(value)
}

export function isBookingPageGradientId(value: string): value is BookingPageGradientId {
  return (BOOKING_PAGE_GRADIENT_IDS as readonly string[]).includes(value)
}

export function isBookingPageBackgroundId(value: string): value is BookingPageBackgroundId {
  return isBookingPageTileId(value) || isBookingPageGradientId(value)
}

export function parseBookingPageBackgroundFromDb(raw: unknown): BookingPageBackgroundId {
  if (typeof raw !== 'string' || raw.trim() === '') return DEFAULT_BOOKING_PAGE_BACKGROUND
  const v = raw.trim().toLowerCase()
  if (isBookingPageBackgroundId(v)) return v
  return DEFAULT_BOOKING_PAGE_BACKGROUND
}

/** @deprecated Preferisci `parseBookingPageBackgroundFromDb`; restituisce solo tile note o default tile. */
export function parseBookingPageTileFromDb(raw: unknown): BookingPageTileId {
  const bg = parseBookingPageBackgroundFromDb(raw)
  return isBookingPageTileId(bg) ? bg : DEFAULT_BOOKING_PAGE_TILE
}

export function bookingPageGradientCss(id: BookingPageGradientId): string {
  const preset = BOOKING_PAGE_GRADIENT_PRESETS.find((p) => p.id === id)
  return (preset?.css && preset.css.trim() !== '') ? preset.css : BOOKING_PAGE_GRADIENT_PLACEHOLDER_CSS
}

/** Allinea a `import.meta.env.BASE_URL` (es. `/` o `/sottopath/`). */
export function bookingPageTilePublicHref(id: BookingPageTileId, viteBase: string): string {
  return `${viteBase}booking/tiles/${id}.png`
}
