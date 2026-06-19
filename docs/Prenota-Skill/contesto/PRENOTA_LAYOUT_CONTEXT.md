# Pagina Prenota v2 — Layout & comportamento (context)

> Mappa di dettaglio della pagina pubblica di prenotazione (`/prenota/:slug`). Caricala quando il
> task tocca layout, griglia striscia, sfondo, header, ordine form, caselle, card ingredienti,
> sidebar riepilogo o sticky bar della pagina Prenota. Per la **configurazione admin** (Personalizza
> form) vedi `PRENOTA_FORM_CONFIG_CONTEXT.md`; per il **flusso dati** (resolver,
> field_overrides) vedi `PRENOTA_DATA_FLOW_CONTEXT.md`.

> **Trigger di routing:** «Pagina Prenota» · «form prenotazione clienti» → questo file +
> `UI_RESPONSIVE_SKILL` / `UI_EDIT_SKILL`.

---

## 0. LOCK struttura griglia

**`BookingRequestPage.tsx` — struttura griglia con striscia laterale**: il layout a 2 colonne
`[striscia foto | contenuto]` con `BookingPhotoStrip` sticky è consolidato e testato su 3
breakpoint. Prima di qualsiasi modifica a `BookingRequestPage.tsx` un agente DEVE:
1. valutare se il task può essere risolto toccando solo componenti figli (`BookingRequestForm`,
   `BookingSummarySidebar`, footer) senza toccare la griglia esterna — se sì,
   procedere su quei componenti;
2. se è necessario toccare la griglia, leggere per intero `BookingRequestPage.tsx` +
   `BookingPhotoStrip.tsx` + `BookingSummarySidebar.tsx` + `BookingRequestForm.tsx` prima di editare;
3. non alterare mai questi invarianti: griglia esterna `w-full` senza `mx-auto/max-w-*`;
   `BookingPhotoStrip` resta `sticky top-0 h-screen` nella colonna sinistra; footer fuori dalla
   griglia come ultimo figlio del wrapper `flex-col`; spacer `h-4` come ultimo elemento della
   colonna destra (gap prima del footer).
Qualsiasi modifica che viola uno di questi punti va discussa con l'utente prima di procedere.

---

## 1. Layout esterno (griglia striscia)

**Layout esterno opzionale a 2 colonne da 900px** in `BookingRequestPage`: se
`public_booking_strip_photo` è valorizzato, usa `min-[900px]:grid-cols-[25vw_1fr]` — colonna sx =
striscia foto verticale sticky; colonna dx = header + form + riepilogo. Se è `null`, la pagina
resta a colonna unica anche su desktop e lo sfondo occupa tutta la viewport.

- La griglia esterna deve restare `w-full` senza `mx-auto`/`max-w-*`: con la striscia parte dal
  bordo sinistro e mantiene sempre `25vw`.
- **Striscia visibile a tutti i breakpoint (28-05-26):** non più `hidden min-[900px]:block`.
  Larghezza colonna **20vw da 0px**, **25vw da ≥900px** (`grid-cols-[20vw_1fr]
  min-[900px]:grid-cols-[25vw_1fr]`). Su mobile 375px = ~75px decorativi, il form occupa il resto.
- **Per cambiare larghezza striscia:** modificare `25vw` nella classe in `BookingRequestPage.tsx`.
- **Footer Orari+Contatti:** fuori dalla griglia, ultimo figlio del `flex-col` wrapper — `w-full`
  senza `max-w-*`, copre da bordo a bordo. `border-t border-slate-100`, `rounded-none`. NON
  riportarlo dentro la colonna destra (provoca footer galleggiante che non copre la striscia).
- **Struttura return:** `div.min-h-screen → div.min-h-screen.flex.flex-col → [griglia flex-1 |
  footer a larghezza piena]`.
- **Copertura foto striscia:** `BookingPhotoStrip` ripete il ciclo di 6 foto 3 volte (18 × 120vh =
  2160vh) per coprire form con 10+ categorie aperte senza gap. Causa strutturale: `BookingPhotoStrip`
  ha `sticky top-0 h-screen` — non rimuovere `h-screen`.

## 2. Sfondo viewport (striscia vs full-page)

> **Superficie → palette (FU-014, agg. D-M2).** Input DB → **`resolvePublicBookingPageLayout`**
> in `bookingPageBackground.ts` (mode + surface + fullPagePhotoId in un punto). La pagina non
> ricalcola booleani sparsi; palette testo/errori da `surfaceUsesLightText(layout.surface)`.

| Superficie | Quando | Sfondo | Testo/errori |
|---|---|---|---|
| `strip` | `public_booking_strip_photo` valorizzato (striscia laterale) | crema `#faf7f1` | scuro (warm-wood / rossi) |
| `full-page-photo` | niente striscia + `public_booking_page_background` = `full-NN` | foto a pagina intera | **bianco** (`text-white`) |
| `light` | niente striscia, nessuna foto full-page (nessuno sfondo decorativo / legacy gradient-tile migrato a null) | crema `#faf7f1` | scuro |
| `dark` | riservato a un futuro tema scuro | — | bianco (gancio, non ancora emesso) |

