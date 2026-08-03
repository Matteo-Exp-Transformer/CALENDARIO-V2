# FIX-4B/4C — frecce di scorrimento + ora di arrivo sulla testata (S4 giro 4, corsia "testata")

Data: 02-08-26 · Branch: `env/test` · Nessun commit / push / migrazione / scrittura DB

## In una frase

Nella pagina Servizio → Mappa → vista **Servizio**, la striscia orizzontale sopra la piantina
("Prenotazioni (N)" e "Assegnate (N)") ora mostra l'**ora di arrivo** su ogni card e si scorre con
due **frecce** invece che con la barra di scorrimento del browser.

## Cosa resta

Niente di bloccato sul mio lavoro. Il controllo **a video** (375/834/1280px, drag & drop reale) resta
da fare a mano da Matteo — vedi sezione dedicata sotto: non ho un browser nel mio toolset.

## Serve una tua azione

No — nessuna scelta aperta. Solo il controllo a video quando hai un minuto (checklist in fondo).

---

## PARTE 1 — FIX-4C: ora di arrivo sulle card

**Prima**: le card mostravano solo nome cliente e "N coperti". Chi sta a servizio non sapeva se una
tavolata arrivava fra 10 minuti o fra 2 ore senza aprire la scheda.

**Dopo**: ora compare anche l'orario, su entrambe le strisce.

- **Card "Prenotazioni (N)"** (`DraggableBookingCard`): la riga coperti diventa
  `N coperti · HH:mm` quando l'orario è noto. Il testo (icona + "N coperti · HH:mm") è avvolto in uno
  `<span className="truncate">` dentro un contenitore `flex min-w-0`: se lo spazio non basta si
  taglia con ellissi, il **nome cliente sopra non va mai a capo** (resta sulla sua riga con
  `truncate` come prima) e la card resta alta quanto prima (nessuna riga aggiunta).
- **Card "Assegnate (N)"**: l'orario compare come piccola etichetta a destra del nome cliente, sulla
  stessa riga (`flex items-center justify-between`) — non aggiunge altezza alla card. La riga
  "N coperti · T1, T2 (N posti)" sotto resta invariata.
- **Ora presa nel modo giusto (trappola storica del progetto)**: `trimTimeToHHmm(getAccurateStartTime(booking))`,
  esattamente come già usato altrove nello stesso file (es. riga 164, 1157-1159 prima del mio
  intervento) — **mai** `new Date(confirmed_start)`, che sposterebbe l'ora di uno o due fusi a
  seconda della stagione (il timestamp è salvato con un `+00:00` finto, le cifre sono l'ora del
  ristorante).
- **Se l'ora manca**: `getAccurateStartTime` torna stringa vuota → `|| null` → niente si mostra.
  Nessuna riga vuota, nessun `--:--`. Coperto da test.

## PARTE 2 — FIX-4B: frecce al posto della barra di scorrimento

**Prima**: la striscia scorreva con la barra nativa del browser (visibile, ingombrante su schermi
touch).

**Dopo**: nuovo componente `src/features/booking/components/servizio/BookingCardsStrip.tsx`, che
sostituisce i due `<div className={cardsWrapClass}>` (uno per "Prenotazioni", uno per "Assegnate")
in `AssignmentMapPanel.tsx`.

### Come funziona

- **Due modalità**, decise dal chiamante (`mode={listInHeader ? 'scroll' : 'list'}`, dove
  `listInHeader = layout === 'plan'`):
  - `mode="list"` (layout `"grid"`, solo test): **identico a prima**, `<div className="space-y-2">`,
    nessuna freccia, nessuno scorrimento orizzontale.
  - `mode="scroll"` (layout `"plan"`, vista Servizio): contenitore scorrevole + due pulsanti freccia
    fuori dall'area che scorre (a sinistra e a destra), così **non coprono mai il contenuto delle
    card**.
