# C3 — HACCP legacy: knowledge-legacy + Knowledge (antenati skill / conservazione)

> **Ondata:** C3 · **Data report:** 06-08-26 · **Regime:** rastrello · **Peso fonti:** 3 (artefatti agenti + inventario BHM; poche citazioni «utente»)
> **Perimetro:** `docs/Archives/knowledge-legacy/` (60 md) + `docs/Archives/Knowledge/` (25 md) = **85 md**
> **File aperti:** **85 / 85** (100%) — conteggio disco + `Get-Content` su ogni file
> **Focus prompt:** cosa è stato «conoscenza da conservare» e da chi; antenati di skill system (blindatura, LOCK, multi-agent, NotebookLM, Superpowers, testing standards)
> **Nota mtime:** non usata. Date = intestazioni nei documenti.
> **PII:** credenziali/email presenti in più file Knowledge/Old multi_agent e un report Wix — nei report solo `path + tipo`, mai valori.

**Attribuzione:** la parola «Matteo» compare come (1) **ospite di test** in report calendario Al Ritrovo, (2) **email di login test** / Maintainer in docs BHM, (3) URL GitHub. **Mai** come firma esplicita di una decisione di conservazione conoscenza. Le decisioni umane sono etichettate «utente» / «User» / «Richiesta» / «Feedback» → `Chi = MATTEO` (ruolo Owner, come C1). Dove manca citazione umana → `INCERTO` o `AGENTE`.

---

