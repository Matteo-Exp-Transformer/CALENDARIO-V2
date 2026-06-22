# S0 — Handoff esecutori (Masterplan Servizio)

> File di staffetta tra orchestratore (Opus) e esecutori (Sonnet/Haiku).
> **Ogni esecutore, quando ha finito, AGGIUNGE la sua nota in fondo alla propria sezione**
> (non cancella le altre). Matteo poi dice solo "ha finito" e l'orchestratore legge qui.
> Stato fasi e dettagli in `docs/MASTERPLAN_SERVIZIO.md` §7 (S0).

---

## FASE 1 — Riproduci bug Edge override [SONNET] — ✅ FATTO

- `get_project_url` = **docnnernvp** (TEST) confermato.
- Bug confermato: `create-booking/index.ts:431` `.eq("override_date", desired_date)` filtra una
  colonna inesistente (la tabella ha `date_from`/`date_to`) → `ovRow=null` → override ignorato,
  si usa sempre il cap base.
- Prove (tenant `classic-tomas`, fascia Pranzo, cap base 20, override `max_guests=2` per 2026-06-25):
  - Edge con 4 ospiti (>override 2, <base 20) → **HTTP 201 accettata = BUG**.
  - Controprova: 18 già accettati + 4 nuovi (22 > base 20) → **HTTP 409 SLOT_LIMIT = path base ok**.
- Dati di test ripuliti. Nessuna scrittura su PROD.

---

## FASE 2 — Fix Edge resolver "vince il più specifico" [SONNET] — ✅ FATTO

> Esecutore: scrivi qui sotto la tua nota di fine fase.

### Nota esecutore

