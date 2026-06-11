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

## 5-ter. Decisioni intervista Tab Calendario (chiuse con Matteo 11-06-26)

> Fase A del `PLAN_BLINDATURA_ADMIN.md` §3-ter (M2). Sono il senso voluto: non vanno "migliorati"
> d'ufficio. Dettaglio piano: `PLAN_BLINDATURA_ADMIN.md` §3-ter.

Senso: calendario **leggero come vista d'insieme** (dice solo quanto è pieno ogni giorno) + sotto la
**lista di lavoro** delle prenotazioni per fascia oraria, cliccabili → modale dettaglio.

1. **Utenti:** admin **e staff di sala** → a prova di errore.
2. **Mostra SOLO prenotazioni accettate.** Le pending vivono nella pagina Prenotazioni, non qui.
3. **Azioni dal calendario:** click prenotazione → modale dettaglio (lettura). **Accetta NON da qui**
   (è in Prenotazioni). **Rifiuta/Cancella** solo dentro il modale dettaglio con conferma (LOCK
   `BookingDetailsModal`). **Mai drag&drop** per spostare data/ora.
4. **Scorciatoia "assegna/cambia tavolo" = SOLO Pro+**, dietro feature flag (stesso flag di
   "Servizio"). In **Classic non viene renderizzata** (non solo nascosta). `QuickTableAssignModal`
   resta nel codice ma gated. Motivo: in Classic l'assegnazione tavoli non esiste come funzione.
5. **Scorciatoia "crea prenotazione":** click su un giorno → apre la modale nuova-prenotazione
   esistente. Attiva su **tutti i giorni, anche pieni**: mostra avviso-sforo ma **lascia procedere**
   (coerente con "non legare le mani allo staff").
6. **Due limiti coperti SEPARATI e MORBIDI** (non si vincolano a vicenda — i servizi sono
   imprevedibili, lo staff deve poter sforare di qualche coperto):
   - **Esterno giornaliero** — in **Impostazioni (Classic)**. `0`=nessun limite, oppure N coperti.
     Quando raggiunto **blocca solo la pagina pubblica Prenota** (la richiesta cliente non va a buon
     fine). Conta **solo prenotazioni accettate**. È il numero che alimenta la % riempimento.
   - **Interno per fascia** — in **Servizio (Pro)**, facoltativo ("domani a pranzo max 24"). È un
     **avviso/semaforo** per decidere se accettare le pending, **non blocca** automaticamente nulla.
7. **% riempimento nel calendario:** limite=0/assente → **nessuna percentuale**, solo conteggio
   coperti (niente numero finto). Limite=N → "75% · 18/24". Oltre il limite → **mostra il valore
   reale (101%, 108%…)** senza cap, con indicatore "pieno/oltre". Anche da admin la creazione manuale
   **non è mai bloccata**: avvisa e lascia fare.
8. **Vista sotto il calendario:** **Giorno** (dettaglio pieno) + **Settimana** (righe compatte:
   nome/ora/coperti/icona tipo). Soglia UI oltre cui la settimana suggerisce "passa a vista giorno"
   da definire in mappatura.

> Da risolvere in MAPPATURA (codice=verità): flag esatto Servizio/tavoli; campo "coperti max
> giornaliero" esiste o va creato; dove il pubblico conta già coperti/giorno; stato reale di
> `BookingCalendar.tsx` (drag&drop da disabilitare? click-giorno cablato?). Marcatore test:
> `@admin-blindatura: calendario`.

### Decisioni aggiuntive emerse dal controtest (11-06-26)

8-bis. **Casella "Coperti massimi al giorno" sta FUORI dalla sezione fasce orarie** (è un blocco
    indipendente in Impostazioni, dopo "Orari di apertura"). Il limite giornaliero vale sia Classic sia
    Pro, mentre le fasce sono gated `!features.servizio`: annidarla lì la faceva sparire in Pro. Fix 11-06-26.
