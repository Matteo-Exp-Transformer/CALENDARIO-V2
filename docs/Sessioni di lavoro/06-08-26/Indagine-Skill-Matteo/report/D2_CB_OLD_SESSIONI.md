# D2 — CalendarBackup vecchia: Lavoro + Sessioni

> **Ondata:** D2 · **Data:** 06-08-26 · **Regime:** SCAVO · **Peso fonti:** 3 (report/plan/prompt; non transcript)
> **Perimetro:** `docs/Archives/Calendarbackup-oldversion/{Lavoro/ (26), Sessioni di lavoro/ (20)}` = **46 md**
> **Focus:** come conduceva le sessioni allora; cosa chiedeva; quanto controllava. Confronto con A1 (23-05).
> **Attribuzione:** quasi nessuna `M-VOCE` lunga. Segnali = «Richiesta utente», «ok ora funziona», «su richiesta», «vincoli utente», requisiti in fix, prompt chiusi (**M-REGIA**). Path relativi a `Calendarbackup-oldversion/`.
> **Sensibilità:** password QA, email account, chiavi — **non** citate; solo path + sintesi.

---

## Sezione 1 — Decisioni

### A — Sessioni feb–mar + pack db-allineamento (20 file)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| D2-D01 | 24-02-26 | AI-METODO | Verifica visiva obbligatoria prima di «completo» | AGENTE | ORIGINATA | `Sessioni di lavoro/24-02-2026/SKILL.md` §Verification | «prima di dichiarare le modifiche completate, controverificare con lo schermo» | verify-before-done |
| D2-D02 | 24-02-26 | UI-UX | Refactor NavItem → Tailwind puro priorità P0 | AGENTE | ORIGINATA | `…/24-02-2026/commercial-patterns.md` §6 | «NavItem → pure Tailwind … Priority **P0**» | dashboard-layout |
| D2-D03 | 24-02-26 | TESTING | Login automatico agente via Playwright + screenshot | AGENTE | ORIGINATA | `…/24-02-2026/ADMIN-LOGIN.md` §Login automatico | «Per far loggare l’agente in autonomia» | agent-self-verify |
| D2-D04 | 14-03-26 | PRODOTTO | Eliminare modulo Calendar morto (BHM) | INCERTO | DELEGATA | `…/14-03-2026/report-pulizia-produzione.md` §1 | «Eliminati 36 file… `src/features/calendar/`» | cleanup-prod |
| D2-D05 | 14-03-26 | SICUREZZA | Login admin solo se email in `admin_users` | AGENTE | CORRETTIVA | stesso §10 | «Prima **qualsiasi** utente Supabase Auth poteva accedere come admin» | auth-gate |
| D2-D06 | 14-03-26 | PRODOTTO | Piano Fase 2 multi-tenant (org + tenant_id + RLS) | INCERTO | APPROVATA | `…/14-03-2026/plan-fase2-multi-tenant.md` intro | «Prevede: tabella `organizations`, `tenant_id`» | multi-tenant |
| D2-D07 | 14-03-26 | FLUSSO | Route pubblica `/prenota/:tenantSlug` | AGENTE | SCELTA | stesso §2.9 | «'/prenota/:tenantSlug' -> BookingRequestPage» | slug-routing |
| D2-D08 | 14-03-26 | SICUREZZA | Insert pubblico via Edge Function non client | AGENTE | SCELTA | stesso §2.5 | «Sostituire l'INSERT diretto … con una chiamata all'Edge Function» | edge-insert |
| D2-D09 | 15-03-26 | SICUREZZA | Login: lookup admin via client anon (RLS chicken-egg) | AGENTE | CORRETTIVA | `…/15-03-2026/report-sessione-multi-tenant.md` §2.3 | «usare `supabasePublic` … per il lookup iniziale» | login-rls-fix |
| D2-D10 | 16-03-26 | SICUREZZA | DEFAULT `tenant_id` per retrocompat frontend | AGENTE | CORRETTIVA | `…/16-03-2026/plan-integrazione-multi-tenant.md` Fix 1.1 | «INSERT senza tenant_id → Al Ritrovo» | migration-safe |
| D2-D11 | 16-03-26 | SICUREZZA | Sostituire policy anon admin con RPC | AGENTE | CORRETTIVA | stesso Fix 1.2 | «La policy attuale permette a chiunque … di leggere TUTTI gli admin_users» | rpc-admin-lookup |
| D2-D12 | 18-03-26 | PRODOTTO | Capienza non deve mai bloccare accept/create/edit | MATTEO | ORIGINATA | `…/18-03-2026/fix-overbooking-non-bloccante.md` §Requisito | «non deve MAI bloccare l'inserimento/accettazione/modifica» | overbooking-warn |
| D2-D13 | 18-03-26 | UI-UX | Su accept: modal warning + «Procedi Comunque» | AGENTE | SCELTA | stesso §1 | «MOSTRA MODAL» | capacity-modal |
| D2-D14 | 18-03-26 | PROCESSO | DB TEST clone dati app, zero rischio PROD | MATTEO | ORIGINATA | `…/18-03-2026/report-clone-db-test-multi-tenant.md` §Obiettivo | «testare il multi-tenant in sicurezza, senza toccare produzione» | test-db-clone |
| D2-D15 | 18-03-26 | PROCESSO | Dump/restore solo schema `public` | AGENTE | CORRETTIVA | stesso §2.5 | «dump **limitato a `public`**» | public-only-restore |
| D2-D16 | 20-03-26 | AI-METODO | Piano multi-tenant «approvato» poi implementato | INCERTO | APPROVATA | `…/20-03-2026/report-sessione-multi-tenant-implementazione.md` §Riferimenti | «Piano approvato: `.claude/plans/…`» | plan-then-build |
| D2-D17 | 20-03-26 | TESTING | Suite Playwright multi-tenant (11 test) | AGENTE | ORIGINATA | stesso FASE 5 | «11 test in 6 gruppi» | e2e-mt |
| D2-D18 | 22-03-26 | PROCESSO | PROD: sola lettura salvo OK esplicito utente | MATTEO | ORIGINATA | `…/db-allineamento/README.md` §Regole operative | «salvo **autorizzazione esplicita** dell’utente per modifiche» | prod-gate |
| D2-D19 | 22-03-26 | PROCESSO | 037+ solo su TEST fino a validazione | MATTEO | ORIGINATA | stesso; TRACKER §Decisioni | «finché non è tutto validato, **non** allineare production» | test-first |
| D2-D20 | 22-03-26 | TESTING | Non dichiarare allineamento senza snapshot TEST | AGENTE | ORIGINATA | `…/22-03-2026/report-db-allineamento-prod-vs-test.md` §3 | «**Non possiamo ancora dichiarare allineamento** senza snapshot test» | schema-parity |
| D2-D21 | 22-03-26 | AI-METODO | Pack procedura inizio sessione (Claude/Cursor/MCP) | CONGIUNTA | DELEGATA | `…/db-allineamento/PROCEDURA-INIZIO-SESSIONE.md` intro | «avviare una sessione … con agenti perfettamente informati» | session-bootstrap |

