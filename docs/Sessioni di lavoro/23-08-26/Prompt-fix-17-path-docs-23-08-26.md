# Mandato — azzerare i path rotti (17 in locale, **26 in CI**) e rendere verde il job `ci`

> Data: 23-08-2026 · Catena: **indipendente** dagli altri mandati della cartella · Prerequisito:
> nessuno, si può partire subito.

## 0. Come si lavora

**Pianifica tu.** Leggi §2, poi presenta a Matteo un piano in passi numerati prima di modificare
file. Se una scelta cambia il risultato (correggere un link vs cancellare un file duplicato),
**chiedi a Matteo**, con la tua raccomandazione già dentro la domanda. Matteo non è tecnico: parla
per effetti concreti, non per nomi di file isolati.

## 1. Perché questo lavoro esiste

Dal 23-08-26 la CI gira anche su `env/test` con **due job indipendenti**: `ci` (documenti, lint,
tipi, test) e `mss` (controlli MetaSkillSystem). Erano stati separati apposta, perché prima
`validate:docs` falliva per primo e **impediva ai controlli MSS di essere eseguiti**: una CI verde
che non controllava niente.

La separazione ha risolto quel difetto, ma ne lascia in piedi un altro: **il job `ci` sarà rosso a
ogni push su `env/test`**, perché `npm run validate:docs` esce `1` con **17 path rotti**. Una spia
rossa permanente smette di essere una spia: nessuno la guarda più, e il giorno che diventa rossa per
un motivo vero non se ne accorge nessuno.

Matteo vuole **git pulito**: `validate:docs` deve uscire `0`.

## 2. Contesto da leggere (solo questo)

1. `scripts/check-doc-paths.mjs` — cosa considera «path» e cosa no. **Leggilo prima di tutto:**
   metà dei 17 casi sono probabilmente falsi positivi di notazione, non link rotti veri.
2. `scripts/doc-path-check-allowlist.json` — il formato delle deroghe già in uso: `path`, `reason`,
   e `fu` oppure `tipo`. Le voci esistenti sono il modello da imitare.
3. I file elencati in §3.

## 3. I 17 casi, già classificati (verifica la classificazione, non fidartene)

Comando per rivederli: `npm run validate:docs`

**Famiglia A — notazione con puntini, 3 casi.** Il testo contiene `src/.../nomefile.ts`: non è un
path, è prosa con un'elisione. Lo script lo legge come path e ovviamente non lo trova.
- `docs/Console-Skill/MASTERPLAN_CONSOLE.md:367` → `src/.../restaurantSettingRegistry.ts`
- la stessa riga nella copia sotto `sessioni/2026-06-22-.../tracciabilita/`
- `docs/MetaSkillSystem/TIPO_SEDUTA_FANTASTICAZIONE_V0.md:5` e `:43` → `docs/_lavoro/.../…`

**Famiglia B — inventario di file mai esistiti, 12 casi.** `PHASE_AUDIT.md:31` elenca sei file di
uno scaffold di progetto (`src/App.ts`, `src/main.ts`, `src/lib/supabaseClient.ts`,
`src/components/LoginPlaceholder.ts`, `src/components/AppShell.ts`, `src/styles/global.css`) che in
questo repo **non esistono con quei nomi** — qui si usa `.tsx`, e il client sta in
`src/lib/supabase.ts`. Sono 6 path × **2 copie dello stesso file**.

**Famiglia C — riferimento a materiale privato, 2 casi (inclusi in A).**
`TIPO_SEDUTA_FANTASTICAZIONE_V0.md` punta dentro `docs/_lavoro/`, che è **gitignored e privato**:
quei file non devono esistere nel repo e non vanno creati. Qui la deroga è la risposta giusta,
oppure una riscrittura della citazione che non somigli a un path.

**Famiglia D — prefisso mancante, 1 caso.** `docs/FOLLOW_UP.md:9` →
`MetaSkillSystem/archive/README.md`. Verifica se il target esiste sotto `docs/` e il link ha solo
perso il prefisso, oppure se non esiste affatto.

## 3-bis. ⚠️ In locale sono 17, in CI sono **26**. I 9 in più sono il caso più insidioso.

**Verificato il 23-08-26 sul log reale della run `32652259771`**, non dedotto: il job `ci` fallisce
al passo `Validate doc paths` con `path rotti: 26`. La differenza non è un bug dello script — è che
**in locale quei file esistono sul disco di Matteo, ma non sono in git**. Un clone pulito non li ha.

