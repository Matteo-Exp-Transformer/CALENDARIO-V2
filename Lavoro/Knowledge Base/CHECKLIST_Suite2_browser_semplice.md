# Checklist Suite 2 — “Tutto il percorso admin e il form cliente”

Guida in linguaggio semplice. Se apri gli strumenti del browser (**F12**), usa le schede **Console** (messaggi e avvisi) e **Rete** (chiamate al server).

**File nella stessa cartella (`Lavoro/Knowledge Base/`):**

- **`Utenti per test.md`** — credenziali e account di prova.
- **`Guida.md`** — contesto operativo e procedure lunghe.
- **`dati db calendario V.2.txt`** — appunti / export dati DB (placeholder se vuoto).
- **`PROMPT_plan_UI_impostazioni_ristorante.md`** — prompt per un agente che deve pianificare la UI **Impostazioni** (S2.9).
- **`PROMPT_plan_UI_menu_ingredienti_admin.md`** — prompt per un agente che deve pianificare la UI **menu / listino** admin (S2.10).

Aggiorna la **tabella stato** sotto a fine sessione, così si vede subito cosa resta da fare.

### Legenda stato

| Simbolo | Significato |
|--------|-------------|
| ✅ | Testato in QA, esito ok (o problema risolto e riverificato). |
| 🟡 | Parziale: flusso UI ok ma manca verifica accessoria (es. screenshot). |
| ⏳ | Non ancora eseguito / da rifare dopo modifiche importanti. |
| **N/A** | Non applicabile o bloccato da **limite piano** / **mancanza UI** — vedi colonna note. |

### Stato test (aggiorna data dopo ogni giro)

*Ultimo aggiornamento tabella: 2026-05-07 (fix form pubblico + Edge `create-booking` + checklist)*

| Codice | Argomento | Stato | Note brevi |
|--------|-----------|-------|------------|
| — | Prima di partire (dev locale) | ✅ | `npm run dev`, `localhost:5173` usati in QA. |
| S2.1 | Login admin, console “pulita” | ✅ | Nessun blocco post-login evidente. |
| S2.2 | Dashboard / Rete senza 403 su booking | ✅ | |
| Extra A | Isolamento tenant (admin A vs B) | ✅ | Admin B vede solo dati tenant B. |
| Extra B | Tipologia con **menu / ingredienti** (riepilogo → calendario → dettaglio) | ✅ | Esempio **Rinfresco di Laurea** (*Tipologia di Prenotazione*): menu visibile, scelte ingredienti, **prezzo e riepilogo** corretti; su calendario e in **modale dettaglio** dopo inserimento tutto coerente. |
| S2.3 | Creare prenotazione da admin | ✅ | Vedi anche riga “Tipologia con menu” per percorso con ingredienti e prezzo in riepilogo. |
| S2.4 | Modificare prenotazione esistente | ✅ | Fix `client_email` null; salvataggio ok. |
| S2.5 | Accettare richiesta pending (+ traccia in `email_logs`) | ✅ | UI ok. **DB (MCP):** per tenant A compaiono righe `email_type = booking_accepted` con `booking_id`; `status` può essere `failed` se l’invio SMTP/Resend non è configurato — conta la **traccia** in tabella. |
| S2.6 | Rifiutare richiesta **pending** | ✅ | **Rifiuta** su richiesta in attesa: messaggio di **rifiuto** corretto; la richiesta finisce correttamente in **archivio** (non resta in pending). |
| S2.7 | **Eliminare** prenotazione accettata (dal calendario) | ✅ | Nel pannello l’azione è **eliminazione** / rimozione dal calendario, non “annullamento” (termine fuorviante qui). QA: eliminazione riuscita. |
| S2.8 | Test email manuale dal pannello | **N/A** | Invio da browser **disattivato di default** (`VITE_ENABLE_SEND_EMAIL` ≠ `true`): senza Edge **`send-email`** si evitano errori in console. Per provare: `VITE_ENABLE_SEND_EMAIL=true` + funzione deployata. |
| S2.9 | Impostazioni ristorante (persistenza) | ⏳ | **Manca UI** dedicata per l’operatore: usare il prompt **`PROMPT_plan_UI_impostazioni_ristorante.md`** per un piano di modifica. |
| S2.10 | Menu / listino CRUD | ⏳ | CRUD solo da Supabase; **prompt piano UI:** **`PROMPT_plan_UI_menu_ingredienti_admin.md`**. |
| S2.11 | Elenco email solo del proprio tenant | **N/A** | **Schermata non presente** in UI; rinviare dopo eventuale pagina “Log email”. |
| S2.12 | Logout pulito | ✅ | Esci → login senza errori. |
| S2.13 | Rientro dopo logout | ✅ | Rilogin admin A: calendario e dettagli ok. |
| S2.14 | Form pubblico `/prenota/...` | 🟡 | Default **“Prenota un tavolo (senza menù)”**; **Rinfresco** opzionale dal menu a tendina. Fix tecnici: **`create-booking`** ridistribuita con JWT gateway disattivato + header **`apikey`**; **`restaurant_settings`** lettura con `maybeSingle` (niente 406 se manca `business_hours`). **Da riverificare** tu in browser (POST 201, niente 401). |

