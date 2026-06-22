# Workflow Collaborazione — Branch feature/console-super-admin

> **Questa è la guida di lavoro per il team sviluppo console e per Matteo (orchestratore).**
> 
> Due ruoli distinti, uno branch, un processo di validazione strutturato.

---

## 1. I tre rami principali

| Branch | Owner | Cosa vive qui | Protezione |
|--------|-------|---------------|-----------|
| **main** | Matteo | Codice produzione stabile | ✅ Protected, PR review |
| **env/test** | Matteo | Development integrato, esperimenti, debugging | ✅ Protected, Matteo push diretto |
| **feature/console-super-admin** | Team console | Sviluppo console (CRUD, form, logica) | ❌ Libero, push diretto team |

---

## 2. Workflow per il team sviluppo console

### 2.1 Inizio sessione: sincronizzarsi con main

```bash
# Sulla branch locale (feature/console-super-admin)
git pull --rebase origin main
```

**Perché `--rebase` e non `merge`?**
- Mantiene la storia lineare e leggibile
- Evita commit merge inutili
- Se c'è conflitto: risolvilo in sequenza, commit per commit

**Se `--rebase` fallisce:**
```bash
git rebase --abort              # torna indietro
git pull origin main --no-rebase # oppure merge se serve il merge commit
git push origin feature/console-super-admin --force-with-lease
```

### 2.2 Durante il lavoro: struttura commit

**Prefisso obbligatorio:** tutti i commit nel team console usano `console:` prefix.

```bash
git commit -m "console(super-admin): add user form CRUD"
git commit -m "console(super-admin): fix validation email field"
git commit -m "console(db): RLS per users_console table"
git commit -m "console(edge): POST /admin/users endpoint"
```

**Benefici:**
- Matteo sa subito chi ha fatto cosa ("console:" = team console)
- Histoire leggibile: `git log --oneline | grep console:`
- Facilita cherry-pick e integrazione

### 2.3 Push e comunicazione

```bash
# Pronto a pushare (controtest locale fatto)
git push origin feature/console-super-admin
```

**Avvisa Matteo** (ticket / chat / commit message):
- Cosa è stato fatto
- Se dipende da altro in env/test
- Se tocca schema DB (indicare migrazione)
- **NON fare richiesta di merge diretto** — Matteo lo fa da env/test

---

## 3. Workflow per Matteo (orchestratore)

### 3.1 Ricevi notifica: il team ha pushato su feature/console-super-admin

```bash
# Su env/test
git fetch origin feature/console-super-admin
git log env/test..origin/feature/console-super-admin --oneline
# Leggi i commit, capisce cosa è nuovo
```

### 3.2 Valida: integrate locally in env/test

```bash
# Su env/test
git merge --no-ff origin/feature/console-super-admin
# ✅ oppure cherry-pick commit singoli se non tutto serve

# Testa localmente
npm run dev          # console funziona?
npm run validate     # tsc, lint, test ok?
```

**Possibili esiti:**
- ✅ **Tutto ok**: prosegui a 3.3
- ⚠️ **Conflitto minore**: risolvi in env/test, test, prosegui
- ❌ **Problema serio**: comunica al team cosa sistemare, loro reforcano su feature/console-super-admin

### 3.3 Decidi cosa tenere in main

```bash
# Opzione A: squash-merge tutto in main (1 commit logico)
git checkout main
git pull origin main
git merge --squash env/test
git commit -m "feat(console): integra super-admin [FU-CONSOLE-X]"
git push origin main

# Opzione B: cherry-pick commit singoli
git checkout main
git cherry-pick <commit-hash-1> <commit-hash-2> ...
git push origin main

# Opzione C: reset env/test se qualcosa non serve
git checkout env/test
git reset --hard origin/main    # ricomincia da main
# ... e aspetta il prossimo push del team
```

### 3.4 Comunica al team

```
✅ Integrato in main / env/test — ultima versione disponibile.

Aggiornate il vostro branch:
  git pull --rebase origin main
```

---

## 4. Gestione conflitti

### 4.1 Se il team tira da main e c'è conflitto

**Team console fa:**
```bash
git pull --rebase origin main
# conflict nella cartella docs/Console-Skill/

# Risolvi il conflitto
# Completa il rebase
git rebase --continue
git push origin feature/console-super-admin --force-with-lease
```

**Come evitarlo:**
- Team tira **spesso** (ogni giorno, ideale ogni sessione)
- Matteo integra **spesso** (non aspettare una settimana)

### 4.2 Se Matteo integra in env/test e c'è conflitto

**Matteo risolve localmente** in env/test, testa, pushes in main.

Team non vede il conflitto perché tirano da main (già risolto).

---

## 5. Schema mentale della sincronizzazione