- **Le frecce compaiono solo se c'è overflow reale**: calcolo `canScrollLeft` / `canScrollRight`
  confrontando `scrollLeft`, `clientWidth`, `scrollWidth` del contenitore. Se tutte le card entrano,
  nessuna freccia compare (lo spazio non viene occupato inutilmente). Quando compaiono, quella di
  sinistra è **disabilitata** (non nascosta, per non far saltare il layout) se sei già all'inizio,
  idem quella di destra alla fine — scelta esplicitamente ammessa dal prompt ("sparisce o si
  disabilita").
- **Si aggiornano da sole**: ricalcolo su evento `scroll`, su resize della finestra, e su
  `ResizeObserver` del contenitore (copre il caso "il numero di card cambia senza che la finestra
  cambi dimensione" — nuova assegnazione, cambio fascia/giorno). C'è una guardia
  `typeof ResizeObserver !== 'undefined'`: in ambienti che non lo forniscono il componente non
  esplode, resta solo scroll+resize (rilevante per i test esistenti, vedi sotto).
- **Barra nativa nascosta ma scroll touch invariato**: il contenitore scorrevole ha ancora
  `overflow-x-auto` (quindi trascinare col dito su telefono/tablet funziona come prima) più la classe
  di utilità **già esistente** in `src/index.css` — `.scrollbar-hide` (`scrollbar-width: none` +
  `::-webkit-scrollbar{display:none}`), introdotta in una sessione precedente per il carosello Menu
  QR. **Non ho aggiunto nessuna classe CSS nuova**: ho riusato quella che c'era già, perché fa
  esattamente quello richiesto.
- **Pulsanti veri**: uso il componente `Button` esistente (`variant="ghost" size="icon"`), quindi
  sono `<button>` nativi, raggiungibili da tastiera, con `aria-label="Scorri a sinistra"` /
  `"Scorri a destra"` per screen reader. **Nessuna variante nuova aggiunta a `Button.tsx` né a
  `index.css`** — uso solo varianti/size già esistenti.
- **Non avviano un drag**: le card sono trascinabili (`useDraggable` di dnd-kit) e la piantina è zona
  di rilascio. Entrambi i pulsanti freccia hanno
  `onPointerDown={(event) => event.stopPropagation()}`, stesso pattern già usato dal pulsante
  "Assegna" dentro `DraggableBookingCard` (riga ~99 prima del mio intervento). Verificato con un test
  dedicato (vedi sotto) che simula il bubbling reale dell'evento nativo, non solo che la prop sia
  passata.

### File toccati

- `src/features/booking/components/servizio/BookingCardsStrip.tsx` — **nuovo componente**.
- `src/features/booking/components/servizio/AssignmentMapPanel.tsx`:
  - import del nuovo componente;
  - `DraggableBookingCard`: ora di arrivo nella riga coperti;
  - card "Assegnate": ora di arrivo accanto al nome;
  - i due `<div className={cardsWrapClass}>` sostituiti da `<BookingCardsStrip mode={...}>`;
  - rimossa la variabile `cardsWrapClass` (non più usata, la logica ora vive dentro
    `BookingCardsStrip`).
- `src/features/booking/components/__tests__/AssignmentMapPanel.fix4bc.test.tsx` — **nuovo file di
  test**.

Nessuna utility CSS nuova (riusata `.scrollbar-hide`, già presente in `src/index.css` riga ~804).

---

## Test

Nuovo file `AssignmentMapPanel.fix4bc.test.tsx`, 7 test, tutti verdi:

**FIX-4C — ora di arrivo**
1. mostra l'ora sulla card "Prenotazioni" quando disponibile (`2 coperti · 12:30`).
2. non mostra alcuna ora (né riga vuota né `--:--`) quando non è disponibile.
3. mostra l'ora anche sulla card "Assegnate".

**FIX-4B — frecce**
4. layout `"grid"`: nessuna freccia, nessun contenitore scorrevole — invariato.
5. layout `"plan"` senza overflow (poche card, JSDOM a larghezza 0): nessuna freccia.
6. layout `"plan"` con overflow forzato (mock `clientWidth`/`scrollWidth`, stesso schema già usato in
   `useBookingPublicScrollRowAlign.test.tsx` — cattura la callback del `ResizeObserver` mockato e la
   richiama a mano dopo aver impostato le larghezze): le frecce compaiono, quella sinistra è
   disabilitata (`scrollLeft = 0`), il click su quella destra chiama `scrollBy` con uno spostamento
   positivo.
7. il pointerdown sulla freccia **non bubbla fino a `document`**: prova indiretta ma concreta che
   `stopPropagation()` funziona (nota tecnica: non ho ascoltato su `container` di `render()`, perché
   React 18 delega lì il suo listener sintetico — un listener nativo sullo stesso nodo vedrebbe
   comunque l'evento, dato che `stopPropagation()` blocca solo i nodi *successivi* nel percorso, non
   i listener fratelli sullo stesso nodo. Ascoltando su `document`, un nodo sopra la radice di React,
   il test verifica la cosa giusta).

**Guardia critica — jsdom non ha `ResizeObserver` globale** (verificato:
`'ResizeObserver' in new JSDOM(...).window` → `false`). Senza la guardia
`typeof ResizeObserver !== 'undefined'` in `BookingCardsStrip.tsx`, i test **preesistenti**
`AssignmentMapPanel.fix2.test.tsx` — che rendono `layout="plan"` senza stubbare `ResizeObserver` —
sarebbero esplosi con `ReferenceError: ResizeObserver is not defined`. Con la guardia restano verdi
senza bisogno di toccare quel file.

Test esistenti del pannello confermati verdi, invariati:
`AssignmentMapPanel.fix2.test.tsx` (10), `AssignmentMapPanel.5stati.test.tsx`,
`AssignmentMapPanel.fineTurnoMultiTavolo.test.tsx`, `AssignmentMapPanel.sostituzioneGuidata.test.tsx`,
`servizioA1Fixes.test.tsx`, `ServizioPage.dueViste.test.tsx` e `ServizioPage.tableMode.test.tsx`
(questi ultimi due mockano `AssignmentMapPanel` per intero, quindi non toccano il componente nuovo).

## Esito `npm run validate`

**Verde**, exit code 0:
- `npm run lint` — 0 problemi.
- `npm run typecheck` — 0 errori.
- `npm run test` — **152 file / 1259 test, tutti verdi** (numero comprende anche il lavoro
  dell'altra corsia già atterrato su `ServicePlanMap.tsx`/`TableShape.tsx`/`tableShapeMetrics.ts` —
  non ho toccato quei file, la corsia parallela in questo momento non aveva errori).

Nessun fallimento da segnalare come BLOCCATO o NON VERIFICABILE su `ServicePlanMap.tsx` /
`TableShape.tsx`: al momento del mio `validate` erano già verdi.

## Controllo a video — NON VERIFICABILE da me, resta da fare a mano

**Nota di onestà**: non ho un tool di browser/screenshot in questo agente. Tutto quanto sopra sulla
resa visiva (frecce che non coprono le card, allineamento a 256px, comportamento a 375/834/1280px) è
**ragionato sul CSS/markup**, non una prova a video. Checklist per Matteo in fondo al report.

Ragionamento sul markup (non una prova a video):
- Le frecce sono **fuori** dal contenitore che scorre (elementi fratelli, non sovrapposti), quindi
  non possono mai coprire le card sotto, a nessuna larghezza.
- A 256px di card (`w-64`) più icona (`h-3 w-3`/`h-4 w-4`) e gap (`gap-1`), il testo
  "N coperti · HH:mm" ha `truncate`: nel caso limite (nome ristorante lunghissimo di numero coperti a
  2 cifre + orario) si taglia con ellissi invece di andare a capo o sfondare la card.
- A 375px la testata (`layout="plan"` è sempre attivo nella vista Servizio) resta una singola striscia
  orizzontale come già prima del mio intervento (non ho toccato `shellClass`/`listClass`): le mie
  modifiche vivono tutte **dentro** la striscia, non cambiano il layout attorno.

---

## Checklist per Matteo — cosa cliccare nella pagina Servizio

1. Vai su **Servizio → Mappa** (si apre già sulla vista **Servizio**, non serve cliccare nulla).
2. Scegli una **data** e una **fascia oraria** con qualche prenotazione dentro.
3. Guarda la striscia in alto **"Prenotazioni (N)"**: ogni card ora mostra, sotto al nome, i coperti
   **e l'orario di arrivo** (es. "2 coperti · 12:30"). Se una prenotazione non ha un orario preciso,
   compare solo "N coperti" — nessuna riga vuota o strana.
4. Se ci sono già tavolate assegnate, guarda anche la striscia **"Assegnate (N)"**: l'orario compare
   accanto al nome cliente.
5. Se le card in una striscia sono **troppe per entrare tutte**, ai due lati della striscia compaiono
   due **frecce** (‹ ›): cliccale per scorrere avanti/indietro. Se le card entrano tutte, le frecce
   non compaiono affatto.
6. Prova a **trascinare** una card su un tavolo della piantina (drag & drop): deve continuare a
   funzionare esattamente come prima, anche cliccando prima una freccia.
7. Su telefono/tablet (o restringendo la finestra del browser): scorri la striscia col dito — deve
   scorrere come prima, solo senza la barra grigia visibile sotto.
8. Prova a tre larghezze diverse (telefono ~375px, tablet ~834px, desktop ~1280px) che le frecce e
   l'orario restino leggibili e non spingano il layout.
