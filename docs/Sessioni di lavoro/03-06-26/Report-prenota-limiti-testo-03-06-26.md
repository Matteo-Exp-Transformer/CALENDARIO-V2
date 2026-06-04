# Report — Limiti testo Pagina Prenota (03-06-26)

**Commit:** `111277e` (codice) · `06c9d9a` · `64530d7` · `a9bca14` · `1309618` · `17d159e` (docs/chiusura) · branch `env/test` → `origin/env/test`

## Cappello

- **Cosa è cambiato:** in Pagina Prenota il ristoratore vede contatori caratteri sui testi di vetrina (header, tipologie, card, promo); chi prenota può scriversi a lungo su intolleranze e richieste, ma il sistema blocca testi assurdi **senza** mostrargli «max N caratteri».
- **Cosa resta:** limiti su nome/descrizione ingredienti e categorie in Tab Menu; QA manuale 375/900/1256; allineare `restaurant_name` 40 (input Anagrafica) vs 200 (Zod).
- **Serve una tua azione:** no (smoke opzionale su `/prenota/:slug`).

---

## Cosa è stato fatto

1. **Prepara-prompt (chat precedente):** mappatura 1:1 testi Prenota (header, tipologie, sottotab, carosello, menu, footer, promo) con distinzione admin vs cliente.
2. **Esecuzione:** creato `bookingPrenotaTextLimits.ts` — un solo posto per numeri ristoratore, cliente, carosello, tetto font header.
3. **Personalizza form:** il ristoratore continua a vedere `12/30`, `45/65`, ecc. su titoli, descrizioni, tipologie, sottotab, promo; descrizione intro pagina non può superare **22px** di font (nome/titolo restano fino **38px**).
4. **Form prenotazione cliente:** chi compila nome, email, telefono, intolleranze e altre richieste **non** vede contatori; se supera il cap generoso, al click Invia compare solo «Testo troppo lungo» (stesso messaggio anche lato server).
5. **Revisione + chiusura (hook 1):** mappa markdown mancante aggiunta; skill §6 validazione allineata (prima citava ancora 60/120/20/300); report riscritto con sez. 8 e prompt verbatim (`64530d7`).
6. **Annotazioni processo (Matteo):** log errori esecutore su allineamento skill in `ERRORI_PROCESSO.md`; sessione + hook in `OSSERVAZIONI.md` (`a9bca14`).
7. **Hook 2–3 (chiusura):** sezione **Effetto hook stop** (`17d159e`); 3° passaggio hook — verifica Parte A completa, nessun nuovo fix skill/codice.

---

## Effetto hook stop `FINE-SESSIONE` (`.cursor/hooks/fine-sessione-nudge.mjs`)

Hook ricevuto **3 volte** in questa chat (Matteo incolla «📄 FINE-SESSIONE…»). Senza hook la chiusura si sarebbe fermata al primo «lavoro ok» + commit `111277e`/`06c9d9a` con debiti sotto.

### Cosa **non** sarebbe successo senza hook

| Debito | Perché restava aperto |
|--------|------------------------|
| **`BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` §6** con limiti **60/120/20/300** | Esecutore aveva aggiornato solo §8.1 (65/30/700); §6 è la sezione che legge chi cerca «validazione campi» — **informazione falsa** per agenti futuri |
| **Report scarno** | Sez. 8 superficiale, **nessun prompt verbatim**, nessun FU-ID, tabella skill incompleta, nessuna derivazione errori classificata |
| **`BOOKING_PRENOTA_TEXT_LIMITS_MAP.md`** | Citata in skill ma **assente** a «lavoro ok» (solo mappa implicita in §8.1) |
| **`FU-030/031/032`** in `FOLLOW_UP.md` | Follow-up restavano solo nel corpo del report, non tracciati |
| **`ERRORI_PROCESSO.md` / `OSSERVAZIONI.md`** | Errori esecutore su skill stale **non** registrati come pattern processo |
| **2° passaggio report** | Commit `64530d7`/`a9bca14`/`1309618`, prompt 6–7, tabella skill comunicazione **non** citati nel report |

In sintesi: il codice (`111277e`) era ok; **documentazione, skill incoerente e chiusura processo** sarebbero rimaste parziali.

