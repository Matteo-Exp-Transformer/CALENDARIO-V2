# Report Verifica — FU-031 limiti testo cliente Prenota (04-06-26)

**Profilo:** Verifica (light → standard per gap edge deploy + UX errore campi lunghi)  
**Tenant / slug:** TEST `docnnernvp` · `/prenota/test-pro`  
**Commit:** working tree (non committato)  
**Gate:** `npm run validate` — **OK** (291 test Vitest)

## Cappello

- **Esito:** **non chiuso** — codice app + costanti allineati; QA manuale viewport OK su cap/maxLength/contatori; **edge `create-booking` su TEST non rifiuta** payload oltre cap (versione deployata ≠ repo); messaggio «Testo troppo lungo» **non visibile** su intolleranze/altre richieste anche se `validate()` imposta l’errore.
- **Azione Matteo:** no subito; serve sessione **Esecuzione** (deploy edge + fix UX errori dietary/special + allineare cap ospiti 110 vs 999).

---

## Allineamento codice (statico)

| Fonte | Esito | Note |
|-------|-------|------|
| `bookingPrenotaTextLimits.ts` → `BOOKING_PUBLIC_CLIENT_TEXT_LIMITS` | OK | nome/email 65, tel 30, intolleranze/altre richieste 550, ospiti max 999, messaggio `BOOKING_CLIENT_TEXT_TOO_LONG_MESSAGE` |
| `BookingRequestForm.tsx` → `validate()` | OK | Stessi cap + `textTooLong` su nome, email, tel, dietary, special, ospiti > 999 |
| `BookingFormFields.tsx` | OK | `maxLength` + `slice` su nome/email/tel |
| `DietaryRestrictionsSection.tsx` | OK cap input | `maxLength` 550 + `slice` su intolleranze e altre richieste |
| `create-booking/index.ts` (repo) | OK | Duplicate costanti + `TEXT_TOO_LONG_ERROR` + `getDietaryRestrictionsTextLength` — commento sync presente |
| `PRENOTA_TEXT_LIMITS_MAP.md` §H | OK | Coerente con costanti |

---

## QA manuale — §7 TESTING_SKILL

**Data:** 04-06-26 · **Strumento:** Playwright MCP + `fetch` edge TEST · **Dev:** `localhost:5173`

### Cap HTML / contatori (stessi su 375×812, 834×1194, 1280×800)

| Controllo | mobile | tablet | desktop |
|-----------|--------|--------|---------|
| `maxLength` nome 65, email 65, tel 30, intolleranze 550, altre richieste 550, ospiti input 3 cifre | OK | OK | OK |
| Nessun contatore `N/max` in pagina pubblica | OK | OK | OK |
| Incolla 551 caratteri in intolleranze → valore DOM 550 (taglio silenzioso) | OK | OK | OK |

### Checklist funzionale

| ID | Caso | mobile | tablet | desktop | Nota |
|----|------|--------|--------|---------|------|
| C1 | Incolla oltre cap intolleranze → submit → «Testo troppo lungo» | **KO** | **KO** | **KO** | Dopo incolla resta ≤550; submit non mostra il messaggio (né sotto campo né toast specifico) |
| C2 | Stesso su «Altre richieste» | **KO** | **KO** | **KO** | Come C1 |
| C3 | Nome / email / tel oltre cap → stesso messaggio | **KO** | **KO** | **KO** | `slice`/`maxLength` impediscono stato > cap; messaggio non compare in UI |
| C4 | Submit con testo valido | **Non testato** | **Non testato** | **Non testato** | Rate limit edge IP dopo probe; non creato booking pulito end-to-end in questa sessione |
| C5 | Edge rifiuta stessi limiti | **KO** | **KO** | **KO** | Vedi § Edge sotto |
| C6 | Toast generico su form incompleto | OK | — | — | Solo mobile: «Compilazione non valida: N campi…» |

### Edge `create-booking` (TEST, slug `test-pro`)

Payload diretti `POST …/functions/v1/create-booking` (anon key da `.env.local`):

| Payload | Atteso repo | Risposta osservata |
|---------|-------------|-------------------|
| `client_name` ×66 | 400 `Testo troppo lungo` | **201 success** (booking creato) |
| `dietary_restrictions` testo 551 | 400 `Testo troppo lungo` | **201 success** |
| `special_requests` ×551 | 400 `Testo troppo lungo` | **201 success** |
| `num_guests` 1000 | 400 `Testo troppo lungo` | 429 rate limit (non distinguibile) |

