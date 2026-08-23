# Masterplan operativo — MetaSkillSystem v0

> **Cantiere:** `SYS-1` · **Stato:** aperto · **Modalità:** ombra  
> **Proprietà:** questo file è l'unica fonte di verità per stato, sequenza, progressi e gate del
> MetaSkillSystem v0. Roadmap, handoff e report rimandano qui senza ricopiare lo stato.  
> **Nord del cantiere:** vedi **§16 — Target dello scheletro**, dettato da Matteo il 21-08-2026.
> È la direzione che governa l'ordine dei prossimi pacchetti.  
> **Ultimo movimento:** **P2A in corso** — manuale operativo locale
> [`MANUALE_OPERATIVO_MSS_V0.md`](MANUALE_OPERATIVO_MSS_V0.md) (`SK-10`, non chiuso; `R8` non
> soddisfatto). Audit e P1 restano in [`AUDIT_STATO_REALE_23-08-26.md`](AUDIT_STATO_REALE_23-08-26.md)
> e report P1. `SK-7` gate A/B; `H-1.3` `PASS_CON_RISERVE`; `WP-1` **NO-GO**.
>
> **Rettifica 21-08-26 (append, non riscrittura):** l'intestazione precedente si era fermata al
> movimento `H-1.1` del 10-08-26 e dichiarava «Checkpoint WP-0.1 locale `7632443`. Nessun commit/push»,
> mentre il corpo dello stesso file era già arrivato a `H-1.3` e a `ee0ab39` pushato. Era il primo
> campo letto da qualunque agente freddo ed era falso. Causa registrata: aggiornamento della sola
> sezione «prossimo passo» senza rilettura delle sezioni di testa. Fonte:
> `docs/Sessioni di lavoro/21-08-26/MAPPA-MSS-consulenza-esterna-21-08-26.md` §7.

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

Uno stato storicamente dichiarato chiuso che viene smentito da una prova riproducibile torna
`APERTO`; la dichiarazione non viene cancellata, ma resta nel log con il riferimento alla rettifica.

Il lifecycle futuro di regole e cantieri sarà modellato in WP-3; questi stati governano soltanto il
lavoro del masterplan.

## 4. Quadro corrente

| Ordine | Pacchetto | Stato reale | Prossimo gate |
|---|---|---|---|
| 0 | `WP-0` — parametri macro e prima capsula | `CHIUSO NEL DISEGNO` | efficacia da osservare nei piloti |
| 1 | `MP-0` — report osservazioni + masterplan unico | `CHIUSO E OSSERVATO` 09-08-26 | roadmap generale ridotta a puntatore |
| 2 | `WP-0.1` — hardening pre-pilota | `CHIUSO NEL DISEGNO` 09-08-26 | efficacia da osservare nel primo pilota |
| 3 | `H-1` — validator + hook rapidi | **chiusura invalidata dalla revisione H-1.1** | resta storia del primo hardening |
| 3.1 | `H-1.1` — integrità append-only e semantica | **`CHIUSO NEL DISEGNO` 10-08-26** | revisione completa esterna prima di WP-1 |
| 3.2 | `H-1.3` — amendment / staged / parità superfici | **`PASS_CON_RISERVE` 10-08-26** (riserva H13-POST-L01; bypass E2 dichiarati) | track L5 in git; **non** apre WP-1; G5 non PASS |
| 4 | `WP-1` — piloti reali in ombra | **`NON INIZIATO` — NO-GO** (H-1.3 con riserve ≠ via libera) | ricostruzione fredda senza perdita/invenzione |
| 5 | `WP-2` — mining storico normalizzato | `BLOCCATO DA PRIMO PILOTA` | eventi citano fonti e schema/versione |
| 6 | `WP-3` — kernel, manifest, pacchetti e chiavi | `NON INIZIATO` | autorità e precedenze formalizzate |
| 7 | `WP-4` — preflight, registro Output e viste | `NON INIZIATO` | conflitti/owner/scope rilevati prima delle azioni coperte |
| 8 | `WP-5` — nuova suite di validazione | `NON INIZIATO` | casi avversariali con oggetto e ruoli separati |
| 9 | `WP-6` — decisione di cutover | `NON INIZIATO` | zero perdita vitali e gate di release superati |
| — | `E-2` — enforcement superiore | **buco intenzionale** | tecnologia e posizione si decidono dopo i dati di H-1/WP-1 |

### 4-bis. Pacchetti «scheletro» — aperti dal target §16 (21-08-2026)

Questi pacchetti servono il target dettato da Matteo. Non sostituiscono `WP-1…WP-6`: costruiscono gli
attrezzi senza i quali quei pacchetti costano più di quanto rendono. Ordine vincolante: **prima ciò
che è gratis e sblocca, poi ciò che legge soltanto, poi ciò che scrive.**

