# J1 — Fatti oggettivi: git, migrazioni, release, test

> **Ondata:** J1 · **Data:** 06-08-26 · **Regime:** scavo · **Peso fonti:** **2** (oggettiva — §1 piano)
> **Perimetro:** `git log --all` (tutti i branch), `supabase/migrations/` (72 file), tag/release
> (repo CB-v2 + PrenotaZen locale), esiti test **dichiarati** nei report (nessun test rieseguito).
> **Regola dura del prompt:** l’autore del commit è quasi sempre Matteo anche quando il codice l’ha
> scritto un agente. Un commit **non** è prova di skill di codice. È prova di **data, sequenza, esito**.
> Eccezione oggettiva: **25 commit** firmati da Cristiano Tulli (console, 22–23 giugno).

---

## Sezione 1 — Decisioni

Decisioni qui = scelte di processo/rilascio **ancorate a un artefatto verificabile** (script, branch,
migrazione applicata, commit di release). Non sono skill di codice.

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| J1-D01 | 27-04-26 | PROCESSO | Nasce repo CB-v2 (primo commit) | MATTEO | ORIGINATA | `git log --reverse` `0a0758b` | «Initial commit: CalendarBackup v2 - multi-tenant system» | project-bootstrap |
| J1-D02 | 10-06-26 | VENDITA | Repo pubblica PrenotaZen (split da privata) | CONGIUNTA | SCELTA | PrenotaZen `238a17d` 10-06 | «chore: initial public release» | release-public-split |
| J1-D03 | ? | PROCESSO | Release pubblica **sempre da `main`** | CONGIUNTA | APPROVATA | `scripts/sync-to-prenotazen.mjs` L1–20 | «la release parte SEMPRE da main» | release-gating |
| J1-D04 | ? | PROCESSO | Sync PrenotaZen: no commit/push automatici | CONGIUNTA | APPROVATA | stesso script L22–28 | «non committa e non pusha… non si pubblica mai nulla alla cieca» | release-gating |
| J1-D05 | 23-06-26 | PROCESSO | Ultimo merge `env/test` → `main` = S3 | CONGIUNTA | APPROVATA | `main` `22befb6` 23-06 | «Merge branch 'env/test'» | release-freeze |
| J1-D06 | 23-06-26 | VENDITA | Ultima release PrenotaZen = S3 (main@22befb6) | CONGIUNTA | APPROVATA | PrenotaZen `f01bbae` | «release: S3 intervalli di arrivo… (main@22befb6)» | release-prod |
| J1-D07 | 23-06-26 | SICUREZZA | PROD DB applicato fino a **062** (non oltre) | CONGIUNTA | SCELTA | MCP PROD `list_migrations` (rwuxgvld…) | ultima versione remota `062_update_service_slot_arrival_step` | env-safety |
| J1-D08 | 24-06→05-08 | SICUREZZA | S4 mig **063–071** solo su TEST / `env/test` | CONGIUNTA | SCELTA | CLI TEST `migration list --linked`; `git ls-tree main` vs `env/test` | TEST remote 063–071 presenti; main **0** file 063–071 | env-safety |
| J1-D09 | 06-08-26 | PROCESSO | Verdetto: blindato TEST ≠ rilasciato PROD | CONGIUNTA | SCELTA | A11/report chiusura + git (0 commit agosto su `main`) | «Servizio/S4 blindato tecnicamente su TEST; non ancora… PROD» | release-gating |
| J1-D10 | 22-06-26 | AI-METODO | Console su branch dedicato (non in `main` pubblico) | CONGIUNTA | SCELTA | branch `feature/console-super-admin`; A10 | console esclusa dal pubblico / branch attivo | product-isolation |
| J1-D11 | ? | PROCESSO | Nessun **git tag** di release su CB-v2 | INCERTO | DELEGATA | `git tag -l` vuoto; `git ls-remote --tags` vuoto | — (assenza di tag) | release-hygiene |
| J1-D12 | 22-06-26 | PROCESSO | Co-autoria git Cristiano (25 commit console) | CONGIUNTA | SCELTA | `git shortlog -sn --all` | «25 Cristiano Tulli» | collab-git |
| J1-D13 | mag→ago | AI-METODO | Prefisso `docs` = tipo commit più frequente | CONGIUNTA | DELEGATA | `git log --all --format=%s` aggregato | docs 352 / 1074 (32,8%) > feat 251 | method-docs-first |
| J1-D14 | 04-05-26 | SICUREZZA | Doppio file `003_*` (falso positivo db push) | AGENTE | DELEGATA | `supabase/migrations/003_*` ×2; AGENTS.md | `003_menu_categories` locale senza remote match | migration-hygiene |
| J1-D15 | lug-26 | PROCESSO | Zero commit luglio su questo repo | MATTEO | ORIGINATA | `git log --all --since=2026-07-01 --until=2026-08-01` → 0 | — (assenza totale) | focus-shift |

