# C4 — HACCP legacy: Tests + Info_Complete (strategia di test più antica)

> **Ondata:** C4 · **Data report:** 06-08-26 · **Regime:** rastrello · **Peso fonti:** 3 (artefatti agenti; «Utente»/«User» = ruolo umano; nome «Matteo» raro)
> **Perimetro P0/piano:** `docs/Archives/Tests/` **58 md** + `docs/Archives/Info_Complete/` **47 md** = **105 md**
> **Disco oltre i md:** Tests **286** file totali · Info_Complete **76** file totali — i non-md sono **contati** in §5, non dumpati (json/screenshot/script come da prompt)
> **Focus prompt:** chi decideva cosa testare e con quale criterio; distanza col Matteo di agosto 2026 che taglia il collaudo **62→16** (A11)
> **Nota mtime:** filesystem = 05-02-26 (copia bulk) — **non usata**. Date = intestazioni nei documenti. Date `2025-01-*` vs cluster onboarding `2025-10-19` / archivio `2026-01-07` coesistono senza riconciliazione.

**Attribuzione:** in questo perimetro «Matteo» compare come (1) email di test, (2) riga `Review: User (Matteo)`, (3) `Developer: Matteo` su un piano. Le decisioni di prodotto/test sono firmate **«Utente» / «User» / «dall'utente»**. Dove il testo è chiaramente conferma product-owner → `Chi = MATTEO` (ruolo). Email e seed staff ≠ decisione.

**Overlap C2:** le citazioni SESSION/FORM (C4-D15…D18) esistono anche nelle copie cleanup di C2 (C2-D10…D13). Qui restano con path `Info_Complete/` — S1 deduplica.

---

## Sezione 1 — Decisioni

### Focus — strategia di test (Tests/ + guide Test)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| C4-D01 | 17-01-25 | TESTING | Sette famiglie Attività A–G già scelte | MATTEO | ORIGINATA | `Tests/Test/Calendario/IDENTIFICAZIONE_TEST_ATTIVITA_2025-01-17.md` §TEST GIÀ IDENTIFICATI | «TEST GIÀ IDENTIFICATI DALL'UTENTE» | test-scoping |
| C4-D02 | 17-01-25 | TESTING | Totale 16: +L–T; toglie regressione H–K | AGENTE | SCELTA | stesso §RIEPILOGO FINALE | «Totale Test Identificati: **16**» · «7 test richiesti dall'utente (A-G)» | test-matrix-expand |
| C4-D03 | 17-01-25 | TESTING | Priorità E/F alte; metriche &lt;500ms/&lt;2s | AGENTE | SCELTA | stesso §PRIORITÀ / Metriche | «100% test passati per test critici» | test-priority-gates |
| C4-D04 | 17-01-25 | PROCESSO | Prossimo step = conferma utente su matrice | AGENTE | DELEGATA | stesso chiusura | «Prossimo step: Conferma utente e definizione dettagliata» | human-gate |
| C4-D05 | ? | TESTING | Login E2E blindato, conferma umana | CONGIUNTA | APPROVATA | `Tests/…/README-TEST-SESSIONE.md` | «FUNZIONANTE AL 100% - Confermato dall'utente» | blindatura-umana |
| C4-D06 | ? | AI-METODO | Blindato = pattern per sistemare gli altri | AGENTE | SCELTA | stesso §PROSSIMI PASSI | «Sistemare test non funzionanti basandosi sul pattern del test blindato» | golden-template |
| C4-D07 | 17-01-25 | TESTING | Test E allineamento calendar↔modal sigillato | MATTEO | APPROVATA | `Tests/…/EventAlignment/README-TEST-E-BLINDATO.md` | «Blindato da: Utente» | blindatura-umana |
| C4-D08 | 17-01-25 | TESTING | Test A filtri blindato da AI (no Utente) | AGENTE | SCELTA | `Tests/…/CalendarFilters/README-TEST-A-BLINDATO.md` | «Tester: AI Assistant» · «Status: ✅ BLINDATO» | blindatura-agente |
| C4-D09 | 19-10-25 | PRODOTTO | Temp onboarding = min-max esatti, non ±1.1°C | MATTEO | CORRETTIVA | `Tests/…/Onboarding/TEST_1_VERIFICATION.md` tabella | «Exact min-max range (NOT ±1.1°C) \| User clarified» | acceptance-criteria |
| C4-D10 | 19-10-25 | TESTING | Triade assert UI redirect + DB + tab UI | AGENTE | SCELTA | `Tests/…/Onboarding/README.md` + VERIFICATION | «ASSERT A… ASSERT B… ASSERT C…» (schema nel README) | collaudo-triade |
| C4-D11 | 16-01-25? | AI-METODO | Blindatura 5 layer; autonomia senza permesso | AGENTE | DELEGATA | `Tests/…/UI-Base/AGENTE_4_REPORT_FINALE.md` | «Procedura Senza Permesso - Proceduto autonomamente» · «350+» | multi-agent-blindatura |
| C4-D12 | ? | TESTING | Toglie test role-selector obsoleti | AGENTE | CORRETTIVA | `Tests/…/Navigazione/REPORT_FINALE_AGENTE_5.md` | «Eliminati test di selezione ruoli (non servono in production)» | prune-obsolete-tests |
| C4-D13 | 16-01-25 | TESTING | Form Conservazione assente → non fingere verde | AGENTE | CORRETTIVA | `Tests/…/REPORT_TEST_CONSERVATIONPOINTFORM.md` | «RISULTATO: ❌ FORM NON IMPLEMENTATO» | honest-negative |
| C4-D14 | 07-01-26 | PROCESSO | Molti spec onboarding → un consolidato | INCERTO | SCELTA | `Tests/Old_Onboarding_Tests/README.md` | «sostituiti dal nuovo test consolidato: …completamento-onboarding.spec.ts» | test-consolidation |
| C4-D15 | 16-01-25 | AI-METODO | Template Tracking → LOCKED sistematico | AGENTE | DELEGATA | `Tests/…/UI-Base/Button-Tracking.md` (×~28) | «Template creato per il processo di blindatura sistematica» | blindatura-template |

