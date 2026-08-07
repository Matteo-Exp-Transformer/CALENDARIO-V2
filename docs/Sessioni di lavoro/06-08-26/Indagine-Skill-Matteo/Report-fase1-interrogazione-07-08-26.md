# Report — Fase 1 dell'interrogazione senior (07-08-26)

> **Profilo:** Verifica | Meta · **Modalità:** deep · **Nessun file di `src/` toccato.**
> **Che cos'è:** la sessione che chiude il cantiere di mining e apre l'interrogazione. Non produce
> nuove ondate: legge gli output di S6, li incrocia con una fonte esterna mai usata prima, e prepara
> il materiale con cui si conduce l'interrogazione.
>
> ⚠️ **I quattro deliverable NON sono su git.** Stanno in `docs/_lavoro/`, ignorata alla riga 42 —
> contengono materiale personale. Questo report ne descrive il contenuto e li localizza; non li
> duplica.

---

## §1 — Mandato ricevuto

Richiesta di Matteo, 07-08-26 (verbatim, sintetizzata solo nella punteggiatura):

> *«sei mio agente senior. il tuo compito è agire come analista forense di corpus / valutatore di
> competenze. raccogli tutte le info che hai su di me (`docs\Archives\Crescita professionale`) e
> incrociandole con i lavori prodotti (`S6_BANCA_DOMANDE`, `S6_DOSSIER_PROFILO_MATTEO`) in seguito
> allo svolgimento del plan… il tuo scopo è prima fare una chiacchierata con me per definire bene il
> metodo… poi preparerai il documento di interrogazione e di mio profilo completo… definisci ciò che
> non è stato ancora detto di me, fammi anche domande per delineare bene un profilo psicologico,
> comportamentale, emotivo, professionale, didattico… dobbiamo anche creare albero skill ma
> rispettiamo le fasi giuste: prima capiamo poi strutturiamo.»*

**Struttura a tre fasi, decisa da lui nel prompt stesso:**

| Fase | Cosa | Stato |
|------|------|-------|
| **1 — capire** | incrocio delle fonti + preparazione dell'interrogazione | ✅ **fatta in questa sessione** |
| **2 — interrogare** | 6 blocchi, un blocco per sessione | ⏳ prossima chat |
| **3 — strutturare** | albero skill definitivo + profilo v1 + file operativo | ⛔ **non iniziata, e non va iniziata prima del blocco 6** |

---

## §2 — Il risultato principale: due ritratti che non si erano mai parlati

Il valore di questa sessione **non è in nessuna delle due fonti**: è nell'incrocio.

| | **Indagine Skill** (06→07-08-26) | **Crescita professionale** (13-05→30-07-26) |
|---|---|---|
| **Metodo** | forense — 47 ondate, ogni riga con fonte, ID e peso | tutoraggio — 6 sessioni, rubrica a 7 criteri, log narrativo |
| **Materiale** | 1.867 file · 4.157 messaggi · 1.074 commit | 12 file, ~1.900 righe, quello che ha detto in sessione |
| **Vede** | cosa ha **fatto**, misurato | come si **comporta** imparando, e come si **descrive** |
| **Non vede** | la persona (dichiarato: S5 §5d) | il lavoro reale — **nessuna sessione ha mai letto una riga di repo** |

**Nessuna delle due cita l'altra.** L'Indagine non ha mai avuto `Crescita professionale/` nel
perimetro; il tutoraggio girava su Claude Desktop, senza accesso al codice.

### Le cinque cose che escono solo dall'incrocio

