# Prompt pronti — agenti tester e2e S4

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

## Prompt di consolidamento — da lanciare DA SOLO, alla fine

```
Le quattro corsie di collaudo e2e S4 hanno finito. Consolida i risultati. Sei l'unico agente attivo:
nessuno sta più scrivendo su questi file.

FONTI:
- docs/Sessioni di lavoro/02-08-26/E2E-Report/CORSIA_A.md
- docs/Sessioni di lavoro/02-08-26/E2E-Report/CORSIA_B.md
- docs/Sessioni di lavoro/02-08-26/E2E-Report/CORSIA_C.md
- docs/Sessioni di lavoro/02-08-26/E2E-Report/CORSIA_D.md
- docs/Testing-Skill/PIANO_E2E_AGENTI_S4.md (per la mappa ID voce → riga di checklist)

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
