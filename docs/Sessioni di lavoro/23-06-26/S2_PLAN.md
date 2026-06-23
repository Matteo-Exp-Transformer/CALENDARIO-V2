# S2 — Plan: Motore durata (gerarchia / resolver) *(libreria condivisa — Classic core)*

> **Governato da:** `docs/MASTERPLAN_SERVIZIO.md` §7 (S2) + decisioni D11, D13, D14, D15, D16, D35, D37, D42.
> **Predecessore:** S1 ✅ chiusa (vedi `S1_HANDOFF.md` in questa cartella).
> **Stato:** ⬜ apertura cantiere (23-06-26). Branch: `env/test` (stesso di S1, non committata).

---

## 1. Scopo (e confine netto con S1/S3/S4)

S2 costruisce il **cervello del calcolo**: una funzione pura `resolveBookingDuration()` che,
date tutte le durate ora configurabili (S1 le ha aggiunte), decide quale vince. La funzione è
**libreria condivisa** (non legata a un singolo modulo) e viene riusata da Edge, Calendario,
inserimento admin e futuro S3/S4.

- ✅ **In S2:**
  - `resolveBookingDuration()` — funzione pura (override > card > preset > tipologia > default,
    pavimento = `min_duration` fascia).
  - `service_slots.min_duration` — nuova colonna DB (migrazione TEST → PROD controllata).
  - `turnover_buffer_minutes` (D37) — colonna/campo (posizione da decidere in mappa, vedi Q-S2-5).
  - Auto-attivazione permanenza solo se esiste una durata (logica nel resolver).
  - Durata **congelata** sulla prenotazione (D14): snapshot dei campi minimi su `booking_requests`.
  - Test unit del resolver (tutti i casi: override > card > preset > tipologia > default; pavimento).

- ❌ **NON in S2 (→ S3):** integrazione nel form pubblico (slot derivati dalla durata, cut-off).
- ❌ **NON in S2 (→ S4):** calcolo finestre di occupazione tavoli; `useTableStatuses`.
- ❌ **NON in S2 (→ S3/Edge deploy):** cablare il resolver dentro `create-booking/index.ts` su PROD.
  Il resolver è scritto in S2; viene chiamato dall'Edge in S3 (insieme alla validazione arrivi).

---

## 2. Gerarchia durata (da D35 + [Q7]→Opzione A)

```
resolveBookingDuration(input) → duration_minutes (number)

Priorità (prima che vince):
  1. override_admin_minutes       — sovrascrittura manuale admin sulla singola prenotazione (assoluto)
  2. card.duration                — SubTab.duration (la card scelta dal cliente)
  3. preset.default_duration      — CustomStaffPreset.default_duration (ereditato se card non ha durata)
  4. bookingMode.default_duration — tipologia (BookingMode) default base
  5. restaurant_default_duration  — durata media unica del ristorante (L2-lite, Classic)

Pavimento (applicato al risultato, mai come concorrente dei livelli):
  floor = MAX(slot.min_duration ?? 0, BOOKING_DURATION_MIN)
  result = MAX(resolved_from_levels, floor)
```

Invariante D35: la card vince sulla tipologia **anche se più corta**.
Invariante §2 masterplan: senza alcuna durata configurata → `undefined` → permanenza OFF (D42 degrado).

---

## 3. Cosa esiste già (riuso) — da verificare in mappa

- `bookingDurationLimits.ts` (S1): `BOOKING_DURATION_MIN=30`, `MAX=360`,
  `parseBookingDuration`, `clampBookingDuration`. Il resolver vi si appoggia.
- `SubTab.duration?`, `BookingMode.default_duration?`, `CustomStaffPreset.default_duration?` (S1).
- `service_slots` (mig. 010): `start/end_time`, `max_guests`, `max_turns`, `display_order`.
  Aggiungere `min_duration integer` nullable (0/null = nessun pavimento).
- `booking_requests` — snapshot da aggiungere (da mappare i campi esistenti in Fase 1).
- `src/features/booking/lib/` — verifica se la cartella esiste e se c'è un posto naturale per il
  resolver, oppure se va creato un nuovo file.

---

## 4. Da costruire

1. **`resolveBookingDuration()`** in `src/features/booking/lib/resolveBookingDuration.ts` (da
   confermare posizione in mappa):
   - firma: `resolveBookingDuration(input: ResolveBookingDurationInput): ResolvedDuration | undefined`
   - `ResolveBookingDurationInput`: tutti i livelli + `slot_min_duration?`
   - `ResolvedDuration`: `{ duration_minutes, source, rule_version }` (source per snapshot D14)
   - Puramente deterministico, zero effetti collaterali, zero import Supabase.

