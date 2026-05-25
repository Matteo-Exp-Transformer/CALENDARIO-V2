export type MenuThemeKey =
  | 'mediterranean_teal'
  | 'cream_sage'
  | 'dark_gold'
  | 'rustic_terracotta'

export interface MenuTheme {
  key: MenuThemeKey
  label: string
  /** Colore primario per pallini, cuore, pill attiva */
  accentColor: string
  /** Colore testo su sfondo header */
  headerTextColor: string
  /** URL immagine header (o null = fallback CSS) */
  headerImage: string | null
  /** URL immagine body (o null = fallback CSS) */
  bodyImage: string | null
  /** Fallback bg-color header se immagine assente */
  headerFallbackBg: string
  /** Fallback bg-color body se immagine assente */
  bodyFallbackBg: string
  /** RGB (senza alpha) per sfondo barra tab quando sticky */
  tabBarStickyRgb: string
}

const BASE = import.meta.env.BASE_URL

export const MENU_THEMES: Record<MenuThemeKey, MenuTheme> = {
  mediterranean_teal: {
    key: 'mediterranean_teal',
    label: 'Mediterranean Teal',
    accentColor: '#0d9488',
    headerTextColor: '#ffffff',
    headerImage: `${BASE}menu-themes/mediterranean-teal-header.png`,
    bodyImage: `${BASE}menu-themes/mediterranean-teal-body.png`,
    headerFallbackBg: '#0f766e',
    bodyFallbackBg: '#f0fdfa',
    tabBarStickyRgb: '240, 253, 250',
  },
  cream_sage: {
    key: 'cream_sage',
    label: 'Cream Sage',
    accentColor: '#65a30d',
    headerTextColor: '#1a1a1a',
    headerImage: `${BASE}menu-themes/cream-sage-header.png`,
    bodyImage: `${BASE}menu-themes/cream-sage-body.png`,
    headerFallbackBg: '#d4c5a3',
    bodyFallbackBg: '#fefce8',
    tabBarStickyRgb: '254, 252, 232',
  },
  dark_gold: {
    key: 'dark_gold',
    label: 'Dark Gold',
    accentColor: '#b45309',
    headerTextColor: '#ffffff',
    headerImage: `${BASE}menu-themes/dark-gold-header.png`,
    bodyImage: `${BASE}menu-themes/dark-gold-body.png`,
    headerFallbackBg: '#1c1917',
    /** Sotto il PNG body (scroll lungo): stesso tono texture scura, non crema */
    bodyFallbackBg: '#1c1917',
    tabBarStickyRgb: '28, 25, 23',
  },
  rustic_terracotta: {
    key: 'rustic_terracotta',
    label: 'Rustic Terracotta',
    accentColor: '#c2410c',
    headerTextColor: '#ffffff',
    headerImage: `${BASE}menu-themes/rustic-terracotta-header.png`,
    bodyImage: `${BASE}menu-themes/rustic-terracotta-body.png`,
    headerFallbackBg: '#9a3412',
    /** Sotto il PNG body (bianco in alto → terracotta in basso): tono caldo, non marrone scuro */
    bodyFallbackBg: '#9a3412',
    tabBarStickyRgb: '255, 247, 240',
  },
}

export const DEFAULT_THEME_KEY: MenuThemeKey = 'mediterranean_teal'

export function getMenuTheme(key: string | undefined | null): MenuTheme {
  return MENU_THEMES[(key as MenuThemeKey) ?? DEFAULT_THEME_KEY] ?? MENU_THEMES[DEFAULT_THEME_KEY]
}
