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

### 9.4 Fix post-QA A3/A2-QA — operatività assegnazione

- **Assegnazione Tavoli fra schede:** query booking/assignment/unassigned in polling leggero ogni 15s
  (`SERVICE_ASSIGNMENTS_REFETCH_INTERVAL_MS`), senza realtime/S4-LIVE.
- **UX assegnazione:** select fascia mostra il conteggio prenotazioni da assegnare; drag con anteprima
  nome+coperti; ogni card ha azione `Assegna` per aprire modale rapida sala/tavolo; dopo assegnazione
  compare undo/conferma. **Undo (FIX-2):** DELETE fisico della riga appena creata — non consuma un
  turno e non archivia la prenotazione; non viola D48 (append-only sui turni realmente serviti).
- **Forzatura guidata:** tavolo occupato resta visibile ma non accetta drop silenzioso. Drop/click su tavolo
  occupato apre avviso esplicito `Libera e assegna`; la riga precedente viene timbrata `checked_out_at`, il
  nuovo assignment viene inserito con `forced_by_admin`/`force_reason`. Stesso schema per walk-in occupato
  con conferma in due passaggi. **FIX-2:** la conferma ambra chiude prima la modale «Assegna tavolo»
  (altrimenti restava sotto e sembrava un fallimento muto).
- **Briefing timezone:** orari in modal/PDF usano `desired_time`/ora a muro (`getAccurateStartTime`), non
  `format(new Date(confirmed_start))`.
- **Mobile:** editor/mappa configurazione nascosta sotto `md`; priorità alla lista/assegnazione operativa.

### 9.5 Post-QA 02-08-26 — fine turno, tavolate multi-tavolo, due viste mappa

> Tre richieste dirette di Matteo alla ripresa del cantiere. Solo client + test: nessuna
> migrazione, nessuna modifica all'Edge, nessuna scrittura DB nuova.

- **Avviso di fine turno con conferma staff (D22/D23).** La capienza si libera già da sola a fine
  finestra (`resolveOccupancy`): il tavolo però resta in stato `leaving` finché qualcuno conferma.
  Nuovo `TableReleaseNoticeModal`: si apre da solo quando uno o più tavoli entrano in "In uscita",
  elenca sala·tavolo, cliente, coperti e ora di fine turno (ora a muro via `getAccurateEndTime`,
  mai `new Date(confirmed_end)`). Tre risposte: **Libero** → `useCheckoutTable` (append-only,
  `checked_out_at`); **Ancora occupato** → nessuna scrittura, silenzia il tavolo; **Decido dopo** →
  mette da parte il gruppo. Il riaffiorare è governato da una *firma* dei tavoli pendenti
  (`pendingReleaseSignature`), non da un booleano: se entra in uscita un tavolo nuovo l'avviso
  ritorna, i già gestiti no. Cambio fascia/data azzera tutto.
- **Tavolate su più tavoli in UI (D39).** Nuovo `useAssignBookingToTables`: una prenotazione su N
  tavoli in **un solo insert** (turn_number calcolato per-tavolo sullo stesso snapshot; N chiamate
  sequenziali leggerebbero uno stato intermedio). La modale «Assegna tavolo» è a **selezione
  multipla** con contatore "posti selezionati su richiesti". Nuova sezione **«Assegnate»** nella
  colonna sinistra: una riga per prenotazione con tutti i suoi tavoli, posti totali, avviso
  «Mancano N posti» e azione **Aggiungi tavolo** (modale in modalità `add`, i tavoli già in
  tavolata risultano «Già in tavolata» e non riselezionabili). L'undo copre tutte le righe create.
- **Due viste della mappa.** `ServizioPage` tab Mappa ha il toggle **Servizio | Modifica**
  (default **Servizio**). *Servizio* = `AssignmentMapPanel layout="plan"` → nuovo `ServicePlanMap`:
  sala confermata, **nessuna griglia**, tavoli alle coordinate decise dall'admin (stessa impronta
  64px / 96px del `TableMap`, altrimenti lo staff non riconosce la sala), colore per stato,
  occupante e coperti dentro la sagoma, legenda dei 5 stati; click sul tavolo → dettaglio con
  «Libera tavolo». *Modifica* = `TableMap` di sempre (griglia, drag, CRUD). Le due viste **non
  convivono più**: prima si vedevano due mappe sovrapposte nella stessa schermata.
