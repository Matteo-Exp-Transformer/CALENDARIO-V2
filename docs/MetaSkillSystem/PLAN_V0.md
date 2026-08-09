# Masterplan operativo — MetaSkillSystem v0

> **Cantiere:** `SYS-1` · **Stato:** aperto · **Modalità:** ombra  
> **Proprietà:** questo file è l'unica fonte di verità per stato, sequenza, progressi e gate del
> MetaSkillSystem v0. Roadmap, handoff e report rimandano qui senza ricopiare lo stato.  
> **Ultimo movimento:** 09-08-26 — `WP-0.1` chiuso nel disegno sul contratto
> `mss.session/0.1.0`; protocollo e 14 fixture minime congelati; `H-1` è il pacchetto attivo.

## 1. Scopo

Costruire un sistema capace di crescere senza chiedere a ogni agente di leggere tutto, conservando
eventi affidabili sulle sedute e separando tre assi non intercambiabili:

- **Persona:** ciò che Matteo decide, apprende, trasferisce, verifica o delimita;
- **Sistema:** ciò che routing, regole, agenti e controlli fanno realmente;
- **Output:** entità prodotte, uso, attribuzione, prova e lifecycle.

Il kernel resta piccolo; pacchetti e ruoli aprono soltanto il contesto necessario; gli eventi
alimentano viste derivate; osservazione, modifica e validazione del sistema restano ruoli distinti.

## 2. Vincoli che non si riaprono

1. Il sistema attuale resta autorevole durante la modalità ombra.
2. Nessuna migrazione o riscrittura della root prima dei gate di release.
3. Macro prima dei micro; nessun punteggio personale introdotto dal pilota.
4. `Nessuna osservazione`, `non noto` e `non applicabile` sono dati validi.
5. Nessuna promozione Persona da una chat ordinaria o da una singola istanza assistita.
6. Un file/supporto non è automaticamente un prodotto.
7. Un valore dinamico ha un solo owner; le altre superfici sono rimandi o viste generate.
8. Governance, osservazione ed enforcement restano misure separate.
9. Il fallimento di `C9` resta storico; questo cantiere non è una nuova somministrazione di `C9`.
10. Dati personali e prove sigillate restano separati dal kernel portabile.

## 3. Come leggere il masterplan

- **Adesso:** un solo pacchetto principale aperto.
- **Subito dopo:** lavoro già ordinato ma non ancora iniziato.
- **Più avanti:** direzione nota, dettagli intenzionalmente incompleti.
- **Buco dichiarato:** decisione che richiede dati; non va riempita per plausibilità.

Stati ammessi per i work package:

- `NON INIZIATO`
- `APERTO`
- `IN PILOTA`
- `BLOCCATO DA GATE`
- `CHIUSO NEL DISEGNO`
- `CHIUSO E OSSERVATO`
- `RITIRATO`

Il lifecycle futuro di regole e cantieri sarà modellato in WP-3; questi stati governano soltanto il
lavoro del masterplan.

## 4. Quadro corrente

| Ordine | Pacchetto | Stato reale | Prossimo gate |
|---|---|---|---|
| 0 | `WP-0` — parametri macro e prima capsula | `CHIUSO NEL DISEGNO` | efficacia da osservare nei piloti |
| 1 | `MP-0` — report osservazioni + masterplan unico | `CHIUSO E OSSERVATO` 09-08-26 | roadmap generale ridotta a puntatore |
| 2 | `WP-0.1` — hardening pre-pilota | `CHIUSO NEL DISEGNO` 09-08-26 | efficacia da osservare nel primo pilota |
| 3 | `H-1` — validator + hook rapidi | **`APERTO` — ADESSO** | errori meccanici intercettati sulle superfici dichiarate |
| 4 | `WP-1` — piloti reali in ombra | `BLOCCATO DA H-1` | ricostruzione fredda senza perdita/invenzione |
| 5 | `WP-2` — mining storico normalizzato | `BLOCCATO DA PRIMO PILOTA` | eventi citano fonti e schema/versione |
| 6 | `WP-3` — kernel, manifest, pacchetti e chiavi | `NON INIZIATO` | autorità e precedenze formalizzate |
| 7 | `WP-4` — preflight, registro Output e viste | `NON INIZIATO` | conflitti/owner/scope rilevati prima delle azioni coperte |
| 8 | `WP-5` — nuova suite di validazione | `NON INIZIATO` | casi avversariali con oggetto e ruoli separati |
| 9 | `WP-6` — decisione di cutover | `NON INIZIATO` | zero perdita vitali e gate di release superati |
| — | `E-2` — enforcement superiore | **buco intenzionale** | tecnologia e posizione si decidono dopo i dati di H-1/WP-1 |

