# Prompt revisore — Fase E: revisione integrata dei fix MSS — 23-08-26

Profilo: Verifica
Modalità: deep — puoi solo alzarla, mai abbassarla
Skill da leggere: `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md`; `docs/Testing-Skill/TESTING_SKILL.md`; semantica append-only di `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md`
Non caricare: `docs/APP_CONTEXT_SKILL.md` intero; `src/**`; `docs/_lavoro/**`; skill UI, DB o Supabase
Output attesi: un solo report `docs/Sessioni di lavoro/23-08-26/Report-fase-e-revisione-fix-23-08-26.md` con verdetti separati, prove, capsula e handoff; nessun fix. Niente output in più senza chiedere Sì/No prima

Apri e segui integralmente `AGENTS.md`.

## 1. Ruolo

Agisci come revisore integrato accurato e dedicato delle Fasi B, C e D. Non sei un esecutore e non devi correggere ciò che trovi.

All'inizio dichiara provider, modello, runtime e famiglia effettiva. Una famiglia diversa dagli esecutori OpenAI è raccomandata per aumentare l'indipendenza, ma D17 la mantiene avviso e non gate. In ogni caso non usare `independently_verified` per cortesia: motiva la classificazione reale per ciascun perimetro.

La revisione deve consentire a Matteo di decidere in sicurezza se passare al gate pre-push. Non autorizza push, commit, aggiornamenti owner o dichiarazioni `CHIUSO`.

## 2. Condizione d'ingresso

La Fase E parte soltanto se:

- report B e C esistono;
- report D esiste e dichiara file rilasciati;
- nessun esecutore possiede ancora file B/C/D;
- i due report revisori originari sono preservati;
- il worktree contiene soltanto modifiche attribuibili alla catena post-revisione.

Se D manca, un file è ancora posseduto o compare una collisione, fermati prima delle prove mutanti.

## 3. Decisioni non riapribili

- **M1:** `d1598b6` resta intatto; nessuno split, rebase, squash correttivo o rewrite.
- **M2:** nessun push prima della simulazione locale verde, di questa revisione senza riserve bloccanti e del sì esplicito di Matteo; dopo il push servirà GitHub Actions reale.
- **M3:** nessun `CHIUSO` con riserve.
- **D1-A:** job MSS separato, scelta approvata e implementata; valutarne l'esito, non riaprire le alternative.
- **D16:** `SK-6` resta già `CHIUSO`, salvo regressione reale dimostrata.
- **D17:** cambio famiglia raccomandato, non gate.
- **D18:** regole importate, non duplicate.
- Il buco `Verbale-*` appartiene a D3 e deve essere verificato in CI, non spostato nel backlog R1.
- `npm run validate` non sostituisce `npm run test:mss`.

## 4. Contesto obbligatorio, in ordine

1. `docs/Comunicazione-Skill/VOCABOLARIO.md` — intero.
2. `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md` — intero.
3. `docs/Testing-Skill/TESTING_SKILL.md` — intero.
4. `docs/Sessioni di lavoro/23-08-26/PLAN-POST-REVISIONE-RIMANENZE-23-08-26.md` — intero.
5. `docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md` — introduzione append-only e §6 amendment.
6. `docs/MetaSkillSystem/PLAN_V0.md` — §4-bis, §15 e §16.
7. I due report revisori originari del 23-08-26 — integralmente.
8. Report B, C e D — integralmente.
9. Tutti i file modificati dalle Fasi B/C/D — interi prima di valutarli.
10. Le tre viste aggiornate e i due report rettificati — integralmente.

Non fidarti dei riepiloghi: confronta claim, diff e output reali.

## 5. Fase 0 — fotografia, attribuzione e integrità

