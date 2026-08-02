# Report — Allineamento migrazioni Supabase TEST

**Cosa è cambiato:** il DB TEST ora ha il registro migrazioni allineato a `001`–`066`; le prossime migrazioni si applicano con `npm run db:apply`.
**Cosa resta:** PROD non toccata; il doppio `003` resta storico e viene gestito dal comando protetto.
**Serve una tua azione:** no.

## Obiettivo

Rendere di nuovo applicabili le migrazioni su Supabase TEST `docnnernvpyrbwuzzach` senza usare
`--include-all` e senza scrivere su PROD.

## Verifiche ambiente

| Controllo | Esito |
|---|---|
| Branch | `env/test` |
| Ref locale | `supabase/.temp/project-ref = docnnernvpyrbwuzzach` |
| Token | vede TEST linked `ACTIVE_HEALTHY`; non vede `rwuxgvld` |
| Supabase CLI | `2.111.0` |
| Changelog Supabase | nessuna breaking change rilevante per `migration repair` / `db push`; nota Data API già coperta dalle skill |

Nota: `projects list` mostra anche un progetto inattivo non collegato; non è PROD e non è stato usato.

## Registro migrazioni

Fotografie:
- Prima: `REGISTRO_PRIMA.json` — 70 righe.
- Dopo: `REGISTRO_DOPO.json` — 66 righe, da `001` a `066`.

Incrocio:

| Gruppo | Esito |
|---|---|
| File locali | 67 file `.sql`, 66 versioni numeriche (`003` doppio) |
| Righe timestamp rimosse | 63 righe rimosse dal registro; nessun DDL schema eseguito |
| Collisioni numeriche | `053`/`054` orfane rimosse prima di registrare i file locali reali |
| Orfani storici rimossi | `026c_anon_select_active_organizations`, `console_admin_select_admin_users_rls`, `plan_db_006_cascade_delete_organizations` |
| Spaiate verificate | `018`, `020`, `057`, `058` dimostrate dallo schema/firme finali |
| `021` | trovata con nome storico `021_service_slot_rpcs_jsonb`; stato finale verificato come `update_service_slot(payload jsonb)` |
| `066` | prima: colonna presente ma commento mancante; dopo `db push` protetto: colonna e commento presenti |

## Azioni eseguite

1. Salvato il registro remoto iniziale.
2. Rimosse dal solo registro le righe orfane/timestamp con `migration repair --status reverted`.
3. Registrate come applicate le versioni numeriche locali `001`–`065` mancanti, una sola `003`.
4. Applicata la `066_booking_requests_served_at.sql` su TEST via `db push` da workdir temporanea.
5. Rigenerati i tipi TypeScript con `npm run db:types:linked`.
6. Creato `npm run db:apply`, che:
   - legge `.env.local.test`;
   - rifiuta ref diversi da `docnnernvpyrbwuzzach`;
   - rifiuta `--include-all`;
   - esegue `db push` da una copia temporanea senza il duplicato `003_menu_categories.sql`.
7. Aggiornati hook Claude/Cursor: shell verso TEST passa, altri ref chiedono conferma; `--include-all` viene fermato.
8. Aggiornata la documentazione DB e agenti: prossimo prefisso `067`, `066` applicata su TEST, PROD invariata.

## Verifiche finali

| Verifica | Esito |
|---|---|
| Commento `booking_requests.served_at` | presente |
| `npm run db:apply -- --dry-run` | `Remote database is up to date` |
| `node --env-file=.env.local.test scripts/db-apply.mjs --include-all` | bloccato prima della CLI |
| `npx supabase migration list --linked` da workdir pulita | `001`–`066` allineate |
| `npm run validate` | verde |
| `npm run validate:docs` | rosso per 14 link rotti preesistenti in `docs/Console-Skill/*`, non introdotti da questa sessione |

`npm run validate` passa; durante i test restano warning React `act(...)` già presenti nel comportamento della suite, non fallimenti.

## File toccati

| Area | File |
|---|---|
| Guardrail DB | `scripts/db-apply.mjs`, `package.json`, `.claude/hooks/guard-prod.mjs`, `.cursor/hooks/guard-prod.mjs` |
| Tipi | `src/types/database.ts` |
| Documentazione DB | `docs/DATABASE.md`, `docs/Database-Skill/*`, `docs/APP_CONTEXT_SKILL.md`, `AGENTS.md`, `.claude/CLAUDE.md`, `.cursor/skills/calendarbackup-db/SKILL.md`, `README.md` |
| Allegati report | `REGISTRO_PRIMA.json`, `REGISTRO_DOPO.json` |

