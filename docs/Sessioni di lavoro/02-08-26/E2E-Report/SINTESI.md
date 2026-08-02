# Sintesi del collaudo e2e S4 — quattro corsie + verifica su codice

> Consolidamento **tecnico** dei report [CORSIA_A](CORSIA_A.md) · [CORSIA_B](CORSIA_B.md) ·
> [CORSIA_C](CORSIA_C.md) · [CORSIA_D](CORSIA_D.md), eseguiti in parallelo il **02-08-2026**
> (14:51 → 15:45) su TEST `docnnernvpyrbwuzzach`, tenant Pro `da-tommaso` e Classic `test-classic`.
>
> Le voci con **diagnosi su codice** sono state verificate a mano dopo i report: l'agente descrive il
> sintomo, qui c'è la riga che lo produce. Gli ID `S4-*` sono il riferimento usato dai prompt di fix.

---

## 1. Il quadro in una riga

Su **52 voci** provate: **32 OK**, **7 KO**, **9 BLOCCATE**, **2 NON VERIFICABILI**, 1 SEMI, 1 N/A.
Quasi tutte le voci bloccate discendono da **un solo difetto** (`S4-BUG-1`): gli stati dei tavoli non
seguono l'orologio, quindi nessun tavolo raggiunge mai «In uscita» e l'intera sezione 2.2 non è
partita.

| Corsia | OK | KO | Bloccate | Note |
|--------|----|----|----------|------|
| A — viste mappa | 6 | 0 | 0 | tutta la sezione 2.1 verde |
| B — servizio dal vivo | 11 | 4 | 7 | il collo di bottiglia |
| C — tavolate + responsive | 20 | 0 | 0 | tutta 2.3 e 9 verdi |
| D — capienza / pubblico / Classic | 5 | 3 | 3 + 2 n.v. | setup fascia sfortunato |

**Le tre funzioni nuove del 02-08:** viste mappa **promosse**, tavolate multi-tavolo **promosse**,
avviso di fine turno **non provato** (bloccato da `S4-BUG-1`).

---

## 2. Difetti bloccanti

### S4-BUG-1 — Gli stati dei tavoli sono sfasati di un fuso orario ⛔

- **Trovato da:** corsia B (voci 3-2, 3-3, 3-4) · **blocca:** 2.2-1…2.2-6, 9-7, e in parte 3-5.
- **Sintomo:** una prenotazione delle 14:50, alle 15:00, resta **In arrivo** invece di diventare
  **Occupato**; una delle 12:00 resta **In ritardo** invece di passare a **In uscita**. Nessun tavolo
  arriva mai a fine turno, quindi l'avviso non compare mai.
