# CHIUSURA SESSIONE — guida unica (report + procedure di fine chat)

> **Fonte unica per la FASE «fine chat».** Tutto ciò che serve quando una sessione si chiude sta qui:
> come compilare il report (Parte A) e le procedure operative di chiusura — commit, push, allineamento
> branch, terminali (Parte B). L'hook `stop` (`.cursor/hooks/fine-sessione-nudge.mjs`) rimanda a questo
> file quando un report è incompleto. APP_CONTEXT §7 definisce il **QUANDO** (modalità) e rimanda qui
> per il **COME**: una sola copia, niente disallineamenti.
>
> **Principio (Single Responsibility):** questo file copre **solo** la chiusura sessione — una fase con
> confini finiti (report → commit → push → allineamento → terminali). Non diventa un «file di tutto»:
> se un'informazione non riguarda la chiusura, NON va qui.

---

# PARTE A — Come compilare il report

---

## Quando scrivere un report (riepilogo — dettaglio in APP_CONTEXT §7.1)

- **light** (fix piccolo, 1 zona, basso rischio): NIENTE file report → evento JSONL pilot-only
  secondo il contratto MetaSkillSystem + 1 riga narrativa in `docs/SESSION_LOG.md` con `event_id` e
  link. La capsula non viene compressa dentro la tabella Markdown.
- **standard / deep**: file `Report-*.md` in `docs/Sessioni di lavoro/GG-MM-AA/` con le sezioni sotto.

La modalità la assegna `PREPARA_PROMPT_SKILL.md` §1.A e la scrive nel prompt. Nel dubbio: standard.

---

## Le sezioni di un report standard/deep (in ordine)

### 1. Cappello (3 righe, sempre in cima)
- **Cosa è cambiato:** una frase autosufficiente: elemento → intervento → risultato che Matteo
  può verificare. Non iniziare con sigle, stati o riferimenti a file.
- **Cosa resta:** lavori aperti / follow-up, o «niente».
- **Serve una tua azione:** sì (cosa) / no.

### 2. Cosa è stato fatto
In ordine cronologico, in **linguaggio utente** (non «ho modificato X» ma «ora Mario vede Y»).

### 3. File toccati e perché
Tabella o elenco: file + perché. Compresi i file dello skill system se li hai toccati.

### 4. Test eseguiti e risultato
Comandi lanciati + esito. Minimo sessioni standard/deep con capsula — **triade MSS**:
1. `npm run validate:mss -- --mode file --file "<questo report>" --kind report --require-capsule` (exit 0);
2. `npm run test:mss` (exit 0 — suite H-1; **non** sostituibile da `npm run validate`);
3. se tocchi codice app anche `npm run validate`; se tocchi attrezzi MSS anche `npm run test:mss:tools`.
Registra ogni gate in `controls[]` della capsula §6-bis.

**Fail di procedura capsula / validate:mss — sempre in report.** Se `mss:capsule` o
`validate:mss --require-capsule` fallisce anche una sola volta prima del verde, il report deve
contenere una sottosezione (es. §4-bis) con: comando, exit/deny, causa procedura agente, ripresa.
Vietato omettere i fail «intermedi» e scrivere solo l’esito finale OK. Mandato raccolta dati
Matteo 26-08-26 (report P0/P1 Servizio). Caso tipo: titolo Capsula senza JSONL →
`MSS-PARSE-JSONL-AMBIGUOUS`; judgments incompleti → `MSS-OUTPUT-ASSERTION` / `MSS-PRODUCT-GATE`.

> **Ratificata Meta senior 26-08-26 (OK esplicito di Matteo).** La regola era stata scritta qui da una
> **chat di lavoro**, cioè da chi non può promuovere regole di skill system (`FU-META-REPORT-1` lo vieta
> per questo stesso file). La regola è buona e resta; la deviazione di processo è registrata in
> [ERRORI_PROCESSO.md](ERRORI_PROCESSO.md) § 26-08-26. **Prossimo passo deciso, non ancora fatto:**
> spostare il controllo dal markdown allo strumento — `mss:capsule` scrive i propri rifiuti in un log, e
> il confronto «rifiuti registrati dallo strumento vs `§4-bis` presenti nel report» diventa aritmetica
> invece che memoria dell'agente. Finché non esiste, questa regola resta l'unica rete.

