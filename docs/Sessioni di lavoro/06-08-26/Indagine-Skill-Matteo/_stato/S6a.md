# S6a — Dossier del profilo (punti 1–7 e 9)

**Stato:** ✅ CHIUSA · **Data:** 07-08-26 · **Profilo:** Verifica | Meta (sola lettura sui report) · **Modalità:** deep
**Dossier prodotto:** `docs/_lavoro/Per matteo/S6_DOSSIER_PROFILO_MATTEO.md` — **978 righe**

> ⚠️ **Regime del dossier: PRIVATO.** Il file sta in `docs/_lavoro/`, che è **gitignored**
> (`.gitignore:42`, verificato con `git check-ignore -v`). Questo file di `_stato/` invece **è
> tracciato**: qui ci sono solo numeri di copertura e il path. **Nessuna citazione sensibile.**

**S6 è un'ondata SPEZZATA** (decisione di Matteo, 07-08-26): S6a scrive il dossier (punti **1–7 e 9**),
**S6b** scrive la banca domande (punto **8**) in una chat separata, leggendo il dossier.
Al posto del punto 8 il dossier ha un **segnaposto** e, sotto, la materia prima consegnata.
**Nessun abbozzo di banca domande è stato scritto.**

**Precondizione (regola comune 1):** verificata — **S1, S2, S3, S4 e S5 esistono tutti e cinque**,
chiusi il 07-08-26. Nessun ripiego sui 39 report grezzi di mining. Nessun corpus grezzo riaperto.
Nessun file di `src/` toccato. Nessun mining nuovo.

---

## Righe in ingresso, per report letto

| Report | Righe in ingresso dichiarate | Uscita del report | Letto |
|--------|------------------------------|-------------------|-------|
| **S1** — catalogo decisioni | **1.703** decisioni **deduplicate** (da **1.826 pre-dedup**, 109 fusioni) | 30 decisioni significative · 44 rifiuti · 18 conflitti | §5, §6, §8, §9 — ⚠️ **§7 NON letto** (1.703 righe, si consulta per ID) |
| **S2** — agency e correzioni | **571** righe di agency **deduplicate** (da **606 pre-dedup**, di cui 599 di agency vera, 24 fusioni) | quote `M→A`/`A→M`/`M↔M` · cluster T01–T0n · esiti | §0, §3.2, §7.2, §9.1, §9.2, §11 |
| **S3** — albero skill e timeline | **477** righe di skill signal (**non** 568 — `L-S3-1`) | 11 rami · 40 L4 · 113 L3 · 7 divergenze | §4.1, §5.2, §8, §9, §11 |
| **S4** — contro-evidenze | **352** contro-evidenze | **153 verdetti** (125 REGGE · 19 RIDIM · 9 NON REGGE) · 28 righe che si spostano | §0, §5, §6, §8, §10, §11, §13 |
| **S5** — ritratto metodologico | **2.473** righe (1.166 di **peso 1**, 1.307 di **peso 3**) | 7 assi · 144 citazioni · 5 lacune | **intero** (807 righe, in due passate: cap di 25k token a riga 664) |

**Letti in più, come da ordine del mandato:** `PIANO_INDAGINE.md` (§0, §1, §2.1, §2.2, §3.2) ·
`01_INPUT_SINTESI.md` (§1, §8) · `00_PROMPTS_SEQUENZA_TRACKING.md` (regole comuni S + blocco S6) ·
`report/P0_INVENTARIO_CORPUS.md` (§7, §10) · `report/P0EX_CORPUS_PAROLE_MATTEO.md` (§1, §3).

⚠️ Il secondo si chiama **`P0EX_`, senza trattino**: un `grep` su «P0-EX» non lo trova.
⚠️ **Copertura sull'ingresso: 5 report S su 5 = 100%**, più i 5 file di metodo qui sopra.

---

## Le tre unità di copertura (non si sommano — regola comune 5)

| Unità | Linee | Perimetro | Stato in S6a |
|-------|-------|-----------|--------------|
| **FILE `.md`** | A · B · C · D · E · F · G · I · M | **1.867 file** aperti (100%), profondità variabile per regime (`scavo` vs `rastrello`) | ereditata dai report, **non ri-derivata** |
| **MESSAGGI** | H | **4.157** estratti · **3.412** M-VOCE censiti da P0-EX · **3.321** M-VOCE dichiarati letti da H1–H5 | ⚠️ **discrepanza dei 91 RICONCILIATA** — vedi sotto |
| **FATTI** | J | **1.074** commit · **72** migrazioni · **32** release · **2** database | 100% delle unità · **0 test rieseguiti** |

