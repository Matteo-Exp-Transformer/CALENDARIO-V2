# Report — collaudo umano filtrato e piano multi-agente dei lavori aperti

> **Cosa è cambiato:** il collaudo che devi fare a mano passa da **62 voci a 16 prove**, ognuna con
> la sequenza di click reale, e i lavori rimasti aperti hanno un piano con sette prompt già pronti da
> lanciare.
> **Cosa resta:** le 16 prove le devi fare tu; i sette prompt vanno eseguiti; il rollout in
> produzione resta bloccato dietro il collaudo.
> **Serve una tua azione:** sì — fare il collaudo, e decidere quando lanciare il primo prompt.

**Data:** 06-08-2026 · **branch:** `env/test` · **HEAD di partenza:** `0ccf98a` · **remoto:**
`origin/env/test` verificato con fetch, **0 behind / 0 ahead** prima dei commit di questa sessione.
Nessuna riga di codice applicativo toccata, nessuna operazione DB, Edge, PROD, merge su `main` o
release PrenotaZen.

---

## 1. Cosa è stato fatto

1. **Ho letto la retrospettiva di chiusura** del capitolo Servizio (il file che avevi aperto) e il
   report finale della sessione precedente, per capire cosa era davvero chiuso e cosa no.
2. **Ho lanciato quattro sub-agent in parallelo**, tutti in sola lettura, con quattro mandati
   diversi: chi doveva capire quali voci della checklist sono già dimostrate da un test; chi doveva
   estrarre dal codice le etichette vere dei pulsanti; chi doveva censire i lavori aperti; chi doveva
   costruire la procedura di preparazione dell'ambiente per un collaudo fatto a mano.
3. **Ho scoperto che due informazioni che ti portavi dietro erano superate.** Risultava che ci
   fossero «due difetti veri dell'app non corretti» e diciotto commit in attesa di pubblicazione. Ho
   verificato sul codice: il giro a vuoto della pagina Prenota è chiuso (`3b4b287`), il logout al
   primo errore di rete è chiuso con due tentativi di recupero (`651959c`), le funzioni morte sono
   state rimosse (`a9a7dd3`), e il ramo è **allineato al remoto, zero commit in attesa**.
4. **Ho filtrato il collaudo.** Confrontando voce per voce le 62 righe della vecchia checklist con
   i test che girano davvero nel browser: **38 sono già dimostrate**, **16 restano umane**,
   **4 vanno buttate**. Fra quelle da buttare ce n'è una grave: descriveva una schermata che non
   esiste più.
5. **Ti ho intervistato** con otto domande, ognuna scritta per conseguenza («cosa cambia in sala»),
   non per nome tecnico. Hai deciso tutte e otto e su una hai fatto una controproposta migliore
   della domanda.
6. **Ho verificato la tua controproposta prima di accettarla**: hai chiesto un follow-up per rendere
   modificabili tre valori dalla console «se non è già permesso». Ho aperto la console: espone otto
   impostazioni e nessuna delle tre. Quindi è un lavoro vero, e l'ho scritto nel registro.
7. **Ho scritto il piano** con sette prompt eseguibili, organizzati in tre onde più un cancello, con
   i numeri delle migrazioni già assegnati e la proprietà dei file divisa fra i prompt, perché tre
   agenti sullo stesso repository si pestano i piedi.
8. **Ho registrato tre nuovi follow-up** e allineato indice di giornata, cronologia e memoria.

---

## 2. File toccati e perché

| File | Perché |
|---|---|
| `docs/Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md` | **Nuovo.** Le 16 prove che devi fare tu, con setup, sequenze di click reali, risultato atteso, trappole, e l'elenco di cosa non rifare |
| `docs/Sessioni di lavoro/06-08-26/PIANO_MULTIAGENT_LAVORI_APERTI.md` | **Nuovo.** Decisioni D-1…D-8, sette prompt eseguibili P1–P7, onde, ownership file, cancello rollout |
| `docs/FOLLOW_UP.md` | Tre righe nuove: manopole non configurabili, asimmetria turno tavolo/sala, badge a cascata |
| `docs/SESSION_LOG.md` | Riga cronologica della giornata |
| `docs/Sessioni di lavoro/06-08-26/README.md` | Indice della giornata aggiornato con i due documenti nuovi e questo report |
| `docs/Sessioni di lavoro/06-08-26/Report-collaudo-filtrato-e-piano-multiagente-06-08-26.md` | **Nuovo.** Questo report |

