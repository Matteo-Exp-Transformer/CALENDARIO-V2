# ADMIN — Data Flow Context

> Mappa dati dell'area admin. Il codice resta la fonte di verita; questo file collega domini,
> hook e storage per orientare agenti.

## 1. Tenant, auth, feature

| Dato | Fonte | Uso |
|---|---|---|
| Sessione admin | Supabase Auth | `useAdminAuth`, `ProtectedRoute` |
| Tenant admin | RPC `check_admin_email` + `admin_users` | `TenantContext.setTenantFromAdmin` |
| Tenant attivo | `organizations.is_active` | blocco login/sessione se inattivo |
| Edition | `organizations.edition` / RPC | `buildFeatures` |
| Feature override | `tenant_features` via RPC/view | abilita/disabilita feature |

`buildFeatures` usa bundle Classic vuoto e bundle Pro/Enterprise completo. Override con prefisso `-`
disabilita una feature del bundle.

## 2. Tabelle principali per dominio

| Dominio | Tabelle/settings |
|---|---|
| Prenotazioni | `booking_requests`, `booking_table_assignments` |
| Menu magazzino | `menu_items`, `menu_categories`, `restaurant_settings.booking_custom_staff_presets` |
| Menu QR | `menu_qr_codes`, `menu_qrcode_categories`, bucket `menu-photos` |
| Impostazioni | `restaurant_settings` |
| Servizio | `rooms`, `tables`, `service_slots`, `service_slot_overrides`, `booking_table_assignments` |
| CRM | `customers`, `booking_requests` via email normalizzata |
| Analytics/Home | `booking_requests`, `rooms`, `tables`, `restaurant_settings.business_hours` |

## 3. `restaurant_settings`

> ⚠️ **Fonte di verità unica delle chiavi = `restaurantSettingRegistry.ts`** (`RESTAURANT_SETTING_KEYS_V1`)
> e, per famiglia/decisioni, `ADMIN_SETTINGS_CONTEXT.md §4`. **Non** tenere qui un elenco completo: si
> disallinea dal codice (è già successo — mancava `daily_guest_limit`). Sotto solo le **famiglie** che
> toccano il flusso dati admin; per tipi, fallback ed elenco autorevole aprire il registry.

- **Anagrafica/contatti:** `restaurant_name`, `contact_*`.
- **Orari/fasce/capienze:** `business_hours`, `slot_guest_capacities`, `booking_time_slots_enabled`.
- **Limiti coperti:** `slot_guest_capacities` (cap per-fascia, fonte autoritativa letta da Edge e
  badge), `slot_limit_enabled` (interruttore globale), `booking_reject_out_of_slot` (vincolo orario).
  La durata base admin è `restaurant_default_duration` (console super-admin, default 90 minuti).
  ⚠️ *Correzione 05-08-26: qui era elencato `daily_guest_limit` come limite
  giornaliero attivo — **rimosso il 18-06-26** col cambio di modello; nessun file di `src/` lo legge
  più.*
- **Pagina Prenota:** `public_booking_page_background`, `public_booking_strip_photo`,
  `booking_public_form_config`, `booking_placement_areas`.
- **Tema:** `app_theme` (solo admin).
- **Promo/preset:** `booking_menu_promos`, `booking_custom_staff_presets`, `booking_staff_presets_visible`.
- **Tecniche/fuoriscope:** `timezone` (default `Europe/Rome`, niente UI), `booking_window_days` (orfana,
  solo registry, non implementare senza decisione Matteo).

Vincolo importante: `setting_value` e `JSONB NOT NULL`; non salvare `NULL` dove il registry si aspetta
stringa vuota o default.

## 4. Scritture sensibili

| Flusso | Perche sensibile |
|---|---|
| Rename categoria menu | sincronizza `menu_categories`, `menu_items`, QR, override, form Prenota e storage |
| Delete categoria menu | elimina ingredienti e poi sincronizza QR/Form/foto |
| Delete cliente CRM | soft-delete booking collegate e cancella riga `customers` |
| Accept/reject booking | cambia stato, orari, capienza, **email al cliente** (solo accetta/rifiuta se `VITE_ENABLE_SEND_EMAIL=true` — **attivo su PROD** da 15-06-26: edge `send-email` + secrets Brevo + flag Vercel). **Corpo email (15-06-26):** builder `buildBookingEmailSummary.ts` — **conferma:** riepilogo allineato al laterale Prenota (data, orario, ospiti, tipo da `booking_modes[]`, opzione menu/offerta carosello, voci `menu_selection`, totali con label **Totale**, intolleranze, note senza prefisso auto-sottotab); **nessuna** riga barrata «Totale senza menù preselezionato»; **nessuna** promo in email. **Rifiuto:** solo copy del template, **senza** box riepilogo. Contesto in `useEmailNotifications` da `booking_public_form_config`, `booking_custom_staff_presets`, `menu_categories`. **Mittente Brevo «Da:»:** globale `PrenotaZen` (`BREVO_SENDER_NAME`); nome ristorante in **firma** del corpo (`restaurant_name`). Add-on mittente branded → FU-EMAIL-5. **Mai** `event_type` / `EVENT_TYPE_LABELS`. Conferma: data/ora da `confirmed_start` se presente. |
| Cancel booking (elimina accettata) | soft-delete in archivio — **nessuna email** al cliente |
| Assign tavolo | vincoli su fascia/data/turno e conflitti tavolo |
| Service slots | incide su disponibilita pubblica e accettazione admin |
| Autosave settings | alcune sezioni autosalvano, altre richiedono salvataggio/guard |

## 5. Client pubblico vs admin

- Admin usa `supabase` autenticato.
- Pagina Prenota e Menu QR usano `supabasePublic`.
- Non spostare logiche pubbliche su client admin: rompe sicurezza e tenant isolation.

## 6. Fallback dati da monitorare

- Header admin usa `restaurantName || 'Sistema Gestionale Prenotazioni'`.
- Business hours e shift hanno fallback operativi.
- Home/analytics mostrano zero o stati vuoti quando non ci sono booking.
- CRM ignora prenotazioni senza email.
- `useMenuCategories` ritorna `[]` se la tabella manca, utile legacy ma rischioso da non nascondere.

## 7. Da confermare con Matteo

- Quali fallback sono accettabili in admin quando manca anagrafica tenant?
- CRM: cancellazione cliente deve davvero cancellare/archiviare prenotazioni collegate?
- Service slot overrides: allineare naming schema `date_from/date_to` vs riferimenti legacy `override_date`
  prima di testare flussi.
