# S0 — Handoff ORCHESTRATORE (Masterplan Servizio)

> **Per chi:** il prossimo orchestratore senior (Opus) che riprende la sotto-area **S0**.
> **Differenza con `S0_HANDOFF.md`:** quello è la staffetta *esecutori* (note fase-per-fase di
> Sonnet/Haiku). **Questo** è lo stato di regia: cosa è deciso, cosa è in volo, dove riprendere.
> **Aggiornare questo file** a ogni passaggio di consegne tra orchestratori.
>
> **Leggi PRIMA:** `docs/MASTERPLAN_SERVIZIO.md` §7 (S0) · `.claude/CLAUDE.md` (vocabolario +
> sicurezza PROD) · `docs/Testing-Skill/MANUALE_BLINDATURA.md` ·
> `docs/Sessioni di lavoro/22-06-26/SERVIZIO_BASELINE_MAP.md` (mappa AS-IS, Fase 4).

---

## SCOPE S0 (invariato)

- **Azione 1** = fix Edge override (D8).
- **Azione 2** = intervista + mappa + blindatura "as-is" del Servizio.
- **FUORI S0 → S4 (D10):** `useTableStatuses`, mismatch walk-in placement/id,
  guard `features.tableAssignments`, race condition `useUnassignedBookings`.

---

## STATO AL 22-06-26

### ✅ AZIONE 1 — CHIUSA
Fix Edge `create-booking` (override letto su `date_from`/`date_to` + resolver server-side
`resolveOverrideMaxGuests`, replica di `resolveSlotOverride`). Riprodotto+verificato su TEST,
**deployato PROD = create-booking v21 ACTIVE**. Commit `1e85687` (s0/edge-override-fix → env/test
+ cherry-pick main, pushato). §6 di `ADMIN_SERVIZIO_CONTEXT.md` aggiornata.
Gap non bloccante: 6 test Deno mai eseguiti (Deno non installato), solo letti; prova è
comportamentale su TEST. Dettaglio completo in `S0_HANDOFF.md` (Fasi 1-3, 6-7 + GATE PROD).

### ⏳ AZIONE 2 — IN CORSO

**Fase 4 (mappa AS-IS) — ✅ FATTA.** Output: `SERVIZIO_BASELINE_MAP.md` (11 componenti + 7 hook;
lista A candidati codice morto; lista B fondamenta S1-S4; lista C 8 domande).

**Intervista (lista C) — fatta sui punti che decidono la demolizione.** Esiti:

| Candidato (lista A) | Verifica | Decisione |
|---|---|---|
| A3 `useReleaseBookingAssignment` | VIVO — usato da `QuickTableAssignModal.tsx` | **NON toccare** |
| A4 `businessHoursRaw` (briefing) | VIVO — `AdminHomePage.tsx:214` passa valore reale | **NON toccare** |
| A7 re-export `slotCrossesMidnight` | MORTO — nessun import passa da `useServiceSlots.ts:11` | **RIMUOVERE** |
| A1 `rotation` (campo tipo) | residuo, nessuna UI | **RIMUOVERE** dal tipo a mano (DB e `database.ts` restano) — *Matteo: "non mi serve"* |
| A6 `display_order` sale | feature viva | **TENERE/blindare** — *Matteo: "numero a mano va bene"* |

**6 domande di design rimaste (C1 forma, C3 walk-in, C4 checkout, C5 guard, C7 ghost, C8 briefing)
= materiale S4, NON bloccano S0.** Da riprendere all'apertura di S4.

**Fase 5 (demolizione) — ✅ FATTA (Haiku).** 2 edit chirurgici:
1. `useServiceSlots.ts` — rimosso `export { slotCrossesMidnight }` (+ import orfano).
2. `useServizioTables.ts` — rimosso `rotation` da `RestaurantTable` e `TableInput`.
`npm run validate` → **✅ 122 file, 970 test**. Fase 6 (revisione) inline: approvata, rischio nullo.

**Fase 7 (commit + doc) — ✅ FATTA (orchestratore).** §8 di `ADMIN_SERVIZIO_CONTEXT.md` aggiunta,
stato S0 nel masterplan §7, handoff aggiornati. Nessun PROD.

### ➡️ S0 COMPLETA (22-06-26). Niente altro in questo scope.

---

## PROSSIMI PASSI

> ⚠️ **AGGIORNAMENTO 24-06-26 — questo handoff è di S0; il fronte è molto più avanti.** S0, **S1, S2, S3**
> sono tutti **chiusi e IN PRODUZIONE** (S3 rollout PROD 23-06: edge `create-booking` v22, mig. 057→062,
> PrenotaZen rilasciata — vedi `docs/Sessioni di lavoro/23-06-26/`). I 6 quesiti di design S4
> (C1/C3/C4/C5/C7/C8) sono stati **risolti** nell'intervista S4 del 24-06-26 → decisioni **D44–D52** nel
> masterplan §3.
>
> **Prossima regia = S4 (build).** Plan dedicato: `docs/Sessioni di lavoro/24-06-26/S4_PLAN.md`
> (orchestratore Opus → subagent con skill "prepara prompt" + revisione orchestratore a checkpoint/fine).
> **Nessun freno GTM** (masterplan §9 nota): il vincolo "10-15 clienti Classic" era parere esterno, non
> adottato da Matteo.

- ~~La prossima sotto-area è **S1**~~ → superato: S1/S2/S3 fatti e in PROD (vedi sopra).
- ~~I 6 quesiti di design restano materiale **S4**~~ → risolti 24-06-26 (D44–D52).

---

## VINCOLI / NOTE AMBIENTE

- **Sicurezza PROD:** `get_project_url` prima di ogni scrittura. `rwuxgvld`=PROD → STOP/conferma.
  `docnnernvp`=TEST → ok. `supabase db push` vietato. CLI mai su PROD (usa MCP).
- **Servizio è Pro, NON in main/Classic** — le parti `src/` Classic seguirebbero merge-production di
  `MASTERPLAN_BLINDATURA.md`, ma il Servizio non è in quel flusso.
- **Contaminazione git (22-06-26):** `env/test` e `s0/servizio-baseline` contengono ANCHE il lavoro
  **console F8-F12** (mergiato localmente per far testare Matteo, NON pushato — vive in `console/` +
  `docs/Console-Skill/`, branch `feature/console-super-admin`, altro team). Nel working tree vedrai
  `docs/Console-Skill/*` modificati: **NON sono S0**, non includerli nei commit di S0.

---

*Aggiornato 22-06-26 (checkpoint Fase 5 in corso). Branch `s0/servizio-baseline`.*
