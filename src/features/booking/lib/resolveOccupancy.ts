/**
 * resolveOccupancy — S4 WP-B4 (D37/D22/D39/D43/D40/D25)
 *
 * Funzioni PURE per il calcolo delle finestre di occupazione tavolo.
 * Nessuna dipendenza React: testabili in isolamento, importabili dall'Edge.
 *
 * PERCHÉ le finestre di occupazione?
 *   D37: l'occupazione reale di un tavolo = arrivo + durata pasto + buffer
 *   pulizia/turnover. La fascia (service_slot) misura la disponibilità del
 *   servizio, non del singolo tavolo. Due prenotazioni possono stare nella
 *   stessa fascia su tavoli diversi senza sovrapporsi — purché le finestre
 *   non si tocchino.
 *
 *   D22: la disponibilità si libera AUTOMATICAMENTE a fine finestra
 *   (occupancy_end = arrival + duration + buffer), indipendente dal checkout
 *   fisico dello staff. Il checkout fisico aggiorna la riga di assignment ma
 *   non è l'unico guard per la capienza.
 *
 *   D39: multi-tavolo — una prenotazione può occupare tavoli diversi in turni
 *   diversi. Le finestre sono per-tavolo, non per-prenotazione.
 *
 *   D43: non tutti gli stati bloccano capienza. Solo gli stati che indicano
 *   presenza fisica o impegno certo del tavolo consumano un "posto" nel
 *   calcolo. Pending/rejected/cancelled/no_show/archived/waitlisted non
 *   bloccano — non è detto che arrivino o siano già stati gestiti.
 *
 *   Stati `seated` e `in_service` sono predisposti per S4-LIVE (quando esisterà
 *   un flag checked_in_at esplicito). Per ora non sono emessi dal sistema ma
 *   il set è definito qui per coerenza futura.
 */

// ─────────────────────────────────────────────────────────────────
// Finestra di occupazione
// ─────────────────────────────────────────────────────────────────

export interface OccupancyWindow {
  start: Date
  end: Date
}

/**
 * Calcola la finestra di occupazione reale di un tavolo (D37).
 *
 * PERCHÉ: `end = arrival + durationMinutes + bufferMinutes` copre sia il
 * pasto sia il tempo di preparazione del tavolo per il turno successivo
 * (buffer di turnover/pulizia). `start = arrival` (non l'inizio della fascia).
 *
 * Gestisce correttamente overnight (es. arrivo 23:30, durata 90 min → end
 * 01:00 del giorno dopo) usando istanti assoluti (Date), non minuti-del-giorno.
 * Questo rende le funzioni robuste anche in presenza di cambio ora legale (DST).
 */
export function computeOccupancyWindow({
  arrival,
  durationMinutes,
  bufferMinutes,
}: {
  arrival: Date
  durationMinutes: number
  bufferMinutes: number
}): OccupancyWindow {
  const start = new Date(arrival)
  const end = new Date(arrival.getTime() + (durationMinutes + bufferMinutes) * 60_000)
  return { start, end }
}

/**
 * Verifica se due finestre di occupazione si sovrappongono (D37/D39).
 *
 * PERCHÉ intervallo semi-aperto [start, end):
 *   Una prenotazione che finisce esattamente quando un'altra inizia NON è
 *   un conflitto — il tavolo è libero per il secondo ospite. Questo è il
 *   comportamento corretto per i turni successivi.
 *
 * Robustezza overnight/DST: usa millisecondi (getTime()), non minuti-del-giorno.
 * Questo garantisce correttezza anche per finestre che attraversano la mezzanotte
 * o durante i cambi ora legale.
 */
export function occupancyWindowsOverlap(a: OccupancyWindow, b: OccupancyWindow): boolean {
  // [a.start, a.end) ∩ [b.start, b.end) ≠ ∅
  // ⟺ a.start < b.end AND b.start < a.end
  return a.start.getTime() < b.end.getTime() && b.start.getTime() < a.end.getTime()
}

// ─────────────────────────────────────────────────────────────────
// Stati che bloccano capienza (D43)
// ─────────────────────────────────────────────────────────────────

