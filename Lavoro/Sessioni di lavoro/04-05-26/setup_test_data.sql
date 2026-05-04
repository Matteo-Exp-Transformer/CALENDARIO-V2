-- Setup idempotente per test post-RLS (Suite 1/2/3)
-- Eseguire in SQL Editor (service role) prima dei test cross-tenant.
-- Questo script NON crea utenti in auth.users: creare manualmente in Auth
-- con le stesse email indicate sotto.

begin;

-- 1) Garantisce due tenant di test
insert into public.organizations (name, slug)
values
  ('Al Ritrovo', 'al-ritrovo'),
  ('Tenant B QA', 'tenant-b-qa')
on conflict (slug) do update
set name = excluded.name,
    updated_at = now();

-- 2) Admin mapping (tabella applicativa)
insert into public.admin_users (email, name, tenant_id)
select
  seed.email,
  seed.name,
  o.id
from (
  values
    ('admin.a.rls@example.com', 'Admin A'),
    ('admin.b.rls@example.com', 'Admin B')
) as seed(email, name)
join public.organizations o
  on o.slug = case
    when seed.email = 'admin.a.rls@example.com' then 'al-ritrovo'
    else 'tenant-b-qa'
  end
on conflict (email, tenant_id) do update
set name = excluded.name,
    updated_at = now();

-- 3) Seed dati pubblici minimi per evitare false negative su flow anon
insert into public.restaurant_settings (tenant_id, setting_key, setting_value)
select o.id, s.setting_key, to_jsonb(s.setting_value)
from public.organizations o
cross join (
  values
    ('restaurant_name', 'Ristorante Demo'),
    ('timezone', 'Europe/Rome'),
    ('booking_window_days', '60')
) as s(setting_key, setting_value)
where o.slug in ('al-ritrovo', 'tenant-b-qa')
on conflict (tenant_id, setting_key) do update
set setting_value = excluded.setting_value,
    updated_at = now();

insert into public.menu_items (tenant_id, name, category, price, description, sort_order)
select
  o.id,
  'Acqua Naturale',
  'bevande',
  2.50,
  'Bottiglia 75cl',
  1
from public.organizations o
where o.slug in ('al-ritrovo', 'tenant-b-qa')
on conflict (tenant_id, name, category) do update
set price = excluded.price,
    description = excluded.description,
    updated_at = now();

-- 4) tenant_usage base per test trigger/concorrenza
insert into public.tenant_usage (organization_id, year, bookings_count, booking_requests_count)
select o.id, extract(year from now())::int, 0, 0
from public.organizations o
where o.slug in ('al-ritrovo', 'tenant-b-qa')
on conflict (organization_id, year) do nothing;

-- 5) Seed booking isolate per test cross-tenant update/delete
insert into public.booking_requests (
  tenant_id, client_name, client_email, desired_date, desired_time, num_guests, status, booking_source
)
select
  o.id,
  case when o.slug = 'al-ritrovo' then 'Seed Tenant A' else 'Seed Tenant B' end,
  case when o.slug = 'al-ritrovo' then 'seedA@test.local' else 'seedB@test.local' end,
  current_date + interval '7 days',
  '20:00',
  2,
  'pending',
  'admin'
from public.organizations o
where o.slug in ('al-ritrovo', 'tenant-b-qa')
  and not exists (
    select 1
    from public.booking_requests b
    where b.tenant_id = o.id
      and b.client_email in ('seedA@test.local', 'seedB@test.local')
  );

commit;

-- 6) Verifica rapida post-setup
select slug, id from public.organizations where slug in ('al-ritrovo', 'tenant-b-qa') order by slug;
select email, tenant_id from public.admin_users where email in ('admin.a.rls@example.com', 'admin.b.rls@example.com') order by email;
select tenant_id, count(*) as booking_seed_count
from public.booking_requests
where client_email in ('seedA@test.local', 'seedB@test.local')
group by tenant_id
order by tenant_id;

-- 7) Step manuale obbligatorio (Auth)
-- Creare in Authentication > Users:
-- - admin.a.rls@example.com / (password a scelta)
-- - admin.b.rls@example.com / (password a scelta)
-- - outsider.rls@example.com / (password a scelta) [senza riga in admin_users, per S1.12]