Esegui e registra:

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
git diff --check origin/env/test
```

Ricostruisci una matrice file → fase → autore → stato ownership. Baseline tecnica B/C nota:

- `.github/workflows/ci.yml` → C;
- `scripts/mss/validate-changed-reports.mjs` → B;
- `scripts/mss/query.mjs` → B;
- `docs/MetaSkillSystem/tests/tools/run.mjs` → B.

I file documentali D devono risultare nel report D. Qualunque altro path è una possibile collisione da spiegare prima di proseguire.

Fotografa gli hash di:

- due report revisori originari;
- report B/C/D;
- quattro file tecnici B/C;
- tutte le righe JSONL preesistenti nei due report rettificati.

Le righe final storiche devono risultare byte-identiche a `HEAD`; soltanto nuovi amendment in coda sono ammessi.

## 6. Matrice D1–D9 e T1 da chiudere con prova

Per ogni ID emetti `ACCETTATO`, `CORREGGERE` o `NON VERIFICABILE`, con prova, effetto e criterio residuo.

| ID | Controllo obbligatorio |
|---|---|
| D1 | job MSS realmente indipendente e raggiungibile; tre passi hard-fail; docs visibile e non mascherato |
| D2 | `d1598b6` mantenuto; fotografia storica distinta dal candidato corrente |
| D3 | una sola policy canonica; helper CI copre Report e Verbale in sottocartella con test |
| D4 | indice, roadmap e handoff coerenti con owner oppure marcati snapshot |
| D5 | candidato reale whitespace pulito; claim storico rettificato append-only; range/base espliciti |
| D6 | claim Unicode corretto tramite amendment valido, senza riscrittura final |
| D7 | query dichiara Report + Verbale e test impedisce regressione |
| D8 | provenienza Cursor non verificabile trattata come nota epistemica, non blocker artificiale |
| D9 | due report revisori, piano, prompt, report B/C/D/E e viste presenti nell'inventario futuro commit |
| T1 | `validate`, H-1, tools e CI mantenuti distinti nelle prove e nei claim |

Il backlog R1 resta separato e non riapre Wave 1. `SK-7` resta `NON INIZIATO` e non va aperto.

## 7. Revisione tecnica B — D3 e D7

Verifica direttamente:

- una sola definizione `REPORT_PATH_RE` sotto `scripts/mss/`;
- helper e query importano la costante canonica;
- changed-reports conserva `--diff-filter=AM`, gestione base/head e delega con capsula obbligatoria;
- messaggi helper coerenti su entrambe le famiglie;
- i tre output query dichiarano HEAD + working tree, Report + Verbale e limiti reali;
- i sette test aggiunti sono distinti, offline, deterministici e puliscono in sicurezza;
- nessuna terza regex equivalente è nascosta nei test.

Ripeti in isolamento almeno:

1. Report invalido rosso con path/codice → corretto verde;
2. Verbale invalido rosso con path/codice → corretto verde;
3. caso vuoto verde con messaggio corretto;
4. file non pertinente ignorato;
5. testo query: entrambe le famiglie presenti e vecchia formula solo-Report assente.

## 8. Revisione tecnica C — D1-A

Verifica il workflow letto integralmente:

- trigger push/PR su `main` ed `env/test`;
- checkout completi e ref head PR corretta;
- job `ci` e `mss` senza dipendenze reciproche;
- `validate:docs` resta hard-fail nel job applicativo/documentale;
- job MSS ha setup autonomo ed esegue changed-reports, H-1 e tools in passi distinti;
- nessun `continue-on-error` o soft-fail;
- lint, typecheck e unit test preesistenti preservati.

### Simulazione integrata indipendente

In un repository temporaneo isolato crea un candidato che rappresenti esattamente il worktree finale B+C+D, inclusi i file nuovi destinati al futuro commit. Non mutare il workspace principale.

Prima della rimozione verifica il path assoluto e la parent prevista. Prova:

1. Report invalido → job changed-reports rosso con path e codice MSS;
2. Verbale invalido → rosso con path e codice MSS;
3. stato ripulito → verde;
4. nessun Report/Verbale toccato → comportamento esplicito;
5. sequenza completa job MSS → tutti e tre i passi raggiunti e verdi;
6. docs separato → rosso visibile senza impedire MSS;
7. stato temp pulito e root rimossa.

La simulazione deve essere tua, non una copia verbale del report C.

## 9. Revisione documentale D

Verifica:

- le tre viste puntano all'owner e non possiedono stato concorrente;
- B/C sono descritti come `self_report` in attesa di questa revisione, non come chiusi;
- `d1598b6` è mantenuto e distinto dalle modifiche correnti;
- 17 workspace / 26 checkout pulito è visibile e non trasformato in falso verde;
- nessun record final è stato modificato, riordinato o cancellato;
- gli amendment D5/D6 hanno target, field path, previous value/hash, motivo, autore, data ed evidenze reali;
- la catena amendment si applica senza conflitti irrisolti;
- il path Unicode è provato direttamente;
- la pulizia whitespace non ha cambiato semantica o righe JSONL finali;
- l'inventario D9 contiene tutti gli output reali e nessun file immaginario.

Se un amendment corregge un campo che non conteneva il claim falso, classificalo `CORREGGERE`: non accettare rettifiche decorative.

## 10. Gate completi obbligatori

Registra comando, exit code, conteggio e riga probante:

```text
node --check <ogni .mjs modificato da B>
npm run lint
npm run test:mss
npm run test:mss:tools
npm run validate
npm run validate:docs
npm run mss:query -- --verifica
```

Attese minime, da rimisurare:

- H-1: 42 fixture + 32 gruppi, exit 0;
- tools: 16/16 o conteggio superiore spiegato, exit 0;
- lint: exit 0, zero warning lint;
- validate: exit 0, ma non vale come H-1;
- docs workspace: debito visibile, baseline nota 17;
- checkout pulito: verificare il conteggio reale, con 26 come evidenza C da confermare o contraddire;
- query: amendment applicati, zero catene irrisolte oppure conflitto bloccante esplicito.

Inoltre:

- parsing YAML con strumento già disponibile;
- ricerca automatica di definizioni/import regex;
- validate:mss con `--require-capsule` su ogni report standard/deep nuovo o modificato;
- `git diff --check origin/env/test` sul candidato tracked → exit 0;
- controllo `--no-index --check` di ogni nuovo file non tracciato;
- nel clone isolato, `git diff --check origin/env/test..<candidate>` → exit 0 sul candidato completo;
- zero directory temporanee e capsule invalide residue;
- `git status --short` finale identico alla fotografia salvo il solo report E autorizzato.

## 11. Verdetti separati

Assegna uno dei verdetti `ACCETTA`, `ACCETTA CON RISERVE`, `CORREGGERE`, `NON VERIFICABILE` a:

- `SK-4`;
- Senior docs;
- `SK-11`;
- `SK-5`;
- integrazione complessiva.

Per ciascuno indica:

- criteri D accettati o ancora aperti;
- prova autonoma;
- riserve bloccanti e backlog non bloccante;
- eleggibilità al gate pre-push.

Non dichiarare `CHIUSO`. M3 richiede zero riserve per la futura promozione, ma la decisione resta di Matteo.

## 12. Criterio per autorizzare il passo successivo

Il verdetto integrato è idoneo al gate pre-push soltanto se tutte le condizioni sono vere:

- D1–D7 e D9 accettati; D8 resta solo nota epistemica;
- Report e Verbale rosso→verde riprodotti;
- job MSS completo verde e indipendente dal rosso docs;
- nessuna regola duplicata;
- record final storici immutati e amendment validi;
- candidate diff-check exit 0 sul range reale;
- tutte le suite verdi con H-1 separato da validate;
- zero collisioni/temp;
- nessuna riserva bloccante nei cinque verdetti.

Se anche una sola condizione fallisce, il prossimo passo è un prompt fix mirato, non commit o push.

## 13. Divieti

- Non correggere codice, workflow, test, viste, report o amendment.
- Non aggiornare `PLAN_V0.md` o altri owner.
- Non fare staging nel workspace principale, commit, push o run GitHub Actions remota.
- Non modificare record final o report degli esecutori.
- Non correggere/allowlistare i 17/26 path.
- Non aprire backlog R1, `SK-7`, `WP-1`, `SEP-G5`, DB, Supabase, `src/**` o `docs/_lavoro/**`.
- Non dichiarare pacchetti `CHIUSO`.
- Non creare output oltre al report E senza chiedere Sì/No a Matteo.

## 14. Report E e handoff

Il report deve contenere:

1. identità e provenienza del revisore;
2. baseline Git e attribuzione completa;
3. matrice D1–D9 + T1;
4. revisione tecnica B;
5. revisione CI C;
6. revisione documentale D e append-only;
7. prove rosso→verde autonome;
8. matrice comandi con exit/conteggi;
9. verdetti separati;
10. blocker, backlog e aspetti non verificabili;
11. cleanup e stato finale;
12. capsula viva valida;
13. handoff operativo finale.

Handoff finale: stato vero, decisioni non riapribili, autorità, eleggibilità pre-push, unico prossimo gate e ciò che Matteo non deve ancora fare.

Chiusura verso Matteo, in parole semplici: indica se può passare al gate pre-push oppure se serve un fix; ricorda che GitHub Actions reale può essere provata soltanto dopo un futuro push esplicitamente autorizzato.
