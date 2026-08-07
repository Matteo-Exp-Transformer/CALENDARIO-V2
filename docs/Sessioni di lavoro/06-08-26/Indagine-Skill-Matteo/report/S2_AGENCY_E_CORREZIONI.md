# S2 — Agency e correzioni

> **Profilo:** Verifica | Meta · **Modalità:** deep · **Data report:** 07-08-26
> **Ingresso:** le Sezioni 2 dei 39 report di mining — **606 righe**, riconteggiate, non ereditate
> **Uscita:** **571 righe** dopo deduplica (24 fusioni, 28 righe assorbite)
> **Metodo:** estrazione meccanica rilanciabile + giudizio semantico firmato dal senior
> **Precondizione (regola comune 1):** verificata — `report/S1_CATALOGO_DECISIONI.md` esiste
> (chiuso il 07-08-26). Nessun file grezzo dei corpora è stato riaperto.

---

## §0 — L'avvertenza che va letta prima di qualunque numero di questo report

**Le correzioni agente→Matteo sono strutturalmente sotto-contate. Non di poco: per costruzione
del materiale.**

Nei transcript di CalendarBackup-v2 il testo delle risposte degli agenti è oscurato:
**19.198 righe su 22.862** contengono `[REDACTED]` (piano §2.1). Conseguenza diretta: quando un
agente ha corretto Matteo, **quella frase non è leggibile**. Le sue parole sì, quelle dell'agente no.

Questo report trova **381 M→A** (lui corregge l'agente) contro **157 A→M** (l'agente corregge lui).
**Quel rapporto non dice che veniva corretto di rado. Dice che le sue correzioni sono visibili e
quelle degli agenti no.**

La prova che si tratta di un artefatto del materiale, e non di un comportamento, è dentro i numeri
stessi — ed è la misura più importante di tutta l'ondata:

| Linea | M→A DIRETTA | M→A DEDOTTA | A→M DIRETTA | A→M DEDOTTA |
|-------|-------------|-------------|-------------|-------------|
| **H** (transcript, peso 1) | **66** | 0 | **0** | **13** |
| A (report di sessione, peso 3) | 146 | 9 | 40 | 16 |

Sulla fonte più diretta che esista — le sue parole in chat — **non esiste nemmeno una correzione
agente→Matteo citata verbatim. Zero su 13.** Tutte e 13 sono `DEDOTTA`, ricostruite dalle coppie di
messaggi consecutivi suoi. Non perché l'agente non lo correggesse: perché la frase dell'agente è
cancellata. Nello stesso perimetro, le sue 66 correzioni verso l'agente sono tutte `DIRETTA`.

**Il rapporto 381/157 non è un dato sul suo modo di lavorare. È la firma di un buco nel materiale.**
Chi userà questo report nel dossier finale deve riportare questa avvertenza accanto al numero, non
in nota.

### §0.1 — E c'è un secondo errore, che spinge nella direzione opposta

Il conteggio A→M non è solo sotto-contato dalla censura: è anche **gonfiato da due convenzioni di
scrittura** che due ondate hanno usato per far entrare nello schema qualcosa che lo schema non
prevedeva. Vanno registrate, non corrette (mandato).

1. **M1 usa `A→M` per dire «l'agente ha deviato», non «l'agente mi ha corretto».** Tutte e **14** le
   righe `A→M` di M1 sono di questo tipo, e **13 su 14 hanno esito `rifiutata`**: «Agente promuove
   sticky senza ratifica», «Scope creep deliverable extra ×3», «Fix Menu QR invece di Prenota»,
   «Sezioni report saltate». Sono errori dell'agente che Matteo ha respinto — nella sostanza sono
   M→A, non A→M. Non a caso sono l'unico posto del corpus dove `A→M` risulta `rifiutata`: **13 su 13
   delle A→M rifiutate stanno in M1**, e zero altrove.
2. **C1 usa `A→M` per registrare peer review agente↔agente**, e lo dichiara esplicitamente nel
   proprio testo: «*le correzioni tipiche qui sono agente↔agente… le si registra come `A→M` DEDOTTA
   quando proteggono il gate umano… **non sono prove che Matteo fosse fuori strada***». Sono **6**
   righe (C1-A01…A06).

**Letto in modo restrittivo** — escludendo le 14 di M1 e le 6 di C1, che per ammissione delle fonti
stesse non sono correzioni di Matteo:

| A→M | Letto alla lettera | Letto in modo restrittivo |
|-----|--------------------|---------------------------|
| DIRETTA | 90 | **77** |
| DEDOTTA | 67 | **60** |

Entrambe le letture restano **limiti inferiori**, per il motivo del §0. Le due letture non si
sommano e non si mediano: si dichiarano.

---

## §1 — Come è stato costruito (per chi deve poterlo rifare)

**L'estrazione è meccanica e rilanciabile.** Gli script stanno in
`docs/_lavoro/Indagine-Corpus/S2/` (fuori da git, autorizzato dalla regola comune 8) e sono
l'adattamento di quelli che S1 ha lasciato in `S1/`: cambia **solo** l'header canonico riconosciuto,
da `ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill` (Sez. 1) a
`ID | Direzione | Tipo prova | Cosa | Esito | Fonte` (Sez. 2).

| Script | Cosa fa |
|--------|---------|
| `estrai_sezione2.py` | riconosce **solo** l'header canonico, rispetta i pipe escapati, censisce a parte le satellite |
| `normalizza.py` | applica la mappa `01_INPUT_SINTESI.md` §2, marca sentinelle e `A→A`, calcola i conteggi |
| `classifica.py` | assegna materia e natura per regole di parola chiave dichiarate |
| `override_senior.py` | le righe dove le parole chiave sbagliano, corrette a mano **per ID** |
| `analizza.py` | tutte le tabelle di questo report |
| `dedup.py` + `fusioni.py` | candidati di deduplica cross-linea e le 24 fusioni firmate |

**La macchina propone, il senior firma.** Il classificatore per parole chiave ha lasciato scoperte
31 righe su materia e 160 su natura: le ho lette una per una nei dump
(`righe_MA.txt`, `righe_AM.txt`, `righe_MM.txt`) e le ho assegnate a mano. Gli override sono
**147 su materia** e **230 su natura**, elencati per ID in `override_senior.py`. Chi ricontrolla vede
esattamente dove ho messo le mani.

**Le tabelle satellite: lette, non contate.** Lo script le ha censite tutte. Le due che contano:
- **«Follow-up CORREGGONO vs ESTENDONO»** (`Relazione | Tipo | Evidenza`), presente in **9 report A
  su 11** (A2–A10) **dentro** il blocco Sezione 2, **57 righe** che citano ID veri e sembrano agency:
  **non contate**, ma lette — sono il materiale del §5.
- **«Rifiuti di Matteo»** (`# | Cosa | Data | Fonte`): M1 18 · B1 12 · A3 10 · B3 4 = **44 righe**.
  Schema diverso, non contate; usate come controprova nel §5.

**Cosa NON ho fatto, per mandato:** nessun report d'origine è stato corretto (M1 è registrato, non
sistemato); nessun conflitto lasciato aperto da S1 è stato chiuso; nessuna agency è stata inventata
per far quadrare un totale.

---

## §2 — I numeri d'ingresso: 606, ricontati per lotto

**Tutti e quattro i lotti tornano al numero atteso.** Nessun lotto è stato rifatto.

| Lotto | Report | Attese | Contate | Esito | Dettaglio per ondata |
|-------|--------|--------|---------|-------|----------------------|
| L1 | M1–M4 | 72 | **72** | ✅ | M1 38 · M2 9 · M3 12 · M4 13 |
| L2 | A1–A11 | 235 | **235** | ✅ | A1 27 · A2 21 · A3 27 · A4 20 · A5 14 · A6 24 · A7 24 · A8 24 · A9 14 · A10 20 · A11 20 |
| L3 | B1–B3, C1–C5, D1–D2, E1–E2, F1 | 138 | **138** | ✅ | B1 16 · B2 5 · B3 8 · C1 9 · C2 8 · C3 12 · C4 12 · C5 8 · D1 10 · D2 23 · E1 8 · E2 6 · F1 13 |
| L4 | G1–G3, H1–H5, I1–I2, J1 | 161 | **161** | ✅ | G1 14 · G2 20 · G3 10 · H1 25 · H2 16 · H3 20 · H4 16 · H5 11 · I1 13 · I2 9 · J1 7 |
| | **Totale** | **606** | **606** | ✅ | |

**Nessuna riga con colonne anomale.** A differenza della Sezione 1 (6 righe con un `|` dentro la
citazione), nella Sezione 2 tutte e 606 le righe hanno prodotto esattamente 6 celle.

### §2.1 — Le esclusioni, dichiarate

| Classe | N | Righe | Perché |
|--------|---|-------|--------|
| **Sentinelle** | 4 | C1-A08 · C4-A12 · C5-A07 · E2-A06 | dichiarano «nessuna M→A in perimetro»: sono l'assenza di una riga, non una riga |
| **`A→A`** | 3 | C4-A11 · I1-A13 · **M3-A12** | agente→agente: **non sono agency di Matteo** |
| **Righe di agency di Matteo** | **599** | | 606 − 4 − 3 |

