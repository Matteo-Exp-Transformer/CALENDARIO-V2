# ADMIN — Servizio Context

> Area Pro/Enterprise per gestione sale, tavoli, fasce, assegnazioni, walk-in e briefing turno.

## 1. Flussi utente

- Sidebar -> `Servizio`.
- Toggle `Lista` / `Mappa`.
- Lista: aggiunge, modifica, elimina tavoli.
- Mappa: gestisce sale, canvas, posizione tavoli, assegnazioni.
- Fasce: configura servizi e limiti.
- Home: quick action `Aggiungi walk-in` e `Briefing turno`.

## 2. Elementi

| Elemento | Campi |
|---|---|
| Sala | nome, larghezza/altezza canvas, ordine |
| Tavolo | nome, capienza, sala, posizione x/y, forma, active |
| Fascia servizio | nome, inizio/fine, turni max, coperti max, chiusura |
| Override fascia | periodo date, valori override |
| Walk-in | nome opzionale, coperti, sala, tavolo |
| Briefing | turno, booking confermate oggi, stampa/PDF |

## 3. Componenti/hook

- `ServizioPage`
- `RoomTabs`, `RoomConfigModal`
- `TableFormModal`, `TableMap`, `TableShape`
- `AssignmentMapPanel`
- `ServiceSlotsManager`
- `WalkInLimitCard`, `WalkInModal`
- `ShiftBriefingModal`
- `useRooms`, `useTables`, `useServiceSlots`, `useServiceSlotOverrides`
- `useTableAssignments`, `useWalkInMutation`, `useShiftBriefing`

## 4. Tabelle

- `rooms`
- `tables`
- `service_slots`
- `service_slot_overrides`
- `booking_table_assignments`
- `booking_requests`
- `restaurant_settings.walk_in_max_guests`

## 5. Vincoli

- Sale/tavoli sono tenant-scoped.
- Delete tavolo = soft delete `active=false`.
- **Delete sala = soft delete `active=false` (D50, S4-A, mig. 063).** Non più DELETE fisico né
  soft-block: le query sale (`useRooms`) filtrano `active=true`; se la sala è "viva" (≥1 assignment
  attivo `checked_out_at IS NULL` sui suoi tavoli) la modale chiede conferma con impatto quantificato
  e al "Sì" timbra `checked_out_at` (release nel cassetto «da assegnare», append-only) prima di
  archiviare; sala scarica → archiviazione diretta. Conta `useRoomLiveBookings`.
- Tavolo nuovo nasce con forma `square` di default (D44, S4-A); il codice 3 forme resta.
- Tavolo richiede capienza intera > 0; sala obbligatoria se esistono sale.
- Drag mappa disabilitato sotto 768px.
- Slot supportano overnight; `max_turns=0` indica servizio chiuso.
- Walk-in usa limite default 20 se setting assente; registry ammette 0..500, modal richiede 1..max.
- **Guard modifiche non salvate (FU-023, M6 12-06-26):** modali sala/tavolo/fascia (`RoomConfigModal`, `TableFormModal`, `SlotModal` in `ServiceSlotsManager`) e card `WalkInLimitCard` usano `DiscardChangesConfirmModal` + `UnsavedChangesContext` (sorgenti `servizio-room-modal`, `servizio-table-modal`, `servizio-slot-modal`, `servizio-walk-in-limit`). Chiusura X/overlay/Annulla con form dirty → conferma in-app; navigazione sidebar Pro bloccata finché dirty. Pattern: `CustomerFormModal` / `MenuQrModal`. Test: `servizioModalsGuard.adminBlindatura.test.tsx`.
- **Riordino fasce in Pro (19-06-26):** `ServiceSlotsManager` ora ha frecce Su/Giù su ogni fascia (`SlotControls`). Click → `persistSlotOrder()` chiama `updateSlot.mutateAsync` per ogni fascia con `display_order = indice-posizione` e `skipToast:true`. Prima/ultima fascia disabilita rispettiva freccia. Pattern display_order = indice array (identico a Classic). Nessuna migrazione. Test: `serviceSlotsMoveOrder.servizioBlindatura.test.tsx`. ⚠️ Nuove fasce create da Pro ricevevano sempre `display_order:0` — `persistSlotOrder` normalizza automaticamente.
- **Intervallo arrivi S3 (solo Pro):** la modale fascia espone preset 15/30/60 + «Altro», range
  5–120. Scrive `service_slots.arrival_step_minutes` tramite la stessa RPC PATCH. Nessuna manopola
  equivalente in Classic; cutoff/tardivo/minimo ordine restano console-tunable.

