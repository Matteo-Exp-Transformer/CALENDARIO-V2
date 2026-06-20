# ADMIN — CRM Context

> Area Pro/Enterprise per gestione clienti. Il CRM fonde dati manuali e prenotazioni usando email
> normalizzata, non una FK diretta.
>
> **Aggiornato 20-06-26 (redesign Rubrica card):** CrmPage è ora a **due tab** — Rubrica clienti e Personalizza email.
> La tab "Personalizza email" è strutturata in **due gruppi separati**:
> - **Email automatiche** — due CollapsibleCard controllate (chiuse di default), Accetta e Rifiuta; si chiudono al click/dopo Salva, con conferma guard se dirty (vedi §7).
> - **Email personalizzate** — `CampaignsManager` (ex "Campagne email").

## 1. Flussi utente

**Tab "Rubrica clienti":**
- Sidebar → `CRM Clienti` → tab Rubrica.
- Cerca per nome/email/telefono.
- Filtra per ultima prenotazione: tutte, settimana, mese, anno.
- Ordina lista card (default: ultima prenotazione decrescente).
- Click su card → espansione inline (accordion, una sola card aperta): note interne + storico prenotazioni.
- Storico ordinato per `created_at` decrescente; date in **GG/MM/AAAA**; intolleranze art. 9 (No / Sì cliccabile con regole consenso).
- **Nessuna creazione manuale** — il pulsante "Nuovo cliente" è stato rimosso (fix 15-06-26). I clienti entrano in rubrica solo tramite prenotazioni dal form pubblico (`source='booking'`), che impone l'accettazione della privacy policy.
- Modifica contatti / Elimina dalla card (stessi modali di prima).
- Elimina cliente.

**Tab "Personalizza email":**

*Gruppo «Email automatiche»* (CollapsibleCard, chiuse di default):
- Editor accetta prenotazione: oggetto + apertura + chiusura (placeholder = default cablati; campo null o assente = usa il default). Usa `EmailTemplateEditor` con prop `bare` dentro CollapsibleCard.
- Editor rifiuta prenotazione: idem.
- Pulsante «Ripristina predefinito» cancella la riga DB → torna ai testi di default.

*Gruppo «Email personalizzate»* (separato da `<hr>`):
- **Gestore campagne email personalizzate** (fino a 5 per tenant, limite DURO via trigger): lista campagne con nome/oggetto/cadenza; pulsante **«Invia ora»** sulla card chiusa, visibile solo per campagne con `cadence_type === 'none'` (Solo manuale); click apre guard di conferma con nome campagna + conteggio destinatari, invio al gruppo salvato solo dopo conferma; `useSendCampaignEmail` usato da `CampaignsManager`; editor per ogni campagna (`CampaignEditor`) con nome, oggetto, **titolo in cima all'email** (`heading`, placeholder = `DEFAULT_CAMPAIGN_HEADING = 'Un messaggio per te'`), corpo, link strutturati (`CampaignLinksEditor`), cadenza (`CampaignCadenceSelector`: none/weekly/monthly/custom — in fase 1 solo salvata, nessun invio automatico), gruppo destinatari salvato, anteprima live `<iframe srcDoc>`, pulsanti Salva / Annulla / Elimina. L'invio **non** è più nell'editor.

## 2. Componenti

