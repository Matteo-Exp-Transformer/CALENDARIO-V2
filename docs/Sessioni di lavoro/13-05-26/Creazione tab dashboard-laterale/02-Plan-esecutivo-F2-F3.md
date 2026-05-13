# Plan esecutivo — F2-F3 (Servizio + Analytics + Home)

**Branch base:** `main` (working tree pulito, validazione verde)
**Modello agente esecutore consigliato:** Claude Opus 4.7
**Sub-agent consigliati:** Sonnet (per task isolati: implementazione mappa, implementazione briefing PDF)

---

## FASE 0 — Cleanup pre-development

**Obiettivo:** chiudere i findings dell'audit prima di toccare nuove feature.

### Task
1. `src/features/booking/hooks/useServizioTables.ts` — aggiungere `tenantId` come secondo elemento del queryKey in tutte le `invalidateQueries` delle 3 mutation (`useCreateTable`, `useUpdateTable`, `useDeleteTable`). Allineare al pattern degli altri hook.
2. `src/features/booking/hooks/useCustomers.ts:146` — sostituire `select('*')` con elenco esplicito: `id, client_email, client_name, client_phone, desired_date, updated_at, status, num_guests, cancelled_at, booking_type, event_type`.
3. `src/pages/CrmPage.tsx` + `src/features/booking/components/crm/CustomerListTable.tsx` — uniformare sintassi token Tailwind v4. Sostituire ogni `bg-[var(--color-X)]`, `border-[var(--color-X)]`, `text-[color:var(--color-X)]` con la sintassi short `bg-(--color-X)`, `border-(--color-X)`, `text-(--color-X)`.
4. `src/features/booking/components/servizio/TableFormModal.tsx` — sostituire `text-slate-700` con `text-primary-900` nelle label.
5. `src/features/booking/hooks/useAnalytics.ts` — valutare switch da `created_at` a `confirmed_start` per i filtri data dei KPI. Se confermato, aggiungere coalesce: `confirmed_start ?? desired_date`. **Chiedere all'utente prima di applicare.**

### Validazione fase 0
- `npm run validate` → tutto verde.
- Commit: `chore(cleanup): fix audit findings pre-F2`.

---

## FASE 1 — Migrazione 008: rooms + coordinates tavoli

### Task
1. Creare `supabase/migrations/008_rooms_and_table_layout.sql`:
   - Tabella `rooms` (id, tenant_id, name, width int DEFAULT 800, height int DEFAULT 600, display_order int DEFAULT 0, created_at, updated_at).
   - RLS abilitato.
   - 4 policy `admin_*` con `current_admin_tenant_id()`.
   - Trigger `trg_rooms_updated_at` riusa `update_updated_at()`.
   - Funzione + trigger `enforce_room_tenant()` modellata su `enforce_table_tenant()`.
   - Indice su `tenant_id`.
   - `ALTER TABLE tables` aggiunge: `room_id uuid REFERENCES rooms(id) ON DELETE SET NULL`, `position_x int DEFAULT 0`, `position_y int DEFAULT 0`, `shape text DEFAULT 'round' CHECK (shape IN ('round','square','rect'))`, `rotation int DEFAULT 0`.
   - **Data migration**: `INSERT INTO rooms (tenant_id, name) SELECT DISTINCT tenant_id, COALESCE(placement, 'Sala principale') FROM tables WHERE active = true;` poi `UPDATE tables SET room_id = ...` join sul nome.
   - `placement` resta in tabella (deprecato, da rimuovere in 010).
   - Indice su `tables(room_id)`.

2. Applicare la migrazione tramite MCP Supabase `apply_migration` (come fatto per 007). **NON usare `db push`** finché il falso positivo doppio-003 esiste.

3. Verificare nel DB: `rooms_exists`, 4 policy presenti, trigger creato, `tables` ha nuove colonne, data migration ha popolato `room_id`.

4. `npm run db:types:linked` per rigenerare `src/types/database.ts`.

