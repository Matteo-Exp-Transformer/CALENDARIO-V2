# F1 — FREEDOM Trading (secondo tentativo trading)

> **Ondata:** F1 · **Data:** 06-08-26 · **Regime:** rastrello · **Peso fonti:** 3 (docs/report agente; citazioni «utente» = owner)
> **Perimetro:** `docs/Archives/Trading agent analysy/` — **85 file `.md`** (84 sotto `docs/` + 1 `CLAUDE.md` root; allineato a P0)
> **Focus prompt:** `skill-system-trading-platform` + `CONTESTO_PRODOTTO` — quanto del metodo CalendarBackup è riportato qui; semplificato o appesantito; frecce di trasferimento per S3.
> **Attribuzione:** `CONTESTO_PRODOTTO.md` §7 nomina esplicitamente *«Team: Matteo (sviluppo…) · Cristiano (socio…)»*. Dove il testo dice solo «utente» / «decisione utente» → `Chi = MATTEO` come owner, con nota *nome assente*. Nessuna stringa «CalendarBackup» nel perimetro: il trasferimento CB→FREEDOM è **isomorfismo di scaffold**, non citazione esplicita.
> **Date:** `gg-mm-aa` come nei file (`01-07-26` = 1 luglio 2026). Mtime cartella ~03–05-07-26 (P0); contenuti datati 30-06 → 05-07-26.
> **Sensibilità:** Vendita/legale → path + sintesi; niente testi contrattuali né cifre che identifichino clienti.

---

## Sezione 1 — Decisioni

### Blocco A — CONTESTO_PRODOTTO: LOCK e metodo (alta densità)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| F1-D01 | 30-06-26 | PRODOTTO | Motore AI = Gemini multimodale | MATTEO | SCELTA | `docs/CONTESTO_PRODOTTO.md` §2 L1 | «Motore AI · Google Gemini, modello con vista» | product-ai-stack |
| F1-D02 | 30-06-26 | PRODOTTO | Account/dati = Supabase + RLS | MATTEO | SCELTA | stesso §2 L2 | «Supabase (Postgres + Auth; Storage non usato)» | scale-ready-stack |
| F1-D03 | 30-06-26 | PRODOTTO | Nome app FREEDOM TRADING SYSTEM | MATTEO | ORIGINATA | stesso §2 L3 | «FREEDOM TRADING SYSTEM (repo freedom-trading-system)» | product-naming |
| F1-D04 | 30-06-26 | PRODOTTO | Demo minimal + estetica beta | MATTEO | SCELTA | stesso §2 L4 | «Minimal + estetica beta» | product-scoping |
| F1-D05 | 30-06-26 | SICUREZZA | Account demo su invito, no signup | MATTEO | SCELTA | stesso §2 L11 | «Su invito / creati a mano (no registrazione aperta)» | invite-only-demo |
| F1-D06 | 30-06-26 | AI-METODO | Kit v3 autorità; scope intraday/scalping | MATTEO | SCELTA | stesso §2 L13 | «Trade Analysis Agent Kit v3 è l'autorità» | kit-authority |
| F1-D07 | 30-06-26 | FLUSSO | Avvio analisi = form guidato + slot TF | MATTEO | SCELTA | stesso §2 L14 | «Form guidato che genera il primo prompt» | guided-analysis-start |
| F1-D08 | 01-07-26 | IMPOSTAZIONI | Modello AI admin-only; utente tema+pwd | MATTEO | SCELTA | stesso §2 L17 | «il modello AI è per-account e lo assegna solo l'admin» | admin-assigns-model |
| F1-D09 | 01-07-26 | PRODOTTO | Default Gemini Flash (costo/qualità) | MATTEO | SCELTA | stesso §2 L18 | «Flash scelto per il miglior costo a qualità adeguata» | cost-quality-tradeoff |
| F1-D10 | 01-07-26 | UI-UX | Estetica dark slate + accento ciano | MATTEO | SCELTA | stesso §2 L19 | «Dark su slate + accento ciano, sobrio» | brand-visual-system |
| F1-D11 | 01-07-26 | PRODOTTO | Max 5 follow-up per chat | MATTEO | SCELTA | stesso §2 L20 | «Prima analisi + massimo 5 follow-up per chat» | conversation-limits |
| F1-D12 | 03-07-26 | PRODOTTO | Home Ecosistema = una community | MATTEO | SCELTA | stesso §2 L23 | «Una community: contenuti creator comuni…» | community-home |
| F1-D13 | 04-07-26 | PRODOTTO | Modello a 3 branch vendibili | MATTEO | ORIGINATA | stesso §2 L24; masterplan 01 | «Tre versioni di prodotto, base identica» | three-branch-sku |
| F1-D14 | 30-06-26 | AI-METODO | Due skill system disambiguati | CONGIUNTA | ORIGINATA | stesso §4 | «Skill System Trading Platform» ≠ «Kit Aware Trader» | dual-skill-disambiguation |
| F1-D15 | 30-06-26 | AI-METODO | Prima mappa (context), poi codice | CONGIUNTA | SCELTA | stesso §5 | «Prima si definisce e mappa, poi si esegue» | context-before-code |
| F1-D16 | ? | PROCESSO | Scale-ready, non scale-features | MATTEO | ORIGINATA | stesso §6.1 | «scale-ready, non scale-features» | scale-ready-not-features |
| F1-D17 | 30-06-26 | FLUSSO | Account reali (non demo senza login) | MATTEO | CORRETTIVA | stesso §10 D3 | «utente vuole profilo+password+storico» | auth-real-accounts |

