# FU-LOG-1 — Logging edge functions — 12-06-26

**Cosa è cambiato:** le Edge Functions Supabase (`create-booking`, `validate-invite`) non usano più `console.error` sparsi: passano da un helper Deno condiviso (`supabase/functions/_shared/log.ts`) con prefisso funzione, request id opzionale e meta sanitizzato (niente email/telefono/token in chiaro).
**Cosa resta:** `FU-LOG-1` resta **Aperto** — perimetro `scripts/` (~20 `console.error|warn`) e eventuali `console.log` debug in `src/`; deploy edge su TEST/PROD non eseguito (solo codice repo).
**Serve una tua azione:** no (deploy edge separato quando vorrai).

---

## Perimetro edge

| File | `console.error` before | `console.error` after (via `log.*`) |
|------|------------------------|-------------------------------------|
| `create-booking/index.ts` | 2 | 2 (`log.error`) |
| `validate-invite/index.ts` | 5 | 5 (`log.error`) |
| **Totale applicativo** | **7** | **7** |

**Residuo motivato:** `_shared/log.ts` — 2 righe (`warn`/`error` delegano a `console.*`).

Grep finale: `rg "console\.(error|warn)" supabase/functions/` → solo `_shared/log.ts`.

Altre EF in repo: solo le due sopra (`check-slot-availability` rimossa in WP-B5).

---

## Helper `_shared/log.ts`

- `createEdgeLogger(fn, req?)` → `{ error, warn, info }`
- Prefisso log: `[create-booking][cf-ray-id]` (header `x-request-id`, `x-correlation-id`, `cf-ray`)
- Meta `err`/`error`: serializza solo campi utili (`code`, `message`, `details`, `hint`, `name`, `status`)
- Chiavi PII (`email`, `phone`, `token`, `password`, …) → `[redacted]`
- `info` silenziato in `ENVIRONMENT=production` / `SUPABASE_ENV=production` (parità con `logger.ts` dev-only per info)

Esempio output dashboard:

```
[validate-invite][abc123] Token consume error {"err":{"code":"…","message":"…"}}
```

---

## Test eseguiti

| Comando | Esito |
|---------|-------|
| `npm run validate` | ✅ verde — **576** test passed |
| `npx supabase functions serve` (path errore create-booking) | ⬜ non eseguito — richiede stack Supabase locale + env; comportamento log verificabile al prossimo deploy |

---

## File docs aggiornati

| File | Modifica |
|------|----------|
| `docs/FOLLOW_UP.md` | `FU-LOG-1` — edge ✅, restano scripts/debug |
| `docs/FOLLOW_UP.md` | `FU-ALL-FALLBACK` — logging edge chiuso |
| `docs/SESSION_LOG.md` | +1 riga |

**Skill area:** nessuna — solo canale log server-side, nessun layout UI.

---

## Collegamento FU-LOG-1

Stato perimetro logging M6:

| Zona | Stato |
|------|-------|
| `src/` app (`console.error\|warn`) | ✅ WP-C2 — solo `logger.ts` |
| Edge functions | ✅ questa sessione |
| `scripts/` | ⬜ ~20 chiamate |
| `console.log` debug `src/` | ⬜ fuori scope |

---

## Dati comunicazione

- **Pagina Prenota → invio prenotazione:** se il salvaggio fallisce lato server, in dashboard Supabase vedi log strutturati `[create-booking]` con codice errore DB — senza email/telefono del cliente nel testo del log.
- **Registrazione admin via invito:** errori token/auth/admin_users loggati con prefisso `[validate-invite]`; token invito mai stampato in chiaro.
- **Storage:** invariato — nessuna migrazione DB.

---

## Analisi flusso prompt, efficienza e statistiche

- Prompt sostanziali: 1 · correzioni dopo 1ª risposta: 0 · follow-up generati: 0 · modalità alzata: no.
- Task meccanico: grep audit → helper Deno → replace 7 call site → validate → report.

---

## La tua lettura della sessione

**Impressioni:** perimetro chiaro; pattern WP-C2 replicato senza import React; diff piccolo e sicuro.

**Difficoltà:** nessuna; due EF, nessuna terza con `console.*`.

**Migliorie suggerite:** al deploy edge verificare una riga log reale in dashboard TEST; opzionale tranche `scripts/` con stesso helper o lasciare CLI come sono (fuori runtime prod).

---

## Cosa resta per la prossima sessione

- FU-LOG-1: audit `scripts/` e `console.log` debug (chiusura completa o lint `no-console`)
- Deploy edge TEST quando Matteo conferma (fuori scope sessione)

---

## Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: «Profilo: Esecuzione · standard / Branch: env/test / Skill: docs/FOLLOW_UP.md (FU-LOG-1), docs/Sessioni di lavoro/12-06-26/Report-wp-c2-logger-12-06-26.md (pattern app già fatto) / Obiettivo: estendere logging coerente alle Supabase Edge Functions — sostituire console.error/console.warn con pattern strutturato, allineato a src/lib/logger.ts (senza importare logger React in Deno). / Perimetro: create-booking, validate-invite, eventuali altre EF. / Approccio: _shared/log.ts, no PII, messaggi utili dashboard. / Verifica: npm run validate; serve locale opzionale. / Fuori scope: scripts/, console.log src/, deploy PROD. / Non chiudere FU-LOG-1 — aggiorna FOLLOW_UP edge ✅ restano scripts. / Report standard; commit fix(edge) + docs follow-up. / DB: nessuna modifica.»

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Ri-verificato grep `supabase/functions/` (7 call site migrati, residuo solo `_shared/log.ts`); conteggio test **576** da output `npm run validate`; elenco file docs aggiornati; confermato assenza `check-slot-availability` su disco (solo create-booking + validate-invite).

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Aggiornati `FOLLOW_UP.md`, `SESSION_LOG.md`, report sessione. Nessuna skill area UI/DB da allineare — solo canale log server-side. Nessun test Vitest aggiunto (edge escluso da tsconfig validate).

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non eseguito `npx supabase functions serve` (stack locale + env non avviato in sessione; opzionale nel prompt). Non migrato `scripts/` (fuori scope esplicito). Non deployato edge su TEST/PROD (fuori scope). Non toccato `console.log` debug in `src/`.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: Attrito minimo — glob indicava `check-slot-availability` ma la cartella non esisteva più (WP-B5); miglioria: indicare in FOLLOW_UP/FU-LOG che l’EF slot è stata rimossa così l’agente non perde tempo a cercarla.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Giusto — prompt auto-contenuto con perimetro, esclusioni e riferimento WP-C2; report precedente + FOLLOW_UP sufficienti senza caricare skill area booking/admin.
