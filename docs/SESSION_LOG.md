---
name: session-log
description: >-
  Indice cronologico dei report di sessione di CalendarBackup-v2.
  Non contiene dettagli tecnici — ogni riga punta al report completo.
---

# Session Log — Cronologia sessioni

## 2026-05

| Data | Sessione | Report |
|------|----------|--------|
| 24-05-26 | Revisione skill system (Plan 2) | [Report](Sessioni%20di%20lavoro/24-05-26/Report-skill-system-revisione.md) — nuove skill `DATA_FLOW_SKILL.md` + `Marketing-Skill/`, LOCK TenantContext consolidato, RULE Linguaggio utente, snapshot sessione spostati in `SESSION_LOG.md`. |
| 24-05-26 | Sistema `tenant_features` scalabile (Plan 1) | [Report](Sessioni%20di%20lavoro/24-05-26/Report-tenant-features-system.md) — tabella `tenant_features`, RPC `get_tenant_features`, `check_admin_email` esteso, `featureOverrides` in `TenantContext`. Migrazione `031` applicata su test. |
| 24-05-26 | Menu QR pubblico (Fase 1) | [Report](Sessioni%20di%20lavoro/24-05-26/Report-menu-qr-pubblico-fase-1.md) — tabella `menu_qr_codes`, bucket `menu-photos`, foto piatti, 3 pagine pubbliche mobile-first, flag `qrMenu`, admin QR manager. Migrazione `030` applicata su test. |
| 23-05-26 | Refactor promo menu + rimozione vol-au-vent | [Report promo](Sessioni%20di%20lavoro/23-05-26/Report-refactor-promo-menu-rimozione-vol-au-vent.md) + [Report label](Sessioni%20di%20lavoro/23-05-26/Report-promo-menu-label-prenotazione.md) — rename `booking_menu_promos`, rimozione omaggio automatico, migrazione `029` applicata su test. |
| 23-05-26 | Layout BookingCalendar + cleanup repo | [ADMIN_CLASSIC_SKILL §4](ADMIN_CLASSIC_SKILL.md) — celle mese 128/112px, tab full-width, titolo responsive. Pulizia massiva `docs/`. |
| 22-05-26 | Check disponibilità fascia pubblica (A5) | [Report A5](Sessioni%20di%20lavoro/22-05-26/Report-A5-check-disponibilita-fascia-pubblica.md) — guard server-side `check-slot-availability` EF + hook client. |
| 19-05-26 | Pallino assegnazione tavolo da Calendario | [Report](Sessioni%20di%20lavoro/19-05-26/Report-pallino-assegnazione-tavolo.md) — `QuickTableAssignModal`, `useReleaseBookingAssignment`. |
| 15-05-26 | Unificazione fasce orarie canoniche | [Report](Sessioni%20di%20lavoro/15-05-26/Revisionate%20da%20claude/Report-unificazione-fasce-orarie-canoniche.md) — `useCanonicalTimeSlots`, migrazione 016. |

## 2026-04 e precedenti

Vedi cartella `docs/Sessioni di lavoro/` — i report più vecchi potrebbero non essere versionati.
