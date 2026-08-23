# Mandato — chiusura dei due difetti trovati in revisione + allineamento dello specchio

> **Seduta corta.** Tre lavori, nessuno inventivo. Il difficile è già stato fatto: `SK-6` esiste e
> regge. Questo mandato chiude quello che la revisione ha trovato rotto, e niente altro.
> **Data:** 22-08-26 · **ramo:** `env/test` · **HEAD atteso all'apertura:** `5b2c7db`

---

## 1. Chi sei, e cosa questo mandato NON è

Sei l'**agente senior esecutore**. Non stai costruendo un attrezzo nuovo: stai **rettificando** un
lavoro già consegnato, sulla base di una contro-verifica già eseguita e provata.

**Non è `SK-7`.** Non scrivere il generatore di capsule: ha il suo mandato, e parte dopo.
**Non è una revisione:** i difetti sono già stati trovati. Il tuo compito è chiuderli.

**Primo comando, prima di leggere qualsiasi file:**

```bash
npm run mss:status
```

Ti dice dove sei in una schermata. **Se `HEAD` non è `5b2c7db`, fermati e dillo:** qualcosa è
cambiato sotto di te, e questo mandato va riletto prima di eseguirlo.

---

## 2. Stato di partenza — ri-verificalo se vuoi, non fidarti perché è scritto qui

| Fatto | Dove |
|---|---|
| `npm run mss:query` esiste, 941 righe, sola lettura | `scripts/mss/query.mjs` |
| Il report `SK-6` è **modificato e non committato** (§10-12 aggiunti dopo la chiusura) | `docs/Sessioni di lavoro/22-08-26/Report-sk6-mss-query-22-08-26.md` |
| Il commit `5b2c7db` è **fermo in locale**, mai pubblicato | decisione di Matteo, non tua |
| Cancelli verdi la sera del 22-08 | `test:mss` exit 0 · `validate:mss` OK · `validate` exit 0 (163 file, 1346 test) |

---

## 3. Lavoro 1 — la capsula dice che la seduta è finita prima di metà del report

**Il fatto.** La capsula del report `SK-6` contiene 4 record, tutti con
`created_at: 2026-08-22T13:45:54+02:00`, `finalization: final`, evento `session_close`.
Ma il report è stato esteso alle **22:16** con i §10-12, e la risposta `R1` ora dichiara **due**
prompt di Matteo e **tre** interruzioni degli hook — tutte successive a quella chiusura.

Chi interroga l'archivio con `mss:query` vede una seduta chiusa alle 13:45 e non sa che esiste metà
del report. **Il testo e il record macchina non dicono la stessa cosa.**

**La strada è nel contratto, non da inventare.** `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md` §6:

> Un record `final` non viene modificato o cancellato. La rettifica aggiunge […]
> `amendment_id` · `target_record_id` · `relation: amends | supersedes` · `reason` ·
> `changes[].field_path` / `previous_value_or_hash` / `corrected_value` · `evidence_refs` · `effective_at`

E il §5 lo dice come regola generale del contratto: `rectification_route: amendment`.

**Cosa devi fare.** Aggiungere **in coda al blocco `jsonl` già esistente** uno o più record
`amendment` che rendano vero l'archivio. **Non riscrivere i quattro record esistenti** — sono `final`,
e riscriverli è esattamente ciò che il contratto vieta.

Gli id che ti servono, già estratti:

| record | id |
|---|---|
| `session_event` (`session_close`) | `mss-rec-01a0294a-aa53-75d6-960c-ef9d7847f46f` |
| `annotation` asse `sistema` | `mss-rec-01a0294a-aa53-7c55-a424-a44cc64c1390` |
| `annotation` asse `output` | `mss-rec-01a0294a-aa54-757f-a5b9-779fe544e3be` |
| `annotation` asse `persona` | `mss-rec-01a0294a-aa54-731b-9fe3-aa6b043cdf14` |

⚠️ **La trappola.** È tentante rettificare solo l'orario. Ma la cosa cambiata non è un orario: è che
la seduta **ha avuto un secondo segmento**, con un prompt nuovo, tre interruzioni degli hook e 170
righe di report in più. Decidi tu quali `field_path` citare, e **scrivi il motivo per esteso in
`reason`**: fra sei mesi il `reason` è l'unica cosa che qualcuno leggerà davvero.

⚠️ **Gli orari devono essere veri.** `effective_at` e `created_at` con **secondi reali**, presi
dall'orologio nel momento in cui scrivi. Niente `:00` arrotondati, niente orari a memoria.

---

## 4. Lavoro 2 — il criterio «reviewer» perde un revisore vero

