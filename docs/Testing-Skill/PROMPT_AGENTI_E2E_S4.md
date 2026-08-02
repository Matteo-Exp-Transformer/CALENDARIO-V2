# Prompt pronti — agenti tester e2e S4

> **Stato al 02-08-2026 sera:** il **giro 1** (le quattro corsie di collaudo) è stato **eseguito**.
> Risultati e diagnosi in [SINTESI.md](../Sessioni%20di%20lavoro/02-08-26/E2E-Report/SINTESI.md).
> Ora si va al **giro 2 — i fix** (§ in fondo a questo file), poi al **giro 3 — riprova mirata**,
> e solo alla fine al consolidamento.
>
> **Come si usa:** apri **quattro** chat/agenti separati in Cursor (con Playwright MCP attivo) e
> incolla in ognuno **uno** dei quattro prompt qui sotto. Girano in parallelo e non si pestano i piedi
> perché ognuno lavora su una sala, una data e (dove serve) una fascia oraria diversa.
>
> Quando tutti e quattro hanno consegnato il loro report, incolla il **quinto** prompt
> (consolidamento) in **una sola** chat.
>
> Prima di lanciare: assicurati che `npm run dev` giri su `http://localhost:5173`. Se non lo avvii tu,
> lo avvia il primo agente che se ne accorge.
>
> ⚠️ **Verifica di isolamento del browser.** Se i quattro agenti condividono lo stesso server
> Playwright MCP, comandano la **stessa finestra** e il test non vale niente. Ogni prompt contiene un
> controllo iniziale: se un agente ti scrive «isolamento non garantito», lancia le corsie **a due a
> due** o in finestre di Cursor separate.

---

## Prompt corsia A — Le due viste della mappa

```
Sei un agente tester e2e. Guidi il browser con Playwright MCP. Esegui la CORSIA A del collaudo S4.

PRIMA DI TOCCARE QUALSIASI COSA, leggi per intero questi due file e seguili alla lettera:
- docs/Testing-Skill/PIANO_E2E_AGENTI_S4.md  (le regole, le procedure P1..P10, la tua corsia)
- docs/Testing-Skill/COLLAUDO_S4_CHECKLIST.md (le voci da verificare, sezione 2.1)

LA TUA CORSIA: "Corsia A — Le due viste della mappa" (sezione 6 del piano). Voci 2.1-1 … 2.1-6.
Le tue risorse: sala "AG-A Sala", tavoli A-T1(2) A-T2(4) A-T3(4) A-T4(6), data di lavoro OGGI + 7
giorni, una fascia oraria ESISTENTE usata in sola lettura, prenotazioni con nome "[A] ...".

REGOLE CHE NON PUOI VIOLARE:
1. Solo ambiente TEST. Apri .env.local.test e verifica che VITE_SUPABASE_URL contenga
   "docnnernvpyrbwuzzach". Se contiene "rwuxgvld" (produzione) FERMATI SUBITO e dimmelo.
2. Non modificare NESSUN file di codice sorgente. Se trovi un bug lo descrivi, non lo correggi.
3. Nessun git add / commit / push / checkout / stash. Mai.
4. Nessun comando che scriva sul database (niente seed, niente supabase CLI, niente psql). Tutte le
   scritture passano dall'interfaccia dell'app, come farebbe un utente.
5. Non toccare sale, tavoli, fasce o prenotazioni che non iniziano per "A-" / "AG-A" / "[A]".
   NON modificare nessuna fascia oraria. NON usare il form pubblico.
6. Non cancellare niente a fine corsa: i dati servono a Matteo per la controverifica.
7. Non dedurre esiti. Se non hai visto la schermata, scrivi NON VERIFICATO, non OK.

PRIMO PASSO OBBLIGATORIO: la prova di isolamento del browser descritta al §2.3 del piano. Se sospetti
che un altro agente stia comandando la tua stessa finestra, scrivilo e fermati.

CONSEGNA: scrivi il report in docs/Sessioni di lavoro/02-08-26/E2E-Report/CORSIA_A.md usando esattamente
il formato del §5 del piano (tabella ID | voce | esito | cosa ho visto | prova). Screenshot in
docs/_lavoro/e2e-s4/corsia-A/. NON modificare COLLAUDO_S4_CHECKLIST.md: lo aggiorna il consolidamento.

MODO DI LAVORARE: vai fino in fondo senza chiedermi conferme. Se ti blocchi su una voce, riprova al
massimo 3 volte, poi segnala BLOCCATO con il motivo e passa alla successiva. Non improvvisare
percorsi non previsti dal piano. Alla fine dimmi in 5 righe: quante voci OK, quante KO, i bug trovati.
```

