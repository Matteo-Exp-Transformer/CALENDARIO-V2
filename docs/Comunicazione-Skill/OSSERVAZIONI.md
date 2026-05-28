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

| Voce Liv.2 | ok | domanda-superflua | corretto-da-Matteo | segnale |
|------------|----|-------------------|--------------------|---------|
| «main dell'app» (ambiguo admin vs app) | 0 | 0 | 0 | nuova 28-05 |
| «menù originale» (ambiguo tra zone menu) | 0 | 0 | 0 | nuova 28-05 |

## Frasi / richieste ricorrenti (con conteggio)

| Frase/intento | Volte osservate | Comportamento desiderato emerso |
|---------------|-----------------|--------------------------------|
| «spiegamelo semplice / in modo sintetico» | 3+ (chat PWA, Metodo, report) | metafora concreta + "chi fa cosa" + breve |
| «è una rule che devo ricordare io?» / «devo farlo ogni volta?» | 2+ | distinguere lavoro manuale ricorrente da automatismo del tool |
| «ottimo / funziona / perfetto / revisione ok» (conferma successo) | molte+ | trigger del protocollo fine-chat (report + skill + commit) |
| «allineato a skill system» (post-implementazione) | 2 | Matteo si aspetta §7.1/§7.2 senza doverlo ripetere |
| «report con derivazione errori / prompt vs struttura vs agente» | 1 | 29-05-26 card ingredienti — chiesto esplicitamente nel report finale |
| «mantieni linea scalabile e pulita, no parti obsolete» | 2+ | preferire soluzioni durevoli, niente codice ridondante/legacy |
| «fammi delle domande per decidere» | 2+ | usare AskUserQuestion prima di pianificare, non calare piani dall'alto |
| report in `Sessioni di lavoro/` non `_lavoro/` | 1 (forte) | i report ufficiali vanno nella cartella datata |

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

## Token risparmiabili (dove Matteo scrive molto)

- Spiega ogni volta a lungo lo stile di comunicazione che vuole → risolvibile con vocabolario +
  skill caricata di default.
- Descrive ogni volta il flusso di fine-chat → ora codificato nel protocollo.

---

## Log per data

### 29-05-26 — Esecuzione: scroll interno + overlay portal card ingredienti Prenota
- Implementazione su `BookingMenuCategoryCard` + `bookingMenuComposePanelLayout.ts`; skill §4 aggiornata.
- **Intento invertito** rispetto al report prepara-prompt mattina: Matteo vuole overlay **sopra** form/riepilogo, non evitarlo.
- 3 cicli feedback: (1) overlay no → sì; (2) absolute/z-index fallisce; (3) portal ok ma ingredienti giganti → larghezza card.
- Conferma: «ok ora ci siamo!» — report con sezione **derivazione errori** (prompt vs struttura CSS vs agente) su richiesta esplicita Matteo.
- Chiusura sera: «revisione ok» + report esaustivo + commit + allineamento skill — pattern §7 completo senza ripetizione istruzioni.
- Report: `docs/Sessioni di lavoro/29-05-26/Report-prenota-card-ingredienti-scroll-overlay-29-05-26.md`

### 29-05-26 — Chiusura ciclo: card ingredienti Prenota (prepara → esecuzione → revisione OK)
- Matteo: «revisione ok» + report esaustivo prepara-prompt + commit.
- Ciclo completo documentato in `Report-finale-ciclo-prepara-prompt-card-ingredienti-29-05-26.md` (tutti i messaggi, pivot overlay, prompt v1/v2/v3 revisione).
- Pivot critico stessa giornata: mattina prompt **anti-overlap** → esecuzione Matteo chiede **overlay voluto** → soluzione portal + scroll 3 righe.
- Revisione accurata: agente Verifica esterno, OK confermato da Matteo.
- Pattern utile: dichiarare «overlay sì/no» a monte nei prompt UI stacking (candidate PROPOSTE/process PREPARA_PROMPT).

### 29-05-26 — Prepara prompt: card ingredienti Prenota (stacking) + report comunicazione
- Sessione **senza codice**: filtro `PREPARA_PROMPT_SKILL` su overlap ingredienti vs campi/riepilogo
  (`ComposeScrollRow` / `BookingMenuCategoryCard`).
- Correzione Matteo: «non è un problema, comportamenti ok, voglio che cambi come ti ho detto» →
  **non** usare framing bug/regressione nel prompt; vincolo «tutte le categorie aperte insieme».
- Chiesto esplicitamente: chi revisiona (tu vs altro) perché **task delicata** → risposta:
  revisione **accurata**, agente Verifica esterno.
- Chiusura in due passi: (1) report + PROPOSTE + prompt annotati; (2) Matteo chiede report
  **autosufficiente** («tutto in documenti? revisore lo sa?» + «annota tutto … status skill system»).
- Report consolidato v2: prompt esecutore (Appendice A) + prompt revisione (Appendice B) + analisi
  skill system + cronologia chat completa — **non serve rileggere la chat**.
- Report: `docs/Sessioni di lavoro/29-05-26/Report-prepara-prompt-prenota-card-ingredienti-stack-29-05-26.md`.

