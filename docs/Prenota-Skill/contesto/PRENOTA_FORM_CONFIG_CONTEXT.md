---
name: booking-form-config-panel-cursor-context
description: >-
  Contesto obbligatorio per agenti Cursor che modificano la sezione admin
  Personalizza form della Pagina Prenota v2.
---

# Cursor Context — Personalizza Form Prenota

> Leggere prima di modificare `BookingFormConfigPanel`, `bookingPublicFormConfig`,
> `BookingRequestPage` o `restaurantSettingRegistry` per `booking_public_form_config`.

## Workflow consigliato

1. Leggi `APP_CONTEXT_SKILL.md` §4 RULE Pagina Prenota v2.
2. Leggi interamente:
   - `src/features/booking/components/settings/BookingFormConfigPanel.tsx`
   - `src/features/booking/components/settings/SettingsSaveUi.tsx`
   - `src/features/booking/constants/bookingPublicFormConfig.ts`
   - `src/features/booking/lib/restaurantSettingRegistry.ts`
   - `src/pages/BookingRequestPage.tsx`
3. Capisci se il cambio e solo UI admin o se cambia il JSON salvato in `booking_public_form_config`.
4. Se cambia il JSON, aggiorna insieme:
   - type/default/normalizer in `bookingPublicFormConfig.ts`
   - parse fallback in `restaurantSettingRegistry.ts`
   - render pubblico in `BookingRequestPage.tsx`
   - controllo admin in `BookingFormConfigPanel.tsx`
5. Mantieni la UI leggera: controlli vicini al campo, label brevi, anteprima sul campo stesso.
6. Esegui `npm run typecheck` e `npm run lint`.

## Stato attuale

### Salvataggio admin (Personalizza form + Anagrafica — pattern 29-05-26)

