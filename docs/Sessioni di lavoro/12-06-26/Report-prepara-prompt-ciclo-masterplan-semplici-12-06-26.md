# Prepara-prompt — ciclo MASTERPLAN task semplici — 12-06-26

**Cosa è cambiato:** milestone **AL-A** (docs bonifica) e **AL-C** (pulizia codice leggera) del masterplan allineamento sono **chiuse** — 4 sub-agent esecutori lanciati e controverificati in questa sessione orchestratore.
**Cosa resta:** tutto **AL-B** (senior+Matteo), **AL-D** (ok file per file), **AL-F** (decisioni commerciali), **AL-E** (Meta) — fuori scope task semplici.
**Serve una tua azione:** revisione leggera routing WP-A6; poi aprire sessione **senior** con prompt WP-B1 sotto.

---

## Ciclo orchestratore

| Fase | Stato |
|------|-------|
| Analisi MASTERPLAN + classificazione simple vs senior | ✅ |
| Sub-agent WP-A6 | ✅ controverificato |
| Sub-agent WP-C1 | ✅ controverificato |
| Sub-agent WP-C3 | ✅ controverificato |
| Sub-agent WP-C2 | ✅ controverificato |
| Report orchestratore | ✅ questo file |

---

## Sub-agent eseguiti (ordine sessione)

| WP | Agente | Esito revisione prepara-prompt | Validate |
|----|--------|-------------------------------|----------|
| **WP-A6** Routing capienza/masterplan | generalPurpose | ✅ grep + path + masterplan ✅ | verde |
| **WP-C1** Codice morto | generalPurpose | ✅ 3 delete git, useBookingRequests lasciato (2 import) | 557 test |
| **WP-C3** package.json | generalPurpose | ✅ @types/qrcode in devDeps; @vercel/node rimosso | 557 test |
| **WP-C2** Logger | generalPurpose | ✅ solo logger.ts ha console.*; 10 file migrati | 557 test |

**Report singoli:** [A6](Report-wp-a6-routing-capienza-masterplan-12-06-26.md) · [C1](Report-wp-c1-codice-morto-12-06-26.md) · [C3](Report-wp-c3-package-json-12-06-26.md) · [C2](Report-wp-c2-logger-12-06-26.md)

---

## Stato masterplan post-sessione

| Milestone | Completamento |
|-----------|---------------|
| **AL-A** Bonifica meccanica docs | **6/6 ✅** |
| **AL-B** Fix critici codice/DB | **0/5** → senior |
| **AL-C** Pulizia mirata | **3/3 ✅** |
| **AL-D** Fusioni docs | **0/5** → ok Matteo file per file |
| **AL-F** Commerciale/legale | **0/2** → decisioni Matteo |
| **AL-E** Strutturale skill | **0/3** → sessione Meta |

---

## WP esclusi (motivo)

| WP | Perché non lanciato qui |
|----|-------------------------|
| B1–B5 | DB/migrazioni, tenant, edge, decisioni PROD — **senior + Matteo** |
| D1–D5 | Spostamenti/fusioni docs — **ok esplicito file per file** |
| F1–F2 | Prezzi e legale — **decisioni Matteo** |
| E1–E3 | Design skill system — **solo sessione Meta** |

---

## Controverifica prepara-prompt

- `rg -i capienza|masterplan` su APP_CONTEXT + PRENOTA → path corretti
- `git status` → 3 componenti booking eliminati (D)
- `rg console.(error|warn) src/` → solo `logger.ts`
- `package.json` → @types/qrcode in devDependencies; @vercel/node assente
- `npm run validate` finale → **verde** (557 test)

**Nota minore:** commento stale in `AdminBookingForm.tsx` («same as AcceptBookingModal») — non import, fuori scope C1; opzionale cleanup futuro.

---

## 5. File di skill aggiornati (via sub-agent)

