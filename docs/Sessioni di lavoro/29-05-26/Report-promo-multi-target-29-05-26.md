# Report — Correzione abbinamenti multi-target promo (29-05-26)

Follow-up alla sessione [Report promo Personalizza form](Report-promo-personalizza-form-29-05-26.md).

## Obiettivo

Allineare il modello promo alla regola prodotto: **una promo → N tipologie o N sottotab** (senza duplicati nella stessa promo), con **unicità globale** per ogni tipologia/sottotab tra promo diverse.

## Modifiche

### Modello `MenuPromo`

- `booking_type?` → **`booking_types: BookingType[]`** se `placement === 'booking_type'`
- `sub_tab_ref?` → **`sub_tab_refs: MenuPromoSubTabRef[]`** se `placement === 'sub_tab'`
- Migrazione lettura: singolari → array; legacy `booking_types[]` normalizzato; regola (A) **per target** (strip overlap, `placement: 'none'` se array vuoto)
- Helper: `dedupeBookingTypes`, `dedupeSubTabRefs`, `promoMatchesBookingType`, `promoMatchesSubTab`, `subTabRefKey`

### Admin `BookingFormPromoSection`

- Checkbox multi-selezione tipologie e sottotab
- Riepilogo lista: tipologie separate da virgola; conteggio card con modalità

**Aggiornamento UI (29-05-26 sera):** vedi § *Follow-up UI abbinamento* in [Report promo Personalizza form](Report-promo-personalizza-form-29-05-26.md) — rimosso menu placement; pannelli sempre visibili; 0/1/2/tutte; abbinamento opzionale.

### Prenota + snapshot

- `resolveMenuPromoForBookingView`: match su array (`includes` / `some`)
- Tracciamento viste e submit invariati (dedup per `promo.id` / label)

### Edge

- `create-booking` fallback: `booking_types.includes(booking_type)` (+ compat `booking_type` singolo)

## Verifica automatica

- `npm run validate` — **OK** (29-05-26): lint + typecheck + **211** test (**21** `menuPromo.test.ts`, inclusi multi-tipologia, migrazione (A), duplicati intra/inter promo, normalize placement).

## QA manuale (29-05-26)

Tenant **test-pro** (`/prenota/test-pro`), admin `test-pro@p.com` (credenziali in `.env.local.test`).

| ID | Test | Esito | Note |
|----|------|-------|------|
| F1 | Promo con `booking_types: [menu_prezzo_fisso, tavolo]` visibile su **Prenota** e **Menu fisso** | **OK** | Banner su entrambe; assente su Rinfresco (non in array) |
| A3 | Riepilogo admin multi-tipologia in lista | **OK** | «Menu a prezzo fisso, Prenota un tavolo» |
| A4–A6 | Conflitto globale / 2 card stessa promo (UI) | **Non testato** | Coperto da `validateMenuPromoUniqueness` in unit test |
| C5 | Submit + snapshot multi-label in admin | **Non testato** | Da fare su prenotazione reale di prova |

## QA manuale responsive (29-05-26)

Stessi casi funzionali su **375 / 834 / 1280** — vedi tabella responsive in [Report promo Personalizza form](Report-promo-personalizza-form-29-05-26.md). Esito: **OK** su C1–C3 e admin A2/B1 per tutti e tre i viewport; comportamento multi-tipologia invariato al cambio larghezza.

## Follow-up aperti

- **FU-001** (`docs/FOLLOW_UP.md`): polish modal calendario dettaglio promo — non toccato.

## File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md` | §3 punto Messaggio Promozionale | Modello array + validazione |
| `.cursor/skills/calendarbackup-app-context/SKILL.md` | Riga promo 29-05-26 | Puntatore entrambi i report |
