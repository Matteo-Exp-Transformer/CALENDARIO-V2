# C2 — HACCP legacy: 2026-01-cleanup

> **Ondata:** C2 · **Data:** 06-08-26 · **Regime:** rastrello · **Peso fonti:** 3 (report/istruzioni agente; citazioni utente *riportate* — se H* smentiscono, vince H)
> **Perimetro:** `docs/Archives/2026-01-cleanup/` — **89 file `.md`** (conteggio P0; sul disco la cartella ha **335 file** di ogni tipo: i 246 non-md sono contati in §5, non estratti)
> **Focus prompt:** criteri di taglio (PROCESSO) e chi li ha fissati. Un cleanup racconta cosa era diventato ingestibile.
> **Nota mtime:** inutilizzabile (copia in blocco 05-02-26). Date dai documenti stessi; dove manca → `?`.
> **Correzione attribuzione (06-08-26, M-VOCE):** Matteo: cleanup **richiesto da lui**, **pianificato ed eseguito dagli agenti**. Il MANIFEST non lo diceva; senza questa correzione restava INCERTO.

---

## Sezione 1 — Decisioni

### Focus cleanup (criteri di taglio — 06-01-26)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| C2-D01 | 06-01-26 | PROCESSO | Richiedere cleanup root: archivio, non delete | MATTEO | ORIGINATA | correzione Matteo 06-08-26 (chat C2); effetto in `MANIFEST.md` L3-4, L281 | «cleanup è stato richiesto da me e pianificato da agenti e eseguito da loro» | repo-hygiene |
| C2-D02 | 06-01-26 | PROCESSO | Piano taglio 5 categorie: PNG, JS temp, Playwright dup, cartelle temp, misc | AGENTE | DELEGATA | `MANIFEST.md` L11-18; attribuzione piano → correzione Matteo 06-08-26 | tabella Categoria → Destinazione (98 PNG, 8 JS, 9 config, 10 cartelle, 5 misc) | archive-taxonomy |
| C2-D03 | 06-01-26 | PROCESSO | Root BHM solo struttura “professionale” elencata | AGENTE | DELEGATA | `MANIFEST.md` L237-274 | «Dopo la pulizia, la root directory contiene SOLO:» | root-cleanliness |
| C2-D04 | 06-01-26 | TESTING | Tenere un solo `playwright.config.ts`; archiviare 9 config agent | AGENTE | DELEGATA | `MANIFEST.md` L171-183, L284 | «Configurazioni Playwright duplicate mantenendo solo `playwright.config.ts`» | test-config-single |
| C2-D05 | 06-01-26 | AI-METODO | Archiviare `skills/` come duplicato di `.cursor/rules/` | AGENTE | DELEGATA | `MANIFEST.md` L205 | «Skills duplicate (duplicato di `.cursor/rules/`)» | skill-dedup |
| C2-D06 | 06-01-26 | PROCESSO | Archiviare progetto personale Australia come “cartella temporanea” | AGENTE | DELEGATA | `MANIFEST.md` L194-195 | «Australia_Migration_Project/ — Progetto migrazione Australia» | personal-vs-product |
| C2-D07 | 06-01-26 | PROCESSO | Archiviare `Info/` come documentazione temporanea | AGENTE | DELEGATA | `MANIFEST.md` L200-201 | «Info/ — Informazioni e documentazione temporanea» | docs-lifecycle |
| C2-D08 | 06-01-26 | TESTING | Archiviare `Test/` obsoleti (sostituiti da `tests/` organizzati) | AGENTE | DELEGATA | `MANIFEST.md` L211-212 | «Test obsoleti (spostati in `tests/` organizzati)» | test-folder-hygiene |
| C2-D09 | 06-01-26 | PROCESSO | Archiviare `test-results/` Playwright (artefatti run) | AGENTE | DELEGATA | `MANIFEST.md` L217-218 | «Risultati test Playwright» | artifact-archive |

> **Chi ha fatto cosa:** richiesta = **Matteo** (C2-D01 ORIGINATA). Tassonomia, piano e spostamento file = **agenti** (C2-D02–D09 DELEGATA). Il MANIFEST da solo non nominava Matteo; attribuzione richiesta da correzione M-VOCE 06-08-26.

