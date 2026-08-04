/**
 * Calcolo del tempo per gli scenari e2e Servizio pilotati con `page.clock`
 * (pro-service-tables-lifecycle.spec.ts).
 *
 * Estratto qui — invece di restare privato nello spec — per essere testabile
 * da Vitest: `vitest.config.ts` esclude `e2e/**` dalla scoperta dei test, il
 * file di test che copre queste funzioni vive quindi in `tests/` e importa
 * da qui (stesso modulo usato realmente dallo spec, non una copia).
 *
 * FIX (04-08-26) — due finestre cieche risolte da `safeAnchorNow`:
 * `wallIsoAt` costruisce l'ISO abbinando la data CANONICA dello scenario alla
 * sola ora (HH:mm) dell'istante passato. Questo è corretto SOLO SE l'istante
 * non attraversa mai la mezzanotte rispetto alla data canonica. Prima di
 * questo fix lo spec calcolava gli scenari a partire da `NOW = new Date()`
 * (istante reale): fra le ~23:25 e le ~01:40 uno scostamento di poche decine
 * di minuti scavalcava la mezzanotte e la data canonica restava sbagliata —
 *   - scenari "in avanti" (fine oltre mezzanotte): la fine finiva incollata a
 *     OGGI ma con un'ora che in realtà è DOMANI, quindi PRIMA dell'inizio;
 *   - scenari "all'indietro" (arrivo prima di mezzanotte): l'arrivo finiva
 *     incollato a OGGI ma con un'ora che in realtà è IERI, quindi DOPO NOW.
 * `safeAnchorNow` risolve ancorando sempre a mezzogiorno del giorno solare
 * PRECEDENTE a quello reale: fisso, mai a ridosso della mezzanotte per gli
 * scostamenti usati in questo file (-100' → +35', verificato riga per riga),
 * e sempre nel passato rispetto al tempo reale — vincolo obbligato per non
 * rompere l'autenticazione Supabase (vedi commento di testata dello spec: un
 * `page.clock.install` su un istante avanti al tempo reale fa apparire il
 * JWT "già scaduto" fin da subito).
 *
 * Alternativa scartata: far calcolare a `wallIsoAt` anche il giorno
 * dell'istante (invece della sola ora), invariata la data canonica altrove.
 * Non funziona: `filterBookingsOnDate` (useTableAssignments.ts) fa
 * corrispondere le prenotazioni alla data selezionata a schermo confrontando
 * LETTERALMENTE `confirmed_start.slice(0, 10)` con quella data — se
 * `confirmed_start` finisse su un giorno diverso dalla data canonica
 * selezionata (caso degli scenari "all'indietro"), la prenotazione
 * sparirebbe dalla piantina invece di mostrare lo stato sbagliato: un
 * fallimento peggiore, e silenzioso in un punto diverso da quello osservato.
 * Ancorare l'istante (questo file) invece di rincorrere il giorno evita il
 * problema alla radice.
 */

/** Somma minuti (anche negativi) a un `Date`, senza mutare l'originale. */
export function addMinutes(d: Date, minutes: number): Date {
  return new Date(d.getTime() + minutes * 60_000)
}

/** Data locale YYYY-MM-DD (fuso del processo/browser — Europe/Rome in questo ambiente). */
export function localDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Ora locale HH:mm. */
export function localTimeStr(d: Date): string {
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

/**
 * ISO "cifre = ora a muro" con offset finto +00:00 (dateUtils.ts): la data è
 * sempre quella canonica dello scenario, l'ora riflette l'istante passato.
 * Corretto per costruzione SOLO se `instant` non attraversa mai la
 * mezzanotte rispetto a `canonicalDate` — garantito da chi chiama questa
 * funzione ancorando gli scenari con `safeAnchorNow` (sotto).
 */
export function wallIsoAt(canonicalDate: string, instant: Date): string {
  return `${canonicalDate}T${localTimeStr(instant)}:00+00:00`
}

/**
 * Ancora "sicura" per `page.clock.install`: mezzogiorno del giorno solare
 * PRECEDENTE a quello reale (`realNow`, iniettabile per i test — default
 * `new Date()` a runtime nello spec).
 *
 * - Mai avanti al tempo reale: un giorno prima è sempre < `realNow`,
 *   qualunque sia l'ora del giorno in cui gira il test — vincolo auth, vedi
 *   commento di testata dello spec.
 * - Fissa a mezzogiorno: lascia ore di margine dalla mezzanotte su entrambi i
 *   lati per qualunque scostamento usato dagli scenari di questo file
 *   (-100' → +35'), quindi `wallIsoAt` non sbaglia mai giorno.
 */
export function safeAnchorNow(realNow: Date = new Date()): Date {
  return new Date(
    realNow.getFullYear(),
    realNow.getMonth(),
    realNow.getDate() - 1,
    12,
    0,
    0,
    0,
  )
}
