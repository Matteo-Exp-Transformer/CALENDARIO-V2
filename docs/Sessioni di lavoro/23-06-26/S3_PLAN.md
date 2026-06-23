# S3 — Plan: Intervalli di arrivo *(Classic — Prenota pubblico + Edge)*

> **Governato da:** `docs/MASTERPLAN_SERVIZIO.md` §7 (S3) + decisioni D2, D14, D16, D18, D19, D20, D21, D36, D40, D42.
> **Predecessore:** S2 ✅ chiusa (commit be12b73 — resolver + mig. 057/058 su TEST).
> **Stato:** ✅ implementazione S3 completata e verificata su TEST (23-06-26). Branch: `env/test`.
> **Mappa AS-IS:** `S3_BASELINE_MAP.md` in questa cartella.

## 0. Stato iniziale alla ripresa

Audit del working tree non committato, preservato integralmente:

| Fase | Stato alla ripresa | Evidenza |
|---|---|---|
| 1 — DB 059–061 | **Parziale** | Colonna e RPC presenti su TEST ma versioni non registrate; RPC da correggere/hardenizzare. `update_service_slot(jsonb)` non gestisce ancora lo step → serve la sola `062` autorizzata. |
| 2 — `deriveArrivalTimes` | **Parziale** | Implementazione presente; test mirato iniziale verde (12/12), ma mancano ancora alcuni confini/input malformati richiesti. |
| 3 — `useArrivalSlots` | **Parziale** | Hook presente ma non integrato; configurazione pubblica e gate capacità da riallineare alle RPC corrette. |
| 4 — Pagina Prenota | **Non iniziata** | Nessun cablaggio nel campo Ora o nel submit. |
| 5 — Edge `create-booking` | **Non iniziata** | Nessuna validazione S3 o snapshot durata nel writer. |
| 6 — cinque flussi admin | **Non iniziata** | Nessuno snapshot durata aggiunto ai call site mappati. |
| 7 — Servizio → Fasce Pro | **Non iniziata** | Il campo non è ancora presente nella modale fascia. |
| 8 — test/QA/documentazione | **Parziale** | Solo test puro iniziale; validate, controtest, QA responsive e handoff ancora da eseguire. |

Verifica ambiente prima di SQL: branch `env/test`, ref `docnnernvpyrbwuzzach`, host/org corretti,
progetto `ACTIVE_HEALTHY`, collegamento remoto TEST riuscito. Nessun accesso a PROD.

**Esito finale:** fasi 1–8 completate su TEST; `npm run validate` verde; Edge TEST distribuita;
QA pubblico e Servizio Pro verde sui tre viewport. Gap dichiarati: Deno locale assente; prova
concorrenza HTTP intercettata dal rate limit, mentre la semantica D36/D40 è verificata a livello DB.
Dettaglio operativo: `S3_HANDOFF.md`.

### Registro decisioni durante l'esecuzione

- **23-06-26 — D40:** l'implementazione Edge preesistente separa controllo capienza e insert, quindi
  due richieste concorrenti possono entrambe superare il controllo. Matteo ha autorizzato
  esplicitamente una migrazione aggiuntiva `063_*`, limitata alla RPC atomica necessaria per
  controllo capienza + inserimento su TEST. Restano vietate altre migrazioni senza nuovo Sì/No.
- **Rivalutazione D40 dopo lettura completa:** `create-booking` inserisce sempre `pending` e D36
  stabilisce che `pending` non consuma capacità. Due invii concorrenti possono quindi coesistere
  senza superare la capienza *occupata*, che è calcolata solo sugli `accepted`. Una `063` che contasse
  i pending violerebbe D36; una che non li contasse non cambierebbe l'esito. Decisione tecnica:
  autorizzazione conservata ma `063` non creata, evitando enforcement fittizio. L'accettazione admin
  resta volutamente morbida (warning, non blocco) come da contratto Classic.
- Il report finale deve conservare non solo gli esiti, ma anche idee valutate, metodi usati,
  alternative scartate e derivazione degli errori incontrati.