**Il fatto, provato.** In `scripts/mss/query.mjs` (righe ~484-493) il criterio è:

```js
const REVISORE_RE = /reviewer|revisor/i
…
const attore = String(it.esecutore || '')
```

Legge **solo** `controls[].esecutore`, e lo dichiara onestamente in output (riga ~531):
«*l'id dell'esecutore contiene «reviewer» o «revisor». Nessun altro testo è letto.*»

Quella dichiarazione ha permesso di falsificarlo, ed è stata falsificata. **Falsi positivi: nessuno**
— i tre id catturati sono attori veri, due si chiamano letteralmente `independent-reviewer`.
Ma ne **perde uno**:

| attore | controlli | dove | ruolo dichiarato |
|---|---|---|---|
| `cursor-grok-sep11-f3-review` | **5**, in 1 seduta | `docs/Sessioni di lavoro/10-08-26/Report-sep-11-post-f3-review-breve-10-08-26.md` | `senior_eval_pack_f3_reviewer` |

La stringa dell'esecutore finisce in `-review`: **senza le due lettere finali la regex non aggancia**.
Ma il campo `recorded_by.role` della stessa seduta scrive la parola per intero.

**Il numero vero è 11 controlli in 4 sedute, non 6 in 3.**

**Cosa devi fare.** Fare in modo che il comando trovi anche quel revisore.

⚠️ **La trappola, e non è piccola.** La correzione ovvia è allargare la regex a `/review/`. **Non
farlo di riflesso.** Il campo `esecutore` è testo libero che nei dati contiene *anche* stringhe di
comando (`npm run test:mss`, `git status --porcelain`, `node --check`…): più allarghi un pattern su un
campo libero, più diventi fragile. Il posto dove la parola è scritta per intero, in un campo con una
semantica sua, è **il ruolo**. Valuta di leggere quello.

**Obblighi dopo la modifica, non negoziabili:**

1. **Ri-stampa l'elenco completo degli attori distinti che il nuovo criterio cattura**, e guardalo.
   Se compare una stringa di comando, hai introdotto un falso positivo: stringi finché sparisce.
2. **Aggiorna la riga che dichiara il criterio in output.** Oggi dice «nessun altro testo è letto»:
   se leggi anche il ruolo, quella riga afferma il falso e il difetto si sposta invece di chiudersi.
   La dichiarazione del criterio è il motivo per cui questo difetto è stato trovato — **mantienila vera**.
3. `node --check scripts/mss/query.mjs`. **ESLint non vede questo file**: `lint` gira con
   `--ext ts,tsx` e `.eslintrc.cjs` ignora `*.mjs`. `validate` verde non dice nulla sul tuo lavoro.

---

## 5. Lavoro 3 — lo specchio è fermo e racconta una bugia al prossimo agente

`npm run mss:status` stampa ancora **`SK-6 NON INIZIATO`**, perché lo stato è derivato da
`docs/MetaSkillSystem/PLAN_V0.md` (riga ~98: `| S6 | SK-6 — mss:query (sola lettura) | NON INIZIATO | …`)
e nessuno l'ha aggiornata. Intanto `npm run mss:query` esiste, funziona ed è committato.

Non è pignoleria: **ogni mandato di questo cantiere impone `mss:status` come primo comando.** Oggi
quel comando direbbe al prossimo agente che il lettore delle capsule non è mai stato costruito.

**Cosa devi fare.** Aggiornare quella riga con le **prove vere** (i comandi e i loro esiti, nella
forma già usata per `SK-0`) e aggiungere una riga al registro cronologico in fondo al file.

⛔ **Non scrivere `CHIUSO`.** La chiusura di `SK-6` è **decisione di Matteo**, e non è stata presa.
Scrivi uno stato che dica il vero — l'attrezzo esiste, i cancelli sono verdi, la chiusura è da
decidere — e lascia la decisione a lui. Se scrivi «chiuso» stai decidendo al posto suo.

---

## 6. Perimetro e divieti — con il motivo accanto, così non si aggirano per distrazione

| Divieto | Perché |
|---|---|
| **Non toccare `scripts/mss/adapter.mjs`** | è il perimetro del pre-commit: allargarlo fa entrare **22 report** insieme. È `SK-4`, decide Matteo |
| **Non modificare le capsule di altre sedute** | sono `final`. La sola rettifica ammessa è `amendment`, e vive nella capsula di chi scrive |
| **Nessun `move` o `rename`** di file MSS | la suite delle prove risale un numero fisso di livelli: si rompe. La correzione è `SK-8`, non aperta |
| **Nessun `push`** | serve un sì esplicito di Matteo. `5b2c7db` è fermo in locale apposta |
| **Niente git distruttivo** — no `reset --hard`, no `push --force`, no `stash drop`, no rami cancellati | ci sono **8 stash**, e alcuni contengono lavoro non replicabile |
| **Non aprire `docs/_lavoro/`** | materiale personale. Puoi citarne i path, mai il contenuto |
| **Non toccare `src/`, il database, le migrazioni** | fuori cantiere |

