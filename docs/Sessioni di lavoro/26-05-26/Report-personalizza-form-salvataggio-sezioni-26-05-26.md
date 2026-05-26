# Report — Personalizza form: salvataggio per sezione e footer

**Data:** 26-05-26  
**Area:** Admin → Impostazioni → tab Personalizza form

## Obiettivo

Ripristinare il footer «Salva modifiche / Annulla modifiche» in fondo pagina, affiancare **Annulla modifiche** al pulsante **Salva** piccolo su ogni sezione (solo quella card), e rimuovere il flusso «Conferma selezione sfondo».

## Cosa vede il ristoratore

| Dove | Comportamento |
|------|----------------|
| Sopra ogni card (Intestazione, Modalità, Sfondo) | **Annulla modifiche** + **Salva** — valgono solo per quella sezione |
| In fondo alla tab Personalizza form | Barra che compare **solo se** c’è almeno una modifica — salva o annulla **tutto** il non salvato |
| Sfondo Prenota | Si sceglie la texture/gradiente e si salva subito con Salva della sezione (niente più pulsante «Conferma selezione sfondo») |

## Modifiche tecniche

### `BookingFormConfigPanel.tsx`

- `SectionActionBar`: Annulla + Salva per sezione.
- Dirty separati: `headerDirty`, `modesDirty`; salvataggio parziale su DB (`saveHeaderSection`, `saveModesSection`).
- Footer condizionale `pageHasUnsaved` (form + sfondo).

### `RestaurantSettingsTab.tsx`

- Rimossi `bookingBgSelectionLocked`, `handleBookingBgConfirmOrCancel`, toast e UI «Conferma selezione sfondo».
- `handleSaveBookingBackgroundOnly` / `handleCancelBookingBackgroundOnly` senza step di conferma intermedio.
- Tab Anagrafica: footer in fondo solo se `dirty`.

### Documentazione

- `docs/per-ui-design-skill/BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md`
- `docs/APP_CONTEXT_SKILL.md` (RULE Personalizza form)

## Storage (Supabase)

| Chiave `restaurant_settings` | Sezione Salva piccolo |
|------------------------------|------------------------|
| `booking_public_form_config` (header) | Intestazione |
| `booking_public_form_config` (modes) | Modalità |
| `public_booking_page_background` | Sfondo Prenota |

## Verifica

- `npm run typecheck` — OK
