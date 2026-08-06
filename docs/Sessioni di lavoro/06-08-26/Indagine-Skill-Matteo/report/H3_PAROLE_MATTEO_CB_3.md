# H3 — Parole di Matteo, CB-v2, 01-06 → 06-08

> **Ondata:** H3 · **Data:** 06-08-26 · **Regime:** scavo · **Peso fonti:** **1** (parole sue)
> **Perimetro:** `docs/_lavoro/Indagine-Corpus/prompts_CB-v2.jsonl` filtrato `2026-06-01`…`2026-08-06`
> **Metodo:** identico a H1 (PIANO §2.1 REDACTED, §3.3 attribuzione). Citazioni da `text_umano`; fonte = `chat_uuid` + `seq` + `date`. Mai citare `has_secret=true`.
> **Obbligo H3:** confronto H1/H2 + datazione vocabolario di comando + picco M-REGIA.

---

## Numeri di ritmo (obbligatori H) + confronto H1/H2

| Voce | H1 (27-04→15-05) | H2 (16-05→31-05) | **H3 (01-06→06-08)** |
|------|------------------|------------------|----------------------|
| Messaggi nel perimetro | 1449 | 871 | **970** |
| **M-VOCE** | 1032 | 732 | **780** (12 secret → **768** leggibili) |
| **M-REGIA** | **0** | **3** | **110** (= quasi tutti i 113 CB-v2) |
| **M-PASTE** | 402 | 127 | **19** |
| **M-OK** | 15 | 9 | **61** |
| Chat con ≥1 M-VOCE | 91 | 116 | **189** |
| Media caratteri M-VOCE | 235 | 591 | **417** |
| Mediana caratteri M-VOCE | 62 | 131 | **164** |
| `date_src=msg` | ~40% | ~4% | **30/780 (~4%)** — non ragionare su singole giornate senza A |
| Picchi M-VOCE/giorno | (maggio) | 29-05 146 | **12-06 115** · **01-06 112** · **05-06 112** · 15-06 79 |
| Luglio CB-v2 | — | — | **0 messaggi** (buco confermato su questo jsonl) |
| Agosto CB-v2 | — | — | **28** (18 M-VOCE + 10 M-PASTE) |

**Bucket M-VOCE H3:** `<40` 101 · `40–99` 148 · `100–199` 180 · `200–499` 133 · `500+` 218.

**Lettura confronto (numeri, non psicologia):**

1. **M-REGIA esplode** (0→3→110): da giugno delega la *scrittura* dei prompt strutturati; la voce corta resta sua (`prepara`, `lavoro ok`, micro-fix).
2. **M-OK ×7 vs H2** (9→61): ritmica di chiusura («lavoro ok», «fai report finale») diventa abitudine, non eccezione.
3. **M-PASTE crolla** (402→127→19): meno dump DOM/errori in chat; più orchestrazione.
4. **Lunghezza media** scende da H2 (591→417): meno monologhi lunghi scritti a mano; i blocchi lunghi sono spesso **prompt incollati** (M-REGIA o M-VOCE «promptish» senza marker completi §3.3).
5. **Tipo di richieste:** H1 = UI pixel + nascita prodotto; H2 = prodotto XOR/promo + nascita metodo; **H3 = blindatura Admin/Prenota + release PrenotaZen + meta (hook, senior, indagine)**.

### Vocabolario di comando — datazione (evento di crescita)

Conteggi substring in **M-VOCE** H3 (più M-OK dove rilevante). Prima comparsa **in questo perimetro**:

| Parola | H1 | H2 | H3 (M-VOCE) | Prima in H3 | Nota |
|--------|----|----|-------------|-------------|------|
| `lavoro ok` | 0 | **2** (nasce 29-05) | **32** (+ **45** in M-OK) | **01-06** `2be6a08a` seq=2 | Da qui è **ritmo di chiusura**, non eccezione |
| `prepara` | ~0 trigger | 49 | **91** | 01-06 | Già operativo in H2; in H3 è il verbo di default |
| `fai report` | 2 | 26 | **42** (+9 M-OK) | 01-06 | Spesso accoppiato a `lavoro ok` |
| `revisiona` | — | 24 | **16** | 01-06 | |
| `implementa` | — | 26 | **23** | 11-06 (molti in prompt paste) | |
| `controverifica` | 0 | 9 | **35** | **04-06** `9b577880` seq=8 | Entra nel ciclo chiusura |
| `senior` | 0 | 2 | **49** | **04-06** `9b577880` seq=3 | «agente senior» + «evolvi … senior» |
| `blindatura` | 0 | **0** | **60** | **04-06** `9b577880` seq=3 | **Nasce qui** come parola-progetto |
| `ragioniamo` | 0 | 0 | **2** | 12-06 (paste «Profilo: Plan / ragioniamo») · **voce vera 17-06** `2a81c059` seq=3 | Quasi mai usata come grilletto |
| `spiegamelo` | 0 | 0 | **0** | — | Ancora assente (conferma P0-EX) |
| `dammi follow` | — | 2 | **2** | 01-06 | Raro |

**Verdetto datazione:** il passaggio «descrivo ogni volta → uso parole-comando» **non nasce a giugno**: `prepara`/`controverifica` esistono da febbraio (P0-EX/H4). Ciò che **nasce o si consolida in H3** è il **pacchetto di chiusura**: `lavoro ok` + `fai report finale` + `controverifica` + `blindatura`/`senior`, e la **delega massiva a M-REGIA** dal **01-06**.

Fonte di ogni riga sotto: `chat_uuid` + `seq` + `date` sul corpus distillato.

---

## Sezione 1 — Decisioni

Decisioni **ad alta densità** (non ogni micro-fix UI né ogni «lavoro ok»). Citazioni ≤25 parole da `text_umano`.

### 01-06 — Menu QR / Prenota polish + nascita ritmo «lavoro ok» + M-REGIA

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H3-D01 | 01-06-26 | UI-UX | Font + dimensione testo intestazione Prenota | MATTEO | ORIGINATA | `0e0a44ee…` seq=1 | «scegliere altri font… dimensione del testo» | prenota-typography |
| H3-D02 | 01-06-26 | UI-UX | Range font header 8–27, solo intestazione | MATTEO | SCELTA | stesso seq=2 | «caratteri… tra 8 e 27… solo intestazione» | prenota-typography |
| H3-D03 | 01-06-26 | PRODOTTO | Ordine card categorie QR con frecce ↑↓ | MATTEO | ORIGINATA | `2453c58b…` seq=1 | «spostare ordine delle card… freccia su e giù» | menu-qr-order |
| H3-D04 | 01-06-26 | PRODOTTO | Più icone categorie senza foto (preset cibo) | MATTEO | ORIGINATA | `5f4ed509…` seq=1–2 | «12 icone… forchetta e coltello… default» | menu-qr-icons |
| H3-D05 | 01-06-26 | UI-UX | Foto categoria: **no** su mobile in sezione | MATTEO | CORRETTIVA | `e1e12a45…` seq=3 | «la foto NON deve essere visualizzata in mobile» | responsive-qr |
| H3-D06 | 01-06-26 | UI-UX | Conferma salvataggio = modale, non toast | MATTEO | CORRETTIVA | `7797fa43…` seq=2 · `611687a8…` seq=10 | «non fare un toast laterale… conferma o annullare» | modal-pattern |
| H3-D07 | 01-06-26 | PRODOTTO | Rename categoria → sync chiavi JSON QR (P0) | MATTEO | APPROVATA | `611687a8…` seq=6–7 | priorità P0 orfani QR dopo rename | qr-data-integrity |
| H3-D08 | 01-06-26 | AI-METODO | Ritmo chiusura: lavoro ok + analisi prompt/skill | MATTEO | ORIGINATA | `2be6a08a…` seq=2 (×N chat) | «lavoro ok… analisi… skill system» | session-closure |
| H3-D09 | 01-06-26 | AI-METODO | Checklist/tabella prepara: se light ok, altrimenti segnale | MATTEO | ORIGINATA | `5f4ed509…` seq=3 · `3c087fe1…` seq=6 | «se task light… va bene… altrimenti… segnalato» | prepara-discipline |
| H3-D10 | 01-06-26 | UI-UX | Font vendibile: togli Thirsty; bold/underline | MATTEO | SCELTA | `0e0a44ee…` seq=9 | «font che posso vendere… grassetto… sottolineato» | font-licensing |