| # | Che cosa | Perché è solido |
|---|----------|-----------------|
| **1** | **Lo stesso difetto, misurato su due domini indipendenti a sette giorni di distanza.** Il tutoraggio (30-07, HubSpot, dominio nuovo): criteri 3 e 4 a `L1`, «*colmare un'incertezza con la prima cosa plausibile invece di lasciarla aperta*». L'Indagine (07-08, 4 mesi di direzione software): il «va bene» firmato sulla schermata sbagliata, la checklist ferma a 4 prove su 62, le premesse ereditate credute finché riverificate (×3), l'ambiente locale sbagliato per sette settimane | Due metodi, due domini, zero contatto. **È il dato più solido che esiste su di lui.** E ha un risvolto che nessuna delle due poteva vedere: ha costruito il sistema di verifica più solido del corpus (R04, 71 righe, 5 L4) **e il pezzo debole di quel sistema è lui quando verifica di persona.** Il sistema compensa la persona |
| **2** | **Sopravvaluta con i valutatori, sottovaluta con gli strumenti.** Il tutoraggio vede solo l'eccesso («product specialist», «AI Act in progress»); l'Indagine solo il difetto («principiante, nessuna competenza tecnica formale» mentre collaudava su tre viewport) | Riformula il difetto-chiave: non «si allunga», ma **tara male la distanza in entrambe le direzioni, e la direzione dipende da chi ha davanti.** Se regge, il suo «campanello» scatta oggi in una sola direzione: **ne serve un secondo** |
| **3** | **La scuola potrebbe essere in un altro posto.** Il passo 4 del suo metodo è «*trasformo il metodo in istruzioni per un modello — è la mia mossa nativa*». La Scuola in `Per matteo/Scuola/` è vuota in due progetti (R10: 11 righe, zero L4). Ma ha scritto 183 file di skill, un vocabolario governato, tre profili operativi | Se regge, **R10 non è un buco: è un'etichetta sbagliata.** Ipotesi, non verdetto — `X-03` |
| **4** | **Il buco degli evals è più stretto di come è scritto.** «Evals `L1`, il buco chiave» contro: criterio deciso prima (controtest), giudice separato dall'esecutore, rubrica ancorata, ground truth dichiarata — praticati da febbraio su sistemi deterministici | Quello che manca davvero è **il caso probabilistico** e **la misura numerica**. ⚠️ **Il livello NON è stato mosso**, e non va mosso a chiacchiera: è `X-04` più un artefatto. Precedente da citare: il tutoraggio aveva già collegato *«definire i requisiti (L3 già mio)»* agli evals — **due skill diverse convergono sullo stesso buco** |
| **5** | **Quattro buchi trovati due volte, indipendentemente:** stima dei tempi · user research · economia · design generativo | Otto attestazioni su quattro righe. **Non serve l'interrogazione per accertarli: serve per decidere quali chiudere e in che ordine** |

---

## §3 — Che cosa è stato prodotto

**Cartella (riorganizzata da Matteo durante la sessione):**
`docs/_lavoro/Per matteo/Valutazione Personale/` — **fuori da git, verificato file per file.**

| File | Righe | Che cos'è |
|------|-------|-----------|
| `Interrogazioni Valutative/Contesto/INT_00_PROTOCOLLO.md` | ~200 | Le regole vincolanti: 4 tag per le risposte, il doppio asse, le milestone di prova, come si conduce, cosa non si fa |
| `…/INT_01_PROFILO_UNIFICATO_v0.md` | ~310 | L'incrocio: confermato ×2 · in conflitto · le zone bianche · l'albero com'è oggi · copertura e limiti |
| `…/INT_02_INTERROGAZIONE.md` | ~505 | Le domande: 6 blocchi, ~77 in totale |
| `…/INT_03_PROFILO_RECRUITER_v0.md` | ~190 | L'impalcatura mostrabile: ogni riga con la prova o non entra |
| `…/Verbali/INT_04_VALUTAZIONE_SESSIONI.md` | ~90 | La scheda a 7 criteri di questa sessione ⚠️ **da trasferire su `11_Valutazioni_Didattiche.md`** |

### Il nodo di metodo sciolto — e va detto perché era un conflitto vero

