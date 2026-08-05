# Report — recupero login, documentazione legale, codice morto e handoff Prenota (05-08-2026)

> Branch `env/test`; riferimento locale Supabase `docnnernvpyrbwuzzach`; URL applicazione locale
> puntata a TEST. Nessuna operazione sul database, nessuna migrazione, nessuna scrittura su PROD.
> Codice raccolto in tre commit locali (`651959c`, `a9a7dd3`, `3b4b287`) e documentazione nel commit
> conclusivo della sessione. Nessun push, merge o release.
>
> Mandato: [PROMPT_FIX_LOOP_LOGOUT_LEGALE_CODICE_MORTO.md](PROMPT_FIX_LOOP_LOGOUT_LEGALE_CODICE_MORTO.md).
> Stato iniziale: [Report-rossi-parallelismo-mezzanotte-fase3-05-08-26.md](Report-rossi-parallelismo-mezzanotte-fase3-05-08-26.md).

---

## 1. Esito in breve

| Lavoro | Esito |
|---|---|
| 1 — giro a vuoto Prenota | **Chiuso:** riprodotto 5/5 trattenendo i preset, corretta la causa reale e verificato 10/10 dopo il fix |
| 2 — due recuperi prima del logout | **Chiuso:** massimo tre tentativi totali solo per guasti temporanei |
| 3 — documentazione legale email | **Chiuso come fotografia tecnica:** Brevo e i flussi email ora sono dichiarati; decisioni legali separate in modo esplicito |
| 4 — codice morto | **Chiuso:** quattro funzioni e i relativi test rimossi |

I lavori 3 e 4 sono stati eseguiti in parallelo da due sub-agent Codex su file disgiunti. Il senior ha
poi riletto integralmente entrambi i diff, verificato nel codice e nelle migrazioni le affermazioni
legali e rilanciato personalmente ricerche e test. Tutte le prove browser sono state eseguite dal
senior, una alla volta, con il solo worker già fissato nella configurazione.

---

## 2. Lavoro 2 — due tentativi di recupero prima del logout

Il ripristino della sessione ora distingue due famiglie di esiti:

- guasti temporanei — rete, timeout, troppe richieste, risposte server 5xx ed errori PostgREST di
  connessione — fanno due tentativi di recupero con attese di 300 e 900 millisecondi;
- esiti definitivi — admin assente o revocato, organizzazione inattiva, RPC senza tenant e normali
  rifiuti 4xx — non vengono ritentati e conservano il logout di sicurezza già esistente.

La regola è applicata ai quattro passaggi del riconoscimento admin: sessione, riga `admin_users`,
organizzazione attiva e risoluzione del tenant. Per le chiamate PostgREST il retry automatico della
versione installata di Supabase viene disattivato sulla singola richiesta: in questo modo il limite è
davvero di tre chiamate totali e non si sommano tentativi nascosti.

File principali:

- `src/lib/supabaseRetry.ts` — classificazione e due recuperi;
- `src/contexts/AdminAuthContext.tsx` — sessione, admin e organizzazione;
- `src/contexts/TenantContext.tsx` — RPC tenant;
- test in `useAdminAuth.test.tsx`, `TenantContext.test.tsx` e `supabaseRetry.test.ts`.

Copertura verificata:

- admin revocato: logout immediato, una sola interrogazione;
- primo guasto di rete e seconda risposta buona: l'admin resta dentro;
- tre guasti temporanei consecutivi: logout e pulizia tenant;
- RPC tenant temporaneamente indisponibile: recupero al secondo tentativo;
- classificazione diretta di rete, timeout, 429, tutti i 5xx, normali 4xx e codici PostgREST.

---

## 3. Lavoro 3 — documentazione legale email

I nove documenti interni indicati dal mandato ora descrivono la realtà dell'app:

- Brevo è attivo per email transazionali e campagne marketing;
- destinatari, dati trasferiti, consenso marketing, consenso per dati alimentari, disiscrizione e
  limite campagne sono riportati nell'inventario e nel registro trattamenti;
