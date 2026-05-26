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
4. Task su **layout tab Calendario** (celle mese, titolo responsive, padding, Oggi+data): leggere anche `docs/per-ui-design-skill/BOOKING_CALENDAR_LAYOUT_CONTEXT.md` (oltre a `ADMIN_CLASSIC_SKILL.md` §4c).

## Cosa non duplicare qui

Regole, tabelle LOCK, comandi e report di sessione stanno solo nei due file sopra: aggiornare quelli quando cambiano architettura o invarianti; questa skill resta un puntatore stabile per Cursor.

**Ultimo refactor promo menù (23-05-26):** chiave `booking_menu_promos`, niente omaggio automatico in `MenuSelection` — report `docs/Sessioni di lavoro/23-05-26/Report-refactor-promo-menu-rimozione-vol-au-vent.md`, invariante in `docs/APP_CONTEXT_SKILL.md` §4 RULE Menu Prenota.

**Menu QR homepage layout (24-05-26):** `themePageBackgroundStyle`, tab sticky opaca, carosello pallini click, limiti admin 60/125 — report `docs/Sessioni di lavoro/24-05-26/Report-menu-qr-homepage-layout-sessione.md`, skill `PUBLIC_MENU_SKILL.md` + `PUBLIC_MENU_LAYOUT_CONTEXT.md`.

**Prenota v2 sottotab orizzontali (25-05-26):** `BookingMode.sub_tabs[]` (preset/manuale), `BookingSubTabCards`, editor in `BookingFormConfigPanel` — report `docs/Sessioni di lavoro/25-05-26/Report-sottotab-orizzontali-prenota-v2.md`, RULE in `docs/APP_CONTEXT_SKILL.md` §4.

**Impostazioni salvataggio condiviso (26-05-26):** `SettingsSaveUi.tsx`, Salva sottotab → DB via `commitSubTabEditor` — report `docs/Sessioni di lavoro/26-05-26/Report-settings-save-ui-sottotab-26-05-26.md`, RULE Personalizza form in `docs/APP_CONTEXT_SKILL.md` §4.

**Personalizza form carosello + help (26-05-26):** `CarouselAddPhotoBlock`, `SubTabsDisplayHelpPanel`, `SubTabAddButtons`; sottotab carousel in Prenota **senza** griglia menù — report `docs/Sessioni di lavoro/26-05-26/Report-personalizza-form-carosello-help-26-05-26.md`, `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md`, RULE Pagina Prenota v2 in `APP_CONTEXT_SKILL.md` §4.

**Prenota carosello overlay campi (26-05-26):** `BookingSubTabCarousel` usa `subTab.label` / `description` / `price_per_person` + `carousel_items[0].title` — report `docs/Sessioni di lavoro/26-05-26/Report-prenota-carosello-overlay-campi-26-05-26.md`, sezione overlay in `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md`.
