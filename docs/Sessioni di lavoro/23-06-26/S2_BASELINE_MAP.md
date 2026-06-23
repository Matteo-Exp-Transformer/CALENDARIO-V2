# S2 — Baseline Map (Motore durata / resolver)

> **Prodotto da:** Fase 1 MAPPA (read-only) — esecutore Sonnet 4.6, 23-06-26.
> **Branch:** `env/test` (stato post-S1, non committato).
> **Input:** `MASTERPLAN_SERVIZIO.md` §2/3/7, `S2_PLAN.md`, `S1_HANDOFF.md`.
> **Prossimo step:** Fase 2 INTERVISTA (orchestratore + Matteo) → chiudere Q-S2-1..7.

---

## A — Libreria e tipi S1 (stato post-S1)

Tutti i tipi prodotti da S1 sono **confermati presenti e corretti**.

### `src/features/booking/constants/bookingDurationLimits.ts` ✅
- `BOOKING_DURATION_MIN = 30`, `BOOKING_DURATION_MAX = 360`
- `parseBookingDuration(value: unknown): number | undefined` — clamp+int, ritorna undefined se fuori range
- `clampBookingDuration(value: number | undefined): number | undefined` — stesso risultato, firma diversa (API)
- Il resolver S2 si appoggia a entrambe (già importabili).

### `src/features/booking/constants/bookingPublicFormConfig.ts` ✅
- `SubTab.duration?: number` (riga 374) — durata card, opzionale
- `BookingMode.default_duration?: number` (riga 490) — gradino 3 gerarchia (tipologia)
- `parseSubTabFromUnknown`: chiama `parseBookingDuration(o.duration)` (riga 574) ✅
- `normalizeBookingPublicFormConfig`: chiama `clampBookingDuration(tab.duration)` (riga 819)
  e `clampBookingDuration(rawDefaultDuration)` per `BookingMode` (riga 858) ✅

### `src/features/booking/constants/presetMenus.ts` ✅
- `CustomStaffPreset.default_duration?: number` (riga 75) — gradino 2 gerarchia (preset)
- Nessuna UI preset in S1 (solo tipo+parser). L'eredità card→preset è dormiente fino a S2/S3.

### `src/features/booking/lib/` — ESISTE ✅
Contenuto attuale:
```
src/features/booking/lib/restaurantSettingRegistry.ts   ← Zod + parser registry
src/features/booking/lib/scrollIntoCenter.ts            ← helper UI (non rilevante)
src/features/booking/lib/__tests__/                     ← 5 file test
```
- `restaurantSettingRegistry.ts`: Zod schema `CustomStaffPreset` include
  `default_duration: z.number().int().min(30).max(360).optional()` (riga 235);
  parser difensivo righe 252-262 e 686-689. ✅
- **`resolveBookingDuration.ts` NON esiste** → da creare in questa cartella (Q-S2-1 chiuso).

---

## B — Schema DB attuale

### service_slots (Row attuale — `src/types/database.ts` riga 1077)

| Colonna | Tipo DB | Note |
|---|---|---|
| id | string | PK |
| tenant_id | string | FK organizations |
| name | string | |
| start_time | string | HH:MM:SS |
| end_time | string | HH:MM:SS |
| max_guests | number \| null | cap coperti per-fascia |
| max_turns | number \| null | 0 = servizio chiuso (D41) |
| max_turns_resume | number \| null | migration 023 |
| display_order | number | |
| is_canonical | boolean | managed DB (migration 016) |
| slot_color | string \| null | presente in DB, assente nel tipo hook (gap §D) |
| created_at | string | |
| updated_at | string | |

**Colonne ASSENTI da aggiungere in S2:**
- `min_duration integer` nullable — pavimento durata fascia (CHECK >= 0 OR NULL)
- `turnover_buffer_minutes integer` — buffer pulizia/turnover (D37); default da decidere (Q-S2-5)

### booking_requests (Row attuale — `src/types/database.ts` riga 84)

