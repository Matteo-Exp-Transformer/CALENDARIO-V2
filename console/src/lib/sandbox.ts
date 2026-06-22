/**
 * Tenant sandbox del branch console — gli unici su cui la Console può scrivere dati.
 *
 * PERCHÉ ESISTE QUESTO FILE:
 *   Le 4 regole d'oro del branch vietano scritture di dati su qualsiasi tenant che non sia
 *   uno di questi due (RULE-2). La costante SANDBOX_TENANT_IDS è la fonte di verità
 *   client-side per decidere se un tenant è modificabile o in sola lettura.
 *   La difesa forte contro scritture non autorizzate è lato server (Edge Function + RLS).
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
