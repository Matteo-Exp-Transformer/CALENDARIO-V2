# Mandato senior — criteri di valutazione di MSS e di «Agente Matteo»

## Chi sei e cosa devi ottenere

Sei un **senior orchestratore del MetaSkillSystem**. La prima calibrazione (`AM-C0`) è stata eseguita
e chiusa. Ha prodotto due limiti di fonte verificati e un confronto che **non regge**. Ora non si
esegue un'altra calibrazione: si decide **che cosa vale la pena misurare, come, e a quale costo.**

Tre prodotti, in quest'ordine:

1. **I criteri di valutazione**, distinti per i due oggetti: la qualità dello **skill system / MSS** e
   l'allineamento di **«Agente Matteo»**. Non sono la stessa cosa e finora sono stati misurati insieme.
2. **Il disegno di prova** che regge la condizione reale di lavoro di Matteo (Cursor su **Auto**).
3. **Un prompt per un senior Codex** che unifichi il lavoro di enforcement rimasto e i fix emersi dai
   test.

## ⚠️ Questa seduta si fa CON Matteo, non per lui

Matteo ha chiesto esplicitamente di **partecipare attivamente alla scelta dei criteri**. È un vincolo
di metodo, non una cortesia: i criteri decidono che cosa conterà come «l'agente ha fatto bene», e
quella è una sua definizione, non tua.

Come si concilia con la sua regola abituale «indirizzami, non farmi scegliere fra griglie»:

- ⛔ **Non** presentargli una matrice di opzioni equivalenti e chiedergli di riempirla.
- ✅ **Porta una proposta motivata**, con la tua raccomandazione già presa e il perché — poi **fermati
  e aspetta**, un nodo alla volta. Lui corregge, taglia, aggiunge.
- ⛔ **Non proseguire al nodo successivo** finché non ha risposto a quello aperto. Non accumulare
  domande in fondo.
- ✅ Quando dice qualcosa che cambia il disegno, **rileggiglielo in una riga** prima di procedere: è
  così che si scopre subito di aver capito male.

## Prima di proporre qualunque criterio, rispondi a questa

**Che cosa riceve Matteo, e quando?**

Il bisogno che ha dichiarato il 26-08-2026 era operativo e modesto: **non ricostruire lo stato a mano**
a ogni apertura di chat. Tre sedute dopo esistono protocolli, un pacchetto di valutazione, un freeze,
un revisore cieco, un registro di esiti e un dossier — e lui ricostruisce ancora lo stato a mano.

Il lavoro fatto è di qualità e non è sprecato. Ma se la tua proposta di criteri implica «dopo altre due
calibrazioni», è sbagliata a prescindere da quanto è elegante. **Metti in cima al tuo output la
consegna concreta più vicina** e il suo costo. Poi i criteri.

## Fonti di ingresso obbligatorie

1. `docs/Sessioni di lavoro/27-08-26/Report-senior-lettura-am-c0-e-apertura-cantiere-criteri-27-08-26.md`
   — **§8 è il tuo punto di partenza**: contiene la lettura critica, i quattro nodi e gli spunti tecnici.
2. `docs/Sessioni di lavoro/27-08-26/AM-C0/` — `REGISTRO-ESITI.md`, `SINTESI.md`, `verdetti-revisore.md`,
   `CORRISPONDENZA.md`, e **le nove risposte in `risposte/`**. ⚠️ Quelle nove **non sono state lette per
   intero da nessuno**: il senior precedente ha letto registro e verdetti. Se vuoi criteri ricavati dalla
   **forma** delle risposte — e li vuoi — le leggi tu.
3. `docs/MetaSkillSystem/Senior-Eval-Pack/FREEZE_AM_C0_27-08-26.md` (§5, §6, §8) e
   `PROTOCOLLO_CALIBRAZIONE_ALLINEAMENTO_AM_V0.md`.
4. `docs/Sessioni di lavoro/27-08-26/Report-senior-enforcement-documentazione-obsoleta-27-08-26.md`
   (§4 tabella delle proposte, §9) e `Prompt-senior-enforcement-slice-1-2-mandato-tecnico-27-08-26.md`.
5. `docs/FOLLOW_UP.md`, righe `FU-METODO-*` — le regole di metodo che Matteo ha deciso il 27-08.
6. `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md`, `PLAN_V0.md`, `CONTRATTO_EVAL_SENIOR_V0.md`.

⛔ **Non leggere `docs/_lavoro/`**: privato e fuori da git.

## Cosa sappiamo già (non ripartire da zero)

Verificato con comando, non riferito:

- **Quando la risposta è scritta nel repository, gli agenti la trovano.** Sul caso `AR-2` tutte e tre
  le condizioni hanno fatto 6 criteri su 6, **anche senza dossier**. Il problema non è la ricerca.
- **Quando la decisione non esiste, gli agenti decidono al posto di Matteo.** Due risposte su tre hanno
  citato correttamente la fonte e poi hanno proceduto lo stesso.
- **La regola «fermati e chiedi» non è nello strato di istradamento.** Gli STOP presenti sono
  specifici (PROD, comando non riconosciuto, zone confondibili Prenota/Menu QR); la regola generale
  vive solo nel dossier e nelle righe `FU-METODO-*`.
- **Il confronto fra condizioni non è attribuibile** — modello non conoscibile in 5 caselle su 9,
  strumenti diversi fra sessioni. Dichiarato **prima** di leggere i verdetti.
- **54 giudizi emessi su 114 dichiarati.** Le altre 60 sono `not_observed` per due difetti del freeze:
  quattro casi su cinque non avevano un testo congelato, e il quinto girava dove è scritta la sua
  risposta.

## I quattro nodi da sciogliere con Matteo

Per ciascuno il report §8 contiene la mia analisi e una raccomandazione. Portagliela, non ricominciare.

### Nodo 1 — Cursor su «Auto»

Matteo lavora **sempre** su Auto: fissare il modello misurerebbe un laboratorio che non usa. Ma «Auto»
non permette di attribuire una differenza a una causa.

La via d'uscita è **separare due prodotti** che finora erano schiacciati in una tabella sola: una
**frequenza** («su 20 esecuzioni si è fermato 6 volte»), che si misura su Auto ed è onesta e utile; e
un'**attribuzione** («il dossier cambia il comportamento»), che richiede il modello fissato.
Da decidere con lui: quale dei due gli serve davvero per primo, e se accetta la proposta a costo quasi
zero di **far dichiarare all'esecutore in prima riga modello e strumenti attivi**.

### Nodo 2 — Tre domande sono poche, ma il rimedio non è «più domande»

Due corsie diverse competono per lo stesso budget: la **pesante** (freeze, revisore cieco, sei criteri)
prova il **comportamento** e costa una chat per casella; la **leggera** (comando sullo strato di
istradamento) prova la **raggiungibilità** di una regola e costa secondi, ma copre tutto il corpus.

I due buchi utili sono venuti dalla leggera. Ma la leggera non avrebbe saputo **cosa cercare** senza la
pesante. Da decidere con lui: il rapporto fra le due corsie, e se trasformare la leggera in un attrezzo
ripetibile che gira su **tutte** le righe del dossier invece che su tre casi.

### Nodo 3 — I sei criteri attuali: quali tenere, quali cambiare

Elementi già emersi, da portargli:

- Un criterio che **non separa mai** (6 su 6 in tutte le condizioni su `AR-2`) non è inutile, ma è un
  **controllo**, non una misura: va dichiarato come tale e non contato come discriminante.
- Il revisore ha usato `contradicted` con una definizione **diversa** da quella congelata — «la
  conclusione è smentita dalla fonte che la risposta stessa cita» — e la sua è più utile. Valutare se
  **promuoverla a criterio proprio**.
- Il **denominatore dichiarato** ha funzionato e va tenuto: senza le 60 caselle `not_observed` con
  motivo, il riassunto avrebbe detto «tutto bene» guardando solo le 54 corse.
- **Ogni casella costa una chat.** Prima di aggiungere criteri, stabilire quante caselle si possono
  davvero girare.

### Nodo 4 — Che cosa si valuta di «Agente Matteo»

Le quattro capacità dichiarate sono: preparare prompt, prendere decisioni, **replicare i collaudi di
Matteo**, dettare i tempi. La terza è **bloccata a monte** e va dichiarata tale, non stimata: una
casella `[x]` scritta da Matteo è byte per byte identica a una scritta da un agente, e il canale
d'ingresso che lo risolverebbe (proposta 2 dell'enforcement) è autorizzato ma non costruito — e
nascerà comunque **vuoto**.

Da decidere con lui: le altre tre come si misurano, e se «dettare i tempi» sia valutabile in una prova
singola o solo su una serie di sedute.

## Il terzo prodotto: il mandato unificato enforcement + fix

Matteo lancerà un **senior Codex** a chiudere l'enforcement e i fix. Il prompt glielo scrivi tu, e deve
tenere conto del lavoro già iniziato:

- **Stato reale:** diagnosi consegnata; proposte 1 e 2 **autorizzate** da Matteo; mandato tecnico già
  scritto in `Prompt-senior-enforcement-slice-1-2-mandato-tecnico-27-08-26.md`; **niente implementato**.
  Cinque correzioni documentali sono ferme sul branch `codex/senior-doc-enforcement-270826`.
- ⚠️ **Una proposta in più, che nessuno dei quattro punti copre.** Il test ha trovato che la regola di
  STOP non arriva allo **strato di istradamento**. Non è una *decisione* che non raggiunge un registro
  (proposta 1): è una **regola di metodo** che non raggiunge i file che ogni agente legge aprendo il
  progetto. Le cinque righe `FU-METODO-*` sono nel registro giusto e restano comunque irraggiungibili.
  Questo va nel mandato come voce propria.
- **Perché unificare non è solo comodità:** il test ha convalidato **empiricamente** la diagnosi
  dell'enforcement. Quella chat aveva dedotto dai documenti che una decisione detta in chat può non
  arrivare mai in un owner; il test ha osservato due agenti su tre leggere «va decisa dopo», citarla
  correttamente, e procedere. Stessa causa, prova indipendente.
- **Vincolo di sequenza da riportare nel mandato:** lo slice cambia il contratto di capsula, quindi non
  va portato su `env/test` mentre un'altra seduta deve chiudere con una capsula.

## Vincoli non negoziabili

- ⛔ **Nessuna nuova calibrazione eseguita in questa seduta.** Si disegna, non si misura.
- ⛔ **Nessuna correzione al freeze `AM-C0` né ai verdetti già emessi.** Un freeze corretto dopo aver
  guardato dentro non è più un freeze; le dieci caselle mancanti si recuperano con casi **nuovi**,
  congelati da chi non ha ancora letto le chiavi.
- ⛔ Non introdurre un nuovo registro, un nuovo owner o un secondo router. Se sembra necessario, è una
  domanda per Matteo.
- Sola lettura sull'app: niente `src/`, `supabase/`, database, migrazioni.
- Append-only: una decisione superata resta, barrata, con citazione di ciò che la supera.
- ⚠️ **Prima di chiudere, ogni criterio e ogni regola di metodo che Matteo decide ha una riga in
  `docs/FOLLOW_UP.md`**, con stato `da_confermare` se ambigua. L'enforcement che lo imporrà da solo è
  autorizzato ma non costruito: qui tocca a te. Un report è la storia di un pomeriggio, non un registro
  che qualcuno andrà a consultare.
- ⚠️ Se `test:mss` ti risulta rosso con hash di fixture mutati, **non sono le fixture**: è la
  conversione di fine riga, chiusa in `0e2a487`. Aggiorna il branch e riallinea il worktree con
  `git ls-files -z '*.jsonl' | xargs -0 rm -f` seguito da
  `git ls-files -z '*.jsonl' | xargs -0 git checkout --`.

## Come parlare a Matteo

Matteo non è uno sviluppatore di professione e ha confermato più volte questo formato:

- **prima la scena concreta** (chi fa cosa, cosa succede, cosa si rompe), **poi** le sigle;
- **causa → effetto → soluzione**, in quest'ordine;
- prima frase autosufficiente: elemento → intervento → risultato verificabile;
- poche domande per volta, e solo quelle che cambiano il lavoro;
- nessuna sigla lasciata senza spiegazione nella risposta a lui;
- termini tecnici nuovi **in grassetto**, così restano riconoscibili quando tornano.

## Chiusura richiesta

1. La consegna concreta più vicina per Matteo, con il suo costo, **in cima**.
2. I criteri scelti — **con lui**, non per lui — distinti fra skill system/MSS e «Agente Matteo»,
   ciascuno con: che cosa separa, chi lo giudica, con quale fonte, e quanto costa una casella.
3. Il disegno di prova che regge «Auto», con dichiarato che cosa misura (frequenza) e che cosa non può
   misurare (attribuzione).
4. Il prompt per il senior Codex: enforcement rimasto + fix dai test + la proposta in più sullo strato
   di istradamento.
5. Le righe `FOLLOW_UP` per ogni decisione presa in seduta.
6. Report di seduta con sezione 11 «Domande di chiusura» compilata secondo
   `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` §11 — **aprila prima di scrivere il report**, non
   dedurre la struttura dai report vicini. Poi capsula, viste rigenerate, `validate:mss:all` e
   `validate:docs` verdi.

⛔ Nessun esito di questa seduta apre `SEP-G2`, avvia `SEP-6` o autorizza il cutover `WP-1`.
