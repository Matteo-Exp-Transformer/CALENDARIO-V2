# Indagine Skill Matteo — Prompt in sequenza + tracking

> **Piano:** `.cursor/plans/indagine_skill_matteo_c67db55c.plan.md`  
> **Uso:** copia il blocco del prossimo prompt `⬜` in una chat Agent nuova.  
> **A fine ondata l’agente DEVE:** (1) spuntare `- [ ]` → `- [x]` qui sotto e nella sezione Stato rapido; (2) scrivere data + path report; (3) 2–3 righe «Chiusura verso Matteo» in linguaggio semplice nel report.  
> **Prompt iniziale di Matteo** (scopo dell’indagine): ricostruire skill/decisioni/agency/ritratto dal corpus multi-progetto, poi usare i report per interrogazione senior di validazione.

---

## Stato rapido

- [ ] **P0** Inventario A–H — report: `00_INVENTARIO_CORPUS_MULTIPROGETTO.md` — data: — — note: —
- [ ] **P1** Meta Comunicazione CB-v2 — report: `01_META_COMUNICAZIONE_CB_V2.md` — data: — — note: —
- [ ] **P2A** Sessioni CB 23-05→28-05 — report: `02A_SESSIONI_CB_23-05_28-05.md` — data: — — note: —
- [ ] **P2B** Sessioni CB 29-05→03-06 — report: `02B_SESSIONI_CB_29-05_03-06.md` — data: — — note: —
- [ ] **P2C** Sessioni CB 04-06→12-06 — report: `02C_SESSIONI_CB_04-06_12-06.md` — data: — — note: —
- [ ] **P2D** Sessioni CB 13-06→24-06 — report: `02D_SESSIONI_CB_13-06_24-06.md` — data: — — note: —
- [ ] **P2E** Sessioni CB 02-08→06-08 + unione — report: `02E_…` + `02_UNIONE_CRONOLOGIA_CB_V2.md` — data: — — note: —
- [ ] **P3** BHM-Zen — report: `03_BHM_ZEN_DECISIONI_E_SKILL.md` — data: — — note: —
- [ ] **P4** HACCP legacy — report: `04_HACCP_LEGACY_ORIGINI.md` — data: — — note: —
- [ ] **P5** CalendarBackup-oldversion — report: `05_CALENDARBACKUP_OLD_ANTECEDENTI.md` — data: — — note: —
- [ ] **P6** Trading v.0 + FREEDOM — report: `06_TRADING_V0_E_FREEDOM.md` — data: — — note: —
- [ ] **P7A** `_lavoro` Scuola/roadmap — report: `07A_LAVORO_SCUOLA_ROADMAP.md` — data: — — note: —
- [ ] **P7B** `_lavoro` Test/Comandi/Fable — report: `07B_LAVORO_TEST_COMANDI_FABLE.md` — data: — — note: —
- [ ] **P7C** `_lavoro` Sessioni maggio precoce — report: `07C_LAVORO_SESSIONI_MAGGIO_PRECOCE.md` — data: — — note: —
- [ ] **P7D** `_lavoro` Supporto/Storico + unione — report: `07D_…` + `07_UNIONE_LAVORO_PRIVATO.md` — data: — — note: —
- [ ] **P8A** Transcripts CB-v2 — report: `08A_TRANSCRIPTS_CB_V2.md` — data: — — note: —
- [ ] **P8B** Transcripts BHM/Trading/CB-old — report: `08B_TRANSCRIPTS_BHM_TRADING_CBOLD.md` — data: — — note: —
- [ ] **P8C** Unione transcripts — report: `08_TRANSCRIPTS_MINING.md` — data: — — note: —
- [ ] **P9** Catalogo decisioni cross — report: `09_CATALOGO_DECISIONI_CROSS.md` — data: — — note: —
- [ ] **P10** Agency e correzioni — report: `10_AGENCY_E_CORREZIONI_CROSS.md` — data: — — note: —
- [ ] **P11** Albero skill + timeline — report: `11_ALBERO_SKILL_E_TIMELINE.md` — data: — — note: —
- [ ] **P12** Ritratto metodologico — report: `12_RITRATTO_METODOLOGICO_FONTI.md` — data: — — note: —
- [ ] **P13** Dossier + banca domande senior — report: `13_DOSSIER_PROFILO_LAVORO_MATTEO.md` — data: — — note: —

