# I1 — Piani `.cursor/plans` + `.claude/plans`: prenotazioni / HACCP

> **Ondata:** I1 · **Data:** 06-08-26 · **Regime:** rastrello (scavo sui 13 con «Matteo» / decisioni owner esplicite) · **Peso fonti:** 2–3 (piani = intenzione; non prova di chiusura)
> **Perimetro P0 §9:** 112 (CB ~54 incl. 2 `.claude` · HACCP-BHM ~39 · ambigui condivisi ~19)
> **Perimetro aperto qui:** **113** dopo esclusione di 3 falsi positivi GAME entrati per keyword «card» (`card_icons_layout_*`, `card_scalate_*`, `fix_weapon_mul_*`) — scostamento **+1** vs 112 dichiarato in §5
> **Focus prompt:** chi origina il piano, scope ristretto/allargato, completato vs abbandonato (contro-evidenza S4)

**Attribuzione:** un piano Cursor è quasi sempre **testo dell’agente** (regia). «Decisione di Matteo» / «presa dall’utente» nel piano = **citazione secondaria** (peso 3) finché H*/A* non la confermano. Frontmatter `status: completed|pending` misura lo **stato del todo nel piano**, non il lavoro in repo (serve J1/A*).

**Split dichiarato (non I1a/I1b):** ondata unica 113, come proposta P0 «I1 unico»; CB vs HACCP tenuti come sotto-etichette di classificazione, non come due report.

---

## Sezione 1 — Decisioni