- UI: `SettingsSaveUi.tsx` — `SettingsSaveFooter` (~50% destra, mobile trasparente), `FieldAutosaveIndicator`, `UnsavedNavigationGuardModal`.
- **Niente `SectionActionBar`** sulle card standard. Eccezione: **Salva** in `commitSubTabEditor` (sottotab).
- **Autosave** (`useDebouncedSettingsAutosave`, toggle `VITE_SETTINGS_AUTOSAVE` in `src/config/settingsAutosave.ts`): dev ON, prod OFF (FU-004). Whitelist: `restaurant_name`, `contact_*`, `page_title`, `page_description` — non `header_styles`. Upsert `{ silent: true }` + invalidazione mirata per chiave.
- **Footer** quando dirty: orari/fasce/tema (Anagrafica), stili header/modalità/promo/sfondo (Personalizza form).
- **Promo** (`BookingFormPromoSection.tsx`): lista dirty → **Salva modifiche** footer; conflitto abbinamento → `PromoPlacementConflictDialog`. Logica: `menuPromo.ts`.
- **Sfondo pagina Prenota**: dirty nel footer Personalizza form unificato (`public_booking_strip_photo` / `public_booking_page_background`).
- **Guard:** `UnsavedChangesContext` + `confirmNavigation`. Sorgente unica `booking-form-config` (promo + sfondo inclusi). Reset su cambio `tenantId`.
- **Salva sottotab:** `commitSubTabEditor` — upsert parziale `booking_modes`.
- **Dettaglio promo (CRUD):** persistenza con footer; conflitto abbinamento → `PromoPlacementConflictDialog`. Vedi report promo 29-05-26.
- **Editor sottotab Card scorrevole** (`display === 'cards'`): titolo tecnico nell'editor aperto `Card N` / bozza `Nuova card · Card N` (o `Titolo · Card N` se già digitato); campo **Titolo card** (24) per il testo sulla Pagina Prenota — **vuoto** su nuova card (`newSubTab` → `label: ''`), placeholder **«Nome card scorrevole»**; **riempito** col nome del menù solo dopo scelta in **Importa menù preselezionato**; tornando a **Compila manualmente** (`preset_id` cleared) anche `label` si azzera. Select con tutti i `booking_custom_staff_presets`, senza filtro tipologia/visibilità. Descrizione breve (**79**); **Numero Portate** opzionale (`courses_label`, max **12**); Icona; «Categorie e ingredienti visibili» solo con `preset_id`; toggle **Menù personalizzabile** solo con `preset_id`; Prezzo (live preset se non personalizzato). `parseSubTabFromUnknown` accetta `label` vuoto sulle card.
- **Editor sottotab carosello** (`display === 'carousel'` + `BookingFormCarouselEditor`): flusso **foto-first**; campi per slide: **Testo Etichetta** → `eyebrow`, **Testo Titolo** → `title`, **Scegli Icona** → `icon`, **Testo Etichetta / Titolo / Descrizione** → `eyebrow` / `title` / `description` (max **19 / 18 / 38** — `BOOKING_CAROUSEL_SLIDE_TEXT_LIMITS` in `bookingPrenotaTextLimits.ts`). Migrazione dati legacy: `040_clamp_booking_carousel_slide_text_limits.sql` su `restaurant_settings.booking_public_form_config`. Intestazione slide: **Foto N° X** (ordine carosello, 1 = prima a sinistra). Pulsante matita **Modifica foto** (`replaceAt` su `useCarouselPhotoUpload`) accanto a rimuovi. **Blocco prezzo** (solo label + input €). **Sotto**, blocco toggle stile «Menù personalizzabile»: titolo «Mostra dettaglio offerta» + help `text-xs` solo lì; switch `show_offer_details_in_summary` a destra. **Non** è in `field_overrides`. Helper pubblici: `resolveCarouselSummaryDisplay`, `getCarouselStickyMiniPanelLine`. Riepilogo + sticky bar mobile seguono gli stessi helper. Nessun toggle fisso/personalizzabile. Upload bucket `menu-photos`, path dedicato Prenota `{tenantId}/booking-form/{modeId}/{subTabId}/carousel/{uuid}.webp` (non `qr/...`).
- **Sottotab salvate (card + carosello)** in lista: riga compatta con titolo da `getSubTabCollapsedRowTitle` — card: **`{label trimmato} · Card N`** o solo **`Card N`** se titolo vuoto; carosello: **Nome carosello** / `Carosello N`. Azioni nella testata; click apre/chiude (`expandedSubTabByMode`). Editor distinti: card = Titolo card + import preset + visibilità + toggle + prezzo; carosello = Nome carosello + `BookingFormCarouselEditor`. Titolo pubblico card solo da campo **Titolo card** (24). Carosello senza matita né frecce sposta sulle card. Ordine editor card: campi base → categorie → toggle personalizzabile → prezzo. **Salva** (`commitSubTabEditor`) chiude il pannello.
- **Help Card/Carosello** (`SubTabsDisplayHelpPanel`): pulsante collassabile **? Dettagli** subito sotto la riga «Abilita Card o Carosello»; visibile **sempre** (anche con toggle off). Chiuso: `?` + «Dettagli»; aperto: stesso pulsante espanso con elenco **Card scorrevole** vs Carosello. Editor sottotab solo se `sub_tabs_enabled`; disattivando il toggle si annullano bozze/editor aperti.
- **XOR card/carosello per modalità** (`sub_tabs_presentation: ‘cards’ | ‘carousel’ | null`):
  - `null` = nessuna scelta ancora → `SubTabAddButtons` mostra entrambi i pulsanti; alla prima aggiunta `sub_tabs_presentation` viene impostato automaticamente.
  - `’cards’` → `SubTabAddButtons` mostra solo «+ Card scorrevole» (N consentite per modalità).
  - `’carousel’` → **una sola card carosello per modalità con N foto dentro**: `SubTabAddButtons` mostra «+ Carosello» solo se non ne esiste già una (`carouselAlreadyExists`); difesa runtime in `addSubTab` blocca aggiunte duplicate per altre vie.
  - `SubTabsPresentationBadge` con «Modalità impostata» + link «Cambia presentazione» (richiede conferma + cancella sottotab esistenti).
  - `resetSubTabsPresentation(modeId)` azzera `sub_tabs_presentation` e `sub_tabs[]` senza toccare il DB finché non si Salva.
  - Migrazione legacy in `restaurantSettingRegistry.parseFromDb`: calcola `sub_tabs_presentation` dalla maggioranza di `sub_tabs[].display` (50/50 → ‘cards’).
  - **Pagina pubblica**: con `sub_tabs_presentation === 'carousel'` `BookingRequestForm` **non** renderizza `BookingSubTabCards` (la strip selettore) e auto-seleziona l'unica sottotab carosello via `useEffect`; viene mostrato direttamente `BookingSubTabCarousel`.
