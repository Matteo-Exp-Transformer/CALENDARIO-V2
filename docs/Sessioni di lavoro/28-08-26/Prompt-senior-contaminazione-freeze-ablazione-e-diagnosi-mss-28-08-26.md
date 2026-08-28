# Mandato senior — canale di contaminazione, freeze della prima ablazione, diagnosi attiva di MSS

## Chi sei e cosa devi ottenere

Sei un **senior orchestratore MetaSkillSystem** con mandato tecnico e autonomo, subagenti ammessi.

Fra Matteo e il lancio delle venti corse di ablazione c'è **un difetto solo**, e non lo sta chiudendo
nessuno. Il tuo primo lavoro è quello. Il secondo è congelare l'istanza. Il terzo è la diagnosi attiva
che Matteo ha chiesto esplicitamente: **guardare il quadro generale e migliorare MSS dove vedi errori o
buchi che finora ci sono sfuggiti.**

**Ordine non invertibile.** I lavori 1 e 2 sono la consegna; il lavoro 3 è diagnosi che si implementa
**solo** per la parte che Matteo approva. Un mandato di miglioramento aperto è il modo più rapido per
produrre altro apparato, ed è esattamente il difetto che stiamo cercando di misurare.

---

## ⚠️ Prima di fidarti di qualunque stato: verificalo

**Lezione pagata due volte.** Il mandato del 27-08 dichiarava tre stati che erano falsi quando è stato
letto, perché fra la scrittura e la lettura il repository si era mosso. Non fidarti nemmeno di questo
file: **è scritto sul commit `a3f9dd7` di `env/test`, il 28-08-2026**, e un senior Codex sta lavorando
in parallelo su enforcement e fix mentre lo leggi.

Prima riga di lavoro, sempre: `git log`, `git status`, `npm run mss:status`, e le suite rilanciate su un
worktree pulito. Se ciò che trovi diverge da questo file, **vince ciò che trovi**, e lo scrivi nel report.

**Che cosa dovrebbe aver fatto il Codex** (mandato:
[`Prompt-senior-codex-enforcement-e-fix-dai-test-28-08-26.md`](Prompt-senior-codex-enforcement-e-fix-dai-test-28-08-26.md)):
regola di STOP nei tre file di istradamento · slice enforcement `0.1.2` atterrato · cancello di
raggiungibilità sulle 13 regole di metodo · stringhe «Q1-Q6» allineate a sette · registro dei cancelli
che negano. **Verifica quali sono davvero chiusi**: il tuo lavoro 2 dipende dal primo, perché la
condizione «piena» dell'ablazione deve contenere la regola di STOP.

⚠️ Se `test:mss` ti risulta rosso con hash di fixture mutati, **non sono le fixture**: è la conversione
di fine riga, chiusa in `0e2a487`. Riallinea con `git ls-files -z '*.jsonl' | xargs -0 rm -f` seguito da
`git ls-files -z '*.jsonl' | xargs -0 git checkout --`.

---

## Lavoro 1 — Chiudere il canale di contaminazione (**bloccante, prima di tutto**)

### La scena, concreta

`AM-C0` ha scoperto **eseguendosi** che gli artefatti del test vivono dentro il repository sotto test.
Il caso `C4` girava in una cartella dove era leggibile la riga «Esito atteso» del caso stesso: due
caselle bruciate, dichiarate `not_observed`.

**E la seduta del 28-08 lo ha peggiorato, consapevolmente.** Il protocollo appena committato,
[`PROTOCOLLO_VALUTAZIONE_MSS_E_AM_V1.md`](../../MetaSkillSystem/Senior-Eval-Pack/PROTOCOLLO_VALUTAZIONE_MSS_E_AM_V1.md),
contiene in **§4.4** il disegno completo dell'ablazione — le quattro condizioni e cosa ci si aspetta da
ciascuna — e in **§5** le soglie che decidono se un pezzo si toglie.

Ora metti insieme due fatti:

- il compito delle venti corse è **«fai il punto della situazione e prepara il prompt del prossimo lavoro»**;
- `.claude/CLAUDE.md` punto 5 istrada **esplicitamente** al pacchetto MetaSkillSystem qualunque task che
  riguardi *criteri · validazione del MetaSkillSystem*.

> **Un agente a cui si chiede di fare il punto viene indirizzato dritto nella cartella dove è scritto il
> disegno della prova di cui è oggetto.** Lanciare così misurerebbe chi ha letto §4.4, non se gli
> attrezzi servono.

