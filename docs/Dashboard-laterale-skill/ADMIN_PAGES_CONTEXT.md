# Admin Pages — Context per sezione

> Un paragrafo per ogni sezione della sidebar. Aggiorna questo file quando aggiungi una pagina.
> Per l'architettura shell, routing e anti-pattern comuni → vedi ADMIN_SHELL_CONTEXT.md.

---

## Indice sezioni

- [CRM Clienti](#crm-clienti)
- [Home](#home)
- [Servizio](#servizio)
- [Analytics](#analytics)
- [Template — nuova sezione](#template--nuova-sezione)

---

## CRM Clienti

**Sezione**: `section === 'crm'` → `<CrmPage />`  
**Stato**: implementato e stabile.

**Accesso UX**: dalla sidebar la voce **Form Pubblico** apre il form prenotazioni pubblico (`/prenota/:slug`). Il CRM resta raggiungibile dal bottone **CRM Clienti** nella nav a griglia / footer quick-nav di `AdminDashboard` (callback `onOpenCrm` dalla shell).

### File chiave

| File | Ruolo |
|------|-------|
| `src/pages/CrmPage.tsx` | Orchestratore: state locale, composizione componenti |
| `src/features/booking/hooks/useCustomers.ts` | Query + `mergeProfiles()` + `CRM_QUERY_KEY` |
| `src/features/booking/hooks/useCustomerMutations.ts` | `useCreateCustomer`, `useUpdateCustomer`, `useDeleteCustomer` |
| `src/lib/customerEmail.ts` | `normalizeCustomerEmail()` — usare SEMPRE per email |
| `src/types/customer.ts` | `CustomerProfile`, `CustomerDbSource`, `CustomerProfileSource` |
| `src/types/database.ts` | Tipi Supabase generati — verificare colonne UUID prima di mutazioni |
| `supabase/migrations/006_customers_crm.sql` | Schema `customers`, trigger, vincoli |
| `src/features/booking/components/crm/CustomerDeleteConfirm.tsx` | Modal conferma eliminazione |

### Architettura dati

Due sorgenti → un profilo unificato tramite `mergeProfiles()`:

```
booking_requests (clienti che hanno prenotato)  ──┐
                                                   ├── mergeProfiles() → CustomerProfile[]
customers table  (source: 'manual' | 'synced')  ──┘
```

Aggregazione: `lower(trim(client_email))`.

| Condizione | `CustomerProfile.source` | Badge "Manuale" |
|-----------|--------------------------|-----------------|
| ≥ 1 booking | `'booking'` | No |
| 0 booking, customers `source='manual'` | `'manual'` | **Sì** |
| 0 booking, customers `source='synced'` | `'manual'` | No |

### Regole critiche CRM

**Email — normalizzare sempre:**
```typescript
// ✅ corretto — usare prima di confronto o scrittura
normalizeCustomerEmail(raw)  // trim().toLowerCase(), ritorna null se vuota

// ❌ case-sensitive, non gestisce spazi
if (booking.client_email === customerEmail) ...
```

**`CRM_QUERY_KEY` — unica sorgente:**
```typescript
// useCustomers.ts — unica dichiarazione
export const CRM_QUERY_KEY = 'crm-customer-profiles'

// useCustomerMutations.ts — importato, MAI ridichiarato
import { CRM_QUERY_KEY } from './useCustomers'
```
Qualsiasi hook che invalida la query CRM deve **importare** `CRM_QUERY_KEY`, non ridichiararlo.

**UUID vs email — BUG documentato (commit 84d49d2):**
```typescript
// ❌ BUG CRITICO — cancelled_by è UUID in DB, non stringa
deleteCustomer.mutate({ adminEmail: user?.email })  // "admin@x.com" non è UUID

// ✅ corretto
deleteCustomer.mutate({ adminId: user?.id })  // UUID Supabase Auth

// REGOLA GENERALE: quando passi un campo UUID a Supabase, verifica sempre che
// il valore sia auth.users.id (UUID), NON email o username.
// TypeScript non ti protegge: database.ts tipizza UUID come string | null.
```

### State locale CrmPage

Prima di modificare `CrmPage.tsx`, mappare questi stati:
- `selected` — cliente selezionato (apre CustomerDetailPanel)
- `panelOpen` — visibilità pannello dettaglio
- `formOpen` — visibilità form crea/modifica cliente
- `deleteTarget` — cliente da eliminare (apre CustomerDeleteConfirm)

### Anti-pattern specifici CRM

```typescript
// ❌ ridichiarare CRM_QUERY_KEY
const CRM_QUERY_KEY = 'crm-customer-profiles'  // duplica silenziosamente

// ❌ confronto email senza normalize
customer.email === searchTerm  // case-sensitive, manca trim

// ❌ passare email a campo UUID
{ cancelled_by: user.email }   // Postgres: "invalid input syntax for type uuid"
```

---

## Home

**Sezione**: `section === 'home'` → `<AdminDashboard />` (stesso componente di `prenotazioni`; default all’ingresso `/admin`).  
**Stato**: la shell mostra la dashboard operativa (calendario, tab, ecc.). Una **Home riassuntiva** dedicata resta da definire in `AdminHomePage.tsx` (placeholder, non montata dalla shell su questa sezione).

### File chiave

| File | Ruolo |
|------|-------|
| `src/pages/AdminDashboard.tsx` | Vista principale dopo login e sezione Home |
| `src/pages/AdminHomePage.tsx` | Placeholder per futura dashboard «inizio turno» / metriche |

### Obiettivo previsto (fase 2)

Dashboard riassuntiva: metriche rapide, prossime prenotazioni, stato ristorante — vedi piano prodotto; non duplicare il calendario completo già in `AdminDashboard`.

### Note

- Da sidebar, **Impostazioni** imposta `sessionStorage` `admin-open-tab` / segnale verso `AdminDashboard` per aprire il tab Impostazioni locale (`RestaurantSettingsTab`).
- Aggiornare questo paragrafo quando `AdminHomePage` diventa entrypoint o blocco dedicato.

---

## Servizio

**Sezione**: `section === 'servizio'` → `<ServizioPage />`  
**Stato**: placeholder — da implementare.

### File chiave

| File | Ruolo |
|------|-------|
| `src/pages/ServizioPage.tsx` | Entry point sezione |

### Obiettivo previsto

Gestione tavoli, sale, configurazione servizio (turni, capienza per slot, ecc.).

### Note per implementazione futura

- Schema DB: creare migrazione `007_*` o superiore (verificare ultimo numero in `supabase/migrations/`)
- Non toccare migrazioni già applicate
- Aggiornare questo paragrafo quando la pagina viene implementata

---

## Analytics

**Sezione**: `section === 'analytics'` → `<AnalyticsPage />`  
**Stato**: placeholder — da implementare.

### File chiave

| File | Ruolo |
|------|-------|
| `src/pages/AnalyticsPage.tsx` | Entry point sezione |

### Obiettivo previsto

Statistiche prenotazioni: trend, coperti per periodo, menu più richiesti, clienti abituali.

### Note per implementazione futura

- Query aggregate su `booking_requests` filtrate per `tenant_id` + range date
- Considerare query pesanti: paginare o aggregare lato Supabase con RPC
- Aggiornare questo paragrafo quando la pagina viene implementata

---

## Template — nuova sezione

Quando aggiungi una nuova pagina, copia questo blocco, sostituisci i placeholder e
rimuovi le note template.

```markdown
## [Nome sezione]

**Sezione**: `section === '[slug]'` → `<[Nome]Page />`  
**Stato**: [placeholder | in sviluppo | stabile]

### File chiave

| File | Ruolo |
|------|-------|
| `src/pages/[Nome]Page.tsx` | Entry point |
| `src/features/booking/hooks/use[Nome].ts` | Query dati |
| `src/features/booking/hooks/use[Nome]Mutations.ts` | Mutazioni (se presenti) |
| `src/types/[nome].ts` | Tipi specifici (se necessari) |
| `supabase/migrations/00N_[nome].sql` | Schema DB (se necessario) |

### Architettura dati

[Descrivi sorgenti dati, aggregazioni, tipi principali]

### Regole critiche

[Vincoli tecnici non ovvi: UUID, normalizzazioni, query key, trigger DB]

### State locale [Nome]Page

[Mappa gli stati React locali prima di modificare la pagina]

### Anti-pattern specifici

[Errori già commessi o prevedibili per questa sezione]
```

**Ricorda**: dopo aver aggiunto la sezione qui, aggiorna anche la tabella in `ADMIN_SHELL_SKILL.md`
(sezione "0. Prima cosa") per includere le parole chiave di rilevamento automatico.
