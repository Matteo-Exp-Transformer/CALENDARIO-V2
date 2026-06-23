# S3 — Baseline Map (Intervalli di arrivo)

> **Prodotto da:** Fase 1 MAPPA (read-only) — orchestratore Sonnet 4.6, 23-06-26.
> **Branch:** `env/test` (stato post-S2 committata, be12b73).
> **Input:** `MASTERPLAN_SERVIZIO.md` §2/3/7, `S2_HANDOFF.md`, lettura diretta sorgenti.
> **Prossimo step:** Fase 2 INTERVISTA — chiudere Q-S3-1..8 → poi `S3_PLAN.md`.

---

## A — Fondamenta S1+S2 (stato confermato post-commit be12b73)

| Artefatto | Stato | Note |
|---|---|---|
| `resolveBookingDuration()` | ✅ in `src/features/booking/lib/resolveBookingDuration.ts` | Pura, testata, gradini 1–4 + pavimento |
| `service_slots.min_duration` | ✅ in DB TEST (mig. 057) | nullable, default NULL |
| `service_slots.turnover_buffer_minutes` | ✅ in DB TEST (mig. 057) | NOT NULL DEFAULT 0 |
| `booking_requests.duration_minutes/source/rule_version` | ✅ in DB TEST (mig. 058) | nullable — writer da cablare in S3 |
| `bookingDurationLimits.ts` | ✅ MIN=30, MAX=360, parse+clamp | Riusabile in S3 |
| `SubTab.duration`, `BookingMode.default_duration` | ✅ in tipi + UI | Leggibili dal form pubblico |

