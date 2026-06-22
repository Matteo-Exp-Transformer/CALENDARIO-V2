# SERVIZIO_BASELINE_MAP — Mappatura AS-IS pagina Servizio (22-06-26)

> **Scopo:** Azione 2 di S0. Mappa read-only dell'esistente prima di costruire S1–S4.
> Nessuna modifica al codice in questo documento.
> Branch: `s0/servizio-baseline` (da `env/test`)
>
> **Legenda colonne:**
> - **FUNZIONA (riuso)** — solido, da tenere AS-IS
> - **DA RISCRIVERE / STRUTTURARE** — confuso o fragile ma vivo
> - **PUÒ ROMPERSI** — accoppiamenti e rischi (collegati ai rischi #1–#9 del masterplan)

---

## 1. COMPONENTI

### `src/pages/ServizioPage.tsx`

| # | FUNZIONA (riuso) | DA RISCRIVERE / STRUTTURARE | PUÒ ROMPERSI |
|---|---|---|---|
| 1 | Toggle Lista/Mappa con state locale — semplice e corretto | — | — |
| 2 | `useEffect` auto-select prima sala (+ reset se sala eliminata) — robusto | — | — |
| 3 | `TableCard` con confirm-delete in-riga — pattern già consolidato | — | — |
| 4 | Sezione "Senza sala" (tavoli orfani `room_id null` o sala eliminata) — difesa corretto | — | — |
| 5 | `tablesInSelectedRoom` passato a `RoomConfigModal.tableCount` per soft-block delete — corretto | — | — |
| 6 | `WalkInLimitCard` condizionato su `features.walkIn` — corretto | — | — |
| 7 | — | — | `AssignmentMapPanel` renderizzato **senza guard `features.tableAssignments`** (riga 332) → rischio #7 del masterplan; debito S4/D10 |
| 8 | — | — | `isLoading = loadingTables \|\| loadingRooms` — se uno dei due fallisce in modo silenzioso (nessun `error` ma dati vuoti), la UI mostra lista vuota senza avviso |
| 9 | `ServiceSlotsManager` mostrato in entrambe le view (lista e mappa) — design corretto | — | — |

---

### `src/features/booking/components/servizio/TableShape.tsx`

| # | FUNZIONA (riuso) | DA RISCRIVERE / STRUTTURARE | PUÒ ROMPERSI |
|---|---|---|---|
| 1 | Drag&Drop via `@dnd-kit/core` (`useDraggable`), `CSS.Translate`, `isDragging` guard | — | — |
| 2 | Click protetto da `isDragging` — evita apertura modal dopo drag | — | — |
| 3 | A11y: `role="button"`, `aria-label`, `onKeyDown` Enter/Space | — | — |
| 4 | Troncamento nome > 8 char con `…` nella SVG | — | — |
| 5 | Prop `dragDisabled` passata dall'alto (mobile) | — | — |
| 6 | — | `fillColor = '#4ade80'` e `strokeColor = '#16a34a'` **hardcoded** — tavoli sempre verdi. TODO esplicito nel codice: "collegare a `useTableStatuses` in fase F4". Questo è il punto di innesto per S4 | — |
| 7 | — | Nessuna prop `status` nel componente — quando arriverà `useTableStatuses` (S4/D24), TableShape dovrà ricevere uno stato (`libero / in arrivo / occupato / in uscita / in ritardo`) e mapparlo a colori | rischio #7 (FU-TABLE-1) |

---

### `src/features/booking/components/servizio/TableMap.tsx`

| # | FUNZIONA (riuso) | DA RISCRIVERE / STRUTTURARE | PUÒ ROMPERSI |
|---|---|---|---|
| 1 | `DndContext` con `PointerSensor` (activation distance 5px — evita click accidentali) | — | — |
| 2 | Mobile detection via `matchMedia('(max-width: 768px)')` con listener `change` (cleanup corretto) | — | — |
| 3 | `snapToGrid(10px)` in `handleDragEnd` — snap a griglia | — | — |
| 4 | Banner "Solo visualizzazione" su mobile | — | — |
| 5 | `Math.max(0, ...)` — impedisce posizioni negative | — | — |
| 6 | Griglia CSS 20px come sfondo visivo (puro CSS, non logica) | — | — |
| 7 | — | `debouncedUpdate` ritorna `isPending` ma **non viene usato in TableMap** — nessun feedback visivo "salvataggio posizione in corso"; il drag può sembrare perduto se la rete è lenta | — |
| 8 | — | — | `room.width / room.height` = larghezza canvas: se vecchi record pre-validazione hanno valori anomali (es. 0), il canvas collassa. `RoomConfigModal` valida min 200 ora, ma vecchi record sono immuni |

---

### `src/features/booking/components/servizio/RoomTabs.tsx`

| # | FUNZIONA (riuso) | DA RISCRIVERE / STRUTTURARE | PUÒ ROMPERSI |
|---|---|---|---|
| 1 | Tab overflow-x-auto — scorre su mobile senza rompere layout | — | — |
| 2 | Dropdown "Modifica sale" con chiude-su-click-fuori (pattern `pickerRef` + `mousedown`) | — | — |
| 3 | Pulsante "Nuova sala" separato dal picker modifica | — | — |
| 4 | — | `display_order` della sala è un **campo numerico manuale** (admin deve digitarlo) — non c'è riordino drag-drop come `ServiceSlotsManager`. Non è un bug, ma crea UX asimmetrica. Candidato a future frecce Su/Giù come per le fasce | — |

---

### `src/features/booking/components/servizio/AssignmentMapPanel.tsx`

| # | FUNZIONA (riuso) | DA RISCRIVERE / STRUTTURARE | PUÒ ROMPERSI |
|---|---|---|---|
| 1 | DnD drag-from-prenotazioni / drop-on-tavolo — flusso principale funzionante | — | — |
| 2 | `DroppableTable` con stati visivi free/assigned/checked_out (colori + badge) | — | — |
| 3 | Checkout con doppia conferma ("Liberare?") | — | — |
| 4 | Selettore data + fascia come filtro — corretto | — | — |
| 5 | `bookingsById` via `useMemo` — ottimizzazione lookup prenotazioni | — | — |
| 6 | — | `TableStatus = 'free' \| 'assigned' \| 'checked_out'` — solo 3 stati. D24 introduce 5 stati: `libero / in arrivo / occupato / in uscita / in ritardo`. Tutta la logica `STATUS_CLASSES` / `STATUS_LABEL` dovrà essere riscritta per S4 | rischio #4 (doppia verità), FU-TABLE-1 |
| 7 | — | — | Renderizzato **senza guard `features.tableAssignments`** (da `ServizioPage.tsx:332`) → rischio #7/D10 |
| 8 | — | — | `useUnassignedBookings` esegue **2 query DB sequenziali** (booking_requests poi booking_table_assignments) senza lock → race condition: una nuova assegnazione tra le due query può far apparire la stessa prenotazione sia "da assegnare" che "già assegnata" |
| 9 | — | — | Nessun tavolo "orfano" (room_id null) viene mostrato nel panel — se un tavolo è senza sala, non è assegnabile dall'AssignmentMapPanel |

---

### `src/features/booking/components/servizio/TableFormModal.tsx`

| # | FUNZIONA (riuso) | DA RISCRIVERE / STRUTTURARE | PUÒ ROMPERSI |
|---|---|---|---|
| 1 | Unsaved changes guard (`UnsavedChangesContext`, `DiscardChangesConfirmModal`) — pattern consolidato | — | — |
| 2 | Validazione: nome obbligatorio, capienza > 0 intero, sala valida | — | — |
| 3 | `defaultRoomId` preseleziona sala al click "Aggiungi tavolo in questa sala" | — | — |
| 4 | Avviso "Crea prima una sala" se `rooms.length === 0` | — | — |
| 5 | — | `placement: selectedRoom?.name ?? ''` (riga 143) — **radice del mismatch walk-in (rischio #6)**: `placement` viene settato al nome della sala, non al nome del tavolo né all'id. `WalkInModal.isBusy()` confronta `b.placement` con `tableId` (UUID) → sempre false | rischio #6 |
| 6 | — | Nessun campo `shape` nell'UI del TableFormModal — la forma del tavolo (round/square/rect) non è modificabile dopo la creazione. Solo il DB ha il default (`round`?). Non è chiaro come l'utente cambia la forma | Domanda per Matteo |
| 7 | — | — | Se `rooms` si svuota mentre il modal è aperto (sala eliminata da un'altra scheda), `roomId` rimane un id non più valido; la validazione lo blocca correttamente, ma il feedback non è chiaro |

---

### `src/features/booking/components/servizio/RoomConfigModal.tsx`

| # | FUNZIONA (riuso) | DA RISCRIVERE / STRUTTURARE | PUÒ ROMPERSI |
|---|---|---|---|
| 1 | CRUD sala con unsaved changes guard — pattern consolidato | — | — |
| 2 | Soft-block delete (`tableCount > 0` → errore in-form, nessuna azione) | — | — |
| 3 | Validazione dimensioni 200–2000px per larghezza e altezza | — | — |
| 4 | Delete con conferma in-riga ("Eliminare? Sì / No") | — | — |
| 5 | — | — | DELETE sala = fisico (non soft). ON DELETE SET NULL sui tavoli garantito dal DB (documentato in `useRooms.ts:149`). Ma i record `booking_table_assignments` per i tavoli di quella sala **non vengono puliti** → ghost assignments in S4 |

---

### `src/features/booking/components/servizio/WalkInLimitCard.tsx`

| # | FUNZIONA (riuso) | DA RISCRIVERE / STRUTTURARE | PUÒ ROMPERSI |
|---|---|---|---|
| 1 | Legge/scrive `restaurant_settings.walk_in_max_guests` — pattern corretto | — | — |
| 2 | Unsaved changes guard integrato — pattern consolidato | — | — |
| 3 | Range di validazione UI 0–500 (campo `max` sul `<Input>`) | — | — |
| 4 | Condizionato su `features.walkIn` in ServizioPage — corretto | — | — |

---

### `src/features/booking/components/servizio/ServiceSlotsManager.tsx`

| # | FUNZIONA (riuso) | DA RISCRIVERE / STRUTTURARE | PUÒ ROMPERSI |
|---|---|---|---|
| 1 | CRUD fasce: create/update/delete con toast e invalidazione query | — | — |
| 2 | Override system completo: scope forever/today/week/month/custom, `MultiDayPicker`, alert preview, alert overlap | — | — |
| 3 | `isServiceSlotClosed(slot)` + toggle chiudi/riapri con `max_turns_resume` — semantica corretta (D41) | — | — |
| 4 | Riordino con frecce Su/Giù (`persistSlotOrder` via `updateSlot.mutateAsync` in parallelo) | — | — |
| 5 | `SlotRow` → riga semplice se no override, `CollapsibleCard` con `OverrideList` se ci sono override attivi | — | — |
| 6 | `ActiveTodayBadge` + `resolveSlotOverride` per evidenziare "vince oggi" | — | — |
| 7 | `MultiDayPicker`: date passate non selezionabili, navigazione mese, griglia correttamente L→D (0=lun) | — | — |
| 8 | `isSlotOutsideBusinessHours()` con alert amber — avviso non bloccante | — | — |
| 9 | — | `persistSlotOrder` esegue N `mutateAsync` in parallelo (Promise.all) — **nessun rollback se uno fallisce**: l'ordine nel DB può corrupts parzialmente. Accettabile ora (rischio basso, worst case = riordino perso), ma da risolvere prima di S4 | — |
| 10 | — | Nessun campo `min_duration` né `arrival_step` nel form — da aggiungere in S2 (D18) e S3 | Fondamenta dati per S2/S3 |
| 11 | — | — | Salvataggio "Per sempre" su una fascia esistente sovrascrive i valori base **senza lasciare storico** — se poi si vuole tornare indietro, non c'è un "undo" |
| 12 | `SlotModal` ha `key={editing?.id ?? 'new-slot'}` — smonta/rimonta il modal ad ogni apertura → state pulito | — | — |

---

### `src/features/booking/components/home/WalkInModal.tsx`

| # | FUNZIONA (riuso) | DA RISCRIVERE / STRUTTURARE | PUÒ ROMPERSI |
|---|---|---|---|
| 1 | Form con selezione sala → tavoli filtrati per sala | — | — |
| 2 | Validazione max_guests letto da setting reale (`useRestaurantSetting`) — default 20 se mancante | — | — |
| 3 | Tavoli "occupati" mostrati come disabilitati nel `<select>` | — | — |
| 4 | — | **BUG `isBusy()` (riga 19):** `b.placement !== tableId` confronta nome-stringa con UUID → **sempre false** → nessun tavolo è mai marcato "occupato" nel form walk-in. La sezione `tablesInRoom` include tutti i tavoli come selezionabili anche se fisicamente occupati (rischio #6) | rischio #6 |
| 5 | — | `walkIn.mutate` salva `placement: selectedTable?.name` (nome del tavolo) ma **non `table_id`** — il link reale al record `tables` è perso nel DB. Condizionato a `input.placement ? { placement } : {}` | rischio #6 |

---

### `src/features/booking/components/home/ShiftBriefingModal.tsx`

| # | FUNZIONA (riuso) | DA RISCRIVERE / STRUTTURARE | PUÒ ROMPERSI |
|---|---|---|---|
| 1 | Tabella prenotazioni oggi ordinate per orario con totali | — | — |
| 2 | Filtro pranzo/cena/tutto via `ShiftToggle` + `getShiftRanges` | — | — |
| 3 | Print (`window.print()`) + Download PDF (`generateBriefingPdf`) | — | — |
| 4 | — | `table_name: null` e `room_name: null` hardcoded in `useShiftBriefing.ts:80-81` — la tabella del briefing **non mostra mai sala/tavolo** assegnato. Il TODO è esplicito nel codice (riga 85). La colonna "Tavolo" non esiste nel template UI | Fondamenta: join da fare in S4 |
| 5 | — | `businessHoursRaw` prop accettata ma il caller `HomePage` la passa senza garanzia di formato — se struttura diversa da atteso, `getShiftRanges()` cade sui default | basso rischio (default sensato) |

---

## 2. HOOK

### `src/features/booking/hooks/useServizioTables.ts`

| # | FUNZIONA (riuso) | DA RISCRIVERE / STRUTTURARE | PUÒ ROMPERSI |
|---|---|---|---|
| 1 | CRUD completo con toast, invalidazione query key `[TABLES_QUERY_KEY, tenantId]` | — | — |
| 2 | Soft-delete (`active=false`) — non perde la history | — | — |
| 3 | `useUpdateTablePosition()` con debounce 300ms via `useRef<ReturnType<typeof setTimeout>>` — nessun re-render inutile | — | — |
| 4 | `staleTime: 5 min` — riduce refetch inutili | — | — |
| 5 | — | Campo `rotation` nel tipo `RestaurantTable` e nel DB — **non usato da nessuna UI** (candidato codice morto, vedi lista A) | — |
| 6 | — | `position_x/y` non sono inclusi nel payload di `useCreateTable` → nuovi tavoli creano sempre a 0,0. Questo è corretto (il drag li sposta), ma non c'è protezione se 0,0 coincide con un tavolo già posizionato lì | — |
| 7 | — | — | Tavoli soft-deleted (`active=false`) → i loro `booking_table_assignments` restano in DB. In S4, `getTableStatus()` filtrerà su `table_id` e potrebbe trovare assignment per tavoli "eliminati" → ghost data |

---

### `src/features/booking/hooks/useRooms.ts`

| # | FUNZIONA (riuso) | DA RISCRIVERE / STRUTTURARE | PUÒ ROMPERSI |
|---|---|---|---|
| 1 | CRUD con on-delete che invalida anche `TABLES_QUERY_KEY` — corretto | — | — |
| 2 | Ordine per `display_order` poi `name` — deterministico | — | — |
| 3 | — | DELETE sala = fisico (non soft) — cascade DB su `tables.room_id` (SET NULL). I `booking_table_assignments` per i tavoli della sala eliminata **non vengono mai puliti** (cascade non arriva fin là) | ghost data in S4 |

---

### `src/features/booking/hooks/useServiceSlots.ts`

| # | FUNZIONA (riuso) | DA RISCRIVERE / STRUTTURARE | PUÒ ROMPERSI |
|---|---|---|---|
| 1 | RPC `insert_service_slot` / `update_service_slot` con JSONB — immune a PGRST202 | — | — |
| 2 | `isServiceSlotClosed()` — semantica `max_turns=0` (D41) | — | — |
| 3 | `useDigestSlotConfigs()` riusa la stessa query senza extra DB call | — | — |
| 4 | `skipToast` flag per update silenziosi (riordino) | — | — |
| 5 | — | Tipo `ServiceSlot` **manca `min_duration`** e **manca `arrival_step`** — campi da aggiungere in S2 (D18) per il motore durata e intervalli di arrivo | Fondamenta dati S2/S3 |
| 6 | — | `useCreateServiceSlot`: `p_max_turns` castato a `number` anche quando `null` → se il form manda `null`, il cast potrebbe diventare `0` (chiuso) invece di `null` (illimitato). Va verificato il comportamento della RPC | potenziale bug latente |

---

### `src/features/booking/hooks/useServiceSlotOverrides.ts`

| # | FUNZIONA (riuso) | DA RISCRIVERE / STRUTTURARE | PUÒ ROMPERSI |
|---|---|---|---|
| 1 | `resolveSlotOverride()` — "vince il più specifico" (span più corto, a parità il più recente): **logica corretta e testabile** | — | — |
| 2 | `resolveScopeDateRange()` — from/to per today/week/month | — | — |
| 3 | `classifyOverrideScope()` — riconosce il tipo da record esistente | — | — |
| 4 | `findActiveOverrideOfScope()` — impedisce duplicati per stesso scope | — | — |
| 5 | `getActiveOverrides()` — tutti gli override ancora attivi (date_to ≥ oggi) | — | — |
| 6 | `hasActiveOverride()` — singolo override più imminente | — | — |
| 7 | RPC `insert_service_slot_override` JSONB — immune PGRST202 | — | — |
| 8 | `useDeleteServiceSlotOverride()` usa DELETE diretto (RLS admin_delete_slot_overrides copre già) | — | — |
| 9 | — | **Questa logica è client-side** — D8 richiede di replicarla server-side nell'Edge (`resolveOverrideMaxGuests` in `create-booking`) per farla valere alle prenotazioni pubbliche. La replica server-side è già stata fatta per il fix S0 (azione 1, branch `s0/edge-override-fix`). Questa versione client resta la fonte di verità per la UI | da sincronizzare se cambia la logica |

---

### `src/features/booking/hooks/useTableAssignments.ts`

| # | FUNZIONA (riuso) | DA RISCRIVERE / STRUTTURARE | PUÒ ROMPERSI |
|---|---|---|---|
| 1 | `getTableStatus()` per 3 stati attuali (free/assigned/checked_out) | — | — |
| 2 | `useTableAssignments(date)` — query per data | — | — |
| 3 | `useAssignBookingToTable()` — calcola `turn_number` come `max(existing) + 1`, controlla `maxTurns` | — | — |
| 4 | `useCheckoutTable()` — libera assignment con turn_number più basso; se `hasWaitingNextTurnOnTable` → UPDATE `checked_out_at`, altrimenti DELETE | — | — |
| 5 | `useReleaseBookingAssignment()` — per riassegnazione da Calendario; blocca se c'è turno successivo in attesa | — | — |
| 6 | `filterBookingsOnDate()` — usa `confirmed_start.slice(0,10)` se presente, else `desired_date` | — | — |
| 7 | — | `getTableStatus()` restituisce solo 3 stati vs 5 futuri (D24): dovrà essere esteso in S4 con: `in_arrivo` (prenotazione accepted ma `confirmed_start` > now), `in_uscita` (checkout fisico non ancora confermato), `in_ritardo` (confirmed_start scaduto) | Fondamenta S4 |
| 8 | — | Semantica DELETE vs UPDATE `checked_out_at` **inconsistente**: turno non-finale (c'è un prossimo) → UPDATE; turno finale → DELETE fisico. In S4 con `table_session` (D26), tutto dovrà diventare append-only con `checked_out_at` | Da uniformare in S4 |
| 9 | — | — | `useUnassignedBookings` esegue 2 query DB sequenziali senza transazione → race condition se assegnazione avviene tra le due (rischio #9/D40) |
| 10 | — | — | `filterBookingsOnDate()`: se `confirmed_start` e `desired_date` sono entrambi null → la prenotazione sparisce dalla lista ("invisibile" in AssignmentMapPanel). Non è un bug in produzione (accepted ha sempre confirmed_start) ma è un edge case da documentare |

---

### `src/features/booking/hooks/useWalkInMutation.ts`

| # | FUNZIONA (riuso) | DA RISCRIVERE / STRUTTURARE | PUÒ ROMPERSI |
|---|---|---|---|
| 1 | `createBookingDateTime()` — evita UTC shift, allineato al resto dell'admin | — | — |
| 2 | Invalida query `bookings`, `bookings/accepted`, `HOME_STATS`, `ANALYTICS` | — | — |
| 3 | `status: 'accepted'`, `source: 'walk_in'` — corretto | — | — |
| 4 | — | **Durata 90 min hardcoded** (`endAt = now + 90 * 60 * 1000`) — in S2 andrà sostituito con `resolveBookingDuration()` per usare la durata configurata | Fondamenta S2 |
| 5 | — | `placement: selectedTable?.name` (nome, non id) e nessun `table_id` — il walk-in non è linkato al record `tables`. Accoppiato al bug `isBusy()` di WalkInModal | rischio #6 |

---

### `src/features/booking/hooks/useShiftBriefing.ts`

| # | FUNZIONA (riuso) | DA RISCRIVERE / STRUTTURARE | PUÒ ROMPERSI |
|---|---|---|---|
| 1 | Query prenotazioni oggi `accepted` non `no_show`, ordinate per `confirmed_start` | — | — |
| 2 | `getShiftRanges(businessHoursRaw)` per filtro pranzo/cena — con fallback defaults | — | — |
| 3 | Totali `totalBookings` e `totalCovers` calcolati client-side | — | — |
| 4 | — | `table_name: null` / `room_name: null` hardcoded — TODO esplicito riga 85: join con `tables` mancante. La feature "briefing con sala/tavolo" non è ancora implementata | Fondamenta S4 |
| 5 | — | Filtro turno per `getHours()` della data ISO — sensibile al fuso: `new Date(row.confirmed_start).getHours()` usa il fuso locale del browser. Su server o CI con UTC diverso, il filtro pranzo/cena darebbe risultati sbagliati | rischio basso (solo UI admin, non Edge) |

---

## A. CANDIDATI CODICE MORTO

> ⚠️ Solo CANDIDATI con prova. NON cancellare nulla ora. Per ognuno: rischio di rimozione e come verificarlo.

| # | Candidato | Dove | Prova che sembra morto | Rischio rimozione | Come verificare |
|---|---|---|---|---|---|
| A1 | Campo `rotation` su `RestaurantTable` | `useServizioTables.ts` tipo (riga 21) + colonna DB | Nessuna UI lo mostra, nessun componente lo legge o lo scrive. Non è nel payload di create né update. Solo nel tipo e nel `select('*')` | **Basso** — solo tipo e select, nessuna logica | `grep -r "rotation" src/` per trovare tutti i riferimenti; verificare che la colonna DB esista (`tables.rotation`) e che nessuna migrazione futura ne dipenda |
| A2 | `fillColor`/`strokeColor` hardcoded in `TableShape.tsx` (righe 35–36) | `src/features/booking/components/servizio/TableShape.tsx` | Non è un candidato a rimozione (è codice vivo), ma è il **segnaposto** per `useTableStatuses` — l'unico modo per attivare i colori di stato è passare una prop `status` e mappare colori. Il TODO è esplicito | **N/A — da NON rimuovere**, da ESTENDERE in S4 | — |
| A3 | `useReleaseBookingAssignment()` in `useTableAssignments.ts` | `src/features/booking/hooks/useTableAssignments.ts:276` | Funzione esportata per "riassegnazione rapida da Calendario" — verificare se il Calendario la usa effettivamente | **Medio** — se non usata, è codice che porta semantica BLOCK non ancora integrata | `grep -r "useReleaseBookingAssignment" src/` — trovare il caller; se nessuno la importa è dead export |
| A4 | Prop `businessHoursRaw` in `ShiftBriefingModal` | `src/features/booking/components/home/ShiftBriefingModal.tsx:16` | La prop è solo forwarded a `useShiftBriefing` e usata per `getShiftRanges()`; ma se il caller non la passa (o la passa come `undefined`), si usano i defaults — verificare se il valore reale viene mai passato | **Basso** | Trovare il punto che apre `ShiftBriefingModal` e verificare che `businessHoursRaw` sia popolato correttamente |
| A5 | `togglingClosedId` state in `ServiceSlotsManager` | `src/features/booking/components/servizio/ServiceSlotsManager.tsx:1250` | Usato per `isTogglingClosed={togglingClosedId === slot.id && updateSlot.isPending}` — logica corretta e viva. **Non morto**, da NON rimuovere | **N/A** | — |
| A6 | `display_order` manuale su `Room` (campo nel modal) | `src/features/booking/components/servizio/RoomConfigModal.tsx:45,154` | Il campo esiste nell'UI ma l'utente deve sapere che 0/1/2/... = ordine. Non c'è riordino automatico. Se l'ordine per `name` fosse sufficiente, questo campo sarebbe inutile | **Medio** — rimuovere il campo UI non rimuove la colonna DB, solo semplifica il form | Chiedere a Matteo se il riordino manuale sale è usato o se basta ordine alfabetico (domanda C2) |
| A7 | `slotCrossesMidnight` re-exportato da `useServiceSlots.ts` (riga 11) | `src/features/booking/hooks/useServiceSlots.ts:11` | `export { slotCrossesMidnight }` — verificare se è importato da qualcuno via `useServiceSlots` o solo da `bookingTimeSlots` direttamente | **Basso** | `grep -r "slotCrossesMidnight" src/` per trovare tutti i caller |

---

## B. FONDAMENTA DATI PER S1–S4

> Solo ANNOTAZIONI. Nessuna colonna, nessuna migrazione, nessun codice.

| # | Fondamenta | Dove andrà (tabella/colonna/hook) | Per quale sotto-area | Decisione |
|---|---|---|---|---|
| B1 | **`min_duration`** per fascia | `service_slots.min_duration` (nuova colonna) + `ServiceSlot` tipo | S2 — motore durata | D18: pavimento durata per fascia |
| B2 | **`arrival_step`** per fascia (step intervalli arrivo) | `service_slots.arrival_step` (nuova colonna) + `ServiceSlot` tipo | S3 — intervalli di arrivo | D18: step per-fascia con default unico |
| B3 | **`duration` su card** (SubTab/CustomStaffPreset) | `staff_preset_menus.duration_minutes` o `sub_tabs.duration_minutes` (nuova colonna) | S1 — tipologia prenotazione | Q7 risolto (Matteo 22-06-26): durata vive sulla card con eredità dal preset linkato |
| B4 | **Snapshot prenotazione** (durata congelata) | `booking_requests.duration_minutes`, `occupancy_start`, `occupancy_end`, `duration_source`, `duration_rule_version`, `applied_slot_min_duration`, `capacity_mode_used` | S2 — snapshot (D14, parere §6.4) | Congelate alla creazione, non ricalcolate |
| B5 | **`turnover_buffer_minutes`** per fascia o per tenant | `service_slots.turnover_buffer` (colonna) o `restaurant_settings.turnover_buffer_default` | S4 — motore tavoli (D37) | Default 0 Classic / 10 Pro con tavoli |
| B6 | **`table_session`** (sessione per turno) | Nuova tabella `table_sessions` (turno separato dal tavolo) | S4-LIVE — conto per sessione (D26, D39) | Predisporre per multi-tavolo |
| B7 | **`table_id` su walk-in** | `booking_requests.table_id` (FK nullable su `tables`) | S4 — fix walk-in (rischio #6) | Il walk-in dovrà salvare l'id reale, non il nome |
| B8 | **Colonna `arrival_time`** sul booking | `booking_requests.arrival_time` (TIME) | S3 — per distinguere orario arrivo vs orario prenotazione | Quando `arrival_step` entra in gioco |
| B9 | **Join briefing → tavoli** | `useShiftBriefing.ts` + query `booking_table_assignments JOIN tables` | S4 — briefing con sala/tavolo (TODO codice riga 85) | Da fare quando gli assignment sono stabili |
| B10 | **5 stati tavolo** | `getTableStatus()` da estendere; `useTableStatuses` (nuovo hook FU-TABLE-1) | S4 — `libero/in_arrivo/occupato/in_uscita/in_ritardo` (D24) | `TableShape.tsx` è già predisposto (TODO commento riga 35) |

---

## C. DOMANDE PER MATTEO (intervista)

> Ambiguità non risolvibili dal codice. L'intervista reale avviene con questa lista come agenda.

| # | Domanda | Contesto | Impatto se non risposta |
|---|---|---|---|
| C1 | **Forma tavolo** — come l'admin cambia la forma (round/square/rect) dopo aver creato un tavolo? Non c'è campo nella UI di `TableFormModal`. Solo il drag nella mappa modifica posizione, non forma. La forma è configurabile o è sempre quella di default (round)? | `TableFormModal.tsx` non ha campo shape; `RestaurantTable.shape` esiste nel DB | Senza risposta, potremmo aggiungere il campo inutilmente o dimenticarlo |
| C2 | **Riordino sale** — l'ordine delle tab sala in `RoomTabs` è determinato da `display_order` (campo numerico manuale nel modal sala). Matteo lo usa? Basterebbero frecce Su/Giù come per le fasce, o l'ordine alfabetico è sufficiente? | `RoomConfigModal.tsx:45` espone il campo; `useRooms.ts` ordina per `display_order` poi `name` | Se non usato, semplificazione UX; se usato, è una feature esistente da blindare |
| C3 | **Walk-in senza tavolo** — se l'admin non configura sale/tavoli, WalkInModal mostra solo il campo "coperti" (senza sala/tavolo). Questo flusso è intenzionale e testato? L'assegnazione a un tavolo specifico è obbligatoria o opzionale? | `WalkInModal.tsx:63-68`: sala e tavolo richiesti solo se `rooms.length > 0` | Impatta se e come fixare il bug `isBusy()` del walk-in |
| C4 | **Checkout tavolo** — oggi il checkout fa DELETE fisico dell'assignment se è l'ultimo turno, o UPDATE `checked_out_at` se c'è un turno successivo. In S4 con `table_session`, si vuole che tutti i checkout lascino una traccia (append-only) o che il DELETE fisico resti per l'ultimo turno? | `useCheckoutTable.ts:229-241` | Determina se in S4 si uniforma tutto a UPDATE o si mantiene il DELETE |
| C5 | **AssignmentMapPanel e feature gate** — il panel di assegnazione prenotazioni→tavoli è visibile a tutti gli admin Pro o solo a chi ha `features.tableAssignments` attivo? Oggi è sempre visibile (senza guard) — è intenzionale per il periodo di test o è un bug? | `ServizioPage.tsx:332`: nessun guard su `features.tableAssignments`; D10 segna questo come debito S4 | Impatta se aggiungere il guard ora (S0) o aspettare S4 |
| C6 | **Rotazione tavolo** — il campo `rotation` esiste nel tipo `RestaurantTable` e nel DB (`tables.rotation`) ma non è esposto in nessuna UI. È una feature pianificata per S4 (rotazione grafica del tavolo sulla mappa) o è un residuo da rimuovere? | `useServizioTables.ts:21` | Basso: se residuo, si può rimuovere il campo dal tipo (non dal DB) |
| C7 | **Ghost assignments** — se si elimina una sala (fisicamente), i tavoli in quella sala diventano `room_id = null`. I loro `booking_table_assignments` storici restano in DB senza owner di sala. In S4 questa situazione deve essere gestita (es. banner "tavolo senza sala") o è accettabile come situazione mai verificabile in prod (perché si eliminano sale solo a setup)? | `useRooms.ts:128-158` + `useTableAssignments.ts` | Impatta query in S4 se si filtra per sala |
| C8 | **Briefing turni** — la colonna "Tavolo" nel briefing mostra `—` perché il join con `tables` non è implementato (TODO). In S4 quando aggiungiamo il join, la tabella del briefing dovrebbe mostrare anche la sala oltre al tavolo? O solo il nome tavolo è sufficiente? | `useShiftBriefing.ts:80-81`, `ShiftBriefingModal.tsx:62-65` | Impatta schema query S4 |

---

## NOTE FUORI SCOPE (debiti S4/D10 — solo annotati)

- **`useTableStatuses` mancante** (FU-TABLE-1): tavoli sempre verdi, nessun stato live. Annotato in `TableShape.tsx:35`. Da costruire in S4.
- **Mismatch walk-in `placement` vs `id`** (rischio #6): `isBusy()` in `WalkInModal` confronta nome con UUID → sempre false. Fix va in S4 insieme al `table_id` sul booking.
- **Guard `features.tableAssignments` su `AssignmentMapPanel`** (rischio #7): da aggiungere in S4 quando il feature gate è stabile.
- **Race condition `useUnassignedBookings`** (rischio #9): due query sequenziali senza lock. Mitigazione server-side in S4/D40.

---

*Documento prodotto in sessione 22-06-26. Branch `s0/servizio-baseline`. Nessun codice modificato.*
