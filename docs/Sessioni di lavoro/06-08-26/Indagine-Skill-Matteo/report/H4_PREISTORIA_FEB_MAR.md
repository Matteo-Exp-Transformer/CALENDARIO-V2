# H4 — Preistoria feb-mar: CB-old, MathBoy2, Game, Qwen

> **Ondata:** H4 · **Data:** 06-08-26 · **Regime:** scavo · **Peso fonti:** **1** (parole sue verbatim)
> **Perimetro:** `docs/_lavoro/Indagine-Corpus/` —
> `prompts_CB-old.jsonl` (97) · `prompts_CB-old-wt.jsonl` (67) · `prompts_MathBoy2.jsonl` (374) ·
> `prompts_Game.jsonl` (91) · `prompts_Qwen-Test.jsonl` (5) → **634 msg**
> **Focus:** Matteo **prima** di CB-v2 (nato 27-04); trasferibilità del metodo; giochi ≠ ristorazione;
> datarlo del vocabolario di comando.
> **Metodo:** identico a H1. Volume basso → letti **tutti** i messaggi (anche M-OK e M-PASTE).
> Citazioni da `text_umano`; fonte = `chat_uuid` + `seq` + `date`. Mai citare `has_secret=true`.

---

## Numeri di ritmo

| Voce | Valore |
|------|--------|
| Messaggi nel perimetro | **634** (conteggio file: 97+67+374+91+5) |
| **M-VOCE** | **593** (di cui 11 `has_secret` → non citabili; **582** leggibili) |
| **M-REGIA** | **0** | nessuna: la regia-prompt strutturata (`Profilo:`) nasce dopo (H2 fine maggio / H3) |
| **M-PASTE** | **14** | errori terminali, log, paste Cursor |
| **M-OK** | **27** | ritmica («ok», «procedi», «si», costi card) |
| Chat | **62** |
| Media caratteri M-VOCE clean | **243** (mediana **126**) — sotto media CB-v2 ≈635; vicino a H1 (235) |
| Bucket | `<40` 75 · `40–99` 166 · `100–199` 139 · `200–499` 163 · `500+` 39 |
| Picchi M-VOCE/giorno | 05-03 **149** (MathBoy2) · 30-03 **88** (Game) · 02-03 **70** · 06-03 **62** · 03-03 **58** |
| Paste «Implement the plan as specified…» | **62** | UI Cursor, non M-REGIA (manca `Profilo:`) |

**Per progetto:**

| Progetto | Msg | M-VOCE | Periodo | Media char M-VOCE |
|----------|-----|--------|---------|-------------------|
| MathBoy2 | 374 | 349 | 28-02 → 06-03 | 272 |
| CB-old | 97 | 93 | 21-02 → 22-03 | 286 |
| Game | 91 | 88 | 30-03 | 127 |
| CB-old-wt | 67 | 58 | 13-03 → 18-03 | 204 |
| Qwen-Test | 5 | 5 | 08-03 | 13 (quasi solo «ciao») |

### Vocabolario di comando — dating (test di trasferibilità)

P0-EX aveva segnalato «prepara» e «controverifica» dal 24-02. **Verifica messaggio per messaggio:**

| Parola / pratica | Prima volta reale in H4 | Natura | Nota vs VOCABOLARIO attuale |
|------------------|-------------------------|--------|------------------------------|
| Cross-check tra agenti («verifica che ti sia sfuggito») | **21-02** CB-old | pratica | Metodo, non ancora parola-comando |
| Opzioni A/B/C + linguaggio non tecnico | **21-02** CB-old | pratica | Stesso stile di comunicazione di maggio |
| Branch di test ≠ main deploy | **24-02** CB-old | pratica | Precursore env-safety |
| **`controverifica` + screen → skill** | **24-02** CB-old | **comando + L4** | «aggiungi al file di skills di controverificare con screen» — **codifica la regola** |
| `preparati` (italiano naturale) | 24-02 | **non** grilletto | False positive rispetto al comando «prepara» |
| `crea report` in cartella sessione | **28-02** MathBoy2 | pratica → comando | Prima della forma «fai report» |
| `procedi` | **02-03** MathBoy2 | comando | Già operativo |
| `fai report` | **05-03** MathBoy2 | comando | |
| `prepara una strategia` | 03-03 MathBoy2 | italiano naturale | Non è il grilletto «prepara prompt» |
| `revisiona` | **13-03** CB-old-wt | comando | Su un plan che «faceva fatica» |
| `dammi prompt` (handoff ad altro agente) | **22-03** CB-old | **precursore M-REGIA** | Delega scrittura prompt, ancora senza schema `Profilo:` |
| `lavoro ok` / `senior` / `blindatura` / `ragioniamo` / `spiegamelo` | **assenti** | — | Nascono in CB-v2 (mag-giu), confermato H2 |

