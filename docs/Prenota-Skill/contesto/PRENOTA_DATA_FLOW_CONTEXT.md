---
name: booking-data-flow
description: >-
  Skill obbligatoria prima di toccare qualsiasi cosa che attraversi
  tab Menu (magazzino) → Personalizza form (vetrina) → Pagina Prenota pubblica.
  Spiega come scorrono i dati, dove sono le "fonti di verità", come funziona
  il resolver `field_overrides` e quali invarianti non rompere.
---

# Booking Data Flow — flusso dati Prenota

> **Quando usare questa skill:** prima di modificare uno di questi file
> `bookingFormResolver.ts`, `bookingPublicFormConfig.ts`, `restaurantSettingRegistry.ts`,
> `BookingFormConfigPanel.tsx`, `BookingFormCarouselEditor.tsx`, `BookingRequestForm.tsx`,
> `MenuPricesTab.tsx` (preset/promo), o quando aggiungi un campo a `SubTab` / `BookingMode`.

---

## 1. Le due "fonti di verità"

| Mondo | Cosa contiene | Storage | Owner UI |
|-------|--------------|---------|----------|
| **Magazzino menu** | Categorie ingredienti, ingredienti, **menù preselezionati**, promo | Tabelle `menu_categories`, `menu_items` + JSONB `restaurant_settings.booking_custom_staff_presets`, `booking_menu_promos` | Tab **Menu** (`MenuPricesTab`) |
| **Vetrina Prenota** | Testi/foto/icone che il **cliente** vede in pagina Prenota | JSONB `restaurant_settings.booking_public_form_config` | Tab **Impostazioni → Personalizza form** (`BookingFormConfigPanel`) |

**Regola operativa:** la vetrina **non** legge il magazzino in tempo reale per tutto. Per i campi vetrina (`label`, `description`, `price_per_person`, `hidden_*`) c'è un **resolver** che decide caso per caso se mostrare il valore live del preset o quello «congelato» nella card.

**Delete categoria magazzino → vetrina:** eliminando una categoria in tab Menu (`useDeleteMenuCategory`), `syncMenuCategoryKeyDelete` rimuove la `category_key` da `sub_tabs[].hidden_category_keys` e `category_order_keys` in `booking_public_form_config` (non tocca `field_overrides`). Helper: `bookingFormCategoryKeySync.removeCategoryKeyFromBookingPublicFormConfig`. Stesso momento del sync Menù QR — vedi `PUBLIC_MENU_DATA_FLOW_CONTEXT.md` § delete sync.

---

## 2. Il resolver `field_overrides` — come funziona

File: `src/features/booking/services/bookingFormResolver.ts`.

Ogni `SubTab` può avere un oggetto `field_overrides: { label?, description?, price_per_person?, hidden_item_ids?, hidden_category_keys?, category_order_keys? }` con valori `boolean`.

- `field_overrides[campo] === true` → quel campo è **personalizzato** dal ristoratore. La pagina Prenota mostra il valore salvato nella card. Modifiche al preset in tab Menu **non** la toccano.
- `field_overrides[campo]` assente o `false` → quel campo è **ereditato dal preset**. La pagina Prenota legge il valore live dal preset corrente in `booking_custom_staff_presets`. Se il preset cambia in tab Menu, la card si aggiorna senza riaprire Personalizza form.

### Quando le bandierine vengono cambiate

1. **Import preset** (admin clicca "Importa menù preselezionato" nell'editor card): `importPresetIntoSubTab` / `importPresetIntoDraftSubTab` usano `presetImportFieldOverrides()` → tutte a `false`. Eccezione: se l'etichetta corrente era già personalizzata e diversa dal nome del preset precedente, `label` resta `true` (`shouldKeepSubTabLabelOnPresetImport`).
2. **Modifica admin di un campo vetrina**: `updateSubTab` / `updateDraftSubTab` passano per `applyPatchWithOverrideTracking`. Se il patch contiene uno dei 5 campi overridable, quella bandierina diventa `true`.
3. **Reset esplicito** (utility): `resetSubTabToPreset(subTab, presets)` riallinea tutto al preset corrente e azzera tutti gli override.

### Dove il resolver viene applicato

- **Pagina pubblica**: `BookingRequestForm.activeModeSubTabs` chiama `resolveSubTabView(tab, customStaffPresets)` per ogni sottotab dopo il filtro XOR. Tutti i consumatori a valle (`activeSubTab`, sidebar, `MenuSelection`) ricevono i valori risolti.
- **Admin**: l'editor mostra sempre i campi salvati nella card (per permettere all'admin di modificarli). Non applicare il resolver lato admin: confonderebbe l'editing.

