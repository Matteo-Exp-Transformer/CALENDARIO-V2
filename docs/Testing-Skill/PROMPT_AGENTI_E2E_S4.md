# Prompt pronti — agenti S4 (collaudo e fix)

> **Stato al 02-08-2026 · prompt del giro 4 RIMAPPATI sul codice reale.**
> **Giro 1** (quattro corsie di collaudo e2e) → **fatto**. Report in
> [E2E-Report/](../Sessioni%20di%20lavoro/02-08-26/E2E-Report/), consolidati in
> [SINTESI.md](../Sessioni%20di%20lavoro/02-08-26/E2E-Report/SINTESI.md).
> **Giro 2** (FIX-1 orologio, FIX-2 assegnazioni/archiviazione, FIX-3 indagine) → **fatto**,
> revisionato in [REVISIONE_FIX.md](../Sessioni%20di%20lavoro/02-08-26/E2E-Report/REVISIONE_FIX.md).
> I prompt dei due giri conclusi sono stati **rimossi da questo file**: restano tracciati dai report.
>
> Restano da lanciare: **giro 3** (riprova mirata, ⛔ bloccato), **giro 4** (rifiniture della vista
> Servizio, **pronto**) e il **consolidamento**.

## Chi può girare in parallelo — mappa di ownership

Il criterio non è «quanti agenti reggo», è **quali file tocca ciascuno**. Due agenti sullo stesso
file si sovrascrivono.

| Ondata | Agenti in parallelo | File posseduti | Stato |
|--------|--------------------|----------------|-------|
| **Giro 3** | RIPROVA-B · RIPROVA-D | nessuno (solo lettura + dati su TEST) | ⛔ bloccato dalla mig. 066 |
| **Giro 4 — ondata 1** | **P1 = FIX-4D** | `ServicePlanMap.tsx` · `TableShape.tsx` · nuovo modulo costanti · loro test | ✅ lanciabile subito |
| | **P2 = FIX-4B + FIX-4C** | `AssignmentMapPanel.tsx` · nuovo componente striscia · loro test | ✅ lanciabile subito |
| **Giro 4 — ondata 2** | **FIX-4A** (da solo) | `AssignmentMapPanel.tsx` + `ServicePlanMap.tsx` | ⏳ dopo l'ondata 1 |
| **Fine** | consolidamento (da solo) | solo `docs/` | ⏳ per ultimo |

P1 e P2 **non condividono nessun file**: possono girare davvero insieme. FIX-4A tocca entrambi i
file dell'ondata 1 e va **dopo**, da solo — è l'unico vincolo di sequenza rimasto.

## ⛔ Blocco che precede il giro 3 (non il giro 4)

Il **giro 3 non parte** finché la migrazione `066_booking_requests_served_at.sql` non è applicata sul
database di **TEST** (`docnnernvp`). Senza, liberare l'ultimo tavolo di una tavolata risponde
`PGRST204 … 'served_at' … schema cache` e la voce «liberare archivia» non è collaudabile.

```sql
ALTER TABLE public.booking_requests
  ADD COLUMN IF NOT EXISTS served_at timestamptz;
```

Prima di applicarla: `get_project_url` deve rispondere `docnnernvp`. Se risponde `rwuxgvld` è
**PRODUZIONE** → fermarsi. Il **giro 4 non è bloccato**: è tutto lavoro di interfaccia, nessuna
scrittura sul database.

## Regole valide per tutti i prompt di questo file

- Branch **`env/test`**. Ambiente **TEST** (`docnnernvp`). Mai scrivere su PROD (`rwuxgvld`).
  `supabase db push` vietato.
- Nessun commit e nessun push senza richiesta esplicita di Matteo.
- Un solo `npm run dev` su `http://localhost:5173`, condiviso: **non avviarne un altro**, se ti serve
  e non è acceso chiedilo a Matteo.
- **Mai lanciare prettier su questo repo** (riformatterebbe mezzo progetto). Lo stile lo tiene ESLint:
  `npm run lint`.
- Un esito non provato non si inventa mai: si scrive `BLOCCATO` o `NON VERIFICABILE` col motivo.
- **Agenti in parallelo:** tocchi **solo** i file elencati nella tua riga «File che possiedi». Se
  `npm run validate` fallisce su file che **non** possiedi, **non correggerli**: è l'altra corsia che
  sta lavorando. Scrivilo nel report e vai avanti.

---
---

# GIRO 3 — riprova mirata, dopo i fix

> Da lanciare **solo** dopo la migrazione 066 su TEST e con `npm run validate` verde.
> Valgono tutte le regole del [piano](PIANO_E2E_AGENTI_S4.md): ambiente TEST, nessuna modifica al
> codice, nessun commit, si scrive solo il report. Le due riprove toccano corsie diverse e possono
> girare **in parallelo**.

## Prompt RIPROVA-B — quello che era rimasto bloccato

