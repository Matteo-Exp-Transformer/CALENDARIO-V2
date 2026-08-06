# G2 — `_lavoro/Sessioni/` 12-05 → 22-05 (prime due settimane CB-v2)

> **Ondata:** G2 · **Data:** 06-08-26 · **Regime:** scavo · **Peso fonti:** 3 (report/plan/prompt scritti da agenti *su* Matteo o *con* sue risposte registrate). Non sono transcript (peso 1): dove manca citazione chiara → `INCERTO`.
> **Perimetro:** `docs/_lavoro/Sessioni/{12-05-26 … 22-05-26, inclusa 19-05-25}` = **56 file** .md (conteggio Shell 06-08-26; coincide con P0).
> **Tracciamento git:** 56/56 tracciati (P0 §7) — questi log «privati» finiscono su GitHub.
> **Obiettivo ondata:** colmare il buco prima del log pubblico (da 23-05). Punto zero della curva di crescita CB-v2 (nascita prodotto 27-04; qui il picco operativo di metà maggio).

### Verdetto su `19-05-25/`

**Refuso di anno nel nome cartella.** Contenuto = **19-05-26**, non 2025.

Prove: branch `Sviluppo-Dashboard-laterale`; commit Fase 2 (`6a5f96d`…`b33d599`); migrazione `024_n_canonical_slots`; il Masterplan del **22-05-26** parte da quello stato (`last commit b33d599`, drift 022–024). Coerente con 19→22 maggio **2026**; incoerente con un lavoro del 2025. **Non rinominare** in questa ondata — solo dichiarare.

### Incrocio H1 (stesso periodo, parole sue)

Report **H1 non ancora prodotto** (⬜). Campione corpus `prompts_CB-v2.jsonl`: **147 M-VOCE** datati 12-05→22-05. Divergenze già utili a S4 (peso 1 vs peso 3):

| Tema | Cosa dicono i report G2 | Cosa emerge dal campione M-VOCE | Implicazione |
|------|-------------------------|----------------------------------|--------------|
| Unificazione fasce | File «Considerazioni» attribuisce a Matteo opzione B + delega valutazione A | Lui chiede di *creare* quel file e detta le decisioni in chat (15-05, chat `19eec9c5`) | Origine **più forte** di quanto un report «registra» — H1 dovrà citare uuid+seq |
| Preferenza storage B vs esito A | Report: preferenza B, poi vince `service_slots` | Stessa preferenza nelle sue parole; l’esito A non è «lui ha imposto JSON» | G2-D38/D39 restano validi; chi inventa «Matteo ha scelto service_slots» sbaglia |
| UX pixel | Report: «iterazioni UX» | Correzioni letterali: posizione controlli, freccia→X, «NON VEDO… la promo» | Agency M→A più frequente di quanto i report riassumano |
| Ambiente DB | Report: «Applica via MCP ora» + lezione TEST≠PROD | Autorizza MCP/DB punto per punto; chiede seed/tenant/query edition | Conferma; H1/J1 per timing esatto scritture PROD |

---

