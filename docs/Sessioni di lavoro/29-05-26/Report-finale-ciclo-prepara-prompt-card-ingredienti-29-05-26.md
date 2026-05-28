# Report fine ciclo — Prepara prompt → Esecuzione → Revisione (card ingredienti Prenota)

**Data:** 29-05-26  
**Profilo agente redattore:** Meta / filtro d'ingresso (`docs/PREPARA_PROMPT_SKILL.md`) — chiusura ciclo dopo revisione OK  
**Esito complessivo:** ✅ **Completato** — Matteo ha confermato implementazione («ok ora ci siamo!») e revisione accurata (**OK**)

---

## Sintesi esecutiva (per Matteo)

Hai chiesto di cambiare il comportamento delle **card categorie ingredienti** nella **Pagina Prenota** (Antipasti, Secondi, Bevande… nel carosello orizzontale desktop).

**Percorso del ciclo:**

1. **Prepara-prompt (mattina)** — analisi overlap + prompt esecutore che chiedeva di **non** passare sopra campi/riepilogo.
2. **Ask mode (pomeriggio, stessa feature)** — hai chiarito: non è un bug; serve **scroll dentro la card**; cap **3 ingredienti visibili** (con foto); poi scroll.
3. **Esecuzione** — 3 cicli feedback; soluzione finale: **portal React** + scroll interno + overlay voluto sopra form.
4. **Revisione accurata** — agente Verifica esterno: **OK**.
5. **Questo report** — chiusura ciclo prepara-prompt + commit.

**Effetto per chi prenota oggi:**

- Apre una card categoria → vede **~3 piatti interi** (foto incluse).
- Dal 4° piatto scorre **solo dentro** la card.
- La card aperta **galleggia sopra** nome/data/email (overlay intenzionale, non spinge tutta la pagina).
- Larghezza overlay = **stessa della card chiusa** (~280px desktop), non tutto il form.
- Più categorie possono restare aperte insieme.

**Storage DB:** nessuna modifica — solo UI client.

---

## Cronologia completa — tutti i messaggi di Matteo (con ordine temporale)

### Fase 1 — Prepara-prompt (sessione Meta mattina)

**Messaggio 1** — richiesta iniziale con DOM path:

> `@docs/PREPARA_PROMPT_SKILL.md`  
> aiutami a eseguire questo fix: quando clicco una card in [ComposeScrollRow / carosello categorie]… gli ingredienti scorrono verso il basso **passando sopra** [campi BookingRequestForm: Nome, Ora, Ospiti…] e da desktop anche sopra [BookingSummarySidebar] se ci passano sopra.

**Messaggio 2** — ruolo agente + intento + revisione:

> tu non devi effettuare modifiche, devi solo generare il prompt e capire se revisionerai tu o meno…  
> 1. non è un problema ora i comportamenti sono ok solo voglio che cambino come ti ho detto.  
> 2. le categorie possono essere tutte aperte insieme.

**Messaggio 3** — report comunicazione:

> compila un report dettagliato soprattutto in merito a comunicazione… vocabolario (solo cose di cui sei sicuro… no junk)… annota anche miei prompt.

**Messaggio 4** — completezza documentazione:

> annota tutto nel tuo report… includendo tutte le info di questa chat… status attuale skill system.

**Messaggio 5** — verifica copertura:

> tutto quello che mi hai detto in chat è scritto nei documenti? agente che revisiona lo sa?

**Output fase 1:** `Report-prepara-prompt-prenota-card-ingredienti-stack-29-05-26.md` (Appendici A+B con prompt anti-overlap).

---

### Fase 2 — Ask mode (prepara-prompt, pomeriggio — stessa chat / continuazione)

**Messaggio 6** — chiarimento prodotto + revisione:

> 1. **b** scroll dentro la card.  
> 2. non è un bug. al momento non scorre verso il basso andando in sovraimpressione perchè non è mai stato scritto. dobbiamo farlo.  
> (resta in ask mode: prompt aggiornato + chi revisiona)

