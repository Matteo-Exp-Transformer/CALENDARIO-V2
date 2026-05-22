# Report decisioni — Planning F4 (13-05-26)

## Contesto

Sessione di planning successiva al completamento di F2-F3.
Tasso occupazione risolto come micro-task all'inizio della sessione (`3305f5d`).

---

## Decisioni prese

### Micro-task: tasso occupazione
- **Decisione**: calcolo client-side in `AnalyticsPage.tsx` via `computeOccupancyRate()` esportata da `useAnalytics.ts`.
- **Formula**: `totalCovers / (totalSeats × numDays nel periodo) × 100`
- **Attivazione**: solo se `rooms.length > 0 && totalSeats > 0` (sale e tavoli configurati).
- **Nessuna modifica al queryKey**: `totalSeats` è derivato da `useTables()` nel componente, separato dalla cache analytics.

### Scope F4: sistemi di fasce orarie e assegnazione tavoli

**F4a — Schema DB + preset signup**
**F4b — CRUD fasce orarie (`service_slots`)**
**F4c — Mappa Servizio con assignment prenotazione→tavolo**

### Due concetti separati: orari apertura vs fasce di servizio

| | `business_hours` | `service_slots` |
|---|---|---|
| **Scopo** | Informa i clienti nella pagina pubblica | Organizza i turni admin in sala |
| **Dove vive** | `restaurant_settings` (JSON, invariato) | Nuova tabella `service_slots` |
| **Chi lo usa** | Form pubblico prenotazione, Analytics shift filter | Mappa Servizio, logica assegnazione, pagina prenota (fase futura) |

### Schema DB deciso (`service_slots`)

```sql
CREATE TABLE service_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,   -- può essere < start_time (es. 23:00→04:00 = notturna)
  max_turns INTEGER,        -- NULL = infinito, 0 = fascia chiusa
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Preset al signup** (inseriti nella query di creazione tenant, 5 fasce):
| Nome | start_time | end_time | max_turns |
|---|---|---|---|
| Colazione | 07:00 | 11:30 | NULL (infinito) |
| Pranzo | 11:31 | 15:30 | NULL |
| Aperitivo | 16:30 | 19:30 | NULL |
| Cena | 19:31 | 22:30 | NULL |
| Notturna | 23:00 | 04:00 | NULL |

**Logica `end_time < start_time`**: la fascia si intende come "passa la mezzanotte" — la query aggiunge 1 giorno all'`end_time` per il calcolo degli overlap.

### Schema DB deciso (`booking_table_assignments`)

```sql
CREATE TABLE booking_table_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES booking_requests(id) ON DELETE CASCADE,
  table_id UUID NOT NULL REFERENCES restaurant_tables(id) ON DELETE CASCADE,
  service_slot_id UUID NOT NULL REFERENCES service_slots(id) ON DELETE CASCADE,
  turn_number INTEGER NOT NULL DEFAULT 1,  -- Turno N nel slot (1=primo turno, 2=secondo, ecc.)
  checked_out_at TIMESTAMPTZ,              -- NULL = tavolo ancora occupato, timestamp = liberato
  date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(table_id, service_slot_id, date, turn_number)
);
```

### Logica turni per tavolo

- **Fascia oraria** (`service_slot`): es. "Pranzo 11:31–15:30, max 3 turni".
- **Turno** (`turn_number`): un tavolo può avere T1, T2, T3 nella stessa fascia, ognuno con una prenotazione diversa.
- **Check-out manuale**: admin clicca "Libera tavolo" → `checked_out_at = now()`. Il tavolo passa alla prenotazione assegnata al turno successivo (se esiste).
- **max_turns = 0**: fascia "chiusa" — nessun tavolo disponibile in quella fascia.
- **max_turns = NULL**: infiniti turni per fascia.

### Alert non vincolante: fascia fuori orario apertura

Quando admin crea/modifica una fascia oraria con orari che non ricadono in `business_hours`, un alert (non bloccante) avvisa: "Questa fascia è fuori dall'orario di apertura comunicato ai clienti."

### Logica pagina pubblica prenota (scalabile, da implementare in F5+)

Oltre alla verifica degli orari di apertura, il form pubblico verificherà:
1. Quale `service_slot` copre l'orario richiesto dal cliente.
2. Se `max_turns > 0` (o NULL) per quella fascia in quel giorno.
3. Se ci sono turni liberi (turn_number disponibile non ancora assegnato).
4. Se non disponibile: alert al cliente con le fasce orarie del giorno con turni > 0.

Questa logica è progettata in modo scalabile — in F5 si aggiungerà la verifica della capienza effettiva per tavolo.

### UX mappa Servizio (F4c)

- **Selettore data + fascia** in testa alla mappa.
- **Panel laterale**: lista prenotazioni accettate per la data/fascia selezionata, non ancora assegnate.
- **Drag dalla lista → drop sul tavolo**: assegna la prenotazione a quel tavolo (turno N+1).
- **Colori tavolo**:
  - Verde: nessuna prenotazione assegnata nella fascia.
  - Arancio: prenotazione assegnata, turno in attesa o in corso.
  - Rosso: check-in effettuato (non implementato ora — placeholder).
  - Badge: nome cliente + coperti.
- **"Libera tavolo"**: click sul tavolo occupato → conferma → `checked_out_at = now()`.

### No-show end-to-end

- Da fare come **primo micro-task** nella sessione esecutrice (prima di F4a).
- Verificare il flusso end-to-end del pulsante già presente nel pannello calendario.
- Se mancano aggiornamenti DB o query invalidation → correggere.

---

## Invarianti globali confermati

- LOCK: CollapsibleCard, Modal, TenantContext, supabase.ts, migrazioni 001–009, router.tsx
- Tailwind v4: classi statiche, sintassi `bg-(--token)`
- `logger.*` mai `console.*`
- Migrazioni via MCP Supabase `apply_migration`
- `QUERY_KEY` esportato dalla sorgente
- `supabase` per admin, `supabasePublic` per public form
