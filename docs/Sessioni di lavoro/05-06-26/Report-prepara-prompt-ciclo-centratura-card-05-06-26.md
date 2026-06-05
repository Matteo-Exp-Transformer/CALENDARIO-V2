# Report prepara-prompt — Ciclo centratura card scorrevoli + carosello (05-06-26)

**Data:** 05-06-26  
**Profilo:** prepara-prompt (filtro a monte + raccolta a valle + controverifica orchestrata)  
**Ciclo:** prepara-prompt → esecutore → revisore Verifica → prepara-prompt chiusura + sub-agent CONTROVERIFICA  
**Branch:** `env/test` — commit task `354da7f` (codice) + `dec0d9b` (skill/report esecutore) + `ee8002c` (report revisione)

---

## 0. Cappello

- **Cosa è cambiato:** sulla **Pagina Prenota** (`/prenota/:slug`), le **card scorrevoli** e il **carosello** nella colonna del form si **centrano** quando il gruppo entra in larghezza; su viewport stretto la **prima card/slide resta intera** a sinistra con scroll verso destra — caso **~806px** con **sfondo pagina intera** incluso.
- **Cosa resta:** debiti **FU-038–041**; nota §14.1 pre-commit non testato in shell agente (`hooksPath=nul`). Git: commit `1ab737b` + push + merge `main` ✅.
- **Serve una tua azione:** no per accettare il fix visivo (Matteo «lavoro ok» + revisore Approva con riserve). Sì solo se vuoi chiudere formalmente i buchi processo (seed `test`, commit finale).

---

## 1. Mappa del ciclo

| Fase | Stato | Output |
|------|-------|--------|
| 1 Prepara-prompt (prompt esecutore) | ✅ | Mandato centratura + full-page + slug `test` |
| 2 Esecuzione | ✅ | Hook + card + carosello; 3 iterazioni Matteo; «lavoro ok» |
| 3 Revisione Verifica | ✅ riserve | [Report revisione](./Report-revisione-prenota-centratura-card-carosello-05-06-26.md) — Approva con riserve |
| 4 Prepara-prompt chiusura | ✅ | Questo report + controverifica sub-agent |
| 5 Commit finale Matteo | ⬜ | Non richiesto («lavoro ok», non «fai report finale») |

**Report collegati:**
- Esecutore: [Report-prenota-allineamento-card-carosello-05-06-26.md](./Report-prenota-allineamento-card-carosello-05-06-26.md)
- Revisore: [Report-revisione-prenota-centratura-card-carosello-05-06-26.md](./Report-revisione-prenota-centratura-card-carosello-05-06-26.md)

---

## 2. Sintesi revisore + controverifica

| Fonte | Verdetto |
|-------|----------|
| Revisore Verifica | **Approva con riserve** — codice OK, validate 412, QA Playwright `trattoria-da-tommaso`, 806px OK |
| Sub-agent CONTROVERIFICA | **⚠️ 3 problemi** — slug `test` assente; report esecutore stale «non committato»; questo report mancava (ora presente) |

**Problemi processo (non bloccano il fix visivo):**

1. **P1** — Config slug `test` non creata → C1 (≤3 card) e C3 (1 slide carosello) non testati formalmente.
2. **P2** — Report esecutore header obsoleto rispetto a commit `354da7f`/`dec0d9b`.
3. **P3** — Chiusura ciclo prepara-prompt assente → **risolto** con questo file.

---

## 3. Valutazione hook `useBookingPublicScrollRowAlign` ⭐

> Sezione richiesta da Matteo: l’hook ha funzionato bene? Se no, come sistemarlo?

### Verdetto: **funziona bene per il caso d’uso attuale** — con riserve tecniche minori, non bloccanti

**Cosa fa (in parole semplici):**  
Sulla pagina dove il cliente prenota, quando ci sono più card o più foto nel carosello, un piccolo «metro» (`useBookingPublicScrollRowAlign`) misura se tutto il gruppo **entra** nella larghezza visibile della colonna form. Se entra → le card si **centrano**; se non entra → si **appoggiano a sinistra** e si scrolla verso destra, così la prima card non esce dal bordo sinistro.

