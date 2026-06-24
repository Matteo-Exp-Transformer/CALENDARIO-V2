# ADMIN — Home e Analytics Context

> Home e Analytics sono viste Pro/Enterprise di riepilogo e controllo. Non configurano il prodotto
> pubblico, ma leggono booking e settings per decisioni operative.

## 1. Home

`AdminHomePage` viene renderizzata come `bodyOverride` dentro `AdminDashboard`.

Elementi:

- titolo Home;
- quick nav Servizio;
- quick action `Aggiungi walk-in`;
- quick action `Briefing turno`;
- card statistiche: prenotazioni oggi, coperti confermati, in attesa di conferma;
- lista prossime 3 ore.

Hook:

- `useHomeStats`
- `useBookingStats`
- `useRestaurantSetting('business_hours')`
- `useFeatures`

## 2. Home data flow

`useHomeStats` legge `booking_requests` con stati `pending` e `accepted`.

- `totalToday`: pending + accepted dell'evento oggi.
- `confirmedCoversToday`: somma coperti accepted con `confirmed_start` oggi.
- `pendingToday`: pending con `desired_date` oggi.
- `upcoming`: accepted entro le prossime 3 ore; walk-in visibili fino a 5 minuti dopo inizio.

La lista prossime 3 ore e nascosta se vuota, salvo loading/error.

## 3. Walk-in da Home

`WalkInModal`:

- nome cliente opzionale;
- numero coperti obbligatorio;
- sala e tavolo se configurati;
- busy check su accepted correnti;
- `useWalkInMutation` inserisce booking accepted/source `walk_in`.

## 4. Briefing turno

`ShiftBriefingModal`:

- selettore turno all/pranzo/cena;
- legge booking accepted/no_show=false di oggi;
- stampa o genera PDF;
- stato vuoto: nessuna prenotazione confermata per turno.
- colonna "Tavolo" (D52, S4-A): `useShiftBriefing` fa il join `assignment→tables→rooms` e ritorna
  `isMultiRoom` → "T12" se una sola sala, "Sala · T12" se più d'una; non assegnate "—"; multi-tavolo
  = nomi uniti da ", ".

Nota: il **PDF** del briefing (`shiftBriefingPdf.ts`) non ha ancora la colonna tavolo (follow-up).

## 5. Analytics

`AnalyticsPage`:

- range settimana/mese/anno;
- shift all/pranzo/cena;
- navigatore periodo;
- KPI: prenotazioni, coperti, tasso conferma, media coperti/booking, no-show;
- tasso occupazione se sale/tavoli configurati;
- trend prenotazioni/coperti;
- chart `bookedBy`.

Hook:

- `useAnalytics`
- `useAnalyticsComparison`
- `useRooms`
- `useTables`
- `useRestaurantSetting('business_hours')`

## 6. Vincoli e rischi

- Analytics filtra query per `created_at`, ma poi calcola finestra su data evento: da verificare nei
  test se booking create fuori periodo ma evento nel periodo deve apparire.
- Shift usa `confirmed_start`; booking senza conferma non classificabili per turno.
- Occupancy richiede tavoli attivi e giorni aperti da `business_hours`.
- Il pulsante periodo successivo e disabilitato per offset >= 0.

## 7. Test futuri

- KPI periodo corrente/precedente.
- Booking create_at vs event date.
- Occupancy con locale chiuso alcuni giorni.
- Home upcoming con walk-in appena passato.
- Briefing PDF/print con lista vuota e non vuota.