## 5. Pacchetto chiuso nel disegno — `WP-0.1` hardening pre-pilota

### Obiettivo

Correggere soltanto ciò che renderebbe i primi eventi ambigui, incompatibili o non validabili. Non
anticipare il kernel completo di WP-3.

### Lavori

| ID | Lavoro | Stato | Gate |
|---|---|---|---|
| `0.1-A` | Aggiungere identità minima: versione schema, revisione sistema, pacchetti, agente/modello/runtime, strumenti e autore record | fatto in `0.1.0` | due eventi prodotti con versioni diverse restano distinguibili |
| `0.1-B` | Separare busta/evento grezzo da annotazioni Persona·Sistema·Output | fatto in `0.1.0` | un fatto può restare immutato mentre cambia un'annotazione |
| `0.1-C` | Definire rettifica append-only (`amends/supersedes`, motivo, autore, data) | fatto in `0.1.0` | una correzione non cancella l'evento precedente |
| `0.1-D` | Correggere la forma light e il punto in cui vive | fatto: JSONL pilot-only collegato dal log | inserimento reale non rompe `SESSION_LOG` ed è parsabile |
| `0.1-E` | Riallineare il quinto gate prodotto alla fonte proprietaria | fatto: `verification_or_use_evidence` | nessuna vista sostituisce “verifica/uso” con un altro campo |
| `0.1-F` | Aggiungere autore/verificatore e stato di verifica delle dichiarazioni | fatto in `0.1.0` | self-report e verifica indipendente sono distinguibili |
| `0.1-G` | Fissare il protocollo del primo pilota prima dell'istanza | fatto: protocollo `1.0.0`, 20 target, 14 fixture | versione, ruoli, denominatore e conseguenze non cambiano dopo l'esito |
| `0.1-H` | Definire privacy minima necessaria al pilota | fatto; retention resta buco dichiarato | cattura, divieti, sensibilità e rettifica sono espliciti; retention finale può restare aperta |
| `0.1-I` | Definire ID/correlazione minimi per sessione, compact e retry | fatto: UUIDv7 + capture key idempotente | nessuna collisione nel caso pilota e nessun doppio evento per lo stesso compact |

### Artefatti congelabili

- `CONTRATTO_CAPSULA_SESSIONE_V0.md` possiede schema e semantica `mss.session/0.1.0`;
- `PROTOCOLLO_PRIMO_PILOTA_V0_1.md` possiede oggetto, ruoli, denominatore, conseguenze e i 14 ID
  minimi delle fixture H-1;
- `fixtures/v0.1/FX-V02-*` dimostra con dati sintetici che link Markdown e JSONL restano separati e
  parsabili;
- `PARAMETRI_MACRO_V0.md` resta owner dei cinque gate prodotto e dei parametri macro;
- `SESSION_LOG.md` resta indice narrativo: le light vivono in file JSONL collegati, non nelle celle.

### Buchi ammessi in uscita

Possono restare non decisi, purché dichiarati:

- formato definitivo dell'event store;
- durata di conservazione;
- numero finale di piloti per tipologia;
- tecnologia dell'enforcement superiore;
- strategia multiutente;
- backup definitivo.

