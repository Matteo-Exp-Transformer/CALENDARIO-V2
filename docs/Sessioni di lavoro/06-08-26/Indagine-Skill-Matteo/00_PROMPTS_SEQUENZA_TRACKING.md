# Indagine Skill Matteo — Prompt in sequenza + tracking

> **Piano (fonte di verità):** [PIANO_INDAGINE.md](PIANO_INDAGINE.md)
> **Materiale d'ingresso delle sintesi:** [01_INPUT_SINTESI.md](01_INPUT_SINTESI.md) — numeri misurati
> sui 39 report veri, trappole di lettura, scaffold. I prompt S1–S6 lo danno per letto.
> **Uso:** copia il blocco del prossimo prompt `⬜` in una chat Agent nuova. I blocchi sono corti di
> proposito: l'agente legge il metodo dal piano, così lo schema non si duplica e non va in deriva.
> **A fine ondata l'agente scrive SOLO** il suo report in `report/` e il suo file `_stato/<ID>.md`.
> **Non tocca questo file** (§6 del piano: cinque agenti in parallelo si cancellerebbero le spunte).
> Le checkbox qui sotto si aggiornano in blocco leggendo `_stato/` — a mano o con l'ondata `AGG`.

---

## Dove siamo (06-08-26, sera)

**Il mining è chiuso: 39 ondate su 39.** Restano solo le sei sintesi.

| Cosa c'è già | Numero |
|--------------|--------|
| Report di mining in `report/` | **39** (+ P0 e P0-EX) |
| Decisioni estratte | **1.826** righe, con fonte, zero collisioni di ID |
| Agency estratte | **606** righe contate (608 dichiarate: tre report non tornano, vedi `01_INPUT_SINTESI.md` §3) |
| Contro-evidenze | **≈352**, nessuna sezione vuota |
| Corpus coperto | **≈1.866 file** `.md` + **4.157 messaggi** tuoi + 1.074 commit |
| Sintesi eseguite | **0 su 6** |

**Come si lavora adesso — non più in parallelo libero.** Le S hanno dipendenze vere:

1. **S1 → S2 → S3 → S4 → S6** è una catena: ognuna legge l'output della precedente.
2. **S5 può girare in parallelo** appena S2 è chiusa (le serve S2 + M* + G* + H*, non S3/S4).
3. **Precondizione bloccante:** prima di lanciare un'ondata S, verifica che i suoi `report/S*.md` di
   ingresso esistano davvero. Se mancano, **fermati e dillo** — non ripiegare in silenzio sui report
   grezzi: produrresti numeri non deduplicati spacciati per finali.
4. Le S sono **le ondate più pesanti del cantiere** (1.826 righe da 39 fonti). Ognuna dichiara i propri
   numeri per famiglia di linea e li fa quadrare con i totali qui sopra.

---

## Stato rapido

### Fondamenta
- [x] **P0** — Inventario e verifica conteggi A–J — **fatta 06-08-26** — `report/P0_INVENTARIO_CORPUS.md`
- [x] **P0-EX** — Estrazione messaggi di Matteo — **fatta 06-08-26** — `report/P0EX_CORPUS_PAROLE_MATTEO.md` — 4.157 messaggi su 576 chat

### Mining — CalendarBackup-v2 (linee A, M) — tutte fatte 06-08-26

| | ID | Perimetro | Dec · Agency | Report |
|---|----|-----------|--------------|--------|
| ✅ | **M1** | Comunicazione + `_skill-system-v0` + APP_CONTEXT (36) | 80 · 42* | `M1_META_COMUNICAZIONE.md` |
| ✅ | **M2** | Console-Skill, super-admin tenant (46) | 32 · 9 | `M2_CONSOLE_SKILL.md` |
| ✅ | **M3** | Admin/Dashboard/Servizio/Database/Testing (41) | 55 · 12 | `M3_ADMIN_DB_TESTING_SKILL.md` |
| ✅ | **M4** | Legal/Marketing/UI/Prenota/Menu-QR + root (60) | 60 · 13 | `M4_LEGAL_MARKETING_UI_PRENOTA_SKILL.md` |
| ✅ | **A1** | Sessioni 23-05 → 26-05 (42) | 92 · 27 | `A1_SESSIONI_23-05_26-05.md` |
| ✅ | **A2** | Sessioni 27-05 → 29-05 (51) | 65 · 21 | `A2_SESSIONI_27-05_29-05.md` |
| ✅ | **A3** | Sessioni 30-05 → 01-06 (46) | 67 · 27 | `A3_SESSIONI_30-05_01-06.md` |
| ✅ | **A4** | Sessioni 02-06 → 05-06 (40) | 58 · 20 | `A4_SESSIONI_02-06_05-06.md` |
| ✅ | **A5** | Sessioni 06-06 → 10-06 (38) | 48 · 14 | `A5_SESSIONI_06-06_10-06.md` |
| ✅ | **A6** | Sessioni 11-06 + 13-06 (29) | 52 · 24 | `A6_SESSIONI_11-06_13-06.md` |
| ✅ | **A7** | Sessioni 12-06 (63, giornata più densa) | 66 · 24 | `A7_SESSIONI_12-06.md` |
| ✅ | **A8** | Sessioni 15-06 → 16-06 (41) | 55 · 24 | `A8_SESSIONI_15-06_16-06.md` |
| ✅ | **A9** | Sessioni 17-06 → 19-06 (32) | 54 · 14 | `A9_SESSIONI_17-06_19-06.md` |
| ✅ | **A10** | Sessioni 20-06 → 24-06 (36) | 71 · 20 | `A10_SESSIONI_20-06_24-06.md` |
| ✅ | **A11** | Sessioni 02-08 → 06-08 (41) | 55 · 20 | `A11_SESSIONI_02-08_06-08.md` |

