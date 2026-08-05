# Report — i rossi della batteria, il parallelismo, la mezzanotte e la Fase 3 (05-08-2026 sera)

> Branch `env/test`. **Nessuna modifica a `src/`**, nessuna migrazione, nessuna scrittura su PROD.
> Il lavoro vive in `playwright.config.ts` e in otto file di documentazione. **Nessun commit, nessun
> push.**
>
> Metodo: nessun agente. Tutte le run Playwright eseguite da me, una alla volta, con gli artefatti
> salvati **prima** di rilanciare (`--output=<cartella diversa per giro>`), perché Playwright svuota
> `test-results/` a ogni run — è l'errore di metodo dichiarato dalla sessione precedente.
>
> Mandato di partenza: [PROMPT_PROSSIMO_SENIOR.md](PROMPT_PROSSIMO_SENIOR.md) punti 1-4 ·
> Piano: [PIANO_SENIOR_TEST_E_SALUTE_CODICE.md](../03-08-26/PIANO_SENIOR_TEST_E_SALUTE_CODICE.md) §5.

---

## 1. Cappello per Matteo

**I quattro debiti che mi erano stati passati sono chiusi. Ma il primo si è rivelato una cosa diversa
da come era stato archiviato, e sotto c'erano due difetti veri.**

- **«I tre rossi erano rossi finti, dovuti ai test che si pestano i piedi.»** Non è così. Ho
  rilanciato tutta la batteria e ne è rimasto **uno** rosso, in un test che ieri era verde. Allora ho
  preso quel test e l'ho fatto girare **da solo, nove volte**: è fallito **una volta su nove**. Da
  solo, senza nessun altro test intorno. Quindi non è contesa fra test: è un difetto vero che si
  presenta circa una volta su dieci, e la sessione scorsa era stato assolto solo perché «rilanciato
  da solo passava» — con una cosa che fallisce al 10%, passare una volta non dimostra niente.
- **Sotto ci sono due difetti diversi, ed entrambi sono dell'app, non dei test.**
  1. **La pagina di prenotazione può entrare in un giro a vuoto.** Quando il cliente sceglie la
     tipologia e poi una **sotto-scheda** (la striscia di card che compare quando ne hai configurate
     due o più), la pagina può mettersi a ricalcolarsi all'infinito finché il browser non la ferma.
     L'effetto per Anna che prenota: la pagina scalda il telefono e può impuntarsi mentre sceglie
     l'orario. **Non succede oggi sui tuoi due locali di prova** perché nessuno dei due ha due
     sotto-schede configurate — ma è una configurazione che l'app permette, quindi un tuo cliente
     può arrivarci.
  2. **Un singolo intoppo di rete butta fuori l'admin.** Ogni volta che cambi pagina nel gestionale
     l'app rifà quattro domande al server per riconoscerti. Se **una sola** di quelle quattro non
     risponde — anche solo per un attimo di rete storta — l'app ti fa **uscire** e ti rimanda al
     login, senza riprovare nemmeno una volta. È una scelta di sicurezza presa a giugno, ma senza
     nessun tentativo di recupero: nel test è successo davvero.
- **Sul parallelismo ho deciso: si va a un test alla volta, e ora è scritto nella configurazione.**
  Non è prudenza generica. Il motivo che ha chiuso la questione è che il form pubblico blocca l'IP
  per **24 ore** dopo sei invii in dieci minuti, e la protezione che abbiamo messo contro quel
  blocco **non regge in parallelo**: due test che partono insieme leggono «c'è posto» insieme e
  inviano insieme. Il rischio non era qualche rosso in più, era **restare senza macchina per un
  giorno**. Costo della scelta: la batteria intera dura 7 minuti.
- **La prova «a cavallo della mezzanotte» è fatta, col browser, e non ho dovuto aspettare la notte.**
  Ho spostato il fuso orario del computer su Kabul (là erano le 23:38) e poi su Karachi (le 00:07):
  sono esattamente le due ore in cui prima il test si rompeva. **13 test su 13 verdi in entrambe.**
- **Una cosa legale che non c'entrava col mandato e che devi sapere.** Il registro dei fornitori che
  trattano i dati dei tuoi clienti dice ancora che **non esiste nessun servizio di invio email**.
  Ma Brevo manda email dalla produzione **da metà giugno**. Va sistemato: serve il contratto con
  Brevo e la riga nel registro pubblico. Dettaglio in §6.

**Serve una tua decisione?** Sì, tre — tutte in **§8**, nessuna blocca il lavoro.

---

## 2. I rossi della batteria — misurati, non ereditati

### 2.1 La batteria completa, oggi

`npx playwright test --workers=1 --output=<cartella salvata> --trace=retain-on-failure`

| | Sessione 05-08 mattina (ereditato) | **Questa run** |
|---|---|---|
| Totale | 116 | **117** |
| Verdi | 113 | **116** |
| Rossi | 3 | **1** |
| Durata | 6,9 min | **7,0 min** |

