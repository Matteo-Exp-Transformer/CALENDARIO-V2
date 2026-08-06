# Indagine Skill Matteo — Prompt in sequenza + tracking

> **Piano (fonte di verità):** [PIANO_INDAGINE.md](PIANO_INDAGINE.md)
> **Uso:** copia il blocco del prossimo prompt `⬜` in una chat Agent nuova. I blocchi sono corti di
> proposito: l'agente legge il metodo dal piano, così lo schema non si duplica e non va in deriva.
> **A fine ondata l'agente scrive SOLO** il suo report in `report/` e il suo file `_stato/<ID>.md`.
> **Non tocca questo file** (§6 del piano: cinque agenti in parallelo si cancellerebbero le spunte).
> Le checkbox qui sotto si aggiornano in blocco leggendo `_stato/` — a mano o con l'ondata `AGG`.

---

## Come si lavora in parallelo

1. **P0-EX e P0 sono già fatte** (06-08-26): il corpus delle tue parole esiste (H1–H5 già lanciabili) e
   l'inventario dei file per ogni ondata è verificato — vedi `report/P0_INVENTARIO_CORPUS.md`. P0 ha
   trovato 147 file di skill d'area attuali mai censiti (incl. un intero prodotto, `Console-Skill`):
   aggiunte le ondate **M2, M3, M4** su tua decisione (06-08-26).
2. Puoi partire direttamente dalle mining (M1-M4, A*, B*, C*, D*, E*, F*, G*, I*, J1): sono tutte
   sbloccate.
3. Apri **3–8 chat in contemporanea** pescando dalle mining: sono indipendenti tra loro.
   Non ci sono conflitti di scrittura: ogni ondata scrive due file suoi e basta.
4. Le **S** vanno in fondo, in ordine: leggono i report, mai i file grezzi.

---

## Stato rapido

### Fondamenta
- [x] **P0** — Inventario e verifica conteggi A–J — **fatta 06-08-26** — `report/P0_INVENTARIO_CORPUS.md`
- [x] **P0-EX** — Estrazione messaggi di Matteo — **fatta 06-08-26** — `report/P0EX_CORPUS_PAROLE_MATTEO.md` — 4.157 messaggi su 576 chat

### Mining — CalendarBackup-v2 (linee A, M)
- [ ] **M1** — Meta / Comunicazione / skill system (36 file — perimetro corretto da P0, includeva anche `_skill-system-v0/` e `APP_CONTEXT_SKILL.md` non contati prima)
- [ ] **M2** — Console-Skill: pannello super-admin gestione tenant (46 file — nuova, aggiunta 06-08-26 su decisione di Matteo dopo la scoperta P0)
- [ ] **M3** — Admin/Dashboard/Servizio/Database/Testing-Skill (41 file — nuova, aggiunta 06-08-26)
- [ ] **M4** — Legal/Marketing/UI/Prenota/Menu-QR-Skill + root docs (60 file — nuova, aggiunta 06-08-26)
- [ ] **A1** — Sessioni 23-05 → 26-05 (42)
- [ ] **A2** — Sessioni 27-05 → 29-05 (51)
- [ ] **A3** — Sessioni 30-05 → 01-06 (46)
- [ ] **A4** — Sessioni 02-06 → 05-06 (40)
- [ ] **A5** — Sessioni 06-06 → 10-06 (38)
- [ ] **A6** — Sessioni 11-06 + 13-06 (29)
- [ ] **A7** — Sessioni 12-06 (63 — giornata più densa del progetto)
- [ ] **A8** — Sessioni 15-06 → 16-06 (41)
- [ ] **A9** — Sessioni 17-06 → 19-06 (32)
- [ ] **A10** — Sessioni 20-06 → 24-06 (36)
- [ ] **A11** — Sessioni 02-08 → 06-08 (40)

### Mining — Archivi (linee B, C, D, E, F)
- [ ] **B1** — BHM-Zen meta + skill-system + guide (90)
- [ ] **B2** — BHM-Zen app-definition parte 1 (69)
- [ ] **B3** — BHM-Zen app-definition parte 2 (69)
- [ ] **C1** — HACCP legacy Sessions_Old (67)
- [ ] **C2** — HACCP legacy 2026-01-cleanup (89)
- [ ] **C3** — HACCP legacy knowledge-legacy + Knowledge (85)
- [ ] **C4** — HACCP legacy Tests + Info_Complete (105)
- [ ] **C5** — HACCP legacy lezioni + rules + misc (40)
- [ ] **D1** — CalendarBackup vecchia, docs (86)
- [ ] **D2** — CalendarBackup vecchia, Lavoro + Sessioni (46)
- [ ] **E1** — Trading v.0 docs (97)
- [ ] **E2** — Trading v.0 reports (31)
- [ ] **F1** — FREEDOM Trading (85)

### Mining — Privato, dialoghi, piani, fatti (linee G, H, I, J)
- [ ] **G1** — `_lavoro/Per matteo/` — Scuola, test, comandi, legale, prezzo (51)
- [ ] **G2** — `_lavoro/Sessioni/` 12-05 → 22-05 (56)
- [ ] **G3** — `_lavoro/` Storico + Supporto + e2e-s4 (13)
- [ ] **H1** — Parole di Matteo, CB-v2, 27-04 → 15-05 (1.032 M-VOCE)
- [ ] **H2** — Parole di Matteo, CB-v2, 16-05 → 31-05 (732 M-VOCE)
- [ ] **H3** — Parole di Matteo, CB-v2, 01-06 → 06-08 (780 M-VOCE)
- [ ] **H4** — Preistoria feb-mar: CB-old, MathBoy2, Game, Qwen (634 msg)
- [ ] **H5** — Parallelo e luglio: Trade-Analyst, Trading-Platform, BHM (233 msg)
- [ ] **I1** — Piani `.cursor/plans` + `.claude/plans` — prenotazioni / HACCP (112)
- [ ] **I2** — Piani `.cursor/plans` — giochi / trading / altro (33)
- [ ] **J1** — Fatti oggettivi: git, migrazioni, release, test

### Sintesi (in ordine, in fondo)
- [ ] **S1** — Catalogo decisioni cross
- [ ] **S2** — Agency e correzioni
- [ ] **S3** — Albero skill + timeline + livelli
- [ ] **S4** — Falsificazione / contro-evidenze
- [ ] **S5** — Ritratto metodologico
- [ ] **S6** — Dossier finale + banca domande senior

### Servizio
- [ ] **AGG** — Allineamento checkbox da `_stato/` (ripetibile quando vuoi)

---

## Regole comuni (valgono per ogni prompt, sintesi — il dettaglio è nel piano §5)

- Profilo **Verifica / Meta**. Sola lettura. **Nessun file `src/`.** Nessuna modifica a Archives o `_lavoro`.
- Report in `docs/Sessioni di lavoro/06-08-26/Indagine-Skill-Matteo/report/`. Stato in `_stato/`.
- **Schema §3.1 del piano obbligatorio** — 7 sezioni, colonne esatte, ID prefissati con l'ID ondata.
- Ogni riga ha una **fonte**. Chi non è chiaro → `INCERTO`. Mai inventare tratti o motivazioni.
- **Attribuzione §3.3**: parole sue (`M-VOCE`) ≠ prompt che ha incollato (`M-REGIA`). Mai sommarli.
- **Sensibilità**: leggi tutto, ma nei report mai chiavi, `.env`, dati clienti, contratti. Path + sintesi.
- **Path assoluti** per `_lavoro`, transcript, piani (Glob/Grep del workspace non li vedono).
- **Niente output in più senza chiedere Sì/No prima.** Un report + un file di stato. Basta.
- Chiusura: 3 righe verso Matteo in linguaggio semplice (schermate e flussi, non nomi di file).

---

## Fondamenta

### P0 — Inventario e verifica conteggi A–J ✅ FATTA 06-08-26

