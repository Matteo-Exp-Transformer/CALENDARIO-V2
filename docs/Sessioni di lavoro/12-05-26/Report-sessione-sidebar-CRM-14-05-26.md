# Report sessione — 14 maggio 2026
## Sidebar Admin + CRM Clienti: implementazione, revisione e bug fix

---

## Obiettivo della sessione

Progettare e implementare la nuova struttura di navigazione laterale (`AdminShell`) per
l'admin dashboard e la prima sezione funzionale: **CRM Clienti** completo di CRUD,
ricerca, filtri, detail panel e eliminazione con effetti su DB.

---

## Contesto di partenza

L'admin aveva un'unica route `/admin → AdminDashboard.tsx` con navigazione a tab
orizzontale (header + footer). Nessuna struttura sidebar. Nessuna tabella `customers` nel DB.
I dati dei clienti esistevano solo come campi nei `booking_requests`.

---

## Fasi della sessione

### Fase 1 — Pianificazione (Plan Mode)

Analisi della codebase con 3 agenti Explore in parallelo su:
- Struttura e navigazione `AdminDashboard` (tipo tab, state, layout)
- Modello dati `booking_requests` (campi cliente, query hook esistenti)
- File DOCX con specifiche (non leggibile direttamente — descritto dall'utente)

**Decisioni architetturali prese:**
| Punto | Scelta |
|-------|--------|
| Navigazione sidebar | State-based — nessun cambio URL (`section` state in `AdminShell`) |
| Dati clienti | Aggrega da `booking_requests` + nuova tabella `customers` per inserimenti manuali |
| Sezioni sidebar | 4 voci: Home, CRM Clienti, Servizio, Analytics (no "Prenotazioni") |
| Accesso gestione prenotazioni | Pulsante Calendario in cima alla sidebar (non voce nav) |
| `source` clienti manuali | `'manual'` = creato da admin · `'synced'` = overlay su profilo booking |

Piano scritto in: `C:\Users\matte.MIO\.claude\plans\c-users-matte-mio-desktop-sgp-calendari-encapsulated-scroll.md`

---

### Fase 2 — Implementazione (agente esterno)

L'agente ha implementato il piano completo in un'unica sessione. Commit di ingresso: `e97c97b`.

**File creati (15):**

| File | Contenuto |
|------|-----------|
| `supabase/migrations/006_customers_crm.sql` | Tabella `customers`, RLS, trigger normalizzazione email, indice UNIQUE(tenant_id, lower(email)) |
| `src/types/customer.ts` | `CustomerProfile`, `CustomerDbSource`, `CustomerProfileSource` |
| `src/lib/customerEmail.ts` | `normalizeCustomerEmail()` — lowercase + trim, vuota → null |
| `src/features/booking/hooks/useCustomers.ts` | Query TanStack + `mergeProfiles()` + filtri client-side |
| `src/features/booking/hooks/useCustomerMutations.ts` | `useCreateCustomer`, `useUpdateCustomer`, `useDeleteCustomer` |
| `src/features/booking/components/crm/CustomerSearchBar.tsx` | Input ricerca + select filtro data |
| `src/features/booking/components/crm/CustomerListTable.tsx` | Tabella sortable con azioni riga |
| `src/features/booking/components/crm/CustomerDetailPanel.tsx` | Drawer slide-in z-[9000] |
| `src/features/booking/components/crm/CustomerFormModal.tsx` | Modal create/edit riusa `<Modal>` |
| `src/pages/CrmPage.tsx` | Orchestratore CRM |
| `src/pages/AdminHomePage.tsx` | Placeholder |
| `src/pages/ServizioPage.tsx` | Placeholder |
| `src/pages/AnalyticsPage.tsx` | Placeholder |
| `src/components/layout/AdminShell.tsx` | Layout wrapper sidebar + main |

**File modificati (3):** `src/router.tsx` · `src/types/database.ts` · `src/pages/AdminDashboard.tsx`

---

### Fase 3 — Revisione del lavoro dell'agente

Revisione manuale di tutti i 18 file. **Trovati 4 problemi:**

#### Bug #1 — 🔴 `data-admin-theme` rimosso al cambio sezione
**Causa:** `AdminDashboard` veniva smontato dalla shell (rendering condizionale). Il suo
`useEffect` aveva un cleanup `return () => removeAttribute('data-admin-theme')`. Ogni cambio
sezione rimuoveva il tema CSS: CRM/Home/Servizio/Analytics tornavano al navy di default
indipendentemente dal tema salvato dall'admin.
**Fix:** Rimosso il cleanup dall'`useEffect` in `AdminDashboard.tsx` — il tema persiste per
tutta la sessione admin.

#### Bug #2 — 🟡 `CRM_QUERY_KEY` duplicato
**Causa:** La costante era dichiarata separatamente in `useCustomers.ts` e
`useCustomerMutations.ts`. Rischio di divergenza silenziosa che romperebbe l'invalidazione.
**Fix:** Esportata da `useCustomers.ts`, importata in `useCustomerMutations.ts`.

#### Bug #3 — 🟡 Tabella CRM senza empty state
**Causa:** `<tbody>` vuota senza messaggio quando `rows` è array vuoto.
**Fix:** Aggiunta riga "Nessun cliente trovato." quando `sorted.length === 0`.

#### Bug #4 — 🟡 Errore email duplicata non user-friendly
**Causa:** Conflitto unique constraint su update email mostrava errore tecnico Postgres in inglese.
**Fix:** Intercettato codice `23505` con messaggio "Email già registrata per un altro cliente".

#### Problema sidebar — 🟡 Voce "Prenotazioni" duplicata nel nav
**Causa:** L'agente aveva aggiunto una 5ª voce "Prenotazioni" nel sidebar che mostrava
`AdminDashboard` (il quale ha già una tab "Prenotazioni" al suo interno).
**Fix:** Rimossa la voce dal `NAV` array. Aggiunto pulsante Calendario in cima alla sidebar
come accesso alla gestione prenotazioni.

**Commit fix + skill:** `e97c97b` (sidebar+CRM) · `b7e0d7c` (skill file) · `84d49d2` è il fix UUID (vedi sotto)

---

### Fase 4 — Creazione file skill

Creato `docs/Dashboard-laterale-skill/ADMIN_SHELL_SIDEBAR_SKILL.md` con:
- Schema architettura AdminShell
- Tabella file chiave
- Bug risolti con codice ❌/✅
- Pattern corretti per nuove sezioni
- Z-index layers (drawer vs modal)
- Tailwind v4 sintassi canonica

---

### Fase 5 — Feature: Eliminazione cliente

L'agente ha aggiunto il bottone elimina nella `CustomerListTable` e implementato
`useDeleteCustomer` con:
- Soft-delete di tutte le prenotazioni attive del cliente (`status='deleted'`,
  `cancellation_reason='customer_deleted'`, `cancelled_at`, `cancelled_by`)
- Delete fisica della riga `customers` se presente
- Nuovo componente `CustomerDeleteConfirm.tsx` con modal di conferma che mostra
  l'impatto dell'operazione (N prenotazioni archiviate)
- Invalidazione query CRM + booking dopo eliminazione

---

### Fase 6 — Revisione eliminazione e bug critico

#### Bug critico — 🔴 `cancelled_by` riceveva email invece di UUID

**Causa:** `cancelled_by` nella tabella `booking_requests` è colonna `UUID`. L'agente
aveva passato `user?.email` (stringa tipo `admin@example.com`) invece di `user?.id` (UUID
Supabase Auth). TypeScript **non rileva questo errore** perché `database.ts` tipizza
`cancelled_by` come `string | null`.

**Effetto:** L'UPDATE su `booking_requests` falliva con
`invalid input syntax for type uuid` su Postgres. Qualsiasi eliminazione di cliente con
prenotazioni associate **falliva silenziosamente** — solo i clienti senza booking venivano
eliminati correttamente.

**Fix:**
```typescript
// useCustomerMutations.ts — interface rinominata
adminEmail?: string | null  →  adminId?: string | null

// useCustomerMutations.ts — valore passato al DB
cancelled_by: input.adminEmail  →  cancelled_by: input.adminId

// CrmPage.tsx — chiamata mutation
adminEmail: user?.email  →  adminId: user?.id
```

**Commit fix:** `84d49d2`

---

### Fase 7 — Aggiornamento file skill

Aggiunte al file skill dopo il bug UUID:
- **Sezione 0 (nuova, obbligatoria):** checklist 5 minuti da completare prima di scrivere
  codice — elenca i 6 file da leggere e spiega i 3 bug che si sarebbero evitati.
- **Anti-pattern UUID:** regola con codice ❌/✅ e spiegazione del gap TypeScript.
- **Tabella Tailwind v4:** sintassi canonica in formato tabella (evita warning linter).

---

## Commit della sessione

| Hash | Messaggio |
|------|-----------|
| `e97c97b` | feat(admin): sidebar laterale + CRM Clienti — primo milestone stabile |
| `b7e0d7c` | docs(admin): skill file per agenti — AdminShell sidebar e CRM |
| `84d49d2` | fix(crm): cancelled_by UUID bug su eliminazione cliente + skill aggiornato |

---

## Stato finale

| Sezione | Stato |
|---------|-------|
| `AdminShell` (sidebar) | ✅ Stabile — 4 voci nav + pulsante Calendario |
| `CrmPage` | ✅ Funzionale — lista, ricerca, filtro, create, edit, delete |
| `AdminHomePage` | 🔲 Placeholder |
| `ServizioPage` | 🔲 Placeholder |
| `AnalyticsPage` | 🔲 Placeholder |
| DB migration `006_customers_crm` | ✅ Applicata al remoto |
| Skill file sidebar | ✅ Creato e aggiornato |

**Verifica finale:** `npm run validate` (lint + typecheck + 29 test) → tutto verde.

---

## Lezioni apprese / note per sessioni future

1. **TypeScript non valida colonne UUID** — `database.ts` le tipizza come `string | null`.
   Controllare sempre lo schema SQL per i campi audit (`cancelled_by`, `created_by`, ecc.)
   e usare sempre `user.id` (UUID) mai `user.email`.

2. **`AdminDashboard` si monta/smonta** — qualsiasi `useEffect` con cleanup che modifica
   il DOM globale (attributi su `<html>`, event listener, title) deve tenere conto che
   il componente viene smontato quando si cambia sezione nella shell.

3. **Costanti query key = unica sorgente** — mai dichiarare stringhe di query key in più
   file. Esportare dalla sorgente, importare ovunque.

4. **Leggere la struttura prima di modificare** — i 3 bug sopra si sarebbero evitati
   leggendo `useCustomerMutations.ts` + `006_customers_crm.sql` prima di implementare.
   Vedi Sezione 0 del file skill.
