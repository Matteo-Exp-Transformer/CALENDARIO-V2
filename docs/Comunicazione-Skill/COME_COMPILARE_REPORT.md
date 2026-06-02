# COME COMPILARE UN REPORT — guida unica (citata dall'hook fine-chat)

> **Fonte unica.** Questo è il file a cui rimanda l'hook `stop` (`.cursor/hooks/fine-sessione-nudge.mjs`)
> quando a fine chat trova un report incompleto: «vedi COME_COMPILARE_REPORT.md». Tutte le istruzioni
> su cosa scrivere in un report stanno **qui**, in un posto solo. APP_CONTEXT §7.1 definisce QUANDO
> scrivere un report (modalità light/standard/deep) e rimanda qui per il COME.
>
> **Perché esiste:** l'hook controlla che le sezioni *esistano*, ma non può giudicare se sono piene
> e allineate. Questa guida è ciò che l'agente deve seguire perché il contenuto sia davvero utile.

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
