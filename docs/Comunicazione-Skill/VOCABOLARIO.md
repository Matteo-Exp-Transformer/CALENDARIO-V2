# VOCABOLARIO — parole/frasi di Matteo → comportamento agente

> **Regola d'oro:** qui entrano **solo voci approvate da Matteo**. L'agente non aggiunge mai
> nulla in autonomia. Le candidate vivono in [PROPOSTE.md](PROPOSTE.md) finché Matteo non le
> approva; da lì salgono qui.

A inizio sessione l'agente legge questo file. Quando Matteo usa una voce mappata, l'agente si
comporta in base al **livello di libertà** della voce (vedi sotto).

---

## Livelli di libertà (quanto è libero l'agente di muoversi)

Ogni voce ha un livello da 1 a 3. Serve a Matteo per dosare quanta autonomia dare a una rule
quando è ancora incerto: una voce può nascere a livello 3 e salire a 1 col tempo, quando Matteo
vede che l'agente la applica bene.

| Liv. | Nome | Comportamento agente | Default |
|------|------|----------------------|---------|
| **1** | **Automatico** | Applica subito, senza chiedere nulla. La rule è consolidata. | agisce |
| **2** | **Con cautela** | Applica, **ma** se il contesto è ambiguo o non sei sicuro dell'intento → fai **una domanda preventiva breve** prima di agire. Se è chiaro, agisci. | agisce, salvo dubbio |
| **3** | **Conferma** | Chiedi **sempre** conferma prima di applicare, **a meno che** la frase di Matteo non sia **identica** (o quasi) a un caso già registrato come ok nella voce. | chiede |

**Regola pratica liv. 2 vs 3:** al livello 2 l'agente parte dal presupposto "agisco", e si ferma
solo se ha un dubbio reale. Al livello 3 parte dal presupposto "chiedo", e procede da solo solo
se il match è netto. Se non sai quale dare → metti 3, è il più prudente; lo abbassi dopo.

### Le voci Liv. 2 raccolgono dati (per decidere se promuoverle o regredirle)

Il livello 2 è uno stato "in osservazione". L'agente di lavoro, quando applica una voce Liv. 2,
**aggiorna il contatore della voce** (campo `Dati Liv.2` sotto) registrando in una riga:
- l'ha applicata e **andava bene** (Matteo non ha corretto) → segnale di **promozione → Liv. 1**;
- ha fatto la **domanda preventiva ed era superflua** (Matteo "sì ovvio, fai pure") → segnale di
  **promozione**;
- l'ha applicata ma Matteo ha **corretto/non era ciò che voleva** → segnale di **regressione → Liv. 3**.

L'agente di lavoro **non decide** promozione/regressione: scrive solo i dati. La decisione la
prende l'**agente revisore** in sessione separata (vedi `REVISIONE.md`), confrontando i numeri.

---

<!-- ============================================================
     REGOLA DI FALLBACK LESSICO — INIZIO
     Per disattivarla (sistema meno rigido): cancella tutto il blocco
     fra "INIZIO" e "FINE". Vale per TUTTI gli agenti che usano il vocabolario.
     ============================================================ -->

## Regola di fallback: quale parola usare quando il lessico non basta

Vale per **tutti** gli agenti che generano comandi dal vocabolario (per primo l'agente filtro
`PREPARA_PROMPT_SKILL.md`). Catena a gradini, in ordine:

1. **C'è una voce Liv. 1 pertinente** → usala direttamente, senza chiedere.
2. **Non c'è Liv. 1 ma c'è una Liv. 2 pertinente** → se hai **dubbi sul contesto di lavoro**,
   chiedi a Matteo se va bene usare quella parola Liv. 2 prima di procedere. Se il contesto è
   chiaro, applicala (è il comportamento Liv. 2 standard).
3. **Altrimenti** (resta solo una Liv. 3 pertinente) → attieniti al Liv. 3: chiedi sempre conferma
   prima di usarla, salvo match identico a un caso già ok.
4. **Non hai informazioni / non sai quali parole usare** → fai domande a Matteo per **definire
   parole nuove** (a opzioni o sì/no). Quando Matteo concorda una parola e ne indica il livello,
   **salvala subito in questo file** (sezione "Voci attive") col livello indicato — è
   un'approvazione esplicita sul momento. Usala per il comando corrente.

> Questa regola è una salvaguardia per la fase di test. Quando il sistema sarà rodato e Matteo
> vorrà provare un approccio meno rigido, si rimuove cancellando il blocco delimitato.

