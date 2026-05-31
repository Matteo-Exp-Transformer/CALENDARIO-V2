sto testando skill system migliorato. al momento soto testando la skill in evidenza prepara prompt. 
miglioramenti da fare a skill system : agenti oltre a raccogliere dati su di me dovranno raccogliere dati ( nei report di fine lavoro) anche sulle difficolta che hanno incontrao e i bug che hanno dovuto risolvere e se erano bug gia esistenti, evitabili con prompt migliore, o erorri di agente che ha eseguito il lavoro e il report di fine lavoro. 
( diciamo una sorta di feedback da agente per migliorare skillsystem )  
altra valutazione da fare : 
ho dato un prompt per una task medio/difficile, e per sicurezza ho lanciato due agenti in ask mode prima di decidere quale prompt lanciare. e primo agente mi ha un po deluso e non ha brillato, mentre secondo agente meglio poichè ha trovato una possibile incongruenza o conflitto, o ulteriore dettaglio correlato al lavoro da fare che non avevo notato. 
analizza report dei 2 agenti di filtro e quello di agente che ha svolto il lavoro e basandoti su questo fammi delle domande se servono, per migliorare skill system se serve di conseguenza. 
report agente 1 : 
# Report fine sessione — Prepara prompt Prenota (stacking card ingredienti) + skill system

**Data:** 29-05-26  
**Profilo agente:** Meta / filtro d'ingresso (`docs/PREPARA_PROMPT_SKILL.md`)  
**Codice app:** nessuna modifica a `src/`  
**Stato task prodotto (UI Prenota):** **non implementato** — solo prompt + documentazione  
**Stato documentazione:** **completa e autosufficiente** (questo report contiene prompt esecutore e revisione integrali)

---

## Sintesi esecutiva

Matteo ha chiesto di preparare un fix sulla **Pagina Prenota**: aprendo le card categorie ingredienti nel carosello desktop (`ComposeScrollRow`), la lista ingredienti si disegna **sopra** i campi cliente e il riepilogo. Dopo correzione («non è un bug, comportamenti ok, voglio il cambio descritto» + «tutte le categorie aperte insieme»), l'agente ha prodotto prompt per **Esecuzione** e criteri per **revisione accurata** (agente Verifica esterno). La sessione si è chiusa con report comunicazione, proposte vocabolario selettive e **questo report consolidato** che integra tutta la chat — inclusi prompt operativi prima solo in conversazione.

**Revisione post-implementazione:** **accurata** → agente **Verifica** dedicato (non revisione rapida del filtro prepara-prompt).

---

## Cronologia chat (tutti i messaggi di Matteo)

### Messaggio 1 — richiesta iniziale

```
@docs/PREPARA_PROMPT_SKILL.md  
aiutami a eseguire questo fix : 
quando clicco una card in DOM Path: div#root > div.min-h-.creen font-bold relative i.olate > div.min-h-.creen flex flex-col relative z-10 > div.flex-1 w-full grid item.-.tart grid-col.-[20vw_1fr] min-[900px]:grid-col.-[25vw_1fr] > div.w-full min-w-0 px-6 md:px-10 min-[900px]:px-6 lg:px-8 > form#booking-request-form > div#menu-section > div.i.olate w-full min-w-0 > div.mt-4 w-full min-w-0 flex flex-col > div.w-full min-w-0 > div.hidden md:block > div.relative w-full min-w-0 > div.flex w-full min-w-0 flex-nowrap item.-.tart gap-4 overflow-x-auto .croll-px-2 .crollbar-hide .nap-x .nap-mandatory py-1
Position: top=426px, left=209px, width=591px, height=219px
React Component: ComposeScrollRow
HTML Element: <div class="flex w-full min-w-0 flex-nowrap items-start gap-4 overflow-x-auto scroll-px-2 scrollbar-hide snap-x snap-mandatory py-1" ...>ANTIPASTI Scopri cosa è incluso SECONDI PIATTI ... BEVANDE ...</div>
allora gli ingredienti al suo interno scorreranno in verso il basso, passando sopra a DOM Path: ... > div.flex w-full min-w-0 flex-col .pace-y-3
React Component: BookingRequestForm
(campi Nome Completo, Ora, Ospiti, Telefono, Data, Email, Intolleranze, Privacy...)
e da desktop anche sopra a DOM Path: ... > aside ... 
React Component: BookingSummarySidebar
(Riepilogo Prenotazione, DATA, ORARIO, IL TUO MENU...)
se ci passano sopra.
```

**Prima interpretazione agente (corretta sul sintomo, imprecisa sul framing):** overlap visivo da stacking context — da eliminare. Etichettato come «fix».

### Messaggio 2 — correzione ruolo, intento, revisione

```
tu non devi effettuare modifiche, devi solo generare il prompt e capire se revisionerai tu o meno il lavoro o lo farà altro agente perchè è una task delicata. 
1. non è un problema ora i comportamenti sono ok solo voglio che cambino come ti ho detto. 
2. le categorie possono essere tutte aperte insieme.
```

