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
  3. **Sfondo pagina Prenota** — salva/annulla solo `public_booking_page_background` (`RestaurantSettingsTab` passa handler al panel).
- **Footer** in fondo (`pageHasUnsaved`, componente `SettingsSaveFooter`): compare solo se almeno una sezione ha modifiche; **Salva modifiche** / **Annulla tutte le modifiche** su tutta la tab Personalizza form.
- **Salva** dentro l'editor di una sottotab (card/carosello): `commitSubTabEditor` — upsert parziale di `booking_modes` in `booking_public_form_config`, chiude l'editor, `modesDirty` false; non richiede il Salva della card Modalità per quella sottotab.
- **Editor sottotab Card scorrevole** (`display === 'cards'`): Etichetta card (60), Icona, **Importa menù preselezionato** (select da `booking_custom_staff_presets` filtrati per `booking_type` della modalità), Prezzo, Descrizione breve (80); sezione «Categorie e ingredienti visibili» solo con `preset_id`. Re-import preset **non** sovrascrive un’etichetta già personalizzata (diversa dal nome del preset precedente).
- **Editor sottotab carosello** (`display === 'carousel'` + `BookingFormCarouselEditor`): flusso **foto-first**; campi per slide: **Testo Etichetta** → `eyebrow`, **Testo Titolo** → `title`, **Scegli Icona** → `icon`, **Testo Descrizione** → `description` (max 30/22/66). Intestazione slide: **Foto N° X** (ordine carosello, 1 = prima a sinistra). Pulsante matita **Modifica foto** (`replaceAt` su `useCarouselPhotoUpload`) accanto a rimuovi. **Nessun prezzo**. Upload bucket `menu-photos`.
- **Sottotab salvate (card + carosello)** in lista: riga compatta con **Modifica** / **Chiudi** (toggle `expandedSubTabByMode`); editor `embedded` sotto il bordo; **Salva** (`commitSubTabEditor`) chiude il pannello.
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
- **Tracking personalizzazioni (`field_overrides`)**: ogni patch ai campi vetrina della sottotab (`label`, `description`, `price_per_person`, `hidden_item_ids`, `hidden_category_keys`) viene automaticamente marcato come «personalizzato» (`true`) da `applyPatchWithOverrideTracking`. **Importa menù preselezionato** azzera tutti gli override (`presetImportFieldOverrides()`) — eccezione: se l'etichetta corrente è già personalizzata e diversa dal preset precedente, resta marcata `true`. Effetto pratico: dopo import, modifiche al preset in tab Menu si propagano live alla pagina Prenota; modifiche admin nel panel «congelano» quel campo. Resolver in `src/features/booking/services/bookingFormResolver.ts` applicato lato pubblico in `BookingRequestForm.activeModeSubTabs`. Test: `src/features/booking/services/__tests__/bookingFormResolver.test.ts`.
- **Trim onBlur + contatore rosso**: `AdminFieldWithCharCount` (sia in `BookingFormConfigPanel` che in `BookingFormCarouselEditor`) applica `.trim()` al blur del campo e colora il contatore di rosso quando si raggiunge il `maxLength`. Lo slice onChange resta per evitare digitazione oltre il limite.
- **Validazione upload foto carosello** (`useCarouselPhotoUpload` in `MenuHomepageConfigPanel.tsx`): tipo MIME ammesso (`image/jpeg|png|webp|avif`) + dimensione max `CAROUSEL_PHOTO_MAX_MB` (5 MB); toast errore con messaggio specifico se file rifiutato. Vale anche per Menu QR homepage.
- **Anagrafica Azienda** (`RestaurantSettingsTab`): stesso `SettingsSaveFooter` quando `dirty`; un solo flag per tutta la scheda.
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
- I dati visuali **Card scorrevole** sono sulla sottotab: `label`, `description`, `price_per_person`, `hidden_*`, `preset_id`.
- Il **Carosello** salva testi/icona per slide in `carousel_items[]` (`eyebrow`, `title`, `description`, `icon`); `sub_tabs[].label` resta il nome opzione nel selettore (sync da prima slide); **no** `price_per_person` / `description` a livello sottotab carosello.
- `preset_id` collega un menu preselezionato solo per precompilare gli ingredienti del form pubblico. Importare un preset in Personalizza form compila i campi della card (nome preset come etichetta iniziale), ma non modifica `booking_custom_staff_presets` nella tab Menu.
- **Titolo pubblico (card scorrevole + `h2` menù):** sempre `sub_tabs[].label` («Etichetta card»), mai il nome del preset staff se l’etichetta è stata personalizzata. `MenuSelection` riceve `presetSectionTitle` dalla sottotab attiva; `BookingSubTabCards` legge `tab.label`. Helper `applyLegacySubTabLabelOverrides` in `bookingPublicFormConfig.ts`: se in DB resta `label` = nome preset ma esiste ancora `sub_tabs_overrides[].custom_label`, usa l’override fino al prossimo salvataggio admin (che azzera `sub_tabs_overrides`).
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

**Nessun prezzo** su slide né totale fisso quando il cliente sceglie una sottotab `carousel`.

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
