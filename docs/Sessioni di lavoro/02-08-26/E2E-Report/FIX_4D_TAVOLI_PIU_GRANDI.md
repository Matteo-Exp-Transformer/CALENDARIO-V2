# FIX-4D — Sagome tavolo più grandi + ora di arrivo (S4 giro 4, corsia "tavoli")

Data: 02-08-26 · Branch: `env/test` · Nessun commit / push · Nessuna scrittura DB

## In una frase

Le sagome dei tavoli (sia nell'editor **Modifica** sia nella piantina **Servizio**) sono un po' più
grandi, cosicché nome tavolo + nome prenotazione + coperti si leggano senza essere strizzati; dove
c'è posto, dentro la sagoma compare anche l'**ora di arrivo**.

## Cosa non andava (effetto concreto)

Nella pagina Servizio → Mappa → vista **Servizio**, la sagoma del tavolo (64px per tondo/quadrato,
96×64 per rettangolare) doveva contenere nome tavolo, nome cliente e coperti: a 64px il testo era
strizzato e poco leggibile durante il servizio.

## Scelta fatta: modulo di costanti condiviso (non due costanti allineate a mano)

Le dimensioni vivevano **duplicate** in due file:
- `ServicePlanMap.tsx` righe 28-29 (`SHAPE_SIZE = 64`, `SHAPE_SIZE_RECT_W = 96`) — piantina di
  servizio, sagome HTML.
- `TableShape.tsx` righe 33-34 — stesse costanti, stesso valore, ma copiate a mano — editor della
  sala (drag & drop), sagome SVG.

Ho creato **`src/features/booking/components/servizio/tableShapeMetrics.ts`**, unico posto dove
vivono `TABLE_SHAPE_SIZE` e `TABLE_SHAPE_SIZE_RECT_W`, e l'ho importato in entrambi i file al posto
delle costanti locali. Stesso pattern già usato in questa cartella per `tableStatusStyles.ts` (colori
di stato condivisi fra le stesse due viste).

**Perché il modulo condiviso e non "due costanti allineate a mano":** con due costanti duplicate,
un domani qualcuno cambia un valore in un file e si dimentica l'altro — esattamente il rischio che il
commento in testa a `ServicePlanMap` segnalava. Con un modulo unico il disallineamento diventa
strutturalmente impossibile: chi tocca la dimensione la tocca in un solo punto e **entrambe** le
viste cambiano insieme, sempre.

Valori nuovi (scelti fra quelli suggeriti nel prompt operativo, multipli di 10 per restare allineati
al passo di `snapToGrid` in `TableMap.tsx`):

| | Prima | Dopo | Incremento |
|---|---|---|---|
| Tondo/quadrato | 64px | **80px** | +16px (+25%) |
| Rettangolare (largo) | 96px | **120px** | +24px (+25%) |

Proporzione 2:3 fra lato quadrato/tondo e larghezza rettangolare invariata (64:96 = 80:120).

## Prima/dopo — sala con tavoli vicini (ragionato sul codice, non su schermo)

Esempio concreto: due tavoli quadrati messi dall'admin a `position_x = 100` e `position_x = 170`
(70px fra i bordi sinistri — valore plausibile con lo snap a 10px).

| | Larghezza tavolo | Bordo destro di A | Bordo sinistro di B | Esito |
|---|---|---|---|---|
| **Prima** (64px) | 64 | 100+64 = 164 | 170 | 6px di distanza — non si toccano |
| **Dopo** (80px) | 80 | 100+80 = 180 | 170 | **-10px — si sovrappongono di 10px** |

Questo è il rischio che il vincolo principale del prompt segnalava. La differenza rispetto a
ingrandire *solo* la piantina di servizio: **questa sovrapposizione appare identica in entrambe le
viste**, perché entrambe leggono `TABLE_SHAPE_SIZE` dallo stesso modulo. L'admin che ha disposto i
tavoli così stretti la vede **già in "Modifica"** (l'editor drag&drop, dove può correggerla
trascinando un tavolo qualche passo più in là) prima ancora di aprire "Servizio" — non è una sorpresa
che compare solo a servizio iniziato. Non ho introdotto nessuna disparità fra le due viste: il
comportamento "i tavoli vicini possono sovrapporsi visivamente se l'admin li ha messi molto vicini"
esisteva già a 64px per spaziature ancora più strette, e resta identico nelle due viste anche a 80px.

## Ora di arrivo nella sagoma

- Aggiunta **solo quando c'è un solo turno attivo** sul tavolo (`bookings.length === 1`) **e** l'ora è
  nota. Presa con `getAccurateStartTime(booking)` + `trimTimeToHHmm(...)` da
  `src/features/booking/utils/dateUtils.ts` — stesso helper già usato in `AssignmentMapPanel.tsx`
  (es. riga 164 e riga 1157-1159), **mai** `new Date(confirmed_start)`.
- Se l'ora manca (`getAccurateStartTime` torna stringa vuota), semplicemente non si mostra: nessuna
  riga vuota, nessun `--:--` (coperto da test).
- Con **più turni** sullo stesso tavolo la sagoma mostra già "N turni" al posto del nome: in questo
  caso l'ora **non** si mostra (sarebbe ambigua — quale dei due turni?), verificato da test.
- Anche il `title`/`aria-label` del tavolo (tooltip al passaggio del mouse) ora include l'orario
  quando presente, per coerenza con quanto si legge nella sagoma.
- Spazio: l'altezza è cresciuta di 16px (64→80) proprio nella dimensione verticale, che è dove serviva
  spazio per una quarta riga di testo (nome tavolo, nome cliente, coperti, ora) — le prime tre righe
  occupavano già ~40px a 64px di altezza; la quarta riga (~13px) ci sta comodamente nei 16px in più.
  Il bottone ha comunque `overflow-hidden`, quindi anche in un caso limite (nome cliente lunghissimo)
  il testo in eccesso resta tagliato dentro la sagoma e non sfonda mai il layout.

## Vincoli di misura — verificati ragionando sul codice (nessun browser nel mio toolset)

**Nota onestà:** non ho un tool di browser/screenshot in questo agente. Il controllo seguente è
ragionato sul codice e sulle misure dichiarate, **non** una prova a video. Il controllo a video (a
375/834/1280px, con due sale affiancate da 1024px in su) **resta da fare a mano da Matteo**.

- **Multipli di 10px**: 80 e 120 sono entrambi multipli di 10 → nessuno sfasamento con
  `snapToGrid` (`TableMap.tsx`, passo 10px). Verificato leggendo il file, non modificato.
- **Scroll orizzontale di PAGINA**: il contenitore di ogni sala (`ServicePlanMap.tsx` e
  `TableMap.tsx`) ha `style={{ width: room.width, maxWidth: '100%' }}` + classe `overflow-auto`
  attorno a un div interno di dimensione fissa `room.width × room.height` (dove vivono i tavoli
  posizionati in assoluto). Non ho toccato queste regole di contenimento — solo la dimensione delle
  sagome **dentro** quel div. Conseguenza ragionata: se un tavolo vicino al bordo destro/inferiore
  della sala sfora leggermente il canvas (fino a +16px destra/sotto per tondo/quadrato, +24px per
  rettangolare — l'aumento di dimensione), quello sfondamento resta **contenuto nello scroll interno
  della sala** (`overflow-auto` sulla singola sala), non si propaga alla pagina: il box esterno resta
  vincolato a `room.width` con `maxWidth: 100%`, quindi non può mai far crescere la larghezza della
  pagina. Questa proprietà di contenimento esisteva già prima del mio intervento (non l'ho introdotta
  né modificata) — l'ho solo verificata perché il vincolo di misura lo richiedeva esplicitamente.
- **Sale a due colonne da 1024px** (`lg:grid-cols-2`, invariato — sezione 9.7 del contesto Servizio):
  non ho toccato la griglia delle sale, solo le sagome dentro ciascuna sala. Il ragionamento sullo
  scroll di pagina sopra vale per ciascuna sala indipendentemente da quante sono affiancate.

## Test

File toccati:
- `src/features/booking/components/__tests__/ServicePlanMap.griglia.test.tsx` — 5 test preesistenti
  (griglia/visibilità sale) **invariati e verdi** + **7 nuovi test**:
  - 2 test "stessa impronta di TableShape" (FIX-4D): renderizzano `TableShape` (editor, SVG) e
    `ServicePlanMap` (piantina, HTML) con lo stesso tavolo e verificano che larghezza/altezza
    coincidano **leggendo le costanti dal modulo condiviso**, non un numero hardcoded — così il test
    fallirebbe se in futuro qualcuno reintroducesse una costante locale disallineata in uno dei due
    file. Un caso per tondo/quadrato (80px), uno per rettangolare (120×80).
  - 3 test "ora di arrivo nella sagoma": un solo turno con orario noto → "arrivo HH:mm"; più turni →
    "N turni" e nessuna ora; orario mancante → nessuna riga vuota né `--:--`.
- `src/features/booking/components/__tests__/TableShape.status.test.tsx` — **non modificato**: i 6
  test sui colori per stato non dipendevano dalle misure, restano verdi così come sono.

Esito: **16/16 test verdi** sui due file di proprietà (`ServicePlanMap.griglia.test.tsx` +
`TableShape.status.test.tsx`).

## File toccati (FIX-4D)

- `src/features/booking/components/servizio/tableShapeMetrics.ts` — **nuovo**, unico modulo di
  costanti condivise (`TABLE_SHAPE_SIZE = 80`, `TABLE_SHAPE_SIZE_RECT_W = 120`).
- `src/features/booking/components/servizio/ServicePlanMap.tsx` — importa le costanti condivise,
  aggiunge la riga "arrivo HH:mm" quando pertinente, aggiorna il commento di testa.
- `src/features/booking/components/servizio/TableShape.tsx` — importa le costanti condivise al posto
  delle due costanti locali duplicate.
- `src/features/booking/components/__tests__/ServicePlanMap.griglia.test.tsx` — 7 test nuovi (vedi
  sopra).

Nessun componente nuovo oltre al modulo di costanti concordato. Nessuna migrazione, nessuna
scrittura DB.

## Esito `npm run validate`

- **`npm run typecheck`**: verde, zero errori (verificato standalone).
- **`npm run test` (Vitest, full run)**: **151 file / 1252 test — tutti verdi**, inclusi i test di
  `AssignmentMapPanel` (l'altra corsia). Il mio cambiamento non rompe nulla fuori dai file di
  proprietà.
- **`npm run lint`**: **rosso**, ma per un motivo fuori dal mio mandato — un solo errore, non nei
  miei file:
  ```
  src/features/booking/components/servizio/BookingCardsStrip.tsx
    57:5  error  Unused eslint-disable directive (no problems were reported from 'react-hooks/exhaustive-deps')
  ```
  `BookingCardsStrip.tsx` è un file **non tracciato da git** (nuovo, `??` in `git status`) che non ho
  creato io: è lavoro in corso dell'altra corsia (quella su `AssignmentMapPanel.tsx`), verosimilmente
  un componente estratto in questo momento. Per mandato **non lo tocco**: "se fallisce su
  AssignmentMapPanel.tsx o su un test di quel pannello NON correggerlo". Ho verificato che i miei
  file passano lint da soli:
  ```
  npx eslint src/features/booking/components/servizio/ServicePlanMap.tsx
             src/features/booking/components/servizio/TableShape.tsx
             src/features/booking/components/servizio/tableShapeMetrics.ts
  → 0 problemi
  ```
  Quindi: `npm run validate` complessivo **non è verde in questo momento**, ma il rosso non è mio —
  è l'altra corsia in scrittura sullo stesso repo. **BLOCCATO** non è la parola giusta (non sono
  fermo su nulla): è un **NON VERIFICABILE da me** perché appartiene all'altro agente. Quando la sua
  corsia chiude quel file, `npm run validate` tornerà verde anche per il lavoro qui sopra (già
  verificato via typecheck+test standalone).

## Cosa resta da controllare a mano (NON verificato a video)

1. Aprire Servizio → Mappa → vista **Servizio** su una sala con tavoli vicini e controllare a occhio
   se qualche coppia di tavoli ora si tocca/sovrappone leggermente (vedi tabella "prima/dopo" sopra).
   Se succede, in "Modifica" lo stesso paio di tavoli mostrerà la stessa sovrapposizione — la
   correzione è trascinare uno dei due tavoli qualche passo più in là nell'editor.
2. Controllo `document.documentElement.scrollWidth <= window.innerWidth + 1` a 375, 834 e 1280px
   (quest'ultimo con due sale affiancate) — ragionato sopra, non eseguito a video.
3. Controllare che l'ora di arrivo compaia leggibile (non tagliata) sui tavoli con un solo turno.

## Spiegazione semplice per Matteo

Aprendo Servizio → Mappa → vista **Servizio**, i tavolini nella piantina sono un filo più grandi:
nome del tavolo, nome del cliente e coperti si leggono meglio. Su un tavolo con **una sola**
prenotazione attiva ora compare anche una riga con l'**ora di arrivo**; se sullo stesso tavolo ci sono
più turni resta "N turni" senza ora (per non creare confusione su quale dei due orari mostrare).

Ho ingrandito **sia** la piantina di Servizio **sia** l'editor della sala (quello dove trascini i
tavoli per disegnare la sala) — e li ho collegati a un'unica misura condivisa, così in futuro non
potranno più disallinearsi. Cosa controllare tu di persona nella sala che hai già disegnato: se hai
messo due tavoli molto vicini fra loro, ora potrebbero toccarsi leggermente nella piantina (e lo
vedresti identico anche aprendo "Modifica") — in quel caso basta trascinare uno dei due tavoli un
filo più in là.
