# ADMIN — Menu Magazzino Context

> Il tab Menu e il magazzino/listino unico del tenant. Alimenta sia Pagina Prenota sia Menu QR,
> ma non coincide con nessuna delle due viste pubbliche.

> **Stato blindatura (M3):** intervista Matteo ✅ (11-06-26) · mappa ✅ (11-06-26) · test ⬜ · blindato ⬜.
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
- Nome/descrizione ingredienti e categorie magazzino sono ancora aree da cappare secondo debiti Prenota.
- Sync rename/delete parziale puo lasciare dati incoerenti.

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

1. **Blocchi duri** 7 categorie / 12 prodotti / 6 preset / 6 QR (solo su nuovi inserimenti).
2. **Cap nome + descrizione** su piatti e categorie (oggi liberi).
3. **Toggle disponibilità nel magazzino** — nuova colonna booleana su `menu_items` **e**
   `menu_categories` (oggi assente: lo schema ha solo `sort_order`, no campo disponibilità). Regola:
   **spento qui = nascosto ovunque** (Prenota resolver + QR). Distinto dal toggle disponibilità
   per-preset, che resta locale al singolo preset. Richiede migrazione + far rispettare il flag dalle
   due vetrine, **senza rompere lo snapshot** delle prenotazioni passate.
4. **Avviso "tocchi anche Prenota/QR"** anche sul salvataggio **ingredienti**: oggi l'avviso compare
   solo salvando una **categoria** dal modale modifica, non sugli ingredienti → estenderlo per coerenza.

### 9.4 Controtest obbligatori in blindatura

- **Rename/delete categoria** (sync `menu_categories` → `menu_items` → QR → form Prenota → storage,
  §5): non è transazione unica → controtest "a metà strada" (passo che fallisce = dati incoerenti).
  Radice storica della chiave categoria malformata (FU-MQR-3).
- **Nuovo toggle disponibilità:** "spento" sparisce in Prenota **e** in QR; snapshot prenotazioni
  vecchie intatto.
- **Cap retroattivi:** tenant già oltre soglia non viene rotto.

## 8. Rimandi

- Pagina Prenota: `../Prenota-Skill/PRENOTA_SKILL.md`.
- Menu QR: `../Menu-QR-Skill/MENU_QR_SKILL.md`.
- Vecchio context tecnico: `../per-ui-design-skill/MENU_ADMIN_CONTEXT.md`.
- Flusso dati Menu (snapshot, propagazione, toggle): **§9 di questo file** è la fonte d'area;
  il resolver Prenota in dettaglio → `../Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md`.
