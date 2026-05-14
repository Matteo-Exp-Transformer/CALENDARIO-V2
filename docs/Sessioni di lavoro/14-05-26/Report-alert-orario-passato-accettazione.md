# Report sessione — Alert orario passato (accettazione / salvataggio)

**Data:** 14-05-2026  
**Riferimento plan:** `alert_orario_passato_accettazione_6036f3e5` + estensione richiesta dall’utente su `BookingDetailsModal`.

## Cosa è stato fatto (ordine)

1. Aggiunta in `dateUtils.ts` la funzione pura `isWallClockStartBeforeNow` e l’helper `trimTimeToHHmm` (confronto data+ora nel fuso locale del browser con `Date.now()`; input non validi → nessun alert).
2. Nuovo componente `PastStartTimeWarningModal.tsx` (portal `z-[100000]`, token superficie/testo, `Button` da UI, layout mobile con `flex-col-reverse` e altezza minima touch).
3. `PendingRequestsTab`: prima dell’overbooking, se l’inizio è nel passato si apre il dialog; dopo “Procedi comunque” si riesegue la stessa catena capienza → `CapacityWarningModal` → `useAcceptBooking` (senza modificare `useBookingMutations`).
4. `BookingDetailsModal`: in salvataggio in modifica, stesso avviso prima del controllo capienza e di `performSave` (l’utente aveva chiesto l’allineamento sul modale dettaglio per l’“aggiornamento”).
5. Test Vitest estesi in `CONTROLLA_ORARIO-PRENOTAZIONI.test.ts` (sezione E, fake timers).
6. Aggiornato `docs/ADMIN_CLASSIC_SKILL.md` (stato attuale §4, tabella §4b, conteggio test 27).

## File toccati e perché (linguaggio utente)

- **`dateUtils` / test orari:** garanzia che il confronto “è già passata l’ora della prenotazione?” sia coerente e coperto da test.
- **`PendingRequestsTab` + nuovo modale:** chi accetta dalla lista “Richieste in attesa” viene avvisato se sta accettando uno slot già passato, ma può proseguire; l’avviso sulla capienza resta dopo.
- **`BookingDetailsModal`:** chi modifica e salva con data/ora di inizio già passate vede lo stesso tipo di conferma prima del salvataggio e dell’eventuale avviso capienza.
- **`AdminBookingForm`:** creazione prenotazione da dashboard (“Inserisci Nuova Prenotazione”): avviso orario passato prima di quello sulla capienza.

## Domande / risposte utente

- Path contesto UI: usare `docs/per-ui-design-skill` — sì.  
- Test: estendere file esistente — sì.  
- Scope: includere anche `BookingDetailsModal` — sì (flusso salvataggio in modifica).

## Test eseguiti

- `npm run validate` — esito positivo (lint, typecheck, Vitest: 85 test).

## Follow-up (stessa sessione)

- Box avviso nel `PastStartTimeWarningModal`: rimossi `amber-50` / `dark:bg-amber-950` troppo carichi; contenuto in card leggera con `bg-[var(--color-bg)]`, bordo e testo tema come le altre superfici admin.
- **AdminBookingForm** (collapsible “Inserisci Nuova Prenotazione”): stesso controllo orario passato **prima** del flusso capienza; dopo “Procedi comunque” si esegue `continueSubmitAfterPastTimeCheck` (eventuale `CapacityWarningModal` poi `createBooking`).

## Resta per dopo

- Smoke manuale su tema chiaro/scuro e viewport ~375px (non eseguito qui in browser).

## Deviazioni dal plan

- Il plan citava solo `PendingRequestsTab`; è stato aggiunto lo stesso comportamento su **salvataggio** in `BookingDetailsModal` su richiesta esplicita dell’utente (non c’è accettazione da quel modale nel codice attuale).
