/** Tema dashboard admin (persistito in `restaurant_settings.app_theme`). Aggiungere nuovi id qui e in `restaurantSettingRegistry`. */
export const APP_THEME_IDS = ['midnight-blue', 'theme-2', 'theme-3'] as const

export type AppThemeId = (typeof APP_THEME_IDS)[number]

export const DEFAULT_APP_THEME: AppThemeId = 'midnight-blue'

export function isAppThemeId(value: unknown): value is AppThemeId {
  if (typeof value !== 'string') return false
  const s = value.trim().toLowerCase()
  return (APP_THEME_IDS as readonly string[]).includes(s)
}

function previewHref(filename: string): string {
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`
  return `${base}theme-previews/${filename}`
}

export type AppThemeOption = {
  id: AppThemeId
  label: string
  /** URL assoluta per `<img src>` (public/) */
  previewSrc: string
}

export const APP_THEME_OPTIONS: AppThemeOption[] = [
  { id: 'midnight-blue', label: 'Midnight Blue', previewSrc: previewHref('midnight-blue.png') },
  { id: 'theme-2', label: 'Terracotta & Sand', previewSrc: previewHref('theme-2.png') },
  { id: 'theme-3', label: 'Sage & Stone', previewSrc: previewHref('theme-3.png') },
]

export function parseAppThemeFromDb(raw: unknown): AppThemeId {
  const s = typeof raw === 'string' ? raw.trim().toLowerCase() : ''
  if (isAppThemeId(s)) return s
  return DEFAULT_APP_THEME
}
