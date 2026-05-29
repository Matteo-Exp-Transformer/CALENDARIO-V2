# Report unificato — Mappatura Impostazioni ↔ Pagina Prenota + fix FU-007/FU-008 + revisione (29-05-26)

**Data:** 29-05-26  
**Modalità:** light → standard · Profilo **Verifica** (APP_CONTEXT §0.0)  
**Agente:** esecutore mappatura/fix (giro 1–3) → revisore fix FU-007/FU-008 (giro 4) · **Stato:** chiuso ✅

- **Cosa è cambiato:** mappatura ~30 coppie admin ↔ Prenota; fix breakpoint descrizione mode **700px**; fix **FU-007** (descrizione card scorrevole) e **FU-008** (icona slide carosello); **revisione approvata** con validate + QA browser 375/834/1280.
- **Cosa resta:** giro 3 mappatura elementi non coperti (**FU-009**: sfondo, strip, form cliente, QA CRUD slide admin); vocabolario skill (PROPOSTE).
- **Serve una tua azione:** no.

---

## Tipo sessione

| Campo | Valore |
|-------|--------|
| **Profilo ingresso** | **Verifica** (`APP_CONTEXT_SKILL.md` §0.0) |
| **Giri** | 1 mappatura codice · 2 mappatura estesa + fix 700px · 3 fix bug KO · **4 revisione fix** |
| **Trigger revisione** | Prompt Matteo «revisiona fix FU-007/FU-008» — profilo Verifica, modalità standard |
| **Oggetto** | Allineamento Impostazioni (`RestaurantSettingsTab`, `BookingFormConfigPanel`) ↔ Pagina Prenota (`BookingRequestPage`, form e card pubbliche) |
| **Storage coinvolto** | `restaurant_settings` — chiavi `booking_public_form_config`, `booking_menu_promos`, anagrafica; tabelle menu (`menu_items`, `menu_categories`); **nessuna nuova chiave** per i fix |

---

## Obiettivo ciclo completo

1. **Giro 1–2:** mappare coppie admin ↔ Prenota (OK / parziale / KO / non trovato); documentare gap e flussi (ingredienti, promo).
2. **Giro 2:** correggere breakpoint descrizione modalità (**700px**, era 501px).
3. **Giro 3:** fixare i 2 bug **KO** emersi dalla mappatura (**FU-007**, **FU-008**).
4. **Giro 4 (revisione):** verificare fix in codice, regressioni, `npm run validate`, QA browser TEST — verdetto **Approva**; chiudere FU-007/FU-008 in `FOLLOW_UP.md`.

---

## Procedura eseguita

### Prompt iniziale (Matteo)

Agente esecutore in modalità **light**, profilo **Verifica** (APP_CONTEXT §0.0). Obiettivo: controverifica mappatura elementi tra:

- **Impostazioni admin** — tab Anagrafica (`RestaurantSettingsTab`) e sezioni collegate (Personalizza form, promo, …)
- **Pagina Prenota** — `BookingRequestPage` e componenti figli

Formato coppie: `[elemento Impostazioni] -- [elemento / sezione Prenota]` con opzionale id HTML, componente React, DOM path.

Vincoli prima sessione: **solo lettura codice**, nessuna modifica; report in `docs/Sessioni di lavoro/29-05-26/Report-mappatura-impostazioni-prenota-<data>.md`; tabella `Coppia | setting_key | Admin | Prenota | Note | Esito`; gap in fondo; §7 solo a fine sessione confermata.

Matteo ha incollato la **prima lista** di coppie (anagrafica, orari, tema admin, intestazione, modalità, card scorrevoli, carosello, import preset) e chiesto il primo report per revisore.

### Metodo agente (giro 1)

1. Letti `docs/APP_CONTEXT_SKILL.md` (orientamento profilo Verifica).
2. Tracciati file hub: `RestaurantSettingsTab`, `BookingRequestPage`, `BookingFormConfigPanel`, `useRestaurantSetting`, `restaurantSettingRegistry`, `bookingPublicFormConfig`.
3. Per ogni coppia DOM: identificato `setting_key` in `restaurant_settings`, hook admin → hook Prenota, trasformazioni (trim, fallback, responsive).
4. Esito per riga: **OK** | **parziale** | **KO** | **non trovato**.
5. Nessun `npm run validate` né QA browser (non richiesti).

