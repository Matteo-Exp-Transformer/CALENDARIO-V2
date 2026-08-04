# Piano per il prossimo senior — test, e2e e salute del codice

> Scritto il **03-08-2026 sera**. Branch `env/test`. Il tuo ruolo è **supervisione**: prepari i prompt
> leggendo il codice vero, lanci agenti Sonnet, e **rileggi tu ogni diff** prima di passare avanti.
> Matteo controverifica a campione, non testa attivamente.
>
> **Materiale di partenza obbligatorio, in quest'ordine:**
> 1. [Report-audit-allineamento-e-checklist-test-03-08-26.md](Report-audit-allineamento-e-checklist-test-03-08-26.md) — è la base di questo piano: §3 bug, §4 divergenze skill, §5 checklist di Matteo, §6 checklist agenti.
> 2. [HANDOFF_S4_SENIOR.md](../02-08-26/HANDOFF_S4_SENIOR.md) — quadro generale della pagina Servizio (§4-bis) e decisioni chiuse (§3).
> 3. `docs/Testing-Skill/TESTING_SKILL.md` + `TESTING_PATTERNS.md` prima di scrivere qualsiasi test.

---

> ## ⛳ AGGIORNAMENTO 04-08-2026 — **LA FASE 0 È FATTA. PARTI DALLA FASE 1 (§3).**
>
> I quattro fix decisi (§2: eliminazione tavolo occupato, spostamento che non consuma turno,
> validazioni fasce unificate, avviso fine turno persistito) sono **implementati, testati, revisionati
> e pushati** — commit `94dad6f` (fix) · `f174053` (test) · `5fe8a4c` (docs), tutti su
> `origin/env/test`. Migrazione **070** applicata su TEST. **Non rifarli.**
>
> Report: [Report-fase0-quattro-fix-03-08-26.md](Report-fase0-quattro-fix-03-08-26.md) — leggi
> **§4 (cosa NON è verificato)** e **§11 R2/R3** prima di fidarti di qualsiasi cosa qui sotto.
> Prompt usato, riutilizzabile come modello: [PROMPT_FASE0_QUATTRO_FIX.md](PROMPT_FASE0_QUATTRO_FIX.md).
>
> **Cosa è cambiato nei presupposti di questo piano:**
> - **§0.1-§0.4 sono storico**, non lavoro da fare. Restano utili per capire *perché* il codice è
>   com'è (in particolare la riscrittura di D48).
> - **§0.3 è superata in un punto:** `validateSlotConfigs` **non è più codice morto**, la usano
>   entrambi gli editor. Servizio la chiama con `options.focusIndex`, aggiunto in revisione perché
>   senza quello una fascia legacy invalida a DB bloccava il salvataggio di **qualsiasi altra** fascia.
> - **§7 domanda 1 è chiusa:** intervallo di richiamo **30 minuti, confermato da Matteo**. Le altre
>   tre restano aperte.
> - **La Fase 1 ha una voce in più (la 7 in §3)**, trovata stanotte: un test che passa di giorno e
>   fallisce a tarda notte.
> - ⚠️ **Matteo non ha ancora collaudato a video** i quattro fix. Se ti dice che uno non funziona,
>   quella informazione batte qualunque test verde citato nel report.

