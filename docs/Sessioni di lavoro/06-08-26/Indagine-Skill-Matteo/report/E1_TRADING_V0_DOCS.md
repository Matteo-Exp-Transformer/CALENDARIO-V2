# E1 — Trading v.0: docs

> **Ondata:** E1 · **Data:** 06-08-26 · **Regime:** rastrello · **Peso fonti:** 3 (docs/report agente; PDR firma «Matteo + assistente»)
> **Perimetro:** `docs/Archives/trading agent analyst-v.0/docs/` — **97 file `.md`**
> **Focus prompt:** dominio diverso (finanza + educazione + compliance); trasferibilità del metodo; PDR / «niente buy-sell»; pricing; concorrenza.
> **Nota attribuzione:** poche citazioni verbatim M-VOCE nei docs. Forte: `Decisioni prese.md`, PDR «Autore: Matteo + assistente», Planv2 «confermate con utente», report Meta `Decisioni prese (Matteo)` + Q1. Dove c’è solo elenco «Decisioni prese» senza nome → spesso `CONGIUNTA` o `INCERTO`.
> **Sensibilità:** aperti `TEST-CREDENTIALS.local.md` e `API KEY Modelli.md` — solo path + ruolo; **nessun segreto** in questo report.
> **Date:** da nomi cartella/file e intestazioni (`gg-mm-aa`). Finestra tipica **20-05-26 → 06-06-26**.

---

## Sezione 1 — Decisioni

### Blocco A — Posizionamento e compliance «niente buy/sell» (focus)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| E1-D01 | 20-05-26 | COMPLIANCE | Mai indicazioni operative compra/vendi | CONGIUNTA | ORIGINATA | `Struttura/PDR v1.0.md` L20, L46-47; `Archivio/Decisioni prese.md` L41 | «senza mai dirgli cosa comprare o vendere» | no-operational-signals |
| E1-D02 | 20-05-26 | VENDITA | Posizionamento = contrario dei segnali Telegram | CONGIUNTA | ORIGINATA | `PDR v1.0.md` L24; `Customer Profile.md` L13 | «È il contrario dei "segnali" Telegram» | anti-signal-positioning |
| E1-D03 | 20-05-26 | COMPLIANCE | Severità compliance unica su tutti i tier | CONGIUNTA | SCELTA | `20-05-26/agent-product-architecture.md` L58-59 | «rischio… se un Pro+ riceve "compra X" è uguale al Base» | compliance-uniform |
| E1-D04 | 20-05-26 | LEGALE | Disclaimer: non è consulenza finanziaria | CONGIUNTA | SCELTA | `PDR v1.0.md` L112, L249 ca. | «non è consulenza finanziaria» | legal-disclaimer |
| E1-D05 | 22-05-26 | AI-METODO | Guardrail Tutor descrittivo (no frase letterale) | CONGIUNTA | CORRETTIVA | `Decisioni prese.md` L11-12; `PDR` §8.3 | «non dare comandi, proponi 1-2 domande tecniche» | compliance-ux |
| E1-D06 | 21-05-26 | COMPLIANCE | Post-check anti compra/vendi resta server-side | MATTEO | APPROVATA | `Plan/Planv2-…userpay….md` L44 | «Post-check anti compra/vendi: server-side» | compliance-server-gate |
| E1-D07 | 20-05-26 | PRODOTTO | Output = lettura + domanda, non segnale | CONGIUNTA | ORIGINATA | `PDR v1.0.md` L49 | «L'output non è un segnale: è una lettura strutturata» | education-not-signal |

> **Origine del vincolo:** nel `pdr-v0.1` archiviato **non** compare il divieto hard «compra/vendi» (rastrello). Il vincolo è **cristallizzato** il 20-05 nel PDR v1.0 + `Decisioni prese` pomeriggio. Kit v3 = metodo/stile; la regola di prodotto/compliance è documentata lì. Handoff a **H5** (transcript Trade-Analyst) per chi l’ha detta per primo in chat.

