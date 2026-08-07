# S5 — Ritratto metodologico

> **Ondata:** S5 · **Data:** 07-08-26 · **Profilo:** Verifica | Meta · **Modalità:** deep
> **Perimetro:** sola lettura sui report. Nessun file di `src/`, nessun corpus grezzo.
> **Fonti autorizzate:** M1 · M2 · M3 · M4 · G1 · G2 · G3 · H1 · H2 · H3 · H4 · H5, più le tabelle
> «Numeri di ritmo» delle H. **2.473 righe in ingresso** (1.166 di peso 1, 1.307 di peso 3).
> **Precondizioni verificate:** S1, S2, S3 e S4 esistono tutti e quattro e sono chiusi (07-08-26).
> Nessuno manca; nessun ripiego sui report grezzi di mining.
> **Intermedi ricontabili:** `docs/_lavoro/Indagine-Corpus/S5/` (fuori git) —
> `censimento_ritmo.py`, `conta_fonti.py`.

---

## §0 — Da leggere prima di qualunque asse

Questa sezione non è una premessa di cortesia. Le due cose che dice cambiano il significato di
**ogni riga** che viene dopo, e chi salta il §0 legge un ritratto diverso da quello che è stato
scritto.

### §0.1 — Di ogni dialogo si legge una voce sola

Il materiale su cui è costruito questo ritratto ha un buco al centro: **19.198 righe su 22.862 del
testo degli agenti sono oscurate** (piano §2.1, `REDACTED`). Vuol dire che di ogni conversazione si
legge una metà — la sua. L'altra metà, quella in cui l'agente propone, obietta, spiega o corregge,
per la maggior parte non è leggibile.

Un ritratto costruito su un materiale così **fa sembrare qualunque persona più decisa, più sola e
più al comando di quanto fosse**, perché la voce che l'avrebbe contraddetta manca dal file. La prova
misurata di questa distorsione la porta S2 §0: **sulla linea H le correzioni `A→M DIRETTA` sono zero
su cinque finestre temporali**. Non perché non siano avvenute: perché la riga che le conterrebbe è
oscurata. Tutte le `A→M` della linea H sono `DEDOTTE`, cioè inferite dalla sua risposta.

### §0.2 — I report gli attribuiscono i meriti in silenzio e gli errori altrui a voce alta

La seconda metà dell'avvertenza viene da S4 §6 ed è un'asimmetria misurata: **dodici casi di merito
attribuito impropriamente contro otto di errore**. La forma conta più del numero. Gli errori degli
agenti i report li marcano da soli — «*contro-evidenza per l'agente*», «*la decisione tecnica è
agente*», «*scelta agente*» — mentre **i meriti li assorbono senza dirlo**. E **solo cinque ondate
su trentanove** avvertono il lettore di non gonfiare l'autonomia.

Conseguenza pratica per chi legge questo report: **ogni volta che una fonte di peso 3 dice «Matteo
ha deciso», va tenuto presente il §0.2.** Per questo, sotto, il peso è dichiarato riga per riga e
non a piè di pagina.

### §0.3 — Che cosa fa e non fa questo report

| Fa | Non fa |
|----|--------|
| Mette in fila le sue parole, raggruppate per asse, ognuna con fonte e peso | Non diagnostica, non usa aggettivi che non stiano in una fonte |
| Mostra dove auto-descrizione e comportamento non coincidono | Non risolve la tensione: non inventa un livello che le concili |
| Registra il buco 22-06 → 02-08 come **cambio di progetto** | Non lo tratta come una pausa, e non inventa il motivo del ritorno |
| Registra che la quota di correzioni sue è **piatta** | Non scrive una narrazione di crescita: è misurata, e non cresce |
| Elenca i rischi operativi che gli arrivano dalle altre ondate | Non li scrive come colpe |
| Lascia aperti i conflitti T01/N-5, N-3, N-2, N-1, I-4, I-5, I-8, I-11 | Non li chiude: sono di S6 e dell'interrogazione |

---

## §1 — Le regole di peso, applicate prima di scrivere una riga

**Citabile come parola sua SOLO ciò che sta dentro «…».** Le Sezioni 4 e 7 di ogni report sono
scritte dall'agente di mining, anche quando danno del tu a Matteo: sono parafrasi, non voce. Dove
qui uso una Sezione 4, lo scrivo (`§4-n`) e non la presento come una sua frase.

| Fonte | Peso | Che cosa dà | Come è marcata sotto |
|-------|------|-------------|----------------------|
| **H1–H5** | **1** | Le sue parole verbatim dai transcript. **Densità e distribuzione**: dice quanto e come scrive, non solo cosa ha detto di importante | `[1 · H2-A16]` |
| **M1–M4 · G2 · G3** | **3** | Sintesi e regole scritte da agenti *con* lui. Dà il momento che qualcuno ha ritenuto valesse la pena salvare | `[3 · M1-D46]` |
| **G1 — `PROFILO_SCOLASTICO`** | **1 / 4** | **Deroga spaccata** (piano §2, linea G): peso **1** per «cosa dice di sé», peso **4** per «cosa sa fare» | `[1* · G1-D14]` |
| **G1 — resto del perimetro** | **3** | Checklist, blindature, comandi, analisi vendita | `[3 · G1-D17]` |

**Le due trappole di peso di questa ondata, dichiarate in anticipo.**

1. **G3 è scritto in prima persona ma resta peso 3.** `Metodo_spiegazioni_agenti_coding.md` dice
   «*Io, Matteo…*» e questo non lo trasforma in una fonte di peso 1: è un file di regole, non un
   transcript. S3 ha resistito alla tentazione e qui faccio lo stesso. L'asse 5 è tutto costruito su
   G3 e **è dichiarato peso 3 riga per riga**, con i due caveat del §3.5.
2. **La deroga di G1 è spaccata, e applicarla intera in una direzione sola è l'errore gemello.**
   `[1* · G1-D14]` «*principiante, nessuna competenza tecnica formale*» vale peso 1 **come
   auto-dichiarazione** e peso 4 **come misura di competenza**. Non è una prova che sia principiante:
   è una prova che *si descrive* così.

**Numeri verificati con `conta_fonti.py`** (non ri-derivati, ricontati): le dodici fonti contengono
**954 citazioni tra caporali**, di cui **408 nelle cinque H** — che è esattamente il numero di
citazioni di peso 1 ereditato dall'input. La coincidenza è la verifica, non una scoperta.

---

## §2 — Censimento delle tabelle «Numeri di ritmo», **prima** di usarle

Il mandato lo chiede e aveva ragione a chiederlo. Le «Numeri di ritmo» sono una **tabella
satellite**: S1, S2 e S3 le hanno censite dentro il proprio perimetro di sezione e **non contate**,
e nessuna ondata ha mai verificato che le cinque H usino lo stesso header. Il censimento è in
`docs/_lavoro/Indagine-Corpus/S5/censimento_ritmo.py`, adattato da `S4/survey_sezione4.py`.

### §2.1 — L'header non è uno: sono tre varianti più un'assenza

| Ondata | Header nel preambolo | Esito |
|--------|----------------------|-------|
| **H1** | **nessun header contenente «ritmo»** | ⚠️ **la tabella non esiste** |
| H2 | `## Numeri di ritmo (obbligatori H)` | presente |
| H3 | `## Numeri di ritmo (obbligatori H) + confronto H1/H2` | presente |
| H4 | `## Numeri di ritmo` | presente |
| H5 | `## Numeri di ritmo (obbligatori H)` | presente |

**Tre varianti letterali distinte su quattro ondate che ce l'hanno.** Un estrattore che cercasse
l'header esatto di H2 troverebbe H5 e perderebbe H3 e H4; uno che cercasse `## Numeri di ritmo`
esatto troverebbe solo H4.

**H1 non ha la tabella.** Questo va detto invece di far finta che il ritmo sia misurato su cinque
fonti: **la tabella è su quattro.** I numeri di ritmo di H1 esistono lo stesso, ma stanno **in
prosa**, in una riga in grassetto: «*Ritmo (solo M-VOCE senza secret, n=985): media 235 caratteri
(mediana 62)*». Sono usabili, e li uso — ma provengono da una forma diversa e chiunque rifaccia il
conto con un parser di tabelle non li troverà.

