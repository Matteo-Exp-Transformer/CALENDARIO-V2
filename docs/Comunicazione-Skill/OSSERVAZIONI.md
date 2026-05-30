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
| «comportamenti ok ma voglio che cambi» | 0 | 0 | 0 | nuova 29-05 (promossa da PROPOSTE) |
| «compila report comunicazione + annota prompt» | 0 | 0 | 0 | nuova 29-05 (promossa da PROPOSTE) |
| «revisiona e se ok committa» | 0 | 0 | 0 | nuova 29-05 (promossa da PROPOSTE) |

| «procedura finale» | 1 | chiusura §7: report + SESSION_LOG + FOLLOW_UP + OSSERVAZIONI |
| «report unificato o solo report?» | 1 | Matteo vuole sapere se un file o più file; risposta breve preferita |
| sessione mappatura DOM admin ↔ Prenota | 1 | liste lunghe path + esito OK/KO; conferme puntuali (import preset, 700px) |

## Sessioni registrate (append-only)

### 30-05-26 — PREPARA_PROMPT · checklist compatta verso Matteo
- **Formato preferito:** tabella 3 col (Dove | Cosa fai | OK se); flusso utente, non gergo agente («overlay» → nome schermata in app); token minimi in pianificazione; dettagli solo on demand.

### 30-05-26 — Chiusura Fase 3 Menu QR (round 3 + report finale)
- **Conferma QA:** resto tutto OK; Modal elimina QR = modello preferito («modal di base per comunicazioni utenti app»).
- **Toast vs Salva:** Matteo chiede nome elemento (toast Toastify); accetta che toast validazione è ridondante se Salva disattivato — UX primaria = pulsante grigio; toast resta backup.
- **Priorità errori:** categorie prima del carosello nel messaggio validazione.
- **Salva fuorviante:** fix `canSave` = nome + requisiti completi (non solo nome).
- **PROPOSTE aggiunte:** checklist no URL; validazione admin no toast se pulsante disattivato.

### 30-05-26 — Test manuale Fase 3 Menu QR (round 2)
- Matteo segnala: frasi tipo «/c/antipasti OK · /c/primi → messaggio blocco» **non aiutano** — preferisce **schermata + cosa vede il cliente** (es. «Apri Antipasti dal menu QR → vedi i piatti» vs «Digita manualmente un link di una categoria che hai spento nel QR → compare avviso e pulsante Torna al menu»). **Evitare path URL tecnici** nelle checklist smoke verso Matteo.
- Validazione Salva QR mancante (tutte cat off, carosello vuoto) — corretto in codice stessa sessione.
- Categorie modale percepite «hardcoded» — atteso allineamento a tab Menu (`menu_categories`); fix: elenco completo + refetch all'apertura modale.

### 30-05-26 — Prepara-prompt post-revisione Menu QR
- Matteo (prompt citato in report): sintesi «cosa decidere + dove siamo + come proseguire», poche parole; **sempre** tabella ciclo + checklist aggiornata; decisioni in **A/B/C** o **Sì/No** con raccomandazione.
- Risposte prodotto: preset/mixed QR **non ora**; dialog post-Salva (non «cambia link»); header = anagrafica; temi OK + FU-021 asset sfondo; QA admin **Matteo**.
- Annotato in `Report-revisione-mappatura-menu-qr-admin-pubblico-29-05-26.md` § Dati comunicazione; regola in `PREPARA_PROMPT_SKILL.md` §3.

### 29-05-26 — Verifica mappatura Impostazioni ↔ Prenota
- Profilo Verifica via prompt custom; report unificato un file; skill caricata: APP_CONTEXT only.
- Matteo: liste DOM, correzione breakpoint 700px, «procedura finale».
- Esito: 2 KO documentati (description card, icona carosello); validate non eseguito.

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

## Log per data

### 29-05-26 — Chiusura ciclo salvataggio admin (raccolta dati comunicazione, non Meta senior)
- Matteo: «tutto fatto» — esecuzione completata; chiede analisi comunicazione, primo aggiornamento skill comunicazione (**solo dati**, non revisore senior), commit + report finale.
- **Ruolo corretto agente di lavoro / prepara-prompt a valle:** aggiornare `OSSERVAZIONI.md`, `PROPOSTE.md`, sezione Dati comunicazione nel report ciclo, `SESSION_LOG`, `FOLLOW_UP` (note FU-002 fase 1); **non** promuovere voci in `VOCABOLARIO.md`, **non** riscrivere `COMUNICAZIONE_UTENTE_SKILL.md` (salvo regola temporanea già in skill).
- Mockup HTML: conferma utilità alta; PROPOSTE mockup → archivio accettata (regola in PREPARA_PROMPT §1.B).
- Scalabilità multi-tenant: esecutore ha scritto «attenzione» nel report — FU-006 resta per promozione regola fissa in report (sessione Meta futura).
- QA browser formale 375/834/1280: non documentato in report revisione separato; chiusura per conferma Matteo.
- `npm run validate` 217 test OK in chiusura.

### 29-05-26 — Prepara prompt: ciclo salvataggio Impostazioni locale (Anagrafica + Personalizza form)
- Matteo ha scelto footer compatto ~50% allineato a destra (anche mobile), sfondo footer mobile leggermente trasparente, guard modale, autosave whitelist in **fase debug**.
- Mockup HTML multi-stato (`mockup-salvataggio.html`) molto apprezzato («comodissimo», «mi serve quasi sempre») per decisioni flusso/UI → codificato in PREPARA_PROMPT §1.B.
- **Prod futura (FU-004):** disattivare autosave; salvataggio manuale footer per validare errori prima del pubblico e ridurre DB.
- **Follow-up FU-005:** modale conferma al Salva su campi che finiscono in Pagina Prenota esposta ai clienti.
- Chiede segnalazione conflitti **scalabilità multi-tenant** nelle decisioni → FU-006 + sezione obbligatoria nel report ciclo.
- Report ciclo: `docs/Sessioni di lavoro/29-05-26/Report-ciclo-salvataggio-admin-29-05-26.md`

