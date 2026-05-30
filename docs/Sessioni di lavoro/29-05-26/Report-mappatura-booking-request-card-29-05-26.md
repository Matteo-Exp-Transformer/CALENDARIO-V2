# Report — Mappatura flusso booking request → BookingRequestCard (29-05-26)

## Tipo sessione

| Campo | Valore |
|-------|--------|
| **Profilo** | Verifica (solo mappatura, nessun fix codice) |
| **Modalità** | deep |
| **Scope** | `/prenota/:slug` → `booking_requests` → Admin → Prenotazioni → Richieste in attesa (`BookingRequestCard`) + superfici correlate |
| **Fuori scope** | Fix codice, refactor UI, migrazioni, email prenotazione, form manuale revisore |

---

## Cosa è stato fatto (ordine)

1. Lette skill: `APP_CONTEXT_SKILL.md` §0.0/§4/§7, `ADMIN_CLASSIC_SKILL.md`, `BOOKING_DATA_FLOW_SKILL.md`, contesti layout/form.
2. Tracciato submit: `BookingRequestForm` → `useCreateBookingRequest` → edge `create-booking` → colonne DB.
3. Mappate superfici admin: `BookingRequestCard`, `PendingRequestsTab`, `ArchiveBookingCard`, `DigestBookingListRow`, `DetailsTab`.
4. Verificato ambiente TEST (`docnnernvp`) e query SQL via MCP `user-supabase-test`.
5. Campionata prenotazione reale su TEST (nessun seed: slug `.env.local` ≠ tenant del campione Matteo).
6. Redatti questo report, `BOOKING_REQUEST_CARD_CONTEXT.md`, aggiornati `SESSION_LOG.md` e `FOLLOW_UP.md`.

---

## Ambiente e tenant

| Controllo | Esito |
|-----------|--------|
| `VITE_SUPABASE_URL` in `.env.local` | `https://docnnernvpyrbwuzzach.supabase.co` → progetto **TEST** `docnnernvp` |
| MCP `get_project_url` | OK — stesso host TEST |
| `TENANT_SLUG` in `.env.local` | `ristorante-test-classic` → org `22222222-2222-2222-2222-222222222222` |
| Prenotazione campione (caso Matteo) | Tenant **`test-pro`** (`2deb4d6e-ff8c-462a-92da-5a6d731a9dee`), non `ristorante-test-classic` |

**Nota:** per seed/script usare lo slug dell’organizzazione su cui si fa QA admin, non il placeholder. `bookingSeedShared.mjs` rifiuta slug in `PLACEHOLDER_SLUGS`.

---

## Query verificate (Supabase TEST)

| # | Query / scopo | Esito | Nota |
|---|---------------|-------|------|
| Q1 | `SELECT id, name, slug FROM organizations ORDER BY created_at DESC` | **OK** | 8 org; slug utili: `test-pro`, `ristorante-test-classic`, `da-mario`, … |
| Q2 | SELECT ultime 5 prenotazioni (GUIDA §1, colonne legacy) | **OK** | Eseguita su `test-pro`; **mancano** `menu_selection`, `menu_promo_labels`, `source` |
| Q3 | SELECT impostazioni §5 GUIDA (`booking_vol_au_vent_promo_*`) | **KO (obsoleta)** | **0 righe** su tenant `ristorante-test-classic` |
| Q4 | SELECT chiavi promo/vetrina corrette | **OK** | Su classic-test: `booking_menu_promos`, `public_booking_page_background` presenti; **no** `booking_public_form_config` / `public_booking_strip_photo` su quel tenant |
| Q5 | `information_schema.columns` su `booking_requests` | **OK** | Allineato a `src/types/database.ts` (inclusi `source`, `menu_promo_labels`) |
| Q6 | SELECT campione menu (proposta sotto) | **OK** | Trovata pending `8e2d7cf6-…` con `menu_total_per_person=8`, `items=[]` |

### Query aggiornate consigliate (fase fix / revisore)

**Ultime prenotazioni (sostituisce GUIDA §1 “Ultime 5”):**

