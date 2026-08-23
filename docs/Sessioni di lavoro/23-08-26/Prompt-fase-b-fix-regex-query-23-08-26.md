# Prompt esecutore — Fase B: convergenza regex e query MSS — 23-08-26

Apri e segui integralmente `AGENTS.md`.

## Profilo e modalità

- **Profilo:** Esecuzione MetaSkillSystem con Testing Skill.
- **Modalità:** `deep`; puoi alzarla, mai abbassarla.
- **Tipo di seduta:** implementazione tecnica D3 + D7 con prove automatiche.
- **Fase autorizzata:** soltanto Fase B del piano post-revisione.
- **Decisione già presa da Matteo:** il 23-08-26 Matteo ha approvato D1-A, cioè un job MSS separato e indipendente dal gate documentale. Non riaprire la scelta.

## Contesto da leggere, in ordine

1. `docs/Comunicazione-Skill/VOCABOLARIO.md` — intero.
2. `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md` — intero.
3. `docs/Testing-Skill/TESTING_SKILL.md` — intero.
4. `docs/Sessioni di lavoro/23-08-26/PLAN-POST-REVISIONE-RIMANENZE-23-08-26.md` — cappello, §§1–10, §§13–18.
5. `docs/Sessioni di lavoro/23-08-26/Report-senior-revisione-complessiva-23-08-26.md` — §§5, 8–13.
6. `docs/Sessioni di lavoro/23-08-26/Report-revisione-indipendente-sessione-mss-23-08-26.md` — §§3–7 e §10-bis.
7. File tecnici posseduti elencati sotto e i test esistenti più vicini.

Non caricare `docs/APP_CONTEXT_SKILL.md` intero, `src/**`, `docs/_lavoro/**`, skill UI/DB/Supabase o documentazione dei 17 path rotti.

## Decisioni e vincoli non riapribili

- **M1:** mantenere il commit unico `d1598b6`; vietati split, rebase, squash correttivo e rewrite. Ogni fix vive in un commit successivo.
- **M2:** nessun push prima della simulazione locale MSS verde e del sì esplicito di Matteo; questa fase non pusha.
- **M3:** nessun perimetro può diventare `CHIUSO` con riserve; questa fase non aggiorna stati.
- `SK-6` resta già `CHIUSO` per D16 e non va riaperto.
- D17: cambio famiglia del revisore raccomandato, non gate.
- D18: una regola esistente si importa; non si duplica.
- Il buco `Verbale-*` è D3 bloccante per `SK-5`, non backlog R1.
- `npm run validate` non sostituisce `npm run test:mss`.

## Fase 0 — fotografia e collisioni

Prima di modificare qualsiasi file, registra:

```text
git branch --show-current
git rev-parse HEAD
git rev-parse origin/env/test
git rev-list --left-right --count origin/env/test...HEAD
git status --short
git diff --name-status origin/env/test..HEAD
```

Baseline attesa se nessun altro esecutore è intervenuto:

```text
branch                  env/test
HEAD                    d1598b64a545fc988b3f4db3c8650858a3de493d
origin/env/test         eee6cf7c10e4c8a58afdcc2af7e55b9e66c9c26a
divergenza              behind 0 · ahead 1
tracked nel worktree    nessuna modifica
```

Sono attesi come non tracciati i due report revisori, il piano post-revisione e i prompt figli già preparati. Preservali. Se branch, discendenza da `d1598b6`, proprietà dei file o modifiche tracked non coincidono, fermati e segnala il conflitto a Matteo.

Fotografa SHA-256 dei due report revisori prima e dopo la seduta. Se cambiano durante il lavoro, fermati su quei file e registra la collisione.

## Obiettivo

Chiudere tecnicamente D3 e D7 prima della modifica CI:

1. eliminare la deriva tra la policy canonica dei report MSS e il filtro changed-reports;
2. applicare un solo comportamento a `Report-*` e `Verbale-*`, incluse le sottocartelle;
3. rendere il testo utente di `mss:query` coerente con il perimetro reale;
4. aggiungere test automatici che rendano rosso ogni ritorno alla seconda regex o al testo “solo Report”.

## Ownership temporanea esclusiva

Dichiara ownership prima del primo edit e rilasciala soltanto dopo i test finali:

- `scripts/mss/adapter.mjs`;
- `scripts/mss/validate-changed-reports.mjs`;
- `scripts/mss/query.mjs`;
- test MSS/tools strettamente necessari, preferendo il file esistente più vicino;
- `package.json` soltanto se un comando dedicato è indispensabile e motivato.

Usa un solo proprietario per adapter, helper, query e test: minimizza collisioni e retest. Se uno di questi file cambia dopo la fotografia o risulta posseduto da un altro agente, stop immediato.

