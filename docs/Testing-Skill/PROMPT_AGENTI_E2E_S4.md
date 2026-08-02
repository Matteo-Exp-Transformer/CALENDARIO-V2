# Prompt pronti — agenti S4 (collaudo e fix)

> **Stato al 02-08-2026 sera.**
> **Giro 1** (quattro corsie di collaudo e2e) → **fatto**. Report in
> [E2E-Report/](../Sessioni%20di%20lavoro/02-08-26/E2E-Report/), consolidati in
> [SINTESI.md](../Sessioni%20di%20lavoro/02-08-26/E2E-Report/SINTESI.md).
> **Giro 2** (FIX-1 orologio, FIX-2 assegnazioni/archiviazione, FIX-3 indagine) → **fatto**,
> revisionato in [REVISIONE_FIX.md](../Sessioni%20di%20lavoro/02-08-26/E2E-Report/REVISIONE_FIX.md).
> I prompt dei due giri conclusi sono stati **rimossi da questo file**: restano tracciati dai report.
>
> Restano da lanciare: **giro 3** (riprova mirata), **giro 4** (rifiniture della vista Servizio) e il
> **consolidamento**.

## ⛔ Blocco che precede tutto

Il **giro 3 non parte** finché la migrazione `066` non è applicata sul database di **TEST**
(`docnnernvp`). Senza, liberare l'ultimo tavolo di una tavolata risponde
`PGRST204 … 'served_at' … schema cache` e la voce «liberare archivia» non è collaudabile.

```sql
ALTER TABLE public.booking_requests
  ADD COLUMN IF NOT EXISTS served_at timestamptz;
```

## Regole valide per tutti i prompt di questo file

- Ambiente **TEST** (`docnnernvp`). Mai scrivere su PROD (`rwuxgvld`). `supabase db push` vietato.
- Nessun commit e nessun push senza richiesta esplicita di Matteo.
- Un solo `npm run dev` su `http://localhost:5173`, condiviso.
- Un esito non provato non si inventa mai: si scrive `BLOCCATO` o `NON VERIFICABILE` col motivo.

---
---

# GIRO 3 — riprova mirata, dopo i fix

> Da lanciare **solo** dopo la migrazione 066 su TEST e con `npm run validate` verde.
> Valgono tutte le regole del [piano](PIANO_E2E_AGENTI_S4.md): ambiente TEST, nessuna modifica al
> codice, nessun commit, si scrive solo il report. Le due riprove toccano corsie diverse e possono
> girare **in parallelo**.

## Prompt RIPROVA-B — quello che era rimasto bloccato

```
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
   Nota: "In uscita" ora scatta a fine pasto + buffer di riassetto della fascia, non a fine pasto:
   se la fascia ha 10' di buffer, aspettati l'avviso 10' più tardi di quanto diceva la checklist.
3. Turni esauriti (voce 3-6) sulla fascia AG-B2 con 1 turno: assegna, poi FORZA il caso che ha visto
   Matteo — assegna una prenotazione a un tavolo, LIBERA il tavolo, poi prova a RIASSEGNARE lo stesso
   tavolo. Il tavolo appare verde ma i turni sono finiti: verifica che la UI te lo dica PRIMA di
   provare (badge "Turni esauriti" + "N turni residui" sul tavolo nella modale), e che la conferma
   "Assegna comunque" sia cliccabile senza dover chiudere la modale.
4. Fascia chiusa: porta i turni della fascia a 0 ("Chiudi servizio"), prova ad assegnare, e verifica
   che il messaggio parli di fascia chiusa e non di turni esauriti. Poi riapri la fascia.
5. ARCHIVIAZIONE — voci nuove, non erano nella checklist originale:
   a) libero un tavolo dalla finestra di fine turno con "Libero" → la prenotazione NON deve tornare
      fra quelle da assegnare, e deve restare visibile in Calendario;
   b) idem con "Libera tavolo" dal dettaglio del tavolo in piantina;
   c) "Annulla" subito dopo un'assegnazione → la prenotazione DEVE tornare fra quelle da assegnare;
   d) "Libera e assegna" su un tavolo occupato → la prenotazione scavalcata DEVE tornare fra quelle
      da assegnare (era già OK nel primo giro: se ora non torna, è una regressione);
   e) tavolata su due tavoli: liberando UN solo tavolo la prenotazione NON deve essere archiviata;
      solo liberando anche il secondo.

RISORSE TUE: sala "AG-B2 Sala" con tavoli B2-T1(2) B2-T2(4) B2-T3(4) B2-T4(6), fascia "AG-B2",
prenotazioni con nome "[B2] ...". Non toccare niente che non porti questo prefisso. I dati del primo
giro ("AG-B Sala", "[B] ...") restano dove sono: non cancellarli.

CONSEGNA: docs/Sessioni di lavoro/02-08-26/E2E-Report/RIPROVA_B.md, formato del §5 del piano.
Screenshot in docs/_lavoro/e2e-s4/riprova-B/. Non modificare la checklist.
Se ti blocchi su una voce riprova 3 volte, poi segna BLOCCATO e vai avanti.
```

