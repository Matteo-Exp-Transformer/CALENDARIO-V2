# Report decisioni — 13 maggio 2026

**Sessione di planning**: Servizio F2-F3 (sale + mappa drag-and-drop), Analytics F2, Home F2.
**Stato repo all'inizio**: branch `main`, working tree pulito, validazione verde, ultimo commit `241f10e`.

---

## 1. Audit del lavoro precedente

Sub-agent Sonnet ha analizzato i file di AdminShell, Home, CRM, Servizio F1, Analytics F1.

### Verdetto: **PROCEDIBILE** — qualità solida.

### Punti di forza confermati
- Multi-tenancy coerente: ogni nuovo hook usa client `supabase` autenticato + filtro `tenant_id`, lancia se manca.
- `QUERY_KEY` esportati e riusati in `useBookingMutations.ts` per invalidazioni.
- Logger usato ovunque nei nuovi hook, zero `console.log` residui.
- RLS DB completa su `006_customers_crm.sql` e `007_tables.sql` (policy + `enforce_*_tenant` trigger).
- AdminShell: separazione sezioni pulita, cleanup listener corretto.

### Cleanup pre-F2 (Fase 0)
| File | Issue | Fix |
|------|-------|-----|
| `useServizioTables.ts:79,112,141` | Invalidazione senza `tenantId` | `[TABLES_QUERY_KEY, tenantId]` |
| `CrmPage.tsx` + `CustomerListTable.tsx` | Mix sintassi Tailwind v3/v4 | Uniformare a `bg-(--color-bg)` |
| `useCustomers.ts:146` | `select('*')` su booking_requests | Esplicitare campi (perf) |
| `useAnalytics.ts:33,36,46` | KPI calcolati su `created_at` | Valutare switch a `confirmed_start` |
| `TableFormModal.tsx` | `text-slate-700` hardcoded | Token `text-primary-900` |

### Non critici (nota tecnica)
- `AdminShell` non usa React Router per le sezioni ma `useState`. Scelta consapevole, ma niente deep-link.

---

## 2. Gap analysis vs intenzioni dei report 12-05-26

### Fatto
- AdminShell con 4 voci + Calendario in cima, tema persistente.
- Home F1: quick-nav, 3 stat card, lista prossime 3h.
- CRM completo: CRUD, ricerca, drawer dettaglio, soft-delete prenotazioni.
- Servizio F1: CRUD tavoli raggruppati per `placement` (text).
- Analytics F1: 3 KPI (totali, coperti, tasso conferma), trend Recharts 7g/30g.
- Migration alignment repair completata, `db push` operativo per 008+.

### Mancante
- Servizio F2 turni, F3 mappa drag-and-drop.
- Analytics F2/F3 (no-show, fonte, occupazione, delta).
- No-show action (verrà nel `BookingDetailsModal`, non in Home).
- `send-email` Edge Function (problema aperto, fuori scope F2).

### Deviazione importante
La migrazione **007 applicata** usa `placement (text)`, **non** `room + position_x + position_y` come dichiarato nel plan originale. Lo schema attuale **NON** supporta la mappa drag.
→ Risolto da migrazione 008 (rooms come entità separata).

---

## 3. Ricerca concorrenza — TOP3 da rubare

Sub-agent ha analizzato TheFork Manager, SevenRooms, OpenTable, Resy, Tock, Toast, Quandoo.

1. **Sommario pre-turno stampabile** (SevenRooms) — briefing con coperti, note, allergie, occasioni. Differenziatore forte per ristoratore italiano indipendente senza maître dedicato.
2. **Report "Booked By"** (SevenRooms/OpenTable) — pie chart fonte prenotazione (Google, telefono, walk-in, widget). KPI che i ristoratori non trovano in Excel.
3. **Lock tavolo su prenotazione** (TheFork) — toggle per impedire spostamenti accidentali multi-utente. *(Non in scope F2-F3, candidata per fase futura)*.

### Pattern table map ricorrenti
- Drag prenotazione → tavolo (non click+modal).
- Stato a colore: verde libero, arancio prenotato, rosso occupato, grigio bloccato.
- Multi-sala via tab, non layer.
- Snap-to-grid soft (libertà pixel).
- Forme preset (rotondo 2/4/6, rettangolare 4/6/8).