## Sezione 1 — Decisioni

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| G2-D01 | 13-05-26 | FLUSSO | Tavoli sempre con sala obbligatoria | MATTEO | CORRETTIVA | `13-05-26/Debug…/AGENT_POST_DEBUG_HANDOFF.md` §Servizio | «I tavoli non possono essere “Senza sala”.» | sala-obbligatoria |
| G2-D02 | 13-05-26 | UI-UX | Modifica sale da elenco dedicato | MATTEO | CORRETTIVA | stesso file §Servizio | «vuole un pulsante per modificare le sale» | gestione-sale |
| G2-D03 | 13-05-26 | FLUSSO | Walk-in: sceglie sala e tavolo libero | MATTEO | ORIGINATA | stesso file §Walk-in | «mostrare solo tavoli liberi» | walkin-tavolo |
| G2-D04 | 13-05-26 | IMPOSTAZIONI | Limite walk-in modificabile in impostazioni | MATTEO | ORIGINATA | stesso file §Walk-in | «Possibilità di cambiare il limite walk-in» | limite-walkin |
| G2-D05 | 13-05-26 | UI-UX | Icona distinta walk-in sul calendario | MATTEO | ORIGINATA | stesso file §Calendario | «Preferenza: omino stilizzato» | icona-walkin |
| G2-D06 | 13-05-26 | FLUSSO | Walk-in senza stato No-show | MATTEO | ORIGINATA | stesso file §Calendario | «non devono poter avere stato «No show»» | walkin-no-noshow |
| G2-D07 | 13-05-26 | FLUSSO | No-show sparisce dal calendario | MATTEO | ORIGINATA | stesso file §Calendario | «deve scomparire dal calendario» | no-show-visibilita |
| G2-D08 | 13-05-26 | UI-UX | Analytics: Settimana/Mese/Anno di calendario | MATTEO | CORRETTIVA | stesso file §Analytics | «Settimana — Mese — Anno» | analytics-periodi |
| G2-D09 | 13-05-26 | PRODOTTO | Occupazione % coerente col periodo | MATTEO | ORIGINATA | stesso file §Analytics 9bis | «percentuale coerente con il periodo selezionato» | occupancy-periodo |
| G2-D10 | 13-05-26 | IMPOSTAZIONI | Sale = entità DB separata | MATTEO | SCELTA | `13-05-26/…/01-Report-decisioni-13-05-26.md` §4.1 | «Sale come entità separata» | rooms-db |
| G2-D11 | 13-05-26 | UI-UX | Mappa sala rettangolo configurabile | MATTEO | SCELTA | stesso §4.2 | «Rettangolo con dimensioni configurabili per sala» | room-canvas |
| G2-D12 | 13-05-26 | UI-UX | DnD mappa: @dnd-kit + SVG/HTML | MATTEO | SCELTA | stesso §4.3 | «@dnd-kit + SVG/HTML» | dnd-accessibile |
| G2-D13 | 13-05-26 | PROCESSO | Stato live mappa posticipato dopo F3 | MATTEO | SCELTA | stesso §4.13 | «Fase dedicata dopo F3» | scope-fasi |
| G2-D14 | 13-05-26 | PRODOTTO | KPI F2: ticket, no-show, fonte | MATTEO | SCELTA | stesso §4.5 | «Ticket medio, no-show, fonte prenotazione» | analytics-kpi |
| G2-D15 | 13-05-26 | FLUSSO | No-show nel dettaglio calendario | MATTEO | SCELTA | stesso §4.6 | «Nel `BookingDetailsModal` del calendario» | no-show-azione |
| G2-D16 | 13-05-26 | PRODOTTO | Confronto periodo su tutti i KPI | MATTEO | SCELTA | stesso §4.7 | «Sì, su tutti i KPI in F2» | confronto-kpi |
| G2-D17 | 13-05-26 | PRODOTTO | Filtro turno pranzo/cena in Analytics | MATTEO | SCELTA | stesso §4.8 | «Sì, toggle in cima» | filtro-turno |
| G2-D18 | 13-05-26 | PRODOTTO | Home: alert + walk-in + briefing | MATTEO | SCELTA | stesso §4.9 | «Alert pending + Walk-in + Briefing pre-turno» | home-priorita |
| G2-D19 | 13-05-26 | PROCESSO | Ordine fasi: Servizio→Analytics→Home | MATTEO | SCELTA | stesso §4.10 | «Servizio (DB → mappa) → Analytics → Home» | roadmap-fasi |
| G2-D20 | 13-05-26 | FLUSSO | Walk-in solo in admin, non pubblico | MATTEO | SCELTA | stesso §4.11 | «mostrato solo in admin» | walkin-admin |
| G2-D21 | 13-05-26 | PRODOTTO | Briefing HTML stampabile + PDF | MATTEO | SCELTA | stesso §4.12 | «HTML stampabile + download PDF gratuito» | briefing-turno |
| G2-D22 | 13-05-26 | UI-UX | Mappa mobile sola lettura | MATTEO | SCELTA | stesso §4.14 | «Solo view, drag desktop» | mobile-mappa |
| G2-D23 | 13-05-26 | SICUREZZA | Walk-in nel CHECK DB booking_type | MATTEO | SCELTA | stesso §4.15 | «Aggiungere `walk_in` al CHECK esistente» | integrita-walkin |
| G2-D24 | 13-05-26 | UI-UX | Sidebar parte sempre chiusa | MATTEO | ORIGINATA | `13-05-26/…/09-Report-rifinitura-dashboard.md` §Chiarimenti B | «Parte sempre chiusa» | sidebar-collassata |
| G2-D25 | 13-05-26 | UI-UX | Digest breakpoint statico 1390px | MATTEO | SCELTA | stesso §Chiarimenti G | «breakpoint statico `min-[1390px]`» | digest-responsive |
| G2-D26 | 13-05-26 | IMPOSTAZIONI | Turni Pro solo se service_slots presenti | MATTEO | SCELTA | stesso §Chiarimenti H | «i turni appaiono solo se `service_slots` presenti» | fasce-opt-in |
| G2-D27 | 14-05-26 | UI-UX | Home sotto Header + Nav (bodyOverride) | MATTEO | CORRETTIVA | `14-05-26/Plan-blindatura-admin-e-edition-system.md` §1 | «lasci visibili Header + NavItem» | home-body |
| G2-D28 | 14-05-26 | FLUSSO | Click tab esce da Home in sidebar | MATTEO | APPROVATA | `14-05-26/Report-esecuzione-blindatura-edition.md` §Domande | «Sì, sidebar non segna più 'Home'» | uscita-home |
| G2-D29 | 14-05-26 | PRODOTTO | Default: Pro→Home, Classic→Calendario | MATTEO | SCELTA | stesso §Domande | «Pro → Home; Classic → Calendario» | default-edition |
| G2-D30 | 14-05-26 | SICUREZZA | Alert orario passato anche su salvataggio | MATTEO | ORIGINATA | `14-05-26/Report-alert-orario-passato-accettazione.md` §Domande | «includere anche `BookingDetailsModal` — sì» | alert-orario |
| G2-D31 | 15-05-26 | FLUSSO | Una sola fonte dati per le fasce | MATTEO | ORIGINATA | `15-05-26/Considerazioni-unificazione-fasce-orarie.md` §1–3 | «Una sola tabella di dati» / «unica fonte di verità» | source-of-truth |
| G2-D32 | 15-05-26 | UI-UX | Parità fasce notturne Impostazioni↔Servizio | MATTEO | ORIGINATA | stesso §1 | «fine è prima dell’inizio» | fasce-notturne |
| G2-D33 | 15-05-26 | PRODOTTO | Classic tiene UI tre fasce senza sidebar | MATTEO | SCELTA | stesso §3 | «Classic mantiene la UI attuale» | classic-fasce |
| G2-D34 | 15-05-26 | PRODOTTO | Pro configura fasce da Servizio | MATTEO | SCELTA | stesso §3 | «configurazione da Pagina Servizio» | pro-fasce |
| G2-D35 | 15-05-26 | IMPOSTAZIONI | Preferenza storage iniziale = JSON B | MATTEO | SCELTA | stesso §1 / §4 | «Preferenza Matteo: opzione B» | storage-fasce-pref |
| G2-D36 | 15-05-26 | PROCESSO | Agente valuta A vs B; ok se diverge | CONGIUNTA | DELEGATA | stesso §4 | «valutare A vs B» / «attendere ok… se ≠ B» | delega-architettura |
| G2-D37 | 15-05-26 | PROCESSO | Numerazione migrazione fix → 020 | MATTEO | SCELTA | `15-05-26/Report-pulizia-booking_time_slots-e-fix-PGRST202.md` §3 | «Usa 020 per il nuovo» | migrazione-univoca |
| G2-D38 | 15-05-26 | SICUREZZA | Autorizza apply MCP su PROD (fix PGRST) | MATTEO | APPROVATA | stesso §3 | «Applica via MCP ora» | prod-autorizzata |
| G2-D39 | 15-05-26 | PROCESSO | Non aggiornare skill system in quella chat | MATTEO | ORIGINATA | `15-05-26/Report-test-modifica-fascia-oraria-coperti.md` §4 | «non aggiornare skill system» | report-only |
| G2-D40 | 15-05-26 | SICUREZZA | Blindare sidebar su TEST; PROD dopo | MATTEO | SCELTA | `15-05-26/Revisionate…/Report-fix-definitivo-pgrst202….md` §7 | «si blinda la sidebar lavorando sul DB di test» | test-prima-prod |
| G2-D41 | 16-05-26 | UI-UX | Sidebar a 3 stati (hidden/icons/expanded) | MATTEO | ORIGINATA | `16-05-26/Plan-Sidebar3stati.md` L5-10 | «far sparire del tutto la sidebar» | sidebar-3stati |
| G2-D42 | 16-05-26 | AI-METODO | Checkpoint LOCK AdminShell: «procedi» | MATTEO | APPROVATA | `16-05-26/Report-responsive-uniformazione.md` | «utente: ‘procedi’» | checkpoint-lock |
| G2-D43 | 17-05-26 | UI-UX | Modal fasce: info dietro toggle | MATTEO | CORRETTIVA | `17-05-26/Report-modal-fasce-info-toggle-e-menu-sempre.md` | «Iterazioni UX su richiesta» | iterazione-ux |
| G2-D44 | 19-05-26 | FLUSSO | Libera tavolo → prenotazione torna in coda | MATTEO | APPROVATA | `19-05-26/Report-libera-tavolo-ritorno-prenotazioni.md` | «Verifica manuale: confermata (‘funziona’)» | verifica-flusso |
| G2-D45 | 19-05-26 | PRODOTTO | Da 3 fasce fisse a N fasce dinamiche | INCERTO | DELEGATA | `19-05-25/fase2-n-fasce-dinamiche.md` (refuso data) | «da 3 fasce orarie fisse… a N fasce dinamiche» | n-fasce · IPOTESI |
| G2-D46 | 22-05-26 | FLUSSO | Booking fuori fascia → bucket Fuori fascia | INCERTO | SCELTA | `22-05-26/Masterplan allineamento branch.md` §A2 | «Decisione presa»: bucket `__unassigned__` | fuori-fascia |
| G2-D47 | 22-05-26 | SICUREZZA | Capacity check client + server | CONGIUNTA | APPROVATA | `22-05-26/Report-A1-A2-A3-capacityCheck.md` | «client-side + server-side» | difesa-strati |
| G2-D48 | 22-05-26 | TESTING | A5: dati TEST sbagliati, non il codice | MATTEO | APPROVATA | `22-05-26/Report-A5-check-disponibilita-fascia-pubblica.md` | «Verifica manuale confermata da Matteo» | diagnosi-dati |
| G2-D49 | 22-05-26 | PROCESSO | Rollout: DB prima del codice; no merge frettoloso | INCERTO | DELEGATA | `22-05-26/Masterplan…` §C + `Report-C-rollout-produzione.md` | «NON mergere finché… DB prima del codice» | rollout-controllato · IPOTESI |
| G2-D50 | 12-05-26 | PRODOTTO | Home = inizio turno (plan base) | INCERTO | APPROVATA | `12-05-26/Plan-base-Migliorato.md` §Home | «Home — ‘Inizio turno’ (confermato)» | home-operativa · IPOTESI |
| G2-D51 | 14-05-26 | PRODOTTO | Edition + feature flags (Classic vs Pro) | CONGIUNTA | APPROVATA | `14-05-26/Report-esecuzione-blindatura-edition.md` + Plan blindatura | gating sidebar/walk-in/no-show per edition | edition-system |
| G2-D52 | 16-05-26 | FLUSSO | Override fasce per singola fascia + date | INCERTO | SCELTA | `16-05-26/Report-pulsante-quando-override-fasce.md` | «L'override vale per una sola fascia» | override-fascia · IPOTESI |
| G2-D53 | 18-05-26 | FLUSSO | Filtro assegnazione prenotazioni per fascia | INCERTO | ORIGINATA | `18-05-26/Report-filtro-prenotazioni-per-fascia.md` | «solo le prenotazioni… dentro la fascia scelta» | filtro-assegnazione · IPOTESI |

