# Registro Trattamenti art. 30 GDPR — context skill

## Cos'è

Documento INTERNO obbligatorio per legge (anche per piccole imprese che trattano dati su larga scala). Va esibito al Garante in caso di ispezione.

NON è pubblicato — sta in repo come `docs/legal/registro-trattamenti.md`.

---

## Struttura (per ogni "trattamento")

Per ogni finalità distinta (prenotazione, CRM, account admin, log) una sezione con:

1. Nome trattamento
2. Titolare (chi è — può essere ristorante o Matteo a seconda)
3. Responsabile (se applicabile)
4. Finalità
5. Base giuridica
6. Categorie interessati (clienti finali / admin / ecc.)
7. Categorie dati (riferimento a `DATA_INVENTORY_CONTEXT.md`)
8. Categorie destinatari (Supabase, Vercel, ecc.)
9. Trasferimenti extra-UE + garanzie
10. Tempi cancellazione
11. Misure di sicurezza (tecniche e organizzative)

---

## Trattamenti minimi che CalendarBackup-v2 ha

1. **Prenotazione tavolo / evento** — Titolare ristorante, Responsabile Matteo
2. **CRM clienti** — Titolare ristorante
3. **Account admin SaaS** — Titolare Matteo
4. **Sicurezza/anti-abuse (rate_limits, log)** — Titolare Matteo
5. **Email transazionali** — Titolare ristorante, Responsabile Matteo; inviate tramite Brevo
6. **Campagne marketing via email** — Titolare ristorante, Responsabile Matteo; solo verso
   destinatari con consenso marketing separato e con disiscrizione disponibile

---

## Aggiornamento

Ogni volta che:
- aggiungi una nuova feature che tratta dati per uno scopo nuovo
- cambi base giuridica
- aggiungi un sub-processor
- cambi tempi di conservazione

→ aggiornare il registro entro 30 giorni dal cambio.

Per i trattamenti email indicare anche Brevo fra i destinatari/sub-responsabili, i dati inviati
(indirizzo, oggetto e contenuto necessario all'invio), il consenso per il marketing e l'attuale
assenza di una cancellazione automatica per log, campagne e token di disiscrizione. Localizzazione,
garanzie di trasferimento e DPA Brevo restano da verificare con l'avvocato.

Bump versione + data + nota in cambio in fondo al file.