### Decisioni prodotto/UX riportate nei materiali archiviati (non sul cleanup, ma nel perimetro)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| C2-D10 | 07-01-25? | UI-UX | Form nuovi: select vuoti; form modifica: dati esistenti | MATTEO | ORIGINATA | `…/FORM_DEFAULT_VALUES_FIX.md` L16-17; anche `SESSION_REPORT_…` L405 | «Vorrei che i form… comparissero senza selezione… Il form di modifica invece deve mantenere…» | form-empty-defaults |
| C2-D11 | 07-01-25? | FLUSSO | Chiedere se calendario post-onboarding incompleto = mock | MATTEO | ORIGINATA | `SESSION_REPORT_2025_01_07.md` L103-104 | «non ho ancora compilato onboarding eppure vedo calendario pieno… Dimmi se vedi mock data» | data-source-audit |
| C2-D12 | 07-01-25? | FLUSSO | Chiedere garanzia company per ogni account (multi-tenant) | MATTEO | ORIGINATA | stesso L166-167 | «Come faccio a essere sicuro che per ogni account… c’è una company abbinata?» | multi-tenant-guarantee |
| C2-D13 | 07-01-25? | TESTING | DB pulito se onboarding non completato (0 dati) | MATTEO | ORIGINATA | stesso L214-215 | «se non completo onboarding app parte con 0 dati… database partisse pulito» | clean-slate-onboarding |
| C2-D14 | 17-01-25? | TESTING | 7 famiglie test Attività (A–G) già identificate dall’utente | MATTEO | ORIGINATA | `…/IDENTIFICAZIONE_TEST_ATTIVITA_2025-01-17.md` L7-37 | «TEST GIÀ IDENTIFICATI DALL'UTENTE» (A filtri… G tipi evento) | test-scoping |
| C2-D15 | 04-01-25? | AI-METODO | Divisione lavoro: Cursor = bug/UX; Claude = TS cleanup/lint | INCERTO | INCERTO | `CURSOR-INSTRUCTIONS-CURRENT.md` L38-52 | «TU (Cursor) ti occupi SOLO di… Claude si occupa di… Cleanup TypeScript» | dual-agent-split |
| C2-D16 | ? | SICUREZZA | Disabilitare RLS temporaneamente (Clerk≠Supabase JWT) | AGENTE | SCELTA | `…/RLS_SOLUTION.md` L51-58 | «Opzione Scelta: Disabilitare RLS Temporaneamente» | rls-defer · IPOTESI |
| C2-D17 | 19-10-25? | AI-METODO | Sistema 6 skills (overview/test/mapping/prompt/error) | INCERTO | INCERTO | `misc/SKILLS_SETUP_COMPLETE.md` L1-19 | «Sistema di 6 skills specializzate… PRODUCTION READY» | early-skill-system |
| C2-D18 | 20-10-25? | AI-METODO | Agente 0 orchestratore + cartelle output per agente | INCERTO | INCERTO | `temp-folders/skills/agent-0-orchestrator.md` L10-23 | «Punto di ingresso… attiva Agenti 1–7» | agent-orchestration |
| C2-D19 | ? | AI-METODO | Critical verification: mai fidarsi dei claim, verificare | INCERTO | INCERTO | `temp-folders/skills/critical-verification.md` L15-30 | «NON SEI UN OTTIMISTA - SEI UN CONTROLLORE RIGOROSO» | critical-verify · antenato |
| C2-D20 | ? | AI-METODO | Code mapping solo da codice letto, zero assunzioni | INCERTO | INCERTO | `temp-folders/skills/code-mapping.md` L14-22 | «MAI inventare componenti… MAI assumere strutture» | code-mapping-discipline |
| C2-D21 | 05-01-26 | ALTRO | Pathway Australia: Cook attivo, IT non fattibile ora | MATTEO | SCELTA | `Australia_…/00_MASTER_ROADMAP.md` L8-16 | «Developer Programmer NON è fattibile… PERCORSO ATTIVO: COOK» | personal-planning · fuori-prodotto |
| C2-D22 | 09-01-25? | PROCESSO | Review migrazione Clerk→Supabase attribuita a Matteo | MATTEO | APPROVATA | `MIGRATION_REPORT_…_2025_01_09.md` L487 | «Review: User (Matteo)» | migration-review |
| C2-D23 | ? | UI-UX | Rimozione cestino duplicato “come richiesto” | INCERTO | APPROVATA | `misc/REPORT_COMPLETO_MODIFICHE_CALENDARIO.md` L111 | «Rimozione pulsante cestino duplicato come richiesto» | ui-dedup · IPOTESI |