- **Aggiunta sottotab** (`SubTabAddButtons`): altezza responsive allineata alla riga toggle (`md:min-h-[3.125rem]`); sfondo fisso `bg-primary-50`, hover `bg-primary-100`. Nuova card: `label` iniziale **vuoto** (non «Card scorrevole»); il pulsante «+ Card scorrevole» è solo etichetta UI. Nascosto se bozza aperta (`!draftSubTab`).
- **Tracking personalizzazioni (`field_overrides`)**: ogni patch ai campi vetrina della sottotab (`label`, `description`, `price_per_person`, `hidden_item_ids`, `hidden_category_keys`) viene automaticamente marcato come «personalizzato» (`true`) da `applyPatchWithOverrideTracking`. **Importa menù preselezionato** azzera tutti gli override (`presetImportFieldOverrides()`), così cambi futuri al preset si propagano live alla pagina Prenota. Resolver in `src/features/booking/services/bookingFormResolver.ts` applicato lato pubblico in `BookingRequestForm.activeModeSubTabs`. Test: `src/features/booking/services/__tests__/bookingFormResolver.test.ts`.
- **Trim onBlur + contatore rosso**: `AdminFieldWithCharCount` (sia in `BookingFormConfigPanel` che in `BookingFormCarouselEditor`) applica `.trim()` al blur del campo e colora il contatore di rosso quando si raggiunge il `maxLength`. Lo slice onChange resta per evitare digitazione oltre il limite.
- **Validazione upload foto carosello** (`useCarouselPhotoUpload` in `src/features/booking/hooks/useCarouselPhotoUpload.ts`): tipo MIME ammesso (`image/jpeg|png|webp|avif`) + dimensione max `CAROUSEL_PHOTO_MAX_MB` (5 MB); toast errore con messaggio specifico se file rifiutato. Il hook è condiviso, ma ogni pagina passa un prefisso Storage separato.
- **Anagrafica Azienda** (`RestaurantSettingsTab`, tab Anagrafica): autosave su nome/contatti se attivo; footer per orari, fasce (Classic), tema.
- **Rimosso** il flusso «Conferma selezione sfondo» (pulsante dedicato, lock griglia, toast obbligatorio): lo sfondo si salva dal footer Personalizza form.

- Sezione admin: `BookingFormConfigPanel`, blocco **Intestazione pagina Prenota**.
- Campi testo:
  - nome azienda: solo lettura, letto da `restaurant_name`/tenant; modifica altrove in Anagrafica Azienda (**max 40** in Anagrafica).
  - titolo: `page_title` — **max 50** caratteri + contatore `N/max` in admin
  - descrizione: `page_description` — **max 120** caratteri + contatore
- Stile header pubblico:
  - `header_styles.restaurant_name`
  - `header_styles.page_title`
  - `header_styles.page_description`
- Ogni stile contiene:
  - `font`: id in `BOOKING_HEADER_FONT_OPTIONS` (Google Fonts OFL + **Mistral** solo sistema). Legacy DB `thirsty-script` → migrate-on-read a `dancing-script` (Dancing Script, Google).
  - `color`: hex `#RRGGBB`
  - `fontSize`: intero px; **min 8**; **max per target:** nome e titolo **38**, descrizione **22** (default: nome **34**, titolo **30**, descrizione **16**). Costanti in `bookingPrenotaTextLimits.ts` (`BOOKING_HEADER_FONT_SIZE_MAX_BY_TARGET`).
  - `fontWeight`: `normal` | `bold` — default bold su nome/titolo, normal su descrizione
  - `textDecoration`: `none` | `underline` — default `none`
  - `textAlign?`: `left` | `center` | `right`
- Script (Lobster, Pacifico, Great Vibes, Dancing Script): `fontFamily` con fallback `cursive` generico (non altri font della lista).
- Admin: `renderHeaderStyleControls` — Font, Colore, Dimensione, Allineamento + toggle **G** (grassetto) / **S** (sottolineato). Anteprima solo sul campo testo.
- Pubblico: `getBookingHeaderTextStyle` → `fontFamily`, `fontSize`, `fontWeight`, `textDecoration`, `textAlign` (niente `font-bold` fisso su `BookingRequestPage`).

## Sottotab Prenota

