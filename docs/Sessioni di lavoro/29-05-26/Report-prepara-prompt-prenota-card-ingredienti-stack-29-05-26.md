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
