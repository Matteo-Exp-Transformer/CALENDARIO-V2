# Setup — Guida all'ambiente locale e produzione

## Prerequisiti

- **Node.js** 20 o superiore
- **npm** 10 o superiore
- **Supabase CLI**: `npm install -g supabase`
- Un account su [supabase.com](https://supabase.com) (piano gratuito sufficiente)
- Un account su [vercel.com](https://vercel.com) (piano gratuito sufficiente)

## Setup ambiente locale

### 1. Clona e installa

```bash
git clone <url-repo>
cd CalendarBackup-v2
npm install
```

### 2. Crea le variabili d'ambiente

```bash
cp .env.example .env.local
```

Apri `.env.local` e inserisci le credenziali del tuo progetto Supabase:

```
VITE_SUPABASE_URL=https://<ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<la-tua-anon-key>
```

Le trovi su **Supabase Dashboard → Settings → API**.

### 3. Collega il progetto Supabase

```bash
supabase login          # apre il browser per autenticarti
supabase link           # collega la cartella locale al progetto remoto
```

Quando chiede il project ref, incolla l'ID che trovi su Supabase Dashboard → Settings → General.

### 4. Applica le migrazioni

```bash
supabase db push
```

Questo esegue tutte le migrazioni in `supabase/migrations/` sul DB remoto.
Per verificare che siano state applicate:

```bash
supabase migration list --linked
```

Tutte le migrazioni devono risultare "Applied".

### 5. Crea la prima organizzazione (tenant)

Il DB parte vuoto. Vai su **Supabase Dashboard → SQL Editor** e lancia:

```sql
INSERT INTO organizations (name, slug, plan)
VALUES ('Nome Ristorante', 'nome-ristorante', 'starter');
```

Lo `slug` corrisponde alla URL pubblica: `/prenota/nome-ristorante`.

### 6. Avvia il dev server

```bash
npm run dev
# → http://localhost:5173
```

Le route disponibili in locale:
- `/login` — pannello di login admin
- `/prenota/<slug>` — form prenotazione pubblico
- `/invite/<token>` — registrazione nuovo admin via invito
- `/admin` — dashboard (richiede login)

## Popolare il DB con dati di test

```bash
# Richiede TENANT_SLUG e SUPABASE_SERVICE_ROLE_KEY in .env.local

npm run seed:booking-menu-full   # prenotazione con menu completo
npm run seed:booking-table       # prenotazione semplice tavolo
```

## Build di produzione

```bash
npm run build
# Output in dist/
```

Per testare la build localmente:

```bash
npm run preview
# → http://localhost:4173
```

## Deploy su Vercel

1. Collega il repository a Vercel (GitHub integration o `vercel` CLI)
2. Aggiungi le variabili d'ambiente in **Vercel Dashboard → Settings → Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Vercel rileva automaticamente Vite e fa il build
4. Le route SPA sono gestite da `vercel.json` incluso nel repo

## Deploy Edge Functions

Le Edge Functions si deployano separatamente tramite Supabase CLI:

```bash
supabase functions deploy create-booking
supabase functions deploy validate-invite
```

Per impostare i segreti delle funzioni (non servono per queste due, usano `SUPABASE_SERVICE_ROLE_KEY` automaticamente):

```bash
supabase secrets set CHIAVE=valore
```

## Troubleshooting

**"Variabili d'ambiente Supabase mancanti"** — `.env.local` non è stato creato o le variabili non hanno il prefisso `VITE_`.

**"Organizzazione non trovata per slug"** — lo slug nell'URL non corrisponde a nessuna riga nella tabella `organizations`. Verifica con `SELECT * FROM organizations` in SQL Editor.

**Login fallisce con "Utente non autorizzato"** — l'utente esiste in Supabase Auth ma non nella tabella `admin_users`. Aggiungi la riga manualmente o usa il flusso di invito.

**Prenotazioni arrivano ma le email non partono** — la Edge Function `send-email` non è ancora implementata. Questo è un issue noto (vedi `docs/EDGE_FUNCTIONS.md`).

**Cache PWA aggressiva su Vercel preview** — esegui un hard refresh (Ctrl+Shift+R) o svuota la cache del Service Worker da DevTools → Application → Service Workers.
