---
name: app-context
description: >-
  Skill 0 — orienta qualsiasi agente su CalendarBackup-v2. Caricalo quando inizi
  una sessione senza sapere quale skill usare, o quando il task attraversa più aree.
  Mappa l'app, definisce invarianti globali e instrada al skill corretto.
---

# App Context — Guida orientamento agente

> Stack: React 18 + Vite + TypeScript + Tailwind CSS v4 + Supabase + TanStack Query.
> File master: `CLAUDE.md` — leggerlo per comandi e setup.

---

## 0. Prima cosa: instrada al skill corretto

Leggi il task ricevuto e applica questa tabella:

| Il task riguarda… | Skill da caricare |
|-------------------|-------------------|
| **AdminDashboard / BookingCalendar / BookingForm / BookingsList / BookingDetailsModal / useBookingMutations / pagina admin classica / tab Calendario-Prenotazioni-Settings** | `docs/ADMIN_CLASSIC_SKILL.md` ⚠️ **OBBLIGATORIO PRIMA DI MODIFICARE** |
| AdminShell / sidebar / nav / sezioni / routing admin | `docs/Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md` |
| CRM / clienti / customer / useCustomers / CustomerProfile | `docs/Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md` |
| Edition / FEATURES flag / useFeatures / features.sidebar / buildFeatures | `docs/APP_CONTEXT_SKILL.md` § 2 + `src/config/features.ts` + `src/hooks/useFeatures.ts` |
| **TenantContext / useFeatures / edition / tenant_features / login / auth / feature flag / featureOverrides** | `docs/DATA_FLOW_SKILL.md` — flusso identitario end-to-end |
| **Edition / pricing / add-on / vendita / cliente / pacchetto / commerciale / feature_key / bundle** | `docs/Marketing-Skill/MARKETING_SKILL.md` |
| **tenant_features** (tabella DB, RPC, override) | `docs/Database-Skill/DB_SKILL.md` + `docs/DATA_FLOW_SKILL.md` |
| **Menu QR pubblico / QR code / foto piatti / pagina mobile menu / menu digitale** | `docs/per-ui-design-skill/PUBLIC_MENU_SKILL.md` — report sessione layout: `docs/Sessioni di lavoro/24-05-26/Report-menu-qr-homepage-layout-sessione.md` |
| **Pagina Prenota v2 / BookingRequestPage / BookingRequestForm / card tipologia / sidebar riepilogo / BookingModeCards / BookingSubTabCards / BookingFormConfigPanel / booking_public_form_config / sub_tabs** | `docs/APP_CONTEXT_SKILL.md` §4 RULE Pagina Prenota v2 + `docs/per-ui-design-skill/UI_RESPONSIVE_SKILL.md` + `docs/per-ui-design-skill/UI_EDIT_SKILL.md`. **Agenti Cursor che modificano Personalizza form:** leggere anche `docs/per-ui-design-skill/BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md`. |
| **Layout pagina menu pubblica / card categorie / carosello / hero section / pill icone / testo su immagini / griglie / sfondi tema** | `docs/per-ui-design-skill/PUBLIC_MENU_LAYOUT_CONTEXT.md` |
| UI / className / Tailwind / layout / componenti / tema / colori / index.css | `docs/per-ui-design-skill/UI_EDIT_SKILL.md` |
| **Responsive / breakpoint / mobile / grid che collassa / padding-gap adattivi / max-width container / contenuto pagina vs sidebar** | `docs/per-ui-design-skill/UI_RESPONSIVE_SKILL.md` |
| **BookingCalendar — layout tab Calendario, celle mese, titolo responsive, data su Oggi, padding tab** | **`docs/per-ui-design-skill/BOOKING_CALENDAR_LAYOUT_CONTEXT.md`** + `ADMIN_CLASSIC_SKILL.md` §4c |
| DB / schema / migrazioni / RLS / policy / tabelle / trigger / tipi database.ts | `docs/Database-Skill/DB_SKILL.md` |
| Task che tocca admin classica + qualsiasi altra cosa | **ADMIN_CLASSIC sempre + skill area** |
| Task che tocca sia layout shell che stile Tailwind | **entrambi** ADMIN_SHELL + UI_EDIT |
| Task responsive che tocca il comportamento sidebar/overlay | **entrambi** UI_RESPONSIVE + ADMIN_SHELL |
| Task che tocca sia DB che UI o shell | **entrambi** DB + skill area corrispondente |
| **data/ora prenotazioni / dateUtils / createBookingDateTime / extractTimeFromISO / desired_time / confirmed_start / orario display** | `docs/ADMIN_CLASSIC_SKILL.md` §4b — leggere **prima** di toccare qualsiasi logica orario |
| **Test / Vitest / Playwright / staging Supabase / CI / copertura** | `docs/Testing-Skill/TESTING_SKILL.md` |
| **Privacy Policy / GDPR / DPA / cookie / registro trattamenti / data breach / "cose da fare per produzione" / conformità legale / configurazioni compliance Supabase (PITR, SSL, MFA)** | `docs/Legal-Production-Skill/LEGAL_PRODUCTION_SKILL.md` |
| Non è chiaro di quale area si tratti | Leggi `CLAUDE.md`, poi usa questa tabella |

