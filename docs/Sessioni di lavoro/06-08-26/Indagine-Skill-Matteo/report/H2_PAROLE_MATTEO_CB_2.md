# H2 — Parole di Matteo, CB-v2, 16-05 → 31-05

> **Ondata:** H2 · **Data:** 06-08-26 · **Regime:** scavo · **Peso fonti:** **1** (parole sue)
> **Perimetro:** `docs/_lavoro/Indagine-Corpus/prompts_CB-v2.jsonl` filtrato `2026-05-16`…`2026-05-31`
> **Metodo:** identico a H1 (PIANO §2.1 REDACTED, §3.3 attribuzione). Citazioni da `text_umano`; fonte = `chat_uuid` + `seq` + `date`. Mai citare `has_secret=true`.
> **Nota periodo:** dal 23-05 partono i report pubblici (A1/A2). Dove H e A divergono, **vince H** — divergenze esplicite in §4 / handoff S4.

---

## Numeri di ritmo (obbligatori H)

| Voce | Valore |
|------|--------|
| Messaggi nel perimetro | **871** |
| **M-VOCE** | **732** (di cui 9 `has_secret` → non citabili; **723** leggibili) |
| **M-REGIA** | **3** (29–31 maggio — inizio delega scrittura prompt strutturati) |
| **M-PASTE** | **127** |
| **M-OK** | **9** |
| Chat con almeno 1 M-VOCE | **116** |
| Media caratteri M-VOCE | **591** (media generale corpus CB-v2 ≈ 635 → **poco sotto**) |
| Mediana caratteri M-VOCE | **131** (coda lunga: 83 msg ≥1000, molti = prompt/CSS Apply incollati) |
| `date_src=msg` | **29/732** (~4%) — il resto è data file chat; **non ragionare su singole giornate senza A** |
| Picchi M-VOCE/giorno | 29-05 **146** · 31-05 **135** · 26-05 **91** · 23-05 **80** · 25-05 **76** |

**Vocabolario di comando in M-VOCE (conteggio substring):**

| Parola | Occorrenze H2 | Nota |
|--------|---------------|------|
| `prepara` | 49 | già operativo (anche `@docs/PREPARA_PROMPT_SKILL.md`) |
| `implementa` | 26 | |
| `fai report` | 26 | |
| `revisiona` | 24 | |
| `controverifica` | 9 | |
| `lavoro ok` | **2** | **nasce qui** (allineato P0-EX: prima volta 29-05) |
| `senior` | 2 | stesso periodo |
| `dammi follow` | 2 | |
| `ragioniamo` / `spiegamelo` / `blindatura` | **0** | ancora assenti |

---

## Sezione 1 — Decisioni

Decisioni **ad alta densità** (non ogni micro-fix UI). Ogni riga ha citazione verbatim ≤25 parole da `text_umano`.

### 16-05 → 22-05 — prima dei report pubblici (solo H)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H2-D01 | 16-05-26 | IMPOSTAZIONI | «Per sempre» = modifica base fascia, non limite | MATTEO | ORIGINATA | `715b70d0…` seq=2 | «quando selezioniamo per sempre… modifica vera e propria alle impostazioni di base» | fasce-orarie |
| H2-D02 | 16-05-26 | FLUSSO | Servizio chiuso = 0 turni, card fascia opaca | MATTEO | ORIGINATA | stesso seq=3 | «se servizio è chiuso è come se utente avesse messo 0 a turni» | servizio-chiuso |
| H2-D03 | 16-05-26 | UI-UX | Rimuovere copy «Per chiudere il servizio usa ✕» | MATTEO | CORRETTIVA | stesso seq=4 | «"Per chiudere il servizio usa il pulsante ✕…" rimuovi quel testo» | copy-delta-only |
| H2-D04 | 16-05-26 | UI-UX | Label «limiti impostati» non «limiti attivi» | MATTEO | SCELTA | `28f7b405…` seq=4 | «cambia da "limiti attivi" a "limiti impostati"» | copy-product |
| H2-D05 | 22-05-26 | SICUREZZA | Allineare TEST a PROD migrazioni 019–025 | MATTEO | ORIGINATA | `6efb4505…` seq=1 | «Se risponde rwuxgvld fermati» · «Non toccare produzione» | env-safety |
| H2-D06 | 22-05-26 | TESTING | Seed prenotazione 22-05 20:30 deve rifiutare | MATTEO | ORIGINATA | `2cea1a5a…` seq=4 | «form dovrebbe rifiutare… superamento disponibiltà fascia» | capacity-qa |
| H2-D07 | 22-05-26 | SICUREZZA | Query utenti/slug/edition: lui esegue su PROD | MATTEO | ORIGINATA | `671331a1…` seq=1 | «a db produzione no db test dammi le query poi le eseguo io» | owner-ops |

