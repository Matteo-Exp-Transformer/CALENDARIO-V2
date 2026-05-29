# Report — Promo in Personalizza form (29-05-26)

## Obiettivo

Spostare la gestione promo da Tab Menu a **Impostazioni → Personalizza form**, sezione **Messaggio Promozionale**, con modello `placement`, banner singolo in Pagina Prenota pubblica e snapshot multi-promo su `booking_requests.menu_promo_labels`.

**Follow-up collegati:**
- [Report abbinamenti multi-target](Report-promo-multi-target-29-05-26.md) (`booking_types[]` / `sub_tab_refs[]`)
- **§ Follow-up UI abbinamento** (stesso file, sotto) — abbinamento opzionale + selezione libera 0/1/2/tutte

## Per il ristoratore (sintesi)

| Dove | Cosa vede / fa ora |
|------|---------------------|
| **Impostazioni → Personalizza form → Messaggio Promozionale** | Crea promo con nome + testo; **non è obbligatorio** abbinarle a nulla. Se abbinamento: due blocchi sempre visibili — **Tipologie** (spunta nessuna, 1, 2 o tutte e 3) e **Card/caroselli** (stessa logica). Pulsanti «Seleziona tutte» / «Deseleziona tutte». Tipologie e card restano **alternative** (non insieme sulla stessa promo). |
| **Tab Menu** | Nessun editor promo (rimosso). |
| **Pagina Prenota (cliente)** | Un solo banner sopra le sottotab quando la scelta coincide con l’abbinamento; nessun banner se la promo non ha abbinamento (o non matcha). |
| **Dati salvati** | `restaurant_settings` → chiave `booking_menu_promos` (array JSON). Snapshot etichette promo viste → `booking_requests.menu_promo_labels` al submit. |

## Cosa è cambiato

### Admin — Personalizza form

- Nuova sezione **Messaggio Promozionale** in `BookingFormConfigPanel` (dopo Modalità, prima Sfondo).
- Componente `BookingFormPromoSection.tsx`: CRUD promo, Salva/Annulla sezione, validazione unicità globale.
- **Abbinamento (stato finale):** due pannelli checkbox sempre visibili (niente menu «Nessuno / Tipologia / Card»). Multi-selezione libera per tipologie e per card/caroselli; shortcut «Seleziona tutte» / «Deseleziona tutte» (+ «Tutte le card» / «Tutti i caroselli»). Salvataggio solo nome+testo → `placement: 'none'`. Se si spunta in un blocco, l’altro si svuota da solo (tipologie **oppure** card, non entrambi).
- Storage: `restaurant_settings.booking_menu_promos`.

### Modello dati (stato attuale post follow-up)

- `MenuPromo`: `placement`, `booking_types?: BookingType[]`, `sub_tab_refs?: MenuPromoSubTabRef[]`.
- Migrazione runtime regola (A): prima promo in ordine lista vince su ogni tipologia/sottotab; overlap rimosso dalle promo successive.
- Helper: `resolveMenuPromoForBookingView`, `collectMenuPromoLabelsForSubmit`, `validateMenuPromoUniqueness`, `useMenuPromoViewTracking`.

### Pagina Prenota (pubblico)

- Un solo banner (`region` «Promozioni menù») sopra sottotab; priorità sottotab > tipologia.
- Tracciamento promo viste in sessione; submit con `menu_promo_labels` deduplicato.

### Rimozioni

- Tab Menu: nessun editor/toolbar promo.
- Form admin prenotazione / tab Menu modal: nessun `MenuPromoBannerCards`.
- Admin create booking: `menu_promo_labels: null`.

### Edge function

- `create-booking`: fallback su `booking_types` (+ compat `booking_type` singolo legacy).

## File principali

| Area | File |
|------|------|
| Modello | `src/features/booking/constants/menuPromo.ts` |
| Registry | `src/features/booking/lib/restaurantSettingRegistry.ts` |
| Editor admin | `src/features/booking/components/settings/BookingFormPromoSection.tsx` |
| Panel | `src/features/booking/components/settings/BookingFormConfigPanel.tsx` |
| Pubblico | `BookingRequestForm.tsx`, `useMenuPromoViewTracking.ts` |
| Test unit | `src/features/booking/constants/__tests__/menuPromo.test.ts` |

