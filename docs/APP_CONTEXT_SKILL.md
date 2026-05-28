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
| **Flusso dati tab Menu ↔ Personalizza form ↔ Pagina Prenota / bookingFormResolver / field_overrides / SubTab.label legato a preset / "aggiorna solo se non personalizzato" / aggiunta campi a SubTab o BookingMode** | **`docs/BOOKING_DATA_FLOW_SKILL.md` OBBLIGATORIO** prima di qualsiasi modifica — spiega il resolver, gli invarianti, come estendere senza rompere. |
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
RULE  Anti-duplicazione: prima di scrivere una funzione helper dentro un componente
      (date utils, label maps, formatter, classi tailwind ricorrenti), cercare con
      Grep se esiste già altrove. Se la stessa funzione compare in 2+ file →
      estrarre in `src/features/booking/utils/` (o `@/lib/`) con un parametro
      `variant` se i comportamenti divergono leggermente (es. `getModeLabelByType(modes, type, 'short'|'long')`).
      Stesso vale per costanti di stile/breakpoint: prima di hardcodare `min-[900px]`
      o `25vw` in più file, valutare se serve una costante in `constants/bookingPublicFieldStyles.ts`.
RULE  Import in cima al file: mai inserire `import` in mezzo al body (dopo una
      function declaration). Quando un edit lo crea per errore, spostare in cima
      nello stesso turno — TypeScript non sempre fallisce, ma ESLint sì in pre-commit.
