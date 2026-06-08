# calendarbackup-admin

Usa questa skill per Admin autenticata, dashboard ristoratore, sidebar, CRM, prenotazioni admin,
impostazioni, shell, Classic/Pro ed edition.

Fonti da leggere quando il test lo richiede:

1. `docs/Admin-Skill/ADMIN_SKILL.md`
2. `docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md` per blindatura/test/mappatura.
3. `docs/ADMIN_CLASSIC_SKILL.md` per admin classica, calendario, settings o orari.
4. `docs/Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md` per shell, sidebar, nav, CRM o routing admin.
5. `docs/DATA_FLOW_SKILL.md` per edition, tenant, feature flag, login o auth.

Regole:

- Non rompere Classic aggiungendo feature Pro.
- Non cambiare feature flag o edition gating senza verifica senior.
- Per fix UI admin, considera anche `UI_EDIT_SKILL`.
- Per responsive, considera anche `UI_RESPONSIVE_SKILL`.
