# Report test — fixture prove backlog hook/CLI

Artefatto di prova per `Report-sk4-backlog-hook-cli-23-08-26.md`. Non è un report di chiusura sessione.

| Scenario | Contenuto | Comando | Esito atteso |
|---|---|---|---|
| B2 undeclared | nessuna capsula, nessuna `Modalità:` | `cli.mjs --mode staged` | pass (exit 0) |
| B2 + flag | stesso file staged | `cli.mjs --mode staged --require-capsule` | deny `MSS-REPORT-NO-CAPSULE` (exit 1) |
| deep | `**Modalità:** deep`, senza capsula | `cli.mjs --mode staged` | deny (exit 1) |
| hook Q/R | deep in `sub/`, R1 vuota | `fine-sessione-commit-check.mjs` | `report incompleto` (exit 1) |

Per riprodurre: `git add` questo file con il contenuto dello scenario, poi lanciare il comando indicato.