### 29-05-26 — Meta: miglioria skill system (analisi report ciclo card ingredienti + decisione PROPOSTE)
- Sessione Meta su richiesta Matteo: analisi 3 report del ciclo prepara→esegui→revisiona (card ingredienti) + i 4 file Comunicazione-Skill + PREPARA_PROMPT.
- Decise tutte le 8 PROPOSTE in attesa: 2 voci Liv.1 («lavoro ok», «finestra di conferma»), 3 voci Liv.2 («comportamenti ok ma voglio che cambi», «compila report comunicazione», «revisiona e committa»), 3 regole attive (report unificato, copy verbatim, freno azioni rischiose).
- Matteo ha chiesto di spiegare le proposte come «parola → comportamento», distinguendo parole-comando da regole automatiche. Pattern: vuole capire SE una cosa è un comando da dire o un automatismo prima di approvarla.
- Nuova regola PREPARA_PROMPT: segnalare conflitti con prompt/report precedenti (no tabelle timeline, solo segnalazione) — nasce dal caso overlay invertito 29-05.
- Sintesi periodica feedback agenti (da ERRORI_PROCESSO): assegnata al revisore Meta in sessione con Matteo, NON agli agenti esecuzione/revisione. Codificata in REVISIONE.md §4b.
- «main dell'app» / «menù originale» Liv.2: non usate in questa chat.
- Report: `docs/Sessioni di lavoro/29-05-26/Report-meta-miglioria-skill-system-29-05-26.md`

### 29-05-26 — Esecuzione: promo conflitto abbinamento — dialogo sostituzione
- Follow-up prompt strutturato (helper, test, no skill/docs); implementazione + validate OK.
- Matteo: «non vedo il modal» → fix `Modal` React; «ottimo funziona»; poi copy modale intro/chiusura semplificati; **correzione**: «non ti ho detto di cambiarlo» → ripristinata freccia + nome promo in elenco.
- Agente: risposte con schermata Personalizza form + storage `booking_menu_promos`; nota pulsante editor vs Salva sezione.
- Skill: APP_CONTEXT profilo Esecuzione ok; BOOKING_FORM context non caricato; `window.confirm` nel prompt suggerito → errore UX (allineare FU-003).
- Report: `Report-promo-conflitto-sostituzione-29-05-26.md` con § skill system e Dati comunicazione.

### 29-05-26 — Esecuzione: promo Personalizza form + fix UI abbinamento (checkbox libere)
- Feature grande (spostamento da Tab Menu, multi-target, banner Prenota) + due iterazioni UX abbinamento.
- Feedback Matteo sul select: «a scelta tra» → vuole «1 o nessuno o tutti o 2» (multi-checkbox libera, non menu esclusivo).
- Spiegazione agente con schermata + `BookingFormPromoSection` + `booking_menu_promos` — allineata a user rule «spiegami semplice».
- Chiusura: «aggiorna report di fine lavoro, anche parte comunicazione» — **senza** «lavoro ok» sul fix UI; nessun commit.
- Report aggiornato: `Report-promo-personalizza-form-29-05-26.md` (§ Dati comunicazione + follow-up UI).

### 29-05-26 — Esecuzione: card scorrevole titolo/placeholder/lista admin (Personalizza form)
- Prompt esecutore completo (no domande): vuoto + placeholder, import menù, clear manuale, riga `· Card N`, carosello invariato.
- Implementazione al primo giro; `npm run validate` 195 test OK.
- Chiusura Matteo: «lavoro ok» + report finale dettagliato + proposta vocabolario «lavoro ok» + regola temporanea report comunicazione più ricca.
- Report: `docs/Sessioni di lavoro/29-05-26/Report-card-scorrevole-titolo-admin-29-05-26.md`

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

### 29-05-26 — Validazione UX Pagina Prenota (ciclo prepara-prompt → esecutore → revisore)
- Sintomo QA «non funziona nulla» (no toast/scroll/pulse/chiusura card) con implementazione già presente → **causa root HTML5** (`required` senza `noValidate`), non logica React. Pattern da documentare in ogni nuovo form con validazione custom.
- Dopo root cause il fix è andato **veloce** (1–2 giri: `isTrusted`, pulse su wrapper, testi bianchi); i giri precedenti erano lo stesso blocco.
- Matteo affida follow-up supplementari **nella chat esecutore** (leggibilità testi, colore pulse) — funziona meglio che tornare al prepara-prompt per polish minori.
- Revisore: utile escludere diff fuori scope dal commit (`BookingModeCards` margin) — Matteo vuole commit pulito per task.
- Richiesta esplicita: **guida replica** con riferimenti file per portare il pattern su admin/modali (FU-010) → `FORM_VALIDATION_ATTENTION_PATTERN.md`.

### 28-05-26 — Sessione PWA + costruzione sistema comunicazione
- Confermato: "spiegamelo semplice" = metafora + chi-fa-cosa (vedi cache PWA).
- Confermato: preoccupazione ricorrente "lavoro mio o del tool?".
- Confermato: vuole flusso fine-chat con commit dedicato (commit = punto di ripristino sicuro).
- Confermato: vocabolario solo con voci approvate; file di supporto dentro la skill comunicazione.
- Nuovo: vuole che l'agente proponga automazioni quando ha abbastanza dati, e chieda come accorciare i suoi prompt.
