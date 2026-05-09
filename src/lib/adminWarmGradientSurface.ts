import type { CSSProperties } from 'react'

/** Bordo pannelli admin (tema ice — allineato a `--color-border`). */
export const ADMIN_WARM_BORDER = '#D8E1EA' as const

/**
 * Superficie card pannelli admin (toolbar Menu, editor, panoramiche).
 * Nome storico `ADMIN_WARM_GRADIENT_*`: niente più gradient arancio.
 */
export const ADMIN_WARM_GRADIENT_SURFACE: CSSProperties = {
  backgroundColor: '#f6f8fb',
  backgroundImage: 'none',
  borderColor: ADMIN_WARM_BORDER,
}