**Interpretazione definitiva:**
- Agente = **solo prepara-prompt** (zero codice).
- **Cambio intenzionale**, non bug/regressione: baseline accettabile, obiettivo = smettere di passare sopra campi/riepilogo.
- **No accordion:** più categorie aperte contemporaneamente.
- **Revisione:** task delicata → **revisione accurata**, agente Verifica esterno.

### Messaggio 3 — report comunicazione + vocabolario

```
compila un report dettagliato soprattuto in merito a comunicazione. aiutami a trovare parole da inserire nel vocabolario ( solo cose di cui sei sicuro il resto no. no junk in skill system ) in merito alla sessione svolta in questa chat. annota anche miei prompt.
```

**Output:** report iniziale + `OSSERVAZIONI.md` + 2 voci in `PROPOSTE.md` (non in `VOCABOLARIO.md`).

### Messaggio 4 — completezza documentazione

```
annota tutto nel tuo report. tu fai il tuo report di fine lavoro includendo tutte le info di questa chat e tua analisi su lavoro e status attuale skill system. 
fai questo.
```

**Output:** questo documento (versione consolidata autosufficiente).

### Messaggio 5 — verifica copertura (in chat, prima del consolidamento)

```
tutto quello che mi hai detto in chat è scritto nei documenti? agente che revisiona lo sa?
```

**Risposta agente (ora incorporata qui):** il report v1 **non** conteneva i prompt operativi integrali; il revisore conosceva criteri ma non il testo esatto da incollare. **Questo report v2 chiude il gap.**

---

## Analisi agente — problema e soluzione proposta

### In parole semplici (per Matteo)

**Dove:** Pagina **Prenota** del cliente, sezione menù dopo aver scelto tipologia/card — carosello orizzontale con ANTIPASTI, SECONDI, BEVANDE (desktop/tablet).

**Cosa succede oggi:** clic sulla card → si apre la lista ingredienti che scende in basso ma **si vede sopra** nome, data, ora e il box «Riepilogo Prenotazione» a destra.

**Cosa deve succedere dopo l'esecuzione:** ingredienti espansi **senza coprire** campi e riepilogo; scroll pagina naturale; **più categorie aperte insieme** ok.

**Storage:** nessun cambiamento DB — solo layout/CSS/React.

### Analisi tecnica (per esecutore/revisore)

| Elemento | Ruolo nel problema probabile |
|----------|------------------------------|
| `MenuSelection.tsx` root `isolate` | Crea stacking context locale |
| `BookingMenuCategoryCard` `bg-white/90 backdrop-blur shadow-md` | Stacking context + semi-trasparenza |
| `ComposeScrollRow` `overflow-x-auto` | Overflow-y implicito `auto`; clip/stacking ambiguo |
| `BookingRequestForm` griglia ≥1256px | Colonna campi vs colonna riepilogo; paint order tra righe grid |
| `BookingSummarySidebar` `sticky top-4` | Partecipa allo stacking quando overlap verticale |
| `BookingRequestPage` root `relative isolate` + wrapper `z-10` | Invariante LOCK — **non toccare** per questo fix |

**File candidati fix (preferenza ordine):**
1. `BookingMenuCategoryCard.tsx`
2. `BookingMenuComposeGrid.tsx`
3. `MenuSelection.tsx` (valutare se `isolate` serve ancora)
4. Se necessario z-index mirato: `BookingRequestForm.tsx`, `BookingSummarySidebar.tsx` — **senza** cambiare ordine sezioni o griglia pagina.

**Approccio suggerito (minimo):**
- Sezione menù / compose: `relative z-0`
- Wrapper campi cliente + riepilogo: `relative z-10` + sfondo opaco coerente
- Verificare che scroll row non tagli verticalmente l'espansione in modo errato
- Non reintrodurre stretch altezza tra card (fix 27-05-26: ogni card alta quanto i suoi ingredienti)

**Domanda A/B evitata dopo messaggio 2:** Matteo non voleva scegliere «overlay vs push» — voleva smettere di passare sopra, con baseline ok.

---

## Schermata → componente → storage

| Schermata | Componente | Storage / note |
|-----------|------------|----------------|
| Pagina Prenota `/prenota/:slug` | `BookingRequestPage` | Layout LOCK; `booking_public_form_config`, sfondo striscia |
| Sezione menù `#menu-section` | `BookingRequestForm` → `MenuSelection` | — |
| Carosello categorie md+ | `BookingMenuComposeGrid` → `ComposeScrollRow` | — |
| Card categoria | `BookingMenuCategoryCard` | `expanded` locale; submit → `menu_selection` |
| Campi cliente | `BookingFormFields`, `DietaryRestrictionsSection` | Submit → `booking_requests` |
| Riepilogo | `BookingSummarySidebar` | Stato form; config `booking_public_form_config` |
| Sticky bar &lt;1256px | `BookingStickyBar` | z-200 overlay, z-300 sheet — non rompere |

---

## Stato lavoro e workflow multi-agente

```
[✅ FATTO] Prepara-prompt + analisi + report comunicazione
[✅ FATTO] Report autosufficiente (questo file) con prompt esecutore + revisione
[⏳ DA FARE] Agente Esecuzione — implementazione UI (Appendice A)
[⏳ DA FARE] Agente Verifica — revisione accurata (Appendice B)
[⏳ DA FARE] Matteo — approva voci PROPOSTE.md se le vuole in VOCABOLARIO
[⏳ DA FARE] Esecutore post-fix — APP_CONTEXT §7.2 se comportamento UI documentato cambia
```