RULE  Logger: in pubblico-form e componenti React mai `console.error/log` — usare
      `logger` da `@/lib/logger`. Vale anche per handler async dentro mutation.
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
RULE  Menu Prenota (`MenuPricesTab` + `MenuSelection` + `PresetMenuBuilder`): categorie in `menu_categories` (`label`, `description`, `image_url` per Prenota); foto thumbnail homepage QR in `menu_homepage_config.category_images` (path Storage `{tenantId}/cat/{key}.webp`) — non mischiare. Foto categoria Prenota: `menu_categories.image_url`, path `{tenantId}/booking-cat/{categoryId}.webp`. Panoramica categorie/ingredienti condivisa via `menuPricesCatalogLayout.ts` (griglia CollapsibleCard, righe `menu-prices-item-row`, selezione `menu-prices-item-row--selected`). Grouping `itemsByCategory` centralizzato in `src/features/booking/utils/menuCatalogGrouping.ts` (`groupMenuItemsByCategory`) — usarlo, non duplicare. Subtitle card categoria: `N ingredienti` (con pluralizzazione) in tutti e 3 i componenti — non usare formato `selected/total`. Card categorie `defaultExpanded={false}` (chiuse di default). In `MenuPricesTab`, il form "Nuovo/Modifica Prodotto" sta dentro la sezione "Modifica Ingredienti", dopo titolo/descrizione e prima delle categorie; di default resta chiuso e si apre con "Aggiungi nuovo ingrediente", `Button variant="success" size="sm"` come le CTA verdi dei moduli interni; layout prodotto responsive: griglia 2x2 desktop (nome/categoria, prezzo/foto) + descrizione full-width sotto, 1 colonna mobile. Promo testuali in `booking_menu_promos` (campi `label` admin + `message` cliente, `booking_types`, `visible_on_booking`): il form promo si apre inline nello stesso pannello e la lista promo resta visibile sotto; snapshot nomi in `booking_requests.menu_promo_labels` al submit; `menu_items.booking_types` è legacy e va mantenuto vuoto (`{}`) per gli ingredienti, senza pannello tipologie nella UI; menù preselezionati in `booking_custom_staff_presets` (`name`, `description?`, `price_per_person?`, `item_ids`, `booking_types` legacy/default compatibilità, `visible_on_booking?`): NON esiste più UI per abbinarli a tipologie né per renderli fissi/personalizzabili; l'abbinamento e il toggle fisso/personalizzabile si fanno solo in Personalizza Form (`sub_tabs[].preset_id`, `sub_tabs[].is_fixed_menu`). Cancellare un menù preselezionato avvisa l'admin e rimuove anche le card collegate in `booking_public_form_config`; modificare un preset non elimina card e non sovrascrive campi personalizzati, il pubblico segue il resolver `field_overrides`. `sub_tabs[].is_fixed_menu: false` → cliente può modificare ingredienti in `MenuSelection` e non esiste prezzo fisso. Pagina Prenota mostra solo `message`; admin vede `label` in lista promo, card richiesta e modal dettagli. Nessun omaggio automatico nel codice.
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
RULE  Admin **Personalizza form** (`BookingFormConfigPanel` + sezione sfondo in `RestaurantSettingsTab`) e tab **Anagrafica Azienda** (`RestaurantSettingsTab`): UI salvataggio condivisa in `SettingsSaveUi.tsx` (`FormSectionFloatingActions`, `SectionActionBar`, `SettingsSaveFooter`). Ogni card ha **Annulla modifiche** + **Salva** (solo quella sezione); footer globale quando restano modifiche non salvate (**Annulla tutte le modifiche** + **Salva modifiche**). La card **Sfondo pagina Prenota** separa due flussi: **Striscia laterale** salva `public_booking_strip_photo` (`strip-01`…`strip-06`, colonna sinistra visibile da 900px) e **Pagina intera** salva `public_booking_page_background` (`full-01`…`full-06` da `public/asset/sfondo intero`) azzerando `public_booking_strip_photo`, quindi la pagina pubblica non renderizza la colonna laterale. Anagrafica: sezioni Anagrafica, Orari, Fasce (Classic), Tema con dirty indipendenti. **Salva** nell'editor di una sottotab (`commitSubTabEditor`) persiste subito `booking_modes` su DB e non lascia la card Modalità in stato dirty per quella sottotab. **XOR card/carosello per modalità:** `BookingMode.sub_tabs_presentation: 'cards' | 'carousel' | null`. `null` = non ancora scelto (mostra entrambi i pulsanti); dopo la prima sottotab salvata viene impostato automaticamente e non può essere cambiato senza resettare tutte le sottotab (pulsante «Cambia presentazione» con conferma esplicita sui dati persi, sempre mostrata). `SubTabAddButtons` mostra solo il pulsante coerente con `sub_tabs_presentation`; `SubTabsPresentationBadge` mostra il badge + link reset. Filtro difensivo XOR in `BookingRequestForm.activeModeSubTabs`: filtra per `display === sub_tabs_presentation` se impostata, con warn in DEV su mix legacy. Migrazione legacy in `restaurantSettingRegistry.parseFromDb`: calcola `sub_tabs_presentation` dalla maggioranza di `sub_tabs[].display`; 50/50 → 'cards'. Sotto «Abilita Card o Carosello»: help collassabile `SubTabsDisplayHelpPanel` (**? Dettagli**, sempre visibile); editor **Card scorrevole** con titolo tecnico `Card N` solo admin, campo separato `Titolo card` max 30 per Prenota (precompilato dal preset importato e sovrascrivibile), import menù preselezionato (tutti i preset, senza filtro tipologia/visibilità), descrizione breve, campo opzionale **Numero Portate** (`courses_label`, max 40), categorie/ingredienti visibili, toggle `Menù personalizzabile`, prezzo allineato a sinistra con `€` nel campo; quando il toggle e attivo il prezzo viene azzerato/disabilitato. Editor carosello via `BookingFormCarouselEditor` (foto-first, campi per slide) con blocco prezzo allineato a sinistra e `€` nel campo, senza toggle fisso/personalizzabile, import preset, categorie ingredienti, titolo modificabile o frecce sposta. Titolo pubblico sottotab = `sub_tabs[].label` (campo `Titolo card`); `applyLegacySubTabLabelOverrides` per dati legacy; salvataggio modalità azzera `sub_tabs_overrides`. Niente «Conferma selezione sfondo». Guard: `UnsavedChangesContext`. Vedi `docs/per-ui-design-skill/BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md`.
RULE  **Tracking personalizzazioni card Prenota** (`SubTab.field_overrides`): bandierine booleane per i campi vetrina (`label`, `description`, `price_per_person`, `hidden_item_ids`, `hidden_category_keys`). `true` = personalizzato dal ristoratore in `BookingFormConfigPanel` (resta anche se preset cambia); `false`/assente = ereditato dal preset live (segue cambi in tab Menu). Resolver puro in `src/features/booking/services/bookingFormResolver.ts` (`resolveSubTabView`, `patchSubTabAsOverride`, `resetSubTabToPreset`, `markFieldOverridden`). `BookingRequestForm.activeModeSubTabs` applica `resolveSubTabView` dopo il filtro XOR. Admin: `updateSubTab`/`updateDraftSubTab` marcano automaticamente `field_overrides[campo]=true` per ogni campo overridable presente nel patch; `importPresetIntoSubTab`/`importPresetIntoDraftSubTab` azzerano tutti gli override (eccezione: label personalizzata diversa dal preset precedente resta `true`). Parser/normalizer in `bookingPublicFormConfig.ts` preservano `field_overrides` su DB; assenza = default ereditato.
RULE  **Pagina Prenota v2** (`/prenota/:slug`): **layout esterno opzionale a 2 colonne da 900px** in `BookingRequestPage`: se `public_booking_strip_photo` e valorizzato, usa `min-[900px]:grid-cols-[25vw_1fr]` — colonna sx = striscia foto verticale sticky; colonna dx = header + form + sticky bar. Se `public_booking_strip_photo` e `null`, la pagina resta a colonna unica anche su desktop e lo sfondo occupa tutta la viewport. La griglia esterna deve restare `w-full` senza `mx-auto`/`max-w-*`: quando la striscia esiste, parte dal bordo sinistro del viewport e mantiene sempre la stessa percentuale (`25vw`). Sotto 900px: striscia foto nascosta (`hidden min-[900px]:block`), layout a colonna unica. **Per cambiare larghezza striscia foto**: modificare il valore `25vw` nella classe `min-[900px]:grid-cols-[25vw_1fr]` in `BookingRequestPage.tsx`. **Footer Orari+Contatti**: fuori dalla griglia, ultimo figlio del `flex-col` wrapper — prende `w-full` senza `max-w-*`, copre da bordo sinistro a bordo destro e chiude visivamente la pagina; `border-t border-slate-100`, `rounded-none`. **Struttura `BookingRequestPage` return**: `div.min-h-screen → div.min-h-screen.flex.flex-col → [griglia flex-1 | footer a larghezza piena]` — non riportare il footer dentro la colonna destra (provoca footer galleggiante che non copre la striscia foto). **Copertura foto striscia**: `BookingPhotoStrip` ripete il ciclo di 6 foto 3 volte (18 foto × 120vh = 2160vh) per coprire form con 10+ categorie ingredienti aperte senza gap visivi. **Layout interno form** (dentro colonna dx): 2 colonne `min-[1256px]:grid-cols-[1fr_min(360px,32%)]` — la sidebar `BookingSummarySidebar` è laterale sticky solo da **≥1256px** (`BOOKING_PUBLIC_SUMMARY_SIDEBAR_MIN_PX` in `bookingPublicFieldStyles.ts`); sotto 1256px il riepilogo resta **sotto** il form (come su mobile). Sidebar con `min-[1256px]:sticky min-[1256px]:top-4 min-[1256px]:order-0` e `min-h-[320px]` su ≥1256px. Breakpoint **1256px** anche per `col-span-2` di tipologia/sottotab, menu-section e submit desktop; il resto del form (tipologia full-width, striscia foto, ecc.) può restare su **900px** dove documentato. Caselle dati cliente ridotte a tablet (`min-h-[2.4rem]`, testo `text-xs`) via `frostedInputCn` in `BookingRequestForm`. Lo sfondo viewport usa `public_booking_page_background` da `restaurant_settings` (foto a pagina intera `full-01`…`full-06` via `bookingFullPageBackgroundPublicHref`; texture/gradienti restano solo fallback legacy), mentre le card principali restano bianche/opache. Header pubblico: nome azienda, titolo e descrizione leggono font/colore da `booking_public_form_config.header_styles`; nome azienda e titolo hanno stessa scala grande, descrizione resta piu piccola. Font disponibili in `BOOKING_HEADER_FONT_OPTIONS`; Google Fonts caricati in `index.css`, mentre font commerciali/locali (es. Mistral, Thirsty Script) devono restare fallback CSS se non c'e licenza webfont. **Ordine form (v2 attuale):** prima tipologia (`BookingModeCards`, 3 colonne compatte su mobile, descrizione solo da `sm+`; icone Phosphor outline configurabili da `BookingFormConfigPanel`, valori ammessi in `BOOKING_MODE_ICONS`), poi sottotab scrollabili (`BookingSubTabCards`, frecce desktop + touch; card con icona della sottotab centrata **senza sfondo** e senza descrizione in nessuna view — la descrizione appare solo in `MenuSelection` dopo selezione; prezzo `/persona` solo se presente e menu fisso; se `display='carousel'` mostra **solo** `BookingSubTabCarousel` (foto + overlay per slide da `carousel_items[].eyebrow/title/description`; prezzo opzionale da `sub_tabs[].price_per_person`; nessuna griglia menù); se `display='cards'` poi menù (`MenuSelection` → `BookingMenuComposeGrid`; mobile: colonna stack `BookingMenuCategoryCard`, header con miniatura 76px a filo bordo e padding solo sul testo; desktop md+: griglia — con 3 categorie usa `grid-cols-3` già da `md` (non solo da `lg`); card griglia senza `max-w-[320px]`, si espandono a piena larghezza colonna), poi dati cliente (`BookingFormFields` + `DietaryRestrictionsSection` con `BookingPublicInsetField`: label **dentro** la card in alto a sinistra, valore sotto; data/ora usano `BookingPublicDateTimePickers` con bottom sheet mobile e popover desktop, mantenendo `TimePicker24h`; larghezza piena `BOOKING_PUBLIC_CONTENT_WIDTH` = `w-full min-w-0` allineata al box header in `bookingPublicFieldStyles.ts`; tipologia/sottotab in `#booking-sub-tabs-section` fuori padding colonna form, `min-[900px]:col-span-2`; **nessun** banner testo «Menù fisso» — solo UI read-only nelle card se `is_fixed_menu`). Sidebar `BookingSummarySidebar` a destra solo ≥1256px (`order-2` sotto 1256px nel flusso sotto il form) e sempre visibile nel flusso prima del pulsante **Invia Prenotazione** (≥1256px); quando si apre la griglia ingredienti da una sottotab, il riepilogo non scorre fuori schermo e non mostra frecce di riapertura. Config: `booking_public_form_config` in `restaurant_settings`; default `bookingPublicFormConfig.ts`; parse `restaurantSettingRegistry.ts`. Sottotab `SubTab`: niente piu `preset|manual` salvato; usare `display: 'cards' | 'carousel'`, `label`, `description`, `courses_label`, `price_per_person`, `is_fixed_menu?`, `preset_id?`, `hidden_category_keys?`, `hidden_item_ids?`, `carousel_items?`. **XOR presentazione:** `BookingMode.sub_tabs_presentation: 'cards' | 'carousel' | null`; filtro difensivo in `activeModeSubTabs` filtra per tipo coerente. **Carosello = una sola card con N foto** per modalità: `SubTabAddButtons` nasconde «+ Carosello» se ne esiste già una, `addSubTab` blocca duplicati a runtime; lato pubblico `BookingSubTabCards` non viene renderizzato per modalità carosello (auto-selezione della sottotab unica + `BookingSubTabCarousel` direttamente). **Validazione form pubblico:** email con `isValidEmail()`, telefono con `isValidPhone()` da `src/features/booking/utils/validation.ts`; `maxLength` su nome (60), email (120), telefono (20), intolleranze (300). `BookingFormFields` usa `autoComplete`/`inputMode` HTML5. Importare un menu preselezionato in `BookingFormConfigPanel` compila i campi della card Prenota e collega `preset_id`, ma non modifica `booking_custom_staff_presets` nella tab Menu; titolo card e `h2` menù pubblico = `sub_tabs[].label` (Etichetta card), descrizione da `sub_tabs[].description` — non dal nome preset staff (`MenuSelection.presetSectionTitle` + `applyLegacySubTabLabelOverrides`). `preset_id` resta la fonte per precompilare gli ingredienti e seguire il menu staff come fonte di verità per le voci. Se `is_fixed_menu !== false` e `price_per_person > 0`, riepilogo e submit usano quel prezzo × ospiti, non la somma dei piatti, e mostra il totale ingredienti barrato come confronto; se manca prezzo o `is_fixed_menu === false`, non c'è riepilogo prezzo. Menù staff: fisso = read-only card; personalizzabile = titolo grande «CREA IL TUO MENU» in `MenuSelection` + sotto solo descrizione salvata sulla sottotab, se presente + griglia `BookingMenuComposeGrid`; visibilità ingredienti/categorie per singola card Prenota filtrata da `hidden_category_keys`/`hidden_item_ids`. Admin: `BookingFormConfigPanel` + `MenuPricesTab`. Pubblici in `publicBooking/`. Submit invariato — non toccare `useCreateBookingRequest`. Report: `docs/Sessioni di lavoro/25-05-26/Report-prenota-v2-ui-sessione-25-05-26.md`.