Equivalenza blindata da test: `surfaceUsesLightText(surface)` === vecchio `!showPhotoStrip && isFullPagePhoto`
(`__tests__/publicBookingSurface.test.ts`).

- **Modalità striscia:** quando `public_booking_strip_photo` è valorizzato, il root ignora
  `public_booking_page_background` e applica tinta crema `#faf7f1` (`STRIP_MODE_PAGE_BG`).
- **Modalità full-page:** l'immagine `public_booking_page_background` (`full-01`…`full-04` via
  `bookingFullPageBackgroundPublicHref`) si applica alla viewport **solo** quando la striscia è
  disattivata. Le card del form restano bianche/opache in entrambe.
- `public_booking_page_background` **non accetta** `strip-01`…`strip-06`: quelle appartengono solo
  a `public_booking_strip_photo`.
- **Vincolo NOT NULL su `restaurant_settings.setting_value`:** "Nessuna striscia" si scrive come
  stringa vuota `''`, non `NULL` (colonna `NOT NULL`). Serializer in
  `restaurantSettingRegistry.public_booking_strip_photo.serializeToDb`: `null` JS → `''`; parser
  `parseBookingStripPhotoFromDb`: `''` → `null` JS. Stesso pattern per ogni futuro setting scalare
  opzionale.
- **Asset preset sfondo (28-05-26):** striscia 6 preset `strip-01..06` →
  `public/asset/strip/strip-NN.{png|webp}` (`STRIP_PHOTO_EXTENSIONS`: 01-03 PNG legacy, 04-06 WebP
  HD 1440×4320). Pagina intera 4 preset `full-01..04` in **due varianti WebP**:
  `…/full-NN-landscape.webp` (**1672×941**, ≥768px) + `full-NN-portrait.webp`
  (**941×1672**, <768px). Set da `immagini di prova/sfondo 3/` (a→01, b→02, c→03, e→04).
  `bookingFullPageBackgroundPublicHref(id, base, orientation?)` default landscape. Applicate
  via due `<div fixed top-0 left-0 right-0 h-[100lvh] min-h-[100svh] -z-10>` (portrait
  `md:hidden`, landscape `hidden md:block`) — **immagine fissa in viewport**, contenuto scrolla
  sopra. `background-size: cover`, `background-position: top center`, `no-repeat`. Altezza
  **`100lvh`** (large viewport) evita ricalcolo crop su Android Chrome quando la barra URL
  si nasconde/mostra in scroll — **non** usare `inset-0` né `100dvh` sul layer foto. Su iOS:
  `position: fixed` sul div (non `background-attachment: fixed`, spesso inaffidabile). **NON**
  `repeat-y`, **NON** layer alto quanto il documento, **NON** hero `min-h-svh`. Root fallback
  crema `#faf7f1` solo primo paint / se l'immagine non carica.
- **Viewport mobile Prenota (31-05-26):** `useBookingPublicViewport()` in `BookingRequestPage`
  imposta meta `interactive-widget=resizes-content` + classe `html.booking-public-viewport`
  (solo su route `/prenota/:slug`; cleanup on unmount). Pattern analogo a Menu QR
  (`usePublicMenuViewport`) ma classe separata per evitare effetti su altre route.
- **Trade-off fixed vs scroll (31-05-26):** in fondo pagina (footer Orari/Contatti) lo sfondo resta
  ancorato alla viewport — accettato; verificare scroll fondo↔su a 375px e 1280px.
- **Stacking context sfondo (31-05-26, agg. D-M2 15-06-26)**:
  1. root `BookingRequestPage` = `relative isolate` + colore fallback crema `#faf7f1` sempre;
  2. foto full-page = layer `fixed top-0 left-0 right-0 h-[100lvh] -z-10` (solo viewport);
  3. wrapper contenuto = `relative z-10 w-full`.
- **Legacy gradiente/tile (rimosso D-M2):** non più renderizzati; `parseBookingPageBackgroundFromDb` → `null` → superficie `light` + crema.

## 3. Header pubblico

Nome azienda, titolo e descrizione leggono font/colore da `booking_public_form_config.header_styles`.
Nome e titolo stessa scala grande, descrizione più piccola. Font in `BOOKING_HEADER_FONT_OPTIONS`
(Google Fonts in `index.css`; font commerciali restano fallback CSS se senza licenza webfont).
- **Allineamento testo (28-05-26):** `BookingHeaderTextStyle.textAlign?: 'left'|'center'|'right'`
  (default `'center'`). `getBookingHeaderTextStyle` lo mette nello style inline; admin
  `renderHeaderStyleControls` 3 pulsanti ⬅↔➡ per campo. **Non** aggiungere classi Tailwind `text-*`
  hardcoded a `h1/h2/p` dell'header: sovrascrivono lo style inline.

## 4. Layout interno form + breakpoint 1256px