### Cosa ho fatto **dopo** aver ricevuto l’hook

| Passaggio | Trigger | Azioni | Commit |
|-----------|---------|--------|--------|
| **Hook 1** | Primo «📄 FINE-SESSIONE…» dopo «lavoro ok» | Rilettura `CHIUSURA_SESSIONE` Parte A; grep skill vs codice → trovato §6 stale; report **riscritto** (sez. 8, verbatim, derivazione errori, FU); creato/completato mappa se mancante; §6 allineata a 65/30/700 | `64530d7` |
| **Post-hook 1** | Matteo: «annota errori altro agente… e hook» | Log tabellare in `ERRORI_PROCESSO.md` (7 errori esecutore + 2 pattern); blocco sessione in `OSSERVAZIONI.md` | `a9bca14` |
| **Hook 2** | Secondo «📄 FINE-SESSIONE…» | Verifica report **pieno**: prompt 6–7, commit mancanti, ERRORI/OSSERVAZIONI in tabella §5 | `1309618` |
| **Matteo** | «cita cosa hook ha sistemato» | Sezione **Effetto hook stop** (tabelle senza/dopo + valore misurabile) | `17d159e` |
| **Hook 3** | Terzo «📄 FINE-SESSIONE…» | Rilettura CHIUSURA Parte A: sezioni piene confermate; sync commit `17d159e` + prompt 8–9 | (questo passaggio) |

**Valore misurabile dell’hook:** ha trasformato una chiusura «codice ok + skill a metà» in ciclo tracciabile (mappa, §6 coerente, FU, ERRORI_PROCESSO, report utilizzabile dal revisore Meta).

---

## File toccati

| File | Perché |
|------|--------|
| `src/features/booking/constants/bookingPrenotaTextLimits.ts` | Costanti uniche + helper clamp/validazione |
| `bookingPublicFormConfig.ts` | Clamp copy ristoratore + fontSize header per target |
| `BookingFormConfigPanel.tsx` | Limiti ristoratore da `BOOKING_PRENOTA_RESTAURANT_TEXT_LIMITS` |
| `BookingFormPromoSection.tsx` | Promo 60/350 |
| `BookingFormFields.tsx` | Cap silenzioso cliente |
| `DietaryRestrictionsSection.tsx` | Cap 700 silenzioso multiline |
| `BookingRequestForm.tsx` | `validate()` lunghezza testi |
| `supabase/functions/create-booking/index.ts` | Stessi cap server-side (duplicate + commento sync) |
| `__tests__/bookingPrenotaTextLimits.test.ts` | Test helper e fontSize |
| `docs/per-ui-design-skill/BOOKING_*` | Skill + mappa |
| `docs/Comunicazione-Skill/ERRORI_PROCESSO.md` | Log errori allineamento skill esecutore |
| `docs/Comunicazione-Skill/OSSERVAZIONI.md` | Hook stop + sessione limiti testo |
| `docs/FOLLOW_UP.md` | FU-030/031/032 |

---

## Test eseguiti

| Comando | Esito |
|---------|-------|
| `npm run validate` | OK — lint, typecheck, **284** test |

QA manuale viewport 375 / 900 / 1256: **non eseguito** (agente + revisore statico).

---

## File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` | §6 validazione (65/30/700), §8.1, §9 punto 5 | Limiti cliente e copy ristoratore in Prenota |
| `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md` | § Limiti testo 03-06-26 + tabella | Admin Personalizza form |
| `BOOKING_PRENOTA_TEXT_LIMITS_MAP.md` | Nuovo — mappa 1:1 A–I | Riferimento citato dalle skill |
| `docs/SESSION_LOG.md` | Riga sessione 03-06-26 | Indice cronologico |
| `ERRORI_PROCESSO.md` | § 03-06-26 limiti testo + 2 pattern tabella | Errori esecutore skill stale / link mappa |
| `OSSERVAZIONI.md` | Blocco sessione + riga tabella frasi | Hook ricevuto + richiesta annotazione errori |

**Correzione hook fine-sessione (03-06-26):** §6 layout context citava ancora limiti pre-refactor (60/120/20/300) — aggiornato a valori reali in chiusura.

