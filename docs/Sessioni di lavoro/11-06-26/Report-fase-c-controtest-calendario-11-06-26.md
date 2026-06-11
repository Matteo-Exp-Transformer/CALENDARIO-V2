# Report — Fase C controtest «rompi» tab Calendario admin (M2 Area 2-bis)

> Profilo Verifica · modalità **deep** · mandato **ROMPI** sui 4 fronti · **read-only** · branch `env/test` · 11-06-26.
> Nessuna modifica a `src/` né ai test applicativi.

---

## 1. Cappello

- **Effetto per il ristoratore:** in questa sessione **non è cambiato nulla** nell’app — abbiamo stressato la tab **Calendario** (griglia + lista sotto + modali) cercando comportamenti che lo staff può innescare per sbaglio. Il calendario **regge bene** sulle regole già decise (solo accettate, niente drag, badge %, crea-da-giorno non bloccante). Restano **13 finding** da classificare (nessuno ALTO sul flusso giornaliero Classic).
- **Cosa resta:** classificare i finding sotto (fix / follow-up / voluto) · **QA responsive** badge 375/834/1280 (Matteo o browser) · eventuali fix mirati · aggiornare `MASTERPLAN` colonna Blindato solo dopo cancello §4 completo.
- **Serve azione Matteo:** **sì** — rivedere tabella finding + fare smoke responsive badge (checklist § fronte 4) prima di dichiarare M2 Calendario blindato.

---

## 2. Cosa è stato fatto

1. Caricate skill/mandato: `MANUALE_BLINDATURA.md` §2–§3, `PLAN_BLINDATURA_ADMIN.md` §3-ter, `ADMIN_PRENOTAZIONI_CONTEXT.md` §5-ter + §9, `BOOKING_CALENDAR_LAYOUT_CONTEXT.md`, report revisione Fase A–B e modello report D (07-06).
2. **Fronte dati (C-D):** tracciato ogni azione calendario → stato DB/UI; confrontati `sumGuestsByDate`, digest, eventi FC, edge `DAILY_LIMIT`, salvataggio `daily_guest_limit`, gate Pro tavolo, filtri pending/no-show/legacy.
3. **Fronte utente (C-U):** sequenze click fuori ordine, modali a metà, navigazione mese vs giorno selezionato, cambio tab, moreLink mobile, turni Pro.
4. **Fronte limiti (C-L):** capienza esatta/+1, 0 coperti, assenza limite, soglie colore badge, settimana affollata.
5. **Fronte responsive (C-R):** analisi CSS `.booking-day-fill` + layout digest settimana; **nessun browser MCP** (manca login admin in questa sessione) → checklist QA esplicita per Matteo.
6. **Test mirati:** 29 test `@admin-blindatura: calendario` — **29/29 verdi** (non rieseguito `validate` completo 511).
7. Confermati esplicitamente i **10 comportamenti voluti** §5-ter (tabella §4).

---

## 3. File letti (nessuna modifica codice)

| File | Perché |
|------|--------|
| `BookingCalendar.tsx` | Griglia FC, badge, digest, gate Pro, crea-da-giorno |
| `BookingCalendarTab.tsx` | Wiring `useAcceptedBookings` |
| `bookingEventTransform.ts` | Filtri eventi FC |
| `capacityCalculator.ts` | `sumGuestsByDate` |
| `restaurantSettingRegistry.ts` | Parser/serializer `daily_guest_limit` |
| `RestaurantSettingsTab.tsx` | Input limite giornaliero + save |
| `AdminBookingForm.tsx` | Avvisi capienza da calendario |
| `useCapacityCheck.ts` | Cosa conta per warning admin |
| `BookingDetailsModal.tsx` (LOCK, lettura) | Elimina/no-show/U6 |
| `BookingDangerActionModal.tsx` | Conferme custom |
| `create-booking/index.ts` | `DAILY_LIMIT` pubblico |
| `index.css` | Badge responsive ≤640px |
| `calendario.adminBlindatura.test.tsx` + test registry/sumGuests | Copertura Fase A–B |
| **Questo report** | Output Fase C |

---

## 4. Test eseguiti