**Date `2025-01-*`:** scritte così nei file; coesistono con MANIFEST/Australia datati **gennaio 2026**. Possibile refuso di anno negli agent report — non riconciliato qui; handoff a J1/C1/H*.

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| C2-A01 | M→A | DIRETTA | Corregge default form precompilati (create vs edit) | accettata | `FORM_DEFAULT_VALUES_FIX.md` L16-17; `SESSION_REPORT` L400-405 |
| C2-A02 | M→A | DIRETTA | Sospetta mock data / chiede audit calendario vs SQL | accettata | `SESSION_REPORT` L103-108 (agente: no mock) |
| C2-A03 | M→A | DIRETTA | Chiede prova multi-tenant + company per ogni account | accettata | `SESSION_REPORT` L166-194 (agente trova architettura rotta) |
| C2-A04 | M→A | DIRETTA | Chiede procedura DB pulito (non solo localStorage) | accettata | `SESSION_REPORT` L214-236 |
| C2-A05 | M→A | DIRETTA | Definisce 7 famiglie test Attività prima dell’agente | accettata | `IDENTIFICAZIONE_TEST_…` L7 + L168 «7 test richiesti dall'utente» |
| C2-A06 | A→M | DEDOTTA | Agente scopre multi-tenant “fundamentally broken” dopo domanda sua | ignota | `MULTI_TENANT_ARCHITECTURE_ANALYSIS.md` L26-39; domanda in C2-A03 |
| C2-A07 | M↔M | DIRETTA | Cambia pathway migrazione: IT → Cook | accettata | `00_MASTER_ROADMAP.md` L8-16 (fuori prodotto BHM) |
| C2-A08 | M→A | DIRETTA | Richiede cleanup root; lascia piano ed esecuzione agli agenti | accettata | correzione Matteo 06-08-26 (chat C2); esito = `MANIFEST.md` + archivio |

Il MANIFEST non firma Matteo: senza la correzione 06-08-26 l’attribuzione della *richiesta* restava opaca. Piano ed esecuzione restano agenti (coerente con D02–D09).

---

## Sezione 3 — Skill signals

| Skill | Livello provvisorio | Prova in C2 | Nota |
|-------|---------------------|-------------|------|
| `form-empty-defaults` | L2 | C2-D10 ORIGINATA + citazione | UX concreta, non teoria |
| `multi-tenant-guarantee` | L2 | C2-D12 | Domanda da product owner, non da debug casuale |
| `data-source-audit` | L2 | C2-D11 | Distingue mock vs dati reali |
| `clean-slate-onboarding` | L2 | C2-D13 | Esigenza di ambiente testabile |
| `test-scoping` | L2 | C2-D14 | Elenca cosa testare prima del codice test |
| `repo-hygiene` | L2 | C2-D01 ORIGINATA + C2-A08 | Ha chiesto il cleanup; tassonomia/esecuzione delegate (D02–D09) |
| `critical-verify` | L0–L1 | C2-D19 | Skill scritta; non prova che Matteo l’abbia agita qui |
| `early-skill-system` | L0–L1 | C2-D17–D20 | Antenato di M1; archiviato come “duplicato” (C2-D05) |
| `dual-agent-split` | L1 | C2-D15 | Istruzioni a Cursor; autore non firmato |
| `rls-defer` | L1 (agente) | C2-D16 | Scelta tecnica agente; approvazione Matteo non citata |
| `personal-vs-product` | L0 (fallimento processo) | C2-D06 + §4 | Dossier personale nella root del prodotto |

---

## Sezione 4 — Contro-evidenze

1. **Confine prodotto/vita privata assente (poi riparato col cleanup):** `Australia_Migration_Project/` (11 md: profilo, CV, visti, checklist) stava nella root del repo BHM e viene archiviato solo il 06-01-26 come “cartella temporanea”. Contro `repo-hygiene` / disciplina documenti: il taglio arriva **dopo** che il materiale era già mescolato. Fonte: `MANIFEST.md` L194-195; cartella `temp-folders/Australia_Migration_Project/`.
2. **MANIFEST senza firma:** i criteri di taglio (D02–D09) restano firma agente; la *richiesta* di cleanup (D01) non compare nel MANIFEST e arriva solo dalla correzione M-VOCE 06-08-26. Contro-evidenza di documentazione: il deliverable di processo non registra chi ha chiesto. H* può ancora cercare la chat originale di gennaio.
3. **Debito sicurezza consapevole:** disabilitare RLS “temporaneamente” (`RLS_SOLUTION.md`) mentre l’app filtra in frontend — scelta agente; nessuna citazione di ratifica di Matteo in questo perimetro.
4. **Proliferazione skill → archivio come “duplicato”:** `misc/SKILLS_SETUP_COMPLETE.md` dichiara sistema “PRODUCTION READY”; lo stesso giorno di cleanup il MANIFEST lo classifica duplicato di `.cursor/rules/`. Segnale di crescita caotica del metodo AI prima della regola.
5. **Root intasata da artefatti di collaudo:** 98+ PNG di test, 9 config Playwright agent, `test-results/` con trace/video — il cleanup documenta quanto il processo di test aveva invaso la root.
6. **Date incoerenti 2025 vs 2026** nei report agent vs MANIFEST/Australia: contro affidabilità timeline interna al corpus (già avvisata da P0 sul mtime).
7. **PII in artefatti test:** 9 `error-context.md` in `test-results/agent2/` contengono email di login in dump DOM — non citata nei report; solo segnalata come rischio sensibilità (path + tipo).