### Prompt follow-up (Matteo, giro 2)

1. **Breakpoint descrizione modalità:** visibile solo sopra **700px** (non 501px) → fix codice applicato.
2. **Conferma** comportamento import menù preselezionato.
3. **Coppia dimenticata:** label tipologia → riga **TIPO** in `BookingSummarySidebar`.
4. **Nuova lista promo:** `BookingFormPromoSection` → `MenuPromoBannerCards`; distinzione nome admin vs testo Prenota.
5. **Aggiunta agente:** origine ingredienti/categorie (tab Menu + filtro Personalizza form) → griglia menù Prenota.
6. **Nota** per valutazione vocabolario skill system.
7. **Includere** procedura e prompt nel report.

### Metodo agente (giro 2)

1. Fix `BookingModeCards.tsx`: `min-[501px]:block` → `min-[700px]:block`.
2. Letti `BookingFormPromoSection`, `MenuPromoBannerCards`, `useMenuPromoViewTracking`, `menuPromo.ts`, `bookingModeLabels.ts`, `MenuSelection`, `useMenuItems`, `useMenuCategories`, `bookingFormResolver.ts`.
3. Aggiornato report (tabella, gap, sezione procedura, nota skill).

### Prompt follow-up (Matteo, giro 3 — fix)

1. **«esegui solo fix dei bug»** — FU-007 description card + FU-008 icona carosello.
2. **«fi report finale . aggiorna con lavoro svolto»** — aggiornamento report + follow-up.

### Metodo agente (giro 3)

1. `BookingSubTabCards.tsx`: render `sub_tabs[].description` sotto icona, `min-[700px]:block` (allineato a mode cards); export `SubTabCardIcon`.
2. `BookingRequestForm.tsx` (`BookingSubTabCarousel`): icona slide in alto a destra con `SubTabCardIcon` + cerchio scuro.
3. **`npm run validate`** — OK (217 test).
4. Report finale + chiusura FU-007/FU-008.

### Prompt follow-up (Matteo, giro 4 — revisione)

1. **«revisiona fix FU-007/FU-008»** — profilo Verifica, modalità standard; solo verifica, niente reimplementazione.
2. **«ottimo aggiorna report unificato con tuo report finale»** — integrazione revisione nel report unico.

### Metodo agente (giro 4 — revisore)

1. Letti fix in `BookingSubTabCards.tsx`, `BookingRequestForm.tsx` (`BookingSubTabCarousel`), regressione `BookingModeCards.tsx`.
2. **`npm run validate`** — OK (217 test).
3. QA browser TEST su `/prenota/test-pro` — viewport **375 / 834 / 1280** (descrizione card + mode; carosello 5 slide con icona).
4. Verdetto **Approva**; aggiornati report unificato, `FOLLOW_UP.md`, `SESSION_LOG.md`.

---

## Riepilogo esiti (aggiornato)

| Esito | N |
|-------|---|
| OK | 27 |
| parziale | 4 |
| KO | 0 |
| non trovato | 2 |

*(+2 non trovato: `app_theme`; `promo.label` solo admin)*

---

## Tabella mappature

