# Come impostare il `.claude/CLAUDE.md` del branch console — consiglio al team

> **Questo file è un consiglio, non un obbligo.** Serve al Team console come **modello** per scrivere
> il proprio `.claude/CLAUDE.md` **sul branch `feature/console-super-admin`** (non su main), così che gli
> agenti carichino lo skill system console e non quello di PrenotaZen.
>
> Copialo, adattalo ai nomi/path reali del team, committalo sul branch console. Il **processo di lavoro**
> (branch, git, ciclo richieste) NON sta qui: vive in **`WORKFLOW.md`** — qui si rimanda e basta.

---

## Come usarlo

```bash
# sul branch feature/console-super-admin
cp docs/Console-Skill/collaborazione/CLAUDE_MD_CONSOLE.md .claude/CLAUDE.md
# poi adatta nomi/contatti/path e committa con prefisso console(.claude):
```

Da personalizzare: nome del team lead (qui «Cristiano»), contatti, eventuali path `src/` diversi.

---

## Modello di `.claude/CLAUDE.md` (da copiare)

```markdown
# CLAUDE.md — Branch feature/console-super-admin (Team Console)

Orienta le sessioni Claude Code in QUESTO branch. Diverso dal CLAUDE.md principale
(che usa APP_CONTEXT_SKILL.md).

## ⚠️ Regola madre
In questo branch carica SEMPRE lo skill system CONSOLE, mai PrenotaZen.
- ❌ NO  `docs/APP_CONTEXT_SKILL.md`, `docs/Prenota-Skill/`, `docs/Menu-QR-Skill/`
- ✅ SÌ  `docs/Console-Skill/00_BUSSOLA_CONSOLE.md` (Skill 0) → §2 routing → file in `docs/Console-Skill/context/`

## Vocabolario e stile
- `docs/Console-Skill/comunicazione/VOCABOLARIO.md` — parole-comando (riuso Matteo + «plan per matteo»).
- `docs/Console-Skill/comunicazione/COMUNICAZIONE_SKILL.md` — stile didattico (spiega + «cosa cambia per te»).

## Processo di lavoro
Branch, git (merge — non rebase+force), ciclo richieste, push/validazione:
→ `docs/Console-Skill/collaborazione/WORKFLOW.md` (fonte di verità unica).
In sintesi: si sviluppa e si pusha SOLO su feature/console-super-admin; Matteo valida e promuove.

## Confine codice/doc (LOCK)
- ✅ TUO: `docs/Console-Skill/**`, `.claude/CLAUDE.md` di questo branch, codice console nella cartella isolata **`console/`**.
- ❌ NON toccare: `docs/APP_CONTEXT_SKILL.md` e skill PrenotaZen; `src/` e `supabase/` (app di Matteo, sola lettura). `console/` non importa da `../src`.

## DB / Edge / sicurezza PROD
- Sviluppo SOLO su TEST: `get_project_url` deve essere `docnnernvp`; PROD `rwuxgvld` = STOP. Scritture dati solo sui tenant sandbox `console-classic`/`console-pro`.
- Schema (DDL/RLS/colonne) → **mai dall'agente**: genera un *plan per matteo* (`plan-per-matteo/`), lo esegue Matteo.
- Dettaglio schema/RLS: `docs/Console-Skill/context/CONSOLE_DATA_MODEL_CONTEXT.md`; architettura/deploy: `context/CONSOLE_APP_CONTEXT.md`.

## Prima di push
`npm run validate` verde + test del flusso nuovo (+ test RLS se tocchi policy / test su TEST se Edge).
Poi avvisa Matteo. Comandi git completi in WORKFLOW.md §2.

## Contatti
Matteo = orchestrazione, design, integrazione. Cristiano = stile dev, vocabolario, skill console.
```

---

**Versione:** 23-06-2026 · **Autore:** Matteo (modello) — il team lo adatta sul proprio branch.
