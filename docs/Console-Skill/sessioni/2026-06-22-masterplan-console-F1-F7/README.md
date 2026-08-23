# Cartella di lavoro — 2026-06-22 · Master-plan Console F1→F7

> Archivio **autoconsistente** della sessione del 2026-06-22: hand-off per la prossima chat +
> snapshot di tutta la tracciabilità e dei plan per Matteo. Gli originali "vivi" restano in
> `docs/Console-Skill/` e `docs/Console-Skill/sessioni/`: qui c'è la **fotografia** allo stato di
> fine ciclo, così il lavoro svolto è ricostruibile da una sola cartella.

## Cosa contiene

| File | Cos'è |
|------|-------|
| [HANDOFF-prossima-chat.md](HANDOFF-prossima-chat.md) | **Prompt pronto** da incollare nella prossima sessione + contesto sintetico e prossime mosse |
| [../../MASTERPLAN_CONSOLE.md](../../MASTERPLAN_CONSOLE.md) | Master-plan a 7 fasi (copia viva; snapshot tracciabilita rimosso D18) |
| [../PHASE_AUDIT.md](../PHASE_AUDIT.md) | Audit trail per fase (copia viva; snapshot tracciabilita rimosso D18) |
| [tracciabilita/DECISION_LOG.md](tracciabilita/DECISION_LOG.md) | Registro decisioni DEC-001→031 |
| [tracciabilita/FOLLOW_UP.md](tracciabilita/FOLLOW_UP.md) | Debiti differiti FU-CONSOLE-* |
| [tracciabilita/SESSION_LOG.md](tracciabilita/SESSION_LOG.md) | Indice cronologico sessioni |
| [tracciabilita/TRACCIABILITA.md](tracciabilita/TRACCIABILITA.md) | Indice del sistema di tracciabilità (RULE-5) |
| [plan-per-matteo/](plan-per-matteo/) | I 4 PLAN-DB (001 eseguito; 002/003/004 da eseguire da Matteo) |

## Esito della sessione

- **Ciclo automode F1→F7 completato**, tutte le fasi 🟢 VERDE, esecutore ≠ revisore.
- Commit: `c981fc0` (F1) → `49c0230` (F2) → `8ca16cf` (F3) → `bd7d038` (F4) → `37bd836` (F5) →
  `15da08a` (F6) → `52a1b62` (F7). **Pushati** su `origin/feature/console-super-admin`.
- Codice Console pronto e isolato in `console/`. Nessuna scrittura DB diretta dall'app: passano tutte
  dall'Edge Function, ristrette ai 2 sandbox.

## Cosa manca per l'uso reale (lato Matteo)

1. **PLAN-DB-003** — deploy Edge `console-admin` + secret + `VITE_CONSOLE_ADMIN_FUNCTION_URL`.
2. **PLAN-DB-002** — allowlist login lato DB/RLS.
3. **PLAN-DB-004** — policy SELECT per gli override reali di `tenant_features`.

Poi test E2E delle scritture sui sandbox. Dettagli nell'hand-off.