---

## 3. Mappa flusso dati end-to-end

```
ADMIN
─────
[Tab Menu]
   menu_categories ─┐
   menu_items ──────┼─→ booking_custom_staff_presets (in restaurant_settings)
                    └─→ booking_menu_promos        (in restaurant_settings)

[Tab Impostazioni → Personalizza form]
   BookingFormConfigPanel
     ├─ Intestazione → booking_public_form_config.page_title/description/header_styles
     └─ Modalità (BookingMode[])
           ├─ sub_tabs_presentation: XOR cards | carousel | null
           └─ sub_tabs (SubTab[])
                ├─ preset_id        ─── legame con preset staff (magazzino)
                ├─ label, description, courses_label, price_per_person, is_fixed_menu, hidden_*  (snapshot vetrina)
                ├─ field_overrides  ─── decide per ogni campo: live o congelato
                └─ carousel_items (solo display='carousel')

PUBBLICO (/prenota/:slug)
─────────────────────────
   BookingRequestForm
     1. Legge booking_public_form_config (via supabasePublic)
     2. activeMode = booking_modes[booking_type]
     3. activeModeSubTabs:
          a) applyLegacySubTabLabelOverrides (compat dati vecchi)
          b) filtro XOR per sub_tabs_presentation
          c) MAP → resolveSubTabView(tab, customStaffPresets)
             ↑ qui i campi NON personalizzati vengono letti live dal preset corrente
     4. Renderizza BookingModeCards / BookingSubTabCards / BookingSubTabCarousel / MenuSelection
```

---

## 4. Invarianti da non rompere

