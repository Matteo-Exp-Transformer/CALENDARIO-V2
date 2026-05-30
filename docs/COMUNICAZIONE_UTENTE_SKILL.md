---
name: comunicazione-utente
description: >-
  Come scrivere messaggi e report a Matteo: linguaggio pratico + riferimenti tecnici
  mappati (schermata, componente, dati DB). Skill leggera, indipendente da APP_CONTEXT.
---

# Comunicazione con l’utente (Matteo)

Usa questa skill per **risposte in chat**, **spiegazioni di architettura**, **piani**, **report di sessione** e **spiegazioni preventive** .

Non sostituisce `APP_CONTEXT_SKILL.md` (routing, LOCK, edition). Non va nel flusso “quale skill area caricare” — va letta quando devi **spiegare** qualcosa a Matteo.

---

## Regola principale: breve per default

Matteo chiede approfondimenti lui quando vuole. **Non anticipare spiegazioni non richieste.**

Per ogni modifica, scrivi al massimo 2–3 frasi:
1. **Cosa cambia** per il ristoratore (schermata + effetto concreto).
2. **Perché** si tocca quella parte (in parole semplici).
3. **Esempio rapido** Per aiutare a capire (es. “prima vedeva X, ora vede Y”).

### Esempio corretto (breve)

> La card «Fasce orarie» in Impostazioni ora mostra i nomi che il ristoratore ha configurato (es. Colazione/Pranzo/Cena), non più etichette fisse. I dati vengono dalla stessa tabella usata dalla pagina Servizio, così non c’è più il rischio di fasce diverse tra le due schermate.

### Esempio sbagliato (troppo lungo)

> **Dove**: Impostazioni locale, card «Imposta Fasce Orarie».  
> **Per il ristoratore**: definisce mattina/pomeriggio/sera...  
> **Codice**: `RestaurantSettingsTab.tsx` — gestisce...  
> **Dati**: `restaurant_settings`, chiave `booking_time_slots`...

---

## Quando è ok aggiungere più dettaglio

- Matteo fa una domanda diretta (“ma perché non tocchiamo X?”, “come funziona Y?”)
- Spiegazione preventiva per file LOCK — **max 3 righe**, non 5 punti
- Report di sessione — una riga per modifica (cosa vede ora il ristoratore + dato DB tra parentesi)

---

## Errori e bug: niente dettaglio tecnico non richiesto

Quando spieghi un errore o un bug trovato, **non** elencare il tipo tecnico dell'errore né il punto esatto nel codice (file, riga, nome funzione/variabile). Di' solo, in parole pratiche, **cosa non funzionava per chi usa l'app** e **che effetto avrà la correzione**.

> ✅ «Nel form di prenotazione il selettore dell'orario non si apriva: sembrava un campo morto. Ora si apre e si può scegliere ora e minuti.»
> ❌ «In `TimePicker24h.tsx` riga 114 l'`<option>` aveva label vuota e `value={hourVal}` era `''`, quindi il select restava su un'opzione invisibile…»

Matteo chiede lui il dettaglio tecnico se gli serve. Vale anche per i report di sessione.

---

## Copy verbatim: applica solo ciò che Matteo cita

Quando Matteo **incolla un testo** e dice di metterlo «esattamente così» / «mostra solo questo testo»
/ ti dà un nuovo intro o una nuova frase, applica **letteralmente solo le stringhe che ha citato** e
lascia **invariato** tutto il resto attorno (elenchi, formato righe, etichette non menzionate). Non
«migliorare» né semplificare ciò che non ti ha chiesto di toccare.

> Caso 29-05-26 (promo modale): Matteo ha dato un nuovo intro + chiusura; l'agente ha cambiato anche
> l'elenco con freccia che non era stato menzionato → «non ti ho detto di cambiarlo». Giro di
> correzione evitabile.

Se la richiesta **sembra** voler sostituire tutto il blocco (non solo le frasi citate), **chiedi
conferma** su elenchi/dettagli secondari prima di riscrivere.

---

## Cosa evitare sempre

- Elenchi di nomi file senza dire cosa cambia in app
- Tabelle o sezioni con titoli se bastano 2 frasi
- Spiegazioni non richieste su come funziona il codice internamente
- Tipo tecnico dell'errore e posizione nel codice quando spieghi un bug (vedi sezione sopra)

---

## Traduzioni tecnico → utente (esempi obbligatori)