\* M1 dichiara 42 agency ma la sua tabella ne ha 38 (M→A reale 22, non 26): errore aritmetico nella
fonte, **non** correggerlo a mano nel report — va registrato da S2 come divergenza.

### Mining — Archivi (linee B, C, D, E, F) — tutte fatte 06-08-26

| | ID | Perimetro | Dec · Agency | Report |
|---|----|-----------|--------------|--------|
| ✅ | **B1** | BHM-Zen meta + skill-system + guide (90) | 57 · 16 | `B1_BHM_META_E_SKILL.md` |
| ✅ | **B2** | BHM-Zen app-definition 1 (69) | 10 · 5 | `B2_BHM_APPDEF_1.md` |
| ✅ | **B3** | BHM-Zen app-definition 2 (69) | 22 · 8 | `B3_BHM_APPDEF_2.md` |
| ✅ | **C1** | HACCP legacy Sessions_Old (69 su disco) | 23 · 9 | `C1_LEGACY_SESSIONS_OLD.md` |
| ✅ | **C2** | HACCP legacy 2026-01-cleanup (89) | 23 · 8 | `C2_LEGACY_CLEANUP.md` |
| ✅ | **C3** | HACCP legacy knowledge-legacy + Knowledge (85) | 30 · 12 | `C3_LEGACY_KNOWLEDGE.md` |
| ✅ | **C4** | HACCP legacy Tests + Info_Complete (105) | 24 · 12 | `C4_LEGACY_TESTS_INFO.md` |
| ✅ | **C5** | HACCP legacy lezioni + rules + misc (41) | 30 · 8 | `C5_LEGACY_LEZIONI_E_REGOLE.md` |
| ✅ | **D1** | CalendarBackup vecchia, docs (86) | 32 · 10 | `D1_CB_OLD_DOCS.md` |
| ✅ | **D2** | CalendarBackup vecchia, Lavoro + Sessioni (46) | 71 · 23 | `D2_CB_OLD_SESSIONI.md` |
| ✅ | **E1** | Trading v.0 docs (97) | 40 · 8 | `E1_TRADING_V0_DOCS.md` |
| ✅ | **E2** | Trading v.0 reports (31) | 32 · 5* | `E2_TRADING_V0_REPORTS.md` |
| ✅ | **F1** | FREEDOM Trading (85) | 40 · 13 | `F1_FREEDOM_TRADING.md` |

### Mining — Privato, dialoghi, piani, fatti (linee G, H, I, J) — tutte fatte 06-08-26

| | ID | Perimetro | Dec · Agency | Report |
|---|----|-----------|--------------|--------|
| ✅ | **G1** | `_lavoro/Per matteo/` (51) | 53 · 14 | `G1_LAVORO_PER_MATTEO.md` |
| ✅ | **G2** | `_lavoro/Sessioni/` 12-05 → 22-05 (56) | 53 · 20 | `G2_LAVORO_SESSIONI_MAGGIO.md` |
| ✅ | **G3** | `_lavoro/` Storico + Supporto + e2e-s4 (13) | 39 · 10 | `G3_LAVORO_SUPPORTO_STORICO.md` |
| ✅ | **H1** | Parole tue, CB-v2, 27-04 → 15-05 (1.032 M-VOCE) | 58 · 25 | `H1_PAROLE_MATTEO_CB_1.md` |
| ✅ | **H2** | Parole tue, CB-v2, 16-05 → 31-05 (723 letti) | 52 · 16 | `H2_PAROLE_MATTEO_CB_2.md` |
| ✅ | **H3** | Parole tue, CB-v2, 01-06 → 06-08 (768 letti) | 60 · 20 | `H3_PAROLE_MATTEO_CB_3.md` |
| ✅ | **H4** | Preistoria feb-mar: CB-old, MathBoy2, Game, Qwen (634) | 47 · 16 | `H4_PREISTORIA_FEB_MAR.md` |
| ✅ | **H5** | Parallelo e luglio: Trade-Analyst, Trading-Platform, BHM (233) | 42 · 11 | `H5_PARALLELO_E_LUGLIO.md` |
| ✅ | **I1** | Piani prenotazioni / HACCP (113) | 35 · 12* | `I1_PIANI_PRENOTA_HACCP.md` |
| ✅ | **I2** | Piani giochi / trading / altro (33) | 28 · 9 | `I2_PIANI_ALTRI.md` |
| ✅ | **J1** | Fatti oggettivi: 1.074 commit, 72 migrazioni, 32 release | 15 · 7 | `J1_FATTI_OGGETTIVI.md` |

\* E2 e I1 hanno in tabella una riga in più di quella dichiarata (una riga-sentinella e una `A→A`
fuori schema): differenza voluta, non errore — vedi `01_INPUT_SINTESI.md` §3.

