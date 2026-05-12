---
name: app-context
description: >-
  Skill 0 — orienta qualsiasi agente su CalendarBackup-v2. Caricalo quando inizi
  una sessione senza sapere quale skill usare, o quando il task attraversa più aree.
  Mappa l'app, definisce invarianti globali e instrada al skill corretto.
---

# App Context — Guida orientamento agente

> Stack: React 18 + Vite + TypeScript + Tailwind CSS v4 + Supabase + TanStack Query.
> File master: `CLAUDE.md` — leggerlo per comandi e setup.

---

## 0. Prima cosa: instrada al skill corretto

Leggi il task ricevuto e applica questa tabella:

| Il task riguarda… | Skill da caricare |
|-------------------|-------------------|
| AdminShell / sidebar / nav / sezioni / routing admin | `docs/Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md` |
| CRM / clienti / customer / useCustomers / CustomerProfile | `docs/Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md` |
| UI / className / Tailwind / layout / componenti / tema / colori / index.css | `docs/per-ui-design/UI_EDIT_SKILL.md` |
| Task che tocca sia layout shell che stile Tailwind | **entrambi** i skill sopra |
| Non è chiaro di quale area si tratti | Leggi `CLAUDE.md` + `docs/ARCHITECTURE.md`, poi usa questa tabella |

Carica il skill indicato **prima** di aprire qualsiasi file da modificare.

---

## 1. Due aree dell'app

| Area | Entry point | Client Supabase | Session |
|------|-------------|-----------------|---------|
| **Pubblica** — form prenotazione clienti | Route con slug tenant | `supabasePublic` | no |
| **Admin** — dashboard ristoratore | `/admin` → `AdminShell` | `supabase` | sì (localStorage) |

Non mischiare mai i due client. `supabase` è per operazioni admin autenticate; `supabasePublic` è per form pubblici anonimi.

---

## 2. Mappa routing admin

Il routing admin è **state-based** (nessun cambio URL). `AdminShell.tsx` gestisce uno stato `section` e monta il componente corretto.

| `section` | Componente montato | Stato |
|-----------|-------------------|-------|
| `'home'` ← DEFAULT | `<AdminHomePage />` | stabile — quick-nav + KPI giorno + prossime 3h |
| `'prenotazioni'` | `<AdminDashboard />` | stabile (pulsante Calendario) |
| `'crm'` | `<CrmPage />` | stabile |
| `'servizio'` | `<ServizioPage />` | implementato F1 — CRUD tavoli per sala |
| `'analytics'` | `<AnalyticsPage />` | implementato F1 — KPI + trend |

File di dettaglio per ogni sezione: `docs/Dashboard-laterale-skill/ADMIN_PAGES_CONTEXT.md`.

---

## 3. Struttura cartelle src/

```
src/
├── components/layout/   AdminShell.tsx
├── components/ui/       Button, Input, Modal, Card, Badge, Alert, EmptyState, Spinner…
├── contexts/            TenantContext.tsx  ← LOCKED
├── features/booking/
│   ├── components/      componenti dashboard (BookingCalendar, CRM, ecc.)
│   ├── hooks/           useAdminAuth, useBookingMutations, useCustomers, ecc.
│   ├── lib/             restaurantSettingRegistry
│   └── utils/           helper puri (date, prezzi)
├── lib/                 supabase.ts, supabasePublic.ts, email.ts, logger.ts, utils.ts
├── pages/               AdminDashboard, AdminHomePage, CrmPage, ServizioPage, AnalyticsPage…
├── router.tsx           ← solo su esplicita richiesta
└── types/               database.ts (generato), booking.ts, customer.ts
```

---

## 4. Invarianti globali — valgono in ogni task, in ogni file

```
LOCK  CollapsibleCard.tsx          — 57 test — mai toccare
LOCK  Modal.tsx  z-[10050]         — stack calibrato con Toast z-100000
LOCK  TenantContext.tsx            — core multi-tenancy — MAI
LOCK  src/lib/supabase.ts          — client autenticato — MAI
LOCK  supabase/migrations/         — DB remoto già applicato — MAI
LOCK  src/router.tsx               — solo su esplicita richiesta

RULE  Classi Tailwind: solo stringhe letterali statiche — mai `bg-${x}-600`
RULE  cn() da @/lib/utils — mai clsx() o twMerge() direttamente
RULE  !important Tailwind v4: suffisso → `border-red-500!` (non `!border-red-500`)
RULE  data-admin-theme: nessun cleanup — il tema deve persistere per tutta la sessione
RULE  Due client Supabase: non mischiare supabase ↔ supabasePublic
RULE  Email CRM: normalizeCustomerEmail() prima di confronto o scrittura
RULE  UUID: cancelled_by è UUID auth.users.id — mai passare email a campi UUID
```

---

## 5. Comandi principali

```bash
npm run dev           # dev server :5173
npm run typecheck     # tsc --noEmit — zero errori
npm run lint          # ESLint — zero warning
npm run test          # 29 Vitest — tutti devono passare
npm run validate      # lint + typecheck + test (usare pre-PR)
```

---

## 6. Convenzioni

- **Logger**: `logger.debug/info/warn/error` da `src/lib/logger.ts` — mai `console.log`
- **TanStack Query**: query server-state nei hook in `src/features/booking/hooks/`
- **Commit**: `feat(scope):` · `fix(scope):` · `update(scope):`
- **Import alias**: `@/` → `src/`
