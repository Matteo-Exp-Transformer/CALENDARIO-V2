# Report — fix viewport menu responsive (31-05-26) · chiusura

**Profilo:** Esecuzione · **Modalità:** deep (viewport multi-superficie)  
**Validate:** 227 test OK (ultimo run sessione)  
**Commit:** non eseguito

---

## Cosa abbiamo sistemato (codice consolidato e confermato da Matteo)

| Superficie | Componente | Comportamento finale |
|------------|------------|----------------------|
| **Menu QR cliente** | `PublicMenuPage.tsx` | Griglia categorie: **1 col &lt;520** · **2 col 520–1024** (tile verticali) · **≥1025** 2 col con card **orizzontali** (thumb + titolo). Tab sticky: frecce/padding extra da **700px**. Sfondo PNG tema invariato (`useMenuPageBackgroundStyle`). |
| **Admin → overlay «Categorie Menu»** | `MenuPricesTab.tsx` (`viewMode === 'categories'`) | Fix **640–768**: rimosso wrap esterno `sm:grid-cols-2` che schiacciava le card a metà larghezza. Griglia card interna: **1 col fino a 1049px**, **2 col da 1050px** (allineato overview ingredienti). |
| **Admin → Modifica ingredienti** | `menuPricesCatalogLayout.ts` | `MENU_INGREDIENT_OVERVIEW_GRID_CLASS`: **1 col &lt;1050**, 2 col 1050–1279, 3 col ≥1280. |
| **Pagina Prenota → scelta piatti** | `BookingMenuComposeGrid.tsx` | **Stesso layout** per menù libero e preselezionato: griglia 2 col ≤699, fila scorrevole ≥700. **Non** toccato `BookingRequestPage` (sfondo/striscia LOCK). |
| **Admin scroll form #1** | `MenuPricesTab.tsx` + `adminScroll.ts` | Click Modifica ingrediente/categoria → scroll al **titolo form** con margine ~132px (`scrollIntoAdminShellView`). |

