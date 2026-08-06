# G3 — `_lavoro/` Storico + Supporto + e2e-s4

> **Ondata:** G3 · **Data:** 06-08-26 · **Regime:** scavo · **Peso fonti:** 3 (guide/piani/analisi scritte con/per Matteo).
> **Perimetro:** `docs/_lavoro/Storico/` (8) + `Supporto/` (3) + `e2e-s4/` (2 md; **107** file totali nella cartella) = **13 md** (coincide con P0).
> **Tracciamento git (P0 §7):** Storico 8/8 · Supporto 3/3 · e2e-s4 **0** (artefatti fuori git).
> **Focus prompt:** Supporto = Matteo progetta *come* vuole essere spiegato (FORMAZIONE di primo livello per S5). Storico = architettura/testing dei primi tempi. e2e-s4 = artefatti macchina: contati, non aperti uno per uno.

---

## Sezione 1 — Decisioni

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| G3-D01 | ? | FORMAZIONE | Schema fix: Problema→Componente→Flussi→Perché | MATTEO | ORIGINATA | `Supporto/Metodo_spiegazioni_agenti_coding.md` L47-92 | «Quando mi spieghi una modifica o un fix, usa questo schema» | explanation-schema |
| G3-D02 | ? | AI-METODO | Ruoli: Matteo prodotto/UX; agente build/migra | MATTEO | ORIGINATA | `Metodo` L17-19 | «Io, Matteo, oriento il prodotto… L’agente costruisce» | role-split |
| G3-D03 | ? | FORMAZIONE | «spiegamelo semplice» = immagine + chi fa cosa | MATTEO | ORIGINATA | `Metodo` L31-45 | «usa un’immagine pratica o un esempio concreto» | spiegamelo-semplice |
| G3-D04 | ? | AI-METODO | Separare: modifica agente / regola mia / tool / UX | MATTEO | ORIGINATA | `Metodo` L35-41 | «una modifica… una regola operativa… un comportamento automatico» | agency-clarity |
| G3-D05 | ? | AI-METODO | Niente rischi automatici: fermati e chiedi | MATTEO | ORIGINATA | `Metodo` L94-98 | «Non voglio una sezione rischi automatica ogni volta» | ask-before-risk |
| G3-D06 | ? | TESTING | Comunica i test solo se falliscono o servono | MATTEO | ORIGINATA | `Metodo` L112-122 | «non serve raccontarmeli ogni volta» | test-signal-discipline |
| G3-D07 | ? | FORMAZIONE | Didattica solo se chiesta esplicitamente | MATTEO | ORIGINATA | `Metodo` L124-128 | «Non spiegarmi tutto in modo didattico di default» | didactic-on-demand |
| G3-D08 | ? | PRODOTTO | Decisione prodotto/UX finale torna a Matteo | MATTEO | ORIGINATA | `Metodo` L19 | «è giusto per il ristoratore…? la decisione finale torna a me» | product-ownership |
| G3-D09 | ? | AI-METODO | Dubbi da fermare: prod/test, QR≠Prenota, Classic/Pro | MATTEO | ORIGINATA | `Metodo` L100-110 | «differenza tra Menu QR, Pagina Prenota e Personalizza form» | ambiguity-gates |
| G3-D10 | 28-05-26 | PROCESSO | Un solo file analisi in `_lavoro`, no meta in skill ufficiali | MATTEO | CORRETTIVA | `Supporto/ANALISI_RACCOLTA_DATI_SKILL_SYSTEM.md.md` L234-236 | «preferenza per un solo file di analisi in `_lavoro`» | doc-hygiene · anti-meta-creep |
| G3-D11 | 28-05-26 | AI-METODO | Gap: Metodo locale più ricco di COMUNICAZIONE ufficiale | CONGIUNTA | APPROVATA | `ANALISI` §6.2 L151 | «il Metodo locale è più ricco… COMUNICAZIONE… più corto» | skill-gap-awareness |
| G3-D12 | 28-05-26 | PROCESSO | Report in Sessioni pubbliche, non in `_lavoro` | MATTEO | ORIGINATA | `ANALISI` §3 L64; §7 L175 | «Report in `Sessioni di lavoro/` non `_lavoro/`» | report-placement |
| G3-D13 | 28-05-26 | AI-METODO | Schema lavoro: Matteo → agente → prova → aggiustamenti | CONGIUNTA | APPROVATA | `ANALISI` §3 L76 | «Matteo imposta obiettivo… agente implementa… Matteo prova» | collab-loop |
| G3-D14 | 28-05-26 | PRODOTTO | PWA admin: aggiorna all’apertura, no reload in sessione | CONGIUNTA | APPROVATA | `ANALISI` §5.2 L120; `PWA_UPDATE_STRATEGY_PLAN.md` L3-7 | «Mario deve aprire l’app e trovarla già aggiornata» | pwa-update-policy |
| G3-D15 | ? | PRODOTTO | Priorità admin = coerenza post-deploy, non offline-first | MATTEO | SCELTA | `PWA_UPDATE` L11-13 | «la priorità… non è l’offline-first» | multi-tenant-ops |
| G3-D16 | ? | SICUREZZA | Service worker: no cache su dati Supabase/tenant | CONGIUNTA | APPROVATA | `PWA_UPDATE` L18 | «Le richieste a Supabase… non devono essere cacheati» | sw-data-safety |
| G3-D17 | ? | FLUSSO | Deploy mid-sessione: aggiornamento solo al riavvio | CONGIUNTA | APPROVATA | `PWA_UPDATE` L31-35 | «non si forza il reload e non si interrompe la compilazione» | no-mid-session-reload |
| G3-D18 | apr-26 | UI-UX | Tema v2: da warm-wood a palette Blu/Indaco | INCERTO | APPROVATA | `Storico/CHANGELOG_v2.md` L27-38 | «sostituito con una palette professionale Blu/Indaco» | brand-theme · IPOTESI |
| G3-D19 | apr-26 | PRODOTTO | Multi-tenant: schema consolidato in una migrazione | INCERTO | APPROVATA | `CHANGELOG_v2` L41-48 | «schema… in un’unica migrazione» | schema-consolidation · IPOTESI |
| G3-D20 | apr-26 | FLUSSO | Route invito `/invite/:token` + retrocompat `/register` | INCERTO | APPROVATA | `CHANGELOG_v2` L50-56 | «aggiunge la route `/invite/:token`» | invite-routing · IPOTESI |
| G3-D21 | apr-26 | PROCESSO | Setup credenziali/org/token = compito manuale Matteo | AGENTE | DELEGATA | `CHANGELOG_v2` L147-168 | «Richiede setup di Matteo» | ops-handoff |
| G3-D22 | apr-26 | PRODOTTO | Email conferma: Edge `send-email` ancora mancante | AGENTE | APPROVATA | `CHANGELOG_v2` L157-164; `EDGE_FUNCTIONS.md` L120-129 | «send-email… non esiste ancora» | email-gap |
| G3-D23 | 08-05-26 | UI-UX | Design system custom shadcn-inspired, no dip nuova | INCERTO | APPROVATA | `Storico/UI_REWRITE_PLAN.md` L3-14 | «custom design system shadcn-inspired» | design-system · IPOTESI |
| G3-D24 | 08-05-26 | UI-UX | Zone LOCKED: CollapsibleCard, Date/Time, Modal z-index | CONGIUNTA | APPROVATA | `UI_REWRITE_PLAN` L20-29 | «LOCKED esplicitamente» / «NON TOCCARE z-index» | ui-lock-zones |
| G3-D25 | 08-05-26 | UI-UX | Strategia alias `al-ritrovo-*` → poi rimozione | CONGIUNTA | APPROVATA | `UI_REWRITE_PLAN` L63-71 | «decisione presa» · «Se un agente lo propone, rifiuta» | token-migration |
| G3-D26 | 08-05-26 | AI-METODO | Una fase UI per run Cursor; validate dopo ogni file | CONGIUNTA | APPROVATA | `UI_REWRITE_PLAN` L268-276 | «Una fase per run. Mai due fasi in parallelo» | incremental-ui-runs |
| G3-D27 | 08-05-26 | UI-UX | Token consolidation PRIMA di riscrivere componenti | CONGIUNTA | APPROVATA | `UI_REWRITE_PLAN` L73-75 | «deve avvenire… PRIMA di riscrivere i componenti» | token-first |
| G3-D28 | ? | UI-UX | Alfabeto UI: feature solo con primitivi ui/ | INCERTO | APPROVATA | `Storico/alfabeto app..md` L1-3 | «costruito SOLO con questi» | ui-primitives · IPOTESI |
| G3-D29 | ? | UI-UX | Warm-* solo pagine pubbliche; primary-* admin | CONGIUNTA | APPROVATA | `alfabeto` L305-307; `UI_REWRITE` L57-61 | «SOLO pagine pubbliche con tema ristorante» | theme-split |
| G3-D30 | ? | ARCHITETTURA | Due client Supabase: sessione vs pubblico | INCERTO | APPROVATA | `Storico/ARCHITECTURE.md` L116-125 | «due client distinti» | dual-supabase · IPOTESI |
| G3-D31 | ? | ARCHITETTURA | React Query = server state; useState = UI | INCERTO | APPROVATA | `ARCHITECTURE` L46-63 | «due approcci distinti» | state-split · IPOTESI |
| G3-D32 | ? | TESTING | Stack: Vitest + MSW + Playwright + Husky + GHA | INCERTO | APPROVATA | `Storico/TESTING.md` L5-14 | «29 test Vitest verdi» | test-stack · IPOTESI |
| G3-D33 | ? | TESTING | Playwright e2e fuori CI (serve staging) | CONGIUNTA | APPROVATA | `TESTING.md` L120 | «non sono in CI perché richiedono… staging» | e2e-ci-deferral |
| G3-D34 | ? | TESTING | Checklist manuale pre-deploy (~30 min) | INCERTO | APPROVATA | `Storico/MANUAL_TEST_PLAN.md` L1-3 | «prima di ogni consegna o deploy» | manual-qa-plan · IPOTESI |
| G3-D35 | ? | SICUREZZA | Rate limit create-booking: 5 req/min per IP | INCERTO | APPROVATA | `Storico/EDGE_FUNCTIONS.md` L44 | «max 5 richieste/minuto per IP» | public-rate-limit · IPOTESI |
| G3-D36 | 02-08-26 | TESTING | E2E S4: 4 corsie MCP parallele + consolidamento | CONGIUNTA | APPROVATA | `e2e-s4/LANCIO_AMBIENTE.md` L27-43 | «Apri 4 chat Agent separate» | parallel-e2e-lanes |
| G3-D37 | 02-08-26 | SICUREZZA | Agenti e2e: solo UI, niente SQL/CLI Supabase | CONGIUNTA | APPROVATA | `LANCIO_AMBIENTE` L47 | «non devono usare SQL/CLI Supabase (solo UI)» | e2e-ui-only |
| G3-D38 | 02-08-26 | TESTING | Se isolamento fallisce → lanciare a due a due | CONGIUNTA | APPROVATA | `LANCIO_AMBIENTE` L39 | «lancia a due a due (es. A+C poi B+D)» | e2e-fallback |
| G3-D39 | 02-08-26 | SICUREZZA | Ambiente e2e solo su branch/env TEST | CONGIUNTA | APPROVATA | `LANCIO_AMBIENTE` L9-11 | «Branch `env/test`» · «TEST `docnnernvpyrbwuzzach`» | env-safety |

