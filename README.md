# CalendarBackup-v2

SaaS multi-tenant per la gestione delle prenotazioni di ristoranti. Un ristorante (tenant) ottiene una pagina pubblica di prenotazione e una dashboard admin privata.

## Stack

| Layer | Tecnologia |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| Stile | TailwindCSS v4 |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth |
| Query | TanStack React Query v5 |
| Routing | React Router v7 |
| Calendario | FullCalendar v6 |
| Deploy | Vercel (SPA) + Supabase Edge Functions (Deno) |
| PWA | vite-plugin-pwa + Workbox |

## Prerequisiti

- Node.js 20+
- npm 10+
- Supabase CLI (`npm i -g supabase`)
- Account Supabase (gratuito)
- Account Vercel (gratuito)

## Setup rapido

```bash
# 1. Installa dipendenze
npm install

# 2. Crea variabili ambiente
cp .env.example .env.local
# Modifica .env.local con le credenziali Supabase

# 3. Collega Supabase e applica migrazioni
supabase link
supabase db push

# 4. Avvia in locale
npm run dev
# → http://localhost:5173
```

Per la guida completa vedi [docs/SETUP.md](docs/SETUP.md).

## Comandi npm

| Comando | Descrizione |
|---------|-------------|
| `npm run dev` | Server di sviluppo |
| `npm run build` | Build di produzione |
| `npm run preview` | Anteprima della build |
| `npm run lint` | Controllo ESLint |
| `npm run lint:fix` | Fix automatico ESLint |
| `db:types:linked` | Rigenera tipi TypeScript dal DB remoto |
| `seed:booking-menu-full` | Popola DB con prenotazione con menu |
| `seed:booking-table` | Popola DB con prenotazione tavolo |

## Documentazione

- [ONBOARDING.md](ONBOARDING.md) — Guida completa all'esplorazione del progetto (**inizia qui**)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — Architettura, layer, pattern
- [docs/DATABASE.md](docs/DATABASE.md) — Schema DB, RLS, funzioni, migrazioni
- [docs/EDGE_FUNCTIONS.md](docs/EDGE_FUNCTIONS.md) — Edge Functions Supabase
- [docs/SETUP.md](docs/SETUP.md) — Setup ambiente locale e produzione
- [docs/TESTING.md](docs/TESTING.md) — Stack di test e come contribuire test
- [docs/MANUAL_TEST_PLAN.md](docs/MANUAL_TEST_PLAN.md) — Checklist smoke test manuale
- [CONTRIBUTING.md](CONTRIBUTING.md) — Come contribuire al progetto
- [CHANGELOG.md](CHANGELOG.md) — Storico versioni
