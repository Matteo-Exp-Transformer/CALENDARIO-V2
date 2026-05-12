# Architettura

## Layer dell'applicazione

```
Browser
  └── React SPA (Vite + TypeScript)
        ├── react-router-dom v7  — routing lato client
        ├── TanStack React Query v5 — cache e sincronizzazione dati server
        ├── TailwindCSS v4  — stile utility-first
        └── FullCalendar v6  — calendario prenotazioni

Supabase (BaaS)
  ├── PostgreSQL + RLS  — database con isolamento per tenant
  ├── Supabase Auth  — autenticazione JWT
  └── Edge Functions (Deno)  — logica server-side
        ├── create-booking  — crea prenotazioni pubbliche
        └── validate-invite  — registrazione admin via token

Vercel
  └── SPA hosting + CDN  — distribuisce il frontend
```

## Routing

Il routing è definito in [`src/router.tsx`](../src/router.tsx) con React Router v7.

Tutte le route sono sotto un `RootLayout` che wrappa tutto con `TenantProvider`:

| Route | Componente | Accesso |
|-------|-----------|---------|
| `/` | redirect a `/login` | — |
| `/login` | `AdminLoginPage` | Pubblico |
| `/prenota/:tenantSlug` | `BookingRequestPage` | Pubblico |
| `/prenota` | `TenantNotFound` | Pubblico |
| `/invite/:token` | `InvitePage` | Pubblico |
| `/register` | `InvitePage` | Pubblico (retrocompat.) |
| `/privacy` | `PrivacyPolicyPage` | Pubblico |
| `/admin` | `AdminDashboard` (dentro `ProtectedRoute`) | Richiede login |
| `*` | redirect a `/login` | — |

**ProtectedRoute** (`src/components/ProtectedRoute.tsx`) usa `useAdminAuth` per verificare la sessione. Se non autenticato, redirige a `/login`.

## State management

L'app usa due approcci distinti:

### TanStack React Query (server state)
Tutti i dati che vengono dal DB sono gestiti con React Query. I hook sono in `src/features/booking/hooks/`:

- `useAdminBookingRequests` — lista prenotazioni pendenti
- `useBookingMutations` — accept/reject/delete/create
- `useMenuCategories` — categorie menu
- `useMenuItems` — voci di menu
- `useRestaurantSetting` — impostazioni ristorante
- `useEmailLogs` — log email
- `useEmailNotifications` — trigger invio email
- `useCapacityCheck` — verifica capienza

React Query gestisce automaticamente cache, invalidazione e refetch. Le mutazioni che cambiano dati invalidano le query correlate.

### React state locale (UI state)
Modal aperti/chiusi, tab attive, valori dei form — tutto con `useState` locale nei componenti.

### TenantContext (context globale)
`src/contexts/TenantContext.tsx` espone il `tenantId` corrente a tutta l'app. È l'unico dato globale (non server-state) perché serve sia alle query che alle mutazioni.

## Multi-tenancy

Il sistema isola i dati per tenant a due livelli:

**Livello applicativo:** `TenantContext` risolve il `tenantId` all'avvio e lo passa a tutti gli hook. La risoluzione avviene in due modi:
- Pagina pubblica: `setTenantFromSlug(slug)` — legge lo slug dall'URL e cerca l'organizzazione
- Dashboard admin: `setTenantFromAdmin(email)` — dopo il login, chiama la funzione RPC `check_admin_email` per trovare il tenant dell'admin

**Livello database:** Row Level Security (RLS) su ogni tabella. La funzione `current_admin_tenant_id()` estrae il `tenant_id` dal JWT dell'utente autenticato confrontandolo con la tabella `admin_users`. Ogni SELECT/INSERT/UPDATE/DELETE è filtrato automaticamente dal DB.

Le Edge Functions usano il `service_role` (bypassano RLS), quindi la validazione dell'input è critica al loro interno.

## Auth flow admin

```
1. Utente inserisce email + password su /login
2. useAdminAuth.login() chiama supabase.auth.signInWithPassword()
3. Supabase Auth verifica le credenziali → restituisce JWT
4. Il frontend verifica che l'email esista in admin_users (doppio check)
5. Verifica che l'organizzazione sia is_active = true
6. Chiama setTenantFromAdmin(email) → popola TenantContext
7. Redirect a /admin
8. Sessione salvata in localStorage (persistSession: true, flowType: 'pkce')
```

Al successivo caricamento della pagina, `useAdminAuth` esegue `checkSession()` che ripete i passi 3-6 usando il refresh token.

## Pattern hook + mutation

Ogni feature ha hook separati per lettura e scrittura:

```
useMenuCategories       → legge le categorie (useQuery)
  └── createCategory()  → crea (useMutation → invalida useMenuCategories)
  └── updateCategory()  → aggiorna (useMutation → invalida)
  └── deleteCategory()  → elimina (useMutation → invalida)
```

Le mutazioni usano `queryClient.invalidateQueries` dopo il successo per triggerare il refetch automatico.

## Build e deploy

**Build:** `npm run build` esegue `tsc --noEmit` (typecheck) poi `vite build`. Output in `dist/`.

**PWA:** `vite-plugin-pwa` genera il Service Worker con Workbox. La strategia `CacheFirst` si applica solo agli asset statici (CSS, JS, font, immagini). Le richieste a `supabase.co` non sono mai cachate per evitare dati stantii.

**Vercel:** hosting SPA. Il file `vercel.json` reindirizza tutte le richieste a `index.html` per supportare il routing lato client.

## Due client Supabase

L'app ha due client distinti:

| Client | File | Sessione | Usato da |
|--------|------|---------|---------|
| `supabase` | `src/lib/supabase.ts` | `persistSession: true` (localStorage) | Hook admin, ProtectedRoute |
| `supabasePublic` | `src/lib/supabasePublic.ts` | `persistSession: false` | TenantContext, form prenotazione |

Questa separazione evita che le operazioni pubbliche (form cliente) interferiscano con la sessione admin. Il client pubblico ha uno storage custom che scarta qualsiasi token.
