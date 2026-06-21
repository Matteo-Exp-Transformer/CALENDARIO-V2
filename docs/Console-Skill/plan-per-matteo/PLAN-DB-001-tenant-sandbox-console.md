# PLAN-DB-001 — Creazione tenant sandbox della Console

**Stato:** ✅ ESEGUITO (2026-06-22, via MCP `CONSOLE` write su TEST) · **Ambiente:** TEST `docnnernvp`

> Esito: creati `console-classic` (id `4c694cb8-66af-478f-afd2-8719f07d64b4`) e `console-pro`
> (id `b5436de8-731e-469e-a888-36785823be6b`), entrambi `is_active=true`, con `restaurant_name` +
> `timezone=Europe/Rome`. Non più da passare a Matteo.

## Obiettivo

Creare due ristoranti «di prova» dedicati al branch Console, su cui l'agente potrà scrivere dati in
sicurezza senza toccare i tenant reali di Matteo. Servono come banco di prova della Console.
*Cosa cambia: avremo un Classic e un Pro «nostri» dove sperimentare edition, feature e impostazioni.*

> **Perché serve Matteo:** la connessione MCP su TEST (`docnnernvp`) è in **sola lettura**, quindi
> l'agente non può eseguire questo INSERT. Matteo lo lancia (SQL editor Supabase o CLI su TEST).

## Modifica proposta (SQL)

```sql
-- 1) due organizations sandbox (idempotente)
insert into organizations (name, slug, edition)
values
  ('Console Sandbox Classic', 'console-classic', 'classic'),
  ('Console Sandbox Pro',     'console-pro',     'pro')
on conflict (slug) do nothing;

-- 2) impostazioni minime per ciascuno (nome + timezone)
insert into restaurant_settings (tenant_id, setting_key, setting_value)
select o.id, v.k, v.val
from organizations o
join (values
  ('restaurant_name', '"Console Sandbox Classic"'::jsonb),
  ('timezone',        '"Europe/Rome"'::jsonb)
) as v(k, val) on o.slug = 'console-classic'
on conflict do nothing;

insert into restaurant_settings (tenant_id, setting_key, setting_value)
select o.id, v.k, v.val
from organizations o
join (values
  ('restaurant_name', '"Console Sandbox Pro"'::jsonb),
  ('timezone',        '"Europe/Rome"'::jsonb)
) as v(k, val) on o.slug = 'console-pro'
on conflict do nothing;
```

> Nota: per il tenant Pro **non** serve toccare `qr_menu_enabled` (legacy): l'edition `pro` accende
> già il Menu QR via `buildFeatures()`. Eventuali add-on su Classic andranno in `tenant_features`.

## Tabelle/colonne toccate

- `organizations` — 2 righe nuove (`console-classic`, `console-pro`). Default coprono `plan`,
  `is_active`, limiti, `qr_menu_enabled=false`. Vincoli: `slug` unico, `edition` ∈ {classic,pro,enterprise}.
- `restaurant_settings` — 4 righe (2 per tenant).

## Impatto / rischi

- Basso: solo dati nuovi su TEST, slug non collidenti con gli esistenti (`test-classic`/`test-pro`).
- Nessuna modifica di schema. Nessun tenant esistente toccato.

## Come verificare dopo (su TEST)

```sql
select id, slug, name, edition, is_active from organizations
where slug in ('console-classic','console-pro');

select o.slug, rs.setting_key, rs.setting_value
from organizations o join restaurant_settings rs on rs.tenant_id = o.id
where o.slug in ('console-classic','console-pro') order by o.slug, rs.setting_key;
```

## Note per Matteo

- Confermi gli slug `console-classic` / `console-pro`? (così l'agente li usa come whitelist scritture).
- In alternativa, se preferisci darci un **canale scrivibile su TEST** (MCP write o credenziali CLI),
  l'agente li crea da sé rispettando comunque «solo TEST + solo sandbox».