### Sintesi (catena obbligata — S5 in parallelo dopo S2)
- [x] **S1** — Catalogo decisioni cross · *serve: i 39 report* — **fatta 07-08-26** — `report/S1_CATALOGO_DECISIONI.md` — `_stato/S1.md`
- [x] **S2** — Agency e correzioni · *serve: S1* — **fatta 07-08-26** — `report/S2_AGENCY_E_CORREZIONI.md` — `_stato/S2.md`
- [x] **S3** — Albero skill + timeline + livelli · *serve: S1, S2* — **fatta 07-08-26** — `report/S3_ALBERO_SKILL_E_TIMELINE.md` — `_stato/S3.md`
- [x] **S4** — Falsificazione / contro-evidenze · *serve: S3* — **fatta 07-08-26** — `report/S4_CONTRO_EVIDENZE.md` — `_stato/S4.md`
- [x] **S5** — Ritratto metodologico · *serve: S2* (parallelizzabile con S3/S4) — **fatta 07-08-26** — `report/S5_RITRATTO_METODOLOGICO.md` — `_stato/S5.md`
- [x] **S6** — Dossier finale + banca domande senior · *serve: S1–S5* — **fatta 07-08-26** (spezzata S6a+S6b) — `_stato/S6.md` (+ `_stato/S6a.md`, `_stato/S6b.md`) · deliverable privati fuori da `report/`

### Interrogazione
- [x] **INT1** — Fase 1 dell'interrogazione (incrocio + protocollo + profilo unificato) — **fatta 07-08-26** — `_stato/INT1.md` — report `Report-fase1-interrogazione-07-08-26.md`

### Servizio
- [x] **AGG** — Allineamento checkbox da `_stato/` — **fatto 06-08-26** (39/39 mining) — ripetibile

---

## Regole comuni (valgono per ogni prompt — il dettaglio è nel piano §5)

> Le sei ondate di **Sintesi** hanno in più le loro regole specifiche, nella sezione «Sintesi» in
> fondo: leggile insieme a queste.

- Profilo **Verifica / Meta**. Sola lettura. **Nessun file `src/`.** Nessuna modifica a Archives o `_lavoro`.
- Report in `docs/Sessioni di lavoro/06-08-26/Indagine-Skill-Matteo/report/`. Stato in `_stato/`.
- **Schema §3.1 del piano obbligatorio** per le ondate di mining — 7 sezioni, colonne esatte, ID
  prefissati con l'ID ondata. Le ondate S non lo ricalcano: vedi le loro regole comuni.
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

> **Riscritti il 06-08-26 dopo aver misurato i 39 report veri.** I blocchi originali erano stati scritti
> prima che il mining esistesse e davano per scontate cose che il materiale ha smentito. Le dieci regole
> qui sotto valgono per **tutte e sei** e non si ripetono nei singoli blocchi: chi lancia un'ondata S le
> incolla insieme al prompt, oppure gli dice di leggerle qui.

### Regole comuni delle ondate S

1. **Precondizione bloccante.** Verifica che i `report/S*.md` d'ingresso della tua ondata esistano.
   Se mancano, **fermati e dillo**: senza S1/S2 i numeri non sono deduplicati e non vanno presentati
   come finali. Non ripiegare in silenzio sui report grezzi.
2. **Cosa è una riga.** Conta **solo** le righe della tabella con header letteralmente
   `ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill` (Sez. 1) o
   `ID | Direzione | Tipo prova | Cosa | Esito | Fonte` (Sez. 2). 15 report hanno tabelle satellite
   dentro le stesse sezioni: si leggono, non si contano (`01_INPUT_SINTESI.md` §3).
3. **Riconta, non fidarti dei totali dichiarati.** Tre report non tornano con il proprio `_stato/`
   (M1 −4, E2 +1, I1 +1). Se il tuo conteggio diverge, **segnalalo**: è materiale per il §6 del piano.
4. **Normalizza prima di aggregare.** 63 righe usano valori fuori vocabolario: applica la mappa di
   `01_INPUT_SINTESI.md` §2 e dichiara quale hai applicato. Le righe `A→A` non sono agency di Matteo.
5. **Due unità di copertura che non si sommano:** file (A/B/C/D/E/F/G/I/M), messaggi (H), fatti (J).
   Righe separate nella tua sezione di copertura, mai un totale unico.
6. **Citabile come parola sua solo ciò che sta dentro `«…»`.** Le Sezioni 4 e 7 dei report sono scritte
   dall'agente di mining, anche quando danno del tu a Matteo: sono parafrasi, non voce.
7. **Nomi ambigui, mai grep cieco:** «S4-sintesi» ≠ «Servizio-S4»; «M2-mining» ≠ «Calendario-M2»;
   «M3-mining» ≠ «M3 menu/magazzino».
8. **Volume.** Sono le ondate più pesanti del cantiere: lavora **per famiglia di linea**
   (M → A → B-F → G → H → I → J) e scrivi un file di lavoro intermedio per famiglia. **Autorizzato
   in anticipo:** gli intermedi vanno in `docs/_lavoro/Indagine-Corpus/` (fuori git) o negli scratch di
   sessione, **mai** in `report/`. Non serve chiedere il permesso per quelli.
9. **Output canonico:** un report in `report/` + un `_stato/<ID>.md`. Nient'altro senza chiedere Sì/No.
   Nel file di stato, al posto di «Decisioni/Agency estratte» metti i numeri della tua ondata (righe
   fuse, conflitti, skill classificate…): il criterio di accettazione §6 resta quello — se i numeri
   non ci sono, l'ondata non è fatta.
10. **Ogni report S chiude con tre sezioni fisse:** copertura dichiarata (numeri veri), lacune e
    handoff, e tre righe verso Matteo in linguaggio semplice — schermate e flussi, non nomi di file.

---

### S1 — Catalogo decisioni cross

