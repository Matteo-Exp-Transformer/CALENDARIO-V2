# Pagina Prenota v2 — Layout & comportamento (context)

> Mappa di dettaglio della pagina pubblica di prenotazione (`/prenota/:slug`). Caricala quando il
> task tocca layout, griglia striscia, sfondo, header, ordine form, caselle, card ingredienti,
> sidebar riepilogo o sticky bar della pagina Prenota. Per la **configurazione admin** (Personalizza
> form) vedi `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md`; per il **flusso dati** (resolver,
> field_overrides) vedi `BOOKING_DATA_FLOW_SKILL.md`.

> **Trigger di routing:** «Pagina Prenota» · «form prenotazione clienti» → questo file +
> `UI_RESPONSIVE_SKILL` / `UI_EDIT_SKILL`.

---

## 0. LOCK struttura griglia

**`BookingRequestPage.tsx` — struttura griglia con striscia laterale**: il layout a 2 colonne
`[striscia foto | contenuto]` con `BookingPhotoStrip` sticky è consolidato e testato su 3
breakpoint. Prima di qualsiasi modifica a `BookingRequestPage.tsx` un agente DEVE:
1. valutare se il task può essere risolto toccando solo componenti figli (`BookingRequestForm`,
   `BookingSummarySidebar`, `BookingStickyBar`, footer) senza toccare la griglia esterna — se sì,
   procedere su quei componenti;
2. se è necessario toccare la griglia, leggere per intero `BookingRequestPage.tsx` +
   `BookingPhotoStrip.tsx` + `BookingSummarySidebar.tsx` + `BookingRequestForm.tsx` prima di editare;
3. non alterare mai questi invarianti: griglia esterna `w-full` senza `mx-auto/max-w-*`;
   `BookingPhotoStrip` resta `sticky top-0 h-screen` nella colonna sinistra; footer fuori dalla
   griglia come ultimo figlio del wrapper `flex-col`; spacer `h-20 min-[1256px]:h-4` come ultimo
   elemento della colonna destra (sticky bar sotto 1256px).
Qualsiasi modifica che viola uno di questi punti va discussa con l'utente prima di procedere.

---

## 1. Layout esterno (griglia striscia)

**Layout esterno opzionale a 2 colonne da 900px** in `BookingRequestPage`: se
`public_booking_strip_photo` è valorizzato, usa `min-[900px]:grid-cols-[25vw_1fr]` — colonna sx =
striscia foto verticale sticky; colonna dx = header + form + sticky bar. Se è `null`, la pagina
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

- **Modalità striscia:** quando `public_booking_strip_photo` è valorizzato, il root ignora
  `public_booking_page_background` e applica tinta crema `#faf7f1` (`STRIP_MODE_PAGE_BG`).
- **Modalità full-page:** l'immagine `public_booking_page_background` (`full-01`…`full-06` via
  `bookingFullPageBackgroundPublicHref`) o i fallback legacy si applicano alla viewport **solo**
  quando la striscia è disattivata. Le card del form restano bianche/opache in entrambe.
- `public_booking_page_background` **non accetta** `strip-01`…`strip-06`: quelle appartengono solo
  a `public_booking_strip_photo`.
- **Vincolo NOT NULL su `restaurant_settings.setting_value`:** "Nessuna striscia" si scrive come
  stringa vuota `''`, non `NULL` (colonna `NOT NULL`). Serializer in
  `restaurantSettingRegistry.public_booking_strip_photo.serializeToDb`: `null` JS → `''`; parser
  `parseBookingStripPhotoFromDb`: `''` → `null` JS. Stesso pattern per ogni futuro setting scalare
  opzionale.
- **Asset preset sfondo (28-05-26):** striscia 6 preset `strip-01..06` →
  `public/asset/strip/strip-NN.{png|webp}` (`STRIP_PHOTO_EXTENSIONS`: 01-03 PNG legacy, 04-06 WebP
  HD 1440×4320). Pagina intera 3 preset `full-01..03` in **due varianti WebP**:
  `…/full-NN-landscape.webp` (2560×1440, ≥768px) + `full-NN-portrait.webp` (1440×2560, <768px).
  Helper `bookingFullPageBackgroundPublicHref(id, base, orientation?)` default landscape. Applicate
  via due `<div absolute inset-0 -z-10>` (portrait `md:hidden`, landscape `hidden md:block`) con
  `background-size: 100% auto`, `top center`, `no-repeat` — **scrollano col documento**; sotto la
  foto resta il fallback crema del root (no `cover` su documento lungo = no zoom eccessivo).
