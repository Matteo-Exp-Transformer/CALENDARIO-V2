# Report — Libera tavolo: prenotazione torna in elenco

Data: 19-05-26 · Area: **Servizio** → tab Mappa → `AssignmentMapPanel.tsx`

## Obiettivo

Dopo **Libera tavolo** su un tavolo occupato, la prenotazione deve **ricomparire** nella colonna **PRENOTAZIONI** a sinistra, non sparire dall’interfaccia.

---

## Comportamento per il ristoratore

**Prima:** assegnavi una prenotazione al tavolo, cliccavi Libera tavolo → la card non tornava (o restava «persa») nella lista prenotazioni.

**Dopo:** Libera tavolo → la stessa prenotazione (nome + coperti) riappare a sinistra, pronta per un nuovo drag. Il tavolo torna **verde / Libero** se non c’è un secondo turno già in coda su quel tavolo. Se il turno 2 era già assegnato, sul tavolo resta il turno 2 e la prenotazione del turno 1 torna in lista.

**Invariato:** filtro prenotazioni per fascia oraria (report 18-05-26), drag-and-drop, selettori data/fascia.

---

## Logica tecnica

| Caso | Azione DB | Effetto UI |
|------|-----------|------------|
| Un solo turno sul tavolo | `DELETE` riga `booking_table_assignments` | Tavolo libero; prenotazione in PRENOTAZIONI |
| Turno successivo già assegnato (`turn_number` maggiore, `checked_out_at` null) | `UPDATE checked_out_at` sul turno corrente | Turno 2 sul tavolo; prenotazione T1 in PRENOTAZIONI |

Helper: `hasWaitingNextTurnOnTable` (`tableCheckout.ts`).

Elenco sinistro: `filterUnassignedBookingsForSlot` — esclude solo assignment con `checked_out_at` null per slot+data (`unassignedBookingsFilter.ts`).

Dopo liberazione: `refetchQueries` su assignments e unassigned (aggiornamento immediato).

---

## Storage (nessuna migrazione)

| Tabella | Campi |
|---------|--------|
| `booking_table_assignments` | `booking_id`, `table_id`, `service_slot_id`, `date`, `turn_number`, `checked_out_at` |
| `booking_requests` | Prenotazioni in elenco (`status`, orari, data) |
| `service_slots` | Fascia selezionata nel pannello |

---

## File toccati

| File | Modifica |
|------|----------|
| `src/features/booking/hooks/useTableAssignments.ts` | Checkout delete/update; refetch; uso filtri estratti |
| `src/features/booking/utils/unassignedBookingsFilter.ts` | Nuovo — filtro elenco non assegnate |
| `src/features/booking/utils/tableCheckout.ts` | Nuovo — rilevamento turno successivo |
| `src/features/booking/utils/serviceSlotBookingFilter.ts` | (sessione precedente) filtro per fascia |
| `src/features/booking/components/servizio/AssignmentMapPanel.tsx` | Passa `selectedSlot` al hook |
| `src/features/booking/utils/__tests__/*.test.ts` | 14 test totali su filtri + checkout |
| `docs/Dashboard-laterale-skill/ADMIN_PAGES_CONTEXT.md` | Regole Libera tavolo |
| `docs/APP_CONTEXT_SKILL.md` | RULE checkout |

---

## Test

```bash
npm run test -- src/features/booking/utils/__tests__/unassignedBookingsFilter.test.ts src/features/booking/utils/__tests__/tableCheckout.test.ts src/features/booking/utils/__tests__/serviceSlotBookingFilter.test.ts
```

Risultato: **14/14** passati.

`npm run typecheck` — ok.

Verifica manuale: confermata dall’utente («funziona»).

---

## Fuori scope

- Nome cliente sulla card tavolo (ancora testo generico «Prenotazione assegnata»).
- Override fasce del giorno in assegnazione tavoli.
- Migrazioni DB.

---

## Prossima sessione (opzionale)

- Mostrare nome cliente + coperti sulla card tavolo occupato (join o cache da `booking_requests`).
- Allineare orari fascia agli override del giorno in `AssignmentMapPanel`.