**Nessun file `src/`, nessuna migrazione, nessun test toccato.** Era un lavoro di analisi e
pianificazione, non di esecuzione.

---

## 3. Test eseguiti e risultato

| Prova | Esito |
|---|---|
| `npm run validate:docs` | ⚠️ **14 path rotti nell'area Console** — gli stessi identici già noti, nessuno nuovo. Verificato filtrando l'output: **nessuno dei miei documenti compare** |
| `git fetch origin env/test` + confronto | ✅ 0 behind / 0 ahead prima dei commit di questa sessione |
| Verifica sul codice dei due difetti dichiarati aperti | ✅ entrambi chiusi, commit citati e presenti sul remoto |
| Verifica della console super-admin | ✅ `console/src/lib/restaurantSettings.ts` espone 8 chiavi, le tre manopole non ci sono |

`npm run validate` **non è stato eseguito**: non ho toccato codice applicativo, quindi non avrebbe
verificato nulla di questa sessione. È il cancello di ognuno dei sette prompt, non di questo lavoro.

### ⚠️ Segnalazione fuori mandato: `docs/Archives/` sta rendendo cieco il controllo documenti

Nella cartella `docs/` è comparsa una cartella **non tracciata** chiamata `Archives/` che contiene
l'archivio di **un altro progetto** (Trading agent). Non è mia e non l'ho committata. Effetto
misurato: `npm run validate:docs` passa da **14 errori a 3.883**, di cui **3.868 vengono da lì**.
Finché resta, quel controllo è inutilizzabile e nasconde eventuali rotture vere — incluso il lavoro
che il prompt P2 deve fare. Va spostata fuori da `docs/` o messa in `.gitignore`. Registrato qui e
non risolto perché fuori dal mandato di questa sessione.

---

## 4. File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `docs/Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md` | Creato | La skill Testing non aveva un collaudo umano filtrato per copertura: c'era solo la lista da 62 voci che nessuno finiva |
| `docs/FOLLOW_UP.md` | 3 righe nuove | Registro vivo dei debiti; le decisioni prese vanno lì, non solo in un piano di sessione |
| `docs/SESSION_LOG.md` | 1 riga | Cronologia globale |
| `docs/Sessioni di lavoro/06-08-26/README.md` | Indice esteso | Navigazione della giornata |

**Non ho toccato** `COLLAUDO_S4_CHECKLIST.md`, `ADMIN_SERVIZIO_CONTEXT.md`, `TESTING_SKILL.md`,
`VOCABOLARIO.md` né `APP_CONTEXT_SKILL.md`. Motivo: non ho cambiato nessun comportamento
dell'applicazione, quindi non c'è nessuna skill d'area diventata bugiarda per colpa mia. La vecchia
checklist resta com'è, a 4/62, come fotografia storica — sostituirla sarebbe stato riscrivere il
lavoro di un'altra sessione. Le quattro voci obsolete che ho trovato sono elencate nel documento
nuovo, §6, così chi apre la vecchia sa cosa non fidarsi. **Se preferisci che la vecchia checklist
venga marcata come superata in testa al file, è una riga: dimmelo.**

---

## 5. Interazioni con Matteo — come è stata impostata, gestita e sviluppata questa chat

> Sezione richiesta esplicitamente. È scritta come **osservazione oggettiva del metodo di lavoro**,
> non come giudizio: descrive cosa è successo, in che ordine, e quale effetto ha avuto sul risultato.

### 5.1 Struttura della chat

Due prompt sostanziali, otto risposte di intervista, zero correzioni dopo una prima risposta
sbagliata. La chat ha avuto tre fasi nette:

| Fase | Chi guidava | Cosa è successo |
|---|---|---|
| **Apertura** | Matteo | Un prompt lungo, che conteneva *quattro* richieste diverse in un blocco solo |
| **Intervista** | Claude | Otto domande a scelta multipla, due tornate da quattro |
| **Chiusura** | Matteo | Un prompt che chiedeva commit, report e una sezione specifica |

