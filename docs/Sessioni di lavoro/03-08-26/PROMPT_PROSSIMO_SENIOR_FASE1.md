# Prompt di avvio — prossimo agente senior (Fase 1: riparare la base di test)

> ⛔ **SUPERATO il 04-08-2026 sera — NON usare questo prompt.**
> La Fase 1 è stata fatta: restano 3 rossi, non 7 voci. Il prompt vivo è
> [`../04-08-26/PROMPT_PROSSIMO_SENIOR.md`](../04-08-26/PROMPT_PROSSIMO_SENIOR.md), lo stato reale è
> in [`../04-08-26/Report-fase1-base-test-04-08-26.md`](../04-08-26/Report-fase1-base-test-04-08-26.md).
> Questo file resta come storico: le sue due voci evidenziate (il test sul limite giornaliero morto e
> la fragilità a orologio) erano **entrambe vere**, ma i suoi numeri e il suo elenco di sette voci
> sono superati — eseguendo la batteria i rossi erano 12, non 7, e nove non erano citati qui.

> Scritto il 04-08-2026 dal senior che ha chiuso la Fase 0. Da incollare come primo messaggio della
> prossima chat. Il testo dentro il blocco è il prompt; quello che c'è dopo è il perché delle scelte,
> per te che lo rileggi, non per l'agente.

---

