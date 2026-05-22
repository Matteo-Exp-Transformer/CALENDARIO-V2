# Sessione 19-05-25 — Fase 2: N fasce dinamiche Classic

## Obiettivo

Migrare il sistema di prenotazioni da 3 fasce orarie fisse (Colazione/Pranzo/Cena) a N fasce
dinamiche guidate dalla tabella `service_slots`. Flag `booking_time_slots_enabled` per Classic:
quando OFF il calendario mostra lista piatta, nessun controllo per fascia (solo `daily_guest_limit`).

Piano di riferimento: `C:\Users\matte.MIO\.cursor\plans\fase2-n-fasce-dinamiche-classic.md` (REV.2)

---

## Commit effettuati

| Commit | Step | File principali |
|--------|------|-----------------|
| `6a5f96d` | 1-3 | `bookingTimeSlots.ts`, `useServiceSlots.ts`, `capacityCalculator.ts` |
| `a1088b4` | 5a-5b | `booking.ts`, `restaurantSettingRegistry.ts` |
| `03b14e8` | 4 | `useCapacityCheck.ts`, `PendingRequestsTab.tsx` |
| `9bf1617` | 4b | `BookingDetailsModal.tsx` |
| `2d8058b` | 6 | `024_n_canonical_slots.sql`, `database.ts` |
| `6d78fdd` | 7 | `RestaurantSettingsTab.tsx` |
| `c1696ed` | 8 | `BookingCalendar.tsx` |
| `b33d599` | 9 | cleanup deprecated |

---

## Decisioni tecniche rilevanti

**`is_canonical` deprecato funzionalmente**: il campo resta in DB per il trigger di signup
(seed 3 fasce default per nuovi tenant), ma non governa piu nessuna logica applicativa.
Commento esplicativo aggiunto via migration 024.

**`SlotConfig`** sostituisce `BookingTimeSlots` come tipo primario per le fasce:
```ts
type SlotConfig = { id, name, start_time, end_time, display_order, is_canonical, slot_color? }
```

**Priorita capacity**: `service_slot_overrides.max_guests` > `service_slots.max_guests` >
`slot_guest_capacities[slotId]` (legacy fallback). Stessa cascata in tutti e 3 i punti di controllo
(BookingDetailsModal, PendingRequestsTab, useCapacityCheck).

**Pro vs Classic**: `features.servizio=true` forza `timeSlotsEnabled=true` indipendentemente
dal flag DB. Classic rispetta il flag `booking_time_slots_enabled`.

**Tailwind**: griglie N colonne usano `style={{ gridTemplateColumns: 'repeat(N, minmax(0,1fr))' }}`
— no classi dinamiche `grid-cols-${n}` (JIT non le genera).

**Smart quotes**: problema ricorrente nella sessione precedente — l'Edit tool inseriva virgolette
Unicode nei commenti. Risolto in sessione precedente con script Node replace.

**DB**: migration 024 applicata solo su TEST (`docnnernvp`). Mai toccata produzione.

---

## File modificati (riepilogo)

### Nuovi / riscritti
- `src/features/booking/utils/bookingTimeSlots.ts` — `SlotConfig`, `getSlotLabel`, `validateSlotConfigs`; rimossi `BookingTimeSlots`, `toBookingTimeSlots`, `getBookingTimeSlotLabel`, `validateBookingTimeSlots`, `DEFAULT_BOOKING_TIME_SLOTS`
- `src/features/booking/utils/capacityCalculator.ts` — `getSlotsOccupiedByBookingV2`, `getStartSlotForBookingV2`, `calculateDailyCapacityV2`; rimossi legacy `getSlotsOccupiedByBooking`, `getStartSlotForBooking`, `calculateDailyCapacity`
- `src/features/booking/hooks/useServiceSlots.ts` — aggiunto `useDigestSlotConfigs()`; rimosso `useCanonicalTimeSlots()`
- `src/features/booking/hooks/useCapacityCheck.ts` — N-slot + flag `booking_time_slots_enabled`
- `src/types/booking.ts` — `TimeSlot = string`, `DailyCapacity` riformato
- `src/features/booking/lib/restaurantSettingRegistry.ts` — `SlotGuestCapacities = Record<string, number|null>`, `booking_time_slots_enabled`
- `supabase/migrations/024_n_canonical_slots.sql` — `slot_color TEXT NULL`, COMMENT deprecazione `is_canonical`
- `src/types/database.ts` — `slot_color: string | null` su `service_slots` + RPC

### Modificati (LOCK)
- `src/features/booking/components/BookingDetailsModal.tsx` — capacity check N slot, override support
- `src/features/booking/components/RestaurantSettingsTab.tsx` — lista dinamica `editingSlots.map()`, checkbox flag, capacita per-slot inline
- `src/features/booking/components/BookingCalendar.tsx` — `splitDigestBySlotConfigs`, N colonne digest, lista piatta se fasce OFF

### Toccati ma non LOCK
- `src/features/booking/components/PendingRequestsTab.tsx` — `getExceededSlotInfo` N slot

---

## Stato finale

```
npm run validate  →  lint OK · typecheck OK · 112/112 test OK
```

Branch: `Sviluppo-Dashboard-laterale` — non ancora mergiato su `main`.

---

## Prossimi passi suggeriti

1. **PR review** e merge su `main`
2. **Allineamento skill**: aggiornare `ADMIN_CLASSIC_SKILL.md` §4/§4b, `DB_MIGRATIONS_CONTEXT.md`,
   `DB_SCHEMA_CONTEXT.md`, `DATABASE.md`, `ADMIN_PAGES_CONTEXT.md` per `is_canonical` deprecazione
   e nuovo sistema N fasce
3. **`supabase db push`** su produzione quando pronto (la migration 024 e pronta)
4. **Impostazioni UI**: testare la sezione Fasce Orarie con checkbox ON/OFF e verifica
   che il calendario risponda correttamente
