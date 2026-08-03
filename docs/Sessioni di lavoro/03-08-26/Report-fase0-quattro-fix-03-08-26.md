# Report — FASE 0 del piano senior: i quattro fix decisi (03-08-2026, notte)

> Branch `env/test`. **Nessun commit, nessun push.** Una migrazione (**070**) applicata su TEST
> (`docnnernvp`) con `npm run db:apply`; PROD non toccata.
>
> **Come è stato fatto:** prompt preparato dal senior dopo controverifica personale del codice
> ([PROMPT_FASE0_QUATTRO_FIX.md](PROMPT_FASE0_QUATTRO_FIX.md)), esecuzione di un agente Sonnet,
> **revisione del diff riga per riga dal senior** + ri-esecuzione personale dei comandi, poi un
> secondo giro di 4 correzioni richieste in revisione e ri-verificate. Il report è scritto dal
> senior: distingue esplicitamente ciò che ha verificato di persona da ciò che poggia sul racconto
> dell'agente.
>
> Piano di riferimento: [PIANO_SENIOR_TEST_E_SALUTE_CODICE.md](PIANO_SENIOR_TEST_E_SALUTE_CODICE.md)
> §2 (Fase 0). Decisioni di Matteo D-A/D-B/D-C/D-D: §1 dello stesso piano.

---

## 1. Cappello per Matteo

Quattro cose cambiano, tutte in Servizio e Calendario:

- **Servizio → Lista → elimini un tavolo occupato.** Prima spariva in silenzio e il cliente restava
  appeso: senza tavolo e **senza il pulsante «Togli tavolo»**, cioè senza uscita da interfaccia. Era
  il bug **bloccante**. Ora compare l'avviso *«Questo tavolo ha N prenotazioni assegnate.
  Eliminandolo torneranno nel cassetto "da assegnare"…»* e il tavolo sparisce **solo dopo conferma**.
  Un tavolo **libero** si elimina esattamente come prima: nessun click, nessun avviso in più.
- **Calendario → apri una prenotazione → «Modifica tavolo».** Spostare un cliente **non consuma più
  un turno** del tavolo di partenza. Da Servizio funzionava già così: ora le due strade danno lo
  stesso numero, come avevi deciso.
- **Le fasce orarie.** Impostazioni e Servizio ora rifiutano **le stesse cose**: nome fascia
  duplicato, orario di inizio uguale a quello di fine, fasce sovrapposte. Prima Servizio lasciava
  passare quello che Impostazioni bloccava.
- **L'avviso «Tavolo a fine turno».** Premi **«Ancora occupato»** e ora resta chiuso davvero: anche
  se ricarichi la pagina, anche da un altro tablet. Se dopo **30 minuti** il tavolo è ancora
  occupato, l'avviso si rifà vedere **una volta**; se riconfermi, altri 30 minuti di silenzio.

**Serve una tua azione?** No per lavorare. Sì se vuoi controverificare a video: le voci utili sono
A-1, A-2, A-3 e A-9 della checklist a mano ([§5 del report di
audit](Report-audit-allineamento-e-checklist-test-03-08-26.md)) — sono esattamente i quattro
comportamenti cambiati stanotte, quindi ora dovrebbero comportarsi **al contrario** di come il report
prevedeva.

---

## 2. I quattro fix, uno per uno

### FIX A — lo spostamento non consuma un turno (D-B) · era 🟠 alta

`useReleaseBookingAssignment` (`src/features/booking/hooks/useTableAssignments.ts`) timbrava sempre
`checked_out_at`, e `countTurnsUsed` (`tableTurnLimits.ts`) conta tutte le righe timbrate: il percorso
«Modifica tavolo» del Calendario bruciava un turno del tavolo di partenza. Ora fa **DELETE fisico**
della riga attiva. Il ramo `hasWaitingNextTurnOnTable` (blocco se un turno successivo è già in coda)
è invariato.