## Prompt RIPROVA-D — capienza e form pubblico, con un setup che funziona

```
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
   l'orario giusto (nessuno spostamento di fuso).
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
```

---
---

# GIRO 4 — rifiniture della vista Servizio (richieste Matteo 02-08 sera)

> ⚠️ **NON parallelizzabili.** Tutti e quattro toccano `AssignmentMapPanel.tsx` e/o
> `ServicePlanMap.tsx`. Lanciali **uno alla volta**, oppure dai tutti e quattro a **un solo** agente
> che li fa in ordine. Due agenti in parallelo su questi file si sovrascrivono a vicenda.
>
> ⚠️ **Bozza da rifinire.** Questi prompt sono scritti a partire da quello che Matteo ha chiesto a
> voce; il prossimo agente senior li rimappa sul codice reale con la skill
> [PREPARA_PROMPT_SKILL.md](../PREPARA_PROMPT_SKILL.md) prima di lanciarli.
>
> Regole comuni: caricare `docs/APP_CONTEXT_SKILL.md` §0 → `ADMIN_SERVIZIO_CONTEXT.md` §9 prima di
> aprire i file; `npm run validate` verde a fine lavoro; niente commit; niente scritture su DB.

## Prompt FIX-4A — La card della prenotazione assegnata si apre e accende i suoi tavoli

```
Sei un agente sviluppatore su questo repo, branch env/test. Lavori sulla pagina Servizio → Mappa →
vista Servizio (il pannello "Assegnazione tavoli").

LEGGI PRIMA: docs/APP_CONTEXT_SKILL.md §0 e §1b, docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md
§9 (in particolare §9.5, §9.6, §9.7).

COSA NON VA OGGI. Nella striscia in testata, sotto "Assegnate", ogni prenotazione già a tavolo è una
card che dice solo nome, coperti e i nomi dei tavoli in una riga di testo. Se una tavolata sta su tre
tavoli, il ristoratore legge tre sigle e deve cercarsele a occhio nella piantina. E per togliere un
tavolo dalla tavolata non c'è nessuna strada: si può solo aggiungerne.

COSA DEVE SUCCEDERE.
1. Cliccando la card, la card SI APRE (si espande in luogo, non una modale nuova) e mostra l'elenco
   dei tavoli assegnati, uno per riga, con sala · nome tavolo · posti.
2. Da lì si deve poter TOGLIERE un singolo tavolo dalla tavolata, oltre ad aggiungerne uno
   (il pulsante "Aggiungi tavolo" esiste già e resta).
3. Sempre al click, i tavoli di quella prenotazione LAMPEGGIANO nella piantina delle sale, così il
   ristoratore li individua a colpo d'occhio. Il lampeggio si spegne quando la card si richiude o
   quando se ne apre un'altra.
4. Una card aperta alla volta.

PUNTI DELICATI, non improvvisare:
- "Togliere un tavolo" NON è la stessa cosa di "liberare il tavolo": liberare significa turno servito
  e fa scattare l'archiviazione (served_at). Togliere un tavolo da una tavolata è la correzione di
  un'assegnazione: deve comportarsi come l'annullamento, cioè NON archiviare e NON bruciare un turno.
  Guarda come sono fatti useCheckoutTable e useUndoTableAssignment prima di scegliere quale usare.
- Se togli l'ULTIMO tavolo rimasto, la prenotazione deve tornare fra quelle da assegnare.
- Il lampeggio deve rispettare "prefers-reduced-motion": chi ha le animazioni disattivate a sistema
  deve comunque vedere i tavoli evidenziati, con un contorno fisso invece che lampeggiante.
- Le sagome dei tavoli sono anche zone di rilascio del trascinamento: l'evidenziazione non deve
  rubare i click né interferire con il drop.

TEST: aggiungi un file di test dedicato. Copri almeno: apertura/chiusura della card, una sola card
aperta alla volta, rimozione di un tavolo con più tavoli residui, rimozione dell'ultimo tavolo che
riporta la prenotazione fra quelle da assegnare.

CONSEGNA: report in docs/Sessioni di lavoro/02-08-26/E2E-Report/FIX_4A_CARD_ASSEGNATE.md, con cosa
cambia per il ristoratore in parole semplici, i file toccati e l'esito di npm run validate.
```

