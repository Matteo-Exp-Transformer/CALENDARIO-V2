# S6b — Banca domande per l'interrogazione senior (punto 8)

**Stato:** ✅ CHIUSA · **Data:** 07-08-26 · **Profilo:** Verifica | Meta (sola lettura sui report) · **Modalità:** deep
**File prodotto:** `docs/_lavoro/Per matteo/S6_BANCA_DOMANDE.md`

> ⚠️ **Regime della banca domande: PRIVATA.** Sta in `docs/_lavoro/`, **gitignored**
> (`git check-ignore -v` risponde `.gitignore:42` **su questo file specifico**, verificato). Questo
> file di `_stato/` invece **è tracciato**: solo numeri e path. **Nessuna citazione sensibile.**

**S6b è la seconda metà di S6** (spezzata per decisione di Matteo, 07-08-26) ed è **l'ULTIMA ondata
del cantiere**: dopo di essa c'è solo la chat di interrogazione, dove Matteo risponde a voce.
S6a ha scritto il dossier (punti 1–7 e 9); S6b scrive **il punto 8**.

**Precondizione (regola comune 1 + mandato):** verificata — `S6_DOSSIER_PROFILO_MATTEO.md` esiste
(**978 righe**) e **ha in fondo la sezione «CONSEGNA A S6b»**, che è la materia prima. Esistono anche
`report/S1…S5`, tutti e cinque. **Nessun ripiego sui 39 report di mining. Nessun corpus grezzo.
Nessun mining nuovo. Nessun file di `src/`.**

---

## Domande per gruppo

| Gruppo | Che cosa fa | N |
|--------|-------------|---|
| **A** — verificano una skill rivendicata | chiedono un episodio **datato**, la risposta si confronta con la fonte | **13** |
| **B** — le domande scomode | le 10 di S4 §10 **importate con gli ID originali** + 4 aggiunte | **14** |
| **C** — su ciò che i file non dicono | lacune, assenze verificate, conflitti mai chiusi | **11** |
| | **TOTALE** | **38** |
| *(riserva, marcate come minori)* | `R-01` cambio tema · `R-02` skill nascoste dalla regola sugli ibridi | *+2* |

⚠️ **38 contro il tetto di 35 indicato dal mandato: +3, dichiarato.** Non è gonfiaggio: il numero è
imposto dalla copertura richiesta (10 importate + 9 conflitti + 4 lacune + le righe a fonte sola).
Per questo la banca ha in testa **l'elenco delle prime dieci** («se hai tempo per una sola sessione,
queste»): **6 dal gruppo B · 2 dal gruppo C · 2 dal gruppo A**.

## Importate contro nuove

| Origine | N | Dettaglio |
|---------|---|-----------|
| **Importate** da `S4 §10`, **con gli ID originali, non riscritte e non rinumerate** | **10** | `B-01…B-10` = S4 §10 #1…#10. Di queste, **5 erano già nuove di S4** e non si trovano altrove (#3, #5, #8, #9, #10) |
| **Scritte da zero da S6b** | **28** | A 13 · B 4 (`B-11…B-14`) · C 11 |

**Nei 39 report di mining non esiste una sola domanda pre-formulata per il senior** (verificato dal
tracking, ripreso dal dossier §8): le 28 nuove sono state costruite da contro-evidenze, righe
`aperto`/`INCERTO` e divergenze fra fonti di peso diverso.

## Conflitti e lacune coperti

**Conflitti aperti: 9 su 9.** Ognuno compare **almeno una volta** nella banca, **nessuno è stato
chiuso** (da mandato):

| Conflitto | Dove | Conflitto | Dove |
|-----------|------|-----------|------|
| `T01 / N-5` | **B-06** | `I-5` | **C-09** |
| `N-3` | **B-11** | `I-6` | **C-04** ⚠️ |
| `N-2` | **B-12** | `I-8` | **B-05** |
| `N-1` | **B-13** | `I-11` | **C-10** |
| `I-4` | **C-08** | | |

⚠️ **`I-6` è dichiarato NON QUANTIFICATO, non stimato a occhio.** Contare le occorrenze del registro
duro richiederebbe di riaprire la linea H, che è **mining**: C-04 dichiara la non-misura
(`L-S5-5` resta aperta) invece di sostituirla con un'impressione.

