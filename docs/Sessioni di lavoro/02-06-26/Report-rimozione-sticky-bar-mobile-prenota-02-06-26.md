# Report finale sessione — Pagina Prenota (sticky bar mobile + chiarimento hook)

**Data:** 02-06-26  
**Profilo:** Esecuzione (standard) + chiusura Q&A hook (stessa chat, proseguimento)  
**Stato:** ✅ **report finale** — task 1/3 del [ciclo annotazioni test](Report-finale-ciclo-annotazioni-test-prenota-02-06-26.md); filone layout full-page ancora aperto (report dedicato)  
**Commit:** `445692d` (codice), `42f88c8` (docs) su `origin/env/test`

---

## Cappello

- **Cosa è cambiato:** Su telefono/tablet (<1256px) in Pagina Prenota c’è **un solo** riepilogo in fondo al form con **un solo** «Invia»; niente barra fissa in basso né overlay duplicato.
- **Cosa resta:** (1) Smoke mobile post-deploy su tenant test. (2) Task layout full-page ancora pendenti dal filone precedente (riepilogo 1256–1599 da verificare, sottotab responsive). (3) Eventuale allineamento hook `stop` al contratto Cursor (`followup_message`).
- **Serve una tua azione:** prova da mobile; poi nuova chat **prepara prompt** con handoff sotto.

---

## Cosa è stato fatto (codice)

1. Rimosso `BookingStickyBar` da `BookingRequestPage.tsx` + import/stato `isSummaryVisible`.
2. Rimosso `onVisibilityChange` e `IntersectionObserver` da `BookingSummarySidebar.tsx`.
3. Eliminato `BookingStickyBar.tsx`.
4. Spacer colonna destra: `h-20 min-[1256px]:h-4` → `h-4` (§0 LOCK aggiornato in doc).
5. `BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` §0 + §4 allineati.
6. `npm run validate` OK; commit + push su `env/test` su richiesta Matteo.

**Desktop ≥1256px:** invariato.

---

## File toccati

| File | Perché |
|------|--------|
| `src/pages/BookingRequestPage.tsx` | Rimozione sticky bar, stato, spacer |
| `src/features/booking/components/publicBooking/BookingSummarySidebar.tsx` | Pulizia observer |
| `src/features/booking/components/publicBooking/BookingStickyBar.tsx` | Eliminato |
| `docs/per-ui-design-skill/BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` | §0, §4, §4.1, §7 |

---

## Test eseguiti

| Test | Esito |
|------|--------|
| `npm run validate` | OK (276 test) |
| Smoke 375 / 834 / 1280 | **Non eseguito** (agente) — Matteo post-push |

---

## File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` | §0 spacer, §4 mobile senza sticky bar | Allineamento layout |
| `Report-prenota-full-page-freeze-ciclo-layout-02-06-26.md` | non modificato in questa chat | Filone aperto — vedi handoff |
| VOCABOLARIO / OSSERVAZIONI / hook script | nessuna modifica codice hook in questa sessione | Solo analisi documentata qui |

---

## Dati comunicazione

- **Prompt esecutivo sticky bar:** scope stretto, LOCK §0, file ammessi espliciti — efficace.
- **Seconda metà chat:** domande su hook `stop` — Matteo voleva capire **quando** Cursor lo considera, non ripetizioni generiche.
- **Frustrazione segnalata:** spiegazioni hook percepite come confuse / ripetitive → questo report include sezione tecnica **ordinata** per il revisore e per il prossimo prepara-prompt.
- **Regola nuova richiesta da Matteo (da portare ai prompt esecutori):** vedi § sotto «Regola agenti — informazioni».

### Prompt di Matteo annotati (questa chat, ordine cronologico)