### §2.2 — La forma delle tabelle nel preambolo

| Ondata | # | Colonne | Righe | Malformate | Header |
|--------|---|---------|-------|-----------|--------|
| H1 | 1 | 3 | 6 | 0 | `Classe \| N \| Nota` — **è l'attribuzione del periodo, non il ritmo** |
| H2 | 1 | **2** | 10 | 0 | `Voce \| Valore` |
| H2 | 2 | 3 | 9 | 0 | `Parola \| Occorrenze H2 \| Nota` |
| H3 | 1 | **4** | 12 | 0 | `Voce \| H1 \| H2 \| H3` — **confronto a tre colonne, non una sola ondata** |
| H3 | 2 | 6 | 11 | 0 | `Parola \| H1 \| H2 \| H3 \| Prima in H3 \| Nota` |
| H4 | 1 | **2** | 10 | **4** | `Voce \| Valore` |
| H4 | 2 | 5 | 5 | 0 | `Progetto \| Msg \| M-VOCE \| Periodo \| Media char` |
| H4 | 3 | 4 | 12 | 0 | `Parola / pratica \| Prima volta reale \| Natura \| Nota` |
| H5 | 1 | **2** | 9 | 0 | `Voce \| Valore` |
| H5 | 2 | 5 | 4 | 0 | `Progetto \| N \| Media char \| Mediana \| Nota` |
| H5 | 3 | 3 | 8 | 0 | `Parola \| N \| Dove` |

**Due difformità che vanno dichiarate perché cambiano il risultato di un conteggio meccanico:**

- **H3 non è una tabella di H3: è una tabella di confronto H1/H2/H3.** Ha **quattro** colonne dove
  H2, H4 e H5 ne hanno due. Un estrattore che leggesse «colonna 2 = valore» su H3 raccoglierebbe i
  numeri di **H1**, non quelli di H3, e non se ne accorgerebbe.
- **H4 ha quattro righe malformate su dieci.** Le voci `M-REGIA`, `M-PASTE`, `M-OK` e
  `Paste «Implement the plan as specified…»` hanno **tre celle** in una tabella dichiarata a due.
  Il valore resta leggibile in colonna 2, ma la terza cella (una nota) non ha intestazione e un
  parser che validasse la larghezza scarterebbe proprio le tre classi di attribuzione.

### §2.3 — Che cosa è misurato su cinque fonti e che cosa no

| Metrica | Su quante H | Nota |
|---------|-------------|------|
| **Media e mediana caratteri M-VOCE** | **5 su 5** | Ma su H1 stanno **in prosa**, non in tabella (§2.1) |
| M-VOCE · M-REGIA · M-PASTE · M-OK | **5 su 5** | Su H1 nella tabella `Classe \| N \| Nota`; su H4 in righe malformate |
| Bucket di lunghezza | 4 su 5 — **manca H5** | H1 in prosa · H2 assente · H3 in prosa · H4 in tabella |
| `date_src=msg` (affidabilità della data) | **4 su 5 — manca H4** | H4 non dichiara la quota di date proprie |
| Picchi di messaggi al giorno | 3 su 5 — **mancano H1 e H5** | |
| Scomposizione per progetto | 2 su 5 (H4, H5) | Le altre tre sono monoprogetto (CB-v2) |

### §2.4 — La contaminazione già misurata: perché sotto uso la mediana

Le cinque H dichiarano tutte, in forme diverse, che **una parte dei messaggi lunghi non è scrittura
sua**: sono prompt strutturali, blocchi incollati e nudge dell'interfaccia, classificati `M-VOCE`
perché non hanno i marcatori completi di `M-REGIA` (piano §3.3).

| Ondata | Contaminazione dichiarata |
|--------|---------------------------|
| H1 | **402 M-PASTE** nel periodo (campionati, non estratti come decisioni) |
| H2 | «*coda lunga: 83 msg ≥1000, molti = prompt/CSS Apply incollati*» |
| H3 | «*i blocchi lunghi sono spesso prompt incollati (M-REGIA o M-VOCE «promptish» senza marker completi)*» |
| H4 | **62** paste «*Implement the plan as specified…*» — UI Cursor, non M-REGIA |
| H5 | «*~27 messaggi paste-ish… gonfiano media caratteri*» (§4-3) |

**Regola applicata in tutto il §3.7: quando parlo di come scrive, uso la MEDIANA. Quando uso la
media, lo dichiaro nella riga.**

---

## §3 — I sette assi

---

### §3.1 — Come apre un lavoro e come lo chiude

> **Fonti dell'asse:** H4, H1, H2, H3, H5 (peso 1) + M1, S1 T10 (peso 3). **Non poggia su una fonte
> sola:** cinque ondate di peso 1 lo misurano indipendentemente.

**Il metodo esiste prima del vocabolario.** H4 ha datato messaggio per messaggio le pratiche di
febbraio-marzo, quando CalendarBackup-v2 non esisteva ancora:

| Quando | Che cosa | Peso |
|--------|----------|------|
| **21-02** | Cross-check fra agenti — «*verifica che ti sia sfuggito*» | `[1 · H4]` |
| **21-02** | Opzioni A/B/C e linguaggio non tecnico | `[1 · H4]` |
| **24-02** | Branch di test ≠ main deploy | `[1 · H4]` |
| **24-02** | «*aggiungi al file di skills di controverificare con screen*» | `[1 · H4-D06]` |
| **28-02** | `crea report` in cartella sessione | `[1 · H4]` |
| **02-03** | `procedi` · **05-03** `fai report` · **13-03** `revisiona` | `[1 · H4]` |
| **22-03** | `dammi prompt` — delega la scrittura del prompt, ancora senza schema | `[1 · H4]` |

H4 lo chiude così: «*il **metodo** esiste già a febbraio-marzo. Il **vocabolario ufficiale corto**
non*». E la riga del 24-02 è l'unica parola-comando che nasce lì **e** viene subito scritta in una
skill.

**Il vocabolario corto nasce a maggio e si consolida a giugno.** I conteggi substring delle tre
finestre CB-v2, tutti di peso 1:

| Parola | H1 (27-04→15-05) | H2 (16-05→31-05) | H3 (01-06→06-08) | Prima comparsa |
|--------|------|------|------|----------------|
| `prepara` | ~0 come grilletto | **49** | **91** | H2 |
| `fai report` | 2 (dal 14-05) | 26 | **42** (+9 M-OK) | H1 |
| `revisiona` | — | 24 | 16 | H2 |
| `controverifica` | **0** | 9 | **35** | 24-02 in H4, poi H2 |
| **`lavoro ok`** | **0** | **2** | **32** (+ **45** in M-OK) | **29-05** |
| `senior` | 0 | 2 | **49** | **04-06** |
| `blindatura` | 0 | **0** | **60** | **04-06** |
| `ragioniamo` | 0 | 0 | **2** (voce vera 17-06) | 06-06 su Trade-Analyst |
| **`spiegamelo`** | **0** | **0** | **0** | **mai, in nessuna H** |

H3 verbalizza il verdetto: «*il passaggio «descrivo ogni volta → uso parole-comando» **non nasce a
giugno**: `prepara`/`controverifica` esistono da febbraio. Ciò che nasce o si consolida in H3 è il
**pacchetto di chiusura***» `[1 · H3]`.

**Il rito di chiusura è la struttura ripetuta più stabile del corpus.** S1 lo isola come cluster
**T10**, 9 righe su due linee `[3 · S1 T10]`. Ha due segnali distinti, e la distinzione è sua:

- `[3 · M1-D09]` «lavoro ok» = task accettato + report completo, **senza push** — «*annotarsi già
  tutto quello che è successo*». Autonomia: `CORRETTIVA`.
- `[3 · M1-D08]` «fai report finale» = «*capitolo chiuso fai commit e push*». Autonomia:
  `CORRETTIVA`.