| Ruolo | Sa abbastanza leggendo solo questo report? |
|-------|---------------------------------------------|
| **Esecutore** | **Sì** — Appendice A |
| **Revisore Verifica** | **Sì** — Appendice B + diff commit esecutore |
| **Revisore skill system (Meta)** | **Sì** — sezione «Status skill system» + Dati comunicazione |
| **Matteo** | **Sì** — senza rileggere la chat |

---

## Appendice A — Prompt esecutore (testo integrale, copia-incolla)

```
## Obiettivo
Pagina Prenota (`/prenota/:slug`): su desktop/tablet (md+), nel carosello orizzontale categorie ingredienti (`ComposeScrollRow` in `BookingMenuComposeGrid`), quando il cliente apre una o più card (`BookingMenuCategoryCard`, `layout="scroll"`), la lista ingredienti che si espande verso il basso NON deve più passare sopra (paint / z-index) i campi dati cliente né il riepilogo `BookingSummarySidebar` (incluso sidebar sticky ≥1256px).

Il resto del comportamento della pagina è corretto: intervenire solo su questo aspetto visivo/stacking. Non è un bug/regressione — è un cambio UX mirato su baseline accettabile.

## Comportamento richiesto
- Espansione verticale delle card: ingredienti leggibili, scroll di pagina naturale.
- Nessuna sovrapposizione visiva (né click-through) su: Nome, Data, Ora, Ospiti, Intolleranze, Privacy, riepilogo a destra.
- Tutte le categorie possono restare aperte insieme — non implementare chiusura automatica delle altre card all'apertura di una.

## Contesto tecnico
- Percorso UI: `#menu-section` → `MenuSelection` (root con `isolate`) → `BookingMenuComposeGrid` → `ComposeScrollRow` → `BookingMenuCategoryCard`.
- Card aperte: `expanded=true`, lista checkbox in `<ul>` sotto header categoria.
- Card: `backdrop-blur`, `shadow-md` → stacking context.
- Scroll row: `overflow-x-auto` (attenzione overflow-y implicito).
- Form: `BookingRequestForm` griglia `min-[1256px]:grid-cols-[1fr_min(360px,32%)]`; riepilogo wrapper `sticky top-4` in `BookingSummarySidebar`.
- Ordine sezioni prodotto invariato: tipologia/sottotab + menù, poi campi cliente, poi riepilogo.

## Vincoli
- LOCK `BookingRequestPage.tsx` — NON modificare griglia striscia foto, `BookingPhotoStrip`, footer, spacer, stacking root (`relative isolate`, foto `z-0`, wrapper `z-10`). Fix preferito su figli: `BookingMenuCategoryCard`, `BookingMenuComposeGrid`, `MenuSelection`; z-index mirato su wrapper campi/riepilogo solo se necessario in `BookingRequestForm` / `BookingSummarySidebar`.
- NON toccare: `booking_public_form_config`, resolver, admin Personalizza form, DB, logica selezione ingredienti/prezzi.
- RULE UI leggera: niente nuovi blocchi help.

## Superfici obbligatorie (verifica 375 / 900 / 1256px)
1. Desktop ≥1256px: carosello + campi + sidebar sticky; aprire 2+ categorie insieme nel carosello.
2. Tablet ~900px: carosello md+ su colonna singola form.
3. Mobile <768px: layout `stack` / griglia locked — zero regressioni.
4. Sticky bar <1256px: nessun conflitto con overlay (`z-200` / `z-300`).

## Cosa NON fare
- Non cambiare ordine sezioni form, griglia pagina, striscia foto, footer.
- Non forzare una sola categoria aperta.
- Non cambiare testi, prezzi, riepilogo carosello/card.

## Approccio suggerito
1. Riprodurre: aprire categoria nel `ComposeScrollRow`, confermare overlap su campi e sidebar.
2. Ispezionare stacking: `isolate` su `MenuSelection`, `overflow-x-auto`, `backdrop-blur` sulle card.
3. Correggere con soluzione minima (es. z-0 menù / z-10 campi+riepilogo; overflow-y-visible controllato; evitare clip errato).
4. Non reintrodurre stretch altezza tra card nel carosello.

## Criterio di fatto
- Con una o più card aperte: ingredienti non coprono campi né riepilogo; interazione normale.
- `npm run validate` verde.

## Fine sessione (APP_CONTEXT §7)
A conferma Matteo: report §7.1 + allineamento skill §7.2 aree UI toccate.
```

**Report di riferimento esecutore:** `docs/Sessioni di lavoro/29-05-26/Report-prepara-prompt-prenota-card-ingredienti-stack-29-05-26.md`

---

## Appendice B — Prompt revisione accurata (agente Verifica, copia-incolla)

```
## Profilo
Verifica — «revisione completa» (VOCABOLARIO Liv.1). Non approvare per cortesia.

## Contesto
Task preparato in sessione 29-05-26 (report sopra). Agente Esecuzione ha modificato stacking/overlap card ingredienti Pagina Prenota. Matteo: comportamento attuale era ok come baseline; richiesto solo smettere di disegnare ingredienti sopra campi cliente e riepilogo. Più categorie aperte insieme devono restare possibili.

