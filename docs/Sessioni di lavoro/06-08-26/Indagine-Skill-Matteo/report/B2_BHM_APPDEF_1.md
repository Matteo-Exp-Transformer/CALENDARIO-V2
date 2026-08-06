# B2 — BHM-Zen app-definition parte 1 (rastrello)

> Ondata mining · Profilo Verifica/Meta · Regime **rastrello** · Peso fonti: 2 (report/spec archivio, non transcript)  
> Perimetro: `docs/Archives/docs/app-definition/` — primi **69** path alfabetici, fino a  
> `03_CONSERVATION\Lavoro\Gennaio-2026\15-01-2026\REVISIONE_LAVORO_AGENTI.md` (taglio P0)  
> Data report: 06-08-26

**Vertice del perimetro:** documentazione di specifica Conservation (+ Auth) scritta quasi sempre **dagli agenti**.  
**Matteo non è mai nominato** nei 69 file. Dove compare «utente» / «Owner» / «dialogo con l’utente» = traccia di scelta prodotto **senza identità esplicita** → `Chi = INCERTO` (mai inventare MATTEO).  
Decisioni di prodotto/compliance esplicite nel testo sono comunque catalogate; le decisioni tecniche pure degli agenti (z-index, TDD, migration) **non** entrano in Sezione 1.

---

## Sezione 1 — Decisioni

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| B2-D01 | 01-02-26 | COMPLIANCE | Temp entro ±1°C = conforme, no Attenzione | INCERTO | SCELTA | `03_CONSERVATION/Lavoro/01-02-2026/REPORT_SESSIONE_01-02-2026.md` §1 | «dentro ±1°C dal setpoint, lo stato deve essere conforme, non Attenzione» | haccp-temp-tolerance |
| B2-D02 | 01-02-26 | COMPLIANCE | Abbattitore: solo Sanificazione | INCERTO | SCELTA | stesso §2 + `REPORT_card_checkup_centralizzato.md` R6 | «Abbattitore… solo Sanificazione» / «solo manutenzioni di sanificazione» | haccp-maintenance-by-type |
| B2-D03 | 01-02-26 | PRODOTTO | 10 requisiti card checkup da dialogo | INCERTO | ORIGINATA | `…/01-02-2026/REPORT_card_checkup_centralizzato.md` §Requisiti Utente | «Dal dialogo con l'utente sono emersi i seguenti requisiti» | product-requirements-dialogue |
| B2-D04 | 16-01-26 | UI-UX | Mini calendario mensile/annuale, no numerico | INCERTO | ORIGINATA | `…/11-01-2026/PROMPTS_SEQUENZA_START.md` Worker 1 | «feature RICHIESTA ESPLICITAMENTE dall'utente. NON usare input numerico» | calendar-frequency-ux |
| B2-D05 | 15-01-26 | UI-UX | Target temp sempre disabled + range placeholder | INCERTO | SCELTA | `…/15-01-2026/REVISIONE_LAVORO_AGENTI.md` TASK M1 | «COMPORTAMENTO RICHIESTO: … disabilitato/grigio … RANGE consigliato» | conservation-temp-field |
| B2-D06 | 04-02-26 | UI-UX | Pallino verde se niente da fare oggi | INCERTO | SCELTA | `…/04-02-2026/REPORT_LAVORO_04-02-2026.md` §2.3 | «giallo è solo da completare oggi… altrimenti… verde» | maintenance-status-dot |
| B2-D07 | 04-02-26 | UI-UX | Colore «Ultima lettura» solo da conformità temp | INCERTO | SCELTA | stesso §2.5 | «verde se… conforme… rosso… fuori range; le manutenzioni non devono influire» | status-color-separation |
| B2-D08 | 04-02-26 | FLUSSO | Lettura temp completa task Rilevamento | INCERTO | SCELTA | `…/04-02-2026/PIANO_completamento_temperatura_su_lettura.md` | «task… Rilevamento Temperature… deve risultare completata» | temp-reading-completes-task |
| B2-D09 | 11-01-26 | PROCESSO | Verify First, Fix After dopo bug post-claim | INCERTO | CORRETTIVA | `…/10-01-2026/PLAN.md` Overview | «utente ha scoperto che 2 problemi critici + 6… ancora presenti» | verify-first-workflow |
| B2-D10 | 22-10-25 | PRODOTTO | Onboarding: rimuovere numero licenza | INCERTO | SCELTA | `01_AUTH/conoscenze-definizioni/ONBOARDING_FLOW.md` STEP 1 + header Fase 3 | «Numero licenza: DA RIMUOVERE» (+ punta `DECISIONI_OWNER_BETA` dec. 4) | onboarding-fields — **handoff B1** |

