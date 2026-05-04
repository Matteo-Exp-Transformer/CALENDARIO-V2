# 📖 Guida: Come avviare il progetto in locale
### Sistema di prenotazioni per ristoranti — Versione 2.0
> Questa guida è scritta per chi non ha mai usato un terminale o lavorato con codice. Ogni passaggio è spiegato passo per passo, senza dare nulla per scontato.

---

## Prima di iniziare: cosa ci serve?

Per far girare questo progetto sul tuo computer hai bisogno di installare due programmi e creare un account gratuito online. Niente panico — ci vogliono circa 15-20 minuti in totale.

Ecco la lista di cose da fare, nell'ordine giusto:

- [ ] Installare **Node.js** (il motore che fa girare il progetto)
- [ ] Installare **Git** (lo strumento per gestire il codice — serve solo per il download iniziale)
- [ ] Creare un account su **Supabase** (il database gratuito dove vengono salvati i dati)
- [ ] Configurare il database con le tabelle necessarie
- [ ] Collegare il progetto al database
- [ ] Avviare il progetto

---

## Passo 1 — Installare Node.js

💡 **Cos'è Node.js?** Immagina che il tuo progetto sia una ricetta. Node.js è il forno: senza di lui, non puoi cuocere niente. È un programma che permette al tuo computer di "eseguire" il codice di questo sito.

**Come installarlo:**

1. Vai su questo indirizzo nel tuo browser: **https://nodejs.org/it**
2. Vedrai due pulsanti verdi. Clicca su quello scritto **"LTS"** (è la versione più stabile e consigliata).
3. Scarica il file `.msi` (è un installer classico di Windows).
4. Aprilo e clicca sempre **"Avanti"** / **"Next"** fino alla fine. Non cambiare niente. ✅
5. Al termine, clicca **"Fine"** / **"Finish"**.

**Come verificare che sia installato correttamente:**

Apri il terminale (vedi Passo 7 per come aprirlo) e scrivi questo comando, poi premi **Invio**:

```
node --version
```

Se vedi una risposta tipo `v22.x.x` o simile, Node.js è installato correttamente. ✅

---

## Passo 2 — Installare Git

💡 **Cos'è Git?** È un sistema che tiene traccia delle modifiche al codice nel tempo. È come una macchina del tempo per il tuo progetto. Probabilmente lo hai già installato — proviamo a verificarlo prima.

**Verifica se Git è già installato:**

Apri il terminale e digita:

```
git --version
```

Se vedi qualcosa tipo `git version 2.x.x`, è già installato — salta direttamente al Passo 3. ✅

**Se invece vedi un errore**, installalo così:

1. Vai su: **https://git-scm.com/download/win**
2. Il download parte in automatico. Apri il file scaricato.
3. Clicca **"Next"** su tutte le schermate senza cambiare nulla.
4. Alla fine clicca **"Install"** e poi **"Finish"**. ✅

---

## Passo 3 — Creare un account Supabase gratuito

💡 **Cos'è Supabase?** È come un cassetto digitale su internet dove vengono salvati tutti i dati del tuo sistema (prenotazioni, clienti, impostazioni). Il piano gratuito è più che sufficiente per iniziare.

**Come creare l'account:**