### Note di attribuzione (obbligatorie)

- **G3-D01–D09** sono la fonte più forte del perimetro: `Metodo_spiegazioni_*` è in prima persona («Io, Matteo…»). Va citata per esteso in **S5** (FORMAZIONE di primo livello: *come vuole essere spiegato*).
- **G3-D18–D35** (Storico): documenti tecnici tipicamente scritti da agenti nei primi giorni CB-v2. Dove non c’è citazione di scelta esplicita di Matteo → `Chi = INCERTO` / `IPOTESI`. Non elevare a ORIGINATA.
- **G3-D14–D17** (PWA): il piano parla di «Decisione» senza firmare Matteo; `ANALISI` la elenca tra decisioni prodotto consolidate → `CONGIUNTA` / `APPROVATA` (non ORIGINATA).
- Le decisioni prodotto maggio elencate in `ANALISI` §5.1–5.2 (crema, XOR, tenant_features…) **non** sono riprese come nuove righe qui: sono secondarie che puntano a report A*; handoff a A2–A3 / S1.

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| G3-A01 | M→A | DIRETTA | Impone formato spiegazioni (schema + semplice + chi-fa-cosa) | accettata | `Metodo` intero |
| G3-A02 | M→A | DIRETTA | Vieta sezione rischi automatica; chiede stop+domanda | accettata | `Metodo` L94-98 |
| G3-A03 | M→A | DIRETTA | Didattica off-by-default; solo su richiesta | accettata | `Metodo` L124-128 |
| G3-A04 | M→A | DIRETTA | Rimuove META_SKILL e analisi da skill ufficiali | accettata | `ANALISI` §12 L234-236 |
| G3-A05 | M→A | DIRETTA | Regola: rifiuta `al-ritrovo-*` in file nuovi | accettata | `UI_REWRITE` L71 |
| G3-A06 | A→M | DIRETTA | ANALISI espone gap Metodo vs COMUNICAZIONE ufficiale | parziale | `ANALISI` §6.2 — gap dichiarato, chiusura non in G3 |
| G3-A07 | A→M | DIRETTA | CHANGELOG elenca setup manuale obbligatorio per Matteo | accettata | `CHANGELOG` §5 |
| G3-A08 | A→M | DIRETTA | Segnala `send-email` mancante (prenotazioni ok, no mail) | accettata | `EDGE_FUNCTIONS` / `CHANGELOG` |
| G3-A09 | M↔M | DEDOTTA | Tema: early blu/indaco (Storico) vs crema Prenota (maggio in ANALISI) | ignota | tensione D18 vs ANALISI §5.1 — da S3/S4 |
| G3-A10 | M→A | DIRETTA | E2E: un MCP per corsia; stop se isolamento non garantito | accettata | `LANCIO_AMBIENTE` L34-39 |

