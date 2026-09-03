# MENU QR — Riferimento tecnico (migrazioni · storage · hook · regole)

> **Cos'è e perché è separato.** Questo file NON è lo skill: è il **registro tecnico denso** dell'area
> (tabelle DB, path storage, hook, ~40 RULE operative). Vive in `contesto/` perché un agente lo apre
> **solo** quando serve il dettaglio implementativo, non per orientarsi. Per il **senso, il flusso e i
> divieti voluti** parti sempre da `../MENU_QR_SKILL.md`. I valori qui **specchiano il codice** (codice
> = verità): se diverge dal codice, vince il codice.
>
> Feature introdotta 24-05-26 con migrazione 030.
> Flusso dati admin ↔ pubblico: `MENU_QR_DATA_FLOW_CONTEXT.md` · Layout: `MENU_QR_LAYOUT_CONTEXT.md`.

---

## 1. Cos'è

Mario scansiona un QR code sul tavolo → apre `/menu/:slug/qr/:shortCode` → vede il menu digitale del ristorante sul proprio telefono.

Il ristoratore (admin) crea i QR code dalla sezione **Menu → QR Code** (pulsante in `MenuPricesTab`, visibile solo se `features.qrMenu` è true).

---

## 2. Feature flag `qrMenu`

| Edition | Valore di default |
|---------|-------------------|
| `pro` / `enterprise` | `true` (bundle Pro) |
| `classic` | `false` — attivabile con override `tenant_features.feature_key = 'qrMenu'` |

Definizione in `src/config/features.ts`:
```ts
qrMenu: active.has('qrMenu')
```

`TenantContext` espone `featureOverrides` dalla view `organizations_public` (aggregato da
`tenant_features`). `useFeatures()` chiama `buildFeatures(edition, featureOverrides)`: il bundle Pro
aggiunge `qrMenu` di default, mentre Classic lo riceve solo tramite override DB. La vecchia colonna
`organizations.qr_menu_enabled` è legacy e non governa più la UI.

---

## 3. DB — Migrazioni rilevanti