## Cosa revisionare
1. Leggi il report 29-05-26 (sezioni Analisi + Appendice A) per criteri di accettazione.
2. Leggi il diff dell'esecutore — file attesi: `BookingMenuCategoryCard`, `BookingMenuComposeGrid`, `MenuSelection`; eventualmente `BookingRequestForm`, `BookingSummarySidebar`. Verifica che `BookingRequestPage` NON sia stato alterato su LOCK griglia/striscia/footer.
3. Esegui `npm run validate`.
4. Checklist visiva (DevTools o browser):
   - ≥1256px: apri 2+ categorie nel carosello desktop → nessun testo/checkbox ingredienti sopra campi o sidebar sticky; click su campi e riepilogo ok.
   - ~900px: stesso carosello, colonna singola.
   - ~375px: layout mobile stack/locked — nessuna regressione apertura categorie.
   - <1256px: sticky bar e overlay non in conflitto con fix z-index.
5. Segnala difetti logici anche a test verdi (stacking è visivo).

## Criterio approvazione
- Obiettivo Matteo soddisfatto (no overlap su campi + riepilogo; categorie multiple aperte).
- LOCK rispettati.
- Nessuna regressione mobile/sticky.
- Se APP_CONTEXT RULE Pagina Prenota toccata dall'esecutore: skill allineata §7.2.

## Output
Report breve: ok / elenco difetti con file e breakpoint. Non committare salvo richiesta esplicita Matteo.
```

---

## Status attuale skill system (analisi agente, 29-05-26)

### Architettura (operativa)

| Pezzo | Stato | Note sessione |
|-------|--------|---------------|
| `PREPARA_PROMPT_SKILL.md` | ✅ Attivo | Usato correttamente; §4 revisione accurata applicata |
| `VOCABOLARIO.md` | ✅ ~20 voci Liv.1 | «prepara prompt», «revisione completa», scorciatoie area ok |
| `PROPOSTE.md` | ✅ +2 voci in attesa | Vedi sotto — **non** promosse senza Matteo |
| `OSSERVAZIONI.md` | ✅ Aggiornato | Log 29-05-26 |
| `COMUNICAZIONE_UTENTE_SKILL.md` | ✅ Invariato | Report segue § Dati comunicazione |
| `APP_CONTEXT` RULE Prenota | ⏳ Invariato | Aggiornare solo **dopo** fix UI esecutore se serve |

### Lacuna emersa in sessione (e come questo report la chiude)

| Lacuna | Prima | Dopo questo report |
|--------|--------|-------------------|
| Prompt esecutore solo in chat | Revisore/esecutore dipendevano dalla chat | Appendice A integrale |
| Prompt revisione assente | Solo «usa revisione completa» generico | Appendice B dedicata |
| Autosufficienza report | «Vedi chat 29-05-26» | Un solo file per tutta la catena |

**Lezione per skill system (candidate processo, non ancora voce vocabolario):** sessioni `prepara prompt` dovrebbero chiudere con report che include **sempre** Appendice A (+ B se revisione accurata). Segnalabile al revisore Meta in sessione dedicata — **non** aggiunta automatica a VOCABOLARIO (Matteo: no junk).

### Voci PROPOSTE.md aggiunte (in attesa Matteo)

1. **«comportamenti sono ok» / «non è un problema» + «voglio che cambi»** → cambio intenzionale, non bugfix (Liv.2 suggerito).
2. **«compila report … comunicazione … vocabolario (solo sicuro) … annota prompt»** → chiusura meta sessione (Liv.2 suggerito).

**Non proposte al vocabolario:** «task delicata» (già in PREPARA_PROMPT §4); «tutte le categorie aperte» (vincolo task); nomi componenti React.

### Voci Liv.2 — esiti questa chat

| Voce | Esito |
|------|--------|
| «main dell'app» | non usata |
| «menù originale» | non usata |
| Nuove proposte | ancora 0 esiti Liv.2 (appena create) |

---

## Dati comunicazione (per revisore skill system Meta)

### Frasi / richieste (conteggio sessione completa)

| Frase / intento | Volte | Comportamento desiderato |
|-----------------|-------|--------------------------|
| `@PREPARA_PROMPT_SKILL` + DOM path + React component | 1 | Prompt esecutore preciso, non vago |
| «non è un problema» / «comportamenti ok» / «voglio che cambi» | 1 | No framing bug; cambio mirato |
| «task delicata» + chi revisiona | 1 | Dichiarare revisione accurata → Verifica esterno |
| «solo prompt, no modifiche» | 1 | Zero `src/` in chat prepara |
| «categorie tutte aperte insieme» | 1 | Vincolo nel prompt |
| «report comunicazione, vocabolario solo sicuro, no junk, annota prompt» | 1 | PROPOSTE selettive, prompt verbatim |
| «tutto in report? revisore lo sa?» | 1 | Report deve essere autosufficiente |
| «annota tutto … analisi … status skill system» | 1 | Questo consolidamento |

### Cosa ha funzionato in comunicazione

- Tabella schermata → componente → storage.
- Distinzione overlap visivo vs ordine sezioni form.
- Stima revisione esplicita a monte.
- Onestà sul gap documentazione (messaggio 5) → spinta al report v2.

### Cosa evitare

- Domanda A/B overlay vs push quando Matteo ha già descritto l'effetto «passano sopra».
- Etichettare «fix/regressione» se Matteo dice baseline ok.

### Token risparmiabili

- Con report autosufficiente, Matteo non deve incollare prompt dalla chat.
- In prepara-prompt: se DOM path + componente + effetto visivo presenti, saltare domande generiche.

### Automatizzabile vs manuale

| Automatizzabile | Manuale |
|-----------------|--------|
| Report prepara-prompt con Appendici A+B | Promozione PROPOSTE → VOCABOLARIO |
| OSSERVAZIONI log a fine sessione meta | Commit (solo se Matteo chiede) |
| Riscrittura obiettivo se «non è bug» | Revisione skill system periodica (Meta) |

---

## Allineamento skill §7.2 (questa sessione)

| File skill | Azione |
|------------|--------|
| `APP_CONTEXT` RULE Pagina Prenota | Nessuna — fix non implementato |
| `BOOKING_DATA_FLOW` | Nessuna |
| `PREPARA_PROMPT_SKILL` | Nessuna modifica; possibile miglioramento futuro: obbligo Appendice A in report (proposta processo, non implementata) |
| `VOCABOLARIO.md` | Nessuna voce aggiunta |
| `PROPOSTE.md` | +2 candidate |
| `OSSERVAZIONI.md` | Log 29-05-26 |
| Questo report | Versione consolidata finale |

---

## Commit suggeriti (solo se Matteo conferma)

```text
docs(sessione): report prepara-prompt Prenota stacking card ingredienti 29-05-26

