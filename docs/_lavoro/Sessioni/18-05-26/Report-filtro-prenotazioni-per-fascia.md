# Report — Filtro prenotazioni per fascia in Assegnazione tavoli

Data: 18-05-26 · Area: Pagina **Servizio** → `AssignmentMapPanel.tsx`

## Obiettivo

Quando il ristoratore sceglie una **fascia oraria** nel pannello «Assegnazione tavoli», l’elenco **Prenotazioni** a sinistra deve mostrare solo le prenotazioni accettate del giorno la cui **ora di inizio** rientra nell’intervallo di quella fascia — non tutte le prenotazioni del giorno ancora senza tavolo.

---

## Comportamento per il ristoratore

**Prima:** selezionando Pranzo o Cena comparivano tutte le prenotazioni accettate di quella data non ancora assegnate a un tavolo in quella fascia (indipendentemente dall’orario).

**Dopo:** compariscono solo quelle con inizio dentro la fascia scelta (es. Pranzo 11:31–15:30 → niente prenotazioni alle 20:00). Il contatore «Prenotazioni (N)» si aggiorna al cambio fascia. Le fasce che attraversano la mezzanotte (es. Colazione 07:00–01:30, Notturna 23:00–04:00) sono gestite come nel resto dell’app.

**Invariato:** mappa tavoli a destra, drag-and-drop, data, messaggio se nessuna fascia selezionata.

---

## Logica tecnica (sintesi)

1. Helper `bookingStartsInServiceSlot` in `serviceSlotBookingFilter.ts`:
   - ora di inizio da `getAccurateStartTime` (`desired_time` preferito, altrimenti `confirmed_start`);
   - confronto con `isTimeInsideSlot` su `start_time` / `end_time` della fascia;
   - senza orario di inizio → esclusa dall’elenco.

2. Hook `useUnassignedBookings` (`useTableAssignments.ts`):
   - firma: `(date, slot | null)` con `id`, `start_time`, `end_time`;
   - filtri in ordine: accettate → data → **fascia oraria** → non già assegnate al tavolo per quello slot.

3. `AssignmentMapPanel` passa `selectedSlot` (da `useServiceSlots` / tabella `service_slots`) al hook.

---

## Storage (nessuna migrazione)

| Tabella | Campi usati |
|---------|-------------|
| `service_slots` | `id`, `name`, `start_time`, `end_time` (fasce nel select) |
| `booking_requests` | `status`, `confirmed_start`, `desired_time`, `desired_date` |
| `booking_table_assignments` | `booking_id`, `service_slot_id`, `date`, `checked_out_at` (esclusione già assegnate) |

---

## File toccati

| File | Modifica |
|------|----------|
| `src/features/booking/utils/serviceSlotBookingFilter.ts` | Nuovo — helper filtro |
| `src/features/booking/hooks/useTableAssignments.ts` | `useUnassignedBookings` esteso |
| `src/features/booking/components/servizio/AssignmentMapPanel.tsx` | Passa `selectedSlot` al hook |
| `src/features/booking/utils/__tests__/serviceSlotBookingFilter.test.ts` | Nuovo — 8 test |

---

## Test automatici

`npm run test -- src/features/booking/utils/__tests__/serviceSlotBookingFilter.test.ts` — 8/8 passati.

Casi coperti: Pranzo incluso/escluso, estremo 15:30, Notturna 23:30 e 02:00, esclusione mezzogiorno in Notturna, senza orario, solo `desired_time`.

`npm run typecheck` — ok.

---

## Verifica manuale consigliata

1. Servizio → Assegnazione tavoli, data con prenotazioni a orari diversi.
2. Fascia **Pranzo**: solo prenotazioni con inizio 11:31–15:30.
3. Cambio in **Cena**: elenco e contatore diversi.
4. Fascia notturna se configurata.
5. Trascinamento su tavolo: assegnazione come prima.

---

## Fuori scope (sessione)

- Override fasce del giorno (`service_slot_overrides`) — si usano gli orari della riga `service_slots` già caricata.
- Filtro tavoli a destra per orario prenotazione.
- Modifiche DB.

---

## Prossima sessione (opzionale)

- Allineare assegnazione tavoli agli override «oggi» se servisse coerenza con la card fasce in Servizio (già segnalato in report 16-05-26).