### 5.2 Anatomia del prompt di apertura

Il primo prompt conteneva quattro richieste incastrate: *(a)* analisi profonda del file aperto,
*(b)* una checklist con un **formato imposto** (A. click / B. atteso / C. altro), *(c)* un'intervista
per chiudere i lavori aperti, *(d)* un piano multi-agente con i prompt **integrati dentro**, in modo
da poter lanciare un agente allegando piano e numero.

Tre cose lo hanno reso efficace, ed è utile isolarle perché sono replicabili:

1. **Il formato del deliverable era dichiarato**, non lasciato dedurre. «A. sequenza di click / B.
   risultato atteso / C. altri elementi» ha eliminato completamente il rischio di consegnare una
   lista generica. È la parte che ha prodotto più valore per riga scritta.
2. **Il criterio di selezione era esplicito**: «le cose che DEVO testare io per forza». Quel
   *per forza* ha imposto una gap-analysis contro i test esistenti, invece di una copia filtrata
   della vecchia checklist. Senza quella parola il risultato sarebbe stato un riassunto.
3. **L'uso finale era dichiarato**: «in modo che lancio agente allegandogli il plan e il prompt N».
   Questo ha cambiato la forma del piano — prompt autosufficienti con fatti già verificati dentro,
   invece di descrizioni di lavoro da interpretare.

Il punto ambiguo era uno: *«se servi mi intervisti»*. Non diceva quando né su cosa. È stato risolto
mettendo l'intervista **dopo** la consegna della checklist e **prima** del piano, perché le risposte
servivano a costruire il piano ma non la checklist. Nessuna richiesta di chiarimento è stata
necessaria.

### 5.3 Come sono state gestite le domande

Otto domande, tutte a scelta multipla, tutte formulate **per conseguenza in sala** e mai per nome
tecnico. Esempio del passaggio di registro applicato:

| Formulazione tecnica (scartata) | Formulazione usata |
|---|---|
| «Convertiamo `useForceReplaceBookingOnTable` in RPC transazionale?» | «Chiudere i percorsi dove l'app scrive 2-5 volte di fila senza rete: se salta a metà resta un cliente su due tavoli o un tavolo vuoto» |
| «`service_layout_confirmed` va dedotto o esplicito?» | «Un locale configurato a metà mostrerebbe 8/12 e sembrerebbe pieno» |

Questa scelta deriva da un dato già registrato in memoria: una domanda precedente formulata in
termini tecnici («localStorage o colonna DB?») aveva prodotto *«non mi è chiaro cosa devo
decidere»*, mentre la stessa domanda riformulata in termini di sala aveva prodotto una decisione
immediata **e più ricca della più semplice**. La regola è stata applicata di nuovo e ha funzionato
di nuovo: **otto domande, otto decisioni, zero blocchi**.

### 5.4 Il momento più significativo della chat

Alla domanda sul badge del Calendario, Matteo **non ha scelto una delle quattro opzioni**: ha preso
la prima e l'ha estesa con un modello a cascata suo, chiudendo con *«cosa ne pensi?»*.

Testualmente:

> «sempre i posti fisici. ma se pagina servizio non è correttamente configurata deve mostrare coperti
> fasce orarie. […] la configurazione con fasce orarie è comoda semplice e la puo gestire admin
> dall'app. mentre la configurazione pagina servizio la faccio io manualmente sull'azienda, quindi
> dopo averla correttamente configurata sostituisco il valore nel calendario»

È il pezzo di conoscenza più prezioso emerso in tutta la chat, ed è arrivato **da lui, non da me**:
descrive un fatto operativo (chi configura cosa, e quando quel dato diventa affidabile) che nessun
agente poteva dedurre dal codice. La risposta data non è stata un «sì»: la proposta è stata
**accettata e corretta in un punto** — non far dedurre all'app che la sala è configurata, ma farlo
dichiarare da un interruttore, perché la deduzione fallisce silenziosamente su un locale
configurato a metà. La correzione è stata accettata e sta dentro il prompt P6.