### Pattern Analytics ricorrenti
- KPI card top + delta vs periodo precedente.
- Filtro per turno pranzo/cena.
- Confronto sempre disponibile (universale tra competitor).

### Pattern Home ricorrenti
- 3 blocchi: KPI giorno / timeline prossime ore / alert + shortcut.
- Shortcut "walk-in" come tab principale, non nascosto.

---

## 4. Decisioni prese dall'utente

| # | Domanda | Decisione |
|---|---------|-----------|
| 1 | Schema DB mappa | **Sale come entità separata** (tabella `rooms` + estensione `tables` con coordinate) |
| 2 | Forma area sala | **Rettangolo con dimensioni configurabili per sala** (width, height in unità arbitrarie) |
| 3 | Libreria drag&drop | **@dnd-kit + SVG/HTML** (più leggero di react-konva, accessibile, supporto touch) |
| 4 | Scope mappa F1 | **Layout + stato tavolo live (visivamente)** — poi degradato a "stato live in fase dedicata dopo F3" |
| 5 | KPI Analytics F2 | **Ticket medio, no-show, fonte prenotazione**. Tasso occupazione *dopo* migration sale. |
| 6 | No-show action | **Nel `BookingDetailsModal` del calendario**, NON in Home |
| 7 | Confronto periodo precedente | **Sì, su tutti i KPI in F2** |
| 8 | Filtro turno pranzo/cena | **Sì, toggle in cima** |
| 9 | Feature Home priority | **Alert pending + Walk-in + Briefing pre-turno** |
| 10 | Ordine fasi | **Servizio (DB → mappa) → Analytics → Home** |
| 11 | Walk-in model | **`booking_type='walk_in'`**, mostrato solo in admin, escluso da `PublicBookingPage` |
| 12 | Briefing format | **HTML stampabile + download PDF gratuito** (jsPDF) |
| 13 | Stato live mappa | **Fase dedicata dopo F3** (F3 = solo layout, no stato per ora) |
| 14 | Mappa mobile | **Solo view, drag desktop** |
| 15 | CHECK constraint walk_in | **Aggiungere `walk_in` al CHECK esistente** di `booking_type` |

---

## 5. Architettura finale

### Migrazione 008 — rooms + coordinates
```sql
CREATE TABLE rooms (
  id uuid PK, tenant_id uuid FK, name text NOT NULL,
  width int DEFAULT 800, height int DEFAULT 600,
  display_order int DEFAULT 0,
  created_at, updated_at
);
ALTER TABLE tables ADD COLUMN room_id uuid REFERENCES rooms(id) ON DELETE SET NULL;
ALTER TABLE tables ADD COLUMN position_x int DEFAULT 0;
ALTER TABLE tables ADD COLUMN position_y int DEFAULT 0;
ALTER TABLE tables ADD COLUMN shape text DEFAULT 'round' CHECK (shape IN ('round','square','rect'));
ALTER TABLE tables ADD COLUMN rotation int DEFAULT 0;
-- Data migration: una room per placement esistente, assegnazione automatica
-- placement (text) deprecata ma conservata per retrocompatibilità F1
```

### Migrazione 009 — source + no_show + walk_in
```sql
ALTER TABLE booking_requests
  ADD COLUMN source text DEFAULT 'public_form'
  CHECK (source IN ('public_form','manual','walk_in','phone','google'));
ALTER TABLE booking_requests ADD COLUMN no_show boolean DEFAULT false;
-- Estendere CHECK booking_type per includere 'walk_in'
-- Indice su source per Booked By report
```

### Servizio F2-F3
- `ServizioPage` diventa a **2 tab**: Lista (F1 esistente) + Mappa.
- Tab Mappa: tabs sale in alto, canvas SVG `room.width × room.height` con griglia, drag tavoli con `@dnd-kit`, snap-to-grid morbido (10px), debounce 300ms su update position.
- Modal "Configura sala" per width/height.
- Mobile: drag disabilitato, solo visualizzazione.
- **Stato live tavoli posticipato a fase F4 dedicata.**