**Collisione di regole risolta (S-1).** Il commento del codice invocava **D48 «append-only»**
(giugno), che vieta il DELETE fisico: collide con la decisione D-B (agosto). Regola riscritta:
**append-only vale sui turni REALMENTE serviti.** Checkout e archiviazione timbrano; annullamento,
«torna in attesa», spostamento e liberazione forzata cancellano. Il codice applicava già questa
regola in `useUndoTableAssignment` e nei rami `move`/`requeue` di `useForceReplaceBookingOnTable`:
`useReleaseBookingAssignment` era l'unica eccezione rimasta. D48 riscritta in
`docs/MASTERPLAN_SERVIZIO.md` con l'elenco completo dei call-site che la rispettano.

**Dimostrato da:** `useTableAssignments.appendOnly.test.ts` (sezione release **riscritta di
proposito**, con il perché; le sezioni checkout e forceReplace **non toccate**) ·
`useTableAssignments.fix2.test.ts`, test nuovo che esegue entrambi i percorsi sullo stesso stato e
confronta i turni residui con la funzione reale, non con un doppione.

### FIX B — il tavolo che sparisce sotto il cliente (D-A) · era 🔴 bloccante

Nuovo `useTableLiveBookings(tableId)` in `useServizioTables.ts`, sul modello di `useRoomLiveBookings`
(D50), per contare le prenotazioni vive su **un** tavolo. `useDeleteTable` ora **cancella
fisicamente** le righe attive di quel tavolo (S-2: non deve bruciare un turno — il cliente non ha
finito, gli si toglie il tavolo da sotto) e **poi** disattiva il tavolo. Non chiama
`markBookingServedIfFullyReleased`: la prenotazione non è stata servita, torna nel cassetto.