> **C4-D14:** `Chi=INCERTO` (nessun Utente/Matteo nel README); `SCELTA` = c’è una scelta di taglio nel testo, non che sia tua.

### Focus — Info_Complete (criteri, gate, checklist)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| C4-D16 | 07-01-25 | UI-UX | Form create vuoti; edit tiene selezione | MATTEO | ORIGINATA | `Info_Complete/…/FORM_DEFAULT_VALUES_FIX.md` | «Vorrei che i form… senza selezione… Il form di modifica invece…» | form-empty-defaults |
| C4-D17 | 07-01-25 | FLUSSO | Calendario pieno pre-onboarding = mock? | MATTEO | ORIGINATA | `Info_Complete/…/SESSION_REPORT_2025_01_07.md` | «non ho ancora compilato onboarding eppure vedo calendario pieno… mock data» | data-source-audit |
| C4-D18 | 07-01-25 | FLUSSO | Company per ogni account registrato | MATTEO | ORIGINATA | stesso | «sicuro che per ogni account… c'è una company abbinata?» | multi-tenant-guarantee |
| C4-D19 | 07-01-25 | TESTING | DB a 0 dati se onboarding incompleto | MATTEO | ORIGINATA | stesso | «se non completo onboarding app parte con 0 dati… database… pulito» | clean-slate-testing |
| C4-D20 | 09-01-25 | PROCESSO | Review migrazione: User (Matteo); UAT pending | MATTEO | APPROVATA | `Info_Complete/…/MIGRATION_REPORT_…_2025_01_09.md` | «Review: User (Matteo)» · «Testing: In corso (UAT pending)» | review-gate |
| C4-D21 | ? | TESTING | Merge solo dopo approvazione utente finale | MATTEO | APPROVATA | `Info_Complete/…/USER_TRACKING_TASKS.md` L17 | «Merge: Solo dopo approvazione utente finale» | merge-gate |
| C4-D22 | 04-01-25? | AI-METODO | Cursor = bug/UX; Claude = TS/lint | INCERTO | SCELTA | `Info_Complete/…/CURSOR-INSTRUCTIONS-CURRENT.md` | «TU (Cursor) ti occupi SOLO di… Claude si occupa di…» | dual-agent-split |
| C4-D23 | 11-01-25 | TESTING | Checklist 6 flussi tracking; Tested By Claude | AGENTE | DELEGATA | `Info_Complete/…/TESTING_CHECKLIST.md` | «Tested By: Claude Code» · «Tests Completed: __/6» | agent-checklist |
| C4-D24 | 17-01-25 | TESTING | Blindatura /attivita; cancella task UI assente | AGENTE | CORRETTIVA | `Info_Complete/…/REPORT_TODOLIST_COMPLETATA_AGENTE_4.md` | «CANCELLATO… Non presente» (pattern nel report) | prune-absent-ui |

