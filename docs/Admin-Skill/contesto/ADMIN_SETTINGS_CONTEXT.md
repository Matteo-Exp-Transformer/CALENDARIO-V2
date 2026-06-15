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
- `@/config/settingsAutosave` (flag `SETTINGS_AUTOSAVE_ENABLED`)
- `UnsavedChangesContext`

Il registry parse/serializza valori e fallback. Non bypassarlo con scritture dirette se esiste una
chiave gia registrata.

## 4. Chiavi principali

> ⚠️ **Fonte di verità unica = `restaurantSettingRegistry.ts`** (`RESTAURANT_SETTING_KEYS_V1`). Non
> mantenere qui un elenco completo: si disallinea dal codice (è già successo — mancava
> `daily_guest_limit`). La tabella sotto è solo un **orientamento per famiglia**; per l'elenco
> autorevole, i tipi e i fallback aprire il registry. Anche `ADMIN_DATA_FLOW_CONTEXT.md §3` deve
> rimandare qui, non duplicare.

| Famiglia | Chiavi (orientamento, non esaustivo — vedi registry) |
|---|---|
| Anagrafica/contatti | `restaurant_name`, `contact_email`, `contact_phone`, `contact_address` |
| Orari e capienze | `business_hours`, `slot_guest_capacities` (legacy/supporto), `booking_time_slots_enabled`, `timezone`, `booking_window_days` |
| **Limiti coperti** | **`daily_guest_limit`** (limite giornaliero esterno — blindato M2 Calendario, applicato anche server-side in `create-booking`), `walk_in_max_guests` |
| Tema | `app_theme` (solo admin, ID in `APP_THEME_IDS`) |
| Pagina Prenota | `booking_public_form_config`, `public_booking_page_background`, `public_booking_strip_photo`, `booking_placement_areas` |
| Promo/preset | `booking_menu_promos`, `booking_custom_staff_presets`, `booking_staff_presets_visible` |

## 5. Autosave vs salvataggio

- Autosave limitato ad anagrafica semplice e alcuni campi header (`SETTINGS_AUTOSAVE_ENABLED` = OFF in PROD build salvo `VITE_SETTINGS_AUTOSAVE=true`; hook preservato ma inerte — FU-004).
- Le aree complesse usano salvataggio esplicito/guard.
- **Promo CRUD save-on-apply (FU-002 fase 2):** Applica/Elimina/toggle-visibilità su promo persistono immediatamente via `useUpsertRestaurantSetting` in modalità `silent: true`, senza toccare il footer. Se la chiamata fallisce, il dirty state viene alzato per permettere retry manuale.
- **Lista promo** (`BookingFormPromoSection`, FU-026): card riga `menu-prices-item-row` — testo in
  `.menu-prices-item-text`; matita/occhio/cestino in `.menu-prices-item-actions` in basso a destra
  (classi `menu-prices-icon-btn`, stesso pattern tab Menu magazzino).
- **Conferma dati pubblici (FU-005):** il footer «Salva modifiche» in anagrafica (`RestaurantSettingsTab`) e in Personalizza Form (`BookingFormConfigPanel`) apre `PublicDataSaveConfirmModal` prima di persistere — avvisa che le modifiche saranno visibili ai clienti. Il salvataggio effettivo avviene solo alla conferma.
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
