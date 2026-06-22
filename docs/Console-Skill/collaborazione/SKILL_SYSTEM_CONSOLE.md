# Skill System Console — Personalizzazione e Integrazione

> **Per orchestratori/agenti nel branch feature/console-super-admin.**
>
> Questo documento spiega come il team console personalizza il suo skill system, senza conflittare con il sistema principale di PrenotaZen, e come Matteo lo importerà dopo nel sistema integrato.

---

## 1. Due skill system indipendenti

### PrenotaZen (main / env/test)
**Location:** `docs/` (radice)  
**Owner:** Matteo  
**Scope:** app principale, Prenota, Menu QR, Admin, Calendario, etc.  
**Files chiave:**
- `docs/APP_CONTEXT_SKILL.md` — tabella routing aree
- `docs/Prenota-Skill/PRENOTA_SKILL.md`
- `docs/Menu-QR-Skill/MENU_QR_SKILL.md`
- `docs/Admin-Skill/` — cartella
- `docs/Database-Skill/DB_SKILL.md`
- `docs/Testing-Skill/TESTING_SKILL.md`

### Console (feature/console-super-admin)
**Location:** `docs/Console-Skill/` (cartella dedicata)  
**Owner:** Team console  
**Scope:** sviluppo console super-admin (utenti, aziende, settings, RLS, Edge function private)  
**Files che il team **CREA / PERSONALIZZA**:**
- `docs/Console-Skill/CONSOLE_SKILL_SYSTEM.md` — **entry point per agenti nel loro branch**
- `docs/Console-Skill/contesto/CONSOLE_CONTEXT.md` — mappa aree console
- `docs/Console-Skill/contesto/CONSOLE_DB_CONTEXT.md` — schema console + RLS
- `docs/Console-Skill/contesto/CONSOLE_ADMIN_CONTEXT.md` — orchestrazione dev console
- (tutte le skill-specific sotto)

---

## 2. Come il team console lavora

### 2.1 Agenti nel branch console sanno dove stare

Quando un orchestratore (Opus, Sonnet) è invocato in `feature/console-super-admin`, **NON tira** `docs/APP_CONTEXT_SKILL.md`.

Invece:
1. Legge `docs/Console-Skill/CONSOLE_SKILL_SYSTEM.md` (entry point locale)
2. Carica la skill d'area da `docs/Console-Skill/` (non da `docs/`)
3. Studia il contesto di console, non dell'app principale

**Guarda l'esempio:** se devi implementare "RLS per users_console"
- ❌ NON vai su `docs/Database-Skill/DB_SKILL.md` (è PrenotaZen)
- ✅ Vai su `docs/Console-Skill/contesto/CONSOLE_DB_CONTEXT.md`

### 2.2 File che il team console CREA (non duplica)

**Struttura proposta:**

```
docs/Console-Skill/
├── CONSOLE_SKILL_SYSTEM.md              ← Entry point agenti
├── collaborazione/
│   ├── WORKFLOW.md                      ✅ (creato)
│   ├── SKILL_SYSTEM_CONSOLE.md          ✅ (questo file)
│   └── (guide operative)
├── contesto/
│   ├── CONSOLE_CONTEXT.md               ← Tabella routing console
│   ├── CONSOLE_DB_CONTEXT.md            ← Schema, RLS, migrazioni
│   ├── CONSOLE_ADMIN_CONTEXT.md         ← Orchestrazione lavoro
│   └── (più contesti per funzione)
├── feature-*-Skill/                     ← Skill d'area console
│   ├── USER_MANAGEMENT_SKILL.md
│   ├── COMPANY_MANAGEMENT_SKILL.md
│   ├── SETTINGS_SKILL.md
│   └── etc.
└── piano/                               ← Planner team
    └── (WIP, non committare se .gitignore)
```

### 2.3 Qual è la differenza con PrenotaZen?

