---
name: calendarbackup-marketing
description: >-
  Entry point for the commercial model of CalendarBackup-v2: editions
  (Classic/Pro/Enterprise), add-ons, tenant_features, the "activate feature X for
  customer" procedure, pricing and roadmap. Use when the task touches edition,
  pricing, add-on, sale, package, feature_key, bundle, or tenant_features.
---

# CalendarBackup — Marketing / edition (Cursor pointer)

Puntatore stabile per Cursor. **Non duplica** regole/LOCK: vivono nei file versionati del repo.

## Prima di toccare il codice
1. Leggi il **mini-pack** (~1 schermata): `docs/Marketing-Skill/MARKETING_MINI.md`.
2. Poi `docs/Marketing-Skill/MARKETING_SKILL.md` intero + `docs/DATA_FLOW_SKILL.md` per il flusso
   tecnico edition → feature flag.
3. **Fonte di verità add-on = `tenant_features`** (non `qr_menu_enabled`). Attivazioni reali girano
   su PROD: `get_project_url` + conferma prima di scrivere.

Routing ufficiale e profili: `docs/APP_CONTEXT_SKILL.md` §0 + §0.0b.