| Comando | Esito |
|---------|-------|
| `npm test -- --run calendario.adminBlindatura.test.tsx sumGuestsByDate.adminBlindatura.test.ts restaurantSettingRegistry.dailyGuestLimit.adminBlindatura.test.ts` | **29/29 pass** |

`npm run validate` completo **non** rieseguito in questa sessione (mandato: solo test mirati).

---

## 5. File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| *nessuno* | — | Sessione read-only: nessun diff comportamento da allineare nelle skill. Eventuali decisioni sui finding vanno in `ADMIN_PRENOTAZIONI_CONTEXT.md` / `MASTERPLAN` nella sessione Esecuzione post-classifica. |

---

## 6. Tabella finding (C-D / C-U / C-L / C-R)

| ID | Fronte | Gravità | Riproduzione | File (righe indicative) | Fix suggerito | Proposta classificazione |
|----|--------|---------|--------------|-------------------------|---------------|--------------------------|
| **C-D1** | Dati | **MEDIO** | Tenant con prenotazione `accepted` che ha `confirmed_start` ma **manca** `confirmed_end` (dati legacy). Badge mese mostra i coperti in %; la stessa prenotazione **non** compare in digest né come evento FC. Staff vede % «piena» ma lista sotto vuota per quel nominativo. | `sumGuestsByDate` L126-129; digest L577; `transformBookingsToCalendarEvents` L157-158 | Allineare criteri: o escludere dal badge chi non ha `confirmed_end`, o mostrare in digest con stato «orario incompleto». Preferibile **allineare badge a digest** (richiede anche `confirmed_end`). | **follow-up** |
| **C-D2** | Dati | **MEDIO** | Impostazioni: limite giornaliero 24. Calendario: giorno a 26 coperti (badge >100%). Staff: «Nuova prenotazione il GG/MM» → compila form → invio. **Nessun** `CapacityWarningModal` per sforo **giornaliero** (solo per-fascia se configurata). Coerente con «admin non bloccato» ma **manca avviso** promesso in §5-ter punto 5/7. | `AdminBookingForm.tsx` L262-287; `useCapacityCheck.ts` (nessun `daily_guest_limit`) | Aggiungere check giornaliero in `useCapacityCheck` o in `continueSubmitAfterPastTimeCheck`: se `sumGuests + num_guests > daily_guest_limit` → warning non bloccante (come per-fascia). Test in `@admin-blindatura: prenotazioni` o calendario. | **follow-up** (≈ FU-REV-CAL-3) |
| **C-D3** | Dati | **BASSO** | Giorno con prenotazione marcata **no-show** ancora `accepted`. Creazione admin stesso giorno/fascia: `useCapacityCheck` somma anche i no-show nell’occupazione per-fascia → avviso capienza **più severo** del badge/% e del blocco pubblico (che escludono no-show). | `useCapacityCheck.ts` L72-108 (manca `!booking.no_show`) | Filtrare `no_show` nel loop occupazione, allineato a `sumGuestsByDate` e edge. | **follow-up** |
| **C-D4** | Dati | **BASSO** | Chiamata diretta a `transformBookingsToCalendarEvents` con booking `no_show: true` → evento FC presente. Oggi `BookingCalendar` filtra a monte (`visibleBookings` L502). | `bookingEventTransform.ts` L153-158; `BookingCalendar.tsx` L502-503 | Aggiungere `&& !b.no_show` nel filter utility (difesa in profondità). | **follow-up** |
| **C-D5** | Dati | **BASSO** | Se in DB `daily_guest_limit` fosse salvato come stringa JSON `"24"` (anomalia), edge `create-booking` non applica il blocco (`typeof !== 'number'`). Registry app usa numeri JSONB corretti. | `create-booking/index.ts` L308-310 | Parsare come `parseDailyGuestLimitFromDb` lato edge. | **follow-up** |
| **C-U1** | Utente | **MEDIO** | Seleziona 12/06 con click giorno. Poi freccia FC **mese successivo** (prev/next). Griglia mostra luglio; digest, evidenziazione `calendar-day-selected` e pulsante «Nuova prenotazione il **12/06**» restano su giugno (giorno non visibile). Staff può credere di lavorare sul mese sbagliato. | `BookingCalendar.tsx` — assente `datesSet`; `selectedDate` aggiornato solo da `dateClick` L530-537, `handleGoToToday` L912-925, `initialDate` L487-498 | Su `datesSet` opzionale: aggiornare `selectedDate` al primo giorno del mese visibile **oppure** banner «Stai vedendo luglio — digest: 12 giugno». Minimo: sincronizzare selezione al cambio mese visibile. | **follow-up** |
| **C-U2** | Utente | **MEDIO** | Apri modale dettaglio o «Nuova prenotazione» dal calendario → cambia tab (es. Prenotazioni). Tab calendario **smonta** → modale chiusa senza conferma; eventuale mutation in corso persa (stesso vincolo U3 Area 2). | `AdminDashboard.tsx` (unmount tab); pattern già noto FU-046 U3 | Portale modale a livello shell **oppure** accettare come limite strutturale documentato. | **follow-up** (vincolo strutturale) |
| **C-U3** | Utente | **BASSO** | Pro con turni: digest turno **2** — prenotazioni senza assignment (mostrate solo a turno 1) **non** compaiono. Staff al turno 2 può pensare che manchino prenotazioni. | `filterByTurn` L651-660; fix QA #4 lasciato voluto | Copy «Da assegnare visibili al turno 1» o toggle «mostra tutti i turni». | **follow-up** (Pro) |
| **C-U4** | Utente | **BASSO** | Simula errore rete su `useAcceptedBookings`. Tab mostra riquadro rosso senza «Riprova». | `BookingCalendarTab.tsx` L24-30 | Pulsante retry che invalida query. | **follow-up** |
| **C-L1** | Limiti | **BASSO** | Limite 100, coperti esatti 100 → badge `100%` con classe `booking-day-fill--over` (rosso), stessa soglia del 108%. Semanticamente «pieno» non «oltre». | `BookingCalendar.tsx` L680 (`pct >= 100`) | Usare `over` solo se `pct > 100`; a 100% usare `high` o nuova classe `full`. | **follow-up** |
| **C-R1** | Responsive | **MEDIO** | Viewport **375px**, vista mese, limite attivo, giorno a **108%** o **101%**: badge `white-space: nowrap` + font `0.6875rem` può **sbordare** la cella (FU-CAL-3). CSS non tronca né riduce ulteriormente. | `index.css` L1245-1275; `BookingCalendar.tsx` L673-683 | `max-width: calc(100% - 6px)`, `overflow: hidden`, `text-overflow: ellipsis` su holder; oppure solo numero senza padding su 3 cifre. | **follow-up** + **QA Matteo** |
| **C-R2** | Responsive | **BASSO** | Vista Settimana/Giorno/Lista del calendario FC: **nessun** badge % (solo mese). Segnale «quanto è pieno» sparisce (FU-CAL-2 già tracciato). | `dayCellDidMount` L800-807; `buildDayFillBadgesHtml` | Indicatore compatto in toolbar o digest. | **follow-up** |
| **C-R3** | Responsive | **BASSO** | Digest **Settimana** (toggle sotto calendario): righe compatte **senza** pallino tavolo Pro (FU-CAL-6). | `weekDigest` render L1079-1086 `hasTurns={false}` | Passare `hasTurns={hasTurnsFeature}` in vista settimana o accettare come voluto. | **follow-up** |

