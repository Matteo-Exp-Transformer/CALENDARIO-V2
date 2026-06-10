# Report — Mappatura completa area Admin

**Data:** 06-06-26  
**Tipo:** mappatura documentale · **Scope:** `/admin` autenticato  
**Stato:** 🔶 mappata a livello doc, non ancora blindata di prodotto

- **Cosa è cambiato:** l'area admin ora ha una cartella skill dedicata che spiega senso, flussi utente,
  flussi dati, rischi e test esistenti per orientare gli agenti.
- **Cosa resta:** intervista Matteo su admin/staff/fallback/azioni pericolose e poi piano test +
  blindatura prodotto.
- **Serve una tua azione:** sì, nella prossima fase serve rispondere alle domande di senso rimaste
  aperte prima di testare tutti i flussi.

---

## Obiettivo

Creare una prima mappa di senso e flusso per tutta l'area admin, prendendo il pattern da Prenota e
Menu QR:

- niente modifiche codice applicativo;
- niente DB/migrazioni;
- separazione per domini;
- codice come fonte di verita;
- buchi di senso da intervistare invece di inventare decisioni.

## Cosa e stato creato

Nuova cartella:

- `docs/Admin-Skill/ADMIN_SKILL.md`
- `docs/Admin-Skill/contesto/ADMIN_USER_FLOW_CONTEXT.md`
- `docs/Admin-Skill/contesto/ADMIN_DATA_FLOW_CONTEXT.md`
- `docs/Admin-Skill/contesto/ADMIN_SHELL_NAV_CONTEXT.md`
- `docs/Admin-Skill/contesto/ADMIN_PRENOTAZIONI_CONTEXT.md`
- `docs/Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md`
- `docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md`
- `docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md`
- `docs/Admin-Skill/contesto/ADMIN_CRM_CONTEXT.md`
- `docs/Admin-Skill/contesto/ADMIN_ANALYTICS_HOME_CONTEXT.md`
- `docs/Admin-Skill/contesto/ADMIN_CONFLICTS_AND_DEBTS.md`
- `docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md`

Aggiornato:

- `docs/Comunicazione-Skill/PROSEGUIMENTO_MAPPATURA_SKILL.md` -> stato Admin shell + pagine 🔶.

## File toccati e perché

| File | Perché |
|---|---|
| `docs/Admin-Skill/ADMIN_SKILL.md` | Entry point dell'area Admin: senso, confini, attori, mappa context e route rapida per azioni pericolose. |
| `docs/Admin-Skill/contesto/ADMIN_USER_FLOW_CONTEXT.md` | Flusso utente tra Home, Prenotazioni, Menu, Impostazioni, Servizio, CRM e Analytics. |
| `docs/Admin-Skill/contesto/ADMIN_DATA_FLOW_CONTEXT.md` | Mappa tabelle/hook/settings e scritture sensibili. |
| `docs/Admin-Skill/contesto/ADMIN_SHELL_NAV_CONTEXT.md` | Route `/admin`, sidebar, Classic/Pro, feature flags, guard dirty e tema. |
| `docs/Admin-Skill/contesto/ADMIN_PRENOTAZIONI_CONTEXT.md` | Calendario, pending, archivio, nuova prenotazione, dettagli e modali. |
| `docs/Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` | Tab Menu come magazzino unico, categorie, ingredienti, preset, QR e sync rename/delete. |
| `docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md` | Anagrafica, orari, tema admin, Personalizza Form e salvataggi. |
| `docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md` | Sale, tavoli, mappa, service slots, walk-in e briefing. |
| `docs/Admin-Skill/contesto/ADMIN_CRM_CONTEXT.md` | Clienti, email normalizzata, create/edit/delete e relazione con prenotazioni. |
| `docs/Admin-Skill/contesto/ADMIN_ANALYTICS_HOME_CONTEXT.md` | Home, KPI, prossime 3 ore, briefing e Analytics. |
| `docs/Admin-Skill/contesto/ADMIN_CONFLICTS_AND_DEBTS.md` | Hardcoded/fallback sospetti, codice residuo, rischi multi-step e priorità test. |
| `docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md` | Inventario iniziale dei test esistenti collegati ad Admin. |
| `docs/Comunicazione-Skill/PROSEGUIMENTO_MAPPATURA_SKILL.md` | Stato lavoro aggiornato: Admin shell + pagine ora 🔶. |
| `docs/Sessioni di lavoro/06-06-26/Report-mappatura-admin-area-06-06-26.md` | Report di sessione e chiusura. |

## Metodo

