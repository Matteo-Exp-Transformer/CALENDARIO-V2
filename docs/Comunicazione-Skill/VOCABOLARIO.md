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

### «migliora comunicazione» · «aggiorna comunicazione» — Liv. 1
- **Intende:** lavorare sul sistema di comunicazione/skill (revisione voci vocabolario, regole di stile) → **profilo Meta**
- **Comportamento agente:** entra in profilo Meta — carica **solo** `COMUNICAZIONE_UTENTE_SKILL.md` + `Comunicazione-Skill/REVISIONE.md`; non carica skill di area/codice/DB/UI. È il ruolo agente revisore (sessione dedicata).
- **Livello:** 1 (automatico)
- **Casi identici già ok:** —
- **Approvata il:** 28-05-26
- **Origine:** chat mappatura profili di ingresso · `ANALISI_RACCOLTA_DATI_SKILL_SYSTEM`

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
- **Intende:** chiudere la sessione con il flusso di fine-chat (non parte da solo sulla conferma "ok/funziona": parte solo se Matteo lo dice)
- **Comportamento agente:** esegui il protocollo § 7 APP_CONTEXT: report § 7.1 in `docs/Sessioni di lavoro/GG-MM-AA/` (linguaggio utente, sezione Dati comunicazione), **allineamento skill § 7.2 delle aree toccate** (obbligatorio, anche se la riga è "nessuna"), e proponi i commit dedicati. Il via al commit resta una conferma di Matteo.
- **Livello:** 1 (automatico)
- **Casi identici già ok:** —
- **Approvata il:** 28-05-26
- **Origine:** chat mappatura (Matteo preferisce un termine esplicito al trigger sulla conferma)

### «dammi prompt proseguimento» — Liv. 1
- **Intende:** passare il lavoro a un'altra chat dal punto esatto raggiunto, per evitare sessioni con troppo contesto
- **Comportamento agente:** rispondi con **solo il prompt** da incollare nella prossima chat — auto-contenuto, con contesto, obiettivo, file coinvolti, vincoli e punto esatto da cui ripartire. Nessun'altra spiegazione attorno.
- **Livello:** 1 (automatico)
- **Casi identici già ok:** —
- **Approvata il:** 28-05-26
- **Origine:** chat mappatura · OSSERVAZIONI (workflow multi-agente)

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
- **Intende:** conferma che il codice/task è accettato (equivale a «funziona» / «perfetto» per il protocollo). NON è di per sé «fai report finale».
- **Comportamento agente:** tratta il task come accettato. Se Matteo aggiunge «fai report finale» (o equivalente) esegui il flusso § 7; da solo «lavoro ok» non avvia report né commit/push/migrazioni.
- **Livello:** 1 (automatico)
- **Casi identici già ok:** —
- **Approvata il:** 29-05-26
- **Origine:** sessione miglioria skill system 29-05-26 (era PROPOSTE) · report 29-05-26 card scorrevole titolo admin

### «finestra di conferma» · «dialog di conferma» · «non vedo il modal» — Liv. 1
- **Intende:** la finestra di conferma deve essere il dialogo in-app (componente `Modal`, bianco con due pulsanti), NON il popup nativo del browser (`window.confirm`, grigio) che Matteo spesso non percepisce.
- **Comportamento agente:** in un task con «finestra/dialog di conferma» usa di default il componente `Modal` dell'app. Usa `window.confirm` solo se Matteo dice esplicitamente «popup nativo» o per parity legacy richiesta. Si lega a FU-003 (safe check delete uniforme).
- **Livello:** 1 (automatico)
- **Casi identici già ok:** —
- **Approvata il:** 29-05-26
- **Origine:** sessione miglioria skill system 29-05-26 (era PROPOSTE) · report promo conflitto 29-05-26

