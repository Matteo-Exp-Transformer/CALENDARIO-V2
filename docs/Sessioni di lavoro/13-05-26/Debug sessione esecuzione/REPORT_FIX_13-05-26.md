# Report fix — sessione 13-05-2026

Tutti i fix derivano dal documento di handoff `AGENT_POST_DEBUG_HANDOFF.md`.
Typecheck: ✅ 0 errori. Test: ✅ 29/29 passati.

---

## P1 — Servizio: tavoli sempre in "Senza sala" (bug root cause)

**Problema:** `useCreateTable` e `useUpdateTable` non includevano `room_id` nell'`INSERT`/`UPDATE`.
Il modal `TableFormModal` usava solo la stringa `placement` (nome sala), non l'id.

**File modificati:**
- `src/features/booking/hooks/useServizioTables.ts` — aggiunto `room_id` in insert e update; `TableInput.room_id` reso obbligatorio.
- `src/features/booking/components/servizio/TableFormModal.tsx` — riscritta la prop API: riceve `rooms: Room[]` + `defaultRoomId` invece di `placements: string[]`. Il select lavora su `room_id`; `placement` viene derivato dal nome della sala selezionata. Tavolo senza sala bloccato: pulsante disabilitato se `rooms.length === 0`.
- `src/pages/ServizioPage.tsx` — `ModalState` usa `room_id` invece di `placement`; `openAdd` passa `room.id`; la mappa passa `selectedRoom.id`; il `TableFormModal` riceve `rooms={rooms}`.

---

## P1/P5 — RoomTabs: bottone "Modifica sale" con picker a dropdown

**Prima:** un solo pulsante con icona ingranaggio che configurava la sala corrente.
**Dopo:** bottone "Modifica sale" con freccia che apre un dropdown con l'elenco di tutte le sale. Al click su una sala si apre il `RoomConfigModal` per quella sala specifica.

**File modificati:**
- `src/features/booking/components/servizio/RoomTabs.tsx` — aggiunto stato `pickerOpen`, `useRef` per click-outside, dropdown con lista sale.

---

## P2 — Walk-in: selezione sala + tavolo libero

**Prima:** il modal walk-in non mostrava sale né tavoli.
**Dopo:** sequenza sala → tavolo; i tavoli occupati (prenotazione accepted con `confirmed_start ≤ now < confirmed_end`) sono disabilitati con etichetta "— occupato". La logica di occupazione è client-side su `useAcceptedBookings`.

Il tavolo selezionato viene salvato nel campo `placement` di `booking_requests` (compatibile senza migrazione DB).

**File modificati:**
- `src/features/booking/components/home/WalkInModal.tsx` — aggiunta selezione sala/tavolo, logica `isBusy`, integrazione `useRestaurantSetting('walk_in_max_guests')`.
- `src/features/booking/hooks/useWalkInMutation.ts` — aggiunta prop `placement` in `WalkInInput` e nel payload insert.

---

## P2 — Impostazioni: limite coperti walk-in configurabile

**Prima:** il limite era hardcoded a 20 nel modal walk-in.
**Dopo:** `walk_in_max_guests` è una chiave persistita in `restaurant_settings`, modificabile dalla sezione impostazioni anagrafica. Default 20, range 1–200.

**File modificati:**
- `src/features/booking/lib/restaurantSettingRegistry.ts` — aggiunta chiave `walk_in_max_guests` in `RESTAURANT_SETTING_KEYS_V1`, `RestaurantSettingValueMap`, e voce del registry con parse/serialize/validate.
- `src/features/booking/components/RestaurantSettingsTab.tsx` — aggiunta query `walkInMaxGuestsQuery`, state `walkInMaxGuests`, hydration nell'`useEffect`, campo input nella UI (dopo "Limite coperti giornaliero"), salvataggio nel blocco `upsert.mutateAsync`.

---

## P3 — Calendario: icona walk-in, no-show nascosti, no no-show su walk-in

**Icona walk-in:**
`DigestBookingTypeIcon` controlla `booking.source === 'walk_in'` prima delle altre tipologie e restituisce `<UserRound>` (omino stilizzato).

**No-show nascosti dal calendario:**
- Gli eventi FullCalendar usano `visibleBookings = bookings.filter(b => !b.no_show)` — i no-show rimangono in DB per gli analytics ma non appaiono nel calendario né nel digest.
- Il calcolo della capacità giornaliera e il digest usano `status === 'accepted' && !b.no_show`.

**No-show bloccato per i walk-in:**
`canMarkNoShow` in `BookingDetailsModal` aggiunge la condizione `booking.source !== 'walk_in'` — il pulsante "No-show" non appare mai su un walk-in.

**File modificati:**
- `src/features/booking/components/BookingCalendar.tsx` — import `UserRound`, logica icona, filtro `!no_show` su eventi e digest.
- `src/features/booking/components/BookingDetailsModal.tsx` — condizione `source !== 'walk_in'` in `canMarkNoShow`.

---

## P4 — Analytics: range calendario reale + pulsanti centrati

**Prima:** range `7d` / `30d` con finestre rolling (es. "ultimi 7 giorni da oggi").  
**Dopo:** range `week` / `month` / `year` con periodi di calendario precisi:
- **Settimana** = lunedì–domenica della settimana corrente (ISO week start = lunedì).
- **Mese** = primo–ultimo giorno del mese corrente.
- **Anno** = 1 gennaio–31 dicembre dell'anno corrente.

Il delta di confronto usa il periodo precedente dello stesso tipo (settimana scorsa / mese scorso / anno scorso).

I pulsanti di selezione sono centrati con `justify-center`; il toggle turno è spostato a destra del titolo.

**File modificati:**
- `src/features/booking/hooks/useAnalytics.ts` — `DateRange` rinominato in `'week' | 'month' | 'year'`; `getCurrentPeriodBounds` e `getPreviousPeriodBounds` usano `date-fns` (`startOfWeek`, `endOfWeek`, `startOfMonth`, `endOfMonth`, `startOfYear`, `endOfYear`); `computeAnalytics` riceve i bounds espliciti invece di calcolarli internamente.
- `src/pages/AnalyticsPage.tsx` — default `'month'`, pulsanti centrati con etichette "Settimana / Mese / Anno", layout header ristrutturato.
- `src/features/booking/components/analytics/AnalyticsTrendChart.tsx` — aggiornato `interval` X-axis per i nuovi range (month→2, year→29, week→0).

---

## Note tecniche

- Nessuna migrazione DB necessaria: il tavolo walk-in usa `placement` (già esistente).
- `BookingType` non include `'walk_in'` — la discriminazione walk-in usa sempre `source === 'walk_in'`.
- I warning Tailwind del linter (`flex-shrink-0` → `shrink-0` ecc.) sono pre-esistenti e non bloccanti.