**Confidence (meta, non colonna schema):** D01–D09 MED (citazione «utente»/requisito esplicito, non «Matteo»); D10 LOW in B2 (spec agente + rinvio a META owner in B1).  
**Esclusi di proposito:** APPROVED/REJECTED supervisor, z-index, TDD, CSRF/Vercel fix, export bug — lavoro tecnico agente senza traccia di scelta owner.

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| B2-A01 | M→A | DIRETTA | Utente trova bug dopo claim 24/24 PASS agenti | accettata | `…/10-01-2026/PLAN.md` Overview → nasce v2.0 |
| B2-A02 | M→A | DIRETTA | Testing manuale: 6 problemi post-report | accettata | `…/11-01-2026/SUPERVISOR_FINAL_REPORT_COMPLETAMENTO_20260116.md` §Problemi rilevati |
| B2-A03 | M→A | DIRETTA | Test Utente: Select ruolo non salva; temp fissa 4°C | accettata | `…/15-01-2026/REVISIONE_LAVORO_AGENTI.md` C1/M1 |
| B2-A04 | M→A | DIRETTA | Test manuale PASS «Confermato da utente» | accettata | `…/15-01-2026/EXECUTION_LOG.md` Verifica finale |
| B2-A05 | M→A | DIRETTA | Segnalato: modal temp non chiude (X/Annulla/post-save) | parziale | `…/04-02-2026/REPORT_SESSIONE_MODAL_TEMPERATURA_04-02-2026.md` — fix fallito, aperto |

**Nota attribuzione:** «utente» = quasi certamente owner in QA, ma **mai** scritto «Matteo»/«Owner» in queste citazioni → agency catalogata come M→A per ruolo funzionale, con la stessa riserva di Sezione 1.  
**Nessuna A→M solida** in questo perimetro (nessuna citazione in cui l’agente corregge una scelta esplicita di Matteo). Auto-correzioni agente↔agente (Worker 0 false positive, supervisor REJECTED) non contano come agency owner.

---

## Sezione 3 — Skill signals

| Skill | Livello provvisorio | Prova in B2 | Contro-evidenza cercata |
|-------|---------------------|-------------|-------------------------|
| `haccp-temp-tolerance` | L1–L2? | D01 (scelta prodotto/compliance esplicita) | Sì: spec `ADD_TEMPERATURE_MODAL` ancora ±2/±4 vs D01 ±1 |
| `haccp-maintenance-by-type` | L1–L2? | D02 + tabelle tipologiche | Cercata; non trovata smentita owner |
| `verify-first-workflow` | L2? | D09 CORRETTIVA dopo fallimento delega | Contro: dopo v2.0 ancora bug utente (A02) |
| `product-requirements-dialogue` | L1 | D03 «dialogo con l'utente» | Nessuna trascrizione dialogo in B2 |
| `owner-gates` | L0 | «Validare con Owner» ancora ⏳ | Index non spuntato |

**L3/L4 non dichiarabili** qui: nessuna citazione che nomini Matteo a correggere l’agente nel merito.

---

## Sezione 4 — Contro-evidenze

1. **Delega di verifica fallita (ripetuta):** gli agenti dichiarano completamento/APPROVED; l’utente (QA) ritrova blocker critici (Select ruolo, PGRST204, mini-calendario) — `PLAN.md` 10-01, SUPERVISOR 16-01, REVISIONE 15-01. Pattern di **over-trust** sul verdicto agente, non di decisione prodotto sbagliata nominata.
2. **Sessione interrotta senza chiusura:** 04-02 modal temperatura — «Fix non riuscito – problema ancora aperto»; lavoro si ferma senza esito.
3. **Spec vs prodotto disallineati:** `ADD_TEMPERATURE_MODAL` documenta ancora Conforme/Attenzione/Critico con bande ±2/±4°C, mentre `REPORT_SESSIONE_01-02-2026` impone conforme entro ±1°C e critico fuori (niente Attenzione per temp in range). Drift agente, non ritratto owner.
4. **«Validare con Owner» non fatto:** `00_MASTER_INDEX.md` Prossimi passi ancora ⏳ — gate owner dichiarato ma non eseguito in questo archivio.
5. **Claim DB poi smentiti (meta Fase 3):** banner su `DB_VERIFICATION_RESULT.md` e simili: claim «migration 015 / campi presenti» falsi su DB live (snapshot A0) — evidenza che i report agent-approved non erano verità; appartiene anche a B1/META.