### B — Lavoro/Sessioni maggio precoce (19 file)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| D2-D22 | ?-04-26 | UI-UX | Palette admin da warm-wood a blu/indaco | INCERTO | ORIGINATA | `Lavoro/Sessioni di lavoro/02-05-26/REPORT.md` §Tema UI | «sostituito con una palette professionale Blu/Indaco» | early-ui-theme |
| D2-D23 | 02-05-26 | UI-UX | Riferimento Dribbble Restaurant Admin Dashboard | MATTEO | SCELTA | `…/02-05-26/UI_REDESIGN_BRIEF.md` §Riferimento | «allineato al riferimento scelto» | visual-reference |
| D2-D24 | 02-05-26 | UI-UX | Solo layer visivo; no cambio flussi core | MATTEO | ORIGINATA | stesso §Vincolo fondamentale | «Non cambiare logica o flussi core dell'applicazione» | ui-without-logic-change |
| D2-D25 | 02-05-26 | UI-UX | Mood moderno caldo, non freddo | MATTEO | SCELTA | stesso §1 Colori Nota | «mood deve rimanere moderno, luminoso e non freddo» | warm-admin-mood |
| D2-D26 | 04-05-26 | SICUREZZA | RLS da GUC a sub-query `admin_users`+JWT | CONGIUNTA | APPROVATA | `…/04-05-26/TASK_fix_rls_admin_users.md` §Decisioni | «Sub-query su `admin_users` via `auth.jwt()->>'email'`» | rls-jwt-tenant |
| D2-D27 | 04-05-26 | SICUREZZA | Eliminare GUC e RPC `set_tenant` | CONGIUNTA | APPROVATA | stesso | «GUC `app.current_tenant_id` **Eliminata**» | rls-no-guc |
| D2-D28 | 04-05-26 | SICUREZZA | Chiudere anon insert booking/email_logs | CONGIUNTA | APPROVATA | stesso; `PROMPT_per_agente.md` | «Anon insert… **Chiusi** — pubblico passa solo via Edge» | public-write-via-edge |
| D2-D29 | 04-05-26 | SICUREZZA | Un solo ambiente Supabase; niente staging | MATTEO | SCELTA | `…/04-05-26/Plan.md` §Risposte allineamento #1 | «Niente staging. La migrazione è reversibile» | env-single-prod |
| D2-D30 | 04-05-26 | PRODOTTO | Un admin = un solo tenant (`LIMIT 1`) | MATTEO | SCELTA | stesso §Risposte #3 | «scelta esplicita… **un admin → un solo tenant**» | admin-single-tenant |
| D2-D31 | 04-05-26 | AI-METODO | Prompt chiuso: agente non ridiscute scelte | MATTEO | ORIGINATA | `…/04-05-26/PROMPT_per_agente.md` header + Note Matteo | «decisioni chiuse… non deve più ridiscutere le scelte» | closed-decision-prompt |
| D2-D32 | 04-05-26 | PROCESSO | Push diretto su `main` senza PR | AGENTE | CORRETTIVA | `…/04-05-26/REPORT_ESECUZIONE_PLAN_RLS.md` §Deviazioni | «PR non aperta… pubblicare direttamente su `main`» | process-deviation |
| D2-D33 | 04-05-26 | TESTING | Password QA deboli uguali per utenti test | MATTEO | ORIGINATA | `…/04-05-26/REPORT_AGENTE_post_RLS_test_e_fix.md` §4 | «Richiesta utente: password … per tutti» | qa-credentials |
| D2-D34 | 04-05-26 | SICUREZZA | Trigger `tenant_usage` → SECURITY DEFINER | AGENTE | ORIGINATA | stesso §7.3 | «Entrambe le funzioni… **SECURITY DEFINER**» | trigger-security-definer |
| D2-D35 | 04-05-26 | TESTING | Suite 2 browser lasciata a QA umana | CONGIUNTA | DELEGATA | stesso §9; §18.1 | «Non eseguita… richiede browser locale» | human-e2e-suite |
| D2-D36 | 04-05-26 | FLUSSO | Fix `client_email` null su update booking | AGENTE | CORRETTIVA | stesso §18.1–18.2 | «ok ora funziona» — modifica prenotazione riuscita | schema-null-discipline |
| D2-D37 | 04-05-26 | TESTING | Isolamento tenant B verificato a mano | MATTEO | ORIGINATA | stesso §18.1 | «si vedono **solo** le prenotazioni del tenant B» | manual-rls-proof |
| D2-D38 | 07-05-26 | FLUSSO | Form pubblico: default `tavolo` + select tipologia | AGENTE | CORRETTIVA | stesso §21.2 | «Default **`booking_type: 'tavolo'`**» | booking-type-ux |
| D2-D39 | 07-05-26 | SICUREZZA | `create-booking` senza verify JWT gateway | AGENTE | CORRETTIVA | stesso §21.2 | «`verify_jwt = false`… autorizzazione… slug + rate limit» | edge-anon-invoke |
| D2-D40 | 07-05-26 | IMPOSTAZIONI | Email send opt-in via env (default off) | AGENTE | ORIGINATA | stesso §21.7 | «Ora è **opt-in** con **`VITE_ENABLE_SEND_EMAIL=true`**» | email-opt-in |
| D2-D41 | 04-05-26 | PRODOTTO | Tab admin Menu standalone (non sotto Settings) | MATTEO | APPROVATA | `…/04-05-26/REPORT_UI_menu_admin_S2.10.md` §3 | «decisione già chiusa… tab **`menu` standalone**» | menu-nav-placement |
| D2-D42 | 04-05-26 | UI-UX | Nessun deep-link tab in questa iterazione | MATTEO | APPROVATA | stesso §3 | «**nessun deep-link** in questa iterazione» | defer-deeplink |
| D2-D43 | 04-05-26 | UI-UX | Validazione toast; delete con `confirm` nativa | MATTEO | APPROVATA | stesso §3 | «toast… delete con **`confirm` nativa**» | feedback-patterns |
| D2-D44 | 04-05-26 | IMPOSTAZIONI | Due nav: sistema vs impostazioni locale | MATTEO | APPROVATA | `…/REPORT_UI_impostazioni_ristorante_admin.md` §2 | «Due nav: sistema vs locale» | settings-split |
| D2-D45 | 04-05-26 | IMPOSTAZIONI | Chiavi v1: nome, timezone, window, hours | MATTEO | APPROVATA | stesso §2 | «Chiavi editabili v1… `business_hours`» | settings-v1-keys |
| D2-D46 | 04-05-26 | IMPOSTAZIONI | Nessuna delete settings in UI | MATTEO | APPROVATA | stesso §2 | «Nessuna delete in UI» | no-settings-delete-ui |
| D2-D47 | 04-05-26 | UI-UX | Gradiente warm su StatCard/header/calendario | INCERTO | SCELTA | `…/Modifiche UI estetiche/REPORT_modifiche_UI_estetiche.md` §1 | «area admin più **calda e leggibile**» | warm-gradient-admin |
| D2-D48 | 05-05-26 | UI-UX | Fasce orario calendario chiuse di default | INCERTO | SCELTA | `…/05-05-26/REPORT_sessione_UI_admin_dashboard_e_fix_input.md` §2 | «`defaultExpanded` impostato a `false`» | collapse-default-closed |
| D2-D49 | 05-05-26 | UI-UX | Annullare layout logout non desiderati | MATTEO | CORRETTIVA | stesso §5 / Modifiche annullate | «su richiesta sono stati annullati i tentativi non desiderati» | live-ux-veto |
| D2-D50 | 05-05-26 | VENDITA | SaaS canone + revoca senza cancellare dati | MATTEO | ORIGINATA | `…/05-05-26/Plan-Eseguibile-pwa.md` Contesto | «venderla come SaaS… revocare istantaneamente l'accesso» | saas-gating-intent |
| D2-D51 | 05-05-26 | PRODOTTO | Approccio installabile = PWA | CONGIUNTA | SCELTA | stesso «Approccio scelto» | «Approccio scelto: PWA (Progressive Web App)» | pwa-over-native |
| D2-D52 | 05-05-26 | SICUREZZA | Gate `organizations.is_active` a login/refresh | CONGIUNTA | APPROVATA | stesso §4; REPORT_attivazione §3 | «check `organizations.is_active`… signOut» | subscription-gate |
| D2-D53 | 05-05-26 | FLUSSO | Blocco `/prenota` se tenant inattivo | CONGIUNTA | APPROVATA | stesso §5; CHECKLIST F2 | «Prenotazioni temporaneamente non disponibili» | public-inactive-block |
| D2-D54 | 05-05-26 | UI-UX | Fallback unico slug assente ≈ tenant moroso | MATTEO | APPROVATA | CHECKLIST F3; REPORT_esecuzione §F3 | «Limite noto, accettabile per il caso d'uso» | indistinct-public-fallback |
| D2-D55 | 05-05-26 | TESTING | Non «pronto per primo cliente»; servono fix | CONGIUNTA | SCELTA | CHECKLIST §Esito | «Servono fix prima del lancio» | go-live-honesty |
| D2-D56 | 05-05-26 | IMPOSTAZIONI | Attivare tutti i tenant `is_active=true` | MATTEO | ORIGINATA | REPORT_attivazione_tenant §1 | «Obiettivo richiesto… Impostare come attivi» | tenant-activation |
| D2-D57 | 05-05-26 | FLUSSO | Restore archivio solo con orari confermati | AGENTE | CORRETTIVA | REPORT_fix_calendario_… §C | «Impossibile reinserire: mancano orario…» | restore-requires-times |
| D2-D58 | 05-05-26 | UI-UX | TimePicker 24h nel form admin prenotazioni | INCERTO | SCELTA | REPORT_sessione_booking_… §1–2 | «scelta orario in **24 ore**» | timepicker-24h |
| D2-D59 | 04-05-26 | TESTING | Tre suite parallele post-RLS | AGENTE | ORIGINATA | `TEST_PLAN_post_RLS.md` header | «Tre suite, eseguibili in parallelo da agenti distinti» | parallel-test-suites |
| D2-D60 | 04-05-26 | PROCESSO | Piano → implementazione solo dopo approvazione | MATTEO | APPROVATA | REPORT_UI_menu §1; PLAN footnote | «*Piano approvato; implementazione…*» | plan-then-build |