I 9 puntano tutti a materiale legittimamente fuori dal repo:

| File che cita | Bersaglio mancante in CI |
|---|---|
| `docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md:427` e `:489` | `docs/_lavoro/Per matteo/Test e2e/CHECKLIST_FLUSSI_DA_TESTARE.md` |
| `docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md:507` | `.cursor/hooks/.fine-sessione-commit-state.json` (file di stato, gitignored) |
| `docs/FOLLOW_UP.md:50` | `docs/_lavoro/seed-fu-020-import-preset-qa.sql` |
| `docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md:243` | `.cursor/plans/sep-10_archiviazione_mss_430c9c1d.plan.md` (gitignored) |
| `docs/PREPARA_PROMPT_SKILL.md:413` | `docs/_lavoro/Per matteo/Test e2e/CHECKLIST_FLUSSI_DA_TESTARE.md` |
| `docs/SESSION_LOG.md:39`, `:40`, `:41` | `docs/_lavoro/…/Prompt-Seduta-Immaginazione.md` |

Per questi **la correzione del link è impossibile per costruzione**: `docs/_lavoro/` è privato e non
deve mai entrare in git, e i file `.cursor/` di stato sono generati. La strada giusta è la **3 di
§4** — allowlist con una `reason` che dica *perché* il bersaglio non può esistere in CI.

**Conseguenza operativa che devi accettare fin da subito:** `npm run validate:docs` in locale
**sotto-riporta**. Non puoi dichiarare finito il lavoro guardando solo il tuo terminale. La prova
vera è in §7.

## 3-ter. Perché il conteggio locale mente, e come rimediare

Il 22-08 e il 23-08 diversi report hanno citato «17» come se fosse *il* numero. Non lo è: è il
numero **in una copia di lavoro che contiene file privati**. È un caso da manuale di dato vero e
fuorviante insieme.

Se durante il lavoro trovi un modo pulito per far sì che `validate:docs` in locale **si comporti
come in CI** (per esempio ignorando i file non tracciati da git quando risolve un path), proponilo a
Matteo: sarebbe un miglioramento più prezioso della correzione stessa. Ma **proponilo, non
imporlo** — cambia il comportamento di un controllo, ed è una sua decisione.

## 4. Regola di scelta (in quest'ordine, non a piacere)

1. **Il link è sbagliato ma il file esiste** → correggi il link. È il caso migliore.
2. **Il testo non è un link, è prosa** → riscrivi la notazione così che lo script non la scambi per
   un path (o insegna allo script a non abboccare, se il pattern è chiaro e ricorrente — ma allora
   scrivi un test che lo dimostra).
3. **Il file non esiste e non esisterà** (materiale privato, lavoro futuro) → voce in allowlist con
   una `reason` che un umano capisca fra sei mesi.
4. **Il file non esiste perché era un piano mai realizzato** → non inventarlo. Correggi il documento
   che lo cita, oppure allowlist con `tipo: "lavoro-futuro"`.

⛔ **Vietato azzerare il contatore ammorbidendo il controllo** — non disattivare lo script, non
abbassare la severità, non allowlistare in blocco «per farlo passare». Il numero deve andare a zero
perché i 17 casi sono stati **risolti uno per uno**, non perché la sveglia è stata staccata.

## 5. Il debito che troverai per strada (segnalalo, non risolverlo di tua iniziativa)

`PHASE_AUDIT.md` e `MASTERPLAN_CONSOLE.md` esistono **in due copie identiche**, in
`docs/Console-Skill/sessioni/` e in
`docs/Console-Skill/sessioni/2026-06-22-masterplan-console-F1-F7/tracciabilita/`. È il motivo per
cui i casi sono 17 e non 11: **ogni difetto è contato due volte**.

Matteo ha dichiarato il principio `D18`: *«dobbiamo snellire, non duplicare»*. Quindi **chiedigli**
se cancellare la copia ridondante invece di correggere due volte lo stesso testo. Non farlo da solo:
cancellare file è una decisione sua. Se dice di no, correggi entrambe le copie in modo identico.

## 6. Perimetro di scrittura

- i file `.md` elencati in §3
- `scripts/doc-path-check-allowlist.json`
- `scripts/check-doc-paths.mjs` — **solo** se scegli la strada 2 di §4, e con un test a corredo
- `docs/Sessioni di lavoro/<data-di-oggi>/**` per il tuo report