| Componente | Percorso | Nota |
|---|---|---|
| `CrmPage` | `src/pages/CrmPage.tsx` | Contenitore a 2 tab |
| `CustomerDirectoryTab` | `src/features/booking/components/crm/` | Estratto da CrmPage (invariato) |
| `EmailTemplatesTab` | `src/features/booking/components/crm/` | Editor accetta + rifiuta + gestore campagne |
| `EmailTemplateEditor` | `src/features/booking/components/crm/` | Form generico per una chiave template |
| `PromoRecipientPicker` | `src/features/booking/components/crm/` | Modal selezione destinatari (riusato nelle campagne); draft stabile fino a Conferma/Annulla |
| `CampaignsManager` | `src/features/booking/components/crm/` | Lista campagne + routing verso CampaignEditor |
| `CampaignEditor` | `src/features/booking/components/crm/` | Form edit/crea campagna con anteprima live |
| `CampaignLinksEditor` | `src/features/booking/components/crm/` | Editor pulsanti link (etichetta+URL, validazione http/https) |
| `CampaignCadenceSelector` | `src/features/booking/components/crm/` | Selettore cadenza campagna (none/weekly/monthly/custom) |
| `CustomerSearchBar` | `src/features/booking/components/crm/` | – |
| `CustomerCardList` | `src/features/booking/components/crm/` | Lista card a tutta larghezza + toolbar ordinamento |
| `CustomerCardExpandedContent` | `src/features/booking/components/crm/` | Area espansa: note interne + storico prenotazioni (7 campi) |
| `CustomerFormModal` | `src/features/booking/components/crm/` | – |
| `CustomerDeleteConfirm` | `src/features/booking/components/crm/` | – |

## 3. Hook e dati

**CRM rubrica:**
- `useCustomers` legge `customers` e `booking_requests` (select estesa: `created_at`, intolleranze, importo menu, preset/special_requests per euristica carosello).
- `useCustomerMutations` crea/aggiorna/elimina.
- `useAdminAuth` fornisce admin id per alcune mutazioni.
- Helper display: `formatItalianDateDisplay`, `customerBookingHistoryDisplay` (label tipologia, card carosello, intolleranze art. 9).

**Template email (override accetta/rifiuta):**
- `useEmailTemplates` — legge `email_templates` del tenant (query key `['email-templates', tenantId]`).
- `useUpsertEmailTemplate` — insert/update by `(tenant_id, template_key)`; invalida la query.
- `useDeleteEmailTemplate` — rimuove la riga per chiave (= ripristina il default cablato).
- `useSendPromoEmail` — loop uno-a-uno su `sendAndLogEmail`, raccoglie `{ sent, failed }` (legacy; nuove campagne usano `useSendCampaignEmail`).

**Campagne email (nuovo — migr. 051):**
- `useEmailCampaigns` — legge `email_campaigns` del tenant (query key `['email-campaigns', tenantId]`), ordinati per `created_at`.
- `useCreateCampaign` / `useUpdateCampaign` / `useDeleteCampaign` — CRUD campagne; guard client-side limite 5 su create; invalidano la query.
- `useSendCampaignEmail` — loop uno-a-uno via `getCampaignEmail` + `sendAndLogEmail('promo')`.
- `parseCampaignLinks(raw: Json)` / `parseCampaignRecipients(raw: Json)` — cast sicuro da JSONB.
- Tipi `CadenceType` e `CadenceConfig` definiti in `useEmailCampaignMutations.ts`.

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
booking_requests.(client_email, client_phone, client_name)
  -> resolveContactKey(email, phone) -> contatto (email norm. | "tel:<cifre>") -> profilo rubrica
