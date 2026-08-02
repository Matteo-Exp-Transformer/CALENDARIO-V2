# Indagine FIX-3 — domande aperte S4 (solo analisi)

> Branch: `env/test` · Data: 02-08-2026 · Nessuna modifica a codice, DB o migrazioni.
> Fonti: [SINTESI.md](SINTESI.md), [CORSIA_D.md](CORSIA_D.md), codice citato sotto,
> decisioni D1/D38/D45–D47 in `docs/MASTERPLAN_SERVIZIO.md`.

---

## 1. Capienza pubblica e D38 (S4-BUG-5)

### Cosa fa il codice oggi

Tre pezzi diversi, **non allineati**.

| Pezzo | Dove | Regola oggi |
|-------|------|-------------|
| **Admin / Servizio / walk-in** | `useCapacityCheck.ts` ~89–96 | In modalità-tavoli: D38 OFF → cap = somma posti tavoli (`totalCovers`); D38 ON → `min(totalCovers, cap fascia)`. Test espliciti in `useCapacityCheck.tableMode.test.ts`. |
| **Form pubblico (orari)** | RPC `get_available_arrival_times` (`060_…sql` ~82, 102) | Cap = solo `override → service_slots.max_guests → slot_guest_capacities`. **Nessun** tavolo, **nessun** `table_mode_respects_slot_cap`. Se `slot_limit_enabled` è ON e ospiti > cap fascia → `available_times` vuoto. |
| **Invio prenotazione pubblica** | Edge `create-booking` ~522–560 | Stessa cascata solo-fascia quando `slot_limit_enabled`. **Nessun** tavolo / D38. |

`useArrivalSlots.ts` chiama l’RPC e spegne gli orari se la mappa capacità non li contiene. Quindi sul percorso **pubblico** conta solo il cap della fascia (nel caso D: **6**), anche con D38 spento e 10 posti tavolo.

### Difetto o voluto?

**Difetto rispetto alle decisioni di prodotto**, non rispetto al codice “come scritto”.

- **D1 / D38 / D46** (`MASTERPLAN_SERVIZIO.md`): con i tavoli comanda la capienza fisica; D38 (default OFF) è il toggle “usa anche il cap fascia”.
- La **checklist §4** (voci 4-2…4-4) descrive quel comportamento: D38 OFF → **10**, 7° coperto accettato.
- L’admin è già aggiornato; il pubblico (RPC + Edge) è rimasto al modello Classic “solo cap fascia”.

Quindi la checklist **non si sbaglia**. L’RPC/Edge **non implementano** ancora D1/D38.

### Fonte di verità sul percorso pubblico

Oggi: **`service_slots.max_guests` (+ override / legacy)**, gated da `slot_limit_enabled`.  
I posti dei tavoli **non entrano** nel pubblico.  
La fonte di verità dichiarata dal masterplan per il blocco duro resta l’Edge (`D2`), ma l’Edge oggi **non** conosce i tavoli.

### Proposta

Allineare **RPC + Edge** a `useCapacityCheck` (somma posti tavoli attivi; se D38 ON → min con cap fascia). Opzionale: stesso helper SQL riusabile.

| | |
|--|--|
| **Costo** | Medio-alto: migrazione RPC, deploy Edge, test E2E pubblico, smoke su Classic (zero regressioni: Classic senza tavoli resta sulla cascata fascia). |
| **Rischio** | **Alto in produzione**: cambia chi può prenotare online sui tenant Pro con tavoli + `slot_limit_enabled`. Con D38 OFF oggi il pubblico è *più stretto* del voluto (blocca al 7°); dopo il fix diventa più permissivo fino ai posti tavolo. Classic non deve cambiare. |

**Chi decide:** Matteo — se il pubblico deve davvero seguire D1/D38 (sì per il masterplan) o se per ora il cap fascia resta “duro” solo online.

---

## 2. Badge % in Calendario (S4-BUG-6)

### Cosa fa il codice oggi

Nella vista **Giorno**, ogni card fascia (`DayServiceGroupCard`) riceve:

```478:486:src/features/booking/components/BookingCalendar.tsx
  // Vista Giorno: in modalità-tavoli mostra sempre l'occupazione rispetto alla capienza fisica sala,
  // anche se i limiti pubblici per fascia sono spenti. In Classic resta legata ai cap per-fascia.
  const resolveSlotCapacityForDate = useCallback(
    (slotId: string | null, cellDateStr: string): number | null => {
      if (!slotId || !timeSlotsEnabled) return null
      if (isTableMode && totalCovers > 0) return totalCovers
      if (!slotLimitEnabled) return null
      return resolveConfiguredSlotCapacityForDate(slotId, cellDateStr)
```

`totalCovers` = somma posti di **tutti** i tavoli attivi del locale (`useTableMode.ts` ~46–48), non della sola sala AG-D. Da lì il **«8 / 128»** visto dalla corsia D (8 coperti Overcap / ~128 posti ristorante).