### Blocco B — Pricing, abbonamenti, concorrenza

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| E1-D08 | 20-05-26 | VENDITA | Pricing Base 9€ / Pro 19€ / Pro+ 49€ | CONGIUNTA | SCELTA | `Decisioni prese.md` L42; `PDR` §9 | «Base 9€ / Pro 19€ / Pro+ 49€» | saas-pricing |
| E1-D09 | 20-05-26 | VENDITA | Free trial 3 chat totali | CONGIUNTA | SCELTA | `Decisioni prese.md` L42 | «Free trial 3 chat» | freemium-gate |
| E1-D10 | 20-05-26 | VENDITA | PayPal manuale v0; Stripe più avanti | CONGIUNTA | SCELTA | `PDR v1.0.md` L26, L164 | «PayPal manuale… Stripe in v1.1» | payment-phasing |
| E1-D11 | 20-05-26 | PRODOTTO | Stessa qualità AI; differenzia sul volume | CONGIUNTA | SCELTA | `agent-product-architecture.md` L62-63 | «qualità uniforme, volume differenziato» | tier-by-volume |
| E1-D12 | 20-05-26 | VENDITA | Si vende tutor/metodo, non segnali | INCERTO | SCELTA | `Orientamento/08-modello-vendita….md` L5-11 | «Il prodotto non vende segnali di trading» | offer-design |
| E1-D13 | 20-05-26 | VENDITA | Concorrenza: ChatGPT custom GPT | INCERTO | SCELTA | `PDR v1.0.md` L601 | «Concorrenza (ChatGPT custom GPT)» | competitive-framing |
| E1-D14 | 20-05-26 | PRODOTTO | Target Marco (retail) + Giulia (educatrice) | CONGIUNTA | SCELTA | `Customer Profile.md` L11-13 | «trader retail… e l'educatore» | dual-persona |
| E1-D15 | 20-05-26 | PRODOTTO | Skill prodotto come entità sbloccabili | CONGIUNTA | ORIGINATA | `agent-product-architecture.md` L55-56 | «Skill prodotto come entità sbloccabili» | skill-as-product |
| E1-D16 | 20-05-26 | COMPLIANCE | Pro+ legge chat studenti solo con consenso | CONGIUNTA | ORIGINATA | `Decisioni prese.md` L47 | «solo con consenso esplicito dello studente» | consent-governance |

### Blocco C — Architettura costi, modelli, Puter (svolta e tensione)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| E1-D17 | 20-05-26 | SICUREZZA | v0 senza provider dati live/broker | MATTEO | ORIGINATA | `Decisioni prese.md` L57-58; roadmap L9 | «non utilizzerà provider esterni di dati» | cost-scope-control |
| E1-D18 | 20-05-26 | SICUREZZA | Screenshot eliminati; in DB solo estratto | CONGIUNTA | ORIGINATA | `Decisioni prese.md` L62; `PDR` §2.4 | «screenshot può essere eliminato… non l'immagine» | privacy-by-design |
| E1-D19 | 20-05-26 | AI-METODO | Gemini Flash default tutti i tier (v1.0) | CONGIUNTA | SCELTA | `Decisioni prese.md` L43 | «Gemini 2.5 Flash come default… TUTTI i tier» | model-default |
| E1-D20 | 21-05-26 | TESTING | Prima test economici DeepSeek/Qwen vs Gemini | INCERTO | SCELTA | `Decisioni-Prese-roadmap-2026-05-21.md` L11-17 | «testando modelli economici prima…» | model-ladder |
| E1-D21 | 21-05-26 | TESTING | NotebookLM = benchmark qualitativo | INCERTO | SCELTA | stesso L19-26 | «NotebookLM viene usato come riferimento» | qualitative-benchmark |
| E1-D22 | 21-05-26 | AI-METODO | Produzione → Puter.js user-pays | MATTEO | APPROVATA | `Planv2-….md` L39-42 | «Produzione: Puter.js client-only… confermate con utente» | user-pays-architecture |
| E1-D23 | 21-05-26 | AI-METODO | Test modelli via OpenRouter unico | MATTEO | APPROVATA | stesso L41 | «Test platform: OpenRouter come piattaforma unica» | openrouter-testbed |
| E1-D24 | 21-05-26 | FLUSSO | Due carte (Stripe + Puter) in onboarding | MATTEO | APPROVATA | stesso L43 | «Due inserimenti carta… onboarding lo spiega» | dual-billing-ux |
| E1-D25 | 06-06-26 | VENDITA | Non pianificare tier su modelli `:free` OR | INCERTO | SCELTA | `Costi Prodotto.md` L78 | «Non pianificare tier utente su modelli `:free`» | prod-cost-realism |
| E1-D26 | ? | AI-METODO | Architettura AI SSOT ancora da decidere | INCERTO | — | `Orientamento/04-gap….md` L31-41 | «Decisione richiesta: … Gemini… Puter…» | architecture-ssot-gap |

