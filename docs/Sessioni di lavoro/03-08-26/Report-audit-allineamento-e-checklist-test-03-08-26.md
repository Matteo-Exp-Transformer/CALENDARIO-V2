# Audit allineamento skill/codice + due checklist di test (03-08-2026)

> Branch `env/test`. **Nessun file di codice toccato, nessun commit, nessuna scrittura su TEST o PROD.**
> Metodo: 5 agenti Sonnet su fronti disgiunti (skill Servizio, skill resto app, caccia bug, copertura
> test, esiti collaudi) + **controverifica personale di ogni voce grave** prima di scriverla qui.
> Bilancio della controverifica: 1 voce confermata con precisazione, 1 corretta in entrambe le
> direzioni, 1 smentita, 2 trovate da me e da nessun agente. Nessuna voce è stata accettata così com'era.

---

## 1. Cappello

- **Cosa ho trovato:** un bug **bloccante** mai visto prima (elimini un tavolo occupato e la
  prenotazione resta appesa, senza modo di sbloccarla da interfaccia); una regola di prodotto che si
  comporta in due modi diversi a seconda della schermata da cui la usi; un editor di fasce che accetta
  cose che l'altro editor rifiuta; e una serie di documenti-guida che raccontano un'app diversa da
  quella che c'è.
- **Cosa NON è vero,** contro quanto dichiarato nell'handoff: il re-merge di `main` **non è** un blocco
  al rollout, il contenuto è già dentro `env/test`.
- **Serve una tua azione:** sì — la **Checklist A** (§5) è tua, a mano. Le decisioni di prodotto in
  coda alla §4 sono tue.

---

## 2. Stato git (fotografia di adesso)

| Cosa | Stato |
|---|---|
| Commit su `env/test` non pushati | **3** — `3e9fa2c`, `ae4e7ae`, `5780717` |
| Aggiornamento `HANDOFF_S4_SENIOR.md` | **non committato** (75 righe) |
| `main` | fermo a `22befb6`, indietro di tutto S4 |
| Re-merge `main` → `env/test` per `f617077` | ⚠️ **blocco stantio, non reale** — vedi sotto |

**Il re-merge non è un cancello.** L'handoff lo dà come *"da fare prima di qualsiasi rollout"*. Ho
verificato il contenuto: la fix di `f617077` (lettura override su `date_from`/`date_to`,
`resolveOverrideMaxGuests`) **è già dentro `env/test`** —
`supabase/functions/create-booking/index.ts:66` e `:534-545`, col suo test
`resolveOverrideMaxGuests.test.ts`. L'unico contenuto presente in `main` e assente da `env/test` è la
versione *vecchia* delle righe che S4 ha riscritto. Il re-merge resta utile per igiene git, ma il
rischio che quel punto voleva scongiurare (rollout PROD che perde la fix) **non esiste**.

---

## 3. Bug, regressioni, task incompleti

Ordine per gravità. La colonna «Verifica» dice chi l'ha dimostrato: *io* = riletto il codice di
persona in questa sessione.

### 🔴 BLOCCANTE

**B-1 — Elimini un tavolo occupato e la prenotazione resta appesa per sempre.**
`useDeleteTable` (`src/features/booking/hooks/useServizioTables.ts:148-175`) fa un soft-delete secco
(`active: false`): **non controlla se il tavolo ha un'assegnazione attiva e non la libera**. Il
chiamante non mette una guardia: `ServizioPage.tsx:158` è `handleDelete(id) { deleteTable.mutate(id) }`,
nient'altro. Il confronto che rende evidente la dimenticanza: **l'eliminazione della *sala* fa la cosa
giusta** — `useRooms.ts:205-238` cerca gli assignment attivi e li timbra prima di disattivare.

*Scenario concreto:* assegni Rossi al Tavolo 3, poi elimini il Tavolo 3 dalla vista Modifica. Il tavolo
sparisce, la riga di assegnazione resta con `checked_out_at = null` su un tavolo inattivo. Nella pagina
Servizio quella prenotazione compare **senza tavoli e senza il pulsante «Togli tavolo»**: non c'è
nessun percorso da interfaccia per rimetterla in circolo. *Verifica: io.*

### 🟠 ALTA

**B-2 — Lo stesso spostamento consuma un turno o no, a seconda di dove lo fai.**
Hai deciso il 02-08 che *spostare un cliente non deve bruciare un turno*. È stato applicato alla
sostituzione guidata (S4-FIX-5), **ma non al percorso «Modifica tavolo» dal Calendario**:
`useReleaseBookingAssignment` (`useTableAssignments.ts:762-765`) timbra sempre `checked_out_at`, e
`countTurnsUsed` (`tableTurnLimits.ts:44-49`) conta **tutte** le righe, timbrate incluse — quindi quel
percorso consuma un turno del tavolo di partenza. Non è codice sciatto: è la regola D48 «append-only»,
scritta prima, che collide con la decisione presa dopo. Nessuno ha riconciliato le due.
*Verifica: io.*