LOCK  **`BookingRequestPage.tsx` — struttura griglia con striscia laterale**: il layout a 2 colonne `[striscia foto | contenuto]` con `BookingPhotoStrip` sticky è consolidato e testato su 3 breakpoint. Prima di qualsiasi modifica a `BookingRequestPage.tsx` un agente DEVE: (1) valutare se il task può essere risolto toccando solo componenti figli (`BookingRequestForm`, `BookingSummarySidebar`, `BookingStickyBar`, footer, ecc.) senza toccare la griglia esterna — se sì, procedere su quei componenti; (2) se è necessario toccare la griglia, leggere per intero `BookingRequestPage.tsx` + `BookingPhotoStrip.tsx` + `BookingSummarySidebar.tsx` + `BookingRequestForm.tsx` prima di qualsiasi edit; (3) non alterare mai questi invarianti strutturali: griglia esterna `w-full` senza `mx-auto/max-w-*`, `BookingPhotoStrip` rimane `sticky top-0 h-screen` nella colonna sinistra, footer fuori dalla griglia come ultimo figlio del wrapper `flex-col`, spacer `h-20 min-[1256px]:h-4` come ultimo elemento della colonna destra (sticky bar sotto 1256px). Qualsiasi modifica che viola uno di questi punti va discussa con l'utente prima di procedere.
Nota: `public_booking_page_background` non accetta `strip-01`…`strip-06`; quelle foto appartengono solo a `public_booking_strip_photo`.
Nota: **Header pagina Prenota — allineamento testo (28-05-26).** `BookingHeaderTextStyle` ora include `textAlign?: 'left' | 'center' | 'right'` (default `'center'` per tutti e 3 i target). La funzione `getBookingHeaderTextStyle` lo restituisce nel style inline. In `BookingRequestPage` le classi Tailwind `text-center`/`md:text-left` hardcoded sono state rimosse — l'allineamento è governato solo da `header_styles.textAlign` salvato su DB. Admin: `renderHeaderStyleControls` mostra 3 pulsanti ⬅ ↔ ➡ per ciascun campo (Nome azienda, Titolo, Descrizione). Parser `parseBookingHeaderStylesFromUnknown` preserva `textAlign` dal DB; valore assente → fallback `'center'`. Non aggiungere classi Tailwind `text-*` hardcoded ai tag `h1`/`h2`/`p` dell'header — sovrascrivono lo style inline.
Nota: **Griglia campi cliente in `BookingFormFields` (28-05-26, ordine aggiornato 28-05-26).** Ordine verticale: Nome → **Ora | Ospiti** (griglia `sm:grid-cols-2`, dove prima c’erano Email | Telefono) → **Telefono** a larghezza piena → **Data | Email** (griglia `sm:grid-cols-[minmax(0,1fr)_9rem_7rem]` con Email in `sm:col-span-2` al posto delle colonne Ora/Ospiti). Breakpoint `sm` (≥640px): Data flessibile, Email occupa le due colonne strette destinate a Ora+Ospiti. Label "Data prenotazione \*" → **"Data \*"**. Mobile (<640px): tutto in colonna singola. Non tornare a `1fr` fisso per la colonna Data né ripristinare Email accanto a Telefono senza richiesta esplicita.
Nota: **Stacking context foto full-page (28-05-26).** Regola definitiva dopo due tentativi falliti:
1. Root `BookingRequestPage` = `relative isolate` + colore di fondo crema chiaro come fallback (mai marrone scuro, altrimenti se la foto tarda la pagina sembra rotta).
2. Le foto sono `<div pointer-events-none fixed inset-0 z-0>` (portrait `md:hidden`, landscape `hidden md:block`).
3. Il wrapper contenuto (`flex flex-col` interno) deve essere `relative z-10`, altrimenti gli elementi `position: fixed` con qualsiasi z-index ≥ 0 stanno sempre sopra al contenuto static (le foto coprono il form).
Combinazione testata: `relative isolate` sul root + `z-0` sulle foto + `relative z-10` sul wrapper.
Nota: **Caselle compilazione single-row (28-05-26).** `BOOKING_PUBLIC_FIELD_BOX` ora è `flex-row items-center` (era `flex-col`): label a sinistra (shrink-0, nowrap) + valore/input a destra (`text-right`, `flex-1`) sulla stessa riga. Altezza compatta uniforme: `min-h-[2.5rem]` mobile / `sm:min-h-[2.75rem]` (~40-44px). Vale per nome cliente, email, telefono, Data, Ora, ospiti. `BookingPublicInsetFieldShell`, `BookingPublicDatePickerField`, `BookingPublicTimePickerField` condividono lo stesso layout single-row. Per i picker date/time il button trigger usa `justify-end text-right` per allineare il valore selezionato a destra dopo l'icona.
Nota: **Testo libero multiline in Prenota (28-05-26).** `BookingPublicInsetField` con `multiline` usa `BOOKING_PUBLIC_FIELD_BOX_MULTILINE` (label sopra, `textarea` sotto): altezza minima come le altre caselle, poi cresce con `scrollHeight` su mobile/tablet/desktop; testo allineato a sinistra e a capo (`resize-none`, `overflow-hidden`). In `DietaryRestrictionsSection` (`publicFormFields`): **Intolleranze o esigenze alimentari** e **Altre Richieste**; gli altri campi (nome, email, data, ecc.) restano single-row.
Nota: **Striscia laterale visibile a tutti i breakpoint (28-05-26).** La striscia laterale è renderizzata anche su mobile/tablet (non più `hidden min-[900px]:block`). Larghezza colonna: **20vw da 0px**, **25vw da ≥900px**. Su mobile 375px = ~75px di colonna decorativa, il form occupa il resto. Classe griglia: `grid-cols-[20vw_1fr] min-[900px]:grid-cols-[25vw_1fr]`.
Nota: **Sfondo viewport e modalità striscia.** Quando `public_booking_strip_photo` è valorizzato (modalità striscia), il root di `BookingRequestPage` ignora `public_booking_page_background` e applica una tinta uniforme crema/avorio `#faf7f1` (`STRIP_MODE_PAGE_BG`). L'immagine full-page o i fallback legacy (gradiente/tile) si applicano alla viewport **solo** quando la striscia è disattivata (`public_booking_strip_photo == null`). Le card del form restano bianche/opache in entrambe le modalità.
Nota: **Vincolo NOT NULL su `restaurant_settings.setting_value`.** "Nessuna striscia" lato DB si scrive come stringa vuota `''`, non come `NULL` SQL (la colonna è `NOT NULL`). Il serializer in `restaurantSettingRegistry.public_booking_strip_photo.serializeToDb` converte `null` JS → `''`; il parser `parseBookingStripPhotoFromDb` riconverte `''` → `null` JS. Stesso pattern va applicato a qualsiasi futuro setting "scalare opzionale".
Nota: **Asset preset sfondo (28-05-26).** Striscia laterale: 6 preset `strip-01..06` mappati a `public/asset/strip/strip-NN.{png|webp}` (estensione per ID in `STRIP_PHOTO_EXTENSIONS`: `strip-01..03` = PNG legacy, `strip-04..06` = WebP HD 1440×4320). Pagina intera: 3 preset `full-01..03` mappati in **due varianti WebP**: `public/asset/sfondo intero/full-NN-landscape.webp` (2560×1440 per viewport ≥768px) + `full-NN-portrait.webp` (1440×2560 per viewport <768px). Lo helper `bookingFullPageBackgroundPublicHref(id, base, orientation?)` accetta `'landscape' | 'portrait'` con default landscape. Lato pagina pubblica le due varianti sono applicate via due `<div fixed inset-0 -z-10>` con classi `md:hidden` / `hidden md:block` (un singolo `style.backgroundImage` non può cambiare per media query). Naming file semplificato, valori legacy `strip-04..06` / `full-04..06` degradano in sicurezza.
Nota: **Card categoria ingredienti `BookingMenuCategoryCard`.** La card chiusa usa `aspect-4/3` indipendentemente dal `layout` (stack/grid/scroll): evita il nastro bassissimo prodotto da `h-[148px]` su colonna larga (tablet ≥768px). La foto del singolo ingrediente nella card aperta usa anch'essa `aspect-4/3 sm:aspect-3/2` invece di `h-[188px]` fisso. Mai reintrodurre altezze in `px` su immagini full-width: vanno sempre proporzionate alla larghezza con `aspect-ratio`.
Nota: **Sticky bar mobile** (`BookingStickyBar`): solo sotto **1256px** (viewport &lt; 1256px), fixed bottom, z-200. Appare quando `BookingSummarySidebar` esce dalla viewport (rilevato via `IntersectionObserver` + prop `onVisibilityChange`). Mostra mini-panel con titolo «Riepilogo Prenotazione», valori chiave (tipologia, data, ora, ospiti, totale) e pulsante submit. Clic sul mini-panel apre overlay bottom-sheet (z-300, max-h-90vh, flex-col): header cliccabile per chiudere (pill handle + titolo centrato + ChevronDown), contenuto scrollabile flex-1, footer submit fisso shrink-0. Tutti i colori usano CSS custom properties (`--color-warm-wood`, `--color-warm-orange`, `--color-terracotta`) via `color-mix` — si adattano automaticamente al tema attivo. `BookingRequestForm` espone prop `onIsDisabledChange` per sincronizzare lo stato disabled del submit verso il parent (`BookingRequestPage`). Il pulsante in overlay e nella barra usa `type="submit" form="booking-request-form"` (HTML nativo, nessun prop-drilling del handler). **Submit split per breakpoint**: `BookingSummarySidebar` mostra `submitButton` sotto **1256px** (`block min-[1256px]:hidden`); il pulsante grande «Invia Prenotazione» in `BookingRequestForm` è `hidden min-[1256px]:flex` — visibile solo da **≥1256px**. Il riepilogo laterale sticky attivo solo da 1256px; tra 900px e 1255px (e su mobile) resta in colonna sotto il form (`grid-cols-1` fino a `min-[1256px]`). **Gap pulsante/sidebar → footer**: spacer `<div className="h-20 min-[1256px]:h-4" aria-hidden />` in `BookingRequestPage`. `h-20` riserva spazio per la sticky bar sotto 1256px; `h-4` gap minimo da ≥1256px. Il footer è fuori dalla griglia — NON dentro la colonna destra. **Causa strutturale nota**: `BookingPhotoStrip` ha `sticky top-0 h-screen` — non rimuovere `h-screen`. Il sidebar ha `min-h-[320px]` su ≥1256px.
Nota: il comportamento precedente che faceva scorrere il riepilogo fuori dallo schermo quando si apriva la griglia ingredienti e stato rimosso. Il riepilogo resta nel flusso della pagina, prima del pulsante **Invia Prenotazione**, senza frecce di riapertura.
Nota: per `display='carousel'` il resolver mantiene `price_per_person` salvato sulla sottotab; in Prenota il riepilogo mostra quel prezzo × numero ospiti, il totale e l'elenco dei titoli foto del carosello. Il carosello pubblico mantiene swipe/scroll mobile e mostra frecce laterali da desktop/tablet quando ci sono almeno 2 foto.
Nota: per `display='cards'`, il titolo "Crea il tuo menu" in `MenuSelection` appare solo se lo stato effettivo della card e personalizzabile (`is_fixed_menu === false` / `menuSelectionLocked === false`). Se il menu e fisso, mostra la label della card o il nome del menu preselezionato. Le categorie ingredienti (`BookingMenuCategoryCard`) partono chiuse con sola foto categoria; al click si apre la lista ingredienti senza foto categoria e al nuovo click sul titolo si richiude. `BookingSubTabCards`: icona centrata senza sfondo beige, **descrizione mai mostrata nella card** (nessuna view) — la descrizione appare solo in `MenuSelection` dopo la selezione della sottotab.
Nota: una card scorrevole `display='cards'` senza `preset_id` e una card compilata manualmente: non mostra griglia ingredienti, controlli visibilita categorie/ingredienti o toggle "Menù personalizzabile"; puo mantenere il prezzo salvato e non deve generare alert da preset mancante. Le card importate da preset mantengono invece il legame `preset_id` e passano dal resolver.
Nota: `BookingSubTabCards` usa `bookingPublicRowCardWidthClass` con massimo 3 colonne. **Allineamento centrale**: le card si centrano nella riga (`justify-center` sul flex interno) — con 1-3 card restano centrate senza scorrimento; da 4+ card lo scroll si attiva automaticamente. Il wrapper è diviso: outer `div` con `overflow-x-auto scrollbar-hide`, inner `div` con `flex flex-nowrap justify-center mx-auto` — questa separazione evita il bug di `justify-center` che blocca lo scroll su alcuni browser. Per card scorrevoli con `preset_id`, `booking_custom_staff_presets[].item_ids` e la fonte del catalogo ingredienti mostrato; questi item non vanno esclusi solo per mismatch con `menu_item.booking_types`. Esclusioni consentite: toggle visibilita categoria/ingrediente sulla card o ingrediente eliminato/modificato dal catalogo.
Nota: la selezione preset da card scorrevole non deve mostrare "Menu consigliato non disponibile" mentre `menu_items` o `booking_custom_staff_presets` sono ancora in caricamento; `BookingRequestForm` mantiene il preset selezionato e lo riapplica quando il catalogo e pronto.

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
- **Sezione "File di skill aggiornati"** — tabella con skill toccata + cosa è cambiato (obbligatoria, anche se la riga è "nessuno")
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
| `BookingRequestPage.tsx` / `BookingRequestForm.tsx` / `BookingModeCards.tsx` / `BookingSubTabCards.tsx` / `BookingSummarySidebar.tsx` / `BookingStickyBar.tsx` / `BookingFormFields.tsx` / `BookingPublicInsetField.tsx` / `bookingPublicFieldStyles.ts` / `BookingSubTabStrip.tsx` (legacy) | `APP_CONTEXT_SKILL.md` §4 RULE Pagina Prenota v2 + LOCK struttura griglia striscia |
| `bookingPublicFormConfig.ts` / `BookingFormConfigPanel.tsx` / `SettingsSaveUi.tsx` / `restaurantSettingRegistry.ts` chiave `booking_public_form_config` | `APP_CONTEXT_SKILL.md` §4 RULE Personalizza form + `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md` |
| `MenuSelection.tsx` / `BookingMenuComposeGrid.tsx` / `BookingMenuCategoryCard.tsx` / `menuComposeVisibility.ts` | `APP_CONTEXT_SKILL.md` §4 RULE Pagina Prenota v2 + RULE Menu Prenota |
| `MenuSelection.tsx` prop `hideMenuGrid` / `subTabOverrides` / `BookingMode.sub_tabs` | `APP_CONTEXT_SKILL.md` §4 RULE Pagina Prenota v2 + RULE Menu Prenota |
| `bookingFormResolver.ts` / `SubTab.field_overrides` / `patchSubTabAsOverride` / `resetSubTabToPreset` | `APP_CONTEXT_SKILL.md` §4 RULE Tracking personalizzazioni card Prenota |
| `bookingPublicDateHelpers.ts` (getTodayIso, dateToIso, getCurrentTimeHHMM) / `bookingModeLabels.ts` (getModeLabelByType) | `APP_CONTEXT_SKILL.md` §4 RULE Anti-duplicazione — sono i punti di verità per date locali e label modalità del form pubblico |