```
Profilo: Verifica
Modalità: deep (tocca dati su TEST)
Skill da leggere: docs/Testing-Skill/PIANO_E2E_AGENTI_S4.md (regole, procedure P1..P10, corsia B)
Non caricare: APP_CONTEXT_SKILL.md intero — ti basta §1b (TEST vs PROD)
Output attesi: 1 file di report (RIPROVA_B.md) + gli screenshot. Nessuna modifica al codice, nessuna
modifica alla checklist, nessun commit. Niente output in più senza chiedere Sì/No prima.

Sei un agente tester e2e con Playwright MCP. Riesegui le voci che il primo giro non è riuscito a
provare, ora che i difetti sono stati corretti.

LEGGI PRIMA:
- docs/Testing-Skill/PIANO_E2E_AGENTI_S4.md → regole, procedure P1..P10, corsia B
- docs/Sessioni di lavoro/02-08-26/E2E-Report/CORSIA_B.md → cosa era andato storto
- docs/Sessioni di lavoro/02-08-26/E2E-Report/FIX_1_OROLOGIO.md e FIX_2_ASSEGNAZIONI.md → cosa è
  cambiato nel frattempo

PRIMA DI COMINCIARE: verifica che la colonna served_at esista su booking_requests (basta liberare un
tavolo di prova e controllare che NON compaia l'errore PGRST204). Se compare, FERMATI e dillo: la
migrazione 066 non è stata applicata e metà delle prove sotto non vale.

DIFFERENZA IMPORTANTE RISPETTO AL PRIMO GIRO: la volta scorsa la corsia ha dovuto usare la fascia
"Pranzo", condivisa e con turni "Illimitata", e proprio per questo NON ha potuto provare i turni
esauriti — che è esattamente il difetto poi trovato da Matteo a mano. Questa volta DEVI creare una
fascia tua "AG-B2" che contenga l'ora attuale, con "Turni massimi per tavolo" = 1. Se non esiste una
finestra oraria libera che contenga adesso, dillo e fermati: senza quella la prova non vale.

DA PROVARE, in quest'ordine:
1. Stati dei tavoli (voci 3-1..3-5): prenotazioni di oggi con arrivo fra 20 minuti / 5 minuti fa /
   25 minuti fa / 3 ore fa. Devono dare In arrivo, Occupato, In ritardo, In uscita. Aspetta ≥40
   secondi senza ricaricare prima di dichiarare che uno stato non cambia. Scrivi SEMPRE l'ora attesa
   accanto a quella letta.
2. Avviso di fine turno (voci 2.2-1..2.2-6) e la voce 9-7 (i pulsanti Libero / Ancora occupato non
   escono dallo schermo a 375px). Nel primo giro non è mai comparso: se non compare ancora, è grave.
   Nota: "In uscita" ora scatta a fine pasto + il "buffer di riassetto" della fascia, non a fine
   pasto: se la fascia ha 10' di buffer, aspettati l'avviso 10' più tardi di quanto diceva la
   checklist. Il buffer si legge nella scheda della fascia.
3. Turni esauriti (voce 3-6) sulla fascia AG-B2 con 1 turno: assegna, poi FORZA il caso che ha visto
   Matteo — assegna una prenotazione a un tavolo, LIBERA il tavolo, poi prova a RIASSEGNARE lo stesso
   tavolo. Il tavolo appare verde ma i turni sono finiti.
   COSA DEVI VEDERE, di preciso: nella modale "Assegna tavolo" il riquadro del tavolo deve portare
   già la scritta "Turni esauriti" al posto dello stato, e sotto i posti la riga "0 turni residui".
   Cliccandolo, la modale si CHIUDE e al suo posto compare, dentro la pagina, un riquadro giallo
   "Turni esauriti per questo tavolo" con il campo Motivo e il pulsante "Assegna comunque": deve
   essere cliccabile subito, senza dover chiudere niente a mano.
4. Fascia chiusa: porta i turni della fascia a 0 ("Chiudi servizio"), prova ad assegnare, e verifica
   che il messaggio parli di fascia chiusa e non di turni esauriti. Atteso: sul tavolo la scritta
   "Fascia chiusa", in cima alla modale il riquadro giallo "La fascia è chiusa: riaprila per
   assegnare i tavoli", e il pulsante di conferma spento. Poi riapri la fascia.
5. ARCHIVIAZIONE — voci nuove, non erano nella checklist originale:
   a) libero un tavolo dalla finestra di fine turno con "Libero" → la prenotazione NON deve tornare
      fra quelle da assegnare, e deve restare visibile in Calendario;
   b) idem con "Libera tavolo" dal dettaglio del tavolo in piantina;
   c) "Annulla" subito dopo un'assegnazione (il pulsante accanto a "Prenotazioni (N)") → la
      prenotazione DEVE tornare fra quelle da assegnare, e il turno NON deve risultare consumato:
      riprova ad assegnare lo stesso tavolo, non deve dire "Turni esauriti";
   d) "Libera e assegna" su un tavolo occupato → la prenotazione scavalcata DEVE tornare fra quelle
      da assegnare (era già OK nel primo giro: se ora non torna, è una regressione);
   e) tavolata su due tavoli: liberando UN solo tavolo la prenotazione NON deve essere archiviata;
      solo liberando anche il secondo.

RISORSE TUE: sala "AG-B2 Sala" con tavoli B2-T1(2) B2-T2(4) B2-T3(4) B2-T4(6), fascia "AG-B2",
prenotazioni con nome "[B2] ...". Non toccare niente che non porti questo prefisso. I dati del primo
giro ("AG-B Sala", "[B] ...") restano dove sono: non cancellarli.
RIPRISTINI OBBLIGATORI a fine corsa: fascia AG-B2 riaperta (turni ≠ 0).

CONSEGNA: docs/Sessioni di lavoro/02-08-26/E2E-Report/RIPROVA_B.md, formato del §5 del piano.
Screenshot in docs/_lavoro/e2e-s4/riprova-B/. Non modificare la checklist.
Se ti blocchi su una voce riprova 3 volte, poi segna BLOCCATO e vai avanti.
Chiusura verso Matteo: alla fine, 5 righe in italiano semplice — cosa funziona e cosa no, senza
sigle né nomi di file.
```

