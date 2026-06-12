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

- **light** (fix piccolo, 1 zona, basso rischio): NIENTE file report → 1 riga in `docs/SESSION_LOG.md`.
- **standard / deep**: file `Report-*.md` in `docs/Sessioni di lavoro/GG-MM-AA/` con le sezioni sotto.

La modalità la assegna `PREPARA_PROMPT_SKILL.md` §1.A e la scrive nel prompt. Nel dubbio: standard.

---

## Le sezioni di un report standard/deep (in ordine)

### 1. Cappello (3 righe, sempre in cima)
- **Cosa è cambiato:** 1 frase, effetto per l'utente finale.
- **Cosa resta:** lavori aperti / follow-up, o «niente».
- **Serve una tua azione:** sì (cosa) / no.

### 2. Cosa è stato fatto
In ordine cronologico, in **linguaggio utente** (non «ho modificato X» ma «ora Mario vede Y»).

### 3. File toccati e perché
Tabella o elenco: file + perché. Compresi i file dello skill system se li hai toccati.

### 4. Test eseguiti e risultato
`npm run validate` (o cosa hai lanciato) + esito.

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

### 11. «Domande di chiusura» ⭐ (OBBLIGATORIA — l'hook la controlla riga per riga)
> **Questa sezione è contabile dalla macchina.** L'hook `stop` cerca ogni `❓ Q` e verifica che la
> riga `✅ R` corrispondente **non sia vuota** (né un placeholder tipo `...`, `-`, `TODO`, `_(…)_`).
> Se una risposta manca → **rilancia e blocca la chiusura** finché non la compili. Non è un fastidio:
> è ciò che impedisce i report superficiali. Rispondi sul serio — per rispondere ad alcune **devi**
> rileggere il diff e i file, ed è il punto.
>
> **Formato esatto (rispettalo o l'hook non trova la risposta):** copia il blocco, scrivi dopo `R:`.
> Vale per QUALSIASI report (esecutore, verifica, meta). Le risposte sono i DATI che fanno evolvere
> il sistema — anche le critiche «a vuoto» sono utili: se non trovi un problema, inventane uno plausibile.
>
> ⚠️ **Mai mettere i simboli `❓ Q` o `✅ R` a INIZIO riga dentro una risposta.** L'hook li conta come
> struttura solo a inizio riga: se devi CITARE il formato dentro una tua risposta (es. «uso il formato
> ❓Q/✅R»), tienili **a metà frase**, non a capo. A inizio riga verrebbero scambiati per una nuova
> domanda/risposta e sballerebbero il conteggio (falso «risposta mancante»). Bug visto e corretto 04-06-26.

```
❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1:

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2:

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3:

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4:

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5:

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6:
```

### 12. Self-review del report ⭐ (la fai TU, prima che scatti l'hook)

> **L'hook controlla solo che tu abbia risposto; la qualità la garantisci tu qui.** Prima di dire
> «report pronto», rileggi il tuo report **a mente fredda** e passa questa checklist. Non è un
> doppione delle domande Q1-Q6: lì *rispondi*, qui *ti correggi*. L'obiettivo è arrivare all'hook
> con il report già pulito, così il suo rilancio (max 2) trova poco o niente da segnalare.

Checklist (4 punti, veloce):
1. **Dati = diff reale.** Apri il diff: i file, i numeri, i nomi citati nel report esistono davvero e
   sono quelli giusti? Niente copiato a memoria, niente sezione rimasta indietro rispetto a un fix
   successivo.
2. **File correlati allineati.** Se hai cambiato un comportamento documentato in una skill area /
   context / test / tipi → quel file è aggiornato *in questa chiusura*? (vedi §5 — non è un follow-up.)
3. **Q1-Q6 coerenti.** Le risposte non si contraddicono tra loro né col lavoro svolto; ognuna ha
   sostanza (non «ok» a vuoto). Per Q2 e Q3 hai davvero riaperto i file.
4. **Tono utente.** Le parti rivolte a Matteo parlano per flussi/schermate, non nomi-file isolati.

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
- **Cold-check al commit.** Il pre-commit scatta su ogni commit con file staged, anche quando nello
  stage non c'è un report: chiede una revisione a mente fredda una volta per versione staged. Se nello
  stage c'è un report incompleto, blocca finché Q1-Q6 non sono compilate.
- **Prerequisito Git locale.** Il cold-check gira solo se Git invoca Husky: `git config core.hooksPath`
  deve restituire `.husky` (non `nul`) e `.husky/pre-commit` deve avere shebang `#!/usr/bin/env sh`.
  Se un commit passa senza messaggio `PRE-COMMIT fine-sessione`, controlla prima questi due punti.

**È normale e voluto: assecondalo, completa ciò che segnala, non è un errore del sistema.** Se la chat
non aveva report (es. domanda veloce), l'hook tace.

> **L'hook è il guardiano meccanico, non il revisore.** Controlla che tu abbia *risposto*, non che le
> risposte siano *vere*. La revisione del CONTENUTO la fai TU, con la self-review qui sotto (§12),
> prima che l'hook scatti.

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