<!-- ============================================================
     REGOLA DI FALLBACK LESSICO — FINE
     ============================================================ -->

---

## Formato di una voce

```
### «frase o parola chiave» — Liv. N
- **Intende:** cosa vuole davvero Matteo (l'intento implicito)
- **Comportamento agente:** cosa deve fare l'agente quando la sente
- **Livello:** 1 (automatico) | 2 (cautela) | 3 (conferma) — + nota se è in prova/da rivedere
- **Casi identici già ok:** (per liv. 3) frasi esatte su cui può procedere senza chiedere
- **Dati Liv.2:** (solo se Liv.2) righe `GG-MM-AA · esito` dove esito = ok / domanda-superflua / corretto-da-Matteo
- **Approvata il:** GG-MM-AA
- **Origine:** report/chat da cui è nata
```

---

## Voci attive

> **Profili di ingresso** (vedi `APP_CONTEXT_SKILL.md` § 0.0): i termini sotto attivano un profilo,
> cioè quali skill l'agente carica a inizio task. Il **profilo** è solo uno smistatore e non ha
> livello; il **termine** sì. I LOCK obbligatori della tabella § 0 vincono sempre sul profilo.

### «implementa» · «sistema» · «fai» · «nuova feature» · «aggiungi» · «crea» — Liv. 1
- **Intende:** fare/modificare codice di una feature, un fix piccolo o un lavoro responsive → **profilo Esecuzione**
- **Comportamento agente:** entra in profilo Esecuzione — carica la skill dell'area pertinente (tabella § 0) + UI (`UI_EDIT`/`UI_RESPONSIVE` se tocca layout/stile); salta Testing/debug/comunicazione-revisione. I LOCK obbligatori (ADMIN_CLASSIC, BOOKING_DATA_FLOW, § 4b orari) restano dovuti se il task tocca quei file.
- **Livello:** 1 (automatico)
- **Casi identici già ok:** —
- **Approvata il:** 28-05-26
- **Origine:** chat mappatura profili di ingresso · `ANALISI_RACCOLTA_DATI_SKILL_SYSTEM`

### «revisiona» · «controlla» · «verifica» · «debugga» · «trova il bug» · «non funziona» — Liv. 1
- **Intende:** controllare codice/piani già prodotti, fare diagnosi o testing → **profilo Verifica**
- **Comportamento agente:** entra in profilo Verifica — carica `Testing-Skill/TESTING_SKILL.md` + la skill dell'area che sta revisionando; salta comunicazione-revisione. Su «revisiona … e committa» usa `npm run validate` come criterio oggettivo, ma si ferma e segnala se nota un difetto logico anche a test verdi.
- **Livello:** 1 (automatico)
- **Casi identici già ok:** —
- **Approvata il:** 28-05-26
- **Origine:** chat mappatura profili di ingresso · `ANALISI_RACCOLTA_DATI_SKILL_SYSTEM`

### «migliora comunicazione» · «aggiorna comunicazione» · «analizza comunicazione» · «revisiona comunicazione» — Liv. 1
- **Intende:** lavorare sul sistema di comunicazione/skill al livello **revisore** (revisione voci vocabolario, valutazione dati Liv.2, regole di stile) → **profilo Meta (revisore)**
- **Comportamento agente:** entra in profilo Meta — carica **solo** `COMUNICAZIONE_UTENTE_SKILL.md` + `Comunicazione-Skill/REVISIONE.md`; non carica skill di area/codice/DB/UI. È il ruolo **agente revisore** (sessione dedicata). «analizza»/«revisiona»/«controlla» comunicazione attivano **questo** ruolo, **mai** il Meta senior: diagnosi e proposte, non evoluzione del sistema.
- **Livello:** 1 (automatico)
- **Casi identici già ok:** —
- **Approvata il:** 28-05-26 (esteso 31-05-26: aggiunti «analizza/revisiona comunicazione», esplicitato che non attivano il senior)
- **Origine:** chat mappatura profili di ingresso · `ANALISI_RACCOLTA_DATI_SKILL_SYSTEM` · sessione test skill system 31-05-26

