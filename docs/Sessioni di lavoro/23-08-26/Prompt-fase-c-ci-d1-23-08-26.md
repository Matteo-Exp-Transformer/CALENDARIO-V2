# Prompt esecutore — Fase C: job MSS indipendente in CI — 23-08-26

Apri e segui integralmente `AGENTS.md`.

## Profilo e modalità

- **Profilo:** Esecuzione CI MetaSkillSystem con Testing Skill.
- **Modalità:** `deep`; puoi alzarla, mai abbassarla.
- **Tipo di seduta:** implementazione D1, simulazione locale del job MSS e raccolta prove pre-push.
- **Fase autorizzata:** soltanto Fase C del piano post-revisione.
- **Decisione di Matteo:** **D1-A approvata il 23-08-26** — creare un job MSS separato e indipendente dal gate documentale. Non riproporre B/C/D e non reinterpretare A.

## Condizione d'ingresso inderogabile

Questa fase parte soltanto dopo che la Fase B D3/D7 è stata integrata, testata e ha rilasciato `adapter.mjs`, `validate-changed-reports.mjs`, `query.mjs` e i relativi test.

Se l'helper usa ancora una seconda regex, non vede `Verbale-*`, query dice ancora “solo Report”, manca il report B o i test B non sono verdi, fermati: non implementare il workflow su una versione provvisoria dell'helper.

## Contesto da leggere, in ordine

1. `docs/Comunicazione-Skill/VOCABOLARIO.md` — intero.
2. `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md` — intero.
3. `docs/Testing-Skill/TESTING_SKILL.md` — intero.
4. `docs/Sessioni di lavoro/23-08-26/PLAN-POST-REVISIONE-RIMANENZE-23-08-26.md` — cappello, §§1–8, §10, §§12–18.
5. `docs/Sessioni di lavoro/23-08-26/Report-fase-b-fix-regex-query-23-08-26.md` — intero; deve esistere e risultare rilasciato.
6. I due report revisori del 23-08-26 — sezioni D1/D3, `SK-5`, matrice prove e handoff.
7. `.github/workflows/ci.yml`, `package.json`, `scripts/mss/validate-changed-reports.mjs` e import diretti necessari a capire i comandi.

Non caricare `docs/APP_CONTEXT_SKILL.md` intero, `src/**`, `docs/_lavoro/**`, skill UI/DB/Supabase o i file dei 17 path rotti.

## Decisioni e vincoli non riapribili

- **M1:** mantenere `d1598b6`; vietati split, rebase, squash correttivo e rewrite. Il fix D1 vive in un commit successivo futuro.
- **M2:** nessun push prima della simulazione locale equivalente verde e del sì esplicito di Matteo. Questa fase non pusha.
- **M3:** nessun `CHIUSO` con riserve. Questa fase non aggiorna stati.
- D1-A: job MSS indipendente; `validate:docs` resta visibile e hard-fail in un job distinto.
- D3/D7 devono essere già integrati: la prova CI usa l'helper definitivo.
- `SK-6` resta già `CHIUSO` per D16.
- `npm run validate` non include H-1 e non sostituisce `npm run test:mss`.
- Nessun `continue-on-error` sul gate docs o sui gate MSS.

## Fase 0 — fotografia e ownership

Prima di modificare:

```text
git branch --show-current
git rev-parse HEAD
git rev-parse origin/env/test
git merge-base --is-ancestor d1598b64a545fc988b3f4db3c8650858a3de493d HEAD
git rev-list --left-right --count origin/env/test...HEAD
git status --short
git diff --name-status d1598b64a545fc988b3f4db3c8650858a3de493d..HEAD
```

Condizioni attese:

- branch `env/test`;
- HEAD discende da `d1598b6` senza rewrite;
- Fase B presente e rilasciata;
- nessuna modifica tracked concorrente;
- i due report revisori, il piano e i prompt figli sono preservati;
- eventuale report B è presente nello stato dichiarato dal suo handoff.

Se la discendenza, la proprietà o lo stato B non coincidono, fermati prima di scrivere.

Dichiara ownership temporanea esclusiva di `.github/workflows/ci.yml`. Se cambia durante la seduta, stop immediato.

## Obiettivo D1-A

Rendere i controlli MSS realmente eseguibili in GitHub Actions anche quando `validate:docs` resta rosso sulla baseline dei 17 path, senza nascondere nessun debito e senza indebolire alcun gate.

## Implementazione richiesta

Modifica soltanto `.github/workflows/ci.yml`, salvo blocco tecnico dimostrato e nuova autorizzazione di Matteo.

Disegno atteso:

1. il job applicativo/documentale esistente conserva installazione, `validate:docs`, lint, typecheck e unit test;
2. un nuovo job MSS indipendente esegue il proprio checkout completo, setup Node e `npm ci`;
3. il job MSS esegue sempre, in passi distinti e hard-fail:
   - `npm run validate:mss:changed -- --base "$MSS_BASE_SHA" --head "$MSS_HEAD_SHA"`;
   - `npm run test:mss`;
   - `npm run test:mss:tools`;