### 02-06 → 03-06 — layout Prenota desktop, sticky, hook Cursor

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H3-D11 | 02-06-26 | UI-UX | Riepilogo desktop a destra solo >1600px | MATTEO | ORIGINATA | `d722c0d3…` seq=11–12 | «sotto a 1600… sotto… sopra i 1600… a destra» | prenota-desktop-layout |
| H3-D12 | 02-06-26 | UI-UX | Solo layout full-page, non striscia laterale | MATTEO | SCELTA | stesso seq=8 | «solo… sfondo pagina intera. no… striscia laterale» | prenota-bg |
| H3-D13 | 02-06-26 | AI-METODO | Prepara deve ridare prompt **intero** dopo fix | MATTEO | ORIGINATA | stesso seq=13 | «ridarmi prompt intero non solo il fix» | prepara-discipline |
| H3-D14 | 02-06-26 | AI-METODO | «sticky» → osservazioni, non VOCABOLARIO | MATTEO | CORRETTIVA | stesso seq=18–19 | «non… nel vocabolario… in osservazioni» | meta-hygiene |
| H3-D15 | 02-06-26 | FLUSSO | Rimuovere sticky bar Invio; resta solo fondo | MATTEO | ORIGINATA | `8a58fe19…` seq=2 | «rimuoviamo del tutto la bar aggiuntiva» | booking-cta |
| H3-D16 | 03-06-26 | UI-UX | Card ingrediente: titolo / desc / checkbox+prezzo | MATTEO | CORRETTIVA | `a95fa018…` seq=6 | «annulla… titolo… descrizione… checkbox e… prezzo» | compose-card-layout |
| H3-D17 | 03-06-26 | FLUSSO | Prezzo tipologia fissa vs menu personalizzato | MATTEO | ORIGINATA | `c9145fc9…` seq=4 | «ha prezzo… moltiplico… non… ingredienti singoli» | pricing-rules |
| H3-D18 | 03-06-26 | AI-METODO | Allineamento skill = implicito, non domanda | MATTEO | ORIGINATA | `f3242f9f…` seq=5 | «allineare skill… dovrebbe essere implicita» | skill-hygiene |