⚠️ **Due dei nove non sono chiudibili nemmeno dall'interrogazione:** `N-1` (serve il codice
dell'endpoint) e `I-11` (serve il registro migrazioni).

**Lacune `L-S5-1…5`: 5 su 5 collocate** — **4 come domande, 1 come nota metodologica**:

| ID | Collocazione |
|----|--------------|
| `L-S5-1` | **nota metodologica**, NON una domanda: già assorbita dal dossier §2.3 |
| `L-S5-2` | → **C-05** |
| `L-S5-3` | → **C-03** |
| `L-S5-4` | → **C-02** *(fra le prime dieci)* |
| `L-S5-5` / `I-6` | → **C-04**, con la non-quantificazione dichiarata |

**Altre lacune ereditate collocate:** `L-S2-1` → C-11 · `L-S3-5` → C-01 · `L-S3-6` → A-03 ·
`L-S4-1` → R-02 · `L-S4-3` → C-08 e C-09 · `L-S4-4` → A-08 · `L-S4-5` → R-01.
**Restano di metodo e NON diventano domande:** `L-S4-2` (si chiude solo rieseguendo i test) ·
`L-S6a-1` (si chiude solo rieseguendo `tools/estrai_prompt.py`).

**Lacune nuove aperte da S6b: ZERO.** L'ondata non produce dati nuovi: trasforma in domande materiale
già misurato.

## Fonti citate, con il peso

**Ogni domanda ha almeno una fonte con ID e peso dichiarati.** Distribuzione:

| Peso | Che cos'è | Domande che ne citano almeno una |
|------|-----------|----------------------------------|
| **1** | parole sue nei transcript (linea H) + `G1-D14` con la **deroga spaccata** (peso 1 per «cosa dice di sé», peso 4 per «cosa sa fare») | **21** — A: 8 · B: 4 · C: 9 |
| **2** | fatti git (linea J) | **3** — A-01 (`J1-D07/D08`) · B-05 (`J1 §5.b`, `J1-A07`, `J1-D12`) · B-08 (`J1-§4-1`, `J1-§4-4`) |
| **3** | report di agenti (linee M, A, B–F, G, I) | tutte le restanti |
| **4** | auto-valutazione di competenza | citato solo come **regime di lettura** in B-07, mai come prova |

**Fonti di peso 1 usate per nome:** `H1-D02` · `H1-D57` · `H1-A11/A12/A13` · `H1-A25` · `H1-§4-2` ·
`H1-§4-5` · `H2-D05` · `H2-D23` · `H2-A11/A12` · `H2-§4-2` · `H2 §4` (satellite) · `H3-D26` ·
`H3-D34…D36` · `H3-A04` · `H4-D06` · `H4-D38` · `H4-A04` · `H4-§4-2` · `H5-D34/D36/D37/D38/D40/D42` ·
`H5-§4-1` · `H5-§4-6` · `G1-D14` *(1\*)*.

⚠️ **Un solo dato è dichiarato FUORI perimetro** e marcato come tale nella banca (in B-03): lo stato
attuale della checklist di collaudo manuale. **Non ha un ID di questa indagine** e va verificato sul
file di collaudo, non ereditato dalla banca.

## Righe in ingresso, per fonte letta

| Fonte | Che cosa ne è entrato |
|-------|----------------------|
| `S6_DOSSIER_PROFILO_MATTEO.md` (S6a) | **978 righe, intero**, in due passate (cap di 25k token a riga 571) — inclusa la sezione finale «CONSEGNA A S6b», che è la precondizione bloccante |
| `S4_CONTRO_EVIDENZE.md` — **352** contro-evidenze → 153 verdetti | §0 · §4.1 · §4.2 · §5.1–§5.3 · §6.1–§6.2 · §7 · §8 · §9 · §10 · §11.1–§11.3 · §12 · §13 |
| `S5_RITRATTO_METODOLOGICO.md` — **2.473** righe → 7 assi | §3.5 · §3.6 · §3.7 (testa) · §4.1–§4.5 · §5(a–g) · §6 · §7 |
| `S3_ALBERO_SKILL_E_TIMELINE.md` — **477** skill signal → 153 L3/L4 | §4.1 (le 7 divergenze) · §8 · §9.1 (testa) |
| `S1_CATALOGO_DECISIONI.md` — **1.703** decisioni deduplicate | **§5 e §6 soltanto** — ⚠️ §7 **NON letto**: catalogo di 1.703 righe, si consulta per ID |
| `00_PROMPTS_SEQUENZA_TRACKING.md` | Regole comuni S (1–10) · blocco **S6** punto 8 · formato `_stato/` 8 righe · blocco **AGG** |

