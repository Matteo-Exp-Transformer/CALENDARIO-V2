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
| 25-05-26 | Pagina Prenota v2 + Admin «Personalizza Form» | [Report](Sessioni%20di%20lavoro/25-05-26/Report-pagina-prenota-v2-admin-personalizza-form.md) — card tipologia al posto del select, layout 2 colonne + sidebar riepilogo, titolo/descrizione dinamici, pannello admin configurazione form. |
| 25-05-26 | Filtri ingredienti Menu QR + UI modale + fix prod | [Report](Sessioni%20di%20lavoro/25-05-26/Report-menu-qr-filtri-e-ui-modale.md) — `036`/`037` su TEST+prod, picker nascosti, tipografia, rimozione «Menù eventi» dal modale, fix salvataggio carosello vuoto in produzione. |
| 25-05-26 | Modale Menù QR unificato + aspetto per-QR | [Report](Sessioni%20di%20lavoro/25-05-26/Report-menu-qr-modale-unificato-per-qr.md) — migrazione `036` su test, tema/carosello/foto/override su `menu_qr_codes`, modale unico con doppio Salva, `category_filter` esplicito. |
| 25-05-26 | Foto categoria admin Prenota | [Report](Sessioni%20di%20lavoro/25-05-26/Report-foto-categoria-menu-prenota.md) — `menu_categories.image_url`, upload `booking-cat/{id}.webp`, form in Gestione categorie; foto QR homepage invariata. Migrazione `035` su test. |
| 25-05-26 | Centralizzazione grouping menu + fix contatore | [Report](Sessioni%20di%20lavoro/25-05-26/Report-refactor-menu-grouping-centralizzazione.md) — utility `menuCatalogGrouping.ts`, subtitle da `0/N` a `N ingredienti` in Prenota e builder preset, dead code rimosso. |
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
