# Menu QR — contesto agenti (flusso dati admin ↔ pubblico)

> Mappa come il ristoratore configura il menù digitale QR in **Admin → Tab Menu → QR Code** e cosa vede il cliente su **`/menu/:slug/qr/:shortCode`**.
> Layout visivo homepage: `PUBLIC_MENU_LAYOUT_CONTEXT.md`. Skill entry: `PUBLIC_MENU_SKILL.md`.
> Report sessione mappa: `docs/Sessioni di lavoro/29-05-26/Report-mappatura-menu-qr-admin-pubblico-29-05-26.md`.

**Trigger routing:** «Menu QR» · «Impostazione Menù QR» · «PublicMenuPage» · «category_filter» · «hidden_menu_item_ids» · «aspetto per-QR» → questo file + `PUBLIC_MENU_SKILL.md`.

---

## 1. Dove si trova nell’app

| Schermata | Percorso UI | Componente |
|-----------|-------------|------------|
| Gestione QR | Admin → **Menu** → pulsante **QR Code** (se `features.qrMenu`) | `MenuPricesTab` → `MenuQrManager` |
| Modale impostazioni | Nuovo QR / Modifica | **`MenuQrModal`** («Impostazione Menù QR») |
| Sezioni aspetto | Dentro modale | `MenuQrThemeSection`, `MenuQrCarouselSection`, `MenuQrCategoryCardsSection`, `MenuQrHiddenItemsPicker` (in `MenuHomepageConfigPanel.tsx`) |
| Homepage QR cliente | `/menu/:slug/qr/:shortCode` | **`PublicMenuPage`** |
| Dettaglio categoria | `…/c/:categoryKey` | **`PublicMenuCategoryPage`** |
| Dettaglio menù evento | `…/preset/:presetId` | **`PublicMenuPresetPage`** |

**Dati principali:**

| Storage | Cosa contiene |
|---------|---------------|
| **`menu_qr_codes`** | Un QR = una riga: `short_code`, `name`, `content_type`, `category_filter`, `preset_ids`, `theme_key`, `carousel_items`, `category_images`, `hidden_menu_item_ids`, `is_active`, `sort_order` |
| **`menu_qrcode_categories`** | Override titolo/descrizione card per `(menu_qr_code_id, category_key)` |
| **`menu_categories`** / **`menu_items`** | Magazzino menu condiviso (tab Menu + QR + Pagina Prenota) |
| **`restaurant_settings`** chiave `booking_custom_staff_presets` | Menù evento staff (JSON array `{ id, name, item_ids[] }`) — condiviso con Pagina Prenota |
| **Storage `menu-photos`** | `{tenantId}/qr/{id\|draft/…}/carousel/` e `…/cat/{categoryKey}.webp` |

---

## 2. Flusso salvataggio admin

```
MenuQrModal.buildPayload()
  → MenuQrManager.handleSave()
  → useSaveMenuQrSettings (useMenuQrCodes.ts)
       ├─ upsert menu_qr_codes
       ├─ upsert menu_qrcode_categories (onConflict menu_qr_code_id,category_key)
       └─ primo insert: migrateMenuQrDraftAssets (qr/draft/ → qr/{id}/)
```

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

**Preservati senza UI nel modale:** `content_type` (default `a_la_carte`), `preset_ids`, `is_active`, `sort_order`, `short_code` (generato al create).

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

**Inline in `PublicMenuPage`:** `usePublicCategories`, `usePublicPresets` (da `menu_categories` e `booking_custom_staff_presets`).

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

## 5. Regole `content_type` (layout homepage)

| Valore | Griglia categorie + tab cat | Sezione preset |
|--------|----------------------------|----------------|
| `a_la_carte` | Sì | No |
| `preset_menus` | No | Sì |
| `mixed` | Sì | Sì |

**Attenzione INC-06:** `MenuNavTabs` se `presets.length > 0` mostra **solo** tab preset, nascondendo tab categorie anche in `mixed`.

File: `src/pages/PublicMenuPage.tsx` (`MenuContent`, `MenuNavTabs`).

---

## 6. Limiti admin carosello

| Campo | Max char | Costante |
|-------|----------|----------|
| Eyebrow | 40 | `CAROUSEL_SLIDE_EYEBROW_MAX` |
| Titolo | 60 | `CAROUSEL_SLIDE_TITLE_MAX` |
| Descrizione | 125 | `CAROUSEL_SLIDE_DESCRIPTION_MAX` |

Pubblico: eyebrow fallback «Specialità della casa»; slide senza `image_url` escluse dal parse.

---

## 7. Invarianti (non rompere senza test)

1. Pagine `/menu/*` → **solo `supabasePublic`**
2. **`tenantReady`** prima di lookup QR (evita tenantId stale da sessione admin)
3. Aspetto visivo homepage da **`menu_qr_codes`**, non `menu_homepage_config`
4. Override card: prima `menu_qrcode_categories`, fallback `menu_categories.label/description`
5. Thumb card: `category_images[key]` su QR — **non** `menu_categories.image_url` (foto Prenota)
6. Hidden items: filtrati in **`PublicMenuCategoryPage`** — **non** in preset page (INC-15)
7. Temi: 4 chiavi in `menuThemes.ts`; sconosciuti → `mediterranean_teal`
8. Nuovo QR: foto in `qr/draft/{shortCode}/` → migrate al primo Salva

---

## 8. Incoerenze aperte (29-05-26 Fase 1)

| ID | Sintesi |
|----|---------|
| INC-01 | Header usa `organizations_public.name`, non `restaurant_name` |
| INC-02 | `menu_qr_codes.name` non mostrato al cliente |
| INC-03 | Nessuna UI per `content_type` / `preset_ids` |
| INC-04 | Tema QR ignorato su pagine categoria/preset |
| INC-05 | Preset page: no foto piatti |
| INC-06 | Tab preset nasconde tab categorie se preset presenti |
| INC-08 | Titolo override non usato in pagina categoria |
| INC-09 | URL categoria bypassa `category_filter` |
| INC-15 | `hidden_menu_item_ids` non su preset page |
| INC-16 | Preset page senza `tenantReady` |

Dettaglio: report mappa § Incoerenze. Fix in fasi 3–4 del ciclo.

---

## 9. Query SQL verificate (TEST `docnnernvp`)

```sql
-- Tenant
SELECT id, name, slug FROM organizations WHERE slug = 'test-pro';

-- QR tenant
SELECT id, short_code, name, content_type, category_filter, theme_key,
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
| Storage path | `src/features/booking/utils/menuQrStorage.ts` |
| Homepage pubblica | `src/pages/PublicMenuPage.tsx` |
| Categoria pubblica | `src/pages/PublicMenuCategoryPage.tsx` |
| Preset pubblico | `src/pages/PublicMenuPresetPage.tsx` |
| Temi | `src/features/public-menu/menuThemes.ts` |
| Tipi | `src/types/menu.ts` (`MenuQrCode`, `CarouselItem`) |