Questi buchi non devono impedire di identificare e validare il primo evento reale.

### Gate di chiusura

`WP-0.1` è chiuso nel disegno perché la versione congelabile rappresenta:

1. evento e annotazioni senza confonderli;
2. produttore e versione del sistema osservato;
3. rettifica senza overwrite;
4. sessione light senza rompere il log;
5. gate prodotto canonico;
6. self-report distinto da verifica;
7. protocollo del primo pilota fissato prima dell'esito.

La chiusura non dichiara efficacia: G è documentale, O/E arrivano con H-1 e WP-1.

## 6. Pacchetto attivo — `H-1` enforcement rapido con validator e hook

### Decisione

Prima tranche approvata da Matteo: usare i meccanismi più rapidi ed efficaci già compatibili con il
repo. Gli hook devono pescare quanti più errori meccanici possibile; i livelli superiori arrivano
dopo che schema e flusso sono solidi.

### Architettura minima

Un solo validator deterministico deve alimentare più punti di intercettazione:

1. **durante/alla chiusura in Cursor:** nudge mirato o richiesta di correzione;
2. **pre-commit Husky:** blocco della pubblicazione per artefatti staged non validi;
3. **comando manuale/CI futuro:** stesso esito sullo stesso input;
4. **fallback documentato per superfici senza hook:** nessuna falsa copertura.

Non duplicare la logica fra hook. Gli adapter raccolgono input; il validator possiede le regole
meccaniche.

### Prima copertura da implementare

- presenza e versione della capsula richiesta;
- campi vitali mancanti o placeholder;
- formato light valido;
- ID evento duplicato nel perimetro controllabile;
- owner/riferimento non risolvibile nel perimetro già strutturato;
- classificazione prodotto priva di uno dei cinque gate;
- report standard/deep senza capsula;
- light dichiarata senza evento light;
- uso di stato forte senza prova/verificatore richiesto;
- target/LOCK riconoscibili meccanicamente, inizialmente almeno a livello warning/blocco commit.

### Matrice di copertura obbligatoria

Per ogni controllo scrivere:

| Campo | Valore da dichiarare |
|---|---|
| superficie | Cursor locale · Codex · Claude Code · Cloud · commit · CI |
| momento | prima azione · dopo edit · stop · pre-commit · post-commit |
| effetto | allow · warn · ask · deny/blocco |
| fallback | comportamento quando payload/file non è leggibile |
| bypass noto | come può non scattare |
| G/O/E | stato separato, senza media |

### Gate di chiusura

H-1 chiude soltanto se:

- un input valido passa allo stesso modo da comando e hook;
- casi invalidi minimi sono respinti con messaggio azionabile;
- light e standard/deep sono entrambi coperti;
- il limite Cursor/Cloud e ogni fail-open sono dichiarati;
- nessun hook viene classificato E3 se blocca soltanto il commit o la chiusura.

Numero e significato delle fixture minime sono congelati da `0.1-G`: **14 casi**
`FX-V01…FX-V04` e `FX-I01…FX-I10`, definiti nel protocollo del primo pilota. H-1 crea i file
eseguibili e può aggiungere casi senza cambiare questi ID.

## 7. `WP-1` — piloti reali in modalità ombra

### Tipi obbligatori

1. light chiusa normalmente;
2. standard/deep;
3. interrotta o compact;
4. valutativa con annotazione ritardata.

### Prima istanza

Il ciclo che ha prodotto Report 001 e questo masterplan resta calibrazione storica: schema e criterio
non erano congelati prima del suo esito, quindi non viene retro-adattato né contato come istanza. Il
protocollo `MSS-PILOT-001` assegna la prima istanza alla prima sessione Meta/deep sostanziale iniziata
dopo la chiusura di H-1.

### Verifica fredda

Il revisore riceve evento/capsula più owner necessari, non la narrativa completa né il verdetto
atteso. Deve ricostruire:

- intento e tipo;
- ruolo, ambiente, privacy e autorità;
- route e conflitti;
- decisioni attribuite;
- delta Persona, Sistema e Output;
- owner, output e aperti;
- versione del sistema/agente osservati.

### Gate

- nessun vitale perso o inventato;
- nessuna attribuzione o promozione impropria;
- nessun supporto contato come prodotto;
- self-report distinto da verifica;
- stato ricostruito senza leggere tutta la narrativa;
- costo/rework della cattura registrato;
- ogni correzione del contratto produce una nuova versione e non modifica il criterio dell'istanza.

Il numero di istanze necessario per dichiarare “continuità di cattura” resta **da decidere dopo il
primo campione**, prima di eseguire le istanze successive.

## 8. `WP-2` — mining storico normalizzato

Prima del primo pilota è consentito soltanto:

- inventario read-only dei report;
- campi presenti/mancanti;
- stima del costo di estrazione;
- rilevazione di possibili duplicati.

La scrittura di eventi normalizzati parte soltanto quando lo schema minimo è versionato e il primo
pilota ha dimostrato che un agente freddo può ricostruire lo stato.

Gate ancora validi:

- ogni evento cita la fonte;
- nessuna reinterpretazione di Matteo viene presentata come fatto;
- nessun doppio conteggio;
- ogni estrazione dichiara schema e autore;
- le annotazioni derivate restano separabili dall'evento grezzo.

## 9. `WP-3…WP-6` — roadmap successiva

### `WP-3` — kernel, manifest, pacchetti e chiavi

Da definire usando i dati di WP-1/2. Deve coprire almeno:

- identità/versione/owner delle regole;
- precedenze e conflitti;
- capability `read/write/forbid`, default deny, revoca e scadenza;
- trust class e provenienza dei pacchetti;
- dipendenze, cicli, compatibilità, deprecazione e ritiro;
- separazione kernel · overlay personale · vault prove.

Formato definitivo del manifest: **buco intenzionale fino ai dati di WP-1/2**.

### `WP-4` — preflight, registro Output e viste

Deve rendere ispezionabili prima delle azioni coperte:

- rotta scelta e alternative;
- target e LOCK;
- owner e autorizzazione;
- ambiente/privacy;
- output autorizzati;
- lifecycle e relazioni anti-doppio conteggio.

Qui si decide, sulla base di H-1, quali controlli restano hook e quali richiedono un enforcement
superiore.

### `WP-5` — suite di validazione con nuovo ID

Non riusa `C9`. Richiede oggetto/versione fissati, autore/somministratore/valutatore separati, chiave
fuori dal contesto leggibile e conseguenze decise prima. Deve includere almeno:

- regola letta ma violata;
- conflitto di routing;
- target LOCK;
- owner non eleggibile dall'agente;
- stesso fatto in più viste contato una volta;
- deliverable, test e report come entità diverse e collegate;
- agente freddo che ricostruisce lo stato.

Numero di istanze e soglie oltre i gate duri: **da decidere prima dell'apertura di WP-5**.

### `WP-6` — decisione di cutover

Non contiene oggi una data o un finale presunto. Si apre soltanto dopo WP-5. Il cutover resta una
decisione esplicita di Matteo, non una conseguenza automatica dei test.

## 10. `E-2` — enforcement superiore, parcheggio governato

Obiettivo noto: impedire tecnicamente le violazioni che hook e commit possono soltanto intercettare
tardi o su alcune superfici.

Possibili famiglie, non ancora scelte:

- write broker/capability gateway;
- permessi filesystem o workspace separati;
- wrapper obbligatorio degli strumenti;
- policy engine esterno;
- CI protetta e branch policy;
- store con scritture transazionali.

Decisione rinviata finché H-1/WP-1 non mostrano:

- quali errori accadono davvero;
- su quali superfici;
- quali bypass restano;
- quanto costa il controllo;
- quali violazioni richiedono E3.

## 11. Idee e debiti da non perdere

