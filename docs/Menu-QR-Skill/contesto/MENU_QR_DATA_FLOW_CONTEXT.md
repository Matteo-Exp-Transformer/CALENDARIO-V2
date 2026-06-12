# Menu QR — contesto agenti (flusso dati admin ↔ pubblico)

> Mappa come il ristoratore configura il menù digitale QR in **Admin → Tab Menu → QR Code** e cosa vede il cliente su **`/menu/:slug/qr/:shortCode`**.
> Layout visivo homepage: `MENU_QR_LAYOUT_CONTEXT.md`. Skill entry: `../MENU_QR_SKILL.md`.
> Report sessione mappa: `docs/Sessioni di lavoro/29-05-26/Report-mappatura-menu-qr-admin-pubblico-29-05-26.md`.
> ⚠️ **Stato verificato 06-06-26 (codice = verità).** Alcuni INC dei report sotto (§8) sono ormai
> **risolti o irraggiungibili** — vedi la sezione «Codice morto» qui sotto e §3-bis dello skill. Non
> fidarti della colonna «Stato» dei report vecchi senza ricontrollare il codice.

**Trigger routing:** «Menu QR» · «Impostazione Menù QR» · «PublicMenuPage» · «category_filter» · «hidden_menu_item_ids» · «aspetto per-QR» → questo file + `../MENU_QR_SKILL.md`.

---

## 0. Preset/menù-evento via QR — RIMOSSO (blindatura 06-06-26)

> **Fatto, non più da fare.** Il campo `menu_qr_codes.content_type` (`a_la_carte`/`preset_menus`/`mixed`)
> e `preset_ids` attivavano i menù-evento dentro il QR, ma il modale non li ha mai esposti → logica
> irraggiungibile. **Rimossi nella blindatura del 06-06-26.** Un agente NON deve reintrodurli nel QR.

**Cosa è stato rimosso:**
- `src/pages/PublicMenuPresetPage.tsx` (file cancellato) + route `…/preset/:presetId` (via da `router.tsx`)
- In `PublicMenuPage.tsx`: hook `usePublicPresets`, rami `showPresets`/`showCart`, sezione preset, prop
  `presets` di `MenuNavTabs` → resta solo il flusso categorie (`category_filter` letto sempre)
- Tipi `content_type`/`preset_ids` (`menu.ts`, `database.ts`), scrittura nel modale e in `useMenuQrCodes`,
  parse in `menuQrAppearance.parseMenuQrCodeRow`
- **Colonne DB** `content_type`/`preset_ids` + CHECK → **migrazione `043`** (`043_drop_menu_qr_preset_columns.sql`).
  Prima del drop verificato su PROD (`rwuxgvld`) e TEST (`docnnernvp`): 0 righe non-`a_la_carte`, 0 preset.
- INC latenti spariti con la rimozione: INC-05, INC-06, INC-15, INC-16.

**Resta vivo (NON toccato):** il preset di **Pagina Prenota** (`booking_custom_staff_presets`,
`CustomStaffPreset`, `bookingFormResolver`). La rimozione ha riguardato solo l'uso *dentro il QR*.

---

## 1. Dove si trova nell’app

| Schermata | Percorso UI | Componente |
|-----------|-------------|------------|
| Gestione QR | Admin → **Menu** → pulsante **QR Code** (se `features.qrMenu`) | `MenuPricesTab` → `MenuQrManager` |
| Modale impostazioni | Nuovo QR / Modifica | **`MenuQrModal`** («Impostazione Menù QR») |
| Sezioni aspetto | Dentro modale | `MenuQrThemeSection`, `MenuQrCarouselSection`, `MenuQrCategoryCardsSection`, `MenuQrHiddenItemsPicker` (in `MenuHomepageConfigPanel.tsx`) |
| Homepage QR cliente | `/menu/:slug/qr/:shortCode` | **`PublicMenuPage`** |
| Dettaglio categoria | `…/c/:categoryKey` | **`PublicMenuCategoryPage`** |

**Dati principali:**

| Storage | Cosa contiene |
|---------|---------------|
| **`menu_qr_codes`** | Un QR = una riga: `short_code`, `name`, `category_filter`, `theme_key`, `carousel_items`, `category_images`, `hidden_menu_item_ids`, `is_active`, `sort_order` (colonne `content_type`/`preset_ids` rimosse, migrazione 043) |
| **`menu_qrcode_categories`** | Override titolo/descrizione card per `(menu_qr_code_id, category_key)` |
| **`menu_categories`** / **`menu_items`** | Magazzino menu condiviso (tab Menu + QR + Pagina Prenota); `is_available` (M3 Fase 2) — spento = nascosto anche su QR |
| **`restaurant_settings`** chiave `booking_custom_staff_presets` | Menù evento staff (JSON array `{ id, name, item_ids[] }`) — condiviso con Pagina Prenota |
| **Storage `menu-photos`** | `{tenantId}/qr/{id\|draft/…}/carousel/` e `…/cat/{categoryKey}.webp` |

