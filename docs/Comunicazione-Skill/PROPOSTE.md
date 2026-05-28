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

---

## Archivio (decise)

*(vuoto — nessuna proposta ancora decisa)*
