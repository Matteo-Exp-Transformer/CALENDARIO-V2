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

> 📦 **Sessioni 03-06-26 «allineamento skill» e «layout card ingredienti» → archiviate** in
> [ARCHIVIO_OSSERVAZIONI.md](ARCHIVIO_OSSERVAZIONI.md): la prima è diventata regola, la seconda è
> confluita nel rinforzo hook v3. La richiesta «riportare i prompt verbatim» è ora nel nudge hook.

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

> 📦 **Log-sessione storici (28-05 → 01-06-26)** spostati in [ARCHIVIO_OSSERVAZIONI.md](ARCHIVIO_OSSERVAZIONI.md)
> per alleggerire questo file. Qui restano: esiti Liv.2 (vivi), sessioni recenti, tabelle ricorrenti.
> Le nuove sessioni si appendono qui sotto; quando una è consolidata in regola, il revisore la sposta in archivio.
