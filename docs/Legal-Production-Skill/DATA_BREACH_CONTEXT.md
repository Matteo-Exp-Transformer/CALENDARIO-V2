# Data Breach — context skill

## Cos'è "data breach"

Qualsiasi evento che comporta accidentale o illecita distruzione, perdita, modifica, divulgazione o accesso non autorizzato ai dati personali.

Esempi:
- Hack al DB (SQL injection riuscita, credenziali rubate)
- Errore admin che fa `DROP TABLE` senza backup
- Service role key esposta su GitHub pubblico
- Phishing su account owner Supabase
- Backup non cifrato rubato

---

## Obblighi GDPR

| Scenario | Obbligo | Tempo |
|---|---|---|
| Breach con rischio per diritti utenti | Notifica al Garante | **72 ore** |
| Breach con alto rischio | Notifica anche agli utenti coinvolti | "senza ingiustificato ritardo" |
| Breach senza rischio | Registro interno (non notifica) | — |

Multe per mancata notifica: fino a 10M€ o 2% fatturato globale.

---

## Runbook (file `docs/legal/runbook-data-breach.md`)

Quando l'agente lo genera, deve includere:

### Step 0 — Confinamento (primi 30 min)
- Identificare attacco in corso o concluso
- Rotare immediatamente: service_role key, password admin Supabase, password Vercel
- Se sospetto compromesso DB: revocare token sessione attivi (`auth.users` → sign out all)
- Se sospetto codice: bloccare deploy automatici Vercel

### Step 1 — Valutazione (prime 4 ore)
- Cosa è stato esposto?
- Quanti utenti? Quali dati?
- È ancora in corso o si è fermato?
- Documentare TUTTO con timestamp (servirà per la notifica)

### Step 2 — Notifica Garante (entro 72h)
- Verificare URL aggiornata: cercare "garanteprivacy.it notifica violazione"
- Form online — compilare con dati raccolti in Step 1
- Conservare ricevuta

### Step 3 — Notifica utenti (se alto rischio)
- Email a tutti gli interessati coinvolti
- Template breach minimo: cosa è successo, quando, quali dati, cosa stiamo facendo, contatti per chiarimenti

### Step 4 — Notifica clienti ristoranti
- Loro sono Titolari → DEVONO sapere → devono a loro volta valutare se notificare al Garante
- Email/PEC a ogni ristorante coinvolto entro 24h dalla scoperta

### Step 5 — Post-mortem
- Cosa è andato storto?
- Cosa cambia in procedure / codice / config
- Aggiornare runbook

---

## Contatti utili da tenere nel runbook

- Garante Privacy: 06 696771 / protocollo@gpdp.it
- Supabase support: emergency channel del piano (Pro+)
- Avvocato privacy di fiducia (DA TROVARE — vedi `LEGAL_STATE_CONTEXT.md`)

---

## Test runbook

Almeno 1x/anno: simulazione tabletop con timer di 72h.
Se il runbook è incompleto o disallineato → aggiornarlo.