**Decisioni registrate:**

| # | Scelta Matteo | Implicazione prompt |
|---|---------------|---------------------|
| 1.B | Scroll **dentro** la card | `overflow-y: auto` sul pannello ingredienti, non lista illimitata che esce |
| — | Non bugfix, **feature mancante** | Prompt esecutore: «implementare», non «fix regressione» |
| — | Revisione **accurata** | Agente Verifica esterno, non revisione rapida filtro |

**Messaggio 7** — cap altezza:

> altezza massima di card categoria aperta è di **3 ingredienti**, poi si attiva scorrimento (dimensione view delle foto per card ingrediente).

**Output fase 2:** prompt esecutore v2 (scroll interno + formula `calc` legata a larghezza card + 3 righe tipo «con foto»).

---

### Fase 3 — Esecuzione (agente lavoro, chat separata)

**Prompt incollato:** versione v2 da ask mode (scroll 3 righe, no overlap come obiettivo iniziale del testo — **vedi pivot sotto**).

**Feedback Matteo durante esecuzione** (documentati nel report esecutore):

| # | Messaggio Matteo | Effetto |
|---|------------------|---------|
| B | «la card espansa si espande e NON si sovrappone… vorrei che invece **si sovrapponesse**» | **Pivot decisivo:** overlay voluto (contraddice prompt prepara-prompt mattina e criterio «zero overlap» v2) |
| C | «no ancora non funziona» | Dopo tentativo `absolute` + z-index (clip `overflow-x-auto`) |
| D | ingredienti «sproporzionatamente grandi» | Dopo portal allargato a larghezza form intero |
| E | «**ok ora ci siamo!**» + report con derivazione errori | Soluzione finale accettata |

**Output fase 3:** `Report-prenota-card-ingredienti-scroll-overlay-29-05-26.md` + codice + skill §4 aggiornata.

---

### Fase 4 — Revisione (agente Verifica, chat separata)

**Prompt fornito da prepara-prompt** (revisione accurata): criteri allineati al **comportamento finale approvato** (overlay + scroll 3 righe + larghezza card), non al prompt anti-overlap della mattina.

**Messaggio Matteo:**

> revisione ok. compila tuo report di fine sessione… esaustivo… anche i prompt che ti ho dato io. poi fai anche commit.

**Esito revisione:** ✅ **OK** (conferma Matteo).

---

## Pivot decisionali — timeline intenti (critico per agenti futuri)

| Momento | Intento documentato | Overlay form/sidebar |
|---------|---------------------|----------------------|
| DOM path iniziale | Ingredienti «passano sopra» — letto come **problema** | Da eliminare (prepara-prompt v1) |
| Messaggio 2 mattina | «comportamenti ok, voglio che cambino» + no sopra campi | **No overlap** (Appendice A) |
| Ask mode 1.B | Scroll dentro card, implementare feature | Prompt v2 ancora dice «non sovrapporsi» |
| Feedback Fase B esecuzione | Overlay **voluto** | **Sì overlay** (soluzione portal) |
| Conferma finale | Scroll 3 righe + dimensioni come prima + galleggia sopra | **Sì overlay**, larghezza card |

**Lezione per prepara-prompt:** su task stacking/scroll chiedere esplicitamente **«overlay sì/no»** e **«larghezza contenuto»** prima del prompt esecutore. Stessa feature, intenti opposti nella stessa giornata.

---

## Prompt prodotti dal filtro prepara-prompt (riepilogo versioni)

### v1 — Appendice A report mattina (anti-overlap)

Obiettivo: ingredienti espansi **NON** passano sopra campi cliente né `BookingSummarySidebar`. Più categorie aperte insieme. LOCK `BookingRequestPage`. Superfici 375/900/1256. Approccio: z-index menù vs campi, valutare `isolate` su `MenuSelection`.

→ **Non eseguito così** (Matteo ha invertito intento in esecuzione).

### v2 — Ask mode (scroll interno + 3 righe)