Nella stessa risposta ha usato una formula che vale la pena registrare come pattern:
*«se è già permesso allora proseguiamo»* — cioè una **condizione verificabile** allegata alla
richiesta, invece di un'assunzione. Ha costretto a un controllo reale sul codice, e il controllo ha
risposto «no, non è permesso», trasformando un possibile non-lavoro in un lavoro vero.

### 5.5 Frasi e schemi ricorrenti osservati

| Schema | Occorrenze | Effetto |
|---|---|---|
| Formato del deliverable dichiarato in anticipo (A/B/C, «prompt N X») | 2 su 2 prompt | Zero riscritture |
| Richieste multiple in un unico blocco senza numerarle | 2 su 2 prompt | Nessun problema qui, ma il rischio è che una delle quattro venga persa |
| Uso di «per forza» / «obbligatoriamente» come criterio di filtro | 2 | Alza la barra: costringe a dimostrare, non a elencare |
| Domanda di ritorno all'agente («cosa ne pensi?») | 1 | Ha aperto l'unica correzione tecnica utile della chat |
| Refusi frequenti (*ipmostata*, *copmlesso*, *perforza*, *paln*) | ~8 | Nessuno ha causato ambiguità: il senso era sempre ricostruibile |

### 5.6 Cosa si può automatizzare e cosa no, in questo metodo di lavoro

- **Automatizzabile:** la gap-analysis checklist-contro-test (è meccanica, va rifatta ogni volta che
  cambia la suite); l'estrazione delle etichette dei pulsanti dal codice; il censimento dei percorsi
  multi-scrittura; il controllo che un documento non citi file inesistenti.
- **Non automatizzabile, e giustamente rimasto tuo:** le otto decisioni dell'intervista; il modello
  a cascata del badge, che nasce da come vendi e configuri il prodotto; la scelta di quali lavori
  aprire per primi; l'accettazione visiva e il giudizio sul PDF.

### 5.7 Osservazione sul metodo, come dato