## Prompt FIX-4B — Frecce di scorrimento al posto della barra

```
Sei un agente sviluppatore su questo repo, branch env/test. Pagina Servizio → Mappa → vista Servizio.

CONTESTO: dal 02-08 le prenotazioni ("Prenotazioni (N)" e "Assegnate (N)") non stanno più in colonna
a sinistra ma in due strisce orizzontali in testata, che scorrono di lato con la barra di scorrimento
del browser.

COSA DEVE CAMBIARE: via la barra di scorrimento, dentro a ciascuna delle due sezioni ci vanno due
PULSANTI CON FRECCIA, uno sul bordo sinistro e uno sul bordo destro, che fanno scorrere le card.

REGOLE:
- Le frecce compaiono SOLO se c'è davvero qualcosa da scorrere, e quella di sinistra sparisce (o si
  disabilita) quando sei già all'inizio, idem a destra alla fine. Vanno aggiornate anche quando
  cambia il numero di card o si ridimensiona la finestra.
- Devono essere pulsanti veri, raggiungibili da tastiera, con un'etichetta leggibile da uno screen
  reader ("Scorri a sinistra" / "Scorri a destra").
- Lo scorrimento col dito su telefono e tablet deve continuare a funzionare: si toglie la barra a
  video, non la possibilità di scorrere.
- Non devono coprire il contenuto delle card sotto: o stanno fuori dall'area che scorre, o sono
  sovrapposte con uno sfondo che le stacca.
- Usa il componente Button esistente in src/components/ui: NON aggiungere CSS globale in index.css.

TEST: le frecce non compaiono quando le card entrano tutte; compaiono quando non entrano; il click
sposta la posizione di scorrimento.

CONSEGNA: report in docs/Sessioni di lavoro/02-08-26/E2E-Report/FIX_4B_FRECCE.md.
```

## Prompt FIX-4C — L'ora di arrivo sulle card delle prenotazioni

```
Sei un agente sviluppatore su questo repo, branch env/test. Pagina Servizio → Mappa → vista Servizio.

COSA MANCA: le card delle prenotazioni mostrano nome e coperti, ma NON l'ora di arrivo. Chi sta a
servizio deve sapere se quella tavolata arriva fra dieci minuti o fra due ore. Serve su ENTRAMBE le
strisce: "Prenotazioni (N)" (da assegnare) e "Assegnate (N)".

COME PRENDERE L'ORA — attenzione, è la trappola storica di questo progetto:
gli orari sono salvati con un fuso "+00:00" FINTO: le cifre sono l'ora del ristorante. NON usare
new Date(confirmed_start). Usa gli helper già esistenti in
src/features/booking/utils/dateUtils.ts: getAccurateStartTime + trimTimeToHHmm — sono già usati
altrove nello stesso pannello, copia quel modo di fare. Se sbagli, l'ora esce spostata di due ore in
estate e di una in inverno.

DETTAGLI: se l'ora non è disponibile la card non deve mostrare una riga vuota o "--:--", semplicemente
non la mostra. L'ora deve restare leggibile nella card larga 256px, senza mandare a capo il nome del
cliente.

TEST: una card con orario mostra l'ora giusta (non spostata di fuso); una senza orario non mostra
nulla. Se esiste già un test di questo pannello, aggiungi lì.

CONSEGNA: report in docs/Sessioni di lavoro/02-08-26/E2E-Report/FIX_4C_ORARIO_CARD.md.
```

## Prompt FIX-4D — Tavoli un po' più grandi nella piantina