```
Profilo: Verifica | Meta
Modalità: deep
Leggi prima: PIANO_INDAGINE.md §1 e §3.1; 01_INPUT_SINTESI.md (tutto — è il tuo materiale d'ingresso);
 le Regole comuni delle ondate S in 00_PROMPTS_SEQUENZA_TRACKING.md
Fonti: le Sezioni 1 dei 39 report + i conflitti già verbalizzati elencati in 01_INPUT_SINTESI.md §5
Non caricare: NESSUN file grezzo dei corpora. Se un dato non è in un report, non esiste: apri una
 lacuna, non riaprire il corpus.
Output attesi: report/S1_CATALOGO_DECISIONI.md + _stato/S1.md (+ intermedi di lavoro fuori da report/,
 già autorizzati) — niente altro senza chiedere Sì/No

Obiettivo: una tabella unica di tutte le decisioni, deduplicata, che regga a un'interrogazione.

Cosa fare:
0. Lavora per famiglia. Target noto: 1.826 righe (M 227 · A 683 · B-F 434 · G 145 · H 259 · I 63 ·
   J 15). Dichiara quante ne hai processate per famiglia: se non sommano, la sintesi non è finita.
   Non arrotondare e non fermarti in silenzio quando il contesto si riempie: dichiara e proponi lo
   split S1a/S1b.
1. Concatenare mantenendo gli ID d'origine (A4-D07 resta A4-D07). Solo le righe della tabella canonica
   (regola comune 2). Le tabelle «Rifiuti di Matteo» (M1 18 righe, B1 12, A3 10, B3 4) NON sono
   decisioni: tienile in un indice a parte — i rifiuti valgono doppio ma hanno schema diverso.
2. Normalizzare con la mappa di 01_INPUT_SINTESI.md §2 e dichiararla.
3. Deduplicare per TEMA, non per testo: non esiste una chiave comune (la stessa decisione è scritta
   con parole diverse in ogni linea). Parti dai 16 cluster già verificati (§4 dell'input), che sono un
   pavimento e non un soffitto, e cercane altri usando come chiavi gli eventi-cardine del piano §2.2.
   Una riga sola per decisione, con TUTTE le fonti elencate e il peso più alto.
4. Conflitti: PRIMA importa quelli già verbalizzati da altre ondate (§5 dell'input: tabella divergenze
   di H2, J1 §5.b, smentita della Console in M2, conflitto aperto sul prezzo carosello A2→H2→H3),
   citando la fonte originale — non riscoprirli. POI aggiungi i tuoi. Applica la regola §1 del piano
   con una sola eccezione dichiarata: su «autore git = lavoro suo» né git né i report bastano da soli,
   serve H — non chiuderlo a favore di J1.
5. Tabelle di sintesi: per tipo, per mese, per autonomia, per linea/progetto. Due avvertenze da
   scrivere sotto le tabelle, non da nascondere: J1 va in riga separata (lì Chi=MATTEO è convenzione
   da autore-commit, non decisione) e H ha Chi=MATTEO al 100% per costruzione del perimetro.
6. Top 30 decisioni più significative, con il criterio dichiarato (impatto + autonomia + tracciabilità).

Cosa NON fare: non correggere i report d'origine; non risolvere i conflitti lasciati aperti dalle
ondate H (registrali come aperti, li eredita S4); non inventare una decisione per far quadrare un
totale.

Criterio di fatto: ogni riga ha almeno una fonte; i totali per famiglia sommano a 1.826; i cluster di
dedup sono elencati con gli ID fusi; i conflitti sono elencati, non nascosti. Parti forte: sulle 2.432
righe del corpus è già stato verificato che non c'è nemmeno una fonte mancante né una collisione di ID.
```

**Regia consigliata per S1 (squadra di subagent).** È l'ondata più pesante del cantiere. Il taglio che
regge è **per famiglia di linea**: i lotti sono indipendenti e ogni totale è verificabile da solo.

| Lotto | Report | Righe attese |
|-------|--------|--------------|
| L1 | M1–M4 | 227 |
| L2 | A1–A6 | 382 |
| L3 | A7–A11 | 301 |
| L4 | B1–B3, C1–C5, D1–D2, E1–E2, F1 | 434 |
| L5 | G1–G3, I1–I2, J1 | 223 |
| L6 | H1–H5 | 259 |

Ogni subagent **estrae e normalizza il suo lotto e basta**: non deduplica (la dedup è cross-lotto) e
non scrive in `report/`. Il senior fonde, deduplica sui 16 cluster + quelli nuovi, risolve i conflitti
e firma il report. Se un lotto non torna col suo numero, si rifà quel lotto — non tutta l'ondata.

### S2 — Agency e correzioni

