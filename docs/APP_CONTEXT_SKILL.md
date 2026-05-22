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
| **AdminDashboard / BookingCalendar / BookingForm / BookingsList / BookingDetailsModal / useBookingMutations / pagina admin classica / tab Calendario-Prenotazioni-Settings** | `docs/ADMIN_CLASSIC_SKILL.md` ⚠️ **OBBLIGATORIO PRIMA DI MODIFICARE** |
| AdminShell / sidebar / nav / sezioni / routing admin | `docs/Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md` |
| CRM / clienti / customer / useCustomers / CustomerProfile | `docs/Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md` |
| Edition / FEATURES flag / useFeatures / features.sidebar / buildFeatures | `docs/APP_CONTEXT_SKILL.md` § 2 + `src/config/features.ts` + `src/hooks/useFeatures.ts` |
| UI / className / Tailwind / layout / componenti / tema / colori / index.css | `docs/per-ui-design-skill/UI_EDIT_SKILL.md` |
| **Responsive / breakpoint / mobile / grid che collassa / padding-gap adattivi / max-width container / contenuto pagina vs sidebar** | `docs/per-ui-design-skill/UI_RESPONSIVE_SKILL.md` |
| DB / schema / migrazioni / RLS / policy / tabelle / trigger / tipi database.ts | `docs/Database-Skill/DB_SKILL.md` |
| Task che tocca admin classica + qualsiasi altra cosa | **ADMIN_CLASSIC sempre + skill area** |
| Task che tocca sia layout shell che stile Tailwind | **entrambi** ADMIN_SHELL + UI_EDIT |
| Task responsive che tocca il comportamento sidebar/overlay | **entrambi** UI_RESPONSIVE + ADMIN_SHELL |
| Task che tocca sia DB che UI o shell | **entrambi** DB + skill area corrispondente |
| **data/ora prenotazioni / dateUtils / createBookingDateTime / extractTimeFromISO / desired_time / confirmed_start / orario display** | `docs/ADMIN_CLASSIC_SKILL.md` §4b — leggere **prima** di toccare qualsiasi logica orario |
| **Test / Vitest / Playwright / staging Supabase / CI / copertura** | `docs/Testing-Skill/TESTING_SKILL.md` |
| Non è chiaro di quale area si tratti | Leggi `CLAUDE.md`, poi usa questa tabella |

Carica il skill indicato **prima** di aprire qualsiasi file da modificare.

> **Regola sub-task**: ogni volta che un agente scompone il lavoro in sotto-task (a se stesso o a un sub-agente), deve ripetere questa domanda per ciascun sotto-task. Un task iniziale fuori dall'area booking può diventare un sub-task che tocca `useBookingMutations` o `dateUtils` — in quel momento scatta l'obbligo di caricare lo skill corrispondente prima di procedere. "L'ho già letto all'inizio" non è sufficiente se il sotto-task cambia area.

---

## 1. Due aree dell'app

| Area | Entry point | Client Supabase | Session |
|------|-------------|-----------------|---------|
| **Pubblica** — form prenotazione clienti | Route con slug tenant | `supabasePublic` | no |
| **Admin** — dashboard ristoratore | `/admin` → `AdminShell` | `supabase` | sì (localStorage) |

Non mischiare mai i due client. `supabase` è per operazioni admin autenticate; `supabasePublic` è per form pubblici anonimi.

---

## 1b. ⚠️ Ambiente DB attivo: SERVER DI TEST

**Tutto lo sviluppo (migrazioni, RPC, query manuali, rigenerazione tipi) va fatto sul server di TEST, mai su produzione.**

| Ambiente | Project ref | URL | MCP tool da usare |
|----------|-------------|-----|-------------------|
| **TEST** ← usare sempre | `docnnernvp` | `docnnernvpyrbwuzzach.supabase.co` | `Supabase_test__*` |
| PRODUZIONE — non toccare | `rwuxgvld` | `rwuxgvldzrkabglkasym.supabase.co` | `Supabase__*` (solo lettura, su richiesta esplicita) |