- **Stili stati condivisi:** `tableStatusStyles.ts` (STATUS_CLASSES / LABEL / BADGE / LEGEND_ORDER),
  usato da elenco, piantina e modale — prima erano duplicati in `AssignmentMapPanel`.
- **Test:** `AssignmentMapPanel.fineTurnoMultiTavolo.test.tsx` (8) e `ServizioPage.dueViste.test.tsx`
  (4). `npm run validate` verde: 144 file / 1198 test.

### 9.6 FIX-2 (02-08-26) — turni esauriti, archiviazione al checkout, forzatura visibile

> S4-BUG-2 + S4-REQ-3 + S4-UX-8. Client + migrazione `066_booking_requests_served_at.sql`.

- **Turni residui in UI (S4-BUG-2).** Il conteggio turni resta su **tutte** le righe (anche chiuse):
  un turno concluso ha consumato. Cambia la UI: nella modale «Assegna tavolo» ogni tavolo mostra i
  turni residui; a 0 compare badge **«Turni esauriti»** (non selezionabile in multi-select, ma
  forzabile di proposito → riquadro ambra). Util: `tableTurnLimits.ts`.
- **Fascia chiusa (`max_turns = 0`).** Errore distinto `FasciaChiusaError` («La fascia è chiusa:
  riaprila…»), toast + banner in modale — non più confuso con «Turni esauriti».
- **Undo = DELETE fisico.** Corregge un errore di pochi secondi: la riga sparisce e non conta come
  turno. D48 resta per i turni realmente serviti (checkout append-only).
