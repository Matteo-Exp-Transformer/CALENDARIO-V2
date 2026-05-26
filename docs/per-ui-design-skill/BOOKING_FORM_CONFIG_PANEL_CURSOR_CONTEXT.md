---
name: booking-form-config-panel-cursor-context
description: >-
  Contesto obbligatorio per agenti Cursor che modificano la sezione admin
  Personalizza form della Pagina Prenota v2.
---

# Cursor Context — Personalizza Form Prenota

> Leggere prima di modificare `BookingFormConfigPanel`, `bookingPublicFormConfig`,
> `BookingRequestPage` o `restaurantSettingRegistry` per `booking_public_form_config`.

## Workflow consigliato

1. Leggi `APP_CONTEXT_SKILL.md` §4 RULE Pagina Prenota v2.
2. Leggi interamente:
   - `src/features/booking/components/settings/BookingFormConfigPanel.tsx`
   - `src/features/booking/constants/bookingPublicFormConfig.ts`
   - `src/features/booking/lib/restaurantSettingRegistry.ts`
   - `src/pages/BookingRequestPage.tsx`
3. Capisci se il cambio e solo UI admin o se cambia il JSON salvato in `booking_public_form_config`.
4. Se cambia il JSON, aggiorna insieme:
   - type/default/normalizer in `bookingPublicFormConfig.ts`
   - parse fallback in `restaurantSettingRegistry.ts`
   - render pubblico in `BookingRequestPage.tsx`
   - controllo admin in `BookingFormConfigPanel.tsx`
5. Mantieni la UI leggera: controlli vicini al campo, label brevi, anteprima sul campo stesso.
6. Esegui `npm run typecheck` e `npm run lint`.

## Stato attuale

- Sezione admin: `BookingFormConfigPanel`, blocco **Intestazione pagina Prenota**.
- Campi testo:
  - nome azienda: solo lettura, letto da `restaurant_name`/tenant; modifica altrove in Anagrafica Azienda.
  - titolo: `page_title`
  - descrizione: `page_description`
- Stile header pubblico:
  - `header_styles.restaurant_name`
  - `header_styles.page_title`
  - `header_styles.page_description`
- Ogni stile contiene:
  - `font`: id presente in `BOOKING_HEADER_FONT_OPTIONS`
  - `color`: hex `#RRGGBB`
- Nome azienda e titolo pubblico hanno la stessa scala grande; descrizione resta piu piccola. Non lasciare che il font scelto cambi la gerarchia dimensionale.

## Font header

Fonte unica: `BOOKING_HEADER_FONT_OPTIONS` in `bookingPublicFormConfig.ts`.

Per aggiungere un font:
1. Aggiungi `{ id, label, fontFamily }` a `BOOKING_HEADER_FONT_OPTIONS`.
2. Se e un Google Font libero, aggiungi la famiglia all'`@import` in `src/index.css`.
3. Se e un font commerciale o locale (es. Mistral, Thirsty Script), non incorporare file font senza licenza: usa il nome font + fallback CSS.
4. Verifica che `parseBookingHeaderStylesFromUnknown` accetti il nuovo id automaticamente.

Per rimuovere un font:
1. Rimuovilo da `BOOKING_HEADER_FONT_OPTIONS`.
2. Se era caricato solo per quello, rimuovilo dall'`@import` in `src/index.css`.
3. Lascia il parser com'e: valori salvati non piu ammessi tornano ai default.

Font attuali:
- Playfair Display
- Cormorant Garamond
- Libre Baskerville
- Cinzel
- Montserrat
- Mistral (fallback locale/script, non webfont incorporato)
- Thirsty Script (fallback locale/script, non webfont incorporato)

## Icone modalita

- Fonte unica: `BOOKING_MODE_ICONS`.
- Render pubblico e admin usano Phosphor outline.
- Se aggiungi/rimuovi un'icona, aggiorna `BOOKING_MODE_ICONS`, `ICON_OPTIONS`, `ModeIcon` admin e `ModeIcon` pubblico.

## Cosa evitare

- Non aggiungere un secondo blocco di anteprima sotto i campi header.
- Non duplicare validazioni del parser dentro il componente.
- Non salvare dimensioni font configurabili per l'header pubblico senza richiesta esplicita: la gerarchia visuale e governata dal layout.
- Non usare font commerciali via `@font-face` o CDN non ufficiale senza licenza verificata.