### C — Knowledge Base (7 file)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| D2-D61 | 07-05-26 | TESTING | Checklist Suite2 percorso admin+form | CONGIUNTA | ORIGINATA | `Lavoro/Knowledge Base/CHECKLIST_Suite2_browser_semplice.md` L1–13 | «Tutto il percorso admin e il form cliente» | test-strategy |
| D2-D62 | 07-05-26 | TESTING | Isolamento tenant A vs B in UI | MATTEO | SCELTA | stesso Extra A | «Admin B vede solo dati tenant B» | multi-tenant-qa |
| D2-D63 | 07-05-26 | PRODOTTO | Elimina ≠ annulla su calendario | CONGIUNTA | CORRETTIVA | stesso S2.7 | «non “annullamento” (termine fuorviante)» | product-language |
| D2-D64 | 07-05-26 | AI-METODO | S2.9/S2.10 → prompt piano, non SQL | MATTEO | ORIGINATA | stesso L41–42 | «incolla … PROMPT_plan_UI_…» | agent-orchestration |
| D2-D65 | ?-04-26 | FORMAZIONE | Guida setup locale zero prerequisiti | AGENTE | DELEGATA | `…/Guida.md` L1–3 | «chi non ha mai usato un terminale» | onboarding-docs |
| D2-D66 | ? | UI-UX | Scope v1 settings: solo 4 setting_key | INCERTO | ORIGINATA | `PROMPT_plan_UI_impostazioni_ristorante.md` (M-REGIA) | «Niente … senza un consumer reale» | product-scoping |
| D2-D67 | ? | PRODOTTO | Etichetta UI «Menu» non ingredienti | INCERTO | CORRETTIVA | `PROMPT_plan_UI_menu_ingredienti_admin.md` (M-REGIA) | «Non esistono: … Solo rinaming» | product-language |
| D2-D68 | ? | UI-UX | Gradienti: inline se from-* assenti in build | AGENTE | ORIGINATA | `Skills/ui-card-aesthetics/SKILL.md` | «fermate … possono non comparire» | ui-aesthetics |
| D2-D69 | ? | TESTING | Tre account: A, B, outsider RLS | CONGIUNTA | ORIGINATA | `Utenti per test.md` (struttura; no credenziali) | file account test A/B/outsider | multi-tenant-qa |
| D2-D70 | ? | SICUREZZA | Password deboli solo test; togliere pre go-live | MATTEO | ORIGINATA | `Utenti per test.md` | «Prima del go-live rimuovere» | env-safety |
| D2-D71 | ? | PROCESSO | Seed prenotazioni via npm script | INCERTO | DELEGATA | `script e comandi/script-per-inserire-prenotazioni….md` | «npm run seed:booking-table» | seed-ops |

