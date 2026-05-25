---
name: public-menu
description: >-
  Skill per il menu digitale pubblico QR. Caricalo quando lavori su pagine pubbliche
  /menu/:slug, gestione QR code admin, upload foto piatti, o flag qrMenu.
---

# Menu Digitale Pubblico via QR — Skill

> Feature introdotta nella sessione 24-05-26 con migrazione 030.

---

## 1. Cos'è

Mario scansiona un QR code sul tavolo → apre `/menu/:slug/qr/:shortCode` → vede il menu digitale del ristorante sul proprio telefono.

Il ristoratore (admin) crea i QR code dalla sezione **Menu → QR Code** (pulsante in `MenuPricesTab`, visibile solo se `features.qrMenu` è true).

---

## 2. Feature flag `qrMenu`

| Edition | Valore di default |
|---------|-------------------|
| `pro` / `enterprise` | `true` (sempre) |
| `classic` | `false` — override manuale via colonna `organizations.qr_menu_enabled = true` |

Definizione in `src/config/features.ts`:
```ts
qrMenu: isProOrAbove || qrMenuEnabled
```

`qrMenuEnabled` viene letto da `TenantContext` (campo `qrMenuEnabled: boolean`), che lo legge dalla view `organizations_public.qr_menu_enabled` durante `setTenantFromSlug`.

---

## 3. DB — Migrazioni rilevanti

| Migrazione | Cosa aggiunge |
|------------|---------------|
| `030` | `menu_items.image_url`, `menu_qr_codes`, `organizations.qr_menu_enabled`, bucket `menu-photos`, RLS public read su `menu_items` e `menu_categories` |
| `032` | Tabella `menu_homepage_config` (JSONB) — archivia `carousel_items`, `category_images` per tenant |
| `033` | `menu_categories.description TEXT NULL` — testo opzionale sotto il nome (usato in pagina Prenota e come fallback nel menu QR) |
| `034` | `menu_homepage_config.theme_key TEXT NOT NULL DEFAULT 'mediterranean_teal'` (5 valori). Tabella `menu_qrcode_categories`: override titolo/descrizione per card categoria nella homepage QR, **separati da `menu_categories`** — non impattano la pagina Prenota |
| `035` | `menu_categories.image_url TEXT NULL` — foto categoria per admin/Prenota (path Storage `{tenantId}/booking-cat/{categoryId}.webp`). **Non** sostituisce `menu_homepage_config.category_images` (thumb QR: `{tenantId}/cat/{categoryKey}.webp`) |

**Colonne `menu_categories`** (post-035): `id`, `tenant_id`, `key`, `label`, `description`, `image_url`, `sort_order`, `created_at`, `updated_at`.

**Colonne `menu_qrcode_categories`** (034): `id`, `tenant_id`, `category_key`, `title`, `description`, `created_at`, `updated_at`. UNIQUE `(tenant_id, category_key)`.

---

## 4. Storage foto (bucket `menu-photos`)

File: `src/lib/menuPhotoUpload.ts`

| Uso | Path Storage | Campo DB |
|-----|--------------|----------|
| Piatto | `{tenantId}/{menuItemId}.webp` | `menu_items.image_url` |
| Categoria Prenota | `{tenantId}/booking-cat/{categoryId}.webp` | `menu_categories.image_url` (035) |
| Thumb categoria QR homepage | `{tenantId}/cat/{categoryKey}.webp` | `menu_homepage_config.category_images` (JSON) |

- **Compressione**: canvas resize max 1200px, iterativa da quality 0.82 a 0.4, target 450KB
- **Upload**: upsert=true
- **Delete piatti**: `deleteMenuPhoto`; **categorie Prenota**: `deleteMenuCategoryPhoto`

Il flusso admin in `MenuPricesTab`:
1. Prodotto: sceglie file → anteprima → al salvataggio upload → update `menu_items.image_url`
2. Categoria (Gestione categorie): stesso pattern → `menu_categories.image_url` — **non** scrive in `category_images` del pannello QR

---

## 5. Short code QR

File: `src/lib/shortCodeGenerator.ts`

