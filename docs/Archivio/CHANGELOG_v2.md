# CalendarBackup-v2 — Report di Ottimizzazione

**Data:** Aprile 2026  
**Progetto originale:** `CalendarBackup/` (Al Ritrovo Booking System)  
**Versione ottimizzata:** `CalendarBackup-v2/`

---

## 1. Cosa è stato fatto

### Repository pulita
- Rimossi: `_archive/`, `dist/`, `test-results/`, `.cursor/`, `test.md`, file `.test.ts`
- Mantenuti solo i file necessari al funzionamento del progetto
- `.gitignore` aggiornato (include `dist/`, `test-results/`, `*.log`)
- `.env.example` creato con placeholder (le credenziali reali non sono mai incluse)

### Stack tecnologico (invariato)
- **Frontend:** React 18 + Vite + TypeScript
- **Stile:** TailwindCSS (tema aggiornato)
- **Database:** Supabase (PostgreSQL con RLS)
- **Autenticazione:** Supabase Auth
- **Query management:** TanStack React Query
- **Routing:** React Router v7
- **Calendario:** FullCalendar v6
- **Deploy:** Vercel

### Tema UI rinnovato
Il vecchio tema "warm wood" (marrone/legno, colore primario `#8B4513`) è stato sostituito
con una **palette professionale Blu/Indaco**:

| Token | Valore | Uso |
|-------|--------|-----|
| `primary-600` | `#4F46E5` | Bottoni, link, elementi attivi |
| `primary-700` | `#4338CA` | Hover stati |
| `primary-50`  | `#EEF2FF` | Background attivo nav |
| `primary-100` | `#E0E7FF` | Badge, icone |

Componenti UI riscritti da zero (Button, Input, Label, Textarea, Modal) con il nuovo tema.
I CSS custom variables in `index.css` sono stati aggiornati di conseguenza.

### Architettura multi-tenant
Il multi-tenant era già presente nel codice originale ma **non applicato al DB** (migrazioni 037-041 in pending).
Nella v2, lo schema è consolidato in **un'unica migrazione** (`001_schema_completo.sql`) che include:

- Tabella `organizations` come tenant registry
- Colonna `tenant_id` su tutte le tabelle dati
- RLS completa basata su `app.current_tenant_id`
- Funzioni RPC `check_admin_email()` e `set_tenant()` già incluse

### Route `/invite/:token` (nuova)
Il progetto originale gestiva gli inviti con `/register?token=...` (token in query string).
La v2 aggiunge la route `/invite/:token` con token nel path, più pulita e SEO-friendly.

Il componente `InvitePage.tsx` è compatibile con **entrambi i formati**:
- `/invite/abc123` → token dal path
- `/register?token=abc123` → token dalla query string (retrocompatibilità)

---

## 2. Schema DB finale

```
organizations
  ├── id, name, slug, plan, is_active
  ├── max_bookings_per_year
  ├── max_booking_requests_per_year
  └── created_at, updated_at

booking_requests
  ├── id, tenant_id → organizations.id
  ├── client_name, client_email, client_phone
  ├── event_type, booking_type, desired_date, desired_time
  ├── num_guests, special_requests, placement
  ├── menu, menu_selection (JSONB), menu_total_per_person, menu_total_booking, preset_menu
  ├── dietary_restrictions (JSONB)
  ├── status (pending|accepted|rejected|deleted)
  ├── confirmed_start, confirmed_end, rejection_reason
  ├── cancellation_reason, cancelled_at, cancelled_by
  ├── booking_source (public|admin)
  └── created_at, updated_at

admin_users
  ├── id, tenant_id → organizations.id
  ├── email, name
  └── created_at, updated_at

menu_items
  ├── id, tenant_id → organizations.id
  ├── name, category, price, description, sort_order
  └── created_at, updated_at

restaurant_settings
  ├── id, tenant_id → organizations.id
  ├── setting_key, setting_value (JSONB)
  └── updated_at

email_logs
  ├── id, tenant_id → organizations.id
  ├── booking_id → booking_requests.id
  ├── email_type, recipient_email, sent_at
  ├── status (sent|failed|pending)
  └── provider_response (JSONB), error_message

invite_tokens
  ├── id, organization_id → organizations.id
  ├── token, email (opzionale)
  ├── expires_at, used_at
  └── created_at, created_by

tenant_usage
  ├── id, organization_id → organizations.id
  ├── year, bookings_count, booking_requests_count

rate_limits
  ├── id, ip_address, endpoint, requested_at
```

---

## 3. Route / Pagine presenti

