# ADMIN — Menu Magazzino Context

> Il tab Menu (`MenuPricesTab`) è il magazzino/listino unico del tenant: fonte di verità di prezzi e
> ingredienti, da cui Pagina Prenota e Menu QR pescano i dati. Non coincide con nessuna delle due viste
> pubbliche.

> **Stato blindatura (M3):** intervista Matteo ✅ (11-06-26) · mappa ✅ (11-06-26) · test ✅ Fase 1+2+3 + QA E2E base (limiti 9 + availability 9 + sync rename/delete 9 Vitest + Playwright 1280/375/834, validate 554, 11-06-26) · blindato ✅.
> Decisioni intervista + flusso dati + cosa è nuovo → **§9** in fondo (fonte autorevole delle scelte di
> prodotto per quest'area). App unica: **nessuna distinzione admin/staff** (chi entra può tutto).

> **Trigger di routing:** «menù fonte di verità» · «menu pagina impostazioni» · «tab Menu» ·
> «MenuPricesTab» · «magazzino menu» → questo file (+ `../../Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md`
> se tocca il flusso dati, `DB_SKILL.md` se tocca lo schema). Per la **pagina pubblica Prenota** vedi
> `../../Prenota-Skill/PRENOTA_SKILL.md`. Per il **menu QR pubblico** vedi `../../Menu-QR-Skill/MENU_QR_SKILL.md`.

---

## 1. Scopo

Gestisce:

- categorie menu;
- ingredienti/prodotti/piatti;
- prezzi e descrizioni;
- foto piatto;
- foto categoria Prenota;
- preset staff per Prenota;
- QR menu e impostazioni per-QR;
- promo testuali (modello dati; editor in Personalizza form).

## 2. Componenti e hook

- `MenuPricesTab` e toolbar `MenuPricesHeroToolbar`.
- `useMenuItems`, `useMenuCategories`.
- `PresetMenuBuilder`.
- `MenuQrManager`, `MenuQrModal`, `useMenuQrCodes`, `useMenuQrcodeCategories`.
- Servizi sync: `syncMenuCategoryKeyRename`, `syncMenuCategoryKeyDelete`.
- Layout condiviso: `menuPricesCatalogLayout.ts`, `menuCatalogGrouping.ts` (`groupMenuItemsByCategory` — usarlo, non duplicare).
- Limiti e disponibilità: `menuMagazzinoLimits.ts` (`MENU_MAGAZZINO_HARD_LIMITS`, helper availability).
- Scroll overlay/form: `adminScroll.ts` (`scrollIntoAdminShellView`).

## 3. Tabelle, storage e UI tab Menu

### 3.1 Tabelle e storage

| Oggetto | Storage |
|---|---|
| Categorie | `menu_categories` |
| Ingredienti/piatti | `menu_items` |
| Promo testuali | `booking_menu_promos` (`label` admin + `message` cliente, `booking_types`, `visible_on_booking`) |
| Preset staff | `restaurant_settings.booking_custom_staff_presets` |
| QR | `menu_qr_codes`, `menu_qrcode_categories` |
| Foto piatto | bucket `menu-photos`, path `{tenantId}/{menuItemId}.webp` |
| Foto categoria Prenota | `menu_categories.image_url`, path `{tenantId}/booking-cat/{categoryId}.webp` |
| Foto categoria QR (per-QR) | `{tenantId}/qr/{qrId|draft}/cat/{categoryKey}.webp` |
| Homepage QR legacy | `menu_homepage_config.category_images` (path `{tenantId}/cat/{key}.webp`) — **impianto storico**, distinto dal per-QR |

**Non mischiare** tre famiglie foto categoria: (a) Prenota `menu_categories.image_url`; (b) per-QR
`menu_qr_codes` / `menu_qrcode_categories`; (c) homepage QR legacy `menu_homepage_config.category_images`.

### 3.2 Categorie — layout, foto e overlay

- Categorie in `menu_categories` (`label`, `description`, `image_url` per Prenota).
- Panoramica categorie/ingredienti: griglia `CollapsibleCard`, righe `menu-prices-item-row`, selezione
  `menu-prices-item-row--selected` via `menuPricesCatalogLayout.ts`.
- Griglia categorie `MENU_INGREDIENT_OVERVIEW_GRID_CLASS`: `grid-cols-1` fino a **1050px** →
  `min-[1050px]:grid-cols-2` → `xl:grid-cols-3` (≥1280px). Lista card categorie
  (`menuPricesCategoryListWrapClass`): sempre 1 colonna esterna; griglia interna
  `AdminMenuCategoryLabelCard` passa a 2 col da **1050px** (`min-[1050px]:grid-cols-2`) — allineato a
  overview ingredienti e soglia tab Menu principale.
- Subtitle card categoria: `N ingredienti` (con pluralizzazione) in tutti e 3 i componenti — non usare
  `selected/total`. Card categorie `defaultExpanded={false}`.
- **Overlay «Categorie Menu»** (`viewMode === 'categories'`): form in alto; scroll al form con
  `scrollIntoAdminShellView` sul `<main>` AdminShell Pro; guard chiusura (X / Esc) se form aperto e dirty —
  `DiscardChangesConfirmModal` (pattern Impostazioni 29-05-26).
- **Card categoria admin** (`AdminMenuCategoryLabelCard`, overlay «Categorie Menu», FU-026 Ciclo 8):
  shell `menu-prices-item-row` + `MENU_CARD_INNER_SHELL_CLASS` — titolo in `.menu-prices-item-text`
  (riga superiore; thumb Prenota `menu_categories.image_url` in `.menu-prices-category-label-card__thumb`,
  `hidden min-[1050px]:block`); matita/cestino in `.menu-prices-item-actions` **riga dedicata in basso a
  destra** (`justify-end`), stesso pattern dei menù preselezionati — evita overlap testo/icone su 375px.
- **Card ingrediente admin** (`AdminMenuIngredientCard`, FU-026): stesso pattern — riga 1 nome + prezzo;
  descrizione opzionale sotto; toggle disponibilità + matita/cestino (se `showActions`) in
  `.menu-prices-item-actions` **riga dedicata in basso a destra**. Vale in lista categorie (tab Menu) e in
  modalità «Modifica Ingredienti».

### 3.3 Form prodotto/ingrediente

In `MenuPricesTab`, il form "Nuovo/Modifica Prodotto" sta dentro la sezione "Modifica Ingredienti",
dopo titolo/descrizione e prima delle categorie; di default chiuso, si apre con "Aggiungi nuovo
ingrediente" (`Button variant="success" size="sm"`). Layout responsive: griglia 2x2 desktop
(nome/categoria, prezzo/foto) + descrizione full-width sotto; 1 colonna mobile.
Scroll al form (anche **Modifica** su un’altra card con form già aperto): `scrollIntoAdminShellView`
su titolo form (`productFormTitleRef` / `categoryFormTitleRef`), `scrollMarginTop` ~132px,
`ensureVisible: true` — stesso helper dell’overlay Categorie Menu.

**Cap testo compose Prenota (FU-030 Fase 1, 10-06-26; completato M3 Fase 1 11-06-26):** `BOOKING_MENU_COMPOSE_TEXT_LIMITS` —
nome prodotto **24**, descrizione **79** (`maxLength` + contatore `N/max` nel form prodotto);
titolo categoria **24** e **descrizione categoria 79** nell'overlay «Categorie Menu». Allineati ai cap sottotab. Il pubblico
tronca in silenzio al render (`clampBookingText`); vedi `../../Prenota-Skill/contesto/PRENOTA_TEXT_LIMITS_MAP.md` §E.

**Limiti duri magazzino (M3 Fase 1, 11-06-26):** costante `MENU_MAGAZZINO_HARD_LIMITS` in `menuMagazzinoLimits.ts` —
**7** categorie · **12** prodotti/categoria · **6** preset staff · **6** QR. Blocco solo su **nuovi** inserimenti
(tenant già oltre soglia: nessuna cancellazione). UX: pulsante disabilitato + `MenuMagazzinoLimitNotice` con messaggio
esplicito. Helper puri testati `@admin-blindatura: menu-magazzino-limits`.

**Avviso propagazione (M3 Fase 1; edition-aware 17-06-26):** form Nuovo/Modifica Prodotto mostra
`MenuMagazzinoPropagationNotice` prima di Salva — copy da `getMenuMagazzinoSavePropagationMessage(features.qrMenu)`:
Classic senza add-on QR cita solo **Pagina Prenota**; con `features.qrMenu` attivo cita anche **Menu QR** (fonte:
`tenant_features` via `useFeatures`, non `organizations.qr_menu_enabled`). Snapshot prenotazioni intatto. Overlay
categorie: hint per-campo già presenti.

**Toggle disponibilità magazzino (M3 Fase 2, 11-06-26; UX panoramica 11-06-26):** `is_available` su `menu_categories` +
`menu_items` (migrazione `045`). Unica superficie toggle: **panoramica Menu** — occhio nell’header di ogni
`CollapsibleCard` categoria (griglia Antipasti / Primi / …) e su ogni riga `AdminMenuIngredientCard` (sempre visibile,
non solo in modifica). Form «Crea / Modifica Prodotto» e overlay «Crea / Modifica Categoria»: **nessun** toggle; al save
si preserva `is_available` esistente (o `true` su nuovo). Voci spente restano visibili in admin con opacità **solo
in panoramica Menu**. Spento = nascosto in Pagina Prenota, Menu QR pubblico e nei **modal di config**
(`MenuQrModal`, editor card scorrevoli in Personalizza form, `PresetMenuBuilder`). Helper:
`menuMagazzinoLimits.ts`. Test: `@admin-blindatura: menu-magazzino-availability` (9 Vitest).

### 3.4 Promo testuali

In `booking_menu_promos`. Il form promo si apre inline nello stesso pannello e la lista promo resta
visibile sotto. Snapshot nomi in `booking_requests.menu_promo_labels` al submit. Pagina Prenota
mostra solo `message`; admin vede `label` in lista promo, card richiesta e modal dettagli. **Nessun
omaggio automatico** nel codice.

> Nota (29-05-26): l'editor promo è stato spostato dalla tab Menu alla sezione **Messaggio
> Promozionale** in Personalizza form — vedi `../../Prenota-Skill/contesto/PRENOTA_FORM_CONFIG_CONTEXT.md`. Il
> modello dati promo resta descritto qui.

### 3.5 Menù preselezionati (preset staff)

In `booking_custom_staff_presets` (`name`, `description?`, `price_per_person?`, `item_ids`,
`booking_types` legacy/default, `visible_on_booking?`):

- **NON** esiste più UI per abbinarli a tipologie né per renderli fissi/personalizzabili: l'abbinamento
  e il toggle fisso/personalizzabile si fanno solo in **Personalizza Form** (`sub_tabs[].preset_id`,
  `sub_tabs[].is_fixed_menu`).
- Cancellare un menù preselezionato apre modale in-app (non popup browser) e rimuove anche le card
  collegate in `booking_public_form_config`.
- Modificare un preset **non** elimina card e **non** sovrascrive campi personalizzati: il pubblico
  segue il resolver `field_overrides` (vedi `../../Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md`).
- `sub_tabs[].is_fixed_menu: false` → cliente può modificare ingredienti in `MenuSelection`, nessun
  prezzo fisso.

### 3.6 Legacy `booking_types` su ingredienti

`menu_items.booking_types` è legacy e va mantenuto vuoto (`{}`) per gli ingredienti, senza pannello
tipologie nella UI.

### 3.7 Modale Menù QR — icone categoria (senza foto)

- **Dove:** tab Menu → I miei QR → Crea/Modifica → sezione card categoria **senza** foto in `category_images` del QR.
- **UI:** titolo «Icona categoria (senza foto)» + picker **20 icone** (12 Phosphor + 8 Lucide «Altre icone») in `MenuQrCategoryCardsSection` (`MenuHomepageConfigPanel.tsx`).
- **Default:** `lucide_salad` (Insalata) per categorie senza mapping e senza icona DB valida; mapping Phosphor per key comuni in `categoryIcons.ts` (`pizza` → `pizza_slice`, `birre` → `beer`, …) — costante `MENU_QR_DEFAULT_CATEGORY_ICON_KEY`.
- **DB:** `menu_qrcode_categories.icon` (migrazione 042) — una delle 12 chiavi; prefill su nuovo QR senza upload foto automatico.
- Dettaglio pubblico: `../../Menu-QR-Skill/MENU_QR_SKILL.md` § Icone categoria senza foto.

## 4. Confini con Prenota e QR

- Prenota legge magazzino + `booking_public_form_config` tramite resolver.
- QR legge magazzino + `menu_qr_codes`/`menu_qrcode_categories`.
- I preset staff sono vivi per Prenota.
- I preset nel QR sono stati rimossi: non reintrodurre `content_type`/`preset_ids`.

## 5. Rename/delete categoria

Rename categoria:

1. aggiorna `menu_categories`;
2. aggiorna `menu_items.category`;
3. aggiorna `menu_qr_codes.category_filter/category_images`;
4. aggiorna `menu_qrcode_categories`;
5. aggiorna `booking_public_form_config.hidden_category_keys/category_order_keys`;
6. coordina storage dove previsto.

**UI rename:** se il nome cambia lo slug (`key`), modale **Conferma e salva** prima del persist (come elimina categoria); poi `useUpdateMenuCategory` allinea `menu_items`, Menù QR e `hidden_category_keys` in Personalizza form. Solo al save confermato, non in digitazione o cambio tab. Vedi `../../Menu-QR-Skill/contesto/MENU_QR_DATA_FLOW_CONTEXT.md` § rename · FU-029.

Delete categoria:

1. elimina ingredienti della categoria;
2. elimina categoria;
3. sincronizza QR/Form/foto.

**UI delete:** modale **Elimina categoria** con avviso QR/form (`CATEGORY_KEY_DELETE_INFO_MESSAGE`);
delete ingrediente e delete menù preselezionato usano anch'essi `Modal` in-app, mai `window.confirm`.
Al click Elimina categoria `useDeleteMenuCategory` esegue sync immediato (`syncMenuCategoryKeyDelete`)
— non al Salva modale QR. Vedi `../../Menu-QR-Skill/contesto/MENU_QR_DATA_FLOW_CONTEXT.md` § delete sync.

Questi flussi non sono una transazione unica tra tutte le risorse. Sono da considerare critici in
test futuri.

## 6. Vincoli

- `features.qrMenu` decide se mostrare area QR.
- `category_filter=null` nel QR significa legacy "tutte"; `[]` significa nessuna.
- Delete categoria invalida anche le viste pubbliche collegate.
- Delete QR invalida link già stampati.
- Modificare preset non deve sovrascrivere personalizzazioni già salvate nella vetrina Prenota.

## 7. Rischi aperti

- `useMenuCategories` ritorna `[]` se la tabella non esiste: utile legacy, ma può mascherare un errore.
- Sync rename/delete parziale può lasciare dati incoerenti (nessun rollback automatico oggi).
- **M3 controtest rename/delete ✅ Vitest (11-06-26, FU-M3-3):** suite `@admin-blindatura: menu-magazzino-sync` — happy path rename/delete + 3 scenari fallimento a metà (QR ok / form fail; secondo QR fail; delete QR ok / form fail). Comportamento atteso: throw + stato parziale documentato; hook `useUpdateMenuCategory`/`useDeleteMenuCategory` propagano errore con toast. Radice storica FU-MQR-3: rename via modale admin (`secondi_piattie` → slug corretto) allinea QR/form senza SQL manuale.

## 8. Rimandi

- Pagina Prenota: `../../Prenota-Skill/PRENOTA_SKILL.md`.
- Menu QR: `../../Menu-QR-Skill/MENU_QR_SKILL.md`.
- Flusso dati Menu (snapshot, propagazione, toggle): **§9 di questo file** è la fonte d'area;
  il resolver Prenota in dettaglio → `../../Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md`.
- Cap testo Prenota (mappa completa): `../../Prenota-Skill/contesto/PRENOTA_TEXT_LIMITS_MAP.md` §E.
- Promo editor UI: `../../Prenota-Skill/contesto/PRENOTA_FORM_CONFIG_CONTEXT.md`.
- Rename/delete QR sync: `../../Menu-QR-Skill/contesto/MENU_QR_DATA_FLOW_CONTEXT.md`.

## 9. Mappatura M3 — decisioni intervista (11-06-26)

Verbale delle scelte di prodotto fissate con Matteo. I **valori vivono nel codice** una volta
implementati; questa sezione spiega il PERCHÉ e cosa è ancora da costruire.

### 9.1 Limiti decisi

| Cosa | Regola | Tipo |
|---|---|---|
| Categorie per tenant | max **7** | blocco **duro** |
| Prodotti per categoria | max **12** | blocco **duro** |
| Menù preselezionati | max **6** | blocco **duro** |
| QR code | max **6** | blocco **duro** |
| Nome piatto e nome categoria | cap caratteri (priorità responsive mobile) | duro |
| Descrizione piatto e descrizione categoria | cap caratteri, più generoso del nome | duro |

> **Retroattività (deciso):** i blocchi duri valgono **solo sui nuovi inserimenti**. Un tenant già
> oltre soglia (es. >7 categorie configurate alla vendita) **non** va rotto né svuotato: si impedisce
> di aggiungerne altre, non si cancella l'esistente.

I cap testo sono i campi ancora "da cappare" segnalati come debito Prenota (§7). Foto: il flusso
upload converte/comprime già lato client (`menuPhotoUpload.ts`, webp ≤450KB, lato lungo 1200px) →
**non si chiede un formato all'utente**, scatta e carica. HEIC grezzo caricato da desktop è l'unico
caso che può fallire → messaggio gentile (no blocco preventivo dei formati).

### 9.2 Flusso dati — propagazione e SNAPSHOT (cardine dell'area)

- **Propagazione viva:** modificare/eliminare nel magazzino (`menu_categories`, `menu_items`)
  aggiorna **subito** sia Pagina Prenota sia Menu QR.
- **SNAPSHOT prenotazioni (invariante):** ogni prenotazione conserva una **copia congelata** del menù
  scelto dal cliente in `booking_requests.menu_selection` (`SelectedMenuItem[]`: id + **name + price +
  quantity + totalPrice**, vedi `types/menu.ts:152`). Cambiare/eliminare il magazzino **non altera mai**
  pending, accettate, archivio: il cliente vede sempre ciò che ha scelto. ✅ già implementato.
  - *Limite noto, accettato da Matteo:* lo snapshot NON include descrizione testuale né foto del piatto
    (solo nome+prezzo+quantità). Sufficiente per "cosa ho scelto e quanto pago".
- **Preset non riscrive la fonte:** modificare un menù preselezionato non scrive sul magazzino. ✅
- **QR per-QR:** ogni QR ha impostazioni proprie (piatti nascosti, titoli categoria) che non toccano
  la fonte. ✅ (`menu_qr_codes` / `menu_qrcode_categories`).
- **QR spento/cancellato:** il cliente che inquadra un QR non più attivo vede "menu non disponibile".

### 9.3 Da costruire in M3 (NON è solo mappatura dell'esistente)

**Fase 1 ✅ (11-06-26)** — implementato in codice (`menuMagazzinoLimits.ts`, `MenuPricesTab`, `MenuQrManager`):

1. **Blocchi duri** 7 categorie / 12 prodotti / 6 preset / 6 QR — solo su **nuovi** inserimenti; pulsante disabilitato + messaggio («Hai raggiunto il massimo di …»); tenant già oltre soglia non rotto.
2. **Cap nome + descrizione** piatti e categorie — `BOOKING_MENU_COMPOSE_TEXT_LIMITS` 24/24/79; contatore anche su **descrizione categoria** overlay.
3. **Avviso propagazione edition-aware** sul salvataggio **ingredienti** (`MenuMagazzinoPropagationNotice` +
   `getMenuMagazzinoSavePropagationMessage` — Prenota sempre; Menu QR solo se `features.qrMenu`).

**Fase 2 ✅ (11-06-26, FU-M3-2)** — implementato in codice (`045_menu_magazzino_is_available.sql`,
`menuMagazzinoLimits.ts` helper `isMenuCategoryAvailable` / `filterMenuItemsForPublic*`,
`MenuPricesTab` toggle occhio in **panoramica Menu** (fix UX 11-06-26), filtri `MenuSelection` +
`PublicMenuPage` + `PublicMenuCategoryPage`):

4. **Toggle disponibilità nel magazzino** — colonna `is_available` (default `true`) su `menu_items` **e**
   `menu_categories`. Regola: **spento qui = nascosto ovunque** (Prenota + QR). Distinto da
   `visible_on_booking` preset e da `hidden_menu_item_ids` per-QR (si combinano; magazzino off vince).
   **Superficie toggle (UX 11-06-26):** solo panoramica tab Menu — occhio header `CollapsibleCard`
   categoria + riga ingrediente (`AdminMenuIngredientCard`, sempre visibile); **non** nei form
   Crea/Modifica Prodotto né overlay Categorie. Al save form si preserva `is_available` esistente.
   Admin vede voci spente (opacità) **solo in panoramica tab Menu**. Snapshot
   `booking_requests.menu_selection` intatto.
   **Superfici admin config (11-06-26):** stesso filtro magazzino anche nei pannelli che
   *configurano* la vetrina — `MenuQrModal` (checkbox categorie + ingredienti per-QR),
   `BookingFormConfigPanel` (card scorrevoli → «Categorie e ingredienti visibili»),
   `PresetMenuBuilder` (menù preselezionato). Spento nel magazzino = **non elencato** lì
   (non confondere con `hidden_*` per-card/per-QR, che restano override vetrina).
   Test: `@admin-blindatura: menu-magazzino-availability` (**9** Vitest, incluso catalogo admin config).

### 9.4 Controtest obbligatori in blindatura

- **Rename/delete categoria** (sync `menu_categories` → `menu_items` → QR → form Prenota → storage,
  §5): non è transazione unica → **Vitest FU-M3-3 ✅ (11-06-26)** documenta stato parziale se un passo
  fallisce (QR aggiornato, form no; oppure primo QR ok, secondo fail). Nessun rollback automatico in codice.
  Radice storica della chiave categoria malformata (FU-MQR-3): fix operativo = rename confermato in overlay
  Categorie Menu (modale pre-save), non UPDATE SQL a mano.
- **Nuovo toggle disponibilità:** "spento" sparisce in Prenota **e** in QR; snapshot prenotazioni
  vecchie intatto. **FU-M3-QA-E2E ✅ (11-06-26):** spec Playwright ufficiale
  `e2e/admin-menu-magazzino-blindatura.spec.ts` copre toggle categoria/prodotto da Admin Menu,
  assenza toggle nell'overlay categoria, propagazione pubblica Menu QR + Prenota, viewport 1280/375/834
  e teardown dati E2E.
- **Cap retroattivi:** tenant già oltre soglia non viene rotto.

### 9.5 Stato blindatura (11-06-26)

**M3 BLINDATO ✅** — cancello `MANUALE_BLINDATURA` §4 chiuso; report
[`Report-finale-m3-menu-blindato-11-06-26.md`](../../Sessioni%20di%20lavoro/11-06-26/Report-finale-m3-menu-blindato-11-06-26.md).
Vitest **27** + E2E `e2e/admin-menu-magazzino-blindatura.spec.ts`; validate **554**. Merge prod: procedura MASTERPLAN §merge (non ancora eseguito).
Debiti fuori cancello: **FU-M3-QA-CT** (controtest browser extra, sessioni future).
