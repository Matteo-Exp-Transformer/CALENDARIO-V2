# Parametri macro — MetaSkillSystem v0

> **Scopo:** decidere che cosa non perdere dalle chat prima di definire micro-metriche. Questi
> parametri classificano eventi; non assegnano livelli professionali e non diagnosticano la persona.

## 1. Priorità dei parametri

- **VITALE:** se manca, la seduta non è valida come fonte di apprendimento per il sistema.
- **FONDAMENTALE:** obbligatorio quando l'evento relativo è avvenuto; altrimenti `non osservato`.
- **MOLTO UTILE:** raccolta opportunistica; non blocca mai la chiusura.

## 2. Asse Persona — crescita di Matteo

### Vitali

1. **Attribuzione:** chi ha introdotto idea, criterio, decisione e testo finale.
2. **Provenienza:** episodio, fonte o artefatto che sostiene il segnale; oppure tag esplicito di
   ricordo, opinione, non-so o inferenza.
3. **Delta osservabile:** che cosa era diverso prima e dopo la seduta, ammesso `nessuno`.
4. **Grado di assistenza:** spontaneo · guidato · suggerito dall'agente · congiunto.
5. **Confini e sicurezza:** cosa Matteo ha fermato, ristretto, corretto o dichiarato di non sapere.

### Fondamentali

- criterio usato per scegliere o scartare;
- controllo eseguito e relativo denominatore;
- correzione accettata e trasferimento a un caso diverso;
- riuso differito di una mossa appresa;
- artefatto prodotto direttamente, diretto sotto regia o soltanto approvato;
- possibile traduzione professionale, separata dal suo stato probatorio.

### Molto utili

- forma di spiegazione che ha favorito una decisione;
- attrito, energia o carico dichiarati da Matteo, senza inferenze occulte;
- rete di persone o artefatti che potrebbero verificare un episodio;
- costo in turni e rework necessario per arrivare alla decisione.

## 3. Asse Sistema — crescita e salute dello strumento

### Vitali

1. **Continuità di cattura:** ogni seduta sostanziale, anche light o interrotta, lascia una capsula.
2. **Identità e contratto:** intento, tipo, ruolo/chiave, area, ambiente, porte e output autorizzati.
3. **Fedeltà di rotta:** rotta scelta, alternative o conflitti e pacchetti realmente caricati.
4. **Autorità e sicurezza:** read/write/forbid, privacy, LOCK e condizioni di STOP rispettati.
5. **Owner unico:** ogni stato dinamico ha un proprietario; le viste rimandano senza riscriverlo.
6. **Tracciabilità:** decisioni ed esiti portano alla fonte primaria, non soltanto al report.
7. **Integrità della validazione:** criterio fissato prima, versione dell'oggetto, ruoli separati e
   assenza di contaminazione.
8. **Effetto della regola:** quale scelta o output è cambiato grazie alla regola. Citarla soltanto
   dimostra lettura, non obbedienza.

### Fondamentali

- copertura e precisione del routing;
- ciclo guasto → causa → regola candidata → stato → nuova istanza;
- completezza della telemetria e capacità di ricostruire la seduta;
- recupero dall'errore senza cancellare la storia;
- separazione kernel · pacchetti · dati personali · prove;
- manutenibilità, peso del contesto e dipendenze fra pacchetti;
- portabilità fra persone, progetti, modelli e strumenti.

### Molto utili

- turni, token/contesto, rework e tempo percepito;
- tipo e frequenza delle correzioni di Matteo;
- drift dello scope e aree che generano attrito;
- differenze di risultato fra modelli o agenti;
- navigabilità e valore prodotto dopo la seduta.

## 4. Asse Output — prodotti e artefatti generati

### Tipi primari

Ogni entità ha un solo tipo primario e un ID stabile.

| Tipo | Funzione | Esempi |
|---|---|---|
| **prodotto/deliverable** | cambia qualcosa per un utente o destinatario | funzione, pagina, dossier consegnabile, case study |
| **artefatto di processo** | rende possibile o ripetibile il lavoro | prompt, piano, specifica, checklist, template, suite di test |
| **prova** | verifica un claim, un uso o un esito | run di test, commit, screenshot, assenso terzo |
| **governance** | governa agenti, accessi e lifecycle | skill, routing, manifest, regola, hook, registro owner |
| **registro grezzo** | conserva ciò che è accaduto | chat, verbale, report, log, osservazione |

Un documento può appartenere a qualunque tipo. Il formato non decide il valore: un report normale
resta registro grezzo; una specifica riusabile è artefatto di processo; un dossier destinato a un
datore può essere deliverable.

Classificare l'**entità usabile**, non il numero di file che la compongono. Un file sorgente,
un'immagine o una migrazione sono supporti/parti di implementazione finché non sono essi stessi il
deliverable usato dal destinatario. Un comportamento dell'app può essere un solo deliverable con
molti file di supporto; cento file toccati non diventano cento prodotti.

### Gate per contare un candidato prodotto

Un artefatto entra fra i `product_candidate` soltanto se possiede insieme:

1. utente o destinatario;
2. problema o lavoro da svolgere;
3. versione canonica;
4. criterio di accettazione fissato;
5. evidenza di verifica o uso.

In assenza di uno di questi campi resta artefatto o supporto: non viene contato come prodotto.
Un test verde non sostituisce la versione canonica, il destinatario o l'evidenza d'uso.

### Parametri vitali

- identità, tipo e versione canonica;
- destinatario, problema e uso previsto;
- ideazione, decisione, regia, redazione e verifica attribuite separatamente;
- criterio di accettazione, esito e prova collegata;
- owner, privacy e autorizzazione d'uscita;
- relazione con versioni, prove e report senza doppio conteggio.

### Parametri fondamentali

- adeguatezza allo scopo;
- uso reale, ripetibilità e affidabilità;
- manutenibilità e possibilità di riuso;
- trasferibilità a un altro utente o dominio;
- valore osservato: tempo, rischio, risultato o decisione resa possibile;
- contributo della regia umana distinto dalla produzione materiale dell'agente.

### Parametri molto utili

- presentabilità professionale;
- facilità con cui viene ritrovato e compreso;
- costo di produzione e rework;
- novità e compatibilità con altri pacchetti;
- feedback qualitativo del destinatario.

## 5. Validazione delle regole: tre misure indipendenti

Non usare un voto unico.

| Misura | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| **G — governance** | assente | descritta in prosa | strutturata, versionata e con owner | — |
| **O — osservazione** | non osservata | un episodio | comportamento ripetuto | prova indipendente o avversariale |
| **E — enforcement** | nessuno | promemoria nel prompt | preflight rilevabile | blocco tecnico della violazione |

Per una regola critica la maturità è il valore più debole fra G, O ed E, mai la media. Un sistema
con G2, O1 ed E0 è documentato ma non autonomo.

## 6. Falsificatori duri

Invalidano la seduta o impongono STOP:

- conflitto di routing taciuto;
- scrittura su LOCK, ambiente o output non autorizzati;
- owner inventato dall'agente o stesso stato manoscritto in due fonti vive;
- criterio cambiato dopo l'esito o chiave leggibile dal soggetto della prova;
- dato, problema o difficoltà inventati;
- decisione senza attribuzione o controllo senza denominatore;
- output dichiarato prodotto senza destinatario/uso;
- attribuzione a Matteo di un testo agent-written senza indicarne la regia.