| # | Quando | Testo (verbatim o sintesi fedele) | Effetto / nota |
|---|--------|-----------------------------------|----------------|
| **P1** | Avvio | **Profilo: Esecuzione**, modalità standard. Skill: `BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` (§4 sticky bar, §0 LOCK), `UI_RESPONSIVE_SKILL.md`. Non caricare `BOOKING_DATA_FLOW_SKILL`, `MENU_ADMIN_CONTEXT`. **Obiettivo:** su Pagina Prenota `<1256px` un solo riepilogo in fondo (`BookingSummarySidebar` + `submitButton`); **eliminare del tutto** `BookingStickyBar` (mini-riepilogo, overlay, secondo Invia). Desktop ≥1256 invariato. Implementazione: rimuovere render da `BookingRequestPage`, pulire `isSummaryVisible` / `onVisibilityChange` / IntersectionObserver, valutare spacer `h-20`, eliminare file orphan, non toccare `BookingSummarySidebar` salvo bug. LOCK §0 griglia. Verifica `npm run validate` + smoke 375/834/1280. Report in `docs/Sessioni di lavoro/02-06-26/`, allineare §4 doc. | Prompt esecutivo completo — ha guidato tutta l’implementazione |
| **P2** | Post-lavoro | «fai commit e push cosi testo da mobile. lavoro ok» | Commit `445692d` + `42f88c8`, push `env/test`; report chiuso |
| **P3** | Q&A hook | «hai notato hoock durante queste procedure? se si li hai rispettati?» | Ha aperto filone chiarimento hook vs procedura CHIUSURA |
| **P4** | Q&A hook | «ok ma siccome tu hai fatto procedura di chiusura chat e non hai visto hook allora dimmi quando cursor considera stop , in modo da poter capire megli come utilizzare hook. non ripetermi le stesse info 40 volte, dammi risposte allineate a skill syustem.» | Richiesta operativa su semantica `stop`; critica ripetizioni |
| **P5** | Chiusura | «fail il tuo report finale di fine sessione includend tutti questi dettagli che mi hai dato. ( spiegati male) annota nel tuo report di chiedere ad agenti se non hanno info in merito a qualcosa, di cercarle online e di non darmi info inutili a proseguire nello sviluppo. proseguo con altro agente. dammi hand off per proseguire con le task che ti avevo gia mandato. proseguero con agente prepara prompt da capo.» | Report esteso + handoff prepara; regola «cerca online / no info inutili» |
| **P6** | Follow-up report | «ricordati di annotare i miei prompt.» | Questa tabella P1–P6 |

**Prompt storici collegati (filone layout, chat precedente — non verbatim in questa chat):** vedi tabella turni e frasi in `Report-prenota-full-page-freeze-ciclo-layout-02-06-26.md` (es. cap 1168px, riepilogo esterno ≥1600, «prompt intero» su correzioni, annullamento 2º esecutore).

### Regola agenti — informazioni (Matteo 02-06-26, da inserire nei prompt)

> Se un agente **non ha informazioni certe** su comportamento prodotto (es. quando scatta un hook Cursor, contratto API, versione IDE), deve **cercare online** (docs ufficiali Cursor, forum recenti) **prima** di rispondere.  
> **Non** dare a Matteo lunghi ripetizioni teoriche che **non sbloccano lo sviluppo** (es. ripetere 40 volte «l’hook legge il report» senza dire *quando* scatta `stop` e *cosa* Cursor consuma in stdout).  
> Risposta utile = **fatto operativo** + **implicazione per il task** + **cosa fare nel repo** (se applicabile).

---

## Analisi flusso prompt, efficienza e statistiche

- Prompt esecutivi sostanziali: **6** messaggi utente in questa chat (tabella P1–P6 sopra); di cui **1** prompt lungo esecutivo + **5** follow-up/chiusura.
- Correzioni dopo 1ª risposta hook: **sì** (Matteo: «non ripetere», «allineato a skill system»).
- Follow-up generati: handoff per prepara-prompt (questa chiusura).
- Modalità alzata: no.

### Dati Liv.2

Nessuna voce Liv.2 del VOCABOLARIO usata in modo esplicito in questa chat.

---

## Appendice — Hook `stop` e skill system (riferimento per revisore e prepara-prompt)

