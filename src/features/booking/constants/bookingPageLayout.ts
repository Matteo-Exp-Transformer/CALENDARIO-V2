/** Breakpoint riepilogo laterale desktop (allineato a `BOOKING_PUBLIC_SUMMARY_SIDEBAR_MIN_PX`). */
export { BOOKING_PUBLIC_SUMMARY_SIDEBAR_MIN_PX } from './bookingPublicFieldStyles'

/**
 * Tetto larghezza form su desktop full-page (senza striscia): 4 card ingredienti × 280px
 * + 3 gap-4 (16px) in `ComposeScrollRow` ≥700px → 1168px.
 */
export const BOOKING_FULL_PAGE_FORM_MAX_WIDTH_PX = 1168

/** Larghezza riepilogo desktop nel blocco centrato full-page (affiancato al cap form). */
export const BOOKING_FULL_PAGE_SUMMARY_WIDTH_PX = 360

/**
 * Viewport minimo per riepilogo **esterno** a destra del cap form (full-page senza striscia).
 * Sotto questo breakpoint il riepilogo resta sotto il form (come mobile); 1256–1599 = stack.
 */
export const BOOKING_FULL_PAGE_EXTERNAL_SUMMARY_MIN_PX = 1600
