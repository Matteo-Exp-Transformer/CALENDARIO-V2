# Piano chiusura rimanenze MSS — guida rapida per agente senior

**Data:** 25-08-26 · **Branch atteso:** `env/test` · **HEAD di partenza:** `50e6912` + working tree Opzione B (non committato)

> **Tipo:** piano operativo per orchestrazione senior — **non** owner di stato.
> **Owner:** `docs/MetaSkillSystem/PLAN_V0.md` §4-bis · §4-ter · §15.
> **Mandato orchestratore vivo:** `docs/MetaSkillSystem/PROMPT_ORCHESTRATOR_MSS_24-08-26.md`
> **Avvio orchestratore:** `docs/MetaSkillSystem/PROMPT_AVVIO_ORCHESTRATORE_MSS.md`

## Decisioni Matteo (25-08-26, verbatim intent)

1. **Opzione B sui difetti H-1.3:** non accettare bypass documentati — **chiudere davvero** (`--no-verify`, unstaged, Cloud/Codex/Claude senza hook, light fail-open).
2. **SK-10:** se provato e controverificato → **firma e CHIUSO definitivo** (niente «PROVATO» lasciato appeso).
3. **Codex M12** su Opzione B: in corso; se verde → procedere con pubblicazione e fasi successive.
4. **WP-1 / pilota:** solo dopo fondamenta chiuse + **riapertura esplicita `D27`** in chat dedicata.

---

## Cappello — cosa è vero adesso

| Fatto | Evidenza |
|---|---|
| Cicli T7+T9 eseguiti; ultimo chiuso **T6**; prossimo gate **T8** | `npm run mss:status` |
| Fix Opzione B F1–F3 applicati in working tree (non su `origin`) | `Report-fix-m12-t7-codex-opzione-b-25-08-26.md` |
| `H-1.3` = **PASS_CON_RISERVE**; `WP-1` = **NO-GO**; `D27` = pilota rinviato | `PLAN_V0.md` §4 |
| SK-* principali (SK-4…SK-9, SK-11) = **CHIUSO**; SK-10 = **PROVATO** | `PLAN_V0.md` §4-bis |
| Protocollo pilota allineato **1.0.1** / coppia viva **0.1.1 / freeze-2** | `PROTOCOLLO_PRIMO_PILOTA_V0_1.md` + test F3 |

---

## Sequenza globale (priorità)

```
P0  Pubblicazione + owner allineato + SK-10 firmato
P1  H-1.3 PASS pulito — chiusura reale bypass E2 (scelta B)
P2  Debiti strutturali residui (D14, SK-7 N4, R-T7-06 se serve)
P3  Readiness pilota + riapertura D27 + WP-1 istanza 1
```

**Regola orchestratore:** una **famiglia** = un mandato = un report + una capsula. Non un report per riga di codice.

---

## P0 — Blocco immediato (prima di qualsiasi E2 o pilota)

### P0.1 — Controverifica M12 Codex su Opzione B

| Campo | Valore |
|---|---|
| **Priorità** | 🔴 P0 — gate commit |
| **Stato** | in corso (Matteo: Codex sta finendo senza problemi) |
| **Cosa verificare** | F1 ultimo chiuso T6 / prossimo T8; F2 parità kit/produzione (complete / missing-qr / no-capsule); F3 protocollo 1.0.1 + legacy rifiutato |
| **Report revisione originale** | `docs/Sessioni di lavoro/25-08-26/Report-revisione-indipendente-ciclo-t7-codex-25-08-26.md` |
| **Report fix esecutore** | `docs/Sessioni di lavoro/25-08-26/Report-fix-m12-t7-codex-opzione-b-25-08-26.md` |
| **Judgments fix** | `docs/Sessioni di lavoro/25-08-26/judgments-fix-m12-t7-codex-opzione-b-25-08-26.md` |
| **File toccati** | `scripts/mss/plan-parse.mjs`, `_skill-system-v0/hooks/fine-sessione-nudge.mjs`, `PROTOCOLLO_PRIMO_PILOTA_V0_1.md`, test SK-2/F3/N3 |
| **Gate chiusura** | Report M12 Codex con PASS su F1–F3; eventuale `--verify` amendment su record fix (non rewrite) |
| **Agenti precedenti** | Codex M12 T7 (revisione); Cursor Composer (fix Opzione B) |

**Comandi riesecuzione:**

```powershell
npm run mss:status
npm run test:mss:tools   # SK-2, F3
npm run test:mss         # N3 kit+prod
npm run mss:capsule -- --force-legacy   # atteso exit 2
```

