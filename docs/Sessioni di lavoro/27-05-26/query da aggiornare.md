# Query aggiornate per DB produzione

> Uso: incolla una query alla volta nel SQL editor di Supabase produzione e cambia solo i valori nel blocco `input`.
> Email salvata in minuscolo: evita duplicati tipo `Mario@email.com` / `mario@email.com`.
> Edition valide: `classic`, `pro`, `enterprise`.
> Foto striscia Prenota valide: `strip-01`, `strip-02`, `strip-03`, `strip-04`, `strip-05`, `strip-06`. Usa `NULL` per lasciare la prima foto di default.

---

## Prima query: crea o aggiorna nuovo utente con tenant e versione associati

Description: dopo aver aggiunto il nuovo utente manualmente in Auth, compila email, nome azienda, slug e versione. Se tenant/admin esistono gia, aggiorna i dati.

```sql
BEGIN;

WITH input AS (
  SELECT
    lower(trim('matteo-test@p.com'))::text AS admin_email,
    'admin'::text AS admin_name,
    'Trattoria da Matteo'::text AS organization_name,
    'da-matteo'::text AS organization_slug,
    'pro'::text AS edition,
    NULL::text AS public_booking_strip_photo -- NULL oppure 'strip-01'...'strip-06'
),
upsert_org AS (
  INSERT INTO organizations (name, slug, edition, is_active, updated_at)
  SELECT organization_name, organization_slug, edition, true, now()
  FROM input
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    edition = EXCLUDED.edition,
    is_active = true,
    updated_at = now()
  RETURNING id, name, slug, edition
),
upsert_admin AS (
  INSERT INTO admin_users (tenant_id, email, name, updated_at)
  SELECT id, input.admin_email, input.admin_name, now()
  FROM upsert_org
  CROSS JOIN input
  ON CONFLICT (email, tenant_id) DO UPDATE SET
    name = EXCLUDED.name,
    updated_at = now()
  RETURNING email, name, tenant_id
),
upsert_restaurant_name AS (
  INSERT INTO restaurant_settings (tenant_id, setting_key, setting_value, updated_at)
  SELECT id, 'restaurant_name', to_jsonb(name), now()
  FROM upsert_org
  ON CONFLICT (tenant_id, setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    updated_at = now()
  RETURNING tenant_id
),
upsert_strip_photo AS (
  INSERT INTO restaurant_settings (tenant_id, setting_key, setting_value, updated_at)
  SELECT
    upsert_org.id,
    'public_booking_strip_photo',
    CASE
      WHEN input.public_booking_strip_photo IS NULL THEN 'null'::jsonb
      ELSE to_jsonb(input.public_booking_strip_photo)
    END,
    now()
  FROM upsert_org
  CROSS JOIN input
  ON CONFLICT (tenant_id, setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    updated_at = now()
  RETURNING tenant_id
)
SELECT
  upsert_admin.email,
  upsert_admin.name AS nome_admin,
  upsert_org.name AS nome_ristorante,
  upsert_org.slug,
  upsert_org.edition,
  input.public_booking_strip_photo
FROM upsert_admin
JOIN upsert_org ON upsert_org.id = upsert_admin.tenant_id
JOIN upsert_restaurant_name ON upsert_restaurant_name.tenant_id = upsert_org.id
JOIN upsert_strip_photo ON upsert_strip_photo.tenant_id = upsert_org.id
CROSS JOIN input;

COMMIT;
```

---

## Seconda query: cancella utente e tenant associato

Description: compila email utente e slug azienda. Cancella il tenant solo se quell'email e admin di quello slug. Le prenotazioni vengono cancellate prima perche `booking_requests` blocca la cancellazione diretta del tenant.

```sql
BEGIN;

WITH input AS (
  SELECT
    lower(trim('0cavuz0@gmail.com'))::text AS admin_email,
    'al-ritrovo'::text AS organization_slug
),
target AS (
  SELECT o.id AS tenant_id, o.slug, o.name, au.email
  FROM organizations o
  JOIN admin_users au ON au.tenant_id = o.id
  JOIN input ON input.organization_slug = o.slug
             AND input.admin_email = lower(trim(au.email))
),
deleted_bookings AS (
  DELETE FROM booking_requests br
  USING target
  WHERE br.tenant_id = target.tenant_id
  RETURNING br.id
),
deleted_org AS (
  DELETE FROM organizations o
  USING target
  WHERE o.id = target.tenant_id
  RETURNING o.id, o.slug, o.name
)
SELECT
  deleted_org.id AS tenant_id_cancellato,
  deleted_org.slug,
  deleted_org.name,
  (SELECT count(*) FROM deleted_bookings) AS prenotazioni_cancellate
FROM deleted_org;

COMMIT;
```