| Ordine | Pacchetto | Stato | Prova di chiusura (comando, non opinione) |
|---|---|---|---|
| S0 | `SK-0` — sbloccare i cancelli globali | **`CHIUSO E OSSERVATO` 21-08-26** | ✅ `npm run lint` **exit 0** (era 363 problemi / 17 errori) · ✅ `npm run test` **163 file, 1346 test, exit 0** · ✅ `npm run validate` **exit 0** · ✅ `validate:docs` **3 886 → 17** path rotti |
| S1 | `SK-1` — punto di ripristino (tag annotato) | `APERTO` — quick win non eseguito | manca `mss/baseline-h13`; oggi il ripristino è uno SHA ricordato |
| S2 | `SK-2` — `mss:status` (sola lettura) | `IMPLEMENTATO, non allineato` | il comando esiste e gira; il suo output ripete numeri/stati stale e non controlla roadmap/handoff |
| S3 | `SK-3` — `mss:review` (sola lettura) | `NON INIZIATO` | su una seduta con violazione nota la trova; su una pulita non inventa nulla |
| S4 | `SK-4` — chiusura dei bypass + allineo contratto capsula | **`APERTO` — D1 chiuso in P1, chiusura formale pendente** | B1–B3 restano provati · ✅ pre-commit passa `requireCapsule: true` come CI (suite H-1/tools) · restano bypass/schema gate in prosa · chiusura storica `D20` rettificata, non cancellata |
| S5 | `SK-5` — controlli MSS in CI su `env/test` | **`APERTO` — CI esiste, gate complessivo non coerente** | job remoto MSS osservato verde, ma dipende dalla parità `D1`; `npm run validate` non include `test:mss` né `validate:docs`. Il rosso documentale non va più occultato. |
| S6 | `SK-6` — `mss:query` (sola lettura) | **`CHIUSO` 23-08-26 — decisione di Matteo** | ✅ `npm run mss:query -- --regole/--modelli/--verifica/--fail` rispondono · ✅ `npm run test:mss` **exit 0** (conteggio mobile — eseguire il comando) · ✅ `node --check scripts/mss/query.mjs` **exit 0** · ⚠️ copertura test del lettore parziale (suite tools, non H-1 intero) · rettificato 22-08-26: capsula `SK-6` corretta con `amendment`; criterio revisori su `recorded_by.role` · ✅ **23-08-26 vista effettiva:** `query.mjs` delega `core.mjs::applyAmendmentsView()` · ✅ **23-08-26 P1:** `--fail` usa denominatori calcolati, non literal storici · revisioni/controlli: numero mobile → `npm run mss:query -- --verifica` · **Matteo ha dichiarato `SK-6` CHIUSO (`D16`)** |
| S7 | `SK-7` — `mss:capsule` (generazione) | **`CHIUSO` 24-08-26 — decisione `M3` di Matteo dopo controverifica** | ✅ attrezzo e report SK-7 esistono · ✅ fix B: `parseCheckSpec` canonico `ID=>comando`, legacy un solo `:`, ambigui rifiutati; il comando può contenere ulteriori `=>` · ✅ `runChecks` non passa comandi vuoti · ✅ rettifica privacy append-only su report SK-7 · ✅ `source_refs` escludono untracked non pubblicabili · ✅ test/tools, H-1, docs, lint, validator capsule e validate globale rieseguiti verdi il 24-08-26 |
| S8 | `SK-8` — radice robusta della suite | **`IMPLEMENTATO, non dichiarato`** | `npm run test:mss` verde da profondità diverse (risoluzione da posizione file); manca prova registrata e promozione documentale |
| S9 | `SK-9` — `mss:move` | `NON INIZIATO` | file spostato, riferimenti vivi, suite verde, costo misurato contro le 1 741 righe di riferimento |
| S10 | `SK-10` — manuale utente + intervista di bootstrap | **`IN CORSO — P2A manuale locale`** | ✅ `MANUALE_OPERATIVO_MSS_V0.md` + puntatori ingresso · ⛔ bootstrap repo nuova non provato (`P2B`) · ⛔ `R8` non chiuso |
| S11 | `SK-11` — test automatici degli attrezzi MSS | **`APERTO` — suite verde, copertura e viste incomplete** | ✅ `npm run test:mss:tools` **exit 0** (conteggio mobile — eseguire il comando) · ✅ `npm run test:mss` **exit 0** (conteggio mobile — eseguire il comando) · ✅ controprova revisore documentata (rosso→verde, hash identico) · ⚠️ copertura insufficiente: privacy template, hook Claude, guard PROD · ⚠️ numeri mobili non vanno congelati in owner/output (rettifica P1 D5) · chiusura formale `D20` resta storica; nuova chiusura solo dopo P4 |

### 4-ter. Rettifica tecnica dell'audit 23-08-26 — questa sezione prevale sulle celle stale sopra

