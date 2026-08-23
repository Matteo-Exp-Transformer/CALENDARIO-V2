# Prompt esecutore — Fase D: viste, rettifiche append-only e igiene documentale — 23-08-26

Profilo: Meta
Modalità: deep — puoi solo alzarla, mai abbassarla
Skill da leggere: `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md`; `docs/Testing-Skill/TESTING_SKILL.md`; semantica amendment in `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md`
Non caricare: `docs/APP_CONTEXT_SKILL.md` intero; `src/**`; `docs/_lavoro/**`; skill UI, DB o Supabase
Output attesi: modifiche documentali D2/D4/D5/D6/D9 nei soli file autorizzati; un report `docs/Sessioni di lavoro/23-08-26/Report-fase-d-docs-amendment-23-08-26.md` con capsula e handoff. Niente output in più senza chiedere Sì/No prima

Apri e segui integralmente `AGENTS.md`.

## 1. Ruolo e mandato

Agisci come writer documentale MetaSkillSystem della **Fase D**. Le Fasi B e C risultano concluse dagli esecutori e restano `self_report` fino alla revisione E.

Devi:

1. documentare la fotografia storica rispetto al vero HEAD senza riscrivere la storia;
2. riallineare o marcare come snapshot le tre viste stale;
3. rendere pulito il candidato documentale rispetto al gate whitespace reale;
4. rettificare D5 e D6 con semantica append-only;
5. inventariare tutte le prove che dovranno entrare nel futuro commit documentale;
6. preparare il terreno alla revisione integrata E.

Questo mandato non autorizza modifiche tecniche B/C, owner di stato, commit o push.

## 2. Decisioni non riapribili

- **M1:** mantenere `d1598b6`; nessuno split, rebase, squash correttivo o rewrite. Ogni modifica attuale resta destinata a commit successivi.
- **M2:** nessun push finché D1 non supera simulazione locale e revisione; dopo il push servirà comunque la prova GitHub Actions reale.
- **M3:** nessun `CHIUSO` con riserve; questa fase non promuove alcuno stato.
- **D1-A:** Matteo ha approvato il job MSS separato; la Fase C lo ha implementato. Non riaprire le opzioni B/C/D.
- **D16:** `SK-6` resta già `CHIUSO`; non riaprirlo.
- **D17:** famiglia diversa del revisore è raccomandata, non gate.
- **D18:** niente duplicazioni di regole.
- Il buco `Verbale-*` è stato affrontato in B ed è materia di verifica E, non backlog R1.
- `npm run validate` non sostituisce `npm run test:mss`.

## 3. Contesto obbligatorio, in ordine

1. `docs/Comunicazione-Skill/VOCABOLARIO.md` — intero.
2. `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md` — intero.
3. `docs/Testing-Skill/TESTING_SKILL.md` — intero.
4. `docs/Sessioni di lavoro/23-08-26/PLAN-POST-REVISIONE-RIMANENZE-23-08-26.md` — cappello, baseline, decisioni, inventario, §§11–18.
5. `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md` — introduzione append-only e §6 amendment.
6. `docs/MetaSkillSystem/PLAN_V0.md` — soltanto §4-bis, unico owner dello stato.
7. I due report di revisione originari del 23-08-26 — integralmente.
8. `Report-fase-b-fix-regex-query-23-08-26.md` e `Report-fase-c-ci-d1-23-08-26.md` — integralmente.
9. Le tre viste e i due report da rettificare elencati nel §6.

Non assumere veri i claim dei report esecutori: in questa fase puoi verificare la coerenza documentale e gli hash, ma la revisione tecnica completa appartiene a E.

## 4. Fase 0 — fotografia reale e collisioni

Prima di qualsiasi edit, esegui e registra:

