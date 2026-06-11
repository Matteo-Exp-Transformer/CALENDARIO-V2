# Report revisione — M2 tab Calendario test blindatura Fase A–B (11-06-26)

> Profilo Verifica. Revisione del lavoro esecutore (`Report-m2-calendario-test-blindatura-11-06-26.md`)
> su branch `env/test`. Zero modifiche a codice.

## 1. Verdetto

**ACCETTA CON RISERVE** — Fase A–B chiusa correttamente per mandato (29 test Vitest, validate verde,
zero `src/` prodotto, doc coerente). Riserve minori: buco esplicito su pending negli eventi FC/digest a
livello componente; avviso-sforo crea-da-giorno fuori scope del mock `AdminBookingForm`; Fase C e QA
responsive ancora aperti (voluto).

---

## 2. Tabella scenari §3-ter.3

| # | Scenario | Test che coprono | Esito | Nota |
|---|----------|------------------|-------|------|
| 1 | Solo accettate (pending assenti) | `sumGuestsByDate.adminBlindatura.test.ts` (7) — pending/rejected/deleted/no-show; `calendario.adminBlindatura.test.tsx` — events FC no-show; digest no-show + senza orario | **OK** (riserva) | `sumGuestsByDate` + filtri digest/events nel codice (`transformBookingsToCalendarEvents` filtra `status === 'accepted'`) sono allineati. Manca un `it` che passi una `pending` al prop `bookings` e asserisca assenza da events **e** digest — oggi coperto solo indirettamente. Non è falso verde grave: catena monte (`useAcceptedBookings` in `BookingCalendarTab`) + utility testata. |
| 2 | Badge % — senza limite conteggio; con limite solo %; >100% reale | `calendario.adminBlindatura.test.tsx` → `dayCellDidMount` (3 `it`: null, N, 108% + `booking-day-fill--over`); `restaurantSettingRegistry.dailyGuestLimit.adminBlindatura.test.ts` (9) — `0`/vuoto = illimitato | **OK** | `mountDayBadge` invoca il callback reale catturato da `BookingCalendar` — non è helper isolato: testa il wiring badge nel componente. Registry copre la sentinella `0`→null che alimenta il ramo «solo conteggio». |
| 3 | Gate tavolo Classic assente / Pro+slot presente | `calendario.adminBlindatura.test.tsx` — Classic `servizio: false`; Pro `servizio: true` + `slots.length > 0` → `Assegna tavolo` | **OK** | Mock allineato al gate reale `hasTurnsFeature = features.servizio && serviceSlots.length > 0` (`BookingCalendar.tsx:407`). Non testato il caso limite Pro con `servizio: true` ma slot vuoti (dovrebbe comportarsi come Classic) — follow-up minore. |
| 4 | Crea da giorno — `dateClick` seleziona; pulsante apre form; giorno pieno non blocca | `calendario.adminBlindatura.test.tsx` — 3 `it` su `dateClick`, pulsante + `initialDate`, giorno oltre limite apre form | **OK** (riserva) | Wiring calendario→`AdminBookingForm` verificato; form mockato (corretto per scope calendario). **Avviso sforo** (`CapacityWarningModal`) non assertato: il modale vive in `AdminBookingForm` al submit, non all'apertura dal calendario — buco accettabile in Fase A–B calendario, da coprire in `@admin-blindatura: prenotazioni` o Fase C. |
| 5 | No drag&drop | `calendario.adminBlindatura.test.tsx` — assenza `editable`/`eventDrop`/`eventResize`/`selectable`/`select`/`eventDragStart` nelle props FC | **OK** | Regressione credibile: grep su `BookingCalendar.tsx` conferma assenza di quelle props nel sorgente. Mock FC cattura config — pattern accettabile Fase A–B. |
| 6 | Rifiuta/cancella solo da modale dettaglio con conferma | `calendario.adminBlindatura.test.tsx` — superficie senza Elimina/Rifiuta; digest → `BookingDetailsModal` → `BookingDangerActionModal` Elimina, `window.confirm` non chiamato | **OK** (voluto) | Per prenotazioni **accettate** in calendario «Rifiuta» è N/A (§5-ter: rifiuto è flusso pending in Prenotazioni). `BookingDetailsModal` espone **Elimina** (soft-delete), non Rifiuta — test coerente. Copertura Elimina + conferma custom sufficiente per lo scenario plan. |