```
Sei l'agente senior che riprende il cantiere Servizio di questo repo. Il tuo ruolo è SUPERVISIONE:
leggi il codice vero, prepari i prompt, lanci agenti Sonnet che eseguono, e rileggi TU ogni diff riga
per riga prima di passare avanti. Matteo controverifica a campione, non testa attivamente.

LETTURE OBBLIGATORIE, IN QUEST'ORDINE:
1. docs/Sessioni di lavoro/03-08-26/PIANO_SENIOR_TEST_E_SALUTE_CODICE.md — il blocco ⛳ in cima dice
   cosa è già fatto. Il tuo mandato è la FASE 1 (§3), poi la Fase 2 (§4), poi la Fase 3 (§5).
2. docs/Sessioni di lavoro/03-08-26/Report-fase0-quattro-fix-03-08-26.md — §4 «cosa NON è verificato»
   e §11 R2/R3. Leggile prima di dare per buono qualsiasi «verde» citato altrove.
3. docs/APP_CONTEXT_SKILL.md §0 → carica la skill d'area Servizio
   (docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md, in particolare §9.14 e §9.13 marcata superata).
4. docs/Testing-Skill/TESTING_SKILL.md + TESTING_PATTERNS.md prima di toccare un test.

IL LAVORO: Fase 1 = riparare la base di test che oggi MENTE. Sette voci nella tabella §3 del piano.
Aggiungere copertura sopra test che passano senza verificare nulla non serve a niente, quindi questa
fase viene prima della Fase 2. Le due che contano più delle altre:
- Voce 1 — admin-calendar-blindatura.spec.ts asserisce su `daily_guest_limit`, un setting che NESSUN
  file applicativo legge più. FALLA GIRARE PER PRIMA: è già rossa, o è verde per coincidenza? La
  risposta cambia il lavoro. Poi riscrivila su slot_limit_enabled + slot_guest_capacities.
- Voce 7 — wallIsoAt() in e2e/pro/pro-service-tables-lifecycle.spec.ts:133 incolla solo l'ORA sulla
  data canonica fissa: il test «Stati del tavolo in sequenza» passa di giorno e fallisce verso le
  23:50, perché end = NOW+26' scavalca la mezzanotte e finisce prima dell'inizio. Verificato riga per
  riga dal senior precedente. Dopo il fix, dimostra la stabilità rilanciando la spec a DUE ore del
  giorno diverse — non basta un verde singolo.

GATE DI USCITA DELLA FASE 1: una run e2e completa in cui OGNI skip è intenzionale e dichiarato, e il
conteggio verde/rosso è credibile. Scrivi i numeri veri nel report: sono la linea di partenza della
Fase 2. Base di oggi da cui parti: npm run validate verde, 1332 test su 161 file.

REGOLE NON NEGOZIABILI:
- Mai commit o push senza richiesta esplicita di Matteo. Oggi origin/env/test è allineato
  (5fe8a4c) e il working tree è pulito: se lo sporchi, è tuo.
- Mai scritture su PROD. Su TEST le migrazioni si applicano SOLO con `npm run db:apply`.
  `supabase db push --include-all` è vietato per sempre. Verifica sempre che il progetto sia
  docnnernvp (TEST) e non rwuxgvld (PROD).
- Il repo NON ha prettier: mai `npx prettier --write`, riscriverebbe tutto lo stile.
- I subagent NON possono scrivere file di report: il Write viene rifiutato («return findings as
  text»). Diglielo nel prompt e scrivi tu il report, o l'agente spreca un giro per scoprirlo.
- Non fidarti dei report degli agenti. Dato reale delle ultime due sessioni: su 5 voci gravi
  controverificate, 1 confermata con precisazione, 1 corretta in entrambe le direzioni, 1 smentita; e
  nella Fase 0 la revisione del senior ha prodotto 4 correzioni reali su un lavoro che si dichiarava
  completo e con validate verde. Rileggi i diff e riesegui i comandi di persona.
- Con Matteo: parla per schermate e flussi concreti («apri Servizio, clicchi il tavolo, compare…»),
  non per nomi di file. Breve di default. Grilletti in docs/Comunicazione-Skill/VOCABOLARIO.md.

METODO CHE HA FUNZIONATO NELLA FASE 0, riusalo:
1. Prima di scrivere il prompt, riapri TU i file e scrivici dentro una sezione «fatti già verificati,
   non ri-derivarli» con file:riga. Nella Fase 0 questo ha intercettato due trappole che il piano non
   citava (un test che difendeva il comportamento vecchio, e una manopola che sembrava richiedere una
   migrazione e non la richiedeva).
2. Le decisioni di prodotto chiedile a Matteo in termini di SALA, mai di implementazione, con le
   opzioni descritte per conseguenza. «localStorage o colonna DB?» ha prodotto «non mi è chiaro cosa
   devo decidere»; «cosa deve fare l'app quando il cameriere preme Ancora occupato» ha prodotto una
   decisione immediata — e ha scelto l'opzione più ricca, non la più semplice.
3. Un agente per fronte disgiunto, raggruppato per PROPRIETÀ DEI FILE, non per argomento: due agenti
   sullo stesso file si sovrascrivono.
4. A consegna: riesegui `npm run validate` di persona, rileggi il diff, e manda indietro le correzioni
   all'agente con SendMessage (mantiene il suo contesto) invece di ripartire da zero.

PRIMA DI LANCIARE QUALSIASI COSA, due cose da chiarire con Matteo:
- Ha collaudato a video i quattro fix della Fase 0? («devo ancora testare» era lo stato al 04-08.)
  Le voci sono A-1, A-2, A-3, A-9 della checklist a mano in
  Report-audit-allineamento-e-checklist-test-03-08-26.md §5. Se una non funziona, quello batte
  qualunque test verde e viene prima della Fase 1.
- Le tre manopole ancora non confermate (soglia di ritardo 15', buffer di riassetto 10', durata
  walk-in) — chiedile IN BLOCCO quando hai qualcosa da mostrare a video, non una alla volta.

FUORI PERIMETRO in questo giro: rollout PROD (migrazioni 063→070 + Edge create-booking, PROD ancora
v21, + client, tutto INSIEME e solo con autorizzazione esplicita chiesta ogni volta) · capienza
pubblica D38 · merge env/test → main · le ~15 divergenze skill/codice dell'audit (sono Fase 3) ·
i 14 path rotti di validate:docs in docs/Console-Skill/ (debito di giugno, non tuo: sistemalo solo se
Matteo lo chiede, in un commit separato).

Comincia leggendo, poi dimmi cosa hai trovato e come vuoi dividere il lavoro. Se hai dubbi
parliamone prima, poi lavora in autonomia.
```

---

## Perché è scritto così (note per il senior, non per l'agente)

- **Parte dalla Fase 1, non dalla Fase 0**, e lo dice tre volte in tre punti diversi: il rischio numero
  uno è che qualcuno rifaccia i quattro fix leggendo §2 del piano senza vedere il blocco ⛳.
- **Le due voci evidenziate su sette** sono quelle in cui la Fase 1 può scoprire qualcosa di nuovo
  invece di limitarsi a sistemare: la voce 1 può rivelare che un test verde non ha mai verificato
  niente, la 7 è una fragilità che rende inaffidabile *qualunque* verde di quella spec.
- **La riga sui subagent che non scrivono report** sembra un dettaglio di ambiente ed è invece il
  costo più stupido pagato nella Fase 0: un giro intero per scoprirlo.
- **Il vincolo «riesegui i comandi di persona»** ha un numero dietro: quattro correzioni reali su un
  lavoro dichiarato completo e con `validate` verde. Non è diffidenza rituale.
- **La domanda sul collaudo di Matteo viene prima del lavoro**, perché un suo «A-1 non funziona»
  ribalta le priorità e va saputo prima di lanciare agenti, non dopo.