```
LOCK  Resolver puro
      `bookingFormResolver.ts` non deve dipendere da React, hook, fetch.
      Funzioni pure: input → output. Test in services/__tests__/.

LOCK  Owner field_overrides
      Solo `BookingFormConfigPanel` cambia le bandierine in scrittura tramite
      `applyPatchWithOverrideTracking` e `presetImportFieldOverrides`.
      MAI scrivere a mano `field_overrides[x] = true/false` da altri componenti.

LOCK  No resolver in admin editor
      L'editor admin lavora sui valori SALVATI in `sub_tabs[]`. Non applicare
      `resolveSubTabView` ai campi che l'admin sta modificando: vedrebbe il valore
      live del preset e non capirebbe perché il suo input "rimbalza".

LOCK  XOR card vs carosello
      Una `BookingMode` è solo cards O solo carousel.
      `sub_tabs_presentation` decide; `SubTabAddButtons` mostra solo il pulsante coerente.
      Cambio presentazione richiede reset esplicito (`resetSubTabsPresentation`).

LOCK  Carosello = singolo, con N foto dentro
      Per ogni `BookingMode` con `sub_tabs_presentation === 'carousel'` c'è
      UNA sola sottotab carousel (con `carousel_items[]` per le N foto).
      Admin: `SubTabAddButtons` nasconde «+ Carosello» se ne esiste già una
      (`carouselAlreadyExists`); `addSubTab` blocca duplicati a runtime.
      Pubblico: `BookingRequestForm` salta `BookingSubTabCards` per questa
      presentazione e auto-seleziona l'unica sottotab carosello (`useEffect`).
      Renderizza direttamente `BookingSubTabCarousel`.

LOCK  Parser/normalizer accoppiati
      Aggiungere un campo a `SubTab` richiede:
      1) tipo in `bookingPublicFormConfig.ts`
      2) parsing in `parseSubTabFromUnknown` (con difesa input malformato)
      3) preservazione in `normalizeBookingPublicFormConfig`
      4) eventuale fallback in `restaurantSettingRegistry.parseFromDb`
      Test minimi: parser accetta dati legacy senza il campo.

LOCK  Submit cliente invariato
      `useCreateBookingRequest` NON va toccato per cambi vetrina.
      Il submit usa il payload risolto (label, prezzo) già processato dal resolver.

LOCK  Selezione preset pubblico e caricamento async
      In `BookingRequestForm`, `menuItems` e `booking_custom_staff_presets` arrivano da React Query.
      Non trattare array vuoti durante `isLoading/isFetching` come "preset mancante":
      il click su una card scorrevole deve mantenere il preset selezionato e riapplicarlo
      quando il catalogo e pronto. Mostrare "Menu consigliato non disponibile" solo
      quando il caricamento e finito e il preset non risolve davvero nessuna voce.

LOCK  Card scorrevole senza preset
      Una `display='cards'` senza `preset_id` e una card compilata manualmente:
      non ha griglia ingredienti, non mostra controlli categoria/ingrediente,
      non mostra toggle "Menù personalizzabile" e puo mantenere un prezzo
      salvato. Le card importate da preset, invece, ereditano
      fisso/personalizzabile dal preset tramite resolver.

LOCK  Ingredienti preset custom
      Per una card con `preset_id`, gli ingredienti salvati in
      `booking_custom_staff_presets[].item_ids` sono la fonte del catalogo
      mostrato nella pagina Prenota e nel pannello visibilità. Non filtrarli
      fuori solo perché il singolo `menu_item.booking_types` non include la
      modalità corrente: il legame esplicito card→preset ha priorità. Le sole
      esclusioni ammesse sono ingrediente/categoria nascosti nella card o
      ingrediente eliminato dal catalogo.

LOCK  Cancellazione preset staff
      Se un menù preselezionato viene cancellato in `MenuPricesTab`, mostrare
      conferma esplicita che verranno eliminate anche le card collegate in
      Personalizza form. Persisti nello stesso upsert sia
      `booking_custom_staff_presets` sia `booking_public_form_config`, rimuovendo
      `sub_tabs[]` e `sub_tabs_overrides[]` con quel `preset_id`. La modifica di
      un preset non deve cancellare card: i campi pubblici seguono il resolver e
      gli override personalizzati restano salvati.

LOCK  Due client Supabase
      Admin: `supabase` (autenticato). Pubblico Prenota: `supabasePublic` (anonimo).
      Il resolver è puro, non sa di client — lo chiama chi ha già i dati in mano.

LOCK  Rename chiave categoria (magazzino)
      Solo al save categoria in tab Menu (`useUpdateMenuCategory`): oltre a
      `menu_items.category`, allinea in background `menu_qr_codes` /
      `menu_qrcode_categories` e `sub_tabs[].hidden_category_keys` /
      `category_order_keys` in `booking_public_form_config`
      (`bookingFormCategoryKeySync.ts`). Non toccare
      `field_overrides` né altri campi vetrina. Sync non automatica aprendo tab Menu
      o modale QR senza save categoria. UX rename: modale conferma in overlay Categorie
      (non toast laterale) — vedi FU-029 / `MenuPricesTab`.
```

---

## 5. Come estendere senza rompere

### Aggiungere un campo vetrina solo-carosello (non overridable)

Esempio: `show_offer_details_in_summary` (preferenza riepilogo Prenota, non legata al preset).

1. Aggiungi il campo opzionale a `SubTab` in `bookingPublicFormConfig.ts` + helper default se serve (es. `getShowOfferDetailsInSummary`: assente = `true`).
2. Aggiorna `parseSubTabFromUnknown` (solo per `display === 'carousel'` se il campo non ha senso sulle card).
3. Aggiorna `normalizeBookingPublicFormConfig` per preservare al salvataggio (preferire persistere solo valori non-default, es. `false` esplicito).
4. **Non** aggiungere a `SubTabOverridableField` né a `resolveSubTabView` — il valore resta su `sub_tabs[]` e passa al pubblico via spread in `BookingRequestForm.activeModeSubTabs` (`...tab` dopo resolver).
5. UI admin in `BookingFormConfigPanel` (editor carosello); render pubblico nel componente consumatore (`BookingSummarySidebar`).
6. Test parser: `src/features/booking/constants/__tests__/bookingPublicFormConfig.test.ts`.

Report: `docs/Sessioni di lavoro/28-05-26/Report-carosello-riepilogo-toggle-offerta-28-05-26.md`.

### Aggiungere un nuovo campo vetrina overridable (es. `subtitle`)