```
Profilo: Verifica | Meta
Modalità: deep
Precondizione: report/S1_CATALOGO_DECISIONI.md deve esistere. Se non c'è, fermati.
Leggi prima: S1; 01_INPUT_SINTESI.md §1, §2, §3, §5, §9; le Regole comuni delle ondate S;
 docs/Comunicazione-Skill/ERRORI_PROCESSO.md
Fonti: le Sezioni 2 dei 39 report (606 righe reali) + gli handoff → S2 in 01_INPUT_SINTESI.md §9
Output attesi: report/S2_AGENCY_E_CORREZIONI.md + _stato/S2.md — niente altro senza chiedere Sì/No

Obiettivo: rispondere alle due domande centrali di Matteo — quando ha corretto lui, quando è stato
corretto.

DA SCRIVERE IN TESTA AL REPORT, prima di ogni numero: le correzioni A→M sono strutturalmente
sotto-contate. Il testo degli agenti nei transcript è oscurato (19.198 righe su 22.862, piano §2.1):
quando l'agente ha corretto Matteo, quella frase non è leggibile. 157 A→M contro 383 M→A NON significa
che veniva corretto raramente: significa che le sue correzioni sono visibili e quelle degli agenti no.
Chi legge il dossier deve saperlo prima di vedere il rapporto.

Cosa fare:
0. Target noto: 606 righe contate (M 72 · A 235 · B-F 138 · G 44 · H 88 · I 22 · J 7), 608 dichiarate.
   Riconta: M1 dichiara 42 e ne ha 38 (M→A reale 22), E2 e I1 hanno una riga-sentinella in più.
   Escludi le 3 righe `A→A` (non sono agency di Matteo) e dichiaralo: due report le trattano in modo
   opposto fra loro.
1. Tabella M→A (lui corregge): cosa, in che materia, con quale esito. Raggruppa per materia —
   correggere sul prodotto e correggere sul codice sono skill diverse. Conta.
2. Tabella A→M (lo correggono): SEPARA `DIRETTA` (492 nel corpus) da `DEDOTTA` (108) e non mescolarle
   mai in un totale unico.
3. Tabella M↔M (cambia idea da solo): distingui «scoperta di prodotto» (nuova informazione) da «errore
   corretto» (aveva sbagliato). Serve la citazione del motivo, altrimenti → INCERTO. Caso di prova:
   il limite coperti giornaliero costruito l'11-06 e rimosso il 18-06 è classificato dai report come
   cambio di modello, non come errore — e nessuna citazione lo smentisce. Non forzarlo in nessuna
   delle due direzioni: riporta cosa c'è scritto.
4. Evoluzione nel tempo: la quota di ORIGINATE cresce nei mesi? Le A→M calano? Numeri per periodo, e
   attenzione al confronto tra linee: su H (parole sue) ORIGINATA è il 71%, ma H è per costruzione solo
   materiale suo — confronta H con H, A con A, non l'uno contro l'altro.
5. La domanda scomoda, da rispondere esplicitamente con i numeri: le correzioni M→A riguardano il
   MERITO (la scelta era sbagliata) o la FORMA (non hai seguito il processo)? Materiale già pronto: 9
   report A su 11 hanno in coda alla Sezione 2 una tabella «Follow-up CORREGGONO vs ESTENDONO» — non
   sono righe di agency (non contarle), ma sono esattamente la distinzione che ti serve qui.
6. Handoff da onorare (§9): la peer-review anti-falso-positivo di C1 contro la «cerimonia LOCKED» di
   C4, e la domanda aperta di J1 — perché il capitolo Servizio-S4 non è mai arrivato su `main`: scelta
   esplicita o mai chiesto?

Criterio di fatto: i totali per famiglia sommano a 606; DIRETTA e DEDOTTA restano separate ovunque; il
limite del materiale (testo agenti oscurato) è dichiarato in testa e non solo in nota.
```

### S3 — Albero skill + timeline + livelli

```
Profilo: Verifica | Meta
Modalità: deep
Precondizione: report/S1_CATALOGO_DECISIONI.md e report/S2_AGENCY_E_CORREZIONI.md devono esistere.
Leggi prima: S1, S2; 01_INPUT_SINTESI.md §6, §7, §8, §9; PIANO_INDAGINE.md §3.4 (scala L0–L4) e §2.2
 (cronologia vera); le Regole comuni delle ondate S
Fonti: le Sezioni 3 dei 39 report (568 righe) + le Sezioni 3 di H1–H5 per la colonna PARLATA
Output attesi: report/S3_ALBERO_SKILL_E_TIMELINE.md + _stato/S3.md — niente altro senza chiedere Sì/No

Obiettivo: l'albero di skill, con un livello assegnato e provato per ogni ramo.

Cosa fare:
1. Rami: usa i 10 di 01_INPUT_SINTESI.md §6, ricavati dai dati veri. Il lessico è esploso — 1.313
   etichette distinte su 1.826 decisioni, il 72% usate una volta sola — quindi senza quello scaffold
   il lavoro non è riproducibile. Puoi cambiarlo, ma se lo fai dichiara perché. Ciò che non entra va
   in «non classificato», mai forzato dentro un ramo né sistemato in un ramo nuovo silenzioso.
   L'albero PUÒ essere incoerente: è una richiesta esplicita di Matteo, non un difetto.
2. Normalizza la Sezione 3 prima di unire: nessun report ha ID propri lì, le colonne si chiamano in 6
   modi diversi e M1/M4 ne hanno 5 invece di 4. Schema canonico: {skill, livello, evidenza_ID,
   contro_evidenza}.
3. Livelli: nessun livello senza ID di decisione o agency. Tre regole dure:
   - i livelli ibridi («L2–L3», «L3→L4», «L4 cand.», «L4?») valgono **L2** finché non fai davvero il
     cross-check che rimandano — non ri-rimandarlo;
   - L3/L4 senza contro-evidenza cercata → declassa a L2. La lista delle 8-10 righe in questa
     condizione è già pronta in §7 dell'input, ma **prima di declassare leggi il testo subito dopo la
     tabella**: B1 ha una dichiarazione collettiva che potrebbe coprirle;
   - separa **L4 di sistema** da **L4 di persona**: M1 e M4 producono 23 delle ~50 L4 del corpus
     perché leggono documentazione di skill già scritta — la prova «è diventata regola» è il file
     stesso, il che è circolare. M3 lo fa già («L1–L2 su Matteo / L4 di sistema»): fallo ovunque.
4. Tripla colonna DICHIARATA (G1/Scuola) | ESERCITATA (A–F, I, J, M) | PARLATA (H). Attenzione: esiste
   abbozzata solo in 9 report (A2–A10) e lì la colonna PARLATA è **sempre un placeholder mai risolto**
   («da verificare in H3») — perché quando le ondate A sono state scritte, H non esisteva ancora.
   Oggi H esiste: **compila PARLATA da zero leggendo H1–H5**, non ricopiare i placeholder.
   Dichiara i rami dove una colonna resta legittimamente vuota (§7 dell'input ne indica tre).
   Le righe dove le tre colonne divergono sono le domande migliori per l'interrogazione: marcale.
5. Timeline: usa la sequenza VERA (§8 dell'input, piano §2.2) — giochi + CB-old (feb-mar) → CB-v2 dal
   27-04 → trading IN PARALLELO (mag-giu) → BHM e Trading-Platform (lug) → ritorno a CB-v2 (ago).
   La sequenza «HACCP → BHM → CB vecchia → CB-v2 → Trading → giochi» che stava qui è FALSA: era
   nell'ipotesi iniziale ed è stata smentita dal corpus. Il buco 22-06 → 02-08 non è una pausa, è un
   cambio di progetto. Le date delle linee B/C non si prendono dal filesystem (copia in blocco).
6. Frecce di trasferimento del metodo: le sezioni dedicate esistono solo in B1, F1, M1 (+ H5 in prosa,
   che è l'unica fonte sul buco estivo). C3 e C5 hanno solo note sparse: non cercare un'intestazione
   che non c'è. Datale.
7. Sezione «cosa NON risulta»: skill che ci si aspetterebbe e che il corpus non mostra.
8. Consegna a S4, in una sezione dedicata, l'elenco delle skill che dichiari L3 o L4: è il suo input.

Criterio di fatto: ogni foglia ha un livello con almeno un ID; nessun ibrido lasciato ibrido; PARLATA
compilata con ID di H, non con rimandi; la timeline non contiene la sequenza smentita.
```