**B-3 — L'avviso di fine turno ritorna dopo un reload** (`FU-SERV-RELEASE-NOTICE-1`, già noto e
aperto). `handledReleaseTableIds` in `AssignmentMapPanel.tsx:311` è uno stato React locale mai
persistito. Il test e2e che lo cattura resta rosso di proposito. *Verifica: agente + già documentato.*

**B-4 — La sostituzione guidata non è atomica.** `useForceReplaceBookingOnTable`
(`useTableAssignments.ts:473-605`) fa 2-3 scritture in sequenza senza RPC: un errore a metà può
lasciare il cliente scavalcato su due tavoli, o un tavolo libero con due prenotazioni in stato
incoerente. È esattamente il problema che per il walk-in è stato chiuso con la RPC `069` nello stesso
periodo — qui no. *Verifica: agente, non ricontrollato da me riga per riga.*

**B-5 — L'editor delle fasce in Servizio accetta cose che l'altro editor rifiuta.**
La stessa validazione esiste in **tre versioni divergenti**:

| Dove | Formato HH:mm | Inizio == fine | Nome duplicato | Sovrapposizione |
|---|---|---|---|---|
| `bookingTimeSlots.ts:25` `validateSlotConfigs` | ✅ | ✅ | ✅ | ✅ |
| `RestaurantSettingsTab.tsx:95-112` (Impostazioni) | ✅ | ✅ | ❌ | ✅ |
| `ServiceSlotsManager.tsx:561-570` (Servizio) | ❌ | ❌ | ❌ | ✅ |

La versione completa **non è chiamata da nessuno**: è codice morto. Il piano di FIX-6 diceva di
riusarla perché *«già esiste e già funziona sull'altro editor»* — premessa sbagliata, anche l'altro
editor la reimplementa per conto suo. *Verifica: io.*

> **Nota:** la presunta contraddizione su FIX-6 segnalata da un agente (*«le riprove trovano ancora le
> fasce sovrapposte accettate»*) **è smentita**: il blocco esiste davvero, `ServiceSlotsManager.tsx:561-570`,
> e usa `slotRangesOverlap`, che gestisce l'overnight internamente (`bookingTimeSlots.ts:63-87`). Le
> riprove erano anteriori al commit del fix.

### 🟡 MEDIA

- **B-6** — `max_turns` è **sovraccarico**: lo stesso campo comanda «quanti giri fa un tavolo» *e*
  «servizio chiuso» (`tableTurnLimits.ts:44-66`). `MASTERPLAN_SERVIZIO.md:140-145` (D41) prescrive
  l'opposto — che il motore lo ignori come contatore — e non è mai stato revisionato. Non è un bug
  oggi, ma il ciclo chiudi → riapri (con `max_turns_resume`) non è mai stato provato. *Verifica: io.*
- **B-7** — Checkout non atomico (mitigato da toast) ed eliminazione sala in 3 scritture. *Agente.*
- **B-8** — Codice morto in `shifts.ts` con lo stesso bug fuso orario «+2h» già corretto altrove; zero
  call-site oggi, ma è una mina se qualcuno lo richiama. *Agente.*

**Stato salute:** `npm run typecheck` pulito, `npm run lint` pulito, `npm run test` **1283/1283 verdi**
(156 file). Nessun `TODO`/`FIXME`/`console.log` residuo nei file toccati ad agosto.

---

## 4. Allineamento skill / contesto — cosa mente

### 🔴 Da correggere prima di far lavorare un altro agente

| Documento | Cosa dice | Cosa è vero |
|---|---|---|
| `ADMIN_SHELL_PAGES_CONTEXT.md:189-198` | Le «Sale» sono stringhe in `restaurant_settings`, nessuna tabella | `rooms` è una tabella reale dalla mig. 008, con CRUD in `useRooms.ts` |
| `ADMIN_SHELL_PAGES_CONTEXT.md:341-342` | Il walk-in non ha ancora una RPC transazionale | Esiste dalla mig. `069` (`create_walk_in_with_assignment`) |
| `docs/DATABASE.md` | — | **Zero occorrenze** delle migrazioni `049`, `052`, `053`, `056`, **`068`, `069`**. Le ultime due sono quelle del 3 agosto, cioè proprio quelle che servono al rollout PROD |
| `Legal-Production-Skill/LEGAL_STATE_CONTEXT.md:105` | `send-email` «non esiste ancora» | È completa, usa Brevo, gestisce la disiscrizione GDPR ed è **attiva in PROD da metà giugno** |
| `DB_SCHEMA_CONTEXT.md:265` | `daily_guest_limit` è una chiave admin viva | Rimossa il 18-06: il modello vivo è `slot_limit_enabled` + `slot_guest_capacities` + `booking_reject_out_of_slot` |
| `ROADMAP_LAVORI_AGENTI_SERVIZIO.md:83-90` | «primo passo da fare adesso»: il fix Edge S0 | Fatto e in PROD da giugno; S1-S4 pure. File fermo al 21-06 |
| `MASTERPLAN_SERVIZIO.md:140-145` (D41) | Il motore deve ignorare `max_turns` come contatore turni | Il codice lo usa come contatore per tavolo (vedi B-6). Decisione mai revisionata |
| `COLLAUDO_S4_CHECKLIST.md` | Tutte le voci `- [ ]` non spuntate | Gli esiti reali vivono solo in `SINTESI.md`/`CORSIA_*`/`RIPROVA_*`/handoff. Il «prompt di consolidamento» previsto non è mai stato eseguito |
| `STATO_BLINDATURA_CHECKLIST.md:41` | Servizio ⬜ «non mappato» | Fermo al 17-06, contraddice l'handoff che descrive la pagina quasi tutta in piedi |
| `SLOT_CLOSED` (Edge 409, mig. 067) | — | Non documentato in **nessuna** skill canonica, solo nei report di sessione |