**Non modificato (volutamente):**
- Hero tab Menu principale (pulsanti «Crea / Modifica Categoria» in header sticky) — griglia CTA `min-[560px]:grid-cols-2`.
- Footer scroll homepage QR (#8 ciclo) — FU-021.
- `BookingRequestPage` — griglia striscia/footer LOCK.

**Iterazioni Matteo in sessione (riepilogo decisioni):**
- QR: ripristinata griglia 2 col (prima rimossa con Opzione A); soglia 2 col da **520px** (non 480).
- QR: fascia **700–1024** deve restare **2 col tile verticali**, non lista orizzontale a 1 col → card orizzontali solo da **1025px**.
- Prenota: tipologia menù **non** deve cambiare layout card → unificato layout «preselezionato».
- Admin overlay Categorie: fix 640–768 **OK da tenere**; griglia 2 col overlay spostata a **1050px**.

---

## Dati comunicazione (dettaglio per ristoratore e handoff)

### 1. Homepage menu QR (cliente al tavolo)

| | |
|--|--|
| **Schermata** | Pagina che si apre dal QR sul tavolo (`/menu/{slug}/qr/{codice}`) — nome ristorante, carosello foto, tab categorie, griglia categorie, footer data/ora. |
| **Cosa vede il cliente prima** | Su telefono stretto (&lt;520px) le categorie erano già a colonna singola; su tablet medio (700–1024px) poteva comparire **una categoria per riga in formato «lista orizzontale»** — poco coerente con il resto del menu mobile. |
| **Cosa vede ora** | Da **520px fino a 1024px** le categorie stanno in **due colonne** con **foto/tile verticali** (stile compatto, tap per aprire la lista piatti). Solo su schermi molto larghi (≥1025px) passano al formato «riga» con miniatura a sinistra e descrizione. Il carosello e le tab restano come prima; le frecce sulle tab compaiono da ~700px se ci sono molte categorie. |
| **Componente** | `PublicMenuPage` → `CategoryCard`, griglia in `MenuContent`, `MenuNavTabs`, `MenuCarousel`. |
| **Storage Supabase** | `menu_qr_codes` (tema, carosello, filtro categorie, foto QR); `menu_categories` (nome, descrizione); `menu_qrcode_categories` (titolo/foto/icona override per QR). Sfondo da PNG in `public/menu-themes/`. |

### 2. Admin — overlay «Categorie Menu» (sotto-tab)

| | |
|--|--|
| **Schermata** | Dashboard admin → tab **Menu** → pulsante **Crea / Modifica Categoria** → si apre il pannello a tutta larghezza «Categorie Menu» (non confondere con i pulsanti nella fascia hero in alto). |
| **Cosa vedeva il ristoratore prima** | Su tablet stretto (circa 640–768px) le card categoria (Antipasti, Primi…) occupavano **metà larghezza** del pannello — titolo schiacciato o illeggibile. |
| **Cosa vede ora** | Le card usano **tutta la larghezza** del pannello fino a **1049px**; da **1050px** in su possono affiancarsi in **due colonne**. Modifica/Elimina restano sulla card (pattern icone da allineare — vedi FU-026). |
| **Componente** | `MenuPricesTab` → `AdminMenuCategoryLabelCard`, wrap `menuPricesCategoryListWrapClass`. |
| **Storage** | Tabella `menu_categories` per tenant (`label`, `description`, `image_url` per Prenota). |

### 3. Admin — Modifica ingredienti (panoramica categorie)

| | |
|--|--|
| **Schermata** | Tab Menu → vista principale con sezioni collapsible «Antipasti — N ingredienti», ecc. |
| **Prima** | Da 640px le categorie potevano apparire in **due colonne strette**. |
| **Ora** | **Una colonna fino a 1049px**; da 1050px due colonne; da 1280px tre colonne — stessa logica della sotto-tab Categorie. |
| **Componente** | `MenuPricesTab` + costante `MENU_INGREDIENT_OVERVIEW_GRID_CLASS` in `menuPricesCatalogLayout.ts`. |
| **Storage** | `menu_items` (ingredienti) raggruppati per `category_key` → `menu_categories`. |

### 4. Pagina Prenota — scelta piatti

| | |
|--|--|
| **Schermata** | Form pubblico `/prenota/{slug}` → dopo aver scelto tipologia e sottotab → blocco card per categoria (Antipasti, Secondi…). |
| **Prima (bug segnalato)** | Menù **componibile** vs **già compilato** mostravano layout diversi (stack vs griglia), confondendo il cliente. |
| **Ora** | **Stessa impaginazione** per entrambi: sotto ~700px griglia compatta 2 colonne; da 700px fila orizzontale scorrevole. **Sfondo pagina e striscia foto non toccati.** |
| **Componente** | `BookingMenuComposeGrid` → `BookingMenuCategoryCard`. |
| **Storage** | `menu_items`, `menu_categories`; layout form da `restaurant_settings.booking_public_form_config`. |

### 5. Admin — scroll al form (fix #1 ciclo Menu QR)

| | |
|--|--|
| **Schermata** | Tab Menu → Modifica ingrediente o Modifica categoria con form già aperto su un’altra card. |
| **Effetto** | La pagina admin **scrolla fino al titolo** del form («Modifica Prodotto» / «Titolo categoria»), non resta in fondo alla lista. |
| **Componente** | `MenuPricesTab`, helper `scrollIntoAdminShellView` in `adminScroll.ts`. |
| **Storage** | Nessuna scrittura — solo UX scroll nel `<main>` AdminShell. |

---

## Follow-up aperti (prossima sessione)

| ID | Priorità suggerita | Cosa |
|----|-------------------|------|
| **FU-025** | Alta | Menu QR **&gt;1024px**: **freeze** dimensioni carosello/card/UI; wrapper centrato max-width tablet; sfondo full-bleed che scala. |
| **FU-021 §8** | Alta (ciclo) | Footer scroll homepage QR — salto sfondo in fondo pagina. |
| **FU-026** | Media | Icone matita/cestino **in basso a destra** su card admin (pattern menù preselezionati) + audit app-wide. |
| **FU-027** | Media | QA Matteo: Prenota libero vs preselezionato stessa view. |
| **FU-024** | Chiusura QA | Codice viewport #3b/#6 fatto — **QA Matteo ⬜** su checklist sotto. |

Dettaglio: [`docs/FOLLOW_UP.md`](../../FOLLOW_UP.md)

---

## QA Matteo (checklist handoff)

| Viewport / voce | Stato |
|-----------------|--------|
| QR 375 / 520 / 640 / 700 / 834 / 1024 / 1280 | ⬜ |
| QR 700–1024 = 2 col verticali (non lista orizzontale) | ⬜ conferma post-fix |
| Admin overlay Categorie &lt;1050 / ≥1050 | ⬜ |
| Admin overview ingredienti &lt;1050 | ⬜ |
| Prenota libero vs preselezionato | ⬜ |
| Scroll form #1 regressione | ⬜ |
| Ciclo #8 footer QR | ⬜ (sessione dedicata) |

---

## Handoff ciclo Menu QR (30-05-26)

| ID ciclo | Stato post-sessione |
|----------|---------------------|
| #3b QR fascia media | **Fix codice** — QA Matteo ⬜ |
| #6 Admin categorie 640–768 | **Fix codice overlay** — QA Matteo ⬜ |
| #8 Footer scroll QR | Aperto → FU-021 |
| #1 Scroll form | Fix codice — QA regressione ⬜ |
| Prenota fascia media | Fix unificato compose — FU-027 |

Report ciclo aggiornato: [`Report-prepara-prompt-ciclo-menu-qr-fix-30-05-26.md`](../30-05-26/Report-prepara-prompt-ciclo-menu-qr-fix-30-05-26.md)

---

## File toccati

**Codice:** `PublicMenuPage.tsx`, `MenuPricesTab.tsx`, `menuPricesCatalogLayout.ts`, `BookingMenuComposeGrid.tsx`  
**Docs:** `FOLLOW_UP.md`, `SESSION_LOG.md`, `PUBLIC_MENU_SKILL.md`, `MENU_ADMIN_CONTEXT.md`, `BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md`, handoff ciclo 30-05-26