Il piano diceva che i livelli **si confermano a voce** (§0b, decisione #4). Il suo
`CONTESTO_Progetto.md` diceva l'opposto: «*in sessione guidata si logga il percorso, non si promuove
il grado*». **Le due regole non potevano valere insieme su un asse solo.**

**Soluzione, decisa da lui:** due assi.

- **Livello di evidenza** `L0…L4` — invariato.
- **Stato di consolidamento** — `ANNOTATO` (solo nei file) → `CONFERMATO` (ha retto l'interrogazione
  con un episodio) → **`PROVATO`** (esiste un artefatto verificabile da terzi).

**Tre regole di movimento:** si **declassa** con qualunque risposta · si **alza** solo con episodio
verificabile, controllato dopo · si **dichiara a un datore di lavoro** solo ciò che è `PROVATO`.

> Non è uno strumento nuovo: è **il suo registro a tre colonne** (`so provarlo / so spiegarlo / non
> lo so`) applicato all'albero.

### L'interrogazione, in 6 blocchi

| Blocco | Titolo | Domande | Origine |
|--------|--------|---------|---------|
| 1 | Fatti e memoria | `A-01…A-13` | banca S6b, **non riscritte** |
| 2 | Le scomode | `B-01…B-14` | banca S6b |
| 3 | I buchi del corpus | `C-01…C-11` + 2 riserve | banca S6b |
| **4** | **L'incrocio** | `X-01…X-10` | 🆕 **nuove** — non esistono in nessun archivio |
| **5** | **Umano** | `U-01…U-19` | 🆕 le 10 zone bianche |
| **6** | **Didattico** | `D-01…D-08` | 🆕 |

**Ordine: 1 → 4 → 2 → 3 → 5 → 6.** Un blocco per sessione.

---

## §4 — Come Matteo ha lavorato in questa sessione

**Perché questa sezione esiste:** gliel'ha chiesta lui, ed è utile a chi condurrà i blocchi. È scritta
con le stesse regole del cantiere — episodio o non esiste — e il caveat sta alla fine.

### 4.1 — La forma della sessione

**Ha delegato la proposta e trattenuto la decisione.** Il prompt iniziale contiene sette richieste
distinte in un messaggio solo (pattern già documentato: «*fa molte domande operative in un solo
messaggio, fino a 5*») e si chiude con «*prendi tutto il contesto necessario e dimmi come procedere
secondo te*». Poi ha deciso su tutti e quattro i punti proposti, modificandone due.

**Ha ordinato lui le fasi, non richiesto.** Nel prompt: «*dobbiamo anche creare albero skill ma
rispettiamo le fasi giuste: prima capiamo poi strutturiamo*». È un freno allo scope applicato a sé
stesso — la stessa mossa di «*un WP per sessione, mai due*», qui su un lavoro che lo riguarda. ⚠️ Non
banale: nell'albero `scope-control` (R02) è **sceso a L2** in S4 perché era una riga senza nessun ID
a sostegno. **Questo episodio è datato, verbatim e suo.**

### 4.2 — Le quattro decisioni, e cosa dicono

| Decisione | Le opzioni | Cosa ha scelto |
|-----------|-----------|----------------|
| **Destinatario** | privato · privato + versione esterna · solo recruiter | privato **+ ha chiesto di aprire subito anche il secondo**, che riempirà nel tempo |
| **Livelli** | severa · comoda («la voce vince sempre») · severissima e lenta | **la severa — e ci ha aggiunto un vincolo suo** |
| **Blocco umano** | archivia solo l'utile · **archivia tutto** · solo perimetro di lavoro | **archivia tutto** |
| **Formato** | a blocchi dal vivo · sessione unica · questionario preparato | **a blocchi, dal vivo** |

**Il dato della sessione è la seconda riga.** Gli sono state offerte tre opzioni, **nessuna delle
quali conteneva il vincolo dell'artefatto**. Ha preso la più stretta e l'ha resa più stretta:

> *«opzione 1 "conferma e declassa…" con comunque test pratici come milestone per chiudere i capitoli
> e consolidare le skill che nell'albero sono al livello professionale (serve prova pratica, come
> artefatto, o prova tangibile in app creata, per dire sono capace posso lavorarci)»*

**Ha formulato un criterio prima di agire, e lo ha reso più costoso per sé.** La scheda del 30-07
chiedeva esattamente questo come cosa da verificare («*gli si chiede il criterio prima di agire, non
dopo. Si muove?*»). Si è mosso.

**E tre volte su quattro ha scelto l'opzione più esposta**, non la più comoda: la regola severa sui
livelli, «metti tutto per iscritto» sul blocco emotivo, il vivo invece del questionario preparabile.

### 4.3 — Che cosa NON è successo, e conta

- **Non ha chiesto i numeri di copertura.** L'agente ha dichiarato «*ho letto tutto il perimetro*»
  **senza fornirli**, e lui non li ha chiesti. Il conto vero era **14 file su 16 letti
  integralmente**, non 16. **La verifica indipendente è mancata da entrambe le parti** — e il suo
  stesso sistema la impone a ogni ondata (Sezione 5, «*numeri veri, contati con find*»).
  ⚠️ **È il criterio 4 della sua rubrica visto dall'altro lato del tavolo:** non ha dichiarato finito
  un lavoro incompleto — **ha accettato che qualcun altro lo dichiarasse.**