---

## Sezione 3 — Skill signals

| Skill | Livello provvisorio | Prova in G3 | Contro-evidenza cercata |
|-------|---------------------|-------------|-------------------------|
| explanation-schema / spiegamelo-semplice | **L4** (ha codificato la regola in file riusabile) | G3-D01–D07, G3-A01–A03 | Contro: `ANALISI` §6.2 — Metodo ancora in `_lavoro`, non fuso in skill ufficiale COMUNICAZIONE → regola privata più che sistema globale |
| role-split / product-ownership | **L3** | G3-D02, D08, D13 | Contro: CHANGELOG «Richiede setup di Matteo» = ancora dipendenza operativa da checklist agenti |
| anti-meta-creep / doc-hygiene | **L3** | G3-D10, G3-A04 | Contro: file `ANALISI` ha doppia estensione `.md.md` (segno di frettolosità); gap skill ufficiale resta aperto |
| pwa-update-policy | **L2** | G3-D14–D17 | Contro: rischio «app aperta molte ore» dichiarato nel piano stesso (L47-48); esito implementazione → A*/J1 |
| ui-lock-zones / token-first | **L2** | G3-D23–D27 | Contro: Chi spesso INCERTO; checklist pre-PR UI non evidenza di esecuzione in questo perimetro |
| parallel-e2e-lanes / e2e-ui-only | **L2–L3** | G3-D36–D39, artefatti 107 file | Contro: credenziali in chiaro sotto e2e-s4 (path only; vedi §4); isolamento può fallire → fallback a 2 |
| test-stack / manual-qa-plan | **L1** | G3-D32–D34 | Contro: MANUAL_TEST_PLAN tutto ☐; numeri Vitest «29» nello Storico sono del periodo early (oggi diversi) |
| dual-supabase / env-safety | **L1–L2** | G3-D30, D39 | Contro: prova di esercizio → H*/J1; qui solo documentazione |

