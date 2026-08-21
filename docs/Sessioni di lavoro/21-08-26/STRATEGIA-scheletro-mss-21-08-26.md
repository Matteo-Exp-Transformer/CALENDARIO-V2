# Strategia MetaSkillSystem — dallo scaffale allo scheletro

> **Che cos'è questo file.** La strategia proposta dal consulente esterno il 21-08-2026, a partire
> dal target dettato da Matteo nella stessa data. È **documentazione di lavoro**: dice dove andare,
> in quali tappe, e come si prova che una tappa è riuscita.
>
> **Non è un owner di stato.** Lo stato resta in `docs/MetaSkillSystem/PLAN_V0.md`. Il **target**
> qui descritto è stato riportato in quel file, che ne è il proprietario. Se le due versioni
> divergono, vince `PLAN_V0.md`.
>
> **Stato:** proposta. Nessuna fase è autorizzata finché Matteo non la apre.

---

## 1. Il target, nelle parole di Matteo

> *«Lo scopo è creare uno scheletro perfetto che stia in equilibrio aiutando agenti con le automazioni
> necessarie a evitargli eccessivo consumo di token.»*
>
> *«Una delle funzionalità migliori di questo sistema deve diventare che: qualsiasi lavoro fatto da
> agente è un fatto utile per raccogliere tutte le informazioni di cui lo skill system necessita
> (senza inventare contenuti). Così un agente può valutare un approccio diverso a un problema,
> cambiando metodo o strategia o suggerendo approccio con nuovo modello.»*
>
> *«Gli agenti devono essere stimolati dallo scheletro dello skill system a raccogliere i dati
> necessari alla crescita, chiedendo specifiche a utente e interazioni, in base al tipo di seduta
> che l'utente avvia.»*
>
> *«I criteri di MSS sono qualsiasi dato che possiamo raccogliere da una chat, al fine di poter
> migliorare esperienza utente, esperienza agente, ed efficienza MSS.»*
>
> — Matteo, 21-08-2026

### Che cosa implica, tradotto in requisiti

| # | Requisito | In una frase |
|---|---|---|
| **R1** | **La raccolta è un sottoprodotto, non un compito** | L'agente non deve *scrivere* i dati: deve *fare il lavoro*, e i dati devono cadere da soli |
| **R2** | **Niente contenuti inventati** | Ogni dato raccolto automaticamente deve venire da una fonte macchina (git, esito di un comando, orologio), non dalla memoria dell'agente |
| **R3** | **Le automazioni fanno risparmiare token, non spenderne** | Un comando che stampa lo stato deve costare meno che leggere dieci file |
| **R4** | **Lo scheletro stimola, non punisce** | Il tipo di seduta determina quali domande l'agente pone all'utente e quali dati cerca |
| **R5** | **I dati devono essere interrogabili** | Raccogliere senza mai rileggere non è memoria, è archivio morto |
| **R6** | **Spostare e rinominare deve costare un comando** | Non sei sessioni |
| **R7** | **A fine lavoro l'agente si autorevisiona con una macchina** | «Che cosa ho toccato, quali regole si applicano, le ho rispettate?» |
| **R8** | **Ingresso in una repo nuova via intervista** | Il bootstrap del MSS in un progetto vergine è una procedura, non un'improvvisazione |

---

## 2. Quanto siamo lontani dal target — misurato

| Requisito | Oggi | Prova |
|---|---|---|
| R1 raccolta come sottoprodotto | ❌ **la capsula è scritta a mano, riga per riga, dall'agente** | 38 capsule su 41 hanno orari arrotondati a multipli esatti di 5 minuti: sono **dichiarati, non misurati** |
| R2 niente contenuti inventati | ⚠️ la regola è scritta, ma nulla la impedisce | il campo `controls` accetta `"esito":"pass"` senza che nessun comando sia stato eseguito |
| R3 automazioni che risparmiano token | ❌ **non esiste nessuna automazione di supporto** | i 3 comandi esistenti (`test:mss`, `validate:mss`, `generate:mss-fixtures`) *verificano*, nessuno *aiuta* |
| R4 stimolo per tipo di seduta | ⚠️ esiste come prosa nei prompt | nessun meccanismo lo applica |
| R5 dati interrogabili | ❌ **41 capsule scritte, 0 mai interrogate** | l'unico consumo automatico è il controllo di integrità append-only. Non esiste `mss query` |
| R6 move a costo di un comando | ❌ | 1 file spostato = 6 sessioni, 7 documenti, ≈1 741 righe |
| R7 autorevisione a fine lavoro | ⚠️ esiste come *checklist scritta* (Q1-Q6) | l'agente si autovaluta a parole; nulla confronta le risposte col diff reale |
| R8 bootstrap in repo nuova | ❌ non esiste | — |