| File | WP | Modifica |
|------|-----|----------|
| `docs/APP_CONTEXT_SKILL.md` | A6 | +2 righe routing §0 |
| `docs/Prenota-Skill/PRENOTA_SKILL.md` | A6 | +1 riga §6 capienza vs testo |
| `docs/MASTERPLAN_ALLINEAMENTO.md` | A6,C1,C2,C3 | stato WP ✅ |
| `docs/SESSION_LOG.md` | tutti | +4 righe WP |
| `docs/FOLLOW_UP.md` | C2 | nota progresso FU-LOG-1 |
| `src/` (10 file) | C2 | logger.* |
| `src/` (3 delete) | C1 | componenti orfani |
| `package.json` + lock | C3 | deps classificate |

---

## 6. Dati comunicazione

- **Prompt Matteo (verbatim):** «sei agente prepara prompt — leggi MASTERPLAN_ALLINEAMENTO — completare esecuzione lanciando sub agent per micro task semplici; complicate le fa senior; controverifica, aggiorna report, genera prossimo prompt; continua fino a fine task semplici; non fermarti se ok».
- **Pattern efficace:** classificazione WP simple/senior prima del lancio; prompt esecutore con file esatti + vietato + validate + output attesi; controverifica grep/git status prima di WP successivo.
- **Delega sub-agent:** 4/4 OK al primo giro, zero correzioni richieste.

---

## 7. Analisi flusso prompt, efficienza e statistiche

- Prompt sostanziali Matteo: **1**
- Correzioni dopo 1ª risposta: **0**
- Follow-up generati: **0** (FU-LOG-1 già gestito da C2)
- Sub-agent lanciati: **4**
- Modalità alzata: **no**

---

## 8. La tua lettura della sessione

**Impressioni:** il masterplan funziona bene come coda atomica — WP A6/C1/C3/C2 erano tutti eseguibili in parallelo sequenziale senza dipendenze incrociate. La separazione «semplici vs senior» ha evitato di toccare AL-B per errore.

**Difficoltà:** nessuna — i sub-agent hanno rispettato i confini (C1 non ha toccato useBookingRequests con import attivi).

**Miglioria (dato):** dopo WP-B4 aggiornare `ADMIN_SETTINGS_CONTEXT` con sezione validazione server collegata a create-booking (già segnalato in report A6).

---

## 9. Derivazione errori

Nessuna difficoltà tecnica in orchestrazione. Commento stale AcceptBookingModal = residuo cosmetico post-C1 (**bug preesistente** nel commento, non nel codice).

---

## 10. Cosa resta per la prossima sessione

1. **Senior — WP-B1** (primo AL-B): migrazioni ↔ DB TEST, drift policy
2. Poi B2–B5 in ordine masterplan (tutti senior)
3. AL-D quando Matteo dà ok file per file
4. AL-F quando approva prezzi/voci legali
5. AL-E in sessione Meta

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti verbatim?
✅ R1: vedi §6 — prompt orchestratore masterplan task semplici con sub-agent e non fermarsi.

❓ Q2 — Dati = diff reale?
✅ R2: ri-verificato grep capienza/masterplan, git status delete C1, grep console solo logger.ts, package.json devDeps, validate finale verde.

❓ Q3 — File correlati allineati?
✅ R3: masterplan tabella stato allineata; report per ogni WP; SESSION_LOG aggiornato dai sub-agent.

❓ Q4 — Cosa NON hai fatto?
✅ R4: AL-B/D/F/E intenzionalmente esclusi; nessun commit/push (non richiesto); nessun codice scritto dall'orchestratore (solo delega).

❓ Q5 — Attrito + miglioria?
✅ R5: zero attrito; rischio futuro = agente senior che accorpa B1+B2 — mantenere «un WP per sessione» nel prompt senior.

❓ Q6 — Contesto & hook?
✅ R6: MASTERPLAN + PREPARA_PROMPT_SKILL sufficienti; nessun hook runtime.

---

## Prossimo prompt (senior — WP-B1)

Vedi blocco handoff in risposta chat orchestratore.