### «evolvi skill system senior» · «meta senior» — Liv. 1
- **Intende:** lavorare sullo skill system al livello più alto, **in chat con Matteo**, su tre fronti: **riorganizzare** (consolidare in fonti uniche, togliere duplicati), **snellire** (alleggerire i file di lavoro, archiviare il consolidato) ed **evolvere** (automazioni, milestone, potare idee morte) → **profilo Meta (senior)**
- **Comportamento agente:** entra in profilo Meta senior — carica `Comunicazione-Skill/EVOLUZIONE_SKILLS.md` (+ `REVISIONE.md` come contesto); non carica skill di area/codice/DB/UI. **Lavora come partner di ingegneria del sistema IN CHAT con Matteo** (non cala decisioni: usa `AskUserQuestion`, confronta le idee di Matteo con principi di ingegneria per educarlo). Applica il **Playbook del Meta senior** (in EVOLUZIONE_SKILLS): distingue **governance soft (markdown)** da **enforcement vero (hook)** con la domanda «la regola è verificabile dai file o solo dalla chat?»; alleggerisce con cohesion-by-phase + single-source-of-truth, evitando god-object. È il livello Opus, sessione dedicata. Distinto dal revisore: il revisore rifinisce le voci, il senior **riorganizza, snellisce ed evolve** il sistema.
- **Livello:** 1 (automatico) — **solo** se la frase contiene «senior» (o «meta senior»)
- **Casi identici già ok:** —
- **Approvata il:** 31-05-26
- **Origine:** sessione test skill system 31-05-26 (Matteo: il termine «senior» di EVOLUZIONE_SKILLS § «due livelli di Meta» va mappato come grilletto)

### «evolvi» / «evolvi skill system» SENZA «senior» — Liv. 2
- **Intende:** ambiguo — potrebbe voler dire il ruolo Meta senior (evoluzione del sistema) oppure un generico "miglioralo" da revisore. Manca il discriminante «senior».
- **Comportamento agente:** **non** partire diretto da senior. Fai **una domanda preventiva breve**: «Devo comportarmi come Meta senior (far evolvere il sistema: milestone/automazioni) o come revisore comunicazione (rifinire voci)?». Procedi solo dopo la risposta. Se Matteo aggiunge «senior» → sali alla voce Liv. 1 sopra.
- **Livello:** 2 (cautela) — il dubbio è strutturale, la domanda è quasi sempre dovuta
- **Dati Liv.2:**
- **Approvata il:** 31-05-26
- **Origine:** sessione test skill system 31-05-26 (Matteo: «se leggi evolvi ma non senior, chiedi per sicurezza»)

---

## Stile di comunicazione

### «spiegamelo semplice» · «in modo sintetico» — Liv. 1
- **Intende:** non una lezione tecnica, ma l'effetto concreto e chi fa cosa
- **Comportamento agente:** immagine concreta + esempio nell'app + dichiara esplicitamente chi fa l'azione (tu / il tool / config una-tantum / scelta UX); pochi blocchi, breve; niente codice salvo richiesta. Vedi `Metodo_spiegazioni_agenti_coding.md`.
- **Livello:** 1 (automatico)
- **Casi identici già ok:** —
- **Approvata il:** 28-05-26
- **Origine:** chat mappatura · OSSERVAZIONI (3+ occorrenze, es. cache PWA)

### «mantieni linea scalabile e pulita» · «no parti obsolete» — Liv. 1
- **Intende:** soluzioni durevoli, niente codice ridondante/legacy né sovra-ingegnerizzazione
- **Comportamento agente:** preferisci l'opzione scalabile e segnala esplicitamente cosa eviti (duplicazioni, file sparsi, astrazioni premature). Il «quanto» astrarre resta giudizio sul caso.
- **Livello:** 1 (automatico)
- **Casi identici già ok:** —
- **Approvata il:** 28-05-26
- **Origine:** chat mappatura · OSSERVAZIONI (2+ occorrenze)

### «fai report finale» — Liv. 1
- **Intende:** **capitolo chiuso → commit e push.** NON è la scrittura del report (quella avviene già con «lavoro ok», completa): qui Matteo dichiara che il lavoro è concluso e si pubblica. Aggiornato 01-06-26 (Matteo: «report finale è come dire, capitolo chiuso fai commit e push»).
- **Comportamento agente:** il report dev'essere già completo (scritto su «lavoro ok» con tutte le sezioni). **Controlla brevemente che sia allineato allo stato ATTUALE del codice** (le modifiche descritte corrispondono al diff reale — nessuna sezione rimasta indietro rispetto a fix successivi), poi: **allineamento skill § 7.2** delle aree toccate se mancante, **commit dedicati** (codice + `docs(...)` separati) e **push**. Il via al commit/push resta una conferma di Matteo. **In chiusura chat** (2–4 righe) includi la nota terminali (§7.3 APP_CONTEXT): chiudere **solo** i terminali aperti **dall'agente**; non toccare il `npm run dev` avviato **da Matteo**.
- **Livello:** 1 (automatico)
- **Casi identici già ok:** —
- **Approvata il:** 28-05-26 · ridefinita 01-06-26 (= commit+push, non scrittura report) · nota terminali 30-05-26
- **Origine:** chat mappatura · ridefinizione 01-06-26 (separa scrittura report da chiusura/pubblicazione)