**Cercata e non trovata:** frase del tipo «Matteo ha sbagliato / ha cambiato idea / ha detto stop» con nome proprio.

---

## Sezione 5 — Copertura dichiarata

| Metrica | Valore |
|---------|--------|
| File nel perimetro | **69** (ordinati su path completo; ultimo = `…/15-01-2026/REVISIONE_LAVORO_AGENTI.md`) |
| File aperti | **69** (100%) |
| Illeggibili / saltati | **0** |
| Regime | rastrello: estratti solo (a)(b)(c); resto contato, non riassunto |
| Huge docs skimmati su sezioni Owner/HACCP/correzione | `ADD_POINT_MODAL` (root+Conoscenze), `CONSERVATION_PAGE`, `TASKS_COMPLETAMENTO`, `WORKER_PROMPTS_FINAL`, `00_MASTER_INDEX` Conservation |

### File aperti — tag (uno per file)

| Tag | Path relativo |
|-----|----------------|
| INDEX | `00_MASTER_INDEX.md` |
| SPEC-ONLY | `00_TEMPLATE_per creare conoscenze-definizioni.md` |
| SPEC-ONLY | `01_AUTH/conoscenze-definizioni/BLINDATURA_PLAN.md` |
| SPEC-ONLY | `01_AUTH/conoscenze-definizioni/LOGIN_FLOW.md` |
| SIGNAL | `01_AUTH/conoscenze-definizioni/ONBOARDING_FLOW.md` |
| SPEC-ONLY | `01_AUTH/conoscenze-definizioni/ONBOARDING_TO_MAIN_MAPPING.md` |
| EMPTY-SIGNAL | `01_AUTH/Lavoro/07-02-2026/REPORT_CSRF_LOGIN_VERCEL_07-02-2026.md` |
| INDEX | `03_CONSERVATION/00_MASTER_INDEX.md` |
| SPEC-ONLY | `03_CONSERVATION/ADD_POINT_MODAL.md` |
| SIGNAL | `03_CONSERVATION/Bug&Fix/VERIFICATION_REPORT_20260111.md` |
| SIGNAL | `03_CONSERVATION/Conoscenze-Definizioni/ADD_POINT_MODAL.md` |
| SIGNAL | `03_CONSERVATION/Conoscenze-Definizioni/ADD_TEMPERATURE_MODAL.md` |
| SPEC-ONLY | `03_CONSERVATION/Conoscenze-Definizioni/CONSERVATION_PAGE.md` |
| SPEC-ONLY | `03_CONSERVATION/Conoscenze-Definizioni/CONSERVATION_POINT_CARD.md` |
| SIGNAL | `03_CONSERVATION/Conoscenze-Definizioni/SCHEDULED_MAINTENANCE_SECTION.md` |
| SPEC-ONLY | `03_CONSERVATION/Conoscenze-Definizioni/TEMPERATURE_READINGS_SECTION.md` |
| INDEX | `03_CONSERVATION/Lavoro/00_MASTER_INDEX_CONSERVATION.md` |
| INDEX | `03_CONSERVATION/Lavoro/01-02-2026/README.md` |
| SIGNAL | `03_CONSERVATION/Lavoro/01-02-2026/REPORT_card_checkup_centralizzato.md` |
| SIGNAL | `03_CONSERVATION/Lavoro/01-02-2026/REPORT_SESSIONE_01-02-2026.md` |
| SIGNAL | `03_CONSERVATION/Lavoro/04-02-2026/PIANO_completamento_temperatura_su_lettura.md` |
| INDEX | `03_CONSERVATION/Lavoro/04-02-2026/README.md` |
| SIGNAL | `03_CONSERVATION/Lavoro/04-02-2026/REPORT_LAVORO_04-02-2026.md` |
| SIGNAL | `03_CONSERVATION/Lavoro/04-02-2026/REPORT_SESSIONE_MODAL_TEMPERATURA_04-02-2026.md` |
| SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/10-01-2026/PLAN.md` |
| INDEX | `03_CONSERVATION/Lavoro/Gennaio-2026/10-01-2026/README.md` |
| PROMPT | `03_CONSERVATION/Lavoro/Gennaio-2026/10-01-2026/TASKS.md` |
| EMPTY-SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/10-01-2026/TYPESCRIPT_FIX_REPORT.md` |
| PROMPT | `03_CONSERVATION/Lavoro/Gennaio-2026/10-01-2026/WORKER_PROMPTS.md` |
| PROMPT | `03_CONSERVATION/Lavoro/Gennaio-2026/11-01-2026/PLAN_COMPLETAMENTO_FEATURE.md` |
| PROMPT | `03_CONSERVATION/Lavoro/Gennaio-2026/11-01-2026/PROMPT_RIEPILOGO_STATO_20260116.md` |
| PROMPT | `03_CONSERVATION/Lavoro/Gennaio-2026/11-01-2026/PROMPTS_SEQUENZA_START.md` |
| INDEX | `03_CONSERVATION/Lavoro/Gennaio-2026/11-01-2026/README.md` |
| SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/11-01-2026/RIEPILOGO_LAVORO_COMPLETATO_20260116.md` |
| EMPTY-SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/11-01-2026/STATO_IMPLEMENTAZIONE_vs_DEFINIZIONI.md` |
| SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/11-01-2026/SUPERVISOR_FINAL_REPORT_COMPLETAMENTO_20260116.md` |
| PROMPT | `03_CONSERVATION/Lavoro/Gennaio-2026/11-01-2026/TASKS_COMPLETAMENTO.md` |
| PROMPT | `03_CONSERVATION/Lavoro/Gennaio-2026/11-01-2026/WORKER_PROMPTS_COMPLETAMENTO.md` |
| INDEX | `03_CONSERVATION/Lavoro/Gennaio-2026/12-01-2026/README.md` |
| PROMPT | `03_CONSERVATION/Lavoro/Gennaio-2026/12-01-2026/WORKER_PROMPTS_FINAL.md` |
| EMPTY-SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/13-01-2026/CHI_ESEGUE_GATE_0.md` |
| EMPTY-SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/13-01-2026/FIX_SUMMARY.md` |
| EMPTY-SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/13-01-2026/GATE_0_VERDICT.md` |
| EMPTY-SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/13-01-2026/GATE_0_VERIFICATION_REPORT.md` |
| EMPTY-SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/13-01-2026/GATE_0_VERIFICATION_STATUS.md` |
| EMPTY-SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/13-01-2026/GATE_1_VERIFICATION_REPORT.md` |
| EMPTY-SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/13-01-2026/PROGRESS_REPORT_WORKER3_FASE1.md` |
| EMPTY-SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/13-01-2026/PROGRESS_REPORT_WORKER3_FASE3.md` |
| PROMPT | `03_CONSERVATION/Lavoro/Gennaio-2026/13-01-2026/PROMPT_WORKER_1_FIX_POST_0.7.md` |
| PROMPT | `03_CONSERVATION/Lavoro/Gennaio-2026/13-01-2026/PROMPT_WORKER_3_FIX_POST_0.7.md` |
| INDEX | `03_CONSERVATION/Lavoro/Gennaio-2026/13-01-2026/README.md` |
| EMPTY-SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/13-01-2026/REPORT_VERIFICA_WORKER_4.md` |
| EMPTY-SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/13-01-2026/SUPERVISOR_FINAL_REPORT_COMPLETAMENTO.md` |
| EMPTY-SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/13-01-2026/SUPERVISOR_FINAL_REPORT_VERIFICATION_POST_FIX.md` |
| EMPTY-SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/13-01-2026/SUPERVISOR_FINAL_REPORT.md` |
| EMPTY-SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/13-01-2026/SUPERVISOR_QUALITY_CHECK_REPORT.md` |
| SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/14-01-2026/CONFRONTO_REQUISITI_VS_IMPLEMENTAZIONE.md` |
| EMPTY-SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/14-01-2026/DB_VERIFICATION_RESULT.md` |
| PROMPT | `03_CONSERVATION/Lavoro/Gennaio-2026/14-01-2026/PIANO_FIX_CONSOLIDATO_20260114.md` |
| INDEX | `03_CONSERVATION/Lavoro/Gennaio-2026/14-01-2026/README.md` |
| EMPTY-SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/14-01-2026/STATO_REALE_CODICE.md` |
| EMPTY-SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/14-01-2026/SUPERVISOR_FINAL_APPROVAL.md` |
| EMPTY-SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/14-01-2026/VERIFICA_DB_COMPLETATA.md` |
| EMPTY-SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/14-01-2026/WORKER4_TEST_E2E_REPORT.md` |
| EMPTY-SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/15-01-2026/ERRORE_EXPORT_ADD_POINT_MODAL.md` |
| SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/15-01-2026/EXECUTION_LOG.md` |
| PROMPT | `03_CONSERVATION/Lavoro/Gennaio-2026/15-01-2026/PLAN.md` |
| INDEX | `03_CONSERVATION/Lavoro/Gennaio-2026/15-01-2026/README.md` |
| SIGNAL | `03_CONSERVATION/Lavoro/Gennaio-2026/15-01-2026/REVISIONE_LAVORO_AGENTI.md` |

