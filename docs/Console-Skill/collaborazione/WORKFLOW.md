# Workflow Collaborazione — Team Console ⟷ Matteo

> **Fonte di verità unica del processo di lavoro.** Due ruoli, tre branch, un ciclo di validazione.
> Per il *cosa* di ogni richiesta vedi `REGISTRO_RICHIESTE.md` + i file `richieste/REQ-NNN-*.md`.

---

## 1. I tre branch

| Branch | Owner | Cosa vive qui | Chi ci scrive |
|--------|-------|---------------|---------------|
| **main** | Matteo | Codice produzione stabile | solo Matteo |
| **env/test** | Matteo | Integrazione + test del lavoro del Team | solo Matteo |
| **feature/console-super-admin** | Team console | Sviluppo console (CRUD, form, Edge, RLS) | il Team (push diretto) |

**Regola d'oro dei ruoli:** il Team **solo sviluppa e pusha** sul proprio branch. **Non merge-a** mai su
`env/test` né su `main`. È Matteo che tira il lavoro, lo valida su `env/test` e decide cosa promuovere
in `main`.

```
feature/console-super-admin   →(Matteo tira+valida)→   env/test   →(Matteo promuove il solido)→   main
        ▲                                                                                            │
        └──────────────────  il Team si aggiorna: git merge origin/main  ◄─────────────────────────┘
```

---

## 2. Git — i comandi giusti

### Team console
```bash
# Inizio sessione: allinea il tuo branch con il main di Matteo
git fetch origin
git merge origin/main          # NON rebase: il branch è condiviso, niente force-push

# Fine sessione: pubblica il tuo lavoro
git push origin feature/console-super-admin
```
> ⚠️ **Niente `rebase` + `push --force` su `feature/console-super-admin`:** è un branch condiviso, il
> force-push può cancellare il lavoro di un altro membro del Team. Si usa `merge`, sempre.

### Matteo
```bash
# 1. Vedi cosa ha pushato il Team
git fetch origin feature/console-super-admin
git log env/test..origin/feature/console-super-admin --oneline

# 2. Integra e valida su env/test
git checkout env/test
git merge origin/feature/console-super-admin   # oppure cherry-pick i singoli commit utili
npm run validate                               # lint + typecheck + test verdi

# 3. Promuovi in main SOLO il lavoro solido
git checkout main
git merge --squash env/test                    # 1 commit logico
git commit -m "feat(console): <descrizione> [REQ-NNN]"
git push origin main
```

---

## 3. Ciclo per richiesta (checklist sessione)

Il flusso è guidato da `REGISTRO_RICHIESTE.md` (la lavagna) + `richieste/REQ-NNN-*.md` (il dettaglio).
Stati: `BOZZA · DA-FARE · IN-SVILUPPO · CONSEGNATA · IN-TEST · ACCETTATA · RIMANDATA`.

### 🟢 Avvio — Team
1. `git fetch && git merge origin/main` (parti dall'ultimo, vedi §2).
2. Apri `REGISTRO_RICHIESTE.md` → prendi una REQ in **DA-FARE**, mettila **IN-SVILUPPO**.
3. Leggi `STATO_AMBIENTE_TEST.md` → non rifare cose già attive su TEST.
4. Carica la bussola `CONSOLE_SKILL_SYSTEM.md`. Se tocchi il DB: `get_project_url` deve essere `docnnernvp` (TEST), **mai PROD**.

### 🔴 Chiusura — Team
1. `npm run validate` verde (riportalo nella REQ).
2. Compila la sezione **«② Consegna»** della REQ: commit/SHA, modifiche, *cosa testare*, *azioni lato Matteo* (env/secret/plan/deploy).
3. Aggiorna `SESSION_LOG.md` (sempre); se hai cambiato TEST, aggiorna `STATO_AMBIENTE_TEST.md`.
4. Metti la REQ **CONSEGNATA**, **commit + push**, avvisa Matteo.

### 🟢→🔴 Matteo
1. `git fetch` + integra su `env/test` (§2), `npm run validate`.
2. Metti la REQ **IN-TEST**, segui «② Consegna», compila **«③ Esito test»**.
3. Esito: **ACCETTATA** (promuovi in `main`, §2) oppure **RIMANDATA** (scrivi cosa non va → torna al Team).
4. Se apri nuove richieste: nuovo file da `_TEMPLATE_RICHIESTA.md`, riga **DA-FARE** nel registro. Commit + push, avvisa il Team.

> **Regola d'oro della sincronizzazione:** nessuno inizia senza aver fatto il **pull/merge** e letto il
> **registro**; nessuno chiude senza aver aggiornato il **registro** + fatto **push**. Se non è nel
> registro, non è successo.

---

## 4. Conflitti

- **Team, dopo `git merge origin/main` con conflitto:** risolvi il file, `git commit`, `git push`. (Niente force-push.)
- **Matteo, conflitto integrando su `env/test`:** risolve in locale, testa, promuove in `main`. Il Team non lo vede perché si aggiorna da `main` già risolto.
- **Come evitarli:** il Team si allinea **spesso** (ogni sessione), Matteo integra **spesso** (non aspettare giorni).

---

## 5. Convenzioni commit (Team)

- Prefisso `console(scope):` → Matteo riconosce a colpo d'occhio il lavoro del Team.
  Es. `console(super-admin): add user form CRUD`, `console(db): RLS users_console`, `console(edge): POST /admin/users`.
- Niente `console.log` / TODO orfani; `npm run lint:fix` prima del push.
- Schema DB → migrazione in `supabase/migrations/` (la valida Matteo). RLS → commento con la logica.

---

**Versione:** 23-06-2026 · **Owner processo:** Matteo · prossima review a fine primo ciclo di integrazione.