| Coppia | setting_key | Admin | Prenota | Note | Esito |
|--------|-------------|-------|---------|------|-------|
| `#restaurant_name` (Anagrafica) → `h1` titolo locale | `restaurant_name` | `RestaurantSettingsTab` → autosave anagrafica | `BookingRequestPage` → `useRestaurantName()`; stile da `header_styles.restaurant_name` | trim; fallback `'Al Ritrovo'` / `organizationName`. Nome testo non editabile in Personalizza form. | **OK** |
| Contatti anagrafica → footer / accordion Contatti | `contact_email`, `contact_phone`, `contact_address` | `RestaurantSettingsTab` | `BookingRequestPage` footer | trim; nascosto se vuoto. Mobile **&lt;480px** accordion; desktop colonna destra. | **OK** |
| Orari di apertura → footer Orari | `business_hours` | `RestaurantSettingsTab` | `useBusinessHours()` + `formatHours` | Fallback default se assente. | **OK** |
| Selezione tema app → Prenota | `app_theme` | `RestaurantSettingsTab`, `AdminShell` | — | Solo dashboard admin (by design). | **non trovato** (voluto) |
| Personalizza form Nome azienda (font) → `h1` | `restaurant_name` + `header_styles.restaurant_name` | `BookingFormConfigPanel` read-only + stile | `BookingRequestPage` `h1` | Testo da Anagrafica; stile in JSON config. | **OK** |
| Titolo / Descrizione pagina → `h2` / `p` | `booking_public_form_config.page_title`, `.page_description`, `header_styles` | `BookingFormConfigPanel` | `BookingRequestPage` | Autosave header se abilitato. | **OK** |
| Accordion modalità → `BookingModeCards` | `booking_public_form_config.booking_modes[]` | `BookingFormConfigPanel` | `BookingRequestForm` → `BookingModeCards` | Solo `enabled: true`. | **OK** |
| `#mode-label-*` → label card mode | `booking_modes[].label` | input Titolo Card | `BookingModeCards` `{mode.label}` | Per `booking_type` della mode. | **OK** |
| `#mode-label-*` → riga **TIPO** sidebar | `booking_modes[].label` | stesso input Titolo Card | `BookingSummarySidebar` → `getModeLabelByType(modes, booking_type)` | Stessa chiave della card; riepilogo usa label mode **abilitata** con stesso `booking_type`. Fallback statico se mode disabilitata. Anche `BookingStickyBar` variant `'short'`. | **OK** |
| `#mode-desc-*` → descrizione sotto icona mode | `booking_modes[].description` | textarea Descrizione breve | `BookingModeCards` | **`hidden` sotto 700px**, visibile `min-[700px]:block` (fix codice 29-05-26, era 501px). | **OK** (responsive voluto) |
| Icona mode → SVG card | `booking_modes[].icon` | picker mode | `BookingModeCards` → `ModeIcon` | — | **OK** |
| Editor card scorrevoli → `BookingSubTabCards` | `sub_tabs[]` `display:'cards'` | `BookingFormConfigPanel` | `BookingRequestForm` | — | **OK** |
| Nome card scorrevole → titolo card | `sub_tabs[].label` | input Titolo card | `BookingSubTabCards` | max 30 char. | **OK** |
| Descrizione breve card → card Prenota | `sub_tabs[].description` | `AdminFieldWithCharCount` | `BookingSubTabCards` sotto icona | `min-[700px]:block`, `line-clamp-3`. **Fix giro 3** 29-05-26. | **OK** |
| Numero portate → footer card | `sub_tabs[].courses_label` | input + trim blur | testo arancione in card | — | **OK** |
| Icona sub-tab → SVG card | `sub_tabs[].icon` | picker | `SubTabCardIcon` | — | **OK** |
| Prezzo card → importo | `sub_tabs[].price_per_person` | input | `formatPriceAmountLabel`; « a persona» da 900px | — | **parziale** |
| Carosello admin → `BookingSubTabCarousel` | `sub_tabs[]` + `carousel_items[]` | `BookingFormCarouselEditor` | inline in `BookingRequestForm` | Slide senza foto escluse. | **OK** |
| Nome carosello → sidebar Opzione menu | `sub_tabs[].label` | Nome carosello | `BookingSummarySidebar` | Distinto da `carousel_items[].eyebrow`. | **OK** |
| Prezzo carosello → sidebar | `sub_tabs[].price_per_person` | editor carosello | riepilogo `/persona` | — | **OK** |
| Mostra dettaglio offerta → OFFERTA SELEZIONATA | `show_offer_details_in_summary` | toggle | `resolveCarouselSummaryDisplay` | Default true. | **OK** |
| Testo Etichetta / Titolo / Descrizione slide | `carousel_items[].eyebrow/title/description` | `CarouselSlideEditorCard` | overlay `BookingSubTabCarousel` | eyebrow in uppercase CSS. | **OK** |
| Foto slide → immagine carosello | `carousel_items[].image_url` | upload Supabase | `<img>` carosello | — | **OK** |
| Icona slide carosello → card immagine | `carousel_items[].icon` | picker slide | `BookingSubTabCarousel` alto-destra | Cerchio `bg-black/35`, riuso `SubTabCardIcon`. **Fix giro 3** 29-05-26. | **OK** |
| CRUD slide admin | `carousel_items[]` | `CarouselSlideEditorCard` | — | Codice presente; DOM vuoto segnalato — QA browser. | **parziale** |
| Import menù preselezionato | `preset_id` + `booking_custom_staff_presets` | select + `buildSubTabFromPreset` | form menù via preset collegato | **Confermato da Matteo.** Precompila label/prezzo/`hidden_*`; mostra pannelli categorie e «Menù personalizzabile». | **OK** (effetto collaterale documentato) |
| Menù personalizzabile toggle | `sub_tabs[].is_fixed_menu` | switch admin | blocco/sblocco scelta piatti | Logica `MenuSelection` + prezzo fisso. | **parziale** |
| **Tab Menu** ingredienti + categorie → griglia Prenota | tabelle `menu_items`, `menu_categories` | `MenuPricesTab` (CRUD) | `MenuSelection` → griglia «CREA IL TUO MENU» | Origine canonica DB tenant. Filtro Prenota-only in `sub_tabs[].hidden_item_ids` / `hidden_category_keys` (JSON config), risolti via `bookingFormResolver.resolveSubTabView`. | **OK** |
| Filtro «Categorie e ingredienti visibili» → voci griglia | `booking_public_form_config` → `hidden_*` | `BookingFormConfigPanel` (solo card + preset) | `MenuSelection` esclude cat/item hidden | Non modifica DB menu; solo vista Prenota per quella sottotab. Preset limita pool a `preset.item_ids`. | **OK** |
| Sezione «Messaggio Promozionale» → banner | `booking_menu_promos[]` | `BookingFormPromoSection` | `MenuPromoBannerCards` via `useMenuPromoViewTracking` | Array JSON in `restaurant_settings`. Risoluzione: `resolveMenuPromoForBookingView` (priorità sub_tab poi booking_type). | **OK** |
| «Testo promo (Prenota)» → testo banner | `booking_menu_promos[].message` | textarea `draftMessage` | `{resolvedPromo.message}` trim in banner | trim; `whiteSpace: pre-wrap`. Max 500 char. | **OK** |
| «Nome promo (admin)» → lista admin | `booking_menu_promos[].label` | input `draftLabel` | — | **`getMenuPromoAdminLabel` — non mostrato al cliente.** Lista admin + snapshot submit opzionale. | **non trovato** su Prenota (voluto) |

