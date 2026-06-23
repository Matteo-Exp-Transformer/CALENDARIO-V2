# Due skill system indipendenti — come convivono PrenotaZen e Console

> **Nota di allineamento (23-06-26):** lo skill system console **esiste già ed è completo**. Questo file
> non chiede di costruirne uno: spiega solo come i due sistemi convivono sul repo e come Matteo integrerà
> il console nel principale, più avanti. L'entry point reale è **`docs/Console-Skill/00_BUSSOLA_CONSOLE.md`**
> (non un `CONSOLE_SKILL_SYSTEM.md`, che non esiste).

---

## 1. I due sistemi

| Aspetto | PrenotaZen (`main` / `env/test`) | Console (`feature/console-super-admin`) |
|---|---|---|
| Owner | Matteo | Team console (Cristiano) |
| Entry point agenti | `docs/APP_CONTEXT_SKILL.md` | `docs/Console-Skill/00_BUSSOLA_CONSOLE.md` (Skill 0) |
| Contesto aree | `docs/{Area}-Skill/` | `docs/Console-Skill/context/` |
| Modello dati / RLS | `docs/Database-Skill/DB_SKILL.md` | `docs/Console-Skill/context/CONSOLE_DATA_MODEL_CONTEXT.md` |
| Architettura / deploy | `docs/APP_CONTEXT_SKILL.md` §3 | `docs/Console-Skill/context/CONSOLE_APP_CONTEXT.md` |
| Vocabolario | `docs/Comunicazione-Skill/VOCABOLARIO.md` | `docs/Console-Skill/comunicazione/VOCABOLARIO.md` |
| Comunicazione | `docs/Comunicazione-Skill/` | `docs/Console-Skill/comunicazione/COMUNICAZIONE_SKILL.md` |
| Codice | `src/`, `supabase/` | sottocartella isolata **`console/`** (non importa da `../src`) |
| Testing | `docs/Testing-Skill/` | stesso (riuso diretto, non duplicare) |

Mappa completa + 4 regole d'oro + LOCK: già in **`00_BUSSOLA_CONSOLE.md`** e **`docs/Console-Skill/README.md`**.

---

## 2. Come un agente sceglie il sistema giusto

Sul branch `feature/console-super-admin` l'agente carica il `.claude/CLAUDE.md` **del branch** (riscritto
per la Console — modello in `collaborazione/CLAUDE_MD_CONSOLE.md`), che lo manda su `00_BUSSOLA_CONSOLE.md`
e **non** su `docs/APP_CONTEXT_SKILL.md`.

**Esempio** — task "RLS per `admin_users`":
- ❌ NON `docs/Database-Skill/DB_SKILL.md` (è PrenotaZen)
- ✅ `docs/Console-Skill/context/CONSOLE_DATA_MODEL_CONTEXT.md` → e per lo schema, un *plan per matteo*.

> **Decisione di switch (aperta, da confermare con Matteo):**
> **A)** un `.claude/CLAUDE.md` diverso per branch (consigliato, niente logica runtime), oppure
> **B)** un solo CLAUDE.md che fa `git branch --show-current` e instrada. Oggi di fatto vale A.

---

## 3. Integrazione Console → PrenotaZen (più avanti, la fa Matteo)

La Console è venduta come Pro (FU-SERV-ADMIN-PANEL-1). Finché è in sviluppo, i due sistemi restano
separati. Quando una parte è stabile, Matteo la promuove (vedi `WORKFLOW.md` per il git) e, **a milestone**,
decide se e come esporre la skill console nel routing principale di `APP_CONTEXT_SKILL.md`.

> Niente `cp -r`/`mv` predefiniti qui: la forma dell'integrazione (cartella, naming, voce di routing) la
> fissa Matteo quando ci arriva, sul codice/doc reali di allora. Anti-pattern da evitare nel frattempo:
> il Team **non** tocca `docs/APP_CONTEXT_SKILL.md` né duplica `Database-Skill/`/`Testing-Skill/`
> (li riusa in sola lettura).

---

**Versione:** 23-06-2026 · **Autore:** Matteo · allineato alla struttura reale di `docs/Console-Skill/`.