Non serve rilanciarla: report in `report/P0_INVENTARIO_CORPUS.md`. Ha corretto i conteggi di A, C, G,
ha ampliato la linea M (+147 file, nuove ondate M2/M3/M4 sotto) e ha ridefinito lo split I1/I2 reale.

```
Profilo: Verifica | Meta
Modalità: deep
Leggi prima: docs/Sessioni di lavoro/06-08-26/Indagine-Skill-Matteo/PIANO_INDAGINE.md (tutto)
Non caricare: src/; nessuna skill d'area
Output attesi: report/P0_INVENTARIO_CORPUS.md + _stato/P0.md — niente altro senza chiedere Sì/No

Obiettivo: rendere eseguibili le 44 ondate successive (41 previste + M2/M3/M4 aggiunte da questa
stessa ondata), verificando che i perimetri del piano §4 corrispondano al disco e producendo la lista
file concreta di ogni ondata.

Cosa fare:
1. Ricontare ogni linea A–J con find/ls (path assoluti per _lavoro, transcript, piani) e confrontare
   con la tabella §2 del piano. Segnalare ogni scostamento: il piano va corretto, non il conteggio.
2. Per OGNI ondata (M1, A1..A11, B1..B3, C1..C5, D1..D2, E1..E2, F1, G1..G3, I1..I2) produrre
   l'elenco file del perimetro. I1/I2: i 144 piani non hanno il progetto nel nome — aprire la prima
   riga di ognuno e assegnarlo al progetto, poi proporre la spartizione I1/I2.
3. Marcare i file high-signal: senior | meta | owner | decisioni | controverifica | dossier | lezioni
   | OSSERVAZIONI | PDR | masterplan | PROFILO_SCOLASTICO | Q1 | "Decisioni di Matteo".
4. Timeline grezza min/max per linea; segnalare i buchi temporali.
5. Verificare quali file di docs/_lavoro sono TRACCIATI da git (`git ls-files docs/_lavoro`) — serve
   alla nota «privato vs pubblico» del dossier finale.

Cosa NON fare: nessuna analisi di decisioni; nessuna modifica ai corpora; niente segreti nel report.

Criterio di fatto: conteggi verificati + lista file per ogni ondata + high-signal + buchi temporali.
```

### P0-EX — Estrazione meccanica dei messaggi di Matteo ✅ FATTA 06-08-26

Non serve lanciarla: il corpus **esiste già**. Report: `report/P0EX_CORPUS_PAROLE_MATTEO.md`.

Da rilanciare **solo** se aggiungi nuove chat e vuoi aggiornare il corpus:

```
cd "docs/Sessioni di lavoro/06-08-26/Indagine-Skill-Matteo/tools"
python estrai_prompt.py --dry-run    # conta e basta
python estrai_prompt.py              # riscrive il corpus in docs/_lavoro/Indagine-Corpus/
```

Lo script è documentato in testa al file. Se cambi le regole di classificazione, cambiale **lì** e
rigenera: non correggere le etichette a mano nei report, o il corpus e i report divergono.

---

## Mining — CalendarBackup-v2

### M1 — Meta / Comunicazione / skill system

```
Profilo: Verifica | Meta
Modalità: deep
Leggi prima: PIANO_INDAGINE.md §3 (schema, attribuzione, scala skill)
Perimetro (leggi TUTTO, regime scavo): docs/Comunicazione-Skill/ (13 file) + docs/Archivio/CONTESTO_PRODOTTO.md
 + _skill-system-v0/ (21 file) + docs/APP_CONTEXT_SKILL.md (file intero, non solo §0) — 36 file totali,
 perimetro corretto da P0 il 06-08-26 (il piano originale non contava _skill-system-v0/ né APP_CONTEXT_SKILL.md)
Non caricare: src/; Archives; _lavoro
Output attesi: report/M1_META_COMUNICAZIONE.md + _stato/M1.md — niente altro senza chiedere Sì/No

Obiettivo: qui vive il sistema che Matteo ha costruito per governare gli agenti. È la linea con la
densità più alta di segnale metodologico su di lui.

Focus specifico:
- VOCABOLARIO: ogni voce è una decisione di metodo. Chi l'ha proposta? Livelli di libertà 1/2/3: chi
  li ha tarati? ARCHIVIO_DECISIONI: cosa ha accettato e cosa ha RIFIUTATO (i rifiuti valgono doppio).
- OSSERVAZIONI + ARCHIVIO_OSSERVAZIONI: sono agenti che scrivono dati su di lui. Estrai le citazioni
  che descrivono come lavora, marcandole come fonte di peso 3 (qualcuno lo descrive, non lui).
- ERRORI_PROCESSO: chi ha sbagliato, in ogni voce. Questa è la miniera principale di agency A→M.
- EVOLUZIONE_SKILLS: il mandato «educare Matteo» e il playbook Meta senior — chi ha deciso cosa.
- CONTROVERIFICA / REVISIONE: metodi di qualità che ha imposto lui agli agenti.
- `_skill-system-v0/`: è il predecessore diretto di `Comunicazione-Skill/` — confronta cosa è
  sopravvissuto nel passaggio e cosa è stato abbandonato, è materiale diretto per S3 (frecce di
  trasferimento).

Attenzione: questi file sono già una sintesi (peso 4). Non prenderli come prova di ciò che è successo:
prendili come IPOTESI da confermare con A*, H*, J1. Marca le righe di conseguenza.
```

### M2 — Console-Skill: pannello super-admin gestione tenant

```
Profilo: Verifica | Meta
Modalità: deep
Leggi prima: PIANO_INDAGINE.md §3; report/P0_INVENTARIO_CORPUS.md §3 (perché questa linea è stata aggiunta)
Perimetro (leggi TUTTO, regime scavo): docs/Console-Skill/ — 46 file (masterplan, collaborazione,
 comunicazione, context, onboarding, plan-per-matteo, sessioni)
Non caricare: src/; Archives; _lavoro
Output attesi: report/M2_CONSOLE_SKILL.md + _stato/M2.md — niente altro senza chiedere Sì/No

Obiettivo: `Console-Skill` è un prodotto separato — un pannello super-admin per gestire i tenant
clienti (sandbox DB, allowlist auth, RLS, audit) — nato dentro questo stesso repo e mai censito dal
piano iniziale. Nella cartella `plan-per-matteo/` ci sono piani DB (tenant-sandbox, allowlist-auth,
edge-console-admin, rls-tenant-features, rls-admin-users, cascade-delete) presentati esplicitamente
"per Matteo": è materiale diretto di decisione owner su sicurezza/architettura multi-tenant.

Focus specifico:
- `MASTERPLAN_CONSOLE.md` + `MASTERPLAN_CONSOLE_REQ-001-003.md`: chi ha originato lo scope della Console
  e cosa è stato tagliato/allargato in corsa.
- `collaborazione/REGISTRO_RICHIESTE.md` + `richieste/REQ-00*`: sono richieste con owner nominato?
- `sessioni/DECISION_LOG.md` + `PHASE_AUDIT.md`: decisioni datate, materiale di prima scelta per S1.
- `plan-per-matteo/PLAN-DB-00*`: decisioni di sicurezza multi-tenant (RLS, allowlist, cascade delete) —
  confrontale col criterio di "sicurezza PROD" già visto nelle regole sempre attive del progetto.
- Verifica anche il branch `feature/console-super-admin` (git log), non solo `main`/`env/test`: la
  storia commit di questa cartella nella history principale copre solo 2 giorni (22-23 giugno).

Contro-evidenze da cercare attivamente: la Console è un prodotto nato E abbandonato in fretta (finestra
di 2 giorni sul branch principale)? Se sì, è materiale utile per S4 su "quanto scope inizia e non finisce".
```

### M3 — Admin / Dashboard laterale / Servizio / Database / Testing-Skill

