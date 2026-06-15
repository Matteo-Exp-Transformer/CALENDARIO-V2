# ADMIN — Mini-pack d'area (ingresso rapido)

> **Cos'è.** Ingresso ~1 schermata per l'area **Admin autenticata** (`/admin`): shell + dashboard
> classica + link ai LOCK. **Non duplica** i LOCK: per il testo pieno apri `ADMIN_SKILL.md`,
> `ADMIN_SHELL_SKILL.md`, `ADMIN_CLASSIC_SKILL.md` e i file di `contesto/`.
> Design: `Sessioni di lavoro/12-06-26/Design-wp-e1-mini-pack-area-12-06-26.md`.

## 1. Trigger
«admin» · «dashboard» · «portale» · «area staff» · «prenotazioni admin» · «tab Menu» · «magazzino
menu» · «Servizio» · «CRM Clienti» · «Analytics» · «Impostazioni ristorante» · «sidebar admin» ·
«AdminShell» · «BookingCalendar» · «/admin».

## 2. Carica subito
- **`ADMIN_SKILL.md`** (skill d'area — leggila intera) — senso, attori, confini, mappa context.
- **`ADMIN_CLASSIC_SKILL.md`** ⚠️ **OBBLIGATORIO PRIMA DI MODIFICARE** tab Calendario / Prenotazioni /
  Settings, `AdminDashboard`, `BookingCalendar`, `AdminBookingForm`, `useBookingMutations`,
  `BookingDetailsModal`.
- `ADMIN_SHELL_SKILL.md` se tocchi shell/sidebar/nav/routing admin.
- `PLAN_BLINDATURA_ADMIN.md` se mappatura/blindatura/test multi-area/sub-agent.

## 3. Divieti top-3
1. **Classic ≠ Pro/Enterprise** non è solo layout: cambiano feature via `buildFeatures`. Classic non
   ha sidebar; Pro/Enterprise sì. `features.home=false` nasconde Home anche con sidebar attiva.
2. **Azioni pericolose** (delete/restore/rename/assegnazioni/archivio): apri SEMPRE
   `contesto/ADMIN_CONFLICTS_AND_DEBTS.md` + `contesto/ADMIN_DATA_FLOW_CONTEXT.md` + il context del
   dominio (`ADMIN_SKILL.md` §7-bis). Logout passa dal guard modifiche non salvate.
3. **Regole operative VOLUTE**: capienza/orario passato = solo avviso mai blocco; stati
   `pending/accepted/rejected/deleted`+`no_show` non si toccano; archivio = solo soft-delete; orari =
   regola `dateUtils` (`ADMIN_CLASSIC_SKILL.md` §4b prima di toccare data/ora).

## 4. Mappa file
| Se il task tocca… | Apri |
|---|---|
| Route `/admin`, sidebar, Classic/Pro, feature flags, logout, guard dirty | `contesto/ADMIN_SHELL_NAV_CONTEXT.md` |
| Tabelle, hook, storage, `restaurant_settings`, scritture multi-step | `contesto/ADMIN_DATA_FLOW_CONTEXT.md` |
| Calendario, pending, archivio, nuova prenotazione, dettagli/modali | `contesto/ADMIN_PRENOTAZIONI_CONTEXT.md` + `ADMIN_CLASSIC_SKILL.md` |
| Layout tab Calendario (celle mese, titolo responsive, padding, Oggi+data) | `../per-ui-design-skill/BOOKING_CALENDAR_LAYOUT_CONTEXT.md` + `ADMIN_CLASSIC_SKILL.md` §4c |
| Tab Menu, categorie, ingredienti, preset, QR manager | `contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` |
| Anagrafica, orari, tema admin, Personalizza Form, autosave | `contesto/ADMIN_SETTINGS_CONTEXT.md` |
| Sale, tavoli, service slots, walk-in, briefing | `contesto/ADMIN_SERVIZIO_CONTEXT.md` |
| Clienti CRM, detail panel, create/edit/delete | `contesto/ADMIN_CRM_CONTEXT.md` |
| Home, KPI, analytics | `contesto/ADMIN_ANALYTICS_HOME_CONTEXT.md` |
| Mock, hardcoded, codice morto, debiti | `contesto/ADMIN_CONFLICTS_AND_DEBTS.md` |
| Test esistenti e buchi | `contesto/ADMIN_TEST_SUITE_INDEX.md` |

## 5. LOCK (solo link)
- **Tab Calendario/Prenotazioni/Settings + `useBookingMutations`** → `ADMIN_CLASSIC_SKILL.md`
  (OBBLIGATORIO prima di modificare).
- **Regola orari** `dateUtils`/`createBookingDateTime`/`extractTimeFromISO` →
  `ADMIN_CLASSIC_SKILL.md` §4b.
- **Layout BookingCalendar** → `ADMIN_CLASSIC_SKILL.md` §4c + `BOOKING_CALENDAR_LAYOUT_CONTEXT.md`.
- **Sotto-route shell/dashboard** (refresh/back): non aggiungere route senza aggiornare
  `adminShellRouting` + test `@admin-blindatura: shell-refresh-back`.
