# Report — Mappatura Menu QR Admin ↔ Pubblico (Fase 1)

**Data:** 29-05-26  
**Modalità:** deep · **Profilo:** Verifica (APP_CONTEXT §0.0)  
**Stato:** Ciclo Menu QR ✅ chiuso (F1→F4, 30-05-26) — **F4 Approva con riserve**

- **Cosa è stato fatto:** mappa 38 coppie; revisione F2; fix F3; merge `main`; revisione F4 su `dd315a3`.
- **Cosa resta:** INC-03/06/15; FU-017…021; **FU-022** ricreare QR test su TEST.
- **Serve una tua azione:** no per chiusura ciclo.

**Report revisione (fonte):** [Report-revisione-mappatura-menu-qr-admin-pubblico-29-05-26.md](Report-revisione-mappatura-menu-qr-admin-pubblico-29-05-26.md) — § «Revisione indipendente — 2° passaggio»

**Context agenti:** [`PUBLIC_MENU_DATA_FLOW_CONTEXT.md`](../../per-ui-design-skill/PUBLIC_MENU_DATA_FLOW_CONTEXT.md)

---

## Tipo sessione

| Campo | Valore |
|-------|--------|
| **Fase ciclo** | 1 — solo mappatura documentale (zero modifica `src/`) |
| **Area** | Admin → Tab Menu → QR Code → modale «Impostazione Menù QR» ↔ pagine `/menu/:slug/qr/:shortCode` |
| **Storage** | `menu_qr_codes`, `menu_qrcode_categories`, `menu_categories`, `menu_items`, `restaurant_settings.booking_custom_staff_presets`, Storage `menu-photos` |
| **Ambiente query** | TEST `docnnernvp` · tenant campione `test-pro` (`2deb4d6e-ff8c-462a-92da-5a6d731a9dee`) · QR `5f9n79b` |
| **Template ciclo** | [Report unificato BookingRequestCard](Report-unificato-ciclo-booking-request-card-29-05-26.md) |

---

## Prompt Matteo (annotato)

**Prompt sostanziale (verbatim / parafrasi fedele):**

> Sei esecutore APP_CONTEXT. Modalità deep, profilo Verifica — SOLO mappatura flusso dati (nessun fix codice). Mappare end-to-end Admin → Tab Menu → QR Code (modale «Impostazione Menù QR») e cliente su `/menu/:slug/qr/:shortCode`. Tabella coppie admin ↔ pubblico ≥25 righe; query SQL verificate su TEST; file context persistente; incoerenze senza fix. Replicare ciclo BookingRequestCard 29-05-26.

**Correzioni scope impliciti nel prompt:**

1. **Solo Fase 1** — revisore → fix → revisione fix in sessioni successive.
2. **Fuori scope:** fix codice, migrazioni prod, email, Pagina Prenota (solo lettura preset condivisi).
3. **Query:** verificare su TEST prima dell’uso; GUIDA generica incompleta su `menu_qr_*` → non usarla come fonte.
4. **Chiusura:** report + context ora; SESSION_LOG §7 completo solo dopo «fai report finale» da Matteo.

---

## Dati comunicazione (per Matteo)

| Dove nell’app | Effetto ristoratore | Componente | Storage |
|---------------|---------------------|------------|---------|
| **Admin → Menu → QR Code** | Crea/modifica un menù digitale per tavolo: nome interno, categorie visibili, tema, carosello specialità, foto e testi card, piatti nascosti | `MenuQrManager` → `MenuQrModal` + sezioni `MenuHomepageConfigPanel` | **`menu_qr_codes`** + **`menu_qrcode_categories`** + bucket **`menu-photos`** |
| **Telefono cliente — homepage QR** | Vede nome locale, slide specialità, tab categorie, griglia card, data/ora in fondo, sfondo a tema | `PublicMenuPage` | QR row + `organizations_public.name` + override categorie |
| **Telefono — tap categoria** | Lista piatti con foto (se caricate in tab Menu) o solo testo; piatti «occhio chiuso» assenti | `PublicMenuCategoryPage` | **`menu_items`** filtrati da **`hidden_menu_item_ids`** |
| **Telefono — tap menù evento** | Lista numerata piatti del preset staff (stesso elenco usato in Pagina Prenota) | `PublicMenuPresetPage` | **`restaurant_settings.booking_custom_staff_presets`** + **`menu_items`** |
| **Tab Menu — ingredienti** | CRUD piatti/prezzi/foto piatto (condiviso con Prenota e QR) | `MenuPricesTab` | **`menu_items`** |
| **Tab Menu — menù preselezionati** | Crea preset staff; homepage QR li legge se `content_type` lo prevede (oggi **senza UI** nel modale QR) | sezione preset in `MenuPricesTab` | **`booking_custom_staff_presets`** |