> **Nota M-REGIA:** `PROMPT_per_agente.md` e i due `PROMPT_plan_UI_*` sono prompt preparati da incollare (decisioni già chiuse). Contano come **direzione**, non prosa lunga. Le «Risposte alle domande di allineamento» in `Plan.md` 04-05 sono la fonte più vicina alle scelte owner su RLS/ambiente. Nessuna citazione è dialogo raw di transcript (peso 1 = linea H).

**Totale decisioni catalogate: 71**

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| D2-A01 | M→A | DEDOTTA | Capienza: solo avviso, mai blocco | accettata | `fix-overbooking-non-bloccante.md` |
| D2-A02 | M→A | DEDOTTA | DB TEST clone, zero rischio PROD | accettata | `report-clone-db-test-multi-tenant.md` |
| D2-A03 | M→A | DIRETTA | PROD no DDL/DML senza OK esplicito | accettata | `db-allineamento/README.md` |
| D2-A04 | M→A | DEDOTTA | Multi-tenant: testare su TEST prima | accettata | report 20-03 + archive 22-03 |
| D2-A05 | A→M | DIRETTA | Chiede conferma se MCP ref è prod o test | accettata | `report-db-allineamento-prod-vs-test.md` |
| D2-A06 | A→M | DEDOTTA | Consegna prossimi passi manuali (env/migrazioni) | accettata | report 20-03 §Prossimi passi |
| D2-A07 | M→A | DIRETTA | Conferma fix modifica prenotazione | accettata | REPORT_AGENTE §18.1 «ok ora funziona» |
| D2-A08 | M→A | DIRETTA | Impone password QA uniforme (sintesi) | accettata | stesso §4 «Richiesta utente» |
| D2-A09 | M→A | DIRETTA | Veto layout logout intermedi | accettata | REPORT_sessione_UI «su richiesta… annullati» |
| D2-A10 | M→A | DIRETTA | QA cross-tenant: solo dati B | accettata | REPORT_AGENTE §18.1 |
| D2-A11 | M→A | DIRETTA | Segnala bug `client_email` null | accettata | stesso §18.1 |
| D2-A12 | M→A | DIRETTA | Chiede attivazione tenant `is_active` | accettata | REPORT_attivazione §1 |
| D2-A13 | M→A | DEDOTTA | Chiude decisioni RLS prima dell’esecuzione | accettata | PROMPT_per_agente + TASK |
| D2-A14 | A→M | DIRETTA | Blocker RLS su `tenant_usage` | accettata | REPORT_AGENTE §7 |
| D2-A15 | A→M | DIRETTA | SettingsTab orfano / menu irraggiungibile | accettata | PLAN_UI_menu §1 |
| D2-A16 | A→M | DIRETTA | «Prenotazioni scomparse» ancora in DB | accettata | REPORT_fix_calendario |
| D2-A17 | A→M | DIRETTA | Toast login inattivo non catturato | parziale | CHECKLIST D2 |
| D2-A18 | A→M | DIRETTA | Deviazione: no PR, push su `main` | accettata | REPORT_ESECUZIONE §Deviazioni |
| D2-A19 | M↔M | DEDOTTA | Tema blu (REPORT) → brief warm Dribbble | ignota | REPORT.md vs UI_REDESIGN_BRIEF |
| D2-A20 | M↔M | DEDOTTA | Mar TEST-first → mag «niente staging» su PROD | parziale | README db-allineamento vs Plan.md #1 |
| D2-A21 | M→A | DEDOTTA | Accetta limite fallback pubblico F3 | accettata | CHECKLIST F3 |
| D2-A22 | A→M | DIRETTA | Agente spiega: eliminazione ≠ annullamento | accettata | CHECKLIST Suite2 S2.7 |
| D2-A23 | M→A | DEDOTTA | Prompt menu/impostazioni: «Decisioni chiuse» | ignota | PROMPT_plan_UI_* KB |

