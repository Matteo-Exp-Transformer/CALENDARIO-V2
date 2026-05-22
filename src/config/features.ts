import type { TenantEdition } from '@/types/edition'

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
}

export const buildFeatures = (edition: TenantEdition): FeatureFlags => {
  const isProOrAbove = edition === 'pro' || edition === 'enterprise'
  return {
    sidebar:          isProOrAbove,
    home:             isProOrAbove,
    crm:              isProOrAbove,
    analytics:        isProOrAbove,
    servizio:         isProOrAbove,
    walkIn:           isProOrAbove,
    noShow:           isProOrAbove,
    tableAssignments: isProOrAbove,
  }
}