- **Non ha corretto niente.** Zero correzioni in tutta la sessione. Non è un dato di per sé — non c'è
  stato molto da correggere — ma va registrato che il criterio 5 (reazione alla correzione) **non è
  stato sollecitato** e quindi non si valuta.
- **Non ha chiesto spiegazioni.** Nessun «spiegamelo». Coerente con `L-S5-3`: quella parola-comando
  ha **zero occorrenze** in tutti e quattro i corpora che la cercano, mentre la regola su come vuole
  che gli si parli è scritta due volte. **Questa sessione è la quinta osservazione dello stesso
  vuoto.** È la domanda `C-03`.

### 4.4 — Il caveat, e senza questo il paragrafo sopra è una lode

**È un solo episodio, in un contesto in cui sa di essere il soggetto valutato.** Un osservato che
sceglie l'opzione severa mentre è osservato è un dato più debole dello stesso comportamento fuori
osservazione. **Vale come contro-esempio al difetto-chiave, non come sua smentita.**

E vale l'avvertenza n.2 del protocollo, che qui si applica al contrario: in questa sessione **si
legge tutto**, entrambe le voci. È l'unico pezzo di corpus su di lui in cui non manca metà del
dialogo — quindi **non è confrontabile** con le misure dell'Indagine, che poggiano su materiale
dimezzato.

### 4.5 — Tre cose utili a chi conduce i blocchi

1. **Dagli una struttura da correggere, non un foglio bianco.** Reagisce meglio a un metodo completo
   da smontare che a «cosa vuoi fare?». Coerente con «*ama i piani e la caccia alle falle*».
2. **Mostragli una contraddizione fra due suoi documenti invece di sceglierne uno tu.** Il nodo
   piano-§0b contro `CONTESTO_Progetto` l'ha sciolto lui, e meglio di come lo avrebbe sciolto
   l'agente.
3. **Verifica, non chiedere «ti torna?».** Vale la lezione del 30-07 («*tre volte su tre aveva
   dichiarato completo un lavoro incompleto*») **e** il buco del §4.3: se l'agente dichiara una
   copertura, i numeri vanno dati senza aspettare che li chieda.

---

## §5 — Copertura dichiarata di questa sessione

**Numeri veri, contati. Nessun «ho letto tutto».**

| Fonte | Perimetro | Letto | Regime |
|-------|-----------|-------|--------|
| `S6_DOSSIER_PROFILO_MATTEO.md` | 978 righe | **978 (100%)** | scavo |
| `S6_BANCA_DOMANDE.md` | 1.006 | **1.006 (100%)** | scavo |
| `PIANO_INDAGINE.md` | 377 | **377 (100%)** | scavo |
| `S5_RITRATTO_METODOLOGICO.md` | 806 | **225** — §3.7, §4, §5 | mirato, dichiarato |
| `Crescita professionale/` — 11 file | 1.428 | **1.428 (100%)** | scavo |
| `Crescita professionale/08_Candidature` | 313 | **120** — struttura, categorie, priorità, pattern dei gap. **Le 21 schede-annuncio non lette una per una** | rastrello, dichiarato |
| `CV_Matteo_Cavallaro_EN.pdf` | — | **mai aperto** | non aperto |

**File aperti: 16 su 16. Letti integralmente: 14 su 16.**

**Non riaperto, per mandato:** i 39 report di mining · S1–S4 per intero · il corpus grezzo dei
transcript · `src/`. Ogni numero citato arriva dal dossier o dalla banca, **non da un ricalcolo**.

### §5.1 — Un errore commesso e corretto dentro la stessa sessione

La prima stesura di `INT_01` §9 dichiarava «*letti per intero i 13 file di Crescita professionale*».
**Era falso: al momento della scrittura ne erano stati letti 7 su 12.** L'errore è stato trovato
preparando questo report, i file mancanti sono stati letti e la sezione è stata riscritta con i
numeri veri.

**Va scritto perché è esattamente la forma descritta al §2 riga 1** — dichiarare finito ciò che non è
finito — **commessa dall'agente, in un documento il cui unico scopo è la copertura onesta.** Ed è la
prova che la contromisura giusta non è l'attenzione: è la verifica indipendente, e in questa sessione
è mancata finché non è stata cercata apposta.

