# PLAN-DB-003 — Deploy Edge Function `console-admin` su TEST

**Stato:** da eseguire · **Ambiente:** TEST docnnernvp · **Data:** 2026-06-22

## Obiettivo

La Console super-admin deve poter scrivere dati nel DB (edition, feature flag, restaurant_settings)
senza esporre la service role nel browser. La soluzione è una **Edge Function Supabase** che:
- verifica il JWT dell'utente e la sua email nella allowlist server-side,
- limita le scritture ai soli tenant sandbox,
- usa la service role **solo lato server** (iniettata da Supabase nel runtime Deno).

Questo plan spiega come Matteo deploya la function e imposta i secret necessari.
**L'agente NON ha eseguito il deploy** (DEC-021).

---

## Cosa è stato preparato dall'agente

| File | Descrizione |
|------|-------------|
| `console/supabase/functions/console-admin/index.ts` | Codice Deno della Edge Function |
| `console/src/lib/consoleAdminClient.ts` | Helper TypeScript (browser) per chiamarla |

---

## Prerequisiti

- Supabase CLI installata: `npm install -g supabase` oppure `brew install supabase/tap/supabase`
- Accesso al progetto TEST `docnnernvp` (devi essere loggato con `supabase login`)
- Verificare di non essere accidentalmente sul progetto PROD `rwuxgvld`:
  ```bash
  supabase projects list
  ```
  Deve comparire il progetto con ref `docnnernvp`.

---

## Passo 1 — Collegare il progetto TEST alla CLI

```bash
# Dalla root del repo CALENDARIO-V2
supabase link --project-ref docnnernvp
```

Inserisci la password del DB quando richiesta.

---

## Passo 2 — Impostare i secret (variabili d'ambiente della function)

La function legge tre variabili d'ambiente:

| Variabile | Iniettata da Supabase | Come impostarla |
|-----------|----------------------|-----------------|
| `SUPABASE_URL` | **Automatica** — Supabase la inietta nel runtime | Non serve impostarla |
| `SUPABASE_ANON_KEY` | **Automatica** — Supabase la inietta nel runtime | Non serve impostarla |
| `SUPABASE_SERVICE_ROLE_KEY` | **Automatica** — Supabase la inietta nel runtime | Non serve impostarla |
| `CONSOLE_ALLOWED_EMAILS` | **Manuale** — la imposti tu | Vedi sotto |
| `CONSOLE_CORS_ORIGIN` | Opzionale — default `*` | Vedi sotto |

### CONSOLE_ALLOWED_EMAILS (obbligatoria)

Lista delle email autorizzate a chiamare la function, separate da virgola.
Deve contenere l'email con cui Matteo fa login alla Console (quella registrata in Supabase Auth).

```bash
supabase secrets set CONSOLE_ALLOWED_EMAILS="matteo@tuamail.com" --project-ref docnnernvp
```

Per aggiungere più email:
```bash
supabase secrets set CONSOLE_ALLOWED_EMAILS="matteo@tuamail.com,altro@example.com" --project-ref docnnernvp
```

> **IMPORTANTE:** usa l'email esatta con cui sei registrato in Supabase Auth del progetto TEST.
> Puoi verificarla in: Supabase Dashboard → docnnernvp → Authentication → Users.

### CONSOLE_CORS_ORIGIN (opzionale, consigliato in produzione)

Origine del browser che chiama la function. In sviluppo locale puoi lasciare il default `*`.
In produzione (quando la Console è deployata su un dominio):

```bash
supabase secrets set CONSOLE_CORS_ORIGIN="https://console.tuodominio.com" --project-ref docnnernvp
```

---

## Passo 3 — Deploy della function

La function si trova nella sottocartella **della Console**, non nella `supabase/` di Matteo.

```bash
# Dalla root del repo
supabase functions deploy console-admin \
  --project-ref docnnernvp \
  --import-map console/supabase/functions/console-admin/index.ts
```

Oppure, se la CLI riconosce la cartella direttamente:
```bash
supabase functions deploy console-admin \
  --project-ref docnnernvp \
  --no-verify-jwt
```

> **Nota `--no-verify-jwt`:** di default Supabase verifica il JWT del chiamante automaticamente
> prima di eseguire il codice. In questo caso la function fa già la verifica internamente
> (con `userClient.auth.getUser()`), quindi puoi usare `--no-verify-jwt` per avere
> il controllo completo sull'errore restituito.
> Senza il flag, Supabase restituisce un errore generico 401 prima che la function
> possa rispondere con un messaggio chiaro.

### Percorso alternativo (se la CLI non trova la function dalla root)

```bash
# Entra nella cartella Console e linka di nuovo il progetto
cd console
supabase link --project-ref docnnernvp
supabase functions deploy console-admin --no-verify-jwt
cd ..
```

---

## Passo 4 — Ricavare l'URL della function e aggiornare il .env.local della Console