### 23-05 — promo multi-tenant, branch, admin (overlap A1)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H2-D08 | 23-05-26 | PRODOTTO | Tenere promo testuali; togliere omaggio automatico | MATTEO | ORIGINATA | `a048ae51…` seq=2 | «non ci siano tracce di minirustici o offerte che compaiono in automatico» | product-scoping |
| H2-D09 | 23-05-26 | PRODOTTO | La Ritrovo fuori scope; zero seed legacy | MATTEO | SCELTA | stesso seq=3 | «C. no sono in altro DB , LA Ritrovo reinizia senza promo» | multi-tenant-generic |
| H2-D10 | 23-05-26 | FLUSSO | DB pulito test+prod; niente COPY legacy | MATTEO | CORRETTIVA | stesso seq=6–7 | «voglio DB pulito e allineato» · «anche in prod non ho clienti» | data-migration |
| H2-D11 | 23-05-26 | PRODOTTO | Chiavi `booking_menu_promos` (rinomina vol-au-vent) | MATTEO | APPROVATA | `6cf9fa85…` seq=2 | «NON preservare dati promo legacy: niente COPY» | settings-model |
| H2-D12 | 23-05-26 | PROCESSO | Merge main→sidebar; lavoro sul branch sidebar | MATTEO | ORIGINATA | `96933c24…` seq=8 | «fai merge su branch sidebar laterale… lavoriamo su secondo branch» | branch-choice |
| H2-D13 | 23-05-26 | VENDITA | Walk-in/limite walk-in non in Classic | MATTEO | ORIGINATA | stesso seq=4 | «in classic version walkin e limite walkin non sono disponibili» | edition-gating |
| H2-D14 | 23-05-26 | PRODOTTO | Menu preselezionato per tipologia (no tavolo) | MATTEO | ORIGINATA | stesso seq=35–36 | «il menu non si può scegliere per prenota un tavolo» | booking-types |
| H2-D15 | 23-05-26 | UI-UX | Alert prima di cancellare categoria con ingredienti | MATTEO | ORIGINATA | stesso seq=24 | «non vedo alert prima di cancellamento» | delete-guard |
| H2-D16 | 23-05-26 | UI-UX | Preferiva 2 colonne: annulla layout agente | MATTEO | CORRETTIVA | `b7efbabf…` seq=8 | «preferivo layout a due colonne. annulla le modifiche» | modal-layout |
| H2-D17 | 23-05-26 | UI-UX | Annulla allineamento testo orizzontale modal | MATTEO | CORRETTIVA | stesso seq=9 | «annulla tutto ritorna a prima… ripristina il modal» | modal-layout |
| H2-D18 | 23-05-26 | UI-UX | Allineamento label: solo orizzontale, non verticale | MATTEO | CORRETTIVA | `251d1421…` seq=7 | «doveva cambiare solo allineamento orizzontale tra label e value» | modal-layout |
| H2-D19 | 23-05-26 | PROCESSO | Revisione promo: no merge main finché non revisionato | MATTEO | ORIGINATA | `a048ae51…` seq=14 | «ancora da revisionare… prima di applicare merge a main» | release-gate |
| H2-D20 | 23-05-26 | VENDITA | Posizionamento prenotazione solo Pro | MATTEO | APPROVATA | `251d1421…` seq=2 | «Posizionamento prenotazione: solo Pro» | edition-gating |

