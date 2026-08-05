> ⛔ **SUPERATO il 05-08-2026 sera.** I quattro punti del mandato qui sotto **sono stati eseguiti** e
> la Fase 3 è fatta. In particolare il **punto 1 è da non riaprire come è scritto**: l'ipotesi «spec
> diverse che si invalidano la sessione a vicenda» è stata **smentita misurando**.
> Stato reale e mandato nuovo: [Report-rossi-parallelismo-mezzanotte-fase3-05-08-26.md](Report-rossi-parallelismo-mezzanotte-fase3-05-08-26.md)
> — leggi §2.3 (i due difetti dell'app trovati sotto), §8 (tre domande a Matteo) e §9 (cosa resta).
> Questo file resta come storico del giro precedente.

# Prompt di avvio — prossimo agente senior (Fase 2 chiusa, si parte dalla Fase 3)

> Scritto il **05-08-2026** dopo la copertura delle righe **12 e 13**, che chiudono la tabella della
> Fase 2. Da incollare come primo messaggio della prossima chat: il testo dentro il blocco è il
> prompt, quello dopo è il perché delle scelte.
>
> ⛔ **Supera** `docs/Sessioni di lavoro/04-08-26/PROMPT_PROSSIMO_SENIOR.md`, che mandava a fare la
> riga 12: è fatta. Non riaprire le righe 1-13.

---

```
Sei l'agente senior che riprende il cantiere Servizio/test di questo repo. Il tuo ruolo è
SUPERVISIONE: leggi il codice vero, prepari i prompt, lanci agenti Sonnet che eseguono, e rileggi TU
ogni diff riga per riga. Matteo controverifica a campione, non testa attivamente.

LETTURE OBBLIGATORIE, IN QUEST'ORDINE:
1. Il report di ieri sera: cerca per nome `Report-fase2-righe-12-13-05-08-26.md` (cartella di
   sessione del 05-08-26). È lo stato di oggi: leggi §1, §4, §5, §6 e §8.
2. Il piano: cerca `PIANO_SENIOR_TEST_E_SALUTE_CODICE.md` (cartella 03-08-26). I blocchi ⛳ in cima
   dicono cosa è già fatto: **Fase 0, 1 e 2 sono chiuse**. Il tuo mandato è la **FASE 3 (§5)** più i
   tre debiti elencati sotto.
3. `docs/Testing-Skill/TESTING_SKILL.md` §3 e §5 — quattro trappole già pagate: validate non guarda
   i test e2e, la batteria non regge 12 worker, il `finally` non sopravvive al timeout, e il form
   pubblico ha un limite di 3 invii al minuto per IP.
4. `docs/APP_CONTEXT_SKILL.md` §0 → skill d'area del pezzo che tocchi.

DA DOVE PARTI (misurato da me, un test alla volta, non riportato da un agente):
- **Fase 2 completa.** Riga 12 nel nuovo `e2e/public-booking-classic.spec.ts` (**4/4 verde**): sul
  locale Classic il cliente completa l'invio e la riga esiste a DB; la fascia satura sparisce dal
  picker; l'invio oltre il cap viene respinto senza creare nulla; e il quarto test è la
  non-regressione della migrazione `071` (vedi sotto).
- Riga 13 in `e2e/pro/pro-crm.spec.ts` (4/4 verde col test preesistente): campagna creata e
  verificata a DB, gruppo destinatari filtrato dal consenso marketing, «Invia ora» fermato alla
  modale di conferma con una guardia di rete che dimostra che `send-email` non viene mai chiamata.
- `e2e/public-booking-fix9-compilable.spec.ts` caso 5 riparato: la sua asserzione era **condizionata**
  (`if (submitRequest)`) e tre interazioni puntavano a id inesistenti. Ora l'invio deve partire, il
  server deve rispondere 201, e la prenotazione creata viene ripulita. File 7/7 verde.
- Le quattro spec del form pubblico lanciate di seguito, `--workers=1`: **25/25 verde**.
- Ambiente TEST pulito a fine giro: zero residui `E2E-PUBCLS-*`, `E2E-FIX9-*`, `E2E-CAMP-*`; le fasce
  di `test-classic` intatte; su `da-tommaso` resta solo la campagna vera di Matteo, mai inviata.
- **Commit locali fatti su richiesta di Matteo, NESSUN PUSH.** Sopra i 13 commit locali che c'erano
  già, questo giro ne aggiunge quattro:
  2f0fb4e fix(db): conta i coperti pubblici sull'ora a muro (mig. 071)
  fea2e35 fix(e2e): rispetta il rate limit del form pubblico e ripara il caso 5 di fix9
  07ae2a2 test(e2e): copri form pubblico Classic e campagne CRM (Fase 2 righe 12-13)
  e `docs(handoff)` con report, piano, prompt, skill e indici. Il branch resta avanti rispetto a
  `origin/env/test`: **non pushare** finché Matteo non lo chiede.

IL TUO MANDATO, IN ORDINE:
1. **I 3 rossi della batteria completa.** Run di chiusura del 05-08 con `--workers=1`: **116 test,
   113 verdi, 3 rossi, 6,9 minuti**. I tre rossi — `admin-settings-blindatura.spec.ts:156` e `:184`
   (tablet-900), `admin-menu-magazzino-blindatura.spec.ts:326` (tablet-834) — **rieseguiti da soli
   sono verdi** (7/7 e 3/3). Non è contesa fra worker: la batteria girava già a un worker solo.
   L'unico dettaglio salvato è del terzo: fallisce sulla lista errori di console, che conteneva
   `[checkSession] risoluzione tenant admin fallita: signOut di sicurezza`. **Ipotesi da verificare,
   non conclusione:** spec diverse che entrano con lo stesso account admin in sequenza si invalidano
   la sessione a vicenda. Riproduci PRIMA di correggere, e **salva la cartella `test-results/` prima
   di rilanciare** (Playwright la svuota a ogni run: io ho perso gli artefatti di due rossi su tre).
2. **La decisione sul parallelismo Playwright** (`playwright.config.ts` è ancora invariato): 12
   worker producono ~20 rossi finti, 1 worker è affidabile ma lento. Probabilmente 2-4 worker, o
   isolare le spec che si scrivono addosso lo stesso locale. Serve una scelta, non un rinvio —
   ma falla **dopo** il punto 1: se l'ipotesi della sessione condivisa regge, più worker peggiorano.
3. **La prova a cavallo della mezzanotte** del fix a orologio (eredità 04-08: c'è la prova unitaria,
   manca quella col browser).
4. **FASE 3** (§5 del piano): analisi strutturale su fronti disgiunti, agenti in sola lettura,
   ciascuno obbligato a citare `file:riga` e a scrivere «NON VERIFICATO» invece di dedurre.
   ⚠️ Aggiungi ai fronti della §5 lo **scarto d'orario** descritto sotto: è esattamente il tipo di
   duplicazione logica che la Fase 3 deve censire, ed è già misurato.

DUE COSE TROVATE IERI CHE DEVI CONOSCERE PRIMA DI TOCCARE QUALSIASI COSA:
1. **Limite di frequenza del form pubblico.** `create-booking` registra in `rate_limits` OGNI
   richiesta e risponde 429 oltre **3 al minuto per IP**; oltre **6 in 10 minuti** dopo lo
   sforamento l'IP finisce in blacklist per **24 ore**. Il 429 **non produce errore inline** (la
   mappatura di «Troppe richieste» ha `inlineMessage: ''`), quindi sembra un difetto del form.
   Chiama sempre `waitForCreateBookingRateLimitWindow()` prima di un submit reale, un invio per
   test, mai un retry sul submit. Se ti trovi con un rosso inspiegabile sul form pubblico, la prima
   cosa da guardare è la tabella `rate_limits`.
2. **Scarto d'orario nel conteggio posti del form pubblico — CORRETTO SU TEST, non in PROD.**
   La RPC `get_available_arrival_times` leggeva `confirmed_start AT TIME ZONE 'Europe/Rome'`, mentre
   l'app salva quel campo con offset `+00:00` **finto** (le cifre sono l'ora a muro,
   `src/features/booking/utils/dateUtils.ts:53-59`) e l'Edge le legge alla lettera: 2 ore di scarto
   d'estate, una prenotazione delle 10:00 saturava **Pranzo** invece di **Colazione**.
   Migrazione **`071`** applicata su TEST il 05-08 (misura ripetuta prima/dopo, non-regressione nel
   quarto test di `public-booking-classic.spec.ts`). ⚠️ **In PROD non c'è**: la `071` si aggiunge al
   treno del rollout e non deve partire da sola. Se qualcuno ti dice che il form pubblico «conta i
   posti sulla fascia sbagliata» in produzione, la causa è questa e la cura è già scritta.

REGOLE NON NEGOZIABILI:
- Mai commit o push senza richiesta esplicita di Matteo.
- Mai scritture su PROD. Su TEST le migrazioni SOLO con `npm run db:apply`; `supabase db push
  --include-all` vietato per sempre. TEST = docnnernvp, PROD = rwuxgvld.
- Il repo NON ha prettier: mai `npx prettier --write`.
- I subagent NON possono scrivere file di report: diglielo nel prompt, e scrivi tu il report.
- Vieta ai subagent di lanciare Playwright: le run le fai TU, `--workers=1`.
- Non fidarti dei report degli agenti. Ieri due agenti su due hanno consegnato lavoro corretto nella
  sostanza e sbagliato in un dettaglio ciascuno (un orario fuori dagli orari di apertura, un
  confronto di email che ignorava la normalizzazione in minuscolo): entrambi trovati **eseguendo**.
- Con Matteo: parla per schermate e flussi concreti, non per nomi di file. Breve di default.

METODO CHE HA FUNZIONATO, riusalo:
1. **Prima misura, poi decidi.** Prima di scrivere un test, interroga il DB TEST in sola lettura e
   scriviti i valori veri (fasce, cap, orari di apertura, configurazione del form): metà dei rossi
   nasce da un presupposto sbagliato sull'ambiente, non da un difetto.
2. **Attenzione a come misuri.** Ieri ho quasi scritto una conclusione sbagliata confrontando due
   conteggi su una finestra mobile di 10 minuti: le righe vecchie escono dalla finestra e il
   confronto non significa niente. Se misuri un effetto, misura l'effetto (la risposta della
   richiesta), non un contatore che si muove da solo.
3. Nel prompt all'agente scrivi una sezione «fatti già verificati, non ri-derivarli» con `file:riga`,
   e digli cosa NON deve toccare. Due agenti su file disgiunti, zero collisioni.
4. Quando un test è rosso, guarda lo SCREENSHOT (`test-results/**/test-failed-1.png`) e
   `error-context.md` prima del codice.

FUORI PERIMETRO: rollout PROD (migrazioni 063→071 + Edge create-booking, PROD ancora v21, + client,
tutto INSIEME e solo con autorizzazione esplicita) · capienza pubblica D38 · merge env/test → main ·
i 14 path rotti di validate:docs in docs/Console-Skill/.

Comincia leggendo, poi dimmi cosa hai trovato e come vuoi dividere il lavoro. Se hai dubbi
parliamone prima, poi lavora in autonomia.
```

---

## Perché è scritto così (note per il senior, non per l'agente)

- **Parte dalla Fase 3, non dalla Fase 2**: la tabella §4 del piano è tutta ✅ e il rischio numero uno
  resta che qualcuno rilegga un documento vecchio e riscriva test già scritti.
- **Le due trappole sono in cima e non in fondo**: costano ore se scoperte da sole, e una delle due
  (il limite di frequenza) può bloccare la macchina di sviluppo per 24 ore.
- **Lo scarto d'orario è descritto come domanda aperta, non come lavoro da fare**: è un difetto reale
  ma la sua correzione tocca una funzione già in produzione, e quella decisione è di Matteo.
- **Il paragrafo sul «come misuri»** è nuovo: nasce da un errore mio di ieri, ed è il tipo di errore
  che si ripete finché non è scritto.
