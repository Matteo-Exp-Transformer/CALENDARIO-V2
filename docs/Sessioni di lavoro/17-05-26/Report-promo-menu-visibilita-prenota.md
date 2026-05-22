# Report — Promo menù: visibilità in pagina Prenota

**Data**: 17-05-2026  
**Branch**: Sviluppo-Dashboard-laterale  
**Area**: Admin → tab **Menu** → **Promozioni Menù** · form pubblico **Prenota** (`BookingRequestForm`)

## Problema segnalato

Il ristoratore creava promo in **Promozioni Menù** ma non comparivano nel form **Prenota**. In admin compariva l’avviso: «La visibilità promo in pagina Prenota è disattivata a livello di impostazione».

## Causa

Due livelli di visibilità erano previsti in codice:

| Livello | Storage (`restaurant_settings`) | Stato |
|--------|----------------------------------|--------|
| Globale | `booking_vol_au_vent_promo_visible` | Default `false`, **nessuna UI** per attivarlo |
| Per promo | `booking_vol_au_vent_promos[]` → `visible_on_booking` | Occhio nella lista (già presente) |

Il form pubblico richiedeva **entrambi** veri; con il flag globale spento le promo non uscivano mai, anche con occhio aperto.

## Soluzione (finale)

1. **Rimosso** il controllo del flag globale da Prenota, admin nuova prenotazione e dettaglio prenotazione (`MenuTab`).
2. **Unica leva UX**: occhio su ogni riga promo in **Promozioni Menù** (`StaffPresetsVisibilityIconButton`, variant `volPromo`).
3. **Rimossa** la checkbox «Mostra le promo in pagina Prenota» (ridondante rispetto all’occhio).
4. **Testo guida** nell’editor: «In pagina Prenota ogni promo è visibile solo se l’occhio nella lista è aperto…».

La funzione `listVolAuVentPromoMessagesForBookingType` filtra già per tipologia prenotazione e `visible_on_booking !== false`.

## Cosa vede il ristoratore

- **Menu → Crea / Modifica Promo Menù**: crea promo, associa tipologie (tavolo / rinfresco / menù fisso), usa l’**occhio** per mostrare o nascondere in Prenota.
- **Prenota**: sotto il menu a tendina «Prenota un tavolo / …» compaiono i box promo solo se occhio aperto **e** tipologia scelta coincide.

## File toccati

| File | Modifica |
|------|----------|
| `MenuPricesTab.tsx` | Niente checkbox globale; hint occhio; salvataggio solo `booking_vol_au_vent_promos` |
| `BookingRequestForm.tsx` | Banner promo se `volAuVentPromoBannerMessages.length > 0` |
| `AdminBookingForm.tsx` | Idem |
| `BookingDetailsModal.tsx` | Rimosso passaggio flag globale a `MenuTab` |
| `MenuTab.tsx` | Banner promo solo da messaggi filtrati |

**Storage invariato:** chiave `booking_vol_au_vent_promos` (JSON array promo). Il flag `booking_vol_au_vent_promo_visible` resta in registry/DB ma **non è più letto** dall’UI pubblica/admin per i banner.

## Test

- `npm run typecheck` → verde (pre-commit)

## Verifica manuale consigliata

1. Admin → Menu → Promo: crea promo per «Rinfresco di Laurea», occhio **aperto**.
2. Apri pagina Prenota, scegli **Rinfresco di Laurea** → deve comparire il box promo.
3. Chiudi occhio sulla promo → ricarica Prenota → box assente.
4. Stessa promo con tipologia solo «tavolo» → non compare se il cliente sceglie Rinfresco.

## Allineamento skill

- `docs/APP_CONTEXT_SKILL.md` §4 — nota promo Prenota (occhio per riga)