## Sezione 1 — Decisioni

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| C3-D01 | 27-01-25 | AI-METODO | Archive root escluso da NotebookLM pack | INCERTO | ORIGINATA | `knowledge-legacy/ARCHIVE/README.md` L48 | «Questi file NON sono inclusi in `docs/agent-knowledge/` per NotebookLM.» | knowledge-pack-scope |
| C3-D02 | 27-01-25 | AI-METODO | Archive report agenti escluso da pack | INCERTO | ORIGINATA | `knowledge-legacy/Report agenti/ARCHIVE/README.md` L44 | «I file in questa cartella NON sono inclusi in `docs/agent-knowledge/`» | knowledge-pack-scope |
| C3-D03 | 27-01-25 | AI-METODO | Priorità file da caricare su NotebookLM | AGENTE | ORIGINATA | `…/NOTEBOOKLM_SETUP.md` L18–L111 | «File da Caricare su NotebookLM» + «Skills e Metodologie» | knowledge-pack-scope |
| C3-D04 | ? | AI-METODO | Pack agenti = stessi file NotebookLM | AGENTE | ORIGINATA | `…/NOTEBOOKLM_AGENT_INTEGRATION.md` L310 | «Regola d'oro: I file in `docs/agent-knowledge/` devono essere gli stessi» | knowledge-pack-sync |
| C3-D05 | ? | AI-METODO | Opzione 1: docs accessibili agli agenti | AGENTE | SCELTA | `…/NOTEBOOKLM_AGENT_INTEGRATION.md` L23 | «OPZIONE 1: Documenti Accessibili agli Agenti (Consigliata)» | agent-knowledge-access |
| C3-D06 | ? | AI-METODO | Superpowers = metodologie principali | AGENTE | ORIGINATA | `…/SUPERPOWERS_INTEGRATION_COMPLETE.md` L231 | «Le Superpowers skills sono ora le metodologie principali» | external-skill-adoption |
| C3-D07 | ? | AI-METODO | Skills obbligatorie se esistono | AGENTE | ORIGINATA | `…/SUPERPOWERS_INTEGRATION_COMPLETE.md` L171 | «Skills sono obbligatorie - Se una skill esiste… DEVI usarla» | skill-mandatory-use |
| C3-D08 | ? | AI-METODO | Backup vecchie skills in `.skills-backup/` | AGENTE | ORIGINATA | `…/SUPERPOWERS_INTEGRATION_COMPLETE.md` L63–L71 | «Backup Vecchie Skills… disponibili nel backup» | skill-conservation |
| C3-D09 | 20-10-25 | AI-METODO | Sistema 5 agenti OBSOLETO → 7 agenti | INCERTO | CORRETTIVA | `Knowledge/…/README_ARCHIVIO.md` L1–L5 | «OBSOLETO… Sostituito da: Sistema 7 Agenti» | multi-agent-orchestration |
| C3-D10 | 20-10-25 | AI-METODO | Motivo: planning 90% / coding 10% | INCERTO | ORIGINATA | `README_ARCHIVIO.md` L29–L40 | «Focus solo su testing/blindatura… Metodologia 90% Planning / 10% Coding» | multi-agent-orchestration |
| C3-D11 | 16-01-25 | AI-METODO | Header `// LOCKED:` + commit `LOCK:` | INCERTO | ORIGINATA | `Old multi_agent/CORE_ESSENTIALS.md` L66–L69; `WORKFLOW_BLINDATURA.md` L176–L229 | «MAI modificare file con `// LOCKED:`» | lock-discipline |
| C3-D12 | ? | TESTING | Checklist blindatura 100% test | INCERTO | ORIGINATA | `Old multi_agent/TESTING_STANDARDS.md` L195–L205 | «BLINDATURA CHECKLIST… Test Coverage 100%» | blindatura-checklist |
| C3-D13 | ? | AI-METODO | Top 10 regole NON negoziabili | INCERTO | ORIGINATA | `CORE_ESSENTIALS.md` L64–L136 | «TOP 10 REGOLE NON NEGOZIABILI» | agent-non-negotiables |
| C3-D14 | ? | AI-METODO | Preservare dati Precompila (whitelist) | INCERTO | ORIGINATA | `CORE_ESSENTIALS.md` L84–L88 | «Preservare SEMPRE dati Precompila» | precompila-preserve |
| C3-D15 | ? | AI-METODO | Sequenza obbligatoria Agente 1→5 | INCERTO | ORIGINATA | `CORE_ESSENTIALS.md` L110–L118 | «Seguire sequenza agenti… Agente 1… PRIMA» | multi-agent-sequence |
| C3-D16 | 01-25 | UI-UX | Design v1 rifiutato: «è molto brutto» | MATTEO | ORIGINATA | `knowledge-legacy/DESIGN_CHANGELOG.md` L14 | «è molto brutto» - Solo calendario accettabile | user-feedback-loop |
| C3-D17 | 01-25 | UI-UX | Design v2 «Caldo & Legno» approvato | MATTEO | APPROVATA | `DESIGN_CHANGELOG.md` L40–L42 | «Status: ✅ Approvato utente» | user-feedback-loop |
| C3-D18 | 27-01-25 | UI-UX | Font moderni ma professionali | MATTEO | ORIGINATA | `DESIGN_CHANGELOG.md` L107 | «migliora anche i font. moderni ma professionali» | product-ux |
| C3-D19 | 27-01-25 | UI-UX | Admin nav laterale → orizzontale | MATTEO | ORIGINATA | `DESIGN_CHANGELOG.md` L145 | «sposta dashboard di admin da laterale a pannello in alto» | product-ux |
| C3-D20 | 27-01-25 | UI-UX | Foto sfondo pagina prenota (pending) | MATTEO | ORIGINATA | `DESIGN_CHANGELOG.md` L220 | «inseriremo una foto come sfondo della pagina prenota» | product-ux |
| C3-D21 | 27-01-25 | UI-UX | Card eventi calendario non carine | MATTEO | ORIGINATA | `DESIGN_CHANGELOG.md` L245 | «Non mi piacciono solamente le card delle prenotazioni…» | product-ux |
| C3-D22 | 27-01-25 | UI-UX | Rimuovere animazioni stat cards | MATTEO | CORRETTIVA | `ARCHIVE/SESSION_SUMMARY_FINAL.md` L63 | «Stat cards animazioni rimosse (su richiesta utente)» | user-feedback-loop |
| C3-D23 | 02-11-25 | PRODOTTO | Bug: menu non visibile su prenota | MATTEO | ORIGINATA | `…/MENU_FIX_REPORT.md` L4 | «User reported "non vedo il menu nella pagina prenota"» | bug-triage |
| C3-D24 | 17-01-25 | PRODOTTO | Mappare/testare pagina Attività | MATTEO | ORIGINATA | `Old multi_agent/REPORT_COMPLETO_…ATTIVITA….md` L10–L14 | «Richiesta Utente… Mappare tutta la pagina attività» | product-scoping |
| C3-D25 | 17-01-25 | PRODOTTO | Sei problemi Attività da utente | MATTEO | ORIGINATA | stesso report L16–L22 | «Problemi Identificati dall'Utente» | product-scoping |
| C3-D26 | 27-01-25 | PROCESSO | Test manuali → sostituiti da E2E | INCERTO | CORRETTIVA | `knowledge-legacy/ARCHIVE/README.md` L19–L20 | «Guide test manuali vecchie, sostituite da test E2E» | test-strategy |
| C3-D27 | 27-01-25 | PROCESSO | Report duplicati → tenere *_FINAL | INCERTO | CORRETTIVA | `Report agenti/ARCHIVE/README.md` L13–L18 | «Sostituito da `PROJECT_COMPLETION_FINAL.md`» | knowledge-dedupe |
| C3-D28 | ? | SICUREZZA | Rimuovere pulsanti Dev pre-prod | INCERTO | ORIGINATA | `PRE_PRODUCTION_CLEANUP.md` L1–L16 | «NON dovranno essere disponibili per gli utenti finali» | prod-cleanup |
| C3-D29 | 16-10-25 | AI-METODO | Inventario 200+ componenti da zero | AGENTE | ORIGINATA | `INVENTARIO_COMPLETO_RIESEGUITO.md` L1–L29 | «INVENTARIO COMPLETO DA ZERO… 200+» | component-inventory |
| C3-D30 | ? | PRODOTTO | Flow ACCETTA booking fixato dall'utente | MATTEO | CORRETTIVA | `knowledge-legacy/Report agenti/FINAL_TESTING_REPORT.md` L65 | «Status: ✅ Fixato dall'utente» | bug-triage |

