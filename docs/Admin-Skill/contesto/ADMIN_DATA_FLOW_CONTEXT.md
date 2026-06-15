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

Chiavi admin rilevanti:

- `restaurant_name`, `contact_email`, `contact_phone`, `contact_address`
- `business_hours`
- `slot_guest_capacities`, `booking_time_slots_enabled`
- `public_booking_page_background`, `public_booking_strip_photo`
- `app_theme`
- `booking_public_form_config`
- `booking_menu_promos`
- `booking_custom_staff_presets`
- `booking_staff_presets_visible`
- `walk_in_max_guests`

Vincolo importante: `setting_value` e `JSONB NOT NULL`; non salvare `NULL` dove il registry si aspetta
stringa vuota o default.

## 4. Scritture sensibili

| Flusso | Perche sensibile |
|---|---|
| Rename categoria menu | sincronizza `menu_categories`, `menu_items`, QR, override, form Prenota e storage |
| Delete categoria menu | elimina ingredienti e poi sincronizza QR/Form/foto |
| Delete cliente CRM | soft-delete booking collegate e cancella riga `customers` |
| Accept/reject booking | cambia stato, orari, capienza, **email al cliente** (solo accetta/rifiuta se `VITE_ENABLE_SEND_EMAIL`), calendar/analytics |
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
