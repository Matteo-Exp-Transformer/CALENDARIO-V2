# B3 — BHM-Zen: app-definition parte 2

> **Ondata:** B3 · **Data:** 06-08-26 · **Regime:** rastrello · **Peso fonti:** 3 (report/specifiche scritte da agenti; «utente»/Owner = Matteo solo dove il testo lo attribuisce esplicitamente)
> **Perimetro:** `docs/Archives/docs/app-definition/` — restanti **69** percorsi alfabetici (percorso relativo completo), da `03_CONSERVATION\Lavoro\Gennaio-2026\15-01-2026\SOLUZIONE_ERRORE_EXPORT.md` a `STATO_FASE3_INDICE.md` (taglio P0: B2+B3 = 138, senza buchi)
> **Nota:** quasi tutto il corpus è documentazione tecnica di agente. Non attribuire a Matteo solo perché esiste. Estratto solo: (a) scelte con Owner/utente nominato o richiesta esplicita, (b) vincoli HACCP/prodotto, (c) correzioni. Il resto contato in §5.

---

## Sezione 1 — Decisioni

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| B3-D01 | 22-10-25 | AI-METODO | Metodo: Owner descrive UI, agente documenta | MATTEO | ORIGINATA | `app-definition/README.md` L17 | «Owner ha l'app aperta, descrive cosa vede, Agente 9 traduce» | owner-interview |
| B3-D02 | 16-01-26 | AI-METODO | Owner senza background tecnico → linguaggio semplice | MATTEO | ORIGINATA | `AGENT_PROMPT_DOCUMENTATION.md` L18 | «The Owner has no technical background» | plain-language |
| B3-D03 | 16-01-26 | AI-METODO | Catturare descrizione Owner verbatim | CONGIUNTA | APPROVATA | `AGENT_PROMPT_DOCUMENTATION.md` L39 | «Capture the Owner's description verbatim» | owner-interview |
| B3-D04 | 16-01-26 | COMPLIANCE | Solo categorie prodotti compatibili col tipo punto | INCERTO | INCERTO | `…/16-01-2026/FIX_FILTRO_CATEGORIE_COMPATIBILI.md` L21-26 | «garantendo conformità HACCP» (atteso, non chi l'ha chiesto) | haccp-category-filter |
| B3-D05 | 19-01-26 | COMPLIANCE | Profili HACCP solo su frigoriferi | INCERTO | INCERTO | `…/19-01-2026/PLAN.md` L22 | «si applicano SOLO a punti di tipo frigorifero» | haccp-profiles-scope |
| B3-D06 | 20-01-26 | AI-METODO | Foto elettrodomestico: no wrapper overengineering | AGENTE | SCELTA | `…/20-01-2026/Plan_Foto_PuntiConservazione.md` L12-15 | «Componente wrapper ❌ NO Overengineering» | scope-control |
| B3-D07 | 29-01-26 | PRODOTTO | Profilo HACCP «Bibite e Bevande alcoliche» | INCERTO | INCERTO | `…/29-01-2026/REPORT_PROFILO_BIBITE_….md` L3-4 | «aggiungere il profilo…» (obiettivo, non richiesta nominata) | haccp-profile-product |
| B3-D08 | 29-01-26 | COMPLIANCE | Categorie bibite senza range temperatura obbligatorio | INCERTO | INCERTO | stesso L13-18; mappatura 29-01 | «nessun range temperatura» | haccp-optional-range |
| B3-D09 | 31-01-26 | UI-UX | Tab temperature: solo card, via pannello anomalie | MATTEO | ORIGINATA | `…/30-01-2026/miglioramenti_ui_temperature_….md` L42 | «L'utente ha richiesto di mantenere solo le card» | ui-simplify |
| B3-D10 | 31-01-26 | UI-UX | Ordinare card temperature per tipo operativo | MATTEO | ORIGINATA | stesso L43 | «la richiesta era ordinarle per tipo» | ops-priority-ui |
| B3-D11 | 31-01-26 | UI-UX | Rimuovere suffisso «contatta assistenza» dalle istruzioni | MATTEO | CORRETTIVA | `…/30-01-2026/REPORT_FIX_BUG_UI_TEMPERATURE_….md` L109 | «l'utente ha richiesto rimozione del suffisso» | copy-discipline |
| B3-D12 | 31-01-26 | PRODOTTO | Abbattitore: niente rilevamento temperatura | INCERTO | INCERTO | `…/31-01-2026/REPORT_ABBATTITORE_E_UI_….md` L3-4 | «non richiedere né assegnare… Rilevamento temperatura» | product-type-rules |
| B3-D13 | 31-01-26 | COMPLIANCE | Tolleranza temperatura unica ±1,0°C | INCERTO | INCERTO | `…/31-01-2026/REPORT_SESSIONE_COMPLETA_….md` L11-12 | «Unificare… ±1.0°C dal setpoint» | temp-tolerance |
| B3-D14 | 31-01-26 | SICUREZZA | Rimuovere token da history git (mcp.json) | AGENTE | CORRETTIVA | stesso §8 L175-185 | «Push bloccato da GitHub… Personal Access Token» | secret-hygiene |
| B3-D15 | 04-02-26 | UI-UX | Rimuovere header «Calendario Aziendale» + Nuovo Evento | MATTEO | ORIGINATA | `…/04-02-2026/REPORT_CALENDARIO_UI_….md` L15 | «Richiesta di rimozione dell'elemento DOM» | calendar-chrome |
| B3-D16 | 04-02-26 | FLUSSO | Pulsante «Ancora da Completare» solo chi ha fatto o admin | MATTEO | ORIGINATA | `…/04-02-2026/REPORT_SESSIONE_CALENDARIO_MACRO_….md` L103 | «con vincolo: solo chi ha completato o un admin» | uncomplete-acl |
| B3-D17 | 05-02-26 | UI-UX | Togliere filtri calendario «Per Stato» | INCERTO | INCERTO | `…/05-02-2026/REPORT_RIMOZIONE_FILTRI_STATO.md` L11-17 | «Riduzione della complessità dell'UI» (motivo, non chi) | filter-simplify |
| B3-D18 | 05-02-26 | IMPOSTAZIONI | Filtro «Per Reparto» solo admin | INCERTO | INCERTO | `…/05-02-2026/REPORT_FILTRI_REPARTO_ADMIN.md` L11-17 | «privacy… riservata agli amministratori» | role-gated-filters |
| B3-D19 | 08-02-26 | FLUSSO | Giorni chiusi: nascondi operativi, tieni scadenze personale | INCERTO | INCERTO | `…/08-02-2026/REPORT_FILTRO_GIORNI_CHIUSURA_….md` L51-53 | «NASCONDERE: manutenzioni… MOSTRARE SEMPRE: scadenze HACCP» | closure-day-policy |
| B3-D20 | 22-10-25 | SICUREZZA | Pulsanti dev non in production | INCERTO | INCERTO | `07_COMPONENTS/DEVELOPMENT_BUTTONS.md` L17; L118 | «PULSANTI DA RIMUOVERE IN PRODUCTION» | dev-prod-split |
| B3-D21 | 06-07-26 | PROCESSO | Verità: codice+DB live > doc APP_DEFINITION | CONGIUNTA | APPROVATA | `STATO_FASE3_INDICE.md` L5; `README.md` banner | «codice + DB live > Fase 3 > APP_DEFINITION» | doc-vs-live |
| B3-D22 | 06-07-26 | PROCESSO | Fonte decisioni owner beta fuori da questo perimetro | INCERTO | INCERTO | `STATO_FASE3_INDICE.md` L3 | rimanda a `DECISIONI_OWNER_BETA` (linea B1) | decision-log-pointer |

**Totale decisioni catalogate: 22** (regime rastrello: escluse decine di fix tecnici senza traccia di scelta Owner).

### Rifiuti / correzioni di prodotto (da §1)

| # | Cosa | Data | Fonte |
|---|------|------|-------|
| R1 | Pannello anomalie + «punti da rilevare» nella tab Stato Corrente | 31-01-26 | miglioramenti_ui_temperature |
| R2 | Suffisso ripetuto «contatta assistenza tecnica» nelle azioni correttive | 31-01-26 | REPORT_FIX_BUG_UI_TEMPERATURE |
| R3 | Header calendario con titolo + «Nuovo Evento» | 04-02-26 | REPORT_CALENDARIO_UI |
| R4 | Filtri «Per Stato» in UI calendario | 05-02-26 | REPORT_RIMOZIONE_FILTRI_STATO (chi INCERTO) |

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| B3-A01 | M→A | DIRETTA | Conferma: weekend calendario ancora «unito» dopo fix | accettata | `…/11-02-2026/REPORT_BUG_CALENDARIO_WEEKEND_….md` L105 |
| B3-A02 | M→A | DIRETTA | 13-02: bug ancora visibile; forza nuova diagnosi CSS | accettata | `…/12-02-2026/REPORT_BUG_WEEKEND_…APPROFONDITA….md` L273 |
| B3-A03 | A→M | DEDOTTA | Fix CSS «fatti» ma non caricati (Vite) → utente vede ancora il bug | accettata | `…/15-02-2026/REPORT_RISOLUZIONE_BUG_WEEKEND_….md` L11-38 |
| B3-A04 | M→A | DIRETTA | Richiede semplificazione UI temperature (solo card) | accettata | miglioramenti_ui_temperature L42 |
| B3-A05 | M→A | DIRETTA | Corregge copy azioni correttive (via suffisso) | accettata | REPORT_FIX_BUG_UI_TEMPERATURE L109 |
| B3-A06 | M→A | DIRETTA | Richiede uncomplete mansione con ACL | accettata | REPORT_SESSIONE_CALENDARIO_MACRO L103 |
| B3-A07 | A→M | DEDOTTA | GitHub secret scanning blocca push (token in mcp.json) | accettata | REPORT_SESSIONE_COMPLETA §8 |
| B3-A08 | M↔M | DEDOTTA | CollapsibleCard: rimossa poi ripristinata «come richiesto» | parziale | REPORT_CALENDARIO_UI L43 |

**Totale agency: 8** (M→A 5 · A→M 2 · M↔M 1)

---

## Sezione 3 — Skill signals

| Etichetta | Livello | Prova breve | Contro-evidenza |
|-----------|---------|-------------|-----------------|
| owner-interview | L2 | Metodo README + prompt Agente 9 (Owner descrive, agente scrive) | Nessuna chat Owner verbatim in questo perimetro (solo report) |
| plain-language | L2 | Vincolo «no technical background» nel prompt documentazione | Molti report B3 restano gergo-tecnico verso altri agenti |
| ui-simplify | L2–L3 | Richieste utente: via pannello anomalie; via header calendario; via filtri stato | CE2: componente TemperatureAlertsPanel lasciato morto nel repo |
| ops-priority-ui | L2 | Ordinamento card per tipo (frigo→freezer→blast→ambiente) | — cercata, non trovata in questo perimetro |
| copy-discipline | L3 | Correzione utente su testi azioni correttive | Iterazione: prima aggiunto suffisso, poi rimosso |
| product-type-rules | L1 | Abbattitore senza rilevamento temperatura (report obiettivo) | Chi ha deciso: INCERTO in questo perimetro |
| haccp-category-filter | L1 | Filtro categorie compatibili documentato come conformità | Autore della regola non nominato |
| closure-day-policy | L1 | Regola business giorni chiusi (operativi vs personale) | Chi INCERTO; fix timezone era bug tecnico agente |
| uncomplete-acl | L2 | Richiesta esplicita ACL su «Ancora da Completare» | — |
| secret-hygiene | L1 | Token rimosso da history dopo blocco GitHub | CE1: il token era stato committato |
| doc-vs-live | L2 | Banner Fase 3: codice+DB > APP_DEFINITION | Struttura cartelle ideale incompleta (README banner) |
| systematic-debug | L1 | Skill systematic-debugging citata sul bug weekend | CE3: più cicli prima del fix vero (15-02) |

**Regola L3/L4:** nessuna skill portata a L4 in questo perimetro (nessuna regola riusabile nata qui e citata come skill CB-v2). L3 `copy-discipline` e `ui-simplify` hanno contro-evidenza in §4.

---

## Sezione 4 — Contro-evidenze

| ID | Cosa | Perché conta | Fonte |
|----|------|--------------|-------|
| CE1 | Personal Access Token finito in git history | Fallimento sicurezza operativo; riparato solo dopo blocco GitHub | REPORT_SESSIONE_COMPLETA §8 |
| CE2 | TemperatureAlertsPanel rimosso dalla UI ma file lasciato | Cleanup incompleto dopo scelta utente | miglioramenti_ui_temperature L75 |
| CE3 | Bug weekend «unito»: utente smentisce due volte i fix | Collaudo Owner più forte dell'auto-dichiarazione agente; causa vera = CSS non caricato | report 11-02, 12-02, 15-02 |
| CE4 | Fix timezone `toISOString` su giorni chiusura | Bug agente su data locale IT; eventi apparivano nei giorni chiusi | REPORT_FILTRO_GIORNI_CHIUSURA §1B |
| CE5 | Densità «Matteo» quasi zero | Occorrenze «Matteo» = nome test / URL GitHub, non decisioni | scan perimetro; ASSOCIAZIONE_NOME…; ALLINEAMENTO_REPO |
| CE6 | Molte decisioni prodotto (abbattitore, bibite, ±1°C, filtri) senza «chi» | Regime rastrello: senza citazione Owner → INCERTO; rischio di gonfiare agency | §1 righe INCERTO |

*Cercate attivamente contro-evidenze su L3 (`copy-discipline`, `ui-simplify`): trovate CE2–CE3. Su altre skill L2: CE1, CE4, CE5.*

---

## Sezione 5 — Copertura dichiarata

| Metrica | Valore |
|---------|--------|
| File nel perimetro | **69** (contati: `Get-ChildItem` + `Sort-Object` + `Skip 69` su `app-definition/**/*.md`) |
| File aperti | **69** (100%) — ogni path passato da scan keyword + lettura selettiva high-signal |
| File illeggibili / saltati | **0** |
| Regime | rastrello: estratte solo decisioni Owner/prodotto/compliance/correzioni; resto dichiarato non riassunto |
| Taglio | Primo: `…\SOLUZIONE_ERRORE_EXPORT.md` · Ultimo: `STATO_FASE3_INDICE.md` · B2 chiude su `REVISIONE_LAVORO_AGENTI.md` |

### Inventario per sottocartella (B3)

| Zona | File | Densità segnale Matteo/Owner |
|------|------|------------------------------|
| `03_CONSERVATION/Lavoro/…` 15→31-01 | 43 | Media: richieste utente su UI temperature/copy; molto HACCP tecnico |
| `03_CONSERVATION/SCHEDULED_MAINTENANCE_SECTION.md` | 1 | Specifica agente (obblighi manutenzione) |
| `04_CALENDAR/` (conoscenze + Lavoro) | 21 | Media-alta su UI calendario, ACL, giorni chiusura, bug weekend |
| `07_COMPONENTS/DEVELOPMENT_BUTTONS.md` | 1 | Specifica sicurezza dev/prod |
| Root `README`, `AGENT_PROMPT…`, `STATO_FASE3…` | 3 | Alta sul metodo Owner |

---

## Sezione 6 — Lacune e handoff

| Lacuna | Serve a |
|--------|---------|
| Decisioni Owner beta citate ma **fuori perimetro** (`META/…/DECISIONI_OWNER_BETA.md`) | **B1** (meta BHM) |
| Parole verbatim di Matteo su Conservazione/Calendario BHM | **H5** (transcript BHM-Zen / BHM-v2) |
| Prima metà app-definition (Auth, Conservation conoscenze, Lavoro fino a REVISIONE) | **B2** (non duplicare) |
| Chi ha deciso abbattitore / bibite / ±1°C / filtri stato-reparto | H5 o B1; qui restano INCERTO |
| Validazione che «utente» = Matteo (non tester) | H5 / confronto con DECISIONI_OWNER_BETA |
| Fatti oggettivi (commit `0ad1e0da`, filter-repo, branch `NoClerk`) | **J1** se si vuole peso 2 |

---

## Sezione 7 — Chiusura verso Matteo

In questa metà della documentazione BHM vedi soprattutto agenti che scrivono specifiche: le tue scelte appaiono quando «l'utente ha richiesto» qualcosa sullo schermo — togliere il pannello anomalie dalle temperature, riordinare le card, tagliare testi lunghi, togliere la barra del calendario, poter annullare un completamento solo se sei tu o admin.

Il pezzo forte della collaudo è il calendario weekend «unito»: hai detto più volte che non era risolto, e avevi ragione — i fix non arrivavano davvero al browser.

Manca ancora la prova diretta delle tue parole (chat) e il diario decisioni Owner in meta: lì si capisce meglio chi ha scelto regole tipo abbattitore senza temperatura o il profilo bibite.
)