I due rossi di `admin-settings-blindatura.spec.ts` (`:156` e `:184`, tablet-900) **non si sono
ripresentati**. Il terzo, `admin-menu-magazzino-blindatura.spec.ts:326`, è rosso di nuovo — ma **a un
viewport diverso** (mobile-375 stavolta, tablet-834 la volta scorsa, desktop-1280 in una prova
successiva). Il viewport non c'entra: è la stessa prova che cade a caso.

### 2.2 L'ipotesi ereditata è smentita

> *«Ipotesi da verificare: spec diverse che entrano con lo stesso account admin in sequenza si
> invalidano la sessione a vicenda.»* — mandato, punto 1.

**Falsa.** Riproduzione: `admin-menu-magazzino-blindatura.spec.ts` **da solo**, 3 run × 3 viewport =
**9 esecuzioni, 1 rossa** (~11%). Nessun'altra spec in esecuzione, un solo worker, quindi nessuna
sessione condivisa con nessuno.

Il vero motivo per cui la sessione scorsa aveva concluso «interazione fra spec» è metodologico, ed è
la lezione che ho scritto in `TESTING_SKILL.md`: **una spec che fallisce al 10% è verde da sola quasi
sempre.** «Rilanciala da sola» è un primo filtro utile ma **non assolve**: serve rilanciarla N volte
e contare.

### 2.3 Due difetti distinti dietro la stessa asserzione

Il test finisce con `expect(browserErrors, 'errori console/browser').toEqual([])`
(`admin-menu-magazzino-blindatura.spec.ts:475`) — una rete a strascico che raccoglie qualunque errore
la pagina abbia loggato. Nei due fallimenti che ho catturato ha preso **due cose diverse**:

**A) Giro di render infinito sul form pubblico** *(artefatto della run completa, salvato)*

```
Warning: Maximum update depth exceeded…
  at ArrivalSlotsBridge (src/features/booking/components/BookingRequestForm.tsx:90:3)
  at BookingRequestForm  (…:419:3)
  at BookingRequestPageContent (src/pages/BookingRequestPage.tsx:151:38)
```

> ⚠️ **I numeri di riga qui sopra sono quelli dello stack del browser, cioè del sorgente trasformato
> da Vite: NON corrispondono al file.** Verificato: `ArrivalSlotsBridge` è definita a
> **`BookingRequestForm.tsx:101`**, non `:90`. Ho lasciato la traccia verbatim perché è la prova, ma
> le righe vere sono quelle che cito sotto.

Il test passa da `/prenota/da-tommaso` (`admin-menu-magazzino-blindatura.spec.ts:162`) e lì clicca
**tipologia → sotto-scheda** (`selectPublicBookingMenuMode`, `:161-180`).

Cosa ho verificato e cosa **no**, per non spacciare un'ipotesi per una diagnosi:
- ✅ **Verificato**: con una sonda isolata che apre solo `/prenota/` e aspetta 6 secondi →
  **0 loop su 6 giri** a 375px, sia `da-tommaso` sia `test-classic`.
- ✅ **Verificato**: con una sonda che clicca anche **tipologia** → **0 loop su 9 giri**. Su nessuno
  dei due locali è mai comparsa la striscia sotto-schede: nella configurazione attuale **non ce ne
  sono due**, e il commento della spec dice esplicitamente che il seed «monta due sotto-schede
  apposta … la striscia di card esiste solo da 2 in su» (`:172-174`).
- ⚠️ **NON verificato**: il meccanismo esatto del loop. L'indiziato più probabile è la catena
  `useArrivalSlots.ts:70` → `rawSlots = configQuery.data ?? []` (**nuovo array a ogni render** quando
  il dato non c'è) → `slots` useMemo → `groups` useMemo (`BookingRequestForm.tsx:109-113`) →
  `useEffect` che chiama `onChange` a ogni render (`:114-115`), combinata col cambio di
  `durationMinutes` quando selezioni la sotto-scheda, che **ri-chiave la query capacità**
  (`useArrivalSlots.ts:76`) e riporta i dati a «non ancora caricati». **Non l'ho dimostrato** e non
  ho toccato `src/`: serve seminare la configurazione a due sotto-schede e strumentare.

**B) L'admin viene buttato fuori dopo una singola RPC fallita** *(artefatto della riproduzione isolata, salvato)*

```
[checkSession] risoluzione tenant admin fallita: signOut di sicurezza
```

Origine: `src/contexts/AdminAuthContext.tsx:119-124`. `checkSession` gira **a ogni cambio di
percorso** (`:141-143`) e fa **quattro round-trip in fila** — `getSession` (`:69`), lettura
`admin_users` (`:88`), `ensureActiveSubscription` (`:104`), RPC `check_admin_email` via
`setTenantFromAdmin` (`:117`). Se **una qualsiasi** fallisce → `signOut` immediato, **zero
tentativi di recupero**.