| Aspetto | PrenotaZen | Console |
|---------|-----------|---------|
| **Entry point agenti** | `docs/APP_CONTEXT_SKILL.md` | `docs/Console-Skill/CONSOLE_SKILL_SYSTEM.md` |
| **Routing aree** | §0 tabella in APP_CONTEXT | §0 tabella in CONSOLE_SKILL_SYSTEM |
| **Contesto aree** | `docs/{Area}-Skill/` | `docs/Console-Skill/contesto/` |
| **DB + RLS** | `docs/Database-Skill/DB_SKILL.md` | `docs/Console-Skill/contesto/CONSOLE_DB_CONTEXT.md` |
| **Testing** | `docs/Testing-Skill/` | (prendi da PrenotaZen, identico) |
| **Comunicazione Matteo** | `docs/Comunicazione-Skill/VOCABOLARIO_MATTEO.md` | stessa voce |
| **Comunicazione Cristiano** | — | `docs/Comunicazione-Skill/VOCABOLARIO_CRISTIANO.md` |

---

## 3. Come agenti capiscono quale skill system usare

### Scenario 1: Agente in main / env/test (PrenotaZen)
```
Leggi: .claude/CLAUDE.md
  ↓
Carica: docs/APP_CONTEXT_SKILL.md
  ↓
Usa skill d'area PrenotaZen (Prenota-Skill/, Menu-QR-Skill/, etc.)
```

### Scenario 2: Agente in feature/console-super-admin (Console)
```
Leggi: .claude/CLAUDE.md (ma è personalizzato nel branch console)
  ↓
Carica: docs/Console-Skill/CONSOLE_SKILL_SYSTEM.md
  ↓
Usa skill d'area Console (Console-Skill/contesto/, feature-*-Skill/)
```

**Come funziona il "switch"?** 

Due opzioni:

#### Opzione A: .claude/CLAUDE.md diverso per branch (CONSIGLIATO)
- **main / env/test:** `.claude/CLAUDE.md` punta a `docs/APP_CONTEXT_SKILL.md`
- **feature/console-super-admin:** `.claude/CLAUDE.md` punta a `docs/Console-Skill/CONSOLE_SKILL_SYSTEM.md`

Git non vedrebbe conflitto se i due CLAUDE.md hanno path diversi.

```bash
# Branch console
# .claude/CLAUDE.md contiene:
# "Apri docs/Console-Skill/CONSOLE_SKILL_SYSTEM.md"
```

#### Opzione B: Agente intelligente (più flessibile)
Nel CLAUDE.md, agente legge il current branch:
```bash
git branch --show-current
```
Se è `feature/console-super-admin` → usa Console skills.
Altrimenti → usa PrenotaZen skills.

**Suggerimento Matteo:** quale preferisci?

---

## 4. Integrazione Console → PrenotaZen (cosa fa Matteo dopo)

### 4.1 Timeline
1. **Team console** completa feature X
2. **Matteo** integra in env/test e valida
3. **Matteo** mergia in main
4. **Matteo** (una volta per milestone) integra Console skills nel sistema PrenotaZen

### 4.2 Come Matteo integra i file

**Al termine del progetto console (o ogni milestone), Matteo:**

```bash
# Su env/test
git fetch origin feature/console-super-admin

# Copia i file Console skills al sistema principale
cp -r docs/Console-Skill/contesto/* docs/Console-Admin-Skill/contesto/
cp docs/Console-Skill/CONSOLE_SKILL_SYSTEM.md docs/CONSOLE_ADMIN_SKILL.md

# Aggiorna APP_CONTEXT_SKILL.md per includere Console
# Aggrega tabella routing: 
# "Console (super-admin) → docs/CONSOLE_ADMIN_SKILL.md"

git add docs/
git commit -m "docs(console): integra skill system console nella guida principale"
git push origin env/test
```

### 4.3 Struttura finale (dopo integrazione)

```
docs/
├── APP_CONTEXT_SKILL.md                 ← Aggiornato, include Console
├── CONSOLE_ADMIN_SKILL.md               ← Importato dal team
├── Prenota-Skill/
├── Menu-QR-Skill/
├── Admin-Skill/
├── Console-Admin-Skill/                 ← Rinominato da Console-Skill/
│   ├── CONSOLE_SKILL_SYSTEM.md          ← Copiato
│   ├── contesto/
│   └── feature-*-Skill/
└── (altre skill)
```

---

## 5. Vocabolario e Comunicazione

### Due vocabolario, stessa base

**Fonte:** `docs/Comunicazione-Skill/VOCABOLARIO_BASE.md` (condiviso)