- 2 colonne `min-[1256px]:grid-cols-[1fr_min(360px,32%)]`. `BookingSummarySidebar` laterale sticky
  **solo da ≥1256px** (`BOOKING_PUBLIC_SUMMARY_SIDEBAR_MIN_PX`); sotto 1256px il riepilogo resta
  **sotto** il form. Sidebar `min-[1256px]:sticky top-4 order-0` + `min-h-[320px]` su ≥1256px.
- Breakpoint **1256px** anche per `col-span-2` di tipologia/sottotab, menu-section, submit desktop.
  Il resto (tipologia full-width, striscia) può restare a **900px**.
- **Sotto 1256px — un solo riepilogo in flusso (02-06-26):** nessuna barra fixed in basso, nessun
  overlay, nessun secondo pulsante Invia. `BookingSummarySidebar` resta **sotto** il form con
  `submitButton` in fondo (`block min-[1256px]:hidden`). Per inviare il cliente scrolla fino al
  riepilogo. Il pulsante grande in `BookingRequestForm` è `hidden min-[1256px]:flex` (solo desktop).
  Pulsanti usano `type="submit" form="booking-request-form"`. `BookingRequestForm` espone
  `onIsDisabledChange`.
- **Gap prima del footer:** spacer `<div className="h-4" aria-hidden />` in `BookingRequestPage`
  (ultimo elemento colonna destra).
- Quando si apre la griglia ingredienti, il riepilogo **non** scorre fuori schermo e non mostra
  frecce di riapertura (comportamento vecchio rimosso).

### 4.1 Freeze desktop full-page (senza striscia)

**Condizione:** `useFullPageDesktopFreezeLayout = !showPhotoStrip && isFullPagePhoto` (preset
`full-01`…`full-04`, layer fixed cover — **non** gradiente/tile legacy). Attivo solo da
**≥1256px** via classi `min-[1256px]:*` (stesso breakpoint di `BOOKING_PUBLIC_SUMMARY_SIDEBAR_MIN_PX`).

**Fuori scope (layout invariato):** striscia laterale; assenza sfondo decorativo (crema tecnica).
viewport &lt;1256px (riepilogo sotto form + submit nel riepilogo, senza barra fixed).

**Desktop full-page:**
- Blocco **centrato** `mx-auto w-fit` da **≥1256px** (header + riga form [+ riepilogo da 1600px]):
  colonna form fissa `BOOKING_FULL_PAGE_FORM_MAX_WIDTH_PX` (1168px); sfondo simmetrico ai lati.
- **Riepilogo esterno** solo da **`BOOKING_FULL_PAGE_EXTERNAL_SUMMARY_MIN_PX` (1600px)**:
  sotto 1600px resta **sotto** il form (stack, come mobile); 1256–1599 **non** ha colonna laterale
  interna a 2 colonne. `summarySidebar` nel form nascosto con `min-[1600px]:hidden`.
- Da 1600px: `BookingSummarySidebar` sibling a destra (`BOOKING_FULL_PAGE_SUMMARY_WIDTH_PX` = 360),
  sticky `top-4`.
- `BookingRequestForm` con `externalSummaryLayout`: griglia interna sempre **una colonna** (anche ≥1256).
  **Tutti** i figli principali (tipologia, menu, campi cliente, riepilogo stacked, submit) hanno
  `min-[1256px]:col-span-2`: in `grid-cols-1` un `col-span-2` crea una colonna implicita che
  affiancherebbe i figli `col-span-1` → senza span uniforme il riepilogo finiva a destra dei campi
  cliente (bug 1256–1599 risolto 02-06-26).
- **Posizionamento riepilogo deciso dal parent, non dal componente (02-06-26):** `BookingSummarySidebar`
  è neutro (`w-full max-w-full self-start` + prop `className`). Il chiamante passa lo sticky **solo**
  dove serve: istanza esterna ≥1600px → `className="sticky top-4"`; istanza stacked full-page →
  `className="mb-6"` (niente sticky, sta sotto); layout striscia legacy → classi sticky da 1256.
  **Non** rimettere `min-[1256px]:sticky/order` dentro `BookingSummarySidebar`.