Obiettivo: scroll **dentro** card; max **3 righe tipo con foto** (`BOOKING_MENU_CATEGORY_PANEL_SCROLL_CLASS`); formula `100cqw` + `@container`; no `50vh` generico; no modal; LOCK pagina.

→ Base implementazione scroll; overlap ancora negato nel testo fino a Fase B.

### v3 — Revisione accurata (post-esecuzione, pre-OK)

Profilo Verifica. Verifica comportamento **approvato**: overlay intenzionale, larghezza shell card, z-160 sotto sticky z-200, 3 righe scroll, portal, no allargamento form intero. Checklist 375/900/1256. `npm run validate`.

→ Matteo: **revisione ok**.

---

## Soluzione implementata (riferimento tecnico)

| Pezzo | File | Ruolo |
|-------|------|--------|
| Card categoria | `BookingMenuCategoryCard.tsx` | Collapse/expand; **portal** `createPortal` su `document.body` quando aperta; placeholder invisibile in striscia scroll |
| Costanti layout | `bookingMenuComposePanelLayout.ts` | `BOOKING_MENU_CATEGORY_PANEL_SCROLL_CLASS` (cap 3 righe); `BOOKING_MENU_CATEGORY_EXPANDED_PORTAL_CLASS` (`fixed z-[160]`) |
| Griglia categorie | `BookingMenuComposeGrid.tsx` | Invariata nel comportamento visibile finale |
| Skill | `docs/APP_CONTEXT_SKILL.md` §4 | Nota card: scroll 3 righe + portal stessa larghezza card |

**Formula cap 3 righe** (riga tipo con foto):

```text
max-h-[calc(3*(1rem+0.5rem+44px+(100cqw-1rem)*3/4)+2*1px)]
sm:max-h-[calc(3*(1rem+0.5rem+44px+(100cqw-1rem)*2/3)+2*1px)]
```

**Perché portal:** `overflow-x-auto` su `ComposeScrollRow` taglia figli `absolute` — unico escape affidabile = portal su `body` (pattern già usato da modal app).

**Test:** `npm run validate` OK (193 test). Nessun e2e dedicato.

---

## Revisione accurata — esito

| Check | Esito |
|-------|--------|
| Matteo conferma | ✅ «revisione ok» |
| Agente Verifica | ✅ OK (esterno, contesto pulito) |
| Comportamento overlay + scroll 3 righe | ✅ Allineato a conferma «ci siamo» |
| LOCK `BookingRequestPage` griglia striscia | ✅ Non alterato per questa feature |

**Nota residua documentata (non bloccante):** sidebar ≥1256px a destra — overlay ~280px copre verticalmente il form sotto la card, **non** orizzontalmente tutta la colonna riepilogo. Accettato in conferma finale.

---

## Schermata → componente → storage

| Schermata | Componente | Storage |
|-----------|------------|---------|
| Pagina Prenota `/prenota/:slug` | `BookingRequestPage` | LOCK layout; `booking_public_form_config` |
| Sezione menù `#menu-section` | `MenuSelection` → `BookingMenuComposeGrid` | — |
| Carosello categorie md+ | `ComposeScrollRow` | — |
| Card categoria aperta | `BookingMenuCategoryCard` + portal | Stato `expanded` locale; submit → `menu_selection` |
| Campi cliente | `BookingFormFields` | `booking_requests` |
| Riepilogo ≥1256px | `BookingSummarySidebar` | Stato form |
| Sticky bar <1256px | `BookingStickyBar` | z-200 / z-300 — card portal z-160 sotto bar |

---

## Workflow multi-agente — stato finale

```
[✅] Prepara-prompt mattina (report + Appendici A/B anti-overlap)
[✅] Ask mode pomeriggio (prompt v2 scroll 3 righe + stima revisione accurata)
[✅] Agente Esecuzione (portal + scroll; 3 cicli feedback; report esecutore)
[✅] Prompt revisione accurata (prepara-prompt)
[✅] Agente Verifica → OK
[✅] Report chiusura ciclo (questo file)
[✅] Commit (richiesto Matteo)
[⏳] Matteo — approva voci PROPOSTE.md se desiderate in VOCABOLARIO
```