- **Derivazione errore RPC 061:** la prima prova reale su TEST ha rivelato `max(boolean)` non
  supportato da PostgreSQL. La causa era l'aggregazione pivot delle setting booleane; correzione
  scelta: `bool_or(...) FILTER (...)`, mantenendo una sola query e i fallback espliciti.

---

## 1. Scopo (e confine netto con S2/S4)

S3 porta il motore di durata nel **mondo reale**: slot di arrivo nel form pubblico, cutoff, tardivo,
cablaggio del resolver nell'Edge e nei hook admin. È la sotto-area più rischiosa perché tocca
**M0 (Prenota, in produzione)** e **l'Edge `create-booking` (in produzione)**.

**✅ In S3:**
- `service_slots.arrival_step_minutes` — colonna DB (migrazione TEST → PROD con gate).
- `deriveArrivalTimes()` — funzione pura in `bookingTimeSlots.ts` (lista slot da step+cutoff).
- Form pubblico: sostituzione `TimePicker24h` libero con slot-picker derivato dalle fasce.
- Rimozione del pre-compiling `getDefaultTime()` (o adattamento a "primo slot disponibile").
- Capacità slot nel form pubblico: RPC SECURITY DEFINER `get_available_arrival_times` (Opzione A confermata Q-S3-8), **attiva solo se `slot_limit_enabled=true`**; altrimenti il client mostra tutti gli slot (filtro cutoff+durata).
- Edge: validazione step-aligned (`INVALID_ARRIVAL_STEP`), cutoff (`CUTOFF_EXPIRED`), tardivo (D16).
- Edge: cablaggio `resolveBookingDuration()` → snapshot `duration_minutes/source/rule_version` all'insert.
- Edge: `duration_minutes` inviato dal client nel payload (Opzione A confermata da S2_HANDOFF).
- Hook admin: i 5 call sites `confirmed_start/end` ricevono snapshot durata.
- Servizio → Fasce: campo `arrival_step_minutes` nell'editor fascia.
- Settings Global (Classic): cutoff, min_order_time, toggle tardivo — letti/scritti come `restaurant_settings`.

**❌ NON in S3 (→ S4):**
- `turnover_buffer_minutes` nel calcolo finestre occupazione tavoli.
- `useTableStatuses`, Live, walk-in.
- Turni automatici, overbooking.

**❌ NON in S3 (→ console super-admin):**
- `restaurant_default_duration` (gradino 4 del resolver) — rimane `undefined`.
- Step e cutoff diversi per pranzo/cena/eventi (L2-lite mostra un unico default per Classic).

---

## 2. Decisioni fissate (dal masterplan + S2)

| # | Decisione |
|---|---|
| D2 | Edge = fonte di verità: il client è preview, l'Edge ri-valida tutto. |
| D14 | Snapshot durata congelato sulla prenotazione (non ricalcolo futuro). |
| D16 | Tre soglie ultimo arrivo: normale / tardivo-con-avviso (toggle) / bloccato-sempre. Pavimento 45 min. |
| D18 | Step arrivo per-fascia in DB, default unico in UI Classic. |
| D19 | Orari pieni = nascosti nel form pubblico (non grigi, non disabled). |
| D20 | Cutoff anticipo minimo = configurabile, default 60 min. |
| D21 | Pacing = solo predisposto, non MVP. |
| D36 | `pending` NON blocca capienza dura — solo `accepted/confirmed`. |
| D40 | Race condition = protezione server-side nell'Edge (transazione/lock logico). |
| D42 | Config incompleta → degrado al livello precedente. Niente fasce = `TimeInput` libero. |
| **Q-S2-7 → Opzione A** | Client risolve `duration_minutes`, lo invia nel payload. Edge valida che `>= slot_min_duration`. |

---

## 3. Domande aperte (Fase 2 — INTERVISTA con Matteo)

**Queste vanno chiuse PRIMA di scrivere codice.**

### Q-S3-1 — `arrival_step_minutes`: per-fascia o con global fallback?

Masterplan D18: "step arrivo **per-fascia** con default **unico**". Proposta:
- DB: `service_slots.arrival_step_minutes integer NOT NULL DEFAULT 30` → per-fascia.
- UI Classic (Personalizza Form o un campo globale): mostra UN SOLO campo "step unico" che
  aggiorna tutte le fasce → semplicità commerciale L2-lite.
