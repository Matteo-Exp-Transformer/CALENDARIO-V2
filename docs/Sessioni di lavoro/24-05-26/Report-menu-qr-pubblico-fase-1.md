# Report — Menu Digitale Pubblico via QR Code (Fase 1)

**Data**: 24-05-26  
**Branch**: `Sviluppo-Dashboard-laterale`  
**Commit**: `e039bbc`  
**Migrazione**: `030_menu_qr_and_photos.sql` (applicata su DB test `docnnernvp`)

---

## Cosa è stato fatto

### DB (Migrazione 030)
- Aggiunto `image_url TEXT NULL` su `menu_items` — ora ogni piatto può avere una foto
- Creato bucket Storage `menu-photos` (pubblico, 500KB max, solo webp/jpeg/png/avif) — le foto sono servite direttamente senza autenticazione
- Creata tabella `menu_qr_codes` — ogni QR ha un `short_code` univoco, un tipo contenuto (carta / menù eventi / entrambi), e filtri opzionali per categorie e preset
- Aggiunto `qr_menu_enabled BOOLEAN DEFAULT false` su `organizations` — permette di attivare il menu QR per i clienti Classic che pagano il sovrapprezzo
- Ricreata la view `organizations_public` includendo `qr_menu_enabled` (drop cascade → create → recreate policies)
- Aggiunte policy RLS anon per lettura pubblica di `menu_items` e `menu_categories` + `GRANT SELECT TO anon` su `menu_categories`

### Feature flag `qrMenu`
- Aggiunto `qrMenu: boolean` in `FeatureFlags` (automaticamente true per Pro/Enterprise, false di default per Classic)
- `TenantContext` ora legge `qr_menu_enabled` dalla view `organizations_public` durante la risoluzione dello slug
- `useFeatures` passa `qrMenuEnabled` a `buildFeatures`

### Admin — Foto piatti
- `menuPhotoUpload.ts`: compressione canvas (max 1200px, qualità iterativa da 0.82 a 0.4, target 450KB), upload con upsert nel bucket, path `{tenantId}/{itemId}.webp`
- In `MenuPricesTab`: anteprima foto durante editing, pulsante rimozione foto, upload automatico al salvataggio

### Admin — Gestione QR
- `MenuQrManager`: lista QR code con canvas preview, pulsanti copia link / download PNG / modifica / elimina
- `MenuQrModal`: form crea/modifica QR — nome, tipo contenuto (radio), filtri categoria e preset (checkbox multi-select), preview URL quando in editing
- `shortCodeGenerator.ts`: 7 caratteri, alfabeto senza ambiguità (no 0/O/1/l)
- Pulsante "QR Code" nell'hero section di `MenuPricesTab`, visibile solo se `features.qrMenu`

### Pagine pubbliche (mobile-first)
Tre pagine standalone, tema amber, nessuna admin shell:

- **`PublicMenuPage`** (`/menu/:slug` e `/menu/:slug/qr/:shortCode`): risolve QR per short_code, mostra categorie alla carta e/o menù eventi in base al tipo del QR; emoji per le categorie standard; gestisce fallback a QR default e redirect se short_code non trovato
- **`PublicMenuCategoryPage`** (`/c/:categoryKey`): lista piatti di una categoria, card con foto (`h-44 w-full object-cover`) o card testuale, back button all'homepage menu
- **`PublicMenuPresetPage`** (`/preset/:presetId`): dettaglio menù evento con lista numerata preservando l'ordine `item_ids`, back button

### Router
Aggiunte 5 rotte in `router.tsx` prima del catch-all (più specifiche prima delle meno specifiche).

### Tipi
Aggiornato manualmente `src/types/database.ts` con `menu_qr_codes`, `image_url` su `menu_items`, `qr_menu_enabled` su `organizations` e `organizations_public`.

---

## Domande poste all'utente e risposte

**D**: Come gestire il flag qrMenu tra edition Classic e Pro/Enterprise?  
**R**: Pro e superiori sempre attivo; Classic di default no, ma lo posso abilitare per singolo cliente che paga sovrapprezzo (campo `qr_menu_enabled` su DB).

**D**: Su quale branch lavorare?  
**R**: `Sviluppo-Dashboard-laterale` (esiste già).

**Richiesta aggiunta**: "assicurati che abbia responsive design allineato a skill system poichè verrà usata sopratutto da mobile la pagina" → pagine costruite mobile-first, nessun `max-w-7xl`, sticky header amber, card full-width.

---

## Test eseguiti

`npm run validate` — **137/137 test passati**, lint OK, typecheck OK.

Corretto nel corso della sessione:
- `cannot drop view ... CASCADE` nella migrazione → fix con `DROP VIEW IF EXISTS ... CASCADE` prima di ricreare
- Import `React` non necessario in 4 file → rimosso
- `deleteMenuPhoto` importato ma non usato in `MenuPricesTab` → rimosso dall'import
- `eslint-disable` inutilizzato in `MenuQrManager` → sostituito con `void renderQrCanvas()`
- Tipi `any` in `PublicMenuPage` → rimossi con tipi concreti
- `qrMenu` mancante negli oggetti mock dei test `DetailsTab.placement.test.tsx` → aggiunto
- Quote tipografiche (U+2018/U+2019) in `menu.ts` → corrette con script Node
- `database.ts` non aggiornato (la `db:types:linked` punta a produzione) → tipi aggiornati manualmente con output da `Supabase_test__generate_typescript_types`

---

## Per la prossima sessione

- **Fase 2 possibile**: tavolo con QR dedicato (route `/t/:tableNumber`), prenotazione diretta dalla pagina menu, notifiche push al waiter
- Upload foto da mobile (camera API)
- Preview QR nella pagina admin con canvas QR scaricabile come PNG (già implementato, da testare visivamente)
- Verifica RLS in produzione quando si applicherà la migrazione 030 su prod