docs(comunicazione): OSSERVAZIONI + PROPOSTE da sessione prepara-prompt 29-05-26
```

Usare `git add -f` sui path sotto `docs/` se il `.gitignore` li esclude (regola temporanea PREPARA_PROMPT).

---

## Prossimi passi per Matteo

1. **Esecuzione:** nuova chat Agent → incolla **Appendice A** (o «implementa secondo report 29-05-26 Appendice A»).
2. **Revisione:** dopo esecutore → nuova chat Verifica → incolla **Appendice B** + path diff/commit.
3. **Vocabolario:** approva o rifiuta le 2 voci in `PROPOSTE.md`.
4. **Conferma fix:** «ok funziona» → report esecutore §7 + eventuale aggiornamento APP_CONTEXT se serve.





report agente 2 : 
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



il report agente 3 che ha svolto il lavoro : 
# Report fine sessione — Prenota: scroll interno + overlay card ingredienti

**Data:** 29-05-26  
**Profilo agente:** Esecuzione (Pagina Prenota v2)  
**Esito Matteo:** «ok ora ci siamo!» — conferma successo  
**Test:** `npm run validate` — OK (lint, typecheck, 193 test)  
**Storage DB:** nessuna modifica (solo UI client)

> **Nota esplicita di Matteo (questo report):** ha chiesto di includere riflessioni su **derivazione degli errori** — se venivano da prompt ambigui, da vincoli strutturali preesistenti nel codice, o da scelte/complicazioni dell’agente. Sezione dedicata sotto.

---

## Sintesi per Matteo (Pagina Prenota)

Mario apre una **card categoria** del menù (es. Antipasti) nella Pagina Prenota (`/prenota/:slug`):

1. Vede **circa 3 ingredienti interi** (foto incluse), come prima.
2. Dal **4° ingrediente** scorre **solo dentro** la card, non tutta la pagina.
3. La card aperta **galleggia sopra** campi cliente e riepilogo (overlay), **senza** spingere il layout verso il basso e **senza** ingredienti giganteschi.
4. Chiude cliccando di nuovo sul titolo categoria; cambio sottotab / `resetKey` richiude come prima.

Nessun cambiamento a submit, selezione ingredienti, prezzi o dati su Supabase.

---

## Cronologia completa — prompt e richieste di Matteo

### Fase A — Prompt esecutore (sessione corrente, messaggio iniziale)

Matteo ha incollato il task allineato a `docs/APP_CONTEXT_SKILL.md` con obiettivo:

- Card chiusa: invariata.
- Card aperta: header fisso; pannello `#booking-menu-cat-panel-*` con **max-height = 3 righe tipo “con foto”** + `overflow-y: auto`.
- Formula preferita: `calc(...)` legata alla larghezza card (`100cqw` / `@container`), no `50vh` generico.
- Layout scroll / stack / grid; LOCK su `BookingRequestPage.tsx`; no modal; no submit.
- Superfici: 375 / 900 / 1256px; menù locked e personalizzabile; con/senza foto.
- Fine sessione: report §7.1 + allineamento skill §7.2.

**Interpretazione iniziale agente:** evitare overlap su form e sidebar (il testo diceva «Non deve mai espandersi in sovraimpressione su BookingFormFields né su BookingSummarySidebar»).

### Fase B — Primo feedback Matteo (correzione intento overlap)

> «scusami ma la card espansa, si espande e NON si sovrappone… vorrei che invece si sovrapponesse mostrandosi sopra a loro»