---

## Prima di partire

1. Avvia il sito in locale: nel terminale del progetto, `npm run dev`, poi apri **http://localhost:5173**
2. Usa l’account **admin del ristorante A** (`admin.a.rls@example.com` + password nel file utenti).
3. Per il test “come fosse un cliente”, alla fine userai una **finestra in incognito** (così non sei loggato come admin).

---

## S2.1 — Entrare nel pannello senza “spie strane”

1. Vai su **Login** e accedi con admin A.
2. Apri la **Console** (F12 → scheda Console).
3. Controlla che **non** compaiano:
   - messaggi che parlano di **più sessioni / GoTrue / client duplicato**;
   - errori rossi legati a **403** o **401** proprio dopo il login;
   - parole tipo **set_tenant** (vecchio sistema).
4. Scheda **Rete**: dopo il login dovresti vedere richieste “andate bene” (codice **200** verso login e verso il controllo email admin), non una catena di errori.

**In pratica:** se la schermata admin si apre e la console è “pulita” o quasi, va bene.

---

## S2.2 — La dashboard si carica senza blocchi

1. Resta nella **dashboard** dopo il login (calendario / schede).
2. Scheda **Rete**: cerca richieste verso **booking** (prenotazioni).  
   **Non** devono comparire righe in rosso con codice **403** (vietato).

**In pratica:** se vedi le prenotazioni (anche lista vuota) e niente “vietato”, ok.

---

## Verifica due ristoranti (isolamento — consigliata dopo S2.2)

Serve a capire che ogni account vede **solo il suo locale**, come in un gestionale con più sedi separate.

1. Clicca **Esci** e torna alla schermata di **login**.
2. Accedi con **`admin.b.rls@example.com`** (password in **`Utenti per test.md`**): è l’admin del **secondo ristorante di prova** (tenant B).
3. Guarda **calendario** e **liste** prenotazioni: devi vedere **solo** le cose del ristorante B.
4. Controlla che **non** compaiano le prenotazioni che avevi visto come admin A (primo ristorante).
5. **Esito QA confermato:** con l’account B si vedono solo i dati del tenant B, non quelli del tenant A — segno che il **blocco tra un locale e l’altro** funziona anche dall’interfaccia, non solo “dietro le quinte”.

Poi puoi uscire di nuovo e rientrare con **admin A** per continuare il resto della checklist.

---

## S2.3 — Creare una prenotazione “dal ristorante”

1. Dal pannello admin, usa il flusso per **aggiungere una prenotazione** (form / modale che usi di solito per inserire a mano una prenotazione).
2. Compila con dati inventati ma credibili (nome, data, ospiti…), invia.
3. La nuova voce deve **comparire in calendario** o nel dettaglio.
4. *(Se usi Rete)*: subito dopo l’invio c’è una richiesta che **crea** la prenotazione; deve andare a buon fine (**201** = creato). Nel “corpo” inviato ci deve essere anche il **tenant** del tuo ristorante (non serve che lo leggi a mano: se l’app funziona, c’è).

**In pratica:** come se telefonasse il titolare e tu registrassi la prenotazione: deve restarci traccia subito.

**Esito QA (tipologia con menu):** con **Tipologia di Prenotazione** (es. *Rinfresco di Laurea*): compare il **menu**; selezionando **ingredienti**, nel **riepilogo scelte** risultano **prezzo** e **voci scelte** corrette. Dopo l’inserimento, sul **calendario** la prenotazione mostra il menu in modo corretto e, cliccando per il **dettaglio**, ingredienti e riepilogo restano allineati a quanto scelto in fase di creazione.

---

## S2.4 — Modificare una prenotazione già in elenco

1. Apri una prenotazione esistente nei **dettagli**.
2. Cambia qualcosa di semplice: ad esempio **numero di ospiti** o una nota.
3. Salva / conferma.
4. Controlla che il valore sia **aggiornato** senza dover ricaricare tutta la pagina a mano.