```text
git branch --show-current
git rev-parse HEAD
git rev-parse origin/env/test
git merge-base --is-ancestor d1598b64a545fc988b3f4db3c8650858a3de493d HEAD
git rev-list --left-right --count origin/env/test...HEAD
git status --short
git diff --name-status
git diff --stat
git diff --check origin/env/test..HEAD
```

Baseline attesa prima della Fase D:

- branch `env/test`;
- `HEAD = d1598b64a545fc988b3f4db3c8650858a3de493d` e `origin/env/test = eee6cf7c10e4c8a58afdcc2af7e55b9e66c9c26a`, salvo commit successivo esplicitamente autorizzato e discendente;
- modifiche tracked B/C soltanto in:
  - `.github/workflows/ci.yml`;
  - `docs/MetaSkillSystem/tests/tools/run.mjs`;
  - `scripts/mss/query.mjs`;
  - `scripts/mss/validate-changed-reports.mjs`;
- report B e C presenti;
- piano, quattro prompt preparati e quattro report di questa catena presenti o attesi come non tracciati;
- i due report revisori originari ancora preservati.

Hash noti alla preparazione, da usare soltanto come controllo collisione se i file non sono stati legittimamente modificati dopo:

| File | SHA-256 |
|---|---|
| report B | `A31199B24814FF41E8AD5C34B48F9A2906AF0E41DC17CFD6DF3469A74526CC86` |
| report C | `339BFB849528B5A94F5DC40D4A34247E26144A0A4660CED7BC5282EC2AB6334B` |
| revisione Codex GPT-5 | `FE0D5E5F36824EC7D02D1E6E96D94C5B977021856C9FE01E4325244FA041888C` |
| revisione Cursor / Grok | `2BE0B500B5BE110098BD8EEC25BA66C6EE53D75769D57038A30812D0CF994C36` |

Se compaiono altre modifiche tracked, uno dei file è posseduto da un altro agente o un hash cambia durante il lavoro, fermati sul file coinvolto e segnala la collisione. Non sovrascrivere.

## 5. Fatti B/C da riportare senza promuoverli

- B dichiara D3/D7 tecnicamente corretti: una sola `REPORT_PATH_RE`, helper e query su `Report-*` + `Verbale-*`, tools **16/16**, H-1 **42 fixture + 32 gruppi**.
- C dichiara D1-A implementato nel solo workflow: job `ci` e `mss` indipendenti, nessun `needs`, nessun `continue-on-error`, simulazione locale MSS completa verde.
- La prova C è locale e `self_report`: GitHub Actions reale non è ancora osservata.
- `validate:docs` misura **17 path rotti nel workspace**, ma un checkout pulito CI-like ne misura **26** perché nove riferimenti puntano a file privati/gitignored assenti dal clone.
- La differenza 17/26 è una nuova evidenza ambientale da rendere visibile, non da correggere o allowlistare in questa fase.

Non trasformare questi fatti in `CHIUSO`, `independently_verified` o prova remota.

## 6. Ownership documentale esclusiva

Dichiara ownership prima del primo edit.

### Viste D2/D4

- `docs/Sessioni di lavoro/23-08-26/INDICE-SESSIONE-23-08-26.md`;
- `docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md`;
- `docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md`.

### Rettifiche D5/D6

- `docs/Sessioni di lavoro/23-08-26/Report-ciclo-SK-11-SK-5-23-08-26.md`;
- `docs/Sessioni di lavoro/23-08-26/Report-sk4-e1-perimetro-path-23-08-26.md`.

### Igiene whitespace D5

Possiedi soltanto i file e le righe che `git diff --check origin/env/test..HEAD` segnala realmente. La baseline nota include documenti del ciclo 23-08-26, non file tecnici B/C. Prima di estendere l'elenco, mostra la nuova diagnostica e verifica che il file sia documentale e non posseduto.

### Nuovo output

- `docs/Sessioni di lavoro/23-08-26/Report-fase-d-docs-amendment-23-08-26.md`.

Non modificare il piano post-revisione, `PLAN_V0.md`, report B/C, i due report revisori o i quattro file tecnici B/C.