⚠️ **È il canale più insidioso perché cresce ogni volta che si prepara meglio il test:** più il disegno
è accurato, più scrive nel repository la risposta che sta per chiedere. **Non si chiude con un controllo
di fuga fatto a mano ogni volta.**

### Che cosa devi produrre

Una soluzione **strutturale e verificabile**, non una raccomandazione. Il vincolo è uno solo:

> gli artefatti di una calibrazione devono vivere **fuori dal perimetro che l'esecutore può leggere**, e
> l'assenza va **provata con un comando** prima che l'esecutore parta, non assunta.

Il disegno è tuo. Tre strade note, con quello che già sappiamo:

| Strada | Cosa sappiamo |
|---|---|
| Artefatti fuori dal repository | Il più pulito. Costo: gli artefatti escono da git, quindi perdono versionamento e append-only — **valutare se è accettabile e dirlo** |
| Worktree da un commit anteriore agli artefatti | **Ha già funzionato** per la corsia d'archivio di `AM-C0` (verificato: zero file). ⛔ **Non funziona qui:** l'ablazione confronta lo skill system **di oggi**, e il repository di oggi contiene il disegno |
| Scrub verificato sul worktree dell'esecutore | Probabilmente la strada giusta. Richiede: cosa si rimuove, **un comando che dimostri che non c'è più**, e l'esito registrato nel freeze |

⚠️ **Il perimetro da rimuovere non è ovvio e va deciso con attenzione:** togliere l'intero
`docs/MetaSkillSystem/` cambierebbe **anche la condizione in prova** — gli attrezzi e il dossier sono
proprio ciò che l'ablazione misura. Devi distinguere **ciò che è oggetto della misura** (attrezzi,
istradamento, dossier) da **ciò che è disegno della misura** (protocollo V1 §4-§5, freeze, prompt,
registro esiti). Rimuovere il secondo, conservare il primo secondo la condizione. **Se questa
distinzione non è netta in qualche file, dillo: è una domanda per Matteo, non una tua decisione.**

---

## Lavoro 2 — Congelare l'istanza della prima ablazione

Il disegno esiste ed è deciso: `PROTOCOLLO_VALUTAZIONE_MSS_E_AM_V1.md` §4.4 (quattro condizioni, cinque
corse ciascuna) e §5 (le quattro soglie di taglio, **firmate da Matteo prima di lanciare**). Tu non lo
riapri: **produci l'istanza**, come `FREEZE_AM_C0_27-08-26.md` stava al protocollo V0.

### ⛔ L'errore da non ripetere, che è costato otto caselle su diciannove

Il freeze di `AM-C0` congelava quattro casi su cinque **«per rimando al `PROTOCOLLO…` §4»**. Ma quel §4
non conteneva testi di casi: conteneva schede candidate, dichiarate esse stesse «un canovaccio».
Risultato: otto caselle, quarantotto giudizi, `not_observed`.

> **Il freeze contiene il testo verbatim del compito, incollato. Mai un rimando.** Se stai per scrivere
> «come da §X», fermati: stai per rifare quell'errore.

### Che cosa il freeze deve contenere

1. **Il testo del compito, verbatim e identico per tutte le condizioni** — un solo scheletro, generato
   una volta, incollato quattro volte.
2. **Come si costruisce ogni worktree**, comando per comando: quale materiale c'è e quale è tolto, per
   la condizione piena e per le tre ablazioni.
3. **La prova che il disegno non è leggibile** dall'esecutore in nessuna delle quattro condizioni —
   comando e output, dal Lavoro 1.
4. **La chiave di risposta:** l'uscita di `npm run mss:status` catturata a un commit dichiarato, che è
   il termine di paragone contro cui si conta quanti fatti sono sbagliati.
   ⚠️ **Nota che ti riguarda:** puoi congelare tu questa istanza anche avendo letto il disegno, perché la
   chiave **è generata da una macchina dagli owner**, non inventata da te. È la differenza con `AM-C0`,
   dove le chiavi erano scritte a mano e chi le aveva lette non poteva più congelare.
5. **Il denominatore dichiarato**, prima di correre: 4 condizioni × 5 corse × i criteri applicati. Una
   casella non corsa resta nel denominatore come `not_observed` **con motivo**. Non si ricalcola dopo.
6. **La dichiarazione di pre-volo** dell'esecutore, riusata da `AM-C0` e non reinventata: cartella,
   memoria caricata, file esterni letti, conoscenza pregressa, **modello**, **strumenti attivi**.
