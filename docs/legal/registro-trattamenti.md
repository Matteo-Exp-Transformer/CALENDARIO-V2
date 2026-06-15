# Registro delle attività di trattamento (art. 30 GDPR) — BOZZA

> ⚠️ **BOZZA da validare con commercialista/consulente privacy prima dell'uso ufficiale** (FU-LEGAL-2).
> Base ragionata da sviluppatore senior dai dati reali dell'app (`DATA_INVENTORY_CONTEXT.md`,
> `LEGAL_STATE_CONTEXT.md`). **Non** sostituisce un parere professionale.
>
> Versione: **v0.1 (bozza)** · Ultima modifica: **2026-06-15** · Fonte dati: `DATA_INVENTORY_CONTEXT.md` (2026-06-12)

---

## 0. Titolare e ruoli

| Ruolo | Soggetto |
|---|---|
| **Titolare del trattamento** (chi decide perché e come trattare i dati) | Per i dati **dei clienti finali**: il **ristorante Cliente**. Per i dati **degli admin/contratto**: `<Nome/Ragione sociale Fornitore>`, P.IVA `<P.IVA>`. |
| **Responsabile del trattamento** (chi tratta per conto del Titolare) | `<Fornitore PrenotaZen>` rispetto ai dati dei clienti finali (regolato dal DPA art. 28). |
| **Sub-responsabili** | Vedi `sub-processors.md`. |
| **Contatto privacy** | `matteo.sistemigestionali@gmail.com` (temporaneo; futuro `privacy@<dominio>`). |

> Nota: nel SaaS il **ristorante** è Titolare dei dati dei suoi clienti; il **Fornitore** è
> Responsabile. Questo registro copre i trattamenti svolti **dal Fornitore** come Responsabile
> (e come Titolare per i dati di contratto/sicurezza). Ogni ristorante Cliente dovrebbe tenere il
> proprio registro come Titolare.

---

## 1. Attività di trattamento

### T1 — Gestione richieste di prenotazione
- **Finalità:** raccogliere e gestire le prenotazioni dei clienti finali del ristorante.
- **Categorie di interessati:** clienti finali del ristorante.
- **Categorie di dati:** nome, email, telefono; **preferenze/restrizioni alimentari** (potenziali dati
  di salute, art. 9 — allergie/intolleranze); richieste libere; data/ora/numero ospiti.
- **Base giuridica:** esecuzione del contratto/misure precontrattuali (prenotazione) + **consenso**
  per i dati alimentari particolari (checkbox Privacy Policy).
- **Origine:** form pubblico `/prenota/:slug`.
- **Conservazione:** ⚠️ **oggi illimitata** (nessun job di cancellazione automatica su
  `booking_requests`). **Da decidere:** cleanup a `<es. 24 mesi>` o dichiarazione esplicita di
  retention. Decisione → aggiornare qui + Privacy Policy.
- **Storage:** tabella `booking_requests` (Supabase, region Irlanda). Visibilità ristretta da RLS al
  solo tenant.

### T2 — Anagrafica clienti (CRM)
- **Finalità:** gestione della clientela del ristorante (storico, note).
- **Interessati:** clienti finali. **Dati:** nome, email, telefono, note libere, origine.
- **Base giuridica:** legittimo interesse (gestione clientela); per usi marketing futuri servirà
  consenso dedicato.
- **Conservazione:** ⚠️ illimitata oggi — stessa decisione di T1.
- **Storage:** tabella `customers`.

### T3 — Account amministratori ristoranti
- **Finalità:** erogazione del servizio SaaS (login, gestione).
- **Interessati:** titolari/staff dei ristoranti Clienti. **Dati:** email, nome, credenziali (hash gestito
  da Supabase Auth), ultimo accesso.
- **Base giuridica:** esecuzione del contratto B2B.
- **Conservazione:** durata del contratto + obblighi fiscali (`<es. 10 anni>` per i dati collegati alla
  fatturazione).
- **Storage:** `admin_users`, `auth.users` (Supabase Auth), `invite_tokens` (inviti).

### T4 — Sicurezza e prevenzione abusi
- **Finalità:** protezione del form pubblico da abusi/attacchi (rate limiting e ban IP).
- **Interessati:** chiunque invii richieste al form pubblico. **Dati:** **indirizzo IP** (dato
  personale, C-582/14), endpoint, timestamp, motivo ban.
- **Base giuridica:** legittimo interesse (sicurezza informatica).
- **Conservazione:** automatica e breve — `rate_limits` cancellati oltre 1 ora; `ip_blacklist`
  ban 24h e righe scadute cancellate (cron `pg_cron`, migr. `048`).
- **Storage:** `rate_limits`, `ip_blacklist`.

### T5 — Email transazionali (quando attivo)
- **Finalità:** invio email di conferma/rifiuto/cancellazione prenotazione.
- **Stato:** ⚠️ **non ancora attivo in produzione** (Edge Function `send-email` + provider non
  configurato; `VITE_ENABLE_SEND_EMAIL` OFF in prod). Quando attivo: aggiornare T5 + `sub-processors.md`
  + Privacy Policy con il provider scelto (region, DPA), e definire retention di `email_logs`
  (proposta: 12 mesi).
- **Dati previsti:** email destinatario, oggetto, esito invio.

### T6 — Hosting e log tecnici
- **Finalità:** erogazione tecnica (hosting frontend e backend).
- **Dati:** IP, user agent, URL (log HTTP Vercel); dati applicativi su Supabase.
- **Base giuridica:** legittimo interesse / esecuzione contratto.
- **Conservazione log Vercel:** secondo piano (≈7–30 giorni).

---

## 2. Misure di sicurezza (sintesi)

- RLS multi-tenant + FORCE RLS sulle tabelle con PII; policy admin per tenant.
- Service role key ruotata; MFA sull'owner Supabase; leaked-password protection ON.
- Rate limiting (3 req/min) + ban IP automatico sul form pubblico.
- Trasporto cifrato (HTTPS); DB primario in **UE (Irlanda)**.
- Dettaglio tecnico: migrazione `026_security_hardening`, `027_ip_blacklist`, `048` cleanup.

## 3. Trasferimenti extra-UE

DB primario in UE (Irlanda). Sub-processor extra-UE (vedi `sub-processors.md`) coperti dal **DPA
Supabase** con Clausole Contrattuali Standard (SCC) + addendum UK/Svizzera.

---

> **Da completare con il professionista:** decisione retention T1/T2; conferma basi giuridiche;
> eventuale necessità di **DPIA** per i dati alimentari (art. 9). Aggiornare a ogni nuova colonna PII
> (vedi checklist in `DATA_INVENTORY_CONTEXT.md`).