- la pulizia automatica esistente di `rate_limits` e `ip_blacklist` è documentata senza attribuirle
  una conservazione più lunga di quella implementata;
- il percorso reale del modello DPA clienti è stato corretto;
- download, data e versione del DPA Supabase restano segnati come verifica documentale da fare.

La pagina privacy pubblica non è stata riscritta, come richiesto. I documenti interni segnalano
esattamente che oggi non nomina Brevo e che la conservazione dichiarata per IP/log va riconciliata
con la pulizia tecnica. La sezione **«Da decidere con l'avvocato»** raccoglie DPA Brevo, riga pubblica
dei fornitori, tempi di conservazione e possibili trasferimenti fuori dall'Unione Europea.

`npm run validate:docs` continua a segnalare 14 percorsi rotti, tutti già presenti nella cartella
`docs/Console-Skill/`; nessuno appartiene ai documenti legali modificati in questo lavoro.

---

## 4. Lavoro 4 — codice morto

Rimossi dal codice e dai test dedicati:

- `calculateDailyCapacityV2`;
- `getStartSlotForBookingV2`;
- `isValidName`;
- `getShiftForTimestamp`.

Una ricerca su tutto il repository trova questi nomi soltanto nei report storici. Nessun riferimento
resta in `src`, test, prove browser, funzioni server o script. I tre file di test interessati passano:
**30 test su 30**. La pulizia ha eliminato 16 casi di test e 30 chiamate `expect` dedicate al codice
morto, senza cancellare test di comportamento ancora in uso.

---

## 5. Handoff dedicato — giro a vuoto della pagina Prenota

### Stato reale finale

**Il difetto è stato riprodotto, diagnosticato e corretto in una sessione dedicata successiva.** Il
report completo è
[Report-fix-giro-vuoto-prenota-preset-async-05-08-26.md](Report-fix-giro-vuoto-prenota-preset-async-05-08-26.md).

La precedente batteria di 20 scenari verdi resta una fotografia valida del fatto che il seed eseguito
a velocità normale non forzava la finestra temporale. Non è più lo stato conclusivo del problema.

### Riproduzione deterministica trovata

- Trattenere `get_public_slot_config` fino a dopo il click lascia la prova verde: la vecchia ipotesi
  `rawSlots → slots → gruppi → onChange` è stata esclusa nella condizione controllata.
- Trattenere `booking_custom_staff_presets`, lasciando arrivare gli altri dati del form, produce il
  giro a vuoto dopo la selezione della sotto-scheda.
- La stessa prova è fallita **5 volte su 5** prima del fix, con 9/10/10/11/11 warning
  `Maximum update depth exceeded`.
- Le trace mostrano una sola richiesta preset trattenuta e nessuna raffica di rete: il ciclo era nello
  stato React.

### Causa e correzione

Mentre la query preset era pendente, il fallback inline `data: customStaffPresets = []` creava un
array nuovo a ogni render. La risoluzione delle sotto-schede produceva quindi un nuovo oggetto
`activeSubTab`; il form lo propagava a `BookingRequestPage`, che lo salvava nello stato e provocava il
render successivo. Il ciclo continuava finché arrivavano i preset.

Il fix usa un array vuoto stabile a livello modulo. `useArrivalSlots`, il calcolo orari, le dipendenze
degli effetti e il submit non sono stati modificati.

### Verifica finale

- regressione di componente rossa prima e verde dopo;
- cambi rapidi tipologia e sotto-schede A→B→A: **10/10 verdi** dopo il fix;
- telefono e tablet con aggiornamento completo: verdi;
- spec completa, comprendente lo scenario originale desktop/telefono/tablet: **4/4 verde**;
- commit del fix: **`3b4b287`**.

Il cancello “Pagina Prenota con due o più sotto-schede” è quindi chiuso tecnicamente. Restano soltanto
QA visivo di Matteo e l'eventuale push/release; il piano generale può proseguire.

---

## 6. Verifiche finali

