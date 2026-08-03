# Prompt agente — FASE 0 del piano senior: i quattro fix decisi

> Scritto dal senior supervisore il 03-08-2026 (notte), dopo controverifica personale del codice.
> Destinatario: **un agente Sonnet in esecuzione**. Il senior rilegge il diff riga per riga alla fine.
> Branch: `env/test`. Working tree pulito all'avvio, 5 commit locali non pushati (non tuoi, non toccarli).

---

## 0. Regole non negoziabili

1. **Nessun commit, nessun push.** Matteo non li ha chiesti. Lascia tutto nel working tree.
2. **Nessuna scrittura su PROD.** Hai il permesso esplicito di Matteo per **una** migrazione sul
   database di **TEST** (`docnnernvp`), da applicare **solo** con `npm run db:apply` (lo script si
   rifiuta di partire se il progetto collegato non è quello di test). `supabase db push --include-all`
   è **vietato per sempre**. I connettori MCP Supabase **non sono autenticati** in questa sessione:
   usa la CLI, non tentare l'MCP.
3. **Mai `npx prettier`.** Il repo non ha prettier: riscriverebbe tutto in doppi apici con punto e
   virgola. Lo stile è single-quote / no-semi, garantito da ESLint.
4. **Non dedurre, verifica.** Ogni affermazione nel tuo report deve citare `file:riga` o l'output di un
   comando che hai eseguito davvero. Se non hai potuto verificare qualcosa, scrivi **NON VERIFICATO**.
   Non è una colpa: è l'unica cosa che rende il report utile. Inventare un esito lo rende dannoso.
5. **Non allargare il perimetro.** Fuori scope in questo giro: rollout PROD, capienza pubblica D38,
   re-merge `main`, le ~15 divergenze documentali dell'audit (tranne quelle elencate in §6),
   riscrittura dei test e2e esistenti (è la Fase 1, non questa).

## 1. Letture obbligatorie, in quest'ordine

1. `docs/Sessioni di lavoro/03-08-26/PIANO_SENIOR_TEST_E_SALUTE_CODICE.md` — **§0, §1, §2** (la Fase 0
   è il tuo mandato) e **§6** (cosa non toccare).
2. `docs/Sessioni di lavoro/03-08-26/Report-audit-allineamento-e-checklist-test-03-08-26.md` — **§3**
   (i bug, con gli scenari concreti).
3. `docs/APP_CONTEXT_SKILL.md` **§0** → carica la skill d'area **Servizio**
   (`docs/Admin-Skill/ADMIN_SKILL.md` + `docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md`, in
   particolare **§9.9–§9.13**).
4. `docs/Testing-Skill/TESTING_SKILL.md` + `TESTING_PATTERNS.md` prima di scrivere qualsiasi test.

## 2. Fatti già verificati dal senior — parti da qui, non ri-derivarli

Ho aperto io questi file stanotte. Sono esatti alla riga. **Due cose che il piano non dice** sono ai
punti (f) e (g): leggile prima di iniziare, ti risparmiano un errore.

- (a) `useDeleteTable` — `src/features/booking/hooks/useServizioTables.ts:148-175` — fa solo
  `.update({ active: false })`. Nessun controllo sulle assegnazioni. Confermato.
- (b) `handleDelete` — `src/pages/ServizioPage.tsx:157-159` — `deleteTable.mutate(id)`, nessuna
  guardia. Il pulsante è in `TableCard`, stesso file, `:47-70`; `onDelete` passato a `:268` e `:299`.