Campi rilevanti per lo snapshot S2:

| Colonna | Tipo DB | Note |
|---|---|---|
| confirmed_start | string \| null | oggi settato manualmente dall'admin |
| confirmed_end | string \| null | oggi settato manualmente dall'admin |
| desired_date | string | YYYY-MM-DD |
| desired_time | string \| null | |
| booking_type | string \| null | es. `"tavolo"` |
| menu_selection | Json \| null | snapshot menù (pattern da replicare per durata) |
| status | string | pending/accepted/rejected/cancelled |
| admin_notes | string \| null | aggiunto da migration 056 |
| (altri ~20 campi) | | |

**Campi snapshot ASSENTI da aggiungere in S2:**
- `duration_minutes integer` nullable — durata risolta congelata
- `duration_source text` nullable — quale livello ha vinto
- `duration_rule_version integer` nullable — versione regola (debug futuro)

I campi completi del parere §6.4 (`occupancy_start/end`, `applied_slot_min_duration`, ecc.)
arrivano in S3/S4 — non in S2.

### Ultime migrazioni rilevanti

| File | Cosa fa |
|---|---|
| `056_booking_admin_notes.sql` | Aggiunge `admin_notes text` a `booking_requests` (ultima su questa tabella) |
| `055_unsubscribe_tokens.sql` | Tabella `unsubscribe_tokens` |
| `054_dietary_consent.sql` | Campi consenso alimentare |
| `053_marketing_consent.sql` | Campi consenso marketing |
| `025_rls_service_slots_classic.sql` | **Ultima su `service_slots`**: apre RLS a tutte le edition (non tocca colonne) |
| `023_service_slots_max_turns_resume.sql` | Aggiunge `max_turns_resume` a `service_slots` |

Numeri successivi disponibili: a partire da `057_*`. Precedente schema `service_slots` = migration
025 (solo RLS, nessuna colonna aggiunta). Struttura colonne = migration 010 base + 023.

---

## C — Edge create-booking (`supabase/functions/create-booking/index.ts`)

### Come vengono letti service_slots oggi

Riga ~413-417:
```ts
const { data: slotsRows } = await supabaseAdmin
  .from("service_slots")
  .select("id, name, start_time, end_time, max_guests, display_order")
  .eq("tenant_id", orgId)
  .order("display_order");
```
**Campi selezionati:** `id, name, start_time, end_time, max_guests, display_order`.  
**Assenti dalla select:** `min_duration`, `turnover_buffer_minutes`, `max_turns`, `is_canonical`.  
→ Quando S2 aggiunge `min_duration`, la select va estesa qui (in S3 al momento del cablaggio).

### Come viene calcolato max_guests / slot_limit (righe ~369-502)

```
(slotLimitEnabled || rejectOutOfSlot) && timeSlotsEnabled
  → legge service_slots
  → matchedSlot = prima fascia che contiene desired_time
  → cap = ovMaxGuests ?? matchedSlot.max_guests ?? slotGuestCapacities[matchedSlot.id] ?? null
  → occupied = somma num_guests delle prenotazioni accepted del giorno che coprono la fascia
  → if (occupied + num_guests > cap) → 409 SLOT_LIMIT
```
La guard legge `restaurant_settings` con 4 chiavi (righe 373-382):
`booking_time_slots_enabled`, `slot_limit_enabled`, `booking_reject_out_of_slot`, `slot_guest_capacities`.

**Non legge** `booking_public_form_config` (la config con `default_duration` delle tipologie e delle card).
→ Problema da risolvere in S3 quando si cabla il resolver nell'Edge (vedi Q-S2-7).

### Riferimenti a durata nell'Edge

**Nessuno.** L'Edge non legge né scrive `duration_minutes`.  
`confirmed_start/confirmed_end` non vengono scritti al momento dell'insert pubblico
(assenti da `insertData` righe 561-588): vengono settati solo dall'admin dopo.

### Riga approssimativa per inserimento del resolver (in S3)

