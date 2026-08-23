# Report test — fixture prove backlog hook/CLI

> **Non è un report di sessione.** Template per prove staged/pre-commit documentate in
> `docs/Sessioni di lavoro/23-08-26/Report-sk4-backlog-hook-cli-23-08-26.md`.
> Per riprodurre: copia in un path sotto `docs/Sessioni di lavoro/<GG-MM-AA>/`, `git add`, lancia il comando.

| Scenario | Contenuto | Comando | Esito atteso |
|---|---|---|---|
| B2 undeclared | nessuna capsula, nessuna `Modalità:` | `cli.mjs --mode staged` | pass (exit 0) |
| B2 + flag | stesso file staged | `cli.mjs --mode staged --require-capsule` | deny `MSS-REPORT-NO-CAPSULE` (exit 1) |
| deep | `**Modalità:** deep`, senza capsula | `cli.mjs --mode staged` | deny (exit 1) |
| hook Q/R | deep in sotto-cartella, R1 vuota | `fine-sessione-commit-check.mjs` | `report incompleto` (exit 1) |