1. Aggiungi `subtitle?: string` a `SubTab` in `bookingPublicFormConfig.ts`.
2. Aggiungi `'subtitle'` a `SubTabOverridableField` (stesso file) e a `OVERRIDABLE_FIELDS` per il parser.
3. Aggiorna `parseSubTabFromUnknown` per leggerlo (con trim + difesa).
4. Aggiorna `normalizeBookingPublicFormConfig` per preservarlo al salvataggio.
5. Aggiungi il campo a `ResolvedSubTab` e alla logica in `resolveSubTabView` (analogamente a `label`: se override mostra salvato, altrimenti leggi dal preset se il preset ha un campo equivalente). Se il campo non ha fonte nel preset, preserva solo il valore salvato e non aggiungerlo a `field_overrides`.
6. Aggiungi `'subtitle'` a `SUB_TAB_OVERRIDABLE_KEYS` in `BookingFormConfigPanel.tsx` così `applyPatchWithOverrideTracking` lo marca quando l'admin lo modifica.
7. Test in `bookingFormResolver.test.ts`: scenario override true/false, preset cancellato.

### Aggiungere una nuova modalità (`BookingType`)

1. Aggiorna `BookingType` in `src/types/booking.ts`.
2. Aggiungi una voce a `DEFAULT_BOOKING_FORM_CONFIG.booking_modes` con `sub_tabs_presentation: null`, `sub_tabs: []`.
3. Verifica che `bookingTypeUsesMenuSelections` (in `BookingRequestForm`) sia coerente.

### Cambiare il comportamento "aggiorna solo se non personalizzato"

Tocca **solo** `bookingFormResolver.ts`. Non duplicare la logica nei componenti consumatori. Aggiungi test prima di modificare.

### Aggiungere validazione su un campo cliente pubblico

1. Aggiungi helper a `src/features/booking/utils/validation.ts` (pure function).
2. Usalo in `BookingRequestForm.validate`.
3. Aggiungi `aria-invalid` + `id="<campo>-error"` sul componente in `BookingFormFields.tsx`.
4. Test in `validation.test.ts`.

---

## 6. Antipattern noti — non rifarli

- ❌ Leggere `customStaffPresets` direttamente dentro `MenuSelection` per ricostruire label/prezzo. **Usa quanto già risolto a monte in `BookingRequestForm.activeModeSubTabs`.**
- ❌ Salvare label/description/prezzo "via preset" come riferimento (es. `label: preset.name` come stringa di refresh). Il sistema attuale **salva sempre il valore concreto** in `sub_tabs[]`; il resolver decide se mostrarlo o leggerlo live.
- ❌ Applicare `resolveSubTabView` due volte (admin + pubblico) sullo stesso oggetto. Già stato fatto, causa confusione: applica **solo** nel punto di lettura pubblico.
- ❌ Cambiare `field_overrides` con merge manuale (`{ ...current.field_overrides, label: true }`) sparso nei componenti. **Usa `applyPatchWithOverrideTracking` o `patchSubTabAsOverride`.**
- ❌ Bypassare il filtro XOR mostrando sottotab di entrambi i tipi nel pubblico "per legacy". Il filtro c'è apposta — i mix legacy vengono sanitizzati a runtime senza toccare il DB finché Mario non salva.

---

## 7. File di riferimento

| File | Ruolo |
|------|-------|
| `src/features/booking/services/bookingFormResolver.ts` | Resolver puro field_overrides |
| `src/features/booking/services/__tests__/bookingFormResolver.test.ts` | Test resolver |
| `src/features/booking/constants/bookingPublicFormConfig.ts` | Tipi, default, parser, normalizer |
| `src/features/booking/lib/restaurantSettingRegistry.ts` | parseFromDb + migrazione legacy |
| `src/features/booking/components/settings/BookingFormConfigPanel.tsx` | Admin editor + tracking override |
| `src/features/booking/components/settings/BookingFormCarouselEditor.tsx` | Editor carosello |
| `src/features/booking/components/BookingRequestForm.tsx` | Applicazione resolver lato pubblico |
| `src/features/booking/utils/validation.ts` | Helper validazione campi cliente |
| `src/features/booking/components/publicBooking/BookingFormFields.tsx` | Form pubblico con aria-invalid |
| `src/features/booking/utils/bookingFormCategoryKeySync.ts` | Sync rename/delete `hidden_category_keys` dopo magazzino |
| `src/features/booking/services/syncMenuCategoryKeyDelete.ts` | Orchestrazione delete categoria → QR + form |

Report sessione che ha introdotto il resolver: `docs/Sessioni di lavoro/26-05-26/Report-resolver-field-overrides-pulizia-26-05-26.md`.