```
Profilo: Verifica | Meta
Modalità: deep
Leggi prima: PIANO_INDAGINE.md §3
Perimetro (leggi TUTTO, regime scavo): docs/Admin-Skill/ (18) + docs/Dashboard-laterale-skill/ (3) +
 docs/Servizio-Config/ (5) + docs/Database-Skill/ (5) + docs/Testing-Skill/ (10) — 41 file totali
Non caricare: src/; Archives; _lavoro
Output attesi: report/M3_ADMIN_DB_TESTING_SKILL.md + _stato/M3.md — niente altro senza chiedere Sì/No

Obiettivo: sono le skill d'area che descrivono come è organizzata l'amministrazione (AdminShell,
sidebar), il capitolo "Servizio" (configurazione operativa), lo schema DB e la strategia di test
attuali — la versione distillata e mantenuta nel tempo delle decisioni prese nelle sessioni (linea A).

Focus specifico:
- Confronta ogni regola scritta qui con la sessione A in cui probabilmente è nata (stesso nome di
  area/feature): se la trovi, è una prova diretta di decisione-diventata-regola (L4).
- `Testing-Skill/`: criteri di collaudo attuali — confrontali col taglio "62→16 prove" di A11 (agosto).
- `Database-Skill/`: regole di sicurezza ambienti (TEST vs PROD) — confronta con le "salvaguardie
  sempre attive" del progetto: chi le ha proposte per primo?
```

### M4 — Legal / Marketing / UI / Prenota / Menu-QR-Skill + root docs

```
Profilo: Verifica | Meta
Modalità: deep
Leggi prima: PIANO_INDAGINE.md §3
Perimetro (leggi TUTTO, regime scavo): docs/Legal-Production-Skill/ (11) + docs/legal/ (4) +
 docs/Marketing-Skill/ (5) + docs/per-ui-design-skill/ (12) + docs/Prenota-Skill/ (7) +
 docs/Menu-QR-Skill/ (7) + 14 file sciolti in root docs/ (ADMIN_CLASSIC_SKILL.md,
 COMUNICAZIONE_UTENTE_SKILL.md, DATA_FLOW_SKILL.md, DATABASE.md, FOLLOW_UP.md,
 GUIDA_USO_QUERIES_CONTROVERIFICA.md, MASTERPLAN_ALLINEAMENTO.md, MASTERPLAN_BLINDATURA.md,
 MASTERPLAN_SERVIZIO.md, Plan-Completamento.md, PREPARA_PROMPT_SKILL.md, PWA_CONTEXT.md,
 SESSION_LOG.md, STATO_BLINDATURA_CHECKLIST.md) — 60 file totali, esclude APP_CONTEXT_SKILL.md (già in M1)
Non caricare: src/; Archives; _lavoro
Output attesi: report/M4_LEGAL_MARKETING_UI_PRENOTA_SKILL.md + _stato/M4.md — niente altro senza chiedere Sì/No

Obiettivo: due famiglie diverse di decisioni nello stesso perimetro — compliance/vendita
(Legal-Production-Skill, legal, Marketing-Skill) da un lato, prodotto pubblico (Prenota-Skill,
Menu-QR-Skill, per-ui-design-skill) dall'altro. I 14 file sciolti in root sono i 3 masterplan
principali del progetto (ALLINEAMENTO, BLINDATURA, SERVIZIO) più stato/follow-up correnti.

Focus specifico:
- Legal-Production-Skill + legal: decisioni GDPR/DPA/produzione — confronta con la skill dedicata di
  questo stesso progetto (calendarbackup-legal-production) per capire se Matteo le ha originate o
  ratificate.
- MASTERPLAN_ALLINEAMENTO / MASTERPLAN_BLINDATURA / MASTERPLAN_SERVIZIO: tre piani di consolidamento
  di fasi diverse del progetto — chi li ha originati, quanto sono stati seguiti fino in fondo.
- Prenota-Skill / Menu-QR-Skill: confronta con Sessioni A dedicate (Pagina Prenota, Menu QR) — stessa
  logica di M3, cercare decisione-diventata-regola.
```

### A1 — Sessioni 23-05 → 26-05 (42 file)

```
Profilo: Verifica | Meta
Modalità: deep
Leggi prima: PIANO_INDAGINE.md §3; report/P0_INVENTARIO_CORPUS.md (lista file della tua ondata)
Perimetro (regime scavo, TUTTI i file): docs/Sessioni di lavoro/{23-05-26, 24-05-26, 25-05-26, 26-05-26}/
Non caricare: Archives; _lavoro; transcript; src/
Output attesi: report/A1_SESSIONI_23-05_26-05.md + _stato/A1.md — niente altro senza chiedere Sì/No

Obiettivo: estrarre decisioni, agency e segnali skill dal periodo di fondazione del prodotto.

Come leggere questi report: 223 dei 461 report hanno una sezione «Domande di chiusura» con Q1 =
i prompt di Matteo riportati dall'agente. Quello è il materiale più vicino alle sue parole in questa
linea: citalo verbatim. Attenzione: è l'agente che riporta, quindi peso 3 — se H1 lo smentisce,
vince H1.

Cosa cercare in particolare:
- decisioni di prodotto delle fondamenta (multi-tenant, coperti, fasce, Menu QR fase 1, PWA);
- il primo incidente su PROD (impostazioni bloccate, audit sicurezza DB): chi ha capito cosa, e quando;
- follow-up che CORREGGONO l'agente vs follow-up che ESTENDONO lo scope: sono due skill diverse;
- chi ha fatto il collaudo: Matteo a mano o l'agente con i test.
```

### A2 — Sessioni 27-05 → 29-05 (51 file)

```
Come A1, stesso schema e stesse regole.
Perimetro: docs/Sessioni di lavoro/{27-05-26, 28-05-26, 29-05-26}/  — 51 file, regime scavo
Output: report/A2_SESSIONI_27-05_29-05.md + _stato/A2.md

Focus del periodo: il 29-05 è il primo picco di volume (28 report in un giorno) — capire se è
sviluppo, ricostruzione o crisi. Nascita dello skill system vivo, disambiguazione delle zone «menu»,
prime regole di comunicazione. Guarda chi ha proposto le regole e chi le ha tarate.
```

### A3 — Sessioni 30-05 → 01-06 (46 file)

```
Come A1, stesso schema e stesse regole.
Perimetro: docs/Sessioni di lavoro/{30-05-26, 31-05-26, 01-06-26}/ — 46 file, regime scavo
Output: report/A3_SESSIONI_30-05_01-06.md + _stato/A3.md

Focus: consolidamento skill system, primi dossier senior, meccanismo Liv.1/2/3 del vocabolario.
Cerca il momento in cui Matteo smette di chiedere «fai X» e comincia a chiedere «come lavoriamo».
```

### A4 — Sessioni 02-06 → 05-06 (40 file)

```
Come A1, stesso schema e stesse regole.
Perimetro: docs/Sessioni di lavoro/{02-06-26, 03-06-26, 04-06-26, 05-06-26}/ — 40 file, regime scavo
Output: report/A4_SESSIONI_02-06_05-06.md + _stato/A4.md

Focus: mandato esplicito «educare Matteo» (02-06), nascita del sistema didattico e del pilota
mappatura aree (04-06). Sono decisioni sulla PROPRIA formazione: tipizzale FORMAZIONE, non AI-METODO.
```

### A5 — Sessioni 06-06 → 10-06 (38 file)

```
Come A1, stesso schema e stesse regole.
Perimetro: docs/Sessioni di lavoro/{06-06-26, 07-06-26, 10-06-26}/ — 38 file, regime scavo
Output: report/A5_SESSIONI_06-06_10-06.md + _stato/A5.md

Focus: blindatura Menu QR, split in 3 repository, masterplan blindatura. Lo split repo è una
decisione di architettura + vendita insieme: guarda chi l'ha originata.
```

### A6 — Sessioni 11-06 + 13-06 (29 file)

```
Come A1, stesso schema e stesse regole.
Perimetro: docs/Sessioni di lavoro/{11-06-26, 13-06-26}/ — 29 file, regime scavo
Output: report/A6_SESSIONI_11-06_13-06.md + _stato/A6.md

Focus: milestone Calendario in produzione, limite coperti, mappatura M3 menu/magazzino (intervista
con decisioni owner esplicite). Le interviste sono oro: sono decisioni ORIGINATE da lui.
```

