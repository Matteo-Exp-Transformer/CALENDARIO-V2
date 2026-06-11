# Menu admin (tab Menu / MenuPricesTab) — context

> Mappa di dettaglio della **gestione menù lato admin**: tab Menu come magazzino unico di prezzi e
> ingredienti, form prodotto, categorie, promo testuali, menù preselezionati. Per il **flusso dati**
> (resolver, override, come Prenota/QR pescano i dati) vedi `../Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md`. Per la
> **pagina pubblica Prenota** vedi `../Prenota-Skill/PRENOTA_SKILL.md` (entry: senso+mappa). Per il **menu QR
> pubblico** vedi `PUBLIC_MENU_SKILL.md`.

> **Trigger di routing:** «menù fonte di verità» · «menu pagina impostazioni» · «tab Menu» →
> questo file (+ `../Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md` se tocca il flusso dati, `DB_SKILL` se tocca lo schema).

---

## 1. Cos'è

La **tab Menu** (`MenuPricesTab`) è il magazzino unico di prezzi e ingredienti, da cui Pagina
Prenota e Menu QR pescano i dati. È la fonte di verità delle voci di menù.

## 2. Categorie e foto

- Categorie in `menu_categories` (`label`, `description`, `image_url` per Prenota).
- Foto thumbnail **homepage QR legacy** in `menu_homepage_config.category_images` (path Storage
  `{tenantId}/cat/{key}.webp`) — **non mischiare** con: (a) la foto categoria Prenota
  (`menu_categories.image_url`, path `{tenantId}/booking-cat/{categoryId}.webp`); (b) le foto
  categoria **per-QR** del sistema attuale (`menu_qr_codes` / `menu_qrcode_categories`,
  path `{tenantId}/qr/{qrId|draft}/cat/{categoryKey}.webp`). `menu_homepage_config` è l'impianto
  **homepage QR storico**, distinto dal per-QR usato oggi.
- Panoramica categorie/ingredienti condivisa via `menuPricesCatalogLayout.ts` (griglia
  CollapsibleCard, righe `menu-prices-item-row`, selezione `menu-prices-item-row--selected`).
  - Griglia categorie `MENU_INGREDIENT_OVERVIEW_GRID_CLASS`: `grid-cols-1` fino a **1050px** →
    `min-[1050px]:grid-cols-2` → `xl:grid-cols-3` (≥1280px). Lista card categorie
    (`menuPricesCategoryListWrapClass`): sempre 1 colonna esterna; griglia interna
    `AdminMenuCategoryLabelCard` passa a 2 col da **1050px** (`min-[1050px]:grid-cols-2`) — allineato a overview ingredienti e soglia tab Menu principale.
- Grouping `itemsByCategory` centralizzato in `menuCatalogGrouping.ts` (`groupMenuItemsByCategory`)
  — usarlo, non duplicare.
- Subtitle card categoria: `N ingredienti` (con pluralizzazione) in tutti e 3 i componenti — non
  usare `selected/total`. Card categorie `defaultExpanded={false}`.
- **Overlay «Categorie Menu»** (`viewMode === 'categories'`): form in alto; scroll al form con
  `scrollIntoAdminShellView` (`adminScroll.ts`) sul `<main>` AdminShell Pro; guard chiusura (X / Esc)
  se form aperto e dirty — `DiscardChangesConfirmModal` (pattern Impostazioni 29-05-26).
- **Rename chiave categoria:** se il nome cambia lo slug (`key`), modale **Conferma e salva** prima del persist (come elimina categoria); poi `useUpdateMenuCategory` allinea `menu_items`, Menù QR e `hidden_category_keys` in Personalizza form. Solo al save confermato, non in digitazione o cambio tab. Vedi `PUBLIC_MENU_DATA_FLOW_CONTEXT.md` § rename · FU-029.
- **Elimina categoria:** modale **Elimina categoria** con avviso QR/form (`CATEGORY_KEY_DELETE_INFO_MESSAGE`); al click Elimina `useDeleteMenuCategory` esegue sync immediato (`syncMenuCategoryKeyDelete`) — non al Salva modale QR. Vedi `PUBLIC_MENU_DATA_FLOW_CONTEXT.md` § delete sync.
- **Card categoria admin** (`AdminMenuCategoryLabelCard`): flex `.menu-prices-category-label-card`
  (CSS in `index.css`). **Mobile (&lt;1050px): nessuna thumb** — solo titolo + azioni in colonna
  (`.menu-prices-category-label-card__body`). **Desktop (≥1050px):** thumb Prenota
  (`menu_categories.image_url`) in `.menu-prices-category-label-card__thumb` (`hidden min-[1050px]:block`).
  Titolo centrato in `.menu-prices-category-label-card__title` (zona centrale flex);
  icone in `.menu-prices-category-label-card__actions` in basso, centrate (no overlap ~375px).