### 04-06 → 07-06 — nascità blindatura / senior / wipe TEST / Archivio orario

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H3-D19 | 04-06-26 | TESTING | Wipe DB TEST: struttura sì, tenant no | MATTEO | ORIGINATA | `7fb165df…` seq=1 | «DB pulito… non ho utenti aziende o tenant» | test-db-reset |
| H3-D20 | 04-06-26 | AI-METODO | Senior su stato blindatura Prenota + file obsoleti | MATTEO | ORIGINATA | `9b577880…` seq=3 | «agente senior… blindatura e mappatura» | blindatura-orchestrate |
| H3-D21 | 04-06-26 | AI-METODO | Controverifica rapida poi merge main | MATTEO | ORIGINATA | stesso seq=8 | «controverifica rapida… commit… merge con main» | release-gate |
| H3-D22 | 04-06-26 | IMPOSTAZIONI | Limiti testo: admin vede contatore, cliente no | MATTEO | SCELTA | `74deccf8…` seq=4 | «admin vede contatore… cliente… no» | text-limits-ux |
| H3-D23 | 05-06-26 | PRODOTTO | Ordine categorie ingredienti in Prenota | MATTEO | ORIGINATA | `9a4cfc37…`/`dfb5191a…` seq=1–2 | «cambiare ordine… freccia… solo pagina prenota» | prenota-category-order |
| H3-D24 | 05-06-26 | AI-METODO | Diagnosi hook stop vs fine-sessione | MATTEO | ORIGINATA | `2ebe6972…` seq=34 | «quando tu finisci… parte… non dovrebbe» | hook-meta |
| H3-D25 | 07-06-26 | FLUSSO | Archivio reinserisci senza orario → chiedi orario | MATTEO | ORIGINATA | `97d98e87…` seq=1 | «compila orario… o annulla… lascia in archivio» | archive-reinsert |
| H3-D26 | 07-06-26 | AI-METODO | Controtest = cercare cosa rompe, non confermare | MATTEO | APPROVATA | `4bd112f9…` seq=1 · `928d28d5…` seq=3 | «CERCARE ATTIVAMENTE cosa la rompe» | blindatura-controtest |
| H3-D27 | 07-06-26 | AI-METODO | Orchestrator deve parlare skill comunicazione | MATTEO | CORRETTIVA | `928d28d5…` seq=2 | «parlarmi seguendo skill comunicazione» | user-language |

### 10-06 → 13-06 — MASTERPLAN blindatura M1–M6, prezzo, FU-TYPES

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H3-D28 | 10-06-26 | PROCESSO | Senior: plan milestone + debug + merge | MATTEO | ORIGINATA | `1c9ed7d3…` seq=1 | «plan… milestone… debug… merge con main» | senior-roadmap |
| H3-D29 | 10-06-26 | AI-METODO | Esecutori non toccano plan/roadmap | MATTEO | ORIGINATA | `233dbe70…` seq=2 | «esecutori non modificano… plan roadmap» | role-separation |
| H3-D30 | 10-06-26 | COMPLIANCE | Pubblico: solo come funziona per utente | MATTEO | ORIGINATA | `e8c5f606…` seq=3 | «come funziona per utente… non… dettagli tecnici» | public-docs-scope |
| H3-D31 | 11-06-26 | FLUSSO | No-show = dopo **inizio**, non fine | MATTEO | CORRETTIVA | `de301098…` seq=2 | «superato orario di inizio… non… fine» | no-show-rules |
| H3-D32 | 11-06-26 | FLUSSO | Dirty guard: salva/annulla prima di chiudere modale | MATTEO | ORIGINATA | `ae3179ad…` seq=7 | «modifiche non salvate… salvare o annullare» | dirty-guard |
| H3-D33 | 11-06-26 | AI-METODO | No sigle minimali nei FU; parole intere | MATTEO | CORRETTIVA | stesso seq=14 | «non mi piacciono frasi… con sigle» | user-language |
| H3-D34 | 12-06-26 | VENDITA | Prezzi: Pro 79 · Enterprise 129; +menu QR 16 | MATTEO | SCELTA | `6636909b…` seq=2 | «pro a 79 ; enterprise 129€» | pricing |
| H3-D35 | 12-06-26 | VENDITA | Launch: −50% 3 mesi; setup fondatori; foto piatti | MATTEO | SCELTA | stesso seq=3 | «50 %… primi 3 mesi… fondatori… 25 foto» | go-to-market |
| H3-D36 | 12-06-26 | VENDITA | Logo: GPT + testo PrenotaZen | MATTEO | SCELTA | stesso seq=7 | «logo… PrenotaZen» | branding |
| H3-D37 | 12-06-26 | PRODOTTO | Form non configurato: mostra form, non fake | MATTEO | SCELTA | `e27280c6…` seq=3–4 | «form non ancora configurato» · «1 picker… default» | empty-config |
| H3-D38 | 12-06-26 | PROCESSO | Merge PrenotaZen produzione dopo smoke | MATTEO | APPROVATA | `76d9d6a4…` seq=3–4 | «merge… prenotazen in produzione» · «smoke… ok» | release-prod |
| H3-D39 | 12-06-26 | TESTING | Annota debito: E2E browser per ogni area blindata | MATTEO | ORIGINATA | `dda8a00f…` seq=9 | «test e2e browser completi per ogni area» | e2e-debt |
| H3-D40 | 13-06-26 | PROCESSO | Split lavoro: autonomia agenti vs decisioni sue | MATTEO | ORIGINATA | `a0bfdf2a…` seq=2 | «agenti in autonomia… passare da me» | work-triage |