## 6. Rischi emersi

> **Cantiere Servizio + motore disponibilità:** masterplan canonico in `docs/MASTERPLAN_SERVIZIO.md`
> (decisioni D1–D42, sotto-aree S0–S6, registro rischi #1–#9). I rischi sotto vi sono mappati.

- **✅ BUG Edge RISOLTO (rischio #1 / azione S0-D8):** `create-booking` interrogava
  `service_slot_overrides.override_date` (colonna inesistente), mentre schema moderno usa `date_from/date_to`
  → gli override morbidi non scattavano mai. Risolto su branch `s0/edge-override-fix`:
  l'Edge ora legge tutte le righe della tabella che ricoprono la data (`date_from <= data <= date_to`),
  applica "vince il più specifico" tramite funzione `resolveOverrideMaxGuests` (replica server-side
  di `resolveSlotOverride`). Verificato su TEST: override respinge correttamente con 409 SLOT_LIMIT.
  **Deployato in PRODUZIONE il 22-06-26: `create-booking` v21 su `rwuxgvld`** (deploy via MCP, bundle
  a due file `source/index.ts` + `_shared/log.ts`, `verify_jwt:false`; diff vs PROD v20 = solo i due hunk
  del fix, nessun altro drift; boot smoke 400 OK). TEST allineato (v27).
  Il vecchio pre-check `check-slot-availability` è stato rimosso in WP-B5 (12-06-26), quindi non va più
  considerato fonte runtime.
- In `WalkInModal`, busy check confronta `booking.placement` con `tableId`, ma il walk-in salva
  `placement` come nome tavolo. Possibile mismatch.
- `AssignmentMapPanel` e renderizzato da `ServizioPage` senza controllo diretto `features.tableAssignments`.
  *(Resta debito D10 → Traccia B, predicato modalità-tavoli D49.)*
- ~~Briefing non mostra sala/tavolo~~ **RISOLTO (D52, S4-A):** `useShiftBriefing` ora fa il join
  `assignment→tables→rooms`; il modale ha la colonna "Tavolo" e mostra "T12" mono-sala / "Sala · T12"
  multi-sala (campo `isMultiRoom`); non assegnate = "—". PDF briefing ancora senza colonna tavolo (FU).

## 7. Test critici futuri

- Assegnazione tavolo con conflitto stesso turno.
- Walk-in su tavolo occupato.
- Slot chiuso/override specifico.
- Mobile mappa read-only.
- Briefing con e senza prenotazioni.

## 8. Baseline S0 — mappa AS-IS + pulizia (22-06-26)

> Azione 2 di S0 (masterplan §7). Mappa completa AS-IS in
> `docs/Sessioni di lavoro/22-06-26/SERVIZIO_BASELINE_MAP.md` (11 componenti + 7 hook;
> fondamenta dati S1–S4 in lista B).

- **Codice morto RIMOSSO** (intervista Matteo 22-06-26, validate verde):
  - `rotation` tolto da `RestaurantTable`/`TableInput` in `useServizioTables.ts` — nessuna UI lo usava.
    La **colonna DB `tables.rotation` resta** (e così `database.ts` generato); se servirà la rotazione
    grafica del tavolo in S4 si riaggiunge al tipo.
  - Re-export `export { slotCrossesMidnight }` tolto da `useServiceSlots.ts` — tutti i consumer
    importano da `bookingTimeSlots` direttamente.
- **Confermato VIVO (non toccato):** `useReleaseBookingAssignment` (usato da `QuickTableAssignModal`);
  prop `businessHoursRaw` del briefing (popolata da `AdminHomePage`); `display_order` manuale sale
  (Matteo lo usa — ordine sale a numero, da blindare).
- **Debiti rimandati a S4 (D10), solo annotati:** `useTableStatuses` (tavoli sempre verdi),
  mismatch walk-in `placement`/`table_id`, guard `features.tableAssignments` su `AssignmentMapPanel`,
  race condition `useUnassignedBookings`.

## 9. S4 — motore turni e coerenza strutturale — IMPLEMENTATO SU TEST

> Intervista e build S4 concluse secondo `docs/Sessioni di lavoro/24-06-26/S4_PLAN.md`. Le due tracce
> sono integrate in `env/test`; i branch temporanei sono chiusi. Migrazioni 063–065 applicate su TEST,
> tipi rigenerati e `create-booking` S4 deployata su TEST come v29. PROD resta invariata fino al rollout
> con conferma esplicita di Matteo.

- **✅ Forma tavolo (D44, Traccia A FATTO):** nessun selettore UI; default alla creazione = **quadrato**
  (`useCreateTable` insert `shape: input.shape ?? 'square'`). Codice 3 forme (`TableShape`) resta.
- **Predicato "modalità-tavoli" (D49):** = (edizione Pro) E (≥1 tavolo configurato). Governa `AssignmentMapPanel`
  (chiude il debito guard), `WalkInModal` e il calcolo capienza. Pro-senza-tavoli → stato-vuoto invitante.
- **Walk-in (D45/D46/D47):** conta **sempre** nella capienza complessiva (anche "solo coperti"); fix bug
  `placement`/`table_id`; capienza sala = **somma coperti dei tavoli**; durata default = manopola console.
- **Checkout (D48):** sempre timbro `checked_out_at`, **rimuovere il DELETE fisico** (`useCheckoutTable` /
  `tableCheckout.ts`). Append-only ovunque.
- **✅ Elimina sala (D50, Traccia A FATTO):** `useDeleteRoom` ora **soft-delete** (`active=false`, mig. 063);
  `useRooms` filtra `active=true`; nuovo `useRoomLiveBookings` conta i `booking_id` distinti con assignment
  attivo (`checked_out_at IS NULL`) sui tavoli della sala. Sala viva → conferma con N quantificato +
  release append-only (`checked_out_at = now()`) → cassetto «da assegnare»; sala scarica → archiviazione
  diretta. Conti aperti = aggancio S4-LIVE (non ancora contati). "Ripristina sala" = FU.
- **✅ Briefing (D52, Traccia A FATTO):** `useShiftBriefing` fa il join `assignment→tables→rooms`; ritorna
  `isMultiRoom`; il modale ha colonna "Tavolo" → "T12" mono-sala / "Sala · T12" multi-sala; non assegnate
  "—"; multi-tavolo (D39) = nomi uniti da ", ". PDF briefing senza colonna tavolo = FU.
- **Conservazione dati (D51):** S4 rende i dati *archiviabili* (append-only + snapshot); la potatura/
  migrazione in Analytics è follow-up `FU-SERV-ANALYTICS-RETENTION-1`.

### 9.1 Stato implementazione — Traccia B (motore disponibilità) ✅ integrata in `env/test`

> Build integrata in `env/test`. Solo TEST (`docnnernvp`); PROD resta uno step separato con Matteo
> (migrazioni+Edge+client insieme). `npm run validate` verde dopo l'integrazione.

- **WP-B1 (D49/D46/D1)** — `useTableMode()` (NUOVO): predicato unico modalità-tavoli = Pro **E** ≥1 tavolo
  attivo, cortocircuito Classic. Guard su `AssignmentMapPanel` + stato-vuoto invitante in `ServizioPage`.
  Capienza = somma coperti tavoli in modalità-tavoli (`useCapacityCheck`), cap per-fascia invariato fuori.
- **WP-B2 (D45/D25/D46)** — walk-in coerente: fix bug #6 (`isBusy` per nome, `placement`=nome), durata dal
  resolver S2 (fallback 90 se permanenza OFF), limiti morbidi/forzabili (avviso, mai blocco), walk-in conta
  sempre in capienza.
- **WP-B3 (D48/D24/D23/D22)** — checkout **append-only** (rimosso DELETE fisico da `useCheckoutTable` e
  `useReleaseBookingAssignment`); `useTableStatuses` (NUOVO) a 5 stati (libero/in arrivo/occupato/in
  ritardo/in uscita); soglia ritardo configurabile `table_late_threshold_minutes` (registry JSONB, default
  15); `AssignmentMapPanel` + `TableShape` colorati.
- **WP-B4 (D37/D22/Q19/D39/D43/D40/D25)** — `resolveOccupancy` (NUOVO): finestre arrivo+durata+buffer
  (overnight/DST-safe), stati che bloccano capienza (D43), tavoli liberi + prossimo orario libero,
  multi-tavolo (D39). `useCapacityCheck` window-aware in modalità-tavoli (auto-free a fine finestra, D22).
  Overbooking forzabile (D25) con `forced_by_admin`/`force_reason`. Edge `create-booking`: conteggio
  window-aware (`occupancy_end ?? confirmed_end`), D43 documentato; race tavolo = vincolo UNIQUE (D40,
  test di concorrenza). **Migrazioni 064/065 applicate SOLO su TEST** (occupancy snapshot + force fields).
- **Note di scope:** `table_session` (D39) rimandata a **S4-LIVE** (proprietà §6 masterplan, nessun consumer
  in S4). Edge `create-booking` S4 deployata su TEST come **v29**, `verify_jwt=false`; smoke minimo verde
  (`POST {}` → 400 controllato `tenantSlug è obbligatorio`). Collaudo manuale congiunto resta il gate prima
  del rollout PROD.

### 9.2 Fix post-QA A1 — CRUD e polish isolato

- Il viewport della mappa segue la larghezza configurata della sala fino allo spazio disponibile; oltre
  il viewport mantiene lo scroll interno, senza allargare la pagina.
- Il nome tavolo è unico case-insensitive fra tutti i tavoli attivi del tenant; in modifica il record
  corrente è escluso dal confronto. Limite UI coerente: **10 caratteri**.
- Nuovo tavolo: coperti precompilati a **2**; nome e coperti nella sagoma hanno font più leggibile.
- `Modifica sala` apre direttamente la sala selezionata: rimosso il picker sovrapposto alla mappa.
- Durante la conferma elimina-sala restano soltanto `Sì`/`No`: `Annulla` e `Salva` del form sono nascosti.
- Test di regressione: `servizioA1Fixes.test.tsx` (`@admin-blindatura: servizio-a1`). Nessuna modifica a
  assegnazioni, finestre, walk-in, D25, DB o Edge.

### 9.3 Fix post-QA A2 — coerenza dati e runtime

- **Refresh Servizio:** `useAcceptedBookingsForDate`, `useTableAssignments` e `useUnassignedBookings`
  refetchano sempre al mount; le mutation booking condivise invalidano anche `TABLE_ASSIGNMENTS_QUERY_KEY`
  (no-op in Classic).
- **Assegnabilità:** l'elenco da assegnare resta basato su booking `accepted` + data/fascia + assenza di
  assignment attivo; tipologia, menu, card e carosello non filtrano mai.
- **Multi-assignment:** la mappa rende tutte le assegnazioni attive dello stesso tavolo, ordinate per turno.
  I tavoli occupati restano visibili ma non sono droppable: niente sovrapposizione diretta; serve la
  liberazione anticipata separata.
- **Walk-in con tavolo:** `useWalkInMutation` inserisce booking + assignment nella fascia attiva; se
  l'insert assignment fallisce o supera `max_turns`, il booking viene marcato `deleted` con motivo tecnico
  e le query booking/assignment vengono invalidate. Nessuna migrazione/RPC introdotta.
- **Stati temporali:** `useTableStatuses` ha clock runtime ogni 30s; i test possono ancora iniettare
  `nowOverride`.
- **Briefing:** il filtro turno legge le `service_slots` reali, inclusi slot overnight; il modal mostra
  `Tutti` + fasce tenant, non più pranzo/cena hardcoded.
- **D38:** nuovo setting `table_mode_respects_slot_cap`, default `false`. In modalità tavoli OFF usa la
  capienza fisica dei tavoli; ON usa il minore tra capienza fisica e cap fascia configurato.