### A7 — Sessioni 12-06 (63 file — ondata pesante)

```
Come A1, stesso schema e stesse regole.
Perimetro: docs/Sessioni di lavoro/12-06-26/ — 63 file in una sola giornata, regime scavo
Output: report/A7_SESSIONI_12-06.md + _stato/A7.md

Ondata più densa dell'intero progetto: 63 report in un giorno. Prima di leggere, ordina i file e
dichiara un ordine di lettura. Se ti accorgi di non poter aprire tutto con qualità, NON barare sulla
copertura: dichiara in sezione 5 quanti file hai aperto davvero e proponi lo split A7a/A7b.

Focus: capire cosa è successo quel giorno — masterplan allineamento, work package, rollout P0. Molti
report sono ondate parallele di agenti: distingui la regia di Matteo dal lavoro degli agenti.
```

### A8 — Sessioni 15-06 → 16-06 (41 file)

```
Come A1, stesso schema e stesse regole.
Perimetro: docs/Sessioni di lavoro/{15-06-26, 16-06-26}/ — 41 file, regime scavo
Output: report/A8_SESSIONI_15-06_16-06.md + _stato/A8.md

Focus: email/Brevo in produzione, CRM, campagne. Decisioni con impatto legale e commerciale reale
(invii a clienti veri): guarda dove Matteo si è fermato a chiedere e dove ha tirato dritto.
```

### A9 — Sessioni 17-06 → 19-06 (32 file)

```
Come A1, stesso schema e stesse regole.
Perimetro: docs/Sessioni di lavoro/{17-06-26, 18-06-26, 19-06-26}/ — 32 file, regime scavo
Output: report/A9_SESSIONI_17-06_19-06.md + _stato/A9.md

Focus: batch 9 fix UX rilasciato in produzione, cambio di modello sui limiti coperti (il limite
giornaliero RIMOSSO il 18-06), unsubscribe. Il cambio di modello è un caso da manuale: product
discovery o errore di partenza? Cerca la motivazione scritta, non dedurla.
```

### A10 — Sessioni 20-06 → 24-06 (36 file)

```
Come A1, stesso schema e stesse regole.
Perimetro: docs/Sessioni di lavoro/{20-06-26, 21-06-26, 22-06-26, 23-06-26, 24-06-26}/ — 36 file, scavo
Output: report/A10_SESSIONI_20-06_24-06.md + _stato/A10.md

Focus: chiusura del ciclo giugno. Dopo il 24-06 c'è un buco fino al 02-08: cerca nei report l'ultimo
stato dichiarato e ogni indizio sul perché il lavoro si è fermato (utile alla timeline S3).
```

### A11 — Sessioni 02-08 → 06-08 (40 file)

```
Come A1, stesso schema e stesse regole.
Perimetro: docs/Sessioni di lavoro/{02-08-26, 03-08-26, 04-08-26, 05-08-26, 06-08-26}/ — 40 file, scavo
 (escludi la cartella Indagine-Skill-Matteo/: è questo cantiere, non materiale d'indagine)
Output: report/A11_SESSIONI_02-08_06-08.md + _stato/A11.md

Focus: ripresa dopo il buco. Capitolo Servizio, 118 test e2e, collaudo manuale ridotto da 62 a 16
prove, piano multi-agente. La riduzione del collaudo è una decisione di strategia di testing presa
da lui: cerca il criterio con cui ha tagliato. Confronta il Matteo di agosto con quello di maggio
(A1): è il confronto più informativo dell'intera linea A.
```

---

## Mining — Archivi

### B1 — BHM-Zen: meta, skill-system, guide (90 file)

```
Profilo: Verifica | Meta
Modalità: deep
Leggi prima: PIANO_INDAGINE.md §3
Perimetro (regime scavo): docs/Archives/docs/{meta/, skill-system/, guide/} + i 3 md nella root
Non caricare: app-definition (è di B2/B3); src/
Output attesi: report/B1_BHM_META_E_SKILL.md + _stato/B1.md — niente altro senza chiedere Sì/No

Obiettivo: il progetto HACCP è il luogo dove il metodo di lavoro con gli agenti è NATO, prima di
CalendarBackup. Qui si misura il trasferimento.

Focus: DECISIONI_OWNER_BETA.md e MAPPATURA_AREE (decisioni owner esplicite: audit append-only,
sigilla giornata, ruoli, notifiche, scadenze); MASTERPLAN_RILANCIO; lo skill-system di BHM confrontato
con quello di CB-v2 — cosa è stato copiato, cosa è stato migliorato. Segnala esplicitamente ogni
elemento che poi ricompare in CalendarBackup (serve a S3 per le frecce di trasferimento).
```

### B2 — BHM-Zen: app-definition parte 1 (69 file)

```
Profilo: Verifica | Meta
Modalità: deep
Leggi prima: PIANO_INDAGINE.md §3 e §3.5 (regime RASTRELLO)
Perimetro: docs/Archives/docs/app-definition/ — primi 69 percorsi relativi in ordine alfabetico
 (ordina sul percorso completo, non sul nome nudo: ci sono più README.md in sottocartelle diverse),
 fino e incluso 03_CONSERVATION\Lavoro\Gennaio-2026\15-01-2026\REVISIONE_LAVORO_AGENTI.md
 (taglio verificato da P0 il 06-08-26)
Output attesi: report/B2_BHM_APPDEF_1.md + _stato/B2.md — niente altro senza chiedere Sì/No

Regime rastrello: APRI ogni file, ma estrai solo (a) decisioni dove l'owner è nominato o la scelta è
di prodotto/compliance, (b) vincoli normativi HACCP, (c) correzioni. Il resto lo conti e lo dichiari,
non lo riassumi. In sezione 5 devi poter scrivere «69 su 69 aperti».

Questa è documentazione di specifica: molta di essa è scritta DALL'AGENTE. Non attribuirla a Matteo
solo perché esiste. Serve una traccia esplicita di una sua scelta.
```

### B3 — BHM-Zen: app-definition parte 2 (69 file)

```
Identico a B2. Perimetro: restanti 69 percorsi, a partire da
03_CONSERVATION\Lavoro\Gennaio-2026\15-01-2026\SOLUZIONE_ERRORE_EXPORT.md (taglio verificato da P0,
B2+B3 = 138 senza sovrapposizioni né buchi).
Output: report/B3_BHM_APPDEF_2.md + _stato/B3.md
```

### C1 — HACCP legacy: Sessions_Old (67 file)

```
Profilo: Verifica | Meta
Modalità: deep
Leggi prima: PIANO_INDAGINE.md §3, §3.5 (rastrello)
Perimetro: docs/Archives/Sessions_Old/ — 67 file
Output attesi: report/C1_LEGACY_SESSIONS_OLD.md + _stato/C1.md — niente altro senza chiedere Sì/No

Obiettivo: le origini. Qui c'è il Matteo che lavorava con gli agenti PRIMA di avere un metodo.
Focus: come dava le istruzioni allora, quanto delegava, quanti errori di processo ci sono, quali
lezioni sono state scritte. È il punto di partenza della curva di crescita (S3).

Nota mtime (verificata da P0): il filesystem mostra la stessa data (05-02-26) per quasi tutti questi
file — è la copia in blocco nell'archivio, non la data del lavoro reale. Cerca le date dentro i
documenti stessi.
```

### C2 — HACCP legacy: 2026-01-cleanup (89 file)

```
Come C1, regime rastrello.
Perimetro: docs/Archives/2026-01-cleanup/ — 89 file
Output: report/C2_LEGACY_CLEANUP.md + _stato/C2.md

Focus: un cleanup racconta cosa era diventato ingestibile e chi ha deciso di tagliare. Cerca i criteri
di taglio (sono decisioni di PROCESSO) e chi li ha fissati.

Nota mtime: stessa data (05-02-26) per quasi tutti i file, è la copia in blocco non il lavoro reale.
```