**Verdetto dating:** il **metodo** (skill file, report di sessione, domande prima, controverifica con screen, branch sicuri, linguaggio semplice) **esiste già a febbraio-marzo**. Il **vocabolario ufficiale corto** (`lavoro ok`, `prepara` come grilletto, `senior`…) **non**: è un raffinamento di maggio su CB-v2. «controverifica» è l’unica parola-comando che nasce qui **e** viene subito scritta in una skill.

---

## Sezione 1 — Decisioni

Decisioni ad alta densità. Micro-fix UI ripetuti (costi card, ritaglio sprite) campionati, non elencati tutti.

### 21–24 feb — CB-old: nascita del metodo agente

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H4-D01 | 21-02-26 | AI-METODO | Mappa elementi dashboard per skill Tailwind | MATTEO | ORIGINATA | `8453e3a6…d84947` seq=1 | «mappare… collapse card le tab… potenziali conflitti» | ui-element-map |
| H4-D02 | 21-02-26 | AI-METODO | Secondo agente verifica output del primo | MATTEO | ORIGINATA | stesso seq=2 | «altro agente… verifica che ti sia sfuggito» | cross-agent-review |
| H4-D03 | 21-02-26 | AI-METODO | Linguaggio non tecnico + scelte A/B/C | MATTEO | ORIGINATA | `28b44f7c…290751` seq=3 | «linguaggio non tecnico… opzioni (A o B o C)» | user-language |
| H4-D04 | 21-02-26 | PROCESSO | Branch nuovo per test layout | MATTEO | ORIGINATA | stesso seq=2 | «creiamo un nuovo branch e testiamo» | branch-hygiene |
| H4-D05 | 24-02-26 | SICUREZZA | Non rompere deploy Vercel su main | MATTEO | ORIGINATA | `823bed36…783a8d` seq=1 | «non voglio romperla… branch diverso» | release-safety |
| H4-D06 | 24-02-26 | AI-METODO | Controverifica con screen → file di skills | MATTEO | ORIGINATA | stesso seq=6 | «aggiungi al file di skills di controverificare con screen» | skill-authoring |
| H4-D07 | 24-02-26 | TESTING | Chiede prova screen prima di accettare | MATTEO | CORRETTIVA | stesso seq=7 | «hai controverificato con screen?» | visual-qa |

### 28 feb – 01 mar — MathBoy2: skill workflow + design Survivor

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H4-D08 | 28-02-26 | AI-METODO | Skill: una funzione in survivor_state, 1 riga in UI | MATTEO | ORIGINATA | `2156d924…` seq=1 | «funzione a parte… importarla nel UI in una sola riga» | modular-handoff |
| H4-D09 | 28-02-26 | PROCESSO | Report sessione obbligatorio a fine task | MATTEO | ORIGINATA | `35786538…` seq=2 | «crea un report del lavoro svolto… Sessioni_di_lavoro» | session-report |
| H4-D10 | 01-03-26 | PRODOTTO | Survivor = un solo file da passare a Tommaso | MATTEO | ORIGINATA | `1b406249…0bc979` seq=1 | «un unico file che passerò a tommaso» | integration-scope |
| H4-D11 | 01-03-26 | AI-METODO | Domande prima di riempire idee Survivor | MATTEO | ORIGINATA | stesso seq=2 | «fammi delle domande per definire come immagino» | plan-steering |
| H4-D12 | 01-03-26 | PRODOTTO | Spec Survivor: power-up, shooters, boss wave 5 | MATTEO | ORIGINATA | stesso seq=3 | «scudo… scatto… equazioni… sparano… boss del Wave 5» | game-design |
| H4-D13 | 01-03-26 | AI-METODO | Cancella codice e rifai dopo update skill | MATTEO | CORRETTIVA | stesso seq=5 | «cancella cio che hai fatto… rifallo» | skill-enforcement |
| H4-D14 | 01-03-26 | PRODOTTO | Tabella spawn wave 1–10+ (numeri/equazioni) | MATTEO | ORIGINATA | stesso seq=8 | «1° wave… 15 numeri… 1 sola equazione» | wave-balancing |

