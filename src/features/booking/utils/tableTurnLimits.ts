/**
 * Conteggio turni tavolo per fascia+data.
 *
 * Un turno concluso (checked_out_at valorizzato) HA consumato un turno: il
 * conteggio include tutte le righe, attive e chiuse. L'annullamento immediato
 * (undo) cancella fisicamente la riga, quindi non entra in questo conteggio.
 */

export interface TurnAssignmentRef {
  table_id: string
  service_slot_id: string
  date: string
  turn_number: number
}

/** Righe dello stesso tavolo+fascia+data (attive e chiuse). */
export function assignmentsForTableSlot(
  assignments: TurnAssignmentRef[],
  tableId: string,
  slotId: string,
  date: string,
): TurnAssignmentRef[] {
  return assignments.filter(
    (a) => a.table_id === tableId && a.service_slot_id === slotId && a.date === date,
  )
}

/** Prossimo turn_number da assegnare (max esistente + 1, oppure 1). */
export function computeNextTurnNumber(
  assignments: TurnAssignmentRef[],
  tableId: string,
  slotId: string,
  date: string,
): number {
  const forThisTable = assignmentsForTableSlot(assignments, tableId, slotId, date)
  return forThisTable.length > 0
    ? Math.max(...forThisTable.map((a) => a.turn_number)) + 1
    : 1
}

/** Turni già consumati (= numero di righe storiche sul tavolo in fascia+data). */
export function countTurnsUsed(
  assignments: TurnAssignmentRef[],
  tableId: string,
  slotId: string,
  date: string,
): number {
  return assignmentsForTableSlot(assignments, tableId, slotId, date).length
}

/**
 * Turni residui. `null` = illimitati; `0` = esauriti o fascia chiusa (maxTurns=0).
 */
export function getRemainingTurns(maxTurns: number | null, turnsUsed: number): number | null {
  if (maxTurns === null) return null
  return Math.max(0, maxTurns - turnsUsed)
}

/** max_turns = 0 → servizio chiuso (pulsante «Chiudi servizio»). */
export function isSlotClosed(maxTurns: number | null): boolean {
  return maxTurns === 0
}

/** Turni finiti ma fascia aperta (maxTurns > 0 e usato ≥ max). */
export function isTurnsExhausted(maxTurns: number | null, turnsUsed: number): boolean {
  return maxTurns !== null && maxTurns > 0 && turnsUsed >= maxTurns
}