---

## Dati comunicazione

### Prompt verbatim di Matteo (sessione)

1. **«prepara prompt»** (testo lungo con DOM Path header, tipologie, sottotab, ingredienti, footer): mappare limiti 1:1 su Pagina Prenota, partire da mappa poi sistemare punto per punto.

2. **«anche campi che compila cliente, giusto per evitare renotazioni assurde, ma manteniamo lmite abbondante per permettere ad utente che prenota di spiegarsi a fondo se necesita.»**

3. **«però non scriviamolo in ui limite caratteri. lasciamolo abondante come controllo di sistema»**

4. **«esatto admin vede contatore limiti caratteri , cliente che prenota no.»**

5. **«lavoro ok. fwi revisione e report finale»**

6. **«annota tutti gli errori di altro agente nell allineamento dei file skills al lavoro eseguito. e anmota anche se tu hai ricevuto hook in questa sessiome di lavoro»**

7. **«📄 FINE-SESSIONE — 2 report toccato/i…»** (2° passaggio hook)

8. **«nel tuo report, citw le cose che hook ti ha fatto sistemare. (cosa non sarebbe succwsso senza hook e cosa hao fatto dopo averlo ricevuto»**

9. **«📄 FINE-SESSIONE — 2 report toccato/i…»** (3° passaggio hook — verifica finale CHIUSURA Parte A)

### Frasi ricorrenti (conteggio)

| Frase / tema | N |
|--------------|---|
| Admin contatore / cliente no | 3 |
| Limite abbondante / sistema invisibile | 2 |
| Mappatura 1:1 Prenota | 1 |
| Hook FINE-SESSIONE / stop | 3 |
| Annota errori altro agente | 1 |

### Formato che ha funzionato

- Prepara-prompt con tabella DOM → storage → limite attuale prima dell’esecuzione.
- Conferme brevi Sì/No su regola UX (evita reinterpretazione in fase implementazione).

### Automatizzabile vs manuale

| Cosa | Automatizzabile | Manuale |
|------|-----------------|---------|
| Parità costanti TS ↔ edge Deno | Test import o script diff | Oggi commento + duplicate |
| QA testo lungo in intolleranze | Playwright opzionale | Smoke Matteo 375/900/1256 |
| Cap ingredienti Tab Menu | Prossima sessione con mappa §E | — |

### Vocabolario Liv.2 — esito

| Voce | Esito |
|------|-------|
| **prepara** / prepara prompt | **ok** — prompt esecutore + fasi; scope Prenota chiuso |
| **lavoro ok** | **ok** — revisione + report + commit |
| **fai report finale** (scritto «fwi») | **ok** — commit `111277e`→`17d159e`, push `env/test` |

(Nessun’altra voce Liv.2 del VOCABOLARIO usata in questa sessione oltre a prepara / lavoro ok / report finale.)

---

## Analisi flusso prompt, efficienza e statistiche

- **Prompt sostanziali Matteo:** 9 (prepara + 3 UX + lavoro ok + annota errori + citare effetto hook + hook stop ×3)
- **Correzioni dopo 1ª risposta:** 2 (inclusione campi cliente; limite invisibile in UI)
- **Follow-up generati:** 3 (FU-030/031/032)
- **Modalità alzata:** no (deep già da prepara-prompt)

**Cosa ha reso efficace il flusso:** prepara-prompt con esempi DOM reali; Matteo ha chiuso in 2 messaggi la distinzione admin/cliente senza ambiguità. **Cosa migliorare:** l’esecutore avrebbe dovuto consegnare `BOOKING_PRENOTA_TEXT_LIMITS_MAP.md` prima del «lavoro ok» — recuperato in revisione/chiusura.

---

## La mia lettura della sessione ⭐

### Impressioni lavorando con lo skill system

- **Funzionato bene:** il ciclo prepara → esecuzione → «lavoro ok» → revisione; skill Prenota coerenti post-hook. **Hook ×3:** (1) §6 stale + report scarno; (2) tabella skill comunicazione + commit; (3) verifica finale — nessun nuovo debito skill/codice, solo allineamento report a `17d159e`.
- **Funzionato meno bene:** esecutore ha aggiornato §8.1 skill ma non §6 (pattern «skill a metà»). Link a mappa prima che il file esistesse. Edge Deno duplica costanti cliente — vincolo strutturale, non dimenticanza.

### Difficoltà incontrate + soluzioni

| Difficoltà | Soluzione |
|------------|-----------|
| Mappa markdown assente a «lavoro ok» | Scritta in revisione/chiusura + citata in skill |
| §6 layout context con numeri vecchi (60/120/20/300) | Riletta in hook stop; aggiornata a 65/30/700 |
| Commit docs con `.gitignore` su `docs/` | `git add -f` su file nuovi (procedura PREPARA_PROMPT) |
| Matteo chiede log errori esecutore | Tabella in ERRORI_PROCESSO + blocco OSSERVAZIONI (`a9bca14`) |
| Secondo hook stop | Rilettura report: commit mancanti, prompt 6–7, skill comunicazione non in tabella §5 |

### Migliorie suggerite (dato — non implementate qui)

1. Test CI che fallisce se `create-booking/index.ts` duplicate diverge da `bookingPrenotaTextLimits.ts`.
2. In prepara-prompt, checklist «Output attesi presenti su disco» prima di accettare lavoro ok.
3. ~~Segnalare in `ERRORI_PROCESSO.md` pattern «skill aggiornata che referenzia file non ancora creato».~~ **Fatto** in `a9bca14` (tabella pattern + log § 03-06-26).

### Errori e correzioni in chiusura

- **Errore revisore/chiusura:** non riletto §6 layout context al primo report → corretto in questo passaggio hook.
- **Nessun voto sintetico:** dati sopra per revisore Meta.

---

## Derivazione errori

| # | Cosa | Classificazione | Dettaglio | Evitabile |
|---|------|-----------------|-----------|-----------|
| 1 | Mappa MD mancante a lavoro ok | **errore agente** (esecutore) | Deliverable Fase 1 nel prompt non materializzato | Checklist Output attesi |
| 2 | §6 skill 60/120/20/300 | **errore agente** (chiusura) | §8.1 aggiornato ma §6 no | Rilettura diff vs tutte le sezioni skill citate |
| 3 | Ingredienti/categorie senza cap | **scope parziale** (non bug) | Sezione E mappa esplicita follow-up | Sessione dedicata Tab Menu |
| 4 | Edge duplicate costanti | **vincolo strutturale** | Deno edge non importa `src/` | Test parità o shared package futuro |
| 5 | `restaurant_name` 40 vs 200 | **bug preesistente** | Anagrafica vs Zod registry | Follow-up FU-032 |
| 6 | Report incompleto al 1° hook | **errore agente** (chiusura) | Mancavano commit 64530d7/a9bca14, prompt 6–7 | Secondo passaggio hook |

---

## Cosa resta / FOLLOW_UP

| ID | Stato | Follow-up |
|----|-------|-----------|
| FU-030 | Aperto | Cap layout **nome/descrizione ingrediente e categoria** (Tab Menu → card Prenota). Mappa §E. |
| FU-031 | Aperto | QA manuale Prenota **375 / 900 / 1256** — testo lungo intolleranze/richieste, verifica assenza contatore UI. |
| FU-032 | **Fatto** (04-06-26) | ~~Allineare `restaurant_name`~~ — limite unico **45** (`a79a5af`). Vedi [Report FU-032 04-06-26](../04-06-26/Report-fu-032-restaurant-name-45-04-06-26.md). |

---

## Revisione (chiusura)

| Check | Esito |
|-------|-------|
| Admin contatore / cliente silenzioso | OK |
| `npm run validate` | OK (284) |
| Skill allineate al diff (§6 + mappa + ERRORI/OSSERVAZIONI) | OK |
| Edge sync limiti cliente | OK (duplicate + commento) |
| LOCK griglia BookingRequestPage | Non toccato |
| Commit + push `env/test` | OK `111277e` … `17d159e` |
| Hook stop ×3 — CHIUSURA Parte A completa | OK (3° passaggio: nessuna correzione skill/codice) |

**Verdetto revisione:** approvato — ciclo chiuso.

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.  
✅ R1 — Già in **Dati comunicazione → Prompt verbatim di Matteo (sessione)** (prompt 1–9): (1) «prepara prompt» con DOM Path per mappa 1:1 limiti Prenota; (2) campi cliente limite abbondante; (3) non scrivere limite in UI cliente; (4) admin sì contatore, cliente no; (5) «lavoro ok. fwi revisione e report finale»; (6) annota errori altro agente + hook ricevuto; (7–9) tre «📄 FINE-SESSIONE…» (2° e 3° passaggio hook). Coerente con **Dati comunicazione** e **Analisi flusso**.

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.  
✅ R2 — Controllo 8 report (diff storico invariato). Ri-verificato su git: `111277e` = **10 file**, **+408 −140** — `bookingPrenotaTextLimits.ts` creato; `BOOKING_PUBLIC_CLIENT_TEXT_LIMITS` al commit **nome/email 65, tel 30, dietary/special 700** (non 550 — tuning 03-06 successivo); `BookingFormConfigPanel` refactor limiti ristoratore; `create-booking/index.ts` duplicate + commento sync; test `bookingPrenotaTextLimits.test.ts` **36** righe nuove. `06c9d9a` = mappa `BOOKING_PRENOTA_TEXT_LIMITS_MAP.md` + skill; `64530d7`/`a9bca14`/`17d159e` = report + §6 layout da 60/120/20/300 → **65/30/700**; `FOLLOW_UP` FU-030/031/032. `npm run validate` **284** test (coerente § Test). Promo ristoratore: `promoTitle` **60**, `promoMessage` **350** in `bookingPrenotaTextLimits.ts` al commit — coerente tabella File toccati. **Nota:** valori cliente **550** sono stato **posteriore** (report tuning 03-06); questo report descrive correttamente lo stato a `111277e`/`64530d7`.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).  
✅ R3 — Allineati post-hook: mappa limiti (creato `06c9d9a` come `BOOKING_PRENOTA_TEXT_LIMITS_MAP.md`; oggi `docs/Prenota-Skill/contesto/PRENOTA_TEXT_LIMITS_MAP.md` dopo pilota 04-06), `BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` §6+§8.1+§9, `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md` § limiti, `ERRORI_PROCESSO.md`, `OSSERVAZIONI.md`, `FOLLOW_UP.md`, `SESSION_LOG`. Codice: `bookingPrenotaTextLimits.ts`, form admin/cliente, edge. **E-A chiuso in hook:** §6 non più 60/120/20/300. **Non** aggiornato `PRENOTA_SKILL/` (cartella non esisteva il 03-06 — migrazione 04-06). LOCK `BookingRequestPage` griglia non toccato (corretto). Test Vitest helper + fontSize presenti.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)  
✅ R4 — QA manuale viewport 375/900/1256 non eseguito (FU-031 aperto). Cap ingredienti/categorie Tab Menu non implementati (FU-030). `restaurant_name` 40 vs 200 non risolto (FU-032, chiuso 04-06-26). Esecutore iniziale non consegnò mappa MD prima del primo «lavoro ok» — recuperato in revisione hook. Edge Deno resta duplicate (vincolo strutturale, non package condiviso). Test CI parità TS↔edge non aggiunto.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)  
✅ R5 — Attrito: esecutore aggiornò §8.1 skill ma lasciò §6 stale (60/120/20/300) — pattern «skill a metà»; hook ×3 ha dovuto recuperare. Miglioria: checklist «Output attesi su disco» in prepara-prompt prima di «lavoro ok»; test che fallisce se skill §6/§8 citano numeri diversi da `bookingPrenotaTextLimits.ts` (proposta §7, non fatta).

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?  
✅ R6 — Contesto giusto: skill Prenota (`BOOKING_*`) + `PREPARA_PROMPT` + `CHIUSURA_SESSIONE` Parte A. Hook FINE-SESSIONE **×3 molto utile**: ha forzato mappa, §6, report completo, ERRORI_PROCESSO, tabella skill comunicazione — senza hook la chiusura sarebbe rimasta «codice ok, doc a metà». Non rumore.
