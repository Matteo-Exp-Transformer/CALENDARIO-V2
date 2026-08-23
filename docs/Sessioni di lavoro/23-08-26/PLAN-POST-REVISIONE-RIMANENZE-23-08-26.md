# Piano post-revisione delle rimanenze MSS — 23-08-26

**Stato reale:** `env/test` è a `d1598b6`, un commit locale avanti a `origin/env/test`; `SK-6` resta già `CHIUSO` per D16, mentre nessun altro perimetro è eleggibile alla chiusura senza riserve.
**Cosa resta:** correggere la raggiungibilità CI, convergere filtri e messaggi, riallineare le viste, rettificare le prove false e integrare i due report concorrenti senza riscrivere record finali.
**Gate push e gate CHIUSO:** prima del push servono simulazione locale MSS verde, revisione integrata senza riserve bloccanti e autorizzazione di Matteo; dopo il push serve una run GitHub Actions reale prima di qualunque promozione di stato.

> **Tipo:** piano operativo documentale, modalità `deep`.
> **Autorità di questa seduta:** sola pianificazione. Nessun fix, commit, push, aggiornamento owner o dichiarazione `CHIUSO` è autorizzato da questo documento.
> **Owner dello stato:** `docs/MetaSkillSystem/PLAN_V0.md` §4-bis. Questo piano coordina il lavoro futuro e non replica né sostituisce l'owner.

## 1. Baseline Git verificata

Fotografia acquisita in sola lettura prima della redazione. Tutti i valori vincolanti coincidono con il mandato.

| Controllo | Output verificato | Esito |
|---|---|---|
| `git branch --show-current` | `env/test` | conforme |
| `git rev-parse HEAD` | `d1598b64a545fc988b3f4db3c8650858a3de493d` | conforme |
| `git rev-parse origin/env/test` | `eee6cf7c10e4c8a58afdcc2af7e55b9e66c9c26a` | conforme |
| `git rev-list --left-right --count origin/env/test...HEAD` | `0 1` | behind 0, ahead 1 |
| `git status --short` | soltanto i due report di revisione non tracciati | conforme |
| `npm run validate:docs` | exit `1`; 186 Markdown, 965 path controllati, 17 rotti | D1 riprodotto |
| `git diff --check origin/env/test..HEAD` | exit `2`; trailing whitespace nel range reale | D5 riprodotto |

Stato iniziale del worktree:

```text
?? "docs/Sessioni di lavoro/23-08-26/Report-revisione-indipendente-sessione-mss-23-08-26.md"
?? "docs/Sessioni di lavoro/23-08-26/Report-senior-revisione-complessiva-23-08-26.md"
```

I due report sono stati letti integralmente e preservati. Hash SHA-256 prima e dopo la lettura:

| Report | SHA-256 invariato |
|---|---|
| revisione Codex GPT-5 | `FE0D5E5F36824EC7D02D1E6E96D94C5B977021856C9FE01E4325244FA041888C` |
| revisione Cursor / Grok 4.6 | `2BE0B500B5BE110098BD8EEC25BA66C6EE53D75769D57038A30812D0CF994C36` |

> **Rettifica F1 autorizzata da Matteo:** il secondo hash resta la fotografia originaria usata
> dalle Fasi A–E. Prima del commit sono stati rimossi sei spazi finali fuori dalla capsula, senza
> cambiare il contenuto semantico. Hash corrente del report Cursor/Grok:
> `6A8485BBA799525E751D003F19F3D1E988ABC0210B2F3ABDAB8A7907D69A7F34`.

Il comando `git diff --name-status origin/env/test..HEAD` conferma che `d1598b6` contiene 43 path e combina i cantieri `SK-4`, Senior docs, `SK-11` e `SK-5`:

```text
M  .claude/hooks/fine-sessione-senior.mjs
M  .eslintrc.cjs
M  .github/workflows/ci.yml
M  _skill-system-v0/comunicazione/EVOLUZIONE_SKILLS.md
M  _skill-system-v0/hooks/fine-sessione-senior.mjs
M  docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md
M  docs/MetaSkillSystem/PLAN_V0.md
M  docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md
M  docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md
A  docs/MetaSkillSystem/fixtures/v0.1/FX-I11-legacy-new.jsonl
M  docs/MetaSkillSystem/fixtures/v0.1/manifest.json
M  docs/MetaSkillSystem/tests/h1/build-fixtures.mjs
A  docs/MetaSkillSystem/tests/tools/run.mjs
A  docs/Sessioni di lavoro/23-08-26/HANDOFF-CODEX-SK-11-SK-5-23-08-26.md
A  docs/Sessioni di lavoro/23-08-26/HANDOFF-CURSOR-SK-4-23-08-26.md
A  docs/Sessioni di lavoro/23-08-26/INDICE-SESSIONE-23-08-26.md
A  docs/Sessioni di lavoro/23-08-26/PLAN-CODEX-SK-11-SK-5-23-08-26.md
A  docs/Sessioni di lavoro/23-08-26/PLAN-CURSOR-SK-4-23-08-26.md
A  docs/Sessioni di lavoro/23-08-26/Prompt-avvio-CODEX-SK-11-SK-5-23-08-26.md
A  docs/Sessioni di lavoro/23-08-26/Prompt-senior-chiusura-sessione-23-08-26.md
A  docs/Sessioni di lavoro/23-08-26/Prompt-sk4-e1-perimetro-path-23-08-26.md
A  docs/Sessioni di lavoro/23-08-26/Prompt-sk4-e2-legacy-core-23-08-26.md
A  docs/Sessioni di lavoro/23-08-26/Prompt-sk4-e3-contratto-23-08-26.md
A  docs/Sessioni di lavoro/23-08-26/Prompt-sk4-e4-integrazione-23-08-26.md
A  docs/Sessioni di lavoro/23-08-26/Prompt-sk4-revisione-indipendente-23-08-26.md
A  docs/Sessioni di lavoro/23-08-26/Report-ciclo-SK-11-SK-5-23-08-26.md
A  docs/Sessioni di lavoro/23-08-26/Report-ciclo-SK-4-23-08-26.md
A  docs/Sessioni di lavoro/23-08-26/Report-senior-chiusura-sessione-23-08-26.md
A  docs/Sessioni di lavoro/23-08-26/Report-sk4-e1-perimetro-path-23-08-26.md
A  docs/Sessioni di lavoro/23-08-26/Report-sk4-e2-legacy-core-23-08-26.md
A  docs/Sessioni di lavoro/23-08-26/Report-sk4-e3-contratto-23-08-26.md
A  docs/Sessioni di lavoro/23-08-26/Report-sk4-revisione-indipendente-23-08-26.md
M  package.json
M  scripts/_test-email-once.mjs
M  scripts/mss/adapter.mjs
M  scripts/mss/core.mjs
M  scripts/mss/git-adapter.mjs
M  scripts/mss/query.mjs
M  scripts/mss/rules.mjs
A  scripts/mss/runtime.mjs
M  scripts/mss/status.mjs
A  scripts/mss/validate-changed-reports.mjs
M  scripts/sync-to-prenotazen.mjs
```

Questa ampiezza è una fotografia storica, non un invito a riscrivere il commit.

## 2. Decisioni non riapribili e autorità

| ID | Decisione di Matteo | Conseguenza vincolante per gli agenti futuri |
|---|---|---|
| M1 | mantenere il commit unico `d1598b6` | vietati split, rebase, squash correttivo e ogni rewrite; i fix vivono in commit successivi |
| M2 | nessun push finché D1 non è dimostrato verde | prima del primo push serve una simulazione locale equivalente e documentata del job MSS; dopo il push autorizzato serve la prova GitHub Actions reale |
| M3 | `CHIUSO` soltanto senza riserve | nessuna promozione di `SK-4`, Senior docs, `SK-11` o `SK-5` finché tutti i blocker del rispettivo perimetro non sono accettati |
| D16 | `SK-6` è già `CHIUSO` | non riaprire `SK-6`; verificare soltanto l'assenza di regressioni |
| D17 | cambio famiglia consigliato, non gate | la revisione dedicata resta obbligatoria; la famiglia diversa è raccomandata ma non blocca da sola |
| D18 | snellire, non duplicare | una regola esistente si importa; non si crea una seconda implementazione equivalente |

Le raccomandazioni dei due revisori su push o chiusure non prevalgono su M1–M3. Solo Matteo, oppure un agente con mandato esplicito successivo alla sua decisione, può modificare lo stato in `PLAN_V0.md` §4-bis.

## 3. Confronto probatorio dei due revisori

### 3.1 Fatti convergenti

| Fatto | Codex GPT-5 | Cursor / Grok 4.6 | Uso nel piano |
|---|---|---|---|
| `SK-6` non regredisce | confermato | confermato | nessun lavoro su `SK-6` |
| B1/B2/B3 locali | deny riprodotti | deny riprodotti | Wave 1 non si riapre |
| suite H-1 | 42 fixture + 32 gruppi, exit 0 | stesso esito | gate da ripetere dopo i fix |
| suite tools | 9/9, rosso 1/9 e ripristino verde | stesso esito e stesso hash | `SK-11` tecnicamente solido, ma D5 resta documentale/integrativo |
| regex repo-level | due `REPORT_PATH_RE` | due `REPORT_PATH_RE` | D3 reale |
| filtro CI `Verbale-*` | helper più stretto | prova diretta: `Verbale-*` invalido non visto | D3 è blocker `SK-5`, non backlog |
| viste statiche | indice, roadmap e handoff stale | stessa divergenza | D4 reale |
| helper `SK-5` isolato | rosso→verde | rosso→verde, con deny differente | il componente locale funziona; non prova la raggiungibilità del job |
| `validate:docs` | baseline 17, exit 1 | baseline 17, exit 1 | debito reale da mantenere visibile |
| provenienza | classificata con cautela | annotazioni `self_report` | nessuna elevazione automatica della verifica |

