# Piano — Indagine sulle skill individuali di Matteo

> **Questo file è la fonte di verità del cantiere.** Sostituisce il riferimento a
> `.cursor/plans/indagine_skill_matteo_c67db55c.plan.md`, che **non esiste su disco** (verificato
> 06-08-26: 144 piani in `.cursor/plans/`, nessun match). Ogni prompt punta a questo file.
>
> **Prompt operativi:** [00_PROMPTS_SEQUENZA_TRACKING.md](00_PROMPTS_SEQUENZA_TRACKING.md)

---

## §0 — Prompt iniziale di Matteo (verbatim, da mantenere in testa)

> ho bisogno che fai un indagine.
> lo scopo di questa indagine è di determinare le skill individuale su cui IO matteo ho lavorato
> costruendo quest'app AI assisted.
> cerca in tutti i file anche in archivio, le MIE decisioni.
> cataloga le mie decisioni per tipologia : prodotto, strategie ( testing , soluzione conflitti,
> vendita, impostazioni, flusso utente e dati, tutto ciò che riesci a determinare )
> capisci nei report di agenti cosa gli ho chiesto io e cosa ho gestito attivamente.
> quando ho corretto io agenti e quando mi hanno corretto perchè ero io fuori strada.
> individua attivamente altri elementi importanti al fine di aiutarmi a determinare cosa ho imparato,
> su cosa ho lavorato realmente ( IA, software developing, product specialist , non è importante che
> siano coerenti, è ipmortante capire che albero di skill ho coltivato ) .
> cerca anche report di agenti e agentis enior che descrivono mie caratteristiche individuali
> psicologiche o metodologiche.
> prepara un plan di analisi approfondita della repo, poiche sarà un lavoro lungo da completare in
> piu fasi di analisi. gli agenti analizzerannoa fondo porzioni di file, e produrranno un report
> dettagliato e approfondito che permetterà poi una completa ricostruzione dei lavori e del mio
> profilo durante i lavori, per cpaire dove sono cresciuto cosa ho fatto autonomamente , cosa ho
> imparato .
> in seguito al copmletamento di questo plan, userò la documentazione per ricostruire i fatti e farmi
> interrogare con agente senior, per confermare e validare le mie skill e copmetenze, e tirare le
> somme su chi sono dopo aver lavorato a questo progetto nella complessità della mia persona sotto
> ogni aspetto.
> mantieni all'inizio del plan il mio prompt iniziale ( questo che ti ho inviato)

---

## §0b — Decisioni di Matteo sul metodo (06-08-26)

| # | Domanda | Decisione |
|---|---------|-----------|
| 1 | Prompt preparati da un agente e incollati da Matteo | **Contano separati, come regia.** Due colonne distinte: parole sue vs prompt che ha scelto e incollato. Il secondo è skill di direzione, non di scrittura. |
| 2 | Allocazione sforzo | **Copertura totale ovunque.** Nessuna linea di corpus viene saltata. |
| 3 | Corpora extra | **Inclusi tutti**: MathBoy2 + Game, Qwen-Test / harness modelli locali, i 144 piani in `.cursor/plans`. |
| 4 | Verdetto finale | **Livello + contro-evidenze**, ma i livelli restano **provvisori**: si confermano nella chat di interrogazione senior finale. |

> Conseguenza della #2: copertura totale **non** significa profondità uniforme. Significa che ogni
> file del perimetro viene **aperto e dichiarato**, con due regimi di estrazione (§3.5): `scavo` dove
> la densità di segnale su Matteo è alta, `rastrello` dove è bassa. Nessun file resta non visto.

---

## §1 — Che lavoro è, e chi lo esegue

Non è un lavoro di codice. Il ruolo è **analista forense di corpus + valutatore di competenze**.
Il deliverable finale non è un riassunto: è un **dossier che deve reggere a un interrogatorio**,
dove ogni affermazione su Matteo è tracciabile a una fonte e ogni skill rivendicata ha accanto il
punto in cui quella stessa skill è fallita.

