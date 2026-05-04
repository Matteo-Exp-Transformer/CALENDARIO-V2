# Prompt per agente — Piano: UI “Impostazioni ristorante” (legge/scrive `restaurant_settings`)

## Contesto

Nel repo **CalendarBackup-v2** oggi le impostazioni operative del locale (es. `business_hours`, altre chiavi in `public.restaurant_settings`) sono usate dal form pubblico e da hook come `useBusinessHours`, ma **non esiste una schermata admin chiara** dove l’utente non tecnico modifica questi valori senza aprire Supabase.

La checklist Suite 2 (S2.9) richiede: cambiare un valore, salvare, ricaricare la pagina e vedere che persiste.

## Obiettivo

Progettare (e poi implementare in passi piccoli) una **scheda Impostazioni** nel pannello admin che:

1. Legge solo le righe `restaurant_settings` del **tenant corrente** (già vincolato da RLS / `admin_users`).
2. Permette modificare almeno: **orari (`business_hours`)** e 1–2 campi testuali utili (es. nome visualizzato, messaggio footer) se già presenti come `setting_key`.
3. Salva con **upsert** o update mirato; dopo F5 i valori restano.
4. Non espone mai `tenant_id` di altri tenant; riusa `TenantContext` / pattern delle altre tab admin.

## Vincoli

- Rispettare migrazioni RLS esistenti (`002_rls_admin_users.sql`, policy `admin_*_restaurant_settings`).
- Nessun bypass client: solo client Supabase **authenticated** admin, niente service role nel browser.
- Allineare tipi a `src/types/database.ts` e hook esistenti (`SettingsTab` se già presente: estendere invece di duplicare).

## Output atteso dal piano

1. Inventario chiavi `setting_key` già in uso nel codice (grep `restaurant_settings`, `setting_key`).
2. Wireframe testuale: sezioni UI, campi, pulsante Salva, messaggi errore.
3. Piano commit: (a) query hook, (b) form controllato, (c) mutazione + invalidazione cache, (d) test manuali S2.9.
4. Rischio: JSON `setting_value` (jsonb) — strategia di validazione (es. schema Zod per `business_hours` allineato a `parseBusinessHours`).

Inizia esplorando `src/` per componenti **Settings** esistenti e la struttura reale della tabella, poi proponi il piano in elenco numerato.
