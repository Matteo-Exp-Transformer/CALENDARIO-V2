# Prompt di avvio — prossimo agente senior (Fase 2, stato reale 05-08-26, post-riga-11)

> Aggiornato il **05-08-2026** dopo proseguimento Codex su tavolata a 3 tavoli, badge Calendario e
> persistenza Impostazioni, poi modali responsive Servizio. Da incollare come primo messaggio della
> prossima chat. Il testo dentro il blocco è il prompt; quello dopo è il perché delle scelte.
>
> ⛔ **Supera** `docs/Sessioni di lavoro/03-08-26/PROMPT_PROSSIMO_SENIOR_FASE1.md`: quello mandava a
> fare la Fase 1. La ripresa Codex del 04-08-2026 ha chiuso i 3 rossi rimasti con test mirati; non
> ripartire da lì.

---

```
Sei l'agente senior che riprende il cantiere Servizio/test di questo repo. Il tuo ruolo è
SUPERVISIONE: leggi il codice vero, prepari i prompt, lanci agenti Sonnet che eseguono, e rileggi TU
ogni diff riga per riga. Matteo controverifica a campione, non testa attivamente.

LETTURE OBBLIGATORIE, IN QUEST'ORDINE:
1. docs/Sessioni di lavoro/04-08-26/Report-fase1-base-test-04-08-26.md — è lo stato di oggi. Leggi
   prima l'aggiornamento «ripresa Codex» in cima, poi §3, §4, §6, §7 e §10.
2. docs/Sessioni di lavoro/03-08-26/PIANO_SENIOR_TEST_E_SALUTE_CODICE.md — il blocco ⛳ in cima dice
   cosa è già fatto. Il tuo mandato è: eventuale run completa e2e `--workers=1`, decisione sul
   parallelismo, poi FASE 2 (§4 del piano), poi Fase 3 (§5).
3. docs/Testing-Skill/TESTING_SKILL.md §3 e §5 — aggiornati oggi con tre trappole che ti
   risparmiano ore: validate non guarda i test e2e, la batteria non regge 12 worker, il `finally`
   non sopravvive al timeout.
4. docs/APP_CONTEXT_SKILL.md §0 → skill d'area del pezzo che tocchi.

DA DOVE PARTI (misurato da me, un test alla volta, non riportato da un agente):
- e2e Fase 1: i 3 rossi rimasti sono chiusi e la batteria completa in seriale è stata rilanciata:
  `npm run test:e2e -- --workers=1` → 100/100 verde.
- Verifiche mirate verdi: `public-booking-fix9-compilable.spec.ts` 7/7, smoke card/carosello 1/1,
  modali responsive Admin mobile 2/2 e tablet 2/2.
- unit/integration mirata: `BookingRequestForm.flussoUtente.test.tsx` 7/7.
- Fase 2 avviata: righe 1-2 coperte a browser dentro
  `e2e/pro/pro-service-tables-lifecycle.spec.ts`. Riga 2 = Mario chiude una fascia da Servizio, Anna
  non la vede più nel picker orari del form pubblico.
- Fase 2 riga 3 verificata nel codice corrente: `useTableAssignments.fix2.test.ts` copre che
  "Modifica tavolo" da Calendario e "sposta" da Servizio non consumano turni sul tavolo di partenza;
  file completo 12/12 verde.
- Fase 2 riga 4 coperta a browser dentro `e2e/pro/pro-service.spec.ts`; scenario editor fasce
  verde. Il file oggi è completo **6/6 verde** perché include anche la riga 11.
  La modale Servizio blocca nome duplicato, inizio=fine e sovrapposizione.
- Fase 2 riga 5 coperta a browser dentro `e2e/pro/pro-service-tables-lifecycle.spec.ts`: dalla Home
  Mario apre "Aggiungi walk-in", sceglie un tavolo occupato, il primo click mostra l'avviso, il cambio
  sala azzera tavolo/conferma, il secondo giro forza la sostituzione e crea il walk-in assegnato.
  Verifiche: scenario mirato 1/1 verde, file completo 10/10 verde, typecheck e2e ad hoc verde.
- Fase 2 riga 6 coperta a browser dentro `e2e/pro/pro-service-tables-lifecycle.spec.ts`: da Servizio
  → Mappa, Mario apre "Assegna tavolo", vede un tavolo libero ma con 0 turni residui, clicca
  "Assegna comunque" e il DB registra la nuova assegnazione forzata con audit (`forced_by_admin`,
  motivo, turno 3). Verifiche: scenario mirato 1/1 verde, file completo 11/11 verde, typecheck e2e
  ad hoc verde.
- Fase 2 riga 7 coperta a browser dentro `e2e/pro/pro-service-tables-lifecycle.spec.ts`: l'avviso
  fine turno copre "Libero", "Decido dopo", riapertura quando entra in uscita un secondo tavolo e
  cambio fascia che azzera "Decido dopo" quando Mario torna alla fascia originale. Verifiche:
  scenario cambio-fascia 1/1 verde, file completo 12/12 verde, typecheck e2e ad hoc verde.
- Fase 2 riga 8 coperta a browser dentro `e2e/pro/pro-service-tables-lifecycle.spec.ts`: Mario
  assegna una tavolata da 10 coperti a 3 tavoli da 3 posti, vede "Mancano 1 posti per questa
  tavolata", poi usa "Annulla" sulla barra dell'ultima assegnazione e il DB torna senza assignment
  per quella prenotazione. Verifiche: scenario mirato 1/1 verde, file completo 13/13 verde,
  typecheck e2e ad hoc verde.
- Fase 2 riga 9 coperta con unit/component test dentro
  `src/features/booking/components/__tests__/calendario.adminBlindatura.test.tsx`: nel Calendario
  mese, Pro con tavoli attivi e limiti pubblici spenti mostra solo conteggio coperti, non la %
  sulla capienza fisica; Classic ignora eventuali tavoli presenti in cache e usa il cap per-fascia.
  Verifica: file Calendario mirato 32/32 verde.
- Fase 2 riga 10 coperta a browser dentro `e2e/admin-settings-blindatura.spec.ts`: Matteo apre
  Impostazioni, cambia il nome ristorante, salva dalla modale "Salva modifiche pubbliche?", ricarica
  `/admin/impostazioni` e rivede il valore persistito. Il test prende snapshot del setting
  `restaurant_name` su TEST e lo ripristina in `finally`. Verifiche: scenario mirato 1/1 verde,
  file completo 7/7 verde, typecheck e2e ad hoc verde.
- Fase 2 riga 11 coperta a browser dentro `e2e/pro/pro-service.spec.ts`: su 375, 834 e 1280 px
  Matteo apre Aggiungi sala, Aggiungi tavolo, Assegna multi-tavolo, Aggiungi walk-in e Briefing
  pre-turno; il test verifica pannello e azioni principali nel viewport. Verifiche: scenario
  responsive 3/3 verde, file completo 6/6 verde, typecheck e2e ad hoc verde.
- `npm run validate` è verde dopo un fix test-only su `walkIn.b2.test.tsx`: gli assignment del test
  ora usano la data locale, non `toISOString()` UTC, perché `WalkInModal` calcola "oggi" a muro.
  Verifica mirata: `walkIn.b2.test.tsx` 14/14 verde.
- Le modifiche della ripresa/proseguimento Codex sono state preparate su `env/test` con commit
  locali e **nessun push**. Il commit iniziale richiesto in questa ripresa è `2f1df20` per l'avviso
  fine turno; il giro successivo da committare localmente chiude righe 8, 9, 10, 11, fix test
  walk-in su data locale e handoff aggiornato. Il branch resta avanti rispetto a `origin/env/test`.

LE TRE CORREZIONI DI RIPRESA DA NON RIAPRIRE:
1. `public-booking-fix9-compilable.spec.ts` — una sola card non mostra la striscia, ma si
   auto-seleziona e applica il preset. La spec usa un UUID preset valido e locator responsive.
2. `public-booking-smoke.spec.ts` — nel ramo card singola si asserisce la card auto-selezionata e
   l'assenza della striscia.
3. `admin-booking-mgmt.spec.ts` — in mobile/tablet l'entry calendario non è sempre un `button`; il
   test clicca il testo evento, che apre i dettagli sia in lista sia in mese.

PROSSIMO PASSO: continua la FASE 2 (§4 del piano): righe 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 e 11 coperte, prossima priorità riga 12.
Restano aperte la decisione sul parallelismo Playwright e la prova a cavallo della mezzanotte.

COMMITS LOCALI GIA' PREPARATI DA NON RIFARE:
1. `fix(e2e): chiudi rossi prenota e admin responsive` — le tre spec e2e di Fase 1.
2. `test(e2e): copri flussi Servizio critici da browser` — helper REST + lifecycle/Servizio
   (eliminazione tavolo occupato + fascia chiusa che sparisce dal form pubblico + validazioni editor
   fasce).
3. `docs(handoff): allinea Fase 2 e prossimo prompt` — skill Prenota/Servizio, report, piano e
   prompt. Nessun push.
4. `test(fase2): copri righe 8-11 e handoff` — tavolata incompleta con undo, badge Calendario
   Pro/Classic, persistenza Impostazioni dopo reload, modali Servizio responsive, fix test walk-in
   su data locale e documenti aggiornati. Nessun push.

DECISIONI DI PRODOTTO:
a) Chiusa da Matteo: sotto-scheda singola «a card» = difetto. Deve auto-selezionarsi e applicare il
   preset, senza mostrare la striscia.
b) Ancora aperte: soglia di ritardo 15', buffer di riassetto 10', durata walk-in 90'.
c) Ancora aperta: il pulsante «Aggiungi tavolo» per sala è in una posizione diversa dal piano.

REGOLE NON NEGOZIABILI:
- Mai commit o push senza richiesta esplicita di Matteo. Per la ripresa/proseguimento Codex Matteo ha
  chiesto commit locale, ma **non** push.
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

- **Parte dalla Fase 2 riga 12, non dalla Fase 1 o dalle righe 1-11**: il rischio numero uno è che
  qualcuno rilegga il piano di ieri e ricominci a sistemare spec già sistemate.
- **I tre rossi restano descritti come correzioni chiuse**, così il prossimo può capire perché i test
  sono cambiati senza riaprire la diagnosi.
- **La riga sui subagent che non devono lanciare Playwright** è nuova: nella Fase 0 il problema non
  si era posto perché l'agente era uno solo. Con quattro in parallelo sarebbe stato un disastro.
- **La domanda (a) su prodotto è chiusa**: Matteo ha confermato la deduzione, quindi ora è una regola
  da preservare nei test.
