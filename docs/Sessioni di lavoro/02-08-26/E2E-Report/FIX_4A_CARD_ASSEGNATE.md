# FIX-4A — Card "Assegnate" apribile, togli tavolo, lampeggio (S4 giro 4, ondata 2)

Data: 02-08-26 · Branch: `env/test` · Nessun commit / push / migrazione / scrittura di schema

## Cappello

- **Cosa è cambiato:** nella testata della vista Servizio, ogni card della tavolata già assegnata
  ora si apre al click: mostra i tavoli uno per riga (con quanti posti) e permette di togliere un
  singolo tavolo, non solo di aggiungerne. Al click, quei tavoli lampeggiano nella piantina sotto,
  così si vedono a colpo d'occhio.
- **Cosa resta:** solo il controllo a video (nessun browser nel mio toolset — vedi checklist in
  fondo). Un limite noto sotto 1024px è descritto al punto (d) più sotto.
- **Serve una tua azione:** no. Quando hai un minuto, prova la checklist in fondo.

---

## In una frase

Prima, sotto "Assegnate" c'era solo un pulsante "Aggiungi tavolo": per correggere una tavolata
sbagliata (es. tavolo scelto per errore) non c'era altra strada che chiedere aiuto o smontare tutto.
Ora la card si apre, elenca i tavoli e si può togliere quello sbagliato con un click — la
prenotazione resta assegnata agli altri tavoli, o torna fra quelle da assegnare se era l'unico.

## File toccati

- `src/features/booking/components/servizio/AssignmentMapPanel.tsx` — memo `assignedGroups` esteso
  con l'id di riga per tavolo, stato `expandedGroupBookingId`, toggle apertura/chiusura, funzione
  `handleRemoveAssignedTable`, markup della card "Assegnate" (header cliccabile + elenco tavoli +
  pulsante "Togli" per riga), passaggio di `highlightedTableIds` a `ServicePlanMap`.
- `src/features/booking/components/servizio/ServicePlanMap.tsx` — nuova prop opzionale
  `highlightedTableIds` su `ServicePlanMap` e `highlighted` su `PlanTable`; applica la classe CSS
  `servizio-table-highlight` alla sagoma quando il tavolo è nell'elenco.
- `src/index.css` — nuova classe `.servizio-table-highlight` + `@keyframes
  servizio-table-highlight-pulse` + override `@media (prefers-reduced-motion: reduce)`. Copiato
  esattamente lo schema già esistente di `booking-public-field-attention-pulse` (stessa struttura:
  animazione di default, contorno fisso se l'utente ha disattivato le animazioni), colore
  `--color-primary-500` invece di `--color-warm-orange` perché qui non è un errore ma
  un'evidenziazione "selezionato/aperto" — stesso significato del `ring-2 ring-primary-500` già
  usato altrove in questo stesso file per lo stato "selezionato" nella modale di assegnazione.
- `src/features/booking/components/__tests__/AssignmentMapPanel.fix4a.test.tsx` — **nuovo file di
  test**, 9 test.

Nessun componente nuovo (solo modifiche ai due file assegnati + CSS + test, come da mandato).

## Scelta fatta sul punto (b) — dove prendere l'id dell'assegnazione

`assignedGroups` prima buttava via le righe (`BookingTableAssignment[]`) tenendo solo i tavoli
derivati. Ora, per ogni prenotazione raggruppata, costruisco prima una mappa `tableId → riga più
recente` (confronto su `created_at`), poi ne derivo `tableRows: Array<{ table, assignmentId }>`.
**Se per lo stesso tavolo esistono più righe attive per la stessa prenotazione** (caso limite: non
dovrebbe capitare nel flusso normale, dove un tavolo ha un solo assignment attivo per turno), tengo
la più recente e "Togli" agisce su quella riga — dichiarato qui come richiesto dal prompt.

`group.tables` (solo tavoli) è stato sostituito da `group.tableRows` (tavolo + id riga) in tutto il
file; ho aggiornato anche il testo `"{coperti} coperti · {nomi tavoli} ({posti})"` che leggeva la
vecchia struttura.

## Cosa succede al click — passo per passo

1. **Click sulla card** → `toggleExpandedGroup(booking.id)`: se la card era chiusa la apre, se era
   già quella aperta la richiude. Aprirne una nuova chiude automaticamente quella precedente perché
   lo stato è un singolo `expandedGroupBookingId` (una sola card aperta per costruzione, non serve
   nessuna logica aggiuntiva).
2. **Aperta**, mostra un elenco con un tavolo per riga: `{sala ·} {nome tavolo} · {posti}`. Il prefisso
   sala compare **solo se il ristorante ha più di una sala** (`rooms.length > 1`) — stessa
   convenzione già in uso nel Briefing turno (D52: "T12" mono-sala vs "Sala · T12" multi-sala) e
   nell'avviso di fine turno; l'ho riusata invece di inventare un formato nuovo.
3. **Pulsante "Togli"** per riga → `handleRemoveAssignedTable(assignmentId)` → chiama
   `useUndoTableAssignment().mutate({ assignmentId, date: selectedDate, slotId: selectedSlotId })`
   (vedi punto (a) sotto per la scelta fra undo e checkout). Il pulsante "Aggiungi tavolo" resta
   invariato, fuori dall'elenco (stesso `onClick={() => openQuickAssign(group.booking.id, 'add')}`
   di prima).