7. **I criteri applicati**, dal protocollo V1 §2: *Il cancello* (con la raccomandazione, non il menù),
   *Autocontraddizione*, *Lanciabilità*. *Fonte* e *Tracciabilità* si osservano come **controlli
   dichiarati**, ⛔ non si contano come misure.
8. **Il materiale escluso**, elencato — e se è «nessuno», scritto perché.
9. **Le condizioni di comparabilità**, dichiarate **prima** di guardare qualunque risultato, e cosa
   succede se una non regge. ⚠️ Su «Auto» il modello non è conoscibile: il freeze deve dire fin d'ora
   che la corsa misura una **frequenza** e **non** un'attribuzione.

⛔ **Non lanciare nessuna corsa.** Il freeze si consegna, Matteo decide quando parte.

---

## Lavoro 3 — Diagnosi attiva di MSS (richiesta esplicita di Matteo)

> Verbatim, 28-08-2026: *«digli di analizzare bene il quadro generale e di migliorare MSS dove vede
> errori o buchi che ci sono sfuggiti fino ad ora (controlla attivamente funzionamento e miglioramento)»*.

### La disciplina, che rende utile questo lavoro invece di dannoso

**Diagnostica largo, implementa stretto.** Guarda tutto; proponi con il conto in mano; implementa solo
ciò che Matteo approva. Tre regole, non negoziabili:

1. **Ogni proposta porta il suo costo**, in chat da lanciare e in minuti di Matteo. Una proposta senza
   costo accanto non è una proposta.
2. **Devi poter proporre di togliere, non solo di aggiungere.** Applica a MSS stesso il criterio che
   Matteo ha approvato per i criteri: *ciò che non separa mai è un controllo, non una misura* — e la sua
   versione per la macchina: **un cancello che in venti sedute non ha mai fermato niente è candidato al
   taglio**. ⚠️ Se la tua diagnosi contiene solo aggiunte, è incompleta: rileggila.
3. **Non implementare niente oltre i Lavori 1 e 2 senza mostrarlo prima.** Congela il disegno e fallo
   approvare, come il mandato dello slice ha già imposto una volta.

### Quattro buchi già noti e non coperti da nessuno — punto di partenza, non confine

| Buco | Che cosa manca |
|---|---|
| **`validate:docs` non guarda i report di seduta** | Lo scanner esclude per disegno `docs/Sessioni di lavoro/**` (`scripts/check-doc-paths.mjs`, righe 5-9). **Un link rotto dentro un report non lo intercetta nessun cancello.** Verificato il 28-08 |
| **I mandati dichiarano stato senza il commit su cui vale** | Tre premesse false in un giorno, per questa ragione. Esiste già un precedente buono da promuovere a regola: `e741cb0`, «registra nel freeze il commit su cui valgono i risultati» |
| **Nessuno rastrella Q7 né le righe di registro** | Q7 obbliga a rispondere ma nessuno raccoglie le risposte; 11 righe `FU-EVAL-*` sono state scritte in un pomeriggio. Una domanda a cui si risponde in cinquanta report e che nessuno rilegge è una discarica |
| **Una decisione «non sanata» dentro un file di contesto non genera una riga di registro** | È il buco 2 di `AM-C0` (caso `S-3`). Lo slice obbliga la **seduta** a dichiarare le decisioni; **non** intercetta una frase «va decisa dopo» scritta in un file di contesto da una seduta passata. Era la proposta 3 dell'enforcement, ⛔ **esclusa e ancora esclusa** — se la ritieni matura, è una domanda per Matteo |

### Dove guardare per trovare quello che non sappiamo di non sapere

- **Il registro dei 21 cancelli** (`docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json`): ognuno dichiara
  `known_bypass`. Quanti di quei bypass sono ancora reali? Quali cancelli si sovrappongono?
- **La distanza fra ciò che una fixture prova e ciò che accade in campo:** ogni cancello ha una prova di
  laboratorio; nessuno sa se abbia mai fermato una seduta vera.
- **Le risposte `✅ R5` e `✅ R6` dei report già chiusi:** sono attrito dichiarato dagli agenti, seduta
  dopo seduta, e **nessuno le ha mai lette in serie**. È la stessa mossa che ha prodotto il risultato
  migliore del 28-08 — leggere per intero un materiale che tutti avevano solo riassunto.