### 15-06 → 20-06 — M4 Impostazioni, email, PrenotaZen, copy errori

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H3-D41 | 15-06-26 | PRODOTTO | Nomi tipologia: no hardcode, nomi reali | MATTEO | ORIGINATA | `34284cd5…` seq=1 | «nomi reali tipologia… non… hardcodati» | no-hardcode |
| H3-D42 | 15-06-26 | PRODOTTO | Eliminare gradienti; fallback crema solo se serve | MATTEO | SCELTA | `b440228a…` seq=2 | «eliminiamo gradienti… fallback crema» | prenota-bg |
| H3-D43 | 15-06-26 | PRODOTTO | Rimuovere «finestra prenotazione» (fuori scope) | MATTEO | CORRETTIVA | `f5aefd35…` seq=4 | «rimuovere finestra prenotazione» | product-scoping |
| H3-D44 | 15-06-26 | PRODOTTO | Email: solo accetta/rifiuta; no cancellazione | MATTEO | ORIGINATA | `aa43a3e5…` seq=2 · `4e9762c4…` seq=4 | «SOLO… accettazione o rifiuto» · «non… cancellazione» | transactional-email |
| H3-D45 | 15-06-26 | PRODOTTO | Email rifiuto: no riepilogo; conferma: completo | MATTEO | ORIGINATA | `fcdc95c5…` seq=3 | «rifiutata → no riepilogo… confermata → completo» | email-content |
| H3-D46 | 15-06-26 | VENDITA | Nome in email: FU paywall nome ristorante | MATTEO | ORIGINATA | `aa43a3e5…` seq=11 | «clienti possono pagare… proprio nome… email» | email-branding-upsell |
| H3-D47 | 16-06-26 | UI-UX | Errore card scorrevole deve sparire dopo fix | MATTEO | CORRETTIVA | `483e3a6f…` seq=2 | «messaggio di errore… deve sparire» | form-validation-ux |
| H3-D48 | 17-06-26 | UI-UX | Copy errore menu: «scegli almeno un piatto» | MATTEO | ORIGINATA | `2a81c059…` seq=1 | «scegli almeno un piatto dal menù!» | copy-product |
| H3-D49 | 17-06-26 | AI-METODO | Regola prezzo >0 mai richiesta → FU indagine | MATTEO | CORRETTIVA | stesso seq=3 | «prezzo DEVE essere maggiore di 0 non l'ho mai richiesta» | product-audit |
| H3-D50 | 18-06-26 | SICUREZZA | Rate limit form Prenota: 7 tentativi errati | MATTEO | ORIGINATA | `d60772a5…` seq=1 | «compilare… errato… fino a 7 volte» | abuse-limit |
| H3-D51 | 18-06-26 | VENDITA | Classic: no citare Servizio; sì fasce orarie | MATTEO | CORRETTIVA | `177e2ca1…` seq=3 | «in classic non… servizio… fasce orarie» | edition-gating |
| H3-D52 | 18-06-26 | AI-METODO | Fine prompt: checklist verifica senza sigle | MATTEO | ORIGINATA | stesso seq=1 | «checklist… senza sigle… termini tecnici» | prepara-discipline |
| H3-D53 | 20-06-26 | FLUSSO | Nascondere clienti disiscritti all’admin | MATTEO | ORIGINATA | `2c93c26c…` seq=1 | «admin… non veda clienti… disiscritti» | crm-privacy |
| H3-D54 | 20-06-26 | UI-UX | Errori post-submit: pulse + camera + toast chiari | MATTEO | SCELTA | `1192a6bb…` seq=3 | «pulse e movimento… toast con messaggi chiari» | form-validation-ux |
| H3-D55 | 20-06-26 | PROCESSO | A→M: scusa, prenotazione non andata; toast debole | MATTEO | CORRETTIVA | stesso seq=2 | «scusa scemo io… toast… non è efficace» | owner-qa |