Carica il skill indicato **prima** di aprire qualsiasi file da modificare.

> **Regola sub-task**: ogni volta che un agente scompone il lavoro in sotto-task (a se stesso o a un sub-agente), deve ripetere questa domanda per ciascun sotto-task. Un task iniziale fuori dall'area booking può diventare un sub-task che tocca `useBookingMutations` o `dateUtils` — in quel momento scatta l'obbligo di caricare lo skill corrispondente prima di procedere. "L'ho già letto all'inizio" non è sufficiente se il sotto-task cambia area.

---

## 1. Due aree dell'app

| Area | Entry point | Client Supabase | Session |
|------|-------------|-----------------|---------|
| **Pubblica** — form prenotazione clienti | Route con slug tenant | `supabasePublic` | no |
| **Admin** — dashboard ristoratore | `/admin` → `AdminShell` | `supabase` | sì (localStorage) |

Non mischiare mai i due client. `supabase` è per operazioni admin autenticate; `supabasePublic` è per form pubblici anonimi.

---

## 1b. ⚠️ Ambiente DB attivo: SERVER DI TEST

**Tutto lo sviluppo (migrazioni, RPC, query manuali, rigenerazione tipi) va fatto sul server di TEST, mai su produzione.**

| Ambiente | Project ref | URL | MCP tool da usare |
|----------|-------------|-----|-------------------|
| **TEST** ← usare sempre | `docnnernvp` | `docnnernvpyrbwuzzach.supabase.co` | `Supabase_test__*` |
| PRODUZIONE — non toccare | `rwuxgvld` | `rwuxgvldzrkabglkasym.supabase.co` | `Supabase__*` (solo lettura, su richiesta esplicita) |

- Prima di `apply_migration` / `execute_sql` / `generate_typescript_types`: chiamare `get_project_url` e **verificare che risponda `docnnernvp`**. Se risponde `rwuxgvld` è produzione → fermarsi.
- `supabase db push` da CLI non è disponibile in questo ambiente: applicare le migrazioni via MCP `Supabase_test__apply_migration`.
- I due DB si disallineano nella numerazione migrazioni. Allinearsi sempre allo stato del **test** con `Supabase_test__list_migrations`.
- Il file in `supabase/migrations/` resta la fonte versionata; la migrazione va comunque scritta lì oltre che applicata via MCP sul test.

---

## 2. Mappa routing admin

Il routing admin è **state-based** (nessun cambio URL). `AdminShell.tsx` gestisce uno stato `section` e monta il componente corretto.

**Il comportamento varia in base all'edition del tenant** (letto da `useFeatures()`):

| Edition | Section default | Layout |
|---------|----------------|--------|
| `classic` | `'prenotazioni'` | Nessuna sidebar — AdminDashboard standalone |
| `pro` / `enterprise` | `'home'` | Sidebar completa + sezioni avanzate |

| `section` | Componente montato | Visibile in |
|-----------|-------------------|-------------|
| `'home'` ← DEFAULT Pro | `<AdminDashboard bodyOverride={<AdminHomePage />} />` | Pro, Enterprise |
| `'prenotazioni'` ← DEFAULT Classic | `<AdminDashboard />` | tutte le edition |
| `'crm'` | `<CrmPage />` | Pro, Enterprise |
| `'servizio'` | `<ServizioPage />` | Pro, Enterprise |
| `'analytics'` | `<AnalyticsPage />` | Pro, Enterprise |