**L'incoerenza `A→A`, sciolta con una scelta dichiarata.** L'input §2 segnalava che I1 esclude le
righe `A→A` dal proprio totale e M3 le include: chi eredita i sotto-totali dei `_stato/` importa
l'incoerenza senza accorgersene. **La mia scelta: si escludono**, in tutti e tre i casi, da tutti i
totali M→A/A→M/M↔M. Motivo: il piano §3.1 definisce `Direzione` come la relazione fra **Matteo** e
l'agente; una correzione fra due agenti non misura nessuna sua skill. La linea I1 aveva ragione, M3
no. Effetto: la famiglia M scende da 72 a **71** righe di agency, I da 22 a **21**, B–F da 138 a
**133**.

**Correzione a un dettaglio dell'input.** L'input §2 conta «6 righe sentinella con `—`». Riconteggio:
le righe con `Tipo prova = —` sono effettivamente 6, ma **due di quelle sei sono righe `A→A` vere**
(C4-A11 e I1-A13), con un contenuto reale e un esito compilato — non sentinelle. Le sentinelle vere
sono **4**. Le esclusioni totali sono quindi 7 righe distinte, non 9: i due insiemi si sovrappongono.

### §2.2 — Lo scarto di M1: registrato, non sistemato

| Report | Righe in tabella | Dichiarate in `_stato` | M→A reale | Stato |
|--------|------------------|------------------------|-----------|-------|
| **M1** | **38** | **42** | **22** (il report dice 26 alla riga 161) | **registrato, NON corretto** |
| E2 | 6 | 5 | — | riga sentinella E2-A06 lasciata in tabella |
| I1 | 13 | 12 | — | riga `A→A` esclusa dal totale ma non dalla tabella |

Confermo tutte e tre le divergenze segnalate dall'input §3, con i miei numeri. M1 resta **l'unico
report che non torna sul proprio criterio di accettazione** del piano §6: dichiara 42 righe di agency
e ne ha 38, e dichiara 26 M→A quando sono 22. Il mandato vieta di correggere il report d'origine:
**qui è registrato, e chi eredita i numeri deve usare 38 e 22, non 42 e 26.**

> **Coincidenza da non confondere.** Il numero **42** è anche il totale M→A corretto della **famiglia
> M intera** (M1 22 + M2 5 + M3 7 + M4 8 = 42), che è il numero riportato in `01_INPUT_SINTESI.md`
> §1. Un grep cieco su «42» mescola il totale di famiglia con l'errore di M1.

### §2.3 — Il controllo di coerenza atteso: torna

