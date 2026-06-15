# Sub-processor (responsabili esterni) — PrenotaZen — BOZZA

> ⚠️ **BOZZA da validare e poi pubblicare** (FU-LEGAL-2). Elenca i fornitori esterni che trattano dati
> personali per erogare il Servizio. Va **tenuta sincronizzata** con i servizi realmente attivi: ogni
> nuovo servizio esterno (es. provider email) **deve** essere aggiunto qui + in Privacy Policy + DPA.
>
> Versione: **v0.1 (bozza)** · Ultima modifica: **2026-06-15** · Fonte: `LEGAL_STATE_CONTEXT.md` +
> `DATA_INVENTORY_CONTEXT.md` (2026-06-12).

---

## Cosa sono i sub-processor

Quando PrenotaZen tratta i dati dei clienti finali per conto del ristorante (Titolare), si appoggia a
fornitori esterni («sub-responsabili»). Qui sono elencati: chi sono, cosa fanno, dove ospitano i dati,
e su quale base contrattuale il trasferimento è coperto.

## Elenco attuale

| Sub-processor | Funzione | Dati trattati | Region / hosting | Base / DPA |
|---|---|---|---|---|
| **Supabase Inc.** | Database, autenticazione, Edge Functions, log applicativi | Tutti i dati dell'app (prenotazioni, clienti, account admin, IP sicurezza) | **UE — West EU (Irlanda)** | DPA Supabase firmato (2026-05-23, Ref `Q4RYF-5FVPD-4LXZY-8JABB`) + SCC per sub-processor extra-UE |
| **Vercel Inc.** | Hosting frontend statico + log HTTP | IP, user agent, URL di accesso | Edge globale (USA-first) | Standard nei ToS Vercel + DPA |
| **Amazon Web Services** | Infrastruttura sottostante a Supabase | Come Supabase (a riposo) | Multi-region | Coperto da DPA Supabase (Schedule 3) |
| **Active Campaign / Postmark** | Sub-processor email di Supabase (email agli *Authorized Users* Supabase, non ai clienti finali) | Email account | USA | Coperto da DPA Supabase (Schedule 3) |

## Non ancora attivi (da aggiungere quando configurati)

| Servizio | Quando aggiungerlo |
|---|---|
| **Provider email transazionale** (Brevo / Resend / SendGrid / Postmark, da decidere) | Quando l'Edge Function `send-email` andrà in produzione. Oggi `VITE_ENABLE_SEND_EMAIL` è **OFF** in prod e il provider non è confermato. All'attivazione: aggiungere riga (region + DPA) qui, in Privacy Policy e nel DPA verso i clienti. |

## Trasferimenti extra-UE

Il database primario è in **UE (Irlanda)**. I sub-processor extra-UE (es. componenti USA di Supabase,
edge Vercel) sono coperti dal **DPA Supabase** con **Clausole Contrattuali Standard (SCC)** Modulo
Two/Three + addendum UK e Svizzera.

## Manutenzione di questo elenco

- A ogni nuovo servizio esterno che tocca dati personali → aggiornare **prima del go-live**.
- Tenere allineati: questo file, `LEGAL_STATE_CONTEXT.md` (tabella sub-processor), Privacy Policy
  (`src/pages/PrivacyPolicyPage.tsx`), DPA verso i clienti.
- Pubblicazione: questo documento è pensato per essere **linkabile dai clienti**; confermare con il
  professionista la versione pubblica prima di esporlo.

---

> **Da completare col professionista:** conferma elenco e region; decidere se/dove pubblicarlo
> (es. pagina `/legal/sub-processors` o allegato al DPA cliente).