### «comportamenti sono ok» · «non è un problema» + «voglio che cambi (come ti ho detto)» — Liv. 2
- **Intende:** cambio intenzionale, NON bugfix/regressione. Il comportamento attuale è accettabile come baseline; Matteo vuole un cambio mirato verso lo stato che ha descritto.
- **Comportamento agente:** nel prompt/report usa linguaggio «comportamento richiesto / cambio UX», mai «bug / ripristino / regressione». L'obiettivo è lo stato desiderato esatto, non una diagnosi. Se è ambiguo se vuole mantenere qualche aspetto del comportamento attuale → una domanda preventiva.
- **Livello:** 2 (cautela)
- **Dati Liv.2:**
- **Approvata il:** 29-05-26
- **Origine:** sessione miglioria skill system 29-05-26 (era PROPOSTE) · report prepara-prompt Prenota stacking 29-05-26

### «compila report … comunicazione … vocabolario (solo sicuro) … annota i miei prompt» — Liv. 2
- **Intende:** chiusura di una sessione meta/comunicazione (tipicamente prepara-prompt o senza codice): report dettagliato su comunicazione, proposte vocabolario senza junk, citazione verbatim dei prompt di Matteo.
- **Comportamento agente:** genera il report in `Sessioni di lavoro/GG-MM-AA/` con sezione «Dati comunicazione» completa + sottosezione «Prompt di Matteo (annotati)»; aggiorna `OSSERVAZIONI.md`; candidate solo in `PROPOSTE.md` (mai promuovere voci in `VOCABOLARIO.md` da solo). Estende «fai report finale» quando la sessione è meta, non implementazione.
- **Livello:** 2 (cautela)
- **Dati Liv.2:**
- **Approvata il:** 29-05-26
- **Origine:** sessione miglioria skill system 29-05-26 (era PROPOSTE) · report 29-05-26

### «revisiona [lavoro] e se è ok committa» — Liv. 2
- **Intende:** delega della revisione del lavoro di un altro agente, fidandosi della validazione automatica come prova di «ok».
- **Comportamento agente:** esegui `npm run validate` + check import rotti come criterio oggettivo; se verde, committa con messaggio che cita l'esito della revisione. **MA** se i test passano e noti un difetto logico (es. il caso PWA), fermati e segnalalo prima di committare — il verde non basta sempre. Coerente con la voce «revisione completa».
- **Livello:** 2 (cautela)
- **Dati Liv.2:**
- **Approvata il:** 29-05-26
- **Origine:** sessione miglioria skill system 29-05-26 (era PROPOSTE) · OSSERVAZIONI 28-05-26

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
- **Comportamento agente:** carica `docs/per-ui-design-skill/BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` + `UI_RESPONSIVE_SKILL` / `UI_EDIT_SKILL`; rispetta il LOCK griglia striscia (§0 di quel file).
- **Livello:** 1 (automatico)
- **Approvata il:** 28-05-26 (rif. aggiornato 29-05-26: ora punta al file di contesto, non a APP_CONTEXT §4)
- **Origine:** chat mappatura

### Striscia laterale — «striscia laterale» · «striscia foto» — Liv. 1
- **Punta a:** la colonna foto verticale sticky a sinistra della pagina Prenota (`BookingPhotoStrip`, setting `public_booking_strip_photo`) — vedi `BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` §1-2
- **Comportamento agente:** carica quel file di contesto; rispetta il LOCK griglia (§0). Non confondere con lo sfondo «pagina intera» (`public_booking_page_background`): sono due modalità XOR.
- **Livello:** 1 (automatico)
- **Approvata il:** 29-05-26
- **Origine:** mappatura pagina Prenota (parola-mappa interna ovvia)

### Card scorrevole vs Carosello — «card scorrevole» · «carosello» (Prenota) — Liv. 1
- **Punta a:** le due presentazioni XOR delle sottotab di una modalità Prenota (`BookingMode.sub_tabs_presentation: 'cards' | 'carousel'`) — vedi `BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` §5
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
- **Comportamento agente:** carica `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT`; se tocca il flusso dati, `BOOKING_DATA_FLOW_SKILL` (obbligatorio).
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
- **Comportamento agente:** carica `docs/per-ui-design-skill/MENU_ADMIN_CONTEXT.md` (+ `BOOKING_DATA_FLOW_SKILL` per il flusso, `DB_SKILL` per lo schema). «menù originale» è Liv. 2: se ambiguo rispetto alle altre due zone menu, chiedi.
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