**Totale decisioni catalogate: 15.**

---

## Sezione 2 — Agency e correzioni

Su J1 l’agency è soprattutto **report ↔ fatti**: dove un documento dice X e git/DB dicono Y.

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| J1-A01 | M↔M | DIRETTA | Buco luglio: non pausa — zero commit CB-v2 (lavoro altrove) | accettata | git luglio=0; piano §2.2; A10 lacuna→J1 |
| J1-A02 | A→M | DEDOTTA | P0 anticipava 1073 commit / giu 437 — oggi 1074 / giu 453 | parziale | P0 §10 vs `git rev-list --all --count` |
| J1-A03 | M→A | DIRETTA | Gate PROD: S4 non autorizzato (report) = 063–071 assenti su PROD | accettata | A10 § ultimo stato; MCP PROD stop 062 |
| J1-A04 | A→M | DIRETTA | Report «118/118» e2e — non rieseguibile qui; resta dichiarazione | ignota | Report-finale-chiusura 06-08; prompt J1 vieta riesecuzione |
| J1-A05 | M↔M | DIRETTA | `main` fermo al 23-06 mentre `env/test` ha 75 commit non in main | accettata | `git rev-list main..env/test` = 75; agosto main = 0 |
| J1-A06 | A→M | DEDOTTA | Numerazione migrazioni PROD a timestamp ≠ nomi file locali | parziale | MCP PROD versions `20260513…` vs file `008_…` |
| J1-A07 | M→A | DIRETTA | Autore commit ≠ autore codice (regola J1) — eccezione Cristiano | accettata | shortlog; prompt J1 |

**Agency: 7** (M→A 2 · A→M 3 · M↔M 2).

---

## Sezione 3 — Skill signals

| Skill | Livello provvisorio | Prova in questo perimetro | Contro-evidenza (sez. 4) |
|-------|---------------------|---------------------------|---------------------------|
| `release-gating` | **L3–L4 cand.** | D03–D09: main-only sync, PROD≤062, S4 solo TEST, verdetto A11 | CE1: 75 commit `env/test` non in `main` da 44+ giorni |
| `env-safety` | **L3** | D07–D08 verificati su DB reali (TEST linked + PROD MCP) | CE2: storico PROD con versioni duplicate/timestamp (028/029×2, 018 v2) |
| `method-docs-first` | **L2** | D13: docs 32,8% prefissi; giu/ago docs > feat | CE3: maggio era feat/fix-first (181/179), non docs |
| `focus-shift` | **L2** | D15: luglio 0 commit qui | — (conferma H5/piano, non fallimento) |
| `collab-git` | **L1** | D12: 25 commit Cristiano su console | CE4: console ancora fuori `main` (10 commit ahead) |
| `migration-hygiene` | **L1** | D14: doppio 003 noto e gestito da `db:apply` | CE2 + doppio 003 ancora sul disco |
| `coding` (generico) | **L0 qui** | Vietato inferire da authore=Matteo | Regola prompt: commit ≠ skill codice |

---

## Sezione 4 — Contro-evidenze

| ID | Cosa | Perché conta | Fonte |
|----|------|--------------|-------|
| CE1 | `env/test` **75** commit avanti a `main`; **0** commit agosto su `main` | Il «cancello» release funziona, ma crea debito lungo: Servizio S4 blindato su TEST non è su produzione pubblica | `git rev-list`; `git log main --since=2026-08-01` |
| CE2 | PROD history migrazioni **sporca** (timestamp, 026b, 018 v2, 028/029 doppi) | Sicurezza env ok sul *tetto* (062), ma la storia remota non è 1:1 coi file | MCP PROD `list_migrations` |
| CE3 | Maggio: prodotto prima del metodo (feat+fix >> docs) | «docs-first» non è costante dall’inizio | tipi maggio vs giugno/agosto |
| CE4 | Branch console ancora aperto, non in PrenotaZen | Isolamento deciso, lavoro incompleto su trunk pubblico | `feature/console-super-admin` +10 vs main |
| CE5 | Nessun tag git; release solo come commit su altro repo | Tracciabilità release dipende da PrenotaZen, non da tag CB-v2 | `git tag -l` vuoto |
| CE6 | Esiti test solo dichiarati (118/118, validate verde) | J1 non riesegue test → non può elevare a peso 2 gli esiti numerici | prompt J1; Report 06-08 |

**Cercate attivamente, non trovate in questo perimetro:** evidenza git di un rilascio agosto su PrenotaZen o merge S4 in `main` — **assenti** (coerente col verdetto «non in PROD»).

