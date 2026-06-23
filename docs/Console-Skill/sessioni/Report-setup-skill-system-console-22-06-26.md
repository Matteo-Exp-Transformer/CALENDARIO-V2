# Report — Setup skill system del branch Console (2026-06-22)

**Branch:** `feature/console-super-admin` · **Modalità:** deep · **Esito:** ✅

## Obiettivo
Riadattare lo skill system in questo branch perché gli agenti futuri lavorino alla **Console
super-admin** di Matteo con le regole operative di **Cristiano** (sviluppatore), sostituendo quelle
di Matteo *solo su questo branch*. Niente codice della Console: solo sistema documentale + setup.

## Cosa è stato fatto
- **`.claude/CLAUDE.md` riscritto** per il lavoro Console (instrada alla bussola; 4 regole d'oro;
  vocabolario riuso Matteo + «plan per matteo»; stile didattico; commit liberi sul branch).
- **Skill system `docs/Console-Skill/`** (istanza del template `_skill-system-v0/`):
  bussola `00_BUSSOLA_CONSOLE.md`, `context/` (modello dati reale + architettura `console/`),
  `comunicazione/` (vocabolario + comunicazione didattica), `plan-per-matteo/`, `sessioni/`, README.
- **Due tenant sandbox** creati su TEST via `PLAN-DB-001` (canale MCP `CONSOLE`):
  `console-classic` (`4c694cb8-66af-478f-afd2-8719f07d64b4`) e
  `console-pro` (`b5436de8-731e-469e-a888-36785823be6b`), con nome + timezone.
- **Hand-off** per l'agente Senior Orchestrator: `sessioni/HANDOFF-orchestrator-masterplan.md`
  (workflow automode: crea master-plan → ciclo esecutore→revisore→commit).

## Decisioni (intervista Cristiano)
Codice in sottocartella isolata `console/`; scritture dati solo sui sandbox, schema via plan per
Matteo; skill system = istanza v0 dedicata + CLAUDE.md riscritto; stile didattico; commit liberi
sul branch.

## Scoperte rilevanti
- Il tenant reale è **`organizations`** (non `tenants`); add-on via **`tenant_features`**;
  `qr_menu_enabled` è **legacy**. I doc `docs/Servizio-Config/` usano il nome sbagliato → **FU-CONSOLE-1**.
- Il canale MCP scrivibile su TEST è **`CONSOLE`**; gli altri non scrivono il DB di Matteo.

## Cosa è cambiato per te (Cristiano)
Hai uno skill system del branch che fa partire ogni agente con le tue regole (solo TEST, scrivi solo
sui due ristoranti di prova, lo schema lo cambia Matteo, codice solo in `console/`), due ristoranti
sandbox pronti, e un hand-off che permette a un orchestrator di costruire ed eseguire il master-plan
da solo.

## Aperto / prossimi passi
- 5 domande a Matteo (dominio, tenant_features/+QR, Edge scritture, login) — vedi `FOLLOW_UP.md`.
- FU-CONSOLE-3: scaffolding `console/` = prima fase del master-plan.
- Conferma di Cristiano: l'orchestrator committa lui dopo ogni fase revisionata (modificabile).