- Prima di `apply_migration` / `execute_sql` / `generate_typescript_types`: chiamare `get_project_url` e **verificare che risponda `docnnernvp`**. Se risponde `rwuxgvld` è produzione → fermarsi.
- `supabase db push` da CLI non è disponibile in questo ambiente: applicare le migrazioni via MCP `Supabase_test__apply_migration`.
- I due DB si disallineano nella numerazione migrazioni (es. sul test le RPC jsonb sono in `021_service_slot_rpcs_jsonb`, su prod in `018/020/021` separate). Allinearsi sempre allo stato del **test** con `Supabase_test__list_migrations`.
- Il file in `supabase/migrations/` resta la fonte versionata; la migrazione va comunque scritta lì oltre che applicata via MCP sul test.

---

## 2. Mappa routing admin

Il routing admin è **state-based** (nessun cambio URL). `AdminShell.tsx` gestisce uno stato `section` e monta il componente corretto.

**Il comportamento varia in base all'edition del tenant** (letto da `useFeatures()`):

| Edition | Section default | Layout |
|---------|----------------|--------|
| `classic` | `'prenotazioni'` | Nessuna sidebar — AdminDashboard standalone |
| `pro` / `enterprise` | `'home'` | Sidebar completa + sezioni avanzate |

| `section` | Componente montato | Visibile in |
|-----------|-------------------|-------------|
| `'home'` ← DEFAULT Pro | `<AdminDashboard bodyOverride={<AdminHomePage />} />` | Pro, Enterprise |
| `'prenotazioni'` ← DEFAULT Classic | `<AdminDashboard />` | tutte le edition |
| `'crm'` | `<CrmPage />` | Pro, Enterprise |
| `'servizio'` | `<ServizioPage />` | Pro, Enterprise |
| `'analytics'` | `<AnalyticsPage />` | Pro, Enterprise |

**Nota sezione Home**: AdminDashboard viene sempre montata anche per `section='home'`. AdminHomePage viene passata come `bodyOverride` — Header e 5 NavItem restano visibili. Cliccando un NavItem da Home, la sezione passa a `'prenotazioni'`.

File di dettaglio per ogni sezione: `docs/Dashboard-laterale-skill/ADMIN_PAGES_CONTEXT.md`.

---

## 3. Struttura cartelle src/

```
src/
├── components/layout/   AdminShell.tsx
├── components/ui/       Button, Input, Modal, Card, Badge, Alert, EmptyState, Spinner…
├── config/              features.ts  ← buildFeatures(edition) → FeatureFlags
├── contexts/            TenantContext.tsx  ← LOCKED (eccezione: campo edition)
├── features/booking/
│   ├── components/      componenti dashboard (BookingCalendar, CRM, ecc.)
│   ├── hooks/           useAdminAuth, useBookingMutations, useCustomers, ecc.
│   ├── lib/             restaurantSettingRegistry
│   └── utils/           helper puri (date, prezzi)
├── hooks/               useFeatures.ts, useBusinessHours.ts, useRateLimit.ts…
├── lib/                 supabase.ts, supabasePublic.ts, email.ts, logger.ts, utils.ts
├── pages/               AdminDashboard, AdminHomePage, CrmPage, ServizioPage, AnalyticsPage…
├── router.tsx           ← solo su esplicita richiesta
└── types/               database.ts (generato), booking.ts, customer.ts, edition.ts
```

---

## 4. Invarianti globali — valgono in ogni task, in ogni file

