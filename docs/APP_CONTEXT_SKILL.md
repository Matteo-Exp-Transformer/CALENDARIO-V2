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

> ℹ️ **Commit su `docs/` — normale.** Dopo lo split repo (giugno 2026) questa repo è **privata**
> e `docs/` non è più gitignored: i file `docs/` si committano con `git add` normale, senza `-f`.
> Il codice app pubblico vive nella repo separata **PrenotaZen** (sync a milestone). Solo
> `docs/_lavoro/` resta gitignored (privato personale).

## 0. Prima cosa: instrada al skill corretto

> **Passo-zero opzionale — filtro d'ingresso.** Se Matteo dice «prepara» / «prepara prompt» e descrive un lavoro grezzo, carica `docs/PREPARA_PROMPT_SKILL.md`: non si esegue il task, si produce un prompt ottimizzato per l'agente di lavoro (con filtro su rischi e ambiguità). L'agente di lavoro vero parte poi da questo § 0.0 con il prompt già pronto.

### 0.0 Scegli il profilo di ingresso

Prima di scendere alla tabella delle aree, capisci **che tipo di task** stai per fare e scegli un profilo. Il profilo riduce il contesto che carichi a inizio sessione: non leggi skill fuori dal tuo profilo.

| Profilo | Tipo di task | Termini di Matteo (Liv. 1) | Carica | Salta |
|---------|--------------|----------------------------|--------|-------|
| **Esecuzione** | nuove feature · piccoli fix · responsive design | «implementa» · «sistema» · «fai» · «nuova feature» · «aggiungi» · «crea» | skill dell'**area pertinente** (tabella § 0 sotto) + UI (`UI_EDIT` / `UI_RESPONSIVE` se tocca layout/stile) | Testing-Skill, debug, comunicazione-revisione |
| **Verifica** | debug · testing · revisione piani · revisione esecuzione | «revisiona» · «controlla» · «verifica» · «debugga» · «trova il bug» · «non funziona» | `docs/Testing-Skill/TESTING_SKILL.md` (**§7 protocollo QA manuale obbligatorio**: `npm run validate` + stessi test funzionali su viewport **375 / 834 / 1280** + tabella esiti nel report) + skill **dell'area che stai revisionando** + `UI_RESPONSIVE_SKILL.md` se layout/breakpoint | comunicazione-revisione |
| **Meta** | revisione/miglioramento sistema comunicazione | «migliora comunicazione» · «aggiorna comunicazione» | **solo** `docs/COMUNICAZIONE_UTENTE_SKILL.md` + `docs/Comunicazione-Skill/REVISIONE.md` | tutte le skill di area/codice/DB/UI |

I profili non si sovrappongono — il discriminante è **cosa produce il task**: Esecuzione produce/modifica codice di una feature; Verifica controlla codice o piani già prodotti (sempre con i test); Meta lavora sul sistema documentale e sulla comunicazione, non sul codice dell'app. Coerenza con i due ruoli di § 7.0: Esecuzione e Verifica sono **agente di lavoro**, Meta è **agente revisore** (sessione dedicata).

**Identificato il profilo, scendi alla tabella § 0 e applica solo le righe pertinenti al profilo.** Non caricare skill fuori dal profilo.

> ⚠️ **I LOCK battono il profilo.** Le righe marcate **OBBLIGATORIO** nella tabella § 0 (`ADMIN_CLASSIC_SKILL.md`, `docs/Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md`) e la regola orari § 4b (`dateUtils`) valgono **sempre**: se il task tocca quei file vanno caricate anche in un fix "piccolo" del profilo Esecuzione. Il profilo riduce il contesto, non scavalca i LOCK.

> **Termini → profilo.** I termini nella colonna sopra sono il riferimento rapido; la fonte autorevole (con livello e comportamento) è `docs/Comunicazione-Skill/VOCABOLARIO.md`. Il **profilo** è solo uno smistatore e non ha livello; il **termine** sì. Se Matteo non usa un termine mappato, scegli il profilo per descrizione del task. Nuovi termini partono candidati in `docs/Comunicazione-Skill/PROPOSTE.md` finché non approvati.

---

Leggi il task ricevuto e applica questa tabella:

| Il task riguarda… | Skill da caricare |
|-------------------|-------------------|
| **Area Admin autenticata completa / pagina admin / dashboard ristoratore / mappatura o blindatura Admin / lavoro multi-area su `/admin`** | **`docs/Admin-Skill/ADMIN_SKILL.md`** (entry point area: senso + mappa) + `docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md` se il task riguarda blindatura/test/sub-agent. Per file LOCK storici restano obbligatorie anche le righe specifiche sotto. |
| **AdminDashboard / BookingCalendar / AdminBookingForm / BookingRequestForm / PendingRequestsTab / ArchiveTab / BookingRequestCard / BookingDetailsModal / useBookingMutations / pagina admin classica / tab Calendario-Prenotazioni-Settings** | `docs/ADMIN_CLASSIC_SKILL.md` ⚠️ **OBBLIGATORIO PRIMA DI MODIFICARE** |
| AdminShell / sidebar / nav / sezioni / routing admin | `docs/Admin-Skill/ADMIN_SHELL_SKILL.md` (+ `ADMIN_SKILL.md` se task ampio) |
| CRM / clienti / customer / useCustomers / CustomerProfile | `docs/Admin-Skill/ADMIN_SHELL_SKILL.md` step 0 → `contesto/ADMIN_CRM_CONTEXT.md` |
| Edition / FEATURES flag / useFeatures / features.sidebar / buildFeatures | `docs/APP_CONTEXT_SKILL.md` § 2 + `src/config/features.ts` + `src/hooks/useFeatures.ts` |
| **TenantContext / useFeatures / edition / tenant_features / login / auth / feature flag / featureOverrides** | `docs/DATA_FLOW_SKILL.md` — flusso identitario end-to-end |
| **Edition / pricing / add-on / vendita / cliente / pacchetto / commerciale / feature_key / bundle** | `docs/Marketing-Skill/MARKETING_SKILL.md` |
| **tenant_features** (tabella DB, RPC, override) | `docs/Database-Skill/DB_SKILL.md` + `docs/DATA_FLOW_SKILL.md` |
| **Menu QR pubblico / QR code / foto piatti / pagina mobile menu / menu digitale** | **`docs/Menu-QR-Skill/MENU_QR_SKILL.md`** (entry point area — senso + flusso + divieti + mappa verso `contesto/*`) |
| **Pagina Prenota v2 / BookingRequestPage / BookingRequestForm / card tipologia / sidebar riepilogo / BookingModeCards / BookingSubTabCards / booking_public_form_config / sub_tabs / layout striscia / sfondo / caselle form** | **`docs/Prenota-Skill/PRENOTA_SKILL.md`** (entry point area — senso + mappa verso i file di dettaglio) + `UI_RESPONSIVE_SKILL.md` + `UI_EDIT_SKILL.md`. |
| **Tab Menu admin / MenuPricesTab / form ingrediente / categorie menu / promo testuali / menù preselezionati (preset staff) / booking_menu_promos / booking_custom_staff_presets / limiti magazzino / toggle disponibilità / QR manager** | **`docs/Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md`** (+ `docs/Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md` se tocca il flusso dati resolver, `DB_SKILL.md` se tocca lo schema) |
| **PWA / service worker / aggiornamento app / cache / VitePWA / registerSW / vercel.json cache header / __APP_VERSION__** | **`docs/PWA_CONTEXT.md`** |
| **Flusso dati tab Menu ↔ Personalizza form ↔ Pagina Prenota / bookingFormResolver / field_overrides / SubTab.label legato a preset / "aggiorna solo se non personalizzato" / aggiunta campi a SubTab o BookingMode** | **`docs/Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md` OBBLIGATORIO** prima di qualsiasi modifica — spiega il resolver, gli invarianti, come estendere senza rompere. |
| **Layout pagina menu pubblica / card categorie / carosello / hero section / pill icone / testo su immagini / griglie / sfondi tema** | `docs/Menu-QR-Skill/contesto/MENU_QR_LAYOUT_CONTEXT.md` |
| UI / className / Tailwind / layout / componenti / tema / colori / index.css | `docs/per-ui-design-skill/UI_EDIT_SKILL.md` |
| **Responsive / breakpoint / mobile / grid che collassa / padding-gap adattivi / max-width container / contenuto pagina vs sidebar** | `docs/per-ui-design-skill/UI_RESPONSIVE_SKILL.md` |
| **BookingCalendar — layout tab Calendario, celle mese, titolo responsive, data su Oggi, padding tab** | **`docs/per-ui-design-skill/BOOKING_CALENDAR_LAYOUT_CONTEXT.md`** + `ADMIN_CLASSIC_SKILL.md` §4c |
| DB / schema / migrazioni / RLS / policy / tabelle / trigger / tipi database.ts | `docs/Database-Skill/DB_SKILL.md` |
| Task che tocca admin classica + qualsiasi altra cosa | **ADMIN_CLASSIC sempre + skill area** |
| Task che tocca sia layout shell che stile Tailwind | **entrambi** `docs/Admin-Skill/ADMIN_SHELL_SKILL.md` + UI_EDIT |
| Task responsive che tocca il comportamento sidebar/overlay | **entrambi** UI_RESPONSIVE + `docs/Admin-Skill/ADMIN_SHELL_SKILL.md` |
| Task che tocca sia DB che UI o shell | **entrambi** DB + skill area corrispondente |
| **data/ora prenotazioni / dateUtils / createBookingDateTime / extractTimeFromISO / desired_time / confirmed_start / orario display** | `docs/ADMIN_CLASSIC_SKILL.md` §4b — leggere **prima** di toccare qualsiasi logica orario |
| **Limite coperti / capienza / coperti massimi / posti / cap prenotazioni / slot pieni** | `docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md` (config admin: fasce orarie e capienze in `restaurant_settings`) + **`supabase/functions/create-booking/`** (edge server — validazione capienza lato server; sola lettura salvo WP dedicato) |
| **Test / Vitest / Playwright / staging Supabase / CI / copertura** | `docs/Testing-Skill/TESTING_SKILL.md` |
| **Privacy Policy / GDPR / DPA / cookie / registro trattamenti / data breach / "cose da fare per produzione" / conformità legale / configurazioni compliance Supabase (PITR, SSL, MFA)** | `docs/Legal-Production-Skill/LEGAL_PRODUCTION_SKILL.md` |
| **Come rispondere a Matteo / spiegazioni / report / fine sessione / vocabolario / "spiegamelo semplice"** | `docs/COMUNICAZIONE_UTENTE_SKILL.md` + supporto `docs/Comunicazione-Skill/` (VOCABOLARIO, OSSERVAZIONI, PROPOSTE). Agente di lavoro: applica vocabolario + raccoglie dati + report esaustivo. Caricala a inizio (se usi il vocabolario o fai domande) e a fine sessione. |
| **Revisione skill comunicazione / promuovere-regredire voci / valutare i dati raccolti / riformare lo skill system comunicazione** | `docs/Comunicazione-Skill/REVISIONE.md` — **sessione dedicata** col revisore, non in una chat di lavoro |
| **«report finale» / controverifica del lavoro complessivo / revisione imparziale di fine sessione** | `docs/Comunicazione-Skill/CONTROVERIFICA.md` — sub-agente imparziale (non ha eseguito il lavoro) che pesa report+diff vs prompt di Matteo e flusso dati/utente; emette verdetto + prompt grezzo per `prepara-prompt`. Profilo **Verifica**. |
| **Visione prodotto / perché una scelta / modello commerciale / roadmap / decisioni strutturali / dove trovo cosa** | `docs/Archivio/CONTESTO_PRODOTTO.md` — fonte di verità riassuntiva (no dati sensibili) |
| **Masterplan blindatura / masterplan allineamento / roadmap skill-codice / WP milestone AL-*** | `docs/MASTERPLAN_BLINDATURA.md` + `docs/MASTERPLAN_ALLINEAMENTO.md` — indice WP eseguibili; non sostituiscono le skill di area |
| **Follow-up / debito post-sessione / controlli rimandati / FU-NNN** | `docs/FOLLOW_UP.md` — collegare al report in `docs/Sessioni di lavoro/`; aggiornare a fine sessione (§7.1). Debito trasversale **fallback prod** → **FU-ALL-FALLBACK** + §4c. **Milestone lontana skill agenti tier avanzato** → **FU-ALL-TIER** + §4d. Agente **prepara-prompt**: ruolo attivo nel trovare follow-up (`docs/PREPARA_PROMPT_SKILL.md`). |
| **Skill system / agenti Cursor / Codex / contesto chat / entry point / tier modello** | `docs/FOLLOW_UP.md` **FU-ALL-TIER** + §4d (solo design, non implementare senza sessione Meta) |
| Non è chiaro di quale area si tratti | Leggi `CLAUDE.md`, poi usa questa tabella |

Carica il skill indicato **prima** di aprire qualsiasi file da modificare.

> **Regola sub-task**: ogni volta che un agente scompone il lavoro in sotto-task (a se stesso o a un sub-agente), deve ripetere questa domanda per ciascun sotto-task — **rivalutando sia il profilo di ingresso (§ 0.0) sia la riga della tabella**. Un task iniziale fuori dall'area booking può diventare un sub-task che tocca `useBookingMutations` o `dateUtils` — in quel momento scatta l'obbligo di caricare lo skill corrispondente prima di procedere. Allo stesso modo un sub-task di un'Esecuzione che diventa diagnosi passa al profilo **Verifica** e carica Testing-Skill. "L'ho già letto all'inizio" non è sufficiente se il sotto-task cambia area o profilo.

---

### 0.0b Mini-pack — ingresso rapido per area

Se conosci già l'area, leggi il **mini-pack** `*_MINI.md` **prima** della skill piena: meno token,
stessi LOCK via link (nessuna duplicazione). Il mini-pack ha sempre 5 sezioni — Trigger · Carica
subito · Divieti top-3 · Mappa file · LOCK (solo link). La tabella §0 sopra **non si duplica**: §0.0b
è solo una scorciatoia. Design: `Sessioni di lavoro/12-06-26/Design-wp-e1-mini-pack-area-12-06-26.md`.

