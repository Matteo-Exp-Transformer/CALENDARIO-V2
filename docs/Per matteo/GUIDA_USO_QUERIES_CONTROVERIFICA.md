# Query SQL per debug e controverifica — Supabase Studio

Tutte le query vanno eseguite nell'SQL Editor di Supabase Studio.
Sostituisci `'IL-TUO-TENANT-ID'` con l'UUID del tenant che vuoi ispezionare
(lo trovi in `organizations` cercando per slug o nome).

---

## 0. Trova il tenant ID dal nome o slug

```sql
SELECT id, name, slug, edition, is_active
FROM organizations
ORDER BY created_at DESC;
```

---

## 1. Form pubblico — pagina Prenota

### Ultima prenotazione ricevuta (tutti i dati)

```sql
SELECT *
FROM booking_requests
WHERE tenant_id = 'IL-TUO-TENANT-ID'
ORDER BY created_at DESC
LIMIT 1;
```

### Ultime 5 prenotazioni ricevute

```sql
SELECT
  id,
  client_name,
  client_email,
  client_phone,
  desired_date,
  desired_time,
  num_guests,
  booking_type,
  event_type,
  placement,
  menu,
  preset_menu,
  menu_total_per_person,
  menu_total_booking,
  special_requests,
  dietary_restrictions,
  booking_source,
  status,
  created_at
FROM booking_requests
WHERE tenant_id = 'IL-TUO-TENANT-ID'
ORDER BY created_at DESC
LIMIT 5;
```

### Solo quelle arrivate dal form pubblico (non inserite dall'admin)

```sql
SELECT *
FROM booking_requests
WHERE tenant_id = 'IL-TUO-TENANT-ID'
  AND booking_source = 'public'
ORDER BY created_at DESC
LIMIT 10;
```

### Solo quelle inserite dall'admin

```sql
SELECT *
FROM booking_requests
WHERE tenant_id = 'IL-TUO-TENANT-ID'
  AND booking_source = 'admin'
ORDER BY created_at DESC
LIMIT 10;
```

---

## 2. CRM — verifica che i clienti vengano salvati

### Ultimi 10 clienti entrati nel CRM

```sql
SELECT id, name, email, phone, source, created_at, updated_at
FROM customers
WHERE tenant_id = 'IL-TUO-TENANT-ID'
ORDER BY created_at DESC
LIMIT 10;
```

### Verifica fix B01 — cliente salvato dopo prenotazione pubblica

Dopo che qualcuno compila il form, cerca per email:

```sql
SELECT *
FROM customers
WHERE tenant_id = 'IL-TUO-TENANT-ID'
  AND email = lower(trim('email-del-cliente@esempio.it'));
```

### Clienti da form pubblico vs inseriti manualmente

```sql
SELECT source, count(*) AS totale
FROM customers
WHERE tenant_id = 'IL-TUO-TENANT-ID'
GROUP BY source;
```

---

## 3. Archivio — prenotazioni non in pending

### Prenotazioni accettate (archivio visibile in dashboard)

```sql
SELECT
  id,
  client_name,
  client_email,
  desired_date,
  desired_time,
  num_guests,
  confirmed_start,
  confirmed_end,
  status,
  created_at
FROM booking_requests
WHERE tenant_id = 'IL-TUO-TENANT-ID'
  AND status = 'accepted'
ORDER BY desired_date DESC
LIMIT 20;
```

### Prenotazioni rifiutate

```sql
SELECT id, client_name, desired_date, rejection_reason, status
FROM booking_requests
WHERE tenant_id = 'IL-TUO-TENANT-ID'
  AND status = 'rejected'
ORDER BY created_at DESC
LIMIT 10;
```

### Soft-delete (cancellate ma conservate nel DB)

```sql
SELECT id, client_name, desired_date, cancellation_reason, cancelled_at, status
FROM booking_requests
WHERE tenant_id = 'IL-TUO-TENANT-ID'
  AND status = 'deleted'
ORDER BY cancelled_at DESC
LIMIT 10;
```

### Tutte per stato — conteggio rapido

```sql
SELECT status, count(*) AS totale
FROM booking_requests
WHERE tenant_id = 'IL-TUO-TENANT-ID'
GROUP BY status
ORDER BY totale DESC;
```

---

## 4. Query personalizzate — "quante con X?"

