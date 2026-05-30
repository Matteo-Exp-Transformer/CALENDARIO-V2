# Report unificato — Ciclo BookingRequestCard (mappa → revisione → fix → revisione fix)

**Data:** 29-05-26  
**Modalità:** deep (fase 1–2) → standard (fase 3–4) · Profilo **Verifica** (mappa/revisione) + **Esecuzione** (fix)  
**Stato:** chiuso ✅

- **Cosa è cambiato:** il ristoratore vede in **Admin → Prenotazioni → Richieste in attesa** lo **stesso prezzo menù** nella card chiusa e nel pannello aperto (prima digest €0 o somma ingredienti errata vs espanso corretto). Calendario digest usa lo stesso helper — allineato al DB.
- **Cosa resta:** Archivio e modal calendario **senza** blocco prezzo menù (INC-03/04, **FU-001**); eventuale proposta vocabolario da questo ciclo (vedi § Prompt e comunicazione).
- **Serve una tua azione:** no (commit opzionale).

---

## Tipo sessione

| Campo | Valore |
|-------|--------|
| **Fasi** | 1 mappatura doc · 2 revisione mappa · 3 fix `menuPricing` + doc · 4 revisione fix |
| **Area** | Pagina Prenota (submit) → `booking_requests` → Admin **BookingRequestCard** (+ calendario digest) |
| **Storage** | `booking_requests.menu_total_per_person`, `menu_total_booking`, `menu_selection`, `menu_promo_labels`; settings `booking_menu_promos`, `booking_custom_staff_presets` |
| **Report parziali** | [Mappa](Report-mappatura-booking-request-card-29-05-26.md) · [Rev. mappa](Report-revisione-mappatura-booking-request-card-29-05-26.md) · [Fix](Report-fix-menu-pricing-digest-29-05-26.md) · [Rev. fix](Report-revisione-fix-menu-pricing-digest-29-05-26.md) |
| **Context agenti** | [BOOKING_REQUEST_CARD_CONTEXT.md](../../per-ui-design-skill/BOOKING_REQUEST_CARD_CONTEXT.md) |

---

## Procedura e prompt di Matteo (annotati)

Ciclo orchestrato con agente **prepara-prompt** (filtro a monte) + agenti esecutori/revisori. Prompt **verbatim** o parafrasi fedele — utili per vocabolario e replicare il workflow.

### Fase 0 — Prepara prompt (chat prepara-prompt)

**Prompt Matteo (sostanziale):**

> Nelle prenotazioni compilate in pagina prenota trovo dati incoerenti — digest card «Menù : €0.00/persona» vs espanso «PREZZO MENÙ: €8.00/persona». Dammi prompt per mappatura area card prenotazione ricevuta, come fatto per pagina prenota e impostazioni locale.

**Correzioni / affinamenti dopo 1ª risposta:**

1. **Solo mappatura** in fase 1; poi revisore mappa; poi fix + revisione (pipeline esplicita).
2. **Email:** funzione non implementata — escludere dal scope (Matteo non capiva il riferimento email nel prompt).
3. **Query SQL:** guida controverifica forse obsoleta — **validare su TEST** prima dell’uso.
4. **Script seed:** ok con query slug prima di lanciare; revisore deve anche **compilare Pagina Prenota** e confrontare sidebar vs card admin (promo, selezione menù).

**Output fase 0:** Prompt 1 (solo mappatura, deep, Verifica).

### Fase 1 — Mappatura (agente Verifica, solo doc)

**Trigger:** prompt 1 incollato in chat esecutore.

**Esito:** tabella campo-per-campo; INC-01…06; query Q1–Q6 verificate su TEST; campione DB `8e2d7cf6…`; nuovo `BOOKING_REQUEST_CARD_CONTEXT.md`; **FU-015** aperto (GUIDA query).

**Verdetto implicito:** root cause `menuPricing.ts` L87 — digest usa `getResolvedMenuPriceDisplay`, espanso `getMenuPriceDisplayFromBooking`.

### Fase 2 — Revisione mappa

**Prompt Matteo:** «fase uno finita. plan fatto documentazione creata.» → prepara prompt revisore.