customers.email -> normalize(trim/lowercase) -> dati condivisi per indirizzo (consenso marketing, note)
```

Non c'è FK diretta. `useCustomers` / `mergeProfiles`:

1. legge clienti manuali/synced;
2. legge booking non `deleted`;
3. **raggruppa per identità `(contatto, client_name normalizzato)`** — `contatto` = email normalizzata se presente, altrimenti `tel:<cifre>` (≥4 cifre); booking senza email né telefono → scartati; stessa identità con nomi diversi → righe distinte;
4. sovrappone dati riga `customers` (per email) su tutti i profili con email valida (`marketing_consent`, `manual_id`, note); profili solo-telefono non trovano riga `customers` → `email = ''`;
5. calcola count e ultima prenotazione **per cluster nome**.

Chiave UI stabile: `CustomerProfile.profileKey` (`customerProfileKey` in `lib/customerEmail.ts`).

**Profili solo-telefono:** `CustomerProfile.email = ''`; compaiono in rubrica, cercabili per telefono. Non eleggibili per campagne email (`isEligiblePromoRecipient` richiede `!!email && email.includes('@')`). Non modificabili/eliminabili finché l'admin non aggiunge un'email nel form (campo `required`).

`create-booking` pubblico inserisce booking e poi upserta `customers` con `source='synced'` (una riga max per email).

**Campagne email:** il picker (`PromoRecipientPicker`) e i contatori eleggibili restano **per email unica** — `dedupeProfilesByEmail` prima del filtro consenso; la rubrica può mostrare più righe stesso indirizzo.

## 6. Mutazioni CRM rubrica

| Azione | Scrittura |
|---|---|
| ~~Crea cliente~~ | **Rimossa** — `CustomerFormModal` è solo `edit`; `useCreateCustomer` resta nel hook ma non è più cablato a UI |
| Modifica cliente | update `customers` (riga per email); patch **solo** `booking_requests` con stessa email + stesso `client_name` di partenza (`previousName`); crea riga synced se assente |
| Elimina cliente | soft-delete **solo** prenotazioni della coppia email+nome della riga; riga `customers` eliminata fisicamente **solo** se non restano prenotazioni attive per quell'email |

## 7. Vincoli

- `customers.email` unico per tenant su email normalizzata.
- Email vuota vietata da trigger.
- CRM gated da `features.crm` e edition Pro/Enterprise.
- Invio promo richiede `VITE_ENABLE_SEND_EMAIL=true`; se false, `useSendPromoEmail` lancia errore UI.
- Invio promo uno-a-uno: nessun limite Brevo array (cap 10 per batch → non tocca quel limite).
- **Destinatari email solo da prenotazione** — `PromoRecipientPicker` mostra solo clienti con `source === 'booking'` (accettazione privacy garantita dal form pubblico); clienti `source='manual'` esclusi dal picker.
- **Consenso marketing obbligatorio per email personalizzate (18-06-26)** — il picker campagne mostra solo clienti con `marketing_consent === true` (colonna `customers.marketing_consent`, allineata a `booking_requests.marketing_consent` scritta dal form Prenota / edge `create-booking`). `useSendCampaignEmail` applica un secondo guard: scarta dal payload destinatari senza consenso prima dell'invio. Le email transazionali accetta/rifiuta **non** sono filtrate. Vedi anche FU-EMAIL-8 (opt-out / revoca consenso).
- **Revoca consenso e gruppi salvati** — se un cliente si disiscrive (`customers.marketing_consent=false`, anche da `/disiscrivi`), non deve comparire né nel picker né nel contatore del gruppo campagna già salvato. All'apertura/caricamento di una campagna, `CampaignEditor` filtra `recipient_emails` col consenso corrente e persiste automaticamente la lista ripulita su `email_campaigns.recipient_emails`, senza richiedere Salva all'admin; se l'update fallisce, la UI resta filtrata e mostra errore. Con editor già aperto, un refetch rubrica che segnala revoca riallinea stato locale e DB (opzione B) finché il picker destinatari è chiuso.
- **Contatori destinatari campagna (19-06-26, §7.2)** — lista picker, footer «N selezionati», editor «N contatti salvati» e modale «Invia a N contatti» in `CampaignsManager` devono mostrare lo stesso N: solo clienti ancora eleggibili (`marketing_consent=true`, `source='booking'`). Helper condiviso `filterRecipientsToEligible` / `countEligibleRecipients` in `promoRecipientEligibility.ts`. Nel picker, il seed all'apertura intersecta `initialRecipients` con gli eleggibili; se un cliente revoca il consenso con modale aperto, sparisce dalla lista e il contatore si aggiorna senza resettare le altre selezioni draft dell'admin. **Refresh a chiusura editor (19-06-26):** mentre l'editor resta aperto la riga collassata può restare stale (es. «Invia ora» ancora abilitato); alla chiusura — da `CampaignEditor.onClose`, toggle riga, switch campagna o «Nuova campagna» — `CampaignsManager` esegue prune opzionale su `recipient_emails` (se la cache rubrica era stale), poi `refetchQueries` su campagne e rubrica prima di collassare, così «Invia ora» e il conteggio modale invio sono subito allineati senza riaprire la card.
- **Selezione destinatari campagna stabile (17-06-26)** — nel picker, le checkbox restano finché l'admin non clicca **Conferma** o **Annulla**; il draft non si resetta su refetch rubrica o su edit altri campi campagna. `CampaignEditor` passa `initialRecipients` al picker; la sync da prop `campaign` avviene solo al **cambio id** campagna (non su refetch TanStack Query con stesso id), così `recipient_emails` locale non si azzera dopo conferma nel picker ma prima del Salva campagna. Il prune automatico dei disiscritti è una sync una-tantum per id campagna al load (compatibile React.StrictMode) più riallineamento live con picker chiuso; non deve sovrascrivere il draft aperto nel picker.
- **Guard dirty attivo su editor email** — `EmailTemplateEditor` e `CampaignEditor` si registrano a `UnsavedChangesContext`. La modale Salva/Annulla/Esci scatta su: **cambio tab** Rubrica↔Personalizza email (`CrmPage.handleTabChange → confirmNavigation`) e **chiusura della CollapsibleCard** (vedi sotto). **Eccezione aperta:** la X in alto a destra/ritorno dashboard bypassa ancora il guard per `allowPrenotazioniDashboard`; tracciato in FU-EMAIL-11.
- **CollapsibleCard email automatiche in stato controllato** — `EmailTemplatesTab` gestisce `acceptedExpanded`/`rejectedExpanded` + `acceptedDirty`/`rejectedDirty`. Comportamento voluto per le card-con-form del CRM: la card **si chiude** al click sull'header e **dopo il salvataggio** (`onSaved` → collassa); **ma** se il form è dirty la chiusura passa per `confirmNavigation()` (`makeToggle`), così appare la modale Salva/Annulla/Esci prima di collassare. La card non si chiude per re-render/refetch (stato controllato). `EmailTemplateEditor` espone `onSaved` e `onDirtyChange` al parent.
- **Editor campagna email personalizzata (`CampaignEditor`)** — in `CampaignsManager` la lista campagne resta visibile; l'editor si apre **inline sotto la riga** selezionata (accordion controllato da `selected`). **Toggle riga:** primo click apre, **ri-click sulla stessa riga** chiude (`handleCloseCampaignEditor` / `navigateToSelection(null)` con refresh); se il form è dirty la chiusura passa per `confirmNavigation()` come le CollapsibleCard email automatiche (`makeToggle`). Stesso guard su click **altra** campagna o su **«+ Nuova campagna»** con editor aperto. **Invia ora** sulla riga (`cadence_type === 'none'`) non toggla l'editor (`stopPropagation`). **Si chiude e torna alla lista** anche dopo Salva/Crea riuscito (create e update) e su **Annulla** se il form è pulito; se dirty, **Annulla** passa per `confirmNavigation()`; la lista si vede solo se l'utente conferma (Esci/Annulla dal guard) o dopo Salva riuscito dal guard. Alla chiusura, `CampaignsManager` refresha rubrica e campagne prima di collassare (vedi §7.2 refresh a chiusura editor).

## 8. Rischi

- Filtro data diverso da `all` nasconde clienti manuali senza booking.
- Update/delete multi-step client-side non transazionali.
- Cambio email puo fallire per duplicato.
- E2E CRM usa selettori deboli: servira attenzione nella blindatura.
- Migrazione 050 applicata su TEST; promozione a PROD è passo separato (M-Settings/blindatura).

## 9. DB — tabella `email_campaigns` (migr. 051 + 052, TEST `docnnernvp`)

| colonna | tipo | note |
|---|---|---|
| `id` | uuid pk | |
| `tenant_id` | uuid → organizations(id) cascade | |
| `name` | text not null | etichetta campagna |
| `subject` | text not null | oggetto |
| `body` | text not null | corpo (testo semplice; escape+auto-link nel builder) |
| `links` | jsonb not null default '[]' | array `[{label, url}]` pulsanti link |
| `recipient_emails` | jsonb not null default '[]' | gruppo destinatari fisso (array email) |
| `enabled` | boolean not null default true | |
| `cadence_type` | text not null default 'none' | CHECK `in ('none','weekly','monthly','custom')` |
| `cadence_config` | jsonb | `{weekday}` / `{day_of_month}` / `{interval_days}` |
| `heading` | text nullable | titolo `<h1>` nell'header email; null = usa `DEFAULT_CAMPAIGN_HEADING` ('Un messaggio per te') — migr. 052 |
| `last_sent_at` | timestamptz | riservato FU-EMAIL-8 scheduler |
| `next_run_at` | timestamptz | riservato FU-EMAIL-8 scheduler |
| `created_at` / `updated_at` | timestamptz | trigger `update_updated_at` |

- **Limite DURO 5**: trigger `BEFORE INSERT` → `RAISE EXCEPTION` se già 5 campagne per tenant.
- **RLS**: FORCE RLS, 4 policy identiche a 050 con `current_admin_tenant_id()`.
- **Cadenza fase 1**: salvata ma non eseguita. Invio automatico = FU-EMAIL-8 (pg_cron + edge `send-campaigns`).

## 10. Vincoli campagne

- Limite 5 per tenant (trigger DB + guard hook client-side).
- Links solo http/https (`isValidHttpUrl`); URL `javascript:` etc. scartatI lato builder e UI.
- Gruppo `recipient_emails` fisso alla creazione — non si aggiorna coi nuovi clienti (decisione Matteo 15-06-26). Eccezione obbligatoria: i clienti che revocano il consenso marketing vengono rimossi automaticamente dal gruppo salvato al load della campagna e la lista ripulita viene persistita su DB.
- Cadenza in fase 1 = solo salvata; avviso UI obbligatorio nell'editor.
- Promozione PROD = passo separato (M-Settings/blindatura).

## 11. Precedente sezione "promo singola" (rimossa in FU-EMAIL-7)

La sezione «Email promo / offerte» (`savedPromo`, `useSendPromoEmail`, stato locale promo) è stata rimossa da `EmailTemplatesTab` il 15-06-26 e sostituita dal gestore campagne. La tabella `email_templates` con `template_key='promo'` rimane in DB (non è stata eliminata) ma non è più letta dall'UI.

## 12. Pendenze rubrica card — controverifica 20-06-26

> Stato verificato in controverifica: redesign card (`CustomerCardList` + `CustomerCardExpandedContent`)
> **compila** (`tsc` verde) e i test blindatura CRM passano (5 test). I punti sotto sono
> **fix richiesti da Matteo ancora APERTI** sul redesign — non implementarli come "già fatti".

1. ~~**Clienti senza email**~~ — **FATTO 20-06-26**: `resolveContactKey` in `customerEmail.ts` + `mergeProfiles`
   aggiornato. Booking con solo-telefono entrano in rubrica (`email = ''`). Picker promo li esclude già
   (`isEligiblePromoRecipient` richiede email valida). Chiave identità ora `(contatto, nome)` — vedi §5.
2. ✅ **Cella intolleranze — caso "le comunicherò io al ristorante"** — **RISOLTO 20-06-26**.
   `dietary_off_platform_notice` aggiunto alla select in `useCustomers.ts`; `hasDietary` in
   `buildCustomerBookingHistoryRow` include ora `|| booking.dietary_off_platform_notice === true`.
   Test off-platform aggiunto in `customerCardList.crm.adminBlindatura.test.tsx`.
3. ✅ **Micro-fix UI card** (FATTO 20-06-26): chevron accanto al nome rimossa; sezioni invertite
   (Storico prenotazioni **sopra**, Note interne **sotto**); etichetta "Card:" → "Offerta" in
   `BookingHistoryRow`. Toolbar "Ordina per" lasciata invariata.