- **Stacking context sfondo (31-05-26)**:
  1. root `BookingRequestPage` = `relative isolate` + colore fallback crema/marrone;
  2. sfondo foto/tile/gradiente = layer `absolute inset-0 -z-10` (altezza = root che cresce con form+footer);
  3. wrapper contenuto = `relative z-10 w-full`.
- **Tile legacy + gradiente** — stesso layer `absolute` scrollabile; gradiente `background-size: 100% 100%`
  (non `cover` sul root).

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
- **Sticky bar mobile** (`BookingStickyBar`): solo sotto **1256px**, fixed bottom, z-200. Appare
  quando `BookingSummarySidebar` esce dalla viewport (IntersectionObserver +
  `onVisibilityChange`). Mini-panel «Riepilogo Prenotazione» + valori chiave + submit. Con sottotab
  carosello aggiunge una riga di testo (`getCarouselStickyMiniPanelLine`). Click → overlay
  bottom-sheet (z-300, max-h-90vh). Colori via CSS custom properties + `color-mix` (si adattano al
  tema). Submit split: sidebar mostra `submitButton` sotto 1256px (`block min-[1256px]:hidden`); il
  pulsante grande in `BookingRequestForm` è `hidden min-[1256px]:flex`. Pulsanti usano
  `type="submit" form="booking-request-form"`. `BookingRequestForm` espone `onIsDisabledChange`.
- **Gap pulsante/sidebar → footer:** spacer `<div className="h-20 min-[1256px]:h-4" aria-hidden />`
  in `BookingRequestPage`.
- Quando si apre la griglia ingredienti, il riepilogo **non** scorre fuori schermo e non mostra
  frecce di riapertura (comportamento vecchio rimosso).

## 5. Ordine del form (v2 attuale)

1. **Tipologia** (`BookingModeCards`): 3 colonne compatte su mobile, descrizione solo da `sm+`;
   icone Phosphor outline configurabili (`BOOKING_MODE_ICONS`).
2. **Sottotab** (`BookingSubTabCards`): scrollabili, frecce desktop + touch; icona centrata **senza
   sfondo**, **descrizione mai nella card** (appare solo in `MenuSelection` dopo selezione); prezzo
   `/persona` solo se presente e menu fisso. Centratura: `justify-center` su flex interno (1-3 card
   centrate; 4+ scroll). Wrapper diviso outer `overflow-x-auto scrollbar-hide` + inner
   `flex flex-nowrap justify-center mx-auto` (evita bug `justify-center` che blocca scroll). Max 3
   colonne (`bookingPublicRowCardWidthClass`).
3. **Presentazione XOR** (`BookingMode.sub_tabs_presentation: 'cards'|'carousel'|null`): filtro
   difensivo in `activeModeSubTabs`. Se `display='carousel'`: mostra **solo** `BookingSubTabCarousel`
   (foto + overlay per slide da `carousel_items[].eyebrow/title/description`; prezzo opzionale;
   nessuna griglia menù). Carosello = **una sola card con N foto** per modalità: `BookingSubTabCards`
   non renderizzato per modalità carosello (auto-selezione sottotab unica + carosello diretto).
4. **Menù** (se `display='cards'`): `MenuSelection` → `BookingMenuComposeGrid`. Mobile: colonna stack
   `BookingMenuCategoryCard`, header con miniatura 76px a filo bordo. Desktop md+: griglia (con 3
   categorie `grid-cols-3` già da `md`); card senza `max-w-[320px]`, piena larghezza colonna.
