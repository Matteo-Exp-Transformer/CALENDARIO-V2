# Pagina Prenota — Mappa limiti testo (1:1)

> Fonte numeri: `src/features/booking/constants/bookingPrenotaTextLimits.ts`.  
> Aggiornare questo file quando cambiano le costanti.

Legenda colonna **Limite in UI**:
- `admin-contatore` — Personalizza form / Anagrafica / Tab Menu: `N/max` visibile al ristoratore.
- `sistema-silenzioso` — cap in input/validazione/edge; **nessun** contatore né hint al cliente.
- `layout` — non è un cap caratteri (fontSize px, line-clamp CSS).

---

## A. Header (`BookingRequestPage`)

| Superficie UI | Componente | Storage / chiave | Dove si edita | Max char | Limite in UI | Note |
|---------------|------------|------------------|---------------|----------|--------------|------|
| h1 nome locale | `BookingRequestPage` | `restaurant_settings.restaurant_name` | Anagrafica Azienda | **45** | admin-contatore | Anteprima read-only in Personalizza form; legacy >45: clamp in lettura + al salvataggio |
| h2 titolo pagina | idem | `booking_public_form_config.page_title` | Personalizza form | 50 | admin-contatore | |
| p intro | idem | `page_description` | Personalizza form | 120 | admin-contatore | |
| fontSize header | inline style | `header_styles.*.fontSize` | Personalizza form | 8–38 (nome/titolo), **22** (descrizione) | layout | `BOOKING_HEADER_FONT_SIZE_MAX_BY_TARGET` |

---

## B. Tipologie (`BookingModeCards`)

| Superficie UI | Storage | Max | Limite in UI | Visibilità pubblica |
|---------------|---------|-----|--------------|---------------------|
| Titolo card | `booking_modes[].label` | 40 | admin-contatore | Sempre |
| Descrizione breve | `booking_modes[].description` | 61 | admin-contatore | Solo ≥700px; `line-clamp-2/3` |

---

## C. Sottotab card (`BookingSubTabCards` + `MenuSelection`)

| Superficie UI | Storage | Max | Limite in UI | Visibilità pubblica |
|---------------|---------|-----|--------------|---------------------|
| Titolo card | `sub_tabs[].label` | 24 | admin-contatore | Card: `line-clamp-2` |
| Descrizione sottotab | `sub_tabs[].description` | 79 | admin-contatore | **Non** sulla card; sotto sezione menù in `MenuSelection` |
| Numero portate | `sub_tabs[].courses_label` | 12 | admin-contatore | Card `display='cards'`: footer basso sx (`line-clamp-1`); non in carosello |
| Nome carosello (admin) | `sub_tabs[].label` (carousel) | 24 | admin-contatore | Solo admin / riepilogo interno |

Fallback descrizione menù da preset staff (`MenuPricesTab`): max **80** (campo descrizione menù consigliato).

---

## D. Carosello (`BookingSubTabCarousel`)

| Campo slide | Storage | Max | Limite in UI |
|-------------|---------|-----|--------------|
| Etichetta (eyebrow) | `carousel_items[].eyebrow` | 19 | admin-contatore |
| Titolo | `carousel_items[].title` | 18 | admin-contatore |
| Descrizione | `carousel_items[].description` | 38 | admin-contatore |

Normalizer: `normalizeCarouselSlideItem` + migration `040_clamp_booking_carousel_slide_text_limits.sql`.

---

## E. Menù ingredienti (Tab Menu → pubblico)

| Superficie UI | Storage | Max oggi | Limite in UI | Follow-up |
|---------------|---------|----------|--------------|-----------|
| Nome categoria (h3 overlay) | `menu_categories.label` | nessuno | — | FU: cap layout |
| Nome ingrediente | `menu_items.name` | nessuno | — | FU: cap layout |
| Descrizione ingrediente | `menu_items.description` | nessuno | — | FU: cap layout |
| Teaser card chiusa | hardcoded | «Scopri cosa è incluso» | — | Non editabile |

---

## F. Promo (`MenuPromoBannerCards`)

| Superficie UI | Storage | Max | Limite in UI |
|---------------|---------|-----|--------------|
| Messaggio banner | `booking_menu_promos[].message` | 200 | admin-contatore |
| Nome promo (admin) | `.label` | 60 | admin-contatore (non in pagina pubblica) |

---

## G. Footer contatti (`BookingRequestPage`)

| Superficie UI | Storage | Max (Zod) | Limite in UI |
|---------------|---------|-----------|--------------|
| Email | `contact_email` | 200 | admin-contatore (Anagrafica) |
| Telefono | `contact_phone` | 50 | admin-contatore |
| Indirizzo | `contact_address` | 200 | admin-contatore |

---

## H. Campi cliente (form prenotazione)

| Campo | Componente | Storage submit | Max | Limite in UI | Validazione |
|-------|------------|----------------|-----|--------------|-------------|
| Nome completo | `BookingFormFields` | `client_name` | 65 | sistema-silenzioso | UI + `validate()` + edge |
| Email | idem | `client_email` | 65 | sistema-silenzioso | idem |
| Telefono | idem | `client_phone` | 30 | sistema-silenzioso | idem |
| Ospiti | idem | `num_guests` | 999 | sistema-silenzioso | numero, non testo |
| Intolleranze | `DietaryRestrictionsSection` | `dietary_restrictions` (JSONB) | 550 (somma testi) | sistema-silenzioso | idem |
| Altre richieste | idem | `special_requests` | 550 | sistema-silenzioso | idem |

Messaggio errore unico al submit: **`Testo troppo lungo`** (senza numero in UI).

Edge function: `supabase/functions/create-booking/index.ts` — costanti duplicate con commento sync (Deno).

---

## I. Riepilogo sidebar

Testi derivati (modalità, offerta carosello, nomi piatti) ereditano i limiti della sorgente (A–H).
