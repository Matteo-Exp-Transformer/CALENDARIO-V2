# ADMIN — Settings Context

> Impostazioni ristorante e Personalizza Form. Questo dominio scrive soprattutto `restaurant_settings`.
>
> **Stato blindatura (M4):** intervista ✅ (15-06-26) · Fase C ✅ · test `@admin-blindatura: settings-*` **129/129** (18 file, incluso `settings-form-config-compilable` FIX 9 §3A 17-06-26) · QA Playwright 375/900/1256 su anteprima tema + sfondo ✅ · FU-002 riscritto ✅ · FU-009 chiuso ✅ · **blindato** ✅ (16-06-26). FIX 9 §3A/§3B aggiunto 17-06-26 senza riaprire il cancello M4. Report: [`Report-finale-area3-impostazioni-15-06-26.md`](../../Sessioni%20di%20lavoro/15-06-26/Blindatura%20ADMIN/Report-finale-area3-impostazioni-15-06-26.md).

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
| **Limiti coperti** | **`slot_guest_capacities`** (cap per-fascia, fonte autoritativa letta da edge+badge), **`slot_limit_enabled`** (interruttore globale limiti per-fascia), **`booking_reject_out_of_slot`** (vincolo orario fuori-fascia), `walk_in_max_guests`. ⚠️ `daily_guest_limit` **RIMOSSO** (18-06-26, cambio modello — vedi §8) |
| Tema | `app_theme` (solo admin, ID in `APP_THEME_IDS`) |
| Pagina Prenota | `booking_public_form_config`, `public_booking_page_background`, `public_booking_strip_photo`, `booking_placement_areas` |
| Promo/preset | `booking_menu_promos`, `booking_custom_staff_presets`, `booking_staff_presets_visible` |

## 5. Autosave vs salvataggio

- Autosave limitato ad anagrafica semplice e alcuni campi header (`SETTINGS_AUTOSAVE_ENABLED` = OFF in PROD build salvo `VITE_SETTINGS_AUTOSAVE=true`; hook preservato ma inerte — FU-004).
- Le aree complesse usano salvataggio esplicito/guard.
- **Promo CRUD allineato al footer (FU-002 riscritto, FIX 6, 16-06-26):** Applica/Elimina/toggle-visibilità
  su promo aggiornano solo la lista locale e alzano dirty. Non esiste piu persistenza autonoma
  `silent` scollegata dal footer: il persist di `booking_menu_promos` passa da `saveSection()` via
  ref, dentro il Salva unificato di Impostazioni. Se il persist fallisce, l'errore risale al
  chiamante/footer e la UI locale resta modificata per retry.
- **Lista promo** (`BookingFormPromoSection`, FU-026): card riga `menu-prices-item-row` — testo in
  `.menu-prices-item-text`; matita/occhio/cestino in `.menu-prices-item-actions` in basso a destra
  (classi `menu-prices-icon-btn`, stesso pattern tab Menu magazzino).
- **Conferma dati pubblici (FU-005):** il footer «Salva modifiche» in anagrafica (`RestaurantSettingsTab`) e in Personalizza Form (`BookingFormConfigPanel`) apre `PublicDataSaveConfirmModal` prima di persistere — avvisa che le modifiche saranno visibili ai clienti. Il salvataggio effettivo avviene solo alla conferma.
- Dirty state registrato nel contesto globale: cambio tab/sezione puo mostrare modal save/discard.

## 6. Vincoli e fallback

- `app_theme` accetta solo ID noti in `APP_THEME_IDS`.
- `business_hours` usa orari `HH:mm`. Con **2+ fasce nello stesso giorno** non sono ammesse
  sovrapposizioni: validazione **live** in `BusinessHoursEditor` (banner rosso per giorno) e
  **blocco al Salva** anagrafica (`validateBusinessHours` in `@/lib/businessHours`: il footer resta
  cliccabile, poi mostra toast, scrolla al primo errore e lampeggia la sezione). Logica overlap riusa
  `slotRangesOverlap` (`open`→`start`, `close`→`end`), con sort per
  `open` prima del controllo; fasce che attraversano mezzanotte incluse.
