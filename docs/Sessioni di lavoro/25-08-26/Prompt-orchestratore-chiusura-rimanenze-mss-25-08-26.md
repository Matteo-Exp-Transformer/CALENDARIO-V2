# Prompt orchestratore senior — chiusura rimanenze MSS (T8 → E2 Opzione B)

> **Per:** agente senior Cursor (orchestratore MSS), con sub-agent per esecuzione e revisione interna.
> **Branch:** `env/test` · **HEAD atteso:** `3c3677d` o successivo (fix Opzione B + report M12 già committati localmente).
> **Owner stato:** `docs/MetaSkillSystem/PLAN_V0.md` (gate **`T8`**, poi famiglie **E2**; `D27`/`WP-1` invariati).
> **Piano operativo:** [`PLAN-CHIUSURA-RIMANENZE-MSS-25-08-26.md`](PLAN-CHIUSURA-RIMANENZE-MSS-25-08-26.md)
> **Mandato vivo:** [`PROMPT_ORCHESTRATOR_MSS_24-08-26.md`](../../MetaSkillSystem/PROMPT_ORCHESTRATOR_MSS_24-08-26.md) §5–§6
> **Non eseguire push** salvo «sì» esplicito di Matteo.

---

## Decisioni Matteo (25-08-26 — vincolanti per questo ciclo)

1. **Opzione B su H-1.3 / E2:** non accettare bypass documentati — **chiudere davvero** (`--no-verify`, unstaged, Cloud/Codex/Claude senza hook, light fail-open). Enforcement **misurato** (test + CI), non prosa di accettazione.
2. **SK-10:** prove già agli atti — **firma e CHIUSO definitivo** in seduta M-T8 (niente «PROVATO» appeso).
3. **Codex M12 Opzione B:** ✅ **PULITO** — [`Report-controverifica-indipendente-fix-m12-t7-codex-25-08-26.md`](Report-controverifica-indipendente-fix-m12-t7-codex-25-08-26.md); commit locali `0a86c81` + `3c3677d`; **2 commit avanti** rispetto a `origin/env/test`.
4. **WP-1 / pilota:** solo dopo P0+P1 completi + **riapertura esplicita `D27`** in chat dedicata.

---

## Intestazione agente (obbligatoria)

```
Profilo: Meta (orchestratore senior MSS)
Modalità: deep
Skill da leggere:
  - docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md
  - docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md
  - docs/MetaSkillSystem/PROMPT_ORCHESTRATOR_MSS_24-08-26.md (§5–§6)
  - docs/Sessioni di lavoro/25-08-26/PLAN-CHIUSURA-RIMANENZE-MSS-25-08-26.md
  - docs/MetaSkillSystem/PLAN_V0.md §4 · §4-bis · §4-ter · §15
  - docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md (chiusura report)
Non caricare: corpus storico non puntato · src/ · Supabase · esecuzione WP-1 · D26 prodotto
```

---

## Ruolo

Sei **orchestratore**, non l'unico martello. Modello di riferimento: ciclo **T7** ([`Prompt-orchestratore-cursor-t7-backlog-pilota-25-08-26.md`](Prompt-orchestratore-cursor-t7-backlog-pilota-25-08-26.md)) e chiusure **T6 Codex** con firma Matteo.

**Primo compito economico:** due blocchi sequenziali — **`M-T8`** (pubblicazione + governance) poi **`M-E2-*`** (4 famiglie enforcement reale) — ciascuno = **un report + una capsula**. Mai un report per riga di codice.

Matteo ha scelto **Opzione B**: l'orchestratore **non** può chiudere H-1.3 promuovendo bypass a «intenzionali accettati». Ogni famiglia E2 deve consegnare **fix dimostrato** o **stop motivato** con perimetro minimo esplicito.

---

## Cosa leggere (ordine, poi stop)

| # | File | Perché |
|---|---|---|
| 1 | `MANUALE_OPERATIVO_MSS_V0.md` | comandi, owner vs vista, attrezzi |
| 2 | `PLAN-CHIUSURA-RIMANENZE-MSS-25-08-26.md` | sequenza P0–P3, gate, famiglie |
| 3 | `PROMPT_ORCHESTRATOR_MSS_24-08-26.md` §5–§6 | orchestrazione + controverifica |
| 4 | `PLAN_V0.md` §4 · §4-bis · §15 | owner autorevole, riserve T7/T9 |
| 5 | `COVERAGE_MATRIX_H1.json` | bypass E2 (`known_bypass`, flags globali) |
| 6 | `Report-h13-e2-bypass-t7-25-08-26.md` | inventario storico; B-E2-CI già chiuso |