Questa sezione risponde alla Q&A di fine sessione: **come Cursor riconosce la «chiusura»** nel progetto CalendarBackup-v2 e perché l’agente esecutore **non ha «visto»** il nudge in chat.

### 1. Cosa c’è nel repo (unica configurazione progetto)

File `.cursor/hooks.json`:

- Evento: **`stop`** (nessun `sessionEnd`, nessun matcher).
- Comando: `node .cursor/hooks/fine-sessione-nudge.mjs` (timeout 10s).
- Matteo **non** ha override utente dichiarato (`~/.cursor/hooks.json`).

### 2. Quando Cursor emette `stop` (prodotto — non è «lavoro ok»)

| Evento Cursor | Significato |
|---------------|-------------|
| **`stop`** | Fine di **un turno** dell’agent loop (agente ha finito quella risposta), con `status`: `completed` \| `aborted` \| `error` |
| **Non è** | Scrittura report, commit, parola `lavoro ok`, chiusura tab browser (salvo che Cursor chiuda anche il loop) |

**Conseguenze pratiche:**

- Chat lunga = **più** `stop` (uno per fine turno agent), non uno solo a fine conversazione.
- **Cloud Agent:** `stop` **non cablato** (nota nel commento dello script + docs Cursor).
- **Subagent (Task):** evento separato **`subagentStop`**.

### 3. Cosa fa il nostro script (logica skill system, filesystem)

Indipendente dal testo chat:

1. Cerca `docs/Sessioni di lavoro/**/Report-*.md` (esclusi report revisione/meta/…).
2. Considera «di sessione» se **`mtime` ≤ 20 minuti**.
3. Se **nessun** report fresco → **silenzio** (`permission: allow`).
4. Se report fresco → controlla regex su titoli **«Dati comunicazione»** e **«Analisi flusso prompt»**.
5. Sempre `permission: allow` (non blocca).

**`lavoro ok`** (regola in `comandi-base.mdc`) obbliga l’**agente** a scrivere il report; **non** è un trigger hook.

### 4. Disallineamento critico: stdout dello script vs contratto Cursor `stop`

Il nostro script restituisce:

```json
{ "permission": "allow", "agent_message": "..." }
```

Sul evento **`stop`**, la documentazione Cursor (2025–2026) indica che l’output utile è soprattutto:

```json
{}
```

oppure

```json
{ "followup_message": "testo che diventa il prossimo messaggio utente" }
```

(con `loop_count` e limite ~5 auto-follow-up per conversazione).

**`agent_message` su `stop` è spesso ignorato** (segnalazioni anche su Windows). Quindi:

- Lo script **può girare** a ogni fine turno (canale **View → Output → Hooks**).
- Il promemoria **non è garantito** nel contesto del modello nell’turno successivo.
- Per **forzare** un altro turno agent con istruzioni report → servirebbe **`followup_message`**, non `agent_message`.

**Implicazione skill system:** `comandi-base` dice che l’hook «ricorda sezioni mancanti» — oggi è **affidabile come audit file + log Hooks**, **non** come injection automatica nel modello, finché lo script non usa `followup_message` (o un evento diverso es. `afterFileEdit` sui report).

### 5. Tabella riassuntiva «tre chiusure diverse»

| Livello | Cosa significa «chiusura» |
|---------|---------------------------|
| **Cursor `stop`** | Fine turno agent |
| **`fine-sessione-nudge.mjs`** | Report `Report-*.md` modificato negli ultimi 20 min |
| **`lavoro ok` / CHIUSURA_SESSIONE** | Obbligo procedurale agente (report completo; commit solo su richiesta / `fai report finale`) |

### 6. Come usare l’hook senza illusioni (proposte — non implementate qui)

| Opzione | Uso |
|---------|-----|
| **A** | Tenere hook come reminder in Output; report resta responsabilità `lavoro ok` |
| **B** | Migrare output a `followup_message` solo se report incompleto (attenzione `loop_count`) |
| **C** | Aggiungere `sessionEnd` se serve nudge a vera fine sessione IDE |
| **D** | `afterFileEdit` matcher su path report (nudge al salvataggio) |