### 02–03 mar — MathBoy2: carte, dash, boss class, QA gate

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H4-D15 | 02-03-26 | PRODOTTO | Fine wave → 3 carte potenziamento (HP, mul, value) | MATTEO | ORIGINATA | `aeb2d13f…0ee84e` seq=1 | «sempre 3 carte… aumento HP - arma moltiplicazione» | card-meta |
| H4-D16 | 02-03-26 | PRODOTTO | Dash: collisioni restano, no input, no muri | MATTEO | ORIGINATA | `bee1e091…3b1338` seq=2 | «subisce danni… non puo passare attraverso ostacoli» | ability-constraints |
| H4-D17 | 02-03-26 | TESTING | Task «completato» solo dopo suo test | MATTEO | CORRETTIVA | `69ff892e…66ed3c` seq=5 | «prima di dichiare completati… farmi testare a me» | owner-qa-gate |
| H4-D18 | 02-03-26 | PRODOTTO | Scatto solo via card drop, non sempre on | MATTEO | ORIGINATA | `bee1e091…` seq=14 | «solo se "droppata" con la card» | progression-gating |
| H4-D19 | 02-03-26 | PRODOTTO | Card Famiglio: slime, mira numeri, ignora eq | MATTEO | ORIGINATA | stesso seq=20 | «spara solo ai numeri semplici… ogni 2 secondi» | companion-design |
| H4-D20 | 02-03-26 | PRODOTTO | Preferisce classe BossEnemy a IF in state | MATTEO | CORRETTIVA | `69ff892e…` seq=22 | «non voglio… un sacco di IF… nuova classe Boss_enemy» | architecture-choice |
| H4-D21 | 02-03-26 | AI-METODO | Report: sezione «Codice scritto (per ispezione)» | MATTEO | ORIGINATA | `39800c78…daaef` seq=7 | «all'inzio del report… Codice scritto (per ispezione)» | report-inspectability |
| H4-D22 | 02-03-26 | PROCESSO | Annulla propria richiesta (kill out of bounds) | MATTEO | CORRETTIVA | `c2705118…07019` seq=5 | «ok annulla. ho sbalgiato a chiederti» | self-correction |

### 03–06 mar — MathBoy2: bilanciamento, regressioni, difficoltà

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H4-D23 | 03-03-26 | PRODOTTO | Boss shrink-on-hit + boss wave 10 + no «X» | MATTEO | ORIGINATA | `6c9788ef…` seq=1 | «fixare il boss… diventa piccolo… wave 10» | boss-iteration |
| H4-D24 | 03-03-26 | UI-UX | Copy card: «Se possiedi già : Cura Famiglio» | MATTEO | ORIGINATA | stesso seq=31 | «Se possiedi già : Cura Famiglio» | card-copy |
| H4-D25 | 05-03-26 | PRODOTTO | Scelta carte solo dopo wave 2 | MATTEO | ORIGINATA | `5ec86b9a…f8e881` seq=1 | «scegliere… solo dopo wave 2» | progression-gating |
| H4-D26 | 05-03-26 | PRODOTTO | Scudo/Famiglio off fino a wave 8 | MATTEO | ORIGINATA | `88b810bb…1d7028` seq=1 | «non devono comparire… fino alla wave 8» | progression-gating |
| H4-D27 | 05-03-26 | AI-METODO | Toccare solo file Survivor, non `enemy.py` | MATTEO | CORRETTIVA | `5ec86b9a…` seq=8 | «non mi piace… modificato… enemy.py» | modular-handoff |
| H4-D28 | 05-03-26 | PRODOTTO | Tabella spawn/difficoltà wave 1–30 (dettaglio) | MATTEO | ORIGINATA | `eaf313d7…` seq=7 | «1* wave = 5… 30 =boss… ogni 0,5 secondi» | wave-balancing |
| H4-D29 | 05-03-26 | PRODOTTO | Boss: missile area + zona electric + danni %HP | MATTEO | ORIGINATA | stesso seq=3–4 | «explosion… 20% danno… zona azzurra… electric aura» | boss-telegraph |
| H4-D30 | 05-03-26 | AI-METODO | Skill sprite-sheet: solo frame/ritaglio, non classe | MATTEO | ORIGINATA | stesso seq=2 | «solo… selezionare i giusti frame e… ritagliarli» | skill-scoping |

