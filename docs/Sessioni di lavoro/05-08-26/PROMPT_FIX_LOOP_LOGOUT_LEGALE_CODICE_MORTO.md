# Prompt — i 4 lavori decisi da Matteo il 05-08-26 sera

> Scritto in modalità **prepara**: qui c'è solo il prompt, nessun codice eseguito.
> Nasce dalle risposte di Matteo alle tre domande di
> [Report-rossi-parallelismo-mezzanotte-fase3-05-08-26.md](Report-rossi-parallelismo-mezzanotte-fase3-05-08-26.md) §8.
>
> ⛔ Supera i due prompt precedenti di questa cartella e del 04-08: le Fasi 0-1-2-3 sono chiuse.

---

## A. Agente / profilo / modalità

**Profilo Esecuzione**, con supervisione senior. **Quattro lavori su file disgiunti** → si possono
dare a due agenti in parallelo senza collisioni, ma **le run Playwright le fa il senior**, mai
l'agente, e **un worker alla volta**.

| # | Lavoro | File toccati | Può girare in parallelo con |
|---|---|---|---|
| 1 | Giro a vuoto pagina Prenota | `useArrivalSlots.ts`, `BookingRequestForm.tsx` | 2, 3, 4 |
| 2 | Logout al primo intoppo | `AdminAuthContext.tsx` (+ `TenantContext.tsx` se serve) | 1, 3, 4 |
| 3 | Documentazione legale email | solo `docs/Legal-Production-Skill/*` + pagina privacy in app | 1, 2, 4 |
| 4 | Codice morto | `capacityCalculator.ts`, `validation.ts`, `shifts.ts` + 3 file di test | 1, 2, 3 |

⚠️ **Il lavoro 1 va per primo se c'è un solo agente**: è l'unico che non ha ancora una diagnosi, e
potrebbe rivelarsi più grande degli altri tre messi insieme.

---

## B. Il prompt

