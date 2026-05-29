# Report — Dialogo sostituzione conflitto promo (29-05-26)

Follow-up a [Report promo multi-target](Report-promo-multi-target-29-05-26.md) e [Report promo Personalizza form](Report-promo-personalizza-form-29-05-26.md).

## Obiettivo

In **Impostazioni → Personalizza form → Messaggio Promozionale**, quando l’admin salva una promo (modale inline) con tipologia o card/carosello già occupati, non deve più succedere il “silenzio”: serve dialogo esplicito con scelta **Sostituisci** / **Annulla**.

## Cosa è stato fatto (ordine cronologico)

1. **Helper conflitto e merge** in `menuPromo.ts`: `findMenuPromoPlacementConflicts`, `hasMenuPromoPlacementConflicts`, `buildMenuPromoReplacementConfirmMessage`, `applyMenuPromoWithReplacement`. Confronto su promo già in lista normalizzate; merge rimuove i target in conflitto dalle promo vecchie (`normalizeMenuPromoPlacement` → `placement: 'none'` se vuote).
2. **`BookingFormPromoSection`**: al click su «Aggiungi alla lista» / «Applica modifiche», rilevamento conflitti prima di `setPromos`; prima implementazione con `window.confirm`.
3. **Test unitari** in `menuPromo.test.ts` (+6): conflitto tipologia, merge, edit esclude self, annulla = lista invariata (helper), demotion a `none`, conflitto sub_tab.
4. **Feedback Matteo**: dialogo non visibile in prova reale → sostituito `window.confirm` con **`Modal`** dedicato (`PromoPlacementConflictDialog`, z-index stack admin).
5. **Conferma Matteo**: «ottimo funziona».
6. **Copy modale semplificato** su richiesta: intro breve + «Sostituire con «nome promo»?»; **correzione post-report**: elenco con freccia e nome promo esistente ripristinato (l’agente aveva rimosso per errore una parte non chiesta).

## Effetto per il ristoratore

- In **Personalizza form → Messaggio Promozionale**, se assegna la stessa tipologia (es. «Prenota un tavolo») a due promo diverse, al salvataggio dell’editor compare un **modale chiaro** con:
  - frase introduttiva breve;
  - elenco **tipologia → «nome promo già abbinata»** (es. «Prenota un tavolo → «Promo estate»»);
  - domanda «Sostituire con «nome nuova promo»?».
- **Sostituisci** → la promo nuova prende i target; la vecchia li perde (resta valida se ha altri target, altrimenti resta promo solo testo).
- **Annulla** → nessun cambiamento in lista; l’editor resta aperto con la bozza intatta.
- Il **Salva sezione** in fondo continua a salvare solo la lista già accettata in memoria (comportamento invariato).

## Storage (dati)

- Tabella **`restaurant_settings`**, chiave **`booking_menu_promos`**: JSON array di promo (`id`, `label`, `message`, `placement`, `booking_types[]` o `sub_tab_refs[]`, `visible_on_booking`). **Nessuna modifica al modello** — solo UX e logica client prima del dirty locale.

## File toccati

| File | Perché |
|------|--------|
| `src/features/booking/constants/menuPromo.ts` | Logica pura conflitti + merge sostituzione |
| `src/features/booking/components/settings/BookingFormPromoSection.tsx` | Modale conflitto + flusso salvataggio editor |
| `src/features/booking/constants/__tests__/menuPromo.test.ts` | Copertura helper conflitto/merge |

## Domande e risposte in chat

| Domanda / feedback Matteo | Risposta / esito |
|---------------------------|------------------|
| (prompt follow-up) conflitto promo silenzioso | Implementazione helper + dialogo |
| «non vedo il modal» | `window.confirm` → `Modal` React; confermato funzionante |
| Copy modale: intro breve + «sostituire con [nome]» | Agente ha rimosso per sbaglio freccia → nome promo in elenco | Ripristinato; «non ti ho detto di cambiarlo» |
| «aggiorna report… mismatch comunicazione» | Meta | Report § Dati comunicazione aggiornato |

## Test eseguiti

| Test | Esito |
|------|-------|
| `npm run validate` (lint + typecheck + 217 test) | **OK** |
| Manuale admin: due promo stessa tipologia → modale → Sostituisci | **OK** (Matteo) |
| Manuale: Annulla + editor aperto | Non dichiarato esplicitamente; merge coperto da unit test |

## File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| Nessuno (codice skill / APP_CONTEXT / BOOKING_FORM_CONFIG) | — | Task originale: «Non modificare skill/docs in questa sessione»; aggiornati solo report + OSSERVAZIONI + SESSION_LOG per protocollo fine-chat |

**Candidati skill (per sessione revisore / prossima Esecuzione):**

- `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md` § Messaggio Promozionale: documentare modale conflitto + regola «max 1 promo per target» con sostituzione esplicita.
- `APP_CONTEXT_SKILL.md` §4 RULE Menu Prenota (riga promo): puntatore a questo report.
- Prompt follow-up futuri: preferire **`Modal.tsx`**, non `window.confirm`, per conferme visibili in admin (allineato **FU-003**).

