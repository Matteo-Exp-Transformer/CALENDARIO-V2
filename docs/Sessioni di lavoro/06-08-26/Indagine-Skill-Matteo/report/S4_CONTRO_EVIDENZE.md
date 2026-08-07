# S4 — Contro-evidenze e falsificazione

> **Profilo:** Verifica | Meta — **questa ondata lavora contro le altre** · **Modalità:** deep
> **Data report:** 07-08-26
> **Ingresso:** le Sezioni 4 dei 39 report di mining — **352 contro-evidenze**, ricontate da me
> (il totale dichiarato «≈352» è **riproducibile al singolo**: vedi §1.3) · più le 153 skill L3/L4
> consegnate da `S3 §9`
> **Uscita:** **153 verdetti** — 125 REGGE · 19 RIDIMENSIONATA · 9 NON REGGE. L'albero perde
> **9 L4 su 40** e **7 L3 su 113**
> **Precondizione (regola comune 1):** verificata — `S1_CATALOGO_DECISIONI.md`,
> `S2_AGENCY_E_CORREZIONI.md` e `S3_ALBERO_SKILL_E_TIMELINE.md` esistono tutti e tre (chiusi il
> 07-08-26). Nessun file grezzo dei corpora è stato riaperto.

---

## §0 — Che cosa misura questa ondata, e che cosa non misura

**Questa ondata non misura quanto Matteo vale. Misura quanto regge il MATERIALE su di lui.**

Va detto prima di qualunque verdetto, perché senza questa premessa i verdetti si leggono al
contrario di come vanno letti.

Le contro-evidenze dei 39 report **sono state scritte dagli stessi agenti che dovevano
compiacerlo**. È lo stesso soggetto che raccoglie le prove a favore e le prove contro, nello stesso
documento, nello stesso turno di lavoro. E il testo delle loro risposte nei transcript è oscurato:
**19.198 righe su 22.862** contengono `[REDACTED]` (piano §2.1). Quando un agente lo ha corretto,
quella frase non è leggibile.

Ne discendono due regole di lettura che valgono per tutte le 153 righe di questo report:

| Verdetto | Che cosa vuol dire davvero | Che cosa **non** vuol dire |
|----------|---------------------------|---------------------------|
| **REGGE** | *nessuno ha trovato il contrario in questo materiale* | che la skill sia vera |
| **NON REGGE** | *in questo materiale la prova non c'è, o è contraddetta* | che la skill sia falsa: **può essere vera e semplicemente non documentata** |

Chi legge il dossier finale deve avere questa tabella davanti **prima** dei verdetti, non in nota.
Un `NON REGGE` su `menu-qr-nav` non dice che non sappia navigare un menu digitale: dice che in
quattordici report nessuno ha scritto un ID accanto a quell'affermazione.

**Una terza cosa, che riguarda me.** Le contro-evidenze che uso sono state selezionate dagli stessi
agenti. Quello che *non* hanno scritto, io non posso vederlo: il mandato mi vieta di riaprire i
corpora. Quindi **le 352 contro-evidenze sono un pavimento, non un soffitto**, esattamente come le
109 fusioni di S1. Dove ho cercato e non ho trovato, ho scritto «cercata, non trovata **in questo
perimetro**» — e il perimetro è la parte che conta di quella frase.

---

## §1 — Che cosa è entrato, e come si riconta

### §1.1 — La Sezione 4 non ha due forme: ne ha cinque

Il mandato avvertiva che la Sezione 4 è mista — tabelle e liste numerate — e che un estrattore che
legge solo le tabelle perde ondate intere. **È vero, e il censimento meccanico
(`survey_sezione4.py`) mostra che è peggio: le famiglie di tabella sono quattro, non una.**

| # | Forma | Header | Ondate | Righe |
|---|-------|--------|--------|-------|
| A | **TABELLA 4 col, ID nativo** | `# \| Tipo \| Cosa \| Fonte` | M1 | 23 |
| B | **TABELLA 4 col, ID nativo** | `# \| Cosa \| Impatto \| Fonte` | A1 · A11 | 26 |
| C | **TABELLA 4 col, ID nativo** | `ID \| Cosa \| Perché conta \| Fonte` · `…Perché indebolisce…` | B1 · B3 · D2 · E1 · E2 · H4 · J1 | 65 |
| D | **TABELLA 3 col, ID nativo** | `ID \| Cosa \| Fonte` | H2 · H3 | 18 |
| E | **TABELLA 3 col, SENZA ID** | `Claim suggerito dal corpus \| Contro-evidenza \| Fonte` | C1 · C3 · C4 | 23 |
| F | **ELENCO NUMERATO in prosa** | nessun header | M2 M3 M4 · A2 A3 A4 A5 A6 A7 A8 A9 A10 · B2 C2 C5 D1 F1 · G1 G2 G3 H1 H5 I1 I2 | 197 |

**Le forme B ed E non erano censite dal mandato, e sono quelle che avrebbero fatto più danno.**

- La forma **B** (`# | Cosa | Impatto | Fonte`) è di **A1 e A11**: un estrattore che cercasse
  `Tipo` come seconda colonna, seguendo il modello di M1, avrebbe perso **26 righe** delle due
  ondate che aprono e chiudono la linea A.
- La forma **E** (`Claim | Contro-evidenza | Fonte`) è di **C1, C3 e C4**: **tre colonne, e la
  prima non è un ID**. Un estrattore che pretendesse quattro colonne, o una prima colonna
  `#`/`ID`, avrebbe perso **tre ondate intere e 23 righe** senza nessun errore visibile. Ed è la
  forma più interessante del corpus, perché è l'unica **scritta come falsificazione esplicita**:
  ogni riga enuncia un *claim* e poi lo abbatte. Le tre ondate che l'hanno usata sono le stesse che
  dichiarano zero L3/L4 attribuibili a Matteo.

**Regola di famiglia accettata, dichiarata:** dentro il blocco `## Sezione 4` … `## Sezione 5`, è
una contro-evidenza *(a)* ogni riga di una tabella il cui header appartiene a una delle cinque
famiglie sopra, oppure *(b)* ogni item di primo livello di un elenco numerato. Tutto il resto è
satellite: letto, non contato (§1.4).

### §1.2 — Come sono state identificate le righe

**Gli ID nativi coprono meno di un terzo del corpus.**

| | N | % |
|---|---|---|
| righe con **ID nativo** scritto dal report (`C01`…`C23`, `CE1`…`CE14`, `B1-C10`, `D2-C07`, `H4-C03`) | **128** | 36,4% |
| righe **senza nessun ID** (tutti gli elenchi numerati + la forma E) | **224** | 63,6% |

Le 224 righe senza ID non sarebbero citabili una per una — e un report di falsificazione che non
può citare la propria prova non serve a niente. **Ho quindi assegnato a ogni riga un ID di
posizione, `<ondata>-§4-<n>`**, dove `n` è l'ordine di comparsa nella Sezione 4. È l'ID che uso in
tutto questo report.