| Pacchetto | Stato operativo dopo audit | Cosa deve accadere prima di una nuova chiusura |
|---|---|---|
| `SK-4` | **APERTO**: B1–B3 restano veri; **P1 D1** ha allineato pre-commit e CI su `requireCapsule: true` (prove in suite H-1/tools). | Restano bypass non coperti e schema gate in prosa; chiusura formale solo Matteo. |
| `SK-5` | **APERTO**: job MSS remoto esiste, ma la sua efficacia dipende da D1; `npm run validate` non include `test:mss` né `validate:docs`. | Scegliere e testare un gate locale/CI coerente, senza nascondere il rosso documentale. |
| `SK-7` | **CHIUSO 24-08-26 (`M3`)**: fix B D2/D3 e privacy append-only controverificati; sintassi canonica e source refs pubblicabili coperti da test. | Revisione indipendente (`D17`) resta consigliata, non gate. |
| `SK-8` | **IMPLEMENTATO, non dichiarato**: la suite gira già da una root diversa grazie alla risoluzione dalla posizione del file. | Registrare una prova riproducibile e promuovere lo stato documentale. |
| `SK-11` | **APERTO**: suite verde; **P1 D5** ha rimosso numeri stale da §4-bis; copertura insufficiente. | Test per privacy template, hook Claude e guard PROD (P4); conteggi sempre da comando, non da owner. |

Analisi, prove e motivazione dell'ordine:
`docs/Sessioni di lavoro/21-08-26/STRATEGIA-scheletro-mss-21-08-26.md`.
Nessuno di questi pacchetti è autorizzato finché Matteo non lo apre esplicitamente.

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

- `CONTRATTO_CAPSULA_SESSIONE_V0.md` possiede schema e semantica vivi `mss.session/0.1.1`
  (storia `0.1.0` nel checkpoint WP-0.1);
- `PROTOCOLLO_PRIMO_PILOTA_V0_1.md` possiede oggetto, ruoli, denominatore, conseguenze, risultato
  pilota strutturato e i 14 ID minimi delle fixture H-1 (versione viva `1.0.1`);
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

> ⚠️ **Lettura obbligatoria prima del paragrafo che segue (nota aggiunta 21-08-26).** Questa
> dichiarazione di chiusura è **storia, non stato**: è stata **invalidata** dalla revisione `H-1.1`,
> come registra la tabella §4 riga `H-1`. Resta qui perché la provenienza non si cancella, ma
> **non va citata come stato corrente**. Lo stato corrente della catena di hardening è `H-1.3` =
> `PASS_CON_RISERVE`. Segnalata dal test a freddo della consulenza esterna come contraddizione
> interna al file.

H-1 è **chiuso nel disegno** (non ancora osservato su piloti reali) perché:

- un input valido passa allo stesso modo da comando e hook/adapter;
- le cinque controprove della revisione fredda sono respinte con rule code stabile;
- casi invalidi minimi sono respinti con messaggio azionabile (`rule_code` + file + field path);
- light e standard/deep sono entrambi coperti;
- bundle finali hanno un solo evento logico, assi finali, verificatori separati e gate prodotto
  completi; path assoluti/traversal/symlink escape e link light incoerenti sono respinti;
- le fixture negative sono valutate dal manifest e non impediscono il commit degli artefatti di test;
- la normale suite non riscrive le fixture e segnala drift rispetto al generatore;
- stop e pre-commit sono provati in integrazione; Cloud/Codex/Claude senza hook, `--no-verify`,
  unstaged, report non recenti o senza modalità restano bypass dichiarati nella matrice;
- nessuna CI è dichiarata perché nessun workflow esegue H-1;
- nessun hook è classificato E3: blocco solo a stop/pre-commit sulla pubblicazione staged.

Numero e significato delle fixture minime restano congelati da `0.1-G`: **14 casi**
`FX-V01…FX-V04` e `FX-I01…FX-I10`. H-1 ha creato i file eseguibili e casi supplementari senza
cambiare questi ID. Il collaudo corrente esegue 32 casi dichiarati e 13 gruppi di contratto e
integrazione. Maturità meccanica tipica: `G2/O1/E2`; il warning LOCK resta E1; nessun E3.

~~La salute globale resta separata: `typecheck`, H-1, lint e Vitest fuori `docs/Archives` sono verdi;
`npm run validate` e `npm test` globali falliscono perché ESLint/Vitest scoprono materiale storico
in `docs/Archives`. È debito di discovery da pacchetto workspace separato, non regressione H-1.~~

> **RETTIFICATO 21-08-26 — `SK-0` chiuso.** Il debito **non era** «da pacchetto workspace separato»:
> erano **tre righe di configurazione**. `.eslintrc.cjs` e `vitest.config.ts` non escludevano
> `docs/Archives/**`, e `scripts/check-doc-paths.mjs` escludeva `Archivio` (italiano) ma non
> `Archives` (inglese), mentre le due cartelle coesistono nel repo.
>
> **Dopo la correzione:** `npm run lint` **exit 0** (erano 363 problemi e 17 errori, tutti in
> `docs/Archives`); `npm run test` **163 file / 1346 test, exit 0**; `npm run validate` **exit 0**
> per la prima volta; `validate:docs` da **3 886** a **17** path rotti.
>
> **Perché sblocca il resto:** ora esistono cancelli verdi da mettere in CI, e la CI è l'unico
> enforcement indipendente dalla superficie (`SK-5`). Finché erano rossi, `E` non poteva superare 2.
> Fonte: `docs/Sessioni di lavoro/21-08-26/Report-consulenza-esterna-fable-mss-21-08-26.md` §2.1.