Poi: `npm run mss:status` · `npm run validate:mss:all`

**Non copiare numeri mobili nel PLAN.** I conteggi si citano come comando.

---

## Cappello verificato (Passo 0 atteso)

| Fatto | Evidenza |
|---|---|
| Ultimo ciclo chiuso **T6**; prossimo **T8** | `npm run mss:status` |
| Fix Opzione B F1–F3 committati localmente, non su `origin` | `git log origin/env/test..HEAD` → 2 commit |
| M12 Codex **PULITO** su F1–F3 | report controverifica 25-08-26 |
| `H-1.3` = **PASS_CON_RISERVE**; `WP-1` = **NO-GO** | owner §4 |
| `SK-10` = **PROVATO** → Matteo firma **CHIUSO** in M-T8 | decisione 25-08-26 |
| `R-T9-01/02/03` tecnicamente chiusi da Opzione B, owner stale | PLAN § riserve T9 |

---

## Sequenza mandati (vincolante)

```
M-T8          pubblicazione + owner + firma SK-10     (P0 — tu + Matteo)
    ↓
M-E2-A        --no-verify / pre-commit               (P1.1)
M-E2-B        unstaged / worktree MSS                  (P1.2)  ← può parallelizzare con A se perimetro disgiunto
M-E2-C        Cloud/Codex/Claude fallback              (P1.3)
    ↓
M-E2-D        light enforcement (R-T7-05)              (P1.4)  ← dopo A–C o in parallelo se non confligge
    ↓
M-H13-PASS    promozione H-1.3 owner + matrice         (P1.5)  ← solo se E2-* chiuse o stop documentati
```

**Fuori perimetro questo ciclo:** `M-D27`, `M-WP1-INST1`, `M-D14`, `M-SK7-N4`, `M-R-T7-06` (P2 — backlog orchestratore, non eseguire senza sì).

| ID | Famiglia | Dipendenze | Esecutore | Revisore |
|---|---|---|---|---|
| **M-T8** | Pubblicazione + PLAN owner + SK-10 firma | M12 verde ✅ | **tu** (orchestratore) | Codex già fatto; tu §6 |
| **M-E2-A** | no-verify / pre-commit | M-T8 pushato | Sonnet/Opus | famiglia diversa o Codex a fine blocco |
| **M-E2-B** | unstaged MSS | M-T8 | Sonnet | idem |
| **M-E2-C** | Cloud/Codex fallback | M-T8 | Sonnet/Opus | idem |
| **M-E2-D** | light enforcement | M-E2-A..C consigliato | Sonnet | idem |
| **M-H13-PASS** | H-1.3 → PASS pulito | M-E2-* | **tu** + firma evidenza | M12 mirato |

**Budget report:** M-T8 ≤ 200 righe; ciascuna famiglia E2 ≤ 250 righe; orchestratore finale E2 ≤ 180 righe.

---

## STOP globali

- Nessun commit/push senza sì esplicito di Matteo (**T8 = push** richiede sì).
- **`WP-1` resta NO-GO** — nessuna istanza pilota, nessuna riapertura `D27` implicita.
- **`H-1.3` PASS pulito** vietato finché **M-H13-PASS** non chiude P1.1–D (scelta B).
- **SK-10:** in M-T8 solo **governance + firma** — nessuna reimplementazione export/portabilità.
- **Prodotto:** nessun lavoro su `src/`, merge `main`, release (`D26`).
- **Nessuna riscrittura** record `final` (solo `amendment` / `--verify`).
- **Nessun allentamento validator** · **nessuna allowlist D21**.
- **Un mandato = una famiglia = un report = una capsula.**
- **`--no-verify` è feature Git:** obiettivo realistico = policy repo + test/CI che misurano il buco residuo **e** enforcement su ciò che è controllabile — non promettere E3 totale.

---

## Flusso obbligatorio (quattro fasi)

### Fase 0 — Passo 0 (tu, prima di tutto)