**Nessun finding ALTO** emerso dal controtest su mandato calendario.

---

## 7. Decisioni NON bug — confermate con evidenza

| # | Decisione voluta (§5-ter) | Verifica controtest |
|---|---------------------------|---------------------|
| 1 | Solo **accettate** in calendario; pending in tab Prenotazioni | `useAcceptedBookings` `.eq('status','accepted')` (`useBookingQueries.ts` L50); digest/events filtrano `status === 'accepted'`; `sumGuestsByDate` esclude pending — test 7+13 copertura. Pending nel prop `bookings` esclusa da utility (non leak UI normale). |
| 2 | **No drag&drop** data/ora | Nessuna prop `editable`/`eventDrop`/… in config FC (`BookingCalendar.tsx` L713+); test regressione verde. |
| 3 | **Rifiuta** non da calendario su accettate; Elimina solo da modale con conferma custom | Superficie calendario senza Elimina/Rifiuta; flusso digest → `BookingDetailsModal` → `BookingDangerActionModal`; `window.confirm` non chiamato (test). |
| 4 | Limite **giornaliero** blocca solo **Prenota** pubblica; admin può sforare | Edge `DAILY_LIMIT` L306-324; form calendario si apre su giorno pieno (test); nessun blocco in `AdminBookingForm` submit. |
| 5 | Limite **per-fascia** = avviso/semaforo, non blocco | `useCapacityCheck` warning non blocca; `slot_limit_enabled` default false su edge. |
| 6 | Limite `0` / vuoto / `-1` = **nessun limite** | Registry test 9/9; UI Impostazioni placeholder «Nessun limite»; badge ramo solo conteggio. |
| 7 | **No-show** non in badge/% né blocco pubblico | `sumGuestsByDate` L126; edge L301-302; `visibleBookings` L502; modale chiude dopo no-show (`BookingDetailsModal` L595-600). |
| 8 | Click giorno = **seleziona**; form solo da pulsante | `handleDateClick` solo `setSelectedDate` L530-537; test `dateClick` senza form. |
| 9 | Badge mese: con limite → **solo %** (>100% reale); senza limite → **solo conteggio** | `buildDayFillBadgesHtml` L673-683; test 3 badge + CSS `%` symbol. |
| 10 | Scorciatoia tavolo solo se `features.servizio && serviceSlots.length > 0` | `hasTurnsFeature` L407; test Classic off / Pro on. Pro `servizio` + `slots:[]` → come Classic (nessun pallino) — coerente, non bug. |

