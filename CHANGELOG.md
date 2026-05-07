# Changelog

## v2.1.0 — Maggio 2026

Infrastruttura per consegna a sviluppatore esterno.

- Documentazione completa (`README.md`, `ONBOARDING.md`, `docs/`, `CONTRIBUTING.md`, `CLAUDE.md`)
- Logger custom in `src/lib/logger.ts` (sostituzione console.log dev-only)
- Test setup completo: 29 test Vitest + 5 spec Playwright e2e
- CI GitHub Actions (lint + typecheck + test) su push/PR a `main`
- Husky + lint-staged come pre-commit hook
- Pulizia root: cartelle locali (`Lavoro/`, `Immagini-sfondo/`, `icone-nuove/`) spostate fuori repo

## v2.0.0 — Aprile 2026

Riscrittura completa a partire dal progetto originale `CalendarBackup/`.

Per il report dettagliato di tutte le modifiche, ottimizzazioni e differenze rispetto alla v1 vedi [docs/CHANGELOG_v2.md](docs/CHANGELOG_v2.md).

**Principali novità:**
- Schema DB multi-tenant consolidato in un'unica migrazione
- Nuovo tema UI Blu/Indaco (sostituisce il "warm wood" marrone)
- Route `/invite/:token` per registrazione admin via link
- Client Supabase separato per operazioni autenticate vs. anonime
- PWA con Workbox (installabile su mobile)
- RLS basata su JWT + `current_admin_tenant_id()` (pooler-safe)