Il punto di forza osservabile è che **imponi la forma dell'output prima del contenuto**. È l'opposto
del pattern comune («fammi un'analisi»), e produce risultati usabili al primo giro. Il punto di
attrito osservabile è che **le richieste multiple non sono numerate**: in questa chat erano quattro
in un blocco, e sono state gestite, ma un prompt con sei o sette richieste incastrate avrebbe una
probabilità concreta di perderne una per strada, senza che né tu né l'agente ve ne accorgiate. Un
elenco puntato costerebbe dieci secondi e renderebbe verificabile la completezza della risposta.

Questo è un **dato**, non una modifica: non ho toccato nessuna skill di comunicazione.

---

## 6. Analisi flusso prompt, efficienza e statistiche

- Prompt sostanziali di Matteo: **2**, più **8** risposte di intervista.
- Correzioni esplicite dopo una prima risposta: **0**.
- Modalità alzata durante la chat: **no** — è nata già come lavoro deep.
- Sub-agent lanciati: **4**, tutti in sola lettura, tutti in parallelo, tutti rientrati con dati
  usabili. Nessuno ha dovuto essere rilanciato.
- Follow-up creati: **3** (`FU-SERV-MANOPOLE-CONSOLE-1`, `FU-SERV-TURNO-SALA-1`,
  `FU-SERV-BADGE-CASCATA-1`).
- Correzioni di stato ereditato: **3** (due difetti dichiarati aperti ma chiusi, commit in attesa
  inesistenti).
- Voci di checklist trovate obsolete: **4**.
- Errori di prodotto introdotti: **0** (nessun codice toccato).

Il prompt più efficace è stato il primo, per i tre motivi isolati in §5.2. Il secondo ha aggiunto una
richiesta insolita e utile — una sezione di osservazione del proprio metodo — che ha prodotto §5.

---

## 7. La mia lettura della sessione

### Impressioni

Il routing dello skill system ha funzionato senza attriti: `.claude/CLAUDE.md` ha mandato subito alle
skill giuste e la regola «non navigare il codice a tappeto» ha evitato il giro largo. La scelta di
lanciare quattro sub-agent con mandati **disgiunti e in sola lettura** si è rivelata la decisione
strutturale della sessione: ognuno ha portato indietro un pezzo che gli altri non avevano, e il
confronto fra i quattro ha prodotto le scoperte migliori. Un agente da solo avrebbe quasi certamente
copiato la vecchia checklist filtrandola a occhio.

Il pezzo più utile del lavoro non è la checklist in sé: è aver scoperto che **una voce di collaudo
descriveva una schermata rimossa**. Se non l'avessi verificata sul codice, avresti passato dieci
minuti a cercare un pulsante «Libera e assegna» che non esiste, concludendo che l'app è rotta.

### Difficoltà e come sono state risolte

- **Informazioni ereditate false.** La memoria di sessione diceva «due difetti veri non corretti» e
  «diciotto commit non pushati». Ho verificato sul codice e sul remoto invece di riportarle: erano
  entrambe superate. Lezione: una memoria di progetto è una fotografia, va riverificata prima di
  essere ripetuta a Matteo come stato attuale.
- **Rischio di collisione fra agenti nel piano.** Tre prompt in parallelo che toccano lo stesso file
  di contesto si sovrascrivono. Risolto assegnando la proprietà dei file prompt per prompt e
  scrivendo la regola «far committare uno alla volta».
- **Una manopola che non stava dove sembrava.** Il buffer di riassetto sembrava una delle tre
  impostazioni globali, ma è una colonna per fascia. Se non me ne fossi accorto, il prompt P5 avrebbe
  chiesto a un agente di infilarla in un pannello dove non può stare. Segnalato dentro il prompt come
  caso da decidere, non come lavoro da fare.

### Migliorie che suggerirei, come dato

1. La gap-analysis fra checklist umana e copertura automatica dovrebbe essere **rifatta a comando**,
   non a mano una volta: ogni volta che la suite cresce, alcune voci umane diventano superflue. Oggi
   nessuno se ne accorge e la lista resta lunga per sempre, motivo per cui è ferma a 4/62 da tre
   sessioni.
2. `docs/` non è protetta da intrusioni: una cartella di un altro progetto ci è finita dentro e ha
   portato il controllo path da 14 a 3.883 errori. Una regola che vieti sottocartelle non previste
   in `docs/`, o una `.gitignore` mirata, eviterebbe che un controllo di qualità diventi rumore.

---

## 8. Derivazione errori

| Evento | Classificazione | Causa | Come evitarlo |
|---|---|---|---|
| Due difetti dichiarati aperti risultavano chiusi | Informazione di contesto obsoleta | La memoria di progetto era ferma alla sera del 05-08, i fix sono arrivati dopo | Verificare sul codice prima di riportare uno stato, sempre |
| Voce di checklist che descrive una UI rimossa | Debito documentale preesistente | La checklist non è stata riallineata quando S4-FIX-5 ha sostituito la conferma singola con tre scelte | Quando un fix cambia una schermata, cercare quella schermata nelle checklist |
| Buffer di riassetto creduto globale | Divergenza doc/codice preesistente | I documenti lo elencavano insieme alle impostazioni globali; è una colonna per fascia | Verificare il livello di una impostazione prima di raggrupparla con altre |
| `validate:docs` da 14 a 3.883 errori | Vincolo esterno / intrusione | Cartella `docs/Archives/` di un altro progetto, non tracciata, non mia | Regola su cosa può stare in `docs/` |
| Nessun errore agente sostanziale | — | — | — |

Nessun pattern nuovo da appendere a `ERRORI_PROCESSO.md`: il primo caso ha già una difesa
(riverificare prima di riportare), gli altri sono debiti preesistenti già registrati.

---

## 9. Cosa resta per la prossima sessione

1. **Il collaudo T1–T16.** È tuo, nessun agente può farlo.
2. **Onda A del piano:** P1 atomicità sostituzione guidata, P2 fix piccoli, P3 legale Brevo.
3. **Onda B:** P4 Menu QR atomico, P5 console e interruttore.
4. **Onda C:** P6 turni sala e badge a cascata.
5. **P7 rollout PROD**, bloccato dietro collaudo verde e tua autorizzazione.
6. **`docs/Archives/`** da spostare fuori o ignorare, altrimenti P2 lavora al buio.
7. I connettori Supabase (`supabase`, `supabase-prod`) vanno autorizzati prima di P7: senza, nessun
   agente può verificare cosa c'è davvero in produzione, ed è il dato su cui i documenti si
   contraddicono.

---

## 10. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: **Prompt 1:** «basandoti sul file aperto, fai una analisi approfondita, ( usa sub agents ) per darmi una nuova checklist aggiornata con le cose che DEVO testare io perforza. / per ogni test da fare dammi : A.sequenza di click nell'app / B. risultato atteso. / C. altri elementi che reputi importanti al fine del test. / inoltre se servi mi intervisti per chiudere anche i lavori da fare emersi mentre completavamo lavori pagina servizio. / crea un plan multi agent per quei lavori poi prepara prompt e integrali nel plan in modo che lancio agente allegandogli il paln e il prompt N X da eseguire.» — **Prompt 2:** «fai commit iniziale e report finale del tuo lavoro svolto. ( tieni una sezione di " interazioni con matteo" dove spieghi come è stata ipmostata , gestita, e sviluppata la nostra chat nel copmlesso in modo obbietivo al fine di tenere traccia del mio metodo di lavoro, conoscerlo comprenderlo migliorarlo, strutturarlo.» — **Risposte di intervista non standard (verbatim):** sulle manopole, «confermo valori attuali, come FU annotiamo di permetteri in console super admin, di cambiare comodamente questi valori ( se è gia permesso allora proseguiamo )»; sul badge, «sempre i posti fisici. ma se pagina servizio non è correttamente configurata deve mostrare coperti fasce orarie. dobbiamo gestire il caso facendo in modo che app abbia obbligatoriamente o A. limite coperti per fasce impostato , o B. Tutti i tavoli correttamente configurati nella sezione servizio. mi viene in mente che la configurazione con fasce orarie è comoda semplice e la puo gestire admin dall'app.mentre la ocnfigurazione pagian servizio la facico io manualmente sull'azienda, quindi dopo averla correttamente configurata sostituisco il valore nel calendario per mostrare il valore reale di coperti. cosa ne pensi?». Le altre sei risposte sono state selezioni di opzione, riportate come decisioni D-1…D-8 nel piano §1.

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Sì. Ho riaperto e verificato di persona: `git status` e `git rev-list --left-right --count origin/env/test...HEAD` (0/0) per smentire i «18 commit in attesa»; `console/src/lib/restaurantSettings.ts` e `RestaurantSettingsPanel.tsx` per contare le 8 chiavi esposte e confermare che le tre manopole non ci sono; `docs/FOLLOW_UP.md` per il formato della tabella e la riga `FU-ALL-ATOMICITA-1` prima di inserirne tre nuove sopra; la testa e la sezione agosto di `docs/SESSION_LOG.md` per l'ordine cronologico; `docs/Sessioni di lavoro/06-08-26/README.md` prima di estenderlo; l'output completo di `npm run validate:docs` filtrato due volte, per contare 14 errori Console e 3.868 da `docs/Archives/` e per dimostrare che nessun mio documento compare. I dati citati dai sub-agent (righe di codice, etichette dei pulsanti, numeri delle spec) provengono dai loro report con `file:riga`; li ho usati come sono per la checklist e li ho ricontrollati personalmente solo dove una decisione dipendeva da loro: manopole in console, stato dei due difetti, conteggio dei commit.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Allineati in questa chiusura: `docs/FOLLOW_UP.md` (3 righe nuove), `docs/SESSION_LOG.md`, `docs/Sessioni di lavoro/06-08-26/README.md`. **Non** allineati, con motivo esplicito: `COLLAUDO_S4_CHECKLIST.md`, `ADMIN_SERVIZIO_CONTEXT.md`, `TESTING_SKILL.md`, `APP_CONTEXT_SKILL.md`, `VOCABOLARIO.md` — nessun comportamento dell'applicazione è cambiato, quindi nessuna skill d'area è diventata bugiarda per colpa di questa sessione. Le quattro voci obsolete trovate nella vecchia checklist sono elencate nel documento nuovo §6 invece che corrette nell'originale, per non riscrivere il lavoro di un'altra sessione; ho proposto in §4 di marcarla come superata se lo preferisci. Nessun tipo DB, test o migrazione era collegato: non ho toccato codice.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non ho eseguito `npm run validate` (nessun codice toccato: non avrebbe verificato nulla di mio). Non ho corretto i 14 path Console né spostato `docs/Archives/`: entrambi fuori mandato, il primo è il lavoro di P2, il secondo l'ho solo segnalato. Non ho marcato come superata la vecchia `COLLAUDO_S4_CHECKLIST.md` — l'ho proposto invece di deciderlo da solo, perché è materiale di un'altra sessione. Non ho eseguito nessuno dei sette prompt: il mandato era prepararli. Non ho toccato DB, Edge, PROD, `main` né release. Non ho verificato di persona **tutte** le righe di codice citate dai sub-agent nella checklist: ho verificato le tre su cui poggiava una decisione, le altre sono citazioni con `file:riga` dei loro report — se una fosse imprecisa, l'effetto sarebbe un'etichetta leggermente diversa a schermo, non una prova sbagliata.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: L'attrito è che **la memoria di progetto e i documenti di sessione affermano stati che possono essere già superati da commit successivi**, e nulla segnala la scadenza: in questa chat tre affermazioni su quattro riguardanti «cosa resta aperto» erano false, e me ne sono accorto solo perché ho verificato sul codice. Proposta: ogni riga di stato in memoria o nei context che cita un difetto aperto dovrebbe portare l'hash del commit in cui era vero, così un agente successivo può fare un `git log` di trenta secondi invece di fidarsi o riverificare tutto.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Giusto per la parte di routing — `.claude/CLAUDE.md` ha portato dritto alle skill e la regola «carica la skill d'area prima dei file» ha evitato di navigare il codice a tappeto. Troppo poco su un punto: nulla nel contesto diceva che la vecchia checklist potesse contenere voci obsolete, ed è stata la scoperta più utile della sessione — è arrivata da una verifica che ho deciso di fare, non da una regola che me la imponeva. Gli hook non sono scattati durante il lavoro; il promemoria ricorrente sul tracciamento delle attività è stato rumore in una sessione con quattro sub-agent già sequenziati.

---

## 11. Self-review del report

1. **Dati = diff reale.** Ricontrollati: i sei file elencati in §2 sono esattamente quelli modificati o creati, nessuno in più. I numeri 62/38/16/4, 8 chiavi console, 14 e 3.868 path rotti, 3 follow-up nuovi vengono tutti da comandi eseguiti in questa chat, non da memoria.
2. **File correlati allineati.** Fatto in §4, con il motivo esplicito per ognuno di quelli **non** toccati — che è il punto su cui la guida di chiusura è più severa.
3. **Q1–Q6 coerenti.** Nessuna risposta dichiara come svolto qualcosa che non ho fatto; R4 elenca sette cose non fatte, coerenti con §3 e §9.
4. **Tono utente.** Il cappello, §1 e §5 parlano per effetti e schermate; i nomi di file sono confinati alle tabelle di audit.

**Correzioni fatte durante la self-review:** ho aggiunto in §3 la segnalazione su `docs/Archives/`, che nella prima stesura era solo un numero dentro l'esito del comando e non si capiva che rendeva cieco il controllo per il prompt P2. Ho aggiunto in §4 la proposta esplicita sulla vecchia checklist, invece di lasciare implicito che l'avevo scartata.

---

## 12. Pubblicazione

Due commit distinti, come da procedura (codice e documentazione separati — qui è tutta
documentazione, quindi la separazione è per **materiale vivo** contro **materiale di sessione**):

1. `docs(testing): collaudo manuale filtrato per copertura reale`
2. `docs(sessione): piano multi-agente dei lavori aperti e report`

Push diretto esclusivamente a `origin/env/test`. Nessun merge su `main`, nessuna PR, nessuna
release. Nel commit sono inclusi **solo i miei file**: le modifiche non tracciate presenti nel
working tree (`.cursor/skills/calendarbackup-testing/SKILL.md`, `docs/APP_CONTEXT_SKILL.md`,
`docs/Testing-Skill/TESTING_MINI.md`, `docs/Testing-Skill/TESTING_SKILL.md`, `tests/README.md`,
`docs/Testing-Skill/MANUALE_COMPILAZIONE_TERMINALE.md`, `docs/Archives/`) sono di un'altra sessione e
**restano fuori**.
