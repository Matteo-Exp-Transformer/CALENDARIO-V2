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

**Impostazioni salvataggio condiviso (29-05-26):** footer compatto destra, autosave toggle, guard modale — report `docs/Sessioni di lavoro/29-05-26/Report-ciclo-salvataggio-admin-29-05-26.md`, RULE in `APP_CONTEXT_SKILL.md` §4.

**Personalizza form carosello + help (26-05-26):** `CarouselAddPhotoBlock`, `SubTabsDisplayHelpPanel`, `SubTabAddButtons`; sottotab carousel in Prenota **senza** griglia menù — report `docs/Sessioni di lavoro/26-05-26/Report-personalizza-form-carosello-help-26-05-26.md`, `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md`, RULE Pagina Prenota v2 in `APP_CONTEXT_SKILL.md` §4.

**Prenota carosello overlay campi (26-05-26):** report `Report-prenota-carosello-overlay-campi-26-05-26.md` (sostituito dal modello per-slide).

**Carosello editor per slide (26-05-26):** `BookingFormCarouselEditor` foto-first; `carousel_items[].eyebrow/title/description/icon`; nessun prezzo — report `docs/Sessioni di lavoro/26-05-26/Report-carosello-editor-per-slide-26-05-26.md`.

**Personalizza form: etichetta card sottotab (26-05-26):** import menù solo su Card scorrevole; titolo Prenota = `sub_tabs[].label`; `applyLegacySubTabLabelOverrides`; `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md` + RULE §4 Personalizza form / Prenota v2.

**Card scorrevole titolo admin (29-05-26):** no prefill label; placeholder «Nome card scorrevole»; clear label su Compila manualmente; riga lista `Titolo · Card N` — report `docs/Sessioni di lavoro/29-05-26/Report-card-scorrevole-titolo-admin-29-05-26.md`.

**Promo in Personalizza form (29-05-26):** editor promo spostato da Tab Menu a sezione **Messaggio Promozionale**; modello `MenuPromo.placement` + array `booking_types` / `sub_tab_refs` (multi-target); banner singolo Prenota + snapshot multi-promo — report `docs/Sessioni di lavoro/29-05-26/Report-promo-personalizza-form-29-05-26.md`, correzione multi-target `Report-promo-multi-target-29-05-26.md`, `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md` § Salvataggio admin.

**Carosello toggle riepilogo offerta (28-05-26):** `sub_tabs[].show_offer_details_in_summary` (default ON); switch in editor carosello `BookingFormConfigPanel`; `BookingSummarySidebar` condiziona «Offerta selezionata» — report `docs/Sessioni di lavoro/28-05-26/Report-carosello-riepilogo-toggle-offerta-28-05-26.md`, `BOOKING_DATA_FLOW_SKILL.md` §5, `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md`.

**Skill snellito — file di contesto per zona (29-05-26):** i dettagli della §4 di `APP_CONTEXT_SKILL.md` sono stati estratti in file di contesto dedicati. **Pagina Prenota (04-06-26):** area in `docs/Prenota-Skill/` (`PRENOTA_SKILL.md` + `contesto/*`); i vecchi path `BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` / `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md` in `per-ui-design-skill/` sono solo stub di rimando. Tab Menu admin → `MENU_ADMIN_CONTEXT.md`; PWA → `PWA_CONTEXT.md`; Servizio → `ADMIN_PAGES_CONTEXT.md` § Servizio. Routing ufficiale: `APP_CONTEXT_SKILL.md` § 0.

**Follow-up post-sessione:** debiti e controlli differiti → [`docs/FOLLOW_UP.md`](../../docs/FOLLOW_UP.md) (es. FU-001 modal calendario promo). **Fallback prod (trasversale):** FU-023 — mappare tutti i fallback, togliere hardcoded di test → regola §4c in `docs/APP_CONTEXT_SKILL.md`. **Milestone lontana:** FU-024 — skill/entry point per agenti tier avanzato (Codex, Cursor intelligent, ecc.) → §4d, non implementare senza sessione Meta. Agente prepara-prompt: cerca follow-up in `docs/PREPARA_PROMPT_SKILL.md`.

**Profilo Verifica (revisione lavoro altrui):** leggere `docs/Testing-Skill/TESTING_SKILL.md` **§7** — dopo `npm run validate`, eseguire QA manuale su **mobile 375×812, tablet 834×1194, desktop 1280×800** (stessi casi funzionali per ogni viewport); credenziali in `.env.local.test`; documentare tabella esiti nel report sessione. Non dichiarare «verificato» con una sola larghezza schermo.
