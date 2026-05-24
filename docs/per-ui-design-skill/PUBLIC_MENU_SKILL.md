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

## 3. DB — Migrazione 030

| Cosa | Dettaglio |
|------|-----------|
| `menu_items.image_url` | `TEXT NULL` — URL pubblico foto piatto |
| `menu_qr_codes` | tabella con `short_code UNIQUE`, `content_type`, `category_filter`, `preset_ids`, `is_active`, `sort_order` |
| `organizations.qr_menu_enabled` | `BOOLEAN DEFAULT false` — override Classic |
| `organizations_public` view | include `qr_menu_enabled` |
| Storage bucket `menu-photos` | public=true, 500KB, webp/jpeg/png/avif |
| RLS `menu_qr_codes` | admin CRUD per proprio tenant; anon legge solo `is_active=true` |
| RLS `menu_items` public read | policy `public_read_menu_items` per ruolo anon |
| RLS `menu_categories` public read | policy `public_read_menu_categories` + `GRANT SELECT TO anon` |

---

## 4. Storage foto piatti

File: `src/lib/menuPhotoUpload.ts`

- **Path**: `{tenantId}/{menuItemId}.webp` nel bucket `menu-photos`
- **Compressione**: canvas resize max 1200px, iterativa da quality 0.82 a 0.4, target 450KB
- **Upload**: upsert=true (sovrascrive se già esiste per quell'item)
- **Delete**: `deleteMenuPhoto(tenantId, itemId)` — non-throwing

Il flusso admin in `MenuPricesTab`:
1. Utente sceglie file → anteprima immediata via `URL.createObjectURL`
2. Al salvataggio prodotto: upload foto → poi update `image_url` sull'item

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
| `MenuQrManager` | `src/features/booking/components/MenuQrManager.tsx` — lista QR, canvas preview, copia link, download PNG, edit/delete |
| `MenuQrModal` | `src/features/booking/components/MenuQrModal.tsx` — form crea/modifica QR: nome, tipo contenuto, filtri categoria/preset |

Il `MenuQrManager` è montato in `MenuPricesTab` quando `viewMode === 'qr_codes'` (pulsante "QR Code" nell'hero section, visibile solo se `features.qrMenu`).

---

## 8. Pagine pubbliche (mobile-first)

Tutte le pagine pubbliche menu sono **standalone** (non dentro AdminShell), tema amber, nessun `max-w-7xl`.

| Route | Componente | File |
|-------|-----------|------|
| `/menu/:slug` | `PublicMenuPage` | `src/pages/PublicMenuPage.tsx` |
| `/menu/:slug/qr/:shortCode` | `PublicMenuPage` | idem |
| `/menu/:slug/qr/:shortCode/c/:categoryKey` | `PublicMenuCategoryPage` | `src/pages/PublicMenuCategoryPage.tsx` |
| `/menu/:slug/qr/:shortCode/preset/:presetId` | `PublicMenuPresetPage` | `src/pages/PublicMenuPresetPage.tsx` |

**Tema**: `bg-amber-50` body, `bg-amber-400` sticky header, card `rounded-2xl bg-white shadow-sm`, testo `text-amber-700` per prezzi/accenti.

**Header homepage** (`PublicMenuPageHeader`): logo app a sinistra (`icons/icon-192-v2.png`) + nome ristorante; hook `usePublicMenuViewport` su tutte le pagine menu per tenere stabile la barra URL su Chrome Android (`interactive-widget=resizes-content`, `min-h-svh`).

**`PublicMenuPage`** — homepage menu:
- Risolve tenant da slug via `setTenantFromSlug`
- Carica il QR tramite `short_code` o il QR default se no short_code
- Mostra categorie alla carta (`CategoryRow` con emoji + chevron) e/o preset evento (`PresetCard`) in base al `content_type` del QR
- Se `content_type === 'mixed'` mostra entrambe le sezioni con intestazione

**`PublicMenuCategoryPage`** — dettaglio categoria:
- Carica i piatti della categoria da `menu_items` via `supabasePublic`
- `ItemCardWithPhoto`: immagine full-width `h-44` + testo (quando `image_url` presente)
- `ItemCardText`: solo testo (fallback)

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
RULE  content_type valori: 'a_la_carte' | 'preset_menus' | 'mixed' — non aggiungere altri
RULE  La pagina /menu/:slug senza short_code usa il QR default (primo is_active=true, sort_order ASC)
RULE  Se short_code specifico non trovato → redirect a /menu/:slug (useEffect in PublicMenuPage)
```