### 3.2 Divergenze da non appiattire

| Tema | Codex GPT-5 | Cursor / Grok 4.6 | Risoluzione di coordinamento |
|---|---|---|---|
| `SK-5` | `CORREGGERE`: `validate:docs` ferma il job prima dei passi MSS | confermato con riserve perché helper e filtro `Report-*` funzionano isolati | entrambi veri; D1 misura la raggiungibilità del job, non la correttezza isolata dell'helper |
| push | non autorizzarlo | raccomanda push dell'aggregato | M2 prevale: nessun push prima della simulazione locale D1 verde e del sì di Matteo |
| chiusure | nessun perimetro eleggibile senza riserve | propone `SK-4` e `SK-11`, `SK-5` con riserve | M3 prevale: nessuna chiusura con riserve |
| deny della prova CI | `MSS-VITAL-MISSING` nel log originario | riproduce `MSS-REPORT-NO-CAPSULE` | prova richiesta sul comportamento rosso + path + codice reale; non fissare un codice non riproducibile |
| D5 | range reale `diff --check` rosso | non emerso come difetto centrale | D5 resta reale perché riprodotto direttamente e documentato da Codex |
| path Unicode E1 | claim falso provato da Codex | non contestato | D6 richiede amendment append-only |

### 3.3 Verdetti di ingresso

| Perimetro | Codex GPT-5 | Cursor / Grok 4.6 | Eleggibile `CHIUSO` ora |
|---|---|---|---|
| `SK-6` | già chiuso, nessuna regressione | confermato | sì, già `CHIUSO` per D16 |
| `SK-4` | `ACCETTA CON RISERVE` | confermato con riserve repo-level | no |
| Senior docs | `ACCETTA CON RISERVE` | corretto ma con viste stale | no |
| `SK-11` | `ACCETTA CON RISERVE` | confermato tecnicamente | no |
| `SK-5` | `CORREGGERE` | confermato con riserve | no |
| Integrazione | `CORREGGERE` | debiti di governance e regex | no |

## 4. Inventario operativo D1–D9 e T1

| ID | Severità | Pacchetto/perimetro | Prova reale | Criterio di accettazione | Blocca push? | Blocca `CHIUSO` |
|---|---|---|---|---|---|---|
| D1 | bloccante push | `SK-5`, integrazione | workflow: `validate:docs` precede i tre step MSS; comando locale exit 1 con 17 path | il job MSS viene realmente eseguito e resta hard-fail; il debito docs rimane visibile e non mascherato | sì | `SK-5`, integrazione |
| D2 | governance, accettato | integrazione, storia sessione | `d1598b6` è un commit unico di 43 path; report storici dicono ancora “nessun commit” | documentare fotografia storica vs HEAD; mantenere `d1598b6` senza rewrite per M1 | no, se documentato | integrazione finché non documentato |
| D3 | media | `SK-4`, `SK-5`, integrazione | `adapter.mjs` riconosce `(Report|Verbale)`; helper CI definisce un secondo filtro solo `Report` | una policy canonica importata oppure separazione esplicita e non duplicata; test automatici per `Report-*` e `Verbale-*` | sì tramite D1/D3 integrati | `SK-4`, `SK-5`, integrazione |
| D4 | media | Senior docs, integrazione | indice, roadmap e handoff divergono da owner e `d1598b6` | viste coerenti con l'owner oppure marcate inequivocabilmente come snapshot storico con data/HEAD | no | Senior docs, integrazione |
| D5 | media | `SK-11`, integrazione | `git diff --check origin/env/test..HEAD` exit 2; claim precedenti dichiarano exit 0 | range reale exit 0 e rettifica append-only del claim storico; criterio pre-push usa sempre base/head espliciti | sì finché il gate reale è rosso | `SK-11`, integrazione |
| D6 | bassa | `SK-4` | E1 esclude il path Unicode, ma la regex canonica lo riconosce | amendment append-only del record/claim; record final originale invariato | no | `SK-4` |
| D7 | bassa | `SK-4`, integrazione | `query.mjs` importa la regex canonica ma dice “solo Report” in tre output | testo coerente con `Report-*` + `Verbale-*`; test che rende la regressione rossa | no | `SK-4`, integrazione |
| D8 | informativa | provenienza | Cursor Composer/Auto non espone sempre la famiglia sottostante | nota epistemica conservata; nessuna falsa `independently_verified` | no | nessuno per D17 |
| D9 | documentale | commit documentale, integrazione | i due report di revisione sono non tracciati | includere entrambi i report e questo piano nel futuro commit documentale autorizzato | sì: non lasciare prove fuori dal commit autorizzato | integrazione documentale |
| T1 | chiarimento test | `SK-11`, `SK-5`, Testing | `package.json`: `validate` include tools 9/9 ma non `test:mss`; H-1 è separato | matrice esplicita dei comandi; mai usare `validate` come prova delle 42 fixture | no da solo | riserva `SK-11`/integrazione se dichiarato male |