### Focus — piani con Matteo / owner esplicito (scavo)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| I1-D01 | 02-08-26 | SICUREZZA | Solo TEST ora; PROD dopo S4 | MATTEO | ORIGINATA | `.claude/plans/prepara-plan-di-allineamento-scalable-parnas.md` L23-24 | «Solo TEST ora, PROD in un cantiere separato dopo il rollout S4» | env-safety |
| I1-D02 | 02-08-26 | SICUREZZA | Token = account TEST isolato da PROD | MATTEO | ORIGINATA | stesso L25-26 | «Chiave = token personale dell'account TEST» | env-isolation |
| I1-D03 | 02-08-26 | PROCESSO | Verifica registro per nomi, non a mano cieca | MATTEO | SCELTA | stesso L27 | «Verifica per confronto automatico dei nomi» | migration-hygiene |
| I1-D04 | 02-08-26 | SICUREZZA | `db push --include-all` vietato per sempre | CONGIUNTA | APPROVATA | stesso L73 | «db push --include-all resta vietato per sempre» | env-safety |
| I1-D05 | 02-08-26 | FLUSSO | Sostituzione tavolo: 3 uscite (sposta/archivia/attesa) | MATTEO | ORIGINATA | `.claude/plans/fix-sostituzione-tavolo-occupato.md` L6-7 · L65-71 | «entrambi decisi da Matteo il 02-08-26» · «La scelta 1 riguarda chi è già seduto» | service-ux-scoping |
| I1-D06 | 02-08-26 | FLUSSO | Sposta/attesa non bruciano turno tavolo | MATTEO | ORIGINATA | stesso L69-71 | «Lo spostamento non brucia un turno del tavolo conteso» | turn-accounting |
| I1-D07 | 02-08-26 | PRODOTTO | Fasce sovrapposte = difetto da chiudere | MATTEO | CORRETTIVA | stesso L175 | «Matteo ha confermato… è un difetto, va chiuso» | overlap-validation |
| I1-D08 | 02-08-26 | PROCESSO | Riusa `validateSlotConfigs`, non seconda copia | AGENTE | SCELTA | stesso L184 | «Riusa quella funzione: non scriverne una seconda» | reuse-not-duplicate |
| I1-D09 | ? | UI-UX | Servizio: sala visibile senza fascia (opz. A) | MATTEO | SCELTA | `.cursor/plans/prompt_fix_servizio_ui_06bf20bf.plan.md` L99 | «Decisione prodotto (Matteo): opzione A» | service-map-ux |
| I1-D10 | ? | UI-UX | Strip assegnate: note poi intolleranze (opz. A) | MATTEO | SCELTA | stesso L116 | «Decisione prodotto (Matteo): opzione A per note/intolleranze» | service-card-info |
| I1-D11 | ? | UI-UX | Collapse fasce Servizio chiusa di default | INCERTO | APPROVATA | stesso FIX-1 L67 | «sempre chiusa (default collapsed)» | ui-density |
| I1-D12 | 19-05-26 | PRODOTTO | Classic: digest = TUTTE le fasce, non solo canonical | MATTEO | ORIGINATA | `.cursor/plans/fase2-n-fasce-dinamiche-classic.md` L25-26 · L48-50 | «Decisione di prodotto presa dall'utente… TUTTE le fasce» | product-scoping |
| I1-D13 | 19-05-26 | PRODOTTO | `is_canonical` deprecato funzionalmente | MATTEO | SCELTA | stesso §B L61-65 | «is_canonical non governa più NESSUNA logica applicativa» | schema-deprecation |
| I1-D14 | 19-05-26 | IMPOSTAZIONI | Flag `booking_time_slots_enabled` on/off | MATTEO | ORIGINATA | stesso §C L67-70 | «L'app può avere fasce orarie oppure no» | feature-toggle |
| I1-D15 | ? | UI-UX | Sfondo Prenota mobile: strategia A+B | MATTEO | SCELTA | `fix_sfondo_prenota_mobile_09dc5137.plan.md` L97 | «Strategia approvata (Matteo: A+B)» | mobile-viewport |
| I1-D16 | ? | UI-UX | Sfondo scrollabile absolute = NO | MATTEO | CORRETTIVA | stesso §D (titolo) | «D — Sfondo scrollabile (absolute) — NO» | scope-rejection |
| I1-D17 | 12-06-26 | AI-METODO | AL-D fusioni skill ok file-per-file | MATTEO | APPROVATA | `masterplan_allineamento_skill-codice_5dda551f.plan.md` L38 | «ok Matteo file per file» | skill-governance |
| I1-D18 | 12-06-26 | AI-METODO | AL-E solo design; cancello = Meta+Matteo | MATTEO | ORIGINATA | stesso L39 | «cancello = sessione Meta con Matteo» | meta-gates |
| I1-D19 | 12-06-26 | AI-METODO | AL-F prezzi/legale gated da Matteo | MATTEO | ORIGINATA | stesso L40 | «gated decisione Matteo» | commercial-gates |
| I1-D20 | 12-06-26 | PROCESSO | Masterplan allineamento = indice, zero WP eseguiti | CONGIUNTA | APPROVATA | stesso overview L2 | «Nessun WP viene eseguito» | plan-vs-execute |
| I1-D21 | ? | UI-UX | Limite testi lunghi Prenota = 800 | MATTEO | SCELTA | `limiti_testo_prenota_acf95e24.plan.md` L163 | «Proposta Fase 2 (Matteo: 800 per testi lunghi)» | copy-limits |
| I1-D22 | 15-05-26? | PRODOTTO | Pro: nascondi Imposta Fasce in Impostazioni | INCERTO | APPROVATA | `hide_fasce_pro_edition_f76080a1.plan.md` overview | «nascondere… quando l’edition è Pro/Enterprise» | edition-ux-split |
| I1-D23 | 19-05-26? | PRODOTTO | Posizionamento solo Pro; Classic nasconde tutto | MATTEO | APPROVATA | `posizionamento_solo_pro_91467a66.plan.md` L88 | «Per conferma utente: nascondere tutto in Classic» | edition-gating |
| I1-D24 | ? | PRODOTTO | Tipologie = capacità, non nomi hard-coded | MATTEO | ORIGINATA | `ho-riavviato-il-server-ticklish-newt.md` L16-18 | «Decisione prodotto (utente): la tipologia… è UNA; i nomi… etichette» | capability-model |
| I1-D25 | ? | PRODOTTO | Niente prezzo sul carosello Prenota | INCERTO | APPROVATA | `carosello_editor_per-foto_da509b16.plan.md` L38-41 | «Decisione prodotto — niente prezzo sul carosello» | product-scoping |
| I1-D26 | ? | PRODOTTO | NIENTE toggle capability nel pannello admin | MATTEO | ORIGINATA | `ho-riavviato-il-server-ticklish-newt.md` L184 | «DECISIONE UTENTE: NIENTE toggle capability nel pannello admin» | anti-admin-toggle |
| I1-D27 | ? | VENDITA | Rimuovi coperto + +2€ caraffe su branch dedicato | INCERTO | APPROVATA | `rimozione-coperto-e-aumento-caraffe_d20ebb87.plan.md` L28-30 | «Rimozione coperto… aumentare di 2 €» | pricing-change |
| I1-D28 | 22-05-26 | TESTING | Validate 127/127 + verifica manuale Matteo | MATTEO | APPROVATA | `master-plan-stabilizzazione-e-merge-main.md` L250 | «verifica manuale confermata da Matteo» | human-qa-gate |
| I1-D29 | 22-05-26 | FLUSSO | Check capacità anche sul form pubblico (A5) | INCERTO | CORRETTIVA | stesso L265-269 | «quando un cliente conferma… non viene eseguito nessun controllo» | public-capacity-gate |
| I1-D30 | 01-02-26 | FLUSSO | Conservazione: prossima manut. = più vicina | INCERTO | SCELTA | `PLAN_COMPLETO_conservation_checkup.md` L23 | «Calcolo dinamico - mostra sempre la manutenzione più vicina» | haccp-card-logic |
| I1-D31 | 01-02-26 | FLUSSO | Completamenti multipli manutenzione ammessi | INCERTO | SCELTA | stesso L119 area | «Permettere completamenti multipli» | haccp-multi-complete |

