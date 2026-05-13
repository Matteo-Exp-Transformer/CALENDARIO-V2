# Plan esecutivo F4 — Fasce orarie + Assignment mappa

## Pre-requisiti
- Branch: `main`, commit `3305f5d` (tasso occupazione)
- Validazione verde: lint ✓ · typecheck ✓ · 29/29 test ✓

---

## Micro-task 0: No-show end-to-end (~30 min)

**Obiettivo**: verificare che il pulsante "No-show" nel pannello calendario aggiorni correttamente `booking_requests.no_show = true` e invalidi le query giuste.

**Steps**:
1. Aprire `src/features/booking/components/` e trovare il componente che contiene il pulsante no-show.
2. Verificare che la mutation chiami `supabase.update({ no_show: true })` e invalidi `BOOKINGS_QUERY_KEY`.
3. Verificare che Analytics (`useAnalytics`) legga il campo `no_show` nelle righe (già nel select).
4. Test manuale: creare prenotazione → accettare → marcare no-show → verificare `noShowRate` in Analytics.
5. Se mancano fix: correggere + commit `fix(calendario): no-show end-to-end`.

---

## F4a — Schema DB + preset signup

### Migrazione 010: `service_slots`

```sql
-- 010_service_slots.sql
CREATE TABLE service_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_turns INTEGER,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_service_slots_tenant ON service_slots(tenant_id);

ALTER TABLE service_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON service_slots
  USING (tenant_id = auth.jwt() ->> 'tenant_id'::text OR
         tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()));
```

> Applicare con: MCP Supabase `apply_migration`

### Migrazione 011: `booking_table_assignments`

```sql
-- 011_booking_table_assignments.sql
CREATE TABLE booking_table_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES booking_requests(id) ON DELETE CASCADE,
  table_id UUID NOT NULL REFERENCES restaurant_tables(id) ON DELETE CASCADE,
  service_slot_id UUID NOT NULL REFERENCES service_slots(id) ON DELETE CASCADE,
  turn_number INTEGER NOT NULL DEFAULT 1,
  checked_out_at TIMESTAMPTZ,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(table_id, service_slot_id, date, turn_number)
);

CREATE INDEX idx_bta_tenant_date ON booking_table_assignments(tenant_id, date);
CREATE INDEX idx_bta_booking ON booking_table_assignments(booking_id);
CREATE INDEX idx_bta_table ON booking_table_assignments(table_id);

ALTER TABLE booking_table_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON booking_table_assignments
  USING (tenant_id = auth.jwt() ->> 'tenant_id'::text OR
         tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()));
```

### Preset signup

Nella query che crea un nuovo tenant (trovare la funzione/seed esistente), aggiungere INSERT per le 5 fasce preset:

```sql
INSERT INTO service_slots (tenant_id, name, start_time, end_time, max_turns, display_order) VALUES
  (NEW_TENANT_ID, 'Colazione', '07:00', '11:30', NULL, 0),
  (NEW_TENANT_ID, 'Pranzo',    '11:31', '15:30', NULL, 1),
  (NEW_TENANT_ID, 'Aperitivo', '16:30', '19:30', NULL, 2),
  (NEW_TENANT_ID, 'Cena',      '19:31', '22:30', NULL, 3),
  (NEW_TENANT_ID, 'Notturna',  '23:00', '04:00', NULL, 4);
```

### Rigenera tipi

```bash
npm run db:types:linked
```

### Commit F4a
```
feat(db): service_slots + booking_table_assignments (migrations 010-011) + preset signup
```

---

## F4b — CRUD fasce orarie (`service_slots`)

### Hook: `useServiceSlots.ts`

File: `src/features/booking/hooks/useServiceSlots.ts`

Esportare:
- `SERVICE_SLOTS_QUERY_KEY`
- `useServiceSlots()` — lista ordinata per `display_order`
- `useCreateServiceSlot()` — mutation insert
- `useUpdateServiceSlot()` — mutation update
- `useDeleteServiceSlot()` — mutation delete (solo se non ha assignments attivi → check lato client con toast warning)

Tipo `ServiceSlot`:
```ts
export interface ServiceSlot {
  id: string
  tenant_id: string
  name: string
  start_time: string  // "HH:MM"
  end_time: string    // "HH:MM" — può essere < start_time (notturna)
  max_turns: number | null  // null = infinito, 0 = chiuso
  display_order: number
  created_at: string
  updated_at: string
}
```

**Logica `end_time < start_time`**: utility helper `slotCrossesmidnight(slot: ServiceSlot): boolean` che confronta `start_time` e `end_time` come stringhe HH:MM.

### UI: tab Impostazioni o sotto-sezione Servizio

