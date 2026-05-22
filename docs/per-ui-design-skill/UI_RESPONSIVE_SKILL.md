---
name: ui-responsive
description: >-
  Skill per il responsive design di CalendarBackup-v2. Caricala per qualsiasi
  modifica che cambia il layout su più larghezze schermo (breakpoint, grid che
  collassano, padding/gap adattivi, container max-width, comportamento mobile) o
  che riguarda l'interazione tra contenuto pagina e sidebar admin. Regola fondante:
  la pagina è progettata a viewport pieno, la sidebar è overlay e non restringe mai.
---

# UI Responsive — Guida agente

> Stack: React 18 + Vite + TypeScript + **Tailwind CSS v4**.
> Riferimento gold standard: `src/pages/AdminDashboard.tsx` (Classic).

---

## 0. Prima cosa: leggi i context

**Passo 1 — sempre:** leggi `docs/per-ui-design-skill/STYLING_AGENT_CONTEXT.md`
(token, anti-pattern, componenti LOCK).

**Passo 2 — sempre per task responsive:** leggi
`docs/per-ui-design-skill/UI_RESPONSIVE_CONTEXT.md` (principio sidebar-overlay,
riferimento Classic, breakpoint, scala spacing, griglie, checklist).

**Passo 3 — se il task tocca anche…:**

| Il task tocca… | Leggi anche |
|----------------|-------------|
| `AdminShell.tsx`, comportamento sidebar, overlay, drawer, z-index shell | `docs/Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md` |
| Componenti `src/components/ui/` (Modal, Button, Card…) | `docs/per-ui-design-skill/UI_COMPONENTS_CONTEXT.md` |
| Token, colori, `index.css`, `tailwind.config.js` | `docs/per-ui-design-skill/UI_THEME_CONTEXT.md` |
| File admin classica (AdminDashboard, BookingCalendar, …) | `docs/ADMIN_CLASSIC_SKILL.md` — spiegazione preventiva obbligatoria |

---

## 1. Le 3 regole non negoziabili

```
R1  La pagina si progetta a VIEWPORT PIENO.
    La sidebar è overlay con backdrop scuro — non spinge, non restringe.
    MAI logica "se sidebar aperta riduci colonne/larghezza".

R2  UN SOLO layout responsive per Classic e Pro/Enterprise.
    Riferimento da replicare = AdminDashboard (Classic).
    Container standard = max-w-7xl.

R3  Mobile-first Tailwind nativo (sm/md/lg/xl/2xl).
    Il breakpoint 645px è solo della shell (matchMedia) —
    MAI replicarlo dentro un componente pagina.
```

---

## 2. Workflow

1. Carica context (step 0)
2. **Grep** la zona in `src/` — vedere breakpoint/spacing già in uso vicino
3. **Leggi** i file da modificare — mai editare alla cieca
4. **Applica** seguendo i pattern di `UI_RESPONSIVE_CONTEXT.md` — coerenza locale
   ha priorità sul valore esatto
5. **Checklist** §7 di `UI_RESPONSIVE_CONTEXT.md`
6. **Valida**: `npm run typecheck && npm run lint`

---

## 3. Invarianti ereditate

Valgono tutte le LOCK/RULE di `UI_EDIT_SKILL.md` §2. In più:

```
LOCK  AdminShell.tsx — comportamento sidebar/overlay è area shell:
      spiegazione preventiva prima di modificare
RULE  Modifica responsive su file admin classica → ADMIN_CLASSIC_SKILL.md prima
RULE  Niente refactor di massa non richiesto: allinea solo i file che tocchi
RULE  Classi letterali statiche — mai `grid-cols-${n}` o breakpoint dinamici
```

---

## 4. Commit & verifica

```
feat(ui): ...   fix(ui): ...   update(ui): ...

npm run typecheck   # zero errori
npm run lint        # zero warning
npm run validate    # per PR
```
