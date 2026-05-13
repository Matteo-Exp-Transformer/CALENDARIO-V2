# Handoff agente — correzioni e miglioramenti (post-debug manuale)

Documento di passaggio: **non** sostituisce `docs/APP_CONTEXT_SKILL.md` né `docs/CLAUDE.md`. L’agente deve leggerli per stack, invarianti e comandi (`npm run validate`, ecc.).

---

## Priorità suggerita

| Priorità | Area | Perché |
|----------|------|--------|
| **P1** | Servizio — tavoli / sale | Bug funzionale: tavoli nuovi non restano nella sala scelta; mappa vuota; incoerenza lista vs DB (`room_id`). |
| **P2** | Walk-in — sala/tavolo, limite impostazioni, no no-show | Flusso operativo centrale + vincoli prodotto. |
| **P3** | Calendario — no-show nascosto, icona walk-in | UX e regole visibilità. |
| **P4** | Analytics — periodo calendario, layout toggle, tasso occupazione | Miglioramenti periodo e KPI; dipende da definizione KPI occupazione. |
| **P5** | Servizio — UX “Modifica sale” | Miglioramento chiarezza (ingranaggio → flusso elenco sale). |

---

## Cosa chiede l’utente

Testi organizzati dalle richieste in chat (stesso significato, ordine leggibile per l’agente).

### Servizio — tavoli e sale

1. **Tavolo nuovo finisce sempre in “Senza sala”.** Anche assegnando una sala nel flusso di inserimento, il tavolo va nella sezione tipo *«Senza sala tavolo …»* (`ServizioPage`, sezione tavoli orfani). **Nessuna procedura** (nemmeno i pulsanti *«Aggiungi tavolo in questa sala»* per ogni sala) fa comparire il tavolo nella sala giusta. Sulla **table map** resta il messaggio tipo *«Nessun tavolo in questa sala. Aggiungine uno.»* mentre il tavolo non compare.

2. **Al posto del solo pulsante con icona (configura sala corrente)** vuole un pulsante per **modificare le sale**: al click mostra le **sale create**; dopo aver scelto una sala si aprono le **informazioni modificabili come oggi** (stesso tipo di contenuto del modal attuale a schermo intero / overlay).

3. **I tavoli non possono essere “Senza sala”.** In creazione devono avere **sempre** una sala abbinata.

### Walk-in

4. Nel **walk-in** vuole **selezionare lui il tavolo** a cui assegnare il walk-in. Aggiungere **scelta sala e tavolo**; mostrare **solo tavoli liberi** nell’orario in cui viene registrato / compilato il walk-in.

5. **Possibilità di cambiare il limite walk-in** nelle **impostazioni locali** (inteso: impostazioni tenant / dashboard), in una **sezione idonea già esistente**.

### Calendario e stato prenotazioni

6. Sul calendario (eventi mese / digest) serve una **nuova icona** per i walk-in (oggi icona posate / `UtensilsCrossed`). Preferenza: **omino stilizzato** o icona **ugualmente chiara** per distinguere i walk-in.

7. I walk-in **non devono poter avere** stato **«No show»**.

8. Se a una prenotazione viene assegnato **«No show»**, deve **scomparire dal calendario**. I dati restano per **analytics** (non eliminare la prenotazione).

### Analytics

9. I pulsanti tipo **«7g» / «30g»** messi di lato sono **poco intuitivi**. Metterli **al centro** della barra header di Analytics, con etichette **Settimana — Mese — Anno**. La selezione **non** deve essere “da oggi a 30 giorni indietro” o conti strani: esempi voluti dall’utente:
   - se oggi è **13-05-2026**, **Mese** = **maggio 2026 per intero** (dal primo all’ultimo giorno del mese);
   - **Settimana** = settimana del calendario del mercoledì 13-05-2026: da **lunedì 11-05-2026** a **domenica 17-05-2026** (lunedì–domenica, non altro intervallo).

9bis. Il **tasso di occupazione** deve mostrare una **percentuale** coerente con il **periodo** selezionato (non restare su “—” / non disponibile senza logica sul periodo).

---

## Mapping minimo del codice (solo riferimenti)

| Tema | Dove guardare |
|------|----------------|
| Sezione admin **Servizio** | [`src/pages/ServizioPage.tsx`](src/pages/ServizioPage.tsx) — lista per `room_id`, sezione “Senza sala”, `TableMap`, `openAdd(...)`. |
| CRUD tavoli | [`src/features/booking/hooks/useServizioTables.ts`](src/features/booking/hooks/useServizioTables.ts) — `useCreateTable` / `useUpdateTable` (oggi insert senza `room_id`). |
| Modal tavolo | [`src/features/booking/components/servizio/TableFormModal.tsx`](src/features/booking/components/servizio/TableFormModal.tsx) — `placement`, sale da nomi. |
| Tab sale + ingranaggio | [`src/features/booking/components/servizio/RoomTabs.tsx`](src/features/booking/components/servizio/RoomTabs.tsx) — `title="Configura sala corrente"`. |
| Mappa tavoli | [`src/features/booking/components/servizio/TableMap.tsx`](src/features/booking/components/servizio/TableMap.tsx) — `onAddTable` → `openAdd()`. |
| Modal sala | [`src/features/booking/components/servizio/RoomConfigModal.tsx`](src/features/booking/components/servizio/RoomConfigModal.tsx). |
| Walk-in UI | [`src/features/booking/components/home/WalkInModal.tsx`](src/features/booking/components/home/WalkInModal.tsx); apertura da [`src/pages/AdminHomePage.tsx`](src/pages/AdminHomePage.tsx). |
| Walk-in API | [`src/features/booking/hooks/useWalkInMutation.ts`](src/features/booking/hooks/useWalkInMutation.ts) — durata fissa (es. 90 min), `table_id` in tipo ma non usato in insert. |
| No-show | [`src/features/booking/hooks/useBookingMutations.ts`](src/features/booking/hooks/useBookingMutations.ts) (`useMarkNoShow`); [`src/features/booking/components/BookingDetailsModal.tsx`](src/features/booking/components/BookingDetailsModal.tsx) (`canMarkNoShow`). |
| Icone tipologia calendario | [`src/features/booking/components/BookingCalendar.tsx`](src/features/booking/components/BookingCalendar.tsx) — `DigestBookingTypeIcon` (default `UtensilsCrossed`). |
| Analytics periodo / KPI | [`src/pages/AnalyticsPage.tsx`](src/pages/AnalyticsPage.tsx); [`src/features/booking/hooks/useAnalytics.ts`](src/features/booking/hooks/useAnalytics.ts) (`DateRange`, finestra attuale rolling 7/30 giorni). |
| Impostazioni tenant (chiavi) | [`src/features/booking/lib/restaurantSettingRegistry.ts`](src/features/booking/lib/restaurantSettingRegistry.ts); UI tipica [`src/features/booking/components/SettingsTab.tsx`](src/features/booking/components/SettingsTab.tsx). |
| Schema DB tipi | [`src/types/database.ts`](src/types/database.ts) — tabella `booking_requests` (verificare se esiste già collegamento tavolo o solo `placement`). |

---

## Note per l’agente (non richieste esplicite dall’utente ma utili)

- Allineare eventuali **nuove chiavi** `restaurant_settings` al registry + validazione Zod dove presente.
- Se serve colonna DB per tavolo su prenotazione walk-in: **nuova migrazione** con versione successiva alle esistenti; non alterare migrazioni già applicate (vedi [`docs/DATABASE.md`](docs/DATABASE.md)).

---

*File generato come handoff testuale: nessuna modifica al codice applicativa inclusa in questo commit di documentazione.*