Entrambe sono `CORRETTIVA` perché **la prima volta li aveva intesi scambiati e ha dovuto correggere
la propria definizione** (S2-F04, fusione di M1-A34 e A3-A25). S1 le mette al **#5 delle 30
decisioni più significative**.

**Il rito viaggia fuori da CalendarBackup.** H5 conta `lavoro ok` **10 volte** su Trade-Analyst
(06-06) e Trading-Platform (03–04-07), e `prepara` **18 volte su tutti e quattro** i progetti
paralleli `[1 · H5]`. H5 lo etichetta: «*metodo CB già operativo fuori da CB*».

**Come chiude quando la chiusura non va:** `[1 · H2-A13]` header «*sistemato*» ma non lo è → stop e
report · `[1 · H3-A08]` «Fermati + report» sui test che non funzionano · `[1 · H1-A18]` «Debug
Analytics: niente codice prima del report».

---

### §3.2 — Come gestisce l'ambiguità e lo scope

> **Fonti dell'asse:** H2, H3, H5 (peso 1) + M1, G1, G3, A8, S1, S3 (peso 3). **Non poggia su una
> fonte sola.**

**`product-scoping` è l'etichetta più frequente dell'intero corpus decisionale: 59 occorrenze**
`[3 · S3 §3]`. È il numero che dice su che cosa lavora di più quando lavora sul lavoro stesso.

**Le regole che ha scritto contro l'allargamento:**

| Riga | Peso |
|------|------|
| «*Un WP per sessione, mai due*» | `[3 · G1-D39]` |
| «*Freno scope creep*» in PREPARA_PROMPT | `[3 · M1-D23]` |
| «*Stop a nuovi meccanismi/regole finché… ~5-10 sessioni*» — PAUSA-RACCOLTA | `[3 · M1-D37]` |
| «*trattare lo snellimento… obiettivo interno permanente*» | `[3 · M1-D63]` |
| «*Zone confondibili anche in chat esplorativa*» | `[3 · M1-D27]` |
| «*differenza tra Menu QR, Pagina Prenota e Personalizza form*» — i dubbi che fermano un agente | `[3 · G3-D09]` |

**Il gate di disambiguazione nasce da un errore ripetuto, non da un principio.** `[3 · M1-D28]`
«*Unico danno dimostrato e ripetuto… ≥3 agenti*». S1 lo mette al **#10 delle 30** e lo chiama «il
ciclo errore-diagnosi-regola completo».

**L'auto-osservazione, e non è negata.** Nel `PROFILO_SCOLASTICO` lo scope creep è annotato come
**tratto da sorvegliare** `[1* · G1-A12]` — auto-sorveglianza registrata: «sa di allargare a metà».
S1 §6 mostra il rovescio operativo: **12 dei 44 rifiuti** sono tagli di scope su BHM-Zen (`presence`
fuori dalla beta, ~2.700 righe di realtime legacy buttate, IA runtime e pagamenti fuori beta)
`[3 · S1 §6]`.

**Che cosa dicono i transcript, cioè come va davvero mentre lavora** (tutte peso 1):

- `[1 · H2-§4-1]` «*tre correzioni di rotta nello stesso thread*»
- `[1 · H2-§4-7]` «*stesso giorno: chiede analisi skill, poi annulla tutto tranne 1 file*»
- `[1 · H2-A10]` viewport: «lavoro non richiesto / ripristina scope»
- `[1 · H3-A20]` «Rimuovi finestra prenotazione fuori scope»
- `[1 · H5-D26]` scoping di una demo: «*versione MINI… Panoramica - Utenti - Engagment*»

**E che cosa costa quando lo scoping arriva dopo.** La contro-evidenza più cara del corpus è
`[3 · A8-§4-1]`: «*G16 / finestra prenotazione: implementata end-to-end (migrazioni 053/054 + UI +
edge) poi «rimuovere» la stessa giornata*». S4 verifica `product-scoping` in cinque ondate e in tutte
e cinque **regge a L3, con il costo registrato accanto**: `[3 · H2 in S4]` «*lo scoping è forte e
instabile insieme*».

---

### §3.3 — Rapporto con il dettaglio tecnico: cosa vuole sapere, cosa delega

> **Fonti dell'asse:** M1 (peso 3) per i tre limiti + H1, H2, H3, H4 (peso 1) per i riscontri.
> **Attenzione:** i tre limiti sono scritti dal **suo stesso skill system**, cioè da una fonte di
> peso 3 che lui ha commissionato. Non li ammorbidisco e non li carico.

**La riga di partenza è di peso 1 ed è del primo giorno di CalendarBackup-v2.** `[1 · H1-D02]`
(27-04-26, `ORIGINATA`): «*non ho conoscenze… usa un linguaggio semplice*». Precede di **cinque
settimane** la stessa dichiarazione nel `PROFILO_SCOLASTICO`, ed è la stessa cosa detta in chat
invece che in un file di scuola.

**I tre limiti scritti nel sistema** `[3 · M1]`, con il loro riscontro di peso 1 quando esiste:

| # | Limite, come è scritto | Fonte | Riscontro peso 1 |
|---|------------------------|-------|------------------|
| 1 | «*non capisce domande in termini di implementazione*» — la sua frase registrata è «*non mi è chiaro cosa devo decidere*», e la domanda è stata riformulata «in sala» | `[3 · M1-C6 · M1-D70]` (03-08-26) | — |
| 2 | «*non capisce cosa manca… usare **parole intere***» — niente elenchi minimali con sigle | `[3 · M1-C7 · M1-D58]` (11-06-26) | `[1 · H3-A11]` «FU troppo criptici con sigle» |
| 3 | «*non vedo il modal*» = **non percepisce `window.confirm`** | `[3 · M1-C10]` | `[1 · H2-A05]` — la stessa frase, «non vedo il modal», nel transcript del conflitto promo |

Il limite 3 ha una conseguenza codificata: `[3 · M1-D14]` «*componente Modal, non `window.confirm`*»
— e S1 lo trova come cluster **T12** su tre linee diverse.

**Che cosa delega, detto da lui:**

- `[3 · G3-D02]` «*Io, Matteo, oriento il prodotto… L'agente costruisce*» — ⚠️ prima persona, **peso
  3** (§1).
- `[3 · G3-D08]` «*è giusto per il ristoratore…? la decisione finale torna a me*».
- `[1 · H5-D35]` la delega più larga del corpus, e non è su CalendarBackup: «*si sentisse il
  proprietario… senza chiedermi autorizzazioni*» (06-07, su BHM-Zen). Tre righe dopo però
  `[1 · H5-D39]` «*BLINDARE… prima di andare a disallinearci*».

**Che cosa non delega: il momento in cui si scrive codice.** Tutte peso 1:
`[1 · H1-A18]` «niente codice prima del report» · `[1 · H1-A20]` orario ancora sbagliato dopo il fix
→ «stop codice» · `[1 · H1-A19]` «non eseguire, solo foglio».

**Il numero che chiude l'asse, ed è di S2:** su **381 correzioni** classificate per materia, quelle
sul **codice sono 3 — lo 0,8%** `[3 · S2, consegnato a S3]`. L'unica correzione tecnica sul codice di
tutto il corpus è di peso 1 e sta su un gioco, non sul prodotto: `[1 · H4-A04]` (02-03) rifiuta un
boss `IF-heavy` e chiede una classe `BossEnemy`.

---

### §3.4 — Controllo qualità: di cosa non si fida, cosa ricontrolla di persona

> **Fonti dell'asse:** G1 e M1 (peso 3) per le regole · H1, H2, H3, H4 (peso 1) per la pratica ·
> G1 §4 e A11 (peso 3) per il rovescio. **Non poggia su una fonte sola.**

**La regola di accettazione è che accetta lui.**