### H-1.1 — correzione della chiusura H-1

La revisione indipendente successiva ha dimostrato che il verde H-1 non proteggeva ancora la
promessa append-only e accettava assertion vuote, coppie versione incrociate e modalità esplicite
invalide. H-1.1 non avvia WP-1 e non introduce store, retention o E3.

Perimetro autorizzato:

- confronto canonico `HEAD` → staged per record finalizzati, inclusi delete e rename;
- entità Persona/Sistema/Output complete e controlli numerici coerenti;
- coppie schema/revisione esatte e modalità report strette;
- amendment verso storia Git delimitata, unica e finalizzata;
- manifest legato a protocollo e 14 ID congelati, con `FX-V01-report` supplementare;
- parità core/CLI/stop/pre-commit e suite senza scritture sul working tree.

Stato finale locale: 41 casi fixture e 19 gruppi di contratto/integrazione verdi; 14/14 moduli
controllati con `node --check`; typecheck, lint e 1346/1346 Vitest fuori Archives verdi. Il globale
`npm run validate` resta rosso sul debito preesistente Archives; `git diff --check` globale resta
rosso su una blank line estranea in Comunicazione, mentre il perimetro H-1.1 è pulito. H-1.1 è
`CHIUSO NEL DISEGNO`, non osservato su piloti reali e non autorizza automaticamente WP-1.

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
| `IDEA-MSS-09` | **conservazione obbligatoria** del materiale self_report di qualità che definisce la persona (verbatim in `_lavoro`, non solo sintesi in report) — emerso S-C 09-08-26 (account biglietto) | formalizzare in CHIUSURA/contratto capsula / prompt Conduttore; decisione Matteo + Meta; prima che le sedute idiografiche ripetano la perdita |
| `IDEA-MSS-10` | **studio delle risposte** fantasticazione + **meta-log dei metodi di studio** usati dagli agenti (pacchetto `studio-risposte-fantasticazione` v0) — bozza 10-08-26 · **primo caso studio S-G fatto** (valutazione conduttore C1–C12, passa con debito C7) · filtro Challenge conflitto puro promosso in TIPO/prompt | secondo caso-studio e/o riuso L6; espandere tag solo se ≥2 usi; non apre WP-1 |

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
| 09-08-26 | Checkpoint locale WP-0.1 + bump vivo a `0.1.1` / freeze-2 / protocollo `1.0.1` per validator H-1; storia non riscritta | sessione H-1 |
| 09-08-26 | Prima implementazione H-1 verde meccanicamente; la chiusura dichiarata è poi invalidata da cinque falsi positivi | revisione fredda H-1 |
| 09-08-26 | H-1 richiuso nel disegno dopo hardening: 5/5 controprove respinte, 32 fixture, 13 gruppi integrativi, anti-drift e manifest pre-commit | `Report-hardening-h1-metaskillsystem-09-08-26.md` |
| 10-08-26 | Chiusura H-1 invalidata; aperto H-1.1 dopo 17 controprove rosse. Fix mirato verde su 41 fixture e 19 gruppi; gate finali in corso | sessione H-1.1 |
| 10-08-26 | H-1.1 chiuso nel disegno: append-only HEAD/staged, assi/versioni/modalità, storia e frozen protetti; gate locali verdi, limiti globali registrati | `Report-hardening-h1-1-metaskillsystem-10-08-26.md` |
| 10-08-26 | H-1.3 = **PASS_CON_RISERVE** (review post-remediation); WP-1 resta **NON INIZIATO / NO-GO**; track baseline L5+hook autorizzato (path invariati); G5 non PASS | `Report-revisione-indipendente-h13-post-remediation-10-08-26.md` · `Report-track-commit-h13-l5-pass-con-riserve-10-08-26.md` |
| 21-08-26 | Plan directory/export/sandbox prodotto (zero move); D9 decisa ed eseguita; D6/D7/D8/D10 aperte | `Report-plan-directory-export-sandbox-mss-21-08-26.md` |
| 21-08-26 | **Consulenza esterna indipendente** — prima famiglia di modello diversa da Cursor/Codex. Prove: test a freddo superato (stato ricostruito in 2 file); 5 contraddizioni vive fra owner; 3 bypass dell'enforcement riproducibili; 3 cancelli globali rossi per 3 righe di configurazione | `MAPPA-MSS-consulenza-esterna-21-08-26.md` · `Report-consulenza-esterna-fable-mss-21-08-26.md` |
| 21-08-26 | **Target dello scheletro** acquisito da Matteo in §16; aperti `SK-0`…`SK-10` in §4-bis; intestazione di questo file rettificata (era ferma a `H-1.1`) | `STRATEGIA-scheletro-mss-21-08-26.md` · decisione Matteo in chat 21-08-26 |
| 21-08-26 | **Decisioni `D11`–`D15`** prese da Matteo e registrate in §16.4 | `Report-consulenza-esterna-fable-mss-21-08-26.md` |
| 21-08-26 | **`SK-0` CHIUSO E OSSERVATO** — 3 righe di configurazione (`.eslintrc.cjs`, `vitest.config.ts`, `scripts/check-doc-paths.mjs`). `npm run validate` **exit 0 per la prima volta**; lint da 363 problemi a 0; test 1346/1346; link rotti da 3 886 a 17. Rettificata la diagnosi di §6 («debito di discovery da pacchetto workspace separato») | prove eseguite in seduta `039` |
| 22-08-26 | **`SK-6` costruito** (`mss:query`, sola lettura, 941 righe): interroga le 42/43 capsule esistenti, risponde alle tre domande di chiusura. Risultato principale: `independently_verified` mai usato in 42 sedute, ma review indipendenti risultano davvero eseguite (6 controlli/3 sedute col criterio iniziale). Non dichiarato chiuso: decisione di Matteo | `Report-sk6-mss-query-22-08-26.md` |
| 22-08-26 | **Revisione trova 2 difetti in `SK-6`, entrambi rettificati** senza riscrivere record `final`: (1) la capsula del report dichiarava la seduta chiusa alle 13:45:54 mentre il report è stato esteso alle 22:16 con un secondo segmento — corretto con un record `amendment` in coda alla capsula, non una riscrittura; (2) il criterio revisori leggeva solo `controls[].esecutore` e perdeva un revisore la cui stringa finiva in `-review` — spostato su `recorded_by.role` (campo con semantica sua, mai una stringa di comando): misura del 22-08-26 ~22:44, il numero passa da **6 controlli/3 sedute** a **19 controlli/5 sedute** — numero mobile (cresce a ogni seduta), non un valore fisso; zero falsi positivi verificati stampando l'elenco completo degli attori catturati | `Report-fix-sk6-22-08-26.md` |
| 22-08-26 | **Contro-revisione indipendente (Codex) su `SK-6` atterra nel working tree**, con 3 `amendment` propri: conferma 5/6 affermazioni della prima rettifica, ne contraddice 1 (il criterio di quel momento, poi già superato), e marca due annotazioni della capsula `SK-6` `independently_verified`/`contradicted`. Trova che questa marcatura resta invisibile a `mss:query` (il lettore non applica la catena degli `amendment`, mostra 0/0 dove la vista effettiva è 1/1) e che il numero «19/5» era già stato congelato in questo file come presente — **entrambi rettificati**: la riga `SK-6` sopra non fissa più il numero, e `mss:query -- --verifica` ora conta gli `amendment` nel corpus e dichiara il limite invece di dire «mai usato» su valori che un `amendment` già usa. Corretta anche una colonna troppo stretta (id di 36 caratteri attaccato al numero, stessa classe del bug `nessuno4` di `--costo`) con una larghezza calcolata sui dati, non a memoria | `Report-fix-sk6-22-08-26.md` · `Report-revisione-indipendente-sk6-codex-22-08-26.md` |