---

### P0.2 — T8: pubblicazione commit T7 + T9 + Opzione B

| Campo | Valore |
|---|---|
| **Priorità** | 🔴 P0 — dopo P0.1 verde |
| **Stato** | aperto — working tree ~9 file + report/judgments Opzione B |
| **Cosa fare** | Commit separati consigliati: (1) codice/fix Opzione B + cruscotto; (2) docs/report. Push solo con **sì esplicito** Matteo |
| **Riferimento riserva** | `R-T7-01` in `PLAN_V0.md` (WT non pubblicato) |
| **Gate** | `validate:mss:all` verde; CI job `mss` verde su GitHub Actions post-push (`SK-5`) |
| **Report orchestratore T7** | `docs/Sessioni di lavoro/25-08-26/Report-orchestratore-t7-backlog-pilota-25-08-26.md` |
| **Report orchestratore T9** | `docs/Sessioni di lavoro/25-08-26/Report-orchestratore-t9-blindatura-struttura-25-08-26.md` |

---

### P0.3 — Allineare owner `PLAN_V0.md` post-Opzione B

| Campo | Valore |
|---|---|
| **Priorità** | 🔴 P0 — stesso ciclo di T8 |
| **Problema** | § PLAN elenca ancora **R-T9-01/02/03** come aperti; tecnicamente chiusi da Opzione B |
| **Azione** | Aggiornare § riserve T9/T7: segnare R-T9-01/02/03 **CHIUSE** con puntatore al report fix; rigenerare cruscotto se serve |
| **Non fare** | Non promuovere H-1.3 a PASS pulito in questo passo (serve P1) |
| **Gate** | `npm run validate:mss:views` verde |

---

### P0.4 — SK-10: firma Matteo → **CHIUSO** definitivo

| Campo | Valore |
|---|---|
| **Priorità** | 🔴 P0 — nessuna prova tecnica residua dichiarata |
| **Stato attuale** | **PROVATO** (`M-D` 24-08-26; riserva **N6** chiusa in `M-G` M12) |
| **Decisione Matteo** | «Se finito e controverificato, firmo e chiudiamo — non lasciare PROVATO appeso» |

**Prove già agli atti (rieseguire prima della firma, non rifare da zero):**

| Prova | Report / attore |
|---|---|
| P2A manuale + ingresso | `MANUALE_OPERATIVO_MSS_V0.md`; `Report-p2a-manuale-mss-23-08-26.md` |
| P2B export + doctor | `docs/Sessioni di lavoro/24-08-26/Report-md-portabilita-24-08-26.md` (**M-D**) |
| N6 chiuso (doctor owner) | `docs/Sessioni di lavoro/24-08-26/Report-controverifica-MG-24-08-26.md` |
| R8 rieseguito T9 | `docs/Sessioni di lavoro/25-08-26/Report-t9-f4-r8-d14-portabilita-25-08-26.md` |
| Repo ospite verde | citato in `MANUALE_OPERATIVO_MSS_V0.md` §7 (M-D / orchestratore) |

**Checklist chiusura (seduta breve, mostly governance):**

1. `npm run mss:doctor` → exit 0 (10/10)
2. `npm run mss:export -- --help` → ok
3. Opzionale: rieseguire smoke export in sandbox (non obbligatorio se M12 conferma atti)
4. **Firma verbatim Matteo** in report di chiusura SK-10 (modello: firma SK-4/SK-8 T6)
5. Aggiornare `PLAN_V0.md` §4-bis **S10** → `CHIUSO`
6. Aggiornare `MANUALE_OPERATIVO_MSS_V0.md` header (`R8`/`SK-10` non più «PROVATO»)
7. Report + capsula chiusura SK-10 (un solo file, famiglia unica)

**Non aprire:** nuove feature export; portabilità oltre quanto già provato.

---

## P1 — H-1.3 PASS pulito (Opzione B: chiudere tutto davvero)

Matteo ha scelto **implementazione reale**, non accettazione documentata dei bypass.
Fonte bypass: `docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json` (`known_bypass`, `bypass_no_verify_and_unstaged`, `stop_does_not_cover_cloud_codex_claude`).

Organizzare in **2–3 famiglie** (non 20 mandati):

### P1.1 — Famiglia E2-A: `--no-verify` e hook pre-commit obbligatori

