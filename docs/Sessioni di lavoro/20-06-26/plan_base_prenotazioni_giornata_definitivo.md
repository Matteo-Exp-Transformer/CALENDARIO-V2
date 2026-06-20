# PLAN BASE — Vista prenotazioni giornata

## Obiettivo

Rendere la sezione sotto al calendario più leggibile e scalabile quando una giornata contiene molte prenotazioni.

La vista deve permettere all’utente admin di leggere rapidamente tutte le prenotazioni del giorno, mantenendo ordine temporale, chiarezza operativa e una buona densità visiva.

La struttura definitiva scelta è:

```text
Giorno selezionato
  → Fasce orarie / servizi come collapse card
      → gruppi interni per ora
          → card/badge prenotazione
  → Fuori fascia, solo se esiste
```

---

## Struttura generale della giornata

Sotto al calendario devono comparire le fasce orarie configurate dal ristorante.

Esempio:

```text
Colazione 07:00 - 11:30
Pranzo 11:31 - 15:30
Aperitivo 16:30 - 19:30
Cena 19:31 - 22:30
Fuori fascia
```

Ogni fascia deve essere una **collapse card**, quindi può essere aperta o chiusa.

Quando una fascia è chiusa, mostra solo il riepilogo:

```text
Pranzo
11:31 - 15:30
18 prenotazioni · 64 coperti · 7 da assegnare
```

Quando una fascia è aperta, mostra le prenotazioni raggruppate per ora.

---

## Riepilogo alto della giornata

Sopra le fasce deve esserci un riepilogo sintetico della giornata.

Esempio:

```text
Sabato 20 giugno 2026

47 prenotazioni
132 coperti
12 da assegnare
8 con menu
3 fuori fascia
```

Questo riepilogo serve a dare controllo immediato all’utente admin.

---

## Fasce orarie come collapse card

Le fasce devono essere apribili e chiudibili.

Comportamento consigliato:

- di default può essere aperta la fascia più vicina all’orario corrente;
- se l’utente seleziona una data futura/passata, si può aprire la fascia più importante o la prima fascia con prenotazioni;
- l’utente deve poter aprire più fasce oppure una sola alla volta, a discrezione dell’implementazione scelta dall’agente senior;
- le fasce senza prenotazioni possono restare chiuse e compatte;
- le fasce vuote non devono occupare molto spazio.

Esempio fascia chiusa:

```text
▸ Cena
19:31 - 22:30
8 prenotazioni · 35 coperti
```

Esempio fascia aperta:

```text
▾ Pranzo
11:31 - 15:30
18 prenotazioni · 64 coperti · 7 da assegnare
```

---

## Raggruppamento interno ogni 1H

Dentro una fascia aperta, le prenotazioni devono essere raggruppate per ora.

Esempio: se la fascia è `13:00 - 15:30`, la vista deve mostrare:

```text
13:00
14:00
15:00
```

Ogni gruppo orario contiene tutte le prenotazioni che ricadono in quell’ora.

Esempio:

```text
13:00
  prenotazioni dalle 13:00 alle 13:59

14:00
  prenotazioni dalle 14:00 alle 14:59

15:00
  prenotazioni dalle 15:00 alle 15:30
```

Se la fascia inizia a un orario non pieno, usare comunque il blocco dell’ora corrispondente.

Esempio:

```text
11:31 - 15:30
  11:00
  12:00
  13:00
  14:00
  15:00
```

L’agente senior può decidere se mostrare il primo blocco come `11:31` oppure `11:00`, ma la logica deve restare chiara: le prenotazioni vengono raggruppate per blocchi orari.

---

## Layout del gruppo orario

Ogni gruppo orario deve avere una label oraria a sinistra e le card prenotazione a destra.

Esempio:

```text
13:00    [card prenotazione] [card prenotazione] [card prenotazione]
         [card prenotazione] [card prenotazione]
```

Regola principale:

- massimo 3 card prenotazione per riga;
- se ci sono più di 3 prenotazioni nello stesso gruppo orario, le card vanno a capo;
- andando a capo, devono restare sempre dentro lo stesso gruppo orario;
- la label dell’ora deve rimanere il riferimento visivo del blocco;
- non usare una timeline verticale: la vista deve restare pulita, a blocchi.

---

## Card/badge prenotazione

Ogni prenotazione deve essere mostrata come una card compatta ma leggibile.

La card deve essere abbastanza grande da permettere all’utente di leggere bene i dati principali senza aprire il dettaglio.

Informazioni da mostrare nella card:

```text
orario preciso
badge MENU / TAVOLO
eventuale badge NOTE
nome cliente
numero ospiti
stato assegnazione tavolo
```

Esempio:

```text
13:00    TAVOLO
Luca
5 ospiti                  DA ASSEGNARE
```

Oppure:

```text
13:00    MENU    NOTE
Famiglia Romano
6 ospiti                  ASSEGNATO
```

---

## Regole visive della card

La card deve essere leggibile e ben bilanciata.

Regole obbligatorie:

- il nome cliente deve essere il testo più evidente della card;
- il numero ospiti deve essere nero, non grigio chiaro;
- il numero ospiti deve avere una dimensione grande, poco inferiore al nome cliente;
- il numero ospiti non deve sembrare un’informazione secondaria;
- i badge devono essere distribuiti bene dentro la card, senza sembrare compressi;
- lo stato `DA ASSEGNARE` deve essere evidente;
- lo stato `ASSEGNATO` può essere più discreto ma comunque leggibile;
- la card deve essere cliccabile e aprire il dettaglio prenotazione.