### 🟡 Minori
`defaultPlacement` → in realtà `defaultRoomId`; indice unico nome tavolo (mig. 068) assente da
`ADMIN_SHELL_PAGES_CONTEXT`; Privacy Policy dichiarata v2.0 ma il codice è a v2.2;
`MARKETING_SKILL.md` dice che i feature-flag si attivano solo via SQL mentre la Console li ha dal 22-06;
tabella «File chiave» dell'assegnazione incompleta.

> **Correzione a un agente:** uno dei report sostiene che la **Console super-admin non esiste**. Falso:
> vive in `console/` come app separata con 14 componenti (`FeatureFlagsPanel.tsx`, `EditionSelector.tsx`, …).
> L'agente ha guardato solo dentro `src/`.

---

## 5. CHECKLIST A — **solo tua, a mano**

Sono le prove che un test automatico non può fare (giudizio visivo, PDF, dispositivo vero) o che
nessuno ha mai fatto. Ogni voce dice **cosa fare**, **cosa dovrebbe succedere** e **cosa mi aspetto
succeda davvero**. Le prime tre sono caccia a bug: lì l'obiettivo è *romperla*.

### 🔴 A-1 — Il tavolo che sparisce sotto il cliente *(nuovo, mai provato)*
1. Servizio → assegna una prenotazione a un tavolo, verifica che diventi occupato.
2. Passa a **Modifica** → elimina **quel** tavolo.
- **Dovrebbe:** avvisarti che è occupato, come fa quando elimini una *sala*.
- **Mi aspetto:** lo elimini in silenzio, e la prenotazione resti visibile **senza tavolo e senza il
  pulsante «Togli tavolo»** — bloccata, senza uscita da interfaccia.
- ⚠️ Fallo su un tavolo **di prova**. Se si comporta come previsto, quella prenotazione va sbloccata a
  mano dal database: non fartelo capitare su un dato che ti serve.

### 🔴 A-2 — Lo stesso spostamento, due conteggi diversi *(contraddice la tua decisione del 02-08)*
Prepara una fascia con **max 2 turni** per tavolo, assegna un cliente al Tavolo 1, annota i turni residui.
1. **Percorso Servizio:** riquadro sostituzione sul tavolo occupato → **«spostalo»** sul Tavolo 2.
   Guarda i turni residui del Tavolo 1.
2. Rifai la stessa situazione. **Percorso Calendario:** apri la prenotazione → **«Modifica tavolo»** →
   spostala sul Tavolo 2. Guarda di nuovo i turni residui del Tavolo 1.
- **Dovrebbero:** essere identici — hai deciso che spostare non brucia un turno.
- **Mi aspetto:** il primo non consumi, il secondo sì.

### 🔴 A-3 — L'editor fasce di Servizio accetta ciò che Impostazioni rifiuta
In **Servizio → fasce**:
1. Crea «Cena» 19:00-23:00. Poi crea una **seconda** fascia chiamata di nuovo **«Cena»** 12:00-15:00
   (non sovrapposte). → **Mi aspetto che la accetti.** Dovrebbe rifiutare il nome doppio.
2. Prova una fascia con **inizio uguale alla fine** (es. 20:00-20:00). → **Mi aspetto che la accetti.**
3. Ora vai in **Impostazioni → fasce** e riprova il punto 2: lì *dovrebbe* essere bloccato. Il confronto
   è la prova.
4. Controprova che il blocco che *funziona* funzioni davvero: prova a salvare due fasce **sovrapposte**
   (19:00-23:00 e 22:00-01:00). Questa **deve** essere rifiutata.

### 🟠 A-4 — «Chiudi servizio» arriva davvero al cliente? *(corretto, mai visto da un browser)*
1. Admin → Servizio → **chiudi** una fascia.
2. Apri un'altra finestra **in incognito** su `/prenota/<slug>` e guarda se gli orari di quella fascia
   sono spariti. Prova a prenotarci.
- Il fix è stato verificato **solo con chiamate tecniche**, mai con un click vero.
- ⚠️ **Vale solo su TEST.** In produzione gira ancora la versione senza il fix: lì il buco è
  presumibilmente **ancora aperto**.

