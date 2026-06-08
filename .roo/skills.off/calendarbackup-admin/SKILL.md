---
name: calendarbackup-admin
description: Usa questa skill per Admin autenticata, dashboard ristoratore, sidebar, CRM, prenotazioni admin, impostazioni, shell, Classic/Pro ed edition.
---

# CalendarBackup Admin

Questa skill instrada i task sull'area admin. Non sostituisce le skill admin della repo.

## Quando usarla

Usala per task su:

- area `/admin`;
- sidebar e navigazione;
- CRM;
- prenotazioni admin;
- impostazioni ristorante;
- shell admin;
- Classic/Pro;
- edition, feature flag o sezioni abilitate.

## Fonti da leggere

1. `docs/Admin-Skill/ADMIN_SKILL.md`
2. `docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md` se il task riguarda blindatura, mappatura o test admin.
3. `docs/ADMIN_CLASSIC_SKILL.md` se tocchi admin classica, calendario, prenotazioni storiche, settings o orari.
4. `docs/Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md` se tocchi shell, sidebar, nav, CRM o routing admin.
5. `docs/DATA_FLOW_SKILL.md` se tocchi edition, tenant, feature flag, login o auth.

## Regole

- Non rompere Classic aggiungendo feature Pro.
- Non cambiare feature flag o edition gating senza verifica senior.
- Non toccare flussi DB/Auth senza skill DB e DATA_FLOW.
- Per fix UI admin, carica anche `docs/per-ui-design-skill/UI_EDIT_SKILL.md`.
- Per responsive, carica anche `docs/per-ui-design-skill/UI_RESPONSIVE_SKILL.md`.

## Output minimo

- Schermata admin coinvolta.
- Skill lette.
- File letti.
- Rischi Classic/Pro.
- Rischi feature flag o tenant.
- Test previsti.