- `booking_public_form_config` normalizza mode, sub-tab, icone, testi e display.
- Una modalita puo avere card o carosello secondo regole Prenota; non inventare fallback pubblici.
- `app_theme` non cambia tema Prenota o QR.

## 7. Rischi

- `restaurant_settings` e leggibile in parte dal pubblico: non salvare segreti.
- Alcune chiavi hanno fallback operativi: da distinguere da dati inventati.
- Se nessuna modalita Prenota e attiva, la pagina pubblica non mostra il form.
- Il tab Impostazioni e raggiungibile dalla dashboard (`/admin/impostazioni`); non esiste una action
  sidebar dedicata.

## 8. Decisioni intervista M4 (15-06-26)

> **S3:** `cutoff_minutes` (60), `min_order_time_minutes` (45) e `late_arrival_allowed` (false)
> sono registrati e validati ma non esposti nella UI ristoratore. Restano console-tunable. Classic
> non riceve una nuova manopola intervallo; il valore per-fascia si modifica solo in Servizio Pro.

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
- **Default all'apertura giorno (FIX 2, 16-06-26):** quando un giorno passa da "Chiuso" ad aperto senza
  uno snapshot precedente (mai configurato), `BusinessHoursEditor` popola insieme **due** fasce —
  pranzo `06:30–16:30` e cena `17:30–23:30` — invece del singolo slot generico `11:00–00:00` di prima.
  Stesso default anche nel ramo defensive di `addSlot()` se il giorno risultasse senza fasce. Un
  giorno **con fasce già esistenti** non viene mai sovrascritto: "Aggiungi apertura" aggiunge solo una
  fascia in più (`11:00–00:00`). Annulla (rispunta "Chiuso") resta sullo snapshot esistente, non sui
  nuovi default. Test: `@admin-blindatura: settings-business-hours-editor`.

### Fasce, capienze, limiti

- **Fasce/capienze Classic** e **limite per-fascia** (se attivo): admin **avviso**, mai blocco operativo (allineato M2).
- **Riordino manuale fasce (FIX 3, 16-06-26):** in Classic l'utente sposta le fasce con frecce
  Su/Giu nella sezione "Imposta Fasce Orarie". Al Salva `display_order` viene riassegnato in base
  all'ordine UI; le capienze restano agganciate per `slot.id`, non per posizione. Il pubblico legge
  lo stesso ordine tramite i path esistenti dei service slot.
- **NUOVO MODELLO LIMITI COPERTI (18-06-26, sostituisce M2 — `daily_guest_limit` RIMOSSO):**
  - **Niente limite giornaliero.** L'unico limite verso il pubblico è **per-fascia**, opzionale, con
    **interruttore globale** `slot_limit_enabled` (default OFF) + i valori "Coperti max" per fascia in
    `slot_guest_capacities`. Vuoto/OFF = nessun blocco.
  - **Vincolo orario** `booking_reject_out_of_slot` (default OFF): se ON, la pagina pubblica rifiuta gli
    orari che non cadono in nessuna fascia (edge `OUT_OF_SLOT`). Toggle dedicato in "Imposta Fasce Orarie".
  - **Fonte cap edge = `slot_guest_capacities`** (allineata al client `useCapacityCheck`): priorità
    `override → service_slots.max_guests → slot_guest_capacities[slotId]`. L'edge legge questa chiave
    (prima leggeva solo `service_slots.max_guests`, sempre null in Classic → non bloccava).
  - **Principio MORBIDO invariato:** ogni vincolo blocca SOLO il pubblico (edge `create-booking`,
    codici `SLOT_LIMIT`/`OUT_OF_SLOT`); l'admin crea sempre (avviso per-fascia via `useCapacityCheck`
    e stesso gate in `PendingRequestsTab`/`BookingDetailsModal`, mai blocco). Disattivando la sezione
    "Imposta Fasce Orarie" (`booking_time_slots_enabled` = false in Classic) i limiti restano inerti
    anche in admin (nessun avviso capienza per-fascia).
  - **Edition Pro:** sezione Impostazioni **«Limiti Prenotazioni»** con i due interruttori pubblici
    (`slot_limit_enabled`, `booking_reject_out_of_slot`); testi di aiuto Pro rimandano a **Servizio**
    in sidebar. Classic: stessi interruttori dentro **«Imposta Fasce Orarie»** (editor fasce inline);
    testo rifiuto fuori-fascia rimanda a quella sezione, non a Servizio. Salvataggio identico.
  - **Nessun limite di default** per nuove aziende: seed fasce con `max_guests` NULL, nessun seed limiti.
  - **Calendario Giorno Pro (24-06-26 B0):** i limiti pubblici per fascia continuano a governare
    solo blocchi/avvisi pubblici e badge complessivo Mese; nel digest Giorno Pro l'occupazione per
    fascia usa la capienza fisica dei tavoli attivi anche con `slot_limit_enabled` OFF.
