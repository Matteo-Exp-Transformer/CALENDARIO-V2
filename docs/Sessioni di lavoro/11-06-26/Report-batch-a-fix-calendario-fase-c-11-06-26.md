# Report — Batch A fix Fase C tab Calendario admin (M2)

> Profilo Esecuzione · modalità **deep** · branch `env/test` · 11-06-26.
> Fonte finding: `Report-fase-c-controtest-calendario-11-06-26.md` · decisioni Matteo batch A.

---

## 1. Cappello

- **Effetto per il ristoratore:** la tab **Calendario** ora conta i coperti come la lista sotto (niente % «piena» con prenotazioni invisibili), avvisa lo staff se sfora il limite giornaliero creando da calendario (ma lascia procedere), il giorno selezionato segue il mese in griglia, e il badge mobile non sborda a 101%+.
- **Test (allineamento doc 11-06-26):** M2 **41** `@admin-blindatura: calendario` (+**2** No-show fuori conteggio M2); `npm run validate` **527** verde.
- **Cosa resta:** C-U3 → FU-048 (copy turni Pro), FU-REV-CAL-4 (opzionale), QA browser badge 375/834/1280, deploy edge C-D5 su richiesta Matteo.
- **Serve azione Matteo:** **sì** — smoke QA responsive badge; verificare pulsante No-show su edition Pro con prenotazione **passata** (Classic non lo mostra per edition).

---

## 2. Cosa è stato fatto

1. Allineato `sumGuestsByDate` a digest/eventi: richiede `confirmed_end`.
2. Avviso sforo giornaliero su `AdminBookingForm` via `CapacityWarningModal` (submit admin sempre ok).
3. `useCapacityCheck` esclude `no_show` dall'occupazione per-fascia.
4. `transformBookingsToCalendarEvents` filtra `!no_show` (difesa profondità).
5. Input limite giornaliero in Impostazioni accetta solo interi 1–1000 o vuoto.
6. `datesSet` FC sincronizza `selectedDate` al cambio mese (stesso giorno del mese, clamp).
7. Pulsante **Riprova** su errore caricamento in `BookingCalendarTab`.
8. Badge esattamente 100% → tono `high`, `over` solo se `pct > 100`.
9. CSS anti-sbordo badge mobile su holder + badge.
10. Digest settimana Pro: `hasTurns={hasTurnsFeature}`.
11. Investigato No-show UI: **voluto** (edition + orario passato), nessun fix LOCK.
12. Test `@admin-blindatura: calendario` estesi (+9 test, **38** totali area M2).
13. C-R2 documentato come voluto in §5-ter.
14. Skill e FU-047 aggiornati.

---

## 3. Tabella finding → fix → prima / dopo

| ID | Prima | Dopo |
|----|-------|------|
| **C-D1** | Badge contava accepted senza `confirmed_end`; digest/eventi no → % gonfiata | `sumGuestsByDate` richiede `confirmed_end` come digest/FC |
| **C-D2** | Form da calendario su giorno pieno: nessun avviso giornaliero | `AdminBookingForm` → `CapacityWarningModal` se oltre `daily_guest_limit`; submit ok |
| **C-D3** | `useCapacityCheck` sommava no-show → avviso per-fascia più severo del badge | Filtro `!booking.no_show` nel loop giorno |
| **C-D4** | Transform poteva emettere eventi no-show se chiamata diretta | Filtro `&& !b.no_show` in `bookingEventTransform` |
| **C-D5** | Input poteva salvare `NaN`/stringhe parziali | `onChange` accetta solo `^\d+$` 1–1000 o vuoto; registry invariato |
| **C-U1** | Prev/next mese: digest e «Nuova prenotazione il 12/06» restavano su giugno | `datesSet` riallinea `selectedDate` (es. 12/06→12/07) |
| **C-U4** | Errore rete: riquadro rosso senza retry | Pulsante **Riprova** invalida query `useAcceptedBookings` |
| **C-L1** | 100% usava classe `over` (rosso) | 100% = `high`; `over` solo se `pct > 100` |
| **C-R1** | Badge 101%+ poteva sbordare cella a 375px | `overflow` + `max-width` su holder/badge |
| **C-R3** | Digest settimana: `hasTurns={false}` → niente pallino Pro | `hasTurns={hasTurnsFeature}` |

**Non in batch A (documentati):**

| ID | Esito |
|----|-------|
| **C-R2** | **Voluto** — badge % solo vista mese FC (§5-ter punto 20) |
| **No-show UI** | **Voluto** — pulsante solo se `features.noShow` (Pro+) **e** `confirmed_start` nel passato; Classic assente per edition |

**C-D5 edge:** nessun deploy `create-booking`; registry già parsa stringhe JSON — nessun dato corrotto rilevato in codice.

---

## 4. Regola navigazione mese (C-U1)

