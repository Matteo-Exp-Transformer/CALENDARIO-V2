# Guida query SQL — controverifica e debug

> Query utili per verificare lo stato del DB (TEST `docnnernvp`) durante lo sviluppo.
> Sostituire `<tenant_id>` e `<qr_id>` con i valori reali. Mai eseguire UPDATE/DELETE
> di produzione senza conferma esplicita — verificare prima `get_project_url` (TEST = ok).

---

## § Menu QR (FU-017)

### Q1 — Lista QR di un tenant con campi chiave

```sql
SELECT
  id,
  short_code,
  name,
  is_active,
  sort_order,
  theme_key,
  category_filter,
  hidden_menu_item_ids,
  item_sort_overrides,
  created_at
FROM menu_qr_codes
WHERE tenant_id = '<tenant_id>'
ORDER BY sort_order, created_at;
```

### Q2 — Override titoli/descrizioni/icone per un QR

```sql
SELECT
  category_key,
  title,
  description,
  icon,
  updated_at
FROM menu_qrcode_categories
WHERE menu_qr_code_id = '<qr_id>'
ORDER BY category_key;
```

### Q3 — Ingredienti nascosti in un QR (nome + categoria)

```sql
SELECT
  mi.id,
  mi.name,
  mi.category,
  mi.price,
  mi.is_available
FROM menu_qr_codes qr
CROSS JOIN LATERAL jsonb_array_elements_text(qr.hidden_menu_item_ids) AS h(item_id)
JOIN menu_items mi ON mi.id = h.item_id::uuid
WHERE qr.id = '<qr_id>'
ORDER BY mi.category, mi.name;
```

### Q4 — Override ordine piatti per-QR (item_sort_overrides espanso)

```sql
SELECT
  qr.id AS qr_id,
  qr.name AS qr_name,
  cat_key,
  ord,
  mi.name AS item_name,
  mi.category
FROM menu_qr_codes qr
CROSS JOIN LATERAL jsonb_each(qr.item_sort_overrides) AS kv(cat_key, ids)
CROSS JOIN LATERAL (
  SELECT elem::text AS item_id, ordinality AS ord
  FROM jsonb_array_elements_text(kv.ids) WITH ORDINALITY
) AS elems
JOIN menu_items mi ON mi.id = elems.item_id::uuid
WHERE qr.id = '<qr_id>'
ORDER BY cat_key, ord;
```

### Q5 — Preset staff del tenant (booking_custom_staff_presets)

```sql
SELECT
  setting_value
FROM restaurant_settings
WHERE tenant_id = '<tenant_id>'
  AND setting_key = 'booking_custom_staff_presets';
```

> Il valore è JSONB array `[{ id, name, item_ids[], booking_types[], ... }]`.
> Per espandere ogni preset come righe:
>
> ```sql
> SELECT
>   elem->>'id'   AS preset_id,
>   elem->>'name' AS preset_name,
>   jsonb_array_length(elem->'item_ids') AS n_items
> FROM restaurant_settings,
>      jsonb_array_elements(setting_value) AS elem
> WHERE tenant_id = '<tenant_id>'
>   AND setting_key = 'booking_custom_staff_presets';
> ```

---

## § Tenant e organizzazione

```sql
-- Trova tenant per slug
SELECT id, name, slug, edition FROM organizations WHERE slug = '<slug>';

-- Tenant features abilitate
SELECT feature_key, is_enabled, updated_at
FROM tenant_features
WHERE tenant_id = '<tenant_id>'
ORDER BY feature_key;
```

---

## § Magazzino menu

```sql
-- Categorie del tenant con conteggio ingredienti
SELECT
  mc.key,
  mc.label,
  mc.is_available,
  COUNT(mi.id) AS n_items
FROM menu_categories mc
LEFT JOIN menu_items mi ON mi.tenant_id = mc.tenant_id AND mi.category = mc.key AND mi.is_available
WHERE mc.tenant_id = '<tenant_id>'
GROUP BY mc.key, mc.label, mc.is_available
ORDER BY mc.sort_order;

-- Ingredienti di una categoria
SELECT id, name, price, sort_order, is_available, image_url IS NOT NULL AS has_photo
FROM menu_items
WHERE tenant_id = '<tenant_id>'
  AND category = '<category_key>'
ORDER BY sort_order, name;
```