2. **Migrazione `min_duration`** su `service_slots` (TEST → verifica → PROD con conferma Matteo):
   - `ALTER TABLE service_slots ADD COLUMN min_duration integer;`
   - `CHECK (min_duration IS NULL OR min_duration >= 0)`
   - Default NULL (nessun pavimento = comportamento invariato, degrado D42).
   - RLS: inherit dalla tabella (già protetta da tenant).

3. **`turnover_buffer_minutes`** (D37): posizione da decidere con Matteo (vedi Q-S2-5). Probabile:
   colonna su `service_slots` (per fascia) con default 0.

4. **Snapshot durata sulla prenotazione** (D14) — campi minimi MVP:
   - `duration_minutes integer` — la durata risolta (congelata al momento della prenotazione).
   - `duration_source text` — quale livello ha vinto (`'card'|'preset'|'booking_mode'|'restaurant_default'|'admin_override'`).
   - `duration_rule_version integer` — versione della regola (per debug futuro senza ricalcolo).
   - (I campi completi §4 masterplan — `occupancy_start/end`, `applied_slot_min_duration`, ecc. —
     sono predisposti come schema ma non scritti in S2: arrivano in S3/S4 quando l'Edge li usa.)

5. **Test unit** `resolveBookingDuration.test.ts`: tutti i rami della gerarchia + pavimento + assenza
   durata → `undefined` + D35 (card < tipologia → card vince).

---

## 5. Rischi / può rompersi

- **#2 Regressione M4 (Settings) e M3 (Menu):** S2 non tocca la UI Settings/Menu → rischio basso;
  ma la migrazione tocca `service_slots` (letto da `useServiceSlots`, usato in Servizio Pro e
  Calendario) → controtest `servizio-*` dopo migrazione.
- **#5 Semantica `confirmed_start/end`:** oggi impostati a mano; D15 li lascia intatti nello storico.
  Lo snapshot S2 (`duration_minutes`) è su nuove colonne, non sovrascrive i vecchi.
- **Migrazione PROD (`service_slots.min_duration`):** prima `get_project_url` → se `rwuxgvld` STOP.
  Colonna nullable additive → retrocompatibile, zero downtime.
- **Snapshot nullabile:** `booking_requests.duration_minutes` NULL per le prenotazioni esistenti →
  il codice che legge il campo deve gestire NULL (resolver restituisce `undefined` = permanenza OFF,
  coerente con D42).

---

## 6. Domande per l'intervista-di-sezione (da chiudere con Matteo PRIMA della build)

- **Q-S2-1 — Posizione del resolver:** confermare `src/features/booking/lib/resolveBookingDuration.ts`
  (o esiste già una `lib/` con convenzioni diverse?).
- **Q-S2-2 — Snapshot MVP:** solo `duration_minutes + duration_source + duration_rule_version` in S2,
  o aggiungere anche `applied_slot_min_duration`? I campi full (§4 masterplan) arrivano in S3/S4.
- **Q-S2-3 — "Default ristorante" (L2-lite):** il 5° gradino (durata media unica) vive come nuovo
  campo in `restaurant_settings` (es. `default_booking_duration_minutes`) oppure si usa il
  `default_duration` della tipologia "base" (tipo Null/default)? Decidere prima di scrivere la firma.
- **Q-S2-4 — Edge integration in S2 o S3?** Il resolver è S2; collegarlo a `create-booking/index.ts`
  (deploy PROD) è S3 (insieme all'intervallo arrivo) — confermare per non sforare.
- **Q-S2-5 — `turnover_buffer_minutes` in S2 o S4?** D37 lo elenca in S2 ma serve davvero solo in
  S4 (calcolo finestre tavoli). Proposta: aggiungere la colonna schema in S2 (migrazione insieme a
  `min_duration`) ma non usarla nel resolver fino a S4. Confermare.

---

## 6bis. Decisioni intervista — CHIUSE (Matteo, 23-06-26)

- **Q-S2-1 → CHIUSA (dalla mappa):** `src/features/booking/lib/resolveBookingDuration.ts` — la
  cartella esiste, il file va creato lì.
- **Q-S2-3 → Opzione C:** il 5° gradino "default ristorante" si **omette dall'UI** in S2.
  La firma del resolver include il parametro opzionale `restaurant_default_duration?` (per non
  dover riscrivere la firma in futuro), ma non ha storage né UI — viene lasciato sempre `undefined`
  finché la **console super-admin** di Matteo non lo espone (campo settato da Matteo in vendita,
  non dall'admin ristoratore).
- **Q-S2-4 → CONFERMATA:** il cablaggio nell'Edge è S3. S2 scrive solo il resolver puro.
- **Q-S2-5 → NOT NULL DEFAULT 0:** `turnover_buffer_minutes integer NOT NULL DEFAULT 0`.
  Tipo TypeScript `number` (mai null). Colonna aggiunta in S2, non usata nel resolver fino a S4.
- **Q-S2-6 → SÌ:** `slot_color` allineato nel tipo `ServiceSlot` in S2 (una riga aggiuntiva).
- **Q-S2-7 → Opzione A:** in S3 il client risolve la durata e la invia nel payload; l'Edge la
  valida sul range e la snappa. Il resolver server-side non serve in S3.

### Firma finale del resolver (post-intervista)

```ts
export interface ResolveBookingDurationInput {
  override_admin_minutes?: number         // gradino 1 — assoluto (admin sulla singola prenotazione)
  card_duration?: number                  // gradino 2 — SubTab.duration
  preset_default_duration?: number        // gradino 2b — CustomStaffPreset.default_duration
  booking_mode_default_duration?: number  // gradino 3 — BookingMode.default_duration (tipologia)
  restaurant_default_duration?: number    // gradino 4 — super-admin console (futuro, sempre undefined per ora)
  slot_min_duration?: number              // pavimento — service_slots.min_duration
}

export type DurationSource =
  | 'admin_override' | 'card' | 'preset' | 'booking_mode' | 'restaurant_default'

export interface ResolvedDuration {
  duration_minutes: number
  source: DurationSource
  rule_version: 1  // costante per ora
}

// Ritorna undefined se nessun livello ha durata → permanenza OFF (D42)
export function resolveBookingDuration(
  input: ResolveBookingDurationInput,
): ResolvedDuration | undefined
```

### Ambito build risultante (S2)
1. `src/features/booking/lib/resolveBookingDuration.ts` — resolver puro.
2. `src/features/booking/lib/__tests__/resolveBookingDuration.test.ts` — test unit.
3. Migrazione `057_service_slots_duration_buffer.sql` — `min_duration` (nullable) +
   `turnover_buffer_minutes` (NOT NULL DEFAULT 0) su `service_slots`.
4. Migrazione `058_booking_requests_duration_snapshot.sql` — `duration_minutes`,
   `duration_source`, `duration_rule_version` (tutti nullable) su `booking_requests`.
5. `src/features/booking/hooks/useServiceSlots.ts` — aggiunta `min_duration`, `turnover_buffer_minutes`,
   `slot_color` al tipo `ServiceSlot`.
6. `npm run db:types:linked` — rigenera `src/types/database.ts` dopo le migrazioni su TEST.
7. `npm run validate` verde.

---

## 7. Sequenza (ciclo blindatura)

- **Fase 1 — MAPPA (read-only, esecutore Sonnet):** mappare `lib/`, `service_slots` schema,
  `booking_requests` schema, Edge `create-booking`, pattern esistenti nel codebase.
  Output: `S2_BASELINE_MAP.md` in questa cartella.
- **Fase 2 — INTERVISTA (orchestratore + Matteo):** chiudere Q-S2-1..5.
- **Fase 3 — BUILD (esecutore Sonnet):**
  - (a) Resolver puro + test.
  - (b) Migrazione `min_duration` (+ `turnover_buffer_minutes` se confermato) → TEST → PROD con gate.
  - (c) Snapshot `booking_requests` (migrazione) → TEST → PROD con gate.
- **Fase 4 — TEST + CONTROTEST:** `npm run validate` + controtest `servizio-*` + smoke PROD.
- **Fase 5 — DOC + BLINDATURA:** aggiornare `ADMIN_SERVIZIO_CONTEXT.md`, stato S2 nel masterplan §7,
  handoff.

---

## 8. Verifica / sicurezza

- `npm run validate` verde a ogni step.
- **Migrazione:** `get_project_url` prima di ogni scrittura. `docnnernvp`=TEST → ok. `rwuxgvld`=PROD
  → STOP/conferma Matteo. `supabase db push` vietato. CLI mai su PROD.
- Il resolver è puro: nessun effetto collaterale, nessuna chiamata Supabase → testabile senza DB.
- Le nuove colonne su `booking_requests` sono nullabili: retrocompatibili con prenotazioni esistenti.

---

*Creato 23-06-26 (orchestratore Sonnet 4.6). Prossimo passo: Fase 1 mappa (esecutore Sonnet).*