### «dammi follow up» — Liv. 1
- **Intende:** passare il lavoro a un'altra chat dal punto esatto raggiunto, per evitare sessioni con troppo contesto. Rinominata da «dammi prompt proseguimento» il 01-06-26.
- **Comportamento agente:** rispondi con **solo il prompt** da incollare nella prossima chat — auto-contenuto, con contesto, obiettivo, file coinvolti, vincoli e punto esatto da cui ripartire. Nessun'altra spiegazione attorno.
- **Livello:** 1 (automatico)
- **Casi identici già ok:** «dammi prompt proseguimento» (vecchio nome) → stesso comportamento
- **Approvata il:** 28-05-26 · rinominata 01-06-26
- **Origine:** chat mappatura · OSSERVAZIONI (workflow multi-agente) · rinomina 01-06-26

### «prepara» · «prepara prompt» — Liv. 1
- **Intende:** Matteo sta per descrivere un lavoro in forma grezza e vuole che venga trasformato in un prompt ottimizzato per l'agente di lavoro, dopo un filtro su rischi e ambiguità
- **Comportamento agente:** carica la skill `PREPARA_PROMPT_SKILL.md` ed entra in modalità filtro d'ingresso — NON scrive codice. Legge APP_CONTEXT + vocabolario + `Archivio/CONTESTO_PRODOTTO.md`; fa le domande importanti prima (opzioni/sì-no), poi consegna **solo il prompt** in italiano per l'agente di lavoro, con le domande secondarie sotto. Usa i termini del vocabolario come lessico-comando.
- **Livello:** 1 (automatico)
- **Casi identici già ok:** —
- **Approvata il:** 28-05-26
- **Origine:** chat creazione agente filtro d'ingresso

### «revisione completa» — Liv. 1
- **Intende:** non un check superficiale, ma una revisione critica e indipendente del lavoro (tipicamente di un altro agente nel workflow pianifica → esegue → revisiona)
- **Comportamento agente:** entra in profilo Verifica; dichiara apertamente i difetti trovati (anche a test verdi), mai "ok" di cortesia. Riconosci il termine anche se è già nel testo di avvio dell'agente. Esegui `npm run validate` come criterio oggettivo, ma fermati e segnala i difetti logici prima di approvare/committare.
- **Livello:** 1 (automatico)
- **Casi identici già ok:** «revisione completa» nel prompt iniziale di una chat di revisione → procedi diretto
- **Approvata il:** 28-05-26
- **Origine:** chat mappatura · OSSERVAZIONI (workflow multi-agente)

### «lavoro ok» — Liv. 1
- **Intende:** task accettato **+ scrivi/aggiorna il report COMPLETO** del lavoro svolto. Ridefinita 01-06-26 (Matteo: «se fanno report gli agenti devono annotarsi già tutto quello che è successo e tutti i dati che ci servono»). NON è «fai report finale» (= commit+push).
- **Comportamento agente:** tratta il task come accettato e **scrivi un report completo** in `docs/Sessioni di lavoro/GG-MM-AA/` (o aggiorna quello del ciclo) con TUTTE le sezioni: cosa è cambiato (linguaggio utente), file toccati, **«Dati comunicazione»** (frasi di Matteo, prompt annotati), **dati grezzi della sessione** (n° giri, correzioni, difficoltà/derivazione errori) e la **tua lettura della qualità** (skill system, efficienza, chiarezza dei prompt, osservazioni/consigli) — espressa come **DATI e versione dell'agente**, NON come voto sintetico finale. Il **voto sintetico** lo dà il **revisore** confrontando le versioni dei vari agenti (le contraddizioni tra versioni sono un dato utile sull'affidabilità — fase raccolta dati 01-06-26). **NON committa, NON fa push** (quello è «fai report finale»).
- **Livello:** 1 (automatico)
- **Casi identici già ok:** «funziona» / «perfetto» → task accettato; ma il report completo parte su «lavoro ok» esplicito
- **Approvata il:** 29-05-26 · ridefinita 01-06-26 (ora include scrittura report completo)
- **Origine:** sessione miglioria skill system 29-05-26 · ridefinizione 01-06-26 (separare scrittura-report da chiusura-pubblicazione)

