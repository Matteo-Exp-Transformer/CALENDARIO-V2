/**
 * Pannello ingredienti aperto in `BookingMenuCategoryCard`: max 3 righe tipo "con foto", poi scroll interno.
 *
 * Riga di riferimento (ingrediente con `image_url`, come in JSX):
 * - `py-2` sul label → 1rem padding verticale totale
 * - foto `aspect-4/3` (default) / `sm:aspect-3/2` → altezza ≈ (larghezza contenuto − 1rem) × rapporto
 * - `mb-2` sotto foto → 0.5rem
 * - riga checkbox/nome `min-h-[44px]` → 44px
 * - gap lista `gap-px` → 1px tra righe
 *
 * Larghezza contenuto foto ≈ larghezza card (`100cqw` con `@container` sull'article) meno `px-2` (1rem).
 * Ingredienti senza foto restano più bassi; il cap resta su 3 slot "pieni" per altezza uniforme.
 */
export const BOOKING_MENU_CATEGORY_PANEL_SCROLL_CLASS =
  'overflow-y-auto overscroll-y-contain max-h-[calc(3*(1rem+0.5rem+44px+(100cqw-1rem)*3/4)+2*1px)] sm:max-h-[calc(3*(1rem+0.5rem+44px+(100cqw-1rem)*2/3)+2*1px)]'

/** Card aperta in portal (`position: fixed`): stessa larghezza della card chiusa (shell), sopra form/sidebar, sotto sticky bar (`z-200`). */
export const BOOKING_MENU_CATEGORY_EXPANDED_PORTAL_CLASS = 'fixed z-[160] shadow-xl'

export type BookingMenuCategoryOverlayRect = {
  top: number
  left: number
  width: number
}