**Gerarchia probatoria** (in caso di conflitto tra fonti, vince la più alta):

| Peso | Fonte | Perché |
|------|-------|--------|
| **1 — primaria** | Parole di Matteo verbatim e datate (transcript `<user_query>`, linea H) | È lui che parla, non qualcuno che lo riassume |
| **2 — oggettiva** | Fatti verificabili: commit, migrazioni applicate, test verdi, rilasci (linea J) | Distingue «ha deciso» da «è successo davvero» |
| **3 — secondaria** | Report scritti da agenti *su* Matteo (linee A, B–F, G) | Utili ma già interpretati, e scritti da chi aveva interesse a compiacerlo |
| **4 — terziaria** | Sintesi già esistenti (OSSERVAZIONI, EVOLUZIONE_SKILLS, dossier senior) | Sono ipotesi da verificare, non prove |

**Regola di conflitto:** se un report (peso 3) dice «Matteo ha deciso X» ma il transcript (peso 1)
mostra che X era già nella proposta dell'agente e lui ha solo approvato → vale il transcript, e la
decisione si classifica `APPROVATA`, non `ORIGINATA`.

---

## §2 — Mappa dei corpora (conteggi verificati 06-08-26)

| Linea | Corpus | Path | Volume reale | Peso probatorio |
|-------|--------|------|--------------|-----------------|
| **A** | CB-v2 sessioni pubbliche | `docs/Sessioni di lavoro/` | **461 md** · 4,6 MB · 223 con schema Q1 · 2.846 occorrenze «Matteo» | 3 |
| **M** | Meta / comunicazione CB-v2 | `docs/Comunicazione-Skill/` + `docs/Archivio/CONTESTO_PRODOTTO.md` + `_skill-system-v0/` | **13 md** · 2.543 righe | 3–4 |
| **B** | BHM-Zen (HACCP recente) | `docs/Archives/docs/` | **228 md** (app-definition 138 · skill-system 42 · meta 42 · guide 3 · root 3) | 3 |
| **C** | HACCP legacy | resto di `docs/Archives/` | **385 md** (cleanup 89 · Sessions_Old 67 · knowledge-legacy 60 · Tests 58 · Info_Complete 47 · Knowledge 25 · cursor-rules 24 · misc ~15) | 3 |
| **D** | CalendarBackup vecchia | `docs/Archives/Calendarbackup-oldversion/` | **132 md** (docs 86 · Lavoro 26 · Sessioni 20) | 3 |
| **E** | Trading agent v.0 | `docs/Archives/trading agent analyst-v.0/` | **128 md** (docs 97 · reports 30 · root 1) | 3 |
| **F** | FREEDOM Trading | `docs/Archives/Trading agent analysy/` | **85 md** (docs 84 · root 1) | 3 |
| **G** | Lavoro privato | `docs/_lavoro/` | **119 md** (Sessioni 56 · Per matteo 51 · Storico 8 · Supporto 3 · e2e-s4 2) | 3, con eccezione: PROFILO_SCOLASTICO è auto-dichiarazione → peso 1 per «cosa dice di sé», peso 4 per «cosa sa fare» |
| **H** | Transcript Cursor | `C:\Users\matte.MIO\.cursor\projects\*\agent-transcripts\` | **CB-v2: 504 chat, 3.293 messaggi suoi**. Altri: MathBoy2 375 · Calendarbackup 98 · Trade-Analyst 96 · Game 92 · Trading-Platform 69 · BHM-v-2 52 · BHM-Zen 18 · Qwen-Test 2 → **totale ~4.095** | **1** |
| **I** | Piani | `C:\Users\matte.MIO\.cursor\plans\` (144) + `C:\Users\matte.MIO\.claude\plans\` (2) | **146 file** · 2 MB · da gennaio a giugno 2026, su tutti i progetti | 2–3 |
| **J** | Fatti oggettivi | `git log`, migrazioni, release, test | — | **2** |

### §2.1 — Limiti noti del materiale (dichiarati, non scoperti a metà lavoro)

1. **Il testo degli agenti è oscurato.** Nei transcript CB-v2, **19.198 righe su 22.862** dei
   messaggi assistant contengono `[REDACTED]`. Conseguenza operativa: la domanda *«quando mi hanno
   corretto perché ero fuori strada»* **non** è rispondibile leggendo la risposta dell'agente. Va
   ricostruita per via indiretta:
   - dai file .md (`ERRORI_PROCESSO.md`, report di sessione, controverifiche);
   - dalle **coppie di messaggi consecutivi di Matteo** (`user[n]` → `user[n+1]`): quando il secondo
     contiene una resa, un cambio di rotta o un «ah giusto», l'agente lo ha corretto nel mezzo.
   Ogni correzione agente→Matteo dedotta così va marcata `DEDOTTA`, mai `DIRETTA`.
2. **Molti «messaggi utente» non sono parole sue.** Almeno 170 messaggi CB-v2 contengono `Profilo:`
   → sono prompt preparati da un agente e incollati. Vanno classificati (§3.3), mai contati come
   scrittura sua.
3. **`docs/_lavoro/` è in `.gitignore` ma 77 file sono già tracciati da git** (il gitignore non vale
   sui file già aggiunti). Include `Documenti Legali/` e `Valutazione prezzo vendita/`.
   `Per matteo/Scuola/` **non** è tracciata (davvero privata). La distinzione «privato vs pubblico»
   nel dossier finale va basata su `git ls-files`, non sull'assunzione del gitignore.
4. **I transcript CalendarBackup-v2 coprono 27-04 → 06-08**, quindi includono il maggio precoce che i
   report pubblici (da 23-05) non hanno.

### §2.2 — Cronologia vera dei progetti (misurata sul corpus, 06-08-26)

L'estrazione P0-EX ha **smentito due assunzioni** del piano iniziale. Correzioni:

| Periodo | Cosa succedeva davvero | Messaggi di Matteo |
|---------|------------------------|--------------------|
| **feb 2026** | CalendarBackup vecchia (dal 21-02) + MathBoy2 | 26 |
| **mar 2026** | MathBoy2 (367), Game (91), CB-old + worktree, Qwen-Test | 608 |
| **27-04 2026** | **nasce CalendarBackup-v2** | 17 |
| **mag 2026** | CB-v2 al picco assoluto (1.748 M-VOCE) **e in parallelo** Trade-Analyst | 2.326 |
| **giu 2026** | CB-v2 (762) + Trade-Analyst (72) | 1.014 |
| **lug 2026** | **BHM-v2, BHM-Zen, Trading-Platform** — CalendarBackup fermo | 138 |
| **ago 2026** | ripresa CB-v2 (capitolo Servizio) | 28 |

**Due correzioni che cambiano la narrazione:**

1. **Il buco 22-06 → 02-08 non è una pausa.** A luglio lavorava su BHM e Trading-Platform. Non ha
   smesso: ha **cambiato progetto**. Chi scrive la timeline (S3) non deve leggerlo come
   un'interruzione, ma come uno spostamento di fuoco.
2. **Il trading non viene dopo CalendarBackup: è contemporaneo.** Trade-Analyst gira in parallelo a
   maggio-giugno, nel periodo più denso di CB-v2. La sequenza «HACCP → CB-old → CB-v2 → Trading →
   giochi» è **falsa**. La sequenza vera è: giochi e CB-old (feb-mar) → CB-v2 (da fine aprile) →
   trading in parallelo (mag-giu) → BHM e Trading-Platform (lug) → ritorno a CB-v2 (ago).
   Gestire più progetti in parallelo è di per sé un dato sul suo modo di lavorare: da verificare in S5.

> Attenzione al limite: solo il **20%** dei messaggi CB-v2 ha un timestamp proprio; sul resto vale la
> data di ultima modifica della chat. Le date a livello di mese sono affidabili, quelle a livello di
> giorno no. Non costruire ragionamenti su singole giornate usando la linea H da sola: incrociale con A.

---

## §3 — Metodo (la parte che rende fondibili 43 report scritti da agenti diversi)

### §3.1 — Schema dato obbligatorio

Ogni ondata di mining produce **un** report con **queste sette sezioni, in quest'ordine, con queste
colonne**. Un report che cambia le colonne rompe la fase di sintesi e va rifatto.

**Sezione 1 — Decisioni** (una riga = una decisione)

| Campo | Valori ammessi |
|-------|----------------|
| `ID` | `<ID-ondata>-D01`, `-D02`… (es. `A4-D07`) — mai numerazione globale, evita collisioni tra agenti paralleli |
| `Data` | `gg-mm-aa` o `?` |
| `Tipo` | `PRODOTTO` · `FLUSSO` (utente/dati) · `IMPOSTAZIONI` · `TESTING` · `CONFLITTI` · `VENDITA` · `AI-METODO` (skill system, prompt, agenti) · `SICUREZZA` (ambienti/DB) · `UI-UX` · `COMPLIANCE` · `LEGALE` · `FORMAZIONE` · `PROCESSO` · `ALTRO` |
| `Oggetto` | ≤ 12 parole, concreto |
| `Chi` | `MATTEO` · `AGENTE` · `CONGIUNTA` · `INCERTO` |
| `Autonomia` | `ORIGINATA` (nasce da lui, non era sul tavolo) · `SCELTA` (sceglie tra opzioni proposte) · `APPROVATA` (ratifica una proposta) · `CORRETTIVA` (ribalta una scelta già presa) · `DELEGATA` (lascia decidere all'agente) |
| `Fonte` | `path/relativo.md` + riga o titolo di sezione. Obbligatorio. |
| `Citazione` | ≤ 25 parole, verbatim, tra virgolette. Se non c'è citazione → `Chi = INCERTO` |
| `Skill` | etichetta breve, riusabile (es. `product-scoping`, `test-strategy`, `env-safety`) |

**Sezione 2 — Agency e correzioni**

| Campo | Valori |
|-------|--------|
| `ID` | `<ID-ondata>-A01`… |
| `Direzione` | `M→A` (Matteo corregge l'agente) · `A→M` (l'agente corregge Matteo) · `M↔M` (cambia idea da solo) |
| `Tipo prova` | `DIRETTA` (citazione esplicita) · `DEDOTTA` (§2.1 punto 1) |
| `Cosa` | ≤ 20 parole |
| `Esito` | `accettata` · `rifiutata` · `parziale` · `ignota` |
| `Fonte` | path + riga |

**Sezione 3 — Skill signals** — vedi scala §3.4.

**Sezione 4 — Contro-evidenze** — obbligatoria, mai vuota senza motivazione. Dove nel perimetro
Matteo ha sbagliato, delegato, cambiato idea per errore, o si è fermato davanti a qualcosa.
*Se un'ondata non trova nessuna contro-evidenza, deve scrivere perché.*

**Sezione 5 — Copertura dichiarata** — `file nel perimetro: N` / `file aperti: N` / `% ` /
`file illeggibili o saltati + motivo`. Numeri veri, contati con `find`. Niente «ho letto tutto».

**Sezione 6 — Lacune e handoff** — cosa manca, e a quale ondata serve.

**Sezione 7 — Chiusura verso Matteo** — 3 righe in linguaggio semplice, per schermate e flussi
concreti, senza nomi di file isolati.

### §3.2 — Anti-allucinazione

- Nessuna riga senza `Fonte`. Nessuna eccezione.
- Se non è chiaro chi ha deciso → `INCERTO`. È un risultato valido e utile, non un fallimento.
- Vietato inferire uno stato d'animo, una motivazione o un tratto di carattere non scritto.
- Vietato attribuire a Matteo decisioni puramente tecniche prese dall'agente (scelta di una libreria,
  nome di una funzione) solo perché lui ha approvato il risultato.

### §3.3 — Regola di attribuzione (decisione #1 di Matteo)

Ogni messaggio di Matteo nei transcript riceve **una** etichetta:

| Etichetta | Cos'è | Come si riconosce | Conta come |
|-----------|-------|-------------------|------------|
| `M-VOCE` | Parole sue | tutto il resto | **scrittura e pensiero suoi** |
| `M-REGIA` | Prompt preparato da un agente, che lui ha scelto e incollato | contiene `Profilo:` + (`Modalità:` \| `Skill da leggere:` \| `Output attesi:`) | **direzione/orchestrazione**, non scrittura |
| `M-PASTE` | Output, errori, log, file incollati | blocchi ```, stack trace, `npm ERR`, `PASS/FAIL`, solo `@riferimenti` | contesto, non decisione |
| `M-OK` | Approvazione o comando secco | ≤ 60 caratteri e nel vocabolario comandi (`lavoro ok`, `procedi`, `fai report finale`, `si`, `ok`) | **ratifica**, segnale di ritmo |

