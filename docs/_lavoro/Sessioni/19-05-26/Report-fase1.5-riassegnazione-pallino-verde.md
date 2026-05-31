# Report Fase 1.5 — Riassegnazione da pallino verde + pulizia

**Data**: 2026-05-19  
**Branch**: `Sviluppo-Dashboard-laterale`  
**Stato**: completato — validate verde (14 file, 112 test)

---

## Cosa è stato fatto

### Commit precedenti — Fase 0/1 (non committate, ora committate)

Due commit separati:

1. **feat(calendario)**: pallino grigio/verde su card digest, `QuickTableAssignModal` (assign da grigio), `DigestSlotHeader`, badge pending token, layout 2 col digest.
2. **feat(impostazioni)**: rimossa sezione "Aree di posizionamento" da Impostazioni (gestione sale ora in Servizio → tavoli).
3. **docs(skill)**: allineamento ADMIN_CLASSIC + ADMIN_PAGES_CONTEXT + report sessione 19-05.

### Fase 1.5 — Step 1: Riassegnazione da pallino verde

Prima: cliccando il pallino verde su una card del digest, non succedeva niente (no-op silenzioso).

Ora: Luigi clicca il pallino verde di "Anna, Rossi, 20:15 — Tavolo 3" → si apre un dialog «Vuoi modificare il tavolo assegnato ad Anna? Ora è al Tavolo 3.» → Conferma → assignment eliminato → stesso flusso di selezione sala/tavolo del pallino grigio → Anna finisce al Tavolo 5 → pallino torna verde sul nuovo tavolo → anche Servizio → Mappa si aggiorna (stessa query key).

**File toccati**:
- `src/features/booking/hooks/useTableAssignments.ts`: aggiunta mutation `useReleaseBookingAssignment` — libera l'assignment per `booking_id` specifico (non per tavolo come `useCheckoutTable`). Caso turni in coda: ritorna `{ blocked: 'waiting_next_turn' }` senza modificare DB.
- `src/features/booking/components/QuickTableAssignModal.tsx`: aggiunta prop `mode: 'assign' | 'reassign'`. In `reassign`: fase di conferma con nome tavolo attuale → chiama `useReleaseBookingAssignment` → se bloccato mostra avviso; altrimenti prosegue con selezione sala/tavolo.
- `src/features/booking/components/BookingCalendar.tsx`: `handleDotClick` ora apre il modal anche se la prenotazione è assegnata (rimosso il guard `!assignedBookingIds.has`). Il `mode` viene passato in base ad `assignedBookingIds`.

### Fase 1.5 — Step 2: Pulizia prop serviceSlots

`QuickTableAssignModal` riceveva `serviceSlots` come prop ma usava già `useServiceSlots()` internamente (`freshSlots`). Rimossa la prop dal componente e dal render in `BookingCalendar`. `serviceSlots` resta in `BookingCalendar` solo per calcolare `hasTurnsFeature`.

### Fase 1.5 — Step 3: Allineamento skill

- `APP_CONTEXT_SKILL.md §4`: aggiunta RULE riassegnazione rapida da Calendario.
- `ADMIN_PAGES_CONTEXT.md §Servizio → Assegnazione tavoli`: aggiornato paragrafo "Accesso rapido" con flusso completo, `mode`, `useReleaseBookingAssignment`, caso turni in coda provvisorio.
- `ADMIN_CLASSIC_SKILL.md §4`: snapshot BookingCalendar aggiornato (pallino verde → reassign, prop serviceSlots rimossa).

---

## Test eseguiti

`npm run validate` → lint 0 warning + typecheck 0 errori + 112 test passati.

Test manuale UI non eseguibile in questo ambiente (nessun browser). I punti da verificare manualmente:
- Pallino verde → dialog conferma con nome tavolo → Conferma → selezione sala → assegnazione → pallino verde aggiornato
- Pallino grigio → selezione sala → assegnazione → pallino verde
- Caso turni in coda → avviso bloccante, DB invariato

---

## Cosa resta per la prossima sessione

- **Logica tempi di permanenza / durata turno**: quando un tavolo ha turni in coda, gestire la riassegnazione in modo completo (oggi mostra avviso bloccante). Pianificazione separata.
- Nessuna deviazione dal piano originale `fase1.5-fix-quickassign-pulizia.md`.