## Follow-up UI abbinamento (29-05-26, stessa sessione)

### Problema segnalato da Matteo

> «adesso posso inserire a scelta tra. invece voglio poter scegliere 1 o nessuno o tutti o 2.»

*(Classificato **BUG-001** — vedi § Bug manifestato e § Riflessioni in fondo al report.)*

Il menu a tendina **Abbinamento** obbligava a scegliere prima *Nessuno*, *Tipologia* o *Card* — sembrava una scelta «una sola tra…» invece di checkbox indipendenti con 0, 1, 2 o tutte le voci.

### Correzioni applicate

1. **Abbinamento opzionale (già in modello):** promo salvabile con solo nome + testo; array vuoti → `normalizeMenuPromoPlacement` → `placement: 'none'` (niente toast errore).
2. **UI libera:** rimosso `<select>` placement; pannelli tipologie + card sempre visibili; pulsanti selezione/deselezione massiva.
3. **Mutua esclusione soft:** spuntare una tipologia svuota le card (e viceversa) — evita errore al salvataggio; messaggio toast solo se entrambi gli array fossero pieni (caso edge).

### Verifica automatica post-fix

- `npm run validate` — **OK** (29-05-26 sera): lint + typecheck + **211** test (**21** in `menuPromo.test.ts`).

### QA manuale post-fix UI

| ID | Test | Esito | Note |
|----|------|-------|------|
| U1 | Nuova promo solo nome+testo, zero checkbox | **Non testato browser** | Coperto da logica `buildDraftRow` + unit test normalize |
| U2 | Tipologie: 0 / 1 / 2 / 3 spuntate | **Non testato browser** | Checkbox + toggle implementati; da smoke Matteo in admin |
| U3 | Shortcut «Seleziona tutte» tipologie | **Non testato browser** | — |
| U4 | Card: multi-selezione + «Tutte le card» | **Non testato browser** | — |

## Verifica automatica (baseline sessione)

- `npm run validate` — **OK** (29-05-26 mattina, 207 test → poi 211 dopo follow-up UI).

## QA manuale (29-05-26)

**Ambiente:** DB test `docnnernvp`, `npm run dev`, browser Playwright.

**Credenziali QA** (salvate in `.env.local.test`, gitignored): `MANUAL_ADMIN_EMAIL` / `MANUAL_TENANT_SLUG` — vedi `docs/_lavoro/Per matteo/Comandi per terminale.md`.

| ID | Test | Esito | Note |
|----|------|-------|------|
| A1 | Login admin `test-pro@p.com` | **OK** | Redirect `/admin` |
| A2 | Impostazioni → Personalizza form → sezione **Messaggio Promozionale** | **OK** | Testo help multi tipologia/card; barra Salva/Annulla sezione |
| A3 | Lista promo esistente «menu al 30% Sconto» | **OK** | Riepilogo: «Menu a prezzo fisso, Prenota un tavolo» (multi-target) |
| B1 | Tab **Menu** (prezzi) | **OK** | Nessun pulsante «Crea / Modifica Promo» |
| C1 | `/prenota/test-pro` — tipologia default (Prenota/tavolo) | **OK** | Banner unico: «Assaggia il menu della casa e risparmia il 30%!» |
| C2 | Passa a **Rinfresco di Laurea** (non in `booking_types` della promo) | **OK** | Banner **assente** |
| C3 | Passa a **Menu a prezzo fisso** | **OK** | Banner **riappare** (stessa promo multi-tipologia) |
| C4 | Una sola `region` «Promozioni menù» | **OK** | Un messaggio in UI |

**Non eseguiti in questa sessione QA:** submit end-to-end con verifica `menu_promo_labels` in DB; percorso 2 card con promo diverse; blocco save conflitto globale in UI (coperto da unit test); FU-001 polish modal calendario.

## QA manuale responsive (29-05-26)

Playwright, tenant `test-pro`, promo «menu al 30% Sconto» (`booking_types`: menu fisso + tavolo).