```
docs/Comunicazione-Skill/
├── VOCABOLARIO_BASE.md           ← Termini condivisi (Matteo + Cristiano)
├── VOCABOLARIO_MATTEO.md         ← Stile Matteo (livelli, esecuzione)
├── VOCABOLARIO_CRISTIANO.md      ← Stile Cristiano (team console, diverso tono/ritmo)
└── CHIUSURA_SESSIONE.md
```

**Come il team console lo usa:**

In `.claude/CLAUDE.md` del branch console:
```markdown
## Vocabolario di Cristiano (team console)

Carica `docs/Comunicazione-Skill/VOCABOLARIO_BASE.md` + 
`docs/Comunicazione-Skill/VOCABOLARIO_CRISTIANO.md`.

Applica lo stile Cristiano per:
- Ritmo della spiegazione (più dettagliato per debugger)
- Linguaggio tecnico (console ≠ product UX)
- Livelli di libertà (Cristiano può decider di agire più rapidamente)
```

### Come funziona concretamente?

Entrambi sanno che `"ragioniamo"` = fermati e analizza.
Ma:
- **Matteo**: `"ragioniamo"` → spiegazione rapida (1 min), diagramma semplice, azione
- **Cristiano**: `"ragioniamo"` → analisi profonda (3-5 min), pseudocode, test

Stesso comando, stile diverso. **Uno vocabolario base, due implementazioni.**

---

## 6. Checklist: Cosa il team console fa OGGI (inizio development)

### Step 1: Creare entry point skill system console
```bash
cp docs/APP_CONTEXT_SKILL.md docs/Console-Skill/CONSOLE_SKILL_SYSTEM.md
# Modifica:
# - Cambia titolo: "Console Skill System" 
# - §0: tabella routing per aree console (USER, COMPANY, SETTINGS, DB-RLS, etc.)
# - §1: file critici console
# - §3: struttura progetto console
# - §4: invarianti console
```

### Step 2: Creare contesto strutturato
```bash
mkdir -p docs/Console-Skill/contesto/
touch docs/Console-Skill/contesto/{CONSOLE_CONTEXT,CONSOLE_DB_CONTEXT,CONSOLE_ADMIN_CONTEXT}.md
```

### Step 3: Creare feature skills
```bash
mkdir -p docs/Console-Skill/feature-user-management-Skill/
touch docs/Console-Skill/feature-user-management-Skill/USER_MANAGEMENT_SKILL.md
```

### Step 4: Personalizzare .claude/CLAUDE.md per il branch console
```bash
# Nel branch feature/console-super-admin
# Crea/modifica .claude/CLAUDE.md:
# - Cambia entry point: "Apri docs/Console-Skill/CONSOLE_SKILL_SYSTEM.md"
# - Cambia vocabolario: "Carica VOCABOLARIO_CRISTIANO.md"
# - Aggiungi sezione "Console Development Notes"
```

### Step 5: Comunicare a Matteo
```
Pronto il skill system console. Locazione:
- docs/Console-Skill/CONSOLE_SKILL_SYSTEM.md
- .claude/CLAUDE.md personalizzato per feature/console-super-admin

Integrare in PrenotaZen quando la feature è stabile.
```

---

## 7. Guida Matteo: Quando integrare i file console

### Momento 1: Inizio (niente integrazione, solo docs prep)
Team crea il sistema console. Matteo verifica che sia separato e non conflitti.

### Momento 2: Primo merge in main
```bash
git merge --squash origin/feature/console-super-admin
# commit ha console code
```

Matteo **NON** integra i file skill yet. Team continua a sviluppare con il suo sistema.

### Momento 3: Feature console "stabile" (milestone)
Quando il team dice "User Management è completo", Matteo integra:

```bash
# Su main (o in un branch prepare-console-integration)
mkdir -p docs/Console-Admin-Skill/
cp -r docs/Console-Skill/feature-user-management-Skill docs/Console-Admin-Skill/

# Aggiorna APP_CONTEXT_SKILL.md §0:
# Aggiungi riga: "Console (User Mgmt) → docs/Console-Admin-Skill/feature-user-management-Skill/USER_MANAGEMENT_SKILL.md"

git add docs/
git commit -m "docs(console): integra User Management skill nel sistema principale"
git push origin main
```

