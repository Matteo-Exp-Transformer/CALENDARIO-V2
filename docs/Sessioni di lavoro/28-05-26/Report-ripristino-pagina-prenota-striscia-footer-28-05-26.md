# Report ripristino — Pagina Prenota con striscia laterale e footer chiusura pagina

**Data report:** 28-05-26  
**Fonte ricostruzione:** lavoro svolto in chat il 27-05-26 + report agenti del 25/27-05-26.  
**Nota importante:** questo report descrive lo **stato da ripristinare**, non lo stato attuale del codice dopo la perdita dati/bug.

---

## Obiettivo dello stato da ripristinare

La pagina pubblica `/prenota/:slug` doveva presentarsi cosi:

1. **Striscia fotografica laterale sinistra** sempre integrata nel layout, con foto reali dentro, sticky e ancorata al bordo sinistro.
2. **Colonna destra** con header, form, riepilogo prenotazione e pulsante invio, ridimensionata in base allo spazio rimasto.
3. **Footer Orari/Contatti** come blocco conclusivo della pagina, fuori dalla griglia, bianco, full-width da bordo sinistro a bordo destro.
4. **Gap minimo** tra pulsante **Invia Prenotazione** e footer.
5. Responsive stabile: mobile/tablet gia corretto, desktop corretto dopo il fix della striscia che prima si staccava dal bordo sinistro.

---

## Layout esterno da ricreare

La struttura corretta del `return` in `BookingRequestPage` era:

```tsx
<div className="min-h-screen font-bold" style={bookingPageBackgroundStyle}>
  <div className="min-h-screen flex flex-col">
    <div className="flex-1 w-full grid grid-cols-[20vw_1fr] min-[900px]:grid-cols-[25vw_1fr] items-start">
      <BookingPhotoStrip ... />
      <div className="w-full min-w-0 px-4 md:px-8 pb-44 min-[900px]:pb-1 min-[900px]:px-6 lg:px-8">
        {/* header + BookingRequestForm + BookingStickyBar */}
      </div>
    </div>

    <div className="w-full px-0">
      <div className="rounded-none shadow-xl px-6 md:px-8 bg-white border-t border-slate-100 pt-[clamp(0.4rem,1.2vw,0.7rem)] pb-[clamp(0.5rem,1.6vmin,0.9rem)] mt-0 animate-fade-in">
        {/* Orari + Contatti */}
      </div>
    </div>
  </div>
</div>
```

Punti vincolanti:

- La griglia esterna deve essere `w-full`, **senza** `mx-auto` e **senza** `max-w-*`.
- La striscia foto deve essere nella prima colonna della griglia, non dentro la colonna del form.
- Il footer deve stare **fuori dalla griglia**, come ultimo figlio del wrapper `flex flex-col`.
- Il footer non deve avere `max-w-7xl`, perche deve coprire tutta la larghezza desktop.

---

## Striscia laterale sinistra

### Stato corretto

La striscia foto era una colonna verticale sticky:

- `20vw` sotto 900px.
- `25vw` da 900px in su.
- Sempre agganciata al bordo sinistro del viewport.
- Su desktop non doveva mai comparire un margine vuoto a sinistra.
- Le foto erano dentro la colonna e venivano mostrate a tutta larghezza con `object-cover`.

Classe griglia corretta:

```tsx
className="flex-1 w-full grid grid-cols-[20vw_1fr] min-[900px]:grid-cols-[25vw_1fr] items-start"
```

Errore da non reintrodurre:

```tsx
className="flex-1 mx-auto w-full max-w-7xl grid ..."
```

Quel `mx-auto max-w-7xl` e la causa del distacco della foto dal bordo sinistro su desktop.

### Componente foto

`BookingPhotoStrip` mostrava le foto selezionate dall'admin:

- Campo setting: `public_booking_strip_photo`.
- ID foto: `strip-01` ... `strip-06`.
- Se non c'era selezione, partiva dalla prima foto.
- La foto selezionata veniva messa per prima, poi le altre.
- Parallax leggero: `PARALLAX_SPEED = 0.4`.
- Ogni immagine: `w-full object-cover block`, altezza `120vh`.
- Il ciclo di 6 foto era ripetuto 3 volte: **18 immagini totali**, cioe circa `2160vh`, per coprire form lunghi con molte categorie ingredienti aperte.

Comportamento visivo atteso: Mario apre la pagina Prenota e vede una colonna fotografica continua a sinistra. Anche scrollando molto, la colonna non finisce lasciando buchi.

---

## Footer Orari/Contatti

### Stato corretto finale

Il blocco Orari/Contatti doveva chiudere la pagina come una fascia bianca a tutta larghezza:

```tsx
<div className="w-full px-0">
  <div className="rounded-none shadow-xl px-6 md:px-8 bg-white border-t border-slate-100 pt-[clamp(0.4rem,1.2vw,0.7rem)] pb-[clamp(0.5rem,1.6vmin,0.9rem)] mt-0 animate-fade-in">
    ...
  </div>
</div>
```

Punti vincolanti:

- Non deve essere dentro la colonna destra del form.
- Non deve essere limitato a `max-w-7xl`.
- Non deve essere centrato con `mx-auto`.
- Deve coprire anche la zona sotto la striscia foto.
- Deve essere `rounded-none`, anche su desktop, per sembrare una chiusura piena della pagina.

### Gap sotto il pulsante invio

Per tenere vicino il pulsante **Invia Prenotazione** al footer, la colonna destra usava:

```tsx
pb-44 min-[900px]:pb-1
```

Significato:

- Mobile: `pb-44` protegge gli ultimi contenuti dalla sticky bar inferiore.
- Desktop/tablet >= 900px: `pb-1` riduce molto lo spazio tra form/pulsante e footer.

---

## Responsive da ripristinare

### Mobile

Stato corretto secondo il lavoro del 27-05:

- Layout ancora a 2 colonne: `20vw_1fr`.
- La striscia resta visibile e stretta a sinistra.
- Il form occupa il resto della larghezza.
- Sticky bar mobile visibile solo quando il riepilogo non e in viewport.
- Padding basso del form: `pb-44`, necessario per non far coprire campi e footer dalla sticky bar.

Nota: un agente aveva segnalato che a 320px la colonna sinistra diventa molto stretta, ma Matteo aveva confermato che il comportamento mobile/tablet andava bene. Quindi non va "corretto" nascondendo la striscia se l'obiettivo e ripristinare quella versione.

### Tablet / soglia 900px

Da `900px` cambia il layout interno del form:

```tsx
min-[900px]:grid-cols-[1fr_min(320px,30%)]
```

Comportamento atteso:

- La striscia foto passa a `25vw`.
- La colonna form prende il resto dello spazio.
- Il riepilogo prenotazione entra nella colonna destra del form e diventa sticky.
- Il padding basso passa a `min-[900px]:pb-1`, quindi il footer resta vicino al pulsante invio.

### Desktop

Da desktop:

```tsx
lg:grid-cols-[1fr_min(360px,32%)]
```

Comportamento atteso:

- Striscia foto larga sempre `25vw`, ancorata a sinistra.
- Nessun margine vuoto prima della foto.
- Riepilogo a destra, sticky con `top-4`.
- Pulsante **Invia Prenotazione** sotto form + riepilogo, centrato e prima del footer.
- Footer bianco full-width, non `max-w-7xl`.

---

## Riepilogo prenotazione

### Desktop/tablet >= 900px

Il riepilogo deve comparire a destra nel form pubblico:

- Wrapper: `order-2 w-full max-w-full self-start min-[900px]:sticky min-[900px]:top-4 min-[900px]:order-0`.
- Sotto i 900px non deve essere sticky.
- Da 900px in su resta visibile mentre il cliente compila menu, dati e intolleranze.
- Il pulsante invio dentro la sidebar usa lo slot `submitButton` ed e visibile solo da 900px (`hidden min-[900px]:block`).

### Sotto 900px

Il riepilogo resta nel flusso della pagina prima del submit. La sticky bar mobile:

- E fixed bottom.
- Appare quando `BookingSummarySidebar` esce dalla viewport.
- Usa `IntersectionObserver` tramite `onVisibilityChange`.
- Mostra mini riepilogo con tipologia, data, ora, ospiti e totale.
- Al click apre un bottom-sheet con riepilogo completo.
- Il pulsante in sticky bar e bottom-sheet invia il form con:

```tsx
type="submit"
form="booking-request-form"
```

Non deve esserci una freccia o un meccanismo di "riapertura" del riepilogo nel desktop: quel comportamento era stato rimosso.

---

## Dettagli contenuto form collegati allo stato corretto

Ordine corretto della pagina Prenota:

1. Header pubblico con nome ristorante, titolo e descrizione.
2. Card tipologia prenotazione.
3. Sottotab/card menu o carosello.
4. Eventuale composizione menu.
5. Dati cliente.
6. Intolleranze/richieste/privacy.
7. Riepilogo prenotazione.
8. Pulsante **Invia Prenotazione**.
9. Footer Orari/Contatti full-width.

Le card tipologia e sottotab devono rimanere allineate alla larghezza utile del form, non al footer.

---

## Fonti usate per ricostruire

- `docs/Sessioni di lavoro/27-05-26/Report-footer-striscia-foto-layout-27-05-26.md`
- `docs/Sessioni di lavoro/27-05-26/Report-revisione-strutturale-fix-27-05-26.md`
- `docs/Sessioni di lavoro/27-05-26/mini report agente lavoro svolto.md`
- `docs/Sessioni di lavoro/25-05-26/Report-prenota-v2-ui-sessione-25-05-26.md`
- `docs/Sessioni di lavoro/27-05-26/Report-prenota-v2-riepilogo-prezzi-carosello-card-27-05-26.md`
- Chat del 27-05-26: fix striscia desktop ancorata a sinistra + footer full-width e gap ridotto.

---

## Verifiche eseguite allora

Durante i fix in chat:

- `npm run typecheck` passato.
- `npm run lint` passato.
- Dev server gia attivo su `http://127.0.0.1:5173`.

Nel report agente del 27-05:

- `npm run typecheck` passato.
- `npm run lint` passato.
- `npm run test` passato con 186/186 test.

---

## File di skill aggiornati

| Skill | Stato |
|-------|-------|
| `docs/APP_CONTEXT_SKILL.md` | Gia aggiornata nelle sessioni precedenti, ma lo stato attuale potrebbe descrivere modifiche successive. Per ripristinare questa versione, usare questo report come fonte prioritaria. |

---

## Cosa resta per il ripristino

1. Ripristinare `BookingRequestPage` secondo la struttura indicata sopra.
2. Ripristinare `BookingPhotoStrip` con ciclo foto ripetuto 3 volte e parallax `0.4`.
3. Verificare che `public_booking_strip_photo` punti a `strip-01` ... `strip-06` e che le foto siano presenti in `public/asset/strip/`.
4. Controllare su desktop che il DOM del footer abbia `left=0` e `width=viewport`, non `left=99px` e `width=1280px`.
5. Controllare su desktop che la striscia foto parta da `left=0`.
6. Controllare sotto 900px che sticky bar e riepilogo non coprano campi o footer.
