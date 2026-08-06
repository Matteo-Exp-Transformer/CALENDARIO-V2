# B1 — BHM-Zen: meta, skill-system, guide

> **Ondata:** B1 · **Data:** 06-08-26 · **Regime:** scavo · **Peso fonti:** 3 (report/doc scritti da agenti su «owner»; peso 1 assente in questo perimetro)
> **Perimetro:** `docs/Archives/docs/{meta/, skill-system/, guide/}` + 3 md root = **90 file**
> **Nota attribuzione:** la stringa «Matteo» compare **1 sola volta** in tutto B1, ed è un
> `{{segnaposto}}` del template v0 (`aree/_TEMPLATE_MINI.md`). Il soggetto nei testi è sempre
> **«owner»** (~395 occorrenze). Nei campi `Chi` sotto, `MATTEO` = owner del corpus BHM, per
> continuità con le altre ondate — **non** citazione nominale. Conferma M-VOCE → handoff **H5**.

---

## Sezione 1 — Decisioni

### 1a — Decisioni owner beta (intervista 06-07 + sedute UI)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| B1-D01 | 06-07-26 | COMPLIANCE | Audit append-only: storno, mai DELETE | MATTEO | ORIGINATA | `meta/MAPPATURA_AREE/DECISIONI_OWNER_BETA.md` #1 | «Immutabile da subito… append-only… mai DELETE fisico» | audit-immutability |
| B1-D02 | 06-07-26 | PRODOTTO | Dashboard ricca, dati reali (no fabbricati) | MATTEO | SCELTA | stesso #2 | «Dashboard ricca con dati reali… elimina i dati fabbricati» | product-honesty |
| B1-D03 | 06-07-26 | PRODOTTO | Liste spesa in beta (4 RPC + unifica stack) | MATTEO | SCELTA | stesso #3 | «In beta: deploy 4 RPC shopping» | product-scoping |
| B1-D04 | 06-07-26 | PRODOTTO | Companies: solo P.IVA + ragione sociale | MATTEO | SCELTA | stesso #4 | «Solo P.IVA + ragione sociale… rimuovere numero licenza» | product-scoping |
| B1-D05 | 06-07-26 | PRODOTTO | Notifiche: solo alert in-app, no preferenze | MATTEO | SCELTA | stesso #5 | «Solo alert in-app… non creare notification_preferences» | product-scoping |
| B1-D06 | 06-07-26 | COMPLIANCE | HACCP Settings UI sola lettura (LOCK TS) | MATTEO | ORIGINATA | stesso #6 | «Niente editing libero… soglie in haccp-rules.ts» | compliance-lock |
| B1-D07 | 06-07-26 | PRODOTTO | «Sigilla la giornata» = shift-seal append-only | MATTEO | ORIGINATA | stesso #7 | «sigilla la giornata… Firma audit-grade» | product-signature |
| B1-D08 | 06-07-26 | FLUSSO | Temp+metodo obbligatori; note/foto opzionali | MATTEO | SCELTA | stesso #8 | «Temperatura + metodo obbligatori… note e foto… opzionali» | data-quality |
| B1-D09 | 06-07-26 | PRODOTTO | 3 ruoli + inviti staff in beta | MATTEO | SCELTA | stesso #9 | «Tutti e 3 i ruoli… + inviti staff attivi» | multi-role |
| B1-D10 | 06-07-26 | FLUSSO | Ciclo scadenze completo (reinserimento+storico) | MATTEO | SCELTA | stesso #10 | «Completo: scadenza + expired_at + reinserimento…» | inventory-lifecycle |
| B1-D11 | 06-07-26 | PRODOTTO | Sync multi-utente = live-refetch conflict-free | MATTEO | ORIGINATA | stesso Decisione 11 | «livello «live-refetch, conflict-free»… nessun lock» | realtime-minimal |
| B1-D12 | 06-07-26 | PRODOTTO | Inventario = mansione; spesa flessibile no completamento | MATTEO | ORIGINATA | stesso Decisione 12 | «Inventario = mansione ricorrente… NIENTE avanzamento/completamento» | inventory-as-task |
| B1-D13 | 06-07-26 | FLUSSO | Calendario vista completa + completamento anticipato | MATTEO | ORIGINATA | `FEATURE_Calendario_vista-completa.md` L6-9 | «vista completa delle mansioni… la completo dal calendario» | calendar-depth |