### 🟠 A-5 — Il ciclo chiudi → riapri della fascia *(mai provato)*
Fascia con **3 turni** → «Chiudi servizio» → «Riapri».
- **Guarda:** i 3 turni tornano, o si sono persi? Un solo campo comanda entrambe le cose (B-6).

### 🟠 A-6 — Il PDF del briefing *(nessuno l'ha mai aperto)*
Scarica il PDF e **aprilo davvero**: orari giusti (non sfasati di 2 ore), colonna Tavolo popolata,
fasce che scavallano la mezzanotte corrette, nomi dei tavoli di una tavolata separati da virgola.

### 🟠 A-7 — I quattro fix di aspetto che nessun occhio umano ha mai visto
I 7 punti «Servizio-UI» li hai già confermati tu. **Questi quattro no** — gli agenti che li hanno
scritti hanno dichiarato di non avere un browser:
- card «Assegnate» che si apre, «togli tavolo», **lampeggio** del tavolo in piantina (e contorno
  statico se hai le animazioni ridotte a sistema);
- **frecce** di scorrimento nella striscia in testata, che non devono coprire le card;
- **ora di arrivo** sulla card;
- **sagome dei tavoli più grandi** in piantina, senza sovrapposizioni brutte.

### 🟠 A-8 — Sostituzione guidata a 3 vie *(mai provata dal vivo)*
Tavolo occupato → il riquadro deve chiedere **cosa fai di chi è seduto**: «spostalo» / «ha finito» /
«torna in attesa». Prova tutte e tre e dopo ognuna **guarda i turni residui**: solo «ha finito» deve
consumare un turno. Su una **tavolata** deve agire solo sul tavolo conteso, non sugli altri.

### 🟡 A-9 — L'avviso di fine turno dopo un ricaricamento *(bug noto — per vederlo coi tuoi occhi)*
Quando compare «Tavolo a fine turno», premi **«Ancora occupato»**, poi **ricarica la pagina**.
L'avviso ritorna. Serve la tua decisione su come ricordarsi la conferma (solo per questa sessione del
browser, oppure salvata nel database?).

### 🟡 A-10 — Walk-in dal vivo *(solo test tecnici finora)*
Walk-in su un tavolo **occupato**: la conferma a due click deve essere stabile, senza sfarfallii.
Poi **cambia sala o tavolo** a metà: la conferma deve azzerarsi.

### 🟡 A-11 — Il form Classic, per intero *(bloccato all'automazione da sempre — solo tu puoi)*
Compila e **invia davvero** una prenotazione dal form pubblico Classic (la spunta Privacy non è
azionabile da un agente). Poi provane una **oltre il limite di coperti** e verifica che venga rifiutata
col messaggio giusto.

### 🟡 A-12 — Ora di punta in Analytics *(corretta a giugno, mai riprovata)*
Guarda che l'ora di punta non sia sfasata di 2 ore. Stessa causa del bug degli stati tavolo, corretta
insieme ma mai ricontrollata.