| Campo | Valore |
|---|---|
| **Priorità** | 🟠 P1 |
| **Problema** | `git commit --no-verify` bypassa Husky/pre-commit; H-1.3 resta con riserva |
| **Obiettivo Opzione B** | Enforcement che impedisce commit MSS senza passare i gate (o che lo segnala come violazione misurabile con test) |
| **File probabili** | `.husky/pre-commit`, `scripts/mss/validate-changed-reports.mjs`, `COVERAGE_MATRIX_H1.json`, test H-1 |
| **Report storico** | `docs/Sessioni di lavoro/25-08-26/Report-h13-e2-bypass-t7-25-08-26.md` (B-E2-CI già chiuso; restano E2 locali) |
| **Gate chiusura** | Test nominato che dimostra: commit/report incompleto **non** passa; matrice aggiornata; nessun `known_bypass` stale su CI |
| **Attenzione** | `--no-verify` è feature Git — obiettivo realistico: (a) policy repo + test che documentano il buco residuo umano, oppure (b) wrapper/commit gate lato CI che non dipende da hook locale. Orchestratore deve scegliere scope minimo **dimostrato**, non E3 totale |

---

### P1.2 — Famiglia E2-B: unstaged / worktree fuori gate

| Campo | Valore |
|---|---|
| **Priorità** | 🟠 P1 |
| **Problema** | File MSS modificati ma non staged non entrano nel pre-commit |
| **Obiettivo Opzione B** | Estendere perimetro staged/worktree per artefatti MSS (coerente con SK-4 B2/B3) |
| **File probabili** | `scripts/mss/adapter.mjs`, `scripts/mss/cli.mjs`, `validate-changed-reports.mjs`, test SK-4 / H-1.3 |
| **Report SK-4** | `docs/Sessioni di lavoro/25-08-26/Report-sk4-assert-t7-25-08-26.md`; ciclo T6 |
| **Gate** | Test: modifica report non staged → deny; matrice H-1 aggiornata |

---

### P1.3 — Famiglia E2-C: Cloud / Codex / Claude senza hook stop

| Campo | Valore |
|---|---|
| **Priorità** | 🟠 P1 |
| **Problema** | `stop` hook non gira su Cloud Agents; Codex/Claude possono chiudere senza nudge |
| **Obiettivo Opzione B** | Fallback enforcement: checklist obbligatoria nel prompt + validazione post-hoc (`validate-changed-reports` in CI) + eventuale gate su report recenti in pipeline |
| **Riferimenti** | `CHIUSURA_SESSIONE.md` (hook limiti); `_skill-system-v0/hooks/README.md`; `Report-hook-qr-chiusura-t7-25-08-26.md` |
| **Gate** | Test/CI che fallisce se report standard/deep merged senza capsula; documentazione skill aggiornata |
| **Nota** | Non promettere hook Cloud se la piattaforma non li supporta — chiudere con **E2 alternativo** misurato |

---

### P1.4 — Famiglia E2-D: light fail-open (R-T7-05)

| Campo | Valore |
|---|---|
| **Priorità** | 🟠 P1 (prima del pilota light; pilota deep può procedere dopo P1.1–C se D27 riaperto) |
| **Problema** | Report **light** senza capsula: hook tace (fail-open intenzionale) |
| **Obiettivo Opzione B** | Regola esplicita light: JSONL evento + riga `SESSION_LOG.md`; test dedicato; deny se light dichiara chiusura senza evento |
| **Report T9** | `docs/Sessioni di lavoro/25-08-26/Report-t9-f2-r4-r7-automazioni-25-08-26.md` (test `R4 — light resta fail-open…`) |
| **Gate** | Test R4 aggiornato da fail-open a enforcement light; fixture FX-V02 coerente |

---

### P1.5 — Promozione H-1.3 → PASS (solo dopo P1.1–D)

| Campo | Valore |
|---|---|
| **Priorità** | 🟠 P1 — ultimo passo della famiglia |
| **Azione** | Aggiornare `PLAN_V0.md` §4 riga H-1.3; aggiornare `COVERAGE_MATRIX_H1.json` (rimuovere o reclassificare bypass chiusi); report chiusura H-1.3 + M12 |
| **Gate** | `npm run test:mss` verde; matrice coerente; nessun bypass stale in prosa owner |

---

## P2 — Debiti strutturali (dopo H-1.3 pulito, prima o in parallelo al pilota)

### P2.1 — D14: generatore viste ROADMAP / HANDOFF