**Dipendenze:** P0 prima di tutto. Dopo P0, P1–P8 (sotto-ondate) possono andare in parallelo tra linee diverse. P2E richiede P2A–D. P7D richiede P7A–C. P8C richiede P8A–B. P9 richiede report P1–P8. P10 richiede P9 (+ P8). P11 richiede P9–P10. P12 richiede P1, P7, P8, P10. P13 richiede P9–P12.

---

## Regole comuni (valgono per ogni prompt)

- Profilo **Verifica / Meta** — sola lettura corpora; **nessun** codice app (`src/`) da modificare.
- Output **solo** sotto `docs/Sessioni di lavoro/06-08-26/Indagine-Skill-Matteo/` (o cartella data sessione reale se diversa).
- Schema report obbligatorio: decisioni tipizzate | agency | correzioni (Matteo→agente / agente→Matteo / incerto) | skill signals | citazioni ritratto | lacune | handoff.
- Anti-allucinazione: ogni decisione ha ≥1 fonte citabile; se non è chiaro chi ha deciso → `incerto`.
- Sensibilità: **no** dump di segreti, chiavi, PII, contratti interi; solo path + sintesi.
- `docs/_lavoro/` e agent-transcripts: usare **path assoluti** (gitignored / fuori root git). Glob/Grep workspace possono non vederli.
- A fine lavoro: spunta questo file + chiusura verso Matteo in linguaggio semplice.
- **Niente output in più senza chiedere Sì/No prima** (freno scope creep).
- L’esecutore può solo **alzare** la modalità (light→standard→deep), mai abbassarla.

**Linee corpus:** A = CB-v2 vivo · B = BHM-Zen · C = HACCP legacy · D = CB-old · E = Trading v.0 · F = FREEDOM Trading · G = `_lavoro` · H = transcripts Cursor.

---

## Prompt P0 — Inventario A–H

- [ ] Completato — data: — — report: `00_INVENTARIO_CORPUS_MULTIPROGETTO.md`

```
Profilo: Verifica | Meta
Modalità: deep
Skill da leggere: docs/APP_CONTEXT_SKILL.md §0 (orientamento); docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md (solo schema report se utile); piano indagine .cursor/plans/indagine_skill_matteo_c67db55c.plan.md; questo file 00_PROMPTS_SEQUENZA_TRACKING.md
Non caricare: codice src/; skill Prenota/Menu QR intere
Output attesi: 1 file 00_INVENTARIO_CORPUS_MULTIPROGETTO.md sotto docs/Sessioni di lavoro/06-08-26/Indagine-Skill-Matteo/; spunta P0 in 00_PROMPTS_SEQUENZA_TRACKING.md — niente output in più senza chiedere Sì/No prima

Obiettivo: costruire l'indice navigabile di TUTTI i corpora A–H (vivo, Archives, docs/_lavoro autorizzato, agent-transcripts Cursor) per l'indagine skill di Matteo.

Cosa fare:
1. Contare e mappare cartelle docs/Sessioni di lavoro/, docs/Archives/*, docs/_lavoro/* (path assoluti), agent-transcripts sotto C:\Users\matte.MIO\.cursor\projects\ (CB-v2, BHM-v-2, BHM-Zen, Trade-Analyst-Agent, Trading-Platform-main, Calendarbackup).
2. Assegnare ogni path a linea A–H; segnalare ambiguità.
3. Tag high-signal: senior|meta|owner|decisioni|controverifica|dossier|lezioni|OSSERVAZIONI|PDR|masterplan|PROFILO_SCOLASTICO|Q1.
4. Timeline grezza min/max date per linea.
5. Elenco file prioritari da leggere nelle fasi successive.

Cosa NON fare: non analizzare ancora decisioni in profondità; non modificare Archives/_lavoro; non dumpare segreti.

Criterio di fatto: indice con conteggi per linea + lista priorità; checkbox P0 = [x]; chiusura verso Matteo in 3 righe semplici.
```

