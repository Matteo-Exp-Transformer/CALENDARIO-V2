# Checklist Suite 2 — “Tutto il percorso admin e il form cliente”

Guida in linguaggio semplice. Se apri gli strumenti del browser (**F12**), usa le schede **Console** (messaggi e avvisi) e **Rete** (chiamate al server).

**File nella stessa cartella (`Lavoro/Knowledge Base/`):**

- **`Utenti per test.md`** — credenziali e account di prova.
- **`Guida.md`** — contesto operativo e procedure lunghe.
- **`dati db calendario V.2.txt`** — appunti / export dati DB (placeholder se vuoto).

Aggiorna la **tabella stato** sotto a fine sessione, così si vede subito cosa resta da fare.

### Legenda stato

| Simbolo | Significato |
|--------|-------------|
| ✅ | Testato in QA, esito ok (o problema risolto e riverificato). |
| 🟡 | Parziale: flusso UI ok ma manca verifica accessoria (es. riga in `email_logs`, screenshot). |
| ⏳ | Non ancora eseguito / da rifare dopo modifiche importanti. |

### Stato test (aggiorna data dopo ogni giro)

*Ultimo aggiornamento tabella: 2026-05-04*

| Codice | Argomento | Stato | Note brevi |
|--------|-----------|-------|------------|
| — | Prima di partire (dev locale) | ✅ | `npm run dev`, `localhost:5173` usati in QA. |
| S2.1 | Login admin, console “pulita” | ✅ | Nessun blocco post-login evidente. |
| S2.2 | Dashboard / Rete senza 403 su booking | ✅ | |
| Extra | Isolamento tenant (admin A vs B) | ✅ | Admin B vede solo dati tenant B. |
| S2.3 | Creare prenotazione da admin | ✅ | |
| S2.4 | Modificare prenotazione esistente | ✅ | Fix `client_email` null; salvataggio ok. |
| S2.5 | Accettare richiesta pending (+ traccia email) | 🟡 | Flusso accettazione e calendario ok; controllare in Supabase **`email_logs`** se serve prova completa. |
| S2.6 | Rifiutare richiesta | ⏳ | |
| S2.7 | Annullare prenotazione accettata | ⏳ | |
| S2.8 | Test email manuale dal pannello | ⏳ | |
| S2.9 | Impostazioni ristorante (persistenza) | ⏳ | |
| S2.10 | Menu / listino CRUD | ⏳ | |
| S2.11 | Elenco email solo del proprio tenant | ⏳ | |
| S2.12 | Logout pulito | ⏳ | |
| S2.13 | Rientro dopo logout | ⏳ | |
| S2.14 | Form pubblico `/prenota/...` | ⏳ | |

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
4. In Supabase, tabella **email_logs**: deve esserci una **nuova riga** legata al tuo ristorante, tipo “prenotazione accettata”, con riferimento alla prenotazione.
5. **Console:** niente errori rossi sul salvataggio dei log email.

**In pratica:** sì alla prenotazione del cliente → nel registro email del sistema deve comparire una traccia.

**Nota:** una volta accettata, la richiesta **non** resta tra le “in attesa”: diventa **accettata** e, con data e orario confermati, **compare nel calendario** nel giorno/slot giusti. Puoi rivederla anche dall’**archivio**: calendario e archivio sono due modi di consultare le stesse prenotazioni accettate, non si escludono a vicenda.

---

## S2.6 — Rifiutare una richiesta in attesa

1. Come sopra, ma con un’altra richiesta pending: usa **Rifiuta**.
2. In **email_logs** cerca una riga coerente con **rifiuto** (tipo rifiutata).

**In pratica:** “non possiamo” → deve restare memoria nell’email log.

---

## S2.7 — Annullare una prenotazione già accettata

1. Prendi una prenotazione **già accettata**.
2. Usa **Annulla** (o azione equivalente nel pannello).
3. Verifica **email_logs** per un evento tipo **cancellazione**.

**In pratica:** cliente cancella dopo il sì → traccia nel registro.

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
3. Compila il modulo come un cliente (nome, email, data, persone…), invia.
4. Scheda **Rete**: l’invio della prenotazione deve andare a buon fine (risposta di **successo**; tecnicamente spesso è “201 creato”).
5. In Supabase, la nuova riga deve essere **dal pubblico**, in **attesa** (pending), del **ristorante giusto**.
6. **Console:** niente avvisi strani tipo “due client Supabase”.

**In pratica:** amico che prenota dal cellulare → richiesta arriva in coda senza che debba avere password admin.

---

## Cosa tenere come prova (facoltativo ma utile)

- 1 screenshot dopo **accettazione** (S2.5).
- 1 screenshot del **form pubblico** compilato o della conferma (S2.14).

---

## Se qualcosa non va

- **403** ovunque in dashboard → problema permessi / sessione; controlla di essere **admin.a** e che l’email sia in **admin_users**.
- **Prenotazione admin non si crea** → era legato ai contatori DB: in repo c’è la migrazione **003** sui trigger (dovrebbe essere già applicata sul progetto di test).
- **Email sempre in errore** → può essere normale se Resend non è configurato; importante che **email_logs** registri comunque il tentativo.

Fine checklist.
