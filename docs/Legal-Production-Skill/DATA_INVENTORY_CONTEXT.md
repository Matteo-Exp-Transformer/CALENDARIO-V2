# Data Inventory — cosa raccoglie davvero CalendarBackup-v2

> Aggiornato: 2026-05-23
> Fonte verità per Privacy Policy + Registro Trattamenti.
> Ogni nuova migrazione che aggiunge PII deve aggiornare questo file.

---

## Come si legge

Per ogni tabella DB / sistema esterno: che dati personali contiene, base
giuridica, retention attesa vs reale, dove finiscono, chi li può vedere.

---

## Tabelle DB con PII (Personal Identifiable Information)

### `booking_requests` — Richieste di prenotazione
**Chi**: Cliente finale del ristorante (es. Mario che prenota).

| Colonna | Tipo dato | Sensibilità | Esempio |
|---|---|---|---|
| `client_name` | nome | Bassa | "Mario Rossi" |
| `client_email` | email | Media | "mario@gmail.com" |
| `client_phone` | telefono | Media | "+39 333..." |
| `dietary_restrictions` | preferenze alimentari (JSONB) | **ALTA** ⚠️ | "allergico ai crostacei" → dato salute |
| `special_requests` | testo libero | Media | "tavolo angolo" — può contenere PII inaspettata |
| `desired_date` / `desired_time` / `num_guests` | metadati | Bassa | — |
| `confirmed_start` / `confirmed_end` | metadati | Bassa | — |

⚠️ **`dietary_restrictions` contiene potenzialmente dati di salute** (allergie, intolleranze, diete mediche). Sotto GDPR art. 9 sono "categorie particolari" → richiedono base giuridica rafforzata (consenso esplicito).

**Base giuridica**: consenso (checkbox Privacy Policy) + esecuzione contratto (prenotazione).
**Retention reale**: ∞ (nessun job di cleanup). **Va aggiunto** un cleanup a 24 mesi o dichiarare retention illimitata.
**Visibilità**: solo admin del tenant (RLS).

### `customers` — Anagrafica CRM
**Chi**: Cliente finale (sincronizzato automaticamente da `booking_requests`).

| Colonna | Tipo dato | Note |
|---|---|---|
| `name`, `email`, `phone` | duplicati di booking_requests | Per CRM/marketing futuro |
| `notes` | testo libero | Note manuali admin sul cliente |
| `source` | "synced" / manuale | — |

**Base giuridica**: legittimo interesse (gestione clientela) — DEBOLE, valutare consenso esplicito a marketing in futuro.
**Retention reale**: ∞.

### `admin_users` — Admin ristoranti
**Chi**: Proprietario/staff ristorante cliente di Matteo.

| Colonna | Tipo dato |
|---|---|
| `email` | email lavoro admin |
| `name` | nome admin |

**Base giuridica**: esecuzione contratto B2B (servizio SaaS).
**Retention**: per durata contratto + 10 anni (obblighi fiscali).
**Visibilità**: RLS — admin vede solo se stesso (post-026).

### `invite_tokens` — Token registrazione admin
PII: `email` invitato.
**Retention**: scade dopo `expires_at`, ma riga resta. **Aggiungere cleanup** dei token usati/scaduti.

### `auth.users` (Supabase Auth)
PII: email + password hashed + ultimo login.
Gestita da Supabase. Retention secondo contratto.

### `rate_limits` — Anti-abuse
| Colonna | PII | Note |
|---|---|---|
| `ip_address` | **SÌ** ⚠️ | IP è dato personale GDPR |
| `endpoint`, `requested_at` | metadati | — |

⚠️ **L'indirizzo IP è dato personale** (Corte Giustizia UE C-582/14). Va dichiarato in Privacy Policy.
**Base giuridica**: legittimo interesse (sicurezza, anti-abuse).
**Retention reale**: ∞ — c'è funzione `cleanup_rate_limits()` ma non schedulata. **Va schedulata** (es. cron settimanale per cancellare righe >30 giorni).
**Soglia attiva**: max 3 richieste/min per IP (Edge Function `create-booking`, deploy 2026-05-23).

### `ip_blacklist` — Ban automatico IP per abuso (aggiunta 2026-05-23)
| Colonna | PII | Note |
|---|---|---|
| `ip_address` | **SÌ** ⚠️ | Stesso discorso di rate_limits |
| `blocked_at`, `expires_at`, `reason` | metadati | — |

**Base giuridica**: legittimo interesse (sicurezza informatica, prevenzione attacchi).
**Trigger ban**: se IP fa ≥6 richieste in 10 min (= 2 sforamenti consecutivi del rate limit 3/min) → ban 24h.
**Retention**: auto-scadenza 24h via `expires_at`. La riga NON viene cancellata automaticamente — andrebbe schedulato un cleanup per cancellare righe con `expires_at < now() - 30 giorni` per non accumulare log indefinitamente.
**Da dichiarare in Privacy Policy** sez. 2 (dati raccolti automaticamente) e sez. 3 (finalità sicurezza).

### `email_logs` — Log invii email
Quando l'Edge Function `send-email` esisterà, conterrà log degli invii (destinatario, oggetto, esito).
Oggi 1 riga di test.
**Retention**: 12 mesi (proposta).

---

## Sistemi esterni / sub-processor

### Supabase Inc.
- **Cosa contiene**: tutto il DB sopra + Auth + log applicativi
- **Region**: ⚠️ DA VERIFICARE in dashboard
- **DPA**: in corso firma (2026-05-23)

### Vercel Inc.
- **Cosa contiene**: codice frontend statico + log accessi HTTP (IP + URL + user agent)
- **PII**: IP client + user agent
- **Retention log Vercel**: 30 giorni piano free / 7 giorni piano Pro free tier
- **DPA**: standard nei ToS

### Email provider (NON CONFIGURATO)
Quando aggiunto, qui dichiarare: nome (Resend/SendGrid/Postmark/...), cosa gli inviamo, region, DPA.

---

## Cookie e storage browser

### `localStorage`
Verifica con: `grep -rn "localStorage\|persistSession" src/`

| Chiave | Cosa contiene | Scadenza | Tecnico/profilazione |
|---|---|---|---|
| `sb-*-auth-token` | Token sessione Supabase admin | 1 settimana | Tecnico (necessario) |

### `sessionStorage`
Verifica `grep -rn "sessionStorage" src/`. Oggi: nessun uso significativo.

### Cookie HTTP
Solo cookie tecnici di Supabase Auth. **Nessun cookie di profilazione** → banner NON obbligatorio oggi (vedi `COOKIE_CONTEXT.md`).

---

## Trasferimenti extra-UE

Da verificare:
- Region Supabase prod (potrebbe essere USA)
- Region Vercel edge (sempre globale)
- Region email provider futuro

Se almeno uno è extra-UE → dichiarare in Privacy Policy + giustificare con SCC.

---

## Checklist quando aggiungi nuova feature

Domande da farsi:
1. La nuova feature aggiunge una COLONNA con PII? → aggiornare questo file + Privacy Policy
2. Manda dati a un servizio esterno nuovo? → aggiornare sub-processor + DPA
3. Crea cookie / localStorage nuovi? → aggiornare cookie inventory
4. Cambia retention di dati esistenti? → aggiornare retention
5. Aggiunge dati "sensibili" (salute, religione, biometrici, ecc.)? → richiede DPIA + consenso esplicito rafforzato

Se la risposta a una di queste è SÌ → apri sessione skill `legal-production` PRIMA del merge.