La % in cella **mese** usa un altro denominatore: somma dei cap **di tutte le fasce** del giorno (`resolveDayDenominator`), solo se `slot_limit_enabled` e ogni fascia ha un limite.

**D38 non entra** nel badge giorno: in modalità-tavoli il denominatore è sempre `totalCovers`.

### Regola implementata

Pro con tavoli → denominatore = **locale intero (posti tavolo)**.  
Classic / Pro senza tavoli → denominatore = **cap fascia** (se limiti pubblici ON), altrimenti niente `/ M`.

### Due letture per Matteo

| Lettura | Denominatore | Significato per il ristoratore | Allinea checklist §4 «limite attivo»? |
|---------|--------------|--------------------------------|----------------------------------------|
| **A — Locale intero** (oggi in Pro+tavoli) | Somma posti di tutti i tavoli | «Quanto è pieno il posto rispetto ai posti fisici» | No (ignora cap fascia e D38) |
| **B — Limite attivo della fascia** | Come `useCapacityCheck`: D38 OFF → posti rilevanti; D38 ON → `min(posti, cap fascia)` | «Quanto è pieno rispetto a ciò che il sistema accetta in quella fascia» | Sì |

Sotto-scelta di B: posti = tutto il locale (128) vs solo tavoli “in gioco” per quella prova (10) — oggi non esiste un filtro per-sala nel badge.

### Proposta

Dopo decisione Matteo: se sceglie **B**, far passare `resolveSlotCapacityForDate` dalla stessa formula di `getSlotCap` in `useCapacityCheck` (riuso / helper condiviso). Costo basso-medio, rischio basso (solo UI admin Calendario, non blocco pubblico).

**Chi decide:** Matteo (A vs B; se B, locale intero vs sala).

---

## 3. Classic senza badge di occupazione (S4-BUG-7) — urgenza regressione

### Confronto `env/test` vs `main` (non a intuito)

Diff Calendario su questa area (commit S4 tipo `3450ca7`):

- **Aggiunto** solo il ramo `isTableMode && totalCovers > 0 → totalCovers` (comportamento Pro+tavoli).
- Il ramo Classic resta: senza `slot_limit_enabled` → `occupancyCapacity = null` (niente `N / M`, % = `-`).

Su **main** la condizione era già:

`if (!slotId || !slotLimitEnabled || !timeSlotsEnabled) return null`

Quindi Classic **non ha perso** un badge che prima c’era. S4 non ha introdotto una regressione pagante su questo punto.

### Cosa ha visto la corsia D

Screenshot `7-2-calendar.png`: giorno **02/08 senza prenotazioni accettate** → messaggio vuoto, **nessuna** card fascia. I badge vivono dentro `DayServiceGroupCard`, che si monta solo se ci sono prenotazioni del giorno. Con giorno vuoto non si può giudicare l’occupazione per fascia.

La checklist §7 chiede occupazione «anche **senza limite** impostato»: quello è il comportamento **Pro+tavoli** post-S4 (sempre `totalCovers`). Classic **non ha mai** avuto quel ramo (né su main né su `env/test`).

### Verdetto

**Non è una regressione S4.** È (1) comportamento Classic storico + (2) possibile falso KO per giorno vuoto. Se i limiti Classic sono davvero a 20 e c’è almeno una accettata in una fascia, il badge `N / 20` **dovrebbe** comparire come su main.

### Proposta

1. Rieseguire 7-2 su Classic con **almeno una prenotazione accettata** e `slot_limit_enabled` ON → confermare `N / 20`.  
2. Se serve davvero «anche senza limite» su Classic: **decisione di prodotto nuova** (oggi non c’è denominatore senza cap / senza tavoli).  
Costo riesecuzione: basso. Costo nuovo comportamento Classic: medio (cosa mostrare come denominatore?).

**Chi decide:** Matteo — accettare «Classic = solo con limite ON» oppure chiedere un denominatore anche senza limite.

---

## 4. Walk-in senza tavolo (S4-BUG-4)

### Cosa fa il codice oggi

`WalkInModal.validate()` (~109–114):

- se esistono sale → **Sala obbligatoria**;
- se la sala ha tavoli → **Tavolo obbligatorio** («Seleziona un tavolo.»).

`useWalkInMutation`: se `table_id` è null, crea comunque la prenotazione `accepted` / `walk_in` e **salta** l’assegnazione tavolo (~127). Il backend è pronto per il “solo coperti”.

Stessa obbligatorietà Sala/Tavolo era già su **main**; S4 ha aggiunto avvisi morbidi D25 e il controllo fascia attiva, non l’obbligo tavolo.

### Intenzione D45 / D46 / D47

Da `MASTERPLAN_SERVIZIO.md`:

- **D45:** il walk-in **conta sempre** in capienza, «anche "solo coperti" senza tavoli».
- **D46:** capienza sala = somma posti tavoli (contesto motore, non «ogni walk-in deve avere tavolo»).
- **D47:** solo durata default walk-in da console (FU).