**Copertura sull'ingresso ordinato dal mandato: 100%.**

**Numeri ereditati e NON ri-derivati** (da mandato): 1.703 decisioni · 571 agency · 408 citazioni di
peso 1 · 31 L4 e 106 L3 · **477** skill signal (non 568) · 352 contro-evidenze · 82 su 153 prove
fragili (53,6%).

## Le tre unità di copertura (regola comune 5 — non si sommano)

| Unità | Linee | Perimetro | Stato in S6b |
|-------|-------|-----------|--------------|
| **FILE `.md`** | A · B · C · D · E · F · G · I · M | **1.867** aperti (100%) | ereditata, **non ri-derivata** |
| **MESSAGGI** | H | **4.157** estratti · **3.412** M-VOCE censiti · **3.321** dichiarati letti | ereditata · discrepanza dei 91 **già riconciliata da S6a** (91 = 21 + 70, zero non localizzati) |
| **FATTI** | J | **1.074** commit · **72** migrazioni · **32** release · **2** database | ereditata · **0 test rieseguiti** |

## Criterio di fatto (mandato S6b) — autocontrollo

| Criterio | Esito |
|----------|-------|
| Ogni domanda ha **ID, gruppo, fonte con ID e peso, risposta attesa dal corpus** | ✅ **38/38**, più il campo «se risponde diversamente» |
| Le **10 domande di S4 §10** importate **con gli ID originali**, non riscritte | ✅ `B-01…B-10` = S4 §10 #1…#10, nell'ordine originale |
| I **tre gruppi** esistono tutti e tre e **nessuno è vuoto** | ✅ A 13 · B 14 · C 11 |
| I **9 conflitti aperti** compaiono **almeno una volta ciascuno** | ✅ tabella qui sopra |
| Le **5 lacune `L-S5-1…5`** tutte collocate: 4 domande + `L-S5-1` nota metodologica | ✅ |
| **`I-6` dichiarato non quantificato**, non stimato a occhio | ✅ C-04, con il motivo (contarlo = mining) |
| Domande **in italiano parlato**, da dire a voce | ✅ ogni domanda è in blockquote, formulata come la direbbe una persona |
| **Nessuna domanda retorica o accusatoria**; ognuna rispondibile e con risposta attesa | ✅ |
| **Nessun conflitto chiuso** · **G1-D14 non risolta** · **nessun report d'origine corretto** | ✅ |
| **`00_PROMPTS_SEQUENZA_TRACKING.md` non toccato** (piano §6: lo allinea AGG) | ✅ |
| **Niente dedotto** sulla vita fuori dal lavoro | ✅ dichiarato in C-01 come vincolo esplicito |
| Le **tre sezioni fisse** di ogni report S (regola comune 10) | ✅ §CH-1 copertura · §CH-2 lacune e handoff · §CH-4 tre righe verso Matteo |
| **Capitolo mining dichiarato CHIUSO** + validazione = chat separata | ✅ §CH-3 |
| Elenco di **cosa resta APERTO** e non lo chiude nessun file | ✅ §CH-3: 9 conflitti · 4 lacune · 2 tensioni · **tutti i livelli PROVVISORI** |
| `_stato/S6.md` **consolidato** (formato 8 righe) che copre S6a + S6b | ✅ scritto, punta a **entrambi** i file |

## Output

- ✅ `docs/_lavoro/Per matteo/S6_BANCA_DOMANDE.md` (**fuori git**)
- ✅ `_stato/S6b.md` (questo file, **tracciato**, nessuna citazione sensibile)
- ✅ `_stato/S6.md` (**tracciato**, consolidato S6a+S6b, formato 8 righe — è quello che **AGG** usa
  per spuntare S6)
- ❌ Nessun altro file prodotto · ❌ `00_PROMPTS_SEQUENZA_TRACKING.md` non toccato
- ❌ Nessun conflitto chiuso · ❌ Nessun report d'origine corretto · ❌ Nessun corpus grezzo riaperto
- ❌ Nessun file di `src/` toccato · ❌ Nessun mining nuovo
