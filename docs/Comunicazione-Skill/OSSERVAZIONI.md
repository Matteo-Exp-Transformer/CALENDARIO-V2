# OSSERVAZIONI — registro dati su come lavora Matteo

> **Chi scrive:** gli agenti di lavoro, a fine chat (dopo conferma successo).
> **Chi legge e valuta:** l'agente revisore in sessione separata (vedi [REVISIONE.md](REVISIONE.md)).
> Gli agenti di lavoro **non** valutano né riformano: scrivono solo dati grezzi.
>
> Tenerlo conciso, una riga per osservazione. Quando un pattern matura → candidato in
> [PROPOSTE.md](PROPOSTE.md); approvato (dal revisore con Matteo) → voce in
> [VOCABOLARIO.md](VOCABOLARIO.md).
>
> Fonte storica (analisi iniziale dei pattern, maggio 2026), in `docs/_lavoro/Supporto/` (locale):
> `ANALISI_RACCOLTA_DATI_SKILL_SYSTEM.md.md` e `Metodo_spiegazioni_agenti_coding.md`.

---

## Esiti voci Liv.2 (riepilogo per il revisore)

> Sintesi degli esiti registrati sulle voci Liv.2 (il dettaglio per voce sta nel `VOCABOLARIO`).
> Il revisore guarda qui: tante `ok`/`domanda-superflua` → promuovere a Liv.1; `corretto-da-Matteo`
> ricorrenti → regredire a Liv.3 o riscrivere la voce.

> **Esiti ricostruiti dai report (01-06-26).** I primi esiti sono stati **ripescati dai report** del
> 29-05 (non raccolti live), per avviare il motore Liv.2 fermo a zero. Marcati *ricostruito*. Dal
> 30-05 in poi nessun esito live → conferma il problema di registrazione (vedi nudge/M4 in EVOLUZIONE).

| Voce Liv.2 | ok | domanda-superflua | corretto-da-Matteo | segnale |
|------------|----|-------------------|--------------------|---------|
| «main dell'app» (ambiguo admin vs app) | 0 | 0 | 0 | **Liv.2 attiva — Matteo conferma di tenerla (02-06-26)**; raccogliere esiti, NON archiviare |
| «menù originale» (ambiguo tra zone menu) | 0 | 0 | 0 | **Liv.2 attiva — Matteo conferma di tenerla (02-06-26)**; raccogliere esiti, NON archiviare |
| «compila report comunicazione + annota prompt» | 2 | 0 | 0 | **candidata Liv.1** — MA è pezza a dimenticanza agenti (01-06: risolvere col nudge, non promuovere) |
| «revisiona e se ok committa» | 1 | 0 | 0 | **candidata Liv.1** — comportamento confermato da Matteo 01-06 |
| ~~«comportamenti ok ma voglio che cambi»~~ | — | — | — | **ELIMINATA 01-06-26** (Matteo: non la usa) |

> **Decisioni Meta senior 02-06-26 (da dossier revisore):** (1) **guasto #1** curato con enforcement
> vero — hook `stop` v2 mirato, non nuove regole markdown (Matteo: le sezioni saltate erano già
> obbligatorie nel template → serviva la macchina). (2) **«sticky» RITIRATA** da VOCABOLARIO, torna
> qui in OSSERVAZIONI (vale quanto detto da Matteo nei turni veri: «solo OSSERVAZIONI»; era stata
> promossa senza ratifica = deviazione di processo sanata). (3) **scope creep** → freno accettato in
> PREPARA_PROMPT §2 (3 occorrenze). Report sessione senior: `docs/Sessioni di lavoro/02-06-26/`.

**Altre frasi di chiusura osservate** (conteggio + comportamento):

| Frase/intento | Volte | Comportamento emerso |
|---------------|-------|----------------------|
| «procedura finale» | 1 | chiusura §7: report + SESSION_LOG + FOLLOW_UP + OSSERVAZIONI |
| «report unificato o solo report?» | 1 | Matteo vuole sapere se un file o più file; risposta breve preferita |
| sessione mappatura DOM admin ↔ Prenota | 1 | liste lunghe path + esito OK/KO; conferme puntuali (import preset, 700px) |

## Sessioni registrate (append-only)

### 25-08-26 — Meta MSS: overload decisioni/sigle; «tutto chiuso» prima del pilota
- **Area:** comunicazione agenti ↔ Matteo (ciclo post-T12 / prep pilota).
- **Verbatim (sintesi fedele):** stanco di leggere sigle e di dover prendere 4 decisioni a griglia
  (A–Q / B–W) per chat; vuole max 1–3 problemi mirati per un cervello umano, non 40 paragrafi;
  sulla domanda «possono andare in parallelo?» vuole sì/no con una condizione, punto; non vuole
  ricevere prompt se ci sono ancora decisioni aperte; **vuole TUTTO chiuso prima di iniziare il
  pilota** — non «procedi e dichiara debiti» (pattern ripetuto da ~4 agenti).
- **Comportamento desiderato emerso:** (1) zero griglie multiple choice lunghe; (2) parallelo =
  una riga sì/no; (3) prompt solo a decisioni chiuse; (4) residui tecnici = da chiudere davvero,
  non parcheggiare come debito per sbloccare il passo dopo.