```powershell
git rev-parse HEAD
git status --porcelain
git log --oneline origin/env/test..HEAD
npm run mss:status
npm run validate:mss:all
```

Annota HEAD nel report orchestratore. Se branch ≠ `env/test`, **fermati**.

### Fase 1 — Plan (tu, in chat, prima degli esecutori)

Scrivi plan visibile con:

1. Ordine mandati (tabella sopra).
2. Per ogni **M-E2-***: scope minimo **dimostrato** (Opzione B) — cosa chiudi, cosa resta buco umano esplicito in matrice.
3. Modello per sub-agent (meccanico → Sonnet; hook/core/pre-commit → Opus se serve).
4. Criteri revisore (famiglia diversa quando possibile; avviso `D17` se stessa famiglia).
5. Stima report (M-T8 + fino a 4 E2 + 1 H13 + 1 orchestratore E2 = **≤ 7 report**).

**Non passare alla Fase 2 senza plan.**

### Fase 2 — M-T8 (tu, prima di qualsiasi E2)

Vedi sezione **M-T8** sotto. Al termine: chiedi a Matteo il **sì al push** se non già dato.

### Fase 3 — Esecutori E2 (sub-agent, una famiglia per volta)

Per ogni **M-E2-***: prompt figlio § «Scheletri prompt figli». Consegna: diff + **un** report + judgments + capsula.

Revisore interno **prima** di promuovere famiglia chiusa.

### Fase 4 — Controverifica orchestratore (tu, §6)

Per **ogni** mandato:

1. `git diff` reale — esiste? perimetro rispettato?
2. Riesegui **tu** i comandi in `controls[]`.
3. `npm run validate:mss -- --mode file --file "<report>" --kind report --require-capsule` → exit 0.
4. `npm run validate:mss:all` verde.
5. Ogni bypass dichiarato chiuso: **test nominato?**
6. Chiudi **tu** con `mss:capsule` (mai header capsula a mano).

Aggiorna owner · `npm run generate:mss:views` · `npm run validate:mss:views`.

---

## M-T8 — Pubblicazione + owner + firma SK-10

**Chi:** orchestratore (non delegare interamente).

### M-T8.1 — Pubblicazione (gate T8)

| Campo | Valore |
|---|---|
| **Stato** | 2 commit locali non su `origin` (`0a86c81` fix, `3c3677d` docs) |
| **Cosa fare** | Verificare `validate:mss:all` verde; **chiedere sì Matteo**; `git push origin env/test` |
| **Gate post-push** | Job CI `mss` verde su GitHub Actions (`SK-5`) — osservato, non dedotto |
| **Riserva** | Chiudere **R-T7-01** e **R-T7-02** in owner dopo push |

**Non fare:** push senza sì · merge altri branch · commit extra non necessari.

### M-T8.2 — Allineare owner post-Opzione B

| Campo | Valore |
|---|---|
| **Problema** | § PLAN elenca **R-T9-01/02/03** ancora aperti |
| **Azione** | Segnare **CHIUSE** con puntatore a report fix + controverifica M12 |
| **Non fare** | Promuovere **H-1.3** a PASS pulito (serve blocco E2) |
| **Gate** | `npm run validate:mss:views` verde |

Aggiornamenti suggeriti in `PLAN_V0.md`:

- R-T9-01/02/03 → CHIUSE (Opzione B F1–F3).
- Ciclo **T8** → CHIUSO dopo push osservato + CI verde.
- Prossimo gate owner: indicare lavoro **E2** / H-1.3 (non WP-1).

### M-T8.3 — SK-10: firma Matteo → CHIUSO

**Stato attuale:** PROVATO (`M-D`); riserva **N6** chiusa (`M-G`).

**Prove già agli atti (rieseguire, non rifare da zero):**

| Prova | Report |
|---|---|
| P2A manuale | `MANUALE_OPERATIVO_MSS_V0.md`; `Report-p2a-manuale-mss-23-08-26.md` |
| P2B export + doctor | `Report-md-portabilita-24-08-26.md` |
| N6 chiuso | `Report-controverifica-MG-24-08-26.md` |
| R8 T9 | `Report-t9-f4-r8-d14-portabilita-25-08-26.md` |

**Checklist seduta (mostly governance):**

```powershell
npm run mss:doctor          # atteso exit 0
npm run mss:export -- --help
```