| ID | Caso | mobile 375 | tablet 834 | desktop 1280 |
|----|------|:------------:|:----------:|:--------------:|
| C1 | Banner su tipologia default (tavolo) | OK | OK | OK |
| C2 | Banner assente su Rinfresco | OK | OK | OK |
| C3 | Banner su Menu a prezzo fisso | OK | OK | OK |
| C-R1 | Sticky riepilogo / barra bassa (<1256) | OK (sticky visibile) | OK | OK (sticky assente) |
| A2 | Messaggio Promozionale in Personalizza form | OK | OK | OK |
| B1 | Tab Menu senza pulsante promo | OK | OK | OK |

Testo banner identico su tutti i viewport: «Assaggia il menu della casa e risparmia il 30%!». Un solo messaggio per stato tipologia.

## Follow-up

- **FU-001** (`docs/FOLLOW_UP.md`): polish UI modal calendario / elenco promo in dettaglio.

## File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `.cursor/skills/calendarbackup-app-context/SKILL.md` | Puntatore promo + FOLLOW_UP | §7.2 sessione |
| `docs/per-ui-design-skill/BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md` | § Messaggio Promozionale | Allineamento editor + multi-target |
| `docs/Testing-Skill/TESTING_SKILL.md` | §7 Protocollo QA manuale Verifica | Responsive 375/834/1280 obbligatorio per agenti revisione |
| `docs/APP_CONTEXT_SKILL.md` | §0.0 profilo Verifica | Puntatore a TESTING_SKILL §7 |
| `docs/_lavoro/Per matteo/Comandi per terminale.md` | Riga login QA | Credenziali test locali |
| `.env.local.test` | `MANUAL_ADMIN_*`, `E2E_*`, `MANUAL_TENANT_SLUG=test-pro` | QA ripetibile (gitignored) |

---

## Dati comunicazione

> Sezione per il revisore — autosufficiente senza rileggere la chat (regola temporanea COMUNICAZIONE_UTENTE_SKILL).

### Contesto sessione

- **Profilo ingresso:** Esecuzione (feature promo Personalizza form + follow-up UX).
- **Turni:** implementazione multi-target → fix abbinamento opzionale → feedback UI dropdown → fix checkbox libere → richiesta report aggiornato (senza conferma «lavoro ok» esplicita su UI fix).
- **Prompt prepara-prompt:** no (sessione diretta su codice).

### Cronologia / prompt di Matteo (annotati)

| # | Messaggio (fedele o parafrasi stretta) | Intento | Esito agente |
|---|----------------------------------------|---------|--------------|
| 1 | (Sessione precedente nel thread) Spostare promo in Personalizza form, multi-target, ecc. | Feature completa promo | Implementato + report + QA Playwright |
| 2 | «adesso posso inserire a scelta tra. invece voglio poter scegliere 1 o nessuno o tutti o 2.» | UX abbinamento: multi-selezione libera, non menu esclusivo | Rimosso dropdown; checkbox sempre visibili; shortcut tutte/nessuna; spiegazione schermata+storage |
| 3 | «aggiorna tuo report di fine lavoro. anche parte comunicazione.» | Chiudere documentazione sessione | Report + SESSION_LOG + OSSERVAZIONI aggiornati |
| 4 | «aggiungi al report questo bug … riflessioni … skill system / errore prompt / causa radice … solo report, no fix» | Meta-analisi BUG-001 + miglioramenti skill | § Bug manifestato + § Riflessioni aggiunti al report |

### Frasi / richieste ricorrenti (questa chat)

| Frase/intento | Volte | Note |
|---------------|-------|------|
| «spiegami semplice» + schermata/componente/storage (user rule) | 1+ | Risposta agente: Impostazioni Personalizza form, `BookingFormPromoSection`, `booking_menu_promos` |
| Feedback UX breve («a scelta tra» vs «1 o nessuno o tutti o 2») | 1 | Matteo descrive il problema percepito, non il file — agente ha tradotto in rimozione select |
| «aggiorna report … anche comunicazione» | 1 | Pattern §7 + sezione Dati comunicazione esplicita |
| «aggiungi bug + riflessioni cause, no fix» | 1 | Post-mortem nel report per revisore skill system |

### Spiegazioni date e formato che ha funzionato