### Analytics F2
- KPI estesi: coperti/booking medio, tasso no-show, Booked By breakdown.
- Toggle turno (Tutti/Pranzo/Cena) derivato da `business_hours`.
- Delta vs periodo precedente su ogni KPI card.
- Card "Tasso occupazione" con tooltip "Disponibile dopo configurazione sala".
- `BookingDetailsModal` ottiene pulsante "Segna come no-show" → `useMarkNoShow`.

### Home F2
- Banner alert arancione se `pending > 0` con CTA verso Prenotazioni→Pending.
- 4° quick-nav button: "Aggiungi walk-in" → `WalkInModal` (n. coperti + tavolo opzionale).
- 5° quick-nav button / sezione: "Briefing turno" → `ShiftBriefingModal` con stampa HTML + scarica PDF.
- `PublicBookingPage` deve filtrare `walk_in` se mai esposto in UI pubblica.

---

## 6. File da creare/modificare (overview)

### Fase 0 — cleanup
- Modifiche: `useServizioTables.ts`, `useCustomers.ts`, `CrmPage.tsx`, `CustomerListTable.tsx`, `TableFormModal.tsx`, `useAnalytics.ts`

### Fase 1 — DB sale
- `supabase/migrations/008_rooms_and_table_layout.sql`
- `src/features/booking/hooks/useRooms.ts` (nuovo)
- `src/features/booking/hooks/useServizioTables.ts` (estensione)
- `src/types/database.ts` (rigenerato)

### Fase 2 — Mappa
- `src/features/booking/components/servizio/TableMap.tsx`
- `src/features/booking/components/servizio/TableShape.tsx`
- `src/features/booking/components/servizio/RoomTabs.tsx`
- `src/features/booking/components/servizio/RoomConfigModal.tsx`
- `src/pages/ServizioPage.tsx` (refactor a 2 tab)
- Dipendenza: `@dnd-kit/core @dnd-kit/utilities`

### Fase 3 — Analytics
- `supabase/migrations/009_booking_source_and_noshow.sql`
- `src/features/booking/components/analytics/BookedByChart.tsx`
- `src/features/booking/components/analytics/ShiftToggle.tsx`
- `src/features/booking/components/analytics/AnalyticsKpiCard.tsx` (estendere con delta)
- `src/features/booking/hooks/useAnalyticsComparison.ts`
- `src/features/booking/hooks/useAnalytics.ts` (estensione)
- `src/pages/AnalyticsPage.tsx`
- `src/features/booking/components/BookingDetailsModal.tsx` (no-show button)
- `src/features/booking/hooks/useBookingMutations.ts` (`useMarkNoShow`)

### Fase 4 — Home
- `src/features/booking/components/home/WalkInModal.tsx`
- `src/features/booking/components/home/ShiftBriefingModal.tsx`
- `src/features/booking/hooks/useShiftBriefing.ts`
- `src/features/booking/hooks/useWalkInMutation.ts`
- `src/lib/shiftBriefingPdf.ts` (helper jsPDF)
- `src/pages/AdminHomePage.tsx`
- Dipendenze: `jspdf jspdf-autotable`

---

## 7. Invarianti globali

- LOCK: `CollapsibleCard`, `Modal`, `TenantContext`, `supabase.ts`, migrazioni 001-007, `router.tsx`.
- Tailwind v4: classi statiche, sintassi `bg-(--token)`.
- `logger.*` mai `console.*`.
- `supabase` autenticato, `supabasePublic` per public form — non mischiare.
- Ogni hook: `QUERY_KEY` esportato dalla sorgente.
- Ogni tabella: RLS + `enforce_*_tenant` + indice tenant_id.
- UUID per campi audit, mai email.
- Dopo `db push`: `npm run db:types:linked`.

---

## 8. Sequenza commit prevista

1. `chore(cleanup): fix audit findings pre-F2`
2. `feat(db): rooms table + table coordinates (migration 008)`
3. `feat(servizio): tab mappa con drag-and-drop @dnd-kit`
4. `feat(db): booking source + no_show + walk_in (migration 009)`
5. `feat(analytics): KPI estesi + delta periodo + filtro turno + Booked By`
6. `feat(home): walk-in + briefing turno + alert pending`