---

## Metodo agente (Fase 1)

1. Letti `APP_CONTEXT_SKILL.md` §0.0, §4, §7; `PUBLIC_MENU_SKILL.md`; `PUBLIC_MENU_LAYOUT_CONTEXT.md`; report layout 24-05-26 e ciclo BookingRequestCard 29-05-26.
2. Tracciati hub admin: `MenuQrModal`, `MenuHomepageConfigPanel`, `useSaveMenuQrSettings`, `MenuQrManager`.
3. Tracciati hub pubblico: `PublicMenuPage`, `PublicMenuCategoryPage`, `PublicMenuPresetPage`, hook `usePublicMenuQr`, `usePublicMenuQrcodeCategories`, `menuQrAppearance.ts`.
4. Per ogni coppia: campo UI admin → colonna/JSON DB → componente pubblico → fallback → esito OK / parziale / KO.
5. Query Q1–Q5 eseguite via MCP su TEST `docnnernvp` (verificato project ref).
6. Nessun `npm run validate` né QA browser (non richiesti in Fase 1 mappa).

---

## Flusso dati (sintesi)

```
MenuPricesTab (viewMode qr_codes, features.qrMenu)
  └─ MenuQrManager → MenuQrModal
       ├─ Salva → useSaveMenuQrSettings
       │    ├─ menu_qr_codes (theme, carousel, category_images, category_filter, hidden_menu_item_ids, …)
       │    ├─ menu_qrcode_categories (title/description override per categoria selezionata)
       │    └─ migrate Storage qr/draft/{shortCode}/ → qr/{id}/ (primo insert)
       └─ Foto → bucket menu-photos

Cliente /menu/:slug/qr/:shortCode
  └─ TenantContext (organizations_public) + usePublicMenuQr
       └─ PublicMenuPage (tema, carosello, tab, griglia)
            ├─ /c/:categoryKey → PublicMenuCategoryPage (menu_items − hidden)
            └─ /preset/:id → PublicMenuPresetPage (preset staff + menu_items by id)
```

**Invariante client:** pagine `/menu/*` usano **solo `supabasePublic`**.

**Post-migrazione 036:** aspetto homepage **per QR** su `menu_qr_codes`; `menu_homepage_config` deprecata (non più scritta). **`usePublicMenuHomepageConfig` non esiste.**

---

## Query verificate (TEST `docnnernvp`)

| ID | Scopo | Esito | Evidenza |
|----|-------|-------|----------|
| **Q1** | Tenant slug/id | **OK** | `test-pro` → `2deb4d6e-ff8c-462a-92da-5a6d731a9dee`, edition `pro` |
| **Q2** | `menu_qr_codes` per tenant | **OK** | 1 QR attivo `5f9n79b`: `a_la_carte`, 5 categorie filtrate, `theme_key=mediterranean_teal`, 3 slide carosello, 5 thumb categorie, 2 hidden item |
| **Q3** | `menu_qrcode_categories` | **OK** | 6 override per QR `8adfa37a…`; duplicato legacy `primi` + `primi_piatti` |
| **Q4** | `booking_custom_staff_presets` | **OK** | 2 preset su test-pro |
| **Q5** | Schema post-036/037 | **OK** | Colonne `theme_key`, `carousel_items`, `category_images`, `hidden_menu_item_ids`, `menu_qrcode_categories.menu_qr_code_id` NOT NULL; CHECK `theme_key` = 4 temi (no `wine_bistrot`) |

### SQL pronti all’uso (sostituire `<tenant_id>`, `<qr_id>`)

```sql
-- Q1 — Tenant da slug
SELECT id, name, slug, edition
FROM organizations
WHERE slug = 'test-pro';

-- Q2 — QR del tenant
SELECT id, short_code, name, content_type, category_filter, preset_ids,
       is_active, sort_order, theme_key,
       carousel_items, category_images, hidden_menu_item_ids
FROM menu_qr_codes
WHERE tenant_id = '<tenant_id>'
ORDER BY sort_order, created_at;

-- Q3 — Override card categorie per QR
SELECT category_key, title, description, menu_qr_code_id
FROM menu_qrcode_categories
WHERE menu_qr_code_id = '<qr_id>'
ORDER BY category_key;

-- Q4 — Preset staff (condivisi con Pagina Prenota)
SELECT setting_value
FROM restaurant_settings
WHERE tenant_id = '<tenant_id>'
  AND setting_key = 'booking_custom_staff_presets';

-- Q5 — Allineamento schema
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('menu_qr_codes', 'menu_qrcode_categories')
ORDER BY table_name, ordinal_position;

-- Q5b — CHECK theme_key (post-037)
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'public.menu_qr_codes'::regclass AND contype = 'c';
```

