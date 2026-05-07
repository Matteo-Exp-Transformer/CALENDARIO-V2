# Benvenuto in CalendarBackup-v2

Questo documento è pensato per chi riceve il progetto e vuole capire come funziona prima di toccare il codice. Leggilo dall'inizio alla fine la prima volta, poi usalo come riferimento.

---

## Cosa fa l'app

CalendarBackup-v2 è un **sistema SaaS multi-tenant per prenotazioni ristorante**.

In pratica:
- Ogni ristorante (chiamato "tenant" o "organizzazione") ottiene una **pagina pubblica** dove i clienti possono inviare richieste di prenotazione
- Il ristorante ha una **dashboard admin** privata per gestire le richieste (accettare, rifiutare, modificare) e visualizzare il calendario
- Un'unica installazione del software serve più ristoranti contemporaneamente, i cui dati restano completamente isolati

Il nome "CalendarBackup" è il nome del repository — il nome prodotto interno è "Sistema Gestionale Prenotazioni".

---

## Mappa del repo

```
CalendarBackup-v2/
├── src/                    # Frontend React
│   ├── pages/              # Una pagina per route (/login, /admin, /prenota/:slug, ecc.)
│   ├── features/booking/   # Tutto ciò che riguarda le prenotazioni
│   │   ├── components/     # Componenti UI della dashboard
│   │   ├── hooks/          # Logica dati (query + mutazioni)
│   │   ├── utils/          # Funzioni pure (date, prezzi, trasformazioni)
│   │   └── constants/      # Valori fissi (menu preset, capienza)
│   ├── components/ui/      # Componenti UI riusabili (Button, Input, Modal)
│   ├── contexts/           # TenantContext — chi siamo in questo momento
│   ├── lib/                # Utility (client Supabase, email, logger)
│   ├── hooks/              # Hook globali non legati a una feature
│   ├── types/              # TypeScript types (database.ts è generato)
│   └── router.tsx          # Tutte le route
├── supabase/
│   ├── migrations/         # File SQL da applicare al DB
│   └── functions/          # Edge Functions (create-booking, validate-invite)
├── scripts/                # Script Node per popolare il DB in locale
├── public/                 # Asset statici (icone, immagini sfondo)
└── docs/                   # Documentazione tecnica dettagliata
```

---

## Pagina per pagina

### `/login` — Accesso admin

**File:** `src/pages/AdminLoginPage.tsx`
**Hook:** `useAdminAuth` (`src/features/booking/hooks/useAdminAuth.ts`)

L'admin inserisce email e password. Il flusso:
1. `supabase.auth.signInWithPassword()` — verifica le credenziali su Supabase Auth
2. Controlla che l'email sia nella tabella `admin_users` (doppio check di sicurezza)
3. Verifica che l'organizzazione sia attiva (`is_active = true`)
4. Popola il `TenantContext` con i dati dell'organizzazione
5. Redirect a `/admin`

La sessione viene salvata in `localStorage`. Al ricaricamento della pagina, `useAdminAuth` la riprende automaticamente senza nuovo login.

---

### `/admin` — Dashboard amministratore

**File:** `src/pages/AdminDashboard.tsx`
**Protezione:** `ProtectedRoute` (`src/components/ProtectedRoute.tsx`)
**Hook principali:** `useAdminBookingRequests`, `useMenuCategories`, `useRestaurantSetting`

`ProtectedRoute` controlla se c'è un utente loggato via `useAdminAuth`. Se non c'è sessione, redirect a `/login`.

La dashboard è organizzata in tab:
- **Pendenti** — richieste di prenotazione in attesa (accept/reject/create)
- **Calendario** — prenotazioni accettate su FullCalendar
- **Archivio** — storico prenotazioni
- **Menu** — gestione voci menu e categorie
- **Prezzi** — gestione prezzi menu
- **Diete** — gestione restrizioni alimentari
- **Impostazioni** — orari, capienza, impostazioni ristorante

