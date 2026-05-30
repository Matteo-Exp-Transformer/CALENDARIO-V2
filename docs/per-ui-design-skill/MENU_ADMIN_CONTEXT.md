# Menu admin (tab Menu / MenuPricesTab) — context

> Mappa di dettaglio della **gestione menù lato admin**: tab Menu come magazzino unico di prezzi e
> ingredienti, form prodotto, categorie, promo testuali, menù preselezionati. Per il **flusso dati**
> (resolver, override, come Prenota/QR pescano i dati) vedi `BOOKING_DATA_FLOW_SKILL.md`. Per la
> **pagina pubblica Prenota** vedi `BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md`. Per il **menu QR
> pubblico** vedi `PUBLIC_MENU_SKILL.md`.

> **Trigger di routing:** «menù fonte di verità» · «menu pagina impostazioni» · «tab Menu» →
> questo file (+ `BOOKING_DATA_FLOW_SKILL` se tocca il flusso dati, `DB_SKILL` se tocca lo schema).

---

## 1. Cos'è

La **tab Menu** (`MenuPricesTab`) è il magazzino unico di prezzi e ingredienti, da cui Pagina
Prenota e Menu QR pescano i dati. È la fonte di verità delle voci di menù.

## 2. Categorie e foto

- Categorie in `menu_categories` (`label`, `description`, `image_url` per Prenota).
- Foto thumbnail homepage QR in `menu_homepage_config.category_images` (path Storage
  `{tenantId}/cat/{key}.webp`) — **non mischiare** con la foto categoria Prenota
  (`menu_categories.image_url`, path `{tenantId}/booking-cat/{categoryId}.webp`).
- Panoramica categorie/ingredienti condivisa via `menuPricesCatalogLayout.ts` (griglia
  CollapsibleCard, righe `menu-prices-item-row`, selezione `menu-prices-item-row--selected`).
  - Griglia categorie `MENU_INGREDIENT_OVERVIEW_GRID_CLASS`: `grid-cols-1` → `sm:grid-cols-2`
    (≥640px) → `lg:grid-cols-3` (≥1024px). **Non** usare `md:` per le 2 colonne: lascia un buco a
    1 colonna tra 640-767px (regressione corretta 30-05-26). La classe legacy
    `menu-prices-category-list-wrap` in `index.css` non è più applicata a questa griglia.
- Grouping `itemsByCategory` centralizzato in `menuCatalogGrouping.ts` (`groupMenuItemsByCategory`)
  — usarlo, non duplicare.
- Subtitle card categoria: `N ingredienti` (con pluralizzazione) in tutti e 3 i componenti — non
  usare `selected/total`. Card categorie `defaultExpanded={false}`.
- **Overlay «Categorie Menu»** (`viewMode === 'categories'`): form in alto; scroll al form con
  `scrollIntoAdminShellView` (`adminScroll.ts`) sul `<main>` AdminShell Pro; guard chiusura (X / Esc)
  se form aperto e dirty — `DiscardChangesConfirmModal` (pattern Impostazioni 29-05-26).
- **Card categoria admin** (`AdminMenuCategoryLabelCard`): griglia `grid-cols-[minmax(0,1fr)_auto]`
  — titolo orizzontale con `break-words`, azioni a destra (no testo verticale lettera-per-lettera).

## 3. Form prodotto/ingrediente

In `MenuPricesTab`, il form "Nuovo/Modifica Prodotto" sta dentro la sezione "Modifica Ingredienti",
dopo titolo/descrizione e prima delle categorie; di default chiuso, si apre con "Aggiungi nuovo
ingrediente" (`Button variant="success" size="sm"`). Layout responsive: griglia 2x2 desktop
(nome/categoria, prezzo/foto) + descrizione full-width sotto; 1 colonna mobile.

## 4. Promo testuali

In `booking_menu_promos` (campi `label` admin + `message` cliente, `booking_types`,
`visible_on_booking`). Il form promo si apre inline nello stesso pannello e la lista promo resta
visibile sotto. Snapshot nomi in `booking_requests.menu_promo_labels` al submit. Pagina Prenota
mostra solo `message`; admin vede `label` in lista promo, card richiesta e modal dettagli. **Nessun
omaggio automatico** nel codice.

> Nota (29-05-26): l'editor promo è stato spostato dalla tab Menu alla sezione **Messaggio
> Promozionale** in Personalizza form — vedi `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md`. Il
> modello dati promo resta qui descritto.

## 5. Menù preselezionati (preset staff)

In `booking_custom_staff_presets` (`name`, `description?`, `price_per_person?`, `item_ids`,
`booking_types` legacy/default, `visible_on_booking?`):
- **NON** esiste più UI per abbinarli a tipologie né per renderli fissi/personalizzabili: l'abbinamento
  e il toggle fisso/personalizzabile si fanno solo in **Personalizza Form** (`sub_tabs[].preset_id`,
  `sub_tabs[].is_fixed_menu`).
- Cancellare un menù preselezionato avvisa l'admin e rimuove anche le card collegate in
  `booking_public_form_config`.
- Modificare un preset **non** elimina card e **non** sovrascrive campi personalizzati: il pubblico
  segue il resolver `field_overrides` (vedi `BOOKING_DATA_FLOW_SKILL.md`).
- `sub_tabs[].is_fixed_menu: false` → cliente può modificare ingredienti in `MenuSelection`, nessun
  prezzo fisso.

## 6. Legacy

`menu_items.booking_types` è legacy e va mantenuto vuoto (`{}`) per gli ingredienti, senza pannello
tipologie nella UI.

## 7. Report di sessione collegati

- Refactor promo: `docs/Sessioni di lavoro/23-05-26/Report-refactor-promo-menu-rimozione-vol-au-vent.md`
- Promo in Personalizza form: `docs/Sessioni di lavoro/29-05-26/Report-promo-personalizza-form-29-05-26.md`
- Fix menu admin modali 30-05-26: `docs/Sessioni di lavoro/30-05-26/Report-fix-menu-admin-modali-30-05-26.md`
