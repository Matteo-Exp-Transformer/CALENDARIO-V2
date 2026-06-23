/**
 * Logica feature flag della Console — NON importa da ../src.
 *
 * PERCHÉ ESISTE QUESTO FILE:
 *   La Console non può importare da src/ (RULE-4 delle 4 regole d'oro).
 *   Ricrea fedelmente la logica di `src/config/features.ts` (buildFeatures) per calcolare
 *   il set di feature attive combinando edition + override tenant_features.
 *
 * FONTE DI VERITÀ:
 *   Il codice originale è src/config/features.ts (leggilo per confronto — NON importarlo).
 *   Se buildFeatures cambia lì, aggiornare anche qui.
 *
 * BUNDLE RICREATI (da src/config/features.ts):
 *   classic    → Set vuoto (nessuna feature avanzata)
 *   pro        → PRO_BUNDLE (tutte le 9 feature)
 *   enterprise → PRO_BUNDLE (identico a pro)
 *
 * FEATURE KEY VALIDE (keyof FeatureFlags in src/config/features.ts):
 *   sidebar, home, crm, analytics, servizio, walkIn, noShow, tableAssignments, qrMenu
 */

import type { Edition } from '@console/lib/editionUtils'

// ---------------------------------------------------------------------------
// FeatureFlags — specchio esatto di src/config/features.ts
// ---------------------------------------------------------------------------

export interface FeatureFlags {
  /** Sidebar laterale e sezioni avanzate (Home, CRM, Servizio, Analytics) */
  sidebar: boolean
  /** Pagina Home con KPI giornalieri e quick-nav */
  home: boolean
  /** CRM clienti esteso */
  crm: boolean
  /** Analytics con KPI e trend */
  analytics: boolean
  /** Gestione servizio e tavoli */
  servizio: boolean
  /** Prenotazioni walk-in */
  walkIn: boolean
  /** Segna no-show su una prenotazione */
  noShow: boolean
  /** Assegnazione tavoli alle prenotazioni */
  tableAssignments: boolean
  /**
   * Menu digitale pubblico via QR.
   * Pro/Enterprise: sempre true (bundle).
   * Classic: true solo con override in tenant_features.
   */
  qrMenu: boolean
}

export type FeatureKey = keyof FeatureFlags

/** Tutte le chiavi valide di FeatureFlags (array ordinato per la UI). */
export const ALL_FEATURE_KEYS: FeatureKey[] = [
  'sidebar',
  'home',
  'crm',
  'analytics',
  'servizio',
  'walkIn',
  'noShow',
  'tableAssignments',
  'qrMenu',
]

/** Etichetta leggibile per ogni feature key. */
export const FEATURE_LABELS: Record<FeatureKey, string> = {
  sidebar:          'Sidebar avanzata',
  home:             'Home KPI',
  crm:              'CRM clienti',
  analytics:        'Analytics',
  servizio:         'Gestione servizio',
  walkIn:           'Walk-in',
  noShow:           'No-show',
  tableAssignments: 'Assegnazione tavoli',
  qrMenu:           'Menu QR',
}

// ---------------------------------------------------------------------------
// Bundle per edition — specchio di BASE_BUNDLE in src/config/features.ts
// ---------------------------------------------------------------------------

/** Le feature incluse nel bundle Pro/Enterprise (9 feature). */
const PRO_BUNDLE = new Set<FeatureKey>([
  'sidebar',
  'home',
  'crm',
  'analytics',
  'servizio',
  'walkIn',
  'noShow',
  'tableAssignments',
  'qrMenu',
])

const BASE_BUNDLE: Record<Edition, Set<FeatureKey>> = {
  classic:    new Set<FeatureKey>(),  // nessuna feature avanzata
  pro:        PRO_BUNDLE,
  enterprise: PRO_BUNDLE,
}

// ---------------------------------------------------------------------------
// buildFeatures — replica fedele di src/config/features.ts
// ---------------------------------------------------------------------------

/**
 * Costruisce i FeatureFlags combinando il bundle dell'edition con gli override
 * per singolo tenant provenienti dalla tabella tenant_features.
 *
 * @param edition   - Edition del tenant (classic | pro | enterprise).
 * @param overrides - Array di feature_key attivi (es. ['qrMenu']).
 *                    Per disabilitare esplicitamente una feature del bundle: prefisso '-'
 *                    (es. '-analytics').
 *
 * Logica identica a buildFeatures() in src/config/features.ts.
 */
