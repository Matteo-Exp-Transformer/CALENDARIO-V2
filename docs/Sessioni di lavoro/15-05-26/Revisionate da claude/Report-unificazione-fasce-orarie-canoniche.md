# Report sessione — Unificazione fasce orarie canoniche

**Data**: 2026-05-15
**Branch**: `Sviluppo-Dashboard-laterale`
**Validate finale**: 86 test passati, lint e typecheck puliti

---

## Cosa è stato fatto

### 1. Migrazione DB (016_service_slots_canonical.sql)
Aggiunta colonna `is_canonical BOOLEAN NOT NULL DEFAULT false` alla tabella `service_slots`. Le 3 fasce `Colazione`, `Pranzo`, `Cena` sono state marcate come canoniche sia sulle righe esistenti che nel trigger di signup per i nuovi tenant. Applicata prima sul DB di test (sessione precedente), poi sul DB di **produzione** via MCP Supabase in questa sessione.

### 2. Adapter toBookingTimeSlots()
Creato in `src/features/booking/utils/bookingTimeSlots.ts`. Converte le fasce canoniche dal formato DB nel formato `BookingTimeSlots` usato da calendario, calcolo capienza e richieste pending. Prima questo formato veniva letto dal JSON `booking_time_slots` in `restaurant_settings` — ora ha un'unica fonte di verità nel DB.

### 3. Hook useCanonicalTimeSlots()
Aggiunto in `src/features/booking/hooks/useServiceSlots.ts`. Condivide la stessa TanStack Query di `useServiceSlots` (stessa query key = nessuna chiamata DB aggiuntiva), filtra `is_canonical = true`, e restituisce il formato `BookingTimeSlots` già pronto. È l'unico punto da cui tutti i componenti devono leggere le fasce.

### 4. Componenti aggiornati per leggere dalle canoniche
- **BookingCalendar**: usa `useCanonicalTimeSlots()` invece di `JSON.parse(booking_time_slots)`
- **useCapacityCheck**: idem — il calcolo dei posti disponibili per fascia ora legge dal DB
- **PendingRequestsTab**: idem — l'assegnazione delle richieste pending alla fascia corretta ora è stabile
- **BookingDetailsModal**: idem — il display della fascia nella modale di dettaglio ora è coerente

### 5. RestaurantSettingsTab aggiornato
Il tab Impostazioni ora legge e scrive le fasce canoniche direttamente (nomi dinamici Colazione/Pranzo/Cena invece di label hardcoded). Aggiunto avviso visivo per le fasce con orario notturno (es. Cena che finisce dopo mezzanotte).

### 6. Cast as any rimossi da useServiceSlots
Dopo applicazione della migrazione in produzione e rigenerazione di `src/types/database.ts`, rimossi i due cast temporanei `(supabase.from('service_slots') as any)` in `useCreateServiceSlot` e `useUpdateServiceSlot`. Il typecheck ora è pulito senza workaround.

---

## Flusso utente reale

**Prima**: Luigi apre Impostazioni e cambia l'orario della fascia Cena. Ma quando torna al Calendario, i blocchi orari del calendario continuano a mostrare l'orario vecchio — perché calendario e impostazioni leggevano da due fonti diverse (una dal DB, una dal JSON in `restaurant_settings`).

**Dopo**: Luigi aggiorna la fascia Cena in Impostazioni. Tornando al Calendario vede subito i blocchi aggiornati — perché entrambi leggono dalla stessa tabella `service_slots`, dati canonici.

---

## File toccati

| File | Motivo |
|------|--------|
| `supabase/migrations/016_service_slots_canonical.sql` | Nuova migrazione |
| `src/features/booking/utils/bookingTimeSlots.ts` | Adapter toBookingTimeSlots() |
| `src/features/booking/hooks/useServiceSlots.ts` | useCanonicalTimeSlots() + cast as any rimossi |
| `src/features/booking/components/BookingCalendar.tsx` | Legge canoniche |
| `src/features/booking/hooks/useCapacityCheck.ts` | Legge canoniche |
| `src/features/booking/components/PendingRequestsTab.tsx` | Legge canoniche |
| `src/features/booking/components/BookingDetailsModal.tsx` | Legge canoniche |
| `src/features/booking/components/RestaurantSettingsTab.tsx` | Legge/scrive canoniche |
| `src/types/database.ts` | Rigenerato — include is_canonical |

---

## Test eseguiti

`npm run validate` → **86 test passati**, 0 errori lint, 0 errori typecheck.

---

## Skill aggiornati

- `docs/Database-Skill/DB_MIGRATIONS_CONTEXT.md` — aggiunta riga 016
- `docs/Database-Skill/DB_SCHEMA_CONTEXT.md` — aggiunta sezione tabella service_slots con is_canonical

---

---

## Seconda parte sessione — Gating fasce orarie per edition + coperti massimi per fascia

### 7. Fasce orarie nascoste da Impostazioni locale in Pro/Enterprise

