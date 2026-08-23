# Addendum al mandato «fix SK-6» — quattro cose verificate prima di lanciare l'esecutore

> Scritto il **22-08-26** dall'agente che ha costruito `SK-6`, **prima** che l'esecutore partisse.
> Non sostituisce `Prompt-fix-sk6-esecutore-22-08-26.md`: lo **integra**. Dove i due divergono,
> vale questo, perché qui i numeri sono stati misurati eseguendo il codice.

## 0. Il mandato regge

Ri-verificate a campione, tutte confermate: `HEAD` è `5b2c7db` · `PLAN_V0.md` riga 98 dice davvero
`NON INIZIATO` · `REVISORE_RE` è a `query.mjs:484` e la dichiarazione «nessun altro testo è letto» a
`:531` · `cursor-grok-sep11-f3-review` ha davvero **5** controlli con ruolo
`senior_eval_pack_f3_reviewer` · il flag `--require-capsule` esiste in `cli.mjs:21`.

I quattro punti qui sotto sono **aggiunte**, non correzioni di rotta.

---

## 1. ⚠️ Il numero «11 controlli in 4 sedute» è sbagliato — non inseguirlo

Il mandato §4 dice: «*Il numero vero è 11 controlli in 4 sedute, non 6 in 3.*» Quel numero è
un'addizione (6 + i 5 della seduta persa), non una misura.

**Misurato davvero**, leggendo `recorded_by.role` come il mandato stesso suggerisce:

| criterio | risultato |
|---|---|
| `esecutore` =~ `/reviewer\|revisor/` (oggi) | **6 controlli in 3 sedute** |
| `recorded_by.role` =~ `/reviewer\|revisor/` | **19 controlli in 5 sedute** |

Le 5 sedute, tutte con ruoli di revisione veri, **nessun falso positivo**:

| attore | ruolo dichiarato | controlli |
|---|---|---|
| `cursor-grok-sep11-f3-review` | `senior_eval_pack_f3_reviewer` | 5 |
| `cursor-grok-independent-reviewer` | `H-1.3_independent_senior_reviewer_post_remediation` | 4 |
| `cursor-grok-sep4-reviewer` | `senior_eval_pack_independent_reviewer` | 4 |
| `cursor-grok-sep10-b2` | `sep10_b2_revisore` | 4 |
| `codex-independent-reviewer` | `H-1.3_independent_senior_reviewer` | 2 |

Due cose che il mandato non poteva sapere:

1. **C'è una quinta seduta, non una quarta.** `sep10_b2_revisore` sta in
   `docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/` — una **sotto-cartella**, cioè uno dei
   6 report che il perimetro del pre-commit non vede (`SK-4`). Il difetto dello schema e il difetto
   del perimetro si sovrappongono sullo stesso file.
2. **Il criterio ruolo cambia la semantica, non solo il conteggio.** Attribuisce al revisore *tutti* i
   controlli del record, anche quelli il cui `esecutore` è una stringa di comando
   (`npm run test:mss`). Passa da «controlli **eseguiti da** un revisore» a «controlli **registrati in
   una seduta condotta da** un revisore». Sono due domande diverse ed entrambe legittime.

**Cosa ti si chiede:** decidi quale delle due domande rispondi, **scrivilo nella riga che dichiara il
criterio**, e riporta il numero che esce. ⛔ **Se ti esce un numero diverso da 11/4, hai ragione tu e
torto il mandato: scrivi il tuo.** Piegare il codice per far tornare un numero atteso è esattamente il
difetto che `SK-6` esiste per rendere visibile.

---

## 2. Tre vincoli del validatore sugli `amendment` — verificati in `core.mjs`, non deducibili dal contratto

Il Lavoro 1 passa da `validate:mss`. Questi tre ti fanno perdere tempo se li scopri per tentativi:

| vincolo | dove | conseguenza |
|---|---|---|
| **`segment_no` deve essere identico** a quello del `session_event` del bundle | `core.mjs:966-971` | il tuo amendment va con `segment_no: 1`, **non** 2, anche se è un secondo segmento nella realtà. La «seconda sessione di lavoro» la racconti in `reason`, non nel numero |
| `capture_key` = `<session_id>/<segment_no>/<record_type>/<ordinale>` | `core.mjs:502-505` | il tuo: `mss-ses-01a0294a-aa53-7905-bd1c-e8583922a38e/1/amendment/1` |
| `field_path` deve combaciare con `/^(?:event\|annotation\|amendment)(?:\.[A-Za-z0-9_]+\|\[\d+\])+$/` | `core.mjs:676` | è un **percorso di campo**, non prosa: `event.observed_outcome` va bene, una frase no |

In più: `relation: "amends"` — con `supersedes` il validatore emette un rilievo esplicito
(`core.mjs:448-455`: «*supersedes has no deterministic replacement payload in the current contract*»).
E l'`amendment_id` vuole il suo prefisso: `mss-amd-…` **UUIDv7** (`rules.mjs:129` — nibble di versione
`7`, variante `[89ab]`; `crypto.randomUUID()` è v4 e **non passa**).

Nota di merito, perché cambia cosa stai facendo: gli amendment non sono commenti, **vengono
applicati** (`core.mjs:702-760`) per ricostruire la vista effettiva del record. Il tuo `field_path`
deve puntare a un campo che esiste davvero, e `previous_value_or_hash` al valore che c'è adesso.

---

## 3. La prova 2 del mandato ha un buco: valida solo il tuo report

Il mandato §8 chiede `validate:mss` su «*il tuo report*». Ma il Lavoro 1 modifica **la capsula del
report `SK-6`**, che è un altro file. Se l'amendment è malformato, quella prova non se ne accorge.

**Aggiungi una sesta prova:**

```bash
npm run validate:mss -- --mode file --file "docs/Sessioni di lavoro/22-08-26/Report-sk6-mss-query-22-08-26.md" --kind report --require-capsule
```

Deve dire **OK**. È il file che stai rettificando: è quello che conta.

---

## 4. Committa? No — ma non per il motivo che pensi

Il mandato vieta il `push` e tace sul `commit`. **Non committare comunque:** il commit di questa
tornata lo fa l'agente che ti ha lanciato, dopo aver revisionato il tuo lavoro. Tu consegna l'albero
di lavoro pulito e il report scritto.

Resta valido tutto il §6 del mandato, incluso il divieto su `adapter.mjs` e sui `move`.