## Prompt RIPROVA-D — capienza e form pubblico, con un setup che funziona

```
Profilo: Verifica
Modalità: deep (tocca dati su TEST e il form pubblico)
Skill da leggere: docs/Testing-Skill/PIANO_E2E_AGENTI_S4.md (regole, procedure P1..P10, corsia D)
Non caricare: APP_CONTEXT_SKILL.md intero — ti basta §1b (TEST vs PROD)
Output attesi: 1 file di report (RIPROVA_D.md) + gli screenshot. Nessuna modifica al codice, nessuna
modifica alla checklist, nessun commit. Niente output in più senza chiedere Sì/No prima.

Sei un agente tester e2e con Playwright MCP. Riesegui le voci della corsia D rimaste non verificabili.

LEGGI PRIMA:
- docs/Testing-Skill/PIANO_E2E_AGENTI_S4.md → regole, procedure P1..P10, corsia D
- docs/Sessioni di lavoro/02-08-26/E2E-Report/CORSIA_D.md → cosa era andato storto
- docs/Sessioni di lavoro/02-08-26/E2E-Report/INDAGINE_APERTE.md → le risposte già date, non rifarle

PERCHÉ LA PRIMA VOLTA NON È RIUSCITA: la fascia di prova era larga 50 minuti, infilata in un buco di
59 fra Pranzo e Aperitivo, e il form pubblico non offriva orari selezionabili. Questa volta crea una
fascia "AG-D2" LARGA (almeno 3 ore) in una finestra davvero libera e su una data lontana
(oggi + 10 giorni), e PRIMA di iniziare verifica che il cliente veda orari cliccabili su
/prenota/da-tommaso. Se non li vede, fermati e segnalalo: è quello il problema, non le voci sotto.

DECISIONI DI MATTEO GIÀ PRESE — non rimetterle in discussione e non segnarle come difetti:
- Il percorso PUBBLICO oggi rispetta SOLO il limite coperti della fascia, non i posti dei tavoli.
  L'allineamento a D1/D38 è deciso ma RIMANDATO a dopo il collaudo. Quindi, con D38 spento, il
  cliente che chiede più coperti del cap fascia NON deve trovare orari: è il comportamento atteso
  oggi. Registralo come "come da decisione 02-08", non come KO.
- Il badge in Calendario mostra come totale i posti di TUTTO il locale: voluto.
- Sul walk-in, sala e tavolo restano obbligatori: voluto.
- Sul Classic la percentuale compare solo se il limite di fascia è impostato: voluto.

DA PROVARE:
1. Voci 8-1 e 8-2 — cambia gli orari e l'intervallo di arrivo di AG-D2 e verifica che il form
   pubblico si adegui (è la vera prova rimasta in sospeso).
2. Voce 8-3 — chiudi la fascia AG-D2 ("Chiudi servizio") e verifica che il cliente non possa
   prenotare in quella fascia; poi riaprila.
3. Voce 8-4 — prenotazione fatta dal form pubblico che compare in Calendario e in Servizio con
   l'orario giusto (nessuno spostamento di fuso). Controlla le CIFRE dell'ora, non il fuso: se il
   cliente sceglie 20:30 devi leggere 20:30 anche in Servizio.
4. Voce 7-2 — sul tenant Classic (prima coppia di credenziali, test-classic): apri il Calendario su
   un giorno CHE HA ALMENO UNA PRENOTAZIONE ACCETTATA in una fascia con limite impostato. Deve
   comparire "N / M". Nel primo giro il giorno era vuoto e non c'era nessuna card da giudicare.
5. Voce 7-3 — form pubblico Classic. La spunta Privacy non è cliccabile da automazione: PROVACI
   cliccando l'etichetta o via getByRole('checkbox').check(), e se non ci riesci segna NON
   VERIFICABILE con il dettaglio tecnico. Non fingere di averlo fatto.

RISORSE TUE: sala "AG-D2 Sala", fascia "AG-D2", prenotazioni "[D2] ...", data oggi + 10 giorni.
Sei l'unico autorizzato a toccare il form pubblico del tenant Pro. Lascia D38 SPENTO per tutta la
corsa. Ripristini obbligatori a fine corsa: turni di AG-D2 a 2, fascia riaperta.

CONSEGNA: docs/Sessioni di lavoro/02-08-26/E2E-Report/RIPROVA_D.md, formato del §5 del piano.
Screenshot in docs/_lavoro/e2e-s4/riprova-D/. Non modificare la checklist.
Chiusura verso Matteo: alla fine, 5 righe in italiano semplice — cosa funziona e cosa no, senza
sigle né nomi di file.
```