### 1b — Direzione tecnica e prodotto (masterplan 05–06/07)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| B1-D14 | 05-07-26 | PROCESSO | Repo nuova: riuso cervello, UI ricostruita | MATTEO | ORIGINATA | `MASTERPLAN_RILANCIO_BHM_v2.md` §1 | «repo nuova pulita, riuso del "cervello", UI ripensata» | rebuild-strategy |
| B1-D15 | 05-07-26 | PROCESSO | Schema DB = verità (fondamenta prima) | MATTEO | ORIGINATA | stesso §1 | «schema DB corretto è la verità» | schema-first |
| B1-D16 | 05-07-26 | PRODOTTO | Beta Italia, 1 sede, gratis, no pagamenti | MATTEO | ORIGINATA | stesso §2 | «gratis in beta… nessun provider pagamenti» | go-to-market |
| B1-D17 | 05-07-26 | LEGALE | Sessione solo orario; niente geo/accelerometro | MATTEO | ORIGINATA | stesso §2 | «Niente geolocalizzazione né accelerometro» | privacy-min |
| B1-D18 | 05-07-26 | COMPLIANCE | Postura registro audit-grade / ente come qualità | MATTEO | ORIGINATA | stesso §3 | «ente-HACCP è il livello di qualità, non una feature» | compliance-ambition |
| B1-D19 | 05-07-26 | COMPLIANCE | Spezza Ufficiale HACCP in 3 (regole/skill/runtime) | MATTEO | ORIGINATA | stesso §3 | «La skill "Ufficiale HACCP" va spezzata in 3» | compliance-architecture |
| B1-D20 | 05-07-26 | AI-METODO | Skill-system-v0 installato pulito in repo nuova | MATTEO | APPROVATA | stesso §1/§14 | «Skill-system-v0 installato pulito» | skill-portability |
| B1-D21 | 05-07-26 | AI-METODO | Casa docs/ + 3 porte Cursor/Codex/Claude | MATTEO | APPROVATA | stesso §8/§14.2 | «docs/ casa unica… tre porte d'ingresso» | agent-entrypoints |
| B1-D22 | 05-07-26 | UI-UX | Naming Regia; responsive-everywhere; clinico-caldo | MATTEO | SCELTA | stesso §13 | «Naming ingresso… Regia» · «responsive-everywhere» | ui-direction |
| B1-D23 | 05-07-26 | PRODOTTO | 4 case canoniche + loop IMPOSTO→FACCIO→CONTROLLO→DIMOSTRO | MATTEO | ORIGINATA | stesso §9/§12 | «ciclo di vita del lavoro… ① IMPOSTO → ② FACCIO…» | product-spine |
| B1-D24 | 05-07-26 | UI-UX | 3 gesti-firma beta (temp/cascata/timbro) | MATTEO | ORIGINATA | stesso §10.3 | «3 gesti-firma BETA… fatti benissimo» | signature-gestures |
| B1-D25 | 06-07-26 | UI-UX | Tempo animazioni = calma, non fretta (globale) | MATTEO | CORRETTIVA | stesso §13.6; `MOCKUP_UI/00_INDICE_MOCKUP.md` | «Tempo = pulizia nitida e tranquilla, non fretta» | motion-pacing |
| B1-D26 | 06-07-26 | AI-METODO | Idee esperienza: annota, non implementare | MATTEO | ORIGINATA | stesso §11 | «lo annota. Non lo implementa» | idea-capture |
| B1-D27 | 06-07-26 | AI-METODO | Due lenti: Ufficiale × Ristoratore | MATTEO | ORIGINATA | stesso §9.5; `DESIGN_SKILL_CONSULENTI.md` | «feature buona solo se entrambe la approvano» | dual-lens |
| B1-D28 | 06-07-26 | AI-METODO | 6 archetipi Ristoratore confermati | MATTEO | SCELTA | `DESIGN_SKILL_CONSULENTI.md` §1.5 | «Archetipi beta (CONFERMATI — 6)» | archetype-design |
| B1-D29 | 06-07-26 | COMPLIANCE | Compliance beta da fonti ufficiali; gate-pro a certificazione | MATTEO | SCELTA | stesso §2.4-bis | «costruiamo noi… gate-professionista… alla certificazione» | compliance-bootstrap |
| B1-D30 | 06-07-26 | COMPLIANCE | Change-Control 3 gate; ok owner = gate umano | MATTEO | ORIGINATA | masterplan §14.3 | «autorizzazione diretta dell'owner soddisfa questo gate» | compliance-governance |

