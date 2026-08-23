# Indice sessione MSS — 23-08-26

> **Ingresso unico** per riprendere il lavoro senior / coordinamento post-ciclo parallelo.
> Lo **stato owner** vive in `docs/MetaSkillSystem/PLAN_V0.md` §4-bis; le viste
> `ROADMAP_V0.md` e `HANDOFF_SENIOR_V0.md` puntano qui.

## Cappello (stato al 23-08-26)

| Pacchetto | Stato owner | Cosa resta |
|---|---|---|
| `SK-6` | **CHIUSO** (D16) | — |
| `SK-4` | **PROVATO** | Chiusura formale Matteo + commit |
| `SK-11` | **A1–A4 IMPLEMENTATI** | Revisione A5 + chiusura Matteo |
| `SK-5` | **NON INIZIATO** | Dopo SK-11 chiuso |
| Senior docs | **COMPLETATO** | Stop-hook #2, ROADMAP/HANDOFF, hook fix |

**Branch:** `env/test` · **HEAD committato:** `eee6cf7` · **Working tree:** diff SK-4 + SK-11 + docs (non committato)

**Test verificati:** `npm run test:mss` (42+32) · `npm run test:mss:tools` (9) — exit 0

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

### Chiusura senior (4ª chat parallela)

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
| Senior / template | `ROADMAP_V0.md`, `HANDOFF_SENIOR_V0.md`, hook `fine-sessione-senior.mjs`, `_skill-system-v0/` |

---

## Backlog documentato (non blocca SK-4)

1. Hook `.cursor/hooks/fine-sessione-commit-check.mjs` — audit Q/R report staged ancora con regex `[^/]+` (R1).
2. `--require-capsule` non propagato su percorso CLI staged (R1).
3. `PLAN_V0.md` §539 — testo «`adapter.mjs` non si tocca fuori da SK-4» da ammorbidire post-PROVATO.

---

## Sequenza consigliata (post-sessione)

```text
1. Matteo → SK-4 CHIUSO? (R1 = accetta)
2. Commit + push working tree 23-08-26 (se sì)
3. Codex → A5 SK-11 → SK-11 CHIUSO → SK-5 CI
4. SK-7 (mss:capsule) — dopo SK-5
```

---

## Ripresa chat senior — cosa fare

**Non** rifare SK-6 né Wave 1 SK-4. Il senior prossimo:

1. Legge `HANDOFF_SENIOR_V0.md` §3 e questo indice.
2. Coordina **chiusura formale** SK-4/SK-11 con Matteo (gate, non codice).
3. Propone **strategia commit** (un commit vs split SK-4 / SK-11 / docs).
4. Aggiorna `PLAN_V0.md` §4-bis quando Matteo dichiara CHIUSO.
5. Opzionale: ticket backlog hook Q/R come mini-task separato.

---

## Decisioni chiuse — non riaprire

`D16`–`D19` · `G1`–`G6` SK-4 · `D15` (no plan directory) · gate SEP/WP invariati.