Nel dossier finale le due colonne restano **separate e conteggiate**: «X messaggi di voce propria,
Y prompt diretti». Non si sommano mai.

### §3.4 — Scala di livello skill (provvisoria, da confermare in interrogazione)

| Livello | Significato | Prova richiesta |
|---------|-------------|-----------------|
| **L0 — nominata** | Ne parla, non risulta averla agita | 1 citazione |
| **L1 — eseguita con guida** | Ha fatto la cosa, ma la proposta e i criteri erano dell'agente | 1 decisione `APPROVATA` |
| **L2 — decisa da solo** | Ha scelto tra alternative con un motivo suo, o ha originato la richiesta | 1 decisione `SCELTA` o `ORIGINATA` + citazione del motivo |
| **L3 — ha corretto l'agente** | Ha visto un errore che l'agente non vedeva, nel merito | 1 agency `M→A` accettata |
| **L4 — ha codificato la regola** | La sua decisione è diventata regola riusata (skill, vocabolario, processo, checklist) | decisione + il file di regola che ne è nato |

**Regola dura:** ogni skill dichiarata **L3 o L4** deve avere in sezione 4 almeno una
**contro-evidenza cercata attivamente**, oppure la dichiarazione esplicita «cercata, non trovata,
in questo perimetro». Senza questo il livello decade a L2.