> ## ⛳ AGGIORNAMENTO 04-08-2026 sera — **LA FASE 1 È FATTA AL 97%. RESTANO 3 ROSSI.**
>
> Report: [Report-fase1-base-test-04-08-26.md](../04-08-26/Report-fase1-base-test-04-08-26.md).
> Prompt per chi continua: [PROMPT_PROSSIMO_SENIOR.md](../04-08-26/PROMPT_PROSSIMO_SENIOR.md)
> — **supera** `PROMPT_PROSSIMO_SENIOR_FASE1.md` di questa cartella, che mandava a fare la Fase 1.
>
> **Numeri veri, misurati un test alla volta:** da **51 verdi / 31 rossi / 20 saltati** su 102 a
> **87 verdi / 3 rossi / 9 saltati** su 99 (i 9 saltati sono tutti a cascata dai 3 rossi). Unit da
> 1332 a **1344 test su 162 file**, verdi. Niente commit, niente push.
>
> **Cosa è cambiato nei presupposti di questa §3:**
> - **Le voci 1-5 e 7 sono chiuse.** La 6 era già chiusa ieri.
> - **La voce 1 era più grave di com'era scritta:** non «sostituisci un'impostazione morta», ma
>   l'intera spec scritta contro una versione precedente del riepilogo di giornata (cercava una
>   sezione che in `src/` **non esiste**). Riscritta.
> - **La voce 2 aveva una causa diversa da quella supposta:** gli skip «dati mancanti» non erano
>   staging vuoto, erano locator verso marcature (`tr[role="row"]`, `[data-testid="booking-row"]`)
>   che in `src/` **non esistono**.
> - **La trappola d'ambiente delle chiavi `E2E_CLASSIC_*` duplicate era vera**, e ce n'era una
>   seconda accanto: `E2E_CLASSIC_TENANT_ID` puntava a un tenant **inesistente** su TEST, quindi il
>   test di upgrade aggiornava 0 righe ricevendo 200. Entrambe corrette in `.env.local.test`
>   (file locale, **non tracciato**: su un'altra macchina va rifatto).
> - **Nove rossi che questo piano non citava affatto** sono emersi eseguendo: form pubblico (4),
>   menu/magazzino (3), CRM (1), edition-upgrade (1). Il più grave: «submit con dati validi crea la
>   prenotazione» era **verde senza creare nessuna prenotazione**.
> - **Un terzo dei rossi era contesa fra test paralleli**, non difetti: 12 worker → 31 rossi,
>   `--workers=1` → 12. La scelta su quanti worker tenere **non è stata fatta**: `playwright.config.ts`
>   è invariato.
> - **§4 (Fase 2) resta valida** ed è il prossimo mandato, dopo i 3 rossi.
> - **§7 ha una domanda in più** (la sotto-tipologia singola «a scheda» il cui menù non si applica
>   mai) e le altre tre restano aperte.

> ## ⛳ AGGIORNAMENTO 04-08-2026 18:38 — **I 3 ROSSI SONO CHIUSI CON TEST MIRATI. PARTI DALLA FASE 2.**
>
> La ripresa Codex ha chiuso i tre rossi rimasti della Fase 1:
> `public-booking-fix9-compilable.spec.ts` 7/7, smoke card/carosello 1/1, modali responsive Admin
> mobile 2/2 e tablet 2/2. Unit mirata `BookingRequestForm.flussoUtente.test.tsx` 7/7.
>
> **Non è stata rilanciata tutta la batteria e2e da 99 test** dopo queste correzioni. Se vuoi
> consolidare numericamente la Fase 1, falla con `--workers=1`.
>
> Decisioni chiuse: la singola sotto-tipologia «a card» deve auto-selezionarsi e applicare il preset
> senza mostrare la striscia; «Ancora occupato» timbra solo l'`assignmentId` esatto. Restano aperti
> parallelismo Playwright, prova a cavallo della mezzanotte e Fase 2 (§4) dalle righe 2-4: la riga 1
> «Eliminazione tavolo occupato» è ora coperta a browser (`pro-service-tables-lifecycle` 8/8).
>
> Prompt corrente per proseguire: [PROMPT_PROSSIMO_SENIOR.md](../04-08-26/PROMPT_PROSSIMO_SENIOR.md)
> aggiornato allo stato reale del codice e del worktree. Matteo ha poi chiesto commit locale:
> lo split usato è indicato nel report Fase 1 §7. Nessun push.

> ## ⛳ AGGIORNAMENTO 04-08-2026 — **FASE 1 CONSOLIDATA, FASE 2 RIGHE 1-2 COPERTE.**
>
> Run completa e2e in seriale: `npm run test:e2e -- --workers=1` → **100/100 verde**.
> La Fase 2 ha ora anche la riga 2 coperta a browser: da Servizio Mario chiude una fascia,
> poi sul form pubblico Anna non vede più quella fascia nel picker orari. Verifiche:
> scenario mirato 1/1 verde, `pro-service-tables-lifecycle` completo **9/9 verde**,
> typecheck e2e ad hoc verde.
>
> La Fase 2 ha ora anche la riga 4 coperta a browser in `pro-service.spec.ts`: dalla modale vera
> di Servizio l'editor fasce blocca nome duplicato (trim/case-insensitive), inizio=fine e
> sovrapposizione. Verifiche: scenario mirato 1/1 verde, `pro-service` completo **3/3 verde**,
> typecheck e2e ad hoc verde.
>
> La Fase 2 continua dalla riga **3**. Restano aperti parallelismo Playwright e prova a cavallo
> della mezzanotte.

> ## ⛳ AGGIORNAMENTO 04-08-2026 20:08 — **FASE 2 RIGHE 3 E 5 COPERTE.**
>
> La riga 3 era già coperta nel codice corrente da
> `src/features/booking/hooks/__tests__/useTableAssignments.fix2.test.ts`: test mirato "FIX A —
> spostamento da Calendario..." verde dentro il file completo **12/12**.
>
> La riga 5 è ora coperta a browser in `e2e/pro/pro-service-tables-lifecycle.spec.ts`: dalla Home
> Mario apre "Aggiungi walk-in", sceglie un tavolo occupato, il primo click mostra l'avviso, il cambio
> sala azzera tavolo/conferma, il secondo giro forza la sostituzione e crea il walk-in assegnato. La
> vecchia assegnazione risulta liberata a DB. Verifiche: scenario mirato 1/1 verde, file completo
> `pro-service-tables-lifecycle` **10/10 verde**, typecheck e2e ad hoc verde.
>
> La Fase 2 ha ora coperte le righe **1, 2, 3, 4 e 5**. Prossima priorità: riga **6**
> ("Turni esauriti + Assegna comunque" a browser). Restano aperti parallelismo Playwright e prova a
> cavallo della mezzanotte.

> ## ⛳ AGGIORNAMENTO 04-08-2026 — **FASE 2 RIGA 6 COPERTA.**
>
> La riga 6 è ora coperta a browser in `e2e/pro/pro-service-tables-lifecycle.spec.ts`: Mario apre
> Servizio → Mappa, trova un tavolo libero ma con tutti i turni già consumati, vede il badge
> "Turni esauriti", clicca consapevolmente "Assegna comunque" e il DB registra la nuova assegnazione
> forzata (`forced_by_admin=true`, motivo, `turn_number=3`). Verifiche: scenario mirato **1/1 verde**,
> file completo `pro-service-tables-lifecycle` **11/11 verde**, typecheck e2e ad hoc verde.
>
> La Fase 2 ha ora coperte le righe **1, 2, 3, 4, 5 e 6**. Prossima priorità: riga **7**
> (avviso fine turno: casi "Libero", "Decido dopo", cambio fascia azzera). Restano aperti
> parallelismo Playwright e prova a cavallo della mezzanotte.

> ## ⛳ AGGIORNAMENTO 04-08-2026 — **FASE 2 RIGA 7 COPERTA.**
>
> La riga 7 è ora coperta a browser in `e2e/pro/pro-service-tables-lifecycle.spec.ts`: l'avviso
> fine turno copre "Libero" (checkout append-only), "Decido dopo" (chiude l'avviso locale), secondo
> tavolo che fa riaprire la finestra e cambio fascia che azzera "Decido dopo" quando Mario torna alla
> fascia originale. Verifiche: scenario cambio-fascia mirato **1/1 verde**, file completo
> `pro-service-tables-lifecycle` **12/12 verde**, typecheck e2e ad hoc verde.
>
> La Fase 2 ha ora coperte le righe **1, 2, 3, 4, 5, 6 e 7**. Prossima priorità: riga **8**
> (tavolata a 3+ tavoli, "Mancano N posti", annulla dopo assegnazione multipla). Restano aperti
> parallelismo Playwright e prova a cavallo della mezzanotte.

## 0. Regole non negoziabili

- **Mai commit o push senza richiesta esplicita di Matteo.** Stato dopo chiusura Codex: i commit
  locali sono stati preparati su richiesta di Matteo, ma **non pushati**. Non pushare finché Matteo
  non dice.
- **Mai scritture su PROD.** Prima di ogni operazione MCP: `get_project_url` → `docnnernvp` = TEST ok,
  `rwuxgvld` = PROD, fermati e chiedi. Su TEST le migrazioni si applicano con `npm run db:apply`.
  `supabase db push --include-all` **vietato per sempre**.
- **Il repo non ha prettier.** Mai `npx prettier --write`: riscrive tutto in doppi apici con punto e
  virgola. Lo stile è single-quote / no-semi, garantito da ESLint.
- **Non fidarti dei report degli agenti.** Dato reale di questa sessione: su 5 voci gravi
  controverificate, **1 confermata con precisazione, 1 corretta in entrambe le direzioni, 1 smentita**,
  e 2 problemi non li aveva visti nessun agente. Rileggi i diff riga per riga e ri-esegui i comandi
  di persona.
- **Con Matteo:** parla per schermate e flussi concreti («apri Servizio, clicchi il tavolo,
  compare…»), non per nomi di file isolati. Breve di default. Grilletti in
  `docs/Comunicazione-Skill/VOCABOLARIO.md`.

---

## 1. Decisioni di Matteo del 03-08-2026 — chiuse, non riaprirle

| # | Questione | Decisione |
|---|---|---|
| **D-A** | Eliminazione di un tavolo **occupato** | Deve comportarsi **come l'eliminazione di una sala**: avvisare prima, non eliminare in silenzio |
| **D-B** | Spostare un cliente di tavolo consuma un turno? | **No, mai** — nemmeno dal percorso «Modifica tavolo» del Calendario. Va sistemato |
| **D-C** | Validazioni dell'editor fasce | **Logica convalidata.** Non c'è conflitto di prodotto: vanno solo allineati i controlli mancanti (vedi Fase 0.3) |
| **D-D** | Avviso «Tavolo a fine turno» dopo «Ancora occupato» (`FU-SERV-RELEASE-NOTICE-1`) | **Ricorda per tutti i dispositivi + richiama dopo un po'.** Vedi Fase 0.4 |

---

## 2. FASE 0 — ✅ **FATTA il 03/04-08-26** *(storico: sotto è il mandato com'era scritto)*

Vanno per primi: sono bug di prodotto, e i test della Fase 2 devono nascere già sopra il
comportamento corretto, non sopra quello rotto.

### 0.1 — Eliminazione tavolo occupato (D-A) · 🔴 bloccante

**Il problema:** `useDeleteTable` (`src/features/booking/hooks/useServizioTables.ts:148-175`) fa un
soft-delete secco (`active:false`) senza controllare le assegnazioni attive né liberarle; il chiamante
`src/pages/ServizioPage.tsx:158` non mette guardia. Risultato: la prenotazione resta con
`checked_out_at = null` su un tavolo inattivo, compare senza tavoli e **senza il pulsante «Togli
tavolo»** — bloccata, nessuna via d'uscita da interfaccia.

**Il modello da copiare, non da inventare:** `useRooms.ts` fa già la cosa giusta per le sale —
`useRoomLiveBookings` (righe ~89-103) conta i booking con assignment attivo, e `useDeleteRoom`
(righe ~205-238) timbra `checked_out_at` sugli assignment attivi **prima** di disattivare. Replica
quel pattern per il tavolo.

**Criteri di accettazione:**
- Eliminare un tavolo **libero**: invariato, nessun avviso in più.
- Eliminare un tavolo **occupato**: avviso che dice quante prenotazioni sono coinvolte, con conferma
  esplicita; solo dopo conferma il tavolo viene disattivato e le assegnazioni liberate.
- **Attenzione al conteggio turni:** questa liberazione **non deve bruciare un turno** (coerente con
  D-B — il cliente non ha finito il pasto, gli stai togliendo il tavolo da sotto).
- Su una **tavolata** su più tavoli: eliminare un tavolo non deve rompere gli altri.

### 0.2 — Lo spostamento non consuma un turno (D-B) · 🟠 alta

**Il problema:** `useReleaseBookingAssignment` (`src/features/booking/hooks/useTableAssignments.ts:762-765`)
timbra **sempre** `checked_out_at`, e `countTurnsUsed` (`src/features/booking/utils/tableTurnLimits.ts:44-49`)
conta tutte le righe, timbrate incluse → il percorso «Modifica tavolo» dal Calendario consuma un turno
del tavolo di partenza. La sostituzione guidata (S4-FIX-5) invece cancella la riga e non consuma.

**Attenzione, non è codice sciatto:** il commento a `useTableAssignments.ts:754` cita **D48
«append-only»**, una regola scritta a giugno che vieta il DELETE fisico. La decisione D-B è di agosto e
la contraddice. **Prima di scrivere codice**, decidi e scrivi nel report quale delle due vince e
perché, poi allinea `MASTERPLAN_SERVIZIO.md` (D48) di conseguenza — altrimenti il prossimo agente
riapre la stessa collisione.

**Criteri di accettazione:**
- Sposto un cliente dal Tavolo 1 al Tavolo 2 **da Calendario** → i turni residui del Tavolo 1 **non**
  calano.
- Stesso spostamento **da Servizio** (sostituzione guidata, scelta «spostalo») → identico. I due
  percorsi devono dare lo stesso risultato.
- **Archiviare** («ha finito» / checkout) → il turno **sì**, lo consuma. Questo non cambia.
- Il ramo `hasWaitingNextTurnOnTable` (blocco se c'è un turno successivo in attesa) resta com'è.

### 0.3 — Allineare le validazioni delle fasce (D-C) · 🟠 alta

Oggi la stessa validazione esiste in **tre versioni divergenti**:

| Dove | Formato HH:mm | Inizio == fine | Nome duplicato | Sovrapposizione |
|---|---|---|---|---|
| `src/features/booking/utils/bookingTimeSlots.ts:25` `validateSlotConfigs` | ✅ | ✅ | ✅ | ✅ |
| `src/features/booking/components/RestaurantSettingsTab.tsx:95-112` (Impostazioni) | ✅ | ✅ | ❌ | ✅ |
| `src/features/booking/components/servizio/ServiceSlotsManager.tsx:561-570` (Servizio) | ❌ | ❌ | ❌ | ✅ |

`validateSlotConfigs` è la versione completa ed è **codice morto: nessuno la chiama.** (Il piano di
FIX-6 affermava che Impostazioni la usasse — falso, e l'errore è stato ripetuto anche nella memoria di
progetto: non ricascarci.)

**Da fare:** far convergere entrambi gli editor su `validateSlotConfigs`, così esiste **una sola**
fonte di verità. Includendo il blocco dei **nomi duplicati in tutti e due** — decisione di Matteo:
due fasce «Cena» sono ambigue nel briefing, nel digest di Home e negli orari che vede il cliente.
Solo controllo lato app, **nessuna migrazione**.

### 0.4 — L'avviso di fine turno sopravvive al reload (D-D) · 🟠 alta

**Il problema:** `handledReleaseTableIds` in
`src/features/booking/components/servizio/AssignmentMapPanel.tsx:311` è un `useState` locale, mai
persistito: si azzera a ogni remount, quindi dopo un ricaricamento (F5, tablet che si risveglia, altro
dispositivo) l'avviso «Tavolo a fine turno» **ritorna** anche se lo staff aveva già premuto «Ancora
occupato». Il consumo è a `:497` (`handledReleaseTableIds.includes(tableId)`).

**Decisione di Matteo (D-D):** la conferma va **condivisa fra tutti i dispositivi** e deve
**resistere ai ricaricamenti**, ma l'avviso deve **ritornare una volta** se il tavolo è ancora
occupato dopo un intervallo di cortesia.

**Come farlo:**
- Persistere la conferma **sul record di assegnazione** (`booking_table_assignments`), non nel browser:
  serve una migrazione con una colonna tipo `release_notice_handled_at timestamptz` — così vale per
  tutti i dispositivi per costruzione.
- La finestra si riapre se **adesso > `release_notice_handled_at` + intervallo di richiamo**.
- **Intervallo di richiamo: 30 minuti** — proposto da me, Matteo non ha indicato un valore diverso.
  Mettilo dove sono già la soglia di ritardo e il buffer di riassetto, **non** come costante sepolta nel
  componente: finirà fra le manopole da regolare (vedi §7).
- Richiamo **una volta sola** per turno, non a ripetizione: se lo staff riconferma, si riparte da capo.
- ⚠️ La migrazione entra nel treno del rollout PROD (`063`→`069` + questa). **Solo TEST** per ora,
  con `npm run db:apply`.

**Criteri di accettazione:**
- Premo «Ancora occupato», ricarico la pagina → l'avviso **non** torna. *(È il test e2e oggi rosso:
  `pro-service-tables-lifecycle.spec.ts:177`, asserzione a `:240` — dopo questo fix deve diventare
  verde e va tolto il `test.fail()` della Fase 1.)*
- Apro Servizio su un **secondo dispositivo/browser** → l'avviso non torna per quel tavolo.
- Passati **30 minuti** col tavolo ancora occupato → l'avviso torna **una volta**.
- Cambio fascia o giorno → gli avvisi si comportano come prima (voce di checklist 2.2-6, mai
  verificata: coprila con un test).
- **Cerca i fratelli:** «Decido dopo» ha lo stesso difetto di persistenza. Verifica se va trattato allo
  stesso modo o se per quello il ritorno dell'avviso è il comportamento voluto — e **scrivilo**, in un
  senso o nell'altro.

### Gate di uscita dalla Fase 0
`npm run validate` verde · i quattro comportamenti provati a mano da te o coperti da test nuovi ·
il test e2e prima rosso ora verde · report per Matteo che spiega i fix **per schermate**, non per file.

---

## 3. FASE 1 — Riparare la base di test esistente

**Prima di aggiungere copertura.** Aggiungere test sopra una base che mente non serve a niente: oggi
diversi test **passano senza verificare nulla**.

| # | File | Problema | Cosa fare |
|---|---|---|---|
| 1 | `e2e/admin-calendar-blindatura.spec.ts:166,175,194,264` | Scrive e asserisce su **`daily_guest_limit`**, un setting che **nessun file applicativo legge più** (verificato: zero occorrenze in `src/` fuori dai test). La causalità che il test presuppone non esiste | **Farlo girare per primo**: è già rosso, o verde per coincidenza? Poi riscriverlo su `slot_limit_enabled` + `slot_guest_capacities` |
| 2 | `e2e/admin-classic-tabs.spec.ts:102,118` · `edition-classic.spec.ts:32` · `admin-shell-blindatura.spec.ts` · `edition-upgrade.spec.ts` | **Self-skip silenziosi**: se lo staging non ha i dati attesi o il login fallisce, il test *salta* e appare verde | Trasformare gli skip da dati mancanti in **fallimenti**, oppure seminare i dati con gli helper di `e2e/helpers/supabaseStaging.ts` |
| 3 | `e2e/public-booking.spec.ts:8` | Slug di default `'test'`, che `TESTING_SKILL.md` §8.3 dice di non usare più | Passare a `getExistingTenantSlug` come fa `public-booking-smoke.spec.ts` |
| 4 | `e2e/menu-crud.spec.ts:29` | Intera suite in `test.skip(true, 'suite legacy…')`, non gira mai | Cancellarla: è sostituita dalle due spec magazzino |
| 5 | `e2e/invite-flow.spec.ts:14,34,44` | 3 test su 4 dipendono da `E2E_VALID_INVITE_TOKEN`, un token che per natura si consuma | Generarlo nel `beforeAll` invece di leggerlo dall'ambiente |
| 6 | ~~`e2e/pro/pro-service-tables-lifecycle.spec.ts:177`~~ | ~~Rosso di proposito ma non marcato~~ | ✅ **Chiuso**: il bug è stato corretto (FIX D), il test è verde, nessun `test.fail()` serviva |
| **7** | `e2e/pro/pro-service-tables-lifecycle.spec.ts:133` (`wallIsoAt`) + `:550-554` | 🆕 **Trovato il 03-08 notte, verificato riga per riga.** `wallIsoAt(canonicalDate, instant)` incolla **solo l'ora** di `instant` sulla data canonica fissa. Il test «Stati del tavolo in sequenza» calcola `end = NOW + 26'`: eseguito verso le 23:50 la fine scavalca la mezzanotte e finisce **prima** dell'inizio sulla stessa data → il tavolo risulta già «in uscita» e il test è rosso. **Passa di giorno, fallisce di notte.** Non è un bug di produzione | Far calcolare a `wallIsoAt` anche il **giorno** dell'istante (o far scegliere allo scenario una base oraria che non scavalchi). Poi rilanciare la spec **a due ore del giorno diverse** e dimostrare che è stabile in entrambe |

**Trappola d'ambiente:** in `.env.local.test` le chiavi `E2E_CLASSIC_*` sono **duplicate** e l'ultima
vince → puntano a `test-pro`, non a `test-classic`. Controllalo prima di dare la colpa a un test.

### Gate di uscita dalla Fase 1
Una run e2e completa in cui **ogni skip è intenzionale e dichiarato**, e il conteggio verde/rosso è
credibile. Scrivi il numero reale nel report: è la linea di partenza per la Fase 2.

---

## 4. FASE 2 — Test nuovi, per ondate

Ordine per rischio. **Raggruppa per proprietà dei file**, non per argomento: due agenti in parallelo
sullo stesso file si sovrascrivono.

| # | Flusso da coprire | Da dove partire | Perché conta |
|---|---|---|---|
| 1 | ✅ **Eliminazione tavolo occupato** (dopo il fix 0.1) | `pro-service-tables-lifecycle.spec.ts` | Coperta a browser nella ripresa Codex: avviso, conferma, tavolo inattivo, assignment cancellato, booking non servita |
| 2 | ✅ **Chiusura fascia → lo slot sparisce dal form pubblico**, da browser | `pro-service-tables-lifecycle.spec.ts` | Coperta a browser nel proseguimento Codex: fascia temporanea visibile nel picker pubblico, chiusa da Servizio, sparita al reload pubblico |
| 3 | ✅ **«Modifica tavolo» non consuma turno** (dopo il fix 0.2) | `useTableAssignments.fix2.test.ts` | Coperta da unit test mirato: Calendario e Servizio lasciano lo stesso numero di turni residui sul tavolo di partenza |
| 4 | ✅ **Editor fasce: nome duplicato, inizio == fine, sovrapposizione** (dopo 0.3) | `pro-service.spec.ts` + unit `serviceSlots.sovrapposizione.test.tsx` | Coperta a browser nel proseguimento Codex: tre salvataggi invalidi dalla modale Servizio, nessuna creazione DB |
| 5 | ✅ **Walk-in end-to-end a browser** (doppio click su tavolo occupato, azzeramento al cambio sala) | `pro-service-tables-lifecycle.spec.ts` + unit `useWalkInMutation.rpc.test.tsx` | Coperta a browser: avviso su tavolo occupato, reset al cambio sala, conferma forzata e verifica DB |
| 6 | ✅ **Turni esauriti + «Assegna comunque»** a browser | `pro-service-tables-lifecycle.spec.ts` + component `AssignmentMapPanel.fix2.test.tsx` | Coperta a browser: tavolo libero ma senza turni residui, riquadro ambra, assegnazione forzata verificata a DB |
| 7 | ✅ **Avviso fine turno**: casi «Libero», «Decido dopo», cambio fascia azzera | `pro-service-tables-lifecycle.spec.ts` — pattern `page.clock` già stabilito | Coperta a browser: checkout append-only, dismiss locale, riapertura con nuovo tavolo in uscita e reset al cambio fascia |
| 8 | **Tavolata a 3+ tavoli**, «Mancano N posti», **Annulla dopo assegnazione multipla** | stesso file (oggi copre solo 2 tavoli) | Voci di checklist mai diventate test |
| 9 | **Badge % Calendario**, unit isolato sui rami D38/tavoli/Classic | nessuna | Logica ramificata, zero test isolati |
| 10 | **Impostazioni: Salva → reload → il dato persiste** | `admin-settings-blindatura.spec.ts` | Il giro completo non è mai stato verificato |
| 11 | **Modali Servizio a 375/834/1280**: sala, tavolo, walk-in, briefing, assegna multi-tavolo | solo la finestra fine turno è coperta | 6 voci su 7 mai automatizzate |
| 12 | **Form Classic: invio completo + oltre-limite** | cliccare per **ruolo/label** invece che sull'icona (metodo iniziato in `RIPROVA_D`) | Debito di collaudo aperto da sempre |
| 13 | **CRM: crea campagna → destinatari → invia** (fino al limite prima di Brevo) | `pro-crm.spec.ts` è smoke puro | Zero copertura su una feature **attiva in PROD** |

### Due trappole da mettere in ogni prompt che scrivi

1. **Isolamento dei dati.** Ogni test deve seminarsi una **risorsa usa-e-getta propria** (fascia, sala,
   tavolo). Il repo gira `fullyParallel: true`: test che condividono la stessa fascia o la stessa data
   si vedono a vicenda e falliscono a intermittenza. È già successo, ed è stato scoperto solo
   rieseguendo i test con `--workers=1`. **Chiedilo esplicitamente nel prompt, e verificalo tu.**
2. **Tempo simulato.** `page.clock` funziona per pilotare gli stati del tavolo, ma **rompe il refresh
   del JWT Supabase**: vai in `ADMIN_SERVIZIO_CONTEXT.md` §9.13 e nel commento di testata di
   `pro-service-tables-lifecycle.spec.ts` per il pattern che funziona. Se ti avanza tempo, sposta
   quella nota in `TESTING_SKILL.md`: serve a chiunque scriva e2e, non solo a chi lavora su Servizio.

### Non riscrivere ciò che è già coperto
Ciclo di vita tavoli (6 test verdi), prenotazione pubblica (9 smoke + 5 form + 4 su
`compilable_category_keys`), Menu QR (3), login/auth (5 admin + 3 Pro + RLS Classic), menu/magazzino
(toggle + controtest), calendario (viste responsive, accept con capienza/orario superati). Più
**1283 test unit/integration verdi su 156 file**: la copertura unit è già densa su capienza, digest,
template email, walk-in RPC, nome tavolo unico, sale, turni.

---

## 5. FASE 3 — Analisi strutturale e stato di salute

Da rifare **dopo** le fasi 0-2, per misurare se il lavoro ha migliorato o peggiorato la coerenza.

**Metodo che ha funzionato (riusalo):** 4-5 agenti Sonnet su **fronti disgiunti**, ciascuno in sola
lettura, ciascuno obbligato a citare `file:riga` e a scrivere `NON VERIFICATO` invece di dedurre. Poi
**controverifica tu** ogni voce grave prima di riportarla. In questa sessione quel passaggio ha
corretto o smentito 3 voci su 5.

**Fronti da coprire:**
1. **Divergenze skill/codice** — ripartire dalla §4 del report di audit e verificare che siano state
   sanate. Le più gravi ancora aperte: `docs/DATABASE.md` **non cita affatto** le migrazioni `049`,
   `052`, `053`, `056`, **`068`, `069`** (le ultime due servono al rollout PROD);
   `ADMIN_SHELL_PAGES_CONTEXT.md:189-198` dice che le sale non hanno tabella (esiste dalla mig. 008,
   `from('rooms')` in `useRooms.ts`); `:341-342` dice che il walk-in non è transazionale (lo è dalla
   069); `LEGAL_STATE_CONTEXT.md:105` dice che `send-email` non esiste (è **attiva in PROD**);
   `DB_SCHEMA_CONTEXT.md:265` elenca `daily_guest_limit` (rimosso il 18-06).
2. **Duplicazioni logiche** — cercare altri casi come le tre validazioni fasce: stessa regola
   implementata più volte, versioni che divergono, funzioni esportate e mai chiamate.
3. **Scritture non atomiche** — quante sequenze di 2+ mutazioni Supabase senza RPC restano, e cosa
   succede se si rompono a metà. Note aperte: sostituzione guidata
   (`useForceReplaceBookingOnTable`, 2-3 scritture), checkout, eliminazione sala.
4. **Stati React che dovrebbero sopravvivere a un reload** — la famiglia di
   `FU-SERV-RELEASE-NOTICE-1`: conferme, avvisi già gestiti, forzature. Ce n'è almeno un altro
   («Decido dopo»).
5. **Coerenza fra masterplan e codice** — in particolare `max_turns`, che oggi fa **due mestieri**
   (contatore turni per tavolo **e** interruttore «servizio chiuso», `tableTurnLimits.ts:44-66`)
   mentre `MASTERPLAN_SERVIZIO.md:140-145` (D41) prescrive l'opposto e non è mai stato revisionato.
   Va risolto in un senso o nell'altro, non lasciato ambiguo.
6. **Salute misurabile** — `npm run validate` (lint + typecheck + test), conteggio test, e la run e2e
   della Fase 1. Riporta i numeri veri, letti da te nell'output.

---

## 6. Cosa NON toccare in questo giro

- **Capienza pubblica allineata ai tavoli (D38)** — cantiere separato, rimandato da Matteo «dopo il
  collaudo». Tocca RPC pubbliche + Edge `create-booking`: rischio PROD alto.
- **Rollout PROD** — migrazioni `063`→`069` + Edge `create-booking` (TEST v30, **PROD ancora v21**) +
  client, tutto **insieme** e solo con autorizzazione esplicita chiesta ogni volta. Lezione del 23-05:
  migrazione che restringe permessi e fix client viaggiano insieme, mai separati.
- **Le migrazioni già applicate** non si toccano né si rinominano (incluso il doppio prefisso `003`).
- **Il re-merge `main` → `env/test`** non è un cancello al rollout: la fix di `f617077` è **già dentro**
  `env/test` (`create-booking/index.ts:66` e `:534-545` col suo test). Utile per igiene git, non
  urgente — l'handoff lo dà per bloccante ed è un'informazione superata.

---

## 7. Domande aperte per Matteo

Nessuna blocca il lavoro: sono tutte manopole con un valore di default già in uso. Raggruppale in
**una sola domanda** quando avrai qualcosa da mostrargli a video, invece di chiedergliele una a una.

1. ~~**Intervallo di richiamo dell'avviso di fine turno**: proposto **30'** (D-D).~~ ✅ **Chiuso
   04-08: Matteo ha confermato 30 minuti.** Vive in `restaurant_settings.table_release_notice_recall_minutes`
   (default `DEFAULT_RELEASE_NOTICE_RECALL_MINUTES` in `useTableStatuses.ts`), non è una costante sepolta.
2. **Soglia di ritardo (15')** e **buffer di riassetto (10')**: sono default assunti da un agente a
   giugno, **mai confermati**. Vivono già in produzione come tali.
3. **Durata del walk-in (D47, 90')**: dove si regola? Manopola in console o impostazione per locale?
4. Il pulsante **«Aggiungi tavolo» per sala** è finito in una posizione diversa da quella scritta nel
   piano: va bene così?

Le prime tre sono tutte «ogni quanto tempo l'app fa una cosa»: se in Impostazioni non esiste già un
posto dove stanno insieme, **proponi di crearlo** invece di sparpagliare l'ennesima costante.

---

## 8. Ordine consigliato

1. ~~Fase 0 (i tre fix decisi) → gate → report a Matteo.~~ ✅ **Fatta e pushata il 03/04-08.** Il
   «fermati e fatti confermare a video» è **ancora pendente**: Matteo ha detto «devo ancora testare».
2. Fase 1 (riparare la base di test) → gate: una run e2e credibile, numeri scritti nel report.
3. Fase 2 a ondate, dalle prime 4 righe della tabella (sono quelle legate ai fix appena fatti).
4. Fase 3 (analisi di salute) come chiusura, confrontando i numeri con quelli di partenza.
5. Aggiorna **`COLLAUDO_S4_CHECKLIST.md`** man mano: oggi è interamente `- [ ]` nonostante decine di
   voci siano state provate: gli esiti reali vivono sparsi in `SINTESI.md`, `CORSIA_*`, `RIPROVA_*` e
   nell'handoff. **Non lasciare la spunta a un «prompt di consolidamento» finale: non viene mai
   eseguito.** È l'attrito numero uno di questo cantiere.