- `npm run validate`: **verde** sul worktree combinato finale — lint, typecheck e suite completa;
- `npm run build`: **verde**; restano gli avvisi già presenti su CSS generato e dimensione del
  pacchetto principale, fuori dal perimetro di questi lavori;
- test mirati logout/retry: **31 su 31** verdi;
- test mirati dopo pulizia codice morto: **30 su 30** verdi;
- prove browser Prenota: baseline 20/20 verde; riproduzione controllata rossa 5/5 prima del fix;
  regressione definitiva verde 10/10 dopo il fix, più telefono/tablet e spec completa 4/4;
- `git diff --check`: verde;
- nessuna migrazione, nessuna operazione su database, nessun accesso in scrittura a PROD;
- commit locali: **`651959c`** auth/retry, **`a9a7dd3`** codice morto, **`3b4b287`** Prenota;
- documentazione e handoff raccolti nel commit conclusivo; nessun push.

Il conteggio totale non viene riscritto in questa chiusura perché l'output completo di Vitest è stato
troncato dal terminale; l'exit code della suite è 0. Il saldo comprende la rimozione dei test del
codice morto, i nuovi test auth/retry e la nuova regressione Prenota.

---

## 7. Stato dei commit locali

| Commit | Contenuto | Stato |
|---|---|---|
| `651959c` | due tentativi di recupero sui guasti Supabase temporanei prima del logout | locale su `env/test`, non pushato |
| `a9a7dd3` | rimozione delle quattro utility morte e dei test dedicati | locale su `env/test`, non pushato |
| `3b4b287` | fix del giro di render Prenota e regressioni componente/browser | locale su `env/test`, non pushato |
| commit documentale conclusivo | fotografia legale, contesti Admin/Prenota, due report e `SESSION_LOG` | creato nella chiusura corrente, non pushato |

Il working tree applicativo è stato ricontrollato dopo i tre commit: non restano modifiche `src/` o
`e2e/` fuori commit. Nessun file di ambiente, segreto o artefatto Playwright è incluso.

## 8. Dati comunicazione

- Richiesta di commit locale: 1.
- Richiesta di riallineare l'handoff allo stato reale: 1, nello stesso prompt.
- Correzioni successive di Matteo: 0.
- Formato usato: esito concreto, hash separati per responsabilità, distinzione esplicita fra
  “committato localmente” e “pushato/rilasciato”.
- Automatizzabile: confronto fra stato dichiarato nei report e `git status`/`git log` prima del
  commit documentale. Manuale: decisione di push, merge, release e QA visivo.

## 9. Analisi flusso prompt, efficienza e statistiche

- Prompt sostanziali nella fase di chiusura: **1**.
- Correzioni dopo la prima risposta: **0**.
- Follow-up generati: **0**.
- Modalità alzata: già **deep/senior** per eredità dei quattro lavori e del difetto Prenota.

Il prompt è stato efficace perché univa azione e criterio di accettazione: non bastava creare un
commit, l'handoff doveva smettere di riportare lo stato intermedio come stato finale. Per future
chiusure è utile mantenere questa coppia “pubblica il punto di ripristino + verifica la fotografia”.

## 10. La mia lettura della chiusura

Il frazionamento in tre commit di codice e uno documentale rende indipendenti rollback e revisione.
Il controllo più utile non è stato il semplice `git status`, ma il confronto semantico: l'handoff
diceva ancora “Prenota non riprodotto” anche se il codice e il report dedicato dimostravano ormai il
contrario. Correggerlo prima del commit evita che la prossima sessione riapra un'indagine già chiusa.

Il cold-check pre-commit ha inoltre segnalato che questo handoff, creato in una fase precedente, non
aveva ancora le domande Q1–Q6 richieste dallo standard corrente. La richiesta è stata utile e ha
portato a completare il documento anziché aggirare il controllo.

Miglioria suggerita al processo: prima di ogni commit finale, cercare nei report della giornata frasi
come “non corretto”, “nessun commit” e “resta aperto”, confrontandole con log e stato correnti. È un
buon candidato per un controllo informativo futuro, da valutare in una sessione Meta.

