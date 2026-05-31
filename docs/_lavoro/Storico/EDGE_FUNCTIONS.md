# Edge Functions Supabase

Le Edge Functions sono eseguite su Deno (runtime Supabase) e deployate separatamente dal frontend.
Sono in `supabase/functions/<nome>/index.ts`.

## `create-booking` — Crea prenotazione pubblica

**Path:** `supabase/functions/create-booking/index.ts`
**Metodo:** POST
**Autenticazione:** nessuna (funzione pubblica, chiamata dal form `/prenota/:slug`)

### Input (JSON body)

| Campo | Tipo | Obbligatorio | Note |
|-------|------|-------------|------|
| `tenantSlug` | string | Sì | Slug dell'organizzazione |
| `client_name` | string | Sì | Max 200 caratteri |
| `desired_date` | string | Sì | Formato YYYY-MM-DD |
| `num_guests` | number | Sì | >= 1 |
| `client_email` | string | No | Default: stringa vuota (NOT NULL in DB) |
| `client_phone` | string | No | |
| `desired_time` | string | No | |
| `special_requests` | string | No | |
| `booking_type` | string | No | |
| `event_type` | string | No | |
| `menu_selection` | object | No | JSONB |
| `menu_total_per_person` | number | No | |
| `menu_total_booking` | number | No | |
| `dietary_restrictions` | object | No | JSONB |
| `preset_menu` | string | No | |
| `placement` | string | No | |
| `menu` | string | No | |

### Output

**Successo (201):**
```json
{ "success": true, "booking": { ...campi del record inserito } }
```

**Errori:**
- 400: campo obbligatorio mancante o formato non valido
- 404: slug non corrisponde a nessuna organizzazione
- 429: limite annuale raggiunto o rate limit IP (max 5 richieste/minuto per IP)
- 500: errore database

### Logica interna

1. Valida i campi obbligatori
2. Risolve l'organizzazione dallo slug
3. Controlla il limite annuale (`tenant_usage.booking_requests_count`)
4. Controlla il rate limit per IP (tabella `rate_limits`, finestra 60 secondi)
5. Inserisce il record in `booking_requests` con `status = 'pending'` e `booking_source = 'public'`
6. Registra l'IP in `rate_limits`

### Segreti richiesti

Nessun segreto aggiuntivo — la funzione usa `SUPABASE_SERVICE_ROLE_KEY` iniettato automaticamente da Supabase.

---

## `validate-invite` — Validazione token invito e registrazione admin

**Path:** `supabase/functions/validate-invite/index.ts`
**Metodi:** GET, POST
**Autenticazione:** nessuna (funzione pubblica)

### GET — Valida il token

**Query param:** `token=<valore>`

**Output (200):**
```json
{ "valid": true, "organizationName": "Nome Ristorante", "email": "admin@esempio.it" }
```
Il campo `email` è presente solo se il token è stato creato con un'email specifica.

**Errori:**
- 400: token mancante
- 404: token non valido, scaduto, o già usato

### POST — Registra il nuovo admin

**Body JSON:**
```json
{ "token": "...", "email": "nuovo@admin.it", "password": "minimo8caratteri" }
```

**Logica interna:**
1. Valida i campi
2. Verifica che il token sia valido e non scaduto
3. Se il token ha un'email specifica, verifica che combaci
4. Crea l'utente in Supabase Auth (`email_confirm: true` — no verifica email)
5. Inserisce il record in `admin_users` con `tenant_id` dall'invite_token
6. Se l'insert in `admin_users` fallisce, elimina l'utente Auth appena creato (rollback parziale)
7. Segna il token come usato (`used_at = NOW()`)

**Output (201):**
```json
{ "success": true, "message": "Registrazione completata" }
```

### Test in locale

```bash
# Avvia il dev server Edge Functions
supabase functions serve validate-invite --env-file .env.local

# Test GET
curl "http://localhost:54321/functions/v1/validate-invite?token=<token>"

# Test POST
curl -X POST "http://localhost:54321/functions/v1/validate-invite" \
  -H "Content-Type: application/json" \
  -d '{"token":"<token>","email":"test@test.it","password":"password123"}'
```

---

## `send-email` — FUNZIONE MANCANTE

Questa funzione è **referenziata nel codice frontend** (`src/lib/email.ts`) ma **non esiste** nel repo.

Il file `src/lib/email.ts` chiama:
```
POST ${SUPABASE_URL}/functions/v1/send-email
```

Finché questa funzione non viene creata e deployata, **nessuna email viene inviata** dall'applicazione. Le prenotazioni vengono salvate correttamente nel DB, ma il cliente non riceve notifiche.

### Specifica per l'implementazione futura

**Input atteso (JSON body):**
```json
{
  "to": "cliente@esempio.it",
  "subject": "Conferma prenotazione",
  "html": "<p>...</p>",
  "bookingId": "uuid-...",
  "emailType": "booking_confirmation"
}
```

**Requisiti:**
- Usare [Resend](https://resend.com) come provider email
- Secret `RESEND_API_KEY` nei segreti Supabase
- Verificare il dominio mittente su Resend
- Loggare il risultato in `email_logs` (successo/fallimento)
- Gestire sia singola email che array di destinatari (max 50)

**Per abilitare l'invio email dal frontend:**
1. Implementare la funzione
2. Deployarla: `supabase functions deploy send-email`
3. Impostare il secret: `supabase secrets set RESEND_API_KEY=re_...`
4. Aggiungere `VITE_ENABLE_SEND_EMAIL=true` nelle variabili d'ambiente Vercel

---

## Deploy di una funzione

```bash
supabase functions deploy <nome-funzione>
```

Tutte le funzioni in `supabase/functions/` vengono versionate insieme al codice frontend.