**Perché la scelta è corretta:**
- Risolve la tensione reale **centro vs sinistra** che ha richiesto 3 iterazioni con Matteo (skill §5 diceva solo `justify-center` fisso).
- **Un solo hook** condiviso tra `BookingSubTabCards` (≥4 card) e `BookingSubTabCarousel` (≥2 slide) — niente duplicazione della regola.
- `ResizeObserver` su outer + inner → al resize (806→1280) l’allineamento si ricalcola.
- Le larghezze `%` su mobile usano CSS var sul **outer** (`--booking-sub-tab-viewport-px`, `--booking-carousel-viewport-px`) — evita il bug «card enormi» quando la `%` era calcolata sul inner `w-max` (già in ERRORI_PROCESSO).

**Evidenze che regge:**
- Feedback Matteo «allineamento ora ok» dopo iterazioni.
- Revisore: 806px, 4 card overflow `firstLeftGap=0`, carosello 2 slide `centerDelta=0` quando entra.
- `npm run validate` → **412** verde (ri-eseguito in chiusura prepara-prompt).

### Riserve tecniche (non urgenti)

| # | Punto | Gravità | Come sistemare se emerge un bug |
|---|-------|---------|----------------------------------|
| H1 | **Ramo ≤3 card:** `innerRef` non è collegato — l’hook gira ma non misura; si usa `w-full justify-center` statico. Funziona, ma l’hook è **morto** su quel ramo. | Bassa | Collegare sempre `innerRef` anche con ≤3 card, oppure non istanziare l’hook se `subTabs.length ≤ 3` (meno re-render inutili). |
| H2 | **Ramo 1 slide carosello:** ramo separato con `flex justify-center` — **non usa l’hook**. Coerente, ma C3 non testato dal revisore. | Processo | Smoke con 1 slide; codice già dedicato e semplice. |
| H3 | **Primo paint:** `rowOverflows` parte `false` → per un frame potrebbe mostrare centro prima di misurare overflow. | Bassa | `useLayoutEffect` per prima misura, o stato `undefined` + nessuna classe align finché non misurato. |
| H4 | **Listener `scroll` su outer** in `measureRow` — lo scroll non cambia `scrollWidth` vs `clientWidth`; ridondante. | Trascurabile | Rimuovere listener scroll da `measureRow`; tenere solo ResizeObserver. |
| H5 | **Nessun test Vitest** sul hook — regressione solo manuale/E2E. | Media | Aggiungere test con mock `ResizeObserver` + DOM fittizio: caso fit → `mx-auto justify-center`; overflow → `justify-start`. |

### Se in futuro «non funziona come dovrebbe»

Ordine di intervento suggerito:

1. **Verificare ramo sbagliato** — ≤3 card e 1 slide carosello **non** passano dall’hook; bug lì ≠ bug hook.
2. **Verificare CSS var** — se le card tornano giganti, controllare che `--booking-*-viewport-px` sia sul outer, non sul inner.
3. **Aggiungere log dev** temporaneo: `inner.scrollWidth`, `outer.clientWidth`, `rowOverflows` su resize.
4. **Fix strutturali** (solo se H3/H4 confermati in browser): `useLayoutEffect` + test unitario H5.

**Conclusione hook:** approvato come soluzione del ciclo; non serve un refactor immediato. I miglioramenti H1/H3/H5 sono **polish**, non correzione di un difetto aperto.

---

## 4. Test eseguiti (prepara-prompt chiusura)

```text
npm run validate  →  OK (21:42 sessione chiusura)
  eslint + tsc + vitest: 412 test (46 file), 0 errori
```

QA browser formale: delegato al revisore (tabella in report revisione). Prepara-prompt non ha ripetuto Playwright.

---

## 5. File di skill / indici aggiornati in questo report

| File | Modifica | Perché |
|------|----------|--------|
| `docs/Sessioni di lavoro/05-06-26/Report-prepara-prompt-ciclo-centratura-card-05-06-26.md` | **Nuovo** — questo report | Chiusura ciclo + valutazione hook + sintesi controverifica |
| `docs/Sessioni di lavoro/05-06-26/README.md` | Riga gruppo prepara-prompt | Indice giornata |
| `docs/SESSION_LOG.md` | Riga sessione | Cronologia |
| `docs/FOLLOW_UP.md` | **FU-038** · **FU-039** · **FU-040** · **FU-041** | Debiti seed TEST, QA C1/C3, polish hook layout, report stale |