### Decisioni sopravvissute fino a oggi (segnale per S3)

| Decisione G2 | Stato oggi (osservazione in perimetro + conoscenza prodotto) |
|--------------|--------------------------------------------------------------|
| Edition Classic/Pro + sidebar gated | **Viva** — nucleo prodotto |
| Una fonte per fasce; esito reale = `service_slots` (non JSON B) | **Viva** — preferenza iniziale B **non** sopravvissuta |
| N fasce dinamiche + flag Classic | **Viva** |
| Sidebar 3 stati | **Viva** (documentata shell) |
| Capacity a due livelli | **Viva** |
| Disciplina TEST prima di PROD / una migrazione alla volta | **Viva** (poi codificata in regole agenti) |
| Sale come entità + mappa | **Viva** (area Servizio) |
| Walk-in / no-show regole | **Vive** con gating edition |

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| G2-A01 | M→A | DIRETTA | Impone sala obbligatoria e flusso Modifica sale | accettata | `AGENT_POST_DEBUG_HANDOFF` §Servizio |
| G2-A02 | M→A | DIRETTA | Walk-in: tavolo libero + limite settings | accettata | stesso §Walk-in |
| G2-A03 | M→A | DIRETTA | No-show nascosto; walk-in senza no-show | accettata | stesso §Calendario |
| G2-A04 | M→A | DIRETTA | Analytics periodi = calendario, non rolling | accettata | stesso §Analytics |
| G2-A05 | M↔M | DIRETTA | Sceglie 15 decisioni F2–F3 in un colpo | accettata | `01-Report-decisioni` §4 |
| G2-A06 | M→A | DIRETTA | Sidebar chiusa + digest 1390px | accettata | `09-Report-rifinitura` |
| G2-A07 | A→M | DEDOTTA | Prima soluzione Home-come-tab interno fallisce | accettata | `09` + `10-Report-debug-dashboard` |
| G2-A08 | M→A | DIRETTA | Home sotto header (bodyOverride) | accettata | Plan blindatura §1 |
| G2-A09 | M→A | DIRETTA | Default edition Pro/Classic | accettata | Report blindatura §Domande |
| G2-A10 | M→A | DIRETTA | Estende alert orario al salvataggio | accettata | Report alert orario |
| G2-A11 | M↔M | DIRETTA | Preferisce JSON B ma delega confronto A/B | parziale | Considerazioni fasce §4 — poi vince A |
| G2-A12 | M→A | DIRETTA | «Usa 020» + «Applica via MCP ora» | accettata | Report PGRST202 §3 |
| G2-A13 | A→M | DIRETTA | Spiega TEST indietro / frustrazione ambiente | accettata | Report fix definitivo §7 |
| G2-A14 | M→A | DIRETTA | Decide blindare su TEST, PROD dopo merge | accettata | stesso §7 |
| G2-A15 | M→A | DIRETTA | Chiede sidebar che sparisce del tutto | accettata | Plan-Sidebar3stati |
| G2-A16 | M→A | DIRETTA | Checkpoint LOCK: autorizza «procedi» | accettata | Report responsive |
| G2-A17 | M→A | DEDOTTA | Itera UX modal fasce / promo (corpus: «NON VEDO») | accettata | Report modal/promo + campione H |
| G2-A18 | A→M | DIRETTA | A5: codice ok, dati TEST incompleti | accettata | Report-A5 |
| G2-A19 | M→A | DIRETTA | Segnala difetti post-deploy (walk-in/contatti) | accettata | Report-C-rollout |
| G2-A20 | M→A | DIRETTA | Verifica manuale «Libera tavolo» | accettata | Report libera tavolo |

