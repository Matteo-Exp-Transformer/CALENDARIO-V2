# I2 — Piani `.cursor/plans`: giochi / trading / altro

> **Ondata:** I2 · **Data:** 06-08-26 · **Regime:** rastrello (scavo sui piani con visione owner / «tue risposte» / decisioni di prodotto in sessione) · **Peso fonti:** 2–3 (piani = intenzione; non prova di chiusura)
> **Perimetro P0 §9 + prompt:** 33 (Game/MathBoy2 26 · Trading 3 · ALTRO ricostruito 4)
> **Focus prompt:** pianifica allo stesso modo fuori dal business? I mini-progetti isolati sono scope aperto o solo non tracciati? → S4

**Attribuzione:** un piano Cursor è quasi sempre **testo dell’agente**. Path `Matteo/…` e «LAVORO ASSEGNATO A MATTEO» indicano il *ruolo* nel progetto gioco, non sempre una citazione di chat. «Visione survivor (tue risposte)» / «da te specificate» / «Decisioni di prodotto prese in sessione» = segnale owner **secondario** (peso 3) finché H4/H5 non lo confermano. Frontmatter `status` misura solo lo stato del todo nel piano.

**Perimetro ricostruito (33 file, tutti sotto `C:\Users\matte.MIO\.cursor\plans\`):**

| Sotto-insieme | N | Note |
|---------------|---|------|
| GAME (MathBoy2 Survivor / card / boss / wave) | 26 | Include i 3 falsi positivi «card» esclusi da I1 |
| TRADING (Aware Trader / OpenRouter / tutor) | 3 | `openrouter-dev-mode-provider` · `prompt_tutor_benchmark_*` · `redesign-prechat-tutor-vision-split` |
| ALTRO | 4 | 3 PRD Condividimi (2 hash + unificato) + `sessione_test_modelli_*` |

> **Scostamento vs testo del prompt («2 mini-progetti»):** sul disco i sibling Condividimi sono **3** file di piano, non 1. Contati tutti per raggiungere i **33** di P0. I 2 `.claude/plans` restano fuori (CB → I1).

**Risposta sintetica al focus (prova nelle sezioni sotto):** sì, fuori dal business usa lo **stesso schema di piano** (overview, mermaid, 1–3 file, skill di progetto, backlog tasks). Nei giochi è più **micro-feature** e quasi senza todo aggiornati; nel trading è più vicino a CB (PDR, gate, compliance). Condividimi = PRD chiuso in carta, **zero eco** nel repo CB-v2 → per S4: isolato/non tracciato qui, non «aperto» come cantiere CB.

---

## Sezione 1 — Decisioni

### Focus — scavo (giochi: visione owner / regole esplicite)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| I2-D01 | 28-02-26? | PRODOTTO | Survivor in un solo file per Tommaso | MATTEO | ORIGINATA | `plan_survivor_e_tasks_40b4a6ab.plan.md` L16 · L33 | «completare la modalità survivor in un unico file… da consegnare a Tommaso» | deliverable-scoping |
| I2-D02 | 28-02-26? | PRODOTTO | Timer = cronometro; fine solo per morte | MATTEO | ORIGINATA | stesso L45–51 | «Timer: solo cronometro… Fine run: solo morte… Vite: una vita» | game-rules-scoping |
| I2-D03 | 28-02-26? | PRODOTTO | Ondate sì; boss dopo 5 wave | MATTEO | ORIGINATA | stesso L47–49 | «Ondate: sì… Boss: sì, dopo 5 wave» | wave-design |
| I2-D04 | 28-02-26? | PROCESSO | Plan.md: aggiungere senza cancellare testo | AGENTE | APPROVATA | stesso L20–36 | «Nessuna cancellazione: si aggiungono solo queste due parti» | doc-non-destructive |
| I2-D05 | 28-02-26? | AI-METODO | Workflow: 1–3 file + report; run con 1 ondata | INCERTO | APPROVATA | stesso L12 | «modifiche minime per sessione, 1–3 file, report obbligatorio» | session-budget |
| I2-D06 | ? | UI-UX | Colori card per tipo (grey/yellow/red/…) | MATTEO | ORIGINATA | `card_skills_ui_e_colori_c9860fb8.plan.md` L50–56 | «Regole (da te specificate): Grey: famiglio… Blue: scudo e skill» | ui-token-mapping |
| I2-D07 | ? | PRODOTTO | Prime 3 carte: +HP, MUL, value 2→3→5 | INCERTO | APPROVATA | `survivor_card_upgrades_9a38c907.plan.md` L58–64 | «Prime 3 carte… +HP… Moltiplicazione… Valore 2→3→5» | progression-design |
| I2-D08 | 05-03-26? | PRODOTTO | Frazioni numeri solo da wave 11 (25%→35%) | INCERTO | SCELTA | `fixes_4_5_6_survivor_50cc2fbf.plan.md` L13–14 · L38–40 | «nessuna frazione prima di wave 11; da wave 11… 25% → 35%» | difficulty-curve |
| I2-D09 | 05-03-26? | PRODOTTO | Boss equazione range 35–60, +5 per boss | INCERTO | SCELTA | stesso L14 | «primo boss… [35, 60]; boss successivi… +5» | boss-scaling |
| I2-D10 | ? | AI-METODO | Skill sprite: solo ritaglio frame, no classe FX | MATTEO | ORIGINATA | `wave_scaling_boss_animations_skill_0c7abedb.plan.md` L110–126 | «l’unico spunto da codificare… come selezionare i frame… Non replicare una classe AnimatedSprite» | skill-minimalism |
| I2-D11 | 05-03-26? | PRODOTTO | Enemy level a fasce di 10 wave (max 8) | INCERTO | APPROVATA | stesso L149–154 | «Wave 1–10: solo livello 1… formula: min(8, 1 + (wave_num - 1) // 10)» | difficulty-curve |
| I2-D12 | 03-03→05-03? | PROCESSO | Dopo CTRL+Z: solo doc/gap, zero fix codice in fase | INCERTO | APPROVATA | `readme_sessioni_e_gap_survivor_b3c8e273.plan.md` L12 · L151 | «Hai perso modifiche… troppi CTRL+Z» · «Nessuna modifica al codice in questa fase» | recovery-via-docs |

### Focus — scavo (trading / Aware Trader)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| I2-D13 | 22-05-26 | AI-METODO | Tutor: guardrail descrittivo, non frase letterale | CONGIUNTA | SCELTA | `redesign-prechat-tutor-vision-split.plan.md` L28–29 | «Guardrail Tutor → descrittivo, invita a proporre 1-2 domande tecniche» | prompt-guardrail-design |
| I2-D14 | 22-05-26 | TESTING | Vision Reader: gate extraction, non compliance verbi | CONGIUNTA | SCELTA | stesso L30 · L24 | «Vision Reader → gate separato (extraction-only)» | role-split-testing |
| I2-D15 | 22-05-26 | SICUREZZA | PreChat Step 1: zero campi liberi (anti-injection) | CONGIUNTA | ORIGINATA | stesso L31 · L25–26 | «Campi liberi… vettore di prompt injection» · «difesa strutturale (enum)» | structural-safety |
| I2-D16 | 22-05-26 | PRODOTTO | Max 5 screenshot/chat per tutti i tier in v0 | CONGIUNTA | CORRETTIVA | stesso L33 | «Limite screenshot → 5 fisso… (supersede PDR §4.2 attuale 5/8)» | product-cap |
| I2-D17 | 22-05-26 | PRODOTTO | Set base = 3 TF cascata Aware Trader | CONGIUNTA | SCELTA | stesso L32 | «3 TF cascata Aware Trader (Macro + Contextual + Decisional)» | domain-framing |
| I2-D18 | 22-05-26 | AI-METODO | Dev: OpenRouter al posto di Gemini via env | INCERTO | APPROVATA | `openrouter-dev-mode-provider.plan.md` L23–34 | «usare l'app in dev mode senza budget Gemini» · «DEV_AI_PROVIDER=openrouter» | cost-aware-dev |
| I2-D19 | ? | AI-METODO | Benchmark Tutor: decidere formato 5 vs 6 sezioni | MATTEO | SCELTA | `prompt_tutor_benchmark_7d153a96.plan.md` L8–9 | «Decidere con utente: formato benchmark leggero… vs §7.1 produzione» | test-fixture-design |

### Focus — scavo (altro: Condividimi + test modelli)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| I2-D20 | 28-12-24? | PRODOTTO | Condividimi: mobile RN, pairing QR chiuso | INCERTO | APPROVATA | `prd_condividimi_b4810161.plan.md` L28–36 | «Piattaforma \| Mobile First… Connessione \| Chiusa (QR di persona)» | greenfield-prd |
| I2-D21 | 28-12-24? | PRODOTTO | Layer fiducia definiti dall’utente | INCERTO | APPROVATA | stesso L32 | «Layer fiducia \| Definiti dall'utente» | trust-model |
| I2-D22 | 28-12-24? | PROCESSO | PRD unificato: 6 todo docs tutti completed | AGENTE | DELEGATA | `prd_unificato_condividimi_5a5127ff.plan.md` L5–21 | todos `prd-save`…`rn-setup` tutti `completed` | prd-to-checklist |
| I2-D23 | ? | AI-METODO | Test modelli: 1 slug default; stima+$ conferma | MATTEO | ORIGINATA | `sessione_test_modelli_71726696.plan.md` L130–142 | «Presentare… Confermi? — non partire senza OK» | cost-gate |
| I2-D24 | ? | AI-METODO | Max 1 file nuovo nello skill system test | INCERTO | APPROVATA | stesso L30 | «massimo 1 file nuovo… resto sono patch leggere» | skill-minimalism |

### Rastrello — campione senza nome Matteo (non scavo)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| I2-D25 | ? | PRODOTTO | Card choice solo da fine wave ≥2 | INCERTO | APPROVATA | `card_choice_dopo_wave_2_f038b659.plan.md` overview | «scelta delle 3 carte… a partire dalla fine della wave 2» | progression-gate |
| I2-D26 | ? | PRODOTTO | Scudo/Famiglio disponibili da wave 8 | INCERTO | APPROVATA | `scudo_e_famiglio_da_wave_8_e04b5c8a.plan.md` overview | «Escludere… fino alla wave 8» | unlock-gating |
| I2-D27 | ? | UI-UX | Delay 3s tra fine wave e card screen | INCERTO | APPROVATA | `delay_3s_prima_card_0f91c560.plan.md` overview | «ritardo di 3 secondi tra la fine di una wave e la comparsa» | pacing |
| I2-D28 | ? | PRODOTTO | Boss missile = sprite sheet 30 frame | AGENTE | DELEGATA | `boss_missile_animato_33c30fb8.plan.md` overview · 4/4 completed | «Sostituire il cerchietto rosso… Missile.png (30 frame)» | asset-integration |

> **Rastrello non estratto come decisioni:** ~15 piani micro-fix survivor (coin spawn, HUD font, overlap shooter, rimuovi X, ecc.) aperti e contati; senza citazione owner → solo inventario stato in §4/§5.  
> **Falsi positivi «Matteo»:** `card_icons_layout_*`, `fix_1_e_2_hud_*` — path `Matteo/Skills` / `Matteo/Knowledge`, non decisione verbale (stesso pattern già visto in I1).

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| I2-A01 | M→A | DIRETTA | Visione survivor: timer/ondate/1 vita/boss@5 | accettata | plan_survivor L45–51 |
| I2-A02 | M→A | DIRETTA | Mappa colori card per tipo | accettata | card_skills_ui L50–56 |
| I2-A03 | M→A | DIRETTA | Skill sprite = solo ritaglio, non classe complessa | accettata | wave_scaling L110 |
| I2-A04 | M→A | DIRETTA | Conferma costi prima di smoke/gate modelli | accettata | sessione_test_modelli L142 |
| I2-A05 | M→A | DEDOTTA | Deliverable «un file» verso Tommaso (scope duro) | accettata | plan_survivor L16 · L33 |
| I2-A06 | M↔M | DEDOTTA | Carte ogni wave vs «ogni 2 wave» (gap post-CTRL+Z) | parziale | readme_sessioni L47 · tabella gap |
| I2-A07 | A→M | DEDOTTA | Agente propone recovery solo-doc dopo perdita undo | ignota | readme_sessioni L151–152 (nel piano, non ratifica chat) |
| I2-A08 | M→A | DEDOTTA | Sessione 22-05: 6 decisioni prodotto trading formalizzate | accettata | redesign-prechat L28–34 |
| I2-A09 | M↔M | DEDOTTA | Cap screenshot 5 supersede PDR 5/8 | accettata | redesign-prechat L33 |

---

## Sezione 3 — Skill signals

| Skill | Livello provvisorio | Prova in questo perimetro | Contro-evidenza cercata |
|-------|---------------------|---------------------------|-------------------------|
| `game-rules-scoping` | L2 | I2-D01–D03 · A01 | Cercata: sì — gap post-CTRL+Z e formule boss divergenti (§4) |
| `session-budget` | L2 | I2-D05 (1–3 file) | Contro: 26 piani GAME quasi tutti senza todo → piano non usato come tracking |
| `skill-minimalism` | L2–L3? | I2-D10 · D24 · A03 | Contro: Condividimi PRD gigante vs «1 file nuovo» — ambiti diversi; L3 decade a L2 senza prova H* |
| `structural-safety` | L2 | I2-D15 · A08 | Completamento reale → H5 / E* / J fuori repo |
| `cost-gate` / `cost-aware-dev` | L2 | I2-D18 · D23 · A04 | Todo sessione_test ancora tutti pending |
| `prompt-guardrail-design` | L2 | I2-D13–D14 | Status piano `ready_for_review`, non `completed` |
| `greenfield-prd` | L1 | I2-D20–D22 | Zero follow-up in docs CB-v2 (solo questo cantiere indagine) |
| `recovery-via-docs` | L1 | I2-D12 · A06–A07 | Prova di fallimento processo (CTRL+Z), non di mastery |
| `deliverable-scoping` | L2 | I2-D01 · A05 | Collaborazione Tommaso non verificabile qui |

**Confronto metodo giochi vs business (per S3/S5):** stesso *meccanismo* di piano Cursor + skill di progetto + vincolo di sessione; densità di etichette «Decisione di Matteo» **più bassa** nei giochi (spesso «tue risposte») e **più alta** nel trading (blocco «Decisioni di prodotto prese in sessione»), allineata a CB/I1. I giochi spezzano il lavoro in **molti piani micro**; CB/I1 ha più piani «master» e product-owner espliciti.

---

## Sezione 4 — Contro-evidenze

Obbligatorie per S4; cercate attivamente:

1. **Todo quasi morti sui giochi.** Su 33 piani: **28 senza status todo**, **3 tutti-pending**, **2 tutti-completed** (`boss_missile_animato_*`, `prd_unificato_condividimi_*`). Il survivor è pianificato a raffica ma i piani **non tengono lo stato** (peggio di I1, dove almeno ~23 completed). Contro-evidenza a «usa i piani come sistema di tracking» in dominio gioco.
2. **CTRL+Z = perdita di lavoro survivor.** `readme_sessioni_e_gap_*` documenta gap codice↔specifiche dopo undo eccessivi: formule livello boss/equazioni sbagliate, «Continua» morta, carte ogni wave vs ogni 2. Segnale di **agency fragile** sul controllo del tool, non sul design di prodotto.
3. **Incoerenze design lasciate aperte nel piano.** Stesso file gap: «decidere» su Continua 4ª carta e su carte ogni 2 wave — decisioni non chiuse nel piano.
4. **Condividimi: PRD chiuso, prodotto assente qui.** Tre piani PRD; l’unificato ha 6/6 completed e data interna «28 Dicembre 2024»; ricerca `condividimi` in `docs/` CB-v2 → **solo** file di questa indagine. Per S4: **non tracciato / fuori repo**, non «cantiere CB aperto». Non si può dire abbandonato nel senso di todo stale CB: semplicemente **non vive in questo corpus di prodotto**.
5. **`prd_condividimi_*` (non unificato) ancora pending** (review utente, spike, wireframe) mentre l’unificato dichiara completed — possibile supersessione non dichiarata (stesso pattern duplicati I1).
6. **Trading: piani `ready_for_review` senza chiusura todo.** `redesign-prechat-*` e `openrouter-dev-mode-*` non usano checkbox completed; `prompt_tutor_benchmark_*` ha 6/6 pending inclusa «Decidere con utente». Intenzione forte, esito piano **non aggiornato**.
7. **Attribuzione debole su micro-fix GAME.** Volume alto, quasi zero «Matteo» verbatim → molte I2-D25–D27 restano INCERTO (owner probabile, prova debole in linea I).

---

## Sezione 5 — Copertura dichiarata

| Metrica | Valore |
|---------|--------|
| File nel perimetro P0 (I2) | **33** |
| File ricostruiti e aperti | **33 (100%)** |
| GAME / TRADING / ALTRO | **26 / 3 / 4** |
| Regime scavo (visione owner / decisioni sessione / conferma costi) | **12** file (8 GAME signal + 3 TRADING + 1 sessione_test; Condividimi in scavo PRD) |
| Regime rastrello puro | **restanti** (~18 micro-fix GAME aperti in testa + indice full-text) |
| Piani tutti-completed (todo) | **2** |
| Piani tutti-pending (con todo) | **3** |
| Piani senza blocco todo | **28** |
| File illeggibili | **0** |
| `.claude/plans` in I2 | **0** (corretto: entrambi CB → I1) |

Path assoluto radice: `C:\Users\matte.MIO\.cursor\plans\`.

Elenco file (33):  
`attack_speed_famiglio_solo_con_famiglio_aabb27e3` · `boss_missile_animato_33c30fb8` · `card_choice_dopo_wave_2_f038b659` · `card_icons_layout_b6e0e948` · `card_scalate_per_risoluzione_b96b7328` · `card_skills_ui_e_colori_c9860fb8` · `coin_spawn_fuori_ostacoli_c0e6c2d9` · `delay_3s_prima_card_0f91c560` · `equation_drop_1_coin_e855b14c` · `fix_1_e_2_hud_e_font_613fd0da` · `fix_boss_diventa_piccolo_21207e75` · `fix_weapon_mul_card_alternanza_6d081482` · `fixes_4_5_6_survivor_50cc2fbf` · `livello_nemici_ogni_2_3_wave_d5704b8c` · `plan_survivor_e_tasks_40b4a6ab` · `primo_boss_minion_solo_chase_af1a0aa2` · `readme_sessioni_e_gap_survivor_b3c8e273` · `rimuovere_x_dai_value_sparabili_523bd847` · `ripristino_design_card_skills_5a3845df` · `scudo_e_famiglio_da_wave_8_e04b5c8a` · `secondo_boss_wave_10_0f2ceaed` · `skill_scatto_spacebar_7703575d` · `spawn_shooter_evita_overlap_4f44d8c0` · `survivor_card_upgrades_9a38c907` · `survivor_nemici_morti_e_durata_coin_295f2535` · `wave_scaling_boss_animations_skill_0c7abedb` · `openrouter-dev-mode-provider` · `prompt_tutor_benchmark_7d153a96` · `redesign-prechat-tutor-vision-split` · `prd_condividimi_7cae5986` · `prd_condividimi_b4810161` · `prd_unificato_condividimi_5a5127ff` · `sessione_test_modelli_71726696`.

---

## Sezione 6 — Lacune e handoff

| Lacuna | Serve a |
|--------|---------|
| Verbatim chat survivor / MathBoy2 / Game (visioni D01–D03, colori D06) | **H4** |
| Verbatim sessione trading 22-05 e Aware Trader | **H5** · report E*/F* |
| Esito reale OpenRouter / redesign PreChat (merge? abbandonato?) | **H5** · repo Trading (non CB git) |
| Condividimi: esiste un repo/app fuori da CB? | **S4** (fuori corpus); non riaprire CB `src/` |
| `sessione_test_modelli` pending vs pratica Qwen-Test | **H4/H5** · **J1** solo se branch `test/modelli-locali` in CB |
| Incrocio «carte ogni 2 wave» risolto in codice survivor | fuori linea I — solo se H4 o archivio Game |
| Catalogo abandoned piani GAME (28 senza todo) | **S4** (input da §4) |
| Data «28 Dicembre 2024» su PRD unificato: reale o placeholder? | **S4** / INCERTO timeline |

---

## Sezione 7 — Chiusura verso Matteo

Nei piani del survivor si vede lo stesso modo di spezzare il lavoro che usi sul ristorante: una schermata (carte, boss, ondate), poche regole chiare (una vita, boss dopo cinque ondate, colori delle carte), e l’ordine «tocca pochi pezzi per volta».  
Sul trading i piani parlano già da prodotto: niente testo libero che rompe le regole, tutor che insegna invece di ripetere una frase, limite alle foto in chat — stessa testa da «cosa può fare l’utente», dominio diverso.  
Condividimi è un progetto a sé (app di fiducia a strati): il documento è scritto e chiuso sulla carta, ma in CalendarBackup non lascia traccia — per capire se l’hai abbandonato o solo tenuto altrove serve un posto fuori da questa app.
