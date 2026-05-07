# CLAUDE.md — Guida per sessioni AI

Questo file orienta le sessioni Claude Code su questo progetto.

## File critici

| File | Perché è importante |
|------|-------------------|
| `src/router.tsx` | Tutte le route dell'app |
| `src/contexts/TenantContext.tsx` | Cuore del multi-tenancy: risolve `tenantId` da slug o email |
| `src/lib/supabase.ts` | Client autenticato (admin) — persistSession: true, PKCE |
| `src/lib/supabasePublic.ts` | Client anonimo (form pubblici) — persistSession: false |
| `src/features/booking/hooks/useAdminAuth.ts` | Login, session check, subscription check |
| `supabase/migrations/` | Schema DB — le migrazioni già applicate NON vanno toccate |
| `supabase/functions/create-booking/index.ts` | Edge Function per prenotazioni pubbliche |
| `supabase/functions/validate-invite/index.ts` | Edge Function per registrazione admin |
| `src/types/database.ts` | Tipi generati dal DB — rigenera con `npm run db:types:linked` |
| `src/lib/email.ts` | Chiama Edge Function `send-email` che non esiste ancora |
| `vitest.config.ts` | Config Vitest (jsdom, globals, env Supabase fake, exclude e2e) |
| `playwright.config.ts` | Config Playwright (chromium, webServer, baseURL) |
| `tests/setup.ts` | MSW server + jest-dom + cleanup automatico |
| `.husky/pre-commit` | Esegue lint-staged sui file staged |
| `.github/workflows/ci.yml` | CI: lint + typecheck + test su push/PR a main |

## Comandi principali

```bash
npm run dev                  # dev server su :5173
npm run build                # TypeScript check + Vite build
npm run lint                 # ESLint, zero warning tollerati
npm run lint:fix             # Fix automatico ESLint
npm run typecheck            # tsc --noEmit
npm run test                 # 29 test Vitest (run mode)
npm run test:watch           # Vitest in watch mode
npm run test:e2e             # Playwright e2e (richiede staging Supabase)
npm run validate             # lint + typecheck + test (pre-PR)
npm run db:types:linked      # Rigenera src/types/database.ts dal DB remoto
npm run seed:booking-menu-full   # Popola DB con prenotazione con menu
npm run seed:booking-table       # Popola DB con prenotazione tavolo
supabase db push             # Applica nuove migrazioni al DB remoto
supabase migration list --linked # Verifica stato migrazioni
```

## Convenzioni

- **Conventional Commits**: `feat(scope):`, `fix(scope):`, `update(scope):` ecc.
- **Import alias**: `@/` punta a `src/` (configurato in `vite.config.ts` e `tsconfig.json`)
- **Logger**: `src/lib/logger.ts` — usare `logger.debug/info/warn/error` invece di `console.log`
- **Due client Supabase**: usare `supabasePublic` per operazioni anonime, `supabase` (autenticato) per le operazioni admin
- **TanStack Query**: tutte le query server-state vanno nei hook in `src/features/booking/hooks/`
- **Nessun commento banale**: i commenti spiegano il PERCHÉ, non il COSA

## Zone delicate

- **`TenantContext`**: il `tenantId` viene risolto o dallo slug URL (pagina pubblica) o dall'email dell'admin loggato. Qualsiasi hook che accede ai dati del tenant dipende da questo context.
- **Due client Supabase**: `supabase` mantiene la sessione in localStorage (admin), `supabasePublic` non la mantiene mai (form pubblici). Non mischiare gli usi.
- **Migrazioni 003_\***: esistono due migrazioni con prefisso `003_` (entrambe già applicate al remoto). Non rinominarle — documentato in `docs/DATABASE.md`.
- **send-email mancante**: `src/lib/email.ts` chiama `${SUPABASE_URL}/functions/v1/send-email` che non esiste. I flussi email falliscono silenziosamente in produzione.

## Struttura cartelle src/

```
src/
├── components/         # Componenti UI condivisi
│   └── ui/            # Button, Input, Modal, ecc.
├── contexts/          # TenantContext
├── features/
│   └── booking/
│       ├── components/ # Componenti specifici della dashboard
│       ├── constants/  # Valori fissi (capacity, preset menu)
│       ├── hooks/      # useAdminAuth, useBookingMutations, ecc.
│       ├── lib/        # restaurantSettingRegistry
│       └── utils/      # Helper puri (date, prezzi, trasformazioni)
├── hooks/             # Hook globali (useBusinessHours, useRateLimit)
├── lib/               # Utility (supabase, email, logger, ecc.)
├── pages/             # Una pagina per route
├── router.tsx         # Definizione routing
└── types/             # TypeScript types (database.ts generato, booking.ts, menu.ts)
```

## Variabili d'ambiente

Vedi `.env.example`. Le variabili con prefisso `VITE_` sono esposte al browser.
Le variabili senza prefisso (es. `SUPABASE_SERVICE_ROLE_KEY`) sono solo per script Node locali.
