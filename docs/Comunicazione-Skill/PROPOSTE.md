# PROPOSTE — automazioni candidate (in attesa di decisione di Matteo)

> L'agente scrive qui quando un pattern in [OSSERVAZIONI.md](OSSERVAZIONI.md) è maturo
> (≥2-3 occorrenze). Ogni proposta va **chiesta a Matteo in chat**. Esito:
> - **Accettata** → la rule sale in [VOCABOLARIO.md](VOCABOLARIO.md), qui si segna ✅ accettata.
> - **Rifiutata** → si segna ❌ con il motivo, **non riproporre**.
> - **In attesa** → resta qui finché Matteo non decide.

Ogni proposta deve dire: cosa automatizzare **con certezza** vs cosa **lasciare manuale** e perché.

---

## Formato

```
### [stato] «trigger proposto» → comportamento
- **Pattern osservato:** cosa si ripete e quante volte
- **Automatizzabile con certezza:** ...
- **Meglio lasciare manuale:** ... (perché)
- **Livello suggerito:** 1 (automatico) | 2 (cautela) | 3 (conferma) — in dubbio 3
- **Token risparmiati per Matteo:** stima
- **Esito / data:** ...
```

---

## In attesa di decisione

### [IN ATTESA] «spiegamelo semplice» → metafora + chi-fa-cosa
- **Pattern osservato:** 3+ volte Matteo chiede la versione semplice dopo una proposta tecnica.
- **Automatizzabile con certezza:** quando dice "semplice/sintetico", rispondere con immagine
  concreta + esempio nell'app + dichiarazione esplicita "questo lo fai tu / lo fa il tool / è
  config una-tantum / è scelta UX". Niente codice salvo richiesta.
- **Meglio lasciare manuale:** la scelta di *quale* metafora usare (dipende dal contenuto).
- **Livello suggerito:** 1 (automatico) — è uno stile di risposta, basso rischio.
- **Token risparmiati per Matteo:** alti — non deve più spiegare come vuole la spiegazione.
- **Esito / data:** in attesa (prima voce candidata del sistema).

### [IN ATTESA] «devo farlo io ogni volta?» → classifica responsabilità
- **Pattern osservato:** 2+ volte. È la domanda che lo sblocca davvero.
- **Automatizzabile con certezza:** ogni volta che proponi un meccanismo, chiudi SEMPRE con una
  riga "Chi fa cosa: tu = … / il tool = … / una-tantum = …" anche senza che lo chieda.
- **Meglio lasciare manuale:** nulla.
- **Livello suggerito:** 1 (automatico) — è un'aggiunta a fine risposta, basso rischio.
- **Token risparmiati per Matteo:** medi — evita il giro di domanda/risposta.
- **Esito / data:** in attesa.

### [IN ATTESA] «revisiona [lavoro X] e se è ok committa» → valida con i test e committa
- **Pattern osservato:** 1 forte (28-05). Matteo delega la revisione del lavoro di altri agenti
  fidandosi della validazione automatica come prova.
- **Automatizzabile con certezza:** eseguire `npm run validate` + check import rotti come criterio
  oggettivo di "ok"; se verde, committare con messaggio che cita l'esito della revisione.
- **Meglio lasciare manuale:** se i test passano ma noti un difetto logico (come nel caso PWA),
  fermarsi e segnalarlo prima di committare — il "verde" non basta sempre.
- **Livello suggerito:** 2 (cautela) — di solito procedi, ma con lo stop sui difetti logici.
- **Token risparmiati per Matteo:** medi.
- **Esito / data:** in attesa.

### [IN ATTESA] «mantieni linea scalabile e pulita / no parti obsolete» → soluzioni durevoli
- **Pattern osservato:** 2+ volte. Matteo preferisce sempre soluzioni che reggono nel tempo,
  niente codice ridondante/legacy, niente sovra-ingegnerizzazione.
- **Automatizzabile con certezza:** quando proponi/implementi, preferire l'opzione scalabile e
  segnalare esplicitamente cosa eviti (duplicazioni, file sparsi, abstraction premature).
- **Meglio lasciare manuale:** il giudizio su "quanto" astrarre dipende dal caso.
- **Livello suggerito:** 1 (automatico) — è una preferenza di fondo costante.
- **Token risparmiati per Matteo:** medi.
- **Esito / data:** in attesa.

### [IN ATTESA] azioni strutturali rischiose → impatto + AskUserQuestion prima di agire
- **Pattern osservato:** 2 (spostare 77 file, rinominare cartella gitignored). Matteo vuole capire
  l'impatto e decidere, non subire un'azione irreversibile.
- **Automatizzabile con certezza:** prima di spostamenti di massa / rename / azioni che toccano
  git tracking o privacy, misurare l'impatto (quanti link, gitignore) e proporre opzioni con dati.
- **Meglio lasciare manuale:** la decisione finale è sempre sua.
- **Livello suggerito:** 1 (automatico) — è una salvaguardia, mai dannosa.
- **Token risparmiati per Matteo:** alti — evita danni e rilavorazioni.
- **Esito / data:** in attesa.

---

## Archivio (decise)

*(vuoto — nessuna proposta ancora decisa)*