### §3.5 — Due regimi di estrazione (copertura totale ≠ profondità uniforme)

| Regime | Dove | Cosa fa l'agente |
|--------|------|------------------|
| **scavo** | linee A, M, G, H, I, J e le parti «owner/meta» di B | Legge il file intero. Estrae tutte le decisioni, agency, citazioni. |
| **rastrello** | linee C, D, E, F e `app-definition` di B | Apre **ogni** file, ma estrae solo: decisioni con Matteo esplicitamente nominato, decisioni owner, correzioni, lezioni apprese. Il resto viene contato e dichiarato, non riassunto. |

In entrambi i casi la sezione 5 dichiara i numeri: la copertura è **totale e misurata**.

---

## §4 — Le 44 ondate (di cui 1 già fatta)

Ondate tagliate sui **volumi reali**, non sul calendario: target ~40-50 file per ondata di scavo,
~80-100 per rastrello. Dipendenze minime, per massimizzare il parallelo.

### Fondamenta (sequenziali — bloccano tutto)

| ID | Cosa | Perimetro | Dipende da |
|----|------|-----------|------------|
| **P0** | Inventario e verifica conteggi A–J, lista file per ogni ondata | tutte le linee, solo indicizzazione | — |
| **P0-EX** | ✅ **FATTA il 06-08-26.** Estrazione meccanica → **4.157 messaggi** su 576 chat, classificati. Script: `tools/estrai_prompt.py`. Corpus: `docs/_lavoro/Indagine-Corpus/` (fuori git). Report: `report/P0EX_CORPUS_PAROLE_MATTEO.md` | linea H | — |