### 28-05-26 (parte 5) — Carosello `show_offer_details_in_summary` (Prenota)
- Task in due tempi: implementazione feature + follow-up UI admin/sticky; conferma «ok funziona».
- Matteo ha richiesto esplicitamente allineamento skill system dopo la prima implementazione
  (report troppo corto, skill d’area non aggiornate subito) → pattern: per `SubTab` + Personalizza
  form caricare `BOOKING_DATA_FLOW` + `BOOKING_FORM_CONFIG_PANEL` e chiudere con report §7 completo.
- Spec follow-up molto precisa (layout toggle, regole sticky senza label/chip) → esecuzione senza
  domande aggiuntive; validazione automatica + prova manuale di Matteo.
- Report finale consolidato: `Report-carosello-riepilogo-toggle-finale-28-05-26.md`.

### 28-05-26 (parte 4) — Agente filtro d'ingresso «prepara prompt»
- Nuova skill `PREPARA_PROMPT_SKILL.md`: filtro a monte che trasforma il flusso grezzo di Matteo in
  un prompt ottimizzato per l'agente di lavoro. Non scrive codice; legge skill + archivio, non il codice.
- Output: solo il prompt testuale italiano; domande importanti prima (opzioni/sì-no), secondarie sotto.
- Precisazione chiave di Matteo: **scopo del vocabolario = parole definite e accettate per generare
  comandi**. Il filtro usa il vocabolario come lessico-comando (traduce il grezzo nei termini ufficiali).
- Preferenze confermate: "meglio una domanda in più che una in meno"; predilige risposte a opzioni o sì/no.
- Voce «prepara / prepara prompt» Liv.1 in vocabolario; citata in APP_CONTEXT § 0.0 come passo-zero opzionale.

### 28-05-26 (parte 3) — Profili di ingresso + mappatura iniziale vocabolario
- Approvati profili Esecuzione/Verifica/Meta (§ 0.0 APP_CONTEXT) + termini-trigger a Liv.1.
- Mappatura iniziale vocabolario: stile («spiegamelo semplice» L1, «scalabile e pulita» L1,
  «devo farlo io ogni volta?» L2 non-proattiva, sicurezza prod L1) + scorciatoie d'area (Pagina
  Prenota, Pagina menù/QR, pagina admin, le tre zone menu distinte) per evitare confusione zone simili.
- Riformulazione di Matteo: «fammi domande» non è un termine ma un comportamento legato al **plan
  mode** (domande su decisioni di sua competenza + dubbi strutturali). Codificato come voce di contesto.
- Conferma scelta: i termini-profilo vivono in VOCABOLARIO (fonte) **e** elencati in APP_CONTEXT § 0.0
  come riferimento rapido (Matteo preferisce visibilità a colpo d'occhio anche se tocca 2 file).
- Disambiguazione prodotto: «Menù prenotazioni» = Personalizza form (vetrina), NON il magazzino;
  «fonte di verità/pagina impostazioni» = MenuPricesTab (magazzino). Conferma diretta di Matteo.

### 28-05-26 (parte 2) — Costruzione skill system comunicazione + riorganizzazione docs
- Pattern forte: Matteo **estende lo scope** quando risponde alle domande ("anche QR e future
  feature", "in futuro un numero tipo 2.1") → ragiona per principi durevoli, non per caso singolo.
  Comportamento agente utile: proporre già soluzioni scalabili, non solo per il caso immediato.
- Pattern: prima di azioni strutturali rischiose (spostare 77 file, rinominare cartella gitignored)
  vuole capire l'impatto e decidere → fermarsi e fare AskUserQuestion con dati è ciò che si aspetta.
- Privacy: tiene `docs/_lavoro/` privata apposta; molto sensibile a non esporre dati su git.
  Segnalare SEMPRE quando un'azione rischia di pubblicare contenuto privato.
- Commit: ha confermato che vuole commit dell'agente dopo "tutto ok", e ha capito/apprezzato i
  **commit separati** come punti di ripristino indipendenti. Domanda sua: "un commit in più non
  crea disagi giusto?" → rassicurato che è più sicuro.
- Revisione lavoro altri agenti: "revisiona e se è ok committa anche quello" → si fida della
  validazione (npm run validate) come prova, non pretende rilettura riga per riga.
- Token: chiede prompt pronti da copiare per la sessione successiva → fornirli già formattati
  e auto-contenuti è apprezzato.
- Chiusura calorosa ("grazie mille", emoji) → rapporto collaborativo, non solo transazionale.

### 28-05-26 — Sessione PWA + costruzione sistema comunicazione
- Confermato: "spiegamelo semplice" = metafora + chi-fa-cosa (vedi cache PWA).
- Confermato: preoccupazione ricorrente "lavoro mio o del tool?".
- Confermato: vuole flusso fine-chat con commit dedicato (commit = punto di ripristino sicuro).
- Confermato: vocabolario solo con voci approvate; file di supporto dentro la skill comunicazione.
- Nuovo: vuole che l'agente proponga automazioni quando ha abbastanza dati, e chieda come accorciare i suoi prompt.