- **Il rapporto fra apparato e consegna:** il bisogno dichiarato da Matteo il 26-08 era «non ricostruire
  lo stato a mano a ogni apertura di chat». Chiediti, per ogni pezzo che guardi, quanto dista da lì.

---

## Vincoli non negoziabili

- ⛔ **Nessuna corsa lanciata, nessuna misura eseguita.** Si prepara, non si misura.
- ⛔ **Nessuna correzione al freeze `AM-C0` né ai verdetti già emessi.** Le dieci caselle mancanti si
  recuperano con casi nuovi.
- ⛔ **Non riaprire il disegno del protocollo V1 §2, §4.4 e §5:** sono decisioni di Matteo prese nodo per
  nodo il 28-08. Si superano solo con una rettifica append-only che cita ciò che sostituisce, e la
  decisione è sua.
- ⛔ **Nessun registro nuovo, nessun owner nuovo, nessun secondo router.** `docs/FOLLOW_UP.md` resta la
  destinazione unica delle decisioni. Se sembra necessario, **chiedi**.
- ⛔ **Sola lettura sull'app:** niente `src/`, `supabase/`, database, migrazioni.
- ⛔ **Non leggere `docs/_lavoro/`:** privato e fuori da git.
- ⛔ **Nessun esito** apre `SEP-G2`, avvia `SEP-6` o autorizza il cutover `WP-1`.
- **Append-only:** una decisione superata resta, barrata, con citazione di ciò che la supera.
- **`D18`, snellire non duplicare:** un attrezzo **importa** la regola, non la riscrive.
- ⚠️ **Non toccare le fixture congelate né i loro hash.** Copertura nuova = fixture nuove.
- **Chiudi con `npm run test:mss` e `npm run validate:mss:all` verdi sul tuo worktree *e* su un worktree
  pulito appena creato.** Sono due cose diverse.
- **Convivenza:** se il Codex sta ancora lavorando, **branch e worktree tuoi** da `env/test` aggiornato,
  path corto (`c:\tmp\<nome>`), e ⛔ non portare niente su `env/test` mentre lui deve chiudere con una
  capsula — il contratto di capsula si muoverebbe sotto i suoi piedi.
- ⚠️ **Ogni decisione che Matteo prende in seduta ha una riga in `docs/FOLLOW_UP.md`**, con stato
  `da_confermare` se ambigua. Un report è la storia di un pomeriggio, non un registro consultabile.

---

## Come parlare a Matteo

Matteo non è uno sviluppatore di professione e ha confermato più volte questo formato:

- **prima la scena concreta** (chi fa cosa, cosa succede, cosa si rompe), **poi** le sigle;
- **causa → effetto → soluzione**, in quest'ordine;
- prima frase autosufficiente: elemento → intervento → risultato verificabile;
- **indirizzalo, non fargli scegliere fra griglie:** porta la tua raccomandazione già presa e il perché;
- ⚠️ **fermarsi e presentargli un menù di tre opzioni è mezzo lavoro** — è una regola registrata
  (`FU-EVAL-CANCELLO-1`), nata da una risposta che aveva preso 6 su 6 e faceva esattamente questo;
- poche domande per volta, e solo quelle che cambiano il lavoro;
- a fine seduta dagli **la sequenza delle sue azioni numerata**, non il riassunto di cosa hai fatto;
- nessuna sigla senza spiegazione; termini tecnici nuovi **in grassetto**.

---

## Chiusura richiesta

1. **Il canale di contaminazione chiuso**, con il comando che **dimostra** l'assenza del disegno in
   tutte e quattro le condizioni, e l'output registrato.
2. **Il freeze della prima ablazione**, con il testo del compito **verbatim** e i nove punti del
   Lavoro 2. ⛔ Nessuna corsa lanciata.
3. **La diagnosi**, con: cosa hai guardato, cosa hai trovato, quanto costa ogni proposta, e **almeno una
   cosa che si può togliere**. Implementato solo ciò che Matteo ha approvato.
4. **Le righe `FOLLOW_UP`** per ogni decisione presa in seduta.
5. Report di seduta con sezione 11 «Domande di chiusura» compilata secondo
   `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` §11 — **aprila prima di scrivere il report**, non
   dedurre la struttura dai report vicini. ⚠️ **Le domande sono sette:** Q7 chiede quale prova utile hai
   visto che oggi non misuriamo.
6. Capsula, viste rigenerate, `validate:mss:all` e `validate:docs` verdi, commit sul tuo branch.