> **La diagnosi in una frase.** Il MetaSkillSystem oggi è un ottimo **regolamento** con un discreto
> **collaudatore**, e zero **attrezzi**. Tutto ciò che chiede agli agenti, glielo chiede a mano.
> Il target di Matteo non richiede di cambiare le regole: richiede di costruire gli attrezzi che
> mancano.

---

## 3. Lo scheletro — cinque comandi

Questa è la proposta concreta. Cinque comandi, tre dei quali sono in **sola lettura** e quindi a
rischio zero.

### 3.1 `npm run mss:status` — *dove siamo* (sola lettura)

**Problema che risolve.** Oggi per sapere dove eravamo rimasti servono da 2 a 10 file. Un agente
freddo ci è riuscito in 8 file e ≈1 100 righe. Ogni sessione ripaga quel costo da capo.

**Cosa fa.** Legge gli owner (`PLAN_V0.md`, `MASTERPLAN_V0.md`) e lo stato di git, e stampa in ~40
righe: branch · `HEAD` · scarto da `origin` · tag di ripristino · gate aperti · cantiere in corso ·
prossimo passo atomico · divieti attivi · esito dell'ultima suite.

**Perché non diventa un secondo owner.** Non memorizza nulla: **deriva** a ogni esecuzione. Se non
riesce a estrarre un campo, lo dice e stampa il path dell'owner. Un dato che non sa leggere non lo
inventa: scrive `non ricostruibile`.

**Prova di successo.** Un agente che parte da zero risponde a «dove eravamo rimasti» con **1 comando**
invece di 2-10 file. Confronto misurabile contro il campione di questa consulenza.

---

### 3.2 `npm run mss:review` — *che cosa ho toccato* (sola lettura)

**Problema che risolve.** Le sei domande di chiusura (Q1-Q6) sono oggi **autovalutazione a parole**:
l'agente dichiara «dati = diff reale» senza che nulla confronti le due cose. È il punto in cui un
agente compiacente non viene fermato da niente.

**Cosa fa.** Prende il diff della sessione e produce una tabella dei fatti, non un giudizio:

- ogni file toccato, classificato per livello **L1-L6**;
- ⚠️ segnalazione esplicita se hai toccato un **owner di stato**;
- ⚠️ segnalazione se hai toccato un path **congelato** (L5) o **intangibile** (L6);
- quali regole MSS si applicano a ciò che hai toccato;
- che cosa manca: capsula assente, Q1-Q6 incomplete, report mancante, gate dichiarato senza prova;
- i comandi eseguiti nella sessione e il loro esito reale.

**Il salto di qualità.** L'agente non risponde più «sì, i dati corrispondono al diff»: riceve **il
diff** e deve giustificare gli scostamenti. La domanda passa da *retorica* a *verificabile*.

**Prova di successo.** Eseguito su una sessione con una violazione nota, la trova. Eseguito su una
sessione pulita, non inventa problemi.

---

### 3.3 `npm run mss:query` — *che cosa abbiamo imparato* (sola lettura)

**Problema che risolve.** È il buco più grande del sistema: **41 capsule scritte, nessuna mai
interrogata per rispondere a una domanda.** Oggi le capsule servono solo a impedire che il passato
venga riscritto. Sono integrità, non memoria.

**Cosa fa.** Legge tutte le capsule dalla storia git e risponde a domande vere:

| Domanda | Perché serve a Matteo |
|---|---|
| Quali regole hanno `E = 0`? | dove la governance è solo un desiderio |
| Quante sedute per modello e superficie? | se le review sono davvero indipendenti |
| Ogni gate: quando è cambiato, per mano di chi, con quale prova? | la storia dei verdetti senza rileggere 54 report |
| Tutti i `FAIL` e le chiusure invalidate | il negativo, che il sistema promette di conservare |
| Quali dichiarazioni sono `self_report` e quali `independently_verified`? | quanto del sistema è autocertificato |
| Costo per seduta: file toccati, comandi, rework | il dato che oggi non esiste |

**Perché è il cardine del target di Matteo.** «Un agente può valutare un approccio diverso a un
problema, cambiando metodo o strategia» — può farlo **solo se può interrogare** che cosa è già stato
provato e come è andata. Senza questo comando, la raccolta dati non ha consumatore e il resto dello
scheletro serve a riempire un archivio che nessuno apre.

**Prova di successo.** Risponde a tre domande reali usando le 41 capsule già esistenti, senza che
nessuno debba scrivere niente di nuovo. Il valore si vede subito, sul materiale già in casa.

---

### 3.4 `npm run mss:capsule` — *la raccolta come sottoprodotto* (scrive)

**Problema che risolve.** È il requisito **R1** e **R2** insieme. Oggi l'agente scrive a mano UUID,
timestamp, elenco strumenti, elenco file. Sono tutti dati che **la macchina già possiede**, e che a
mano vengono approssimati o inventati.

**Cosa genera automaticamente** (fonte macchina — non inventabile):

| Campo | Da dove |
|---|---|
| `record_id`, `session_id`, `event_id`, `capture_key` | generatore UUIDv7 |
| `created_at`, `occurred_at` | orologio reale, non arrotondato |
| `agent_runtime` (provider, modello, runtime, superficie) | variabili d'ambiente della sessione |
| `tools_used` | strumenti effettivamente invocati |
| file toccati, `owner_refs` | `git diff` |
| `controls` → comandi eseguiti, esito, codice di uscita | il registro dei comandi della sessione |
| `schema_version`, `system_revision` | **da `scripts/mss/rules.mjs`**, mai a memoria |

**Cosa resta all'agente** (e solo quello): `intent_user`, decisioni attribuite, `open_items`,
le tre annotazioni di giudizio sui tre assi. Cioè **ciò che solo lui sa**, non ciò che la macchina
può leggere.

**L'effetto sul buco della versione legacy.** Se la versione la scrive il generatore leggendola dal
motore, la porta di servizio `0.1.0` si chiude da sola: nessun agente potrà più dichiarare una
versione che disattiva le prove, perché non sarà più lui a scriverla.

**Prova di successo.** Una capsula generata ha timestamp con secondi reali e un `controls` che
elenca comandi realmente eseguiti con i loro codici di uscita. Confronto con le 41 storiche: 38
hanno orari arrotondati, questa no.

---

### 3.5 `npm run mss:move -- <da> <a>` — *spostare senza cerimonia* (scrive)

**Problema che risolve.** È l'esempio che hai fatto tu. Oggi spostare un file costa 1 741 righe.

**Cosa fa, in ordine:**

1. **Rifiuta** se la destinazione o l'origine è L5 congelato o L6 privato, salvo mandato esplicito.
2. `git mv` del file.
3. Riscrive **ogni riferimento vivo** al vecchio path in tutti i documenti (esclusi i report storici,
   che restano storia e non si riscrivono mai).
4. Lascia uno **stub di redirect** con data, TTL e criterio di rimozione, secondo la policy già
   scritta in `docs/MetaSkillSystem/archive/README.md`.
5. Esegue `npm run validate:docs` e `npm run test:mss`.
6. **Se una delle due prove fallisce, annulla tutto** e lascia l'albero come l'ha trovato.
7. Stampa il riepilogo da incollare nel report: file spostato, riferimenti aggiornati, stub creato.

**Il vincolo tecnico da rispettare.** La suite non è legata solo ai *nomi* dei path ma alla
**profondità delle cartelle**: `docs/MetaSkillSystem/tests/h1/run.mjs` calcola la radice del repo
risalendo un numero fisso di livelli. Finché quella risalita non diventa robusta (cercare all'insù
il `package.json`), **`mss:move` non deve poter toccare L5**, nemmeno con forzatura.