- Alfabeto senza caratteri ambigui: `abcdefghijkmnpqrstuvwxyz23456789` (no 0/O/1/l)
- `generateShortCode(length = 7)` via `crypto.getRandomValues`
- Formato URL: `/menu/:slug/qr/:shortCode`

---

## 6. Hook admin `useMenuQrCodes`

File: `src/features/booking/hooks/useMenuQrCodes.ts`

| Hook | Cosa fa |
|------|---------|
| `useMenuQrCodes()` | Lista QR del tenant (usa `supabase` autenticato) |
| `useCreateMenuQrCode()` | Insert con `{shortCode, input}` + toast |
| `useUpdateMenuQrCode()` | Update `{id, input}` + toast |
| `useDeleteMenuQrCode()` | Delete per id + toast |
| `usePublicMenuQr(tenantId, shortCode)` | Risolve QR per short_code (usa `supabasePublic`) |
| `usePublicDefaultMenuQr(tenantId)` | Primo QR attivo del tenant (fallback per `/menu/:slug`) |

---

## 7. Componenti admin

| Componente | File |
|------------|------|
| `MenuQrManager` | `src/features/booking/components/MenuQrManager.tsx` — solo lista «I miei QR» (tab Aspetto homepage spostato in modale) |
| `MenuQrModal` | `src/features/booking/components/MenuQrModal.tsx` — `size="lg"`; nome QR, categorie (checkbox «Attiva tutte»), preset opzionale, **Aspetto homepage** in fondo (condiviso tra tutti i QR del tenant) |
| `MenuHomepageConfigPanel` | `src/features/booking/components/MenuHomepageConfigPanel.tsx` — tema, carosello (titolo max 60, testo max 125, contatori), foto categorie, titoli/descrizioni card QR |

