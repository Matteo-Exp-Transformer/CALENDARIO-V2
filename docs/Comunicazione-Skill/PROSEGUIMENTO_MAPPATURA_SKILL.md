# Proseguimento — Mappatura & blindatura dello skill system (lavoro lungo)

> **A cosa serve questo file.** È il **punto di ripresa** del lavoro lungo iniziato il 04-06-26:
> trasformare lo skill system in aree mappate, con senso chiuso e file ben tagliati. Ogni nuova
> sessione **senior** che continua questo lavoro **parte da qui** — non ri-decide le regole (sono già
> prese), applica il pattern alla prossima area. Aggiornare lo stato sotto a fine di ogni sessione.

---

## LO SCOPO (tienilo a mente per ogni area — è triplo, non solo «scrivere doc»)

Ogni sessione su un'area persegue **tre obiettivi insieme**, non solo il primo:

1. **MAPPARE** — dare all'area un senso chiuso: a che serve, chi fa cosa, flusso utente+dati, divieti
   voluti, mappa «tocchi X → apri Y». (la ricetta sotto)
2. **TESTARE per BLINDARE** — verificare nel codice ciò che scrivi (**codice = verità**, non fidarsi
   dei report vecchi: spesso sono disallineati) e, dove l'area lo richiede, mettere/segnare i test che
   bloccano i comportamenti voluti. «Blindata» ha **due livelli**: *doc* (un sub-agent si orienta
   guidato dalla skill) e *prodotto* (la pagina è pulita e funzionante — admin↔UI allineati, zero
   mock/codice morto, controtest sub-agent su flusso dati + utente). Vedi il criterio completo sotto.
3. **SNELLIRE lo skill system** — la mappatura **non aggiunge un layer in più**: sfrutta la divisione
   **contesto / procedura / codice-verità** per **tagliare la ridondanza**. Lo skill diventa breve
   (senso + mappa); i dettagli scendono in `contesto/`; i numeri restano nel codice. Guarda lo skill
   system **nell'insieme**: ogni volta che mappi un'area, chiediti *cosa diventa ridondante e si può
   togliere* (cronologie di sessione negli indici, §4 di `APP_CONTEXT_SKILL.md` già estratte nei
   context, file doppi). Lo snellimento è parte del lavoro, non un extra opzionale.

> **Metodo provato (sessioni Prenota 04-06 e Menu QR 06-06):** intervista l'utente sul senso che solo
> lui ha (`AskUserQuestion`) → verifica TUTTO nel codice prima di scriverlo → `git mv` per i file
> esistenti (storia) → commit intermedio pulito (stage selettivo: NON committare lavoro altrui nel
> working tree) → aggiorna QUESTO file + memory → report a fine sessione. Confine di scope **deciso con
> l'utente** a inizio sessione (es. «solo area X oggi»): lo snellimento d'insieme può eccedere lo scope
> → in quel caso **traccialo nei Debiti** invece di eseguirlo.

---

## Come avviare una sessione che continua questo lavoro

Apri una chat e usa il grilletto **«evolvi skill system senior»** (o «meta senior»), poi indica
l'area. Esempio di primo prompt pronto:

> «**evolvi skill system senior** — continuiamo la mappatura dallo stato in
> `docs/Comunicazione-Skill/PROSEGUIMENTO_MAPPATURA_SKILL.md`. Oggi: [area, es. Menu QR] /
> [oppure: verifica col sub-agent l'area Prenota].»

L'agente senior, riconosciuto il grilletto, deve **leggere prima**: questo file + il Playbook in
`EVOLUZIONE_SKILLS.md` + la memory `project_senior_context_knowledge_milestone`. Poi applica il
pattern, senza ridiscutere le regole già decise.

---

## Le regole già DECISE (non ri-decidere — applica)

1. **Skill = senso/workflow/divieti + mappa** «tocchi X → apri Y». Il dettaglio scende in `contesto/`.
   Lo skill esistente si **snellisce**, non si duplica.
2. **Regola di taglio a soglia:** area piccola = 1 file con due sezioni (Senso/Flusso + Valori); area
   grande = 1 file per **sotto-funzione** (se un agente medio non lo legge intero in un colpo → spacca).
3. **Il senso sta nello skill**, si scorpora in file separato solo se gonfia (>~150-200 righe).
4. **Codice = verità** per i numeri; i `.md` li specchiano e spiegano il perché.
5. **Lettura integrale:** pochi file ma letti INTERI (tranne micro-fix).
6. **I report storici in `Sessioni di lavoro/` NON si toccano** (fotografie del passato).
7. **Snellire è attivo, non passivo:** quando mappi, cerca e taglia la ridondanza che la nuova
   struttura rende inutile (cronologie negli indici skill, doc doppi, §4 già estratta). Se il taglio
   eccede lo scope concordato, **tracciarlo nei Debiti** (vedi sotto), non lasciarlo implicito.

## Il procedimento per ogni area (ricetta ripetibile)

1. **Censisci** i file esistenti dell'area (skill + context sparsi + costanti nel codice).
2. **Identifica il SENSO mancante** — quasi sempre i file vecchi dicono COME, non PERCHÉ.
3. **Intervista Matteo** sul senso che solo lui ha: a che serve · attori (chi può/non può cosa) ·
   limiti VOLUTI da non aggiustare · questioni aperte. Usa `AskUserQuestion`.
4. **Riorganizza** in `docs/<Area>-Skill/`: `<AREA>_SKILL.md` (entry: senso + mappa) +
   `contesto/` (i file di dettaglio, rinominati con `git mv` per preservare la storia).
5. **Scrivi il flusso** (user journey + data flow affiancati) nello skill.
6. **Aggiorna i rimandi** SOLO nei file vivi (skill, indici, context che si citano); lascia i report.
7. **Verifica col sub-agent** (criterio «blindata»): dagli un compito finto sull'area, guarda se apre
   i file giusti senza aver vissuto la chat. Passa → area BLINDATA.

**Criterio «area BLINDATA» — DUE livelli (chiarito 06-06-26).**

- **Blindata DOC** (orientamento): (1) ogni elemento ha senso scritto; (2) limiti voluti blindati;
  (3) questioni aperte tracciate; (4) un sub-agent terzo si orienta **guidato dalla skill** (catena
  `.claude/CLAUDE.md`→`APP_CONTEXT §0`→skill area→`contesto/*`) e apre i file giusti. Il punto 4 è la
  prova: guarda la **catena di rimandi** che segue, non solo se «trova i file» (può azzeccarli navigando
  il codice = falso PASSA).

- **Blindata di PRODOTTO** (la pagina funziona davvero — richiesta Matteo 06-06-26): oltre alla doc,
  la pagina è **pulita e da produzione**. (a) ogni componente renderizzato ha senso ed è allineato tra
  **admin e UI cliente** (niente configurato-ma-non-mostrato, niente mostrato-ma-non-configurabile);
  (b) **zero dati mock/hardcoded/placeholder** che fingono dati veri — i fallback vuoti sono neutri e
  decisi con Matteo; nessun dato di azienda specifica (verificato anche su PROD read-only); (c) **zero
  codice morto** (rami irraggiungibili dall'UI rimossi); (d) **controtest sub-agent con mandato
  «ROMPI», non «conferma»** (chiarito 07-06-26): la domanda guida è *«cosa può rompere la sezione e
  cosa può fare l'utente per romperla?»*. Quattro fronti — **flusso dati** (stato DB giusto? dati
  mancanti/nulli, doppio click, race invalidazioni, azione su record già in altro stato), **flusso
  utente** (click fuori sequenza, modale a metà, navigazione durante una mutation, back/refresh),
  **limit test** (testi lunghissimi, numeri 0/negativi/enormi, date limite, liste lunghe, capienza al
  bordo ±1) e **responsive 375/834/1280** (layout/console/overflow). Un controtest che non ha *provato*
  a rompere nulla NON chiude l'area. Procedura operativa: `PLAN_BLINDATURA_<AREA>.md` Fase D.

> **Procedura di blindatura di prodotto:** la esegue un **orchestratore Opus** che intervista Matteo
> sul senso (Fase A), pulisce codice morto (B), allinea admin↔UI e mock/fallback (C), fa **controtestare
> a sub-agent** flusso dati + utente (D), poi verifica finale (E). I sub-agent **riportano** i bug;
> l'orchestratore decide se fixare lui o **delegare con prompt anti-rottura** (cosa toccare, cosa NON
> toccare, senso da preservare). Template eseguibile: `docs/<Area>-Skill/PLAN_BLINDATURA_<AREA>.md`
> (primo esemplare: `docs/Menu-QR-Skill/PLAN_BLINDATURA_MENU_QR.md`, 06-06-26).

