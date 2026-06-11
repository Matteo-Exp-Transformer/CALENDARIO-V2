# ADMIN — Menu Magazzino Context

> Il tab Menu e il magazzino/listino unico del tenant. Alimenta sia Pagina Prenota sia Menu QR,
> ma non coincide con nessuna delle due viste pubbliche.

> **Stato blindatura (M3):** intervista Matteo ✅ (11-06-26) · mappa ✅ (11-06-26) · test 🔶 Fase 1+2+3 + QA E2E base (limiti 9 + availability 9 + sync rename/delete 9 Vitest + Playwright 1280/375/834, 11-06-26) · blindato ⬜.
> Decisioni intervista + flusso dati + cosa è nuovo → **§9** in fondo (fonte autorevole delle scelte di
> prodotto per quest'area). App unica: **nessuna distinzione admin/staff** (chi entra può tutto).

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
- Sync rename/delete parziale puo lasciare dati incoerenti (nessun rollback automatico oggi).
- **M3 controtest rename/delete ✅ Vitest (11-06-26, FU-M3-3):** suite `@admin-blindatura: menu-magazzino-sync` — happy path rename/delete + 3 scenari fallimento a metà (QR ok / form fail; secondo QR fail; delete QR ok / form fail). Comportamento atteso: throw + stato parziale documentato; hook `useUpdateMenuCategory`/`useDeleteMenuCategory` propagano errore con toast. Radice storica FU-MQR-3: rename via modale admin (`secondi_piattie` → slug corretto) allinea QR/form senza SQL manuale.

## 9. Mappatura M3 — decisioni intervista (11-06-26)

Verbale delle scelte di prodotto fissate con Matteo. I **valori vivono nel codice** una volta
implementati; questa sezione spiega il PERCHÉ e cosa è ancora da costruire.

### 9.1 Limiti decisi

| Cosa | Regola | Tipo |
|---|---|---|
| Categorie per tenant | max **7** | blocco **duro** |
| Prodotti per categoria | max **12** | blocco **duro** |
| Menù preselezionati | max **6** | blocco **duro** |
| QR code | max **6** | blocco **duro** |
| Nome piatto e nome categoria | cap caratteri (priorità responsive mobile) | duro |
| Descrizione piatto e descrizione categoria | cap caratteri, più generoso del nome | duro |

> **Retroattività (deciso):** i blocchi duri valgono **solo sui nuovi inserimenti**. Un tenant già
> oltre soglia (es. >7 categorie configurate alla vendita) **non** va rotto né svuotato: si impedisce
> di aggiungerne altre, non si cancella l'esistente.

I cap testo sono i campi ancora "da cappare" segnalati come debito Prenota (§7). Foto: il flusso
upload converte/comprime già lato client (`menuPhotoUpload.ts`, webp ≤450KB, lato lungo 1200px) →
**non si chiede un formato all'utente**, scatta e carica. HEIC grezzo caricato da desktop è l'unico
caso che può fallire → messaggio gentile (no blocco preventivo dei formati).

### 9.2 Flusso dati — propagazione e SNAPSHOT (cardine dell'area)

- **Propagazione viva:** modificare/eliminare nel magazzino (`menu_categories`, `menu_items`)
  aggiorna **subito** sia Pagina Prenota sia Menu QR.
- **SNAPSHOT prenotazioni (invariante):** ogni prenotazione conserva una **copia congelata** del menù
  scelto dal cliente in `booking_requests.menu_selection` (`SelectedMenuItem[]`: id + **name + price +
  quantity + totalPrice**, vedi `types/menu.ts:152`). Cambiare/eliminare il magazzino **non altera mai**
  pending, accettate, archivio: il cliente vede sempre ciò che ha scelto. ✅ già implementato.
  - *Limite noto, accettato da Matteo:* lo snapshot NON include descrizione testuale né foto del piatto
    (solo nome+prezzo+quantità). Sufficiente per "cosa ho scelto e quanto pago".
- **Preset non riscrive la fonte:** modificare un menù preselezionato non scrive sul magazzino. ✅
- **QR per-QR:** ogni QR ha impostazioni proprie (piatti nascosti, titoli categoria) che non toccano
  la fonte. ✅ (`menu_qr_codes` / `menu_qrcode_categories`).
- **QR spento/cancellato:** il cliente che inquadra un QR non più attivo vede "menu non disponibile".

### 9.3 Da costruire in M3 (NON è solo mappatura dell'esistente)

**Fase 1 ✅ (11-06-26)** — implementato in codice (`menuMagazzinoLimits.ts`, `MenuPricesTab`, `MenuQrManager`):

1. **Blocchi duri** 7 categorie / 12 prodotti / 6 preset / 6 QR — solo su **nuovi** inserimenti; pulsante disabilitato + messaggio («Hai raggiunto il massimo di …»); tenant già oltre soglia non rotto.
2. **Cap nome + descrizione** piatti e categorie — `BOOKING_MENU_COMPOSE_TEXT_LIMITS` 24/24/79; contatore anche su **descrizione categoria** overlay.
3. **Avviso propagazione Prenota/QR** sul salvataggio **ingredienti** (`MenuMagazzinoPropagationNotice` — stesso messaggio costante condiviso).

**Fase 2 ✅ (11-06-26, FU-M3-2)** — implementato in codice (`045_menu_magazzino_is_available.sql`,
`menuMagazzinoLimits.ts` helper `isMenuCategoryAvailable` / `filterMenuItemsForPublic*`,
`MenuPricesTab` toggle occhio in **panoramica Menu** (fix UX 11-06-26), filtri `MenuSelection` +
`PublicMenuPage` + `PublicMenuCategoryPage`):

4. **Toggle disponibilità nel magazzino** — colonna `is_available` (default `true`) su `menu_items` **e**
   `menu_categories`. Regola: **spento qui = nascosto ovunque** (Prenota + QR). Distinto da
   `visible_on_booking` preset e da `hidden_menu_item_ids` per-QR (si combinano; magazzino off vince).
   **Superficie toggle (UX 11-06-26):** solo panoramica tab Menu — occhio header `CollapsibleCard`
   categoria + riga ingrediente (`AdminMenuIngredientCard`, sempre visibile); **non** nei form
   Crea/Modifica Prodotto né overlay Categorie. Al save form si preserva `is_available` esistente.
   Admin vede voci spente (opacità) **solo in panoramica tab Menu**. Snapshot
   `booking_requests.menu_selection` intatto.
   **Superfici admin config (11-06-26):** stesso filtro magazzino anche nei pannelli che
   *configurano* la vetrina — `MenuQrModal` (checkbox categorie + ingredienti per-QR),
   `BookingFormConfigPanel` (card scorrevoli → «Categorie e ingredienti visibili»),
   `PresetMenuBuilder` (menù preselezionato). Spento nel magazzino = **non elencato** lì
   (non confondere con `hidden_*` per-card/per-QR, che restano override vetrina).
   Test: `@admin-blindatura: menu-magazzino-availability` (**9** Vitest, incluso catalogo admin config).

### 9.4 Controtest obbligatori in blindatura

- **Rename/delete categoria** (sync `menu_categories` → `menu_items` → QR → form Prenota → storage,
  §5): non è transazione unica → **Vitest FU-M3-3 ✅ (11-06-26)** documenta stato parziale se un passo
  fallisce (QR aggiornato, form no; oppure primo QR ok, secondo fail). Nessun rollback automatico in codice.
  Radice storica della chiave categoria malformata (FU-MQR-3): fix operativo = rename confermato in overlay
  Categorie Menu (modale pre-save), non UPDATE SQL a mano.
- **Nuovo toggle disponibilità:** "spento" sparisce in Prenota **e** in QR; snapshot prenotazioni
  vecchie intatto. **FU-M3-QA-E2E ✅ (11-06-26):** spec Playwright ufficiale
  `e2e/admin-menu-magazzino-blindatura.spec.ts` copre toggle categoria/prodotto da Admin Menu,
  assenza toggle nell'overlay categoria, propagazione pubblica Menu QR + Prenota, viewport 1280/375/834
  e teardown dati E2E.
- **Cap retroattivi:** tenant già oltre soglia non viene rotto.

### 9.5 Stato blindatura (11-06-26)

**M3 BLINDATO ✅** — cancello `MANUALE_BLINDATURA` §4 chiuso; report
[`Report-finale-m3-menu-blindato-11-06-26.md`](../../Sessioni%20di%20lavoro/11-06-26/Report-finale-m3-menu-blindato-11-06-26.md).
Vitest **27** + E2E `e2e/admin-menu-magazzino-blindatura.spec.ts`; validate **554**. Merge prod: procedura MASTERPLAN §merge (non ancora eseguito).
Debiti fuori cancello: **FU-M3-QA-L3** (tenant oltre soglia), **FU-M3-QA-CT** (controtest browser esteso).

## 8. Rimandi

- Pagina Prenota: `../Prenota-Skill/PRENOTA_SKILL.md`.
- Menu QR: `../Menu-QR-Skill/MENU_QR_SKILL.md`.
- Vecchio context tecnico: `../per-ui-design-skill/MENU_ADMIN_CONTEXT.md`.
- Flusso dati Menu (snapshot, propagazione, toggle): **§9 di questo file** è la fonte d'area;
  il resolver Prenota in dettaglio → `../Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md`.