---

## Prompt P1 — Meta Comunicazione CB-v2

- [ ] Completato — data: — — report: `01_META_COMUNICAZIONE_CB_V2.md`

```
Profilo: Verifica | Meta
Modalità: deep
Skill da leggere: docs/Comunicazione-Skill/* (intero); docs/Archivio/CONTESTO_PRODOTTO.md; _skill-system-v0/README.md; report senior/meta elencati in 00_INVENTARIO
Non caricare: src/; Archives (salvo link già in inventario)
Output attesi: 01_META_COMUNICAZIONE_CB_V2.md; spunta P1 in 00_PROMPTS_SEQUENZA_TRACKING.md — niente output in più senza chiedere Sì/No prima

Obiettivo: estrarre decisioni di Matteo e segnali sul suo modo di lavorare dallo strato Meta/Comunicazione/skill system di CalendarBackup-v2.

Focus: VOCABOLARIO e ARCHIVIO_DECISIONI (accettate/rifiutate); OSSERVAZIONI + ARCHIVIO_OSSERVAZIONI; ERRORI_PROCESSO (chi ha sbagliato); EVOLUZIONE_SKILLS (mandato educare Matteo); dossier/report senior 02-06/04-06/31-05; CONTESTO_PRODOTTO.

Schema report: decisioni tipizzate, agency, correzioni, skill signals, citazioni ritratto, lacune, handoff a P2 e P12. Tag linea A.
```

---

## Prompt P2A — Sessioni CB 23-05→28-05

- [ ] Completato — data: — — report: `02A_SESSIONI_CB_23-05_28-05.md`

```
Profilo: Verifica | Meta
Modalità: deep
Skill da leggere: 00_INVENTARIO (priorità); docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md (schema Q1)
Non caricare: Archives; docs/_lavoro; src/
Output attesi: 02A_SESSIONI_CB_23-05_28-05.md; spunta P2A — niente output in più senza chiedere Sì/No prima

Obiettivo: mining report in docs/Sessioni di lavoro/ dal 23-05-26 al 28-05-26. Estrarre decisioni Matteo, prompt Q1 verbatim, follow-up che correggono vs estendono lo scope, QA Matteo vs solo agenti.

Priorità file: chiusure, «Decisioni di Matteo», Q1 completi, senior/meta. Focus tipico: fondamenta prodotto, tenant_features, Menu QR fase 1, PWA. Tag linea A.
```

---

## Prompt P2B — Sessioni CB 29-05→03-06

- [ ] Completato — data: — — report: `02B_SESSIONI_CB_29-05_03-06.md`

```
Profilo: Verifica | Meta
Modalità: deep
Skill da leggere: 00_INVENTARIO (priorità); CHIUSURA_SESSIONE schema Q1
Non caricare: Archives; docs/_lavoro; src/
Output attesi: 02B_SESSIONI_CB_29-05_03-06.md; spunta P2B — niente output in più senza chiedere Sì/No prima

Obiettivo: mining docs/Sessioni di lavoro/ dal 29-05-26 al 03-06-26. Stesso schema di P2A (decisioni, Q1, agency, correzioni).

Focus tipico: skill system vivo, disambiguazione Prenota vs Menu QR, prepara-prompt, layout, meta senior. Tag linea A.
```

---

## Prompt P2C — Sessioni CB 04-06→12-06

- [ ] Completato — data: — — report: `02C_SESSIONI_CB_04-06_12-06.md`

```
Profilo: Verifica | Meta
Modalità: deep
Skill da leggere: 00_INVENTARIO (priorità); CHIUSURA_SESSIONE schema Q1
Non caricare: Archives; docs/_lavoro; src/
Output attesi: 02C_SESSIONI_CB_04-06_12-06.md; spunta P2C — niente output in più senza chiedere Sì/No prima

Obiettivo: mining docs/Sessioni di lavoro/ dal 04-06-26 al 12-06-26. Stesso schema di P2A.

Focus tipico: blindatura Admin, allineamento skill-codice, masterplan, legale/vendita, sistema didattico. Tag linea A.
```

---

