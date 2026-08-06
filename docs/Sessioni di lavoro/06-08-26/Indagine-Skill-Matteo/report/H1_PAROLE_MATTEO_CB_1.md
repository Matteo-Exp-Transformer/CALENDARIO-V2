# H1 — Parole di Matteo, CB-v2, 27-04 → 15-05

> **Ondata:** H1 · **Data:** 06-08-26 · **Regime:** scavo · **Peso fonti:** **1** (parole sue verbatim)
> **Perimetro:** `docs/_lavoro/Indagine-Corpus/prompts_CB-v2.jsonl` filtrato `2026-04-27` … `2026-05-15`
> **Focus:** nascita CB-v2; periodo più denso prima dei report pubblici (linea A parte dal 23-05)

**Attribuzione del periodo (conteggio meccanico, non sommare M-VOCE+M-REGIA):**

| Classe | N | Nota |
|--------|---|------|
| **M-VOCE** | **1032** | tutti letti (regime scavo + indice tematico) |
| **M-REGIA** | **0** | nessuna in questo intervallo — la regia prompt nasce dopo (H3) |
| **M-PASTE** | **402** | campionati; non estratti come decisioni |
| **M-OK** | **15** | ritmica UI («ok», «procedi», «ottimo lavoro») |
| **Totale msg** | **1449** | 91 chat · `has_secret=true`: 84 (non citati) |
| **date_src** | file 867 / msg 582 | giorno singolo non affidabile al 100% (§2.1) |

**Ritmo (solo M-VOCE senza secret, n=985):** media **235** caratteri (mediana **62**). Sotto la media generale CB-v2 citata nel prompt (635) e sotto la media maggio P0-EX (396): qui domina il micro-aggiustamento UI, non il brief lungo. Bucket: `<40` 333 · `40–99` 326 · `100–199` 186 · `200–499` 92 · `500+` 48.

**Vocabolario di comando in questo periodo:** `lavoro ok` / `ragioniamo` / `spiegamelo` / `blindatura` / `senior` / `controverifica` **assenti** come parole-comando. Compaiono invece `procedi` (5), `fai report` (2, dal 14-05), e soprattutto il ritmo operativo **`commit`/`push`** (decine di volte). «prepara» compare 1 volta in senso letterale («riquadri che hai preparato»), non come grilletto.

Fonte di ogni riga sotto: `chat_uuid` + `seq` + `date` sul corpus distillato.

---

## Sezione 1 — Decisioni

### 27-04 — Nascita progetto e direzione UI

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H1-D01 | 27-04-26 | PROCESSO | Setup progetto da Guida.md, split compiti | MATTEO | ORIGINATA | `6275af72…e9ba` seq=1–2 | «io faccio lo step 2 e 5 tu esegui gli altri» | project-bootstrap |
| H1-D02 | 27-04-26 | AI-METODO | Linguaggio semplice: no competenze tecniche | MATTEO | ORIGINATA | stesso seq=4 | «non ho conoscenze… usa un linguaggio semplice» | user-language |
| H1-D03 | 27-04-26 | UI-UX | UI bianca troppo fredda → moderna colori/tab | MATTEO | ORIGINATA | stesso seq=13 | «troppo freddo… interfaccia moderna con colori e tab» | visual-direction |
| H1-D04 | 27-04-26 | UI-UX | Spunto Dribbble Restaurant Admin Dashboard | MATTEO | SCELTA | stesso seq=16 | «voglio prendere spunto da questa dashboard» | visual-reference |