**Prova di successo.** Si sposta un file di prova, la suite resta verde, i riferimenti sono vivi, e
il costo si misura contro la linea di base delle 1 741 righe.

---

## 4. Il modello delle sedute — pilota e senior

Il target chiede che *«gli agenti siano stimolati dallo scheletro a raccogliere i dati necessari alla
crescita, in base al tipo di seduta»*. Serve quindi che il **tipo di seduta** sia un oggetto reale, non
un aggettivo nel prompt.

### 4.1 I ruoli

| Ruolo | Che cosa fa | Che cosa NON può fare |
|---|---|---|
| **Utente (Matteo)** | apre la seduta, decide, approva i gate | — |
| **Preparatore** | trasforma la richiesta in un prompt di sessione con perimetro, chiavi, vincoli e dati da raccogliere | eseguire il lavoro |
| **Pilota** | esegue **una** cosa e la prova | dichiarare superato un gate · valutare sé stesso |
| **Senior** | progetta e decide dentro un perimetro; legge i dati raccolti e propone la strategia | eseguire ciò che ha progettato nella stessa seduta |
| **Revisore** | verifica il lavoro altrui, a freddo | aver partecipato al lavoro che revisiona |

### 4.2 La regola d'oro dell'indipendenza

Su cinque «review indipendenti» condotte finora, **una sola** ha davvero cambiato famiglia di modello.
Le altre quattro erano «chat diversa, stesso modello» — e in un caso il revisore ha emesso il verdetto
**15 minuti** dopo il writer, con lo stesso modello.

Il sistema lo dichiara onestamente come debito (`R1` del gate `SEP-G1`, finding `B2-F05`). Ma
dichiararlo non lo risolve. Proposta di regola, da approvare:

> **Una review cambia stato di verifica da `self_report` a `independently_verified` solo se il
> revisore gira su una famiglia di modello diversa da quella del writer.** Altrimenti resta
> `self_report`, qualunque sia il verdetto. Il campo `agent_runtime.provider` è già nella capsula:
> il controllo è meccanico e si può imporre.

Questa è l'unica regola di questo documento che si può rendere **`E = 3`** — blocco tecnico — a costo
quasi nullo, perché il dato serve già.

### 4.3 Seduta *deep* = più chat con handoff

Una seduta deep non entra in una chat sola. Il modello proposto:

```
[Preparatore]  →  prompt di sessione su file (perimetro, chiavi, vincoli, dati da raccogliere)
      ↓
[Pilota 1]     →  esegue una fase · mss:review · mss:capsule · handoff
      ↓            (handoff generato, non scritto a mano)
[Pilota 2]     →  esegue la fase successiva · idem
      ↓
[Senior]       →  mss:query sui dati raccolti · propone strategia · NON esegue
      ↓
[Revisore]     →  famiglia di modello diversa · verdetto attribuito
      ↓
[Matteo]       →  decide il gate
```

**Il punto critico è l'handoff.** Oggi è un documento scritto a mano che diventa vecchio: al momento
di questa consulenza `HANDOFF_SENIOR_V0.md` è falso su due righe, e lo dichiara. **L'handoff deve
essere generato da `mss:status` + `mss:review`**, non redatto. Un documento generato non può essere
stale: o è corretto, o non gira.

---

## 5. L'ordine delle fasi

Il criterio d'ordine è uno solo: **prima ciò che è gratis e sblocca il resto, poi ciò che è a rischio
zero perché legge soltanto, poi ciò che scrive.**

| Fase | Che cosa | Costo | Rischio | Sblocca |
|---|---|---|---|---|
| **F0** | Sbloccare i cancelli globali (3 righe di config) | minuti | nullo | **tutto il resto** |
| **F1** | Tag di ripristino `mss/baseline-h13` | minuti | nullo | ogni fase successiva |
| **F2** | `mss:status` | piccolo | nullo (legge) | R3 · handoff generato |
| **F3** | `mss:review` | medio | nullo (legge) | R7 · Q1-Q6 verificabili |
| **F4** | Chiudere i tre buchi dell'enforcement + allineare il contratto | piccolo | basso | R2 |
| **F5** | CI su `env/test` con i controlli MSS | piccolo | basso | **E da 2 a 3** · fine della dipendenza dalla superficie |
| **F6** | `mss:query` | medio | nullo (legge) | **R5 · il target di Matteo** |
| **F7** | `mss:capsule` | medio | basso | R1 · R2 |
| **F8** | Radice robusta della suite (`repoRoot` cercando `package.json`) | piccolo | medio | rende possibile F9 |
| **F9** | `mss:move` | medio | medio | R6 |
| **F10** | Manuale utente + intervista di bootstrap in repo nuova | medio | nullo | R8 |
| **F11** | `WP-1` — i piloti reali | — | — | finalmente c'è qualcosa da osservare |