| Area | Mini-pack | Skill piena |
|------|-----------|-------------|
| Pagina Prenota | `Prenota-Skill/PRENOTA_MINI.md` | `Prenota-Skill/PRENOTA_SKILL.md` |
| Menu QR | `Menu-QR-Skill/MENU_QR_MINI.md` | `Menu-QR-Skill/MENU_QR_SKILL.md` |
| Admin (shell + classica) | `Admin-Skill/ADMIN_MINI.md` | `Admin-Skill/ADMIN_SKILL.md` + `ADMIN_SHELL_SKILL.md` / `ADMIN_CLASSIC_SKILL.md` |
| Tab Menu admin (magazzino) | `Admin-Skill/ADMIN_MENU_MAGAZZINO_MINI.md` | `Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` |
| Database | `Database-Skill/DB_MINI.md` | `Database-Skill/DB_SKILL.md` |
| Marketing / edition | `Marketing-Skill/MARKETING_MINI.md` | `Marketing-Skill/MARKETING_SKILL.md` |
| Legale / produzione | `Legal-Production-Skill/LEGAL_MINI.md` | `Legal-Production-Skill/LEGAL_PRODUCTION_SKILL.md` |
| Testing | `Testing-Skill/TESTING_MINI.md` | `Testing-Skill/TESTING_SKILL.md` |

I profili **Esecuzione / Verifica / Meta** restano in §0.0 (il mini-pack non li sostituisce).

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

| Ambiente | Project ref | URL | Canale DB |
|----------|-------------|-----|-------------------|
| **TEST** ← usare sempre | `docnnernvp` | `docnnernvpyrbwuzzach.supabase.co` | MCP TEST configurato nell'ambiente agente |
| PRODUZIONE — non toccare | `rwuxgvld` | `rwuxgvldzrkabglkasym.supabase.co` | MCP PROD, sola lettura salvo conferma esplicita |

- Prima di `apply_migration` / `execute_sql` / `generate_typescript_types`: chiamare `get_project_url` e **verificare che risponda `docnnernvp`**. Se risponde `rwuxgvld` è produzione → fermarsi.
- Se l'ambiente agente non espone MCP TEST, fermarsi e seguire le istruzioni specifiche dell'agente (per Codex: `AGENTS.md`, sezione "Regola Codex per Supabase TEST"). Non trasformare scorciatoie locali in regola generale.
- `supabase db push` resta vietato.
- I due DB si disallineano nella numerazione migrazioni. Allinearsi sempre allo stato del **test** con il canale TEST autorizzato nell'ambiente agente.
- Il file in `supabase/migrations/` resta la fonte versionata; la migrazione va comunque scritta lì oltre che applicata sul test.

### 1b.1 Flusso branch + deploy (2 branch — deciso 30-05-26)

Solo **due branch** dopo la dismissione di `env/prod`:

```
env/test  →  sviluppo: qui si lavora e si testa (codice + DB test docnnernvp)
   │  merge quando una feature è pronta e validata
   ▼
main      →  PRODUZIONE: è il branch che Vercel pubblica come app reale
```

- **Vercel-produzione builda `main`** (project `calendario-v2`, team `matteos-projects-9122caa7`). Mergiare in `main` = pubblicare in produzione. Non esistono più `env/prod` né altri branch di rilascio. GitHub Pages pubblica solo `docs/` (Jekyll) → è documentazione, NON l'app: ignorarlo in diagnosi deploy.

> ⚠️ **Allineamento ha 3 dimensioni separate — è la causa #1 dei disallineamenti percepiti.**
> «Codice in produzione», «DB di produzione» e «cache del browser» si aggiornano con azioni diverse
> e indipendenti. Una feature può MANCARE in prod anche dopo commit/push/merge. Quando Matteo segnala
> «prod non aggiornata», **consultare attivamente i provider via MCP** prima di ipotizzare, in
> quest'ordine:
>
> 1. **Codice/git** → la feature è mergiata in `main`? (`git log main`)
> 2. **Deploy Vercel** → ultimo deploy `target=production` è `READY` sul commit giusto? (MCP Vercel
>    `list_deployments` / `get_project`). Stato `ERROR` = build fallito, prod mostra il precedente.
> 3. **DB** → migrazioni della feature applicate al Supabase PROD (`rwuxgvld`)? (`Supabase__list_migrations` vs `Supabase_test__`).
> 4. **Cache/PWA** → l'app ha un service worker (`registerType: 'prompt'`, non auto-update): dopo un
>    deploy la versione nuova subentra solo **chiudendo e riaprendo** il browser, o in incognito.
>    Sintomo tipico: **mobile vede il nuovo, desktop il vecchio, stesso link** = cache locale, non
>    deploy mancato. La console logga la versione attiva (`__APP_VERSION__` + commit): confrontarla.
>    Dettagli in `docs/PWA_CONTEXT.md`.
>
> Caso reale 30-05-26: tutto allineato (git+Vercel+DB), causa = cache PWA desktop. L'avviso Vercel
> «Production deployment differ from Project Settings» NON è un errore (settings cambiate dopo il deploy).

---

## 2. Mappa routing admin

Il routing admin ha **sotto-route leggere per la shell** e per le tab operative della dashboard.
`AdminShell.tsx` gestisce lo stato `section`, sincronizzato con `/admin/:adminSection`, e monta il
componente corretto. `AdminDashboard.tsx` sincronizza `activeTab` con gli URL tab per preservare
refresh/back.

**Il comportamento varia in base all'edition del tenant** (letto da `useFeatures()`):

| Edition | Section default | Layout |
|---------|----------------|--------|
| `classic` | `'prenotazioni'` | Nessuna sidebar — AdminDashboard standalone |
| `pro` / `enterprise` | `'home'` se `features.home=true`, altrimenti `'prenotazioni'` | Sidebar completa + sezioni abilitate |

| Path | Section |
|------|---------|
| `/admin` | Home se abilitata, altrimenti Prenotazioni |
| `/admin/calendario` | `'prenotazioni'`, tab Calendario |
| `/admin/prenotazioni` | `'prenotazioni'`, tab Prenotazioni |
| `/admin/archivio` | `'prenotazioni'`, tab Archivio |
| `/admin/menu` | `'prenotazioni'`, tab Menu |
| `/admin/impostazioni` | `'prenotazioni'`, tab Impostazioni |
| `/admin/crm` | `'crm'` se feature abilitata |
| `/admin/servizio` | `'servizio'` se feature abilitata |
| `/admin/analytics` | `'analytics'` se feature abilitata |

| `section` | Componente montato | Visibile in |
|-----------|-------------------|-------------|
| `'home'` ← DEFAULT Pro se abilitata | `<AdminDashboard bodyOverride={<AdminHomePage />} />` | Pro, Enterprise con `features.home=true` |
| `'prenotazioni'` ← DEFAULT Classic | `<AdminDashboard />` | tutte le edition |
| `'crm'` | `<CrmPage />` | Pro, Enterprise |
| `'servizio'` | `<ServizioPage />` | Pro, Enterprise |
| `'analytics'` | `<AnalyticsPage />` | Pro, Enterprise |

**Nota sezione Home**: AdminDashboard viene sempre montata anche per `section='home'`. AdminHomePage viene passata come `bodyOverride` — Header e 5 NavItem restano visibili. Cliccando un NavItem da Home, la sezione passa a `'prenotazioni'`.