---

## 8. Lacune test (post-rompi)

| ID | Cosa aggiungere a `@admin-blindatura: calendario` (o area collegata) |
|----|----------------------------------------------------------------------|
| **FU-REV-CAL-1** | `bookings` con `status: 'pending'` → assente da `events` FC **e** digest (componente). |
| **FU-REV-CAL-2** | `servizio: true` + `slots: []` → nessun pallino / turno. |
| **FU-REV-CAL-3** | Avviso sforo **giornaliero** su `AdminBookingForm` con `initialDate` da calendario (integrazione, non mock). |
| **FU-REV-CAL-4** | Nota selettori RTL dettaglio in `ADMIN_PRENOTAZIONI_CONTEXT.md` §8. |
| **FU-REV-CAL-5** | ✅ Questo report (Fase C). |
| **FU-REV-CAL-6** | QA responsive badge 375/834/1280 — checklist sotto. |
| **Post C-D1** | Booking `accepted` con solo `confirmed_start` → assente da digest/events, presente o meno in badge (documentare scelta). |
| **Post C-U1** | Cambio mese FC → comportamento `selectedDate` (test RTL o unit su handler). |
| **Post C-D3** | `useCapacityCheck` esclude no-show (test unit). |
| **Post C-L1** | Badge esattamente 100% → classe tono (non `over`). |

---

## 9. Fronte 4 — QA responsive (checklist Matteo)

> Sessione agente: **analisi CSS/DOM only**. QA manuale badge OK 11-06 su fix QA #1 — **confermare o segnalare regressioni** su build attuale.

| Viewport | Cosa controllare | Esito atteso |
|----------|------------------|--------------|
| **375px** | Vista mese: badge **basso-sx** cella, non sul numero giorno; digest leggibile; apri dettaglio da digest + «Nuova prenotazione» raggiungibili; % 101%+ non tagliata (C-R1) | |
| **834px** | Transizione layout FC + titolo; badge alto-sx; toggle Giorno/Settimana digest | |
| **1280px** | Badge alto-sx, font 0.8125rem leggibile; griglia 3 colonne fasce digest da ≥1390px opzionale | |

Vista settimana compatta digest: nomi lunghi troncati (`truncate` in `DigestBookingListRow`); soglia >40 prenotazioni mostra avviso amber (L1059-1062) — verificare overflow orizzontale.

---

## 10. Cancello blindatura (`MANUALE_BLINDATURA.md` §4)

