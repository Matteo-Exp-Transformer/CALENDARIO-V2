# Handoff — coordinatore SK-4 (Cursor)

> Aggiornato: 23-08-26 (post-ciclo) · Owner stato: `PLAN-CURSOR-SK-4-23-08-26.md` §9 ·
> Owner globale: `PLAN_V0.md` §4-bis `S4`

## Stato ciclo

| Fase | Stato |
|---|---|
| Piano + prompt E1–E4 + R1 | ✅ completati |
| Decisioni G1–G6 | ✅ autorizzate 23-08-26 |
| Wave 1 (E1 ∥ E2 ∥ E3) | ✅ **COMPLETATO** |
| Wave 2 (E4 integrazione) | ✅ **COMPLETATO** |
| Wave 3 (R1 revisione) | ✅ **COMPLETATO** — raccomandazione **accetta** |
| Chiusura SK-4 (Matteo) | ⬜ **NON INIZIATO** |

## Esito tecnico (owner `PLAN_V0` §4-bis)

| Bypass | Esito |
|---|---|
| B1 legacy-new senza `controls` | `MSS-LEGACY-NEW-FORBIDDEN` |
| B2 report in sotto-cartella | deny staged (`MSS-REPORT-NO-CAPSULE`) |
| B3 prefisso `Verbale-` | deny staged |
| Regex condivisa | `REPORT_PATH_RE` in `adapter.mjs` → `git-adapter` + `query` |
| Contratto | `0.1.1` / `freeze-2` |
| Test | `npm run test:mss` — **42 fixture + 32 gruppi** exit 0 |

## Report per fase

| Fase | Report |
|---|---|
| E1 path | `Report-sk4-e1-perimetro-path-23-08-26.md` |
| E2 legacy | `Report-sk4-e2-legacy-core-23-08-26.md` |
| E3 contratto | `Report-sk4-e3-contratto-23-08-26.md` |
| E4 integrazione | `Report-ciclo-SK-4-23-08-26.md` |
| R1 revisione | `Report-sk4-revisione-indipendente-23-08-26.md` |

## Parallelo Codex (SK-11)

| Mandato | Stato | Conflitto SK-4 |
|---|---|---|
| `PLAN-CODEX-SK-11-SK-5` | A1–A4 implementati; A5 in attesa | Nessuno — `adapter.mjs` toccato solo da SK-4 (completato) |

## Prossimo passo

1. **Matteo:** dichiarare `SK-4` **CHIUSO** se accetta R1 → aggiornare `PLAN_V0.md` §4-bis.
2. **Commit/push** del working tree (non eseguiti dagli agenti).
3. Backlog R1 (non bloccante): hook Q/R regex; `--require-capsule` su staged CLI.

## Indice sessione

Vista trasversale (SK-4 + Codex + senior): `INDICE-SESSIONE-23-08-26.md`.