- **Esito stesso giorno:** (a) contratto comunicazione diretta codificato + cruscotto in italiano
  (`Report-contratto-comunicazione-diretta-25-08-26.md`, commit `5f024d8`); (b) residui T13 chiusi
  per davvero (`Report-chiusura-residui-t13-25-08-26.md`, commit `c361f2c`) — revisione prepara:
  lavagna WP-1 in «Da fare», gate T13→T14 senza debiti aperti, validate report OK.
- **Codifica:** `COMUNICAZIONE_UTENTE_SKILL.md` Regola zero + formato fine-task; `PREPARA_PROMPT_SKILL.md` §3 carico decisionale; ARCHIVIO_DECISIONI 25-08-26.

### 03-08-26 — 7 fix UI Servizio + digest Home: subagente bloccato nello scrivere il proprio report
- **Area:** Servizio — layout pagina (collapse fasce, header sale, piantina senza fascia) + digest
  Home (badge tavolo assegnato) + strip "Assegnate" (note/intolleranze). Codice + skill.
- **Cosa ho fatto:** revisionato il piano di Matteo contro il codice reale PRIMA di lanciare l'agente
  esecutore (trovate 3 correzioni: gate di vista sbagliato su "Aggiungi sala" — avrebbe tolto alla
  Mappa ogni modo di creare una sala —, file indicato sbagliato per il fix del badge tavolo, terza
  numerazione "FIX-N" in conflitto coi due round precedenti sullo stesso cantiere), corretto il
  prompt con le correzioni prima di girarlo, lanciato l'agente Sonnet in background. Al rientro
  verificato di persona, non sulla parola dell'agente: riletto il diff reale, rieseguito
  `npm run validate` (155 file / 1275 test verdi, combacia col report), riletto **per intero** (non
  solo la sezione nuova) entrambi i file skill toccati — nessuna riga stale trovata (caso E-A pulito
  questa volta, entrambi i file avevano già i rimandi incrociati corretti verso la sezione nuova).
- **Osservazione — subagente non può scrivere il proprio file di report:** il tool Write ha rifiutato
  la scrittura con un errore dell'harness («Subagents should return findings as text, not write
  report files»), non previsto nel prompt dato all'agente. Gestito scrivendo io il file di report a
  valle, sintetizzando (e verificando contro il diff, non copiando a memoria) il testo restituito
  dall'agente. **Pattern generale:** quando si delega a un subagente (tool Agent) la scrittura di un
  report/file di consegna, va dichiarato esplicitamente nel prompt «restituisci il report come testo,
  non scriverlo su file» — altrimenti l'agente tenta la Write, fallisce, e il file va comunque scritto
  dall'orchestratore a valle. Non promosso a regola da questo agente (dato, non codifica).
- **Report:** `docs/Sessioni di lavoro/03-08-26/Report-7fix-servizio-ui-03-08-26.md`.

### 02-08-26 (sera) — Revisione senior S4 giro 4: numeri di riga stale in un prompt multi-ondata
- **Area:** orchestrazione S4 giro 4 — nessun codice app toccato da questo agente.
- **Cosa ho fatto:** revisionato FIX-5/FIX-6 (riletto diff riga per riga contro il piano, verificato a
  mano che spostare/rimettere-in-attesa non consumi un turno mentre archiviare sì, rilanciato
  `npm run validate` di persona — 151/1247 verde, combacia col report) e l'allineamento migrazioni
  (verificato di persona `migration list --linked`, il dry-run, il blocco `--include-all`, e le
  colonne delle 4 migrazioni "sospette" presenti nei tipi rigenerati dal DB vero). Nessun problema in
  nessuno dei due. Poi ho lanciato i due agenti dell'ondata 1 del giro 4 (FIX-4D, FIX-4B+4C).
- **Osservazione — prompt "verificato" ≠ verificato adesso:** `PROMPT_AGENTI_E2E_S4.md` conteneva
  prompt per il giro 4 esplicitamente marcati «rimappati sul codice reale, non più una bozza». Ma nel
  frattempo S4-FIX-5/FIX-6 aveva aggiunto ~230 righe a `AssignmentMapPanel.tsx`, spostando di
  165-195 righe tutti i riferimenti puntuali del prompt P2 (FIX-4B+4C) su quel file. Trovato SOLO
  perché ho controllato i numeri citati contro il file reale prima di lanciare l'agente, invece di
  fidarmi della dicitura "verificato" nel documento. Corretti i riferimenti nel documento prima del
  lancio (per nome/ancora testuale, non solo numero di riga aggiornato). **Pattern generale:** un
  prompt pre-scritto per un'ondata successiva va ri-controllato contro il file reale se un'ondata
  precedente ha toccato lo stesso file nel frattempo — "verificato" ha una data di scadenza implicita.
  Non promosso a regola da questo agente (confine ruolo: dato, non codifica).