Gerarchia visiva consigliata:

```text
1. Nome cliente
2. Numero ospiti
3. Orario preciso
4. Stato assegnazione
5. Badge MENU / TAVOLO / NOTE
```

Il numero ospiti è un dato operativo importante: deve essere letto quasi con la stessa immediatezza del nome cliente.

---

## Colore e leggibilità

Evitare testi troppo chiari su dati importanti.

In particolare:

- `N ospiti` deve essere nero o comunque molto vicino al colore principale del testo;
- non usare grigino chiaro per `N ospiti`;
- il testo secondario può essere grigio solo per elementi meno operativi, come descrizioni, sottotitoli o label di supporto;
- i badge possono usare colori leggeri, ma il testo dentro i badge deve restare leggibile.

---

## Prenotazioni con menu e solo tavolo

La distinzione tra prenotazioni con menu e prenotazioni solo tavolo non deve più essere la struttura principale della pagina.

La struttura principale è:

```text
Fascia oraria
  → ora
      → prenotazioni
```

La distinzione `MENU` / `TAVOLO` deve essere mostrata come badge dentro la card prenotazione.

Questo evita di spezzare la lettura temporale della giornata.

---

## Prenotazioni fuori fascia

Le prenotazioni fuori fascia devono essere trattate come eccezione operativa.

Regole:

- se non ci sono prenotazioni fuori fascia, non mostrare la sezione;
- se ci sono, mostrarla come collapse card in fondo alla giornata;
- usare uno stile leggermente di attenzione;
- spiegare che sono prenotazioni non rientrate nelle fasce configurate.

Esempio:

```text
Fuori fascia
3 prenotazioni da controllare
```

Dentro la card `Fuori fascia`, le prenotazioni possono essere raggruppate per ora con la stessa logica delle altre fasce.

---

## Ordinamento

L’ordinamento deve essere sempre temporale.

Regole:

1. Le fasce devono essere ordinate dall’inizio della giornata alla fine.
2. I gruppi orari dentro ogni fascia devono essere ordinati in modo crescente.
3. Le prenotazioni dentro ogni gruppo orario devono essere ordinate per orario preciso crescente.
4. Le prenotazioni con stesso orario possono essere ordinate per nome cliente o per data di creazione, purché il criterio sia stabile.
5. Le fasce che attraversano la mezzanotte devono essere gestite senza rompere l’ordine visivo della giornata.

---

## Stati vuoti

Se una fascia è vuota:

```text
▸ Aperitivo
16:30 - 19:30
Nessuna prenotazione
```

Se un gruppo orario non contiene prenotazioni, può essere nascosto.

Non è necessario mostrare blocchi orari vuoti dentro una fascia aperta, salvo scelta diversa dell’agente senior.

---

## Scalabilità

La vista deve funzionare bene con:

- 0 prenotazioni;
- poche prenotazioni;
- molte prenotazioni;
- molte prenotazioni nella stessa ora;
- molte prenotazioni nella stessa fascia;
- prenotazioni con menu e solo tavolo mischiate;
- prenotazioni fuori fascia;
- prenotazioni assegnate e da assegnare.

Il layout massimo di 3 card per riga aiuta a mantenere leggibilità e ordine.

---

## Indicazione per lo sviluppo

L’agente senior può decidere liberamente come implementare.

Indicazione di massima:

- non cambiare la logica business delle prenotazioni;
- non rompere apertura dettaglio prenotazione;
- non rompere modali, assegnazione tavoli e flussi esistenti;
- intervenire soprattutto sul modello di visualizzazione giornaliero;
- costruire un view model ordinato per fascia e per ora;
- mantenere la UI responsive.

---

## Possibile modello concettuale

Esempio puramente indicativo:

```ts
type DayServiceGroup = {
  slotId: string | null
  label: string
  startTime: string | null
  endTime: string | null
  isOutOfSlot: boolean
  totalBookings: number
  totalGuests: number
  pendingAssignments: number
  hourGroups: DayHourGroup[]
}

type DayHourGroup = {
  hourLabel: string
  startTime: string
  endTime: string
  bookings: BookingRequest[]
}
```

Questo è solo un riferimento concettuale. L’agente senior può scegliere struttura, nomi, file e componenti più adatti alla repository.

---

## Criteri di accettazione

La modifica può considerarsi riuscita se:

1. Le fasce orarie sono mostrate come collapse card.
2. Ogni fascia aperta raggruppa le prenotazioni per ora.
3. Ogni gruppo orario mostra massimo 3 card per riga.
4. Se ci sono più di 3 prenotazioni nella stessa ora, le card vanno a capo restando nello stesso gruppo.
5. Non è presente la timeline verticale.
6. Ogni card prenotazione è leggibile e cliccabile.
7. Il nome cliente è ben visibile.
8. Il numero ospiti è nero, grande e poco più piccolo del nome cliente.
9. I badge MENU / TAVOLO / NOTE / DA ASSEGNARE sono chiari e ben distribuiti.
10. Le prenotazioni fuori fascia sono mostrate solo se esistono.
11. La vista resta usabile su desktop e mobile.
12. Non vengono introdotte regressioni sui flussi esistenti.