---

## Prompt corsia B — Servizio dal vivo (stati, fine turno, walk-in, briefing)

```
Sei un agente tester e2e. Guidi il browser con Playwright MCP. Esegui la CORSIA B del collaudo S4.

PRIMA DI TOCCARE QUALSIASI COSA, leggi per intero questi due file e seguili alla lettera:
- docs/Testing-Skill/PIANO_E2E_AGENTI_S4.md  (le regole, le procedure P1..P10, la tua corsia)
- docs/Testing-Skill/COLLAUDO_S4_CHECKLIST.md (le voci da verificare: sezioni 2.2, 3, 5, 6)

LA TUA CORSIA: "Corsia B — Servizio dal vivo" (sezione 6 del piano). È la corsia che dipende
dall'orologio: lavori su OGGI. Voci 3-1…3-7, 2.2-1…2.2-6, 5-1…5-6, 6-1…6-4, più la voce 2.3-8
(tavolata su più tavoli vista nel briefing).
Le tue risorse: sala "AG-B Sala", tavoli B-T1(2) B-T2(4) B-T3(4) B-T4(6), la fascia oraria scelta con
la procedura B.1 del piano (di norma una fascia nuova "AG-B" che contiene l'ora attuale),
prenotazioni con nome "[B] ...".
Sei l'UNICA corsia autorizzata a toccare il "Limite coperti walk-in" e il max_turns della fascia AG-B.

FAI PER PRIMA COSA il paragrafo B.1 del piano (scelta della fascia): da lì dipende tutto il resto.

REGOLE CHE NON PUOI VIOLARE:
1. Solo ambiente TEST. Apri .env.local.test e verifica che VITE_SUPABASE_URL contenga
   "docnnernvpyrbwuzzach". Se contiene "rwuxgvld" (produzione) FERMATI SUBITO e dimmelo.
2. Non modificare NESSUN file di codice sorgente. Se trovi un bug lo descrivi, non lo correggi.
3. Nessun git add / commit / push / checkout / stash. Mai.
4. Nessun comando che scriva sul database (niente seed, niente supabase CLI, niente psql). Tutte le
   scritture passano dall'interfaccia dell'app.
5. Non toccare sale, tavoli, fasce o prenotazioni che non iniziano per "B-" / "AG-B" / "[B]".
   NON toccare l'interruttore "Mantieni anche il limite coperti della fascia" (è della corsia D).
   NON usare il form pubblico.
6. Non cancellare niente a fine corsa. Ripristina però: max_turns di AG-B a 2, e il limite coperti
   walk-in al valore che c'era prima (ANNOTALO PRIMA di cambiarlo).
7. Non dedurre esiti. Se non hai visto la schermata, scrivi NON VERIFICATO, non OK.

DUE COSE CHE SBAGLIANO QUASI TUTTI:
- Il drag & drop con dnd-kit spesso non parte dagli strumenti di automazione: usa il pulsante
  "Assegna" (procedura P6). Se il trascinamento non funziona scrivi "NON VERIFICABILE — limite dello
  strumento", NON scrivere che la funzione è rotta.
- I cambi di stato automatici girano su un orologio da 30 secondi: aspetta almeno 40 secondi SENZA
  ricaricare la pagina prima di dichiarare che uno stato non cambia.

PRIMO PASSO OBBLIGATORIO: la prova di isolamento del browser descritta al §2.3 del piano.

CONSEGNA: report in docs/Sessioni di lavoro/02-08-26/E2E-Report/CORSIA_B.md nel formato del §5 del
piano. Screenshot in docs/_lavoro/e2e-s4/corsia-B/. Per ogni orario che verifichi (fine turno,
briefing) scrivi SIA il valore atteso calcolato da te SIA quello letto a schermo. NON modificare
COLLAUDO_S4_CHECKLIST.md.

MODO DI LAVORARE: vai fino in fondo senza chiedermi conferme. Se ti blocchi su una voce, riprova al
massimo 3 volte, poi segnala BLOCCATO e passa alla successiva. Alla fine dimmi in 5 righe: quante
voci OK, quante KO, i bug trovati.
```

---

## Prompt corsia C — Tavolate su più tavoli + responsive