> **Nota Chi:** L1–L24 sono tabella «Decisioni LOCKED» del CONTESTO (peso 3). Nome «Matteo» non compare riga per riga; §7 e §6 («richiesti dall'utente») ancorano l'owner. Se H5/transcript smentiscono → rivedere autonomia.

### Blocco B — Skill system / comunicazione (trasferimento metodo)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| F1-D18 | 01-07-26 | AI-METODO | «lavoro ok» / «report finale» Liv.1 | MATTEO | APPROVATA | `…/comunicazione/VOCABOLARIO.md` Sez.A | «protocollo di chiusura approvati dall'utente» | closure-two-signals |
| F1-D19 | 02-07-26 | AI-METODO | Context aggiornato nello stesso task | AGENTE | CORRETTIVA | `…/ERRORI_PROCESSO.md` P1 | «context aggiornato nello stesso task… regola corretta 02-07-26» | context-same-task |
| F1-D20 | 02-07-26 | AI-METODO | Hook fine-sessione = template non installati | CONGIUNTA | DELEGATA | `…/EVOLUZIONE_SKILLS.md` §1–3 | «hook sotto hooks/ sono template non installati» | markdown-vs-enforcement |
| F1-D21 | 29-05-26 | AI-METODO | Anteprima HTML UI candidata, non attiva | MATTEO | SCELTA | `…/PROPOSTE.md` | «richiesta utente 2026-05-29 (sessione skill system v0)» | ui-preview-proposal |
| F1-D22 | ? | AI-METODO | Feature chiude solo con 🟢 utente | MATTEO | ORIGINATA | `…/Concorrenza/METODOLOGIA_SEDUTE.md` §0 | «L'agente propone e disegna, non decide» | feature-green-gate |
| F1-D23 | 05-07-26 | AI-METODO | «Integra tutto, poi semmai si toglie» | MATTEO | CORRETTIVA | `…/masterplan/01_MASTERPLAN…` §3 | «Integrare tutto il possibile, poi semmai si toglie» | integrate-all-then-cut |

### Blocco C — Owner decisions in Follow-up / Feature / Sicurezza

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| F1-D24 | 04-07-26 | SICUREZZA | Repo GitHub → Private (kit esposto) | MATTEO | CORRETTIVA | `…/sessioni/FOLLOW_UP.md` FU-030 | «Matteo-Exp-Transformer/Trading-Platform… Private» | secret-kit-visibility |
| F1-D25 | 03-07-26 | SICUREZZA | Reset password admin ANNULLATO | MATTEO | CORRETTIVA | stesso FU-032 | «l'admin NON modifica le password degli utenti» | admin-no-password-reset |
| F1-D26 | 03-07-26 | SICUREZZA | Gap ban JWT accettato per demo | MATTEO | SCELTA | stesso FU-041 | «decisione utente di accettarlo per la demo» | accept-demo-risk |
| F1-D27 | 03-07-26 | PRODOTTO | Vista uso-per-modello approssimata | MATTEO | APPROVATA | stesso FU-040 | «decisione utente: creare la vista approssimata» | metrics-approximation |
| F1-D28 | 03-07-26 | COMPLIANCE | Collaudo L0 rimandato post-demo | MATTEO | SCELTA | stesso FU-038 | «rimandato a dopo la demo per richiesta utente» | defer-l0-collaudo |
| F1-D29 | 04-07-26 | UI-UX | FEAT-004 launcher 8 fasi approvato | MATTEO | APPROVATA | `…/REGISTRO_FEATURE.md` FEAT-004 | «Approvata 2026-07-04» | prompt-launcher |
| F1-D30 | 04-07-26 | UI-UX | FEAT-005 preset stile (no capitale) | MATTEO | APPROVATA | stesso FEAT-005 | «Approvata 2026-07-04 (parte stile, senza capitale)» | smart-preset-style |
| F1-D31 | 04-07-26 | COMPLIANCE | FEAT-003 UI ok ma 🔴 legale+kit | MATTEO | SCELTA | stesso FEAT-003 | «UI approvata… bloccata da… via libera legale» | legal-kit-gate |
| F1-D32 | 05-07-26 | UI-UX | FEAT-007 banner generico/personalizzato | MATTEO | APPROVATA | stesso FEAT-007 | «decisione utente "integra tutto"» | personalization-banner |
| F1-D33 | 01-07-26 | UI-UX | MarketStatus: solo mercati, no orologio | MATTEO | SCELTA | FOLLOW_UP FU-018 | «Orologio live NON incluso (utente: solo stato mercati)» | market-status-scope |
| F1-D34 | 03-07-26 | PRODOTTO | Emendamento: DELETE solo bozze | CONGIUNTA | CORRETTIVA | FU-035; MASTERPLAN_HOME | «eliminazione fisica ora ammessa solo per le bozze» | draft-delete-only |
| F1-D35 | 04-07-26 | UI-UX | Picker sostituzione pin saturo | MATTEO | ORIGINATA | FU-045 | «richiesta utente 2026-07-04» | pin-replace-ux |

### Blocco D — Vendita / legale / demo (path + sintesi; nome Matteo esplicito)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| F1-D36 | 07-26 | VENDITA | Canone e baseline analisi (parziali) | MATTEO | SCELTA | `…/SINTESI_VENDITA_v0_INTERVISTA.md` §0 | «Decisioni già parziali (Matteo)» | commercial-baseline |
| F1-D37 | 07-26 | LEGALE | Tesi: infrastruttura neutra L0 | MATTEO | ORIGINATA | `…/LEGALE_E_LICENZA_IN_CHIARO.md` header | «Matteo Cavallaro (Fornitore)» | compliance-neutral-infra |
| F1-D38 | 04-07-26 | TESTING | Checklist demo: collaudo manuale Matteo | MATTEO | ORIGINATA | `…/PIANO_DEMO_ESECUZIONE_FABLE.md` §6 | «la esegue Matteo a lavoro finito» | owner-manual-qa |
| F1-D39 | 04-07-26 | PROCESSO | Decisioni bloccanti D1–D3 prima di Fable | MATTEO | SCELTA | stesso §0 | «Matteo + Senior chiudono le Decisioni bloccanti» | human-gate-before-agent |
| F1-D40 | ? | COMPLIANCE | Kit pubblico ~2 sett.: decisione aperta | MATTEO | INCERTO | masterplan 03 / FU-030 coda | valutazione «kit compromesso» rimandata | post-exposure-risk |

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| F1-A01 | M→A | DIRETTA | Annulla reset password admin (FU-032) | accettata | `FOLLOW_UP.md` FU-032 |
| F1-A02 | M→A | DIRETTA | Accetta gap ban JWT per demo (FU-041) | accettata | stesso FU-041 |
| F1-A03 | M→A | DIRETTA | Repo Private dopo kit esposto (FU-030) | accettata | stesso FU-030 |
| F1-A04 | M→A | DIRETTA | Approva FEAT-004/005; blocca FEAT-003 su legale | accettata | `REGISTRO_FEATURE.md` |
| F1-A05 | M→A | DIRETTA | «Integra tutto» vs gate 🟢-per-feature | accettata | masterplan 01 §3 vs METODOLOGIA §0 |
| F1-A06 | M→A | DIRETTA | No orologio su MarketStatus | accettata | FU-018 |
| F1-A07 | M→A | DIRETTA | Collaudo L0 post-demo (defer) | accettata | FU-038 |
| F1-A08 | A→M | DIRETTA | Meta: allinea context nello stesso task (P1) | accettata | `ERRORI_PROCESSO.md` P1 |
| F1-A09 | A→M | DIRETTA | Audit: hook solo template; P2–P4 aperti | parziale | `EVOLUZIONE_SKILLS` + ERRORI |
| F1-A10 | A→M | DIRETTA | Senior non decide al posto di Matteo (vendita) | accettata | `SINTESI_VENDITA…` §0 |
| F1-A11 | A→M | DEDOTTA | Bug «Canali vuoti» = Exposed tables; utente corregge dashboard | accettata | FU-039 «verificato… dall'utente» |
| F1-A12 | M↔M | DEDOTTA | Team Matteo (dev) + Cristiano (skill/ops) | ignota | `CONTESTO` §7 |
| F1-A13 | M→A | DIRETTA | Account reali vs «demo senza login» (D3) | accettata | `CONTESTO` §10 D3 |

---

## Sezione 3 — Skill signals

| Skill | Livello provvisorio | Prova in F1 | Nota |
|-------|---------------------|-------------|------|
| `context-before-code` | **L2** | F1-D15 | Schema Senior→intervista→context→codice (isomorfo CB) |
| `closure-two-signals` | **L2** (L4 candidate se M1 conferma origine CB) | F1-D18 | Solo 2 voci Liv.1; vocab quasi vuoto |
| `feature-green-gate` | **L2** poi tensione | F1-D22 vs F1-D23 | Gate 🟢 attenuato da «integra tutto» |
| `integrate-all-then-cut` | **L2–L3** | F1-D23 + F1-A05 | Owner ribalta ritmo di approvazione |
| `dual-skill-disambiguation` | **L2** | F1-D14 | Meta vs Kit Aware — più pesante di CB |
| `admin-no-password-reset` | **L3** | F1-D25 + F1-A01 | Corregge proposta console |
| `secret-kit-visibility` | **L2** | F1-D24 | Agisce dopo audit agente (repo pubblico) |
| `accept-demo-risk` | **L2** | F1-D26 | Accetta rischio consapevole, non «fixa tutto» |
| `legal-kit-gate` | **L2** | F1-D31 | UI approvata ma 🔴 finché legale+kit |
| `compliance-neutral-infra` | **L1–L2** | F1-D37 | Autore esplicito; validità legale = peso 4 |
| `owner-manual-qa` | **L2** | F1-D38 | Checklist demo eseguita da lui |
| `scale-ready-not-features` | **L2** | F1-D16 | Principio prodotto dichiarato |
| `three-branch-sku` | **L2** | F1-D13 | Packaging commerciale via git branches |
| `markdown-vs-enforcement` | **L1** (sistema) | F1-D20 | Debito hooks dichiarato — più sottile di CB |
| `cost-quality-tradeoff` | **L2** | F1-D09 | Flash vs Pro dopo test grafici |

### Frecce di trasferimento CB → FREEDOM (per S3)

| Direzione | Cosa | Evidenza FREEDOM | Ipotesi vs CB (peso 3–4) |
|-----------|------|------------------|-------------------------|
| **COPIED** | Bussola + profili Esecuzione/Verifica/Meta + anti-buco | `00_BUSSOLA_SKILL.md` | Stesso schema di `_skill-system-v0` / M1 |
| **COPIED** | VOCABOLARIO Liv.1/2/3 + OSSERVAZIONI→PROPOSTE→Meta | `comunicazione/*` | Ciclo di vita identico |
| **COPIED** | Chiusura a due segnali; CHIUSURA + CONTROVERIFICA | VOCABOLARIO; CHIUSURA_SESSIONE | Stesse parole Liv.1 |
| **COPIED** | PREPARA_PROMPT; REGOLE_ORGANIZZATIVE; ERRORI tassonomia | skill-system | Template riusato |
| **COPIED** | Schema intervista→context→piano→esecutore | `CONTESTO` §5 | Come CB |
| **SIMPLIFIED** | Vocabolario quasi vuoto (2 voci; Sez.B template) | `VOCABOLARIO.md` | CB ha decine di voci (M1) |
| **SIMPLIFIED** | OSSERVAZIONI solo placeholder | `OSSERVAZIONI.md` | Nessun dato grezzo su di lui |
| **SIMPLIFIED** | Hook `stop` / guard-PROD **non installati** | EVOLUZIONE §3; hooks/README | CB ha enforcement attivo (M1) |
| **SIMPLIFIED** | Didattica / metriche sessione **non attive** | EVOLUZIONE §3–5 | CB più maturo |
| **HEAVIER** | **Doppio** skill system (meta + Kit Aware runtime) | `CONTESTO` §4 | CB ha un meta-system; qui anche kit prodotto LOCK |
| **HEAVIER** | L0 / anti buy-sell / TAIL_L0 come LOCK prodotto | kit; masterplan 03; REGISTRO | Compliance finanziaria assente in CB ristorazione |
| **HEAVIER** | Metodologia Concorrenza A–E + REGISTRO_FEATURE | `METODOLOGIA_SEDUTE.md` | Processo competitor→feature formalizzato |
| **HEAVIER** | Masterplan legale + vendita + 3 branch SKU | masterplan 01–03; L24 | Packaging più esplicito |
| **HEAVIER** | Console + community editoriale (eccezione owner-only) | L23; FU-035 | Parallelo Console CB (M2) ma su trading |

> **Sintesi freccia S3:** FREEDOM = **scaffold CB copiato** + **vocab/enforcement alleggeriti** + **strato compliance/kit/concorrenza più pesante** del prodotto ristorazione. Nessuna frase «portato da CalendarBackup» nel corpus — solo struttura.

---

## Sezione 4 — Contro-evidenze

1. **Tensione metodo non risolta:** `METODOLOGIA_SEDUTE` LOCK «feature chiude solo con 🟢» **vs** masterplan 01 §3 (05-07-26) «integra tutto… senza attendere seduta per ciascuna» (con 3 eccezioni legale/kit/testi). Contro-evidenza di coerenza di processo; prova che lui **cambia** le regole di agency quando il ritmo di demo lo impone. Fonti: METODOLOGIA §0; masterplan 01 §3.
2. **Kit esposto ~2 settimane** (repo pubblico) poi Private: fallimento di governance segreti prima dell'audit; decisione «kit compromesso» ancora aperta. Contro-evidenza per `secret-kit-visibility` L3+. Fonte: FU-030.
3. **FU-032 annullato:** proposta console (reset password) ribaltata — prova L3 su perimetro admin, ma anche che l'agente aveva portato scope non voluto.
4. **FU-041 rischio accettato:** non tutto viene «sistemato»; a volte sceglie di vivere col gap per la demo. Contro-evidenza di perfezionismo assoluto.
5. **P1–P4 (audit 02-07-26):** context «da costruire»; test happy-path; schema solo remoto; template scambiati per regole — debiti sistemici dichiarati. Contro-evidenza di maturità dello skill system FREEDOM rispetto a CB (hooks/vocab).
6. **OSSERVAZIONI vuote:** nessuno sta ancora misurando le sue parole su questo progetto → ritratto metodologico qui è quasi solo da CONTESTO/FU/REGISTRO, non da M-VOCE.
7. **Signup ancora aperto (FU-026):** decisione L11 «no registrazione» non chiusa operativamente sul pannello Auth — gap tra LOCK scritto e azione.
8. **Cercata agency A→M «Matteo fuori strada sul prodotto» DIRETTA:** nel perimetro prevalgono correzioni sue agli agenti e audit Meta su drift documentale. La resa «ah giusto» su trading va cercata in **H5** (transcript Trade-Analyst / Trading-Platform), non qui.

---

## Sezione 5 — Copertura dichiarata

| Voce | N | Note |
|------|---|------|
| File nel perimetro (P0 / piano) | **85** | solo `.md` sotto `Trading agent analysy/` |
| File aperti | **85 (100%)** | ogni md aperto (metadati + body; estrazione rastrello) |
| File illeggibili | **0** | — |
| Fuori perimetro md (dichiarati, non contati nei 85) | **187** | 166 `.png` + 9 `.template` + 6 `.html` + csv/json/docx/pdf/txt — screenshot concorrenza e artefatti vendita; non md |

**Ripartizione densità segnale:**

| Sotto-area | N md | Densità |
|------------|------|---------|
| `skill-system-trading-platform/` (comunicazione, context, aree, sessioni, root skill) | **36** | **ALTA** su comunicazione/HANDOFF/FOLLOW_UP/BUSSOLA; context = mappe prodotto (rastrello) |
| `CONTESTO_PRODOTTO.md` + `PIANO_LAVORO.md` + `CLAUDE.md` | **3** | **ALTA** — LOCK e schema |
| `masterplan/` | **6** | **ALTA** su 01/03/Home; GTM/scala = media |
| `Concorrenza/` (schede + registro + metodo) | **16** | **ALTA** su METODOLOGIA/REGISTRO; schede competitor = lezioni prodotto |
| `Vendita APP/` | **20** | **MEDIA-ALTA** — nome Matteo esplicito; path+sintesi |
| `archivio/` + `dati-mercati/` | **4** | **BASSA-MEDIA** — L0 archivio; piani console |

---

## Sezione 6 — Lacune e handoff

| Lacuna | Serve a |
|--------|---------|
| Nessuna citazione esplicita «CalendarBackup» / «portato da CB» | S3: freccia resta **strutturale**; H5/E* possono nominarla |
| Report `_sessioni-lavoro/` gitignored — non in questo archive | E2 / H5 / repo Trading-Platform vivo |
| M-VOCE letterale assente (solo «utente» / report) | **H5** (Trade-Analyst, Trading-Platform, BHM parallelo) |
| Confronto E1 (trading v.0) vs F1 (FREEDOM) non fatto qui | E1/E2 + S3 timeline trading |
| Tension 🟢-per-feature vs «integra tutto» — quale vince in pratica dopo 05-07? | H5 + sessioni post-05-07 se esistono |
| Decisione «kit compromesso» ancora ⬜ | masterplan 03 / J1 se c’è commit privacy |
| Parallelismo Console CB (M2) ↔ Console FREEDOM | S3 / M2 già fatto |
| Pricing/contratti: solo sintesi | G1 legale CB; non duplicare cifre |

---

## Sezione 7 — Chiusura verso Matteo

Su FREEDOM hai ripreso lo stesso schema di lavoro degli agenti che usi su CalendarBackup (bussola, vocabolario, «prima si mappa poi si scrive codice»), ma qui lo hai tenuto più leggero: poche parole di comando, niente ganci automatici di fine chat, osservazioni ancora vuote.

In compenso hai aggiunto pezzi più pesanti tipici del trading: un secondo «cervello» (il metodo Aware Trader che non deve mai finire sul telefono del cliente), regole anti-«compra/vendi», analisi competitor con semaforo di approvazione, e tre versioni di prodotto su branch diversi.

Il segnale più netto su di te è quando ribalti le proposte: niente reset password dalla console, repo reso privato dopo che il metodo era finito in chiaro su GitHub, e il passaggio da «ogni feature solo se dici sì» a «integra tutto il possibile, poi togli» — con il freno duro solo su legale e kit.