---

## Sezione 5 — Copertura dichiarata

| Voce | Numero | Note |
|------|--------|------|
| Commit `--all` | **1074** | P0 anticipava 1073 (−1 drift o conteggio) |
| Branch locali/remoti ispezionati | **4** | `main`, `env/test`, `feature/console-super-admin`, `origin/test/modelli-locali` |
| File migrazioni aperti (lista+date add) | **72 / 72 (100%)** | `001`…`071` + doppio `003` |
| Tag CB-v2 | **0** | locale e remote |
| Release PrenotaZen (`^release:`) | **32** | repo locale `PrenotaZen`, 10-06→23-06 |
| DB TEST (`migration list --linked`) | **letto** | ref `docnnernvpyrbwuzzach`; remote 001–071 |
| DB PROD (`list_migrations` MCP) | **letto** | URL `rwuxgvld…`; stop a **062** (sola lettura) |
| Test eseguiti in questa ondata | **0** | vietati dal prompt |
| Report test citati | sì | chiusura 06-08, fase2/3 05-08, A10/A11 |

**Perimetro «file» J1:** non è una cartella di N markdown. Unità contate = commit + migrazioni + release + esiti dichiarati.

```
file nel perimetro (unità operative): 1074 commit + 72 migrazioni + 32 release PrenotaZen + 2 DB remote
unità ispezionate: tutte le sopra elencate
% copertura dichiarata: 100% delle unità del perimetro J1
saltati: riesecuzione test; contenuto di src/ (solo metadati commit, come da prompt)
```

---

## Sezione 6 — Lacune e handoff

| Lacuna | Serve a |
|--------|---------|
| Perché `main` non ha ricevuto S4/agosto (scelta esplicita vs semplice non-chiesto) | **H3** / transcript agosto; **S2** |
| Chi ha scritto il codice dietro i 1048 commit Matteo (agenti vs lui) | **non risolvibile da J1** — peso 1 (H) |
| Esito reale 118/118 oggi (regressione?) | riesecuzione fuori indagine; **S4** se un report lo smentisce |
| PROD: mapping completo timestamp↔file (026b, duplicati) | **Database-Skill** / audit dedicato, non S* |
| Stato deploy Vercel/hosting vs commit PrenotaZen | fuori perimetro git locale |
| `test/modelli-locali` (734 commit) — contenuto | fuori focus J1 salvo nota branch |
| Drift numeri P0 (1073→1074, docs 348→352, giu 437→453) | **S4** falsificazione minore / aggiornamento inventario |

**Input diretto per S4 (divergenze report ↔ git/DB):** vedi tabella sotto.

### 5.b — Divergenze report vs fatti (input S4)

| # | Cosa dice un report / P0 | Cosa mostra git/DB | Gravità |
|---|--------------------------|--------------------|---------|
| 1 | P0: 1073 commit; giu 437; docs 348 | 1074; giu 453; docs 352 | bassa (drift temporale) |
| 2 | A10: S0–S3 in PROD (057–062) 23-06 | PROD MCP termina a **062**; PrenotaZen ultima release 23-06 = S3 | **conferma** |
| 3 | A10/A11: S4 su TEST, non PROD | TEST remote 063–071; PROD no; main no 063–071 | **conferma** |
| 4 | Piano/P0: luglio 0 commit CB-v2 | luglio 0 | **conferma** |
| 5 | «Release» spesso raccontata in sessioni | Nessun tag CB-v2; 32 release solo su PrenotaZen | media (lessico) |
| 6 | Autore=Matteo implica lavoro suo | shortlog + regola J1; +25 Cristiano | alta per attribuzione skill codice |
| 7 | Validate/e2e verdi nei report agosto | Non verificati in J1 (non rieseguiti) | media (peso resta 3 finché non ricalcolati) |

---

## Timeline sintetica (fatto)

### Volume commit per mese (`--all`, data author `%ai`)

| Mese | Commit | Nota |
|------|--------|------|
| 2026-04 | 1 | 27-04 nascità repo |
| 2026-05 | **560** | picco prodotto |
| 2026-06 | **453** | metodo+release+console |
| 2026-07 | **0** | repo fermo (lavoro altrove) |
| 2026-08 | **60** | ripresa Servizio + docs indagine |
| **Totale** | **1074** | |

**Giorni di picco:** 12-06 (55), 06-05 (54), 04-05 (47), 01-06 (44), 28-05 (42).

**Settimane (lun→):** picco 04-05 (205), 25-05 (181), 01-06 (174); ripresa 03-08 (60).

### Tipi di commit (prefisso messaggio, tutti i branch)