Tutti i dati vengono da React Query e vengono invalidati automaticamente dopo ogni mutazione.

---

### `/prenota/:tenantSlug` — Form prenotazione cliente

**File:** `src/pages/BookingRequestPage.tsx`
**Componente form:** `src/features/booking/components/BookingRequestForm.tsx`
**Edge Function:** `create-booking`

Il `:tenantSlug` nell'URL identifica il ristorante. All'avvio, `TenantContext.setTenantFromSlug(slug)` risolve lo slug in un `tenantId` leggendo la tabella `organizations` con il client pubblico (`supabasePublic` — nessuna sessione).

Il form raccoglie i dati del cliente e all'invio chiama direttamente la Edge Function `create-booking` via `fetch`. Non usa il client Supabase per questa operazione — la funzione ha il service role e valida tutto internamente.

Dopo l'invio, il cliente vede un messaggio di conferma. **Non viene inviata email** (la Edge Function `send-email` non esiste ancora).

---

### `/invite/:token` e `/register` — Registrazione admin

**File:** `src/pages/InvitePage.tsx`
**Edge Functions:** `validate-invite` (GET + POST)

Questo flusso permette di aggiungere nuovi admin a un'organizzazione senza accesso al DB. Il proprietario del ristorante genera un token di invito manualmente nel DB e lo condivide tramite link.

1. La pagina carica → chiama `validate-invite` in GET con il token → ottiene il nome dell'organizzazione
2. Il nuovo admin compila email e password
3. Submit → `validate-invite` in POST → crea utente Supabase Auth + riga in `admin_users`
4. Redirect a `/login`

La route `/register?token=...` (vecchio formato) viene gestita dallo stesso componente per retrocompatibilità — il token viene letto dalla query string invece che dal path.

---

### `/privacy` — Informativa privacy

**File:** `src/pages/PrivacyPolicyPage.tsx`

Pagina statica. Nessuna logica.

---

## Come l'app parla con il database

```
React component
    └── custom hook (es. useAdminBookingRequests)
          └── TanStack React Query (useQuery / useMutation)
                └── src/lib/supabase.ts  ←→  Supabase PostgreSQL
                        (autenticato, con JWT)
                              └── RLS filtra per tenant_id
                                    └── current_admin_tenant_id()
                                          legge tenant dal JWT

Form pubblico /prenota/:slug
    └── fetch() diretta
          └── Edge Function create-booking
                └── src/lib/supabasePublic.ts  (solo per leggere slug)
                └── supabaseAdmin (service role, bypasssa RLS)
```

Due client Supabase per un motivo preciso:
- **`supabase`** (in `src/lib/supabase.ts`): mantiene la sessione in `localStorage`. Usato da tutto ciò che richiede autenticazione admin.
- **`supabasePublic`** (in `src/lib/supabasePublic.ts`): non mantiene nessuna sessione. Usato dal form pubblico e dal `TenantContext` per leggere dati pubblici senza sporcare la sessione admin.

---

## Dove guardare se qualcosa non va

### Il form di prenotazione non funziona

1. Verifica che lo slug nell'URL corrisponda a una riga in `organizations` con `is_active = true`
2. Apri i DevTools → Network → cerca la richiesta alla Edge Function `create-booking`
3. Se la risposta è 429: rate limit IP o limite annuale raggiunto
4. Se la risposta è 404: slug non trovato
5. Se la risposta è 500: errore DB (guarda i log della Edge Function in Supabase Dashboard → Edge Functions → Logs)

### Il login admin non funziona

1. Verifica che l'utente esista in Supabase Auth (Dashboard → Authentication → Users)
2. Verifica che l'email esista in `admin_users` con il `tenant_id` corretto
3. Verifica che `organizations.is_active = true` per quel tenant
4. Controlla la console del browser per errori di rete

### Il calendario non mostra prenotazioni