### S4 — Falsificazione / contro-evidenze

```
Profilo: Verifica | Meta — QUESTA ONDATA LAVORA CONTRO LE ALTRE
Modalità: deep
Precondizione: report/S3_ALBERO_SKILL_E_TIMELINE.md deve esistere (ti serve la sua lista di skill
 L3/L4). Se non c'è, fermati.
Leggi prima: S1, S2, S3; 01_INPUT_SINTESI.md §5, §7, §9; le Regole comuni delle ondate S
Fonti: le Sezioni 4 dei 39 report (≈352 contro-evidenze) + gli handoff → S4 sparsi nelle Sezioni 6
 (elencati in §9 dell'input) + J1_FATTI_OGGETTIVI.md §5.b (sottosezione fuori schema, facile da
 saltare: sta dopo la Sezione 5)
Output attesi: report/S4_CONTRO_EVIDENZE.md + _stato/S4.md — niente altro senza chiedere Sì/No
Attenzione ai nomi: qui «S4» sei tu, l'ondata di falsificazione. «Servizio-S4» è una milestone di
 prodotto e ricorre in A10, A11, M3, J1. Mai un grep cieco su "S4".

Obiettivo: rendere il dossier difendibile. Tutte le ondate precedenti hanno cercato prove a favore.
Questa cerca il contrario, e lo fa sul serio.

Cosa fare:
0. Prima di analizzare, RACCOGLI il lavoro già fatto e non ancora usato — se salti questo passo, lo
   perdi: la tabella «Divergenze esplicite vs A1/A2» di H2 (8 righe con verdetto già scritto), le 7
   divergenze report↔git di J1 §5.b, i cataloghi dei piani abbandonati in I1 §4.1 (solo 23 completed
   su 113) e I2 §4.1 (28 piani su 33 senza tracking), le tabelle contro-evidenze già pronte in M1, e
   tutti gli altri handoff → S4 elencati in §9 dell'input.
1. Per ogni skill dichiarata L3 o L4 da S3: cercare almeno un caso in cui quella stessa skill è
   mancata — decisione delegata, errore ripetuto, correzione A→M nella stessa materia, piano
   abbandonato, divergenza tra dichiarato e git.
2. Verdetto per ogni skill: `REGGE` (contro-evidenza cercata, non trovata o marginale) ·
   `RIDIMENSIONATA` (declassata, con il nuovo livello) · `NON REGGE` (l'evidenza a favore era debole).
   Parti dalla lista già pronta in §7 dell'input: le righe L3/L4 senza contro-evidenza cercata (H1, H2,
   H3, M1×2, M3, M4×2) sono candidate al declassamento — ma verifica prima se una dichiarazione
   collettiva dopo la tabella le copre, come in B1.
3. Il caso strutturale da trattare a parte: M1 e M4 producono metà delle L4 del corpus perché leggono
   documentazione di skill. La prova «è diventata regola» è il file stesso: circolare. Dichiara quali
   L4 reggono solo su quella circolarità.
4. Elenco delle «prove fragili»: righe basate su una sola fonte di peso 3 o 4, o su una deduzione.
5. Attribuzione impropria, nelle due direzioni: errori non suoi che un report gli ha attribuito, e
   viceversa. Due casi già noti da verificare: l'attribuzione git (autore = Matteo su 1.048 commit non
   prova che il codice sia suo; ci sono 25 commit di un'altra persona) e l'accettazione della Console
   firmata da un altro «nei panni di Matteo».
6. Correggi anche le ipotesi sbagliate del piano stesso, se il corpus le ha smentite: la Console NON è
   stata «abbandonata in 2 giorni» (M2 lo dimostra: REQ accettate, sprint chiuso, poi silenzio).
   Un'ondata di falsificazione che non falsifica anche il proprio committente è incompleta.
7. Le 10 domande più scomode che un senior potrebbe fargli, con l'evidenza che le motiva.
8. Lascia esplicitamente aperto ciò che resta aperto (es. il prezzo del carosello, mai chiuso da A2,
   H2 né H3): un «non lo sappiamo» tracciato vale più di una chiusura inventata.

Regola: qui non si è gentili e non si è cattivi. Si è precisi. Un dossier che non sopravvive a questa
ondata non sarebbe sopravvissuto all'interrogazione.
```

