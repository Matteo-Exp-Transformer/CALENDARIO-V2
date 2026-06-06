# AGENTS.md — Guida per agenti (Codex e simili)

Questo file orienta gli agenti che leggono `AGENTS.md` (es. Codex) su questo progetto. È il
**gemello** di `.claude/CLAUDE.md` (per Claude Code) e di `.cursor/rules/comandi-base.mdc` (per
Cursor): tutti e tre puntano alla **stessa fonte di verità**, così il comportamento è identico nei
tre ambienti.

## Prima di toccare il codice — instradati all'area giusta

Il progetto è organizzato in **aree** (Pagina Prenota, Menu QR, Admin shell, Database…), ognuna con
una **skill d'area**. **Non navigare il codice a tappeto:** apri prima il routing.

1. Apri `docs/APP_CONTEXT_SKILL.md` **§0** — tabella «il task riguarda X → carica skill Y». Carica la
   skill d'area **prima** di aprire i file da modificare.
2. Aree già mappate: Pagina Prenota → `docs/Prenota-Skill/PRENOTA_SKILL.md`; Menu QR →
   `docs/Menu-QR-Skill/MENU_QR_SKILL.md`; le altre nella §0.
3. Leggi la skill d'area **intera**, poi apri **solo** il file di `contesto/` che ti serve.

## Comandi e vocabolario di Matteo (leggi a inizio sessione)

> Fonte di verità unica dei comportamenti: **`docs/Comunicazione-Skill/VOCABOLARIO.md`**. Caricalo a
> inizio sessione e applica la voce quando Matteo usa una parola mappata.

**Livelli di libertà** di ogni voce (quanto sei libero di agire):
- **Liv. 1** → applica subito, niente domande.
- **Liv. 2** → applica, ma se il contesto è ambiguo fai **una** domanda breve prima.
- **Liv. 3** → chiedi sempre conferma, salvo match identico a un caso già registrato come ok.

**Grilletti principali** (dettaglio completo in `.cursor/rules/comandi-base.mdc` + VOCABOLARIO):
- **«prepara» / «prepara prompt»** → NON eseguire codice; modalità filtro, consegna solo il prompt.
- **«implementa» / «fai» / «sistema» / «aggiungi» / «crea»** → profilo Esecuzione (carica skill area, `APP_CONTEXT_SKILL.md` §0).
- **«revisiona» / «verifica» / «debugga» / «non funziona»** → profilo Verifica (Testing-Skill + skill area).
- **«migliora/analizza/revisiona comunicazione»** → Meta revisore. **«evolvi … senior»** → Meta senior.
- **«lavoro ok»** → scrivi/aggiorna il report COMPLETO (no commit). **«fai report finale»** → commit + push.
- **«dammi follow up»** → solo il prompt per la prossima chat. **«spiegamelo semplice»** → effetto concreto, breve.
- **«ragioniamo»** → fermati a ragionare: spiegazione + effetto per te + tabellina + checklist (vedi voce nel VOCABOLARIO).

**Salvaguardie sempre attive:** stile con Matteo (parla per schermate/flussi concreti, non nomi-file
isolati; breve di default); **sicurezza PROD** (prima di INSERT/UPDATE/DELETE/migrazioni via MCP
verifica l'ambiente con `get_project_url` — se è PROD `rwuxgvld` FERMATI e chiedi conferma; su TEST
`docnnernvp` procedi); **comando non riconosciuto → non dedurre, chiedi prima** (mai inventare voci di
vocabolario).

## Dettaglio operativo

Convenzioni, file critici, struttura cartelle e comandi (`npm run dev/build/lint/validate`, ecc.) sono
in **`.claude/CLAUDE.md`** — vale anche per gli agenti che leggono questo file. Non duplicarli qui per
non disallineare le due copie.
