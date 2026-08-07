# S3 — Albero skill, livelli e timeline

> **Profilo:** Verifica | Meta · **Modalità:** deep · **Data report:** 07-08-26
> **Ingresso:** le Sezioni 3 dei 39 report di mining — **477 righe** di skill signal, contate da me
> (il totale dichiarato di 568 non è riproducibile: vedi §1.3)
> **Uscita:** **11 rami**, **153 righe L3/L4 di persona**, **40 L4** di cui 21 prodotte da due sole ondate
> **Precondizione (regola comune 1):** verificata — `report/S1_CATALOGO_DECISIONI.md` e
> `report/S2_AGENCY_E_CORREZIONI.md` esistono entrambi (chiusi il 07-08-26). Nessun file grezzo dei
> corpora è stato riaperto.

---

## §0 — L'avvertenza che va letta prima di qualunque livello di questo albero

**I livelli di questo albero sono provvisori, e la prova che regge i più alti è in parte circolare.**

La scala L0–L4 del piano §3.4 mette in cima **L4 — ha codificato la regola**: la prova richiesta è
«decisione + il file di regola che ne è nato». Ma due ondate di mining — **M1** (Comunicazione-Skill,
skill-system v0, APP_CONTEXT) e **M4** (Legal, Marketing, UI, Prenota, Menu QR + file sciolti di
`docs/`) — hanno per perimetro **la documentazione di skill già scritta**. Lì, la prova che «è
diventata regola» **è il file stesso**. Il ragionamento si morde la coda: si legge un file di regola,
si conclude che esiste una regola, si assegna L4.

Non è un sospetto: è misurato. Su **40 righe L4 di persona** sopravvissute in tutto il corpus,
**21 vengono da M1 (13) e M4 (8): il 52,5%**. Le restanti 19 sono sparse su nove ondate.

| | L4 di persona | % |
|---|---|---|
| **M1 + M4** (leggono documentazione di skill) | **21** | **52,5%** |
| tutte le altre 37 ondate insieme | 19 | 47,5% |

**Cosa dimostra davvero un L4 di quel tipo: che il sistema ha una regola. Non che la persona ha una
competenza.** Sono due affermazioni diverse e il dossier finale non deve confonderle.

Per questo, in tutto il report, **ogni L4 porta un'etichetta**:

| Etichetta | Significato |
|-----------|-------------|
| **L4 di persona** | esiste una decisione sua, datata e attribuita, e da quella decisione è nato un file di regola. La catena persona → regola è visibile. |
| **L4 di sistema** | la regola esiste ed è scritta, ma chi l'ha originata non è dimostrabile da questo perimetro. La competenza dimostrata è del sistema, non necessariamente sua. |

M3 lo faceva già bene da solo («**L1–L2 su Matteo / L4 di sistema**»). Da qui in poi lo fanno tutti.

**Ultima cosa, prima dell'albero: questi livelli si confermano a voce.** Il piano §0b (decisione #4 di
Matteo) dice che il verdetto finale è «livello + contro-evidenze, ma i livelli restano provvisori: si
confermano nella chat di interrogazione senior finale». Qui restano **proposte con prova allegata**.
Chi legge non sta leggendo una pagella: sta leggendo un'imputazione con le carte in mano.

---

## §1 — Cosa è entrato, e come si riconta

### §1.1 — La famiglia di header, dichiarata

**La Sezione 3 non ha un header canonico.** È l'unica delle tre sezioni estratte dalle ondate S a non
averlo: S1 poteva cercare `ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill`,
S2 poteva cercare `ID | Direzione | Tipo prova | Cosa | Esito | Fonte`. Qui non c'è niente da cercare
alla lettera. Riusare quegli script così com'erano avrebbe estratto **zero righe da tutti e 39 i
report**, senza nessun errore visibile.

Ho quindi riconosciuto una **famiglia**. Regola accettata, dichiarata:

> tabella dentro il blocco `## Sezione 3` … `## Sezione 4`, con **4 o 5 colonne**, dove
> **col1 ∈ {`Skill`, `Etichetta`}**, **col2 contiene «liv»**, **col3 contiene «prov» o «eviden»**.

Le **22 varianti** effettivamente incontrate, con le ondate che le usano:

| col1 | col3 (evidenza) | col4 | col. | Ondate |
|------|-----------------|------|------|--------|
| Etichetta | Prova | Contro-evidenza (sez.4) | **5** | M1 |
| Skill | Evidenza | Contro-evidenza (sez.4) | **5** | M4 |
| Etichetta | Prova breve | Contro-evidenza | 4 | A1 · A11 · B3 · D2 |
| Skill | Evidenza | Contro-evidenza cercata (obbligo L3/L4) | 4 | M3 |
| Skill | Evidenza | **Nota** | 4 | A2 · A4 · A5 · A6 · A7 · A8 · A9 · A10 |
| Skill | Evidenza | Nota / contro cercata | 4 | A3 |
| Skill | Evidenza (ID) | Contro-evidenza cercata | 4 | C1 · C3 · C4 · C5 · E2 · M2 |
| Skill | Prova | Contro-evidenza in §4 | 4 | H2 · H3 |
| Skill | Prova in B2 | Contro-evidenza cercata | 4 | B2 |
| Skill | Prova in C2 | **Nota** | 4 | C2 |
| Skill | Prova in D1 | **Nota** | 4 | D1 |
| Skill | Prova in F1 | **Nota** | 4 | F1 |
| Skill | Prova in G1 / G2 / G3 | Contro-evidenza cercata | 4 | G1 · G2 · G3 |
| Skill | Prova in H1 / H5 | Contro-evidenza cercata | 4 | H1 · H5 |
| Skill | Prova in H4 | Contro-evidenza §4 | 4 | H4 |
| Skill | Prova in questo perimetro | Contro-evidenza cercata | 4 | I1 · I2 |
| Skill | Prova in questo perimetro | Contro-evidenza (sez. 4) | 4 | J1 |
| Skill | Prove | **Note trasferimento vs ristoranti (CB)** | 4 | E1 |
| Skill | Prove in B1 | Contro cercata | 4 | B1 |

**Correzione a un dato dell'input.** `01_INPUT_SINTESI.md` §6 dice «`Skill` in 30 report, `Etichetta`
in 5, `Skill + Livello` in 4». Il mio riconteggio: **`Skill` in 34, `Etichetta` in 5** (M1, A1, A11,
B3, D2), totale 39. Nessun report usa `Skill + Livello` come intestazione della prima colonna. Confermato
invece che le colonne sono **5 in M1 e M4**, 4 negli altri 37.

**Dodici ondate non hanno una colonna di contro-evidenza**: la quarta colonna si chiama `Nota`
(A2, A4–A10, C2, D1, E1, F1). Questo ha una conseguenza diretta sulla regola dura §3.4 del piano, ed è
trattata nel §3.2.

### §1.2 — Un secondo modo in cui lo script di S1/S2 avrebbe fallito in silenzio

Gli ID in Sezione 3 sono citati in **forma breve**: `D45`, `A17`, `D01–D13`. Dentro un report il
prefisso d'ondata è implicito. Un estrattore che cerca `A4-D07` trova **zero ID in 24 report su 39** —
e non se ne accorge, perché la riga viene comunque estratta, solo senza prova.

L'estrattore accetta quindi tre forme, e le espande: **piena** (`A4-D07`), **breve** (`D07` → risolta
con l'ondata corrente), **intervalli** (`D01–D13`, `D01-D13`, `D01…D13` → espansi riga per riga).
Effetto misurato: le righe senza nessun ID passano da **224 a 44**.

### §1.3 — I conteggi per lotto: li stabilisce questa ondata, e il totale dichiarato non torna

A differenza di S1 e S2, per la Sezione 3 **non esistono conteggi per lotto pre-verificati**. Il
tracking dichiara «568 righe» e basta. Li ho stabiliti io:

| Lotto | Report | Righe di skill signal | Dettaglio per ondata |
|-------|--------|----------------------|----------------------|
| **L1** | M1–M4 | **59** | M1 23 · M2 8 · M3 12 · M4 16 |
| **L2** | A1–A11 | **163** | A1 18 · A2 20 · A3 15 · A4 16 · A5 12 · A6 17 · A7 11 · A8 15 · A9 11 · A10 14 · A11 14 |
| **L3** | B1–B3, C1–C5, D1–D2, E1–E2, F1 | **140** | B1 14 · B2 5 · B3 12 · C1 9 · C2 11 · C3 8 · C4 9 · C5 12 · D1 12 · D2 13 · E1 12 · E2 8 · F1 15 |
| **L4** | G1–G3, H1–H5, I1–I2, J1 | **115** | G1 12 · G2 10 · G3 8 · H1 16 · H2 12 · H3 12 · H4 10 · H5 11 · I1 8 · I2 9 · J1 7 |
| | **Totale** | **477** | |

**La divergenza, dichiarata e non aggiustata (regola comune 3).**

| Lettura | Righe | Scarto da 568 |
|---------|-------|---------------|
| Righe della **famiglia** Sezione 3 (skill signal veri) | **477** | **−91** |
| Righe della famiglia **+ tutte le tabelle satellite** dentro la Sezione 3 | **562** | **−6** |
| Totale dichiarato dal tracking e dall'input §1 | 568 | — |

Le due letture riconciliano al singolo fra loro: **477 + 85 satellite = 562**. Le 85 righe satellite
sono censite una per una nel §1.4. **Il numero 568 non è riproducibile in nessuna delle due letture**,
nemmeno contando le righe di intestazione. Non l'ho inseguito e non ho inventato righe per arrivarci:
chi eredita questi numeri usi **477** per gli skill signal, e sappia che il **568** dell'input non ha
una ricostruzione.

> **Un indizio su dove nasce lo scarto, e vale la pena registrarlo.** L'input dice «175 menzioni di L3
> e 81 di L4 su 568 righe». Sul mio dataset di **477** righe le menzioni sono **173 di L3 e 75 di L4**:
> quasi identiche, su un denominatore inferiore di 91. **I due conteggi hanno quindi guardato
> praticamente le stesse righe di skill signal, ma il denominatore 568 è stato ottenuto in un altro
> modo.** Non posso ricostruire quale, e non lo invento. Dopo le regole dure (§3) restano **113 L3 e
> 40 L4 di persona**.

### §1.4 — Le tabelle satellite dentro la Sezione 3: lette, non contate

**85 righe in 15 tabelle.** Non sono skill signal e non entrano in nessun conteggio di livello. Ma
quattro di esse sono materiale primario per questo report e sono usate più avanti:

| Ondata | Header della satellite | Righe | Dove la uso |
|--------|------------------------|-------|-------------|
| **B1** | `Elemento \| Direzione \| Nota` | 13 | §6 — freccia CB → v0 → BHM |
| **F1** | `Direzione \| Cosa \| Evidenza FREEDOM \| Ipotesi vs CB` | 14 | §6 — freccia CB → FREEDOM (COPIED / SIMPLIFIED / HEAVIER) |
| **C5** | `Lezione \| Regola scritta da \| File regola \| Sopravvive oggi?` | 7 | §7 — handoff «sopravvivenza delle lezioni legacy» |
| **D2** | `Dimensione \| D2 (CB-old feb→05-05) \| A1 (23→26-05 CB-v2)` | 7 | §5 — timeline, il salto CB-old → CB-v2 |
| **M3** | `Cluster decisioni \| Sessione A citata \| Cosa verificare in A*` | 11 | §7 — handoff G2/M3 |
| A2·A3·A4·A5·A6·A7·A8·A9·A10 | `Skill \| DICHIARATA \| ESERCITATA \| PARLATA (H*)` | 29 | §4 — **la tripla colonna abbozzata**, con PARLATA sempre placeholder |
| A3 | `Data \| Segnale \| Fonte` | 4 | §5 — timeline |

**Le 29 righe della tripla colonna abbozzata sono confermate come inutilizzabili così come stanno:**
in tutte e 29, la colonna PARLATA vale «da verificare in H2/H3» o «da verificare». Zero risolte. La
§4 la ricompila da zero.

---

## §2 — Lo scaffold dei rami: quello dell'input, più uno

Uso i **10 rami** di `01_INPUT_SINTESI.md` §6 — ricavati dai dati veri e non da una tassonomia a
priori. Il motivo per cui non li ho cambiati è misurato: la colonna `Skill` dei 39 report è
etichettatura libera, **1.313 etichette distinte su 1.826 decisioni, il 72% usate una volta sola**.
Senza scaffold il lavoro non è riproducibile da nessun altro.

**Aggiungo un undicesimo ramo: `SCRITTURA DI CODICE`.** Non è una mia scelta di tassonomia: è una
decisione di Matteo del 07-08-26. Il dossier deve **rispondere** alla domanda «ha imparato a scrivere
codice?», non ometterla né lasciarla implicita in una sezione «cosa non risulta». Il ramo è aperto,
ha un livello dichiarato e ha le sue prove — anche se il livello risulta basso (§5).

