/**
 * Parser PLAN condiviso — un solo posto per leggere gate e cicli dall'owner.
 *
 * views.mjs e status.mjs devono derivare lo stesso «prossimo gate»: se divergono,
 * un agente freddo vede due verità. Il parser prende l'ULTIMA occorrenza strutturata
 * (ciclo concluso, prossima azione, stato R1): le sezioni storiche restano nel file
 * ma non governano più l'output operativo.
 */

function required(text, re, label) {
  const value = text.match(re)?.[1]?.trim()
  if (!value) {
    throw new Error(`MSS-PLAN-UNREADABLE: non trovo «${label}» nell'owner. Non invento uno stato plausibile.`)
  }
  return value
}

/**
 * @param {string} planText
 * @returns {{
 *   closedId: string,
 *   closedState: string,
 *   next: string,
 *   nextLabel: string,
 *   r1: string,
 *   r1FromExplicitLine: boolean,
 * }}
 */
export function parsePlanGate(planText) {
  // Famiglie chiuse riconosciute: M-[A-Z] storici e T\d+ (es. T6). Criterio semantico
  // invariato: solo «eseguito e CHIUSO|PROVATO» — CON RISERVE non chiude (es. T7).
  const cycles = [...planText.matchAll(/### [^\n]* — `((?:M-[A-Z])|T\d+)` eseguito e \*\*(CHIUSO|PROVATO)\*\*/g)]
  if (!cycles.length) {
    throw new Error('MSS-PLAN-UNREADABLE: non trovo «ciclo concluso» nell\'owner.')
  }
  const [, closedId, closedState] = cycles[cycles.length - 1]
  const nextMatches = [...planText.matchAll(/\*\*Prossima azione autorizzata: `((?:M-[A-Z])|[RT]\d+)`\*\* \(([^)]+)\)/g)]
  if (!nextMatches.length) {
    throw new Error('MSS-PLAN-UNREADABLE: non trovo «prossima azione autorizzata» nell\'owner.')
  }
  const nextMatch = nextMatches[nextMatches.length - 1]
  const next = nextMatch[1]
  const nextLabel = nextMatch[2].replace(/\s+/g, ' ').trim()
  const r1Explicit = [...planText.matchAll(/\*\*Stato R1 attuale:\*\* `R1` è \*\*([^*]+)\*\*/g)].at(-1)?.[1]
  const r1 = r1Explicit || required(
    planText,
    /`R1` resta \*\*(raccomandato ma non\s+aperto)\*\*/,
    'stato R1',
  )
  return {
    closedId,
    closedState,
    next,
    nextLabel,
    r1: r1.replace(/\s+/g, ' ').trim(),
    r1FromExplicitLine: Boolean(r1Explicit),
  }
}