### 1c — Skill-system: eredità v0 + compilazione BHM

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| B1-D31 | 06-07-26 | AI-METODO | Lessico-comando ereditato da v0, non reinventato | MATTEO | APPROVATA | `skill-system/comunicazione/VOCABOLARIO.md` §A | «ereditato dal skill-system v0… non va reinventato» | skill-portability |
| B1-D32 | 06-07-26 | AI-METODO | Didattico OFF in beta | MATTEO | SCELTA | `00_BUSSOLA_SKILL.md` §5; masterplan §14.2 | «Sottosistema didattico: SPENTO per la beta» | scope-control |
| B1-D33 | 06-07-26 | AI-METODO | Seed 7 nomi-elemento (pdc, cascata, timbro…) | MATTEO | ORIGINATA | `PROPOSTE.md`; Report-skill-lessico | forme custom (piantina, prova haccp, regtemp) | domain-lexicon |
| B1-D34 | 06-07-26 | AI-METODO | Scarta anteprima HTML fissa in prepara-prompt | MATTEO | CORRETTIVA | `PROPOSTE.md` [SCARTATA] | «scartata — troppo pesante… owner chiederà ad hoc» | anti-bureaucracy |
| B1-D35 | 06-07-26 | AI-METODO | Voce «delego»/modalità team Liv.2 | MATTEO | ORIGINATA | VOCABOLARIO §A; masterplan §15.1 | «Approvata il: masterplan §15.1 (2026-07-06)» | team-delegation |
| B1-D36 | 06-07-26 | AI-METODO | Kit team on-demand, NON prassi default | MATTEO | ORIGINATA | `COLLABORAZIONE_TEAM/01_DESIGN_METODO.md` §6.1 | «on-demand, NON prassi di default» | team-on-demand |
| B1-D37 | 06-07-26 | PROCESSO | Solo owner promuove `main`; collab su feature/* | MATTEO | ORIGINATA | stesso L86-109 | «solo owner promuove main» | git-governance |
| B1-D38 | 06-07-26 | TESTING | Gate ② = controverifica visiva umana | MATTEO | ORIGINATA | `05_GATE_E_CONTROVERIFICA.md` L31 | «build verde ≠ funziona» | human-verify |
| B1-D39 | 06-07-26 | SICUREZZA | MCP Supabase vietato; solo CLI | MATTEO | ORIGINATA | `FABLE_CHECKPOINT.md` Decisione 2 | «MCP Supabase: divieto CONFERMATO» | env-safety |
| B1-D40 | 06-07-26 | SICUREZZA | Solo dati test sul DB live; migration additive | MATTEO | APPROVATA | stesso Decisione 3 | «solo dati test/owner sul DB live» | env-safety |
| B1-D41 | 06-07-26 | SICUREZZA | Ok esplicito push 8 migration audit-grade | MATTEO | APPROVATA | stesso CP5; Report-fondamenta | «APPLICATE con ok owner» | migration-gate |
| B1-D42 | 06-07-26 | SICUREZZA | Ok push migration storno + E2E scrittura | MATTEO | APPROVATA | FOLLOW_UP FU-008/009; CP9 | «fatto CP9 (ok owner)» | migration-gate |
| B1-D43 | 08-07-26 | UI-UX | UI dai mockup, logica legacy sì / componenti no | MATTEO | CORRETTIVA | `FABLE_CHECKPOINT` Decisione 5; Report-blindatura | «ui dei mockap. procedi pure» | ui-source-of-truth |
| B1-D44 | 08-07-26 | FLUSSO | Modifica pdc/reparti/staff da Regia | MATTEO | ORIGINATA | Report-senior-blindatura | «da regia… modificare PDC - reparti - staff» | product-scoping |
| B1-D45 | 08-07-26 | PROCESSO | Autonomia piena fasi blindatura (no push) | MATTEO | DELEGATA | stesso | «prosegui… senza chiedermi autorizzazioni» | autonomy-mandate |
| B1-D46 | 08-07-26 | FLUSSO | Onboarding cantiere 7 passi priorità | MATTEO | ORIGINATA | Report-esecuzione-inviti | «priorità onboarding… guidata, ripetibile» | onboarding-ux |
| B1-D47 | 08-07-26 | IMPOSTAZIONI | Kill-switch email inviti | MATTEO | SCELTA | stesso | «dimmi cosa disattivare… email» | ops-safety |
| B1-D48 | 08-07-26 | UI-UX | Modal 2 colonne + scrollbar | MATTEO | ORIGINATA | stesso mandato | «modal: 2 colonne… + scrollbar» | ui-ux |
| B1-D49 | 09-07-26 | FLUSSO | Spec onboarding 7 passi A–H verbatim | MATTEO | ORIGINATA | `PROMPT_SENIOR_ONBOARDING_COMPLETO.md` | blocco «Modifiche da fare : A. Regia…» | product-spec |
| B1-D50 | 09-07-26 | PRODOTTO | Categorie espanse + preset «base solida additiva» | MATTEO | ORIGINATA | `DATI_ONBOARDING/01`+`03` | «espandi con categorie comuni» · «non costringiamo a eliminarli» | onboarding-data |
| B1-D51 | 09-07-26 | COMPLIANCE | Preparazioni estese (8 processi), form essenziale | MATTEO | ORIGINATA | `DATI_ONBOARDING/04` | «copertura estesa… essenziale ma allineato» | compliance-ux |
| B1-D52 | 09-07-26 | PRODOTTO | Firma admin facoltativa + timbro chiusura | MATTEO | ORIGINATA | PROMPT onboarding Step 7 | «Firma digitale admin (FACOLTATIVA)» | onboarding-ux |
| B1-D53 | 09-07-26 | PROCESSO | Autonomia fino a fine task; push solo con ok | MATTEO | DELEGATA | Report-onboarding | «procedi in autonomia» + «push = chiedere ok» | autonomy-mandate |
| B1-D54 | 10-07-26 | SICUREZZA | Ok esplicito FU-019 (5 migration onboarding) | MATTEO | APPROVATA | SESSION_LOG 10-07; Report-onboarding §7 | «Push applicato con ok owner esplicito» | migration-gate |
| B1-D55 | 06-07-26 | UI-UX | Onboarding non saltabile; temp fissa da profilo | MATTEO | ORIGINATA | `MOCKUP_UI/00_INDICE_MOCKUP.md` | «non saltabile» · «temperatura dal profilo» | onboarding-ux |
| B1-D56 | 06-07-26 | UI-UX | Onboarding dipendente: carta bianca a Fable | MATTEO | DELEGATA | stesso L81 | «carta bianca a Fable» | autonomy-mandate |
| B1-D57 | 06-07-26 | PROCESSO | Mockup HTML = verità visiva + asset marketing | MATTEO | SCELTA | masterplan §13.8 | «doppio uso deciso dall'owner» | mockup-as-truth |

### Rifiuti / tagli espliciti (peso doppio)

| # | Cosa | Data | Fonte |
|---|------|------|-------|
| R1 | Presence / awareness / «chi è online» in beta | 06-07 | DECISIONI dec.11 |
| R2 | ~2.700 righe realtime legacy (CollaborativeEditing, presence, HACCPAlertSystem…) | 06-07 | DECISIONI dec.11 |
| R3 | Pannello `notification_preferences` | 06-07 | dec.5 |
| R4 | Editing libero soglie HACCP in UI | 06-07 | dec.6 |
| R5 | Completamento/avanzamento liste spesa | 06-07 | dec.12 |
| R6 | Temperature completabili dal calendario | 06-07 | FEATURE Calendario |
| R7 | Anteprima HTML strutturale fissa in prepara-prompt | 06-07 | PROPOSTE [SCARTATA] |
| R8 | Sottosistema didattico in beta | 06-07 | Bussola / §14.2 |
| R9 | Kit team come prassi always-on | 06-07 | COLLABORAZIONE §6.1 |
| R10 | MCP Supabase (anche se configurato) | 06-07 | FABLE_CHECKPOINT |
| R11 | UI componenti legacy in Regia/onboarding | 08-07 | Decisione 5 checkpoint |
| R12 | IA runtime, geo, pagamenti, multi-sede (fuori beta) | 05-07 | masterplan §5 / SCOPE |

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| B1-A01 | M→A | DIRETTA | Rallenta animazioni: tempo calmo, non fretta | accettata | MOCKUP_UI + masterplan §13.6 |
| B1-A02 | M→A | DIRETTA | Cascata troppo rapida → ritmo lento obbligato | accettata | masterplan §13.5 #2 |
| B1-A03 | M→A | DIRETTA | Scarta HTML fisso in prepara-prompt | accettata | PROPOSTE [SCARTATA] |
| B1-A04 | M→A | DIRETTA | Rinomina 7 elementi lessico (piantina ≠ mappa) | accettata | Report-skill-lessico |
| B1-A05 | M→A | DIRETTA | UI = mockup, non form UI legacy | accettata | Blindatura Q1 |
| B1-A06 | M→A | DIRETTA | Autonomia fasi ma **non** push DB senza ok | accettata | Onboarding cappello + §7 |
| B1-A07 | A→M | DIRETTA | Agent ferma push: «push = chiedere ok» nonostante mandato autonomia | accettata | Report-onboarding |
| B1-A08 | A→M | DIRETTA | Profili frigo legacy NON portati (numeri fuori LOCK) → FU-005 | accettata | Report-inviti / FU-013 |
| B1-A09 | A→M | DEDOTTA | Clock-skew timbro: flake CP9 → fix script | accettata | ERRORI 08-07; Blindatura |
| B1-A10 | A→M | DIRETTA | Gate-3 regole `pending` resta aperto (owner non ha validato) | ignota | Report-onboarding; FU-005 |
| B1-A11 | M↔M | DEDOTTA | Da «form legacy» a «ui mockup» nella stessa chat | accettata | Blindatura Dati comunicazione |
| B1-A12 | M→A | DIRETTA | Conferma runtime BUG-005 (`method` mancante) → trigger Fase 3 | accettata | GUIDA_INTRODUTTIVA; HANDOFF_FASE3 |
| B1-A13 | A→M | DIRETTA | Agent trova 2 tabelle senza RLS → hardening | accettata | CP6 FABLE_CHECKPOINT |
| B1-A14 | A→M | DIRETTA | Pattern «domande tutte insieme all'inizio» consigliato | accettata | Report-fondamenta |
| B1-A15 | M→A | DIRETTA | Spec onboarding A–H grezza preservata «scope intatto» | accettata | PROMPT_SENIOR_ONBOARDING |
| B1-A16 | M→A | DIRETTA | Kill-switch email dopo test inviti | accettata | Report-inviti |

---

## Sezione 3 — Skill signals (provvisori)

| Skill | Livello | Prove in B1 | Contro cercata |
|-------|---------|-------------|----------------|
| `product-scoping` (beta in/out, 13 decisioni) | **L3–L4** | D01–D13, D16, SCOPE, rifiuti R1–R12 | sì → C6, C7 |
| `audit-immutability` / append-only | **L4** | D01, D07, migration CP5, pratiche | sì → C1 (rompe legacy) |
| `compliance-lock` (fonte unica numeri) | **L4** | D06, D30, Bussola LOCK, COMPLIANCE_CONTEXT | sì → C5 (gate-3 aperto) |
| `skill-portability` (v0→progetto) | **L4** | D20, D31, README gemello v0 | sì → C2 (OSSERVAZIONI vuota) |
| `migration-gate` / `env-safety` | **L3–L4** | D39–D42, D54, A06–A07 | sì → C3 (DB unico=PROD) |
| `ui-source-of-truth` (mockup) | **L3** | D43, D57, A05 | cercata, non trovata fallimento |
| `domain-lexicon` (4 case + elementi) | **L4** | D23, D33, VOCAB §B | sì → C2 |
| `dual-lens` (Ufficiale×Ristoratore) | **L2** | D27–D28, DESIGN_SKILL | design sì; uso runtime poco documentato qui |
| `autonomy-mandate` + eccezioni | **L3** | D45, D53, A06–A07 | sì → C4 |
| `motion-pacing` / signature gestures | **L3** | D24–D25, A01–A02 | sì → C8 (cascata UI aperta) |
| `team-delegation` (on-demand) | **L2** | D35–D37 | kit scritto; uso reale non in B1 |
| `human-verify` (build≠funziona) | **L3** | D38, gate kit team | — |
| `anti-bureaucracy` | **L3** | D34, R7 | — |
| osservazione comunicazione (Liv.2) | **L0** | OSSERVAZIONI stub | — |

### Frecce trasferimento BHM ↔ CalendarBackup (materiale S3)

> **Correzione di narrazione:** in B1 (BHM-Zen, luglio 2026) lo skill-system **non nasce** —
> viene **installato da v0** estratto da CB-v2 (mag–giu). La freccia metodo è **CB → v0 → BHM**.
> Le decisioni **prodotto** HACCP (append-only, sigilla, due lenti, 4 case) sono native BHM.
> Le origini più antiche del lavoro-con-agenti stanno in linea **C** (legacy), non in questo pezzo.

| Elemento | Direzione | Nota |
|----------|-----------|------|
| Lessico-comando (prepara, lavoro ok, report finale, spiegamelo, ragioniamo…) | **CB→BHM** | VOCAB BHM: «ereditato dal skill-system v0» |
| Bussola / profili Esecuzione·Verifica·Meta | **CB→BHM** (struttura) | Compilata con 4 case HACCP |
| CHIUSURA, CONTROVERIFICA, EVOLUZIONE, REVISIONE, hooks | **CB→BHM** | Kit copiato; CHIUSURA adattata |
| ERRORI 15-06 (apostrofi TS, not.toContain) | **CB→BHM** | Righe CB ancora nel ledger BHM |
| OSSERVAZIONI / dati Liv.2 | struttura **CB→BHM**, contenuto BHM **vuoto** | Contro: sistema non nutrito in luglio |
| Skill d'area per zona | pattern **CB→BHM**, contenuto **NUOVO** | Oggi/Reparti/Scorte/Regia vs Prenota/QR/Admin |
| IDEE_ESPERIENZA + AGGIORNAMENTI_HACCP | **NUOVO in BHM** | Assenti nel kit CB base |
| Ufficiale-HACCP + Ristoratore (dual-lens) | **NUOVO in BHM** | Potenziale freccia futura verso CB (lenti prodotto) |
| Append-only / storno / migration-gate | **BHM nativo** (prodotto) | CB ha env-safety TEST/PROD **più maturo** |
| Split TEST/PROD DB | **CB più avanti** | BHM: DB unico = PROD di costruzione |
| «delego» / kit team on-demand | **NUOVO in BHM** | Non tipico in VOCAB CB |
| Mini-pack | template **CB→BHM**, uso **assente** | Indice vuoto in Bussola |
| ARCHIVIO_DECISIONI / COMANDI_AVVIO | **ASSENTE in BHM** | Presenti in CB Comunicazione-Skill |

---

## Sezione 4 — Contro-evidenze

| ID | Cosa | Perché conta | Fonte |
|----|------|--------------|-------|
| B1-C01 | Append-only rompe uncomplete/edit del legacy finché non c’è storno | Decisione forte crea finestra di incoerenza operativa | REVISIONE_FONDAMENTA §3.2; FU-007 |
| B1-C02 | OSSERVAZIONI ancora template vuoto dopo 4+ giorni densi (06–10/07) | Sistema «misurabile» non ha raccolto dati Liv.2 in BHM | `OSSERVAZIONI.md` |
| B1-C03 | DB live = PROD di costruzione; E2E scrittura sul live | `env-safety` incompleta vs split TEST/PROD di CB-v2 | HEALTH_CHECK; REVISIONE §3.1 |
| B1-C04 | Mandati «senza autorizzazioni» vs push sempre bloccato | Tensione autonomia/sicurezza: owner delega a tratti oltre il sicuro | D45/D53 vs A07 |
| B1-C05 | Gate-3: 23 regole HACCP usate ma ancora `pending` | Compliance «viva» senza validazione umana finale | Report-onboarding; FU-005 |
| B1-C06 | FU-015 Inventario-come-mansione (dec.12) ancora aperto a fine pezzo | Decisione prodotto non portata a chiusura | FOLLOW_UP; FABLE_CHECKPOINT «Prossimo» |
| B1-C07 | FU-014 Cascata UI (gesto-firma) aperta; solo motore | Spec owner 06-07 non chiusa in UI | FOLLOW_UP |
| B1-C08 | Mockup status «attesa ok» vs handoff «approvato» (drift doc) | Documentazione non sempre allineata alle decisioni | MOCKUP_UI vs HANDOFF_UI |
| B1-C09 | Doc «campi salvati OK» smentita da conferma owner BUG-005 | Owner catcha bug che la doc negava | GUIDA_INTRODUTTIVA |
| B1-C10 | Nessuna M-VOCE nominale in B1 (solo «owner») | Attribuzione L3/L4 dipende da H5; qui peso 3 | Grep Matteo=1 (template) |
| B1-C11 | Didattico spento → niente scuola senior in beta | Taglia pezzo del kit CB di proposito | Bussola §5 |
| B1-C12 | INIT_CHECKLIST branch protezioni ancora `[ ]` mentre CP5 dice già protetti | Drift checklist vs checkpoint | INIT vs FABLE_CHECKPOINT |

**Motivazione copertura contro:** cercate attivamente su tutte le skill L3/L4; nessuna sezione vuota per omissione.

---

## Sezione 5 — Copertura dichiarata

| Metrica | Valore |
|---------|--------|
| File nel perimetro | **90** (meta 42 + skill-system 42 + guide 3 + root 3) — `find`/Get-ChildItem 06-08-26 |
| File aperti | **90 / 90 (100%)** |
| File illeggibili/saltati | **0** |
| Regime | scavo intero; `CATALOGO_DOCUMENTALE` (1,1 MB) aperto via Grep+sezioni FASE 2b/3 (segnale owner: 2 hit) — dichiarato, non riassunto |
| Fuori perimetro (corretto) | `app-definition/` = 138 → B2/B3 |

### Densità per sotto-cartella

| Zona | File | Segnale medio |
|------|------|---------------|
| `meta/MAPPATURA_AREE/` + DECISIONI | 8 | **critico** |
| `meta/MASTERPLAN` + DESIGN + VISIONE + REVISIONE | 4 | **critico** |
| `meta/COLLABORAZIONE_TEAM/` | 7 | alto |
| `meta/DATI_ONBOARDING/` | 6 | alto |
| `meta/MOCKUP_UI/` (md) | 2 | alto |
| `meta/HANDOFF_*` + GUIDA | 5 | alto |
| `meta/FASE3_*` | 8 | basso (tecnico; poche decisioni owner) |
| `meta/CATALOGO_*` | 1 | medio-basso su owner |
| `skill-system/comunicazione/` | 11 | alto su VOCAB/PROPOSTE/ERRORI; OSSERVAZIONI nullo |
| `skill-system/aree/` + context | 12 | alto su DB/Testing/Compliance; template bassi |
| `skill-system/sessioni/` | 12 | **critico** (06–10/07) |
| `skill-system/` root + hooks README | 7 | medio (kit v0) |
| `guide/` + root docs | 6 | alto (SCOPE, PRATICHE, CHECKPOINT) |

---

## Sezione 6 — Lacune e handoff

| Lacuna | Serve a |
|--------|---------|
| Parole verbatim di Matteo su BHM (M-VOCE) | **H5** — qui tutto è «owner» mediato da agenti |
| `app-definition/` (138 file, specifica prodotto) | **B2 + B3** |
| HACCP legacy pre-metodo | **C1–C5** — dove il metodo *nasce* davvero |
| Skill-system CB operativo + decisioni vocabolario | **M1** (già fatta) — crociare frecce in **S3** |
| Gemello skill-system Trading | **F1** |
| Gate-3 / cascata UI / FU-015 / SMTP inviti | prodotto residuo, non mining |
| Citazioni owner nei report = peso 3 | S1/S4: non elevare a prova primaria senza H5 |

---

## Sezione 7 — Chiusura verso Matteo

In luglio, su BHM, hai messo per iscritto **come deve funzionare il ristorante digitale**: registri che non si cancellano, giornata che si «sigilla», scorte senza finta «missione completata», e tre ruoli con invito.  
Allo stesso tempo hai **riusato il telecomando degli agenti** nato su CalendarBackup (stesso vocabolario di comandi), aggiungendo il dizionario di cucina e le due lenti «ufficiale × ristoratore».  
Il pezzo ancora debole è la **memoria viva** dello skill system (osservazioni vuote) e il fatto che lavoravi su **un solo database di produzione** — su CalendarBackup quel rischio lo avevi già spezzato in test/prod.
`)