- Le sottotab stanno in `booking_public_form_config.booking_modes[].sub_tabs[]`.
- Non usare piu la vecchia distinzione salvata `type: preset|manual`: la scelta admin e `display: 'cards' | 'carousel'`.
- **Pagina Prenota pubblica:** sottotab `display: 'carousel'` → solo carosello (`carousel_items`); **nessuna** griglia `MenuSelection` sotto. Sottotab `display: 'cards'` → card + griglia menù (se tipologia con menù).
- I dati visuali **Card scorrevole** sono sulla sottotab: `label`, `description`, `courses_label`, `price_per_person`, `is_fixed_menu`, `hidden_*`, `preset_id`.
- Il **Carosello** salva testi/icona per slide in `carousel_items[]` (`eyebrow`, `title`, `description`, `icon`); il titolo tecnico nell'editor (campo admin **Nome carosello** = `sub_tabs[].label`) è modificabile e non viene sovrascritto dai testi slide né dal normalizer; può salvare `price_per_person` e in Prenota quel prezzo viene usato come prezzo a persona.
- `preset_id` collega un menu preselezionato solo per precompilare gli ingredienti del form pubblico. Importare un preset in Personalizza form compila i campi della card (nome preset come etichetta iniziale), ma non modifica `booking_custom_staff_presets` nella tab Menu.
- **Titolo pubblico (card scorrevole + `h2` menù):** sempre `sub_tabs[].label` (campo admin **Titolo card**, max 24), mai il titolo tecnico `Card N` né il nome del preset staff se l’etichetta è stata personalizzata. `MenuSelection` riceve `presetSectionTitle` dalla sottotab attiva; `BookingSubTabCards` legge `tab.label`. Helper `applyLegacySubTabLabelOverrides` in `bookingPublicFormConfig.ts`: se in DB resta `label` = nome preset ma esiste ancora `sub_tabs_overrides[].custom_label`, usa l’override fino al prossimo salvataggio admin (che azzera `sub_tabs_overrides`).
- **Titolo sopra ingredienti:** `MenuSelection` mostra **Crea il tuo menù** solo quando la card e davvero personalizzabile. Se il toggle **Menù personalizzabile** e off, il titolo deve essere la label della card o, in fallback, il nome del menù preselezionato.
- **Categorie ingredienti pubblico:** `BookingMenuCategoryCard` parte chiusa con foto categoria e nome categoria; al click la foto categoria sparisce e viene mostrata la lista ingredienti della categoria. Un nuovo click sull'intestazione categoria richiude la lista e ripristina la foto categoria. Quando cambia card/preset selezionato, le categorie tornano chiuse.
- **Responsive card scorrevoli:** in `BookingSubTabCards`, mobile e tablet mostrano l'icona grande centrata nell'area descrizione; il testo descrizione della card si mostra solo da desktop (`lg`).
- Dopo il salvataggio da Personalizza form, `persistModesSection` salva solo `sub_tabs[]` (campo legacy `sub_tabs_overrides` rimosso dal JSON). La tab Menu resta fonte di verità per gli ingredienti del preset.
- Migrazione runtime: `migrateLegacyCarouselSubTab` in `bookingPublicFormConfig.ts` (testi da sottotab → prima slide; azzera prezzo/descrizione carosello).

### Overlay pubblico carosello (`BookingSubTabCarousel`)

Componente: `BookingRequestForm.tsx` → `BookingSubTabCarousel({ subTab })`.

**Non** usare fallback «Specialità della casa» (Menu QR). Overlay **per slide** da `carousel_items[i]`:

| Campo admin (UI) | Chiave JSON | Overlay |
|------------------|-------------|---------|
| Testo Etichetta | `carousel_items[i].eyebrow` | Riga maiuscola |
| Testo Titolo | `carousel_items[i].title` | Titolo |
| Testo Descrizione | `carousel_items[i].description` | Corpo |
| Foto | `carousel_items[i].image_url` | Sfondo |

**Prezzo carosello**: non viene mostrato sulle singole slide; se `sub_tabs[].price_per_person` è impostato, il riepilogo (`BookingSummarySidebar`) mostra prezzo a persona, numero ospiti e totale. Titoli slide in «Offerta selezionata» solo se `resolveCarouselSummaryDisplay` restituisce `kind: 'titles'`. Sticky bar (`BookingStickyBar`, &lt;1256px): riga testo piano troncata da `getCarouselStickyMiniPanelLine` (no label, no chip).