### 03–22 mar — CB-old / worktree: prodotto ristorante + multi-tenant

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H4-D31 | 03-03-26 | PRODOTTO | Mini rustici omaggio: soglia 17€ → 15€ | MATTEO | ORIGINATA | `a290a3ff…723787` seq=1 | «raggiungere 15 euro… non 17 €» | promo-threshold |
| H4-D32 | 03-03-26 | FLUSSO | Prenota: solo «rinfresco di laurea», no tendina | MATTEO | ORIGINATA | stesso seq=6 | «rimanga Sempre. selezionato… rinfresco di laurea» | booking-type-lock |
| H4-D33 | 13-03-26 | PRODOTTO | Togliere coperto ovunque; +2€ caraffe | MATTEO | ORIGINATA | `c049f787…0a4b` seq=1 | «rimuovere il coperto… aumentare… caraffe… di 2 €» | pricing-product |
| H4-D34 | 13-03-26 | PRODOTTO | No surcharge costante: legge prezzo scheda | MATTEO | CORRETTIVA | `00faf868…0369b8` seq=9 | «non serve… CARAFFE_SURCHARGE… legga il prezzo» | data-driven-price |
| H4-D35 | 13-03-26 | VENDITA | Multi-tenant: 10 aziende, 3600 prenotazioni/anno | MATTEO | ORIGINATA | `86d6fcb0…f50020` seq=2 | «vendere ad almeno 10 aziende… 3600 prenotazioni» | saas-scoping |
| H4-D36 | 13-03-26 | AI-METODO | Revisiona plan caraffe (modello in difficoltà) | MATTEO | ORIGINATA | `de244ff2…` seq=1 | «faceva fatica… revisionalo» | plan-steering |
| H4-D37 | 18-03-26 | FLUSSO | Overbooking = avviso, mai blocco inserimento | MATTEO | ORIGINATA | `8ddc880c…ff622a` seq=1 | «non deve bloccare… solo avvisarlo» | soft-capacity |
| H4-D38 | 19-03-26 | SICUREZZA | Clone DB test da prod; Al Ritrovo non perde dati | MATTEO | ORIGINATA | `6b0707f1…6417e` seq=1 | «Al Ritrovo non perda dati dopo merge» | tenant-safety |
| H4-D39 | 22-03-26 | SICUREZZA | PROD: solo lettura; no commit senza ok | MATTEO | ORIGINATA | `5a504080…9f5d6` seq=4 · `229bafb3…` seq=3 | «NO MODIFICHE A DB PRODUCTION» | env-safety |
| H4-D40 | 22-03-26 | AI-METODO | «dammi prompt» per altro agente | MATTEO | ORIGINATA | `5a504080…` seq=15 | «dammi prompt per far proseguire… altro agente» | prompt-orchestration |

### 30 mar — Game (Godot): stesso metodo, dominio diverso

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H4-D41 | 30-03-26 | AI-METODO | Context agent da PDR + cartella skills | MATTEO | ORIGINATA | `5e549b63…4ac3a8` seq=4 | «primo file di contesto… analizza il pdr» | project-bootstrap |
| H4-D42 | 30-03-26 | PRODOTTO | Warrior spritesheet: idle/attacchi direzionali | MATTEO | ORIGINATA | `9547b759…7ce02` seq=1 | «sprite sheet… guerriero… attacco verso l'alto» | sprite-pipeline |
| H4-D43 | 30-03-26 | PRODOTTO | Skill Testuggine: charge visual senza nuovi asset | MATTEO | ORIGINATA | `6ffc7520…8b0fd6` seq=7 | «SENZA creare nuovi asset… fase di caricamento» | juice-on-budget |
| H4-D44 | 30-03-26 | PRODOTTO | Skill E: carica 2,5s + HUD pressione | MATTEO | ORIGINATA | `62aa6ad4…7fef63` seq=17 | «caricamento… 2,5 secondi» | ability-ux |
| H4-D45 | 30-03-26 | AI-METODO | Skill anti-errore: effetti sotto al player | MATTEO | CORRETTIVA | stesso seq=18 | «crea un file di skill… per non ripetere questo erorre» | skill-from-bug |
| H4-D46 | 30-03-26 | PROCESSO | Unifica report in Knowledge; fix rule path | MATTEO | ORIGINATA | `5e549b63…` seq=20 | «unifichiamo… sessioni di lavoro dentro a knowledge» | docs-hygiene |

### Qwen-Test (08-03) — nessun prodotto

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H4-D47 | 08-03-26 | ALTRO | Chat di prova modelli: «ciao» ×4 + richiesta YT | MATTEO | ORIGINATA | `prompts_Qwen-Test.jsonl` seq=1–2 | «scrivi un codice pyton che scarica video» | model-smoke-test |