### 25-05 → 26-05 — Prenota v2 + Menu QR + XOR (overlap A1)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H2-D21 | 25-05-26 | UI-UX | Pill QR = navigazione, non filtro | MATTEO | ORIGINATA | `29430119…` seq=2 | «non funzionano come filtri… portano alla pagina direttamente» | menu-qr-nav |
| H2-D22 | 25-05-26 | UI-UX | Label campi fuori casella (inset→titolo esterno) | MATTEO | ORIGINATA | `40a6d84f…` seq=1 | «solo il value… titolo… fuori dalla casella ma vicino» | form-fields-ux |
| H2-D23 | 25-05-26 | PRODOTTO | Intolleranze = solo testo libero | MATTEO | ORIGINATA | stesso seq=6 | «utente potrà solo scrivere intolelranze come testo» | booking-form |
| H2-D24 | 25-05-26 | FLUSSO | Menu personalizzabile: tutto off, sceglie il cliente | MATTEO | ORIGINATA | stesso seq=12 | «tutti con stato off , sarà utente a selezionare i piatti» | compose-menu |
| H2-D25 | 26-05-26 | PRODOTTO | XOR: per modalità solo card **o** solo carosello | MATTEO | ORIGINATA | `559ae077…`/`87c698b5…` seq=17/4 | «deve diventare o card …» (flusso: non entrambi) | xor-presentation |
| H2-D26 | 26-05-26 | AI-METODO | Chiede se dato agente = fatto o problema | MATTEO | ORIGINATA | `559ae077…` seq=20 | «è un comportamento corretto o è sbagliato?» | critical-reading |

### 27-05 → 29-05 — skill system vivo, promo, env (overlap A2)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H2-D27 | 28-05-26 | AI-METODO | Analisi decisioni sue vs autonomia agenti | MATTEO | ORIGINATA | `868ffb7b…` seq=1–2 | «quali cose faccio piu spesso io e quali fanno piu spesso agenti» | meta-reflection |
| H2-D28 | 28-05-26 | AI-METODO | Annulla modifiche skill; 1 file solo per plan | MATTEO | CORRETTIVA | stesso seq=5 | «annulla tutte le modifiche a skill system. fammi solo 1 file» | skill-hygiene |
| H2-D29 | 28-05-26 | AI-METODO | File = analisi/dati, no istruzioni operative | MATTEO | CORRETTIVA | stesso seq=6 | «senza dare istruzioni operative ma solo come analisi» | skill-hygiene |
| H2-D30 | 29-05-26 | PRODOTTO | Promo → Personalizza form; N promo / 1 per target | MATTEO | ORIGINATA | `a3903826…` seq=1 | «N promo , ma solo 1 potrà essere abbinata a modalità» | promo-placement |
| H2-D31 | 29-05-26 | PROCESSO | Nascita FOLLOW_UP come file skill snello | MATTEO | ORIGINATA | stesso seq=3 | «file… tenere traccia di follow up… abbiniamo il report» | follow-up-system |
| H2-D32 | 29-05-26 | UI-UX | Multi-select promo 0/1/2/tutti (non «a scelta tra») | MATTEO | CORRETTIVA | `861135a5…` seq=7 | «voglio poter sceglerne 1 o nessuno o tutti o 2» | promo-multi-select |
| H2-D33 | 29-05-26 | UI-UX | Conflitto promo: modal sostituzione, non silenzio | MATTEO | ORIGINATA | `a3903826…` seq=9 · `3b1d4a6e…` seq=2 | «sistema non fa niente» · «non vedo il modal» | modal-pattern |
| H2-D34 | 29-05-26 | PROCESSO | Report unificato prepara+esecutore+revisione | MATTEO | ORIGINATA | `a707a4ad…` seq=6 | «unico report unificato per sessioni di agenti» | report-unificato |
| H2-D35 | 29-05-26 | PROCESSO | Commit cita documenti da revisionare | MATTEO | ORIGINATA | `a3903826…` seq=10 | «citando nel commit i documenti per revisionare» | release-hygiene |
| H2-D36 | 29-05-26 | SICUREZZA | `dev`→TEST; `npm run dev:prod`→PROD | MATTEO | SCELTA | `9a420176…` seq=3–4 | «avvio dev server e punta a db test… npm run dev:prod» | env-workflow |
| H2-D37 | 29-05-26 | IMPOSTAZIONI | Autosave solo debug; prod = footer + alert pubblico | MATTEO | ORIGINATA | `b59eebe2…` seq=5 | «in prod… salvataggio… footer» · «dati… esposti al pubblico» | admin-save |
| H2-D38 | 29-05-26 | AI-METODO | Mockup HTML multi-stato «quasi sempre» | MATTEO | APPROVATA | stesso seq=5 | «mi serve quasi sempre… scegliere tra tipi di flusso» | prepara-mockup |
| H2-D39 | 29-05-26 | UI-UX | QA validazione Prenota: chiusura+lampeggio+telecamera | MATTEO | CORRETTIVA | `96d4eedb…` seq=3–4,6 | «niente. telecamera non si muove» → «ora si sono chiuse, lampeggiano» | form-validation-ux |
| H2-D40 | 29-05-26 | UI-UX | Lampeggio errore: rosso→arancione | MATTEO | SCELTA | stesso seq=6 | «cambia colore lampeggio, la rosso a arancione» | form-validation-ux |

