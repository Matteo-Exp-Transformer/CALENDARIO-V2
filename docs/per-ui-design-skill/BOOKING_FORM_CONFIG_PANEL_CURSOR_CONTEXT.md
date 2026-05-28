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

### Salvataggio admin (Personalizza form)

- UI condivisa in `src/features/booking/components/settings/SettingsSaveUi.tsx` (`FormSectionFloatingActions`, `SectionActionBar`, `SettingsSaveFooter`).
- Tre sezioni con barra azioni sopra la card (`FormSectionFloatingActions` + `SectionActionBar`):
  1. **Intestazione pagina Prenota** — salva/annulla solo `page_title`, `page_description`, `header_styles` in `booking_public_form_config`.
  2. **Modalità di prenotazione** — salva/annulla solo `booking_modes` (e sottotab).
  3. **Sfondo pagina Prenota** — salva/annulla `public_booking_strip_photo` per la striscia laterale e `public_booking_page_background` per lo sfondo a pagina intera (`RestaurantSettingsTab` passa handler al panel). La card mostra due pulsanti: **Striscia laterale** (foto `strip-01`…`strip-06` da `public/asset/strip`, colonna sinistra visibile da 900px) e **Pagina intera** (foto `full-01`…`full-06` da `public/asset/sfondo intero`, senza colonna laterale nella pagina pubblica).
- **Footer** in fondo (`pageHasUnsaved`, componente `SettingsSaveFooter`): compare solo se almeno una sezione ha modifiche; **Salva modifiche** / **Annulla tutte le modifiche** su tutta la tab Personalizza form.
- **Salva** dentro l'editor di una sottotab (card/carosello): `commitSubTabEditor` — upsert parziale di `booking_modes` in `booking_public_form_config`, chiude l'editor, `modesDirty` false; non richiede il Salva della card Modalità per quella sottotab.
- **Editor sottotab Card scorrevole** (`display === 'cards'`): titolo tecnico `Card N` solo per orientare l'admin; campo **Titolo card** (30) separato per il testo mostrato in pagina Prenota, **riempito automaticamente** col nome del menù quando importi un menù preselezionato; **Importa menù preselezionato** (select con tutti i `booking_custom_staff_presets`, senza filtro tipologia/visibilità); Descrizione breve (80); **Numero Portate** opzionale (`courses_label`, max 40, testo libero con numeri); Icona; sezione «Categorie e ingredienti visibili» solo con `preset_id`; toggle **Menù personalizzabile** solo con `preset_id`; Prezzo. Se il prezzo non è personalizzato, il campo mostra il prezzo live del menù preselezionato; appena Mario lo cambia, `field_overrides.price_per_person=true` e la Pagina Prenota usa il prezzo della card.
- **Editor sottotab carosello** (`display === 'carousel'` + `BookingFormCarouselEditor`): flusso **foto-first**; campi per slide: **Testo Etichetta** → `eyebrow`, **Testo Titolo** → `title`, **Scegli Icona** → `icon`, **Testo Etichetta / Titolo / Descrizione** → `eyebrow` / `title` / `description` (max **19 / 18 / 38** — `BOOKING_CAROUSEL_SLIDE_TEXT_LIMITS` in `bookingPublicFormConfig.ts`). Migrazione dati legacy: `040_clamp_booking_carousel_slide_text_limits.sql` su `restaurant_settings.booking_public_form_config`. Intestazione slide: **Foto N° X** (ordine carosello, 1 = prima a sinistra). Pulsante matita **Modifica foto** (`replaceAt` su `useCarouselPhotoUpload`) accanto a rimuovi. **Blocco prezzo** (solo label + input €). **Sotto**, blocco toggle stile «Menù personalizzabile»: titolo «Mostra dettaglio offerta» + help `text-xs` solo lì; switch `show_offer_details_in_summary` a destra. **Non** è in `field_overrides`. Helper pubblici: `resolveCarouselSummaryDisplay`, `getCarouselStickyMiniPanelLine`. Riepilogo + sticky bar mobile seguono gli stessi helper. Nessun toggle fisso/personalizzabile. Upload bucket `menu-photos`, path dedicato Prenota `{tenantId}/booking-form/{modeId}/{subTabId}/carousel/{uuid}.webp` (non `qr/...`).
- **Sottotab salvate (card + carosello)** in lista: riga compatta con titolo tecnico (`Card N` / `Carosello N`) e azioni nella testata; click sulla riga apre/chiude (`expandedSubTabByMode`). I due editor restano distinti: card usa campi titolo/import preset/visibilita/toggle/prezzo; carosello usa **Nome carosello** (admin) + prezzo + `BookingFormCarouselEditor` per slide. Le card modificano il titolo pubblico solo tramite campo **Titolo card** (30), non dalla testata tecnica; il carosello mostra il **Nome carosello** (fallback `Carosello N`), senza matita né frecce sposta. Nelle card, ordine editor: campi base → categorie/ingredienti → toggle **Menù personalizzabile** → prezzo. (Nota UI: Icona è sotto la Descrizione breve.) Card e carosello hanno blocchi prezzo separati, allineati a sinistra nel form, con simbolo `€` dentro il campo e senza testo descrittivo sotto. **Salva** (`commitSubTabEditor`) chiude il pannello.
- **Help Card/Carosello** (`SubTabsDisplayHelpPanel`): pulsante collassabile **? Dettagli** subito sotto la riga «Abilita Card o Carosello»; visibile **sempre** (anche con toggle off). Chiuso: `?` + «Dettagli»; aperto: stesso pulsante espanso con elenco **Card scorrevole** vs Carosello. Editor sottotab solo se `sub_tabs_enabled`; disattivando il toggle si annullano bozze/editor aperti.
- **XOR card/carosello per modalità** (`sub_tabs_presentation: ‘cards’ | ‘carousel’ | null`):
  - `null` = nessuna scelta ancora → `SubTabAddButtons` mostra entrambi i pulsanti; alla prima aggiunta `sub_tabs_presentation` viene impostato automaticamente.
  - `’cards’` → `SubTabAddButtons` mostra solo «+ Card scorrevole» (N consentite per modalità).
  - `’carousel’` → **una sola card carosello per modalità con N foto dentro**: `SubTabAddButtons` mostra «+ Carosello» solo se non ne esiste già una (`carouselAlreadyExists`); difesa runtime in `addSubTab` blocca aggiunte duplicate per altre vie.
  - `SubTabsPresentationBadge` con «Modalità impostata» + link «Cambia presentazione» (richiede conferma + cancella sottotab esistenti).
  - `resetSubTabsPresentation(modeId)` azzera `sub_tabs_presentation` e `sub_tabs[]` senza toccare il DB finché non si Salva.
  - Migrazione legacy in `restaurantSettingRegistry.parseFromDb`: calcola `sub_tabs_presentation` dalla maggioranza di `sub_tabs[].display` (50/50 → ‘cards’).
  - **Pagina pubblica**: con `sub_tabs_presentation === 'carousel'` `BookingRequestForm` **non** renderizza `BookingSubTabCards` (la strip selettore) e auto-seleziona l'unica sottotab carosello via `useEffect`; viene mostrato direttamente `BookingSubTabCarousel`.
