# ADMIN — User Flow Context

> Mappa dei percorsi utente dentro `/admin`. Serve a capire cosa puo fare admin/staff e dove una
> modifica impatta il flusso operativo.

## 1. Ingresso

1. Utente apre `/login`.
2. `useAdminAuth.login` autentica con Supabase Auth.
3. Il codice verifica che l'email esista in `admin_users`.
4. Verifica che `organizations.is_active=true`.
5. `TenantContext.setTenantFromAdmin` risolve tenant, slug, edition e feature override.
6. L'utente arriva su `/admin`.

## 2. Struttura navigazione

`/admin` monta la shell protetta. Le sezioni principali hanno sotto-route leggere; anche le tab
operative della dashboard hanno URL leggeri per preservare refresh/back:

- `AdminShell.section`: `home`, `prenotazioni`, `crm`, `servizio`, `analytics`.
- `AdminDashboard.activeTab`: `calendar`, `pending`, `archive`, `menu`, `settings-restaurant`.

Con `features.sidebar=false` la shell Classic salta sidebar e mostra direttamente `AdminDashboard`.
Con `features.sidebar=true` la sidebar Pro permette Home, Servizio, CRM, Analytics secondo feature
flag. Home rispetta `features.home`; se il flag e false la default diventa Prenotazioni.

Path shell:

- `/admin` -> Home se abilitata, altrimenti Prenotazioni.
- `/admin/calendario` -> dashboard classica, tab Calendario.
- `/admin/prenotazioni` -> dashboard classica, tab Prenotazioni.
- `/admin/archivio` -> dashboard classica, tab Archivio.
- `/admin/menu` -> dashboard classica, tab Menu.
- `/admin/impostazioni` -> dashboard classica, tab Impostazioni.
- `/admin/crm`, `/admin/servizio`, `/admin/analytics` -> sezioni Pro se abilitate.

## 3. Percorsi principali

| Percorso | Cosa fa l'utente | Esito dati |
|---|---|---|
| Home | vede riepilogo giorno, prossime 3 ore, apre walk-in o briefing | legge `booking_requests`, `business_hours`; walk-in scrive nuova booking |
| Prenotazioni -> Calendario | vede accepted, apre dettagli, modifica/cancella, assegna tavolo | legge/scrive `booking_requests`, `booking_table_assignments` |
| Prenotazioni -> Richieste | accetta/rifiuta pending, controlla capienza | cambia stato booking, orari confermati, motivi rifiuto |
| Prenotazioni -> Archivio | filtra storico, riporta in attesa, reinserisce cancellate | cambia stato `rejected/deleted` verso `pending` |
| Menu | gestisce categorie, ingredienti, foto, preset, QR | scrive menu tables, settings preset, storage, QR tables |
| Impostazioni | modifica anagrafica, orari, tema, Personalizza form | scrive `restaurant_settings` |
| Servizio | gestisce sale/tavoli, slot, assegnazioni, walk-in limit | scrive rooms/tables/slots/assignments/settings |
| CRM | cerca clienti, crea/modifica/elimina | legge/fonde `customers` + `booking_requests`, scrive entrambe in alcuni casi |
| Analytics | cambia periodo/turno e legge KPI | legge `booking_requests`, rooms/tables, business hours |

## 4. Flussi che escono da Admin

- `Form Pubblico` apre `/prenota/${tenantSlug}` in una nuova tab.
- `Menu QR` genera link `/menu/${tenantSlug}/qr/${shortCode}`.
- `Briefing turno` usa stampa browser o PDF locale.
- Logout porta a `/login`.

Nota auth/tenant (WP-B3 12-06-26): se l'admin ha una sessione attiva e apre un link pubblico
`/prenota/*` o `/menu/*`, il tenant della pagina pubblica resta quello dello slug URL. Il restore
sessione admin non chiama `setTenantFromAdmin` su quelle route; tornando in `/admin` il check sessione
riparte e ricarica il tenant admin.

## 5. Guard modifiche non salvate

`UnsavedChangesProvider` avvolge tutta `AdminShell`.

- Cambio sezione/tab chiama `confirmNavigation` in diversi punti.
- Il ritorno da sezioni Pro verso dashboard prenotazioni puo usare `allowPrenotazioniDashboard`.
- Logout passa dal guard: l'utente deve salvare, annullare o restare prima di uscire.

## 6. Buchi di senso da intervistare

- Staff/admin hanno gli stessi permessi per ora; ruoli distinti sono fuori scope Area 1.
- La "home vera" dipende dall'edizione/feature: Classic vede Prenotazioni, Pro+ puo vedere Home.
- Quali flussi sono giornalieri e quali solo setup iniziale?
- Il ritorno senza guard verso Prenotazioni e voluto?