```
Sei un agente tester e2e. Guidi il browser con Playwright MCP. Esegui la CORSIA C del collaudo S4.

PRIMA DI TOCCARE QUALSIASI COSA, leggi per intero questi due file e seguili alla lettera:
- docs/Testing-Skill/PIANO_E2E_AGENTI_S4.md  (le regole, le procedure P1..P10, la tua corsia)
- docs/Testing-Skill/COLLAUDO_S4_CHECKLIST.md (le voci da verificare: sezioni 2.3 e 9)

LA TUA CORSIA: "Corsia C — Tavolate su più tavoli + responsive" (sezione 6 del piano).
Voci 2.3-1 … 2.3-7 (la 2.3-8 la fa la corsia B) e 9-1 … 9-7.
Le tue risorse: sala "AG-C Sala", tavoli C-T1(5) C-T2(5) C-T3(4) C-T4(2), data di lavoro OGGI + 5
giorni, una fascia oraria ESISTENTE usata in sola lettura, prenotazioni con nome "[C] ...".

Il responsive va fatto per TUTTE E TRE le larghezze: 375, 834, 1280. Per l'overflow usa la misura
della procedura P8 del piano, non il colpo d'occhio. Le modali che apri per il responsive vanno
chiuse con Annulla: NON confermare scritture che non ti servono.

REGOLE CHE NON PUOI VIOLARE:
1. Solo ambiente TEST. Apri .env.local.test e verifica che VITE_SUPABASE_URL contenga
   "docnnernvpyrbwuzzach". Se contiene "rwuxgvld" (produzione) FERMATI SUBITO e dimmelo.
2. Non modificare NESSUN file di codice sorgente. Se trovi un bug lo descrivi, non lo correggi.
3. Nessun git add / commit / push / checkout / stash. Mai.
4. Nessun comando che scriva sul database (niente seed, niente supabase CLI, niente psql).
5. Non toccare sale, tavoli o prenotazioni che non iniziano per "C-" / "AG-C" / "[C]".
   NON modificare NESSUNA fascia oraria. NON toccare l'interruttore "Mantieni anche il limite coperti
   della fascia". NON toccare il limite walk-in. NON usare il form pubblico.
6. Non cancellare niente a fine corsa.
7. Non dedurre esiti. Se non hai visto la schermata, scrivi NON VERIFICATO, non OK.

UNA COSA CHE SBAGLIANO QUASI TUTTI: il drag & drop con dnd-kit spesso non parte dagli strumenti di
automazione. Usa il pulsante "Assegna" (procedura P6). Se il trascinamento non funziona scrivi
"NON VERIFICABILE — limite dello strumento", NON che la funzione è rotta.

PRIMO PASSO OBBLIGATORIO: la prova di isolamento del browser descritta al §2.3 del piano.

CONSEGNA: report in docs/Sessioni di lavoro/02-08-26/E2E-Report/CORSIA_C.md nel formato del §5 del
piano. Screenshot in docs/_lavoro/e2e-s4/corsia-C/ — per il responsive UNO screenshot per ogni
combinazione voce × larghezza. NON modificare COLLAUDO_S4_CHECKLIST.md.

MODO DI LAVORARE: vai fino in fondo senza chiedermi conferme. Se ti blocchi su una voce, riprova al
massimo 3 volte, poi segnala BLOCCATO e passa alla successiva. Alla fine dimmi in 5 righe: quante
voci OK, quante KO, i bug trovati.
```

---

## Prompt corsia D — Capienza, form pubblico, non-regressione Classic