---

## 2. Flusso salvataggio admin

```
MenuQrModal.buildPayload()
  → MenuQrManager.handleSave()
  → useSaveMenuQrSettings (useMenuQrCodes.ts)
       ├─ importCatalogCategoryImagesToQrStorage (booking-cat/ → qr/{id|draft}/cat/)
       ├─ upsert menu_qr_codes
       ├─ upsert menu_qrcode_categories (onConflict menu_qr_code_id,category_key)
       └─ primo insert: migrateMenuQrDraftAssets (qr/draft/ → qr/{id}/)
```

**Import foto catalogo → QR (modale):** alla selezione checkbox (o nuovo QR con categorie preselezionate), anteprima da `menu_categories.image_url` (path `booking-cat/`). Se il draft ha già un URL `booking-cat/` di **altra** categoria (stale), riselezionando la checkbox si aggiorna l’anteprima; thumb già su `qr/…/cat/` non viene sovrascritta. Al **Salva**, copia storage su `qr/…/cat/{categoryKey}.webp` e persiste URL QR in `category_images`. Mai scrittura su `menu_categories` né `booking-cat/`. QR esistenti senza thumb in `category_images`: nessun backfill all’apertura; solo riselezione o upload manuale. Helper: `buildCatalogPrefillForKeys`, `shouldRefreshCatalogPrefill` in `menuQrStorage.ts`.

**Rename chiave categoria (magazzino):** solo al **Salvataggio** overlay «Categorie ingredienti» (`useUpdateMenuCategory`), se `previousKey !== key`: **prima** modale conferma in `MenuPricesTab` (stesso pattern modale «Elimina categoria» — Annulla / Conferma e salva; testo `CATEGORY_KEY_RENAME_INFO_MESSAGE`); poi sync DB. Per ogni `menu_qr_codes` del tenant aggiorna `category_filter` e `category_images` (sposta URL; copia opz. Storage `qr/{id}/cat/{old}.webp` → `{new}.webp`); `menu_qrcode_categories` fa UPDATE `category_key` (merge su conflitto UNIQUE). Non resetta title/description/icon né forza re-upload. Errori sync → toast errore. Helper: `menuQrCategoryKeySync.ts`, orchestrazione `syncMenuCategoryKeyRename.ts`.

**Delete categoria (magazzino):** al click **Elimina categoria** nel modale overlay (`useDeleteMenuCategory`), **dopo** delete `menu_categories` OK e **prima** del toast successo: sync immediato (non al Salva modale QR). Modale conferma include `CATEGORY_KEY_DELETE_INFO_MESSAGE`. Per ogni `menu_qr_codes` del tenant: rimuove la chiave da `category_images`; da `category_filter` solo se array esplicito (`null` legacy = tutte le categorie, **non** modificato); DELETE righe `menu_qrcode_categories` per `(tenant_id, category_key)`; rimuove la chiave da `hidden_category_keys` in `booking_public_form_config`; opz. Storage `remove` su `qr/{id}/cat/{key}.webp` se c’era thumb QR. Helper: `deleteCategoryKeyFromQrRow`, orchestrazione `syncMenuCategoryKeyDelete.ts`.

**Campi scritti dal modale:**

| Controllo admin | Colonna DB |
|-----------------|------------|
| Nome QR | `name` |
| Checkbox categorie | `category_filter` (array esplicito; mai `null` su nuovo save) |
| Tema | `theme_key` |
| Carosello | `carousel_items` JSONB |
| Foto categorie | `category_images` JSONB |
| Titolo/descrizione card | `menu_qrcode_categories.title/description` |
| Ingredienti nascosti | `hidden_menu_item_ids` JSONB UUID[] |

**Preservati senza UI nel modale:** `is_active`, `sort_order`, `short_code` (generato al create).

File: `src/features/booking/components/MenuQrModal.tsx`, `src/features/booking/hooks/useMenuQrCodes.ts`.

---

## 3. Flusso lettura pubblica

```
URL /menu/:tenantSlug/qr/:shortCode
  → TenantContext.setTenantFromSlug (organizations_public)
  → tenantReady = slug risolto
  → usePublicMenuQr(tenantId, shortCode) → menu_qr_codes WHERE is_active
  → parseMenuQrCodeRow (menuQrAppearance.ts)
  → PublicMenuPage / MenuContent
```

**Client:** solo **`supabasePublic`** — mai `supabase` autenticato.

**Hook pubblici:**