**Totale agency: 23** (M→A 13 · A→M 8 · M↔M 2)

---

## Sezione 3 — Skill signals

| Etichetta | Livello | Prova breve | Contro-evidenza |
|-----------|---------|-------------|-----------------|
| `closed-decision-prompt` / M-REGIA | **L3** | D31, A13; PROMPT+TASK | A18: agente deroga PR→main |
| `manual-rls-proof` / QA umana | **L3** | D37, A10–A11; Checklist Suite2 | Suite 2 incompleta; go-live bloccato (D55) |
| `live-ux-veto` | **L3** | D49, A09 | Trial-and-error logout (C09) |
| `prod-gate` / `test-first` | **L2–L3** | D18–D19 (mar) | **Ribaltato** a mag: D29 env unico (A20) |
| `overbooking-warn` | **L2** | D12 ORIGINATA | — (in perimetro) |
| `rls-jwt-tenant` | **L2** | D26–D28 SCELTA/APPROVATA | Login chicken-egg poi RPC (D09→D11) |
| `saas-gating` + `pwa-over-native` | **L2** | D50–D53 | Gate solo app, no RLS `is_active` (C06); A1: PWA assente |
| `plan-then-build` | **L2** | D16, D60, D41–D46 | SettingsTab orfano scoperto tardi |
| `session-bootstrap` / db-pack | **L3–L4** | Pack README+GUIDA+TRACKER+PROCEDURA | Doc drift 040 vs RPC; densità Matteo media |
| `dashboard-layout-system` | **L2** (autoria agente) | SKILL 24-02 | Nessuna prova M-VOCE su creazione |
| `agent-orchestration` | **L2** | D64 checklist → PROMPT_plan | PROMPT scritti da agente (M-REGIA) |
| `go-live-honesty` | **L2** | D55 | Intent SaaS già presente ma non pronto |
| `env-safety` | **L1–L2** + falla | D70 go-live warning | Account test su ref PROD (C12); password deboli (D33) |