**Posizione**: tab "Impostazioni" (se esiste) oppure nuova sotto-sezione nella pagina Servizio (sotto la mappa).

**Componente**: `ServiceSlotsManager`
- Lista fasce orarie con nome, orario, max_turns (badge "Chiusa" se 0, "Illimitata" se null, "N turni" altrimenti)
- Pulsante "Aggiungi fascia"
- Modal per create/edit con:
  - Input nome
  - Input start_time (time picker o input HH:MM)
  - Input end_time (time picker o input HH:MM)
  - Input max_turns (number, placeholder "Illimitato", 0 = Chiusa)
  - **Alert non vincolante**: se start/end non ricade negli orari `business_hours` → `"Questa fascia è fuori dall'orario di apertura comunicato ai clienti."` (usa `Alert` component o `<p className="text-warning-...">`)
- Pulsante elimina (con conferma)

### Commit F4b
```
feat(servizio): CRUD fasce orarie (service_slots) con alert orario apertura
```

---

## F4c — Mappa Servizio con assignment prenotazione→tavolo

### Architettura

La pagina Servizio (`ServizioPage`) oggi ha 2 tab: Lista e Mappa.
La tab Mappa (`MappaTab`) riceve il focus di F4c.

**Struttura MappaTab aggiornata**:
```
MappaTab
├── Header: selettore data + selettore fascia (service_slot)
├── Layout a due colonne:
│   ├── Panel sinistro (1/3): lista prenotazioni accettate non assegnate per data+fascia
│   │   ├── DraggableBookingCard (ogni prenotazione draggabile)
│   └── Panel destro (2/3): mappa tavoli con drop zone
│       └── DroppableTable (ogni tavolo con colore stato e badge)
```

### Nuovi hook

**`useTableAssignments.ts`** (`src/features/booking/hooks/useTableAssignments.ts`)

```ts
export const TABLE_ASSIGNMENTS_QUERY_KEY = 'table_assignments'

// Legge tutti gli assignment per data + tenant
export function useTableAssignments(date: string): ...

// Prenotazioni accettate per data, non ancora assegnate ad alcun tavolo nella fascia
export function useUnassignedBookings(date: string, slotId: string): ...

// Assegna prenotazione a tavolo (insert in booking_table_assignments)
export function useAssignBookingToTable(): ...

// Libera tavolo (update checked_out_at = now())
export function useCheckoutTable(): ...
```

### Logica colori tavolo

```ts
function getTableStatus(
  tableId: string,
  assignments: BookingTableAssignment[],
  selectedSlotId: string,
  selectedDate: string,
): 'free' | 'assigned' | 'checked_out'
```

- `free`: nessun assignment attivo per `(table_id, service_slot_id, date)` con `checked_out_at = null`
- `assigned`: almeno un assignment attivo (arancio + badge nome cliente + coperti)
- `checked_out`: tutti gli assignment del turno corrente hanno `checked_out_at != null` (verde sfumato = pronto per turno successivo)

**Colori Tailwind** (statici):
```
free     → bg-emerald-100 border-emerald-300
assigned → bg-amber-100 border-amber-400
checked_out → bg-gray-100 border-gray-300
```

### Logica turni

Quando si fa drop di una prenotazione su un tavolo:
1. Leggere gli assignment esistenti per `(table_id, slot_id, date)`.
2. Calcolare il `turn_number` = `max(turn_number) + 1` tra gli assignment esistenti (o 1 se nessuno).
3. Verificare che `turn_number <= slot.max_turns` (o `slot.max_turns IS NULL`).
4. Se `turn_number > max_turns`: toast warning "Turni esauriti per questo tavolo in questa fascia."
5. Altrimenti: `insert into booking_table_assignments`.

### "Libera tavolo"

Click sul tavolo assegnato → modal conferma → `update checked_out_at = now()` sull'assignment con `turn_number` più basso e `checked_out_at IS NULL`.

### DnD

Già installato `@dnd-kit/core` e `@dnd-kit/sortable` (usati nella mappa drag tavoli).
Per F4c: usare `useDraggable` (per `DraggableBookingCard`) e `useDroppable` (per `DroppableTable`).
I due sistemi DnD (riposizionamento tavoli e assignment prenotazioni) operano su contesti `DndContext` separati per evitare conflitti.

### Commit F4c
```
feat(servizio): mappa assignment prenotazione→tavolo con stati live e check-out
```

---

## Ordine di esecuzione

```
micro-task 0: no-show end-to-end
F4a: DB migrations 010-011 + preset signup + rigenera tipi
F4b: hook useServiceSlots + UI CRUD fasce orarie
F4c: hook useTableAssignments + MappaTab aggiornata
```

## Validazione finale

```bash
npm run validate   # lint + typecheck + test
```

Ogni fase è committabile e deployabile indipendentemente.