- **`booking_window_days`**: chiave registry **orfana** (solo admin, nessuna UI consumer) — fuoriscope M4; implementazione Fase C **rimossa** su richiesta 15-06-26 (vedi report Fase C §Fuoriscope). **Non implementare senza nuova decisione esplicita di Matteo.**

### Timezone, tema, presentazione form

- **`timezone`**: setting tecnico **senza UI Classic**; default documentato **`Europe/Rome`**; non esporre in form admin.
- **`app_theme`**: solo back-office admin; **non** cambia Prenota né Menu QR.
- **Card scorrevole + Carosello**: entrambi core in Personalizza form; cambio `sub_tabs_presentation` → **conferma distruttiva**
  (già in `BookingFormConfigPanel`). CRUD slide carosello + upload Storage: **FU-009 chiuso** (16-06-26) — Vitest `settings-carousel-crud` **12/12** + QA browser TEST; vedi § Stato mappatura sotto.
- **Toggle Menù personalizzabile per-categoria (`compilable_category_keys`, FIX 9 §3A, 17-06-26):** quando `is_fixed_menu: false` è attivo su una card, l'editor mostra una lista di checkbox per categoria (categorie del preset collegato). Le categorie selezionate → `compilable_category_keys[]` sulla sottotab; le altre visibili ma bloccate (senza checkbox) nella Pagina Prenota. Campo assente = tutte le categorie compilabili (backward compat). Test: `@admin-blindatura: settings-form-config-compilable` — `settingsFormConfigCompilable.settingsM4.adminBlindatura.test.tsx` (9 test).

### Salvataggio, guard, Classic production

- Salvataggio esplicito (autosave debug OFF su PROD — FU-004); **modale dati pubblici** al Salva (FU-005).
- **Guard** globale su cambio tab Impostazioni, sezione admin, logout (`UnsavedChangesContext`).
- **Footer unificato M4 (15-06-26):** un solo `SettingsSaveFooter` + una sola `PublicDataSaveConfirmModal` nel padre `RestaurantSettingsTab` per Anagrafica + Personalizza form (`hideSaveUi` su `BookingFormConfigPanel`); Salva aggregato se entrambe le aree sono dirty.
- **Footer dirty — pulse Salva/Annulla (17-06-26):** quando il footer «Modifiche non salvate» è visibile, i pulsanti **Salva modifiche** e **Annulla tutte** applicano la classe `settings-save-footer-btn-attention` (box-shadow arancione pulsato, senza layout shift; `prefers-reduced-motion` → anello fisso). Stesso pattern su **Salva** in `PublicDataSaveConfirmModal` e su **Salva e continua** / **Annulla e continua** in `UnsavedNavigationGuardModal`. Logica dirty/save/guard invariata.
- **Primo errore al Salva (FIX 4, 16-06-26):** se Anagrafica/Orari/Fasce sono invalidi, il footer
  non apre la modale pubblica: scrolla con `block:'center'` sul primo errore visivo e applica la
  pulse `booking-public-field-attention`. Priorita mappa: nome locale, orari di apertura, fasce orarie.
