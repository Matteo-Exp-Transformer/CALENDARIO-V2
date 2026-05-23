# Report — Nome promo menù e snapshot in prenotazione

**Data:** 23-05-26

## Cosa è stato fatto

1. **Impostazioni → Menù → Promo menù** (`MenuPricesTab`): ogni promo ha ora un campo **Nome promozione (solo admin)** obbligatorio al salvataggio. In lista admin vedi il nome (non il testo lungo).
2. **Storage promo** (`restaurant_settings`, chiave `booking_vol_au_vent_promos`): ogni riga JSON include `label` (max 80 car.) oltre a `message`, `booking_types`, `visible_on_booking`.
3. **Storage prenotazione** (`booking_requests.menu_promo_labels`, JSONB): al submit si salvano i nomi delle promo visibili per la tipologia scelta (snapshot storico).
4. **Pagina Prenota cliente** (`BookingRequestForm` + `VolAuVentPromoBannerCards`): invariato — mostra solo il **testo** promo, mai il nome.
5. **Admin — richiesta ricevuta** (`BookingRequestCard`): digest e pannello espanso mostrano «Promo menù: Nome1, Nome2» se presenti.
6. **Admin — modal dettagli** (`DetailsTab` in `BookingDetailsModal`): riga «Promo menù» sotto il tipo prenotazione (solo lettura, valori salvati).
7. **Migrazione** `028_booking_menu_promo_labels.sql` applicata sul DB **test** (`docnnernvp`).

## File toccati

- `src/features/booking/constants/volAuVentPromo.ts` — tipo + helper label
- `src/features/booking/lib/restaurantSettingRegistry.ts` — validazione Zod
- `src/features/booking/components/MenuPricesTab.tsx` — UI nome promo
- `src/features/booking/components/BookingRequestForm.tsx` — invio snapshot
- `src/features/booking/components/AdminBookingForm.tsx` — idem lato admin
- `src/features/booking/hooks/useBookingRequests.ts` + `useAdminBookingRequests.ts`
- `supabase/functions/create-booking/index.ts`
- `src/features/booking/components/BookingRequestCard.tsx` + `DetailsTab.tsx`
- `src/types/booking.ts`, `src/types/database.ts`
- `supabase/migrations/028_booking_menu_promo_labels.sql`
- Test: `volAuVentPromo.test.ts`

## Test

`npm run validate` — **136/136 OK**

## Prossimi passi

- Applicare migrazione `028` su **produzione** quando si deploya.
- Redeploy edge function `create-booking` su produzione.
- Promo esistenti senza `label`: in admin la lista mostra anteprima del testo finché non le modifichi e aggiungi un nome; le prenotazioni future useranno solo promo con nome compilato.
