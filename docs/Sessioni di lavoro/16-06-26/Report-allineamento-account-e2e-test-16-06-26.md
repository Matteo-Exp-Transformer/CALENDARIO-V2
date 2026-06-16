# Report — Allineamento account E2E/TEST in guide e config (16-06-26)

**Cosa è cambiato:** le guide e i file di configurazione per i test automatici ora citano i 3 account
TEST davvero attivi oggi (Classic, Pro, admin Trattoria da Tommaso) invece di email/tenant ormai
cancellati dal DB; lo script che doveva "ricreare i tenant di test" è stato rimosso perché creava
account fantasma che non potevano mai fare login.
**Cosa resta:** se lo staging TEST viene azzerato, ricreare gli account richiede il metodo giusto
(Auth Admin API, non SQL diretto) — tracciato in `FOLLOW_UP.md` → **FU-052**. Nessun altro debito aperto
da questo task.
**Serve una tua azione:** no.

---

## 1. Cosa è stato fatto

Matteo mi ha dato un prompt molto strutturato per "allineare la documentazione/config ai nuovi account
TEST" e mi ha chiesto **prima** di controverificarlo, **poi** di eseguirlo.

1. **Controverifica (prima di toccare codice):** ho confrontato il mapping account del prompt
   (Classic `testc@c.com`, Pro `testp@p.com`, admin `tomas@t.com`) con una query diretta sul DB TEST
   reale (`docnnernvp`) — corretto al 100%, e gli slug vecchi (`ristorante-test-classic`,
   `ristorante-test-pro`, `trattoria-da-tommaso`, `test`) **non esistono più** sul DB.
2. Ho scoperto che lo script `seed_e2e_test_tenants.sql` non era solo "vecchio": inseriva utenti via
   INSERT diretto in `auth.users`, che Supabase (GoTrue) non riconosce per il login — un bug già
   documentato il 13-06-26 in `EVOLUZIONE_SKILLS.md`. Aggiornare solo le email non lo avrebbe risolto.
3. Ho chiesto a Matteo come gestire lo script rotto e i changelog datati con riferimenti vecchi:
   ha scelto di **eliminare lo script** (con nota di follow-up) e di **trattare i changelog come
   storico** (non riscriverli).
4. Ho aggiornato tutte le guide/config attive con il nuovo mapping account, aggiunto allo scope un
   file con lo stesso problema non elencato nel prompt (`e2e/GUIDA_USO_QUERIES_TEST_VERIFICATION.md`),
   e ho lasciato una nota chiara su come ricreare gli account nel modo giusto.
5. Ho rilanciato `npm run validate`: verde.
6. **In chiusura** ho trovato che lo stop-hook puntava a un report di una sessione Codex in parallelo
   sullo stesso repo, non al mio lavoro — verificato via `git diff` che non c'era sovrapposizione di
   file tra le due sessioni prima di proseguire.

## 2. File toccati e perché

| File | Perché |
|------|--------|
| `e2e/admin-login.spec.ts` | Fallback credenziali (`admin@staging.it`/`password-staging`) mai esistite → `testc@c.com`/`123456` |
| `e2e/menu-crud.spec.ts` | Stesso fallback stantio (suite già skippata, ma riferimento da pulire) |
| `scripts/_test-email-once.mjs` | Email/password/tenant ID obsoleti (`classic@c.com`/`TestEmail2026!`/tenant cancellato `46d6d683-…`) → account e tenant reali `test-classic` |
| `supabase/scripts/seed_e2e_test_tenants.sql` | **Rimosso**: creava utenti via SQL diretto in `auth.users`, non riconosciuti da GoTrue per il login (bug strutturale, non solo dati vecchi) |
| `tests/README.md` | Tabella tenant/credenziali e istruzioni "ricrea i tenant" aggiornate al mapping reale + nota sulla rimozione dello script |
| `docs/Testing-Skill/TESTING_CONTEXT.md` | Tabella tenant TEST (ID/slug/edition/admin) e variabili E2E Pro aggiornate |
| `.env.example` / `scripts/prenotazen-overrides/.env.example` | Esempi commentati con email vecchia (`test-pro@p.com`, `admin-classic@test.local`) → email reali |
| `playwright.config.ts` | Blocco commento con credenziali/slug/UUID di esempio aggiornato |
| `e2e/GUIDA_USO_QUERIES_TEST_VERIFICATION.md` | Stessi UUID/email del seed rotto, non elencato nel prompt ma stesso problema — aggiunto allo scope |
| `supabase/scripts/README_RESET_TEST_DATABASE.md` | Rimosso il rimando allo script eliminato, aggiunta nota sul metodo corretto |
| `docs/FOLLOW_UP.md` | Nuova riga **FU-052**: perché lo script è stato rimosso e come ricreare gli account se serve |