**Conteggio tag:** SIGNAL 16 · SPEC-ONLY 9 · INDEX 10 · PROMPT 12 · EMPTY-SIGNAL 22 · **totale 69**.

---

## Sezione 6 — Lacune e handoff

### Vincoli HACCP normativi trovati (nel perimetro; spesso **intento UX**, non citazione di legge)

- Tolleranza temperatura **±1°C** → conforme; fuori → critico (`REPORT_SESSIONE_01-02-2026`; anche card/checkup). *Nota:* vecchia spec modal ancora ±2/±4.
- Manutenzioni obbligatorie per tipologia: fridge/freezer 4 tipi; ambient 2; **blast = solo sanificazione** (sessioni 01-02 + R6).
- Ordine tipologie: Rilevamento temperatura → Sanificazione → Sbrinamento → Controllo scadenze (`SCHEDULED_MAINTENANCE_SECTION` / report 04-02).
- **5 profili HACCP** frigo con temp consigliate e categorie (`ADD_POINT_MODAL` Conoscenze-Definizioni); profilo obbligatorio se fridge; categorie read-only se profilo attivo.
- Note HACCP in info box profilo; foto/note lettura per audit (`ADD_TEMPERATURE_MODAL`).
- Staff onboarding: **scadenza certificazione HACCP** obbligatoria (`ONBOARDING_FLOW`, `BLINDATURA_PLAN`).
- Categorie prodotti: logica compatibilità temp implementata, ma testo chiede input «esperti HACCP» (gap normativo dichiarato, non decisione owner) — `ADD_POINT_MODAL` note categorie.