## Dati comunicazione

### Cronologia / prompt di Matteo

| # | Prompt | Intento | Esito |
|---|---|---|---|
| 1 | “ho scritto la chiave in env.local.test supabase access token.” | Sbloccare l’esecuzione del piano allegato su Supabase TEST | Task eseguito su TEST; nessun comando su PROD |

### Analisi flusso prompt, efficienza e statistiche (skill system)

| Metrica | Dato |
|---|---|
| Messaggi utente sostanziali | 1 |
| Domande all’utente | 0 |
| Retry rilevanti | 1: `db push` nudo falliva sul doppio `003`; risolto con workdir temporanea |
| Validate | 1 verde |
| Commit/push | commit richiesto in chiusura; push no |

Anatomia prompt: piano operativo completo, ambiente TEST esplicito, vincoli PROD chiari, verifica finale definita. Completezza alta; unico punto da correggere nel piano era l’assunto “db push normale funziona” con doppio `003`.

Automatizzabile: la procedura è ora in `npm run db:apply`. Manuale: PROD resta cantiere separato con conferma esplicita.

## Stato finale

Per il ristoratore: il flusso “libera ultimo tavolo / checkout” non deve più bloccarsi su `served_at` mancante nel TEST.

Per gli agenti: dalla prossima migrazione, il percorso corretto è:

```bash
npm run db:apply -- --dry-run
npm run db:apply
npm run db:types:linked
npm run validate
```

Non usare `supabase db push --include-all`.

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) «ho scritto la chiave in env.local.test supabase access token.» (2) «crea un report dettagliato del lavoro svolto e mettilo nella cartella di sessioni di lavoro di oggi. poi fai commit lavoro svolto. solo tuo.»

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Sì. Ho ri-verificato `git diff --cached --stat` e `git diff --cached --name-only`: lo stage contiene 18 file del lavoro Supabase TEST, inclusi `scripts/db-apply.mjs`, documentazione DB, `src/types/database.ts`, `REGISTRO_PRIMA.json`, `REGISTRO_DOPO.json` e questo report. Ho ri-verificato anche il registro remoto via query: 66 righe, `first=001`, `last=066`, `timestamp_rows=0`.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Allineati i file correlati DB/skill: `docs/DATABASE.md`, `docs/Database-Skill/DB_MIGRATIONS_CONTEXT.md`, `DB_SKILL.md`, `DB_MINI.md`, `DB_SCHEMA_CONTEXT.md`, `docs/APP_CONTEXT_SKILL.md`, `AGENTS.md`, `.claude/CLAUDE.md`, `.cursor/skills/calendarbackup-db/SKILL.md`, `README.md`. Aggiornati anche `package.json` e `src/types/database.ts`. Verifiche: `npm run db:apply -- --dry-run` up to date, `npm run validate` verde.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non ho fatto push, perché Matteo ha chiesto solo commit. Non ho toccato PROD. Non ho incluso nel commit le modifiche non mie già presenti: `package-lock.json`, `docs/Testing-Skill/PROMPT_AGENTI_E2E_S4.md`, `RIPROVA_B.md`, `RIPROVA_D.md`. Non ho forzato nel commit `.claude/hooks/guard-prod.mjs` perché è sotto area ignorata e non risulta tracciato da Git.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: Attrito principale: il piano diceva che `db push` normale avrebbe funzionato, ma la CLI `2.111.0` falliva sul doppio `003`; miglioramento applicato: comando `npm run db:apply` che codifica il workaround invece di lasciarlo alla memoria degli agenti. Altro attrito: report iniziale senza sezione 11; proposta già evidente dall'hook, rendere il template report DB/deep sempre precompilato con Q1-Q6.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto giusto per un task DB deep: AGENTS, APP_CONTEXT, DB skill/context e piano allegato erano necessari per evitare PROD e per gestire il registro. Hook pre-commit utile: ha bloccato un report dettagliato ma incompleto dal punto di vista contabile, prima del commit. Rumore limitato: `validate:docs` fallisce per link Console preesistenti, quindi resta un controllo utile ma non bloccante per questo lavoro.