```
feature/console-super-admin          env/test (Matteo)           main (produzione)
         |                                |                          |
         +-- Team push commit A           |                          |
         |     "console(super-admin)..."  |                          |
         |                                |                          |
         +-- Team push commit B           |                          |
         |                                |                          |
         +--> (Matteo tira + valida)     |                          |
                                  +---> merge --->                 push
                                         |           (decide)         |
                                    env/test OK      cosa tenere   main OK
                                         |            e quando      |
                                    npm run dev                      ✅ PROD
                                    npm run validate
```

---

## 6. Branch protection rules (GitHub)

### main
```
✅ Require pull request reviews before merging
   - Approving reviews: at least 1 (Matteo)
   - Dismiss stale pull request approvals when new commits pushed
✅ Require status checks to pass before merging
   - npm run validate (CI)
✅ Require branches to be up to date before merging
❌ Allow force pushes: NO
❌ Allow deletions: NO
```

### env/test
```
❌ Require pull request reviews (Matteo usa direct push)
❌ Require status checks (ma consigliato: runna local)
✅ Allow force pushes: YES (Matteo può riscrivere se serve)
❌ Allow deletions: NO
```

### feature/console-super-admin
```
❌ Nessuna protezione (team libero di sviluppare)
```

---

## 7. Comandi rapidi (alias git)

### Per il team console

```bash
git config alias.pull-fresh 'pull --rebase origin main'
git config alias.push-work 'push origin HEAD:refs/heads/feature/console-super-admin'
git config alias.log-console 'log --oneline --grep="^console"'

# Uso quotidiano
git pull-fresh                 # sincronizza con main
git push-work                  # pushes i tuoi commit
git log-console                # vedi solo i tuoi commit console
```

### Per Matteo

```bash
git config alias.review-console 'log env/test..origin/feature/console-super-admin --oneline --decorate'
git config alias.integrate-console 'merge --no-ff origin/feature/console-super-admin'
git config alias.squash-console 'merge --squash origin/feature/console-super-admin'

# Uso quotidiano
git review-console             # vedi cosa c'è di nuovo
git fetch origin feature/console-super-admin && git review-console
git integrate-console          # tira e integra in env/test
```

---

## 8. Checklist: Team console prima di pushare

- ✅ Commit con prefisso `console:` 
- ✅ Testa localmente (form, API, DB se è stato)
- ✅ Niente console.log / TODO non commentato
- ✅ `npm run lint:fix` prima di push
- ✅ Se tocchi schema DB: migrazione in `supabase/migrations/` (Matteo li validerà)
- ✅ Se tocchi RLS: aggiungi commento con logica
- ✅ Comunica a Matteo cosa è stato fatto

---

## 9. Checklist: Matteo prima di integrare in main

- ✅ `git review-console` — leggi cosa c'è di nuovo
- ✅ Tira e testa in env/test: `npm run dev`, `npm run validate`
- ✅ Se è stato DB: verifica migrazione, RLS, permessi
- ✅ Se è API Edge: test su TEST di Supabase
- ✅ Decidi: tutto in main / cherry-pick / aspetta / chiedi refactor
- ✅ Se tutto ok: squash-merge in main con message esplicito

---

## 10. Troubleshooting

### "Ho pushato ma il mio commit non compare in env/test"
**Risposta:** Matteo non ha ancora tirato da feature/console-super-admin. Comunica che hai pushato.

### "Ho tirato da main e ho conflitto nei docs/Console-Skill/"
**Risposta:** È normale. Risolvi manualmente il .md, completa rebase, pushes di nuovo.

### "Matteo ha fatto merge in main, come mi aggiorno?"
**Risposta:** 
```bash
git pull --rebase origin main
```
Questo tira i tuoi commit + i nuovi di Matteo, in ordine.

### "Ho fatto un commit sbagliato, come lo tolgo?"
**Risposta:** Se non è stato pushato:
```bash
git reset --soft HEAD~1    # tolgo il commit, tengo i file modificati
```

Se è stato pushato:
```bash
git revert <commit-hash>   # crea un commit di "undo"
git push origin feature/console-super-admin
```

---

## 11. Comunicazione

**Canale:** indicare in quale canale (GitHub issue / chat / ticket) il team avvisa Matteo dei push.

Formato minimo:
```
🔔 Nuova integrazione pronta: feature/console-super-admin

Cosa:
- console(super-admin): add user form CRUD
- console(db): RLS per users_console

Dipende da:
- (nessuna)

Testato:
- ✅ npm run dev (form carica, API risponde)
- ✅ npm run validate
- ⚠️ DB migrate non testato (Matteo farà)

Pronto per env/test.
```

---

**Versione:** 23-06-2026  
**Autore:** Matteo  
**Prossima review:** quando il primo team ha completato un ciclo integrazione.