```sql
SELECT
  id,
  client_name,
  client_email,
  client_phone,
  desired_date,
  desired_time,
  num_guests,
  booking_type,
  event_type,
  placement,
  menu,
  preset_menu,
  menu_total_per_person,
  menu_total_booking,
  menu_selection,
  menu_promo_labels,
  dietary_restrictions,
  special_requests,
  booking_source,
  source,
  status,
  created_at
FROM booking_requests
WHERE tenant_id = '<TENANT_UUID>'
ORDER BY created_at DESC
LIMIT 5;
```

**Solo form pubblico** (preferire `booking_source`; `source` è canale CRM-style):

```sql
SELECT *
FROM booking_requests
WHERE tenant_id = '<TENANT_UUID>'
  AND booking_source = 'public'
ORDER BY created_at DESC
LIMIT 10;
```

**Impostazioni menu + vetrina Prenota** (sostituisce GUIDA §5 “Solo impostazioni menu e promozioni”):

```sql
SELECT setting_key, updated_at
FROM restaurant_settings
WHERE tenant_id = '<TENANT_UUID>'
  AND setting_key IN (
    'booking_staff_presets_visible',
    'booking_custom_staff_presets',
    'booking_menu_promos',
    'booking_public_form_config',
    'public_booking_strip_photo',
    'public_booking_page_background',
    'booking_placement_areas'
  )
ORDER BY setting_key;
```

---

## Prenotazione campione (evidenza DB — caso €0 / €8)

| Campo | Valore DB |
|-------|-----------|
| **ID** | `8e2d7cf6-c57a-486d-b5e6-d8552b771f55` |
| **Tenant** | `test-pro` / `2deb4d6e-ff8c-462a-92da-5a6d731a9dee` |
| **URL pubblico** | `/prenota/test-pro` |
| **booking_type** | `rinfresco_laurea` |
| **num_guests** | 21 |
| **menu_total_per_person** | 8 |
| **menu_total_booking** | 168 |
| **menu_selection** | `{"items":[]}` |
| **preset_menu** | null |
| **menu_promo_labels** | `["dsfsdfsdf"]` |
| **booking_source** | `public` |
| **source** | `public_form` (default colonna, edge non imposta `source`) |
| **status** | pending |

**Simulazione helper (stesso input della card):**

| Superficie | Helper | Prezzo menù mostrato |
|------------|--------|----------------------|
| Digest | `getResolvedMenuPriceDisplay` | **€0.00/persona** (overlay da somma `items` = 0) |
| Espanso | `getMenuPriceDisplayFromBooking` | **€8.00/persona**, totale **€168.00** |
| Calendario digest | `getResolvedMenuPriceDisplay` | Come digest → **€0.00/persona** |

---

## Flusso submit (sintesi tecnica)

```
BookingRequestPage (/prenota/:slug)
  → legge restaurant_settings (supabasePublic): booking_public_form_config, menu_items, booking_custom_staff_presets, booking_menu_promos, …
  → BookingRequestForm (formData + resolveSubTabView per prezzi/label card)
  → mutate({ ...formData, menu_promo_labels, special_requests normalizzate, tenantSlug })
  → useCreateBookingRequest → POST create-booking
  → INSERT booking_requests (booking_source='public', status='pending', source default DB 'public_form')
  → Admin: usePendingBookings select * → BookingRequestCard
```

**Campi NON inviati dal client pubblico** (restano null/default): `event_type`, `placement`, `menu` (testo legacy), `source` (solo default DB), `booking_source` (impostato edge).

---

## Tabella mappa campo-per-campo

Legenda colonne UI: **Digest** = `BookingRequestCard` chiuso; **Espanso** = pannello card; **Cal** = `DigestBookingListRow`; **Arch** = `ArchiveBookingCard`; **Modal** = `DetailsTab` in `BookingDetailsModal`.