### «finestra di conferma» · «dialog di conferma» · «non vedo il modal» — Liv. 1
- **Intende:** la finestra di conferma deve essere il dialogo in-app (componente `Modal`, bianco con due pulsanti), NON il popup nativo del browser (`window.confirm`, grigio) che Matteo spesso non percepisce.
- **Comportamento agente:** in un task con «finestra/dialog di conferma» usa di default il componente `Modal` dell'app. Usa `window.confirm` solo se Matteo dice esplicitamente «popup nativo» o per parity legacy richiesta. Si lega a FU-003 (safe check delete uniforme).
- **Livello:** 1 (automatico)
- **Casi identici già ok:** —
- **Approvata il:** 29-05-26
- **Origine:** sessione miglioria skill system 29-05-26 (era PROPOSTE) · report promo conflitto 29-05-26

### «compila report … comunicazione … vocabolario (solo sicuro) … annota i miei prompt» — Liv. 2
- **Intende:** chiusura di una sessione meta/comunicazione (tipicamente prepara-prompt o senza codice): report dettagliato su comunicazione, proposte vocabolario senza junk, citazione verbatim dei prompt di Matteo.
- **Comportamento agente:** genera il report in `Sessioni di lavoro/GG-MM-AA/` con sezione «Dati comunicazione» completa + sottosezione «Prompt di Matteo (annotati)»; aggiorna `OSSERVAZIONI.md`; candidate solo in `PROPOSTE.md` (mai promuovere voci in `VOCABOLARIO.md` da solo). Estende «fai report finale» quando la sessione è meta, non implementazione.
- **Livello:** 2 (cautela)
- **Dati Liv.2:**
  - 29-05-26 · ok (ciclo card ingredienti — sezione comunicazione + prompt annotati applicati) · *ricostruito dai report, non live*
  - 29-05-26 · ok (card scorrevole admin — report comunicazione esaustivo) · *ricostruito dai report, non live*
- **⚠️ Nota Matteo (01-06-26):** Matteo dice questa frase **perché gli agenti si dimenticano** di annotare la sezione comunicazione nel report — è una **pezza a una dimenticanza**, non un comando che vuole dare. La cura vera non è promuovere la voce ma **far sì che gli agenti non se ne dimentichino** (stesso problema degli esiti Liv.2). Vedi nudge/enforcement in `EVOLUZIONE_SKILLS.md` (M4). Finché la dimenticanza non è risolta, la voce resta utile come promemoria manuale.
- **Approvata il:** 29-05-26
- **Origine:** sessione miglioria skill system 29-05-26 (era PROPOSTE) · report 29-05-26 · nota 01-06-26

### «revisiona [lavoro] e se è ok committa» — Liv. 2
- **Intende:** delega della revisione del lavoro di un altro agente, fidandosi della validazione automatica come prova di «ok».
- **Comportamento agente:** esegui `npm run validate` + check import rotti come criterio oggettivo; se verde, committa con messaggio che cita l'esito della revisione. **MA** se i test passano e noti un difetto logico (es. il caso PWA), fermati e segnalalo prima di committare — il verde non basta sempre. Coerente con la voce «revisione completa».
- **Livello:** 2 (cautela)
- **Dati Liv.2:**
  - 29-05-26 · ok (ciclo card ingredienti — «revisione ok» + commit, validate verde) · *ricostruito dai report, non live*
- **Conferma Matteo (01-06-26):** comportamento corretto e confermato (validate come prova + stop su difetto logico anche a verde).
- **Approvata il:** 29-05-26
- **Origine:** sessione miglioria skill system 29-05-26 (era PROPOSTE) · OSSERVAZIONI 28-05-26 · conferma 01-06-26