## Derivazione errori

| Problema | Causa | Come evitare |
|----------|-------|--------------|
| Matteo non vedeva il dialogo conflitto | **Errore agente** + **prompt incompleto**: implementato `window.confirm` come suggerito nel follow-up; in ambiente reale non percepito come «modale» o poco visibile | Nei prompt admin UX, specificare «usa `Modal` condiviso, non `window.confirm`»; allineare a FU-003 |
| Prima iterazione: percepito «non fa niente» sul conflitto | **Bug preesistente** (solo toast) — risolto in sessione precedente/follow-up | — |
| Elenco modale senza freccia → nome promo esistente | **Errore agente**: over-simplification del copy richiesto; trattato «mostra solo questo testo» come rewrite intero blocco | Delta esplicito: cambiare solo intro/chiusura citate; non toccare formato riga elenco non menzionato |

## Cosa resta / follow-up

| ID | Nota |
|----|------|
| FU-001 | Invariato — polish promo in calendario/dettaglio |
| FU-002 | Invariato — autosave Personalizza form |
| FU-003 | **Rafforzato da questa sessione**: `PromoPlacementConflictDialog` è un secondo caso d’uso per un `ConfirmDialog` condiviso |
| — | QA manuale esplicito su **Annulla** (editor aperto, lista invariata) — opzionale |
| — | QA conflitto su **card/carosello** (stesso modale, copy adattivo) — non testato da Matteo in chat |

## Dati comunicazione

### Cronologia / prompt di Matteo (annotati)

| # | Prompt (fedele / sintesi) | Intento | Esito agente |
|---|---------------------------|---------|--------------|
| 1 | Follow-up strutturato: conflitto abbinamento promo, dialogo sostituzione, helper in `menuPromo.ts`, test, criteri di fatto, «non modificare skill/docs» | Esecuzione feature UX + logica | Implementato helper + toast/confirm + test; validate verde |
| 2 | «non vedo il modal che avvisa e la scelta tra le due opzioni quando provo a salvare con conflitto» | Bug report UX post-deploy | Diagnosi: `window.confirm` insufficiente → `Modal` app; Matteo non aveva specificato quale pulsante — agente ha chiarito in risposta «Aggiungi alla lista» vs «Salva sezione» |
| 3 | «ottimo funziona» | Conferma successo | — |
| 4 | Copy modale: intro breve + elenco + «sostituire con [nome]» | Refinement testi UI | Agente ha semplificato **troppo** l’elenco (tolta freccia → nome promo); Matteo: «non ti ho detto di cambiarlo» |
| 5 | «aggiorna report… mismatch comunicazione» | Correzione + meta | Ripristino elenco + report aggiornato |
| 6 | «mostra freccia e nome promo come prima… non ti ho detto di cambiarlo» | Correzione copy elenco | Ripristinato `tipologia → «promo esistente»` nel modale |

### Frasi ricorrenti (conteggio sessione)

| Frase / intento | × |
|-----------------|---|
| Follow-up prompt già preparato (esecuzione diretta) | 1 |
| Conferma visiva «non vedo X» | 1 |
| «ottimo funziona» | 1 |
| Refinement copy UI puntuale (verbatim / delta) | 1 |
| «non ti ho detto di cambiarlo» | 1 |
| Report fine sessione + feedback skill system | 1 |

### Spiegazioni che hanno funzionato

- **Schermata + effetto** («Personalizza form → Messaggio Promozionale», cosa succede con Sostituisci/Annulla) — allineato a user rule «spiegami semplice + storage».
- **Nota operativa** su quale pulsante apre il dialogo (editor vs Salva sezione) — utile dopo il «non vedo il modal».
- **Breve** dopo il fix: 4 punti numerati per riprovare — Matteo ha confermato subito dopo.

### Voci Liv.2 applicate

| Voce | Esito | Nota |
|------|-------|------|
| (nessuna voce VOCABOLARIO letta formalmente a inizio sessione) | — | Prompt follow-up era auto-sufficiente |

### Mismatch comunicazione (copy modale — lezione sessione)

| Cosa chiedeva Matteo | Cosa fece l’agente | Esito |
|----------------------|-------------------|-------|
| Cambiare **intro** («esistono altre promo…») e **chiusura** («sostituire con [nome]») | Ha anche **rimosso** dalla lista il formato `tipologia → «promo esistente»` | **Errore agente** — interpretazione eccessiva del «semplifica» |
| Mantenere info su **quale promo** occupa già il target | Elenco solo nomi tipologia, senza freccia né nome promo | Matteo: «non ti ho detto di cambiarlo» → ripristino |

**Regola emersa per agenti:** quando Matteo incolla copy desiderato, trattare come **delta esplicito** — modificare solo le parti citate; **non** semplificare altre righe/UI non menzionate. In dubbio: chiedere «tolgo anche X?» (Liv.2) invece di assumere.

**Classificazione derivazione errori:** **errore agente** (prompt ambiguo solo in parte — «mostra come testo solo questo» poteva essere letto come sostituire tutto il blocco, ma l’elenco con freccia non era nel testo nuovo e non andava rimosso).