### Quante in una fascia oraria (es. pranzo 12:00–14:00)

```sql
SELECT count(*) AS totale
FROM booking_requests
WHERE tenant_id = 'IL-TUO-TENANT-ID'
  AND desired_time >= '12:00'
  AND desired_time <= '14:00';
```

### Quante con più di 20 coperti

```sql
SELECT id, client_name, desired_date, num_guests
FROM booking_requests
WHERE tenant_id = 'IL-TUO-TENANT-ID'
  AND num_guests > 20
ORDER BY num_guests DESC;
```

### Quante con un certo nome (es. tutte le "Matteo")

```sql
SELECT id, client_name, client_email, desired_date, num_guests, status
FROM booking_requests
WHERE tenant_id = 'IL-TUO-TENANT-ID'
  AND lower(client_name) LIKE '%matteo%'
ORDER BY created_at DESC;
```

### Prenotazioni di un certo tipo (es. evento privato)

```sql
SELECT id, client_name, desired_date, event_type, booking_type, num_guests
FROM booking_requests
WHERE tenant_id = 'IL-TUO-TENANT-ID'
  AND event_type = 'evento_privato'   -- adatta al valore reale nel DB
ORDER BY desired_date DESC;
```

### Quante prenotazioni in un giorno specifico

```sql
SELECT *
FROM booking_requests
WHERE tenant_id = 'IL-TUO-TENANT-ID'
  AND desired_date = '2026-05-20'   -- cambia data
ORDER BY desired_time;
```

### Totale coperti per giorno (ultimi 30 giorni)

```sql
SELECT desired_date, sum(num_guests) AS coperti_totali, count(*) AS prenotazioni
FROM booking_requests
WHERE tenant_id = 'IL-TUO-TENANT-ID'
  AND status IN ('pending', 'accepted')
  AND desired_date >= current_date - interval '30 days'
GROUP BY desired_date
ORDER BY desired_date DESC;
```

---

## 5. Impostazioni locale — pagina Impostazioni

### Tutte le impostazioni del tenant (una riga = una sezione)

```sql
SELECT setting_key, setting_value, updated_at
FROM restaurant_settings
WHERE tenant_id = 'IL-TUO-TENANT-ID'
ORDER BY setting_key;
```

### Solo orari apertura

```sql
SELECT setting_value
FROM restaurant_settings
WHERE tenant_id = 'IL-TUO-TENANT-ID'
  AND setting_key = 'business_hours';
```

### Solo dati anagrafici (nome, email, telefono, indirizzo)

```sql
SELECT setting_key, setting_value
FROM restaurant_settings
WHERE tenant_id = 'IL-TUO-TENANT-ID'
  AND setting_key IN ('restaurant_name', 'contact_email', 'contact_phone', 'contact_address');
```

### Solo impostazioni prenotazione (slot, finestra giorni, limite giornaliero)

```sql
SELECT setting_key, setting_value
FROM restaurant_settings
WHERE tenant_id = 'IL-TUO-TENANT-ID'
  AND setting_key IN (
    'booking_time_slots',
    'booking_window_days',
    'daily_guest_limit',
    'slot_guest_capacities',
    'walk_in_max_guests'
  );
```

### Solo impostazioni menu e promozioni

```sql
SELECT setting_key, setting_value
FROM restaurant_settings
WHERE tenant_id = 'IL-TUO-TENANT-ID'
  AND setting_key IN (
    'booking_staff_presets_visible',
    'booking_custom_staff_presets',
    'booking_vol_au_vent_promo_visible',
    'booking_vol_au_vent_promo_message',
    'booking_vol_au_vent_promos',
    'booking_placement_areas'
  );
```

---

## 6. Menu — voci e categorie

### Tutte le voci menu del tenant

```sql
SELECT id, name, category, price, description, sort_order
FROM menu_items
WHERE tenant_id = 'IL-TUO-TENANT-ID'
ORDER BY category, sort_order, name;
```

### Categorie menu configurate

```sql
SELECT key, label, sort_order
FROM menu_categories
WHERE tenant_id = 'IL-TUO-TENANT-ID'
ORDER BY sort_order, label;
```

---

## 7. Utilizzo annuale — limiti piano

```sql
SELECT year, booking_requests_count, bookings_count
FROM tenant_usage
WHERE organization_id = 'IL-TUO-TENANT-ID'
ORDER BY year DESC;
```