### Perché F0 viene prima di tutto

Oggi **tre cancelli globali sono rossi**, e questo blocca l'unica strada verso l'enforcement
indipendente dalla superficie:

| Cancello | Stato | Causa reale | Fix |
|---|---|---|---|
| `npm run lint` | 🔴 363 problemi, 17 errori | **18 file su 18** sono in `docs/Archives/`. `.eslintrc.cjs` ignora `Lavoro` ma non `docs` | +1 riga |
| `npm run test` | 🔴 | 192 file di test in `docs/Archives/`; `vitest.config.ts` non esclude `docs` | +1 riga |
| `npm run validate:docs` | 🔴 3 886 path rotti | **3 868 su 3 886** sono in `docs/Archives/`. Lo script esclude `Archivio` (italiano) ma **non** `Archives` (inglese) | +1 stringa |

**Provato in questa seduta, senza modificare nulla:**

```bash
npx eslint src --ext .ts,.tsx        # → exit 0, zero output. Pulito.
npx vitest run --exclude "docs/**"   # → 163 file, 1346 test, tutti verdi, 78 secondi
```

Il masterplan classifica questo come *«debito di discovery da pacchetto workspace separato»* — cioè
un lavoro architetturale. **Non lo è.** Sono tre righe. È stato archiviato come grande e quindi non
è mai stato fatto; non essendo stato fatto, nessun cancello globale è verde; non essendoci cancelli
verdi, non si può mettere niente in CI; non essendoci CI, l'enforcement resta legato a Cursor e ai
commit locali — che è la debolezza numero uno dichiarata dal sistema, e per la quale è parcheggiato
un intero cantiere futuro (`E-2`: write broker, capability gateway, policy engine).

> **In una frase:** il sistema ha parcheggiato un grande progetto per risolvere un problema il cui
> 80% è bloccato da tre righe di configurazione, diagnosticate come un altro grande progetto.

---

## 6. Che cosa eliminare — le ridondanze vere

Il target chiede di *«eliminare ridondanze e centralizzare sempre di più»*. Ecco dove, con la ragione.

| Artefatto | Problema | Proposta |
|---|---|---|
| `ROADMAP_V0.md` | è una vista del masterplan che va aggiornata a mano dopo ogni cambio: un secondo posto dove lo stato può divergere (debito `SEP-D06`, già previsto) | **ridurre a un puntatore** di 5 righe, o generare da `mss:status` |
| `HANDOFF_SENIOR_V0.md` | oggi **falso su due righe**; è il debito `SEP-D07` già previsto | **generare** da `mss:status` + `mss:review`, non scrivere |
| `archive/indices/MSS-REPORT-INDEX.md` | compilato a mano, già stale rispetto all'ultima sessione, e crescerà per sempre | **generare** dal filesystem |
| «prossimo passo atomico» | scritto **in 4 documenti** contemporaneamente | **un solo owner**, gli altri lo derivano |
| Sezione «Q1-Q6» scritta a mano | autovalutazione non verificabile | l'ossatura la produce `mss:review`; l'agente risponde solo al merito |
| I 41 riferimenti `conversation:this-session` | puntano a chat non risolvibili: 41 puntatori morti per costruzione | sostituire con l'ID della sessione + il prompt su file, che è già la pratica |

**Nota importante.** Nessuna di queste eliminazioni tocca la storia. I report passati restano dove
sono, inclusi i FAIL. Si eliminano **viste da mantenere a mano**, non memoria.

---

## 7. Il rischio principale di questa strategia

Va detto, perché è reale.