- UI Pro (Servizio → Fasce): mostra per-fascia.

**→ Matteo conferma questa architettura? O vuole global-setting + override-per-fascia?**

### Q-S3-2 — Dove vive `cutoff_minutes` (anticipo minimo, D20)?

Proposta: `restaurant_settings` chiave `"cutoff_minutes"` (integer, default 60) — nessuna
migrazione DB. Globale per ora; in futuro potrebbe essere per-fascia (ma non S3).

**→ OK? O vuoi per-fascia fin da subito?**

### Q-S3-3 — Dove vivono `min_order_time_minutes` e `late_arrival_allowed` (D16)?

Proposta: entrambi in `restaurant_settings` (nessuna migrazione):
- `"min_order_time_minutes"` integer default 45
- `"late_arrival_allowed"` boolean default false

**→ OK? Il toggle tardivo dev'essere in UI ristoratore o solo console super-admin?**

### Q-S3-4 — Comportamento form se nessuna fascia configurata (degrado D42)

Proposta: se `booking_time_slots_enabled = false` o nessuna fascia → resta `TimePicker24h` libero
(backward compat L0/L1). Nessun slot-picker. Banner admin "configura le fasce per abilitare gli
slot di arrivo" (solo in admin, non pubblico).

**→ OK il degrado silenzioso lato pubblico?**

### Q-S3-5 — Reset orario al cambio card nel form

Se il cliente sceglie card "Cena" (150 min) → orario 20:30. Poi cambia a card "à la carte" (120 min).
L'orario 20:30 potrebbe non essere più valido se la durata più corta cambia la lista slot.

Proposta: al cambio card, riderivi la lista slot. Se `desired_time` è ancora nella nuova lista →
mantieni. Se non c'è più → reset a `null` (il cliente deve ri-scegliere).

**→ OK? O preferisci sempre mantenerlo e lasciare l'Edge decidere?**

### Q-S3-6 — Snapshot `duration_minutes` nel payload Edge (Opzione A)

Dal S2_HANDOFF: "NON in S2 → S3: cablaggio Edge + form pubblico (Opzione A — client risolve, Edge valida)."

Conferma:
- Il form pubblico chiama `resolveBookingDuration()` col `card_duration`, `booking_mode_default_duration` (dalla config pubblica), `slot_min_duration` (dalla fascia caricata).
- Invia `duration_minutes` nel payload POST all'Edge.
- L'Edge lo riceve, valida `>= slot.min_duration`, e lo scrive nello snapshot.
- L'Edge NON ri-legge `booking_public_form_config` da `restaurant_settings`.

**→ Confermato Opzione A?**

### Q-S3-7 — I 5 hook admin (cablaggio snapshot)

In S3 si cablano i 5 call sites `confirmed_start/end` per scrivere anche `duration_minutes/source/rule_version`.
Ogni hook admin ha accesso a `restaurant_settings` (via `supabase` autenticato).
Il cablaggio richiede: leggere la config, chiamare `resolveBookingDuration()`, aggiungere al payload.

**→ OK cablare tutti e 5 in S3? O solo l'accettazione (hook 1+2) e rimandare update/cambio-data a S4?**

### Q-S3-8 — Capacity nel form pubblico: RPC o mostra-tutto?

Dal S3_BASELINE_MAP §I — tre opzioni per D19 ("orari pieni = nascosti"):

| Opzione | Pro | Contro |
|---|---|---|
| **A — RPC SECURITY DEFINER** | Piena implementazione D19, single query | Migration extra (funzione DB) |
| **B — Mostra tutti, Edge blocca** | Semplicissimo da implementare | UX peggiore: errore all'invio |
| **C — Edge Function separata** | Flessibile | Deploy aggiuntivo, complessità |

**Proposta MVP: Opzione B per S3.0, poi Opzione A in S3.1 (o S4).**
Il cliente vede tutti gli slot step-aligned (solo filtro cutoff+durata). Se prova un pieno → Edge
restituisce `SLOT_LIMIT` → form mostra errore e disabilita quell'orario.

