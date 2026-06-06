---
name: admin-area
description: >-
  Skill di area per il portale admin autenticato (/admin): shell, dashboard,
  prenotazioni, menu magazzino, impostazioni, servizio, CRM, home e analytics.
---

# ADMIN — Skill di area (entry point)

> **Cos'e questo file.** Il punto di ingresso dell'area **Admin autenticata** (`/admin`).
> Tiene il senso, gli attori, i confini e la mappa verso i file di dettaglio. Non ripete
> tutti i numeri e i dettagli tecnici: quelli vivono nei file in `contesto/` e nel codice.
> Un agente legge questo file intero prima di toccare l'area admin, poi apre solo i file
> di dettaglio pertinenti e li legge interi.

> **Trigger di routing:** "admin", "dashboard", "portale", "area staff", "prenotazioni admin",
> "tab Menu", "magazzino menu", "Servizio", "CRM Clienti", "Analytics", "Impostazioni ristorante",
> "sidebar admin", "/admin".

> **Piano operativo:** per mappatura, blindatura prodotto, test multi-area o coordinamento sub-agent
> apri anche `PLAN_BLINDATURA_ADMIN.md`.

---

## 1. A che serve l'area Admin

L'area admin e il **centro operativo del ristoratore/staff** dopo il login. Non e una pagina pubblica:
serve a configurare il locale, gestire prenotazioni, menu, clienti, tavoli, servizio e statistiche.

Ha tre funzioni insieme:

1. **Operativita giornaliera** — vedere richieste, calendario, prossime prenotazioni, walk-in,
   tavoli e briefing turno.
2. **Configurazione del prodotto pubblico** — decidere cosa vedono i clienti su Pagina Prenota e
   Menu QR: testi, foto, modalita, menu, categorie, QR.
3. **Archivio e controllo dati** — storico prenotazioni, CRM clienti, analytics, impostazioni tenant.

## 2. Attori

- **Admin/ristoratore** — configura tutto, gestisce prenotazioni e dati del locale.
- **Staff** — per ora accede allo stesso portale con gli stessi permessi dell'admin. Decisione Matteo
  06-06-26: mantenere un unico accesso finche non nasce un'esigenza reale di ruoli distinti.
- **Cliente pubblico** — non entra mai in admin. Vede solo gli effetti su `/prenota/*` e `/menu/*`.

## 3. Confini da non confondere

- `/admin` resta la route protetta principale, con sotto-route leggere per le sezioni shell
  (`/admin/crm`, `/admin/servizio`, `/admin/analytics`) e per le tab operative della dashboard
  (`/admin/calendario`, `/admin/prenotazioni`, `/admin/archivio`, `/admin/menu`,
  `/admin/impostazioni`).
- **Admin autenticato** usa `supabase`; pagine pubbliche usano `supabasePublic`.
- **Magazzino Menu** (`menu_items`, `menu_categories`) diverso da **vetrina Prenota**
  (`booking_public_form_config`) e da **vista QR per-QR** (`menu_qr_codes`).
- **Config tenant** (`restaurant_settings`) diversa dai **dati operativi** (`booking_requests`,
  `customers`, `rooms`, `tables`, `service_slots`, `booking_table_assignments`).
- Classic e Pro/Enterprise non sono solo layout: cambiano feature disponibili tramite `buildFeatures`.

## 4. Flusso completo in breve

1. Admin fa login -> `useAdminAuth` verifica Supabase Auth, `admin_users`, tenant attivo e chiama
   `setTenantFromAdmin`.
2. `/admin` monta `AdminShell` dentro `ProtectedRoute`.
3. Se `features.sidebar=false` (Classic), si vede solo `AdminDashboard`.
4. Se `features.sidebar=true` (Pro/Enterprise), la shell mostra sidebar e sezioni abilitate dai flag:
   Home, Servizio, CRM, Analytics piu dashboard Prenotazioni. Home segue `features.home`; QR Menu e
   feature simili possono essere attivate/rimosse per tenant.
5. Dentro `AdminDashboard` ci sono i tab Calendario, Prenotazioni, Archivio, Menu, Impostazioni.
6. Ogni dominio legge/scrive dati tenant-scoped via hook dedicati.

## 5. Regole volute / da rispettare

- Le sezioni shell principali e le tab operative della dashboard hanno sotto-route leggere per
  refresh/back. Non aggiungere route nuove senza aggiornare `adminShellRouting` e i test
  `@admin-blindatura: shell-refresh-back`.
- Logout deve passare dal guard modifiche non salvate: l'utente salva, annulla o resta prima di uscire.
- Se manca il nome ristorante nell'header admin, il fallback e `Sistema Gestionale Prenotazioni`.
- Home deve rispettare `features.home`: se il flag e false, non compare anche con sidebar attiva.
- Non far leggere al pubblico dati admin autenticati: `/prenota/*` e `/menu/*` restano pubbliche.
- Non usare `restaurant_settings` per segreti: alcune chiavi sono leggibili anche dal pubblico.
- Non mescolare foto categoria Prenota, foto QR e foto piatto: hanno scopi e path diversi.
- Non "sistemare" fallback o elementi di sistema senza intervista: alcuni testi/stati vuoti possono
  essere voluti, altri sono debiti.

## 6. Decisioni e questioni aperte

Decisioni Area 1 chiuse con Matteo il 06-06-26:

- Admin e staff hanno stessi permessi per ora.
- Classic non ha sidebar; Pro/Enterprise hanno sidebar con sezioni abilitate dai feature flag.
- Logout con modifiche non salvate deve bloccare con guard.
- Fallback header admin: `Sistema Gestionale Prenotazioni`.
- `features.home=false` nasconde Home anche se sidebar resta attiva.
- Refresh/back delle sezioni shell e delle tab dashboard usano sotto-route leggere.

Questioni ancora aperte:

- Quali azioni devono essere considerate pericolose e testate per prime?

## 7. Mappa: tocchi X -> apri Y

| Se il task tocca... | Apri |
|---|---|
| Mappatura/blindatura Admin, lavoro multi-area, orchestrazione sub-agent, test `@admin-blindatura` | `PLAN_BLINDATURA_ADMIN.md` + context del dominio |
| Route `/admin`, sidebar, Classic/Pro, feature flags, logout, guard dirty | `contesto/ADMIN_SHELL_NAV_CONTEXT.md` |
| Flusso utente complessivo tra sezioni e tab | `contesto/ADMIN_USER_FLOW_CONTEXT.md` |
| Tabelle, hook, storage, `restaurant_settings`, Supabase | `contesto/ADMIN_DATA_FLOW_CONTEXT.md` |
| Calendario, pending, archivio, nuova prenotazione, dettagli/modali | `contesto/ADMIN_PRENOTAZIONI_CONTEXT.md` |
| Tab Menu, categorie, ingredienti, preset, QR manager | `contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` |
| Anagrafica, orari, tema admin, Personalizza Form Prenota, autosave | `contesto/ADMIN_SETTINGS_CONTEXT.md` |
| Sale, tavoli, mappa, service slots, walk-in, briefing | `contesto/ADMIN_SERVIZIO_CONTEXT.md` + `contesto/ADMIN_DATA_FLOW_CONTEXT.md` se il walk-in tocca `booking_requests` |
| Clienti, ricerca, tabella, detail panel, create/edit/delete | `contesto/ADMIN_CRM_CONTEXT.md` |
| Home, KPI giornalieri, quick action, analytics | `contesto/ADMIN_ANALYTICS_HOME_CONTEXT.md` |
| Mock, hardcoded, codice morto, conflitti, debiti | `contesto/ADMIN_CONFLICTS_AND_DEBTS.md` |
| Test esistenti e buchi iniziali | `contesto/ADMIN_TEST_SUITE_INDEX.md` |
| Azioni pericolose, delete/cascade/orfani, integrita dati, RLS, flussi multi-step | `contesto/ADMIN_CONFLICTS_AND_DEBTS.md` + `contesto/ADMIN_DATA_FLOW_CONTEXT.md` + context del dominio |

## 7-bis. Route rapida per azioni pericolose

Quando il task riguarda cancellazione, ripristino, rename, assegnazioni, archiviazione o modifiche che
possono lasciare dati orfani, non basta aprire il context del dominio. Apri sempre:

1. `contesto/ADMIN_CONFLICTS_AND_DEBTS.md` per rischi gia noti;
2. `contesto/ADMIN_DATA_FLOW_CONTEXT.md` per tabelle e scritture multi-step;
3. il context del dominio specifico.

Esempi:

- **Delete cliente CRM** -> `ADMIN_CRM_CONTEXT.md` + `ADMIN_DATA_FLOW_CONTEXT.md` +
  `ADMIN_CONFLICTS_AND_DEBTS.md`.
- **Rename/delete categoria menu** -> `ADMIN_MENU_MAGAZZINO_CONTEXT.md` + `ADMIN_DATA_FLOW_CONTEXT.md` +
  `ADMIN_CONFLICTS_AND_DEBTS.md`.
- **Walk-in** -> `ADMIN_SERVIZIO_CONTEXT.md` + `ADMIN_PRENOTAZIONI_CONTEXT.md` +
  `ADMIN_DATA_FLOW_CONTEXT.md`, perche crea una prenotazione accepted in `booking_requests`.
- **Assegnazione tavolo** -> `ADMIN_SERVIZIO_CONTEXT.md` + `ADMIN_PRENOTAZIONI_CONTEXT.md` +
  `ADMIN_DATA_FLOW_CONTEXT.md`.

## 8. Stato mappatura

Prima versione documentale creata su ricognizione codice + sub-agent read-only. Non e ancora
blindatura prodotto: mancano intervista Matteo, test completi dei flussi e controtest funzionale.
Controverifica documentale iniziale: **PASS parziale**, corretta aggiungendo la route rapida per
azioni pericolose.

Stato operativo aggiornato:

| Area | Stato | Nota |
|---|---|---|
| Shell / ingresso / navigazione globale | 🔶 blindatura avviata | Intervista chiusa; fix e test `shell-*` avviati, vedi `PLAN_BLINDATURA_ADMIN.md` §3 |
| Prenotazioni operative | ⬜ | Da avviare dopo Shell |
| Impostazioni / Personalizza Form | ⬜ | Da coordinare con Pagina Prenota |
| Menu admin / magazzino | ⬜ | Da coordinare con Prenota e Menu QR |
| Servizio | ⬜ | Include walk-in, tavoli e briefing |
| CRM | ⬜ | Include clienti e booking collegate |
| Home / Analytics | ⬜ | Include KPI e finestre data |
| Cross-area prod-ready | ⬜ | Fallback, hardcoded, codice morto, azioni pericolose |
