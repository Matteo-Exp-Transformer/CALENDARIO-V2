# VOCABOLARIO — parole/frasi di Matteo → comportamento agente

> **Regola d'oro:** qui entrano **solo voci approvate da Matteo**. L'agente non aggiunge mai
> nulla in autonomia. Le candidate vivono in [PROPOSTE.md](PROPOSTE.md) finché Matteo non le
> approva; da lì salgono qui.

A inizio sessione l'agente legge questo file. Quando Matteo usa una voce mappata, l'agente si
comporta in base al **livello di libertà** della voce (vedi sotto).

---

## Livelli di libertà (quanto è libero l'agente di muoversi)

Ogni voce ha un livello da 1 a 3. Serve a Matteo per dosare quanta autonomia dare a una rule
quando è ancora incerto: una voce può nascere a livello 3 e salire a 1 col tempo, quando Matteo
vede che l'agente la applica bene.

| Liv. | Nome | Comportamento agente | Default |
|------|------|----------------------|---------|
| **1** | **Automatico** | Applica subito, senza chiedere nulla. La rule è consolidata. | agisce |
| **2** | **Con cautela** | Applica, **ma** se il contesto è ambiguo o non sei sicuro dell'intento → fai **una domanda preventiva breve** prima di agire. Se è chiaro, agisci. | agisce, salvo dubbio |
| **3** | **Conferma** | Chiedi **sempre** conferma prima di applicare, **a meno che** la frase di Matteo non sia **identica** (o quasi) a un caso già registrato come ok nella voce. | chiede |

**Regola pratica liv. 2 vs 3:** al livello 2 l'agente parte dal presupposto "agisco", e si ferma
solo se ha un dubbio reale. Al livello 3 parte dal presupposto "chiedo", e procede da solo solo
se il match è netto. Se non sai quale dare → metti 3, è il più prudente; lo abbassi dopo.

### Le voci Liv. 2 raccolgono dati (per decidere se promuoverle o regredirle)

Il livello 2 è uno stato "in osservazione". L'agente di lavoro, quando applica una voce Liv. 2,
**aggiorna il contatore della voce** (campo `Dati Liv.2` sotto) registrando in una riga:
- l'ha applicata e **andava bene** (Matteo non ha corretto) → segnale di **promozione → Liv. 1**;
- ha fatto la **domanda preventiva ed era superflua** (Matteo "sì ovvio, fai pure") → segnale di
  **promozione**;
- l'ha applicata ma Matteo ha **corretto/non era ciò che voleva** → segnale di **regressione → Liv. 3**.

L'agente di lavoro **non decide** promozione/regressione: scrive solo i dati. La decisione la
prende l'**agente revisore** in sessione separata (vedi `REVISIONE.md`), confrontando i numeri.

---

## Formato di una voce

```
### «frase o parola chiave» — Liv. N
- **Intende:** cosa vuole davvero Matteo (l'intento implicito)
- **Comportamento agente:** cosa deve fare l'agente quando la sente
- **Livello:** 1 (automatico) | 2 (cautela) | 3 (conferma) — + nota se è in prova/da rivedere
- **Casi identici già ok:** (per liv. 3) frasi esatte su cui può procedere senza chiedere
- **Dati Liv.2:** (solo se Liv.2) righe `GG-MM-AA · esito` dove esito = ok / domanda-superflua / corretto-da-Matteo
- **Approvata il:** GG-MM-AA
- **Origine:** report/chat da cui è nata
```

---

## Voci attive

*(nessuna ancora — il file parte vuoto per scelta di Matteo. Le voci arrivano dalle proposte
approvate a fine chat.)*

<!--
ESEMPIO di come apparirà una voce approvata (commentato, non attivo):

### «spiegamelo semplice» — Liv. 1
- **Intende:** non vuole una lezione tecnica, vuole capire l'effetto e chi fa cosa
- **Comportamento agente:** usa un'immagine concreta + esempio nell'app; separa in pochi blocchi;
  dichiara esplicitamente se è lavoro suo / automatismo del tool / config una-tantum / scelta UX.
  Max breve. Vedi Metodo_spiegazioni_agenti_coding.md.
- **Livello:** 1 (automatico)
- **Casi identici già ok:** —
- **Approvata il:** —
- **Origine:** —

### «sistema questo plan» — Liv. 3
- **Intende:** forse strutturare un piano, ma potrebbe voler dire altro a seconda del file aperto
- **Comportamento agente:** chiedi conferma su scope prima di riscrivere, salvo che dica esplicitamente "strutturalo come piano operativo"
- **Livello:** 3 (conferma) — in prova
- **Casi identici già ok:** «strutturalo come piano operativo» → procedi diretto
- **Approvata il:** —
- **Origine:** —
-->