**Conduzione (sintesi):** Matteo **owner di vincoli** (PROD gate a marzo; RLS/ambiente/admin=tenant a maggio) e di **pochi requisiti prodotto** (overbooking, SaaS/PWA, Menu/Settings). **Chiude decisioni prima** (M-REGIA), **delega** codice/SQL/API, **tiene** QA browser + veto UI. Non risulta scrivere codice.

### Confronto diretto con A1 (23-05) — stessa app, mesi dopo

| Dimensione | D2 (CB-old feb→05-05) | A1 (23→26-05 CB-v2) |
|------------|------------------------|---------------------|
| Forma report | Plan/TASK/PROMPT/checklist; **no** Q1 formale | Report con **Domande di chiusura** + citazioni più dense |
| Ambiente DB | Mar: TEST-first; Mag: **niente staging** su PROD | Audit PROD + migrazioni **TEST** esplicite |
| Prodotto pubblico | `/prenota/:slug` base; form tavolo | **Prenota v2** + Personalizza Form + XOR card/carosello |
| Menu | Tab admin Menu standalone (nascita UI) | Magazzino vs vetrina + **Menu QR** fase 1 |
| PWA / gating SaaS | **Presente** (05-05) | **Assente** nel periodo A1 |
| Controllo | Decisioni chiuse + QA manuale | Stesso pattern + correzioni UI iterative più numerose |
| Skill system | Skill UI isolate + pack db | DATA_FLOW + Marketing-Skill + regole linguaggio utente |

---

## Sezione 4 — Contro-evidenze