### Comportamento in plan mode (nessun termine — contesto) — Liv. 1
- **Intende:** quando l'agente entra in pianificazione, Matteo si aspetta domande sulle decisioni di sua competenza
- **Comportamento agente:** in plan mode, oltre a progettare, fai domande (AskUserQuestion con opzioni + impatto) su: (a) decisioni che competono a Matteo (prodotto, UX, scope, commerciale); (b) dubbi su come procedere o scelte strutturali che Matteo potrebbe non aver considerato. Non calare piani dall'alto su questi punti.
- **Livello:** 1 (automatico) — vale ogni volta che si entra in plan mode
- **Casi identici già ok:** —
- **Approvata il:** 28-05-26
- **Origine:** chat mappatura (riformulata da Matteo: legare al plan mode, non a un termine)

### Sicurezza produzione (DB / migrazioni / deploy) — Liv. 1
- **Intende:** massima cautela quando si tocca produzione; mai scrivere su PROD senza conferma
- **Comportamento agente:** prima di INSERT/UPDATE/DELETE/migrazioni via MCP verifica l'ambiente (`get_project_url`); se è PROD (`rwuxgvld`) fermati e chiedi conferma esplicita; su TEST (`docnnernvp`) procedi. Segnala sempre azioni che rischiano di pubblicare contenuto privato. Coerente con `CLAUDE.md` e APP_CONTEXT § 1b.
- **Livello:** 1 (automatico) — salvaguardia
- **Casi identici già ok:** —
- **Approvata il:** 28-05-26
- **Origine:** chat mappatura · `Metodo_spiegazioni_agenti_coding.md`

---

## Scorciatoie d'area (riferimento rapido a zone/componenti dell'app)

> Aiutano l'agente a non confondere zone simili (le tre "menu", pubblico vs admin). Caricano la skill d'area corretta.

### Pagina Prenota — «Pagina Prenota» · «form prenotazione clienti» · «modal/form prenotazione cliente» — Liv. 1
- **Punta a:** la pagina pubblica di prenotazione del cliente (`/prenota/:slug`)
- **Comportamento agente:** carica `docs/Prenota-Skill/PRENOTA_SKILL.md` (entry: senso + mappa) + `UI_RESPONSIVE_SKILL` / `UI_EDIT_SKILL`; per il layout/LOCK griglia striscia → `docs/Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md` §0.
- **Livello:** 1 (automatico)
- **Approvata il:** 28-05-26 (rif. aggiornato 29-05-26: ora punta al file di contesto, non a APP_CONTEXT §4)
- **Origine:** chat mappatura

<!-- «sticky» (layout) — RITIRATA da VOCABOLARIO il 02-06-26 (sessione Meta senior).
     Motivo: nei turni veri della chat freeze Prenota (02-06) Matteo aveva corretto l'agente che la
     metteva qui — «solo OSSERVAZIONI». Un agente l'aveva comunque promossa a Liv.1 senza ratifica
     (deviazione di processo). Il dossier revisore 02-06 ha rilevato l'incoerenza; il senior, con
     Matteo, la risolve a favore di quanto detto nei turni: la voce resta in OSSERVAZIONI come
     osservazione di Matteo non ancora promossa, finché lui non l'approva in una sessione dedicata.
     Per ripromuoverla servono: ok esplicito di Matteo + passaggio regolare PROPOSTE → VOCABOLARIO. -->

### Striscia laterale — «striscia laterale» · «striscia foto» — Liv. 1
- **Punta a:** la colonna foto verticale sticky a sinistra della pagina Prenota (`BookingPhotoStrip`, setting `public_booking_strip_photo`) — vedi `docs/Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md` §1-2
- **Comportamento agente:** carica quel file di contesto; rispetta il LOCK griglia (§0). Non confondere con lo sfondo «pagina intera» (`public_booking_page_background`): sono due modalità XOR.
- **Livello:** 1 (automatico)
- **Approvata il:** 29-05-26
- **Origine:** mappatura pagina Prenota (parola-mappa interna ovvia)

