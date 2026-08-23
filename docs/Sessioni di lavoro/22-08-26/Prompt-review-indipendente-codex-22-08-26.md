# Mandato — revisione indipendente di `SK-6`, la prima in 43 sedute

> **Questa seduta può fare una cosa che nessuna delle 43 precedenti ha potuto fare.** Leggi il §1
> prima di tutto il resto: non è retorica, è il motivo per cui sei tu e non un altro.
> **Data:** 22-08-26 · **ramo:** `env/test` · **HEAD atteso all'apertura:** `5b2c7db`

---

## 1. Perché sei tu

Il contratto delle capsule dice, testualmente:

> `independently_verified` richiede almeno un verificatore **diverso da esecutore, autore del record e
> soggetto della dichiarazione**. `self_report` non può essere presentato come verifica.

E `PLAN_V0.md` §16.3 stringe ancora:

> una review cambia lo stato di verifica da `self_report` a `independently_verified` **solo se** il
> revisore gira su una **famiglia di modello diversa** […] il controllo è meccanico.

**In 43 sedute quel valore non è mai comparso. Nemmeno una volta.** Su 129 annotazioni:
78 `self_report`, 49 `unverified`, 2 `not_applicable`, **0 `independently_verified`, 0 `contradicted`**,
e il campo `verified_by` è **vuoto in tutte e 129**.

Il lavoro `SK-6` è stato scritto da **Anthropic `claude-opus-5`**. La contro-verifica che leggerai qui
sotto è stata fatta da **un altro `claude-opus-5`**: stessa famiglia, quindi **non conta come
indipendente** e resta `self_report`. Ha rifiutato di compilare quel campo proprio per questo.

**Tu giri su OpenAI/Codex. Famiglia diversa.** Sei il primo agente di questo progetto che può
scrivere quel valore **senza mentire**. Non sprecarlo: vale solo se lo compili per ciò che hai
davvero rimisurato con le tue mani.

---

## 2. Primo comando

```bash
npm run mss:status
```

Ti dà lo stato in una schermata. Poi leggi, in quest'ordine e nient'altro:

1. `docs/Sessioni di lavoro/22-08-26/Report-sk6-mss-query-22-08-26.md` — il lavoro sotto esame
2. `docs/Sessioni di lavoro/22-08-26/Prompt-sk6-mss-query-v2-22-08-26.md` — il mandato che ha eseguito
3. `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md` §5-§6 — verifica e rettifica
4. `docs/MetaSkillSystem/PLAN_V0.md` §16.3 — il vincolo di indipendenza

⛔ **Non fare ricerche a tappeto nel repo.** Se ti serve altro, chiedi.

---

## 3. Cosa devi verificare — e non è solo l'esecutore

### 3.1 Le sette affermazioni dell'esecutore

| # | Affermazione | Esito della contro-verifica Anthropic (**da non credere sulla parola**) |
|---|---|---|
| 1 | 42 capsule con record / 43 con intestazione; la 43ª è un'eccezione storica inchiodata per `sha256` in `parse.mjs` | confermata |
| 2 | `collectGitHeadHistory()` ne vede 36, `mss:query` 42: **6 invisibili** perché in sotto-cartella | divario di 6 confermato, **numeri assoluti scivolati a 37/43** |
| 3 | `independently_verified` 0 · `contradicted` 0 · `verified_by` vuoto ovunque | confermata |
| 4 | 6 controlli eseguiti da revisori, in 3 sedute | **falsificata** — vedi §3.2 |
| 5 | 13 regole su 28 (a regola singola) hanno `E` sempre 0 | confermata |
| 6 | 33 sedute su 42 dallo stesso provider (xAI/Cursor) | confermata, e **regge senza** la normalizzazione delle grafie |
| 7 | «10 sedute senza `controls`» sono in realtà 9 che dichiarano «nessuno» + 1 che tace | confermata |

### 3.2 I due difetti che la contro-verifica dichiara di aver trovato — verificali come il resto

**Difetto 1.** Il criterio `/reviewer|revisor/i` applicato a `controls[].esecutore` non produce falsi
positivi, ma **perde** l'attore `cursor-grok-sep11-f3-review` (5 controlli, 1 seduta), il cui campo
`recorded_by.role` vale `senior_eval_pack_f3_reviewer`. Numero vero affermato: **11 controlli in 4
sedute**. *Verifica se è vero, e soprattutto se ne mancano altri ancora: la contro-verifica ha
guardato l'elenco degli attori distinti a occhio, ed è esattamente il punto in cui un secondo paio
d'occhi serve.*

**Difetto 2.** La capsula del report `SK-6` dichiara `session_close` alle `2026-08-22T13:45:54+02:00`
con `finalization: final`, mentre il report è stato esteso alle 22:16 e la risposta `R1` dichiara
**due** prompt. *Verifica che i due racconti divergano davvero, e giudica se è un difetto o una
lettura troppo severa.*