**Conclusione:** il file in repo è allineato a `bookingPrenotaTextLimits.ts`, ma la **funzione deployata su TEST non esegue** (ancora) quei guard — serve **deploy** `create-booking` su `docnnernvp`.

---

## Gap (file / azione)

| # | Gap | File / azione |
|---|-----|----------------|
| G1 | Edge TEST accetta testi oltre cap | Deploy `supabase/functions/create-booking/index.ts` su progetto TEST |
| G2 | `validate()` imposta `errors.dietary` / `errors.special_requests` ma **nessun** `<p>` errore né `hasError` in `DietaryRestrictionsSection`; chiavi assenti da `BOOKING_PUBLIC_ERROR_FIELD_IDS` → niente scroll | `DietaryRestrictionsSection.tsx`, `BookingRequestForm.tsx`, `bookingPublicFormAttention.ts` |
| G3 | Checklist «incolla → errore submit» incompatibile con taglio silenzioso in `onChange`/`maxLength` (stato mai > cap da UI) | Prodotto: confermare se messaggio serve solo su tampering/edge o anche UX post-incolla |
| G4 | `num_guests`: costante **999**, `validate()` >999, ma `handleNumGuestsChange` accetta solo **1–110** | `BookingRequestForm.tsx` vs `bookingPrenotaTextLimits.ts` |
| G5 | Probe edge ha creato 3 richieste test su TEST (nome/dietary/special lunghi) | Pulizia opzionale in admin Richieste in attesa |

---

## Test automatici

| Comando | Esito |
|---------|-------|
| `npm run validate` | OK |

`bookingPrenotaTextLimits.test.ts` copre helper/costanti, non il flusso submit pubblico.

---

## La tua lettura della sessione (agente)

Revisione **light→standard** giustificata: il codice sorgente del form e le costanti sono coerenti con §H mappa e §3 PRENOTA_SKILL (silenzioso, no contatore), ma la **difesa server** non è attiva su TEST e l’**esposizione** del messaggio unico su intolleranze/altre richieste manca in UI. FU-031 resta **Aperto** finché non c’è deploy edge + fix G2 (e decisione su G3/G4).

---

## Prompt Esecuzione (separato, non eseguito qui)

```
Profilo: Esecuzione · area Prenota (solo form cliente, non Personalizza/Menu QR)

1) Deploy edge TEST: supabase/functions/create-booking/index.ts (limiti BOOKING_PUBLIC_CLIENT_TEXT_LIMITS).
2) DietaryRestrictionsSection: mostrare errors.dietary / errors.special_requests («Testo troppo lungo»), hasError, attentionFieldKey; aggiungere dietary-notes e special_requests a BOOKING_PUBLIC_ERROR_FIELD_IDS.
3) Allineare cap ospiti: o portare handleNumGuestsChange a 999 o abbassare numGuestsMax a 110 in costanti + edge + mappa §H (decisione Matteo).
4) Ritest FU-031: tabella §7 + fetch edge 400 su name66/dietary551/special551.
LOCK: non refactor validazione condivisa (FU-010).
```

---

## 2. Cosa è stato fatto

1. Caricati TESTING_SKILL §7, PRENOTA_SKILL §3, PRENOTA_TEXT_LIMITS_MAP §H; gate `npm run validate` (291 test OK).
2. Verifica statica: costanti, `validate()`, `maxLength`/`slice`, edge in repo vs mappa §H.
3. QA browser Playwright su `/prenota/test-pro` alle tre viewport (375×812, 834×1194, 1280×800): cap HTML, assenza contatori, incolla 551→550.
4. Probe edge TEST con `fetch` diretto su `create-booking` (name×66, dietary×551, special×551).
5. Scritto report + aggiornata riga **FU-031** in `docs/FOLLOW_UP.md` (stato Aperto con gap).

---

## 3. File toccati e perché

| File | Perché |
|------|--------|
| `docs/Sessioni di lavoro/04-06-26/Report-fu-031-limiti-cliente-prenota-04-06-26.md` | Report Verifica FU-031 (nuovo) |
| `docs/FOLLOW_UP.md` | Riga FU-031 aggiornata con esiti e link report |

**Non modificati in questa sessione (solo letti / verificati):** `bookingPrenotaTextLimits.ts`, `BookingRequestForm.tsx`, `BookingFormFields.tsx`, `DietaryRestrictionsSection.tsx`, `bookingPublicFormAttention.ts`, `supabase/functions/create-booking/index.ts`, `PRENOTA_TEXT_LIMITS_MAP.md`. Il working tree contiene altri diff da sessioni precedenti (25 file in `git diff --stat`); fuori scope FU-031.