**Vietato:** `src/` · `scripts/mss/**` · `.github/workflows/**` · database, migrazioni, MCP
Supabase · modificare capsule storiche (un record `final` **non si riscrive mai**: si corregge con
un `amendment`) · cancellare file senza un sì esplicito di Matteo · `git push` senza un sì esplicito
· git distruttivo (`reset --hard`, `checkout --`, `clean -fd`) · `docs/_lavoro/`.

## 7. Prove di chiusura (le esegui tu, incolli l'output vero, con il codice di uscita)

1. `npm run validate:docs` in locale → **exit 0**, e la riga che dichiara **0 path rotti**
2. **La prova che conta davvero: exit 0 anche in un clone pulito.** Clona il repo in una cartella
   temporanea (`git clone . <tmp>` non basta se copi anche l'ignorato: usa `git clone` dal remoto
   oppure `git archive HEAD | tar -x -C <tmp>`), lancia lì `npm ci && npm run validate:docs` e
   mostra **exit 0** con **0 path rotti**. Senza questa prova il lavoro non è finito: in locale il
   contatore sotto-riporta di 9 (§3-bis)
3. `npm run validate` → exit 0 (nessuna regressione: lint, tipi, test, test attrezzi MSS)
4. `npm run test:mss` → exit 0 · `npm run test:mss:tools` → exit 0
5. `git status --porcelain` → nessun file fuori dal perimetro di §6
6. `git diff --check` → exit 0 (niente spazi in coda: è già stata una prova falsa una volta)
7. **il conto torna:** quanti casi corretti + quanti allowlistati = **26**. Elencali uno per uno con
   la strada scelta (§4) e il perché. Se il totale che trovi non è 26, **rimisura e dillo**: il
   numero cresce a ogni documento nuovo che cita un path
8. **la conferma finale è la CI, non il tuo terminale**: dopo il push autorizzato da Matteo, la run
   di GitHub Actions deve mostrare il job `ci` **verde**. Riporta l'id della run

## 8. Trappole già pagate (non ripagarle)

| Trappola | Cosa fare |
|---|---|
| Windows / PowerShell | `npm.cmd`, non `npm`, se invochi da Node. Virgolette sempre: `docs/Sessioni di lavoro/` **ha uno spazio nel nome** |
| `/tmp` in git-bash | risolve su `C:\tmp` per Node → `ENOENT`. Usa la cartella temporanea di sessione |
| Numeri a memoria | il conteggio dei path cambia nel clone CI (17 in locale, 26 in un clone isolato: differenza ambientale già osservata). **Misura**, non ricordare |
| `crypto.randomUUID()` | è UUID**v4** e MSS lo **rifiuta**: servono UUID**v7** |
| `segment_no` | identico su tutto il bundle, sempre `1` |
| Hook di pre-commit | registra la versione in stage e **pretende che tu rilanci il commit identico**. Se cambi lo stage, riparte. Rilancia lo stesso comando |
| Scrittura bloccata senza errore | è l'**harness**, non MSS. Segnalalo e prosegui, non riscrivere il lavoro per aggirarlo |

## 9. Report e capsula

Scrivi `docs/Sessioni di lavoro/<data>/Report-<nome-lavoro>-<data>.md`: cosa hai corretto (tabella
dei 17), le prove di §7 con l'output vero, cosa **non** hai fatto e perché, e la capsula MSS in un
blocco ` ```jsonl ` (schema `mss.session/0.1.1`, `record_id` UUIDv7, `segment_no: 1`,
`verification.status` onesto — `self_report` se nessuno ti ha revisionato).

Poi `npm run validate:mss -- --mode file --file "<il tuo report>" --kind report --require-capsule`
→ deve dare `validate:mss OK`. **Da oggi lo verifica anche la CI**: il job `mss` valida ogni
`Report-*.md` e `Verbale-*.md` aggiunto o modificato. Un report senza capsula valida rende la CI
rossa.

**Revisione di famiglia diversa: consigliata, non obbligatoria** (decisione `D17`).

## 10. Domande di chiusura — le sei canoniche, VERBATIM

Il report chiude con `## Domande di chiusura` contenente **queste sei domande, non altre**, ognuna
seguita dalla tua risposta. (Sono incollate qui apposta: citarle per riferimento ha già fatto
sbagliare un agente.)

```
❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1:

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2:

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3:

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4:

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, scrivi «nessuna osservazione» e cosa hai verificato.)
✅ R5:

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6:
```