- **Save pending + guard (15-06-26):** se il Salva della modale pubblica è già in corso (`upsert.isPending`), `handleCombinedSave` rifiuta un secondo avvio (es. «Salva e continua» sul guard navigazione) — il guard resta aperto, una sola mutation. Il guard «Salva e continua» rispetta anche `hasBlockingOperations` (toast, zero seconda mutation) per altre aree admin.
- Form non configurato su Classic → **EmptyState** chiaro su `/prenota`; niente `DEFAULT_BOOKING_FORM_CONFIG` sul pubblico (M6).

### Sfondo Pagina Prenota (`public_booking_strip_photo`, `public_booking_page_background`) — D-M2 (15-06-26)

- **Admin:** due modalità esclusive in UI — **striscia laterale** (`strip-01`…`strip-06`) oppure **foto pagina intera** (`full-01`…`full-04`). Nessun gradiente né tile.
- **XOR pubblico:** se `public_booking_strip_photo` è valorizzato, la striscia vince e `public_booking_page_background` è ignorato sul rendering.
- **Nessuna scelta decorativa:** valori legacy gradiente/tile in DB → `parseFromDb` restituisce `null` (migrate-on-read); il pubblico usa crema `#faf7f1` (superficie `light`), senza crash.
- **Striscia disattiva:** `serializeToDb(null)` → `''` (colonna `setting_value` NOT NULL); `parseFromDb('')` → `null`.
- Helper pubblico: **`resolvePublicBookingPageLayout`** (contratto unico: mode, surface, fullPagePhotoId, crema); palette da `surfaceUsesLightText`. Admin: `hydrateAdminBookingBackgroundEditor` + `isAdminBookingBackgroundDirty`; sfondo persistito **solo se dirty** (evita migrazione silenziosa legacy→full-01 al Salva anagrafica).
- Test: `@admin-blindatura: settings-background` + `publicBookingSurface.test.ts`.

### Stato mappatura (16-06-26 — chiusura Area 3 M4)

- Fase A+B **chiuse** (intervista + gap read-only). Fase C **chiusa** (15-06-26): gap G2–G9, G20 implementati; **G16 fuoriscope** (finestra prenotazione rimossa).
- **Fronti test `@admin-blindatura: settings-*`:** tutti verdi in run aggregato (**120/120** su 17 file, gate Batch 1/2 incluso); `npm run validate` **813/813** (17-06-26).
- **FU-009 (carosello admin):** chiuso — QA browser upload reale Supabase Storage + overlay su `/prenota/:slug` (`tomas@t.com`, tenant Trattoria Da Tommaso); Vitest `settings-carousel-crud` **12/12**.
- **Fase D rompi + QA viewport:** eseguiti e documentati; addendum finale Playwright `admin-settings-blindatura.spec.ts` **6/6** su 375/900/1256 copre apertura modale anteprima tema e sfondo, footer/guard, console pulita e nessun click intercettato. `Modal.tsx` non modificato nel fix finale: `z-[10050]` e `createPortal` invariati.

### Divieti (anti-regressione)

- **Non** rendere obbligatori contatti o orari per salvare anagrafica (salvo nome locale).
- **Non** mostrare nome/orari/contatti **demo** se il tenant non ha salvato i dati.
- **Non** esporre `timezone` / `slot_limit_enabled` / `booking_reject_out_of_slot` / `booking_window_days` in whitelist anon senza migrazione dedicata e decisione prodotto esplicita (le legge l'edge via service_role).
- Pro / CRM / Servizio fuori cancello M4 → tracciare in M5 se emerge.