### Card scorrevole vs Carosello — «card scorrevole» · «carosello» (Prenota) — Liv. 1
- **Punta a:** le due presentazioni XOR delle sottotab di una modalità Prenota (`BookingMode.sub_tabs_presentation: 'cards' | 'carousel'`) — vedi `docs/Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md` §5
- **Comportamento agente:** distingui sempre le due: «card scorrevole» = `display='cards'` (griglia menù selezionabile); «carosello» = `display='carousel'` (foto + overlay per slide, una sola card con N foto, nessuna griglia). Mai mescolarle sulla stessa modalità.
- **Livello:** 1 (automatico)
- **Approvata il:** 29-05-26
- **Origine:** mappatura pagina Prenota (zone che l'agente confonde)

### Pagina Menu pubblica — «Pagina menù» · «pagina QR code» — Liv. 1
- **Punta a:** il menu digitale pubblico mobile (pagine `/menu/:slug`, QR)
- **Comportamento agente:** carica `PUBLIC_MENU_SKILL` + RULE Menu QR (APP_CONTEXT § 4).
- **Livello:** 1 (automatico)
- **Approvata il:** 28-05-26
- **Origine:** chat mappatura

### Pagina admin — «pagina admin» · «dashboard» (Liv. 1) · «main dell'app» (Liv. 2) — Liv. 1/2
- **Punta a:** la dashboard del ristoratore (`/admin` → AdminShell / AdminDashboard)
- **Comportamento agente:** carica `ADMIN_CLASSIC_SKILL` (admin classica) o `ADMIN_SHELL_SKILL` (shell/sidebar/sezioni) secondo cosa si tocca. «main dell'app» è Liv. 2: se ambiguo (admin vs intera app) chiedi quale intende.
- **Livello:** «pagina admin»/«dashboard» = 1; «main dell'app» = 2
- **Dati Liv.2 (solo «main dell'app»):**
- **Approvata il:** 28-05-26
- **Origine:** chat mappatura

### Menu per Pagina Prenota — «Menù prenotazioni» · «menu form prenotazioni» — Liv. 1
- **Punta a:** la **Personalizza form** (vetrina che sceglie cosa mostrare nelle card Prenota) — `BookingFormConfigPanel`, NON il magazzino
- **Comportamento agente:** carica `docs/Prenota-Skill/contesto/PRENOTA_FORM_CONFIG_CONTEXT.md`; se tocca il flusso dati, `docs/Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md` (obbligatorio).
- **Livello:** 1 (automatico)
- **Approvata il:** 28-05-26
- **Origine:** chat mappatura (Matteo: punta alla vetrina, non al magazzino)

### Menu per Pagina QR — «Menu qr code» · «menu pagina qr menù» — Liv. 1
- **Punta a:** la gestione del menu pubblico QR (`MenuQrManager` / `MenuQrModal`)
- **Comportamento agente:** carica `PUBLIC_MENU_SKILL` + RULE Menu QR.
- **Livello:** 1 (automatico)
- **Approvata il:** 28-05-26
- **Origine:** chat mappatura

### Menu magazzino (fonte di verità) — «menù fonte di verità» · «menu pagina impostazioni» (Liv. 1) · «menù originale» (Liv. 2) — Liv. 1/2
- **Punta a:** la **tab Menu** = magazzino unico di prezzi e ingredienti (`MenuPricesTab`), da cui Pagina Prenota e QR pescano i dati
- **Comportamento agente:** carica `docs/per-ui-design-skill/MENU_ADMIN_CONTEXT.md` (+ `docs/Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md` per il flusso, `DB_SKILL` per lo schema). «menù originale» è Liv. 2: se ambiguo rispetto alle altre due zone menu, chiedi.
- **Livello:** «fonte di verità»/«pagina impostazioni» = 1; «menù originale» = 2
- **Dati Liv.2 (solo «menù originale»):**
- **Approvata il:** 28-05-26
- **Origine:** chat mappatura

<!--
ESEMPIO di come apparirà una voce approvata (commentato, non attivo):

### «spiegamelo semplice» — Liv. 1
- **Intende:** non vuole una lezione tecnica, vuole capire l'effetto e chi fa cosa
- **Comportamento agente:** usa un'immagine concreta + esempio nell'app; separa in pochi blocchi;
  dichiara esplicitamente se è lavoro suo / automatismo del tool / config una-tantum / scelta UX.
  Max breve. Vedi Metodo_spiegazioni_agenti_coding.md.
- **Livello:** 1 (automatico)
- **Casi identici già ok:** —
- **Approvata il:** —
- **Origine:** —

### «sistema questo plan» — Liv. 3
- **Intende:** forse strutturare un piano, ma potrebbe voler dire altro a seconda del file aperto
- **Comportamento agente:** chiedi conferma su scope prima di riscrivere, salvo che dica esplicitamente "strutturalo come piano operativo"
- **Livello:** 3 (conferma) — in prova
- **Casi identici già ok:** «strutturalo come piano operativo» → procedi diretto
- **Approvata il:** —
- **Origine:** —
-->
