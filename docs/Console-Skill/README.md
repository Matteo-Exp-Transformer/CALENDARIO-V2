# Console-Skill — skill system del branch `feature/console-super-admin`

> Sistema documentale che orienta gli agenti AI che lavorano alla **Console super-admin** di Matteo,
> con le regole operative di **Cristiano** (sviluppatore). Su questo branch **sostituisce** le regole
> operative di Matteo; le sue altre skill in `docs/` restano riferimento in sola lettura.
> Istanza del template `_skill-system-v0/`.

## Da dove si parte

1. `.claude/CLAUDE.md` (root) — master del branch, caricato in automatico da Claude Code.
2. **`00_BUSSOLA_CONSOLE.md`** — Skill 0: profili, routing, regole d'oro, LOCK. **Leggila per prima.**
3. `context/` — le mappe di dettaglio (modello dati, architettura `console/`).
4. `comunicazione/` — vocabolario + stile.
5. `docs/Servizio-Config/` — contesto prodotto della Console (cosa deve fare).

## Le 4 regole d'oro (sempre attive)

1. **Solo TEST** `docnnernvp` — `get_project_url` prima di ogni scrittura DB; se PROD → stop.
2. **Scrivo solo** sui tenant sandbox `console-classic` / `console-pro`.
3. **Schema → plan per matteo** (mai DDL dall'agente).
4. **Codice solo in `console/`** — `src/`/`supabase/` sola lettura, niente import da `../src`.

## Indice file

| File | A cosa serve |
|------|--------------|
| `00_BUSSOLA_CONSOLE.md` | orientamento, profili, routing, LOCK |
| `context/CONSOLE_DATA_MODEL_CONTEXT.md` | `organizations`, `edition`, `tenant_features`, `restaurant_settings` |
| `context/CONSOLE_APP_CONTEXT.md` | architettura `console/`, sicurezza, deploy |
| `comunicazione/VOCABOLARIO.md` | parole-comando (riuso Matteo + «plan per matteo») |
| `comunicazione/COMUNICAZIONE_SKILL.md` | stile didattico |
| `plan-per-matteo/README.md` | convenzione + template per le modifiche DB di Matteo |
| `sessioni/SESSION_LOG.md` · `FOLLOW_UP.md` | memoria di sessione + debiti differiti |