È la regola **FU-AUTH-3** («mai lasciare un admin loggato con tenant nullo»,
`TenantContext.tsx:20-22`) applicata alla lettera. Il principio è giusto; quello che manca è la
distinzione fra «questo utente non è un admin» (→ signOut, corretto) e «il server non ha risposto in
questo istante» (→ oggi anche qui signOut). **Proposta in §8, decisione tua: non ho toccato un
percorso di sicurezza di mia iniziativa.**

---

## 3. Parallelismo Playwright — deciso e scritto

`playwright.config.ts`: `workers: process.env.CI ? 1 : undefined` → **`workers: Number(process.env.E2E_WORKERS) || 1`**.
Verificato eseguendo: `npx playwright test e2e/pro/pro-login.spec.ts` → *«Running 3 tests using 1
worker»* **senza passare nessun flag**. 3/3 verde.

Le tre ragioni sono nel commento sopra la riga, così non si riaprono a memoria:

1. **Contesa misurata** (04-08, stesso commit): 12 worker → 51 verdi / 31 rossi; 1 worker → 71/12.
   Due terzi dei rossi erano finti, e sono costati tre sessioni di indagine.
2. **L'isolamento non esiste a livello di dati**: **17 spec su 25** lavorano sullo stesso tenant TEST
   (`da-tommaso`) con lo stesso account admin (`E2E_ADMIN_EMAIL` = `E2E_PRO_ADMIN_EMAIL` =
   `tomas@t.com`), scrivendosi addosso `restaurant_settings`, menù e assegnazioni.
3. **Il motivo che chiude la discussione** — `waitForCreateBookingRateLimitWindow()`
   (`e2e/helpers/supabaseStaging.ts`) è un **controlla-poi-agisci**: legge `rate_limits`, e *poi* la
   spec invia. In parallelo due worker leggono «c'è posto» insieme e inviano insieme → 429 → e **6
   richieste in 10 minuti mettono l'IP in `ip_blacklist` per 24 ore**. Il messaggio d'errore della
   funzione lo ammette già («Qualcun altro sta lanciando spec sul form pubblico»).

**Per questo non ho misurato una run a 2-4 worker**: l'esperimento avrebbe avuto come esito negativo
plausibile una macchina ferma per un giorno. È un prezzo che non è mio da pagare.

Il cancello per riaprire la scelta è scritto: **prima l'isolamento per-tenant delle spec**, poi si
alza. `E2E_WORKERS` resta come manopola per esperimenti consapevoli.

---

## 4. La prova a cavallo della mezzanotte — fatta col browser

L'eredità del 04-08 diceva: c'è la prova unitaria (`tests/wallClockAnchor.test.ts`, che finge
`realNow` a 23:50 e 00:30), **manca quella col browser**. Il commento del modulo diceva che non si
poteva fare, «l'orario reale della macchina non è pilotabile da qui».

**Si può: si sposta il fuso del processo.** `safeAnchorNow()` legge l'ora **locale di Node**, quindi
basta far vivere Node in una zona la cui ora locale cada nella finestra cieca (23:25 → 01:40). Serve
però che **anche il browser** stia in quel fuso: su Windows Chromium legge il fuso dal sistema
operativo, non da `TZ`. Ho aggiunto per questo `use.timezoneId: process.env.E2E_TIMEZONE || undefined`
in `playwright.config.ts` — **inerte** quando la variabile non c'è.

**Prima ho verificato che la finestra fosse davvero quella** (altrimenti la run non dimostra niente).
A 23:38 di Kabul, con le stesse funzioni dello scenario:

| | inizio | fine | inizio < fine? |
|---|---|---|---|
| **Ancora PRE-fix** (`NOW = new Date()`) | `2026-08-05T23:43` | `2026-08-05T00:04` | ❌ **no** — la fine scavalca la mezzanotte e finisce prima dell'inizio |
| **Ancora POST-fix** (`safeAnchorNow()`) | `2026-08-04T12:05` | `2026-08-04T12:26` | ✅ sì, e l'ancora resta nel passato (vincolo JWT) |

Poi le run vere, `pro-service-tables-lifecycle.spec.ts` intero:

| Fuso | Ora locale del processo | Finestra | Esito |
|---|---|---|---|
| `Asia/Kabul` | ~23:38 | pre-mezzanotte | **13/13 verde** (56,9 s) |
| `Asia/Karachi` | ~00:07 | post-mezzanotte | **13/13 verde** (54,3 s) |

Il test «Stati del tavolo in sequenza» (`:1153`) — quello che di notte cadeva — è verde in entrambe.
Ricetta riproducibile scritta in `TESTING_SKILL.md` §3.

---

## 5. Fase 3 — analisi strutturale, sei fronti

### Fronte 1 — Divergenze skill/codice · **6 confermate, tutte sanate**

Tutte riverificate aprendo i file, non riportate dall'audit:

| # | Dove | Cosa diceva | Realtà | Stato |
|---|---|---|---|---|
| 1 | `docs/DATABASE.md` registro | salta da `048` a `057–058` | mancano **`049`→`056`** (8 migrazioni: ordine QR, template ed email campagne, consenso marketing, consenso alimentare, unsubscribe, note admin) | ✅ 8 righe aggiunte |
| 2 | `ADMIN_SHELL_PAGES_CONTEXT.md:189` | «Sale … **nessuna tabella separata**» | tabella `rooms` dalla mig. `008`, letta da `useRooms.ts:42` | ✅ corretto |
| 3 | `ADMIN_SHELL_PAGES_CONTEXT.md:348-349` | «non esiste ancora RPC transazionale dedicata» per il walk-in | esiste dal 03-08: `create_walk_in_with_assignment` (mig. `069`) | ✅ corretto |
| 4 | `ADMIN_SHELL_PAGES_CONTEXT.md:191` | «`useDeleteTable()` imposta `active = false`» | dalla Fase 0 **prima cancella le assegnazioni attive**, poi disattiva | ✅ corretto |
| 5 | `LEGAL_STATE_CONTEXT.md:103-105` | «l'email provider `send-email` **non esiste ancora**» | **Brevo attivo in PROD dal 15-06** (`send-email` v6) + Edge `unsubscribe` v1 | ✅ corretto — ⚠️ **con una conseguenza legale, §6** |
| 6 | `DB_SCHEMA_CONTEXT.md:265` · `ADMIN_DATA_FLOW_CONTEXT.md:40` · `ADMIN_PRENOTAZIONI_CONTEXT.md:141,173` | `daily_guest_limit` come limite vivo | **rimosso il 18-06-26**; zero occorrenze in `src/` | ✅ corretti tutti e quattro |

Le divergenze `068`/`069` che l'audit segnalava su `DATABASE.md` erano **già state sanate** dalle
sessioni precedenti: verificato, ci sono.

### Fronte 2 — Duplicazioni logiche e codice morto · **il caso `validateSlotConfigs` ha tre fratelli**

Censimento meccanico su tutte le `export` di `src/**/utils/`, poi verificato uno per uno con `grep`
sull'intero `src`:

**Vive solo nei suoi test — il pattern esatto di `validateSlotConfigs` prima della Fase 0:**

| Funzione | Dove | Chiamate dall'app | Asserzioni nei test |
|---|---|---|---|
| `calculateDailyCapacityV2` | `capacityCalculator.ts:80` | **0** | 11, su 2 file |
| `getStartSlotForBookingV2` | `capacityCalculator.ts:66` | **0** | 8 |
| `isValidName` | `validation.ts:28` | **0** | 8 |

Sono **~27 asserzioni verdi che non verificano niente di ciò che l'app esegue**, e contano dentro i
«1346 test verdi». Le prime due non sono un caso: sono il calcolatore del **cap giornaliero**, cioè
il residuo del modello `daily_guest_limit` rimosso il 18-06 — la funzione è rimasta, i suoi test
pure, e la loro presenza fa sembrare coperta un'area che non esiste più.

**Morta del tutto** (definita, mai chiamata da nessuno, nemmeno dai test): `getShiftForTimestamp`
(`shifts.ts:59`).

**Esportate ma usate solo dentro il proprio file** (non un difetto, solo superficie inutile):
`transformBookingToCalendarEvent`, `showBookingPublicFormErrorToast`, `isBookingInSlot`.

> **Non ho cancellato niente.** Togliere codice e test è una potatura che va fatta con te sveglio,
> non a fine sessione: è §8 domanda 3.

### Fronte 3 — Scritture non atomiche · **8 sequenze censite**

Ricerca meccanica: corpi di `mutationFn` con **2+ scritture Supabase e nessuna `.rpc()`**.

| Hook | Dove | Scritture | Cosa resta a metà se si rompe |
|---|---|---|---|
| `useForceReplaceBookingOnTable` | `useTableAssignments.ts:489` | **5** (insert, delete, update, delete, insert) | la peggiore: sostituzione guidata su un tavolo occupato |
| *(menu QR)* | `useMenuQrCodes.ts:91` | 4 | QR aggiornato a metà |
| `useUpdateCustomer` | `useCustomerMutations.ts:119` | 3 | |
| `useDeleteTable` | `useServizioTables.ts:193` | 2 (delete assegnazioni → update tavolo) | ⚠️ **introdotta dalla Fase 0**: se la disattivazione fallisce dopo la cancellazione, le prenotazioni restano libere e il tavolo attivo |
| `useDeleteRoom` | `useRooms.ts:188` | 2 | |
| `useMenuCategories` | `:167` e `:344` | 2 + 2 | |
| `useCustomerMutations` | `:241` | 2 | |

Il precedente c'è già ed è buono: la mig. `069` ha chiuso il walk-in con una RPC transazionale. Le
altre sette non sono state toccate — **candidate per il prossimo giro**, in ordine di danno.

### Fronte 4 — Stati React che dovrebbero sopravvivere al reload · **chiuso**

