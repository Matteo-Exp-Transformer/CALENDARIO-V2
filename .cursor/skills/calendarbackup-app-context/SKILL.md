---
name: calendarbackup-app-context
description: >-
  Orients agents on CalendarBackup-v2 (React, Vite, TypeScript, Tailwind v4,
  Supabase, TanStack Query): routing admin, edition flags, LOCK files, dual
  Supabase clients, and which area-specific docs to load. Use at session start,
  when the task spans multiple areas, or for any work in this repository until
  context is established.
---

# CalendarBackup — contesto base (Cursor)

## Obbligo prima di toccare il codice

1. Leggere **per intero** (strumento Read) questi file nel repository, in quest’ordine:
   - `docs/APP_CONTEXT_SKILL.md` — Skill 0: tabella aree → skill, invarianti LOCK, routing admin, convenzioni fine sessione.
   - `docs/CLAUDE.md` — file critici, comandi (`npm run validate`, ecc.), zone delicate, struttura `src/`.

2. Quando `docs/APP_CONTEXT_SKILL.md` indica il “file master `CLAUDE.md`” per comandi e setup, usare **`docs/CLAUDE.md`** come riferimento in Cursor (contenuto allineato a `.claude/CLAUDE.md` dove presente).

3. Dalla sezione 0 di `docs/APP_CONTEXT_SKILL.md`, caricare **subito dopo** lo skill/documento d’area indicato (es. `docs/ADMIN_CLASSIC_SKILL.md`, `docs/Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md`, `docs/Database-Skill/DB_SKILL.md`, ecc.) **prima** di aprire file da modificare.

## Cosa non duplicare qui

Regole, tabelle LOCK, comandi e report di sessione stanno solo nei due file sopra: aggiornare quelli quando cambiano architettura o invarianti; questa skill resta un puntatore stabile per Cursor.
