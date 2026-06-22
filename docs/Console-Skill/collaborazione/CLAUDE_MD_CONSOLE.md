# CLAUDE.md per feature/console-super-admin — Template

> **Questo è il template che il team console copierà nel loro .claude/CLAUDE.md**
>
> Al momento della creazione del branch feature/console-super-admin, il team:
> 1. Copia questo file
> 2. Lo mette in `.claude/CLAUDE.md` **sul branch console** (non su main)
> 3. Aggiorna i path/nomi come indicato sotto

---

## Come il team usa questo file

**Inizio sessione nel branch console:**
```
Agente legge .claude/CLAUDE.md
  ↓
Carica skill system console (non PrenotaZen)
  ↓
Carica vocabolario console
  ↓
Procede con sviluppo console
```

**Se agente sbaglia e carica PrenotaZen skills:**
```
Agente "scusa, ho caricato APP_CONTEXT_SKILL.md invece di CONSOLE_SKILL_SYSTEM.md"
  → significa che .claude/CLAUDE.md del branch console non è configurato
```

---

## Template .claude/CLAUDE.md per feature/console-super-admin

```markdown
# CLAUDE.md — Branch feature/console-super-admin (Team Console)

Questo file **orienta le sessioni Claude Code nel branch console**.
Diverso dal .claude/CLAUDE.md principale (che usa APP_CONTEXT_SKILL.md).

## ⚠️ IMPORTANTE

**In questo branch, carica SEMPRE il skill system CONSOLE, non PrenotaZen.**

Se un agente carica `docs/APP_CONTEXT_SKILL.md` o `docs/Prenota-Skill/`:
- ❌ SBAGLIATO (sono per main/env/test)
- ✅ CORRETTO: `docs/Console-Skill/CONSOLE_SKILL_SYSTEM.md`

---

## Entry point: Skill system console

### Prima di toccare il codice

1. **Apri:** `docs/Console-Skill/CONSOLE_SKILL_SYSTEM.md` (entry point locale per team console)
2. **Leggi § 0:** tabella routing "task X → skill Y"
3. **Carica la skill d'area** da `docs/Console-Skill/` (non da `docs/`)

**NO:** carica `docs/APP_CONTEXT_SKILL.md`  
**SÌ:** carica `docs/Console-Skill/CONSOLE_SKILL_SYSTEM.md`

---

## Vocabolario di Cristiano (team console)

**Base condivisa:** `docs/Comunicazione-Skill/VOCABOLARIO.md` (stessi termini di Matteo)

**Stile Cristiano (team console):** `docs/Comunicazione-Skill/VOCABOLARIO_CRISTIANO.md`

**Carica entrambi, in ordine:**
1. VOCABOLARIO.md (base, voci comuni)
2. VOCABOLARIO_CRISTIANO.md (override stile + voci nuove solo console)

**Priorità:** Se la voce è in VOCABOLARIO_CRISTIANO, usa quello (più specifico).

---

## Comandi e vocabolario (riferimento rapido)

Quando Cristiano dice:
- **«implementa»** → profilo Esecuzione, **test obbligatorio** prima di push
- **«ragioniamo»** → 10-15 min (profondo), pseudocode/trace, non 3 min rapido
- **«revisiona»** → check security + performance, non solo funzionale
- **«debug profondo»** → log strutturato, SQL explain, RLS audit (solo console)
- **«implementa test»** → test d'integrazione + RLS test (solo console)
- **«comunicazione team console»** → aggiorna status (solo console)
- **«aggiorna skill console»** → documenta pattern in CONSOLE_SKILL_SYSTEM (solo console)

Vedi `docs/Comunicazione-Skill/VOCABOLARIO_CRISTIANO.md` per dettagli.

---

## Struttura progetto (console)

**Cartella principale:** `docs/Console-Skill/`

```
docs/Console-Skill/
├── CONSOLE_SKILL_SYSTEM.md         ← Entry point agenti (qui inizia)
├── collaborazione/                 ← Guide workflow
│   ├── WORKFLOW.md                 ← Come lavora il team
│   ├── SKILL_SYSTEM_CONSOLE.md     ← Due skill system (console vs PrenotaZen)
│   └── (altre guide)
├── contesto/                       ← Mappa aree + contesto tecnico
│   ├── CONSOLE_CONTEXT.md          ← Tabella routing + invarianti console
│   ├── CONSOLE_DB_CONTEXT.md       ← Schema, RLS, migrazioni
│   ├── CONSOLE_ADMIN_CONTEXT.md    ← Orchestrazione dev
│   └── (più contesti per funzione)
├── feature-*-Skill/                ← Skill d'area console
│   ├── USER_MANAGEMENT_SKILL.md    ← (quando creato)
│   ├── COMPANY_MANAGEMENT_SKILL.md ← (quando creato)
│   └── (altre skill)
└── sessioni/                       ← Log lavoro team
    └── (report daily status)
