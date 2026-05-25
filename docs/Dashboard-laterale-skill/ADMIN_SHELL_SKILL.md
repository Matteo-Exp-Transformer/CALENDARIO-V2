---
name: admin-shell
description: >-
  Skill per qualsiasi lavoro su AdminShell, sidebar e sezioni admin di CalendarBackup-v2
  (CRM, Home, Servizio, Analytics e nuove pagine future). Carica automaticamente il context
  corretto in base al task. Leggere prima di toccare AdminShell, qualsiasi Page o hook admin.
---

# Admin Shell — Guida agente

> Stack: React 18 + Vite + TypeScript + Tailwind CSS v4 + Supabase + TanStack Query.

---

## 0. Prima cosa: leggi il task → carica il context

**Passo 1 — sempre obbligatorio:**
Leggi `docs/Dashboard-laterale-skill/ADMIN_SHELL_CONTEXT.md`.

**Passo 2 — leggi il task ricevuto e applica questa tabella:**

| Il task menziona… | Leggi anche (sezione in ADMIN_PAGES_CONTEXT.md) |
|-------------------|-------------------------------------------------|
| CRM / clienti / customer / booking history / `useCustomers` / `CustomerProfile` | § CRM |
| Home / `AdminHomePage` | § Home |
| Servizio / `ServizioPage` | § Servizio |
| Analytics / `AnalyticsPage` | § Analytics |
| Nuova sezione / nuova pagina / aggiungere voce nav | Leggi `ADMIN_PAGES_CONTEXT.md` intero |
| Sidebar / toggle / `AdminShell` / nav / responsive | Già in `ADMIN_SHELL_CONTEXT.md` |
| Non è chiaro quale sezione | Leggi `ADMIN_PAGES_CONTEXT.md` intero |

Carica i file indicati **prima** di aprire qualsiasi file da modificare.

---

## 1. Workflow

1. Carica context (step 0)
2. **Leggi** i file chiave della sezione interessata (elencati nel context)
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
npm run test        # 132/132 Vitest
npm run validate    # per PR: tutto in sequenza
```