## 7. D2 e D4 — storia, owner e viste

Aggiorna le tre viste senza creare un secondo owner:

1. punta sempre a `PLAN_V0.md` §4-bis per lo stato formale;
2. dichiara `d1598b6` come commit locale storico mantenuto per M1;
3. distingue lo stato a `d1598b6` dalle modifiche B/C correnti non ancora committate;
4. registra B/C come implementazioni tecniche `self_report`, in attesa della revisione integrata E;
5. registra che nessuna GitHub Actions reale è stata ancora osservata;
6. registra 17 workspace / 26 checkout pulito come evidenza ambientale, senza nasconderla;
7. corregge i prossimi passi obsoleti: prima D, poi E, poi gate locale e decisione push; non `SK-7`;
8. marca esplicitamente come snapshot storico ogni sezione che non deve essere mantenuta come vista corrente.

Non modificare retroattivamente report storici per far sembrare che conoscessero B/C. Usa date, HEAD e label snapshot.

## 8. D5 — strategia whitespace e rettifica del claim

La strategia approvata nel piano è: **pulizia meccanica fino al candidato reale exit 0**, più rettifica append-only del claim storico falso.

### 8.1 Protezione dei record finali

Prima di ogni pulizia:

- estrai e salva hash SHA-256 di ogni riga JSONL già presente nei report/documenti coinvolti;
- conserva byte per byte ogni record `final` esistente;
- non modificare, riordinare, riformattare o cancellare righe JSONL storiche;
- se la diagnostica whitespace colpisce una riga JSONL finalizzata, fermati su quel file e chiedi a Matteo: non pulirla.

Le righe Markdown esterne ai record possono essere ripulite senza cambiarne il significato. Se due spazi finali servivano come hard-break, sostituiscili con una struttura Markdown esplicita che non richieda trailing whitespace.

### 8.2 Claim `git diff --check`

Nel report ciclo SK-11/SK-5, preserva le frasi storiche alle vecchie righe 138, 262 e 301. Aggiungi una sezione di rettifica append-only che chiarisca:

- il comando senza range misurava il worktree di allora e usciva 0;
- il controllo significativo `git diff --check origin/env/test..HEAD` su `d1598b6` usciva 2;
- il criterio futuro richiede sempre base/head espliciti;
- la successiva pulizia documentale rende il candidato corrente pulito, ma non rende vera retroattivamente la prova storica.

Aggiungi un record `amendment` valido soltanto su un campo realmente presente in un record finalizzato e realmente collegato alla prova/uso del report. Non inventare field path. Se il claim falso esiste solo in prosa, la rettifica in prosa è obbligatoria e l'amendment deve correggere il campo probatorio più vicino senza attribuirgli un valore che non aveva. Motiva nel report D il target scelto.

## 9. D6 — claim Unicode

Nel report E1:

- non cancellare o riscrivere la nota storica secondo cui `Report-tiramisù-removal-db-migration-28-05-26.md` restava escluso;
- prova direttamente che la regex canonica riconosce quel path;
- non inventare un nuovo totale storico se il corpus dell'istante E1 non è ricostruibile;
- aggiungi una rettifica append-only in prosa;
- aggiungi un `amendment` con UUIDv7 nuovo che corregga soltanto campi realmente falsati nel record finalizzato E1, usando `previous_value_or_hash` esatto e un `field_path` valido.

Se i conteggi `+22`, `22/22` o 424 dipendono dal falso assunto Unicode, rettificali solo dopo una controprova riproducibile sul corpus corretto. Altrimenti correggi il booleano sul path e marca i totali come snapshot non ricostruiti, senza inventare numeri.

## 10. Semantica amendment obbligatoria

Per ogni amendment:

- coppia viva `mss.session/0.1.1` / `mss-v0.1-wp0.1-freeze-2`;
- `record_type: amendment`, UUIDv7 nuovi e non collidenti;
- target esistente e finalizzato;
- `relation: amends`, motivo, autore, data, `changes`, evidenze ed `effective_at` reali;
- append in coda, senza alterare alcuna riga preesistente;
- catena applicabile senza conflitti irrisolti;
- validazione del report con `--require-capsule`;
- hash delle righe finali preesistenti identici prima/dopo.

Un amendment non è un modo per riscrivere genericamente la narrativa: corregge campi puntuali.

## 11. D9 — inventario del futuro commit documentale

Nel report D crea una lista verificata, senza eseguire `git add`, commit o push, che includa almeno:

- i due report revisori originari;
- il piano post-revisione;
- i quattro prompt B/C/D/E;
- i report B, C e D;
- le tre viste aggiornate;
- i due report con rettifiche/amendment;
- ogni altro file documentale toccato esclusivamente dalla pulizia D5.

Se un file atteso manca, non inventarlo e non creare sostituti: segnala il buco.

## 12. Prove obbligatorie

Registra comando, exit code e riga probante:

```text
git diff --check origin/env/test..HEAD
git diff --check origin/env/test
npm run validate:docs
npm run test:mss
npm run mss:query -- --verifica
```

Interpretazione:

- il primo comando fotografa il commit storico `d1598b6` e può restare rosso finché le correzioni sono non committate;
- il secondo misura il candidato tracked corrente contro la base remota e deve uscire 0;
- ogni file nuovo non tracciato va controllato separatamente con un metodo `--no-index --check` che distingua “file diverso da NUL” da vere diagnostiche whitespace;
- `validate:docs` deve registrare la baseline workspace reale, non fingere verde;
- `test:mss` resta separato da `validate`.

Inoltre:

- valida singolarmente ogni report modificato/nuovo con `validate:mss ... --require-capsule`;
- dimostra che `mss:query -- --verifica` applica i nuovi amendment e non lascia catene irrisolte;
- confronta hash delle righe JSONL preesistenti prima/dopo;
- verifica che i quattro file tecnici B/C siano byte-invariati durante D;
- verifica zero temp e zero capsule invalide residue;
- registra `git status --short` finale contro la baseline.

## 13. Divieti e arresto

- Non modificare `.github/workflows/ci.yml`, helper, query, suite tools, adapter o package.
- Non correggere i 17/26 path, non modificare allowlist e non nascondere il debito docs.
- Non modificare `PLAN_V0.md`, stati owner o decisioni M1–M3/D16–D19.
- Non modificare i due report revisori né report B/C.
- Non aprire Testing Skill/T1 come lavoro documentale: la tabella comandi resta backlog H.
- Non aprire backlog R1, `SK-7`, `WP-1`, `SEP-G5`, DB, Supabase, `src/**` o `docs/_lavoro/**`.
- Non creare branch, non fare staging, commit o push e non dichiarare pacchetti `CHIUSO`.
- Non generare il prompt E: è già preparato separatamente.

Fermati se un record final dovrebbe essere riscritto, se un amendment non ha un target/field path onesto, se cambia un file B/C o se il candidato tracked non può raggiungere `git diff --check origin/env/test` exit 0 senza violare append-only.

## 14. Report e handoff

Il report D deve contenere:

- baseline e ownership;
- mappa D2/D4/D5/D6/D9 → file → prova;
- hash JSONL prima/dopo;
- amendment target, field path, motivo ed esito validazione;
- risultato 17 workspace e nota 26 checkout pulito già emersa in C;
- inventario futuro commit, senza staging;
- limiti, collisioni e cosa non è stato fatto;
- capsula viva valida;
- handoff operativo: stato vero, file rilasciati, autorità, decisioni chiuse e unico prossimo gate = revisione integrata E.

Chiusura verso Matteo: spiega in poche parole che hai aggiornato le “mappe” e aggiunto correzioni senza cancellare la storia; non chiedere commit o push.