### Hook
5. Creare `src/features/booking/hooks/useRooms.ts`:
   - `ROOMS_QUERY_KEY = 'rooms'` esportato.
   - `useRooms(tenantId)` → SELECT, ordine `display_order ASC, name ASC`, staleTime 5min.
   - `useCreateRoom`, `useUpdateRoom`, `useDeleteRoom` con `logger.error` + `toast` + invalidate `[ROOMS_QUERY_KEY, tenantId]` e `[TABLES_QUERY_KEY, tenantId]`.

6. Estendere `useServizioTables.ts`:
   - Interfacce `RestaurantTable` e `TableInput` includono `room_id`, `position_x`, `position_y`, `shape`, `rotation`.
   - Nuova mutation `useUpdateTablePosition(id, x, y)` debounced 300ms — usata dalla mappa.

### Validazione fase 1
- `npm run validate` → tutto verde.
- Smoke test: aprire app, andare in Servizio, verificare che i tavoli esistenti appaiano correttamente raggruppati per `room.name` (la lista F1 attuale deve continuare a funzionare via `placement` o, dopo refactor, via `room.name`).
- Commit: `feat(db): rooms table + table coordinates (migration 008)`.

---

## FASE 2 — Servizio F3: tab Mappa drag-and-drop

### Dipendenze
`npm i @dnd-kit/core @dnd-kit/utilities`

### Refactor `ServizioPage.tsx`
- Aggiungere stato `mode: 'list' | 'map'` con tabs.
- Tab "Lista" mostra il contenuto F1 esistente, ma raggruppato per `room` (nuova prop) invece di `placement`.
- Tab "Mappa" monta `<TableMap />`.

### Componenti nuovi
1. `src/features/booking/components/servizio/RoomTabs.tsx`:
   - Lista tabs orizzontali con i `rooms` del tenant.
   - Pulsante "+ Nuova sala" → apre `RoomConfigModal` in modo create.
   - Pulsante "Configura sala corrente" (icona ingranaggio) → apre modal in modo edit.

2. `src/features/booking/components/servizio/RoomConfigModal.tsx`:
   - Form: nome, width (numero 200-2000), height (numero 200-2000), display_order.
   - Validazione: nome obbligatorio, width/height >= 200.
   - Submit → `useCreateRoom` o `useUpdateRoom`.
   - Cancellazione sala: confermazione, soft-block se ci sono `tables.room_id = roomId` attivi.

3. `src/features/booking/components/servizio/TableMap.tsx`:
   - Riceve `room` selezionata.
   - Renderizza un wrapper `<div>` con dimensioni `room.width × room.height` (clamp a viewport scrolloso).
   - Sfondo griglia con CSS pattern `background-image: linear-gradient(...)` su step 20px.
   - Su mobile (matchMedia narrow): drag disabilitato, banner "Modifica layout disponibile da desktop".
   - `<DndContext>` con `useSensors(PointerSensor)` desktop-only.
   - Mappa i `tables.filter(t => t.room_id === room.id)` in `<TableShape>` posizionati assolutamente con `transform: translate3d(x, y, 0)`.
   - onDragEnd: chiama `useUpdateTablePosition` con snap-to-grid `Math.round(x/10)*10`.
   - Toolbar laterale: "+ Aggiungi tavolo" spawna al centro della sala.

4. `src/features/booking/components/servizio/TableShape.tsx`:
   - Riceve `table` + `isDragging`.
   - `useDraggable({ id: table.id })`.
   - Rendering: SVG `<circle>` o `<rect>` in base a `shape`, label nome+capienza al centro.
   - Color: per ora **tutti verdi** (stato live posticipato a fase futura). Documentare con commento "TODO: collegare a useTableStatuses in fase F4".
   - Click breve → apre `TableFormModal` per edit.
   - Cursor: grab/grabbing.

### Validazione fase 2
- `npm run validate`.
- Test manuale browser: creare 2 sale, posizionare tavoli con drag, ricaricare pagina, verificare persistenza posizioni.
- Test mobile (DevTools responsive): drag disabilitato, banner visibile.
- Commit: `feat(servizio): tab mappa con drag-and-drop @dnd-kit`.

---

## FASE 3 — Migrazione 009 + Analytics F2

