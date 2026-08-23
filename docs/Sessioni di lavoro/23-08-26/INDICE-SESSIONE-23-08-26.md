# Indice sessione MSS — 23-08-26

> **Ingresso unico** per riprendere il lavoro senior / coordinamento post-ciclo parallelo.
> Lo **stato owner** vive in `docs/MetaSkillSystem/PLAN_V0.md` §4-bis; le viste
> `ROADMAP_V0.md` e `HANDOFF_SENIOR_V0.md` puntano qui.

## Cappello (stato al 23-08-26, aggiornato Fase D)

| Pacchetto | Stato owner | Cosa resta |
|---|---|---|
| `SK-6` | **CHIUSO** (D16) | — |
| `SK-4` | **PROVATO** | Revisione integrata E + chiusura formale Matteo |
| `SK-11` | **A1–A4 IMPLEMENTATI** | Revisione integrata E; chiusura Matteo |
| `SK-5` / D1-A | **implementazione `self_report` (Fase C)** | Revisione integrata E; GA remota non osservata |
| Post-revisione B/C/D | **B/C esecutori conclusi; D documentale conclusa** | **Unico gate = revisione integrata E** |
| Senior docs | **COMPLETATO** | Stop-hook #2, ROADMAP/HANDOFF (viste aggiornate Fase D) |

**Branch:** `env/test`
**HEAD committato storico (M1):** `d1598b6` — mantenuto senza rewrite
**`origin/env/test`:** `eee6cf7` · divergenza `0 1` (commit locale non pushato)
**Modifiche B/C tracked non committate:** `.github/workflows/ci.yml`, `validate-changed-reports.mjs`, `query.mjs`, suite tools

**Evidenza ambientale `validate:docs`:** **17 path rotti** nel workspace corrente; **26** in checkout CI-like pulito (9 riferimenti a file privati/gitignored assenti dal clone) — debito documentale visibile, non corretto in D.

**GitHub Actions reale:** non ancora osservata (prove B/C locali `self_report`).

**Test verificati (ultimo ciclo esecutori, non promossi):** `npm run test:mss` (42+32) · `npm run test:mss:tools` (16 post-B) — exit 0 in report esecutori

---

## Mandati completati

### SK-4 (Cursor) — tre bypass enforcement

| ID | Documento |
|---|---|
| Piano owner | [`PLAN-CURSOR-SK-4-23-08-26.md`](./PLAN-CURSOR-SK-4-23-08-26.md) §9 |
| Handoff coordinatore | [`HANDOFF-CURSOR-SK-4-23-08-26.md`](./HANDOFF-CURSOR-SK-4-23-08-26.md) |
| Report ciclo | [`Report-ciclo-SK-4-23-08-26.md`](./Report-ciclo-SK-4-23-08-26.md) |
| Revisione R1 | [`Report-sk4-revisione-indipendente-23-08-26.md`](./Report-sk4-revisione-indipendente-23-08-26.md) |
| Prompt (archivio) | `Prompt-sk4-e1-…` … `Prompt-sk4-revisione-…` |

### SK-11 + SK-5 (Codex) — test attrezzi + CI

| ID | Documento |
|---|---|
| Piano owner | [`PLAN-CODEX-SK-11-SK-5-23-08-26.md`](./PLAN-CODEX-SK-11-SK-5-23-08-26.md) |
| Handoff Codex | [`HANDOFF-CODEX-SK-11-SK-5-23-08-26.md`](./HANDOFF-CODEX-SK-11-SK-5-23-08-26.md) |
| Report ciclo | [`Report-ciclo-SK-11-SK-5-23-08-26.md`](./Report-ciclo-SK-11-SK-5-23-08-26.md) |
| Avvio | [`Prompt-avvio-CODEX-SK-11-SK-5-23-08-26.md`](./Prompt-avvio-CODEX-SK-11-SK-5-23-08-26.md) |

### Revisione indipendente + piano post-revisione (23-08-26)

