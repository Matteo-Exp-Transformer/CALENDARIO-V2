# Report — Pallino assegnazione tavolo + pulizia UI digest

**Data**: 19-05-2026  
**Branch**: `Sviluppo-Dashboard-laterale`  
**Validate finale**: ✅ 0 errori lint, 0 errori TS, 112 test verdi

---

## Cosa è stato fatto

### Fase 0 — Restyling card digest (BookingCalendar.tsx)

- Rimossa prop `slot` da `DigestBookingListRow` (era stringa `'morning'|'afternoon'|'evening'` usata solo per color inline ormai obsoleti).
- Card digest: stile inline `backgroundColor` rimosso → `bg-surface border-(--color-border)` (token).
- Badge "Da assegnare": `bg-amber-100 text-amber-800` → `bg-(--color-status-pending)/15 text-(--color-status-pending)`.
- `DigestSlotHeader`: nuovo componente che sostituisce `digestSlotHeaderChromeStyle()`. Stile: `bg-primary-50 border-(--color-border) h-56px rounded-xl shadow-sm`.
- Layout colonne digest: da `flex flex-col gap-2` a `grid grid-cols-1 sm:grid-cols-2 gap-2 items-start` per le 6 sezioni slot (3 con-menù + 3 solo-tavolo).

### Fase 1a — Layout griglia 2 colonne desktop

Incluso nella Fase 0. Le 6 sezioni usano `sm:grid-cols-2` per sfruttare lo spazio su schermi ≥640px.

### Fase 1b — QuickTableAssignModal.tsx (file nuovo)

Nuovo componente modale accessibile cliccando il pallino grigio di una card digest:
- Selezione sala (chip), poi griglia tavoli con stato libero/occupato via `getTableStatus`.
- `derivedSlot`: trova la fascia automaticamente tramite `bookingStartsInServiceSlot` — nessuna scelta utente.
- Chiama `useAssignBookingToTable().mutate(...)` e si chiude su successo.
- Mostra messaggio "Configura sale e tavoli in Servizio" se non c'è configurazione.
- Mostra avviso se l'orario non corrisponde a nessuna fascia.

### Fase 1c — Rimozione sezione "Aree di posizionamento" (RestaurantSettingsTab.tsx)

Rimossa completamente la sezione `<section aria-labelledby="placement-areas-heading">`:
- Costanti `DEFAULT_PLACEMENT_AREAS`, `PLACEMENT_AREA_MAX_LENGTH`.
- Funzione `normalizePlacementAreas`.
- Query `placementAreasQuery`, stato `placementAreas`, stato editing (`editingPlacementAreaIndex`, `editingPlacementAreaDraft`).
- 5 handler: `handleAddPlacementArea`, `handleStartEditPlacementArea`, `handleCancelEditPlacementArea`, `handleSavePlacementArea`, `handleRemovePlacementArea`.
- Rimossi da payload upsert: `{ key: 'booking_placement_areas', value: placementAreas }`.
- Import lucide rimasti: `Store, Loader2, Eye, Clock` (rimossi `Plus, Edit, Trash2, Save, X`).

---

## File toccati

| File | Tipo modifica |
|------|--------------|
| `src/features/booking/components/BookingCalendar.tsx` | LOCK core — restyling, pallino, QuickTableAssignModal mount |
| `src/features/booking/components/QuickTableAssignModal.tsx` | NUOVO |
| `src/features/booking/components/RestaurantSettingsTab.tsx` | LOCK strutturale — rimozione placement areas |

---

## File skill aggiornati

- `docs/ADMIN_CLASSIC_SKILL.md` — sezione 4 aggiornata con novità 19-05-26
- `docs/Dashboard-laterale-skill/ADMIN_PAGES_CONTEXT.md` — paragrafo "Accesso rapido da Calendario" aggiunto sotto Assegnazione tavoli

---

## Fase 2 — Non iniziata

Il piano Fase 2 (N fasce dinamiche in Classic) è stato prodotto da sub-agent e salvato in `C:\Users\matte.MIO\.cursor\plans\fase2-n-fasce-dinamiche-classic.md`. Non è stato eseguito — richiede conferma esplicita dell'utente prima di procedere.

---

## Note tecniche

- `hasTurnsFeature = features.servizio && serviceSlots.length > 0` — condizione che governa pallino + modal.
- `assignedBookingIds: Set<string>` — derivato da `tableAssignments` filtrando `checked_out_at === null`.
- Click pallino verde = no-op per design (liberare richiede Servizio → Mappa, non un quick modal).
- Query key condivisa: `TABLE_ASSIGNMENTS_QUERY_KEY` — aggiornamento coerente tra Calendario e Servizio.