1. Vai su: **https://supabase.com**
2. Clicca sul pulsante **"Start your project"** (o "Sign Up").
3. Puoi registrarti con il tuo **account GitHub** (comodo se ce l'hai) oppure con la tua **email e password**.
4. Conferma la tua email se richiesto. ✅

---

## Passo 4 — Creare un nuovo progetto Supabase

⚠️ **Attenzione:** questo passaggio è importante. Segui ogni punto con cura.

1. Una volta dentro Supabase, clicca su **"New project"** (bottone verde o blu in alto).
2. Scegli la tua **organizzazione** (di solito è il tuo nome — è già selezionata).
3. Compila i campi:
   - **Name**: scrivi un nome a tua scelta, ad esempio `ristorante-booking`
   - **Database Password**: clicca su **"Generate a password"** per crearne una sicura automaticamente. ⚠️ **Salvala da qualche parte!** Ti servirà in futuro.
   - **Region**: scegli **"West EU (Ireland)"** o la più vicina a te.
4. Clicca **"Create new project"**.
5. Aspetta circa 1-2 minuti mentre Supabase prepara tutto. Vedrai una barra di caricamento. ☕

Quando la barra scompare e vedi la schermata del progetto, sei pronto. ✅

---

## Passo 5 — Configurare il database

💡 **Cosa stiamo facendo?** Il cassetto (Supabase) è vuoto. Ora dobbiamo creare i "cassettini" interni — le tabelle dove verranno salvati i dati (prenotazioni, menu, organizzazioni, ecc.).

Dobbiamo eseguire un file speciale che crea tutto in automatico. Ecco come fare:

**5.1 — Apri il file SQL del progetto**

Sul tuo computer, vai nella cartella del progetto `CalendarBackup-v2` e poi apri la sottocartella:

```
CalendarBackup-v2 → supabase → migrations → 001_schema_completo.sql
```

Apri questo file con un qualsiasi editor di testo (va bene anche il Blocco Note di Windows). Seleziona **tutto il testo** con la scorciatoia `Ctrl + A`, poi copialo con `Ctrl + C`.

**5.2 — Vai sull'SQL Editor di Supabase**

1. Torna su Supabase nel browser.
2. Nel menu a sinistra, clicca su **"SQL Editor"** (l'icona sembra un foglio con una spunta).
3. Clicca su **"New query"** (nuova query) in alto.
4. Vedrai un grande riquadro bianco vuoto. Clicca dentro e incolla il testo copiato con `Ctrl + V`.
5. Clicca il pulsante verde **"Run"** (o premi `Ctrl + Invio`).
6. In basso vedrai apparire messaggi. Se tutto è andato bene, troverai scritto **"Success"** o simile. ✅

⚠️ **Se vedi un messaggio rosso di errore**, leggi il testo — potrebbe indicare che alcune tabelle esistono già (se hai già eseguito lo script in precedenza). In questo caso non è un problema.

---

## Passo 6 — Inserire la prima organizzazione (il tuo ristorante)

💡 **Cosa stiamo facendo?** Il sistema supporta più ristoranti. Dobbiamo aggiungere il primo — il tuo. Questo si fa con una piccola istruzione SQL nell'SQL Editor.

1. Torna sull'**SQL Editor** di Supabase.
2. Clicca su **"New query"** per aprire un foglio pulito.
3. Copia e incolla questo testo nel riquadro:

```sql
INSERT INTO organizations (name, slug, plan)
VALUES ('Nome del Tuo Ristorante', 'nome-ristorante', 'starter');
```

4. **Prima di cliccare Run**, sostituisci i valori placeholder:
   - `Nome del Tuo Ristorante` → scrivi il nome reale del ristorante (es. `Al Ritrovo`)
   - `nome-ristorante` → scrivi un identificativo breve, tutto minuscolo, senza spazi (usa i trattini al posto degli spazi). Es: `al-ritrovo`. ⚠️ Questo valore sarà parte dell'URL pubblico del form di prenotazione.

**Esempio completo:**
```sql
INSERT INTO organizations (name, slug, plan)
VALUES ('Al Ritrovo', 'al-ritrovo', 'starter');
```

5. Clicca **"Run"**. ✅

💡 **Nota:** dopo l'inserimento, puoi vedere l'organizzazione creata aprendo la sezione **"Table Editor"** nel menu a sinistra di Supabase, poi cliccando sulla tabella `organizations`.

---

## Passo 7 — Creare il file .env.local (le "chiavi" per connettersi al database)

💡 **Cos'è il file .env.local?** È un file speciale che contiene le credenziali segrete per collegare il progetto al tuo database Supabase. È come il codice PIN del tuo cassetto. Non viene mai condiviso su internet.

**7.1 — Trova le chiavi su Supabase**

1. Vai su Supabase nel browser.
2. Nel menu in basso a sinistra, clicca su **"Project Settings"** (l'icona dell'ingranaggio ⚙️).
3. Nel sotto-menu che appare, clicca su **"API"**.
4. Vedrai due valori importanti:
   - **Project URL** — è un indirizzo tipo `https://abcdefghij.supabase.co`
   - **anon public** (sotto la sezione "Project API keys") — è una stringa lunga tipo `eyJhbGciOiJIUzI1NiIs...`

Tienili a portata di mano (puoi copiarli in un blocco note temporaneo). ✅

**7.2 — Crea il file .env.local**

1. Vai nella cartella del progetto `CalendarBackup-v2` sul tuo computer.
2. Cerca il file chiamato **`.env.example`**. ⚠️ Se non lo vedi, potrebbe essere nascosto: su Windows, apri la cartella in Esplora File, clicca su "Visualizza" in alto e abilita "Elementi nascosti".
3. Fai clic destro su `.env.example` → **Copia**, poi **Incolla** nella stessa cartella.
4. Rinomina la copia da `.env.example` a **`.env.local`** (rimuovi "example" e metti "local").
5. Apri `.env.local` con il Blocco Note (clic destro → "Apri con" → Blocco Note).
6. Vedrai queste due righe:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

7. Sostituisci i valori con quelli che hai copiato da Supabase:
   - Sostituisci `https://your-project-ref.supabase.co` con il tuo **Project URL**
   - Sostituisci `your-anon-key-here` con la tua chiave **anon public**

8. Salva il file con `Ctrl + S`. ✅

Il risultato finale sarà qualcosa del tipo:
```
VITE_SUPABASE_URL=https://abcdefghij.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Passo 8 — Aprire il terminale nella cartella del progetto

💡 **Cos'è il terminale?** È una finestra nera (o scura) dove puoi dare istruzioni al computer scrivendo testo. Non devi avere paura — farai cose semplici e ti dirò esattamente cosa scrivere.

**Come aprire il terminale nella cartella giusta su Windows:**

1. Apri **Esplora File** (la cartella gialla nella barra in basso).
2. Naviga fino alla cartella `CalendarBackup-v2`.
3. Clicca nella **barra degli indirizzi** in alto (dove c'è scritto il percorso della cartella, tipo `C:\Users\...`). Il testo diventerà selezionato.
4. Digita `powershell` e premi **Invio**.
5. Si aprirà una finestra blu scura: è il terminale, già posizionato nella cartella giusta. ✅

In alternativa, puoi fare **clic destro** dentro la cartella (su uno spazio vuoto) e scegliere **"Apri nel terminale"** o **"Apri finestra PowerShell qui"**.

---

## Passo 9 — Installare le dipendenze

💡 **Cosa stiamo facendo?** Il progetto ha bisogno di molti pezzi aggiuntivi per funzionare (librerie, componenti, strumenti). Questo comando li scarica e installa tutti in automatico. È come fare la spesa prima di cucinare: il progetto ha la ricetta, ma gli ingredienti vanno scaricati.

Nel terminale aperto nel passo precedente, scrivi questo comando e premi **Invio**:

```
npm install
```

⏳ Aspetta. Il processo può durare dai 30 secondi a qualche minuto, a seconda della velocità della tua connessione. Vedrai scorrere molte righe di testo — è normale.

Quando il terminale smette di scrivere e torna al cursore lampeggiante, è finita. ✅

⚠️ **Se vedi degli avvisi gialli** (`warn`), non preoccuparti — non sono errori.  
⚠️ **Se vedi degli errori rossi** (`error`), vai alla sezione "Se qualcosa non funziona" in fondo a questa guida.

---

## Passo 10 — Avviare il progetto

Ora il momento che aspettavi! Avvia il progetto con questo comando:

```
npm run dev
```

Vedrai apparire nel terminale qualcosa di simile a:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

💡 **Cosa significa?** Il tuo sito sta girando sul tuo computer, raggiungibile all'indirizzo `http://localhost:5173/`. "localhost" significa "questo computer", non è su internet.

**Per aprire il sito:**

1. Apri il tuo browser preferito (Chrome, Firefox, Edge…).
2. Nella barra degli indirizzi, scrivi: **http://localhost:5173**
3. Premi **Invio**. ✅

---

## Passo 11 — Cosa vedrai

Quando il sito si apre, verrai reindirizzato automaticamente alla **pagina di login**.

🖥️ **Schermata di login:** vedrai un form con i campi "Email" e "Password". Questo è il pannello di accesso per gli amministratori.

💡 **Come faccio ad accedere?** Per il primo accesso devi creare un utente admin. Ecco come fare:

1. Torna su **Supabase** nel browser.
2. Nel menu a sinistra, clicca su **"Authentication"** → **"Users"**.
3. Clicca su **"Add user"** → **"Create new user"**.
4. Inserisci un'email (quella che userai per accedere) e una password.
5. Clicca **"Create user"**. ✅
6. Poi torna nell'**SQL Editor** e aggiungi questo utente alla tabella degli admin:

```sql
INSERT INTO admin_users (tenant_id, email, name)
VALUES (
  (SELECT id FROM organizations WHERE slug = 'nome-ristorante'),
  'tua@email.com',
  'Il Tuo Nome'
);
```

Sostituisci `nome-ristorante` con lo slug che hai usato nel Passo 6, `tua@email.com` con la tua email e `Il Tuo Nome` con il tuo nome. Poi clicca **"Run"**.

7. Torna nel browser su `http://localhost:5173` e accedi con le credenziali appena create. ✅

**Cosa vedrai dopo il login:** la **dashboard admin** con il calendario delle prenotazioni, le statistiche e il menu di navigazione.

**Il form pubblico di prenotazione** (quello che vedono i clienti) è accessibile all'indirizzo:
```
http://localhost:5173/prenota/nome-ristorante
```
Sostituisci `nome-ristorante` con lo slug del tuo ristorante.

---

## ⚠️ Se qualcosa non funziona

### ❌ Il terminale dice `'node' non è riconosciuto` o `node: command not found`
Node.js non è stato installato correttamente, oppure il terminale non è stato riavviato dopo l'installazione.  
**Soluzione:** chiudi e riapri il terminale. Se il problema persiste, ripeti il Passo 1.

### ❌ Il terminale dice `'npm' non è riconosciuto`
Stesso problema di Node.js.  
**Soluzione:** riavvia il terminale. Se non basta, riavvia il computer dopo aver installato Node.js.

### ❌ `npm install` dà molti errori rossi
Potrebbe esserci un problema di connessione o di versione.  
**Soluzione:** prova a cancellare la cartella `node_modules` (se esiste) e il file `package-lock.json` nella cartella del progetto, poi riesegui `npm install`.

### ❌ La pagina `http://localhost:5173` non si apre
Il server non è partito o è partito su una porta diversa.  
**Soluzione:** guarda nel terminale — cerca la riga con `Local:` e usa quell'indirizzo esatto. Se hai chiuso il terminale, riapri il terminale nella cartella del progetto e riesegui `npm run dev`.

### ❌ Il sito si apre ma dice "Errore di connessione" o non carica i dati
Le credenziali nel file `.env.local` potrebbero essere sbagliate o mancanti.  
**Soluzione:** ricontrolla il Passo 7. Assicurati che il file si chiami esattamente `.env.local` (non `.env.local.txt` o `.env.example`). Dopo aver modificato il file, ferma il server con `Ctrl + C` nel terminale e riavvialo con `npm run dev`.

### ❌ Dopo il login la pagina è bianca o c'è un errore
Probabilmente la tabella `admin_users` non contiene il tuo utente.  
**Soluzione:** esegui nell'SQL Editor di Supabase la query descritta nel Passo 11 per aggiungere il tuo utente come admin.

### ❌ Il terminale si ferma e non si muove più
Premi `Ctrl + C` per fermare il processo. Poi riprova.

---

## 🚀 Prossimi passi

Ora che il progetto gira in locale, ecco cosa puoi fare per completare la configurazione.

---

### 1. Collegare il progetto a GitHub (per tenerlo al sicuro)

💡 **Perché?** GitHub è come una cassaforte online per il codice: salva ogni versione del tuo progetto e ti permette di recuperarlo in qualsiasi momento, anche se il computer si rompe.

- Crea un account gratuito su **https://github.com**
- Crea un nuovo repository (clicca "New" nella dashboard di GitHub)
- Segui le istruzioni a schermo per caricare la cartella `CalendarBackup-v2`

Se non sai come fare, posso guidarti passo per passo in una sessione dedicata.

---

### 2. Mettere online il sito con Vercel (gratis)

💡 **Cos'è Vercel?** È un servizio gratuito che prende il tuo progetto da GitHub e lo mette online su internet in pochi minuti, con un indirizzo web vero.

- Vai su **https://vercel.com** e crea un account (puoi accedere con GitHub)
- Clicca **"New Project"** e seleziona il tuo repository GitHub
- Nella sezione **"Environment Variables"**, aggiungi le stesse variabili del file `.env.local`:
  - `VITE_SUPABASE_URL` → il tuo Project URL di Supabase
  - `VITE_SUPABASE_ANON_KEY` → la tua chiave anon
- Clicca **"Deploy"**

Vercel rileverà automaticamente che si tratta di un progetto Vite e farà tutto da solo. In 2-3 minuti il sito sarà online. ✅

---

### 3. Configurare le email con Resend

💡 **Perché?** Quando un cliente fa una prenotazione, il sistema può inviare email automatiche di conferma. Per farlo serve un servizio email esterno chiamato **Resend**.

- Crea un account gratuito su **https://resend.com**
- Verifica il tuo dominio email (seguendo la loro guida)
- Copia la tua **API Key** dalla dashboard di Resend
- Aggiungila ai segreti del tuo progetto Supabase:  
  Supabase → **Edge Functions** → **Secrets** → aggiungi `RESEND_API_KEY`

⚠️ Nota: questa funzionalità richiede anche la creazione di una Edge Function `send-email` su Supabase. Se ne hai bisogno, chiedimi e ti guido nella configurazione.

---

### 4. Creare il primo token di invito per un cliente

💡 **Cos'è un token di invito?** È un link speciale che mandi al gestore di un ristorante per permettergli di creare il suo account admin. Senza questo link, non può registrarsi.

Per creare un token, vai nell'**SQL Editor** di Supabase e esegui:

```sql
INSERT INTO invite_tokens (organization_id, token, email, expires_at)
VALUES (
  (SELECT id FROM organizations WHERE slug = 'nome-ristorante'),
  gen_random_uuid()::text,
  'admin@ristorante.it',
  NOW() + INTERVAL '7 days'
);
```

Sostituisci:
- `nome-ristorante` → con lo slug della tua organizzazione
- `admin@ristorante.it` → con l'email del gestore (opzionale)

Poi recupera il token creato con questa query:

```sql
SELECT token FROM invite_tokens ORDER BY created_at DESC LIMIT 1;
```

Il link da inviare al gestore sarà:
```
https://tuodominio.com/invite/VALORE-DEL-TOKEN
```

Sostituisci `tuodominio.com` con il tuo indirizzo Vercel (o `localhost:5173` per i test locali) e `VALORE-DEL-TOKEN` con il token che hai ottenuto dalla query.

---

*Guida scritta ad aprile 2026 — CalendarBackup-v2 v2.0.0*