## 5. Backlog R1 non bloccante

Questi elementi restano fuori dal percorso critico e non riaprono Wave 1 di `SK-4`:

- hook Q/R Cursor con regex `[^/]+`;
- propagazione di `--require-capsule` nel percorso CLI staged;
- testo storico di `PLAN_V0.md` sul divieto assoluto di toccare `adapter.mjs`.

Il buco `Verbale-*` nell'helper CI non appartiene a questo backlog: è D3 e blocca `SK-5` senza riserve.

## 6. Dipendenze e percorso critico

```text
A: decisione Matteo D1
  ├─> B: convergenza D3 + D7
  │     └─> C: implementazione D1 sulla versione finale dell'helper
  └─> D: documentazione D2/D4/D5/D6/D9, preparabile su file disgiunti
            └──────────────┬───────────────┘
                           v
                  E: revisione integrata
                           v
                  F1: gate locale pre-push
                           v
                  sì esplicito di Matteo
                           v
                  F2: push + GitHub Actions reale
                           v
                  G: eleggibilità senza riserve
                           v
                  H: backlog post-chiusura
```

Il vincolo decisivo è che C segue B: la simulazione CI finale deve usare il filtro definitivo, non una versione destinata a cambiare. D può essere preparata in parallelo soltanto su file dichiarati e disgiunti. E parte quando tutti i proprietari hanno rilasciato i file.

## 7. Fase A — decisione D1

**Stato iniziale:** `ATTESA MATTEO`.

Nessun file viene modificato in questa fase. Il coordinatore presenta la scheda §8, registra la scelta di Matteo nel mandato successivo e impedisce all'esecutore D1 di partire senza quella decisione.

Criterio di uscita:

- scelta A/B/C/D esplicita;
- perimetro del futuro esecutore coerente con la scelta;
- M1–M3 ripetute nel prompt figlio;
- nessuna interpretazione del silenzio come approvazione.

## 8. Scheda decisionale D1

| Opzione | Disegno | Vantaggio | Costo/rischio | Giudizio |
|---|---|---|---|---|
| A | job MSS separato e indipendente dal gate docs; esegue `validate:mss:changed`, `test:mss`, `test:mss:tools` | i gate MSS girano sempre, restano hard-fail e il debito docs resta visibile in un job distinto | piccola ristrutturazione YAML; due domini da nominare chiaramente | **raccomandata** |
| B | riparare i 17 path documentali | rende verde anche `validate:docs` | scope molto più ampio, attribuzione separata, rischio di assorbire debito Console/MSS nel fix CI | non assorbire nel fix MSS |
| C | spostare i passi MSS prima di `validate:docs` nello stesso job | modifica minima e gate MSS raggiungibili | workflow comunque rosso sulla baseline docs; domini ancora accoppiati | accettabile solo come scelta minima esplicita |
| D | `continue-on-error` sul gate docs | il job prosegue | il debito reale può diventare rumore ignorato | non raccomandata; richiede decisione esplicita e riepilogo Actions evidente |

**Raccomandazione predefinita: A.** Separa il dominio MSS dal debito documentale senza rendere facoltativo nessuno dei due: entrambi restano visibili e hard-fail nei rispettivi job.

### Circolarità del primo push

GitHub Actions non può provare un commit che non è stato pushato. Per rispettare M2:

1. prima del primo push, un agente costruisce in un repository isolato una simulazione locale documentata dello stesso job MSS e la rende verde;
2. Matteo esamina prove e revisione, poi autorizza esplicitamente il push;
3. dopo il push, la chiusura formale richiede anche che GitHub Actions abbia eseguito davvero il job MSS e che quel job sia verde.

La simulazione locale è il gate per autorizzare il primo push; non sostituisce la prova Actions post-push.

## 9. Fase B — convergenza tecnica D3 e D7

**Stato iniziale:** `NON INIZIATO`; prerequisito A.

### Mandato dell'esecutore

