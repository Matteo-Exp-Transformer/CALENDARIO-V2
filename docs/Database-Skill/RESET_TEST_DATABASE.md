# Reset database TEST (solo dati)

Manovra per ripartire con staging vuoto: **nessun tenant, nessun utente auth, nessuna prenotazione**, mantenendo schema, RLS, funzioni e migrazioni.

## Salvaguardia ambiente

| Progetto | Ref URL | Azione |
|----------|---------|--------|
| **TEST** | `docnnernvp` → `https://docnnernvpyrbwuzzach.supabase.co` | OK |
| **PROD** | `rwuxgvld` | **STOP** — non eseguire |

Prima di ogni DELETE: MCP `get_project_url` sul server **`user-supabase-test`**. Se l’URL non contiene `docnnernvp`, fermarsi.

## Script

File canonico in git: `supabase/scripts/reset_test_database.sql` (copia locale: [`scripts/reset_test_database.sql`](scripts/reset_test_database.sql))

Ordine logico:

1. `booking_table_assignments`, `email_logs`, `booking_requests` (FK RESTRICT su org)
2. `rate_limits`, `ip_blacklist`
3. `organizations` (CASCADE su menu, settings, CRM, QR, fasce, ecc.)
4. Tabelle `auth.*` poi `auth.users`

## Cosa non viene pulito

- **Storage** `menu-photos`: le URL in DB spariscono con il reset, i file nel bucket possono restare. Pulizia manuale da Storage se serve spazio.
- **Edge secrets / migrazioni**: invariati.

## Dopo il reset

Per **test E2E / Vitest edition** serve di nuovo il seed minimo: `tests/README.md` sezione «Ricreare i tenant di test».

Per test manuali da zero: signup nuovo ristorante dall’app come in produzione.

## Esecuzione da agente

1. Commit dello script in repo (punto di ripristino documentato).
2. `get_project_url` → TEST.
3. `execute_sql` con il contenuto del file (blocco `BEGIN`…`COMMIT` + query verifica).