| Campo visto dal ristoratore | Campo form cliente | Payload submit | Colonna DB | Digest | Espanso | Cal | Arch | Modal | Coerente? | Nota |
|-----------------------------|-------------------|----------------|------------|--------|---------|-----|------|-------|-----------|------|
| Badge stato (Pendente/…) | — | — | `status` | `STATUS_CONFIG` L45-48, L166-170 | — | — | `STATUS_LABELS` digest | — | sì | Edge: `pending` |
| Strip tipo (es. Rinfresco di Laurea) | Scelta modalità `booking_type` | `booking_type` | `booking_type` | `getBookingEventTypeLabel` L94-115, strip L130-137 | — | icona tipo | label tipo in espanso griglia | `BOOKING_TYPE_EVENT_LABELS` | sì | `event_type` non usato su form pubblico |
| Nome cliente | `client_name` | `client_name` | `client_name` | L186-190 | — (solo digest layout) | nome riga | griglia espanso | InfoRow Nome | sì | |
| Data desiderata | `desired_date` | `desired_date` | `desired_date` | `formatDate` L192-196 | — | — | `formatDate(displayDate)` * | `formatDate` formData | sì | *Archivio: `confirmed_start` se accettata |
| Ora desiderata | `desired_time` | `desired_time` | `desired_time` | `formatTime` L198-202 | — | `getAccurateStartTime` se confermata | `displayTime` * | startTime edit | sì | |
| Numero ospiti | `num_guests` | `num_guests` | `num_guests` | L222-258 | — | “N ospiti” | griglia Pax | numGuests | sì | Ricalcola `menu_total_booking` in form |
| Telefono | `client_phone` | `client_phone` | `client_phone` | L119-126, digest | — | — | digest/espanso | InfoRow | sì | Obbligatorio in validazione pubblica |
| Email | `client_email` | `client_email` | `client_email` | L248-252 | — | — | digest | InfoRow | sì | Opzionale pubblico; DB NOT NULL '' |
| Note / richieste speciali | `special_requests` | `special_requests` (+ prefisso card) | `special_requests` | L231-237 digest | sezione L397-404 | — | sezione note | solo se `booking_type=tavolo` L205-223 | parziale | Prefisso `[label - €X/p]` se card senza preset L836-842 |
| Promo visualizzate | (tracciamento banner) | `menu_promo_labels` | `menu_promo_labels` | `resolveMenuPromoLabelsForBooking` L204-211 | sezione L387-394 | — | **mancante** | InfoRow L135-136 | parziale | Fallback live da `booking_menu_promos` se snapshot vuoto |
| Prezzo menù / persona | Sidebar: `menu_total_per_person` (da card/preset/items) | `menu_total_per_person` | `menu_total_per_person` | `getResolvedMenuPriceDisplay` L239-246 | `getMenuPriceDisplayFromBooking` L311-323 | `getResolvedMenuPriceDisplay` | **mancante** | **mancante** | **NO (INC-01)** | Vedi root cause |
| Prezzo totale | Sidebar: `menu_total_booking` | `menu_total_booking` | `menu_total_booking` | (solo label persona in digest) | L325-332 | totale in riga non-compact | **mancante** | **mancante** | **NO** | Digest non mostra totale |
| Menu predefinito | `preset_menu` | `preset_menu` | `preset_menu` | — | `getPresetMenuLabel` + `booking_custom_staff_presets` L301-307 | — | **mancante** | **mancante** | parziale | Solo se `preset_menu` valorizzato |
| Lista prodotti menù | `menu_selection.items` | `menu_selection` | `menu_selection` JSONB | — | lista L336-357 | — | **mancante** | **mancante** | parziale | Se `items` vuoto, sezione prezzi espanso può comunque mostrare totali DB |
| Intolleranze | `dietary_restrictions` | `dietary_restrictions` | `dietary_restrictions` | — | L363-384 | — | **mancante** | **mancante** | parziale | `DietaryRestrictionsSection` solo tipologie menù |
| Ricevuta il | — | — | `created_at` | L265-277 | fallback L287-292 | — | L270-277 | Data creazione L196-201 | sì | |
| Azioni Accetta/Rifiuta | — | — | — | — | L407-425 | — | Reinserisci/Requeue archivio | — | — | `PendingRequestsTab` modali capacity/reject |

---

## Incoerenze (severità)

