# ADMIN — Prenotazioni Context

> Dominio operativo principale: calendario, richieste in attesa, archivio, nuova prenotazione admin,
> dettagli/modali e assegnazione tavoli.

## 1. Dove vive

- `AdminDashboard` tab `calendar`, `pending`, `archive`.
- Componenti principali: `BookingCalendarTab`, `PendingRequestsTab`, `ArchiveTab`, `AdminBookingForm`,
  `BookingRequestCard`, `BookingDetailsModal`, `RejectBookingModal`, `CapacityWarningModal`,
  `PastStartTimeWarningModal`, `QuickTableAssignModal`.

## 2. Stati booking

| Stato | Significato admin |
|---|---|
| `pending` | richiesta in attesa da pagina pubblica |
| `accepted` | prenotazione confermata, visibile in calendario |
| `rejected` | richiesta rifiutata |
| `deleted` | cancellata/archiviata |

## 3. Flussi utente

| Flusso | Azione | Scrittura |
|---|---|---|
| Accetta pending | card richiesta -> accetta | `status`, `confirmed_start`, `confirmed_end`, `desired_time`, `num_guests` |
| Rifiuta pending | apre `RejectBookingModal` | `status='rejected'`, `rejection_reason` |
| Nuova prenotazione admin | pannello collassabile | insert `booking_requests` accepted, `booking_source='admin'` |
| Calendario dettagli | apre modal dettagli | update/cancel/no-show/assegnazioni |
| Archivio | filtra e ripristina/requeue | cambia `deleted/rejected` verso stati operativi |
| Assegna tavolo | quick assign Pro | scrive `booking_table_assignments` |

## 4. Hook dati

- Query: `usePendingBookings`, `useAcceptedBookings`, `useAllBookings`, `useBookingStats`.
- Mutation: `useAcceptBooking`, `useRejectBooking`, `useUpdateBooking`, `useCancelBooking`,
  `useRestoreBooking`, `useRequeueRejectedBooking`, `useMarkNoShow`, `useCreateAdminBooking`.
- Tavoli: `useTableAssignments`, `useAssignBookingToTable`, `useReleaseBookingAssignment`.
- Supporto vincoli: `useCapacityCheck`, `useServiceSlots`, `useServiceSlotOverrides`,
  `useRestaurantSetting`.

## 5. Vincoli

- Accettare richiede un orario valido (`desired_time`/conferma).
- Date/orari passati possono aprire warning.
- Capienza e fasce generano warning; in alcuni casi non bloccano in modo assoluto.
- `no_show` viene salvato ma nascosto dal calendario.
- `placement`/assegnazioni tavolo sono legate a feature Pro.
- Unique tavolo+fascia+data+turno protegge collisioni a DB.

## 6. Email e side effect

Email/notification sono accessorie rispetto alla mutazione booking: possono fallire senza bloccare
tutto il flusso. Questo va testato come comportamento esplicito nella fase successiva.

## 7. Codice residuo / rischio

- `AcceptBookingModal` esiste ma non risulta cablato nel flusso attuale.
- Refetch periodici e invalidazioni miste possono creare brevi stati non sincronizzati.
- `placement` come nome/tavolo/id va chiarito con Servizio per evitare mismatch.

## 8. Test collegati

Vedi `ADMIN_TEST_SUITE_INDEX.md`. I test piu pertinenti sono e2e admin booking, mutation booking,
capacity, time handling, table assignment e details placement.