### 3.3 Le affermazioni della contro-verifica Anthropic

**Sono `self_report` quanto quelle dell'esecutore.** Stessa famiglia di modello, stesso limite. Se
sbaglia, il tuo è l'unico mandato di questo progetto che può dirlo con autorità. Trattala come una
terza fonte da falsificare, non come una sponda.

---

## 4. Come verificare — riproduci, non fidarti

⛔ **Non lanciare `npm run mss:query` e copiare i numeri.** È lo strumento sotto esame: usarlo come
prova di sé stesso è la definizione di autocertificazione, cioè il difetto che questa seduta misura.

**Scrivi il tuo censimento**, con uno script usa-e-getta **fuori dal repo** (cartella temporanea; non
committarlo). Poi confronta con l'output del comando. Le forme dei dati, per non fartele cercare:

| Cosa | Dove sta nel record |
|---|---|
| blocco capsula | fence ```` ```jsonl ```` dopo un'intestazione `Capsula MetaSkillSystem` |
| tipo di record | `record_type` ∈ `session_event` · `annotation` · `amendment` |
| controlli eseguiti | `event.controls[]` → `control_id` `criterio` `esito` `esecutore` |
| stato di verifica | `annotation.verification.status` e `.verified_by` |
| punteggi | `annotation.assertions[].rule_id_version` + `G` / `O` / `E`, asse in `annotation.axis` |
| chi ha scritto | `recorded_by.actor_id` · `.role` · `.agent_runtime.provider` / `.model` / `.runtime` |

I report vivono in `docs/Sessioni di lavoro/**/Report-*.md`, **a profondità variabile**: se filtri con
un livello solo di cartella ne perdi 6. È il difetto 2 dell'esecutore, ed è la trappola più facile in
cui cadere ripetendo il suo lavoro.

---

## 5. Le tre trappole, scritte accanto a dove ti aspettano

1. **I numeri si muovono, e non è un errore.** Ogni report che nasce **aggiunge la propria capsula**
   al corpus. Perciò 42 diventa 43, e 36 diventa 37: sono le stesse misure a tempi diversi, non
   discordanze. **Annota `git rev-parse HEAD` e l'ora esatta di ogni misura**, così il tuo numero
   resta interpretabile.
2. **La normalizzazione delle grafie dei modelli** («Cursor Grok 4.5» e «Grok-4.5» uniti) è una
   **scelta dell'agente**, dichiarata in output apposta perché tu possa rifiutarla. Verifica se il
   33 su 42 dipende da quella scelta o se regge anche senza.
3. **Il criterio `/reviewer/`** è l'altra scelta dichiarata. Non limitarti a confermare il numero
   nuovo: chiediti se un criterio basato su **come si chiama un attore** possa mai essere affidabile,
   e se la risposta è no, dillo — è più utile del numero.

---

## 6. ⚠️ Il bersaglio si muove: un esecutore lavora in parallelo

Matteo ha lanciato **in contemporanea** un agente esecutore che sta chiudendo i due difetti. Questo
significa che, **mentre lavori**, `scripts/mss/query.mjs` e `PLAN_V0.md` possono cambiare sotto di te.

Non è un problema, è un dato da registrare:

- Se `--verifica` ti mostra **6 controlli in 3 sedute**, stai misurando la versione originale.
- Se ti mostra **11 in 4**, l'esecutore ha già consegnato la sua correzione.
- **Annota quale delle due hai visto**, con `git rev-parse HEAD` e lo `sha256` di
  `scripts/mss/query.mjs` al momento della misura. Un numero senza il suo istante non è verificabile.

⛔ **Non correggere il lavoro dell'esecutore, e non toccare i suoi file.** Tu revisioni, non ripari.
Se trovi un difetto nuovo, **lo scrivi**; non lo aggiusti.

---

## 7. Come si registra una verifica senza riscrivere il lavoro altrui

Questa è la parte che nessuno ha mai fatto, quindi vale la pena essere precisi.

**Non modificare la capsula del report `SK-6`.** Quei record sono `final`. Il contratto §6 dà la
strada, ed è append-only:

```text
amendment:
  amendment_id: mss-amd-<UUIDv7>
  target_record_id:            # il record che stai verificando, in un'ALTRA seduta
  relation: amends | supersedes
  reason:
  changes:
    - field_path:              # es. annotation.verification.status
      previous_value_or_hash:  # es. self_report
      corrected_value:         # es. independently_verified
  evidence_refs: []
  effective_at:
```

E il §5 conferma che è proprio questo il caso d'uso previsto: *«una rettifica successiva può cambiare
lo stato dell'annotazione senza modificare la dichiarazione originaria»*.

I record che puoi prendere di mira, già estratti:

| record della capsula `SK-6` | id | stato attuale |
|---|---|---|
| `session_event` (`session_close`) | `mss-rec-01a0294a-aa53-75d6-960c-ef9d7847f46f` | — |
| `annotation` asse `sistema` | `mss-rec-01a0294a-aa53-7c55-a424-a44cc64c1390` | `self_report` |
| `annotation` asse `output` | `mss-rec-01a0294a-aa54-757f-a5b9-779fe544e3be` | `self_report` |
| `annotation` asse `persona` | `mss-rec-01a0294a-aa54-731b-9fe3-aa6b043cdf14` | `unverified` |

**Gli `amendment` che scrivi vivono nella capsula del TUO report**, non in quella altrui. Puntano al
bersaglio per `target_record_id`.

### Le tre regole che rendono questa verifica vera invece che cerimoniale

1. **`independently_verified` solo per ciò che hai rimisurato tu.** Se non hai riprodotto
   un'affermazione con i tuoi comandi, quel record **non si tocca**. Una verifica di comodo è peggio
   di nessuna verifica: diventa un dato falso che qualcuno userà.
2. **Usa `contradicted` dove non sei d'accordo.** Anche quel valore non è mai comparso in 43 sedute.
   Una revisione che non può contraddire non è una revisione, ed è precisamente il sospetto che questa
   seduta ha il compito di sciogliere. Se l'esecutore ha ragione su tutto, dillo — ma se ha torto su
   qualcosa, quel campo esiste per te.
3. **Dichiara il tuo runtime per esteso e onestamente** in `recorded_by.agent_runtime`: `provider`,
   `model`, `runtime`, `surface`. **È il campo su cui il controllo di indipendenza è meccanico.** Se
   lo scrivi vago, la tua verifica non è più distinguibile da un'autocertificazione e hai buttato
   l'unica cosa che questa seduta poteva produrre.

---

## 8. Divieti — con il motivo accanto

| Divieto | Perché |
|---|---|
| **Non toccare `scripts/mss/adapter.mjs`** | è il perimetro del pre-commit: allargarlo fa entrare **22 report** insieme. È `SK-4`, decide Matteo |
| **Non modificare `scripts/mss/query.mjs`** | ci sta lavorando l'esecutore, in parallelo. Tu revisioni |
| **Non modificare le capsule di altre sedute** | sono `final`: la sola strada è `amendment` nella tua |
| **Nessun `move` o `rename`** di file MSS | la suite risale un numero fisso di livelli e si rompe. È `SK-8`, non aperta |
| **Nessun `push`** | serve un sì esplicito di Matteo. `5b2c7db` è fermo in locale apposta |
| **Niente git distruttivo** — no `reset --hard`, no `push --force`, no `stash drop`, no rami cancellati | ci sono **8 stash**, alcuni con lavoro non replicabile |
| **Non aprire `docs/_lavoro/`** | materiale personale. Puoi citarne i path, mai il contenuto |
| **Non dichiarare superato un gate** | `SEP-G5` **non** è `PASS` · `H-1.3` è `PASS_CON_RISERVE` · `WP-1` è `NO-GO` |
| **Non dichiarare chiuso `SK-6`** | decide Matteo |

**Puoi scrivere solo in:** `docs/Sessioni di lavoro/22-08-26/<il tuo report>.md`, più script
usa-e-getta **fuori dal repo**.

---

## 9. Prove di chiusura — quattro, di cui una negativa

1. `npm run validate:mss -- --mode file --file "<il tuo report>" --kind report --require-capsule` → **OK**
2. **Almeno tre affermazioni riprodotte con i tuoi comandi**, con l'output vero riportato nel report —
   non «confermo», ma il numero che hai ottenuto e come
3. Il tuo report dice **quale versione di `query.mjs`** hai misurato (`sha256` + `HEAD` + ora)
4. **Prova negativa:** `git status --porcelain` mostra che **l'unico file toccato è il tuo report**.
   Se compare `query.mjs`, `PLAN_V0.md` o un'altra capsula, hai sforato il mandato

**Hai il permesso esplicito di concludere in negativo.** Se dalla verifica non esce niente di nuovo,
e tutto ciò che l'esecutore ha scritto regge, **quello è il risultato** e va riportato così — con
gli `amendment` che lo registrano. Un revisore che si sente in dovere di trovare qualcosa inventa; un
revisore che non se lo sente firma qualunque cosa. Nessuno dei due serve.

E se **non puoi** compilare `independently_verified` — perché il contratto non lo permette come pensi,
o perché non hai rimisurato abbastanza — **dillo e lascialo vuoto**. Il campo vuoto è già la verità
di 43 sedute: aggiungerne una quarantaquattresima onesta è meglio che romperlo.