### 30-05 → 31-05 — Menu QR ciclo, viewport, sfondo Prenota

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H2-D41 | 30-05-26 | PRODOTTO | QR: fix strutturali prima; carosello/card dopo | MATTEO | SCELTA | `9b3c44ba…` seq=4 | «sì, ma non ora. ora… fix strutturale della pagina» | product-scoping |
| H2-D42 | 30-05-26 | UI-UX | Post-salva QR: dialog «sostituisci stampa/link» | MATTEO | SCELTA | stesso | «finestra di dialogo avvisa… sostituire link o stampa» | modal-pattern |
| H2-D43 | 30-05-26 | AI-METODO | Decisioni a opzioni A/B/C o Sì/No + raccomandata | MATTEO | ORIGINATA | stesso | «proponimi gia opzioni… a- b -c … con opzione raccomandata» | decision-ux |
| H2-D44 | 30-05-26 | UI-UX | Home QR = 1 sfondo; header solo pagina categoria | MATTEO | CORRETTIVA | `50d6e0de…` seq=11 | «home menu ha solo 1 immagine… header SOLO per nuova pagina» | menu-qr-homepage |
| H2-D45 | 30-05-26 | AI-METODO | Non aggiungere al prompt cose non chieste | MATTEO | CORRETTIVA | stesso seq=4 | «non aggiugnere cose che non ti ho chiesto» | prompt-discipline |
| H2-D46 | 31-05-26 | TESTING | QA Matteo checklist 8 note Menu QR (KO 1/3b/6/8) | MATTEO | ORIGINATA | `cc28bf22…` seq=2 | tabella esiti OK/KO nel messaggio | owner-qa |
| H2-D47 | 31-05-26 | UI-UX | QR griglia 2 col 699–1025; tablet fino a desktop | MATTEO | SCELTA | `4cedb88b…` seq=9–10 | «tra i 699 e i 1025 px… griglia a 2 colonne» | responsive-qr |
| H2-D48 | 31-05-26 | UI-UX | Sfondo Prenota: preferisce che scorra (revert fixed) | MATTEO | M↔M / SCELTA | `392a6ae1…` seq=7 | «revertiamo preferisco che scorra lo sfondo» | prenota-bg |
| H2-D49 | 31-05-26 | AI-METODO | Scelte da fare all’inizio del prompt, non in fondo | MATTEO | ORIGINATA | `ae044051…` seq=3 | «scelte da fare non alla fine» | prepara-prompt |
| H2-D50 | 31-05-26 | AI-METODO | Agente esterno asset: solo genera, no repo/report | MATTEO | ORIGINATA | stesso seq=9 | «non ha accesso al repository… solo generare» | multi-agent-roles |
| H2-D51 | 31-05-26 | PROCESSO | Push/merge per testare da tablet/mobile reale | MATTEO | ORIGINATA | `cc28bf22…` seq=14 | «per testare… push e merge con main… da mobile» | release-for-qa |
| H2-D52 | 31-05-26 | AI-METODO | Chiede perché agente si è confuso + consiglio | MATTEO | ORIGINATA | stesso seq=19 | «spiega… perchè ti sei conuso… come avresti lavorato meglio» | errori-processo |

