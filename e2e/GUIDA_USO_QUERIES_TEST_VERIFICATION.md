# Query SQL — Verifica test automatici esistenti

Queste query confermano nel DB staging che i test automatici
(Vitest + Playwright) stanno davvero testando lo stato corretto.
Eseguile su Supabase Studio puntando al progetto **staging**
(`docnnernvpyrbwuzzach`).

Tenant di test:
- Pro: `11111111-1111-1111-1111-111111111111`
- Classic: `22222222-2222-2222-2222-222222222222`

---

## 1. Tenant di test esistono e hanno l'edition giusta

```sql
SELECT id, name, slug, edition, is_active
FROM organizations
WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222'
);
```

Atteso: 2 righe — una `edition = 'pro'`, una `edition = 'classic'`.

---

## 2. Admin di test esistono (useAdminAuth, login E2E)

```sql
SELECT email, name, tenant_id
FROM admin_users
WHERE tenant_id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222'
);
```

Atteso: almeno `admin-pro@test.local` e `admin-classic@test.local`.

---

## 3. CRM Pro — 3 clienti presenti (pro-crm.spec.ts)

```sql
SELECT id, name, email, source, created_at
FROM customers
WHERE tenant_id = '11111111-1111-1111-1111-111111111111'
ORDER BY created_at DESC;
```

Atteso: almeno 3 righe. Se ne mancano, il test `pro-crm.spec.ts` fallirà.

---

## 4. Prenotazioni Classic — 3 presenti (edition-classic.spec.ts)

```sql
SELECT id, client_name, desired_date, status, booking_source
FROM booking_requests
WHERE tenant_id = '22222222-2222-2222-2222-222222222222'
ORDER BY created_at DESC;
```

Atteso: almeno 3 righe (2 `pending`, 1 `accepted`).

---

## 5. Fix B01 — clienti salvati da prenotazione pubblica (createBookingCustomerUpsert)

Dopo aver eseguito una prenotazione dal form pubblico in staging:

```sql
-- Prima: conta clienti con source='synced'
SELECT count(*) AS clienti_da_form_pubblico
FROM customers
WHERE tenant_id = '11111111-1111-1111-1111-111111111111'
  AND source = 'synced';

-- Poi: verifica che non ci siano duplicati per la stessa email
SELECT email, count(*) AS occorrenze
FROM customers
WHERE tenant_id = '11111111-1111-1111-1111-111111111111'
GROUP BY email
HAVING count(*) > 1;
```

Atteso: seconda query → 0 righe (nessun duplicato).

---

## 6. RLS Classic — customers non accessibili (edition-classic-data-protection.spec.ts)

Verifica che il tenant Classic non abbia clienti nel CRM
(se ne avesse, il test di protezione RLS potrebbe dare falsi positivi):

```sql
SELECT count(*) AS clienti_classic
FROM customers
WHERE tenant_id = '22222222-2222-2222-2222-222222222222';
```

Atteso: `0` — il tenant Classic non dovrebbe avere clienti nel staging.

---

## 7. Soft-delete — prenotazioni cancellate conservate (admin-classic-tabs.spec.ts)

```sql
SELECT id, client_name, status, cancellation_reason, cancelled_at
FROM booking_requests
WHERE tenant_id = '22222222-2222-2222-2222-222222222222'
  AND status = 'deleted'
ORDER BY cancelled_at DESC;
```

Atteso: almeno 1 riga se il test di cancellazione è già stato eseguito.

---

## 8. Utilizzo annuale non azzerato (limiti piano)

```sql
SELECT o.name, tu.year, tu.booking_requests_count, tu.bookings_count
FROM tenant_usage tu
JOIN organizations o ON o.id = tu.organization_id
WHERE tu.organization_id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222'
)
ORDER BY tu.year DESC;
```

Utile per capire se i test E2E stanno consumando il contatore annuale del tenant staging.

---

## 9. Rate limits — verifica che non blocchino i test

```sql
SELECT ip_address, endpoint, count(*) AS richieste, max(requested_at) AS ultima
FROM rate_limits
WHERE endpoint = 'create-booking'
  AND requested_at >= now() - interval '10 minutes'
GROUP BY ip_address, endpoint
ORDER BY richieste DESC;
```

Se un'IP supera 5 richieste nell'ultimo minuto, le chiamate successive vengono bloccate.
Utile se un test E2E fallisce con 429.

Per pulire i rate limits staging in caso di blocco:

```sql
DELETE FROM rate_limits
WHERE requested_at < now() - interval '5 minutes';
```