## 15. Prossimo task atomico

`WP-1` resta **NON INIZIATO** e **NO-GO** finché Matteo non lo apre in chat dedicata.
H-1.3 è **PASS_CON_RISERVE** (non PASS pulito). `SEP-G5` **non** è PASS.

**P0 (23-08-26) — CONCLUSO COME ASSENZA:** ricerca del fix `SK-7` dichiarato → **nessun** commit,
branch, stash, PR o patch recuperabile; D2/D3 riprodotti su `46b8bca` (`parseCheckSpec` spezza al
primo `:`; `--check "x::node --version"` può registrare `pass` falso). Codice capsule **non**
reimplementato. Report:
[`Report-p0-sk7-assenza-fix-23-08-26.md`](../Sessioni%20di%20lavoro/23-08-26/Report-p0-sk7-assenza-fix-23-08-26.md).

**Prossimo task atomico — gate di Matteo:** (A) consegnare il patch/commit del fix dichiarato, oppure
(B) autorizzare esplicitamente la reimplementazione di D2/D3 + privacy + test. Finché manca A o B,
non ripartire «come se» il fix esistesse.

**P1 (chiuso 23-08-26):** D1 parità pre-commit/CI su `requireCapsule: true`; D4 denominatori
calcolati in `mss:query --fail`; D5 celle owner §4-bis/allineamento `mss:status`. Report:
[`Report-p1-d1-d4-d5-23-08-26.md`](../Sessioni%20di%20lavoro/23-08-26/Report-p1-d1-d4-d5-23-08-26.md).

**P2A (in corso):** manuale operativo + puntatori ingresso/viste — [`MANUALE_OPERATIVO_MSS_V0.md`](MANUALE_OPERATIVO_MSS_V0.md).
Non implementa export motore né bootstrap in repo nuova.

**P2B:** export/bootstrap riproducibile del motore MSS; intervista iniziale; prova agente
freddo fuori da questo albero. Restano fuori P2: hook Claude, guard PROD, generatore viste (`D14`),
P3 `mss:move`, P4 copertura sicurezza.