| ID | Severità | Descrizione | Superfici |
|----|----------|-------------|-----------|
| **INC-01** | **Fuorviante** | Digest prezzo menù €0.00 con DB `menu_total_per_person=8` quando `menu_selection.items` è `[]` o somma prezzi riga = 0 | `BookingRequestCard` digest, `DigestBookingListRow` |
| **INC-02** | Parità digest | Calendario usa lo stesso helper del digest (`getResolvedMenuPriceDisplay`) | `BookingCalendar` |
| **INC-03** | Solo mancante UI | Archivio non mostra promo, prezzo menù, preset, prodotti, intolleranze | `ArchiveBookingCard` |
| **INC-04** | Solo mancante UI | Modal dettaglio: promo sì, nessun blocco prezzo/menù/prodotti | `DetailsTab` (collegare **FU-001**) |
| **INC-05** | Documentazione | GUIDA query §5 con chiavi promo obsolete; SELECT prenotazioni incompleto | `GUIDA_USO_QUERIES_CONTROVERIFICA.md` |
| **INC-06** | Informativo | Due colonne: `booking_source` (`public`/`admin`) vs `source` (`public_form`/…) — solo edge + default | Query/debug |

**Caso secondario (menù con righe a prezzo > 0 ma fisso da card):** es. id `41d4b70c-…` — `menu_total_per_person=18` ma somma `items` enorme; digest userebbe overlay dalla somma righe, non il fisso DB → possibile prezzo digest **sbagliato in alto**, opposto a INC-01.

---

## Root cause ipotizzate (con file:riga)

### INC-01 — Digest €0.00 vs espanso €8.00

1. **Submit corretto:** form salva `menu_total_per_person=8`, `menu_total_booking=168` ([`create-booking` L371-372](supabase/functions/create-booking/index.ts)); campione DB conferma.
2. **Menù fisso / card senza righe:** `menu_selection.items` può essere `[]` mentre il prezzo è in `menu_total_*` (card `price_per_person`, `activeSubTabUsesFixedPricing` in [`BookingRequestForm.tsx` L420-497](src/features/booking/components/BookingRequestForm.tsx)).
3. **Bug display:** [`menuPricing.ts` L71-87](src/features/booking/utils/menuPricing.ts) — se `bookingTypeUsesMenuSelections` e esiste `menu_selection.items` (anche array vuoto, truthy in JS), calcola `baseTotal` dalla somma righe; con `fromDb` valorizzato esegue **`return overlay`** anche quando `baseTotal === 0`, ignorando `menu_total_per_person`.
4. **Digest vs espanso:** [`BookingRequestCard.tsx` L96-98](src/features/booking/components/BookingRequestCard.tsx) — digest `getResolvedMenuPriceDisplay`, espanso `getMenuPriceDisplayFromBooking`.

**Classificazione (Derivazione errori):** **bug preesistente** in `menuPricing.ts`, non errore submit né payload DB.

---

## Dati comunicazione (per Matteo)

| Dove nell’app | Cosa vede il ristoratore | Componente | Storage |
|---------------|---------------------------|------------|---------|
| **Pagina Prenota** (`/prenota/:slug`) | Compila nome, data, ora, ospiti, menù/promo; sidebar mostra totali | `BookingRequestForm`, `BookingSummarySidebar` | Submit → tabella **`booking_requests`**; config vetrina in **`restaurant_settings.booking_public_form_config`**; promo in **`booking_menu_promos`** |
| **Admin → Prenotazioni → Richieste in attesa** | Card collassata con riepilogo + espanso dettaglio menù | `PendingRequestsTab` → **`BookingRequestCard`** | Lettura `booking_requests` (status `pending`); preset label da **`booking_custom_staff_presets`**; promo da snapshot **`menu_promo_labels`** o fallback settings |
| **Admin → Calendario** | Riga digest giorno con prezzo menù (se contesto menù) | **`DigestBookingListRow`** in `BookingCalendar` | Stessa riga `booking_requests` |
| **Admin → Archivio** | Card simile ma **senza** prezzo/promo menù | **`ArchiveBookingCard`** in `ArchiveTab` | Stessa tabella, tutti gli status |
| **Calendario → dettaglio** | Tab dettagli: tipo, cliente, promo; **no** prezzo menù | **`DetailsTab`** | Stessa riga; **FU-001** |

---

## Derivazione errori

| Problema | Causa | Evitabile come |
|----------|-------|----------------|
| €0.00 in digest con €8 in DB | Bug preesistente `getResolvedMenuPriceDisplay` overlay | Fase 3: se `fromDb` e `baseTotal===0`, usare `fromDb`; test unitari |
| Confusione slug seed vs QA | `.env.local` punta a `ristorante-test-classic`, campione su `test-pro` | Allineare `TENANT_SLUG` prima di seed; revisore usa slug admin loggato |
| GUIDA SQL fuorviante | Doc non aggiornata post-migrazione promo | **FU-015** — aggiornare guida |