1. Letti i file guida del pattern: `PROSEGUIMENTO_MAPPATURA_SKILL.md`, `PRENOTA_SKILL.md`,
   `MENU_QR_SKILL.md`.
2. Lanciati sub-agent read-only per domini indipendenti:
   shell/nav, prenotazioni, menu magazzino, settings, servizio, CRM.
3. Mappati localmente Home, Analytics, briefing, walk-in e scanner fallback/hardcoded.
4. Scritti i documenti per dominio.
5. Controverifica documentale con sub-agent terzo su `ADMIN_SKILL.md`.

## Scoperte principali

- `/admin` e una route unica: le "pagine" admin sono stati React interni, non URL.
- Classic mostra solo `AdminDashboard`; Pro/Enterprise aggiunge sidebar e sezioni Home/CRM/Servizio/Analytics.
- `restaurant_settings` e il grande snodo config, ma non va usato per segreti perche alcune chiavi sono pubbliche.
- CRM collega clienti e prenotazioni via email normalizzata, non tramite FK.
- Rename/delete categoria menu tocca piu risorse: menu, QR, Prenota, settings e storage.
- Servizio ha alcuni rischi da verificare: override slot legacy, busy check walk-in, briefing senza join tavolo/sala.
- Header admin ha fallback `Booking SaaS`, da decidere con Matteo.
- Logout non passa dal guard modifiche non salvate.

## Controverifica documentale

Esito sub-agent terzo iniziale: **PASS parziale / borderline**.

Il routing per dominio era chiaro, ma mancava una rotta esplicita per "azioni pericolose" come delete
CRM, cascade/orfani, RLS e flussi multi-step. Correzione applicata in `ADMIN_SKILL.md`: nuova sezione
`7-bis. Route rapida per azioni pericolose`.

Riverifica sul file corretto: **PASS**. Walk-in e delete CRM sono ora instradati ai context giusti
senza bisogno di conoscere questa chat.

## Prossimi passi

1. Intervistare Matteo su admin vs staff, fallback voluti, sezioni usate ogni giorno, azioni pericolose.
2. Rifinire la mappa con le decisioni utente.
3. Preparare piano test flussi admin.
4. Solo dopo: blindatura prodotto con controtest sub-agent su flusso dati + flusso utente.

## Test

Non eseguiti: la fase era documentale/mappatura. I test esistenti sono inventariati in
`docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md`.

## File di skill aggiornati

| File | Modifica | Perché |
|---|---|---|
| `docs/Admin-Skill/ADMIN_SKILL.md` | Nuova skill di area Admin. | Dare un punto di ingresso agli agenti per `/admin` autenticato. |
| `docs/Admin-Skill/contesto/*` | Nuovi context per sotto-domini Admin. | Spezzare l'area grande in file leggibili per funzione. |
| `docs/Comunicazione-Skill/PROSEGUIMENTO_MAPPATURA_SKILL.md` | Stato Admin shell + pagine portato da ⬜ a 🔶. | Sincronizzare il punto di ripresa del lavoro lungo. |
| `docs/Sessioni di lavoro/06-06-26/Report-mappatura-admin-area-06-06-26.md` | Report completato con sezioni di chiusura. | Chiudere la sessione secondo `CHIUSURA_SESSIONE.md`. |

## Dati comunicazione

### Frasi/richieste ricorrenti

| Frase / richiesta Matteo | Conteggio | Effetto sul lavoro |
|---|---:|---|
| "senza modificare o lanciare nulla" / fase preparatoria | 1 | Prima risposta solo chiarimento e domande; poi il piano ha separato mappatura da test/fix. |
| "tutta area admin" | 1 | Scope esteso a `/admin` completo, non solo `AdminDashboard`. |
| "sub agent" / "tu orchestrator" | 2 | Usati sub-agent explorer read-only per domini separati. |
| "ogni singolo elemento" / "devo sapere tutto" | 1 | Documentazione divisa per domini + file conflitti/debiti. |
| "crea un plan" | 1 | Piano decisionale prima dell'esecuzione. |
| "PLEASE IMPLEMENT THIS PLAN" | 1 | Esecuzione documentale della mappa. |
| "completa il tuo report..." | 1 | Aggiunta sezioni di chiusura e procedure skill system. |

### Cronologia / prompt di Matteo annotati