In `src/pages/ServizioPage.tsx` la conferma di `TableCard` mostra l'impatto quantificato, stesso tono
di `RoomConfigModal.tsx`. **La query parte solo all'apertura della conferma** (`enabled =
confirmDelete`) e il pulsante è disabilitato finché il conteggio non è arrivato: un tavolo libero non
fa nessuna richiesta in più, e non si può confermare su un numero non ancora noto.

**Tavolata su più tavoli:** tocca **solo** le righe del tavolo eliminato; gli altri restano
assegnati. **Righe già chiuse:** intatte. **Verificato dal senior:** `useDeleteTable` ha **un solo**
percorso di chiamata in tutta l'app (`ServizioPage.tsx`, entrambi i punti passano dallo stesso
`TableCard`) — non esiste una seconda strada non protetta.

**Dimostrato da:** `useServizioTables.deleteTable.test.tsx` (libero / occupato / tavolata / righe già
chiuse) · `ServizioPage.deleteTableOccupato.test.tsx` (conferma invariata sul tavolo libero, avviso
quantificato sull'occupato, plurali, tavolata).

### FIX C — un'unica validazione delle fasce (D-C) · era 🟠 alta

Le tre versioni divergenti convergono su **`validateSlotConfigs`** (`bookingTimeSlots.ts`), che era
codice morto: formato HH:mm, inizio≠fine, nome duplicato (trim + case-insensitive), sovrapposizioni
(overnight-safe, invariato). Firma allargata al tipo minimo `SlotValidationInput`.

**Correzione chiesta in revisione — la trappola dei dati vecchi.** Passare l'array intero avrebbe
fatto sì che una fascia **già a DB e invalida** (nome duplicato o inizio==fine — cose che nessun
editor bloccava fino a stanotte) impedisse di salvare **qualsiasi altra** fascia, con un errore che
nomina una fascia non correggibile da quella modale: sarebbe sembrato il fix rotto. Aggiunto
`options.focusIndex`:

- **Impostazioni** (array intero editabile nella stessa schermata) → **invariato**, valida tutto:
  lì l'errore è sempre azionabile.
- **Servizio** (un editor per fascia) → controlli per-fascia solo sulla **bozza**, controlli fra
  coppie solo per le coppie **che coinvolgono la bozza**.

**Dato reale, non deduzione:** interrogato `service_slots` su TEST → **43 fasce, 0 con inizio==fine,
0 nomi duplicati per tenant**. Oggi il dato legacy invalido **non esiste**; il presidio resta per i
casi futuri e per il rollout. *(Misurato dall'agente e **riverificato dal senior** con una query in
sola lettura su `docnnernvpyrbwuzzach`, script con guardia sul project ref: stessi tre numeri.)*

**Deviazione dichiarata:** in Impostazioni resta permesso salvare con **zero** fasce (comportamento
preesistente). `validateSlotConfigs([])` avrebbe introdotto una regola nuova non richiesta.

**Dimostrato da:** `serviceSlots.sovrapposizione.test.tsx` (+2) ·
`settingsTimeSlots.settingsM4.adminBlindatura.test.tsx` (+2) · 7 unit su `focusIndex`, incluso il
controtest «senza focusIndex un duplicato resta rifiutato» · 2 component test che riproducono lo
scenario legacy (due «Cena»/«cena» a DB + salvataggio di una terza fascia, e modifica di una fascia
estranea: entrambi devono riuscire).

### FIX D — l'avviso di fine turno sopravvive al ricaricamento (D-D) · era 🟠 alta

Migrazione **070**: colonna `booking_table_assignments.release_notice_handled_at timestamptz` +
commento. Nessun nuovo GRANT (la RLS `admin_update_bta` della `011` copre già). Applicata su TEST con
`npm run db:apply`, tipi rigenerati con `npm run db:types:linked`.

«Ancora occupato» timbra `now()` (`useMarkReleaseNoticeHandled`); `pendingReleases` in
`AssignmentMapPanel.tsx` esclude un tavolo «in uscita» finché non è passato l'intervallo di richiamo.
Manopola con il modello già in uso per la soglia di ritardo (S-5): chiave JSONB
`restaurant_settings.table_release_notice_recall_minutes`, default
`DEFAULT_RELEASE_NOTICE_RECALL_MINUTES = 30` accanto a `DEFAULT_LATE_THRESHOLD_MINUTES`. **Nessuna
migrazione per la manopola.** Logica isolata in una funzione pura esportata e testabile,
`isReleaseNoticeSilenced`.

**Bug trovato scrivendo il fix, non previsto dal piano — la cosa migliore del giro.** Un `.mutate()`
fire-and-forget seguito da un ricaricamento immediato **fa abortire la richiesta di rete prima che
arrivi al server**: la conferma si perdeva e l'avviso ritornava, lo stesso sintomo del bug che il fix
doveva chiudere. Ora l'avviso si chiude **solo dopo** che il server conferma, e i pulsanti restano
disabilitati per quell'istante: qualunque reload arriva dopo che la riga è già scritta.

**Correzioni chieste in revisione:** (a) il timbro colpiva **tutte** le righe attive di
tavolo+fascia+data, quindi anche un secondo turno già assegnato sullo stesso tavolo si portava dietro
una conferma che nessuno aveva dato per lui — ora la UPDATE è per `id` della riga effettivamente
notificata; (b) la manopola accettava `0` in lettura pur rifiutandolo in scrittura, e con `0`
l'avviso non veniva **mai** silenziato, cioè il bug appena chiuso si riapriva — parse allineato a
validate (1..240, fuori range → 30).

**S-4 — «Decido dopo» resta locale al browser, deliberatamente.** È un «non adesso» sulla vista di
chi sta guardando lo schermo, non una decisione chiusa sul tavolo: è corretto che dopo un
ricaricamento l'avviso si rifaccia vedere. Scritto in `ADMIN_SERVIZIO_CONTEXT.md` §9.14 perché non
venga trattato come un bug gemello.

**Dimostrato da:** `AssignmentMapPanel.releaseNoticeSilenced.test.ts` (7 casi: 29'/31'/esattamente
30'/manopola 60'/data non valida/mai confermato) · `restaurantSettingRegistry.releaseNoticeRecall.test.ts`
· `useTableAssignments.markReleaseNotice.test.ts` (il WHERE non contiene più tavolo/fascia/data) ·
`AssignmentMapPanel.fineTurnoMultiTavolo.test.tsx` (due turni attivi sullo stesso tavolo: solo il
turno 1 viene timbrato; orologio finto; **cambio fascia azzera gli avvisi** — voce di checklist mai
verificata prima) · **e2e con browser reale**, vedi §3.

---

## 3. Numeri veri — riverificati dal senior, non solo riportati

| Cosa | Prima | Dopo |
|---|---|---|
| `npm run validate` | — | **exit 0** (lint pulito, typecheck pulito) |
| Test unit/integration | 1283 su 156 file | **1332 su 161 file** (+49 test, +5 file) |
| Migrazione 070 | — | applicata su TEST (`npm run db:apply`), PROD invariata |
| `src/types/database.ts` | — | rigenerato, nessun drift oltre la colonna nuova |
| Fasce invalide su TEST | sospetto | **0 su 43** (inizio==fine e nomi duplicati) |

`npm run validate` è stato **eseguito personalmente dal senior due volte** (dopo il primo giro e dopo
le correzioni): entrambe exit 0, la seconda 161 file / 1332 test. I numeri dell'agente combaciano.

### L'e2e: due run, due esiti, nessuna contraddizione

- **~23:21** — `npx playwright test e2e/pro/pro-service-tables-lifecycle.spec.ts` → **7 passed / 0
  failed**. Prima del fix la stessa spec dava 6/1 con il test dell'avviso rosso *di proposito*.
  Riscontro indipendente trovato dal senior: `test-results/.last-run.json` = `"status": "passed"`,
  scritto in quella fascia oraria. **Nessun `test.fail()` aggiunto** — non serviva più.
- **~23:50** — stessa spec → **6 passed / 1 failed**, ma **il fallito è un altro test**
  (`Stati del tavolo in sequenza`), e **la causa non è il codice di produzione**: è l'ora del giorno.

**Causa verificata dal senior riga per riga** (non presa dal racconto dell'agente):
`wallIsoAt(canonicalDate, instant)` (`pro-service-tables-lifecycle.spec.ts:133`) costruisce l'ISO
prendendo la **data canonica fissa** e **solo l'ora** di `instant`. Il test calcola
`arrival = NOW + 5'` e `end = arrival + soglia(15') + 6'`, cioè `NOW + 26'`: eseguito alle 23:50,
`end` cade **dopo mezzanotte** e finisce incollato alla data di **oggi** → `confirmed_end` risulta
**prima** di `confirmed_start`, quindi il tavolo è già «in uscita» al primo controllo. Il senior ha
verificato che il file non è stato modificato dall'agente oltre a un commento di 3 righe.

> **Conseguenza da tenere a mente:** quel test **passa di giorno e fallisce a tarda notte**. È
> fragilità della batteria a orologio reale, materia della **Fase 1**, non un fix mancato di questo
> giro. Se lo rilanci di mattina deve tornare verde: se non lo fa, quella è un'informazione nuova.

---

## 4. Cosa NON è stato verificato — dichiarato, non nascosto

- **Secondo dispositivo/browser** per l'avviso fine turno: garantito per costruzione (la verità è la
  colonna a DB, non il browser), ma **nessun test con due contesti**. **NON VERIFICATO.**
- **Riconferma dopo il ritorno dell'avviso** («altri 30 minuti»): stesso codice del primo click,
  verificato per lettura, **senza test dedicato**. **NON VERIFICATO.**
- **Il ritorno visivo nel cassetto «da assegnare»** dopo l'eliminazione del tavolo: dimostrato a
  livello di hook (la riga viene davvero cancellata), **non a schermo**. **NON VERIFICATO** visivamente.
- **La race condition di FIX D** poggia sul racconto dell'agente (test diagnostico temporaneo) più
  due riscontri indipendenti: la spec passa ora e l'artefatto Playwright esiste. Il senior **non ha
  osservato la richiesta abortita di persona**.
- **`useDeleteRoom` non è stata toccata** (S-3, fuori perimetro): continua a **timbrare**, quindi per
  la stessa situazione la sala consuma un turno e il tavolo no. Voce per la Fase 3.

---

## 5. Stato git e coda

- **Nessun commit, nessun push.** Il lavoro di stanotte è **tutto nel working tree**.
- Su `env/test` restano **5 commit locali non pushati** (`3e9fa2c`, `ae4e7ae`, `5780717`, `7d8d5fe`,
  `c4e15ab`): non sono di questo giro, il push non è stato chiesto.
- **La migrazione 070 entra nel treno del rollout PROD** (`063`→`070` + Edge `create-booking`, PROD
  ancora v21 + client, tutto **insieme** e con autorizzazione esplicita chiesta ogni volta).

**Prossimo passo del piano:** **Fase 1** — riparare la base di test che passa senza verificare nulla
(6 voci in §3 del piano). La prima è `admin-calendar-blindatura.spec.ts`, che asserisce su
`daily_guest_limit`, un setting che nessun file applicativo legge più. A quella lista va **aggiunta**
la fragilità di `wallIsoAt` documentata in §3: è dello stesso genere — un test il cui verde non
significa quello che sembra.

---

## 6. Documentazione allineata in questo giro

| File | Cosa |
|---|---|
| `docs/MASTERPLAN_SERVIZIO.md` | **D48 riscritta** (S-1) con i call-site che la rispettano |
| `docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md` | **§9.14** nuova (i quattro fix, la dottrina turni, S-3, S-4) + **§9.13 marcata come superata**: diceva ancora «decisione da prendere con Matteo» e «6 passed / 1 failed» |
| `docs/FOLLOW_UP.md` | `FU-SERV-DELETE-TABLE-1`, `FU-SERV-TURN-MOVE-1`, `FU-SERV-SLOT-VALIDATION-1`, `FU-SERV-RELEASE-NOTICE-1` → **Fatto**, con il come |
| `docs/DATABASE.md` | aggiunte **067, 068, 069, 070** (mancavano tutte: era una delle divergenze dell'audit) |
| `docs/Testing-Skill/COLLAUDO_S4_CHECKLIST.md` | due voci **spuntate citando il test** che le dimostra |

Le altre ~15 divergenze skill/codice dell'audit restano aperte: sono materia della **Fase 3**, non di
questo giro.

Fuori da questa cartella è stato marcato come superato anche
`docs/Sessioni di lavoro/02-08-26/HANDOFF_S4_SENIOR.md` §5 punto 4: dava come «prossimo passo reale»
il push + *la decisione* su `FU-SERV-RELEASE-NOTICE-1`, che ora è decisa **e implementata**.

---

> Le sezioni che seguono usano la numerazione canonica di
> `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` (§11 domande di chiusura, §12 self-review), non la
> progressione di questo report.

## 11. Domande di chiusura

```
❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: **Due prompt di testo + tre risposte a scelta multipla.**