### 04-05 — RLS, git, impostazioni ristorante, collaudo multi-tenant

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H1-D05 | 04-05-26 | SICUREZZA | MCP Supabase puntato a progetto remoto | MATTEO | ORIGINATA | `577624c4…c185` seq=1 | «configurare mcp supabase… per future modifiche» | env-wiring |
| H1-D06 | 04-05-26 | PROCESSO | Un solo branch main allineato al plan | MATTEO | ORIGINATA | stesso seq=8 | «un solo branch (main) perfettamente allineato» | branch-hygiene |
| H1-D07 | 04-05-26 | TESTING | Eseguire TEST_PLAN post-RLS dopo report | MATTEO | ORIGINATA | `d04a81f5…5532` seq=1 | «segui questo file per eseguire i test» | test-strategy |
| H1-D08 | 04-05-26 | TESTING | Collaudo cross-tenant: vede solo tenant B | MATTEO | ORIGINATA | stesso seq=13 | «vedo solo le prenotazioni di utente B» | multi-tenant-qa |
| H1-D09 | 04-05-26 | AI-METODO | Checklist: «annullare» ≠ eliminare dal calendario | MATTEO | CORRETTIVA | stesso seq=18 | «annullare non è termine corretto» | vocabulary-precision |
| H1-D10 | 04-05-26 | IMPOSTAZIONI | Plan Impostazioni ristorante: domande prima | MATTEO | ORIGINATA | `607a9e94…4ab4` seq=1 | «fammi domande… prima di svolgerlo» | plan-steering |
| H1-D11 | 04-05-26 | IMPOSTAZIONI | Eseguire plan impostazioni dopo Q&A | MATTEO | APPROVATA | stesso seq=4 | «procedi con l'esecuzione del plan» | plan-execution |
| H1-D12 | 04-05-26 | PRODOTTO | Esiste pagina Prenota? (scoperta prodotto) | MATTEO | ORIGINATA | `afea1729…254e` seq=1 | «è prevista una pagina "prenota"» | product-discovery |

### 05-05 — PWA/gating, Menu admin, vista giorno

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H1-D13 | 05-05-26 | VENDITA | Plan PWA + gating licenza SaaS | MATTEO | APPROVATA | `f50fa5d5…4707` seq=1+3 | «esegui il plan con scrupolo e dettaglio» | saas-gating |
| H1-D14 | 05-05-26 | VENDITA | Tenant esistenti → `active` | MATTEO | ORIGINATA | stesso seq=4 | «metti active sui tenant gia presenti» | tenant-activation |
| H1-D15 | 05-05-26 | FLUSSO | Calendario sempre visibile anche vuoto | MATTEO | ORIGINATA | stesso seq=14 | «calendario rimanga sempre visualizzato» | calendar-empty-state |
| H1-D16 | 05-05-26 | FLUSSO | Blocco prenotazioni senza orario | MATTEO | ORIGINATA | stesso seq=14 | «impedite le prenotazioni che non hanno orario» | booking-validation |
| H1-D17 | 05-05-26 | PRODOTTO | Tab Menu ingredienti: domande pre-plan | MATTEO | ORIGINATA | `84277a48…a12aef` seq=1 | «fammi domande… prima di eseguire» | plan-steering |
| H1-D18 | 05-05-26 | PRODOTTO | Commit di partenza + esegui plan Menu | MATTEO | APPROVATA | stesso seq=3 | «commit di partenza ed esegui il plan» | safe-start |
| H1-D19 | 05-05-26 | FLUSSO | Sezione card solo del giorno selezionato | MATTEO | ORIGINATA | `ad1077f9…8e42` seq=1 | «solo le card… presenti nel giorno» | day-digest |
| H1-D20 | 05-05-26 | FLUSSO | Ordine card per orario inizio | MATTEO | ORIGINATA | stesso seq=2 | «in alto quelle che iniziano prima» | day-digest |
| H1-D21 | 05-05-26 | PRODOTTO | Due zone: tipi di prenotazione distinti | MATTEO | ORIGINATA | stesso seq=8 | «due sezioni… diversi tipi di prenotazione» | booking-type-split |
| H1-D22 | 05-05-26 | PRODOTTO | Prezzo/persona e totale su card menù | MATTEO | ORIGINATA | stesso seq=10 | «prezzo a persona e prezzo totale» | pricing-visibility |