```
Sei l'agente che chiude quattro lavori decisi da Matteo sul progetto CalendarBackup-v2, branch
env/test. Tre sono correzioni, uno è allineamento di documentazione.

LETTURE OBBLIGATORIE, IN QUEST'ORDINE:
1. `docs/Sessioni di lavoro/05-08-26/Report-rossi-parallelismo-mezzanotte-fase3-05-08-26.md` — §2.3
   (i due difetti, con le righe vere), §5 fronte 2 (il censimento del codice morto), §6 (il buco
   legale). È lo stato di partenza.
2. `docs/APP_CONTEXT_SKILL.md` §0 → carica la skill dell'area che tocchi, PRIMA di aprire i file.
3. `docs/Testing-Skill/TESTING_SKILL.md` §3 e §5 — sei trappole già pagate, fra cui: il form
   pubblico ha un limite di 3 invii al minuto per IP (6 in 10 minuti = IP bloccato 24 ORE), «verde
   da solo» non assolve una spec, e nessuna asserzione dentro un `if`.

FATTI GIÀ VERIFICATI — NON RI-DERIVARLI (li ho misurati io, con file:riga aperti):
- La batteria e2e oggi: 117 test, 116 verdi, 1 rosso, 7,0 minuti, `--workers=1`.
  `npm run validate` verde: 162 file, 1346 test.
- `playwright.config.ts` è già fissato a `workers: 1`: NON rimetterlo a `undefined`, e non passare
  `--workers=N`. Le tre ragioni misurate sono nel commento sopra quella riga.
- Il rosso residuo è `admin-menu-magazzino-blindatura.spec.ts:326`, che fallisce ~1 volta su 9
  ANCHE eseguito da solo. La sua asserzione finale è `expect(browserErrors).toEqual([])` (riga 475):
  una rete a strascico che ha già preso DUE errori diversi in due fallimenti distinti — sono i
  lavori 1 e 2 qui sotto. Chiudendoli, quel test smette di lampeggiare.

REGOLE NON NEGOZIABILI:
- Mai commit o push senza richiesta esplicita di Matteo.
- Mai scritture su PROD. TEST = `docnnernvp`, PROD = `rwuxgvld`: prima di qualsiasi operazione MCP
  fai `get_project_url`. Su TEST le migrazioni solo con `npm run db:apply`;
  `supabase db push --include-all` vietato per sempre. **Nessuno di questi 4 lavori richiede una
  migrazione**: se ti convinci del contrario, fermati e chiedi.
- Il repo NON ha prettier: mai `npx prettier --write` (riscrive tutto in doppi apici con punto e
  virgola). Lo stile è single-quote / no-semi, garantito da ESLint.
- Non lanciare Playwright: le run e2e le fa il senior. Tu esegui `npm run validate` e i test unit
  mirati.
- Alla fine consegna a Matteo, in italiano semplice e senza sigle, la **checklist di cosa
  controllare in app**: lui verifica a mano, non legge i file.

────────────────────────────────────────────────────────────────────────
LAVORO 1 — La pagina di prenotazione entra in un giro a vuoto
────────────────────────────────────────────────────────────────────────
COSA VEDE IL CLIENTE: Anna apre la pagina Prenota, sceglie la tipologia e poi una **sotto-scheda**
(la striscia di card che compare solo quando il locale ne ha configurate DUE O PIÙ). Da lì la pagina
si rimette a ricalcolarsi all'infinito finché il browser non la ferma: telefono che scalda, pagina
che può impuntarsi mentre sceglie l'orario.

PROVA RACCOLTA (dallo stack del browser, catturato in una run reale):
  Warning: Maximum update depth exceeded…
    at ArrivalSlotsBridge (BookingRequestForm.tsx:90:3)
⚠️ Quel `:90` è la riga del sorgente TRASFORMATO da Vite, non del file. Nel file la funzione è a
   `src/features/booking/components/BookingRequestForm.tsx:101`. Verificato.

COSA È GIÀ STATO ESCLUSO (non rifarlo):
- Aprire `/prenota/` e basta → 0 loop su 6 giri.
- Aprire e cliccare la tipologia → 0 loop su 9 giri.
- Su `da-tommaso` e `test-classic` la striscia sotto-schede NON compare mai: **nessuno dei due
  locali ha 2 sotto-schede**. Per questo il difetto non si vede nell'uso normale di TEST.

CATENA SOSPETTATA — ⚠️ **IPOTESI NON VERIFICATA, NON TRATTARLA COME DIAGNOSI**:
  `useArrivalSlots.ts:70` → `const rawSlots = configQuery.data ?? []` crea un **array nuovo a ogni
  render** quando il dato non c'è → invalida la useMemo `slots` → invalida `groups`
  (`BookingRequestForm.tsx:109-113`) → fa ripartire la `useEffect` che chiama `onChange`
  (`:114-115`). In più, scegliere la sotto-scheda cambia `durationMinutes`, che **ri-chiave la query
  capacità** (`useArrivalSlots.ts:76`) riportando i dati a «non ancora caricati».

COME PROCEDERE, IN QUEST'ORDINE (è la parte che conta):
1. **RIPRODUCI PRIMA DI CORREGGERE.** Semina su TEST un locale con **due sotto-schede** collegate a
   preset (è quello che fa `e2e/admin-menu-magazzino-blindatura.spec.ts` con
   `buildE2eBookingPublicFormConfig`: leggilo e riusa lo stesso schema, con snapshot e ripristino).
   Apri la pagina, clicca tipologia → sotto-scheda, e ottieni il warning **a comando**. Finché non
   lo riproduci quando vuoi, non toccare il codice: rischi di «correggere» la cosa sbagliata e
   crederla risolta perché il difetto si presenta 1 volta su 10.
2. Solo allora trova la causa vera. Se coincide con la catena sospettata, bene; se è un'altra,
   **scrivi che l'ipotesi era sbagliata** — è un'informazione utile, non una figuraccia.
3. Correggi alla radice (identità stabili delle dipendenze, non un `if` che spezza il ciclo).
4. **Rete di non-regressione**: un test unit/component che monta il form con due sotto-schede e
   fallisce se il numero di render supera una soglia, oppure che asserisce che `onChange` viene
   chiamato un numero finito di volte. Deve essere ROSSO sul codice di prima: verificalo davvero,
   togliendo il fix per un momento.
5. Ripulisci i dati seminati su TEST.

────────────────────────────────────────────────────────────────────────
LAVORO 2 — Un singolo intoppo di rete butta fuori l'admin
────────────────────────────────────────────────────────────────────────
COSA VEDE MARIO: sta lavorando nel gestionale, cambia pagina, e si ritrova alla schermata di login
senza aver fatto niente. Basta che una richiesta non risponda per un attimo.

DOV'È: `src/contexts/AdminAuthContext.tsx`, funzione `checkSession`. Gira **a ogni cambio di
percorso** (`useEffect` con dipendenza `[location.pathname]`, riga 143) e fa **quattro round-trip in
fila**:
  :69  `supabase.auth.getSession()`
  :88  lettura `admin_users` (`.single()`)
  :104 `ensureActiveSubscription(...)`
  :117 `setTenantFromAdmin(...)` → RPC `check_admin_email` (in `TenantContext.tsx:83`)
Se **una qualsiasi** fallisce → `signOut` immediato (riga 119-124 per l'ultima), **zero tentativi**.

DECISIONE DI MATTEO: aggiungere i tentativi di recupero. **Due tentativi di recupero** (cioè fino a
3 chiamate in totale per ogni round-trip), con attesa crescente fra l'uno e l'altro — es. ~300ms poi
~900ms. Motivo per cui due e non uno: un solo tentativo rilanciato subito ricade spesso dentro lo
stesso disturbo (cambio di rete, risveglio del server); due tentativi coprono circa un secondo e
mezzo di rete assente, che è il caso comune. Non costano nulla quando va tutto bene, perché partono
solo in caso di errore.

⚠️ IL PUNTO CHE FA LA DIFFERENZA — **cosa si ritenta e cosa NO**. La regola di sicurezza esistente
si chiama **FU-AUTH-3** («mai lasciare un admin loggato con tenant nullo»,
`TenantContext.tsx:20-22`) e **non va indebolita**. Quindi:
- ❌ **MAI ritentare una risposta negativa esplicita del server**: «per questa email non c'è nessun
  admin» (con `.single()` PostgREST risponde con codice `PGRST116`, zero righe), abbonamento non
  attivo, RPC che risponde correttamente con elenco vuoto. In questi casi il server ha risposto, e
  la risposta è «non sei autorizzato» → `signOut` **subito**, come oggi.
- ✅ **Ritenta solo i guasti di trasporto**: richiesta che non parte o non torna (errore di rete /
  fetch fallita), timeout, errori 5xx, 429. Cioè: il server non ha dato una risposta, non ha dato
  una risposta negativa.
- Se dopo i due tentativi il guasto persiste → `signOut`, come oggi. Il comportamento finale non
  cambia: cambia solo che non succede più per un pacchetto perso.
- Scrivi il tentativo nel log (`logger.warn`) così il prossimo che indaga vede che è successo.

DA COPRIRE CON TEST UNIT (non e2e): (a) risposta «non sei admin» → esce subito, **nessun** nuovo
tentativo; (b) errore di rete al primo colpo e risposta buona al secondo → **resta dentro**, nessun
logout; (c) errore di rete su tutti e tre i tentativi → esce, come oggi.

────────────────────────────────────────────────────────────────────────
LAVORO 3 — Allineare la documentazione interna al fatto che l'app manda email ai clienti
────────────────────────────────────────────────────────────────────────
MANDATO DI MATTEO, testuale: «allineiamo documentazione al fatto che quest'app permette di mandare
email a clienti. La documentazione interna dell'app deve essere pronta e allineata alle decisioni di
prodotto per essere poi letta e chiusa con un legale.»

Quindi: **il destinatario di questo lavoro è un avvocato**, non un programmatore. Deve poter leggere
i documenti e capire, senza aprire il codice, che dati escono dall'app, verso chi, con quale base
giuridica e per quanto tempo. **Non devi produrre pareri legali né testi contrattuali**: devi far
combaciare la documentazione con quello che l'app fa davvero, e lasciare marcati con chiarezza i
punti che restano da decidere con l'avvocato.

IL PROBLEMA (già misurato, §6 del report): `LEGAL_STATE_CONTEXT.md` dichiarava che il servizio di
invio email «non esiste ancora» e la tabella dei sub-processor aveva la riga «NON CONFIGURATO
ANCORA». **È falso da metà giugno.** Ho già corretto quella riga, ma il resto della cartella è
rimasto indietro: **9 file su 11 di `docs/Legal-Production-Skill/` nominano `send-email`, Brevo o i
sub-processor**, e vanno riletti tutti.

LA REALTÀ DA DOCUMENTARE (verificata, non dedotta):
- Edge Function `send-email` **deployata e attiva in PRODUZIONE** (`rwuxgvld`, v6) con i secret
  `BREVO_API_KEY` / `BREVO_SENDER_EMAIL`. Manda email di **conferma e rifiuto prenotazione**
  (transazionali) **e campagne di marketing**.
- Edge pubblica `unsubscribe` v1 + tabella `unsubscribe_tokens` (migrazione `055`): le email
  marketing sostituiscono server-side il link di disiscrizione e falliscono se non è generabile.
- Consenso marketing separato ed esplicito (migrazione `053`, art. 6.1.a GDPR), default **spento**;
  rifiutarlo non impedisce di prenotare.
- Consenso ai dati alimentari separato (migrazione `054`, art. 9.2.a — dati di salute): l'Edge
  `create-booking` **rifiuta la prenotazione** se ci sono allergie/intolleranze senza consenso.
- Tabelle `email_templates` / `email_campaigns` presenti anche in PROD (mig. `050`/`051`/`052`),
  limite duro di 5 campagne per locale.

DA FARE:
1. Rileggi tutti e 9 i file che nominano l'argomento e allineali. Partono da qui:
   `LEGAL_STATE_CONTEXT.md` (già corretto da me — verifica il resto del file),
   `DATA_INVENTORY_CONTEXT.md`, `REGISTRO_TRATTAMENTI_CONTEXT.md`, `PRIVACY_POLICY_CONTEXT.md`,
   `DPA_CLIENTI_CONTEXT.md`, `DPA_SUPABASE_CONTEXT.md`, `LEGAL_MINI.md`,
   `LEGAL_PRODUCTION_SKILL.md`, `SUPABASE_PRODUCTION_CONFIG.md`.
2. Controlla la **pagina privacy vera dell'app** (`src/pages/privacy/PrivacyPolicyContent.tsx`):
   dice al cliente finale che i suoi dati passano da un servizio di invio email? Se non lo dice,
   **NON riscriverla di tua iniziativa** — è testo che finisce davanti agli utenti e va chiuso con
   l'avvocato: segnala esattamente cosa manca e proponi il testo in una nota, non nel file.
3. Chiudi il documento con una sezione **«Da decidere con l'avvocato»**: elenco puntato, in italiano
   semplice, di ciò che serve e che un agente non può produrre — il contratto (DPA) con Brevo, la
   riga nell'elenco pubblico dei fornitori, i tempi di conservazione, il trasferimento dei dati
   fuori dall'Unione Europea se c'è.
4. Se trovi altre affermazioni superate mentre leggi, **correggile e dillo**: il difetto qui non è
   che manchi un documento, è che i documenti dicevano una cosa e l'app ne faceva un'altra per
   sette settimane.

NON TOCCARE: le Edge Function, i secret, la configurazione di Brevo, la produzione. Questo lavoro è
**solo documentazione** più, al massimo, una segnalazione sulla pagina privacy.

────────────────────────────────────────────────────────────────────────
LAVORO 4 — Eliminare il codice morto
────────────────────────────────────────────────────────────────────────
DECISIONE DI MATTEO: si cancella.

Sono funzioni che **nessuna schermata usa**, ma che hanno test verdi: quei test fanno numero senza
verificare niente di ciò che l'app esegue, e fanno sembrare coperta un'area che non esiste più.
Verificato su tutto il repo (non solo `src/`): **nessun uso in `e2e/`, `supabase/functions/`,
`console/`, script**.

| Da cancellare | Dove | Chi la usa oggi |
|---|---|---|
| `calculateDailyCapacityV2` | `src/features/booking/utils/capacityCalculator.ts:80` | solo i suoi test (11 asserzioni su 2 file) |
| `getStartSlotForBookingV2` | `src/features/booking/utils/capacityCalculator.ts:66` | solo i suoi test (8 asserzioni) |
| `isValidName` | `src/features/booking/utils/validation.ts:28` | solo i suoi test (8 asserzioni) |
| `getShiftForTimestamp` | `src/features/booking/utils/shifts.ts:59` | **nessuno**, nemmeno i test |

Le prime due non sono un caso: sono il calcolatore del **cap giornaliero**, cioè il residuo del
modello `daily_guest_limit` che Matteo ha abolito il 18-06-26.

DA FARE:
- Cancella le quattro funzioni **e i loro test** (i `describe` corrispondenti in
  `capacityCalculator.test.ts`, `validation.test.ts`, e il blocco in
  `prenotazioni.adminBlindatura.test.tsx`). Non lasciare test-scheletro né `describe.skip`.
- ⚠️ In `validation.ts` restano `isValidEmail` e `isValidPhone`, che **sono usate**: tocca solo
  `isValidName`. Stessa attenzione negli altri file: cancella la funzione, non il file.
- Se cancellando restano import inutilizzati o file vuoti, puliscili.
- **Prima di cancellare, rifai tu la verifica** con una ricerca su tutto il repo: se trovi un uso
  che io non ho visto, **fermati e segnalalo** invece di cancellare.
- Scrivi nel report il conteggio test PRIMA e DOPO: deve scendere di ~27 asserzioni, e
  `npm run validate` deve restare verde. Un calo diverso da quello atteso significa che hai tolto
  qualcosa di vivo.

────────────────────────────────────────────────────────────────────────
CRITERIO DI FATTO (tutti e quattro)
────────────────────────────────────────────────────────────────────────
- `npm run validate` verde, col numero di test dichiarato prima/dopo.
- Lavoro 1: il warning non compare più nello scenario che PRIMA lo faceva comparire a comando, e
  c'è un test che sarebbe stato rosso senza il fix.
- Lavoro 2: i tre casi di test elencati sopra, verdi.
- Lavoro 3: nessun documento della cartella legale dice più che il servizio di invio email non
  esiste; c'è la sezione «Da decidere con l'avvocato».
- Lavoro 4: `npm run validate` verde col calo di test previsto.
- Report tecnico + **checklist in italiano semplice per Matteo**, che dice cosa aprire e cosa
  guardare per convincersi che funziona.
- Aggiorna i file di contesto/skill dell'area che hai toccato (è già obbligatorio,
  `APP_CONTEXT_SKILL.md` §7.2) e la voce di collaudo se ne chiudi una.

FUORI PERIMETRO: rollout PROD (migrazioni 063→071 + Edge `create-booking`, PROD ancora v21, + client,
tutto INSIEME e solo con autorizzazione esplicita) · capienza pubblica D38 · merge `env/test` → `main` ·
il parallelismo Playwright (deciso: `workers: 1`) · le 7 scritture non atomiche censite nel report §5
fronte 3 (giro successivo) · `COLLAUDO_S4_CHECKLIST.md`.
```