| # | Prompt / sintesi fedele | Intento | Esito agente |
|---|---|---|---|
| 1 | "senza modificare o lanciare nulla, preparati a mappare pagina admin..." | Chiarire lavoro lungo e chiedere intervista prima di agire. | Risposta di conferma + domande. |
| 2 | Risposte 1-10: tutta area admin, prendere `PROSEGUIMENTO_MAPPATURA_SKILL`, admin+staff, sub-agent, cartella ad hoc. | Stabilizzare scope e chiedere piano. | Esplorazione non mutante + piano in `<proposed_plan>`. |
| 3 | "PLEASE IMPLEMENT THIS PLAN" | Creare documentazione Admin-Skill. | Sub-agent read-only, docs create, report e proseguimento aggiornati. |
| 4 | "completa il tuo report..." | Allineare report a procedure finali skill system. | Report completato con sezioni standard/deep e chiusura. |

### Cosa non è successo in chat

| Assenza | Significato |
|---|---|
| Nessun test/build | Coerente: solo documentazione, nessun codice applicativo. |
| Nessuna query DB | Coerente: non serviva per mappa documentale iniziale. |
| Nessun commit/push | Non richiesto; inoltre i nuovi file `docs/` sono gitignored e richiederebbero `git add -f`. |
| Nessuna intervista completa su staff/admin | Rimandata alla fase successiva dopo ricognizione autonoma. |
| Nessun fix codice | Voluto: mappatura prima, test/fix dopo. |

## Analisi flusso prompt, efficienza e statistiche (skill system)

### Statistiche sessione

| Metrica | Valore |
|---|---:|
| Messaggi sostanziali Matteo | 4 |
| Sub-agent explorer read-only usati | 6 + 1 controverifica |
| File documentali creati | 13 (12 in `Admin-Skill`, 1 report) |
| File documentali aggiornati | 2 (`PROSEGUIMENTO`, report stesso) |
| Codice applicativo modificato | 0 |
| Test/build eseguiti | 0 |
| Correzioni dopo controverifica | 1 (`ADMIN_SKILL.md` sezione 7-bis) |
| Commit/push | no |

### Anatomia del prompt principale

| Blocco | Presente | Nota |
|---|---|---|
| Scope | ✅ | `/admin` completa, esclusi Prenota/QR pubblico. |
| Metodo storico | ✅ | Prenota/Menu QR + `PROSEGUIMENTO_MAPPATURA_SKILL`. |
| Vincolo modifiche | ✅ | Solo documentazione, nessun codice/DB. |
| Sub-agent | ✅ | Orchestratore + ricognizioni parallele. |
| Output atteso | ✅ | Cartella dedicata e contesti di senso/flusso. |
| Criterio test | ✅ | Test dopo mappatura, non ora. |
| Intervista | ✅ | Domande da fare dopo prima ricognizione. |

Indice completezza prompt: **7/7** per la fase mappatura documentale.

### KPI efficienza

| Aspetto | Esito |
|---|---|
| Parallelizzazione | Buona: domini separati hanno ridotto rischio di mappa piatta. |
| Rework | Uno solo, generato dalla controverifica documentale. |
| Scope creep | Controllato: niente codice, niente DB, niente test. |
| Punto fragile | Report iniziale troppo scarno rispetto alla procedura di chiusura. |

### Automatizzabile vs manuale

| Cosa | Tipo | Nota |
|---|---|---|
| Generare skeleton `docs/<Area>-Skill/` | Automatizzabile | Pattern ormai stabile. |
| Controllo route "azioni pericolose" | Automatizzabile | Checklist: delete/rename/restore/assignment -> context rischi+dati. |
| Intervista admin/staff | Manuale | Senso prodotto non derivabile dal codice. |
| Blindatura prodotto Admin | Manuale + sub-agent | Serve test reale dei flussi e decisioni su fallback. |

## Lettura qualità agente

- **Cosa ha funzionato:** sub-agent read-only per dominio; controverifica terza utile, ha trovato una
  lacuna reale nel routing documentale.
- **Cosa non ha funzionato al primo giro:** il report era troppo essenziale e non rispettava ancora la
  struttura standard/deep dello skill system.
- **Miglioria suggerita:** per le mappature di area grande, creare subito nel report una sezione
  "azioni pericolose" e una tabella "dominio -> dati -> rischi", senza aspettare la controverifica.

## Derivazione errori