`handledReleaseTableIds` è ora persistito a DB (mig. `070`, `release_notice_handled_at`).
`dismissedReleaseSignature` («Decido dopo», `AssignmentMapPanel.tsx:339`) è **ancora locale**, ma
**deliberatamente**: la scelta è motivata nel report di Fase 0 §S-4 ed è un «non adesso» sulla vista
corrente, non una conferma. Nessun altro caso trovato.

### Fronte 5 — Masterplan contro codice: `max_turns` · **risolto, D41 riscritta**

`max_turns` fa **due mestieri** (`tableTurnLimits.ts:40-66`): `0` = servizio chiuso, `>0` = contatore
turni per tavolo/fascia/data. `MASTERPLAN_SERVIZIO.md` D41 (giugno) prescriveva l'**opposto** («il
nuovo motore deve ignorarlo come contatore turni») e non era mai stata revisionata.

**Ho riscritto D41 registrando ciò che è stato rilasciato** — stesso trattamento dato a D48 in
Fase 0. Il contatore non è un residuo: è la funzione che regge il badge «Turni esauriti» e il
pulsante «Assegna comunque» con audit (mig. `065`), coperti a browser dalla Fase 2 riga 6. La nota
dice esplicitamente cosa comporterebbe decidere il contrario (§8 domanda 2).

### Fronte 6 — Salute misurabile

| Misura | Valore | Confronto |
|---|---|---|
| `npm run validate` | **verde** — 162 file, **1346 test** | invariato rispetto al 05-08 mattina |
| Batteria e2e (`--workers=1`) | **117 test, 116 verdi, 1 rosso, 7,0 min** | da 116/113/3 |
| Rosso residuo | `admin-menu-magazzino-blindatura:326` | intermittente ~11%, **causa dell'app**, §2.3 |
| `npm run validate:docs` | non rieseguito | debito storico noto: 14 path rotti in `docs/Console-Skill/` |

---

## 6. Una cosa fuori mandato che non potevo lasciare lì

`LEGAL_STATE_CONTEXT.md` è il registro dei **sub-processor**: chi tratta i dati dei clienti finali.
Diceva, riga 103: «(Email provider applicativo) — Invio email transazionali ai clienti finali —
**NON CONFIGURATO ANCORA**», e riga 105 ripeteva che `send-email` «non esiste ancora».

**È falso da metà giugno.** `send-email` è deployata su PROD (`rwuxgvld`, v6) con i secret Brevo, e
dal 19-06 c'è anche l'Edge pubblica `unsubscribe` v1 con la tabella `unsubscribe_tokens` (mig.
`055`). Le campagne CRM sono una funzione **attiva in produzione**, come ricorda il report di ieri.

Ho corretto la tabella e scritto la conseguenza a chiare lettere: **un sub-processor sta trattando
dati di clienti finali in produzione mentre il registro lo dava per inesistente.** Da chiudere: DPA
con Brevo, riga nel file sub-processor pubblico, allineamento della Privacy Policy. **Non è lavoro
da agente** — è §8 domanda 1.

---

## 7. Stato dei file