---
---

# GIRO 4 — rifiniture della vista Servizio (richieste Matteo 02-08 sera)

> **Rimappati sul codice reale il 02-08-26** (`AssignmentMapPanel.tsx`, `ServicePlanMap.tsx`,
> `TableShape.tsx`, `TableMap.tsx`, hook di assegnazione, `dateUtils.ts`). I riferimenti a nomi,
> costanti e punti di aggancio qui sotto sono verificati: **non sono più una bozza**.
>
> **Ondata 1 = P1 e P2 in parallelo** (nessun file in comune).
> **Ondata 2 = FIX-4A da solo**, dopo che P1 e P2 hanno chiuso.

## ⚙️ Ondata 1 · Corsia P1 — FIX-4D: tavoli più grandi nella piantina

```
Profilo: Esecuzione
Modalità: deep (tocca 3 view + una costante condivisa fra editor sala e vista Servizio)
Skill da leggere: docs/APP_CONTEXT_SKILL.md §0 e §4 · docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md §9.5 e §9.7
Non caricare: i file dell'area Prenota e Menu QR
File che POSSIEDI (nessun altro agente li tocca):
  src/features/booking/components/servizio/ServicePlanMap.tsx
  src/features/booking/components/servizio/TableShape.tsx
  l'eventuale nuovo modulo di costanti condivise
  src/features/booking/components/__tests__/ServicePlanMap.griglia.test.tsx
  src/features/booking/components/__tests__/TableShape.status.test.tsx
File che NON devi toccare: AssignmentMapPanel.tsx (ci lavora un altro agente in parallelo, in questo
  stesso momento). Se ti serve una modifica lì, FERMATI e chiedi a Matteo.
Output attesi: le modifiche ai file sopra + 1 report (FIX_4D_TAVOLI_PIU_GRANDI.md).
  Nessun componente nuovo oltre all'eventuale modulo di costanti. Niente output in più senza
  chiedere Sì/No prima.
La modalità puoi solo ALZARLA, mai abbassarla: se scopri che serve toccare il database o un file
  bloccato, sali di livello e segnalalo nel report.

Sei un agente sviluppatore su questo repo, branch env/test. Lavori sulla pagina Servizio → Mappa →
vista "Servizio", la piantina delle sale.

COSA NON VA OGGI: dentro la sagoma del tavolo ci stanno a fatica il nome del tavolo, il nome della
prenotazione e i coperti. Serve ingrandire LEGGERMENTE la sagoma per farli leggere meglio, e — se ci
sta — aggiungere anche l'ora di arrivo.

DOVE SI TOCCA, verificato:
- ServicePlanMap.tsx righe 28-29: const SHAPE_SIZE = 64 / SHAPE_SIZE_RECT_W = 96
- TableShape.tsx righe 33-34: le STESSE due costanti, duplicate
  (ServicePlanMap = piantina a servizio, sagome HTML; TableShape = editor della sala, sagome SVG)
- Il commento in testa a ServicePlanMap dice esplicitamente che le due impronte devono coincidere.

VINCOLO PRINCIPALE, da non ignorare: la piantina a servizio deve corrispondere alla sala che l'admin
ha disegnato nell'editor. Se ingrandisci solo la piantina a servizio, i tavoli che l'admin ha messo
vicini si sovrappongono e la sala diventa illeggibile. Quindi: o ingrandisci ENTRAMBE mantenendole
allineate, oppure — preferibile — porti le due costanti in un UNICO modulo condiviso e la cambi lì.
Scegli tu, ma dichiara la scelta nel report e mostra un prima/dopo di una sala con tavoli vicini.

VINCOLI DI MISURA:
- Le posizioni dei tavoli sono salvate a passo di 10px (TableMap.tsx, snapToGrid). Scegli misure
  multiple di 10 per non sfasare l'allineamento: es. 64 → 80 e 96 → 120, che mantengono la stessa
  proporzione fra tondo/quadrato e rettangolare. "Leggermente" vuol dire questo ordine di grandezza,
  non il doppio.
- La sagoma non deve sfondare il riquadro della sala: il contenitore ha larghezza fissa room.width
  con maxWidth 100% e overflow auto. Un tavolo posizionato al bordo destro non deve far comparire lo
  scorrimento orizzontale della PAGINA.
- Controllo obbligatorio: document.documentElement.scrollWidth <= window.innerWidth + 1 a 375, 834 e
  1280px. Da 1024px in su le sale stanno affiancate a due a due: la prova a 1280 va fatta con DUE
  sale, non una.

ORA DI ARRIVO NELLA SAGOMA (solo se ci sta davvero, senza tagliare il nome):
- Prendila con getAccurateStartTime + trimTimeToHHmm da src/features/booking/utils/dateUtils.ts.
  MAI new Date(confirmed_start): gli orari sono salvati con un fuso "+00:00" FINTO, le cifre sono
  l'ora del ristorante, e con new Date escono spostate di due ore in estate e una in inverno.
  Il modo giusto è già usato in AssignmentMapPanel.tsx (riga 163) — copia quello, ma NON modificare
  quel file: importa gli helper qui.
- Se l'ora manca, non mostrare né riga vuota né "--:--": semplicemente non la mostri.
- Quando su un tavolo ci sono più turni la sagoma mostra "N turni" al posto del nome: in quel caso
  NON mostrare nessuna ora (sarebbero due) e verifica che "N turni" resti leggibile.

TEST: aggiorna ServicePlanMap.griglia.test.tsx e TableShape.status.test.tsx se dipendono dalle
misure. Aggiungi un test che dimostri che le due viste usano la stessa impronta (se hai scelto il
modulo condiviso, basta verificarlo su entrambe).

CRITERIO DI FATTO: npm run validate verde. Se fallisce su AssignmentMapPanel.tsx o su un test di
quel pannello NON correggerlo: è l'altra corsia che sta scrivendo. Scrivilo nel report.
NON lanciare prettier. Niente commit, niente push, nessuna scrittura sul database.

CONSEGNA: report in docs/Sessioni di lavoro/02-08-26/E2E-Report/FIX_4D_TAVOLI_PIU_GRANDI.md con:
la scelta fatta (due costanti allineate o modulo condiviso) e perché, il prima/dopo di una sala con
tavoli vicini, i file toccati, l'esito di npm run validate.
CHIUSURA: aggiorna ADMIN_SERVIZIO_CONTEXT.md §9 con una riga sulla nuova impronta (APP_CONTEXT §7.2)
e chiudi con una spiegazione in italiano semplice per Matteo — cosa vedrà di diverso aprendo la
pagina Servizio, e cosa deve controllare a occhio nella sala che ha già disegnato.
```