/**
 * Set canonico degli stati che consumano capienza dura (D43).
 *
 * PERCHÉ questi stati:
 *   - accepted: confermato dall'admin, il tavolo è prenotato
 *   - confirmed: confermato lato sistema (es. pagamento)
 *   - seated: ospite seduto — predisposto per S4-LIVE (checked_in_at)
 *   - in_service: servizio in corso — predisposto per S4-LIVE
 *   - manually_blocked: blocco esplicito admin (es. manutenzione)
 *
 * NON bloccano (motivazione D43):
 *   - pending: in attesa di conferma admin → ancora incerto
 *   - rejected: rifiutato → non verrà
 *   - cancelled: cancellato → il tavolo è libero
 *   - no_show: non si è presentato → il tavolo è fisicamente libero
 *   - archived: archiviato → storico, non attivo
 *   - waitlisted: lista d'attesa → non confermato
 */
export const BLOCKING_STATUSES: ReadonlySet<string> = new Set([
  'accepted',
  'confirmed',
  'seated',
  'in_service',
  'manually_blocked',
])

/**
 * Determina se uno stato di prenotazione blocca la capienza del tavolo (D43/D25).
 *
 * PERCHÉ `forcedByAdmin` blocca sempre:
 *   D25: un override admin forzato (forced_by_admin=true) è una decisione
 *   consapevole dello staff di occupare comunque il tavolo. Anche se lo stato
 *   fosse tecnicamente "non bloccante" (es. pending forzato), il tavolo deve
 *   risultare occupato per l'audit e per evitare doppie assegnazioni non volute.
 */
export function statusBlocksCapacity(
  status: string,
  opts?: { forcedByAdmin?: boolean },
): boolean {
  // Un override forzato blocca sempre, indipendentemente dallo stato (D25)
  if (opts?.forcedByAdmin) return true
  return BLOCKING_STATUSES.has(status)
}

// ─────────────────────────────────────────────────────────────────
// Ricerca tavoli liberi (D39)
// ─────────────────────────────────────────────────────────────────

/**
 * Trova i tavoli liberi all'istante `at` (D39).
 *
 * PERCHÉ per-tavolo e non per-prenotazione:
 *   D39: in modalità multi-tavolo, una prenotazione può occupare tavoli
 *   diversi in turni diversi. La mappa `occupiedWindowsByTable` ha chiave
 *   tableId → finestre occupate. Un tavolo è libero all'istante `at` se
 *   nessuna delle sue finestre copre quell'istante.
 *
 * @param at - Istante da verificare
 * @param tables - Lista di tutti i tableId da controllare
 * @param occupiedWindowsByTable - Mappa tableId → finestre di occupazione attive
 * @returns Lista dei tableId liberi all'istante `at`
 */
export function findFreeTablesAt({
  at,
  tables,
  occupiedWindowsByTable,
}: {
  at: Date
  tables: string[]
  occupiedWindowsByTable: Map<string, OccupancyWindow[]>
}): string[] {
  const atMs = at.getTime()
  return tables.filter((tableId) => {
    const windows = occupiedWindowsByTable.get(tableId) ?? []
    // Il tavolo è libero se nessuna finestra copre `at` (intervallo semi-aperto)
    return !windows.some((w) => w.start.getTime() <= atMs && atMs < w.end.getTime())
  })
}

/**
 * Trova il primo istante ≥ `from` in cui il tavolo è libero (D22).
 *
 * PERCHÉ scandisce a passi:
 *   Non esiste un calcolo algebrico semplice quando ci sono N finestre
 *   potenzialmente sovrapposte. La scansione a passi (stepMinutes, tipicamente
 *   il arrival_step_minutes della fascia) è semanticamente corretta: restituisce
 *   il primo slot d'arrivo disponibile, non il primo millisecondo.
 *
 * @param tableId - Tavolo da controllare
 * @param from - Istante di partenza (incluso)
 * @param windows - Finestre di occupazione attive per quel tavolo
 * @param stepMinutes - Passo di scansione (es. arrival_step_minutes della fascia)
 * @returns Primo istante libero ≥ from, o null se nessuno entro fine giornata
 */
export function findNextFreeTime({
  tableId: _tableId,
  from,
  windows,
  stepMinutes,
}: {
  tableId: string
  from: Date
  windows: OccupancyWindow[]
  stepMinutes: number
}): Date | null {
  // Orizzonte: fine della giornata corrente (23:59:59)
  const endOfDay = new Date(from)
  endOfDay.setHours(23, 59, 59, 999)
  const endMs = endOfDay.getTime()

  const stepMs = Math.max(stepMinutes, 1) * 60_000
  let cursor = from.getTime()

  while (cursor <= endMs) {
    const cursorDate = new Date(cursor)
    const isOccupied = windows.some(
      (w) => w.start.getTime() <= cursor && cursor < w.end.getTime(),
    )
    if (!isOccupied) return cursorDate
    cursor += stepMs
  }

  return null
}