**→ Matteo approva degrado B per S3.0? O vuole RPC (A) da subito?**

### Q-S3-9 — `occupancy_start/end` su `booking_requests` (snapshot S3 o S4)?

Il masterplan §4 elenca `occupancy_start/end` come parte dello snapshot (richiesto da Calendario
e Analytics senza ricalcoli). S2 ha aggiunto `duration_minutes/source/rule_version`.

`occupancy_start = desired_datetime (ISO)` e `occupancy_end = occupancy_start + duration_minutes + buffer`.
Servono a `capacityCalculator.ts` e `bookingEventTransform.ts` per smettere di dipendere da
`confirmed_start/end` manuali.

Proposta: aggiungerli in S3 (migrazione leggera, retrocompatibile nullable).

**→ S3 o S4?**

---

## 4. Cosa esiste già (riuso diretto)

- `resolveBookingDuration()` — `src/features/booking/lib/resolveBookingDuration.ts` ✅
- `BOOKING_DURATION_MIN/MAX`, `parseBookingDuration`, `clampBookingDuration` — `bookingDurationLimits.ts` ✅
- `parseHmToMinutes`, `isTimeInsideSlot`, `slotCrossesMidnight`, `SlotConfig` — `bookingTimeSlots.ts` ✅
- `useServiceSlots()` — legge le fasce incluse `min_duration`, `turnover_buffer_minutes` (post-S2) ✅
- `ServiceSlot` type (post-S2) ✅
- `resolveOverrideMaxGuests()` nell'Edge (per capacity check con override) ✅
- `supabase/migrations/057_*.sql` + `058_*.sql` — applicate su TEST ✅

---

## 5. Da costruire (fasi)

### Fase 1 — DB (migrazione 059)

```sql
-- 059_service_slots_arrival_step.sql
ALTER TABLE public.service_slots
  ADD COLUMN IF NOT EXISTS arrival_step_minutes integer
    NOT NULL DEFAULT 30
    CHECK (arrival_step_minutes > 0);
```

Nessun GRANT aggiuntivo (eredita da RLS migration 025).
Applicata su TEST. PROD richiede gate `get_project_url` → conferma Matteo.

**Migrazione 060 (Q-S3-8 — Opzione A):** RPC `get_available_arrival_times(slug, date, card_duration)`
SECURITY DEFINER, callable anonima (`GRANT EXECUTE ... TO anon`). Computa gli slot lato DB sommando
solo gli stati che bloccano capienza (D43: `accepted/confirmed`, `no_show != true`) e ritorna i tempi
liberi. Usata dal client **solo se `slot_limit_enabled=true`**. Applicata TEST → PROD con gate.

**Settings globali (nessuna migrazione DB):** `cutoff_minutes`, `min_order_time_minutes`,
`late_arrival_allowed` — scritti/letti come chiavi `restaurant_settings`.

### Fase 2 — Funzione pura `deriveArrivalTimes()`

Aggiunta a `src/features/booking/utils/bookingTimeSlots.ts`:

```ts
export interface ArrivalSlotConfig {
  slot_start: string          // HH:MM (fascia inizio)
  slot_end: string            // HH:MM (fascia fine)
  arrival_step_minutes: number // es. 30
  card_duration_minutes?: number // durata card/tipologia risolta (per filtro ultimo arrivo)
  slot_min_duration?: number  // pavimento fascia
  cutoff_minutes?: number     // anticipo minimo da ora (default 60)
  late_arrival_allowed?: boolean
  min_order_time_minutes?: number // pavimento tardivo (default 45)
}

export interface ArrivalTime {
  time: string      // "HH:MM"
  isValid: boolean  // false → nascosto (D19) — non renderizzato
}

export function deriveArrivalTimes(
  config: ArrivalSlotConfig,
  nowMinutes: number,    // minuti mezzanotte di oggi (per cutoff oggi)
  isToday: boolean,
): ArrivalTime[]
```

La funzione è puramente deterministica, zero import Supabase, testabile in isolamento.

