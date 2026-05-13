/**
 * Mappa centralizzata delle feature admin.
 * Cambiare qui per abilitare/disabilitare funzionalità senza toccare i componenti.
 *
 * base   — calendario, pending, accetta/rifiuta/rimuovi, inserimento manuale
 * pro    — dashboard laterale completa, Servizio, CRM, tavoli, turni, assignment
 */

export interface AdminFeatureFlags {
  /** Dashboard laterale con Home separata, Servizio e CRM nella sidebar. */
  adminSidebar: boolean
  /** Sezione CRM Clienti. */
  crm: boolean
  /** Sezione Servizio (sala, tavoli). */
  service: boolean
  /** Fasce orarie / service_slots configurabili. */
  serviceSlots: boolean
  /** Assegnazione prenotazioni ai tavoli + stato "Da Assegnare". */
  tableAssignments: boolean
}

export const ADMIN_FEATURES: AdminFeatureFlags = {
  adminSidebar: true,
  crm: true,
  service: true,
  serviceSlots: true,
  tableAssignments: true,
}
