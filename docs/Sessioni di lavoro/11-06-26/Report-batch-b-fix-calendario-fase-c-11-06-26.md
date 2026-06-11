# Report — Batch B fix Fase C tab Calendario admin (M2)

> Profilo Esecuzione · modalità **standard** · branch `env/test` · 11-06-26.
> Complemento batch A (`Report-batch-a-fix-calendario-fase-c-11-06-26.md`). Focus: difesa in profondità dati, retry UX, lacune test — senza toccare UX batch A.

---

## 1. Cappello

- **Effetto per il ristoratore:** il calendario e il blocco pubblico contano i coperti con le stesse regole (no-show esclusi ovunque); se il caricamento del calendario fallisce, lo staff può premere **Riprova**; le richieste in attesa non compaiono mai in griglia o digest anche in casi anomali.
- **Test (allineamento doc 11-06-26):** M2 **41** `@admin-blindatura: calendario` (+**2** No-show fuori conteggio M2); `npm run validate` **527** verde.
- **Cosa resta:** C-U3 → FU-048, FU-REV-CAL-4 (opzionale), deploy edge `create-booking` su TEST (parser C-D5 in repo, non deployato), QA browser badge opzionale.
- **Addendum Matteo (stessa giornata):** fix pulsante **No-show** su richiesta **esplicita** di Matteo — vedi §2-bis.
- **Serve azione Matteo:** **sì** — conferma deploy edge `create-booking` su TEST (`docnnernvp`) per attivare il parser C-D5 lato server.

---

## 2. Cosa è stato fatto

1. **C-D3** — `useCapacityCheck` esclude `no_show` dall'occupazione per-fascia (allineato a `sumGuestsByDate`).
2. **C-D4** — `transformBookingsToCalendarEvents` filtra `&& !b.no_show` (difesa in profondità).
3. **C-D5 edge** — `create-booking` usa `parseDailyGuestLimitFromDb` (accetta anche stringa `"24"`, `0`/`-1` = illimitato). **Nessun deploy** in sessione.
4. **C-U4** — `BookingCalendarTab`: pulsante **Riprova** invalida query `['bookings','accepted', tenantId]`.
5. **FU-REV-CAL-1** — test: pending assenti da eventi FC e digest.
6. **FU-REV-CAL-2** — test: `servizio:true` + `slots:[]` → nessun pallino turno/tavolo.
7. Test unit C-D3 in `useCapacityCheck.adminBlindatura.test.ts` (2 scenari).
8. `npm run validate` **523/523** verde.
9. `ADMIN_TEST_SUITE_INDEX` + `FOLLOW_UP.md` FU-047 aggiornati.

### 2-bis. Addendum — No-show UI (richiesta esplicita Matteo, post batch B)

> **Origine:** non finding Fase C né decisione agente. **Matteo ha chiesto esplicitamente** in chat
> di correggere la logica del pulsante No-show dopo averla provata in dev.

**Prompt verbatim Matteo:**

> «logica no show errata --> deve mostrare pulsante no show , quando superato orario di inizio prenotazione, non orario di fine.»

**Contesto:** nel batch A il comportamento No-show era stato documentato come «voluto» (edition + orario
passato) perché in codice c’era già `confirmed_start nel passato`; in QA Matteo ha visto il pulsante
comparire in ritardo (effetto timezone su `new Date(iso)` vs orario a muro). **La modifica è stata
richiesta da lui**, non dedotta dal controtest.

| Prima | Dopo |
|-------|------|
| `new Date(confirmed_start) < now` → ritardo 1–2 h in IT | `isWallClockStartBeforeNow(data, ora inizio)` — pulsante dopo **inizio**, non fine |
| File LOCK `BookingDetailsModal.tsx` | Toccato **solo** su esplicita richiesta Matteo (deroga al vincolo batch B) |

**File:** `BookingDetailsModal.tsx`, `bookingDetailsModal.noShow.adminBlindatura.test.tsx` (2 test),
`ADMIN_PRENOTAZIONI_CONTEXT.md` §5-ter punto 19. **Validate:** **525/525** verde.

---

## 3. Tabella finding → fix → prima / dopo