> **Rastrello — non estratto come decisione:** ~55 file = report di fase/fix RLS/menu/testing agent status senza citazione Owner/utente. Segnalati in §5 come LOW/NONE.
> **«Owner: Al Ritrovo»** in `PRD.md` L1206 = owner di prodotto commerciale, non decisione Matteo.
> **«Maintainer: Matteo Cavallaro»** in `PRE_PRODUCTION_CLEANUP.md` L415 = attribuzione documento, non decisione.

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| C3-A01 | M→A | DIRETTA | Rifiuta design v1 («è molto brutto») | accettata | `DESIGN_CHANGELOG.md` L14 → v2 |
| C3-A02 | M→A | DIRETTA | Chiede font moderni professionali | accettata | `DESIGN_CHANGELOG.md` L107 |
| C3-A03 | M→A | DIRETTA | Navbar admin da laterale a orizzontale | accettata | `DESIGN_CHANGELOG.md` L145 |
| C3-A04 | M→A | DIRETTA | Toglie animazioni alle stat cards | accettata | `SESSION_SUMMARY_FINAL.md` L63 |
| C3-A05 | M→A | DIRETTA | Segnala menu assente su prenota | accettata | `MENU_FIX_REPORT.md` L4 |
| C3-A06 | M→A | DIRETTA | Elenca 6 problemi pagina Attività | parziale | `REPORT_…ATTIVITA….md` L16–L22; stati «da verificare» |
| C3-A07 | M→A | DIRETTA | Feedback card eventi calendario | ignota | `DESIGN_CHANGELOG.md` L245 (pending) |
| C3-A08 | M→A | DIRETTA | Foto sfondo prenota | ignota | `DESIGN_CHANGELOG.md` L220 (pending) |
| C3-A09 | A→M | DEDOTTA | Tracking mentiva: Checkbox/Radio inesistenti | accettata | `RIEPILOGO_ALLINEAMENTO_2025-01-17.md` L13–L28 |
| C3-A10 | A→M | DEDOTTA | Button.tsx LOCKED ma 0 usi in app | accettata | `AGENTE_1_UI_BASE_TEST_RESULTS.md` L23–L28 |
| C3-A11 | A→M | DEDOTTA | 988 test su porta 3000, app su 3001 | accettata | `AGENTE_1_REVISIONE_UI_BASE.md` L15–L19 |
| C3-A12 | A→M | DIRETTA | File tracking cambiato dall'utente mid-edit | accettata | `REPORT_…ATTIVITA….md` L114 |

> **M↔M:** nessuna esplicita in questo perimetro.
> **M→A con nome «Matteo» verbatim:** 0. Tutte le M→A usano etichetta «utente»/«User»/«Richiesta».

---

## Sezione 3 — Skill signals

