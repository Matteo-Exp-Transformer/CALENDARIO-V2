# CalendarBackup-v2

SaaS multi-tenant per prenotazioni ristorante: ogni ristorante (tenant) ottiene una pagina pubblica `/prenota/<slug>` per ricevere richieste, e una dashboard admin privata `/admin` per gestirle.

**Stack:** React 18 + Vite + TypeScript · TailwindCSS v4 · Supabase (Postgres + RLS + Edge Functions Deno) · TanStack Query v5 · React Router v7 · Vercel + PWA.

## Setup rapido

```bash
npm install
cp .env.example .env.local   # poi inserisci le credenziali Supabase
npm run dev                  # → http://localhost:5173
```

Guida completa con prerequisiti, link Supabase CLI, deploy e troubleshooting → [docs/SETUP.md](docs/SETUP.md).

### Fine riga (Git e editor)

Il repo è impostato con **LF** nelle revisioni. In radice trovi **`.gitattributes`** (tipi di file testuali con `eol=lf`, artefatti binari esclusi) e **`.editorconfig`** (UTF-8, fine riga LF, newline finale). Così si limitano diff fantasma solo per CRLF/LF. Su Windows, con `core.autocrlf=true` (tipico), la working copy può usare CRLF mentre gli **commit restano LF**; è il comportamento atteso di Git.

## Da dove iniziare

Per orientarti nel progetto leggi i file in quest'ordine. Ognuno ha uno scopo preciso:

| File | A cosa serve |
|------|------|
| [ONBOARDING.md](ONBOARDING.md) | **Inizia qui.** Guida narrativa 360°: cosa fa l'app, mappa del repo, pagina per pagina (quali file/hook fanno cosa), come l'app parla col DB, dove guardare se qualcosa non funziona, criticità note. |
| [docs/SETUP.md](docs/SETUP.md) | Setup ambiente locale e produzione: prerequisiti, variabili d'ambiente, Supabase CLI, deploy Vercel, troubleshooting. |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Architettura tecnica: layer, routing, state management (React Query), multi-tenancy via TenantContext, auth flow admin, perché ci sono due client Supabase. |
| [docs/DATABASE.md](docs/DATABASE.md) | Schema DB completo: tabelle, RLS, funzioni (`current_admin_tenant_id`, `check_admin_email`), trigger, indici, come applicare migrazioni e rigenerare i tipi TS. |
| [docs/EDGE_FUNCTIONS.md](docs/EDGE_FUNCTIONS.md) | Edge Functions Supabase: `create-booking` e `validate-invite` (input/output, logica), specifica della `send-email` mancante. |
| [docs/MANUAL_TEST_PLAN.md](docs/MANUAL_TEST_PLAN.md) | Checklist di smoke test manuale (~30 voci su 10 aree) da eseguire prima di ogni deploy. |
| [docs/TESTING.md](docs/TESTING.md) | Stack di test installato: Vitest (`npm run test` deve essere verde) + suite Playwright e2e + CI GitHub Actions + husky pre-commit. |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Convenzioni commit (Conventional Commits), branching, workflow PR, code review checklist. |
| [CLAUDE.md](CLAUDE.md) | Orientamento per sessioni AI future: file critici, comandi, convenzioni, zone delicate. |
| [CHANGELOG.md](CHANGELOG.md) | Storico versioni (v2.0.0 + link al report dettagliato in `docs/CHANGELOG_v2.md`). |

## Issue noti (non bloccanti)

- **Email non inviate:** la Edge Function `send-email` è referenziata in `src/lib/email.ts` ma non esiste. Le prenotazioni vengono salvate, ma il cliente non riceve email. Specifica in [docs/EDGE_FUNCTIONS.md](docs/EDGE_FUNCTIONS.md).
- **Doppio prefisso `003_*`** sulle migrazioni: entrambe già applicate al remoto, nessun impatto. Documentato in [docs/DATABASE.md](docs/DATABASE.md).
- **Disallineamento nomi migrazioni locale/remoto:** vedere sezione dedicata in [docs/DATABASE.md](docs/DATABASE.md) prima di eseguire `supabase db push`.

## Comandi principali

```bash
npm run dev                # dev server
npm run build              # typecheck + build produzione
npm run lint               # ESLint, zero warning tollerati
npm run typecheck          # tsc --noEmit
npm run test               # npm run test deve essere verde
npm run test:e2e           # test Playwright (richiede staging Supabase)
npm run validate           # lint + typecheck + test (pre-PR)
npm run db:types:linked    # rigenera src/types/database.ts dal DB remoto
```
