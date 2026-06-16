---
name: admin-shell
description: >-
  Skill shell Admin (AdminShell, sidebar, sezioni Pro): workflow agente, invarianti,
  verifica post-modifica. Entry tecnica dell'area Admin — leggere anche ADMIN_SKILL.md
  per senso, confini e mappa completa.
---

# Admin Shell — Guida agente

> **Destinazione proposta (post-ok Matteo):** `docs/Admin-Skill/ADMIN_SHELL_SKILL.md`  
> **Sostituisce:** `docs/Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md`  
> **Area padre:** `docs/Admin-Skill/ADMIN_SKILL.md`

> Stack: React 18 + Vite + TypeScript + Tailwind CSS v4 + Supabase + TanStack Query.

---

## 0. Prima cosa: leggi il task → carica il context

**Passo 0a — contesto area (se il task è ampio o multi-sezione):**  
Leggi `docs/Admin-Skill/ADMIN_SKILL.md` §1–§7 per confini, edition e mappa domini.

**Passo 1 — sempre obbligatorio per shell/nav/routing:**  
Leggi `docs/Admin-Skill/contesto/ADMIN_SHELL_NAV_CONTEXT.md` (route, URL come fonte di verità, Classic vs Pro, guard dirty, blindatura M1).

**Passo 2 — architettura tecnica shell (sidebar 3 stati, z-index, tema, anti-pattern, nuove sezioni):**  
Leggi `docs/Admin-Skill/contesto/ADMIN_SHELL_ARCHITECTURE_CONTEXT.md` quando tocchi layout shell, responsive sidebar, z-index o pattern nuova sezione.

**Passo 3 — leggi il task e applica questa tabella:**

| Il task menziona… | Leggi anche |
|-------------------|-------------|
| CRM / clienti / `useCustomers` / `CustomerProfile` | `contesto/ADMIN_CRM_CONTEXT.md` + § CRM in `contesto/ADMIN_SHELL_PAGES_CONTEXT.md` (dettaglio query key / anti-pattern) |
| Home / `AdminHomePage` / KPI giorno | `contesto/ADMIN_ANALYTICS_HOME_CONTEXT.md` §1 + § Home in `ADMIN_SHELL_PAGES_CONTEXT.md` |
| Servizio / tavoli / fasce / mappa / assegnazioni | `contesto/ADMIN_SERVIZIO_CONTEXT.md` + § Servizio in `ADMIN_SHELL_PAGES_CONTEXT.md` (fasce, override, DnD, quick assign) |
| Analytics / `AnalyticsPage` | `contesto/ADMIN_ANALYTICS_HOME_CONTEXT.md` §2+ + § Analytics in `ADMIN_SHELL_PAGES_CONTEXT.md` |
| Nuova sezione / nuova pagina / voce nav | `ADMIN_SHELL_ARCHITECTURE_CONTEXT.md` §7 + `ADMIN_SHELL_PAGES_CONTEXT.md` (template) + aggiorna `ADMIN_SKILL.md` §7 |
| Sidebar / toggle / `AdminShell` / nav / responsive | `ADMIN_SHELL_NAV_CONTEXT.md` + `ADMIN_SHELL_ARCHITECTURE_CONTEXT.md` §4–§5 |
| Tab Calendario / Prenotazioni / Archivio / Menu / Impostazioni | `docs/ADMIN_CLASSIC_SKILL.md` (admin classica) |
| Non è chiaro quale sezione | `ADMIN_SKILL.md` §7 + `ADMIN_SHELL_PAGES_CONTEXT.md` indice |

Carica i file indicati **prima** di aprire qualsiasi file da modificare.

---

## 1. Workflow

1. Carica context (step 0)
2. **Leggi** i file chiave della sezione interessata (elencati nei context)
3. **Grep** per capire pattern esistenti: hook, queryKey, tipi usati
4. **Applica** seguendo i pattern del context — non reinventare
5. **Valida**: `npm run typecheck && npm run lint && npm run test`

---

## 2. Invarianti — non negoziabili

```
LOCK  supabase/migrations/          — DB remoto, mai toccare
LOCK  Modal.tsx  z-[10050]          — stack z-index calibrato
→ Per regole su TenantContext vedi APP_CONTEXT_SKILL.md §4

RULE  CRM_QUERY_KEY: importare da useCustomers.ts, mai ridichiarare
RULE  Email CRM: sempre normalizeCustomerEmail() prima di confronto o scrittura
RULE  UUID vs email: verified in database.ts — cancelled_by è UUID, non email
RULE  `SIDEBAR_NAV`: NON aggiungere 'home' o 'prenotazioni' — coperti dal pulsante Home in cima
RULE  Form Pubblico: window.open('...', '_blank', 'noopener,noreferrer') — MAI location.href
RULE  data-admin-theme effect: nessun cleanup — il tema deve persistere
RULE  Classi Tailwind letterali — mai `bg-${x}-600` (non genera CSS)
RULE  cn() da @/lib/utils — mai clsx() o twMerge() direttamente
RULE  Route shell/tab: derivare da URL, non stato React duplicato — vedi ADMIN_SHELL_NAV_CONTEXT §1
```

---

## 3. Commit convention

```
feat(admin): ...   fix(admin): ...   update(admin): ...
feat(crm): ...     fix(crm): ...
```

---

## 4. Verifica post-modifica

```bash
npm run typecheck   # zero errori TS
npm run lint        # zero warning
npm run test        # Vitest (incl. @admin-blindatura shell-* unit)
npm run validate    # per PR: tutto in sequenza
```

**E2E shell (M1, staging TEST):** dopo modifiche a `AdminShell`, routing o guard logout:

```bash
npm run test:e2e -- e2e/admin-shell-blindatura.spec.ts e2e/admin-login.spec.ts e2e/admin-classic-tabs.spec.ts e2e/pro/pro-sidebar-nav.spec.ts
```

Credenziali in `.env.local.test` (`E2E_CLASSIC_ADMIN_*`, `E2E_PRO_ADMIN_*`). Sidebar Pro: `getByRole('complementary', { name: /navigazione principale/i })`. Dettaglio marcatori → `ADMIN_SHELL_NAV_CONTEXT.md` §10.