| Frase tecnica (da evitare) | Frase utente (da usare) |
|---|---|
| "ho modificato `MenuPricesTab.tsx`" | "ora Mario quando apre la tab Menu vede un nuovo pulsante per generare il QR" |
| "aggiunto invalidateQueries su `HOME_STATS_QUERY_KEY`" | "la card riepilogo in Home si aggiorna subito dopo aver accettato una prenotazione" |
| "estratto `buildFeatures` con override da `tenant_features`" | "da adesso si può attivare il QR Menu anche ai ristoratori Classic senza cambiargli il pacchetto" |
| "fix su `setTenantFromAdmin`: `featureOverrides` ora letto dall'RPC" | "al login Mario vede correttamente le funzionalità che ha acquistato, anche se ha il pacchetto base" |
| "aggiunto `isWallClockStartBeforeNow` guard prima della mutation" | "se Mario prova ad accettare una prenotazione con orario già passato, l'app gli chiede conferma prima di procedere" |
| "rimossa sezione `placement-areas` da `RestaurantSettingsTab`" | "la sezione 'Aree di posizionamento' nelle Impostazioni è stata rimossa perché non era usata da nessun cliente" |

---

## Sistema vivo: due ruoli separati

Per **non appesantire ogni chat**, il sistema separa due ruoli. Un agente di lavoro normale fa
solo le cose leggere; il lavoro "meta" (valutare i dati, riformare lo skill system) è di un agente
revisore in una **sessione dedicata**.

| Ruolo | Quando | Cosa fa | Cosa NON fa |
|-------|--------|---------|-------------|
| **Agente di lavoro** (tutti, anche non specializzati) | Ogni chat | Applica il `VOCABOLARIO` per parlare bene a Matteo; **raccoglie dati** (specie sulle voci Liv.2); scrive un **report esaustivo**; aggiorna lo skill system **solo se Matteo lo autorizza sul momento**. | Non valuta promozioni/regressioni; non propone riforme dello skill system; non apre discussioni meta. Tiene il contesto minimo. |
| **Agente revisore** (sessione separata) | Su richiesta di Matteo, ogni tanto | Legge i report accumulati + `OSSERVAZIONI.md` + dati Liv.2; **valuta** quali voci promuovere/regredire; propone a Matteo miglioramenti allo skill system; applica le decisioni. Vedi [`Comunicazione-Skill/REVISIONE.md`](Comunicazione-Skill/REVISIONE.md). | Non è coinvolto nelle chat di lavoro. |

> **Profili di ingresso e termini.** I tre profili di ingresso (Esecuzione / Verifica / Meta) definiti in `APP_CONTEXT_SKILL.md` § 0.0 sono solo uno *smistatore di contesto* (quali skill caricare) e non hanno livello. I **termini** con cui Matteo li chiama in chat sono invece voci di vocabolario, con livello 1/2/3: nascono in `PROPOSTE.md` (liv. 3), si mappano nella chat dedicata e salgono in `VOCABOLARIO.md` dopo approvazione. Esecuzione/Verifica = agente di lavoro; Meta = agente revisore (`Comunicazione-Skill/REVISIONE.md`).

File di supporto in `docs/Comunicazione-Skill/`:

| File | A cosa serve |
|------|--------------|
| `VOCABOLARIO.md` | Parole/frasi di Matteo → comportamento agente, con **livello 1/2/3**. Solo voci approvate da lui. Caricalo a inizio sessione. |
| `OSSERVAZIONI.md` | Registro dati: frasi ricorrenti, procedure ripetute, esiti applicazione voci. Lo scrivono gli agenti di lavoro; lo legge il revisore. |
| `PROPOSTE.md` | Candidate automazioni. Le **alimenta** l'agente di lavoro (segnalando pattern nel report); le **decide** Matteo con il revisore. |
| `REVISIONE.md` | Protocollo della sessione separata di revisione skill system. |

### Come usare il VOCABOLARIO durante il lavoro (agente di lavoro)

A inizio sessione, leggi `VOCABOLARIO.md`. Ogni voce ha un **livello di libertà**:
- **Liv. 1 (automatico):** applica subito, niente domande.
- **Liv. 2 (cautela):** applica, ma se il contesto è ambiguo fai una domanda breve prima.
- **Liv. 3 (conferma):** chiedi sempre conferma, salvo frase identica a un caso già ok nella voce.

Se una frase somiglia a una voce ma non combacia, trattala come liv. 3 (chiedi) e segnalalo nel report.

**Per ogni voce Liv.2 che applichi**, aggiungi una riga al campo `Dati Liv.2` della voce con
l'esito: `ok` (applicata, Matteo non ha corretto) / `domanda-superflua` (hai chiesto ma era ovvio)
/ `corretto-da-Matteo` (non era ciò che voleva). Questi dati servono al revisore per decidere se
promuovere (→ Liv.1) o regredire (→ Liv.3) la voce. **Tu non decidi**, scrivi solo il dato.

### Protocollo di fine-chat dell'agente di lavoro (SOLO dopo conferma successo di Matteo)

Quando Matteo conferma che il lavoro è andato bene ("ok", "funziona", "perfetto"), esegui:

1. **Aggiorna `OSSERVAZIONI.md`**: aggiungi i dati grezzi di questa chat (frasi ricorrenti,
   spiegazioni che hanno funzionato, procedure ripetute) e i contatori `Dati Liv.2` delle voci usate.
