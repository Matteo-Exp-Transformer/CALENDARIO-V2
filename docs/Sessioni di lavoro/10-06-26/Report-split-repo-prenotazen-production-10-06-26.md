# Report — Split repo PrenotaZen + go-live production (10-06-26)

## 1. Cappello

- **Cosa è cambiato:** il progetto è ora **3 repo separate** e **PrenotaZen è online in production** su Vercel. Prima era una repo unica pubblica (con dentro docs/skill/agenti).
- **Le 3 repo:** **PrenotaZen** (pubblica, solo codice app + README utente, deploy Vercel) · **CALENDARIO-V2** (privata, dev: codice + docs + skill) · **TestingAgentHarness** (privata, harness eval modelli locali).
- **Cosa resta:** `agenti-locali/` ancora sul disco dev (gitignored, innocua — da cancellare a piacere); backup mirror in `c:/tmp/CalendarBackup-v2-backup.git` (cancellabile); token GitHub vecchi revocati da Matteo; service-role PROD/TEST ruotate da Matteo.
- **Serve una tua azione:** no, tutto allineato e online. Per le prossime release: lavori su `env/test` → merge `main` → `npm run release:prenotazen`.

---

## 2. Cosa è stato fatto

1. **Controverifica del piano (sub-agent imparziale) PRIMA di toccare** — ha inchiodato 2 rischi critici che il piano sottovalutava (vedi §6).
2. **Reso privato il remote CALENDARIO-V2** (era pubblico con 373 docs interne online).
3. **Fase 1 — pulizia repo dev:** `.gitignore` (ignora `agenti-locali/`, `.vercel/`, `.cursor/plans/`, `docs/_lavoro/`; `docs/` non più ignorato perché la repo è privata); `agenti-locali/**` nelle exclude di eslint+vitest; rimosse le regole transitorie `git add -f` da 3 skill + nota stale README reset DB.
4. **Fase 2 — TestingAgentHarness:** export di `agenti-locali/` (escluso `conductor-main/` Python e gli artefatti eval JSON rigenerabili), `.gitignore` + README di wiring (richiede checkout sibling), push.
5. **Fase 3 — PrenotaZen:** albero pulito via **`git archive`** (solo file tracciati → niente segreti); rimossi docs/.cursor/.claude/AGENTS.md + README tecnici; README riscritto per il ristoratore; env redatti (project-id → placeholder); husky trimmato; `.gitignore` pubblico. `npm run validate` verde (480 test). Push.
6. **Fix build Vercel:** la regola `.gitignore` `/*.html` escludeva anche `index.html` (entry Vite) → build falliva con «Could not resolve entry module». Rimossa la regola + tracciato `index.html`. Build testata in locale, poi push → production online.
7. **Script di release `sync-to-prenotazen.mjs`** (`npm run release:prenotazen`): esporta `main` via git archive, pulisce l'albero pubblico, rimuove l'interno, **riapplica gli override pubblici** da `scripts/prenotazen-overrides/` (README/env/husky/gitignore) e patcha `package.json` name. Non committa/pusha (controllo umano). Testato 4× guardando il diff reale.
8. **Merge `env/test → main`** (15 commit) + allineamento: `main` ed `env/test` ora sullo **stesso commit** (`3bf09d9`); PrenotaZen pushata; tutto in pari local↔remote.
9. **PLAYBOOK** (`EVOLUZIONE_SKILLS.md` Log idee) aggiornato con la lezione split-repo; **memory** `project_repo_split_3repos` creata.

---

## 3. File toccati e perché

| File / area | Perché |
|------|--------|
| `.gitignore` (dev) | docs/ tracciabile (repo privata); ignora agenti-locali, .vercel, .cursor/plans, docs/_lavoro |
| `.eslintrc.cjs`, `vitest.config.ts` | exclude `agenti-locali/**` |
| `docs/APP_CONTEXT_SKILL.md`, `PREPARA_PROMPT_SKILL.md`, `Comunicazione-Skill/CHIUSURA_SESSIONE.md` | rimosse regole transitorie `git add -f` (ora commit normale) |
| `supabase/scripts/README_RESET_TEST_DATABASE.md` | nota stale «docs/ in gitignore» corretta |
| `scripts/sync-to-prenotazen.mjs` + `scripts/prenotazen-overrides/` | meccanica di release verso la pubblica (NON va in pubblico) |
| `package.json` | script `release:prenotazen` |
| `docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md` | Log idee: lezione split-repo (git archive + override) |
| `docs/Sessioni di lavoro/...` (25 file) | tracciati report pregressi resi visibili dallo split |

**Repo esterne create:** PrenotaZen (pubblica), TestingAgentHarness (privata).

**Storage / DB:** nessuna modifica DB. Solo infrastruttura repo + deploy.

---

## 4. Test eseguiti e risultato

| Comando / verifica | Esito |
|---------|--------|
| `npm run lint` (dev, post Fase 1) | **Verde** |
| `npm run test` (dev) | **Verde** — 480/480 |
| `npm run validate` (albero pulito PrenotaZen) | **Verde** — lint+typecheck+480 test |
| `npm run validate` (main post-merge) | **Verde** — 480/480 |
| `npm run build` (PrenotaZen, locale) | **Verde** — bundle + PWA generati |
| Build Vercel (production) | **Verde** — app online dopo fix index.html |
| Script release: guardrail (non-su-main / tree-sporco) | **Bloccano** correttamente (exit 1) |
| Script release: run reale + diff su PrenotaZen | **Pulito** (solo diff legittimo config) |
| Allineamento finale (`git rev-parse` tutti i branch/remote) | **Allineati** main=env/test=3bf09d9 |