**Trigger revisore:** prompt 2 (controverifica manuale + scenari A/B).

**Esito:** **Approva con riserve** — INC-01/02/04/05/06 confermati; **INC-07** nuovo (digest somma righe >> DB); submit manuale revisore non persistito (automazione browser); evidenza su campioni DB + QA admin su pending esistenti.

### Fase 3 — Fix (agente Esecuzione)

**Prompt Matteo:** «revisione finita. proseguiamo» → prompt 3 fix.

**Modifiche:**

| File | Cosa |
|------|------|
| `menuPricing.ts` | Policy **«DB vince»**: se `menu_total_per_person > 0` → `fromDb`; overlay items solo senza totali DB |
| `menuPricing.test.ts` | 5 test (INC-01, INC-07, fallback, tavolo, formatEuro) |
| `BOOKING_REQUEST_CARD_CONTEXT.md` §3 | Invariante aggiornato |
| `GUIDA_USO_QUERIES_CONTROVERIFICA.md` | §1 + §5 allineati |
| `FOLLOW_UP.md` | FU-015, FU-016 → **Fatto** |

**QA esecutore:** digest `8e2d7cf6…` €8; `6fcf30fe…` €13.98.

### Fase 4 — Revisione fix

**Prompt Matteo:** «lavoro finito e revisionato. controlla poi aggiorna report finale. accuratezza su prompt e comunicazione.»

**Esito revisore:** **Approva** — validate 222 test; QA browser test-pro M1/M2 digest = espanso.

**Controllo indipendente (questa sessione):** `npm run validate` → **222/222 OK**; codice `menuPricing.ts` L72-74 coerente con policy documentata.

---

## Sintesi tecnica (per agenti)

### Bug risolti

| ID | Prima | Dopo |
|----|-------|------|
| **INC-01** | Digest €0, espanso €8 (`items: []`) | Digest **€8.00/persona** |
| **INC-07** | Digest €2'425, espanso €13.98 | Digest **€13.98/persona** |
| **INC-02** | Calendario stesso helper errato | Stessa policy post-fix |

### Policy display (invariante)

In `getResolvedMenuPriceDisplay`: snapshot submit in **`booking_requests.menu_total_*`** vince su somma `menu_selection.items`. Overlay da righe **solo** se totali DB assenti (legacy).

### Debiti aperti

| ID | Nota |
|----|------|
| INC-03 | Archivio senza prezzo/promo menù |
| INC-04 / **FU-001** | Modal dettaglio calendario senza prezzo menù |

---

## Tabella mappa (sintesi — dettaglio in report mappa)

| Campo ristoratore | Colonna DB | Digest | Espanso | Coerente post-fix |
|-------------------|------------|--------|---------|-------------------|
| Prezzo menù/persona | `menu_total_per_person` | `getResolvedMenuPriceDisplay` | `getMenuPriceDisplayFromBooking` | **Sì** (stessa policy) |
| Prezzo totale | `menu_total_booking` | (non in digest) | sì | **Sì** in espanso |
| Promo | `menu_promo_labels` | sì | sì | **Sì** |
| Prodotti menù | `menu_selection` | — | lista | **Sì** |
| Intolleranze | `dietary_restrictions` | — | sì | **Sì** |

---

## Dati comunicazione (per Matteo)

| Dove nell’app | Effetto ristoratore | Componente | Storage |
|---------------|---------------------|------------|---------|
| **Pagina Prenota** | Cliente compila; totali menù salvati al submit | `BookingRequestForm` | **`booking_requests`** + settings vetrina |
| **Admin → Richieste in attesa** | Card chiusa: prezzo menù **allineato** all’apertura card | **`BookingRequestCard`** | **`booking_requests.menu_total_*`** |
| **Admin → Calendario** | Riga digest: stesso prezzo (helper condiviso) | **`DigestBookingListRow`** | Stessa tabella |
| **Archivio / modal** | Ancora **senza** prezzo menù in UI | `ArchiveBookingCard`, `DetailsTab` | — |

---

## Prompt e comunicazione — note per vocabolario / skill system