**Debiti S2 → S3 (espliciti nell'handoff):**
- Snapshot `duration_minutes/source/rule_version` su `booking_requests` ancora NULL → writer da aggiungere ai 5 call sites admin + all'Edge in S3.
- `restaurant_default_duration` (gradino 4 del resolver) ancora sempre `undefined` → rimane undefined in S3, arriva con la console super-admin.
- `turnover_buffer_minutes` presente ma inutilizzato → S4.

---

## B — Componente tempo pubblico (stato AS-IS)

### `BookingPublicTimePickerField` — `BookingPublicDateTimePickers.tsx:295`

- Usa `TimePicker24h` (componente libero, ore+minuti, qualsiasi valore).
- Riceve `minTime?` (blocca ore passate se data = oggi).
- NON riceve fasce, step, slot disponibili.
- In `BookingFormFields.tsx:147` è chiamato con `value={formData.desired_time}`.

### `getDefaultTime()` — `BookingRequestForm.tsx:277`

```ts
const getDefaultTime = (): string => {
  const now = new Date()
  const nextHour = now.getHours() + 1
  if (nextHour >= 24) return '00:00'
  return `${String(nextHour).padStart(2, '0')}:00`
}
```

Usato in `createInitialFormData()` (`:290`) e reset form (`:644`).
**Problema:** pre-popola un orario libero; con lo slot-picker il default dev'essere `null`
(il cliente sceglie lo slot) oppure il primo slot disponibile.

### Validazione lato form

`BookingRequestForm.tsx:969–998`: controlla solo:
1. `desired_time` obbligatorio
2. `isValidBookingDateTime` (contro `businessHours`)

Non c'è validazione step, cutoff, o "dentro fascia" lato client.

---

## C — Utility già riusabile in `bookingTimeSlots.ts`

Tutte le utility che S3 può riusare SENZA modifiche:

| Funzione | Uso in S3 |
|---|---|
| `parseHmToMinutes(value: string): number` | Base per tutti i calcoli di step e finestre |
| `isTimeInsideSlot(time, start, end)` | Verifica se un arrivo è dentro la fascia |
| `slotCrossesMidnight(slot)` | Gestione overnight DST-safe |
| `slotRangesOverlap(...)` | Calcolo sovrapposizione finestre occupazione |
| `SlotConfig` type | Tipo base per fascia |

**Da aggiungere in questa utility (S3):** `deriveArrivalTimes(slot, step, cutoff, now)` — funzione pura
che genera la lista di orari ogni `step` minuti dentro la fascia, escludendo quelli già passati il cutoff.

---

## D — Edge `create-booking/index.ts` (stato AS-IS)

### Select attuale di `service_slots` (riga ~413)
```ts
.select("id, name, start_time, end_time, max_guests, display_order")
```
**Mancante:** `min_duration`, `arrival_step_minutes` (da aggiungere in S3).

### Settings lette oggi (riga ~378)
```ts
.in("setting_key", [
  "booking_time_slots_enabled",
  "slot_limit_enabled",
  "booking_reject_out_of_slot",
  "slot_guest_capacities",
])
```
**Da aggiungere in S3:** `"cutoff_minutes"`, `"late_arrival_allowed"`, `"min_order_time_minutes"`.

### Validazione arrivo attuale (righe ~446–501)
L'Edge valida solo:
1. Se l'orario cade in una fascia (`OUT_OF_SLOT`)
2. Se la fascia è al completo (`SLOT_LIMIT`, solo se `slot_limit_enabled`)

**NON valida:** step, cutoff, tardivo, durata disponibile, `INVALID_ARRIVAL_STEP`, `CUTOFF_EXPIRED`.

### Snapshot durata nell'Edge
L'Edge NON legge né scrive `duration_minutes`. Il payload di insert (riga ~567) non include
`duration_minutes/source/rule_version`. Questo è il **cablaggio principale** di S3 nell'Edge.

### Riga di inserimento resolver (dall'S2_BASELINE_MAP §C)
Tra fine "Slot availability guard" (~riga 503) e "Insert booking request" (~riga 505):
```ts
// [S3] validazione step + cutoff + tardivo
// [S3] resolveBookingDuration() → snapshot duration_minutes/source/rule_version
```

---

## E — Hook e callsite admin (i 5 punti di scrittura)

Dal S2_BASELINE_MAP §E — i 5 hook che scrivono `confirmed_start/end` (e che S3 deve arricchire
con il writer di snapshot):

| File | Riga approssimativa | Contesto |
|---|---|---|
| `useAdminBookingRequests.ts` | ~59–60 | Accettazione admin |
| `useBookingMutations.ts` | ~87–88 | Accettazione |
| `useBookingMutations.ts` | ~210–211 | Update prenotazione |
| `useBookingMutations.ts` | ~390–391 | Update payload (cambio data/ora) |
| `useBookingRequests.ts` | ~211–212 | Update accepted |

In ognuno va aggiunto il calcolo di `resolveBookingDuration()` + scrittura dello snapshot.
L'admin ha accesso a `restaurant_settings` (via `supabase` autenticato) per leggere le durate.

---

## F — Servizio → Fasce (UI esistente)

### Dove vive il form fasce

`src/features/booking/components/servizio/` — da mappare per trovare il form di editing slot.

```
grep -rn "ServiceSlot\|useServiceSlots\|arrival_step" src/features/booking/components/servizio/
```

Non ancora letto: da esplorare in Fase 1 dell'esecutore S3. Il form di editing fascia deve ricevere
il nuovo campo `arrival_step_minutes`.

---

## G — Schema DB attuale (post-S2)

### `service_slots` — colonne presenti
| Colonna | Tipo | Note |
|---|---|---|
| id, tenant_id, name, display_order, is_canonical | — | base |
| start_time, end_time | string | HH:MM:SS |
| max_guests | number \| null | cap coperti |
| max_turns | number \| null | 0 = chiuso (D41) |
| max_turns_resume | number \| null | |
| slot_color | string \| null | |
| min_duration | number \| null | **nuovo S2 (mig. 057)** |
| turnover_buffer_minutes | number | **nuovo S2, NOT NULL DEFAULT 0** |

**ASSENTE da aggiungere in S3:**
- `arrival_step_minutes integer NOT NULL DEFAULT 30` — step di arrivo per-fascia (D18)

### `restaurant_settings` (key-value, nessuna migrazione schema)

Chiavi esistenti: `booking_time_slots_enabled`, `slot_limit_enabled`, `booking_reject_out_of_slot`,
`slot_guest_capacities`, `booking_public_form_config`, `booking_menu_promos`, ecc.

**Chiavi nuove da aggiungere via UI (S3) — nessuna migrazione DB:**
- `cutoff_minutes` — anticipo minimo per prenotare (default 60, D20)
- `min_order_time_minutes` — pavimento tardivo (default 45, D16)
- `late_arrival_allowed` — toggle tardivo con avviso (default false, D16)

### `booking_requests` — colonne presenti (post-S2)
Aggiornate con snapshot durata: `duration_minutes`, `duration_source`, `duration_rule_version`.
**Colonne S3 necessarie:** da valutare → `occupancy_start/end` (timestamptz) per Calendario/Analytics
senza ricalcoli (da decidere in intervista Q-S3-9).

---

## H — Dipendenza dalla durata nel form (uovo/gallina)

Il **problema principale** di S3 è che la lista di slot dipende dalla durata della card scelta:
```
slot valido se: arrival_time + resolved_duration <= slot.end_time
               (oppure tardivo toggle ON → arrivo fino a end_time - min_order_time)
```
Ma il form mostra gli slot PRIMA che il cliente abbia confermato tutto.

**Soluzione masterplan §3:** client usa `min_duration` della fascia come stima conservativa
(mostra tutti gli slot dove un ospite con la durata minima ci starebbe), l'Edge ri-valida
con la durata reale (D2). Se la card scelta ha durata nota → client usa quella durata
(non la minima) → lista slot più precisa.

Implementazione lato client:
```ts
const effectiveDuration = cardDuration ?? slotMinDuration ?? 0
const isSlotValid = (arrivalMinutes: number) =>
  arrivalMinutes + effectiveDuration <= slotEndMinutes
  || (lateArrivalAllowed && arrivalMinutes + minOrderTime <= slotEndMinutes)
```

---

## I — Problema RLS per capacity nel form pubblico (D19)

Il form pubblico usa `supabasePublic` (anonimo). La tabella `booking_requests` ha RLS — gli anonimi
NON possono leggere le prenotazioni altrui.

Per implementare D19 ("orari pieni = nascosti"), ci sono 3 opzioni:

| Opzione | Descrizione | Complessità | Rischio |
|---|---|---|---|
| **A — RPC SECURITY DEFINER** | Nuova funzione DB `get_available_arrival_times(slug, date)` che computa gli slot lato DB e ritorna solo i tempi disponibili | Media (migration + funzione) | Bassa |
| **B — Slot senza capacity** | Client mostra tutti gli slot step-aligned (solo filtro cutoff+durata), Edge blocca i pieni | Bassa (no migration extra) | UX peggiore: il cliente arriva all'invio e vede errore |
| **C — Edge Function dedicata** | Nuova Edge Function `get-arrival-slots` | Alta | Medio (deploy Edge aggiuntivo) |

**Proposta:** Opzione A per MVP (RPC DB function, callable anonimamente su `supabasePublic`).
**Alternativa degrado:** Opzione B se la complessità di A blocca; poi A in S3.2.

---

*Prodotto 23-06-26 — orchestratore Sonnet 4.6. Fase 1 MAPPA completata.*
*Prossimo: Fase 2 INTERVISTA — chiudere Q-S3-1..9 con Matteo → poi S3_PLAN.md.*