2. **Scrivi il report di sessione** (§7 APP_CONTEXT) con:
   - sezione **"File di skill aggiornati"** (tabella file | modifica breve | **perché** — vedi §7.1 APP_CONTEXT);
   - sezione obbligatoria **"Dati comunicazione"** (vedi sotto) — materiale per il revisore senza rileggere la chat.
3. **Aggiornamenti skill solo se autorizzati**: se durante la chat Matteo ti ha esplicitamente
   detto di aggiornare una skill o aggiungere una voce, fallo. **Altrimenti non toccare lo skill
   system**: limitati a *segnalare* i candidati nel report e in `PROPOSTE.md`. Le proposte vere e
   le domande di riforma le farà il revisore in sessione separata.
4. **Commit dedicato** (se Matteo conferma): commit separati — uno per il codice, uno
   `docs(comunicazione):` per report/osservazioni. Punto di ripristino indipendente.
5. **Terminali Cursor** (se Matteo ha detto «fai report finale» o chiusura con report §7): nelle
   **ultime righe** della risposta, nota obbligatoria — chiudere **solo** tab/processi aperti
   **dall’agente**; non il `npm run dev` di Matteo se ancora in uso. Dettaglio: `APP_CONTEXT_SKILL.md` §7.3;
   voce `VOCABOLARIO.md` «fai report finale».

> L'agente di lavoro **non** apre con Matteo discussioni sul miglioramento dello skill system né
> propone nuove rule in chat (salvo che Matteo lo chieda lì). Quel dialogo avviene con il revisore.

### Sezione obbligatoria nei report: "Dati comunicazione"

Deve essere **esaustiva e autosufficiente**: il revisore deve poter valutare leggendo solo questa,
senza rileggere la chat. Includi:

- **Frasi/richieste ricorrenti** di questa chat, con **conteggio** (es. "spiegamelo semplice ×2").
- **Spiegazioni date** e quale formato ha funzionato (metafora? "chi fa cosa"? esempio nell'app?).
- **Procedure ripetute** richieste da Matteo (candidate a diventare voci/automazioni).
- **Voci Liv.2 applicate** e loro esito (ok / domanda-superflua / corretto-da-Matteo) → input per
  promozione/regressione.
- **Pattern nuovi** che potrebbero diventare voci di vocabolario (anche solo intuiti).
- **Cosa si può automatizzare con certezza** vs **cosa lasciare manuale** (con motivo).
- **Token risparmiabili**: dove Matteo ha scritto molto e una rule lo accorcerebbe.

Sii **proattivo nel proporre dati nuovi**: se noti un segnale utile non previsto da questo elenco,
aggiungilo comunque — meglio dare al revisore più materiale grezzo che meno.

> ⚠️ **REGOLA TEMPORANEA (raccolta dati iniziali — rimuovere dopo revisione Meta)**  
> Fino a nuova indicazione del revisore, la sezione **"Dati comunicazione"** nei report di sessione
> deve essere **più dettagliata del minimo** sopra. Aggiungi obbligatoriamente:
> - sottosezione **«Cronologia / prompt di Matteo (annotati)»** con i messaggi utente rilevanti
>   (verbatim o citazione fedele), numerati, con intento ed esito agente;
> - **contesto sessione** (profilo ingresso, numero turni, se c’erano prompt prepara-prompt);
> - sottosezione **«Cosa non è successo in chat»** (vedi spiegazione sotto);
> - tabella **prompt annotati** se la chat ha più di un messaggio sostanziale di Matteo.
> Il revisore userà questo materiale per calibrare vocabolario e lunghezza futura dei report; non
> sostituisce le altre sezioni del report (§7.1 APP_CONTEXT).

#### Cosa significa «cosa non è successo in chat» (non sono errori)

È un elenco di **assenza di eventi** utili al revisore — cosa **non** è avvenuto nella conversazione,
così capisce i **limiti** dei dati raccolti (e non interpreta il silenzio come conferma).

Esempi da annotare quando applicabili:

| Tipo di «non successo» | Esempio |
|------------------------|---------|
| Domande non poste | L’agente non ha chiesto chiarimenti perché il prompt era già completo |
| Conferme non ricevute | Matteo ha detto «lavoro ok» ma non ha confermato smoke manuale in admin |
| Azioni non richieste | Nessun commit, push, deploy, migrazione DB |
| Protocollo non attivato | Matteo non ha detto «fai report finale» ma solo «ok» (o il contrario) |
| Skill non toccate | Nessun aggiornamento a VOCABOLARIO (solo PROPOSTE) |
| Test non eseguiti | Solo `validate` automatico, nessuna prova browser |

**Non** significa «cosa è andato male»: per i fallimenti usare **Derivazione errori** nel report.