| Route | Componente | Accesso | Descrizione |
|-------|-----------|---------|-------------|
| `/` | redirect | Pubblico | Redirect a `/login` |
| `/login` | `AdminLoginPage` | Pubblico | Login amministratore |
| `/invite/:token` | `InvitePage` | Pubblico | Registrazione tramite link invito (token nel path) |
| `/register?token=` | `InvitePage` | Pubblico | Retrocompatibilità vecchio formato invito |
| `/prenota/:tenantSlug` | `BookingRequestPage` | Pubblico | Form prenotazione per un ristorante specifico |
| `/prenota` | `TenantNotFound` | Pubblico | Errore: slug mancante |
| `/admin` | `AdminDashboard` | Protetto | Dashboard admin (richiede login) |
| `/privacy` | `PrivacyPolicyPage` | Pubblico | Informativa privacy |

---

## 4. Edge Functions Supabase (Deno)

| Funzione | Metodo | Descrizione |
|----------|--------|-------------|
| `validate-invite` | GET | Valida un token di invito, restituisce nome org |
| `validate-invite` | POST | Completa la registrazione: crea utente Auth + admin_users, segna token come usato |
| `create-booking` | POST | Crea una prenotazione pubblica (da completare con logica email) |

---

## 5. Cosa manca / richiede intervento manuale

### ⚠️ Richiede setup di Matteo

#### A. Credenziali Supabase
1. Creare un nuovo progetto su [supabase.com](https://supabase.com)
2. Copiare `.env.example` in `.env.local` e inserire:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Applicare la migrazione: `supabase/migrations/001_schema_completo.sql`
   (via Supabase Dashboard → SQL Editor, oppure `supabase db push` con CLI)

#### B. Sistema email (Resend)
Il codice `src/lib/email.ts` chiama una Edge Function `send-email` **che non esiste ancora**.
Per il funzionamento delle notifiche email occorre:
- Account [Resend](https://resend.com) con dominio verificato
- Creare la Edge Function `send-email` (o adattare `create-booking`)
- Aggiungere il secret `RESEND_API_KEY` ai segreti Supabase

Senza questo passaggio, le prenotazioni funzionano ma **non vengono inviate email** di conferma.

#### C. Generazione token di invito
Non esiste ancora un'interfaccia UI per generare i token di invito.
Matteo deve farlo manualmente via SQL o via Supabase Dashboard:

```sql
INSERT INTO invite_tokens (organization_id, token, email, expires_at)
VALUES (
  '<id-organizzazione>',
  gen_random_uuid()::text,
  'nuovo-admin@ristorante.it',   -- opzionale
  NOW() + INTERVAL '7 days'
);
```

L'URL da inviare al nuovo admin sarà:
```
https://tuodominio.com/invite/<token>
```

#### D. Prima organizzazione
Il DB parte vuoto. Per creare il primo tenant:

```sql
INSERT INTO organizations (name, slug, plan)
VALUES ('Nome Ristorante', 'nome-ristorante', 'starter');
```

#### E. Allegato PDF menu (opzionale)
`src/lib/pdfAttachment.ts` legge `VITE_MENU_PDF_BASE64` dall'env.
Se vuoi allegare un PDF alle email di conferma, codifica il file in base64 e
aggiungilo a `.env.local`. Se non è presente, la funzionalità viene semplicemente ignorata.

---

## 6. Istruzioni per avviare il progetto in locale

```bash
# 1. Entra nella cartella
cd CalendarBackup-v2

# 2. Installa le dipendenze
npm install

# 3. Crea il file di ambiente
cp .env.example .env.local
# Poi modifica .env.local con le tue credenziali Supabase

# 4. Applica lo schema DB
# → Vai su Supabase Dashboard → SQL Editor
# → Esegui il contenuto di supabase/migrations/001_schema_completo.sql

# 5. Avvia il dev server
npm run dev
# L'app sarà disponibile su http://localhost:5173

# 6. Build per produzione
npm run build
```

---

## 7. Deploy su Vercel

1. Collegare il repository a Vercel
2. Impostare le variabili d'ambiente in Vercel Dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Vercel rileverà automaticamente Vite e farà il build
4. Le rotte SPA sono gestite dal `vercel.json` incluso

---

## 8. Differenze rispetto all'originale — Riepilogo

| Aspetto | Originale | v2 |
|---------|-----------|-----|
| Tema UI | Marrone/Legno caldo | Blu/Indaco professionale |
| Route invito | `/register?token=...` | `/invite/:token` + retrocompat. |
| Migrazioni DB | 41 file separati (037-041 non applicate) | 1 file consolidato |
| File di test | Presenti in `src/` | Rimossi |
| Cartella `_archive/` | Presente | Rimossa |
| `dist/` committato | Sì | No (in `.gitignore`) |
| `.env.example` | Assente | Presente |
| `favicon` | Vite default | SVG custom (booking icon) |
| Logo/Brand | Hardcoded "Al Ritrovo" | Dinamico da `organizationName` |
| Logout nel header | Assente | Presente (bottone Esci) |
| Stats header | Stile "warm" | Stile card pulito indaco |