**Nota GUIDA:** [`GUIDA_USO_QUERIES_CONTROVERIFICA.md`](../../_lavoro/Per%20matteo/GUIDA_USO_QUERIES_CONTROVERIFICA.md) **non contiene** sezione Menu QR → debito **FU-017**.

---

## Tabella mappature (38 coppie)

| Coppia | Admin (UI + componente) | Colonna/JSON DB | Pubblico (UI + componente) | Fallback | Esito | Nota vocabolario |
|--------|-------------------------|-----------------|----------------------------|----------|-------|------------------|
| Nome QR (interno) | `MenuQrModal` input «Nome QR *» max 80 | `menu_qr_codes.name` | **Non mostrato** al cliente | — | **parziale** | INC-02; nome solo admin |
| Link pubblico | `MenuQrModal` header URL + `MenuQrManager` Copia | `short_code` + slug tenant | Route `/menu/:slug/qr/:code` | — | **OK** | — |
| Scarica PNG QR | `MenuQrManager` `QrRow` | — (da URL) | — | — | **OK** | admin-only |
| Tema homepage | `MenuQrThemeSection` radio 4 temi | `menu_qr_codes.theme_key` | `PublicMenuPage` → `getMenuTheme` (sfondo, tab, carosello) | `mediterranean_teal` | **OK** | solo homepage |
| Foto slide carosello | `MenuQrCarouselSection` upload | `carousel_items[].image_url` + Storage `qr/.../carousel/` | `MenuCarousel` slide | placeholder `h-28` | **OK** | parse scarta slide senza URL |
| Etichetta slide (eyebrow) | input max 40 | `carousel_items[].eyebrow` | badge in `MenuCarousel` | «Specialità della casa» | **OK** | — |
| Titolo slide | input max 60 + contatore | `carousel_items[].title` | overlay `MenuCarousel` | nascosto se vuoto; legacy `label` | **OK** | — |
| Testo breve slide | textarea max 125 + contatore | `carousel_items[].description` | overlay `MenuCarousel` | nascosto se vuoto | **OK** | — |
| Ordine slide | frecce su/giù | `carousel_items[].sort_order` | ordine in carousel | — | **OK** | — |
| Categoria visibile (checkbox) | `MenuQrModal` per cat con ≥1 ingrediente | `menu_qr_codes.category_filter` | `usePublicCategories` + griglia | `null` = tutte le cat tenant | **OK** | legacy null vs array esplicito |
| Attiva tutte le categorie | toggle modale | `category_filter` array | stesso filtro | `[]` = zero card | **OK** | — |
| Foto thumb card categoria | `MenuQrCategoryCardsSection` | `category_images[category_key]` + Storage `qr/.../cat/` | `CategoryCard` thumb 1:1 | emoji `CATEGORY_EMOJI` | **OK** | INC-10: no `menu_categories.image_url` |
| Titolo card categoria | override «Titolo» | `menu_qrcode_categories.title` | `CategoryCard` `displayTitle` | `menu_categories.label` | **OK** | — |
| Descrizione card categoria | override «Descrizione breve» | `menu_qrcode_categories.description` | `CategoryCard` `displayDesc` | `menu_categories.description` se override assente | **OK** | override `null` → nessun testo |
| Nascondi ingrediente | `MenuQrHiddenItemsPicker` occhio | `menu_qr_codes.hidden_menu_item_ids` | `PublicMenuCategoryPage` filtro | mostra tutti se `[]` | **parziale** | INC-15: preset page ignora hidden |
| Salva modale | `useSaveMenuQrSettings` | upsert QR + batch categorie | — | toast success | **OK** | atomico lato UI |
| Bozza foto nuovo QR | `draftShortCode` in modale create | Storage `qr/draft/{shortCode}/` | — | migrate a `qr/{id}/` al 1° Salva | **OK** | — |
| Nome locale header | *(Anagrafica `restaurant_name` non usata)* | `organizations_public.name` | `PublicMenuPage` `<h1>` | `'Menu'` | **parziale** | INC-01 |
| Sfondo pagina a tema | derivato da tema admin | `theme_key` → PNG `menuThemes.ts` | `useMenuPageBackgroundStyle` | colori CSS fallback | **OK** | homepage only |
| Tab navigazione sticky | — (derivato filtri) | `menu_categories` + `category_filter` | `MenuNavTabs` pill + icona Phosphor | `ForkKnife` | **parziale** | INC-06 se preset presenti |
| Tab preset eventi | **nessuna UI** modale QR | `preset_ids` + `booking_custom_staff_presets` | `MenuNavTabs` link preset | tutti preset se `preset_ids` null | **parziale** | INC-03 |
| Griglia card categorie | — | filtro + override + thumb | `CategoryCard` grid 1–2 col | «Menu in preparazione» | **OK** | — |
| Sezione lista preset | preset creati tab Menu staff | `restaurant_settings` JSON | cards preset homepage | «Menu in preparazione» | **OK** | read-only condiviso Prenota |
| Footer data/ora | — | *(client)* | `MenuFooterCard` | Intl `it-IT`, refresh 60s | **OK** | non-DB |
| Guard tenantReady | — | — | `PublicMenuPage`, `PublicMenuCategoryPage` | blocca lookup QR stale | **parziale** | INC-16: assente su preset page |
| Pagina categoria — titolo | override card **non propagato** | `menu_categories.label` | `PublicMenuCategoryPage` header | `categoryKey` | **parziale** | INC-08 |
| Pagina categoria — piatti | tab Menu ingredienti | `menu_items.category` | `ItemCardWithPhoto` / `ItemCardText` | con foto prima | **OK** | — |
| Foto piatto | form prodotto `MenuPricesTab` | `menu_items.image_url` | card full-width h-44 | card solo testo | **OK** | — |
| Descrizione piatto | form prodotto | `menu_items.description` | sotto nome in card | nascosta se vuota | **OK** | — |
| Prezzo piatto | form prodotto | `menu_items.price` | `€X.XX` | — | **OK** | — |
| Pagina preset — titolo | menù preselezionati tab Menu | `booking_custom_staff_presets[].name` | `PublicMenuPresetPage` header amber | «Menù non trovato» | **OK** | condiviso Prenota |
| Pagina preset — elenco | `item_ids` nel preset | `menu_items` by id ordinati | lista numerata testo+prezzo | **no foto** | **parziale** | INC-05 |
| Layout content_type | **non in UI** (default create) | `menu_qr_codes.content_type` | `showCart` / `showPresets` | sempre `a_la_carte` su nuovo QR | **parziale** | INC-03 |
| QR attivo | badge lista, no toggle modale | `menu_qr_codes.is_active` | `usePublicMenuQr` filtra attivi | inattivo → «non trovato» | **parziale** | — |
| QR default senza shortCode | — | primo attivo per `sort_order` | `usePublicDefaultMenuQr` | «Menu non ancora configurato» | **OK** | — |
| shortCode invalido | — | — | messaggio «Menù QR non trovato» | no redirect default | **OK** | — |
| Feature flag Menu QR | — | `tenant_features` / edition | visibilità tab QR `MenuPricesTab` | Classic senza add-on nascosto | **OK** | fuori modale |
| Pallini carosello | — | — | `MenuCarousel` buttons cliccabili | — | **OK** | non configurabile |
| Tab sticky opacità | — | `theme.tabBarStickyRgb` | blur/opacità ~56px scroll | trasparente a riposo | **OK** | — |
| URL categoria non filtrata | checkbox deseleziona cat | `category_filter` | URL `/c/:key` **non verifica filtro** | mostra piatti | **KO** | INC-09 |
| Tema su pagine figlie | tema in modale QR | `theme_key` | cat/preset: UI stone/amber hardcoded | — | **KO** | INC-04 |

