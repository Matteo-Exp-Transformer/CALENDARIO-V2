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

## 8. Decisioni intervista M4 (15-06-26)

> Stato stabile post-intervista Matteo. Report completo + tabella gap codice:
> [`Report-intervista-m4-admin-impostazioni-15-06-26.md`](../../Sessioni%20di%20lavoro/15-06-26/Report-intervista-m4-admin-impostazioni-15-06-26.md).

### Permessi e utenti

- **Admin = staff** per Impostazioni: nessun permesso ridotto; chi entra in `/admin` configura tutto il tab.

### Anagrafica e contatti (`restaurant_name`, `contact_*`)

- **`restaurant_name` obbligatorio** al Salva anagrafica. Se mai salvato → Pagina Prenota **senza titolo inventato**
  (niente fallback da `organizations.name` sul pubblico).
- **Email, telefono, indirizzo opzionali**; campi vuoti **non** compaiono nel footer Prenota.
- **Cap UI** (allineare costanti + registry + input): nome **45**, email **65**, telefono **30**, indirizzo **120**.

### Orari (`business_hours`)

- Sezione **opzionale** verso il pubblico: tutti i giorni chiusi/disattivati → **nessuna sezione Orari** in Prenota.
- **Non** condizionano la possibilità di prenotare (validazione cliente solo se orari configurati e parsabili).
- Struttura/overlap **malformati** → admin **non salva**; pubblico **non crasha** e **non** mostra orari invalidi.

### Fasce, capienze, limiti

- **Fasce/capienze Classic** e **limite per-fascia** (se attivo): admin **avviso**, mai blocco operativo (allineato M2).
- **`daily_guest_limit`**: `0`/vuoto = nessun limite; blocca **solo** Prenota pubblica (edge `DAILY_LIMIT`); admin può sforare con avviso.
- **`booking_window_days`**: chiave registry **orfana** (solo admin, nessuna UI consumer) — fuoriscope M4; implementazione Fase C **rimossa** su richiesta 15-06-26 (vedi report Fase C §Fuoriscope). **Non implementare senza nuova decisione esplicita di Matteo.**

### Timezone, tema, presentazione form

- **`timezone`**: setting tecnico **senza UI Classic**; default documentato **`Europe/Rome`**; non esporre in form admin.
- **`app_theme`**: solo back-office admin; **non** cambia Prenota né Menu QR.
- **Card scorrevole + Carosello**: entrambi core in Personalizza form; cambio `sub_tabs_presentation` → **conferma distruttiva**
  (già in `BookingFormConfigPanel`). Residuo QA slide admin = **FU-009**, non M4.

### Salvataggio, guard, Classic production

- Salvataggio esplicito (autosave debug OFF su PROD — FU-004); **modale dati pubblici** al Salva (FU-005).
- **Guard** globale su cambio tab Impostazioni, sezione admin, logout (`UnsavedChangesContext`).
- **Footer unificato M4 (15-06-26):** un solo `SettingsSaveFooter` + una sola `PublicDataSaveConfirmModal` nel padre `RestaurantSettingsTab` per Anagrafica + Personalizza form (`hideSaveUi` su `BookingFormConfigPanel`); Salva aggregato se entrambe le aree sono dirty.
- Form non configurato su Classic → **EmptyState** chiaro su `/prenota`; niente `DEFAULT_BOOKING_FORM_CONFIG` sul pubblico (M6).

### Sfondo Pagina Prenota (`public_booking_strip_photo`, `public_booking_page_background`) — D-M2 (15-06-26)

- **Admin:** due modalità esclusive in UI — **striscia laterale** (`strip-01`…`strip-06`) oppure **foto pagina intera** (`full-01`…`full-04`). Nessun gradiente né tile.
- **XOR pubblico:** se `public_booking_strip_photo` è valorizzato, la striscia vince e `public_booking_page_background` è ignorato sul rendering.
- **Nessuna scelta decorativa:** valori legacy gradiente/tile in DB → `parseFromDb` restituisce `null` (migrate-on-read); il pubblico usa crema `#faf7f1` (superficie `light`), senza crash.
- **Striscia disattiva:** `serializeToDb(null)` → `''` (colonna `setting_value` NOT NULL); `parseFromDb('')` → `null`.
- Helper pubblico: **`resolvePublicBookingPageLayout`** (contratto unico: mode, surface, fullPagePhotoId, crema); palette da `surfaceUsesLightText`. Admin: `hydrateAdminBookingBackgroundEditor` + `isAdminBookingBackgroundDirty`; sfondo persistito **solo se dirty** (evita migrazione silenziosa legacy→full-01 al Salva anagrafica).
- Test: `@admin-blindatura: settings-background` + `publicBookingSurface.test.ts`.

### Stato mappatura (15-06-26)

- Fase A+B **chiuse** (intervista + gap read-only). Fase C **chiusa** (15-06-26): gap G2–G9, G20 implementati; **G16 fuoriscope** (finestra prenotazione rimossa). Validate verde post-rimozione. Residuo QA: **FU-009** (slide carosello admin); E2E smoke Impostazioni 375/834/1280 opzionale manuale.

### Divieti (anti-regressione)

- **Non** rendere obbligatori contatti o orari per salvare anagrafica (salvo nome locale).
- **Non** mostrare nome/orari/contatti **demo** se il tenant non ha salvato i dati.
- **Non** esporre `timezone` / `daily_guest_limit` / `booking_window_days` in whitelist anon senza migrazione dedicata e decisione prodotto esplicita.
- Pro / CRM / Servizio fuori cancello M4 → tracciare in M5 se emerge.