### C3 — HACCP legacy: knowledge-legacy + Knowledge (85 file)

```
Come C1, regime rastrello.
Perimetro: docs/Archives/knowledge-legacy/ (60) + docs/Archives/Knowledge/ (25)
Output: report/C3_LEGACY_KNOWLEDGE.md + _stato/C3.md

Focus: cosa è stato considerato «conoscenza da conservare» e da chi. È il primo antenato dello skill
system: annota ogni elemento che poi ricompare in BHM (B1) o in CB-v2 (M1).
```

### C4 — HACCP legacy: Tests + Info_Complete (105 file)

```
Come C1, regime rastrello.
Perimetro: docs/Archives/Tests/ (58) + docs/Archives/Info_Complete/ (47)
Output: report/C4_LEGACY_TESTS_INFO.md + _stato/C4.md

Focus: la strategia di test più antica. Chi decideva cosa testare, e con quale criterio. Serve a
misurare la distanza con il Matteo di agosto 2026 che taglia il collaudo da 62 a 16 prove (A11).
Evita di dumpare json e screenshot: contali.

Nota mtime: stessa data (05-02-26) per quasi tutti i file, è la copia in blocco non il lavoro reale.
```

### C5 — HACCP legacy: lezioni, regole, misc (~40 file)

```
Come C1 ma regime SCAVO (alta densità).
Perimetro: docs/Archives/cursor-rules-cleanup-2026-01/ (24) + References/ (5) + 2025-10-20/ (cartella,
 5 file) + 2025-10-21 (**file singolo senza estensione, non una cartella** — aprilo come documento di
 testo, inizia con "# TRACKING MODIFICHE POST-TEST") + Reports/ (3) + Archive/ (1) +
 docs/Archives/LEZIONI_APPRESE_AGENTE_1.md — 40 file totali (verificato da P0)
Output: report/C5_LEGACY_LEZIONI_E_REGOLE.md + _stato/C5.md

Nota mtime: quasi tutti i file di C1/C2/C4/C5 (Sessions_Old, 2026-01-cleanup, Tests, Info_Complete,
cursor-rules-cleanup) hanno la stessa data di ultima modifica sul filesystem (05-02-26): è la data di
una copia in blocco nell'archivio, non la data reale del lavoro. Non usarla per datare i contenuti:
cerca date scritte dentro i documenti, o dichiara "data sconosciuta".

Focus: LEZIONI_APPRESE e le regole Cursor sono il punto in cui gli errori diventano regole. Per ogni
lezione: chi ha pagato l'errore, chi ha scritto la regola, la regola è sopravvissuta fino a oggi?
```

### D1 — CalendarBackup vecchia: docs (86 file)

```
Profilo: Verifica | Meta
Modalità: deep
Leggi prima: PIANO_INDAGINE.md §3, §3.5 (rastrello)
Perimetro: docs/Archives/Calendarbackup-oldversion/docs/ — 86 file
Output attesi: report/D1_CB_OLD_DOCS.md + _stato/D1.md — niente altro senza chiedere Sì/No

Obiettivo: la versione precedente della STESSA app. È il confronto più pulito che esista nel corpus:
stesse esigenze, due tentativi. Focus: quali scelte sono state tenute in CB-v2 e quali RIBALTATE,
e se esiste una traccia scritta del perché. I ribaltamenti sono il segnale di apprendimento più forte.
```

### D2 — CalendarBackup vecchia: Lavoro + Sessioni (46 file)

```
Come D1 ma regime SCAVO.
Perimetro: docs/Archives/Calendarbackup-oldversion/{Lavoro/ (26), Sessioni di lavoro/ (20)}
Output: report/D2_CB_OLD_SESSIONI.md + _stato/D2.md

Focus: qui parla Matteo, non la specifica. Come conduceva le sessioni allora, cosa chiedeva, quanto
controllava. Confronto diretto con A1 (23-05): stessa app, mesi diversi.
```

### E1 — Trading v.0: docs (97 file)

```
Profilo: Verifica | Meta
Modalità: deep
Leggi prima: PIANO_INDAGINE.md §3, §3.5 (rastrello)
Perimetro: docs/Archives/trading agent analyst-v.0/docs/ — 97 file
Output attesi: report/E1_TRADING_V0_DOCS.md + _stato/E1.md — niente altro senza chiedere Sì/No

Obiettivo: dominio completamente diverso (finanza + educazione + compliance). Serve a capire se il
metodo di Matteo è trasferibile o è tarato solo sui ristoranti.

Focus: il PDR e il vincolo «niente segnali buy/sell» — è una decisione di compliance e di
posizionamento insieme, con conseguenze su tutto il prodotto. Chi l'ha presa e perché. Poi: pricing,
abbonamenti, analisi concorrenza. Sintetizza gli screenshot, non descriverli uno per uno.
```

### E2 — Trading v.0: reports (31 file)

```
Come E1 ma regime SCAVO.
Perimetro: docs/Archives/trading agent analyst-v.0/reports/ (30) + il md nella root
Output: report/E2_TRADING_V0_REPORTS.md + _stato/E2.md

Focus: report di agenti = interazioni reali. Cosa chiedeva, cosa correggeva, dove si è fermato.
```

### F1 — FREEDOM Trading (85 file)

```
Profilo: Verifica | Meta
Modalità: deep
Leggi prima: PIANO_INDAGINE.md §3, §3.5 (rastrello)
Perimetro: docs/Archives/Trading agent analysy/ — 85 file (docs 84 + root 1)
Output attesi: report/F1_FREEDOM_TRADING.md + _stato/F1.md — niente altro senza chiedere Sì/No

Obiettivo: il secondo tentativo sul trading. Focus: skill-system-trading-platform e CONTESTO_PRODOTTO
— quanto del metodo CalendarBackup è stato riportato qui, e se è stato semplificato o appesantito.
Segnala le frecce di trasferimento per S3.
```

---

## Mining — Privato, dialoghi, piani, fatti

### G1 — `_lavoro/Per matteo/` (51 file)

```
Profilo: Verifica | Meta
Modalità: deep
Leggi prima: PIANO_INDAGINE.md §2.1 (punto 3: cosa è davvero privato) e §3
Perimetro (PATH ASSOLUTI, regime scavo):
 c:\Users\matte.MIO\Documents\GitHub\CalendarBackup-v2\docs\_lavoro\Per matteo\
 → Scuola (6), Test e2e (8), Comandi (5), Analisi Fable (5), Documenti Legali (3),
   Valutazione prezzo vendita (2), Upgrade-da-Fare (2), Verifica Blindatura ×3 (12), guide sciolte
Non caricare: src/. Glob/Grep del workspace NON vedono questa cartella: usa Shell/Read con path assoluto.
Output attesi: report/G1_LAVORO_PER_MATTEO.md + _stato/G1.md — niente altro senza chiedere Sì/No

Obiettivo: è il materiale che Matteo tiene per sé. Il valore è massimo per il ritratto, ma attenzione
al peso probatorio: PROFILO_SCOLASTICO è un'AUTO-dichiarazione. Vale 1 per «cosa dice di sé» e 4 per
«cosa sa fare». Tienile separate: la differenza tra le due è uno dei risultati dell'indagine.

Focus:
- Scuola: skill che DICE di voler imparare, livello dichiarato, metodo didattico concordato.
- Test e2e + contesto-testato: cosa collauda con le proprie mani. Prova diretta di skill esercitata.
- Comandi: quale operatività (terminale, DB, e2e) gestisce senza agente.
- Analisi Fable: valutazione di legale/vendita/solidità — segnale di visione da product owner.
- Documenti Legali e Prezzo: SOLO consapevolezza. Path + sintesi. Nessun testo di contratto, nessuna
  cifra riportata verbatim se identifica un cliente.
- Verifica Blindatura ×3: sono le sue checklist di accettazione. Confronta i criteri con quelli degli
  agenti (M1): dove sono più severi i suoi?
```

### G2 — `_lavoro/Sessioni/` 12-05 → 22-05 (56 file)