---

## Flusso ingredienti e categorie (dettaglio)

```
MenuPricesTab (admin)
  ├─ menu_categories  (key, label, sort_order, …)
  └─ menu_items       (id, name, price, category, booking_types, …)
           │
           ▼
useMenuCategories() / useMenuItems()  ← stessi hook in admin e Prenota
           │
           ▼
BookingFormConfigPanel (solo se card + preset_id)
  └─ hidden_category_keys[], hidden_item_ids[]  →  booking_public_form_config
           │
           ▼
bookingFormResolver.resolveSubTabView()
  └─ field_overrides: se non personalizzato, hidden_* = [] (eredità preset)
           │
           ▼
BookingRequestForm → MenuSelection
  └─ normalizedMenuItems: esclude hidden cat/item;
     filtra per booking_type e item_ids del preset attivo
```

**In parole semplici:** piatti e categorie li crei nel **tab Menu** (database). In **Personalizza form**, per ogni card con menù importato, puoi **nascondere** categorie o singoli piatti **solo sulla pagina Prenota**, senza cancellarli dal menu del ristorante.

---

## Flusso promo (dettaglio)

| Campo | Admin UI | Cliente Prenota |
|-------|----------|-----------------|
| `label` | Nome in lista («menu al 30% Sconto») | Non visibile |
| `message` | «Testo promo (Prenota)» | Banner `MenuPromoBannerCards` |
| `placement` + `booking_types` / `sub_tab_refs` | checkbox abbinamento | Quale promo appare per tipologia/sottotab |
| `visible_on_booking` | toggle visibilità | Se false, banner assente |

Save: `useUpsertRestaurantSetting({ key: 'booking_menu_promos', value })`.

---

## Gap e anomalie (residui)