---

## STATO DEL LAVORO (aggiornare a fine sessione)

> Legenda: ⬜ da fare · 🔶 mappata, manca verifica · ✅ blindata (verificata da sub-agent).

| Area | Stato | Note |
|------|-------|------|
| **Pagina Prenota** | ✅ | Blindata 04-06-26: mappata + flusso scritto (commit `e66c0ae`, `fad207f`), test mirati limiti testo verdi, verifica sub-agent reale **PASSA**. Limit/audit test con sub-agent: corretti fallback pubblici su sottotab vuote, card vuote, caroselli senza foto, `MenuSelection` legacy, brand hardcoded, orari pubblici default, preset built-in e config nuovo tenant. Cartella `docs/Prenota-Skill/`. |
| **Menu QR pubblico** | ✅ DOC · ✅ PROD | Mappata 06-06-26 (`a22108c`), DOC blindata (`2e6ecac`). **Blindatura di PRODOTTO completata 06-06-26** (orchestratore Opus, plan `PLAN_BLINDATURA_MENU_QR.md`): rimosso codice morto preset (pagina/route/rami/tipi + colonne DB via migrazione `043`, verificato 0 righe non-`a_la_carte` su PROD+TEST); FU-MQR-1 chiuso (cap titolo 30 / descrizione 70 + test); decisi i fallback (eyebrow vuota = niente, nome locale = «Menu», footer data/ora = voluto); aggiunto `line-clamp-2` difensivo ai titoli card (controtest responsive). Controtest sub-agent flusso dati + utente/responsive 375/834/1280: nessun bug bloccante. `npm run validate` verde (419 test). Report: `docs/Menu-QR-Skill/REPORT_BLINDATURA_06-06-26.md`. Nuovo follow-up: **FU-MQR-2** (ordine piatti per-QR). |
| **Tab Menu admin (magazzino)** | ⬜ | `per-ui-design-skill/MENU_ADMIN_CONTEXT.md`. |
| **Admin shell + pagine** | 🔶 | **Area 1 Shell: ✅ blindata 10-06-26** (FU-042 E2E + unit `shell-*`). **Area 2 Prenotazioni: Fase D + FU-046 chiusi 07-06-26** — batch1 (D1 race, R1 responsive, D4/D5/D2) + batch2 FU-046 (D3 migr.044 contatore restore, U2 annulla modifica, U5/U7 scroll+chiusura, U6 drawer stale, U1 toast unico, U4 guard sincrono, U10 logger). `npm run validate` verde **464 test**. Bloccanti ALTO+MEDIO chiusi. Restano U3 (vincolo struttura)/U9/D6-D7/L* + **QA browser reale modali admin loggato 375/834/1280** + E2E staging. **Non ✅ PROD** finché FU-043 (QA reale) + E2E. |
| **Database** | ⬜ | `Database-Skill/`. Valutare se il pattern senso/flusso calza (è infrastruttura, non UI). |
| **Card richiesta admin** | ⬜ | `per-ui-design-skill/BOOKING_REQUEST_CARD_CONTEXT.md` (area Prenotazioni admin). |

**Ordine consigliato:** Prenota ✅ + Menu QR ✅. **Prossimo passo Admin:** Matteo decide fix Area 2
(D1 race pending/accepted, R1 responsive 375px — prompt anti-rottura §4 PLAN), poi Area 3 Settings.
Debiti Area 1: ~~E2E shell~~ ✅ FU-042 (10-06-26). Merge prod M1 ⬜. Una sola area alla volta.
File leggeri e verificati battono tanti file fatti in fretta.