Regole:
1. Genera ogni `arrival_step_minutes` da `slot_start` a `slot_end`.
2. Filtra cutoff: `slotTimeMinutes >= nowMinutes + cutoff_minutes` (solo se `isToday`).
3. Filtra durata: `slotTimeMinutes + effectiveDuration <= slotEndMinutes`
   (dove `effectiveDuration = card_duration_minutes ?? slot_min_duration ?? 0`).
4. Se `late_arrival_allowed`: allarga la finestra a `slotEndMinutes - min_order_time_minutes`.
5. Overnight (mezzanotte): gestito con `slotCrossesMidnight()` già presente.

### Fase 3 — Hook `useArrivalSlots` (Classic public form)

`src/features/booking/hooks/useArrivalSlots.ts`:

```ts
export function useArrivalSlots({
  tenantId, date, cardDurationMinutes, enabled
}: UseArrivalSlotsParams): {
  slotsByFascia: { fascia: ServiceSlot; times: string[] }[]
  isLoading: boolean
  hasSlots: boolean
}
```

Questo hook:
1. Legge `useServiceSlots(tenantId)` — già disponibile.
2. Legge `restaurant_settings` per `cutoff_minutes`, `late_arrival_allowed`, `min_order_time_minutes`.
3. Per ogni fascia, chiama `deriveArrivalTimes()`.
4. Ritorna i tempi raggruppati per fascia.
5. Se `enabled = false` (nessuna fascia o `time_slots_enabled = false`) → `hasSlots: false`.
6. Capacity (D19) — **Opzione A confermata, gated da `slot_limit_enabled`** (Q-S3-8):
   - `slot_limit_enabled=true` → chiama RPC `get_available_arrival_times` (SECURITY DEFINER, callable anonima su `supabasePublic`); orari pieni esclusi dalla lista.
   - `slot_limit_enabled=false` → nessun "pieno": client mostra tutti gli slot step-aligned (solo filtro cutoff+durata), nessuna RPC.

### Fase 4 — UI form pubblico (sostituzione TimePicker)

**`BookingPublicTimePickerField`** in `BookingPublicDateTimePickers.tsx`:
- Se `slots` prop presente → renderizza lista orari per fascia (selettore pill/button).
- Se `slots` prop assente → comportamento attuale (`TimePicker24h`).
- Retrocompatibile: nessuna regressione su L0/L1.

**`BookingFormFields.tsx`**:
- Riceve `slots?` prop da `BookingRequestForm`.
- Passa ai `BookingPublicTimePickerField`.

**`BookingRequestForm.tsx`**:
- Chiama `useArrivalSlots({ tenantId, date, cardDurationMinutes })`.
- Rimuove `getDefaultTime()` dal `createInitialFormData()` (o lo sostituisce con il primo slot disponibile).
- Re-deriva gli slot al cambio data e al cambio card (se Q-S3-5 → reset se non valido).
- Invia `duration_minutes` nel payload POST (Opzione A, Q-S3-6).

### Fase 5 — Edge `create-booking`

**Estensioni:**

1. **Select `service_slots`** — aggiunge `min_duration, arrival_step_minutes`.

2. **Settings** — aggiunge `"cutoff_minutes"`, `"late_arrival_allowed"`, `"min_order_time_minutes"`.

3. **Nuova guard "arrival validation"** (dopo slot-availability guard, prima di insert):
   ```
   if (arrival_step_minutes > 0 && rejectOutOfSlot):
     slotTimeMinutes % arrival_step_minutes !== 0 → 409 INVALID_ARRIVAL_STEP
   if (cutoff_minutes > 0 && isToday):
     arrival < now + cutoff → 409 CUTOFF_EXPIRED
   if (!lateArrivalAllowed && arrival + min_order_time > slot_end):
     409 OUT_OF_SLOT (o nuovo codice?)
   if (lateArrivalAllowed && arrival + min_order_time > slot_end):
     409 CUTOFF_EXPIRED (arrivo troppo tardivo)
   ```