- scegliere e documentare un solo comportamento canonico per `Report-*` e `Verbale-*`;
- importare la policy canonica nell'helper CI, salvo motivazione esplicita e testata per una separazione semantica reale;
- mantenere `adapter.mjs` come fonte della policy, coerentemente con D18;
- aggiornare l'output di `query.mjs` perché dichiari il perimetro effettivo;
- aggiungere test automatici che provino almeno un `Report-*` e un `Verbale-*`, inclusi path in sottocartella e caso non pertinente;
- provare comportamento vuoto, rosso e verde dell'helper;
- non toccare il workflow in questa fase.

### File probabili e ownership

Proprietario temporaneo unico B:

- `scripts/mss/adapter.mjs`;
- `scripts/mss/validate-changed-reports.mjs`;
- `scripts/mss/query.mjs`;
- test MSS/tools strettamente necessari, probabilmente `docs/MetaSkillSystem/tests/tools/run.mjs`;
- `package.json` soltanto se un comando di test dedicato è indispensabile.

`query.mjs` può avere un proprietario D7 separato soltanto se il diff D3 non lo tocca e i due proprietari dichiarano i file prima di iniziare. La scelta predefinita è un unico proprietario B per ridurre collisioni e retest.

### Prove richieste

- `node --check` per ogni `.mjs` modificato;
- lint script zero warning;
- test automatico `Report-*` valido/invalido;
- test automatico `Verbale-*` valido/invalido;
- caso nessun report/verbale toccato con messaggio esplicito;
- `npm run test:mss` 42 fixture + 32 gruppi;
- `npm run test:mss:tools` 9/9 o conteggio superiore documentato;
- test del testo `query.mjs` per impedire il ritorno a “solo Report”.

Revisore di fase: agente Verifica distinto dall'esecutore; non promuove stati.

## 10. Fase C — implementazione D1 sulla versione finale dell'helper

**Stato iniziale:** `NON INIZIATO`; prerequisiti A e B rilasciata.

### Perimetro

- con opzione A, modificare soltanto `.github/workflows/ci.yml`, salvo prova che un supporto minimo già autorizzato sia indispensabile;
- con opzione B, aprire un mandato documentale separato per i 17 path: non assorbirli silenziosamente nel fix MSS;
- preservare tutti i gate applicativi esistenti;
- mantenere `validate:docs` visibile e hard-fail;
- rendere `validate:mss:changed`, `test:mss` e `test:mss:tools` un job distinto e hard-fail;
- non usare `continue-on-error` senza scelta D esplicita di Matteo.

### Simulazione locale obbligatoria

Creare un repository temporaneo isolato, dopo verifica del path assoluto, usando base e head reali. Provare:

1. `Report-*` invalido → rosso, path e codice MSS espliciti;
2. `Verbale-*` invalido → rosso, se la policy canonica D3 include entrambi come previsto;
3. stato ripulito → verde;
4. nessun report/verbale toccato → comportamento dichiarato e exit coerente;
5. job MSS completo → tutti e tre i comandi raggiunti e verdi;
6. il fallimento `validate:docs` resta osservabile nel dominio separato;
7. root temporanea rimossa in sicurezza e nessun artefatto residuo.

La prova finale C avviene soltanto dopo l'integrazione di D3 e D7.

## 11. Fase D — documentazione e prove D2, D4, D5, D6 e D9

**Stato iniziale:** `NON INIZIATO`; può essere preparata dopo A in parallelo a B/C solo su file disgiunti.

### D2 — fotografia storica

- dichiarare che `d1598b6` è mantenuto per M1;
- distinguere lo stato dei report al momento della loro chiusura dal successivo HEAD aggregato;
- non riscrivere fotografie storiche: etichettarle come snapshot o aggiungere rettifiche append-only.

### D4 — viste

Allineare o marcare come snapshot:

- `docs/Sessioni di lavoro/23-08-26/INDICE-SESSIONE-23-08-26.md`;
- `docs/MetaSkillSystem/Senior-Eval-Pack/ROADMAP_V0.md`;
- `docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md`.

Ogni vista deve puntare all'owner e non trasformarsi in un secondo owner.

### D5 — strategia scelta

**Strategia primaria scelta: pulizia meccanica del contenuto fino a `git diff --check origin/env/test..HEAD` exit 0.**

Vincoli della pulizia:

- rimuovere trailing whitespace soltanto dove non altera record JSONL `final`;
- fotografare le righe JSONL finali prima e dopo e dimostrarle byte-identiche;
- se una riga finalizzata risultasse coinvolta, non modificarla: usare un amendment e chiedere a Matteo se ridefinire il range del gate;
- aggiungere comunque un amendment append-only per rettificare il claim storico “`git diff --check` exit 0”, specificando che il comando senza range non misurava `d1598b6`;
- il gate futuro usa sempre base/head espliciti; `git diff --check` senza range non è prova del commit.

Motivazione: rende il range realmente pulito senza normalizzare una prova falsa e preserva l'immutabilità dei record finali.