```
Sei un agente tester e2e. Guidi il browser con Playwright MCP. Esegui la CORSIA D del collaudo S4.

PRIMA DI TOCCARE QUALSIASI COSA, leggi per intero questi due file e seguili alla lettera:
- docs/Testing-Skill/PIANO_E2E_AGENTI_S4.md  (le regole, le procedure P1..P10, la tua corsia)
- docs/Testing-Skill/COLLAUDO_S4_CHECKLIST.md (le voci da verificare: sezioni 4, 8, 7)

LA TUA CORSIA: "Corsia D — Capienza, coerenza col form pubblico, non-regressione Classic"
(sezione 6 del piano). Voci 4-1…4-5, 8-1…8-4, 7-1…7-4.
Le tue risorse sul tenant Pro: sala "AG-D Sala", tavoli D-T1(4) e D-T2(6), fascia oraria PROPRIA
"AG-D", data di lavoro OGGI + 10 giorni, form pubblico http://localhost:5173/prenota/da-tommaso.
Sei l'UNICA corsia autorizzata a toccare l'interruttore D38 "Mantieni anche il limite coperti della
fascia" e a usare il form pubblico del tenant Pro.

ATTENZIONE ALLE CREDENZIALI CLASSIC: in .env.local.test le chiavi E2E_CLASSIC_ADMIN_EMAIL /
E2E_CLASSIC_ADMIN_PASSWORD / E2E_CLASSIC_TENANT_SLUG compaiono DUE VOLTE e la seconda coppia punta a
un tenant Pro (test-pro), non Classic. Per la sezione 7 usa la PRIMA coppia (test-classic). Verifica
subito dopo il login che la voce "Servizio" NON compaia nel menu: se compare sei sul tenant sbagliato,
fermati e segnalalo.

REGOLE CHE NON PUOI VIOLARE:
1. Solo ambiente TEST. Apri .env.local.test e verifica che VITE_SUPABASE_URL contenga
   "docnnernvpyrbwuzzach". Se contiene "rwuxgvld" (produzione) FERMATI SUBITO e dimmelo.
2. Non modificare NESSUN file di codice sorgente. Se trovi un bug lo descrivi, non lo correggi.
3. Nessun git add / commit / push / checkout / stash. Mai.
4. Nessun comando che scriva sul database (niente seed, niente supabase CLI, niente psql).
5. Non toccare sale, tavoli, fasce o prenotazioni che non iniziano per "D-" / "AG-D" / "[D]".
   NON toccare il limite walk-in. Sul tenant Pro lavora SOLO sulla data odierna + 10 giorni.
6. RIPRISTINI OBBLIGATORI a fine corsa: interruttore D38 SPENTO, max_turns di AG-D a 2, orari e
   intervallo di arrivo di AG-D come li avevi trovati (ANNOTALI PRIMA di cambiarli). L'interruttore
   D38 vale per tutto il ristorante e mentre è acceso disturba le altre corsie: tienilo acceso il
   meno possibile e scrivi nel report l'ora di accensione e di spegnimento.
7. Non cancellare niente a fine corsa, a parte i ripristini del punto 6.
8. Non dedurre esiti. Se non hai visto la schermata, scrivi NON VERIFICATO, non OK.

COSA SIGNIFICA "MORBIDO": il limite coperti non deve MAI bloccare l'admin, deve solo avvisarlo. Deve
invece rifiutare il cliente sul form pubblico. Se vedi l'admin BLOCCATO, quello è un bug.

PRIMO PASSO OBBLIGATORIO: la prova di isolamento del browser descritta al §2.3 del piano.

CONSEGNA: report in docs/Sessioni di lavoro/02-08-26/E2E-Report/CORSIA_D.md nel formato del §5 del
piano. Screenshot in docs/_lavoro/e2e-s4/corsia-D/. Nel report scrivi esplicitamente la riga
"D38 acceso dalle HH:MM alle HH:MM". NON modificare COLLAUDO_S4_CHECKLIST.md.

MODO DI LAVORARE: vai fino in fondo senza chiedermi conferme. Se ti blocchi su una voce, riprova al
massimo 3 volte, poi segnala BLOCCATO e passa alla successiva. Alla fine dimmi in 5 righe: quante
voci OK, quante KO, i bug trovati.
```

---

---
---

# GIRO 2 — i prompt di fix

> Nascono dal collaudo del 02-08. Diagnosi completa, con le righe di codice colpevoli, in
> [SINTESI.md](../Sessioni%20di%20lavoro/02-08-26/E2E-Report/SINTESI.md).
>
> **Ordine consigliato:** `FIX-1` per primo (sblocca metà checklist), poi `FIX-2`. **`FIX-3` è di sola
> lettura** e può girare in parallelo con entrambi.
> `FIX-1` e `FIX-2` toccano file diversi, quindi possono anche andare in parallelo — ma **nessuno dei
> due committa**: si committa una volta sola alla fine, quando `npm run validate` è verde.
>
> Regole valide per tutti e tre: si lavora su `env/test`; **nessun merge su `main`**; **nessuna
> scrittura su produzione `rwuxgvld`**; **mai** `supabase db push`; **mai** toccare o rinominare
> migrazioni già applicate.

## Prompt FIX-1 — Gli stati dei tavoli seguono l'orologio (bloccante)

