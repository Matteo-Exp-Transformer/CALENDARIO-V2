# Report sessione — Assegnazione tavoli (Servizio)

Data: 19-05-26 · Area: **Servizio** → tab Mappa → `AssignmentMapPanel.tsx`

---

## 1. Libera tavolo → prenotazione torna in elenco

### Obiettivo

Dopo **Libera tavolo**, la prenotazione deve **ricomparire** nella colonna **PRENOTAZIONI** a sinistra.

### Comportamento per il ristoratore

**Prima:** Libera tavolo → la card spariva dalla lista.

**Dopo:** la stessa prenotazione (nome + coperti) riappare a sinistra. Il tavolo torna **verde / Libero** se non c’è un turno 2 in coda; altrimenti resta il turno successivo sul tavolo.

### Logica tecnica

| Caso | Azione DB | Effetto UI |
|------|-----------|------------|
| Un solo turno sul tavolo | `DELETE` in `booking_table_assignments` | Tavolo libero; prenotazione in PRENOTAZIONI |
| Turno 2+ già assegnato e attivo | `UPDATE checked_out_at` sul turno corrente | Turno 2 sul tavolo; prenotazione T1 in PRENOTAZIONI |

Helper: `hasWaitingNextTurnOnTable` (`tableCheckout.ts`). Filtro elenco: `unassignedBookingsFilter.ts`. Dopo liberazione: `refetchQueries`.

Verifica manuale: confermata («funziona»).

---

## 2. Dettaglio prenotazione sulla card tavolo occupato

### Obiettivo

Sostituire il testo generico «Prenotazione assegnata» con i dati utili al servizio.

### Comportamento per il ristoratore

Sul tavolo **arancione (Occupato)** compaiono solo i valori, senza etichette:

1. **Prima riga:** `Mario Rossi, 4` (nome e numero ospiti)
2. **Seconda riga:** `20:15` (orario di arrivo; se manca, solo la prima riga)

Allineato all’orario usato altrove in dashboard (`desired_time` preferito, altrimenti `confirmed_start`).

### Logica tecnica

- Hook `useAcceptedBookingsForDate(date)` — prenotazioni `accepted` del giorno da `booking_requests`.
- `AssignmentMapPanel` costruisce `Map<booking_id, BookingRequest>` e la passa a `DroppableTable` tramite l’assignment attivo.
- Orario: `getAccurateStartTime` + `trimTimeToHHmm` (`dateUtils.ts`).
- Helper condiviso `filterBookingsOnDate` estratto in `useTableAssignments.ts` (riuso con `useUnassignedBookings`).

---

## Storage (nessuna migrazione)

| Tabella | Campi |
|---------|--------|
| `booking_table_assignments` | `booking_id`, `table_id`, `service_slot_id`, `date`, `turn_number`, `checked_out_at` |
| `booking_requests` | `client_name`, `num_guests`, `status`, `confirmed_start`, `desired_time`, `desired_date` |
| `service_slots` | Fascia nel select (`start_time`, `end_time`, `max_turns`) |

---

## File toccati (sessione completa)

| File | Modifica |
|------|----------|
| `src/features/booking/hooks/useTableAssignments.ts` | Checkout delete/update; `useAcceptedBookingsForDate`; `filterBookingsOnDate` |
| `src/features/booking/components/servizio/AssignmentMapPanel.tsx` | Card tavolo con nome/coperti/orario; slot filter; lookup prenotazioni |
| `src/features/booking/utils/unassignedBookingsFilter.ts` | Filtro elenco non assegnate |
| `src/features/booking/utils/tableCheckout.ts` | Turno successivo in coda |
| `src/features/booking/utils/serviceSlotBookingFilter.ts` | Filtro per fascia (18-05) |
| `src/features/booking/utils/__tests__/*.test.ts` | 14 test filtri + checkout |
| `docs/Dashboard-laterale-skill/ADMIN_PAGES_CONTEXT.md` | Libera tavolo + card occupata |
| `docs/APP_CONTEXT_SKILL.md` | RULE Libera tavolo |

---

## Test

```bash
npm run test -- src/features/booking/utils/__tests__/unassignedBookingsFilter.test.ts src/features/booking/utils/__tests__/tableCheckout.test.ts src/features/booking/utils/__tests__/serviceSlotBookingFilter.test.ts
```

Risultato: **14/14** passati.

`npm run typecheck` — ok (anche dopo card tavolo).

---

## Fuori scope

- Override fasce del giorno in assegnazione tavoli (`service_slot_overrides`).
- Migrazioni DB.
- Test E2E Playwright su drag/libera tavolo.

---

## Prossima sessione (opzionale)

- Allineare orari fascia agli override del giorno in `AssignmentMapPanel`.
- E2E: flusso assegna → libera → riassegna.