### S5 — Ritratto metodologico

```
Profilo: Verifica | Meta
Modalità: deep
Precondizione: report/S2_AGENCY_E_CORREZIONI.md deve esistere. S3 e S4 NON servono: puoi girare in
 parallelo a loro.
Leggi prima: S2; 01_INPUT_SINTESI.md §7 (citazioni e pesi) e §8; le Regole comuni delle ondate S
Fonti: M1, M2, M3, M4, G1, G2, G3, H1, H2, H3, H4, **H5** e le tabelle «Numeri di ritmo» delle H
Output attesi: report/S5_RITRATTO_METODOLOGICO.md + _stato/S5.md — niente altro senza chiedere Sì/No

Obiettivo: come lavora Matteo, detto SOLO con citazioni raggruppate. Nessuna diagnosi, nessun
aggettivo che non sia in una fonte.

Regole di peso, da applicare prima di scrivere una riga:
- **Citabile come parola sua solo ciò che sta dentro `«…»`.** Le Sezioni 4 e 7 dei report sono
  scritte dall'agente di mining, anche quando danno del tu a Matteo. Non sono voce sua.
- Il corpus ha 2.802 citazioni, ma solo **408 sono di peso 1** (H). Le 929 dei report A sono comunque
  parole sue, ma **selezionate** da un agente: H dà densità e distribuzione, A dà il momento che
  contava. Dichiara quale delle due stai usando, riga per riga.
- **G3 è scritto in prima persona ma resta peso 3.** Solo PROFILO_SCOLASTICO (G1) ha la deroga del
  piano §2. È l'errore più facile da fare in questa ondata.
- **H5 è obbligatoria** (mancava dalla lista originale): è l'unica fonte sul buco 22-06 → 02-08 e
  sull'esportazione del metodo verso gli altri progetti.

Assi (ognuno = un gruppo di citazioni con fonte). Materiale verificato disponibile per tutti e sette:
- come apre un lavoro e come lo chiude — nascita e consolidamento del vocabolario di comando (H2, H3);
- come gestisce l'ambiguità e lo scope — `product-scoping` è l'etichetta più frequente del corpus,
  e in G1 c'è la sua auto-osservazione sullo scope creep;
- rapporto con il dettaglio tecnico: cosa vuole sapere e cosa delega esplicitamente;
- controllo qualità: di cosa non si fida, cosa ricontrolla di persona (G1: le sue checklist);
- come vuole che gli si parli — fonte primaria `Supporto/Metodo_spiegazioni_agenti_coding` (G3-D01…D09),
  da citare per esteso, **ma con il caveat**: è quasi una fonte sola. Non presentarlo come confermato
  da fonti multiple quando non lo è;
- come reagisce quando l'agente sbaglia, e quando sbaglia lui;
- ritmo e continuità: è l'asse meglio strumentato di tutto il corpus (le tabelle «Numeri di ritmo» di
  H1–H5: lunghezza media e mediana, frequenza, datazione parola per parola). Il buco estivo va
  raccontato come cambio di progetto, non come pausa.

Due sezioni obbligatorie:
- «Auto-descrizione vs comportamento»: cosa dice di sé (G1/Scuola) accanto a cosa mostrano i dialoghi
  (H). Dove coincidono e dove no. Senza giudizio. La tensione centrale è già individuata e lasciata
  aperta da G1: si dichiara «principiante senza competenza tecnica formale» mentre lo stesso corpus
  mostra collaudi multi-viewport, seed di database, verifiche RLS cross-tenant. Non risolverla
  inventando un livello: mostrala.
- «Cosa i file NON dicono», per esteso — è la parte che protegge Matteo da un ritratto che sembra
  completo e non lo è. Almeno queste quattro assenze, già verificate: (a) il motivo del ritorno su
  CalendarBackup ad agosto non è dichiarato da nessuna parte, né in H3 né in H5; (b) 19.198 righe su
  22.862 di testo degli agenti sono oscurate, quindi metà dei dialoghi non è leggibile; (c) i file
  con nomi di credenziali non sono mai stati aperti, per scelta; (d) quello che il corpus non contiene
  affatto — vita fuori dal lavoro, contesto personale — non va dedotto.
```

### S6 — Dossier finale + banca domande senior

