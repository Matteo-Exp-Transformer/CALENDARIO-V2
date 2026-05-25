---
name: report-menu-qr-modale-unificato-per-qr
date: 25-05-26
plan: .cursor/plans/menu_qr_modal_unificato_a7b95818.plan.md
---

# Report sessione — Modale Menù QR unificato e aspetto per singolo QR

## Obiettivo

Portare le impostazioni visive del menu digitale (tema, carosello, foto card categorie, titoli/descrizioni card) da **una config condivisa per ristorante** a **configurazione per ogni QR**, con modale admin unificato, doppio pulsante Salva e semantica esplicita del filtro categorie.

## Contesto iniziale (problema)

- **Dove nell’app (admin):** Tab Menu → pulsante QR Code → lista QR → modale crea/modifica.
- **Effetto per il ristoratore:** tutti i QR del locale mostravano lo stesso aspetto homepage; salvare il QR «Tavoli» poteva cambiare anche ciò che vedevano i clienti del QR «Eventi».
- **Storage legacy:** `menu_homepage_config` (1 riga per `tenant_id`) + `menu_qrcode_categories` con `UNIQUE(tenant_id, category_key)`.
- **Componenti:** `MenuQrModal.tsx` salvava solo nome/filtri; `MenuHomepageConfigPanel.tsx` salvava aspetto a parte con toast separati.

## Lavoro svolto (ordine cronologico)

### 1. Review del plan e migliorie

Analisi allineamento a `APP_CONTEXT_SKILL` / `PUBLIC_MENU_SKILL`. Integrate nel plan: ordine SQL migrazione (drop unique → backup → reinserimento), RLS con join su `menu_qr_codes`, lettura pubblica obbligatoria per `menu_qr_code_id`, salvataggio unico senza chiusura modale su errore, niente fallback runtime su `menu_homepage_config`, upload foto solo dopo primo Salva (serve `id` QR).

### 2. Migrazione database `036_menu_qr_per_qr_appearance.sql`

**Applicata su server TEST** (`docnnernvp`) via MCP `apply_migration`.

| Tabella | Modifica |
|---------|----------|
| `menu_qr_codes` | + `theme_key`, `carousel_items` (JSONB), `category_images` (JSONB); copy da `menu_homepage_config` per ogni QR del tenant |
| `menu_qrcode_categories` | + `menu_qr_code_id` FK → `menu_qr_codes`; `UNIQUE(menu_qr_code_id, category_key)`; righe legacy duplicate su tutti i QR del tenant |
| RLS | Policy admin/public ricalcolate con `EXISTS` su `menu_qr_codes` |

`menu_homepage_config`: **deprecata** — non più scritta dall’admin; dati storici restano in tabella.

### 3. Tipi e hook

| File | Ruolo |
|------|--------|
| `src/types/menu.ts` | `MenuQrCode` esteso con aspetto; `MenuQrSettingsSavePayload`; override con `menu_qr_code_id` |
| `src/types/database.ts` | Allineato manualmente alle colonne 036 (CLI `db:types:linked` non ancora su test remoto) |
| `src/features/booking/utils/menuQrAppearance.ts` | Parse JSONB `carousel_items` / `category_images` da righe QR |
| `useMenuQrCodes.ts` | `parseMenuQrCodeRow`; **`useSaveMenuQrSettings`** (insert/update QR + batch upsert override, un toast) |
| `useMenuQrcodeCategories.ts` | `useMenuQrcodeCategoriesForQr`, `usePublicMenuQrcodeCategories(menuQrCodeId)`, batch upsert |

### 4. UI admin — modale unificato

**Dove:** Tab Menu → QR Code → «Nuovo QR» / modifica riga.

**Effetto per il ristoratore:**

- Titolo modale: **«Impostazione Menù QR»**.
- **Salva** in alto e in basso (stessa azione).
- Sezione **«Categorie di prodotti visibili»** con «Attiva tutte»; niente più «nessuna selezione = tutte».
- Carosello, poi **titoli + foto categorie** in un’unica sezione, tema in fondo.
- Primo salvataggio di un QR nuovo: messaggio che le foto si caricano **dopo** il primo Salva.