**Puoi scrivere in:** `scripts/mss/query.mjs` · `docs/MetaSkillSystem/PLAN_V0.md` ·
`docs/Sessioni di lavoro/22-08-26/**`.

---

## 7. ⚠️ Un altro agente sta lavorando in parallelo

Matteo ha lanciato **in contemporanea una revisione indipendente su Codex** (famiglia di modello
diversa) sullo stesso lavoro `SK-6`. Non è un problema, ma impone due regole:

1. **Scrivi solo nei tuoi file.** Il revisore scrive un report suo, in un file suo. Non toccare file
   fuori dal tuo perimetro, e **non correggere il suo lavoro**.
2. **Il tuo Lavoro 2 cambia un numero che lui sta misurando** (da 6/3 a 11/4). È previsto: lui è
   avvisato e registrerà quale versione ha misurato. **Non aspettarlo e non anticiparlo** — fai il tuo
   lavoro e scrivi nel report **a che ora** hai modificato `query.mjs`, così i due racconti si
   riconciliano dopo.

---

## 8. Prove di chiusura — cinque, di cui una negativa

Nessuna vale se dichiarata a memoria: **esegui il comando e riporta l'esito vero**.

1. `npm run test:mss` → **exit 0**
2. `npm run validate:mss -- --mode file --file "<il tuo report>" --kind report --require-capsule` → **OK**
3. `npm run mss:query -- --verifica` → mostra il **numero nuovo** dei revisori, e l'elenco completo
   degli attori catturati **non contiene stringhe di comando**
4. `npm run mss:status` → la riga `SK-6` **non dice più `NON INIZIATO`**, e **non dice `CHIUSO`**
5. **Prova negativa:** `git status --porcelain` mostra che **nessuna capsula di altra seduta** è stata
   modificata. Se compare un `Report-*.md` che non è il tuo o quello `SK-6`, hai sforato

**Hai il permesso esplicito di fallire.** Se il Lavoro 2 non si può fare senza introdurre falsi
positivi, **non farlo** e scrivi perché: un difetto misurato e lasciato aperto con la sua ragione vale
più di una correzione che sposta il problema. Vale lo stesso per il Lavoro 1: se il contratto non
permette di esprimere quello che è successo, **dillo** invece di forzare i campi.

---

## 9. La capsula della tua seduta

Il report va in `docs/Sessioni di lavoro/22-08-26/` e chiude con la capsula
(`mss.session/0.1.1` + `mss-v0.1-wp0.1-freeze-2` — **leggi le costanti da `scripts/mss/rules.mjs`**,
non copiarle da qui).

- I `controls` devono avere **codici di uscita veri**: lancia il comando, leggi l'exit code, scrivilo.
  Non dichiarare `pass` a memoria.
- Gli orari con **secondi reali**.
- `verification.status` della tua capsula resta **`self_report`**: tu sei l'autore, non il verificatore.
  ⛔ **Non scrivere `independently_verified`** — è il valore che in 43 sedute non è mai comparso, e
  compilarlo da solo lo renderebbe falso al primo utilizzo della sua storia.

---

## 10. Backlog fuori perimetro — elencato perché non si perda, vietato toccarlo adesso

| Pacchetto | Debito |
|---|---|
| `SK-4` | la coppia schema legacy rende **opzionale** `controls`: `validate:mss` dice OK su una capsula senza prove |
| `SK-4` | un report in **sotto-cartella** è fuori dal perimetro del pre-commit (filtro `[^/]+`): 22 report reali |
| `SK-4` | `rule_id_version` è testo libero; lo schema **non ha alcun campo per i gate** né per i file toccati |
| `SK-5` | la CI gira **solo su `main`** e non contiene nulla di MSS |
| `SK-1` | non esiste alcun tag di ripristino: `git tag -l` è vuoto |
| `SK-8` | la suite risale un numero fisso di livelli: nessun `move` è sicuro |
| `SK-11` | gli attrezzi `mss:*` non hanno **un solo test**: `lint` gira su `--ext ts,tsx` e ignora `*.mjs` |
| — | gli hook di Claude Code vivono in un file **escluso da git**: quell'enforcement non esiste per nessun altro |
| — | il messaggio dello stop hook **afferma il falso** su `_skill-system-v0/`: dice gitignored, sono **31 file tracciati** e non ignorati |