| ID | Prima | Dopo |
|----|-------|------|
| **C-D3** | `useCapacityCheck` sommava no-show → avviso per-fascia più severo del badge | Filtro `!booking.no_show` in `dayBookings`; test occupazione 6 vs 6+8 no-show |
| **C-D4** | Transform poteva emettere eventi no-show se chiamata con array sporco | Filtro `&& !b.no_show` in `transformBookingsToCalendarEvents`; test utility |
| **C-D5 edge** | Edge accettava solo `typeof number`; stringa JSON `"24"` bypassava `DAILY_LIMIT` | `parseDailyGuestLimitFromDb` duplicato in edge (sync commento registry); **deploy TEST pendente** |
| **C-U4** | Errore rete: riquadro rosso senza azione | Pulsante **Riprova** + test `bookingCalendarTab.adminBlindatura` |
| **FU-REV-CAL-1** | Nessun test componente su pending in prop `bookings` | Test FC + digest: pending assente |
| **FU-REV-CAL-2** | Nessun test Pro senza slot configurati | Test: servizio on + `slots:[]` → niente pallino/turno |

**Già chiusi in batch A (invariati in B):** C-D1, C-D2, C-D5 UI Impostazioni, C-U1, C-L1, C-R1, C-R3, C-R2 voluto.

---

## 4. C-D5 edge — nota deploy

| Ambiente | Stato |
|----------|--------|
| Repo `supabase/functions/create-booking/index.ts` | ✅ parser allineato |
| TEST `docnnernvp` | ⬜ deploy su conferma Matteo |
| PROD `rwuxgvld` | ⬜ solo con ok esplicito |