- (c) `useDeleteRoom` — `src/features/booking/hooks/useRooms.ts:183-246` — recupera i tavoli della
  sala, timbra `checked_out_at` sugli assignment attivi, poi disattiva. `useRoomLiveBookings`
  (`:64-108`) conta i `booking_id` distinti con `checked_out_at IS NULL`. **La UI di conferma da
  copiare è `RoomConfigModal.tsx:85-86` (hook di conteggio) e `:176-179`** (`liveImpactText`, il testo
  con l'impatto quantificato).
- (d) `useReleaseBookingAssignment` — `useTableAssignments.ts:738-785` — timbra **sempre**
  `checked_out_at` (`:762-766`). Il commento a `:754` invoca D48 append-only. Unico call-site:
  `QuickTableAssignModal.tsx:32,73` in modalità `reassign` → **è sempre uno spostamento**: si libera il
  vecchio tavolo, poi si sceglie il nuovo.
- (e) `countTurnsUsed` — `src/features/booking/utils/tableTurnLimits.ts:42-49` — conta **tutte** le
  righe, timbrate incluse.
- (f) ⚠️ **Il codice ha già una dottrina coerente, e la release da Calendario è l'unica eccezione.**
  `useForceReplaceBookingOnTable` fa **DELETE fisico** nei rami `move` (`:530-536`) e `requeue`
  (`:556-562`), e timbra solo in `archive` (`:537-544`). `useUndoTableAssignment` fa DELETE fisico e il
  suo commento (`:617-619`) dice testualmente *«Non viola D48 (append-only sui turni realmente
  serviti)»*. Quindi la regola vera già in vigore è: **si timbra solo quando il cliente ha davvero
  mangiato lì; negli altri casi la riga sparisce.**
- (g) ⚠️ **Esiste un test che pretende il comportamento vecchio:**
  `src/features/booking/hooks/__tests__/useTableAssignments.appendOnly.test.ts:167-210` asserisce che
  `useReleaseBookingAssignment` faccia UPDATE e **mai** DELETE. Il fix 0.2 lo farà fallire. Va
  **riscritto di proposito**, con un commento che spiega il cambio di regola — non «aggiustato» per
  farlo tornare verde, e senza toccare le asserzioni su `useCheckoutTable`, che restano valide.
- (h) `AssignmentMapPanel.tsx` — `handledReleaseTableIds` è `useState` a `:311`, azzerato al cambio
  fascia/giorno a `:352-357`, consumato a `:497`, scritto a `:752`. Il «fratello»
  `dismissedReleaseSignature` («Decido dopo») è a `:315`, stessa natura locale.
- (i) `validateSlotConfigs` — `src/features/booking/utils/bookingTimeSlots.ts:25-45` — valida formato
  HH:mm, inizio≠fine, nomi univoci (trim + lowercase), sovrapposizioni (via `slotRangesOverlap`, che
  gestisce l'overnight, `:73-87`). **È codice morto: nessun call-site applicativo.**
- (j) La soglia di ritardo **non è una costante sepolta**: vive in `restaurant_settings` come chiave
  JSONB `table_late_threshold_minutes`, con default `DEFAULT_LATE_THRESHOLD_MINUTES = 15` esportato da
  `src/features/booking/hooks/useTableStatuses.ts:35` e letto a `:165-169`. Il buffer di riassetto è
  per-fascia (`service_slots.turnover_buffer_minutes`). **Questo è il posto dove va la nuova manopola.**
- (k) Ultima migrazione presente: `069_create_walk_in_with_assignment_rpc.sql`. La tua sarà la **070**.

## 3. Decisioni già prese — non riaprirle, non re-litigarle

**Di Matteo (03-08):** D-A eliminare un tavolo occupato deve avvisare prima, come per la sala, e la
liberazione **non brucia un turno** · D-B spostare un cliente non consuma un turno, **da nessuna
schermata**; archiviare sì · D-C validazioni fasce convalidate, i due editor devono convergere su
un'unica fonte con i **nomi doppi bloccati in entrambi** · D-D la conferma «Ancora occupato» va
persistita sul record di assegnazione (vale per tutti i dispositivi, resiste al reload) e l'avviso
torna **una volta** dopo l'intervallo di richiamo. **Intervallo confermato da Matteo stanotte: 30
minuti.**

**Del senior (io), per sbloccarti — non richiedere conferma, applicale:**

- **S-1 · La collisione D48 la risolvo così: vince D-B, e D48 va riscritta, non cancellata.** La
  regola corretta — che il codice già applica ovunque tranne in un punto (vedi 2.f) — è:
  *append-only sui turni **realmente serviti***. Checkout e archiviazione timbrano `checked_out_at`;
  annullamento, «torna in attesa», spostamento e liberazione forzata cancellano la riga. Allinea
  `useReleaseBookingAssignment` alla dottrina e **riscrivi D48 in `MASTERPLAN_SERVIZIO.md`** con questa
  formulazione, citando i call-site che la rispettano già.
- **S-2 · Eliminazione tavolo occupato: DELETE fisico delle righe attive di quel tavolo**, non timbro.
  Motivo: D-A dice esplicitamente che non deve bruciare un turno, ed è coerente con S-1 (il cliente non
  ha finito di mangiare). Le righe **già chiuse** (`checked_out_at` valorizzato) non si toccano.
- **S-3 · `useDeleteRoom` resta com'è** (timbra) in questo giro: cambiarla è fuori perimetro. La
  divergenza fra le due operazioni va **annotata nel report** come voce per la Fase 3, non sanata qui.
- **S-4 · «Decido dopo» (`dismissedReleaseSignature`) resta locale alla sessione del browser.** È un
  «non adesso» sulla vista corrente, non una decisione presa sul tavolo: è giusto che dopo un reload
  l'avviso si rifaccia vedere. Va **scritto** in `ADMIN_SERVIZIO_CONTEXT.md`, così il prossimo agente
  non lo tratta come un bug gemello.
- **S-5 · La manopola dei 30 minuti segue il modello della soglia di ritardo** (2.j): chiave
  `restaurant_settings.table_release_notice_recall_minutes` + costante
  `DEFAULT_RELEASE_NOTICE_RECALL_MINUTES = 30` esportata accanto a `DEFAULT_LATE_THRESHOLD_MINUTES`.
  **Nessuna migrazione per la manopola** (è JSONB), nessuna UI di Impostazioni da costruire adesso.

---

## 4. I quattro fix — ordine di esecuzione obbligato

Fai **0.2 per primo**: fissa la dottrina dei turni su cui 0.1 si appoggia. Poi 0.1, 0.3, 0.4.
Dopo ogni fix: `npm run lint` + `npm run typecheck` + i test dell'area. `npm run validate` completo
solo alla fine (è lento).

### 4.1 — FIX A (era 0.2): lo spostamento non consuma un turno · 🟠 alta

**Cosa deve succedere in sala:** sposto un cliente dal Tavolo 1 al Tavolo 2 aprendo la prenotazione dal
**Calendario** («Modifica tavolo»). I turni residui del Tavolo 1 **non calano**. Oggi calano.

**Come:** in `useReleaseBookingAssignment` sostituisci il timbro `checked_out_at` con il DELETE fisico
dell'assignment attivo, esattamente come fa il ramo `requeue` di `useForceReplaceBookingOnTable`
(`useTableAssignments.ts:556-562`). Il permesso DELETE esiste già (`admin_delete_bta`, mig. 014 +
GRANT 026) ed è quello che usa l'annullamento: non serve nessuna migrazione.

**Criteri di accettazione**
- Spostamento da Calendario → turni residui del Tavolo 1 invariati.
- Spostamento da Servizio (sostituzione guidata, «spostalo») → identico. **I due percorsi devono dare
  lo stesso numero.**
- Archiviazione / checkout → il turno **si consuma**. Invariato.
- Il ramo `hasWaitingNextTurnOnTable` (`:757-759`) resta **identico**: blocca ancora.
- `served_at` **non** viene marcato dalla release (è già così, non regredire: lo copre il test 3b in
  `useTableAssignments.fix2.test.ts:231`).

**Test:** riscrivi la sezione `useReleaseBookingAssignment` di `useTableAssignments.appendOnly.test.ts`
(vedi 2.g) e aggiungi in `useTableAssignments.fix2.test.ts` un caso che dimostri il **numero di turni
residui identico** fra i due percorsi.

### 4.2 — FIX B (era 0.1): il tavolo che sparisce sotto il cliente · 🔴 bloccante

**Cosa succede oggi:** assegni Rossi al Tavolo 3, vai in Modifica ed elimini il Tavolo 3. Il tavolo
sparisce in silenzio, e la prenotazione di Rossi resta appesa: si vede **senza tavolo e senza il
pulsante «Togli tavolo»**, cioè senza nessuna via d'uscita da interfaccia.

**Cosa deve succedere:** come per la sala — prima di eliminare, un avviso che dice **quante
prenotazioni** sono coinvolte e cosa succederà; solo dopo conferma esplicita il tavolo viene
disattivato e le prenotazioni tornano nel cassetto «da assegnare».

**Come:**
- Aggiungi in `useServizioTables.ts` un hook di conteggio sul modello di `useRoomLiveBookings`
  (`useRooms.ts:64-108`) — chiamalo `useTableLiveBookings`, stessa forma, filtrato su un solo
  `table_id`, `checked_out_at IS NULL`.
- In `useDeleteTable`: **prima** cancella fisicamente le righe attive di quel tavolo (S-2), **poi**
  `active: false`. Non chiamare `markBookingServedIfFullyReleased`: la prenotazione non è stata
  servita, non va archiviata.
- Nella UI: conferma con impatto quantificato, copiando tono e struttura di
  `RoomConfigModal.tsx:176-179`. Se il tavolo è **libero**, il flusso resta identico a oggi: nessun
  avviso in più, nessun click in più.

**Criteri di accettazione**
- Tavolo **libero** → invariato.
- Tavolo **occupato** → avviso con il numero di prenotazioni coinvolte + conferma esplicita; dopo la
  conferma la prenotazione ricompare nel cassetto «da assegnare» ed è riassegnabile.
- **Nessun turno bruciato** dalla liberazione.
- **Tavolata su più tavoli:** eliminare un tavolo tocca **solo** le righe di quel tavolo; gli altri
  tavoli della tavolata restano assegnati e la prenotazione resta viva su di essi.
- Le righe già chiuse su quel tavolo restano intatte.

**Test:** unit su `useDeleteTable` (tavolo libero / occupato / tavolata) sul modello di
`useRooms.softDelete.test.tsx`, e component test sulla conferma UI.

### 4.3 — FIX C (era 0.3): un'unica validazione delle fasce · 🟠 alta

Oggi la stessa regola esiste in tre versioni: la completa (`validateSlotConfigs`, mai chiamata),
quella di Impostazioni (`RestaurantSettingsTab.tsx:95-112`, senza il nome duplicato) e quella di
Servizio (`ServiceSlotsManager.tsx:561-570`, solo la sovrapposizione).

**Da fare:** far convergere **entrambi** gli editor su `validateSlotConfigs`, che diventa l'unica fonte
di verità. Solo controllo lato app, **nessuna migrazione**.

**Attenzione al taglio:** `validateSlotConfigs` valida un **array**. L'editor di Servizio lavora su una
fascia alla volta: costruisci l'array «come sarebbe dopo il salvataggio» (le fasce esistenti con quella
in corso sostituita o aggiunta) e passa quello. Non duplicare la logica dentro il componente.

**Criteri di accettazione**
- In **entrambi** gli editor vengono rifiutati: formato orario non valido, inizio == fine, **nome
  duplicato** (confronto trim + case-insensitive), fasce sovrapposte.
- Le fasce che **scavallano la mezzanotte** (19:00-01:00) restano valide: `slotRangesOverlap` le
  gestisce già, non introdurre regressioni qui.
- I messaggi d'errore restano leggibili da un ristoratore. Se cambi il testo di un errore, **cerca i
  test che lo asseriscono** e aggiornali di proposito.

**Test:** estendi `serviceSlots.sovrapposizione.test.tsx` (o affianca un file nuovo) coprendo i tre
controlli nuovi **su entrambi** gli editor.

### 4.4 — FIX D (era 0.4): l'avviso di fine turno sopravvive al ricaricamento · 🟠 alta

**Cosa succede oggi:** compare «Tavolo a fine turno», il cameriere preme **«Ancora occupato»**, poi la
pagina si ricarica (F5, il tablet che si risveglia, un secondo dispositivo) → **l'avviso ritorna**.

**Cosa deve succedere:** la conferma vale per tutti i dispositivi e resiste al ricaricamento; se dopo
**30 minuti** il tavolo è ancora occupato, l'avviso torna **una volta**. Se lo staff riconferma, il
conto riparte da capo.

**Come:**
- Migrazione **`070`**: colonna `release_notice_handled_at timestamptz NULL` su
  `booking_table_assignments`, con `COMMENT ON COLUMN`. Guarda `068`/`069` per lo stile del repo, e
  verifica se servono GRANT/RLS aggiuntivi (è una colonna su tabella esistente, ma **controlla**, non
  assumere). Applica con `npm run db:apply`, poi rigenera i tipi con `npm run db:types:linked` e
  committa il diff dei tipi **nel working tree** (senza `git commit`).
- «Ancora occupato» timbra `release_notice_handled_at = now()` sulle righe attive di quel tavolo.
- Il calcolo dell'avviso (`AssignmentMapPanel.tsx:490-513`) esclude i tavoli la cui riga attiva ha un
  `release_notice_handled_at` **più recente di** 30 minuti fa; oltre quella finestra il tavolo rientra
  fra i notificabili.
- La manopola segue S-5. **Non** sepolire il 30 dentro il componente.
- Lo stato locale `handledReleaseTableIds` può restare come feedback immediato prima del refetch, ma la
  **verità** è la colonna: dopo un F5 il comportamento deve venire dal database.

**Criteri di accettazione**
- Premo «Ancora occupato» → ricarico → l'avviso **non** torna.
- Apro Servizio su un **secondo browser** → per quel tavolo l'avviso non c'è.
- Passati 30 minuti col tavolo ancora occupato → l'avviso torna **una volta**; se riconfermo, altri 30.
- **Cambio fascia o giorno** → gli avvisi si comportano come prima (`:352-357`). Coprilo con un test:
  è una voce di checklist mai verificata.
- «Decido dopo» invariato, per decisione S-4 — e documentato.

**Test:** component test sul nuovo filtro (con orologio finto: 29 minuti → niente avviso, 31 minuti →
avviso). Il test e2e `e2e/pro/pro-service-tables-lifecycle.spec.ts:177` (asserzione a `:240`) è nato
rosso per questo bug e **dovrebbe** diventare verde: **non** aggiungere il `test.fail()` previsto dal
piano, non serve più. Se riesci a far girare quella singola spec, fallo e riporta l'output vero; se
l'ambiente di staging non è disponibile, scrivi **NON VERIFICATO** e dillo nel report — **non**
dichiararlo verde per deduzione.

---

## 5. Gate di uscita

- `npm run validate` **verde** (lint + typecheck + test). Riporta il conteggio reale letto dall'output:
  la base di partenza è **1283 test su 156 file**.
- Nessun test disabilitato o `.skip` aggiunto per far passare il gate.
- Ogni criterio di accettazione delle §4.1-4.4 o **dimostrato da un test**, o marcato **NON VERIFICATO**.

## 6. Documentazione da aggiornare (solo questa, niente altro)

- `docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md` — una sezione nuova (§9.14) con i quattro
  comportamenti nuovi, la dottrina turni di S-1 e la nota S-4 su «Decido dopo».
- `docs/Servizio-Skill/MASTERPLAN_SERVIZIO.md` (o dove vive D48 — **cercalo**, non fidarti del
  percorso) — riscrittura di **D48** secondo S-1.
- `docs/FOLLOW_UP.md` — chiudi `FU-SERV-DELETE-TABLE-1`, `FU-SERV-TURN-MOVE-1`,
  `FU-SERV-SLOT-VALIDATION-1`, `FU-SERV-RELEASE-NOTICE-1` citando cosa è stato fatto.
- `docs/DATABASE.md` — aggiungi la **070**. Già che ci sei aggiungi anche **068** e **069**, che
  mancano (l'audit lo ha verificato). **Fermati lì**: le altre migrazioni mancanti sono Fase 3.
- `docs/Sessioni di lavoro/03-08-26/COLLAUDO_S4_CHECKLIST.md` — se contiene voci coperte dai tuoi test
  nuovi, **spuntale citando il test**. È l'attrito numero uno di questo cantiere: non rimandarlo.

## 7. Report finale

Scrivi `docs/Sessioni di lavoro/03-08-26/Report-fase0-quattro-fix-03-08-26.md` con:

1. **Cappello per Matteo** — cosa cambia **per schermate e flussi concreti** («apri Servizio, elimini
   il tavolo, ora compare…»), mai per nomi di file isolati. Non è tecnico: breve, in italiano.
2. **Per ogni fix:** cosa hai cambiato, in quali file/righe, e **come lo hai dimostrato** (nome del
   test, o comando eseguito, o NON VERIFICATO).
3. **Numeri veri** letti dall'output: test totali prima/dopo, esito di validate, esito della migrazione.
4. **Cosa NON hai fatto** e perché. Vietato «tutto ok» a vuoto.
5. **Dubbi e sorprese:** qualsiasi punto in cui il codice non corrispondeva a quanto scritto qui sopra.
   Se trovi che un fatto della §2 è **sbagliato**, scrivilo forte: è l'informazione più preziosa che
   puoi riportarmi.
6. **Voci per la Fase 3** che hai incontrato strada facendo (compresa la divergenza S-3).

**Poi fermati.** Non committare, non pushare, non aprire altri cantieri. Il senior rilegge il diff.
