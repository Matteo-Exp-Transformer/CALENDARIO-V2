# Collaborazione — Guida Team Console + Matteo

> **Cartella per la documentazione del workflow di collaborazione tra team console e Matteo.**
>
> Indice canonico per orientarsi nei file.

---

## 📋 File principali

### 1. **WORKFLOW.md** — Il processo di sviluppo
**Chi lo legge:** Team console + Matteo  
**Cosa contiene:** 
- I tre branch principali (main, env/test, feature/console-super-admin)
- Workflow passo-passo per il team console (inizio sessione, durante lavoro, push)
- Workflow passo-passo per Matteo (valida, integra, decide)
- Gestione conflitti
- Branch protection rules (GitHub)
- Checklist prima di push (team) e prima di integrare (Matteo)

---

### 2. **SKILL_SYSTEM_CONSOLE.md** — Due skill system indipendenti
**Chi lo legge:** Agenti orchetratori + team console  
**Cosa contiene:**
- Spiegazione: PrenotaZen skill system vs Console skill system
- Come il team console personalizza il suo skill system (docs/Console-Skill/)
- Come agenti capiscono quale skill caricare (branch detection)
- Come Matteo importerà i file console nel sistema principale (dopo)

---

### 3. **CLAUDE_MD_CONSOLE.md** — Template .claude/CLAUDE.md per il branch console
**Chi lo legge:** Team console (copia nel loro .claude/CLAUDE.md)  
**Cosa contiene:**
- Configurazione agenti per il branch console
- Entry point skill system (CONSOLE_SKILL_SYSTEM.md, non APP_CONTEXT_SKILL.md)
- Vocabolario Cristiano (come applicarlo)
- Testing obbligatorio
- Sicurezza PROD

---

## 📁 Struttura console

```
docs/Console-Skill/
├── collaborazione/          ← Tu sei qui
│   ├── WORKFLOW.md
│   ├── SKILL_SYSTEM_CONSOLE.md
│   ├── CLAUDE_MD_CONSOLE.md
│   └── README.md
├── CONSOLE_SKILL_SYSTEM.md  ← Entry point agenti (team crea)
├── contesto/                ← Schema, RLS, routing (team crea)
├── feature-*-Skill/         ← Feature skills (team crea)
└── sessioni/                ← Log lavoro
```

---

## ⚡ Quick start

**Team console — inizio sessione:**
```bash
git pull --rebase origin main
npm run validate
# Agenti caricano: docs/Console-Skill/CONSOLE_SKILL_SYSTEM.md
```

**Matteo — quando il team pushes:**
```bash
git fetch origin feature/console-super-admin
git log env/test..origin/feature/console-super-admin --oneline
git merge --no-ff origin/feature/console-super-admin  # in env/test
npm run validate
git checkout main && git merge --squash env/test && git push
```

---

**Versione:** 23-06-2026  
**Responsabile:** Matteo