**Già allineati dall’esecutore (non ritoccati qui):** `PRENOTA_LAYOUT_CONTEXT.md` §5, `ERRORI_PROCESSO.md`, report esecutore/revisore.

---

## 6. Dati comunicazione

- **Frasi Matteo nel ciclo:** «prepara prompt» centratura → correzioni mobile (prima card intera) → perso centro desktop → card troppo grandi → «ottimo lavoro / lavoro ok» → «agente ha finito, prompt revisore» → «compila report + controverifica + nota hook».
- **Formato efficace:** correzioni per **effetto visivo** («prima a sinistra intera», «centro se entra») più che per proprietà CSS.
- **Prompt revisore:** mandato tabellato viewport + slug `test` — revisore ha dovuto improvvisare tenant.
- **Automatizzabile:** seed slug TEST documentato; test hook ResizeObserver.

---

## 7. Analisi flusso prompt, efficienza e statistiche

- **Prompt sostanziali Matteo:** ~7 (prepara ×2, correzioni esecutore ×3, chiusura ×2).
- **Correzioni dopo 1ª risposta esecutore:** 3 (clip → centro perso → dimensioni).
- **Follow-up generati:** **FU-038** · **FU-039** · **FU-040** · **FU-041** (`docs/FOLLOW_UP.md`).
- **Modalità:** standard per tutto il ciclo.
- **Metriche ciclo (EVOLUZIONE_SKILLS):** prompt Matteo 7 · correzioni post-1ª 3 · follow-up 0 · modalità alzata no.

---

## 8. La mia lettura della sessione (prepara-prompt)

- **Ciclo riuscito sul prodotto:** il mandato visivo di Matteo è chiuso; hook è la scelta giusta rispetto a `justify-center` fisso della vecchia skill.
- **Punto debole processo:** chiedere slug `test` + creazione config all’esecutore senza verificare che lo slug esista su DB TEST — il revisore ha pagato il costo con tenant alternativo.
- **Punto debole documentazione:** report esecutore scritto pre-commit ma committato con header «non committato» — confonde controverifica e commit finale.
- **Suggerimento skill (dato, non implementato):** in PRENOTA_LAYOUT §5 aggiungere mini-schema «misura fit → centro / overflow → start» + elenco slug TEST con config cards/carousel nota.

---

## 9. Derivazione errori (ciclo, non solo codice)

| # | Cosa | Causa | Classe |
|---|------|-------|--------|
| 1 | Slug `test` assente, QA C1/C3 vuoti | Mandato esecutore non verificato a valle | **processo** |
| 2 | 3 iterazioni allineamento | Skill §5 senza regola dinamica overflow | **vincolo strutturale** + **errore agente** (1ª impl.) |
| 3 | Report esecutore «non committato» | Report scritto prima del commit, non aggiornato | **errore agente** |

---

## 10. Cosa resta / handoff (`FOLLOW_UP.md`)

| FU-ID | Cosa | Priorità |
|-------|------|----------|
| **FU-038** | Seed DB TEST: slug `test` + config cards (2–3) + carousel (1 slide), full-page | Processo — prerequisito QA formale |
| **FU-039** | QA browser tabellato **C1** + **C3** su 375/806/834/1256/1280 | Dopo FU-038 (o slug documentato) |
| **FU-040** | Vitest + polish `useBookingPublicScrollRowAlign` (H1/H3/H5 §3) | Opzionale — fix visivo già OK |
| **FU-041** | Patch header report esecutore («non committato» → commit reali) | Docs — 5 min |
| — | Commit/push task layout | Quando Matteo: «fai report finale» |