> **Rastrello — non estratto come decisioni:** ~70 md (Tracking UI-Base/Auth ripetitivi, RISULTATI_TEST_* a `console.log`, placeholder README Calendario, glossari/schema KB, SQL guide, debug lunghi, FIX/BUG archive). Contati in §5.
> **Copia IDENTIFICAZIONE:** `IDENTIFICAZIONE_… copy.md` = eco di D01–D04, non ri-estratta.

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| C4-A01 | M→A | DIRETTA | Definisce A–G prima che l’agente espanda a 16 | accettata | IDENTIFICAZIONE §utente + riepilogo |
| C4-A02 | M→A | DIRETTA | Sigilla Test E («Blindato da: Utente») | accettata | README-TEST-E-BLINDATO |
| C4-A03 | M→A | DIRETTA | Conferma login E2E blindato | accettata | README-TEST-SESSIONE |
| C4-A04 | M→A | DIRETTA | Corregge criterio temp (±1.1 → min-max) | accettata | TEST_1_VERIFICATION |
| C4-A05 | M→A | DIRETTA | Form create vuoti vs prefill agente | accettata | FORM_DEFAULT + SESSION |
| C4-A06 | M→A | DIRETTA | Sospetta mock / chiede audit calendario | accettata | SESSION |
| C4-A07 | M→A | DIRETTA | Chiede garanzia company per account | accettata | SESSION |
| C4-A08 | M→A | DIRETTA | Chiede DB pulito per collaudare onboarding | accettata | SESSION |
| C4-A09 | A→M | DEDOTTA | Agente espande matrice 7→16 e chiede conferma | ignota | IDENTIFICAZIONE (gate «Conferma utente» non chiuso nel doc) |
| C4-A10 | A→M | DEDOTTA | Stessa parola «blindato»: A = AI, E = Utente | parziale | README-TEST-A vs E |
| C4-A11 | A→A | — | Agente 5 / Agente 4 podano test obsoleti o UI assente | accettata | REPORT_A5; REPORT_TODOLIST_A4 |
| C4-A12 | M→A | — | **Nessuna M→A che ribalti un claim «100% production»** nel perimetro | — | FINAL_TESTING contraddice sé stesso senza correzione Owner citata |

> Peer review agente↔agente (schema senza `A→A`): registrata in A11 come protezione del gate umano. Non prova che Matteo fosse fuori strada.

---

## Sezione 3 — Skill signals

| Skill | Livello provvisorio | Evidenza (ID) | Contro-evidenza cercata |
|-------|---------------------|---------------|-------------------------|
| `test-scoping` (cosa testare) | **L2** | C4-D01 ORIGINATA | §4: l’agente gonfia subito a 16 e a 350+; gate conferma non chiuso nel doc |
| `blindatura-umana` | **L2** | C4-D05, D07 | §4: rara (login + E); resto della suite «NON verificati» |
| `acceptance-criteria` (regola prodotto in test) | **L2** | C4-D09 | Cercata altra correzione User in Tests/: solo questa esplicita |
| `clean-slate-testing` / `data-source-audit` | **L2** | C4-D17, D19 | Stesso cluster SESSION; non diventano checklist Owner firmata |
| `review-gate` / `merge-gate` | **L1** | C4-D20, D21 | §4: FINAL_TESTING dichiara 100% mentre UAT pending |
| `multi-agent-blindatura` | **L1** (sistema agenti, non Matteo) | C4-D11, D15 | §4: LOCKED a 13%; checkboxes «Da creare» + tabelle 100% |
| `test-consolidation` | **L0–L1** | C4-D14 | Chi = INCERTO; nessuno «Utente» nel README archivio |
| `honest-negative` | **L1** (agente) | C4-D13 | Virtù agente; non attribuita a Matteo |
| `test-strategy` verso A11 62→16 | **L2 sul polo «lista umana stretta»**; **L0 sul taglio 62** | D01 (7) + D02 (16) | Nel perimetro **non esiste il numero 62**; la distanza è qualitativa (cerimonia vs filtro umano) |

**Nessuna skill L3/L4 attribuibile a Matteo in C4** (c’è M→A sul merito di *cosa* testare / criteri, ma non una regola scritta da lui che sopravviva come skill; il vocabolario «blindato» è ambiguo e spesso auto-assegnato dagli agenti). Per L3 servirebbe contro-evidenza attiva: vedi §4.

---

## Sezione 4 — Contro-evidenze