export function buildFeatures(edition: Edition, overrides: string[] = []): FeatureFlags {
  const active = new Set<string>(BASE_BUNDLE[edition])

  for (const key of overrides) {
    if (key.startsWith('-')) {
      active.delete(key.slice(1))
    } else {
      active.add(key)
    }
  }

  return {
    sidebar:          active.has('sidebar'),
    home:             active.has('home'),
    crm:              active.has('crm'),
    analytics:        active.has('analytics'),
    servizio:         active.has('servizio'),
    walkIn:           active.has('walkIn'),
    noShow:           active.has('noShow'),
    tableAssignments: active.has('tableAssignments'),
    qrMenu:           active.has('qrMenu'),
  }
}

// ---------------------------------------------------------------------------
// Sorgente — da dove deriva la feature (per la UI "effetto combinato")
// ---------------------------------------------------------------------------

export type FeatureSource =
  | 'bundle'        // inclusa nel bundle dell'edition (es. pro include analytics)
  | 'override-on'   // override tenant_features con enabled=true la aggiunge
  | 'override-off'  // override tenant_features con enabled=false la rimuove dal bundle
  | 'absent'        // non nel bundle e nessun override attivo

/** Dettaglio di una feature per la UI. */
export interface FeatureDetail {
  key: FeatureKey
  label: string
  /** Risultato finale (ON/OFF dopo edition + override). */
  active: boolean
  /** Da dove deriva il valore corrente. */
  source: FeatureSource
  /** Override presente nel DB (riga in tenant_features). null se assente. */
  override: TenantFeatureRow | null
}

/** Riga tenant_features letta dal DB. */
export interface TenantFeatureRow {
  tenant_id: string
  feature_key: string
  enabled: boolean
  source: string | null
  notes: string | null
  activated_at: string | null
  expires_at: string | null
  created_by: string | null
}

/**
 * Ritorna true se la riga override è attualmente valida (non scaduta).
 * Un override scaduto (expires_at non null e nel passato) non vale più — conforme a §3
 * del data model context.
 */
export function isOverrideActive(row: TenantFeatureRow): boolean {
  if (!row.enabled) return false
  if (row.expires_at) {
    const exp = new Date(row.expires_at)
    if (exp < new Date()) return false
  }
  return true
}

/**
 * Costruisce l'elenco dettagliato di tutte le feature per la UI.
 *
 * Per ogni feature mostra:
 *   - active: il risultato finale dopo edition + override (come buildFeatures)
 *   - source: da dove deriva (bundle, override-on, override-off, absent)
 *   - override: la riga raw dal DB (per mostrare note/scadenza nella UI)
 *
 * Gestione expires_at:
 *   Un override scaduto viene trattato come se non esistesse (isOverrideActive lo scarta).
 *   La feature torna al valore del bundle dell'edition.
 */
export function buildFeatureDetails(
  edition: Edition,
  overrideRows: TenantFeatureRow[],
): FeatureDetail[] {
  const bundleSet = BASE_BUNDLE[edition]

  // Mappa feature_key → riga (solo override non scaduti e enabled).
  // Anche le righe con enabled=false vengono tenute per mostrare le disabilitazioni esplicite.
  const overrideMap = new Map<string, TenantFeatureRow>()
  for (const row of overrideRows) {
    overrideMap.set(row.feature_key, row)
  }

  return ALL_FEATURE_KEYS.map((key): FeatureDetail => {
    const row = overrideMap.get(key) ?? null
    const inBundle = bundleSet.has(key)

    let active: boolean
    let source: FeatureSource

    if (row !== null) {
      const overrideValid = isOverrideActive(row)

      if (row.enabled) {
        if (overrideValid) {
          // Override con enabled=true valido: la feature è ON
          active = true
          source = inBundle ? 'bundle' : 'override-on'
          // Se è già nel bundle e l'override la riattiva, mostra come bundle comunque
          // (l'override è ridondante ma non sbagliato).
        } else {
          // Override scaduto: torna al bundle
          active = inBundle
          source = inBundle ? 'bundle' : 'absent'
        }
      } else {
        // Override con enabled=false: disabilita esplicitamente (anche se nel bundle).
        // Il prefisso '-' nella logica buildFeatures fa active.delete(key).
        // Un override enabled=false non ha expires_at rilevante per "è scaduta la disabilitazione"
        // → la trattiamo sempre come attiva (disabilitazione è permanente finché non rimossa).
        active = false
        source = 'override-off'
      }
    } else {
      // Nessun override: risultato dal bundle puro.
      active = inBundle
      source = inBundle ? 'bundle' : 'absent'
    }

    return {
      key,
      label: FEATURE_LABELS[key],
      active,
      source,
      override: row,
    }
  })
}