| Migrazione | Cosa aggiunge |
|------------|---------------|
| `030` | `menu_items.image_url`, `menu_qr_codes`, `organizations.qr_menu_enabled`, bucket `menu-photos`, RLS public read su `menu_items` e `menu_categories` |
| `032` | Tabella `menu_homepage_config` (JSONB) — archivia `carousel_items`, `category_images` per tenant |
| `033` | `menu_categories.description TEXT NULL` — testo opzionale sotto il nome (usato in pagina Prenota e come fallback nel menu QR) |
| `034` | `menu_homepage_config.theme_key` + tabella `menu_qrcode_categories` (modello legacy per-tenant) |
| `035` | `menu_categories.image_url` — foto categoria Prenota |
| `036` | **Per-QR**: su `menu_qr_codes` → `theme_key`, `carousel_items`, `category_images`. Su `menu_qrcode_categories` → `menu_qr_code_id` FK, UNIQUE `(menu_qr_code_id, category_key)`. Migrazione dati da `menu_homepage_config` su ogni QR. `menu_homepage_config` **deprecata** (solo storico, non più scritta dall'admin). **Richiesta su TEST e produzione** prima del deploy app che salva il modale QR. |
| `037` | `menu_qr_codes.hidden_menu_item_ids` (JSONB UUID[] — ingredienti nascosti per QR). Rimozione tema `wine_bistrot` (CHECK a 4 temi; QR esistenti → `mediterranean_teal`). Applicare insieme a `036` su ogni ambiente. |
| `042` | `menu_qrcode_categories.icon TEXT NULL` — icona Phosphor scelta in modale QR quando manca foto in `category_images` (per singolo QR, non su `menu_categories`). |
| `043` | **Rimozione codice morto preset**: DROP `menu_qr_codes.content_type` + `preset_ids` + CHECK constraint. Verificato 0 righe non-`a_la_carte` su PROD e TEST prima del drop. Applicare insieme alla rimozione del codice preset dal client. |
| `049` | **Ordine piatti per-QR**: `menu_qr_codes.item_sort_overrides JSONB DEFAULT NULL`. Format: `{ "category_key": ["item_uuid", ...] }`. null o chiave assente = ordine magazzino. Applicare su TEST prima del deploy; su PROD a milestone M3. |

**Colonne `menu_qr_codes`** (post-049): campi 030 + `theme_key`, `carousel_items` (JSONB), `category_images` (JSONB), `hidden_menu_item_ids` (JSONB, default `[]`), `item_sort_overrides` (JSONB, default null).

**Colonne `menu_qrcode_categories`** (post-042): `id`, `tenant_id`, `menu_qr_code_id`, `category_key`, `title`, `description`, `icon`, timestamps. UNIQUE `(menu_qr_code_id, category_key)`.

**`category_filter` su `menu_qr_codes`**: `null` = legacy (pubblico mostra tutte le categorie, ordine catalogo `menu_categories.sort_order`); `[]` = nessuna card; `[keys]` = filtro esplicito **e ordine di visualizzazione** (tab + griglia homepage). La **sequenza dell’array** è l’ordine salvato dal modale (frecce Su/Giù sulle card «Titoli e descrizioni categorie», non sui checkbox). Nuova categoria attivata dai checkbox → append in coda. Nuovi salvataggi dal modale usano sempre array esplicito. Helper: `orderMenuCategoriesByFilter` in `menuQrAppearance.ts`.

---

## 4. Storage foto (bucket `menu-photos`)

File: `src/lib/menuPhotoUpload.ts`

| Uso | Path Storage | Campo DB |
|-----|--------------|----------|
| Piatto | `{tenantId}/{menuItemId}.webp` | `menu_items.image_url` |
| Categoria Prenota | `{tenantId}/booking-cat/{categoryId}.webp` | `menu_categories.image_url` (035) |
| Thumb categoria QR (per QR) | `{tenantId}/qr/{menuQrCodeId}/cat/{categoryKey}.webp` | `menu_qr_codes.category_images` (JSON) |
| Carosello QR (per QR) | `{tenantId}/qr/{menuQrCodeId}/carousel/{uuid}.webp` | `menu_qr_codes.carousel_items` (JSON) |
| Bozza nuovo QR (pre-salvataggio) | `{tenantId}/qr/draft/{shortCode}/carousel|cat/…` | spostato su path definitivo al primo Salva |
| Carosello Prenota | `{tenantId}/booking-form/{modeId}/{subTabId}/carousel/{uuid}.webp` | `restaurant_settings.booking_public_form_config.booking_modes[].sub_tabs[].carousel_items` |
| Path legacy (solo URL già salvate) | `{tenantId}/cat/…`, `{tenantId}/carousel/…` | `menu_homepage_config` — non più usato in scrittura |

- **Compressione**: canvas resize max 1200px, iterativa da quality 0.82 a 0.4, target 450KB
- **Upload**: upsert=true
- **Delete piatti**: `deleteMenuPhoto`; **categorie Prenota**: `deleteMenuCategoryPhoto`

Il flusso admin in `MenuPricesTab`:
1. Prodotto: sceglie file → anteprima → al salvataggio upload → update `menu_items.image_url`
2. Categoria (Gestione categorie): stesso pattern → `menu_categories.image_url` — **non** scrive in `category_images` del pannello QR
3. Modale Menù QR: selezione categoria con foto in catalogo → anteprima da `menu_categories.image_url`; al **Salva** copia storage `booking-cat/` → `qr/{id|draft}/cat/` (`importCatalogCategoryImagesToQrStorage`) — **mai** aggiorna `menu_categories`

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
| `useSaveMenuQrSettings()` | Salvataggio unificato modale: QR + batch `menu_qrcode_categories` (un toast, errore atomico lato UI) |
| `useCreateMenuQrCode()` / `useUpdateMenuQrCode()` | CRUD singolo (legacy; modale usa `useSaveMenuQrSettings`) |
| `useDeleteMenuQrCode()` | Delete per id + toast |
| `useMenuQrcodeCategoriesForQr(menuQrCodeId)` | Override titoli/descrizioni per un QR (admin) |
| `usePublicMenuQrcodeCategories(menuQrCodeId)` | Lettura pubblica override **filtrata per QR** |
| `usePublicMenuQr(tenantId, shortCode)` | Risolve QR per short_code (usa `supabasePublic`) |
| `usePublicDefaultMenuQr(tenantId)` | Primo QR attivo del tenant (fallback per `/menu/:slug`) |

---

## 7. Componenti admin

| Componente | File |
|------------|------|
| `MenuQrManager` | `src/features/booking/components/MenuQrManager.tsx` — solo lista «I miei QR» (tab Aspetto homepage spostato in modale) |
| `MenuQrModal` | Titolo **«Impostazione Menù QR»**; link pubblico + copia; **Salva** su riga «Nome QR *» + fondo; checkbox categorie **solo con ≥1 ingrediente** (attiva/disattiva, **senza** riordino); sezione card «Titoli e descrizioni categorie» con **frecce Su/Giù** per ordine → persiste in `category_filter`; titoli/foto + picker ingredienti nascosti; **picker icone (12 Phosphor + 8 Lucide, griglia)** per categoria senza foto QR; **guard chiusura** (overlay/Esc/X) se draft dirty (`serializeMenuQrDraft` non ordina `categoryFilter`). Titoli/descrizioni card categoria **cappati** (30/70, `AdminFieldWithCharCount`, FU-MQR-1). I menù-evento staff (preset) restano solo in impostazioni Prenota: nel QR il concetto è stato rimosso (migrazione 043). Richiede migrazioni `036`+`037`+`042`+`043` su ogni ambiente Supabase collegato all’app deployata. |
| `MenuHomepageConfigPanel` | Sezioni controllate QR (`MenuQrCarouselSection`, `MenuQrCategoryCardsSection`, `MenuQrHiddenItemsPicker`, `MenuQrThemeSection`) — upload anche su **nuovo** QR via path `qr/draft/{shortCode}/` (migrazione a `qr/{id}/` al Salva). La logica upload condivisa sta in `src/features/booking/hooks/useCarouselPhotoUpload.ts`, non nel pannello QR. |

### Icone categoria senza foto (20 preset — 01-06-26)

File: `src/features/public-menu/categoryIcons.ts` · render: `MenuQrCategoryIconGlyph.tsx`

- **Admin:** **12 Phosphor** (`MENU_QR_PHOSPHOR_ICON_OPTIONS`) + **8 Lucide** (`MENU_QR_LUCIDE_ICON_OPTIONS`, riga «Altre icone») = **20** in `MENU_QR_CATEGORY_ICON_OPTIONS`. Picker in `MenuQrCategoryCardsSection`: griglie `grid-cols-4 sm:grid-cols-6` (Phosphor) e `sm:grid-cols-4` (Lucide); tap `h-10`; `aria-label` italiano; mai emoji.
- **Render:** `MenuQrCategoryIconGlyph` — Phosphor con `weight="regular"`, Lucide senza `weight` — admin + `PublicMenuPage` (tab + card).
- **Default senza foto:** `lucide_salad` (Insalata — Lucide) se nessun override DB e nessun mapping Phosphor per `category_key` — costante `MENU_QR_DEFAULT_CATEGORY_ICON_KEY` in `categoryIcons.ts` (FU-023).
- **Prefill draft:** `buildCategoryOverrideDrafts` — icona DB valida → quella; altrimenti mapping Phosphor o `lucide_salad`.
- **Salvataggio:** `menu_qrcode_categories.icon` = chiave snake_case (`fork_knife` … `lucide_tea`).
- **Phosphor (12):** `fork_knife`, `bowl_food`, `cooking_pot`, `flame`, `cake`, `martini`, `fish`, `steak` (glyph `Hamburger`), `leaf`, `coffee`, `beer`, `pizza_slice`.
- **Lucide (8):** `lucide_chef_hat`, `lucide_salad`, `lucide_shrimp`, `lucide_sandwich`, `lucide_croissant`, `lucide_ice_cream`, `lucide_cookie`, `lucide_tea` (glyph **`Milk`** — `Tea` assente in lucide-react del progetto). **Rimosse dal picker (01-06-26):** `lucide_soup`, `lucide_egg_fried` — se ancora in DB, fallback visivo → `cooking_pot` / `fork_knife`.

Il `MenuQrManager` è montato in `MenuPricesTab` quando `viewMode === 'qr_codes'` (pulsante "QR Code" nell'hero section, visibile solo se `features.qrMenu`).

---

## 8. Pagine pubbliche (mobile-first)

Tutte le pagine pubbliche menu sono **standalone** (non dentro AdminShell), nessun `max-w-7xl`.

| Route | Componente | File |
|-------|-----------|------|
| `/menu/:slug` | `PublicMenuPage` | `src/pages/PublicMenuPage.tsx` |
| `/menu/:slug/qr/:shortCode` | `PublicMenuPage` | idem |
| `/menu/:slug/qr/:shortCode/c/:categoryKey` | `PublicMenuCategoryPage` | `src/pages/PublicMenuCategoryPage.tsx` |

**Temi**: 5 palette in `src/features/public-menu/menuThemes.ts` (`mediterranean_teal`, `cream_sage`, `dark_gold`, `rustic_terracotta`, `green_wellness`). PNG sfondo in `public/menu-themes/`. Default: `mediterranean_teal`.

**Layout homepage `PublicMenuPage`** (post-sessione layout 24-05-26 + mobile 30-05-26):

1. **Sfondo pagina** — `useMenuPageBackgroundStyle()` in `PublicMenuPage.tsx`: solo `bodyImage` con `background-size: 100% auto` + `background-repeat: repeat-y` fin dal primo paint (niente switch JS single→layer multipli — evita flash in scroll). `bodyFallbackBg` riempie eventuali gap (es. terracotta `#9a3412`).
2. **Hero `<header>`** — nome ristorante da **`useRestaurantName()`** (`restaurant_settings.restaurant_name`, fallback `organizations_public.name`, poi «Menu») + fregio + `MenuCarousel` (nessuna label esterna “Specialità…”); badge solo dentro ogni slide. **`PublicMenuPageHeader` non usato** sulla homepage.
3. **Carosello** — slide full-bleed, overlay gradiente 40% sx, titolo/descrizione da `carousel_items`; pallini **cliccabili** (tap mobile 44px). Placeholder `h-28` se zero foto. Eyebrow slide **solo se compilato** in admin.
4. **Tab `MenuNavTabs`** — **solo pagina categoria**, `fixed bottom-0` (sempre visibile); homepage senza pill. Categoria corrente evidenziata; scroll `.scrollbar-hide`; frecce sx/dx da **700px** se overflow. File: `src/features/public-menu/MenuNavTabs.tsx`.
5. **Griglia categorie** — 1 col &lt;520 · **2 col ≥520** (stesso layout card a tutte le larghezze dentro `max-w-[1024px]`). **Con foto**: tile `aspect-[7/2]` (da 520 `5/2`), gradiente, titolo su immagine. **Senza foto**: riga ~**30%** icona su bianco + ~**70%** header PNG con titolo/chevron; descrizione opzionale **sotto il titolo nel 70%**. Mix foto: da 520px card senza foto `aspect-[5/2]` come le tile con foto. **Nessun** ramo thumb orizzontale da 1025px. **Mai emoji** (FU-023). Sfondo pagina: `useMenuPageBackgroundStyle()` full-bleed; contenuto centrato oltre 1024px.

> Dettaglio componenti: **`docs/Menu-QR-Skill/contesto/MENU_QR_LAYOUT_CONTEXT.md`**

**Limiti admin carosello** (`MenuQrCarouselSection`): campi con `AdminFieldWithCharCount` — **Etichetta** (eyebrow) max **40** (placeholder «Esempio: Specialità della casa», **nessun prefill**), **Titolo slide** max **60**, **Descrizione breve** max **125**; rimozione slide con `Modal` conferma. Pubblico: eyebrow **solo se compilato** in `carousel_items`; slide senza `image_url` escluse dal parse.

**Salvataggio modale QR:** dopo Salva, `MenuQrManager` mostra `Modal` in-app — modifica: «modifiche già visibili sullo stesso link/stampa QR»; nuovo QR: «nuovo codice/link».

**`PublicMenuCategoryPage`** — dettaglio categoria:
- Carica i piatti della categoria da `menu_items` via `supabasePublic`
- Risolve il QR con `usePublicMenuQr` e esclude gli ID in `hidden_menu_item_ids`
- **`isCategoryInQrFilter`**: se `categoryKey` non è in `category_filter` (o filtro `[]`), messaggio + link «Torna al menù QR» — non lista piatti
- **Layout FU-025 (01-06-26):** shell esterna `min-h-svh bg-stone-50` full viewport; wrapper interno `PUBLIC_MENU_CONTENT_MAX_WIDTH_CLASS` (`publicMenuLayout.ts`) avvolge **header sticky + main** — stessa colonna ~1024px centrata della homepage QR oltre 1024px; bande `stone-50` ai lati su desktop largo
- **Pill categorie** (`MenuNavTabs`) fisse in basso, sempre visibili; `PUBLIC_MENU_CATEGORY_MAIN_BOTTOM_PAD_CLASS` sul main così l’ultimo piatto non resta coperto; niente footer data/ora
- Header sticky: fascia PNG da `theme_key` del QR (`menuThemes.headerImage`); corpo lista `bg-stone-50` invariato (no `useMenuPageBackgroundStyle` sul body — fuori scope FU-019)
- `ItemCardWithPhoto`: immagine full-width `h-44` + testo sotto
- `ItemCardText`: solo testo (fallback quando `image_url` assente)

> **`PublicMenuPresetPage` rimosso (06-06-26).** I menù-evento via QR erano codice irraggiungibile;
> pagina, route e colonne DB sono stati rimossi (migrazione 043). Il preset resta vivo solo in Prenota.

---

## 9. Regole

```
RULE  Le pagine /menu/* usano SOLO supabasePublic — mai supabase autenticato
RULE  Il bucket menu-photos è pubblico — le URL sono stabili e cacheable
RULE  Non aggiungere cursor-pointer inline — usa la regola globale .is-clickable
RULE  Icone categorie QR: **20** chiavi picker (12 Phosphor + 8 Lucide `lucide_*`) in `categoryIcons.ts`; render con `MenuQrCategoryIconGlyph`; override DB → mapping Phosphor per `category_key` → default `lucide_salad`; chiavi Lucide rimosse → fallback Phosphor esplicito (`cooking_pot` / `fork_knife`); picker in `MenuQrCategoryCardsSection` — **mai emoji** in card/tab pubbliche
RULE  Menù-evento via QR (content_type/preset_ids/PublicMenuPresetPage) RIMOSSO (migrazione 043) — non reintrodurlo nel QR; il preset vive solo in Prenota
RULE  Card categoria QR: titolo cappato 30 (QR_CATEGORY_TITLE_MAX), descrizione 70 (QR_CATEGORY_DESCRIPTION_MAX) in MenuHomepageConfigPanel; titoli <h2> con line-clamp-2 difensivo per il fallback menu_categories.label senza cap
RULE  La pagina /menu/:slug senza short_code usa il QR default (primo is_active=true, sort_order ASC)
RULE  Se short_code non trovato → messaggio «Menù QR non trovato» (nessun redirect al menu default — evita di mostrare sempre il primo QR)
RULE  Lookup QR pubblico solo quando `tenantSlug` del context coincide con lo slug nell’URL (`tenantReady` in PublicMenuPage)
RULE  Testo sovrapposto su immagini carosello: gradiente linear-gradient(to right, rgba 0,0,0,0.55 0%, transparent 50%) — overlay 40% sx
RULE  Griglia categorie: 1 col &lt;520 · 2 col ≥520 — stesso layout card mobile/tablet/desktop (wrapper max 1024px)
RULE  Card categoria **con foto**: tile aspect + gradiente + titolo su immagine (tutte le larghezze)
RULE  Card categoria **senza foto**: flex 30% icona su bianco + 70% header PNG con titolo/chevron; descrizione (override QR o `menu_categories.description`) **sotto il titolo dentro il 70%**, mai fuori dalla card
RULE  Mix foto/no-foto: se almeno una categoria ha `category_images[key]`, da **520px** le card senza foto hanno `aspect-[5/2]` come le tile con foto
RULE  Homepage QR viewport &gt;1024px: wrapper `PUBLIC_MENU_CONTENT_MAX_WIDTH_CLASS` (`publicMenuLayout.ts`) — card non cambiano layout rispetto a tablet
RULE  PublicMenuCategoryPage viewport &gt;1024px: stesso wrapper FU-025 su header sticky + lista piatti; shell `bg-stone-50` full viewport; card ingredienti non si allargano oltre ~1024px
RULE  Titolo card categoria: legge prima menu_qrcode_categories.title, fallback menu_categories.label — mai hardcoded
RULE  Descrizione breve categoria: in `CategoryCard` solo nella fascia header 70% (sotto titolo), se valorizzata in `menu_qrcode_categories` o `menu_categories`
RULE  Carosello senza foto: placeholder trasparente h-28 — eyebrow slide solo se valorizzato in admin (no fallback «Specialità della casa»)
RULE  Pallini carosello: button cliccabili con goToSlide — non solo drag/scroll
RULE  Tab categorie: solo pagina categoria, `fixed bottom-0` + padding-bottom main (altezza barra + safe-area); homepage senza pill e senza footer data/ora
RULE  Sfondo pagina: useMenuPageBackgroundStyle() — `repeat-y` + `100% auto` fin dal primo paint; non layer JS multipli
RULE  Admin carosello QR: CAROUSEL_SLIDE_EYEBROW_MAX=40, TITLE_MAX=60, DESCRIPTION_MAX=125 in MenuHomepageConfigPanel. Prenota usa limiti separati 19/18/38 in bookingPublicFormConfig.
RULE  Nuovo QR: foto carosello/categorie in Storage `qr/draft/{shortCode}/` — migrate a `qr/{menuQrCodeId}/` in useSaveMenuQrSettings al primo insert
RULE  Modale QR: checkbox categorie = elenco completo `menu_categories` (tab Menu); disabilitate se senza ingredienti; al Salva obbligatori carosello (≥1 foto + etichetta + titolo), ≥1 categoria con ≥1 ingrediente visibile — vedi `menuQrValidation.ts`
RULE  Elimina menù QR: `Modal` conferma (non `window.confirm` al primo click icona)
RULE  Modale QR: `hidden_menu_item_ids` — occhio chiuso = UUID in array; al Salva si scartano ID di categorie deselezionate
RULE  PublicMenuCategoryPage: filtra `menu_items` con `hidden_menu_item_ids` del QR corrente
RULE  PublicMenuCategoryPage: `isCategoryInQrFilter(category_filter, categoryKey)` — legacy `null` = tutte; `[]` = nessuna; URL fuori filtro → messaggio + link homepage QR
RULE  PublicMenuCategoryPage header: PNG `theme_key` QR in fascia sticky (~56px); testo colore `headerTextColor`; corpo lista `bg-stone-50` — asset scroll FU-021
RULE  Admin carosello QR: `AdminFieldWithCharCount` (Etichetta/Titolo slide/Descrizione breve); `Modal` conferma elimina slide e foto categoria
RULE  Salva modale QR: `canSave` = nome + `isMenuQrSettingsValid` (carosello ≥1 slide completa, ≥1 cat con ingrediente visibile); ordine messaggio validazione: categorie → carosello
RULE  Comunicazioni utente admin: preferenza **Modal** (successo, elimina, conferme); toast validazione opzionale/backup se Salva già disattivato
RULE  Temi: getMenuTheme(key) da menuThemes.ts — 5 chiavi; chiavi sconosciute (es. wine_bistrot legacy) → fallback `mediterranean_teal`
RULE  PNG temi in public/menu-themes/ — tutti e 5 i temi hanno header+body PNG; homepage usa solo bodyImage (stesso asset mobile/desktop)
RULE  PublicMenuPageHeader NON usato sulla homepage QR
RULE  Foto categorie: upload su Supabase menu-photos — modifiche admin non passano da Git
```
