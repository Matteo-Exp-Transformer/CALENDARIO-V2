# Report esecuzione F4 — Fasce orarie + Assignment mappa

**Data sessione**: 2026-05-13
**Branch**: `Sviluppo-Dashboard-laterale`
**Stato finale**: lint ✓ · typecheck ✓ · 29/29 test ✓

---

## Micro-task 0 — No-show end-to-end

**Esito**: nessun fix necessario.

Il flusso era già corretto:
- `useMarkNoShow` in `useBookingMutations.ts` chiama `update({ no_show: true })` con `eq('tenant_id', tenantId)`
- Invalida `bookings`, `bookings/accepted`, `analytics`, `home-stats`
- `useAnalytics` seleziona `no_show` nel query e calcola `noShowRate = noShowCount / acceptedCount`

Nessun commit prodotto per questo task.

---

## F4a — Schema DB + preset signup

**Commit**: `d927019`
`feat(db): service_slots + booking_table_assignments (migrations 010-012) + preset signup`

### Correzione rispetto al plan

Il plan usava `REFERENCES tenants(id)` ma nel DB la tabella si chiama `organizations`. Le policy RLS usano `current_admin_tenant_id()` (pattern già consolidato in migrazioni 007-008), non `auth.jwt() ->> 'tenant_id'`.

### Migrazioni applicate via MCP Supabase

| File | Contenuto |
|---|---|
| `supabase/migrations/010_service_slots.sql` | Tabella `service_slots` + indice + trigger `updated_at` + 4 policy RLS |
| `supabase/migrations/011_booking_table_assignments.sql` | Tabella `booking_table_assignments` + 3 indici + 4 policy RLS |
| `supabase/migrations/012_service_slots_preset_signup.sql` | Trigger `trg_seed_service_slots_on_organization` (5 fasce preset su ogni nuovo tenant) + backfill tenant esistenti |

### Schema effettivo

```sql
-- service_slots
id UUID PK, tenant_id → organizations(id), name TEXT,
start_time TIME, end_time TIME, max_turns INTEGER,
display_order INTEGER DEFAULT 0, created_at, updated_at

-- booking_table_assignments
id UUID PK, tenant_id → organizations(id),
booking_id → booking_requests(id),
table_id → tables(id),         -- nome reale nel DB, non restaurant_tables
service_slot_id → service_slots(id),
turn_number INTEGER DEFAULT 1, checked_out_at TIMESTAMPTZ,
date DATE, created_at
UNIQUE(table_id, service_slot_id, date, turn_number)
```

### Preset signup (5 fasce)

| Nome | start_time | end_time | max_turns |
|---|---|---|---|
| Colazione | 07:00 | 11:30 | NULL (infinito) |
| Pranzo | 11:31 | 15:30 | NULL |
| Aperitivo | 16:30 | 19:30 | NULL |
| Cena | 19:31 | 22:30 | NULL |
| Notturna | 23:00 | 04:00 | NULL |

Il trigger usa lo stesso pattern della migrazione 004 (`seed_default_menu_categories_for_organization`).

### Tipi rigenerati

`npm run db:types:linked` — `src/types/database.ts` aggiornato con `service_slots` e `booking_table_assignments`.

---

## F4b — CRUD fasce orarie

**Commit**: `13712f9`
`feat(servizio): CRUD fasce orarie (service_slots) con alert orario apertura`

### File creati

**`src/features/booking/hooks/useServiceSlots.ts`**

Esporta:
- `SERVICE_SLOTS_QUERY_KEY = 'service_slots'`
- `ServiceSlot` (interfaccia)
- `slotCrossesMidnight(slot)` — confronta `end_time < start_time` come stringa HH:MM
- `useServiceSlots()` — lista ordinata per `display_order`
- `useCreateServiceSlot()` — insert
- `useUpdateServiceSlot()` — update con `updated_at`
- `useDeleteServiceSlot()` — delete

**`src/features/booking/components/servizio/ServiceSlotsManager.tsx`**

Componente completo con:
- Lista fasce con badge stato: `Illimitata` (verde) · `N turni` (blu) · `Chiusa` (rosso)
- Indicatore "notturna +1" quando `end_time < start_time`
- Modal create/edit con input nome, time picker start/end, input max_turns
- Alert non vincolante "Questa fascia è fuori dall'orario di apertura comunicato ai clienti" — calcolato confrontando `start_time` con tutti i giorni di `business_hours`
- Conferma inline eliminazione (pattern coerente con `TableCard`)