4. **Snapshot durata** (Opzione A):
   ```ts
   const incomingDuration = typeof payload.duration_minutes === 'number'
     ? payload.duration_minutes : undefined
   const validatedDuration = incomingDuration && matchedSlot
     ? Math.max(incomingDuration, matchedSlot.min_duration ?? 0, BOOKING_DURATION_MIN)
     : incomingDuration
   ```
   Aggiunto a `insertData`: `duration_minutes: validatedDuration ?? null`.

5. **Nuovi codici errore** (D42): `INVALID_ARRIVAL_STEP`, `CUTOFF_EXPIRED`, `CAPACITY_EXCEEDED`
   (questo ultimo è alias di `SLOT_LIMIT` con payload più ricco, da valutare).

### Fase 6 — Hook admin (5 call sites)

Per ogni hook in §E della baseline map — aggiungere snapshot durata:
```ts
const resolved = resolveBookingDuration({
  card_duration: booking.card_duration,          // da menu_selection o SubTab
  booking_mode_default_duration: ...,            // da restaurant_settings
  slot_min_duration: matchedSlot?.min_duration,
})
const durationPayload = resolved
  ? { duration_minutes: resolved.duration_minutes, duration_source: resolved.source,
      duration_rule_version: resolved.rule_version }
  : {}
```

### Fase 7 — Servizio → Fasce UI

Nel form di editing fascia (componente da mappare in `src/features/booking/components/servizio/`):
- Aggiungere campo `arrival_step_minutes` (picker: 15/30/60 + "Altro", min 5, max 120).
- UI Classic: campo "Intervallo di arrivo" unico nel pannello impostazioni (scrive su tutte le fasce).
- UI Pro (Servizio → Fasce): campo per-fascia.

### Fase 8 — Test (obbligatori da masterplan §10)

Test unit `deriveArrivalTimes`:
- Step 30: `[19:00, 19:30, 20:00, 20:30]` per fascia 19:00–23:00 con durata 120 → ultimo arrivo 21:00.
- Cutoff: se oggi + cutoff taglia i primi slot → rimossi.
- Tardivo ON: allarga la finestra di `min_order_time`.
- Overnight: fascia 22:00–02:00 → genera slot a cavallo mezzanotte.
- Nessuna durata (undefined) → tutti gli slot della fascia (nessun filtro durata).

Test integrazione Edge (`npm run validate` + Playwright smoke PROD post-deploy):
- `INVALID_ARRIVAL_STEP` → orario non allineato allo step.
- `CUTOFF_EXPIRED` → orario troppo vicino a ora attuale.
- `SLOT_LIMIT` → fascia piena.
- Snapshot `duration_minutes` scritto correttamente.

---

## 6. Rischi e mitigazioni

| Rischio | Probabilità | Mitigazione |
|---|---|---|
| Regressione form pubblico M0 | Alta (tocca M0 in produzione) | Feature flag `time_slots_enabled` come gate; degrado L0/L1 automatico |
| Race condition arrivi (D40) | Media | Edge già ha lock logico per SLOT_LIMIT; estendere alle nuove guard |
| UX rotto se nessuno slot disponibile | Media | Messaggio esplicito "Nessun orario disponibile — contattaci" + degrado a `TimeInput` |
| Deploy Edge in PROD | Alta criticità | Test su TEST, riproduzione bug before/after, gate `get_project_url` |
| Overnight/DST | Bassa | `slotCrossesMidnight()` già copre il caso; test esplicito S3 |
| Cambio card → orario non più valido | Bassa (UX) | Reset esplicito `desired_time = null` con avviso (Q-S3-5) |

---

## 6bis — Decisioni CHIUSE post-intervista *(sezione da compilare con Matteo)*

> **Aggiornare questa sezione** durante/dopo la Fase 2 INTERVISTA.