## Prompt P2D — Sessioni CB 13-06→24-06

- [ ] Completato — data: — — report: `02D_SESSIONI_CB_13-06_24-06.md`

```
Profilo: Verifica | Meta
Modalità: deep
Skill da leggere: 00_INVENTARIO (priorità); CHIUSURA_SESSIONE schema Q1
Non caricare: Archives; docs/_lavoro; src/
Output attesi: 02D_SESSIONI_CB_13-06_24-06.md; spunta P2D — niente output in più senza chiedere Sì/No prima

Obiettivo: mining docs/Sessioni di lavoro/ dal 13-06-26 al 24-06-26. Stesso schema di P2A.

Focus tipico: CRM/email, release, checklist flussi da testare, console. Tag linea A.
```

---

## Prompt P2E — Sessioni CB 02-08→06-08 + unione cronologia

- [ ] Completato — data: — — report: `02E_SESSIONI_CB_02-08_06-08.md` + `02_UNIONE_CRONOLOGIA_CB_V2.md`

```
Profilo: Verifica | Meta
Modalità: deep
Skill da leggere: report 02A–02D già prodotti; 00_INVENTARIO
Non caricare: Archives (salvo citazioni già nei report); src/
Output attesi: 02E_SESSIONI_CB_02-08_06-08.md + 02_UNIONE_CRONOLOGIA_CB_V2.md; spunta P2E — niente output in più senza chiedere Sì/No prima

Obiettivo: (1) mining docs/Sessioni di lavoro/ dal 02-08-26 al 06-08-26 (Servizio, E2E, salute codice, chiusura capitolo); (2) unire 02A–02E in una timeline grezza decisioni/eventi CB-v2.

Non fare ancora il catalogo tipizzato globale (è P9). Tag linea A.
```

---

## Prompt P3 — BHM-Zen (HACCP ultima versione)

- [ ] Completato — data: — — report: `03_BHM_ZEN_DECISIONI_E_SKILL.md`

```
Profilo: Verifica | Meta
Modalità: deep
Skill da leggere: docs/Archives/docs/README.md; docs/Archives/docs/meta/MAPPATURA_AREE/DECISIONI_OWNER_BETA.md; MASTERPLAN_RILANCIO_BHM_v2.md; skill-system sotto docs/Archives/docs/; 00_INVENTARIO
Non caricare: src/ di CalendarBackup-v2; dump intero di app-definition (solo dove emergono scelte owner)
Output attesi: 03_BHM_ZEN_DECISIONI_E_SKILL.md; spunta P3 — niente output in più senza chiedere Sì/No prima

Obiettivo: estrarre decisioni owner HACCP (audit append-only, sigilla giornata, ruoli, notifiche, scadenze, ecc.), trasferimento skill system, agency documentata. Tag linea B. Citare senza dump sensibile.
```

---

## Prompt P4 — HACCP legacy

- [ ] Completato — data: — — report: `04_HACCP_LEGACY_ORIGINI.md`

```
Profilo: Verifica | Meta
Modalità: deep
Skill da leggere: 00_INVENTARIO (assegnazione linea C); LEZIONI_APPRESE e high-signal in Archives
Non caricare: src/; linee B/D/E/F già coperte altrove (non riduplicare)
Output attesi: 04_HACCP_LEGACY_ORIGINI.md; spunta P4 — niente output in più senza chiedere Sì/No prima

Obiettivo: mining linea C — tutto docs/Archives/ fuori da docs/, Calendarbackup-oldversion, trading agent analyst-v.0, Trading agent analysy. Priorità: Sessions_Old, Info_Complete, Tests, knowledge-legacy, LEZIONI_APPRESE, cursor-rules-cleanup-2026-01; cleanup 2026-01 solo high-signal.

Focus: origini multi-agente, lezioni apprese, prime decisioni prodotto HACCP. Evitare dump screenshot/json. Tag linea C.
```

---

## Prompt P5 — CalendarBackup-oldversion

- [ ] Completato — data: — — report: `05_CALENDARBACKUP_OLD_ANTECEDENTI.md`

