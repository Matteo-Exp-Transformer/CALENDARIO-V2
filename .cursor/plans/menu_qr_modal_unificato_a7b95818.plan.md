---
name: Menu QR modal unificato
overview: "Refactor del modale \"Impostazione Menù QR\": UX categorie esplicita, form unico con doppio pulsante Salva, sezioni riordinate; aspetto visivo per ogni menu_qr_codes (DB + pagina pubblica + storage)."
todos:
  - id: migration-036
    content: "Scrivere e applicare migrazione 036: colonne aspetto su menu_qr_codes, menu_qr_code_id su menu_qrcode_categories, copy dati legacy"
    status: completed
  - id: types-hooks
    content: Aggiornare types/menu.ts, database.ts, useMenuQrCodes, useMenuQrcodeCategories; public read da record QR
    status: completed
  - id: storage-paths
    content: Path upload foto per qr/{menuQrCodeId}/; gestire create QR prima degli upload
    status: completed
  - id: modal-unified
    content: "Refactor MenuQrModal: checkbox categorie, titolo, ordine sezioni, sezione unificata con testi richiesti, tema in fondo"
    status: completed
  - id: save-orchestration
    content: Salvataggio unico (QR + overrides batch), doppio pulsante Salva, rimuovere save intermedi
    status: completed
  - id: public-filter
    content: "PublicMenuPage: category_filter null vs [] e aspetto da qr"
    status: completed
  - id: docs-skills
    content: Aggiornare PUBLIC_MENU_SKILL, DATABASE.md, DB_MIGRATIONS/SCHEMA context
    status: completed
isProject: false
---

# Piano: Modale Impostazione Menù QR unificato (per-QR) — COMPLETATO

## Migliorie integrate (review pre-implementazione)

### 1.1 Migrazione SQL — ordine operazioni

1. Colonne su `menu_qr_codes` + copy da `menu_homepage_config`
2. `menu_qr_code_id` nullable su `menu_qrcode_categories`
3. **DROP** `UNIQUE(tenant_id, category_key)` prima del backfill
4. Backup in temp table → `DELETE` righe legacy → `INSERT` cross join (override × QR tenant)
5. `NOT NULL` + `UNIQUE(menu_qr_code_id, category_key)` + index
6. RLS admin/public con `EXISTS` join su `menu_qr_codes`

### 1.2 Lettura pubblica (bloccante)

`usePublicMenuQrcodeCategories(menuQrCodeId)` — filtro `.eq('menu_qr_code_id', …)`. `PublicMenuPage` legge tema/carosello/foto da `qr`, non da `menu_homepage_config`.

### 1.3 Salvataggio atomico UI

`useSaveMenuQrSettings`: update/insert QR poi batch upsert override; un solo toast; modale chiusa solo su successo (nessun salvataggio parziale silenzioso).

### 1.4 Deprecazione `menu_homepage_config`

Nessun fallback runtime: dopo migrazione i dati vivono su `menu_qr_codes`. Tabella legacy non scritta dall'admin.

### 1.5 Upload nuovo QR

Foto carosello/categorie disabilitate finché non esiste `menuQrCodeId` (primo Salva); messaggio amber in UI.

### 1.6 Preset eventi

Comportamento «vuoto = tutti» invariato (solo categorie allineate a array esplicito).

---

## Validazione eseguita

- `npm run validate` — OK (137 test)
- Migrazione `036_menu_qr_per_qr_appearance` applicata su **TEST** (`docnnernvp`)

## Test manuale consigliato

- Due QR con temi diversi → scan mostra aspetti distinti
- Attiva tutte / deseleziona una / Salva / riapri
- QR legacy `category_filter null` → tutte le categorie fino a risalvataggio
- Nuovo QR con zero categorie → homepage senza card