### 5. «File di skill aggiornati» (tabella obbligatoria, anche «nessuno»)
Colonne: **file · modifica · perché**. Elenca TUTTI i file skill toccati (skill area, COMUNICAZIONE,
APP_CONTEXT, Comunicazione-Skill/*, SESSION_LOG, report, .cursor/*).

> **Allineamento skill = implicito, non una domanda a Matteo.** Se il diff ha cambiato un
> layout/comportamento **descritto in una skill area**, quella skill va aggiornata **in questa
> chiusura** e la riga va in questa tabella con scritto **cosa** hai allineato. La riga «nessuno»
> è valida SOLO se per la zona toccata non esiste un file skill da aggiornare — e in quel caso
> scrivi il motivo («nessuno — nessuna skill area copre questo componente»). **Vietato** formulare
> l'allineamento come follow-up opzionale o «al prossimo giro»: vale per esecuzione e revisore.

### 6. «Dati comunicazione» (obbligatoria standard/deep)
- Frasi/richieste ricorrenti di Matteo in questa chat (con conteggio).
- Spiegazioni date e formato che ha funzionato.
- Prompt di Matteo annotati (verbatim dove utile) — fase raccolta dati.
- Cosa si può automatizzare con certezza vs cosa lasciare manuale.

### 6-bis. Registrazione di seduta (MSS) (obbligatoria per ogni sessione sostanziale)

> **STOP anti-collisione titolo (causa radice chiusa 26-08-26).** Nel report **non** intitolare
> nessuna heading `Capsula MetaSkillSystem` — né `## Capsula MetaSkillSystem`, né
> `## 6-bis. Capsula MetaSkillSystem`, né varianti numerate — **prima** di far girare lo strumento.
> Quel titolo lo scrive **solo** `npm run mss:capsule -- … --append-to "<report>"`. Se lo copi dal
> nome storico di questa sezione (o dalla scheda R1), lo strumento rifiuta l'append con exit 2
> `MSS-PARSE-JSONL-AMBIGUOUS` («il report dichiara già 1 sezione Capsula…»). Due agenti in due giorni
> (istanza 2 P0/P1 + Meta senior 26-08-26) hanno seguito il template alla lettera e hanno colpito lo
> stesso muro: **non è distrazione, è collisione template↔tool**.

**Flusso operativo** (allineato a [`SCHEDA_CHIUSURA_META_R1.md`](../MetaSkillSystem/SCHEDA_CHIUSURA_META_R1.md) «Prima del comando» / «STOP»):

1. Scrivi il report completo **senza** intestazione capsula: in §6-bis usa un titolo diverso
   (es. `## 6-bis. Registrazione di seduta (MSS)` / `## Registrazione MSS`) — solo puntatore/procedura,
   **senza** blocco jsonl vuoto e **senza** heading riservata.
2. Crea i judgments su file dedicato (`--template-r1` o stampo già validato).
3. **Un solo** `npm run mss:capsule -- … --append-to "<path report>"`.
4. Subito dopo: `npm run validate:mss -- --mode file --file "<path report>" --kind report --require-capsule` → exit 0.
5. Dopo append riuscito: in coda compare la sezione ufficiale `## Capsula MetaSkillSystem` + JSONL,
   scritta dallo strumento. **Non** rieseguire `--append-to` sullo stesso report.

Compila il contratto in `../MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md`. Standard/deep: il
bundle JSONL vive nel report (appeso dallo strumento) o verbale. Light: vive nel file evento
pilot-only collegato dalla riga di `SESSION_LOG.md`. Interruzione/compact: snapshot JSONL nel prompt
di proseguimento o handoff prima di perdere il contesto.

La capsula separa sempre tre delta: **Persona**, **Sistema**, **Output**. Per ciascun dato conserva
attribuzione, provenienza, grado di assistenza ed eventuale contro-evidenza. Un documento non diventa
automaticamente un prodotto: va classificato. Se un evento non è avvenuto, scrivi `non osservato`;
se il delta è nullo, scrivi `nessuno`. ⛔ Mai completare un campo per plausibilità.

> Dettaglio anti-errore (separatori `--check`/`--verify`, denylist controlli, un solo append):
> [`SCHEDA_CHIUSURA_META_R1.md`](../MetaSkillSystem/SCHEDA_CHIUSURA_META_R1.md) — non duplicare qui.

### 7. «Analisi flusso prompt, efficienza e statistiche» (sottosezione obbligatoria standard/deep)
- N° prompt sostanziali di Matteo · correzioni dopo 1ª risposta · follow-up generati · modalità alzata sì/no.
- Anatomia: cosa ha reso i prompt efficaci o ambigui. Cosa replicare/migliorare.

### 8. La TUA lettura della sessione ⭐ (il pezzo che l'hook chiede esplicitamente)
> **Questo è ciò che l'hook ti ricorda di scrivere, e che viene saltato più spesso.** Non è «cosa hai
> fatto» (già sopra): è la **tua versione di agente** su com'è andato il lavoro CON lo skill system.

- **Impressioni:** cosa ha funzionato bene e cosa no lavorando col sistema (prompt chiari? skill
  giuste caricate? procedura scorrevole o macchinosa?).
- **Difficoltà incontrate + come le hai risolte** (anche piccole — sono dati per migliorare il sistema).
- **Migliorie che TU suggeriresti** (allo skill system, ai prompt, al processo) — **come dato, non come
  modifica**: NON toccare le skill da solo, scrivi il suggerimento e basta (vedi «Cosa NON fare»).
- Scrivilo come **DATI e versione dell'agente, NON come voto sintetico** (il voto lo dà il revisore
  confrontando le versioni dei vari agenti — vedi `REVISIONE.md` §4c).

### 9. «Derivazione errori» (obbligatoria, anche «nessuna difficoltà»)
Per ogni bug/difficoltà, **classifica la causa**:
- **bug preesistente** — c'era già nel codice (cita file/RULE);
- **prompt ambiguo/incompleto** — la richiesta lasciava spazio a interpretazioni;
- **errore agente** — interpretazione sbagliata, tentativo evitabile;
- **vincolo strutturale** — un LOCK/CSS/architettura ha bloccato un approccio.
Per ognuno: cosa è successo, da cosa derivava, come si sarebbe evitato. I pattern ricorrenti vanno
**anche** appesi in `Comunicazione-Skill/ERRORI_PROCESSO.md`.

### 10. Cosa resta per la prossima sessione
Sincronizza con `docs/FOLLOW_UP.md` (nuove righe FU-NNN; stato `fatto` se chiusi).

### 10-bis. Handoff al prossimo agente ⭐ (obbligatorio nelle sessioni deep e Meta)

L'handoff non è un elenco di file e non è un riassunto cronologico. Deve permettere a un agente
freddo di agire senza ricostruire il presente dalla storia. Apri con **«cosa è vero adesso»** e
registra, in quest'ordine logico:

- obiettivo corrente, stato esatto e prossimo task atomico con relativo gate di chiusura;
- decisioni prese da Matteo, motivazione e fonte; decisioni chiuse che non vanno riaperte;
- tentativi, fallimenti e correzioni che cambiano il modo corretto di proseguire;
- proprietario di ogni stato dinamico e soli puntatori necessari per ripartire;
- autorizzazioni, privacy, divieti e azioni che richiedono una nuova conferma;
- per regole o componenti del sistema, maturità separata: **G** (scritta), **O** (osservata),
  **E** (controllata automaticamente). Non chiamare «validato» ciò che è soltanto progettato.

Il report conserva la storia; l'handoff conserva il bordo operativo. Collega report e capsula, ma
non duplicare contatori o stati che hanno già un owner. Se non serve un agente successivo, scrivi
esplicitamente perché il lavoro è terminale.

### 11. «Domande di chiusura» ⭐ (OBBLIGATORIA — l'hook la controlla riga per riga)
> **Questa sezione è contabile dalla macchina.** L'hook `stop` cerca ogni `❓ Q` e verifica che la
> riga `✅ R` corrispondente **non sia vuota** (né un placeholder tipo `...`, `-`, `TODO`, `_(…)_`).
> Se una risposta manca → **rilancia e blocca la chiusura** finché non la compili. Non è un fastidio:
> è ciò che impedisce i report superficiali. Rispondi sul serio — per rispondere ad alcune **devi**
> rileggere il diff e i file, ed è il punto.
>
> **Formato esatto (rispettalo o l'hook non trova la risposta):** copia il blocco, scrivi dopo `R:`.
> Vale per QUALSIASI report (esecutore, verifica, meta). Le risposte sono i DATI che fanno evolvere
> il sistema. Se non trovi un problema, scrivi `nessuna osservazione` e indica che cosa hai verificato:
> inventare un dato invalida la raccolta.
>
> ⚠️ **Mai mettere i simboli `❓ Q` o `✅ R` a INIZIO riga dentro una risposta.** L'hook li conta come
> struttura solo a inizio riga: se devi CITARE il formato dentro una tua risposta (es. «uso il formato
> ❓Q/✅R»), tienili **a metà frase**, non a capo. A inizio riga verrebbero scambiati per una nuova
> domanda/risposta e sballerebbero il conteggio (falso «risposta mancante»). Bug visto e corretto 04-06-26.

```
❓ Q1 — Prompt ricevuti: per ogni mandato/file-prompt usato indica **path** e **revisione o hash** al momento della lettura (es. `git rev-parse HEAD:<path>` o SHA — stesso dato di `source_refs[].revision_or_hash` in capsula). Per i messaggi di Matteo **non** contenuti in un file del repo, riportali verbatim.
✅ R1:

❓ Q2 — Dati = diff reale? Confermi che §4, §6-bis (`controls[]`) e i numeri del report coincidono con diff/git/comandi rieseguiti? Una riga + evidenza (output `validate:mss` o comando equivalente).
✅ R2:

❓ Q3 — File correlati: la tabella §5 «File di skill aggiornati» è completa e verificata? Se no, cosa manca (o «nessuno — motivo» come in §5).
✅ R3:

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4:

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, scrivi «nessuna osservazione» e cosa hai verificato.)
✅ R5:

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6:
```

### 12. Self-review del report ⭐ (la fai TU, prima che scatti l'hook)

> **L'hook controlla solo che tu abbia risposto in §11; la qualità la garantisci tu qui.** Non
> ripetere Q2/Q3 in prosa: diff e file correlati vivono **solo** nelle risposte §11. Il controllo
> **a mente fredda** operativo (rileggere diff/stage prima del commit) scatta **al pre-commit** —
> vedi «Cos'è l'hook» sotto — non nell'hook `stop` (D24: Q/R+capsula verdi → silenzio).

Checklist (3 punti, veloce):
1. **Triade MSS verde:** `validate:mss` sul report + `test:mss` (+ `test:mss:tools` se attrezzi).
2. **§5 tabella skill** allineata (non rimandata).
3. **§11 coerente:** le sei R hanno sostanza, non si contraddicono col lavoro; tono utente
   (flussi/schermate); handoff ricostruibile se deep/Meta.

Se un punto fallisce → **correggi ora** e annota in 1 riga cosa hai sistemato. Solo dopo dichiari il
report pronto.

> **Dopo il «report finale» (non «lavoro ok») scatta la controverifica imparziale.** Un sub-agente
> che NON ha eseguito il lavoro pesa report + diff contro i prompt di Matteo e il flusso dati/utente
> (scope creep? vocabolario reinterpretato?) ed emette un verdetto. Vive in
> [`CONTROVERIFICA.md`](CONTROVERIFICA.md). La self-review qui sopra la fai *tu* prima; la
> controverifica la fa *un altro agente* dopo.

---

## Tono (vale per le parti rivolte a Matteo, non per i dati tecnici interni)

Segui `COMUNICAZIONE_UTENTE_SKILL.md`: parla per **flussi e schermate**, non nomi-file isolati.
Errori in linguaggio umano («permesso negato», non `PGRST301`). Default sintetico, dettaglio on-demand.

---

## Cosa NON fare (per non causare disallineamenti)

- **NON modificare le skill da solo** (VOCABOLARIO, PREPARA_PROMPT, regole): se hai un'idea o
  un'osservazione, scrivila come **dato** in `OSSERVAZIONI.md` (o suggerimento nel report). La
  promozione a regola la fa SOLO una sessione Meta con Matteo (`REVISIONE.md`). «annota ≠ codificare».
- **NON promuovere voci** di vocabolario, **NON cambiare i livelli** Liv.1/2/3.
- **NON inventare un voto** sintetico alla sessione: scrivi i tuoi dati, il voto è del revisore.
- **NON aggiungere deliverable non richiesti** senza chiedere (freno scope creep, PREPARA_PROMPT §2).

---

## Cos'è l'hook di fine-chat (così non ti confonde)

A fine chat un hook Cursor (`stop`) legge **il `Report-*.md` più recente** che hai appena scritto e:
- controlla la **sezione 11 «Domande di chiusura»**: per ogni `❓ Q` verifica che la `✅ R` non sia
  vuota. **Se una risposta manca → rilancia** chiedendoti di compilarla. Ti dice ESATTAMENTE quali R sono vuote;
- se tutte le risposte ci sono → **silenzio**. Il controllo **a mente fredda** vive nel `pre-commit`,
  perché nel runtime Cursor osservato il rilancio leggero poteva ripetersi a ogni fine risposta.

**Tarature principali:**
- **Solo il report più recente.** L'hook guarda UN report (la chat che chiudi), non più tutti quelli
  toccati negli ultimi 20 min. Non ti blocca più la chiusura di oggi per una `R` vuota in un report
  di un'altra sessione.
- **Massimo 3 rilanci, su qualsiasi ramo.** Dopo 3 nudge l'hook tace comunque (`loop_limit: 3` +
  guardia interna). Non ti muri la chiusura all'infinito. (Era 2 in bozza, riportato a 3: la vera
  causa dell'insistenza era «troppi report insieme», risolta dal punto sopra.)
- **Meno falsi «risposta mancante».** Una risposta breve fra parentesi (es. «nessuno (nessuna skill
  copre il componente)») ora è accettata. Conta come vuota solo il vero vuoto / placeholder secco
  (`...`, `TODO`, `-`).
- Validatore MSS allo stop (23-08-26). Con Q/R complete, l'hook lancia lo stesso motore di
  `npm run validate:mss` sul report fresco (**ricorsivo** in sotto-cartelle — `report-paths.mjs`).
  Se la capsula nega → rilancio con field path. Se Q/R ok e validatore verde → **silenzio**
  (niente blocco «mente fredda» duplicato: resta §12 + pre-commit).
- **Cold-check al commit.** Il pre-commit scatta su ogni commit con file staged, anche quando nello
  stage non c'è un report: chiede una revisione a mente fredda una volta per versione staged. Se nello
  stage c'è un report incompleto, blocca finché Q1-Q6 non sono compilate.
- **Prerequisito Git locale.** Il cold-check gira solo se Git invoca Husky: `git config core.hooksPath`
  deve restituire `.husky` (non `nul`) e `.husky/pre-commit` deve avere shebang `#!/usr/bin/env sh`.
  Se un commit passa senza messaggio `PRE-COMMIT fine-sessione`, controlla prima questi due punti.

**È normale e voluto: assecondalo, completa ciò che segnala, non è un errore del sistema.** Se la chat
non aveva report (es. domanda veloce), l'hook tace.

> **L'hook è il guardiano meccanico, non il revisore.** Controlla che tu abbia *risposto* in §11, non
> che le risposte siano *vere*. Self-review §12 + pre-commit «mente fredda» coprono la qualità; lo
> `stop` tace se §11 e capsula sono verdi (D24).

### Cloud / Codex / Claude senza hook `stop` (fallback Opzione B — M-E2-C)

L'hook `stop` **non gira** su Cursor Cloud Agents, né su Codex/Claude Code senza installazione locale
degli hook. **Non promettere** un hook Cloud: la piattaforma non lo supporta. Enforcement misurato:

1. **Checklist obbligatoria** (prima di dichiarare chiusa una sessione standard/deep su queste superfici):
   - report con §11 Q/R piene + capsula §6-bis;
   - `npm run validate:mss -- --mode file --file "<report>" --kind report --require-capsule` → exit 0;
   - se tocchi MSS: `npm run test:mss` (e `test:mss:tools` se attrezzi).
2. **Gate post-hoc CI:** su push/PR (`main` / `env/test`) il job `mss` esegue
   `npm run validate:mss:changed` — un report standard/deep merged **senza capsula** esce rosso,
   indipendente dallo stop hook locale.

Residuo onesto: senza checklist rispettata e senza passare dalla CI, Cloud/Codex/Claude possono ancora
chiudere in locale senza nudge. Il buco `stop` resta dichiarato in `COVERAGE_MATRIX_H1.json`
(`stop_does_not_cover_cloud_codex_claude`).

### Chiusura **light** — JSONL + SESSION_LOG (enforcement Opzione B — M-E2-D)

Sessioni **light** (fix piccolo, 1 zona): **nessun** file `Report-*.md`. Chiusura = evento JSONL in
`docs/Sessioni di lavoro/GG-MM-AA/eventi-light/<record_id>.jsonl` + **una riga** in `docs/SESSION_LOG.md`
con `event_id` e link al `.jsonl` (fixture positiva `FX-V02`).

Enforcement misurato (stop hook + pre-commit `H1-JSONL-LIGHT`):

1. Un `Report-*.md` con `**Modalità:** light` → **deny** (`MSS-LIGHT-NO-EVENT`): la chiusura light non
   passa dal report; usa SESSION_LOG + JSONL.
2. Riga SESSION_LOG che dichiara light senza link `.jsonl` coerente → **deny** (stessa regola).
3. Percorso corretto FX-V02 (log + jsonl collegati) → **pass**.

Legacy/undeclared senza modalità restano fail-open sul report (non confonderli con light esplicita).

---

# PARTE B — Procedure operative di chiusura

> Scattano su **«fai report finale»** (capitolo chiuso → si pubblica). NON su «lavoro ok» (= solo
> scrivere il report). Il via al commit/push è sempre una conferma di Matteo.

## 1. Prima di committare: report allineato al codice
Controlla che il report descriva il **diff reale** (nessuna sezione rimasta indietro rispetto a fix
successivi). **Allinea le skill area toccate** (vedi Parte A §5): se il diff ha cambiato un
layout/comportamento documentato in una skill e quella skill è ancora indietro → aggiornala **ora**,
non dopo il merge. Il revisore che approva un merge con la skill stale ha lasciato passare un debito
(caso 03-06-26: `ItemPriceRow` citato nella skill dopo il refactor a `ComposeMenuItemPanelContent`).

## 2. Commit — separati per tipo
- **Codice** (`feat`/`fix`) e **documentazione** (`docs(...)`) in **commit distinti** (punti di
  ripristino indipendenti — Matteo lo preferisce).
- Il primo tentativo di commit può fermarsi per il **cold-check pre-commit**: rileggi report, diff e
  file correlati, correggi e ristagia se serve, poi rilancia lo stesso commit. Se non c'è report nello
  stage, conferma che sia voluto (task light, report già committato, o commit separato).
- Se il cold-check non compare affatto, verifica `git config core.hooksPath`: se vale `nul`, riattiva
  Husky con `git config core.hooksPath .husky`.
- Conventional Commits: `feat(scope):` · `fix(scope):` · `docs(scope):`.
- Corpo del commit: sezione **`Review:`** con i path per revisionare (report, SESSION_LOG, skill toccati).
- **`docs/` si committa normale:** dopo lo split repo (giugno 2026) questa repo è privata e `docs/`
  non è più gitignored — `git add` senza `-f`. Unica eccezione: `docs/_lavoro/` (privato, gitignored).
- Aggiungi SOLO i tuoi file: non includere modifiche/untracked altrui nel commit del task.

## 3. Allineamento branch `env/test` → `main` (se richiesto)
- Verifica: `git merge-base --is-ancestor main env/test` → se «sì», **fast-forward** pulito.
- Se il working tree ha modifiche non tue che bloccano il checkout → `git stash push <file>`, fai il
  merge, torna su env/test, `git stash pop` (preserva il lavoro altrui senza committarlo).
- `git checkout main && git merge --ff-only env/test && git push origin main`, poi torna su `env/test`.

## 4. Allineamento DB prod ↔ test (se richiesto)
- **Sola lettura per default.** `get_project_url` per sapere dove sei: `rwuxgvld`=PROD, `docnnernvp`=TEST.
- Confronta le migrazioni per **nome logico** (non per version: i due ambienti hanno schemi di
  versionamento diversi). Differenze storiche note (003 duplicate, RPC consolidate) ≠ disallineamento.
- **Mai scrivere su PROD** senza conferma esplicita di Matteo.

## 5. Release PrenotaZen (se il diff tocca codice servito)

Flusso: `main` privato allineato → `npm run release:prenotazen` → in PrenotaZen `npm run validate` +
`npm run build` → commit/push pubblico.

**Regola docs/CI (obbligatoria):** PrenotaZen **non** contiene `docs/`. Lo script
`scripts/sync-to-prenotazen.mjs` rimuove `validate:docs`, `scripts/check-doc-paths.mjs`,
allowlist e lo step CI «Validate doc paths». **Non** portare questi controlli nella repo pubblica:
`npm run validate` in PrenotaZen = lint + typecheck + test soltanto. In privato resta
`validate:docs` + step CI docs.

## 6. Terminali (nota obbligatoria in chiusura chat, 1-2 righe)
- Suggerisci di chiudere SOLO i terminali aperti **dall'agente** (validate, `npm run dev` in background avviati da tool).
- **Non** toccare il `npm run dev` che ha lanciato **Matteo** (può servirgli in locale).
- **Come riconoscere:** conta solo ciò avviato da tool agente in chat; tab vuote o «History restored» senza comando agente → opzionale chiudere, senza insistere. Non è obbligatorio terminare i processi dall'agente — è obbligatorio **ricordarglielo**.
- **Testo tipo:** «Puoi chiudere le tab terminale lasciate dall'agente (es. vecchi `npm run dev` su 5174/5175); tieni quella con il tuo dev se stai ancora lavorando in locale.»