| ID | Cosa | Perché conta | Fonte |
|----|------|--------------|-------|
| D2-C01 | Ambiente unico senza staging su progetto reale (mag) | Scelta esplicita (D29) indebolisce safety net; tensiona con TEST-first di marzo e con CB-v2 | `Plan.md` §Risposte #1 |
| D2-C02 | Password QA deboli su richiesta | Shortcut sicurezza accettato | REPORT_AGENTE §4 (sintesi; no valore) |
| D2-C03 | PR saltata → push `main` | Processo TASK violato; non risulta ribaltato | REPORT_ESECUZIONE §Deviazioni |
| D2-C04 | Suite 2 incompleta; «servono fix» | Non pronto vendita nonostante SaaS intent | CHECKLIST Esito; D55 |
| D2-C05 | Gate `is_active` solo app, non RLS | Difesa superficiale dichiarata fase 2 | Plan-Eseguibile-pwa Fase 2 |
| D2-C06 | SettingsTab orfano scoperto tardi | Nav prodotto non mappata prima dell’audit | PLAN_UI_menu §1 |
| D2-C07 | Bug `client_email` trovato da QA umana | Agente non aveva coperto update path | REPORT_AGENTE §18 |
| D2-C08 | Percorso logout: prove e annulli | Controllo fine senza brief stabile a priori | REPORT_sessione_UI |
| D2-C09 | Tema blu vs brief warm Dribbble | Possibile cambio rotta non esplicitato | REPORT.md vs UI_REDESIGN_BRIEF |
| D2-C10 | Clone 28 booking (18-03) vs ~159 in archive TEST (22-03) | Narrativa «clone completo» non stabile | report-clone vs archive-db-test §12 |
| D2-C11 | Fix login anon SELECT poi sostituito da RPC | «Funzionante» ≠ «sicuro» | report 15-03 vs plan 16-03 |
| D2-C12 | Account di test legati a progetto PROD | Contradiction a env-safety / split TEST–PROD | `Utenti per test.md` (solo ref; no credenziali) |
| D2-C13 | Titolo file «…ingredienti…» vs decisione «non esistono» | Disallineamento naming regia | nome PROMPT vs corpo |
| D2-C14 | Credenziali in `ADMIN-LOGIN.md` in archivio sessione | Contro igiene processi (file diceva gitignore) | path solo; no valori |

**Motivazione sezioni vuote:** nessuna — contro-evidenze trovate e elencate. Per skill L3 (`closed-decision-prompt`, `manual-rls-proof`, `live-ux-veto`): contro cercate attivamente (C01–C09, C12).

---

## Sezione 5 — Copertura dichiarata

| Metrica | Valore |
|---------|--------|
| File nel perimetro (find `*.md`) | **46** (Lavoro 26 + Sessioni top-level 20) |
| File aperti | **46 / 46 (100%)** |
| File illeggibili | **0** (script seed 74 byte, ASCII leggibile; nome file con encoding path Windows) |
| Saltati | **0** |
| Decisioni estratte | **71** |
| Agency estratte | **23** (M→A 13 · A→M 8 · M↔M 2) |

### Lista file aperti + 1 riga sintesi

#### `Sessioni di lavoro/` (20)

| # | Path | Sintesi |
|---|------|---------|
| 1 | `…/24-02-2026/ADMIN-LOGIN.md` | Login + Playwright per verifica UI (sensibile — no valori) |
| 2 | `…/24-02-2026/SKILL.md` | Skill layout AdminDashboard + gate screenshot |
| 3 | `…/24-02-2026/commercial-patterns.md` | Pattern SaaS + priorità NavItem P0 |
| 4 | `…/14-03-2026/plan-fase2-multi-tenant.md` | Piano multi-tenant 037–041 |
| 5 | `…/14-03-2026/report-pulizia-produzione.md` | Cleanup calendar morto, auth, CSP |
| 6 | `…/15-03-2026/report-sessione-multi-tenant.md` | FE+migrazioni + fix login chicken-egg |
| 7 | `…/15-03-2026/report-esecuzione-plan.md` | Walkthrough step plan eseguiti |
| 8 | `…/16-03-2026/plan-integrazione-multi-tenant.md` | Fix 3 bug + ordine deploy |
| 9 | `…/18-03-2026/fix-overbooking-non-bloccante.md` | Requisito non-blocco capienza |
| 10 | `…/18-03-2026/task-multi-tenant-in-Database-test.md` | Task post-clone |
| 11 | `…/18-03-2026/PlanSemplice-….md` | Sintesi clone + rollout |
| 12 | `…/18-03-2026/report-clone-db-test-multi-tenant.md` | Clone PROD→TEST public-only |
| 13 | `…/20-03-2026/report-sessione-multi-tenant-implementazione.md` | Implementazione branch + E2E; DB pending |
| 14 | `…/22-03-2026/report-db-allineamento-prod-vs-test.md` | Inventario MCP + gap allineamento |
| 15 | `…/22-03-2026/archive-db-test.md` | Snapshot TEST |
| 16 | `…/22-03-2026/archive-db-production.md` | Snapshot PROD sola lettura |
| 17 | `…/db-allineamento/README.md` | Regole PROD gate / TEST sandbox |
| 18 | `…/db-allineamento/PROCEDURA-INIZIO-SESSIONE.md` | Bootstrap Claude/Cursor |
| 19 | `…/db-allineamento/GUIDA-PROCEDURE-DB.md` | Procedure migrazioni/EF/rollback |
| 20 | `…/db-allineamento/TRACKER-allineamento-db.md` | Stato + log 22-03 |