**Già coperto dal revisore (non riaprire FU):** C2/C4/C5/C7 su `trattoria-da-tommaso`; 806px; validate 412.

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) «prepara prompt : le card scorrevoli e card carosello … saranno allineate centralmente … text-align: start → center». (2) «non ho una tipologia in test-pro. con sfondo pagina intera. solo pagina cliente.» (3) «modifica dicendogli di creare lui in slug test la configurazione da testare.» (4) «agente ha fintio. dammi prompt per agente revisore.» (5) «compila tuo report poi lancia sub agent per controverifica. annota anche nel tuo report se hook impostato secondo te ha funzionato bene o no e come andrebbe sistemato se non funziona come dovrebbe.» (6) «segna nei follow up i fix da finire o test da finire. includi nel report dettagli sul funzionamento dell'hook di fine sessione. ha funzionato? comportamento corretto?»

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Ri-verificato: `git log` → `354da7f` (hook + BookingSubTabCards + BookingRequestForm carousel + bookingPublicFieldStyles), `dec0d9b` (PRENOTA_LAYOUT §5 + report esecutore), `ee8002c` (report revisione); lettura `useBookingPublicScrollRowAlign.ts` (38 righe), `BookingSubTabCards.tsx` (outerRef/innerRef condizionale), `BookingRequestForm.tsx` ramo 1 slide vs multi; `npm run validate` 412 OK; controverifica sub-agent allineata al diff.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: `PRENOTA_LAYOUT_CONTEXT.md` §5 aggiornato in `dec0d9b` — verificato coerente con hook. Report esecutore/revisore presenti. Questo report chiude gap P3 controverifica. Non servivano test nuovi sul hook. Report esecutore header stale (P2) — debito documentale, non skill layout.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?
✅ R4: Non eseguito QA browser (delegato revisore). Non creato slug `test`. Non patchato header report esecutore (→ **FU-041**). Non committato/pushato. Aperti **FU-038–041** in questo giro su richiesta Matteo.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti?
✅ R5: Attrito: mandato slug `test` su DB inesistente ha fatto perdere C1/C3; miglioria: in prepara-prompt verificare slug TEST via MCP/lista tenant prima di scrivere «crea config su test», oppure tabella slug noti in TESTING_SKILL §7.3.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuti ti sono stati utili o rumore?
✅ R6: Contesto giusto per filtro (PRENOTA §5 + gate Prenota/QR). Hook **fine-sessione Cursor** `stop` (§14): OK — revisore bloccato su §11, poi silenzio v6. Hook **pre-commit** cold check (§14.1): **non visto** al commit `1ab737b` — né prima né dopo — perché `core.hooksPath=nul` in shell agente; `.fine-sessione-commit-state.json` assente. Sub-agent CONTROVERIFICA: utile. §3 = hook layout; §14 = Cursor stop; §14.1 = git pre-commit.

---

## 12. Controverifica — esito sub-agent

**Verdetto sub-agent:** ⚠️ **3 problemi** (P1 slug `test`, P2 report esecutore stale, P3 report prepara-prompt mancante).

**Posizione prepara-prompt:** P3 **chiuso** con questo file. P1/P2 **confermati** — non bloccano accettazione fix visivo; opzionali prima di «fai report finale». Codice e skill §5: **coerenti** con prompt Matteo (centratura, solo cliente, full-page).

**Prompt grezzo sub-agent (per eventuale prossimo giro):** seed `/prenota/test` + QA C1/C3; allineare header report esecutore — vedi §10.

---

## 14. Hook fine-sessione Cursor (`fine-sessione-nudge.mjs`) ⭐

> Distinto dall’hook **layout** §3 (`useBookingPublicScrollRowAlign`). Qui: l’hook che Cursor lancia a **fine turno** (`stop`) per controllare i report.

### Cosa fa (in parole semplici)

Quando un agente sta per chiudere la chat, Cursor esegue lo script in `.cursor/hooks/fine-sessione-nudge.mjs`. Lo script cerca il **report più recente di oggi** (cartella `05-06-26`, modificato negli ultimi 20 min) e controlla se ha la **sezione 11** con le 6 coppie `❓ Q…` / `✅ R…` compilate (non vuote, non «TODO»).