```
Profilo: Verifica | Meta
Modalità: deep
Skill da leggere: 00_INVENTARIO; docs/Archives/Calendarbackup-oldversion/ (sessioni, reports, agent-knowledge)
Non caricare: src/ CB-v2 attuale
Output attesi: 05_CALENDARBACKUP_OLD_ANTECEDENTI.md; spunta P5 — niente output in più senza chiedere Sì/No prima

Obiettivo: ricostruire decisioni e agency nella vecchia CalendarBackup; continuità vs CB-v2 (cosa tenuto, cosa ribaltato). Tag linea D. Handoff utile a P9/P11.
```

---

## Prompt P6 — Trading v.0 + FREEDOM

- [ ] Completato — data: — — report: `06_TRADING_V0_E_FREEDOM.md`

```
Profilo: Verifica | Meta
Modalità: deep
Skill da leggere: docs/Archives/trading agent analyst-v.0/SKILL-0.md + docs/Prodotto; docs/Archives/Trading agent analysy/ (CLAUDE.md, skill-system-trading-platform, CONTESTO_PRODOTTO); 00_INVENTARIO
Non caricare: src/ CB-v2; dump screenshot concorrenza interi (sintetizzare)
Output attesi: 06_TRADING_V0_E_FREEDOM.md; spunta P6 — niente output in più senza chiedere Sì/No prima

Obiettivo: linee E+F — PDR, vincolo no buy/sell, pricing/abbonamenti, skill-system trading, analisi concorrenza, kit metodo. Distinguere decisioni Matteo vs scelte agente. Tag E/F.
```

---

## Prompt P7A — `_lavoro` Scuola / roadmap

- [ ] Completato — data: — — report: `07A_LAVORO_SCUOLA_ROADMAP.md`

```
Profilo: Verifica | Meta
Modalità: deep
Skill da leggere: path assoluti sotto docs/_lavoro/Per matteo/Scuola/; ROADMAP_SKILL.md; GLOSSARIO_VIVO.md; 00_INVENTARIO
Non caricare: src/; dump Documenti Legali verbatim
Output attesi: 07A_LAVORO_SCUOLA_ROADMAP.md; spunta P7A — niente output in più senza chiedere Sì/No prima

Obiettivo: autoritratto dichiarato, skill target, metodo didattico (PROFILO_SCOLASTICO, PIANO_SISTEMA_DIDATTICO, materiale-didattico). No dump segreti. Tag linea G. Fonte primaria per P12.
```

---

## Prompt P7B — `_lavoro` Test / Comandi / Fable / Legale

- [ ] Completato — data: — — report: `07B_LAVORO_TEST_COMANDI_FABLE.md`

```
Profilo: Verifica | Meta
Modalità: deep
Skill da leggere: docs/_lavoro/Per matteo/Test e2e/; Comandi/; Analisi Fable/; Documenti Legali/ (solo consapevolezza — path + sintesi, no testo contratto)
Non caricare: .env; chiavi API
Output attesi: 07B_LAVORO_TEST_COMANDI_FABLE.md; spunta P7B — niente output in più senza chiedere Sì/No prima

Obiettivo: cosa Matteo testa e gestisce attivamente (checklist flussi, contesto-testato); operatività terminale/DB/E2E; analisi legale/vendita/skill system Fable. Tag linea G.
```

---

## Prompt P7C — `_lavoro` Sessioni maggio precoce

- [ ] Completato — data: — — report: `07C_LAVORO_SESSIONI_MAGGIO_PRECOCE.md`

```
Profilo: Verifica | Meta
Modalità: deep
Skill da leggere: docs/_lavoro/Sessioni/ (~12-05-26 → ~22-05-26); 00_INVENTARIO
Non caricare: sessioni pubbliche post-23-05 (già P2*)
Output attesi: 07C_LAVORO_SESSIONI_MAGGIO_PRECOCE.md; spunta P7C — niente output in più senza chiedere Sì/No prima

Obiettivo: colmare il gap temporale prima del log pubblico docs/Sessioni di lavoro/. Estrarre decisioni, agency, correzioni. Tag linea G.
```

---

## Prompt P7D — `_lavoro` Supporto/Storico/e2e + unione