4. **Lampeggio piantina**: `highlightedTableIds` è un `useMemo` derivato dalla card aperta
   (`expandedGroup.tableRows.map(row => row.table.id)`), passato a `ServicePlanMap`. Chiudere la
   card (o aprirne un'altra) fa ricalcolare l'elenco a `[]` (o ai tavoli della nuova card) — il
   lampeggio segue automaticamente, non c'è uno stato separato da tenere sincronizzato a mano.
5. **Se la card sparisce da sola** (perché era l'ultimo tavolo e la prenotazione è tornata fra le
   non assegnate — vedi punto c), `expandedGroupBookingId` resta valorizzato ma
   `assignedGroups.find(...)` non trova più nulla: `expandedGroup` diventa `null`,
   `highlightedTableIds` torna `[]` da solo. Non serve un reset esplicito, è una conseguenza diretta
   di come è derivato lo stato.

## (a) Perché `useUndoTableAssignment` e non `useCheckoutTable`

`useCheckoutTable` (riga ~644 di `useTableAssignments.ts`) timbra `checked_out_at`, **consuma un
turno** e, se non restano altri tavoli attivi sulla stessa prenotazione, **archivia** scrivendo
`served_at` (`markBookingServedIfFullyReleased`). È il pulsante "Libera tavolo": corretto quando la
tavolata ha *finito di mangiare*.

`useUndoTableAssignment` (riga ~607) fa un **DELETE fisico** della riga: non tocca `served_at`, non
consuma un turno, non lascia traccia in archivio (non viola D48 append-only perché quel principio
vale per i turni **realmente serviti**, non per una correzione). È lo stesso hook già usato dal
pulsante "Annulla" appena dopo un'assegnazione e da S4-FIX-5 per l'esito "in attesa".

"Togli tavolo" corregge un errore di composizione della tavolata (tavolo sbagliato, cliente vuole
un tavolo diverso, ecc.), **non** segna la fine del servizio: usare il checkout qui brucerebbe un
turno reale e potrebbe archiviare una prenotazione che il cliente non ha ancora consumato — il
difetto che il prompt segnalava esplicitamente come il peggiore da evitare. Ho collegato
`handleRemoveAssignedTable` solo a `useUndoTableAssignment().mutate`, mai a `checkoutTable`, ed è
verificato da un test dedicato (vedi sotto) che spia entrambe le mutation e controlla che solo la
prima venga chiamata.

## (c) Rimozione dell'ultimo tavolo — verificato, non solo dichiarato

`useUndoTableAssignment.onSuccess` fa già `refetchQueries` su entrambe le query rilevanti:
`[TABLE_ASSIGNMENTS_QUERY_KEY, tenantId, date]` (gli assignment) e
`[TABLE_ASSIGNMENTS_QUERY_KEY, tenantId, date, slotId, 'unassigned']` (le non assegnate). Non ho
toccato questo hook — è già corretto e condiviso con "Annulla" e S4-FIX-5.

Il percorso end-to-end, letto nel codice:
1. La riga viene cancellata → il prossimo `useTableAssignments(date)` non la contiene più.
2. `activeAssignments` (filtrato su slot+data+`checked_out_at === null`) non ha più nessuna riga per
   quella prenotazione → `assignedGroups` non genera più un gruppo per lei → la card sparisce da
   "Assegnate".
3. `useUnassignedBookings` rifà la query: prende le prenotazioni `accepted` sulla data, poi esclude
   quelle con un assignment attivo per quello slot (`activeAssignedBookingIds`). Senza più righe
   attive, la prenotazione **non è più esclusa** → ricompare in "Prenotazioni (N)".

**Non l'ho solo letto: l'ho anche dimostrato con un test component-level** (non ho un browser, ma
questo è verificabile senza uno): `AssignmentMapPanel.fix4a.test.tsx`, describe "rimozione
dell'ultimo tavolo" — renderizza con 1 sola assegnazione attiva, clicca "Togli", verifica la
chiamata alla mutation con i parametri giusti, poi **simula il dato fresco che arriverebbe dal
refetch reale** (assignments vuoto, booking di nuovo in `unassigned`) e verifica che dopo il
re-render la sezione "Assegnate" sparisca e "Prenotazioni (1)" compaia con quel cliente. Questo
prova che *il rendering del pannello* segue correttamente i dati aggiornati — la parte di
invalidation/refetch della mutation è codice preesistente, non toccato in questo giro, e già
esercitato dai suoi stessi test (`useTableAssignments.fix2.test.ts` e affini).

## (d) Lampeggio — limite noto sotto 1024px

`ServicePlanMap` mostra **una sola sala alla volta** sotto `lg` (1024px) — le altre sono
`hidden lg:block` (§9.7 di questo stesso contesto). Se la card aperta ha tavoli in una sala diversa
da quella scelta nelle linguette, quei tavoli hanno comunque la classe `servizio-table-highlight`
nel DOM (l'ho verificato: la classe si applica per `table.id`, indipendentemente da quale sala è
visibile), ma **non si vedono** finché lo staff non cambia linguetta manualmente — non c'è nessuno
scorciatoia automatica che cambi sala per inseguire il lampeggio. L'ho lasciato così di proposito:
cambiare sala automaticamente sotto lo staff senza che l'abbia chiesto sarebbe una sorpresa peggiore
del limite stesso, e il caso (tavolata divisa fra due sale diverse) è già raro. Documentato anche nel
commento della prop in `ServicePlanMap.tsx`.

## Rispetto di `prefers-reduced-motion`

Copiato esattamente il pattern già in `index.css` (`booking-public-field-attention-pulse` +
`@media (prefers-reduced-motion: reduce)` subito sotto): stessa struttura, keyframes che pulsano
`box-shadow`/`outline-color`, e un override sotto la media query che spegne l'`animation` e lascia un
contorno fisso (`outline` + `box-shadow` statico). Nessuna classe Tailwind costruita a runtime: la
classe applicata è sempre la stringa letterale `'servizio-table-highlight'` (ternario fra stringa
vuota e quella, non concatenazione dinamica).

Il contorno è un `outline` + `box-shadow` sulla sagoma stessa (non un riquadro sovrapposto): non
intercetta i click né interferisce con `useDroppable` (`plan-table-<id>`), perché non introduce
nessun nodo DOM aggiuntivo — è solo pittura sopra l'elemento esistente. Il `<button>` resta lo stesso
nodo, stesso `ref`, stessa area cliccabile/droppable di prima.

## Test

Nuovo file `AssignmentMapPanel.fix4a.test.tsx`, **9 test, tutti verdi**:

1. Card chiusa di default: nessun elenco tavoli, nessun "Togli".
2. Un click apre la card: elenco tavoli (`nome · posti`), un "Togli" per riga, "Aggiungi tavolo"
   ancora presente.
3. Un secondo click sulla stessa card la richiude.
4. Aprire una seconda card chiude automaticamente la prima (un solo "Togli" visibile alla volta).
5. Con più tavoli residui: "Togli" sul tavolo giusto chiama **solo** `useUndoTableAssignment` con
   l'id di quella riga, **mai** `useCheckoutTable`.
6. Stesso controllo cliccando sul secondo tavolo della tavolata (id diverso, riga diversa).
7. Rimozione dell'ultimo tavolo: dopo dati aggiornati (simulazione del refetch) la prenotazione
   lascia "Assegnate" e ricompare in "Prenotazioni" — vedi punto (c).
8. Apertura della card: i tavoli della tavolata prendono `servizio-table-highlight` nella piantina.
9. Chiusura della card: la classe sparisce.

Test esistenti confermati verdi e **non modificati** nella logica (solo un aggiustamento
inevitabile, vedi nota sotto): `AssignmentMapPanel.fix4bc.test.tsx` (7),
`AssignmentMapPanel.sostituzioneGuidata.test.tsx` (4), `AssignmentMapPanel.fix2.test.tsx`,
`AssignmentMapPanel.fineTurnoMultiTavolo.test.tsx`, `AssignmentMapPanel.5stati.test.tsx`,
`servizioA1Fixes.test.tsx`, `ServizioPage.dueViste.test.tsx`, `ServizioPage.tableMode.test.tsx`,
`ServicePlanMap.griglia.test.tsx` (10, tutti della corsia FIX-4D, invariati).

**Nota su una collisione trovata e corretta durante lo sviluppo:** la prima versione dell'header
cliccabile usava `aria-label="{cliente}, mostra tavoli assegnati"`. La parola "assegnati" contiene
la sottostringa "assegna" (case-insensitive), quindi `screen.getByRole('button', { name: /Assegna/i
})` — già usato da test esistenti (`fix2`, `sostituzioneGuidata`) per trovare il pulsante "Assegna"
della card non-assegnata — trovava **due** bottoni e falliva con "multiple elements found". Ho
cambiato l'`aria-label` in `"Tavoli di {cliente}"` (nessuna parola con radice "assegna"): i test
preesistenti sono tornati verdi senza toccarli. Menzionato perché è l'unico punto in cui il mio
lavoro ha rischiato di rompere l'altra corsia — risolto lato mio, non lato loro.

**Altro aggiustamento tecnico (non funzionale):** un `<button>` HTML non può contenere `<p>`/`<div>`
per spec (solo "phrasing content"). L'header cliccabile della card usa quindi `<span>` con
`className="block"` dove prima usavo `<p>`, mantenendo lo stesso layout visivo (le classi Tailwind
`flex`/`block`/`truncate` non dipendono dal tag). Nessun impatto sui test (le query RTL sono per
testo, non per tag).

## Esito `npm run validate`

**Verde, exit code 0**:
- `npm run lint` — 0 problemi (zero warning tollerati).
- `npm run typecheck` — 0 errori.
- `npm run test` — **153 file / 1268 test, tutti verdi** (include il lavoro delle due corsie
  precedenti già atterrato: `BookingCardsStrip.tsx`, `tableShapeMetrics.ts`,
  `AssignmentMapPanel.fix4bc.test.tsx`, `ServicePlanMap.griglia.test.tsx` con i 7 test FIX-4D).

Non ho lanciato `prettier` in nessun momento.

## Controllo a video — NON VERIFICABILE da me, resta da fare a mano

**Nota di onestà**: questo agente non ha un tool di browser/screenshot/rendering visuale nel
toolset disponibile (solo Bash/PowerShell, Read/Edit/Write, Grep/Glob — nessun tool tipo Playwright
o screenshot). Tutto quanto sopra su apertura/chiusura card, lampeggio, contorno statico sotto
reduced-motion e resa a 375/834/1280px è **ragionato su codice/markup/CSS**, mai osservato a video.
Il controllo a video resta da fare a mano da Matteo — checklist sotto.

## Checklist per Matteo — cosa cliccare nella pagina Servizio

1. Vai su **Servizio → Mappa** (si apre sulla vista **Servizio**).
2. Scegli una **data** e una **fascia** con almeno una tavolata già assegnata a più tavoli (se non
   ce l'hai a mano: assegna una prenotazione a due tavoli con "Assegna tavolo" → selezione multipla,
   già esistente).
3. Guarda la striscia **"Assegnate (N)"**: clicca su una card.
   - **Cosa deve succedere:** la card si allarga verso il basso (non si apre una finestra nuova) e
     mostra un elenco con un tavolo per riga (nome tavolo e posti), ciascuno con un pulsante
     **"Togli"**. Il pulsante **"Aggiungi tavolo"** resta sotto, invariato.
   - **Contemporaneamente**, nella piantina sotto, i tavoli di quella prenotazione devono
     **lampeggiare** (un contorno che pulsa). Se hai disattivato le animazioni nel sistema operativo
     (impostazione "riduci movimento"), invece del lampeggio deve comparire un contorno **fisso**,
     sempre visibile, mai lampeggiante.
4. Clicca su un'**altra** card "Assegnate": la prima si deve chiudere da sola, si apre la seconda e
   il lampeggio si sposta sui suoi tavoli.
5. Clicca di nuovo sulla stessa card aperta: si richiude, il lampeggio sparisce dalla piantina.
6. Apri una card con **più tavoli**, clicca **"Togli"** su UNO dei tavoli:
   - **Cosa deve succedere:** quel tavolo esce dall'elenco; la prenotazione resta comunque fra le
     "Assegnate" (con gli altri tavoli); il tavolo appena tolto torna **libero** in piantina.
7. Apri una card con **un solo tavolo**, clicca **"Togli"**:
   - **Cosa deve succedere:** la card sparisce del tutto dalla striscia "Assegnate"; la prenotazione
     ricompare nella striscia **"Prenotazioni (N)"** come se non fosse mai stata assegnata; il
     tavolo torna libero.
   - **Attenzione a NON vedere**: nessun turno consumato, nessuna archiviazione — se controlli il
     conteggio turni residui del tavolo nella modale "Assegna tavolo", non deve essere diminuito da
     questa azione (diverso da "Libera tavolo", che invece consuma un turno).
8. Prova a tre larghezze (telefono ~375px, tablet ~834px, desktop ~1280px con due sale affiancate):
   la card si apre/chiude e il "Togli" resta cliccabile e leggibile a tutte e tre.
9. **Limite noto**: se hai due sale e la tavolata aperta ha tavoli in una sala diversa da quella
   che stai guardando (sotto 1024px se ne vede una sola), il lampeggio non si vede finché non cambi
   linguetta — non è un bug, è il comportamento già esistente delle due colonne di sale (nessuna
   sorpresa: la stessa card di prima non mostrava mai due sale contemporaneamente sotto 1024px).