```
Sei uno sviluppatore su questo repo. Branch env/test. Correggi il difetto S4-BUG-1.

CONTESTO OBBLIGATORIO, leggilo prima di toccare il codice:
- docs/Sessioni di lavoro/02-08-26/E2E-Report/SINTESI.md  → sezione S4-BUG-1 e S4-BUG-12
- docs/Sessioni di lavoro/02-08-26/E2E-Report/CORSIA_B.md → voci 3-2, 3-3, 3-4 (il sintomo osservato)
- docs/APP_CONTEXT_SKILL.md §0 per instradarti, poi la skill d'area Servizio

IL DIFETTO: in src/features/booking/hooks/useTableStatuses.ts, resolveTableLiveStatus confronta
new Date(booking.confirmed_start) con "adesso". Ma in questo progetto confirmed_start NON è un istante
UTC: è l'ora da orologio da muro con un suffisso +00:00 che mente. Tutto il resto dell'app lo sa e usa
extractTimeFromISO / getAccurateStartTime (src/features/booking/utils/dateUtils.ts). Qui no, quindi
ogni stato slitta di +2 ore d'estate e +1 d'inverno: nessun tavolo raggiunge mai "In uscita" e
l'avviso di fine turno non parte mai.

COSA DEVI FARE:
1. Correggi resolveTableLiveStatus perché confronti ore da orologio a muro con l'ora da orologio a
   muro di "adesso", coerentemente con il resto dell'app. Attenzione ai due casi difficili:
   - la fascia che scavalla la mezzanotte (fine < inizio);
   - il cambio ora legale/solare: non introdurre una costante +2.
   Cerca prima se esiste già un helper adatto in dateUtils.ts o in
   src/features/booking/lib/resolveOccupancy.ts e riusalo invece di scriverne uno nuovo.
2. Verifica se lo stato "In uscita" deve considerare anche il buffer di riassetto (D37): la finestra
   di occupazione è arrivo + durata + buffer, e oggi resolveTableLiveStatus guarda solo confirmed_end.
   Se il buffer manca, spiega nel report se lo hai aggiunto e perché.
3. Correggi anche S4-BUG-12: src/features/booking/hooks/useAnalytics.ts:160 usa
   new Date(r.confirmed_start).getHours() — stessa causa, sposta l'ora di punta di 2 ore.
4. NON toccare lo snapshot occupancy in useTableAssignments.ts: quello fa aritmetica fra due istanti
   e ri-serializza in UTC, ed è corretto. Verificalo, non cambiarlo per simmetria.

TEST (obbligatori, senza questi il lavoro non è finito):
- estendi src/features/booking/hooks/__tests__/ dove esistono già i test di useTableStatuses:
  casi con orari a muro passati/futuri, soglia di ritardo, fine turno, fascia oltre la mezzanotte, e
  un caso in ora solare e uno in ora legale;
- i test devono FALLIRE sul codice attuale e PASSARE dopo il fix: verificalo davvero, non a parole.

VINCOLI: non modificare il comportamento di nessun altro hook; non toccare migrazioni; nessun commit,
nessun push, nessun merge; niente scritture su produzione.

CHIUSURA: esegui `npm run validate` (deve essere verde) e scrivi cosa hai cambiato, quali test hai
aggiunto e cosa resta da riprovare a mano, in
docs/Sessioni di lavoro/02-08-26/E2E-Report/FIX_1_OROLOGIO.md
```

## Prompt FIX-2 — Turni, fallimento muto e archiviazione al checkout (bloccante)