| Claim suggerito dal corpus | Contro-evidenza | Fonte |
|----------------------------|-----------------|-------|
| «Blindato = collaudo umano» | Test A: Tester AI; StaffForm LOCKED con **4/32 (13%)**; sessione: solo login umano, resto «NON … verificati» | README-TEST-A; StaffForm-Tracking; README-TEST-SESSIONE |
| «Matrice test = scelta Owner» | Owner dà **7**; agente porta a **16** e Agente 4 a **350+** | IDENTIFICAZIONE; AGENTE_4_REPORT |
| «100% tested / production ready» | FINAL_TESTING: invite «da testare», onboarding «Bug», e MIGRATION «UAT pending» nello stesso cluster | FINAL_TESTING_REPORT; MIGRATION_REPORT |
| «Checklist = lavoro fatto» | TESTING_CHECKLIST: tutte `[ ]`, `Tests Completed: __/6` | TESTING_CHECKLIST.md |
| «Tracking template = qualità» | Button/Modal: voci «⏳ Da creare» accanto a tabelle pass; LoginPage tracking mai eseguito | UI-Base Tracking; TRACKING_LOGINPAGE |
| «Verde console = collaudo» | RISULTATI_TEST_* = narrativi `console.log('✅…')`, non runner | RISULTATI_TEST_CALENDAR*.md |
| «62→16 nasce qui» | Nessun «62 prove» in C4; unico «62» non pertinente (pass rate ForgotPassword). Il **16** di IDENTIFICAZIONE è coincidenza numerica, non il collaudo A11 | IDENTIFICAZIONE; grep perimetro |
| «Gate merge utente = controllo continuo» | Merge-gate scritto da Claude; report agenti chiudono «completata» senza citare approvazione | USER_TRACKING_TASKS; REPORT_A4/A5 |

Cercata attivamente **A→M «Matteo fuori strada» DIRETTA** sul merito test: **non trovata** (corregge lui agenti su form/mock/company/temp; gli agenti non lo correggono in questo perimetro).

---

## Sezione 5 — Copertura dichiarata

| Voce | N |
|------|---|
| File nel perimetro (P0, `.md`) | **105** (58 Tests + 47 Info_Complete) |
| File `.md` aperti | **105** (100%) |
| High-signal (decisioni/agency estratte) | ~28 |
| Solo-contatto / template / eco / tecnici | ~77 |
| File illeggibili | **0** |

### Non-md (contati, non dumpati — focus prompt)

| Area | Totale file disco | di cui non-md | Dettaglio utile |
|------|-------------------|---------------|-----------------|
| `Tests/` | **286** | **228** | ~216 script `*.{js,cjs,ts,tsx}` · **2** json · **1** png · **1** webm · **1** html |
| `Info_Complete/` | **76** | **29** | **16** sql · **5** js · **1** ps1 · **1** html · **6** file senza estensione `…/Archive` (**non vuoti**: 2.7–16 KB, report bug/achievement/planning) |

### Inventario md Tests/ (58)

| Categoria | N |
|-----------|---|
| UI-Base `*-Tracking` + report A4 | 20 |
| Auth / form Tracking | 9 |
| Test_Coordination TRACKING | 4 |
| Calendario (IDENTIFICAZIONE×2, blindato A/E, sessione, RISULTATI×3, README/flow) | 14 |
| Conservazione + Conservation | 5 |
| Onboarding + Old_Onboarding README | 4 |
| Navigazione report | 1 |
| Altro | 1 |

### Inventario md Info_Complete/ (47)

| Cartella | N |
|----------|---|
| Agent_Reports (+ Archive) | 23 |
| Debug (+ Archive) | 5 |
| Knowledge_Base (+ Database/Planning) | 11 |
| User_Guides | 7 |
| Scripts README | 1 |

**Date interne (non mtime):** cluster Attività/blindatura **17-01-25** (±16); cluster report sessione/migrazione **07–10-01-25**; onboarding verification **19-10-25**; archivio Old_Onboarding **07-01-26**.

---

## Sezione 6 — Lacune e handoff

| Cosa manca | A chi |
|------------|-------|
| Transcript che conferma le citazioni «User» = M-VOCE (peso 1) | **H\*** (gennaio / ottobre 2025 se esistono chat) |
| Dedup decisioni SESSION/FORM già in C2 | **S1** |
| Confronto numerico 62→16 con checklist CB-v2 (non in C4) | **A11** (già) + **S3** timeline skill testing |
| Chi ha deciso il consolidamento Old_Onboarding (Chi=INCERTO) | **C2** MANIFEST / **H\*** / **J1** |
| Lezioni → regole Cursor (sopravvivenza «blindato») | **C5** (scavo lezioni) + **M3** Testing-Skill attuale |
| Peer review anti-falso-positivo (C1 A2→A5) vs cerimonia LOCKED qui | **S2** agency cross |

---

## Sezione 7 — Chiusura verso Matteo

Qui vedi la fase in cui **tu sceglievi poche prove sulla pagina Attività (sette famiglie)** e gli agenti ne facevano una fabbrica: sedici sulla carta, centinaia nei report di blindatura, con la parola «blindato» usata anche quando i test fallivano o non erano stati eseguiti.  
Il tuo ruolo scritto era soprattutto **sigillo umano** (login e allineamento calendario↔modale) e **domande da collaudo** (form vuoti, dati finti, azienda per ogni account, database pulito) — non scrivere le checklist lunghe.  
La distanza con agosto 2026 (taglio collaudo a ciò che **devi** fare tu) è già leggibile: allora contava il volume e il lucchetto; dopo conti cosa resta davvero umano dopo le prove automatiche.
