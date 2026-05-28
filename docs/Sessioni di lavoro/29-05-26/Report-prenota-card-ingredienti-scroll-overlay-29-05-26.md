# Report fine sessione — Prenota: scroll interno + overlay card ingredienti

**Data:** 29-05-26  
**Profilo agente:** Esecuzione (Pagina Prenota v2)  
**Esito Matteo:** «ok ora ci siamo!» (implementazione) → «revisione ok» (chiusura + commit)  
**Test:** `npm run validate` — OK (lint, typecheck, 193 test) — verificato anche in chiusura sessione  
**Storage DB:** nessuna modifica (solo UI client)  
**Commit:** eseguiti a richiesta Matteo in chiusura (codice + docs separati, vedi § Commit)

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

### Fase E — Conferma implementazione

> «ottimo ora ci siamo! compila report finale… includere riflessioni su derivazione errori»

### Fase F — Chat revisione + chiusura protocollo (stessa giornata, agente successivo)

1. **Prompt esecutore completo** (incollato da Matteo): obiettivo scroll interno max 3 ingredienti, formula `calc`/`100cqw`, layout scroll/stack/grid, LOCK `BookingRequestPage`, no modal, superfici 375/900/1256px, criterio «zero overlap» nel testo prompt.
2. **Agente di verifica:** conferma implementazione già presente, riepilogo formula/classi, `npm run validate` OK, verifica browser su `/prenota/da-tommaso` (portal `fixed z-160`, larghezza ~280px, 6 ingredienti con scroll interno `overflow-y: auto`).
3. **Matteo — chiusura sessione:**

> «ottimo. revisione ok. compila tuo report di fine sessione, e si esaustivo in merito a indicazioni e decisioni prese e ricevute, anche i prompt che ti ho dato io. poi fai anche commit rimani allineato a skill system @docs/APP_CONTEXT_SKILL.md»

**Decisioni in chiusura:** report §7.1 esaustivo + skill §7.2 già allineata + commit dedicati (codice / docs) + aggiornamento `SESSION_LOG.md` e `OSSERVAZIONI.md`.

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
- **Commit codice + docs:** eseguiti in chiusura sessione (P7) — commit separati codice / docs(comunicazione).

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
| «revisione ok» + report esaustivo + commit + skill system | 1 | Chiusura P7 — pattern §7 completo |
| Richiesta esplicita riflessioni derivazione errori | 1 | **Nuovo pattern report** — utile per revisore |
| «spiegamelo semplice» (regola utente permanente) | 0 in questa chat | — |

### Spiegazioni date e formato che ha funzionato

- **Metafora portal:** “disegnare la card fuori dalla striscia scroll, come i popup che già usate nell’admin” — collegamento a pattern esistente.
- **Perché ingredienti giganti:** “la foto segue la larghezza della card; allargando al form intero ogni piatto diventa enorme” — causa-effetto in una frase, senza elenco file.
- Matteo ha reagito bene a **correzioni rapide** dopo feedback secco (“non funziona”, “troppo grandi”) senza report intermedi lunghi.

### Procedure ripetute

- Iterazione: implementa → feedback Matteo → fix mirato (3 cicli visibili).
- Conferma «ok» → report §7.1 + skill + commit (P7: «revisione ok» senza ripetere istruzioni §7).

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

## Appendice — Tutti i prompt di Matteo (cronologia)

| # | Quando | Testo / intento | Esito |
|---|--------|-------------------|-------|
| P0 | Mattina | Prepara-prompt: comportamenti ok, cambio mirato, non bugfix | Prompt esecutore generato |
| P1 | Pomeriggio | Prompt esecutore scroll 3 righe + calc + LOCK + verify breakpoint | Prima impl. no overlay |
| P2 | Pomeriggio | «voglio overlay sopra form/riepilogo» | Pivot prodotto |
| P3 | Pomeriggio | «no ancora non funziona» | absolute/z-index fallisce |
| P4 | Pomeriggio | ingredienti troppo grandi — come prima con scroll | larghezza = shell card |
| P5 | Pomeriggio | «ok ora ci siamo!» + report derivazione errori | Report v1 + skill |
| P6 | Sera | Ripetizione prompt P1 (chat verifica) | validate + browser OK |
| P7 | Sera | «revisione ok» + report esaustivo + commit + skill | Report v2 + commit |

---

## Commit (chiusura P7)

| Commit | File |
|--------|------|
| `feat(prenota): …` | `BookingMenuCategoryCard.tsx`, `bookingMenuComposePanelLayout.ts` |
| `docs(comunicazione): …` | Report, `APP_CONTEXT_SKILL.md`, `.cursor/skills/…`, `OSSERVAZIONI.md`, `SESSION_LOG.md`, `PROPOSTE.md` |

**Fuori scope commit** (modifiche locali altre sessioni): carosello toggle 28-05.

---

*Report consolidato — implementazione P5, revisione e commit P7.*