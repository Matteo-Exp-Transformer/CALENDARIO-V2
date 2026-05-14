# Report sessione — Alert “orario già trascorso” (accettazione, salvataggio, nuova prenotazione admin)

**Data:** 15-05-2026  
**Branch:** `Sviluppo-Dashboard-laterale`

---

## Obiettivo

Avvisare il ristoratore quando la **data e l’ora di inizio** della prenotazione (orologio a muro nel fuso del browser) risultano **già nel passato** rispetto all’istante corrente, prima di procedere con azioni irreversibili o sensibili. L’accettazione o il salvataggio restano possibili dopo conferma esplicita. Se è previsto anche un avviso sulla **capienza**, quello si mostra **dopo** la chiusura del primo dialog (sequenza ordinata).

---

## Modifiche per file

| File | Modifica |
|------|----------|
| `src/features/booking/utils/dateUtils.ts` | Aggiunte `trimTimeToHHmm` e `isWallClockStartBeforeNow(desiredDate, startTimeHHmm)` (confronto locale; input non validi → `false`, nessun alert). |
| `src/features/booking/utils/__tests__/CONTROLLA_ORARIO-PRENOTAZIONI.test.ts` | Nuova sezione **E)** con `vi.useFakeTimers()`: stesso giorno prima/dopo ora, giorno precedente, mezzanotte, stringhe invalide, test su `trimTimeToHHmm`. Totale file: **27** test. |
| `src/features/booking/components/PastStartTimeWarningModal.tsx` | **Nuovo** dialog: `createPortal` su `document.body`, `z-[100000]`, `role="dialog"`, Escape e overlay, superficie modale con token tema; box messaggio con `bg-[var(--color-bg)]` e bordo `var(--color-border)` (allineato alle card admin, senza blocchi ambra scuri in dark); pulsanti `Button` con layout mobile-first (`flex-col-reverse`, `min-h-[44px]`). |
| `src/features/booking/components/PendingRequestsTab.tsx` | Su “Accetta”: se `isWallClockStartBeforeNow` → `PastStartTimeWarningModal`; dopo “Procedi comunque” → stessa catena di prima (`getExceededSlotInfo` → `CapacityWarningModal` → `useAcceptBooking`). Refactor `runAcceptMutate` / `continueAcceptAfterPastStart`. |
| `src/features/booking/components/BookingDetailsModal.tsx` | In **Salva** (modifica): dopo le validazioni, stesso controllo; poi `runCapacityCheckAndSave` (capienza → `performSave`). |
| `src/features/booking/components/AdminBookingForm.tsx` | Submit “Crea Prenotazione”: dopo `validate()`, prima il modale orario passato se applicabile; poi `continueSubmitAfterPastTimeCheck()` (logica capienza + `CapacityWarningModal` + `createBooking`). |
| `docs/ADMIN_CLASSIC_SKILL.md` | Stato attuale §4, tabella §4b (`isWallClockStartBeforeNow`), conteggio test **27**, descrizione copertura AdminBookingForm / modale. |

---

## Flusso UX (sintesi)

1. **Richieste in attesa** — Accetta → eventuale alert orario passato → eventuale alert capienza → mutation accettazione.  
2. **Dettaglio prenotazione** — Salva in modifica → stesso ordine (orario → capienza → salvataggio).  
3. **Inserisci Nuova Prenotazione** (dashboard admin) — Crea prenotazione → stesso ordine (orario → capienza → creazione).

---

## Vincoli rispettati

- Nessuna modifica a `useBookingMutations` per questo comportamento (conferma lato UI prima della `mutate`).
- Orari DB: continuano a usarsi `createBookingDateTime` / `desired_time` come da skill §4b; `isWallClockStartBeforeNow` è solo per **confronto UX** con l’orologio locale.

---

## Verifica automatica

- `npm run validate` (lint, `tsc`, Vitest) — esito positivo al momento dell’ultima modifica della sessione.

---

## Note

- Report precedente parziale in `docs/Sessioni di lavoro/14-05-26/Report-alert-orario-passato-accettazione.md` (se presente in working tree) può essere consolidato o archiviato a piacere; questo documento in **15-05-26** fa da riferimento unico per la consegna richiesta dall’utente.