*(Qwen: densità di decisione ≈0. I 5 msg sono smoke-test, non valutazione strutturata di modelli.)*

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| H4-A01 | M→A | DIRETTA | Colori non cambiati → impone controverifica screen in skill | accettata | `823bed36…` seq=6–7 · 24-02 |
| H4-A02 | M→A | DIRETTA | Dopo update skill: cancella codice e rifai | accettata | `1b406249…` seq=5 · 01-03 |
| H4-A03 | M→A | DIRETTA | Non segnare task complete prima del suo test | accettata | `69ff892e…` seq=5 · 02-03 |
| H4-A04 | M→A | DIRETTA | Rifiuta IF-heavy boss: vuole classe BossEnemy | accettata | `69ff892e…` seq=22 · 02-03 |
| H4-A05 | M→A | DIRETTA | Agente ha toccato `enemy.py`: riporta su Survivor-only | accettata | `5ec86b9a…` seq=8 · 05-03 |
| H4-A06 | M→A | DIRETTA | Annulla tentativo texture bordo card | accettata | `8b5013ca…` seq=28 · 05-03 («annulla… lascia solo il bordo») |
| H4-A07 | M→A | DIRETTA | Sospetta lavoro su main invece del branch | ignota | `c049f787…` seq=5 · 13-03 |
| H4-A08 | M→A | DIRETTA | No costante surcharge: usa prezzo scheda già aggiornato | accettata | `00faf868…` seq=9 · 13-03 |
| H4-A09 | M→A | DIRETTA | Soft capacity: trova ancora blocchi hard | accettata | `8ddc880c…` seq=1 · 18-03 |
| H4-A10 | M→A | DIRETTA | Chiede perché ha cancellato report precedente | ignota | `62aa6ad4…` seq=30 · 30-03 |
| H4-A11 | M→A | DIRETTA | Famiglio anim: idle ≠ movimento; distanza player irrilevante | parziale | `82e47b4d…` seq=5–10 · 03-03 (bug dichiarato non fixato) |
| H4-A12 | A→M | DEDOTTA | Ammette di aver chiesto modifica sbagliata (kill bullet) | accettata | `c2705118…` seq=5 · 02-03 «ho sbalgiato» |
| H4-A13 | A→M | DEDOTTA | Dopo spiegazione restore fallito, cambia approccio (segue guida) | parziale | `6b0707f1…` seq=25→31 · 19-03 |
| H4-A14 | M↔M | DIRETTA | Costi card: itera 30 coin → 2 coin (M-OK ripetuti) | accettata | MathBoy2 M-OK 05-03 |
| H4-A15 | M↔M | DIRETTA | Famiglio: da «non colpire equazioni» a «può risolvere equazioni» | accettata | `bef2de65…` seq=4 · 05-03 |
| H4-A16 | M→A | DIRETTA | Proiettile equazione: mira punto attuale, non stima | accettata | `69ff892e…` seq=15 · 02-03 |

**Sintesi agency:** M→A **12** · A→M **2 DEDOTTE** · M↔M **2**. Pattern dominante: corregge l’agente su **gate di test**, **scope file**, **regole prodotto**; si autocancella quando ha chiesto lui la cosa sbagliata.

---

## Sezione 3 — Skill signals (provvisori, §3.4)

| Skill | Livello provvisorio | Prova in H4 | Contro-evidenza §4 |
|-------|---------------------|-------------|-------------------|
| `skill-authoring` / controverifica | **L4** | H4-D06: scrive la regola nel file di skills | Cercata: sì — a marzo a volte chiede report ma non sempre screen (Game: meno screen-gate) |
| `session-report` | **L3** | H4-D09, H4-D21, molte «fai/crea report» | H4-C03 (report sovrascritto / cancellato) |
| `owner-qa-gate` | **L3** | H4-A03: test suo prima di «completato» | H4-C01 (Ctrl+Z perde lavoro; dipende da agente per recover) |
| `game-design` / `wave-balancing` | **L2–L3** | H4-D14, H4-D28 tabelle spawn dettagliate | H4-C04 (bilanciamento iterato a colpi; costi card oscillano) |
| `env-safety` / branch | **L2** | H4-D05, H4-D39 | H4-C02 (worktree/branch: repo «vuota», confusione main) |
| `modular-handoff` (Survivor → Tommaso) | **L3** | H4-D08, H4-D10, H4-A05 | — cercata, non trovata fallimento di principio |
| `user-language` | **L2** | H4-D03; ripete su CB-old DB | — |
| `prompt-orchestration` | **L1–L2** | H4-D40 «dammi prompt»; ancora 0 M-REGIA | Nasce dopo come schema formale |
| `model-eval` (Qwen) | **L0** | Solo smoke «ciao» | H4-C05 |
| `saas-scoping` / multi-tenant | **L2** | H4-D35, H4-D38 | H4-C02 restore 356 errori |