| Riga | Peso |
|------|------|
| «*Entra in archivio solo se… conferma esplicita di Matteo*» | `[3 · G1-D17]` |
| «*Escluso: QA Playwright degli agenti… senza tua conferma*» | `[3 · G1-D18]` |
| Criterio di pass: «*cosa fai → cosa DEVE succedere (= pass)*» | `[3 · G1-D25]` |
| Viewport obbligatori: «*📱 375 · 💻 834 · 🖥️ 1280*» | `[3 · G1-D20]` |
| «*mai confermato da Matteo*» — motivo per **non** archiviare | `[3 · G1-D52]` |

**Non si fida del verde.**

- `[3 · M1-D46]` «*chiusura area = ricerca attiva di rotture… non «test verdi»*» — S1 la mette al
  **#1 delle 30 decisioni più significative**: 4 righe su 3 linee, con una fonte di peso 1.
- `[3 · M1-D47]` «*non basta documentare, la **pagina deve funzionare in produzione***».
- `[3 · M1-D40]` sull'hook di fine chat: «*ripeti anche se a posto, la presenza del titolo non
  garantisce*».
- `[3 · M1-D45]` la controverifica a tre livelli, marcata «*intuizione Matteo, non un agente nuovo*».

**E non si fidava già a febbraio,** cioè prima che esistesse il sistema che lo scrive:
`[1 · H4-A01]` (24-02) i colori non sono cambiati → impone la controverifica con screen **dentro la
skill** · `[1 · H4-A03]` (02-03) «non segnare task complete prima del suo test».
S1 lo registra al **#9 delle 30**: «*l'unica skill con una prova di peso 1 **quattro mesi prima** di
essere codificata*».

**Il controllo che fa di persona, dai transcript** (peso 1): `[1 · H2-A06]` sulla validazione dice
«*niente*» finché non vede gli effetti · `[1 · H2-A13]` header «sistemato» ma non lo è → stop +
report · `[1 · H3-A13]` revisione: «lavoro non eseguito».

**Il rovescio, e va messo accanto, non in nota.**

- `[3 · G1-§4-5]` «**OK revocato — footer Menu QR accettato per errore, era Prenota: prova che anche
  lui può certificare male**». La riga corrispondente in Sezione 1 è `[3 · G1-D51]` (31-05,
  `CORRETTIVA`): «*segnato OK per errore; problema era su Pagina Prenota*».
- `[3 · A11-CE1]` la checklist di collaudo **ferma a 4/62 per ≥3 sessioni**, con gli e2e tutti verdi.
- `[3 · G1-§4-4]` «*checklist viva con 6 voci ☐; editor promo multi-tipologia mai confermato; fix
  marketing in pending*».
- `[3 · L-S4-2]` **gli esiti dei test non sono mai stati riverificati da nessuno**: il 95,5% di
  accettazione è auto-dichiarato, e **sei ondate** documentano almeno un esito dichiarato falso.

S4 chiude entrambe le righe di accettazione (M3 e G1) allo stesso modo, e la frase è sua:
«**L'accettazione come atto formale esiste; come atto compiuto, spesso no.**» `[3 · S4 §3]`. Le due
skill scendono da L3 a L2.

---

### §3.5 — Come vuole che gli si parli

> **⚠️ Asse a fonte quasi unica.** Tutte le nove righe vengono da **un solo file**,
> `_lavoro/Supporto/Metodo_spiegazioni_agenti_coding.md`, letto dalla sola ondata G3.
> **⚠️ Peso 3, malgrado la prima persona** (§1).
> **⚠️ Il sistema pubblico non l'ha assorbito.** S3 aveva aperto la lacuna **L-S3-2**; S4 l'ha chiusa
> **in negativo** e ha declassato la skill da **L4 a L3** proprio per questo. È una **regola privata**,
> non una regola di sistema. `[3 · G3-§4-1]` lo dichiara la fonte stessa: «*Matteo sa come vuole
> essere spiegato; il sistema skill pubblico non lo ha assorbito del tutto al 28-05*».
>
> Con questi tre caveat, è **la fonte più forte del corpus su questa materia** e il mandato chiede di
> citarla per esteso. Segue integrale.

| ID | Che cosa chiede | Citazione | Peso |
|----|-----------------|-----------|------|
| **G3-D01** | Schema fisso per ogni fix | «*Quando mi spieghi una modifica o un fix, usa questo schema*» — Problema → Componente → Flussi → Perché | `[3]` |
| **G3-D02** | Chi fa che cosa | «*Io, Matteo, oriento il prodotto… L'agente costruisce*» | `[3]` |
| **G3-D03** | La versione semplice | «*usa un'immagine pratica o un esempio concreto*» | `[3]` |
| **G3-D04** | Quattro cose da non confondere | «*una modifica… una regola operativa… un comportamento automatico*» | `[3]` |
| **G3-D05** | Niente rischi d'ufficio | «*Non voglio una sezione rischi automatica ogni volta*» — fermati e chiedi | `[3]` |
| **G3-D06** | I test si raccontano solo se servono | «*non serve raccontarmeli ogni volta*» | `[3]` |
| **G3-D07** | La didattica è su richiesta | «*Non spiegarmi tutto in modo didattico di default*» | `[3]` |
| **G3-D08** | Dove torna la decisione | «*è giusto per il ristoratore…? la decisione finale torna a me*» | `[3]` |
| **G3-D09** | Quando fermarsi | «*differenza tra Menu QR, Pagina Prenota e Personalizza form*» — più prod/test e Classic/Pro | `[3]` |

**Le stesse richieste, dove sono arrivate nel sistema pubblico** (peso 3, M1):
`[3 · M1-D11]` «spiegamelo semplice» = «*metafora + chi-fa-cosa*» · `[3 · M1-D30]` checklist QA:
«*no URL, sì schermata+effetto*» · `[3 · M1-D57]` «*non riformulare 3–4 volte… Una risposta
compatta*» · `[3 · M1-D58]` «*usare **parole intere***».

**Che la pratica preceda la regola è misurato, e di peso 1.** `[1 · H4]` (21-02): «Opzioni A/B/C +
linguaggio non tecnico» è registrato come «*stesso stile di comunicazione di maggio*». E
`[1 · H1-D02]` (27-04) è la stessa richiesta detta in chat: «*usa un linguaggio semplice*».

**Il dato scomodo di questo asse, e viene dal peso 1.** La parola-comando che governa questa materia
— **`spiegamelo`** — ha **zero occorrenze in H1, H2, H3 e H5**: H3 lo dichiara esplicitamente
(«*Ancora assente*»), H5 la conta **0** su tutti e quattro i progetti paralleli. **La regola su come
vuole che gli si parli è scritta due volte e non è mai stata invocata con la sua parola in nessuno
dei corpora di peso 1.** Non deduco perché: lo registro.

---

### §3.6 — Come reagisce quando l'agente sbaglia, e quando sbaglia lui

> **Fonti dell'asse:** H1–H5 (peso 1) per la prima metà · A4, M3, H3, H4 (misti) per la seconda.
> **Non poggia su una fonte sola.** ⚠️ **Vale qui più che altrove il §0.1:** la reazione dell'agente
> è oscurata, quindi si legge solo la sua metà dello scambio.

#### Quando sbaglia l'agente: il cluster «annulla»

S2 lo isola come **S2-T02** e me lo consegna esplicitamente: **15 righe, tutte di peso 1** — H1-A01…
A07, A09, A10 · H2-A01, A16 · H3-A03, A05 · H4-A06 · H5-A02. Nel corpus complessivo, **21 delle 31
righe** che contengono `annulla`/`ripristina` stanno sulla linea H `[3 · S2 §3.2]`.

**La forma è costante, ed è la frase di S2:** non «*rifai in questo modo*», ma «**torna a com'era**».