**Nota sezione Home**: AdminDashboard viene sempre montata anche per `section='home'`. AdminHomePage viene passata come `bodyOverride` — Header e 5 NavItem restano visibili. Cliccando un NavItem da Home, la sezione passa a `'prenotazioni'`.

**Header AdminDashboard — nav vs collapse nuova prenotazione**: i 5 tab in header (`nav` Calendario / Prenotazioni / …) non si nascondono mai, anche con il collapse «Inserisci Nuova Prenotazione» aperto sulla tab Prenotazioni. Con il form aperto si nascondono solo le sotto-righe contestuali del tab attivo (statistiche, filtri archivio, ecc.); il corpo lista richieste in `<main>` resta `hidden` finché il form è espanso (eccetto `bodyOverride` Home Pro).

File di dettaglio per ogni sezione: `docs/Dashboard-laterale-skill/ADMIN_PAGES_CONTEXT.md`.

---

## 3. Struttura cartelle src/

```
src/
├── components/layout/   AdminShell.tsx
├── components/ui/       Button, Input, Modal, Card, Badge, Alert, EmptyState, Spinner…
├── config/              features.ts  ← buildFeatures(edition) → FeatureFlags
├── contexts/            TenantContext.tsx  ← LOCKED (eccezione: campo edition + featureOverrides)
├── features/booking/
│   ├── components/      componenti dashboard (BookingCalendar, CRM, MenuQrManager, MenuQrModal, ecc.)
│   │   └── settings/    BookingFormConfigPanel, SettingsSaveUi (footer/barre sezione Impostazioni)
│   ├── hooks/           useAdminAuth, useBookingMutations, useMenuQrCodes, useCustomers, ecc.
│   ├── lib/             restaurantSettingRegistry
│   └── utils/           helper puri (date, prezzi, menuCatalogGrouping)
├── hooks/               useFeatures.ts, useBusinessHours.ts, useRateLimit.ts…
├── lib/                 supabase.ts, supabasePublic.ts, email.ts, logger.ts, utils.ts
│                        menuPhotoUpload.ts, shortCodeGenerator.ts
├── pages/               AdminDashboard, AdminHomePage, CrmPage, ServizioPage, AnalyticsPage…
│                        PublicMenuPage, PublicMenuCategoryPage, PublicMenuPresetPage
├── router.tsx           ← solo su esplicita richiesta
└── types/               database.ts (generato), booking.ts, customer.ts, edition.ts, menu.ts
```

Tab impostazioni attivo: `RestaurantSettingsTab.tsx` (LOCK strutturale in `ADMIN_CLASSIC_SKILL`).

---

## 4. Invarianti globali — valgono in ogni task, in ogni file