```
LOCK  CollapsibleCard.tsx          — 57 test — mai toccare
LOCK  Modal.tsx  z-[10050]         — stack calibrato con Toast z-100000
LOCK  TenantContext.tsx            — core multi-tenancy — MAI (eccezione: campo edition)
LOCK  src/lib/supabase.ts          — client autenticato — MAI
LOCK  supabase/migrations/         — DB remoto già applicato — MAI
LOCK  src/router.tsx               — solo su esplicita richiesta

LOCK  ADMIN CLASSICA — vedi docs/ADMIN_CLASSIC_SKILL.md
      • src/pages/AdminDashboard.tsx
      • src/features/booking/components/BookingCalendar.tsx
      • src/features/booking/components/BookingForm.tsx
      • src/features/booking/components/BookingsList.tsx
      • src/features/booking/components/BookingDetailsModal.tsx
      • src/features/booking/components/RestaurantSettingsTab.tsx
      • src/features/booking/hooks/useBookingMutations.ts
      • src/features/booking/hooks/useCustomers.ts (parte base)

      → Prima di toccare uno di questi file l'agente DEVE produrre
        spiegazione preventiva (5 punti) e attendere conferma utente.
        Vedi sezione 0 di ADMIN_CLASSIC_SKILL.md.

RULE  Prima di modificare: leggere INTERO il file da toccare + i file collegati
      necessari (chiamanti, tipi, componente condiviso). MAI editare avendo
      letto solo il frammento restituito da grep/search. Spendere token in
      lettura completa previene fix a pezzi e bug a catena.
RULE  Sidebar features non importano da admin classica senza interfacce pubbliche
RULE  Nuove feature in admin classica SEMPRE dietro FEATURES flag — usare useFeatures(), mai ADMIN_FEATURES hardcoded
RULE  Prop aggiunte ad AdminDashboard sempre OPTIONAL con default sensati
RULE  Edition Classic = !features.sidebar → AdminShell fa return anticipato, nessuna sidebar
RULE  Per aggiungere una feature gated: 1) flag in FeatureFlags+buildFeatures 2) featureKey in SIDEBAR_NAV_ITEMS 3) gating nel render

RULE  walk_in_max_guests: range 0–500 (0 = nessun walk-in accettato), campo opzionale. email/phone contatto opzionali — validati solo se compilati. Validazione in `restaurantSettingRegistry.ts`.
RULE  Selettore orario: UNICO componente `TimePicker24h` (pubblico+admin), minuti liberi 0-59, prop `compact` per form pubblico — `TimeInput` ELIMINATO, non reintrodurre input nativo type="time"
RULE  Avviso orario notturno (fine < inizio): testo unico `OVERNIGHT_TIME_END_HINT` in `bookingTimeSlots.ts` — mostrarlo nel modal CRUD fascia (Servizio) e nella sezione Classic «Imposta Fasce Orarie» (`RestaurantSettingsTab`, `!features.servizio`); **non** usare sigle inline tipo `(notturna +1)` nelle liste fasce Pro
RULE  Modal CRUD fascia (`ServiceSlotsManager` / `SlotModal`): `FormInfoToggle` (icona + «?») apre `FormInfoPanel` blu (`border-blue-200` / `bg-blue-50` / `text-blue-800`) con chiusura ✕; menu durata senza «Quando?» — etichetta scope (`Sempre`, …); scope `forever` = solo `service_slots`
RULE  Assegnazione tavoli (Servizio → `AssignmentMapPanel`): elenco prenotazioni non assegnate filtrato per **ora di inizio** dentro `start_time`–`end_time` della fascia selezionata — `bookingStartsInServiceSlot` (`serviceSlotBookingFilter.ts`) + `isTimeInsideSlot`; non usare overlap durata prenotazione; orari fascia da `service_slots` (non override runtime)
RULE  Libera tavolo (`useCheckoutTable`): prenotazione liberata torna in elenco PRENOTAZIONI; senza turno successivo attivo sul tavolo → DELETE assignment; con turno 2+ in coda → UPDATE `checked_out_at` — vedi `ADMIN_PAGES_CONTEXT.md` § Assegnazione tavoli
RULE  Assegnazione/riassegnazione rapida da Calendario (`QuickTableAssignModal`, solo Pro `hasTurnsFeature`): pallino grigio → assign, pallino verde → dialog conferma + `useReleaseBookingAssignment` (libera per `booking_id`) → poi flusso sala/tavolo identico; se turni in coda → avviso bloccante senza modifica DB; query key condivisa `TABLE_ASSIGNMENTS_QUERY_KEY`
RULE  Promo menù in Prenota (`MenuPricesTab`, `booking_vol_au_vent_promos`): visibilità solo con occhio per riga (`visible_on_booking`); filtro per `booking_type` nel form — non usare `booking_vol_au_vent_promo_visible` in UI banner
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
npm run test          # Vitest — tutti devono passare (mappa in TESTING_CONTEXT.md)
npm run validate      # lint + typecheck + test (usare pre-PR)
```

---

## 6. Convenzioni