Tra la fine del "Slot availability guard" (~riga 503) e "Insert booking request" (~riga 505):
```ts
// [S3] resolveBookingDuration() → snapshot duration_minutes/source/rule_version
// (richiede lettura aggiuntiva di booking_public_form_config da restaurant_settings)
```

---

## D — Hooks che leggono service_slots

### ServiceSlot type (`useServiceSlots.ts:12-27`)

| Campo | Tipo | Note |
|---|---|---|
| id | string | |
| tenant_id | string | |
| name | string | |
| start_time | string | |
| end_time | string | |
| max_turns | number \| null | 0 = chiuso (`isServiceSlotClosed`) |
| max_turns_resume | number \| null | |
| max_guests | number \| null | |
| display_order | number | |
| is_canonical | boolean | |
| created_at | string | |
| updated_at | string | |

**Assenti nel tipo hook:** `min_duration`, `turnover_buffer_minutes`, `slot_color`.  
`slot_color` è in DB Row ma non nel tipo hook — gap preesistente (non blocca S2).  
`min_duration` / `turnover_buffer_minutes` vanno aggiunti dopo le migrazioni S2.

### `useCapacityCheck.ts` — come usa service_slots

- Usa `useServiceSlots()` (riga 44) per leggere `svcSlot.max_guests` e confrontare con gli override.
- `getSlotCap` (righe 60-73): priorità `override → svcSlot.max_guests → slot_guest_capacities[slot.id]`.
- Conta occupazione da `confirmed_start/confirmed_end` delle prenotazioni accepted (righe 105-113).
- **`min_duration` non entra in `useCapacityCheck`**: il pavimento è responsabilità del resolver
  `resolveBookingDuration()`, non del check di capienza. I due calcoli sono ortogonali.

---

## E — Call sites resolver (grep)

### confirmed_start / confirmed_end — siti di SCRITTURA

| File | Righe | Contesto |
|---|---|---|
| `src/features/booking/hooks/useAdminBookingRequests.ts` | 59-60 | Accettazione prenotazione admin |
| `src/features/booking/hooks/useBookingMutations.ts` | 87-88 | Accettazione prenotazione |
| `src/features/booking/hooks/useBookingMutations.ts` | 210-211 | Update prenotazione |
| `src/features/booking/hooks/useBookingMutations.ts` | 390-391 | Update payload (cambio data/ora) |
| `src/features/booking/hooks/useBookingRequests.ts` | 211-212 | Update accepted booking |

**→ Questi sono i 5 punti di integrazione del resolver** (scrivono la prenotazione confermata):
il snapshot `duration_minutes/source/rule_version` va aggiunto agli stessi payload.
Hanno accesso al `booking_type` e (tramite `restaurant_settings`) ai `BookingMode`.

### confirmed_start / confirmed_end — siti di LETTURA (principali)

| File | Note |
|---|---|
| `src/features/booking/utils/capacityCalculator.ts` (90, 95-96, 126-127) | Calcolo occupazione per-fascia |
| `src/features/booking/hooks/useCapacityCheck.ts` (79, 105-107) | Capacity check |
| `src/features/booking/utils/bookingEventTransform.ts` (59, 84-85) | Transform eventi Calendario |
| `src/features/booking/hooks/useAnalytics.ts` (137, 158-160) | Analytics |
| `src/features/booking/utils/dateUtils.ts` (150-163) | Helper data/ora |
| `src/lib/shiftBriefingPdf.ts` (43) | Export PDF briefing |

Questi siti leggono ma non scrivono → non toccati da S2 (D15: storico intatto).

### default_duration — call sites

**Solo nei file prodotti da S1** — nessun callsite fuori dall'area S1:
- `bookingPublicFormConfig.ts` (righe 490, 854-871) — tipo + normalizer
- `presetMenus.ts` (riga 75) — tipo
- `restaurantSettingRegistry.ts` (righe 235, 252-262, 686-689) — Zod + parser
- `BookingFormConfigPanel.tsx` (righe 2010-2011) — UI DurationPicker
- Test `bookingPublicFormConfig.test.ts` (varie)

