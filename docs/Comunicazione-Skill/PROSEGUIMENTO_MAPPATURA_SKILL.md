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
   bloccano i comportamenti voluti. «Blindata» = un sub-agent terzo si orienta e apre i file giusti.
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

**Criterio «area BLINDATA»:** (1) ogni elemento ha senso scritto, nessun pezzo misterioso; (2) limiti
voluti blindati; (3) questioni aperte tracciate; (4) **un sub-agent terzo si orienta** e apre i file
giusti. Il punto 4 è la prova vera.

---

## STATO DEL LAVORO (aggiornare a fine sessione)

> Legenda: ⬜ da fare · 🔶 mappata, manca verifica · ✅ blindata (verificata da sub-agent).

| Area | Stato | Note |
|------|-------|------|
| **Pagina Prenota** | ✅ | Blindata 04-06-26: mappata + flusso scritto (commit `e66c0ae`, `fad207f`), test mirati limiti testo verdi, verifica sub-agent reale **PASSA**. Limit/audit test con sub-agent: corretti fallback pubblici su sottotab vuote, card vuote, caroselli senza foto, `MenuSelection` legacy, brand hardcoded, orari pubblici default, preset built-in e config nuovo tenant. Cartella `docs/Prenota-Skill/`. |
| **Menu QR pubblico** | 🔶 | Mappata 06-06-26 (commit `a22108c`): `docs/Menu-QR-Skill/` (SKILL + contesto LAYOUT/DATA_FLOW/TEXT_LIMITS_MAP/TEST_SUITE_INDEX/REFERENCE). Vecchi `PUBLIC_MENU_*` spostati con git mv. **Scoperte (codice=verità):** `content_type`/preset/menù-evento via QR = codice morto irraggiungibile (modale forza `a_la_carte`) → da RIMUOVERE; titoli/descrizioni categoria per-QR senza cap → **FU-MQR-1** da cappare; nome QR voluto interno. **Manca verifica sub-agent** (rimandata, scelta utente). Report sessione: a fine sessione. |
| **Tab Menu admin (magazzino)** | ⬜ | `per-ui-design-skill/MENU_ADMIN_CONTEXT.md`. |
| **Admin shell + pagine** | ⬜ | `Dashboard-laterale-skill/`. Già ha context per-pagina, da riorganizzare col pattern. |
| **Database** | ⬜ | `Database-Skill/`. Valutare se il pattern senso/flusso calza (è infrastruttura, non UI). |
| **Card richiesta admin** | ⬜ | `per-ui-design-skill/BOOKING_REQUEST_CARD_CONTEXT.md` (area Prenotazioni admin). |

**Ordine consigliato:** ora passa a Menu QR (simile a Prenota, valida il pattern su una 2ª area) →
poi le aree admin. Una per sessione, senza fretta: file leggeri e verificati battono tanti file
fatti in fretta.

---

## Debiti aperti collegati

- **Menu QR — FU-MQR-1 (06-06-26):** titoli/descrizioni categoria per-QR (`MenuQrCategoryCardsSection`,
  due `<input>` nudi) **senza cap** → cappare con `AdminFieldWithCharCount` come il carosello. Dettaglio
  e punto codice: `docs/Menu-QR-Skill/contesto/MENU_QR_TEXT_LIMITS_MAP.md` §B.
- **Menu QR — rimozione codice morto (06-06-26):** `content_type`/`preset_ids`/`PublicMenuPresetPage`/
  rami preset = irraggiungibili dall'UI (decisione Matteo: rimuovere). Mappa di cosa togliere:
  `docs/Menu-QR-Skill/contesto/MENU_QR_DATA_FLOW_CONTEXT.md` §0. Sessione di pulizia dedicata.
- **Snellimento skill system d'insieme (deciso 06-06-26, NON eseguito):** usare la divisione
  contesto/procedura/codice-verità per tagliare ridondanze. Due candidati identificati: (1) indice
  `.cursor/skills/calendarbackup-app-context/SKILL.md` ha ~20 righe «report di sessione» che ripetono
  dettagli ora nei file di contesto → sostituire con mappa pulita area→file; (2) `APP_CONTEXT_SKILL.md`
  (490 righe) possibile §4 duplicata coi context estratti → esaminare e snellire con rimandi. Confine
  scelto per la sessione 06-06-26: «solo Menu QR» → questi due restano per la prossima sessione senior.

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