| Skill | Livello provvisorio | Evidenza (ID) | Contro-evidenza cercata |
|-------|---------------------|---------------|-------------------------|
| `user-feedback-loop` (UX immediato) | **L3** (M→A DIRETTA ripetute) | C3-D16…D22, A01–A04 | §4: task pending non chiusi (foto/card) |
| `knowledge-pack-scope` / sync NotebookLM | **L1** (codificato da agenti; Matteo non firma) | C3-D01…D05 | §4: Chi = INCERTO su chi ha deciso lo scope |
| `external-skill-adoption` (Superpowers) | **L1** | C3-D06–D08 | §4: backup «vecchie skills» = metodo già ribaltato |
| `lock-discipline` / `blindatura-checklist` | **L1** (sistema documentato; non voce Matteo) | C3-D11–D15 | §4: LOCK su componenti inutilizzati; conteggi falsi |
| `multi-agent-orchestration` (5→7) | **L2** processo (cambio metodo) ma **L0** Matteo-named | C3-D09–D10 | §4: 5-agent dichiarato fallimentare/obsoleto |
| `component-inventory` | **L1** agenti | C3-D29 | §4: inventario gonfiato vs realtà (RIEPILOGO) |
| `prod-cleanup` | **L0** | C3-D28 | Solo checklist; Maintainer nome senza decisione |
| `vocabolario` / `profilo` (CB-v2 Comunicazione) | **assente** in questo perimetro | — | Cercati: nessuna occorrenza |

**Nessuna skill L4 attribuibile a Matteo qui** (nessuna regola firmata «Matteo» che sopravviva come skill CB-v2). Gli antenati LOCK/blindatura/NotebookLM/Superpowers sono **sistema agenti**, non voce Owner.

---

## Sezione 4 — Contro-evidenze

| Claim suggerito dal corpus | Contro-evidenza | Fonte |
|----------------------------|-----------------|-------|
| «Blindatura = componente davvero usato» | Button.tsx 🔒 LOCKED, 0 bottoni usano quel componente | `AGENTE_1_UI_BASE_TEST_RESULTS.md` |
| «MASTER_TRACKING / inventari sono verità» | Checkbox/Radio documentati e testati ma file assenti; conteggi UI/onboarding errati | `RIEPILOGO_ALLINEAMENTO_2025-01-17.md` |
| «Multi-agent 5 agenti è il metodo» | Archivio 20-10-25: OBSOLETO, sostituito da 7 agenti planning-heavy | `README_ARCHIVIO.md` |
| «Matteo decide cosa tenere nel knowledge pack» | Criteri NotebookLM/agent-knowledge scritti da agenti; Chi INCERTO | `NOTEBOOKLM_*`, `ARCHIVE/README.md` |
| «User feedback loop chiude sempre» | Foto sfondo + card eventi ancora Pending | `DESIGN_CHANGELOG.md` L217–L252 |
| «LOCK protegge qualità» | Porta errata → «TUTTI I TEST FALLISCONO» pur con lock/rilascio dichiarati ok | `AGENTE_1_REVISIONE_UI_BASE.md` |
| «Docs essenziali sono sicuri» | Credenziali in chiaro (tipo: test-login, Wix-login, anon-key) in CORE/WORKFLOW/NAVIGATION | path+tipo only |
| «Owner = Matteo» | PRD Owner = «Al Ritrovo - Bologna»; booking «Matteo» = ospite test | `PRD.md` L1206; `CALENDAR_*` |

Cercata attivamente **A→M «Matteo fuori strada» DIRETTA sul merito prodotto:** non trovata. Le A→M sono correzioni di **documentazione/processo** (tracking falso, LOCK teatrale).

---

## Sezione 5 — Copertura dichiarata

| Voce | N | Note |
|------|---|------|
| File nel perimetro (md) | **85** | 60 knowledge-legacy + 25 Knowledge |
| File aperti | **85 (100%)** | ogni md aperto (rastrello) |
| File illeggibili/saltati | **0** | — |
| Non-md in cartelle (contati, non estratti) | **5** | 4× `.sql` + 1× `.txt` sotto `knowledge-legacy/ARCHIVE/` |

### A. File-by-file coverage (path relativo a `docs/Archives/`)

#### knowledge-legacy/ (60)