```
Sei uno sviluppatore su questo repo. Branch env/test. Risolvi S4-BUG-2, S4-REQ-3 e S4-UX-8.

CONTESTO OBBLIGATORIO, leggilo prima di toccare il codice:
- docs/Sessioni di lavoro/02-08-26/E2E-Report/SINTESI.md  → S4-BUG-2, S4-REQ-3, S4-UX-8
- docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md     → §7 e §9 (le §4/§6 sono vecchie)
- docs/Database-Skill/DB_SKILL.md se aggiungi la colonna del punto B

Sono tre pezzi collegati, tutti sul motore delle assegnazioni. Falli in quest'ordine.

── A. Il tavolo verde che rifiuta l'assegnazione (S4-BUG-2) ──
Sintomo reale visto da Matteo: assegno una prenotazione a un tavolo LIBERO e nella console di sviluppo
compare "✗ salvataggio · Turni esauriti per questo tavolo in questa fascia.", a schermo nulla.
Due cause, entrambe da sistemare:
1. Il numero di turno si calcola su TUTTE le righe del tavolo, comprese quelle già chiuse
   (checked_out_at valorizzato) — useTableAssignments.ts righe ~234-242 e ~323-333 — mentre il COLORE
   del tavolo guarda solo le righe attive (useTableStatuses.ts). Da qui il tavolo verde che rifiuta.
   DECISIONE PRESA: un turno concluso HA consumato un turno, quindi il conteggio resta com'è. A
   cambiare è la UI, che deve dirlo PRIMA: nella modale "Assegna tavolo" ogni tavolo mostra i turni
   residui, e i tavoli senza turni residui appaiono come "Turni esauriti" (non selezionabili con un
   clic normale, ma forzabili di proposito), esattamente come già succede per "Già in tavolata".
   ECCEZIONE: l'annullamento non deve consumare un turno. useUndoTableAssignment oggi scrive
   checked_out_at su una riga creata pochi secondi prima: è la correzione di un errore, non un pezzo
   di storia. Falla cancellare fisicamente quella riga, e spiega nel report perché questo NON viola
   il modello append-only D48 (che riguarda i turni realmente serviti).
2. Se la fascia è chiusa (max_turns = 0, il pulsante "Chiudi servizio") ogni assegnazione fallisce con
   lo stesso identico messaggio sui turni. È fuorviante: serve un messaggio distinto, del tipo
   "La fascia è chiusa: riaprila per assegnare i tavoli".

── B. Liberare un tavolo archivia la prenotazione (S4-REQ-3, richiesta di Matteo) ──
Oggi liberi il tavolo e la prenotazione RITORNA fra quelle "da assegnare" (verificato dalla corsia A,
voce 2.1-5). Deve invece risultare SERVITA: fuori dal cassetto, con i dati conservati per le
statistiche. Matteo NON vuole una tabella archivio separata.
Fallo con una colonna nuova su booking_requests (proposta: served_at timestamptz, migrazione 066 —
verifica tu qual è il primo numero libero in supabase/migrations/) valorizzata dal checkout, e con il
filtro di useUnassignedBookings che esclude le prenotazioni servite.
QUATTRO CASI DA NON SBAGLIARE — sono la parte difficile:
 1. checkout normale (finestra "Tavolo a fine turno" → Libero, e "Libera tavolo" dal dettaglio in
    piantina) → ARCHIVIA;
 2. "Annulla" subito dopo un'assegnazione (useUndoTableAssignment) → NON archivia, la prenotazione
    torna disponibile;
 3. "Libera e assegna" / sostituzione forzata (useForceReplaceBookingOnTable) e la riassegnazione
    rapida da Calendario (useReleaseBookingAssignment) → NON archiviano: la prenotazione scavalcata
    DEVE tornare fra quelle da assegnare (è un comportamento già collaudato OK, voce 3-7: se lo rompi
    hai fatto una regressione);
 4. tavolata su più tavoli: liberare UNO dei due tavoli non archivia niente finché resta
    un'assegnazione attiva per quella prenotazione. Si archivia solo quando l'ultima si chiude.
Prevedi anche il ritorno indietro: se la prenotazione viene riassegnata a un tavolo, served_at torna
a null (altrimenti un errore dello staff diventa irreversibile).
Regole DB: NON toccare né rinominare migrazioni esistenti; mai `supabase db push`; prima di applicare
la migrazione su TEST verifica con get_project_url che il progetto sia docnnernvp — se è rwuxgvld
FERMATI. Dopo l'applicazione su TEST rigenera i tipi con npm run db:types:linked verificando che il
progetto collegato sia quello di TEST.

── C. Il dialogo di forzatura invisibile (S4-UX-8) ──
Quando l'assegnazione fallisce (turni esauriti o tavolo occupato), la UI apre davvero il riquadro
ambra con "Assegna comunque" / "Libera e assegna" — ma lo disegna SOTTO la modale "Assegna tavolo",
che nel percorso di errore non viene chiusa. Chi lavora vede solo la console. Sistemalo: o la modale
si chiude prima di mostrare la conferma, o la conferma vive dentro la modale. Scegli tu, ma la
sequenza deve funzionare senza che l'utente debba premere Annulla per liberare il clic.

TEST (obbligatori):
- un test che riproduce il tavolo verde che rifiuta (assegno → libero → riassegno con turni finiti) e
  verifica che la UI lo mostri PRIMA, non dopo il fallimento;
- un test per ciascuno dei quattro casi di archiviazione elencati in B;
- un test che l'annullamento non consuma un turno;
- un test che la conferma di forzatura sia raggiungibile senza chiudere la modale.
Devono fallire sul codice attuale e passare dopo: verificalo davvero.

VINCOLI: nessun commit, nessun push, nessun merge su main; nessuna scrittura su produzione.

CHIUSURA: `npm run validate` verde, poi scrivi cosa hai cambiato — inclusa la migrazione e lo stato
di applicazione su TEST — e cosa va riprovato a mano, in
docs/Sessioni di lavoro/02-08-26/E2E-Report/FIX_2_ASSEGNAZIONI.md
Aggiorna anche docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md §9 con il nuovo comportamento.
```

