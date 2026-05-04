# Prompt per agente — Piano: UI "Impostazioni ristorante" (legge/scrive `restaurant_settings`)

## Contesto

Nel repo **CalendarBackup-v2** le impostazioni operative del locale (es. `business_hours` in `public.restaurant_settings`, lette da [useBusinessHours.ts](src/hooks/useBusinessHours.ts) e parsate in [businessHours.ts](src/lib/businessHours.ts)) sono usate dal form pubblico, ma **non c'è ancora un editor admin** per modificarle senza aprire Supabase.

Stato attuale rilevante:

- [SettingsTab.tsx](src/features/booking/components/SettingsTab.tsx) **esiste già** ma è una vetrina informativa (Stato Sistema, Variabili Ambiente, azioni Test/Logs Email, modale Prezzi Menu). **Non legge/scrive `restaurant_settings`.**
- [AdminDashboard.tsx](src/pages/AdminDashboard.tsx) **non monta `SettingsTab`**: le tab attive sono solo `calendar | pending | archive`. Quindi anche se l'editor fosse pronto, non sarebbe raggiungibile.
- Schema (vedi [001_schema_completo.sql](supabase/migrations/001_schema_completo.sql)):
  ```sql
  restaurant_settings (id, setting_key TEXT, setting_value JSONB, updated_at, tenant_id UUID, UNIQUE(tenant_id, setting_key))
  ```
- RLS in [002_rls_admin_users.sql](supabase/migrations/002_rls_admin_users.sql): **4 policy separate** `admin_select_restaurant_settings`, `admin_insert_restaurant_settings`, `admin_update_restaurant_settings`, `admin_delete_restaurant_settings`, tutte vincolate a `current_admin_tenant_id()`.

La checklist Suite 2 (S2.9) richiede: cambiare un valore, salvare, ricaricare la pagina e vedere che persiste.

## Obiettivo

Progettare (e poi implementare in passi piccoli) la **scheda Impostazioni** lato admin che:

1. Aggiunge **due voci nav distinte** in [AdminDashboard.tsx](src/pages/AdminDashboard.tsx): `settings-system` (monta l'attuale `SettingsTab` informativo) e `settings-restaurant` (nuovo componente `RestaurantSettingsTab`). Non mescolare diagnostica tecnica e dati operativi del locale nella stessa vista.
2. Legge solo le righe `restaurant_settings` del **tenant corrente** via [TenantContext](src/contexts/TenantContext.tsx) (RLS già lo vincola lato DB).
3. **Chiavi editabili in v1**, solo quelle già presenti nel seed [setup_test_data.sql](Lavoro/Sessioni di lavoro/04-05-26/setup_test_data.sql) + `business_hours`:
   - `restaurant_name` (string scalare JSONB)
   - `timezone` (string scalare JSONB)
   - `booking_window_days` (number scalare JSONB)
   - `business_hours` (object JSONB, shape coerente con `parseBusinessHours`); il primo upsert crea la riga se assente.
   Niente "messaggio footer" o altre chiavi senza un consumer reale nell'app: **fuori scope**.
4. **Shape `setting_value`**: per le chiavi testuali/numeriche trattare il valore come **scalare JSONB** (es. `to_jsonb('Ristorante Demo')`, `to_jsonb(7)`), NON wrappare in `{text: "..."}`. Editor con registry per chiave: ogni `setting_key` ha il proprio parser/serializer/validator (Zod) e il proprio campo UI.
5. Salva con **upsert** Supabase: `.upsert(row, { onConflict: 'tenant_id,setting_key' })` (API `supabase-js` v2). Verificare in fase di piano la versione del client; in caso di sorprese sul conflitto composito, fallback a select+update/insert nella stessa mutation.
6. **Solo insert/update in UI**: nessun pulsante "Rimuovi impostazione". La policy `admin_delete_restaurant_settings` resta a livello DB ma non viene esposta.
7. Non espone mai `tenant_id` di altri tenant: riusa il pattern di [useMenuItems.ts](src/features/booking/hooks/useMenuItems.ts) (`tenantId` da `useTenantContext`, query/mutazioni filtrate, query key con `tenantId`).

## Vincoli

- Rispettare le 4 policy RLS in [002_rls_admin_users.sql](supabase/migrations/002_rls_admin_users.sql) (`admin_select/insert/update/delete_restaurant_settings`). **Fonte autorevole post-migrazione: 002**, non `001` (in `001` ci sono ancora le vecchie policy `tenant_*` e l'`anon_select` non droppata: rumorose per chi fa solo grep su `001`).
- Nessun bypass client: solo client Supabase **authenticated** admin (NON `supabasePublic`, che è anon e serve solo al form pubblico).
- Tipi allineati a [src/types/database.ts](src/types/database.ts) e a `BusinessHours` in [businessHours.ts](src/lib/businessHours.ts).
- Validare lato client il JSON `setting_value` per `business_hours` con Zod coerente con `parseBusinessHours` / `getDefaultBusinessHours`. Per chiavi scalari, validator dedicato per chiave.

## Cache invalidation

[useBusinessHours.ts](src/hooks/useBusinessHours.ts) ha `staleTime: 5min` e `refetchInterval: 10min` — **non basta invalidare passivamente**. Dopo l'upsert:

```ts
queryClient.invalidateQueries({ queryKey: ['restaurant_settings'], refetchType: 'active' })
queryClient.invalidateQueries({ queryKey: ['restaurant_settings', 'business_hours', tenantId], refetchType: 'active' })
```

Così chi torna subito al form pubblico nella stessa sessione vede i nuovi orari senza aspettare lo stale window.

> **Nota TanStack Query**: la prima `invalidateQueries` con prefisso `['restaurant_settings']` già copre per default tutte le key che iniziano con quel prefisso (incluso `['restaurant_settings', 'business_hours', tenantId]`). La seconda riga è **ridondante ma intenzionale**: serve come guard se in futuro qualcuno passa a `exact: true` o cambia la key strategy. Tenerla.

## Nota seed `setup_test_data.sql`

In [setup_test_data.sql](Lavoro/Sessioni di lavoro/04-05-26/setup_test_data.sql) il seed scrive `('booking_window_days', '60')` e con `to_jsonb(s.setting_value)` il valore in DB risulta uno **scalare stringa JSON** (`"60"`), non un numero JSON (`60`). Due opzioni, valide entrambe:

1. **Registry tollerante** (preferito, no migrazione): per `booking_window_days` il parser accetta sia `string` numerica che `number` e normalizza a `number`; il serializer scrive sempre `number`. Così nuovi upsert sono "puliti" e i seed legacy continuano a funzionare.
2. Allineare il seed a `to_jsonb(60::int)` per scrivere un numero JSON tipizzato.

Documentare la scelta nel piano e riflettere lo stesso pattern per ogni futura chiave numerica.

## Output atteso dal piano

1. **Inventario chiavi `setting_key`** effettivamente in uso: grep su `restaurant_settings`/`setting_key` in `src/` e `supabase/` (incluso seed), eventuale query manuale al DB di sviluppo. Elenco con tipo del `setting_value` (scalare string / scalare number / object). Lo scope v1 è esplicitamente `restaurant_name`, `timezone`, `booking_window_days`, `business_hours`.
2. **Wireframe testuale**: sezioni UI (Orari, Anagrafica), campi per chiave (input testo per `restaurant_name`/`timezone`, input numerico per `booking_window_days`, editor strutturato per `business_hours`), pulsante Salva, stati `dirty`/`pending`, messaggi di errore (RLS denial, validazione Zod).
3. **Piano commit** in PR piccole:
   - (a) hook `useRestaurantSetting(setting_key)` + `useUpsertRestaurantSetting()` con `onConflict: 'tenant_id,setting_key'` e invalidazione aggressiva (vedi sezione Cache invalidation sopra).
   - (b) registry per chiave (parser/serializer/Zod) e componente `BusinessHoursEditor` controllato.
   - (c) nuovo `RestaurantSettingsTab` + due NavItem in `AdminDashboard` (`settings-system` per il `SettingsTab` esistente, `settings-restaurant` per il nuovo).
   - (d) test manuali S2.9: modifica `business_hours` → salva → F5 → form pubblico mostra **esplicitamente** i nuovi orari (non solo "non crasha"); idem per `restaurant_name` se mostrato in header.
4. **Rischio JSON `setting_value` (jsonb)**: la shape varia per chiave (scalari vs object). Registry obbligatorio. Test esplicito: alla prima modifica di `business_hours` su un tenant senza riga, l'upsert deve crearla.

## Criterio di successo S2.9

> Cambio `business_hours` (es. lunedì chiuso → aperto) → Salva → F5 → riapro `/prenota/al-ritrovo` in incognito sul tenant corretto → il form mostra il giorno come aperto con gli slot corrispondenti.

Non basta "il form non crasha" o "tornano i default": deve riflettere il valore appena scritto.

Inizia esplorando `src/` per i punti già citati e il seed `setup_test_data.sql`, poi proponi il piano in elenco numerato.