### Riepilogo esiti

| Esito | N |
|-------|---|
| OK | 24 |
| parziale | 11 |
| KO | 3 |

---

## Incoerenze (senza fix — handoff revisore/fix)

| ID | Admin salva / configura | Pubblico mostra | Severità | File chiave |
|----|-------------------------|-----------------|----------|-------------|
| **INC-01** | Anagrafica `restaurant_name` (su test-pro: «Trattoria da Matteo») | Header QR usa `organizations_public.name` («Trattoria da Mugo») — **divergenza osservata** in revisione 30-05-26 | media | `PublicMenuPage.tsx` L702; follow-up 24-05-26 |
| **INC-02** | `menu_qr_codes.name` | Non visibile al cliente | bassa | `MenuQrModal` vs header |
| **INC-03** | Nessuna UI `content_type` / `preset_ids` | DB può avere preset/mixed; create sempre `a_la_carte` | alta | `MenuQrModal` buildPayload L184–186 |
| **INC-04** | Tema QR in modale | `PublicMenuCategoryPage` stone-50; `PublicMenuPresetPage` amber | media | pagine figlie |
| **INC-05** | Foto piatti tab Menu | Pagina preset: solo testo numerato | media | `PublicMenuPresetPage` |
| **INC-06** | Categorie + preset in DB (`mixed`) | `MenuNavTabs`: se `presets.length > 0` → **solo** tab preset | alta | `PublicMenuPage.tsx` L454–461 |
| **INC-07** | Legacy `category_filter = null` | Pubblico: tutte cat tenant; admin UI espande a tutte con prodotti | bassa | finché non risalvato |
| **INC-08** | Override titolo card QR | Pagina categoria: solo `menu_categories.label` | media | `PublicMenuCategoryPage` |
| **INC-09** | Categoria deselezionata | URL diretto `/c/:key` mostra piatti | media | nessun check filtro |
| **INC-10** | Foto categoria Prenota (`menu_categories.image_url`) | Thumb QR solo `category_images` o emoji | bassa | by design — documentare |
| **INC-11** | Doc aggiornata 036 | `PUBLIC_MENU_LAYOUT_CONTEXT.md` §5 cita ancora `menu_homepage_config` | doc | §5 layout context |
| **INC-12** | — | Override duplicati `primi` / `primi_piatti` su TEST | dati | migrazione 036 |
| **INC-15** | `hidden_menu_item_ids` | Non filtrato su preset page | media | `PublicMenuPresetPage` |
| **INC-16** | — | `PublicMenuPresetPage` senza `tenantReady` | bassa | vs homepage/category |