## Prompt FIX-3 — Indagine, senza toccare il codice (parallelizzabile)

```
Sei un analista su questo repo. NON devi correggere niente: devi capire e riferire. Branch env/test.

CONTESTO OBBLIGATORIO:
- docs/Sessioni di lavoro/02-08-26/E2E-Report/SINTESI.md  → S4-BUG-4, S4-BUG-5, S4-BUG-6, S4-BUG-7,
  S4-DEBT-9, S4-NOTE-11
- docs/Sessioni di lavoro/02-08-26/E2E-Report/CORSIA_D.md → le prove raccolte

Cinque domande. Per ognuna voglio: cosa fa il codice OGGI (con file e righe), se il comportamento
osservato è un difetto o è voluto, e la proposta di intervento con il suo costo e il suo rischio.
NON scrivere codice di produzione, NON applicare migrazioni, NON toccare il database.

1. CAPIENZA PUBBLICA E D38 (S4-BUG-5) — la più importante, tocca il percorso pubblico.
   Con D38 spento, 10 posti di tavoli e limite fascia 6, l'RPC get_available_arrival_times svuota gli
   orari già dal 7° coperto, come se il cap 6 valesse sempre. La checklist si aspetta 10.
   Leggi supabase/migrations/060_rpc_get_available_arrival_times.sql (e successive che la modificano),
   src/features/booking/hooks/useCapacityCheck.ts e la Edge Function supabase/functions/create-booking.
   Dimmi: chi è la fonte di verità della capienza sul percorso pubblico, se i posti dei tavoli ci
   entrano davvero, e se la checklist descrive il comportamento voluto o si sbaglia. ATTENZIONE:
   questa RPC serve il form pubblico, quindi qualunque proposta va valutata anche per la produzione.

2. BADGE % IN CALENDARIO (S4-BUG-6) — mostra "8 / 128", cioè i posti di tutto il locale, invece del
   limite attivo della fascia. Trova il calcolo, dimmi qual è la regola implementata e presenta le due
   letture possibili (denominatore = locale intero vs limite della fascia) perché Matteo decida.

3. CLASSIC SENZA BADGE DI OCCUPAZIONE (S4-BUG-7) — la voce 7-2 chiede l'occupazione per fascia in
   Calendario anche senza limite impostato; sul tenant Classic i badge non compaiono. QUESTA È LA
   DOMANDA PIÙ URGENTE: è una regressione introdotta da S4 (quindi tocca clienti che già pagano) o il
   Classic è sempre stato così? Rispondi confrontando env/test con main (git log/diff sui file del
   Calendario e sui flag FEATURES), non a intuito.

4. WALK-IN SENZA TAVOLO (S4-BUG-4) — se la sala ha tavoli, il form pretende Sala e Tavolo. La
   checklist 5-1 prevede il walk-in "solo coperti". Guarda src/features/booking/components/home/
   WalkInModal.tsx e useWalkInMutation.ts, poi cerca nelle decisioni D45/D46/D47 dei documenti
   Servizio quale sia l'intenzione originale. Dimmi se è un requisito perso per strada o una scelta.

5. FASCIA AG-D SENZA ORARI PUBBLICI (S4-NOTE-11) — la corsia D ha creato una fascia 15:35–16:25 in un
   buco di 59 minuti e il form pubblico non mostrava orari selezionabili. Verifica se dipende da
   durata prenotazione + preavviso minimo + orari di apertura (cioè: setup sbagliato dell'agente) o se
   è un difetto. Da questa risposta dipende se le voci 4-3, 4-4, 8-1, 8-2 vanno solo rieseguite.

BONUS (rispondi solo se avanzi tempo): S4-DEBT-9 — la spunta Privacy del form pubblico
(privacy-consent-dietary-input, input a opacity-0) non risponde al clic programmatico, quindi il form
pubblico non è collaudabile in automatico. Proponi come renderlo azionabile senza cambiarne l'aspetto.

VINCOLI: nessuna modifica a file di codice, nessuna migrazione, nessun commit, nessun push.

CHIUSURA: scrivi il referto in
docs/Sessioni di lavoro/02-08-26/E2E-Report/INDAGINE_APERTE.md
con una tabella finale "domanda → risposta → proposta → chi decide".
```