---

## Dati comunicazione (§ revisore Meta)

### Frasi Matteo — conteggio sessione completa (tutte le chat del ciclo)

| Frase / intento | × | Esito |
|-----------------|---|-------|
| `@PREPARA_PROMPT` + DOM path + componenti React | 1 | Prompt v1 |
| «non è un problema / comportamenti ok / voglio che cambi» | 1 | No framing bugfix |
| «task delicata» + chi revisiona | 1 | Revisione accurata → Verifica |
| «solo prompt, no modifiche» (mattina) | 1 | Zero codice in chat prepara |
| «categorie tutte aperte insieme» | 1 | Vincolo in prompt |
| «1.b scroll dentro la card» | 1 | Prompt v2 |
| «non è un bug… non è mai stato scritto» | 1 | Feature da implementare |
| «3 ingredienti poi scorrimento» | 1 | Formula cap in prompt + codice |
| «agente ha finito» + prompt revisione | 1 | Appendice revisione v3 |
| «revisione ok» + report esaustivo + commit | 1 | Questo report |
| «ok ora ci siamo!» (esecuzione) | 1 | Feature accettata |
| Correzione overlay («voglio sovrapposizione») | 1 | Pivot prodotto |
| «report derivazione errori» | 1 | Sezione nel report esecutore |

### Cosa ha funzionato

- Tabella schermata → componente → storage a ogni fase.
- Stima revisione accurata **a monte** (non sorpresa a valle).
- Report esecutore con **derivazione errori** (prompt vs CSS vs agente).
- Iterazione rapida dopo feedback secco («non funziona», «troppo grandi»).
- Prompt revisione allineato al **comportamento approvato**, non al prompt obsoleto.

### Candidati PROPOSTE (già in `PROPOSTE.md`, non promossi)

1. «comportamenti sono ok» + «voglio che cambi» → cambio intenzionale (Liv.2).
2. Chiusura meta: report comunicazione + vocabolario selettivo + prompt verbatim (Liv.2).
3. **Nuovo da questo report:** obbligo dichiarare «overlay sì/no» nei prompt UI stacking (processo PREPARA_PROMPT).

---

## Status skill system post-ciclo

| Pezzo | Stato |
|-------|--------|
| `APP_CONTEXT_SKILL.md` §4 nota `BookingMenuCategoryCard` | ✅ Aggiornata (esecutore) |
| `PREPARA_PROMPT_SKILL.md` | Invariata; candidata regola «overlay sì/no» |
| `VOCABOLARIO.md` | Invariato |
| `PROPOSTE.md` | +2 voci da sessione mattina |
| `OSSERVAZIONI.md` | Log 29-05-26 aggiornato |
| Report autosufficienti | 3 file sotto `29-05-26/` (prepara, esecutore, **questo finale**) |

---

## Riferimenti incrociati

| Documento | Contenuto |
|-----------|-----------|
| `Report-prepara-prompt-prenota-card-ingredienti-stack-29-05-26.md` | Fase 1: analisi + prompt v1 anti-overlap + Appendici A/B originali |
| `Report-prenota-card-ingredienti-scroll-overlay-29-05-26.md` | Fase 3: implementazione, pivot, derivazione errori, formula CSS |
| **Questo file** | Chiusura ciclo completo + revisione OK + commit |

---

## Commit

Richiesto esplicitamente da Matteo a chiusura revisione. File principali:

- `src/features/booking/components/publicBooking/BookingMenuCategoryCard.tsx`
- `src/features/booking/constants/bookingMenuComposePanelLayout.ts`
- `docs/APP_CONTEXT_SKILL.md`
- Report e log sessione `29-05-26`

*(Eventuali altri file nello stesso commit appartengono a lavori correlati Prenota già in working tree e validate insieme.)*

---

*Report redatto dall'agente prepara-prompt a chiusura ciclo — revisione OK confermata da Matteo.*