- [ ] Completato — data: — — report: `07D_LAVORO_SUPPORTO_STORICO.md` + `07_UNIONE_LAVORO_PRIVATO.md`

```
Profilo: Verifica | Meta
Modalità: deep
Skill da leggere: report 07A–07C; docs/_lavoro/Supporto/; Storico/; e2e-s4/
Non caricare: src/
Output attesi: 07D_LAVORO_SUPPORTO_STORICO.md + 07_UNIONE_LAVORO_PRIVATO.md; spunta P7D — niente output in più senza chiedere Sì/No prima

Obiettivo: metodo spiegazioni agenti, analisi raccolta dati skill system, architettura/testing early, artefatti E2E corsie; poi unire 07A–D in un solo quadro linea G.
```

---

## Prompt P8A — Transcripts CalendarBackup-v2

- [ ] Completato — data: — — report: `08A_TRANSCRIPTS_CB_V2.md`

```
Profilo: Verifica | Meta
Modalità: deep
Skill da leggere: 00_INVENTARIO (conteggi transcript); questo tracking
Non caricare: dump intere chat nei report
Output attesi: 08A_TRANSCRIPTS_CB_V2.md; spunta P8A — niente output in più senza chiedere Sì/No prima

Obiettivo: mining campionato + keyword su C:\Users\matte.MIO\.cursor\projects\c-Users-matte-MIO-Documents-GitHub-CalendarBackup-v2\agent-transcripts (~504 jsonl).

Metodo obbligatorio: (1) campione stratificato per periodo; (2) keyword: lavoro ok, prepara, spiegamelo, ragioniamo, sbagliato, non era, no così, fuori strada; (3) estrarre messaggi user (Matteo) vs assistant; (4) classificare agency e direzione correzione; (5) dichiarare dimensione campione. Sintesi + uuid fonte — no dump chat intere. Tag linea H. No segreti.
```

---

## Prompt P8B — Transcripts BHM / Trading / CB-old

- [ ] Completato — data: — — report: `08B_TRANSCRIPTS_BHM_TRADING_CBOLD.md`

```
Profilo: Verifica | Meta
Modalità: deep
Skill da leggere: 00_INVENTARIO; stesso metodo di P8A
Non caricare: dump chat intere
Output attesi: 08B_TRANSCRIPTS_BHM_TRADING_CBOLD.md; spunta P8B — niente output in più senza chiedere Sì/No prima

Obiettivo: mining transcript sotto .cursor/projects per BHM-v-2, BHM-Zen, Trade-Analyst-Agent, Trading-Platform-main, Calendarbackup (+ worktree se presente). Allineare evidenze alle linee B–F/D. Dichiarare campione. Tag H.
```

---

## Prompt P8C — Unione transcripts

- [ ] Completato — data: — — report: `08_TRANSCRIPTS_MINING.md`

```
Profilo: Verifica | Meta
Modalità: standard
Skill da leggere: 08A + 08B già prodotti
Non caricare: riaprire tutti i jsonl da zero
Output attesi: 08_TRANSCRIPTS_MINING.md; spunta P8C — niente output in più senza chiedere Sì/No prima

Obiettivo: unire 08A+08B; produrre matrici grezze agency/correzioni live e segnali ritratto per handoff a P10 e P12. Dichiarare limiti del campionamento.
```

---

## Prompt P9 — Catalogo decisioni tipizzate (cross)

- [ ] Completato — data: — — report: `09_CATALOGO_DECISIONI_CROSS.md`

```
Profilo: Verifica | Meta
Modalità: deep
Skill da leggere: SOLO i report già in Indagine-Skill-Matteo/ (P1–P8) + questo tracking
Non caricare: riaprire migliaia di file grezzi
Output attesi: 09_CATALOGO_DECISIONI_CROSS.md; spunta P9 — niente output in più senza chiedere Sì/No prima

Obiettivo: catalogo D-### tipizzato con tag progetto A–H e livello autonomia (deciso / confermato / corretto / delegato / incerto).

Tassonomia: Prodotto · Flusso utente/dati · Impostazioni · Testing/blindatura · Soluzione conflitti · Vendita/edition/pricing · AI collaboration/skill system · Sicurezza ambienti · UI/UX · Compliance HACCP · AI education trading · Legale · Auto-formazione/Scuola · Altro.
```