Confermato: nessun altro callsite. Il resolver S2 sarà il primo consumatore.

---

## F — Micro-decisioni per l'intervista (lista C)

Integrano o modificano Q-S2-1..5 del plan.

**Q-S2-1 — CHIUSA ✅**  
La cartella `src/features/booking/lib/` esiste già e contiene `restaurantSettingRegistry.ts`.
Il file `resolveBookingDuration.ts` va creato lì. Nessuna ambiguità di percorso.

**Q-S2-3 — APERTA (blocca la firma)**  
Il "5° gradino" (default ristorante) non esiste ancora come campo in `restaurant_settings`.
`restaurantSettingRegistry.ts` gestisce `default_duration` solo per i `CustomStaffPreset`,
non per il ristorante in senso globale. Tre opzioni:
- **A.** Nuovo setting `default_booking_duration_minutes` in `restaurant_settings` → richiede registry + UI.
- **B.** Usare `BookingMode.default_duration` della tipologia più generica (es. `tavolo`) come
  default implicito — ma non è "default ristorante", è default per quella tipologia.
- **C.** Omettere il 5° gradino da S2: se nessun livello ha durata → `undefined` → permanenza OFF
  (degrado D42 accettabile, retrocompatibile). Il 5° gradino è solo per L2-lite (Classic semplice)
  e può essere aggiunto in S3 insieme all'UI "Durata media unica" di Classic.
→ **Da decidere con Matteo** prima di scrivere la firma.

**Q-S2-4 — CONFERMATA ✅**  
Il cablaggio nell'Edge (deploy PROD) è rimandato a S3. S2 scrive solo il resolver puro.

**Q-S2-5 — CONFERMATA con dettaglio aggiuntivo ✅**  
`turnover_buffer_minutes` non compare nell'Edge né in `useCapacityCheck`.
Proposta confermata: aggiungere la colonna in S2 (migrazione insieme a `min_duration`),
non usarla nel resolver. **Dettaglio:** il default su DB può essere `0 NOT NULL`
(buffer zero = comportamento invariato, no nullable) oppure `integer nullable DEFAULT NULL`
(null = non configurato). La scelta impatta il tipo TypeScript generato.

**Q-S2-6 — NUOVA — Gap `slot_color` nel tipo hook**  
`slot_color string | null` è presente in `database.ts` Row ma assente in `ServiceSlot`
(hook `useServiceSlots.ts`). Non blocca S2 ma vale allinearlo mentre si aggiungono
`min_duration` e `turnover_buffer_minutes`. Proposta: allineare in S2 (una riga di tipo).

**Q-S2-7 — NUOVA — Come il resolver riceve la config tipologia nell'Edge**  
L'Edge non legge `booking_public_form_config` (la struttura JSONB con `BookingMode.default_duration`
e `SubTab.duration`). Per risolvere la gerarchia lato server in S3, il resolver ha bisogno
di quei valori. Due approcci:
- **A.** Il client invia già `duration_minutes` risolto nel payload della prenotazione
  (il form ha tutte le informazioni lato client). L'Edge lo riceve, lo valida, lo snappa.
  Semplice, ma l'Edge non valida la gerarchia → fiducia al client (ok finché è solo snapshot).
- **B.** L'Edge legge `booking_public_form_config` da `restaurant_settings`, risolve
  la gerarchia server-side (replica pura del resolver). Più robusto, un'altra query.
→ **Da decidere con Matteo** (impatta la firma del resolver e il payload Edge di S3).

---

## G — Fondamenta S2 (cosa costruire — lista B)

### 1. File nuovo: `src/features/booking/lib/resolveBookingDuration.ts`

Firma proposta (da confermare dopo chiusura Q-S2-3 e Q-S2-7):

