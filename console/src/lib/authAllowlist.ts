/**
 * Allowlist email per la Console super-admin.
 *
 * Perché esiste: il controllo lato client è un gate UX, non una barriera di sicurezza forte.
 * I dati nel DB sono protetti dalla RLS di Supabase: anche se un utente non autorizzato
 * ottiene una sessione Supabase valida, le query restituiranno solo ciò che la RLS permette.
 * Questo file impedisce però che utenti fuori allowlist vedano la UI della Console.
 *
 * Limite documentato: un utente con accesso agli strumenti di sviluppo del browser potrebbe
 * aggiungere la propria email all'env a runtime (in dev). In produzione l'env è bundlato da Vite
 * e non modificabile, ma la difesa forte resta la RLS lato DB.
 * → Vedi docs/Console-Skill/plan-per-matteo/PLAN-DB-001-allowlist-auth.md per la proposta RLS.
 *
 * Configurazione:
 *   VITE_CONSOLE_ALLOWED_EMAILS=matteo@example.com,altro@example.com
 *   (lista separata da virgole, in console/.env.local — mai committare email reali)
 *
 * Se la variabile non è impostata, nessuna email è ammessa (fail-safe).
 */

/** Legge e normalizza la allowlist dall'env Vite. */
function loadAllowlist(): ReadonlySet<string> {
  const raw = import.meta.env.VITE_CONSOLE_ALLOWED_EMAILS as string | undefined
  if (!raw || raw.trim() === '') {
    // Fail-safe: se la variabile manca, nessuno entra.
    // In sviluppo questo forza a configurare .env.local esplicitamente.
    console.warn(
      '[Console] VITE_CONSOLE_ALLOWED_EMAILS non impostata. Nessuna email sarà ammessa. ' +
      'Aggiungi la variabile in console/.env.local.'
    )
    return new Set()
  }

  const emails = raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0)

  return new Set(emails)
}

// Singleton: calcolato una volta al caricamento del modulo.
const ALLOWED_EMAILS: ReadonlySet<string> = loadAllowlist()

/**
 * Verifica se un'email è nella allowlist.
 * Il confronto è case-insensitive (entrambi i lati normalizzati in lowercase).
 *
 * Funzione pura — testabile in isolamento.
 *
 * @param email - L'email da verificare (può arrivare da supabase.auth.getSession()).
 * @returns true se l'email è nella allowlist, false altrimenti.
 */
export function isEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false
  return ALLOWED_EMAILS.has(email.trim().toLowerCase())
}

/**
 * Versione che accetta un set custom — utile per i test unitari senza dipendenza dall'env.
 * Usare questa nei test; usare isEmailAllowed() nel codice applicativo.
 */
export function isEmailAllowedWith(
  email: string | null | undefined,
  allowlist: ReadonlySet<string>
): boolean {
  if (!email) return false
  return allowlist.has(email.trim().toLowerCase())
}