## ⚙️ Ondata 1 · Corsia P2 — FIX-4B + FIX-4C: frecce di scorrimento e ora di arrivo sulle card

> Sono due richieste distinte ma vivono nella **stessa striscia in testata**: un solo agente le fa
> entrambe, in ordine (prima 4C, che è piccolo, poi 4B).

```
Profilo: Esecuzione
Modalità: deep (nuovo componente + comportamento su 3 view)
Skill da leggere: docs/APP_CONTEXT_SKILL.md §0 e §4 · docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md §9.7
Non caricare: i file dell'area Prenota e Menu QR
File che POSSIEDI (nessun altro agente li tocca):
  src/features/booking/components/servizio/AssignmentMapPanel.tsx
  il nuovo componente della striscia scorrevole
  i test del pannello in src/features/booking/components/__tests__/
File che NON devi toccare: ServicePlanMap.tsx e TableShape.tsx (ci lavora un altro agente in
  parallelo, in questo stesso momento). Se ti serve una modifica lì, FERMATI e chiedi a Matteo.
Output attesi: le modifiche ai file sopra + 1 componente nuovo + 1 file di test nuovo + 1 report
  (FIX_4BC_TESTATA.md). Niente output in più senza chiedere Sì/No prima.
La modalità puoi solo ALZARLA, mai abbassarla.

Sei un agente sviluppatore su questo repo, branch env/test. Pagina Servizio → Mappa → vista
"Servizio", la striscia in testata sopra la piantina.

CONTESTO VERIFICATO: dal 02-08 le prenotazioni non stanno più in colonna a sinistra. In
AssignmentMapPanel.tsx la variabile listInHeader (riga 702) vale true solo quando layout === 'plan';
in quel caso cardsWrapClass (riga 705) è "flex gap-2 overflow-x-auto pb-1" e le card sono w-64
shrink-0. Lo stesso cardsWrapClass è usato DUE volte: riga 1073 (elenco "Prenotazioni (N)", card
DraggableBookingCard) e riga 1090 (elenco "Assegnate (N)", le tavolate già a tavolo).
ATTENZIONE: in layout "grid" cardsWrapClass vale "space-y-2", cioè elenco verticale senza
scorrimento. Lì le frecce NON devono comparire.

──────────── PARTE 1 (fai prima questa) — FIX-4C: l'ora di arrivo sulle card ────────────

COSA MANCA: le card mostrano nome e coperti ma NON l'ora di arrivo. Chi sta a servizio deve sapere
se quella tavolata arriva fra dieci minuti o fra due ore. Serve su ENTRAMBE le strisce:
"Prenotazioni (N)" (da assegnare) e "Assegnate (N)".

DOVE: DraggableBookingCard (righe 72-109, blocco con nome + "N coperti") e la card delle tavolate
assegnate (righe 1096-1102).

COME PRENDERE L'ORA — è la trappola storica di questo progetto: gli orari sono salvati con un fuso
"+00:00" FINTO, le cifre sono l'ora del ristorante. NON usare new Date(confirmed_start). Usa
getAccurateStartTime + trimTimeToHHmm, già importati in cima a questo file (righe 44-48) e già usati
due volte qui dentro: riga 163 e riga 960. Copia quel modo di fare. Se sbagli, l'ora esce spostata di
due ore in estate e di una in inverno.

DETTAGLI: se l'ora non è disponibile la card non deve mostrare una riga vuota o "--:--", semplicemente
non la mostra (getAccurateStartTime restituisce stringa vuota, non null: gestiscilo come alla riga
163). L'ora deve restare leggibile nella card larga 256px senza mandare a capo il nome del cliente,
e senza far crescere in altezza la striscia più di una riga.

──────────── PARTE 2 — FIX-4B: frecce di scorrimento al posto della barra ────────────

COSA DEVE CAMBIARE: via la barra di scorrimento; dentro a ciascuna delle due sezioni ci vanno due
PULSANTI CON FRECCIA, uno sul bordo sinistro e uno sul bordo destro, che fanno scorrere le card.

COME FARLO SENZA ROMPERE NIENTE:
- Estrai un componente dedicato (es. src/features/booking/components/servizio/BookingCardsStrip.tsx)
  che riceve i figli e sostituisce i DUE <div className={cardsWrapClass}> di riga 1073 e 1090. Il
  componente deve accettare la modalità "elenco verticale" (layout grid) e in quel caso comportarsi
  ESATTAMENTE come oggi: nessuna freccia, nessuno scorrimento.
- Le frecce compaiono SOLO se c'è davvero qualcosa da scorrere; quella di sinistra sparisce (o si
  disabilita) quando sei già all'inizio, idem a destra alla fine. Vanno aggiornate anche quando
  cambia il numero di card e quando si ridimensiona la finestra.
- Devono essere pulsanti veri, raggiungibili da tastiera, con etichetta leggibile da uno screen
  reader ("Scorri a sinistra" / "Scorri a destra").
- Lo scorrimento col dito su telefono e tablet deve continuare a funzionare: si toglie la barra a
  video, non la possibilità di scorrere.
- Non devono coprire il contenuto delle card sotto: o stanno fuori dall'area che scorre, o sono
  sovrapposte con uno sfondo che le stacca.
- Usa il componente Button esistente in src/components/ui. NON aggiungere varianti di Button in
  index.css (regola d'archittettura del progetto: le varianti stanno nel componente).
  Se per nascondere la barra ti serve una classe di utilità in index.css (scrollbar-width: none +
  ::-webkit-scrollbar), è ammessa: dev'essere una utility generica, non uno stile di Button, e va
  dichiarata nel report.
- PUNTO DELICATO, non improvvisare: le card della striscia sono trascinabili (dnd-kit,
  useDraggable) e la piantina è la zona di rilascio. I pulsanti freccia devono fermare la
  propagazione del puntatore come già fa il pulsante "Assegna" alla riga 98
  (onPointerDown={(e) => e.stopPropagation()}), altrimenti premere la freccia inizia un
  trascinamento. Dopo la modifica RIPROVA a trascinare una prenotazione su un tavolo.

TEST: aggiungi un file di test dedicato al pannello. Copri almeno: (a) la card con orario mostra
l'ora giusta e quella senza orario non mostra nulla; (b) le frecce non compaiono quando le card
entrano tutte; (c) compaiono quando non entrano e il click sposta la posizione di scorrimento;
(d) in layout "grid" non compare nessuna freccia. Non rompere i test esistenti del pannello
(AssignmentMapPanel.fix2, .5stati, .fineTurnoMultiTavolo, servizioA1Fixes).

CRITERIO DI FATTO: npm run validate verde + comportamento verificato a 375, 834 e 1280px. Se
validate fallisce su ServicePlanMap.tsx o TableShape.tsx NON correggerlo: è l'altra corsia che sta
scrivendo. Scrivilo nel report.
NON lanciare prettier. Niente commit, niente push, nessuna scrittura sul database.

CONSEGNA: report unico in docs/Sessioni di lavoro/02-08-26/E2E-Report/FIX_4BC_TESTATA.md, con le due
parti separate, i file toccati, l'eventuale utility CSS aggiunta e l'esito di npm run validate.
CHIUSURA: aggiorna ADMIN_SERVIZIO_CONTEXT.md §9.7 con due righe (APP_CONTEXT §7.2) e chiudi con una
checklist in italiano semplice per Matteo — cosa cliccare nella pagina Servizio per vedere le due
modifiche.
```

