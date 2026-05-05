import type { CSSProperties } from 'react'

/** Strip brand dashboard (nome locale header) — stesso trattamento visivo anche su altri blocchi admin. */
export const ADMIN_WARM_GRADIENT_SURFACE: CSSProperties = {
  backgroundImage:
    'linear-gradient(90deg, rgb(255 237 213) 0%, rgb(255 247 237) 42%, rgb(254 249 195) 100%)',
  borderColor: 'rgba(253, 186, 116, 0.55)'
}