- **Prima/dopo sul dropdown:** «prima dovevi scegliere Tipologia *oppure* Card dal menu; adesso vedi sempre le checkbox e spunti zero, una, due o tutte» — formato **prima/ dopo nell’app** accettato in risposta chat.
- **Storage:** una riga su `restaurant_settings.booking_menu_promos` sufficiente quando abbinata alla schermata admin.

### Voci Liv.2 applicate

| Voce | Esito | Nota |
|------|-------|------|
| «spiegamelo semplice» (VOCABOLARIO) | ok | Usato doppio livello schermata → DB senza dump file |
| «main dell'app» | — | Non usata |
| «menù originale» | — | Non usata |

### Pattern nuovi (candidate PROPOSTE)

- **Feedback «a scelta tra» su UI admin:** quando Matteo dice che può solo «scegliere tra» N opzioni, verificare se c’è un `<select>` o radio che nasconde multi-checkbox — prioritaria fix UX prima di estendere il modello dati. *(Rafforzato da § Riflessioni BUG-001.)*
- **Checklist QA admin multi-checkbox:** 0/1/N/tutti prima di chiudere sessione form Personalizza — candidate TESTING_SKILL.
- **Separare regole dati vs regole interazione nei prompt feature** — candidate PREPARA_PROMPT / APP_CONTEXT.
- **Mix tipologie + card sulla stessa promo:** non richiesto esplicitamente; lasciato mutual exclusive. Se chiede in futuro → estensione modello.

### Cosa si può automatizzare vs manuale

| Automatizzabile | Manuale (perché) |
|-----------------|------------------|
| `npm run validate` dopo ogni fix UI admin | Smoke browser U1–U4 (Matteo o agente Verifica) |
| Normalizzazione `placement: 'none'` su array vuoti | Conferma «lavoro ok» prima di commit |
| Report + OSSERVAZIONI quando Matteo chiede «aggiorna report» | Commit/push non richiesti in questa chat |

### Token risparmiabili

- «aggiorna report anche comunicazione» → regola: dopo fix UX mid-sessione, appendere § Follow-up al report esistente invece di chiedere quale file.

### Cosa non è successo in chat

| Tipo | Dettaglio |
|------|-----------|
| Conferma successo | Matteo **non** ha detto «lavoro ok» / «funziona» sul fix UI checkbox |
| Commit | Nessun commit richiesto |
| QA browser post-fix | Solo `validate` automatico; tabelle U1–U4 non eseguite |
| BUG-001 conferma chiusura | Fix UI in codice ma Matteo non ha detto «lavoro ok»; analisi cause aggiunta su richiesta, **senza nuovo fix** |
| Mix tipologie+card | Non discusso né implementato |
| Aggiornamento VOCABOLARIO | Solo OSSERVAZIONI + report |
| FU-001 | Non affrontato (modal calendario promo) |

### Derivazione errori

Vedi **§ Bug manifestato (BUG-001)** e **§ Riflessioni — perché si è manifestato** (sotto). Non è solo disallineamento cosmetico: in v1 UI il ristoratore **non poteva** comporre liberamente 0/1/2/tutte le tipologie senza passare da un menu esclusivo — fix UI applicato, **non confermato** da Matteo.

---

## Bug manifestato (BUG-001) — abbinamento promo «a scelta tra»

**Stato:** fix UI applicato in codice (dropdown rimosso, checkbox sempre visibili). **Aperto lato prodotto** finché Matteo non fa smoke manuale (U1–U4). **Nessun ulteriore fix in questa richiesta** — solo documentazione.

### Cosa non funzionava per il ristoratore

In **Impostazioni → Personalizza form → Messaggio Promozionale**, aprendo l’editor di una promo:

1. Un menu **Abbinamento** obbligava a scegliere prima **Nessuno**, **Tipologia prenotazione** o **Card / Carosello** — tre strade **mutuamente esclusive**.
2. Le checkbox sulle tipologie comparivano **solo** dopo aver scelto «Tipologia prenotazione».
3. L’effetto percepito (feedback Matteo): *«posso inserire a scelta tra»* — non *«spunto zero, una, due o tutte»* come multi-selezione libera.
4. Anche dopo il follow-up **multi-target** (`booking_types[]`), il `<select>` restava: il modello dati supportava N tipologie, ma l’UI **nascondeva** le checkbox dietro un passo obbligatorio.

