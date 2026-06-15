---
name: calendarbackup-testing
description: >-
  Entry point for testing in CalendarBackup-v2: Vitest unit/component, Playwright
  E2E on staging Supabase, manual QA protocol, blindatura. Use when the task is
  about tests, CI, staging, coverage, or when reviewing/verifying someone's work
  (profilo Verifica).
---

# CalendarBackup — Testing (Cursor pointer)

Puntatore stabile per Cursor. **Non duplica** regole/LOCK: vivono nei file versionati del repo.

## Prima di toccare il codice
1. Leggi il **mini-pack** (~1 schermata): `docs/Testing-Skill/TESTING_MINI.md`.
2. Poi `docs/Testing-Skill/TESTING_SKILL.md` intero (incl. **§7 QA manuale**) + `MANUALE_BLINDATURA.md`
   se blindi una sezione.
3. **Nessun test tocca PROD** (`rwuxgvld`): Vitest mock+MSW, Playwright solo staging `docnnernvp`.
   Profilo Verifica → `npm run validate` + QA su 375/834/1280 + tabella esiti.

Routing ufficiale e profili: `docs/APP_CONTEXT_SKILL.md` §0 + §0.0b.