---

## Sezione 3 — Skill signals

Scala §3.4 (provvisoria). L3/L4 richiedono contro-evidenza in §4.

| Skill | Livello provvisorio | Prova in G2 | Contro-evidenza cercata |
|-------|---------------------|-------------|-------------------------|
| product-scoping (Home/Servizio/Analytics) | **L2** | G2-D18–D21, G2-A05 | Contro: plan 12-05 spesso «confermato» senza soggetto (D50 INCERTO) |
| sala-obbligatoria / walkin / no-show | **L3** | G2-D01–D07, G2-A01–A03 | Contro: handoff nasce da bug già in produzione nella sessione — corregge dopo, non prevenendo |
| edition-system / default-edition | **L2–L3** | G2-D29, D51, G2-A09 | Contro: gran parte dello schema edition/features è design agente; lui sceglie default e conferma |
| source-of-truth fasce | **L2** (intenzione) / esito **L1** | G2-D31–D36, G2-A11 | Contro: preferenza B **sconfitta** dall’implementazione A — sa originare, non sempre vincere il dettaglio storage |
| env-safety / test-prima-prod | **L3** | G2-D38, D40, G2-A12–A14 | Contro: ha autorizzato MCP su PROD *prima* di imparare il disallineamento TEST (lezione a caldo) |
| sidebar-3stati / shell UX | **L2** | G2-D41–D42 | Contro: stato iniziale plan = `icons`, non «sempre chiusa» del 13-05 — coerenza evolutiva da S3 |
| diagnosi-dati vs codice | **L2** | G2-D48, G2-A18 | Contro: dipende dalla spiegazione agente; conferma dopo |
| rollout-controllato | **L1–L2** | G2-D49 | Contro: piano/report agente; attribuzione ORIGINATA non dimostrata |
| checkpoint-lock / LOCK culture | **L2** | G2-D42, G2-A16 | Contro: procedimento proposto dall’agente; lui ratifica |
| hands-on-qa | **L2** | G2-D44, D48, verifica browser PGRST | Contro: molte «decisioni» restano INCERTO senza sua citazione |