---

## File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `docs/per-ui-design-skill/BOOKING_REQUEST_CARD_CONTEXT.md` | **Nuovo** | Context agenti digest/espanso |
| `docs/Sessioni di lavoro/29-05-26/Report-mappatura-booking-request-card-29-05-26.md` | **Nuovo** | Report sessione |
| `docs/SESSION_LOG.md` | 1 riga | Indice sessione |
| `docs/FOLLOW_UP.md` | FU-015 (+ nota FU-001) | Debiti tracciabili |
| Skill area codice (`ADMIN_CLASSIC`, `BOOKING_DATA_FLOW`, …) | Nessuna | §7.2 non richiesto (nessun cambio `src/`) |

---

## Piano fase 2 (revisore) e fase 3 (fix)

### Fase 2 — Revisore mappa

- Compilazione **manuale** Pagina Prenota su tenant scelto (tipologia + card/carosello + promo + menù fisso e/o personalizzabile).
- Annotare valori **sidebar riepilogo** prima del submit.
- Confrontare con card admin e con SELECT Q6 sullo stesso `id`.
- Confermare INC-01..INC-06; segnalare altri campi mancanti in archivio/modal.

### Fase 3 — Fix (agente Esecuzione)

1. **`menuPricing.ts`:** in `getResolvedMenuPriceDisplay`, non restituire overlay a somma zero se `fromDb` è valido; oppure usare `fromDb` per menù fisso.
2. **Test** in `menuPricing` (caso: `menu_total_per_person=8`, `items=[]`).
3. Valutare allineamento **Archive** / **DetailsTab** (product decision).
4. Aggiornare **GUIDA** query (FU-015).

---

## Prompt revisore — input attesi

Copia-incolla in nuova chat Verifica:

```
Profilo: Verifica. Modalità: deep (non abbassare).

Obiettivo: controverifica manuale mappa booking request (report 29-05-26).

Input:
- URL test: http://localhost:5173/prenota/test-pro (o dominio staging)
- Tenant UUID test-pro: 2deb4d6e-ff8c-462a-92da-5a6d731a9dee
- Slug .env locale: ristorante-test-classic (22222222-…) — allineare login admin al tenant usato
- Prenotazione campione (se ancora pending): id 8e2d7cf6-c57a-486d-b5e6-d8552b771f55
  - menu_total_per_person=8, menu_total_booking=168, menu_selection.items=[], menu_promo_labels=["dsfsdfsdf"]
  - Atteso digest: Menù €0.00/persona (bug). Atteso espanso: €8.00/persona, totale €168.00

Incoerenze da confermare: INC-01 … INC-06 (vedi report).

Query SQL validate: usare Q1–Q6 del report (sezione Query verificate).

Checklist:
1. Login admin sul tenant corretto
2. Apri /prenota/<slug>
3. Scegli tipologia menù (rinfresco o prezzo fisso)
4. Card o carosello + promo visibile
5. Menù fisso (solo prezzo card) e/o personalizzabile (righe ingredienti)
6. Compila sidebar: annota prezzo/persona e totale
7. Submit → Admin → Richieste in attesa → confronta digest vs espanso vs SQL
8. Opzionale: stessa prenotazione in Calendario digest e Archivio

Report: docs/Sessioni di lavoro/29-05-26/Report-mappatura-booking-request-card-29-05-26.md
Context: docs/per-ui-design-skill/BOOKING_REQUEST_CARD_CONTEXT.md
```

---

## Seed (non eseguito)

- **Motivo:** `TENANT_SLUG=ristorante-test-classic` in `.env.local`; campione reale già su `test-pro`.
- **Se serve seed:** impostare `TENANT_SLUG=test-pro`, poi `npm run seed:booking-menu-full` — payload con `items` random e prezzi riga ≠ submit manuale menù fisso vuoto.

---

## Criteri di fatto

| Criterio | Stato |
|----------|--------|
| Tabella mappa completa | ✅ |
| `BOOKING_REQUEST_CARD_CONTEXT.md` | ✅ |
| Query TEST documentate | ✅ |
| INC-01 con codice + DB | ✅ |
| Nessuna modifica `src/` | ✅ |