- **Card sottotab scrollabili (≥4) (02-06-26):** `bookingPublicSubTabScrollCardWidthClass()` —
  sotto 782px 3 slot proporzionali (mobile, gap 6px); da **782px** quadrato a **lato fisso 200px**
  (allineato all'altezza delle card categoria ingrediente, no crescita gigante); da **1400px** lato
  **240px** (scatto coordinato con gli ingredienti). Altezza via `aspect-square sm:aspect-4/3`
  (quadrata mobile, più bassa da 640px). Px fissi e non % + breakpoint viewport: le card vivono nel
  cap 1168px, le media-query sul viewport davano conteggi slot incoerenti.
- **Bilanciamento card ingredienti:** `BookingMenuCategoryCard` layout `scroll` da **1400px** passa da
  280→320px, in coppia con le sottotab. Tipologie con `bookingPublicRowCardWidthClass(N)` (no `lg:px-16`).
- Pulsante Invia: `form="booking-request-form"` in sidebar (mobile) e submit grande nel form (desktop).
- **Telefono nel riepilogo (17-06-26):** `BookingSummarySidebar` mostra il **telefono cliente**
  (`client_phone` da `sharedFormData`), non `contact_phone` del ristorante. Il contatto del locale
  resta solo nel footer Orari+Contatti (`BookingRequestPage`).
- Header ristorante **sopra** form+riepilogo, nello stesso wrapper centrato (testo con
  `header_styles.textAlign`; il box segue la larghezza del blocco 1168+360).

**Ripristino layout precedente:** rimuovere il wrapper in `BookingRequestPage` e
`externalSummaryLayout`; riepilogo torna nella griglia `min-[1256px]:grid-cols-[1fr_min(360px,32%)]`.

## 5. Ordine del form (v2 attuale)

1. **Tipologia** (`BookingModeCards`): 3 colonne compatte su mobile, descrizione solo da `sm+`;
   icone da catalogo unificato Menù QR (`MenuQrCategoryIconKey` in
   `booking_modes[].icon`) renderizzate con `MenuQrCategoryIconGlyph` (Phosphor `regular` + Lucide
   `strokeWidth` 1.75). Chiavi legacy in DB mappate in lettura (`BOOKING_LEGACY_ICON_TO_MENU_QR_KEY`).
   **Titolo card (`mode.label`, 16-06-26, FIX 5 batch 9-fix Area A):** `text-[16px]` (mobile) →
   `sm:text-[19px]` → `lg:text-[17px]` → `xl:text-[19px]`; descrizione `text-sm` (era `text-xs`).
   Prima del fix il titolo usava `text-[13px] … lg:text-sm xl:text-base`, con lo stesso anti-pattern
   `lg:text-sm` descritto sotto per `BookingSubTabCards` (titolo più piccolo tra ~1024px e 1280px):
   ora il salto sm→lg resta ≤2px invece di peggiorare.
2. **Sottotab** (`BookingSubTabCards`): scrollabili, frecce desktop + touch; icona centrata **senza
   sfondo** (`MenuQrCategoryIconGlyph`, ~`h-7` `text-warm-wood-dark` su card chiara) **solo se**
   `sub_tabs[].icon` è valorizzata in config (admin Personalizza form → «Nessuna» = campo omesso;
   nessun fallback a icona default). **Descrizione mai nella card** (appare solo in `MenuSelection` dopo selezione — anche card
   manuale senza `preset_id`, blocco «Hai selezionato :» con titolo + descrizione).
   **Titolo card (`tab.label`, 10-06-26):** scala monotona crescente — `text-sm` (mobile) →
   `sm:text-base` → `lg:text-base` → `xl:text-lg`; `line-clamp-2`. **Non** usare `lg:text-sm`
   (creava titolo più piccolo tra ~1024px e 1280px rispetto a `sm`).
   **Footer card `display='cards'` (04-06-26, agg. 05-06-26):** fascia inferiore `mt-auto` — a sinistra
   `sub_tabs[].courses_label` (max 12 char, `line-clamp-1`); a destra solo importo `X,XX€` se
   `price_per_person > 0` (nessuna riga «a persona» sotto l'importo). Non su carosello (`BookingSubTabCards` assente se
   presentazione carosello). Centratura titolo/icona: `justify-center` su flex interno card.
   **Allineamento riga card scrollabili (05-06-26):** wrapper **outer** `overflow-x-auto
   scrollbar-hide` + **inner** `flex flex-nowrap w-max` (`useBookingPublicScrollRowAlign`):
   se `inner.scrollWidth ≤ outer.clientWidth` → `mx-auto justify-center` (gruppo centrato);
   se overflow → `justify-start` (prima card intera sul bordo sx, scroll verso destra; **non**
   `justify-center` sull'outer — blocca lo scroll). ≤3 card: inner `w-full`, `flex-1` per card.
   Larghezza mobile ≥4 card: `--booking-sub-tab-viewport-px` sull'outer (ResizeObserver) +
   `calc(var(--booking-sub-tab-viewport-px)*0.41)` in
   `bookingPublicSubTabScrollCardWidthClass()` — **non** `%` sul inner `w-max` (gonfia le card).
   Snap: `snap-start` se overflow, `snap-center` se gruppo centrato. Max 3 colonne non scroll
   (`bookingPublicRowCardWidthClass`).
3. **Presentazione XOR** (`BookingMode.sub_tabs_presentation: 'cards'|'carousel'|null`): filtro
   difensivo in `activeModeSubTabs`. Se `display='carousel'`: mostra **solo** `BookingSubTabCarousel`
   (foto + overlay per slide da `carousel_items[].eyebrow/title/description`; badge icona in alto a
   dx solo se `carousel_items[].icon` è valorizzata (`MenuQrCategoryIconGlyph` +
   `resolveBookingStoredIconKey`; «Nessuna» in admin = assenza icona); prezzo opzionale;
   nessuna griglia menù). Carosello = **una sola card con N foto** per modalità: `BookingSubTabCards`
   non renderizzato per modalità carosello (auto-selezione sottotab unica + carosello diretto).
   **Allineamento carosello pubblico (05-06-26):** **1 slide** → centrata, `w-full max-w-[280px]`
   (sm 320px), niente % ristretta. **≥2 slide** → stesso pattern outer/inner +
   `useBookingPublicScrollRowAlign`; larghezze slide via `--booking-carousel-viewport-px` e
   `min(280px,72%)` / `min(320px,60%)` / `46%` (md); frecce desktop se ≥2 foto.
4. **Menù** (card scorrevole `display='cards'` con preset collegato **oppure** card manuale senza preset):
   `MenuSelection` → griglia `BookingMenuComposeGrid` solo con preset; card manuale = solo blocco titolo/descrizione.
   Senza card/carousel valide salvate non esiste fallback pubblico legacy. Mobile: colonna stack
   `BookingMenuCategoryCard`, header con miniatura 76px a filo bordo. Desktop md+: griglia (con 3
   categorie `grid-cols-3` già da `md`); card senza `max-w-[320px]`, piena larghezza colonna.
5. **Dati cliente** (`BookingFormFields` + `DietaryRestrictionsSection` con `BookingPublicInsetField`:
   label dentro la card in alto a sx, valore sotto; data/ora con `BookingPublicDateTimePickers`
   (bottom sheet mobile / popover desktop, `TimePicker24h`). Larghezza `BOOKING_PUBLIC_CONTENT_WIDTH`
   = `w-full min-w-0`. **Nessun** banner «Menù fisso» — solo UI read-only se `is_fixed_menu`.
   Validazione orario vs `business_hours`: `isValidBookingDateTime` → `isTimeInsideSlot` (stessa
   logica overnight di `slotRangesOverlap` / admin: fine &lt; inizio ⇒ [inizio→24:00) ∪ [00:00→fine]).
6. **Footer pubblico:** orari e contatti si mostrano solo se salvati dal tenant. La pagina pubblica
   non usa `getDefaultBusinessHours()` come fallback; orari mancanti = blocco Orari assente.

### Titolo card e menù fisso
- Titolo pubblico sottotab = `sub_tabs[].label` (campo «Titolo card»);
  `applyLegacySubTabLabelOverrides` per legacy; salvataggio modalità azzera `sub_tabs_overrides`.
- `MenuSelection`: titolo "Crea il tuo menu" solo se card personalizzabile (`is_fixed_menu === false`
  / `menuSelectionLocked === false`) **e** griglia ingredienti visibile; se fisso mostra label/nome menù preselezionato.
  Card manuale senza preset: blocco «Hai selezionato :» con titolo + descrizione, griglia assente.
  Menù personalizzabile (preset o card): ingredienti **non** pre-spuntati all'apertura — selezione iniziale vuota
  (`applyPresetTypeToBookingFormPayload` + `subTabGuestComposable`).
- Se `is_fixed_menu !== false` e `price_per_person > 0`: riepilogo/submit usano prezzo × ospiti (non
  somma piatti) e mostrano totale ingredienti barrato come confronto in **sidebar** (non in email conferma); label totale prenotazione: **«Totale»** (non «Totale stimato»); senza prezzo o
  `is_fixed_menu === false` nessun riepilogo prezzo.
- **€ per ingrediente (03-06-26):** criterio unico `getSubTabPricePerPerson` in
  `bookingPublicFormConfig.ts` — se restituisce un numero (prezzo fisso sottotab), prop
  `showIngredientPrices={false}` da `BookingRequestForm` → `MenuSelection` →
  `BookingMenuComposeGrid` → `BookingMenuCategoryCard` (`ComposeMenuItemPanelContent`: footer senza
  colonna prezzo) e sidebar «Il tuo menu» senza € riga; se `undefined` (personalizzabile) prezzo in
  footer a destra come da §7.
- `preset_id` resta fonte per precompilare ingredienti e seguire il menu staff. Visibilità
  ingredienti/categorie per card filtrata da `hidden_category_keys`/`hidden_item_ids`.
- Card scorrevole `display='cards'` senza `preset_id` (compilata a mano): no griglia ingredienti,
  no controlli visibilità, no toggle «Menù personalizzabile»; può mantenere prezzo salvato; non
  genera alert da preset mancante.
- Selezione preset da card scorrevole non mostra "Menu consigliato non disponibile" mentre
  `menu_items`/`booking_custom_staff_presets` caricano; `BookingRequestForm` mantiene il preset e
  lo riapplica a catalogo pronto.

## 6. Caselle / campi (single-row, multiline, validazione)

- **Single-row (28-05-26):** `BOOKING_PUBLIC_FIELD_BOX` è `flex-row items-center` (era `flex-col`):
  label a sx (shrink-0 nowrap) + valore/input a dx (`text-right flex-1`). Altezza `min-h-[2.5rem]`
  mobile / `sm:min-h-[2.75rem]`. Per nome, email, telefono, Data, Ora, ospiti.
  `BookingPublicInsetFieldShell`, `BookingPublicDatePickerField`, `BookingPublicTimePickerField`
  condividono il layout; picker date/time button con `justify-end text-right`.
- **Trigger ridotto Data/Ora (02-06-26):** la card resta uguale; solo icona + valore formattato apre
  il picker (bottom sheet mobile / popover desktop). **Label cliccabile (17-06-26):** «Data \*» /
  «Ora \*» usa `<label htmlFor={id-control}>` sul trigger button (prima `span` non cliccabile).
  **Data:** area valore = `flex` con trigger `inline-flex` (calendario + testo) + filler destro
  `pointer-events-none`. **Ora:** area valore = `grid grid-cols-2` — metà sx (icona + ora) =
  trigger; metà dx = area morta `pointer-events-none`. Tab e screen reader raggiungono il trigger;
  `focus-within` sul box quando il trigger ha focus.
- **Label single-row cliccabili (17-06-26):** `BOOKING_PUBLIC_FIELD_INNER_LABEL` senza
  `pointer-events-none` + `cursor-pointer`; `BookingPublicInsetField` collega label/input con
  `htmlFor`/`id-control` (nome, email, telefono, ospiti).
- **Griglia campi (28-05-26):** ordine Nome → **Ora | Ospiti** (`sm:grid-cols-2`) → **Telefono**
  full-width → **Data | Email** (`sm:grid-cols-[minmax(0,1fr)_9rem_7rem]`, Email in `sm:col-span-2`).
  Label "Data \*". Mobile <640px colonna singola. Non tornare a `1fr` fisso per Data.
- **Multiline (28-05-26):** `BookingPublicInsetField` con `multiline` usa
  `BOOKING_PUBLIC_FIELD_BOX_MULTILINE` (label sopra, textarea sotto): cresce con `scrollHeight`,
  testo a sx (`resize-none overflow-hidden`). In `DietaryRestrictionsSection`: «Intolleranze o
  esigenze alimentari» e «Altre Richieste».
- **Privacy Policy (10-06-26, riscritto a modale 18-06-26):** nel checkbox obbligatorio
  (`DietaryRestrictionsSection`), il link «Privacy Policy» apre una **finestra in-page**
  (`PrivacyPolicyModal`, componente `Modal` di `@/components/ui`) **sopra il form**, sulla stessa
  scheda. Il form NON viene smontato → lo stato React (campi compilati) resta intatto alla chiusura.
  Nessuna nuova scheda, nessuna dipendenza da `window.opener`/`window.close()` → funziona ovunque
  (mobile, browser embedded). Chiusura: X, click overlay, Esc.
  Il **contenuto legale** vive in `PrivacyPolicyContent` (`src/pages/privacy/`), condiviso tra la
  modale e la pagina standalone `/privacy` (`PrivacyPolicyPage`, per link diretti). Modifiche al
  testo passano per skill `legal-production`. La pagina standalone legge ancora `?from=/prenota/:slug`
  (validato in `privacyPolicyNavigation.ts`, solo `/prenota/:slug`) per il bottone «Torna…»
  (`resolvePrivacyBackAction`: `history-back` / `replace` / `navigate '/'`).
- **Validazione:** email `isValidEmail()`, telefono `isValidPhone()` (`utils/validation.ts`).
  Cap caratteri cliente in `BOOKING_PUBLIC_CLIENT_TEXT_LIMITS` (`bookingPrenotaTextLimits.ts`):
  nome **65**, email **65**, telefono **30**, intolleranze aggregate **550**, altre richieste **550** —
  **solo sistema** (maxLength silenzioso, nessun contatore in pagina); messaggio submit/edge
  «Testo troppo lungo». Dettaglio: §8.1 e `PRENOTA_TEXT_LIMITS_MAP.md` §H.
  `BookingFormFields` usa `autoComplete`/`inputMode` HTML5.
- **Submit fallito (29-05-26):** il `<form id="booking-request-form">` ha **`noValidate`** — la validazione è solo React (`validate()`), altrimenti i `required` HTML bloccano l'evento submit **prima** di `handleSubmit` (niente toast, chiusura card, scroll, lampeggio). Sequenza `focusFirstValidationIssue`:
  1) `dispatchBookingMenuComposeCollapse()` (evento sincrono su `window` — chiude tutte le card,
     incluse istanze mobile+desktop montate in parallelo) + incremento `composeCollapseNonce`;
  2) triplo `requestAnimationFrame` poi scroll (`scrollToBookingPublicError`);
  3) lampeggio `.booking-public-field-attention` sul solo primo campo — colore **`--color-warm-orange`** (arancione tema; il rosso resta solo su `hasError`/testo errore); stop solo su interazione
     **utente** (`event.isTrusted` via `shouldDismissBookingPublicAttention`); niente `focus()`
     programmatico post-scroll (causava stop immediato del lampeggio).