1. ~~**`sub_tabs[].description`**~~ — **risolto** giro 3 (FU-007).
2. ~~**Icona slide carosello**~~ — **risolto** giro 3 (FU-008).
3. **`app_theme`** ≠ tema/sfondo Prenota (`public_booking_page_background`, strip).
4. **Import preset** — comportamento confermato; pannelli admin extra attesi.
5. **Descrizione mode / card scorrevole** — nascoste **&lt;700px** (responsive voluto).
6. **Prezzo card** — «a persona» solo ≥900px.
7. **CRUD slide carosello** — verificare render pulsanti in TEST (FU-009).
8. **Sfondo pagina / strip foto / privacy form** — giro 3 mappatura (FU-009).

---

## Nota per vocabolario / skill system

**Valutazione:** questa sessione di mappatura è un buon candidato per arricchire il vocabolario (`docs/Comunicazione-Skill/VOCABOLARIO.md`) e/o una skill area «Impostazioni ↔ Prenota».

**Termini utili da promuovere (Liv. 2–3):**

| Termine Matteo / DOM | Significato tecnico | setting_key / storage |
|---------------------|---------------------|------------------------|
| Anagrafica Azienda | Tab impostazioni dati locale | `restaurant_name`, `contact_*` |
| Personalizza form | Pannello config UI Prenota | `booking_public_form_config` |
| Card scorrevole / Opzione menu | `SubTab` con `display: 'cards'` | JSON nested in config |
| Carosello | `SubTab` con `display: 'carousel'` | `carousel_items[]` |
| Menù preselezionato | Preset staff | `booking_custom_staff_presets` + `preset_id` |
| Messaggio promozionale | Banner testuale | `booking_menu_promos` |
| Nome promo (admin) | Label interna, non cliente | `MenuPromo.label` |
| Filtro categorie/ingredienti | Vetrina Prenota-only | `hidden_category_keys`, `hidden_item_ids` |
| TIPO (sidebar) | Label modalità nel riepilogo | `booking_modes[].label` via `getModeLabelByType` |

**Proposta:** aggiungere in APP_CONTEXT §0 (riga Pagina Prenota) un rimando «mappatura impostazioni» che invochi un template report come questo per sessioni Verifica ripetibili. Segnalare in `docs/Comunicazione-Skill/PROPOSTE.md` se Matteo approva.

---

## Esecuzione fix (giro 3)

| File | Modifica | Effetto ristoratore |
|------|----------|---------------------|
| `BookingSubTabCards.tsx` | Render `description` sotto icona; export `SubTabCardIcon` | Cliente vede sottotitolo card menù su desktop (≥700px) |
| `BookingRequestForm.tsx` | Icona su slide carosello (top-right) | Icona scelta in admin visibile sulla foto promo |
| `BookingModeCards.tsx` (giro 2) | Breakpoint 700px descrizione mode | Testo sotto card tipologia solo da tablet/desktop largo |

**Test esecutore (giro 3):** `npm run validate` OK — lint, typecheck, 217 test Vitest.

---

## Sintesi per il ristoratore (fix FU-007 / FU-008 — oggi in app)

| Dove (admin) | Cosa fa Mario | Dove (cliente) | Effetto |
|--------------|---------------|----------------|---------|
| **Personalizza form → card scorrevole → Descrizione breve** | Scrive un sottotitolo opzionale sulla card menù | **Pagina Prenota** → card orizzontali (`BookingSubTabCards`) sotto la tipologia scelta | Il testo compare **da 700px in su** (tablet/desktop); nascosto su mobile stretto, come la descrizione delle card tipologia |
| **Personalizza form → Editor carosello → icona slide** | Sceglie icona per ogni foto promo | **Pagina Prenota** → carosello (`BookingSubTabCarousel`, es. «Menu a Prezzo Fisso») | Icona visibile **in alto a destra** sulla foto, stesso stile icone delle card menù |

### Storage (fix — nessuna chiave nuova)

| Campo JSON | Dove si salva | Cosa contiene |
|------------|---------------|---------------|
| `sub_tabs[].description` | `restaurant_settings.booking_public_form_config` | Testo breve opzionale (max 80 char in admin) |
| `carousel_items[].icon` | stesso JSON, nested in sottotab `display: 'carousel'` | Valore icona slide (`cloche`, `chef-hat`, `star`, `leaf`, …) |

