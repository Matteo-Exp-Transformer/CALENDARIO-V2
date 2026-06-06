# ADMIN — Shell, Routing e Navigazione

> **Area 1 del piano Admin.** Per blindatura prodotto seguire `../PLAN_BLINDATURA_ADMIN.md` §3.
> Intervista Area 1 chiusa il 06-06-26. Decisioni Matteo: staff/admin stesso accesso per ora;
> Classic senza sidebar; Pro/Enterprise con sidebar e feature modulabili; logout bloccato dal guard;
> fallback header neutro; Home governata da `features.home`; refresh/back da migliorare con route.

## 1. Route

`src/router.tsx` definisce route admin protette:

- `/admin` -> `ProtectedRoute` -> `AdminShell`
- `/admin/:adminSection` -> `ProtectedRoute` -> `AdminShell`

Le sotto-route supportate dalla shell sono:

- `/admin` -> Home se `features.home=true`, altrimenti Prenotazioni.
- `/admin/prenotazioni` -> dashboard classica.
- `/admin/crm` -> CRM se `features.crm=true`.
- `/admin/servizio` -> Servizio se `features.servizio=true`.
- `/admin/analytics` -> Analytics se `features.analytics=true`.

Le route non abilitate o sconosciute tornano alla sezione di default e vengono normalizzate sul path
canonico. Le tab interne della dashboard restano stato React, non sotto-route.

## 2. Auth e tenant

`ProtectedRoute` mostra loading, poi manda a `/login` se `useAdminAuth` non ha user.
`useAdminAuth`:

- legge sessione Supabase;
- verifica `admin_users`;
- verifica `organizations.is_active`;
- chiama `setTenantFromAdmin`;
- su logout fa `supabase.auth.signOut`, reset tenant e navigate `/login`.

Possibile rischio: `useAdminAuth` e chiamato in piu componenti (`ProtectedRoute`, `AdminShell`,
`AdminDashboard`), quindi puo duplicare controlli/session check.

Decisione Matteo: logout da sidebar e footer dashboard deve passare prima da
`UnsavedChangesProvider.confirmNavigation`; se ci sono modifiche non salvate, l'utente deve salvare,
annullare o restare prima di uscire.

## 3. Classic vs Pro

`useFeatures` combina `edition` e `featureOverrides`.

- Classic: `features.sidebar=false`, quindi `AdminShell` renderizza solo `AdminDashboard`.
- Pro/Enterprise: sidebar attiva; Home, CRM, Analytics, Servizio e QR Menu seguono i rispettivi
  feature flag e possono essere rimossi con override.

Decisione Matteo: `features.home=false` nasconde Home anche se `features.sidebar=true`; la sezione
iniziale diventa Prenotazioni.

## 4. Sidebar Pro

Stati sidebar:

- `hidden`: sparisce, compare pulsante flottante.
- `icons`: colonna icone fissa.
- `expanded`: drawer largo con backdrop.

Azioni:

- Home -> `section='home'` solo se `features.home=true`.
- Servizio/CRM/Analytics -> lazy page.
- X nelle sezioni -> torna a dashboard prenotazioni.
- Logout -> esce.

Esiste una action `settings` con `restaurantSettingsSignal`, ma nella lista corrente non c'e una voce
sidebar "Impostazioni": percorso latente.

## 5. Dashboard interna

`AdminDashboard.activeTab`:

- `calendar`
- `pending`
- `archive`
- `menu`
- `settings-restaurant`

Quando Home Pro e attiva, `AdminDashboard` riceve `bodyOverride`: restano header ristorante e nav tab,
ma il corpo e sostituito da `AdminHomePage` e il chrome secondario dei tab viene nascosto.

Header: se manca il nome ristorante, il fallback e `Sistema Gestionale Prenotazioni`.

## 6. Tema admin

`AdminShell` e `AdminDashboard` leggono `restaurant_settings.app_theme` e applicano
`document.documentElement.dataset.adminTheme`. Duplicazione coerente ma da conoscere.

## 7. Unsaved changes

`UnsavedChangesProvider` mantiene sorgenti dirty e handler `saveAll`/`discardAll`.

- `confirmNavigation` mostra `UnsavedNavigationGuardModal`.
- `allowPrenotazioniDashboard` permette alcuni ritorni senza blocco.
- `beforeunload` protegge refresh/chiusura tab.
- Logout passa dal guard e non procede finche l'utente non salva o annulla le modifiche.

## 8. Rischi da testare dopo mappatura

- Route admin non abilitate o sconosciute devono tornare alla sezione di default.
- Back/forward browser deve ripercorrere le sezioni principali.
- Logout con modifiche dirty deve mostrare il guard.
- Home deve sparire se `features.home=false`.
- `settings` latente non raggiungibile da sidebar.
- Doppio `useAdminAuth` e doppio theme effect.

## 9. Decisioni Area 1 chiuse con Matteo

| Decisione | Esito |
|---|---|
| Staff e admin | Stessi permessi, unico accesso per ora |
| Home staff durante servizio | Dipende dall'edizione/feature: Pro+ puo vedere Home, Classic no sidebar |
| Logout con dirty state | Deve bloccare con guard: salva/annulla/resta |
| Fallback header | `Sistema Gestionale Prenotazioni` |
| `features.home=false` con sidebar attiva | Home nascosta, default Prenotazioni |
| Refresh/back senza sotto-route | Da migliorare: route leggere `/admin/:adminSection` |

## 10. Test di blindatura Shell previsti

I test nuovi o aggiornati devono avere uno dei marcatori:

- `@admin-blindatura: shell-login`
- `@admin-blindatura: shell-edition`
- `@admin-blindatura: shell-sidebar`
- `@admin-blindatura: shell-dirty-guard`
- `@admin-blindatura: shell-logout`
- `@admin-blindatura: shell-refresh-back`
