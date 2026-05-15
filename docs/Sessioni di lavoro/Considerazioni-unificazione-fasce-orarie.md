# Considerazioni — Unificazione fasce orarie (Classic + Pro)

**Data**: 2026-05-15  
**Contesto**: conversazione su duplicazione UX tra Impostazioni locale e Pagina Servizio;

---

## 1. Riassunto conversazione

### Problema iniziale
Due schermate permettono di configurare “fasce orarie” con aspetto simile ma **dati e scopi diversi**:

| Dove nell’app | Componente | Storage oggi | Ruolo |
|---------------|------------|--------------|--------|
| Tab **Impostazioni locale** → card «Imposta Fasce Orarie» | `RestaurantSettingsTab.tsx` | `restaurant_settings` → chiave `booking_time_slots` | Tre fasce fisse (mattina / pomeriggio / sera): raggruppamento digest calendario, capacity check, richieste in attesa |
| Sidebar **Servizio** → blocco «Fasce orarie» | `ServiceSlotsManager.tsx` | Tabella `service_slots` | Fasce con nome libero, orari, `max_turns`, turni e assegnazione tavoli |

Su **Pro**, il calendario (`BookingCalendar.tsx`) legge **entrambi**: `booking_time_slots` per le tre colonne del digest; `service_slots` per navigazione turni e tavoli.

## Proposta di  Matteo
- **`ServiceSlotsManager` deve avere tutte le stesse funzionalità** oggi legate a `booking_time_slots` in `RestaurantSettingsTab` (validazione fasce, uso nel flusso prenotazioni, ecc.).
- **Una sola tabella di dati** condivisa, così i controlli prenotazione sulle fasce funzionano anche quando l’utente configura da Servizio.
- **Classic**: la sezione in `RestaurantSettingsTab` resta utilizzabile; le stesse regole/dati devono valere anche quando si usa `ServiceSlotsManager` (coerenza tra edition).
- **Fasce notturne (oltre mezzanotte)** — in **Impostazioni locale** (`RestaurantSettingsTab`) va aggiunta la possibilità di impostare fasce la cui **fine è prima dell’inizio** (es. cena 22:00 → 02:00), come già supportato in Pagina Servizio (`ServiceSlotsManager` mostra l’avviso «attraversa mezzanotte»). Oggi in Impostazioni questa capacità **manca a livello UX** (e va verificata/rafforzata in validazione e salvataggio insieme al calendario/capacity).

*Preferenza iniziale Matteo — **opzione B (storage)**: unificare tutto sulla fonte già usata dal calendario e dalle prenotazioni, cioè la chiave `booking_time_slots` in `restaurant_settings` (un record JSON per tenant con i sei orari: inizio/fine di mattina, pomeriggio e sera — come oggi in Impostazioni). `ServiceSlotsManager` su Pro leggerebbe e scriverebbe quella stessa chiave (eventualmente estesa), non la tabella `service_slots`. **Opzione A (storage)** — alternativa da confrontare: unificare sulla tabella `service_slots` (una riga per fascia: nome, orari, `max_turns`, ordine). L’agente implementativo deve **valutare A vs B** e proporre la soluzione più solida e scalabile prima di codificare (tabella comparativa in §4).*

---

## 2. Funzionalità oggi — confronto

### `RestaurantSettingsTab` — sezione «Imposta Fasce Orarie»
- Tre fasce **fisse** (Mattina / Pomeriggio / Sera), solo inizio/fine (`TimePicker24h`).
- Validazione: formato `HH:mm`, inizio ≠ fine per fascia, **non sovrapposizione** tra coppie (mattina–pomeriggio, pomeriggio–sera, mattina–sera) via `validateBookingTimeSlotsDetailed` + `slotRangesOverlap`.
- **Gap — fasce notturne**: nessuna indicazione in UI che si può impostare fine < inizio (fascia oltre mezzanotte); nessun messaggio equivalente a Servizio. In codice condiviso (`bookingTimeSlots.ts`: `toDaySegments`, `isTimeInsideSlot`) la logica per segmenti che attraversano la mezzanotte **esiste già** per lettura/validazione sovrapposizioni, ma Impostazioni non la espone al ristoratore — da integrare in UI + copy + test.
- Salvataggio **batch** con «Salva modifiche» insieme ad altre impostazioni (`useUpsertRestaurantSetting`).
- **Lettori**: `BookingCalendar`, `BookingDetailsModal`, `PendingRequestsTab`, `useCapacityCheck`, `capacityCalculator.getStartSlotForBooking`.

### `ServiceSlotsManager`
- Fasce **N**, nome personalizzato, CRUD immediato.
- Campi: `name`, `start_time`, `end_time`, `max_turns` (illimitata / chiusa / N turni).
- Validazione: nome obbligatorio, orari obbligatori; alert se inizio fuori orari di apertura (`useBusinessHours`).
- Indicazione fascia che **attraversa mezzanotte** (`slotCrossesMidnight`: `end_time` < `start_time`) — **presente qui, assente in Impostazioni**; va replicata o conmotionata in `RestaurantSettingsTab` dopo unificazione.
- **Non** integrato oggi con: `getStartSlotForBooking`, digest a tre colonne, `slot_guest_capacities` (quella resta su `restaurant_settings` con chiavi morning/afternoon/evening).