- **Diagnosi (verificata su codice):**
  [useTableStatuses.ts:57-58](../../../../src/features/booking/hooks/useTableStatuses.ts#L57-L58)

  ```ts
  const start = new Date(booking.confirmed_start).getTime()
  const end = new Date(booking.confirmed_end).getTime()
  ```

  In questo progetto `confirmed_start` **non è un istante UTC**: è l'ora da orologio da muro scritta
  con un suffisso `+00:00` che mente. Tutto il resto dell'app lo sa e usa
  `extractTimeFromISO` / `getAccurateStartTime`, che leggono le cifre della stringa. Qui invece
  `new Date()` la interpreta come UTC e la sposta di **+2 ore** (ora legale di Roma; +1 d'inverno).
  Il confronto con `now`, che è un istante vero, slitta di conseguenza.
- **Verifica aritmetica sui numeri del report:** alle 15:00, `14:50 → 16:50` (futuro → «In arrivo» ✅
  sintomo), `12:00 → 14:00` (60' di ritardo, fine 15:30 → «In ritardo», mai «In uscita» ✅ sintomo).
  Combacia esattamente.
- **È la stessa famiglia** del bug «orari +2h» già corretto nel briefing: la correzione non era
  arrivata fin qui.
- **Non tocca i dati:** lo snapshot `occupancy_start/end`
  ([useTableAssignments.ts:208](../../../../src/features/booking/hooks/useTableAssignments.ts#L208))
  fa aritmetica fra due istanti e poi ri-serializza in UTC, quindi il risultato è corretto. Il
  difetto è **solo** nei confronti con «adesso».

### S4-BUG-2 — «Turni esauriti» su un tavolo che risulta libero, e il fallimento è muto ⛔

- **Trovato da:** **Matteo**, non dagli agenti (vedi §5 per il perché).
- **Sintomo:** assegnando una prenotazione a un tavolo **verde/Libero**, nella console di sviluppo
  compare `✗ salvataggio · Turni esauriti per questo tavolo in questa fascia.` e l'assegnazione non
  avviene. A schermo **non compare nulla**.
- **Diagnosi (verificata su codice), due cause che danno lo stesso messaggio:**

  1. **I turni già chiusi continuano a contare.** In
     [useTableAssignments.ts:234-242](../../../../src/features/booking/hooks/useTableAssignments.ts#L234-L242)
     (e nel gemello multi-tavolo, righe 323-333) il numero di turno si calcola su **tutte** le righe
     del tavolo, comprese quelle con `checked_out_at` valorizzato:

     ```ts
     const forThisTable = existingAssignments.filter(
       (a) => a.table_id === tableId && a.service_slot_id === slotId && a.date === date,
     )
     const turnNumber = forThisTable.length > 0 ? Math.max(...) + 1 : 1
     if (!force && maxTurns !== null && turnNumber > maxTurns) throw new TurniEsauritiError(...)
     ```

     Il colore del tavolo invece guarda **solo** le righe attive
     ([useTableStatuses.ts:121](../../../../src/features/booking/hooks/useTableStatuses.ts#L121)).
     Risultato: tavolo **verde** che rifiuta. Con `max_turns = 2`, dopo due turni chiusi (o dopo due
     annullamenti, che scrivono anche loro `checked_out_at`) il tavolo è verde ma bloccato.
  2. **Fascia chiusa.** `max_turns = 0` significa «servizio chiuso» (corsia D, voce 8-3): allora
     `turnNumber = 1 > 0` e **qualunque** assegnazione fallisce, anche su un tavolo mai usato. Il
     messaggio però parla di turni esauriti, non di fascia chiusa: fuorviante.

- **Perché è muto:** `TurniEsauritiError` non produce toast di proposito, perché la UI deve offrire la
  forzatura. La UI la offre davvero
  ([AssignmentMapPanel.tsx:485-495 e 520-530](../../../../src/features/booking/components/servizio/AssignmentMapPanel.tsx#L485-L495)),
  ma il riquadro ambra **viene disegnato sotto la modale «Assegna tavolo»**, che nel percorso di
  errore **non viene chiusa**. Chi guarda vede solo la console. È la stessa radice di `S4-UX-8`.

### S4-REQ-3 — Liberare un tavolo deve archiviare la prenotazione (richiesta di prodotto, 02-08) ⛔

- **Oggi:** il checkout scrive `checked_out_at` sulla riga di assegnazione e basta. Il filtro
  [useUnassignedBookings](../../../../src/features/booking/hooks/useTableAssignments.ts#L126-L142)
  esclude solo le prenotazioni con un'assegnazione **attiva** → appena liberi il tavolo, la
  prenotazione **ricompare fra quelle da assegnare**. Confermato dalla corsia A (voce 2.1-5:
  «`[A] Rossi` ancora in elenco Servizio»).
- **Deve diventare:** liberato il tavolo, la prenotazione è **servita**: non torna nel cassetto e i
  suoi dati restano per le statistiche.
- **Attenzione a non rompere due comportamenti voluti**, che scrivono lo stesso `checked_out_at`:
  - **Annulla** (undo subito dopo un'assegnazione sbagliata) → la prenotazione **deve** tornare;
  - **«Libera e assegna»** (sostituzione forzata) → la prenotazione scavalcata **deve** tornare
    (verificato OK dalla corsia B, voce 3-7).
  Serve quindi un segno che distingua «turno finito» da «assegnazione annullata»: le due cose oggi
  sono indistinguibili nel database.

---

## 3. Difetti non bloccanti, ma reali

| ID | Cosa | Chi l'ha trovato | Gravità |
|----|------|------------------|---------|
| **S4-BUG-4** | **Walk-in «solo coperti» impossibile**: se la sala ha tavoli, il form pretende Sala + Tavolo («Seleziona un tavolo.»). La checklist 5-1 prevede il walk-in senza tavolo che conta comunque i coperti. | corsia B | media — è una **decisione di prodotto** prima che un fix |
| **S4-BUG-5** | **Capienza pubblica ignora i posti dei tavoli**: con D38 **spento**, 10 posti di tavoli e cap fascia 6, l'RPC `get_available_arrival_times` svuota gli orari già al **7° coperto**, come se il cap 6 valesse sempre. | corsia D | media/alta — tocca il **percorso pubblico** |
| **S4-BUG-6** | **Badge % in Calendario col denominatore sbagliato**: mostra `8 / 128` (posti di tutto il locale) invece del limite attivo della fascia. | corsia D | media |
| **S4-BUG-7** | **Classic senza badge di occupazione per fascia** in Calendario. Da capire se è una regressione di S4 o se il Classic è sempre stato così. | corsia D | **da chiarire subito**: se è regressione, tocca clienti paganti |
| **S4-UX-8** | Il riquadro «Tavolo occupato: conferma la sostituzione» compare **sotto** la modale «Assegna»: bisogna chiuderla con Annulla per poterci cliccare. | corsia B | media — stessa radice di `S4-BUG-2` |
| **S4-BUG-12** | **Ora di punta delle statistiche sfasata di 2 ore**: `new Date(r.confirmed_start).getHours()` in [useAnalytics.ts:160](../../../../src/features/booking/hooks/useAnalytics.ts#L160). Stessa causa di `S4-BUG-1`. | trovato leggendo il codice, **da nessun agente** | media |

---

## 4. Debiti e note, senza intervento immediato

- **S4-DEBT-9 — il form pubblico non è collaudabile in automatico.** La spunta Privacy
  (`privacy-consent-dietary-input`) è un input a `opacity-0` il cui stato React non cambia col click
  programmatico: la corsia D non ha potuto completare **nessuna** prenotazione sul tenant Classic
  (voce 7-3). Finché resta così, il form pubblico resta collaudabile **solo a mano**.
- **S4-NOTE-10 —** warning React di `@dnd-kit` in `TableMap`: *«The final argument passed to useEffect
  changed size between renders»*. Non blocca, va ripulito.
- **S4-NOTE-11 —** la fascia `AG-D` creata dalla corsia D (15:35–16:25, in un buco di 59 minuti fra
  Pranzo e Aperitivo) non produceva orari selezionabili sul form pubblico. È molto probabilmente un
  **artefatto del setup** (finestra troppo stretta rispetto a durata + preavviso minimo), non un
  difetto: da riprovare con una fascia larga prima di chiamarlo bug. Ha però reso **non verificabili**
  le voci 4-3, 4-4, 8-1 e 8-2.
- **Sotto 768px il trascinamento dei tavoli è disattivato di proposito** (corsia A): non è un difetto,
  ma va scritto nel piano perché il prossimo agente non lo scambi per uno.
- **Dati sporchi lasciati sull'ambiente:** un `[C] Conti` creato per sbaglio sul **02/08**, alcune
  `[B] Tavolata` duplicate da retry, `A-T3` sovrapposto ad `A-T2` dopo il drag di prova. Innocui, ma
  da tenere presente quando riguardi la mappa.

---

## 5. Perché gli agenti non hanno trovato `S4-BUG-2`

Non è sfuggito per distrazione: **la voce che l'avrebbe intercettato era l'unica bloccata**. Il piano
assegnava «Turni esauriti» (voce 3-6) alla corsia B, che però ha dovuto lavorare sulla fascia
**Pranzo** — condivisa e con turni **«Illimitata»** (`max_turns = null`). Con `max_turns` nullo il
controllo non scatta mai: `if (maxTurns !== null && …)`. La corsia ha correttamente segnato
`BLOCCATO` invece di inventarsi un esito.

Le altre tre corsie non potevano incontrarlo: A e C lavoravano su fasce esistenti senza mai
riassegnare un tavolo liberato, D aveva `max_turns = 2` ma su tavoli nuovi mai riusati.

**Correzione da portare nel piano:** la prova dei turni deve girare su una fascia **con un numero di
turni finito e basso**, e deve includere il caso «assegno → libero → riassegno», che è quello che
Matteo ha fatto a mano. Era un buco della copertura, non degli agenti.

---

## 6. Cosa resta a Matteo, a mano

1. Aprire il **PDF del briefing** scaricato dalla corsia B
   (`docs/_lavoro/e2e-s4/corsia-B/briefing-2026-08-02-giornata-completa.pdf`) e controllare gli orari.
2. **Giudizio estetico** sugli screenshot responsive della corsia C (leggibilità, non overflow: quello
   è già misurato).
3. **Decidere** su `S4-BUG-4`: il walk-in «solo coperti» è ancora un requisito?
4. **Decidere** su `S4-BUG-6`: il denominatore del badge deve essere il locale intero o il limite
   della fascia?
5. Le tre decisioni della §10 della checklist: soglia di ritardo, buffer di riassetto, durata walk-in.