| Riga | Citazione o oggetto | Peso |
|------|--------------------|------|
| H1-A02 | «*annulla tutta questa modifica*» (sfondo) | `[1]` |
| H1-A03 | annulla e rifai il logo ingigantito, «*casino*» | `[1]` |
| H1-A04 | **serie**: 1/3 → 1/5 → 1/12 → 1/15 sul logo, esito `parziale` | `[1]` |
| H1-A06 | «*non hai capito annulla*» — riduci di metà l'elemento | `[1]` |
| H1-A09 | annulla **tutte** le responsive sui pulsanti | `[1]` |
| H2-A16 | «*annulla tutto*» sul padding del revisore | `[1]` |
| H3-A03 | «*annulla queste ultime tue modifiche*» | `[1]` |
| H4-A06 | «*annulla… lascia solo il bordo*» (05-03, su un gioco) | `[1]` |
| H5-A02 | annulla l'allungamento del logo, poi riduci/alza (Trading, luglio) | `[1]` |

**Il registro, quando la correzione si ripete** (peso 1): `[1 · H1-A11]` «*fai le cose come te le
chiedo*» · `[1 · H1-A12]` «*modifiche idiote*» · `[1 · H1-A13]` «*niente non sei capace*» — cambia
modello, esito `ignota`, e poi riprende · `[1 · H3-A04]` «*agente ha sbagliato ancora*».

Su questo registro c'è un conflitto **aperto** che non chiudo: `I-6`, «*A ammorbidisce («l'agente ha
sistemato»), H è molto più duro*» `[3 · S1 §3.1]`. Resta a S6.

E c'è una cosa che il cluster dice sulle skill scritte, ed è di S2: «*nelle skill scritte non c'è
traccia delle decine di «annulla, il logo è un casino»; nei transcript sono la maggioranza*»
`[3 · S2 §3.2]`. Sulla linea M la materia dominante è METODO (20 su 42) e UI vale **una riga**; sulla
linea H, UI è la materia **prima** (22 su 66).

#### Quando sbaglia lui: il materiale è raro, e va contato per intero

| Quando | Che cosa | Citazione | Peso |
|--------|----------|-----------|------|
| **02-03-26** | Ammette di aver chiesto la modifica sbagliata (kill bullet, MathBoy2) | «*ho sbalgiato*» | `[1 · H4-A12]` |
| **maggio** | Testo fascia: bianco → nero → **si scusa** → bianco | «*scusami*» | `[1 · H1-A21]` |
| **02-06-26** | **Falso negativo su un layout**: a ~1320px dice che il fix sticky non c'è; causa = **dev server non riavviato** | «*scemo io, non avevo riavviato*» | `[3 · A4-D20 · A4-§4-1]` |
| **11-06-26** | Ritira il **blocco per-fascia pubblico** | «*non serve, avevo deciso male*» | `[3 · M3-D19 · M3-A02]` |
| **20-06-26** | **Falso allarme intolleranze**: la prenotazione non era andata | «*scusa scemo io… toast… non è efficace*» | `[1 · H3-D55 · H3-CE4]` |
| **giugno** | Email Brevo: credeva rotto, era una secret sbagliata | — | `[1 · H3-A19]` |

⚠️ **`M3-A02` riguarda il blocco per-fascia, NON il limite coperti giornaliero.** Sono due decisioni
vicine e distinte, e la confusione fra le due è esattamente ciò che tiene aperto il conflitto
**T01 / N-5**. S4 lo dichiara: «*Non ho usato M3-A02 per chiuderlo*». Sul limite coperti — nato
l'11-06, rimosso il 18-06, sette giorni dopo — **nessuna fonte lo chiama errore**, e A9-§4-9 dichiara
la frase di ammissione **cercata e non trovata**. Resta aperto.

**E cambia idea anche senza che nessuno sbagli** (M↔M, tutte peso 1): `[1 · H2-A11]` nello stesso
thread, «*non annullare scroll fondo*» dopo aver detto «ripristina» · `[1 · H2-A12]` sfondo Prenota:
`fixed` → preferisce lo scroll · `[1 · H1-A25]` cambia idea sullo spazio bianco del footer, «annulla
dopo aver insistito» · `[1 · H4-A15]` il famiglio passa da «non colpire le equazioni» a «può
risolvere le equazioni».

**Quando è l'agente ad aver ragione**, la traccia esiste ma è `DEDOTTA` — per il §0.1, non per altro:
`[1 · H3-A14]` «*hai ragione*» sul menu desktop · `[1 · H5-A08]` «*hai ragione*» su `env.local` ·
`[1 · H1-A22]` «*ok ora funziona, ma mobile…*» · `[1 · H1-A23]` «*va bene così per ora*».

---

### §3.7 — Ritmo e continuità

> **Fonti dell'asse:** le cinque H (peso 1), con le limitazioni del **censimento §2**: la tabella
> esiste su **quattro** ondate, i numeri di H1 sono in prosa, H3 è una tabella di confronto a quattro
> colonne e H4 ha quattro righe malformate. **Media e mediana non sono mai confuse: sotto uso la
> mediana e dichiaro ogni media.**

#### Come scrive — **mediana**, cioè il messaggio tipico

| Periodo | Ondata | Mediana caratteri | Media (dichiarata) | Base |
|---------|--------|-------------------|--------------------|------|
| feb–mar 26 (pre-CB-v2) | **H4** | **126** | 243 | 582 M-VOCE leggibili |
| 27-04 → 15-05 | **H1** | **62** | 235 | n=985 — ⚠️ **numeri in prosa, non in tabella** |
| 16-05 → 31-05 | **H2** | **131** | 591 | 723 M-VOCE leggibili |
| 01-06 → 06-08 | **H3** | **164** | 417 | 768 M-VOCE leggibili |
| Progetti paralleli e luglio | **H5** | **152** | 892 | 201 M-VOCE leggibili |

**Il messaggio tipico sta fra 62 e 164 caratteri.** La media sta fra 235 e 892 — e la distanza fra le
due colonne è la contaminazione da paste già misurata al §2.4, non uno stile che cambia. H5 lo dice
della propria media: «*gonfiata da paste lunghi e brief prodotto*».

**Il minimo della mediana è H1: 62 caratteri**, e H1 spiega perché: «*qui domina il micro-aggiustamento
UI, non il brief lungo*». È lo stesso periodo del cluster «annulla» (§3.6).

#### Come si distribuisce il lavoro fra le classi di messaggio

| Classe | H4 (feb–mar) | H1 (apr–mag) | H2 (mag) | H3 (giu–ago) | H5 (paralleli) |
|--------|--------------|--------------|----------|--------------|----------------|
| Messaggi nel perimetro | 634 | 1449 | 871 | 970 | 233 |
| **M-VOCE** | 593 | 1032 | 732 | 780 | 205 |
| **M-REGIA** | **0** | **0** | **3** | **110** | 12 |
| **M-PASTE** | 14 | **402** | 127 | **19** | 6 |
| **M-OK** | 27 | 15 | 9 | **61** | 10 |
| Chat | 62 | 91 | 116 | **189** | 60 |

**Le tre curve che i numeri mostrano**, e sono conteggi, non interpretazioni:

1. **`M-REGIA` va da 0 a 110.** H3 la legge così: «*da giugno delega la **scrittura** dei prompt
   strutturati; la voce corta resta sua*» `[1 · H3]`. Dei 113 `M-REGIA` di tutto CB-v2, **110 stanno
   in H3**.
2. **`M-OK` moltiplica per sette** (9 → 61). H3: «*la ritmica di chiusura diventa abitudine, non
   eccezione*». È la controparte misurata del rito di chiusura del §3.1.
3. **`M-PASTE` crolla** (402 → 127 → 19): «*meno dump DOM/errori in chat; più orchestrazione*».

**Picchi di M-VOCE in un giorno** — misurati su **3 ondate su 5** (§2.3): 05-03 **149** (MathBoy2) ·
29-05 **146** · 31-05 **135** · 12-06 **115** · 01-06 **112** · 05-06 **112** `[1 · H2, H3, H4]`.

#### Continuità: il buco di luglio è un cambio di progetto

`[1 · H3]` lo misura sul corpus CalendarBackup: **luglio = 0 messaggi**; agosto = 28, di cui 18
M-VOCE. `[1 · H5]` dice dov'era:

| Progetto | Periodo | M-VOCE | Mediana |
|----------|---------|--------|---------|
| Trade-Analyst | **20-05 → 06-06** — **in parallelo** al picco di CB-v2 | 86 | 164 |
| Trading-Platform | **03-07 → 05-07** | 48 | 102 |
| BHM-v2 | **05-07 → 09-07** | 49 | 206 |
| BHM-Zen | luglio | 18 | 238 |

H5 lo verbalizza in tre righe: «*Parallelo mag–giu confermato*» · «*Metodo CB esportato, non
abbandonato*» · «*Luglio non è pausa*». Su BHM lo skill-system **non nasce: viene installato**
`[3 · B1, via S3 §6.1]`.

**Il motivo del ritorno ad agosto non è dichiarato**, e H5 lo dichiara di sé: «*in queste chat **non
lo dici***». Vedi §5(a).

#### Un limite di datazione che vale per tutto l'asse

`date_src=msg` (la quota di messaggi con un timestamp proprio) è: H1 ~40% · H2 ~4% · H3 ~4% ·
H5 57% · **H4 non lo dichiara**. Due delle tre finestre CalendarBackup hanno il **4%**, e H2 e H3
scrivono entrambe la stessa avvertenza: «**non ragionare su singole giornate senza A**». Quindi:
**il mese è affidabile, il giorno no** — tranne dove una fonte A o J lo conferma.

---

## §4 — Auto-descrizione vs comportamento

> **Regola di questa sezione:** la colonna «cosa dice di sé» usa **G1/Scuola con la deroga spaccata
> peso 1**; la colonna «cosa mostrano i dialoghi» usa **H, peso 1**. Le sette divergenze sono lo
> scheletro di S3 §4.1. **Non risolvo nessuna delle sette, e in particolare non risolvo G1-D14.**

**La riga da cui parte tutto.** `[1* · G1-D14]` (04-06-26, `ORIGINATA`): «*principiante, nessuna
competenza tecnica formale*». E la stessa cosa, cinque settimane prima e in chat:
`[1 · H1-D02]` (27-04-26) «*non ho conoscenze… usa un linguaggio semplice*». **Come
auto-dichiarazione vale peso 1. Come misura di competenza vale peso 4 e non prova niente** (§1).

Accanto, nello stesso perimetro privato: collaudi a **tre viewport** `[3 · G1-D20]`, seed di
database e SQL sull'edition testati «*davvero sul DB TEST il 16-06-26*» `[3 · G1-D28]`, comandi E2E
per operare senza agente — «*Serve a lanciare i test browser… e capire se sono passati*»
`[3 · G1-D26]`. G1 §4 la verbalizza per primo e chiede di **non risolverla inventando un livello**.
S3 non l'ha risolta. Non la risolvo.

### §4.1 — Le sette divergenze

| # | Ramo | Dice di sé | Mostrano i dialoghi | Stato |
|---|------|-----------|---------------------|-------|
| **D1** | **Ambienti** | **niente**: non dichiara mai di voler imparare la sicurezza degli ambienti | **il massimo**: 103 righe, il ramo più voluminoso dell'albero. La regola è scritta in **4 file di skill diversi** | **riscritta al §4.2** |
| **D2** | Auto-formazione | **il massimo**: 13 decisioni fondative in un giorno `[3 · G1-D01…D15]` | **il minimo**: una sola «Lezione della chat», coda vuota, glossario tutto 🌱 `[3 · G1-§4-2]` | **due prove indipendenti** — §4.3 |
| **D3** | UX | **niente** | **il più denso**: il cluster «annulla», 15 righe peso 1 (§3.6). Dopo S4: **18 L3 contro 1 sola L4** | corregge moltissimo, codifica quasi mai — §4.4 |
| **D4** | Compliance | bassa, `L1` | **eseguita**: DPA Supabase firmato 23-05 `[3 · G1-D35]`, region UE | la colonna «parlata» è **vuota**: non ne parla mai in chat |
| **D5** | Vendita | debole — «*prezzi non approvati*», «*nessuna attività aperta*» `[3 · G1-D31]` | **sceglie, non origina** `[1 · H3-D34…D36]` | invariata |
| **D6** | **Codice** | «principiante» | **L2, direzione**. Una sola riga di peso 1, su un gioco `[1 · H4-A04]` | **le due colonne concordano** — §4.5 |
| **D7** | Prodotto | media `[3 · G3-D08]` | alta ma **dispersa in altri rami** | il volume del ramo sottostima; quanto, non è misurato |

### §4.2 — D1 riscritta con il dato di S4 §4.2 — è il dato più importante che arriva a questa ondata

S3 aveva scritto che la competenza sugli ambienti era **originaria**. S4 ha cercato la
contro-evidenza e ne ha trovate **sei convergenti, tre di peso 1**:

| Quando | Che cosa | Fonte | Peso |
|--------|----------|-------|------|
| inizio periodo | MCP puntato sull'URL **PROD** `rwuxgvld` «*senza la distinzione che oggi è regola dura*» | H1-§4-2 | **1** |
| metà maggio | Autorizza «*Applica via MCP ora*» **prima** della lezione TEST≠PROD — «*impara correggendo, non prevenendo*» | G2-§4-3 | 3 |
| **fino al 29-05** | Chiede ancora chiarimenti su come non confondere i due database | H2-CE2 | **1** |
| febbraio | «*capisce l'obiettivo ma sbaglia l'esecuzione*» | H4-C02 | **1** |
| — | Inserisce dati in dev e non li vede su Vercel | A2-§4-2 | 3 |
| — | Policy/CASCADE via SQL diretto su TEST senza migrazione nel repo | M2-§4-5 | 3 |

**La regola oggi regge.** È scritta in quattro file, S4 la conferma `L4`, e la sua frase originale è
di peso 1: «*Se risponde `rwuxgvld` fermati*» `[1 · H2-D05]`, 22-05. **Quello che non regge è la
parola «originaria».**

**Per il ritratto questo non è un difetto, ed è il punto in cui D1 e G1-D14 si toccano.** La
competenza che esercita di più è **appresa per correzione**. Il che vuol dire che
l'auto-descrizione «principiante» **aveva una base reale** al momento in cui è stata scritta, e che
la distanza fra le due colonne **si è aperta nel tempo**. La tensione non sparisce: cambia forma.
Resta mostrata, non risolta.

### §4.3 — D2: la scuola è stata progettata una volta e mai frequentata, e le prove sono due

1. `[3 · G1-§4-2]` coda spaced-repetition **vuota**, glossario **tutto 🌱**, storico richiami vuoto,
   **una sola** «Lezione della chat» (04-06).
2. `[3 · E1-§4-5]` — **la seconda prova, indipendente, che nessuno aveva collegato**: la stessa
   scuola copiata sul progetto di trading è vuota anche lì, «*tutte 🌱, zero lezioni*».

S4 declassa il ramo da L3 a L2: «*un sistema progettato una volta e mai frequentato, in due
progetti, non è L3*». Il **perché** non è nel corpus e non lo deduco.

### §4.4 — D3: corregge moltissimo, codifica quasi mai

**Dopo S4 il ramo UX ha 18 L3 contro 1 sola L4.** È l'opposto esatto degli ambienti, dove ha **una**
regola scritta in **quattro** posti. La contro-evidenza che ha fatto cadere «Mockup HTML prima delle
scelte UX» da L4 a L3 è `[3 · A10-§4-3]`: «*micro-loop UI **senza mockup** — digest prezzi/tipografia,
card categoria, mobile admin: **2–4 iterazioni***». Cioè la regola non è stata applicata dove sarebbe
servita. E `[1 · H5-D38]` (06-07) la ribalta esplicitamente su un altro progetto: «*lasciamo da parte
HTML… sarò io a chiedere*».

### §4.5 — D6: l'unica in cui le due colonne concordano

Concordano su un livello basso, **e concordano perché è vero**: le correzioni sue sul codice sono
**3 su 381 — lo 0,8%** `[3 · S2]`. La sola riga di peso 1 è di febbraio, su un gioco
`[1 · H4-A04]`. Qui l'auto-descrizione non è né sotto né sopra il comportamento.

