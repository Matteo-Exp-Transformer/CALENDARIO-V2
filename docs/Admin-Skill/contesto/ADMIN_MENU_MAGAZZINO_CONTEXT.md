# ADMIN — Menu Magazzino Context

> Il tab Menu e il magazzino/listino unico del tenant. Alimenta sia Pagina Prenota sia Menu QR,
> ma non coincide con nessuna delle due viste pubbliche.

## 1. Scopo

Gestisce:

- categorie menu;
- ingredienti/prodotti/piatti;
- prezzi e descrizioni;
- foto piatto;
- foto categoria Prenota;
- preset staff per Prenota;
- QR menu e impostazioni per-QR.

## 2. Componenti e hook

- `MenuPricesTab` e toolbar `MenuPricesHeroToolbar`.
- `useMenuItems`, `useMenuCategories`.
- `PresetMenuBuilder`.
- `MenuQrManager`, `MenuQrModal`, `useMenuQrCodes`, `useMenuQrcodeCategories`.
- Servizi sync: `syncMenuCategoryKeyRename`, `syncMenuCategoryKeyDelete`.

## 3. Tabelle e storage

| Oggetto | Storage |
|---|---|
| Categorie | `menu_categories` |
| Ingredienti/piatti | `menu_items` |
| Preset staff | `restaurant_settings.booking_custom_staff_presets` |
| QR | `menu_qr_codes`, `menu_qrcode_categories` |
| Foto piatto | bucket `menu-photos`, path `{tenantId}/{menuItemId}.webp` |
| Foto categoria Prenota | `{tenantId}/booking-cat/{categoryId}.webp` |
| Foto categoria QR | `{tenantId}/qr/{qrId|draft}/cat/{categoryKey}.webp` |

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

Delete categoria:

1. elimina ingredienti della categoria;
2. elimina categoria;
3. sincronizza QR/Form/foto.

Questi flussi non sono una transazione unica tra tutte le risorse. Sono da considerare critici in
test futuri.

## 6. Vincoli

- `features.qrMenu` decide se mostrare area QR.
- `category_filter=null` nel QR significa legacy "tutte"; `[]` significa nessuna.
- Delete categoria invalida anche le viste pubbliche collegate.
- Delete QR invalida link gia stampati.
- Modificare preset non deve sovrascrivere personalizzazioni gia salvate nella vetrina Prenota.

## 7. Rischi aperti

- `useMenuCategories` ritorna `[]` se la tabella non esiste: utile legacy, ma puo mascherare un errore.
- Nome/descrizione ingredienti e categorie magazzino sono ancora aree da cappare secondo debiti Prenota.
- Sync rename/delete parziale puo lasciare dati incoerenti.

## 8. Rimandi

- Pagina Prenota: `../Prenota-Skill/PRENOTA_SKILL.md`.
- Menu QR: `../Menu-QR-Skill/MENU_QR_SKILL.md`.
- Vecchio context tecnico: `../per-ui-design-skill/MENU_ADMIN_CONTEXT.md`.