4. base/head continuano a gestire correttamente push e pull request verso `main` ed `env/test`;
5. checkout conserva storia sufficiente (`fetch-depth: 0`) e head PR corretta;
6. nessun gate applicativo preesistente viene rimosso o trasformato in soft-fail;
7. `validate:docs` resta evidente nel job separato e continua a fallire finché i 17 path non saranno risolti da un mandato diverso.

Non correggere i 17 path e non introdurre `continue-on-error`.

## Simulazione locale equivalente obbligatoria

La CI remota non può provare un commit non pushato. Prima del primo push costruisci una simulazione locale documentata dello stesso job MSS in un repository temporaneo isolato.

Regole di sicurezza:

- crea la root temporanea in un path dedicato;
- risolvi e registra il path assoluto;
- verifica che sia dentro la root temporanea prevista prima di rimuoverla;
- non usare directory ampie, workspace root o variabili generiche come target distruttivo;
- rimuovi soltanto la root verificata e dimostra zero residui.

Usa base/head reali o commit temporanei derivati dalla stessa base per provare:

1. nuovo `Report-*` invalido → changed-reports rosso con path e codice MSS reale;
2. nuovo `Verbale-*` invalido → changed-reports rosso con path e codice MSS reale;
3. stato ripulito → changed-reports verde;
4. nessun report/verbale toccato → exit e messaggio espliciti;
5. sequenza completa del job MSS definitivo → changed-reports, H-1 e tools tutti raggiunti e verdi;
6. `validate:docs` misurato separatamente → baseline 17 ancora visibile, non mascherata.

La prova deve mostrare che entrambi i job vengono valutati indipendentemente: il rosso docs non impedisce l'esecuzione del job MSS.

## Prove obbligatorie

Registra comando, exit code e riga probante:

- parsing/sintassi YAML con strumento già disponibile nel repository;
- verifica statica dei trigger `push` e `pull_request` su `main` ed `env/test`;
- verifica di `fetch-depth: 0` e ref head PR;
- simulazione `Report-*` rosso→verde;
- simulazione `Verbale-*` rosso→verde;
- caso vuoto;
- job MSS locale completo verde;
- `npm run test:mss` → 42 fixture + 32 gruppi o conteggio superiore reale;
- `npm run test:mss:tools` → almeno 9/9;
- `npm run lint` → exit 0, zero warning;
- `npm run validate` → exit 0, dichiarando che non sostituisce H-1;
- `npm run validate:docs` → misurato contro baseline 17;
- `git diff --check` sul solo diff C;
- validazione MSS del report C;
- zero temp/capsule invalide residue;
- `git status --short` finale confrontato con Fase 0.

Non serve e non è autorizzato eseguire GitHub Actions remota in questa fase: la prova reale avverrà soltanto dopo un futuro push esplicitamente autorizzato da Matteo.

## Divieti

- Non modificare helper, adapter, query o test B: se hanno un difetto, torna a B e fermati.
- Non modificare `package.json` salvo nuova autorizzazione dopo blocco dimostrato.
- Non correggere i 17 path.
- Non modificare viste, report storici, capsule finali, amendment o `PLAN_V0.md`.
- Non toccare `src/**`, DB, Supabase o `docs/_lavoro/**`.
- Non aprire backlog R1, `SK-7`, `WP-1` o `SEP-G5`.
- Non creare branch remoto, non committare, non pushare e non dichiarare pacchetti `CHIUSO`.
- Non proporre split/rebase/rewrite di `d1598b6`.

## Output autorizzato della futura seduta

- modifica D1-A a `.github/workflows/ci.yml`;
- artefatti temporanei di prova soltanto nel repository isolato e poi rimossi;
- un solo report con capsula viva e handoff finale:
  `docs/Sessioni di lavoro/23-08-26/Report-fase-c-ci-d1-23-08-26.md`.

Il report deve includere:

- workflow prima/dopo in termini di job e raggiungibilità;
- comandi, exit code, path e codici MSS reali;
- baseline 17 mantenuta visibile;
- cleanup della root temporanea;
- conferma che nessuna CI remota è stata ancora osservata;
- prossimo gate unico: revisione integrata, poi autorizzazione esplicita di Matteo al push.

## Criteri di accettazione e arresto

La Fase C è rilasciabile soltanto se:

- il job MSS è indipendente da `validate:docs`;
- i tre gate MSS sono distinti, raggiungibili e hard-fail;
- il debito docs resta visibile e hard-fail nel proprio job;
- Report e Verbale rosso→verde sono provati con l'helper finale B;
- il job MSS completo è verde nella simulazione locale;
- i gate applicativi preesistenti sono preservati;
- non restano temp, capsule invalide o modifiche fuori perimetro;
- nessun commit, push o `CHIUSO` è stato eseguito.

Se la simulazione non equivale al job pianificato o una prova resta rossa, non autorizzare il push: consegna il blocco a Matteo.