## 7. Card categoria ingredienti (`BookingMenuCategoryCard`)

- **Breakpoint compose (`BookingMenuComposeGrid`):** ≤699px griglia 2 col compact; ≥700px scroll orizzontale — **stesso layout** per menù libero e preselezionato (`locked` non cambia la view). Entrambi i branch DOM montati (collapse su submit).
- Card chiusa: `aspect-4/3` indipendente dal `layout` (evita nastro basso da `h-[148px]` su colonna
  larga). Foto ingrediente in card aperta: `aspect-4/3 sm:aspect-3/2`. Mai altezze `px` su immagini
  full-width: sempre `aspect-ratio`.
- **Card aperta:** header categoria fisso; pannello lista (`#booking-menu-cat-panel-*`) max **3
  righe tipo "con foto"** (formula `BOOKING_MENU_CATEGORY_PANEL_SCROLL_CLASS` in
  `bookingMenuComposePanelLayout.ts`, `100cqw` + `@container`) e `overflow-y:auto
  overscroll-y-contain` — dal 4° ingrediente scroll solo dentro la card.
- **Overlay:** card aperta via **React portal** su `document.body` (`position:fixed`, **stessa
  larghezza della card chiusa** — non allargare al form intero o le foto esplodono con `100cqw`);
  `z-[160]` sotto sticky bar `z-200`. Costanti in `bookingMenuComposePanelLayout.ts`.