### 06-05 — Fasce orarie, seed menu, sfondo Prenota (picco densità)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H1-D23 | 06-05-26 | FLUSSO | Card prenotazioni in colonne per fascia | MATTEO | ORIGINATA | `97e72333…956a` seq=1 | «incolonnate sotto alla rispettiva fascia» | time-slot-digest |
| H1-D24 | 06-05-26 | FLUSSO | Solo orario inizio decide la fascia | MATTEO | ORIGINATA | stesso seq=1 | «consideriamo solo orario inizio» | time-slot-rules |
| H1-D25 | 06-05-26 | UI-UX | Colori fascia: verde/arancio/azzurro | MATTEO | ORIGINATA | stesso seq=1 | «verde… arancione… azzurro» | time-slot-visual |
| H1-D26 | 06-05-26 | UI-UX | Sticky header desktop; mobile come prima | MATTEO | CORRETTIVA | stesso seq=5 | «da mobile… rimanere come era prima» | responsive-split |
| H1-D27 | 06-05-26 | IMPOSTAZIONI | Sezione «Imposta Fasce Orarie» + no overlap | MATTEO | ORIGINATA | stesso seq=15 | «tuteli utente da… sovrapposizione» | settings-validation |
| H1-D28 | 06-05-26 | IMPOSTAZIONI | Selettore orario 24H, non AM/PM | MATTEO | ORIGINATA | stesso seq=16 | «no AM - PM… formato… 24H» | time-format |
| H1-D29 | 06-05-26 | FLUSSO | Fasce che attraversano mezzanotte | MATTEO | CORRETTIVA | stesso seq=20 | «00:00… interpretati come notte» | overnight-slots |
| H1-D30 | 06-05-26 | PRODOTTO | Nuova azienda: solo categorie, menu vuoto | MATTEO | ORIGINATA | `1abde109…1e51` seq=1 | «menù ingredienti vuoto… solo le categorie» | tenant-defaults |
| H1-D31 | 06-05-26 | UI-UX | Bottone Aggiungi sempre visibile | MATTEO | CORRETTIVA | stesso seq=3 | «bottone deve essere sempre visibile» | empty-state-ux |
| H1-D32 | 06-05-26 | PRODOTTO | Sfondo Prenota selezionabile da admin | MATTEO | ORIGINATA | `0b8acc2b…8147` seq=63 | «selezionare 1 immagine… sfondo… prenota» | prenota-background |
| H1-D33 | 06-05-26 | PRODOTTO | Preset Immagini vs Gradienti | MATTEO | ORIGINATA | `c740deea…ec41` seq=1 | «due pulsanti… immagini… gradienti» | prenota-background |
| H1-D34 | 06-05-26 | FLUSSO | Orari Prenota da Impostazioni admin | MATTEO | ORIGINATA | `68d094f2…8f87` seq=7 | «prendere queste info da pagina admin» | public-hours-sync |
| H1-D35 | 06-05-26 | UI-UX | Nome ristorante MAIUSCOLO: wrap ogni 13 | MATTEO | ORIGINATA | `6db37aea…c569` seq=52 | «andare a capo ogni 13 caratteri» | edge-case-ux |

### 07-05 — Default tenant, campi vuoti, consegna esterna

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H1-D36 | 07-05-26 | PRODOTTO | Default categorie su nuovo slug | MATTEO | ORIGINATA | `e075240f…decb` seq=1 | «ogni nuovo utente… categorie di defoult» | tenant-defaults |
| H1-D37 | 07-05-26 | SICUREZZA | Domanda: delete user = wipe tenant? | MATTEO | ORIGINATA | stesso seq=2 | «elimino anche suo tenant… tutti i suoi dati» | data-lifecycle |
| H1-D38 | 07-05-26 | IMPOSTAZIONI | Campi nuova azienda vuoti, no default | MATTEO | ORIGINATA | `637582e7…d92f` seq=1 | «campi devono essere vuoti… eliminiamoli» | clean-onboarding |
| H1-D39 | 07-05-26 | PROCESSO | Consegna a programmatore esterno (plan) | MATTEO | APPROVATA | `8bcee491…d007` seq=2 | «consegna… a programmatore amico» | external-handoff |
| H1-D40 | 07-05-26 | UI-UX | Paginazione texture + frecce | MATTEO | ORIGINATA | `637582e7…d92f` seq=6 | «due frecce… tra le due pagine» | texture-pagination |

### 08–09-05 — Temi, design system, effetti UI

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H1-D41 | 08-05-26 | AI-METODO | Report alfabeto UI per altri agenti | MATTEO | ORIGINATA | `34daa915…20fe7` seq=1 | «report… per informare agente… estetica» | design-handoff |
| H1-D42 | 09-05-26 | IMPOSTAZIONI | Sezione «Seleziona tema app» + slot | MATTEO | ORIGINATA | `43b441a0…ce4c9` seq=1 | «preview con nome del tema» | theme-picker |
| H1-D43 | 09-05-26 | AI-METODO | Skill temi da screen (per altri agenti) | MATTEO | ORIGINATA | `aa73a875…0129` seq=7 | «crea un file di skills… dopo screen» | skill-authoring |
| H1-D44 | 09-05-26 | UI-UX | Occhio su anteprima tema: click vs select | MATTEO | ORIGINATA | `ecd10394…1d50` seq=8 | «icona occhio… selezionare la card» | theme-preview-ux |

