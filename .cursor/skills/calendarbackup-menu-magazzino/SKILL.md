---
name: calendarbackup-menu-magazzino
description: >-
  Entry point for the Menu/inventory tab (magazzino, MenuPricesTab) in
  CalendarBackup-v2: the single source of truth for categories, products,
  prices, dish photos, staff presets, QR manager and text promos that feed both
  Pagina Prenota and Menu QR. Use when working on the admin Menu tab.
---

# CalendarBackup — Tab Menu / magazzino (Cursor pointer)

Puntatore stabile per Cursor. **Non duplica** regole/LOCK: vivono nei file versionati del repo.

## Prima di toccare il codice
1. Leggi il **mini-pack** (~1 schermata): `docs/Admin-Skill/ADMIN_MENU_MAGAZZINO_MINI.md`.
2. Poi il **context pieno** intero: `docs/Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md`.
3. Flusso resolver Prenota: `docs/Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md`. Schema/migrazioni:
   `docs/Database-Skill/DB_SKILL.md`.

Routing ufficiale e profili: `docs/APP_CONTEXT_SKILL.md` §0 + §0.0b.