## Implementazione richiesta

### D3 — policy unica

- Mantieni `scripts/mss/adapter.mjs::REPORT_PATH_RE` come fonte canonica.
- Fai importare all'helper CI la policy canonica; non lasciare una seconda `REPORT_PATH_RE` equivalente.
- Conserva la selezione Git dei soli file aggiunti/modificati (`--diff-filter=AM`) e la gestione sicura base/head già presente.
- Il filtro deve riconoscere sia `Report-*.md` sia `Verbale-*.md` sotto `docs/Sessioni di lavoro/**`, comprese le sottocartelle.
- Un file non pertinente deve restare escluso.
- Aggiorna i messaggi dell'helper: non devono dichiarare “nessun Report” quando il perimetro comprende anche `Verbale-*`.
- Non duplicare nel test una terza regex che possa divergere: prova il comportamento osservabile.

### D7 — testo query

Correggi ogni output di `scripts/mss/query.mjs` che dice o implica “solo `Report-*.md`” mentre il filtro canonico legge anche `Verbale-*`. Copri almeno i messaggi oggi presenti intorno alle vecchie righe 320, 1010 e 1034, senza affidarti ai numeri di riga come owner stabile.

Il testo deve dichiarare con precisione:

- albero HEAD + working tree;
- `Report-*.md` e `Verbale-*.md` sotto `docs/Sessioni di lavoro/`;
- limiti reali del lettore, senza ampliare il perimetro oltre la regex canonica.

### Test automatici minimi

Aggiungi o estendi test esistenti per provare:

1. `Report-*` valido in sottocartella → selezionato e validato;
2. `Report-*` invalido → exit non zero con path e codice MSS;
3. `Verbale-*` valido in sottocartella → selezionato e validato;
4. `Verbale-*` invalido → exit non zero con path e codice MSS;
5. nessun report/verbale toccato → exit 0 e messaggio esplicito coerente;
6. file non pertinente → ignorato;
7. output query → cita entrambe le famiglie e non torna a “solo Report”.

I test devono essere offline, deterministici, senza DB/rete/TTY/ora reale e con cleanup sicuro.

## Divieti

- Non modificare `.github/workflows/ci.yml`: appartiene alla Fase C.
- Non correggere i 17 path documentali.
- Non modificare indice, roadmap, handoff Senior, report storici, capsule finali o amendment: appartengono alla Fase D.
- Non modificare `PLAN_V0.md` o stati owner.
- Non aprire backlog R1, `SK-7`, `WP-1` o `SEP-G5`.
- Non toccare `src/**`, DB, Supabase o `docs/_lavoro/**`.
- Non creare branch, non committare, non pushare e non dichiarare pacchetti `CHIUSO`.
- Non creare repository temporanei fuori dalle sole prove necessarie; prima di rimuoverli verifica il path assoluto e la radice prevista.

## Prove obbligatorie

Registra comando, exit code e riga probante:

```text
node --check <ogni .mjs modificato>
npm run lint
npm run test:mss
npm run test:mss:tools
npm run validate
```

In aggiunta:

- prova automatica `Report-*` rosso→verde;
- prova automatica `Verbale-*` rosso→verde;
- prova del caso vuoto;
- ricerca finale che dimostri una sola definizione di `REPORT_PATH_RE` sotto `scripts/mss/`;
- prova automatica del testo query;
- `git diff --check` sul solo diff della Fase B;
- validazione MSS dell'eventuale report finale;
- zero directory temporanee e capsule invalide residue;
- `git status --short` finale confrontato con la baseline.

Il verde di `npm run validate` non vale come prova H-1: esegui e registra separatamente `npm run test:mss` con 42 fixture + 32 gruppi, o il conteggio superiore reale.

## Output autorizzato della futura seduta

- fix D3/D7 nei file posseduti;
- test automatici strettamente necessari;
- un solo report di esecuzione con capsula viva e handoff finale:
  `docs/Sessioni di lavoro/23-08-26/Report-fase-b-fix-regex-query-23-08-26.md`.

Il report deve separare fatti, prove, limiti e file rilasciati. Non deve aggiornare owner né dichiarare `CHIUSO`.

## Criteri di accettazione e arresto

La Fase B è rilasciabile soltanto se:

- esiste una sola policy canonica importata;
- Report e Verbale sono coperti automaticamente in sottocartella;
- l'helper rosso/verde e il caso vuoto sono provati;
- query dichiara il filtro reale e un test impedisce la regressione;
- H-1 e tools restano verdi;
- nessun file della Fase C/D è stato toccato;
- nessuna mutazione concorrente o temporanea è rimasta.

Se uno dei criteri fallisce, non aggirarlo e non avviare la Fase C. Consegna il blocco a Matteo senza commit o push.