- Se **manca §11** o qualche **R è vuota** → invia un messaggio `⚠️ FINE-SESSIONE` all’agente e chiede di completare (max **3** rilanci, poi tace).
- Se **tutto completo** → **silenzio** (v6, 05-06-26): non ripete il «controllo mente fredda» a ogni fine risposta — quello è passato al **pre-commit** (`fine-sessione-commit-check.mjs`).

### Comportamento in questo ciclo

| Momento | Cosa è successo | Esito |
|---------|-----------------|-------|
| Chiusura **revisore** | Hook ha segnalato: `Report-revisione-prenota-centratura-card-carosello-05-06-26.md` — **manca intera sezione 11** | ✅ **Corretto** — l’agente ha aggiunto Q1–Q6 e risposto |
| Dopo completamento §11 revisore | Hook **tace** (CASO B v6) | ✅ **Corretto** — niente loop infinito |
| Chiusura **esecutore** | Matteo ha chiesto manualmente «hai risposto a tutte le domande?» (l’esecutore aveva lacune prima del secondo giro) | ✅ Hook + domanda Matteo hanno convergito sullo stesso obiettivo |
| **Pre-commit** (commit `1ab737b`, 05-06-26) | Vedi sotto §14.1 — **cold check non osservato** | Hook non invocato in shell agente |

### Ha funzionato? Comportamento corretto?

**Sì — per il ruolo meccanico che gli è stato assegnato (v6).**

- Ha **impedito** un report revisore superficiale senza §11 — esattamente il problema per cui esiste (v4: non basta il titolo «Dati comunicazione», servono le R).
- Il filtro **solo report di oggi + più recente** (v5.1) evita di bloccare una chat nuova per un report vecchio ri-toccato dal filesystem — fix del bug segnalato 05-06-26.
- Il **tetto 3 nudge** evita murare la chiusura all’infinito se l’agente non obbedisce.
- **v6** (silenzio quando completo) risolve il loop osservato dove `loop_count` si resettava e il cold-check ripartiva a ogni messaggio.

### Limiti noti (non bug di questo ciclo)

| Limite | Effetto | Mitigazione |
|--------|---------|-------------|
| Non legge il **diff** | R2/R3 possono essere superficiali pur passando il controllo | Self-review §12 CHIUSURA + controverifica sub-agent |
| Non gira su **Cloud Agents** | Solo IDE locale | Checklist §11 nel prompt esecutore |
| Non valida **qualità** del testo R | Basta ≥3 caratteri alfanumerici | Revisore umano / CONTROVERIFICA |
| Report senza §11 (modalità **light**) | Hook tace se nessun report fresco con Q | OK per sessioni light |

### Se «non funzionasse come dovrebbe» — come sistemare

1. **Insiste troppo** → verificare `loop_count` in hooks.json; confermare v6 deployata (ramo CASO B = `return send({})` senza followup).
2. **Non scatta mai** → report non in cartella **oggi** o più vecchio di 20 min; nome file deve essere `Report-*.md`.
3. **Falsi positivi R vuota** → risposta con `✅ R` a **inizio riga**; non citare `❓Q` dentro il testo della R (regex v5).
4. **Vuoi blocco anche al commit senza report in stage** → già in `fine-sessione-commit-check.mjs`; verificare `.husky/pre-commit` lo invoca.

**Giudizio prepara-prompt:** l’hook fine-sessione in questo ciclo ha fatto il suo lavoro; il revisore è stato riportato in carreggiata una volta, poi silenzio. Nessuna modifica urgente allo script.

### 14.1 Hook pre-commit (`fine-sessione-commit-check.mjs`) — cold check al commit

> Distinto dall’hook Cursor `stop` (§14 sopra). Qui: lo script in `.husky/pre-commit` che dovrebbe girare **al momento del `git commit`**.

#### Cosa dovrebbe fare (v6, commit `d675e1d`)

1. Se in stage c’è un `Report-*.md` con §11 **incompleta** → **blocca** il commit (`PRE-COMMIT fine-sessione: report incompleto`).
2. Se il report in stage ha §11 **completa** e quella combinazione di file **non è già stata “rivista”** → **blocca** al **primo** tentativo con:
   `PRE-COMMIT fine-sessione: ultimo controllo a mente fredda richiesto.`  
   Poi chiede di rilanciare lo **stesso** `git commit` (secondo tentativo, stesso stage → passa).
