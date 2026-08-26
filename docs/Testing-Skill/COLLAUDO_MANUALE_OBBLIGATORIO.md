# Collaudo manuale Servizio — checklist operativa

**Aggiornato:** 26-08-2026 sera · WP1 istanza 2 · Branch `env/test` · TEST `docnnernvp`  
**Account:** Pro `tomas@t.com` (blocchi 0-bis→4) · Classic `testc@c.com` (T14–T16)  
**Password:** `.env.local.test` (`E2E_PRO_ADMIN_PASSWORD` / `MANUAL_ADMIN_PASSWORD`)  
**Gap-analysis:** [`Gap-analysis-Servizio-QA-manuale-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Gap-analysis-Servizio-QA-manuale-25-08-26.md) · §5 = **non rifare**  
**Fix codice 26-08 sera:** P0 multi-tavolo + P1 refresh + UX T9 — vedi sezione **RITEST obbligatorio** sotto.
---

## 0. Preparazione (15 min, una volta)

1. `npm run dev` → `http://localhost:5173/` (**no** `dev:prod`)
2. Usa solo sala **QA-Manuale** (§0-bis) — non la sala operativa
3. **Colori tavolo** — prenotazione da **Admin → Nuova prenotazione** (già accettata), orario **dentro la fascia** Servizio:

| Stato | Orario prenotazione |
|---|---|
| In arrivo (azzurro) | adesso + 5 min |
| Occupato (giallo) | adesso − 6 min |
| In ritardo (rosso) | adesso − 25 min |
| In uscita (viola) | adesso − 3 h 10 min |

Mappa si aggiorna ogni **30 s** — non ricaricare per forzarla. Soglia ritardo **15 min**, avviso fine turno **30 min**, durata default **3 h**, buffer riassetto **0 min**.

**Manopole (`FU-SERV-MANOPOLE-CONSOLE-1`):** soglia ritardo, richiamo fine turno e durata walk-in **non si cambiano dall'app** — verifica solo i default sopra.

**Trappole:** (1) Form pubblico: max **3 invii/min**, blocco **24 h** a 6 tentativi/10 min — invii lenti in T1/T15. (2) Tenant: `da-tommaso` admin ≠ `/prenota/test-pro`. (3) Cache: con `build`+`preview`, chiudi schede e riapri.

---

## Conteggio

| Blocco | Prove | Fatte |
|---|---|---|
| Setup | 0-bis (1) | 1/1 |
| Validazione | V1–V8 (8) | 8/8 |
| Blocco 1 — rilascio | T1–T5 (5) 🔴 | 5/5 |
| Blocco 2 — briefing/assegna | T6–T9 + T7-bis (5) | 5/5 |
| Blocco 3 — visivo | T10–T12 (3) | 3/3 |
| Blocco 4 — Calendario | T13 (1) | 1/1 |
| Classic | T14–T16 (3) | 3/3 |
| **TOTALE** | **26** | **26/26** |

Checklist umana **chiusa** 26-08 sera. T7-bis e T9 = `[x]` **con riserve** (bug/debiti sotto; non «OK pulito»). WP-1 resta **IN PILOTA ombra** — non equivale a capitolo Servizio chiuso.

🔴 = blocca rilascio se KO · `[O]` = fatta con nota (non è OK pulito)

---

## RITEST obbligatorio (dopo fix 26-08 sera) — fai questi, non tutta la checklist

| Priorità | Prova | Cosa è stato modificato | Cosa controlli tu |
|---|---|---|---|
| **P0** | **T9** (parte multi-tavolo) | «Rimetti in attesa» e «Archivia» liberano **tutti** i tavoli della prenotazione | Prenotazione A su **2+ tavoli** → Assegna B su uno di quei tavoli → **Rimetti in attesa** → A torna **intera** in «da assegnare» (nessun tavolo resto occupato). Ripeti con **Archivia** → A archiviata, tutti i tavoli liberi. |
| **P1** | **T9** (refresh) + flusso Nuova prenotazione | Create admin invalida lista Servizio (niente F5) | Con Servizio già aperto su fascia Cena: **Nuova prenotazione** admin accettata → torna in Servizio → compare in «da assegnare» **senza** refresh manuale. |
| **UX già fatta** | **T9** (aprire le 3 radio) | Overlay + hint Assegna | Assegna B → **tocca** tavolo occupato (o rilascia drag) → compare riquadro ambra con 3 radio. Se già ok ieri, basta una conferma veloce. |
| **Docs path** | **T7-bis** | Solo testo checklist (path reali) | Opzionale: rivedi sequenza sotto (cestino Lista + turni in Assegna). **Non** aspetta fix codice turni — decisione prodotto in chat senior. |

**Non ritestare ora** (nessun fix codice su queste): `[O]` **V3, V5, T10, T16** · note T1/T3/T4/T5/T11/T13/T15 (debito; prompt fix via senior).

Dopo il ritest: spunta qui sotto e aggiorna le note T9.

- [x] **RITEST-P0** — multi-tavolo Rimetti in attesa + Archivia OK  
- [x] **RITEST-P1** — nuova prenotazione admin compare in Servizio senza F5  
- [x] **RITEST-UX-T9** — 3 radio raggiungibili (tap/drop occupato)  

---

## Checklist rapida

- [x] **0-bis** — Crea sala QA-Manuale (4 tavoli, 2 fasce)  
- [x] **V1** — Sala senza nome / larghezza < 200 
*nella vista mappa , div in cui è contenuta la mappa, non si adegua in base a formato mappa. errore = rimane grande e lascia spazio grigio dove non c'è mappa.  deve mostrare solo spazio necessario a mostrare la mappa.* 

- [x] **V2** — Tavolo senza nome / capienza 0
- [O] **V3** — Fascia invalida / duplicata / overlap 
*se metto stesso nome " pranzo" a fascia aperitivo, app segnala errore ma sbagliato , mi dice " Le fasce "pranzo" e "AG-B2" si sovrappongono " ma non è vero AG-B2 è ore 19:00 --> 22:00 . quindi segnala errore che non capisco.  il resto funziona. inoltre la frase " Coperti massimi per fascia " è incompleta, aggiungiamo alla fine " Coperti massimi per
questa fascia oraria"* 

- [x] **V4** — Walk-in senza sala o tavolo (messaggi)
- [O] **V5** — Limite walk-in morbido (avviso ambra) 
* anche se imposto limite walkin in servizio, posso comunque inserire walkin di piu del limite impostato

- [x] **V6** — Modifica fascia scope temporaneo
* telecamera deve abbassarsi quando apro dropdown, altrimenti nonv edo tutte le opzioni nel modal. * 

- [x] **V7** — Guard modifiche non salvate
- [x] **V8** — Elimina sala: conferma a due passaggi
- [x] **T1** 🔴 — Prenotazione pubblica → Calendario + Servizio 
*quando clicco " Ora" e scelgo orario, gli orari non vengono mostrati in ordine crescente ( dalla mattina alla notte) ma vengono mostrati in ordine sparso. da correggere - totale senza menu preselezionato in riepilogo, deve mostrare anche il prezzo che sarabbe a persona, oltre al prezzo totale che dovrebbe pagare. mettiamo sulla stessa linea, prezzo a persona x ospiti = totale barrato* 
- [x] **T2** 🔴 — Cambio orari fascia → form pubblico
- [x] **T3** 🔴 — Walk-in rifiutato senza sala/tavolo
*anche se assegno tavolo a walkin, se vado in pagina servizio non vedo il tavolo occupato dalla prenotazione, la devo assegnare manualmente io non ha il tavolo gia assegnato.* 
- [x] **T4** 🔴 — Super capienza tavolo: avviso, non blocco 
*confermo tuttavia anche se assegno tutti i posti disponibili, rimane il pulsante " aggiungi tavolo" anche se prenotazione ha tutti i tavoli che gli servono.* 
- [x] **T5** 🔴 — Checkbox «Mantieni anche il limite coperti della fascia» (interno: D38)
*ho ricevuto avviso di superamento limite massimo coperti per fascia oraria quando h modificato una prenotazione a cui ho agigunto dei coperti, anche se la checkbox " «Mantieni anche il limite coperti della fascia» " non era spuntata.Con checkbox spuntata ho riscontrato warning soft che mi avvisva che stavo accettando ua prenotazione che superava la capienza della fascia oraria. l'avviso mi p arrivato sempre da fuori pagina servizio e assegnazione tavoli, o ricevuto warning mentre ero su modal per modificare una prenotazione, e mentre ho inserito una nuova prenotazione* 
- [x] **T6** 🔴 — PDF briefing orari corretti
- [x] **T7** — Colonna Tavolo mono/multi sala
- [x] **T7-bis** 🔴 — Elimina tavolo **T2** vs elimina sala (conto turni) `FU-SERV-TURNO-SALA-1` (con riserve)
*Path aggiornato 26-08: turni residui solo in modale **Assegna** (fascia con tetto turni); Elimina tavolo = cestino in **Lista**, non nel modal matita.*
*Nota prodotto (senior): senso dei turni-tavolo vs solo limite coperti — **non** blocco ritest P0/P1.*
*Dubbio Matteo su «consumo turno dopo delete»: per ora basta verificare che le prenotazioni tornino **da assegnare**; il resto è decisione prodotto.*

- [x] **T8** — Aggiungi tavolo a tavolata già assegnata
- [x] **T9** 🔴 — Tavolo occupato: tre scelte radio (riserve → **ritesta P0+P1**)
*Fix UX 26-08: overlay + hint — vedi **RITEST-UX-T9** sopra.*
*Fix P1 26-08: refresh lista dopo Nuova prenotazione — vedi **RITEST-P1**.*
*Fix P0 26-08: Rimetti in attesa / Archivia liberano **tutta** la tavolata — vedi **RITEST-P0**.*
*Ancora aperto (non in P0/P1): in «Aggiungi tavolo» mostrare nome di chi occupa i tavoli non disponibili.*

- [O] **T10** — Piantina 375px senza overflow pagina 
*scorre tutta la pagina con scroll verticale. ( inoltre vorrei che utente impostasse dimensione Sala basandosi sui Metri no sui pixel. cerchiamo la dimensione media di un tavolo che fa 4 coperti e da li stimiamo dimensione sala : se il tavolo è grande x metri allora se imposta la sala grande X ci staranno X tavoli. cosa ne pensi? come facciamo a far scegliere dimensione sala per metri e no per pixel?)*
- [x] **T11** — Modifica sala nascosta su mobile
*confermo , tab modifica mostra messaggio, tuttavia, se sto in tab servizio mi è possibile assegnare tavoli ( errore non è comodo con questa visuale) e cliccare " Modifica Sala" ( non da poter fare da mobile.) FU : trovare vista per mobile che permette di visualizzare i tavoli nelle sale con le prenotazioni gia assegnate. ( eventualmetne trovare anche un modo per assegnare le prenotazioni da mobile. e mantenere utilizzo app desktop e mobile.)*
- [x] **T12** — Legenda 5 colori coerente
*non capisco come faccia app a riconoscere il ritardo. come fa a sapere se prenotazione è arrivata a orario prestabilito o no?*
- [x] **T13** — Badge Calendario `FU-SERV-BADGE-CASCATA-1`
*vedo il badge con i coperti prenotati per il giorno nel calendario --> ok . non vedo badge della percentuale mensile. dove dovrei trovarlo? inoltre la logica per il giorno doveva essere = se ho impostato limite coperti per face orarie, app somma il limite e in base ai coperti prenotati per quel giorno mi da % di occupazione. questa logica è rimasta invariata?*
- [x] **T14** 🔴 — Classic: nessuna UI Pro, console pulita
- [x] **T15** 🔴 — Form Classic ok / oltre cap
*funziona ma se inserisco troppi ospiti, nella casella che mostra orari disponibili, il messagio deve dire " non abbiamo abbastanza posti per la vostra prenotazione in questa fascia oraria." mentre ora dice solo "Nessun orario disponibile per questa data. Prova un altro giorno" errato. inoltre dobbiamo sistemare ordine di compilazione utente, i campi non sono in ordine per mostrare correttaemnte la disponibilità. nome - data - N ospiti - ora. confermami che è giusto in questa sequenza.*
- [O] **T16** — Intervallo arrivo → orari form pubblico 
*Nota sessione: con due tab (Classic + Pro) i dati Pro (prenotazioni, poi anche sale/tavoli) sono sembrati spariti su `tomas@t.com`, screen 115258/115307; poi Matteo riporta che prenotazioni e anche sale/tavoli **sono tornati**. Causa non accertata — vedi `Esiti-collaudo-manuale-servizio-parziali-26-08-26.md`.*

---

## Sequenze click

Da 0-bis a V8 = fatto (vedi checklist rapida e note `[O]`).

### T1 🔴 — Prenotazione dal form pubblico arriva in Calendario e in Servizio
**Cosa testo:** il cliente prenota dalla pagina pubblica; tu controlli che la stessa richiesta compaia nel Calendario admin e nel cassetto «da assegnare» di Servizio (nessun test automatico fa questo percorso intero).
**Come fare:**
1. Apri una **finestra privata / in cognito** del browser (Chrome: `Ctrl+Shift+N`; Edge simile) **oppure** una scheda dove **non** sei loggato come admin.
2. Vai all’URL pubblico `/prenota/da-tommaso` (non la home admin).
3. Compila: Nome `Anna Prova`, data **oggi**, Ora in fascia **Cena**, Ospiti **4** → invia **una sola volta**.
4. Nella scheda admin (loggata): apri **Calendario** → giorno di oggi.
5. Poi **Servizio** → **Mappa** → modalità **Servizio** → fascia **Cena**.
**Cosa controllare:**
- Il cliente vede la conferma dopo l’invio.
- In Calendario compare `Anna Prova` con lo **stesso orario** scelto sul form.
- In Servizio, stessa persona nello stesso orario nel cassetto **da assegnare**.
**Trappola:** sul pubblico la richiesta nasce **in attesa** (accettala dall’admin se serve per vederla in Servizio) · confronta l’orario in tre posti (form / Calendario / Servizio — attenzione al fuso) · **un solo invio** (limite anti-spam sul form).

### T2 🔴 — Cambio orario fascia in admin → orari aggiornati sul form pubblico
**Cosa testo:** se cambi l’inizio di una fascia (es. Cena) in admin, il form pubblico deve mostrare i nuovi orari dopo un refresh — non i vecchi.
**Come fare:**
1. In admin: **Fasce orarie** → matita su **Cena** → campo **Inizio** (es. `20:00`) → **Tipo di salvataggio** = **Sempre** → **Salva modifiche**.
2. Apri (o riapri) una **finestra privata / in cognito** (o scheda non loggata admin) su `/prenota/da-tommaso`.
3. Ricarica la pagina (F5) e apri la tendina **Ora**.
4. A fine prova: rimetti l’orario di inizio originale della fascia e salva di nuovo.
**Cosa controllare:**
- Gli orari in tendina partono dal **nuovo** inizio (non dal vecchio).
- Senza F5 puoi ancora vedere orari vecchi (è atteso: serve il refresh).
- Se salvi con **Solo oggi** / settimana, il cambio vale solo per quello scope (voluto).
**Trappola:** non usare la scheda admin già loggata come «cliente»; usa privata/non loggata.

### T3 🔴 — Walk-in: sala e tavolo obbligatori
**Cosa testo:** da Servizio, un walk-in senza sala o senza tavolo deve essere bloccato con messaggio chiaro; con sala+tavolo libero deve creare la presenza e colorare il tavolo.
**Come fare:**
1. **Servizio** → **Home** → **Aggiungi walk-in**.
2. Metti solo coperti **2** (senza sala) → invia.
3. Scegli una sala **senza** tavolo → invia.
4. Scegli sala + tavolo libero → conferma.
**Cosa controllare:**
- Messaggio «Seleziona una sala.»
- Messaggio «Seleziona un tavolo.»
- Poi walk-in creato e tavolo **giallo** con il nome.
**Trappola:** se assegni tavolo al walk-in ma in mappa non lo vedi già occupato, annotalo come KO (nota già in checklist rapida).

### T4 🔴 — Super capienza su un solo tavolo: avviso, non blocco
**Cosa testo:** assegnare una prenotazione grande a un tavolo piccolo deve avvisare («mancano posti») ma **non** impedire l’assegnazione.
**Come fare:**
1. **Nuova prenotazione** da admin: **6** coperti, orario tra ~10 minuti.
2. **Servizio** → **Assegna** → scegli **T1 (2 posti)** → **Assegna tavolo**.
**Cosa controllare:**
- Compare *«Mancano 4 posti…»* (o equivalente).
- L’avviso **non** blocca: puoi comunque assegnare.
- T1 risulta occupato; contatore tipo «2 posti su 6 richiesti».
**Trappola:** se con tutti i posti coperti resta comunque «Aggiungi tavolo», annotalo (nota già in checklist).

### T5 🔴 — Checkbox «Mantieni anche il limite coperti della fascia» (interno: D38)
**Cosa testo:** in Servizio → card **Fasce orarie**, la checkbox **«Mantieni anche il limite coperti della fascia»** (non il pulsante «Aggiungi fascia») decide se, quando assegni prenotazioni ai tavoli, l’avviso di capienza guarda **solo i posti dei tavoli** oppure **anche** il tetto coperti della fascia. In entrambi i casi puoi comunque assegnare (avviso morbido, non blocco).
**Come fare:**
1. Apri **Servizio** → espandi **Fasce orarie**. Controlla la checkbox **«Mantieni anche il limite coperti della fascia»**: lasciala **spenta** (vuota).
2. Sulla fascia **Pranzo**: imposta **Coperti massimi** = **6**. I tavoli della sala QA-Manuale (es. T1+T2+T3) devono sommare circa **10** posti.
3. Crea una prenotazione da **8** coperti su Pranzo → in Servizio **Assegna** a tavoli che coprano gli 8 posti (es. due tavoli).
4. **Accendi** la stessa checkbox → ripeti una prenotazione simile / stessa assegnazione.
5. A fine prova: **rimetti la checkbox spenta**.
**Cosa controllare:**
- Checkbox **spenta**: nessun avviso legato al tetto fascia finché resti entro i **posti fisici** dei tavoli (qui fino a ~10).
- Checkbox **accesa**: compare un avviso già quando superi il **minimo** tra tetto fascia (6) e posti tavolo (10) — cioè già a 8.
- In entrambi i casi l’assegnazione resta **completabile** (puoi confermare nonostante l’avviso).
**Trappola:** D38 **non** è «Aggiungi fascia». Non lasciare la checkbox accesa dopo il test. Questo test parla di **avvisi in assegnazione admin**, non di «mettere più turni sullo stesso tavolo».

### T6 🔴 — PDF briefing
**Click:** fascia **Cena** con prenotazione notturna (es. `03:00`) + una normale · **Home** → **Briefing turno** → modale **Briefing pre-turno** → **Turno:** Cena → **Scarica PDF**  
**Atteso:** fasce vere in tendina · colonne Orario/Cliente/Tavolo/Coperti/Note · PDF orari **identici al video** (03:00 resta 03:00) · PDF **senza** colonna Tavolo (voluto).

### T7 — Colonna Tavolo briefing
**Click:** **Briefing turno** → colonna **Tavolo** con 1 sala · crea **QA-Bis**, sposta tavolo con prenotazione · riapri briefing  
**Atteso:** 1 sala → `T2` · 2 sale → `QA-Manuale · T2` · non assegnata → `—` · elimina sala prova dopo.

### T7-bis 🔴 — Elimina tavolo T2 vs elimina sala (`FU-SERV-TURNO-SALA-1`)
**Cosa testo:** confrontare cosa succede al **conto turni** (quanti “pasti” il tavolo ha già fatto in quella fascia) se elimini un **tavolo** oppure se elimini tutta la **sala**. Oggi i due comportamenti sono diversi (incoerenza nota, fix previsto in P6).
**Come fare:**
1. Usa solo sala/tavoli **QA-Manuale**. Sulla fascia **Cena**, imposta un **tetto turni numerico** (es. 2) — se resta «Illimitata» non vedi i residui.
2. Assegna una prenotazione **Cena** al tavolo chiamato **T2** (nome del tavolo — **non** «turno 2»).
3. Per **leggere i turni residui:** apri **Assegna** su un’altra prenotazione della stessa fascia → sulle card tavolo compare «N turni residui» / «Turni esauriti». (Non compare su Lista, né nel modal matita, né al click tavolo in mappa.)
4. **Elimina il tavolo T2:** vai tab **Lista** → icona **cestino** sulla card T2 (non nel modal «Modifica tavolo») → conferma. Guarda se la prenotazione torna **da assegnare** e se il turno risulta **consumato** o no.
5. Ricrea la situazione su un altro tavolo (es. **T3**): prenotazione assegnata.
6. **Modifica sala** → bottone testo **Elimina sala** (QA) → conferma a due passaggi. Guarda di nuovo prenotazione + conto turni (di nuovo via **Assegna** se serve).
**Cosa controllare (comportamento atteso OGGI, prima del fix P6):**
- Elimina **tavolo T2**: prenotazione → **da assegnare**; turno **non** consumato.
- Elimina **sala**: prenotazione → **da assegnare**; turno **consumato** (KO di prodotto atteso oggi = debito `FU-SERV-TURNO-SALA-1`).
**Trappola:** «T2» = **nome del tavolo**, mai «secondo turno». Elimina tavolo ≠ Elimina sala (path diversi). Questa prova **non** chiede un secondo cliente in coda sullo stesso tavolo (quello è T9).

### T8 — Aggiungi tavolo a tavolata
**Cosa testo:** una prenotazione già assegnata a più tavoli può ricevere un tavolo in più dalla sezione «Assegnate».
**Come fare:**
1. **Nuova prenotazione** 10 coperti · **Assegna** tavolo **T2** + tavolo **T3** → conferma (es. «Assegna 2 tavoli»).
2. Sezione **Assegnate** → **Aggiungi tavolo** → scegli **T4**.
**Cosa controllare:**
- Prima: tipo «8 posti su 10» + avviso posti mancanti.
- Modale **Aggiungi tavolo alla tavolata**; T2/T3 risultano «Già in tavolata».
- Dopo T4: posti totali sufficienti, avviso sparisce.
**Trappola:** non confondere «aggiungi tavolo alla stessa prenotazione» con «secondo turno» di un altro cliente sullo stesso tavolo.

### T9 🔴 — Tre scelte quando il tavolo è già occupato
**Cosa testo:** se assegni la prenotazione **B** sullo stesso tavolo dove è già seduta (o assegnata) la prenotazione **A**, non deve avvenire in silenzio: si apre un riquadro ambra con **tre opzioni radio** (più Annulla). Devi provarle **tutte e tre**, una per volta.
**Come fare:**
1. Crea prenotazione **A** (stesso giorno/fascia) → **Assegna** al tavolo **T2** → conferma.
2. Crea prenotazione **B** (stesso giorno/fascia, orario che si sovrappone) → **Assegna** → **tocca di nuovo T2** (anche se risulta Occupato / In arrivo — non serve che sia «libero»).
3. Si chiude «Assegna» e compare il **riquadro ambra** sotto. In alternativa: trascina B sulla sagoma/card di T2 e **rilascia** (messaggio: «Rilascia: scegli cosa fare…»).
4. Prova **una** radio, conferma, poi **reset** (ricrea A+B) e passa alla radio successiva. Fai anche **Annulla** una volta.
**Cosa controllare — le tre radio (nomi esatti in UI):**
1. **Sposta e assegna** — sposta A su un altro tavolo libero, poi mette B su T2.
2. **Archivia e assegna** — chiude/archivia A (turno consumato), poi mette B su T2.
3. **Rimetti in attesa e assegna** — toglie A dal tavolo e la rimette tra le **da assegnare** (senza consumare il turno), poi mette B su T2.
- Campo **Motivo (opzionale)** presente.
- **Annulla** chiude senza cambiare niente.
**Trappola:** i tavoli liberi entrano in multi-selezione; l’**occupato si tocca una volta** e apre le 3 scelte (non si spunta come libero). Se dopo «libera tavolo» su una prenotazione non ancora arrivata sparisce da Servizio ma resta in Calendario, annotalo come KO.

### T10 — Responsive piantina
**Click:** **Servizio** → **Mappa** → **Servizio** · F12 **375** / **834** / **1280** · scroll piantina e pagina  
**Atteso:** piantina scorre nel riquadro · pagina **no** barra orizzontale · da `lg` sale a due colonne.

### T11 — Modifica nascosta mobile
**Click:** F12 **375** · **Servizio** → **Mappa** → **Modifica**  
**Atteso:** messaggio *«Da mobile la modifica della sala è nascosta…»* · a 834/1280 editor con **Aggiungi tavolo**.

### T12 — Legenda colori
**Click:** 4 prenotazioni con orari §0 (4 tavoli) · **Servizio** → legenda + piantina · attendi 30 s  
**Atteso:** Libero/In arrivo/Occupato/In ritardo/In uscita coerenti · leggibili a 375px · In arrivo → Occupato senza reload.

### T13 — Badge Calendario (`FU-SERV-BADGE-CASCATA-1`)
**Click:** **Calendario** → **Giorno** (badge es. «8 / 128») · **Mese** (percentuali fasce)  
**Atteso:** Giorno = posti fisici tavoli · Mese = somma cap fasce · **annota quale comportamento vuoi** (decisione prodotto P6) — non inventare verdetto.

### T14 🔴 — Classic senza Pro
**Click:** login `testc@c.com` · naviga Calendario/Prenotazioni/Archivio/Menu/Impostazioni · F12 Console  
**Atteso:** nessuna sidebar Pro · Calendario ok · **zero errori rossi** Console.

### T15 🔴 — Form Classic: prenotazione ok e oltre capienza
**Cosa testo:** sul tenant Classic, il form pubblico conferma una prenotazione valida e rifiuta una seconda oltre capienza fascia.
**Come fare:**
1. Apri una **finestra privata / in cognito** (o scheda non loggata admin).
2. Vai a `/prenota/test-classic` → invia una prenotazione valida.
3. Attendi **2–3 minuti** (anti-spam), poi invia una seconda prenotazione **oltre** la capienza della fascia.
**Cosa controllare:**
- Prima: confermata.
- Seconda: messaggio *«Questa fascia oraria è al completo…»* sul campo **Ora ***.
**Trappola:** rispetta il rate limit (invii lenti).

### T16 — Intervallo arrivo
**Click:** Pro · matita **Cena** → **Intervallo di arrivo** **15 min** → salva · F5 `/prenota/da-tommaso` → tendina · ripeti con **60 min** · rimetti valore iniziale  
**Atteso:** 15 min = step quarti d'ora · 60 min = step orari · campo **Altro** 5–120 min.

### T17 - Liberare tavoli ancora occupati
*ho riscontrato questo Bug: vedi screen " docs\Sessioni di lavoro\26-08-26\Screenshot 2026-08-26 111302.png " in questo caso avevo inserito due grandi prenotazioni che occupavano tanti tavoli. ora devo cliccare ogni singolo tavolo per liberarlo. la logica deve essere  = libero ristorante dalla prenotazione, e di conseguenza libero tutti i tavoli assegnati alla prenotazione. nond evo liberare ogni singolo tavolo.*
---

## 4. Esiti

Per ogni prova (0-bis, V#, T#):

```
T4 — OK
T9 — KO: "Sposta e assegna" — cliente A rimasto anche su T2.
T7-bis — KO: elimina sala ha consumato turno (atteso oggi, fix P6).
```

Se **KO**: schermata + sequenza esatta — non correggere da solo.

---

## 5. Non rifare (WP1 istanza 1 — 25-08-26)

| Copertura | Cosa |
|---|---|
| **257 Vitest** + **5 createUpdate** | Hook sale/tavoli/slot/walk-in/stati, `ServizioPage.*`, `AssignmentMapPanel.*` |
| **6 E2E** `pro-service.spec.ts` | Smoke, modali responsive 375/834/1280, fasce duplicato/overlap |
| **13 E2E** `pro-service-tables-lifecycle.spec.ts` | Stati, fine turno, multi-tavolo, walk-in occupato, turni esauriti, delete tavolo, fascia chiusa→pubblico |

| Argomento già dimostrato | Dove |
|---|---|
| Toggle Servizio/Modifica, editor mappa | `ServizioPage.dueViste.test.tsx` |
| Click tavolo occupato → Libera tavolo | `pro-service-tables-lifecycle.spec.ts:1000` |
| Fine turno (Libero, Ancora occupato, Decido dopo, cambio fascia) | stessa spec `:616–854` |
| 5 stati + timer 30 s | `:1152–1212` |
| Turni esauriti, tavolata multi, Annulla | `:487–1138` |
| Walk-in occupato, doppia conferma | `:349–481` |
| Chiudi fascia → cliente non vede | `:283–343` |
| Delete tavolo occupato → da assegnare | `:211–281` |
| Pulsanti fine turno 375px | `:1272–1334` |
| Modali responsive (sala/tavolo/walk-in/briefing/assegna) | `pro-service.spec.ts:241–352` |
| Form Classic buono/oltre cap (se T15 OK) | `public-booking-classic.spec.ts` |
| Briefing unit (fasce, join tavoli — non PDF) | `useShiftBriefing.test.tsx` |
| D38 logica, limite walk-in unit, guard discard unit | `useCapacityCheck`, `walkIn.b2`, `servizioModalsGuard` |

Dettaglio completo: [`Report-wp1-istanza1-servizio-blindatura-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Report-wp1-istanza1-servizio-blindatura-25-08-26.md).

---

## Appendix — voci obsolete

| Voce storica | Sostituto |
|---|---|
| «Libera e assegna» singola | **T9** tre scelte |
| Colore piantina = elenco | Lista senza colori — skip |
| Badge % sempre posti locale | **T13** decisione |
| Buffer riassetto 10 min | Default DB **0** (§0) |
| Walk-in solo coperti | Ritirato — **T3** / **V4** |
| Manopole da admin | Non in UI — nota §0 |