**Come sono state assegnate le righe ai rami.** Due strati di regole per parola chiave sull'etichetta
`skill`, più override firmati dove la parola chiave sbagliava. Lo strato 1 usa il lessico tecnico
inglese dei report; lo strato 2 aggiunge il lessico di metodo italiano e le sigle interne
(`annota`, `grilletti`, `blindatura`, `lock`, `ragioniamo`…). **Il secondo strato porta i «non
classificati» da 69 a 1**: è una riduzione **lessicale**, non semantica, e chi ricontrolla può
contestarla riga per riga.

| Come è stata assegnata la riga | N |
|--------------------------------|---|
| parola chiave sull'etichetta `skill` (strato 1) | 383 |
| lessico di metodo (strato 2) | **67** |
| override firmato dal senior | 17 |
| parola chiave sulla colonna evidenza (ultimo tentativo) | 9 |
| nessuna regola → non classificato | **1** |

Le regole e i 17 override stanno in `docs/_lavoro/Indagine-Corpus/S3/classifica.py`, per ID.

**Il residuo non classificato è 1 riga su 477**, e la lascio lì invece di forzarla:

| Ondata | Livello | Etichetta | Perché resta fuori |
|--------|---------|-----------|--------------------|
| F1 | L2 | `accept-demo-risk` | «a volte sceglie di vivere col gap per la demo». È una postura verso il rischio, non una materia: non entra in nessuno degli 11 rami senza deformarlo |

Restano fuori tassonomia anche i quattro casi che l'input segnalava come «da non forzare»
(`brand-theme`, `state-split`, `model-ladder`, `openrouter-testbed`): nel dataset reale nessuna riga
li usa come etichetta nuda, quindi la regola non ha dovuto scattare. **`dual-supabase` invece sì, ed
è stato riassegnato**: l'unica riga che lo porta (G3) si chiama `dual-supabase / env-safety` e appartiene
per contenuto alla sicurezza degli ambienti — escluderla per il nome sarebbe stato un falso negativo.

> **L'albero può risultare incoerente, e non è un difetto.** Il prompt iniziale di Matteo lo chiede
> esplicitamente: «*non è importante che siano coerenti, è importante capire che albero di skill ho
> coltivato*». Un ramo con volume alto e livello basso, o viceversa, resta com'è.

---

## §3 — Come è stato assegnato ogni livello

### §3.1 — Prima regola dura: nessun ibrido resta ibrido

I report usano largamente livelli non risolti: `L2–L3`, `L3→L4`, `L4 cand.`, `L4?`, `L3–L4*`. Il
mandato è netto: **valgono L2 finché il cross-check che rimandano non viene eseguito davvero**, e non
si ri-rimanda.

**Regola applicata, dichiarata:** un livello è ibrido se la cella contiene **più di un token L0–L4**
*oppure* se ne contiene uno solo ma **marcato come non risolto** (`?`, `*`, `cand.`). Un ibrido si
risolve al **minimo dei livelli dichiarati, mai sopra L2**. Il minimo serve a non fare il danno
opposto: `L1–L2` non deve essere *promosso* a L2 solo perché la regola dice «gli ibridi valgono L2».

**106 righe su 477 erano ibride. Zero lo sono ancora.** Le più pesanti, con l'effetto:

| Riga | Dichiarato | Risolto | Effetto |
|------|-----------|---------|---------|
| H1 · `skill-authoring` | `L4?` | **L2** | perde un L4 sulla fonte di peso 1 |
| H5 · `vocab-command (ragioniamo Liv 1)` | `L4?` | **L2** | idem |
| A11 · `test-strategy` | `L3–L4*` | **L2** | l'asterisco rimandava a un confronto mai fatto |
| A9 · `capacity-model / soft-defaults` | `L2–L3` | **L2** | è il limite coperti: coerente col conflitto T01/N-5 lasciato aperto |
| H2 · `prepara-prompt / multi-agent-roles` | `L2→L3` | **L2** | |

### §3.2 — Seconda regola dura: L3/L4 senza contro-evidenza cercata → L2

Il piano §3.4 lo impone: ogni L3/L4 deve avere in Sezione 4 **almeno una contro-evidenza cercata
attivamente**, oppure la dichiarazione esplicita «cercata, non trovata in questo perimetro».

Ma la verifica meccanica sbaglia in due direzioni opposte, e le ho corrette entrambe:

**Falso negativo.** Le 12 ondate senza colonna di contro-evidenza (§1.1) spesso la scrivono lo stesso,
**dentro la colonna `Nota`**. A6 è il caso didattico: «*Contro: 0 rompeva Salva Impostazioni*»,
«*Contro cercata in perimetro: non trovata rottura owner*». Declassare quelle righe d'ufficio sarebbe
stato sbagliato. **86 righe recuperate così.**

**Falso positivo.** Una dichiarazione collettiva del tipo «*ogni skill L3+ ha contro-evidenza cercata
in sez.4*» non è una prova: è un'affermazione **verificabile**. L'ho verificata.

**Il quadro finale della contro-evidenza sulle 477 righe:**

| Stato | N |
|-------|---|
| **CERCATA** — colonna dedicata, con testo | 280 |
| **CERCATA nella Nota** — colonna assente, contro scritta comunque | 86 |
| **COLONNA ASSENTE** e nessuna contro nella Nota | 80 |
| **VUOTA** — la colonna esiste ed è `—` | 31 |

**Le 21 righe L3/L4 rimaste scoperte, verificate una per una contro la Sezione 4 del loro report.**
Prima di declassare ho letto il testo dopo la tabella, come chiedeva il mandato.

| # | Ondata | Liv. | Skill | Cosa ho trovato in §4 | Esito |
|---|--------|------|-------|----------------------|-------|
| 1 | M1 | L3 | Copy verbatim / delta minimo | 23 item C01–C23, **nessuno** su copy/verbatim | **→ L2** |
| 2 | M1 | L4 | Privacy `docs/_lavoro` | nessun item. E il fatto la contraddice (vedi sotto) | **→ L2** |
| 3 | M3 | L3 | `edition-shell` Classic/Pro | 9 item, l'item 9 «cercata non trovata» riguarda **altro** | **→ L2** |
| 4 | M4 | L4 | prepara-prompt / comunicazione | 12 item, nessuno su prepara-prompt | **→ L2** |
| 5 | E1 | L4 | `command-lexicon` | 7 item + «cercata non trovata» sul no-buy/sell, non sul lessico | **→ L2** |
| 6 | H2 | L3 | `form-validation-ux` | CE1–CE8, nessuno sulla validazione dei form | **→ L2** |
| 7 | H3 | L3 | `edition-gating` | CE1–CE10, nessuno sull'edition gating | **→ L2** |
| 8 | M4 | L3 | cookie no-banner | item 12: «*cercata contro-evidenza su… no cookie banner: non trovata inversione*» | **confermata** |
| 9–15 | A2 | L3/L4 ×7 | scope-lock · summary-exceptions · ask-before-plan · meta-vs-exec · evoluzione-skills · report-unificato · qa-schermata | §4 di A2 ha 10 item che colpiscono ognuna delle sette (prezzo carosello → summary-exceptions; ask-mode «delude» → ask-before-plan; VOCABOLARIO ratificato dopo → evoluzione-skills; verifica soft → qa-schermata; skill close saltato → meta-vs-exec; report ≠ codice → report-unificato; over-agency → scope-lock) | **confermate** |
| 16–17 | A6 | L3 ×2 | visual-qa (DOM path) · anti-bureaucracy | §4 item 7 (script di verifica falso positivo, prevale il QA suo) e item 8 (FU-FASE-D «debito formale», contro di burocrazia) | **confermate** |
| 18–19 | B1 | L3 ×2 | human-verify · anti-bureaucracy | **B1-C10** + la chiusa «*Motivazione copertura contro: cercate attivamente su tutte le skill L3/L4*» | **confermate, con riserva** |
| 20 | F1 | L3 | admin-no-password-reset | §4 item 3: FU-032 annullato, la proposta console ribaltata | **confermata** |
| 21 | H1 | L3 | agent-review / prompt-orchestration | §4 item 6: alcuni M-VOCE lunghi sono paste e bottoni Cursor, non scrittura sua | **confermata** |

**Sette declassamenti applicati. Quattordici conferme.** Tre note che non vanno perse:

1. **L'input aveva ragione a segnalare B1, ma il posto era sbagliato.** Il suggerimento era «leggi il
   testo subito dopo la tabella». Là c'è una correzione di narrazione sulle frecce, non una
   dichiarazione di contro-evidenza. **La dichiarazione collettiva esiste, ma sta in coda alla Sezione
   4.** L'ho trovata e le due righe reggono. Con una riserva che vale più della conferma: **B1-C10 dice
   «*Nessuna M-VOCE nominale in B1 (solo «owner»). Attribuzione L3/L4 dipende da H5*»** — quindi quelle
   due L3 sono attribuite a un «owner», non a Matteo nominato. Restano L3 **con attribuzione debole**.
2. **Il caso «Privacy `docs/_lavoro`» merita di essere raccontato, non solo declassato.** M1 lo dichiara
   L4: la regola «il lavoro privato sta fuori da git» esiste ed è scritta. Ma il piano §2.1 punto 3
   registra che **77 file di `docs/_lavoro` sono già tracciati da git**, incluse `Documenti Legali/` e
   `Valutazione prezzo vendita/`. La regola c'è; nei fatti non ha tenuto. Non è «contro-evidenza non
   cercata»: è **contro-evidenza disponibile e contraria**. Consegnata a S4 come tale.
3. **La cifra dell'input («8–10 righe L3/L4 senza contro-evidenza») è confermata al singolo per le
   righe con colonna VUOTA**: sono esattamente le 10 che elencava (M1 ×2, M3, M4 ×2, H1, H2, H3, B1 ×2).
   Le altre 11 scoperte vengono dalle ondate senza colonna, che l'input non aveva censito.

### §3.3 — Terza regola dura: nessun livello senza ID

**44 righe su 477 (9,2%) non citano nessun ID** di decisione o di agency: la loro colonna evidenza
contiene una descrizione o una citazione, non un riferimento. Si concentrano in **A1 (18/18), B3
(12/12), G1 (3)** e casi isolati.

Non le ho buttate — sono segnale — ma **non possono reggere da sole il livello di una foglia**. La
regola applicata: *una foglia dell'albero ha un livello solo se almeno una delle righe che la
compongono porta un ID*. Nel §4 le due foglie che poggiano interamente su righe senza ID (A1
`menu-qr-nav`, A1 `public-booking-ux`) sono sostenute da altre righe con ID nello stesso ramo, e
questo è indicato.

**Nota su A1 e B3.** Il fatto che dichiarino zero ID **non è sciatteria**: entrambe scrivono l'evidenza
come frase («*Serie M→A UI Prenota accettate*», «*Correzione utente su testi azioni correttive*»). A1
si chiude anche con una riga esplicita: «**L4 pieno: nessuna dichiarata solo su questo perimetro senza
conferma M1/M4/H**». È disciplina, non lacuna.

### §3.4 — Il risultato: i livelli, dopo le tre regole

| Livello | Righe di **persona** | | Righe di **sistema** |
|---------|---------------------|---|---------------------|
| L0 — nominata | 22 | | 2 |
| L1 — eseguita con guida | 59 | | 11 |
| L2 — decisa da solo | **223** | | 4 |
| L3 — ha corretto l'agente | **113** | | 1 |
| L4 — ha codificato la regola | **40** | | 1 |
| livello assente nella fonte | 2 | | — |
| **Totale** | **459** | | **19** (una riga può avere entrambi) |

**Per lotto**, come chiede il criterio di fatto:

| Lotto | Righe | L0 | L1 | L2 | L3 | L4 | assente |
|-------|-------|----|----|----|----|----|---------|
| L1 (M1–M4) | 59 | 2 | 4 | 16 | 15 | **22** | 0 |
| L2 (A1–A11) | 163 | 1 | 12 | 86 | 53 | 10 | 0 |
| L3 (B–F) | 140 | 15 | 28 | 63 | 12 | 4 | 1 |
| L4 (G, H, I, J) | 115 | 4 | 15 | 58 | 33 | 4 | 1 |

**Il lotto L1 — quattro ondate su trentanove — produce 22 delle 40 L4.** È il §0 misurato una seconda
volta, per una via diversa.

**Le 19 righe di sistema stanno quasi tutte in C1–C5** (HACCP legacy): lì la regola esiste ma
l'attribuzione a Matteo non regge, e i report lo dicono da soli («*sistema agenti, non voce Owner*»).
Di queste 19 **una sola è L4**: M3 `env-safety`, scritta come «*L1–L2 su Matteo / L4 di sistema*» — è
il modello che il mandato indica da imitare, e l'unica riga di tutto il corpus che separava già i due
soggetti da sola. **Le altre etichette «di sistema» dell'albero sono giudizio mio e sono firmate come
tali** (§9.1).

> **Correzione a un dato dell'input.** L'input dice: «Sei report legacy (C1–C5, B2) dichiarano zero
> L3/L4 attribuibili a Matteo». **Cinque su sei lo confermano. C3 no:** dichiara `user-feedback-loop`
> (UX immediato) **L3**, con la motivazione «*M→A DIRETTA ripetute*» e contro-evidenza in §4
> (C3-D16…D22, C3-A01–A04). Non è una lacuna da riempire né un errore da correggere: è una riga che
> esiste e che l'input non aveva contata.