```
Come G1, path assoluti, regime scavo.
Perimetro: c:\Users\matte.MIO\Documents\GitHub\CalendarBackup-v2\docs\_lavoro\Sessioni\
 (12-05-26, 13-05-26, 14-05-26, 15-05-26, 16-05-26, 17-05-26, 18-05-26, 19-05-25, 19-05-26, 22-05-26)
Output: report/G2_LAVORO_SESSIONI_MAGGIO.md + _stato/G2.md

Obiettivo: colmare il buco prima del log pubblico (che parte dal 23-05). Sono le PRIME due settimane
di CalendarBackup-v2: il punto zero della curva di crescita. Nota: nella cartella c'è un «19-05-25»
(anno diverso) — verifica se è un refuso e dichiaralo.

Focus: quanto delegava all'inizio, quanto capiva di quello che gli veniva restituito, quali sono le
prime decisioni sopravvissute fino a oggi. Incrocia con H1, che copre lo stesso periodo con le sue
parole letterali: se i due divergono, è un risultato importante — scrivilo.
```

### G3 — `_lavoro/` Storico + Supporto + e2e-s4 (13 file)

```
Come G1, path assoluti, regime scavo.
Perimetro: docs\_lavoro\{Storico\ (8), Supporto\ (3), e2e-s4\ (2 md, 107 file totali)}
Output: report/G3_LAVORO_SUPPORTO_STORICO.md + _stato/G3.md

Focus: Supporto contiene ANALISI_RACCOLTA_DATI_SKILL_SYSTEM e Metodo_spiegazioni_agenti_coding — è
Matteo che progetta COME vuole essere spiegato. Decisione di FORMAZIONE di primo livello, da citare
per esteso in S5. Storico: architettura e testing dei primi tempi. e2e-s4: artefatti, contali senza
aprirli tutti (sono output di macchina).
```

### H1 — Parole di Matteo, CB-v2, 27-04 → 15-05 (1.032 M-VOCE)

```
Profilo: Verifica | Meta
Modalità: deep
Leggi prima: PIANO_INDAGINE.md §2.1 (limite REDACTED), §2.2 (cronologia vera), §3.3 (attribuzione);
 report/P0EX_CORPUS_PAROLE_MATTEO.md
Perimetro: c:\Users\matte.MIO\Documents\GitHub\CalendarBackup-v2\docs\_lavoro\Indagine-Corpus\prompts_CB-v2.jsonl
 filtrando date dal 2026-04-27 al 2026-05-15
Non caricare: i .jsonl grezzi di Cursor (usa il corpus distillato); dump di chat intere nel report
Output attesi: report/H1_PAROLE_MATTEO_CB_1.md + _stato/H1.md — niente altro senza chiedere Sì/No

Obiettivo: questa è la fonte di peso 1. Qui non si interpreta quello che un agente ha scritto su di
lui: si legge quello che ha scritto lui. È anche il periodo più denso in assoluto del progetto.

Metodo:
1. Leggi TUTTI i messaggi con class="M-VOCE" del periodo (dichiara il numero letto). M-REGIA,
   M-PASTE e M-OK si contano e si campionano, non si leggono tutti.
2. Cita da `text_umano`, non da `text`: il primo è ripulito dagli allegati che Cursor accoda
   (DOM Path, Position, stack). Mai citare righe con has_secret=true.
3. Fonte di ogni riga: chat_uuid + seq + date. Sempre.
4. Correzioni M→A: cerca dove interrompe, annulla, rifiuta, ripete un'istruzione già data.
   Parole spia: annulla, no, non così, torna a, ripristina, ti avevo detto, non era questo.
5. Correzioni A→M: NON sono leggibili (testo agente oscurato). Usa il metodo delle coppie: quando il
   messaggio successivo di Matteo si arrende, cambia rotta o accetta una precisazione, marca
   `A→M / DEDOTTA` citando entrambi i messaggi. Mai marcarle DIRETTA.
6. Segnali di ritmo: lunghezza media (la media generale è 635 caratteri: sopra o sotto?), frequenza
   di M-OK, quanto insiste sullo stesso punto prima di mollare.

Nel report: sintesi + citazioni brevi + uuid. Mai incollare conversazioni intere.
```

### H2 — Parole di Matteo, CB-v2, 16-05 → 31-05 (732 M-VOCE)

```
Identico a H1 per metodo, vincoli e fonti.
Perimetro: prompts_CB-v2.jsonl, date dal 2026-05-16 al 2026-05-31
Output: report/H2_PAROLE_MATTEO_CB_2.md + _stato/H2.md

Nota di periodo: qui parte anche il log pubblico delle sessioni (dal 23-05). Sei sulla stessa
settimana coperta da A1/A2, ma con le sue parole invece che con i report degli agenti. Dove i due
divergono, vinci tu (peso 1): segnala le divergenze in modo esplicito, servono a S4.
```

### H3 — Parole di Matteo, CB-v2, 01-06 → 06-08 (780 M-VOCE)

```
Identico a H1 per metodo, vincoli e fonti.
Perimetro: prompts_CB-v2.jsonl, date dal 2026-06-01 al 2026-08-06
Output: report/H3_PAROLE_MATTEO_CB_3.md + _stato/H3.md

In più, obbligatorio: confronto con H1 e H2 sugli stessi indicatori (lunghezza media, % M-VOCE vs
M-REGIA, tipo di richieste). Cerca la comparsa del vocabolario di comando — «lavoro ok», «prepara»,
«ragioniamo», «spiegamelo semplice», «fai report finale» — e **datala**: il momento in cui smette di
descrivere ogni volta e inizia a usare parole-comando è un evento nella sua crescita, non un dettaglio.
I 113 messaggi M-REGIA sono quasi tutti qui: è il periodo in cui delega la scrittura dei prompt.
```

### H4 — Preistoria: CB-old, MathBoy2, Game, Qwen-Test (634 msg, feb-mar 2026)

```
Identico a H1 per metodo e vincoli.
Perimetro: prompts_CB-old.jsonl (97), prompts_CB-old-wt.jsonl (67), prompts_MathBoy2.jsonl (374),
 prompts_Game.jsonl (91), prompts_Qwen-Test.jsonl (5) — tutti in docs\_lavoro\Indagine-Corpus\
Output: report/H4_PREISTORIA_FEB_MAR.md + _stato/H4.md

Perché conta: è il Matteo di PRIMA di CalendarBackup-v2 (nato il 27-04). Volume basso per progetto:
leggi tutto, anche M-REGIA e M-OK.

Focus:
- MathBoy2 e Game sono sviluppo di giochi: dominio diverso, vincoli diversi (bilanciamento, difficoltà,
  fisica). 465 messaggi suoi. L'albero di skill NON deve essere coerente: è una richiesta esplicita.
- Qwen-Test tocca la valutazione di modelli AI locali.
- CB-old è la stessa app di oggi, un'altra volta: confronta come chiedeva allora e come chiede a maggio.
- Il vocabolario di comando esiste già qui, o nasce dopo? Datalo. È il test più duro sulla
  trasferibilità del suo metodo.
```

### H5 — Parallelo e luglio: Trade-Analyst, Trading-Platform, BHM (233 msg)

```
Identico a H1 per metodo e vincoli.
Perimetro: prompts_Trade-Analyst.jsonl (95, maggio-giugno), prompts_Trading-Platform.jsonl (69, luglio),
 prompts_BHM-v2.jsonl (51, luglio), prompts_BHM-Zen.jsonl (18, luglio)
Output: report/H5_PARALLELO_E_LUGLIO.md + _stato/H5.md

Perché è un'ondata a sé (scoperta di P0-EX, piano §2.2):
1. Trade-Analyst gira a maggio-giugno, cioè IN PARALLELO al periodo più denso di CalendarBackup.
   Non è un progetto successivo: è un secondo fronte aperto mentre il primo era al massimo carico.
2. Trading-Platform, BHM-v2 e BHM-Zen sono di LUGLIO, cioè dentro il «buco» 22-06 → 02-08 di
   CalendarBackup. Il buco non è una pausa: è un cambio di progetto.

Focus: come gestisce più progetti insieme; se il metodo costruito su CalendarBackup viene esportato
o abbandonato quando cambia dominio; cosa lo ha fatto tornare su CalendarBackup ad agosto.
```