### 10–15-05 — Brevo, shell laterale, alert, Classic/Pro, meta-skill

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H1-D45 | 10-05-26 | PRODOTTO | Email conferma prenotazione | MATTEO | ORIGINATA | `29ad14a8…af8b` seq=2 | «Conferma Prenotazione… andata a buon fine» | transactional-email |
| H1-D46 | 10-05-26 | PRODOTTO | Provider email = Brevo, non Supabase | MATTEO | CORRETTIVA | stesso seq=3 | «non useremo supabase… configurare brevo» | email-provider |
| H1-D47 | 12-05-26 | PRODOTTO | Plan Sidebar + CRM Clienti (domande prima) | MATTEO | APPROVATA | `164890af…afbe` seq=1 | «prima di eseguire… fammi domande» | admin-shell |
| H1-D48 | 12-05-26 | PRODOTTO | Delete clienti in CRM (app+DB) | MATTEO | ORIGINATA | stesso seq=5 | «eliminare i clienti (da app e da DB)» | crm-crud |
| H1-D49 | 12-05-26 | AI-METODO | Debug agente Analytics: report prima di fix | MATTEO | ORIGINATA | `99e713d3…487b` seq=2 | «non modificare… senza prima dirmi cosa non va» | agent-review |
| H1-D50 | 13-05-26 | AI-METODO | Handoff tavoli/sale: solo prompt, no exec | MATTEO | ORIGINATA | `bbb03e4b…0446` seq=2 | «non devi eseguire… solo… handoff» | prompt-orchestration |
| H1-D51 | 14-05-26 | FLUSSO | Home senza sottotab degli altri nav | MATTEO | ORIGINATA | `695b7eaa…e95e` seq=2 | «quando clicco home non… sotto tab» | admin-nav-ux |
| H1-D52 | 14-05-26 | AI-METODO | Feedback: chat usata per migliorare skill | MATTEO | ORIGINATA | stesso seq=17 | «migliorare sistema di skills» | skill-evolution |
| H1-D53 | 14-05-26 | FLUSSO | Alert orario passato all’accettazione | MATTEO | ORIGINATA | `0095dbe6…099a9d` seq=1 | «alert… orario… passato… ok o annulla» | past-time-guard |
| H1-D54 | 14-05-26 | FLUSSO | Stesso alert anche da form admin | MATTEO | ORIGINATA | `62058864…56a0` seq=3 | «anche quando… form in pagina admin» | past-time-guard |
| H1-D55 | 15-05-26 | VENDITA | Pro: nascondere fasce in Impostazioni | MATTEO | ORIGINATA | `19eec9c5…4951` seq=1 | «versione "pro"… sezione… non… visibile» | edition-gating |
| H1-D56 | 15-05-26 | FLUSSO | ServiceSlots = stesse regole di booking slots | MATTEO | ORIGINATA | stesso seq=3 | «stesse funzionalità… stessa tabella» | slots-unification |
| H1-D57 | 15-05-26 | AI-METODO | Skill linguaggio utente (leggera) | MATTEO | ORIGINATA | stesso seq=3 | «file di skill di linguaggio con utente» | user-language |
| H1-D58 | 15-05-26 | IMPOSTAZIONI | Fasce notturne anche in RestaurantSettings | MATTEO | ORIGINATA | stesso seq=5 | «fasce che superano la mezzanotte» | overnight-slots |