**I tre numeri non vanno sommati in una frase.** Un file, un messaggio e un commit non sono la stessa
unità: qualunque totale unico è un numero falso.

### La discrepanza dei 91 messaggi: chiusa in localizzazione, aperta in causa

Aperta da S1, ereditata non chiusa da S2, S3 e S4, dichiarata «di S6» da S5. Riconciliata **con soli
dati di report**, senza riaprire corpora:

| Verifica | Esito |
|----------|-------|
| Somma dei messaggi di perimetro delle cinque H (634+1.449+871+970+233) | **4.157** = i 4.157 di P0-EX → ✅ **le finestre H non saltano nulla** |
| Somma delle **classi** di P0-EX §3 (M-VOCE 3.412 · M-REGIA 125 · M-PASTE 596 · M-OK 124) | **4.257** contro il proprio totale dichiarato di 4.157 → ⚠️ **eccedenza interna di 100** (M-VOCE +70 · M-PASTE +28 · M-OK +2) |
| Somma delle stesse classi ricontata sulle cinque H | **4.157** ✅ |
| Perimetro CB-v2, P0-EX vs H | **2.544 = 2.544** ✅ al singolo messaggio |

**91 = 21 + 70.** I 21 sono già spiegati dalle fonti (perimetro vs leggibile, dichiarato da H2 e H3);
i 70 stanno **tutti** nella tabella delle classi di P0-EX, e **fuori dal perimetro CB-v2** (H4/H5).
**Zero messaggi non localizzati.** La **causa** dell'eccedenza di 100 non è accertabile dai report
(richiede di rieseguire `tools/estrai_prompt.py`) → **lacuna nuova `L-S6a-1`**, aperta e passata.

---

## Che cosa contiene il dossier, contato

| Voce | N | Dove |
|------|---|------|
| **Decisioni citate**, ognuna con **almeno una fonte con ID** | **20** | §5 — distribuite su **tutti e 11 i rami** |
| **Skill L4 superstiti dopo S4**, nominate **una per una** | **31** | §4.3 (da 40 di S3 meno le 9 cadute in S4) |
| **Skill L3 dopo S4**, aggregate per ramo | **106** | §4.2 (S3 ne dichiarava 113) |
| **Rami dell'albero** | **11** | §4.2 — ⚠️ il mandato ne diceva 10: **R11 SCRITTURA DI CODICE** esiste e le 20 decisioni lo coprono |
| **Conflitti aperti, passati a S6b** | **9** | §10 |
| **Rischi operativi** | **5** | §11 |
| **Lacune ereditate ancora aperte** + **1 nuova** | 14 + **`L-S6a-1`** | §13.2, §13.1 |

**Verifiche aritmetiche fatte prima di scrivere:**
✅ **31 L4 per ramo** (R01 9 · R03 3 · R04 5 · R05 8 · R06 1 · R07 2 · R08 2 · R11 1 = 31) e **per
etichetta** (29 persona + 2 sistema = 31, con 2 righe di B1 promosse sistema→persona).
⚠️ **Scarto di 1 riga registrato e non sanato** (regola comune 3): i volumi per ramo di S3 sommano a
**476** contro le **477** righe di skill signal dichiarate.

**Dichiarato, non stimato:** S4 **non pubblica** né la ripartizione per ramo delle 82 prove fragili
(sta in `prove_fragili.txt`, fuori git e fuori dai report) né un ricalcolo delle L3 per ramo dopo i
verdetti. Perciò il **53,6% su fonte sola (82/153)** è dichiarato **su ogni riga di ramo**, e la
distribuzione per ramo resta **quella di S3 (113)** con l'aggregato dopo S4 (**106**) dato solo come
aggregato.

---

## Sezioni del tracking: coperte e lasciate

| Punto S6 | Titolo | Chi |
|----------|--------|-----|
| 1 | Prompt iniziale verbatim | ✅ **S6a** — §1 |
| 2 | Metodo e limiti | ✅ **S6a** — §2 (con §2.3 `L-S5-1`/`L-S5-2` e §2.4 il precedente del censimento S5) |
| 3 | Mappa dei corpora, numeri finali | ✅ **S6a** — §3 |
| 4 | Albero delle skill, livelli dopo S4 | ✅ **S6a** — §4 |
| 5 | Le decisioni rappresentative | ✅ **S6a** — §5 |
| 6 | Agency in numeri | ✅ **S6a** — §6 |
| 7 | Ritratto per citazioni | ✅ **S6a** — §7 (rimando a S5 + i tre spostamenti) |
| **8** | **Banca domande** | ⏳ **S6b** — nel dossier c'è **solo il segnaposto** + 7 blocchi di materia prima nella sezione «CONSEGNA A S6b» |
| 9 | Privato vs pubblico | ✅ **S6a** — §9 |

