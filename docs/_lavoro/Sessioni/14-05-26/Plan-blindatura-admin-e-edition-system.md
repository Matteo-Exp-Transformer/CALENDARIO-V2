# Plan — Blindatura Admin Classica + Sistema Edition

> **Data**: 2026-05-14
> **Branch**: `Sviluppo-Dashboard-laterale`
> **Obiettivo**: rendere la pagina admin classica un modulo blindato + introdurre un sistema di "edition" letto da Supabase che attivi/disattivi feature per tenant. Una sola codebase, interruttori centralizzati, protezione dati lato server.

---

## 1. Contesto e motivazione

L'app si sta evolvendo in due strati:

- **Admin Classica** (stabile, vendibile da sola): Header + NavItem button (Calendario/Prenotazioni/CRM tab/Settings/ecc.) + corpo pagina con i tab operativi storici.
- **Sidebar e sezioni avanzate** (CRM esteso, Servizio, Analytics, Home): nuovo strato sopra Admin Classica, attivabile per edition.

L'obiettivo commerciale è poter vendere **versioni differenziate** della stessa app a clienti diversi, decidendo da Supabase chi ha cosa, senza ribuildare o duplicare codice.

### Stato attuale verificato (audit del 14-05-26)

- **AdminDashboard.tsx**: ha subito un refactor di integrazione (commit `2de980b`) per stare dentro AdminShell. Layout `min-h-0 flex-1`, prop `restaurantSettingsSignal`, rimosso pulsante "Form Pubblico", tema gestito da AdminShell. Logica core (calendario, tab, form, mutations) **intatta**.
- **BookingCalendar.tsx**: +190 righe, feature opt-in (walk-in, no-show, badge "Da assegnare", DigestTurnNav). Backward compatible.
- **useBookingMutations.ts**: aggiunte invalidazioni `HOME_STATS_QUERY_KEY` e `ANALYTICS_QUERY_ROOT`. No-op nelle edition senza quelle feature.
- **BookingDetailsModal.tsx**: nuovo bottone "No-show" condizionale.
- **Nessuna regressione critica**.

### Bug noto da fixare subito (Fase 0)

Quando l'utente clicca "Home" nella sidebar, la pagina Home **prende tutta la zona admin** coprendo Header e NavItem button. Il comportamento desiderato è che Home **lasci visibili Header + NavItem** in alto, mostrandosi solo come contenuto del corpo.

Le altre sezioni (Prenotazioni/CRM/Servizio/Analytics) coprono correttamente tutto.

---

## 2. Architettura target

### 2.1 Edition come campo Supabase

Aggiungere alla tabella `tenants` (o equivalente):

```
edition: 'classic' | 'pro' | 'enterprise'   -- default 'pro' per retro-compatibilità
```

**Flusso utente:**
> Tu in Supabase imposti `tenant.edition = 'classic'` per il cliente Mario. Mario fa login, l'app legge l'edition dal TenantContext, deriva i FEATURES (sidebar OFF, crm OFF, ecc.) e mostra solo la versione base. Se domani upgrade, cambi una riga, Mario ricarica, vede tutto.

### 2.2 File `src/config/features.ts`

Singolo file che riceve `edition` e restituisce un oggetto interruttori:

```ts
// pseudo-codice, da implementare in Fase 2
export const buildFeatures = (edition: TenantEdition): FeatureFlags => ({
  sidebar:          edition !== 'classic',
  home:             edition !== 'classic',
  crm:              edition === 'pro' || edition === 'enterprise',
  analytics:        edition === 'pro' || edition === 'enterprise',
  servizio:         edition === 'pro' || edition === 'enterprise',
  walkIn:           edition === 'pro' || edition === 'enterprise',
  noShow:           edition === 'pro' || edition === 'enterprise',
  tableAssignments: edition === 'pro' || edition === 'enterprise',
  // ...
});
```

### 2.3 Lettura tramite `useFeatures()` hook

Hook che ritorna `FEATURES` derivato dall'edition del tenant corrente. I componenti leggono così:

```tsx
const features = useFeatures();
if (features.sidebar) { /* mostra sidebar */ }
```

### 2.4 Protezione dati lato Supabase (RLS)

Row Level Security policies sulle tabelle delle feature avanzate (`customers`, `service_slots`, `booking_table_assignments`, ecc.) che controllano `tenants.edition` e rifiutano query se il tenant non ha l'edition richiesta.