1. Verifica che le prenotazioni abbiano `status = 'accepted'` e `confirmed_start` valorizzato
2. Verifica che il `TenantContext` abbia il `tenantId` corretto (controlla React DevTools)
3. Verifica che la RLS non stia filtrando troppo (prova una query diretta in SQL Editor)

### Le email non arrivano

La Edge Function `send-email` non è implementata. Questo è un issue noto e documentato, non un bug. Vedi `docs/EDGE_FUNCTIONS.md` per la specifica di implementazione.

---

## Criticità note e zone calde

Queste sono le aree che richiedono attenzione prima di modificare il codice.

### 1. `search_path` mutabile su 4 funzioni DB

Le funzioni `current_admin_tenant_id()` e altre sono `SECURITY DEFINER`. La migrazione `002_rls_admin_users.sql` imposta `SET search_path = public` su questa funzione specifica, ma potrebbe non coprire tutte le funzioni. Verificare con:

```sql
SELECT proname, prosecdef, proconfig
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace AND prosecdef = true;
```

Un `search_path` non fisso su funzioni `SECURITY DEFINER` è un potenziale vettore di privilege escalation.

### 2. Policy permissive su `invite_tokens` e `rate_limits`

Queste tabelle non hanno policy RLS restrittive per utenti autenticati. Non è un problema oggi perché le Edge Functions le gestiscono con service role, ma se in futuro si aggiungono query lato client, i dati potrebbero essere visibili tra tenant.

### 3. FK non indicizzate

`email_logs.booking_id` e `invite_tokens.organization_id` mancano di indici espliciti. Su volumi bassi non è un problema, ma da tenere a mente se le tabelle crescono. Vedi `docs/DATABASE.md`.

### 4. Leaked password protection disabilitata

Il progetto Supabase potrebbe avere la protezione "leaked passwords" disabilitata (da verificare in Supabase Dashboard → Authentication → Settings). È una funzionalità che impedisce la registrazione con password note come compromesse.

### 5. Edge Function `send-email` referenziata ma non esiste

`src/lib/email.ts` chiama `${SUPABASE_URL}/functions/v1/send-email`. La funzione non è nel repo. I flussi email falliscono silenziosamente (il codice gestisce l'errore con un `console.warn` in dev). Nessun impatto funzionale sulle prenotazioni, ma i clienti non ricevono email.

### 6. Doppio prefisso `003_*` e disallineamento migrazioni

Le migrazioni locali usano nomi sequenziali (`001_`, `002_`, ecc.) mentre il DB remoto potrebbe registrarle con timestamp. Questo può causare falsi "migration pending" quando si usa `supabase migration list --linked`. Dettagli in `docs/DATABASE.md`.

---

## Checklist esplorazione consigliata

Se vuoi fare una review completa del progetto, segui questo ordine:

1. **Questo file** — panoramica generale (fatto)
2. [README.md](README.md) — setup rapido e comandi
3. [docs/SETUP.md](docs/SETUP.md) — setup ambiente locale
4. **Setup locale**: `npm install`, crea `.env.local`, `supabase db push`, `npm run dev`
5. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — architettura e pattern
6. [`src/router.tsx`](src/router.tsx) — tutte le route in ~80 righe
7. [`src/contexts/TenantContext.tsx`](src/contexts/TenantContext.tsx) — come funziona il multi-tenancy
8. [`src/lib/supabase.ts`](src/lib/supabase.ts) e [`src/lib/supabasePublic.ts`](src/lib/supabasePublic.ts) — i due client
9. **Un flusso completo**: apri `/prenota/<slug>`, invia una prenotazione, poi loggati su `/admin` e gestiscila
10. [docs/DATABASE.md](docs/DATABASE.md) — schema e RLS in dettaglio
11. [docs/EDGE_FUNCTIONS.md](docs/EDGE_FUNCTIONS.md) — le Edge Functions
12. [CONTRIBUTING.md](CONTRIBUTING.md) — convenzioni prima di scrivere codice