### 02-08 → 06-08 — ritorno: E2E S4, Servizio, indagine skill

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H3-D56 | 02-08-26 | TESTING | Preparare ambiente E2E S4 + MCP corsie | MATTEO | ORIGINATA | `73d311a0…` seq=1 | «ambiente di test… prompt… worktree pulito» | e2e-orchestration |
| H3-D57 | 03-08-26 | PRODOTTO | Servizio: Aggiungi Sala; badge sala/tavolo | MATTEO | ORIGINATA | `dd88ba93…` seq=1 | «Aggiungi Sala… badge… Tavolo» | servizio-ux |
| H3-D58 | 06-08-26 | FORMAZIONE | Indagine skill individuali su corpus intero | MATTEO | ORIGINATA | `3ea63a1a…` seq=1 | «skill individuale… MIE decisioni» | meta-reflection |
| H3-D59 | 06-08-26 | AI-METODO | Autorizza Archives + `_lavoro` + gitignored | MATTEO | ORIGINATA | stesso seq=2–3 | «indaga tutto anche… git ignored» | corpus-scope |
| H3-D60 | 06-08-26 | AI-METODO | File prompt in sequenza con spunte tracking | MATTEO | ORIGINATA | stesso seq=4 | «prompt in sequenza… spunta… completato» | investigation-process |

**Totale decisioni catalogate: 60.** I ~100 «lavoro ok / fai report / merge» ripetuti sono ritmo (sez. numeri + agency), non decisioni di prodotto.

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| H3-A01 | M→A | DIRETTA | Foto mobile ancora visibile → «non hai capito» | accettata | `e1e12a45…` seq=2→3 |
| H3-A02 | M→A | DIRETTA | Toast vs modale conferma (insistenza) | accettata | `7797fa43…` seq=2 · `611687a8…` seq=10 |
| H3-A03 | M→A | DIRETTA | «annulla queste ultime tue modifiche» | accettata | `b78d7299…` seq=5 |
| H3-A04 | M→A | DIRETTA | «agente ha sbagliato ancora» + annulla | accettata | `d722c0d3…` seq=15 |
| H3-A05 | M→A | DIRETTA | Layout card ingredienti: annulla + nuovo schema | accettata | `a95fa018…` seq=6 |
| H3-A06 | M→A | DIRETTA | Sticky/vocabolario: no VOCAB, sì osservazioni | accettata | `d722c0d3…` seq=19 |
| H3-A07 | M→A | DIRETTA | Orchestrator: parla skill comunicazione | accettata | `928d28d5…` seq=2 |
| H3-A08 | M→A | DIRETTA | Fermati + report (test che non funzionano) | accettata | `33f3fd5e…`/`bb3ae386…` seq=3 |
| H3-A09 | M→A | DIRETTA | Fermati + FU date mock future | accettata | `eda26c34…` seq=2 |
| H3-A10 | M→A | DIRETTA | No-show: inizio non fine | accettata | `de301098…` seq=2 |
| H3-A11 | M→A | DIRETTA | FU troppo criptici con sigle | accettata | `ae3179ad…` seq=14 |
| H3-A12 | M→A | DIRETTA | Classic non citare Servizio | accettata | `177e2ca1…` seq=3 |
| H3-A13 | M→A | DIRETTA | Revisione: lavoro non eseguito | accettata | `5f3f7177…` seq=2 |
| H3-A14 | M↔M | DIRETTA | Desktop menu: allinea a tablet dopo «hai ragione» | accettata | `5f3f7177…` seq=2→3 |
| H3-A15 | A→M | DEDOTTA | Opzioni pricing/GTM: sceglie A/B da proposta | accettata | `6636909b…` seq=2–7 |
| H3-A16 | A→M | DEDOTTA | «scusa scemo io» — prenotazione non inviata | accettata | `1192a6bb…` seq=1→2 |
| H3-A17 | A→M | DEDOTTA | Capisce spiegazione hook/stop → chiede diagnosi | accettata | `4296265b…`/`2ebe6972…` |
| H3-A18 | M→A | DIRETTA | Prezzo>0 non richiesta: annota FU | accettata | `2a81c059…` seq=3 |
| H3-A19 | M↔M | DIRETTA | Email Brevo: credeva rotto → secret sbagliata | accettata | `aa43a3e5…` seq=11→13 |
| H3-A20 | M→A | DIRETTA | Rimuovi finestra prenotazione fuori scope | accettata | `f5aefd35…` seq=4 |