> **I1-D11, D22, D25, D27, D29–D31:** `Chi=INCERTO` dove il piano non nomina Matteo/utente nella stessa decisione, anche se il resto del file è product-owner.  
> **Duplicato masterplan:** `…5dda551f` (todos completed) vs `…7cc6725e` (tutti pending) — stesso testo AL-*; solo il primo conta come piano chiuso di scrittura indice.

### Focus — rastrello (segnali owner senza nome Matteo, campione)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| I1-D32 | ? | AI-METODO | Controverifica parallela Fase 3 (template) | AGENTE | DELEGATA | `fase_3_controverifica_parallela_cdc56762.plan.md` overview/todos | todos pending; criteri done/fuori scope | controverifica-plan |
| I1-D33 | ? | PROCESSO | Cleanup repo completo (11 todos completed) | INCERTO | APPROVATA | `complete_repository_cleanup_66937f40.plan.md` todos | tutti `completed` | repo-hygiene |
| I1-D34 | ? | SICUREZZA | Keep-alive Supabase (3 todos completed) | INCERTO | APPROVATA | `keep-alive_supabase_512e58cb.plan.md` | todos completed | infra-keepalive |
| I1-D35 | ? | AI-METODO | Prep skill-system v0 (6 todos completed) | INCERTO | APPROVATA | `skill_system_v0_prep_9ddffabe.plan.md` | todos completed; fuori scope «v0 nuovo sistema» | template-extraction |