**Correzione chiave:** il comportamento desiderato **non** era “restare nel flusio senza coprire nulla”, ma **overlay intenzionale** sopra form e sidebar. Contraddice il criterio “zero overlap” del prompt esecutore e il report prepara-prompt della stessa giornata (che chiedeva di *smettere* di passare sopra).

### Fase C — Secondo feedback

> «no ancora non funziona» (dopo tentativo `absolute` + `z-index` + `:has()`)

### Fase D — Terzo feedback (dimensioni)

> «ok ora ingredienti si aprono sopra al resto, ma sono sproporzionatamente grandi… devono mostrarsi grandi esattamente come prima con scorrimento»

### Fase E — Conferma finale

> «ottimo ora ci siamo! compila report finale… includere riflessioni su derivazione errori»

---

## Cosa è stato fatto (ordine cronologico implementazione)

| Step | Cosa ha provato l’agente | Esito |
|------|--------------------------|-------|
| 1 | `max-h` calc 3 righe + `@container` + scroll sul pannello; card nel flusso documento | Scroll interno OK; card spinge layout, **no** overlay |
| 2 | `absolute z-40` + placeholder + `:has()` su `#menu-section` / griglia | Overlay **non visibile** (clip + stacking) |
| 3 | **React portal** su `document.body` + `position: fixed` + sync `getBoundingClientRect` | Overlay **funzionante** |
| 3b | Allargamento overlay a larghezza `#booking-request-form` | Overlay copre di più ma ingredienti **enormi** (`100cqw` ≈ larghezza form) |
| 4 | Larghezza portal = **solo shell card** (~280px scroll); rimosso `max-h` viewport sul portal | **Soluzione finale** — Matteo conferma |

---

## Soluzione finale (tecnica documentata per §7.1 / skill)

### Componenti e storage

| Pezzo | Dove nell’app | Cosa fa |
|-------|---------------|---------|
| `BookingMenuCategoryCard.tsx` | Pagina Prenota → menù → card categoria | Collapse/expand; portal quando aperta |
| `bookingMenuComposePanelLayout.ts` | Costanti condivise | Formula cap 3 righe + classe portal |
| `BookingMenuComposeGrid.tsx` | Griglia / striscia categorie | Invariato nel comportamento finale (solo import puliti) |
| `BookingRequestForm.tsx` | Form pubblico | `#menu-section` ripristinato senza hack `:has()` |
| `MenuSelection.tsx` | Sezione menù nel form | Wrapper ripristinato |
| `docs/APP_CONTEXT_SKILL.md` §4 | Skill system | Nota card aperta: scroll 3 righe + portal overlay |

**Storage:** nessuna tabella/chiave DB. Ingredienti e categorie restano da `menu_items`, `menu_categories`, preset/sottotab in `restaurant_settings.booking_public_form_config` come prima.

### Cap “3 ingredienti visibili” — formula e classi

Costante `BOOKING_MENU_CATEGORY_PANEL_SCROLL_CLASS`:

```
overflow-y-auto overscroll-y-contain
max-h-[calc(3*(1rem+0.5rem+44px+(100cqw-1rem)*3/4)+2*1px)]
sm:max-h-[calc(3*(1rem+0.5rem+44px+(100cqw-1rem)*2/3)+2*1px)]
```

**Significato riga tipo “con foto”** (allineato al JSX):

| Parte | Valore CSS | Origine nel componente |
|-------|------------|-------------------------|
| Padding verticale riga | `1rem` | `py-2` sul label |
| Margine sotto foto | `0.5rem` | `mb-2` |
| Riga nome/checkbox | `44px` | `min-h-[44px]` |
| Altezza foto | `(100cqw - 1rem) × 3/4` (default) / `× 2/3` da `sm` | `aspect-4/3` / `sm:aspect-3/2`; `100cqw` = larghezza card (`@container` sull’article) |
| Gap tra righe | `2×1px` | `gap-px` sulla lista |

**Senza foto:** righe più basse; il cap resta su **3 slot “pieni”** → altezza pannello uniforme.

### Overlay (portal)

Costante `BOOKING_MENU_CATEGORY_EXPANDED_PORTAL_CLASS`: `fixed z-[160] shadow-xl`

- Card aperta renderizzata con `createPortal(..., document.body)`.
- Posizione/size da `getBoundingClientRect()` del **shell** (placeholder in striscia); sync su scroll (capture) + resize + `ResizeObserver`.
- **Larghezza = larghezza card chiusa** (≈ `min(280px, calc(100vw-4rem))` in scroll desktop; `100%` colonna in stack mobile).
- `z-[160]` sopra form/riepilogo; sotto sticky bar mobile `z-200`.
- Placeholder invisibile (`aspect-4/3` o stack) mantiene lo spazio in `ComposeScrollRow` senza spostare il layout.

---

## File toccati e effetto per Mario

