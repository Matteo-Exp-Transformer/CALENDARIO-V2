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
4. Se il task riguarda **interrogazione skill · profilo · valutazione · roadmap professionale ·
   tutoraggio · candidature**, ⛔ **non** è `APP_CONTEXT_SKILL.md` §0: è il binario crescita/valutazione.
   Carica prima `docs/_lavoro/Per matteo/Valutazione Personale/00_BUSSOLA_VALUTAZIONE.md`.
5. Se il task riguarda **architettura · telemetria · criteri · ruoli/chiavi · validazione del
   MetaSkillSystem**, carica `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md`. Se tratta anche dati o
   valutazioni di Matteo, carica inoltre la Bussola del punto 4: i due contesti non si sostituiscono.

## Regola Codex per Supabase TEST

Questa sezione vale per gli agenti Codex/ChatGPT che leggono `AGENTS.md`. Non è una procedura
generale per Claude/Cursor.

- Il connettore Supabase di ChatGPT può vedere solo i progetti autorizzati nell'account GPT; la
  configurazione MCP di Cursor (`C:\Users\matte.MIO\.cursor\mcp.json`) **non** viene caricata nella
  sessione Codex.
- In questo progetto, se il connettore Codex non vede TEST `docnnernvpyrbwuzzach`, Codex deve usare
  la **CLI Supabase** per parlare con il DB TEST.
- Prima di qualsiasi SQL CLI su TEST, verificare sempre:
  - branch `env/test`;
  - `supabase/.temp/project-ref` = `docnnernvpyrbwuzzach`;
  - `npx supabase projects list -o json` mostra `id/ref = docnnernvpyrbwuzzach`, host
    `db.docnnernvpyrbwuzzach.supabase.co`, org `ytrppzjekipjubnygaos`, status `ACTIVE_HEALTHY`;
  - `npx supabase migration list --linked` si collega al remoto TEST.
- Per applicare migrazioni su TEST via CLI: usare `npm run db:apply` dalla root. Il comando verifica
  il ref TEST e lancia `db push` da una workdir temporanea che esclude il falso positivo
  `003_menu_categories.sql`.
- `supabase db push --include-all` resta vietato per sempre. `supabase db push` nudo non è il comando
  di casa: usare `npm run db:apply`.
- Mai usare la CLI per scrivere su PROD `rwuxgvldzrkabglkasym`; PROD resta MCP e solo con conferma
  esplicita di Matteo per scritture/migrazioni.

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

**Salvaguardie sempre attive:** stile con Matteo (la prima frase deve essere autosufficiente:
elemento → intervento → risultato verificabile; parla per schermate/flussi concreti, non nomi-file
isolati o sigle; breve di default — dettaglio in `docs/COMUNICAZIONE_UTENTE_SKILL.md`);
**sicurezza PROD** (prima di INSERT/UPDATE/DELETE/migrazioni via MCP
verifica l'ambiente con `get_project_url` — se è PROD `rwuxgvld` FERMATI e chiedi conferma; su TEST
`docnnernvp` procedi. Per Codex su TEST vale la sezione dedicata sopra; mai usare CLI per scrivere
PROD);
**comando non riconosciuto → non dedurre, chiedi prima** (mai inventare voci di vocabolario).

## Dettaglio operativo

Convenzioni, file critici, struttura cartelle e comandi (`npm run dev/build/lint/validate`, ecc.) sono
in **`.claude/CLAUDE.md`** — vale anche per gli agenti che leggono questo file. Non duplicarli qui per
non disallineare le due copie.