### D6 — claim Unicode

Aggiungere un amendment append-only che corregga il claim E1 sul path Unicode. Vietato riscrivere il record final originale.

### D9 — prove non tracciate

Nel futuro commit documentale autorizzato includere:

- `Report-senior-revisione-complessiva-23-08-26.md`;
- `Report-revisione-indipendente-sessione-mss-23-08-26.md`;
- questo piano;
- viste e amendment autorizzati.

Il commit documentale resta successivo ai fix tecnici e alla revisione; nessun push avviene senza il gate F.

## 12. Fase E — revisione integrata dei fix

**Stato iniziale:** `NON INIZIATO`; parte soltanto quando B, C e D hanno rilasciato tutti i file.

Profilo: Verifica accurata, agente dedicato con contesto libero. Cambio famiglia raccomandato, non bloccante per D17.

Il revisore deve:

- riaprire integralmente entrambi i report del 23-08-26;
- confrontare D1–D9 e T1 con il diff finale;
- ripetere le prove rosso→verde D1/D3 su `Report-*` e `Verbale-*`;
- dimostrare che il job MSS completo è raggiunto nella simulazione;
- verificare che il debito docs sia ancora visibile;
- verificare che nessun record final sia stato modificato o cancellato;
- verificare owner, viste, perimetri e assenza di collisioni;
- ripetere il range reale `git diff --check`;
- assegnare verdetti distinti a `SK-4`, Senior docs, `SK-11`, `SK-5` e integrazione;
- non dichiarare alcun perimetro `CHIUSO`.

Criterio di uscita: nessuna riserva bloccante; eventuale backlog R1 è chiaramente separato.

## 13. Fase F — gate pre-push e post-push

### F1 — gate locale pre-push

Tutte le caselle devono essere vere:

- [ ] `HEAD` discende da `d1598b6`; nessun rewrite, split, rebase o squash correttivo.
- [ ] Nessuna modifica fuori perimetro rispetto alle ownership dichiarate.
- [ ] `node --check` su ogni `.mjs` modificato → exit 0.
- [ ] `npm run lint` → exit 0, zero warning lint.
- [ ] `npm run test:mss` → 42 fixture + 32 gruppi, exit 0, oppure conteggio superiore spiegato e verde.
- [ ] `npm run test:mss:tools` → almeno 9/9, exit 0.
- [ ] `npm run validate` → exit 0.
- [ ] Il report di gate dichiara che `validate` non sostituisce `test:mss`.
- [ ] `npm run validate:docs` misurato e confrontato con la baseline 17; il debito non è nascosto.
- [ ] `validate:mss:changed` prova rosso→verde su `Report-*`.
- [ ] `validate:mss:changed` prova rosso→verde su `Verbale-*` secondo la policy canonica D3.
- [ ] Simulazione locale del job MSS completo → verde e tutti e tre i passi raggiunti.
- [ ] `git diff --check` eseguito sul range reale base/head definito dal piano → exit 0.
- [ ] Tutti i report standard/deep nuovi o modificati → `validate:mss OK` con capsula richiesta.
- [ ] Zero directory temporanee e zero capsule invalide residue.
- [ ] I due report revisori e questo piano sono inclusi nel futuro commit documentale previsto.
- [ ] Revisione integrata senza riserve bloccanti.
- [ ] Matteo autorizza esplicitamente il push.

### F2 — gate post-push

Prima di qualunque promozione:

- [ ] GitHub Actions ha realmente eseguito il job MSS sul commit autorizzato.
- [ ] Il job MSS è verde e mostra l'esecuzione di changed reports, H-1 e tools.
- [ ] L'eventuale debito `validate:docs` resta visibile e non mascherato.
- [ ] Il branch remoto punta esattamente ai commit autorizzati.
- [ ] Il worktree locale è pulito.
- [ ] Nessun report di prova o directory temporanea è rimasto nel repository.
- [ ] Matteo conferma le dichiarazioni di stato, perimetro per perimetro.

## 14. Fase G — eleggibilità `CHIUSO`

Questa tabella stabilisce eleggibilità, non aggiorna l'owner.

| Perimetro | D3 | D4 | D5 | D6 | D7 | D1/CI reale | Suite specifiche | Revisione senza riserve | Eleggibile |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `SK-4` | [ ] | n/a | n/a | [ ] | [ ] | n/a | B1/B2/B3 [ ] | [ ] | [ ] |
| Senior docs | n/a | [ ] | n/a | n/a | n/a | n/a | viste coerenti/snapshot [ ] | [ ] | [ ] |
| `SK-11` | n/a | n/a | [ ] | n/a | n/a | n/a | tools 9/9 + controprova rossa [ ] | [ ] | [ ] |
| `SK-5` | [ ] | n/a | n/a | n/a | n/a | [ ] | changed + H-1 + tools [ ] | [ ] | [ ] |
| Integrazione | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | nessuna collisione/temp [ ] | [ ] | [ ] |