---

## Prossimi passi

- [x] Fix render `description` su `BookingSubTabCards` (FU-007)
- [x] Fix icona slide in `BookingSubTabCarousel` (FU-008)
- [x] Revisione fix FU-007/FU-008 (validate + QA browser)
- [ ] QA CRUD slide carosello admin (FU-009)
- [ ] Giro 3 mappatura: sfondo, strip foto, form campi cliente, privacy (FU-009)

---

## File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `docs/Sessioni di lavoro/29-05-26/Report-mappatura-impostazioni-prenota-29-05-26.md` | Report unificato giro 1–4 (mappatura + fix + revisione) | Sessione Verifica |
| `docs/SESSION_LOG.md` | Riga sessione | §7.1 APP_CONTEXT |
| `docs/FOLLOW_UP.md` | FU-007/008 **Fatto** (nota revisione); FU-009 aperto | Giro 3 + giro 4 |
| `docs/SESSION_LOG.md` | Riga sessione con revisione approvata | Giro 4 |
| `docs/Comunicazione-Skill/PROPOSTE.md` | Voce mappatura ↔ vocabolario | Nota skill system nel report |
| `docs/Comunicazione-Skill/OSSERVAZIONI.md` | Dati sessione | Protocollo comunicazione |
| `docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md` | M5 metriche + registro riga mappatura | Chiusura ciclo + PAUSA-RACCOLTA |
| `docs/PREPARA_PROMPT_SKILL.md` | §5 punto 5 metriche a valle | Skill system |
| `docs/Comunicazione-Skill/PROPOSTE.md` | Accettata voce metriche M5 | Archivio 29-05-26 |
| `src/features/booking/components/publicBooking/BookingModeCards.tsx` | `min-[700px]:block` | Giro 2 |
| `src/features/booking/components/publicBooking/BookingSubTabCards.tsx` | description + export `SubTabCardIcon` | Fix FU-007 (giro 3) |
| `src/features/booking/components/BookingRequestForm.tsx` | Icona carosello alto-destra | Fix FU-008 (giro 3) |

---

## Dati comunicazione

### Frasi / richieste ricorrenti

| Frase / pattern | × | Esito |
|-----------------|---|-------|
| «agente esecutore» + profilo Verifica + formato coppie ` -- ` | 1 | OK — workflow rispettato |
| Lista DOM path lunga (primo giro) | 1 | OK — tabella mappature |
| «procedi» / «se è tutto chiaro procedi» | 1 | OK — avvio senza «vai» esplicito accettato |
| «cambia view … solo sopra 700px» | 1 | OK — fix codice + report |
| «confermo comportamento import menu preselezionato» | 1 | OK — esito promosso a OK in tabella |
| «report unificato o solo report?» / «skill usate?» | 1 | Risposta breve: unificato, APP_CONTEXT only |
| «procedura finale» | 1 | Chiusura §7 (giro 2) |
| «esegui solo fix dei bug» | 1 | Fix FU-007/008 |
| «fi report finale» | 1 | Aggiornamento report giro 3 |
| «revisiona fix FU-007/FU-008» | 1 | Giro 4 revisore — Approva |
| «aggiorna report unificato con report finale» | 1 | Integrazione revisione in questo file |

### Cronologia / prompt di Matteo (annotati)

1. **Prompt iniziale** — Agente esecutore light, Verifica, mappatura Anagrafica/Personalizza form ↔ Prenota; prima rispondere con conferma formato + file da leggere; poi attendere «vai». *Matteo ha incollato subito la lista + «procedi».*
2. **Lista coppie giro 1** — ~25 coppie DOM (anagrafica, orari, tema, intestazione, modalità, card, carosello, import preset) con note bug (descrizione card, icona carosello, CRUD vuoto).
3. **Giro 2** — Breakpoint 700px; conferma import preset; coppia TIPO sidebar; promo (`BookingFormPromoSection` → `MenuPromoBannerCards`); ingredienti/categorie; nota vocabolario skill; procedura+prompt nel report.
4. **Chiusura giro 2** — «ok fai procedura finale».
5. **Giro 3** — «esegui solo fix dei bug» → validate OK; «fi report finale».
6. **Giro 4** — «revisiona fix FU-007/FU-008» → validate OK + QA browser TEST; «aggiorna report unificato».