## ⚙️ Ondata 2 · FIX-4A — la card della prenotazione assegnata si apre e accende i suoi tavoli

> **Da lanciare DA SOLO, dopo che P1 e P2 hanno chiuso e `npm run validate` è verde.** Tocca
> entrambi i file dell'ondata 1.

```
Profilo: Esecuzione
Modalità: deep (nuovo comportamento + cancellazione di righe su database)
Skill da leggere: docs/APP_CONTEXT_SKILL.md §0, §1b e §4 · docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md §9.5, §9.6, §9.7
Non caricare: i file dell'area Prenota e Menu QR
File che tocchi:
  src/features/booking/components/servizio/AssignmentMapPanel.tsx
  src/features/booking/components/servizio/ServicePlanMap.tsx (solo per l'evidenziazione)
  un file di test nuovo in src/features/booking/components/__tests__/
Output attesi: le modifiche ai file sopra + 1 file di test nuovo + 1 report
  (FIX_4A_CARD_ASSEGNATE.md). Nessun componente nuovo senza chiedere Sì/No prima.
La modalità puoi solo ALZARLA, mai abbassarla.

Sei un agente sviluppatore su questo repo, branch env/test. Lavori sulla pagina Servizio → Mappa →
vista "Servizio" (il pannello "Assegnazione tavoli").

PRIMA DI TOCCARE IL CODICE: due agenti hanno appena modificato questi due file (frecce di
scorrimento e ora di arrivo nella striscia in testata; sagome dei tavoli più grandi nella piantina).
Leggi i due report in docs/Sessioni di lavoro/02-08-26/E2E-Report/ (FIX_4BC_TESTATA.md e
FIX_4D_TAVOLI_PIU_GRANDI.md) e poi rileggi il codice: NON lavorare a memoria su come era prima.
Le loro modifiche devono restare tutte funzionanti — in particolare l'ora di arrivo deve continuare
a vedersi sulla card ANCHE quando è chiusa.

COSA NON VA OGGI. Nella striscia in testata, sotto "Assegnate", ogni prenotazione già a tavolo è una
card che dice nome, coperti e i nomi dei tavoli in una riga di testo (righe 1091-1119). Se una
tavolata sta su tre tavoli, il ristoratore legge tre sigle e deve cercarsele a occhio nella piantina.
E per togliere un tavolo dalla tavolata non c'è nessuna strada: si può solo aggiungerne
(pulsante "Aggiungi tavolo", riga 1108).

COSA DEVE SUCCEDERE.
1. Cliccando la card, la card SI APRE (si espande in luogo, non una modale nuova) e mostra l'elenco
   dei tavoli assegnati, uno per riga, con sala · nome tavolo · posti.
2. Da lì si deve poter TOGLIERE un singolo tavolo dalla tavolata, oltre ad aggiungerne uno
   (il pulsante "Aggiungi tavolo" esiste già e resta).
3. Sempre al click, i tavoli di quella prenotazione LAMPEGGIANO nella piantina delle sale, così il
   ristoratore li individua a colpo d'occhio. Il lampeggio si spegne quando la card si richiude o
   quando se ne apre un'altra.
4. Una card aperta alla volta.

PUNTI DELICATI, verificati sul codice — non improvvisare:

a) QUALE OPERAZIONE È "TOGLIERE UN TAVOLO". Non è "liberare il tavolo".
   - useCheckoutTable (useTableAssignments.ts riga 555) timbra checked_out_at, lascia la riga in
     archivio (D48 append-only), CONSUMA il turno e, se non restano altri tavoli attivi per quella
     prenotazione, la ARCHIVIA scrivendo served_at.
   - useUndoTableAssignment (riga 518) CANCELLA fisicamente la riga: non consuma il turno, non
     archivia niente. È la correzione di un'assegnazione sbagliata.
   → "Togli tavolo" deve usare useUndoTableAssignment. Se usi il checkout, bruci un turno e archivi
     una prenotazione che il cliente non ha ancora consumato: è il difetto peggiore che puoi
     introdurre qui.

b) TI SERVE L'ID DELL'ASSEGNAZIONE, e oggi la card non ce l'ha. Il memo assignedGroups (righe
   392-418) oggi restituisce { booking, tables, seats, missingSeats } e butta via le righe di
   assegnazione: dentro il memo hai già `rows` (BookingTableAssignment[]). Portati dietro, per ogni
   tavolo, anche l'id della sua riga di assegnazione. Se un tavolo ha più righe attive, agisci sulla
   più recente e dichiaralo nel report.

c) SE TOGLI L'ULTIMO TAVOLO la prenotazione deve tornare fra quelle da assegnare. Non darlo per
   scontato dalla logica: PROVALO, e se non torna scrivi perché. useUndoTableAssignment fa già il
   refetch delle due liste.

d) IL LAMPEGGIO sta in ServicePlanMap.tsx: aggiungi una prop opzionale (es. highlightedTableIds) e
   applicala alla sagoma in PlanTable. Vincoli:
   - deve rispettare "prefers-reduced-motion": chi ha le animazioni disattivate a sistema deve
     comunque vedere i tavoli evidenziati, con un contorno FISSO invece che lampeggiante. In
     index.css c'è già questo schema (cerca booking-public-field-attention-pulse e il blocco
     @media (prefers-reduced-motion: reduce) subito sotto): copia quel pattern, non inventarne uno.
     Tailwind ha bisogno di classi letterali statiche: niente nomi di classe costruiti a runtime.
   - le sagome sono ANCHE zone di rilascio del trascinamento (useDroppable, `plan-table-<id>`) e
     sono <button> cliccabili che aprono il dettaglio del tavolo: l'evidenziazione non deve rubare i
     click né interferire col rilascio. Usa un contorno sulla sagoma stessa (tipo ring), non un
     riquadro sovrapposto.
   - da sotto 1024px si vede UNA sola sala (quella scelta nelle linguette). Se i tavoli evidenziati
     stanno nell'altra sala, il ristoratore non li vedrebbe: gestiscilo o, come minimo, dichiaralo
     nel report come limite noto.

e) NON TOCCARE la modale "Assegna tavolo", la finestra di fine turno, il riquadro giallo di
   forzatura né il flusso di checkout: sono stati appena collaudati e corretti nel giro 2.

TEST: aggiungi un file di test dedicato. Copri almeno: apertura/chiusura della card; una sola card
aperta alla volta; rimozione di un tavolo con più tavoli residui (la prenotazione resta fra le
assegnate); rimozione dell'ULTIMO tavolo (la prenotazione torna fra quelle da assegnare); il fatto
che "Togli tavolo" chiami l'annullamento e NON il checkout. Non rompere i test esistenti del
pannello né quelli della piantina.

CRITERIO DI FATTO: npm run validate verde + prova a video a 375, 834 e 1280px.
NON lanciare prettier. Niente commit, niente push. Nessuna migrazione, nessuna scrittura di schema:
qui si cancellano solo righe di assegnazione tramite l'hook esistente, sull'ambiente TEST.

CONSEGNA: report in docs/Sessioni di lavoro/02-08-26/E2E-Report/FIX_4A_CARD_ASSEGNATE.md, con cosa
cambia per il ristoratore in parole semplici, i file toccati, la scelta fatta sul punto (b), il
limite noto del punto (d) se resta, e l'esito di npm run validate.
CHIUSURA: aggiorna ADMIN_SERVIZIO_CONTEXT.md §9 (APP_CONTEXT §7.2) e chiudi con una checklist in
italiano semplice per Matteo — cosa cliccare, in che ordine, e cosa deve vedere.
```