Pattern **replicabile** (Matteo + prepara-prompt):

| Voce | Uso in questo ciclo |
|------|---------------------|
| **«prepara prompt»** | Fase 0: filtra rischi, pipeline 3 fasi, query obsolete segnalate |
| **Pipeline esplicita** | «prima solo mappatura → revisore → fix → revisione» — evita scope creep |
| **«lavoro finito e revisionato»** | Chiusura ciclo + report unificato + accuratezza prompt/comunicazione |
| **Correzione scope email** | Escludere feature non implementate dal prompt (non assumere) |
| **Query «forse vecchie»** | Obbligo verifica MCP/SQL prima dell’uso — blocco nel prompt mappa |
| **Coppie admin ↔ pubblico** | Formato tabella mappa (già usato Impostazioni↔Prenota) — candidato voce vocabolario **Liv. 2** |
| **«DB vince»** | Policy prodotto prezzo menù — candidato termine tecnico in context file, non ancora in VOCABOLARIO |

**Candidati PROPOSTE (non promuovere senza Matteo):**

- «ciclo mappa» — sequenza mappa / revisione mappa / fix / revisione fix su stesso flusso dati
- «controverifica sidebar» — confronto riepilogo Pagina Prenota vs card admin post-submit

---

## Metriche successo chat (M5)

| Criterio | Valore | Nota |
|----------|--------|------|
| **Prompt Matteo** (sostanziali) | **5** | incoerenza card · affina pipeline/query · fase1 finita · revisione finita · lavoro finito+report |
| **Correzioni dopo 1ª risposta** | **3** | solo mappatura; no email; query da verificare + revisore form manuale |
| **Follow-up generati / chiusi** | **2 aperti → 2 chiusi** | FU-015, FU-016; restano FU-001, INC-03/04 |
| **Modalità alzata** | **no** (deep già a fase 1) | fix restato standard |

**Riga registro EVOLUZIONE:**

`29-05-26 · ciclo BookingRequestCard mappa→fix menuPricing · deep→standard · prompt:5 · correzioni:3 · FU:2 chiusi · alzata:no · Approva revisore fix; report unificato; template replicabile QR menu`

---

## Verdetto finale ciclo

| Fase | Verdetto |
|------|----------|
| Mappatura | Completa — context + INC documentati |
| Revisione mappa | **Approva con riserve** |
| Fix | Completo — validate + QA |
| Revisione fix | **Approva** |

**Prossimo ciclo suggerito:** mappatura **Menu QR pubblico** ↔ **Impostazione Menù QR** (admin) — vedi prompt fase 1 preparato in chat chiusura / handoff sotto.

---

## Handoff — Prompt fase 1 mappa Menu QR (copia-incolla)