| Hook | Tabella | Uso |
|------|---------|-----|
| `usePublicMenuQr` | `menu_qr_codes` | Risolve QR per `short_code` |
| `usePublicDefaultMenuQr` | `menu_qr_codes` | `/menu/:slug` senza shortCode → primo attivo |
| `usePublicMenuQrcodeCategories(qrId)` | `menu_qrcode_categories` | Override titoli card homepage |

**Inline in `PublicMenuPage`:** `usePublicCategories` (da `menu_categories`). Il vecchio `usePublicPresets` è stato rimosso con il codice preset (§0).

**Deprecato:** `menu_homepage_config`, `usePublicMenuHomepageConfig` — sostituiti da colonne per-QR (migrazione **036**).

---

## 4. Regole `category_filter`

| Valore DB | Comportamento pubblico |
|-----------|------------------------|
| `null` | Legacy: **tutte** le categorie del tenant |
| `[]` | Nessuna card categoria |
| `[keys…]` | Solo quelle chiavi |

Admin UI: `resolveCategoryFilterForUi` tratta `null` come «tutte le categorie con almeno un ingrediente».

---

## 5. Layout homepage (post-rimozione preset)

La homepage QR mostra **sempre** tab categorie + griglia categorie: non c'è più un `content_type` che
ne cambi il layout (rimosso, §0). `MenuContent`/`MenuNavTabs` hanno un solo ramo: le categorie da
`category_filter`. Se non ci sono categorie da mostrare → stato vuoto «Menu in preparazione».

File: `src/pages/PublicMenuPage.tsx` (`MenuContent`, `MenuNavTabs`).

---

## 6. Limiti admin testo

| Campo | Max char | Costante |
|-------|----------|----------|
| Carosello — Eyebrow | 40 | `CAROUSEL_SLIDE_EYEBROW_MAX` |
| Carosello — Titolo | 60 | `CAROUSEL_SLIDE_TITLE_MAX` |
| Carosello — Descrizione | 125 | `CAROUSEL_SLIDE_DESCRIPTION_MAX` |
| Card categoria — Titolo | 30 | `QR_CATEGORY_TITLE_MAX` (FU-MQR-1, 06-06-26) |
| Card categoria — Descrizione | 70 | `QR_CATEGORY_DESCRIPTION_MAX` (FU-MQR-1, 06-06-26) |

Pubblico: eyebrow **NON ha fallback** — slide con eyebrow vuota non mostra nulla al suo posto («Specialità
della casa» è solo placeholder admin). Slide senza `image_url` escluse dal parse. Dettaglio cap categoria:
`MENU_QR_TEXT_LIMITS_MAP.md`.

---

## 7. Invarianti (non rompere senza test)

1. Pagine `/menu/*` → **solo `supabasePublic`**
2. **`tenantReady`** prima di lookup QR (evita tenantId stale da sessione admin)
3. Aspetto visivo homepage da **`menu_qr_codes`**, non `menu_homepage_config`
4. Override card: prima `menu_qrcode_categories`, fallback `menu_categories.label/description`
5. Thumb card: `category_images[key]` su QR — **non** `menu_categories.image_url` (foto Prenota)
6. Hidden items: filtrati in **`PublicMenuCategoryPage`** insieme a `is_available` magazzino (`filterMenuItemsForPublicQr`); categorie off in `PublicMenuPage` via `filterMenuCategoriesForPublic`
6-bis. **Admin `MenuQrModal`:** checkbox categorie e lista ingredienti per-QR usano lo stesso filtro magazzino (`filterMenuItemsForPublic` / `filterMenuCategoriesForPublic`); al save `category_filter` prunato da chiavi spente. Distinto da `hidden_menu_item_ids` (override per questo QR).
7. Temi: 5 chiavi in `menuThemes.ts`; sconosciuti → `mediterranean_teal`
8. Nuovo QR: foto in `qr/draft/{shortCode}/` → migrate al primo Salva

---

## 8. Incoerenze aperte (29-05-26 Fase 1)

| ID | Sintesi | Stato Fase 3 (30-05-26) |
|----|---------|-------------------------|
| INC-01 | Header usa `organizations_public.name`, non `restaurant_name` | **Risolto** — `useRestaurantName()` in `PublicMenuPage` |
| INC-02 | `menu_qr_codes.name` non mostrato al cliente | Aperto |
| INC-03 | Nessuna UI per `content_type` / `preset_ids` | Posticipato (fuori scope Fase 3) |
| INC-04 | Tema QR ignorato su pagine categoria/preset | **Parziale** — fascia header categoria da `theme_key` (D2); corpo/preset restano stone |
| INC-05 | Preset page: no foto piatti | Aperto |
| INC-06 | Tab preset nasconde tab categorie se preset presenti | Posticipato |
| INC-08 | Titolo override non usato in pagina categoria | Aperto (solo D2 header bg) |
| INC-09 | URL categoria bypassa `category_filter` | **Risolto** — `isCategoryInQrFilter` in `PublicMenuCategoryPage` |
| INC-15 | `hidden_menu_item_ids` non su preset page | Aperto |
| INC-16 | Preset page senza `tenantReady` | Aperto |