**Nota classificazione:** molti M-VOCE lunghi (≥1000) sono prompt di handoff che lui ha scritto/incollato senza marker `Profilo:`+`Modalità:` → restano **M-VOCE** per §3.3, ma misurano **regia operativa**, non prosa libera. I 3 M-REGIA veri sono del 29–31.

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| H2-A01 | M→A | DIRETTA | Annulla layout 1 colonna → ripristina 2 colonne modal | accettata | `b7efbabf…` seq=8–9 |
| H2-A02 | M→A | DIRETTA | Allineamento label: rifiuta side-effect verticale | accettata | `251d1421…` seq=7,9 |
| H2-A03 | M→A | DIRETTA | DB: rifiuta migrazione «copia legacy»; vuole pulito | accettata | `a048ae51…` seq=6–7 |
| H2-A04 | M→A | DIRETTA | Promo multi-select: corregge «a scelta tra» | accettata | `861135a5…` seq=7 |
| H2-A05 | M→A | DIRETTA | «non vedo il modal» conflitto promo | accettata | `3b1d4a6e…` seq=2 |
| H2-A06 | M→A | DIRETTA | QA validazione: «niente» finché non vede effetti | accettata | `96d4eedb…` seq=4→6 |
| H2-A07 | M→A | DIRETTA | Skill system: annulla over-edit, 1 file analisi | accettata | `868ffb7b…` seq=5–6 |
| H2-A08 | M→A | DIRETTA | Prompt asset: «non aggiungere 3ª immagine» | accettata | `50d6e0de…` seq=4 |
| H2-A09 | M→A | DIRETTA | Header vs home QR: confusione agente | accettata | `50d6e0de…` seq=11 |
| H2-A10 | M→A | DIRETTA | Viewport: lavoro non richiesto / ripristina scope | accettata | `4cedb88b…` seq=5 |
| H2-A11 | M↔M | DIRETTA | Stesso thread: «non annullare scroll fondo» dopo «ripristina» | accettata | `4cedb88b…` seq=5→6 |
| H2-A12 | M↔M | DIRETTA | Sfondo Prenota: fixed → preferisce scroll | accettata | `392a6ae1…` seq=7 |
| H2-A13 | M→A | DIRETTA | Header «sistemato» ma non lo è → stop + report | accettata | `0e3dee45…` seq=5–8,10 |
| H2-A14 | A→M | DEDOTTA | Env TEST vs PROD: chiede conferma workflow | accettata | `9a420176…` seq=2→3 («ok allora») |
| H2-A15 | A→M | DEDOTTA | Capisce spiegazione cache/PWA → chiede file analisi | accettata | `868ffb7b…` seq=2→3 |
| H2-A16 | M→A | DIRETTA | «annulla tutto» su padding revisore | accettata | `644456b9…` seq=8 |