| File | Stato |
|---|---|
| `playwright.config.ts` | `workers` a **1** con le tre ragioni misurate nel commento; nuovo `use.timezoneId` da `E2E_TIMEZONE` (inerte se non impostata). Verificato eseguendo |
| `docs/Testing-Skill/TESTING_SKILL.md` | §3 riscritta: decisione worker; **«da sola è verde» non assolve** (col dato 1/9); asserzioni «zero errori di console» sono reti a strascico; nuova sotto-sezione con la **ricetta del fuso** per provare gli scenari a orologio |
| `docs/DATABASE.md` | 8 righe di registro nuove (`049`→`056`) + nota sulla `058` |
| `docs/Admin-Skill/contesto/ADMIN_SHELL_PAGES_CONTEXT.md` | sale = tabella `rooms`; walk-in = RPC `069`; `useDeleteTable` aggiornata alla Fase 0 |
| `docs/Legal-Production-Skill/LEGAL_STATE_CONTEXT.md` | riga Brevo al posto di «non configurato», con la conseguenza legale scritta (§6) |
| `docs/Database-Skill/DB_SCHEMA_CONTEXT.md` · `Admin-Skill/contesto/ADMIN_DATA_FLOW_CONTEXT.md` · `ADMIN_PRENOTAZIONI_CONTEXT.md` | `daily_guest_limit` sostituito dal modello per-fascia (4 punti) |
| `docs/MASTERPLAN_SERVIZIO.md` | **D41 riscritta** (Fronte 5) |
| `docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md` | **nuova mappa spec → locale → account** (era la proposta di R5 attrito 3: l'ho applicata invece di lasciarla proposta) |
| `docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md` | voce di registro coi cinque metodi di questa sessione |
| `_skill-system-v0/aree/TESTING_SKILL.md.template` | **propagazione strutturale**: «verde da solo NON assolve, conta le ripetizioni» · asserzioni console = reti a strascico · nuova sezione «il parallelismo è una decisione, non un default» (coi tre dati che la decidono, incluso il costo asimmetrico delle difese anti-abuso) · nuova sezione «provare il codice che dipende dall'ora del giorno» |
| `_skill-system-v0/comunicazione/EVOLUZIONE_SKILLS.md` | **Playbook §11 nuovo** — «Una premessa ereditata non è un fatto». Promosso perché la soglia ≥2 occorrenze eseguite è stata raggiunta (`validateSlotConfigs` il 03-08, i «rossi da contesa» oggi) |

> ⚠️ **Nota di fatto sul template v.0:** il promemoria di chiusura lo dà per gitignored e dice di non
> committarlo. **In questo repo non lo è** — `git check-ignore` non lo esclude, ed entrambi i file
> `_skill-system-v0/` compaiono in `git status`. Stessa cosa notata dalla sessione precedente. Chi
> prepara i commit decida **consapevolmente**, non per inerzia.

**Zero modifiche a `src/`.** I due difetti di §2.3 stanno in `src/` e li ho lasciati lì apposta:
uno non è ancora diagnosticato fino in fondo, l'altro tocca un percorso di sicurezza.

---

## 8. Domande per Matteo — ✅ **TUTTE E TRE RISPOSTE il 05-08 sera**

> **Risposte di Matteo:** (1) allineare la documentazione interna al fatto che l'app manda email ai
> clienti, «pronta e allineata alle decisioni di prodotto per essere poi letta e **chiusa con un
> legale**» · (2) **2 tentativi** di recupero prima del logout (con richiesta del mio parere fra 1 e
> 2: confermo **2**, ma la parte che conta è *cosa* si ritenta — mai una risposta negativa esplicita
> del server) · (3) **cancellare** il codice morto. In più ha chiesto di **correggere entrambi i
> difetti** di §2.3, non solo di segnalarli.
>
> ➡️ Mandato scritto in [PROMPT_FIX_LOOP_LOGOUT_LEGALE_CODICE_MORTO.md](PROMPT_FIX_LOOP_LOGOUT_LEGALE_CODICE_MORTO.md).
> Il testo originale delle domande resta qui sotto per memoria.

1. **Brevo e il registro legale (§6).** Un fornitore che manda email ai tuoi clienti è in produzione
   da metà giugno senza comparire nel registro dei sub-processor. Vuoi che apra un follow-up
   tracciato (DPA Brevo + riga nel file pubblico + Privacy Policy), o è roba che gestisci fuori dal
   repo?
2. **L'admin buttato fuori al primo intoppo (§2.3 B).** Proposta: distinguere «non sei un admin» (→
   esci, giusto così) da «il server non ha risposto adesso» (→ **un** nuovo tentativo dopo un
   secondo, e solo se fallisce anche quello, esci). Non cambia la regola di sicurezza FU-AUTH-3,
   toglie il logout per un pacchetto perso. **Tocco `AdminAuthContext` solo se dici sì.**
3. **La potatura del codice morto (Fronte 2).** Ci sono tre funzioni che nessuna schermata usa più —
   fra cui il calcolatore del cap **giornaliero**, che avevi abolito il 18-06 — con ~27 test che
   fanno numero senza verificare niente. Le cancello (funzioni + test) o le lascio?

E una **non-domanda**, che segnalo perché è la più importante e non richiede una tua risposta:
il giro di render della pagina Prenota (§2.3 A) **non si vede sui tuoi due locali** solo perché
nessuno dei due ha due sotto-schede. Se configuri due sotto-schede su un locale vero, quella strada
si apre. Prima di toccarla voglio riprodurla in modo deterministico, non a tentativi.

---

## 9. Cosa NON è stato fatto — dichiarato

1. **Il giro di render della pagina Prenota non è né diagnosticato fino in fondo né corretto.** Ho
   ristretto il campo con due sonde (§2.3 A) e ho scritto quale catena sospetto, marcandola **NON
   VERIFICATA**. Serve seminare la configurazione a due sotto-schede e strumentare i render.
2. **Il logout dell'admin al primo errore non è corretto**: è §8 domanda 2, tocca la sicurezza.
3. **Le sette scritture non atomiche restano tutte** (Fronte 3). Censite e ordinate per danno, non
   chiuse.
4. **`COLLAUDO_S4_CHECKLIST.md` è ancora a 4 spunte su 62.** È «l'attrito numero uno» del piano
   (§8 punto 5) e questo giro **non l'ho ridotto**: mapparne 58 voci sui test che le coprono è un
   lavoro a sé, e farlo di fretta significherebbe spuntare cose non verificate — cioè esattamente il
   difetto che questa sessione ha passato la giornata a smontare. Lo dichiaro aperto invece di
   fingere.
5. **`validate:docs` non rieseguito**; **niente commit, niente push**; **PROD mai toccata** (la `071`
   resta solo su TEST, nel treno del rollout).
6. **Non ho misurato una run a 2-4 worker** — e non è una dimenticanza: §3 spiega perché
   l'esperimento aveva come esito plausibile 24 ore di macchina ferma.

