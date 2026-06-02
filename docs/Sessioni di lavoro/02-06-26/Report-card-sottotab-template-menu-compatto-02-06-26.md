# Report — Card sottotab Prenota: template menu compatto

**Data:** 02-06-26  
**Profilo:** Esecuzione con QA iterativo Matteo  
**Stato:** chiuso — implementato template card compatto, build verde

---

## Richiesta

Matteo ha chiesto di sostituire la resa delle card scorrevoli sottotab con un template ispirato alla seconda view del riferimento:

- niente tag in alto;
- niente bookmark;
- niente tag numero persone;
- card unica per mobile, tablet e desktop;
- contenuto ridotto a titolo, icona e prezzo;
- testo `a persona` solo desktop;
- mantenere il comportamento responsive gia validato dall'agente precedente.

---

## Contesto letto prima delle modifiche

Prima di intervenire e' stato letto l'ultimo report agente di oggi:

`docs/Sessioni di lavoro/02-06-26/Report-prenota-full-page-fix-sticky-card-scorrevoli-02-06-26.md`

Vincoli importanti recuperati:

- le card scrollabili sottotab erano gia state bilanciate con 3 slot proporzionali su mobile;
- da 782px usano lato fisso 200px;
- da 1400px usano lato fisso 240px;
- non bisognava reintrodurre card troppo larghe o rompere lo scroll validato.

---

## Modifiche applicate

### `BookingSubTabCards.tsx`

File:

`src/features/booking/components/publicBooking/BookingSubTabCards.tsx`

Interventi:

- rimossa la descrizione dalla card scorrevole in tutte le view;
- rimossa la label portate/courses dalla card;
- mantenuti solo titolo, icona e prezzo;
- `a persona` visibile solo da desktop (`lg`);
- prezzo ridotto e senza grassetto;
- titolo allineato allo stile font delle card tipologia prenotazione;
- icona centrata nello spazio centrale della card;
- rimossa la linea orizzontale alta sotto il titolo;
- mantenuta la linea orizzontale sopra il prezzo;
- aumentata leggermente l'altezza delle card rispetto al primo tentativo.

### `bookingPublicFieldStyles.ts`

File:

`src/features/booking/constants/bookingPublicFieldStyles.ts`

Interventi:

- ripristinato il comportamento responsive validato nel report precedente;
- confermati i 3 slot proporzionali su mobile;
- confermate larghezze fisse 200px da 782px e 240px da 1400px.

---

## Decisioni

- Non e' stata modificata la logica di scroll orizzontale.
- Non sono state modificate le card categoria ingredienti.
- Non sono stati inclusi nel commit file di documentazione e asset gia presenti nel working tree e non collegati a questa attivita.

---

## Verifica

Comando eseguito:

```bash
npm run build
```

Esito:

- TypeScript ok;
- build Vite ok;
- resta solo il warning noto sui chunk grandi, non collegato alla modifica.

---

## Scope commit previsto

File da includere:

- `src/features/booking/components/publicBooking/BookingSubTabCards.tsx`
- `src/features/booking/constants/bookingPublicFieldStyles.ts`
- `docs/Sessioni di lavoro/02-06-26/Report-card-sottotab-template-menu-compatto-02-06-26.md`