Su `datesSet` in `dayGridMonth`: se anno/mese di `selectedDate` ≠ mese ancorato FC (`view.currentStart`), si imposta lo **stesso giorno del mese** nel mese visibile (clamp all'ultimo giorno se febbraio ecc.). Digest, `calendar-day-selected` e pulsante «Nuova prenotazione il GG/MM» seguono il nuovo `selectedDate`.

---

## 5. File toccati

| File | Perché |
|------|--------|
| `capacityCalculator.ts` | C-D1 `confirmed_end` in `sumGuestsByDate` |
| `bookingEventTransform.ts` | C-D4 filtro no-show |
| `useCapacityCheck.ts` | C-D3 esclusione no-show |
| `AdminBookingForm.tsx` | C-D2 avviso giornaliero |
| `BookingCalendar.tsx` | C-U1 datesSet, C-L1 soglia badge, C-R3 hasTurns settimana |
| `BookingCalendarTab.tsx` | C-U4 Riprova |
| `RestaurantSettingsTab.tsx` | C-D5 validazione input |
| `index.css` | C-R1 overflow badge |
| Test calendario + nuovi file test | Copertura batch A |
| Skill + FOLLOW_UP | Allineamento §7.2 |

---

## 6. Test eseguiti

| Comando | Esito |
|---------|-------|
| `npm test -- --run calendario… adminBookingForm.dailyLimit… bookingEventTransform… useCapacityCheck… sumGuestsByDate… restaurantSettingRegistry.dailyGuestLimit…` | **38/38** pass |
| `npm run validate` | **520/520** pass |

---

## 7. File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `ADMIN_PRENOTAZIONI_CONTEXT.md` §5-ter | Punti 15–20, tabella criteri conteggio, C-R2 voluto | Batch A + no-show UI |
| `BOOKING_CALENDAR_LAYOUT_CONTEXT.md` | §7-bis badge/CSS/retry | Layout responsive badge |
| `ADMIN_TEST_SUITE_INDEX.md` §8-bis | 38 test, mapping lacune chiuse | Copertura batch A |
| `FOLLOW_UP.md` FU-047 | Quasi chiuso; restano C-U2/C-U3 | Tracciamento |

---

## 8. No-show UI (output 11)

**Componente:** `BookingDetailsModal` (modale dettaglio da digest calendario).

**Condizioni pulsante:** `features.noShow && canMarkNoShow` dove `canMarkNoShow` = accepted, non walk-in, non già no-show, `confirmed_start` **nel passato**.

**Perché Matteo non vede il pulsante:** su **Classic** `features.noShow` è `false` (edition); su Pro con prenotazioni **future** il pulsante è nascosto fino a dopo l'orario. **Nessun bug LOCK** — comportamento edition/stato documentato in §5-ter punto 19.

---

## 9. Dati comunicazione

- Prompt unico batch A con 17 output numerati — efficace per scope chiuso.
- Decisioni D1/D3/R2 esplicite in testa hanno evitato fix su R2.

---

## 10. Analisi flusso prompt

| Metrica | Valore |
|---------|--------|
| Prompt sostanziali | 1 |
| Correzioni dopo 1ª risposta | 0 |
| Follow-up generati | C-U2, C-U3 |
| Modalità alzata | no (già deep) |

---

## 11. La TUA lettura della sessione

- **Impressioni:** batch A ben delimitato; la tabella criteri conteggio in §5-ter riduce il rischio di nuovi disallineamenti. Test `AdminBookingForm` ha richiesto QueryClient + selettori placeholder.
- **Difficoltà:** mock FC per `datesSet` senza simulare navigazione reale — test su handler isolato.
- **Miglioria:** smoke Playwright opzionale solo per datesSet + badge 375px.

---

## 12. Derivazione errori

Tutti i finding batch A = **bug preesistente** / gap prodotto dalla Fase C. Nessun errore agente.

---

## 13. Cosa resta

1. C-U3 → FU-048 (copy turni Pro).
2. QA browser badge §9 report Fase C.
3. FU-REV-CAL-4 (opzionale).
4. Deploy edge `create-booking` C-D5 su richiesta Matteo.
5. `MASTERPLAN_BLINDATURA.md` colonna Blindato dopo QA Matteo.

---

## 14. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: Unico prompt sostanziale (apertura sessione): «Profilo: Esecuzione / Modalità: deep / Skill da leggere: docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md §3-ter · docs/Admin-Skill/contesto/ADMIN_PRENOTAZIONI_CONTEXT.md §5-ter · docs/Admin-Skill/contesto/BOOKING_CALENDAR_LAYOUT_CONTEXT.md · docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md · docs/Testing-Skill/TESTING_SKILL.md §1 / Non caricare: Pagina Prenota pubblica (salvo lettura create-booking DAILY_LIMIT per contesto), Menu QR, M3/M4/M5, E2E Playwright calendario / Output attesi: 1) C-D1… 17) docs/FOLLOW_UP.md FU-047… / Branch: env/test / Obiettivo: chiudere i finding Fase C classificati A su tab Calendario admin (M2)… / Vincoli LOCK: BookingDetailsModal… useBookingMutations… / Criterio di fatto: validate verde; test calendario aggiornati passano; report con tabella 10 finding chiusi + nota no-show UI + R2 voluto.» — secondo messaggio in chat: hook fine-sessione che chiede di completare la sezione Domande di chiusura §11 CHIUSURA_SESSIONE.

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Branch `env/test`, working tree non committato. **Diff `src/`:** 10 file modificati + 3 test nuovi untracked (`adminBookingForm.dailyLimit`, `useCapacityCheck`, `bookingEventTransform`); **14 file** totali toccati in git status inclusi 4 doc skill + report. Riaperti/verificati: `capacityCalculator.ts` L126 (`!b.confirmed_end`); `bookingEventTransform.ts` L157 (`!b.no_show`); `useCapacityCheck.ts` L74 (`booking.no_show`); `AdminBookingForm.tsx` blocco `dailyGuestLimit` + `capacityWarningOverride`; `BookingCalendar.tsx` `handleDatesSet`, soglia `pct > 100`, `hasTurns={hasTurnsFeature}`; `BookingCalendarTab.tsx` `handleRetry` + `Button Riprova`; `RestaurantSettingsTab.tsx` onChange con `^\d+$`; `index.css` overflow su holder/badge. **Test:** rieseguito suite M2 → **38/38** (non 37: corretto nel report); `npm run validate` → **520/520**. **Finding chiusi:** 10 in tabella §3 (C-D1…C-R3 esclusi C-R2 voluto). **No-show:** `BookingDetailsModal.tsx` L176-181 + L876 (`features.noShow && canMarkNoShow`) — nessun diff LOCK. **Non toccato:** edge `create-booking`, `MASTERPLAN_BLINDATURA.md` (fuori scope batch).

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: **Aggiornati e verificati nel diff:** `ADMIN_PRENOTAZIONI_CONTEXT.md` §5-ter punti 15–20 + tabella criteri; `BOOKING_CALENDAR_LAYOUT_CONTEXT.md` §7-bis badge/CSS/retry; `ADMIN_TEST_SUITE_INDEX.md` §8-bis (38 test, mapping 2-bis/2-ter/2-quater, buchi residui C-U2/C-U3); `FOLLOW_UP.md` FU-047 quasi chiuso. **Test allineati:** `calendario.adminBlindatura.test.tsx` (16), `sumGuestsByDate` (+1 legacy), 3 file test nuovi, registry daily limit (9) invariato. **Non aggiornati (debito dichiarato §13):** `MASTERPLAN_BLINDATURA.md` — colonna Blindato resta ⬜ finché QA Matteo; `PLAN_BLINDATURA_ADMIN.md` §3-ter.4 cancello non riscritto (nessun cambio criterio uscita oltre batch A). **Tipi/migrazioni:** nessuna — comportamento su campi esistenti `confirmed_end`, `no_show`, `daily_guest_limit` JSONB.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: **Per mandato esplicito non fatto:** C-U2 (portale modale shell), C-U3 (copy/toggle turni Pro), C-R2 fix (voluto), E2E Playwright calendario, deploy edge `create-booking` per C-D5, modifiche LOCK `BookingDetailsModal`/`useBookingMutations`, commit/push. **Non fatto per ambiente:** QA browser MCP 375/834/1280 (nessun login admin in sessione). **Lacune test opzionali:** FU-REV-CAL-1 (pending a livello componente), FU-REV-CAL-2 (voluto), FU-REV-CAL-4 (nota selettori RTL). **Doc:** `MASTERPLAN_BLINDATURA.md` non aggiornato. Certo perché elencati come esclusi nel prompt o in §13 resta, e `git diff`/`status` non li mostrano modificati.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: **Attrito:** allineare quattro filtri conteggio (badge, digest, transform, `useCapacityCheck`) richiede saltare file — la tabella §5-ter punto 15 aiuta ma va mantenuta a ogni nuovo hook; test `AdminBookingForm` reale ha richiesto `QueryClientProvider` + placeholder invece di label. **Miglioria:** in `ADMIN_TEST_SUITE_INDEX` aggiungere riga «wrapper minimo AdminBookingForm in test» (QueryClient + matchMedia) come pattern copiabile per FU-REV-CAL-3+.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: **Giusto** — prompt con 17 output numerati, vincoli LOCK e divieto E2E/Menu QR hanno tenuto il batch A circoscritto; report Fase C come fonte finding ha evitato ridiscutere i voluti. **Hook fine-sessione** (questo messaggio): utile — ha intercettato report senza Q/R prima del commit; non rumore. Nessun hook `stop` precedente in questa chat.

---

## 15. Self-review

1. **Dati = diff:** conteggio test corretto 38 (non 37); file e righe riletti nel diff — OK.
2. **File correlati:** skill §5-ter/layout/test index/FU-047 aggiornati; MASTERPLAN esplicitamente in resta — OK.
3. **Q1–Q6:** risposte con sostanza, coerenti con diff e §13.
4. **Tono:** cappello per ristoratore; tecnico in tabella finding.

---

*Batch A eseguito 11-06-26 — agente Esecuzione, modalità deep.*