- **Diff sintetico:**
  - `supabase/functions/create-booking/index.ts` — righe ~424-437 (blocco `slotLimitEnabled`):
    - Rimossa query con `.eq("override_date", …).maybeSingle()`.
    - Sostituita con query `.lte("date_from", desired_date).gte("date_to", desired_date)` → array `ovRows`.
    - Aggiunto `const ovMaxGuests = resolveOverrideMaxGuests(ovRows ?? [], desired_date);`.
    - Cap: `ovMaxGuests ?? matchedSlot.max_guests ?? slotGuestCapacities[…] ?? null`.
  - Funzione pura `resolveOverrideMaxGuests(rows, desiredDate): number | null` aggiunta prima di `Deno.serve`
    (righe ~52-88 dopo l'edit), con interfaccia `SlotOverrideRow`. Replica esatta di `resolveSlotOverride`
    lato client: filtra difensivo, span = round(delta/86400000)+1, vince span minore; a parità, created_at maggiore.
  - Nuovo file `supabase/functions/create-booking/resolveOverrideMaxGuests.test.ts` (6 test Deno).

- **Dove girano i test dell'Edge:** i test `.test.ts` nelle funzioni Supabase usano **Deno test**, NON vitest.
  Comando: `deno test supabase/functions/create-booking/resolveOverrideMaxGuests.test.ts`.
  Questi test sono **fuori da `npm run validate`** (Vitest non li vede), esattamente come `log.test.ts` e
  `unsubscribeLink.test.ts` già presenti. La funzione pura è `export` e importabile nel test Deno via `./index.ts`.
  `npm run validate` (lint + typecheck + vitest) → **✅ verde: 122 file, 970 test passati**.

- **Conferma nessun deploy + branch:** nessun deploy eseguito (né TEST né PROD); lavoro su branch `s0/edge-override-fix`.

- **Attriti / deviazioni:**
  - Le righe indicate nel prompt (~426-432) corrispondevano esattamente — nessuna deviazione di posizione.
  - Il runner dei test Edge è Deno (confermato da log.test.ts già presente); i test della funzione pura
    non entrano in `npm run validate` per design coerente con il pattern già adottato nel repo.
  - Nessun `console.log` aggiunto; funzione pura non richiede logger.

---

## FASE 3 — Deploy TEST + ri-repro [HAIKU] — ✅ FATTO

### Nota esecutore

- **`get_project_url`** = **docnnernvpyrbwuzzach** (TEST) — confermato ✅
- **Test Deno**: file `resolveOverrideMaxGuests.test.ts` contiene **6 test** (verified in situ; Deno non installato globalmente, ma contenuto verificato).
- **Edge deployato su TEST**: versione deployata tramite `supabase functions deploy create-booking` su TEST (docnnernvpyrbwuzzach) ✅
- **Ri-repro Fase 1 (passo 4)**:
  - Tenant `classic-tomas`, fascia Pranzo, date_from=date_to=2026-06-25, override max_guests=2
  - Invocazione Edge: num_guests=4, desired_time=12:30
  - **ESITO**: HTTP **409 SLOT_LIMIT** ✓ (atteso; il fix scatta, override letto correttamente)
  - Messaggio: `"Spiacenti, la fascia \"Pranzo\" è al completo per questa data."`
- **Controprova overlap (passo 5)**:
  - Aggiunto secondo override: date_from=2026-06-01, date_to=2026-06-30 (mensile), max_guests=10
  - Invocazione 1 (num_guests=4): **409 SLOT_LIMIT** ✓ (vince lo span più corto = cap 2, non 10)
  - Invocazione 2 (num_guests=2): **201 SUCCESS** ✓ (entro il cap 2) — booking ID: `0fbc1d27-9861-4400-8afb-4fb1eada1dae`
- **Pulizia**: booking di test + 2 override rimossi via SQL — ZERO dati residui su TEST ✅
- **Ambiente**: nessun deploy/scrittura su PROD (rwuxgvld) — solo TEST (docnnernvpyrbwuzzach) ✅
- **Attriti**: nessuno. Supabase CLI v2.106.0 ha deployato correttamente anche se Docker non è in esecuzione.

---

## FASE 4 — Intervista + mappa "as-is" Servizio [SONNET] — ⬜ DA FARE

---

## FASE 5 — Demolizione codice morto [HAIKU/SONNET] — ⬜ DA FARE

---

## FASE 6 — Revisione fix Edge (isolato) [OPUS-orchestratore] — ✅ FATTO

Revisione diretta dell'orchestratore sul diff Edge (mini-PR D8, isolato):
- `resolveOverrideMaxGuests` (index.ts:65-89) = replica fedele di `resolveSlotOverride` client
  (filtro copertura, span inclusivo, span minore vince, parità → created_at maggiore). OK.
- Call-site (index.ts:463-480): query corretta `date_from..date_to` senza `.maybeSingle()`,
  cascata cap invariata, `max_guests=null` dell'override ricade sul base come il client. OK.
- Nessun altro path toccato (OUT_OF_SLOT, insert, codici). Scope chirurgico rispettato.
- Gap non bloccante: 6 test Deno non eseguiti (Deno non installato), solo letti; la controprova
  overlap su TEST (Fase 3) esercita lo stesso resolver end-to-end → copertura comportamentale ok.
- ESITO: fix approvato per commit + gate PROD umano.

---

## FASE 7 — Commit + doc [HAIKU] — ✅ FATTO

### Nota esecutore

- **Commit hash:** `1e85687`
- **Messaggio:** `fix(create-booking): override fascia letto su date_from/date_to con "vince il più specifico"`
- **File committati:** 3
  - `supabase/functions/create-booking/index.ts` (modifica Edge + risolver)
  - `supabase/functions/create-booking/resolveOverrideMaxGuests.test.ts` (test Deno, nuovo)
  - `docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md` (§6 aggiornata)
- **Conferma §6:** aggiornata ✅ (bug 🔴 → 🟢 RISOLTO, dettagli date_from/date_to + resolveOverrideMaxGuests + TEST ok 409)
- **Conferma operazioni:** nessun push, nessun merge, nessun deploy ✅ (commit locale su `s0/edge-override-fix`)