| ID | Idea/debito | Quando si riapre |
|---|---|---|
| `IDEA-MSS-01` | retention, cancellazione, export e livelli di sensibilità | prima del mining esteso; decisione Matteo su esempi reali |
| `IDEA-MSS-02` | event store definitivo e viste generate | dopo primo pilota e stima volume WP-2 |
| `IDEA-MSS-03` | backup, snapshot, hash e disaster recovery | dopo scelta dello store |
| `IDEA-MSS-04` | portabilità/holdout su persone diverse | dopo v0 locale stabile e consenso esplicito |
| `IDEA-MSS-05` | misura del costo di contesto e qualità della cattura | dentro WP-1 |
| `IDEA-MSS-06` | enforcement E3/write gateway | dopo matrice H-1 e dati WP-1 |
| `IDEA-MSS-07` | dashboard e indici generati | WP-4, non prima degli owner strutturati |
| `IDEA-MSS-08` | policy per documenti esterni/prompt injection | WP-3 trust boundary |

Nuove idee entrano qui con un ID e una condizione di riapertura. Non generano da sole un nuovo file
o un nuovo cantiere.

## 12. Parallelizzazione consentita

Prima della chiusura di WP-0.1:

- consentiti audit read-only su hook, report e schema;
- vietata la normalizzazione storica;
- un solo writer modifica contratto/masterplan.

Dopo il primo pilota:

- inventario/mining read-only;
- audit G/O/E;
- inventario Output;
- catalogo pacchetti;

possono procedere su artefatti separati. L'integrazione avviene soltanto dopo risoluzione di owner e
conflitti. Nessun agente modifica lo stesso indice o proiezione di un altro.

## 13. Gate di release v0

Restano obbligatori:

- zero perdita dei parametri vitali nel campione approvato;
- zero violazioni di routing conflittuale, LOCK, owner, privacy o output autorizzato nei gate duri;
- report e viste ricostruibili dagli eventi proprietari;
- nessun documento contato prodotto senza tutti i gate `product_candidate`;
- kernel privo di dati o esempi personali su Matteo;
- G, O ed E separati per ogni regola critica;
- nessuna promozione Persona basata su una singola istanza assistita;
- versione di schema/sistema/agente ricostruibile;
- rettifiche senza cancellazione della storia;
- limiti e bypass degli hook dichiarati.

Se un gate fallisce, il v0 resta in ombra. Il numero finale di campioni e l'eventuale livello E3
necessario restano buchi governati dai pacchetti che raccolgono i dati.

## 14. Log dei progressi

| Data | Movimento | Fonte |
|---|---|---|
| 09-08-26 | `WP-0` chiuso nel disegno; `WP-1` aperto in ombra; due difetti trovati a freddo | evento `MSS-2026-08-09-0001` |
| 09-08-26 | Creato Report 001 con 23 osservazioni e relativa provenienza | `REPORT_001_OSSERVAZIONI_ARCHITETTURALI_09-08-26.md` |
| 09-08-26 | Questo file diventa masterplan unico di `SYS-1`; aperto `WP-0.1` | decisione Matteo in chat |
| 09-08-26 | Priorità enforcement: prima validator + hook rapidi, poi soluzioni superiori guidate dai dati | decisione Matteo in chat |
| 09-08-26 | `WP-0.1` chiuso nel disegno: schema `0.1.0`, protocollo `1.0.0`, 20 target e 14 fixture minime congelati; aperto `H-1` | completamento del pacchetto autorizzato da Matteo |

## 15. Prossimo task atomico

Eseguire `H-1` contro `mss.session/0.1.0`: completare le 14 fixture congelate, implementare un solo
validator deterministico e collegarlo al comando manuale e agli hook locali dichiarando la matrice
di copertura.

**Gate del prossimo task:** input valido coerente fra comando e hook; invalidi minimi respinti con
messaggio azionabile; light e standard/deep coperti; limiti, fallback e bypass dichiarati senza
attribuire E3 a un blocco che avviene soltanto alla chiusura o al commit.