### Mining (parallele — 3–8 in contemporanea senza conflitti)

| ID | Perimetro | File | Regime |
|----|-----------|------|--------|
| **M1** | `docs/Comunicazione-Skill/` (13) + CONTESTO_PRODOTTO + `_skill-system-v0/` | ~16 | scavo |
| **A1** | Sessioni 23-05 → 26-05 | 42 | scavo |
| **A2** | Sessioni 27-05 → 29-05 | 51 | scavo |
| **A3** | Sessioni 30-05 → 01-06 | 46 | scavo |
| **A4** | Sessioni 02-06 → 05-06 | 40 | scavo |
| **A5** | Sessioni 06-06 → 10-06 | 38 | scavo |
| **A6** | Sessioni 11-06 + 13-06 | 29 | scavo |
| **A7** | Sessioni 12-06 (giornata più densa dell'intero progetto) | 63 | scavo |
| **A8** | Sessioni 15-06 → 16-06 | 41 | scavo |
| **A9** | Sessioni 17-06 → 19-06 | 32 | scavo |
| **A10** | Sessioni 20-06 → 24-06 | 36 | scavo |
| **A11** | Sessioni 02-08 → 06-08 | 40 | scavo |
| **B1** | `Archives/docs/` meta + skill-system + guide + root | 90 | scavo |
| **B2** | `Archives/docs/app-definition/` parte 1 (A→M) | ~69 | rastrello |
| **B3** | `Archives/docs/app-definition/` parte 2 (N→Z) | ~69 | rastrello |
| **C1** | `Archives/Sessions_Old/` | 67 | rastrello |
| **C2** | `Archives/2026-01-cleanup/` | 89 | rastrello |
| **C3** | `Archives/knowledge-legacy/` + `Knowledge/` | 85 | rastrello |
| **C4** | `Archives/Tests/` + `Info_Complete/` | 105 | rastrello |
| **C5** | `cursor-rules-cleanup` + `References` + `2025-10-*` + `Reports` + `Archive` + `LEZIONI_APPRESE_AGENTE_1.md` | ~40 | scavo (alta densità lezioni) |
| **D1** | `Calendarbackup-oldversion/docs/` | 86 | rastrello |
| **D2** | `Calendarbackup-oldversion/Lavoro/` + `Sessioni di lavoro/` | 46 | scavo |
| **E1** | `trading agent analyst-v.0/docs/` | 97 | rastrello |
| **E2** | `trading agent analyst-v.0/reports/` + root | 31 | scavo |
| **F1** | `Trading agent analysy/` | 85 | rastrello |
| **G1** | `_lavoro/Per matteo/` (Scuola, Test e2e, Comandi, Fable, Legale, Prezzo, Blindature) | 51 | scavo |
| **G2** | `_lavoro/Sessioni/` 12-05 → 22-05 | 56 | scavo |
| **G3** | `_lavoro/Storico/` + `Supporto/` + `e2e-s4/` | 13 | scavo |
| **H1** | Corpus CB-v2, 27-04 → 15-05 | 1.032 M-VOCE | scavo |
| **H2** | Corpus CB-v2, 16-05 → 31-05 | 732 M-VOCE | scavo |
| **H3** | Corpus CB-v2, 01-06 → 06-08 | 780 M-VOCE | scavo |
| **H4** | Preistoria feb-mar: CB-old (+worktree), MathBoy2, Game, Qwen-Test | 634 msg | scavo |
| **H5** | Parallelo e luglio: Trade-Analyst (mag-giu), Trading-Platform, BHM-v2, BHM-Zen (lug) | 233 msg | scavo |
| **I1** | `.cursor/plans/` — piani CalendarBackup / BHM / prenotazioni | ~90 | rastrello |
| **I2** | `.cursor/plans/` — piani giochi/trading/altro + `.claude/plans/` | ~56 | rastrello |
| **J1** | Fatti oggettivi: `git log` completo, migrazioni, release, esiti test | — | scavo |

### Sintesi (sequenziali — ognuna legge solo i report, mai i file grezzi)

| ID | Cosa | Dipende da |
|----|------|------------|
| **S1** | Catalogo decisioni cross: fonde tutte le sezioni 1 in un'unica tabella, deduplica, tipizza | tutte le mining |
| **S2** | Agency e correzioni: fonde le sezioni 2, separa `DIRETTA`/`DEDOTTA`, traccia l'evoluzione nel tempo | S1 |
| **S3** | Albero skill + timeline, con livelli L0–L4 e confronto dichiarate (G) vs esercitate (A–F, I) vs parlate (H) | S1, S2 |
| **S4** | **Falsificazione**: per ogni skill L3/L4 cerca attivamente la contro-prova. Declassa quello che non regge | S3 |
| **S5** | Ritratto metodologico: solo clustering di citazioni, con sezione «cosa i file NON dicono» | M1, G1, H1–H4, S2 |
| **S6** | Dossier finale + banca domande per l'interrogazione senior | S1–S5 |

**Grafo delle dipendenze:** `P0 → {M1, A*, B*, C*, D*, E*, F*, G*, I*, J1}` · `P0-EX (fatta) → {H1..H5}`
· `tutte → S1 → S2 → S3 → S4`, `{M1, G1, H*, S2} → S5`, `{S1..S5} → S6`.

> Le ondate **H1–H5 sono già sbloccate**: il corpus esiste. Puoi farle partire anche prima di P0.

---

## §5 — Regole comuni a ogni ondata

1. **Profilo Verifica / Meta.** Sola lettura dei corpora. **Nessun file di `src/` va toccato.**
   Nessun file di Archives o `_lavoro` va modificato, spostato o «ripulito».
2. **Output solo** sotto `docs/Sessioni di lavoro/06-08-26/Indagine-Skill-Matteo/report/`.
   Il corpus grezzo dei transcript va **fuori da git**: `docs/_lavoro/Indagine-Corpus/`.
3. **Schema §3.1 obbligatorio.** Sette sezioni, colonne esatte.
4. **Anti-allucinazione §3.2.** Ogni riga ha una fonte, o non esiste.
5. **Sensibilità.** Si può leggere tutto (autorizzato), ma nei report **mai** copiare: chiavi API,
   `.env`, dati di clienti reali, testi di contratti, email personali. Si cita `path + sintesi`
   («esiste un DPA template per clienti», non il DPA).
6. **Path assoluti** per `_lavoro`, transcript e piani: Glob/Grep del workspace non li vedono.
7. **Niente output in più senza chiedere Sì/No prima.** Un'ondata produce **un** report e **un**
   file di stato. Nient'altro.
8. La modalità si può solo **alzare**, mai abbassare.
9. **Chiusura obbligatoria:** scrivere `_stato/<ID>.md` (§6) e le 3 righe verso Matteo.

---

## §6 — Tracking sicuro in parallelo

**Il problema:** se cinque agenti in parallelo spuntano la stessa riga dello **stesso** file, l'ultimo
che salva cancella il lavoro degli altri. Con l'editing a file intero è quasi garantito perdere spunte.

**La regola:**

- Ogni agente scrive **solo** il proprio file `_stato/<ID>.md` — un file per ondata, nessuna collisione.
- Il file `00_PROMPTS_SEQUENZA_TRACKING.md` **non viene toccato dagli agenti in corsa**. Le sue
  checkbox si aggiornano in blocco (da Matteo o da un'ondata leggera di allineamento) leggendo `_stato/`.
- `_stato/<ID>.md` è anche il **criterio di accettazione**: se mancano i numeri di copertura o il
  conteggio delle decisioni, l'ondata **non è fatta**.

---

## §7 — Cosa NON si fa

- Non si giudica «bravo / non bravo». Si assegnano livelli con prova e contro-prova.
- Non si committano segreti nei report.
- Non si riordina né si ripulisce Archives / `_lavoro`.
- Non si attribuiscono a Matteo decisioni tecniche dell'agente.
- Non si dichiara una copertura che non è stata contata.
- Non si conclude l'indagine con il dossier: il dossier **apre** l'interrogazione senior, non la chiude.