### Dove (tecnico, per tracciabilità)

| Livello | Dettaglio |
|---------|-----------|
| Schermata | Personalizza form → `BookingFormPromoSection` (editor promo) |
| Controllo difettoso (v1) | `<select id="promo-placement">` con `none \| booking_type \| sub_tab` + pannelli checkbox condizionali |
| Storage | Invariato — `restaurant_settings.booking_menu_promos`; il bug era **solo presentazione**, non persistenza |
| Fix applicato | Rimosso select; due pannelli checkbox sempre visibili; `placement` derivato al salvataggio |

### Impatto

- **Admin:** confusione e possibile abbandono dell’abbinamento multi-tipologia; sensazione di scelta singola.
- **Prenota:** nessun crash; promo configurate male o non configurate → banner assente o target incompleti.
- **QA automatica:** **non ha intercettato** — nessun test E2E/admin sul flusso «spunta 2 tipologie su 3» senza passare dal menu.

---

## Riflessioni — perché si è manifestato

Analisi onesta su **skill system**, **prompt** e **causa radice**. Nessuna singola colpa: combinazione di modello dati, implementazione agente e gap nei criteri di accettazione.

### Causa radice (sintesi)

**Confusione tra due livelli diversi del prodotto:**

| Livello | Cosa rappresenta | Come è finito in UI (v1) |
|---------|------------------|---------------------------|
| **Dominio** | `placement`: *su quale dimensione* è ancorata la promo (`none`, per tipologia, per sottotab) | Menu a tendina esclusivo |
| **Interazione** | *Quanti* target dentro quella dimensione (0, 1, 2, tutte le tipologie) | Checkbox — ma **nascoste** finché non si sceglieva la dimensione |

L’agente ha **proiettato l’enum TypeScript (`MenuPromoPlacement`) 1:1 in un `<select>`**, pattern corretto per un campo singolo, **sbagliato** quando la regola prodotto è «multi-selezione opzionale con zero elementi validi». Il modello supportava già N target; l’ostacolo era **solo UX**.

### Quota responsabilità (stima)

| Fattore | Peso | Spiegazione |
|---------|------|-------------|
| **Gap skill / checklist QA** | ~35% | Nessuna rule esplicita «multi-select opzionale → no select che nasconde checkbox»; QA Playwright ha coperto **Prenota**, non scenari admin U1–U4 sull’editor promo |
| **Prompt / piano iniziale incompleto** | ~30% | Piano e follow-up multi-target dettagliavano array, unicità, migrazione — **non** scenari UX espliciti: «0 tipologie», «2 su 3», «tutte», «senza passare da menu» |
| **Scelta implementativa agente** | ~25% | Dopo multi-target avrebbe potuto eliminare il select come ridondante; ha aggiunto checkbox **dentro** il ramo condizionale invece di ripensare il flusso |
| **Feedback umano necessario** | ~10% | Matteo ha colto il disallineamento in uso reale — normale in feature admin nuove; non indica prompt «sbagliato», ma **criteri di done insufficienti** |

### Errore umano di prompt?

**Parzialmente, non grave.** I prompt di sessione (spostamento promo, multi-target, abbinamento opzionale) erano **precisi sul modello e sulla persistenza**, meno sulla **forma dell’interfaccia**. Mancava una riga tipo:

> *«Il ristoratore deve poter spuntare 0, 1, 2 o tutte le tipologie **senza** un menu preliminare Nessuno/Tipologia/Card.»*

Senza quella riga, l’agente ha interpretato `placement` come controllo UI primario — scelta **plausibile** ma non allineata all’intento di Matteo. **Non** è stato chiesto esplicitamente nel piano iniziale; è emerso solo col feedback «a scelta tra».

### Dove migliorare lo skill system (proposte per revisore)