**Non toccati (di proposito):** `docs/Testing-Skill/TESTING_SKILL.md` — già allineato da un'altra
sessione in corso in parallelo sullo stesso repo (Codex); verificato che non conteneva più le stringhe
vecchie, nessuna modifica duplicata. `docs/Sessioni di lavoro/**` (storico) e `docs/FOLLOW_UP.md` /
`docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md` nelle loro voci datate — lasciati come testimonianza
storica per scelta esplicita di Matteo.

## 3. Test eseguiti e risultato

`npm run validate` (lint + typecheck + Vitest) — **verde**, 91 file / 739 test, eseguito due volte per
conferma exit code 0. Non ho rilanciato gli E2E Playwright reali (richiedono `.env.local.test` con
staging Supabase locale, fuori dal mio sandbox); mi sono affidato a verifica statica (`rg` sulle
stringhe vecchie) + query dirette sul DB TEST per il mapping account.

## 4. File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `docs/Testing-Skill/TESTING_CONTEXT.md` | Tabella tenant/account TEST riscritta con ID/slug/edition reali | È la skill area "Testing" — il contenuto descriveva tenant ormai inesistenti |
| `docs/Testing-Skill/TESTING_SKILL.md` | **Nessuna** — già allineato da sessione parallela (verificato, non duplicato) | — |

## 5. Dati comunicazione

- Matteo ha dato un prompt molto strutturato (Profilo/Modalità dichiarati, mapping account come
  "unica fonte di verità", vincoli anti-scope-creep espliciti, criterio di fatto misurabile via `rg`) e
  ha chiesto esplicitamente la controverifica **prima** dell'esecuzione — pattern che ha funzionato
  bene: ha fatto emergere il bug GoTrue prima di "aggiustare" uno script comunque inutilizzabile.
- Ha risposto alle 2 domande di disambiguazione con scelte nette e pragmatiche: *"eliminalo, e annota
  in fu che è da rifare se serve"*, *"Trattali come storico, escludili"*.
- Formato che ha funzionato: `AskUserQuestion` con opzione raccomandata esplicita + spiegazione del
  perché, non solo "scegli A o B".

## 6. Analisi flusso prompt, efficienza e statistiche

- 2 prompt sostanziali di Matteo: il prompt iniziale (controverifica + esecuzione) e quello di chiusura
  (report + commit + push). 0 correzioni dopo la prima risposta sul contenuto del task.
- 1 follow-up generato: **FU-052**.
- Modalità "deep" dichiarata esplicitamente nel prompt iniziale, rispettata (controverifica con query
  DB reali, non solo grep).

## 7. La mia lettura della sessione

