# Report — Carosello Prenota: editor foto-first, campi per slide, UX admin

**Data:** 26-05-26  
**Area:** Admin → Personalizza form → Carosello + pagina Prenota (`/prenota/:slug`)

## Obiettivo

- Editor **Carosello**: foto obbligatoria prima dei campi; ogni slide con testi/icona propri; **nessun prezzo**.
- Pagina Prenota: overlay **per slide** da `carousel_items[]`.
- UX admin: etichette campi, «Foto N° X», modifica foto, pannelli sottotab apribili/chiudibili.

## Cosa vede il ristoratore

| Admin | Effetto |
|-------|---------|
| Carosello vuoto | Solo «Aggiungi foto» |
| Dopo upload | Card slide: **Foto N° 1** a destra dell’anteprima; **Testo Etichetta**, **Testo Titolo**, **Scegli Icona**, **Testo Descrizione** |
| Matita accanto al cestino | Sostituisce la foto (testi restano) |
| «Aggiungi altra foto» | Nuova slide con campi indipendenti |
| Riga «CAROSELLO N — …» + **Modifica** | Apre l’editor; **Chiudi** richiude (toggle) |
| Salva (editor sottotab) | Persiste su DB e chiude il pannello |

| Cliente Prenota | Effetto |
|-----------------|---------|
| Carosello | Ogni foto con i suoi testi |
| Sottotab carosello | Nessun prezzo in riepilogo |

## Modifiche tecniche

| File | Modifica |
|------|----------|
| `BookingFormCarouselEditor.tsx` | **Nuovo** — foto-first, card per slide, UI label |
| `BookingFormConfigPanel.tsx` | Solo carosello usa editor nuovo; sottotab salvate collassabili (`embedded`) |
| `bookingPublicFormConfig.ts` | `migrateLegacyCarouselSubTab`, parse `icon` su slide |
| `MenuHomepageConfigPanel.tsx` | Export `useCarouselPhotoUpload` + `replaceAt` |
| `BookingRequestForm.tsx` | `BookingSubTabCarousel` per item; no prezzo carosello |
| `BookingSubTabCards.tsx` | No prezzo/descrizione su pillola carosello |
| `menu.ts` | `CarouselSlideIcon`, `CarouselItem.icon` |

### Label UI editor slide (admin)

| UI | JSON |
|----|------|
| Testo Etichetta | `carousel_items[i].eyebrow` |
| Testo Titolo | `carousel_items[i].title` |
| Scegli Icona | `carousel_items[i].icon` |
| Testo Descrizione | `carousel_items[i].description` |

## Storage

`restaurant_settings.booking_public_form_config` → `booking_modes[].sub_tabs[].carousel_items[]` (JSONB). Foto: bucket `menu-photos`, path `booking-form-{modeId}-{tabId}/carousel/…`.

Nessuna migrazione SQL.

## Verifica

- `npm run typecheck` + `npm run lint` — OK