> Nessuna skill **L4** in questo perimetro: le regole TEST/PROD e LOCK qui sono *agite*, la *codifica* riusabile è più tardi (M1 VOCABOLARIO / skill system). Contro-evidenze L3 dichiarate sopra.

---

## Sezione 4 — Contro-evidenze

1. **Fonti peso 3:** quasi tutto è report/plan. «Decisioni dell’utente» senza virgolette → molte righe restano `INCERTO` (D45–D46, D49–D50, D52–D53). Non gonfiare autonomia.
2. **Preferenza storage sconfitta:** vuole B (`booking_time_slots` JSON); l’albero successivo adotta A (`service_slots`). Sa *impostare* il problema e *delegare* la valutazione; non «impone» il modello finale.
3. **Autorizzazione PROD precoce:** «Applica via MCP ora» (D38) avviene *prima* della lezione TEST≠PROD (D40). Contro-evidenza diretta su env-safety L3: impara correggendo, non prevenendo.
4. **Home/tab:** una soluzione approvata (Home come stato interno) viene ribaltata per bug di sync — prova di M↔M / correzione di rotta, non di design stabile al primo colpo.
5. **Refuso `19-05-25`:** se qualcuno data «maggio 2025» su N-fasce, inventa preistoria. È 2026.
6. **A5 falso negativo:** report precedenti «A5 non funziona»; poi dati TEST senza `max_guests`/limite. Rischio di attribuire a Matteo «fix del motore» quando ha solo verificato la diagnosi dati.
7. **Delega alta all’inizio:** plan base 12-05, prompt esecutori, masterplan 22-05 — densità di *regia* e ratifica. La voce produttiva (correzioni sala/walk-in/analytics/UX) cresce quando tocca lo schermo, non il design astratto.