**Spy-grep grezzo:** 51 hit; molti falsi positivi (UI «Annulla», «Don't stop» di Cursor plan, prompt M-REGIA lunghi). Agency sopra = solo casi verificati in contesto.

---

## Sezione 3 — Skill signals (provvisori)

| Skill | Livello | Prova | Contro-evidenza in §4 |
|-------|---------|-------|------------------------|
| `session-closure` / `prepara-discipline` | **L4** | D08–D09, D13, D52; `lavoro ok` ritmico; M-REGIA 110 | CE1 (checklist prepara a volte assente) |
| `blindatura-orchestrate` / `blindatura-controtest` | **L4** | D20–D21, D26, D28–D29; parola `blindatura` nasce | CE2 (E2E browser ancora debito annotato) |
| `release-prod` / `release-gate` | **L3** | D21, D38, merge PrenotaZen | CE3 (email prod fallisce per secret; smoke incompleti) |
| `modal-pattern` / `dirty-guard` | **L3** | D06, D32 | — cercata: pattern stabile |
| `edition-gating` | **L3** | D51 + pricing D34–D35 | — |
| `owner-qa` / `form-validation-ux` | **L3** | D47–D48, D54–D55 | CE4 (toast post-submit giudicato debole dopo falso allarme) |
| `transactional-email` | **L3** | D44–D46 | CE3 |
| `user-language` | **L3** | D27, D33, D52 | CE5 (a volte non capisce scelte orchestrator) |
| `pricing` / `go-to-market` | **L2** | D34–D36 SCELTA su opzioni | — scelte su proposta agente |
| `meta-reflection` | **L3** | D58–D60 (06-08 indagine) | CE6 (autorizza tutto incluso privato: rischio scope) |
| `env-safety` / `test-db-reset` | **L2** | D19 wipe TEST | CE7 (CLI/link TEST a tratti confusi 12-06) |
| `prenota-desktop-layout` | **L3** | D11–D12 + A04 | CE8 (agente sbaglia ripetuto sullo stesso fix) |

**Ritmo H3:** mediana 164 + coda `500+` 218 = **micro-comando** + **prompt strutturati** (spesso M-REGIA). M-OK 61: ratifica secca dominante. È il periodo in cui smette di riscrivere il brief e inizia a **dirigere**.

---

## Sezione 4 — Contro-evidenze

| ID | Cosa | Fonte |
|----|------|-------|
| CE1 | Agenti prepara smettono di passare checklist/tabella — lui deve segnalarlo | `5f4ed509…` seq=3 · `3c087fe1…` seq=6 |
| CE2 | Annota lui stesso che mancano E2E browser completi per aree blindate | `dda8a00f…` seq=9 |
| CE3 | Release email: test ok / prod no; poi secret; branding temporaneo PrenotaZen | `aa43a3e5…` seq=3–13 |
| CE4 | Falso allarme intolleranze → «scusa scemo io»; poi critica toast | `1192a6bb…` seq=2 |
| CE5 | Orchestrator: «ho capito quasi niente di cosa devo scegliere» | `928d28d5…` seq=2 |
| CE6 | Scope indagine: autorizza gitignored/privato in blocco | `3ea63a1a…` seq=3 |
| CE7 | CLI Supabase: progetto TEST sparisce; chiede aiuto link | `f28ce8c4…` seq=1 |
| CE8 | Stesso fix layout Prenota: «agente ha sbagliato ancora» | `d722c0d3…` seq=15 |
| CE9 | Hook fine-sessione parte quando non dovrebbe — lui indaga ma non risolve solo | `2ebe6972…` seq=34 |
| CE10 | Regola prezzo>0 in produzione senza sua richiesta esplicita | `2a81c059…` seq=3 |

**Luglio = 0 su CB-v2:** non è pausa mentale nel corpus H — è **assenza di questo progetto** (piano §2.2 → H5).

---

## Sezione 5 — Copertura dichiarata

| Voce | Numero |
|------|--------|
| Messaggi nel perimetro (jsonl filtrato) | **970** |
| M-VOCE aperti (leggibili) | **768 / 768** (100% dei non-secret) |
| M-VOCE secret non citati | **12** |
| M-REGIA campionati | **110 / 110** contati; primi 50 in `regia_sample.txt` + distribuzione per giorno |
| M-OK campionati | **61 / 61** (conteggio + overlap `lavoro ok`) |
| M-PASTE | contati **19**, non letti uno per uno |
| Dump giorno | 21 file `voce_YYYY-MM-DD.txt` in `_stato/_tmp_H3/` |
| Estratti supporto | `short_voice` 332 · `long_voce` 340 · `spy_hits` 51 · `hard_corrections` 12 · `august` · `cmd_first_detail` |

**Copertura M-VOCE: totale misurata.** Decisioni §1 = scavo selettivo ad alta densità. Agency = solo casi verificati.

---

## Sezione 6 — Lacune e handoff

| Lacuna | Serve a |
|--------|---------|
| Solo ~4% timestamp msg: picchi 01/05/12/15-06 da incrociare con A4–A10 | S3 timeline |
| Molti M-VOCE lunghi ≥500 sono prompt paste senza marker M-REGIA completi → sottostima regia formale | S2 / P0-EX regole |
| Luglio CB-v2 vuoto: lavoro su BHM/Trading-Platform | **H5** |
| Parallelismo Trade-Analyst a inizio giugno (fuori jsonl CB-v2) | H5 |
| 12 secret: possibili decisioni env — non citabili | buco dichiarato |
| Conflitto prezzo carosello A2 lasciato aperto in H2: in H3 compare copy «totale» email e prezzo>0 non richiesto — non chiude il carosello | J1 + S4 |
| `_tmp_H3/` materiale lavoro agente — non deliverable | AGG ignora |

---

## Sezione 7 — Chiusura verso Matteo

Da giugno non stai più a riscrivere ogni brief: dici «prepara / lavoro ok / controverifica / blindatura» e incolli prompt già fatti — è il mese in cui dirigi più di quanto scrivi.  
In queste settimane hai tenuto il filo della blindatura Admin e delle uscite su PrenotaZen (email, merge, prezzo), fermando gli agenti quando il fix non si vedeva sullo schermo o quando uscivano dallo scope.  
A luglio CalendarBackup tace in queste chat; ad agosto torni con i test E2E, la pagina Servizio e l’indagine su di te — lo stesso metodo, applicato al tuo profilo.