Il `MenuQrManager` è montato in `MenuPricesTab` quando `viewMode === 'qr_codes'` (pulsante "QR Code" nell'hero section, visibile solo se `features.qrMenu`).

---

## 8. Pagine pubbliche (mobile-first)

Tutte le pagine pubbliche menu sono **standalone** (non dentro AdminShell), nessun `max-w-7xl`.

| Route | Componente | File |
|-------|-----------|------|
| `/menu/:slug` | `PublicMenuPage` | `src/pages/PublicMenuPage.tsx` |
| `/menu/:slug/qr/:shortCode` | `PublicMenuPage` | idem |
| `/menu/:slug/qr/:shortCode/c/:categoryKey` | `PublicMenuCategoryPage` | `src/pages/PublicMenuCategoryPage.tsx` |
| `/menu/:slug/qr/:shortCode/preset/:presetId` | `PublicMenuPresetPage` | `src/pages/PublicMenuPresetPage.tsx` |

**Temi**: 5 palette in `src/features/public-menu/menuThemes.ts`. PNG sfondo in `public/menu-themes/`. Default: `mediterranean_teal`.

**Layout homepage `PublicMenuPage`** (post-sessione layout 24-05-26, vedi anche `docs/Sessioni di lavoro/24-05-26/Report-menu-qr-homepage-layout-sessione.md`):

1. **Sfondo pagina unico** — `themePageBackgroundStyle()` in `PublicMenuPage.tsx`: PNG header nella fascia `min(48vh,420px)` + PNG body `100% auto` ancorato sotto la fascia (sfumatura bianca ~2/5 del file, senza `cover` che stirava il gradiente).
2. **Hero `<header>`** — nome ristorante + fregio + `MenuCarousel` (nessuna label esterna “Specialità…”); badge solo dentro ogni slide. **`PublicMenuPageHeader` non usato** sulla homepage.
3. **Carosello** — slide full-bleed, overlay gradiente 40% sx, titolo/descrizione da `carousel_items`; pallini **cliccabili** (tap mobile 44px). Placeholder `h-28` se zero foto.
4. **Tab `MenuNavTabs`** — sticky; sfondo trasparente → opaco progressivo (~56px scroll) con `theme.tabBarStickyRgb`; scroll senza barra (`.scrollbar-hide`); frecce sx/dx solo **desktop** se overflow.
5. **Griglia categorie** — `grid-cols-1` / `min-[400px]:grid-cols-2`; thumb 1:1; override `menu_qrcode_categories` poi fallback `menu_categories`.
6. **Footer `MenuFooterCard`** — data e ora IT, `mt-auto` in fondo pagina.

> Dettaglio componenti: **`docs/per-ui-design-skill/PUBLIC_MENU_LAYOUT_CONTEXT.md`**

**Limiti admin carosello** (`MenuHomepageConfigPanel` → `CarouselSection`): titolo slide max **60** caratteri, testo breve max **125**, contatore `n/max` sotto ogni campo.

**`PublicMenuCategoryPage`** — dettaglio categoria:
- Carica i piatti della categoria da `menu_items` via `supabasePublic`
- `ItemCardWithPhoto`: immagine full-width `h-44` + gradiente nero dal basso con testo sovrapposto
- `ItemCardText`: solo testo (fallback quando `image_url` assente)

**`PublicMenuPresetPage`** — dettaglio menù evento:
- Carica il preset da `restaurant_settings.booking_custom_staff_presets`
- Carica i piatti per ids preservando l'ordine di `item_ids`
- Lista numerata `1. 2. 3.` con prezzo

---

## 9. Regole

```
RULE  Le pagine /menu/* usano SOLO supabasePublic — mai supabase autenticato
RULE  Il bucket menu-photos è pubblico — le URL sono stabili e cacheable
RULE  Non aggiungere cursor-pointer inline — usa la regola globale .is-clickable
RULE  Emoji categorie: mappa CATEGORY_EMOJI in PublicMenuPage — aggiungere nuove voci lì
RULE  Icone Phosphor categorie: mappa CATEGORY_ICON in PublicMenuPage — aggiungere nuove voci lì
RULE  content_type valori: 'a_la_carte' | 'preset_menus' | 'mixed' — non aggiungere altri
RULE  La pagina /menu/:slug senza short_code usa il QR default (primo is_active=true, sort_order ASC)
RULE  Se short_code specifico non trovato → redirect a /menu/:slug (useEffect in PublicMenuPage)
RULE  Testo sovrapposto su immagini carosello: gradiente linear-gradient(to right, rgba 0,0,0,0.55 0%, transparent 50%) — overlay 40% sx
RULE  Griglia categorie: grid-cols-1 / min-[400px]:grid-cols-2; thumb aspect-square w-24; mai split 50/50 (aggiornato in sessione 2026-05-24)
RULE  Titolo card categoria: legge prima menu_qrcode_categories.title, fallback menu_categories.label — mai hardcoded
RULE  Descrizione card categoria: legge prima menu_qrcode_categories.description, fallback menu_categories.description — mostrato solo se non null/empty
RULE  Carosello senza foto: placeholder trasparente h-28 — badge "Specialità della casa" solo dentro la slide, non sopra il carosello
RULE  Pallini carosello: button cliccabili con goToSlide — non solo drag/scroll
RULE  Sfondo pagina: themePageBackgroundStyle() — non due section con headerImage/bodyImage separate (evita stacco)
RULE  Body PNG: background-size 100% auto + position sotto --menu-header-band — non cover sul body intero
RULE  Tab sticky: sfondo rgba(tabBarStickyRgb, opacity) cresce dopo lock; scrollbar-hide; frecce md+ se overflow
RULE  Admin carosello: CAROUSEL_SLIDE_TITLE_MAX=60, CAROUSEL_SLIDE_DESCRIPTION_MAX=125 in MenuHomepageConfigPanel
RULE  Temi: getMenuTheme(key) da menuThemes.ts — campi anche tabBarStickyRgb, bodyFallbackBg (scuro per dark_gold/rustic)
RULE  PNG temi in public/menu-themes/ — wine_bistrot senza PNG (solo CSS)
RULE  PublicMenuPageHeader NON usato sulla homepage QR
RULE  Foto categorie: upload su Supabase menu-photos — modifiche admin non passano da Git
```
