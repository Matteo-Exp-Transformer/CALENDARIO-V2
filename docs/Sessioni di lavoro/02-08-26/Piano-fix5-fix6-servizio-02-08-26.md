# Piano — S4-FIX-5 sostituzione guidata · S4-FIX-6 fasce sovrapposte

> Branch `env/test`. Nessuna migrazione, nessuna scrittura sul database di test: questo lavoro
> **non dipende** dal cantiere di allineamento Supabase in corso.
>
> Due lavori distinti, in file diversi, entrambi decisi da Matteo il 02-08-26:
> **FIX-5** (§2-§4) è il grosso; **FIX-6** (§4-bis) è una validazione mancante, contenuta.

---

## 1. Contesto — perché si fa

Nella vista **Servizio**, quando lo staff trascina una prenotazione su un tavolo già occupato l'app
apre un riquadro ambra con una sola via d'uscita: **«Libera e assegna»**. Chi era seduto viene
sloggiato e rispedito nell'elenco «da assegnare», senza che nessuno abbia chiesto niente.

Nella realtà del servizio quel momento ha tre esiti diversi, e oggi l'app ne conosce uno solo:

- i clienti seduti **si spostano** su un altro tavolo (il caso più frequente — oggi **non esiste**);
- i clienti seduti **hanno finito**: si libera e si chiude la prenotazione;
- i clienti seduti **tornano in attesa** di un tavolo (l'unico caso di oggi).

Il collaudo e2e della corsia B (`arch-d`, report `RIPROVA_B.md`) ha confermato che il flusso funziona
ma è cieco: lo staff non decide, subisce.

**Esito voluto:** il riquadro chiede quale dei tre, e lo staff sceglie in un gesto solo, senza uscire
dalla schermata e senza rischiare di perdere per strada chi era a tavola.

---

## 2. Cosa si vede a schermo

Trascino **Rossi** (nuova, 2 coperti) su **T3**, dove sta mangiando **Bianchi** (4 coperti).
Al posto del riquadro attuale compare:

```
⚠  T3 è occupato da Bianchi · 4 coperti
   Stai assegnando: Rossi · 2 coperti
   Cosa fai di Bianchi?

   ○ Sposta Bianchi su un altro tavolo
       → griglia dei tavoli liberi: T5 (6 posti) · T7 (4 posti)
   ○ Bianchi ha finito: libera il tavolo e archivia la prenotazione
   ○ Bianchi torna tra le prenotazioni da assegnare

   Motivo (opzionale) [_________________________]

   [ Conferma ]   [ Annulla ]
```

Regole di comportamento del riquadro:

- **Nessuna scelta preselezionata.** «Conferma» resta spento finché non ne scegli una.
- Scelta 1: «Conferma» resta spento anche finché non hai toccato un tavolo di destinazione.
- **Se non c'è nessun tavolo libero**, la scelta 1 è spenta con scritto sotto:
  *«Nessun tavolo libero in questa fascia: puoi archiviare o rimettere in attesa.»*
- Il campo **Motivo** resta com'è oggi e finisce in `force_reason` sulla nuova assegnazione (audit).
- Il ramo **«Turni esauriti»** (`kind: 'turns'`) **non si tocca**: resta il riquadro con
  «Assegna comunque», identico a oggi.
- L'etichetta del pulsante segue la scelta: *Sposta e assegna* · *Archivia e assegna* ·
  *Rimetti in attesa e assegna*.

---

## 3. Regole decise da Matteo (02-08-26) — non riaprire

1. **La scelta 1 riguarda chi è già seduto**, non la prenotazione trascinata: T3 passa a Rossi,
   Bianchi va sul tavolo libero che scegli in quel momento.
2. **Lo spostamento non brucia un turno del tavolo conteso.** Se T3 aveva 2 turni, dopo lo scambio
   ne risulta usato **1** (solo Rossi). Della sosta di Bianchi su T3 non resta traccia sul tavolo:
   Bianchi compare sul tavolo nuovo.

**Regola derivata dalla 2 — segnalala a Matteo in apertura di report, è un cambio di comportamento
esistente.** La stessa logica si applica alla scelta 3: chi torna in attesa non ha *servito* un
turno, quindi la riga sul tavolo conteso sparisce invece di essere timbrata. Oggi invece la scelta 3
timbra `checked_out_at` e brucia il turno. È lo stesso principio già adottato per «Annulla»
(`useUndoTableAssignment`: DELETE fisico, «non consuma un posto nel conteggio turni», e il commento
in quel punto spiega che non viola D48 perché D48 vale sui turni **realmente serviti**).
La scelta 2 invece **conta il turno**: lì il pasto c'è stato davvero.

| Scelta | Riga sul tavolo conteso | `served_at` della prenotazione spostata | Turno consumato su T3 |
|---|---|---|---|
| 1 · Sposta | **DELETE** + nuova riga sul tavolo scelto | resta `null` | no |
| 2 · Archivia | `checked_out_at` (resta in archivio) | valorizzato *(solo se non le restano altri tavoli attivi)* | **sì** |
| 3 · In attesa | **DELETE** | resta `null` | no |

**Tavolate su più tavoli.** Si agisce **solo sul tavolo conteso**: gli altri tavoli della tavolata
restano a Bianchi. Con la scelta 2 vale già la regola esistente `markBookingServedIfFullyReleased` —
se restano altri tavoli attivi la prenotazione **non** viene archiviata e parte il toast di avviso
già presente.

**Più prenotazioni attive sullo stesso tavolo.** Il riquadro nomina la prenotazione con
`turn_number` più basso fra quelle attive — la stessa su cui agisce l'hook. Quello che leggi è
quello che succede.

---

## 4. Cosa cambia nel codice

### `src/features/booking/hooks/useTableAssignments.ts`

`useForceReplaceBookingOnTable` (riga 437) prende un parametro nuovo
`outcome: 'move' | 'archive' | 'requeue'` e, per `'move'`, `targetTableId: string`.

Oggi fa una cosa sola: `update({ checked_out_at })` sulla riga attiva, poi insert della nuova.
Diventa:

- **`requeue`** → `delete()` sulla riga attiva (al posto dell'update), poi insert della nuova.
- **`archive`** → come oggi (`update checked_out_at`), **più** `markBookingServedIfFullyReleased`
  (riga 238) passando il numero di righe attive rimaste su quella prenotazione, esattamente come fa
  `useCheckoutTable` (righe 597-608).
- **`move`** → tre passi, **in quest'ordine**:
  1. **insert** della prenotazione spostata sul tavolo di destinazione (`turn_number` calcolato lì
     con `computeNextTurnNumber`);
  2. **delete** della sua riga sul tavolo conteso;
  3. **insert** della prenotazione nuova sul tavolo conteso.

  L'ordine non è estetico: supabase-js non dà transazioni, e se qualcosa si rompe a metà questo
  ordine lascia comunque Bianchi seduto da qualche parte. L'ordine inverso lo lascerebbe in piedi.
  Se il passo 1 fallisce, l'intera operazione si ferma prima di toccare il tavolo conteso.

Invariati e da riusare così come sono: `clearBookingServedAt` (218), `writeOccupancySnapshot`
(D15 non sovrascrive uno snapshot già presente, quindi non va richiamato per chi viene spostato),
`computeNextTurnNumber`, `TurniEsauritiError`.

Il messaggio di successo va differenziato per esito («Bianchi spostato su T5, T3 assegnato a Rossi»
e simili): il toast unico di oggi non dice cosa è successo a chi.

### `src/features/booking/components/servizio/AssignmentMapPanel.tsx`

- `ForceConfirmState` (riga 247) prende due campi: l'esito scelto (`null` finché non si sceglie) e
  il tavolo di destinazione.
- Il ramo `kind === 'replace'` del riquadro ambra (righe 736-784) diventa il blocco a tre scelte.
  Per la griglia dei tavoli di destinazione **riusa il markup della modale «Assegna tavolo»**
  (righe 823-915: raggruppamento per sala, `STATUS_CLASSES`, posti, turni residui) filtrando ai
  tavoli con stato `free` e turni ancora disponibili — niente componente nuovo.
- `handleForceAssign` (riga 609) passa l'esito all'hook.
- Il nome e i coperti di chi è seduto si leggono da `bookingsByTable`, già in memoria.
- I tre punti che aprono la forzatura restano quelli di oggi e non cambiano:
  `handleDragEnd` (riga 580), il tasto tavolo occupato nella modale (riga 882), e la voce
  «turni esauriti» (riga 864, ramo diverso, non toccato).

**Non toccare**, in questo lavoro: `ServicePlanMap.tsx`, `TableShape.tsx`, `TableMap.tsx`,
`QuickTableAssignModal.tsx`, la modale avviso fine turno.

### Test

Nuovi, con la convenzione già in uso nella cartella (`*.fix2.test.*`, `*.5stati.test.*`):

- `src/features/booking/hooks/__tests__/useTableAssignments.sostituzioneGuidata.test.ts`
  — un caso per esito: `move` fa i tre passi nell'ordine giusto e non lascia `served_at`;
  `archive` timbra `checked_out_at` **e** `served_at`, ma **non** `served_at` se alla prenotazione
  restano altri tavoli attivi; `requeue` cancella la riga e lascia `served_at` a `null`.
- `src/features/booking/components/__tests__/AssignmentMapPanel.sostituzioneGuidata.test.tsx`
  — il riquadro mostra i due nomi; «Conferma» è spento finché non scegli; con la scelta 1 resta
  spento finché non scegli il tavolo; senza tavoli liberi la scelta 1 è spenta con la sua spiegazione.

**Test esistente da aggiornare:** `useTableAssignments.fix2.test.ts:205`
(«3a. Libera e assegna → NON marca served_at sulla prenotazione scavalcata»). Resta valido nella
sostanza — `served_at` continua a non essere marcato — ma la scelta 3 ora cancella la riga invece di
timbrarla: vanno cambiate le attese sulla chiamata al database, non l'intento del test. Scrivi nel
commento **perché** è cambiato.

`npm run validate` deve restare verde (riferimento: 148 file / 1235 test). **Mai lanciare prettier
su questo repo.**

---

## 4-bis. S4-FIX-6 — una fascia di servizio non deve poter accavallarsi su un'altra

**Il difetto.** Nel collaudo, due agenti su quattro hanno creato una fascia sopra Pranzo e Cena
(`AG-B2` 19:00–22:00, `AG-D2` 10:00–13:00) e l'app le ha **salvate senza un fiato**. Effetto
collaterale visto in Servizio: nella fascia nuova comparivano prenotazioni appartenenti alle fasce
sottostanti, con il rischio concreto di assegnare un tavolo alla persona sbagliata.
Matteo ha confermato il 02-08-26: **è un difetto**, va chiuso.

**La cosa da sapere prima di scrivere codice: il controllo esiste già, ma sull'editor sbagliato.**
`validateSlotConfigs` in `src/features/booking/utils/bookingTimeSlots.ts:25-45` blocca esattamente
questo caso — messaggio `Le fasce "X" e "Y" si sovrappongono` — e gestisce già le fasce che passano
la mezzanotte tramite `slotRangesOverlap`. È usata da **Impostazioni → Imposta Fasce Orarie**
(`RestaurantSettingsTab.tsx:107`) ed è coperta da test
(`settingsTimeSlots.settingsM4.adminBlindatura.test.tsx:323`).
L'editor delle fasce di **Servizio** (`ServiceSlotsManager.tsx`) non la chiama mai.
**Riusa quella funzione: non scriverne una seconda.**

**Dove intervenire.** `src/features/booking/components/servizio/ServiceSlotsManager.tsx`, nel
`submit`, **subito prima** del ramo «Modifica permanente (valore base)» che costruisce `payload`
(riga ~559) e quindi prima di `create.mutate` / `update.mutate` (righe 586-590):

- confronta la fascia in corso di salvataggio con **tutte le altre già esistenti**, escludendo se
  stessa quando `isEdit` (`initial.id`);
- se si accavalla, **non salvare**: mostra l'errore nella modale, con i nomi delle due fasce, nello
  stesso stile degli altri errori di quel form;
- il ramo **«modifica a tempo»** (override su un intervallo di date, righe 537-557) non tocca gli
  orari: lì il controllo non serve e non va aggiunto.

**Confine da rispettare.** Solo controllo lato app. **Nessuna migrazione, nessun vincolo sul
database, nessun tocco alla RPC `update_service_slot`**: sarebbe un cambio di schema con ricaduta su
produzione, e c'è un altro cantiere aperto proprio sul registro migrazioni.

**Test** — `src/features/booking/components/__tests__/serviceSlots.sovrapposizione.test.tsx`:
due fasce accavallate → il salvataggio non parte e nessuna mutation viene chiamata; fasce adiacenti
(fine dell'una = inizio dell'altra) → **si salva**, non è una sovrapposizione; modifica di una
fascia esistente senza spostarne gli orari → si salva (non deve accavallarsi con se stessa).

**File posseduti da questo fix:** `ServiceSlotsManager.tsx` e il suo test. Nessuna sovrapposizione
con FIX-5 né con le rifiniture del giro 4 → può correre in parallelo a tutto.

---

## 5. Sequenza degli agenti — questi fix dentro il giro 4

Il vincolo è l'**ownership dei file**: due agenti non possono avere aperto lo stesso file.
FIX-5 possiede `AssignmentMapPanel.tsx` + `useTableAssignments.ts`, quindi entra in collisione con
FIX-4B/4C e con FIX-4A, ma **non** con FIX-4D. FIX-6 sta per conto suo e non collide con nessuno.

| Ondata | In parallelo | File posseduti |
|---|---|---|
| **1** | **S4-FIX-5** · **FIX-4D** (tavoli più grandi) · **S4-FIX-6** | `AssignmentMapPanel.tsx` + `useTableAssignments.ts` · `ServicePlanMap.tsx` + `TableShape.tsx` · `ServiceSlotsManager.tsx` |
| **2** | **FIX-4B + 4C** (striscia in testata, orario su card) | `AssignmentMapPanel.tsx` |
| **3** | **FIX-4A** (card espandibile + lampeggio) | tutti e due i file |
| **4** | Consolidamento | — |

I prompt del giro 4 stanno in `docs/Testing-Skill/PROMPT_AGENTI_E2E_S4.md`; va aggiunto lì il prompt
di questo fix, con le stesse clausole di ownership («File che POSSIEDI / File che NON devi toccare»,
niente commit, un solo `npm run dev`, non correggere errori di `validate` su file non tuoi).

---

## 6. Verifica a mano, sul dev server

Sulla data e fascia di prova, con un tavolo occupato e almeno un tavolo libero:

1. Trascina una prenotazione sul tavolo occupato → compaiono le tre scelte, «Conferma» spento.
2. **Scelta 1**: scegli il tavolo libero → conferma. Chi era seduto compare sul tavolo nuovo, il
   tavolo conteso mostra la prenotazione nuova, e sul tavolo conteso i **turni residui sono calati
   di uno solo**, non di due.
3. **Scelta 2**: conferma → il tavolo passa alla nuova, chi c'era sparisce dall'elenco «da
   assegnare» (archiviata). Se aveva anche un secondo tavolo, resta attiva e parte il toast di avviso.
4. **Scelta 3**: conferma → chi c'era ricompare fra le «da assegnare», e il tavolo conteso mostra
   **un solo** turno consumato.
5. «Annulla» in tutti e tre i casi non tocca niente.
6. Un tavolo con **turni esauriti** (non occupato) continua a mostrare il vecchio riquadro
   «Assegna comunque»: quel ramo non deve essere cambiato.
7. Console del browser: zero errori applicativi.

Per **FIX-6**, nella gestione fasce di Servizio:

8. Crea una fascia che si accavalla su Cena → il salvataggio **si rifiuta** e dice quali due fasce
   si pestano i piedi. Creane una che finisce quando l'altra comincia → **si salva**.
   Riapri una fascia esistente, cambia solo il numero di turni e salva → **si salva**.

---

## 7. Fuori scope — aperti dai report del giro 3, da decidere a parte

1. **«Chiudi servizio» non spegne gli orari sul form pubblico** (`RIPROVA_D.md`, bug 1).
   Verificato: `max_turns` non compare in nessuna Edge Function né RPC pubblica — la chiusura fascia
   non è mai stata collegata al percorso cliente. Non è una regressione di S4. Toccarlo significa
   Edge + form pubblico → rischio produzione → **cantiere separato con via libera esplicita**.
2. **Voci di collaudo rimaste bloccate**: avviso fine turno (2.2), pulsanti a 375px (9-7),
   archiviazione da finestra fine turno (arch-a), tavolata multi-tavolo (arch-e), stato «In uscita»
   (3-4). Sono bloccate dall'orario, non dal codice: servono una fascia lunga o una durata pasto
   corta, non un fix.

---

## 8. Chiusura

Report di sessione in `docs/Sessioni di lavoro/<data>/` secondo `APP_CONTEXT_SKILL.md` §7.1.
Allineamento skill §7.2 su `docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md` (le tre scelte, la
regola del turno non consumato, il divieto di fasce accavallate) e su
`docs/Testing-Skill/COLLAUDO_S4_CHECKLIST.md`.
I prompt per gli agenti vanno aggiunti in `docs/Testing-Skill/PROMPT_AGENTI_E2E_S4.md` seguendo
l'intestazione obbligatoria di `docs/PREPARA_PROMPT_SKILL.md` (Profilo / Modalità / Skill da leggere /
Non caricare / Output attesi): **FIX-5 in modalità `deep`** (cambia comportamento e semantica dei
turni), **FIX-6 in modalità `standard`**.
Nessun commit senza richiesta esplicita di Matteo.