Cercata agency A→M DIRETTA su errori di Matteo nel merito prodotto: **non trovata** in questo perimetro (solo domande sue a cui l’agente risponde). Le “Lezioni” in `REPORT_COMPLETO_MODIFICHE_CALENDARIO.md` sono auto-lezioni dell’agente (es. «Debug temporaneo deve essere rimosso»), non correzioni a Matteo.

---

## Sezione 5 — Copertura dichiarata

| Voce | N | Note |
|------|---|------|
| File nel perimetro (P0 / piano) | **89** | solo `.md` sotto `docs/Archives/2026-01-cleanup/` |
| File aperti | **89 (100%)** | ogni md letto (titolo + body; estrazione rastrello) |
| File illeggibili | **0** | — |
| File totali in cartella (tutti i tipi) | **335** | contati; non nel target 89 |
| Non-md dichiarati e non estratti | **246** | 127 png · 28 js · 21 sql · 17 zip · 16 webm · 13 json · 12 ts · 2 cjs · 2 tsbuildinfo · 1 html · 1 ps1 · 6 senza estensione |

**Ripartizione dei 89 md:**

| Sotto-area | N | Regime applicato |
|------------|---|------------------|
| `MANIFEST.md` (root) | 1 | scavo (focus cleanup) |
| `misc/` | 2 | scavo leggero |
| `Australia_Migration_Project/` | 11 | rastrello (sintesi; niente PII nel report) |
| `Info/Agent_Reports/` | 22 | rastrello; quote utente in scavo |
| `Info/Debug/` | 5 | rastrello |
| `Info/Knowledge_Base/` | 12 | rastrello |
| `Info/User_Guides/` + Scripts README | 7 | rastrello |
| `skills/` | 4 | scavo leggero (antenati skill) |
| `test-provisori/` | 7 | rastrello; IDENTIFICAZIONE in scavo |
| `test-results/**/error-context.md` | 18 | rastrello minimo (artefatti fail Playwright) |

---

## Sezione 6 — Lacune e handoff

| Lacuna | Serve a |
|--------|---------|
| Chat originale gennaio 2026 del “cleanup root” (verifica H*) | **H\*** — attribuzione richiesta già corretta da Matteo 06-08-26; H conferma data/verbatim |
| Confronto skill archiviate qui vs skill attuali CB-v2 | **M1** (già fatta) + **C5** (`cursor-rules-cleanup`) |
| Verifica se “critical verification” → CONTROVERIFICA di giugno | **S3** / **M1** |
| Date reali 2025 vs 2026 dei report agent | **J1** (git di BHM se esiste) o **C1** Sessions_Old |
| Esito reale della scelta “RLS off” e quando RLS torna on | **C3** knowledge / **B\*** BHM-Zen / **J1** |
| Contenuto non-md (SQL migrazioni temp, script test) | fuori schema mining md; solo se S* chiede drill-down |
| Dossier Australia: materiale sensibile | non riesportare; eventuale G1 se c’è parallelo in `_lavoro` |

---

## Sezione 7 — Chiusura verso Matteo

- A gennaio 2026 hai chiesto di ripulire la root del progetto HACCP: gli agenti hanno pianificato le categorie di taglio e spostato tutto in archivio (senza cancellare). Il manifesto elenca *cosa* è stato spostato, non che l’ordine era tuo.
- Nei report archiviati si sentono già le tue domande da titolare: form vuoti all’apertura, calendario senza mock, azienda per ogni account, database pulito, e l’elenco A–G di cosa testare sulla pagina Attività.
- Nella stessa pila c’era anche il dossier personale sulla migrazione in Australia: vita e prodotto erano mescolati nella stessa cartella, e il cleanup (tuo ordine, loro piano) è arrivato dopo.
