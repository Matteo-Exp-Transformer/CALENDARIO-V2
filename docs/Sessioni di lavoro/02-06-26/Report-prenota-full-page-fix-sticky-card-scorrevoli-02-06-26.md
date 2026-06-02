# Report — Fix Prenota full-page: riepilogo sticky + card scorrevoli sottotab

**Data:** 02-06-26 (sera)
**Profilo:** Esecuzione (chat singola, multi-turno con QA visivo di Matteo)
**Stato:** **chiuso** — tutti i fix completati, 276 test verdi, `lavoro ok` + `fai report finale`
**Parte da:** commit `166b5a2` (freeze base) + working tree con le due pezze precedenti (`noSticky`, `bookingPublicSubTabCapCardWidthClass`)

---

## Cosa voleva Matteo

Chiusura dei 2 fix pendenti del ciclo prepara (vedi report `…-ciclo-layout-02-06-26.md`):

1. **Riepilogo sticky 1256–1599** — in full-page (sfondo full-01..04, no striscia) tra 1256 e 1599px il riepilogo restava agganciato a destra del form invece di stare **sotto** (come mobile). Da 1600px deve tornare colonna laterale sticky.
2. **Card scorrevoli sottotab** (≥4 sottotab) — schiacciate/deformate in varie view. Richiesta: da mobile 3 card intere, una in più man mano che la view cresce **senza schiacciare**, fino a max 5; quadrate, non oblunghe; ultima card non tagliata; non più grandi delle card categoria ingredienti; bilanciamento con gli ingredienti su laptop/desktop; altezza più bassa sopra 639px.

---

## Fix applicati

### Fix 1 — Riepilogo sticky (root cause = CSS grid, non solo classi sticky)

Due cause sovrapposte:

1. **Classi sticky hardcoded nel componente** — `BookingSummarySidebar` aveva `min-[1256px]:sticky top-4 order-0` nel proprio wrapper → diventava colonna laterale **ovunque** montato, da 1256px. La vecchia pezza `noSticky` + `style` inline non bastava.
2. **Affiancamento da grid implicita** — il `<form>` è `grid grid-cols-1`. In full-page i blocchi tipologia/menu/submit hanno `min-[1256px]:col-span-2`; un `col-span-2` su grid a 1 colonna crea una **2ª colonna implicita**. Il blocco campi cliente e il riepilogo (con `col-span-1`) ci entravano → **affiancati**.

**Soluzione — posizionamento spostato dal componente al parent:**
- `BookingSummarySidebar.tsx`: rimosse le classi posizionali e la pezza `noSticky`/style inline; aggiunta prop `className` neutra. Il wrapper è ora solo `w-full max-w-full self-start` + ciò che passa il chiamante.
- `BookingRequestPage.tsx`: istanza **stacked** in full-page → `className="mb-6"` (niente sticky, sta sotto); in layout striscia (legacy) → classi sticky da 1256; istanza **esterna** ≥1600px → `className="sticky top-4"`.
- `BookingRequestForm.tsx`: il blocco campi cliente e il wrapper del riepilogo stacked ora hanno `min-[1256px]:col-span-2` in full-page → tutti occupano la stessa larghezza → il riepilogo va **sotto**.

### Fix 2 — Card scorrevoli sottotab (iterazione su QA visivo)

Evoluzione in più passaggi guidata dagli screenshot di Matteo:

1. **Larghezza unificata** — la funzione `bookingPublicSubTabCapCardWidthClass` (cap-only) → rinominata `bookingPublicSubTabScrollCardWidthClass`, applicata a tutte le card scrollabili ≥4 (non solo full-page cap); rimossa la prop `fullPageFormCapLayout` da `BookingSubTabCards` (resta su `BookingModeCards`).
2. **Quadrate, non oblunghe** — tolta l'altezza fissa px → `aspect-square` (l'altezza segue la larghezza).
3. **Ultima card non tagliata** — il calcolo larghezza usava gap 6px fisso, ma il flex usa `gap-1.5 sm:gap-2` (6px→8px da 640px); allineato il gap a ogni breakpoint (come `bookingPublicRowCardWidthClass`).
4. **Bug "max 3 card a tutte le view"** — le soglie erano media-query sul **viewport**, ma le card vivono nel form **cappato a 1168px** → conteggio slot mai coerente. Risolto passando a **larghezza px fissa** (quante card entrano dipende dallo spazio reale della riga, non dal viewport).
5. **Cap dimensione + bilanciamento ingredienti** (numeri concordati con Matteo):
   - Sottotab: sotto 782px = 3 slot proporzionali (mobile); da **782px** = quadrato **lato fisso 200px** (allineato all'altezza delle card ingredienti, niente più crescita gigante); da **1400px** = **240px** (scatto coordinato).
   - Card ingredienti (`BookingMenuCategoryCard` layout scroll): da **1400px** larghezza **280→320px**, in coppia con le sottotab per bilanciare la pagina su laptop/desktop.
6. **Altezza più bassa sopra 639px** — ramo scrollabile: `aspect-square sm:aspect-4/3` (sotto 640px quadrata su mobile; da 640px più bassa, ~200×150).

---

## File toccati

| File | Modifica |
|------|----------|
| `BookingSummarySidebar.tsx` | Rimosse classi sticky hardcoded + `noSticky`; aggiunta prop `className` neutra |
| `BookingRequestPage.tsx` | `className` sticky condizionato sulle 2 istanze (stacked vs esterna ≥1600) |
| `BookingRequestForm.tsx` | `min-[1256px]:col-span-2` su blocco campi cliente + wrapper riepilogo stacked (no affiancamento grid) |
| `BookingSubTabCards.tsx` | Larghezza px fissa, `aspect-square sm:aspect-4/3`, rimossa prop `fullPageFormCapLayout` |
| `bookingPublicFieldStyles.ts` | Funzione rinominata `…ScrollCardWidthClass`; soglie 782/1400px, lato 200/240px |
| `BookingMenuCategoryCard.tsx` | Scatto larghezza scroll 280→320px da 1400px |

## QA Matteo (visivo, dev server)

| Check | Esito |
|-------|--------|
| Riepilogo sotto il form a ~1320px (full-page) | ✅ (dopo riavvio dev server) |
| Card scorrevoli — scroll fluido | ✅ «comincia a scorrere che è una meraviglia» |
| Card quadrate, ultima non tagliata, 4-5 visibili a view larghe | ✅ |
| Bilanciamento con card ingredienti (no sottotab giganti) | ✅ |
| Altezza ridotta sopra 639px | ✅ |

**Validate:** typecheck + lint (0 warning) + 276 test Vitest verdi.

---

## Osservazioni per skill system

- **Reminder principianti (nuovo):** Matteo ha riportato «non funziona» mentre il Fix 1 era già corretto — causa = **dev server non riavviato**. Nasce l'idea dei «reminder per principianti» attivabili/disattivabili che pesano sullo skill system (annotata in memoria agente; da valutare per docs/Comunicazione-Skill).
- **Lezione tecnica (grid implicita):** un `col-span-2` su `grid-cols-1` crea una colonna implicita che affianca i figli `col-span-1`. In layout a colonna singola condizionale (full-page) **tutti** i figli principali devono avere lo stesso span, altrimenti si affiancano. Vale per `BookingRequestForm`.
- **Lezione tecnica (px vs viewport in container cappato):** dimensionare card con media-query sul viewport quando vivono in un container a larghezza fissa (cap 1168px) produce conteggi slot incoerenti. Per card dentro un cap → **larghezza px fissa**, non % + breakpoint viewport.
- **Incoerenza doc da risolvere (non mia):** il working tree aveva `VOCABOLARIO.md` con la voce «sticky» aggiunta come Liv.1 approvata, ma report+OSSERVAZIONI dicono che Matteo la voleva **solo in OSSERVAZIONI**. Da riconciliare con Matteo/revisore.

---

## Metodo, prompt di Matteo e spunti skill system (questa chat)

### Come ha lavorato Matteo (dati grezzi)

| # | Matteo | Effetto sul lavoro |
|---|--------|--------------------|
| 1 | «analizza lavori precedenti… cosa è stato fatto in merito a questo fix» + hand-off completo | Agente ha letto report + context §4/§4.1 + 3 file chiave **prima** di toccare → root cause individuata senza tentativi a vuoto |
| 2 | «procedi con tutti e due se ti è chiaro il quadro» (aggiunge Fix 2 card via prompt all'hand-off) | Due fix in un colpo; il 2º non era nell'hand-off originale ma in un prompt allegato |
| 3 | Screenshot «niente è ancora lì» a 1320px | Falso negativo: il fix era corretto, mancava **riavvio dev server** → 1 giro di ri-diagnosi sprecato |
| 4 | «scemo io, non avevo riavviato dev server» + chiede reminder principianti | Nasce l'idea reminder attivabili/disattivabili |
| 5 | Screenshot card oblunghe / tagliate / 5 troppo presto | 4-5 micro-iterazioni guidate da foto: gap 6/8px, soglie, taglio bordo |
| 6 | «parliamone prima di fare modifiche assicurati di aver capito» | Stop esplicito prima di codare → riformulazione ipotesi + 2 domande con AskUserQuestion → **zero rework** su quel passo |
| 7 | «proviamo con i tuoi numeri» / «lavoro ok» / «fai report finale» | Comandi-base già coперti, nessuna frase lunga necessaria |

### Cosa ha funzionato

- **Hand-off scritto + «analizza prima»**: leggere report/context/file prima di editare ha evitato i tentativi a vuoto della sessione precedente (dove la root cause sticky era emersa solo dopo annullamento).
- **«parliamone prima»** come freno: ha trasformato un task estetico ambiguo (card troppo grandi) in 2 scelte nette (quadrato px fisso vs tetto; scatto coordinato sì/no) prima di codare.
- **QA visivo iterativo** su screenshot reali: efficace per il pixel-perfect, Matteo vede subito.

### Cosa è costato / da migliorare

1. **Falso negativo dev-server** (turno 3): un giro di ri-diagnosi su codice già corretto. → reminder principianti.
2. **Iterazioni card prevedibili**: gap 6/8px, "più grandi degli ingredienti", soglie troppo basse — un agente che fa **card responsive** dovrebbe, prima di codare, **misurare le card vicine di riferimento** (qui: card categoria ingrediente = `min(280px) 4:3`) e chiedere il target dimensionale, invece di scoprirlo a posteriori via screenshot.
3. **px fisso vs viewport in container cappato**: trappola ricorrente su Prenota (cap 1168px). Le media-query sul viewport danno conteggi slot incoerenti → la regola «card dentro un cap = px fissa» andrebbe nel context come anti-pattern esplicito (fatto in §4.1).
4. **Post-commit rework di Matteo**: dopo il commit Matteo ha rielaborato il template card (verticale, `aspect-[4/5]`, prezzo grande). Segnale che la card "funzionante ma non finita" andava forse mostrata come **proposta di layout** prima del commit, non solo come fix di dimensioni.

### Bozza per OSSERVAZIONI.md (osservazioni di Matteo — da approvare, NON in VOCABOLARIO da solo)

| Data | Osservazione Matteo | Uso per agenti |
|------|---------------------|----------------|
| 02-06-26 | **Reminder per principianti**: idea di promemoria operativi (es. «riavvia dev server») attivabili/disattivabili, che «pesano sullo skill system» quando attivi e si tolgono quando Matteo è più confident. | Valutare categoria dedicata in Comunicazione-Skill; per ora in memoria agente. |
| 02-06-26 | **«parliamone prima di fare modifiche»** = trigger esplicito: l'agente si ferma, riformula l'ipotesi e allinea (anche con domande) **prima** di scrivere codice, su task estetici/ambigui. | Su richieste UI vaghe («troppo grande», «non bilanciato») non codare subito: proporre interpretazione + scelte. Candidata lessico operativo. |
| 02-06-26 | **Card responsive**: prima di dimensionare, misurare le card vicine di riferimento (es. card ingrediente) e fissare il target con Matteo, invece di iterare a posteriori su screenshot. | Regola per task card/griglia su Prenota. |

---

## File report correlati

- Ciclo prepara/analisi: `docs/Sessioni di lavoro/02-06-26/Report-prenota-full-page-freeze-ciclo-layout-02-06-26.md`
- Context layout: `docs/per-ui-design-skill/BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` (§4.1)