---

## Sezione 5 — Copertura dichiarata

| Metrica | Valore |
|---------|--------|
| File nel perimetro | **56** |
| File aperti | **56** (100%) |
| Per cartella | 12-05:5 · 13-05:12 · 14-05:12 · 15-05:8 · 16-05:6 · 17-05:4 · 18-05:1 · 19-05-25:1 · 19-05-26:3 · 22-05:4 |
| File illeggibili / saltati | **0** |
| Regime | scavo (lettura intera; estrazione decisioni/agency; file a bassa densità comunque aperti e conteggiati) |

---

## Sezione 6 — Lacune e handoff

| Lacuna | Serve a |
|--------|---------|
| Citazioni verbatim uuid+seq 12-05→15-05 (e 16-22 per H2) | **H1** (overlap 12–15) / **H2** (16–22) — confermare ORIGINATA vs APPROVATA |
| Chi ha davvero deciso N-fasce e bucket fuori fascia | H2 + J1 (commit `b33d599` / `024`) |
| Timing esatto apply PROD 020 vs test utente su TEST | **J1** + H1 |
| Confronto «decisioni sopravvissute» vs skill attuali Admin/Servizio | **M3** + **S3** |
| Falsificazione preferenza B vs esito A | **S4** (già segnalata qui) |
| G1 (materiale privato) vs questi log: stessi temi QA/edition ma mesi diversi | **S5** ritratto |

---

## Sezione 7 — Chiusura verso Matteo

In queste due settimane stavi costruendo il cuore operativo dell’admin: sale e tavoli, walk-in, Home vs Classic/Pro, e soprattutto l’idea che le fasce orarie devono avere **una sola verità** (anche se la preferenza JSON iniziale non è quella rimasta).  
Correggevi molto quando lo vedevi a schermo (sala sbagliata, periodi Analytics, sidebar, promo), mentre sui piani lunghi delegavi e ratificavi — tipico punto zero: tanta regia, poca scrittura «da architetto» finché non tocchi il flusso.  
Il colpo duro è stato il DB: hai autorizzato un fix in produzione e solo dopo hai imposto «prima TEST, poi PROD» — quella lezione è ancora nelle regole di oggi.
