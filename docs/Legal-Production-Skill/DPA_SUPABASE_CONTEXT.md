# DPA con Supabase — context skill

## Cos'è e perché serve

DPA = Data Processing Agreement = contratto tra TE (Matteo) e Supabase in cui Supabase si impegna a trattare i dati per tuo conto rispettando il GDPR.

Senza DPA con Supabase, non puoi legalmente vendere a clienti UE.

---

## Procedura

1. **URL ufficiale** (verifica prima online — può cambiare): https://supabase.com/legal/dpa
2. Login dashboard Supabase → Account → Compliance / Legal
3. Accettare e compilare DPA standard (autoservito, 2 min)
4. Scaricare PDF firmato
5. Salvare in `docs/_lavoro/Per matteo/DPA-Supabase-firmato-<data>.pdf`
6. Aggiornare `LEGAL_STATE_CONTEXT.md` FASE 1

---

## Cosa contiene tipicamente un DPA Supabase

- Identità delle parti
- Oggetto del trattamento (hosting DB / Auth / Functions per tuo conto)
- Durata
- Natura e finalità del trattamento
- Tipologia dati (categorie generiche)
- Categorie di interessati
- Obblighi di sicurezza Supabase
- Sub-processor di Supabase (AWS, Cloudflare, ecc.) + clausola notifica cambi
- SCC (Standard Contractual Clauses) per trasferimenti USA-UE
- Audit rights
- Notifica data breach a te entro X ore
- Cancellazione dati a fine contratto

---

## Cosa fare con il DPA firmato

- Conservare PDF per durata contratto + 10 anni
- Esibirlo a clienti che lo richiedono (alcuni ristoranti più grandi lo chiedono)
- Verificare 1x/anno se Supabase ha aggiornato la versione → eventualmente rifirmare

---

## Sub-processor di Supabase da menzionare nella TUA Privacy Policy

Supabase a sua volta usa sub-processor (questi diventano i "sub-sub-processor" tuoi). Tipicamente:
- AWS (infrastruttura)
- Cloudflare (CDN/WAF)
- Stripe (billing — se applicabile)

URL aggiornata sub-processor Supabase: https://supabase.com/legal/subprocessors (VERIFICARE online).

Non devi elencarli tutti nella tua Privacy Policy — basta dire "Supabase e i suoi sub-processor, lista aggiornata su supabase.com/legal/subprocessors".

---

## Errori comuni

- ❌ Non firmare il DPA pensando "il rapporto è solo commerciale" — il GDPR pretende un contratto scritto su carta/PDF
- ❌ Firmare il DPA e dimenticarsi di MENZIONARE Supabase nella propria Privacy Policy
- ❌ Aspettare che un cliente lo chieda — molti non lo chiedono ma poi in caso di breach sei tu il responsabile