**Esempio in chiaro:**
> Cliente Classic apre devtools, modifica codice per "sbloccare" la pagina CRM. Carica la UI ma quando la UI chiede dati a Supabase, RLS controlla `tenants.edition='classic'`, vede che CRM non è incluso, rifiuta. Risultato: pagina vuota, zero dati esposti.

### 2.5 Lazy loading dei moduli pesanti

Le pagine CRM/Servizio/Analytics/Home vengono importate con `React.lazy()` e caricate solo se il loro flag è ON. Risultato: cliente Classic non scarica mai quel codice.

---

## 3. Piano operativo — 7 fasi

### Fase 0 — Fix bug Home (1-2 ore)

**Obiettivo**: Home mostra Header + NavItem button in alto, contenuto Home sotto.

**File toccati**:
- `src/components/layout/AdminShell.tsx` — switch sezione `'home'`
- Possibilmente `src/pages/AdminHomePage.tsx` — layout interno

**Strategia**: invece di sostituire AdminDashboard con AdminHomePage quando `section='home'`, montare AdminDashboard sempre e passargli AdminHomePage come "contenuto corpo" per quel caso. Da valutare in dettaglio leggendo i file.

**Da chiarire con l'utente** (prima della fase):
- Quando l'utente è su Home e clicca un NavItem button (es. "Calendario"), si sposta sul tab corrispondente di AdminDashboard?
- Al ricaricamento, di default vede Home o Calendario (tab default attuale)?

**Test manuale**: aprire `/admin`, cliccare Home, verificare che Header + 5 tab restino visibili sopra il contenuto Home.

---

### Fase 1 — Aggiornare skill con LOCK list e regole agenti (1 ora)

**Obiettivo**: cristallizzare lo stato attuale come "intoccabile senza giustificazione", in linguaggio utente.

**File da aggiornare**:
- `docs/APP_CONTEXT_SKILL.md` — aggiungere sezione "Admin Classica blindata"
- `docs/Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md` — aggiungere regola separazione admin-classica/sidebar

**File nuovo da creare**:
- `docs/ADMIN_CLASSIC_SKILL.md` — skill dedicato con LOCK list spiegata in linguaggio utente

**Contenuto LOCK list** (in `ADMIN_CLASSIC_SKILL.md`):

Per ogni file critico, formato:
```
### `src/pages/AdminDashboard.tsx` — LOCK strutturale
**Perché è bloccato**: è la pagina che vedono i clienti della versione Classic senza sidebar.
**Cosa si rompe se la tocchi**: un ristoratore con versione Classic apre la dashboard la mattina, prova a vedere le prenotazioni del giorno, e la pagina è bianca o si comporta in modo strano. Non ha CRM, non ha sidebar, ha solo questo: se rompi questo, rompi il prodotto base.
**Modifiche permesse**: solo via prop (passare nuovi parametri) o wrapper esterno. Logica interna intoccabile.
**Modifiche vietate**: rimuovere tab, cambiare logica calendario/form/mutations, hardcodare feature avanzate dentro la pagina.
```

Lista completa dei file da inserire:
- `src/pages/AdminDashboard.tsx`
- `src/features/booking/components/BookingCalendar.tsx`
- `src/features/booking/components/BookingForm.tsx`
- `src/features/booking/components/BookingsList.tsx`
- `src/features/booking/components/BookingDetailsModal.tsx`
- `src/features/booking/components/RestaurantSettingsTab.tsx`
- `src/features/booking/hooks/useBookingMutations.ts`
- `src/features/booking/hooks/useCustomers.ts` (parte usata da CRM tab classico)
- `src/contexts/TenantContext.tsx` (già LOCK assoluto)
- `src/lib/supabase.ts` / `supabasePublic.ts` (già LOCK)

**Regola separazione sidebar/admin classica**:
> Le feature sidebar (CRM esteso/Servizio/Analytics/Home) NON devono:
> 1. Importare codice da `admin-core` (in futuro cartella separata)
> 2. Modificare hooks booking core senza gating via FEATURES flag
> 3. Aggiungere prop obbligatorie ad AdminDashboard o ai suoi sotto-componenti senza wrapper compatibile

**Regola agenti — obbligo di spiegazione preventiva**:

Sezione esplicita negli skill:
> **Prima di modificare qualsiasi file LOCK o file "core booking" (admin classica), l'agente DEVE:**
> 1. Elencare i file coinvolti (path completo)
> 2. Spiegare in linguaggio utente cosa fa ciascun file ("questa è la pagina che il ristoratore vede quando...")
> 3. Descrivere un flusso di utilizzo reale che mostra perché il cambio è necessario ("Mario apre l'app, clicca X, oggi succede Y, dovrebbe succedere Z")
> 4. Indicare quale edition è impattata
> 5. Chiedere conferma all'utente prima di scrivere codice
>
> Senza queste 5 cose, l'agente NON modifica file admin classica.

---

### Fase 2 — Sistema edition (2-3 ore)

**Obiettivo**: l'app legge edition da Supabase, deriva FEATURES, AdminShell rispetta `FEATURES.sidebar`.

**File toccati / nuovi**:
- `supabase/migrations/013_tenants_edition.sql` — nuovo, aggiunge campo `edition` con default `'pro'`
- `src/types/database.ts` — rigenerato
- `src/types/edition.ts` — nuovo, tipo `TenantEdition`
- `src/config/features.ts` — nuovo, `buildFeatures(edition)` e tipo `FeatureFlags`
- `src/contexts/TenantContext.tsx` — **modifica controllata**: aggiungere lettura `edition` (campo aggiunto, no logica esistente toccata)
- `src/hooks/useFeatures.ts` — nuovo hook che ritorna FEATURES correnti
- `src/components/layout/AdminShell.tsx` — gating `FEATURES.sidebar`: se OFF, monta solo AdminDashboard a piena pagina senza cornice sidebar

**Wrapper per AdminDashboard in modalità standalone (edition Classic)**:

Quando `FEATURES.sidebar` è OFF, AdminShell renderizza un layout semplice:
```
<div className="min-h-screen ...">
  <AdminDashboard restaurantSettingsSignal={0} />
</div>
```

Questo dà ad AdminDashboard l'altezza piena che le serve, senza bisogno di modificare AdminDashboard.tsx.

**Test manuale**:
1. Cambiare `edition` in Supabase a `'classic'` per un tenant di test
2. Login con quel tenant → verificare che sidebar non compare, AdminDashboard funziona da sola a piena pagina
3. Rimettere `edition='pro'` → sidebar ricompare

---

### Fase 3 — Gating feature interne (2-3 ore)

**Obiettivo**: i pezzi gated dentro AdminDashboard/BookingCalendar/BookingDetailsModal leggono FEATURES.

**File toccati**:
- `src/features/booking/components/BookingCalendar.tsx` — wrap walk-in icon, badge "Da assegnare", DigestTurnNav con `FEATURES.walkIn` / `FEATURES.tableAssignments`
- `src/features/booking/components/BookingDetailsModal.tsx` — wrap bottone No-show con `FEATURES.noShow`
- Eventuali altri pezzi gated identificati durante l'esecuzione

**Importante**: la costante `ADMIN_FEATURES` esistente (citata negli audit) va **unificata** o **rimpiazzata** dal nuovo sistema. Da decidere durante l'esecuzione dopo aver letto il codice.

**Test manuale**: con edition='classic' verificare che icone walk-in, bottone no-show, badge "Da assegnare" non appaiano.

---

### Fase 4 — RLS Supabase + lazy loading (3-4 ore)

**Obiettivo**: protezione dati lato server + ottimizzazione bundle.

**4a — RLS Supabase (bloccante per vendita Classic)**