```
Profilo: Verifica | Meta
Modalità: deep
Precondizione: report/S1…S5 devono esistere TUTTI E CINQUE. Se ne manca anche uno, fermati e dillo:
 un dossier costruito su somme non deduplicate è il modo più veloce per farsi smontare a voce.
Leggi prima: S1–S5, P0, P0-EX; 01_INPUT_SINTESI.md §1 e §8; PIANO_INDAGINE.md §0 (prompt iniziale di
 Matteo, da riportare in testa) e §2.1 (limiti noti)
Non caricare: nessun mining nuovo
Output attesi: report/S6_DOSSIER_PROFILO_MATTEO.md + _stato/S6.md — niente altro senza chiedere Sì/No

Obiettivo: il documento con cui Matteo entrerà nella chat di interrogazione senior.

Struttura obbligatoria:
1. Prompt iniziale di Matteo, verbatim.
2. Metodo e limiti dell'indagine, onesti. La frase sulla copertura NON è «letto tutto riga per riga»:
   è «100% dei file del perimetro **aperti**, con profondità variabile per regime». Dichiara i casi
   concreti (§8 dell'input): alcuni documenti da oltre 1 MB letti per sezioni mirate; tre file con
   nomi di credenziali mai aperti per scelta; centinaia di file non-`.md` contati e non estratti.
   Più i limiti veri: testo degli agenti oscurato, auto-dichiarazioni, date del filesystem inaffidabili
   negli archivi. Il buco 22-06 → 02-08 va spiegato come cambio di progetto, non come pausa.
3. Mappa dei corpora A–J con i numeri finali, ondata per ondata. **I numeri finali sono quelli
   deduplicati di S1/S2, non le somme grezze** (1.826 decisioni e 606 agency sono somme pre-dedup:
   se le usi, etichettale così). Tieni separate le tre unità: file, messaggi, fatti.
   Una discrepanza da riportare, non da nascondere: P0-EX conta 3.412 messaggi di sua voce, la somma
   dei letti dichiarati da H1–H5 ne fa 3.321. Parte è spiegabile (perimetro vs righe leggibili), il
   resto no. Sul dato di peso 1 non si arrotonda: o lo riconcili o lo dichiari.
4. Albero delle skill con i livelli DOPO S4 (restano PROVVISORI: si confermano a voce), distinguendo
   L4 di sistema da L4 di persona.
5. Le 20 decisioni che meglio rappresentano ciascun ramo, con fonte.
6. Agency in numeri: ORIGINATE, APPROVATE, correzioni per direzione, nel tempo — con in testa
   l'avvertenza che le correzioni degli agenti verso Matteo sono strutturalmente sotto-contate.
7. Ritratto per citazioni (rimando a S5, non ricopiarlo).
8. **Banca domande per l'interrogazione.** Va scritta DA ZERO: nei 39 report non esiste una sola
   domanda pre-formulata per il senior (verificato). La materia prima sono le contro-evidenze di S4,
   le tensioni marcate «aperto»/INCERTO, e le divergenze tra fonti di peso diverso. Divisa in tre:
   a. domande che verificano una skill rivendicata («raccontami perché il 18-06 hai rimosso il limite
      giornaliero» — la risposta si confronta con la fonte);
   b. domande scomode da S4;
   c. domande aperte su ciò che i file non dicono.
   Ogni domanda porta con sé la fonte e la risposta attesa dal corpus, in modo che il senior possa
   valutare senza rileggere tutto.
9. Nota privato vs pubblico: dei 77 file di `docs/_lavoro` tracciati da git, 67 sono log tecnici di
   sessione; `Per matteo/` resta privata all'88% e `Scuola/` al 100%. Quindi il dossier che finisce
   sulla repo non contiene la parte più personale del materiale: dillo esplicitamente, perché cambia
   cosa è opportuno citare per esteso e cosa va citato solo come path.

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

Nota (06-08-26): le 39 righe di mining sono già allineate e sono passate da checkbox a tabella (con
decisioni, agency e nome del report). Restano da spuntare solo S1–S6. In _stato/ ci sono anche file
`_tmp_*` — sono scarti di lavoro delle ondate H, non file di stato: ignorali.
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

**Per le ondate S** le due righe di conteggio cambiano nome ma non spariscono — sono il criterio di
accettazione (§6 del piano). Esempio per S1: `Righe in ingresso: 1.826 (M 227 · A 683 · B-F 434 ·
G 145 · H 259 · I 63 · J 15)` / `Righe dopo dedup: N (K cluster fusi, C conflitti aperti)`.

---

## Log spunte (append-only)

| Quando | ID | Agente/modello | Report | Nota |
|--------|----|----------------|--------|------|
| 06-08-26 | M1–J1 (39) | vari (ondate di mining) | `report/` | Mining completato: 1.826 decisioni, 606 agency, ≈352 contro-evidenze |
| 06-08-26 | AGG | senior + 3 revisori Sonnet | — | Checkbox allineate da `_stato/`; blocco Sintesi S1–S6 riscritto sui report veri; creato `01_INPUT_SINTESI.md` |
| 07-08-26 | S1 | Verifica \| Meta | `report/S1_CATALOGO_DECISIONI.md` | Checkbox allineata da `_stato/S1.md` (1.703 decisioni dopo dedup) |
| 07-08-26 | S2 | Verifica \| Meta | `report/S2_AGENCY_E_CORREZIONI.md` | Checkbox allineata da `_stato/S2.md` |
| 07-08-26 | S3 | Verifica \| Meta | `report/S3_ALBERO_SKILL_E_TIMELINE.md` | Checkbox allineata da `_stato/S3.md` |
| 07-08-26 | S4 | Verifica \| Meta | `report/S4_CONTRO_EVIDENZE.md` | Checkbox allineata da `_stato/S4.md` |
| 07-08-26 | S5 | Verifica \| Meta | `report/S5_RITRATTO_METODOLOGICO.md` | Checkbox allineata da `_stato/S5.md` |
| 07-08-26 | S6 (S6a+S6b) | Verifica \| Meta | dossier + banca (privati in `_lavoro/`) | Checkbox allineata da `_stato/S6.md` (+ S6a/S6b) |
| 07-08-26 | INT1 | Verifica \| Meta | `Report-fase1-interrogazione-07-08-26.md` | Fase 1 chiusa; checkbox da `_stato/INT1.md` |
| 07-08-26 | AGG | Meta deep (pulizia) | — | Checkbox S1–S6 + INT1 allineate da `_stato/`; cantiere CHIUSO lato tracking |
