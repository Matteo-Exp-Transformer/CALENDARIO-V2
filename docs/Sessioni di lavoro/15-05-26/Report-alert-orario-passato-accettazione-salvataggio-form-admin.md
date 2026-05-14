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
| `src/features/booking/utils/__tests__/CONTROLLA_ORARIO-PRENOTAZIONI.test.ts` | Nuova sezione **E)** con `vi.useFakeTimers()`: stesso giorno prima/dopo ora, giorno precedente, mezzanotte, stringhe invalide, test su `trimTimeToHHmm`. Totale file: **28** test (incluso caso *un ms dopo* l’orario di inizio → alert; vedi revisione sotto). |
| `src/features/booking/components/PastStartTimeWarningModal.tsx` | **Nuovo** dialog: `createPortal` su `document.body`, `z-[100000]`, `role="dialog"`, Escape e overlay, superficie modale con token tema; box messaggio con `bg-[var(--color-bg)]` e bordo `var(--color-border)` (allineato alle card admin, senza blocchi ambra scuri in dark); pulsanti `Button` con layout mobile-first (`flex-col-reverse`, `min-h-[44px]`). In revisione: prop `variant` (`accept_pending` \| `edit_booking` \| `new_booking`) per testo contestuale al flusso. |
| `src/features/booking/components/PendingRequestsTab.tsx` | Su “Accetta”: se `isWallClockStartBeforeNow` → `PastStartTimeWarningModal`; dopo “Procedi comunque” → stessa catena di prima (`getExceededSlotInfo` → `CapacityWarningModal` → `useAcceptBooking`). Refactor `runAcceptMutate` / `continueAcceptAfterPastStart`. In revisione: `variant="accept_pending"`; commento su `continueAcceptAfterPastStart` allineato al comportamento reale (include capienza). |
| `src/features/booking/components/BookingDetailsModal.tsx` | In **Salva** (modifica): dopo le validazioni, stesso controllo; poi `runCapacityCheckAndSave` (capienza → `performSave`). In revisione: `variant="edit_booking"` sul modale orario. |
| `src/features/booking/components/AdminBookingForm.tsx` | Submit “Crea Prenotazione”: dopo `validate()`, prima il modale orario passato se applicabile; poi `continueSubmitAfterPastTimeCheck()` (logica capienza + `CapacityWarningModal` + `createBooking`). In revisione: `variant="new_booking"` sul modale orario. |
| `docs/ADMIN_CLASSIC_SKILL.md` | Stato attuale §4, tabella §4b (`isWallClockStartBeforeNow`), conteggio test **28**, descrizione copertura AdminBookingForm / modale. In revisione: nota su modifica LOCK `BookingDetailsModal` con conferma utente in chat (§0); JSDoc `isWallClockStartBeforeNow` estesa in `dateUtils.ts` (criterio stretto `<` e ugualianza sullo stesso ms). |

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
- **Revisione (stessa feature):** di nuovo `npm run validate` dopo rifiniture — esito positivo (Vitest totale progetto **86** test alla data di aggiornamento di questo report).

---

## Revisione e rifiniture (post-consegna iniziale)

**Contesto:** in una sessione successiva l’utente ha chiesto di **debuggare** il lavoro rispetto a questo report; poi ha autorizzato quattro interventi (copy contestuale, commento fuorviante, chiarimento confronto temporale, tracciabilità LOCK §0 con conferma in chat).

**Cosa è stato fatto**

1. **Debug / QA** — Ricontrollo incrociato report ↔ codice (`PendingRequestsTab`, `PastStartTimeWarningModal`, `dateUtils`, `AdminBookingForm`, `BookingDetailsModal`); nessun bug bloccante emerso; `validate` verde.
2. **`PastStartTimeWarningModal`** — Aggiunta prop opzionale `variant` con tre messaggi per il secondo paragrafo (accettazione richiesta in attesa / salvataggio modifica / creazione nuova prenotazione), così non compare più il testo generico “accettarla o salvarla” nel solo flusso Accetta.
3. **`PendingRequestsTab`** — Corretto il commento su `continueAcceptAfterPastStart` (la funzione gestisce anche il ramo capienza, non solo la mutate).
4. **`isWallClockStartBeforeNow`** — JSDoc estesa: confronto stretto su millisecondi, ugualianza sullo stesso ms → nessun alert; aggiunto test Vitest “un ms dopo l’orario di inizio → true”.
5. **`docs/ADMIN_CLASSIC_SKILL.md`** — In stato attuale su `BookingDetailsModal`: annotazione che la modifica LOCK per l’alert su Salva è avvenuta con **conferma esplicita dell’utente in chat**; aggiornato conteggio test file `CONTROLLA_ORARIO-PRENOTAZIONI` a **28**.

**File toccati in questa fase** (oltre all’aggiornamento di questo report): `PastStartTimeWarningModal.tsx`, `PendingRequestsTab.tsx`, `AdminBookingForm.tsx`, `BookingDetailsModal.tsx`, `dateUtils.ts`, `CONTROLLA_ORARIO-PRENOTAZIONI.test.ts`, `docs/ADMIN_CLASSIC_SKILL.md`.

---

## Note

- Report precedente parziale in `docs/Sessioni di lavoro/14-05-26/Report-alert-orario-passato-accettazione.md` (se presente in working tree) può essere consolidato o archiviato a piacere; questo documento in **15-05-26** fa da riferimento unico per la consegna richiesta dall’utente.