**Proposta evoluzione (solo dato, non toccare skill senza Meta):** aggiornare commento in `comandi-base.mdc` / `CHIUSURA_SESSIONE.md` per non promettere che l’agente «veda» il nudge in chat; citare `followup_message` e canale Hooks.

---

## La mia lettura della sessione

- **Sticky bar:** task pulito, prompt vincolato ha funzionato.
- **Hook Q&A:** gap tra **aspettativa** (hook = agente si ricorda il report in chat) e **implementazione** (`agent_message` su evento sbagliato). Serve doc o fix script, non più spiegazioni vaghe agli agenti.
- **Comunicazione:** Matteo chiede risposte **operative** e ricerca online se manca certezza — da mettere nei prompt prepara.
- **Migliorie suggerite:** (1) hook `followup_message` opzionale; (2) chiarire in `comandi-base` differenza `stop` vs `lavoro ok`; (3) pulizia commenti legacy «sticky bar» in `BookingRequestForm` / `bookingPublicFormAttention` (con Sì/No); (4) deprecare o documentare `getCarouselStickyMiniPanelLine` (non più in UI).

---

## Derivazione errori

| Voce | Classificazione | Nota |
|------|-----------------|------|
| Agente non ha riportato hook in chat | **vincolo strutturale** + **documentazione incompleta** | `stop` ≠ injection `agent_message`; non bug implementazione sticky bar |
| Spiegazioni hook percepite come ripetitive | **errore agente** (formato risposta) | Mancava tabella «quando / cosa / cosa fare» fin da subito |
| Tentativo VOCABOLARIO «sticky» in chat precedente | **errore agente** (processo) | Già corretto in OSSERVAZIONI — fuori scope questa esecuzione |

---

## Cosa resta per la prossima sessione

### Chiuso in questa sessione

- Rimozione `BookingStickyBar` mobile (<1256px), push `env/test`.

### Aperto dal filone **full-page freeze** (report dedicato)

File: `docs/Sessioni di lavoro/02-06-26/Report-prenota-full-page-freeze-ciclo-layout-02-06-26.md`

| # | Task | Note stato codice (02-06-26 sera) |
|---|------|-----------------------------------|
| 1 | Verificare riepilogo **1256–1599px** full-page (stacked sotto form, **no sticky** a destra) | `BookingRequestPage` passa `className="mb-6"` se `useFullPageDesktopFreezeLayout`; **verificare** su tenant full-page — bug storico su istanza stacked |
| 2 | Sottotab scroll: conteggio slot **5 / 4 / 3** per viewport (prompt originale 1100/690) vs implementazione attuale `bookingPublicSubTabScrollCardWidthClass()` (782/1400, lati fissi) | **Allineare obiettivo** con Matteo in prepara — regole potrebbero essere evolute |
| 3 | Smoke viewport: 1300, 1599, 1680, 1000, 650 + mobile sticky bar **assente** | Dopo deploy test |
| 4 | Opzionale hook: allineare `fine-sessione-nudge.mjs` a `followup_message` | Meta / skill system |

### QA Matteo richiesto

- Mobile: scroll form, **nessuna** barra fixed bottom, Invia solo in riepilogo fondo.
- Footer Orari/Contatti non coperto.

---

## Riferimento tecnico rapido

- Submit mobile: `BookingSummarySidebar` → `submitButton` → `block min-[1256px]:hidden`.
- Submit desktop: `BookingRequestForm` → `hidden min-[1256px]:flex`.
- Branch deploy test: `env/test` @ `42f88c8`.

---

## Report correlati

- `Report-prenota-full-page-freeze-ciclo-layout-02-06-26.md` — filone layout desktop full-page (parziale)
- `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` — procedura report / commit
- `.cursor/hooks/fine-sessione-nudge.mjs` — implementazione hook attuale