L'input chiedeva di verificare, non di dare per buono, che `606 − 6 sentinelle = 600 = DIRETTA 492 +
DEDOTTA 108`.

| Verifica | Risultato |
|----------|-----------|
| righe senza `Tipo prova` (`—`) | **6** |
| 606 − 6 | **600** |
| DIRETTA + DEDOTTA (su tutte le 606) | 492 + 108 = **600** ✅ |
| DIRETTA + DEDOTTA (sulle sole 599 di agency) | **491 + 108 = 599** ✅ |

Torna al singolo in entrambe le letture. La differenza fra 492 e 491 è la riga `A→A` M3-A12, che ha
`Tipo prova = DIRETTA` ed è esclusa dall'agency di Matteo ma non dal conteggio grezzo.

### §2.4 — Normalizzazione applicata (mappa `01_INPUT_SINTESI.md` §2)

**15 righe normalizzate su 606.**

| Colonna | Valore trovato | N | Trattamento | Righe |
|---------|----------------|---|-------------|-------|
| `Direzione` | `M↔A` | 1 | refuso per `M↔M` | A10-A15 |
| `Direzione` | `—` | 1 | sentinella, esclusa | E2-A06 |
| `Esito` | fuori vocabolario | **13** | valore base + colonna satellite `Esito_dettaglio` | 12 in M1 · 1 in M3 |

**Divergenza da dichiarare (regola comune 3).** L'input §2 prevedeva **16** valori di `Esito` fuori
vocabolario, di cui 15 in M1. Il mio riconteggio meccanico ne trova **13**: dodici in M1
(`rifiutata → hook` ×2, `rifiutata → freno`, `rifiutata → gate`, `rifiutata → riformulata`,
`rifiutata → alwaysApply`, `rifiutata → corretto`, `rifiutata (le voci)`, `rifiutata (per ora)`,
`rifiutata (domanda superflua)`, `parziale (intercettate)`, `accettata (costo A)`) e uno in M3
(`accettata (poi SUPERATO)`). Sommando le 4 righe con `Esito = —` si arriva a 17, non a 16: **la cifra
16 dell'input non è riproducibile in nessuna delle due letture.** Non cambia nessuna conclusione —
sono tutte varianti di `rifiutata`/`accettata`/`parziale` — ma va detto invece di essere ereditato.

**Il dettaglio è informativo e l'ho tenuto in colonna satellite**, non buttato: le sette forme
`rifiutata → hook / gate / freno / alwaysApply / riformulata / corretto` dicono una cosa sola e
importante, ed è materiale per il §5 — quando M1 rifiuta un comportamento dell'agente, il rifiuto
**non finisce in una lamentela: diventa un meccanismo**. Un hook, un gate, un freno, una regola
`alwaysApply`.

### §2.5 — Il quadro d'insieme, per famiglia

Tutti i numeri che seguono sono **prima** della deduplica del §8. Le tre `A→A` e le quattro
sentinelle sono già escluse.

| Famiglia | Agency | M→A | A→M DIRETTA | A→M DEDOTTA | M↔M | Riconciliazione con l'input §1 |
|----------|--------|-----|-------------|-------------|-----|-------------------------------|
| M (M1–M4) | 71 | 42 | 15 | 7 | 7 | input 72: include M3-A12 (`A→A`) |
| A (A1–A11) | 235 | 155 | 40 | 16 | 24 | input dice M↔M 23: non normalizzava `M↔A` di A10-A15 |
| B–F | 133 | 74 | 23 | 25 | 11 | input 138: include 4 sentinelle + 1 `A→A` |
| G (G1–G3) | 44 | 27 | 11 | 1 | 5 | coincide |
| H (H1–H5) | 88 | 66 | **0** | 13 | 9 | coincide |
| I (I1–I2) | 21 | 15 | 0 | 3 | 3 | input 22: include I1-A13 (`A→A`) |
| J (J1) | 7 | 2 | 1 | 2 | 2 | coincide |
| **Totale** | **599** | **381** | **90** | **67** | **61** | |

Ogni scostamento dall'input §1 è spiegato da una scelta dichiarata, non da un errore di conteggio.

---

## §3 — M→A: lui corregge l'agente (381 righe)

### §3.1 — Per materia: correggere il prodotto e correggere il processo sono due skill diverse

Il raggruppamento per materia è il punto in cui questa ondata rischia di più: appiattire
«hai sbagliato la regola di prenotazione» e «non hai fatto il report» in un unico numero produce un
verdetto finale falso. Otto materie, definite in `classifica.py` e non a posteriori:

| Materia | N | % | accettata | parziale | rifiutata | ignota |
|---------|---|---|-----------|----------|-----------|--------|
| **METODO** — processo di lavoro con gli agenti | **137** | 36.0% | 130 | 2 | 2 | 3 |
| **PRODOTTO** — regole di funzionamento | **66** | 17.3% | 64 | 2 | 0 | 0 |
| **AMBIENTI** — PROD/TEST, DB, migrazioni, branch, chiavi | **62** | 16.3% | 61 | 0 | 0 | 1 |
| **UI** — layout, grafica, componenti | **54** | 14.2% | 50 | 2 | 0 | 2 |
| **TESTING** — collaudo, controtest, falsi positivi | **40** | 10.5% | 37 | 3 | 0 | 0 |
| **VENDITA** — prezzo, GTM, legale | 12 | 3.1% | 12 | 0 | 0 | 0 |
| **LINGUAGGIO** — come gli si parla e come si scrive | 7 | 1.8% | 7 | 0 | 0 | 0 |
| **CODICE** — scelte tecniche interne | **3** | 0.8% | 3 | 0 | 0 | 0 |
| **Totale** | **381** | 100% | **364** | 9 | 2 | 6 |

**Tre letture obbligatorie di questa tabella.**

1. **La materia su cui corregge più spesso non è il prodotto: è il modo di lavorare.** METODO (137) da
   sola pesa più di PRODOTTO e UI insieme (120). Sommata ad AMBIENTI e TESTING — che sono anch'esse
   materie di processo, non di prodotto — si arriva a **239 su 381, il 63%**.
2. **Sul codice non corregge quasi mai: 3 righe su 381, lo 0,8%.** È il numero più importante di
   questa tabella e va portato per intero in S3/S4. Le tre righe sono: rifiuta un boss `IF-heavy` e
   chiede una classe `BossEnemy` (H4-A04, MathBoy2, 02-03), la regola sui nomi `al-ritrovo-*` nei file
   nuovi (G3-A05), il riuso di `validateSlotConfigs` (I1-A11). **Non esiste, nei 39 report, un corpo
   di correzioni sue sul codice.** Questo è il freno più forte contro qualunque rivendicazione di
   skill di *software developing* nel senso di scrittura di codice — e conferma per via indipendente
   il conflitto I-8 di S1 («autore git = suo lavoro» non è dimostrato).
3. **Quando corregge, viene accettato: 364 su 381 = 95,5%.** Le due sole `rifiutata` sono entrambe in
   M1 e sono rifiuti *suoi* verso proposte di sistema, non correzioni respinte: M1-A05 (scarta quattro
   voci di vocabolario rare) e M1-A32 (frena un file unico per la mappa delle richieste). In pratica
   **non esiste nel corpus un caso in cui corregge l'agente e l'agente non si adegua.** Nota di
   metodo: è un dato debole per definizione — i report sono scritti da chi doveva adeguarsi.

### §3.2 — Per materia e per linea

| Materia | M | A | B–F | G | H | I | J | tot |
|---------|---|---|-----|---|---|---|---|-----|
| METODO | 20 | 62 | 21 | 11 | 19 | 3 | 1 | 137 |
| PRODOTTO | 8 | 23 | 13 | 5 | 10 | 7 | 0 | 66 |
| AMBIENTI | 9 | 23 | 18 | 3 | 5 | 3 | 1 | 62 |
| UI | 1 | 17 | 11 | 1 | **22** | 2 | 0 | 54 |
| TESTING | 3 | 21 | 9 | 3 | 4 | 0 | 0 | 40 |
| VENDITA | 1 | 6 | 1 | 2 | 2 | 0 | 0 | 12 |
| LINGUAGGIO | 0 | 2 | 1 | 1 | 3 | 0 | 0 | 7 |
| CODICE | 0 | 1 | 0 | 1 | 1 | 0 | 0 | 3 |

**Il ribaltamento H vs M è il dato più interessante.** Sulla linea M (le skill scritte) la materia
dominante è METODO (20 su 42) e UI vale **1 riga**. Sulla linea H (le sue parole in chat) UI è la
materia **prima** con 22 su 66, davanti a METODO. Non è una contraddizione: è la differenza fra
**ciò che finisce codificato in una regola** e **ciò che fa davvero durante la giornata**. Nelle
skill scritte non c'è traccia delle decine di «annulla, il logo è un casino»; nei transcript sono la
maggioranza. Chi scrive S3 deve tenere separate le due colonne, e chi scrive S5 ha qui la sua
materia prima.

**Il cluster «annulla».** 31 righe su 599 contengono `annulla` o `ripristina`, e **21 su 31 stanno
sulla linea H** (cluster S2-T02, §8.2). È la forma più ripetuta della sua agency: non «rifai in
questo modo», ma **«torna a com'era»**. Nel corpus H ci sono anche le serie: H1-A04 annulla e ritara
il logo quattro volte di fila (1/3 → 1/5 → 1/12 → 1/15, esito `parziale`), H5-A03 fa la stessa cosa
su un altro progetto.

### §3.3 — M→A: DIRETTA e DEDOTTA

| Famiglia | DIRETTA | DEDOTTA | tot |
|----------|---------|---------|-----|
| M | 42 | 0 | 42 |
| A | 146 | 9 | 155 |
| B–F | 67 | 7 | 74 |
| G | 26 | 1 | 27 |
| **H** | **66** | **0** | 66 |
| I | 13 | 2 | 15 |
| J | 2 | 0 | 2 |
| **Totale** | **362** | **19** | **381** |

Il 95% delle sue correzioni è citato verbatim. Confronta con il §4: è l'asimmetria del §0.

---

## §4 — A→M: l'agente corregge lui (157 righe, DIRETTA e DEDOTTA sempre separate)

> **Non esiste in questo report un totale unico A→M.** `DIRETTA` è una citazione; `DEDOTTA` è una
> ricostruzione da due messaggi consecutivi suoi (piano §2.1). Sommarle significa presentare
> un'inferenza come una prova. Sono **90** e **67**, e restano due numeri.

### §4.1 — Per linea

| Famiglia | DIRETTA | DEDOTTA |
|----------|---------|---------|
| M | 15 | 7 |
| A | 40 | 16 |
| B–F | 23 | 25 |
| G | 11 | 1 |
| **H** | **0** | **13** |
| I | **0** | 3 |
| J | 1 | 2 |
| **Totale** | **90** | **67** |

**Le due righe a zero sono il cuore del §0.** H e I non hanno **nessuna** A→M `DIRETTA`. Su H il
motivo è la censura. Su I (i piani) il motivo è diverso e va detto: un piano contiene la proposta
dell'agente, non la risposta di Matteo, quindi «l'agente lo ha corretto» si può solo dedurre dal
fatto che il piano è stato riscritto (I1-A10: «Opus corregge piano fasce v1»).

### §4.2 — Per materia

| Materia | DIRETTA | DEDOTTA |
|---------|---------|---------|
| METODO | 38 | 24 |
| AMBIENTI | 18 | 16 |
| TESTING | 18 | 9 |
| VENDITA | 3 | 6 |
| PRODOTTO | 4 | 3 |
| UI | 3 | 3 |
| LINGUAGGIO | 1 | 2 |
| CODICE | 0 | 1 |
| ALTRO | 5 | 3 |

**Su cosa viene corretto: sui fatti dell'ambiente e sulla qualità delle prove, non sul prodotto.**
AMBIENTI + TESTING fanno 36 `DIRETTA` e 25 `DEDOTTA`, contro PRODOTTO+UI che fanno 7 e 6. Il tipo
ricorrente è: *lui crede che una cosa sia rotta o sistemata, e l'agente gli mostra che il problema è
altrove*. Esempi con fonte:
- **H3-A19** (DEDOTTA, peso 1): credeva che l'invio email fosse rotto; era la chiave segreta
  sbagliata. È anche l'unica A→M di peso 1 su cui S1 ha costruito il cluster T04.
- **A2-A09**: i dati stavano su TEST e Vercel puntava a PROD.
- **A11-A19** (DIRETTA): lo stato che aveva ereditato era falso — «2 difetti / 18 commit» — e ha
  dovuto riverificare. Ricorre tre volte, registrato in M1-A35 come pattern.
- **A11-A13**: la sua ipotesi «i 3 rossi sono un'interazione» smentita, 1 caso su 9.
- **H4-A12** (DEDOTTA, MathBoy2, 02-03): **«ho sbalgiato»** — ammette di aver chiesto lui la modifica
  sbagliata. È una delle poche ammissioni esplicite di errore in tutto il corpus.

### §4.3 — Per esito

| Esito | DIRETTA | DEDOTTA |
|-------|---------|---------|
| accettata | 64 | 48 |
| parziale | 6 | 9 |
| **rifiutata** | **13** | **0** |
| ignota | 7 | 10 |

**Le 13 `rifiutata` sono tutte in M1**, e sono il caso del §0.1: non è «l'agente mi corregge e io
rifiuto», è «l'agente ha deviato e io lo respingo». Al netto di quelle, **nel corpus non esiste una
sola riga in cui un agente corregge Matteo nel merito e lui rifiuta la correzione**. Le 112
`accettata` (64+48) dicono che quando la correzione arriva ed è leggibile, la prende.

Va detto il limite: `ignota` vale 7+10 = 17 righe, cioè l'11% — casi in cui il report registra la
correzione ma non dice come è finita.

---

## §5 — La domanda scomoda: MERITO o FORMA?

**La domanda.** Quando corregge un agente, gli sta dicendo *«la scelta era sbagliata»* (merito) o
*«non hai seguito il processo»* (forma)? Sono due skill diverse — **saper vedere l'errore** e **saper
far rispettare una regola** — e il dossier finale non deve confonderle.

**Le definizioni, dichiarate prima dei numeri.**

| Valore | Significato |
|--------|-------------|
| **MERITO** | il contenuto o il risultato era sbagliato: un bug, un layout non voluto, una regola di prodotto errata, un valore sbagliato |
| **FORMA** | il processo non è stato seguito: scope creep, report mancante, commit non chiesto, zona sbagliata, ha scritto dove non doveva, ha lavorato su `main` |
| **MISTO** | la stessa riga contiene un errore di contenuto **e** un rilievo di processo |

**Il risultato complessivo.**

| Natura | N | % su 381 |
|--------|---|----------|
| **FORMA** | **207** | **54,3%** |
| **MERITO** | **127** | 33,3% |
| MISTO | 47 | 12,3% |
| INCERTO | 0 | 0% |

Letto così, la risposta sarebbe secca: **corregge la forma più del merito, una volta e mezza tanto.**
Ma questo numero, preso da solo, è sbagliato — e il motivo è lo stesso del §0.

### §5.1 — Perché il totale è distorto, e come si corregge

| Linea | MERITO | FORMA | MISTO | FORMA % |
|-------|--------|-------|-------|---------|
| M (skill scritte) | 12 | 30 | 0 | **71%** |
| G (lavoro privato) | 5 | 19 | 3 | **70%** |
| A (report di sessione) | 50 | 86 | 19 | 55% |
| I (piani) | 7 | 8 | 0 | 53% |
| B–F (legacy) | 21 | 38 | 15 | 51% |
| **H (parole sue, peso 1)** | **32** | **24** | **10** | **36%** |
| J (fatti) | 0 | 2 | 0 | 100% |

**Sulla fonte di peso 1 il verdetto si ribalta: il merito supera la forma, 32 a 24.**

La spiegazione non è un mistero, ed è la ragione per cui la gerarchia probatoria del piano §1 esiste.
Le linee M e G — quelle che spingono FORMA al 70% — **sono composte da documenti di processo**: un
vocabolario, un registro di errori di processo, un masterplan, un piano di blindatura. In un documento
che parla di regole, ogni correzione registrata è per costruzione una correzione di regola. Non è
Matteo che corregge solo la forma: **è il documento che sa registrare solo la forma.**

Nei transcript, dove non c'è filtro documentale, quello che fa davvero è in maggioranza merito:
«il testo della fascia deve essere nero», «la foto su mobile non deve comparire», «il no-show si conta
dall'inizio non dalla fine», «no Supabase per le email, Brevo».

**La risposta onesta alla domanda scomoda, in tre righe:**

1. **Le due skill esistono entrambe e sono entrambe dimostrate.** 127 correzioni di merito e 207 di
   forma non sono un aut-aut: sono due repertori attivi in parallelo.
2. **Nel fare quotidiano prevale il merito** (peso 1: 32 vs 24). **Nel lascito scritto prevale la
   forma** (peso 3–4: 49 vs 90 su M+G+A senza H). Chi legge solo le skill vede un enforcer di
   processo; chi legge le chat vede uno che guarda lo schermo e vede che è sbagliato.
3. **Il punto di forza vero non è nessuna delle due: è la conversione.** Ed è documentata da una
   colonna che avrei potuto buttare — i sette esiti fuori vocabolario di M1 (§2.4):
   `rifiutata → hook`, `rifiutata → gate`, `rifiutata → freno`, `rifiutata → alwaysApply`,
   `rifiutata → riformulata`, `rifiutata → corretto`. Quando rifiuta un comportamento, **il rifiuto
   diventa un meccanismo che lo impedisce la volta dopo**. È esattamente il salto L3 → L4 della scala
   del piano §3.4, ed è materiale diretto per S3.

### §5.2 — La controprova nelle 57 righe CORREGGONO vs ESTENDONO

Le nove tabelle satellite di A2–A10 (57 righe, non contate) classificano i follow-up di ogni
sessione come `CORREGGE` o `ESTENDE`. Sono la controprova indipendente del §5, perché **usano un
criterio scritto da altri, prima di me**. E i loro qualificatori dicono la stessa cosa che dicono i
miei numeri: dove marcano una correzione, specificano di che tipo — e i tipi che citano sono
`(zona)`, `(processo)`, `(intent)`, `(meta)`, `(falso positivo)`, `(propria decisione)`.

Due righe di quelle tabelle valgono più del resto e vanno consegnate a S4:
- **A9**: «M2 daily limit (11-06) → rimozione 18-06 | **CORREGGE** *(propria decisione)*». È l'unica
  tabella dell'intero corpus che scrive nero su bianco che il soggetto corretto era **lui stesso**.
- **A9**: «Rotella 17-06 "ok" → fix passive 19-06 | **CORREGGE** *(falso positivo)*». Il caso in cui
  aveva dichiarato buono qualcosa che non lo era.

Le quattro tabelle **«Rifiuti di Matteo»** (44 righe) confermano lo stesso schema dal lato negativo:
dei 18 rifiuti di M1, **almeno 12 sono rifiuti di forma** (voci di vocabolario non ratificate, path
tecnici nelle checklist, agenti che codificano su «annota», dedurre `push` da `commit`, esecutori che
toccano il plan), e i rifiuti di B1 sono invece quasi tutti di **scope di prodotto** (presence,
realtime legacy, pagamenti, multi-sede). Stessa persona, due corpora, due tipi di rifiuto: la
distinzione merito/forma non è una mia invenzione di classificazione, **è nel materiale**.

---

## §6 — M↔M: quando cambia idea da solo (61 righe)

**La distinzione richiesta.** «Scoperta di prodotto» (è arrivata un'informazione nuova) non è la
stessa cosa di «errore corretto» (aveva sbagliato). E per dirlo **serve la citazione del motivo**:
senza quella, la riga resta `INCERTO` (piano §3.2 — è un risultato valido, non un fallimento).

| Motivo | N | DIRETTA | DEDOTTA |
|--------|---|---------|---------|
| **SCOPERTA** — è arrivata un'informazione nuova | **23** | 16 | 7 |
| **ERRORE** — la fonte dice che aveva sbagliato lui | **6** | 6 | 0 |
| **INCERTO** — cambia idea, il motivo non è citato | **32** | 17 | 15 |
| Totale | 61 | 39 | 22 |

| Famiglia | SCOPERTA | ERRORE | INCERTO | tot |
|----------|----------|--------|---------|-----|
| A | 11 | 2 | 11 | 24 |
| B–F | 4 | 0 | 7 | 11 |
| H | 3 | 2 | 4 | 9 |
| M | 3 | 1 | 3 | 7 |
| G | 0 | 1 | 4 | 5 |
| I | 1 | 0 | 2 | 3 |
| J | 1 | 0 | 1 | 2 |

**Il risultato più netto di questa sezione: su 61 cambi di idea, solo 6 hanno accanto una citazione
in cui risulta che aveva sbagliato.** Un cambio di idea su dieci. Le altre 55 sono o una scoperta
(23) o un motivo che nessuno ha scritto (32).

**Le sei righe ERRORE, tutte `DIRETTA`, con fonte:**

| ID | Cosa | Fonte |
|----|------|-------|
| M1-A34 | Ridefinizione «lavoro ok» vs «fai report finale» (01-06) | `VOCABOLARIO`; `COMANDI_AVVIO` |
| A3-A25 | Confusione «lavoro ok» vs «fai report finale» | enforcement-cursor |
| A2-A19 | Intent overlay: mattina no, pomeriggio sì (~12h) | prepara v1 vs esecutore |
| G1-A12 | Auto-sorveglianza dello scope creep: sa di allargare a metà | `PROFILO` L26 |
| H1-A21 | Testo fascia bianco → nero → **«scusami»** → bianco | `97e72333…` seq 12–13 |
| H2-A11 | Nello stesso thread: «non annullare scroll fondo» dopo «ripristina» | `4cedb88b…` seq 5→6 |

Due di queste sei sono lo **stesso** errore visto da due linee (M1-A34 + A3-A25, fusione S2-F04): la
prima volta che ha usato «lavoro ok» e «fai report finale» li intendeva scambiati, e ha dovuto
ridefinirli. Un errore di suo vocabolario, ammesso e codificato.

### §6.1 — Il caso di prova obbligato: il limite coperti giornaliero

Il mandato chiede di non forzarlo in nessuna direzione. Ecco **esattamente cosa c'è scritto**, senza
aggiungere niente.

| ID | Direzione | Prova | Cosa dice il report | Fonte |
|----|-----------|-------|---------------------|-------|
| A9-A04 | **M↔M** | DIRETTA | «Modello limiti **supera** M2 11-06» | limiti r.3–5; prepara-prompt §4 |
| M3-A03 | **M↔M** | DIRETTA | «Limite giornaliero (11-06) → rimosso (18-06) modello per-fascia» | `SETTINGS` §8; `PRENOTAZIONI` note 05-08 |
| A9-A02 | M→A | DIRETTA | «Rimozione daily limit + nuovo modello» | limiti-coperti §11 R1 |
| (satellite A9) | — | — | «M2 daily limit (11-06) → rimozione 18-06 \| **CORREGGE** *(propria decisione)*» | tabella CORREGGONO/ESTENDONO |

**Classificazione: `INCERTO` per entrambe le righe M↔M.** Il verbo usato dai report è **«supera»** e
**«rimosso… modello per-fascia»**: descrivono una sostituzione di modello. **Nessuna citazione di
Matteo dice che era un errore, e nessuna citazione dice che non lo era.** Il qualificatore
`(propria decisione)` della tabella satellite conferma solo che il soggetto corretto era lui, non che
si trattasse di uno sbaglio.

**Resta aperto per S4.** È il cluster **T01** di S1 e il conflitto **N-5** del suo §3.2. Coerentemente
con il mandato, non l'ho spostato né verso SCOPERTA né verso ERRORE.

> **Un dato adiacente che S4 deve avere sotto mano, e che non chiude questo caso.** Esiste **una**
> riga in cui ammette in prima persona una decisione sbagliata sulla stessa area di prodotto, e non è
> questa: **M3-A02**, `M→A` `DIRETTA`, **«avevo deciso male»**, con cui *ritira il blocco per-fascia
> sul pubblico* (`PRENOTAZIONI` §5-ter.10). Riguarda il blocco per-fascia, non il limite giornaliero.
> Sono due decisioni vicine e distinte: **sul blocco per-fascia ammette l'errore a parole; sul limite
> giornaliero no.** Usare la prima per chiudere la seconda sarebbe esattamente la forzatura che il
> mandato vieta — ma ignorare che la frase esiste sarebbe altrettanto sbagliato.

### §6.2 — Le 23 SCOPERTA: cosa lo fa cambiare idea

Il pattern ricorrente è che il cambio di idea arriva **dopo una spiegazione o dopo una prova**, non
dopo un'insistenza. Le più leggibili:
- **A7-A09**: il senior ribalta il listino, Pro 79 → 69 e fondatori da 3 a 6 mesi, **lo stesso giorno**
  (è l'evento che S1 registra come N-2: la skill Marketing fotografa solo lo stato finale).
- **A8-A02**: credeva rotta la posta, era la chiave SMTP invece della API `xkeysib`.
- **H3-A14**: «allinea il menu desktop al tablet» **dopo «hai ragione»**.
- **A4-A04**: falso negativo su un layout — non aveva riavviato.
- **A9-A13**: la rotella dichiarata «già fixata» era ancora KO (SET-05).
- **E1-A05** (trading): Gemini su tutti i tier → ladder Qwen/DeepSeek → Puter user-pays, **e Puter non
  è mai stato rilasciato**: tre cambi di modello in due giorni, l'ultimo mai eseguito.

### §6.3 — Le 32 INCERTO non sono un difetto di questa ondata

Sono la conseguenza di una regola: `Direzione = M↔M` registra **che** ha cambiato idea, e lo schema
§3.1 **non ha un campo per il perché**. Il motivo esiste solo se l'agente di mining lo ha messo dentro
le 20 parole di `Cosa`. Chiudere le 32 richiederebbe di riaprire i corpora, che il mandato vieta.
**Lacuna dichiarata, non aggirata** (§11).

---

## §7 — Evoluzione nel tempo

> ⚠️ **Il limite che decide questa sezione, dichiarato prima dei numeri.** **La Sezione 2 non ha una
> colonna `Data`.** Solo **13 righe su 606** hanno una data ricavabile dal campo `Fonte`. Quindi la
> serie temporale **non** è costruita sulle righe: è costruita sul **perimetro dichiarato
> dell'ondata** (piano §4 — A1 = 23-26/05, A7 = 12-06, H1 = 27/04-15/05, e così via). È una datazione
> per finestra, non per evento, e non regge ragionamenti sul singolo giorno.
>
> **Secondo limite, dal mandato:** si confronta **A con A** e **H con H**, mai l'una contro l'altra.
> H è per costruzione solo materiale suo. M, B–F, G, I, J **non sono databili** e restano fuori da
> questa sezione — non «al mese ignoto»: fuori.

### §7.1 — Linea A (report di sessione, peso 3): confronto A con A

| Ondata | Periodo | tot | M→A | M→A % | A→M DIR | A→M DED | M↔M | MERITO | FORMA |
|--------|---------|-----|-----|-------|---------|---------|-----|--------|-------|
| A1 | 23–26/05 | 27 | 17 | 63% | 3 | 4 | 3 | 3 | 12 |
| A2 | 27–29/05 | 21 | 14 | 67% | 4 | 1 | 2 | 4 | 10 |
| A3 | 30/05–01/06 | 27 | 23 | **85%** | 2 | 1 | 1 | 7 | 12 |
| A4 | 02–05/06 | 20 | 14 | 70% | 3 | 1 | 2 | 4 | 7 |
| A5 | 06–10/06 | 14 | 9 | 64% | 2 | 2 | 1 | 5 | 4 |
| A6 | 11+13/06 | 24 | 17 | 71% | 3 | 1 | 3 | 6 | 8 |
| A7 | 12/06 | 24 | 13 | 54% | 6 | 2 | 3 | 2 | 10 |
| A8 | 15–16/06 | 24 | 16 | 67% | 6 | 0 | 2 | 7 | 8 |
| A9 | 17–19/06 | 14 | 10 | 71% | 1 | 1 | 2 | **8** | **2** |
| A10 | 20–24/06 | 20 | 13 | 65% | 2 | 2 | 3 | 3 | 6 |
| **A11** | **02–06/08** | 20 | **9** | **45%** | **8** | 1 | 2 | **1** | 7 |

**Aggregato per mese di perimetro:**

| Mese | tot | M→A | M→A % | A→M DIR | A→M DED | M↔M |
|------|-----|-----|-------|---------|---------|-----|
| maggio (A1–A2) | 48 | 31 | 65% | 7 | 5 | 5 |
| fine mag / inizio giu (A3) | 27 | 23 | 85% | 2 | 1 | 1 |
| giugno (A4–A10) | 140 | 92 | 66% | 23 | 9 | 16 |
| **agosto (A11)** | 20 | 9 | **45%** | **8** | 1 | 2 |

**Cosa dicono i numeri, e cosa non dicono.**

1. **La quota di correzioni sue NON cresce.** Da maggio a giugno resta piatta intorno al 65%. La
   risposta alla domanda del mandato è **no**: nella linea A non c'è una curva di crescita
   dell'agency. Il picco è A3 (85%), a fine maggio, non alla fine del percorso.
2. **In agosto il rapporto si ribalta: le A→M `DIRETTA` di A11 sono 8, il massimo assoluto di tutte
   le undici ondate A, e le sue M→A scendono al 45%, il minimo assoluto.** Nella sola A11 ci sono
   tante A→M `DIRETTA` quante in maggio e fine maggio insieme (7+2). Questa è la differenza più
   marcata di tutta la serie e va consegnata a S3 come segnale, non come conclusione.
3. **La lettura di quel ribaltamento non è univoca, e non la chiudo.** Due ipotesi compatibili con lo
   stesso dato: (a) in agosto lavorava con una squadra di agenti che verificava di più e lo correggeva
   di più (revisori, controverifiche, senior: A11-A08, A11-A09, A11-A13, A11-A17, A11-A19 sono tutte
   `DIRETTA`); (b) le sue premesse ereditate dopo sei settimane di pausa erano più fragili, e più
   spesso false (A11-A19, M1-A35). Entrambe hanno fonti; nessuna delle due è dimostrata. **Handoff a
   S3/S4.**
4. **A9 è il picco del merito** (8 MERITO contro 2 FORMA, l'unica ondata dove il merito domina così
   netto). È la settimana del ribaltamento del limite coperti e del falso positivo sulla rotella:
   coerente con il fatto che in quella settimana guardava il prodotto, non il processo.

**Materia nel tempo (solo M→A, linea A):**

| Mese | METODO | AMBIENTI | PRODOTTO | UI | TESTING | VENDITA |
|------|--------|----------|----------|----|---------|---------|
| maggio (n=31) | 16 | 5 | 4 | 2 | 2 | 1 |
| fine mag/inizio giu (n=23) | **15** | 1 | 0 | 5 | 2 | 0 |
| giugno (n=92) | 28 | **16** | **17** | 9 | **15** | 5 |
| agosto (n=9) | 3 | 1 | 2 | 1 | 2 | 0 |

**Lo spostamento c'è, ma è di materia, non di quantità.** A maggio e fine maggio le correzioni sono
schiacciate su METODO (31 su 54): stava costruendo il modo di lavorare. A giugno si distribuiscono —
AMBIENTI 16, PRODOTTO 17, TESTING 15 salgono tutte insieme, mentre METODO scende in proporzione (da
oltre il 55% a meno del 31%). **Non corregge più di prima: corregge cose diverse.** Il metodo, a
giugno, era già in piedi. Questa è la freccia temporale più solida che S2 consegna a S3.

### §7.2 — Linea H (parole sue, peso 1): confronto H con H

| Ondata | Periodo | tot | M→A | M→A % | A→M DIR | A→M DED | M↔M |
|--------|---------|-----|-----|-------|---------|---------|-----|
| H4 | feb–mar (preistoria) | 16 | 12 | 75% | **0** | 2 | 2 |
| H1 | 27/04–15/05 | 25 | 20 | **80%** | **0** | 3 | 2 |
| H2 | 16–31/05 | 16 | 12 | 75% | **0** | 2 | 2 |
| H3 | 01/06–06/08 | 20 | 15 | 75% | **0** | 3 | 2 |
| H5 | mag–lug (parallelo) | 11 | 7 | 64% | **0** | 3 | 1 |

**Sulla linea H la quota è una costante, non una curva: 75% ± 5 in tutte e cinque le finestre, da
febbraio ad agosto.** Non c'è crescita, e neppure calo. Va letta insieme al dato che il piano §2.2 ha
già stabilito: **a febbraio la pratica era già lì** (H4 data la nascita di `controverifica` al 24-02,
come parola-comando e regola scritta). La linea H non racconta l'apprendimento dell'agency: la
racconta come stabile per tutto il periodo osservato.

**Il vero contenuto informativo di questa tabella è la colonna a zero.** Cinque finestre, cinque
ondate, cinque zeri. Su 88 righe di agency sulla fonte di peso 1, **nessuna correzione dell'agente è
leggibile verbatim**. È il §0 misurato cinque volte in modo indipendente.

---

## §8 — Deduplica, con lo stesso criterio di S1

**Criterio ereditato da S1 §2, non reinventato:**

| | Definizione | Trattamento |
|---|-------------|-------------|
| **FUSIONE** | più righe descrivono **la stessa** correzione: stesso oggetto, stessa occasione, o evoluzione dichiarata dello stesso item | si conta **una** volta |
| **CLUSTER** | più correzioni **diverse** sullo stesso tema (es. quattro volte «non committare» in quattro sessioni) | **non** si fondono: sono ripetizioni reali |

Il candidato-generatore (`dedup.py`) ha proposto **105** coppie per sovrapposizione di token fra
ondate diverse. Le ho lette tutte: **24 fusioni firmate**, le altre erano cluster o coincidenze
lessicali. Ogni ID citato è stato verificato esistente nel dataset.

### §8.1 — Le 24 fusioni

| Codice | Tema | Righe fuse | Peso | Direzione | Nota |
|--------|------|-----------|------|-----------|------|
| S2-F01 | Allineamento skill implicito: non si chiede | M1-A19 + A4-A08 | 3 | M→A | M1 = la regola, A4 = l'applicazione del 04-06 |
| S2-F02 | Sospetta dati finti, chiede audit calendario vs SQL | C2-A02 + C4-A06 | 3 | M→A | stessa fonte; gemella di F085 in S1 |
| S2-F03 | No-show sull'orario di inizio, non di fine | A6-A09 + H3-A10 | **1** | M→A | controparte di F075 in S1 |
| S2-F04 | «lavoro ok» ≠ «fai report finale» (ridefinizione) | M1-A34 + A3-A25 | 3 | M↔M | controparte di F004/F005 in S1 |
| S2-F05 | Overlay ingredienti: mattina no → pomeriggio sì | M1-A11 + A2-A19 | 3 | M↔M | stessa giornata 29-05, ~12h |
| S2-F06 | Form di creazione vuoti, non precompilati | C2-A01 + C4-A05 | 3 | M→A | controparte di F084 in S1 |
| S2-F07 | Ogni account registrato ha la sua company | C2-A03 + C4-A07 | 3 | M→A | controparte di F086 in S1 |
| **S2-F08** | Promo: multi-select 0/1/2/tutte + modal di conflitto | A2-A15 + H2-A04 + H2-A05 + G2-A17 | **1** | M→A | **controparte congiunta di F007 *e* F063** |
| S2-F09 | Header nella home QR: zona sbagliata | A3-A06 + H2-A09 | **1** | M→A | H conferma A3 |
| S2-F10 | Annulla: lo sticky dell'esecutore è ancora sbagliato | A4-A03 + H3-A04 | **1** | M→A | stesso turno |
| S2-F11 | «annulla» il lavoro del revisore sul padding | A3-A15 + H2-A16 | **1** | M→A | H conferma A3 |
| S2-F12 | Conferma di salvataggio: modale, non toast | A3-A20 + H3-A02 | **1** | M→A | controparte di F065 in S1 |
| S2-F13 | Foto categoria: non su mobile (requisito invertito) | A3-A19 + H3-A01 | **1** | M→A | controparte di F068 in S1 |
| S2-F14 | Asset tema: «l'immagine non va bene» | A3-A05 + H2-A08 | **1** | M→A | stesso batch asset |
| S2-F15 | Ritiro di «sticky» dal VOCABOLARIO | M1-A04 + A4-A02 + H3-A06 | **1** | M→A | tre linee sullo stesso evento 02-06 |
| S2-F16 | L'analisi sta in un file suo, non nelle skill | G3-A04 + H2-A07 | **1** | M→A | H la mostra in atto |
| S2-F17 | L'orchestratore parla con la skill di comunicazione | A5-A01 + H3-A07 | **1** | M→A | controparte di F073 in S1 |
| S2-F18 | Controtest «rompi» imposto a tutte le aree | M1-A16 + M3-A11 | 3 | M→A | controparte di F030 in S1 |
| S2-F19 | Walk-in senza tavolo è un bug, non una feature | A10-A12 + G2-A02 | 3 | M→A | stessa regola da due linee |
| **S2-F20** | Stato ereditato falso: riverifica invece di fidarsi | M1-A35 + A11-A19 | 3 | A→M | M1 aggrega ×3, A11 è un'istanza |
| S2-F21 | Grilletti dei profili: «meta senior» va mappato | M1-A02 + A3-A09 | 3 | M→A | A3 è il prompt fallito che l'ha generata |
| **S2-F22** | Mandato «educare Matteo» + hook a file unico | M1-A14 + A4-A01 | 3 | M→A | controparte di F028 in S1 — **eredita il conflitto N-3, NON chiuso qui** |
| S2-F23 | PAUSA-RACCOLTA: stop ai nuovi meccanismi | M1-A27 + A3-A11 | 3 | M→A | A3 verifica che sia stata rispettata |
| **S2-F24** | Deploy edge function su TEST: debito mai chiuso | A4-A13 + A6-A20 + A7-A20 | 3 | A→M | **stesso item aperto seguito in tre ondate** |

**Effetto sui totali.** Regola di ritenzione dichiarata: **di ogni fusione si tiene la riga con il
peso probatorio più alto** (H prima di J, J prima dei report). Non è indifferente: in 11 delle 24
fusioni la riga tenuta è quella di peso 1, quindi la deduplica non toglie soltanto un doppione,
**alza la prova**.

| | Prima | Assorbite | Dopo |
|---|-------|-----------|------|
| **righe di agency** | **599** | **28** | **571** |
| M→A `DIRETTA` | 362 | 22 | **340** |
| M→A `DEDOTTA` | 19 | 1 | **18** |
| A→M `DIRETTA` | 90 | 3 | **87** |
| A→M `DEDOTTA` | 67 | **0** | **67** |
| M↔M `DIRETTA` | 39 | 2 | **37** |
| M↔M `DEDOTTA` | 22 | 0 | **22** |

Le righe coinvolte nelle fusioni sono **52** su 24 fusioni. **Nessun totale mischia `DIRETTA` e
`DEDOTTA`**, nemmeno dopo la deduplica. Le A→M `DEDOTTA` non perdono nemmeno una riga: le deduzioni
sono per costruzione uniche per coppia di messaggi, non ci sono doppioni da fondere.

**Due fusioni meritano attenzione oltre il conteggio.**
- **S2-F08 è una fusione a quattro** ed è il caso più delicato: `A2-A15` è una riga **composta** che
  copre in una sola cella sia il multi-select delle promo sia il modal di conflitto — cioè **due**
  fusioni distinte di S1 (F007 e F063). Inoltre `G2-A17` dichiara come propria fonte «campione H»:
  è la stessa evidenza già vista in H2, non una conferma indipendente. Senza questa fusione, la stessa
  correzione sarebbe stata contata quattro volte.
- **S2-F24 non è una ripetizione: è la stessa promessa non mantenuta, inseguita tre volte.** Il deploy
  delle edge function su TEST parte come FU-031 in A4, ricompare come C-D5/BREVO in A6, e in A7 è
  ancora nel `fu-log`. Vale una riga, ma la sua natura di **debito che attraversa tre sessioni** è
  materiale per S4 e non va perso nella fusione.

### §8.2 — Sette cluster: raccontati insieme, non fusi

| Codice | Tema | Righe |
|--------|------|-------|
| S2-T01 | «non committare»: la regola e le sue **4** esecuzioni | M1-A03 · A3-A14 · A7-A11 · A11-A01 |
| **S2-T02** | **«annulla»: il comando più ripetuto della linea H** | **15 righe** — H1-A01…A07, A09, A10 · H2-A01, A16 · H3-A03, A05 · H4-A06 · H5-A02 |
| S2-T03 | Scope creep: rilevato, sorvegliato, codificato | M1-A07 · G1-A09 · C1-A03 · A8-A03 · H2-A10 |
| S2-T04 | «non ho capito»: la comprensione come criterio di accettazione | **7 righe** — A3-A16 · A5-A01 · A2-A06 · H2-A15 · H3-A17 · H1-A24 · A11-A03 |
| S2-T05 | Merge in PROD: ogni rilascio ha il suo cancello | A6-A17 · A7-A16 · A7-A17 · A9-A08 · G2-A14 · J1-A03 |
| S2-T06 | Orchestrazione via sub-agent | A4-A16 · A7-A03 · A10-A10 |
| S2-T07 | Il gate umano prima del verde dell'agente (eredita T11 di S1) | **9 righe** — B2-A01…A04 · C4-A02 · C4-A03 · C5-A03 · C5-A04 · C1-A01 |

**T02 e T07 sono i due cluster con più peso probatorio.** T02 (15 righe) è tutto su fonte di peso 1:
è la forma **osservata** della sua agency, non quella dichiarata. T07 (9 righe) attraversa tre progetti
legacy diversi e dice che il gate umano prima del «verde» dell'agente **non è una regola nata in
CalendarBackup**: era già la sua pratica prima.

### §8.3 — Le cinque fusioni che S1 ha nominato: dove finiscono in Sezione 2

Il mandato chiede di trattarle allo stesso modo, altrimenti la stessa correzione viene contata due
volte. Esito verificato riga per riga:

| Fusione S1 | Righe S1 | Controparte in Sezione 2 | Esito |
|------------|----------|--------------------------|-------|
| **F007** | A2-D46 + H2-D33 (modal conflitto promo) | **S2-F08** | **fusa** |
| **F063** | A2-D45 + H2-D32 (promo multi-select) | **S2-F08** | **fusa** — stessa riga composta A2-A15 |
| **F011** | A2-D51 + H2-D37 (autosave solo in debug) | — | **nessuna controparte**: non esiste una riga di agency sull'autosave. Era una decisione, non una correzione |
| **F059** | A1-D10 + H2-D10 (database pulito su test e prod) | H2-A03 (solo su H) | **niente da fondere**: A1 non ha una riga di agency corrispondente |
| **F060** | A1-D12 + H2-D09 («La Ritrovo» fuori scope) | — | **nessuna controparte** in Sezione 2 |

**Solo due delle cinque avevano davvero una controparte doppia, e entrambe cadono nella stessa
fusione S2-F08.** Le altre tre erano decisioni senza una correzione corrispondente: **il fatto che
S1 le abbia dovute fondere e S2 no non è un'incoerenza fra le due ondate, è la differenza fra ciò che
ha deciso e ciò che ha corretto.** Dichiarato qui perché chi confronta i due cataloghi per numero di
fusioni si aspetterebbe una simmetria che non c'è.

**Le altre 22 fusioni sono nuove**, trovate con lo stesso criterio richiesto (stessa correzione vista
da due linee diverse). **Undici hanno peso probatorio 1**, perché la seconda linea è H: in quei casi
la fusione non toglie solo un doppione, **alza la prova** — la stessa correzione passa da «un agente
l'ha riportata» a «c'è la sua frase».

---

## §9 — I due handoff da onorare (`01_INPUT_SINTESI.md` §9)

### §9.1 — La peer-review di C1 messa a confronto con la «cerimonia LOCKED» di C4

Sono due progetti legacy diversi, e affrontano lo **stesso** problema — *come si fa a non fidarsi del
«è fatto» di un agente* — con due soluzioni opposte. Il confronto è utile proprio perché una delle
due ha una crepa visibile.

**C1 — il controllo è delegato a un altro agente.** Tutte e sei le righe C1-A01…A06 sono peer review
agente↔agente, registrate come `A→M` `DEDOTTA`. Il report C1 dichiara nel proprio testo che le
registra così «*quando proteggono il gate umano*» e che «*non sono prove che Matteo fosse fuori
strada*».

| ID | Cosa dice |
|----|-----------|
| C1-A01 | peer A2→A5: **E2E falsi positivi**, quality gate fallito |
| C1-A02 | test che citano `testid` e CSRF **che non esistono** |
| C1-A03 | A0 taglia lo **scope creep** del piano di testing di A1 |
| C1-A04 | A7 **dichiara un deploy con l'app down** |
| C1-A05 | A7 ammette errori e poi dà comunque il GO al deploy (esito `parziale`) |
| C1-A06 | il piano di A1 manca dei dettagli backend reali |

I tre nomi che l'input §9 chiedeva di cercare ci sono tutti: **falsi positivi** (C1-A01), **scope
creep** (C1-A03), **deploy bugiardo** (C1-A04, C1-A05). E C1-A07 mostra la forma preventiva: una
policy con **tre domande obbligatorie prima di lavorare**.

**C4 — il controllo è la firma umana.** In C4 il sigillo è una parola: `Blindato da: Utente`.
C4-A02 sigilla il Test E, C4-A03 conferma il login E2E blindato. È lui a chiudere, e la chiusura è
un atto formale, verbalizzato in un README.

**La crepa, e sta scritta nel report C4 stesso, non l'ho aggiunta io:**

| ID | Cosa dice | Esito |
|----|-----------|-------|
| **C4-A10** | «Stessa parola **blindato**: nel Test A vale *AI*, nel Test E vale *Utente*» | `parziale` |
| **C4-A09** | L'agente espande la matrice da 7 a 16 e chiede conferma — **il gate «Conferma utente» nel documento non è chiuso** | `ignota` |

**La lettura, dichiarata come mia interpretazione e non come fatto:** la cerimonia LOCKED di C4 è più
debole della peer review di C1 non perché la firma umana valga meno, ma perché **la stessa etichetta è
stata usata per due livelli di garanzia diversi** senza che nessuno se ne accorgesse sul momento. Un
`Blindato` firmato da un'AI e un `Blindato` firmato da lui, nello stesso progetto, si leggono uguali.
E in C4-A09 la conferma richiesta non risulta mai data: il rito è stato invocato, non compiuto.

**Perché conta per il dossier.** La sua pratica di controllo, nel corpus, ha due forme: una che
**funziona per struttura** (un secondo agente che deve cercare i falsi positivi) e una che **funziona
per parola data** (un'etichetta che dichiara che lui ha guardato). La prima resiste anche quando lui
non c'è; la seconda vale quanto la disciplina di chi la scrive. Il cluster S2-T07 (9 righe su tre
progetti legacy) mostra che il gate umano è la sua pratica costante; questo confronto mostra che
**nella forma «etichetta» quel gate era già scivolato una volta, e il report lo ha registrato invece
di nasconderlo.** Handoff a S3 (skill di collaudo) e a S5 (rischi).

### §9.2 — La domanda aperta di J1: perché Servizio-S4 non è mai arrivato su `main`?

La domanda dell'input: **scelta esplicita, o non gliel'ha mai chiesto nessuno?**

**Nel materiale c'è una risposta, ed è la prima.** Tre righe della Sezione 2 di J1 — la linea dei
fatti oggettivi, peso 2 — la compongono:

| ID | Direzione | Prova | Cosa | Fonte |
|----|-----------|-------|------|-------|
| **J1-A03** | **M→A** | **DIRETTA** | **«Gate PROD: S4 non autorizzato (report) = migrazioni 063–071 assenti su PROD»** | A10 § ultimo stato; MCP PROD si ferma a 062 |
| J1-A05 | M↔M | DIRETTA | `main` fermo al 23-06 mentre `env/test` ha **75 commit** non in `main` | `git rev-list main..env/test` = 75; agosto su `main` = 0 |
| J1-A01 | M↔M | DIRETTA | Il buco di luglio **non è una pausa**: zero commit su CB-v2, stava lavorando altrove | git luglio = 0; piano §2.2 |

**La ricostruzione, con la sua parte dimostrata e la sua parte non dimostrata.**

*Dimostrato:* il blocco **è un gate deliberato e verificabile sui fatti**. Non è una dimenticanza:
il report dichiara S4 «non autorizzato», e il database di produzione **conferma indipendentemente** la
dichiarazione — le migrazioni si fermano a 062, le 063–071 non ci sono. Parola e stato della macchina
coincidono. Questo è il tipo di prova più forte che il corpus produce, e per questo J1-A03 è
classificata `M→A` `DIRETTA`: è **lui** che non ha autorizzato.

*Non dimostrato, e non lo chiudo:* **perché è rimasto fermo sei settimane.** Il gate spiega perché non
è passato il 24-06; non spiega perché nessuno l'ha riaperto a luglio. E J1-A01 dice che a luglio non
era in pausa: lavorava altrove. La lettura più economica è che **l'autorizzazione non è mai stata
richiesta di nuovo perché lui non era su questo progetto**, ma nel materiale non esiste una riga che
lo dica. Le due parti della domanda hanno risposte diverse: *scelta esplicita* per il blocco,
*nessuno l'ha più chiesto* per la durata.

**Il rischio che questo apre, ed è il vero motivo per cui l'handoff esisteva.** Ci sono **75 commit**
su `env/test` che non sono in `main`, fermi dal 23-06. Un gate che funziona ha un costo: se non viene
riaperto, il ramo di lavoro e il ramo pubblicato divergono, e la divergenza cresce da sola. Non è un
errore di J1 e non è una correzione mancata: **è un debito aperto**, gemello di S2-F24 (il deploy
delle edge function inseguito per tre sessioni). Handoff a **S5** come rischio operativo, non a S4
come conflitto.

> **Un dettaglio adiacente, da non mescolare.** J1-A07 registra che **l'autore del commit non è
> l'autore del codice** (con l'eccezione dichiarata di Cristiano). È il conflitto **I-8** di S1 e resta
> aperto: **non usare il conteggio dei commit come misura del suo lavoro**, né qui né altrove.

---

## §10 — Copertura dichiarata

**Copertura di S2 sul proprio ingresso: 39 report su 39, 606 righe su 606, 100%.** Nessun lotto è
stato rifatto: tutti e quattro sono tornati al primo passaggio.

### §10.1 — Le tre unità, che non si sommano (regola comune 5)

**Non esiste un totale unico.** File, messaggi e fatti si misurano in unità diverse: sommarli produce
un numero che non significa niente.

| Unità | Linee | Perimetro (da P0/S1) | Righe di agency in ingresso | Dopo dedup |
|-------|-------|----------------------|------------------------------|------------|
| **File `.md`** | A, B, C, D, E, F, G, I, M | 1.867 file aperti | **504** | **477** |
| **Messaggi** | H | 3.321 messaggi M-VOCE dichiarati letti (su 3.412 censiti da P0-EX) | **88** | **87** |
| **Fatti** | J | 1.074 commit · 72 migrazioni · 32 release · 2 database | **7** | **7** |

**Righe per famiglia dopo la deduplica:** A 216 · B–F 130 · H 87 · M 69 · G 41 · I 21 · J 7.

**Le 28 righe assorbite si distribuiscono così:** 27 sull'unità file, 1 sui messaggi, 0 sui fatti.
Undici delle 24 fusioni sono **cross-unità** (un file e un messaggio che raccontano la stessa
correzione): sono quelle in cui la riga tenuta è quella di peso 1.

**La discrepanza sui messaggi resta aperta e non l'ho arrotondata.** P0-EX censisce 3.412 messaggi di
sua voce; la somma di quelli dichiarati letti da H1–H5 fa 3.321. Sono 91 messaggi di differenza su una
fonte di **peso 1**. Non è un problema di S2 — l'ingresso di S2 sono i report, non i messaggi — ma
chiunque userà il numero «88 righe di agency su H» deve sapere che poggia su una base che non è
riconciliata. Handoff a **S6** (è già nel prompt S6 del tracking).

### §10.2 — I limiti di questa ondata, dichiarati

| Limite | Effetto concreto |
|--------|------------------|
| **Testo degli agenti oscurato** (19.198 righe su 22.862) | le A→M sono un limite inferiore. Vedi §0: sulla linea H sono **zero** le `DIRETTA` |
| **Nessuna colonna `Data` in Sezione 2** | il §7 datazione **per finestra d'ondata**, non per evento. Solo 13 righe su 606 hanno una data nel campo `Fonte` |
| **M, B–F, G, I, J non databili** | restano **fuori** dalla serie temporale, non dentro con etichetta «ignoto» |
| **`Cosa` è un campo da ~20 parole** | la classificazione materia/natura si basa su una sintesi dell'agente di mining, non sul testo originale |
| **Nessun campo «perché»** in `M↔M` | 32 righe su 61 restano `INCERTO`: il motivo esiste solo se l'agente di mining l'ha infilato in `Cosa` |
| **`Esito` è auto-dichiarato** | «364 accettate su 381» è scritto da chi doveva adeguarsi. Va letto come coerenza interna dei report, non come misura indipendente |
| **Corpora non riaperti** (da mandato) | dove il report non dice, S2 apre una lacuna e non indaga |

---

## §11 — Lacune e handoff

### §11.1 — Lacune aperte da S2

| # | Lacuna | Perché non si chiude qui | A chi va |
|---|--------|--------------------------|----------|
| L-S2-1 | **32 righe M↔M senza motivo citato** | lo schema §3.1 non ha un campo «perché»; chiuderle richiede di riaprire i corpora | **S4** |
| L-S2-2 | **17 righe A→M con esito `ignota`** (7 DIR + 10 DED) | il report registra la correzione ma non come è finita | S4 |
| L-S2-3 | **Il ribaltamento di agosto (A11)**: 8 A→M `DIRETTA`, M→A al 45% | due letture entrambe con fonti, nessuna dimostrata (§7.1) | **S3 + S4** |
| L-S2-4 | **La cifra «16 esiti fuori vocabolario» dell'input non è riproducibile** (io ne trovo 13, o 17 con le sentinelle) | divergenza di conteggio da dichiarare, non da sanare | S6 (metodo) |
| L-S2-5 | **91 messaggi di differenza fra P0-EX e la somma H1–H5** | fuori dall'ingresso di S2 | **S6** |
| L-S2-6 | **75 commit su `env/test` non in `main`** dal 23-06 | è un fatto, non una correzione: nessuno l'ha ancora trattato come rischio | **S5** |
| L-S2-7 | **`Esito` auto-dichiarato al 95,5% di accettazione** | serve una contro-evidenza indipendente, che S2 non ha per mandato | **S4** |

### §11.2 — Conflitti ereditati e NON chiusi qui (come da mandato)

| Conflitto | Dove | Cosa fa S2 |
|-----------|------|-----------|
| **T01 / N-5** — limite coperti giornaliero: cambio di modello o errore? | S1 §3 | resta `INCERTO`. §6.1 riporta le quattro righe e **aggiunge** la frase adiacente M3-A02 («avevo deciso male») **senza** usarla per chiudere |
| **N-3** — mandato «educare Matteo»: A4 dice APPROVATA, M1 dice ORIGINATA | S1 §3 | la fusione **S2-F22** lo eredita e lo dichiara: fondere le due righe **non** scioglie la divergenza di attribuzione |
| **N-2** — listino Pro 79→69 fotografato solo nello stato finale | S1 §3 | A7-A09 lo conferma come `M↔M` SCOPERTA e lo lascia aperto |
| **I-8** — «autore git = suo lavoro» non dimostrato | S1 §3 | **rinforzato per via indipendente**: solo 3 M→A su 381 sono su CODICE (§3.1) e J1-A07 lo registra come regola |

### §11.3 — Handoff attivi verso le ondate successive

| A | Cosa consegno |
|---|---------------|
| **S3** (albero delle skill) | **CODICE: 3 righe su 381** — il freno più forte contro la skill «scrittura di codice» · la conversione `rifiutata → hook/gate/freno` come prova del salto L3→L4 (§5) · il ribaltamento H vs M sulla materia UI (§3.2) · lo spostamento di materia da METODO (maggio) ad AMBIENTI/PRODOTTO/TESTING (giugno), che è la freccia temporale più solida (§7.1) |
| **S4** (falsificazione) | le 7 lacune del §11.1 · il caso T01 con la frase adiacente M3-A02 (§6.1) · le 13 A→M `rifiutata` di M1 che non sono A→M (§0.1) · le 6 righe di C1 che il report stesso dichiara non essere prove su Matteo · il debito S2-F24 inseguito per tre sessioni |
| **S5** (ritratto e rischi) | il cluster S2-T02 «annulla», 15 righe di peso 1, la forma osservata della sua agency (§3.2) · i 75 commit fermi su `env/test` come rischio operativo (§9.2) · la crepa della parola `Blindato` usata per due livelli di garanzia (§9.1) |
| **S6** (dossier finale) | **l'avvertenza del §0 va accanto al numero, non in nota** · usare **571** come numero deduplicato e **606** solo etichettato «pre-dedup» · le tre unità separate del §10.1 · la discrepanza dei 91 messaggi |

---

## §12 — Tre righe per Matteo

**1. Quando guardi lo schermo e dici «no, così è sbagliato», hai ragione praticamente sempre — e
quello che correggi non è quasi mai il codice: è cosa deve fare l'app.** Nelle chat le tue correzioni
riguardano soprattutto la pagina che vede il cliente e il menu digitale — il testo di una fascia
orario che deve essere leggibile, la foto del piatto che non deve comparire sul telefono, il no-show
che va contato dall'ora in cui il cliente doveva arrivare e non da quella in cui il tavolo si libera.
Su come è scritto il codice dentro, in sei mesi, sei intervenuto tre volte in tutto.

**2. La cosa che ti distingue davvero non è accorgerti dell'errore: è che dopo lo blocchi.** Quando un
agente ha fatto una cosa che non gli avevi chiesto — ha pubblicato senza permesso, ha lavorato sulla
zona sbagliata, ha allargato il lavoro da solo — nella maggioranza dei casi non ti sei limitato a
dirgli di rifarlo: hai messo un blocco che gli impedisce di rifarlo la volta dopo. È lo stesso
meccanismo che oggi ferma la pubblicazione sul sito vero se non hai dato l'ok tu, e i fatti confermano
che ha funzionato: il capitolo del servizio ai tavoli è ancora fermo, in attesa del tuo via libera,
esattamente come avevi deciso a fine giugno.

**3. Un numero di questo dossier va letto al contrario di come sembra, e una cosa è rimasta in
sospeso.** Sembra che tu correggessi gli agenti quattro volte più di quanto loro correggessero te: non
è vero, è che nelle chat salvate le tue frasi si leggono e le loro sono cancellate. E c'è un lavoro in
attesa: il ramo su cui gli agenti lavorano è avanti di 75 modifiche rispetto a quello pubblicato, ferme
dal 23 giugno. Non è un errore di nessuno — è il tuo cancello che ha funzionato e che nessuno ti ha
più chiesto di aprire.

---

## §13 — Criterio di accettazione (piano §6)

| Criterio | Esito |
|----------|-------|
| I totali per lotto sommano a **606** | ✅ L1 72 · L2 235 · L3 138 · L4 161 |
| Le 3 righe `A→A` sono escluse **e dichiarate** | ✅ §2.1 — C4-A11, I1-A13, M3-A12; incoerenza I1/M3 sciolta con scelta dichiarata |
| `DIRETTA` e `DEDOTTA` restano separate **ovunque** | ✅ §4, §6, §8 — nessun totale unico A→M in tutto il report |
| Il limite del materiale oscurato è **in testa**, non in nota | ✅ §0, prima di qualsiasi numero |
| Lo scarto di M1 (42 dichiarate, 38 reali) è **registrato** | ✅ §2.2 — con anche M→A 26 dichiarate vs 22 reali |
| `_stato/S2.md` contiene righe in ingresso e dopo dedup | ✅ 606 grezze · 599 di agency · **571** dopo dedup |
| Report d'origine **non** corretti | ✅ nessuna modifica: M1, E2, I1 registrati |
| Conflitti aperti da S1 **non** chiusi | ✅ §11.2 — T01/N-5, N-3, N-2, I-8 restano a S4 |
| Nessuna agency inventata per far quadrare un totale | ✅ ogni scostamento dall'input è spiegato da una scelta dichiarata |

**Files prodotti:** `report/S2_AGENCY_E_CORREZIONI.md` · `_stato/S2.md`.
**Intermedi rilanciabili:** `docs/_lavoro/Indagine-Corpus/S2/` (fuori git).
**File non toccati, come da mandato:** `00_PROMPTS_SEQUENZA_TRACKING.md`, i 39 report di mining,
qualunque file di `src/`.