- **Aggiunta sottotab** (`SubTabAddButtons`): altezza responsive allineata alla riga toggle (`md:min-h-[3.125rem]`); sfondo fisso `bg-primary-50`, hover `bg-primary-100`. Label default nuova card: «Card scorrevole» (`display: ‘cards’`). Il pulsante aggiunta è nascosto se c’è già una bozza aperta (`!draftSubTab`).
- **Tracking personalizzazioni (`field_overrides`)**: ogni patch ai campi vetrina della sottotab (`label`, `description`, `price_per_person`, `hidden_item_ids`, `hidden_category_keys`) viene automaticamente marcato come «personalizzato» (`true`) da `applyPatchWithOverrideTracking`. **Importa menù preselezionato** azzera tutti gli override (`presetImportFieldOverrides()`), così cambi futuri al preset si propagano live alla pagina Prenota. Resolver in `src/features/booking/services/bookingFormResolver.ts` applicato lato pubblico in `BookingRequestForm.activeModeSubTabs`. Test: `src/features/booking/services/__tests__/bookingFormResolver.test.ts`.
- **Trim onBlur + contatore rosso**: `AdminFieldWithCharCount` (sia in `BookingFormConfigPanel` che in `BookingFormCarouselEditor`) applica `.trim()` al blur del campo e colora il contatore di rosso quando si raggiunge il `maxLength`. Lo slice onChange resta per evitare digitazione oltre il limite.
- **Validazione upload foto carosello** (`useCarouselPhotoUpload` in `src/features/booking/hooks/useCarouselPhotoUpload.ts`): tipo MIME ammesso (`image/jpeg|png|webp|avif`) + dimensione max `CAROUSEL_PHOTO_MAX_MB` (5 MB); toast errore con messaggio specifico se file rifiutato. Il hook è condiviso, ma ogni pagina passa un prefisso Storage separato.
- **Anagrafica Azienda** (`RestaurantSettingsTab`, tab Anagrafica): quattro sezioni con barra azioni sopra la card (`FormSectionFloatingActions` + `SectionActionBar`): **Anagrafica Azienda** (nome + contatti), **Orari di apertura** (`business_hours`), **Imposta Fasce Orarie** (Classic, `service_slots` + capacità), **Selezione tema app** (`app_theme`). Footer globale (`SettingsSaveFooter`) se resta almeno una sezione dirty.
- **Rimosso** il flusso «Conferma selezione sfondo» (pulsante dedicato, lock griglia, toast obbligatorio): lo sfondo si salva con Salva della sezione o footer.
- Guard navigazione: `UnsavedChangesContext` (`booking-form-config`, `restaurant-booking-bg`).