---

## Sezione 4 — Contro-evidenze

| ID | Cosa | Perché conta | Fonte |
|----|------|--------------|-------|
| H4-C01 | Troppi Ctrl+Z → perde Survivor State; chiede recover da report | Owner di prodotto ma **non** ancora owner di tooling/git discipline | `8b5013ca…` seq=1 · 05-03 |
| H4-C02 | Worktree/branch: file sessione spariti; «repository intera è vuota»; restore DB con centinaia di errori | Capisce l’obiettivo (test≠prod) ma **sbaglia l’esecuzione** operativa | `a7e92999…` seq=4–11 · `6b0707f1…` seq=25 · 18–19-03 |
| H4-C03 | Agente cancella/sovrascrive report; lui se ne accorge dopo | Il processo report esiste ma **non è ancora blindato** | Game `62aa6ad4` seq=30; `5e549b63` seq=19 |
| H4-C04 | Iterazioni costi card (30↔2) e logica famiglio invertita in giornata | Design forte, **stabilizzazione debole** nello stesso giorno | M-OK 05-03; `bef2de65` seq=4 |
| H4-C05 | Qwen-Test: 5 msg, nessun criterio di valutazione modelli | L’etichetta «valutazione AI locali» del piano **non è supportata** da questo corpus | `prompts_Qwen-Test.jsonl` |
| H4-C06 | Bug famiglio anim dichiarato «non fixato» nel report che commissiona | Sa chiudere in incompleto — onesto — ma **non risolve** | `82e47b4d…` seq=10 |

**Motivazione sezioni non vuote:** contro-evidenze trovate attivamente su ops/DB, bilanciamento, e Qwen vuoto.

---

## Sezione 5 — Copertura dichiarata

| Voce | N |
|------|---|
| File/corpus nel perimetro | **5** jsonl |
| Messaggi nel perimetro | **634** (find/count righe) |
| Messaggi aperti | **634 (100%)** — regime scavo + volume basso: anche M-OK e M-PASTE letti |
| M-VOCE letti | **593/593** (11 secret: aperti ma non citati) |
| M-REGIA | **0** |
| File illeggibili | **0** |
| Dump di scavo | `_stato/_tmp_H4_voce.md`, `_tmp_H4_spy.md`, `_tmp_H4_cb_early.md`, `_tmp_H4_cb_mar.md`, `_tmp_H4_mathboy.md`, `_tmp_H4_game.md` |

---

## Sezione 6 — Lacune e handoff

| Lacuna | Serve a |
|--------|---------|
| Confronto stile richiesta CB-old (mar) vs CB-v2 (mag): stesso prodotto, metodo già simile — H1 conferma media char e assenza grilletti `lavoro ok` | **S3 timeline**, **S5 ritratto** |
| Vocabolario: «controverifica» L4 qui; «prepara» come grilletto **non** nasce in H4 (correggere eventuale lettura piatta di P0-EX) | **S4 falsificazione**, **H3** |
| Parallelismo trading (mag) e buco luglio **non** sono in H4 | **H5** |
| Qwen quasi vuoto: non usare H4 per rivendicare skill di model-eval | **S4**, eventuale **I2** (`sessione_test_modelli`) |
| MathBoy2 «Tommaso» = handoff umano: skill collaborazione peer, non solo AI | **S5** |
| Divergenza eventuale report pubblici Archives su CB-old vs queste parole | **D1/D2** se ancora da fare |

---

## Sezione 7 — Chiusura verso Matteo

A febbraio-marzo stavi già guidando gli agenti come fai oggi: skill scritte da te, report di sessione, «fammi domande», branch di prova, e la controverifica con screen messa per iscritto. Su MathBoy2 decidevi tu bilanciamento, carte e boss; su CalendarBackup vecchia decidevi soglie omaggio, coperto e multi-tenant — stesso modo di lavorare, domini diversi. Quello che ancora non c’era è il vocabolario corto (`lavoro ok`, `prepara` come comando): nasce dopo, su CalendarBackup-v2; qui c’è già il metodo, non ancora le parole-grilletto.