---

## 3. Validate (rieseguito dal revisore)

```text
npm run validate
→ Test Files  59 passed (59)
→ Tests       511 passed (511)
→ exit code 0
```

Conteggio `@admin-blindatura: calendario`: **29** = 7 (`sumGuestsByDate`) + 9 (`dailyGuestLimit`) + 13 (`calendario.adminBlindatura.test.tsx`). Grep su 3 file in `src/**/__tests__`.

---

## 4. Checklist revisione

### A. Report vs diff reale

| Controllo | Esito |
|-----------|-------|
| File citati esistono | ✅ `calendario.adminBlindatura.test.tsx` (untracked), doc modificate, report esecutore presente. `sumGuestsByDate` e `dailyGuestLimit` già su branch da commit `420a520` — coerente con «estesi», non nel diff unstaged corrente. |
| 29 test calendario | ✅ Verificato grep `it(` per file. |
| Nessun `src/` prodotto modificato nella sessione | ✅ Diff unstaged: solo `docs/` + nuovo `__tests__/calendario.adminBlindatura.test.tsx`. |
| `npm run validate` verde | ✅ 511/511 (non solo memoria report). |
| Branch `env/test` | ✅ |

### B–D. Anti-falso-verde e doc

| Tema | Giudizio |
|------|----------|
| Mock FullCalendar senza griglia reale | Accettabile Fase A–B — cattura `dateClick`/`dayCellDidMount`/props; pattern usato anche nel layout context. |
| `BookingDetailsModal` senza `role="dialog"` | Test usa `heading` «Dettagli Prenotazione» — funziona oggi, fragile se copy cambia. Follow-up doc (suggerito dall'esecutore). |
| `AdminBookingForm` mockato | OK per scope calendario (wiring `initialDate`). |
| `ADMIN_TEST_SUITE_INDEX.md` §8-bis | Allineato ai 3 file e mapping 6 righe. |
| `MASTERPLAN_BLINDATURA.md` | Testato ✅, Blindato ⬜ — corretto (manca cancello §4: Fase C + QA responsive). |
| `PLAN_BLINDATURA_ADMIN.md` §3-ter.4 | Coerente: test A–B fatti, controtest Fase C ancora richiesto. |
| Regola «estendi, non duplicare» (`TESTING_SKILL.md` §1) | Rispettata — nuovo file RTL + riuso 16 test preesistenti. |
| Solo Vitest, no E2E calendario | Rispettato. |

---

## 5. Finding classificati

### Fix obbligatorio

*Nessuno* — nessun bug evidente nei test che richieda fix immediato prima di «lavoro ok».

### Follow-up (non bloccanti Fase A–B)

| ID | Finding |
|----|---------|
| FU-REV-CAL-1 | Aggiungere `it` in `calendario.adminBlindatura.test.tsx`: `bookings` con `status: 'pending'` → assente da `events` FC e digest (chiude riserva scenario 1 a livello componente). |
| FU-REV-CAL-2 | Caso limite gate tavolo: `servizio: true` + `slots: []` → nessun pallino (allineato a `hasTurnsFeature`). |
| FU-REV-CAL-3 | Avviso sforo crea-da-giorno: test integrazione in `@admin-blindatura: prenotazioni` su `AdminBookingForm` + `CapacityWarningModal` (fuori scope mock calendario). |
| FU-REV-CAL-4 | Nota test RTL in `ADMIN_PRENOTAZIONI_CONTEXT.md` §8: selettori dettaglio calendario (heading + `BookingDangerActionModal`). |
| FU-REV-CAL-5 | **Fase C controtest** «rompi» sui 4 fronti (`MANUALE_BLINDATURA.md` §3) — mandato sessione successiva. |
| FU-REV-CAL-6 | **QA responsive** badge 375/834/1280 (FU-CAL-3). |

### Voluto

| Voce | Motivo |
|------|--------|
| Nessun E2E Playwright calendario | Decisione Matteo. |
| `MASTERPLAN` Blindato ⬜ | Cancello §4: Fase C + QA responsive mancanti. |
| Scenario 6 senza test «Rifiuta» su accettate | Rifiuta non applicabile alle accettate in calendario (§5-ter). |
| `AdminBookingForm` mockato nello scenario 4 | Scope Fase A–B = wiring calendario, non form intero. |
| File test `sumGuestsByDate` / `dailyGuestLimit` già committati in sessione precedente | Suite totale 29 corretta; diff unstaged mostra solo il file RTL nuovo. |

### Falso allarme

| Voce | Perché |
|------|--------|
| «Manca test `useAcceptedBookings` query Supabase» | Accettabile: thin wrapper; filtro status replicato in `transformBookingsToCalendarEvents` + digest + `sumGuestsByDate`. |
| «Badge testa solo helper isolato» | Falso: `mountDayBadge` usa callback da `BookingCalendar` renderizzato. |

---

## 6. Prossimo passo per Matteo

1. **«lavoro ok»** sull'esecutore — Fase A–B accettata con riserve minori documentate sopra.
2. Aprire sessione **Fase C controtest** calendario (mandato «rompi» 4 fronti) + QA responsive badge.
3. Opzionale prima del controtest: un solo `it` FU-REV-CAL-1 (pending negli events) — 5 minuti, non bloccante.
4. Commit quando pronto: `calendario.adminBlindatura.test.tsx` + doc + report esecutore (ancora unstaged).

---

## Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) «Profilo: Verifica / Modalità: standard / Skill da leggere: docs/Testing-Skill/MANUALE_BLINDATURA.md §4 (cancello blindato — cosa manca ancora), docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md §3-ter.3 e §3-ter.4, docs/Admin-Skill/contesto/ADMIN_PRENOTAZIONI_CONTEXT.md §5-ter, docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md §8-bis, docs/Testing-Skill/TESTING_SKILL.md §1 (anti-falso-verde: estendi, non duplicare inutilmente), Report esecutore: docs/Sessioni di lavoro/11-06-26/Report-m2-calendario-test-blindatura-11-06-26.md / Non caricare: Prenota, Menu QR, M3/M4/M5 / Output attesi: 1) Report revisione breve in docs/Sessioni di lavoro/11-06-26/ (nuovo file Report-revisione-m2-calendario-test-11-06-26.md) 2) Verdetto esplicito: ACCETTA | ACCETTA CON RISERVE | RESPINGI (con motivazione) 3) Tabella 6 scenari §3-ter.3 → test che li coprono → OK / BUCO / FALSO VERDE 4) Esito npm run validate rieseguito da te (numero test reale, non fidarti solo del report) 5) Elenco finding classificati: fix obbligatorio | follow-up | voluto | falso allarme 6) ZERO modifiche a codice salvo bug evidente nei test (se serve fix, elencalo — non implementare senza Sì/No) niente output in più senza chiedere Sì/No prima / Regola modalità: puoi solo ALZARE la modalità, mai abbassarla. / … Obiettivo: Revisione completa del lavoro esecutore sulla Fase A–B blindatura tab Calendario M2 … Branch atteso: env/test. / … Fine sessione: Consegni solo il report revisione.» (2) «⚠️ FINE-SESSIONE — la sezione «Domande di chiusura» (CHIUSURA_SESSIONE §11) non è completa: docs/Sessioni di lavoro/11-06-26/Report-revisione-m2-calendario-test-11-06-26.md manca l'INTERA sezione 11 «Domande di chiusura» (le 6 domande ❓Q + ✅R). Aggiungila e rispondi. / Le domande sono in docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md §11 — formato ❓ Q… / ✅ R…. / Per Q2 (dati=diff) e Q3 (file correlati) DEVI rileggere il diff e i file prima di rispondere. / Compila TUTTE le risposte mancanti, poi conferma in 1 riga che le hai scritte.»

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Ri-verificato ora con `git status --short`, `git diff --stat` e diff puntuale su `ADMIN_TEST_SUITE_INDEX.md` + `MASTERPLAN_BLINDATURA.md`. Branch `env/test`. Unstaged: `M` sui due doc (+37/−9 righe), `??` su `calendario.adminBlindatura.test.tsx` (13 `it`, 444 righe), report esecutore e questo report revisione. Nessun `src/` prodotto nel diff unstaged. I 16 test `sumGuestsByDate` (7) + `dailyGuestLimit` (9) sono già su branch (commit `420a520`), non nel diff corrente — coerente col totale 29. Grep `@admin-blindatura: calendario` → 3 file. `npm run validate` rieseguito in sessione: **511 passed / 59 file**, exit 0. Verdetto ACCETTA CON RISERVE e tabella scenari allineati al contenuto reale di `calendario.adminBlindatura.test.tsx` (letto intero) e ai filtri in `BookingCalendar.tsx` / `transformBookingsToCalendarEvents`.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: **Aggiornati e verificati nel diff:** `ADMIN_TEST_SUITE_INDEX.md` — marcatore `@admin-blindatura: calendario` in tabella §0 + nuova §8-bis (mapping 6 scenari, 29 test, buchi Fase C); `MASTERPLAN_BLINDATURA.md` — riga tab Calendario Testato ✅ (29 test), Blindato ⬜, sezione M2 «Prossimo» → controtest + QA responsive. **Correlati, già corretti senza bisogno di edit in questa revisione:** `PLAN_BLINDATURA_ADMIN.md` §3-ter.3/4 (scenari e criterio uscita coerenti col verdetto); `ADMIN_PRENOTAZIONI_CONTEXT.md` §5-ter (decisioni invariate); `MANUALE_BLINDATURA.md` §4 (cancello: Fase C + QA mancanti → Blindato resta ⬜). **Non aggiornati (debito follow-up, non bloccante revisione):** `ADMIN_PRENOTAZIONI_CONTEXT.md` §8 nota selettori RTL (FU-REV-CAL-4); `BOOKING_CALENDAR_LAYOUT_CONTEXT.md` (nessun cambio layout). **Output revisione:** questo report + report esecutore (untracked). Nessun tipo/migrazione DB toccato.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: **Non fatto per mandato esplicito:** modifiche a codice/test (salvo bug evidente — nessuno trovato); controtest Fase C «rompi»; E2E Playwright calendario; commit/push; implementazione fix FU-REV-CAL-1/2/3. **Non fatto fuori scope revisore:** sub-agent `CONTROVERIFICA.md` (scatta su «report finale», non su «lavoro ok» revisione); aggiornamento skill non richiesto dal diff (solo doc index + masterplan). **Non fatto ma segnalato come follow-up:** test `pending` negli events FC, caso Pro senza slot, assert avviso-sforo su `AdminBookingForm`. Ne sono certo perché il prompt vietava tocchi a `src/` e il deliverable era solo il report revisione con verdetto.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: **Attrito:** il lavoro esecutore è su due commit/sessioni (16 test già committati + 13 nuovi unstaged) — senza `git log` sul file test si rischia di credere che il diff unstaged sia l'intera suite 29. **Miglioria:** in `ADMIN_TEST_SUITE_INDEX.md` §8-bis aggiungere una riga «ultimo commit / unstaged» o elencare esplicitamente quali file sono nuovi vs preesistenti nel branch, così il revisore non deve incrociare `git status` + `git log` a mano.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: **Giusto** — lista skill mirata (MANUALE §4, PLAN §3-ter, context §5-ter, test index §8-bis, report esecutore) + divieto Prenota/Menu QR/M3–M5 ha tenuto il focus sulla qualità dei 6 scenari senza espandere scope. `TESTING_SKILL.md` §1 («estendi») utile per giudicare il riuso dei 16 test preesistenti. **Hook fine-sessione** (secondo prompt) utile: ha segnalato correttamente la §11 mancante — senza quello il report revisione sarebbe passato incompleto. Nessun rumore da hook `stop` in questa chat prima del nudge esplicito.

## Self-review

1. Dati = diff: riletto `git diff` e file test/doc citati — OK.
2. File correlati: index + masterplan allineati; follow-up doc selettori RTL tracciato, non dimenticato come «fatto».
3. Q1–Q6 con sostanza, coerenti col verdetto ACCETTA CON RISERVE.
4. Tono: verdetto e prossimi passi per Matteo, non solo nomi-file.

---

*Revisione eseguita 11-06-26 — revisore: agente Verifica, modalità standard.*