### Prossimo task atomico dal 24-08-2026 — apertura del ciclo **orchestratore**

Revisione esterna del 24-08: [`Report-revisione-esterna-stato-mss-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-revisione-esterna-stato-mss-24-08-26.md).
Sette difetti su nove dell'audit 23-08 risultano chiusi e coperti da test **che nominano il difetto**.

**Mandato vivo:** [`PROMPT_ORCHESTRATOR_MSS_24-08-26.md`](PROMPT_ORCHESTRATOR_MSS_24-08-26.md) —
sostituisce `PROMPT_PROSSIMO_ESECUTORE_MSS_23-08-26.md`, che resta agli atti come storia di `P0`/`P1`/`P2A`.
Definisce che cosa significa **100% della struttura** (una prova eseguibile per ciascuno degli otto
requisiti `R1`–`R8` di §16.2), raggruppa i difetti aperti in **cinque mandati** e fissa il budget di
documentazione per mandato.

| Mandato | Copre | Perché in quest'ordine |
|---|---|---|
| `M-A` protezioni | guardia PROD non tracciata e non testata, hook Claude senza test, cablaggio non riproducibile | unica falla con conseguenze su **dati reali**; fix piccoli |
| `M-B` cancelli | `npm run validate` ibrido → `validate:app` / `validate:mss:all` / `validate`; tag di ripristino (`SK-1`); freno all'allowlist (`D21`) | risparmio token per ogni agente futuro; chiude la metà aperta di `SK-5` |
| `M-C` attrezzi che non mentono | **`N1`** (nuovo): `mss:capsule` esce 0 e **scrive** una capsula che `validate:mss` poi rifiuta — controlla la completezza dei giudizi, non la validità. Più il generatore viste (`D14`) | `D18`: l'attrezzo **importa** la regola del `core`, non la riscrive |
| `M-D` portabilità | `P2B` | `R8` |
| `M-E` attrezzi mancanti | `mss:move` (`SK-9`/`R6`, oggi a zero), poi `mss:review` (`SK-3`) | strutturali, ultimi |

`M-A`+`M-B` vanno affidati **insieme** a un unico esecutore: otto fix piccoli, un solo report, una
sola capsula. `M-C` non si accorpa a nulla e vuole un revisore di famiglia diversa.

**Rettifica documentale eseguita il 24-08 (`V2`/`V3`):** la tabella di stato in
`Senior-Eval-Pack/ROADMAP_V0.md` è stata **rimossa**, non corretta — aveva accumulato tre stati
diversi di `SK-7`; i conteggi di test cablati in `Senior-Eval-Pack/HANDOFF_SENIOR_V0.md` sono stati
sostituiti dal comando che li produce. È un tampone: torneranno alla prima seduta produttiva finché
`D14` resta aperto.

**Storico di questa sezione, per non riaprire strade già chiuse:**

- ~~plan directory/export/sandbox~~ → prodotto (seduta `038`, zero move), poi **congelato** da
  `D15`: le decisioni `D6`, `D7`, `D8`, `D10` restano **aperte e congelate**, perché riordinare
  l'albero prima di avere gli attrezzi ripeterebbe il costo misurato del primo move (≈1 741 righe
  per un file).
- ~~decisione di Matteo su `SK-0`~~ → **presa ed eseguita** il 21-08-26. `SK-0` è `CHIUSO E
  OSSERVATO`: erano tre righe di configurazione, e `npm run validate` è andato **exit 0 per la
  prima volta**.
- ~~`SK-6` (`mss:query`)~~ → **costruito e revisionato** il 22-08-26, da due famiglie di modello,
  poi dichiarato **CHIUSO** da Matteo con `D16` il 23-08-26.

### Decisioni di Matteo — 23-08-2026 (`D16`–`D24`, CHIUSE)

| ID | Decisione | Scelta | Conseguenza operativa |
|---|---|---|---|
| `D16` | `SK-6` è chiuso? | **CHIUSO** | l'attrezzo esiste, i cancelli sono verdi, una revisione indipendente di famiglia diversa lo ha esaminato, la vista effettiva è implementata. §4-bis aggiornato |
| `D17` | Il vincolo di cambio-famiglia di §16.3 | **resta AVVISO, non gate** | confermato `D13`: una review di famiglia uguale **non invalida** la validazione. È **consigliata, non obbligatoria**. Si riapre solo se emergono problemi reali |
| `D18` | La duplicazione `core.mjs`/`query.mjs` | **eliminata, non gestita** | `applyAmendmentsView()` è **esportata** da `core.mjs` e `query.mjs` la **delega**. Principio generale dichiarato da Matteo: *«dobbiamo snellire, non duplicare»* — vale per ogni attrezzo futuro |
| `D19` | Pubblicazione del lavoro | **push, repo pulita** | i commit locali di `SK-6` e la vista effettiva vanno su `env/test` |
| `D20` | Chiusura del ciclo 23-08 | **push eseguito, `SK-4`+`SK-5`+`SK-11` CHIUSI** | i tre commit (`d1598b6`, `88aa5a1`, `7e96fb1`) sono su `origin/env/test`; la run reale `32652259771` ha il job `mss` **verde** — è il gate `F2`, non più una simulazione locale. Con quello Matteo ha dichiarato chiusi i tre pacchetti |
| `D21` | Il rosso documentale del job `ci` | **si azzera, non si tollera** | `validate:docs` esce 1 con **26** path rotti in CI (17 in locale). Una spia rossa permanente non è più una spia. Mandato dedicato: [`Prompt-fix-17-path-docs-23-08-26.md`](../Sessioni%20di%20lavoro/23-08-26/Prompt-fix-17-path-docs-23-08-26.md). Vietato azzerare il contatore ammorbidendo il controllo |
| `D22` | Fix della regex dell'hook di pre-commit | **accettato** | il controllo usa la regex report condivisa e non perde i report in sotto-cartella; il fix era già nel commit `7436def`. Fonte: [`Report-revisione-skill-chiusura-e-hook-23-08-26.md` §7](../Sessioni%20di%20lavoro/23-08-26/Report-revisione-skill-chiusura-e-hook-23-08-26.md#7-decisioni-matteo-23-08-26-sera--implementate) |
| `D23` | Contenuto di `Q1` alla chiusura | **path del mandato + revisione/hash + delta della chat** | il mandato già salvato non viene ricopiato; il verbatim resta obbligatorio solo per i messaggi di Matteo che non esistono in alcun file. Effetto: meno duplicazione senza perdere la provenienza. Fonte: stesso report §7 + `CHIUSURA_SESSIONE.md` §11 |
| `D24` | Comportamento dell'hook senior a controlli verdi | **silenzio condizionato** | con domande complete e validatore MSS verde l'hook tace; parla soltanto se una risposta manca o la capsula è davvero rossa. Effetto: niente turno «mente fredda» duplicato. Fonte: stesso report §7 + `.claude/hooks/fine-sessione-senior.mjs` v6 |
| `M3` | Chiusura `SK-7` | **CHIUSO** | Matteo autorizza la chiusura dopo controverifica indipendente: D2/D3, privacy append-only e riferimenti pubblicabili sono provati; `D17` resta un avviso, non un gate. |

**Principio `D18`, da applicare a tutti i pacchetti `SK-*`:** un attrezzo che ha bisogno di una regola
già scritta **la importa**. Se non è esportata, si esporta. Due implementazioni della stessa regola
sono un difetto peggiore di quello che la regola governa — anche quando il perimetro di un mandato
sembra imporle: in quel caso il mandato va allargato, non aggirato con una copia.

### Stato della raccomandazione precedente

La sequenza raccomandata è stata consumata: `SK-4`, `SK-11` e `SK-5` sono chiusi; `SK-7` è stato
costruito dopo il lettore, come impone `D12`, e il report proprietario è arrivato, ma resta aperto
per la rettifica documentale mirata e la decisione `M3`. Questa seduta **non apre né raccomanda un
nuovo pacchetto**: prima vengono pubblicazione autorizzata e verifica della CI reale.

### Un dato nuovo da mettere agli atti (non una richiesta di riaprire `D13`)

Il 22-08-26 una famiglia di modello **diversa** (OpenAI Codex) ha revisionato un lavoro di autore
Anthropic e **ha trovato difetti che l'autore non aveva visto**, incluso quello strutturale del
punto 3. Su cinque review condotte prima di quella, **una sola** aveva davvero cambiato famiglia.
È la prima misura reale di quanto vale il vincolo che `D13` ha lasciato come avviso.

**Gate del prossimo task:** nessun move · nessun path rewrite · nessuna sovradichiarazione
`SEP-G5`/`WP-1`/`H-1.3` pulito · nessun nuovo pacchetto senza decisione di Matteo · nessun push
senza sì esplicito. `REPORT_PATH_RE` resta una fonte condivisa con cinque consumatori: ogni sua
modifica futura deve dichiarare prima l'intero elenco.

---

## 16. Target dello scheletro — dettato da Matteo, 21-08-2026

> **Perché questa sezione esiste qui.** È direzione di `SYS-1`, e `SYS-1` ha un solo proprietario.
> Metterla altrove creerebbe il secondo owner che il vincolo §2.7 vieta.

### 16.1 Le parole di Matteo

> *«Lo scopo è creare uno scheletro perfetto che stia in equilibrio aiutando agenti con le automazioni
> necessarie a evitargli eccessivo consumo di token.»*
>
> *«Una delle funzionalità migliori di questo sistema deve diventare che: qualsiasi lavoro fatto da
> agente è un fatto utile per raccogliere tutte le informazioni di cui lo skill system necessita
> (senza inventare contenuti). Così un agente può valutare un approccio diverso a un problema,
> cambiando metodo o strategia o suggerendo approccio con nuovo modello.»*
>
> *«Gli agenti devono essere stimolati dallo scheletro dello skill system a raccogliere i dati
> necessari alla crescita, chiedendo specifiche a utente e interazioni, in base al tipo di seduta
> che l'utente avvia.»*
>
> *«I criteri di MSS sono qualsiasi dato che possiamo raccogliere da una chat, al fine di poter
> migliorare esperienza utente, esperienza agente, ed efficienza MSS.»*
>
> *«Eliminiamo ridondanze e centralizziamo sempre di più ogni chat a un contesto sempre più mirato,
> in un sistema sempre più grande ma ben connesso e strutturato per agevolare il lavoro di agenti.»*

**Attribuzione:** testo di Matteo, trascritto verbatim dalla chat del 21-08-2026 e riordinato per
temi senza aggiunte. La strutturazione in requisiti `R1`–`R8` è dell'agente consulente.

### 16.2 Gli otto requisiti che ne discendono

| # | Requisito | Criterio di soddisfazione |
|---|---|---|
| `R1` | La raccolta dati è un **sottoprodotto** del lavoro, non un compito in più | l'agente non scrive i fatti che la macchina già possiede |
| `R2` | **Niente contenuti inventati** | ogni campo automatico proviene da git, dall'esito di un comando o dall'orologio |
| `R3` | Le automazioni **fanno risparmiare** token | conoscere lo stato costa un comando, non dieci file |
| `R4` | Lo scheletro **stimola** in base al tipo di seduta | il tipo di seduta determina quali dati cercare e quali domande porre all'utente |
| `R5` | I dati raccolti sono **interrogabili** | esiste un comando che risponde a domande sulle capsule |
| `R6` | Spostare o rinominare costa **un comando** | i riferimenti si aggiornano da soli e la suite resta verde |
| `R7` | A fine lavoro l'agente **si autorevisiona con una macchina** | le domande di chiusura sono confrontate col diff reale |
| `R8` | Il **bootstrap in una repo nuova** è una procedura | intervista iniziale + manuale utente |

### 16.3 Il modello delle sedute

Una seduta **deep** non entra in una chat sola: è una catena di chat con passaggio di consegne.

`Preparatore` → `Pilota` (esegue una cosa e la prova) → `Senior` (legge i dati, propone strategia,
non esegue) → `Revisore` (famiglia di modello **diversa**) → `Matteo` (decide il gate).

**Vincolo di indipendenza proposto, da approvare:** una review cambia lo stato di verifica da
`self_report` a `independently_verified` **solo se** il revisore gira su una famiglia di modello
diversa da quella di chi ha scritto. Il campo `recorded_by.agent_runtime.provider` esiste già nella
capsula: il controllo è meccanico. Motivo: su cinque review condotte finora, **una sola** ha davvero
cambiato famiglia di modello.

**Vincolo sull'handoff:** l'handoff dev'essere **generato**, non redatto. Un documento generato non
può diventare stale: o è corretto, o non gira.

### 16.4 Decisioni di Matteo — 21-08-2026 (CHIUSE, non riaprire senza nuova evidenza)

| ID | Decisione | Scelta | Conseguenza operativa |
|---|---|---|---|
| `D11` | Da dove si parte | **`SK-0` subito** | eseguito e chiuso in giornata: tre righe di configurazione; `npm run validate` verde per la prima volta |
| `D12` | Primo attrezzo dopo `SK-0` | **`mss:query`** | si costruisce prima il *lettore* dei dati, e gira sulle **41 capsule già esistenti**. Se da quelle non esce nulla di utile, lo si scopre spendendo un comando, prima di automatizzare la raccolta |
| `D13` | Regola sull'indipendenza del revisore | **sì, ma come avviso — non bloccante** | il validator **segnala** quando writer e revisore condividono la famiglia di modello, e non blocca. `E = 1/2`, non `E = 3`. Scelta consapevole: non sempre è disponibile una seconda famiglia. La riserva `R1` resta **aperta** e va citata come tale |
| `D14` | Viste che si aggiornano a mano | **`ROADMAP`, `HANDOFF` e indice dei report diventano generati** | un documento generato non può diventare stale: o è corretto o non gira. Chiude i debiti previsti `SEP-D06` e `SEP-D07` |
| `D15` | `D6`, `D7`, `D8`, `D10` del plan directory | **congelate** su raccomandazione del consulente | riordinare l'albero prima di avere gli attrezzi ripeterebbe il costo misurato del primo move |

**Nota di onestà su `D13`.** La scelta «avviso» lascia l'indipendenza a enforcement debole. È una
decisione legittima e consapevole di Matteo, **non** una svista: va però ricordato che finché la
regola non blocca, una review fatta dallo stesso modello continuerà a poter essere registrata come
`independently_verified` se chi scrive lo dichiara. L'avviso rende visibile il caso, non lo impedisce.

### 16.5 Che cosa questa sezione NON autorizza

Non apre `WP-1`. Non sana `H-1.3`. Non dichiara `SEP-G5`. Non autorizza move, push o modifiche a
`docs/_lavoro/`. Ogni pacchetto `SK-*` di §4-bis resta `NON INIZIATO` finché Matteo non lo apre.
