# S2 — Handoff (Motore durata / resolver)

> **Stato:** ✅ BUILD + TEST COMPLETA 23-06-26 — **non committata** (su `env/test`). Attende `fai report finale`.
> **Predecessore:** S1 ✅ · **Successore:** S3 (arrivi + cablaggio Edge).
> **Leggi:** `S2_PLAN.md` (§6bis decisioni CHIUSE) + `S2_BASELINE_MAP.md` in questa cartella.

## Cosa è stato fatto

- **`resolveBookingDuration()`** — funzione pura in `src/features/booking/lib/resolveBookingDuration.ts`.
  Gerarchia D35: override_admin > card > preset > booking_mode > restaurant_default (futuro).
  Pavimento: `MAX(slot_min_duration ?? 0, BOOKING_DURATION_MIN)`. Ritorna `undefined` se nessun
  livello ha durata (D42 — permanenza OFF). Zero import Supabase, puramente deterministica.
- **Test unit** — `src/features/booking/lib/__tests__/resolveBookingDuration.test.ts`.
  Copertura: gerarchia completa, D35 (card più corta vince), pavimento (slot e BOOKING_DURATION_MIN),
  undefined, rule_version, tutti i livelli incluso restaurant_default.
- **Migrazione 057** — `service_slots.min_duration` (nullable, ≥ 0) +
  `service_slots.turnover_buffer_minutes` (NOT NULL DEFAULT 0, ≥ 0). Applicata su TEST.
- **Migrazione 058** — `booking_requests.duration_minutes` + `duration_source` + `duration_rule_version`
  (tutti nullable — retrocompatibili con prenotazioni esistenti, D15). Applicata su TEST.
- **`useServiceSlots.ts`** — tipo `ServiceSlot` aggiornato: `slot_color: string | null` (allineamento
  gap preesistente Q-S2-6), `min_duration: number | null`, `turnover_buffer_minutes: number`.
  `ServiceSlotInsert` aggiornato: nuovi campi omessi dal base + riaggiunti come opzionali (DB default).
- **`database.ts`** rigenerato via `npm run db:types:linked` dopo le migrazioni.
- **`npm run validate`** ✅ 123 file / 1008 test.

## File toccati

- `src/features/booking/lib/resolveBookingDuration.ts` *(nuovo)*
- `src/features/booking/lib/__tests__/resolveBookingDuration.test.ts` *(nuovo)*
- `supabase/migrations/057_service_slots_duration_buffer.sql` *(nuovo, applicato TEST)*
- `supabase/migrations/058_booking_requests_duration_snapshot.sql` *(nuovo, applicato TEST)*
- `src/features/booking/hooks/useServiceSlots.ts` — tipo ServiceSlot + ServiceSlotInsert
- `src/types/database.ts` — rigenerato (non committare separatamente — viene da `db:types:linked`)

## Note operative (problema esecutore)

Il Sonnet esecutore ha avuto problemi MCP: il server `SupB_TradeAgent` è connesso al progetto
Trade Analyst Agent (`vfjwryrbuphqllqecgwj`), non al CalendarBackup TEST (`docnnernvp`).
Per questa sessione è stata usata `supabase db query --linked --file` come alternativa a `apply_migration`
MCP. `migration up` non funziona per il mismatch di storia migration noto (sequential vs timestamp).

## Debiti / note per S3

- **`restaurant_default_duration`**: parametro nel resolver sempre `undefined` — campo futuro
  console super-admin. Non ha storage né UI fino alla console S-ADMIN.
- **Snapshot 058 ancora vuoto**: `duration_minutes/source/rule_version` su `booking_requests`
  sono tutte NULL per le prenotazioni esistenti. Il writer (Edge + admin) va cablato in S3.
- **`turnover_buffer_minutes`**: colonna presente, non ancora usata nel resolver. Sarà letta in S4
  (calcolo finestre occupazione tavoli).
- **Call sites per snapshot (D14)** — i 5 hook che scrivono `confirmed_start/end` (vedi
  `S2_BASELINE_MAP.md` §E) sono i punti di inserimento per il writer di snapshot in S3/S4.
- **PROD**: migrazioni 057/058 applicate solo su TEST. PROD richiede conferma Matteo
  (`get_project_url` → `rwuxgvld` → STOP) prima del push.
- **`useDigestSlotConfigs`** (riga 191 `useServiceSlots.ts`): mappa `slot_color: null` hardcoded
  su `SlotConfig` — deliberato, `SlotConfig` è un subset usato per digest/capacità. Non è un bug.

## Contaminazione git (eredità S0+S1, ancora valida)

`env/test` contiene anche il lavoro console F8-F12 (S0) e `docs/Console-Skill/*`. **Quando si
committa S2** (`fai report finale`) includere SOLO i file S2 elencati sopra, non i file console.

*Aggiornato 23-06-26 (orchestratore Sonnet 4.6). Branch `env/test`.*