**Totale decisioni catalogate: 58.** Le centinaia di messaggi UI «riduci di 1/3 / annulla / allinea» sono agency (sez. 2), non decisioni di prodotto ripetute.

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| H1-A01 | M→A | DIRETTA | Annulla inserimento menù in card + layout colonne | accettata | `0b8acc2b…` seq=2 |
| H1-A02 | M→A | DIRETTA | «annulla tutta questa modifica» sfondo | accettata | stesso seq=61 |
| H1-A03 | M→A | DIRETTA | Annulla/rifai logo ingigantito «casino» | accettata | `6db37aea…` seq=25 |
| H1-A04 | M→A | DIRETTA | Serie annulla 1/3→1/5→1/12→1/15 su logo | parziale | stesso seq=36–39 |
| H1-A05 | M→A | DIRETTA | Annulla bordo caselle Menu | accettata | `84277a48…` seq=27 |
| H1-A06 | M→A | DIRETTA | «non hai capito annulla» riduci metà elemento | accettata | `f39fd85a…` seq=2 |
| H1-A07 | M→A | DIRETTA | Annulla: intendevo bottone Oggi = navigazione mese | accettata | `f50fa5d5…` seq=8–9 |
| H1-A08 | M→A | DIRETTA | Card sbagliata per colore | accettata | `84277a48…` seq=20 |
| H1-A09 | M→A | DIRETTA | Annulla tutte le responsive su pulsanti | accettata | `e553f916…` seq=17 |
| H1-A10 | M→A | DIRETTA | Annulla modifiche modal | accettata | `0eef6709…` seq=79 |
| H1-A11 | M→A | DIRETTA | «fai le cose come te le chiedo» (card + copy) | accettata | `97e72333…` seq=27 |
| H1-A12 | M→A | DIRETTA | «modifiche idiote» — solo testo nota | accettata | `1abde109…` seq=20 |
| H1-A13 | M→A | DIRETTA | Cambia modello: «niente non sei capace» | ignota | stesso seq=21–23 (poi riprende) |
| H1-A14 | M→A | DIRETTA | Hover non deve cambiare; solo selected | accettata | `e394ed6c…` seq=18 |
| H1-A15 | M→A | DIRETTA | «ti avevo detto» timer shimmer 2s | accettata | stesso seq=9 |
| H1-A16 | M→A | DIRETTA | Checklist: termine «Annullare» sbagliato | accettata | `d04a81f5…` seq=18 |
| H1-A17 | M→A | DIRETTA | Provider email: no Supabase, sì Brevo | accettata | `29ad14a8…` seq=3 |
| H1-A18 | M→A | DIRETTA | Debug Analytics: niente codice prima del report | accettata | `99e713d3…` seq=2 |
| H1-A19 | M→A | DIRETTA | Handoff: non eseguire, solo foglio | accettata | `bbb03e4b…` seq=2 |
| H1-A20 | M→A | DIRETTA | Orario ancora sbagliato post-fix: stop codice | accettata | `b513a8df…` seq=2 |
| H1-A21 | M↔M | DIRETTA | Testo fascia bianco→nero→«scusami» bianco | accettata | `97e72333…` seq=12–13 |
| H1-A22 | A→M | DEDOTTA | Dopo sticky: «ok ora funziona, ma mobile…» | accettata | stesso seq=4→5 |
| H1-A23 | A→M | DEDOTTA | «va bene così per ora» chiude iterazione card | accettata | `ad1077f9…` seq=24→26 |
| H1-A24 | A→M | DEDOTTA | Dopo spiegazione architettura fasce → file considerazioni | accettata | `19eec9c5…` seq=2→3 |
| H1-A25 | M↔M | DIRETTA | Cambia idea su spazio bianco footer Prenota | accettata | `68d094f2…` seq=26 (annulla dopo insiste) |

**Sintesi agency:** `M→A` dominante (36 msg con «annulla» nel periodo; campione sopra). `A→M` solo **DEDOTTE** (REDACTED). Poche `M↔M` esplicite (gusto testo; abandon spazio footer).

---

## Sezione 3 — Skill signals

| Skill | Livello provvisorio | Prova in H1 | Contro-evidenza cercata |
|-------|---------------------|-------------|-------------------------|
| `project-bootstrap` | L2 | D01–D02 split setup | — |
| `visual-direction` | L2 | D03–D04 Dribbble | molte iterazioni pixel (A01–A10) |
| `plan-steering` | L3 | D10, D17, D47 domande prima | L3 ok: A18/A19 stop esecuzione |
| `multi-tenant-qa` | L3 | D08 collaudo cross-tenant a mano | cercata: in H1 non risulta falsa sicurezza; resta |
| `test-strategy` | L2 | D07 checklist Suite 2 | delega suite 1 all’agente |
| `time-slot-digest` / `overnight-slots` | L3 | D23–D29, D58 | A21 ripensamento estetico |
| `tenant-defaults` | L2 | D30, D36, D38 | — |
| `prenota-background` | L2 | D32–D33 | micro-annulla su texture (A01–A02) |
| `saas-gating` / `edition-gating` | L2 | D13–D14, D55 | — |
| `email-provider` | L3 | D46 correzione provider | blocco Brevo sender (sez.4) |
| `admin-shell` / `crm-crud` | L2 | D47–D48 | errori tema shell segnalati da lui (seq=5) |
| `agent-review` / `prompt-orchestration` | L3 | D49–D50, D52 | — |
| `past-time-guard` | L2 | D53–D54 | bug orario post-fix (A20) |
| `user-language` | L2 | D02, D57 | — |
| `skill-authoring` | L4? | D43 chiede skill da screen | **decade a L2 qui**: non c’è nel perimetro il file di regola nato; verificare in M1/A* |
| Vocabolario comando ufficiale | L0 | assente (tranne `procedi`/`fai report` tardi) | nasce dopo (H2/H3) |