**Header AdminDashboard — nav vs collapse nuova prenotazione**: i 5 tab in header (`nav` Calendario / Prenotazioni / …) non si nascondono mai, anche con il collapse «Inserisci Nuova Prenotazione» aperto sulla tab Prenotazioni. Con il form aperto si nascondono solo le sotto-righe contestuali del tab attivo (statistiche, filtri archivio, ecc.); il corpo lista richieste in `<main>` resta `hidden` finché il form è espanso (eccetto `bodyOverride` Home Pro).

File di dettaglio tecnico per ogni sezione shell: `docs/Admin-Skill/contesto/ADMIN_SHELL_PAGES_CONTEXT.md` (flussi prodotto → `ADMIN_SKILL.md` §7).

---

## 3. Struttura cartelle src/

```
src/
├── components/layout/   AdminShell.tsx
├── components/ui/       Button, Input, Modal, Card, Badge, Alert, EmptyState, Spinner…
├── config/              features.ts  ← buildFeatures(edition) → FeatureFlags
├── contexts/            TenantContext.tsx  ← LOCKED (eccezione: campo edition + featureOverrides)
├── features/booking/
│   ├── components/      componenti dashboard (BookingCalendar, CRM, MenuQrManager, MenuQrModal, ecc.)
│   │   ├── publicBooking/ componenti pagina Prenota pubblica (BookingModeCards, BookingSubTabCards, BookingPhotoStrip, BookingSummarySidebar) — NB: BookingRequestPage.tsx vive in src/pages/
│   │   └── settings/    BookingFormConfigPanel, SettingsSaveUi (footer/barre sezione Impostazioni)
│   ├── hooks/           useAdminAuth, useBookingMutations, useMenuQrCodes, useCustomers, ecc.
│   ├── lib/             restaurantSettingRegistry
│   ├── services/        bookingFormResolver, syncMenuCategoryKeyRename/Delete, …
│   └── utils/           helper puri (date, prezzi, menuCatalogGrouping)
├── hooks/               useFeatures.ts, useBusinessHours.ts, useRateLimit.ts…
├── lib/                 supabase.ts, supabasePublic.ts, email.ts, logger.ts, utils.ts
│                        menuPhotoUpload.ts, shortCodeGenerator.ts
├── pages/               AdminDashboard, AdminHomePage, CrmPage, ServizioPage, AnalyticsPage…
│                        PublicMenuPage, PublicMenuCategoryPage
├── router.tsx           ← solo su esplicita richiesta
└── types/               database.ts (generato), booking.ts, customer.ts, edition.ts, menu.ts
```

Tab impostazioni attivo: `RestaurantSettingsTab.tsx` (LOCK strutturale in `ADMIN_CLASSIC_SKILL`).

### Struttura `docs/` (skill system)

```
docs/
├── APP_CONTEXT_SKILL.md        ← Skill 0, indice/routing (questo file, resta in root)
│                               ← futuro: eventuali entry tier avanzato → FU-ALL-TIER §4d (non ancora creati)
├── ADMIN_CLASSIC_SKILL.md      ┐ skill "radice" citate da molti file → restano in root
├── DATA_FLOW_SKILL.md          │
├── COMUNICAZIONE_UTENTE_SKILL.md ┘
├── DATABASE.md · SESSION_LOG.md  ← riferimenti globali
├── Prenota-Skill/              ← area Pagina Prenota: PRENOTA_SKILL (entry: senso+mappa) + contesto/*_CONTEXT (layout, text-limits, form-config, data-flow)
├── <Area>-Skill/ ·  per-ui-design-skill/   ← una cartella per area, skill + *_CONTEXT
├── Comunicazione-Skill/        ← VOCABOLARIO, OSSERVAZIONI, PROPOSTE, REVISIONE
├── Archivio/                   ← CONTESTO_PRODOTTO.md (fonte di verità, versionata, no dati sensibili)
├── Sessioni di lavoro/GG-MM-AA/  ← report sessioni vive (versionati, dal 23-05-26)
└── _lavoro/                    ← LOCALE e gitignored (MAI committare). Sottocartelle:
    ├── Per matteo/             ← guide/dati privati di Matteo (prezzi, DPA, cose-da-fare)
    ├── Storico/                ← architettura/changelog/setup storici
    ├── Supporto/               ← piani e analisi di lavoro (PWA, metodo spiegazioni)
    └── Sessioni/               ← report sessioni vecchie (12-22 maggio), privati
```