> **Rastrello — non estratto come decisioni:** ~80 piani tecnici (fix AddPointModal/test, temperature card v1/v2, cleanup BHM, multi-tenant rollout, alert orario, ecc.) aperti e contati; senza citazione Matteo/utente → solo inventario stato in §4/§5.

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| I1-A01 | M→A | DIRETTA | Tre uscite sostituzione tavolo + regole turno | accettata | fix-sostituzione L6 · L65 |
| I1-A02 | M→A | DIRETTA | Conferma overlap fasce = bug | accettata | fix-sostituzione L175 |
| I1-A03 | M→A | DIRETTA | Solo TEST / token TEST / niente push cieco | accettata | prepara-plan allineamento L23-27 |
| I1-A04 | M→A | DIRETTA | Classic: tutte le fasce, non solo canonical | accettata | fase2 L25-26 |
| I1-A05 | M→A | DIRETTA | Sfondo Prenota: A+B sì, absolute no | accettata | fix_sfondo L97 · §D |
| I1-A06 | M→A | DIRETTA | Servizio UI: opzioni A su mappa e strip | accettata | prompt_fix_servizio L99 · L116 |
| I1-A07 | M→A | DIRETTA | Tipologie = capacità; no toggle admin | accettata | ho-riavviato L16 · L184 |
| I1-A08 | M→A | DIRETTA | Gate Meta su AL-E/AL-F allineamento skill | accettata | masterplan 5dda L39-40 |
| I1-A09 | M→A | DIRETTA | Limite 800 testi lunghi Prenota | accettata | limiti_testo L163 |
| I1-A10 | A→M | DEDOTTA | Opus corregge piano fasce v1 (3 lock + MCP) | accettata | fase2 REV.2 L12-27 |
| I1-A11 | A→M | DEDOTTA | Agente propone riuso validateSlotConfigs | ignota | fix-sostituzione L184 (nel piano, non ratifica chat) |
| I1-A12 | M↔M | DEDOTTA | Pile di piani conservation quasi uguali (v1…FINAL) | parziale | 5+ file `fix_critici*conservation*` tutti pending |
| I1-A13 | A→A | — | Masterplan duplicato hash diverso (uno done, uno pending) | ignota | 5dda vs 7cc6725e |

> Schema §3.1 non ha `A→A`: A13 resta nota per S1 (deriva piani), non conteggiata come agency Matteo.

---

## Sezione 3 — Skill signals

| Skill | Livello provvisorio | Prova in questo perimetro | Contro-evidenza cercata |
|-------|---------------------|---------------------------|-------------------------|
| `env-safety` | L3 (provvisorio) | I1-D01–D04 · I1-A03 | Cercata: sì — piani CB ancora «pending» su multi-tenant/prod rollout senza chiusura nel piano |
| `product-scoping` | L3 (provvisorio) | I1-D12 · D16 · D24–D26 · A04/A07 | Cercata: sì — pile HACCP pending e duplicati (§4) |
| `service-ux-scoping` | L2 | I1-D05–D07 · A01/A02 | Completamento reale → A11/J1 |
| `edition-gating` | L2 | I1-D22–D23 | Piano hide_fasce ancora tutti pending |
| `plan-vs-execute` | L2 | I1-D20 (indice senza WP) | Contro: 45 piani «tutto pending» mai aggiornati |
| `migration-hygiene` | L2 | I1-D03–D04 | Esito push TEST → J1 |
| `capability-model` | L2 | I1-D24 · D26 | Incrocio A* Prenota |
| `haccp-card-logic` | L1 | I1-D30–D31 (Chi INCERTO) | Dominio forte in volume piani, debole in attribuzione Matteo |

---

## Sezione 4 — Contro-evidenze

Obbligatorie per S4; cercate attivamente sul perimetro piani:

1. **Piani ≠ chiusura.** Su 113 file: **23** con tutti i todos `completed`, **5** misti, **≥45** con ≥3 todos tutti ancora `pending`. Il pending massivo (soprattutto HACCP conservation / AddPointModal / profilo punto / BHM cleanup) è la contro-evidenza principale di scoping: si **pianifica a ripetizione** senza aggiornare (o senza chiudere) il piano.
2. **Duplicati e supersessioni non dichiarate.** Esempi: `fix_critici_e_completamento_conservation_*` (più versioni + FINAL, tutti pending); `profilo_punto_conservazione_*` (3 hash); `bhm_cleanup_e_refactoring` v1+v2 pending; masterplan allineamento **due copie** (una completed, una pending identica nei WP). Segnale di **rientro sullo stesso cantiere** senza archiviare il piano vecchio.
3. **Bug lasciato aperto nel master plan.** `master-plan-stabilizzazione-e-merge-main.md`: A1–A4 spuntati, **A5** (check capacità form pubblico) ancora «BUG APERTO» / `[~]` — il piano stesso documenta lo scarto intenzione↔realtà (I1-D29).
4. **Prompt-piano non eseguito come todo.** `prompt_fix_servizio_ui_*`, `hide_fasce_pro_*`, `limiti_testo_prenota_*` restano pending: possono essere stati eseguiti altrove (A*) o abbandonati — **da falsificare in A*/J1**, non assunti chiusi.
5. **Attribuzione debole su HACCP.** Densità altissima di piani conservation/temperature, ma quasi **zero** «Matteo» verbatim: le decisioni I1-D30–D31 restano INCERTO. Contro-evidenza al claim «owner forte su HACCP» *in questa linea I* (può essere vero in B/C/H, non qui).
6. **Falsi positivi di classificazione.** 3 piani GAME entrati per «card»/path — segnale che il naming dei piani non è affidabile senza aprire il testo (fatto; esclusi dal conteggio netto).

---

## Sezione 5 — Copertura dichiarata

| Metrica | Valore |
|---------|--------|
| File nel perimetro P0 (I1) | **112** (aggregato §9) |
| File classificati CB+HACCP+AMBIGUO prima del filtro | 116 |
| Falsi positivi GAME esclusi dopo apertura | 3 (`card_icons_layout_*`, `card_scalate_*`, `fix_weapon_mul_*`) |
| **File nel perimetro I1 di questa ondata** | **113** |
| **File aperti** | **113 (100%)** |
| Righe lette (somma) | ~28.7k (pre-filtro 116; scostamento irrilevante) |
| Regime scavo (≥1 «Matteo» o frase origin) | **12** (escluso falso `card_icons` path `Matteo/Skills`) |
| Regime rastrello | **101** |
| Sotto-conteggio classificazione (post-filtro) | CB ~50 · HACCP ~48 · AMBIGUO ~15 (ordine di grandezza; non riallineato al 52/39/19 di P0 file-per-file) |
| File illeggibili | **0** |
| Split I1a/I1b | **non usato** (ondata unica, come da proposta P0) |

Path assoluti radice: `C:\Users\matte.MIO\.cursor\plans\` + `C:\Users\matte.MIO\.claude\plans\`.

---

## Sezione 6 — Lacune e handoff

| Lacuna | Serve a |
|--------|---------|
| Incrocio piano↔sessione: quali pending sono in realtà chiusi in A* | **A5–A11**, **A11** (Servizio ago) |
| Conferma verbatim decisioni «Matteo:» nei piani (peso 1) | **H3** (giu–ago), **H2** |
| Merge/migrazioni/validate reali vs checkbox piani | **J1** |
| Piani giochi/trading/altro (esclusi + 3 GAME filtrati) | **I2** |
| Catalogo abandoned “veri” vs solo todo stale | **S4** (usa §4 di questo report come input) |
| Riconciliare conteggio CB/HACCP/ambiguo con lista P0 file-per-file | opzionale **AGG** / nota S1 |
| Duplicato masterplan 7cc6725e: cancellare o archiviare? | fuori scope I1 — Meta |

---

## Sezione 7 — Chiusura verso Matteo

Nei piani di prenotazioni e servizio si vede bene dove hai deciso tu: tavoli da spostare in tre modi, fasce che non si accavallano, Classic che mostra tutte le fasce, sfondo telefono stabile, tipologie come «capacità» non come nomi fissi.  
Sul filone conservazione/temperature i piani sono tantissimi e spesso ancora «pending» o ripetuti: lì il piano da solo non dimostra che hai chiuso o abbandonato — serve confrontarlo con le chat e con git.  
In sintesi: i piani mostrano la tua **capacità di restringere lo scope** quando firmi la decisione; mostrano anche la tendenza a **lasciare piani aperti o duplicati** quando il cantiere è lungo — materiale utile per la controprova finale.
