# Report — Avviso orario notturno (UX copy) — non revisionato da Claude

**Data**: 17-05-2026  
**Branch**: `Sviluppo-Dashboard-laterale`  
**Agente**: Cursor (Auto)

## Obiettivo

Allineare i messaggi quando una fascia ha **fine prima dell’inizio** (es. cena 22:00 → 02:00): un solo testo chiaro in italiano, senza sigle confuse in lista.

## Cosa è stato fatto (in ordine)

1. **Testo unificato** — costante `OVERNIGHT_TIME_END_HINT` in `bookingTimeSlots.ts`: «Orario notturno — l'orario di fine cade nel giorno successivo.» (sostituisce le vecchie diciture «Fascia notturna…»).

2. **Pagina Servizio (Pro)** — nel modal Nuova/Modifica fascia l’avviso giallo compare sotto i selettori orario quando fine &lt; inizio. Nella **lista** fasce (`SlotRow`) rimosso `(notturna +1)` accanto all’orario: resta solo `22:00 → 02:00`.

3. **Impostazioni Classic** — nella sezione «Imposta Fasce Orarie» (`!features.servizio`) l’avviso compare sulle card Colazione/Pranzo/Cena quando quella fascia è notturna, con lo stesso testo del modal Servizio.

4. **Skill** — aggiornati `APP_CONTEXT_SKILL.md`, `ADMIN_CLASSIC_SKILL.md`, `ADMIN_PAGES_CONTEXT.md` con regole su dove mostrare/nascondere l’avviso.

## File toccati

| File | Perché |
|------|--------|
| `src/features/booking/utils/bookingTimeSlots.ts` | `OVERNIGHT_TIME_END_HINT` + `slotCrossesMidnight` |
| `src/features/booking/components/servizio/ServiceSlotsManager.tsx` | Avviso nel modal; niente `(notturna +1)` in lista |
| `src/features/booking/components/RestaurantSettingsTab.tsx` | Avviso sulle 3 fasce solo in Classic |
| `docs/APP_CONTEXT_SKILL.md` | RULE avviso notturno |
| `docs/ADMIN_CLASSIC_SKILL.md` | Stato `RestaurantSettingsTab` |
| `docs/Dashboard-laterale-skill/ADMIN_PAGES_CONTEXT.md` | Sezione fasce Servizio |

## Contesto sessione correlata

Nella stessa giornata era già stato completato l’**unificazione selettore orario** (`TimePicker24h` ovunque, `TimeInput` eliminato) — vedi `Report-unificazione-selettore-orario.md`.

## Domande all’utente

- Conferma copy «Orario notturno…» al posto di «Fascia notturna…».
- Rimozione `(notturna +1)` da tutte le liste; avviso completo solo in modal Servizio + Impostazioni Classic.

## Test

- `npm run typecheck` → verde (in questa sessione di chiusura).

## Cosa resta

- Verifica visiva: lista Servizio senza sigla; modal e Impostazioni Classic con avviso su fascia 22:00–02:00.

## Deviazioni

Nessuna su logica DB o `slotCrossesMidnight` — solo copy e punti di UI.