1. Rieseguire comandi sopra — exit 0.
2. **Firma verbatim Matteo** nel report chiusura SK-10 (modello firma SK-4/SK-8 T6).
3. `PLAN_V0.md` §4-bis **S10** → `CHIUSO`.
4. `MANUALE_OPERATIVO_MSS_V0.md` header: `R8`/`SK-10` non più «PROVATO».
5. **Un** report: `Report-chiusura-sk10-firma-matteo-25-08-26.md` + capsula.

**Non aprire:** nuove feature export; portabilità oltre atti.

### Deliverable M-T8

- Push (con sì) + CI osservata.
- Owner + cruscotto rigenerato.
- Report SK-10 firma + capsula.
- **Un** report orchestratore M-T8: `Report-orchestratore-m-t8-pubblicazione-sk10-25-08-26.md`.

---

## Famiglie E2 — Opzione B (dopo M-T8)

Fonte bypass: `COVERAGE_MATRIX_H1.json` (`known_bypass`, `bypass_no_verify_and_unstaged`, `stop_does_not_cover_cloud_codex_claude`).

Report storico: [`Report-h13-e2-bypass-t7-25-08-26.md`](Report-h13-e2-bypass-t7-25-08-26.md) (B-E2-CI già chiuso).

### M-E2-A — `--no-verify` e pre-commit

| Campo | Valore |
|---|---|
| **Problema** | `git commit --no-verify` bypassa Husky/pre-commit |
| **Obiettivo B** | Enforcement misurabile: CI/pre-commit che non dipende solo da buona volontà; test che dimostra commit/report incompleto **non** passa il cancello MSS |
| **File probabili** | `.husky/pre-commit`, `scripts/mss/validate-changed-reports.mjs`, `COVERAGE_MATRIX_H1.json`, `docs/MetaSkillSystem/tests/h1/run.mjs` |
| **Gate** | Test nominato H13-E2 / no-verify; matrice aggiornata; nessun `known_bypass` stale su percorsi chiusi |
| **Scope minimo** | Scegli **(a)** policy + test documentano buco umano residuo **oppure** **(b)** wrapper/gate CI — **dimostra**, non promettere |

### M-E2-B — unstaged / worktree

| Campo | Valore |
|---|---|
| **Problema** | File MSS modificati non staged escono dal pre-commit |
| **Obiettivo B** | Estendere perimetro staged/worktree (coerente SK-4 B2/B3) |
| **File probabili** | `scripts/mss/adapter.mjs`, `validate-changed-reports.mjs`, test SK-4 / H-1.3 |
| **Gate** | Test: modifica report non staged → deny; matrice aggiornata |
| **Riferimento** | `Report-sk4-assert-t7-25-08-26.md` |

### M-E2-C — Cloud / Codex / Claude senza hook stop

| Campo | Valore |
|---|---|
| **Problema** | Hook `stop` non gira su Cloud Agents |
| **Obiettivo B** | Fallback: checklist obbligatoria + validazione post-hoc in CI (`validate-changed-reports` su report recenti) |
| **Riferimenti** | `CHIUSURA_SESSIONE.md`; `_skill-system-v0/hooks/README.md`; `Report-hook-qr-chiusura-t7-25-08-26.md` |
| **Gate** | Test/CI fallisce se report standard/deep merged senza capsula; skill aggiornata |
| **Nota** | Non promettere hook Cloud — chiudere con **E2 alternativo misurato** |

### M-E2-D — light fail-open (R-T7-05)

| Campo | Valore |
|---|---|
| **Problema** | Report **light** senza capsula: hook tace (fail-open) |
| **Obiettivo B** | Regola light: JSONL evento + riga `SESSION_LOG.md`; deny se light dichiara chiusura senza evento |
| **Riferimento** | `Report-t9-f2-r4-r7-automazioni-25-08-26.md` |
| **Gate** | Test R4 aggiornato da fail-open a enforcement light; fixture FX-V02 coerente |

### M-H13-PASS — promozione owner (ultimo passo P1)

| Campo | Valore |
|---|---|
| **Quando** | Solo dopo M-E2-A..D chiuse **o** stop motivati per bypass residui |
| **Azione** | `PLAN_V0.md` §4 H-1.3 → PASS pulito; `COVERAGE_MATRIX_H1.json` bypass chiusi rimossi/reclassificati; chiudere **R-T7-03** se applicabile |
| **Gate** | `npm run test:mss` verde; matrice coerente; report + M12 mirato |
| **Vietato** | Promuovere prima del blocco E2 |