```
LOCK  CollapsibleCard.tsx          — 57 test — mai toccare
LOCK  Modal.tsx  z-[10050]         — stack calibrato con Toast z-100000
LOCK  TenantContext.tsx            — core multi-tenancy — MAI (eccezione: edition + featureOverrides)
LOCK  src/lib/supabase.ts          — client autenticato — MAI
LOCK  supabase/migrations/         — DB remoto già applicato — MAI
LOCK  src/router.tsx               — solo su esplicita richiesta

LOCK  ADMIN CLASSICA — vedi docs/ADMIN_CLASSIC_SKILL.md
      • src/pages/AdminDashboard.tsx
      • src/features/booking/components/BookingCalendar.tsx
      • src/features/booking/components/BookingForm.tsx
      • src/features/booking/components/BookingsList.tsx
      • src/features/booking/components/BookingDetailsModal.tsx
      • src/features/booking/components/RestaurantSettingsTab.tsx
      • src/features/booking/hooks/useBookingMutations.ts
      • src/features/booking/hooks/useCustomers.ts (parte base)

      → Per i file LOCK l'agente DEVE: (1) leggere prima tutti i file collegati
        per capire l'impatto, (2) identificare i possibili conflitti, (3) procedere
        solo se la modifica preserva l'integrità strutturale e i contratti esistenti.
        Non serve attendere conferma esplicita SALVO che la modifica violi un
        invariante documentato. Vedi sezione 0 di ADMIN_CLASSIC_SKILL.md.

RULE  Prima di modificare: leggere INTERO il file da toccare + i file collegati
      necessari (chiamanti, tipi, componente condiviso). MAI editare avendo
      letto solo il frammento restituito da grep/search. Spendere token in
      lettura completa previene fix a pezzi e bug a catena.
RULE  Sidebar features non importano da admin classica senza interfacce pubbliche
RULE  Nuove feature in admin classica SEMPRE dietro FEATURES flag — usare useFeatures(), mai ADMIN_FEATURES hardcoded
RULE  Prop aggiunte ad AdminDashboard sempre OPTIONAL con default sensati
RULE  Edition Classic = !features.sidebar → AdminShell fa return anticipato, nessuna sidebar
RULE  Per aggiungere una feature gated: 1) flag in FeatureFlags+buildFeatures 2) featureKey in SIDEBAR_NAV_ITEMS 3) gating nel render

RULE  walk_in_max_guests: range 0–500 (0 = nessun walk-in accettato), campo opzionale. email/phone contatto opzionali — validati solo se compilati. Validazione in `restaurantSettingRegistry.ts`.
RULE  Selettore orario: UNICO componente `TimePicker24h` (pubblico+admin), minuti liberi 0-59, prop `compact` per form pubblico — `TimeInput` ELIMINATO, non reintrodurre input nativo type="time"
RULE  Avviso orario notturno (fine < inizio): testo unico `OVERNIGHT_TIME_END_HINT` in `bookingTimeSlots.ts` — mostrarlo nel modal CRUD fascia (Servizio) e nella sezione Classic «Imposta Fasce Orarie» (`RestaurantSettingsTab`, `!features.servizio`); **non** usare sigle inline tipo `(notturna +1)` nelle liste fasce Pro
RULE  Modal CRUD fascia (`ServiceSlotsManager` / `SlotModal`): `FormInfoToggle` (icona + «?») apre `FormInfoPanel` blu (`border-blue-200` / `bg-blue-50` / `text-blue-800`) con chiusura ✕; menu durata senza «Quando?» — etichetta scope (`Sempre`, …); scope `forever` = solo `service_slots`
RULE  Assegnazione tavoli (Servizio → `AssignmentMapPanel`): elenco prenotazioni non assegnate filtrato per **ora di inizio** dentro `start_time`–`end_time` della fascia selezionata — `bookingStartsInServiceSlot` (`serviceSlotBookingFilter.ts`) + `isTimeInsideSlot`; non usare overlap durata prenotazione; orari fascia da `service_slots` (non override runtime)
RULE  Libera tavolo (`useCheckoutTable`): prenotazione liberata torna in elenco PRENOTAZIONI; senza turno successivo attivo sul tavolo → DELETE assignment; con turno 2+ in coda → UPDATE `checked_out_at` — vedi `ADMIN_PAGES_CONTEXT.md` § Assegnazione tavoli
RULE  Assegnazione/riassegnazione rapida da Calendario (`QuickTableAssignModal`, solo Pro `hasTurnsFeature`): pallino grigio → assign, pallino verde → dialog conferma + `useReleaseBookingAssignment` (libera per `booking_id`) → poi flusso sala/tavolo identico; se turni in coda → avviso bloccante senza modifica DB; query key condivisa `TABLE_ASSIGNMENTS_QUERY_KEY`
RULE  Menu Prenota (`MenuPricesTab` + `MenuSelection` + `PresetMenuBuilder`): categorie in `menu_categories` (`label`, `description`, `image_url` per Prenota); foto thumbnail homepage QR in `menu_homepage_config.category_images` (path Storage `{tenantId}/cat/{key}.webp`) — non mischiare. Foto categoria Prenota: `menu_categories.image_url`, path `{tenantId}/booking-cat/{categoryId}.webp`. Panoramica categorie/ingredienti condivisa via `menuPricesCatalogLayout.ts` (griglia CollapsibleCard, righe `menu-prices-item-row`, selezione `menu-prices-item-row--selected`). Grouping `itemsByCategory` centralizzato in `src/features/booking/utils/menuCatalogGrouping.ts` (`groupMenuItemsByCategory`) — usarlo, non duplicare. Subtitle card categoria: `N ingredienti` (con pluralizzazione) in tutti e 3 i componenti — non usare formato `selected/total`. Card categorie `defaultExpanded={false}` (chiuse di default). Promo testuali in `booking_menu_promos` (campi `label` admin + `message` cliente, `booking_types`, `visible_on_booking`); snapshot nomi in `booking_requests.menu_promo_labels` al submit; ingredienti in `menu_items.booking_types` (pannello tipologie su click in «Crea/Modifica Prodotto»); menù preselezionati in `booking_custom_staff_presets` (`name`, `description?`, `is_fixed_menu?` default fisso, `item_ids`, `booking_types` solo `rinfresco_laurea` \| `menu_prezzo_fisso`, `visible_on_booking?`); descrizione preset → card sottotab Prenota se `sub_tabs[].description` assente; `is_fixed_menu: false` → cliente può modificare ingredienti in `MenuSelection`. Pagina Prenota mostra solo `message`; admin vede `label` in lista promo, card richiesta e modal dettagli. Nessun omaggio automatico nel codice.
RULE  Scala tipografica responsive: usare utility centralizzate `text-title-page` / `text-title-section` / `text-title-card` / `text-title-subtitle` / `text-title-modal` (titoli) e `text-body` / `text-label` / `text-value` / `text-stat-big` / `text-micro` / `text-button-label` (corpo) definite in `src/index.css`. Ancorate al gold standard del titolo Calendario (22/24/24/30 px). Non reintrodurre liste `text-xs md:text-sm lg:text-base`. Distinzione titolo vs corpo obbligatoria (`text-title-*` solo per titoli). Vedi `docs/per-ui-design-skill/UI_RESPONSIVE_CONTEXT.md` §6b.
RULE  UI leggera: quando aggiungi controlli a pannelli admin, preferisci inserirli vicino al campo che modificano, con label brevi e anteprima sul campo stesso; evita blocchi informativi separati, card dentro card, duplicazioni di anteprima e testo esplicativo lungo se il controllo e gia chiaro.
RULE  Classi Tailwind: solo stringhe letterali statiche — mai `bg-${x}-600`
RULE  cn() da @/lib/utils — mai clsx() o twMerge() direttamente
RULE  !important Tailwind v4: suffisso → `border-red-500!` (non `!border-red-500`)
RULE  data-admin-theme: nessun cleanup — il tema deve persistere per tutta la sessione
RULE  Due client Supabase: non mischiare supabase ↔ supabasePublic
RULE  Feature flag commerciali: governate da `tenant_features` (tabella DB) + `edition` (bundle base). `useFeatures()` legge da `TenantContext.featureOverrides` → `buildFeatures(edition, featureOverrides)` → `FeatureFlags`. Mai leggere colonne `_enabled` da `organizations` né `featureOverrides` direttamente per gating UI — usare solo `features.X`. Flusso completo in `docs/DATA_FLOW_SKILL.md`. Procedura add-on in `docs/Marketing-Skill/MARKETING_SKILL.md`.
RULE  Menu QR (qrMenu flag): auto-true per Pro/Enterprise, per Classic dipende da `tenant_features` (feature_key='qrMenu'). Pagine pubbliche: `/menu/:slug`, `/menu/:slug/qr/:shortCode`, `/c/:categoryKey`, `/preset/:presetId`. Aspetto per-QR su `menu_qr_codes` (migrazioni **036** `theme_key`/`carousel_items`/`category_images`, **037** `hidden_menu_item_ids`) — **obbligatorie su ogni Supabase usato dal deploy** (TEST + produzione); senza 036 il salvataggio modale fallisce (schema cache). Modale `MenuQrModal`: nessuna UI per `preset_ids` (menù eventi staff = impostazioni Prenota; si preserva solo valore DB su QR esistenti). Foto: bucket `menu-photos`. Vedi `docs/per-ui-design-skill/PUBLIC_MENU_SKILL.md`.
RULE  Email CRM: normalizeCustomerEmail() prima di confronto o scrittura
RULE  UUID: cancelled_by è UUID auth.users.id — mai passare email a campi UUID
RULE  Admin **Personalizza form** (`BookingFormConfigPanel` + sezione sfondo in `RestaurantSettingsTab`): UI salvataggio condivisa in `SettingsSaveUi.tsx` (`FormSectionFloatingActions`, `SectionActionBar`, `SettingsSaveFooter`). Ogni card ha **Annulla modifiche** + **Salva** (solo quella sezione); footer globale (`pageHasUnsaved`) con **Annulla tutte le modifiche** + **Salva modifiche** solo se restano modifiche non salvate. **Salva** nell'editor di una sottotab (`commitSubTabEditor`) persiste subito `booking_modes` su DB e non lascia la card Modalità in stato dirty per quella sottotab. Sotto «Abilita Card o Carosello»: help collassabile `SubTabsDisplayHelpPanel` (**? Dettagli**, sempre visibile); editor **Card scorrevole** con import menù preselezionato + categorie/ingredienti visibili; editor carosello via `BookingFormCarouselEditor` (foto-first, campi per slide, senza prezzo) senza import preset né categorie ingredienti. Titolo pubblico sottotab = `sub_tabs[].label` (Etichetta card); `applyLegacySubTabLabelOverrides` per dati legacy; salvataggio modalità azzera `sub_tabs_overrides`. Anagrafica Azienda usa lo stesso `SettingsSaveFooter`. Niente «Conferma selezione sfondo». Guard: `UnsavedChangesContext`. Vedi `docs/per-ui-design-skill/BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md`.
RULE  **Pagina Prenota v2** (`/prenota/:slug`): layout 2 colonne `lg:grid-cols-[1fr_min(360px,32%)]` (collassa sotto `lg`); lo sfondo viewport usa `public_booking_page_background` da `restaurant_settings` (texture PNG via `bookingPageTilePublicHref`, gradienti via `bookingPageGradientCss`), mentre le card principali restano bianche/opache. Header pubblico: nome azienda, titolo e descrizione leggono font/colore da `booking_public_form_config.header_styles`; nome azienda e titolo hanno stessa scala grande, descrizione resta piu piccola. Font disponibili in `BOOKING_HEADER_FONT_OPTIONS`; Google Fonts caricati in `index.css`, mentre font commerciali/locali (es. Mistral, Thirsty Script) devono restare fallback CSS se non c'e licenza webfont. **Ordine form (v2 attuale):** prima tipologia (`BookingModeCards`, 3 colonne compatte su mobile, descrizione solo da `sm+`; icone Phosphor outline configurabili da `BookingFormConfigPanel`, valori ammessi in `BOOKING_MODE_ICONS`), poi sottotab scrollabili (`BookingSubTabCards`, frecce desktop + touch; card senza icona, svincolate dalla larghezza delle tipologie: titolo salvato nella card, separatore corto, descrizione salvata, prezzo `/persona`; se `display='carousel'` mostra **solo** `BookingSubTabCarousel` (foto + overlay per slide da `carousel_items[].eyebrow/title/description`; **nessun prezzo**; nessuna griglia menù); se `display='cards'` poi menù (`MenuSelection` → `BookingMenuComposeGrid`; mobile: colonna stack `BookingMenuCategoryCard`, header con miniatura 76px a filo bordo e padding solo sul testo; desktop: griglia o carosello), poi dati cliente (`BookingFormFields` + `DietaryRestrictionsSection` con `BookingPublicInsetField`: label **dentro** la card in alto a sinistra, valore sotto; data/ora usano `BookingPublicDateTimePickers` con bottom sheet mobile e popover desktop, mantenendo `TimePicker24h`; larghezza piena `BOOKING_PUBLIC_CONTENT_WIDTH` = `w-full min-w-0` allineata al box header in `bookingPublicFieldStyles.ts`; tipologia/sottotab in `#booking-sub-tabs-section` fuori padding colonna form, `lg:col-span-2`; **nessun** banner testo «Menù fisso» — solo UI read-only nelle card se `is_fixed_menu`). Sidebar `BookingSummarySidebar` a destra (`order-2` sotto `lg`). Config: `booking_public_form_config` in `restaurant_settings`; default `bookingPublicFormConfig.ts`; parse `restaurantSettingRegistry.ts`. Sottotab `SubTab`: niente piu `preset|manual` salvato; usare `display: 'cards' | 'carousel'`, `label`, `description`, `price_per_person`, `preset_id?`, `hidden_category_keys?`, `hidden_item_ids?`, `carousel_items?`. Importare un menu preselezionato in `BookingFormConfigPanel` compila i campi della card Prenota e collega `preset_id`, ma non modifica `booking_custom_staff_presets` nella tab Menu; titolo card e `h2` menù pubblico = `sub_tabs[].label` (Etichetta card), descrizione da `sub_tabs[].description` — non dal nome preset staff (`MenuSelection.presetSectionTitle` + `applyLegacySubTabLabelOverrides`). `preset_id` resta la fonte per precompilare gli ingredienti e seguire il menu staff come fonte di verità per le voci. Se `price_per_person > 0`, riepilogo e submit usano quel prezzo × ospiti, non la somma dei piatti, e mostra il totale ingredienti barrato come confronto. Menù staff: fisso = read-only card; personalizzabile = titolo grande «CREA IL TUO MENU» in `MenuSelection` + sotto solo descrizione salvata sulla sottotab, se presente + griglia `BookingMenuComposeGrid`; visibilità ingredienti/categorie per singola card Prenota filtrata da `hidden_category_keys`/`hidden_item_ids`. Admin: `BookingFormConfigPanel` + `MenuPricesTab`. Pubblici in `publicBooking/`. Submit invariato — non toccare `useCreateBookingRequest`. Report: `docs/Sessioni di lavoro/25-05-26/Report-prenota-v2-ui-sessione-25-05-26.md`.
```

---

## 5. Comandi principali

```bash
npm run dev           # dev server :5173
npm run typecheck     # tsc --noEmit — zero errori
npm run lint          # ESLint — zero warning
npm run test          # Vitest — tutti devono passare (137/137)
npm run validate      # lint + typecheck + test (usare pre-PR)
```

---

## 6. Convenzioni

- **Comunicazione con l'utente**: leggi `docs/COMUNICAZIONE_UTENTE_SKILL.md` **all'inizio di ogni sessione** — contiene le regole su come rispondere a Matteo (breve, nomi dinamici, no gergo). Questa regola vale per ogni skill.
- **RULE Linguaggio utente**: quando spieghi cosa hai fatto o cosa cambierà, usa flussi e schermate concrete — mai nomi di componenti isolati. Mai "ho modificato `MenuPricesTab.tsx`" → sempre "ora Mario quando apre la tab Menu vede un nuovo pulsante per generare il QR". Esempi concreti obbligatori. Vedi `docs/COMUNICAZIONE_UTENTE_SKILL.md`.
- **Logger**: `logger.debug/info/warn/error` da `src/lib/logger.ts` — mai `console.log`
- **TanStack Query**: query server-state nei hook in `src/features/booking/hooks/`
- **Commit**: `feat(scope):` · `fix(scope):` · `update(scope):`
- **Import alias**: `@/` → `src/`

---

## 7. Obbligo fine sessione — Report + Allineamento skill

**Cronologia sessioni**: vedi [`docs/SESSION_LOG.md`](SESSION_LOG.md).

Al termine di ogni sessione di lavoro se utente di da conferma che il lavoro è stato svolto con successo, l'agente DEVE:

### 7.1 Scrivere il report

Creare un file `Report-*.md` in `docs/Sessioni di lavoro/GG-MM-AA/` (creando la cartella se non esiste).

Il report deve contenere:
- Cosa è stato fatto (in ordine cronologico)
- File toccati e perché (linguaggio utente — non "ho modificato X" ma "ora Mario vede Y")
- Domande poste all'utente e risposte ricevute
- Test eseguiti e risultato (`npm run validate`)
- Cosa resta per la prossima sessione
- Eventuali deviazioni dal plan con motivazione

### 7.2 Allineare i file di skill

Dopo ogni modifica al codice che cambia l'architettura, le strutture dati o le regole d'uso, l'agente DEVE aggiornare i file di skill corrispondenti **nella stessa sessione**, non in una successiva.

**Regola**: se hai toccato un file → aggiorna la skill che lo documenta.

| Se hai modificato… | Aggiorna anche… |
|--------------------|-----------------|
| `AdminShell.tsx` (routing, sezioni, edition) | `ADMIN_SHELL_CONTEXT.md` |
| `AdminDashboard.tsx` (prop, tab, layout) | `ADMIN_CLASSIC_SKILL.md` sezione "stato attuale" |
| `TenantContext.tsx` | `APP_CONTEXT_SKILL.md` §4 invarianti |
| `src/config/features.ts` o `src/hooks/useFeatures.ts` | `APP_CONTEXT_SKILL.md` §2 e §4 |
| `supabase/migrations/` (nuova migrazione) | `docs/DATABASE.md` + `DB_MIGRATIONS_CONTEXT.md` + `DB_SCHEMA_CONTEXT.md` |
| Nuova pagina/sezione admin | `ADMIN_PAGES_CONTEXT.md` + `ADMIN_SHELL_CONTEXT.md` §7 |
| `AssignmentMapPanel` / `useTableAssignments` / `serviceSlotBookingFilter` | `ADMIN_PAGES_CONTEXT.md` § Servizio → Assegnazione tavoli |
| Struttura cartelle `src/` | `APP_CONTEXT_SKILL.md` §3 |
| Qualsiasi file LOCK | Aggiorna sezione "stato attuale" nello skill di area |
| `restaurantSettingRegistry.ts` (validazione, range, campi) | `APP_CONTEXT_SKILL.md` §4 RULE walk_in_max_guests |
| `MenuPricesTab.tsx` / `MenuSelection.tsx` / `menuPricesCatalogLayout.ts` / `presetMenus.ts` / `menuCatalogGrouping.ts` | `APP_CONTEXT_SKILL.md` §4 RULE Menu Prenota |
| `MenuQrManager.tsx` / `MenuQrModal.tsx` / `useMenuQrCodes.ts` / pagine pubbliche menu | `docs/per-ui-design-skill/PUBLIC_MENU_SKILL.md` + `APP_CONTEXT_SKILL.md` §4 RULE Menu QR |
| `tenant_features` / `buildFeatures` / `featureOverrides` / `TenantContext` / `useFeatures` | `APP_CONTEXT_SKILL.md` §4 RULE Feature flag commerciali + `DATA_FLOW_SKILL.md` |
| `docs/Marketing-Skill/FEATURE_CATALOG_CONTEXT.md` (nuova feature add-on) | Aggiorna tabella catalogo feature |
| `check_admin_email` RPC / `organizations_public` vista | `DATA_FLOW_SKILL.md` §2 + §5 |
| `menuPhotoUpload.ts` / `shortCodeGenerator.ts` | `docs/per-ui-design-skill/PUBLIC_MENU_SKILL.md` |
| `035_menu_categories_image_url.sql` / `menu_categories.image_url` | `docs/DATABASE.md` + `DB_MIGRATIONS_CONTEXT.md` + `DB_SCHEMA_CONTEXT.md` + `PUBLIC_MENU_SKILL.md` |
| `useBookingMutations.ts` / `useWalkInMutation.ts` / qualsiasi mutation che scrive `confirmed_start` o `desired_time` | `ADMIN_CLASSIC_SKILL.md` §4 + §4b |
| `dateUtils.ts` (createBookingDateTime, extractTimeFromISO, getAccurateStartTime) | `ADMIN_CLASSIC_SKILL.md` §4b + `TESTING_CONTEXT.md` se cambiano i test |
| `serviceSlotBookingFilter.ts` / logica filtro fascia in `useUnassignedBookings` | `ADMIN_PAGES_CONTEXT.md` § Servizio → Assegnazione tavoli + `TESTING_CONTEXT.md` se cambiano i test |
| `BookingRequestPage.tsx` / `BookingRequestForm.tsx` / `BookingModeCards.tsx` / `BookingSubTabCards.tsx` / `BookingSummarySidebar.tsx` / `BookingFormFields.tsx` / `BookingPublicInsetField.tsx` / `bookingPublicFieldStyles.ts` / `BookingSubTabStrip.tsx` (legacy) | `APP_CONTEXT_SKILL.md` §4 RULE Pagina Prenota v2 |
| `bookingPublicFormConfig.ts` / `BookingFormConfigPanel.tsx` / `SettingsSaveUi.tsx` / `restaurantSettingRegistry.ts` chiave `booking_public_form_config` | `APP_CONTEXT_SKILL.md` §4 RULE Personalizza form + `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md` |
| `MenuSelection.tsx` / `BookingMenuComposeGrid.tsx` / `BookingMenuCategoryCard.tsx` / `menuComposeVisibility.ts` | `APP_CONTEXT_SKILL.md` §4 RULE Pagina Prenota v2 + RULE Menu Prenota |
| `MenuSelection.tsx` prop `hideMenuGrid` / `subTabOverrides` / `BookingMode.sub_tabs` | `APP_CONTEXT_SKILL.md` §4 RULE Pagina Prenota v2 + RULE Menu Prenota |