---

## §5 — Cosa i file NON dicono

Questa sezione esiste per proteggere Matteo da un ritratto che sembra completo e non lo è. **Le
prime quattro sono obbligatorie e verificate.**

### (a) Il motivo del ritorno su CalendarBackup ad agosto

**Non è dichiarato né in H3 né in H5.** H5 ha cercato attivamente (grep su
`calendarbackup`/`ristorante`/`servizio`/`torno`) e conclude: «*nessuna dichiarazione… **non
inventare motivazione***» `[1 · H5-§4-6]`. Nel testo verso di lui lo ripete: «*in queste chat **non
lo dici***». H5 rimanda ad A11/H3/J1; nessuno dei tre lo dice. **Non lo invento.**

### (b) Metà dei dialoghi non è leggibile, e le correzioni verso di lui sono sotto-contate

**19.198 righe su 22.862** del testo degli agenti sono oscurate. La conseguenza misurata è in
S2 §0: **sulla linea H le `A→M DIRETTA` sono zero su cinque finestre**. Tutte le correzioni verso di
lui che compaiono nel §3.6 sono `DEDOTTE`. **Il numero di volte in cui un agente lo ha corretto, in
questo materiale, non è misurabile — è strutturalmente inferiore al vero.**

### (c) I file con nomi di credenziali non sono mai stati aperti, per scelta

`[3 · G3 §5]`: sotto `e2e-s4/` esistono file nome-`creds` / `.env`, letti «*path only, contenuto non
letto né citato*» — **3 path non aperti** per sensibilità. Nelle H, i **M-VOCE** con
`has_secret=true` sono stati **letti ma mai citati**: 47 in H1 (su 84 messaggi con secret nel
periodo), 9 in H2, 12 in H3, 11 in H4, 4 in H5. **Quello che c'è dentro non entra in nessun ritratto,
e non è un buco casuale: è una scelta dichiarata.**

### (d) Quello che il corpus non contiene affatto

Il corpus è fatto di prompt di lavoro, report di sessione e file di progetto. **Non contiene vita
fuori dal lavoro, contesto personale, motivazioni, relazioni, salute, tempo, denaro personale.**
Non c'è una sola riga su questo, e **l'assenza non va letta come un dato**: un corpus di chat di
programmazione non contiene una persona. Chiunque legga questo ritratto e ne deduca qualcosa sulla
vita di Matteo sta inventando. **Io non lo deduco e questo report non lo autorizza.**

### (e) Le tre assenze di S3 §8 che S4 ha verificato e che vanno corrette

**Non le eredito come erano scritte.**

| Assenza di S3 | Come va scritta adesso |
|---------------|------------------------|
| «nessuna manutenzione» | ❌ **Smentita.** La skill `prod-incident / prod-incident-response` **esiste** — A1 Sezione 3, livello **L2–L3**, con il file `Report-incident-prod-impostazioni-bloccate.md`. Era sparita perché la regola sugli ibridi di S3 l'ha risolta a L2, e le L2 non entrano nel §9. **Ciò che resta vero: è manutenzione REATTIVA, non monitoraggio.** |
| «nessuna gestione economica» | ⚠️ **Da correggere.** `[3 · A7-D27]` (12-06-26, `MATTEO`, `SCELTA`): «*Budget legale anno 1 ≈ 1.500–2.500€*», skill `legal-budget`. **Sono due righe isolate, non una skill: la sostanza regge, il «nessuna» no.** |
| «nessun utente reale» | ⚠️ **Da precisare.** Un cliente reale **esiste ed è nominato** — «*Owner: Al Ritrovo - Bologna*» — e `[1 · H4-D38]` è lui che dice «*Al Ritrovo non perda dati dopo merge*». La formulazione giusta: **un cliente reale esiste e i suoi dati contano; nessun utente reale parla mai nel corpus.** Nessuna intervista, nessun test con utente, nessun feedback. |

### (f) Le tre assenze di S3 §8 che restano confermate

| Assenza | Che cosa resta vero |
|---------|--------------------|
| **Stima e pianificazione dei tempi** | **Zero righe.** Nessuna decisione su una scadenza, una stima o una capacità. Masterplan e milestone sono **sequenze**, non calendari. L'unica regola sul ritmo è «un WP per sessione, mai due» `[3 · G1-D39]`, che è **un freno, non una stima**. |
| **Design visivo autonomo** | **Presente solo come giudizio, mai come generazione.** 49 righe, tutte reattive. `[1 · H1-§4-5]` «*non è autonomia di design system, è controllo pixel-per-pixel*». **Sa dire che è sbagliato; non risulta che sappia dire come si fa.** |
| **Sicurezza applicativa oltre gli ambienti** | Il ramo più grosso parla di **PROD vs TEST, branch e rilascio**. Le RLS esistono, ma il conflitto **N-1** è aperto: il rate limit dell'endpoint pubblico ha **due valori incompatibili** (3/ora vs 5/minuto), entrambi `INCERTO`. **La sicurezza che esercita è quella del processo.** |

### (g) Due cose che questo ritratto non ha potuto misurare

- **Quanto poggia su una fonte sola.** S4 §5 lo ha misurato per l'albero: **82 righe su 153, il
  53,6%** delle skill L3/L4 poggia su una fonte sola. In questo report l'unico asse a fonte quasi
  unica è il **§3.5**, ed è dichiarato in testa all'asse. Gli altri sei poggiano su almeno tre
  ondate.
- **La lacuna che S4 gira esplicitamente a S5, e che resta aperta.** Il ribaltamento di agosto
  (A11: 8 correzioni dirette degli agenti verso di lui, il massimo delle undici ondate A; la sua
  quota al 45%, il minimo). Due letture — squadra più verificante *oppure* premesse ereditate più
  fragili — con **due contro-evidenze per lato, stessa ondata, stesso peso**. S4 lo dichiara:
  «*non è una domanda a cui i report possano rispondere, è una domanda **da fare a lui***». **Non la
  chiudo. Va all'interrogazione.**

---

## §6 — I rischi operativi che arrivano a questa ondata

**Sono scritti come rischi, non come colpe.** Tre dei cinque sono confermati da fatti oggettivi
(peso 2), cioè non dipendono da come un report li racconta.

| # | Rischio | Che cosa è dimostrato | Fonte |
|---|---------|----------------------|-------|
| 1 | **75 commit su `env/test` non in `main` dal 23-06**, e le migrazioni **063–071 mai arrivate in PROD** | Il cancello **ha funzionato** — è un fatto git, peso 2, non un'opinione. Il rischio è l'altro lato: **nessuno gli ha più chiesto di riaprirlo.** S2 lo consegna come **debito, non come errore** | `[2 · J1-A03, J1-A05]` · `[3 · S2 §9.2]` |
| 2 | **La Console: accettata a fine giugno e mai rilasciata** | Il branch **non è antenato di `main`** e non è in PrenotaZen. S4 §8 corregge l'ipotesi del piano («abbandonata in 2 giorni»: **falsa**) e mostra che **il quadro vero è peggiore, non migliore**: non è stata abbandonata, è stata completata e non è mai uscita | `[2 · J1-D10]` · `[3 · S4 §8]` |
| 3 | **«Blindato» significa due cose diverse** | La stessa parola è stata usata per **due livelli di garanzia** — «blindato di prodotto, LIVE in produzione» `[3 · G1-D21]` e «blindato su TEST» `[3 · S1 #17]` — **senza che nessuno se ne accorgesse sul momento** | `[3 · S2 §9.1]` |
| 4 | **Gli esiti dei test non sono mai stati riverificati da nessuno** | Il **95,5% di accettazione è auto-dichiarato**, e **sei ondate** documentano almeno un esito dichiarato falso. Il caso più grande: «*MASTERPLAN «E2E shell 20/20» **falso**: esecutore corretto (19+1 skip)*» | `[3 · L-S4-2]` · `[3 · A5-§4-3]` |
| 5 | **Igiene dei segreti** | **77 file di `docs/_lavoro` tracciati da git** — inclusi documenti legali e la valutazione del prezzo di vendita · un **Personal Access Token finito nella git history** · il kit esposto **~2 settimane** su repo pubblico · credenziali in chiaro nei corpora legacy · file `creds`/`.env` su disco sotto `e2e-s4/` | ⚠️ **consegnato dal mandato S5**; la fonte primaria è **P0 §7 · J1**, che non sono nel perimetro di questa ondata e **non sono stati riaperti**. L'unica parte verificata qui è l'ultima: `[3 · G3-§4-5]` e `[3 · G1 riga 5]` (10/51 file di `Per matteo` tracciati) |