## 11. Derivazione errori

| Evento | Classificazione | Causa | Risoluzione |
|---|---|---|---|
| Handoff Prenota rimasto allo stato “non riprodotto” | cronologia preesistente diventata obsoleta | il documento precedeva la sessione diagnostica dedicata | sostituita la sezione con riproduzione 5/5, causa, fix e verifica 10/10 |
| Handoff senza Q1–Q6 | debito documentale preesistente | il report non seguiva ancora integralmente lo standard di chiusura | completate in questa chiusura tutte le sezioni obbligatorie |
| Primo tentativo di ogni commit di codice fermato | vincolo strutturale voluto | cold-check Husky richiede una seconda lettura per ogni nuovo stage | controllato lo stage e rilanciato lo stesso commit senza bypass |
| `validate:docs` rosso | debito preesistente fuori perimetro | 14 path sotto `docs/Console-Skill/**` | registrato senza modificare la skill Console |

## 12. Cosa resta per la prossima sessione

- Fare push/merge/release solo su nuova indicazione di Matteo.
- Fare il QA visivo Prenota con due sotto-schede; le prove automatiche chiudono già il cancello
  tecnico del giro a vuoto.
- Portare all'avvocato le decisioni indicate nei contesti legali: DPA Brevo, lista pubblica dei
  sub-responsabili, retention ed eventuali trasferimenti extra-UE.
- I 14 path rotti della skill Console restano un debito separato.
- Non servono migrazioni o operazioni database per nessuno dei quattro lavori qui raccolti.

## 13. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: «fai commit lavoro svolto e assicurati che handoff sappia stato reale codice e dei lavori.»

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Sì. Ho ri-verificato `git status`, i diff auth/retry, codice morto e Prenota, i file nuovi `supabaseRetry.ts` e relativo test, i tre hash `651959c`/`a9a7dd3`/`3b4b287`, la suite completa con exit code 0, il build verde già eseguito e l'origine esclusivamente Console dei 14 errori `validate:docs`.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Sì. Auth è allineata nei tre contesti Admin e nei test; Brevo nei nove contesti Legal; Prenota nei tre contesti d'area, nel test componente e nella spec browser; la pulizia del codice morto include i test dedicati. I due report e `SESSION_LOG` ora riportano gli stessi tre hash e lo stesso stato finale.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non ho fatto push, merge, release, migrazioni, scritture PROD o QA visivo al posto di Matteo. Non ho corretto i 14 path della skill Console perché fuori perimetro. Non restano modifiche applicative fuori commit; resta soltanto il commit documentale di questa stessa chiusura al momento in cui il report viene staged.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: Il report intermedio poteva diventare silenziosamente obsoleto dopo il fix successivo; aggiungerei in futura sessione Meta un controllo informativo che evidenzi nei report della giornata frasi di stato incompatibili con `git log` e con i report più recenti.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Il contesto era giusto per distinguere codice, documentazione e stato di consegna. Il cold-check è stato utile: ha imposto la rilettura di ogni stage e ha individuato concretamente le Q1–Q6 mancanti in questo handoff; non è stato rumore.

## 14. Self-review del report

- **Dati = diff reale:** verificati i tre hash e l'assenza di residui applicativi fuori commit.
- **File correlati:** Admin, Legal, Prenota, report e indice sessioni sono nello stage documentale.
- **Q1–Q6:** complete e coerenti con il fatto che il push non è autorizzato.
- **Stato temporale:** la baseline Prenota 20/20 è mantenuta come storia, non più presentata come esito finale.
- **Tono:** l'apertura dice cosa cambia per admin, cliente e prossima sessione; i dettagli tecnici restano nelle sezioni di verifica.

Correzione della self-review: rimossa l'aritmetica 1346→1345 ormai superata dalla nuova regressione
Prenota; viene riportato soltanto l'esito verificabile della suite completa.