---

## Già mappato vs Giro 2 da mappare

### Già mappato (Fase 1)

- Tutti i controlli modale «Impostazione Menù QR» → colonne `menu_qr_codes` / `menu_qrcode_categories` / Storage
- Homepage pubblica: carosello, tab, griglia, footer, tema, tenantReady
- Pagina categoria: piatti, hidden filter, foto piatto
- Pagina preset: lettura preset staff condiviso con Pagina Prenota
- Feature flag `qrMenu`, client `supabasePublic`, modello per-QR post-036

### Giro 2 da mappare (post-revisore)

1. **QA browser** su `/menu/test-pro/qr/5f9n79b` — confronto visivo admin modale vs pubblico (375px)
2. Tenant con `content_type` ≠ `a_la_carte` in DB (se presenti su altri slug)
3. Multi-QR: `sort_order`, toggle `is_active` (UI assente)
4. Verifica slug login admin = slug URL pubblico (Matteo: «slug login = slug URL»)
5. Pulizia override legacy `primi` vs `primi_piatti` (dati TEST)
6. Allineamento `PUBLIC_MENU_LAYOUT_CONTEXT.md` §5 al modello per-QR

---

## Candidati vocabolario

| Termine | Livello proposto | Uso in questa sessione |
|---------|------------------|------------------------|
| **ciclo mappa** | Liv. 2 | Sequenza mappa → revisore → fix → revisione (template BookingRequestCard) |
| **coppie admin ↔ pubblico** | Liv. 2 | Tabella obbligatoria formato Impostazioni↔Prenota |
| **aspetto per-QR** | Liv. 2 | Migrazione 036: tema/carosello/foto non più per-tenant |
| **magazzino menu** | Liv. 1 | `menu_items` / `menu_categories` condivisi Menu + QR + Prenota |
| **tenantReady** | tecnico (context) | Guard: slug URL risolto prima lookup QR |
| **hidden_menu_item_ids** | tecnico (context) | UUID piatti nascosti per singolo QR |

→ Segnalati in report; promozione solo con approvazione Matteo (`PROPOSTE.md`).

---

## Prossimi passi (fuori Fase 1)

| Fase | Agente | Obiettivo |
|------|--------|-----------|
| **2** | Revisore Verifica | Controverifica tabella + QA browser TEST |
| **3** | Esecuzione | Fix prioritari INC-03/06 (UI preset/content_type?) e INC-04/08/09/15 |
| **4** | Revisore fix | validate + QA viewport |

---

## File prodotti (zero `src/`)

| File | Azione |
|------|--------|
| `docs/Sessioni di lavoro/29-05-26/Report-mappatura-menu-qr-admin-pubblico-29-05-26.md` | creato |
| `docs/per-ui-design-skill/PUBLIC_MENU_DATA_FLOW_CONTEXT.md` | creato |
| `docs/FOLLOW_UP.md` | FU-017/018/019 |
| `docs/SESSION_LOG.md` | voce Fase 1 (§7 completo dopo conferma) |