## 3. Form prodotto/ingrediente

In `MenuPricesTab`, il form "Nuovo/Modifica Prodotto" sta dentro la sezione "Modifica Ingredienti",
dopo titolo/descrizione e prima delle categorie; di default chiuso, si apre con "Aggiungi nuovo
ingrediente" (`Button variant="success" size="sm"`). Layout responsive: griglia 2x2 desktop
(nome/categoria, prezzo/foto) + descrizione full-width sotto; 1 colonna mobile.
Scroll al form (anche **Modifica** su un’altra card con form già aperto): `scrollIntoAdminShellView`
su titolo form (`productFormTitleRef` / `categoryFormTitleRef`), `scrollMarginTop` ~132px,
`ensureVisible: true` — stesso helper dell’overlay Categorie Menu (`adminScroll.ts`).

**Cap testo compose Prenota (FU-030 Fase 1, 10-06-26):** `BOOKING_MENU_COMPOSE_TEXT_LIMITS` —
nome prodotto **24**, descrizione **79** (`maxLength` + contatore `N/max` nel form prodotto);
titolo categoria **24** nell'overlay «Categorie Menu». Allineati ai cap sottotab card. Il pubblico
tronca in silenzio al render (`clampBookingText`); vedi `Prenota-Skill/contesto/PRENOTA_TEXT_LIMITS_MAP.md` §E.

## 4. Promo testuali

In `booking_menu_promos` (campi `label` admin + `message` cliente, `booking_types`,
`visible_on_booking`). Il form promo si apre inline nello stesso pannello e la lista promo resta
visibile sotto. Snapshot nomi in `booking_requests.menu_promo_labels` al submit. Pagina Prenota
mostra solo `message`; admin vede `label` in lista promo, card richiesta e modal dettagli. **Nessun
omaggio automatico** nel codice.

> Nota (29-05-26): l'editor promo è stato spostato dalla tab Menu alla sezione **Messaggio
> Promozionale** in Personalizza form — vedi `../Prenota-Skill/contesto/PRENOTA_FORM_CONFIG_CONTEXT.md`. Il
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
  segue il resolver `field_overrides` (vedi `../Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md`).
- `sub_tabs[].is_fixed_menu: false` → cliente può modificare ingredienti in `MenuSelection`, nessun
  prezzo fisso.

## 6. Legacy

`menu_items.booking_types` è legacy e va mantenuto vuoto (`{}`) per gli ingredienti, senza pannello
tipologie nella UI.

## 8. Modale Menù QR — icone categoria (senza foto)

- **Dove:** tab Menu → I miei QR → Crea/Modifica → sezione card categoria **senza** foto in `category_images` del QR.
- **UI:** titolo «Icona categoria (senza foto)» + picker **20 icone** (12 Phosphor + 8 Lucide «Altre icone») in `MenuQrCategoryCardsSection` (`MenuHomepageConfigPanel.tsx`).
- **Default:** `lucide_salad` (Insalata) per categorie senza mapping e senza icona DB valida; mapping Phosphor per key comuni in `categoryIcons.ts` (`pizza` → `pizza_slice`, `birre` → `beer`, …) — costante `MENU_QR_DEFAULT_CATEGORY_ICON_KEY`.
- **DB:** `menu_qrcode_categories.icon` (migrazione 042) — una delle 12 chiavi; prefill su nuovo QR senza upload foto automatico.
- Dettaglio pubblico: `PUBLIC_MENU_SKILL.md` § Icone categoria senza foto.

## 7. Report di sessione collegati

- Refactor promo: `docs/Sessioni di lavoro/23-05-26/Report-refactor-promo-menu-rimozione-vol-au-vent.md`
- Promo in Personalizza form: `docs/Sessioni di lavoro/29-05-26/Report-promo-personalizza-form-29-05-26.md`
- Fix menu admin modali 30-05-26: `docs/Sessioni di lavoro/30-05-26/Report-fix-menu-admin-modali-30-05-26.md`