> **Tensione documentata:** PDR v1.0 = Gemini server-side; Planv2 + `Nuova idea struttura userpay.md` = Puter user-pays; codice reale (Orientamento/02) = Gemini runtime, Puter **non** implementato. Contro-evidenza forte in §4.

### Blocco D — UX tutor, form, limiti chat

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| E1-D27 | 22-05-26 | UI-UX | Stile B «Analista al tuo fianco» | CONGIUNTA | CORRETTIVA | `Decisioni prese.md` L9; tutor-fixtures | «Stile B… sostituisce vecchio §7.1» | conversational-tutor |
| E1-D28 | 22-05-26 | TESTING | Vision Reader fuori dal compliance Tutor | CONGIUNTA | CORRETTIVA | `Decisioni prese.md` L13 | «Vision Reader esce dal compliance gate Tutor» | role-split-gates |
| E1-D29 | 22-05-26 | SICUREZZA | PreChatForm strutturato (anti injection) | CONGIUNTA | CORRETTIVA | `Decisioni prese.md` L15-16 | «campi liberi… vettore di prompt injection» | structured-intake |
| E1-D30 | 22-05-26 | IMPOSTAZIONI | Max 5 screenshot/chat uniformi su tier | CONGIUNTA | SCELTA | stesso L21 | «Limite hard 5 screenshot… supersede PDR §4.2» | usage-caps |
| E1-D31 | 21-05-26 | IMPOSTAZIONI | Max 8 follow-up per chat | INCERTO | SCELTA | `Decisioni-Prese-roadmap….md` L117-124 | «limite di 8 messaggi di follow-up» | usage-caps |
| E1-D32 | 20-05-26 | FLUSSO | Pre-chat 5 campi; TF chiesto dall’agente | CONGIUNTA | SCELTA | `Decisioni prese.md` L46 | «Timeframe richiesto poi dall'agente» | guided-intake |
| E1-D33 | 20-05-26 | PRODOTTO | Usare skill Kit v3, non riscrivere | CONGIUNTA | SCELTA | `Decisioni prese.md` L49 | «già testate, niente riscrittura» | reuse-method-kit |

### Blocco E — Auth v0, metodo agenti, didattica

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| E1-D34 | 06-06-26 | SICUREZZA | v0 admin-managed: no signup pubblico | INCERTO | SCELTA | `plan-fix-auth-FU010….md` L11-15 | «nessuna registrazione pubblica» | invite-only-auth |
| E1-D35 | 06-06-26 | FLUSSO | `/` non landing «Start for free» → redirect | MATTEO | CORRETTIVA | `agent-auth-fix.md` L21; plan FU-010 | «non è più una landing… reindirizza» | auth-surface-lock |
| E1-D36 | 06-06-26 | AI-METODO | Vocabolario: meta/esecuzione/verifica/… | MATTEO | ORIGINATA | `agent-meta-vocabolario.md` L18-27 | «Approvate Liv. 1» (voci Sez. A) | command-lexicon |
| E1-D37 | 06-06-26 | AI-METODO | «semplice» scartata → «Ragioniamo» Liv.1 | MATTEO | CORRETTIVA | stesso L23; Q1 R1 | «eliminare semplice e introdurre… Ragioniamo» | command-lexicon |
| E1-D38 | 06-06-26 | AI-METODO | Sez. B vocabolario non integrata ancora | MATTEO | SCELTA | stesso L24 | «Non integrate — restano in PROPOSTE» | scope-control |
| E1-D39 | 21-05-26 | PROCESSO | Next 16 + Tailwind 3.4 (no v4 default) | INCERTO | APPROVATA | `Decisioni prese.md` L29-32 | «Tailwind 3.4 confermato (downgrade…)» | stack-pinning |
| E1-D40 | 06-06-26 | FORMAZIONE | PROFILO_SCOLASTICO scaffold, 0 lezioni | MATTEO | APPROVATA | `Didattica-agenti/PROFILO_SCOLASTICO.md` L3-5 | «nessuna lezione erogata ancora» | self-assessment-scaffold |

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| E1-A01 | M→A | DIRETTA | Scarta «semplice»; inventa «Ragioniamo» Liv.1 | accettata | `agent-meta-vocabolario.md` L23 + Q1 R1 |
| E1-A02 | M→A | DIRETTA | Sez. B vocabolario: «devo lavorarci» → PROPOSTE | accettata | stesso Q1 R1 |
| E1-A03 | M→A | DIRETTA | Anteprima HTML: solo con conferma (Liv.3) | accettata | stesso L25 |
| E1-A04 | A→M | DIRETTA | Controverifica trova FU-010 landing pubblica | accettata | `agent-auth-controverifica.md` L15; plan FU-010 |
| E1-A05 | M↔M | DEDOTTA | Gemini-all-tiers → ladder Qwen/DeepSeek → Puter user-pays | parziale | Decisioni 20-05 → roadmap 21-05 → Planv2; Puter non shippato |
| E1-A06 | A→M | DEDOTTA | 3 run compliance: frase letterale = robotica → guardrail descrittivo | accettata | `Decisioni prese.md` L11-12 |
| E1-A07 | M↔M | DEDOTTA | Stile referto 6-heading → Stile B conversazionale | accettata | `Decisioni prese.md` L9 |
| E1-A08 | A→M | DIRETTA | Gap P0.3: PDR vs Planv2 vs codice (ambiguità SSOT) | ignota | `04-gap….md` L31-41; `07-report-subagent.md` |

