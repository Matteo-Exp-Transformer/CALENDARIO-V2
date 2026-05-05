# Report fix - Calendario prenotazioni maggio e reinserimento con orario obbligatorio

Data: 2026-05-05  
Progetto: `CalendarBackup-v2`

## Contesto segnalazione

Durante la sessione sono emerse due anomalie percepite:

1. prenotazioni visibili in precedenza (in particolare 8 e 15 maggio) risultavano "scomparse" dal calendario;
2. il flusso di reinserimento da archivio poteva riportare una prenotazione in stato `accepted` anche senza orari confermati.

## Analisi eseguita

### 1) Verifica dati su DB (Supabase MCP)

- Le prenotazioni non erano cancellate.
- Per il tenant `al-ritrovo` risultavano:
  - prenotazioni `accepted` con orari confermati (renderizzabili) presenti;
  - molte prenotazioni `accepted` senza `confirmed_start/confirmed_end` (non renderizzabili nel calendario).
- Controllo puntuale su maggio:
  - `3216516` -> `2026-05-08 16:00:00+00`
  - `asdasd` -> `2026-05-15 22:25:00+00`
  entrambe presenti in DB con orari validi.

### 2) Verifica runtime su frontend

- Query verso `booking_requests` correttamente eseguite per tenant autenticato.
- Dopo riallineamento sessione/login e refresh runtime, eventi di maggio nuovamente visibili.
- Confermata la presenza in UI degli eventi su 8 e 15 maggio.

### 3) Analisi robustezza parsing orario

Nel parsing orario frontend era presente una fragilità:
- `extractTimeFromISO()` cercava solo pattern con separatore `T` (`...T16:00...`).
- Da Supabase possono arrivare anche stringhe con separatore spazio (`... 16:00...`).

Impatto:
- rischio di orari non estratti correttamente in alcuni flussi/formati.

## Fix applicati

### A) Fix parsing orario robusto (`T` o spazio)

File modificato:
- `src/features/booking/utils/dateUtils.ts`

Dettaglio:
- aggiornata regex in `extractTimeFromISO()` da:
  - `T(\\d{2}):(\\d{2})`
  a:
  - `[T\\s](\\d{2}):(\\d{2})`

Risultato:
- parsing compatibile con entrambi i formati timestamp.

### B) Calendario sempre visibile senza banner extra

File modificato:
- `src/features/booking/components/BookingCalendarTab.tsx`

Dettaglio:
- rimosso il banner informativo aggiunto in precedenza.
- il componente calendario resta renderizzato.

### C) Reinserimento archivio con orario obbligatorio

File modificato:
- `src/features/booking/hooks/useBookingMutations.ts`

Dettaglio:
- in `useRestoreBooking` aggiunto controllo preliminare:
  - se `confirmed_start` o `confirmed_end` sono null -> blocco reinserimento con errore esplicito.

Messaggio:
- `Impossibile reinserire: mancano orario di inizio/fine confermati.`

## Verifica post-fix

- Lint sui file modificati: nessun errore.
- Verifica runtime UI: eventi del 8 e 15 maggio visibili.
- Vincolo reinserimento: enforced lato applicazione.

## Stato finale

- prenotazioni di maggio ripristinate in visualizzazione;
- parsing orario reso robusto;
- flusso restore allineato alla regola: niente `accepted` senza orari confermati.

## Nota operativa consigliata

Per hardening definitivo, in fase successiva conviene aggiungere un vincolo lato DB/policy che impedisca a monte `status='accepted'` con `confirmed_start/confirmed_end` null, così la regola non dipende solo dal frontend.