---
---

## Prompt di consolidamento — da lanciare DA SOLO, alla fine

```
Profilo: Verifica
Modalità: standard
Output attesi: 1 file aggiornato (COLLAUDO_S4_CHECKLIST.md) + il riassunto in chat. Nessun altro
  file, nessuna modifica al codice. Niente output in più senza chiedere Sì/No prima.

Il collaudo e2e S4 è finito. Consolida i risultati. Sei l'unico agente attivo: nessuno sta più
scrivendo su questi file.

FONTI (usa quelle che esistono; l'assenza di un file non si inventa):
- docs/Sessioni di lavoro/02-08-26/E2E-Report/SINTESI.md   ← parti da qui, è già consolidato
- .../CORSIA_A.md, CORSIA_B.md, CORSIA_C.md, CORSIA_D.md   (giro 1)
- .../FIX_1_OROLOGIO.md, FIX_2_ASSEGNAZIONI.md, INDAGINE_APERTE.md, REVISIONE_FIX.md  (giro 2)
- .../RIPROVA_B.md, RIPROVA_D.md                           (giro 3 — questi VINCONO sul giro 1)
- .../FIX_4D_TAVOLI_PIU_GRANDI.md, FIX_4BC_TESTATA.md, FIX_4A_CARD_ASSEGNATE.md  (giro 4)
- docs/Testing-Skill/PIANO_E2E_AGENTI_S4.md (per la mappa ID voce → riga di checklist)

REGOLA DI PRECEDENZA: dove il giro 3 ha rifatto una voce, vale il suo esito; il giro 1 resta solo
come storia. Le voci del giro 1 che nessuno ha rifatto restano com'erano.

DECISIONI DI MATTEO DEL 02-08 — sono chiuse, le voci di checklist che dicono il contrario vanno
riscritte, non segnate come KO:
- capienza pubblica allineata ai tavoli/D38 → DECISA ma RIMANDATA a dopo il collaudo;
- badge % in Calendario con denominatore = tutto il locale → confermato com'è;
- walk-in con sala e tavolo obbligatori → confermato com'è (togli la voce §5-1);
- Classic con percentuale solo se il limite di fascia è impostato → confermato com'è.

COSA DEVI FARE:
1. Aggiorna docs/Testing-Skill/COLLAUDO_S4_CHECKLIST.md: spunta [x] SOLO le voci con esito OK, e
   compila la riga "→ esito:" di ogni voce con una frase breve che dice cosa si è visto e chi l'ha
   verificata (es. "OK — corsia B, screenshot 2.2-3"). Le voci KO restano NON spuntate con la
   descrizione del problema. Le NON VERIFICABILE restano non spuntate con la nota
   "da provare a mano: <motivo>".
2. Aggiungi in fondo alla checklist una sezione "## 12. Esito collaudo automatico <data>" con:
   - conteggio OK / KO / NON VERIFICABILE / BLOCCATO
   - la lista dei bug ordinata per gravità, con un rimando al report della corsia che li ha trovati
   - la lista corta di cosa deve ancora fare Matteo a mano
3. Verifica la coerenza fra i report: se due corsie si contraddicono, NON scegliere tu — segnala la
   contraddizione in modo evidente.
4. Controlla che i ripristini dichiarati siano stati fatti davvero (D38 spento, max_turns rimessi a
   posto, fasce AG-B2 e AG-D2 riaperte, limite walk-in ripristinato). Se un report non lo dichiara,
   scrivilo nella lista delle cose da controllare a mano.

REGOLE: non modificare codice sorgente; nessun commit e nessun push senza che te lo chieda
esplicitamente Matteo; se un report manca o è incompleto dillo, non inventare esiti.

CONSEGNA: dimmi in 10 righe com'è andato il collaudo e cosa resta aperto, in italiano semplice.
```