Dopo il deploy, l'URL della function è:
```
https://docnnernvp.supabase.co/functions/v1/console-admin
```

Aggiungilo al file `console/.env.local` (crea il file se non esiste):
```
VITE_CONSOLE_ADMIN_FUNCTION_URL=https://docnnernvp.supabase.co/functions/v1/console-admin
```

> `console/.env.local` non è committato (è in `.gitignore`). Ogni sviluppatore lo configura localmente.

---

## Passo 5 — Verifica del deploy

### 5a. Verifica che la function esista

```bash
supabase functions list --project-ref docnnernvp
```

Deve comparire `console-admin`.

### 5b. Test senza JWT (deve restituire 401)

```bash
curl -X POST https://docnnernvp.supabase.co/functions/v1/console-admin \
  -H "Content-Type: application/json" \
  -d '{"action":"update_edition","tenant_id":"4c694cb8-66af-478f-afd2-8719f07d64b4","edition":"pro"}'
```

Risposta attesa:
```json
{"error":"Authorization header mancante o malformato."}
```
HTTP status: 401

### 5c. Test con JWT reale (ottieni il token dalla Console loggata)

Nella Console, apri i DevTools del browser → Console e lancia:
```javascript
const { data } = await window.__supabase.auth.getSession()
console.log(data.session.access_token)
```

Poi usa il token nel curl:
```bash
curl -X POST https://docnnernvp.supabase.co/functions/v1/console-admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <IL_TUO_TOKEN>" \
  -d '{"action":"update_edition","tenant_id":"4c694cb8-66af-478f-afd2-8719f07d64b4","edition":"pro"}'
```

Risposta attesa (se l'email è in allowlist):
```json
{"ok":true,"action":"update_edition","tenant_id":"4c694cb8-66af-478f-afd2-8719f07d64b4","edition":"pro"}
```

### 5d. Test sandbox guard (deve restituire 403 per tenant non sandbox)

```bash
curl -X POST https://docnnernvp.supabase.co/functions/v1/console-admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <IL_TUO_TOKEN>" \
  -d '{"action":"update_edition","tenant_id":"id-di-un-tenant-reale","edition":"pro"}'
```

Risposta attesa:
```json
{"error":"Scrittura non consentita sul tenant \"id-di-un-tenant-reale\". Solo i tenant sandbox console-classic e console-pro sono scrivibili da questa function."}
```

### 5e. Verifica i log della function

```bash
supabase functions logs console-admin --project-ref docnnernvp
```

Oppure: Supabase Dashboard → docnnernvp → Edge Functions → console-admin → Logs.

---

## Tabelle/colonne toccate (al momento del primo uso reale)

La function **scrive** su:
- `organizations.edition` — UPDATE (solo sandbox)
- `tenant_features` — UPSERT su `(tenant_id, feature_key)` con colonne `(tenant_id, feature_key, enabled)` (solo sandbox)
- `restaurant_settings` — UPSERT su `(tenant_id, setting_key)` con colonne `(tenant_id, setting_key, setting_value)` (solo sandbox)

**Nessuna modifica di schema**: le tabelle esistono già. Questo plan riguarda solo il deploy.

---

## Impatto / rischi

- **Service role bypassata dalla RLS**: il client admin della function usa la service role,
  che ignora la RLS. Il guard tenant-sandbox nel codice è la prima e principale protezione.
  Non rimuovere il guard senza discuterlo.
- **CONSOLE_ALLOWED_EMAILS vuota**: se dimentichi di impostare il secret, la function rifiuta
  tutte le richieste con 403 (fail-safe documentato nel codice).
- **CORS `*` in sviluppo**: il default `*` è accettabile in sviluppo; in produzione imposta
  `CONSOLE_CORS_ORIGIN` all'URL reale della Console.
- **La cartella `console/supabase/` è separata da `supabase/`** (la cartella di Matteo):
  la CLI deploy in `console/supabase/functions/` non tocca le Edge Functions di Matteo.
  Verifica sempre con `supabase functions list` di essere sul progetto TEST.

---

## Note per Matteo

- Prima di eseguire: conferma di avere la Supabase CLI installata (`supabase --version`).
- L'email in `CONSOLE_ALLOWED_EMAILS` deve corrispondere **esattamente** all'email in
  Supabase Auth del progetto TEST (case-insensitive, ma senza spazi extra).
- Se cambi email o aggiungi un secondo admin, ri-esegui `supabase secrets set` con la
  lista aggiornata.
- La function usa `--no-verify-jwt` per gestire internamente l'errore di autenticazione
  con messaggi localizzati. Se preferisci lasciare la verifica JWT a Supabase, rimuovi
  il flag ma i messaggi di errore 401 saranno quelli generici di Supabase.
- Dopo il deploy: aggiorna `VITE_CONSOLE_ADMIN_FUNCTION_URL` nel `.env.local` della Console
  (vedi Passo 4). Senza questa variabile l'helper client restituisce un errore chiaro.
