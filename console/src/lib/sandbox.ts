/**
 * Tenant sandbox del branch console — identificati per etichette visuali nell'UI.
 *
 * PERCHÉ ESISTE QUESTO FILE (DEC-052 / F13):
 *   SANDBOX_TENANT_IDS non è più un gate di scrittura (DEC-037 revocato). Le scritture
 *   sono consentite su tutti i tenant; il gate vero è Edge console-admin + allowlist.
 *   isSandboxTenant() è mantenuto per etichette visuali opzionali (bordo card, nota
 *   informativa nella scheda azienda) così resta chiaro quali sono i banchi di prova.
 *   La difesa forte è solo lato server (Edge Function + gate allowlist).
 *
 * FONTE DI VERITÀ:
 *   Gli ID sono quelli del DB TEST (docnnernvp). Se cambiano (es. row delete/re-insert),
 *   aggiornare qui di conseguenza. Documentazione: docs/Console-Skill/context/CONSOLE_DATA_MODEL_CONTEXT.md §6.
 */

/** ID dei tenant sandbox scrivibili sul branch Console. */
export const SANDBOX_TENANT_IDS = new Set<string>([
  '4c694cb8-66af-478f-afd2-8719f07d64b4', // console-classic
  'b5436de8-731e-469e-a888-36785823be6b', // console-pro
])

/**
 * Restituisce true se il tenant è uno dei due sandbox scrivibili.
 * Usato per abilitare/disabilitare i controlli di modifica nella UI.
 */
export function isSandboxTenant(tenantId: string): boolean {
  return SANDBOX_TENANT_IDS.has(tenantId)
}