| Campo | Valore |
|---|---|
| **Priorità** | 🟡 P2 |
| **Problema** | `ROADMAP_V0.md` e `HANDOFF_SENIOR_V0.md` si allineano a mano → rischio stale (`R-T7-04`) |
| **Obiettivo** | Estendere `scripts/mss/views.mjs` + `generate:mss:views` (come cruscotto) |
| **Report** | `docs/Sessioni di lavoro/25-08-26/Report-t9-f4-r8-d14-portabilita-25-08-26.md` (D14 **BACKLOG**) |
| **Owner decisione** | `PLAN_V0.md` §16 / IDEA backlog D14 |
| **Gate** | `validate:mss:views` copre nuove viste; test V1 pattern |

---

### P2.2 — SK-7 / N4: controlli `mss:capsule` che non possono fallire

| Campo | Valore |
|---|---|
| **Priorità** | 🟡 P2 |
| **Problema** | `--check` con comando infallibile registra `pass` senza prova (limite M-C aperto) |
| **Obiettivo Opzione B** | Rifiutare o degradare controlli non falsificabili; documentare in validator |
| **Riferimenti** | `MANUALE_OPERATIVO_MSS_V0.md` §2.4 (limite M-C); `Report-controverifica-mc-24-08-26.md` |
| **Gate** | Test in `test:mss:tools`; capsula con controllo infallibile → warn/deny |

---

### P2.3 — R-T7-06: `--verify` non modifica `assertions[]` (Output)

| Campo | Valore |
|---|---|
| **Priorità** | 🟡 P2 — solo se Matteo vuole Opzione B anche qui |
| **Problema** | Rettifiche Output (es. SK4-ASSERT) richiedono amendment manuale |
| **Stato attuale** | **ACCETTATO** — SK4-ASSERT chiuso append-only T7 |
| **Opzione B** | Estendere `--verify` o nuovo flag per patch `assertions[]` con guardrail |
| **Report** | `docs/Sessioni di lavoro/25-08-26/Report-sk4-assert-t7-25-08-26.md` |
| **Rischio** | Scope motore; valutare costo/beneficio in seduta orchestratore |

---

### P2.4 — Atti T7 figli con controlli fail storici (non rewrite)

| Campo | Valore |
|---|---|
| **Priorità** | 🟢 P2 documentale |
| **Problema** | Capsule Hook/Readiness registrano fail storici (T7-H1-N2N3, F5-ALL) |
| **Azione** | **Non riscrivere** record finali; nota in report orchestratore; `--verify` amendment se serve |
| **Report readiness** | `docs/Sessioni di lavoro/25-08-26/Report-readiness-pilota-t7-25-08-26.md` |

---

## P3 — Pilota WP-1 (solo dopo P0 + P1 completi)

### P3.1 — Riapertura D27 (decisione Matteo)

| Campo | Valore |
|---|---|
| **Priorità** | 🔵 P3 — chat dedicata |
| **Stato** | `D27` **chiusa** = pilota rinviato; `WP-1` **NO-GO** |
| **Cosa serve** | Messaggio esplicito Matteo: «riapri D27 / autorizzo WP-1» |
| **Owner** | `PLAN_V0.md` decisioni D25–D27 |

---

### P3.2 — Readiness pilota (checklist pre-istanza)

| Campo | Valore |
|---|---|
| **Priorità** | 🔵 P3 |
| **Protocollo** | `docs/MetaSkillSystem/PROTOCOLLO_PRIMO_PILOTA_V0_1.md` **1.0.1** |
| **Report readiness T7** | `docs/Sessioni di lavoro/25-08-26/Report-readiness-pilota-t7-25-08-26.md` |
| **Gate istanza 1** | 20 target, 14 fixture FX, revisore freddo ≠ autore, bundle **0.1.1/freeze-2** dall’apertura, **20/20 corretto** |
| **Non usare** | Report 001 / ciclo 09-08 come istanza 1 (calibrazione storica only) |

---

### P3.3 — Prima istanza pilota (WP-1)

| Campo | Valore |
|---|---|
| **Priorità** | 🔵 P3 — ultimo |
| **Tipo seduta** | Meta/deep sostanziale **nuova** |
| **Ruoli** | capture operator ≠ cold reviewer; Matteo = adjudicator |
| **Chiusura** | Report pilota + capsula + verdetto 20/20; append-only se fallisce |

---

## Fuori perimetro MSS (non mischiare con pilota)

| Voce | Nota |
|---|---|
| **`main` vs `env/test`** | ~127 commit app non rilasciati (`D26` prodotto in pausa) — seduta prodotto separata |
| **`SEP-G5`** | non PASS — Senior-Eval parallelo, non gate MSS core |
| **`src/` / Supabase / release** | esplicitamente fuori finché Matteo non riapre D26 |