### Pattern nuovi (candidati vocabolario / PROPOSTE)

- **«non vedo il modal»** dopo implementazione con `window.confirm` → interpretare come richiesta di **UI modale in-app**, non popup browser.
- **Copy verbatim in chat** («mostra come testo solo questo: …») → applicare testo esatto **solo alle parti citate**; non rimuovere elementi UI non menzionati. Liv.2 candidato (cautela se il delta non è esaustivo).
- **«non ti ho detto di cambiarlo»** → segnale forte di over-editing; ripristinare e chiedere scusa breve + fix immediato.

### Cosa si può automatizzare vs manuale

| Automatizzabile | Manuale |
|-----------------|---------|
| `npm run validate` pre-chiusura | Smoke admin conflitto tipologia + card |
| Template report § Dati comunicazione | Giudizio revisore su promozioni vocabolario |
| Regola lint/prompt: no `window.confirm` per conferme admin visibili | Decisione FU-003 componente condiviso |

### Token risparmiabili

- Follow-up prompt **molto strutturato** (problema, obiettivo, helper suggeriti, NON fare, test, criterio di fatto) → ~0 domande di chiarimento, 1 turno esecuzione. **Da replicare** in `PREPARA_PROMPT_SKILL`.
- Matteo ha dovuto correggere visibilità modale: evitabile con rule «admin confirm = Modal» (~1 turno intero risparmiabile).
- Over-editing copy modale (elenco freccia): ~1 turno correzione; regola «delta esplicito» in PROPOSTE.

### Cosa non è successo in chat

- Nessuna lettura formale di `VOCABOLARIO.md` a inizio sessione (solo `APP_CONTEXT_SKILL.md` via @).
- Nessun commit / push (non richiesti).
- Nessun QA manuale card/carosello dichiarato da Matteo.
- Nessun aggiornamento skill di area (vincolo esplicito nel prompt iniziale).
- Nessuna prova esplicita «Annulla» in browser da Matteo.
- Nessun test Playwright UI sul modale.

---

## Esperienza agente — skill system (feedback per revisore)

### Come mi sono trovato

**Positivo**

- **Profilo Esecuzione** (`APP_CONTEXT_SKILL.md` §0.0): corretto per il task; non serviva Testing-Skill finché non c’era bug report.
- **Follow-up prompt**: eccellente — scope chiaro, file target, helper nominati, test attesi, «cosa NON fare» (no skill/docs, no Prenota). Ha permesso implementazione in un passaggio con validate verde.
- **User rule «spiegami semplice + componente + storage»**: utile nelle risposte a Matteo; riduce rischio risposte solo tecniche.
- **Codice area già maturo** (`menuPromo.ts`, `validateMenuPromoUniqueness`, `BookingFormPromoSection`): estensione naturale senza toccare LOCK.

**Critico**

- **`window.confirm` nel prompt suggerito** ha indotto una scelta UX sbagliata per Matteo; **FU-003** esisteva già ma non era nel percorso di lettura obbligatorio per questo task.
- **`BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md`** non caricato (tabella APP_CONTEXT lo cita per agenti su Personalizza form) — avrebbe aiutato su pattern salvataggio modale vs sezione.
- **Skill comunicazione** non caricata a inizio (solo a fine); per report ok, per chat intermedia avrebbe potuto abbreviare ulteriormente.

### Cosa migliorare (proposte concrete)

1. **Regola prompt / FU-003**: in follow-up admin UX, default = `Modal` + due pulsanti; vietare `window.confirm` salvo Classic tab legacy.
2. **Checklist post-implementazione dialogo** (1 riga in Testing-Skill o BOOKING_FORM context): «verificare visibilità modale in admin reale, non solo unit test».
3. **PREPARA_PROMPT_SKILL**: promuovere il formato del follow-up conflitto promo come template (problema → obiettivo numerato → helper → NON fare → test → criterio di fatto).
4. **APP_CONTEXT routing**: per task solo `BookingFormPromoSection`, caricare **solo** `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md` (sezione promo) invece di intero APP_CONTEXT — riduzione token.
5. **Documentazione prodotto** (post-autorizzazione Matteo): una nota in BOOKING_FORM context sul flusso conflitto — evita re-introduzione toast-only.
6. **Componente condiviso**: estrarre `PromoPlacementConflictDialog` → `ConfirmDialog` generico (FU-003) quando Matteo approva.

### Valutazione sintetica skill system per questo lavoro

| Aspetto | Voto operativo | Nota |
|---------|----------------|------|
| Routing APP_CONTEXT | 8/10 | Profilo giusto; context panel promo opzionale mancante |
| Prompt follow-up | 9/10 | Quasi perfetto; unica falla suggerimento `window.confirm` |
| Comunicazione utente | 7/10 | Over-simplification copy modale; corretto su «non ti ho detto di cambiarlo» |
| Testing-Skill | N/A | Non caricata; validate sufficiente fino al bug visivo |
| Chiusura sessione | 7/10 | Report richiesto esplicitamente; altrimenti mancava trigger automatico su «ottimo funziona» (PROPOSTE «lavoro ok» in attesa) |