> **Regola L3/L4:** explanation-schema dichiarata L4 solo perché esiste un file di regola riusabile firmato in prima persona; la contro-evidenza (non ancora in skill ufficiale) è dichiarata sopra. Se S3/S5 richiedono «codificata *nel sistema ufficiale*», scende a L3.

---

## Sezione 4 — Contro-evidenze

1. **Regola di formazione scritta ma non ancora ufficiale:** `Metodo_spiegazioni_*` è più ricco di `COMUNICAZIONE_UTENTE_SKILL` (`ANALISI` §6.2). Matteo sa *come* vuole essere spiegato; il sistema skill pubblico non lo ha assorbito del tutto al 28-05.
2. **Rimozione meta vs bisogno di meta:** il 28-05 toglie META_SKILL dalle skill ufficiali (G3-D10) — scelta di igiene — ma lascia l’analisi solo in `_lavoro`: rischio che gli agenti futuri non la vedano (Glob workspace spesso non vede `_lavoro`).
3. **Storico early vs prodotto maggio:** palette Blu/Indaco (CHANGELOG aprile) vs decisioni crema `#faf7f1` / warm pubblici (ANALISI maggio) → evoluzione di brand non dichiarata come «cambio idea» nello Storico.
4. **Checklist morte:** `MANUAL_TEST_PLAN` è interamente non spuntato; `send-email` dichiarato mancante — debito noto, non chiuso in questo corpus.
5. **Artefatti e2e con credenziali:** sotto `e2e-s4/` esistono file nome-`creds` / `.env` (path only, **contenuto non letto né citato**). Segnale di processo: collaudo parallelo potente, igiene segreti debole se quegli artefatti restano su disco.
6. **Attribuzione debole sullo Storico:** molta architettura/UI/testing early è documentazione agente senza firma di scelta Matteo → non usare G3-D18–D35 come prova L3+ senza incrocio H/A.