**Conteggio agency:** 8 (M→A 3 · A→M 3 · M↔M 2)

---

## Sezione 3 — Skill signals (provvisori)

| Skill | Livello provvisorio | Prove | Note trasferimento vs ristoranti (CB) |
|-------|---------------------|-------|----------------------------------------|
| `no-operational-signals` / compliance-first | **L2–L3*** | D01–D07, A06 | *L3 solo se H5 conferma origine M-VOCE; qui è prodotto firmato Matteo+AI |
| `anti-signal-positioning` | L2 | D02, D12–D13 | Framing mercato analogo a «cosa NON siamo» |
| `saas-pricing` / `tier-by-volume` | L2 | D08–D11 | Tier + margine AI espliciti; CB ha edition Classic/Pro |
| `cost-scope-control` | L2–L3 | D17, A05 | Screenshot-only = taglio scope costi (parallelo a scope lock CB) |
| `privacy-by-design` | L2 | D18 | Delete screenshot post-extract |
| `user-pays-architecture` | L1–L2 | D22–D24 | **Approvata ma non eseguita** → contro CE1 |
| `model-ladder` / `openrouter-testbed` | L2 | D20–D21, D23 | Protocollo test prima della scelta |
| `command-lexicon` | **L4*** | D36–D38, A01–A03 | Stesso lessico poi in CB Comunicazione-Skill; *codifica qui + riuso altrove → F1/M1 |
| `auth-surface-lock` / invite-only | L2 | D34–D35, A04 | Blindatura auth: agent trova, Matteo fa fix |
| `conversational-tutor` | L2 | D27, A07 | Correzione stile dopo smoke |
| `skill-system portability` | L2 | D33, ROADMAP skill | SKILL-0 / aree / vocabolario: stesso albero mentale di CB |
| `self-assessment-scaffold` | L0–L1 | D40 | Pagella vuota; confrontare G1 |

---

## Sezione 4 — Contro-evidenze

