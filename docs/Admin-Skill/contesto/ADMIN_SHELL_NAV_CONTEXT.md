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
- `/admin/calendario` -> dashboard classica, tab Calendario.
- `/admin/prenotazioni` -> dashboard classica, tab Prenotazioni.
- `/admin/archivio` -> dashboard classica, tab Archivio.
- `/admin/menu` -> dashboard classica, tab Menu.
- `/admin/impostazioni` -> dashboard classica, tab Impostazioni.
- `/admin/crm` -> CRM se `features.crm=true`.
- `/admin/servizio` -> Servizio se `features.servizio=true`.
- `/admin/analytics` -> Analytics se `features.analytics=true`.

Le route non abilitate o sconosciute tornano alla sezione di default e vengono normalizzate sul path
canonico. Le tab operative della dashboard hanno URL leggeri per refresh/back.

**Fonte di verità = URL (fix flash 06-06-26).** Sia la `section` della shell sia l'`activeTab` della
dashboard sono **derivati dall'URL** (`resolveAdminSectionFromPath` / `resolveAdminDashboardTabFromPath`),
non stato React separato. In precedenza erano stato locale sincronizzato all'URL via `useEffect`: poiché
`setState` e `navigate` non sono atomici (gli handler sono async, ripresi dopo `await confirmNavigation`),
per 1-2 render lo stato e l'URL puntavano a tab/sezioni diverse → la schermata vecchia riappariva per un
istante (flash). Derivando dall'URL c'è un solo render coerente. Gli handler (`handleTabClick`,
`openSection`, `exitBodyOverrideToDashboard`, `handleViewInCalendar`) chiamano **solo `navigate`**: la
vista segue. Regressione bloccata da `src/components/layout/__tests__/adminShellTabFlash.test.tsx`
(`@admin-blindatura: shell-refresh-back`, casi tab + sezione).

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

Non esiste una voce sidebar "Impostazioni". Le impostazioni restano una tab interna della dashboard
classica, raggiungibile da `/admin/impostazioni` e dai nav item di `AdminDashboard`.
Il vecchio percorso `settings` via `restaurantSettingsSignal` è stato rimosso.

## 5. Dashboard interna

`AdminDashboard.activeTab` (**derivato dall'URL**, vedi §1):

- `calendar` -> `/admin/calendario`
- `pending` -> `/admin/prenotazioni`
- `archive` -> `/admin/archivio`
- `menu` -> `/admin/menu`
- `settings-restaurant` -> `/admin/impostazioni`

Quando Home Pro e attiva, `AdminDashboard` riceve `bodyOverride`: restano header ristorante e nav tab,
ma il corpo e sostituito da `AdminHomePage` e il chrome secondario dei tab viene nascosto.

Header: se manca il nome ristorante, il fallback e `Sistema Gestionale Prenotazioni`.

## 6. Tema admin

`AdminShell` e `AdminDashboard` leggono `restaurant_settings.app_theme` e applicano
`document.documentElement.dataset.adminTheme`. Duplicazione coerente ma da conoscere.

## 7. Unsaved changes

`UnsavedChangesProvider` mantiene sorgenti dirty e handler `saveAll`/`discardAll`.

- `confirmNavigation` mostra `UnsavedNavigationGuardModal`.
- Se le sorgenti dirty si azzerano mentre il dialog è ancora aperto (es. chiusura modale
  calendario dopo un tentativo di cambio tab), il provider **chiude automaticamente** il guard stale
  — altrimenti resterebbe visibile anche senza modifiche reali.
- `allowPrenotazioniDashboard` permette alcuni ritorni senza blocco.
- `beforeunload` protegge refresh/chiusura tab.
- Il back/forward browser tra URL tab dashboard passa dal guard quando ci sono modifiche dirty.
- Logout passa dal guard e non procede finche l'utente non salva o annulla le modifiche.

## 8. Rischi da testare dopo mappatura

- Route admin non abilitate o sconosciute devono tornare alla sezione di default.
- Back/forward browser deve ripercorrere le sezioni principali.
- Logout con modifiche dirty deve mostrare il guard.
- Home deve sparire se `features.home=false`.
- Impostazioni raggiungibile solo come tab dashboard (`/admin/impostazioni`), non come sezione sidebar.
- Doppio `useAdminAuth` e doppio theme effect.
- ✅ **Flash cambio tab/sezione (risolto 06-06-26):** la schermata vecchia non deve riapparire per un
  istante al cambio. Causa era stato duplicato che si rincorreva con l'URL; fix = derivare da URL (§1).
  Coperto da `adminShellTabFlash.test.tsx`.

## 9. Decisioni Area 1 chiuse con Matteo

| Decisione | Esito |
|---|---|
| Staff e admin | Stessi permessi, unico accesso per ora |
| Home staff durante servizio | Dipende dall'edizione/feature: Pro+ puo vedere Home, Classic no sidebar |
| Logout con dirty state | Deve bloccare con guard: salva/annulla/resta |
| Fallback header | `Sistema Gestionale Prenotazioni` |
| `features.home=false` con sidebar attiva | Home nascosta, default Prenotazioni |
| Refresh/back senza sotto-route | Migliorato: route leggere per sezioni shell e tab dashboard |

## 10. Test di blindatura Shell previsti

I test nuovi o aggiornati devono avere uno dei marcatori:

- `@admin-blindatura: shell-login`
- `@admin-blindatura: shell-edition`
- `@admin-blindatura: shell-sidebar`
- `@admin-blindatura: shell-dirty-guard`
- `@admin-blindatura: shell-logout`
- `@admin-blindatura: shell-refresh-back`

**E2E staging (FU-042, chiuso 10-06-26):** `e2e/admin-shell-blindatura.spec.ts` copre `shell-refresh-back`,
`shell-dirty-guard`, `shell-logout` su DB TEST (`.env.local.test`). Sidebar Pro: ruolo accessibilità
`complementary` + `aria-label="Navigazione principale"` (non `<nav>`). Ritorno alla dashboard prenotazioni
da sezioni Pro: pulsante **X** «Torna alla dashboard», non voce sidebar Prenotazioni (rimossa da `SIDEBAR_NAV`).