| Path | Signal | Content type |
|------|--------|--------------|
| `knowledge-legacy/PRD.md` | LOW | PRD prodotto Al Ritrovo; Owner = ristorante |
| `knowledge-legacy/PLANNING_TASKS.md` | LOW | Task breakdown fasi booking |
| `knowledge-legacy/DESIGN_CHANGELOG.md` | **HIGH** | Feedback utente verbatim + iterazioni UX |
| `knowledge-legacy/TESTING_CHECKLIST.md` | MED | Checklist 150+ test post-redesign |
| `knowledge-legacy/ARCHIVE/README.md` | **HIGH** | Criterio esclusione pack NotebookLM |
| `knowledge-legacy/ARCHIVE/SESSION_SUMMARY_FINAL.md` | **HIGH** | «su richiesta utente» animazioni |
| `knowledge-legacy/ARCHIVE/TESTING_USERFLOW.md` | LOW | Guida test manuale (poi obsoleta) |
| `knowledge-legacy/ARCHIVE/TESTING_SESSION.md` | NONE | agent status report, no Matteo quote |
| `knowledge-legacy/ARCHIVE/DEPLOYMENT_FIX.md` | NONE | agent status report, no Matteo quote |
| `knowledge-legacy/ARCHIVE/EDGE_FUNCTION_SETUP.md` | NONE | setup agent |
| `knowledge-legacy/ARCHIVE/SETUP_SECRETS.md` | LOW | azione umana secrets (no nome) |
| `knowledge-legacy/ARCHIVE/TEST_EMAIL_FLOW.md` | NONE | procedura test email |
| `knowledge-legacy/ARCHIVE/NAVIGATION_REPORT.md` | LOW | Wix explore; PII credentials (path+tipo) |
| `knowledge-legacy/ARCHIVE/GUIDA_STANDALONE.md` | LOW | guida split calendario (altro progetto) |
| `knowledge-legacy/Report agenti/ARCHIVE/README.md` | **HIGH** | dedupe + esclusione NotebookLM |
| `knowledge-legacy/Report agenti/ARCHIVE/Archivio 2/NOTEBOOKLM_SETUP.md` | **HIGH** | pack conoscenza + Superpowers in scope |
| `knowledge-legacy/Report agenti/ARCHIVE/Archivio 2/NOTEBOOKLM_AGENT_INTEGRATION.md` | **HIGH** | regola d'oro sync + opzioni agenti |
| `knowledge-legacy/Report agenti/ARCHIVE/Archivio 2/SUPERPOWERS_INTEGRATION_COMPLETE.md` | **HIGH** | adozione skill esterne + backup |
| `knowledge-legacy/Report agenti/ARCHIVE/Archivio 2/MENU_FIX_REPORT.md` | **HIGH** | User reported bug menu |
| `knowledge-legacy/Report agenti/ARCHIVE/Archivio 2/README_ALRITROVO.md` | MED | overview + punta a knowledge pack |
| `knowledge-legacy/Report agenti/ARCHIVE/Archivio 2/TESTING_PLAN_RINFRESCO_LAUREA.md` | MED | cita Superpowers testing skill |
| `knowledge-legacy/Report agenti/ARCHIVE/Archivio 2/{FINAL_TESTING,SUMMARY,TESTING_REPORT}_RINFRESCO*.md` | LOW | agent test reports |
| `knowledge-legacy/Report agenti/ARCHIVE/Archivio 2/{MENU_*,BEVANDE_*,REMOVE_ACQUA*,IMPLEMENTATION*,MIGRATION*,DUPLICATE*,QUICK_START*}.md` | LOW/NONE | fix menu tecnici |
| `knowledge-legacy/Report agenti/ARCHIVE/Archivio 2/{README_VERIFICATION,FINAL_VERIFICATION_INDEX,VISUAL_VERIFICATION*}.md` | LOW | verification agent |
| `knowledge-legacy/Report agenti/ARCHIVE/Archivio 2/{WIX_*,VERCEL_*,MCP_SUPABASE_CONFIG}.md` | LOW | setup guides |
| `knowledge-legacy/Report agenti/{PROJECT_STATUS_CURRENT,PROJECT_COMPLETION_FINAL,ARCHITECTURE_CORRECT,FINAL_TESTING_REPORT,SETUP_REPORT,PHASE_*,DEBUG_*,MCP_*,RLS_*}.md` | NONE/LOW | agent status report, no Matteo quote |
| `knowledge-legacy/Report agenti/ARCHIVE/{CALENDAR_*,PROJECT_COMPLETION_REPORT,RLS_*,MCP_*,DEBUG_*,DATABASE_*,NEXT_STEPS,PLAYWRIGHT_*}.md` | NONE/LOW | agent status; «Matteo» = ospite booking dove compare |

#### Knowledge/ (25)