**Componenti:** `MenuQrModal.tsx`, `MenuQrManager.tsx` (solo `useSaveMenuQrSettings`), `MenuHomepageConfigPanel.tsx` → sezioni controllate esportate (`MenuQrCarouselSection`, `MenuQrCategoryCardsSection`, `MenuQrThemeSection`).

**Path Storage nuovi** (bucket `menu-photos`):

- `{tenantId}/qr/{menuQrCodeId}/cat/{categoryKey}.webp`
- `{tenantId}/qr/{menuQrCodeId}/carousel/{uuid}.webp`

URL con path vecchio restano valide finché non si ricarica.

### 5. Pagina pubblica cliente

**Dove:** `/menu/:slug/qr/:shortCode` (telefono dopo scansione).

**Effetto:** tema, carosello, thumb e override titoli letti dal **record QR** scansionato, non più da config tenant.

**File:** `PublicMenuPage.tsx`

**`category_filter`:**

| Valore DB | Homepage categorie |
|-----------|-------------------|
| `null` | Tutte (legacy, fino a risalvataggio) |
| `[]` | Nessuna card |
| `[chiavi…]` | Solo quelle chiavi |

### 6. Documentazione skill

- `docs/per-ui-design-skill/PUBLIC_MENU_SKILL.md` — modello per-QR, hook, modale, path storage
- `docs/DATABASE.md` — riga migrazione 036 TEST ✅
- `.cursor/plans/menu_qr_modal_unificato_a7b95818.plan.md` — segnato completato

## Domande utente e risposte

| Domanda / richiesta | Esito |
|---------------------|--------|
| Review plan vs skill system | Plan approvato con migliorie; poi esecuzione |
| Correggi plan ed esegui | Implementazione completa + validate |
| Report fine sessione + commit push | Questo report |

## Test eseguiti

```
npm run validate
```

- lint: 0 warning
- typecheck: 0 errori
- test: **137/137** passati

**Test manuale consigliato (non eseguito in CI):**

1. Due QR con temi diversi → scan mostra aspetti distinti
2. Attiva tutte / deseleziona una categoria / Salva / riapri modale
3. QR legacy `category_filter null` → tutte le categorie fino a risalvataggio
4. Nuovo QR con zero categorie → homepage senza card

## Rischi / note operative

- **Produzione:** migrazione 036 **non** applicata su prod — solo TEST. Prima del deploy prod: `apply_migration` su `rwuxgvld` + rigenerare tipi.
- **Primo deploy:** tutti i QR copiano la vecchia config identica; differenze solo dopo edit manuale per QR.
- **Foto legacy:** path `{tenantId}/cat/…` ancora validi nelle URL JSON finché non si ricarica.

## Cosa resta per la prossima sessione

- Test manuale admin + scan due QR
- Applicare `036` su produzione quando si fa rollout menu QR
- (Opzionale) cleanup blob storage path vecchi
- Plan `flusso_dati_menu_72f8fea8` resta separato (grouping catalogo Prenota, non in questo commit)

## File toccati (riepilogo)

**Nuovi:** `supabase/migrations/036_menu_qr_per_qr_appearance.sql`, `src/features/booking/utils/menuQrAppearance.ts`, report questa sessione.

**Modificati:** `MenuQrModal.tsx`, `MenuQrManager.tsx`, `MenuHomepageConfigPanel.tsx`, `useMenuQrCodes.ts`, `useMenuQrcodeCategories.ts`, `PublicMenuPage.tsx`, `menu.ts`, `database.ts`, `PUBLIC_MENU_SKILL.md`, `DATABASE.md`, plan menu QR.

**LOCK rispettati:** `Modal.tsx` non modificato strutturalmente; nessun file admin classica LOCK toccato.