### Integrazione in ServizioPage

`ServiceSlotsManager` appare:
- Sotto la tab **Lista** (separata da un `border-t`)
- Sotto la tab **Mappa** (dopo `TableMap` e prima della `border-t`)

---

## F4c — Mappa assignment prenotazione → tavolo

**Commit**: `0d5e118`
`feat(servizio): mappa assignment prenotazione→tavolo con stati live e check-out`

### File creati

**`src/features/booking/hooks/useTableAssignments.ts`**

Esporta:
- `TABLE_ASSIGNMENTS_QUERY_KEY = 'table_assignments'`
- `BookingTableAssignment` (interfaccia)
- `TableStatus = 'free' | 'assigned' | 'checked_out'`
- `getTableStatus(tableId, assignments, slotId, date)` — logica colori:
  - `free`: nessun assignment con `checked_out_at = null`
  - `assigned`: almeno un assignment attivo
  - `checked_out`: tutti gli assignment hanno `checked_out_at != null`
- `useTableAssignments(date)` — tutti gli assignment per data
- `useUnassignedBookings(date, slotId)` — prenotazioni `accepted` per la data non ancora assegnate allo slot
- `useAssignBookingToTable()` — calcola `turn_number = max + 1`, verifica `max_turns`, inserisce
- `useCheckoutTable()` — aggiorna `checked_out_at = now()` sull'assignment attivo con `turn_number` più basso

**`src/features/booking/components/servizio/AssignmentMapPanel.tsx`**

Componente con `DndContext` **separato** da quello di `TableMap` (nessun conflitto tra riposizionamento tavoli e assignment prenotazioni):
- Selettore data + selettore fascia oraria in testa
- Panel sinistro (1/3): `DraggableBookingCard` — prenotazioni non assegnate, drag con `useDraggable`
- Panel destro (2/3): griglia `DroppableTable` per sala, drop con `useDroppable`
- Colori Tailwind statici per stato tavolo:
  - `free` → `bg-emerald-100 border-emerald-300`
  - `assigned` → `bg-amber-100 border-amber-400`
  - `checked_out` → `bg-gray-100 border-gray-300`
- "Libera tavolo" con conferma inline → `useCheckoutTable`
- Toast `"Turni esauriti per questo tavolo in questa fascia."` se `turn_number > max_turns`

### Integrazione in ServizioPage

`AssignmentMapPanel` inserito nella tab **Mappa** tra `TableMap` e `ServiceSlotsManager`.

---

## Decisioni prese in corso d'opera

| Decisione | Motivazione |
|---|---|
| FK → `organizations(id)` non `tenants(id)` | Nome reale della tabella nel DB (scoperto da `list_tables` MCP) |
| Policy RLS con `current_admin_tenant_id()` | Coerenza con pattern migrazioni 007-008; `auth.jwt() ->> 'tenant_id'` non era il pattern usato nel progetto |
| FK → `tables(id)` non `restaurant_tables(id)` | Nome reale nel DB |
| Preset in migrazione 012 separata | Segue pattern migrazione 004 (trigger + backfill) invece di modificare validate-invite (che non crea tenant) |
| Cast `as unknown as BookingRequest[]` | `menu_selection` nel tipo generato è `Json`, incompatibile con il tipo applicativo; cast esplicito documentato |

---

## Struttura branch vs main

```
main          → produzione invariata (commit 95630e3 e precedenti)
Sviluppo-Dashboard-laterale → aggiunge F4a + F4b + F4c (3 commit sopra main)
```

---

## File modificati/creati

| File | Tipo |
|---|---|
| `supabase/migrations/010_service_slots.sql` | Nuovo |
| `supabase/migrations/011_booking_table_assignments.sql` | Nuovo |
| `supabase/migrations/012_service_slots_preset_signup.sql` | Nuovo |
| `src/types/database.ts` | Rigenerato |
| `src/features/booking/hooks/useServiceSlots.ts` | Nuovo |
| `src/features/booking/hooks/useTableAssignments.ts` | Nuovo |
| `src/features/booking/components/servizio/ServiceSlotsManager.tsx` | Nuovo |
| `src/features/booking/components/servizio/AssignmentMapPanel.tsx` | Nuovo |
| `src/pages/ServizioPage.tsx` | Modificato (import + render 3 nuovi componenti) |
