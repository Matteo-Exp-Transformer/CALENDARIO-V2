# CLAUDE.md — Guida per sessioni AI

Questo file orienta le sessioni Claude Code su questo progetto. È il **gemello** di `AGENTS.md`
(Codex e simili) e di `.cursor/rules/comandi-base.mdc` (Cursor): tutti e tre puntano alla **stessa
fonte di verità** per comportamento e routing.

## Prima di toccare il codice — instradati all'area giusta

Il progetto è organizzato in **aree** (Pagina Prenota, Menu QR, Admin shell, Database…), ognuna con
una **skill d'area**. **Non navigare il codice a tappeto:** apri prima il routing.

1. Apri `docs/APP_CONTEXT_SKILL.md` **§0** — tabella «il task riguarda X → carica skill Y». Carica la
   skill d'area **prima** di aprire i file da modificare.
2. Aree già mappate: Pagina Prenota → `docs/Prenota-Skill/PRENOTA_SKILL.md`; Menu QR →
   `docs/Menu-QR-Skill/MENU_QR_SKILL.md`; le altre nella §0.
3. Leggi la skill d'area **intera**, poi apri **solo** il file di `contesto/` che ti serve.

> I valori (limiti, soglie) vivono nel **codice**; i file `.md` li specchiano. Dopo un edit aggiorna
> il file di contesto mappato dalla skill d'area, non copie sparse.

## Comandi e vocabolario di Matteo (leggi a inizio sessione)

> Fonte di verità unica dei comportamenti: **`docs/Comunicazione-Skill/VOCABOLARIO.md`**. Caricalo a
> inizio sessione e applica la voce quando Matteo usa una parola mappata.
>
> **Puntatori estesi (non duplicare qui):** fine-chat e allineamento skill →
> `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md`; modalità «prepara» →
> `docs/PREPARA_PROMPT_SKILL.md`; ambiguità Prenota ↔ Menu QR e tre zone «menu» →
> `.cursor/rules/comandi-base.mdc` § «Zone che si confondono» + VOCABOLARIO «Scorciatoie d'area».

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
`docnnernvp` procedi. Se il canale è CLI su TEST, usa la checklist di `docs/APP_CONTEXT_SKILL.md`
§1b: project ref/host/org devono essere `docnnernvp`, mai usare CLI per scrivere PROD);
**comando non riconosciuto → non dedurre, chiedi prima** (mai inventare voci di vocabolario).

## Dettaglio operativo

Convenzioni, comandi, file critici e zone delicate — qui per Claude Code e per gli agenti che leggono
`AGENTS.md` (che rimanda a questo blocco).

### Comandi principali

```bash
npm run dev                  # dev server su :5173
npm run build                # TypeScript check + Vite build
npm run lint                 # ESLint, zero warning tollerati
npm run lint:fix             # Fix automatico ESLint
npm run typecheck            # tsc --noEmit
npm run test                 # npm run test deve essere verde (run mode)
npm run test:watch           # Vitest in watch mode
npm run test:e2e             # Playwright e2e (richiede staging Supabase)
npm run validate             # lint + typecheck + test (pre-PR)
npm run db:types:linked      # Rigenera src/types/database.ts dal DB remoto
```

Setup test, config Vitest/Playwright, CI e staging: **`docs/Testing-Skill/TESTING_SKILL.md`**.

### Convenzioni

- **Conventional Commits**: `feat(scope):`, `fix(scope):`, `update(scope):` ecc.
- **Import alias**: `@/` → `src/` (`vite.config.ts`, `tsconfig.json`)
- **Logger**: `src/lib/logger.ts` — `logger.debug/info/warn/error`, non `console.log`
- **Due client Supabase**: `supabasePublic` (anonimo) vs `supabase` (admin autenticato) — non mischiare
- **TanStack Query**: query server-state negli hook in `src/features/booking/hooks/`
- **Commenti**: spiegano il PERCHÉ, non il COSA

### Struttura progetto

- **Cartelle `src/`** (dettaglio vivo): `docs/APP_CONTEXT_SKILL.md` **§3**
- **Skill system `docs/`**: stesso file, §3 «Struttura docs/»
- **Schema DB / migrazioni / RLS**: `docs/Database-Skill/DB_SKILL.md` + `docs/DATABASE.md`

### File critici (entry point)

| File | Perché |
|------|--------|
| `src/router.tsx` | Tutte le route |
| `src/contexts/TenantContext.tsx` | Multi-tenancy: `tenantId` da slug o email admin |
| `src/lib/supabase.ts` / `supabasePublic.ts` | Client admin (sessione) vs anonimo (form pubblici) |
| `src/features/booking/hooks/useAdminAuth.ts` | Login, session, subscription |
| `src/types/database.ts` | Tipi DB — rigenera con `npm run db:types:linked` |
| `supabase/migrations/` | Schema — migrazioni già applicate NON si toccano |
| `supabase/functions/create-booking/` | Edge Function prenotazioni pubbliche |

Mappa estesa invarianti globali: **`docs/APP_CONTEXT_SKILL.md` §4**.

### Zone delicate

- **`TenantContext`**: slug URL (pubblico) o email admin → qualsiasi hook dati tenant dipende da qui.
- **Due client Supabase**: admin persiste sessione in localStorage; pubblico no — non mischiare.
- **Migrazioni `003_*` doppie**: già applicate; non rinominare — `docs/DATABASE.md` + `DB_SKILL.md` §3.
- **`send-email` attiva in PROD** (dal 15-06; aggiornata 19-06): Edge Function `send-email` deployata su `rwuxgvld` (**v6**) con secret Brevo (`BREVO_API_KEY`/`BREVO_SENDER_EMAIL`); accetta/rifiuta inviati e ricevuti. Tabelle `email_templates`/`email_campaigns` presenti anche in PROD (mig. 050/051/052). Dal 19-06 PROD ha anche mig. 055 `unsubscribe_tokens` + Edge pubblica `unsubscribe` v1: le email marketing sostituiscono server-side `{{UNSUBSCRIBE_URL}}`, fallendo se il link non è generabile. Resta `VITE_ENABLE_SEND_EMAIL` come gate client; invio campagne automatico = FU-EMAIL-8 (non attivo).
- **Button**: varianti in componente (`primary`, `secondary`, …); **non** aggiungere CSS globale in `index.css`. Tailwind JIT richiede classi letterali statiche.

### Ambienti DB

**Fonte di verità:** `docs/APP_CONTEXT_SKILL.md` **§1b** + `docs/Database-Skill/DB_SKILL.md`.

Prima di ogni INSERT/UPDATE/DELETE/migrazione via MCP: `get_project_url` → `docnnernvp` = TEST ok;
`rwuxgvld` = PROD → chiedi conferma esplicita. I MCP non leggono `.env.local`.
Per operazioni CLI su TEST seguire la checklist di `APP_CONTEXT_SKILL.md` §1b; la CLI non va usata
per scrivere PROD. `supabase db push` resta vietato.

### Variabili d'ambiente

Vedi `.env.example`. Prefisso `VITE_` = esposte al browser; senza prefisso = solo script Node locali.

### Dev console (solo `npm run dev`)

Strumento dev dietro `import.meta.env.DEV` — inerte in produzione. Dettaglio implementativo:
`src/lib/devConsole.ts`, pannello `src/components/dev/DevFlowPanel.tsx`, nomi query
`src/lib/devQueryNames.ts`. Tono messaggi: allineato a `docs/COMUNICAZIONE_UTENTE_SKILL.md`.