| Path | Signal | Content type |
|------|--------|--------------|
| `Knowledge/Knowledge/old_multi_agent/vecchi_prompt_5_agenti/README_ARCHIVIO.md` | **HIGH** | 5→7 agent migration + perché |
| `Knowledge/Knowledge/old_multi_agent/vecchi_prompt_5_agenti/GUIDA_TESTING_MULTI_AGENT.md` | **HIGH** | blindatura + LOCK + checklist |
| `Knowledge/Knowledge/old_multi_agent/vecchi_prompt_5_agenti/AGENT_STATUS.md` | MED | coordinamento lock/queue |
| `Knowledge/Knowledge/old_multi_agent/vecchi_prompt_5_agenti/AGENTE_{1..5,DEBUG,REVIEW}.md` | MED | prompt ruolo + LOCK ritual |
| `Knowledge/Knowledge/Old multi_agent/CORE_ESSENTIALS.md` | **HIGH** | non-negoziabili + LOCK + Precompila |
| `Knowledge/Knowledge/Old multi_agent/WORKFLOW_BLINDATURA.md` | **HIGH** | ciclo Esplora→Lock |
| `Knowledge/Knowledge/Old multi_agent/TESTING_STANDARDS.md` | **HIGH** | template test + blindatura checklist |
| `Knowledge/Knowledge/Old multi_agent/AGENT_COORDINATION.md` | **HIGH** | pool host + lock FIFO |
| `Knowledge/Knowledge/Old multi_agent/PRE_PRODUCTION_CLEANUP.md` | MED | cleanup prod; Maintainer nome |
| `Knowledge/Knowledge/Old multi_agent/REPORT_COMPLETO_MODIFICHE_ATTIVITA_2025-01-17.md` | **HIGH** | Richiesta Utente + 6 bug |
| `Knowledge/Knowledge/Old multi_agent/RIEPILOGO_ALLINEAMENTO_2025-01-17.md` | **HIGH** | contro-evidenza tracking falso |
| `Knowledge/Knowledge/{UI_BASE,AUTENTICAZIONE,ONBOARDING,NAVIGAZIONE,ATTIVITA}_COMPONENTI.md` | MED | inventari LOCK per area |
| `Knowledge/Knowledge/INVENTARIO_COMPLETO_RIESEGUITO.md` | MED | inventario 200+ |
| `Knowledge/Knowledge/AGENTE_1_REVISIONE_UI_BASE.md` | **HIGH** | porte/test/tracking sbagliati |
| `Knowledge/Knowledge/AGENTE_1_UI_BASE_TEST_RESULTS.md` | **HIGH** | LOCK su Button inutilizzato |

---

## Sezione 6 — Lacune e handoff

| Lacuna | Serve a |
|--------|---------|
| Chi ha deciso l'esclusione ARCHIVE da NotebookLM (D01–D02)? | B1 (BHM skill-system) / C5 (lezioni) se c'è voce Owner |
| Transcript delle frasi UX in DESIGN_CHANGELOG | H* / sessioni Al Ritrovo se esistono |
| Prompt 7 agenti «nuovo» (solo citato, fuori perimetro) | B1 / Sessions_Old C1 |
| Sopravvivenza LOCK/blindatura in CB-v2 Comunicazione-Skill | M1 (già fatta) — confrontare in S3 |
| Superpowers vs skill interne CB-v2 | M1 + S3 timeline |
| File `MASTER_TRACKING.md` citato ma non in questo perimetro | C1/C5 o BHM Production Knowledge |

---

## Sezione 7 — Chiusura verso Matteo

In questa ondata quasi non compare il tuo nome come chi decide: decide «l'utente» sul look del booking (brutto → caldo legno → font → navbar), e gli agenti decidono cosa tenere nel cervello documentale (NotebookLM / agent-knowledge) e come blindare i pezzi dell'app HACCP.

Il pezzo più utile per lo skill system di oggi: la lista «cosa tenere / cosa archiviare», il LOCK `// LOCKED` + commit `LOCK:`, la checklist di blindatura, e l'archivio esplicito del sistema a 5 agenti sostituito dal 7.

Attenzione al falso sicuro: componenti dichiarati «locked» e inventari gonfi — gli stessi agenti poi ammettono che i numeri mentivano.

---

## Appendice — Conteggi (brief F)

| Metrica | N |
|---------|---|
| md aperti | 85 |
| decisioni candidate (Sez.1) | 30 |
| agency candidate (Sez.2) | 12 (M→A 8 · A→M 4 · M↔M 0) |
| file con nome «Matteo» come **decisore** (non ospite booking, non email test, non Maintainer riga) | **0** |
| file con citazione «utente»/«User»/«Richiesta» come decisione | 8+ (`DESIGN_CHANGELOG`, `SESSION_SUMMARY_FINAL`, `MENU_FIX_REPORT`, `REPORT_…ATTIVITA`, `FINAL_TESTING_REPORT`) |
