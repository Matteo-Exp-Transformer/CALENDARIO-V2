# Comandi terminale — CalendarBackup dev

## Configurazione (dopo allineamento repo)

| File | Supabase | Usato da |
|------|----------|----------|
| `.env.local` | **TEST** (`docnnernvp`) | `npm run dev`, `npm run seed:*` |
| `.env.production.local` | **PROD** (`rwuxgvld`) | `npm run dev:prod` |
| `.env.local.test` | TEST + credenziali E2E | `npm run test:e2e` |

- Un file = un ambiente (non mescolare test e prod nello stesso file).
- Template prod: copia `.env.production.local.example` → `.env.production.local`.
- Dopo ogni modifica ai `.env*`: **Ctrl+C** e riavvia il server.

**Setup una tantum:** metti le chiavi **TEST** in `.env.local` (puoi copiarle da `.env.local.test`). Crea `.env.production.local` con le chiavi prod (da ex `.env.local` prod o dall’example).

## Comandi

```powershell
# Sviluppo normale → DB test
npm run dev

# Solo quando serve verificare su dati produzione
npm run dev:prod

# Test automatici browser (usa .env.local.test)
npm run test:e2e

# Lint + typecheck + unit test (nessun DB reale)
npm run validate
```

App: http://localhost:5173 — login admin: `/login`.

**Login QA manuale (DB test):** `test-pro@p.com` — password in `.env.local.test` (`MANUAL_ADMIN_*` / `E2E_ADMIN_*`). Stesso file per `npm run test:e2e`.

**Controllo rapido:** DevTools → Network → host Supabase = `docnnernvpyrbwuzzach` (test) o `rwuxgvldzrkabglkasym` (prod).

## Attenzione

- `npm run seed:*` legge sempre `.env.local` → resta sul **test** se `.env.local` è test.
- SQL e migrazioni MCP: progetto **TEST** `docnnernvp` salvo sessione esplicita su prod.