**Spy-grep grezzo:** 74 hit su parole spia; dopo lettura, ~metà sono falsi positivi (testo «Annulla» UI nei prompt, «Don't stop» di Cursor plan). Agency sopra = solo casi verificati in contesto.

---

## Sezione 3 — Skill signals (provvisori)

| Skill | Livello | Prova | Contro-evidenza in §4 |
|-------|---------|-------|------------------------|
| `product-scoping` | **L3** | D08–D10, D25, D41 ORIGINATE + M→A | CE1 (scope oscillante viewport 31-05) |
| `env-safety` | **L3** | D05, D07, D36 + stop su PROD | CE2 (confusione TEST/PROD fino al 29) |
| `owner-qa` | **L3** | D39–D40, D46 checklist KO/OK | CE3 (QA mobile solo dopo push) |
| `modal-pattern` / `promo-placement` | **L3** | D30–D33, D42 | CE4 (bug silenzioso scoperto in QA) |
| `prepara-prompt` / `multi-agent-roles` | **L2→L3** | D34, D43, D49–D50; M-REGIA nasce | CE5 (profilo agente non chiaro senza @file) |
| `copy-delta-only` / `prompt-discipline` | **L3** | D03, D45, A08 | — cercata: pattern stabile nel periodo |
| `xor-presentation` | **L2** | D25 flusso ORIGINATO | — |
| `edition-gating` | **L2** | D13, D20 | — |
| `release-gate` / `release-hygiene` | **L2** | D19, D35, D51 | CE6 (merge sotto pressione test hardware) |
| `meta-reflection` | **L2** | D27–D29 (28-05) | CE7 (annulla over-scope skill stesso giorno) |
| `form-validation-ux` | **L3** | D39–D40 insistenza QA | — |
| `prenota-bg` | **L2** | D48 SCELTA con revert | CE1/CE8 oscillazione fixed vs scroll |

**Ritmo:** mediana corta (131) + media 591 = lavora a **micro-correzioni** alternate a **blocchi di regia** (prompt). M-OK rari (9): ratifica ancora verbale («ottimo», «fai commit»), non ancora vocabolario secco dominante. `lavoro ok` compare ma è **embrionale** (2).

---

## Sezione 4 — Contro-evidenze (e divergenze H↔A per S4)

Contro-evidenze **sue** (non dell’agente):

| ID | Cosa | Fonte |
|----|------|-------|
| CE1 | Scope viewport 31-05: chiede ripristino, poi «non annullare», poi nuove soglie — tre correzioni di rotta nello stesso thread | H2-A10–A11 · `4cedb88b…` |
| CE2 | Fino al 29-05 chiede chiarimenti su come non confondere TEST/PROD | `9a420176…` seq=2 |
| CE3 | Per collaudare da tablet deve push/merge: il collaudo hardware guida il release | `cc28bf22…` seq=14 |
| CE4 | Scopre bug promo conflitto solo dopo uso reale («sistema non fa niente») | `a3903826…` seq=9 |
| CE5 | Dubbio su quanto il profilo agente sia «sicuro» senza linkare file | `392a6ae1…` seq=9 |
| CE6 | Pressione emotiva su agente che dichiara fix non vero (tono duro) | `0e3dee45…` seq=8 |
| CE7 | Stesso giorno: chiede analisi skill, poi annulla tutto tranne 1 file | `868ffb7b…` seq=4–5 |
| CE8 | Sfondo Prenota: preferenza fixed vs scroll non stabile | `392a6ae1…` seq=7 · handoff `ae044051…` |

### Divergenze esplicite vs A1/A2 (peso 1 = H) — handoff **S4**

| Tema | Cosa dice A (peso 3) | Cosa dicono le sue parole (H) | Verdetto |
|------|----------------------|------------------------------|----------|
| Promo vol-au-vent / DB pulito | A1: molte decisioni `INCERTO` / sintesi Q | H: risposte A/B/C e «DB pulito test+prod» **ORIGINATA** | **H vince** — alza autonomia Matteo su A1-D09…D12 |
| Annulla layout modal 23-05 | A1-D22 InfoRow / allineamento | H: «preferivo layout a due colonne» + doppio annulla | **Allineati**; H dà citazione più dura |
| Promo multi-select | A2-D45 parafrasi report | H: frase identica seq=7 | **Conferma** A2 |
| Modal conflitto | A2-D46 | H: «non vedo il modal» | **Conferma** A2 |
| Autosave debug / prod footer | A2-D51 | H: verbatim `b59eebe2` seq=5 | **Conferma** A2 |
| Prezzo carosello D09 vs D10 | A2 nota conflitto report | In H2 **non** emerge una coppia chiara «nascosto vs × ospiti» nelle voci brevi campione | **Aperto a J1/H3** — non forzare |
| Overlay card ingredienti pivot | A2-A14/A19 | In H2 i prompt lunghi 29-05 già descrivono overlay/scroll come obiettivo | Possibile che A sovra-narri il «no→sì»; **verificare in H3 o transcript grezzo** |
| «Agente ha sistemato» header | Report A tendono a softare | H: «FAI REPORT… DI MERDA» + «sistemato ma NON lo è» | **H più severo** — S5/S4 |

---

## Sezione 5 — Copertura dichiarata

| Voce | Numero |
|------|--------|
| Messaggi nel perimetro (find/jsonl) | **871** |
| M-VOCE aperti (leggibili) | **723 / 723** (100% dei non-secret) |
| M-VOCE secret non citati | **9** (dichiarati, non aperti in citazione) |
| M-REGIA campionati | **3 / 3** (100%) |
| M-OK campionati | **9 / 9** (100%) |
| M-PASTE | contati **127**, non letti uno per uno (regime H1: campionati) |
| Dump giorno | 14 file `voce_YYYY-MM-DD.txt` in `_stato/_tmp_H2/` |
| Estratti supporto | `long_voce` 267 · `med_decisionish` 139 · `spy_hits` 74 · `key_quotes` 141 |

**Copertura M-VOCE: totale misurata.** Decisioni in §1 = scavo selettivo ad alta densità (non ogni micro-pixel). Agency = solo casi verificati (non grep grezzo).

---

## Sezione 6 — Lacune e handoff

| Lacuna | Serve a |
|--------|---------|
| Solo ~4% timestamp msg: giornate affollate (23/25/26/29/31) da incrociare con A1/A2/A3 | S3 timeline |
| Conflitto prezzo carosello A2-D09/D10 non risolto da H2 | J1 + eventuale H3 |
| Overlay Prenota «no→sì» narrato da A2: serve rilettura prompt prepara del 29 mattina | S4 |
| 9 secret: potrebbero contenere decisioni env — non citabili | resta buco dichiarato |
| M-REGIA ancora 3: esplode in H3 (113 nel corpus) | H3 confronto obbligatorio |
| Parallelo Trade-Analyst a maggio (piano §2.2) **non** in questo jsonl | H5 |
| `_tmp_H2/` è materiale di lavoro agente — non deliverable | AGG può ignorarlo |

---

## Sezione 7 — Chiusura verso Matteo

In queste due settimane e mezza hai tenuto in mano prodotto e collaudo: hai detto cosa tenere e cosa buttare sulle promo, hai bloccato layout che non volevi, e hai firmato i KO con checklist tue sulla pagina Menu QR e sulla Prenota.  
Il metodo multi-agente (prepara → esegue → revisiona, report unico, follow-up) nasce qui, mentre «lavoro ok» è ancora raro: comandi più spesso con «prepara / revisiona / fai report» e micro-fix a voce.  
Dove i report degli agenti ti dipingevano incerto sulle promo o molli sull’agente che diceva «sistemato», le tue chat dicono il contrario: sceglievi tu e ti arrabbiavi se il fix non si vedeva sullo schermo.
