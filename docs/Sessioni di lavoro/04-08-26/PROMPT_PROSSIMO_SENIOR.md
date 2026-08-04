# Prompt di avvio — prossimo agente senior (chiusura Fase 1 → Fase 2)

> Scritto il **04-08-2026** dal senior che ha fatto la Fase 1. Da incollare come primo messaggio
> della prossima chat. Il testo dentro il blocco è il prompt; quello dopo è il perché delle scelte.
>
> ⛔ **Supera** `docs/Sessioni di lavoro/03-08-26/PROMPT_PROSSIMO_SENIOR_FASE1.md`: quello mandava a
> fare la Fase 1, che ora è fatta al 98%. Non ripartire da lì.

---

```
Sei l'agente senior che riprende il cantiere Servizio/test di questo repo. Il tuo ruolo è
SUPERVISIONE: leggi il codice vero, prepari i prompt, lanci agenti Sonnet che eseguono, e rileggi TU
ogni diff riga per riga. Matteo controverifica a campione, non testa attivamente.

LETTURE OBBLIGATORIE, IN QUEST'ORDINE:
1. docs/Sessioni di lavoro/04-08-26/Report-fase1-base-test-04-08-26.md — è lo stato di oggi. Leggi
   §3 (numeri veri), §4 (cosa NON è verificato) e §6 (le tre domande di prodotto aperte).
2. docs/Sessioni di lavoro/03-08-26/PIANO_SENIOR_TEST_E_SALUTE_CODICE.md — il blocco ⛳ in cima dice
   cosa è già fatto. Il tuo mandato è: chiudere i due rossi rimasti (§3 del report), poi la FASE 2
   (§4 del piano), poi la Fase 3 (§5).
3. docs/Testing-Skill/TESTING_SKILL.md §3 e §5 — aggiornati oggi con tre trappole che ti
   risparmiano ore: validate non guarda i test e2e, la batteria non regge 12 worker, il `finally`
   non sopravvive al timeout.
4. docs/APP_CONTEXT_SKILL.md §0 → skill d'area del pezzo che tocchi.

DA DOVE PARTI (misurato da me, un test alla volta, non riportato da un agente):
- e2e: 99 test → 87 verdi, 3 rossi, 9 saltati. I 9 saltati sono TUTTI a cascata dai rossi
  (`test.describe.configure({ mode: 'serial' })`): chiudi i rossi e gli skip spariscono da soli.
  Stamattina, sullo stesso codice, erano 51 verdi / 31 rossi / 20 saltati.
- unit/integration: 1344 test su 162 file, verdi.
- Working tree SPORCO e NON committato: 17 file modificati + 3 nuovi. Nessun commit, nessun push:
  Matteo non li ha autorizzati. Se te lo chiede, in §7 del report c'è come spezzare i commit.

I TRE ROSSI RIMASTI — due nelle spec del form pubblico, uno intermittente:
1. `public-booking-fix9-compilable.spec.ts:168` [mobile-375] — non trova
   `booking-sub-tab-card-e2e-fix9-card-1`. ATTENZIONE, indizio forte già verificato da me altrove:
   la striscia di card delle sotto-schede si monta SOLO da 2 sotto-schede in su
   (`BookingRequestForm.tsx:1300`, `activeModeSubTabs.length > 1`). Se anche questo spec ne semina
   una sola, è lo stesso identico difetto che ho appena chiuso in
   `admin-menu-magazzino-blindatura.spec.ts` — guarda lì la soluzione prima di inventarne una.
2. `public-booking-smoke.spec.ts:255` «card e carosello restano XOR e la card senza titolo non
   appare» — 16.8s, rosso VERO ma **finora invisibile**: era saltato a cascata dietro il test della
   privacy, che oggi è verde. Non è una regressione di stamattina: è il rosso successivo che emerge.
   Non l'ho ancora diagnosticato: parti dallo screenshot in test-results/.
3. `admin-booking-mgmt.spec.ts:248` [mobile-375] «Elimina — textarea piena, bottoni in viewport» —
   ⚠️ **INTERMITTENTE, la voce più insidiosa delle tre.** Va in timeout aspettando il bottone della
   prenotazione seminata (`E2E-FU043-Delete-mobile-375`), cioè la prenotazione non compare in lista.
   Nelle mie run di oggi: rosso a 375 e 834, poi verde a 375 e rosso a 834, poi verde entrambi,
   infine rosso a 375. Stesso codice. Non l'ho diagnosticato. Trattalo come un problema di
   isolamento/seed, non di layout: il nome del test parla di viewport ma il timeout è sul dato.
   Rilancialo 3-4 volte di fila PRIMA di toccarlo, così sai contro cosa stai lavorando.

DOPO QUESTI TRE, il gate della Fase 1 è chiuso e passi alla FASE 2 (§4 del piano, 13 flussi da
coprire). Le prime 4 righe di quella tabella sono legate ai fix della Fase 0 e vengono per prime.

DECISIONI DI PRODOTTO DA PORTARE A MATTEO — insieme, quando hai qualcosa da mostrare a video:
a) Sotto-scheda singola «a card»: il preset collegato non viene MAI applicato, perché la striscia
   che la selezionerebbe non si monta con una sola scheda e l'auto-selezione esiste solo per il
   carosello (`BookingRequestForm.tsx:528-533`). Un locale che configura UNA sola tipologia a card
   vede il menù intero invece del suo preset. Verificato leggendo il codice e a schermo; se sia un
   bug o il comportamento voluto lo decide Matteo.
b) Le tre manopole mai confermate: soglia di ritardo 15', buffer di riassetto 10', durata walk-in 90'.
c) Il pulsante «Aggiungi tavolo» per sala è finito in una posizione diversa da quella del piano.

REGOLE NON NEGOZIABILI:
- Mai commit o push senza richiesta esplicita di Matteo.
- Mai scritture su PROD. Su TEST le migrazioni SOLO con `npm run db:apply`; `supabase db push
  --include-all` vietato per sempre. Progetto TEST = docnnernvp, PROD = rwuxgvld.
- Il repo NON ha prettier: mai `npx prettier --write`.
- I subagent NON possono scrivere file di report: diglielo nel prompt, e scrivi tu il report.
- Vieta ai subagent di lanciare Playwright: le run le fai TU, `--workers=1`. Se due agenti lanciano
  la batteria insieme si disturbano e ti riempiono il report di rossi finti (misurato: 20 su 31).
- Non fidarti dei report degli agenti. Oggi 4 agenti su 4 hanno consegnato lavoro corretto, ma solo
  perché il prompt conteneva i fatti già verificati da me con file:riga. Riesegui i comandi.
- Con Matteo: parla per schermate e flussi concreti, non per nomi di file. Breve di default.

METODO CHE HA FUNZIONATO OGGI, riusalo:
1. Prima misura, poi decidi. Il piano diceva «7 voci»; la misura ne ha trovate 12 di rosse, di cui
   solo 3 erano nel piano. Un'ora di run e diagnosi ha cambiato tutto il piano di lavoro.
2. Separa SEMPRE «rosso vero» da «rosso da contesa» rilanciando la spec da sola con `--workers=1`,
   prima di aprire qualsiasi indagine.
3. Nel prompt all'agente scrivi una sezione «fatti già verificati, non ri-derivarli» con file:riga,
   e digli cosa NON deve toccare. Quattro agenti su file disgiunti, zero collisioni.
4. Quando un test è rosso, guarda lo SCREENSHOT (`test-results/**/test-failed-1.png`) e
   `error-context.md`: nella metà dei casi la causa è lì e ti risparmi mezz'ora di lettura codice.

FUORI PERIMETRO: rollout PROD (migrazioni 063→070 + Edge create-booking, PROD ancora v21, + client,
tutto INSIEME e solo con autorizzazione esplicita) · capienza pubblica D38 · merge env/test → main ·
le ~15 divergenze skill/codice dell'audit (Fase 3) · i 14 path rotti di validate:docs in
docs/Console-Skill/.

Comincia leggendo, poi dimmi cosa hai trovato e come vuoi dividere il lavoro. Se hai dubbi
parliamone prima, poi lavora in autonomia.
```

---

## Perché è scritto così (note per il senior, non per l'agente)

- **Parte dai due rossi rimasti, non dalla Fase 1 intera**: il rischio numero uno è che qualcuno
  rilegga il piano di ieri e ricominci a sistemare spec già sistemate.
- **Il primo rosso ha già l'indizio dentro**: è quasi certamente lo stesso difetto delle sotto-schede
  che ho chiuso oggi altrove. Dare l'indizio costa due righe e può valere un'ora.
- **Il secondo rosso è dichiarato come non diagnosticato.** È la cosa più onesta da scrivere e
  impedisce che il prossimo lo tratti come «già capito, basta applicare».
- **La riga sui subagent che non devono lanciare Playwright** è nuova: nella Fase 0 il problema non
  si era posto perché l'agente era uno solo. Con quattro in parallelo sarebbe stato un disastro.
- **La domanda (a) su prodotto** è l'unica scoperta di oggi che riguarda ciò che vede un cliente
  vero, non i test. Va portata a Matteo, non risolta da un agente.