9. **`0` coperti giornalieri = nessun limite** (oltre al campo vuoto). Lo schema accetta 0; serializer e
   parser trattano 0 e -1 come «illimitato». (Prima 0 rompeva il salvataggio dell'intera pagina Impostazioni.)
10. **Blocco per-fascia pubblico RIMOSSO dal comportamento** (decisione Matteo: «non serve, avevo deciso
    male»). Resta nel codice ma **disattivato dietro flag `slot_limit_enabled`** (default false), riattivabile.
    Resta SOLO il limite giornaliero. Il limite per-fascia (`slot_guest_capacities`) vive come avviso admin.
11. **No-show LIBERANO il posto:** non contano nel limite giornaliero pubblico (edge filtra `no_show != true`),
    coerente col calendario che già li esclude. Pubblico e calendario contano la stessa cosa.
12. **Scorciatoia crea-da-giorno NON apre il form al click.** Click su giorno = seleziona + mostra pulsante
    «+ Nuova prenotazione il GG/MM»; ri-click sullo stesso giorno = toggle del pulsante (vista non ingombra).
    Il form si apre solo dal pulsante. (Prima il click apriva sempre il form, anche su «···» mobile e griglia
    oraria settimana/giorno — invadente.)

### Follow-up tracciati (non bloccanti M2)

- **FU-CAL-1** — vista Settimana digest: non si cambia settimana/giorno restando nel digest (si dipende
  dal calendario sopra). Aggiungere navigazione settimana propria.
- **FU-CAL-2** — % riempimento visibile solo in vista Mese; in Settimana/Giorno il segnale «quanto è pieno»
  sparisce. Valutare un indicatore anche lì.
- **FU-CAL-3** — badge `"108/100 · 108%"` può essere stretto nella cella mese su 375px; verificare wrapping.
- **FU-CAL-4** — colori soglia riempimento solo cromatici (rosso/verde): aggiungere icona/simbolo per daltonici/staff.
- **FU-CAL-5** — vista Settimana satura (>40 pren.) avvisa ma non virtualizza: tenere d'occhio performance.
- **FU-CAL-6** — in vista Settimana anche Pro perde indicazione turni/assegnazione tavolo (righe compatte). Valutare.
- **FU-CAL-7** (minore) — richiesta pubblica POST diretta senza `desired_time` bypassa il guard giornaliero
  (limite morbido, ma è un bypass server-side). Il race tra richieste concorrenti è atteso (morbido).

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
- **Drawer dettagli — auto-chiusura (07-06-26, U6):** `BookingDetailsModal` si chiude da solo se la
  prenotazione aperta non è più tra le `accepted` (eliminata/cambiata altrove). L'effect aspetta che la
  query sia caricata e ferma, e non chiude in edit o durante un salvataggio. **Annulla modifica** (U2)
  ripristina i campi originali; **chiusura** (X/overlay, U7) è bloccata mentre il salvataggio è in corso.
- **Contatore prenotazioni (D3, migrazione 044):** `tenant_usage.bookings_count` conta il **primo**
  passaggio a `accepted` (da pending/rejected/insert). Il **reinserimento** dall'archivio
  (`deleted → accepted`) **non** riconta — il trigger `increment_booking_count_on_accept` esclude
  `OLD.status IN ('accepted','deleted')`. Semantica scelta: "accettazioni nette", il contatore non cala
  sull'eliminazione.
- `placement` come nome/tavolo/id va chiarito con Servizio per evitare mismatch.

## 8. Test collegati

Vedi `ADMIN_TEST_SUITE_INDEX.md`. I test piu pertinenti sono e2e admin booking, mutation booking,
capacity, time handling, table assignment e details placement.

## 9. Fase D — finding controtest (07-06-26)

Controtest completato su 4 fronti. **Batch fix 07-06-26 (Matteo):** D1, R1, D4, D5, D2/U4/U8 **chiusi in codice**.
**Batch residuo FU-046 chiuso 07-06-26 (2° giro):** D3, U2, U5, U6, U7, U1, U4(guard sincrono), U10.

| ID | Gravità | Sintesi | Stato batch 07-06-26 |
|---|---|---|---|
| D1 | ALTO | Race multi-tab: rifiuto su card stale sovrascrive booking già `accepted` | ✅ `.eq('status','pending')` su accept/reject + toast se 0 righe |
| R1 | ALTO | 375px: modale con textarea (Elimina/Rifiuta) senza scroll → bottoni fuori viewport | ✅ `max-h-[90vh]`, scroll area, bottoni stack mobile |
| D2, U4, U8 | MEDIO | Doppio click accept / conferma danger modal | ✅ `isPending` disabilita card; **U4** ora anche guard sincrono `useRef` in `BookingDangerActionModal` (copre finestra pre-`isLoading`) |
| D3 | MEDIO | Reinserisci incrementa di nuovo `tenant_usage.bookings_count` | ✅ migrazione `044` — trigger esclude transizione `deleted → accepted` (opzione "accettazioni nette", scelta Matteo 07-06-26). Controtestato su DB TEST |
| U2 | MEDIO | Annulla modifica non ripristina campi | ✅ `handleCancelEdit` risincronizza `formData` da `booking` (helper `buildFormDataFromBooking`) |
| U6 | MEDIO-ALTO | Drawer calendario con dati stale se la prenotazione sparisce dalla lista | ✅ effect chiude il drawer se assente da `useAcceptedBookings` (guard su loading/fetching/edit/save) |
| U5, U7 | MEDIO | Scroll lock non ripristinato; chiusura durante save/edit | ✅ U5 danger modal ripristina overflow originale (non forza `unset`); U7 `handleRequestClose` blocca chiusura durante `isPending`, annulla pulito in edit |
| D4, U3 | MEDIO | Reinserisci senza orari; tab switch durante mutation | ✅ D4 modale orario; **U3 ⬜ FU-046** (vincolo strutturale dashboard, tab unmount) |
| D5, D6, D7, U1, U9, U10 | BASSO | Metadata restore, guard DB assenti, doppio toast, errori UX | ✅ D5 azzera `cancellation_*`; ✅ U1 toast unico (rimosso da `BookingDetailsModal`, resta in `useUpdateBooking`); ✅ U10 `logger` al posto di `console.error`; **U9 ⬜** (banner inline opzionale, toast già presente); D6/D7 ⬜ |
| L4, L10–L12 | FU | Ospiti 0/negativi/enormi passano hook — validazione DB/form da valutare | ⬜ fuori batch |
| R2–R4 | MEDIO/BASSO | Bottoni affiancati, padding doppio su 375px | R2 parziale (stack mobile); R3/R4 ⬜ |