> ⚠️ **`M1-§4-20` è mio, `C20` è di M1.** I due si corrispondono (la ventesima riga della Sezione 4
> di M1 porta l'ID nativo `C20`), ma **solo M1, A1, A11, B1, B3, D2, E1, E2, H2, H3, H4 e J1 hanno
> ID nativi**. Chi ricontrolla trova la corrispondenza completa nella colonna `id_nativo` di
> `contro_normalizzate.tsv`.

### §1.3 — I conteggi per lotto: e questa volta il totale dichiarato torna

| Lotto | Report | Contro-evidenze | da TABELLA | da LISTA | Dettaglio per ondata |
|-------|--------|-----------------|-----------|----------|----------------------|
| **L1** | M1–M4 | **52** | 23 | 29 | M1 23 · M2 8 · M3 9 · M4 12 |
| **L2** | A1–A11 | **115** | 26 | 89 | A1 14 · A2 10 · A3 10 · A4 9 · A5 10 · A6 10 · A7 8 · A8 12 · A9 9 · A10 11 · A11 12 |
| **L3** | B1–B3, C1–C5, D1–D2, E1–E2, F1 | **107** | 72 | 35 | B1 12 · B2 5 · B3 6 · C1 7 · C2 7 · C3 8 · C4 8 · C5 8 · D1 7 · D2 14 · E1 7 · E2 10 · F1 8 |
| **L4** | G1–G3, H1–H5, I1–I2, J1 | **78** | 30 | 48 | G1 9 · G2 7 · G3 6 · H1 6 · H2 8 · H3 10 · H4 6 · H5 7 · I1 6 · I2 7 · J1 6 |
| | **Totale** | **352** | **151** | **201** | |

**Il totale dichiarato dal tracking è «≈352». Il mio conteggio è 352. Scarto: zero.**

Questo va detto per intero, perché è l'esatto contrario di quello che è successo a S3: là il
tracking dichiarava **568** righe di skill signal e il numero vero era **477**, con uno scarto di
−91 mai ricostruito. Qui il numero regge. **Non l'ho inseguito**: l'estrattore è stato scritto
prima di guardare il totale, la regola di famiglia è dichiarata sopra e nessuna riga è stata
aggiunta o tolta per far quadrare. Se qualcuno rifà l'estrazione con un criterio diverso — per
esempio contando i sotto-punti degli elenchi, o includendo le satelliti — otterrà un numero
diverso, e il criterio con cui io ho ottenuto 352 è nel §1.1.

> **Perché conta che questo torni e quello di S3 no.** Vuol dire che il numero «568» non era una
> stima approssimativa dello stesso tipo: era ottenuto in un altro modo, che nessuno ha
> ricostruito. La lacuna **L-S3-1** resta aperta e resta di metodo, non di conteggio.

**Nessun lotto è stato rifatto:** tutti e quattro sono tornati al primo passaggio.

### §1.4 — Le satelliti dentro la Sezione 4: 4 tabelle, 25 righe

Lette, non contate. Ma due sono materiale primario e le uso:

| Ondata | Header | Righe | Che cosa ne faccio |
|--------|--------|-------|--------------------|
| **H2** | `Tema \| Cosa dice A (peso 3) \| Cosa dicono le sue parole (H) \| Verdetto` | **8** | ⭐ **è la tabella «Divergenze esplicite vs A1/A2» dell'input §5a, con i verdetti già scritti.** Usata per intero in §6 e §11 |
| **D1** | `# \| Scelta CB-old \| Ipotesi \| Nota` (Keep/Flip K1–K10) | 10 | dichiarata da D1 stesso «ipotesi per S3, non fatti»: la uso solo per il rate limit (K9), che tocca il conflitto N-1 |
| A2 | `Ruolo \| Chi \| Evidenza` | 3 | «chi propone / chi tara»: usata in §6, attribuzione |
| A3 | `Ruolo \| Chi \| Evidenza` | 4 | idem |

**Le 8 righe di H2 erano lavoro finito e mai usato.** Sei sono già state consumate da S1 come
conflitti importati (I-1…I-6); **due no**, e sono le due che restano aperte: il prezzo del
carosello e la sovra-narrazione dell'overlay ingredienti. Le tratto in §11.

### §1.5 — Il lavoro già fatto che ho raccolto prima di analizzare

Il mandato lo mette al punto 0 perché saltarlo lo perde. Ecco che cosa ho preso e dove lo uso:

| Materiale già pronto | Dove | Dove lo uso |
|----------------------|------|-------------|
| Tabella «Divergenze esplicite vs A1/A2» (8 righe, verdetti scritti) | H2 §4 satellite | §6, §11 |
| **7 divergenze report ↔ git/DB** | J1 **§5.b** — sottosezione fuori schema, **dopo** la Sezione 5 | §6, §7, §11 |
| Catalogo piani abbandonati: **23 completed su 113**, ≥45 con ≥3 todo pending | I1 §4.1 | §3 (R01, R04, R05), §7 |
| Catalogo piani giochi/trading: **28 su 33** senza tracking | I2 §4.1 | §3, §7 |
| Tabella contro-evidenze pronta C01–C23 | M1 §4 | tutto §3 e §4 |
| **44 rifiuti di Matteo** indicizzati | S1 §6 | §3 (R01), §9 |
| Le 14 A→M di M1 che non sono A→M · le 6 di C1 che sono peer review | S2 §0.1 | §5, §6 |
| Le 7 lacune L-S2-* | S2 §11.1 | §11 |

---

## §2 — Come si legge un verdetto

La scala §3.4 del piano definisce **L4** così: «*la sua decisione è diventata regola **riusata***»,
con prova «*decisione + il file di regola che ne è nato*». Sono **tre** componenti, non una:

**(a)** la decisione è **sua** · **(b)** esiste il **file di regola** · **(c)** la regola è **riusata**.

La contro-evidenza colpisce componenti diverse, e l'esito deve cambiare di conseguenza. Il criterio
che ho applicato a tutte e 153 le righe, dichiarato prima dei verdetti:

| La contro-evidenza colpisce… | Esito | Perché |
|------------------------------|-------|--------|
| **(c) «riusata»** — la regola esiste ma non risulta applicata, è stata aggirata, o il comportamento che prescrive non avviene | **RIDIMENSIONATA** | una regola scritta e mai usata non è una codifica: è un'intenzione |
| **(a) «sua»** — l'origine non è dimostrabile, o è di un agente, o la riga non ha nessun ID | **NON REGGE** *(o etichetta «di sistema»)* | il piano §3.2 vieta di attribuirgli decisioni che non sono sue |
| **solo l'ESITO** — la regola è stata applicata e il risultato è imperfetto | **REGGE**, con la contro registrata | l'imperfezione non è la falsificazione |

**Perché non declasso per esito imperfetto.** Se lo facessi, quasi tutte le 153 cadrebbero — ogni
regola del corpus ha almeno un caso in cui il risultato non è stato buono — e il significato della
scala cambierebbe a metà report. Sarebbe un errore più grande di quello che vorrebbe correggere.
**Chi non è d'accordo con questo criterio può ricalcolare tutto:** la colonna «Contro-evidenza (ID)»
di ogni riga del §3 contiene le prove, e `verdetti.py` contiene i giudizi per chiave.

**Ogni `REGGE` dichiara che cosa è stato cercato.** È un obbligo del mandato e ha una ragione: un
`REGGE` senza quella colonna è un'assoluzione per mancanza di indagine. Il controllo è meccanico e
passa: **0 righe `REGGE` su 125 sono senza la colonna «cercato»**, e **0 righe su 153 sono senza
almeno un ID**.

---

## §3 — I 153 verdetti

**125 REGGE · 19 RIDIMENSIONATA · 9 NON REGGE.** Per livello d'ingresso:

| Ingresso | REGGE | RIDIMENSIONATA | NON REGGE | Totale |
|----------|-------|----------------|-----------|--------|
| **L4** | 27 | 10 | 3 | **40** |
| **L3** | 98 | 9 | 6 | **113** |

**Che forma prende l'albero dopo:**

| Livello | Prima (S3) | Dopo S4 | Delta |
|---------|-----------|---------|-------|
| **L4** | 40 | **31** | **−9** |
| **L3** | 113 | **106** | −7 |
| L2 | 0 | **14** | +14 |
| L1 | 0 | **2** | +2 |

E le etichette persona/sistema si muovono in **entrambe** le direzioni (§9, bersaglio #3):

| | Prima | Dopo |
|---|-------|------|
| L4 **di persona** | 36 | **29** |
| L4 **di sistema** | 4 | **2** |

**Le 28 righe che si muovono, in un colpo d'occhio:**

| Ondata | Skill | Da | A |
|--------|-------|----|----|
| A6 | **limite-coperti** | L4 | **L2** |
| A2 | **privacy-docs `_lavoro`** | L3 | **L1** |
| G2 | **env-safety / test-prima-prod** | L3 | **L1** |
| M1 | Vocabolario governato + livelli libertà | L4 | L3 |
| M1 | Allineamento skill implicito | L4 | L3 |
| M1 | Mockup HTML prima di scelte UX | L4 | L3 |
| M4 | legal-vendita / pricing-posizionamento | L4 | L3 |
| M4 | product-scoping QR multipli / no content_type | L4 | L3 |
| G3 | explanation-schema / spiegamelo-semplice | L4 | L3 |
| A3 | grilletti-map / trust-levels | L4 | L3 |
| A4 | skill-alignment | L4 | L3 |
| B1 | **skill-portability** | L4 di sistema | **L4 di persona** ⬆️ |
| B1 | **domain-lexicon** | L4 di sistema | **L4 di persona** ⬆️ |
| B1 | audit-immutability / append-only | L4 (persona meccanico) | L4 **di sistema** confermato |
| B1 | compliance-lock | L4 (persona meccanico) | L4 **di sistema** confermato |
| M3 | accettazione-umana | L3 | L2 |
| G1 | hands-on-qa / acceptance-ownership | L3 | L2 |
| G1 | didactic-system / lesson-of-chat | L3 | L2 |
| H1 | plan-steering | L3 | L2 |
| A7 | masterplan-scoping / owner-gates | L3 | L2 |
| I1 | product-scoping | L3 | L2 |
| H2 | env-safety | L3 | L2 |
| A2 | env-safety / PROD-caution | L3 | L2 |
| A3 | cursor-enforcement | L3 | L2 |
| A1 | scope-control | L3 | L2 |
| A1 | menu-qr-nav | L3 | L2 |
| A1 | public-booking-ux | L3 | L2 |
| B3 | copy-discipline | L3 | L2 |

**Un dato che nessuna regola ha prodotto, ed è arrivato da solo.** Le **4 righe L3/L4 senza nessun
ID** (S3 §3.3: A1 ×3, B3 ×1) sono **esattamente 4 dei 9 `NON REGGE`**. Non l'ho deciso: ho
giudicato ogni riga sulla sua contro-evidenza, e alla fine il controllo meccanico ha mostrato che
convergono. Una riga senza ID, quando qualcuno va a cercare il contrario, non ha niente con cui
difendersi.


### R01-AGENTI — 30 righe · 24 REGGE · 6 RIDIMENSIONATA · 0 NON REGGE

| Ondata | Liv. | Skill | Verdetto | → | Contro-evidenza (ID) | Cercato / trovato |
|--------|------|-------|----------|---|---------------------|-------------------|
| M1 | L4 | Soft vs enforcement (hook > markdown) | **REGGE** | — | M1-§4-20 · A3-§4-4 · A4-§4-7 · H3-§4-9 | Quattro contro su quattro ondate diverse (una peso 1) colpiscono l'EFFICACIA, non la codifica: hook stop ×5 a vuoto, «NON ancora testato» all'installazione, `hooksPath=nul` trovato spento, hook di fine sessione che parte quando non deve. La regola è riusata — quelle cinque esecuzioni ne sono la prova. Regge come codifica, con l'efficacia in dubbio. |
| M1 | L4 | Annota ≠ codifica | **REGGE** | — | A3-§4-1 · S1 §6 M1-R8 | A3-§4-1 mostra che la regola NASCE DOPO l'errore (30-05: chiede di annotare, l'agente modifica la skill). Non la falsifica: la data. È reattiva, non a priori. Poi diventa un rifiuto esplicito e ripetuto (S1 §6, M1-R8). |
| M1 | L4 | Allineamento skill implicito | **RIDIM.** | L3 | M1-§4-4 · M1-§4-5 · A2-§4-3 | Tre contro convergenti, due delle quali scritte da M1 stesso — cioè dal file che fonda l'L4: «ripete la frase lunga perché gli agenti saltano le sezioni» (C4) e «procedura di avvio non ancora internalizzata» (C5); A2-§4-3 aggiunge il caso concreto: «l'agente implementa senza allineare skill, Matteo deve chiederlo dopo». La regola dice «non si chiede»; nei fatti chiede. Fallisce «riusata». |
| H4 | L4 | skill-authoring / controverifica | **REGGE** | — | H4-§4-3 · H4-§4-6 | La foglia più solida del corpus, e la contro-evidenza cercata non la tocca: H4-C03 dice che il processo di report «non è a prova di agente» (l'agente cancella i report), H4-C06 che sa chiudere in incompleto. Nessuna delle due nega la nascita 24-02 né il riuso. La filiazione da `critical-verification` di gennaio resta NON dimostrabile (L-S3-6): confermo il negativo di S3, non l'ho riaperto. |
| H3 | L4 | session-closure / prepara-discipline | **REGGE** | — | H3-§4-1 · H3-§4-9 · H5-§4-4 | H3-CE1 («gli agenti prepara smettono di passare checklist/tabella — lui deve segnalarlo») e H5-§4-4 («handoff frequenti per chat interrotte: orchestrazione forte, chiusura debole») indeboliscono la DISCIPLINA altrui, non la sua regola. Peso 1 su entrambi i lati: regge. |
| B1 | L4 | skill-portability (v0→progetto) | **RIDIM.** | L4 di persona | B1-§4-2 · H5-§4-4 | ⬆️ RISALE DA «SISTEMA» A «PERSONA». H5-D36 (06-07-26, MATTEO ORIGINATA, peso 1): «orientarti… skill system… completo o da completare», più H5-D34 «nuova repo… stesso identico DB». L'attribuzione che B1-C10 rimandava a H5 REGGE. Il livello resta L4, ma con la contro-evidenza di B1-C02 accanto: le OSSERVAZIONI di BHM sono un template vuoto dopo 4 giorni densi — la struttura è stata portata, non nutrita. |
| A4 | L4 | skill-alignment | **RIDIM.** | L3 | A2-§4-3 · M1-§4-5 · A3-§4-1 | Cade per la stessa ragione e con le stesse prove. Le tengo separate perché S3 le ha tenute separate, ma sono la stessa regola: chi legge non deve contarle come due conferme indipendenti. |
| A3 | L4 | area-disambiguation | **REGGE** | — | A3-§4-2 · M1-§4-1 | Le due contro sono la CAUSA della regola, non la sua smentita: il misrouting ripetuto su ≥3 agenti è ciò che l'ha fatta nascere. Cercato un misrouting successivo al gate: non trovato in questo perimetro. La regola è nei file di routing attuali (`APP_CONTEXT_SKILL` §0) ed è riusata. |
| A3 | L4 | grilletti-map / trust-levels | **RIDIM.** | L3 | M1-§4-17 · A3-§4-3 | A3-§4-3: «Motore Liv.2 fermo: 0 esiti live nelle sessioni meta 31-05 e 01-06; riparazione dichiarata ma nessuna voce Liv.2 nuova applicata». M1-§4-17 (C17) lo conferma mesi dopo: le voci Liv.2 «main»/«menù originale» restano a **0 esiti**. La mappa dei livelli di libertà è scritta e non risulta esercitata sul livello che la distingue. Fallisce «riusata» sulla metà del meccanismo. |
| A3 | L4 | session-close-split | **REGGE** | — | M1-§4-9 | M1-§4-9 (C9) mostra una precisazione a metà flusso («report finale» poi «solo commit»), che è l'uso della distinzione, non la sua confusione. La separazione è nel VOCABOLARIO e nel CLAUDE.md di progetto: riusata. |
| A2 | L4 | comm-skill-system / vocabolario | **REGGE** | — | A2-§4-4 · M1-§4-17 | A2-§4-4: «VOCABOLARIO 28-05: candidati IN ATTESA; taratura vera arriva il 29 — sistema L4 costruito prima di essere ratificato». Il sistema esiste, è governato e usato tutti i giorni (i grilletti sono nel CLAUDE.md). Regge come sistema; la parte che non regge è il livello 2, trattata sopra. |
| A2 | L4 | session-weight light/standard/deep | **REGGE** | — | A2-D34 · A2-D36 (a sostegno) — nessuna contro su 352 | CERCATA SU TUTTE E 352 LE CONTRO-EVIDENZE, NON TROVATA: nessuna tocca i tre pesi di sessione. Regge su due soli ID (A2-D34, A2-D36), entrambi di peso 3 e della stessa ondata. È una regola che sopravvive fino a oggi — la usa questo stesso prompt («Modalità: deep»). **Prova fragile per fonte unica** (§5), non per assenza di contro. |
| M1 | L3 | Template v.0 riusabile + sync | **REGGE** | — | M1-§4-13 · M1-§4-21 · M1-§4-22 | Il contrario: M1-C21 dice esplicitamente «v0 non abbandonato, template resta vivo + obbligo sync». C13 registra un'oscillazione (propagazione sospesa poi sbloccata parziale) e C22 una parte persa (la checklist di apertura). Regge, con una perdita dichiarata. |
| H5 | L3 | method-export / method-portable | **REGGE** | — | H5-§4-1 · H5-§4-5 · F1-§4-5 | H5-§4-1 mostra che il metodo esportato non elimina la micro-gestione UI (stesso loop pixel su Trading); F1-§4-5 che su FREEDOM il context era «da costruire» e i template scambiati per regole. Il trasferimento avviene ed è documentato in tre ondate (B1, F1, H5): regge. Ciò che non si trasferisce è l'enforcement (S3 §6.2), ed è un dato, non una smentita. |
| H5 | L3 | multi-project-ops | **REGGE** | — | H5-§4-2 | H5-§4-2 lo dice: «dual-repo confusione, chiede ripristino, poi «hai ragione» sull'env, poi porte 3000/3010 — multi-progetto reale ma operativamente costoso». È il costo, non il fallimento: i due progetti restano aperti e separati (H5-D40, H5-D41). Regge con il costo dichiarato. |
| H2 | L3 | copy-delta-only / prompt-discipline | **REGGE** | — | H2-§4-1 · H2-§4-7 | H2-CE1 e CE7 mostrano tre correzioni di rotta nello stesso thread e un «annulla tutto tranne 1 file»: sono instabilità di scope, ma nella direzione RESTRITTIVA — chiede meno, non più. Non falsificano la disciplina del delta. |
| H1 | L3 | plan-steering | **RIDIM.** | L2 | I1-§4-1 · I1-§4-4 · I2-§4-1 · I2-§4-6 | Il catalogo dei piani è la contro-evidenza più dura del corpus e non era mai stata incrociata con questa foglia. Su 113 piani prenotazioni/HACCP: **23 con tutti i todo `completed`, ≥45 con ≥3 todo ancora `pending`** (I1-§4-1); i piani-prompt restano pending e I1 stesso dice «da falsificare, non assunti chiusi» (I1-§4-4). Su 33 piani giochi/trading: **28 senza status todo** (I2-§4-1). «Guidare il piano prima che parta» resta vero come atto; «steering» come competenza che porta a chiusura non regge. Scende a L2: dirige l'apertura, non la chiusura. |
| H1 | L3 | agent-review / prompt-orchestration | **REGGE** | — | H1-§4-6 | Confermo la conferma di S3, e la rendo più severa con il dato di H5-§4-3: ~27 messaggi «paste-ish» in H5 gonfiano la media. H1-§4-6 dice lo stesso su H1. La foglia regge, ma il volume dei messaggi non è una misura della sua orchestrazione: è la lacuna delle prove fragili (§5). |
| G1 | L3 | generate-vs-apply | **REGGE** | — | G1-§4-2 | G1-§4-2 dice che il sistema didattico è «progettato, poco agito». Ma la distinzione risposte-guidate / idee-autonome è ESERCITATA proprio nel materiale che la dichiara (G1-D08) ed è ripresa in A4-D33 (fusione S1 F071). Regge come criterio, non come pratica ripetuta. |
| D2 | L3 | closed-decision-prompt / M-REGIA | **REGGE** | — | A9-§4-7 · D2-§4-8 | A9-§4-7 registra «delegazione M-REGIA massiccia (17-06 PROMPT 1–8): agency di scrittura bassa, di regia alta» — conferma la pratica e ne misura il costo. D2-C08 mostra il rovescio: «controllo fine senza brief stabile a p[rincipio]». Regge, ed è la competenza che il corpus documenta meglio dopo l'ambiente. |
| B1 | L3 | autonomy-mandate + eccezioni | **REGGE** | — | B1-§4-4 · H5-§4-5 | B1-C04 è la contro-evidenza scritta da B1 stesso: «tensione autonomia/sicurezza: mandati «senza autorizzazioni» vs push sempre bloccato». H5-D35 lo conferma da peso 1 («si sentisse il proprietario… senza chiedermi autorizzazioni») e H5-D39 mostra l'eccezione che scatta subito dopo («BLINDARE… prima di andare a disallinearci»). La regola con le sue eccezioni è esattamente ciò che il corpus mostra: regge, e adesso con una fonte di peso 1 che B1 non aveva. |
| A4 | L3 | ssot-closure / ssot-root-fix | **REGGE** | — | A4-§4-1 | Trovate, ma altrove e su altre materie: M3-§4-2 (due checklist di collaudo lo stesso giorno), M3-§4-6 (incoerenza Servizio-Config: «stesso pack, due verità»), G1-§4-9 (duplicato campagna). Non toccano la chiusura SSOT di A4. Regge, ma il principio «una sola fonte» è smentito dai fatti tre volte in altre ondate: registrato in §6. |
| A4 | L3 | annotate-vs-promote | **REGGE** | — | A3-§4-1 | Doppione funzionale della riga M1: stessa regola, stessa contro, stesso esito. Non è una conferma indipendente. |
| A3 | L3 | cursor-enforcement | **RIDIM.** | L2 | A3-§4-4 · A4-§4-7 · M1-§4-20 | A3-§4-4 lo dichiara nella stessa ondata che assegna il livello: «Rule + hook installati ma NON ancora testato in chat Agent reale». A4-§4-7 lo trova poi spento (`core.hooksPath=nul`), M1-§4-20 rumoroso. Una regola installata, mai collaudata e trovata disattivata non è una correzione dell'agente accettata: è un'intenzione. Scende a L2. |
| A3 | L3 | understand-before-act | **REGGE** | — | A3-§4-6 | A3-§4-6 è la contro-evidenza speculare e va letta: «requisito invertito admin-card: il prompt diceva mostrare il thumb, il bisogno reale era nasconderlo su mobile — zero domande agente». L'errore è dell'agente che non ha chiesto; la regola è sua e nasce da qui. Regge. |
| A3 | L3 | agent-reliability | **REGGE** | — | A3-§4-5 · A5-§4-3 · B2-§4-1 · B2-§4-5 | Quattro ondate documentano agenti inaffidabili («lavoro non eseguito in 1ª passata», «E2E shell 20/20 falso», «gli agenti dichiarano APPROVED e l'utente ritrova blocker», «claim DB falsi su DB live»). Tutte RAFFORZANO la sua diffidenza invece di smentirla. Regge, ed è la foglia con più sostegno indiretto del ramo. |
| A2 | L3 | ask-before-plan | **REGGE** | — | A2-§4-6 | A2 non ha colonna di contro-evidenza né dichiarazione collettiva, ma i suoi 10 item di §4 colpiscono le sette skill L3/L4 una per una (verifica di S3 §3.2, che ho ricontrollato). Per questa: A2-§4-6, «agente 1 ask-mode delude vs agente 2 che trova conflitto — qualità filtro non automatica». È una contro sull'ESITO dell'ask-mode, non sulla regola. Regge. |
| A2 | L3 | meta-vs-exec | **REGGE** | — | A2-§4-3 | A2-§4-3 («skill close saltato») è proprio il rilievo. Regge. Ma vedi §6: la separazione meta/esecuzione è la stessa che regge i tre profili, e quella l'ho lasciata a M1. |
| A2 | L3 | evoluzione-skills junior/senior | **REGGE** | — | A2-§4-4 | A2-§4-4 lo dice: sistema costruito prima di essere ratificato. È una contro sull'ORDINE, non sull'esistenza. Regge. |
| A11 | L3 | ai-orchestration | **REGGE** | — | A11-§4-12 · A11-§4-8 | No, e S3 lo aveva già misurato (agosto = zero L4). A11-CE12 limita l'autonomia test-infra a L1–L2 («delega «Rivestilo tu», parallelismo deciso dall'agente»); A11-CE8 mostra il limite della strategia multi-corsia (un bug trovato a mano da lui, fuori copertura e2e). Regge a L3, non sale. |

### R02-PRODOTTO — 7 righe · 6 REGGE · 0 RIDIMENSIONATA · 1 NON REGGE

| Ondata | Liv. | Skill | Verdetto | → | Contro-evidenza (ID) | Cercato / trovato |
|--------|------|-------|----------|---|---------------------|-------------------|
| M1 | L3 | Scope control / anti-scope-creep | **REGGE** | — | A4-§4-3 · G1-§4-3 · A7-§4-4 | Trovato, ed è la contro-evidenza migliore del ramo perché è auto-dichiarata: A4-§4-3 «il senior segnala la tendenza ad allargare a metà sessione»; G1-§4-3 lo annota nel PROFILO come «tratto da sorvegliare — non negato»; A7-§4-4 mostra una sua proposta CLI/MCP «troppo ampia» poi ristretta da lui stesso. Regge come skill (lo controlla), ma la materia che controlla è anche sua. |
| H4 | L3 | modular-handoff (Survivor → Tommaso) | **REGGE** | — | I2-§4-2 · H4-§4-1 | Non risulta, e nel perimetro non c'è modo di saperlo. Accanto: H4-C01 e I2-§4-2 mostrano che sullo stesso prodotto perde lavoro per troppi Ctrl+Z. Regge come atto isolato (è l'unico pari umano del corpus, S1 F099), non come pratica. |
| B1 | L3 | anti-bureaucracy | **REGGE** | — | B1-§4-11 · B1-§4-10 | B1-C11 è la contro: «taglia un pezzo del kit CB di proposito, didattico spento → niente scuola senior in beta». È coerente con la skill, non contraria. Resta però l'attribuzione debole di B1-C10 («owner», non Matteo nominato) e su questa foglia H5 NON offre nulla: non c'è una M-VOCE su burocrazia di processo in BHM. Regge a L3 con attribuzione debole, invariata. |
| A6 | L3 | anti-bureaucracy | **REGGE** | — | A6-§4-8 | A6-§4-8 è la conferma già trovata da S3 (FU-FASE-D-M1 «debito formale» corretto da lui). Qui l'attribuzione regge, a differenza di B1: questa è la riga che porta il ramo, non quella di B1. |
| A5 | L3 | debt-cleanup | **REGGE** | — | A5-§4-6 · A5-§4-7 · M4-§4-8 · M4-§4-9 | Trovati in quantità, e sono la contro-evidenza vera: FU-030 «Aperto» in ritardo sulla decisione (A5-§4-6), validazione ospiti lasciata aperta (A5-§4-7), MASTERPLAN_BLINDATURA con M5 ⬜ e M6 🔶 (M4-§4-8), tracking fermo al 17-06 (M4-§4-9). Sa NOMINARE il debito; la chiusura è irregolare. Regge a L3 (le decisioni di pulizia sono sue) con il limite registrato in §6. |
| A2 | L3 | scope-lock / approve-then-fix | **REGGE** | — | A2-§4-7 | A2-§4-7 è esattamente quella: «Bug A sidebar chiuso in sessione C senza citazione di risposta Matteo». È una contro sulla COPERTURA della prova, non sulla skill. Regge. |
| A1 | L3 | scope-control | **NON REGGE** | L2 | A1-§4-5 · A1-§4-9 · A1-§4-14 | ⚠️ È una delle 44 righe senza nessun ID (S3 §3.3): A1 dichiara zero ID su 18 righe. E le sue stesse contro-evidenze la smontano: CE5 «Q1–Q11 promo solo in sintesi agente → Chi spesso INCERTO, peso 3 fragile su product-scoping 23-05»; CE9 «Prenota v2 fondazione: zero domande in sessione — delega al plan»; CE14 «quasi nessun Q1 formale: parole sue mediate dall'agente». Il livello poggia su una frase, e la frase è contraddetta nello stesso report. Scende a L2. |

### R03-FLUSSO — 17 righe · 16 REGGE · 0 RIDIMENSIONATA · 1 NON REGGE

| Ondata | Liv. | Skill | Verdetto | → | Contro-evidenza (ID) | Cercato / trovato |
|--------|------|-------|----------|---|---------------------|-------------------|
| M4 | L4 | area-routing Prenota≠QR≠magazzino | **REGGE** | — | A3-§4-2 · M1-§4-1 | Stessa materia della riga A3 `area-disambiguation` e stesso esito. Attenzione a non contarle come due prove: sono la stessa regola scritta in due file (`APP_CONTEXT_SKILL` §0 e le skill d'area). |
| M1 | L4 | Disambiguazione Prenota/QR/menu×3 | **REGGE** | — | M1-§4-1 · A3-§4-2 | Terza scrittura della stessa regola. Le tre righe L4 (M1, M4, A3) valgono UNA codifica, non tre. Correzione all'albero, registrata in §4. |
| A6 | L4 | menu-magazzino-limits / intervista-owner | **REGGE** | — | A6-§4-10 · M3-§4-8 | A6-§4-10 dichiara la ricerca e il suo esito: «cercata, non trovata — restano ORIGINATE stabili; i fallimenti sono di wiring/QA, non di ribaltamento del modello». Verificato in M3 (la skill che li eredita): i limiti ci sono ancora. Regge, ed è l'unica L4 di prodotto che il tempo ha confermato. |
| A6 | L4 | limite-coperti | **NON REGGE** | L2 | A9-§4-1 · M3-§4-1 · A9-§4-9 | 🎯 BERSAGLIO #2. La regola è nata l'11-06 ed è stata RIMOSSA il 18-06: sette giorni. Un L4 richiede una regola RIUSATA; questa è stata cancellata dal codice (`daily_guest_limit` rimosso) prima di essere riusata. Non serve chiudere il conflitto T01/N-5 per dirlo: che sia stato un errore o un cambio di modello, la regola non esiste più. **Scende a L2 — decisione sua, motivata, non diventata regola.** Il conflitto T01/N-5 resta APERTO e non lo chiudo (§7). |
| M3 | L3 | dottrina-turni (append-only se servito) | **REGGE** | — | M3-§4-8 | M3-§4-8 elenca debiti aperti su altro (CRM, delete sala vs tavolo, badge). Nessuna contro sui turni. CERCATA, NON TROVATA. |
| M2 | L3 | multi-tenant-safety-tradeoff | **REGGE** | — | M2-§4-4 · M2-§4-5 · M2-§4-6 | M2-§4-4 mostra la doc non allineata alla decisione (guard sandbox ancora dichiarata mentre DEC-037 l'ha allargata), M2-§4-5 policy applicate via SQL diretto senza migrazione nel repo, M2-§4-6 «velocità alta ma meno gate umani — contro-evidenza a «Matteo controlla ogni passo»». Regge come decisione; il controllo su di essa no. |
| M1 | L3 | Decisioni in termini di sala | **REGGE** | — | M1-§4-6 · M1-§4-7 | Il contrario: M1-C6 e C7 mostrano che NON capisce le domande poste in termini di implementazione e non capisce gli elenchi con sigle. Rafforza la skill invece di smentirla — e allo stesso tempo è la contro-evidenza più netta sul suo limite tecnico. Regge; il dato va letto due volte. |
| H3 | L3 | transactional-email | **REGGE** | — | H3-§4-3 · A8-§4-5 · A6-§4-9 | Tre contro concordi: «release email: test ok / prod no» (H3-CE3, peso 1), «canale email PROD chiuso, send-email non deployata» (A8-§4-5), «deploy pendenti: BREVO secrets, email non LIVE» (A6-§4-9). La decisione di prodotto è sua e regge a L3; l'esecuzione operativa è rimasta indietro per settimane. Registrato in §7 come debito, non come declassamento. |
| H1 | L3 | time-slot-digest / overnight-slots | **REGGE** | — | — | CERCATA, NON TROVATA. Nessuna delle 352 contro-evidenze tocca gli slot notturni. Nove ID di peso 1 a sostegno (H1-D23…D29, D58, A21). È la foglia di prodotto meglio sostenuta e meno attaccata del corpus. |
| H1 | L3 | email-provider | **REGGE** | — | H1-§4-3 · A8-§4-3 | H1-§4-3: «decide il provider giusto, poi si ferma sul requisito verifica mittente — decisione prodotto ok, esecuzione ops incompleta». A8-§4-3: prima chiave SMTP rifiutata, era la API. Regge la scelta, non l'esecuzione. |
| G2 | L3 | sala-obbligatoria / walkin / no-show | **REGGE** | — | A10-§4-2 · A11-§4-5 · A6-§4-5 | Ribaltato due volte, e da lui: A10-§4-2 «dopo QA 25-06 ribalta «solo liberazione separata»»; A11-CE5 «walk-in «solo coperti» in checklist/masterplan poi ritirato». A6-§4-5 mostra il no-show corretto da lui («ti ho espressamente chiesto io»). Sono M↔M documentate, non errori subiti: regge a L3, con l'instabilità registrata. |
| A6 | L3 | snapshot-invariante | **REGGE** | — | A6-§4-10 | A6-§4-10 dichiara la ricerca: «fallimento owner sull'invariante snapshot (D04): in questo perimetro resta ORIGINATA stabile». Confermato: nessuna delle altre 38 ondate lo contraddice. |
| A6 | L3 | availability-toggle | **REGGE** | — | A6-§4-6 | A6-§4-6 è la contro: «modal config mostra voci spente: propagazione OK ma wiring UI admin incompleto; solo QA umano lo trova». Colpisce l'implementazione, non la decisione. Regge. |
| A6 | L3 | unsaved-guard | **REGGE** | — | A6-§4-4 | A6-§4-4 lo dice: «guard C-U2 solo tab: QA Matteo «non funziona se clicco fuori» → secondo giro overlay». Ed è lui a trovarlo. Regge, rafforzata. |
| A6 | L3 | no-show-wall | **REGGE** | — | A6-§4-5 | A6-§4-5 è la conferma: batch A lo lascia sbagliato, lui lo corregge con «ti ho espressamente chiesto io». Fusione S2-F03, peso 1. Regge. |
| A4 | L3 | prenota-text-limits | **REGGE** | — | A5-§4-7 | A5-§4-7 mostra la validazione ospiti lasciata aperta (FU-046 non la chiude) — materia adiacente, non la stessa. CERCATA sui limiti di testo, NON TROVATA. |
| A10 | L3 | walk-in / forzatura operativa | **REGGE** | — | A10-§4-2 · A11-§4-5 | Doppione funzionale della riga G2: stessa materia, stesse contro. Non è una conferma indipendente. |

### R04-QUALITA — 22 righe · 18 REGGE · 3 RIDIMENSIONATA · 1 NON REGGE

| Ondata | Liv. | Skill | Verdetto | → | Contro-evidenza (ID) | Cercato / trovato |
|--------|------|-------|----------|---|---------------------|-------------------|
| M1 | L4 | Profili Esecuzione/Verifica/Meta | **REGGE** | — | A2-§4-3 · M2-§4-6 | I profili sono nel CLAUDE.md, nell'AGENTS.md e in ogni prompt di questa indagine compreso il mio: riuso dimostrato all'atto. A2-§4-3 mostra un caso di meta saltato nell'esecuzione; M2-§4-6 un caso di velocità senza gate. Regge — è la L4 più operativa del corpus. |
| M1 | L4 | Controverifica imparziale | **REGGE** | — | A8-§4-10 · A7-§4-6 · H5-§4-4 | Trovate tre: «§2B revisore saltato su E2E calendario» (A8-§4-10), «conferma deploy edge TEST e smoke spesso delegati/non fatti» (A7-§4-6), handoff a metà (H5-§4-4). Sono salti di applicazione su una regola che resta scritta e invocata. Regge; è però la prima volta che qualcuno conta i salti: tre in 39 ondate. |
| H3 | L4 | blindatura-orchestrate / blindatura-controtest | **REGGE** | — | H3-§4-2 · M3-§4-7 · C5-§4-4 · A8-§4-9 | Quattro contro, e una è grave: C5-§4-4 «blindatura dichiarata vs misurata: BLINDATURA_AUTH 7/7 e AGENTE_5 8/8 vs DEBUG (test rossi) e 3% blindati» — nel legacy la parola era gonfiata. M3-§4-7 e A8-§4-9 mostrano lo stesso rischio su CB-v2 («blindato tecnico ≠ accettazione»; Area 3 «non blindata» poi «blindata» con E2E deboli). H3-CE2 è la sua stessa annotazione che mancano gli E2E browser. La regola regge e lui la sorveglia; **la parola «blindato» è il punto debole ed è già scivolata una volta** (S2 §9.1). Regge, con l'avvertenza. |
| B1 | L4 | audit-immutability / append-only | **NON REGGE** | L4 di sistema (confermato) | B1-§4-1 · B1-§4-10 | 🎯 BERSAGLIO #3, esito negativo. H5 ha cinque M-VOCE nominali su BHM (D34, D36, D37, D40, D42) e **nessuna** riguarda l'append-only. B1 stesso lo classifica «BHM nativo (prodotto)» nella propria satellite. Resta «di sistema»: è una competenza del dominio HACCP, non sua. E B1-C01 aggiunge che la decisione «crea una finestra di incoerenza» nel legacy. |
| A6 | L4 | blindatura-method / manuale-SoT | **REGGE** | — | A6-§4-10 · M4-§4-8 | M4-§4-8 mostra il MASTERPLAN_BLINDATURA con M5 ⬜ e M6 🔶: incompleto, non abbandonato. Il metodo A→D è ancora la struttura di lavoro citata in agosto (A11). Regge. |
| M3 | L3 | test-strategy (filtro umano vs auto) | **REGGE** | — | M3-§4-2 · M3-§4-3 · M3-§4-9 · C4-§4-7 | C4-§4-7 lo dice per esteso: «nessun 62 prove in C4; il 16 di IDENTIFICAZIONE è coincidenza numerica». Confermo il negativo di S3 e NON lo riapro. Ma M3 stesso porta due contro che valgono di più: due checklist di collaudo lo stesso 06-08 con numeri diversi (§4-2) e tre modelli di «chi collauda» coesistenti (§4-3), più l'assenza di una firma esplicita «approvo il taglio» (§4-9). Il taglio è avvenuto; **chi l'ha deciso non è firmato.** Regge a L3 con l'autonomia contesa (conflitto N-4, `SCELTA` vs `DELEGATA`). |
| M3 | L3 | accettazione-umana | **RIDIM.** | L2 | G1-§4-5 · M3-§4-7 · A11-§4-1 · A11-§4-2 · C4-§4-1 · C4-§4-8 | Sei contro-evidenze su cinque ondate, ed è il caso peggiore del ramo. G1-§4-5: **«OK revocato: footer Menu QR accettato per errore (era Prenota) — prova che anche lui può certificare male»**. A11-CE1: la checklist di collaudo ferma a **4/62 per ≥3 sessioni** nonostante gli e2e verdi. A11-CE2: «Non ancora / devo ancora testare». M3-§4-7: «blindato tecnico ≠ Matteo l'ha visto». C4-§4-1 e C4-§4-8: nel legacy la firma umana era una cerimonia. **L'accettazione come atto formale esiste; come atto compiuto, spesso no.** Scende a L2. |
| H5 | L3 | parallel-audit / controverifica | **REGGE** | — | H5-§4-4 | H5-§4-4 («handoff frequenti per chat interrotte») e H5-D32 mostrano 8 agenti A0–A7 lanciati in parallelo. L'atto c'è, la chiusura è debole. Regge a L3. |
| H4 | L3 | owner-qa-gate | **REGGE** | — | H4-§4-2 · H4-§4-3 | H4-C02 e C03 sono durissime ma su altro (worktree persi, report cancellati). Il gate QA di febbraio regge: è la radice del cluster S2-T07. |
| H3 | L3 | owner-qa / form-validation-ux | **REGGE** | — | H3-§4-4 · H3-§4-8 | ⬆️ **TROVATA, e il declassamento di S3 va rivisto.** S3 aveva declassato questa riga a L2 perché nei CE1–CE8 di H2 non c'era nulla sulla validazione dei form. Ma la riga è di **H3**, non di H2, e H3 ha la sua Sezione 4: **H3-CE4 «falso allarme intolleranze → «scusa scemo io»; poi critica toast»** è esattamente una contro-evidenza sulla validazione di un form, di peso 1. Più H3-CE8 «stesso fix layout Prenota: «agente ha sbagliato ancora»». La regola dura §3.4 è soddisfatta: **la riga risale a L3.** |
| H2 | L3 | owner-qa | **REGGE** | — | H2-§4-4 · H2-§4-3 | H2-CE4 è la contro migliore: «scopre il bug promo conflitto solo dopo uso reale» — cioè la QA a tavolino non l'aveva preso. CE3 aggiunge il vincolo fisico: per collaudare da tablet deve fare push/merge, quindi **il collaudo hardware guida il rilascio**. Regge, con un limite di metodo che nessuno aveva raccolto (§6). |
| H1 | L3 | multi-tenant-qa | **REGGE** | — | A1-§4-2 | A1-CE2 la trova: «delega ampia su RLS/RPC/GRANT: Matteo triggera, agente decide policy — limita multi-tenant-rls a L1». È una contro su un ID solo (H1-D08). Prova fragile: elencata in §5. |
| G1 | L3 | hands-on-qa / acceptance-ownership | **RIDIM.** | L2 | G1-§4-5 · G1-§4-4 · A11-§4-1 | Handoff onorato. G1 porta da solo le due contro che lo abbattono: **§4-5 «OK revocato: footer Menu QR accettato per errore»** e §4-4 «accettazioni incomplete: checklist viva con 6 voci ☐; editor promo multi-tipologia mai confermato; fix marketing in pending». Con A11-CE1 (4/62 per tre sessioni) fanno tre. La QA a mano la fa; l'ACCEPTANCE come proprietà no. Scende a L2, come la riga gemella di M3. |
| B1 | L3 | human-verify (build≠funziona) | **REGGE** | — | B1-§4-9 · B1-§4-10 | B1-C09 è a favore («owner catcha un bug che la doc negava»). L'attribuzione resta «owner», e H5 non la copre: **resta L3 con attribuzione debole**, invariata rispetto a S3. Il principio però è confermato da fonti di persona altrove (A6-§4-7, A11-CE8). |
| A7 | L3 | masterplan-scoping / owner-gates | **RIDIM.** | L2 | I1-§4-1 · I1-§4-2 · I1-§4-3 · A7-§4-5 | Stessa contro di `plan-steering`, e qui morde di più perché A7 è l'ondata dei masterplan: I1-§4-2 registra «duplicati e supersessioni non dichiarate — masterplan a più versioni tutti pending»; I1-§4-3 un master plan che documenta da solo il proprio scarto («A5 ancora BUG APERTO»); A7-§4-5 «7/8 file di fusione restano non applicati a fine giornata». Scende a L2. |
| A7 | L3 | controverifica | **REGGE** | — | A7-§4-6 · A7-§4-8 | A7-§4-6 le trova («deploy edge TEST e smoke Servizio spesso delegati/non fatti») e A7-§4-8 avverte sul rischio di attribuire a lui scelte degli esecutori in una giornata da 63 report. Regge a L3, con l'attribuzione di quella giornata marcata INCERTA (§6). |
| A6 | L3 | visual-qa (DOM path) | **REGGE** | — | A6-§4-7 | A6-§4-7 dice il contrario ed è la conferma già trovata da S3: lo script di verifica dà un falso positivo, **prevale il QA di Matteo**. Regge, ed è una delle poche righe dove batte lo strumento. |
| A5 | L3 | navigation / debugging | **REGGE** | — | A5-§4-2 · A4-§4-1 | A4-§4-1 è la migliore e va citata per intero: **falso negativo su un layout perché non aveva riavviato il dev server, con auto-correzione «scemo io»**. A5-§4-2: QA R1 non vista a video. Regge a L3 (naviga e trova), con il limite d'ambiente registrato. |
| A4 | L3 | visual-qa / cancel-bad-exec | **REGGE** | — | A4-§4-1 · A4-§4-2 | Stesse contro della riga A5. A4-§4-2 aggiunge «brief wrap errato: approva/incolla P0 wrap, poi annulla → prima direzione prodotto sbagliata sul viewport». Regge; l'annullamento è la skill, non il difetto. |
| A3 | L3 | prepara-brevity / qa-schermata | **REGGE** | — | A3-§4-5 | A3-§4-5 («report ↔ codice: «da togliere» su carta ma ancora nel picker») e A2-§4-5 (l'intent overlay ribaltato in giornata) mostrano i limiti del prepara. Regge come pratica di QA a schermo. |
| A2 | L3 | qa-schermata-effetto | **REGGE** | — | A2-§4-8 | A2-§4-8 è la conferma di S3: «verifica soft: più cicli «Approva»/«lavoro ok» con smoke browser incompleti». Regge a L3, ma è la stessa crepa dell'`accettazione-umana` che ho declassato: **la QA a schermo è forte, la certificazione che ne segue è debole.** |
| A10 | L3 | visual-iter / consumer-verify | **REGGE** | — | A10-§4-3 · A10-§4-4 · A10-§4-5 | A10-§4-3 «micro-loop UI senza mockup: 2–4 iterazioni»; A10-§4-5 «QA deferita / smoke saltato: «lo testo io dopo»». A10-§4-4 invece è a favore: «il consumer-verify di Matteo smonta una chiusura prematura». Regge, ed è il ritratto esatto del ramo R06: vede bene, chiude tardi. |

### R05-AMBIENTI — 35 righe · 30 REGGE · 4 RIDIMENSIONATA · 1 NON REGGE

| Ondata | Liv. | Skill | Verdetto | → | Contro-evidenza (ID) | Cercato / trovato |
|--------|------|-------|----------|---|---------------------|-------------------|
| M4 | L4 | product-scoping QR multipli / no content_type | **RIDIM.** | L3 | M4-§4-10 · M4-§4-11 | M4 lo dichiara da solo e nessuno l'ha raccolto: **§4-10 «§3-bis non dice «Matteo ha chiesto il DROP»: possibile CORRETTIVA agente su codice morto (confermare A5)»**. Ho confrontato con A5: nella sua Sezione 4 non c'è nulla che lo confermi. Più §4-11: «le «scelte di Matteo» in PRENOTA/MENU_QR §3 sono attribuzione di sezione, non citazione per bullet». Metà della decisione (i QR multipli) è sua; l'altra metà (il drop) non è attribuibile. Scende a L3. |
| M4 | L4 | product-auto-select card singola | **REGGE** | — | M4-§4-12 · M4-§4-11 | M4-§4-12 dichiara la ricerca e l'esito: «cercata contro-evidenza su L4 card singola / zero commissioni / no cookie banner: non trovata inversione; restano aperti solo i limiti di peso 4 (manca transcript)». Verificato: nessuna delle altre 38 ondate la inverte. Regge, ma è **prova fragile** — unica fonte, peso 3–4, nessun transcript (§5). |
| M4 | L4 | product-capabilities intolleranze universali | **REGGE** | — | H3-§4-4 | H3-CE4 («falso allarme intolleranze → «scusa scemo io»») è di peso 1 e riguarda la stessa materia: ma è un falso allarme suo su un comportamento corretto, non un'inversione della regola. Regge; stessa fragilità di fonte della riga sopra. |
| M4 | L4 | blindatura (intervista + Classic prod) | **REGGE** | — | M4-§4-6 · M4-§4-8 · M4-§4-9 | Tre contro, tutte di M4 su sé stesso: header MASTERPLAN_SERVIZIO ⬜ contro corpo avanzato (§4-6), M5/M6 aperti (§4-8), tracking fermo al 17-06 (§4-9). Colpiscono lo STATO, non il metodo. L'intervista-per-sezione è la regola di lavoro citata da M3 e A5 e usata fino ad agosto: regge. |
| M2 | L4 | env-safety (TEST≠PROD, get_project_url) | **REGGE** | — | M2-§4-5 · M3-§4-4 · H1-§4-2 · G2-§4-3 · A2-§4-2 · H2-§4-2 | 🎯 **TROVATI SEI, ed è il risultato più pesante di questa ondata — vedi §4.2.** M2 stesso: policy/CASCADE via SQL diretto su TEST senza migrazione nel repo (§4-5). M3: «non dimostrabile come ORIGINATA; elevare a L4 da questi soli file = sovra-attribuzione» (§4-4). E soprattutto la sequenza temporale: H1-§4-2 «MCP su URL PROD `rwuxgvld` all'inizio del periodo, senza la distinzione che oggi è regola dura»; G2-§4-3 «autorizza «Applica via MCP ora» **prima** della lezione TEST≠PROD: impara correggendo, non prevenendo»; H2-CE2 «fino al 29-05 chiede chiarimenti su come non confondere TEST/PROD» (peso 1); A2-§4-2 «inserisce dati in dev e non li vede su Vercel». **La regola regge — è scritta in quattro file e funziona oggi — ma NON era una competenza di partenza: è stata imparata dopo aver sbagliato.** Regge come L4; la narrazione «originaria» va corretta (§8). |
| M1 | L4 | Separazione lavoro ok vs report finale | **REGGE** | — | M1-§4-9 | M1-§4-9 (C9) mostra una precisazione a metà flusso, cioè l'uso della distinzione. È nel CLAUDE.md di progetto e nel VOCABOLARIO: riusata ogni sessione. Regge. |
| M1 | L4 | Controtest / blindatura prodotto | **REGGE** | — | C5-§4-4 · A8-§4-9 | Stessa contro della riga H3, stessa lettura: la parola «blindato» è scivolata nel legacy (C5-§4-4) e una volta su CB-v2 (A8-§4-9). Regge, con l'avvertenza sulla parola. |
| M1 | L4 | Sicurezza PROD (ask non deny) | **REGGE** | — | A4-§4-6 · A5-§4-8 · G2-§4-3 | A4-§4-6 «skip probe PROD: merge+deploy edge sì, verifica live no — rischio residuo consapevole»; A5-§4-8 «bonifica PROD su «nessun cliente attivo»: dipende da self-report, non verificabile». Sono rischi ACCETTATI consapevolmente, che è il contrario di «deny»: la regola dice «chiedi», e chiedendo si può anche decidere di correre il rischio. Regge. G2-§4-3 resta la contro cronologica (§4.2). |
| A6 | L4 | merge-pubblico (src/ only) | **REGGE** | — | J1-§4-1 · J1-§4-4 | J1 la conferma dai fatti (peso 2) e ne mostra il costo: «il cancello funziona ma crea 75 commit di distanza» (CE1) e «branch console ancora aperto, non in PrenotaZen» (CE4). Una regola che i fatti confermano è il caso più forte del corpus: regge. Il costo va in §7 come debito. |
| M4 | L3 | env-region / brand PrenotaZen | **REGGE** | — | M4-§4-5 | M4-§4-5: «region stale: SUPABASE_PRODUCTION_CONFIG ancora «DA VERIFICARE» vs Ireland confermata». È un disallineamento documentale, non una decisione diversa. Regge (S1 F053 la conferma come eseguita). |
| M2 | L3 | product-owner-console | **REGGE** | — | M2-§4-1 · M2-§4-2 · M2-§4-7 · J1-§4-4 | **IPOTESI DEL COMMITTENTE SMENTITA — vedi §8.** M2-§4-1: F1→F13 e REQ-001…004 ACCETTATE, sprint chiuso. Ma M2-§4-2 e J1-CE4 aggiungono il pezzo che manca: **il branch non è antenato di `main` e non è in PrenotaZen** — accettato e mai rilasciato. E M2-§4-7 dichiara «decisione owner ORIGINATA ma non codificata fino in fondo (L4 incompleto)». Regge a L3; non sale, e l'ipotesi «abbandono» va corretta ovunque compaia. |
| M1 | L3 | Release hygiene (pubblico=prodotto) | **REGGE** | — | J1-§4-5 | J1-CE5 aggiunge un fatto (peso 2) che nessuno aveva collegato: **«nessun tag git; release solo come commit su altro repo»**. La tracciabilità del rilascio dipende interamente da PrenotaZen. Regge la regola, con il limite di tracciabilità registrato in §7. |
| J1 | L3 | env-safety | **REGGE** | — | J1-§4-2 | J1-CE2 è l'unica contro di peso 2 sull'ambiente e va detta: **«sicurezza env ok sul tetto (062), ma la history delle migrazioni PROD è sporca: timestamp, 026b, 018 v2, 028/029 doppi»**. Il cancello tiene; ciò che è già passato dentro è disordinato. Regge, con il debito registrato. |
| I1 | L3 | env-safety | **REGGE** | — | I1-§4-5 | I1-§4-5 riguarda l'attribuzione HACCP, non l'ambiente. CERCATA sull'ambiente in linea I, NON TROVATA: i piani rispettano TEST. |
| I1 | L3 | product-scoping | **RIDIM.** | L2 | I1-§4-1 · I1-§4-2 · I1-§4-4 · I1-§4-5 | Quattro contro nella stessa ondata che assegna il livello: 23 completed su 113, duplicati non dichiarati, prompt-piano pending «da falsificare, non assunti chiusi», e **«attribuzione debole su HACCP: densità altissima di piani, quasi zero «Matteo» verbatim → I1-D30–D31 restano INCERTO»**. Lo scoping c'è; l'attribuzione e la chiusura no. Scende a L2. |
| H4 | L3 | session-report | **REGGE** | — | H4-§4-3 | H4-C03 è la contro e viene da peso 1: «il processo report esiste ma non è a prova di agente — l'agente cancella/sovrascrive i report, lui se ne accorge dopo». Colpisce la robustezza, non la pratica. Regge. |
| H3 | L3 | release-prod / release-gate | **REGGE** | — | J1-§4-1 · A11-§4-6 | Nessuno. Al contrario, J1-CE1 misura il gate dai fatti (75 commit fermi). A11-CE6 registra «commit locali senza push per giorni». Regge — è la foglia dove parola e stato della macchina coincidono (S2 §9.2). |
| H2 | L3 | product-scoping | **REGGE** | — | H2-§4-1 · H2-§4-7 · H2-§4-8 | Tre contro di peso 1 e sono le migliori del corpus su questa materia: «tre correzioni di rotta nello stesso thread» (CE1), «stesso giorno: chiede analisi skill, poi annulla tutto tranne 1 file» (CE7), «sfondo Prenota: preferenza fixed vs scroll non stabile» (CE8). Lo scoping è forte e instabile insieme. Regge a L3, con l'instabilità registrata: è la materia della domanda #4 del §9. |
| H2 | L3 | env-safety | **RIDIM.** | L2 | H2-§4-2 · H1-§4-2 · G2-§4-3 | **H2-CE2, scritta da H2 stesso, è la contro più precisa del corpus su questa materia: «fino al 29-05 chiede chiarimenti su come non confondere TEST/PROD».** La riga H2 poggia su H2-D05/D07/D36 (22-05 → 29-05), cioè lo stesso periodo in cui sta imparando. Una skill L3 richiede «ha corretto l'agente vedendo un errore che l'agente non vedeva»: qui è lui che chiede. Scende a L2 **su questa finestra temporale**. La regola matura più tardi e la sua L4 sta in M1/M2, non qui. |
| G3 | L3 | role-split / product-ownership | **REGGE** | — | G3-§4-6 · G2-§4-1 | G3-§4-6 avverte da solo: «attribuzione debole sullo Storico: non usare G3-D18–D35 come prova L3+ senza incrocio H/A». G2-§4-1 dice lo stesso su G2. La divisione dei ruoli («io oriento, l'agente costruisce») è però citata verbatim in G3-D02 e confermata da R11. Regge. |
| G3 | L3 | anti-meta-creep / doc-hygiene | **REGGE** | — | G3-§4-2 | G3-§4-2 è la contro ed è fine: «toglie META_SKILL dalle skill ufficiali — igiene — ma lascia l'analisi in `_lavoro`: rischio che gli agenti futuri non la vedano». Igiene sì, conservazione dubbia. Regge. |
| G2 | L3 | env-safety / test-prima-prod | **NON REGGE** | L1 | G2-§4-3 | 🎯 **La contro-evidenza sta nella stessa ondata e ribalta il segno della riga.** G2-§4-3, verbatim: «**Autorizzazione PROD precoce: «Applica via MCP ora» (D38) avviene *prima* della lezione TEST≠PROD (D40). Contro-evidenza diretta su env-safety L3: impara correggendo, non prevenendo.**» Una riga il cui unico contenuto è «ha imparato dopo aver sbagliato» non può valere L3 («ha corretto l'agente»): qui è l'agente ad aver corretto lui. **Scende a L1 — eseguita con guida.** |
| F1 | L3 | admin-no-password-reset | **REGGE** | — | F1-§4-3 | F1-§4-3 è la conferma già trovata da S3 (FU-032 annullato). Regge, ed è l'unica L3 di F1 con contro esplicita. |
| D2 | L3 | manual-rls-proof / QA umana | **REGGE** | — | D2-§4-5 · D2-§4-11 · D2-§4-12 · D2-§4-2 | Quattro contro nella stessa ondata e sono pesanti: «gate `is_active` solo app, non RLS — difesa superficiale» (C05), «funzionante ≠ sicuro: fix login anon SELECT poi sostituito da RPC» (C11), «account di test legati a progetto PROD — contraddizione a env-safety» (C12), «password QA deboli su richiesta» (C02). La PROVA MANUALE la fa (D2-D37); ciò che prova era spesso insufficiente. Regge a L3 come pratica, con il livello di sicurezza registrato in §7 (assenza #7 di S3). |
| A9 | L3 | prod-ops / prod-gate / env-parity | **REGGE** | — | A9-§4-6 · A9-§4-8 · A8-§4-2 | A9-§4-6 «migrazione 054 fuori repo, emersa solo all'audit release»; A8-§4-2 «053/054 applicate su remoto, file rimossi dal repo — debito di allineamento»; A9-§4-8 «edge limiti PROD ritardato». Regge come governo del rilascio; la parità dei file non tiene. Registrato in §7. |
| A9 | L3 | product-scoping | **REGGE** | — | A9-§4-2 · A9-§4-5 | A9-§4-5 «cascata prune→contatori→refresh: tre giri dopo «preferisco B» — scoping prompt incompleto, non blind»; A9-§4-2 «privacy two-tab: due fix falliti, stuck fino al 19-06». Regge, con il costo. |
| A8 | L3 | product-scoping | **REGGE** | — | A8-§4-1 · A8-§4-6 · A8-§4-7 | A8-§4-1 è la contro più costosa del corpus: **«G16 / finestra prenotazione: implementata end-to-end (migr. 053/054 + UI + edge) poi «rimuovere» la stessa giornata»**. A8-§4-6/7 mostrano il rovescio virtuoso: vede il bug e sceglie di annotare senza fixare. Regge — lo scoping c'è, e a volte costa un giro completo. |
| A8 | L3 | verify-before-exec / env-test-hygiene | **REGGE** | — | A8-§4-11 · A8-§4-2 | A8-§4-11 «working tree sporco maschera l'esito dei test: impressione «test non funzionano»» — è igiene d'ambiente che gli si ritorce contro. Regge. |
| A7 | L3 | env-safety-prod / smoke-gate | **REGGE** | — | A7-§4-3 · A7-§4-6 | A7-§4-6 li trova («conferma deploy edge TEST e smoke Servizio spesso delegati/non fatti»). A7-§4-3 è a favore: trova l'agente sul branch sbagliato e corregge. Regge. |
| A7 | L3 | public-repo-sync / release-gate | **REGGE** | — | J1-§4-5 · A7-§4-5 | J1-CE5 (nessun tag, release solo su PrenotaZen) è il limite strutturale. Regge la pratica. |
| A2 | L3 | env-safety / PROD-caution | **RIDIM.** | L2 | A2-§4-2 | A2-§4-2, scritta da A2 stesso: «**Env TEST≠PROD (28-05): Matteo inserisce dati «in dev» e non li vede su Vercel — indebolisce il tratto «sempre sicuro sugli ambienti»**». Fine maggio è la finestra dell'apprendimento, non della padronanza. Scende a L2, coerentemente con la riga H2. |
| A2 | L3 | report-unificato | **REGGE** | — | A2-§4-9 · M1-§4-4 | M1-§4-4 (C4) mostra che deve ripetere la richiesta perché gli agenti saltano le sezioni; A2-§4-9 che un report di ripristino non corrisponde al codice. La regola c'è ed è applicata a fatica. Regge a L3. |
| A11 | L3 | product-scoping | **REGGE** | — | A11-§4-3 · A11-§4-4 · A11-§4-5 | A11-CE5 «walk-in «solo coperti» poi ritirato»; CE3 «soglia ritardo 15' e buffer: default assunti da un agente a giugno e mai confermati»; CE4 «D38 capienza pubblica: direzione sì ma rimandata». Regge a L3. Nota: CE3 è **attribuzione impropria in negativo** — impostazioni operative che il prodotto ha e che lui non ha mai ratificato (§6). |
| A11 | L3 | release-gating | **REGGE** | — | A11-§4-7 · J1-§4-1 | Non aggirato: J1-CE1 lo misura ancora chiuso a fine corpus. A11-CE7 avverte del rischio opposto: «CLI/MCP Supabase 401 in chiusura; parità PROD non verificabile — rollout cieco se si forzasse». Regge; è la foglia che i fatti confermano meglio. |
| A11 | L3 | env-safety | **REGGE** | — | A11-§4-7 · A11-§4-9 | A11-CE9 ne trova uno e non è banale: «**debito ambiente lungo: locale di prova «QA 375» travestito dal 16-06 non notato fino a Fase 1**» — un ambiente locale sbagliato passato inosservato per sette settimane. Regge (in agosto non scrive su PROD), con il debito registrato. |

### R06-UX — 21 righe · 18 REGGE · 1 RIDIMENSIONATA · 2 NON REGGE

| Ondata | Liv. | Skill | Verdetto | → | Contro-evidenza (ID) | Cercato / trovato |
|--------|------|-------|----------|---|---------------------|-------------------|
| M4 | L4 | public-layout Prenota (cap, XOR, sticky, striscia) | **REGGE** | — | M4-§4-11 · A8-§4-8 | M4-§4-11 avverte che le «scelte di Matteo» sono attribuzione di sezione, non citazione per bullet — vale per tutte le L4 di M4 (§4.1). A8-§4-8 mostra una consegna incompleta («lavoro ok con riserva» sull'overlay). Il layout è nella skill di Prenota ed è la regola in vigore: regge, con la fragilità di attribuzione dichiarata. |
| M1 | L4 | Mockup HTML prima di scelte UX | **RIDIM.** | L3 | A10-§4-3 · H5-§4-1 | A10-§4-3, mai incrociata prima con questa foglia: «**micro-loop UI senza mockup — digest prezzi/tipografia, card categoria, mobile admin: 2–4 iterazioni**». Cioè la regola non è stata applicata proprio dove sarebbe servita. H5-§4-1 mostra lo stesso loop pixel su un altro prodotto, e H5-D38 (peso 1, 06-07) lo ribalta esplicitamente: «**lasciamo da parte HTML… sarò io a chiedere**». La regola esiste, ma è stata **disapplicata da lui stesso** su un altro progetto e saltata su questo. Fallisce «riusata»: scende a L3. |
| M3 | L3 | soft-delete forever (no hard-delete UI) | **REGGE** | — | M3-§4-8 | M3-§4-8 registra una «divergenza delete sala vs tavolo» fra i debiti aperti: è un'incoerenza di perimetro, non un ritorno all'hard-delete. Regge. |
| H3 | L3 | modal-pattern / dirty-guard | **REGGE** | — | M1-§4-10 · H3-§4-4 | M1-§4-10 (C10) è la contro più curiosa del corpus e riguarda proprio questa foglia: «**«non vedo il modal» = non percepisce `window.confirm`**». Il pattern del modale nasce anche da un suo limite percettivo, non solo da una scelta di prodotto. H3-CE4 critica poi il toast. Regge, con l'origine chiarita. |
| H3 | L3 | prenota-desktop-layout | **REGGE** | — | H3-§4-8 · H2-§4-8 | H3-CE8 «stesso fix layout Prenota: «agente ha sbagliato ancora»» e H2-CE8 «sfondo Prenota: preferenza fixed vs scroll non stabile». La seconda è una contro vera: la preferenza oscilla. Regge a L3 (corregge), con l'instabilità registrata — è la materia della divergenza D3. |
| H2 | L3 | modal-pattern / promo-placement | **REGGE** | — | H2-§4-4 · M1-§4-10 | H2-CE4 «scopre il bug promo conflitto solo dopo uso reale». Doppione funzionale della riga H3 sul modale. |
| D2 | L3 | live-ux-veto | **REGGE** | — | D2-§4-8 · D2-§4-9 | D2-C08 «percorso logout: prove e annulli» e D2-C09 «tema blu vs brief warm: possibile cambio rotta non esplicitato». Il veto dal vivo è la sua pratica costante; la stabilità no. Regge. |
| D1 | L3 | theme-scope-isolation | **REGGE** | — | D1-§4-1 · G3-§4-3 | D1-§4-1 è a favore (lui trova il leak e lo ribalta). G3-§4-3 aggiunge un dato che nessuno aveva collegato: «**storico early vs prodotto maggio: palette Blu/Indaco (CHANGELOG aprile) vs decisioni crema/warm (maggio) → evoluzione di brand non dichiarata come cambio idea**» — è l'handoff «cambio tema indaco→crema» dell'input §9, e la risposta è: il cambio è avvenuto e **non è mai stato verbalizzato come decisione**. Regge la skill; il cambio di tema resta senza autore (§7). |
| C3 | L3 | user-feedback-loop (UX immediato) | **REGGE** | — | C3-§4-5 · C3-§4-8 | C3-§4-5 è la contro dichiarata: «**«user feedback loop chiude sempre» → foto sfondo + card eventi ancora Pending**». E C3-§4-8 è più grave per l'attribuzione: «**«Owner = Matteo» → PRD Owner = «Al Ritrovo - Bologna»; booking «Matteo» = ospite test**». È l'unica L3 di persona in C1–C5 (correzione di S3 all'input) e l'attribuzione è **debole**: il nome nel corpus legacy è spesso un dato di test. Regge a L3 come registrato da C3, con l'attribuzione marcata. |
| B1 | L3 | ui-source-of-truth (mockup) | **REGGE** | — | B1-§4-8 · B1-§4-10 | H5-D38 (06-07, peso 1) c'è ed è ATTINENTE ma va nella direzione opposta: «niente HTML di default; solo su richiesta». Il mockup come fonte di verità è quindi contestato da lui stesso sullo stesso progetto. B1-C08 registra il drift doc. **Resta L3, attribuzione debole, e con una contro di peso 1 che prima non aveva.** |
| B1 | L3 | motion-pacing / signature gestures | **REGGE** | — | B1-§4-7 · B1-§4-10 | B1-C07 è la contro: «spec owner 06-07 non chiusa in UI — FU-014 cascata (gesto-firma) aperta; solo motore». Resta L3 con attribuzione debole: H5 non la copre. |
| A8 | L3 | prenota-background | **REGGE** | — | H2-§4-8 | H2-CE8 lo dice da peso 1: «preferenza fixed vs scroll non stabile». Regge a L3 (è una sua correzione), instabile. |
| A8 | L3 | prenota-accordion | **REGGE** | — | A8-§4-8 | A8-§4-8: «prima consegna incompleta: serve «lavoro ok con riserva»». Regge. |
| A6 | L3 | calendario-badge | **REGGE** | — | M3-§4-8 · A6-§4-6 | M3-§4-8 registra «T13 badge Giorno vs Mese» fra i debiti aperti: una divergenza mai chiusa sulla stessa materia. Regge a L3, con il debito. |
| A6 | L3 | calendario-click-ux | **REGGE** | — | A6-§4-2 | A6-§4-2 è la contro e la conferma insieme: «piano/implementazione iniziale invadente; Matteo corregge a seleziona+CTA, poi CTA sempre — contro di «intervista già completa sul click»». L'intervista non aveva coperto tutto; la correzione è sua. Regge. |
| A4 | L3 | prenota-menu-layout | **REGGE** | — | A4-§4-2 | A4-§4-2 la trova: «brief wrap errato: approva/incolla P0 wrap, poi annulla → **prima direzione prodotto sbagliata sul viewport**». Regge a L3 (la corregge lui), con l'errore iniziale registrato. |
| A3 | L3 | qr-theme-layout | **REGGE** | — | A3-§4-2 · A3-§4-8 | A3-§4-2 (misrouting) e A3-§4-8 («FU-028 / path sbagliato: chiusura su tile mentre il tenant usa full-page») colpiscono il bersaglio delle correzioni, non la correzione. Regge. |
| A3 | L3 | prenota-bg-fixed | **REGGE** | — | H2-§4-8 | Doppione funzionale: stessa materia, stessa contro di peso 1 (preferenza non stabile). Non è una conferma indipendente. |
| A2 | L3 | prenota-palette / form-validation | **REGGE** | — | A1-§4-11 · H1-§4-5 | H1-§4-5 da peso 1: «**cambio idea estetico esplicito: testo bianco/nero fasce; annulla lo spazio del footer dopo aver insistito — contro a «sempre sa cosa vuole visualmente»**». A1-CE11 «altezze card +25% «troppo alto» poi ripristino». Regge a L3 (le correzioni sono sue), ed è la prova più diretta della divergenza D3. |
| A1 | L3 | menu-qr-nav | **NON REGGE** | L2 | A1-§4-7 · A1-§4-8 | ⚠️ Riga senza nessun ID (S3 §3.3, A1 dichiara 0/18). E A1 porta due contro sulla stessa materia: CE7 «redesign QR: 5 fix dopo «test visivo»; la pill era un filtro» e CE8 «collaudo layout QR solo «consigliata» — manual-qa non attestata». S3 la sosteneva con S1 F062 (peso 1): quella prova regge la DECISIONE, non il livello L3 di questa riga. Scende a L2. |
| A1 | L3 | public-booking-ux | **NON REGGE** | L2 | A1-§4-9 · A1-§4-13 · A1-§4-14 | ⚠️ Stessa situazione. CE9 «Prenota v2 fondazione: **zero domande in sessione — delega al plan**», CE13 «gap mobile card: continua a vedere il problema dopo il fix — loop collaudo non chiuso», CE14 «parole sue mediate dall'agente». Una L3 («ha corretto l'agente») sostenuta da zero ID e smentita da «zero domande in sessione» non regge. Scende a L2. |

### R07-LINGUAGGIO — 7 righe · 3 REGGE · 3 RIDIMENSIONATA · 1 NON REGGE

| Ondata | Liv. | Skill | Verdetto | → | Contro-evidenza (ID) | Cercato / trovato |
|--------|------|-------|----------|---|---------------------|-------------------|
| M1 | L4 | Vocabolario governato + livelli libertà | **RIDIM.** | L3 | M1-§4-17 · A3-§4-3 · M1-§4-7 | Stessa contro della riga A3 `grilletti-map`, e qui pesa di più perché è la foglia portante del ramo: **M1-C17 «Liv.2 «main»/«menù originale» a 0 esiti (poi confermate tenere)»** e A3-§4-3 «motore Liv.2 fermo, 0 esiti live». Il vocabolario è governato **al livello 1**; il livello 2 è scritto e non gira. M1-C7 aggiunge che non capisce gli elenchi con sigle, cioè il vocabolario tecnico che lui stesso non ha governato. Scende a L3: la regola c'è ed è sua, ma metà del meccanismo non è riusato. |
| M1 | L4 | Comunicazione schermata+effetto | **REGGE** | — | A5-§4-4 · M1-§4-6 | A5-§4-4 la trova ed è di peso 1 nella sostanza: «**comunicazione fallita su Obiettivo C: «ho capito quasi niente» — jargon orchestrator prima della tabella di comunicazione**». H3-CE5 dice la stessa cosa da peso 1. La regola è violata dagli agenti, e lui la fa rispettare ogni volta. Regge — è codificata in questo stesso CLAUDE.md. |
| G3 | L4 | explanation-schema / spiegamelo-semplice | **RIDIM.** | L3 | G3-§4-1 · G3-§4-2 | **È una regola privata.** G3-§4-1, scritta da G3 stesso: «`Metodo_spiegazioni_*` è più ricco di `COMUNICAZIONE_UTENTE_SKILL`: Matteo sa come vuole essere spiegato; **il sistema skill pubblico non lo ha assorbito**». S3 ha lasciato la lacuna L-S3-2 aperta proprio su questo, e la risposta provvisoria era «non è confluito». L4 richiede una regola **riusata**: un file che vive in `_lavoro/`, non citato da nessuna skill ufficiale e che gli agenti spesso non vedono (G3-§4-2), non è riusato dal sistema. **Scende a L3** — resta la fonte più personale del corpus e la sua autorialità non è in discussione: è il riuso che manca. |
| B1 | L4 | domain-lexicon (4 case + elementi) | **RIDIM.** | L4 di persona | B1-§4-4 · B1-§4-10 | ⬆️ **RISALE DA «SISTEMA» A «PERSONA», ed è il match più netto del bersaglio #3.** H5-D37 (06-07-26, MATTEO ORIGINATA, peso 1) porta **la stessa etichetta di skill**, `domain-lexicon`, con citazione verbatim: «prova haccp = tutti i dati… per controlli haccp». Più H5-D42 (09-07) sull'onboarding: «Ruolo = preset… Categoria = assegnazione… SOLO 1 ruolo… N categorie». L'attribuzione che B1-C10 rimandava a H5 REGGE. ⚠️ Ma H5 assegna a questa materia **L2**, non L4: il livello alto viene dal file di regola di B1, il soggetto da H5. Le due fonti insieme fanno un L4 di persona; nessuna delle due lo fa da sola. |
| H3 | L3 | user-language | **REGGE** | — | H3-§4-5 · A5-§4-4 | H3-CE5 «orchestrator: «ho capito quasi niente di cosa devo scegliere»» è una contro di peso 1 sulla COMPRENSIONE, che è l'altra faccia della stessa skill. Regge. |
| B3 | L3 | copy-discipline | **NON REGGE** | L2 | B3-§4-5 · B3-§4-6 | ⚠️ Riga senza nessun ID (B3 dichiara 0/12, S3 §3.3). E B3 porta le due contro che la smontano: **CE5 «occorrenze «Matteo» = nome di test / URL — densità «Matteo» quasi zero»** e CE6 «regime rastrello: molte decisioni prodotto senza «chi»». In un perimetro dove il suo nome compare come dato di test, una L3 attribuita a lui senza ID non regge. Scende a L2. |
| A5 | L3 | comunicazione | **REGGE** | — | A5-§4-4 | A5-§4-4 è la contro e viene dalla stessa ondata: «ho capito quasi niente». Ed è lui a dirlo — il che rende la skill (pretendere di capire) più forte, non più debole. Regge. |

### R08-COMPLIANCE — 7 righe · 4 REGGE · 1 RIDIMENSIONATA · 2 NON REGGE

| Ondata | Liv. | Skill | Verdetto | → | Contro-evidenza (ID) | Cercato / trovato |
|--------|------|-------|----------|---|---------------------|-------------------|
| M4 | L4 | legal-vendita / pricing-posizionamento | **RIDIM.** | L3 | A7-§4-1 · G1-§4-6 · M4-§4-1 | A7-§4-1 è la contro decisiva e non era mai stata incrociata con questa L4: «**listino oscillante lo stesso giorno: l'intervista fissa Pro 79 e fondatori 3 mesi; la chiusura senior scrive Pro 69 e 6 mesi — decisione commerciale non stabile al primo passaggio, skill pricing L3 indebolita**». G1-§4-6 aggiunge «prezzi e AL-F esplicitamente in attesa, nessuna attività aperta». È esattamente il motivo per cui S3 non ha dato nessun L4 a R09: un listino è **uno stato fotografato**, non una regola. La stessa logica vale qui. Scende a L3. Il conflitto **N-2** resta aperto (§7). |
| M4 | L4 | legal-metodo (docs in repo, no SaaS privacy) | **REGGE** | — | M4-§4-2 · M4-§4-1 · M4-§4-3 | No: sono nella repo, ed è verificabile (`docs/legal/`). Le tre contro dicono altro — che sono bozze v0.1 «da professionista» (§4-2), che P.IVA/contratto/fattura sono ancora ⬜ (§4-1), che l'email privacy@ è rimandata a una Gmail personale (§4-3). Il METODO regge; il contenuto è incompleto. Regge come L4, con l'incompletezza registrata. |
| B1 | L4 | compliance-lock (fonte unica numeri) | **NON REGGE** | L4 di sistema (confermato) | B1-§4-5 · B1-§4-10 | 🎯 BERSAGLIO #3, secondo esito negativo. Le cinque M-VOCE di H5 su BHM (D34, D36, D37, D40, D42) non toccano il lock di compliance. Resta «di sistema». E B1-C05 aggiunge la contro nel merito: «compliance «viva» senza validazione umana — gate-3: 23 regole HACCP usate ma ancora `pending`». |
| M4 | L3 | legal-gdpr-priorità | **REGGE** | — | A7-§4-2 · A8-§4-4 | A7-§4-2 le trova: «**alza poi rilassa il timing: G2/B2/S2 portati a bloccanti, poi riformulati come «entro il primo mese», non blocco al primo incasso**». A8-§4-4: «opt-out automatico esplicitamente fuori scope — gap legale dichiarato, non chiuso». Regge a L3 (la priorità è sua e documentata), con l'oscillazione registrata. |
| M4 | L3 | cookie no-banner | **REGGE** | — | M4-§4-12 | M4-§4-12 dichiara la ricerca e l'esito: «non trovata inversione». Confermo su tutte le 39 ondate: nessuna contro-evidenza tocca i cookie. **CERCATA, NON TROVATA.** Regge, ma è **prova fragile**: fonte unica, peso 3–4, nessun transcript (§5). |
| A8 | L3 | crm-privacy | **REGGE** | — | A8-§4-4 · C2-§4-7 · C3-§4-7 | Trovati, ma nei corpora legacy e non su CB-v2: C2-§4-7 «PII in artefatti di test: 9 `error-context.md` con email di login nei dump DOM»; C3-§4-7 «credenziali in chiaro in CORE/WORKFLOW/NAVIGATION»; e D2-C14 «credenziali in `ADMIN-LOGIN.md` in archivio». Su CB-v2 la privacy CRM regge; **l'igiene dei segreti nei progetti precedenti no**, e nemmeno in `_lavoro` (G3-§4-5). Registrato in §6/§7. |
| A2 | L3 | privacy-docs _lavoro | **NON REGGE** | L1 | Piano §2.1 punto 3 · G3-§4-5 · C2-§4-1 | **La contro-evidenza non è «non cercata»: è disponibile e CONTRARIA.** Il piano §2.1 punto 3 registra che **77 file di `docs/_lavoro` sono tracciati da git**, incluse `Documenti Legali/` e `Valutazione prezzo vendita/`. G3-§4-5 aggiunge che sotto `e2e-s4/` esistono file `creds`/`.env`. C2-§4-1 mostra il precedente: 11 file personali (CV, visti, profilo) nella root del repo BHM fino al cleanup di gennaio. La regola è scritta e **nei fatti non ha tenuto**. S3 l'aveva già declassata da L4 a L2 sulla riga M1; questa è la riga gemella di A2 e va più in basso: una regola contraddetta dai fatti non è «decisa da solo con un motivo», è **enunciata**. Scende a L1. È il caso-scuola: *l'esistenza del file di regola non è la prova che la regola vale*. |

### R09-VENDITA — 3 righe · 3 REGGE · 0 RIDIMENSIONATA · 0 NON REGGE

| Ondata | Liv. | Skill | Verdetto | → | Contro-evidenza (ID) | Cercato / trovato |
|--------|------|-------|----------|---|---------------------|-------------------|
| M4 | L3 | servizio-governance (D35, GTM, config 2 luoghi) | **REGGE** | — | M4-§4-6 · M3-§4-6 · J1-§4-1 | M3-§4-6 trova l'incoerenza («Inventario mette «Accetta arrivi tardivi» in Onboarding; Guida/Intervista dicono «solo console» — stesso pack, due verità») e J1-CE1 il fatto: il capitolo è **fermo su `env/test` dal 23-06**. La governance esiste come decisione; il capitolo non è arrivato in produzione. Regge a L3, con il debito che è il rischio principale del dossier (§7). |
| A2 | L3 | summary-exceptions / card-price-live | **REGGE** | — | A2-§4-1 · A1-§4-12 | A2-§4-1 e A1-CE12 dicono la stessa cosa da due ondate: «due report ✅ contraddittori (nascosto vs × ospiti)», «contraddizione prezzo carosello lo stesso giorno». La satellite di H2 (riga 6) aggiunge il verdetto già scritto: «in H2 **non** emerge una coppia chiara nelle voci brevi campione → **aperto a J1/H3**, non forzare». H3 non l'ha chiuso. **Conflitto I-4: aperto da A2, riaperto da H2 e H3, non chiuso da me** (§7). La skill regge a L3; il caso singolo resta irrisolto. |
| A10 | L3 | go-to-market | **REGGE** | — | A10-§4-1 · G1-§4-6 | A10-§4-1 è la contro più fine del corpus sull'autonomia: «**freno GTM entrato in masterplan senza mandato — parere esterno «10–15 Classic»; Matteo lo nega e lo toglie. Prova L3, ma anche vulnerabilità: materiale esterno era già in un documento di prodotto**». Regge (lo toglie), con la vulnerabilità registrata: **un parere di terzi era entrato nei documenti di prodotto senza passare da lui**. |

### R10-FORMAZIONE — 3 righe · 2 REGGE · 1 RIDIMENSIONATA · 0 NON REGGE

| Ondata | Liv. | Skill | Verdetto | → | Contro-evidenza (ID) | Cercato / trovato |
|--------|------|-------|----------|---|---------------------|-------------------|
| M1 | L3 | Educazione reciproca (senior educa Matteo) | **REGGE** | — | G1-§4-2 · A3-§4-10 | G1-§4-2 è la contro decisiva: «sistema didattico progettato, poco agito — coda spaced-repetition vuota, glossario tutto 🌱, **una sola «Lezione della chat»**». A3-§4-10 data il mandato («è di A4, 02-06; qui c'è *come lavoriamo*, non ancora *insegnami*»). Regge a L3 come decisione presa, non come pratica. ⚠️ Il conflitto **N-3** (A4 dice APPROVATA, M1 dice ORIGINATA) **resta aperto**: nessuna fonte di peso 1 sul 04-06 lo dirime, e A3-§4-10 non lo scioglie — sposta solo la data del mandato ad A4, il che se mai **rafforza la lettura APPROVATA**. Non lo chiudo (§7). |
| H3 | L3 | meta-reflection | **REGGE** | — | H3-§4-6 | H3-CE6 registra che sullo scope dell'indagine «autorizza gitignored/privato in blocco». La foglia poggia su tre ID di peso 1 tutti del 06-08-26 — cioè su questa stessa indagine. **Prova fragile per data**: è l'unico segnale di meta-riflessione del corpus e coincide con la richiesta che ha generato il corpus (§5). |
| G1 | L3 | didactic-system / lesson-of-chat | **RIDIM.** | L2 | G1-§4-2 · E1-§4-5 · C5-§4-5 | Handoff onorato, e cade. G1-§4-2 lo dichiara: **una sola «Lezione della chat», coda vuota, glossario tutto 🌱, storico richiami vuoto**. E c'è una seconda prova indipendente che nessuno aveva collegato: **E1-§4-5, sul progetto di trading — «PROFILO_SCOLASTICO E1: tutte 🌱, zero lezioni»**. La stessa scuola, copiata su un altro progetto, è vuota anche lì. C5-§4-5 mostra il precedente storico: le regole didattiche del legacy non sopravvivono nel corpus attivo («codifica ≠ adozione duratura»). Un sistema progettato una volta e mai frequentato, in due progetti, non è L3. Scende a L2. |

### R11-CODICE — 1 riga · 1 REGGE · 0 RIDIMENSIONATA · 0 NON REGGE

| Ondata | Liv. | Skill | Verdetto | → | Contro-evidenza (ID) | Cercato / trovato |
|--------|------|-------|----------|---|---------------------|-------------------|
| M1 | L4 | Context-knowledge (codice=verità) | **REGGE** | — | M1-§4-19 · A3-§4-5 · B2-§4-5 | Il contrario, e da tre direzioni: M1-C19 «checklist obsoleta: collaudo gonfio, voce su un pulsante rimosso mesi fa», A3-§4-5 «report ↔ codice: «da togliere» su carta ma ancora nel picker», B3 `doc-vs-live`. La regola «il codice è la verità, i `.md` la specchiano» è quella che risolve tutti e tre i casi ed è nel CLAUDE.md: riusata. Regge. ⚠️ Resta ciò che S3 ha già detto: è una regola **documentale**, non una competenza di scrittura di codice. |---

## §4 — Il caso strutturale: le 21 L4 di M1 e M4

S3 §0 lo ha misurato e me lo ha consegnato come bersaglio #1: **M1 e M4 producono 21 delle 40 L4 di
persona, il 52,5%**, e lo fanno perché il loro perimetro *è la documentazione di skill già scritta*.
La prova che «è diventata regola» è il file stesso. S3 scriveva: «*se S4 ne fa cadere metà, l'albero
cambia forma*».

**Non ne cade metà. Ne cadono 5 su 21 (23,8%), e la concentrazione resta identica.**

| | Prima | Dopo |
|---|-------|------|
| L4 di persona da **M1 + M4** | 21 su 40 | **16 su 31** |
| **quota** | **52,5%** | **51,6%** |

Perché la quota non si muove: sono cadute anche 4 L4 di altre ondate (A3, A4, A6, G3). **Il bias di
concentrazione è confermato e non è stato risolto da questa ondata.** Ma la domanda vera non era la
quota — era se quelle righe stiano in piedi da sole.

### §4.1 — Quali reggono solo sulla circolarità, riga per riga

Il test: **esiste, fuori dalla linea M, almeno una riga di A, di H o di J che confermi la stessa
regola?** Se sì, l'L4 non poggia sul file che la enuncia. Se no, la prova si morde la coda.

| # | Ondata | L4 sopravvissuta | Fonte indipendente | Peso |
|---|--------|------------------|--------------------|------|
| 1 | M1 | Controverifica imparziale | **H4-D06** (24-02-26) · A5-D29 · H3-D26 · M3-D13 — S1 F030, 4 righe su 3 linee | **1** |
| 2 | M1 | Sicurezza PROD (ask, non deny) | **H2-D05** («*Se risponde `rwuxgvld` fermati*») · M2-D09 · M3-D48 · G1-D27 — S1 F001 | **1** |
| 3 | M1 | Comunicazione «schermata + effetto» | **H1-D57** (15-05-26, **anteriore al report che la registra**) — S1 F061 | **1** |
| 4 | M4 | public-layout Prenota | **H3-A04, H3-D11, H3-D12** (layout desktop) | **1** |
| 5 | M1 | Soft vs enforcement (hook > markdown) | A3-D43, A3-D44 (`cursor-enforcement`) | 3 |
| 6 | M1 | Annota ≠ codifica | A3-§4-1 (l'evento che la origina) · A4-D07 | 3 |
| 7 | M1 | Profili Esecuzione / Verifica / Meta | A4-D42, A4-D44, A4-D45 (nascita del profilo Verifica, 04-06) | 3 |
| 8 | M1 | Separazione «lavoro ok» / «fai report finale» | A3-D40, A3-D41 — S1 T03 e T10 | 3 |
| 9 | M1 | Controtest / blindatura di prodotto | A5-D29 · A6-D35, A6-D39 | 3 |
| 10 | M1 | Disambiguazione Prenota / QR / menu | A3-D09, A3-D25, A3-D27 — S1 T06, 8 righe | 3 |
| 11 | M4 | area-routing Prenota ≠ QR ≠ magazzino | A3-D09, A3-D25, A3-D27 — stessa regola di #10 | 3 |
| 12 | M4 | blindatura (intervista + Classic in prod) | A5-D14, A5-D15, A5-D22, A5-D26 — S1 T08, 8 righe | 3 |
| 13 | M4 | legal-metodo (docs legali nella repo) | **A7-D16** (12-06-26, MATTEO SCELTA): «*Contratto B2B: bozza repo → avvocato*» | 3 |
| 14 | M1 | Context-knowledge (il codice è la verità) | B3 `doc-vs-live` — ⚠️ **B3 dichiara zero ID su 12 righe**: conferma debole | 3 debole |
| 15 | M4 | product-capabilities intolleranze universali | **H2-D23** («*intolleranze = solo testo libero*») — ⚠️ tocca la **materia**, non la regola dell'universalità | 1 parziale |
| 16 | M4 | **product-auto-select card singola** | **NESSUNA** | — |

**Il risultato, e non è quello che S3 temeva.**

> **Una sola L4 su sedici — `product-auto-select card singola` (M4-D37) — regge unicamente sulla
> circolarità.** Una seconda (`intolleranze universali`) ha una conferma solo parziale, e una terza
> (`context-knowledge`) ha una conferma debole perché viene da un report senza ID. Le altre tredici
> hanno una fonte fuori dalla linea M, e **quattro ce l'hanno di peso 1: sono le sue parole in chat,
> datate, verbatim.**

Su `product-auto-select` M4 aveva già dichiarato il proprio limite, ed è la frase che chiude il
caso: «*cercata contro-evidenza… **non trovata inversione**; restano aperti solo i limiti di peso 4
(**manca transcript**)*» (M4-§4-12). Non c'è inversione e non c'è conferma: c'è **un solo file, che
dice di sé che è una regola.**

**Che cosa resta vero del §0 di S3, allora.** Resta vero il rischio metodologico — quelle ondate
producono metà delle L4 perché leggono file di regola — e resta vero che **la concentrazione non è
diminuita**. Non è vero che le L4 di M1/M4 siano infondate: **quindici su sedici hanno un appiglio
altrove.** La circolarità è un rischio di *conteggio*, non di *fondamento*. Chi scrive S6 deve dire
questa frase per intero, non solo la prima metà.

### §4.2 — Il risultato più pesante dell'ondata, e non era in nessuna lista di bersagli

**R05 — sicurezza degli ambienti — è il ramo più voluminoso dell'albero (103 righe), quello che
S3 §4.1 indica come divergenza D1 e come «la domanda migliore per l'interrogazione». Sei
contro-evidenze indipendenti, che nessuno aveva mai messo in fila, dicono la stessa cosa:
la competenza c'è, ma non c'era all'inizio. È stata imparata sbagliando.**

In ordine di data, e con il peso accanto:

| Quando | Che cosa dice la contro-evidenza | Fonte | Peso |
|--------|----------------------------------|-------|------|
| feb–mar 26 | «*Capisce l'obiettivo (test ≠ prod) ma **sbaglia l'esecuzione**: worktree/branch, file di sessione spariti, «repository intera è vuota», restore DB con centinaia di errori*» | **H4-§4-2** (H4-C02) | **1** |
| 15-05-26 | «*Autorizzazione PROD precoce: «Applica via MCP ora» (G2-D38) avviene **prima** della lezione TEST≠PROD (G2-D40). **Impara correggendo, non prevenendo**.*» | **G2-§4-3** | 3 |
| inizio periodo | «*MCP su URL PROD (`rwuxgvld…`) — wiring «per lavorare», **senza nel messaggio la distinzione TEST/PROD che oggi è regola dura***» | **H1-§4-2** | **1** |
| 28-05-26 | «*Matteo inserisce dati «in dev» e non li vede su Vercel — **indebolisce il tratto «sempre sicuro sugli ambienti»***» | **A2-§4-2** | 3 |
| fino al 29-05-26 | «*Fino al 29-05 **chiede chiarimenti** su come non confondere TEST/PROD*» | **H2-§4-2** (CE2) | **1** |
| (skill attuale) | «*`env-safety` **non è dimostrabile come ORIGINATA** da Matteo in M3… elevare a L4 «skill di Matteo» da questi soli file = **sovra-attribuzione***» | **M3-§4-4** | 3 |

**Tre di queste sono di peso 1: sono le sue parole.**

**Che cosa cambia, e che cosa no.**

- **La regola regge.** `env-safety` di M2 (L4) e `Sicurezza PROD` di M1 (L4) restano **REGGE**: la
  regola è scritta in quattro file di skill diversi (S1 F001), è nel `CLAUDE.md` di progetto, ed è
  confermata dai fatti — J1-D07/D08, peso 2, e il database di produzione fermo a 062. Funziona
  oggi.
- **Non regge la narrazione.** S3 §5.1 data la regola al **22-05** e la chiama, in §4 R05,
  «**PARLATA: fortissima e originaria**». «Originaria» è la parola che non regge: al 29-05 stava
  ancora chiedendo come non confondere i due ambienti, e a metà maggio aveva già autorizzato una
  scrittura su PROD. **È una competenza acquisita per correzione, e le prime tre L3 che la
  raccontano cadono proprio perché raccontano la finestra dell'apprendimento**, non della
  padronanza: `H2 env-safety` → L2, `A2 env-safety / PROD-caution` → L2, `G2 env-safety /
  test-prima-prod` → **L1**.
- **Il caso G2 è il più netto del corpus.** La riga è L3 («ha corretto l'agente vedendo un errore
  che l'agente non vedeva»), e la contro-evidenza sta **nella stessa ondata che le assegna il
  livello**, con questo testo: «*impara correggendo, non prevenendo*». Qui l'agente ha corretto
  lui. **L1 — eseguita con guida.**

> **Perché questo è il risultato più importante e non stava in nessuna lista.** Nessuno dei sette
> bersagli di S3 §9.3 lo nominava. Le sei righe erano sparse in sei ondate diverse — due nella
> linea H (peso 1), tre nella linea A, una nella M — e **nessuna ondata di mining poteva vederle
> tutte**, perché ognuna vedeva solo il proprio perimetro. Si vedono solo mettendo in fila 352
> contro-evidenze e ordinandole per data. È esattamente il lavoro per cui questa ondata esiste.

---

## §5 — Le prove fragili

Il mandato chiede l'elenco delle righe che poggiano su **una sola fonte di peso 3 o 4**, su una
**deduzione**, o su **nessun ID**. L'ho calcolato meccanicamente su tutte e 153, in quattro livelli
di fragilità crescente.

| # | Livello di fragilità | N | Che cosa vuol dire |
|---|---------------------|---|-------------------|
| **T1** | **Nessun ID di evidenza** | **4** | la riga afferma senza indicare dove guardare |
| **T2** | **Un solo ID**, da una linea di peso 3 o 4 | **25** | un solo appiglio, e non è né una sua parola né un fatto |
| **T3** | **Due ID**, entrambi della stessa ondata di peso 3 o 4 | **52** | fonte unica: se quel report sbaglia, la riga cade con lui |
| **T4** | Poggia su una **correzione `DEDOTTA`** (mai citata verbatim) | **2** | la prova è una ricostruzione, non una frase |
| | **Unione (righe distinte)** | **82 su 153 — il 53,6%** | |

**Più di metà delle skill L3/L4 dell'albero poggia su una fonte sola, e quella fonte non è né lui
né un fatto.** Non è un difetto di S3: è la forma del materiale, e nessuna ondata poteva vederlo
senza contare. Va in testa al dossier accanto all'avvertenza del §0.

### §5.1 — T1: le 4 righe senza nessun ID

| Ondata | Liv. | Skill | Esito in questo report |
|--------|------|-------|------------------------|
| A1 | L3 | `scope-control` | **NON REGGE → L2** |
| A1 | L3 | `menu-qr-nav` | **NON REGGE → L2** |
| A1 | L3 | `public-booking-ux` | **NON REGGE → L2** |
| B3 | L3 | `copy-discipline` | **NON REGGE → L2** |

S3 §3.3 le difendeva, e con una ragione: «*non è sciatteria — scrivono l'evidenza come frase*», e
A1 si chiude con una riga di disciplina esplicita («*L4 pieno: nessuna dichiarata solo su questo
perimetro senza conferma M1/M4/H*»). **Confermo la lettura di S3 sull'intenzione e la ribalto
sull'esito:** la disciplina c'era, ma quando qualcuno cerca il contrario, una frase non è una prova
citabile — e in tutti e quattro i casi la Sezione 4 dello **stesso report** porta contro-evidenze
sulla stessa materia (A1-CE5, CE7, CE8, CE9, CE13, CE14 · B3-CE5, CE6). La lacuna **L-S3-3** è
quindi chiusa in negativo: le 44 righe senza ID non sono recuperabili senza riaprire i corpora, e
le 4 che toccavano il livello di una foglia L3/L4 sono cadute.

### §5.2 — T2: le 25 righe con un solo ID di peso 3

Le più esposte, perché sono **L4**:

| Ondata | Skill | ID unico |
|--------|-------|----------|
| **M4** | **product-auto-select card singola** | M4-D37 — ⚠️ è anche l'unica L4 del §4.1 senza fonte indipendente |
| **M4** | product-capabilities intolleranze universali | M4-D36 |
| **A4** | skill-alignment | A4-D26 — *già RIDIMENSIONATA a L3* |
| M1 | Vocabolario governato + livelli libertà | D01–D04 — *già RIDIMENSIONATA a L3* |
| M1 | Profili Esecuzione / Verifica / Meta | D05–D06 — regge, ma su un solo blocco di ID |

Le altre 20 sono L3 e stanno in `prove_fragili.txt`. Quattro righe con un solo ID sono invece di
**peso 1** e non entrano in questo elenco: H4-D06 (`skill-authoring`), H4-A03 (`owner-qa-gate`),
H1-D08 (`multi-tenant-qa`), H1-D46 (`email-provider`).

### §5.3 — T4: le 2 righe che poggiano su una deduzione

| Ondata | Skill | ID `DEDOTTA` |
|--------|-------|--------------|
| D2 | `closed-decision-prompt / M-REGIA` | D2-A13 |
| H5 | `multi-project-ops` | H5-A08 |

Sono poche, ed è un merito del mining: la regola «*ogni correzione agente→Matteo dedotta va marcata
`DEDOTTA`, mai `DIRETTA`*» (piano §2.1) è stata rispettata. Ma vanno lette con S2 §0 accanto: sulla
linea H le A→M `DIRETTA` sono **zero su cinque finestre**, quindi ogni riga che poggia su una
correzione dell'agente in quel perimetro poggia necessariamente su una ricostruzione.

---

## §6 — Attribuzione impropria, nelle due direzioni

Il mandato chiede di cercarla in entrambi i sensi. Le ho trovate entrambe, e non sono simmetriche:
**i meriti attribuiti impropriamente sono molti di più degli errori.**

### §6.1 — Meriti non suoi che un report gli ha attribuito

| # | Che cosa | Fonte | Gravità |
|---|----------|-------|---------|
| 1 | **L'autore git non è l'autore del codice.** Risulta autore di **1.074 commit**; J1-A07 registra la regola. Più **25 commit di Cristiano Tulli** (console, 22–23 giugno) | **J1 §5.b riga 6** · J1-D12 · J1-A07 | **alta** — conflitto **I-8**, e resta APERTO (§11) |
| 2 | **L'accettazione della Console non è sua.** M2-D30: «*test eseguiti **nei panni di Matteo**… ACCETTATA*», e la riga porta `Chi = INCERTO`, `Autonomia = APPROVATA` | **M2-D30** · M2 §6 | **alta** — è uno sprint accettato da un altro a suo nome |
| 3 | «*Approvazioni «Approved» / «APPROVATO PER PRODUZIONE» **senza firma Matteo** nei plans e nei report mobile → rischio di **gonfiare l'autonomia owner***» | **D1-§4-5** | alta |
| 4 | «*Firma «**Conferma Umana**» = **Agente 3**, non Owner*» | **C1-§4-1** | alta — è il «gate umano» del punto zero, e non è umano |
| 5 | «*«Owner = Matteo» → PRD Owner = «**Al Ritrovo - Bologna**»; booking «Matteo» = **ospite test***» | **C3-§4-8** | alta — nel legacy il suo nome è spesso un dato di prova |
| 6 | «*Occorrenze «Matteo» = **nome di test / URL** — densità «Matteo» quasi zero*» | **B3-§4-5** | alta |
| 7 | «*Lezioni firmate **Agente 1**, non Matteo — attribuire L3/L4 a Matteo qui sarebbe allucinazione*» | **C5-§4-1** | alta |
| 8 | «*«Scelte di Matteo» **a blocco** in PRENOTA/MENU_QR §3: **attribuzione di sezione**, non citazione M-VOCE per ogni bullet*» | **M4-§4-11** | media — tocca tutte le L4 di M4 |
| 9 | «*63 report in un giorno = rischio di attribuire all'owner scelte tecniche degli esecutori WP-A/C… residuale INCERTO su verdetti «ok prod» scritti dall'agente prima del registro Matteo*» | **A7-§4-8** | media — è la giornata del 12-06, la più densa del corpus |
| 10 | «*Fonti peso 3: «decisioni dell'utente» senza virgolette → molte righe restano INCERTO. **Non gonfiare autonomia**.*» | **G2-§4-1** · G3-§4-6 · E2-§4-1 · I1-§4-5 · I2-§4-7 | media — cinque ondate lo dicono di sé |
| 11 | «*Quasi nessun Q1 formale «Domande di chiusura» su 25–26: **parole sue mediate dall'agente***» | **A1-§4-14** · A1-§4-5 | media |
| 12 | Le **14 righe `A→M` di M1** non sono «l'agente mi ha corretto» ma «l'agente ha deviato», e 13 su 14 hanno esito `rifiutata`. Le **6 di C1** sono peer review agente↔agente, e C1 lo dichiara | **S2 §0.1** | media — gonfia il conteggio nella direzione opposta |

**Il caso 5 e il caso 6 insieme dicono una cosa che va detta esplicitamente:** nei corpora legacy
(B3, C3) la stringa «Matteo» è **più spesso un dato di test che una firma**. Chi cercasse
attribuzione con un grep sul nome otterrebbe un risultato sistematicamente falso.

### §6.2 — Errori non suoi che un report gli ha attribuito

| # | Che cosa | Fonte |
|---|----------|-------|
| 1 | «*Leak tema su /prenota… **contro-evidenza per l'agente**, prova L3 per Matteo*» · «*Placement sul form pubblico **da un agente**, poi rimosso*» · «*Ciclo lungo su num_guests: root-cause incompleto **lato agente***» · «*Padding: 4 tentativi Tailwind falliti — **la decisione tecnica è agente***» | **D1-§4-1…4** — D1 le marca da solo |
| 2 | «*MASTERPLAN «E2E shell 20/20» **falso**: esecutore corretto (19+1 skip), **indice gonfiato***» | **A5-§4-3** |
| 3 | «*Premesse ereditate **false** (difetti aperti, 18 commit) credute finché riverificate*» — lo stato falso era stato scritto da altri, e M1-§4-14 registra il pattern come ricorrente (×3) | **A11-§4-10** · **M1-§4-14** |
| 4 | «*Soglia ritardo 15' e buffer: «**default assunti da un agente a giugno e mai confermati**»*» — impostazioni operative che il prodotto ha e che lui non ha mai ratificato | **A11-§4-3** |
| 5 | «*Script verifica T1 KO **falso positivo**: selettori agente sbagliati; **prevale il QA di Matteo***» | **A6-§4-7** |
| 6 | «*Agente **rimuoveva turni Pro** (fix-qa #4): Matteo ferma — non-bug*» · «*Agente **sul branch sbagliato**: Matteo corregge*» | **A6-§4-3** · **A7-§4-3** |
| 7 | «*Gli agenti dichiarano completamento/APPROVED; l'utente (QA) ritrova blocker critici*» · «*Claim DB poi smentiti: «migration 015 / campi presenti» **falsi su DB live***» | **B2-§4-1** · **B2-§4-5** |
| 8 | «*Debito sicurezza consapevole: disabilitare RLS «temporaneamente» — **scelta agente**; nessuna citazione di ratifica di Matteo*» | **C2-§4-3** |

**La asimmetria è il dato.** Dodici casi di merito attribuito impropriamente contro otto di errore —
ma soprattutto: **gli errori altrui i report li marcano da soli** («contro-evidenza per l'agente»,
«decisione tecnica è agente», «scelta agente»), mentre **i meriti li assorbono in silenzio**. Solo
cinque ondate su trentanove avvertono il lettore di non gonfiare l'autonomia. Chi legge il dossier
senza questa sezione sovrastima sistematicamente la sua agency.

---

## §7 — Le assenze dichiarate da S3 §8, verificate una per una

Il mandato vieta di ereditarle. Le ho controllate tutte e sette contro le 352 contro-evidenze, il
catalogo S1 e i fatti J1. **Tre non reggono come sono scritte.**

| # | Assenza dichiarata da S3 | Esito | Che cosa ho trovato |
|---|--------------------------|-------|---------------------|
| 1 | **Gestione economica** — «*nessuna decisione sua su un budget, un margine o un costo ricorrente*» | ⚠️ **DA CORREGGERE** | **A7-D27** (12-06-26): «*Budget legale anno 1 ≈ 1.500–2.500€*», `Chi = MATTEO`, `Autonomia = SCELTA`, citazione «*€2a*», skill `legal-budget`. È **esattamente** una decisione su un budget. Più **E2**: «*stima il costo per chat e annotalo*» — un costo ricorrente. La **sostanza** di S3 regge (non esiste una *skill* di gestione economica: sono due righe isolate, entrambe `SCELTA` fra opzioni proposte); **il «nessuna» è falso.** |
| 2 | **Rapporto con utenti reali** — «*l'intero prodotto è stato progettato senza un utente esterno nel corpus*»; l'unico interlocutore umano è Tommaso | ⚠️ **DA PRECISARE** | Esiste un **cliente reale nominato**: «*Owner: Al Ritrovo - Bologna*» nel PRD legacy (C3-§4-8), e **H4-D38** (19-03-26, `MATTEO ORIGINATA`, **peso 1**): «*Al Ritrovo non perda dati dopo merge*» — è lui che, con parole sue, protegge i dati di un ristorante reale. La formulazione giusta non è «nessun utente reale», è: **un cliente reale esiste e i suoi dati contano; nessun utente reale parla mai nel corpus.** Nessuna intervista, nessun test con utente, nessun feedback. |
| 3 | **Manutenzione nel tempo** — «*non esiste una skill di manutenzione, monitoraggio o gestione di incidenti in produzione*» | ❌ **SMENTITA** | **A1 Sezione 3 ha una riga di skill che si chiama letteralmente `prod-incident / prod-incident-response`, livello `L2–L3`**, con evidenza «*sintomo verbatim; fix 036/037 post-segnalazione*» e contro-evidenza «*collaudo utente non sempre attestato*». Esiste anche il file `Report-incident-prod-impostazioni-bloccate.md` e un «*audit release 19-06*» (A9-§4-6). **A11 la data**: «*`env-safety` da L2 **incident-driven** a L3 con cancelli dichiarati*». La skill esiste, è nominata e ha un livello. ⚠️ **Perché S3 non l'ha vista: è un ibrido `L2–L3`, quindi la prima regola dura (§3.1) l'ha risolta a L2 — e le L2 non entrano nella lista del §9.** La regola di S3 ha nascosto a S3 la propria eccezione. **Ciò che resta vero:** è manutenzione **reattiva** (incident-driven), non monitoraggio; e i 75 commit fermi dal 23-06 restano. |
| 4 | **Lavoro con altri sviluppatori umani** — «*una sola traccia (Tommaso)… non è collaborazione documentata: è il conflitto I-8*» | ⚠️ **DA CORREGGERE** | **J1-D12** (22-06-26): «*Co-autoria git Cristiano (25 commit console)*», `Chi = CONGIUNTA`, `Autonomia = SCELTA`, skill `collab-git`, livello **L1**. E **F1** nomina il team: «*Team: Matteo (sviluppo…) · **Cristiano (socio…)***». Quindi ci sono **due** persone umane documentate, non una, e una decisione di co-autoria esplicita. Regge invece la parte sostanziale: **nessuna pratica di review o di lavoro in coppia è documentata**, e il livello resta L1. |
| 5 | **Stima e pianificazione dei tempi** | ✅ **CONFERMATA** | Cercato su tutte le 352 contro-evidenze e sul catalogo S1: `stima`, `scadenza`, `deadline`, `entro il`. Le uniche occorrenze sono **scadenze di prodotto** (certificazioni HACCP in B1/B2/B3), un **timing di compliance** («*entro il primo mese*», A7-§4-2) e una **stima di costo** (E2). **Zero stime di tempo di lavoro.** L'unica regola sul ritmo resta «un WP per sessione, mai due» (S1 F105), che è un freno. |
| 6 | **Design visivo autonomo** — «*sa dire che è sbagliato; non risulta che sappia dire come si fa*» | ✅ **CONFERMATA E RAFFORZATA** | **H1-§4-5** (peso 1): «*cambio idea estetico esplicito: testo bianco/nero fasce; annulla lo spazio del footer **dopo aver insistito** — contro a «sempre sa cosa vuole visualmente»*». **H5-§4-1**: lo stesso loop pixel sul logo, **su un altro prodotto**. **A10-§4-3**: «*micro-loop UI **senza mockup**: 2–4 iterazioni*» — ed è la contro che fa cadere `Mockup HTML prima delle scelte UX` da L4 a L3. |
| 7 | **Sicurezza applicativa oltre gli ambienti** | ✅ **CONFERMATA E RAFFORZATA** | Quattro contro nella sola D2: «*gate `is_active` **solo app, non RLS** — difesa superficiale*» (C05), «*«funzionante» ≠ «sicuro»*» (C11), «*account di test legati a progetto **PROD**… contraddizione a env-safety*» (C12), «*password QA deboli su richiesta*» (C02). Più i segreti: **PAT finito nella git history** (B3-CE1), **PII in 9 artefatti di test** (C2-§4-7), **credenziali in chiaro** (C3-§4-7, D2-C14), file `creds`/`.env` sotto `e2e-s4/` (G3-§4-5), **kit esposto ~2 settimane su repo pubblico** (F1-§4-2). Il conflitto **N-1** (rate limit 3/ora vs 5/minuto) **resta aperto**. |

> **Bilancio: 4 assenze confermate, 3 da correggere.** La più importante è la #3, perché non è una
> sfumatura: **una skill di risposta agli incidenti esiste, ha un nome e un livello**, e il dossier
> finale non può scrivere che non c'è.

---

## §8 — Le ipotesi del committente, falsificate

Il mandato dice: «*un'ondata di falsificazione che non falsifica anche il proprio committente è
incompleta*». Quattro ipotesi del piano o dei suoi prompt sono smentite dal corpus.

| # | Ipotesi del piano / prompt | Esito |
|---|---------------------------|-------|
| 1 | **«La Console è nata e abbandonata in 2 giorni»** (prompt M2) | ❌ **FALSA, e va corretta ovunque venga ripresa.** M2-§4-1: su `feature/console-super-admin`, 22–23 giugno, risultano **F1→F13 e REQ-001…004 ACCETTATE**, PLAN-DB-006 eseguito. È uno **sprint chiuso in accettazione**, poi silenzio. ⚠️ **Ma il quadro completo è peggiore dell'ipotesi originale, non migliore:** M2-§4-2 e J1-CE4 mostrano che **il branch non è antenato di `main` e non è mai arrivato in PrenotaZen**. Non «abbandonato a metà»: **finito, accettato e mai rilasciato.** Conflitto **I-10**. |
| 2 | **«La sequenza è HACCP → CB-old → CB-v2 → Trading → giochi»** | ❌ **FALSA**, già smentita dal piano §2.2 dopo P0-EX e mai usata da S3. La confermo qui perché è l'ipotesi che ha generato il taglio delle ondate: giochi e CB-old (feb-mar) → CB-v2 (dal 27-04) → trading **in parallelo** (mag-giu) → BHM e Trading-Platform (lug) → CB-v2 (ago). |
| 3 | **«≈352 contro-evidenze»** (tracking) | ✅ **VERA, al singolo** — §1.3. Registrata perché il gemello di questa cifra per la Sezione 3 (568) era falso di 91. |
| 4 | **«8–10 righe L3/L4 senza contro-evidenza»** e la lista dell'input §7 | ⚠️ **INCOMPLETA e in un punto SBAGLIATA.** S3 l'aveva già corretta al rialzo (le scoperte erano 21, non 10). Aggiungo l'errore di indirizzo: l'input elencava `form-validation-ux` **sotto H2**, e S3 l'ha declassata cercando la contro nei CE1–CE8 di H2. **La riga è di H3**, e H3 ha la sua contro (§9, bersaglio #6). |

Aggiungo un'ipotesi **mia**, che questa ondata ha smentito da sola: **avevo motivo di aspettarmi che
il bersaglio #1 di S3 (le 21 L4 di M1/M4) fosse il punto più fragile dell'albero.** Non lo è. È il
ramo R05 — quello che tutti davano per il più solido — a portare il risultato più pesante (§4.2).

---

## §9 — I sette bersagli di S3 §9.3, uno per uno

| # | Bersaglio | Esito |
|---|-----------|-------|
| **1** | **Le 21 L4 di M1 e M4** — «*se S4 ne fa cadere metà, l'albero cambia forma*» | ⚠️ **NON NE CADE METÀ: 5 su 21.** E la concentrazione resta al **51,6%** (era 52,5%), perché cadono anche 4 L4 di altre ondate. Ma il test riga per riga (§4.1) dà il risultato che conta: **una sola L4 su sedici regge unicamente sulla circolarità** (`product-auto-select`, M4-D37), una ha conferma parziale, una debole; **tredici hanno una fonte fuori dalla linea M, quattro di peso 1.** La circolarità è un rischio di conteggio, non di fondamento. |
| **2** | **`limite-coperti` L4 (A6) contro `soft-limits` «L4 cand.» (M3)** | ✅ **RISOLTO, senza chiudere il conflitto.** `limite-coperti` **NON REGGE → L2**, e non serve sapere se fu errore o cambio di modello: un L4 richiede una regola **riusata**, e questa è stata **rimossa dal codice sette giorni dopo essere nata** (`daily_guest_limit` eliminato il 18-06). Una regola cancellata prima di essere riusata non è una codifica. **L'asimmetria che S3 segnalava si risolve così:** la forma ribaltata scende a L2, la forma sopravvissuta (limiti morbidi per fascia) resta L2 — **adesso sono allo stesso livello**, e questo è coerente con i fatti invece di esserne il contrario. Il conflitto **T01 / N-5 resta APERTO** (§11): non ho usato M3-A02 («*avevo deciso male*») per chiuderlo, perché riguarda il **blocco per-fascia**, non il limite giornaliero. |
| **3** | **Le 4 L4 «di sistema» di B1** — «*B1-C10 dice che l'attribuzione dipende da H5: verificare in H5*» | ✅ **VERIFICATO IN H5. Due risalgono, due restano.** H5 ha **cinque M-VOCE nominali** su BHM (H5-D34, D36, D37, D40, D42), tutte `MATTEO ORIGINATA`, **peso 1**, datate 06-07 → 09-07. ⬆️ **`skill-portability` → di persona**: H5-D36, «*orientarti… skill system… completo o da completare*». ⬆️ **`domain-lexicon` → di persona**, ed è il match più netto: **H5-D37 porta la stessa etichetta di skill**, con citazione «*prova haccp = tutti i dati… per controlli haccp*». ➡️ **`audit-immutability` resta di sistema**: nessuna M-VOCE su append-only, e B1 lo dichiara «BHM nativo (prodotto)». ➡️ **`compliance-lock` resta di sistema**: nessuna M-VOCE. ⚠️ Nota che nessuno aveva previsto: **H5 assegna a quella materia L2, non L4.** Il soggetto viene da H5, il livello dal file di regola di B1: **nessuna delle due fonti fa un L4 da sola.** |
| **4** | **`Privacy docs/_lavoro`** — caso-scuola | ✅ **USATO COME TALE, e va più in basso di dove S3 l'aveva messa.** S3 aveva declassato la riga di M1 da L4 a L2. La **riga gemella di A2** (`privacy-docs _lavoro`, A2-D63) **NON REGGE → L1**. Motivo: la contro-evidenza non è «non cercata», è **disponibile e contraria** — il piano §2.1 punto 3 registra **77 file di `docs/_lavoro` tracciati da git**, incluse `Documenti Legali/` e `Valutazione prezzo vendita/`; G3-§4-5 trova file `creds`/`.env` sotto `e2e-s4/`; C2-§4-1 mostra il precedente (11 file personali — CV, visti, profilo — nella root del repo BHM fino al cleanup di gennaio). **Una regola contraddetta dai fatti non è «decisa da solo con un motivo»: è enunciata.** La lezione generale: *l'esistenza del file di regola non è la prova che la regola valga.* |
| **5** | **`explanation-schema` L4 (G3)** — «*è L4 o è una regola privata?*» | ✅ **È UNA REGOLA PRIVATA → L3.** G3 lo dichiara di sé: «*`Metodo_spiegazioni_*` è più ricco di `COMUNICAZIONE_UTENTE_SKILL`: Matteo sa **come** vuole essere spiegato; **il sistema skill pubblico non lo ha assorbito**» (G3-§4-1), e «*vive ancora in `_lavoro`… rischio che gli agenti futuri non la vedano*» (G3-§4-2). L4 richiede una regola **riusata dal sistema**: questa non lo è. **La sua autorialità non è in discussione** — è la fonte più personale del corpus, scritta in prima persona. È il riuso che manca. Chiude la lacuna **L-S3-2** in negativo: **non è confluita, e non esiste una data di confluenza.** |
| **6** | **I 7 declassamenti del §3.2** — «*se S4 trova la contro-evidenza che io non ho trovato, risalgono*» | ⚠️ **UNO RISALE, SEI RESTANO GIÙ.** ⬆️ **`form-validation-ux` (H3) risale a L3**: S3 aveva cercato la contro nei CE1–CE8 di **H2**, ma **la riga è di H3**, e H3 ha la propria Sezione 4 — **H3-CE4, «*falso allarme intolleranze → «scusa scemo io»; poi critica toast*»**, è una contro-evidenza sulla validazione di un form, di **peso 1**, più H3-CE8 «*stesso fix layout Prenota: «agente ha sbagliato ancora»*». La regola dura §3.4 è soddisfatta. L'errore era nell'**input §7**, che indicizzava la riga sotto H2, non in S3. Restano giù: `Copy verbatim` (M1), `Privacy _lavoro` (M1, e la gemella A2 scende ancora), `edition-shell` (M3), `prepara-prompt` (M4), `command-lexicon` (E1), `edition-gating` (H3) — per ognuna ho riletto la Sezione 4 del report d'origine e la contro sulla materia non c'è. |
| **7** | **Il ribaltamento di agosto (L-S2-3 / L-S3-7)** — «*agosto produce zero L4*» | ❌ **NON CHIUSO, e ora so perché non si chiude.** Le tre L3 di A11 (`ai-orchestration`, `product-scoping`, `release-gating`, `env-safety`) **REGGONO tutte**: nessuna cade. Quindi il ribaltamento non è un crollo di competenza. Le contro di A11 si dividono esattamente fra le due letture e **non ne scelgono nessuna**: a favore di «squadra più verificante» stanno CE8 (un bug trovato a mano fuori copertura e2e) e CE12 (autonomia test-infra delegata all'agente); a favore di «premesse ereditate più fragili» stanno CE10 (**«*premesse ereditate false — difetti aperti, 18 commit — credute finché riverificate*»**, con M1-§4-14 che registra il pattern ×3) e CE9 (**un ambiente locale sbagliato non notato per sette settimane**). **Due contro per lato, stessa ondata, stesso peso.** La lacuna resta aperta e va a **S5**: non è una domanda a cui i report possano rispondere, è una domanda **da fare a lui**. |

---

## §10 — Le dieci domande più scomode

Ognuna con l'evidenza che la motiva e l'ID. Le sette divergenze di S3 §4.1 sono lo scheletro; le
domande 3, 5, 8, 9 e 10 sono nuove di questa ondata.

| # | La domanda | Che cosa la motiva | ID |
|---|-----------|--------------------|-----|
| **1** | **La sicurezza degli ambienti è la cosa che fai di più (103 righe) e su cui parli di più — ed è l'unica che non hai mai detto di voler imparare. Ma nel materiale la impari sbagliando: a metà maggio autorizzi una scrittura su PROD, e fino al 29 maggio chiedi ancora come non confondere i due database. Quando è diventata una tua regola invece di una lezione?** | **la divergenza D1 di S3, capovolta da questa ondata**: non è una competenza originaria, è acquisita per correzione | **G2-§4-3** · **H2-§4-2** · **H1-§4-2** · H4-§4-2 · A2-§4-2 · M3-§4-4 |
| **2** | Il 4 giugno ti sei costruito una scuola — profilo, glossario, roadmap, «Lezione della chat» — e l'hai usata **una volta**. La stessa scuola, copiata sul progetto di trading, è vuota anche lì. Perché la progetti e non la frequenti? | divergenza D2 di S3, **rafforzata da una seconda prova indipendente che nessuno aveva collegato** | **G1-§4-2** · **E1-§4-5** («*PROFILO_SCOLASTICO E1: tutte 🌱, zero lezioni*») · C5-§4-5 |
| **3** | **Hai firmato un «va bene» sbagliato: hai accettato il footer del Menu QR mentre stavi guardando Prenota. E la checklist di collaudo è rimasta a 4 prove su 62 per tre sessioni, con i test automatici tutti verdi. Quando dici «l'ho visto io», che cosa hai visto davvero?** | **nuova.** È la contro che fa scendere a L2 **sia** `accettazione-umana` (M3) **sia** `hands-on-qa` (G1): le due righe che reggevano il gate umano | **G1-§4-5** · **A11-§4-1** · A11-§4-2 · M3-§4-7 · C4-§4-1 |
| **4** | Sulla parte che il cliente vede correggi in continuazione e codifichi quasi mai: 18 correzioni contro 1 regola scritta. Nello stesso periodo, sugli ambienti, hai **una** regola e l'hai scritta in **quattro** file diversi. È una scelta o è un limite? | divergenza D3 di S3, **rafforzata**: `Mockup HTML prima delle scelte UX` scende da L4 a L3 proprio perché i micro-loop UI avvengono **senza mockup** | **A10-§4-3** · **H1-§4-5** · H2-§4-8 · H5-§4-1 · S1 F001 |
| **5** | **Risulti autore di 1.074 commit. Il tuo socio ne ha 25. L'accettazione della Console porta scritto «test eseguiti nei panni di Matteo» e chi l'ha firmata non sei tu. Quale parte di quel lavoro diresti che è tua?** | **nuova, e la più dura.** È il conflitto I-8 unito all'attribuzione della Console: né git né i report bastano, serve la sua parola | **J1 §5.b riga 6** · **J1-A07** · **M2-D30** · J1-D12 |
| **6** | L'11 giugno hai messo un limite di coperti al giorno. Il 18 l'hai tolto. In nessun file c'è scritto che fosse un errore — tre ondate diverse hanno cercato quella frase e non l'hanno trovata. Era un errore o era un cambio di modello? | conflitto **T01 / N-5**, aperto da S1, lasciato `INCERTO` da S2, non chiuso da S3, e **non chiuso da me** | **A9-§4-9** («*cercata… solo «rimozione» + «supera M2»*») · **M3-§4-1** · A9-§4-1 |
| **7** | Nella tua scheda hai scritto «principiante, nessuna competenza tecnica formale». Nello stesso periodo collaudavi su tre schermi, ripulivi il database di prova e bloccavi i rilasci. Quale delle due è quella che useresti per presentarti a un cliente? | **G1-D14 è peso 1**: è lui che parla. È la tensione centrale che S3 consegna a S5 | **G1-§4-1** · G1-D14 · le 103 righe di R05 |
| **8** | **Il capitolo del servizio ai tavoli è finito, collaudato e fermo dal 23 giugno: 75 modifiche che non sono mai arrivate al sito vero. La console per gestire i clienti è stata accettata a fine giugno e non è mai stata pubblicata. Il tuo cancello ha funzionato — chi doveva chiedertelo di riaprirlo?** | **nuova.** Unisce due debiti che nessuno aveva messo insieme: il gate funziona (peso 2, verificato sul database) e **nessuno dei due lavori è mai stato rilasciato** | **J1-§4-1** (CE1) · **J1-§4-4** (CE4) · **M2-§4-2** · S2 §9.2 |
| **9** | **Hai scritto la regola «il lavoro privato sta fuori da git». Nella repo ci sono 77 file di lavoro privato tracciati, fra cui i documenti legali e la valutazione del prezzo di vendita. Un token personale è finito nella storia di git, e il kit è rimasto pubblico due settimane. Chi controlla che le tue regole vengano applicate?** | **nuova.** È il caso-scuola del bersaglio #4 esteso a tutti i segreti: la regola c'è, l'applicazione no | **Piano §2.1 p.3** · **B3-§4-1** · **F1-§4-2** · G3-§4-5 · C2-§4-7 · C3-§4-7 |
| **10** | **Il vocabolario di comando è la cosa che hai codificato meglio, ma il «livello 2» — quello in cui l'agente ti fa una domanda prima di agire — risulta usato zero volte, e tu stesso hai confermato di tenerlo. A che serve una regola che non scatta mai?** | **nuova.** È la contro che fa scendere `Vocabolario governato + livelli di libertà` da L4 a L3, e con essa `grilletti-map` | **M1-§4-17** («*Liv.2 «main»/«menù originale» a **0 esiti** (poi confermate tenere)*») · **A3-§4-3** |

---

## §11 — Che cosa resta aperto

Un «non lo sappiamo» tracciato vale più di una chiusura inventata. **Non ho chiuso nessuno dei
conflitti ereditati inventando la fonte che manca.**

### §11.1 — I conflitti ereditati: che cosa fa S4

| Conflitto | Che cosa fa questa ondata |
|-----------|---------------------------|
| **T01 / N-5** — limite coperti: errore o cambio di modello? | **RESTA APERTO.** Ho declassato la skill (`limite-coperti` → L2) **senza** decidere la natura del ribaltamento: il declassamento poggia sul fatto che la regola è stata rimossa, non sul motivo. **Non ho usato M3-A02** («*avevo deciso male*») per chiuderlo: riguarda il **blocco per-fascia**, non il limite giornaliero. Tre ondate (A9, M3, S2) hanno cercato la frase di ammissione: A9-§4-9 la dichiara non trovata. |
| **N-3** — «educare Matteo»: A4 `APPROVATA` vs M1 `ORIGINATA` | **RESTA APERTO.** Un dato nuovo che **non lo chiude ma sposta l'ago**: A3-§4-10 dichiara che al 30–31-05 «*qui c'è come lavoriamo, non ancora insegnami*» e **data il mandato ad A4, 02-06**. Se il mandato compare per la prima volta in A4, la lettura `APPROVATA` diventa più economica — ma **non esiste nessuna fonte di peso 1 sul 04-06**, e senza quella non chiudo. |
| **N-2** — listino Pro 79 → 69 | **RESTA APERTO, e adesso ha una conseguenza sul livello.** A7-§4-1 lo descrive per esteso: «*listino oscillante lo stesso giorno… decisione commerciale non stabile al primo passaggio*». È il motivo per cui **`legal-vendita / pricing-posizionamento` (M4) scende da L4 a L3**: un listino fotografato non è una regola riusata. La skill Marketing continua a fotografare solo lo stato finale. |
| **N-1** — rate limit: 3/ora (D1-D30) vs 5/minuto (G3-D35) | **RESTA APERTO.** Cercata una terza fonte in tutte le 352 contro-evidenze e nel catalogo S1: **non c'è.** L'unico dato nuovo è la satellite D1 (K9): «*Rate limit 3/ora (D30) — **VERIFY**, la policy attuale può differire*», cioè D1 stesso non sa se vale ancora. Entrambe le righe restano `INCERTO`, nessuna di peso 1 o 2. **Per chiuderlo serve leggere il codice dell'endpoint — che è fuori dal mandato di questa indagine.** |
| **I-4** — prezzo carosello | **RESTA APERTO, e adesso so anche perché nessuno lo chiude.** Tre ondate lo registrano (A2-§4-1, A1-CE12, e la satellite di H2), e **la satellite di H2 porta il verdetto già scritto: «*in H2 non emerge una coppia chiara… **aperto a J1/H3**, non forzare*»**. H3 non l'ha ripreso. J1 non lo copre. **Nessuno ha mai eseguito il rimando.** Aperto da A2, riaperto da H2 e H3, non chiuso da S1, S2, S3 né da me. |
| **I-5** — sovra-narrazione della linea A sull'overlay ingredienti | **RESTA APERTO.** È la seconda riga mai consumata della satellite di H2: «*in H2 i prompt lunghi del 29-05 già descrivono overlay/scroll come obiettivo… **verificare in H3 o nel transcript grezzo***». H3 non lo verifica. Il transcript grezzo è vietato dal mandato. ⚠️ Ma **M1-§4-2 (C2) descrive lo stesso episodio come «*cambiato idea: mattina anti-overlap → pomeriggio overlay (12h)*»** — cioè una **terza** ondata conferma la narrazione «no→sì» che H2 sospetta di essere sovra-narrata. Due contro una, ma le due sono di peso 3 e quella contro è di peso 1. **Non chiudo.** |
| **I-8** — autore git ≠ autore codice | **RESTA APERTO per eccezione dichiarata dal mandato.** Non l'ho chiuso a favore di J1. Rinforzato per una **quarta** via indipendente, dopo le tre di S1/S2/S3: l'attribuzione impropria del §6.1, dove i meriti assorbiti in silenzio sono dodici. |
| **I-10** — la Console non è uno scope lasciato a metà | **CHIUSO come smentita, riaperto come debito** (§8 riga 1): accettata e mai rilasciata. |
| **I-11** — A3: «migrazione PROD 041 applicata» vs «non applicata» nello stesso file | **RESTA APERTO.** A3-§4-7 lo dichiara: «*header report dice PROD 041 applicata; la sezione «Cosa non è successo» dice il contrario*». È una contraddizione **interna a una sola fonte**: nessuna altra ondata la tocca, e J1 non copre la 041. **Chiuderlo richiede il registro migrazioni, non i report.** |

### §11.2 — Le lacune di S2 che mi erano state girate

| Lacuna | Esito |
|--------|-------|
| **L-S2-1** — 32 righe `M↔M` senza motivo citato | **NON CHIUSA.** Lo schema §3.1 non ha un campo «perché» e chiuderle richiede i corpora. Ne ho recuperate **due** per via indiretta, dalle contro-evidenze: A8-§4-1 spiega il ribaltamento di G16 («implementata end-to-end poi «rimuovere» la stessa giornata»), A10-§4-2 spiega quello del walk-in («dopo QA 25-06»). **30 restano.** |
| **L-S2-2** — 17 righe `A→M` con esito `ignota` | **NON CHIUSA.** Nessuna contro-evidenza le tocca. Resta a S5/S6. |
| **L-S2-3** — il ribaltamento di agosto | **NON CHIUSA** — §9, bersaglio #7. Adesso però so *perché*: le contro di A11 si dividono due a due fra le letture. **È una domanda da fare a lui**, non ai report. Passa a **S5**. |
| **L-S2-7** — `Esito` auto-dichiarato al 95,5% | ⚠️ **CONFERMATA COME PROBLEMA REALE, non chiusa.** Serviva una contro-evidenza indipendente e **l'ho trovata**: B2-§4-1 «*gli agenti dichiarano completamento/APPROVED; l'utente (QA) ritrova blocker critici*», B2-§4-5 «*claim «migration 015 / campi presenti» **falsi su DB live***», A5-§4-3 «*MASTERPLAN «E2E shell 20/20» **falso***», C4-§4-3 «*«100% tested / production ready» mentre invite «da testare» e onboarding «Bug»*», C4-§4-6 «*«verde console» = `console.log('✅…')` narrativi, **non un runner***», J1-CE6 «*J1 non riesegue i test → non può elevare: gli esiti sono **solo dichiarati** (118/118, validate verde)*». **Sei ondate documentano che gli esiti auto-dichiarati sono stati falsi almeno una volta ciascuna.** Il 95,5% di accettazione non va usato come misura di niente finché qualcuno non riesegue i test. |

### §11.3 — Che cosa apre S4

| # | Lacuna nuova | Perché non si chiude qui | A chi va |
|---|--------------|--------------------------|----------|
| **L-S4-1** | **La skill `prod-incident-response` (A1, `L2–L3`) è stata resa invisibile dalla regola sugli ibridi** e non è mai entrata nella lista del §9 di S3 | non è un errore di S3: è un effetto della sua regola. Ma vuol dire che **altre skill L2–L3 possono essere sparite allo stesso modo** | **S6** (metodo) |
| **L-S4-2** | **Gli esiti dei test non sono mai stati riverificati da nessuno** (L-S2-7 rinforzata da 6 ondate) | riesesguire i test è fuori dal mandato dell'indagine | **S5** (rischio) |
| **L-S4-3** | **Il rimando «aperto a J1/H3» della satellite di H2 non è mai stato eseguito** — è il motivo per cui I-4 e I-5 sono ancora aperti dopo tre ondate di sintesi | richiede il transcript grezzo, vietato | **interrogazione senior** |
| **L-S4-4** | **`product-auto-select card singola` (M4-D37) è l'unica L4 dell'albero senza nessuna fonte fuori dal file che la enuncia** | M4 stesso dichiara «manca transcript» | **S5 / interrogazione** |
| **L-S4-5** | Il cambio di tema **indaco → crema** è avvenuto e **non è mai stato verbalizzato come decisione** (handoff dell'input §9, onorato in negativo) | G3-§4-3 lo registra come «evoluzione di brand non dichiarata come cambio idea»; nessun ID lo attribuisce | **S5** |

---

## §12 — Copertura dichiarata

**Copertura di S4 sul proprio ingresso: 39 report su 39, 352 contro-evidenze su 352, 100%.**
**153 verdetti su 153 skill L3/L4 di S3 §9, 100%.** Nessun lotto è stato rifatto.

### §12.1 — Le tre unità, che non si sommano (regola comune 5)

**Non esiste un totale unico.** File, messaggi e fatti si misurano in unità diverse.

| Unità | Linee | Perimetro (da P0 / S1 / J1) | Contro-evidenze |
|-------|-------|------------------------------|-----------------|
| **File `.md`** | A, B, C, D, E, F, G, I, M | 1.867 file aperti | **309** |
| **Messaggi** | H | 3.321 M-VOCE dichiarati letti (su 3.412 censiti da P0-EX) | **37** |
| **Fatti** | J | 1.074 commit · 72 migrazioni · 32 release · 2 database | **6** |

I tre numeri fanno 352 in aritmetica, ma **non vanno sommati in una frase**. «352 contro-evidenze» è
un totale di righe, non una misura di corpus: un file, un messaggio e un commit non sono la stessa
unità.

> ⚠️ **Le 37 contro-evidenze di peso 1 sono il 10,5% del totale** — e sono quelle che pesano di più
> nei verdetti di questo report (la domanda #1, il bersaglio #3, il declassamento di H2 `env-safety`
> poggiano tutti lì). **Il resto è scritto da agenti su sé stessi.**
>
> ⚠️ **La discrepanza dei 91 messaggi resta aperta**, ereditata da S1 §8, S2 §10.1 e S3 §10.1.
> Handoff a **S6**, invariato.

### §12.2 — I limiti di questa ondata, dichiarati

| Limite | Effetto concreto |
|--------|------------------|
| **Le contro-evidenze le hanno scritte gli agenti che dovevano compiacerlo** | è il §0, ed è il limite che sovrasta tutti gli altri: quello che non hanno scritto non lo vedo |
| **Cinque forme diverse di Sezione 4** | l'estrazione ha richiesto una famiglia dichiarata (§1.1). Chi rifà il lavoro con un altro criterio otterrà un altro numero |
| **224 righe su 352 senza ID nativo** | ho assegnato ID di posizione `<ondata>-§4-<n>`: **sono miei, non dei report**, e chi ricontrolla deve usare la colonna `id_nativo` per la corrispondenza |
| **Il criterio dei tre componenti (a)/(b)/(c) è mio** | è dichiarato in §2 ed è contestabile riga per riga. Con un criterio diverso — per esempio declassando anche per esito imperfetto — quasi tutte e 153 cadrebbero |
| **82 righe su 153 sono prove fragili** (§5) | i verdetti `REGGE` su quelle righe sono più deboli degli altri, e questo **non** è visibile nella tabella dei verdetti: va letto insieme al §5 |
| **Nessun test rieseguito, nessun codice letto** | il conflitto N-1 (rate limit) e I-11 (migrazione 041) **non sono chiudibili** dentro questo mandato |
| **Corpora non riaperti** (da mandato) | dove il report non dice, apro una lacuna e non indago |
| **Non ho corretto nessun report d'origine** | M4-§4-10 chiedeva di «confermare in A5» e A5 non conferma: **registrato, non sistemato** |

---

## §13 — Lacune e handoff

| A | Che cosa consegno |
|---|-------------------|
| **S5** (ritratto e rischi) | **Le 10 domande del §10 sono già una banca domande**, e le 3, 5, 8, 9, 10 sono nuove · **§4.2: `env-safety` è appresa per correzione, non originaria** — cambia il ritratto, perché la competenza più forte è anche quella che ha una storia di errori · **§7: tre assenze di S3 vanno corrette**, in particolare la #3 (la skill di risposta agli incidenti **esiste**) · **§6: l'attribuzione impropria è asimmetrica** — gli errori altrui i report li marcano, i meriti li assorbono · L-S2-3 (agosto), L-S4-2 (esiti mai riverificati), L-S4-5 (cambio tema mai verbalizzato) · **il debito della domanda #8**: due lavori finiti, accettati e mai rilasciati |
| **S6** (dossier finale) | **L'avvertenza del §0 va in testa al dossier accanto a quella di S3, non in nota** — «REGGE» significa «nessuno ha trovato il contrario in questo materiale» · usare **352** (riproducibile) e ricordare che **568** di S3 non lo era · **i nuovi conteggi dell'albero: 31 L4 (29 persona + 2 sistema) e 106 L3** · **§5: il 53,6% delle skill L3/L4 poggia su una fonte sola** — va detto accanto ai livelli · le tre unità separate del §12.1 · **§8: quattro ipotesi del piano stesso sono smentite** · L-S4-1 (la regola sugli ibridi ha nascosto una skill) |
| **interrogazione senior** | **I sei conflitti che nessuna ondata ha potuto chiudere** (§11.1): T01/N-5, N-3, N-2, N-1, I-4, I-5, I-8, I-11 · L-S4-3: il rimando «aperto a J1/H3» mai eseguito · L-S4-4: l'unica L4 senza fonte indipendente |

---

## §14 — Tre righe per Matteo

**1. Ho fatto il contrario di quello che hanno fatto gli altri: sono andato a cercare, per ognuna
delle 153 cose che risultano tue, il posto in cui quella stessa cosa ti è mancata.** Su 153, 125
hanno retto, 19 sono scese di un gradino e 9 non hanno retto. Ma la cosa da sapere prima di tutte è
questa: **«ha retto» qui vuol dire «nessuno ha scritto il contrario», non «è vero»** — e chi ha
scritto quelle carte sono gli stessi agenti che lavoravano per te, mentre le loro risposte nelle
chat salvate sono cancellate. Quindi le nove cose che non reggono possono essere vere lo stesso:
vuol dire solo che nessuno le ha messe per iscritto in modo verificabile.

**2. La cosa che ti riesce meglio — non toccare mai il database vero senza fermarti a chiedere — non
ce l'avevi all'inizio: l'hai imparata sbagliando, e c'è scritto.** A metà maggio hai dato l'ok ad
applicare una modifica sul database di produzione, e la lezione «prima il database di prova» è
arrivata **dopo**. Fino al 29 maggio stavi ancora chiedendo come non confondere i due. Oggi quella
regola è scritta in quattro posti diversi e funziona: il capitolo del servizio ai tavoli è ancora
fermo perché il tuo cancello non l'hai mai riaperto. **Non è una competenza che avevi: è una
competenza che ti sei costruito dopo aver visto cosa succede se non ce l'hai.** Nel dossier questa
è la parte più interessante di te, non quella più debole.

**3. Due cose che dovresti sapere prima che te le chieda un altro.** La prima: hai firmato un «va
bene» guardando la schermata sbagliata — hai accettato il piede di pagina del menu digitale mentre
avevi davanti la pagina delle prenotazioni — e la lista delle prove da fare a mano è rimasta ferma a
4 su 62 per tre sessioni di lavoro, mentre i controlli automatici erano tutti verdi. Vuol dire che
il «l'ho controllato io» non sempre ha coperto quello che sembrava coprire. La seconda: hai scritto
la regola «il mio lavoro privato non finisce nel codice pubblico», e nella cartella pubblica ci sono
**77 file** privati, fra cui i documenti legali e la valutazione di quanto vale l'app. La regola c'è
ed è giusta. Quello che manca è qualcuno che controlli che venga applicata — e finora quel qualcuno
eri solo tu.

---

## §15 — Criterio di accettazione (piano §6)

| Criterio | Esito |
|----------|-------|
| Ogni skill L3/L4 di S3 ha un verdetto con almeno un ID | ✅ **153/153**, verificato meccanicamente (`aggrega.py`): 0 verdetti senza ID |
| Ogni `REGGE` dice cosa è stato cercato e non trovato | ✅ **125/125**, verificato meccanicamente: 0 `REGGE` senza la colonna «cercato» |
| Le 21 L4 di M1/M4 trattate come caso strutturale a parte | ✅ §4 e §4.1, riga per riga, con il test della fonte indipendente |
| L'elenco delle prove fragili esiste ed è numerato | ✅ §5 — 4 livelli, **82 righe su 153** |
| L'attribuzione impropria è cercata in **entrambe** le direzioni | ✅ §6 — 12 meriti, 8 errori, con l'asimmetria dichiarata |
| Le assenze di S3 §8 sono **verificate**, non ereditate | ✅ §7 — 7 su 7 controllate, **3 da correggere**, una **smentita** |
| Le 10 domande scomode hanno ognuna la sua evidenza | ✅ §10 — ognuna con ID, 5 nuove di questa ondata |
| Ciò che resta aperto è elencato come aperto | ✅ §11 — **8 conflitti non chiusi**, 4 lacune S2 non chiuse, 5 lacune nuove |
| I conflitti ereditati **non** sono chiusi inventando la fonte che manca | ✅ T01/N-5 declassa la skill senza decidere la natura del ribaltamento; N-3, N-2, N-1, I-4, I-5, I-8, I-11 restano aperti |
| Il totale dichiarato è ricontato e lo scarto dichiarato | ✅ §1.3 — **352 contate, 352 dichiarate, scarto 0**, con il criterio di famiglia esplicito |
| Report d'origine **non** corretti | ✅ nessuna modifica: M4-§4-10, A3-§4-7, N-7 registrati, non sistemati |
| `00_PROMPTS_SEQUENZA_TRACKING.md` **non** toccato | ✅ come da piano §6 |
| `_stato/S4.md` con righe in ingresso, dopo normalizzazione, forma di provenienza e conteggio verdetti | ✅ scritto |

**File prodotti:** `report/S4_CONTRO_EVIDENZE.md` · `_stato/S4.md`.
**Intermedi rilanciabili** (fuori git): `docs/_lavoro/Indagine-Corpus/S4/` —
`survey_sezione4.py` (censimento delle forme) · `estrai_sezione4.py` (estrazione, 352 righe) ·
`candidati.py` (candidati meccanici) · `verdetti.py` (i 153 giudizi firmati, per chiave) ·
`aggrega.py` (controllo di copertura e conteggi) · `tabelle.py` ·
`contro_normalizzate.tsv` · `satelliti_sezione4.json` · `verdetti.tsv`.
**File non toccati:** i 39 report di mining, `00_PROMPTS_SEQUENZA_TRACKING.md`, qualunque file di `src/`.