| ID | Documento |
|---|---|
| Revisione Codex GPT-5 | [`Report-senior-revisione-complessiva-23-08-26.md`](./Report-senior-revisione-complessiva-23-08-26.md) |
| Revisione Cursor/Grok | [`Report-revisione-indipendente-sessione-mss-23-08-26.md`](./Report-revisione-indipendente-sessione-mss-23-08-26.md) |
| Piano rimanenze | [`PLAN-POST-REVISIONE-RIMANENZE-23-08-26.md`](./PLAN-POST-REVISIONE-RIMANENZE-23-08-26.md) |
| Fase B (`self_report`) | [`Report-fase-b-fix-regex-query-23-08-26.md`](./Report-fase-b-fix-regex-query-23-08-26.md) |
| Fase C (`self_report`) | [`Report-fase-c-ci-d1-23-08-26.md`](./Report-fase-c-ci-d1-23-08-26.md) |
| Fase D (documentale) | [`Report-fase-d-docs-amendment-23-08-26.md`](./Report-fase-d-docs-amendment-23-08-26.md) |

### Chiusura senior (4ª chat parallela) — snapshot 23-08-26 mattina

> **Snapshot storico:** riflette `eee6cf7`/working tree pre-`d1598b6`. Non usarlo come vista corrente dello stato tecnico B/C.

| ID | Documento |
|---|---|
| Mandato | [`Prompt-senior-chiusura-sessione-23-08-26.md`](./Prompt-senior-chiusura-sessione-23-08-26.md) |
| Report | [`Report-senior-chiusura-sessione-23-08-26.md`](./Report-senior-chiusura-sessione-23-08-26.md) |

---

## Codice toccato (perimetro sessione)

| Area | File principali |
|---|---|
| SK-4 enforcement | `scripts/mss/adapter.mjs`, `git-adapter.mjs`, `core.mjs`, `rules.mjs`, `query.mjs` (import regex) |
| SK-4 contratto | `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md` |
| SK-4 fixture | `docs/MetaSkillSystem/fixtures/v0.1/FX-I11-legacy-new.jsonl` |
| SK-11 tools | `scripts/mss/runtime.mjs`, `docs/MetaSkillSystem/tests/tools/**`, `package.json` |
| Fase B/C | `validate-changed-reports.mjs`, `query.mjs`, suite tools, `.github/workflows/ci.yml` |
| Senior / template | `ROADMAP_V0.md`, `HANDOFF_SENIOR_V0.md`, hook `fine-sessione-senior.mjs`, `_skill-system-v0/` |

---

## Backlog documentato (non blocca revisione E)

1. Hook `.cursor/hooks/fine-sessione-commit-check.mjs` — audit Q/R report staged ancora con regex `[^/]+` (R1).
2. `--require-capsule` non propagato su percorso CLI staged (R1).
3. `PLAN_V0.md` §539 — testo «`adapter.mjs` non si tocca fuori da SK-4» da ammorbidire post-PROVATO.
4. Debito `validate:docs` 17 workspace / 26 checkout pulito — visibile, non allowlistato in D.

---

## Sequenza consigliata (post-revisione, aggiornata Fase D)

```text
1. Revisione integrata E (unico gate tecnico/documentale autorizzato)
2. Gate locale completo (diff-check base/head, test:mss, validate:docs baseline reale)
3. Decisione Matteo su commit documentale + commit tecnico B/C + push (M2: solo dopo E verde)
4. Prova GitHub Actions reale post-push
```

~~3. Codex → A5 SK-11 → SK-11 CHIUSO → SK-5 CI~~ → **obsoleto:** A5 e SK-5 esecutivi già nei report ciclo; B/C hanno esteso perimetro.
~~4. SK-7 (mss:capsule) — dopo SK-5~~ → **non prossimo passo:** dopo E e push, non prima.

---

## Ripresa chat — cosa fare

1. Legge `HANDOFF_SENIOR_V0.md` §3 e questo indice.
2. **Non** rifare SK-6, Wave 1 SK-4, Fasi B/C/D.
3. Esegue **revisione integrata E** (`Prompt-fase-e-revisione-fix-23-08-26.md`).
4. Aggiorna `PLAN_V0.md` §4-bis **solo** quando Matteo dichiara CHIUSO dopo E.

---

## Decisioni chiuse — non riaprire

`M1`–`M3` · `D16`–`D19` · `D1-A` (job MSS separato) · `G1`–`G6` SK-4 · `D15` (no plan directory) · gate SEP/WP invariati.