### I1 — Piani `.cursor/plans`: prenotazioni / HACCP (112 file)

```
Profilo: Verifica | Meta
Modalità: deep
Leggi prima: PIANO_INDAGINE.md §3, §3.5 (rastrello); report/P0_INVENTARIO_CORPUS.md §9 per la
 spartizione reale (112 vs 33, non 90 vs 56 come stimato all'inizio)
Perimetro (PATH ASSOLUTO): C:\Users\matte.MIO\.cursor\plans\ — i piani CalendarBackup (52 + 2 in
 .claude/plans) + HACCP-BHM (39) + i 19 ambigui che toccano entrambi i domini, più 2 dei 4 file
 assegnati a mano da P0 (aggiungere_nome_utente_ai_log_attività→HACCP-BHM,
 fix_calendar_settings_table_missing→CB, console_demo_2_branch→CB). Lista completa disponibile su
 richiesta (generata da P0, non allegata per esteso al report per non duplicare 144 righe).
 Se troppo pesante come ondata unica (112 file), valuta lo split CB (~54) / HACCP-BHM (~58) e
 dichiaralo in sezione 5.
Output attesi: report/I1_PIANI_PRENOTA_HACCP.md + _stato/I1.md — niente altro senza chiedere Sì/No

Obiettivo: un piano dice cosa si VOLEVA fare; i report dicono cosa è stato fatto. La differenza tra i
due è dove si vede la capacità di scoping.

Focus: per ogni piano — chi l'ha originato, quanto è stato ristretto o allargato in corsa, e (dove
possibile incrociando con A*) se è stato completato o abbandonato. I piani abbandonati sono
contro-evidenza preziosa per S4: elencali.
```

### I2 — Piani `.cursor/plans`: giochi / trading / altro (33 file)

```
Come I1, regime rastrello.
Perimetro: i piani Game/MathBoy2 (26) + Trading (3: 1 puro + 2 su tutor/vision benchmark, verifica il
 testo — citano esplicitamente "Aware Trader") + 2 mini-progetti isolati assegnati a mano da P0
 (prd_condividimi → PRD di una feature di condivisione mai vista altrove nel corpus; sessione_test_modelli
 → valutazione modelli AI locali/OpenRouter, stesso filone di Qwen-Test/H4-H5) + i 2 file di
 .claude/plans NON vanno qui: sono entrambi CB, assegnati a I1.
Output: report/I2_PIANI_ALTRI.md + _stato/I2.md

Focus: la pianificazione in domini non-lavorativi (giochi). Stesso schema, stessa domanda: pianifica
allo stesso modo quando il progetto non è il suo business? In più: i 2 mini-progetti isolati sono
scope aperto e mai chiuso, o semplicemente non tracciato altrove? Segnalalo per S4.
```

### J1 — Fatti oggettivi: git, migrazioni, release, test

```
Profilo: Verifica | Meta
Modalità: deep
Leggi prima: PIANO_INDAGINE.md §1 (gerarchia probatoria: questa linea ha peso 2)
Perimetro: git log completo del repo (tutti i branch), supabase/migrations/, tag e script di release,
 esiti test dichiarati (npm run validate) rintracciabili nei report
Non caricare: contenuto di src/ (solo metadati dei commit); non eseguire test; nessun comando che
 scriva sul DB
Output attesi: report/J1_FATTI_OGGETTIVI.md + _stato/J1.md — niente altro senza chiedere Sì/No

Obiettivo: dare all'indagine un'ancora che non dipende da cosa qualcuno ha scritto in un report.

Cosa produrre:
1. Timeline dei commit per mese: volume, tipi (feat/fix/docs/update), branch, merge in main.
2. Migrazioni: numerazione, date, quali applicate su TEST e quali su PROD (dai file e dai report).
3. Rilasci in produzione: date e contenuto.
4. Rapporto docs/codice: quanti commit toccano solo documentazione — misura oggettiva di quanto
   questo progetto sia stato un lavoro di metodo oltre che di prodotto.
5. Elenco delle divergenze trovate tra ciò che i report dichiarano e ciò che git mostra. Questa
   lista è un input diretto di S4 (falsificazione).

Attenzione: l'autore dei commit è sempre Matteo anche quando il codice l'ha scritto un agente. Un
commit NON è prova di skill di codice. È prova di data, sequenza ed esito. Scrivilo nel report.
```

---

## Sintesi

### S1 — Catalogo decisioni cross

```
Profilo: Verifica | Meta
Modalità: deep
Leggi prima: PIANO_INDAGINE.md §3.1; TUTTI i report in report/ (sezioni 1)
Non caricare: NESSUN file grezzo dei corpora. Se un dato non è in un report, non esiste: apri una
 lacuna, non riaprire il corpus.
Output attesi: report/S1_CATALOGO_DECISIONI.md + _stato/S1.md — niente altro senza chiedere Sì/No

Obiettivo: una tabella unica di tutte le decisioni, deduplicata.

Cosa fare:
1. Concatenare le sezioni 1 di tutti i report mantenendo gli ID d'origine (A4-D07 resta A4-D07).
2. Deduplicare: la stessa decisione compare in più linee (es. una decisione presa in chat, scritta in
   un report e ripetuta in una skill). Una riga sola, con TUTTE le fonti elencate e il peso più alto.
3. Risolvere i conflitti con la regola §1 del piano (vince la fonte di peso più alto) e tenere una
   sezione «conflitti risolti» con la motivazione. Questa sezione è materiale d'oro per S4.
4. Tabelle di sintesi: decisioni per tipo; per anno/mese; per livello di autonomia; per progetto.
5. Top 30 decisioni più significative (criterio dichiarato: impatto + autonomia + tracciabilità).

Criterio di fatto: ogni riga ha almeno una fonte; il totale torna con la somma dei report; i conflitti
sono elencati, non nascosti.
```

### S2 — Agency e correzioni

```
Profilo: Verifica | Meta
Modalità: deep
Leggi prima: S1; le sezioni 2 di tutti i report; docs/Comunicazione-Skill/ERRORI_PROCESSO.md
Output attesi: report/S2_AGENCY_E_CORREZIONI.md + _stato/S2.md — niente altro senza chiedere Sì/No

Obiettivo: rispondere alle due domande centrali di Matteo — quando ha corretto lui, quando è stato
corretto.

Cosa fare:
1. Tabella M→A (lui corregge): cosa, in che materia, con quale esito. Raggruppa per materia: correggere
   sul prodotto e correggere sul codice sono skill diverse. Conta.
2. Tabella A→M (lo correggono): SEPARANDO `DIRETTA` da `DEDOTTA`. Se le DEDOTTE sono la maggioranza,
   scrivilo in testa al report: è un limite del materiale, non un dato su di lui.
3. Tabella M↔M (cambia idea da solo): distingui «scoperta di prodotto» (nuova informazione) da
   «errore corretto» (aveva sbagliato). Serve la citazione del motivo, altrimenti → INCERTO.
4. Evoluzione nel tempo: la percentuale di decisioni ORIGINATE cresce nei mesi? Le correzioni A→M
   calano? Grafico a parole con i numeri per periodo.
5. La domanda scomoda, da rispondere esplicitamente: le correzioni M→A riguardano soprattutto il
   MERITO (la scelta era sbagliata) o la FORMA (non hai seguito il processo)? Conta e dichiara.
```

### S3 — Albero skill + timeline + livelli

