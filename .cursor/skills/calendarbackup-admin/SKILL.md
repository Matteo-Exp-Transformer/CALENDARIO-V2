---
name: calendarbackup-admin
description: >-
  Entry point for the authenticated Admin area (/admin) in CalendarBackup-v2:
  AdminShell, sidebar, Classic vs Pro, dashboard tabs (Calendario, Prenotazioni,
  Archivio, Menu, Impostazioni), Servizio, CRM, Analytics, feature flags. Use
  when working anywhere under /admin.
---

# CalendarBackup — Admin (Cursor pointer)

Puntatore stabile per Cursor. **Non duplica** regole/LOCK: vivono nei file versionati del repo.

## Prima di toccare il codice
1. Leggi il **mini-pack** (ingresso rapido, ~1 schermata): `docs/Admin-Skill/ADMIN_MINI.md`.
2. Poi la **skill piena** intera: `docs/Admin-Skill/ADMIN_SKILL.md` (+ `ADMIN_SHELL_SKILL.md` per
   shell/nav) e **solo** il file di `contesto/` che ti serve (mappa nel mini-pack §4).
3. **LOCK OBBLIGATORIO** prima di modificare tab Calendario/Prenotazioni/Settings,
   `useBookingMutations`, `BookingCalendar`, `AdminBookingForm`: `docs/ADMIN_CLASSIC_SKILL.md`.
4. Azioni pericolose (delete/restore/rename): `ADMIN_SKILL.md` §7-bis.

Routing ufficiale e profili (Esecuzione/Verifica/Meta): `docs/APP_CONTEXT_SKILL.md` §0 + §0.0b.