| ID | Cosa | Perché indebolisce | Fonte |
|----|------|--------------------|-------|
| CE1 | Puter user-pays **approvato** (D22–D24) ma **non implementato**; TOS/OAuth aperti | Decisione architetturale senza chiusura: agency L2 fragile | minireport 21-05 «Fase 2 bloccata»; Orientamento/02 |
| CE2 | PDR Gemini vs Planv2 Puter vs codice Gemini — **tre verità** | P0.3 «decisione richiesta» ancora aperta a giugno | `04-gap` L31-41 |
| CE3 | Quality check Plan 09 a lungo stub (`throw not implemented`) mentre PDR lo dichiarava | Gap doc↔runtime tipico | ROADMAP L129-133 (poi parzialmente chiuso 21-05) |
| CE4 | Happy path E2E login→analisi ancora **FU-001 aperto** al 06-06 | Prodotto demo dichiarato vs prova utente mancante | `FOLLOW_UP.md` FU-001 |
| CE5 | PROFILO_SCOLASTICO E1: tutte 🌱, zero lezioni | Auto-dichiarazione scaffold ≠ apprendimento misurato | `Didattica-agenti/PROFILO_SCOLASTICO.md` |
| CE6 | Dual billing (due carte) approvato senza verifica Puter TOS | Accettazione di complessità UX/legale prematura | Planv2 L43-50 |
| CE7 | `pdr-v0.1` senza vincolo hard buy/sell → vincolo nasce in v1.0 in un giorno | Rischio: regola «non negoziabile» forse proposta agente e ratificata in blocco | Archivio pdr-v0.1 vs PDR v1.0 |

**Cercata, non trovata in E1:** citazione M-VOCE che dica esplicitamente «ho deciso io il no-buy/sell perché…». Serve **H5**.

---

## Sezione 5 — Copertura dichiarata

| Metrica | Valore |
|---------|--------|
| File nel perimetro | **97** (conteggio `Get-ChildItem … -Filter *.md`) |
| File aperti | **97** (100%) — 74 con segnale (Matteo/decisioni/PDR/Puter/pricing/compliance); **23** rastrello-only (header+scan, nessuna decisione owner aggiuntiva) |
| File illeggibili | **0** |
| Sensibili aperti senza citare segreti | `…/Per matteo/TEST-CREDENTIALS.local.md`, `…/Per matteo/API KEY Modelli.md` |
| Screenshot / binari | Non nel conteggio md; Orientamento e Test li citano — **non** descritti uno a uno (come da prompt) |

**23 rastrello-only (contati, non riassunti):** Auth contesto×3; FLUSSI; TEST-CREDENTIALS; 2 report modelli free 06-06; minireport 06-06; bugfix+account+dashboard+feature-dev+reviewer 21-05; plan OpenRouter riprendi; Plan/archive 01–05 + scaffold; Struttura/README; Orientamento/13-sicurezza; Test/Prompt agente.

---

## Sezione 6 — Lacune e handoff

| Lacuna | Serve a |
|--------|---------|
| Chi ha *detto per primo* «niente buy/sell» in chat | **H5** (Trade-Analyst transcripts) |
| Report agenti densi di Q1 / correzioni runtime | **E2** (30 reports + root) |
| Secondo tentativo trading + skill-system trasferito | **F1** (FREEDOM) |
| Confronto PROFILO_SCOLASTICO E1 (vuoto) vs `_lavoro` (ricco, 04-06) | **G1** |
| Fatti: commit/migrazioni Trade Analyst | fuori E1 (repo archiviato); eventuale **J1** se incluso |
| Validare se pricing 9/19/49 è M-VOCE o proposta agente | **H5** |

**Trasferibilità metodo (ipotesi da falsificare in S3/S5):** in E1 riappaiono vocabolario/command lexicon, blindatura auth, SSOT/PDR, Decisioni prese, skill agenti, controverifica — stesso *modo di lavorare* del ristorante, su un dominio compliance-sensitive. Il fallimento Puter (CE1–CE2) è il miglior contro-peso: il metodo documenta decisioni ma non sempre le chiude.

---

## Sezione 7 — Chiusura verso Matteo

Qui si vede un prodotto di tutor trading costruito come **anti-segnali**: l’app deve insegnare a leggere il grafico, non dire se comprare o vendere — e quel divieto è scritto come regola di vendita *e* di sicurezza legale.
Hai fissato prezzi e piani (9 / 19 / 49) e un’idea forte di costi (solo screenshot, niente dati live; poi l’ipotesi Puter «paga l’utente»), ma quella svolta Puter è rimasta sulla carta mentre il codice è restato su Gemini.
Il pezzo più «tu» nel metodo agenti è il vocabolario del 6 giugno («Ragioniamo», profili, chiusura) — la stessa grammatica che poi usi sul ristorante; la pagella scolastica in questo archivio invece è ancora vuota.