Condizioni minime in forma sintetica:

| Perimetro | Condizioni minime |
|---|---|
| `SK-4` | D3, D6 e D7 accettati; B1/B2/B3 ancora verdi |
| Senior docs | D4 accettato; viste coerenti o marcate snapshot |
| `SK-11` | D5 rettificato; suite 9/9 e controprova rossa ancora valide |
| `SK-5` | D1 e D3 accettati; job MSS reale eseguito e verde |
| Integrazione | D1, D4 e D5 accettati; nessuna collisione o temp; revisione finale senza riserve |

`SK-6` non compare fra le promozioni: è già `CHIUSO` per D16 e non viene riaperto.

## 15. Fase H — backlog post-chiusura

Soltanto dopo l'eleggibilità e la decisione di Matteo su `SK-5`:

1. hook Q/R Cursor;
2. propagazione `--require-capsule` staged;
3. chiarimento del testo storico su `adapter.mjs`;
4. eventuale tabella stabile nella Testing Skill: `validate` vs `test:mss` vs `test:mss:tools` vs CI;
5. `SK-7`.

Non aprire `SK-7` prima. Non aprire `WP-1`, `SEP-G5`, DB, Supabase o `src/**` in questo ciclo.

## 16. Matrice agenti e concorrenza

| Fase | Profilo | File posseduti | Prerequisiti | Revisore | Parallelizzabile |
|---|---|---|---|---|---|
| A | Meta coordinatore | nessuno | questo piano | Matteo decide | no |
| B | Esecuzione MSS tecnica | adapter, helper changed-reports, query, test MSS/tools; package solo se dovuto | scelta D1 registrata | Verifica tecnica distinta | no all'interno della fase |
| C | Esecuzione CI | `.github/workflows/ci.yml` | A + B integrata e rilasciata | revisore E | sì con D su file disgiunti |
| D | Meta documentale | indice, roadmap, handoff, report/amendment autorizzati | A; strategia D5 confermata nel mandato | revisore E | sì con B/C, solo file disgiunti |
| E | Verifica integrata | nessun edit salvo report autorizzato | B+C+D rilasciate | agente dedicato; famiglia diversa consigliata | no |
| F1 | Meta coordinatore/gate | nessun edit tecnico | E senza blocker | Matteo per push | no |
| F2 | operatore Git autorizzato | commit/branch autorizzati | sì esplicito Matteo | GitHub Actions + Matteo | no |
| G | Meta owner writer | `PLAN_V0.md` §4-bis solo con mandato | F2 verde + decisione Matteo | Matteo | no |
| H | da definire per ticket | file del singolo backlog | `SK-5` eleggibile/chiuso | revisore dedicato | per ticket disgiunti |

Regola di concorrenza:

- nessun edit parallelo sullo stesso file;
- ownership dichiarata prima di modificare;
- stop immediato se un file posseduto cambia durante il lavoro;
- `adapter.mjs`, `validate-changed-reports.mjs` e relativi test appartengono a un unico proprietario D3;
- `query.mjs` ha un proprietario separato soltanto se D3 non lo tocca;
- la prova CI finale segue l'integrazione D3/D7;
- la revisione E parte soltanto quando ogni esecutore ha rilasciato i file.

## 17. Registro avanzamento e arresti

### Registro iniziale

| Slot | Stato iniziale | Gate di ingresso | Gate di uscita |
|---|---|---|---|
| F0 — baseline | `PRONTO` | valori Git conformi, report invariati | baseline registrata in questo piano |
| A — decisione D1 | `ATTESA MATTEO` | scheda A/B/C/D disponibile | scelta esplicita |
| B — D3/D7 | `NON INIZIATO` | A chiusa | test Report/Verbale e query verdi |
| C — D1 CI | `NON INIZIATO` | B integrata | simulazione job MSS verde |
| D — docs/amendment | `NON INIZIATO` | A chiusa | D2/D4/D5/D6/D9 soddisfatti |
| E — revisione | `NON INIZIATO` | B+C+D rilasciate | nessuna riserva bloccante |
| F1 — pre-push | `NON INIZIATO` | E accettabile | checklist completa + sì Matteo |
| F2 — post-push | `NON INIZIATO` | push autorizzato | Actions MSS verde |
| G — eleggibilità | `NON INIZIATO` | F2 completo | decisioni separate di Matteo |
| H — backlog | `NON INIZIATO` | `SK-5` eleggibile/chiuso | ticket separati |

Nessuno slot futuro è marcato `COMPLETATO` in anticipo.

### Prompt figli da generare in chat successive

Non crearli in questa seduta:

- `Prompt-fase-b-fix-regex-query-23-08-26.md`;
- `Prompt-fase-c-ci-d1-23-08-26.md`;
- `Prompt-fase-d-docs-amendment-23-08-26.md`;
- `Prompt-fase-e-revisione-fix-23-08-26.md`.

### Criteri di arresto

Fermarsi e chiedere a Matteo se:

- branch, discendenza da `d1598b6`, base remota o worktree non corrispondono al mandato della fase;
- uno dei due report revisori cambia o viene posseduto da un altro agente;
- un file cambia durante l'ownership;
- l'opzione D1 non è stata scelta esplicitamente;
- il fix richiede di toccare i 17 path senza scelta B e mandato separato;
- la pulizia D5 raggiunge righe JSONL finalizzate;
- emerge la necessità di rewrite, split, rebase o squash di `d1598b6`;
- un esecutore propone di mascherare `validate:docs` o rendere non bloccante MSS;
- la simulazione locale non riproduce lo stesso job MSS pianificato;
- una riserva bloccante resta aperta al momento del push o della promozione.

### Fuori perimetro

- fix in questa seduta di pianificazione;
- correzione immediata dei 17 path;
- modifica di `PLAN_V0.md` o di qualunque owner di stato;
- modifica retroattiva di record final o capsule storiche;
- creazione dei prompt figli;
- branch o repository temporanei in questa seduta;
- commit, push o dichiarazioni `CHIUSO`;
- split/rebase/rewrite di `d1598b6`;
- `SK-7`, `WP-1`, `SEP-G5`, DB, Supabase, `src/**` e `docs/_lavoro/**`.

## 18. Handoff operativo finale

### Stato vero

- Branch `env/test`; HEAD `d1598b64a545fc988b3f4db3c8650858a3de493d`; `origin/env/test` `eee6cf7c10e4c8a58afdcc2af7e55b9e66c9c26a`; behind 0, ahead 1.
- Prima di questo piano il worktree conteneva soltanto i due report revisori non tracciati; entrambi sono stati preservati con hash invariati.
- `SK-6` è già `CHIUSO` per D16 e non si riapre.
- `SK-4`, Senior docs, `SK-11`, `SK-5` e integrazione non sono eleggibili ora.
- D1 è riprodotto: `validate:docs` exit 1 con baseline 17 e rende irraggiungibili i passi MSS nel job corrente.
- D5 è riprodotto: `git diff --check origin/env/test..HEAD` exit 2.

### Decisioni chiuse

- M1: mantenere `d1598b6`, nessun rewrite.
- M2: nessun push senza simulazione locale MSS verde; prova Actions reale dopo il push autorizzato.
- M3: nessun `CHIUSO` con riserve.
- D16: `SK-6` resta chiuso.
- D17: cambio famiglia raccomandato, non gate.
- D18: importare le regole, non duplicarle.

### Decisione ancora richiesta a Matteo

Scegliere l'opzione D1. La raccomandazione del piano è **A — job MSS separato e indipendente dal gate docs**.

### Autorità

Questo piano autorizza soltanto il coordinamento. Ogni fase richiede un prompt/mandato successivo; soltanto Matteo può autorizzare push e aggiornamenti `CHIUSO` nell'owner.

### Prossimo agente e unico gate

Il prossimo agente è il coordinatore Meta che registra la scelta D1 e prepara i prompt esecutori B/C. Il suo unico gate è ricevere da Matteo un sì esplicito all'opzione A, oppure una scelta esplicita fra B/C/D.

### Controllo finale del redattore

`git status --short` dopo la creazione del piano:

```text
?? "docs/Sessioni di lavoro/23-08-26/PLAN-POST-REVISIONE-RIMANENZE-23-08-26.md"
?? "docs/Sessioni di lavoro/23-08-26/Report-revisione-indipendente-sessione-mss-23-08-26.md"
?? "docs/Sessioni di lavoro/23-08-26/Report-senior-revisione-complessiva-23-08-26.md"
```

Confronto con la baseline: nessuna modifica tracked; i due report concorrenti sono ancora non tracciati e hanno gli stessi hash; l'unica aggiunta del redattore è questo piano. Controlli del solo piano: M1–M3 invariati, `Verbale-*` in D3 e non nel backlog, `validate` distinto da `test:mss`, prova CI finale dopo D3/D7, nessuna nuova dichiarazione `CHIUSO`, zero trailing whitespace.

### Checklist umana finale per Matteo

- [ ] Approva A oppure indica B, C o D.
- [ ] Dopo l'approvazione, autorizza la preparazione del prompt della Fase B/C.
- [ ] Non autorizzare ancora fix, commit o push.
- [ ] Non dichiarare ancora `SK-4`, Senior docs, `SK-11`, `SK-5` o integrazione `CHIUSO`.
- [ ] Non aprire ancora `SK-7`.