---

## Mappa report → famiglia (indice rapido)

| Famiglia | Report principali | Agente / ciclo |
|---|---|---|
| Revisione T7 + Opzione B | `Report-revisione-indipendente-ciclo-t7-codex-25-08-26.md`, `Report-fix-m12-t7-codex-opzione-b-25-08-26.md` | Codex M12; Cursor fix |
| Orchestrazione T7 | `Report-orchestratore-t7-backlog-pilota-25-08-26.md` + 6 report famiglia | Cursor orchestratore |
| Orchestrazione T9 | `Report-orchestratore-t9-blindatura-struttura-25-08-26.md` + f1–f4 | Cursor orchestratore |
| SK-2 status | `Report-sk2-status-allineamento-t7-25-08-26.md` | Cursor T7-F1 |
| Hook Q/R | `Report-hook-qr-chiusura-t7-25-08-26.md` | Cursor T7-F2 |
| H13-E2 bypass | `Report-h13-e2-bypass-t7-25-08-26.md` | Cursor T7-F3 |
| SK4-ASSERT | `Report-sk4-assert-t7-25-08-26.md` | Cursor T7-F4 |
| Readiness pilota | `Report-readiness-pilota-t7-25-08-26.md` | Cursor T7-F5 |
| T6 SK-4/SK-8 | `Report-revisione-indipendente-ciclo-t6-codex-24-08-26.md` (24-08-26) | Codex + firma Matteo |
| SK-10 / R8 | `Report-md-portabilita-24-08-26.md`, `Report-t9-f4-r8-d14-portabilita-25-08-26.md` | M-D; T9-F4 |
| M-G N3–N6 | `Report-controverifica-MG-24-08-26.md` | M12 MG |
| M-F viste | `Report-mf-viste-generate-24-08-26.md` | M-F cruscotto |

---

## Mandati suggeriti per orchestratore senior (bozza nomi)

| ID | Famiglia | Dipendenze | Esecutore suggerito |
|---|---|---|---|
| **M-T8** | Pubblicazione + PLAN owner + SK-10 firma | P0.1 verde | senior orchestrator |
| **M-E2-A** | no-verify / pre-commit | M-T8 | esecutore + M12 |
| **M-E2-B** | unstaged MSS | M-T8 | esecutore + M12 |
| **M-E2-C** | Cloud/Codex fallback | M-T8 | esecutore + M12 |
| **M-E2-D** | light enforcement | M-E2-A..C o parallelo | esecutore + M12 |
| **M-H13-PASS** | promozione H-1.3 owner | M-E2-* | orchestrator + firma Matteo |
| **M-D14** | ROADMAP/HANDOFF generate | M-H13-PASS (consigliato) | esecutore |
| **M-SK7-N4** | controlli falsificabili | opzionale | esecutore |
| **M-D27** | riapertura pilota | P0+P1 | **solo Matteo** |
| **M-WP1-INST1** | prima istanza pilota | M-D27 + readiness | 2 agenti + Matteo |

---

## Gate globali (ogni famiglia)

```powershell
npm run mss:status
npm run test:mss
npm run test:mss:tools
npm run validate:docs
npm run validate:mss:views
npm run validate:mss:all
git diff --check
```

Report chiusura: `validate:mss --require-capsule` sul report della famiglia.

---

## Cosa NON fare

- Non dichiarare **H-1.3 PASS pulito** prima di P1 completo (scelta B).
- Non aprire **WP-1** senza **D27** riaperta.
- Non riscrivere record `final` / capsule storiche.
- Non committare/pushare senza sì Matteo.
- Non aprire `src/`, DB, SK-10 reimplementazione, pilota e E2 nello stesso mandato.

---

## Handoff agente senior — prima azione

1. Leggere questo piano + `PROMPT_ORCHESTRATOR_MSS_24-08-26.md` §0–§2.
2. `npm run mss:status` — confermare T6/T8 e WT.
3. Attendere/esaminare esito Codex M12 Opzione B.
4. Preparare mandato **M-T8** (pubblicazione + SK-10 firma + PLAN).
5. Pianificare famiglie **M-E2-*** con perimetro Opzione B (enforcement reale).
6. Consegnare a orchestratore senior i prompt per famiglia (un report ciascuna).

---

*Generato 25-08-26 da seduta fix Opzione B. Non è owner: aggiornare `PLAN_V0.md` dopo ogni gate chiuso.*
