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
