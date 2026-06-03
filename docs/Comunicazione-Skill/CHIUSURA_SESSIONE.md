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

A fine chat un hook Cursor (`stop`) legge i `Report-*.md` che hai appena scritto e:
- se manca una sezione obbligatoria → te lo dice citando il file;
- ti ricorda di scrivere **la sezione 8** (la tua lettura) e gli esiti delle voci Liv.2 usate.
**È normale e voluto: assecondalo, completa ciò che segnala, non è un errore del sistema.** Non blocca
la chiusura (smart-allow). Se la chat non aveva report (es. domanda veloce), l'hook tace.

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
- Conventional Commits: `feat(scope):` · `fix(scope):` · `docs(scope):`.
- Corpo del commit: sezione **`Review:`** con i path per revisionare (report, SESSION_LOG, skill toccati).
- **Trappola gitignore `docs/`:** la cartella `docs/` è gitignored → i file **nuovi** lì dentro
  (report nuovi) richiedono `git add -f`. I file **già tracciati** si committano normali. Se un `git add`
  misto fallisce «paths are ignored», forza con `-f` il file nuovo e ripeti.
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

## 5. Terminali (nota obbligatoria in chiusura chat, 1-2 righe)
- Suggerisci di chiudere SOLO i terminali aperti **dall'agente** (validate, `npm run dev` in background avviati da tool).
- **Non** toccare il `npm run dev` che ha lanciato **Matteo** (può servirgli in locale).