---

## Prompt P10 — Agency e correzioni

- [ ] Completato — data: — — report: `10_AGENCY_E_CORREZIONI_CROSS.md`

```
Profilo: Verifica | Meta
Modalità: deep
Skill da leggere: 09_CATALOGO; 08_TRANSCRIPTS_MINING; docs/Comunicazione-Skill/ERRORI_PROCESSO.md; OSSERVAZIONI.md (se utile)
Non caricare: src/
Output attesi: 10_AGENCY_E_CORREZIONI_CROSS.md; spunta P10 — niente output in più senza chiedere Sì/No prima

Obiettivo: (1) continuum agency per progetto e nel tempo; (2) lista correzioni Matteo→agente; (3) lista correzioni agente→Matteo / fuori strada; (4) cambi di idea (product discovery vs errore). Solo evidenze citabili.
```

---

## Prompt P11 — Albero skill + timeline

- [ ] Completato — data: — — report: `11_ALBERO_SKILL_E_TIMELINE.md`

```
Profilo: Verifica | Meta
Modalità: deep
Skill da leggere: 09, 10, 07_UNIONE, 02_UNIONE, 03–06
Non caricare: src/
Output attesi: 11_ALBERO_SKILL_E_TIMELINE.md; spunta P11 — niente output in più senza chiedere Sì/No prima

Obiettivo: albero di skill coltivate (anche incoerenti/sovrapposte). Confrontare esplicitamente: skill dichiarate (Scuola G) vs esercitate (A–F) vs visibili nei dialoghi (H). Timeline: HACCP legacy→BHM; CB-old→CB-v2; Trading; frecce di trasferimento metodo (skill system, controverifica, prepara-prompt).
```

---

## Prompt P12 — Ritratto metodologico / psicologico (solo fonti)

- [ ] Completato — data: — — report: `12_RITRATTO_METODOLOGICO_FONTI.md`

```
Profilo: Verifica | Meta
Modalità: deep
Skill da leggere: 01_META; 07A/07_UNIONE; 08_TRANSCRIPTS; 10_AGENCY; EVOLUZIONE_SKILLS; PROFILO_SCOLASTICO (path assoluto)
Non caricare: inventare tratti non citati
Output attesi: 12_RITRATTO_METODOLOGICO_FONTI.md; spunta P12 — niente output in più senza chiedere Sì/No prima

Obiettivo: clustering di citazioni su metodo di lavoro, stile decisionale, rapporto col tecnico, controllo qualità, ambiguità/scope, preferenze comunicative. Nessuna diagnosi inventata. Sezione obbligatoria «cosa i file NON dicono».
```

---

## Prompt P13 — Dossier sintesi + banca domande senior

- [ ] Completato — data: — — report: `13_DOSSIER_PROFILO_LAVORO_MATTEO.md`

```
Profilo: Verifica | Meta
Modalità: deep
Skill da leggere: 09–12 + 00_INVENTARIO + questo tracking; includere in testa il prompt iniziale di Matteo dal piano
Non caricare: nuovi mining grezzi
Output attesi: 13_DOSSIER_PROFILO_LAVORO_MATTEO.md; spunta P13 — niente output in più senza chiedere Sì/No prima

Obiettivo: master dossier per la sessione senior successiva di validazione. Contenuto minimo:
1. Prompt iniziale Matteo + metodo + limiti corpus (vivo/Archives/_lavoro/transcripts)
2. Mappa progetti A–H
3. Executive map albero skill
4. Link a catalogo / agency / timeline / ritratto
5. Banca domande che testano le skill rivendicabili contro le evidenze
6. Checklist evidenze deboli / da confermare a voce
7. Nota cosa viene da materiale privato vs pubblico

Capitolo mining chiuso; la validazione senior è una chat successiva, fuori da questo prompt.
```

---

## Log spunte (append-only, opzionale)

| Quando | ID | Agente/modello | Report path | Nota |
|--------|----|----------------|-------------|------|
| — | — | — | — | — |