- Sezione admin: `BookingFormConfigPanel`, blocco **Intestazione pagina Prenota**.
- Campi testo:
  - nome azienda: solo lettura, letto da `restaurant_name`/tenant; modifica altrove in Anagrafica Azienda.
  - titolo: `page_title`
  - descrizione: `page_description`
- Stile header pubblico:
  - `header_styles.restaurant_name`
  - `header_styles.page_title`
  - `header_styles.page_description`
- Ogni stile contiene:
  - `font`: id presente in `BOOKING_HEADER_FONT_OPTIONS`
  - `color`: hex `#RRGGBB`
- Nome azienda e titolo pubblico hanno la stessa scala grande; descrizione resta piu piccola. Non lasciare che il font scelto cambi la gerarchia dimensionale.

## Sottotab Prenota

- Le sottotab stanno in `booking_public_form_config.booking_modes[].sub_tabs[]`.
- Non usare piu la vecchia distinzione salvata `type: preset|manual`: la scelta admin e `display: 'cards' | 'carousel'`.
- **Pagina Prenota pubblica:** sottotab `display: 'carousel'` → solo carosello (`carousel_items`); **nessuna** griglia `MenuSelection` sotto. Sottotab `display: 'cards'` → card + griglia menù (se tipologia con menù).
- I dati visuali **Card scorrevole** sono sulla sottotab: `label`, `description`, `courses_label`, `price_per_person`, `is_fixed_menu`, `hidden_*`, `preset_id`.
- Il **Carosello** salva testi/icona per slide in `carousel_items[]` (`eyebrow`, `title`, `description`, `icon`); il titolo tecnico nell'editor (campo admin **Nome carosello** = `sub_tabs[].label`) è modificabile e non viene sovrascritto dai testi slide né dal normalizer; può salvare `price_per_person` e in Prenota quel prezzo viene usato come prezzo a persona.
- `preset_id` collega un menu preselezionato solo per precompilare gli ingredienti del form pubblico. Importare un preset in Personalizza form compila i campi della card (nome preset come etichetta iniziale), ma non modifica `booking_custom_staff_presets` nella tab Menu.
- **Titolo pubblico (card scorrevole + `h2` menù):** sempre `sub_tabs[].label` (campo admin **Titolo card**, max 30), mai il titolo tecnico `Card N` né il nome del preset staff se l’etichetta è stata personalizzata. `MenuSelection` riceve `presetSectionTitle` dalla sottotab attiva; `BookingSubTabCards` legge `tab.label`. Helper `applyLegacySubTabLabelOverrides` in `bookingPublicFormConfig.ts`: se in DB resta `label` = nome preset ma esiste ancora `sub_tabs_overrides[].custom_label`, usa l’override fino al prossimo salvataggio admin (che azzera `sub_tabs_overrides`).
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
3. Se e un font commerciale o locale (es. Mistral, Thirsty Script), non incorporare file font senza licenza: usa il nome font + fallback CSS.
4. Verifica che `parseBookingHeaderStylesFromUnknown` accetti il nuovo id automaticamente.

Per rimuovere un font:
1. Rimuovilo da `BOOKING_HEADER_FONT_OPTIONS`.
2. Se era caricato solo per quello, rimuovilo dall'`@import` in `src/index.css`.
3. Lascia il parser com'e: valori salvati non piu ammessi tornano ai default.

Font attuali:
- Playfair Display
- Cormorant Garamond
- Libre Baskerville
- Cinzel
- Montserrat
- Mistral (fallback locale/script, non webfont incorporato)
- Thirsty Script (fallback locale/script, non webfont incorporato)

## Icone modalita

- Fonte unica: `BOOKING_MODE_ICONS`.
- Render pubblico e admin usano Phosphor outline.
- Se aggiungi/rimuovi un'icona, aggiorna `BOOKING_MODE_ICONS`, `ICON_OPTIONS`, `ModeIcon` admin e `ModeIcon` pubblico.

## Cosa evitare

- Non aggiungere un secondo blocco di anteprima sotto i campi header.
- Non duplicare validazioni del parser dentro il componente.
- Non salvare dimensioni font configurabili per l'header pubblico senza richiesta esplicita: la gerarchia visuale e governata dal layout.
- Non usare font commerciali via `@font-face` o CDN non ufficiale senza licenza verificata.