#### `Lavoro/Sessioni di lavoro/` (19)

| # | Path | Sintesi |
|---|------|---------|
| 21 | `…/02-05-26/REPORT.md` | Snapshot v2: tema blu, schema, setup |
| 22 | `…/02-05-26/UI_REDESIGN_BRIEF.md` | Brief Dribbble: solo UI, mood caldo |
| 23 | `…/04-05-26/PROMPT_per_agente.md` | M-REGIA: prompt chiuso RLS |
| 24 | `…/04-05-26/TASK_fix_rls_admin_users.md` | Task decisioni bloccate |
| 25 | `…/04-05-26/Plan.md` | Piano RLS + risposte allineamento |
| 26 | `…/04-05-26/REPORT_ESECUZIONE_PLAN_RLS.md` | Migrazione; PR saltata |
| 27 | `…/04-05-26/TEST_PLAN_post_RLS.md` | Tre suite parallele |
| 28 | `…/04-05-26/REPORT_AGENTE_post_RLS_test_e_fix.md` | Suite API + QA Matteo + fix |
| 29 | `…/04-05-26/REPORT_UI_menu_admin_S2.10.md` | Tab Menu + toast + prezzo |
| 30 | `…/04-05-26/Aggiunta…/PLAN_UI_menu_admin_S2.10.md` | Audit; Settings orfano |
| 31 | `…/04-05-26/Aggiunta…/REPORT_UI_impostazioni_ristorante_admin.md` | Impostazioni locale |
| 32 | `…/04-05-26/Modifiche UI estetiche/REPORT_….md` | Gradiente warm |
| 33 | `…/05-05-26/REPORT_sessione_UI_admin_….md` | Hover, collapse, veto logout |
| 34 | `…/05-05-26/Plan-Eseguibile-pwa.md` | PWA + gate `is_active` |
| 35 | `…/05-05-26/CHECKLIST_test_pwa_e_gating.md` | 20/28; non pronto cliente |
| 36 | `…/05-05-26/REPORT_esecuzione_CHECKLIST_….md` | Evidenze runtime |
| 37 | `…/05-05-26/REPORT_attivazione_tenant_….md` | Tenant attivi + PWA |
| 38 | `…/05-05-26/REPORT_fix_calendario_….md` | Maggio in DB; restore orari |
| 39 | `…/05-05-26/REPORT_sessione_booking_….md` | TimePicker 24h, form admin |

#### `Lavoro/Knowledge Base/` (7)

| # | Path | Sintesi |
|---|------|---------|
| 40 | `…/CHECKLIST_Suite2_browser_semplice.md` | Checklist QA admin+form (07-05) |
| 41 | `…/Guida.md` | Setup locale zero terminale |
| 42 | `…/PROMPT_plan_UI_impostazioni_ristorante.md` | M-REGIA piano Impostazioni |
| 43 | `…/PROMPT_plan_UI_menu_ingredienti_admin.md` | M-REGIA piano Menu |
| 44 | `…/script e comandi/script-per-inserire-prenotazioni….md` | 2 comandi seed npm |
| 45 | `…/Skills/ui-card-aesthetics/SKILL.md` | Regola gradienti Tailwind |
| 46 | `…/Utenti per test.md` | Account A/B/outsider (no valori nel report) |

---

## Sezione 6 — Lacune e handoff

1. **Linea H4 / transcript CB-old** — confermare se «Risposte allineamento» e PROMPT chiusi sono M-VOCE o solo sintesi agente (M-REGIA).
2. **D1 (docs CB-old)** — confrontare ribaltamenti di specifica (schema, auth) con le decisioni di sessione qui.
3. **A1+** — tracciare quando torna lo split TEST/PROD forte e quando nasce il formato Q1 (assente in D2).
4. **PWA** — presente in D2 (05-05), assente in A1: capire se abbandonata, rinviata, o fuori perimetro A1.
5. **Autoria skill** `ui-card-aesthetics` e `24-02 SKILL.md` — L4 solo se transcript conferma che Matteo le ha volute come regola riusata.

---

## Sezione 7 — Chiusura verso Matteo

In questi mesi sulla vecchia CalendarBackup chiudevi le scelte importanti **prima** (sicurezza multi-tenant, dove stanno Menu e Impostazioni, «non bloccare mai le prenotazioni per capienza») e lasciavi all’agente il codice. Tu facevi il giro a schermo, segnalavi i bug e stoppavi i layout che non ti convincevano. A marzo avevi già la regola «tocca il DB di prova, non produzione»; a inizio maggio per lo sprint RLS hai accettato un solo ambiente sul progetto reale — poi in CB-v2 (fine maggio) lo split TEST/PROD torna più netto, e nascono Menu QR e Prenota v2 che qui ancora non c’erano.
