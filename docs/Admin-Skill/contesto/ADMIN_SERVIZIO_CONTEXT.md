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
- Delete sala e bloccato lato UI se contiene tavoli.
- Tavolo richiede capienza intera > 0; sala obbligatoria se esistono sale.
- Drag mappa disabilitato sotto 768px.
- Slot supportano overnight; `max_turns=0` indica servizio chiuso.
- Walk-in usa limite default 20 se setting assente; registry ammette 0..500, modal richiede 1..max.
- **Guard modifiche non salvate (FU-023, M6 12-06-26):** modali sala/tavolo/fascia (`RoomConfigModal`, `TableFormModal`, `SlotModal` in `ServiceSlotsManager`) e card `WalkInLimitCard` usano `DiscardChangesConfirmModal` + `UnsavedChangesContext` (sorgenti `servizio-room-modal`, `servizio-table-modal`, `servizio-slot-modal`, `servizio-walk-in-limit`). Chiusura X/overlay/Annulla con form dirty → conferma in-app; navigazione sidebar Pro bloccata finché dirty. Pattern: `CustomerFormModal` / `MenuQrModal`. Test: `servizioModalsGuard.adminBlindatura.test.tsx`.
- **Riordino fasce in Pro (19-06-26):** `ServiceSlotsManager` ora ha frecce Su/Giù su ogni fascia (`SlotControls`). Click → `persistSlotOrder()` chiama `updateSlot.mutateAsync` per ogni fascia con `display_order = indice-posizione` e `skipToast:true`. Prima/ultima fascia disabilita rispettiva freccia. Pattern display_order = indice array (identico a Classic). Nessuna migrazione. Test: `serviceSlotsMoveOrder.servizioBlindatura.test.tsx`. ⚠️ Nuove fasce create da Pro ricevevano sempre `display_order:0` — `persistSlotOrder` normalizza automaticamente.

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
- Briefing non mostra sala/tavolo: `useShiftBriefing` ha TODO join.

## 7. Test critici futuri

- Assegnazione tavolo con conflitto stesso turno.
- Walk-in su tavolo occupato.
- Slot chiuso/override specifico.
- Mobile mappa read-only.
- Briefing con e senza prenotazioni.