### Migrazione 009
1. Creare `supabase/migrations/009_booking_source_and_noshow.sql`:
   - `ALTER TABLE booking_requests ADD COLUMN source text DEFAULT 'public_form' CHECK (source IN ('public_form','manual','walk_in','phone','google'))`.
   - `ALTER TABLE booking_requests ADD COLUMN no_show boolean DEFAULT false`.
   - Estendere il CHECK constraint di `booking_type` per includere `'walk_in'`. Sintassi: drop + add constraint, oppure (se è un check inline) regenerare la constraint.
   - Backfill: `UPDATE booking_requests SET source = 'public_form' WHERE source IS NULL` (defensive).
   - Indice su `source`.
   - Indice parziale su `no_show = true`.

2. Apply via MCP Supabase + rigenerare tipi.

### Estensione `useAnalytics.ts`
3. Aggiungere `shift: 'all' | 'lunch' | 'dinner'` come parametro.
4. Calcolare:
   - `avgPartySize` = avg(num_guests).
   - `noShowRate` = count(no_show=true)/count(accepted)*100.
   - `bookedBy` = group by source → array `{ source, count, percentage }`.
5. Range orari pranzo/cena derivati da `business_hours` del tenant (utility nuova `src/features/booking/utils/shifts.ts`).
6. Aggiungere `useAnalyticsComparison(tenantId, days, shift)` che calcola gli stessi KPI sul periodo precedente (es. giorni `[days*2, days]` indietro) per il delta.

### Componenti
7. `src/features/booking/components/analytics/ShiftToggle.tsx` — toggle 3 stati.
8. `src/features/booking/components/analytics/BookedByChart.tsx` — `<PieChart>` Recharts con legenda + tooltip percentuale.
9. Estendere `AnalyticsKpiCard.tsx` con prop opzionale `delta: { value: number, direction: 'up'|'down', label: string }`. Render: piccolo badge sotto al valore con freccia + colore verde/rosso.
10. `src/pages/AnalyticsPage.tsx` — montare `ShiftToggle` in alto, KPI estesi, `BookedByChart` come 2° grafico dopo il trend.
11. Card "Tasso occupazione" disabled con tooltip "Disponibile dopo configurazione sala" finché `rooms.length === 0`.

### No-show action nel `BookingDetailsModal`
12. Aggiungere pulsante "Segna come no-show" visibile se `status='accepted'` AND `confirmed_start < now` AND `no_show=false`.
13. Mutation `useMarkNoShow(bookingId)` in `useBookingMutations.ts`:
    - UPDATE `no_show=true`.
    - Invalida `ANALYTICS_QUERY_ROOT` + `HOME_STATS_QUERY_KEY` + booking queries.
    - Toast "Prenotazione segnata come no-show".

### Validazione fase 3
- `npm run validate`.
- Test browser: pannello prenotazione passata mostra pulsante, click aggiorna DB, Analytics riflette il dato in <5 sec.
- Toggle turno mostra dati diversi per pranzo/cena.
- Delta visibile sui 3 KPI esistenti + nuovi.
- Commit: `feat(analytics): KPI estesi + delta periodo + filtro turno + Booked By`.

---

## FASE 4 — Home F2

### Dipendenze
`npm i jspdf jspdf-autotable`

### Modifiche `AdminHomePage.tsx`
1. **Banner pending alert** in cima (sopra le stat card):
   - Visibile se `useHomeStats().pending > 0`.
   - Classe: `bg-warning-50 border-(--color-warning) text-warning-900` (o equivalenti token esistenti).
   - Testo: "Hai {N} richieste in attesa di conferma".
   - CTA: pulsante "Vai a Prenotazioni" → `onOpenPrenotazioni()`.

2. **Quick-nav esteso a 5 pulsanti** (era 3):
   - Calendario, CRM, Servizio (esistenti).
   - **+ "Aggiungi walk-in"** (icona `UserPlus`) → apre `WalkInModal`.
   - **+ "Briefing turno"** (icona `Printer`) → apre `ShiftBriefingModal`.

### Componenti nuovi
3. `src/features/booking/components/home/WalkInModal.tsx`:
   - Riusa `<Modal>` (LOCK).
   - Campi: nome cliente (opzionale), n. coperti (richiesto, 1-20), tavolo (dropdown da `useTables`, opzionale).
   - Submit → `useCreateWalkIn`.

