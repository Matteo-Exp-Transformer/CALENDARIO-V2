# Report — Prenota v2: overlay carosello da campi Personalizza form

**Data:** 26-05-26  
**Area:** Pagina Prenota pubblica (`/prenota/:slug`) — sottotab Carosello

## Obiettivo

Allineare il testo mostrato sulle foto del carosello pubblico ai campi compilati in **Admin → Impostazioni → Personalizza form → editor Carosello**, eliminando il fallback hardcoded «Specialità della casa» e mostrando anche descrizione e prezzo.

## Cosa vede il ristoratore

| Schermata admin (Personalizza form) | Cosa vede il cliente sulla foto del carosello |
|-------------------------------------|-----------------------------------------------|
| **Etichetta card** | Riga piccola maiuscola in basso (es. «Ordine campi:») |
| **Titolo slide** | Titolo grande sotto l’etichetta |
| **Descrizione breve** | Testo descrittivo sotto il titolo (prima assente) |
| **Prezzo a persona** | Riga «14,00€ a persona» (prima assente) |
| **Aggiungi foto** | Solo le immagini; il testo è condiviso su tutte le slide della sottotab |

Il cliente **non** vede più «SPECIALITÀ DELLA CASA» se non l’ha configurato (quel testo era un fallback del Menu QR, non dei campi Prenota).

## Problema tecnico

`BookingSubTabCarousel` in `BookingRequestForm.tsx` leggeva:

- `carousel_items[].eyebrow` + fallback «Specialità della casa»
- `carousel_items[].description`

L’admin Prenota invece salva su **`SubTab`**:

| Campo UI | Chiave JSON |
|----------|-------------|
| Etichetta card | `sub_tabs[].label` |
| Titolo slide | `sub_tabs[].carousel_items[0].title` |
| Descrizione breve | `sub_tabs[].description` |
| Prezzo a persona | `sub_tabs[].price_per_person` |
| Foto | `sub_tabs[].carousel_items[].image_url` |

## Modifiche

### `BookingRequestForm.tsx`

- `BookingSubTabCarousel` riceve `subTab: SubTab` (non solo `carousel_items[]`).
- Overlay: `label` → etichetta; `carousel_items[0].title` (o `item.title` per slide) → titolo; `description` → corpo; `price_per_person` → etichetta prezzo (stesso formato di `BookingSubTabCards`).
- Rimosso import `CarouselItem` non usato.

### Documentazione skill

- `docs/per-ui-design-skill/BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md` — mappatura admin → overlay pubblico.
- `docs/APP_CONTEXT_SKILL.md` — RULE Pagina Prenota v2 (carosello overlay).
- `docs/SESSION_LOG.md` — voce sessione.
- `.cursor/skills/calendarbackup-app-context/SKILL.md` — puntatore report.

## Storage (Supabase)

| Dato | Tabella / chiave | Campo |
|------|------------------|-------|
| Config form Prenota | `restaurant_settings` → `booking_public_form_config` | `booking_modes[].sub_tabs[]` |
| Foto carosello | bucket `menu-photos` | URL in `carousel_items[].image_url` |

Nessuna migrazione DB.

## Verifica

- `npm run typecheck` — OK
- Manuale: aprire `/prenota/:slug`, selezionare tipologia con sottotab Carosello attiva; controllare etichetta, titolo, descrizione e prezzo su ogni slide con foto.