---

## Scheletri prompt figli (copia-incolla per sub-agent)

Ogni prompt figlio deve contenere: intestazione profilo · perimetro file · comandi gate · deliverable path report · divieti · budget righe.

### Template M-E2-A (esempio — adatta per B/C/D)

```markdown
# Mandato M-E2-A — no-verify / pre-commit (Opzione B)

Profilo: Esecuzione Meta MSS · deep
Branch: env/test @ HEAD post-M-T8
Leggi SOLO: MANUALE §pre-commit · COVERAGE_MATRIX_H1.json · validate-changed-reports.mjs · .husky/pre-commit · Report-h13-e2-bypass-t7 (inventario)

Obiettivo Opzione B: enforcement misurabile su commit MSS senza --no-verify (o documentazione testabile del buco residuo + CI che non dipende solo da hook locale).

In perimetro: .husky/pre-commit, scripts/mss/validate-changed-reports.mjs, tests h1/tools, COVERAGE_MATRIX_H1.json
Fuori: src/, DB, WP-1, promozione H-1.3 PASS, riscrittura record final

Deliverable: un report docs/Sessioni di lavoro/25-08-26/Report-e2-a-no-verify-25-08-26.md + judgments + mss:capsule
Gate: npm run test:mss; test nominato che cita H13-E2 e no-verify; validate:mss:all
Budget report: ≤ 250 righe
```

(Replicare struttura per **M-E2-B** … **M-E2-D** sostituendo obiettivo/file/gate della tabella famiglie.)

---

## Report orchestratore (obbligatori)

| Mandato | Path report |
|---|---|
| M-T8 | `docs/Sessioni di lavoro/25-08-26/Report-orchestratore-m-t8-pubblicazione-sk10-25-08-26.md` |
| Blocco E2 (fine) | `docs/Sessioni di lavoro/25-08-26/Report-orchestratore-e2-opzione-b-25-08-26.md` |

Sezioni: cappello · Passo 0 · plan adottato · tabella famiglie (esecutore/revisore/M12) · gate §6 · owner/cruscotto · handoff Codex · §11 Q1–Q6 (`CHIUSURA_SESSIONE.md`).

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

Chiusura report: `npm run validate:mss -- --mode file --file "<report>" --kind report --require-capsule`

---

## Criterio successo (per Matteo)

1. **T8** pubblicato con CI `mss` osservata verde; **SK-10 CHIUSO** con firma verbatim.
2. Owner allineato (R-T9-01/02/03 chiuse; H-1.3 **non** promosso prima di E2).
3. Famiglie E2: **≤ 4 report** + enforcement reale Opzione B (test nominati per ogni bypass chiuso).
4. **M-H13-PASS:** H-1.3 PASS pulito solo se matrice e test lo sostengono.
5. **WP-1 / D27** non aperti; atti pronti per eventuale M12 Codex su blocco E2.
6. Totale report ciclo **≤ 7** (+ SK-10 chiusura), non micro-report sparsi.

**Commit/push T8:** solo con sì esplicito Matteo.

---

## Messaggio verbatim Matteo (25-08-2026, seduta pianificazione)

«Ha scelto Opzione B (E2 reale) e firma SK-10. Organizza mandati M-T8 poi M-E2-*; prepara prompt per orchestratore senior.»

---

## Riferimenti rapidi

| Artefatto | Path |
|---|---|
| Piano chiusura | `PLAN-CHIUSURA-RIMANENZE-MSS-25-08-26.md` |
| Fix Opzione B esecutore | `Report-fix-m12-t7-codex-opzione-b-25-08-26.md` |
| Controverifica M12 | `Report-controverifica-indipendente-fix-m12-t7-codex-25-08-26.md` |
| Orchestrazione T7 | `Report-orchestratore-t7-backlog-pilota-25-08-26.md` |
| Orchestrazione T9 | `Report-orchestratore-t9-blindatura-struttura-25-08-26.md` |
| Firma modello SK-4/SK-8 | `Report-revisione-indipendente-ciclo-t6-codex-24-08-26.md` |
| Matrice H-1 | `docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json` |
