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

/** Default uguale alla prima texture del preset (ordine alfabetico UUID). */
export const DEFAULT_BOOKING_PAGE_TILE: BookingPageTileId = 'tile-01'

export function isBookingPageTileId(value: string): value is BookingPageTileId {
  return (BOOKING_PAGE_TILE_IDS as readonly string[]).includes(value)
}

export function parseBookingPageTileFromDb(raw: unknown): BookingPageTileId {
  if (typeof raw !== 'string' || raw.trim() === '') return DEFAULT_BOOKING_PAGE_TILE
  const v = raw.trim().toLowerCase()
  if (isBookingPageTileId(v)) return v
  return DEFAULT_BOOKING_PAGE_TILE
}

/** Allinea a `import.meta.env.BASE_URL` (es. `/` o `/sottopath/`). */
export function bookingPageTilePublicHref(id: BookingPageTileId, viteBase: string): string {
  return `${viteBase}booking/tiles/${id}.png`
}