Dettaglio: report mappa § Incoerenze. Fix Fase 3 in §11 sotto.

---

## 11. Fix applicati (Fase 3 — 30-05-26)

| Area | Intervento | File |
|------|------------|------|
| Admin carosello QR | Label + contatori (`AdminFieldWithCharCount`: Etichetta 40, Titolo 60, Descrizione 125); `Modal` conferma rimozione slide | `MenuHomepageConfigPanel.tsx`, `AdminFieldWithCharCount.tsx` |
| Admin categorie QR | Zero categorie attive → messaggio (no card); `Modal` conferma rimozione foto categoria | `MenuHomepageConfigPanel.tsx` |
| Salva modale | `Modal` post-success (stesso link vs nuovo QR) | `MenuQrManager.tsx` |
| Validazione Salva | Carosello obbligatorio; ≥1 cat con ingrediente visibile; toast se invalido | `menuQrValidation.ts`, `MenuQrModal.tsx` |
| Checkbox categorie | Elenco allineato a tab Menu (`menu_categories`); refetch all'apertura modale | `MenuQrModal.tsx`, `MenuQrManager.tsx` |
| Pubblico carosello | Rimosso cuoricino decorativo su slide | `PublicMenuPage.tsx` |
| Pubblico header | Nome da `restaurant_settings.restaurant_name` via `useRestaurantName` | `PublicMenuPage.tsx` |
| Pubblico categoria | Guard `category_filter`; messaggio + link indietro se categoria esclusa | `PublicMenuCategoryPage.tsx`, `menuQrAppearance.ts` |
| Pubblico categoria header | Fascia sticky con PNG header del `theme_key` QR (asset finali FU-021) | `PublicMenuCategoryPage.tsx` |
| Doc layout | Rimosso riferimento attivo a `menu_homepage_config` in tabella §7 | `MENU_QR_LAYOUT_CONTEXT.md` |

---

## 9. Query SQL verificate (TEST `docnnernvp`)

```sql
-- Tenant
SELECT id, name, slug FROM organizations WHERE slug = 'test-pro';

-- QR tenant
SELECT id, short_code, name, category_filter, theme_key,
       carousel_items, category_images, hidden_menu_item_ids
FROM menu_qr_codes WHERE tenant_id = '<tenant_id>';

-- Override categorie
SELECT category_key, title, description FROM menu_qrcode_categories
WHERE menu_qr_code_id = '<qr_id>';

-- Preset staff
SELECT setting_value FROM restaurant_settings
WHERE tenant_id = '<tenant_id>' AND setting_key = 'booking_custom_staff_presets';
```

Campione TEST: tenant `test-pro`, QR `5f9n79b`, 3 slide carosello, 5 thumb, 2 hidden items, 2 preset staff. Revisione 30-05-26: su test-pro `restaurant_name` («Trattoria da Matteo») ≠ header pubblico `organizations_public.name` («Trattoria da Mugo») — vedi INC-01.

Guida generica query: aggiungere § Menu QR (**FU-017**).

---

## 10. File hub codice

| Area | File |
|------|------|
| Modale admin | `src/features/booking/components/MenuQrModal.tsx` |
| Sezioni UI | `src/features/booking/components/MenuHomepageConfigPanel.tsx` |
| Lista QR | `src/features/booking/components/MenuQrManager.tsx` |
| Save hook | `src/features/booking/hooks/useMenuQrCodes.ts` |
| Override hook | `src/features/booking/hooks/useMenuQrcodeCategories.ts` |
| Parse row | `src/features/booking/utils/menuQrAppearance.ts` |
| Rename/delete chiave QR (pure) | `src/features/booking/utils/menuQrCategoryKeySync.ts` |
| Rename chiave QR (DB) | `src/features/booking/services/syncMenuCategoryKeyRename.ts` |
| Delete chiave QR (DB) | `src/features/booking/services/syncMenuCategoryKeyDelete.ts` |
| Delete chiave form (pure) | `src/features/booking/utils/bookingFormCategoryKeySync.ts` |
| Storage path | `src/features/booking/utils/menuQrStorage.ts` |
| Homepage pubblica | `src/pages/PublicMenuPage.tsx` |
| Categoria pubblica | `src/pages/PublicMenuCategoryPage.tsx` |
| Temi | `src/features/public-menu/menuThemes.ts` |
| Tipi | `src/types/menu.ts` (`MenuQrCode`, `CarouselItem`) |