- **Impressioni:** prompt iniziale molto ben costruito — mapping verificabile a query, vincoli chiari,
  criterio di successo misurabile. La fase di controverifica imposta dal prompt stesso (sezione A/B)
  si è rivelata preziosa: senza interrogare il DB avrei potuto fidarmi ciecamente del mapping (era
  corretto, ma non lo sapevo finché non l'ho verificato) e senza leggere `EVOLUZIONE_SKILLS.md` avrei
  "aggiornato" uno script comunque rotto.
- **Difficoltà incontrate:** in chiusura, lo stop-hook ha segnalato un report che non avevo scritto io
  (sessione Codex in parallelo sullo stesso repo, stesso argomento). Ho dovuto fermarmi e controllare
  `git diff --stat` sui file "sospetti" prima di rispondere, per non confermare a vuoto un lavoro non
  mio.
- **Migliorie che suggerirei:** se più agenti lavorano in parallelo sullo stesso working directory,
  sarebbe utile che lo stop-hook citasse l'autore/sessione del report più recente (non solo "1 report,
  domande compilate"), per distinguere subito casi come questo.

## 8. Derivazione errori

- Nessun errore mio nel codice prodotto in questa sessione.
- **Bug preesistente (non mio, già noto):** `seed_e2e_test_tenants.sql` creava utenti via INSERT
  diretto in `auth.users` — GoTrue non li riconosce per il login. Causa: limite documentato di
  Supabase Auth con inserimento diretto, già annotato il 13-06-26 in `EVOLUZIONE_SKILLS.md`. Si sarebbe
  evitato creando da subito gli utenti via `auth.admin.createUser()`.
- **Attrito di processo (non un bug):** due sessioni agente concorrenti sullo stesso repo senza
  isolamento di branch/worktree → nessun danno (zero sovrapposizione di file), ma richiesto un
  controllo extra in chiusura.

## 9. Cosa resta per la prossima sessione

- **FU-052** (aperto, in `docs/FOLLOW_UP.md`): se lo staging TEST viene azzerato, ricreare gli account
  E2E con `supabase.auth.admin.createUser()` via SDK o portale Supabase Auth — mai INSERT SQL diretto.

## 10. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: Prompt 1 (apertura task): *"analizzaquesto prompt e controverifica le indicazioni che da. poi
aiutami a inserire nuovi account aggiornati nella documentazione di sistema"*, seguito dal prompt
completo da controverificare (Profilo Esecuzione / modalità deep / skill Testing-Skill+Database-Skill
/ mapping account `testc@c.com`+`testp@p.com`+`tomas@t.com` come "unica fonte di verità" / vincoli
anti-scope-creep / criterio di fatto via `rg` + `npm run validate` / chiusura "niente output in più
senza chiedere Sì/No prima"). Prompt 2 (chiusura): *"fai tuo report finale e commit del tu lavoro
svolto e push di tutto quello che è rimasto online"*.

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca
cosa hai ri-verificato aprendo i file.
✅ R2: Sì. Ho ri-aperto ogni file prima e dopo l'edit (`Read` + `Edit`/`Write`), confermato il mapping
account con query dirette (`organizations`, `admin_users`) sul DB TEST reale, confermato con query
aggiuntiva che gli slug vecchi e il tenant `46d6d683-…` usato in `_test-email-once.mjs` non esistono
più, e confermato con `git diff --stat` la dimensione reale delle modifiche fatte da Codex in parallelo
prima di escluderle dal mio commit.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test,
tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: `docs/Testing-Skill/TESTING_CONTEXT.md` (skill area Testing) aggiornato da me.
`docs/Testing-Skill/TESTING_SKILL.md` verificato (già allineato da Codex, non duplicato). Nessun file
di tipi (`src/types/database.ts`) coinvolto: non ho toccato schema DB. Nessun test Vitest faceva
riferimento ai vecchi account (verificato via `rg` prima di chiudere) — solo i 2 spec Playwright e lo
script email, già corretti.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok»
a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non ho rieseguito gli E2E Playwright reali (richiedono `.env.local.test` con staging Supabase
locale, non disponibile nel mio sandbox) — mi sono affidato a `npm run validate` (Vitest) + verifica
statica `rg` + query DB dirette per il mapping. Non ho toccato i file già in carico alla sessione
Codex in parallelo (stessa area, file diversi) per evitare conflitti/duplicazioni, anche se l'argomento
si sovrapponeva.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo
miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più
probabile.)
✅ R5: Attrito: due sessioni agente in parallelo sullo stesso repo hanno fatto scattare lo stop-hook su
un report non mio, costringendomi a un controllo diff extra per non confermare lavoro altrui a vuoto.
Miglioria: l'hook potrebbe citare l'ultimo autore/branch del report più recente, o i task paralleli
potrebbero usare worktree Git separate per evitare cross-talk sullo stesso file di stato.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E
gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto giusto: `CLAUDE.md` + sezione Testing/Database bastavano, non ho dovuto caricare altre
skill area. L'hook di fine-sessione è stato utile, non rumore: mi ha fermato su un'incongruenza reale
(report di un'altra sessione) prima che la ignorassi o la confermassi per sbaglio.

## 11. Self-review (fatta prima della chiusura)

1. Dati = diff reale → verificato sopra (Q2), nessuna correzione necessaria.
2. File correlati allineati → verificato sopra (Q3), nessuna correzione necessaria.
3. Q1-Q6 coerenti tra loro e col lavoro svolto → sì, nessuna contraddizione.
4. Tono utente → cappello e §1 scritti per flussi/decisioni, non solo nomi-file isolati.

## 12. Terminali

Nessun terminale in background lasciato aperto da questa sessione (solo comandi sincroni: `rg`,
`npm run validate`, query MCP Supabase read-only).
