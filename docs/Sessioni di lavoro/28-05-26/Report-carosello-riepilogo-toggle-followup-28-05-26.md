# Report — Follow-up carosello: admin toggle UI + sticky mini-pannello

**Data:** 28-05-26 · **Profilo:** Esecuzione · **Parent:** `Report-carosello-riepilogo-toggle-offerta-28-05-26.md`  
**Chiusura:** ✅ Matteo «ok funziona» — vedi [report finale](Report-carosello-riepilogo-toggle-finale-28-05-26.md)

---

## Cosa è stato fatto

1. **Personalizza form** — blocco prezzo carosello solo label + input; toggle «Mostra dettaglio offerta» in riga separata (pattern Menù personalizzabile), help solo sotto il toggle.
2. **Helper condivisi** — `getCarouselSlideTitles`, `resolveCarouselSummaryDisplay`, `getCarouselStickyMiniPanelLine`, `formatCarouselPricePerPersonLine` in `bookingPublicFormConfig.ts`.
3. **BookingSummarySidebar** — usa `resolveCarouselSummaryDisplay` (fix: toggle ON senza titoli ma con prezzo → mostra prezzo).
4. **BookingStickyBar** — prop `activeSubTab`; riga testo piano troncata nel mini-pannello (no label/chip).
5. **BookingRequestPage** — passa `activeSubTab` alla sticky bar (solo prop, griglia invariata).

---

## Effetto per il ristoratore

- In admin il testo di aiuto dello switch non è più sotto «Prezzo a persona», ma solo sotto «Mostra dettaglio offerta».
- Su mobile (&lt;1256px), nella barra fissa in basso, se c’è un carosello attivo il cliente vede una riga extra (primo titolo offerta o solo prezzo), senza etichette ridondanti.

---

## Test

`npm run validate` — **OK** (193 test).

---

## File di skill aggiornati

| Skill | Modifica |
|-------|----------|
| `docs/APP_CONTEXT_SKILL.md` | Nota sticky + nota carosello/riepilogo |
| `docs/per-ui-design-skill/BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md` | Layout editor + sticky |
| `docs/BOOKING_DATA_FLOW_SKILL.md` | Nessuno (helper citati in APP_CONTEXT) |
| `docs/SESSION_LOG.md` | Da aggiungere riga se confermato |

---

## Dati comunicazione

Follow-up tecnico su stessa feature; nessuna nuova voce vocabolario.
