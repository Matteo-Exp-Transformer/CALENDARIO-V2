# ADMIN — CRM Context

> Area Pro/Enterprise per gestione clienti. Il CRM fonde dati manuali e prenotazioni usando email
> normalizzata, non una FK diretta.
>
> **Aggiornato 15-06-26:** CrmPage è ora a **due tab** — Rubrica clienti e Personalizza email.

## 1. Flussi utente

**Tab "Rubrica clienti":**
- Sidebar → `CRM Clienti` → tab Rubrica.
- Cerca per nome/email/telefono.
- Filtra per ultima prenotazione: tutte, settimana, mese, anno.
- Ordina tabella.
- Seleziona riga e apre dettaglio.
- Crea cliente manuale.
- Modifica contatti/note.
- Elimina cliente.

**Tab "Personalizza email":**
- Editor accetta prenotazione: oggetto + apertura + chiusura (placeholder = default cablati; campo null o assente = usa il default).
- Editor rifiuta prenotazione: idem.
- Pulsante «Ripristina predefinito» cancella la riga DB → torna ai testi di default.
- Sezione promo: oggetto + corpo + footer privacy fisso (aggiunto automaticamente). Pulsante «Scegli destinatari e invia…» apre il picker rubrica (solo clienti con email); modale di conferma con conteggio; invio uno-a-uno via `useSendPromoEmail`.

## 2. Componenti

| Componente | Percorso | Nota |
|---|---|---|
| `CrmPage` | `src/pages/CrmPage.tsx` | Contenitore a 2 tab |
| `CustomerDirectoryTab` | `src/features/booking/components/crm/` | Estratto da CrmPage (invariato) |
| `EmailTemplatesTab` | `src/features/booking/components/crm/` | Editor accetta + rifiuta + promo |
| `EmailTemplateEditor` | `src/features/booking/components/crm/` | Form generico per una chiave template |
| `PromoRecipientPicker` | `src/features/booking/components/crm/` | Modal selezione destinatari promo |
| `CustomerSearchBar` | `src/features/booking/components/crm/` | – |
| `CustomerListTable` | `src/features/booking/components/crm/` | – |
| `CustomerDetailPanel` | `src/features/booking/components/crm/` | – |
| `CustomerFormModal` | `src/features/booking/components/crm/` | – |
| `CustomerDeleteConfirm` | `src/features/booking/components/crm/` | – |

## 3. Hook e dati

**CRM rubrica:**
- `useCustomers` legge `customers` e `booking_requests`.
- `useCustomerMutations` crea/aggiorna/elimina.
- `useAdminAuth` fornisce admin id per alcune mutazioni.

**Template email (nuovo):**
- `useEmailTemplates` — legge `email_templates` del tenant (query key `['email-templates', tenantId]`).
- `useUpsertEmailTemplate` — insert/update by `(tenant_id, template_key)`; invalida la query.
- `useDeleteEmailTemplate` — rimuove la riga per chiave (= ripristina il default cablato).
- `useSendPromoEmail` — loop uno-a-uno su `sendAndLogEmail`, raccoglie `{ sent, failed }`.

## 4. DB — tabella `email_templates` (migr. 050)

| colonna | tipo | note |
|---|---|---|
| `id` | uuid pk | |
| `tenant_id` | uuid → organizations(id) cascade | |
| `template_key` | text CHECK `IN ('booking_accepted','booking_rejected','promo')` | |
| `subject` | text nullable | null = usa il default cablato |
| `intro` | text nullable | null = usa il default cablato |
| `closing` | text nullable | null = usa il default cablato; null per promo |
| `enabled` | boolean default true | bozza/attiva (promo) |
| `created_at` / `updated_at` | timestamptz | trigger `update_updated_at` |

UNIQUE `(tenant_id, template_key)`. RLS: solo admin autenticato del proprio tenant (SELECT/INSERT/UPDATE/DELETE). FORCE RLS (coerente con 046).

**Override text fallback flow:**
```
email_templates riga presente e campo non null → usa quel testo
altrimenti → DEFAULT_ACCEPTED_SUBJECT / DEFAULT_ACCEPTED_INTRO / ... (costanti esportate da emailTemplates.ts)
```

Gli override vengono letti in `fetchTenantEmailBundle` dentro `useEmailNotifications.ts` e passati ai builder `getBookingAcceptedEmail` / `getBookingRejectedEmail`.

## 5. Data flow CRM rubrica

Relazione logica:

```text
booking_requests.client_email -> normalize(trim/lowercase) -> customers.email
```

Non c'e FK diretta. `useCustomers`:

1. legge clienti manuali/synced;
2. legge booking non `deleted`;
3. raggruppa per email;
4. sovrappone dati manuali a dati booking;
5. calcola count e ultima prenotazione.

`create-booking` pubblico inserisce booking e poi upserta `customers` con `source='synced'`.

## 6. Mutazioni CRM rubrica

| Azione | Scrittura |
|---|---|
| Crea cliente | insert `customers source='manual'` |
| Modifica cliente | update `customers`; se solo booking, crea riga synced; patch booking collegate |
| Elimina cliente | soft-delete booking collegate e delete fisico riga `customers` |

## 7. Vincoli

- `customers.email` unico per tenant su email normalizzata.
- Email vuota vietata da trigger.
- CRM gated da `features.crm` e edition Pro/Enterprise.
- Invio promo richiede `VITE_ENABLE_SEND_EMAIL=true`; se false, `useSendPromoEmail` lancia errore UI.
- Invio promo uno-a-uno: nessun limite Brevo array (cap 10 per batch → non tocca quel limite).

## 8. Rischi

- Prenotazioni senza email non entrano nel CRM né nel picker promo.
- Filtro data diverso da `all` nasconde clienti manuali senza booking.
- Update/delete multi-step client-side non transazionali.
- Cambio email puo fallire per duplicato.
- E2E CRM usa selettori deboli: servira attenzione nella blindatura.
- Migrazione 050 applicata su TEST; promozione a PROD è passo separato (M-Settings/blindatura).

## 9. Pianificato — mini-gestore campagne (FU-EMAIL-7, plan pronto)

> Non ancora implementato. La sezione promo singola evolverà in un gestore di **fino a 5 campagne per
> tenant** (limite DURO via trigger), nuova tabella `email_campaigns` (migr. 051), con: corpo + **link a
> pulsanti** (whitelist http/https) e auto-link URL, **gruppo destinatari salvato** alla creazione,
> **cadenza** opzionale (settimanale/mensile/custom) — in fase 1 **solo salvata** (avviso UI: invio
> automatico = FU-EMAIL-8, scheduler pg_cron). Builder `getCampaignEmail` con escape HTML; hook
> `useEmailCampaigns`/`useEmailCampaignMutations`/`useSendCampaignEmail`; anteprima live (chiude il gap
> anteprima di FU-EMAIL-3). Dettaglio: report 15-06-26 «Controverifica FU-EMAIL-3 + plan campagne».