### Voci Liv.2 applicate

Nessuna voce Liv.2 esplicita dal VOCABOLARIO in questa sessione (profilo Verifica custom via prompt).

### Cosa non è successo in chat

| Tipo | Dettaglio |
|------|-----------|
| Test | Giro 1–2: validate **non** eseguito; giro 3 + **giro 4: validate OK** (217 test) |
| Browser QA | Giro 1–3: non richiesto; **giro 4: eseguito** su `/prenota/test-pro` (375/834/1280) |
| Commit / push | Nessuno |
| Migrazioni DB | Nessuna |
| Aggiornamento context panel / BOOKING_DATA_FLOW | Solo lettura |
| §7 al primo giro | Rimandata fino a «procedura finale» |

### Token / automazione

- **Automatizzabile:** template report mappatura con colonne fisse + sezione procedura (vedi PROPOSTE).
- **Manuale:** coppie DOM da Matteo; giudizio OK/KO su gap UI.

---

## Derivazione errori

| # | Cosa | Causa | Come evitare |
|---|------|-------|--------------|
| 1 | Descrizione card scorrevole assente in Prenota | **bug preesistente** | **Risolto** giro 3 — **revisione Approva** giro 4 |
| 2 | Icona slide carosello assente | **bug preesistente** | **Risolto** giro 3 — **revisione Approva** giro 4 |
| 3 | CRUD slide admin DOM vuoto (segnalato) | **da verificare** — codice ha pulsanti; possibile CSS/viewport o snapshot incompleto | QA browser TEST |
| 4 | Breakpoint 501px vs desiderio 700px | **prompt ambiguo** iniziale (codice legacy) | Matteo ha corretto in giro 2 → fix applicato |
| — | Nessun errore agente su mappature promo/menu | — | — |

Pattern ricorrenti: gap «campo salvato in admin, non renderizzato in Prenota» — candidato ERRORI_PROCESSO / checklist Verifica.

---

## Stato finale sessione (29-05-26)

| Voce | Stato |
|------|--------|
| Mappatura giro 1 (anagrafica, form, card, carosello) | Completata |
| Mappatura giro 2 (TIPO sidebar, promo, menu DB) | Completata |
| Fix breakpoint descrizione mode 700px | Completato (giro 2) |
| Fix FU-007 / FU-008 | Completati (giro 3) — **revisione giro 4 Approva** |
| `npm run validate` | OK giro 3 + giro 4 (217 test) |
| QA browser 375/834/1280 | OK giro 4 (fix card + carosello) |
| Giro 3 mappatura (sfondo, strip, form) | Aperto → FU-009 |
| Proposta vocabolario skill | In PROPOSTE |
| §7 chiusura | Completata (aggiornata report finale) |
| Metriche successo chat (M5) | Registrate in report + `EVOLUZIONE_SKILLS.md` |

---

## Report finale revisione — fix FU-007 / FU-008 (giro 4)

**Profilo:** Verifica · **Modalità:** standard  
**Scope:** solo i 2 bug KO della mappatura; **FU-009** e giro 3 mappatura fuori scope.

### Cosa è stato fatto (revisore)

1. Verificato codice fix giro 3 vs criteri prompt revisione.
2. Controllata regressione breakpoint **700px** su `BookingModeCards`.
3. Eseguito **`npm run validate`** — OK (217 test).
4. QA browser TEST tenant **test-pro** — `/prenota/test-pro`, viewport **375 / 834 / 1280**.
5. Aggiornati `FOLLOW_UP.md` (FU-007/008 **Fatto**), `SESSION_LOG.md`, questo report unificato.

### File esaminati (revisione)

| File | Ruolo |
|------|--------|
| `BookingSubTabCards.tsx` | Render `sub_tabs[].description`; export `SubTabCardIcon` |
| `BookingRequestForm.tsx` | `BookingSubTabCarousel` — icona slide alto-destra |
| `BookingModeCards.tsx` | Regressione breakpoint descrizione mode (giro 2) |
| `BookingFormConfigPanel.tsx` | Conferma campo admin «Descrizione breve» → `sub_tabs[].description` |

### Tabella verifica fix