Report: `docs/Sessioni di lavoro/26-05-26/Report-carosello-editor-per-slide-26-05-26.md`.

## Font header

Fonte unica: `BOOKING_HEADER_FONT_OPTIONS` in `bookingPublicFormConfig.ts`.

Per aggiungere un font:
1. Aggiungi `{ id, label, fontFamily }` a `BOOKING_HEADER_FONT_OPTIONS`.
2. Se e un Google Font libero, aggiungi la famiglia all'`@import` in `src/index.css`.
3. Se e un font solo di sistema (es. Mistral), non incorporare file senza licenza: nome + fallback script di sistema, mai altri font del menu nella catena.
4. Verifica che `parseBookingHeaderStylesFromUnknown` accetti il nuovo id automaticamente.

Per rimuovere un font:
1. Rimuovilo da `BOOKING_HEADER_FONT_OPTIONS`.
2. Se era caricato solo per quello, rimuovilo dall'`@import` in `src/index.css`.
3. Lascia il parser com'e: valori salvati non piu ammessi tornano ai default.

Font attuali (17): Playfair, Cormorant, Libre Baskerville, Cinzel, Montserrat, Lora, Raleway, DM Serif Display, Merriweather, Poppins, Lobster, Pacifico, Great Vibes, **Dancing Script** (Google), Mistral (solo se installato sul dispositivo).

## Icone (tipologia, card scorrevoli, slide carosello)

- **Catalogo unico** con il modale Menù QR: `MENU_QR_CATEGORY_ICON_OPTIONS` (~20 icone) in
  `src/features/public-menu/categoryIcons.ts`; namespace `MenuQrCategoryIconKey`.
- **Picker admin condiviso:** `MenuCategoryIconPicker` (griglia Phosphor + «Altre icone» Lucide) in
  `BookingFormConfigPanel` (tipologia + card scorrevoli) e `BookingFormCarouselEditor` (slide).
  Stesso componente nel modale QR (`MenuHomepageConfigPanel`).
- **Pubblico:** `MenuQrCategoryIconGlyph` in `BookingModeCards`, `BookingSubTabCards`, overlay
  carosello in `BookingRequestForm` — niente `ModeIcon` / `SubTabCardIcon` duplicati.
- **Storage:** `booking_modes[].icon`, `sub_tabs[].icon`, `carousel_items[].icon` (JSON
  `booking_public_form_config`). Migrate-on-read: `BOOKING_LEGACY_ICON_TO_MENU_QR_KEY` +
  `resolveBookingStoredIconKey` in parser/normalizer; migrate-on-write solo al **Salva** admin
  (`normalizeBookingPublicFormConfig`), mai in background al load.
- **Fallback legacy documentati:** `cloche` → `bowl_food`; `star` → `lucide_salad`
  (`MENU_QR_DEFAULT_CATEGORY_ICON_KEY`).
- Per aggiungere/rimuovere un'icona: aggiornare `categoryIcons.ts` (Phosphor/Lucide options) — il
  picker e il pubblico seguono automaticamente.

## Limiti testo (03-06-26)

Tabella 1:1: **`PRENOTA_TEXT_LIMITS_MAP.md`**. Costanti: `src/features/booking/constants/bookingPrenotaTextLimits.ts`.

| Area admin | Limiti chiave |
|------------|---------------|
| Header | titolo **50**, descrizione **120**, font descrizione **8–22px** |
| Tipologie | titolo **40**, descrizione **61** |
| Sottotab card | titolo **24**, descrizione **79**, portate **12** (non in pubblico) |
| Carosello slide | **19 / 18 / 38** (`BOOKING_CAROUSEL_SLIDE_TEXT_LIMITS`) |
| Promo (setting separato) | titolo **60**, messaggio **200** |

**Form cliente pubblico:** vietato contatore o hint limite; cap in `BOOKING_PUBLIC_CLIENT_TEXT_LIMITS` (edge sync).

## Cosa evitare

- Non aggiungere un secondo blocco di anteprima sotto i campi header.
- Non duplicare validazioni del parser dentro il componente.
- Non usare font commerciali via `@font-face` o CDN non ufficiale senza licenza verificata.