Prompt 1 (verbatim, refusi originali mantenuti): «leggi il file e handoff senior S4 e prepariamo
prossima sessione. prepara prompt poi lancia agente che esgue sonnet) tu revisioni alla fine dei
lavori. se hai dubbi parliamone prima e poi lavora in autonomia»

Prompt 2 (verbatim): «riprendi il lavoro»

Tre decisioni prese rispondendo a domande a scelta multipla che ho posto io prima di lanciare:
(a) perimetro → «Tutti e 4 (consigliato)»; (b) database → «Sì, solo su TEST (consigliato)»;
(c) intervallo di richiamo dell'avviso → «30 minuti (proposto)».

Nota sul prompt 1: contiene **due grilletti in tensione** — «prepara» (che nel VOCABOLARIO significa
*non eseguire, consegna solo il prompt*) e «poi lancia agente che esegue». Ho letto la sequenza come
«prepara il prompt **e poi** fallo eseguire da un Sonnet, tu supervisiona», che è l'unica lettura in
cui entrambe le parti hanno senso, e ho rispettato il resto della riga alla lettera: dubbi discussi
**prima** (le tre domande), poi autonomia fino alla revisione finale.

⚠️ Tutti gli altri turni della chat sono stati **notifiche automatiche** di completamento (due
dell'agente, due dei comandi in background) e un richiamo dell'hook di fine sessione, tutti marcati
esplicitamente come NON input umano. Nessuno è stato trattato come approvazione. **Non esiste alcuna
autorizzazione a committare o pushare:** non è stata chiesta né data, e infatti non è stato fatto.

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Sì, e in un punto ho **corretto l'attribuzione** (vedi in coda).

Comandi eseguiti **da me**, non riportati da altri: `npm run validate` **due volte** (dopo il primo
giro e dopo le correzioni) → entrambe exit 0, la seconda **1332 test / 161 file**; `git status`,
`git diff`, `git diff --stat` (34 file modificati + 8 non tracciati = i 42 di `git status`, coerente);
`git log origin/env/test..env/test` → **5** commit non pushati.

File riaperti di persona in questa sessione: `useServizioTables.ts` (nuovo `useTableLiveBookings` +
DELETE prima di `active:false`) · `useTableAssignments.ts` (release che ora cancella; timbro per `id`;
`onSuccess` invalida ancora, righe 838-840) · `useRooms.ts:64-246` (il pattern copiato) ·
`tableTurnLimits.ts` per intero · `bookingTimeSlots.ts` (la modalità senza `focusIndex` è **identica
riga per riga** a prima: verificato sul diff, non assunto) · `ServiceSlotsManager.tsx` ·
`RestaurantSettingsTab.tsx` · `AssignmentMapPanel.tsx` (`isReleaseNoticeSilenced`,
`activeAssignmentByTable`, `pendingReleases`, `markReleaseHandled`) · `ServizioPage.tsx` (query lazy +
conferma) · `TableReleaseNoticeModal.tsx` · `restaurantSettingRegistry.ts` · `useTableStatuses.ts` ·
migrazione `070` · `src/types/database.ts` (**3 righe**: `release_notice_handled_at` in Row +
Insert/Update, nessun altro drift) · i diff di `MASTERPLAN_SERVIZIO.md`, `DATABASE.md`,
`FOLLOW_UP.md`, `COLLAUDO_S4_CHECKLIST.md`, `ADMIN_SERVIZIO_CONTEXT.md`.

Due verifiche indipendenti che l'agente non aveva chiesto di fare:
1. **`useDeleteTable` ha un solo percorso di chiamata** in tutta l'app (grep su `src/`): non esiste
   una seconda strada di eliminazione senza avviso. Era il rischio più concreto del FIX B.
2. **La causa del test e2e rosso**, letta alla riga: `wallIsoAt()` (`:133`) + `end = NOW + 26'`
   (`:550-554`) → a tarda notte la fine scavalca la mezzanotte e finisce **prima** dell'inizio sulla
   stessa data. Ho anche verificato con `git diff` che l'agente ha toccato quel file **solo** con un
   commento di 3 righe, come dichiarava.

Riscontri esterni: `test-results/.last-run.json` = `{"status":"passed","failedTests":[]}`, scritto
nella fascia oraria della run dell'agente — corrobora l'e2e a 7 verdi che io non ho eseguito.

**Correzione di attribuzione:** il dato «43 fasce su TEST, 0 invalide» era dell'agente e nel report
compariva senza attribuzione. **L'ho riverificato io** con una query REST in sola lettura su
`service_slots` (script con guardia che si rifiuta di partire se il progetto non è `docnnernvp`):
progetto `docnnernvpyrbwuzzach`, **43 fasce, 0 con inizio==fine, 0 nomi duplicati per tenant**. Il
numero era esatto; ora è verificato in prima persona, non solo riferito.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: **Sette allineati, uno sistemato da me in revisione, tre lasciati aperti con motivo.**

Allineati e verificati aprendo il diff: **tipi** `src/types/database.ts` (rigenerato con
`npm run db:types:linked`, contiene la colonna nuova) · **skill d'area**
`ADMIN_SERVIZIO_CONTEXT.md` §9.14 (i quattro fix, la dottrina turni, S-3, S-4) · **masterplan**
`MASTERPLAN_SERVIZIO.md` (**D48 riscritta** con l'elenco dei call-site) · **follow-up**
`FOLLOW_UP.md` (4 voci → Fatto, col come) · **database** `DATABASE.md` (aggiunte 067→070; era una
divergenza dell'audit) · **collaudo** `COLLAUDO_S4_CHECKLIST.md` (2 voci spuntate **citando il
test**) · **test**: 5 file nuovi + 13 aggiornati, compresi i mock dei due hook nuovi negli 8 file
`AssignmentMapPanel.*.test.tsx` e nei due `ServizioPage.*` (senza quelli il render crashava:
l'agente l'ha scoperto eseguendoli, non deducendo).

Due stantii trovati **da me in revisione e sistemati**, perché sono esattamente la trappola che
l'audit denunciava (documenti che raccontano un'app diversa):
- `ADMIN_SERVIZIO_CONTEXT.md` §9.13 diceva ancora «decisione da prendere con Matteo» e «6 passed /
  1 failed» → marcata **SUPERATA** con rimando a §9.14.
- `HANDOFF_S4_SENIOR.md` §5 punto 4 dava come prossimo passo *la decisione* su
  `FU-SERV-RELEASE-NOTICE-1`, ora decisa e implementata → marcato **SUPERATO**, con il conteggio
  commit corretto (5, non 3) e il rimando alla Fase 1.

Non allineati, deliberatamente: le altre ~15 divergenze dell'audit (`ADMIN_SHELL_PAGES_CONTEXT.md`,
`LEGAL_STATE_CONTEXT.md`, `DB_SCHEMA_CONTEXT.md`, `ROADMAP_LAVORI_AGENTI_SERVIZIO.md`,
`STATO_BLINDATURA_CHECKLIST.md`) → **Fase 3**, fuori dal perimetro §6 del prompt · `TESTING_SKILL.md`
non ha ancora la nota su `page.clock` che rompe il refresh JWT, che il piano §4 suggeriva di spostarci
dalla skill d'area → **non fatto, lo segnalo qui perché serve a chiunque scriva e2e** ·
`STATO_APP_E_MANDATO_FABLE.md` non toccato (cantiere diverso).

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: (1) **Non ho eseguito io l'e2e**: mi sono fidato della run dell'agente più due riscontri
(l'artefatto Playwright e la mia lettura del codice del test). Rieseguirla ora darebbe comunque un
rosso da orologio, vedi §3. (2) **Tre criteri di accettazione restano NON VERIFICATI** e sono
dichiarati in §4: secondo dispositivo, riconferma dopo i 30 minuti, ritorno visivo nel cassetto.
(3) **Non ho osservato di persona la race condition** di FIX D: poggia sul racconto dell'agente più
due riscontri indiretti. (4) **Non ho corretto il test e2e fragile** (`wallIsoAt`): è materia della
Fase 1 e correggerlo qui avrebbe allargato il perimetro dei quattro fix decisi da Matteo.
(5) **Non ho toccato `useDeleteRoom`** (S-3): resta la divergenza tavolo/sala sul consumo del turno.
(6) **Nessun commit, nessun push** — mai autorizzati (vedi R1). (7) **Non ho spostato la nota
`page.clock` in `TESTING_SKILL.md`** (vedi R3). (8) Non ho toccato rollout PROD, D38, re-merge `main`:
esplicitamente fuori scope.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: **Attrito 1 — il subagent non può scrivere il proprio report:** l'ambiente gli rifiuta il Write
(«return findings as text»), quindi ha consumato un giro per scoprirlo e il report l'ho scritto io.
Proposta: mettere questo vincolo **nel prompt** («non scrivere il file, restituisci testo: lo scrivo
io»), e annotarlo nella skill di chiusura, così ogni coordinatore lo sa prima e non lo riscopre.
**Attrito 2 — la sezione §11 è un obbligo che l'hook conosce e il prompt operativo no:** il mio prompt
all'agente chiedeva un report con sezioni §1-§7 di mia invenzione, senza le domande di chiusura, e
l'hook ha giustamente contestato l'assenza di §11. Proposta: `CHIUSURA_SESSIONE.md` dovrebbe esporre
uno **scheletro copiabile** di report (intestazioni §1-§12 vuote) da incollare nei prompt agli agenti,
invece di lasciare che ogni coordinatore reinventi la struttura e scopra il debito a hook scattato.
**Attrito 3 — i percorsi dei file di collaudo:** il piano indicava
`docs/Sessioni di lavoro/03-08-26/COLLAUDO_S4_CHECKLIST.md`, ma il file vive in
`docs/Testing-Skill/`. L'agente l'ha trovato con Glob e ha corretto; se si fosse fidato del percorso
avrebbe creato un doppione. Proposta: nei prompt citare i file di checklist **per nome + istruzione di
cercarli**, mai per percorso presunto.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: **Contesto giusto per instradare, insufficiente per fidarsi.** Piano + report di audit +
handoff bastavano per scrivere un prompt preciso senza esplorare il codice a tappeto, ed è stato il
guadagno più grande: le tre domande a Matteo sono uscite in cinque minuti. Ma il piano conteneva **due
lacune che solo il codice ha rivelato** — non citava il test `appendOnly` che difendeva il
comportamento vecchio (chi non lo sapesse l'avrebbe «aggiustato» annullando il fix), e non diceva che
la soglia di ritardo è già una chiave JSONB senza migrazione (rischio: una seconda migrazione
inutile). Le ho trovate rileggendo i file **prima** di scrivere il prompt: è la conferma che il §2
«fatti già verificati» va costruito ogni volta, non ereditato.

**Hook: utile, e questa volta ha trovato un buco vero** — mancava l'intera §11, e non era una
formalità: compilarla mi ha costretto a riverificare l'attribuzione del dato sulle 43 fasce (era
dell'agente, ora è mio) e a scoprire il §5 stantio dell'handoff, due cose che sarebbero passate. È
scattato **una volta sola, a lavoro finito**: nessun rumore, al contrario della sessione precedente
dove partiva mentre gli agenti erano ancora in esecuzione.
```

## 12. Self-review del report

1. **Dati = diff reale:** sì, R2. Ogni numero del §3 viene da un comando che ho eseguito io, tranne
   l'e2e a 7 verdi, marcato come tale sia in §3 sia in §4. L'unico dato riferito senza attribuzione
   (43 fasce) è stato riverificato in prima persona durante questa self-review, e la §2 FIX C ora dice
   «interrogato», che è vero per entrambi.
2. **File correlati allineati:** sì, R3 — e due stantii sono stati sistemati **in revisione**, non
   lasciati al prossimo. Tre restano aperti con il motivo scritto, incluso quello che mi dà più
   fastidio (`TESTING_SKILL.md` senza la nota `page.clock`).
3. **Q1-Q6 coerenti fra loro e col lavoro:** sì. R1 (nessuna autorizzazione a pushare), R4 (nessun
   commit) e §5 dicono la stessa cosa; R4 e §4 elencano gli stessi tre NON VERIFICATI, senza
   discrepanze.
4. **Tono utente:** §1 e i «cosa cambia» della §2 parlano per schermate e flussi concreti (elimini il
   tavolo, premi «Ancora occupato», ricarichi); §2 tecnica, §3-§6 e §11-§12 sono dati interni. La
   distinzione è rispettata.
5. **Onestà sui limiti:** il report **non** dichiara verde ciò che non ho visto. In particolare non
   dice «l'avviso funziona su più dispositivi» ma «garantito per costruzione, non testato», e spiega
   perché l'e2e rilanciata adesso è rossa **senza** usarlo come scusa per non riportarlo.
6. **Cosa un revisore potrebbe contestarmi:** di aver accettato la race condition di FIX D sulla
   parola dell'agente invece di riprodurla. È il punto più debole del giro e sta scritto in §4; la
   contro-prova disponibile (la spec ora passa, l'artefatto esiste) è indiretta, non equivalente.