Flusso utente:
> Oggi un dipendente di Mario (Classic) apre F12 nel browser, sblocca la UI del CRM coi devtools, vede la pagina CRM. Se prova a leggere clienti, il database glieli ridà comunque (oggi non c'è blocco). **Dato esposto senza pagare.**
> Con RLS: il dipendente sblocca la UI, vede la pagina vuota, perché Supabase controlla `organizations.edition` prima di ogni query e rifiuta se non `pro`/`enterprise`. **Zero dati esposti.**

Lavoro tecnico:
- Migrazione nuova (`014_rls_edition_gates.sql`) con policies su:
  - `customers` (CRM esteso)
  - `service_slots` (Servizio fasce orarie)
  - `booking_table_assignments` (assegnazione tavoli)
  - `rooms` (sale per layout)
  - `tables` (tavoli per layout — verificare se già protette)
  - Eventuali altre tabelle Pro-only identificate durante esecuzione
- Policy esempio:
  ```sql
  CREATE POLICY "customers_edition_gate" ON customers
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM organizations
        WHERE organizations.id = customers.organization_id
          AND organizations.edition IN ('pro', 'enterprise')
      )
    );
  ```
  (Adattare nome FK in base a schema reale: `organization_id` o `tenant_id`)
- Verificare RLS esistenti non vengano sovrascritte — usare CREATE POLICY (non REPLACE)
- Test SQL diretto: con un tenant Classic, query a `customers` deve ritornare 0 righe anche con SELECT * FROM customers

**4b — Lazy loading (ottimizzazione bundle)**

Flusso utente:
> Mario (Classic) apre l'app la mattina su 4G. Oggi scarica ~900 KB di codice, inclusi CRM/Analytics/Servizio che non vedrà mai. Tempo: ~3s.
> Con lazy loading: scarica solo ~400 KB del core. Tempo: ~1.5s. Il codice delle feature Pro **esiste** sul server ma viene scaricato solo se l'utente entra in quelle sezioni (e Classic non lo fa mai).

Lavoro tecnico:
- In `AdminShell.tsx`:
  - `const CrmPage = lazy(() => import('@/pages/CrmPage').then(m => ({ default: m.CrmPage })))`
  - Stesso pattern per `ServizioPage`, `AnalyticsPage`, `AdminHomePage`
  - Avvolgere il render con `<Suspense fallback={<Spinner />}>`
- AdminDashboard NON lazy (è il core, sempre scaricato)
- Verificare che bodyOverride (AdminHomePage in shell) funzioni anche con lazy

**Test Fase 4**:
- Edition Classic + devtools Network: il chunk CRM non deve apparire
- Edition Classic + tentativo manuale query customers via Supabase JS console: deve fallire / 0 risultati
- Edition Pro: tutto funziona come prima, primo click su CRM mostra Spinner brevissimo poi pagina

---

### Fase 5 — Fix cosmetici post-edition (1 ora)

**Obiettivo**: risolvere i 2 fix minori emersi nell'audit di supervisione.

**5a — Edge case logout (flash UI Pro)**

Flusso utente:
> Mario (Classic) clicca logout. Per una frazione di secondo, prima del redirect a login, l'app mostra la sidebar Pro (perché `clearTenant` resetta edition a `'pro'`). Flash visuale strano.

Lavoro tecnico:
- In `TenantContext.tsx`, modificare `clearTenant`:
  - Opzione A: reset a `'classic'` (più sicuro: nessuna feature flash)
  - Opzione B: tipo `TenantEdition | null` e `useFeatures()` ritorna tutto OFF se null
- Test manuale: logout di un tenant Classic → no flash sidebar. Logout di un tenant Pro → no comportamento errato.

**5b — Ottimizzazione login (2 query → 1)**

Flusso utente:
> Oggi `setTenantFromAdmin` fa due chiamate al database: prima `check_admin_email` (chi è questo utente?), poi SELECT su `organizations` (qual è la sua edition?). Su 4G lenta significa ~200-400ms in più al login di Mario.
> Dopo: una sola chiamata che ritorna tutto. Login più reattivo.

Lavoro tecnico:
- Migrazione nuova (`015_check_admin_email_with_edition.sql`):
  - Estendere RPC `check_admin_email` per includere `slug`, `name`, `edition` nel return
  - Mantenere backward compat: campi nuovi sono additivi
- In `TenantContext.tsx`: rimuovere la seconda SELECT su organizations, leggere tutto dal return RPC
- Test: login Mario, verificare in Network tab che ci sia una sola chiamata RPC e che edition arrivi correttamente

---

### Fase 6 — Test E2E Edition Classic (2-3 ore)

**Obiettivo**: garantire che la versione Classic resti funzionante nel tempo, anche dopo modifiche future. Senza test automatico, qualsiasi agente potrebbe romperla in silenzio.

**Test da scrivere** (Playwright, in `tests/e2e/`):

Test 1 — `edition-classic.spec.ts`:
> Setup: tenant di test con `edition='classic'`. Login.
> Assert:
> - Nessuna sidebar visibile
> - 5 NavItem button visibili (Calendario, Prenotazioni, Archivio, Menu, Impostazioni)
> - Click Calendario → mostra calendario
> - Click Prenotazioni → mostra lista pending
> - Nessuna icona walk-in nelle prenotazioni
> - Nessun bottone "No-show" nel modal dettagli prenotazione
> - Nessun badge "Da assegnare"

Test 2 — `edition-classic-data-protection.spec.ts`:
> Setup: tenant Classic + sblocco manuale UI CRM via JS injection.
> Assert: pagina CRM mostrata ma lista clienti vuota (RLS funziona).

Test 3 — `edition-upgrade.spec.ts`:
> Setup: tenant inizia Classic, durante test viene aggiornato a Pro via SQL diretto.
> Assert: dopo reload, sidebar appare, CRM accessibile.

**Documentazione**:
- Aggiungere sezione "Test Edition" in `docs/ADMIN_CLASSIC_SKILL.md`
- Comando: `npm run test:e2e -- --grep edition`

---

### Fase 7 — Cleanup finale

**Obiettivo**: rimuovere debiti tecnici accumulati durante l'implementazione.

**Lavoro**:
- Rimuovere `src/lib/adminFeatures.ts` (se non già rimosso nella sessione cleanup 15-05-26)
- Verificare nessun riferimento a `ADMIN_FEATURES` resta in codebase
- Rigenerare `database.ts` se necessario dopo le migrazioni 014/015
- `npm run validate` finale

---

## 4. Definition of Done

- [x] Fase 0: Home rispetta layout (Header+NavItem visibili)
- [x] Fase 1: skill aggiornati, LOCK list visibile, regola "spiegazione preventiva" agenti scritta
- [x] Fase 2: edition='classic' nasconde sidebar, AdminDashboard funziona standalone
- [x] Fase 3: feature interne gated rispettano FEATURES
- [x] Fase 4a: RLS rifiuta query a tabelle Pro da tenant Classic
- [x] Fase 4b: bundle CRM non scaricato in Classic (chunk separati nel build output)
- [x] Fase 5a: nessun flash UI Pro durante logout di tenant Classic
- [x] Fase 5b: login fa una sola query DB (RPC esteso)
- [x] Fase 6: 3 test E2E Edition Classic scritti (.skip se staging non configurato)
- [x] Fase 7: cleanup completo, zero residui ADMIN_FEATURES
- [x] `npm run validate` passa (29/29 test, lint 0, typecheck 0)
- [x] `npm run test:e2e -- --grep edition` → test scritti, .skip senza staging configurato
- [x] Report finale documentato sotto `docs/Sessioni di lavoro/14-05-26/`

---

## 5. Rischi e mitigazioni

| Rischio | Mitigazione |
|---------|-------------|
| TenantContext è LOCK ma serve modificarlo | Aggiungere SOLO il campo `edition` letto; nessuna modifica a logica esistente. Documentare nella PR. |
| RLS policies bloccano anche admin Pro per errore | Test su tenant di staging prima di deploy produzione |
| Lazy loading rompe routing/state | Test manuale completo navigazione sidebar prima di mergere |
| Edition non sincronizzata tra sessioni dopo upgrade | Refresh forzato del TenantContext al cambio edition (in futuro: realtime subscription) |

---

## 6. Upgrade futuri fuori scope di questo plan

Pianificati ma non parte di questo plan operativo:

- **UI Super-Admin per gestire edition tenant** — pannello dedicato per cambiare edition dei clienti senza Supabase Studio. Vedi `docs/Upgrade-da-Fare/UI-super-admin-edition.md`. Da affrontare quando i tenant superano i 30 o cambi edition diventano frequenti.

---

## 7. Note finali

- L'audit del 14-05-26 conferma che il branch attuale è **operativo** e **non regressivo** rispetto a main.
- Questo plan trasforma una situazione "già funzionante ma fragile" in una "blindata e scalabile commercialmente".
- Le 7 fasi sono indipendenti: ognuna può fermarsi e dare valore da sola.
- Ordine consigliato: 0 → 1 → 2 → 3 → cleanup 15-05-26 → 4 → 5 → 6 → 7.
- **Bloccante commerciale**: la Fase 4a (RLS) deve essere completata prima di vendere realmente la versione Classic a clienti veri.