```
Modalità: deep
Profilo: Verifica — SOLO mappatura flusso dati (nessun fix codice)
Avvia in plan mode: sì
Regola modalità: puoi solo ALZARE la modalità, mai abbassarla.

Obiettivo
Mappare end-to-end tutto ciò che il ristoratore configura in Admin → Tab Menu → QR Code (modale «Impostazione Menù QR») e ciò che il cliente vede sul telefono aprendo /menu/:slug/qr/:shortCode (homepage QR, categorie, preset eventi). Produrre tabella coppie admin ↔ UI pubblica, elenco elementi già mappati vs da mappare, query SQL verificate su TEST, file context persistente per agenti. Identificare incoerenze display (admin salva X, pubblico mostra Y o manca) SENZA correggerle in questa sessione.

Modello di lavoro (replicare ciclo BookingRequestCard 29-05-26)
Fase 1 = solo questo prompt. Poi: revisore mappa (browser admin + pubblico + SQL) → fix → revisione fix. Report dettagliati — serviranno al vocabolario skill system: annotare prompt Matteo, correzioni scope, coppie DOM con componente + storage.

Fuori scope assoluto (sessioni successive)
- Fix codice, refactor UI, migrazioni produzione
- Email / notifiche
- Pagina Prenota (solo se preset staff condiviso con QR preset page — leggere, non modificare)

Skill e doc obbligatorie (leggere PRIMA)
- docs/APP_CONTEXT_SKILL.md §0.0, §4, §7
- docs/per-ui-design-skill/PUBLIC_MENU_SKILL.md (DB, hook, regole)
- docs/per-ui-design-skill/PUBLIC_MENU_LAYOUT_CONTEXT.md (componenti homepage)
- docs/per-ui-design-skill/MENU_ADMIN_CONTEXT.md (tab Menu admin, se esiste sezione QR)
- docs/Sessioni di lavoro/24-05-26/Report-menu-qr-homepage-layout-sessione.md (baseline layout)
- docs/Sessioni di lavoro/29-05-26/Report-unificato-ciclo-booking-request-card-29-05-26.md (formato ciclo + tabella coppie)
- docs/Sessioni di lavoro/29-05-26/Report-mappatura-impostazioni-prenota-29-05-26.md (formato «Coppia | setting/colonna | Admin | Pubblico | Esito»)
- src/types/menu.ts — MenuQrCode, CarouselItem, payload save
- Feature flag: src/config/features.ts + TenantContext qrMenuEnabled

Feature flag e accesso
- `features.qrMenu`: Pro/Enterprise default ON; Classic solo se organizations.qr_menu_enabled
- Admin: MenuPricesTab → viewMode qr_codes → MenuQrManager → MenuQrModal
- Pubblico: supabasePublic ONLY (RULE skill §9)

Superfici ADMIN da mappare (modale MenuQrModal + sezioni MenuHomepageConfigPanel)

Per ogni controllo: label UI admin → campo JSON/DB → hook save → componente figlio

1. Nome QR *, link pubblico, copia URL
2. MenuQrThemeSection — theme_key (4 temi + PNG public/menu-themes/)
3. MenuQrCarouselSection — carousel_items[] (eyebrow opz., title max 60, description max 125, foto, ordine slide)
4. Checkbox categorie / «Attiva tutte» — category_filter (null legacy vs [] vs [keys])
5. MenuQrCategoryCardsSection — category_images JSON + override titolo/descrizione → menu_qrcode_categories
6. MenuQrHiddenItemsPicker — hidden_menu_item_ids (occhio chiuso per ingrediente)
7. Salva — useSaveMenuQrSettings (batch QR + menu_qrcode_categories)
8. Draft upload path qr/draft/{shortCode}/ → migrate qr/{menuQrCodeId}/ al primo insert
9. preset_ids — preservato DB, nessuna UI (documentare)

Superfici PUBBLICHE da mappare

Route | Componente | Cosa mostra
/menu/:slug | PublicMenuPage | default QR (primo is_active)
/menu/:slug/qr/:shortCode | PublicMenuPage | QR specifico
/menu/:slug/qr/:shortCode/c/:categoryKey | PublicMenuCategoryPage | piatti categoria, hidden filter
/menu/:slug/qr/:shortCode/preset/:presetId | PublicMenuPresetPage | menù evento staff

Elementi UI homepage (PublicMenuPage) — ogni riga tabella coppie:
- Nome ristorante header (organizations / tenant context)
- MenuCarousel — slide da carousel_items; pallini; overlay testo; placeholder h-28
- MenuNavTabs — sticky, preset vs categorie, theme tabBarStickyRgb
- Griglia CategoryCard — thumb (category_images QR → fallback menu_categories.image_url → emoji), titolo (menu_qrcode_categories.title → menu_categories.label), descrizione
- MenuFooterCard — data/ora IT
- Sfondo useMenuPageBackgroundStyle — header/body PNG tema
- tenantReady guard (slug URL = tenant context)

Elementi PublicMenuCategoryPage:
- Lista piatti menu_items; esclusione hidden_menu_item_ids
- ItemCardWithPhoto vs ItemCardText (image_url)
- Prezzo, descrizione

Elementi PublicMenuPresetPage:
- booking_custom_staff_presets da restaurant_settings
- Ordine item_ids, prezzi

Storage / tabelle (colonna per campo mappa)

| Storage | Contenuto |
|---------|-----------|
| menu_qr_codes | theme_key, carousel_items, category_images, category_filter, hidden_menu_item_ids, short_code, is_active, sort_order, preset_ids (legacy) |
| menu_qrcode_categories | title, description override per (menu_qr_code_id, category_key) |
| menu_categories | label, description, image_url, sort_order (magazzino) |
| menu_items | name, price, description, image_url, category, booking_types |
| menu-photos bucket | path qr/{id}/carousel|cat/… |
| restaurant_settings.booking_custom_staff_presets | preset page pubblica |

Tabella obbligatoria nel report (formato Impostazioni↔Prenota)

| Coppia / elemento | Admin (componente + campo UI) | Colonna / JSON | Pubblico (componente + DOM) | Fallback / resolver | Esito OK/parziale/KO/non trovato | Nota vocabolario |

Includere almeno 25 coppie priorità: tema, ogni campo carosello, filtro categorie, thumb categoria, titolo/descrizione card, hidden items, tab preset vs categorie, footer, nome locale, link QR errato / tenantReady.

Query SQL — verificare su TEST (docnnernvp) prima dell'uso

Q1: SELECT id, name, slug FROM organizations WHERE slug = '<tenant>';
Q2: SELECT id, short_code, theme_key, category_filter, jsonb_array_length(carousel_items) AS slides, hidden_menu_item_ids FROM menu_qr_codes WHERE tenant_id = '<uuid>' ORDER BY sort_order;
Q3: SELECT category_key, title, description FROM menu_qrcode_categories WHERE menu_qr_code_id = '<qr_id>';
Q4: SELECT setting_key FROM restaurant_settings WHERE tenant_id = '<uuid>' AND setting_key IN ('booking_custom_staff_presets');
Q5: information_schema o database.ts — allineamento colonne menu_qr_codes post-migrazione 036/037

NON fidarsi ciecamente di query generiche in GUIDA se non includono menu_qr_codes / menu_qrcode_categories — sezione «Query verificate» OK/KO nel report.

Ambiente e slug (OBBLIGATORIO)
- .env.local → TEST docnnernvp
- Login admin tenant con features.qrMenu true (test-pro o tenant Pro)
- Aprire URL reale /menu/<slug>/qr/<shortCode> da modale admin
- Allineare slug login admin = slug URL pubblico

Controverifica consigliata fase 2 (non in questa sessione)
- Creare/modificare QR in admin con valori distintivi (titolo carosello, 1 categoria off, 1 ingrediente nascosto)
- Salva → apri link pubblico mobile 375px
- Annotare ogni elemento visibile vs tabella mappa
- SQL SELECT stesso menu_qr_code_id

Deliverable (solo documentazione)
1. docs/Sessioni di lavoro/GG-MM-26/Report-mappatura-menu-qr-admin-pubblico-GG-MM-26.md
2. docs/per-ui-design-skill/PUBLIC_MENU_DATA_FLOW_CONTEXT.md (nuovo — analogo BOOKING_REQUEST_CARD_CONTEXT + BOOKING_DATA_FLOW)
3. Sezione «Elementi da mappare (giro 2)» — gap espliciti
4. Sezione «Candidati vocabolario» — termini UI (es. «Impostazione Menù QR», «card categoria QR», «ingrediente nascosto»)
5. docs/SESSION_LOG.md — 1 riga
6. docs/FOLLOW_UP.md — solo debiti tracciabili (FU-NNN)

Criterio di fatto
- Nessuna modifica src/
- Tabella ≥25 coppie con Esito
- Query usate verificate documentate
- Elenco esplicito KO / non trovato per giro fix
- Sezione Dati comunicazione (ristoratore + cliente + storage)

Chiusura
A «fai report finale» da Matteo: report + context file. NO §7.2 codice.
```

---

## Chiusura §7

| § | Azione |
|---|--------|
| **7.1** | Questo report unificato + report parziali collegati |
| **7.2** | `BOOKING_REQUEST_CARD_CONTEXT.md` §3; GUIDA query §1/§5 |
| **Follow-up** | FU-015, FU-016 **Fatto**; FU-001 aperto |