| Area | Proposta | Livello suggerito |
|------|----------|-------------------|
| **`BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md`** | Regola: abbinamenti **multi-target opzionali** → checkbox sempre visibili; `placement` **derivato al save**, mai `<select>` esclusivo che nasconde le opzioni | Doc area |
| **`TESTING_SKILL.md` § QA admin** | Smoke obbligatorio post-feature form admin: almeno 0 / 1 / N selezioni su controllo multi-checkbox prima di chiudere sessione | Checklist Verifica |
| **`PREPARA_PROMPT_SKILL.md`** | Nei prompt UI admin, includere tabella **scenari accettazione** (0, 1, parziale, tutti) quando si parla di «N target» | Filtro prompt |
| **`COMUNICAZIONE_UTENTE_SKILL` / PROPOSTE** | Pattern «a scelta tra» = segnale per cercare select/radio che mascherano multi-checkbox (già candidato in § Dati comunicazione) | VOCABOLARIO Liv.1 candidato |
| **Piano feature (generico)** | Separare sempre in due bullet: **(A) regole dati** e **(B) regole interazione** — evitare che (A) dittii i controlli UI | APP_CONTEXT § pianificazione |

### Perché `npm run validate` non ha bastato

211 test unitari coprono `normalizeMenuPromoPlacement`, unicità, resolve banner — **non** il percorso visivo admin «utente spunta seconda tipologia senza aprire menu». È un **buco di test funzionale/UI**, non di logica pura.

### Lezione per sessioni simili

Quando il modello ha un enum `placement` **e** array opzionali `booking_types[]` / `sub_tab_refs[]`, chiedersi subito: *«Il select placement serve all’utente o solo al serializer?»* Se solo al serializer → **non mostrarlo**; derivarlo quando almeno un array è non vuoto.

---

## Esperienza revisore — skill system (29-05-26)

> Scritta dall’agente in **profilo Verifica** dopo revisione del lavoro promo (implementazione + follow-up UI). Obiettivo: feedback sul sistema skill come **strumento per revisori**, non solo post-mortem sul BUG-001.

### Contesto revisione

- **Ingresso:** richiesta di revisione completa (baseline promo + fix UI abbinamento citati nei report).
- **Materiali usati:** questo report, `Report-promo-multi-target-29-05-26.md`, `.cursor/skills/calendarbackup-app-context/SKILL.md`, `TESTING_SKILL.md` §7, `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md`, `APP_CONTEXT_SKILL.md` §0.0 e §4, `git diff` sui file citati, `npm run validate`, QA Playwright già documentata nel report (responsive + Prenota); smoke admin U1–U4 **non** ripetuto in browser (sessione browser chiusa).
- **Non usato in profondità:** transcript chat completo (bastata la sezione **Dati comunicazione** + tabelle QA).

### Cosa ha funzionato (efficienza positiva)

| Elemento | Effetto per il revisore |
|----------|-------------------------|
| **Puntatore promo** in `calendarbackup-app-context/SKILL.md` | Trovato subito il report giusto e i file area senza esplorare tutto il repo. |
| **Sezione «Dati comunicazione»** in questo report | Autosufficiente: cronologia prompt, cosa non è stato testato, assenza di «lavoro ok» — evita di rileggere la chat. |
| **`TESTING_SKILL.md` §7** (375 / 834 / 1280) | Criterio chiaro per QA responsive; le prove già nel report erano riusabili senza ridefinire il protocollo. |
| **`npm run validate`** | Gate unico affidabile (211 test, 21 su `menuPromo`) — metà revisione chiusa in pochi minuti. |
| **Report agente strutturato** | Tabelle file / QA / follow-up / storage DB — confronto codice ↔ dichiarazioni lineare. |
| **`BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md`** | Allineato al prodotto finale (Messaggio Promozionale, multi-target, abbinamento opzionale). |
| **Credenziali in `.env.local.test` + Comandi per terminale** | Ripetibilità QA locale documentata (anche se il revisore non ha completato U1–U4). |

### Bug e gap nel sistema (visti dal revisore)