5. **Dati cliente** (`BookingFormFields` + `DietaryRestrictionsSection` con `BookingPublicInsetField`:
   label dentro la card in alto a sx, valore sotto; data/ora con `BookingPublicDateTimePickers`
   (bottom sheet mobile / popover desktop, `TimePicker24h`). Larghezza `BOOKING_PUBLIC_CONTENT_WIDTH`
   = `w-full min-w-0`. **Nessun** banner «Menù fisso» — solo UI read-only se `is_fixed_menu`.

### Titolo card e menù fisso
- Titolo pubblico sottotab = `sub_tabs[].label` (campo «Titolo card»);
  `applyLegacySubTabLabelOverrides` per legacy; salvataggio modalità azzera `sub_tabs_overrides`.
- `MenuSelection`: titolo "Crea il tuo menu" solo se card personalizzabile (`is_fixed_menu === false`
  / `menuSelectionLocked === false`); se fisso mostra label/nome menù preselezionato.
- Se `is_fixed_menu !== false` e `price_per_person > 0`: riepilogo/submit usano prezzo × ospiti (non
  somma piatti) e mostrano totale ingredienti barrato come confronto; senza prezzo o
  `is_fixed_menu === false` nessun riepilogo prezzo.
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
- **Griglia campi (28-05-26):** ordine Nome → **Ora | Ospiti** (`sm:grid-cols-2`) → **Telefono**
  full-width → **Data | Email** (`sm:grid-cols-[minmax(0,1fr)_9rem_7rem]`, Email in `sm:col-span-2`).
  Label "Data \*". Mobile <640px colonna singola. Non tornare a `1fr` fisso per Data.
- **Multiline (28-05-26):** `BookingPublicInsetField` con `multiline` usa
  `BOOKING_PUBLIC_FIELD_BOX_MULTILINE` (label sopra, textarea sotto): cresce con `scrollHeight`,
  testo a sx (`resize-none overflow-hidden`). In `DietaryRestrictionsSection`: «Intolleranze o
  esigenze alimentari» e «Altre Richieste».
- **Validazione:** email `isValidEmail()`, telefono `isValidPhone()` (`utils/validation.ts`);
  `maxLength` nome 60, email 120, telefono 20, intolleranze 300. `BookingFormFields` usa
  `autoComplete`/`inputMode` HTML5.
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

### Riepilogo carosello (summary display)
Per `display='carousel'` il resolver mantiene `price_per_person` sulla sottotab; in Prenota
`resolveCarouselSummaryDisplay` / `getCarouselStickyMiniPanelLine` (`bookingPublicFormConfig.ts`)
governano sidebar e mini-pannello sticky: toggle dettaglio ON + titoli slide → «Offerta
selezionata» + lista; altrimenti solo prezzo se `price_per_person > 0` (anche con toggle ON ma
senza titoli); toggle OFF senza prezzo → nessuna sezione offerta. Campo
`show_offer_details_in_summary` su `sub_tabs[]`; editor carosello in `BookingFormConfigPanel`
(blocco prezzo separato + toggle «Mostra dettaglio offerta»). Carosello pubblico: swipe/scroll
mobile + frecce laterali da desktop/tablet con ≥2 foto.

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

## 9. Validazione submit fallito (29-05-26)

Quando il cliente clicca **Invia** con dati invalidi:

1. **`noValidate`** su `#booking-request-form` — obbligatorio se i campi hanno `required`; altrimenti il browser blocca `validate()` React.
2. **Chiudi** card ingredienti aperte (`dispatchBookingMenuComposeCollapse` + `composeCollapseNonce` + remount `MenuSelection`).
3. **Scroll** al primo errore (`scrollToBookingPublicError` in `bookingPublicFormAttention.ts`).
4. **Pulse arancione** sul wrapper del campo (`.booking-public-field-attention`) fino a click reale (`shouldDismissBookingPublicAttention` / `isTrusted`).
5. Messaggi errore / privacy / riepilogo menù: palette condizionata da `publicFormLightTextOnDarkBackground` (`!showPhotoStrip && isFullPagePhoto`) — **bianco** solo su sfondo full-page foto; su striscia laterale / crema / gradiente → warm-wood e rossi come pre-29-05 (helper in `bookingPublicFieldStyles.ts`).

**Guida per replicare su altri form/modali:** `FORM_VALIDATION_ATTENTION_PATTERN.md` (stesso folder).

---

## 10. Report di sessione collegati

- `docs/Sessioni di lavoro/25-05-26/Report-prenota-v2-ui-sessione-25-05-26.md`
- `docs/Sessioni di lavoro/29-05-26/Report-validazione-ux-prenota-29-05-26.md` (validazione UX + ancoraggio)
- `docs/Sessioni di lavoro/29-05-26/Report-revisione-validazione-ux-prenota-29-05-26.md` (Verifica)
- Sessioni 26-29/05 (carosello, sfondo, caselle, promo) — vedi `SESSION_LOG.md`.