**In pratica:** piccola correzione al tavolo: deve restare salvata.

---

## S2.5 — Accettare una richiesta “in attesa” (e mail tracciata)

1. Ti serve una prenotazione in stato **in attesa** (pending). Se non ce n’è, chiedila dal **form pubblico** (vedi S2.14) oppure usa una che hai già in elenco.
2. Nella scheda delle **richieste in attesa**, premi **Accetta**.
3. Scheda **Rete**: dovresti vedere un aggiornamento della prenotazione andato a buon fine; potrebbe esserci anche un invio verso **send-email** (se l’email non è configurata, può fallire l’invio ma **non** deve “rompere” tutto il pannello).
4. In Supabase, tabella **email_logs**: deve esserci una **nuova riga** legata al tuo ristorante, con `email_type` coerente (es. **`booking_accepted`**), collegata al `booking_id`. Il campo **`status`** può essere `failed` se l’SMTP non è configurato: per la checklist conta che la **riga esista** (traccia dell’evento).
5. **Console:** niente errori rossi sul salvataggio dei log email.

**In pratica:** sì alla prenotazione del cliente → nel registro email del sistema deve comparire una traccia.

**Verifica agente (DB):** su progetto di test risultano righe `booking_accepted` per `tenant_id` del ristorante A (`1de53854-4cbe-4065-9dbd-1ae84cac4f6d`) con `booking_id` valorizzato; invio reale può fallire senza provider.

**Nota:** una volta accettata, la richiesta **non** resta tra le “in attesa”: diventa **accettata** e, con data e orario confermati, **compare nel calendario** nel giorno/slot giusti. Puoi rivederla anche dall’**archivio**: calendario e archivio sono due modi di consultare le stesse prenotazioni accettate, non si escludono a vicenda.

---

## S2.6 — Rifiutare una richiesta in attesa

1. Come sopra, ma con un’altra richiesta pending: usa **Rifiuta**.
2. In **email_logs** cerca una riga coerente con **rifiuto** (tipo rifiutata).

**In pratica:** “non possiamo” → deve restare memoria nell’email log.

**Esito QA confermato:** richiesta in stato **pending**, azione **Rifiuta**: il **messaggio di rifiuto** in UI è quello atteso; la richiesta **non** resta tra le in attesa e compare correttamente nell’**archivio** (flusso rifiuto → archivio verificato).

---

## S2.7 — Eliminare una prenotazione già accettata (dal calendario)

1. Prendi una prenotazione **già accettata** e visibile sul **calendario**.
2. Usa l’azione di **eliminazione** / **rimozione** prevista dal pannello (etichetta tipo **Elimina**, **Rimuovi**, ecc. — non confondere con “annulla”, che in altri contesti significa solo chiudere un modale senza salvare).
3. Verifica **email_logs** per un evento legato alla **cancellazione** / rimozione, se il flusso invia notifiche.

**In pratica:** la prenotazione confermata viene **tolta dal calendario** (eliminata dal gestionale secondo le regole del prodotto), con esito chiaro in interfaccia.

**Esito QA confermato:** eliminazione da calendario su prenotazione accettata **completata con successo**.

---

## S2.8 — Prova email manuale dal pannello

1. Apri la finestra/modal di **test email** (dove mandi una prova a un indirizzo).
2. Metti una tua email di prova e invia.
3. In **email_logs** deve comparire una riga “manuale” / prova, legata al **tuo** ristorante, **senza** id prenotazione se è solo un test.

**In pratica:** come premere “mandami una email di prova” e vedere che il sistema la annota.

---

## S2.9 — Impostazioni del ristorante (salvare qualcosa)

1. Vai nella scheda **Impostazioni** (o simile).
2. Cambia un valore che si salva davvero (es. qualcosa sugli **orari** o un testo visibile ai clienti, se previsto).
3. Salva e ricarica la pagina: il valore deve **restare**.

**In pratica:** modifichi “orario di apertura” e dopo il refresh è ancora quello nuovo.

---

## S2.10 — Menu / listino (crea — cambia — elimina)

1. Apri la gestione **prezzi menu** / voci menu.
2. **Aggiungi** una voce (nome + prezzo).
3. **Modifica** il prezzo.
4. **Elimina** la voce di prova (così non lasci sporcizia).

**In pratica:** come aggiornare il listino stagionale senza che il sistema si blocchi.

---