**Costruire attrezzi è più divertente che usare il sistema.** Il MSS ha 3 giorni di lavoro reale,
14 000 righe di documentazione, e `WP-1` — cioè l'unico momento in cui il sistema verrebbe osservato
mentre lavora su un caso vero — è **NO-GO dal primo giorno**. C'è un rischio concreto che lo scheletro
diventi un altro strato di cose costruite e mai messe alla prova.

**La contromisura è dentro l'ordine delle fasi:** `mss:query` (F6) gira sulle **41 capsule che già
esistono**. Non chiede di raccogliere nuovi dati per dimostrare che raccogliere dati serve: usa quelli
in casa. Se dalle 41 capsule esistenti non esce nulla di utile, quello è il segnale che la raccolta
va ripensata **prima** di automatizzarla — e si è speso un solo comando per scoprirlo.

---

## 8. Le decisioni che restano a Matteo

Non le decido io. Le istruisco.

| # | Decisione | Opzioni | Raccomandazione |
|---|---|---|---|
| **D11** | Si parte da F0 (sbloccare i cancelli) subito? | (a) sì, ora · (b) dopo la review di questa strategia | **(a)** — sono 3 righe, zero rischio, e senza non si può fare CI |
| **D12** | Ordine degli attrezzi | (a) `status` → `review` → `query` → `capsule` → `move` · (b) prima `move`, che è l'attrito che senti di più · (c) prima `query`, per vedere subito se i dati valgono | **(a)**, con (c) anticipabile: `query` gira su dati già esistenti e dà la risposta più informativa |
| **D13** | La regola «review indipendente solo se cambia famiglia di modello» diventa vincolante? | (a) sì, bloccante · (b) sì, ma solo come avviso · (c) no, resta prassi | **(a)** — è l'unica regola che si può portare a `E = 3` quasi gratis, e chiude la riserva più citata del sistema |
| **D14** | `ROADMAP` e `HANDOFF`: ridurre a puntatori/generati? | (a) sì entrambi · (b) solo handoff · (c) no | **(a)** — sono due debiti già previsti dal sistema stesso |
| **D15** | Le decisioni aperte D6, D7, D8, D10 del piano directory | restano aperte | **congelarle** finché F0-F6 non sono fatte: riordinare l'albero prima di avere gli attrezzi ripete l'errore delle 1 741 righe |

---

## 9. Come si prova che una fase è riuscita — un comando, non un'opinione

| Fase | Comando che dice sì o no |
|---|---|
| F0 | `npm run lint` → exit 0 · `npm run test` → verde · `npm run validate:docs` → meno di 20 path rotti |
| F1 | `git tag -l` mostra `mss/baseline-h13` |
| F2 | `npm run mss:status` stampa lo stato e **coincide** con gli owner |
| F3 | `npm run mss:review` su una sessione con violazione nota → la trova |
| F4 | i tre attacchi documentati in §6 della mappa → **respinti** |
| F5 | una PR con capsula non valida → **CI rossa** |
| F6 | `npm run mss:query` risponde a 3 domande sulle 41 capsule esistenti |
| F7 | capsula generata con secondi reali e `controls` con codici di uscita veri |
| F8 | `npm run test:mss` verde **da una profondità di cartelle diversa** |
| F9 | file spostato, riferimenti vivi, suite verde, costo misurato contro 1 741 righe |
| F10 | un agente in una repo nuova completa il bootstrap senza intervento |

**Regola comune a tutte:** se la prova non passa, la fase non è chiusa. Nessuna fase si dichiara
riuscita da chi l'ha eseguita.

---

## 10. Che cosa nessuno deve fare, in nessuna fase

- Dichiarare superato un gate che non è proprio: `SEP-G5`, `WP-1`, `H-1.3` pulito.
- Riscrivere un report storico, **anche se sbagliato**. Si corregge aggiungendo.
- Cancellare le tracce di un fallimento.
- Aprire o copiare `docs/_lavoro/`.
- Spostare qualcosa sotto L5 prima che la radice della suite sia robusta (F8).
- `git push`, PR o qualunque uscita verso l'esterno senza un sì esplicito.
- `reset --hard`, `push --force`, `stash drop`, cancellazione di rami o di storia.