```
Sei un agente sviluppatore su questo repo, branch env/test. Pagina Servizio → Mappa → vista Servizio,
piantina delle sale.

COSA NON VA: dentro la sagoma del tavolo ci stanno a fatica il nome del tavolo, il nome della
prenotazione e i coperti. Serve ingrandire LEGGERMENTE la sagoma per farli leggere meglio, e — se ci
sta — aggiungere anche l'ora di arrivo.

VINCOLO PRINCIPALE, da non ignorare: la piantina a servizio deve corrispondere alla sala che l'admin
ha disegnato nell'editor. Le due viste usano oggi la stessa impronta (64px, 96px per i rettangolari):
una in src/features/booking/components/servizio/ServicePlanMap.tsx, l'altra in TableShape.tsx. Sono
due costanti DUPLICATE. Se ingrandisci solo la piantina a servizio, i tavoli che l'admin ha messo
vicini si sovrappongono e la sala diventa illeggibile.
Quindi: o ingrandisci ENTRAMBE mantenendole allineate (e verifichi che le sale già disegnate non
vadano in collisione), oppure porti le due costanti in un unico posto condiviso e la cambi lì.
Scegli tu, ma dichiara la scelta nel report e mostra un prima/dopo di una sala con tavoli vicini.

ALTRI PUNTI:
- L'ora di arrivo va presa con getAccurateStartTime + trimTimeToHHmm, mai con new Date(...): le cifre
  salvate hanno un fuso "+00:00" finto (vedi FIX-4C).
- Quando su un tavolo ci sono più turni la sagoma mostra "N turni" invece del nome: quel caso deve
  restare leggibile.
- La piantina sta dentro un riquadro che scorre e, da desktop, dentro una colonna larga metà
  schermo: verifica che ingrandendo i tavoli la pagina non prenda a scorrere in orizzontale.
  Controllo: document.documentElement.scrollWidth <= window.innerWidth + 1 a 375, 834 e 1280px.

TEST: aggiorna i test esistenti della piantina se dipendono dalle misure.

CONSEGNA: report in docs/Sessioni di lavoro/02-08-26/E2E-Report/FIX_4D_TAVOLI_PIU_GRANDI.md.
```

---
---

## Prompt di consolidamento — da lanciare DA SOLO, alla fine

```
Il collaudo e2e S4 è finito. Consolida i risultati. Sei l'unico agente attivo: nessuno sta più
scrivendo su questi file.

FONTI (usa quelle che esistono; l'assenza di un file non si inventa):
- docs/Sessioni di lavoro/02-08-26/E2E-Report/SINTESI.md   ← parti da qui, è già consolidato
- .../CORSIA_A.md, CORSIA_B.md, CORSIA_C.md, CORSIA_D.md   (giro 1)
- .../FIX_1_OROLOGIO.md, FIX_2_ASSEGNAZIONI.md, INDAGINE_APERTE.md, REVISIONE_FIX.md  (giro 2)
- .../RIPROVA_B.md, RIPROVA_D.md                           (giro 3 — questi VINCONO sul giro 1)
- .../FIX_4A..4D_*.md                                      (giro 4, se già fatti)
- docs/Testing-Skill/PIANO_E2E_AGENTI_S4.md (per la mappa ID voce → riga di checklist)

REGOLA DI PRECEDENZA: dove il giro 3 ha rifatto una voce, vale il suo esito; il giro 1 resta solo
come storia. Le voci del giro 1 che nessuno ha rifatto restano com'erano.

DECISIONI DI MATTEO DEL 02-08 — sono chiuse, le voci di checklist che dicono il contrario vanno
riscritte, non segnate come KO:
- capienza pubblica allineata ai tavoli/D38 → DECISA ma RIMANDATA a dopo il collaudo;
- badge % in Calendario con denominatore = tutto il locale → confermato com'è;
- walk-in con sala e tavolo obbligatori → confermato com'è;
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
   posto, limite walk-in ripristinato). Se un report non lo dichiara, scrivilo nella lista delle cose
   da controllare a mano.

REGOLE: non modificare codice sorgente; nessun commit e nessun push senza che te lo chieda
esplicitamente Matteo; se un report manca o è incompleto dillo, non inventare esiti.

CONSEGNA: dimmi in 10 righe com'è andato il collaudo e cosa resta aperto.
```