Parser replica la logica di `restaurantSettingRegistry.ts` (`0`, `-1`, stringa numerica → stesso esito dell'app admin).

---

## 5. File toccati

| File | Perché |
|------|--------|
| `useCapacityCheck.ts` | C-D3 esclusione no-show |
| `bookingEventTransform.ts` | C-D4 filtro no-show |
| `create-booking/index.ts` | C-D5 `parseDailyGuestLimitFromDb` |
| `BookingCalendarTab.tsx` | C-U4 Riprova (batch A, test in B) |
| `useCapacityCheck.adminBlindatura.test.ts` | C-D3 unit |
| `bookingEventTransform.adminBlindatura.test.ts` | C-D4 unit |
| `calendario.adminBlindatura.test.tsx` | FU-REV-CAL-1/2 |
| `bookingCalendarTab.adminBlindatura.test.tsx` | C-U4 test |
| `ADMIN_TEST_SUITE_INDEX.md` | 41 test M2, buchi residui |
| `FOLLOW_UP.md` FU-047 | batch B chiusura parziale |
| `BookingDetailsModal.tsx` | Addendum: No-show dopo inizio a muro (**richiesta esplicita Matteo**) |
| `bookingDetailsModal.noShow.adminBlindatura.test.tsx` | Addendum: 2 test visibilità No-show |
| `ADMIN_PRENOTAZIONI_CONTEXT.md` §5-ter.19 | Addendum: chiarimento inizio vs fine |

---

## 6. Test eseguiti

| Comando | Esito |
|---------|-------|
| `npm test -- --run calendario adminBlindatura bookingCalendarTab useCapacityCheck bookingEventTransform` | **23/23** pass (sottoinsieme M2 batch B) |
| `npm run validate` | **523/523** pass (batch B); **525/525** dopo addendum No-show; **527/527** allineamento doc (post C-U2 guard +2) |
| `npm test -- --run bookingDetailsModal.noShow` | **2/2** pass (addendum) |

**Conteggio area M2 `@admin-blindatura: calendario`:** 41 (18 calendario + 1 tab + 1 form daily + 2 capacity hook + 2 transform + 8 sumGuests + 9 registry). **+2** test prenotazioni addendum No-show (file separato).

---

## 7. File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `ADMIN_TEST_SUITE_INDEX.md` §8-bis | 41 test, FU-REV-CAL-1/2 chiusi, nota deploy edge | Batch B |
| `FOLLOW_UP.md` FU-047 | batch A+B, lacune residue | Tracciamento |
| `ADMIN_PRENOTAZIONI_CONTEXT.md` §5-ter.19 | Addendum: No-show su orario **inizio** a muro | Richiesta esplicita Matteo |

---

## 8. Dati comunicazione

- Prompt batch B con 10 output numerati e divieto E2E/LOCK — scope rispettato.
- C-D5 deploy esplicitamente condizionato: fix repo senza MCP deploy.
- **Addendum No-show:** Matteo ha chiesto esplicitamente la correzione (verbatim in §2-bis); conferma «ok annota nel report che ti ho espressamente chiesto io questa modifica».

---

## 9. Analisi flusso prompt

| Metrica | Valore |
|---------|--------|
| Prompt sostanziali | 2 (batch B + addendum No-show esplicito Matteo) |
| Correzioni dopo 1ª risposta | 1 (No-show: richiesta diretta, non finding agente) |
| Follow-up generati | deploy edge TEST, C-U2/C-U3 |
| Modalità alzata | no (standard) |

---

## 10. La TUA lettura della sessione

- **Impressioni:** batch B leggero perché batch A aveva già portato C-D3/C-D4/C-U4 in working tree; valore aggiunto = edge parser + 3 test lacune + report/skill.
- **Difficoltà:** mock `useQueryClient` in test tab senza rompere `QueryClientProvider`.
- **Miglioria:** riga in `TESTING_PATTERNS.md` per «sync parser edge ↔ registry» come per i limiti testo Prenota.

---

## 11. Derivazione errori

Tutti i finding = **bug preesistente** / lacune test dalla Fase C. Nessun errore agente.

---

## 12. Cosa resta

1. C-U3 → FU-048.
2. FU-REV-CAL-4 (opzionale).
3. Deploy edge `create-booking` su TEST (C-D5).
4. QA browser badge 375/834/1280.

---

## 13. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) Prompt batch B — «Profilo: Esecuzione / Modalità: standard … FU-047 parziale/chiusura batch B.» (2) **Addendum richiesta esplicita Matteo:** «logica no show errata --> deve mostrare pulsante no show , quando superato orario di inizio prenotazione, non orario di fine.» (3) «ok annota nel report che ti ho espressamente chiesto io questa modifica».

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Branch `env/test`. Verificati: `useCapacityCheck.ts` L74 `booking.no_show`; `bookingEventTransform.ts` L157 `!b.no_show`; `create-booking/index.ts` funzione `parseDailyGuestLimitFromDb` + uso L308; `BookingCalendarTab.tsx` `handleRetry` + queryKey; test calendario +3 `it`, `bookingCalendarTab.adminBlindatura.test.tsx` nuovo. `npm run validate` **523/523**. M2 test **41** (somma grep `it(` sui 7 file marcati). **Non deployato** edge su TEST. **Non toccati** LOCK.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Aggiornati `ADMIN_TEST_SUITE_INDEX.md`, `FOLLOW_UP.md` FU-047, report batch B. `ADMIN_PRENOTAZIONI_CONTEXT.md` già allineato batch A (tabella criteri §5-ter punto 15). Nessuna migrazione DB.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Per mandato batch B non fatto: deploy edge TEST/PROD, C-U2/C-U3, C-R2/C-R3 fix, E2E calendario, commit/push, QA browser MCP, FU-REV-CAL-4. **Eccezione documentata:** `BookingDetailsModal.tsx` toccato solo nell'addendum perché **Matteo l'ha richiesto esplicitamente** (§2-bis) — deroga al vincolo LOCK del prompt batch B.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: Attrito: batch A e B sovrapposti nel working tree — serve report separato per non confondere C-D5 UI vs edge; miglioria: in FU-047 distinguere sotto-voce «batch A UI» vs «batch B edge/test».

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Giusto — tabella criteri conteggio §5-ter e ADMIN_TEST_SUITE_INDEX hanno guidato dove aggiungere FU-REV-CAL-1/2. Nessun hook stop in questa sessione.

---

*Batch B eseguito 11-06-26 — agente Esecuzione, modalità standard. Addendum No-show: stessa giornata, richiesta esplicita Matteo.*