| File | Effetto per chi prenota |
|------|-------------------------|
| `BookingMenuCategoryCard.tsx` | Aprendo Antipasti/Primi… lista compatta con scroll interno; la card “galleggia” sopra nome/email/riepilogo |
| `bookingMenuComposePanelLayout.ts` | Regole altezza/overlay centralizzate (manutenzione futura) |
| `BookingMenuComposeGrid.tsx` | Nessun cambiamento visibile finale rilevante |
| `BookingRequestForm.tsx` | Solo ripulito da tentativi `:has()` — form identico a prima |
| `MenuSelection.tsx` | Idem |
| `docs/APP_CONTEXT_SKILL.md` | Skill aggiornata per agenti futuri |

**Non toccati (come da vincoli):** `BookingRequestPage.tsx` (LOCK griglia striscia), submit / `useCreateBookingRequest`, logica selezione checkbox.

---

## Riflessioni su derivazione errori *(richiesta esplicita di Matteo)*

### 1. Ambiguità / contraddizione nei prompt (non colpa solo dell’agente)

| Fonte | Cosa diceva | Conflitto |
|-------|-------------|-----------|
| Report prepara-prompt 29-05-26 (sessione Meta mattina) | Obiettivo: ingredienti **non** devono passare sopra campi/riepilogo | Matteo in Fase B ha chiesto **l’opposto** (overlay voluto) |
| Prompt esecutore sessione | «Non deve mai espandersi in sovraimpressione…» + criterio «Zero overlap» | Stesso conflitto con Fase B |
| Prompt esecutore | «Non modal/drawer; non solo z-index lasciando lista illimitata» | Giustamente esclude mezza soluzione; ma **portal + fixed** non era nel prompt — l’agente l’ha dedotto dopo fallimenti |

**Lezione:** per task UI con stacking/scroll, il prompt dovrebbe dichiarare esplicitamente **overlay sì/no** e **larghezza overlay** (card vs colonna form). La stessa giornata aveva due intenti opposti tra prepara-prompt ed esecuzione.

### 2. Vincoli strutturali preesistenti (codice / CSS)

| Vincolo | Perché ha bloccato i tentativi |
|---------|--------------------------------|
| `overflow-x-auto` su `ComposeScrollRow` | In CSS, `overflow-x: auto` fa trattare l’asse Y come `auto` → **taglia** qualsiasi figlio `absolute` che esce verticalmente. Spiega perché `absolute` + `z-index` **non poteva** funzionare dentro la striscia. |
| `@container` + `100cqw` sulle righe ingrediente | Corretto per cap 3 righe **solo se** la larghezza container = larghezza card. Allargando il portal al form intero (~700px), **una riga occupava quasi tutta la viewport** — non un bug di aspect-ratio, conseguenza prevedibile della scelta larghezza. |
| Griglia form 2 colonne ≥1256px | Form e sidebar affiancati: overlay stretto (~280px) copre verticalmente il form sotto la card ma **non** la sidebar a destra orizzontalmente. Accettato da Matteo nella conferma finale. |
| `relative isolate` + `z-10` su wrapper pagina | Richiede portal su `body` o z-index molto alto per overlay globali — pattern già usato dai modal dell’app. |

### 3. Errori / complicazioni dell’agente

| Errore agente | Impatto |
|---------------|---------|
| Ha implementato prima la versione “no overlap” del prompt senza chiedere conferma quando il report prepara-prompt dello stesso giorno descriveva l’intento opposto | Primo giro utile per scroll interno ma **sbagliato** sull’overlay fino a correzione Matteo |
| Ha interpretato male il **primo** messaggio di bug («non si sovrappone» letto come problema da fixare nel senso anti-overlap) | Ritardo fino al chiarimento esplicito di Matteo |
| Tentativo `absolute` + `:has()` + `z-40` senza verificare subito il clip di `overflow-x-auto` | «no ancora non funziona» — tempo perso; avrebbe dovuto testare in browser o ricordare la regola CSS overflow prima |
| Allargamento overlay a larghezza form per coprire anche sidebar | Overlay ok, **dimensioni ingredienti esplose** — errore di comprensione: confondere “copertura orizzontale” con “larghezza contenuto ingredienti” |
| Comunicazione iniziale sul primo feedback utente | L’agente aveva capito l’utente volesse *evitare* overlap; Matteo voleva il contrario — chiarimento solo grazie al secondo messaggio |

### 4. Cosa ha sbloccato la soluzione

1. **Portal React** (stesso pattern di `BookingDetailsModal` / `Modal.tsx`) — esce da tutti i contenitori con overflow.
2. **Larghezza portal = shell card** — ripristina scala foto/`100cqw` originale.
3. **Hard refresh** consigliato a Matteo — HMR a volte lascia bundle intermedi.

---

## Domande poste e risposte

| Domanda agente | Risposta Matteo |
|----------------|-----------------|
| (implicita) overlap sì o no? | **Sì**, overlay voluto sopra form (e idealmente anche riepilogo) |
| Dimensioni ingredienti | **Come prima**, con scroll interno — no full-width form |
| Conferma finale | **«ok ora ci siamo!»** |

Nessuna domanda strutturata AskUserQuestion: l’ambiguità overlap è emersa solo dai messaggi correttivi.

---

## Test eseguiti

```text
npm run validate
→ lint OK, typecheck OK, 193 test OK
```

Verifica manuale agente in browser (`/prenota/da-tommaso`): portal su body, `z-index 160`, overlap su campi form; larghezza ~280px dopo fix finale.

