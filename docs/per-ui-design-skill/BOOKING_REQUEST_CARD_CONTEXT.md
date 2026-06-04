# BookingRequestCard — contesto agenti (admin richieste pending)

> Mappa come una prenotazione arrivata dal form pubblico viene mostrata al ristoratore in **Admin → Prenotazioni → Richieste in attesa**.
> Per il flusso submit e la Pagina Prenota: `../Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md`, `../Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md`.
> Report sessione mappa: `docs/Sessioni di lavoro/29-05-26/Report-mappatura-booking-request-card-29-05-26.md`.

**Trigger routing:** «Richieste in attesa» · «BookingRequestCard» · «digest prenotazione» · «prezzo menù card admin» → questo file + `ADMIN_CLASSIC_SKILL.md`.

---

## 1. Dove si trova nell’app

| Schermata | Percorso UI | Componente |
|-----------|-------------|------------|
| Richieste in attesa | Admin classica → tab **Prenotazioni** → sotto-tab **Richieste in attesa** | `PendingRequestsTab` monta una lista di **`BookingRequestCard`** |
| Calendario (digest giorno) | Tab **Calendario** → celle / lista digest | **`DigestBookingListRow`** in `BookingCalendar.tsx` |
| Archivio | Tab **Prenotazioni** → **Archivio** | **`ArchiveBookingCard`** in `ArchiveTab.tsx` (layout simile, campi menù ridotti) |
| Dettaglio da calendario | Click prenotazione → modal | **`DetailsTab`** in `BookingDetailsModal.tsx` |

**Dati:** tabella Supabase **`booking_requests`** (una riga = una richiesta). Settings letti in card: **`restaurant_settings`** (`booking_custom_staff_presets`, `booking_menu_promos`).

---

## 2. Due modalità della stessa card

`BookingRequestCard` è **collassabile**:

| Parte | Stato React | Contenuto principale |
|-------|-------------|----------------------|
| **Digest** (chiuso) | `isExpanded === false` | Badge stato, strip tipo evento, nome/data/ora/ospiti, telefono, email, note (clamp), promo, **prezzo menù**, «Ricevuta il» |
| **Espanso** | `isExpanded === true` | Menu selezionato, preset, **prezzo menù/totale**, lista prodotti, intolleranze, promo, note complete, bottoni Accetta/Rifiuta |

File: `src/features/booking/components/BookingRequestCard.tsx`.

---

## 3. Helper prezzo menù — invariante critico

| Helper | Usato in | Fonte dati |
|--------|----------|------------|
| **`getMenuPriceDisplayFromBooking`** | Pannello **espanso** | Colonne DB `menu_total_per_person`, `menu_total_booking` |
| **`getResolvedMenuPriceDisplay`** | **Digest** card + **calendario** digest | Stessa logica: **DB vince** se `menu_total_per_person > 0`; altrimenti overlay somma `menu_selection.items` (legacy) |

File: `src/features/booking/utils/menuPricing.ts`.  
Fix 29-05-26: [Report-fix-menu-pricing-digest](../Sessioni%20di%20lavoro/29-05-26/Report-fix-menu-pricing-digest-29-05-26.md).

### Regola (non rompere senza test)

Quando `menu_total_per_person > 0` (snapshot salvato al submit in **`booking_requests`**):

- **Digest, calendario ed espanso** devono mostrare lo **stesso** prezzo da `getMenuPriceDisplayFromBooking` / `fromDb`.
- `menu_selection.items` vuoto o con somma ≠ totali DB **non** deve sovrascrivere il prezzo (menù fisso da card vetrina o totali già calcolati dal form).

Overlay da somma righe **solo** se `menu_total_per_person` è assente/null/≤0 **e** `baseTotal > 0` (prenotazioni legacy o solo composizione senza totali salvati).

Test: `src/features/booking/utils/__tests__/menuPricing.test.ts` (INC-01, INC-07, fallback).

---

## 4. Promo

| Fase | Storage / logica |
|------|------------------|
| Cliente vede banner | `restaurant_settings.booking_menu_promos` + risoluzione `resolveMenuPromoForBookingView` in form |
| Submit | Payload `menu_promo_labels` (snapshot label promo viste) |
| DB | `booking_requests.menu_promo_labels` JSONB |
| Admin card | `resolveMenuPromoLabelsForBooking(booking, menuPromos)` — snapshot prima, fallback live per prenotazioni vecchie |

File: `src/features/booking/constants/menuPromo.ts`.

Testo UI: «Promo visualizzate da cliente : …» (digest ed espanso).

---

## 5. Altri campi display

| Campo | Digest | Espanso | Note |
|-------|--------|---------|------|
| Tipo (strip) | `getBookingEventTypeLabel` da `booking_type` | — | Non `event_type` su form pubblico |
| Preset menù | — | `getPresetMenuLabel` + `booking_custom_staff_presets` | Solo se `preset_menu` valorizzato |
| Prodotti | — | Lista `menu_selection.items` | Prezzo riga in UI |
| Intolleranze | — | `dietary_restrictions` JSON | |
| Note | line-clamp digest | testo pieno | Submit può aggiungere prefisso card senza preset |
| Stato | badge `STATUS_CONFIG` | — | `pending` / `accepted` / `rejected` |

---

## 6. Parità altre superfici (29-05-26)

| Superficie | Prezzo menù digest | Prezzo espanso / dettaglio | Promo | Menu prodotti |
|------------|-------------------|---------------------------|-------|---------------|
| **BookingRequestCard** | `getResolvedMenuPriceDisplay` | `getMenuPriceDisplayFromBooking` | sì | espanso |
| **DigestBookingListRow** | `getResolvedMenuPriceDisplay` se `showMenuPricing` / `digestBookingHasMenuContext` | — (apre modal) | no | no |
| **ArchiveBookingCard** | **no** | **no** | **no** | **no** |
| **DetailsTab** | — | **no** | sì | **no** |

---

## 7. Submit → DB (riferimento rapido)

```
BookingRequestForm.mutate({ ...formData, menu_promo_labels, tenantSlug })
  → useCreateBookingRequest → POST /functions/v1/create-booking
  → INSERT booking_requests
       booking_source = 'public'
       status = 'pending'
       source = default 'public_form' (colonna separata)
```

Edge: `supabase/functions/create-booking/index.ts`.  
NON modificare payload submit per fix display — fix in `menuPricing.ts` o UI.

---

## 8. Query debug (TEST `docnnernvp`)

Vedi SELECT aggiornati nel report mappa § «Query verificate».  
Non usare chiavi `booking_vol_au_vent_promo_*` (obsolete).

---

## 9. LOCK / scope agente

- **Questa sessione mappa:** solo documentazione; fix in sessione dedicata Esecuzione.
- Prima di cambiare digest/espanso: leggere report INC-01 e aggiungere test `menuPricing`.
- **PendingRequestsTab:** modali accettazione/rifiuto/capacity sono adiacenti — non documentati qui; vedi `ADMIN_CLASSIC_SKILL.md`.

---

## 10. File correlati

| File | Ruolo |
|------|--------|
| `BookingRequestCard.tsx` | UI digest + espanso |
| `PendingRequestsTab.tsx` | Lista pending, dedup id, modali accept/reject |
| `menuPricing.ts` | Helper prezzi |
| `menuPromo.ts` | Snapshot e fallback promo |
| `presetMenus.ts` | Label preset |
| `bookingTypeMenu.ts` | `bookingTypeUsesMenuSelections` |
| `usePendingBookings` | `select *` da `booking_requests` status pending |