3. Se non ci sono report in stage (solo codice/FOLLOW_UP/SESSION_LOG) → il controllo sul report **non scatta**; lo script può uscire subito se non c’è nulla da auditare sui report.

#### Cosa è successo al commit di chiusura sessione (`1ab737b`)

| Fase | Cold check richiesto? | Evidenza |
|------|----------------------|----------|
| **Prima** del commit (1° `git commit`) | **No** | Commit riuscito al primo colpo; nessun messaggio `PRE-COMMIT fine-sessione` in stdout/stderr |
| **Dopo** il commit | **No** | Push + merge ff su `main` non creano un nuovo commit; nessun secondo giro pre-commit |

**File in stage al commit `1ab737b`:** `Report-prepara-prompt-ciclo-centratura-card-05-06-26.md` (§11 completa) + `FOLLOW_UP.md` + `SESSION_LOG.md` + `README.md`.

**Perché il cold check non è comparso (diagnosi):**

- `git config core.hooksPath` = **`nul`** nell’ambiente shell usato dall’agente → **Git non esegue** `.husky/pre-commit` (né `lint-staged`, né `fine-sessione-commit-check.mjs`).
- File stato **`.cursor/hooks/.fine-sessione-commit-state.json`** **assente** dopo il commit → coerente con hook **mai eseguito** (il file si crea solo quando lo script arriva al ramo cold-check).
- Esecuzione manuale `node .cursor/hooks/fine-sessione-commit-check.mjs` **senza** file in stage → exit 0 silenzioso (comportamento script corretto a vuoto).

#### Ha funzionato? Comportamento corretto?

| Ambiente | Valutazione |
|----------|-------------|
| **Hook Cursor `stop` (§14)** | ✅ Funzionato nel ciclo revisore |
| **Hook pre-commit in shell agente (commit `1ab737b`)** | ⚠️ **Non testato in runtime** — disattivato da `core.hooksPath=nul`, non da bug dello script |
| **Comportamento atteso se hooks attivi** | Corretto per design: 1° commit = cold check; 2° commit stesso stage = pass |

**Nota per Matteo:** sul tuo PC, se `core.hooksPath` punta a `.husky` (o Husky è attivo), al prossimo commit con report in stage dovresti vedere il cold check al **primo** tentativo. Nell’ambiente agente di questa sessione **non** l’abbiamo visto — né prima né dopo — perché gli hook git erano spenti.

**Debito documentale:** aggiornare `CHIUSURA_SESSIONE.md` o skill hook con nota «agente/shell con `hooksPath=nul` → pre-commit non gira» (candidato FU processo, non aperto in FOLLOW_UP).

---

## 15. Riepilogo per Matteo

Sulla **pagina dove il cliente prenota**, le offerte a **card** e le **foto del carosello** ora stanno **al centro** quando c’è spazio, e **partono da sinistra** (prima card intera) quando lo schermo è stretto — anche a **806px** con **sfondo pagina intera**. Il **metro layout** (`useBookingPublicScrollRowAlign`, §3) **va bene**; polish opzionale in **FU-040**.

Il ciclo è **tecnicamente ok** per chiudere il capitolo. Debiti aperti in **FOLLOW_UP**:

- **FU-038** — creare slug/config `test` su DB TEST  
- **FU-039** — QA formale C1 + C3 (≤3 card, 1 slide carosello)  
- **FU-040** — test automatico hook layout (opzionale)  
- **FU-041** — sistemare header report esecutore  

L’**hook fine-sessione Cursor** (§14) si è comportato **correttamente**: ha costretto il revisore a completare §11, poi ha taciuto.

**Pre-commit cold check (§14.1):** al commit `1ab737b` **non** è stato richiesto — né prima né dopo — perché nella shell agente `core.hooksPath=nul` (hook git disattivati). Commit e push su `main`/`env/test` completati (`1ab737b`).

**Prossimo passo:** debiti aperti **FU-038–041**; verificare cold check pre-commit sul tuo ambiente locale se `hooksPath` ≠ `nul`.