---

## 5. File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| Nessuno in questa sessione | — | Profilo Verifica senza fix codice; gap documentati in report/FU-031, non in PRENOTA_SKILL |

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) Brief Verifica FU-031 (cap 65/65/30/550/550/999, QA tre viewport, edge vs costanti, FOLLOW_UP, no codice salvo fix minimo). (2) «§11 Domande di chiusura» mancante. (3–4) «📄 FINE-SESSIONE — **3 report**» controllo a mente fredda (ripetuto).

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Controllo fine-sessione (3 report): riaperti `bookingPrenotaTextLimits.ts` (11–17: 65/65/30/550/550/999, riga 47 messaggio); `BookingRequestForm.tsx` (validate 614–783; riga 436 ospiti **≤110**); `BookingFormFields.tsx`, `DietaryRestrictionsSection.tsx` (550 + slice, no `errors`), `bookingPublicFormAttention.ts` (no `dietary`/`special_requests`); `create-booking/index.ts` (9–19, 95–159 — **zero** `git diff`, commit `902be9b`). `npm run test` → **291** OK (ri-eseguito). Diff **questa** sessione Verifica: report + `FOLLOW_UP.md` (hunk condiviso: riga FU-031 + riga FU-032 Fatto — scope FU-032 = +57−12 su 7 file, vedi report gemello). Tree **25 file** = altre sessioni 04-06-26, non attribuiti a FU-031. Probe edge TEST: 201 su name×66/dietary×551/special×551 (runtime ≠ repo). QA viewport/slug invariati.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Correlati al perimetro FU-031 verificati in lettura: `bookingPrenotaTextLimits.ts`, `bookingPrenotaTextLimits.test.ts`, `BookingRequestForm.tsx`, `BookingFormFields.tsx`, `DietaryRestrictionsSection.tsx`, `bookingPublicFormAttention.ts`, `dietaryRestrictionsText.ts`, `create-booking/index.ts`, `PRENOTA_TEXT_LIMITS_MAP.md` §H, `PRENOTA_SKILL.md` §3, `TESTING_SKILL.md` §7. **Allineati al codice:** mappa §H e costanti (65/30/550/999). **Non allineati al runtime TEST:** edge deployata vs repo (G1). **Non allineati al comportamento UX atteso dalla checklist:** messaggio su intolleranze/altre richieste (G2), incolla→solo taglio (G3), ospiti 110 vs 999 (G4). Skill area **non aggiornate** in questa chiusura perché Verifica senza fix — corretto; i gap vivono in FU-031 + report. `FOLLOW_UP.md` aggiornato per FU-031. Test Vitest limiti OK; nessun test E2E submit/limiti aggiunto (fuori scope).

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non eseguito C4 (submit valido end-to-end) per rate limit IP dopo i probe edge. Non deployato `create-booking` su TEST. Nessun fix codice (G2/G4) né sessione Esecuzione. Non chiesto Sì/No a Matteo per prompt Esecuzione (in attesa). Non `lavoro ok` completo al primo giro (mancava §11 — ora aggiunta). Non aggiornato PRENOTA_SKILL con i gap UX (documentati solo in report/FU-031). Non rimossi i 3 booking test creati su TEST (G5 opzionale). Non committato/pushato (Verifica, non «fai report finale»).

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: Attrito: checklist FU-031 chiede «incolla→errore submit» mentre PRENOTA_SKILL §3 impone taglio silenzioso — l’agente deve arbitrare senza voce esplicita nel prompt Verifica. Miglioria: in TESTING_SKILL §7 o in FU-031 aggiungere riga «se maxLength+slice: C1–C3 = taglio silenzioso OK; messaggio submit solo su tampering o dopo fix UI errori» + voce obbligatoria «verifica deploy edge» (`supabase functions deploy` o confronto versione) oltre al diff repo.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto **giusto** per Verifica (TESTING §7 + PRENOTA §3 + mappa §H bastano; esclusione Personalizza/Menu QR rispettata). Hook FINE-SESSIONE **utile**: §11 + controllo 3 report; incrocio con FU-032/courses_label sul tree 25 file e su `PRENOTA_TEXT_LIMITS_MAP` (§H vs §A/§C) — scope separati, nessuna contraddizione Q1–Q6 tra i tre report dopo correzione stat FU-032.