Checklist §5-1: walk-in da 4 **senza** tavolo → +4 in Calendario = corretto.

### Difetto o scelta?

**Requisito di prodotto (D45 + checklist) non portato fino in fondo nella UI**, non una scelta documentata del tipo «da ora il tavolo è sempre obbligatorio». La mutation lo permette; la modale lo blocca quando ci sono sale/tavoli.

### Proposta

Rendere Sala/Tavolo **opzionali** (asterisco via; validazione non li impone; label «opzionale»). Il percorso con tavolo (5-2, 5-3) resta. Costo basso; rischio basso (solo UX Home Pro).

**Chi decide:** Matteo — conferma che «solo coperti» resta requisito (SINTESI §6 già lo elenca tra le decisioni).

---

## 5. Fascia AG-D senza orari pubblici (S4-NOTE-11)

### Cosa fa il codice oggi

Fascia agent: **15:35–16:25** (50 minuti), step **30** → candidati teorici `15:35`, `16:05`.

`deriveArrivalTimes` (`bookingTimeSlots.ts` ~174–178): un orario è valido solo se  
`arrivo + durata_effettiva ≤ fine_fascia` (oppure, con tardivo ON, `arrivo + min_order_time ≤ fine`).

Simulazione:

| Durata effettiva | Tardivo | Orari validi in AG-D |
|------------------|---------|----------------------|
| 90 min (tipica card/tavolo) | OFF | **nessuno** |
| 0 (nessuna durata) | OFF | 15:35, 16:05 |
| 45 | OFF/ON | solo 15:35 |

La corsia ha anche visto: RPC può restituire orari, ma il form li invalida; prove notturne fuori `business_hours` rifiutate a parte.

### Difetto o setup?

**Artefatto del setup**, non un bug del motore orari. Finestra troppo stretta rispetto a durata (e/o preavviso) tipica del tenant.

### Conseguenza sulle voci bloccate

**4-3, 4-4, 8-1, 8-2** vanno **rieseguite** con una fascia larga (es. ≥ durata card + un passo; meglio 2–3 ore in un buco vero o allargando Pranzo/Aperitivo), non classificate bug finché il riesame non fallisce su fascia sana.

### Proposta

Nessun fix codice. Aggiornare il piano E2E: vincolo «larghezza minima fascia di prova». Costo: solo tempo di riesecuzione corsia D.

**Chi decide:** nessuno sul prodotto; operativo per il prossimo collaudo.

---

## Bonus — Privacy non azionabile in automatico (S4-DEBT-9)

Checkbox custom: input reale a `opacity-0` + box disegnato (`DietaryRestrictionsSection.tsx` ~239–256). L’umano di solito clicca il label; l’automazione che punta solo all’input a volte non aggiorna lo stato React controllato.

**Proposte senza cambiare l’aspetto:**

1. Preferita tooling: `getByRole('checkbox', …).check()` / click sul **label** `htmlFor`, non coordinate sull’icona.  
2. Se ancora flaky: `data-testid` stabile sul wrapper + `locator.click({ force: true })` già usato in parte degli E2E (`e2e/public-booking.spec.ts` punta già `#privacy-consent-dietary-input`).  
3. Solo se serve hardening prodotto: tenere l’input `opacity-0` ma garantire `pointer-events` e area cliccabile ≥ 44px (già `size-5` + label).

Non è un bug cliente finché un tocco umano funziona; blocca solo il collaudo automatico Classic (7-3).

---

## Tabella finale — domanda → risposta → proposta → chi decide

| Domanda | Risposta in una riga | Proposta | Chi decide |
|---------|----------------------|----------|------------|
| **1. Capienza pubblica / D38** | Checklist giusta; pubblico (RPC+Edge) ignora tavoli e D38; admin li rispetta | Allineare RPC + `create-booking` a D1/D38 | **Matteo** (impatto PROD pubblico) |
| **2. Badge % Calendario** | Oggi in Pro+tavoli denominatore = posti di **tutto** il locale (128), non il limite fascia | Scegliere lettura A (locale) vs B (limite attivo D38) | **Matteo** |
| **3. Classic senza badge** | **Non regressione S4**; Classic mai senza `slot_limit`; screenshot su giorno vuoto | Rieseguire 7-2 con prenotazioni; eventuale feature nuova se serve % senza limite | **Matteo** solo se vuole cambiare Classic |
| **4. Walk-in solo coperti** | D45 + checklist lo vogliono; la modale lo vieta se ci sono tavoli (mutation ok) | Sala/Tavolo opzionali in `WalkInModal` | **Matteo** (già in lista decisioni SINTESI) |
| **5. AG-D senza orari** | Setup: fascia 50′ vs durata tipica → zero slot validi | Rieseguire 4-3/4-4/8-1/8-2 con fascia larga | Nessuno (operativo) |
| **Bonus Privacy E2E** | Custom checkbox ostica all’automation | Click/check sul ruolo o label; non serve restyle | Tooling / eventuale micro-fix accessibilità |
)