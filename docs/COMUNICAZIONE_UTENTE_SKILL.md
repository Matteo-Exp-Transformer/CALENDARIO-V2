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

## Cosa evitare sempre

- Elenchi di nomi file senza dire cosa cambia in app
- Tabelle o sezioni con titoli se bastano 2 frasi
- Spiegazioni non richieste su come funziona il codice internamente