### Impostazioni correlate (non ancora nel perimetro esplicito)
- **Coperti massimi per fascia** (`slot_guest_capacities` in `RestaurantSettingsTab`, stessa schermata ma sezione diversa): ancora legata alle tre etichette mattina/pomeriggio/sera.

---

## 3. Decisioni registrate

1. **Unificare il modello dati** — **unica fonte di verità** (tabella o chiave impostazioni); niente doppia verità tra `booking_time_slots` e `service_slots`.
2. **Parità funzionale bidirezionale** — Impostazioni ↔ Servizio: stesse regole (sovrapposizioni, prenotazioni/calendario) **e** stessa gestione **fasce notturne** (fine dopo mezzanotte, es. 22:00→02:00). Oggi Servizio lo segnala in UI; Impostazioni deve permetterlo esplicitamente, non solo «per caso» nei picker.
3. **Classic** — stessa UI personalizzabile che c’è oggi in Impostazioni (tre fasce Mattina/Pomeriggio/Sera, stesse funzionalità), **senza sidebar**; sotto il cofano legge/scrive la **stessa** fonte dati usata da Pro/Servizio. Non obbligare Classic alla lista fasce stile `ServiceSlotsManager`.
4. **Pro** — configurazione da Pagina Servizio (`ServiceSlotsManager`); parità funzionale con la sezione fasce Classic; niente duplicazione in Impostazioni.
5. **Scelta storage** — **proposta di partenza: opzione B** = chiave JSON `booking_time_slots` in `restaurant_settings` (vedi definizione sopra in «Proposta di Matteo»). L’agente esecutivo confronta con **opzione A** (`service_slots`) e documenta in apertura sessione quale adotta e perché (solidità, scalabilità, migrazione, RLS Classic).
6. **Documentazione** — questo file come traccia decisioni; implementazione in sessione dedicata con skill area (ADMIN_CLASSIC + DB se migrazione).
7. **Comunicazione con Matteo** — skill leggera separata: [docs/COMUNICAZIONE_UTENTE_SKILL.md](../../COMUNICAZIONE_UTENTE_SKILL.md) da migliorare e integrare nel sistema di skills.

---

## 4. Domande aperte (da risolvere prima dell’implementazione)

### A) Fonte dati unica — opzioni A e B (non confondere con il punto «B)» sotto, che riguarda solo la UI Classic)

| Opzione | Cosa significa | Pro | Contro |
|---------|----------------|-----|--------|
| **B** | `restaurant_settings` → chiave `booking_time_slots`: JSON con 6 orari (3 fasce fisse). Pro: `ServiceSlotsManager` diventa client di questa chiave (o JSON esteso). | Già usato da calendario, capacity, pending; Classic senza dipendere da RLS `service_slots` | Estendere il JSON per fasce N / `max_turns`; deprecare o sincronizzare `service_slots` |
| **A** | Tabella `service_slots`: una riga per fascia (`name`, `start_time`, `end_time`, `max_turns`, …). Classic: 3 righe «canoniche» o adapter. | Modello relazionale, `max_turns`, seed signup | Migrazione da JSON; RLS Classic su `service_slots`; allineare digest a 3 fasce |

*Preferenza Matteo: **opzione B**.*

**Istruzione agente**: prima di implementare, produrre un paragrafo “Scelta storage” con raccomandazione (anche se diverge da B) motivando solidità strutturale e scalabilità; attendere ok Matteo se la raccomandazione ≠ B.

### B) UI Classic (non è l’«opzione B» dello storage) — **deciso**
Classic mantiene la **UI attuale** in Impostazioni (tre fasce, stessi controlli), senza sidebar Pro. Stessa fonte dati unificata; non la lista CRUD di Servizio.

### C) `slot_guest_capacities`
Resta su `restaurant_settings` con chiavi morning/afternoon/evening, oppure si sposta per `service_slot_id` / ordine display?

### D) Digest calendario
Le tre colonne Mattina/Pomeriggio/Sera restano fisse (derivate da 3 slot “canonici”) oppure il digest diventa dinamico in base a tutte le fasce in tabella?

### E) Migrazione tenant esistenti
Backfill: copiare `booking_time_slots` → righe `service_slots` (o viceversa) per ogni tenant; default per Classic senza dati.


---

## 6. Skill da caricare per la sessione implementativa

1. `docs/APP_CONTEXT_SKILL.md`
2. `docs/ADMIN_CLASSIC_SKILL.md` (LOCK `RestaurantSettingsTab`, `BookingCalendar`, capacity)
3. `docs/Database-Skill/DB_SKILL.md` se migrazione
4. `docs/COMUNICAZIONE_UTENTE_SKILL.md` — stile messaggi verso Matteo da rifare, snellita migliorata e allineata al sistema di skills attuale.

---

## 7. Stato

| Voce | Stato |
|------|--------|
| File considerazioni | Creato |
| Skill comunicazione utente | Creata |
| Risposte Matteo (§4 A–B) | A: preferenza B + valutazione agente; B: UI Classic invariata |
| Implementazione codice | Non iniziata — agente deve prima “Scelta storage” |