```ts
export interface ResolveBookingDurationInput {
  override_admin_minutes?: number      // gradino 1 — assoluto
  card_duration?: number               // gradino 2 — SubTab.duration
  preset_default_duration?: number     // gradino 2b — CustomStaffPreset.default_duration
  booking_mode_default_duration?: number // gradino 3 — BookingMode.default_duration
  restaurant_default_duration?: number // gradino 4 — L2-lite (se confermato Q-S2-3)
  slot_min_duration?: number           // pavimento fascia — service_slots.min_duration
}

export type DurationSource =
  | 'admin_override'
  | 'card'
  | 'preset'
  | 'booking_mode'
  | 'restaurant_default'

export interface ResolvedDuration {
  duration_minutes: number
  source: DurationSource
  rule_version: number               // costante v1 per ora
}

export function resolveBookingDuration(
  input: ResolveBookingDurationInput,
): ResolvedDuration | undefined
```

Ritorna `undefined` se nessun livello ha durata (→ permanenza OFF, D42).  
Puramente deterministica, zero effetti collaterali, zero import Supabase.

### 2. Migrazione `service_slots` (TEST → verifica → PROD con gate)

```sql
-- 057_service_slots_duration_buffer.sql  (nome provvisorio)
ALTER TABLE public.service_slots
  ADD COLUMN IF NOT EXISTS min_duration integer
    CHECK (min_duration IS NULL OR min_duration >= 0);

ALTER TABLE public.service_slots
  ADD COLUMN IF NOT EXISTS turnover_buffer_minutes integer
    -- default 0 o NULL: da decidere (Q-S2-5)
    NOT NULL DEFAULT 0
    CHECK (turnover_buffer_minutes >= 0);
```
GRANT: eredita dalla tabella (RLS migration 025 copre già le policy per tenant).

### 3. Migrazione `booking_requests` snapshot (TEST → verifica → PROD con gate)

```sql
-- 058_booking_requests_duration_snapshot.sql  (nome provvisorio)
ALTER TABLE public.booking_requests
  ADD COLUMN IF NOT EXISTS duration_minutes integer,
  ADD COLUMN IF NOT EXISTS duration_source text,
  ADD COLUMN IF NOT EXISTS duration_rule_version integer;
```
Nullable: retrocompatibili, prenotazioni esistenti hanno NULL (= permanenza OFF, D15 rispettato).  
GRANT: nessuno nuovo necessario (stessa logica di migration 056).

### 4. Update tipo `ServiceSlot` in `useServiceSlots.ts`

```ts
export interface ServiceSlot {
  // ... campi esistenti ...
  slot_color: string | null        // gap preesistente da allineare (Q-S2-6)
  min_duration: number | null      // nuova colonna S2
  turnover_buffer_minutes: number | null  // nuova colonna S2 (o number se NOT NULL)
}
```

### 5. Rigenera `src/types/database.ts`

```bash
npm run db:types:linked
```
Dopo la migrazione su TEST, il tipo `service_slots.Row` e `booking_requests.Row` si aggiornano
automaticamente. Verificare che `min_duration`, `turnover_buffer_minutes`, `duration_minutes`,
`duration_source`, `duration_rule_version` compaiano.

### 6. Test unit: `src/features/booking/lib/__tests__/resolveBookingDuration.test.ts`

Casi obbligatori (da `MASTERPLAN_SERVIZIO.md` §10):
- Override admin → vince sempre (gradino 1)
- Card con durata → vince sulla tipologia, anche se più corta (D35)
- Card senza durata + tipologia → usa tipologia (gradino 3)
- Nessuna durata → `undefined` (permanenza OFF)
- Pavimento fascia: `MAX(resolved, slot_min_duration, BOOKING_DURATION_MIN)`
- Preset eredita se card non ha durata (gradino 2b)
- Card < tipologia → card vince (D35, invariante esplicito)

---

*Prodotto 23-06-26 — esecutore Sonnet 4.6. Fase 1 MAPPA completata.*
*Prossimo: Fase 2 INTERVISTA — orchestratore chiude Q-S2-3, Q-S2-6, Q-S2-7 con Matteo.*
