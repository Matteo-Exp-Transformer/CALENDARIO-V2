# ADMIN — Prenotazioni Context

> Dominio operativo principale: calendario, richieste in attesa, archivio, nuova prenotazione admin,
> dettagli/modali e assegnazione tavoli.

## 1. Dove vive

- `AdminDashboard` tab `calendar`, `pending`, `archive`.
- URL tab: `/admin/calendario`, `/admin/prenotazioni`, `/admin/archivio`.
- Refresh/back devono riaprire la stessa tab indicata dall'URL; `/admin/prenotazioni` non deve
  ricadere su Calendario.
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

## 5-bis. Decisioni intervista Area 2 (chiuse con Matteo 06-06-26)

> Fase A del `PLAN_BLINDATURA_ADMIN.md`. Sono il senso voluto: non vanno "migliorate" d'ufficio.

1. **Capienza/fasce/orario passato = SOLO AVVISO, mai blocco.** Il ristoratore decide sempre, anche
   in overbooking o su orario gia passato. Il comportamento attuale (`CapacityWarningModal` /
   `PastStartTimeWarningModal` che lasciano confermare) e VOLUTO. Non introdurre blocchi assoluti.
2. **Stati prenotazione tutti VOLUTI, non toccare:** `pending`, `accepted`, `rejected`, `deleted`
   + flag `no_show`. Nessuna "pulizia" di stati durante la blindatura.
3. **Archivio = SOLO soft-delete, recuperabile per sempre.** Eliminare scrive `status='deleted'`
   (+`cancelled_at`, `cancellation_reason`), la riga resta nel DB e si reinserisce dall'archivio.
   **Nessun "elimina definitivo" lato app** — la pulizia dei record vecchi la fara Matteo da DB in
   futuro (criterio temporale da definire). Non aggiungere hard-delete nell'UI.
4. **Conferme da rendere COERENTI** (oggi sono miste: popup nativo del browser in archivio, conferma
   custom su Elimina, nessuna conferma su No-show, box-motivo diretto su Rifiuta). Il senso voluto e
   **una sola lingua di conferma** in tutta l'area, allineata al resto dell'app:
   - **Elimina** — gia con conferma+motivo (`showCancelConfirm`): tenere.
   - **No-show** — oggi `mutate` al primo click: **aggiungere conferma** (azione che marca il cliente).
   - **Reinserisci / Riporta in attesa** — oggi `window.confirm()` nativo: **sostituire** con la
     conferma custom coerente con le altre.
   - **Rifiuta** — ha gia il box motivo: **allinearne lo stile** alle altre conferme, non aggiungere
     un passaggio in piu.
   > Questo e un fronte di blindatura prodotto (coerenza UI + azioni pericolose), marcatore
   > `@admin-blindatura: prenotazioni`. Tocca file LOCK (`BookingDetailsModal`): leggere
   > `docs/ADMIN_CLASSIC_SKILL.md` prima di modificare.

## 6. Email e side effect

Email/notification sono accessorie rispetto alla mutazione booking: possono fallire senza bloccare
tutto il flusso. Questo va testato come comportamento esplicito nella fase successiva.

## 7. Codice residuo / rischio

- **Conferme (aggiornato 06-06-26):** `BookingDangerActionModal` unifica Elimina, No-show, Reinserisci,
  Riporta in attesa e Rifiuta. Archivio non usa più `window.confirm()` nativo.
- **`AcceptBookingModal` E CABLATO (correzione 06-06-26, codice=verita).** I report storici lo davano
  per "non cablato/dead code": **falso**. E importato e usato da `AdminBookingForm.tsx`. Il flusso
  pending invece accetta **direttamente dalla card** (`PendingRequestsTab.handleAccept`, deriva orario
  da `desired_time`, fine +3h) senza aprire questo modale. Quindi: vivo per la nuova prenotazione admin,
  non usato per l'accept-da-card. Non rimuovere senza verificare entrambi i percorsi.
- Refetch periodici e invalidazioni miste possono creare brevi stati non sincronizzati.
- **Archivio Reinserisci (07-06-26):** su prenotazioni `deleted` **senza** `confirmed_start/end`, il tasto
  Reinserisci resta visibile e apre `RestoreBookingTimeModal` (orario inizio + fine calcolata +3h via
  `dateUtils`); Annulla lascia in archivio. Con orari già salvati → conferma breve `BookingDangerActionModal`.
  `useRestoreBooking` accetta `RestoreBookingInput` (id stringa o payload con slot).
- `placement` come nome/tavolo/id va chiarito con Servizio per evitare mismatch.

## 8. Test collegati

Vedi `ADMIN_TEST_SUITE_INDEX.md`. I test piu pertinenti sono e2e admin booking, mutation booking,
capacity, time handling, table assignment e details placement.

## 9. Fase D — finding controtest (07-06-26)

Controtest completato su 4 fronti. **Batch fix 07-06-26 (Matteo):** D1, R1, D4, D5, D2/U4/U8 **chiusi in codice**.

| ID | Gravità | Sintesi | Stato batch 07-06-26 |
|---|---|---|---|
| D1 | ALTO | Race multi-tab: rifiuto su card stale sovrascrive booking già `accepted` | ✅ `.eq('status','pending')` su accept/reject + toast se 0 righe |
| R1 | ALTO | 375px: modale con textarea (Elimina/Rifiuta) senza scroll → bottoni fuori viewport | ✅ `max-h-[90vh]`, scroll area, bottoni stack mobile |
| D2, U4, U8 | MEDIO | Doppio click accept / conferma danger modal | ✅ `isPending` disabilita card + guard mutate + `confirmDisabled` capienza |
| D3 | MEDIO | Reinserisci incrementa di nuovo `tenant_usage.bookings_count` | ⬜ FU-046 (fuori batch) |
| U2, U6 | MEDIO | Annulla modifica non ripristina campi; drawer calendario con dati stale | ⬜ FU-046 |
| D4, U3, U5, U7 | MEDIO | Reinserisci senza orari; tab switch durante mutation; scroll lock | ✅ D4 modale orario (`RestoreBookingTimeModal` + `RestoreBookingInput`); U3/U5/U7 ⬜ FU-046 |
| D5, D6, D7, U1, U9, U10 | BASSO | Metadata restore, guard DB assenti, doppio toast, errori UX | ✅ D5 azzera `cancellation_*`; resto ⬜ |
| L4, L10–L12 | FU | Ospiti 0/negativi/enormi passano hook — validazione DB/form da valutare | ⬜ fuori batch |
| R2–R4 | MEDIO/BASSO | Bottoni affiancati, padding doppio su 375px | R2 parziale (stack mobile); R3/R4 ⬜ |