---

## C. Domande e note per Matteo

**La tua domanda: «2 tentativi, meglio 1?» → rispondo 2, ma conta più *cosa* si ritenta.**

Due invece di uno perché un solo tentativo rilanciato subito ricade spesso **dentro lo stesso
disturbo** (il Wi-Fi che cambia rete, il server che si sveglia): dura più di un istante. Due
tentativi con attesa crescente coprono circa un secondo e mezzo, che è il caso comune. Non
rallentano niente quando la rete va, perché partono solo se qualcosa fallisce. L'unico prezzo è che
un utente **davvero** scollegato aspetta ~1 secondo in più prima di vedere il login: trascurabile.

⚠️ **Ma il numero non è la parte importante.** Se ritentiamo *tutto*, rischiamo di insistere anche
quando il server ha risposto «questa persona non è un amministratore» — e lì restare dentro sarebbe
un buco di sicurezza. Nel prompt ho scritto la distinzione: si ritenta solo quando **il server non
ha risposto** (rete assente, timeout, errore 500), mai quando **ha risposto di no**. Con questa
regola, 2 tentativi sono sicuri quanto 0.

**Due cose che ti segnalo, non domande:**

1. **Il lavoro 1 è l'unico senza diagnosi.** Gli altri tre sono chiusi in partenza. Su quello ho
   scritto nel prompt l'ordine obbligatorio — *prima riprodurre a comando, poi correggere* — perché
   un difetto che si presenta una volta su dieci si «risolve» da solo per fortuna, e ce ne
   accorgeremmo solo fra due settimane. Se l'agente torna dicendo «corretto» senza aver mostrato
   prima il difetto a comando, non è fatto.
2. **La pagina privacy che vedono i clienti non l'ho fatta toccare.** Ho chiesto all'agente di
   segnalare cosa manca e di proporre il testo in una nota, non di riscriverla: è l'unico documento
   di quel gruppo che finisce davanti agli utenti, e ha senso che lo chiuda l'avvocato insieme al
   resto.