**Coperti: 1–7 e 9. Lasciato a S6b: il punto 8.**

---

## Conflitti passati, contati

**Nessun conflitto è stato chiuso** (da mandato). Ne restano **9**, tutti elencati aperti in §10 con
fonte e ID, e passati a S6b e all'interrogazione:

| # | ID | Origine |
|---|----|---------|
| 1 | **T01 / N-5** | S2 / S1 |
| 2 | **N-3** | S1 |
| 3 | **N-2** | S1 |
| 4 | **N-1** | S1 |
| 5 | **I-4** | S1 |
| 6 | **I-5** | S1 |
| 7 | **I-6** | S1 (mai quantificato — `L-S5-5`) |
| 8 | **I-8** | S1 |
| 9 | **I-11** | S1 |

**Non risolti anche:** `G1-D14` (da mandato) · il **ribaltamento di agosto** `L-S2-3 → L-S3-7 → S4
§11` (2 contro 2, stessa ondata, stesso peso: S4 dichiara che i report non possono rispondere).

---

## Materia prima consegnata a S6b

Sette blocchi, nella sezione «CONSEGNA A S6b» del dossier, **passati senza essere riscritti**:
le **10 domande scomode** di S4 §10 (5 nuove) · le **7 divergenze** di S3 §4.1 · i **44 rifiuti**
indicizzati di S1 §6 (M1 18 · B1 12 · A3 10 · B3 4) · le **5 lacune** `L-S5-1…5` · i **9 conflitti**
· l'**attribuzione impropria nelle due direzioni** (S4 §6: 12 meriti vs 8 errori) · le righe dove
**dichiarata / esercitata / parlata** divergono.

---

## Criterio di fatto (piano §6) — autocontrollo

| Criterio del mandato | Esito |
|----------------------|-------|
| Il prompt del §1 è **verbatim** e verificabile in `PIANO_INDAGINE.md` §0 | ✅ |
| §3 usa **numeri deduplicati**, con i pre-dedup **etichettati** come tali | ✅ 1.703 (da 1.826) · 571 (da 606) · 477 (non 568) |
| La discrepanza dei 91 **riconciliata o dichiarata con residuo** | ✅ riconciliata: 91 = 21 + 70, **zero non localizzati**; causa aperta come `L-S6a-1` |
| Le **tre unità di copertura** in tre righe separate, **nessun totale unico** | ✅ §3.1 e la tabella qui sopra |
| Ogni L3/L4 dichiara se poggia su **una fonte sola** | ✅ 53,6% dichiarato su ogni riga di ramo, con le righe che S4 nomina |
| Le **20 decisioni** hanno **almeno una fonte con ID** ciascuna | ✅ §5 |
| L'avvertenza sul **sotto-conteggio `A→M`** sta **in testa al §6, prima del primo numero** | ✅ |
| I **9 conflitti** elencati **aperti** e passati a S6b | ✅ §10 |
| Le avvertenze **(a)(b)(c)(d)** stanno in testa, **prima di qualunque numero** | ✅ §0 |
| **Nota di regime privato** in testa al dossier, una riga | ✅ intestazione |
| **Nessuna banca domande**, nemmeno in abbozzo | ✅ §8 è **solo segnaposto** |
| Il **buco estivo** non trattato come pausa | ✅ §2.5 — **cambio di progetto**, con date |
| **Nessuna narrazione di crescita** | ✅ quota di agency **piatta**, si sposta la materia (§6.3) |
| **Niente dedotto** sulla vita fuori dal lavoro | ✅ §0(d) lo vieta e spiega perché |
| **Nessun aggettivo** che non stia in una fonte | ✅ |
| Il capitolo mining **NON dichiarato chiuso** | ✅ dichiarato esplicitamente: **lo chiude S6b** |

---

## Output

- ✅ `docs/_lavoro/Per matteo/S6_DOSSIER_PROFILO_MATTEO.md` (**fuori git**, 978 righe)
- ✅ `_stato/S6a.md` (questo file, **tracciato**, nessuna citazione sensibile)
- ❌ Nessun altro file prodotto
- ❌ `00_PROMPTS_SEQUENZA_TRACKING.md` **non toccato** (piano §6) — **la riga S6 resta non spuntata
  finché S6b non chiude**; l'allineamento è dell'ondata **AGG**
- ❌ Nessun report d'origine corretto · ❌ Nessun conflitto chiuso · ❌ Nessun corpus grezzo riaperto
- ❌ Nessun file di `src/` toccato · ❌ Nessun mining nuovo