- **Archiviazione al checkout (`served_at`, S4-REQ-3).** `booking_requests.served_at` valorizzato
  solo da `useCheckoutTable` quando non restano assegnazioni attive sulla stessa prenotazione
  (tavolata multi-tavolo: archivia all'ultimo tavolo). **Non** valorizzato da undo, «Libera e
  assegna», né release da Calendario. Riassegnazione → `served_at = null`. Filtro
  `filterUnassignedBookingsForSlot` esclude le servite.
- **Forzatura raggiungibile (S4-UX-8).** `openForceConfirm` chiude la modale prima di mostrare il
  riquadro ambra «Assegna comunque» / «Libera e assegna».
- **L'archiviazione non fa fallire il checkout.** `markBookingServedIfFullyReleased` **non lancia**:
  quando gira, `checked_out_at` è già scritto. Un throw salterebbe l'invalidate e la mappa mostrerebbe
  il tavolo ancora occupato pur essendo libero nel DB (sintomo reale con la mig. 066 non applicata:
  `PGRST204 … 'served_at' … schema cache`). Ritorna `{ archived: false }` → toast dedicato.
- **Test:** `tableTurnLimits.test.ts`, `useTableAssignments.fix2.test.ts` (4 casi archiviazione +
  undo + fascia chiusa + archiviazione fallita non bloccante), `AssignmentMapPanel.fix2.test.tsx`
  (UI turni + forzatura + layout testata).

### 9.7 Layout vista Servizio (02-08-26) — testata e sale a due colonne

> Solo UI, nessuna scrittura DB. Richiesta diretta di Matteo: «le sale occupano spazio».

- **Prenotazioni in testata, non in colonna.** In `layout="plan"` l'elenco «Prenotazioni (N)» e
  «Assegnate (N)» diventa una **striscia orizzontale** sopra la mappa (card `w-64 shrink-0`,
  `overflow-x-auto`). Prima era una colonna `md:w-1/3` che rubava un terzo di larghezza alla
  piantina e diventava alta ~2000px con 4 prenotazioni. `layout="grid"` (solo test) resta com'era.
- **Sale a due colonne.** `ServicePlanMap` mette le sale in `grid-cols-1 lg:grid-cols-2`.
- **Una sola sala sotto `lg`.** Da telefono/tablet due piantine affiancate sono illeggibili: si
  mostra **solo** la sala scelta nelle linguette (`RoomTabs`), le altre sono `hidden lg:block`.
  `selectedRoomId` scende `ServizioPage → AssignmentMapPanel → ServicePlanMap`. Se la sala scelta
  non ha tavoli si ripiega sulla prima con tavoli: il pannello non resta mai vuoto.
- **Test:** `ServicePlanMap.griglia.test.tsx` (5).
- **S4-FIX-4B/4C (02-08-26).** Le card della striscia mostrano l'ora di arrivo
  (`getAccurateStartTime`+`trimTimeToHHmm`, mai vuota/`--:--`). Lo scorrimento orizzontale non usa più
  la barra nativa: nuovo componente `BookingCardsStrip.tsx` (frecce solo se c'è overflow, disabilitate
  singolarmente a inizio/fine, `mode="list"` in `layout="grid"` = comportamento invariato). Dettaglio:
  [FIX_4BC_TESTATA.md](../../Sessioni%20di%20lavoro/02-08-26/E2E-Report/FIX_4BC_TESTATA.md).

### 9.8 S4-FIX-5 · S4-FIX-6 (02-08-26) — sostituzione guidata + divieto fasce accavallate

> Client + test soltanto: nessuna migrazione, nessuna scrittura DB nuova.

- **S4-FIX-5 — tavolo occupato, tre esiti invece di uno.** Il riquadro ambra su tavolo occupato non
  offre più la sola «Libera e assegna»: chiede allo staff cosa fare di chi è già seduto, senza scelta
  preselezionata. `useForceReplaceBookingOnTable` prende `outcome: 'move' | 'archive' | 'requeue'`
  (+ `targetTableId` per `move`):
  - **Sposta** — griglia dei tavoli liberi (riusa lo stile della modale «Assegna tavolo»); tre passi in
    ordine (insert su destinazione → delete dal conteso → insert della nuova prenotazione) così un
    fallimento a metà lascia comunque il trasferito assegnato da qualche parte. Il tavolo conteso non
    conta un turno per la sosta scavalcata.
  - **Archivia** — timbra `checked_out_at` (turno consumato) + `served_at` se non restano altri tavoli
    attivi sulla stessa prenotazione (riusa `markBookingServedIfFullyReleased`, come `useCheckoutTable`).
  - **In attesa** — **cambio di comportamento**: prima timbrava `checked_out_at` (consumava un turno);
    ora **cancella la riga** (DELETE fisico, stesso principio di `useUndoTableAssignment`) e non consuma
    un turno. È il comportamento pre-fix dell'unica scelta «Libera e assegna».
  «Conferma» resta spento finché non si sceglie un esito (e per «Sposta» finché non si sceglie anche il
  tavolo); senza tavoli liberi «Sposta» è spento con la spiegazione. Il ramo «Turni esauriti» (tavolo
  verde con turni finiti) non è toccato. Test: `useTableAssignments.sostituzioneGuidata.test.ts`,
  `AssignmentMapPanel.sostituzioneGuidata.test.tsx`; aggiornati `useTableAssignments.fix2.test.ts` e
  `.appendOnly.test.ts` per il nuovo comportamento di «in attesa».
- **S4-FIX-6 — una fascia non può accavallarsi su un'altra.** `ServiceSlotsManager` (editor fasce di
  Servizio) non validava le sovrapposizioni — a differenza di Impostazioni → Imposta Fasce Orarie, che
  le blocca da tempo con `validateSlotConfigs`. Il salvataggio del ramo «valore base» ora riusa
  `slotRangesOverlap` per confrontarsi con le altre fasce esistenti (esclusa se stessa in modifica);
  fasce adiacenti restano ammesse. Solo controllo app, nessun vincolo DB. Test:
  `serviceSlots.sovrapposizione.test.tsx`.
- **`npm run validate` verde: 151 file / 1247 test** (+3 file / +12 test rispetto a prima di questo fix).

### 9.9 FIX-4D (02-08-26) — sagome tavolo più grandi + ora di arrivo

> Solo UI, nessuna migrazione, nessuna scrittura DB. Richiesta diretta di Matteo: dentro la sagoma
> ci stavano a fatica nome tavolo, nome prenotazione e coperti.

- **Impronta condivisa in un modulo unico.** Le due costanti dimensione tavolo (prima duplicate
  separatamente in `ServicePlanMap.tsx` e `TableShape.tsx`, stesso valore copiato a mano) ora vivono
  in un solo file: `src/features/booking/components/servizio/tableShapeMetrics.ts` —
  `TABLE_SHAPE_SIZE` (tondo/quadrato) e `TABLE_SHAPE_SIZE_RECT_W` (rettangolare). Entrambe le viste
  (editor «Modifica» via `TableShape`, piantina «Servizio» via `ServicePlanMap`) importano da lì:
  un disallineamento fra le due non è più possibile per costruzione. Stesso pattern già usato per
  `tableStatusStyles.ts` in questa stessa cartella.
