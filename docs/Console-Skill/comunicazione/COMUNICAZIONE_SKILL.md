# Comunicazione — stile con Cristiano (didattico)

> Come l'agente parla con Cristiano su questo branch. Scelta fatta in intervista: **didattico**.

---

## Principio

**Breve di default, ma didattico.** Per ogni scelta tecnica aggiungi, in lingua semplice, **«cosa
cambia per te»**: l'effetto concreto della decisione, non il dettaglio interno. Cristiano costruisce
la Console e vuole capire il progetto mentre lo fa.

## Come rispondere

- **Parla per schermate e flussi**, non per nomi-file isolati. Se citi un file, dì cosa fa.
- **Prima l'effetto, poi il come.** «Questo accende il Menu QR per quel ristorante (riga in
  `tenant_features`)» — non «inserisco in tenant_features».
- **Una scelta tecnica = una riga di traduzione.** Dopo una decisione non ovvia, aggiungi:
  *Cosa cambia per te: …*.
- **Breve.** La didattica è una riga in più, non un trattato. Se serve approfondire, Cristiano dice
  «spiegamelo semplice» o «ragioniamo».
- **Niente gergo gratuito.** Se un termine tecnico è inevitabile, spiegalo una volta.

## Quando alzare il dettaglio

- Task **deep** (DB, *plan per matteo*, sicurezza, login): spiega di più, mostra la tabellina dei
  rischi e la checklist.
- Task **light** (fix piccolo): basta l'effetto in una riga.

## Checklist di apertura (quando usi il vocabolario o fai domande)

All'avvio, allineati con Cristiano in 2 righe: «profilo che sto usando (Esecuzione/Verifica/Prepara)»
+ «ambiente confermato TEST». Così sapete entrambi su quale binario siamo.

## A fine di ogni fix o revisione (regola fissa — 2026-06-22)

Quando hai finito un fix o una revisione, **prima di chiudere** dai SEMPRE a Cristiano, in chat:

1. **Una checklist da spuntare in dev** — i controlli concreti per verificare di persona il lavoro svolto.
2. **Subito dopo la checklist, il flusso dei click** da fare per controllare e testare la Console:
   passo-passo, «apri questo → clicca qui → scrivi questo → guarda che succeda quello».

Vincolo di lingua su questa parte: **niente sigle, niente parole tecniche**. Non scrivere nomi di
file, nomi di tabelle, nomi di variabili o codici tipo `FU-CONSOLE-14`. Parla per cose che Cristiano
vede sullo schermo (pulsanti, schede, messaggi). Il dettaglio tecnico, se serve, va in una sezione
separata sopra, non dentro la checklist e il flusso dei click.

## A fine sessione

«lavoro ok» → report + log senza commit. «fai report finale» → + commit. Nel report, una sezione
breve **«Cosa è cambiato per te»** in lingua semplice (coerente con lo stile didattico).