- **Sync posizione overlay (29-05-26):** mentre `expanded`, loop `requestAnimationFrame` aggiorna
  `top`/`left`/`width` del portal via ref DOM (no `setState` per frame — evita lag visivo); listener
  `scroll` capture su `window`, `resize`, `ResizeObserver` su shell, più `scroll` sul contenitore
  orizzontale `ComposeScrollRow` (`horizontalScrollRef` passato alle card layout `scroll`).
- **Accordion scroll (16-06-26):** in layout `scroll` (≥700px) una sola categoria aperta alla volta
  (`dispatchBookingMenuComposeCollapse` all'apertura di un'altra). Se la card aperta esce dal viewport
  del carosello (scroll manuale o frecce avanti/indietro in `ComposeScrollRow` — queste chiudono subito
  via stesso evento), si chiude da sola (`isElementFullyVisibleInHorizontalContainer` su scroll
  orizzontale; 700ms di suppress dopo `scrollIntoView` all'apertura).
- **Portal z-index:** `BOOKING_MENU_CATEGORY_EXPANDED_PORTAL_CLASS` → `fixed z-[160]` (sopra form e
  riepilogo in scroll; **non** esiste più sticky bar mobile — rimossa 02-06-26).

### Righe ingredienti nel pannello — layout stack (03-06-26)

Implementazione: `ComposeMenuItemPanelContent` in `BookingMenuCategoryCard.tsx` (sostituisce il vecchio
`ItemPriceRow` nome/prezzo affiancati). **Stesso stack** in pannello aperto per striscia laterale,
full-page e griglia mobile/desktop — **nessuna** prop `showPhotoStrip` / wrap CSS per modalità pagina.

Ordine verticale per ogni ingrediente nella lista `#booking-menu-cat-panel-*`:

1. **Foto** (solo se `item.image_url`): `aspect-4/3 sm:aspect-3/2`, bordo leggero.
2. **Titolo** a tutta larghezza (`text-sm font-bold`, `wrap-break-word`).
3. **Descrizione** opzionale sotto il titolo (`text-xs`).
4. **Footer azioni** `min-h-[44px]`: montato **solo se** `showActionRow = !locked || showIngredientPrices`
   (checkbox a sinistra se menù non `locked`; prezzo a destra solo se `showIngredientPrices === true`).
   Se menù preselezionato **e** prezzo fisso sottotab (nessun € per ingrediente) → **nessun footer** —
   evita buco ~44px sotto descrizione (10-06-26).

**Divisori tra ingredienti:** `<li aria-hidden>` con `px-3` + `h-px bg-black/10` **tra** le righe, non
dopo l’ultima. Lista `<ul>` senza `gap` verticale globale (spaziatura = padding riga + divisore).

**Non reintrodurre** layout wrap/float/misura JS nome↔prezzo affiancati: la card aperta è stretta
(~240–320px in scroll orizzontale) e il testo deve usare tutta la colonna; il pivot stack (03-06-26) è
il pattern consolidato. In prepara-prompt: se il task chiede «testo sotto l’€» in colonna stretta,
proporre stack invece di wrap.

Riga selezionabile: `<label htmlFor={inputId}>` avvolge tutto `ComposeMenuItemPanelContent`; `locked` usa
`<div>` senza checkbox. La formula `BOOKING_MENU_CATEGORY_PANEL_SCROLL_CLASS` assume footer `44px` e
foto `aspect-4/3` / `sm:aspect-3/2` (vedi commento in `bookingMenuComposePanelLayout.ts`).

### Riepilogo carosello (summary display)
Per `display='carousel'` il resolver mantiene `price_per_person` sulla sottotab; in Prenota
`getShowOfferDetailsInSummary` + `resolveCarouselSummaryDisplay` (`bookingPublicFormConfig.ts`)
governano `BookingSummarySidebar`: toggle ON (default) → nome carosello (`label`) in righe «Tipo» e
«Opzione menu» + titoli slide in «Offerta selezionata»; toggle OFF → nasconde nome e titoli (righe
«Tipo»/«Opzione menu» assenti se non resta altro); prezzo nel blocco carosello solo se
`price_per_person > 0`, indipendentemente dal toggle (toggle ON senza titoli → solo prezzo nel
blocco offerta). Campo `show_offer_details_in_summary` su `sub_tabs[]`; editor carosello in
`BookingFormConfigPanel` (blocco prezzo separato + toggle «Mostra dettaglio offerta»). Carosello
pubblico: swipe/scroll mobile + frecce laterali da desktop/tablet con ≥2 foto.

### Card scorrevole con preset
`BookingSubTabCards` con `preset_id`: `booking_custom_staff_presets[].item_ids` è la fonte del
catalogo ingredienti mostrato; questi item non vanno esclusi per mismatch con
`menu_item.booking_types`. Esclusioni consentite: solo toggle visibilità categoria/ingrediente
sulla card o ingrediente eliminato/modificato dal catalogo. La selezione preset da card scorrevole
non mostra "Menu consigliato non disponibile" mentre `menu_items`/`booking_custom_staff_presets`
caricano; `BookingRequestForm` mantiene il preset e lo riapplica a catalogo pronto.

## 8. Config & tipi

- Config: `booking_public_form_config` in `restaurant_settings`; default `bookingPublicFormConfig.ts`;
  parse `restaurantSettingRegistry.ts`.
- `SubTab`: `display: 'cards'|'carousel'`, `label`, `description`, `courses_label`,
  `price_per_person`, `is_fixed_menu?`, `preset_id?`, `hidden_category_keys?`, `hidden_item_ids?`,
  `carousel_items?`. Niente più `preset|manual` salvato.
- Submit invariato — **non toccare `useCreateBookingRequest`**.
- Admin: `BookingFormConfigPanel` + `MenuPricesTab`. Pubblici in `publicBooking/`.

### 8.1 Limiti testo (03-06-26)

Mappa completa: **`PRENOTA_TEXT_LIMITS_MAP.md`**. Costanti: `bookingPrenotaTextLimits.ts`.

- **Ristoratore (A–F):** cap legati al layout + contatore `N/max` in Personalizza form / promo. Descrizione header max **28px** (titolo/nome fino **38px**).
- **Cliente (H):** cap generoso (**65** nome/email, **30** tel, **550** intolleranze e altre richieste) — **solo sistema**: `maxLength` silenzioso, nessun contatore in pagina; edge `create-booking` allineato.
- **`courses_label`:** max **12** in admin; in pubblico footer basso sx su card `display='cards'` (`BookingSubTabCards`, vedi §5.2); non in carosello.
- **Menù compose ingredienti (FU-030 Fase 1, 10-06-26):** `BOOKING_MENU_COMPOSE_TEXT_LIMITS` — categoria/nome **24**, descrizione **79**. Pubblico: `clampBookingText` in `BookingMenuCategoryCard` + nomi in `BookingSummarySidebar` (nessun contatore). Admin: `MenuPricesTab` form prodotto + titolo categoria overlay. Dettaglio §E mappa limiti.

## 9. Validazione submit fallito (29-05-26)

Quando il cliente clicca **Invia** con dati invalidi:

1. **`noValidate`** su `#booking-request-form` — obbligatorio se i campi hanno `required`; altrimenti il browser blocca `validate()` React.
2. **Chiudi** card ingredienti aperte (`dispatchBookingMenuComposeCollapse` + `composeCollapseNonce` + remount `MenuSelection`).
3. **Scroll** al primo errore (`scrollToBookingPublicError` in `bookingPublicFormAttention.ts`).
4. **Pulse arancione** sul wrapper del campo (`.booking-public-field-attention`) fino a click reale (`shouldDismissBookingPublicAttention` / `isTrusted`).
5. **Lunghezza testo cliente (03-06-26):** `validate()` controlla cap in `BOOKING_PUBLIC_CLIENT_TEXT_LIMITS` (`bookingPrenotaTextLimits.ts`) — nome, email, tel, intolleranze aggregate, richieste speciali, ospiti max. Messaggio unico **`Testo troppo lungo`**; nessun contatore in UI (cap silenzioso + edge `create-booking`).
6. Messaggi errore / privacy / riepilogo menù: palette condizionata da `publicFormLightTextOnDarkBackground` (`!showPhotoStrip && isFullPagePhoto`) — **bianco** solo su sfondo full-page foto; su striscia laterale / crema → warm-wood e rossi come pre-29-05 (helper in `bookingPublicFieldStyles.ts`).

**Guida per replicare su altri form/modali:** `FORM_VALIDATION_ATTENTION_PATTERN.md` (stesso folder).

---

## 10. Report di sessione collegati

- `docs/Sessioni di lavoro/25-05-26/Report-prenota-v2-ui-sessione-25-05-26.md`
- `docs/Sessioni di lavoro/29-05-26/Report-validazione-ux-prenota-29-05-26.md` (validazione UX + ancoraggio)
- `docs/Sessioni di lavoro/29-05-26/Report-revisione-validazione-ux-prenota-29-05-26.md` (Verifica)
- Sessioni 26-29/05 (carosello, sfondo, caselle, promo) — vedi `SESSION_LOG.md`.