Verifica opzionale prima di cancellare:

```sql
SELECT o.id, o.slug, o.name, o.edition, au.email
FROM organizations o
JOIN admin_users au ON au.tenant_id = o.id
WHERE o.slug = 'al-ritrovo'
  AND lower(trim(au.email)) = lower(trim('0cavuz0@gmail.com'));
```

---

## Terza query: controlla tenant, slug, versione e foto Prenota associati a utente

Description: inserisci email e vedi i dati associati, inclusa la nuova foto della striscia pagina Prenota.

```sql
WITH input AS (
  SELECT lower(trim('alritrovo@gmail.com'))::text AS admin_email
)
SELECT
  au.email,
  au.name AS nome_admin,
  o.id AS tenant_id,
  o.name AS nome_ristorante,
  o.slug,
  o.edition,
  o.is_active,
  o.plan,
  rs_strip.setting_value #>> '{}' AS public_booking_strip_photo,
  rs_name.setting_value #>> '{}' AS restaurant_name_setting
FROM admin_users au
JOIN organizations o ON o.id = au.tenant_id
LEFT JOIN restaurant_settings rs_strip
  ON rs_strip.tenant_id = o.id
 AND rs_strip.setting_key = 'public_booking_strip_photo'
LEFT JOIN restaurant_settings rs_name
  ON rs_name.tenant_id = o.id
 AND rs_name.setting_key = 'restaurant_name'
JOIN input ON input.admin_email = lower(trim(au.email))
ORDER BY o.slug, au.email;
```

---

## Quarta query: cambia edition app associata a utente e azienda

Description: cambia versione app per l'azienda collegata a quell'utente. Compila anche lo slug per evitare di aggiornare il tenant sbagliato se la stessa email e admin di piu locali. Usa solo `classic`, `pro` o `enterprise`.

```sql
WITH input AS (
  SELECT
    lower(trim('0cavuz0@gmail.com'))::text AS admin_email,
    'al-ritrovo'::text AS organization_slug,
    'classic'::text AS new_edition
),
updated_org AS (
  UPDATE organizations o
  SET
    edition = input.new_edition,
    updated_at = now()
  FROM admin_users au
  JOIN input ON input.admin_email = lower(trim(au.email))
  WHERE au.tenant_id = o.id
    AND o.slug = input.organization_slug
  RETURNING o.id, o.name, o.slug, o.edition
)
SELECT *
FROM updated_org
ORDER BY slug;
```

---

## Quinta query: utenti admin registrati -> slug + edition

Description: vedi quali utenti sono inseriti, con quale slug, versione e foto striscia Prenota.

```sql
SELECT
  au.email,
  au.name AS nome_admin,
  o.name AS nome_ristorante,
  o.slug,
  o.edition,
  o.plan,
  o.is_active AS tenant_attivo,
  rs_strip.setting_value #>> '{}' AS public_booking_strip_photo,
  au.created_at AS registrato_il
FROM admin_users au
JOIN organizations o ON o.id = au.tenant_id
LEFT JOIN restaurant_settings rs_strip
  ON rs_strip.tenant_id = o.id
 AND rs_strip.setting_key = 'public_booking_strip_photo'
ORDER BY o.slug, au.email;
```

---

## Sesta query: aggiorna solo la foto della striscia pagina Prenota

Description: usa questa se devi solo cambiare la foto verticale della pagina Prenota per un tenant gia esistente. `NULL` lascia il default, altrimenti usa `strip-01` ... `strip-06`.

```sql
WITH input AS (
  SELECT
    'da-matteo'::text AS organization_slug,
    'strip-01'::text AS public_booking_strip_photo -- NULL oppure 'strip-01'...'strip-06'
),
target AS (
  SELECT o.id AS tenant_id, o.slug, o.name
  FROM organizations o
  JOIN input ON input.organization_slug = o.slug
),
upsert_setting AS (
  INSERT INTO restaurant_settings (tenant_id, setting_key, setting_value, updated_at)
  SELECT
    target.tenant_id,
    'public_booking_strip_photo',
    CASE
      WHEN input.public_booking_strip_photo IS NULL THEN 'null'::jsonb
      ELSE to_jsonb(input.public_booking_strip_photo)
    END,
    now()
  FROM target
  CROSS JOIN input
  ON CONFLICT (tenant_id, setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    updated_at = now()
  RETURNING tenant_id, setting_value
)
SELECT
  target.slug,
  target.name AS nome_ristorante,
  upsert_setting.setting_value #>> '{}' AS public_booking_strip_photo
FROM upsert_setting
JOIN target ON target.tenant_id = upsert_setting.tenant_id;
```