```
Profilo: Verifica | Meta
Modalità: deep
Leggi prima: S1, S2; le sezioni 3 di tutti i report; PIANO_INDAGINE.md §3.4 (scala L0–L4)
Output attesi: report/S3_ALBERO_SKILL_E_TIMELINE.md + _stato/S3.md — niente altro senza chiedere Sì/No

Obiettivo: l'albero di skill, con un livello assegnato e provato per ogni ramo.

Cosa fare:
1. Raggruppare le skill signals in rami. Rami attesi (non vincolanti): direzione di agenti AI /
   product ownership / strategia di testing e qualità / architettura dati e ambienti / UX e linguaggio
   d'interfaccia / compliance e legale / vendita e posizionamento / auto-formazione e metodo.
   L'albero PUÒ essere incoerente: è una richiesta esplicita di Matteo, non un difetto.
2. Per ogni foglia: livello L0–L4 con l'evidenza che lo giustifica (ID decisione o ID agency).
   Nessun livello senza ID. L3/L4 senza contro-evidenza cercata → declassa a L2 e annota.
3. Tripla colonna obbligatoria: DICHIARATA (Scuola, G1) | ESERCITATA (A–F, I, J) | PARLATA (H).
   Le righe dove le tre colonne divergono sono le domande migliori per l'interrogazione: marcale.
4. Timeline della crescita: HACCP legacy → BHM-Zen → CalendarBackup vecchia → CB-v2 → Trading →
   giochi. Frecce di trasferimento del metodo (cosa è nato dove ed è stato portato altrove), con date.
5. Sezione «cosa NON risulta»: skill che ci si aspetterebbe e che il corpus non mostra.
```

### S4 — Falsificazione / contro-evidenze

```
Profilo: Verifica | Meta — QUESTA ONDATA LAVORA CONTRO LE ALTRE
Modalità: deep
Leggi prima: S1, S2, S3; le sezioni 4 di tutti i report; J1 (divergenze report vs git)
Output attesi: report/S4_CONTRO_EVIDENZE.md + _stato/S4.md — niente altro senza chiedere Sì/No

Obiettivo: rendere il dossier difendibile. Tutte le ondate precedenti hanno cercato prove a favore.
Questa cerca il contrario, e lo fa sul serio.

Cosa fare, per ogni skill dichiarata L3 o L4 in S3:
1. Cercare nei report almeno un caso in cui quella stessa skill è mancata: decisione delegata,
   errore ripetuto, correzione A→M nella stessa materia, piano abbandonato (I1/I2), divergenza tra
   dichiarato e git (J1).
2. Verdetto per ogni skill: `REGGE` (contro-evidenza cercata, non trovata o marginale) ·
   `RIDIMENSIONATA` (declassata, con il nuovo livello) · `NON REGGE` (l'evidenza a favore era debole).
3. Elenco delle «prove fragili»: righe basate su una sola fonte di peso 3 o 4, o su una deduzione.
4. Elenco degli errori NON attribuibili a Matteo che qualche report potrebbe avergli attribuito
   (attribuzione impropria) — e viceversa.
5. Le 10 domande più scomode che un senior potrebbe fargli, con l'evidenza che le motiva.

Regola: qui non si è gentili e non si è cattivi. Si è precisi. Un dossier che non sopravvive a questa
ondata non sarebbe sopravvissuto all'interrogazione.
```

### S5 — Ritratto metodologico

```
Profilo: Verifica | Meta
Modalità: deep
Leggi prima: M1, M2, M3, M4, G1, G3, H1–H4, S2; le sezioni «citazioni» di tutti i report
Output attesi: report/S5_RITRATTO_METODOLOGICO.md + _stato/S5.md — niente altro senza chiedere Sì/No

Obiettivo: come lavora Matteo, detto SOLO con citazioni raggruppate. Nessuna diagnosi, nessun
aggettivo che non sia in una fonte.

Assi (ognuno = un gruppo di citazioni con fonte):
- come apre un lavoro e come lo chiude;
- come gestisce l'ambiguità e lo scope (allarga? restringe? quando?);
- rapporto con il dettaglio tecnico: cosa vuole sapere e cosa delega esplicitamente;
- controllo qualità: di cosa non si fida, cosa ricontrolla di persona;
- come vuole che gli si parli (fonte primaria: Supporto/Metodo_spiegazioni, G3);
- come reagisce quando l'agente sbaglia, e quando sbaglia lui;
- ritmo e continuità: sessioni lunghe/corte, pause, il buco 22-06 → 02-08.

Due sezioni obbligatorie:
- «Auto-descrizione vs comportamento»: cosa dice di sé (G1/Scuola) accanto a cosa mostrano i dialoghi
  (H). Dove coincidono e dove no. Senza giudizio.
- «Cosa i file NON dicono»: tutto ciò su cui il corpus non ha voce. Va scritto per esteso: è la parte
  che protegge Matteo da un ritratto che sembra completo e non lo è.
```

### S6 — Dossier finale + banca domande senior

```
Profilo: Verifica | Meta
Modalità: deep
Leggi prima: S1–S5, P0, P0-EX; PIANO_INDAGINE.md §0 (prompt iniziale di Matteo, da riportare in testa)
Non caricare: nessun mining nuovo
Output attesi: report/S6_DOSSIER_PROFILO_MATTEO.md + _stato/S6.md — niente altro senza chiedere Sì/No

Obiettivo: il documento con cui Matteo entrerà nella chat di interrogazione senior.

Struttura obbligatoria:
1. Prompt iniziale di Matteo, verbatim.
2. Metodo e limiti dell'indagine, onesti: cosa è stato letto, quanto, cosa non si poteva sapere
   (testo agenti oscurato, buco 22-06→02-08, auto-dichiarazioni).
3. Mappa dei corpora A–J con i numeri finali e la copertura raggiunta, ondata per ondata.
4. Albero delle skill con i livelli DOPO S4 (i livelli restano PROVVISORI: si confermano a voce).
5. Le 20 decisioni che meglio rappresentano ciascun ramo, con fonte.
6. Agency in numeri: quante ORIGINATE, quante APPROVATE, quante correzioni per direzione, nel tempo.
7. Ritratto per citazioni (rimando a S5, non ricopiarlo).
8. **Banca domande per l'interrogazione**, divisa in tre:
   a. domande che verificano una skill rivendicata («raccontami perché il 18-06 hai rimosso il limite
      giornaliero» — la risposta si confronta con la fonte);
   b. domande scomode da S4;
   c. domande aperte su ciò che i file non dicono.
   Ogni domanda porta con sé la fonte e la risposta attesa dal corpus, in modo che il senior possa
   valutare senza rileggere tutto.
9. Nota privato vs pubblico basata su `git ls-files` (P0): cosa di questo dossier viene da materiale
   che sta nella repo e cosa da materiale privato.

Chiudi dichiarando che il capitolo mining è chiuso e che la validazione è una chat separata.
```

---

## Servizio

### AGG — Allineamento checkbox (ripetibile)

```
Profilo: Verifica | Meta
Modalità: light
Leggi prima: tutti i file in _stato/
Output attesi: aggiornamento delle sole checkbox in 00_PROMPTS_SEQUENZA_TRACKING.md + riga nel Log
 spunte — niente altro senza chiedere Sì/No

Cosa fare: per ogni _stato/<ID>.md presente, spuntare la riga corrispondente in «Stato rapido»
aggiungendo data e path del report. Se un file di stato è incompleto (mancano i numeri di copertura o
il conteggio decisioni), NON spuntare: segnala l'ondata come «da completare» e scrivi cosa manca.
Non modificare i blocchi prompt. Non riscrivere il file: modifica solo le righe di stato.
```

---

## Formato di `_stato/<ID>.md` (obbligatorio, 8 righe)

```
ID: A4
Data: 07-08-26
Report: report/A4_SESSIONI_02-06_05-06.md
Perimetro: 40 file
File aperti: 40 (100%)
Decisioni estratte: 23
Agency estratte: 7 (M→A 4 | A→M 2 DEDOTTE | M↔M 1)
Note: 2 file illeggibili (allegati binari), dichiarati in sezione 5
```

---

## Log spunte (append-only)

| Quando | ID | Agente/modello | Report | Nota |
|--------|----|----------------|--------|------|
| — | — | — | — | — |