| Casella | Stato dopo questo report |
|---------|--------------------------|
| Intervistata + mappata | ✅ |
| Test copertura `@admin-blindatura: calendario` verdi | ✅ (29 test, rieseguiti qui) |
| `npm run validate` verde | 🔶 non rieseguito intero (511); solo suite calendario |
| Controtest «rompi» Fase C | ✅ (questo report) |
| Finding decisi (fix/follow-up/voluto) | ⬜ **Matteo/orchestratore** |
| QA responsive 375/834/1280 | ⬜ checklist §9 |
| Doc allineata (context, test index, masterplan) | ⬜ dopo classifica finding |
| Report sessione con decisioni | ✅ |

**M2 Calendario → Blindato ✅:** ancora **no** finché non si chiudono classifica finding, eventuali fix accettati, QA responsive, `validate` pieno, aggiornamento `MASTERPLAN_BLINDATURA.md`.

---

## 11. Dati comunicazione

- **Prompt ricevuti:** 1 prompt sostanziale (mandato Fase C completo con 4 fronti, file da leggere, output attesi, read-only).
- **Formato efficace:** elenco decisioni «NON bug» in testa + checklist per fronte + ID finding prefissati C-D/U/L/R — ha evitato falsi positivi su drag, pending, sforo admin.
- **Automatizzabile:** matrice allineamento filtri (`sumGuestsByDate` vs digest vs transform vs edge); test `pending` a livello componente (FU-REV-CAL-1).

---

## 12. Analisi flusso prompt

| Metrica | Valore |
|---------|--------|
| Prompt sostanziali | 1 |
| Correzioni dopo 1ª risposta | 0 |
| Follow-up generati | 12 finding + lacune test |
| Modalità alzata | no (già deep) |

---

## 13. La TUA lettura della sessione

- **Impressioni:** il mandato ROMPI su calendario è gestibile in una passata perché la logica è concentrata in `BookingCalendar.tsx` + due utility. La revisione Fase A–B ha già eliminato i falsi allarmi grossi; il controtest ha trovato soprattutto **disallineamenti di criterio** (badge vs digest su legacy, avviso giornaliero assente in form) più che crash. Skill §5-ter molto utile per non segnalare drag/sforo admin come bug.
- **Difficoltà:** senza browser admin autenticato il fronte responsive resta checklist; il disallineamento `selectedDate` vs navigazione mese FC richiede uso reale per valutare fastidio staff.
- **Miglioria (dato):** in `PLAN_BLINDATURA_ADMIN.md` §3-ter aggiungere riga «criterio unico confirmed_start/end per badge, digest, eventi» per evitare C-D1 in future migrazioni dati.

---

## 14. Derivazione errori

| Finding | Classificazione | Nota |
|---------|-----------------|------|
| C-D1, C-D2, C-D3 | **bug preesistente** / gap prodotto | Coerenza dati e avvisi non completata in implementazione M2 |
| C-U1 | **bug preesistente** UX | Manca sync mese visibile ↔ giorno selezionato |
| C-U2 | **vincolo strutturale** | Dashboard a tab (già FU-046 U3) |
| C-L1, C-R1 | **bug preesistente** cosmetico | Soglie badge / CSS stretto |
| C-D4, C-D5, C-U3, C-U4, C-R2, C-R3 | **follow-up** basso rischio | Difesa in profondità o Pro/UX |

Nessun errore agente sul classificare i voluti.

---

## 15. Cosa resta per la prossima sessione

1. Matteo classifica ogni finding (tabella §6).
2. Prompt **Esecuzione** mirati per fix accettati (es. C-D2 avviso giornaliero, C-U1 sync mese, C-R1 CSS) — **non** toccare LOCK senza skill Classic.
3. QA responsive §9 + aggiornare `MASTERPLAN` / `ADMIN_TEST_SUITE_INDEX` se si chiude blindatura.
4. Opzionale rapido: implementare test FU-REV-CAL-1/2 prima dei fix.

---