> **Intervista chiusa con Matteo il 23-06-26** (4 domande prodotto via interfaccia + delega delle
> tecniche all'orchestratore). Filosofia ribadita da Matteo: *«se posso personalizzare bene un
> Classic, lo personalizzo dalla console»* → ogni manopola fine resta nel dato (per-fascia) ma fuori
> dalla UI Classic, regolabile dalla **console super-admin** (`FU-SERV-ADMIN-PANEL-1`) per qualsiasi edition.

| Q | Decisione |
|---|---|
| Q-S3-1 | **Dato per-fascia** (`service_slots.arrival_step_minutes`, default 30). **Nessuna UI per-fascia in Classic**: il ristoratore Classic parte dal default unico; la regolazione fine (pranzo≠cena) si fa dalla **console super-admin** per qualsiasi edition (Matteo). UI per-fascia visibile solo in Pro (Servizio → Fasce). |
| Q-S3-2 | `cutoff_minutes` in `restaurant_settings`, default 60. Globale per ora; console-tunable in futuro. Nessuna migrazione DB. |
| Q-S3-3 | `min_order_time_minutes` (default 45) e `late_arrival_allowed` (default false) in `restaurant_settings`. **Toggle tardivo = SOLO console super-admin** (Matteo), NON nel pannello ristoratore. |
| Q-S3-4 | **Degrado silenzioso lato pubblico**: nessuna fascia o `booking_time_slots_enabled=false` → resta `TimePicker24h` libero (backward compat L0/L1). Banner "configura le fasce" **solo in admin**. |
| Q-S3-5 | **Reset orario al cambio card**: se `desired_time` non è più valido con la nuova durata → `null`, il cliente riseleziona. Se ancora valido → mantieni. |
| Q-S3-6 | **Opzione A confermata**: il form risolve `duration_minutes` e lo invia nel payload; l'Edge ri-valida (`>= slot_min_duration`) e lo scrive nello snapshot. L'Edge non ri-legge la config card. |
| Q-S3-7 | **Cablare tutti e 5 i call site** admin `confirmed_start/end` con snapshot `duration_minutes/source/rule_version` (coerenza dato, evita snapshot parziale). |
| Q-S3-8 | **Opzione A (RPC SECURITY DEFINER → orari pieni nascosti, D19), MA gated da `slot_limit_enabled`** (Matteo): se il limite coperti per fascia è **acceso** → nascondi gli orari pieni; se è **spento** → nessun concetto di "pieno", mostra tutti gli slot (solo filtro cutoff+durata). Niente opzione B. |
| Q-S3-9 | **Rimandato a S4**: `occupancy_start/end` NON in S3 (eviterebbe di riaprire M2 Calendario, blindato). Snapshot S3 = solo `duration_minutes/source/rule_version` (già in mig. 058). |

---

## 7. Sequenza di esecuzione (Fasi → Esecutore)

1. **Intervista (Matteo + orchestratore):** chiude Q-S3-1..9. Aggiorna §6bis.
2. **Fase 1 (esecutore):** migrazione 059 su TEST + rigenerazione `database.ts`.
3. **Fase 2 (esecutore):** `deriveArrivalTimes()` + test unit.
4. **Fase 3 (esecutore):** `useArrivalSlots` hook.
5. **Fase 4 (esecutore):** UI form pubblico (slot-picker).
6. **Fase 5 (esecutore):** Edge extensions.
7. **Fase 6 (esecutore):** 5 hook admin (snapshot).
8. **Fase 7 (esecutore):** Servizio → Fasce UI (`arrival_step_minutes`).
9. **Fase 8 (esecutore):** Test + validate verde.
10. **Gate (orchestratore):** `npm run validate` ✅ → revisione → commit.
11. **Deploy Edge PROD:** gate `get_project_url` → conferma Matteo.
12. **Deploy PROD mig. 059:** gate + conferma Matteo.

---

## 8. Può rompersi

- **M0 form Prenota** (in produzione) — rischio primario. Gate: degrado automatico se nessuna fascia.
- **Edge `create-booking`** (in produzione) — ogni deploy richiede test su TEST first.
- **M4 Settings** (se aggiungiamo UI cutoff/step globale in Classic) → controtest `settings-*`.
- **M2 Calendario** (se aggiungiamo `occupancy_start/end` — Q-S3-9) → controtest `calendario-*`.

---

*Prodotto 23-06-26 — orchestratore Sonnet 4.6. Versione plan 1.1 (intervista chiusa, orchestratore Opus).*
*Status: ✅ INTERVISTA CHIUSA (§6bis compilata) — pronto per l'esecuzione. Fase 1 = mig. 059 + 060 su TEST.*