### Decisioni che aspettano solo te
- Come persistere la conferma dell'avviso fine turno (A-9).
- Soglia di ritardo: **15'** va bene? Buffer di riassetto: **10'** va bene? *(mai confermati)*
- Durata walk-in (D47, default 90'): dove si regola?
- La posizione del pulsante «Aggiungi tavolo» per sala è diversa da quanto scritto nel piano: va bene?

---

## 6. CHECKLIST B — **per gli agenti e2e**

### B-0 · Da sistemare **prima** di scrivere test nuovi

Aggiungere copertura sopra una base che mente non serve.

| # | File | Problema | Azione |
|---|---|---|---|
| 1 | `e2e/admin-calendar-blindatura.spec.ts:166,175,194,264` | Scrive e asserisce su **`daily_guest_limit`**, un setting che ho verificato **non essere letto da nessun file applicativo** (zero occorrenze in `src/` fuori dai test). La causalità che il test presuppone non esiste più | Farlo girare: è già rosso, o è **verde per coincidenza**? Poi riscriverlo su `slot_limit_enabled` + `slot_guest_capacities` |
| 2 | `e2e/admin-classic-tabs.spec.ts:102,118` · `edition-classic.spec.ts:32` · `admin-shell-blindatura.spec.ts` · `edition-upgrade.spec.ts` | **Self-skip silenziosi**: se lo staging non ha i dati attesi o il login fallisce, il test *salta* invece di fallire → appare verde senza aver verificato niente | Trasformare gli skip da dati mancanti in **fallimenti**, o seminare i dati con gli helper già esistenti |
| 3 | `e2e/public-booking.spec.ts:8` | Slug di default `'test'`, che `TESTING_SKILL.md` §8.3 dice esplicitamente di non usare più | Passare a `getExistingTenantSlug` come fa `public-booking-smoke.spec.ts` |
| 4 | `e2e/menu-crud.spec.ts:29` | Intera suite in `test.skip(true, 'suite legacy…')`, non gira mai | Cancellarla: è sostituita dalle due spec magazzino |
| 5 | `e2e/invite-flow.spec.ts:14,34,44` | 3 test su 4 dipendono da `E2E_VALID_INVITE_TOKEN`, un token che per natura si consuma | Generare il token nel `beforeAll` invece di leggerlo dall'ambiente |
| 6 | `e2e/pro/pro-service-tables-lifecycle.spec.ts:177` | Rosso **di proposito** ma non marcato: nessun `.fail()`, quindi in CI sembra una rottura vera | Marcarlo `test.fail()` finché il bug è aperto, così il verde torna a significare «tutto a posto» |

### B-1 · Test da scrivere, in ordine di rischio

| # | Flusso da coprire | Base da cui partire | Perché conta |
|---|---|---|---|
| 1 | **Eliminazione di un tavolo occupato** (bug B-1) | nessuna | Bloccante, oggi zero copertura |
| 2 | **Chiusura fascia → lo slot sparisce dal form pubblico**, da browser | `pro-service-tables-lifecycle.spec.ts` per il lato admin + `public-booking-smoke.spec.ts` per il lato cliente | Decide se un cliente reale può prenotare: oggi verificato **solo via REST** |
| 3 | **«Modifica tavolo» dal Calendario non consuma un turno** (bug B-2) | `useTableAssignments.fix2.test.ts` (unit) | Contraddice una decisione di prodotto esplicita |
| 4 | **Editor fasce: nome duplicato, inizio==fine, sovrapposizione** (bug B-5) | `serviceSlots.sovrapposizione.test.tsx` (unit, da portare a e2e) | Tre validazioni divergenti |
| 5 | **Walk-in end-to-end a browser** (doppio click su tavolo occupato, azzeramento al cambio sala) | solo unit oggi (`useWalkInMutation.rpc.test.tsx`) | L'operazione più frequente dello staff durante il servizio |
| 6 | **Turni esauriti + «Assegna comunque»** a browser | `AssignmentMapPanel.fix2.test.tsx` (component) | Il riquadro ambra sotto la modale è già stato un bug una volta |
| 7 | **Avviso fine turno: casi «Libero», «Decido dopo», cambio fascia azzera** | `pro-service-tables-lifecycle.spec.ts` — pattern `page.clock` già stabilito | 4 voci di checklist mai verificate dal vivo |
| 8 | **Tavolata a 3+ tavoli**, «Mancano N posti», **Annulla dopo assegnazione multipla** (tutti i tavoli tornano liberi) | stesso file — oggi copre solo 2 tavoli e la liberazione parziale | Voci di checklist mai diventate test |
| 9 | **Badge % Calendario**, unit isolato sui rami D38/tavoli/Classic | nessuna | Logica ramificata, zero test isolati |
| 10 | **Impostazioni: Salva → reload → il dato persiste** | `admin-settings-blindatura.spec.ts` (copre solo guard e anteprime) | Il giro completo non è mai stato verificato |
| 11 | **Modali Servizio a 375/834/1280**: sala, tavolo, walk-in, briefing, assegna multi-tavolo | solo la finestra fine turno è coperta | 6 voci su 7 mai automatizzate |
| 12 | **Form Classic: invio completo + oltre-limite** | sbloccabile cliccando per **ruolo/label** invece che sull'icona (metodo già iniziato in `RIPROVA_D`) | Debito di collaudo aperto da sempre |
| 13 | **CRM: crea campagna → scegli destinatari → invia** (fino al limite prima di Brevo) | `pro-crm.spec.ts` è smoke puro | Zero copertura su una feature attiva in PROD |

### B-2 · Già coperto — **non riscrivere**

- **Ciclo di vita tavoli** (6 test verdi): checkout append-only, «Decido dopo» con due tavoli, tavolata
  con liberazione parziale e archiviazione solo all'ultimo, 5 stati in sequenza con `page.clock`, vista
  Lista senza stato live, pulsanti a 375px — `e2e/pro/pro-service-tables-lifecycle.spec.ts`.
- **Prenotazione pubblica**: 9 test smoke + 5 form + 4 su `compilable_category_keys`.
- **Menu QR pubblico**: 3 test (homepage/categoria/back, carosello/tema/ordine, icona default).
- **Login/auth**: 5 admin + 3 Pro + protezione dati Classic via RLS.
- **Menu & Magazzino**: toggle disponibilità con propagazione + controtest «rompi».
- **Calendario/prenotazioni**: viste responsive, accept con capienza/orario superati, modale rifiuta.
- **Unit/integration**: **1283 test verdi su 156 file** — copertura molto densa su capienza, digest,
  email template, walk-in RPC, nome tavolo unico, sale soft-delete, turni.

> **Nota di realtà su «PWA»:** non esiste nel codice — niente `manifest.json`, nessun service worker.
> Oggi «PWA» qui significa solo *responsive*, che è ben coperto. Non scrivere test di installabilità.

---

## 7. Cosa NON ho fatto

- **Nessun bug corretto** — nemmeno dopo che sono arrivate le decisioni. B-1, B-2, B-5 e
  `FU-SERV-RELEASE-NOTICE-1` sono ora **sbloccati** (decisioni D-A/D-B/D-C/D-D, §8), ma la richiesta
  esplicita era «crea un plan per il prossimo agente senior»: i quattro fix sono la **Fase 0** di
  [PIANO_SENIOR_TEST_E_SALUTE_CODICE.md](PIANO_SENIOR_TEST_E_SALUTE_CODICE.md), con criteri di
  accettazione scritti, non lavoro fatto qui.
- **Nessun documento di skill aggiornato.** Le divergenze della §4 sono elencate ma non sanate: sono
  ~15 modifiche su 10 file, e volevo che le vedessi prima.
- **Nessun test eseguito con Playwright** (tocca il database di staging), quindi il sospetto su
  `admin-calendar-blindatura.spec.ts` resta un **sospetto forte, non una conferma**: è la prima cosa da
  far girare.
- **Nessun commit, nessun push, nessuna scrittura su TEST o PROD.** I 3 commit non pushati e l'handoff
  non committato erano già così all'apertura della sessione.

---

## 8. Dati comunicazione

- Prompt sostanziale 1 (verbatim): «@docs/Sessioni di lavoro/02-08-26/HANDOFF_S4_SENIOR.md leggig
  il file e ultimo report di lavoro. Poi analizza con sub agents (lancia piu agenti sonnet) tutti i
  lavori fatti nell'ultim mese e assicurati che skill system e contesto siano alineati a stato reale
  del codice. identifichiamo bug regressioni o incompletamenti task. scopo avere una checklist di test
  che posso fare SOLO io ( solo quelli di flusso utente finale per comodità U e caccia a bug di
  utilizzo particolare) e una chekclist per agenti che testeranno in e2e cosa manca da testare e cosa
  non è stato gia testato o ha gia un test di riferimento.» (refusi originali mantenuti).
- Prompt sostanziale 2 (verbatim, dopo la consegna dell'audit): «rispondo alle tue domande. poi crea
  un plan per prossimo agente senior che supervisionerà: 1. lavoro di agenti nel creare test e2e e i
  test mancanti in generale. 2. verificare funzionamento test esistenti. 3. rieseguire analisi
  strutturale e di stato di salute del codice, per verificare che tutto sia coerente e solido. dimmi
  brevemente rispetto a pagina servizio completa ( cosa è stato definito in contesto e cosa manca da
  definire ) a che punto siamo sullo sviluppo della funzione. risposte : eliminazione tavolo deve
  comportarsi come eliminazione sala avvisando prima. il turno non si brucia anche se modifico un
  tavolo . sistemiamo. non capisco cosa devo decidere in merito a editor di fasce. le logiche mi
  sembrano coerenti per corretto utilizzo dell'app. se ci sono dubbi o conflitti da considerare
  parliamone se no convalidiamo la logica.» (refusi originali mantenuti). → decisioni D-A, D-B, D-C.
- Prompt sostanziale 3 (verbatim): «questo non mi è chiaro non l'ho ancora testato. cosa devo decidere
  in pratica e che scelte abbiamo» — riferito all'avviso di fine turno. Ho riformulato la domanda in
  termini di sala invece che tecnici, separando le due domande nascoste (dove ricordare / per quanto
  tacere) e proponendo 3 opzioni: ha scelto **«ricorda per tutti + richiama dopo un po'»** → D-D.
- **Lezione:** la prima volta avevo posto la domanda in termini di implementazione («localStorage o
  colonna DB?») e Matteo non poteva rispondere — non è la sua lingua. Riformulata come «cosa deve fare
  l'app quando il cameriere preme Ancora occupato», ha deciso subito e ha scelto l'opzione **più
  ricca**, non la più semplice. Le decisioni di prodotto vanno chieste in termini di sala, sempre.
- Formato che ha funzionato: il prompt conteneva **già** il criterio di divisione delle due checklist
  («solo flusso utente finale» vs «cosa manca / cosa ha già un test di riferimento») — non ho dovuto
  chiedere nulla per scoprirlo, e ha determinato la struttura di §5 e §6.
- Cosa si può automatizzare: il ciclo «5 agenti su fronti disgiunti → controverifica personale di ogni
  voce grave prima di scriverla». Ha corretto o smentito 3 voci su 5 controllate.
- Cosa lasciare manuale: le due decisioni di prodotto in coda alla §3 (come deve comportarsi
  l'eliminazione di un tavolo occupato; come persistere la conferma dell'avviso fine turno).

## 9. Derivazione errori

1. **Bug preesistente mai visto (B-1)** — `useDeleteTable` non ha mai avuto la guardia che invece
   `useDeleteRoom` ha. Causa: le due funzioni sono state scritte in momenti diversi e la logica di
   rilascio è stata aggiunta solo alla sala; nessuna checklist di collaudo ha mai incluso «elimina un
   tavolo **occupato**» — solo «elimina un tavolo».
2. **Collisione di regole (B-2)** — D48 «append-only» (giugno) e la decisione «spostare non brucia un
   turno» (02-08) sono state applicate a due percorsi diversi senza che nessuno verificasse l'altro.
   Evitabile solo cercando *tutti* i punti che timbrano `checked_out_at` al momento della decisione.
3. **Premessa sbagliata propagata (B-5)** — il piano di FIX-6 affermava che `validateSlotConfigs` fosse
   «già usata dall'altro editor». Non lo era: è codice morto. L'affermazione è stata creduta e
   ripetuta anche nella memoria di progetto, e nessuno l'ha controllata finché non l'ho fatto qui.
4. **Errore di un agente, corretto in revisione** — un report ha dichiarato inesistente la Console
   super-admin: aveva cercato solo dentro `src/`, mentre vive in `console/` come app separata.
5. **Errore di un agente, corretto in entrambe le direzioni** — un report ha dato per mancanti in
   `DATABASE.md` le migrazioni «049-056»: alcune di quelle sono citate in prosa, ma mancano del tutto
   `049`,`052`,`053`,`056` **e `068`,`069`**, che l'agente non aveva visto.

## 10. Domande di chiusura

```
❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: **Tre**, tutti riportati verbatim in §8 sopra coi refusi originali. Il primo (audit + due
checklist) ha generato §1-§7; il secondo ha portato le decisioni D-A/D-B/D-C e la richiesta del piano
per il prossimo senior; il terzo ha chiuso D-D dopo che avevo riformulato la domanda in termini di
sala. Tutti gli altri turni della sessione sono stati notifiche automatiche di completamento degli
agenti in background e richiami dell'hook di fine sessione, esplicitamente marcati come NON input
umano — nessuno di essi è stato trattato come approvazione. **Non c'è alcuna autorizzazione a fare
push**: non è mai stata chiesta né data.

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Sì. Questa sessione **non ha modificato codice**: il working tree contiene solo
`HANDOFF_S4_SENIOR.md` modificato (eredità della sessione precedente, non mia) e due file non tracciati
(il report del cantiere di ieri e questo report). Quindi «dati = diff» qui significa: le affermazioni
del report corrispondono ai file reali. Ho aperto di persona, in questa sessione: `useServizioTables.ts`
righe 130-190 (confermato che `useDeleteTable` fa solo `active:false`, nessun controllo assegnazioni)
· `ServizioPage.tsx` righe 145-165 (confermato `handleDelete` senza guardia) · `useRooms.ts` via grep
righe 89-238 (confermato che l'eliminazione sala **sì** cerca e timbra gli assignment attivi, ed è
tabella reale: `from('rooms')` a 42/119/157/237, creata da `008_rooms_and_table_layout.sql`) ·
`useTableAssignments.ts` righe 735-785 (confermato che `useReleaseBookingAssignment` timbra sempre
`checked_out_at`) · `tableTurnLimits.ts` per intero (confermato che `countTurnsUsed` conta tutte le
righe e che `max_turns` fa doppio lavoro) · `bookingTimeSlots.ts` righe 1-100 (confermato che
`validateSlotConfigs` valida 4 cose e che `slotRangesOverlap` gestisce l'overnight) ·
`ServiceSlotsManager.tsx` righe 561-570 + grep negativo su nome duplicato/inizio==fine ·
`RestaurantSettingsTab.tsx` righe 95-112 · `AssignmentMapPanel.tsx:311` (confermato `useState`) ·
`MASTERPLAN_SERVIZIO.md` righe 132-150 (D41 verbatim) · `ADMIN_SHELL_PAGES_CONTEXT.md` righe 189-198 e
341-342 · `DB_SCHEMA_CONTEXT.md:265` · `LEGAL_STATE_CONTEXT.md:105` — queste ultime quattro erano
citazioni di agenti che ho riaperto una per una e trovato **esatte alla lettera**. Comandi eseguiti da
me: `git log`/`git show`/`git diff`/`git merge-base` per lo stato branch e per `f617077`; grep di
conteggio su `DATABASE.md` migrazione per migrazione; grep di `daily_guest_limit` su `e2e/` e su
`src/`. I numeri 1283 test/156 file, typecheck e lint puliti vengono dall'esecuzione di un agente, non
mia — li riporto come suoi, non come miei.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: **Nessun file di skill/context/test/tipi aggiornato, deliberatamente.** Motivo: questa sessione è
un audit, non un intervento — il suo prodotto è l'elenco delle divergenze (§4), non la loro correzione.
Sanarle significa ~15 modifiche su 10 file di documentazione (`ADMIN_SHELL_PAGES_CONTEXT.md`,
`DATABASE.md`, `LEGAL_STATE_CONTEXT.md`, `DB_SCHEMA_CONTEXT.md`, `MASTERPLAN_SERVIZIO.md`,
`ROADMAP_LAVORI_AGENTI_SERVIZIO.md`, `COLLAUDO_S4_CHECKLIST.md`, `STATO_BLINDATURA_CHECKLIST.md`,
`MARKETING_SKILL.md`, `ADMIN_SERVIZIO_CONTEXT.md`), e diverse dipendono da decisioni che spettano a
Matteo (D41 va rivisto o va cambiato il codice? la voce su `max_turns` come contatore è un errore di
documentazione o di implementazione?). Correggerle in autonomia avrebbe cristallizzato una mia
interpretazione su una scelta di prodotto. Fuori dal repo ho invece aggiornato la memoria di progetto
`project_servizio_s4_stato.md` (era ferma a «giro 4 da revisionare» e conteneva la premessa sbagliata
su `validateSlotConfigs`) e la sua riga in `MEMORY.md`.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: (1) Non ho corretto **nessuno** dei bug trovati, incluso il bloccante B-1 — serve una decisione
di prodotto su come deve comportarsi l'eliminazione di un tavolo occupato. (2) Non ho sanato le
divergenze documentali (vedi R3). (3) Non ho eseguito **nessun test Playwright**: tocca il database di
staging e non avevo mandato per scriverci, quindi il sospetto su `admin-calendar-blindatura.spec.ts`
resta un sospetto forte e non una conferma — è dichiarato come tale sia in §6 B-0 sia in §7. (4) Non
ho verificato personalmente riga per riga B-4 (sostituzione guidata non atomica) e B-7/B-8: sono
riportati come voci d'agente e nel report è scritto esplicitamente. (5) Non ho fatto push né commit:
mai richiesto, e la regola del repo lo vieta senza richiesta esplicita. (6) Non ho toccato la coda
operativa (rollout PROD, capienza D38, re-merge `main`): fuori dalla richiesta, che era analisi +
checklist.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: L'attrito vero è che **lo stato di collaudo vive in cinque posti diversi e in nessuno di quelli
giusti**: `COLLAUDO_S4_CHECKLIST.md` si dichiara «l'unico dove spuntare» ma è rimasto interamente
`- [ ]`, mentre gli esiti reali sono sparsi fra `SINTESI.md`, le `CORSIA_*`, le `RIPROVA_*` e
l'handoff — ho dovuto dedicare un agente intero solo a ricostruire chi ha provato cosa e con che esito.
Proposta: rendere la spunta della checklist parte del *definition of done* di ogni giro (l'hook di
fine sessione potrebbe controllare che, se un report cita una voce di collaudo, quella voce risulti
aggiornata nel file di checklist), invece di affidarla a un «prompt di consolidamento» finale che
puntualmente non viene eseguito. Secondo attrito minore: la scoperta tecnica su `page.clock` che rompe
il refresh del JWT Supabase è sepolta in `ADMIN_SERVIZIO_CONTEXT.md` §9.13, cioè in una skill d'area,
mentre serve a chiunque scriva e2e — andrebbe in `TESTING_SKILL.md`.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto **giusto in partenza, insufficiente in profondità**: `CLAUDE.md` + handoff + report
dell'ultima sessione bastavano per instradare e per lanciare gli agenti con prompt precisi, ma non
contenevano nulla che facesse sospettare il bug bloccante — l'ho trovato solo perché un agente ha
confrontato eliminazione-tavolo con eliminazione-sala, un confronto che nessun documento suggerisce.
Sugli hook: quello di fine sessione è scattato **cinque volte mentre gli agenti erano ancora in
esecuzione**, e in quel caso è stato rumore — mi chiedeva di confermare una chiusura che non poteva
avvenire, e ho dovuto rispondere «non ho finito» quattro volte prima che il lavoro fosse davvero
concluso. Utile invece l'ultimo scatto, che ha correttamente rilevato la sezione 11 mancante da questo
report. Miglioria concreta: l'hook dovrebbe considerare se ci sono agenti in background ancora vivi
prima di chiedere la chiusura.
```

## 11. Self-review del report

1. **Dati = diff reale:** confermato in R2. Non avendo cambiato codice, ho verificato che ogni
   citazione corrisponda al file reale — incluse le quattro citazioni documentali che venivano dagli
   agenti, riaperte una per una e risultate esatte.
2. **File correlati allineati:** consapevolmente **non** allineati, con motivazione esplicita in R3.
   Non è un debito dimenticato: è l'oggetto stesso del report, in attesa di decisioni di Matteo.
3. **Q1-Q6 coerenti:** sì. In particolare R1 (nessuna approvazione ricevuta), R4 (nessun bug corretto,
   nessun push) e §7 dicono la stessa cosa senza contraddirsi.
4. **Tono utente:** §1, §3 (scenari) e §5 parlano per schermate e flussi concreti; §2, §4, §6 e §8-§11
   sono dati tecnici interni. Distinzione rispettata.
5. **Onestà sui limiti:** le voci non verificate da me (B-4, B-7, B-8) e il sospetto non confermato su
   `admin-calendar-blindatura.spec.ts` sono marcati come tali, non presentati come fatti accertati.