| Prefisso | N | % su 1074 |
|----------|---|-----------|
| **docs** | **352** | **32,8%** |
| fix | 268 | 25,0% |
| feat | 251 | 23,4% |
| other (senza prefisso) | 105 | 9,8% |
| style | 31 | 2,9% |
| chore | 30 | 2,8% |
| test | 27 | 2,5% |
| refactor | 9 | 0,8% |
| revert | 1 | <0,1% |

**Per mese (stessa euristica prefisso):**
- **Maggio:** feat 181 · fix 179 · docs 126 → prodotto prima.
- **Giugno:** docs **215** · fix 86 · feat 73 → metodo/release prima.
- **Agosto:** docs **32** · fix 12 · test 8 · feat 5 → chiusura+documentazione.

**Rapporto docs/codice (path):** ≈ **316** commit toccano **solo** path sotto `docs/` (stima name-only); ≈ **346** se si allarga a `.cursor`/`.claude` «docs-like». Resta: **circa 1 commit su 3 è solo documentazione** — misura oggettiva del lavoro di metodo.

### Branch e merge

| Branch | Commit reachability | Nota |
|--------|---------------------|------|
| `main` | 985 | ultimo commit **23-06-26** `22befb6` merge env/test |
| `env/test` | 1058 | HEAD lavoro attuale; **75** not in main; **2** main not in test |
| `feature/console-super-admin` | 992 | **10** ahead di main (lavoro Cristiano+Matteo) |
| `origin/test/modelli-locali` | 734 | branch modelli locali |
| Merge su `main` | **41** | primo 22-05; ultimo 23-06 |

### Autori (attribuzione git, non skill)

| Autore | Commit |
|--------|--------|
| Matteo-Exp-Transformer | 1048 |
| Cristiano Tulli | 25 |
| Matteo Cavallaro (altra email) | 1 |

### Migrazioni

| Ambito | Stato |
|--------|-------|
| File locali | **72** (`001`…`071` + **due** `003_*`) |
| Prima add in git | 001 = 27-04; bulk maggio (42 add); giugno 25; agosto **4 nuove** (066,068,069,070) + 067/071 (add agosto; numeri alti) |
| **TEST** linked | remote **001–071** tutti presenti; locale `003_menu_categories` senza remote gemello (riga vuota remote) |
| **PROD** | applicate fino a **062**; **nessuna** 063–071; history con versioni timestamp e qualche doppio |
| `main` tree | file fino a **062** (63 path incluso doppio 003) |
| `env/test` tree | file fino a **071** |

**Blocchi semantici (da date add corrette):**
- 001–042: aprile–maggio (schema → Menu QR)
- 043–056: giugno pre-S2 (blindatura, CRM, GDPR)
- 057–062: **23-06 S2/S3** → in PROD e ultima release pubblica
- 063–065: **24-06 S4** → solo TEST
- 066–071: **02–05 agosto** ripresa S4 → solo TEST

### Rilasci produzione (PrenotaZen)

- **32** commit `release:` tra **10-06** e **23-06**.
- Giorni più densi: **12-06 (10 release)**, 19-06 (5), 21-06 (4), 15-06 (4).
- **Ultima:** 23-06 S3 allineata a `main@22befb6`.
- **Nessuna release agosto** nel repo PrenotaZen locale.

### Esiti test dichiarati (peso 3, non rieseguiti)

| Data | Dichiarazione | Fonte report |
|------|---------------|--------------|
| 05-08 | `npm run validate` verde · 162 file / **1346** test Vitest | Report-rossi / fase2 |
| 05-08 | e2e 117 → poi percorso verso 118; workers=1 | Report-rossi |
| 06-08 | e2e **118/118**, 6,4 min, 1 worker | Report-finale chiusura |
| 06-08 | `validate` exit 0 ~45s | stesso |
| 06-08 | `validate:docs` 14 path rotti Console (preesistenti) | stesso + collaudo filtrato |

---

## Sezione 7 — Chiusura verso Matteo

1. Dal calendario dei commit si vede chiaro: a maggio costruivi soprattutto funzioni e correzioni; a giugno e ad agosto pesava di più documentare e blindare. A luglio questo progetto è rimasto fermo (zero commit) — non una pausa inventata.
2. Ciò che i clienti vedono online (copia pubblica + database di produzione) si è fermato al pacchetto del **23 giugno** (regole orario/arrivi). Tutto il lavoro di agosto su Servizio/tavoli è sul database di prova e sul ramo di test, non ancora in produzione.
3. I commit portano quasi sempre il tuo nome anche quando scriveva un agente: servono a datare e a vedere cosa è davvero uscito, non a misurare quanto codice hai digitato tu. Unica firma diversa rilevante: venticinque commit di Cristiano sulla console admin.
)
