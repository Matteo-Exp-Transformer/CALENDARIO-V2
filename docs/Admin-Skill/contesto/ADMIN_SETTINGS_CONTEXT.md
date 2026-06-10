# ADMIN — Settings Context

> Impostazioni ristorante e Personalizza Form. Questo dominio scrive soprattutto `restaurant_settings`.

## 1. Scopo

Permette all'admin di configurare:

- anagrafica azienda;
- contatti pubblici;
- orari apertura;
- fasce orarie/capienze;
- tema visuale admin;
- Pagina Prenota pubblica;
- promo e preset collegati al form.

## 2. Componenti

- `RestaurantSettingsTab`
- `RestaurantSettingsIntro`
- `BookingFormConfigPanel`
- `BookingFormPromoSection`
- `BookingFormCarouselEditor`
- `BusinessHoursEditor`
- `SettingsSaveUi`

## 3. Hook e registry

- `useRestaurantSetting`
- `useUpsertRestaurantSetting`
- `useDebouncedSettingsAutosave`
- `restaurantSettingRegistry`
- `settingsAutosave`
- `UnsavedChangesContext`

Il registry parse/serializza valori e fallback. Non bypassarlo con scritture dirette se esiste una
chiave gia registrata.

## 4. Chiavi principali

| Chiave | Uso |
|---|---|
| `restaurant_name` | nome locale admin/pubblico |
| `contact_email`, `contact_phone`, `contact_address` | contatti pubblici |
| `business_hours` | orari e shift |
| `slot_guest_capacities` | capienze per fascia legacy/supporto |
| `booking_time_slots_enabled` | abilita slot |
| `app_theme` | tema solo admin |
| `booking_public_form_config` | vetrina Pagina Prenota |
| `booking_menu_promos` | promo admin/Prenota |
| `booking_custom_staff_presets` | preset staff |
| `public_booking_page_background`, `public_booking_strip_photo` | sfondo/striscia Prenota |

## 5. Autosave vs salvataggio

- Autosave limitato ad anagrafica semplice e alcuni campi header.
- Le aree complesse usano salvataggio esplicito/guard.
- Dirty state registrato nel contesto globale: cambio tab/sezione puo mostrare modal save/discard.

## 6. Vincoli e fallback

- `app_theme` accetta solo ID noti in `APP_THEME_IDS`.
- `business_hours` usa orari `HH:mm`. Con **2+ fasce nello stesso giorno** non sono ammesse
  sovrapposizioni: validazione **live** in `BusinessHoursEditor` (banner rosso per giorno) e
  **blocco al Salva** anagrafica (`validateBusinessHours` in `@/lib/businessHours`: footer
  **Salva modifiche** disabilitato + toast se si tenta il persist). Logica overlap riusa
  `slotRangesOverlap` (`open`→`start`, `close`→`end`), con sort per
  `open` prima del controllo; fasce che attraversano mezzanotte incluse.
- `booking_public_form_config` normalizza mode, sub-tab, icone, testi e display.
- Una modalita puo avere card o carosello secondo regole Prenota; non inventare fallback pubblici.
- `app_theme` non cambia tema Prenota o QR.

## 7. Rischi

- `restaurant_settings` e leggibile in parte dal pubblico: non salvare segreti.
- Alcune chiavi hanno fallback operativi: da distinguere da dati inventati.
- Se nessuna modalita Prenota e attiva, la pagina pubblica non mostra il form.
- Il tab Impostazioni e raggiungibile da dashboard; la action settings sidebar e latente.

## 8. Da intervistare

- Quali settings puo toccare lo staff?
- Quali fallback anagrafica sono accettabili in admin?
- Quali cambi devono essere autosave e quali sempre salvataggio esplicito?