---

## 10. Domande di chiusura

```
❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: **Un solo messaggio**, all'apertura (verbatim):

«leggi @docs/Sessioni di lavoro/03-08-26/PIANO_SENIOR_TEST_E_SALUTE_CODICE.md  e ultimi commit, e poi
il resto del contesto necessario per capire a che punto siamo nei lavori, e proseguire.
quando hai tutti gli elementi proseguiamo con il completamento del plan.»

Nessun'altra istruzione umana, nessuna autorizzazione a committare o pushare chiesta né data — e
infatti non è stato fatto. Gli unici altri messaggi ricevuti sono notifiche automatiche di fine
task in background: sono software, e le ho trattate come tali.

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Sì. Ogni numero di questo report l'ho letto io nell'output, non me l'ha riferito un agente
(non ho usato agenti).

- **117/116/1 in 7,0 min**: riga di riepilogo della run completa, log salvato.
- **1 rosso su 9**: contati sulle tre run × tre viewport della riproduzione isolata, log salvato.
- **13/13 verde × 2**: righe di riepilogo delle due run col fuso spostato.
- **162 file / 1346 test**: coda dell'output di `npm run validate` (uscita 0).
- **«Running 3 tests using 1 worker»**: prova che la modifica al config fa effetto senza flag.
- **Le due tracce d'errore** (§2.3 A e B) sono copiate dagli `error-context.md` dei due fallimenti,
  salvati **prima** di rilanciare in cartelle separate.
- **Il confronto pre/post-fix della mezzanotte**: ricalcolato in Node sotto `TZ=Asia/Kabul` con le
  stesse formule del modulo reale.
- **Righe e file delle divergenze** (§5 fronte 1): riaperti uno per uno; i numeri di riga nella
  tabella sono quelli **prima** delle mie correzioni.
- **Il censimento del codice morto**: prima con uno script grezzo che ha prodotto 41 candidati,
  **poi verificato uno per uno** con `grep` sull'intero `src` — e la verifica ha **ridotto** la lista
  a 3+1+3, perché lo script contava come «non usate» anche funzioni chiamate dentro il proprio file.
  Se avessi riportato l'output grezzo avrei scritto 41 falsi positivi.
- **`git status`** riletto **dopo** l'ultimo edit: **15 file modificati + 1 nuovo** (il report),
  **nessuno sotto `src/` né `supabase/`** — contato eseguendo, non a memoria: l'avevo scritto «9» e
  poi «14» prima che gli ultimi file esistessero.

⚠️ **Un errore mio, trovato al controllo di chiusura e corretto — lo riporto perché è esattamente il
difetto che questa sessione ha passato la giornata a smontare.** Avevo citato `ArrivalSlotsBridge` a
`BookingRequestForm.tsx:90` **prendendo il numero dallo stack del browser**. Quel numero è del
sorgente **trasformato da Vite**, non del file: la funzione è a **`:101`**. Stessa cosa per le due
righe vicine (`:110`/`:113-114` → **`:109-113`**/**`:114-115`**). Ho riaperto il file e corretto,
lasciando la traccia verbatim perché è la prova. **Morale:** un numero di riga che arrivi da un
runtime non è un numero di riga del sorgente finché non l'hai aperto.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: **Tredici**, ed è il grosso del lavoro di questa sessione — la Fase 3 fronte 1 **è**
l'allineamento. Elenco completo in §7. **Gli ultimi tre li ho allineati solo al controllo di
chiusura**, ed erano proprio le pratiche senior che si dimenticano a fine chat lunga: la
propagazione al **template v.0** (due file), la voce nel **registro di evoluzione**, e la mappa
spec→locale→account che avevo scritto come *proposta* in R5 invece di applicarla. Le catene che
contano:
- `playwright.config.ts` → `TESTING_SKILL.md` §3: la decisione sui worker vive in **entrambi**, e nel
  config c'è il *perché* misurato, così non si riapre a memoria fra sei settimane.
- la ricetta del fuso → `TESTING_SKILL.md` §3, non solo nel commento dello spec: serve a chiunque
  scriva e2e sul tempo, non solo a chi lavora su Servizio (era una proposta rimasta aperta nel piano
  §4).

Non toccati, con motivo: `src/types/database.ts` (nessuna migrazione nuova) · `FOLLOW_UP.md` (le tre
decisioni di §8 sono **aperte**, non chiuse: aprire follow-up per decisioni non prese sposterebbe il
debito senza risolverlo) · `COLLAUDO_S4_CHECKLIST.md` (dichiarato non fatto, §9 punto 4, invece di
spuntarlo di fretta).

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?
✅ R4: Sei cose, tutte in §9. Le due che pesano: **il giro di render della pagina Prenota è ristretto
ma non diagnosticato** (ho scritto la catena sospetta marcandola NON VERIFICATA, invece di
presentarla come causa: è esattamente l'errore che il piano mi diceva di non fare), e la
**checklist di collaudo resta a 4/62**, terza sessione di fila.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti?
✅ R5: **Attrito 1 — una conclusione ereditata, scritta con sicurezza, era sbagliata.** «I 3 rossi
sono da interazione fra spec, rieseguiti da soli sono verdi» era in tre documenti (report, piano,
prompt) e mi ha indirizzato a cercare sessioni admin che si invalidano a vicenda: un'ora spesa nella
direzione sbagliata. Proposta **già applicata** in `TESTING_SKILL.md`: la regola «rilancia da sola»
ora dice esplicitamente che è un **filtro, non un'assoluzione**, col numero (1 su 9) accanto.
Proposta che resta: quando un handoff riporta una **causa**, deve dire con quante ripetizioni è
stata stabilita — «verde da solo, 1 esecuzione» e «verde da solo, 10 esecuzioni» sono due
affermazioni diverse e oggi si scrivono uguali.
**Attrito 2 — il commento di un modulo diceva che una prova era impossibile, e non lo era.**
`wallClockAnchor.ts` dichiarava «non si può lanciare Playwright per dimostrare che il fix regge a
qualunque ora del giorno»: bastava spostare `TZ`. Un «impossibile» scritto in un commento diventa
vero per tutti quelli che lo leggono dopo. Proposta: scrivere «non l'ho fatto perché X» invece di
«non si può», che è una affermazione molto più forte e quasi sempre falsa.
**Attrito 3 — nessuna skill dice quale account e quale locale usa ciascuna spec.** L'ho dovuto
ricostruire io con un `grep` (ed è così che ho scoperto che `loginClassicAdmin` in
`admin-settings-blindatura.spec.ts` entra in realtà col Pro `tomas@t.com`, e che 17 spec su 25
condividono un solo locale — il fatto che ha deciso il parallelismo). Proposta **già applicata**:
tabella spec → locale → account in cima a `ADMIN_TEST_SUITE_INDEX.md` §1, con scritta accanto la
conseguenza operativa (è la ragione n. 2 del `workers: 1`). L'avevo lasciata come *proposta* nella
prima stesura: al controllo di chiusura mi sono accorto che avevo il dato già in mano e scriverlo
costava due minuti — **una proposta che puoi applicare tu non è una proposta, è un lavoro non
fatto.**

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: **Giusto per instradare, e stavolta anche pericoloso in un punto** — il materiale ereditato era
ottimo su *dove* guardare (il mandato in quattro punti è stato seguito nell'ordine dato), ma
conteneva una conclusione sbagliata presentata come quasi-fatto (R5, attrito 1). La contromisura che
ha funzionato è quella scritta nel piano stesso: **riprodurre prima di correggere**. Se avessi
accettato la diagnosi ereditata avrei «sistemato» un problema di sessioni condivise che non esiste, e
i due difetti veri sarebbero rimasti sotto.

Il promemoria periodico sulla lista dei task è stato **utile** questa volta, non rumore: il mandato
aveva quattro punti indipendenti più una Fase 3 a sei fronti, ed è il tipo di sessione in cui si
chiude bene il punto 1 e si dimentica il 3. L'ho aggiornata a ogni punto chiuso e ha retto.
```

