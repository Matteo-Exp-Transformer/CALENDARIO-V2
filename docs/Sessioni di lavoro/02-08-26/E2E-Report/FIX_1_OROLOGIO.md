# FIX-1 — Gli stati dei tavoli seguono l'orologio (S4-BUG-1 + S4-BUG-12)

Data: 02-08-26 · Branch: `env/test` · Nessun commit / push

## In una frase

In **Servizio → Mappa**, i colori dei tavoli (In arrivo / Occupato / In ritardo / In uscita) e l'avviso di fine turno ora seguono l'orologio del ristorante, non più un fuso sbagliato di +1/+2 ore. Stessa correzione sull'**ora di punta** in Analytics.

## Cosa faceva di sbagliato (effetto concreto)

Una prenotazione delle **14:50**, alle **15:00**, restava **In arrivo** invece di diventare **Occupato**. Una delle **12:00** restava **In ritardo** e non diventava mai **In uscita**, quindi la finestra «Tavolo a fine turno» non partiva mai.

Causa: l'app salva l'orario come testo con un `+00:00` finto (le cifre sono l'ora a muro). Quasi tutta l'app lo sa e legge le cifre. Lo stato live dei tavoli invece faceva `new Date(...)`, che in Italia d'estate sposta tutto di **+2 ore**.

## Cosa ho cambiato

### 1. Stati live dei tavoli (`useTableStatuses`)

- Confronto **ora a muro ↔ ora a muro** usando gli helper già usati altrove (`getAccurateStartTime` / `getAccurateEndTime`) e nuovi helper in `dateUtils` (`wallClockDateFromISO`, `wallClockDateFromParts`).
- **Niente costante +2**: si usa il calendario locale del browser → corretto sia in ora legale che solare.
- **Fascia oltre mezzanotte**: la data di fine viene dalle cifre di `confirmed_end` (già giorno dopo quando serve).
- **Buffer di riassetto (D37)**: sì, l'ho aggiunto. «In uscita» scatta a **fine pasto + buffer**, non solo a `confirmed_end`. Motivo: l'avviso dice che i posti sono già di nuovo disponibili; la capienza si libera a fine finestra di occupazione (pasto + pulizia). Buffer da snapshot sulla prenotazione se c'è, altrimenti dalla fascia selezionata (passato dalla mappa Servizio).

### 2. Analytics — ora di punta (S4-BUG-12)

- Stesso errore: `new Date(...).getHours()` spostava il turno.
- Ora usa `wallClockHourFromISO` (cifre a muro).

### 3. Snapshot occupancy in `useTableAssignments`

- **Non toccato**, come richiesto: fa aritmetica fra due istanti e ri-serializza; il difetto era solo nei confronti con «adesso».

### 4. Helper in `dateUtils`

- `wallClockDateFromParts`, `wallClockDateFromISO`, `wallClockHourFromISO`
- `isWallClockStartBeforeNow` riusa `wallClockDateFromParts` (stesso comportamento)

## Test

File: `src/features/booking/hooks/__tests__/useTableStatuses.test.ts` (riscritto/esteso) + sezione F in `CONTROLLA_ORARIO-PRENOTAZIONI.test.ts`.

Casi aggiunti / rafforzati:

| Caso | Atteso |
|------|--------|
| 14:50 → alle 15:00 | Occupato (sintomo E2E 3-2) |
| 14:30 → alle 15:00 | In ritardo (3-3) |
| 12:00–15:30 → alle 15:30 | In uscita (3-4) |
| Fascia 23:00–01:00 | overnight corretto |
| Estate vs inverno stessa ora a muro | stesso stato (no +2 hardcoded) |
| Buffer 15' | In uscita solo a end+15 |
| Snapshot buffer sulla prenotazione | ha priorità |

**Verifica fallimento sul codice vecchio:** con il confronto `new Date(iso)` ripristinato a mano, **20/24** test di `useTableStatuses` fallivano; con il fix, **24/24** passano.

`npm run validate`: **verde** (147 file, 1227 test).

Nota: nel working tree c'era lavoro parallelo FIX-2 (`served_at`, turni). Per far passare typecheck/validate ho allineato `served_at` in `database.ts` e corretto un click ambiguo nel test FIX-2 UI — non è parte del mandato FIX-1, ma bloccava la chiusura.

## Cosa riprovare a mano (Servizio → Mappa)

1. Prenotazione di oggi con arrivo **pochi minuti fa** → dopo ~30s: **Occupato** (non In arrivo).
2. Arrivo **>15 minuti fa**, ancora dentro la durata → **In ritardo**.
3. Arrivo + durata (e buffer fascia se >0) già passati → **In uscita** + finestra «Tavolo a fine turno».
4. Opzionale: fascia serale che passa la mezzanotte (se ne hai una).
5. Analytics con filtro Pranzo/Cena: l'ora di punta non deve più risultare spostata di 2 ore rispetto al Calendario.

## File toccati (FIX-1)

- `src/features/booking/hooks/useTableStatuses.ts`
- `src/features/booking/hooks/useAnalytics.ts`
- `src/features/booking/utils/dateUtils.ts`
- `src/features/booking/components/servizio/AssignmentMapPanel.tsx` (passa il buffer fascia)
- `src/features/booking/hooks/__tests__/useTableStatuses.test.ts`
- `src/features/booking/utils/__tests__/CONTROLLA_ORARIO-PRENOTAZIONI.test.ts`

## La tua lettura della sessione

Il bug era esattamente quello della diagnosi in SINTESI: un solo punto che ancora trattava gli orari come UTC veri. Il pezzo delicato non era «aggiungere +2», ma confrontare muri con muri e gestire mezzanotte/DST senza costanti. Il buffer D37 era un miglioramento coerente col testo dell'avviso fine turno: senza di esso l'avviso sarebbe partito durante il riassetto, quando la capienza non è ancora libera.
