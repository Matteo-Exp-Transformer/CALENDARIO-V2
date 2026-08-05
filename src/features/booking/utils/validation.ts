/**
 * Helpers di validazione per form pubblico Prenota e form admin.
 * RFC-light: permissiva sui caratteri internazionali, strict sul formato minimo.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Valida email: richiede @ + dominio + TLD di almeno 2 caratteri. */
export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim())
}

/** Rimuove tutto tranne cifre, +, spazi, trattini, parentesi; conta solo le cifre. */
function countDigits(value: string): number {
  return (value.match(/\d/g) ?? []).length
}

/** Valida telefono: almeno 6 cifre numeriche dopo stripping caratteri ammessi. */
export function isValidPhone(value: string): boolean {
  const stripped = value.trim()
  if (stripped.length === 0) return false
  return countDigits(stripped) >= 6
}