| Tipo | Dettaglio | Impatto revisione |
|------|-----------|-------------------|
| **Drift documentale** | `APP_CONTEXT_SKILL.md` §4 RULE **Menu Prenota** (~riga 245) descrive ancora l’editor promo in **Tab Menu** (`MenuPricesTab`) con `booking_types` singolo — il codice e `BOOKING_FORM_CONFIG_PANEL` dicono il contrario. | Rischio che un **prossimo agente di lavoro** reintroduca UI nel posto sbagliato; il revisore deve fare `grep` incrociato invece di fidarsi di APP_CONTEXT. |
| **Checklist Verifica incompleta al handoff** | L’agente ha lasciato U1–U4 come «Non testato browser»; §7 TESTING copriva Prenota/responsive ma **non** obbligava ancora smoke admin post-fix UX. | Il revisore non può chiudere «UI fix OK» solo con unit test — gap esplicito da colmare in skill. |
| **Doppio livello report** | Report form + report multi-target + follow-up nello stesso file — utile, ma manca una riga **«Stato verifica revisore»** in cima (OK / parziale / bloccato). | 2–3 minuti in più per capire cosa è già certificato. |
| **Nessun blocco «done» su tabelle vuote** | Lo skill non impedisce all’agente di considerare chiusa una sessione con tutta la colonna browser «Non testato» su fix UI puramente visivi. | Lavoro spostato al revisore o a Matteo senza confine netto. |
| **`REVISIONE.md`** | Ottimo per sessioni meta comunicazione; **non** guida la revisione tecnica feature (Verifica codice + QA). | Due profili (comunicazione vs tecnica) restano separati — va bene, ma il revisore tecnico deve sapere di usare TESTING §7 + report, non solo REVISIONE. |

### Migliorie concrete (proposte dal revisore)

1. **`APP_CONTEXT_SKILL.md`:** aggiornare RULE Menu Prenota — promo solo in Personalizza form (`booking_menu_promos`, `placement`, array multi-target); rimuovere riferimento editor in `MenuPricesTab`.
2. **`TESTING_SKILL.md` §7:** dopo ogni fix **solo UI admin** (form, checkbox, rimozione select), obbligo di almeno uno smoke **0 / 1 / N / tutti** prima di segnare sessione verificabile — oppure riga esplicita «Verifica: BLOCCATO finché tabella admin non eseguita».
3. **Template report sessione:** blocco fisso in cima — `## Stato verifica` (automatico / manuale / non fatto) + data; opzionale questa sezione «Esperienza revisore» quando la revisione è fatta.
4. **`PREPARA_PROMPT_SKILL.md`:** per feature con enum + array opzionali, bullet obbligatorio **(B) regole interazione** (già in § Riflessioni) — il revisore lo userà come checklist anti-BUG-001.
5. **Sync post-feature:** in §7.2 (skill sessione), voce «allineare APP_CONTEXT RULE area toccata» — oggi aggiornati cursor skill e BOOKING_FORM, non APP_CONTEXT §4.

### Valutazione efficienza (sintesi)

| Aspetto | Voto (1–5) | Commento |
|---------|:------------:|----------|
| Orientamento iniziale (skill + report) | **4** | Puntatori e Dati comunicazione riducono molto il tempo di contesto. |
| Verifica automatica | **5** | `validate` + test `menuPromo` danno alta confidenza sulla logica. |
| Allineamento doc ↔ codice | **2** | APP_CONTEXT obsoleto su promo è il punto più debole; costa grep e dubbio. |
| QA manuale guidata | **3** | §7 responsive forte; admin post-fix ancora buco sistemico. |
| Chiusura revisione (posso dire «ok merge»?) | **3** | Logica e Prenota OK; UI admin U1–U4 e submit DB ancora aperti — coerente con report, non con «done» totale. |

**Giudizio complessivo:** lo skill system **è efficace per la revisione** quando report + skill area + TESTING §7 sono aggiornati: in questa sessione ho stimato ~**60–70%** del lavoro di revisione coperto senza aprire la chat. Il **30–40%** restante è tax da drift doc (`APP_CONTEXT`), test browser admin non eseguiti dall’agente, e assenza di un «semáforo» verifica in cima al report. Non ho trovato contraddizioni gravi tra i due report promo; il follow-up UI è tracciato bene in § Follow-up e in § Riflessioni.

**Priorità per la prossima revisione simile:** (1) fix RULE APP_CONTEXT promo, (2) eseguire o delegare U1–U4 prima del «lavoro ok», (3) una prenotazione di prova con controllo `menu_promo_labels` in DB.

### Fix richiesto da Matteo in questa chat

**Solo aggiornamento report** — aggiunta sezione «Esperienza revisore — skill system». Nessun intervento codice. Il fix UI (rimozione select) resta da **validare manualmente** (tabella U1–U4).