> **Blindato il routing per Claude Code (06-06-26, commit `2e6ecac`).** La verifica sub-agent di Menu
> QR ha scoperto che `.claude/CLAUDE.md` — la porta che un agente Claude Code carica in automatico —
> **non instradava** alle skill d'area: l'agente trovava i file giusti solo navigando il codice a mano
> (per fortuna). Il routing alle aree viveva solo nel mondo Cursor (file `.cursor/skills/...` +
> `APP_CONTEXT §0`). Fix: aggiunto in testa a `.claude/CLAUDE.md` un blocco «instradati all'area
> giusta» che manda ad `APP_CONTEXT_SKILL.md §0` prima di toccare il codice. **Vale per TUTTE le aree.**
> Lezione di metodo: il criterio «blindata» è *guidato dalla skill*, non «ha trovato i file» — un
> sub-agent può azzeccare i file navigando il codice e dare un falso PASSA. Guarda la **catena di
> rimandi** che ha seguito, non solo la risposta finale.

---

## Debiti aperti collegati

- ✅ **Menu QR — FU-MQR-1 CHIUSO (06-06-26):** titoli/descrizioni categoria per-QR cappati (30/70,
  `AdminFieldWithCharCount` + test). Vedi `docs/Menu-QR-Skill/contesto/MENU_QR_TEXT_LIMITS_MAP.md` §B.
- ✅ **Menu QR — codice morto preset RIMOSSO (06-06-26):** pagina/route/rami/tipi + colonne DB
  (migrazione `043`). Vedi `MENU_QR_DATA_FLOW_CONTEXT.md` §0.
- **Menu QR — FU-MQR-2 (NUOVO, 06-06-26):** ordine piatti dentro la categoria, configurabile per-QR.
  Oggi i piatti seguono il sort_order del magazzino. Matteo: è un buco. Lavoro grosso (dati + form),
  fuori dalla blindatura. Vedi `MENU_QR_SKILL.md` §5.
- **Snellimento skill system d'insieme — ESEGUITO 06-06-26 (commit `2e6ecac`).** (1) `.cursor/skills/
  calendarbackup-app-context/SKILL.md`: tolte ~21 righe di cronologia di sessione → **mappa pulita
  area→file** (54→~40 righe). (2) `APP_CONTEXT_SKILL.md` (490 righe): la §4 era **già snellita** in una
  sessione precedente (sono già rimandi, non duplicati testuali) — il proseguimento la sovrastimava;
  il valore vero trovato qui sono stati **6 link rotti** verso i vecchi `per-ui-design-skill/PUBLIC_MENU_*`
  (rinominati col git mv del 06-06) → corretti. **Bonus link rotti** scoperti e corretti lungo la
  verifica: `docs/CLAUDE.md` inesistente nel file Cursor (→ `.claude/CLAUDE.md`), auto-rimando interno
  in `MENU_QR_REFERENCE.md`, FU-019 in `FOLLOW_UP.md`. Lezione: «file = verità» vale anche per i
  rimandi — il proseguimento può sovrastimare un bersaglio, verifica nel file prima di tagliare.

- **Prenota — rimandi obsoleti + revisione senior (04-06-26):** stub in
  `per-ui-design-skill/BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` e
  `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md`; analisi decisionale →
  `docs/Comunicazione-Skill/ANALISI_REVISIONE_SENIOR_PRENOTA_POST_BLINDATURA.md`.
  Fix prodotto semplici: prompt preparati in chat (courses_label, FU-032, FU-031).
- **Propagazione template v.0 — HOOK ALLINEATI 04-06-26** (guard-prod + nudge v4 + senior + §11
  domande di chiusura + hooks.json, generici e testati). Resta sospesa la propagazione della
  **struttura context-knowledge** (cartella-area) finché la milestone non è matura (≥2-3 aree blindate).
- **[FOLLOW-UP SENIOR 04-06-26] Check segnaposto v.0** — verificare che OGNI `{{segnaposto}}` usato nei
  file del template `_skill-system-v0/` (es. `{{frase-richiesta-lezione}}`, `{{GLOSSARIO_VIVO}}`,
  `{{PROFILO_SCOLASTICO}}`, `{{es. scope creep…}}`) sia **documentato in `_skill-system-v0/MANUALE_AVVIO.md`**
  con cosa va messo al suo posto. Obiettivo: un nuovo progetto che adotta il v.0 sa compilare tutti i
  segnaposto senza indovinare. Check incrociato in una prossima sessione senior (non bloccante).
- **Sistema didattico di Matteo** — COSTRUITO 04-06-26 (qualità verificata). File in `_lavoro/Per matteo/`
  (privati): glossario, profilo, roadmap, materiale-didattico. Si alimenta a ogni chat senior.