---

## §4 — L'albero

Ogni ramo porta: **volume**, **livello del ramo** (il massimo livello che sopravvive alle tre regole
dure, con l'etichetta persona/sistema), le **foglie** con i loro ID, e la **tripla colonna**.

**La tripla colonna, come l'ho compilata.**

| Colonna | Che cos'è | Da dove viene |
|---------|-----------|---------------|
| **DICHIARATA** | cosa dice lui di voler imparare / di saper fare | G1 (`Scuola/`, `PROFILO_SCOLASTICO`, `ROADMAP_SKILL`) + G3 (`Metodo_spiegazioni`) |
| **ESERCITATA** | cosa risulta che abbia fatto | A, B–F, I, J, M |
| **PARLATA** | cosa si vede nelle sue parole in chat | **H1–H5, ricompilata da zero con ID di H** |

**PARLATA non è ricopiata.** I 29 placeholder «da verificare in H3» delle satellite A2–A10 sono stati
ignorati, come da mandato. Ogni cella PARLATA qui sotto porta ID reali delle Sezioni 3 di H1–H5.

---

### R01 — Direzione di agenti AI / orchestrazione

**92 righe** · L0 4 · L1 11 · L2 40 · L3 18 · **L4 12** · sistema 6 · linee A B C D E F G H I J M
**Livello del ramo: L4 — misto.** È il ramo più esteso del corpus e l'unico presente in tutte e undici
le linee.

| Foglia | Liv. | Etichetta | Prova (ID) |
|--------|------|-----------|-----------|
| Vocabolario di comando come sistema governato | **L4** | **di persona** | A2-D18, A2-D29…D33, A2-D40 · M1-D01…D04 |
| Peso della sessione: light / standard / deep | **L4** | **di persona** | A2-D34, A2-D36 |
| Grilletti dei profili e livelli di libertà 1/2/3 | **L4** | **di persona** | A3-D20, A3-D21, A3-D40…D43 |
| Gate di disambiguazione d'area nel prompt | **L4** | **di persona** | A3-A12, A3-D09, A3-D25, A3-D27 |
| Separazione dei due segnali di chiusura | **L4** | **di persona** | A3-D40, A3-D41 |
| L'allineamento delle skill è implicito: non si chiede | **L4** | **di persona** | A4-D26 · M1-A19, M1-D49 |
| «Annota / suggerisci» ≠ codifica | **L4** | **di persona** | M1-A21, M1-D50 |
| Soft vs enforcement: un hook batte un markdown | **L4** | **di persona** | M1-D24, M1-D40…D44, M1-A13 |
| Scrivere una skill partendo da uno schermo | **L4** | **di persona** | H4-D06 (24-02-26) |
| Il ritmo di chiusura come disciplina | **L4** | **di persona** | H3-D08, H3-D09, H3-D13, H3-D52 |
| Portabilità dello skill-system a un altro progetto | **L4** | **di sistema** | B1-D20, B1-D31 — B1-C10: qui il soggetto è «owner», non Matteo nominato |
| Il template v.0 resta vivo e si sincronizza | L3 | di persona | M1-D52, M1-D69, M1-D76 |
| Esportare il metodo su progetti diversi | L3 | di persona | H5-D08…D11, H5-D15, H5-D18, H5-D23, H5-D35 |
| Tenere più progetti aperti insieme | L3 | di persona | H5-A08, H5-D01, H5-D34, H5-D40, H5-D41 |
| Guidare il piano prima che parta | L3 | di persona | H1-A18, H1-A19, H1-D10, H1-D17, H1-D47 |
| Revisione dell'agente e orchestrazione del prompt | L3 | di persona | H1-D49, H1-D50, H1-D52 |
| Distinguere risposte guidate da idee autonome | L3 | di persona | G1-A01, G1-D08 |
| Il mandato di autonomia, con le sue eccezioni | L3 | **di sistema** | B1-A06, B1-A07, B1-D45, B1-D53 |
| Chiudere il prompt su una decisione già presa (M-REGIA) | L3 | di persona | D2-A13, D2-A18, D2-D31 |

> **DICHIARATA:** fortissima. È il **focus primario che si è dato lui**: «*Focus primario richiesto:
> metodo di lavoro con AI*» (G1-D02), «*just-in-time — la lezione nasce dal problema reale*» (G1-D03).
> **ESERCITATA:** 92 righe su tutte le linee. **PARLATA:** presente e datata precocemente — H1-D43
> (chiede una skill guardando uno schermo), H4-D06 (24-02, scrive la regola dentro il file di skill),
> H3-D08/D13/D52 (il ritmo di chiusura), H5-D08…D23 (lo porta altrove).
> **Le tre colonne convergono.** È l'unico ramo dove succede in modo pieno.

---

### R02 — Product ownership & scope

**18 righe** · L2 8 · **L3 7** · sistema 3 · linee A B C D E F H I M
**Livello del ramo: L3 — di persona.** **Nessun L4.**

| Foglia | Liv. | Etichetta | Prova (ID) |
|--------|------|-----------|-----------|
| Controllo dello scope creep, anche sul proprio | **L3** | di persona | M1-A07, M1-D23 · A5-D06, A5-D13, A5-D23 |
| Rifiuto della burocrazia di processo | **L3** | di persona | A6-D38 · B1-D34 (attribuzione «owner») |
| Consegnare un modulo a un pari umano | **L3** | di persona | H4-A05, H4-D08, H4-D10 (Survivor → Tommaso) |
| Approvare e poi correggere invece di bloccare | **L3** | di persona | A2-A02, A2-D05 |
| Stabilità delle decisioni prese | L1 | **di sistema** | C5 — «regola scritta da Agente 1», non da lui |

> **Il ramo con il divario più netto fra volume e importanza.** 18 righe soltanto, eppure
> `product-scoping` è l'etichetta **più frequente dell'intero corpus decisionale** (59 occorrenze,
> input §6). Il motivo è strutturale: nella Sezione 3 il product scoping è quasi sempre **assorbito
> dentro altri rami**. Misurato: **13 righe che si chiamano letteralmente `product-scoping` sono finite
> in R05** (M4 L4 · A8, A9, A11, H2, I1 L3 · A1, A2, A3, A5, A10, B1, G2 L2), perché la loro colonna
> evidenza parla di rilascio, ambiente o perimetro pubblico, non di prodotto in astratto.
> **Il volume di questo ramo sottostima la competenza.** Dichiarato qui perché chi legge la tabella
> senza questa nota concluderebbe il contrario.
> **DICHIARATA:** media — G3-D08, «*è giusto per il ristoratore…? la decisione finale torna a me*».
> **ESERCITATA:** alta ma dispersa. **PARLATA:** H4-D08/D10, H2-D08…D10/D25/D41.

---

### R03 — Flusso utente e dati di prodotto

**51 righe** · L0 2 · L1 6 · L2 26 · L3 13 · **L4 4** · linee A B C D E G H M
**Livello del ramo: L4 — di persona.**

| Foglia | Liv. | Etichetta | Prova (ID) |
|--------|------|-----------|-----------|
| Tre zone «menu» distinte, e il routing che le separa | **L4** | **di persona** | M1-D17, M1-D27, M1-D28, M1-A08 · M4-D39, M4-D56 |
| Limiti duri di magazzino nati da un'intervista | **L4** | **di persona** | A6-D01…D07 → `ADMIN_MENU_MAGAZZINO_CONTEXT` §9 |
| Il limite coperti | **L4** | **di persona** | A6-D15…D20 — ⚠️ vedi sotto |
| Limiti morbidi: il software avvisa, non lega le mani | **L2** ⚠️ | di persona | M3-D08, D17, D19, D31, D32, D37 — dichiarata **`L4 cand.`**, portata a L2 dalla regola sugli ibridi (§3.1) |
| Turni append-only una volta serviti | L3 | di persona | M3-D39, M3-D41 |
| No-show contato dall'orario di inizio | L3 | di persona | A6-A09, A6-D32 · (fusione S2-F03, peso 1) |
| Fasce orarie e slot a cavallo della mezzanotte | L3 | di persona | H1-A21, H1-D23…D29, H1-D58 |
| Sala e tavolo nel walk-in | L3 | di persona | G2-A01, G2-A03, G2-D01, G2-D07 · A10-A02, A10-D58, A10-D69 |
| Provider email e email transazionali | L3 | di persona | H1-D46 · H3-D44…D46 |
| Lo snapshot del menu in prenotazione non si altera | L3 | di persona | A6-D04 |
| Guardia sul lavoro non salvato | L3 | di persona | A6-D30, A6-D31 |

> ⚠️ **Il paradosso di questo ramo, e va detto per intero.** La foglia **«limite coperti» è L4 piena**:
> A6 la dichiara così, senza asterischi, sulle decisioni dell'11-06. Ma l'11-06 nasce il limite
> giornaliero e **il 18-06 viene rimosso** (S1 cluster T01, conflitto N-5). S2 §6.1 lo lascia
> `INCERTO`: nessuna citazione dice che fosse un errore, nessuna dice che non lo fosse — e **non lo
> chiudo neanch'io.**
>
> **La regola che invece è sopravvissuta — i limiti morbidi per fascia, ribaditi il 02-08 — è
> dichiarata `L4 cand.`, quindi vale L2.** Il risultato è scomodo e lo lascio così: *la forma
> ribaltata dopo sette giorni ha un L4 pieno, la forma sopravvissuta per due mesi ha un L4 mai
> confermato.* Non è un errore di questo albero: è una **asimmetria nei report d'origine**, dove chi
> scriveva A6 (il giorno della decisione) era più sicuro di chi scriveva M3 (leggendo la skill dopo).
> Le tengo come **due foglie separate**: fonderle nasconderebbe il fatto. Bersaglio prioritario per S4.
>
> **DICHIARATA:** quasi assente — la Scuola non parla di regole di prenotazione. **ESERCITATA:** 51
> righe. **PARLATA:** forte e precoce (H1-D23…D29 sulle fasce, già a maggio).
> **Divergenza da marcare per l'interrogazione: DICHIARATA vuota, le altre due piene.**

---

### R04 — Qualità, testing e collaudo

**71 righe** · L0 4 · L1 8 · L2 33 · L3 17 · **L4 5** · sistema 4 · linee A B C D E F G H I M
**Livello del ramo: L4 — di persona.**

| Foglia | Liv. | Etichetta | Prova (ID) |
|--------|------|-----------|-----------|
| Controverifica: un secondo agente che cerca cosa rompe | **L4** | **di persona** | H4-D06 (**24-02-26**) → M1-D45, M1-A17 |
| I tre profili Esecuzione / Verifica / Meta | **L4** | **di persona** | M1-D05, M1-D06 |
| Blindatura come metodo A→D con controtest | **L4** | **di persona** | A6-D35, A6-D39 → `MANUALE_BLINDATURA.md` · M3 (`PLAN_BLINDATURA`) |
| La parola «blindatura» e la sua orchestrazione | **L4** | **di persona** | H3-D20, H3-D21, H3-D26, H3-D28, H3-D29 |
| Append-only / immutabilità dell'audit | **L4** | **di sistema** | B1-D01, B1-D07 — prodotto HACCP nativo, non regola sua |
| Il gate umano prima del verde dell'agente | L3 | di persona | H4-A03 · H2-D39, H2-D40, H2-D46 · H3-D47/D48/D54/D55 · G1-A03/A04, G1-D16, G1-D20 · **cluster S2-T07, 9 righe su tre progetti legacy** |
| Accettazione umana come atto formale | L3 | di persona | M3-D44 · G1-D17, G1-D18 |
| Filtro umano stretto invece di checklist lunga | L3 | di persona | M3-D42, M3-D45 (collaudo 62 → 16) |
| QA visivo con il percorso a schermo | L3 | di persona | A6-D10/D25/D34 · A4-A04/A14, A4-D12/D49 · A10-D01/D02/D22/D25 |
| Controverifica in parallelo su altri progetti | L3 | di persona | H5-D14, H5-D31, H5-D32 |
| Build verde ≠ funziona | L3 | **di sistema** | B1-D38 (attribuzione «owner», B1-C10) |
| Anti falso positivo per peer review | L1 | **di sistema** | C1 — «peer review agente↔agente, non prova su Matteo» |

> **La foglia più solida dell'intero albero, e anche la più antica.** `controverifica` non nasce in
> CalendarBackup: nasce il **24-02-26** su MathBoy2, e nasce già **come parola-comando e come regola
> scritta** — H4 cita la richiesta di «*aggiungere al file di skills di controverificare con screen*».
> È un L4 datato **due mesi prima che CB-v2 esistesse**.
> **DICHIARATA:** alta e verificabile — G1-D16 («*Sistema deciso il 19-06-26*» per la checklist dei
> flussi da testare a mano), G1-D17 («*Entra in archivio solo se… conferma esplicita di Matteo*»),
> G1-D20 (viewport 375 / 834 / 1280). **ESERCITATA:** 71 righe. **PARLATA:** H2-D39/D40/D46,
> H3-D47/D48, H4-A03, H5-D31/D32.
> **È l'unico ramo in cui tutte e tre le colonne sono piene e concordi, dal 24-02 al 06-08.**

---

### R05 — Sicurezza ambienti, dati e rilascio

**103 righe** · L0 4 · L1 15 · L2 47 · **L3 26** · **L4 9** · sistema 3 · linee A B C D E F G H I J M
**Livello del ramo: L4 — di persona.** È il **ramo più voluminoso** e l'unico che tocca anche la linea J
(fatti oggettivi).

| Foglia | Liv. | Etichetta | Prova (ID) |
|--------|------|-----------|-----------|
| Prima di scrivere, verifica l'ambiente; se è PROD, fermati | **L4** | **di persona** | M2-D07, M2-D09 · M1-D15, M1-D43 · origine in H2-D05 (peso 1) · S1 F001 (4 file di skill diversi) |
| «lavoro ok» ≠ «fai report finale» | **L4** | **di persona** | M1-D08, M1-D09, M1-A03 |
| Controtest / blindatura di prodotto prima del rilascio | **L4** | **di persona** | M1-D46, M1-D47, M1-A16 |
| Merge sulla repo pubblica solo se tocca `src/` | **L4** | **di persona** | A6-D36, A6-D37 → `EVOLUZIONE` §8 |
| Blindatura = intervista + Classic in produzione | **L4** | **di persona** | M4-D42…D44 |
| Il gate di rilascio: nessun merge senza la sua prova | L3 | di persona | H3-D21, H3-D38 · A11-D12, A11-D38, A11-D47 · **J1-D07, J1-D08 (peso 2)** · S1 cluster T11 |
| Migrazioni su TEST fino al rollout | L3 | di persona | I1-A03, I1-D01, I1-D04 · J1-D08 |
| Region di produzione e brand pubblico | L3 | di persona | M4-D07, M4-D11 |
| Verificare prima di eseguire, igiene dell'ambiente TEST | L3 | di persona | A8-D46, A8-D48 · A7-D47…D52, A7-D57…D59 |
| Prova manuale delle RLS | L3 | di persona | D2-A10, D2-A11, D2-D37, D2-D55 |
| Ruoli: lui il prodotto, l'agente la costruzione | L3 | di persona | G3-D02, G3-D08, G3-D13 |
| Onestà del rilascio («deploy dichiarato con l'app giù») | L0 | **di sistema** | C1 — episodio fra agenti, non suo |

> **DICHIARATA: quasi assente, ed è un risultato.** Nel materiale della Scuola **non esiste una riga in
> cui dica «voglio imparare la sicurezza degli ambienti»**. La ROADMAP_SKILL e il PROFILO parlano di
> metodo con l'AI, non di questo. L'input lo prevedeva e il dato lo conferma.
> **ESERCITATA: la più alta del corpus** (103 righe, 11 linee su 11).
> **PARLATA: fortissima e originaria** — H2-D05, H2-D07, H2-D36 (**la frase originale è sua**: «*Se
> risponde `rwuxgvld` fermati*»), H3-D21/D38, H4-D05/D39 (già su CB-old a febbraio).
> **Questa è la divergenza più grande dell'albero, e la domanda migliore per l'interrogazione: la
> competenza che esercita di più e su cui parla di più è quella che non ha mai dichiarato di voler
> imparare.**

---

### R06 — UX e interfaccia prodotto

**49 righe** · L1 5 · L2 21 · **L3 19** · L4 2 · sistema 2 · linee A B C D G H I J M
**Livello del ramo: L4 — di persona**, ma con un profilo anomalo: **19 L3 contro 2 sole L4**.

| Foglia | Liv. | Etichetta | Prova (ID) |
|--------|------|-----------|-----------|
| Mockup HTML multi-stato prima di scegliere | **L4** | **di persona** | M1-D32, M1-A22 · S1 F008 (peso 1) |
| Il layout pubblico di Prenota come regola scritta | **L4** | **di persona** | M4-D32, M4-D35, M4-D51 |
| Il modale è il pattern di conferma, non il toast | L3 | di persona | H2-D30…D33, H2-D42 · H3-D06, H3-D32 · S1 cluster T12 |
| Il layout desktop di Prenota | L3 | di persona | H3-A04, H3-D11, H3-D12 |
| Veto sull'interfaccia vista dal vivo | L3 | di persona | D2-A09, D2-D49 |
| Il mockup è la fonte di verità dell'interfaccia | L3 | **di sistema** | B1-A05, B1-D43, B1-D57 (attribuzione «owner») |
| Ritmo e gesti-firma dell'animazione | L3 | **di sistema** | B1-A01, B1-A02, B1-D24, B1-D25 |
| Il ciclo di feedback UX immediato | L3 | di persona | C3-A01…A04, C3-D16, C3-D22 — **l'unica L3 di persona in C1–C5** |
| Sfondo, accordion, palette, badge del calendario | L3 | di persona | A8-D30, A8-D49 · A6-D21/D22/D25/D29/D33 · A2-D60, A2-D65 |
| Navigazione del menu QR e UX della prenotazione pubblica | L3 | di persona | A1 (**righe senza ID**, sostenute da S1 F062 e F019, peso 1) |

> **La forma di questo ramo è il suo contenuto.** 19 L3 e 2 L4 significa: **corregge moltissimo,
> codifica pochissimo**. È la conferma indipendente del ribaltamento H vs M che S2 §3.2 aveva trovato
> sulle correzioni — nelle skill scritte l'UI vale 1 riga su 42, nelle sue parole in chat è la materia
> prima con 22 su 66.
> **DICHIARATA:** assente. **ESERCITATA:** 49 righe. **PARLATA:** la più densa di tutte — è il cluster
> S2-T02 «annulla», 15 righe tutte di peso 1, e le serie H1-A04 (il logo ritarato quattro volte:
> 1/3 → 1/5 → 1/12 → 1/15).
> **Seconda divergenza da marcare: quello che fa più spesso a schermo è quello che ha codificato meno.**

---

### R07 — Comunicazione e vocabolario di comando

**17 righe** · L0 3 · L2 7 · L3 3 · **L4 4** · linee A B C E G H M
**Livello del ramo: L4 — di persona.** Volume basso, densità di L4 altissima: **4 L4 su 17 righe, il 24%**
— la proporzione più alta di tutto l'albero.

| Foglia | Liv. | Etichetta | Prova (ID) |
|--------|------|-----------|-----------|
| Vocabolario governato con livelli di libertà 1/2/3 | **L4** | **di persona** | M1-D01…D04 · S1 cluster T03 (11 righe) |
| Parlare per schermate e per effetto, non per file | **L4** | **di persona** | M1-D30, M1-D57, M1-D58 · S1 F061 — **H1-D57 la data al 15-05, prima del report che la registra** |
| Lo schema di spiegazione: problema → componente → flussi → perché | **L4** | **di persona** | G3-D01…D07, G3-A01…A03 |
| Il lessico di dominio come oggetto da governare | **L4** | **di sistema** | B1-D23, B1-D33 (HACCP: 4 case + elementi) |
| Il linguaggio dell'utente come criterio, in chat | L3 | di persona | H3-D27, H3-D33, H3-D52 |
| Disciplina del copy: cambia solo le stringhe citate | L3 | di persona | B3 (righe senza ID) · M1-D35 (declassata, §3.2) |

> **DICHIARATA: la più forte di tutto l'albero, e in prima persona.** `Metodo_spiegazioni_agenti_coding.md`
> è scritto da lui: «*Quando mi spieghi una modifica o un fix, usa questo schema*» (G3-D01), «*usa
> un'immagine pratica o un esempio concreto*» (G3-D03), «*Non voglio una sezione rischi automatica ogni
> volta*» (G3-D05), «*non serve raccontarmeli ogni volta*» sui test (G3-D06), «*Non spiegarmi tutto in
> modo didattico di default*» (G3-D07), «*Io, Matteo, oriento il prodotto… L'agente costruisce*» (G3-D02).
> **ESERCITATA:** 17 righe, poche ma tutte alte. **PARLATA:** H3-D27/D33/D52, H5-D11.
> ⚠️ **Il peso di G3 resta 3, non 1.** Il testo dice «Io, Matteo» ma solo `PROFILO_SCOLASTICO` (G1) ha
> la deroga a peso 1 (piano §2). Non ho sovra-pesato questo asse, come chiedeva l'input.
> ⚠️ **Contro-evidenza dichiarata da G3 stesso:** `Metodo_spiegazioni` vive ancora in `_lavoro`, **non è
> stato fuso nella skill ufficiale di comunicazione** → «regola privata più che sistema globale».

---

### R08 — Compliance e legale

**29 righe** · L0 2 · L1 8 · L2 12 · L3 4 · **L4 3** · linee A B E F G H I M
**Livello del ramo: L4 — di persona**, con un limite dichiarato: le L4 vengono **tutte** da M4 e B1,
cioè dal materiale a circolarità più alta (§0).

| Foglia | Liv. | Etichetta | Prova (ID) |
|--------|------|-----------|-----------|
| Legale e vendita decisi insieme, con posizionamento | **L4** | **di persona** | M4-D01, M4-D18…D22 |
| I documenti legali stanno nella repo, non in un SaaS privacy | **L4** | **di persona** | M4-D12, M4-D13 |
| Lock di compliance: una sola fonte per i numeri | **L4** | **di sistema** | B1-D06, B1-D30 (BHM, attribuzione «owner») |
| Priorità GDPR | L3 | di persona | M4-A08, M4-D06 |
| Nessun banner cookie, con la motivazione | L3 | di persona | M4-D13 — contro-evidenza confermata (§3.2 riga 8) |
| Privacy dei dati CRM | L3 | di persona | A8-D14, A8-D19 |
| Il lavoro privato resta privato | L3 | di persona | A2-D63 — ⚠️ ma vedi §3.2 nota 2: **77 file tracciati da git** |

> **DICHIARATA: presente ma bassa** — G1 la mette a `L1` con «*esecuzione parziale L2 su DPA firmato*».
> **ESERCITATA: reale e verificabile** — il DPA Supabase è firmato e archiviato (S1 F014), la region di
> produzione è l'Irlanda (S1 F053). Due decisioni **eseguite**, non solo pianificate.
> **PARLATA: quasi assente.** L'input lo prevedeva; il dato lo conferma: nessuna riga di Sezione 3 di
> H1–H5 cade in questo ramo. **Colonna PARLATA legittimamente vuota — dichiarata, non riempita.**

---

### R09 — Vendita e posizionamento

**25 righe** · L0 2 · L1 3 · L2 17 · L3 3 · **L4 0** · linee A D E G H I M
**Livello del ramo: L3 — di persona. Nessun L4.**

| Foglia | Liv. | Etichetta | Prova (ID) |
|--------|------|-----------|-----------|
| Governance del capitolo Servizio come oggetto commerciale | L3 | di persona | M4-D48, M4-D50 |
| Il prezzo mostrato in tempo reale sulla card | L3 | di persona | A2-D07, A2-D08 |
| Go-to-market | L3 | di persona | A10-A11, A10-D66 |
| Listino, sconto lancio, zero commissioni a coperto | L2 | di persona | H3-D34…D36 (**SCELTA fra opzioni**, non originata) |

> **Perché non c'è nessun L4 in un ramo che ha prodotto un listino vero.** Le decisioni ci sono e sono
> forti (S1 Top 30 #27, #28, #29): modello ibrido edition + `tenant_features`, zero commissioni,
> listino del 12-06 rivisto in giornata. Ma in Sezione 3 il livello si ferma a L2–L3 perché la prova
> «è diventata regola riusata» manca: il listino è **uno stato fotografato**, non una regola che
> governa il lavoro. E S1 lo registra come conflitto **N-2**: la skill Marketing fotografa solo il
> prezzo finale (Pro 69), e letta da sola smentirebbe A7 e H3 che dicono 79.
> **DICHIARATA: debole** — G1 la mette a `L1–L2` con la contro-evidenza «*prezzi non approvati (AL-F);
> nessuna attività aperta*». **ESERCITATA: media.** **PARLATA: presente ma come scelta fra opzioni
> proposte** (H3-D34…D36), non come origine.
> **Terza divergenza da marcare: qui parla e decide, ma sceglie invece di originare.**

---

### R10 — Auto-formazione e metodo

**11 righe** · L0 1 · L2 5 · L3 3 · **L4 0** · sistema 1 · linee A C E G H M
**Livello del ramo: L3 — di persona. Nessun L4.** Il ramo che il prompt iniziale di Matteo chiede
esplicitamente, e quello con il volume più basso dell'albero.

| Foglia | Liv. | Etichetta | Prova (ID) |
|--------|------|-----------|-----------|
| La Scuola: sistema didattico e «Lezione della chat» | **L3** | di persona | G1-D07, G1-D09, G1-A01, G1-A02 |
| Educazione reciproca: chiede agli agenti di insegnargli | **L3** | di persona | M1-D39, M1-D62 — ⚠️ conflitto **N-3** aperto: A4 dice APPROVATA, M1 dice ORIGINATA |
| Riflessione sul proprio metodo, in chat | **L3** | di persona | H3-D58, H3-D59, H3-D60 (06-08, l'indagine stessa) |
| Da lezione a regola scritta in un file di skill | L0 | **di sistema** | C5 — nell'HACCP legacy la conversione era fatta dagli agenti |

**Il materiale della Scuola, per intero.** Decisione esplicita di Matteo del 07-08-26: «*non ho
segreti, tieni tutto, non perdiamo niente, voglio studiarmi a fondo*». Riporto tutte le decisioni
fondative del 04-06-26 con le citazioni testuali che i report hanno estratto:

| ID | Cosa | Citazione |
|----|------|-----------|
| G1-D01 | La Scuola nasce dalla chat senior | «*Origine: idea di Matteo, sessione senior 04-06-26*» |
| G1-D02 | Il focus che si dà | «*Focus primario richiesto: metodo di lavoro con AI*» |
| G1-D03 | Come vuole imparare | «*just-in-time — la lezione nasce dal problema reale*» |
| G1-D04 | Come separa il lavoro | «*Tre lavori separati, tre sessioni*» |
| G1-D05 | Il freno all'over-engineering | «*Parti micro, cresci sui dati*» |
| G1-D06 | La qualità del materiale | «*Materiale didattico REALE*» |
| G1-D07 | La forma della lezione | «*Richiesta esplicita di Matteo (04-06-26)*» — sezione «Lezione della chat» a 5 punti |
| G1-D08 | La distinzione che si impone | «*Distingui sempre due tipi (Matteo, 04-06-26)*»: risposte guidate (a) vs idee autonome (b) |
| G1-D09 | Il controllo su di sé | «*meccanismo del salto-lezione tracciato… nato da lui*» |
| G1-D10 | La privacy del materiale | «*Matteo ha scelto (04-06-26) di passare… a mano*» |
| G1-D12 | La scala che si dà | «*Sento → So spiegare → Lo uso → Lo insegno*» |
| G1-D14 | **Come si descrive** | «*principiante, nessuna competenza tecnica formale*» |
| G1-D15 | La fonte del materiale | «*materiale didattico reale e professionale, non inventato*» |

> **La tensione centrale del dossier, e sta tutta in questo ramo.** G1-D14 è **peso 1 per «cosa dice di
> sé»** (piano §2): è lui che parla. E dice **principiante, nessuna competenza tecnica formale**. Nello
> stesso perimetro privato ci sono collaudi multi-viewport, seed di database, SQL sull'edition, E2E in
> modalità headed e debug. G1 §4 lo verbalizza per primo: «*Dichiarato vs esercitato… tensione centrale
> per S3/S5 — non risolvere qui inventando un livello*». **Non lo risolvo neanch'io.** Le due colonne
> divergono, e questa è la prima domanda dell'interrogazione senior.
>
> **La contro-evidenza sul ramo, scritta da G1 stesso:** «*Sistema didattico progettato, poco agito:
> coda spaced-repetition vuota; Glossario tutto 🌱 in apprendimento; storico richiami vuoto; una sola
> «Lezione della chat» (04-06)*». Il sistema è stato **disegnato una volta e quasi mai usato**. Per
> questo il ramo si ferma a **L3 e non arriva a L4**: la regola esiste come progetto, non come pratica
> ripetuta. È il ramo dove DICHIARATA è massima ed ESERCITATA è minima — l'esatto opposto di R05.
>
> **PARLATA:** una sola riga, H3-D58…D60, ed è del 06-08-26: la richiesta di questa indagine.

---

### R11 — SCRITTURA DI CODICE

**10 righe** · L1 3 · L2 6 · **L4 1** · linee A B C E F G M
**Livello del ramo: L2 — di persona.** L'unico L4 è di natura diversa e va letto a parte (§5).

Ramo aperto su decisione di Matteo. **Tutte e dieci le righe, senza selezione:**

| Ondata | Liv. | Etichetta | Evidenza | Che cosa dice davvero |
|--------|------|-----------|----------|----------------------|
| M1 | **L4** | Context-knowledge: **il codice è la verità, i `.md` la specchiano** | M1-D61, M1-D66 | è una regola **sul rapporto** col codice, non una competenza di scrittura |
| A7 | L2 | `plan-then-code` | A7-D63 | prima il piano, poi il codice: direzione |
| F1 | L2 | `context-before-code` | F1-D15 | prima il contesto, poi il codice: direzione |
| C1 | L1 | `greenfield-brief` — **vietato leggere il codice esistente** | C1-D16 | direzione, e per giunta *contraria* alla lettura del codice |
| G2 | L2 | diagnosi sui dati **vs** diagnosi sul codice | G2-D48, G2-A18 | sceglie dove guardare, non scrive |
| B3 | L2 | `doc-vs-live`: codice + DB battono la documentazione | — | criterio di verità |
| A1 | L2 | `skill-architecture` | — | architettura delle **skill**, non del software |
| M3 | L2 | `edition-shell` Classic/Pro | M3-D02, M3-D05, M3-D16 | declassata da L3 (§3.2); è modello di prodotto |
| E1 | L1 | `user-pays-architecture` | E1-D22…D24 | **approvata e mai implementata** (E1-CE1) |
| C3 | L1 | `component-inventory` | C3-D29 | esplicitamente **«L1 agenti»** — non sua |

> **Il verdetto, con i numeri accanto.** Nessuna delle dieci righe è una prova che abbia scritto o
> progettato codice. Nove su dieci sono decisioni **su come si arriva al codice**: prima il piano,
> prima il contesto, non leggere il legacy, guarda i dati prima del codice, il codice batte la doc.
> L'unica L4 (`codice = verità`) è una **regola di metodo documentale**, non una competenza tecnica.
>
> **Il freno più forte non è in questo ramo: è in S2 §3.1.** Su **381 correzioni** che ha fatto agli
> agenti, quelle sulla materia CODICE sono **3, lo 0,8%**, e sono tutte identificate:
> - **H4-A04** (MathBoy2, 02-03-26): rifiuta un boss `IF-heavy` e chiede una classe `BossEnemy`. **È la
>   più tecnica delle tre, ed è di febbraio-marzo, su un videogioco — non su CalendarBackup.**
> - **G3-A05**: la regola sui nomi dei file nuovi (`al-ritrovo-*`).
> - **I1-A11**: il riuso di `validateSlotConfigs`, una funzione di validazione già esistente.
>
> **Conclusione, dichiarata come tale: la competenza dimostrata è la DIREZIONE di chi scrive codice,
> non la scrittura.** Dieci righe di skill signal, tutte di metodo; tre correzioni tecniche in sei
> mesi su 381; zero L3 in questo ramo (non ha mai corretto un agente *nel merito del codice* in modo
> ripetuto). E il conflitto **I-8** di S1 lo rinforza da una terza direzione indipendente: risulta
> autore di 1.074 commit, ma **J1-A07 registra che l'autore del commit non è l'autore del codice**.
> **Il conteggio dei commit non è una misura del suo lavoro di programmazione, e non va usato come tale.**
>
> **DICHIARATA:** coerente con questo — G1-D14, «principiante, nessuna competenza tecnica formale», e
> G3-D02, «*Io, Matteo, oriento il prodotto… L'agente costruisce*». **È l'unico ramo in cui la colonna
> DICHIARATA e quella ESERCITATA sono d'accordo su un livello basso.** **PARLATA:** una riga in H4
> (02-03-26), niente su CB-v2.

---

### §4.1 — Le divergenze fra le tre colonne, marcate

Sono le domande migliori per l'interrogazione senior, perché è dove le fonti non concordano.

| # | Ramo | DICHIARATA | ESERCITATA | PARLATA | La domanda |
|---|------|-----------|-----------|---------|-----------|
| **D1** | R05 Ambienti | **assente** | massima (103) | fortissima (H2-D05 originaria) | Perché non ha mai dichiarato di voler imparare la cosa che fa di più? |
| **D2** | R10 Auto-formazione | **massima** (13 decisioni fondative) | **minima** (una sola lezione, glossario tutto 🌱) | una riga | Ha progettato una scuola e non l'ha frequentata: perché? |
| **D3** | R06 UX | assente | alta (49) | **la più densa** (cluster «annulla», 15 righe peso 1) | Corregge di continuo e codifica quasi mai: è una scelta o un limite? |
| **D4** | R08 Compliance | bassa (`L1`) | reale ed **eseguita** (DPA firmato, region UE) | **vuota** | Ha fatto cose che non racconta mai. Chi le ha guidate? |
| **D5** | R09 Vendita | debole (prezzi «non approvati») | media | **sceglie, non origina** (H3-D34…D36) | Sul prezzo decide o ratifica? |
| **D6** | R11 Codice | «principiante» | L2, direzione | una riga (feb-mar, su un gioco) | Le tre colonne concordano su un livello basso: è l'unica volta. |
| **D7** | R02 Prodotto | media (G3-D08) | alta ma **dispersa in altri rami** | media | Il volume del ramo sottostima la competenza: quanto? |

---

## §5 — Timeline

> **Sequenza usata da questa timeline** (piano §2.2, input §8):
> **giochi + CB-old (feb-mar) → CB-v2 dal 27-04 → trading IN PARALLELO (mag-giu) → BHM e
> Trading-Platform (lug) → ritorno a CB-v2 (ago).**
> La sequenza dell'ipotesi iniziale — quella che metteva l'HACCP in testa e i giochi in coda — è
> **smentita dal corpus** e non è stata usata in nessuna riga di questo report.
> ⚠️ Le date delle linee B e C **non si prendono dal filesystem**: gran parte di `docs/Archives/` ha
> mtime identico 05-02-26, che è la data di una copia in blocco. Valgono solo le date scritte nei testi.
> ⚠️ Solo il 20% dei messaggi CB-v2 ha un timestamp proprio: **il mese è affidabile, il giorno no.**

### §5.1 — La linea del tempo delle skill

| Data | Evento nell'albero | Ramo | Fonte |
|------|--------------------|------|-------|
| dic 2024 – gen 2026 | **La preistoria che non è sua.** HACCP legacy: 7 agenti + quality gate, «Conferma Umana» come firma, `critical-verification` come skill scritta. Nel corpus **l'attribuzione a Matteo non regge**: 19 righe di sistema su 19 stanno qui | R01 · R04 | C1-D15, C1-D12, C1-D21, C2-D19 |
| **21-02-26** | Su CB-old sono **già presenti** cross-check fra agenti, opzioni A/B/C, branch di test ≠ main | R01 · R05 | H4 |
| **24-02-26** | **`controverifica` nasce già come parola-comando E come regola scritta.** Un L4 a febbraio, **due mesi prima che CB-v2 esistesse** | **R04** | H4-D06 |
| 02-03-26 | Rifiuta un boss `IF-heavy` e chiede una classe dedicata (MathBoy2). **L'unica correzione tecnica sul codice di tutto il corpus** | R11 | H4-A04 |
| feb–mar 2026 | MathBoy2 (367 msg), Game (91), CB-old, Qwen-Test. Consegna Survivor a **Tommaso**, un pari umano | R02 | H4-D08/D10 · S1 F099 |
| **27-04-26** | **Nasce CalendarBackup-v2** (primo commit `0a0758b`). Lo stesso giorno sceglie il riferimento visivo | R06 | J1-D01 · H1-D04 · S1 F093 |
| 15-05-26 | «Parlare per schermate, non per file»: **H1 la data prima del report che la registra** | **R07** | H1-D57 · S1 F061 |
| 20-05 → 06-06 | **Trade-Analyst gira in parallelo** al picco di CB-v2. Non dopo: insieme | R01 | H5 |
| 22-05 → oggi | «Verifica l'ambiente, se è PROD fermati»: la regola più ripetuta del corpus, in **4 file di skill diversi** | **R05** | H2-D05 → M1-D15, M2-D09, M3-D48, G1-D27 · S1 F001 |
| 23-05-26 | «Niente merge su `main` finché non l'ho revisionato io» | R05 | A1-D24 + H2-D19 · S1 F020 |
| 29-05-26 | **La giornata di nascita dello skill system**: `prepara`, modalità light/standard/deep, report unificato, mockup HTML prima del codice, `lavoro ok` (embrionale) | **R01** | A2-D34/D41/D48/D52 · S1 F006, F008, F009, F027 |
| 01-06-26 | I due segnali di chiusura si separano: `lavoro ok` ≠ `fai report finale`. **Entrambe `CORRETTIVA`: corregge la propria definizione** | R01 · R05 | A3-D40/D41 + M1-D08/D09 · S2-F04 |
| **04-06-26** | Nascono `senior` e `blindatura`. **Parte la Scuola**: 13 decisioni fondative in un giorno solo | **R10** | G1-D01…D15 · H3 |
| 04-06-26 | Nasce il **profilo Verifica**: la pratica di febbraio diventa un ruolo del sistema | R04 | M1-D45 · A4-D42/D44/D45 · S1 Top-30 #9 |
| 06/07-06-26 | Controtest = «cercare cosa rompe», non confermare il verde | R04 | A5-D29 + M1-D46 + H3-D26 + M3-D13 · S1 F030 (4 righe, 3 linee, peso 1) |
| 10-06-26 | **Split in 3 repository** e prima release pubblica PrenotaZen | R05 | J1-D02 · A5 |
| 11-06-26 | Limiti duri di magazzino (7/12/6/6) e limite coperti giornaliero, entrambi da intervista | R03 | A6-D01…D07, A6-D15…D20 |
| **12-06-26** | La giornata più densa: listino, revisione del listino in giornata, sconto lancio, posizionamento, region UE | R09 · R08 | S1 cluster T09 (12 righe) |
| **18-06-26** | **Il limite coperti giornaliero viene rimosso.** Sette giorni dopo esser nato. Nessuna fonte lo chiama errore | R03 | A9-D15 + M3-D31 · conflitto **N-5** |
| 19/20-06-26 | Checklist dei flussi da testare a mano; «entra in archivio solo con conferma esplicita di Matteo» | R04 | G1-D16…D20 |
| **22/23-06-26** | Ultimo merge `env/test` → `main`. **Da qui `main` non si muove più.** | R05 | J1-D05, J1-D06 |
| **lug 2026** | **Il buco non è una pausa: è un cambio di progetto.** BHM-v2, BHM-Zen, Trading-Platform. CB-v2 a **zero commit**. 107 decisioni prese, ma altrove | tutti | J1-A01 · S1 §4.4 · H5 |
| 30-06 → 05-07-26 | Lo scaffold del metodo viene **copiato** su FREEDOM Trading | R01 | F1 (satellite) |
| 06-07 → 08-07-26 | Su BHM-Zen **lo skill-system non nasce: viene installato** da v0 | R01 | B1 (satellite) |
| **02-08-26** | Ripresa di CB-v2, capitolo Servizio. Walk-in: ritira la propria ipotesi | R03 | A11-D04 + M3-D38 · S1 F012 |
| 06-08-26 | Collaudo manuale tagliato **62 → 16 prove**. «Blindato su TEST ≠ rilasciato in PROD» | R04 · R05 | A11-D43 + M3-D42 · A11-D38 + J1-D09 |
| 06-08-26 | Chiede questa indagine | R10 | H3-D58…D60 |

### §5.2 — Che forma ha la curva

**Non è una curva di crescita dell'agency.** S2 §7 lo ha misurato e non lo ripeto: sulla linea A la
quota di correzioni sue resta piatta al 65% da maggio a giugno; sulla linea H è **costante al 75% ± 5
da febbraio ad agosto**. Non impara a correggere: correggeva già.

**È una curva di spostamento della materia**, ed è la freccia temporale più solida che S2 consegna:

| Periodo | Su cosa corregge (linea A, solo M→A) |
|---------|--------------------------------------|
| maggio + fine maggio (n=54) | **METODO 31** — sta costruendo il modo di lavorare |
| giugno (n=92) | METODO 28 · **AMBIENTI 16 · PRODOTTO 17 · TESTING 15** — si distribuisce |

**A giugno il metodo era già in piedi**, e infatti la sua quota scende da oltre il 55% a meno del 31%.
Nell'albero questo si legge così: **R01 e R07 si costruiscono a maggio; R03, R04 e R05 crescono a
giugno sopra un metodo che c'era già.**

### §5.3 — Il ribaltamento di agosto: la lacuna L-S2-3, girata a S3 e non chiusa

S2 §7.1 me la consegna esplicitamente. Nella sola ondata **A11 (02–06/08)** le correzioni degli agenti
verso di lui salgono a **8 dirette — il massimo assoluto delle undici ondate A** — e le sue scendono al
**45%, il minimo assoluto**. Due letture, entrambe con fonti, nessuna dimostrata:

1. **Squadra più verificante.** A11-A08, A11-A09, A11-A13, A11-A17, A11-A19 sono tutte `DIRETTA`: in
   agosto lavorava con revisori, controverifiche e senior che producevano correzioni *leggibili*.
2. **Premesse ereditate più fragili.** Dopo sei settimane fuori dal progetto, lo stato che aveva
   ereditato era falso — «2 difetti / 18 commit» (A11-A19) — e M1-A35 registra il pattern come
   ricorrente (×3).

**Cosa aggiunge S3, e non basta a chiudere.** Guardando la Sezione 3 di A11: 14 righe, **zero L4**,
e la sua unica candidata L4 (`test-strategy`, dichiarata `L3–L4*`) è stata **declassata a L2 dalla
regola sugli ibridi** (§3.1) — l'asterisco rimandava a un confronto con le checklist vecchie che
nessuno ha fatto. Agosto, nell'albero, è un mese di **L2 e L3, senza codificazione nuova**.

Questo è **compatibile con entrambe le letture** e non ne sceglie nessuna: un mese di sola verifica
senza regole nuove è quello che ci si aspetta sia da una squadra più severa, sia da un rientro su
premesse fragili. **L'albero regge lo stesso** — nessuna foglia dipende da A11 per il suo livello —
quindi la lacuna resta aperta e va a **S4**, come previsto.

---

## §6 — Le frecce di trasferimento del metodo, datate

Le sezioni dedicate esistono **solo in B1, F1 e M1**; H5 lo dice in prosa ed è l'unica fonte sul buco
estivo. **C3 e C5 hanno solo note sparse: non ho cercato un'intestazione che non c'è.**

### §6.1 — CB-v2 → `_skill-system-v0` → BHM-Zen (luglio 2026) — fonte B1

> «*Lo skill-system **non nasce** — viene **installato** da v0 estratto da CB-v2 (mag–giu).*»

| Cosa passa | Direzione | Cosa dice la nota |
|-----------|-----------|-------------------|
| Lessico di comando (`prepara`, `lavoro ok`, `fai report finale`, `spiegamelo`, `ragioniamo`) | **CB → BHM** | il VOCABOLARIO di BHM dichiara: «ereditato dallo skill-system v0» |
| Bussola + profili Esecuzione / Verifica / Meta | **CB → BHM** | struttura copiata, riempita con i 4 casi HACCP |
| CHIUSURA, CONTROVERIFICA, EVOLUZIONE, REVISIONE, hook | **CB → BHM** | kit copiato; CHIUSURA adattata |
| Skill d'area per zona | **pattern CB → BHM**, contenuto **nuovo** | Oggi/Reparti/Scorte/Regia invece di Prenota/QR/Admin |
| OSSERVAZIONI / dati di livello 2 | struttura CB → BHM, contenuto **vuoto** | ⚠️ **contro-evidenza: il sistema non è stato nutrito a luglio** |
| Mini-pack | template copiato, **uso assente** | indice vuoto nella Bussola |
| `ARCHIVIO_DECISIONI` / `COMANDI_AVVIO` | **assenti in BHM** | restano solo su CB |
| Split TEST/PROD del database | **CB è più avanti** | BHM ha un database unico, che è «PROD di costruzione» |
| Append-only / storno / migration-gate | **nativo BHM** | prodotto, non metodo |
| Doppia lente Ufficiale-HACCP + Ristoratore | **nuovo in BHM** | **potenziale freccia futura verso CB** |

### §6.2 — CB → FREEDOM Trading (30-06 → 05-07-26) — fonte F1

> «*FREEDOM = scaffold CB copiato + vocabolario/enforcement alleggeriti + strato compliance più
> pesante. Nessuna frase «portato da CalendarBackup» nel corpus: solo struttura.*»

| | Cosa |
|---|------|
| **COPIED** | Bussola + tre profili · VOCABOLARIO a 3 livelli · ciclo OSSERVAZIONI→PROPOSTE→Meta · chiusura a due segnali · PREPARA_PROMPT · schema intervista→contesto→piano→esecutore |
| **SIMPLIFIED** | vocabolario quasi vuoto (**2 voci** contro le decine di CB) · OSSERVAZIONI solo placeholder · **hook `stop` e guard-PROD non installati** · didattica e metriche non attive |
| **HEAVIER** | **doppio** skill system (meta + kit runtime) · LOCK di compliance finanziaria (anti buy/sell) assente in CB · metodologia concorrenza A–E · masterplan legale e vendita con 3 branch SKU |

**Il dato di metodo che vale più della tabella:** ciò che viene alleggerito è **l'enforcement** (gli
hook, il guard-PROD, le metriche), cioè esattamente la parte che su CB era il suo salto L3→L4. Su un
progetto nuovo riparte dalla **struttura**, non dai **freni**.

### §6.3 — `_skill-system-v0` → skill system attuale (interna a CB) — fonte M1

| Da v0 | A oggi | Esito |
|-------|--------|-------|
| `00_BUSSOLA_SKILL.md` | `APP_CONTEXT_SKILL.md` | sopravvissuto, operativo pieno |
| `comunicazione/*` | `docs/Comunicazione-Skill/*` | sopravvissuto (pieni contro stub) |
| archivio inline PROPOSTE/OSS | `ARCHIVIO_DECISIONI` + `ARCHIVIO_OSSERVAZIONI` | **scisso** in due |
| `aree/` + `context/` template | skill d'area `docs/*-Skill/` + `contesto/` | realizzato fuori da Comunicazione-Skill |
| `hooks/README.md` | `.cursor/hooks/` | **sopravvissuto come codice**, non come documento |
| checklist di apertura di COMUNICAZIONE v0 | — | **abbandonata** |
| §8-bis «Lezione» di CHIUSURA v0 | EVOLUZIONE §6 + `_lavoro/` | **spostata**, non eliminata → è il collegamento con R10 |
| upgrade del Meta | propagati **verso** v0 | ⚠️ **freccia inversa: v0 non è un antenato morto** |

### §6.4 — La freccia CB → Trade → Trading → BHM — fonte H5, in prosa

È **il risultato centrale di H5** e l'unica fonte sul buco estivo. La frase che la riassume:

> «*Il metodo che avevi costruito su CalendarBackup non lo hai lasciato: lo hai portato (prepara,
> lavoro ok, controverifica, ragioniamo, template skill) e lo hai adattato progetto per progetto.*»

**Con il suo limite dichiarato dalla fonte stessa:** «*Perché a inizio agosto sei tornato su
CalendarBackup: in queste chat non lo dici.*» Il ritorno di agosto **non ha una spiegazione nel
corpus**. Non l'ho inventata.

---

## §7 — Gli handoff scritti per S3, onorati uno per uno

Tredici richieste, dall'input §9. Dichiaro quali ho chiuso e quali no.

| # | Handoff | Esito |
|---|---------|-------|
| 1 | **Disambiguare Calendario-M2 da M2-mining** (A6) | ✅ **CHIUSO.** Sono tre cose diverse e non vanno mai grepate insieme: **M2-mining** = l'ondata sulla Console super-admin; **Calendario-M2** = la milestone di blindatura del calendario (A6, 11-06); **M3 menu/magazzino** ≠ **M3-mining**. A6 registra la confusione nominale come già chiarita. In questo report M1–M4 indicano **sempre** le ondate di mining. |
| 2 | **Confronto Matteo di maggio vs Matteo del rilascio e della compliance** (A9) | ✅ **CHIUSO.** Il confronto è nel §5.2 e nella Sezione 3 di A9: a maggio le correzioni sono schiacciate su METODO (31 su 54); a giugno, nella settimana del rilascio, la Sezione 3 di A9 è fatta di `prod-ops / prod-gate / env-parity` L3, `release-gate` L2–L3, `unsubscribe / marketing-consent` L2–L3, `legal-handoff` L1–L2. **Il Matteo di maggio costruisce il metodo, quello di giugno governa un rilascio.** Con un dato che vale il confronto: **A9 è il picco del merito** (8 MERITO contro 2 FORMA, S2 §7.1), l'unica ondata dove guarda il prodotto più del processo. |
| 3 | **Incrociare le frecce skill-system CB ↔ BHM** (B1) | ✅ **CHIUSO** — §6.1, con la freccia inversa di M1 (§6.3) accanto. |
| 4 | **Il «punto zero»: il metodo nasce come 7 agenti + gate, non come skill system** (C1) | ✅ **CHIUSO, e conferma la tesi.** C1-D15 (20-10-25): «*flusso 0→1→2→3→[4→5→6→7] con quality gates*», `Chi = CONGIUNTA`. C1-D12: «*Utente/Owner — Conferma Umana*». Il punto zero è **un'orchestrazione a sette agenti con firma umana**, non uno skill system. Ma va detto ciò che C1 dice di sé: **tutte e sei le sue righe A→M sono peer review agente↔agente**, e il report dichiara che «*non sono prove che Matteo fosse fuori strada*». **Nel punto zero l'attribuzione a Matteo non regge**: le 19 righe di sistema dell'albero stanno quasi tutte qui. |
| 5 | **«Critical verification» di gennaio → è l'antenato di CONTROVERIFICA?** (C2) | ⚠️ **CHIUSO IN NEGATIVO, ed è un risultato.** C2-D19 esiste: `temp-folders/skills/critical-verification.md`, «*NON SEI UN OTTIMISTA - SEI UN CONTROLLORE RIGOROSO*». Ma C2 stesso lo classifica **L0–L1** con la nota «*skill scritta; non prova che Matteo l'abbia agita qui*», e `Chi = INCERTO`, `Autonomia = INCERTO`. **Non c'è filiazione dimostrabile.** La `controverifica` di CB ha una nascita propria e datata (H4-D06, 24-02-26) con una prova di peso 1 che `critical-verification` non ha. **Sono due cose che si somigliano, non una che discende dall'altra.** Chi volesse sostenere la filiazione dovrebbe produrre una riga che le colleghi: nel corpus non c'è. |
| 6 | **Confronto numerico 62→16 con le checklist vecchie** (C4) | ⚠️ **CHIUSO IN NEGATIVO.** C4 lo dice esplicitamente: «*Nel perimetro **non esiste il numero 62**; l'unico «62» non è pertinente (pass rate di ForgotPassword). Il «16» di IDENTIFICAZIONE è una coincidenza numerica, non il collaudo di A11.*» **Il confronto numerico non esiste e non va costruito.** Il confronto **qualitativo** invece regge, ed è quello vero: nelle checklist legacy il collaudo era una **cerimonia** («*Tested By: Claude Code*», «*Tests Completed: __/6*», tutte le caselle `[ ]` vuote); nel 2026 è un **filtro umano stretto** (16 prove che fa lui, M3-D42/D45). C4 lo riassume: il suo ruolo scritto era «*soprattutto sigillo umano… non scrivere le checklist lunghe*». |
| 7 | **Sopravvivenza di «ragioniamo» e di ERRORI_PROCESSO** (C5) | ✅ **CHIUSO.** Dalla satellite di C5: la lezione «decisioni affrettate sotto pressione» produce le skill di reasoning, che **non sopravvivono come file** ma hanno «*eco parziale nel trigger «ragioniamo» del VOCABOLARIO*». La lezione «claim di blindatura gonfiati» **sopravvive**, «*come cultura di controverifica (EVOLUZIONE / TESTING)*». La lezione «modifica di componenti già testati» **sopravvive evoluta**, in LOCK/blindatura della Testing-Skill. **Due lezioni su sette sopravvivono come cultura, una come pattern, quattro sono morte.** |
| 8 | **Evoluzione 6 skills → `Agente_*` → 4 core → skill d'area** (C5) | ✅ **CHIUSO, con una data.** C2-D17 + C5-D27 (S1 F089) registrano il **primo skill system a 6 skill** (overview / test / mapping / prompt / error). La satellite di C5: «*Troppe cartelle `Agente_*` in `.cursor/rules` → Cleanup 07-01-26 → MANIFEST → 4 core*», esito «**Superata: oggi skill d'area, non i 4 core**». La sequenza completa è quindi: **6 skill (2025) → `Agente_*` (fine 2025) → 4 core (cleanup 07-01-26) → skill d'area (CB-v2, 2026)**. ⚠️ **Le prime tre tappe sono di sistema, non di persona**: C5 attribuisce le regole ad «Agente 0» e «Agente 1». **Solo l'ultima tappa ha decisioni sue.** |
| 9 | **Decisioni di maggio sopravvissute vs skill attuali** (G2) | ✅ **CHIUSO tramite la satellite di M3**, che mappa ogni cluster di decisione alla sessione che l'ha prodotta: Shell D01–D07 → 06-06 (A5/A6); Prenotazioni D08–D12 → 06-06; Controtest D13 → 07-06; Calendario/Menu D14–D23 → 11-06 (A6); Settings D24–D28 → 15-06 (A8); **Limiti D31–D32 → 18-06 (A9, cambio di modello)**; CRM D29/D30/D34 → 15-06 e 20-06; Servizio D35–D41 → 22-06 → 02-08; **Collaudo 62→16 D42–D45 → 06-08 (A11)**. **La skill d'area attuale è la sedimentazione di sessioni datate, e la catena è tracciabile riga per riga.** È anche la misura del passaggio decisione → regola: S1 §2 registra che la linea M perde **47 righe in fusione** (227 → 180), «la prova materiale che il passaggio è realmente avvenuto». |
| 10 | **Quando `Metodo_spiegazioni` è confluito nel vocabolario** (G3) | ❌ **NON CHIUSO, e la risposta provvisoria è: non è confluito.** G3 §4 dichiara la contro-evidenza: «*Metodo ancora in `_lavoro`, non fuso nella skill ufficiale COMUNICAZIONE → regola privata più che sistema globale*». Nel corpus **non esiste una data di confluenza**. Esistono due voci imparentate nel VOCABOLARIO («spiegamelo semplice», «ragioniamo») ma nessuna riga che dica «`Metodo_spiegazioni` è stato fuso». **Lacuna L-S3-2.** |
| 11 | **La tabella «albero skill + frecce v0» già pronta in M1** | ✅ **CHIUSA e usata per intero** — §6.3, incluse le due voci scomode (la checklist di apertura **abbandonata** e la **freccia inversa** verso v0). |
| 12 | **La freccia CB → Trade → Trading → BHM** (H5) | ✅ **CHIUSA** — §6.4, con il suo limite dichiarato (il ritorno di agosto non è spiegato in H5). |
| 13 | **La lacuna L-S2-3, il ribaltamento di agosto** (girata da S2) | ⚠️ **NON CHIUSA, per scelta** — §5.3. L'albero regge senza scioglierla; la consegno a S4 con il dato nuovo (agosto = zero L4, l'unica candidata declassata da ibrido). |

**Bilancio: 9 chiusi, 2 chiusi in negativo (che è comunque una risposta), 2 non chiusi e dichiarati.**

---

## §8 — Cosa NON risulta

Il ramo «scrittura di codice» adesso è esplicito (§5 di questo albero, R11), quindi **questa sezione
non è più il posto dove finisce il codice**. Qui c'è il resto: skill che ci si aspetterebbe da chi
costruisce e vende un prodotto, e che nel corpus non si vedono. **Ho verificato ognuna, non le ho date
per scontate.**

| # | Cosa non risulta | Cosa ho cercato e cosa ho trovato |
|---|------------------|-----------------------------------|
| 1 | **Gestione economica del progetto** | Esiste una sola riga di skill signal in tutto il corpus: G1 `pricing-sustainability` **L0–L1**, con contro-evidenza «*cifre proposte da un agente, non ratificate*». C'è un'analisi costi/IVA e un report Fable, ma **nessuna decisione sua su un budget, un margine o un costo ricorrente**. Il regime fiscale è un'ipotesi «*da confermare col commercialista*» (S1 F048). **Non c'è una skill di gestione economica: c'è la consapevolezza che serve.** |
| 2 | **Rapporto con utenti reali** | **Zero righe.** Il corpus contiene un solo interlocutore umano non-AI: **Tommaso**, a cui consegna Survivor (H4-D08/D10, S1 F099) — ed è un pari, non un cliente. Non esiste una riga di intervista a un ristoratore vero, un test con un utente, un feedback da un cliente. Le «interviste owner» (A6, M3, B3) sono **interviste a sé stesso**: è lui l'owner. **L'intero prodotto è stato progettato senza un utente esterno nel corpus.** |
| 3 | **Manutenzione nel tempo** | **Quasi zero, e con una contro-prova di fatto.** Non esiste una skill di manutenzione, monitoraggio o gestione di incidenti in produzione. La contro-prova: **75 commit su `env/test` che non sono in `main` dal 23-06** (J1-A05), le migrazioni 063–071 mai arrivate in PROD (J1-A03), il deploy delle edge function inseguito per tre sessioni senza chiudersi (S2-F24). **Sa costruire e sa bloccare; non risulta che sappia mantenere.** |
| 4 | **Lavoro con altri sviluppatori umani** | **Una sola traccia**, la stessa del punto 2 (Tommaso). Più un'anomalia da non confondere: 25 commit di **Cristiano**, e M2 registra un'acceptance «*firmata da Cristiano nei panni di Matteo*». **Non è collaborazione documentata: è il conflitto I-8.** |
| 5 | **Stima e pianificazione dei tempi** | **Zero righe.** Nessuna decisione su una scadenza, una stima, una capacità di lavoro. Esistono masterplan e milestone, ma sono **sequenze**, non calendari. La sola regola sul ritmo è «un WP per sessione, mai due» (S1 F105), che è un **freno**, non una stima. |
| 6 | **Design visivo autonomo** | **Presente ma solo come giudizio, mai come generazione.** 49 righe in R06, tutte reattive: annulla, ritara, «l'immagine non va bene». La contro-evidenza è di H1 §4: «*Skill di product scoping alta coesiste con loop «annulla / riduci 1/N» — non è autonomia di design system, è controllo pixel-per-pixel*». **Sa dire che è sbagliato; non risulta che sappia dire come si fa.** |
| 7 | **Sicurezza applicativa oltre gli ambienti** | R05 è il ramo più grosso, ma parla di **PROD vs TEST, branch e rilascio**. Le RLS ci sono (D2-D37, prova manuale) ma il conflitto **N-1** è aperto: il rate limit dell'endpoint pubblico ha **due valori incompatibili** in due documenti (3/ora vs 5/minuto), entrambi `INCERTO`. **La sicurezza che esercita è quella del processo, non quella dell'applicazione.** |

---

## §9 — Consegna a S4: l'elenco completo delle L3 e L4

**È l'input diretto di S4: senza questa lista S4 non parte.** 153 righe di persona — **40 L4 e 113 L3**
— ognuna con l'etichetta sistema/persona e lo stato della contro-evidenza. La tabella completa
riga-per-riga sta in `docs/_lavoro/Indagine-Corpus/S3/s4_input.txt` (fuori git, ricontabile). Qui
l'indice per ramo e **tutte le L4**, che sono il bersaglio prioritario.

### §9.1 — Le 40 L4, tutte

| # | Ramo | Ondata | Skill | Etichetta | Contro-ev. |
|---|------|--------|-------|-----------|-----------|
| 1 | R01 | M1 | Soft vs enforcement (hook > markdown) | **persona** | cercata |
| 2 | R01 | M1 | Annota ≠ codifica | **persona** | cercata |
| 3 | R01 | M1 | Allineamento skill implicito | **persona** | cercata |
| 4 | R01 | H4 | skill-authoring / controverifica (24-02) | **persona** · peso 1 | cercata |
| 5 | R01 | H3 | session-closure / prepara-discipline | **persona** · peso 1 | cercata |
| 6 | R01 | B1 | skill-portability (v0 → progetto) | **sistema** (B1-C10) | cercata |
| 7 | R01 | A4 | skill-alignment | **persona** | in nota |
| 8 | R01 | A3 | area-disambiguation | **persona** | cercata |
| 9 | R01 | A3 | grilletti-map / trust-levels | **persona** | cercata |
| 10 | R01 | A3 | session-close-split | **persona** | cercata |
| 11 | R01 | A2 | comm-skill-system / vocabolario | **persona** | in nota |
| 12 | R01 | A2 | session-weight light/standard/deep | **persona** | in nota |
| 13 | R03 | M4 | area-routing Prenota ≠ QR ≠ magazzino | **persona** | cercata |
| 14 | R03 | M1 | Disambiguazione Prenota/QR/menu ×3 | **persona** | cercata |
| 15 | R03 | A6 | menu-magazzino-limits / intervista-owner | **persona** | in nota |
| 16 | R03 | A6 | **limite-coperti** | **persona** | in nota · ⚠️ **conflitto N-5 aperto** |
| 17 | R04 | M1 | Profili Esecuzione / Verifica / Meta | **persona** | cercata |
| 18 | R04 | M1 | Controverifica imparziale | **persona** | cercata |
| 19 | R04 | H3 | blindatura-orchestrate / controtest | **persona** · peso 1 | cercata |
| 20 | R04 | B1 | audit-immutability / append-only | **sistema** | cercata |
| 21 | R04 | A6 | blindatura-method / manuale-SoT | **persona** | in nota |
| 22 | R05 | M4 | product-scoping QR multipli / no content_type | **persona** | cercata |
| 23 | R05 | M4 | product-auto-select card singola | **persona** | cercata |
| 24 | R05 | M4 | product-capabilities intolleranze universali | **persona** | cercata |
| 25 | R05 | M4 | blindatura (intervista + Classic in prod) | **persona** | cercata |
| 26 | R05 | M2 | env-safety (TEST ≠ PROD, `get_project_url`) | **persona** | cercata |
| 27 | R05 | M1 | Separazione «lavoro ok» / «fai report finale» | **persona** | cercata |
| 28 | R05 | M1 | Controtest / blindatura di prodotto | **persona** | cercata |
| 29 | R05 | M1 | Sicurezza PROD (chiedi, non negare) | **persona** | cercata |
| 30 | R05 | A6 | merge-pubblico (solo se tocca `src/`) | **persona** | in nota |
| 31 | R06 | M4 | public-layout Prenota (cap, XOR, sticky) | **persona** | cercata |
| 32 | R06 | M1 | Mockup HTML prima delle scelte UX | **persona** | cercata |
| 33 | R07 | M1 | Vocabolario governato + livelli di libertà | **persona** | cercata |
| 34 | R07 | M1 | Comunicazione «schermata + effetto» | **persona** | cercata |
| 35 | R07 | G3 | explanation-schema / spiegamelo-semplice | **persona** | cercata · ⚠️ mai fuso nella skill ufficiale |
| 36 | R07 | B1 | domain-lexicon (4 case HACCP) | **sistema** | cercata |
| 37 | R08 | M4 | legal-vendita / pricing-posizionamento | **persona** | cercata |
| 38 | R08 | M4 | legal-metodo (docs in repo) | **persona** | cercata |
| 39 | R08 | B1 | compliance-lock (fonte unica dei numeri) | **sistema** | cercata |
| 40 | R11 | M1 | Context-knowledge (il codice è la verità) | **persona** | cercata |

**Riepilogo delle etichette: 36 «di persona», 4 «di sistema».**

⚠️ **Da dove viene l'etichetta, perché i numeri riconcilino.** Ci sono **due sorgenti** e vanno tenute
distinte:

- **Marcatore meccanico** — la cella del livello dice da sola che la competenza è del sistema
  («*L4 di sistema*», «*lato agenti*», «*non voce Matteo*», «*codificata da agenti*»). Nel dataset sono
  **19 righe**, di cui **una sola è L4** (M3 `env-safety`: «*L1 su Matteo / L4 di sistema*», il modello
  che il mandato indica come esempio da imitare). Le altre 18 sono L0–L3, quasi tutte in C1–C5.
- **Giudizio del senior, firmato qui** — le **4 righe L4 di B1**. Meccanicamente risultano «di persona»,
  perché B1 non scrive nessun marcatore nella cella. Le ho etichettate «di sistema» sulla base di
  **B1-C10**, che B1 scrive di sé: «*Nessuna M-VOCE nominale in B1 (solo «owner»). Attribuzione L3/L4
  dipende da H5; qui peso 3*». Sono `skill-portability`, `audit-immutability`, `domain-lexicon`,
  `compliance-lock`. **Se S4 verifica in H5 che l'attribuzione regge, tornano «di persona».**

Chi ricontrolla il TSV troverà quindi `soggetto = PERSONA` su quelle quattro righe: la differenza è
questa nota, non un errore di conteggio.

### §9.2 — Le 113 L3, per ramo

| Ramo | L3 | Concentrazione |
|------|----|----------------|
| R05 Ambienti | **26** | la più alta: env-safety e release-gate compaiono in 11 ondate diverse |
| R06 UX | **19** | tutte reattive (§4, R06) |
| R01 Agenti | 18 | |
| R04 Qualità | 17 | il gate umano attraversa **tre progetti legacy** (cluster S2-T07) |
| R03 Flusso | 13 | |
| R02 Prodotto | 7 | |
| R08 Compliance | 4 | |
| R07 Linguaggio · R09 Vendita · R10 Formazione | 3 ciascuno | |
| R11 Codice | **0** | ⚠️ **non ha mai corretto un agente nel merito del codice in modo ripetuto** |

### §9.3 — I sette bersagli che consegno per primi

1. **Le 21 L4 di M1 e M4** — il 52,5% del totale, con la circolarità del §0. Se S4 ne fa cadere metà, l'albero cambia forma.
2. **`limite-coperti` L4 (A6) contro `soft-limits` «L4 cand.» (M3)** — l'unica L4 su cui esiste un conflitto aperto (T01 / N-5), e l'asimmetria che ne esce: **la forma ribaltata dopo sette giorni ha un L4 pieno, la forma sopravvissuta due mesi ha un L4 mai confermato**.
3. **Le 4 L4 «di sistema» di B1** — B1-C10 dice che l'attribuzione dipende da H5: verificare in H5 se reggono.
4. **`Privacy docs/_lavoro`** — già declassata da me, ma con contro-evidenza **contraria** disponibile (77 file tracciati): S4 la usi come caso-scuola.
5. **`explanation-schema` L4 (G3)** — la regola più personale del corpus, e non è mai stata fusa nella skill ufficiale: è L4 o è una regola privata?
6. **I 7 declassamenti del §3.2** — se S4 trova la contro-evidenza che io non ho trovato, risalgono.
7. **Il ribaltamento di agosto** (L-S2-3) — con il dato nuovo: agosto produce **zero L4**.

---

## §10 — Copertura dichiarata

**Copertura di S3 sul proprio ingresso: 39 report su 39, 477 righe su 477, 100%.** Nessun lotto è stato
rifatto. Non esistevano conteggi attesi per lotto: li ho stabiliti io e sono nel §1.3.

### §10.1 — Le tre unità, che non si sommano (regola comune 5)

**Non esiste un totale unico.** File, messaggi e fatti si misurano in unità diverse.

| Unità | Linee | Perimetro (da P0/S1) | Righe di skill signal |
|-------|-------|----------------------|----------------------|
| **File `.md`** | A, B, C, D, E, F, G, I, M | 1.867 file aperti | **409** |
| **Messaggi** | H | 3.321 M-VOCE dichiarati letti (su 3.412 censiti da P0-EX) | **61** |
| **Fatti** | J | 1.074 commit · 72 migrazioni · 32 release · 2 database | **7** |

I tre numeri fanno 477 in aritmetica, ma **non vanno sommati in una frase**: «477 righe» è un totale di
righe di tabella, non una misura di corpus. Un file, un messaggio e un commit non sono la stessa unità.

⚠️ **La discrepanza dei 91 messaggi resta aperta**, ereditata da S1 §8 e S2 §10.1: P0-EX censisce
3.412 M-VOCE, la somma dichiarata da H1–H5 è 3.321. È una fonte di **peso 1**. Handoff a **S6**.

### §10.2 — I limiti di questa ondata, dichiarati

| Limite | Effetto concreto |
|--------|------------------|
| **Nessun header canonico in Sezione 3** | l'estrazione ha richiesto una famiglia di 22 varianti (§1.1). Chi rifà il lavoro con un altro criterio otterrà un altro numero |
| **Il totale dichiarato 568 non è riproducibile** | uso **477**, e dichiaro lo scarto invece di sanarlo (§1.3) |
| **Nessun ID proprio in Sezione 3** | le righe non sono citabili singolarmente: si citano per (ondata, etichetta). Nessuna delle 477 ha un ID nativo |
| **44 righe senza nessun ID di evidenza** (9,2%) | non possono reggere da sole il livello di una foglia (§3.3). Concentrate in A1 e B3 |
| **12 ondate senza colonna di contro-evidenza** | la regola dura §3.4 ha richiesto una verifica manuale su 21 righe (§3.2), non un test meccanico |
| **La colonna `Skill` è etichettatura libera** | 1.313 etichette distinte, 72% uniche. La classificazione in rami è **lessicale**, e il secondo strato di regole ha spostato 68 righe: contestabile riga per riga |
| **Il ramo R02 è sottostimato per costruzione** | il product scoping è assorbito da altri rami quando l'evidenza parla di rilascio o di flusso (§4, R02) |
| **La colonna DICHIARATA poggia su un solo perimetro** | G1 (`Scuola/`, 6 file, **0 su git**) e G3. Se il materiale della Scuola è incompleto, la colonna lo è |
| **Corpora non riaperti** (da mandato) | dove il report non dice, S3 apre una lacuna e non indaga |

---

## §11 — Lacune e handoff

### §11.1 — Lacune aperte da S3

| # | Lacuna | Perché non si chiude qui | A chi va |
|---|--------|--------------------------|----------|
| **L-S3-1** | **Il totale «568 righe» non è riproducibile** (io conto 477 di famiglia, 562 con le satellite) | è un numero dell'input, non dei report: sanarlo richiederebbe di sapere come è stato ottenuto | **S6** (metodo) |
| **L-S3-2** | **`Metodo_spiegazioni` non risulta confluito nel vocabolario ufficiale** | G3 dichiara che è ancora in `_lavoro`; nel corpus non c'è una data di confluenza | **S5** |
| **L-S3-3** | **44 righe di skill signal senza nessun ID** | i report d'origine scrivono l'evidenza come frase; recuperarle richiederebbe di riaprire i corpora | S4 |
| **L-S3-4** | **La colonna PARLATA copre 8 rami su 11** | R08 Compliance, R09 Vendita e R11 Codice hanno una o zero righe in H1–H5. Per compliance è **legittimamente vuota** (previsto dall'input); per gli altri due è un dato | S5 |
| **L-S3-5** | **Il ritorno di agosto su CB-v2 non ha una spiegazione nel corpus** | H5 lo dichiara esplicitamente: «*in queste chat non lo dici*» | **S5 / interrogazione** |
| **L-S3-6** | **La filiazione `critical-verification` (gen) → `controverifica` (feb) non è dimostrabile** | non esiste una riga che colleghi le due; la seconda ha una nascita propria di peso 1 | S4 |
| **L-S3-7** | **Il ribaltamento di agosto (L-S2-3) resta aperto** | S3 aggiunge un dato (agosto = zero L4) compatibile con **entrambe** le letture | **S4** |

### §11.2 — Conflitti ereditati e NON chiusi qui (come da mandato)

| Conflitto | Cosa fa S3 |
|-----------|-----------|
| **T01 / N-5** — limite coperti: cambio di modello o errore? | La foglia `limite-coperti` resta **L4 contestata** e viene tenuta **separata** dalla foglia «limiti morbidi», che è la regola sopravvissuta. Non spostata in nessuna direzione |
| **N-3** — mandato «educare Matteo»: A4 dice APPROVATA, M1 dice ORIGINATA | La foglia «educazione reciproca» di R10 è **L3, non L4**, proprio perché l'autonomia è contesa. Il conflitto è citato accanto alla foglia |
| **N-2** — listino Pro 79 → 69 fotografato solo nello stato finale | Motivo dichiarato per cui R09 **non ha nessun L4**: un listino fotografato non è una regola riusata |
| **I-8** — «autore git = suo lavoro» non dimostrato | **Rinforzato per una terza via indipendente**: R11 ha 10 righe, zero L3, e le uniche 3 correzioni sul codice in 381 |
| **I-4** — prezzo carosello | Non tocca nessuna foglia dell'albero: resta dove S1 e S2 l'hanno lasciato |
| **N-1** — rate limit 3/ora vs 5/minuto | Citato in §8 punto 7 come limite del ramo R05, non chiuso |

### §11.3 — Handoff attivi verso le ondate successive

| A | Cosa consegno |
|---|---------------|
| **S4** (falsificazione) | **Il §9 per intero: 40 L4 + 113 L3 con etichetta sistema/persona** · i 7 bersagli prioritari del §9.3 · i 7 declassamenti del §3.2 (se trova la contro-evidenza, risalgono) · le 4 L4 «di sistema» di B1 da verificare in H5 · la lacuna L-S3-7 |
| **S5** (ritratto e rischi) | **La tensione G1-D14** («principiante, nessuna competenza tecnica formale», peso 1) contro le 103 righe di R05: è la divergenza **D1**, ed è la prima domanda del dossier · le 13 decisioni fondative della Scuola citate per intero (§4, R10) · la contro-evidenza «sistema didattico progettato, poco agito» · **§8 punto 2: nessun utente reale nel corpus** · **§8 punto 3: non risulta manutenzione** · L-S3-2 e L-S3-5 |
| **S6** (dossier finale) | **L'avvertenza del §0 va in testa al dossier, non in nota** · usare **477** e non 568, con lo scarto dichiarato · le tre unità separate del §10.1 · le 7 divergenze del §4.1 come **scheletro della banca domande** · la sequenza cronologica del §5, mai quella smentita |

---

## §12 — Tre righe per Matteo

**1. La cosa che hai coltivato davvero non è una schermata: è il modo in cui si lavora — e la prima
volta che l'hai scritta era febbraio, non giugno.** Il 24 febbraio, mentre facevi un videogioco, hai
chiesto di aggiungere al file delle regole che ogni lavoro va **ricontrollato con uno screenshot alla
mano**. Quella riga è nata due mesi prima che CalendarBackup esistesse, e da lì non l'hai più
abbandonata: è diventata la controverifica, poi la blindatura, poi le 16 prove che collaudi tu a mano
prima di dire che una parte dell'app è a posto. Quando sei passato al trading e all'HACCP, il metodo
te lo sei portato dietro — su BHM non l'hai rifatto, l'hai **installato**.

**2. Sulla parte che il cliente vede correggi di continuo, ma quasi mai trasformi la correzione in una
regola.** Le tue chat sono piene di «annulla», «torna a com'era», «la foto non deve comparire sul
telefono», «il testo della fascia deve essere nero» — è la cosa che fai più spesso in assoluto. Ma
quando poi si scrivono le regole del progetto, di tutto questo resta quasi niente: la pagina che
prenota e il menu digitale li hai **guidati** decina di volte e **codificati** due. È l'opposto di
quello che succede con gli ambienti: lì hai una regola sola — «prima di scrivere sul database vero,
fermati e chiedi» — e l'hai scritta in quattro posti diversi perché non venisse mai saltata.

**3. Due cose non tornano, e sono le domande migliori da fare a te.** La prima: nella tua scheda
personale hai scritto di essere «principiante, nessuna competenza tecnica formale», e nello stesso
periodo stavi collaudando l'app su tre schermi diversi, ripulendo il database di prova e bloccando i
rilasci. Le due cose non stanno insieme. La seconda: il 4 giugno ti sei costruito una scuola — profilo,
glossario, roadmap, «lezione della chat» — e poi l'hai usata **una volta sola**. Il glossario è ancora
tutto «in apprendimento». Non so dirti perché: nei file non c'è scritto. È la prima cosa che ti
chiederei.