**Non eseguiti:** Playwright e2e dedicati a questa card; nessun test Vitest nuovo (comportamento visivo/layout).

---

## File di skill aggiornati (§7.2)

| Skill | Modifica |
|-------|----------|
| `docs/APP_CONTEXT_SKILL.md` §4 Nota `BookingMenuCategoryCard` | Aggiunta: cap 3 righe (`BOOKING_MENU_CATEGORY_PANEL_SCROLL_CLASS`), portal fixed stessa larghezza card, `z-[160]`, divieto allargare al form intero |
| Altri skill area | Nessuno |

---

## Deviazioni dal plan originale

| Plan (prompt esecutore) | Deviazione | Motivazione |
|-------------------------|------------|-------------|
| Zero overlap form/sidebar | **Overlay intenzionale** | Correzione esplicita Matteo Fase B |
| `max-h` calc, no magic number | Rispettato | — |
| No modal | Rispettato — portal ≠ modal UX | — |
| Possibile helper in `BookingMenuComposeGrid` | Non necessario | Portal risolve clip senza toccare scroll row |
| Criterio “3 righe intere visibili” | Rispettato | Formula `100cqw` invariata |

---

## Cosa resta / note operative

- **Sidebar ≥1256px:** con card ~280px l’overlay **non copre orizzontalmente** la colonna riepilogo a destra; copre il form sotto la striscia categorie. Se in futuro Matteo vuole coprire anche la sidebar, serve decisione prodotto separata (es. overlay full-width **solo come maschera**, mantenendo **colonna ingredienti** stretta — non allargare il `@container` delle righe).
- **Più categorie aperte insieme:** supportate (stato `expanded` per card); ogni aperta ha il suo portal.
- **Commit codice + docs:** non eseguiti in questa sessione salvo richiesta Matteo; file `docs/` richiedono `git add -f` se tracciati.

---

## Dati comunicazione

### Frasi / richieste ricorrenti (questa chat, con conteggio)

| Frase / intento | × | Note |
|-----------------|---|------|
| Prompt esecutore allineato skill + vincoli LOCK | 1 | Task iniziale denso e ben strutturato |
| Correzione intento overlay («voglio sovrapposizione») | 1 | Pivot decisivo — contraddice prompt iniziale |
| «no ancora non funziona» | 1 | Dopo tentativo absolute/z-index |
| Feedback dimensioni sproporzionate | 1 | Dopo portal + full form width |
| «ok ora ci siamo!» + report finale | 1 | Trigger protocollo fine sessione |
| Richiesta esplicita riflessioni derivazione errori | 1 | **Nuovo pattern report** — utile per revisore |
| «spiegamelo semplice» (regola utente permanente) | 0 in questa chat | — |

### Spiegazioni date e formato che ha funzionato

- **Metafora portal:** “disegnare la card fuori dalla striscia scroll, come i popup che già usate nell’admin” — collegamento a pattern esistente.
- **Perché ingredienti giganti:** “la foto segue la larghezza della card; allargando al form intero ogni piatto diventa enorme” — causa-effetto in una frase, senza elenco file.
- Matteo ha reagito bene a **correzioni rapide** dopo feedback secco (“non funziona”, “troppo grandi”) senza report intermedi lunghi.

### Procedure ripetute

- Iterazione: implementa → feedback Matteo → fix mirato (3 cicli visibili).
- Conferma «ok» → report §7.1 + skill già allineata in sessione.

### Voci Liv.2

Nessuna voce Liv.2 del vocabolario applicata in modo esplicito in questa chat.

### Pattern candidati (per `PROPOSTE.md` / revisore — non promossi)

| Candidato | Livello suggerito | Motivo |
|-----------|-------------------|--------|
| «overlay sì/no» obbligatorio nei prompt UI stacking | Rule in PREPARA_PROMPT o APP_CONTEXT | Stessa feature, intenti opposti in 12h |
| «portal + fixed» come pattern standard Prenota per escape overflow scroll | Nota UI_RESPONSIVE | Evita ripetere tentativi absolute |
| Report: sezione «derivazione errori» su richiesta | Procedura report | Matteo l’ha chiesto esplicitamente questa volta |

### Automatizzabile vs manuale

| Automatizzabile | Manuale |
|-----------------|---------|
| `npm run validate` a fine task | Verifica visiva 375/900/1256 + overlap |
| Checklist prompt: dichiarare overlay + larghezza contenuto | Giudizio “coprire sidebar sì/no” |
| — | Scelta portal vs altro (dipende da DOM) |

### Token risparmiabili

- Un prompt unico con **Overlay: sì, larghezza: card chiusa, max 3 righe scroll interno** avrebbe evitato il primo implementazione anti-overlap + il tentativo full-width form.
- Template “se `ComposeScrollRow` + expand → usa portal, non absolute” in skill UI.

---

## Riferimenti sessione correlata

- Prepara-prompt stesso giorno: `docs/Sessioni di lavoro/29-05-26/Report-prepara-prompt-prenota-card-ingredienti-stack-29-05-26.md` (intent overlay **invertito** rispetto a esecuzione pomeridiana).

---

*Report redatto dall’agente di lavoro a conferma successo Matteo — include analisi derivazione errori su richiesta esplicita.*