> ⚠️ **J1 non è nel perimetro di S5 e non è stato riaperto.** I due fatti di peso 2 dei rischi 1 e 2
> arrivano **attraverso** S2 §9.2 e S4 §8, che li citano per ID. Sono peso 2 all'origine, ma qui sono
> letti di seconda mano: chi li ricontrolla deve aprire J1, non questo report.

**Il rischio 5 va letto insieme a una sua regola**, perché è la stessa materia vista dai due lati:
`[3 · M1-D54]` «*tiene `docs/_lavoro/` privata apposta; molto sensibile*». **La regola c'è;
l'esecuzione ha 77 eccezioni.**

---

## §7 — Lacune di S5 e handoff

### §7.1 — Lacune aperte da questa ondata

| ID | Lacuna | A chi va |
|----|--------|----------|
| **L-S5-1** | **La tabella «Numeri di ritmo» di H1 non esiste** (§2.1). I suoi numeri stanno in prosa e sono usabili, ma **nessun conteggio automatico sulle cinque H può essere ricontato senza questa eccezione** | S6 — nota metodologica |
| **L-S5-2** | **`date_src` non è dichiarato in H4** (§2.3), quindi l'affidabilità delle date di febbraio-marzo non è misurata. Tutte le date di H4 usate qui vengono dai testi, non dal filesystem | S6 / interrogazione |
| **L-S5-3** | **`spiegamelo` ha zero occorrenze in tutte e quattro le H che lo cercano** (§3.5), mentre la regola su come vuole che gli si parli è scritta due volte. **Il perché non è nel corpus.** | interrogazione |
| **L-S5-4** | **Il ribaltamento di agosto resta indeciso** (§5g). S4 me lo gira dichiarando che i report non possono rispondere | **interrogazione** |
| **L-S5-5** | Il registro duro della linea H contro l'ammorbidimento della linea A (conflitto **I-6**) non è quantificato: nessuna ondata ha contato le occorrenze | S6 |

### §7.2 — Conflitti che NON ho chiuso, come da mandato

`T01 / N-5` (limite coperti: errore o cambio di modello) · `N-3` (autonomia del mandato «educare
Matteo») · `N-2` (listino 12-06: 79 o 69) · `N-1` (rate limit 3/ora o 5/minuto) · `I-4` (prezzo
carosello) · `I-5` (overlay ingredienti: sovra-narrazione di A) · `I-8` (autore git ≠ autore codice)
· `I-11` (migrazione 041 applicata o no). **Sono di S6 e dell'interrogazione.**

### §7.3 — Che cosa consegno a S6

| Cosa | Perché serve |
|------|--------------|
| **Il censimento §2, con le tre varianti di header e l'assenza in H1** | È il primo censimento delle tabelle satellite. S1, S2 e S3 le avevano censite senza normalizzarle |
| **L'avvertenza §0, doppia** | Va **in testa al dossier**, accanto a quelle di S3 e S4, non in nota |
| **§4.2 — la sicurezza degli ambienti è appresa per correzione** | Cambia la forma della tensione centrale senza risolverla, ed è il dato più pesante che arriva a S5 |
| **§3.5 con i suoi tre caveat** | È la fonte più forte sul «come vuole che gli si parli» **ed è quasi una fonte sola** |
| **§5(d)** | Il corpus non contiene una persona. Va detto nel dossier finale, non solo qui |
| **Le cinque lacune L-S5-1…5** | Quattro su cinque sono domande per lui, non per i file |

---

## §8 — Numeri e criterio di fatto

I conteggi completi (citazioni usate per peso e per asse, righe in ingresso per fonte, forma delle
tabelle di ritmo, tre unità di copertura separate) sono in **`_stato/S5.md`**, come chiede il piano
§6. Qui l'autocontrollo sul criterio di fatto del mandato:

| Criterio | Esito |
|----------|-------|
| Ogni riga di ogni asse ha citazione, fonte e **peso dichiarato** | ✅ notazione `[1 · …]` / `[3 · …]` / `[1* · …]` in tutti e sette gli assi |
| Ogni asse dichiara se poggia su una fonte sola | ✅ sei dichiarano «non poggia su una fonte sola»; **§3.5 dichiara di sì**, in testa all'asse |
| Le tabelle «Numeri di ritmo» **censite prima** di essere usate, varianti dichiarate | ✅ §2 — **3 varianti + 1 assenza (H1)**, 4 righe malformate in H4, script ricontabile |
| Media e mediana mai confuse | ✅ §2.4 dichiara la regola; §3.7 usa la **mediana** e marca ogni media come «(dichiarata)» |
| Le due sezioni obbligatorie esistono | ✅ §4 e §5 |
| §5 contiene almeno (a)(b)(c)(d) più le tre corrette di S3 §8 | ✅ (a)…(d) + §5(e) con le tre corrette + §5(f) con le tre confermate |
| La tensione auto-descrizione/comportamento è **mostrata e non risolta** | ✅ §4 — G1-D14 è mostrata al §4, riscritta di forma al §4.2, **mai risolta** |
| Nessun aggettivo fuori da una fonte · nessuna diagnosi | ✅ ogni qualificazione sta dentro caporali o è un conteggio |
| Nessuna narrazione di crescita dell'agency | ✅ la quota è piatta (65% linea A, 75% ±5 linea H) e non è mai presentata come curva |
| Il buco estivo non è trattato come una pausa | ✅ §3.7 — cambio di progetto, con i quattro progetti e le loro date |
| Conflitti aperti non chiusi | ✅ §7.2, otto elencati |
| Niente dedotto sulla vita fuori dal lavoro | ✅ §5(d) lo vieta esplicitamente |

---

## §9 — Tre righe verso Matteo

**1. Le parole con cui apri e chiudi sono contate, e hanno due date diverse.** `controverifica` è del
**24 febbraio**, e nello stesso messaggio chiedi di scriverla dentro una skill: «*aggiungi al file di
skills di controverificare con screen*». `lavoro ok` è del **29 maggio** e compare **2 volte** quel
mese; nei due mesi dopo compare **77 volte**. `blindatura` e `senior` nascono lo stesso giorno, il
**4 giugno**: 60 e 49 occorrenze. `spiegamelo`, che è la parola con cui hai deciso come vuoi che ti
si parli, compare **zero volte** in tutte le chat lette.

**2. La forma della correzione è una sola, e si conta.** «Torna a com'era»: **quindici righe**, tutte
parole tue dirette, dal logo di aprile al logo di luglio su un altro prodotto. Sul codice, in sei
mesi, sei intervenuto **3 volte su 381** correzioni. Quando l'errore è tuo lo scrivi — «*ho
sbalgiato*» (2 marzo), «*scusami*» (maggio), «*scemo io, non avevo riavviato*» (2 giugno), «*non
serve, avevo deciso male*» (11 giugno), «*scusa scemo io*» (20 giugno). Sono **cinque volte in sei
mesi**, tutte riportate qui: non perché siano poche, ma perché sono tutte quelle che ci sono.

**3. Quello che questo ritratto non può dirti è quante volte qualcuno ha corretto te.** Di ogni
conversazione si legge una metà: **19.198 righe su 22.862** del testo degli agenti sono oscurate, e
sulla linea delle chat le correzioni dirette verso di te risultano **zero su cinque finestre
temporali** — non perché non ci siano state, ma perché la riga che le conterrebbe non è leggibile.
Prima di credere a qualunque riga di sopra, questa va letta per prima.