**Effetto sulle conclusioni:** nessuna delle cinque del §2 cambia. Il materiale letto dopo le
**rafforza** su due punti (la quarta forma numerica del difetto-chiave; il precedente del
collegamento requisiti↔evals) e **non ne smentisce nessuna**.

---

## §6 — Lacune e handoff

### Lacune aperte da questa sessione

| ID | Lacuna | A chi va |
|----|--------|----------|
| `L-INT-1` | **`08_Candidature_e_Profilo.md` letto al 38%.** Le 21 schede-annuncio contengono i «gap da gestire» riga per riga: sono la materia prima di `INT_03` §3 | chi riempie il profilo recruiter |
| `L-INT-2` | **Il CV in PDF non è mai stato aperto.** Il progetto stesso lo dichiara da rifare | Fase 3 |
| `L-INT-3` | **La scheda a 7 criteri di questa sessione non è stata scritta sull'originale** (`Documents\Io-Claude\…\11_Valutazioni_Didattiche.md`), che è fuori dal perimetro di lavoro. Sta in `INT_04` e **va trasferita**, con una riga di log su `00_Profilo_Matteo.md` | Matteo, o la prossima sessione del progetto Crescita |

### Lacune ereditate che restano

I **9 conflitti** del dossier §10 e tutte le lacune `L-S2/S3/S4/S5/S6a` restano aperti. Questa
sessione **non ne ha chiuso nessuno**, per mandato: si chiudono a voce, nei blocchi.

### Handoff — al senior che condurrà la prima chiacchierata

1. Leggi **`INT_00_PROTOCOLLO.md` per intero** prima della prima domanda. È vincolante.
2. Poi `INT_01` (per sapere da dove nascono i blocchi 4–6) e `INT_02` (le domande).
3. I blocchi 1–3 **si conducono dal file `S6_BANCA_DOMANDE.md`**, non da `INT_02`: lì ci sono fonte,
   peso e risposta attesa di ognuna delle 40.
4. **Non leggere la risposta attesa ad alta voce.** Serve a valutare dopo.
5. A fine blocco: verbale con le risposte taggate + **una scheda in `INT_04`** con i 7 criteri
   invariati.
6. **Non toccare l'albero.** È Fase 3, e comincia dopo il blocco 6.

---

## §7 — Tre righe verso Matteo

**1. La cosa nuova di oggi non è un documento: è che due indagini su di te si sono parlate per la
prima volta.** Una sapeva cosa hai fatto e non sapeva chi sei; l'altra ti conosceva imparando e non
aveva mai aperto il codice. Messe una accanto all'altra dicono **la stessa cosa sul tuo punto debole**
— che quando qualcosa è incerto lo chiudi con la prima spiegazione che regge, invece di lasciarlo
aperto — e lo dicono su due mondi diversi, a sette giorni di distanza, senza essersi mai lette.
**Quando due metodi diversi trovano la stessa cosa, quella cosa c'è.**

**2. E la stessa coppia dice una cosa che nessuna delle due poteva dire da sola: il sistema che hai
costruito è la contromisura al tuo difetto.** Il controtest, l'agente che verifica separato da quello
che lavora, la checklist obbligatoria prima di pubblicare — è tutto materiale che serve a non fidarsi
dell'impressione che una cosa sia finita. **Il punto è che la parte che ancora non funziona sei tu
quando controlli di persona**, e il sistema è lì apposta. Se me lo confermi tu, quella non è una
debolezza dell'albero: è la sua riga più intelligente.

**3. Oggi è successo anche il contrario del tuo difetto, e lo scrivo con la stessa serietà con cui ti
scrivo il resto.** Ti ho messo davanti tre modi di far salire le tue skill, e uno era comodo — bastava
raccontarle bene. Hai preso il più severo e ci hai aggiunto una condizione tua: **niente livello
professionale senza una prova che si possa toccare.** Nessuno te l'aveva chiesto. ⚠️ È **un episodio
solo**, e sapevi di essere osservato: non è la prova che il difetto non c'è più, è la prova che sai
riconoscerlo quando conta. **La differenza fra le due cose la misuriamo nei blocchi, dove le risposte
costano.**