---
---

# GIRO 3 — riprova mirata, dopo i fix

> Da lanciare **solo** quando `FIX-1` e `FIX-2` sono conclusi e `npm run validate` è verde.
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
3. Turni esauriti (voce 3-6) sulla fascia AG-B2 con 1 turno: assegna, poi FORZA il caso che ha visto
   Matteo — assegna una prenotazione a un tavolo, LIBERA il tavolo, poi prova a RIASSEGNARE lo stesso
   tavolo. Il tavolo appare verde ma i turni sono finiti: verifica che la UI te lo dica PRIMA di
   provare, e che la conferma "Assegna comunque" sia cliccabile senza dover chiudere la modale.
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
- docs/Sessioni di lavoro/02-08-26/E2E-Report/INDAGINE_APERTE.md se esiste già

PERCHÉ LA PRIMA VOLTA NON È RIUSCITA: la fascia di prova era larga 50 minuti, infilata in un buco di
59 fra Pranzo e Aperitivo, e il form pubblico non offriva orari selezionabili. Questa volta crea una
fascia "AG-D2" LARGA (almeno 3 ore) in una finestra davvero libera e su una data lontana
(oggi + 10 giorni), e PRIMA di iniziare verifica che il cliente veda orari cliccabili su
/prenota/da-tommaso. Se non li vede, fermati e segnalalo: è quello il problema, non le voci sotto.

DA PROVARE:
1. Voci 4-2, 4-3, 4-4 — capienza con D38 spento e acceso. Sala "AG-D2" con 10 posti di tavoli e
   limite coperti della fascia = 6. Con D38 SPENTO deve valere 10, con D38 ACCESO deve valere 6.
   Prova dal FORM PUBBLICO, non solo via RPC: voglio sapere cosa vede il cliente.
   Tieni D38 acceso il meno possibile, rimettilo SPENTO a fine prova e scrivi gli orari nel report.
2. Voci 8-1 e 8-2 — cambia gli orari e l'intervallo di arrivo di AG-D2 e verifica che il form
   pubblico si adegui.
3. Voce 7-2 — sul tenant Classic (prima coppia di credenziali, test-classic): i badge di occupazione
   per fascia in Calendario. Nel primo giro non c'erano. Riporta esattamente cosa vedi, senza
   giudicare se è giusto: serve a capire se è una regressione.
4. Voce 7-3 — form pubblico Classic. La spunta Privacy non è cliccabile da automazione: PROVACI, e se
   non ci riesci segna NON VERIFICABILE con il dettaglio tecnico. Non fingere di averlo fatto.

RISORSE TUE: sala "AG-D2 Sala", fascia "AG-D2", prenotazioni "[D2] ...", data oggi + 10 giorni.
Sei l'unico autorizzato a toccare l'interruttore D38 e il form pubblico del tenant Pro. Ripristini
obbligatori a fine corsa: D38 spento, turni di AG-D2 a 2, fascia riaperta.

CONSEGNA: docs/Sessioni di lavoro/02-08-26/E2E-Report/RIPROVA_D.md, formato del §5 del piano.
Screenshot in docs/_lavoro/e2e-s4/riprova-D/. Non modificare la checklist.
```

---
---

## Prompt di consolidamento — da lanciare DA SOLO, alla fine

```
Le quattro corsie di collaudo e2e S4 hanno finito. Consolida i risultati. Sei l'unico agente attivo:
nessuno sta più scrivendo su questi file.

FONTI (usa quelle che esistono; l'assenza di un file non si inventa):
- docs/Sessioni di lavoro/02-08-26/E2E-Report/SINTESI.md   ← parti da qui, è già consolidato
- .../CORSIA_A.md, CORSIA_B.md, CORSIA_C.md, CORSIA_D.md   (giro 1)
- .../FIX_1_OROLOGIO.md, FIX_2_ASSEGNAZIONI.md, INDAGINE_APERTE.md  (giro 2)
- .../RIPROVA_B.md, RIPROVA_D.md                           (giro 3 — questi VINCONO sul giro 1)
- docs/Testing-Skill/PIANO_E2E_AGENTI_S4.md (per la mappa ID voce → riga di checklist)

REGOLA DI PRECEDENZA: dove il giro 3 ha rifatto una voce, vale il suo esito; il giro 1 resta solo
come storia. Le voci del giro 1 che nessuno ha rifatto restano com'erano.

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