### Cosa appartiene a B1 (META / DECISIONI_OWNER)

- `ONBOARDING_FLOW` header → `DECISIONI_OWNER_BETA` dec. 4 (licenza / gap).
- Banner Fase 3 / `STATO_FASE3_INDICE` / README metodo Owner↔Agente 9 (README **non** in B2, è in B3 alfabetico).
- Qualsiasi decisione nominata «Owner» nei report META.

### Cosa continua in B3

- Da `SOLUZIONE_ERRORE_EXPORT.md` in poi: profili 19-01, foto punti 20-01, nome utente letture 22–23-01, mappature 24-01, UI temperature 30-01, Calendar Lavoro, ecc.
- Account test «Matteo Test» appare in file **fuori** B2 (22-01) — non usare come voce owner.

### Ambiguo per synthesizer

- «Utente» = owner QA vs end-user ristoratore: nei report Lavoro Gennaio/Febbraio il contesto è QA (test manuale, dialogo requisiti) → trattato come proxy owner con `Chi=INCERTO`.
- D03 elenca 10 requisiti: potrebbero essere 10 decisioni; qui **una** riga aggregata + D02 già separata per R6/compliance.
- Nessun transcript in B2: impossibile etichettare M-VOCE vs M-OK.

---

## Sezione 7 — Chiusura verso Matteo

In questi 69 pezzi di archivio **non compare il tuo nome**: gli agenti hanno scritto specifiche e report.  
Le scelte di prodotto che si vedono (range ±1°C, abbattitore solo sanificazione, mini-calendario, card checkup) arrivano come «l’utente ha chiesto / ha trovato il bug», non come «Matteo ha deciso».  
La lezione di processo è chiara: quando i worker dicevano «tutto APPROVED», tu in prova trovavi ancora i pezzi rotti — e a volte il lavoro si è fermato a metà (modal temperatura che non si chiude).