---

## Sezione 5 — Copertura dichiarata

| Voce | N | Note |
|------|---|------|
| File md nel perimetro | **13** | Storico 8 + Supporto 3 + e2e-s4 2 (Shell `Get-ChildItem -Filter *.md`) |
| File md aperti (scavo) | **13** | 100% |
| File totali `e2e-s4/` | **107** | conteggiati; **non** aperti tutti (ordine prompt) |
| Di cui aperti in e2e-s4 | **2 md** | `LANCIO_AMBIENTE.md`, `corsia-D/7-3-snapshot.md` (dump accessibility tree = artefatto macchina) |
| Artefatti e2e per tipo | 92 `.png` · 4 `.gitkeep` · 3 `.json` · 2 `.yml` · 2 `.txt` · 1 `.env` · 1 `.pdf` · 2 `.md` | cartelle: corsia-A 9, B 16, C 30, D 24, reprova-B 4, reprova-D 23 |
| File illeggibili/saltati | **105** non-md in e2e-s4 | motivo: output macchina; **3** path credenziali/env **non aperti** (sensibilità) |
| % copertura md perimetro | **100%** | |

---

## Sezione 6 — Lacune e handoff

| Lacuna | Serve a |
|--------|---------|
| Se/quando `Metodo_spiegazioni` è confluito (in tutto o in parte) in COMUNICAZIONE / user rules / «spiegamelo semplice» del vocabolario | **M1**, **S3**, **S5** |
| Esito reale implementazione PWA update-on-open (codice + test) | **A3** (28-05), **J1** |
| Tema indaco early vs crema/warm maggio: quando e perché | **H1–H2**, **S4** |
| Decisioni prodotto maggio citate in ANALISI §5 (XOR, tenant_features, striscia…) — non riestratte qui | **A2–A3**, **S1** |
| Chi ha originato UI_REWRITE / alfabeto (agente vs Matteo) | **H1** (08-05 circa), **I1** |
| Report consolidamento E2E S4 e pass/fail per corsia | **A11** (`02-08-26/E2E-Report/`), **J1** |
| Contenuto Scuola/G1 vs questo Metodo (overlap formazione) | **G1** già fatto — incrocio in **S5** |
| Igiene credenziali in `e2e-s4/` (delete? gitignore già ok) | operativo umano; non mining |

---

## Sezione 7 — Chiusura verso Matteo

Qui si vede soprattutto **come vuoi che l’agente ti parli**: non lezioni, ma problema → pezzo dell’app → flusso prima/dopo → effetto per il ristoratore, e «chi fa cosa» quando chiedi la versione semplice.
Hai anche deciso di **tenere questa analisi fuori dalle skill ufficiali** (un solo file nel tuo spazio di lavoro), e di aggiornare l’app admin **all’apertura** senza interrompere Mario a metà lavoro.
Nello Storico restano i primi manuali di architettura e test; in e2e-s4 le foto delle quattro corsie di collaudo parallelo di agosto — prove di processo, non di nuove scelte di prodotto.