- **Area:** Servizio — sostituzione guidata tavolo occupato + divieto fasce accavallate (codice + skill).
- **E-A ricorrente (Dossier senior 04-06-26, D3 «si ripeterà»):** aggiornando solo la sezione toccata di
  `ADMIN_SHELL_PAGES_CONTEXT.md` (§ Servizio → Assegnazione tavoli) avrei lasciato stale una riga
  preesistente altrove nello stesso file («Undo = update append-only, non delete» — sbagliata, il codice
  fa un DELETE fisico). Trovata solo perché il nudge dell'hook fine-sessione ha chiesto esplicitamente
  «file correlati allineati? caso E-A» e ho riletto l'intero file, non solo la sezione nuova. **Seconda
  occorrenza reale** dopo quella del 04-06-26: rafforza il caso per D3 (regola esplicita in
  `CHIUSURA_SESSIONE.md` §5 — «rileggi tutto il file skill toccato» — o check nell'hook `stop`).
  Non promosso a regola da questo agente (confine deliverable esecutore).
- **Dato comunicazione — commit ≠ push, di nuovo:** Matteo ha detto «compila report finale lavoro e fai
  commit», poi ha corretto a «fai solo report del tuo lavoro e commit» (bloccando l'agente mentre stava
  per aggiornare `PROMPT_AGENTI_E2E_S4.md`/`COLLAUDO_S4_CHECKLIST.md`, fuori scope del suo lavoro
  diretto). Conferma il pattern dell'11-06-26: **«commit» esplicito non implica push automatico**, anche
  quando la frase di apertura richiamava «report finale» (che di vocabolario include push). Vince la
  richiesta più recente e più precisa.
- **Report:** `docs/Sessioni di lavoro/02-08-26/Report-fix5-fix6-servizio-02-08-26.md`.

### 21-06-26 — Ordine categorie Menu / dettaglio prenotazione (QA Matteo)
- **Prompt di ripartenza:** profilo, area, causa, punto di modifica, test e branch già espliciti; nessuna domanda necessaria.
- **QA:** Matteo ha controtestato il dettaglio prenotazione e confermato «funziona».
- **Chiusura autorizzata:** commit + push `env/test`, fast-forward `main` e release PrenotaZen richiesti nello stesso turno.
- **Esiti Liv.2:** nessuna voce Liv.2 applicata.

### 11-06-26 — Chiusura FU M3/MQR (Matteo QA)
- **FU-M3-QA-L3 fatto:** limite max **7 categorie** confermato in app da Matteo.
- **FU-M3-QA-CT:** resta **aperto** — controtest «rompi» browser extra, **sessioni future** (non blocca M3).
- **FU-MQR-3 fatto:** su PROD `da-tommaso` la categoria refuso **non c’è** — nessun fix.
- **FU-MQR-2:** resta **aperto** (ordine piatti per-QR).

### 11-06-26 — Roadmap E2E browser per ogni area blindata (Matteo)
- **Area:** Testing / blindatura trasversale.
- **Osservazione Matteo:** vuole **completare test E2E browser completi** (Playwright, viewport 375/834/1280, flussi reali) per **ogni area già blindata** — non solo Vitest.
- **Snapshot 11-06-26:** M1 shell ✅ E2E; M2 operative ✅ E2E; M3 menu ✅ E2E base; M0 Prenota parziale (FU-038/039); M2 Calendario ❌ spec dedicata (solo Vitest + QA manuale); Menu QR pubblico parziale; M4/M5 ⬜.
- **Esito:** candidato milestone trasversale (M6 o sessione senior «E2E matrix»); tracciare priorità con Matteo. Non promosso a VOCABOLARIO.

### 11-06-26 — Chiusura FU-M3-QA-E2E: "commit alla fine" più specifico di "push"
- **Area:** Admin Menu / magazzino — QA browser Playwright.
- **Prompt:** Matteo ha confermato il lavoro e chiesto "aggiorna documentazione di lavoro come dice chiusura sessione", "report completo finale" e "fai commit alla fine".
- **Dato comunicazione:** anche quando la chiusura richiama il protocollo finale, se Matteo specifica solo **commit** non dedurre automaticamente **push**. Seguire la richiesta più precisa e annotare in report che il push non è stato eseguito.
- **Esiti Liv.2:** nessuna voce Liv.2 applicata.
- **Report:** `docs/Sessioni di lavoro/11-06-26/Report-finale-fu-m3-qa-e2e-playwright-11-06-26.md`.

### 10-06-26 — Esecutori: non aggiornare plan/roadmap (confine deliverable)
- **Area:** skill system / workflow esecutore (non codice app).
- **Osservazione Matteo:** gli agenti **esecutori** non devono modificare file di **piano/roadmap**
  (`MASTERPLAN_BLINDATURA.md`, `PLAN_BLINDATURA_*.md`, handoff strategici, indici milestone) — solo
  file del **task in corso** (codice, test, skill d'area contestuali al diff) e **report di sessione**.
  La roadmap resta a senior / prepara-prompt salvo riga esplicita nel prompt.
- **Nota sessione M1:** il prompt A chiedeva aggiornare MASTERPLAN/FOLLOW_UP — eccezione voluta per
  quella chat; la regola di default resta «esecutore = task + report, non indice milestone».
- **Esito:** candidato per vincolo in `Output attesi:` dei prompt esecutore; non promosso a
  VOCABOLARIO senza revisore Meta.

### 10-06-26 — Ruolo agente senior: plan per milestone + gate merge (osservazione processo)
- **Area:** skill system / workflow senior (non codice app).
- **Osservazione Matteo:** in chat con lui, l’**agente senior** deve fornire **plan strutturati** per
  sviluppare l’app in base a **milestone** e **visione del progetto** (`CONTESTO_PRODOTTO` §4).
  Ogni milestone va abbinata a: **debug strutturale approfondito** + **test sistematico** del flusso
  dati e del flusso utente → poi **merge con main/production**.
- **Scopo per Matteo:** capire **quanto lavorare** (e su cosa) prima di fare merge in sicurezza — non
  solo «feature pronta» ma «area blindata abbastanza per prod».
- **Esito:** annotazione processo; nessuna promozione a VOCABOLARIO finché non approvata.

> 📦 **Sessioni 03-06-26 «allineamento skill» e «layout card ingredienti» → archiviate** in
> [ARCHIVIO_OSSERVAZIONI.md](ARCHIVIO_OSSERVAZIONI.md): la prima è diventata regola, la seconda è
> confluita nel rinforzo hook v3. La richiesta «riportare i prompt verbatim» è ora nel nudge hook.

### 06-06-26 — Admin Area 1 Shell (mappatura + blindatura avviata)
- **Area:** Admin autenticato — Shell / ingresso / navigazione globale.
- **Prompt:** Matteo ha usato profilo "Meta senior / orchestratore Admin", modalita deep, lista skill
  esplicita, vincolo "non modificare codice applicativo finche intervista non chiusa", poi
  "lavoro ok fai report finale".
- **Dato comunicazione:** Matteo ha scritto "dammi hand off per proseguire mappatura con nuovo agente".
  La frase ha lo stesso intento operativo di "dammi follow up" ma non va promossa automaticamente:
  registrare come candidata/variante da valutare in revisione, non come voce attiva.
- **Esiti Liv.2:** nessuna voce Liv.2 applicata.
- **Esito:** Area 1 intervista chiusa, fix shell avviati, validate verde (426 test), report
  `Report-blindatura-admin-area1-shell-06-06-26.md`.

### 03-06-26 — Limiti testo Pagina Prenota (prepara-prompt + esecutore + hook stop)
- **Area:** Pagina Prenota — limiti caratteri vetrina (`bookingPrenotaTextLimits.ts`) + form cliente silenzioso.
- **Ciclo:** prepara-prompt (chat A) → esecutore (chat B) → «lavoro ok» → revisore/chiusura (stessa chat) → **hook stop** da Matteo.
- **Hook stop ricevuto in questa sessione:** **sì** — messaggio «📄 FINE-SESSIONE — 2 report toccato/i…» (`.cursor/hooks/fine-sessione-nudge.mjs`). Ha obbligato sez. 8 piena, prompt verbatim, verifica skill; ha scoperto §6 layout context ancora con 60/120/20/300.
- **Errori allineamento skill (agente esecutore, non prepara):** log dettagliato in [ERRORI_PROCESSO.md](ERRORI_PROCESSO.md) § 03-06-26 limiti testo — sintesi: (1) mappa MD mancante a lavoro ok; (2) §8.1 ok ma §6 stale; (3) link skill a file inesistente; (4) report v1 scarno; (5) Tab Menu fuori scope → FU-030.
- **Richiesta Matteo (03-06-26):** annotare errori altro agente su skill + confermare hook → questo blocco + ERRORI_PROCESSO.
- **Esiti Liv.2:** prepara **ok** · lavoro ok **ok** · fai report finale (scritto «fwi») **ok**.
- **Report:** [Report limiti testo 03-06-26](../Sessioni%20di%20lavoro/03-06-26/Report-prenota-limiti-testo-03-06-26.md) · commit `111277e`+`06c9d9a`+`64530d7`.

### 03-06-26 — Prezzo ingredienti Prenota (prepara-prompt, chiarimento regola)
- **Area:** Pagina Prenota — card ingredienti (`BookingMenuCategoryCard`) + riepilogo (`BookingSummarySidebar`).
- **Pattern:** Matteo descrive il task con DOM path + componente; la regola di prodotto emerge dopo 2–3 turni (prezzo sottotab vs personalizzabile). Chiede al prepara-prompt di **annotare nel report** anche un «prompt iniziale ideale» in poche righe — la frase che avrebbe evitato ambiguità fin dall’inizio.
- **Proposta processo (Matteo 03-06-26, da valutare revisore):** in ogni sessione **prepara-prompt**, nel report o sotto il blocco copia-incolla, aggiungere sezione **«Prompt ideale (retroattivo)»** — 2–4 righe auto-contenute che Matteo avrebbe potuto incollare al posto del flusso grezzo (es. «Se la sottotab ha prezzo fisso: niente € sugli ingredienti; se personalizzabile: € come ora»). Non sostituisce il prompt esecutore; serve come memoria per sessioni simili e per affinare come Matteo formula le richieste.
- **Prompt ideale (retroattivo) per questa sessione:** «Pagina Prenota: dopo tab + sottotab card, se la sottotab ha prezzo/persona → mostra solo quello nel riepilogo (× coperti), nascondi € su ogni ingrediente in card e in «Il tuo menu»; se menù personalizzabile (senza prezzo fisso) → € ingredienti come ora. Solo questo, nient’altro.»

- **Esito:** esecuzione `485b7a2`, revisione rapida prepara OK, **QA Matteo OK** (03-06-26); commit docs `7d4d6aa`; ciclo chiuso.

### 02-06-26 — Prenota full-page freeze layout (prepara + esecuzione parziale, multi-turno)
- **Area:** Pagina Prenota pubblica, solo `isFullPagePhoto && !showPhotoStrip` — cap form 1168px, riepilogo esterno da 1600px.
- **Prompt:** 5 blocchi prepara + follow-up; regola operativa (Matteo, **non** voce VOCABOLARIO): su correzione prompt in chat prepara → agente riconsegna **prompt intero**, non solo il delta.
- **Esito:** Menu QR `283c36b` OK; Prenota freeze parziale commit `166b5a2` (fix sticky 1256–1599 + slot 3/4/5 sottotab **ancora pendenti**); 2º agente esecutore annullato da Matteo.
- **Pattern:** due breakpoint (1256/1600) + componente condiviso senza variant → agente tocca pagina ma non sidebar.
- **Report:** `docs/Sessioni di lavoro/02-06-26/Report-prenota-full-page-freeze-ciclo-layout-02-06-26.md`

**Osservazioni Matteo (comunicazione / lessico — restano in OSSERVAZIONI, non in VOCABOLARIO finché non approva):**

| Data chat | Osservazione Matteo | Uso per agenti |
|-----------|---------------------|----------------|
| 02-06-26 | Parola chiave **`sticky`**: indica che un elemento UI è **forzatamente agganciato** a un altro (o al bordo) mentre si scrolla — es. riepilogo che «resta a destra» invece di andare sotto il form. In prompt/fix scrivere «sticky» esplicitamente. | Fix layout Prenota 1256–1599: cercare `min-[1256px]:sticky` su `BookingSummarySidebar` istanza stacked. |
| 02-06-26 | In chat **prepara**, se corregge il prompt: l’agente deve ridare il **prompt completo**, non solo la parte cambiata (evita errori incollando delta su prompt vecchio). | ✅ **PROMOSSA a regola di formato** in PREPARA_PROMPT §1.B (Meta senior 02-06-26) — non voce VOCABOLARIO, è formato del prepara-prompt come «profilo+skill nel prompt». |
| 02-06-26 | Chiede spesso la frase lunga «aggiungi tutti i dati… prompt… skill system… osservazioni e dubbi» — **non** perché manchi nel sistema: **`lavoro ok`** e **`fai report finale`** già la coprono (`comandi-base` + voce «lavoro ok»). La ripete quando gli agenti **saltano** sezioni del report (stesso problema della voce Liv.2 «compila report comunicazione» = pezza alla dimenticanza). | Preferire **`lavoro ok`** a fine task; **`fai report finale`** solo commit/push; frase lunga solo se report scarno o chat solo meta. |
| 02-06-26 | **`sticky` e regole comunicazione nuove** → annotare in **OSSERVAZIONI** come osservazione sua, **non** aggiungere da solo in VOCABOLARIO. | Solo revisore/Meta senior + approvazione esplicita Matteo per promuovere voce. |
| 10-06-26 | **Agente senior in chat:** deve consegnare **plan strutturati** per sviluppo app allineati a **milestone + visione progetto**; per ogni milestone prevedere **debug strutturale approfondito** + **test sistematico** flusso dati e flusso utente → poi **merge main/production**. Serve a stimare **quanto lavorare prima del merge in sicurezza**. | Sessione senior / Meta: output = piano per milestone con gate (blindatura, test, criteri ✅ PROD) — non solo lista task. Collegare a blindatura Admin (`PLAN_BLINDATURA_ADMIN`), `CONTROVERIFICA.md`, `TESTING_SKILL` §7, chiusura merge `CHIUSURA_SESSIONE` Parte B. |
| 11-06-26 | **Stop ripetizioni post-decisione:** quando Matteo ha già classificato/deciso, non riformulare 3–4 volte (tabella + raccomandato + «confermi?» + riepilogo). Una risposta compatta + prompt copia-incolla. Ripetere solo su «spiegamelo» / «ragioniamo». | Liv.1 prepara-prompt verso Matteo dopo decisione presa. |
| 11-06-26 | **Niente elenchi minimali con sigle** (es. «FU-048 — C-U3 turni Pro» a riga secca): non capisce cosa manca. In chiusura sessione e «cosa resta» usare **parole intere** — schermata admin, effetto per lo staff, cosa fare — e citare il codice follow-up solo in seconda riga o tra parentesi. | Liv.1 comunicazione verso Matteo; vale report, chat, MASTERPLAN in sintesi per lui. |


## Frasi / richieste ricorrenti (con conteggio)

| Frase/intento | Volte osservate | Comportamento desiderato emerso |
|---------------|-----------------|--------------------------------|
| «compila report finale» (+ Dati comunicazione esaustivi) | 2 | §7 completo; funziona quando sessione ricca di feedback |
| «modal di base» per comunicazioni utenti app | 1 | Modal preferito vs toast per conferme/successo; vedi PROPOSTE |
| checklist smoke con path URL `/c/...` | 1 | **corretto-da-Matteo** → schermata + azione + effetto visivo |
| «come si chiama questo elemento» (es. toast) | 1 | nome utente prima (toast/Modal), tecnico dopo |
| «spiegami cosa decidere / dove siamo / come proseguire» (sintetico) | 1 | ciclo tabella + checklist + opzioni A/B/C con raccomandato; citare il prompt in report comunicazione |
| «spiegamelo semplice / in modo sintetico» | 3+ (chat PWA, Metodo, report) | metafora concreta + "chi fa cosa" + breve |
| «è una rule che devo ricordare io?» / «devo farlo ogni volta?» | 2+ | distinguere lavoro manuale ricorrente da automatismo del tool |
| «ottimo / funziona / perfetto / revisione ok» (conferma successo) | molte+ | trigger del protocollo fine-chat (report + skill + commit) |
| «lavoro ok» (conferma task) | 1 | usato con «fai report finale» + richiesta report comunicazione dettagliato; proposta PROPOSTE |
| «allineato a skill system» (post-implementazione) | 2 | Matteo si aspetta §7.1/§7.2 senza doverlo ripetere |
| «report con derivazione errori / prompt vs struttura vs agente» | 1 | 29-05-26 card ingredienti — chiesto esplicitamente nel report finale |
| «mantieni linea scalabile e pulita, no parti obsolete» | 2+ | preferire soluzioni durevoli, niente codice ridondante/legacy |
| «fammi delle domande per decidere» | 2+ | usare AskUserQuestion prima di pianificare, non calare piani dall'alto |
| report in `Sessioni di lavoro/` non `_lavoro/` | 1 (forte) | i report ufficiali vanno nella cartella datata |
| «aggiorna report … anche comunicazione» | 1 | vuole § Dati comunicazione nel report, non solo codice |
| report unificato per ciclo multi-agente | 1 | preferenza esplicita 29-05-26: un solo file aggiornato da prepara-prompt, esecutore e revisore, non N report paralleli |
| feedback UX «a scelta tra» vs multi-selezione | 1 | descrive il problema percepito in app, non il componente |
| «non vedo il modal» (dopo confirm browser) | 1 | vuole dialogo in-app visibile (`Modal`), non popup nativo |
| copy modale verbatim («mostra come testo solo questo…») | 1 | incolla testo desiderato — agente deve applicarlo letterale |
| «non ti ho detto di cambiarlo» | 1 | delta copy era solo intro/chiusura — agente aveva rimosso anche elenco con freccia → promo |
| «veder visivamente / paginetta mockup» per scegliere flusso UX | 1 | HTML stilizzato multi-stato (tab oggi/proposta/modale) prima del prompt esecutore — vedi PREPARA_PROMPT §1.B |
| «conflitto con scalabilità multi-azienda?» nelle decisioni tecniche | 1 | vuole verdetto esplicito ok/attenzione/conflitto nel report, non solo implementazione |
| autosave debug vs footer manuale in prod | 2 | debug: autosave campi semplici ok; prod commerciale: solo footer + validazione prima del pubblico (FU-004) |
| conferma Salva su dati esposti in Pagina Prenota | 1 | modale «saranno pubblici» — follow-up FU-005, non in fase debug |
| «tutto fatto» + raccolta comunicazione + commit | 1 | chiusura ciclo multi-agente; vuole OSSERVAZIONI/PROPOSTE aggiornati senza sessione Meta senior |
| «comportamento agente non senior corretto?» | 1 | conferma: solo raccolta dati + PROPOSTE, non promuovere VOCABOLARIO né riformare COMUNICAZIONE |
| footer mobile 50% + sfondo trasparente | 1 | decisioni UX esplicite dopo mockup HTML |
| domande non bloccanti lasciate al revisore | 1 | Classic vs Pro, smoke Prenota pubblica — ok lasciare ? in QA |
| «annota prompt ideale / come avrei dovuto dirlo» (prepara-prompt) | 1 | nel report prepara: sezione breve «Prompt ideale (retroattivo)» — 2–4 righe che catturano la regola di prodotto senza DOM path; candidato PROPOSTE per PREPARA_PROMPT §5 |
| «annota errori altro agente» + «hook in questa sessione» | 1 | tracciamento in ERRORI_PROCESSO + OSSERVAZIONI (03-06 limiti testo) |
| «basta sigle / griglie A-B / 40 paragrafi» + «tutto chiuso prima di proseguire» (no debiti) | 2 (25-08-26 rant + T13 chiuso davvero) | max 1–3 problemi; parallelo sì/no una riga; prompt solo dopo decisioni; vietato sbloccare dichiarando debiti — **accettato** → COMUNICAZIONE Regola zero + PREPARA §3 + ARCHIVIO 25-08-26 |

## Spiegazioni date e formato che ha funzionato

- **Cache PWA** → metafora "file usa-e-getta (hash) vs file-indice (html/sw)". Funzionato.
  La domanda chiave di Matteo era "devo rinominare i file io?" → sbloccato dicendo "lo fa Vite da solo".
- Pattern confermato: Matteo capisce quando gli dici **chi fa l'azione** (lui / il tool / l'agente),
  non quando spieghi *come* funziona internamente.

## Procedure ripetute richieste

- Fine sessione: report + aggiornamento skill + (ora) commit dedicato.
- Revisione critica e indipendente del lavoro di un altro agente (workflow multi-agente:
  pianifica → esegue → revisiona).
- Prima di prod/migrazioni/deploy: fermarsi e chiedere conferma.

## Workflow multi-agente osservato

- Matteo usa più agenti in catena: uno pianifica (plan mode), uno esegue (Sonnet in altra chat),
  uno revisiona. La revisione deve trovare difetti veri, non confermare per cortesia.
- **Preferenza processo (29-05-26):** per un ciclo tema (es. promo), **un report unificato**
  in `docs/Sessioni di lavoro/GG-MM-AA/` con sezioni per fase (prepara-prompt → esecuzione →
  revisione), invece di file `Report-*` separati per ogni agente. Vedi PROPOSTE «report unificato»
  e report revisione promo § Proposta report unificato.

## Token risparmiabili (dove Matteo scrive molto)

- Spiega ogni volta a lungo lo stile di comunicazione che vuole → risolvibile con vocabolario +
  skill caricata di default.
- Descrive ogni volta il flusso di fine-chat → ora codificato nel protocollo.

---

## 25-08-26 — prepara checklist QA Servizio + istanza 2 WP-1 MSS

- **Comunicazione:** quando l'agente prepara un piano con scelte per Matteo, le domande devono stare in
  una sezione **`Domande per te`**, in linguaggio semplice (cosa fare in app / effetto), separate dal
  plan tecnico per l'agente. Il piano mescolato con «criteri di accettazione» tecnici non dice chiaramente
  cosa rispondere → correzione richiesta esplicita.
- **MSS:** questa sessione = **istanza 2 di N** su WP-1 ombra (istanza 1 = blindatura test automatici
  Servizio). Istanza 2 = checklist collaudo manuale solo Matteo; confronto procedura MSS vs skill system
  normale; chiusura con report + capsula, **non** «WP-1 finito».

### 27-08-26 · Handoff — all'umano solo ciò che l'agente non può fare

- **Cosa è successo:** a fine seduta di freeze `AM-C0` il senior ha chiuso con una sezione «Il tuo
  prossimo passo» che elencava a Matteo quattro azioni operative: creare sei cartelle con `git worktree`,
  verificare un'esclusione, potare un file per data, lanciare 19 sessioni. Tutte azioni da agente.
- **Correzione di Matteo, verbatim:** «le cose che devo fare io sono le cose che deve fare prossimo
  agente. prepara prompt. io DEVO fare cose che agenti nonpossono fare. prepara prompt per prossimo
  agente che proseguira e gestirà i test».
- **Regola che ne esce:** la chiusura di una seduta non produce una lista di compiti per Matteo, produce
  un **mandato per la chat successiva**. Ciò che resta a lui è solo ciò che un agente non può fare:
  aprire sessioni in runtime non pilotabili, e prendere decisioni. Il mandato deve contenere un elenco
  **chiuso** di ciò che si chiede all'umano, così che l'agente successivo non ricada nello stesso errore.
- **Esito:** scritto `Prompt-senior-esecuzione-calibrazione-am-c0-27-08-26.md`, con §7 «Cosa chiedi a
  Matteo, e solo questo». Osservazione registrata, **nessuna promozione a voce del VOCABOLARIO**:
  è la 1ª occorrenza esplicita. Se si ripete, sale di livello.
- **Nota collegata (stessa seduta):** ha chiesto anche di non ricevere testo esplicativo prima delle
  domande — «non darmi contenuti da laeggere che spiegano. andiamo direttamente avanti». Coerente con
  «indirizzami, non farmi scegliere» già registrato.

> 📦 **Log-sessione storici (28-05 → 01-06-26)** spostati in [ARCHIVIO_OSSERVAZIONI.md](ARCHIVIO_OSSERVAZIONI.md)
> per alleggerire questo file. Qui restano: esiti Liv.2 (vivi), sessioni recenti, tabelle ricorrenti.
> Le nuove sessioni si appendono qui sotto; quando una è consolidata in regola, il revisore la sposta in archivio.

### 26-08-26 · WP-1 istanza 2 diagnosi collaudo Servizio · deep
- **Correzione Matteo su output:** dopo report diagnosi P0/P1/P2 + domande Sì/No, Matteo: fatica a capire ordine; vuole **causa → effetto → soluzione**; troppe ipotesi/domande/info; domande solo se mancano dati per indirizzare. Annotare per Meta senior.
- **Contesto:** profilo Verifica, zero `src/`, piano per ultimare checklist (resta T7-bis; T15 chiuso da Matteo pomeriggio con note copy/ordine campi).
- **Dato grezzo:** preferenza formato «indirizzami, non farmi scegliere tra griglie». Occorrenza comunicazione post-diagnosi MSS ombra.

### 26-08-26 · fail procedura capsula P0/P1 (raccolta errori agenti)
- **Mandato Matteo:** i fail di `mss:capsule` / `validate:mss` vanno **sempre** annotati nel report (non solo l'OK finale); accumulare dati su errori di procedura agenti.
- **Fail 1:** `MSS-PARSE-JSONL-AMBIGUOUS` — titolo «Capsula MetaSkillSystem» già nel report senza JSONL → append rifiutato.
- **Fail 2:** `MSS-OUTPUT-ASSERTION` / `MSS-PRODUCT-GATE` — judgments minimali incompleti rispetto allo schema asse output/sistema.
- **Ripresa OK:** judgments stampo da chiusura collaudo; sezione 6-bis rinominata; `validate:mss --require-capsule` verde.
- **Regola portata in:** `CHIUSURA_SESSIONE.md` (fail intermedi obbligatori in report) + report P0/P1 §4-bis.
- **26-08-26 (sera Meta) — template corretto, causa radice chiusa:** `CHIUSURA_SESSIONE.md` §6-bis ora ha STOP
  anti-collisione (non intitolare a mano «Capsula MetaSkillSystem»; titolo procedura «Registrazione di seduta
  (MSS)»); allineamento minimo in `SCHEDA_CHIUSURA_META_R1.md`. Non è più un promemoria agli agenti: è il
  template che non invita più al deny.

### 26-08-26 (sera) · Meta senior — analisi 2 istanze WP-1, procedure, forense MSS
- **Esiti delle due istanze comunicazione (verdetto Meta, OK di Matteo in chat):**
  - *Istanza 1 (output troppo denso post-diagnosi):* **non è voce VOCABOLARIO, resta osservazione + formato
    di prompt.** La sostanza esisteva già in tre punti e veniva saltata lo stesso — 2ª occorrenza in 24 ore.
    Codificata come **riga obbligatoria nei prompt di Verifica/diagnosi** in `PREPARA_PROMPT_SKILL.md` §3
    (semi-enforcement: verificabile solo dalla chat, nessun hook possibile). Misura: formato rispettato
    sì/no · n. domande poste · n. corrette da Matteo. Alla 3ª `corretto-da-Matteo` si rialza di livello.
  - *Istanza 2 (fail capsula):* regola **giusta**, **ratificata** in questa seduta; la deviazione di
    processo (chat di lavoro che legifera) è in [ERRORI_PROCESSO.md](ERRORI_PROCESSO.md) § 26-08-26.
- **Dato Matteo (verbatim, punto 5 della chat):** «a fine lavoro istanza 2 ho eseguito io i test e annotato
  con X i 3 ritest poiché li ho fatti. non l'ho comunicato ad agente, e non gli ho ripetuto io di fare
  commit aggiornamento report e annotare di segnare errori di procedure con capsule e tool.»
  → **Due letture, entrambe utili.** (a) La verifica umana è avvenuta davvero ed è il dato Persona più
  ricco del pilota, ma **non esiste nel registro**: MSS non ha un canale d'ingresso per Matteo (asse
  Persona vuoto in 55 `judgments-*.json` su 56). (b) Ciò che accade **solo se Matteo lo ripete** non è una
  regola, è un promemoria — commit, aggiornamento report e annotazione dei fail sono già scritti in
  `CHIUSURA_SESSIONE.md`. Se dipendono dal suo ricordo, l'enforcement è altrove che nel markdown.
- **Firma sulle caselle di collaudo (decisa 26-08-26).** Una casella `[x]` scritta da Matteo e una scritta
  da un agente sono **identiche byte per byte**: un revisore a freddo di questa seduta, con git + ledger +
  report davanti, ha concluso il falso. Da ora ogni prova superata porta `— verificato da <chi>, <data>`.
- **Osservazione su come Matteo lavora (dato grezzo, nessuna promozione):** ha eseguito **di persona** le 26
  prove del collaudo e i 3 ritest, trovando 7 difetti reali. Le decisioni di prodotto in questa chat (turni,
  walk-in) sono arrivate **come proposta sua**, non come risposta a griglie — coerente con la sua richiesta
  «indirizzami, non farmi scegliere». *Materiale per il binario valutazione, non per il VOCABOLARIO.*
- **Forense MSS (numeri da comando):** 147 file con capsula · 610 record · 146 sedute · 495 controlli
  (468 pass, 25 fail) · **0 su 438 annotazioni verificate da terzi**. Pilota WP-1: 7 capsule + 1 report
  senza capsula; asse Persona vuoto 7/7. `mss:doctor` **rosso** e `validate:mss:all` **rosso** mentre il
  pilota gira — una delle cause è un test del MSS congelato sullo stato *precedente* di WP-1
  (`docs/MetaSkillSystem/tests/tools/run.mjs:1748`). **La macchina anti-stale garantisce la coerenza, non
  la verità:** il cruscotto è «allineato» a `PLAN_V0`, che è fermo a 25/26 mentre il collaudo è 26/26.
- **Artefatto pubblicato (Cruscotto Matteo):** fermo al **24-08-26** — quattro sedute indietro. Il file
  `docs/MetaSkillSystem/Cruscotto MSS.html` è **fuori dai cancelli**: `scripts/mss/views-html.mjs` rifiuta
  per progetto di scrivere sotto `docs/` versionati (`MSS-VIEWS-HTML-OUT`). Decisione di Matteo: si
  riallinea a fine seduta del prossimo orchestratore, **non** ora e **non** prima che l'owner sia ratificato.
- **Decisioni prodotto prese in questa chat:** limite coperti walk-in **rimosso** (il walk-in resta soggetto
  al conteggio posti di fascia, con avviso e forzatura — comportamento già esistente); turni tavolo →
  proposta di Matteo su fine-turno dichiarata dall'admin, in valutazione (vedi report di seduta).

### 27-08-26 · Linguaggio chiaro per decisioni MSS — esempio riuscito, non nuova regola

- **Da dove si partiva:** la formula «prima proviamo il nuovo sistema sui tre lavori reali; poi facciamo un confronto separato fra due agenti Cursor» non faceva capire a Matteo chi lanciasse le chat, in quale ordine, quale fosse il materiale uguale e cosa venisse giudicato.
- **Formato che ha funzionato:** metafora di due agenti davanti allo stesso bivio; frasi complete che nominano soggetto, azione, motivo e limite; sequenza concreta di lancio; distinzione fra ciò che è già deciso, ciò che va chiesto e ciò che deve fermare l'agente. Nessuna sigla lasciata senza spiegazione nella risposta a Matteo.
- **Feedback diretto di Matteo:** «ottimo. questo tipo di output mi piace molto. è chiaro e mi aiuta a non dover indovinare di cosa parli, è chiaro e mi fa capire come approfondire il discorso per scegliere bene.»
- **Uso futuro:** quando un piano MSS propone test o decisioni, spiegare prima la scena concreta (chi riceve cosa, cosa fa, cosa si guarda) e solo dopo i codici del sistema. Questa è un'osservazione registrata: non promuove da sola una voce nel VOCABOLARIO.