- **Misure**: 64px → **80px** (tondo/quadrato), 96px → **120px** (rettangolare) — entrambe multiple
  di 10px come lo snap di `TableMap.snapToGrid`, proporzione 2:3 invariata. Se l'admin ha disposto
  tavoli molto vicini in una sala esistente, con l'impronta più grande possono ora toccarsi/
  sovrapporsi leggermente — identico in entrambe le viste, quindi visibile e correggibile già
  nell'editor «Modifica» trascinando un tavolo qualche passo più in là.
- **Ora di arrivo nella sagoma.** Solo con un turno singolo attivo sul tavolo e orario noto:
  `getAccurateStartTime` + `trimTimeToHHmm` (mai `new Date(confirmed_start)`, stesso principio del
  resto dell'app — vedi §4b `CLAUDE.md`). Con più turni la sagoma mostra già «N turni» al posto del
  nome: in quel caso niente ora (sarebbe ambigua). Orario mancante → nessuna riga, mai `--:--`.
- **Test:** `ServicePlanMap.griglia.test.tsx` (+7: 2 sull'impronta condivisa fra le due viste, 3
  sull'ora di arrivo, oltre ai 5 preesistenti su griglia/visibilità sale). `TableShape.status.test.tsx`
  invariato (non dipendeva dalle misure).
- **`npm run validate`**: typecheck verde, `npm run test` full run **151 file / 1252 test verdi**
  (inclusi i test dell'altra corsia in corso su `AssignmentMapPanel.tsx`). `npm run lint` non verde
  al momento della chiusura per un file non tracciato (`BookingCardsStrip.tsx`) dell'altra corsia in
  scrittura in parallelo — non un difetto di questo fix (dettaglio in
  `docs/Sessioni di lavoro/02-08-26/E2E-Report/FIX_4D_TAVOLI_PIU_GRANDI.md`).

### 9.10 FIX-4A (02-08-26) — card "Assegnate" apribile, togli tavolo, lampeggio piantina

> S4 giro 4, ondata 2 (ultima corsia). Solo client + test: nessuna migrazione, nessuna scrittura di
> schema. Si cancellano solo righe di `booking_table_assignments` tramite l'hook esistente
> `useUndoTableAssignment`, mai nuova logica di scrittura.

- **Card "Assegnate" apribile (una alla volta).** Prima la card mostrava nome, ora, coperti e i nomi
  dei tavoli in una riga di testo senza altra azione che "Aggiungi tavolo". Ora un click sulla card
  la espande in luogo (non una modale) e mostra un tavolo per riga (`{sala ·} nome tavolo · posti` —
  il prefisso sala solo se il tenant ha più di una sala, stessa convenzione del Briefing D52). Stato
  `expandedGroupBookingId` in `AssignmentMapPanel`: un solo id, quindi una sola card aperta per
  costruzione — aprirne una seconda chiude la precedente da sola.
- **"Togli tavolo" — id di riga, non di tavolo.** Il memo `assignedGroups` ora porta, per ogni
  tavolo della tavolata, anche l'id della riga di assegnazione (`tableRows: {table, assignmentId}[]`
  al posto del vecchio `tables: RestaurantTable[]`). Se per lo stesso tavolo esistessero più righe
  attive per la stessa prenotazione (caso limite, non atteso nel flusso normale) si tiene la più
  recente per `created_at`.
- **Togliere ≠ liberare (scelta deliberata).** "Togli tavolo" chiama **`useUndoTableAssignment`**
  (DELETE fisico, non consuma turno, non archivia — stesso hook già usato da "Annulla" dopo
  un'assegnazione e da S4-FIX-5 per l'esito "in attesa"), **mai** `useCheckoutTable` (che
  timbrerebbe `checked_out_at`, consumerebbe un turno reale e potrebbe archiviare una prenotazione
  non ancora consumata). Se il tavolo tolto era l'ultimo della tavolata, il refetch già presente in
  `useUndoTableAssignment.onSuccess` (assignment + non-assegnate) fa ricomparire da solo la
  prenotazione fra quelle da assegnare — verificato leggendo il codice e con un test component-level
  che simula il dato post-refetch (nessun browser disponibile per una prova a video diretta).
- **Lampeggio tavoli in piantina.** Nuova prop opzionale `highlightedTableIds` su `ServicePlanMap` →
  `highlighted` su `PlanTable`, derivata (`useMemo`) dalla card aperta. Classe CSS statica
  `.servizio-table-highlight` in `index.css` (stesso pattern già in uso per
  `booking-public-field-attention-pulse`: animazione di default, contorno fisso sotto
  `prefers-reduced-motion: reduce`), colore `--color-primary-500` — stesso significato del
  `ring-2 ring-primary-500` già usato altrove nel pannello per "selezionato". Contorno sulla sagoma
  stessa (outline/box-shadow), nessun riquadro sovrapposto: non ruba click né interferisce col drop
  (`plan-table-<id>`). **Limite noto:** sotto 1024px si vede una sola sala per volta (§9.7); se la
  tavolata aperta ha tavoli nell'altra sala, il lampeggio è nel DOM ma non visibile finché lo staff
  non cambia linguetta — nessuna scorciatoia automatica di sala.
- **Test:** `AssignmentMapPanel.fix4a.test.tsx` (9: apertura/chiusura, una sola card aperta,
  rimozione con tavoli residui, rimozione dell'ultimo tavolo, annullamento-mai-checkout, lampeggio
  acceso/spento). `npm run validate` verde: **153 file / 1268 test**.

### 9.11 Servizio-UI FIX-1..FIX-7 (03-08-26) — layout pagina Servizio + tavolo su digest Home

> Round di lavoro indipendente da S4-FIX/FIX-4A-D (numerazione propria "Servizio-UI FIX-N", per non
> confondersi con S4-FIX-1..6 committati né con FIX-4A/4B/4C/4D di un'altra corsia). Solo client +
> test: nessuna migrazione, nessuna scrittura DB nuova.

- **FIX-1 — Fasce orarie chiusa di default.** `ServiceSlotsManager` (Lista e Mappa) è ora avvolto in
  un `CollapsibleCard` (uso, non modifica: LOCKED) `defaultExpanded={false}`, titolo "Fasce orarie".
  Le due viste sono rami JSX mutuamente esclusivi (mount/unmount al cambio vista): lo stato "chiuso"
  riparte da solo ogni volta, nessuna persistenza aggiuntiva serve. **Nota:** `ServiceSlotsManager`
  ha già una propria intestazione interna `<h2>Fasce orarie</h2>` + descrizione + "Aggiungi fascia"
  (invariata, non toccata): a card espansa il titolo compare quindi due volte (header collassabile +
  intestazione interna). Scelta deliberata per non toccare la logica/JSX interna del componente
  (fuori scope, rischio inutile su un file complesso) — costo puramente cosmetico, nessun impatto
  funzionale.
- **FIX-2 — Header: "Aggiungi sala" sempre visibile.** Il vecchio pulsante header "Aggiungi tavolo"
  (solo vista Lista, apriva `TableFormModal` senza sala) è sostituito da **"Aggiungi sala"** (apre
  `RoomConfigModal` in creazione), visibile **sia** in Lista **sia** in Mappa. Deviazione dal piano
  originale (gated `viewMode==='list'`): reso sempre visibile perché FIX-4 toglie "Nuova sala" da
  `RoomTabs` (solo Mappa) — se l'header restasse Lista-only, la vista Mappa perderebbe ogni modo di
  creare una sala. Vale il criterio guida "niente due CTA diverse per creare una sala".
- **FIX-3 — Walk-in sotto le fasce.** `WalkInLimitCard` non è più in cima alla pagina (comune alle
  due viste): ora c'è una copia sotto la `CollapsibleCard` "Fasce orarie" di Lista e una sotto quella
  di Mappa (rami JSX separati, serviva una copia per vista). Nessun cambio alla logica/guard interna.
- **FIX-4 — "Nuova sala" rimosso da `RoomTabs`.** Tolti pulsante e prop `onAddRoom` (interfaccia +
  call-site in `ServizioPage.tsx` + test `servizioA1Fixes.test.tsx`); resta solo "Modifica sala". La
  creazione sala passa solo dall'header (FIX-2). Testi residui "Nuova sala" aggiornati a "Aggiungi
  sala" in: stato-vuoto Lista/Mappa di `ServizioPage.tsx`, avviso blocco di `TableFormModal.tsx`
  ("crea prima una sala"), titolo modale `RoomConfigModal.tsx` in creazione (era "Nuova sala", ora
  "Aggiungi sala" — stesso testo usato dal guard modifiche-non-salvate). Aggiornato anche
  `e2e/pro/pro-service.spec.ts`.
- **FIX-5 — Piantina "Servizio" visibile anche senza fascia scelta.** `AssignmentMapPanel` con
  `layout="plan"` (usato da `ServizioPage` in mapMode `service`): prima, senza fascia selezionata,
  spariva tutto dietro il messaggio "Seleziona una fascia...". Ora la piantina (`ServicePlanMap`)
  resta **sempre visibile** quando c'è almeno una sala con tavoli (gestito già da `ServicePlanMap`
  stesso, non toccato) — passa gli stessi `statuses`/`bookingsByTable` calcolati incondizionatamente
  a monte (con `selectedSlotId===''` sono vuoti/tutto "libero", comportamento "spento" voluto, zero
  lavoro aggiuntivo sugli hook). Senza fascia: **niente** `DndContext` (niente drag&drop), **niente**
  striscia "Prenotazioni"/"Assegnate"; click su un tavolo apre comunque il dettaglio (mostra "Nessuna
  prenotazione su questo tavolo in questa fascia", innocuo, modale già esistente e incondizionata).
  Messaggio invariato nello spirito ma riformulato: "Seleziona una fascia per assegnare i tavoli e
  vedere le prenotazioni" — non nasconde più la sala sotto. `layout="grid"` (solo test) resta gated
  come prima, invariato. Fallback "sala senza tavoli → prima sala con tavoli" di `ServicePlanMap`
  non toccato. Test: `AssignmentMapPanel.piantinaSenzaFascia.test.tsx`.
- **FIX-6 — Digest Home/Calendario mostra il tavolo assegnato.** `BookingDigestCard` aveva una prop
  `assigned?: boolean` dichiarata ma mai usata (morta) — sostituita da `assignedTableNames?: string[]`:
  se presente e non vuota mostra un badge `Tavolo {nomi separati da ", "}` (variant `success`, sotto
  il nome cliente). `BookingCalendar.tsx` ora fa anche `useTables()` (stessa query key/cache di
  `useTableMode`, nessun fetch aggiuntivo) e costruisce `assignedTableNamesByBooking: Map<bookingId,
  string[]>` accanto al `useMemo` esistente `assignedBookingIds`, solo assignment con
  `checked_out_at === null`. Propagata attraverso i tre call-site che passavano `assigned={...}`:
  `DayServiceGroupCard` (×2, nuova prop `assignedTableNames?: Map<string,string[]>`) e la chiamata
  diretta a `BookingDigestCard` nel ramo "no fasce orarie". Se non assegnata: nessun badge (comportamento
  "DA ASSEGNARE" invariato). Refetch dopo assegnazione in Servizio: automatico, stessa query key
  `TABLE_ASSIGNMENTS_QUERY_KEY` già invalidata dalle mutation esistenti.
- **FIX-7 — Strip "Assegnate": niente più tavolo/posti duplicati, note e intolleranze.** In
  `AssignmentMapPanel.tsx`, riga sempre visibile della card (sotto il nome cliente): prima ripeteva
  `{coperti} · {tavoli} ({posti})`, duplicando l'elenco tavoli già mostrato nel dettaglio espandibile
  sotto. Ora mostra solo `{coperti} coperti`; se presenti, sotto: **note staff** (`booking.admin_notes`,
  stesso campo usato da `BookingDetailsModal`, sola lettura) e **intolleranze**
  (`dietaryRestrictionsToText(booking.dietary_restrictions)`, stesso helper già usato altrove — nessun
  nuovo storage), ordine note-poi-intolleranze; se entrambe assenti, nessuno spazio vuoto. L'avviso
  "Mancano N posti" (tavolata incompleta) resta invariato, non è la duplicazione rimossa. Nel dettaglio
  per-tavolo espandibile la riga ora è `{sala ·} Tavolo {nome} · {posti} posti` (prefisso "Tavolo"
  aggiunto prima del nome; prefisso sala solo se multi-sala, come già). Test:
  `AssignmentMapPanel.assegnateNoteTavolo.test.tsx`; aggiornato `AssignmentMapPanel.fineTurnoMultiTavolo.test.tsx`
  (asserzione sulla vecchia riga combinata).
- **`npm run validate` verde: 155 file / 1275 test** (build su working tree con FIX-4A/4B/4C/4D non
  committati di un'altra corsia).