## 11. Self-review del report

1. **Dati = diff reale:** sì, dettaglio in R2. L'unico numero non rimisurato è `validate:docs`, ed è
   dichiarato come tale in §5 fronte 6 invece di essere riportato dalla sessione precedente come se
   fosse mio.
2. **Separazione fra misurato e ipotizzato:** è la cosa a cui ho fatto più attenzione, perché è
   l'errore che questa sessione ha smontato. §2.3 A ha tre righe marcate ✅ ✅ ⚠️ e la terza dice
   **NON VERIFICATO** su quella che sarebbe stata la conclusione più comoda da scrivere.
3. **Ho smentito la sessione precedente su un punto centrale** (§2.2). Non è una critica al lavoro di
   ieri: la conclusione era ragionevole con i dati che aveva. È il motivo per cui la regola nuova
   parla di **quante volte** hai rilanciato, non di com'è andata.
4. **Tono utente:** §1 e §6 parlano per schermate e conseguenze (Anna che prenota, l'admin buttato
   fuori, il fornitore che manda email); §2-§5 e §9-§11 sono dati interni. §8 fa tre domande
   concrete, ognuna con la conseguenza pratica del sì e del no.
5. **Cosa un revisore potrebbe contestarmi:** di aver allargato il perimetro alla parte legale (§6),
   che non era nel mandato. Lo rivendico: l'ho trovata **dentro** il fronte 1 della Fase 3, che mi
   chiedeva proprio di verificare quella riga, e ho fatto la sola cosa che potevo fare da solo —
   correggere il registro e portartelo. Seconda contestazione possibile: aver riscritto D41 senza
   chiedere prima. Anche qui il piano lo prescriveva («va risolto in un senso o nell'altro»), e ho
   registrato **ciò che è già stato rilasciato e testato**, scrivendo nero su bianco cosa
   comporterebbe la decisione opposta.
