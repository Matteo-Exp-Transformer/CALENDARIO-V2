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
   - `.claude/CLAUDE.md` — file critici, comandi (`npm run validate`, ecc.), zone delicate, struttura `src/`.

2. Dalla sezione 0 di `docs/APP_CONTEXT_SKILL.md`, caricare **subito dopo** lo skill/documento d’area indicato (vedi la **Mappa aree → file d'area** sotto) **prima** di aprire file da modificare.
3. Task su **layout tab Calendario** (celle mese, titolo responsive, padding, Oggi+data): leggere anche `docs/per-ui-design-skill/BOOKING_CALENDAR_LAYOUT_CONTEXT.md` (oltre a `ADMIN_CLASSIC_SKILL.md` §4c).

## Cosa non duplicare qui

Regole, tabelle LOCK, comandi, valori e cronologie di sessione stanno solo nei due file sopra e nei file d'area: aggiornare quelli quando cambiano architettura o invarianti; questa skill resta un **puntatore stabile** per Cursor. Niente changelog qui — i report di sessione vivono in `docs/Sessioni di lavoro/`.

## Mappa aree → file d'area

Ogni area dell'app ha una cartella `docs/<Area>-Skill/` con un file d'ingresso (senso + flusso + divieti + mappa) e una sottocartella `contesto/` per il dettaglio. Apri l'ingresso dell'area **prima** dei file da modificare; il routing ufficiale e completo è in `docs/APP_CONTEXT_SKILL.md` § 0.

| Area | Ingresso |
|------|----------|
| **Pagina Prenota** (pubblica) | `docs/Prenota-Skill/PRENOTA_SKILL.md` → `contesto/*` |
| **Menu QR** (pubblico) | `docs/Menu-QR-Skill/MENU_QR_SKILL.md` → `contesto/*` |
| **Tab Menu admin** (magazzino) | `docs/Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` |
| **Admin shell + pagine** | `docs/Admin-Skill/ADMIN_SHELL_SKILL.md` |
| **Database** | `docs/Database-Skill/DB_SKILL.md` |
| **PWA** | `docs/PWA_CONTEXT.md` |

> Le aree mappate col pattern senso/contesto (Prenota, Menu QR) hanno gli stub vecchi in `per-ui-design-skill/` ridotti a rimandi. Lo stato della mappatura è in `docs/Comunicazione-Skill/PROSEGUIMENTO_MAPPATURA_SKILL.md`.

**Follow-up post-sessione:** debiti e controlli differiti → [`docs/FOLLOW_UP.md`](../../docs/FOLLOW_UP.md). Fallback prod trasversale → §4c; milestone agenti tier avanzato → §4d (entrambe in `docs/APP_CONTEXT_SKILL.md`). Agente prepara-prompt: follow-up in `docs/PREPARA_PROMPT_SKILL.md`.

**Profilo Verifica (revisione lavoro altrui):** leggere `docs/Testing-Skill/TESTING_SKILL.md` **§7** — dopo `npm run validate`, QA manuale su **mobile 375×812, tablet 834×1194, desktop 1280×800** (stessi casi per ogni viewport); credenziali in `.env.local.test`; tabella esiti nel report. Non dichiarare «verificato» con una sola larghezza.