Regola: le **skill** stanno in `docs/` (root o cartella d'area). Il **materiale di supporto
versionato** sta in `docs/Archivio/`. Il **privato** sta in `docs/_lavoro/` (gitignored) — mai
referenziarlo come contesto obbligatorio per agenti post-produzione.

---

## 4. Invarianti globali — valgono in ogni task, in ogni file

```
LOCK  CollapsibleCard.tsx          — mai toccare
LOCK  Modal.tsx  z-[10050]         — stack calibrato con Toast z-100000. FIX 7 (16-06-26): all'apertura
      il dialog riceve `.focus()` + `.scrollIntoView({block:'start'})` (sincrono, niente rAF — un
      ritardo ruba il focus a un campo che l'utente sta già compilando) per inquadrarlo dal titolo
      anche se più alto del viewport. Non toccare z-index/struttura portal per estendere questo fix.
LOCK  TenantContext.tsx            — core multi-tenancy — MAI (eccezione: edition + featureOverrides)
LOCK  src/lib/supabase.ts          — client autenticato — MAI
LOCK  supabase/migrations/         — DB remoto già applicato — MAI
LOCK  src/router.tsx               — solo su esplicita richiesta

LOCK  ADMIN CLASSICA — vedi docs/ADMIN_CLASSIC_SKILL.md
      • src/pages/AdminDashboard.tsx
      • src/features/booking/components/BookingCalendar.tsx
      • src/features/booking/components/AdminBookingForm.tsx (+ BookingRequestForm.tsx pubblico) ← ex BookingForm.tsx (diviso)
      • src/features/booking/components/PendingRequestsTab.tsx + ArchiveTab.tsx (+ BookingRequestCard.tsx) ← ex BookingsList.tsx (diviso)
      • src/features/booking/components/BookingDetailsModal.tsx
      • src/features/booking/components/RestaurantSettingsTab.tsx
      • src/features/booking/hooks/useBookingMutations.ts
      • src/features/booking/hooks/useCustomers.ts (parte base)

      → Per i file LOCK l'agente DEVE: (1) leggere prima tutti i file collegati
        per capire l'impatto, (2) identificare i possibili conflitti, (3) procedere
        solo se la modifica preserva l'integrità strutturale e i contratti esistenti.
        Non serve attendere conferma esplicita SALVO che la modifica violi un
        invariante documentato. Vedi sezione 0 di ADMIN_CLASSIC_SKILL.md.

RULE  Prima di modificare: leggere INTERO il file da toccare + i file collegati
      necessari (chiamanti, tipi, componente condiviso). MAI editare avendo
      letto solo il frammento restituito da grep/search. Spendere token in
      lettura completa previene fix a pezzi e bug a catena.
RULE  Anti-duplicazione: prima di scrivere una funzione helper dentro un componente
      (date utils, label maps, formatter, classi tailwind ricorrenti), cercare con
      Grep se esiste già altrove. Se la stessa funzione compare in 2+ file →
      estrarre in `src/features/booking/utils/` (o `@/lib/`) con un parametro
      `variant` se i comportamenti divergono leggermente (es. `getModeLabelByType(modes, type, 'short'|'long')`).
      Stesso vale per costanti di stile/breakpoint: prima di hardcodare `min-[900px]`
      o `25vw` in più file, valutare se serve una costante in `constants/bookingPublicFieldStyles.ts`.
RULE  Import in cima al file: mai inserire `import` in mezzo al body (dopo una
      function declaration). Quando un edit lo crea per errore, spostare in cima
      nello stesso turno — TypeScript non sempre fallisce, ma ESLint sì in pre-commit.
RULE  Logger: in pubblico-form e componenti React mai `console.error/log` — usare
      `logger` da `@/lib/logger`. Vale anche per handler async dentro mutation.
RULE  Sidebar features non importano da admin classica senza interfacce pubbliche
RULE  Nuove feature in admin classica SEMPRE dietro FEATURES flag — usare useFeatures(), mai ADMIN_FEATURES hardcoded
RULE  Prop aggiunte ad AdminDashboard sempre OPTIONAL con default sensati
RULE  Edition Classic = !features.sidebar → AdminShell fa return anticipato, nessuna sidebar
RULE  Per aggiungere una feature gated: 1) flag in FeatureFlags+buildFeatures 2) featureKey in SIDEBAR_NAV_ITEMS 3) gating nel render

RULE  walk_in_max_guests: range 0–500 (0 = nessun walk-in accettato), campo opzionale. email/phone contatto opzionali — validati solo se compilati. Validazione in `restaurantSettingRegistry.ts`.
RULE  Selettore orario: UNICO componente `TimePicker24h` (pubblico+admin), minuti liberi 0-59, prop `compact` per form pubblico — `TimeInput` ELIMINATO, non reintrodurre input nativo type="time"
RULE  Avviso orario notturno (fine < inizio): testo unico `OVERNIGHT_TIME_END_HINT` in `bookingTimeSlots.ts` — nel modal CRUD fascia e nella sezione Classic «Imposta Fasce Orarie»; **non** sigle inline `(notturna +1)` nelle liste.
RULE  **Servizio** (fasce/override a tempo, modal CRUD fascia, assegnazione tavoli, libera tavolo, quick assign da Calendario): **dettaglio completo → `docs/Admin-Skill/contesto/ADMIN_SHELL_PAGES_CONTEXT.md` § Servizio** (sottosezioni Fasce orarie · Assegnazione tavoli · Accesso rapido da Calendario). Flussi utente → `contesto/ADMIN_SERVIZIO_CONTEXT.md`.
RULE  Menu Prenota (`MenuPricesTab` = magazzino unico): categorie, form prodotto, promo testuali (`booking_menu_promos`), menù preselezionati (`booking_custom_staff_presets`). Foto categoria Prenota (`menu_categories.image_url`) ≠ foto thumbnail QR (`menu_homepage_config.category_images`) — non mischiare. Nessun omaggio automatico. **Dettaglio completo → `docs/Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md`**; flusso dati/resolver → `docs/Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md`.
RULE  Scala tipografica responsive: usare utility centralizzate `text-title-page` / `text-title-section` / `text-title-card` / `text-title-subtitle` / `text-title-modal` (titoli) e `text-body` / `text-label` / `text-value` / `text-stat-big` / `text-micro` / `text-button-label` (corpo) definite in `src/index.css`. Ancorate al gold standard del titolo Calendario (22/24/24/30 px). Non reintrodurre liste `text-xs md:text-sm lg:text-base`. Distinzione titolo vs corpo obbligatoria (`text-title-*` solo per titoli). Vedi `docs/per-ui-design-skill/UI_RESPONSIVE_CONTEXT.md` §6b.
RULE  UI leggera: quando aggiungi controlli a pannelli admin, preferisci inserirli vicino al campo che modificano, con label brevi e anteprima sul campo stesso; evita blocchi informativi separati, card dentro card, duplicazioni di anteprima e testo esplicativo lungo se il controllo e gia chiaro.
RULE  Classi Tailwind: solo stringhe letterali statiche — mai `bg-${x}-600`
RULE  cn() da @/lib/utils — mai clsx() o twMerge() direttamente
RULE  !important Tailwind v4: suffisso → `border-red-500!` (non `!border-red-500`)
RULE  data-admin-theme: nessun cleanup — il tema deve persistere per tutta la sessione
RULE  Due client Supabase: non mischiare supabase ↔ supabasePublic
RULE  Feature flag commerciali: governate da `tenant_features` (tabella DB) + `edition` (bundle base). `useFeatures()` legge da `TenantContext.featureOverrides` → `buildFeatures(edition, featureOverrides)` → `FeatureFlags`. Mai leggere colonne `_enabled` da `organizations` né `featureOverrides` direttamente per gating UI — usare solo `features.X`. **Per attivare una feature a un'azienda la fonte di verità è la riga in `tenant_features` (via `get_tenant_features`); `organizations.qr_menu_enabled` è legacy e NON viene letta dal codice.** Flusso completo in `docs/DATA_FLOW_SKILL.md`. **Procedura passo-passo (con avvertenza fonte di verità + ambiente PROD) in `docs/Marketing-Skill/MARKETING_SKILL.md` § 3.**
RULE  **Menu QR** (qrMenu flag: auto-true Pro/Enterprise, Classic via `tenant_features`). Pagine pubbliche `/menu/:slug` ecc.; aspetto per-QR su `menu_qr_codes` (migrazioni **036/037** obbligatorie su ogni Supabase del deploy). **Dettaglio completo → `docs/Menu-QR-Skill/MENU_QR_SKILL.md`** (+ `contesto/*`).
RULE  Email CRM: normalizeCustomerEmail() prima di confronto o scrittura
RULE  UUID: cancelled_by è UUID auth.users.id — mai passare email a campi UUID
RULE  Admin **Personalizza form** (`BookingFormConfigPanel`) + tab **Anagrafica Azienda**: UI salvataggio condivisa `SettingsSaveUi.tsx`, autosave whitelist, guard navigazione, XOR card/carosello (`sub_tabs_presentation`), editor sottotab/carosello, card Sfondo (striscia vs pagina intera). **Dettaglio completo → `docs/Prenota-Skill/contesto/PRENOTA_FORM_CONFIG_CONTEXT.md`**.
RULE  **Tracking personalizzazioni card Prenota** (`SubTab.field_overrides`): bandierine booleane (label/description/price/hidden_*) — `true` = personalizzato dal ristoratore (resta se preset cambia); `false`/assente = ereditato dal preset live. Resolver puro `bookingFormResolver.ts`. **Dettaglio completo → `docs/Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md`**.
RULE  **Pagina Prenota v2** (`/prenota/:slug`): layout esterno opzionale a 2 colonne (striscia foto `25vw` / contenuto) da 900px; sfondo viewport (striscia crema vs full-page); ordine form (tipologia → sottotab → menù → dati cliente); breakpoint **1256px** per sidebar riepilogo e sticky bar; XOR card/carosello; caselle single-row; validazione. Config in `booking_public_form_config`. Submit invariato — **non toccare `useCreateBookingRequest`**. **Entry point area → `docs/Prenota-Skill/PRENOTA_SKILL.md`** (senso + mappa); dettaglio layout → `docs/Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md` (include il LOCK struttura griglia + tutte le note layout/sfondo/header/caselle/card ingredienti).

RULE  **PWA / aggiornamento app (service worker)** — file: `vite.config.ts`, `src/main.tsx`, `index.html`, `vercel.json`, `src/vite-env.d.ts`. Strategia: app sempre aggiornata all'apertura, mai reload/popup in sessione. **MAI `autoUpdate`** (resta `registerType: 'prompt'`); mai cacheare `supabase.co`. **Invarianti completi → `docs/PWA_CONTEXT.md`**.

LOCK  **`BookingRequestPage.tsx` — struttura griglia con striscia laterale** (consolidata, testata su 3 breakpoint). Prima di toccarla: valutare se basta agire sui componenti figli; se serve toccare la griglia, leggere per intero `BookingRequestPage` + `BookingPhotoStrip` + `BookingSummarySidebar` + `BookingRequestForm`; non violare gli invarianti strutturali (griglia `w-full`, strip `sticky top-0 h-screen`, footer fuori griglia, spacer `h-20/h-4`). **Invarianti dettagliati + tutte le note layout → `docs/Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md` §0.** Modifiche che li violano vanno discusse con l'utente prima.

RULE  **Fallback e placeholder (prod-ready):** quando manca un dato da DB o config del tenant, non lasciare stringhe/URL/immagini hardcodate «per far funzionare la demo» senza tracciarle. In produzione commerciale preferire: valore da storage del ristorante (`restaurant_settings`, `booking_public_form_config`, catalogo menu, `menu_qr_codes`, ecc.), stato vuoto esplicito (`EmptyState`, testo neutro), o costante centralizzata in `src/features/booking/constants/` / `@/config/` documentata nello skill d'area. Audit trasversale pianificato → `docs/FOLLOW_UP.md` **FU-ALL-FALLBACK** (§4c). Se in sessione tocchi un fallback sospetto: nota nel report §7.1 e sotto-riga in FU-ALL-FALLBACK (o nuovo FU collegato).
```

### 4c. Debito trasversale — mappatura fallback (FU-ALL-FALLBACK)

Obiettivo unico: **eliminare elementi hardcodati di test/demo** e sostituirli con comportamento **affidabile in produzione** per ogni ristorante (tenant).

| Aspetto | Indicazione |
|---------|-------------|
| **Perimetro** | Tutta l'app: dashboard admin, Pagina Prenota, Menu QR, email, resolver form (`bookingFormResolver`), impostazioni, componenti con `??` / `\|\|` su testi, immagini, prezzi, orari. |
| **Cosa cercare** | Valori fissi nel JSX/TS quando la query è vuota o fallisce; slug/tenant di prova; immagini stock; label «Lorem» o copy di sviluppo; default che non esistono in `restaurant_settings` o config pubblica. |
| **Fonti corrette** | Storage per tenant (vedi skill DB / `PRENOTA_DATA_FLOW_CONTEXT.md` / `DATA_FLOW`); mai duplicare in componente ciò che già vive in Supabase o in registry impostazioni. |
| **Come mappare (checklist)** | Per ogni elemento: (1) **se pieno** — da dove arriva (tabella/colonna o chiave settings); (2) **se vuoto** — fallback attuale nel codice; (3) **verdetto** — ok prod · da sostituire · vuoto intenzionale (`EmptyState`). |
| **Esecuzione** | Sessione dedicata o incrementale per area (profilo **Esecuzione** + skill della tabella § 0). Non confondere con FU-009 (mappatura impostazioni Prenota): **FU-ALL-FALLBACK** è l'**audit globale** sui fallback. |
| **Registro** | `docs/FOLLOW_UP.md` riga **FU-ALL-FALLBACK**; aggiornare a fine sessione (§7.1). |

### 4d. Milestone lontana — skill system per agenti più competenti (FU-ALL-TIER)

> **Non è lavoro corrente.** Tenere traccia finché non si fa una sessione Meta dedicata al design.
> Lo skill system attuale (Skill 0 + skill d’area + `PREPARA_PROMPT` + `.cursor/skills/` puntatori)
> resta la **fonte unica** fino a decisione esplicita.

**Problema da risolvere (futuro):** modelli e tool con capacità diverse (es. Cursor Auto vs thinking vs Claude Codex)
beneficiano di **ingressi diversi**: agenti leggeri → meno token, solo routing + LOCK del task; agenti forti →
pack più ricco senza ripetere tutto §4 ogni volta in forme ridondanti.

**Obiettivo per Matteo:** all’inizio chat, scegliere **cosa stai per fare** e caricare il set giusto — es. file
dedicati «Esecuzione feature», «Verifica profonda», «DB/migrazione», «Prepara prompt», «Meta comunicazione» —
invece di un solo `APP_CONTEXT_SKILL.md` monolitico.

| Domanda (sessione design) | Opzioni da confrontare |
|---------------------------|------------------------|
| Dove vivono le istruzioni? | Solo `docs/` · solo `.cursor/skills/` · **ibrido** (nucleo in docs, puntatori Cursor per tier) |
| Quanti entry point? | 1 Skill 0 + tabella §0 (oggi) · **2–4 skill ingresso** per profilo §0.0 · skill per **tier modello** |
| Duplicazione RULE/LOCK | Vietata: un §4 master; tier avanzato = **indice + deep-link** alle skill d’area già esistenti |
| Allineamento ciclo | `PREPARA_PROMPT_SKILL.md` resta leggero; tier avanzato non sostituisce prepara-prompt |
| Manutenzione | Chi aggiorna cosa quando cambia un LOCK — checklist in §7.2 estesa o script/doc generator (fuori scope ora) |

**Criteri di successo (bozza):** (1) Matteo sa quale file/skill attaccare in 10 secondi; (2) nessuna RULE
in due versioni diverse; (3) agente forte riceve contesto sufficiente per task multi-area senza leggere tutto `docs/`;
(4) agente leggero non carica Legal/DB se fa solo un fix UI.

**Registro e trigger:** `docs/FOLLOW_UP.md` **FU-ALL-TIER** (stato `Milestone lontana`). Roadmap prodotto:
`docs/Archivio/CONTESTO_PRODOTTO.md` §4. **Non** creare nuovi file `.cursor/skills/` in chat di lavoro
normale — solo in sessione approvata che produce un mini-piano (anche 1 pagina in `docs/_lavoro/Supporto/` se serve).

---

## 5. Comandi principali

```bash
npm run dev           # dev server :5173
npm run typecheck     # tsc --noEmit — zero errori
npm run lint          # ESLint — zero warning
npm run test          # Vitest — npm run test deve essere verde
npm run validate:docs # SOLO repo privata: link `.md` vivi (docs/ non esiste in PrenotaZen)
npm run validate      # lint + typecheck + test (usare pre-PR)
npm run release:prenotazen  # sync main → repo pubblica (vedi sotto)
```

### 5b. Release PrenotaZen (repo pubblica)

La repo **PrenotaZen** contiene solo codice app + README utente — **non** `docs/`, skill, agenti.
Per questo motivo:

| Controllo | Repo privata (CalendarBackup-v2) | PrenotaZen (pubblica) |
|-----------|----------------------------------|------------------------|
| `npm run validate:docs` | ✅ sì (CI + locale) | ❌ **no** — cartella `docs/` assente |
| `npm run validate` | ✅ | ✅ |
| `npm run build` | ✅ | ✅ obbligatorio pre-push |

**Regola agente merge/release:** `scripts/sync-to-prenotazen.mjs` (`npm run release:prenotazen`) rimuove
automaticamente da PrenotaZen: script `check-doc-paths.mjs`, allowlist, script `validate:docs` in
`package.json` e step CI «Validate doc paths». **Non reintrodurre** questi artefatti nella pubblica
né copiare `validate:docs` nel workflow CI di PrenotaZen. Fonte operativa: `CHIUSURA_SESSIONE.md`
Parte B §5 + commenti in `sync-to-prenotazen.mjs`.

---

## 6. Convenzioni

- **Comunicazione con l'utente**: leggi `docs/COMUNICAZIONE_UTENTE_SKILL.md` **all'inizio di ogni sessione** — contiene le regole su come rispondere a Matteo (breve, nomi dinamici, no gergo). Questa regola vale per ogni skill.
- **RULE Linguaggio utente**: quando spieghi cosa hai fatto o cosa cambierà, usa flussi e schermate concrete — mai nomi di componenti isolati. Mai "ho modificato `MenuPricesTab.tsx`" → sempre "ora Mario quando apre la tab Menu vede un nuovo pulsante per generare il QR". Esempi concreti obbligatori. Vedi `docs/COMUNICAZIONE_UTENTE_SKILL.md`.
- **Logger**: `logger.debug/info/warn/error` da `src/lib/logger.ts` — mai `console.log`
- **TanStack Query**: query server-state nei hook in `src/features/booking/hooks/`
- **Commit**: `feat(scope):` · `fix(scope):` · `update(scope):`
- **Import alias**: `@/` → `src/`

---

## 7. Obbligo fine sessione — Report + Allineamento skill

**Cronologia sessioni**: vedi [`docs/SESSION_LOG.md`](SESSION_LOG.md).

Al termine di ogni sessione di lavoro se utente di da conferma che il lavoro è stato svolto con successo, l'agente DEVE:

### 7.0 Protocollo comunicazione (carica la skill comunicazione)

Stile risposte e **flusso fine-chat** → [`docs/COMUNICAZIONE_UTENTE_SKILL.md`](COMUNICAZIONE_UTENTE_SKILL.md)
+ supporto in [`docs/Comunicazione-Skill/`](Comunicazione-Skill/). **Due ruoli separati:** l'**agente
di lavoro** (chat normale) carica la skill all'inizio se serve il vocabolario e alla fine per
applicarlo/raccogliere dati/scrivere il report; l'**agente revisore** (sessione dedicata,
`Comunicazione-Skill/REVISIONE.md`) valuta i dati e decide promozioni/regressioni — non è nelle chat
di lavoro. Il report (§7.1) e l'allineamento skill (§7.2) sono parte del flusso dell'agente di lavoro.

> **Terminali a chiusura, sezioni report, tono, commit/push/allineamento branch:** procedure complete
> in `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` (Parte B). Qui resta solo il *quando*.

### 7.1 Scrivere il report

> **COME si compila (tutte le sezioni, tono, cosa NON fare) + procedure di chiusura (commit, push,
> allineamento branch/DB, terminali):** fonte unica in
> `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` — è anche il file citato dall'hook fine-chat.
> Qui sotto resta solo il **QUANDO** (modalità + politiche di attivazione); il COME sta nel file unico.

> **Peso del protocollo per modalità (light / standard / deep).** Il task arriva con una modalità
> (la classifica `PREPARA_PROMPT_SKILL.md` § 1.A e la scrive nel prompt; se manca, deducila tu dai
> trigger deep sotto). La modalità decide **quanto** di questo § 7 applichi:
> - **light** (fix piccolo, 1 zona, basso rischio): **niente file report dedicato** → aggiungi **1
>   riga** in `docs/SESSION_LOG.md` con cosa hai fatto. Niente sezione Dati comunicazione. Applichi
>   § 7.2 solo se hai toccato un file di skill. Nessuna checklist.
> - **standard** (feature/fix normale): report `Report-*.md` con le sezioni base + Dati comunicazione;
>   § 7.2 delle aree toccate.
> - **deep** (vedi trigger): protocollo **completo** sotto, senza tagli (Dati comunicazione +
>   Derivazione errori + follow-up + § 7.2).
>
> **Trigger DEEP obbligatori** (basta uno, a prescindere dalla dimensione): DB/migrazioni/prod/RLS ·
> file LOCK (§ 4) · più di una view o nuovo componente · auth/login/pagamenti. **L'esecutore può solo
> ALZARE la modalità in corsa, mai abbassarla** (se scopre un rischio, sale a deep e lo segnala).

Per **standard** e **deep**, creare un file `Report-*.md` in `docs/Sessioni di lavoro/GG-MM-AA/` (creando la cartella se non esiste). Per **light**, basta la riga in `SESSION_LOG.md`.

> **Cappello obbligatorio del report (3 righe, sempre in cima — milestone M2).** Subito dopo
> l'intestazione, prima di ogni altra sezione, scrivi 3 righe fisse perché Matteo decida se aprire il
> resto:
> - **Cosa è cambiato:** 1 frase, effetto per l'utente finale.
> - **Cosa resta:** lavori aperti / follow-up, o «niente».
> - **Serve una tua azione:** sì (cosa) / no. Es. «sì — confermi il commit?» / «no».

> **REGOLA — report unificato per ciclo multi-agente (approvata 29-05-26).**
> Quando il lavoro passa da **più agenti** (prepara-prompt → esecuzione → revisione) sullo **stesso
> tema**, si usa **un solo report unificato** `Report-ciclo-<tema>-GG-MM-AA.md` con sezioni per fase
> (Obiettivo · Prompt · Esecuzione · Revisione · Dati comunicazione · Derivazione errori · Stato
> finale), **non** N file paralleli (`Report-prepara-*`, `Report-promo-*`, `Report-revisione-*`).
> Il **primo agente** del ciclo crea il file; i **successivi aggiornano solo la propria sezione**.
> `SESSION_LOG.md` punta a quel file. Resta a report singolo (modello classico) solo quando il
> ciclo è **un solo agente in un solo turno**. I report parziali storici restano dove sono.

**Le sezioni del report, il tono, le procedure di commit/push/allineamento e i terminali** stanno
nella fonte unica `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` (Parte A = report, Parte B =
procedure). Qui in APP_CONTEXT non si duplica più l'elenco — si rimanda lì (evita due copie che si
disallineano). Le **politiche di attivazione** sopra (modalità, trigger deep, cappello 3 righe, report
unificato) restano qui perché governano *quando* parte il protocollo.

### 7.2 Allineare i file di skill

Dopo ogni modifica al codice che cambia l'architettura, le strutture dati o le regole d'uso, l'agente DEVE aggiornare i file di skill corrispondenti **nella stessa sessione**, non in una successiva.

**Regola**: se hai toccato un file → aggiorna la skill che lo documenta.

| Se hai modificato… | Aggiorna anche… |
|--------------------|-----------------|
| `AdminShell.tsx` (routing, sezioni, edition) | `contesto/ADMIN_SHELL_NAV_CONTEXT.md` + `contesto/ADMIN_SHELL_ARCHITECTURE_CONTEXT.md` |
| `AdminDashboard.tsx` (prop, tab, layout) | `ADMIN_CLASSIC_SKILL.md` sezione "stato attuale" |
| `TenantContext.tsx` | `APP_CONTEXT_SKILL.md` §4 invarianti |
| `src/config/features.ts` o `src/hooks/useFeatures.ts` | `APP_CONTEXT_SKILL.md` §2 e §4 |
| `supabase/migrations/` (nuova migrazione) | `docs/DATABASE.md` + `DB_MIGRATIONS_CONTEXT.md` + `DB_SCHEMA_CONTEXT.md` |
| Nuova pagina/sezione admin | `contesto/ADMIN_SHELL_PAGES_CONTEXT.md` + `ADMIN_SHELL_ARCHITECTURE_CONTEXT.md` §7 + `ADMIN_SKILL.md` §7 |
| `AssignmentMapPanel` / `useTableAssignments` / `serviceSlotBookingFilter` | `contesto/ADMIN_SHELL_PAGES_CONTEXT.md` § Servizio → Assegnazione tavoli |
| Struttura cartelle `src/` | `APP_CONTEXT_SKILL.md` §3 |
| Qualsiasi file LOCK | Aggiorna sezione "stato attuale" nello skill di area |
| `restaurantSettingRegistry.ts` (validazione, range, campi) | `APP_CONTEXT_SKILL.md` §4 RULE walk_in_max_guests |
| `MenuPricesTab.tsx` / `MenuSelection.tsx` / `menuPricesCatalogLayout.ts` / `presetMenus.ts` / `menuCatalogGrouping.ts` | `Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` (+ `Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md`) |
| `MenuQrManager.tsx` / `MenuQrModal.tsx` / `useMenuQrCodes.ts` / pagine pubbliche menu | `docs/Menu-QR-Skill/MENU_QR_SKILL.md` + `APP_CONTEXT_SKILL.md` §4 RULE Menu QR |
| `tenant_features` / `buildFeatures` / `featureOverrides` / `TenantContext` / `useFeatures` | `APP_CONTEXT_SKILL.md` §4 RULE Feature flag commerciali + `DATA_FLOW_SKILL.md` |
| `docs/Marketing-Skill/FEATURE_CATALOG_CONTEXT.md` (nuova feature add-on) | Aggiorna tabella catalogo feature |
| `check_admin_email` RPC / `organizations_public` vista | `DATA_FLOW_SKILL.md` §2 + §5 |
| `menuPhotoUpload.ts` / `shortCodeGenerator.ts` | `docs/Menu-QR-Skill/MENU_QR_SKILL.md` |
| `035_menu_categories_image_url.sql` / `menu_categories.image_url` | `docs/DATABASE.md` + `DB_MIGRATIONS_CONTEXT.md` + `DB_SCHEMA_CONTEXT.md` + `Menu-QR-Skill/MENU_QR_SKILL.md` |
| `useBookingMutations.ts` / `useWalkInMutation.ts` / qualsiasi mutation che scrive `confirmed_start` o `desired_time` | `ADMIN_CLASSIC_SKILL.md` §4 + §4b |
| `dateUtils.ts` (createBookingDateTime, extractTimeFromISO, getAccurateStartTime) | `ADMIN_CLASSIC_SKILL.md` §4b + `TESTING_CONTEXT.md` se cambiano i test |
| `serviceSlotBookingFilter.ts` / logica filtro fascia in `useUnassignedBookings` | `contesto/ADMIN_SHELL_PAGES_CONTEXT.md` § Servizio → Assegnazione tavoli + `TESTING_CONTEXT.md` se cambiano i test |
| `BookingRequestPage.tsx` / `BookingRequestForm.tsx` / `BookingModeCards.tsx` / `BookingSubTabCards.tsx` / `BookingSummarySidebar.tsx` / `BookingFormFields.tsx` / `BookingPublicInsetField.tsx` / `bookingPublicFieldStyles.ts` | `Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md` (layout, LOCK griglia, note) |
| `bookingPublicFormConfig.ts` / `BookingFormConfigPanel.tsx` / `SettingsSaveUi.tsx` / `useDebouncedSettingsAutosave.ts` / `settingsAutosave.ts` / `restaurantSettingRegistry.ts` chiave `booking_public_form_config` | `Prenota-Skill/contesto/PRENOTA_FORM_CONFIG_CONTEXT.md` |
| `MenuPricesTab.tsx` / `booking_menu_promos` / `booking_custom_staff_presets` / form ingrediente / categorie menu | `Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` (+ `Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md` per il flusso) |
| `MenuSelection.tsx` / `BookingMenuComposeGrid.tsx` / `BookingMenuCategoryCard.tsx` / `menuComposeVisibility.ts` / prop `hideMenuGrid` / `subTabOverrides` / `BookingMode.sub_tabs` | `Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md` + `Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` |
| `bookingFormResolver.ts` / `SubTab.field_overrides` / `patchSubTabAsOverride` / `resetSubTabToPreset` | `Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md` (resolver e override) |
| `bookingPublicDateHelpers.ts` (getTodayIso, dateToIso, getCurrentTimeHHMM) / `bookingModeLabels.ts` (getModeLabelByType) | `APP_CONTEXT_SKILL.md` §4 RULE Anti-duplicazione — sono i punti di verità per date locali e label modalità del form pubblico |
| `docs/FOLLOW_UP.md` (nuova riga o chiusura FU) | Nessun altro file obbligatorio; opzionale puntatore in `.cursor/skills/calendarbackup-app-context/SKILL.md` se il follow-up è rilevante per sessioni future |
| Fallback / placeholder / `??` / `\|\|` su copy o asset quando config o DB è vuoto | `docs/FOLLOW_UP.md` **FU-ALL-FALLBACK** + §4c; skill d'area del componente toccato |
| `vite.config.ts` (VitePWA/define) / `src/main.tsx` (registerSW) / `index.html` (splash) / `vercel.json` (cache header) / `src/vite-env.d.ts` (globali build) | `docs/PWA_CONTEXT.md` |
| Mini-pack d'area `*_MINI.md` (nuova area o cambio routing §0) | Aggiorna §0.0b + il `*_MINI.md` dell'area (template 5 sezioni, no copy-paste LOCK) |

---

## 8. Regole documentazione skill (anti-storia)

- **Storia** → solo `docs/Sessioni di lavoro/` (report), non nelle skill vive.
- **Skill/context vivi** → stato attuale + divieti + link al report (max 3 righe guardrail, senza date lunghe).
- **Nuovi blocchi «fino al…» / changelog sessione** → vietati nelle skill vive.
- **Migrazione:** Menu QR potatura dedicata (FU-ALL-ANTISTORIA Imp-E3-1); altre aree on-touch al prossimo WP.

Formato guardrail ammesso in skill viva (eccezione, ≤3 righe):

```markdown
> **Divieto:** NON reintrodurre `content_type=evento` nel QR.
> Dettaglio storico: [Report blindatura Menu QR 06-06-26](Sessioni%20di%20lavoro/06-06-26/...).
```

La tabella §7.2 «Se hai modificato… → Aggiorna…» resta — è operativa, non cronologia.
Design: `Sessioni di lavoro/12-06-26/Design-wp-e3-anti-storia-protocollo-7-12-06-26.md`.
