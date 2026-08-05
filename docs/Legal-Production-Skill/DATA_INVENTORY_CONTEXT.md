# Data Inventory — cosa raccoglie davvero CalendarBackup-v2

> Aggiornato: 2026-08-05
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
| `marketing_consent` | consenso a email promozionali | Media | `true` solo dopo scelta esplicita |

⚠️ **`dietary_restrictions` contiene potenzialmente dati di salute** (allergie, intolleranze, diete mediche). Sotto GDPR art. 9 sono "categorie particolari" → richiedono base giuridica rafforzata (consenso esplicito).

**Base giuridica**: esecuzione di misure precontrattuali/contrattuali (prenotazione); consenso
esplicito separato per dati alimentari quando presenti; consenso separato e facoltativo per marketing.
**Retention reale**: ∞ (nessun job di cleanup). **Va aggiunto** un cleanup a 24 mesi o dichiarare retention illimitata.
**Visibilità**: solo admin del tenant (RLS).

### `customers` — Anagrafica CRM
**Chi**: Cliente finale (sincronizzato automaticamente da `booking_requests`).

| Colonna | Tipo dato | Note |
|---|---|---|
| `name`, `email`, `phone` | duplicati di booking_requests | Per CRM/marketing futuro |
| `notes` | testo libero | Note manuali admin sul cliente |
| `source` | "synced" / manuale | — |

**Base giuridica**: gestione del rapporto con il cliente; le email promozionali sono selezionabili
solo quando `marketing_consent = true` (consenso esplicito, art. 6.1.a GDPR).
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
**Retention runtime**: migrazione `048_schedule_rate_limits_cleanup.sql` applicata e verificata su TEST `docnnernvp` e PROD `rwuxgvld` il 12-06-26; cleanup orario via `pg_cron` cancella `rate_limits` più vecchi di 1 ora.
**Soglia attiva**: max 3 richieste/min per IP (Edge Function `create-booking`, deploy 2026-05-23).

### `ip_blacklist` — Ban automatico IP per abuso (aggiunta 2026-05-23)
| Colonna | PII | Note |
|---|---|---|
| `ip_address` | **SÌ** ⚠️ | Stesso discorso di rate_limits |
| `blocked_at`, `expires_at`, `reason` | metadati | — |

**Base giuridica**: legittimo interesse (sicurezza informatica, prevenzione attacchi).
**Trigger ban**: se IP fa ≥6 richieste in 10 min (= 2 sforamenti consecutivi del rate limit 3/min) → ban 24h.
**Retention runtime**: ban inattivo dopo 24h via `expires_at`; migrazione `048_schedule_rate_limits_cleanup.sql` applicata e verificata su TEST e PROD cancella le righe scadute da oltre 1 giorno.
**Da dichiarare in Privacy Policy** sez. 2 (dati raccolti automaticamente) e sez. 3 (finalità sicurezza).

### `email_logs` — Log invii email
Contiene destinatario, tipo di email, esito, timestamp, eventuale risposta/errore del provider e
riferimento alla prenotazione. Gli invii passano dall'Edge `send-email` a Brevo per email
transazionali e marketing.
**Retention reale**: nessun job di cleanup individuato. Un periodo di conservazione non è ancora
stato deciso né implementato.

### `email_campaigns` — Campagne marketing
Contiene nome, oggetto, corpo, link e lista di indirizzi destinatari (`recipient_emails`), oltre a
stato e date della campagna. Ogni locale può crearne al massimo 5; l'invio è consentito soltanto
per contatti con `marketing_consent = true`.
**Base giuridica**: consenso esplicito e facoltativo (art. 6.1.a GDPR).
**Retention reale**: nessun job di cleanup individuato.

### `unsubscribe_tokens` — Disiscrizione dalle campagne
Contiene un token opaco, email, locale e data d'uso per rendere effettiva la disiscrizione dalle
email marketing. Il token è creato lato server, non è accessibile dal client e la relativa Edge
imposta `marketing_consent = false`.
**Retention reale**: nessun job di cleanup individuato.

---

## Sistemi esterni / sub-processor

### Supabase Inc.
- **Cosa contiene**: tutto il DB sopra + Auth + log applicativi
- **Region**: West EU (Ireland), come registrato in `LEGAL_STATE_CONTEXT.md`
- **DPA**: firmato (riferimento e copia locale in `LEGAL_STATE_CONTEXT.md`)

### Vercel Inc.
- **Cosa contiene**: codice frontend statico + log accessi HTTP (IP + URL + user agent)
- **PII**: IP client + user agent
- **Retention log Vercel**: 30 giorni piano free / 7 giorni piano Pro free tier
- **DPA**: standard nei ToS

### Brevo (Sendinblue)
- **Cosa riceve**: indirizzo del destinatario, oggetto, contenuto HTML dell'email, nome/indirizzo
  del mittente e tipo dell'invio. Il contenuto può includere dati della prenotazione necessari alla
  comunicazione.
- **Finalità**: conferma/rifiuto e altre comunicazioni sulla prenotazione; campagne promozionali
  solo per contatti con consenso marketing.
- **DPA e localizzazione**: da verificare, archiviare e validare con l'avvocato prima di chiudere
  l'informativa e la lista pubblica dei sub-responsabili.

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
- Region Vercel edge (globale)
- Localizzazione e sub-responsabili Brevo

Se almeno uno è extra-UE → dichiarare in Privacy Policy + giustificare con SCC.

## Lacuna da chiudere nella Privacy Policy visibile ai clienti

`src/pages/privacy/PrivacyPolicyContent.tsx` descrive l'uso delle email e il consenso marketing,
ma nella lista dei sub-responsabili indica solo Supabase e Vercel. Manca quindi il fornitore che
riceve i dati per il recapito. Non modificare la pagina senza validazione legale. Proposta interna
per la relativa sezione: «Brevo (Sendinblue) — invio delle comunicazioni relative alla prenotazione
e, solo con consenso separato, delle comunicazioni promozionali via email.» Il legale deve
confermare ruolo, dati elencati, localizzazione e garanzie per eventuali trasferimenti.

Durante il confronto è emersa anche una seconda discrepanza, non modificata nella pagina: la sua
sezione sulla conservazione indica fino a 12 mesi per IP e log di sicurezza, mentre il cleanup reale
elimina `rate_limits` dopo 1 ora e le righe `ip_blacklist` scadute dopo 1 giorno. Per prenotazioni,
CRM e dati email non esiste invece un cleanup. Il legale deve approvare un testo che separi questi
casi e una policy di conservazione effettivamente applicabile.

---

## Checklist quando aggiungi nuova feature

Domande da farsi:
1. La nuova feature aggiunge una COLONNA con PII? → aggiornare questo file + Privacy Policy
2. Manda dati a un servizio esterno nuovo? → aggiornare sub-processor + DPA
3. Crea cookie / localStorage nuovi? → aggiornare cookie inventory
4. Cambia retention di dati esistenti? → aggiornare retention
5. Aggiunge dati "sensibili" (salute, religione, biometrici, ecc.)? → richiede DPIA + consenso esplicito rafforzato

Se la risposta a una di queste è SÌ → apri sessione skill `legal-production` PRIMA del merge.