La sezione "Imposta Fasce Orarie" in `RestaurantSettingsTab` era visibile anche per i tenant Pro, dove non ha senso — le fasce si gestiscono da Servizio. Aggiunto `useFeatures()` nel componente e gating `{!features.servizio && ...}` attorno alla sezione. Classic continua a vederla normalmente.

### 8. Migrazione 017 — colonna max_guests su service_slots

Aggiunta colonna `max_guests INTEGER DEFAULT NULL` a `service_slots`. Applicata al DB produzione via MCP. `src/types/database.ts` rigenerato — nessun cast `as any` necessario.

### 9. Campo "Coperti massimi" in ServiceSlotsManager (Pro/Enterprise)

In Servizio → Fasce orarie, ogni fascia ora ha il campo "Coperti massimi per fascia" (opzionale). Vuoto = nessun limite. Il valore viene salvato in `service_slots.max_guests`.

- `SlotRow` mostra il badge viola con l'icona persone quando il limite è impostato
- La modal mostra un avviso blu che spiega che le prenotazioni oltre il limite verranno rifiutate
- Dopo il salvataggio con cambio `max_guests`, compare un toast specifico: "Limite coperti per 'Cena' impostato a 30" (o "rimosso" se azzerato)

### Flusso utente

Luigi (Pro) apre Impostazioni locale: non vede più la sezione Fasce Orarie. Va in Servizio, apre la fascia "Cena", imposta 30 coperti massimi. Da quel momento le richieste di prenotazione che superano la capienza disponibile vengono rifiutate dal sistema (attraverso `useCapacityCheck` che già legge `slot_guest_capacities` — l'integrazione con `max_guests` è il prossimo passo).

Mario (Classic) apre Impostazioni locale: vede la sezione Fasce Orarie come prima.

### File toccati (seconda parte)

| File | Motivo |
|------|--------|
| `supabase/migrations/017_service_slots_max_guests.sql` | Nuova migrazione |
| `src/types/database.ts` | Rigenerato — include max_guests |
| `src/features/booking/hooks/useServiceSlots.ts` | Aggiunto max_guests a ServiceSlot |
| `src/features/booking/components/RestaurantSettingsTab.tsx` | Gating !features.servizio sulla sezione fasce |
| `src/features/booking/components/servizio/ServiceSlotsManager.tsx` | Campo max_guests, badge, avviso, toast specifico |

### Validate finale (seconda parte)

`npm run validate` → **86 test passati**, 0 errori lint, 0 errori typecheck.

---

## Terza parte sessione — Fix bug schema cache PostgREST per max_guests

### Problema

Dopo il deploy della migrazione 017 (`max_guests`), salvare una fascia oraria con il campo coperti compilato restituiva:

> `Could not find the 'max_guests' column of 'service_slots' in the schema cache`

Il DB aveva la colonna, ma PostgREST su Supabase cloud mantiene una schema cache in memoria separata da Postgres. `pg_notify('pgrst', 'reload schema')` non è garantito su cloud — il processo PostgREST potrebbe non essere sullo stesso host di Postgres.

### Fix

Migrazione 018: due RPC `SECURITY DEFINER` che scrivono direttamente in SQL, bypassando il layer REST e la sua schema cache:

- `insert_service_slot(...)` — sostituisce `.insert()` in `useCreateServiceSlot`
- `update_service_slot(...)` — sostituisce `.update()` in `useUpdateServiceSlot`

L'`update_service_slot` usa **semantica PATCH** (`COALESCE`): i parametri passati come `NULL` mantengono il valore esistente nel DB. Questo è fondamentale perché `RestaurantSettingsTab` chiama la stessa mutation passando solo `start_time` e `end_time` — senza PATCH semantics, i campi `name`, `max_guests`, `max_turns` sarebbero stati azzerati.

Il parametro `p_clear_max_guests BOOLEAN` gestisce il caso in cui l'utente vuole **rimuovere** il limite coperti: `null` in SQL è ambiguo (potrebbe significare "non cambiare"), quindi si usa un flag esplicito.

### File toccati (terza parte)

| File | Motivo |
|------|--------|
| `supabase/migrations/018_rpc_update_service_slot.sql` | Nuove RPC insert/update |
| `src/features/booking/hooks/useServiceSlots.ts` | Mutation migrate a RPC; cast as any temporanei fino a regen tipi |

### Validate finale (terza parte)

`npm run validate` → **86 test passati**, 0 errori lint, 0 errori typecheck.

---

## Cosa resta

- Rigenerare `src/types/database.ts` dopo che la CLI riconosce le RPC 018 → rimuovere i cast `as any` temporanei in `useServiceSlots.ts` (righe ~61 e ~97).
- Integrare `service_slots.max_guests` in `useCapacityCheck` come limite per fascia (oggi usa ancora `slot_guest_capacities` da `restaurant_settings`). La colonna è nel DB e nel tipo, manca solo la lettura nel hook.
- Il JSON `booking_time_slots` in `restaurant_settings` è deprecato come fonte dati — può essere rimosso in futuro.