## S2.11 — Elenco email inviate (solo del mio locale)

1. Apri il visualizzatore **log email** dal pannello.
2. Controlli che compaiano **solo** messaggi del **tuo** ristorante (non di un altro tenant).  
   Anche senza capire il filtro tecnico: se vedi solo “cose tue”, va bene.

**In pratica:** registro lettere della tua attività, non del vicino.

---

## S2.12 — Uscire dal pannello in modo pulito

1. Clicca **Esci** / logout.
2. Devi tornare al **login**.
3. *(Opzionale F12)* → **Applicazione** → **Memoria locale**: non deve restare la sessione admin “grande” tipica Supabase; la chiave pubblica **no-session** può non esserci o non essere usata — non è un problema se non vedi nulla di sospetto.

**In pratica:** chiudi il negozio e la chiave non resta infilata nella serratura.

---

## S2.13 — Rientrare dopo essere uscito

1. Fai di nuovo **login** con le stesse credenziali admin A.
2. Dashboard, calendario e modifiche devono funzionare come prima (S2.1–S2.4), senza errori strani.

**In pratica:** secondo turno di lavoro, tutto deve partire senza impazzire.

---

## S2.14 — Il cliente prenota dal sito (senza essere admin)

1. Apri una **finestra in incognito**.
2. Vai su **http://localhost:5173/prenota/al-ritrovo** (slug del ristorante di test A).
3. Sotto **Tipologia di Prenotazione**, scegli **“Prenota un tavolo (senza menù)”** oppure **“Rinfresco di Laurea”** se vuoi testare menù e ingredienti.
4. Compila il modulo come un cliente (telefono obbligatorio; privacy se richiesta), invia.
5. Scheda **Rete**: `POST .../functions/v1/create-booking` → **201** (non **401**). Eventuale GET `restaurant_settings` non deve più dare **406** se manca la riga orari (il client usa lettura “0 o 1 riga”).
6. In Supabase, la nuova riga in **`booking_requests`** deve essere **pending**, **booking_source** pubblico, **tenant** dello slug.
7. **Console:** niente errori rossi sull’invio.

**In pratica:** amico che prenota dal cellulare → richiesta arriva in coda senza password admin; può essere solo tavolo o menù completo.

---

## Cosa tenere come prova (facoltativo ma utile)

- 1 screenshot dopo **accettazione** (S2.5).
- 1 screenshot del **form pubblico** compilato o della conferma (S2.14).

---

## Se qualcosa non va

- **403** ovunque in dashboard → problema permessi / sessione; controlla di essere **admin.a** e che l’email sia in **admin_users**.
- **Prenotazione admin non si crea** → era legato ai contatori DB: in repo c’è la migrazione **003** sui trigger (dovrebbe essere già applicata sul progetto di test).
- **Email sempre in errore** → può essere normale se Resend non è configurato; importante che **email_logs** registri comunque il tentativo.
- **401 su `create-booking`** (form pubblico) → la funzione va pubblicata con **JWT verification disattivata** per questo endpoint (solo chiave anon + `apikey` nel client). In repo: `supabase/config.toml` sezione `[functions.create-booking]` e comando deploy `npx supabase functions deploy create-booking --project-ref <REF> --no-verify-jwt`.
- **500 su `create-booking`** con email lasciata vuota → fino al fix `8ef077c` si poteva inviare `client_email: null` mentre il DB richiede **NOT NULL**; ora si normalizza a stringa vuota `''`. Se persiste, controllare i log Edge in dashboard.
- **406 su `restaurant_settings?...business_hours`** → spesso assenza di riga unica: il client ora usa **`maybeSingle()`**; opzionale creare riga `business_hours` per il tenant in Supabase.

---

## Istruzioni rapide (dopo aggiornamento codice 2026-05-07)

1. **Pull** del repo, `npm install` se serve, `npm run dev`.
2. **Form pubblico:** incognito → `/prenota/al-ritrovo` → prova prima **solo tavolo**, poi **Rinfresco** con ingredienti; in Rete verifica **201** su `create-booking`.
3. **S2.9 / S2.10:** incolla in un nuovo chat agente il contenuto dei file **`PROMPT_plan_UI_impostazioni_ristorante.md`** e **`PROMPT_plan_UI_menu_ingredienti_admin.md`** (uno alla volta) per ottenere piani di implementazione.
4. **Deploy Edge** (se crei un nuovo progetto Supabase): non dimenticare `--no-verify-jwt` su `create-booking` per il traffico anonimo del sito pubblico.

Fine checklist.