| FU | Fix verificato | File | Esito | Note responsive |
|----|----------------|------|-------|-----------------|
| **FU-007** | `tab.description?.trim()`; nascosto se vuoto o `display === 'carousel'` | `BookingSubTabCards.tsx` | **OK** | `hidden min-[700px]:block` — allineato a mode cards. Posizione DOM: **sotto icona** (mode card: sotto titolo) — stesso breakpoint, layout accettabile. |
| **FU-008** | `item.icon` → `SubTabCardIcon` in cerchio `bg-black/35` top-right | `BookingRequestForm.tsx` | **OK** | Icona su **5/5** slide carosello; visibile a tutti i viewport. Riuso componente — no duplicazione. Icone legacy `utensils` → fallback fork (preesistente). |

### QA browser per viewport (TEST, test-pro)

| Viewport | FU-007 descrizione card «Opzione menu» | FU-007 descrizione mode | FU-008 icona carosello (5 slide) |
|----------|----------------------------------------|-------------------------|----------------------------------|
| **375** | Nascosta (`display: none`) | Nascosta | **OK** — 5 icone visibili |
| **834** | Visibile (testo «saddasdasdasasd») | Visibile | **OK** — 5 icone visibili |
| **1280** | Visibile | Visibile | **OK** — 5 icone visibili |

### Regressioni

| Controllo | Esito |
|-----------|--------|
| `BookingModeCards` — `mode.description` solo `min-[700px]:block` | **OK** |
| `BookingSummarySidebar` / `BookingStickyBar` | **OK** — nessuna modifica nei fix |

### Test automatici

| Test | Esito | Note |
|------|--------|------|
| `npm run validate` (giro 4 revisore) | **OK** | lint + typecheck + 217 test Vitest |

### Verdetto revisione

| Aspetto | Esito |
|---------|--------|
| Fix FU-007 in codice | **Approva** |
| Fix FU-008 in codice | **Approva** |
| Responsive (700px descrizioni) | **Approva** — coerente mode + card scorrevole |
| Regressioni | **Approva** |
| QA browser documentato | **Approva** |
| **Verdetto complessivo** | **Approva** — FU-007 e FU-008 chiusi |

### Nota minore (non bloccante)

La descrizione sulla **card scorrevole** è posizionata **sotto l’icona**, mentre sulle **card tipologia** è **sotto il titolo**. Comportamento responsive identico (≥700px); differenza solo di gerarchia visiva nella card menù.

---

## Metriche successo chat (M5)

Prima applicazione del registro oggettivo in `docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md` (§ Metriche di successo chat) e `docs/PREPARA_PROMPT_SKILL.md` §5 punto 5. **Solo numeri** — interpretazione al Meta senior in sessione dedicata.

| Criterio | Valore | Nota breve |
|----------|--------|------------|
| **Prompt Matteo** (sostanziali, no «ok»/«grazie») | **7** | mappatura+g2 · procedura finale · fix bug · report finale · revisione · aggiorna unificato |
| **Correzioni dopo la 1ª risposta** | **2** | breakpoint descrizione mode 700px (era 501px); chiarimento peso light vs standard a fine ciclo |
| **Follow-up generati** | **3** | FU-007, FU-008 (KO mappatura) + FU-009 (giro 3); **2 chiusi** in revisione giro 4 |
| **Modalità alzata in corsa** | **sì** | light (prompt) → standard (report file, §7, fix codice fuori scope light) |

**Riga registro** (append in `EVOLUZIONE_SKILLS.md`):

`29-05-26 · mappatura Impostazioni↔Prenota + fix FU-007/008 + revisione · standard · prompt:7 · correzioni:2 · FU:3 · alzata:sì · 4 giri; revisione Approva; FU-009 aperto`

---

## Chiusura §7

Applicata 29-05-26; report unificato **unico file** (giro 1 mappatura + giro 2 estensione + giro 3 fix + **giro 4 revisione approvata**), coerente con regola report unificato APP_CONTEXT §7.1.

| Follow-up | Stato post-revisione |
|-----------|---------------------|
| FU-007 | **Fatto** |
| FU-008 | **Fatto** |
| FU-009 | **Aperto** — giro 3 mappatura + QA CRUD slide admin |