```

**NON** usare le cartelle PrenotaZen (Prenota-Skill/, Menu-QR-Skill/, etc.) per console.

---

## File critici (console)

| File | Ruolo |
|------|-------|
| `.claude/CLAUDE.md` (questo) | Configuration agenti (console) |
| `docs/Console-Skill/CONSOLE_SKILL_SYSTEM.md` | Entry point skill system |
| `docs/Console-Skill/contesto/CONSOLE_DB_CONTEXT.md` | Schema DB console + RLS |
| `src/` (code console) | Possibilmente in cartella separata (es. `src/features/console/`) |
| `supabase/migrations/` (console) | Migrazioni console (marcate `*_console_*` se possibile) |

---

## Zone delicate (protette)

### ❌ NON TOCCARE (PrenotaZen)
- `docs/APP_CONTEXT_SKILL.md` → è per Matteo (main/env/test)
- `docs/Prenota-Skill/`, `docs/Menu-QR-Skill/` → skill PrenotaZen
- `docs/Comunicazione-Skill/VOCABOLARIO.md` → base, ma override è VOCABOLARIO_CRISTIANO.md
- `src/features/booking/` (core Prenota) → toccare solo se necessario, coordinare con Matteo

### ✅ PERSONALIZZA (Console)
- `.claude/CLAUDE.md` → **questo file, solo per il branch console**
- `docs/Console-Skill/` → tutto qui è tuo
- `docs/Console-Skill/contesto/` → specifico console
- `src/features/console/` (proposta) → codice console separato

---

## Decisioni DB (RLS, migrazioni)

**Prima di creare una migrazione:**
1. Leggi `docs/Console-Skill/contesto/CONSOLE_DB_CONTEXT.md`
2. Documenta **la logica RLS** (comment nel codice + file context)
3. Se non sei sicuro → comunica a Matteo prima di pushare

**Formato migrazione console (proposta):**
```
supabase/migrations/
├── 060_users_console.sql          ← console table, RLS, GRANT
├── 061_organizations_console.sql  ← (se serve)
└── 062_rls_audit_console.sql      ← RLS audit log
```

---

## Testing obbligatorio (team console)

Vedi `docs/Console-Skill/contesto/CONSOLE_DB_CONTEXT.md` § Testing.

**Prima di push:**
- ✅ `npm run validate` (lint + typecheck + test)
- ✅ Test d'integrazione per il flusso nuovo
- ✅ Se RLS: test che l'accesso non autorizzato è bloccato
- ✅ Se Edge function: test su Supabase TEST (non locale)

**Dopo validazione locale:**
- ✅ Comunica a Matteo (repo status, cosa è stato fatto)
- ✅ Push su feature/console-super-admin
- ✅ Matteo valida e integra in env/test + main

---

## Comandi e configurazioni

### Pre-lavoro (inizializzazione)
```bash
# Nel branch feature/console-super-admin
git fetch origin && git merge origin/main   # Sincronizza (NO rebase: branch condiviso — vedi WORKFLOW.md §2)
npm install                           # Dipendenze (se cambiate)
npm run db:types:linked               # Rigenera tipi DB
```

### Durante lo sviluppo
```bash
npm run dev                           # Dev server
npm run lint:fix                      # Fix automatico
npm run typecheck                     # Type check
npm run test:watch                    # Test in watch mode
npm run test                          # Test singolo run
npm run test:e2e                      # E2E (su staging)
```

### Pre-push (checklist)
```bash
npm run validate                      # Lint + typecheck + test (green?)
git log --oneline -5                  # Controlla i tuoi commit (prefisso console:?)
git status                            # Niente uncommitted?
git push origin feature/console-super-admin
```

### Dopo push: Attendi Matteo
```
(Matteo integra in env/test)
(Matteo valida)
(Matteo mergia in main)
(Aggiorna il tuo branch: git fetch origin && git merge origin/main)
```

---

## Sicurezza produzione

**Prima di toccare DB/Edge:**
1. **Sempre TEST**: sviluppa su `docnnernvp` (test Supabase), non su `rwuxgvld` (prod)
2. **Matteo valida**: il team NON pushes migrazioni/Edge su PROD
3. **Migrazioni**: documentate, reviewed, provate su TEST prima

(Vedi `.claude/CLAUDE.md` principale § Sicurezza PROD per dettagli.)

---

## Aggiunte al vocabolario

Se il team scopre una parola nuova che Cristiano usa:
1. **Proposta:** aggiunta in `docs/Comunicazione-Skill/VOCABOLARIO_CRISTIANO.md`
2. **Approvazione:** Matteo + Cristiano concordano il livello (1/2/3)
3. **Attivazione:** aggiorna il file, documenta la voce
4. **Uso:** agenti caricano il vocabolario aggiornato

---

## Allineamento Matteo (integrazione finale)

**Durante development (no azione):** il team lavora con skill system console.

**Ogni milestone (Matteo aggiorna):** quando una feature console è stabile, Matteo integra il skill system nel sistema principale:
```bash
cp -r docs/Console-Skill/ docs/Console-Admin-Skill/
# Aggiorna APP_CONTEXT_SKILL.md per includere console
```

---

## Troubleshooting

### "Ho caricato APP_CONTEXT_SKILL.md per sbaglio"
**Causa:** .claude/CLAUDE.md non è personalizzato per il branch console.  
**Fix:** assicurati che il tuo .claude/CLAUDE.md punta a `CONSOLE_SKILL_SYSTEM.md`, non a `APP_CONTEXT_SKILL.md`.

### "Il mio test fallisce su RLS"
**Passi:**
1. Leggi il test error (qual è la permission denied?)
2. Controlla la policy RLS in CONSOLE_DB_CONTEXT.md
3. Se è un bug: aggiorna la policy, test di nuovo
4. Se il test è buono: comunica a Matteo

### "Matteo ha fatto un merge in main, come mi aggiorno?"
**Comando:**
```bash
git fetch origin && git merge origin/main
```

---

## Regole anti-conflitto

- ✅ Team si allinea da main **spesso** (ideale ogni sessione, con `merge` — non rebase)
- ✅ Team prefissa **tutti i commit** con `console:` (lo squash in 1 commit lo fa Matteo promuovendo in main)
- ✅ Matteo integra **regolarmente** da feature/console-super-admin

---

## Chi contattare

- **Matteo:** orchestrazione, valori design, integrazione
- **Cristiano:** domande stile dev, vocabolario, skill system console

---

**Versione:** 23-06-2026  
**Branch:** feature/console-super-admin  
**Autore:** Matteo (template), Cristiano (customizzazione team)
```

---

## Istruzioni per il team: Come usare questo template

1. **Copiate questo file:**
   ```bash
   cp docs/Console-Skill/collaborazione/CLAUDE_MD_CONSOLE.md .claude/CLAUDE.md
   ```

2. **Nel branch feature/console-super-admin**, assicuratevi che `.claude/CLAUDE.md` contenga il testo sopra.

3. **Customizzate se necessario:**
   - Cambiate `Cristiano` con il vero nome del team lead
   - Aggiungete nomi/contatti team
   - Aggiornate path se diverse da quelle proposte

4. **Committate:**
   ```bash
   git add .claude/CLAUDE.md
   git commit -m "console(.claude): configura CLAUDE.md per feature/console-super-admin"
   git push origin feature/console-super-admin
   ```

Fatto! Adesso gli agenti nel branch console caricheranno automaticamente il skill system console.

---

**Versione:** 23-06-2026  
**Autore:** Matteo