---

## Sezione 4 — Contro-evidenze

1. **Micro-gestione UI ripetuta:** mediana 62 caratteri; chat da 40–60 messaggi su padding/logo. Skill di product scoping alta (fasce, tenant) **coesiste** con loop «annulla / riduci 1/N» — non è autonomia di design system, è controllo pixel-per-pixel.
2. **MCP su URL PROD** (`rwuxgvld…`, `577624c4` seq=1) all’inizio del periodo: wiring «per lavorare», senza nel messaggio la distinzione TEST/PROD che oggi è regola dura. Contro-evidenza a `env-safety` L3+.
3. **Brevo sender bloccato** (`29ad14a8` seq=5–6): decide il provider giusto, poi si ferma sul requisito verifica mittente — decisione prodotto ok, esecuzione ops incompleta nel perimetro.
4. **Abandon dopo frustrazione** (`1abde109` seq=21 «niente non sei capace») poi riapre: segnale di soglia bassa su task UI banali.
5. **Cambio idea estetico esplicito** (testo bianco/nero fasce; annulla spazio footer dopo aver insistito): contro a «sempre sa cosa vuole visualmente».
6. **Classificazione corpus:** alcuni M-VOCE lunghi sono paste di risposte agente o bottone Cursor «Implement the plan as specified» — non sono scrittura sua. Non usati come decisioni ORIGINATE; segnalati in sez.6.

---

## Sezione 5 — Copertura dichiarata

| Voce | Numero |
|------|--------|
| File corpus nel perimetro | **1** (`prompts_CB-v2.jsonl`) |
| Messaggi nel filtro date | **1449** |
| M-VOCE dichiarati dal tracking | **1032** |
| M-VOCE aperti/letti | **1032 (100%)** — indice chat + export long/spy/productish + lettura integrale chat tematiche |
| M-VOCE con `has_secret` (letti, non citati) | 47 |
| M-REGIA / M-PASTE / M-OK | 0 / 402 campionati / 15 tutti |
| File illeggibili | 0 |

---

## Sezione 6 — Lacune e handoff

- **H2/H3:** stesso metodo su 16-05→31-05 e 01-06→06-08; lì nascerebbero `lavoro ok` / `senior` (P0-EX: 29-05) e la massa M-REGIA.
- **A1+:** i report pubblici partono dal 23-05 — questo H1 è l’unica fonte peso 1 per 27-04→15-05; S4 dovrà confrontare dove A inventa decisioni non presenti qui.
- **J1:** verificare se MCP PROD early e migrazioni default categorie risultano nei fatti git/DB.
- **M1:** verificare se la skill temi/linguaggio chiesta in D43/D57 è davvero diventata file (per rivalutare L4).
- **Limite date:** ~56% M-VOCE con `date_src=file` — non ragionare su singole giornate senza A/J.
- **False M-VOCE:** paste «Implement the plan…» e dump console mis-classificati; H2+ possono filtrarli meglio se lo script si aggiorna.

---

## Sezione 7 — Chiusura verso Matteo

In queste tre settimane hai acceso CalendarBackup-v2: dal setup grezzo al calendario a fasce, al menu vuoto per i nuovi locali, ai temi, fino a CRM/shell e all’idea Classic/Pro sulle fasce.
Hai collaudato tu il multi-tenant («vedo solo B») e hai già corretto gli agenti sul merito (Brevo, mezzanotte, termini sbagliati in checklist), non solo sull’estetica.
Il prezzo: tantissime chat corte a inseguire pixel; il vocabolario di comando di oggi quasi non esiste ancora — qui comandi ancora a frasi intere e a «commit e push».