## 16. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: Unico prompt sostanziale: «Profilo: Verifica / Modalità: deep / Skill da leggere: docs/Testing-Skill/MANUALE_BLINDATURA.md §2–§3 … docs/Sessioni di lavoro/07-06-26/Report-fase-d-subagent-flusso-dati-07-06-26.md … / Non caricare: Prenota pagina pubblica (salvo edge DAILY_LIMIT), Menu QR, M3/M4/M5 / Output attesi: 1) Report Fase C in docs/Sessioni di lavoro/11-06-26/Report-fase-c-controtest-calendario-11-06-26.md 2) Finding numerati C-D1… C-U1… C-L1… C-R1… 3) Per ogni finding: riproduzione, file/righe, fix, classificazione 4) Tabella decisioni NON bug 5) Lacune test 6) READ-ONLY … / Mandato: Controtest Fase C «rompi» sulla tab Calendario admin … Branch: env/test … / Dopo questo report: classificazione finding → eventuale Esecuzione → MASTERPLAN Blindato.» (testo integrale nel messaggio utente di apertura sessione).

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Branch `env/test` confermato (`git branch`). Working tree: modifiche doc (`ADMIN_TEST_SUITE_INDEX.md`, `MASTERPLAN_BLINDATURA.md`), report e test calendario **untracked** — **zero** modifiche `src/` in questa sessione. Riaperti e citati con righe: `BookingCalendar.tsx` (502-503, 530-537, 651-683, 700-711), `bookingEventTransform.ts` (153-158), `capacityCalculator.ts` (123-131), `create-booking/index.ts` (296-324), `index.css` (1245-1275), `AdminBookingForm.tsx` (262-287), `useCapacityCheck.ts` (72-108), `BookingDetailsModal.tsx` (249-259, 595-600), `RestaurantSettingsTab.tsx` (789, 1152-1168). Test: **29/29** pass sui 3 file calendario (output comando in §4). Finding count: 5 C-D, 4 C-U, 1 C-L, 3 C-R = **13** totali in tabella §6 (C-D1…C-R3); nessun ALTO.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: **Non aggiornati in questa sessione (read-only):** `ADMIN_PRENOTAZIONI_CONTEXT.md`, `MASTERPLAN_BLINDATURA.md`, `ADMIN_TEST_SUITE_INDEX.md`, `BOOKING_CALENDAR_LAYOUT_CONTEXT.md` — restano allo stato pre-Fase C; il masterplan già segnala «restano controtest Fase C + QA responsive». **Correlati letti per verità:** `PLAN_BLINDATURA_ADMIN.md` §3-ter, report revisione 11-06-26. **Output nuovo:** solo questo report. Allineamento skill post-classifica finding = lavoro sessione Esecuzione successiva.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?
✅ R4: **Non fatto per mandato:** modifiche `src/` e test; implementazione fix; commit/push; `npm run validate` completo 511; E2E Playwright calendario; espansione tab Prenotazioni (FU-043). **Non fatto per ambiente:** QA browser MCP su 375/834/1280 (serve login admin — sostituito da checklist §9). **Non fatto opzionale:** esecuzione sub-agent `CONTROVERIFICA.md` (scatta su «report finale», non su controtest). Certo perché il prompt vietava tocchi codice e delimitava output al report.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti?
✅ R5: **Attrito:** incrociare tre fonti criterio conteggio (badge, digest, edge) richiede saltare tra 4 file — facile perdersi un filtro (`confirmed_end`). **Miglioria:** in `ADMIN_PRENOTAZIONI_CONTEXT.md` §5-ter aggiungere mini-tabella «cosa conta per badge / digest / pubblico» con una riga per campo (`confirmed_end`, `no_show`).

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco?
✅ R6: **Giusto** — mandato con skill mirate, divieto Prenota/Menu QR/M3–M5, elenco file minimo e decisioni NON bug hanno tenuto il focus sui 4 fronti senza espandere su Area 2 intera. Report revisione Fase A–B utile per non riduplicare FU-REV-CAL già tracciati. Nessun hook `stop` in questa chat prima della scrittura report.

---

## 17. Self-review

1. **Dati = diff:** file e righe riletti nel codice attuale — OK.
2. **File correlati:** nessuna skill aggiornata (read-only) — dichiarato in §5 e Q3.
3. **Q1–Q6:** risposte con sostanza, coerenti con 13 finding tabellati.
4. **Tono:** cappello per ristoratore/staff; tecnico in tabella finding.

---

*Controtest Fase C eseguito 11-06-26 — agente Verifica, modalità deep, read-only.*