---

## 5. Stato finale repo

| Repo / Branch | Commit | Stato |
|---|---|---|
| CALENDARIO-V2 `main` | `3bf09d9` | allineato local↔remote |
| CALENDARIO-V2 `env/test` | `3bf09d9` | stesso commit di main (punto 0) |
| PrenotaZen `main` | `ef44ae1` | allineato + production online |
| TestingAgentHarness `main` | (push iniziale) | privata |

---

## 6. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) «sei agente senior. @split_repo_prenotazen… analizza questo plan e dopo che sei sicuro che il plan sia solido e controverificato (lancia sub agent): dimmi cosa DEVO fare io manualmente e cosa fai tu tra mcp e terminale. assicuriamoci di pubblicare una repo perfetta e pronta per production. (app al momento funziona bene. devo ancora fare merge su main…questo branch è quello piu avanti)». (2) «ho creato nuova repo PrenotaZen… e nuova repo TestingAgentHarness… ho anche le nuove service role key sia di test che prod (dove le metto?)… Se è tutto ok procediamo». (3) «1. vai col push 2. committa e partiamo con repo dev pulita 3. token git cancellati. fai merge con main, e ho collegato vercel». (4) «rimossa service role da vercel. ora production funziona! siamo online! domanda come dovrebbe diventare ora il mio workflow?… posso mantenere mio workflow attuale da ide e terminale». (5) [risposte AskUserQuestion: repo dev privata; ruoto i segreti io; build da env/test così com'è; PrenotaZen creo io; script sync da main; togli i README tecnici] (6) «testa la build di prenotazen… al momento a me fallisce la build [Could not resolve entry module index.html]». (7) «allinea anche main. facciamo questo come punto 0 tutto allineato». (8) «si aggiorna anche quello [playbook]. poi fai report finale. includi un tuo report di lavoro svolto nella cartella di sessione di oggi».

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Ri-verificato dal vivo: `git rev-parse` di main/env/test/origin → tutti `3bf09d9` (dev) e `ef44ae1` (PrenotaZen); `git status` working tree **vuoto** (pulito). Lo script `sync-to-prenotazen.mjs` testato 4× con diff reale su PrenotaZen (l'ultimo: solo `vitest.config.ts`, poi pushato). 480 test confermati da 3 run separate (dev, PrenotaZen pulita, main post-merge). `git ls-files` su PrenotaZen confermava `index.html` mancante prima del fix, presente dopo. Scansione segreti staged su PrenotaZen: zero JWT/sb_secret/ghp (solo hash integrity nel lockfile). `_skill-system-v0/` verificato non toccato.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica e hai verificato che siano aggiornati?
✅ R3: Le 3 skill con la regola `git add -f` aggiornate **insieme** al cambio gitignore (non lasciate stale). `scripts/prenotazen-overrides/` allineata 1:1 alle trasformazioni pubbliche reali (copiata da PrenotaZen, fonte di verità). PLAYBOOK + memory `project_repo_split_3repos` + MEMORY.md index aggiornati coerenti. README di wiring in TestingAgentHarness coerente con la dipendenza sibling. Nessun test app toccato (zero modifiche al codice di prodotto — solo config exclude).

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?
✅ R4: Non cancellato `agenti-locali/` dal disco dev (lasciata di proposito finché Matteo conferma TestingAgentHarness; è gitignored, innocua). Non cancellato il backup mirror in `c:/tmp/`. Non aggiunto `LICENSE` a PrenotaZen (Matteo: «possiamo metterla dopo»). Non propagato nulla a `_skill-system-v0/` (consapevole: lavoro specifico di progetto, niente astrazione generica). Non eseguito QA browser manuale della production (Matteo ha confermato «production funziona» dal suo lato). `target="_blank"`/chunk-size warning lasciati (preesistenti, fuori scope).

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti?
✅ R5: Attrito: il piano `.plan.md` partiva da assunzioni non verificate sullo stato reale (gitignore docs/ «da sistemare» quando i file erano già pubblici; «git add .» che avrebbe leakato segreti) — l'ho scoperto solo lanciando la controverifica + ispezione dal vivo. Miglioria: per task infrastrutturali/repo, una checklist «verifica-stato-reale-prima» nello skill (visibilità remote? file già tracciati? segreti nei gitignored? branch divergenti?) eviterebbe di fidarsi del piano scritto a freddo. La controverifica con sub-agent imparziale ha pagato moltissimo qui.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto giusto: CLAUDE.md (file critici, ambienti DB, due client Supabase) + memory sullo stato repo sono bastati; non ho dovuto caricare skill d'area (task infrastrutturale, non su una pagina). Hook: il `fine-sessione-senior` è stato **utile** — mi ha fatto fermare e verificare dal vivo l'allineamento e ricordare il PLAYBOOK (che avrei consegnato non scritto). Il pre-commit cold-check ha agito correttamente (1 blocco + rilancio). Nessun rumore: per una sessione infrastrutturale con go-live, i nudge di verifica sono proporzionati al rischio.