4. `src/features/booking/hooks/useWalkInMutation.ts`:
   - INSERT su `booking_requests`:
     - `booking_type = 'walk_in'`, `source = 'walk_in'`, `status = 'accepted'`.
     - `confirmed_start = now()`, `confirmed_end = now() + interval 90 minutes` (default).
     - No email, no rate-limit (è admin-only).
   - Invalida `HOME_STATS_QUERY_KEY`, booking queries, `ANALYTICS_QUERY_ROOT`.

5. `src/features/booking/components/home/ShiftBriefingModal.tsx`:
   - Determina turno corrente da `business_hours` + ora attuale.
   - Mostra header: data + turno (Pranzo/Cena).
   - Tabella prenotazioni del turno ordinate per `confirmed_start`:
     - Orario, nome cliente, coperti, tavolo (`room.name + table.name`), note (`special_requests`).
   - Footer: totale prenotazioni + totale coperti.
   - Due bottoni:
     - **"Stampa"** → `window.print()`. Aggiungere CSS `@media print` in `src/index.css` per nascondere shell e mostrare solo briefing.
     - **"Scarica PDF"** → `src/lib/shiftBriefingPdf.ts` con `jsPDF` + `autoTable`.

6. `src/features/booking/hooks/useShiftBriefing.ts`:
   - Query `booking_requests` filtrata: oggi + range orario turno + `status='accepted'` + `no_show=false`.
   - Join `tables` per nome tavolo + `rooms` per nome sala.
   - Ordine `confirmed_start ASC`.

7. `src/lib/shiftBriefingPdf.ts`:
   - Funzione `generateBriefingPdf(bookings, shiftLabel, date)` → ritorna `jsPDF` istanza.
   - Layout A4: titolo, data+turno, tabella con autoTable, footer pagina.
   - `doc.save('briefing-{date}-{shift}.pdf')`.

### Filtro public form
8. `src/pages/PublicBookingPage.tsx` — se attualmente espone `booking_type` come selettore, filtrare via UI per nascondere `'walk_in'`. Documentare nel commit.

### Validazione fase 4
- `npm run validate`.
- Test browser: walk-in crea booking che appare subito in calendario; briefing mostra dati attesi; stampa anteprima OK; PDF scaricato apre senza errori.
- Commit: `feat(home): walk-in + briefing turno + alert pending`.

---

## Invarianti globali (valide per tutte le fasi)

- LOCK: `CollapsibleCard.tsx`, `Modal.tsx`, `TenantContext.tsx`, `supabase.ts`, migrazioni 001-007, `router.tsx`. **Non modificare.**
- Tailwind v4: classi letterali statiche, sintassi short `bg-(--token)` non `bg-[var(--token)]`.
- `logger.*` mai `console.*`.
- `supabase` per admin autenticato, `supabasePublic` per public form — non mischiare.
- `QUERY_KEY` esportato dalla sorgente, importato nelle mutations.
- Ogni nuova tabella: RLS abilitato + 4 policy `admin_*` + `enforce_*_tenant` trigger + indice `tenant_id`.
- UUID per campi audit (`created_by`, `cancelled_by`, `cancelled_by_user_id`) — mai email.
- Dopo `apply_migration`: `npm run db:types:linked` + verificare rimozione `(supabase as any)`.
- Mappa: drag SOLO desktop, view su mobile.
- Stato live tavoli posticipato a fase F4 separata (NON implementare in F3).

---

## Checklist finale (prima del PR)

- [ ] Tutte le 4 fasi commitate separatamente.
- [ ] `npm run validate` verde dopo ogni fase.
- [ ] `database.ts` aggiornato e committato dopo ogni migrazione.
- [ ] Nessun `(supabase as any)` introdotto.
- [ ] Nessuna classe Tailwind dinamica.
- [ ] Nessun `console.log`.
- [ ] LOCK non toccati.
- [ ] Report finale di sessione in `docs/Sessioni di lavoro/13-05-26/` con commit-hash di ogni fase.