| Evento | Classificazione | Derivazione | Come evitarlo |
|---|---|---|---|
| `ADMIN_SKILL.md` iniziale non instradava esplicitamente delete risk / azioni pericolose | errore agente | La mappa per dominio era corretta, ma non copriva task trasversali di integrità dati. | Checklist fissa: ogni skill di area admin deve avere route per delete/rename/restore/RLS/orfani. |
| Report iniziale privo delle sezioni standard/deep | errore agente | Chiusura scritta come summary operativo, non come report completo secondo `CHIUSURA_SESSIONE.md`. | Caricare `CHIUSURA_SESSIONE.md` prima di dichiarare completo un report standard/deep. |
| `docs/Admin-Skill/` non visibile in `git status` normale | vincolo strutturale | `docs/` è parzialmente gitignored. | Annotare sempre in report/finale che per commit serve `git add -f`. |

## Cosa resta per la prossima sessione

1. Intervistare Matteo su:
   - differenza reale admin/staff;
   - sezioni usate ogni giorno;
   - fallback accettabili (`Booking SaaS`, stati vuoti, dati mancanti);
   - azioni pericolose e conferme richieste.
2. Rifinire `docs/Admin-Skill/*` con le decisioni.
3. Preparare `PLAN_BLINDATURA_ADMIN.md`.
4. Eseguire test flusso dati + flusso utente su Admin.
5. Eventuale commit documentale con `git add -f` per i nuovi file ignorati.

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: Prompt sostanziali ricevuti:
1. "senza modificare o lanciare nulla, preparati a mappare pagina admin... sarà un lavoro lunghissimo ti serviraà un sistema di sub agent..."
2. "tutta area admin... proseguimento mappatura skill è l file da cui cominciare... admin e staff... crea un plan di lavoro"
3. "PLEASE IMPLEMENT THIS PLAN: # Piano — Mappatura Completa Area Admin ..."
4. "completa il tuo report con le sezioni richieste da chiusura sessione e procedure finali di skill system."

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero?
✅ R2: Sì. Ho verificato con `Get-ChildItem` che `docs/Admin-Skill/` contiene 12 file; con `rg` che `ADMIN_SKILL.md` contiene la sezione `7-bis`; con `git diff` che `PROSEGUIMENTO_MAPPATURA_SKILL.md` ha la riga Admin aggiornata a 🔶. `git status --ignored` mostra i nuovi file docs come ignorati (`!!`), coerente con la nota `git add -f`.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica e hai verificato che siano aggiornati?
✅ R3: Allineati i file correlati diretti: nuova skill `docs/Admin-Skill/`, `PROSEGUIMENTO_MAPPATURA_SKILL.md` e questo report. Non ho aggiornato `APP_CONTEXT_SKILL.md §0`: la tabella globale punta ancora a skill storiche admin (`ADMIN_CLASSIC`, `Dashboard-laterale`, `MENU_ADMIN_CONTEXT`). Va deciso se sostituire o affiancare il nuovo `Admin-Skill` senza rompere i LOCK storici.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?
✅ R4: Non ho modificato codice applicativo, non ho lanciato test/build, non ho interrogato DB, non ho fatto commit/push. Non ho ancora intervistato Matteo sui buchi di senso; la mappa resta 🔶 e non blindata.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system?
✅ R5: Attrito: ho scritto prima un report troppo compatto rispetto allo standard richiesto. Miglioria: per ogni sessione `standard/deep`, dopo aver creato report e prima del final, aprire direttamente `CHIUSURA_SESSIONE.md` e compilare le sezioni 1-12, non solo il riepilogo tecnico.

❓ Q6 — Contesto & hook: il contesto caricato era troppo / giusto / troppo poco? E gli hook utili o rumore?
✅ R6: Contesto giusto: `PROSEGUIMENTO_MAPPATURA_SKILL`, Prenota/Menu QR e poi `CHIUSURA_SESSIONE.md` erano sufficienti. Hook/procedura utili: hanno evidenziato che il report mancava delle sezioni finali; non rumore.

## 12. Self-review del report

| Check | Esito |
|---|---|
| Dati = diff reale | ✅ Verificati file creati, stato ignored e diff `PROSEGUIMENTO`. |
| File correlati allineati | ✅ Allineati `Admin-Skill`, report, `PROSEGUIMENTO`; `APP_CONTEXT` segnalato come decisione futura. |
| Q1-Q6 coerenti | ✅ Risposte riferite a questa chat e non piu a "altra sessione". |
| Tono utente | ✅ Sintesi per aree/flussi; dettagli tecnici confinati nelle tabelle. |

Correzione fatta in self-review: sostituito il vecchio placeholder della sezione 11 con risposte reali
della sessione e aggiunte le sezioni standard/deep mancanti.

## Nota terminali

Non sono stati avviati server o processi persistenti dall'agente. Non chiudere eventuali terminali
`npm run dev` aperti da Matteo.