### Momento 4: Console fully integrated
Al termine del progetto console (es. dopo S4-LIVE), Matteo integra tutto:

```bash
# Copia la struttura intera
cp -r docs/Console-Skill/ docs/Console-Admin-Skill/

# Rinomina il file entry point
mv docs/Console-Admin-Skill/CONSOLE_SKILL_SYSTEM.md docs/CONSOLE_ADMIN_SKILL.md

# Aggiorna APP_CONTEXT_SKILL.md
# §0: unifica tabella routing PrenotaZen + Console
# §1: aggiungi file critici console
# §3: spiega struttura "Con Console" vs "Senza Console" (Edition Classic/Pro)

git add docs/
git commit -m "docs(console): integra Console Admin skill nel sistema principale"
git push origin main
```

---

## 8. Che non succeda: anti-pattern

### ❌ Team console modifica docs/APP_CONTEXT_SKILL.md
Non farlo. È di Matteo.  
Se serve aggiungere una voce: aggiorna `docs/Console-Skill/CONSOLE_SKILL_SYSTEM.md` (tuo).

### ❌ Team console duplica Database-Skill/ o Testing-Skill/
Non farlo. Prendi da PrenotaZen quando serve (link, non copia).  
Se la console ha esigenze diverse: crea `docs/Console-Skill/contesto/CONSOLE_DB_CONTEXT.md` (specializzato).

### ❌ Agente carica skill sbagliato (console code con PrenotaZen skill)
**Mitigation:** 
- Dois CLAUDE.md diversi (uno per branch)
- Oppure agente è smart: `git branch --show-current` e decide quale skill caricare

### ❌ Conflitto git tra due vocabolario (MATTEO vs CRISTIANO)
Non succede se:
- VOCABOLARIO_BASE.md è condiviso
- VOCABOLARIO_MATTEO.md è solo per main/env/test
- VOCABOLARIO_CRISTIANO.md è solo per feature/console-super-admin

---

## 9. Template: CONSOLE_SKILL_SYSTEM.md (copyt da APP_CONTEXT_SKILL)

Team console inizia con una **copia semplificata** di `docs/APP_CONTEXT_SKILL.md`:

```markdown
# Console Skill System

## §0 Routing aree console

| Task | Skill | File |
|------|-------|------|
| Aggiungere ruolo staff | USER_MANAGEMENT_SKILL | docs/Console-Skill/feature-user-management-Skill/ |
| Gestire RLS users_console | CONSOLE_DB_SKILL | docs/Console-Skill/contesto/CONSOLE_DB_CONTEXT.md |
| Creare form settings | SETTINGS_SKILL | docs/Console-Skill/feature-settings-Skill/ |
| Edge function private | CONSOLE_EDGE_SKILL | docs/Console-Skill/contesto/CONSOLE_DB_CONTEXT.md §{section} |

## §1 File critici
... (estrai da CONSOLE_CONTEXT.md)

## §2 CLAUDE.md specifico
... (qui spiega dove diverisce dal main CLAUDE.md)
```

---

## 10. Riassunto per il team

| Fatto | Significa | Dove |
|-------|-----------|------|
| **Inizio** | Crei skill system console indipendente | `docs/Console-Skill/` |
| **Durante** | Agenti caricano `CONSOLE_SKILL_SYSTEM.md`, non `APP_CONTEXT_SKILL.md` | Branch: feature/console-super-admin |
| **Vocabolario** | Stesso vocab base, stile Cristiano vs Matteo | VOCABOLARIO_BASE + CRISTIANO |
| **Fine (milestone)** | Matteo integra i file nel sistema principale | main: docs/Console-Admin-Skill/ |
| **Integrazione finale** | Console è parte di APP_CONTEXT_SKILL.md | Edition: Classic vs Pro (Pro ha Console) |

---

**Prossima azione:**  
Team console crea `docs/Console-Skill/CONSOLE_SKILL_SYSTEM.md` come primo file, con tabella routing aree console (USER, COMPANY, DB, EDGE, etc.).

Matteo valida la struttura.

---

**Versione:** 23-06-2026  
**Autore:** Matteo  
**Per:** Team console + orchestratori cloud