- **Comunicazione con l'utente**: leggi `docs/COMUNICAZIONE_UTENTE_SKILL.md` **all'inizio di ogni sessione** — contiene le regole su come rispondere a Matteo (breve, nomi dinamici, no gergo). Questa regola vale per ogni skill.
- **Logger**: `logger.debug/info/warn/error` da `src/lib/logger.ts` — mai `console.log`
- **TanStack Query**: query server-state nei hook in `src/features/booking/hooks/`
- **Commit**: `feat(scope):` · `fix(scope):` · `update(scope):`
- **Import alias**: `@/` → `src/`

---

## 7. Obbligo fine sessione — Report + Allineamento skill

Al termine di ogni sessione di lavoro l'agente DEVE:

### 7.1 Scrivere il report

Creare un file `Report-*.md` in `docs/Sessioni di lavoro/GG-MM-AA/` (creando la cartella se non esiste).

Il report deve contenere:
- Cosa è stato fatto (in ordine cronologico)
- File toccati e perché (linguaggio utente — non "ho modificato X" ma "ora Mario vede Y")
- Domande poste all'utente e risposte ricevute
- Test eseguiti e risultato (`npm run validate`)
- Cosa resta per la prossima sessione
- Eventuali deviazioni dal plan con motivazione

### 7.2 Allineare i file di skill

Dopo ogni modifica al codice che cambia l'architettura, le strutture dati o le regole d'uso, l'agente DEVE aggiornare i file di skill corrispondenti **nella stessa sessione**, non in una successiva.

**Regola**: se hai toccato un file → aggiorna il skill che lo documenta.

| Se hai modificato… | Aggiorna anche… |
|--------------------|-----------------|
| `AdminShell.tsx` (routing, sezioni, edition) | `ADMIN_SHELL_CONTEXT.md` |
| `AdminDashboard.tsx` (prop, tab, layout) | `ADMIN_CLASSIC_SKILL.md` sezione "stato attuale" |
| `TenantContext.tsx` | `APP_CONTEXT_SKILL.md` §4 invarianti |
| `src/config/features.ts` o `src/hooks/useFeatures.ts` | `APP_CONTEXT_SKILL.md` §2 e §4 |
| `supabase/migrations/` (nuova migrazione) | `docs/DATABASE.md` + `DB_MIGRATIONS_CONTEXT.md` + `DB_SCHEMA_CONTEXT.md` |
| Nuova pagina/sezione admin | `ADMIN_PAGES_CONTEXT.md` + `ADMIN_SHELL_CONTEXT.md` §7 |
| `AssignmentMapPanel` / `useTableAssignments` / `serviceSlotBookingFilter` | `ADMIN_PAGES_CONTEXT.md` § Servizio → Assegnazione tavoli |
| Struttura cartelle `src/` | `APP_CONTEXT_SKILL.md` §3 |
| Qualsiasi file LOCK | Aggiorna sezione "stato attuale" nello skill di area |

**Come verificare**: prima di chiudere la sessione, rileggere la lista LOCK in `ADMIN_CLASSIC_SKILL.md` §4 e confrontarla con i file toccati. Se c'è discrepanza, aggiornare.

**Aggiornare anche se il task era un sub-task**: se il sotto-task ha toccato file di un'area diversa da quella del task principale (es. task di debug UI che ha finito per modificare `useBookingMutations`), aggiornare lo skill dell'area realmente toccata — non solo quello del task originale.

| Se hai modificato… | Aggiorna anche… |
|--------------------|-----------------|
| `useBookingMutations.ts` / `useWalkInMutation.ts` / qualsiasi mutation che scrive `confirmed_start` o `desired_time` | `ADMIN_CLASSIC_SKILL.md` §4 + §4b |
| `dateUtils.ts` (createBookingDateTime, extractTimeFromISO, getAccurateStartTime) | `ADMIN_CLASSIC_SKILL.md` §4b + `TESTING_CONTEXT.md` se cambiano i test |
| `serviceSlotBookingFilter.ts` / logica filtro fascia in `useUnassignedBookings` | `ADMIN_PAGES_CONTEXT.md` § Servizio → Assegnazione tavoli + `TESTING_CONTEXT.md` se cambiano i test |
