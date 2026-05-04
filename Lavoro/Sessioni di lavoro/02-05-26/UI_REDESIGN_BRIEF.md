# UI Redesign Brief (allineato al riferimento scelto)

## Riferimento visivo da seguire

La nuova direzione UI deve prendere ispirazione da questa dashboard:

- [Restaurant Admin Dashboard (Dribbble)](https://dribbble.com/shots/24253988-Restaurant-Admin-Dashboard)

Obiettivo: ottenere un look simile per stile, colori, schede e tab, mantenendo tutte le funzionalita gia presenti nella nostra app.

## Vincolo fondamentale

Non cambiare logica o flussi core dell'applicazione.
Si deve rifare il layer visivo mantenendo:

- login/admin esistenti
- KPI (Oggi, Settimana, Mese, Rifiutate)
- tab (Calendario, Prenotazioni, Archivio)
- inserimento prenotazioni
- stati vuoti e feedback operativi

## Problema attuale da risolvere

L'interfaccia corrente e funzionale ma troppo neutra:

- quasi tutta bianca
- pochi accenti colore
- bordi rigidi e poco moderni
- scarsa profondita (ombre quasi assenti)
- tab e schede non abbastanza "premium"

## Direzione visuale target (stile Dribbble)

### 1) Colori

Adottare una palette moderna e calda/friendly:

- **Background generale**: neutro chiaro, non bianco puro (`#F6F7FB`)
- **Superfici card**: bianco pieno (`#FFFFFF`)
- **Primary accent**: viola/blu moderno (`#6D5EFC` o vicino)
- **Secondary accent**: ciano/teal leggero (`#22C7B8` o vicino)
- **Warning/Alert**: arancio morbido (`#FF9F43`)
- **Danger**: rosso controllato (`#FF5A5F`)
- **Testo principale**: blu-grigio scuro (`#1F2937`)
- **Testo secondario**: grigio medio (`#6B7280`)

Nota: i valori HEX possono essere calibrati, ma il mood deve rimanere moderno, luminoso e non freddo.

### 2) Schede (cards) moderne

Le card devono diventare il centro del layout:

- angoli arrotondati `14px-18px`
- ombra soft multilivello (leggera ma percepibile)
- bordo sottile molto chiaro (non nero)
- spacing interno ampio
- icona + numero + label con gerarchia forte

### 3) Tab moderne

Le tab devono essere in stile contemporaneo:

- contenitore tab con sfondo leggero e angoli arrotondati
- tab attiva con colore pieno (primary) e testo bianco
- tab inattive con testo scuro e hover visibile
- animazione transizione breve (`150-220ms`)
- stato active/focus/hover chiaramente distinguibile

### 4) Feedback ai click e micro-interazioni

Per bottoni, tab, card cliccabili e azioni:

- `hover`: lieve aumento ombra o cambio tinta
- `active`: piccolo "press effect" (es. translateY 1px o scala 0.99)
- `focus-visible`: ring accessibile ben visibile
- `disabled`: opacita ridotta + cursore appropriato
- toast/snackbar per conferme e errori

### 5) Tipografia e gerarchia

- titolo dashboard forte e pulito
- numeri KPI molto evidenti
- label e testo secondario piu leggeri
- uso coerente di pesi (`500/600/700`)
- spaziature verticali piu ariose

## Mappatura componenti (attuale -> nuovo stile)

1. **Header "Al Ritrovo"**
   - da semplice barra a header-card elegante con actions chiare
2. **KPI row**
   - da box rigidi a 4 card moderne con accenti colore/stato
3. **Tab nav**
   - da linee base a tab pill moderne con evidenza forte della tab attiva
4. **Sezione "Inserisci nuova prenotazione"**
   - da blocco lineare a card azione con CTA visivamente forte
5. **Area calendario/stato vuoto**
   - da vuoto freddo a empty state illustrato, testo caldo, CTA
6. **Bottoni/form controls**
   - uniformare stile con radius, shadow, hover, focus ring

## Requisiti UX obbligatori

- Design moderno e coerente in tutta la dashboard
- Piu colore, ma senza confusione visiva
- Ogni click deve avere feedback chiaro
- Ombre presenti ma eleganti (no effetto "pesante")
- Contrasto testi adeguato e accessibile
- Nessuna regressione funzionale

## Priorita implementativa

1. Definizione token UI (colori, radius, shadow, spacing)
2. Refactor Header + KPI cards
3. Refactor Tab navigation
4. Refactor area contenuti (prenotazioni/calendario/archivio)
5. Uniformazione bottoni, input, stati e feedback
6. Rifinitura responsive mobile/tablet

## Risultato atteso finale

Una dashboard admin visivamente simile al riferimento Dribbble per tono e qualita percepita, ma perfettamente adattata alle funzionalita esistenti della nostra applicazione.
