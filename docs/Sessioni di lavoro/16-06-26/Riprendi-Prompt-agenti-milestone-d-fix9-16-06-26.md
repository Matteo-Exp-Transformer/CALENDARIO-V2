# Riprendi — Prompt sequenziali Milestone D / FIX 9 + E2E Calendario + `validate:docs`

> **Uso:** lanciare i prompt **in ordine**. Per ogni §: prima **A esecutore**, poi **B revisore** (salvo §5 Rev-D finale).
> Aggiornare la tabella stato sotto man mano che chiudi ogni staffetta.
>
> **Contesto:** M4 Impostazioni resta **chiusa** — non riaprire `Modal.tsx` (`z-[10050]`, `createPortal` invariati).
> Milestone D apre **FIX 9** (Personalizza Form admin + Pagina Prenota pubblica).

## ⏩ Riprendi da qui (17-06-26)

**Prossimo prompt da incollare:** [§3B — Revisore FIX 9 Admin](#3-fix-9--admin-json--personalizza-form) (poi §4A esecutore pubblico).

| Già chiuso | Commit / esito |
|------------|----------------|
| §1 validate:docs FU-052 | `734e5ed` · [Report](Report-fu-052-validate-docs-16-06-26.md) · `validate:docs` 0 path rotti |
| §2 E2E Calendario `display_order` | `734e5ed` · [Report](Report-e2e-calendario-display-order-16-06-26.md) · Playwright **3/3** `--workers=1` |
| Commit unico §1+§2 | `734e5ed` su `env/test` (push non ancora richiesto) |

**Gate parziali (prima di §5):** `validate:docs` ✅ · E2E calendario ✅ · `npm run validate` e E2E FIX 9 ⬜ (post §3–§4).

## Stato sequenza (16-06-26 → aggiornato 17-06-26)

| § | Fronte | Stato | Commit / report |
|---|--------|-------|-----------------|
| 0 | Preflight (regole comuni) | ✅ | applicato su §1–§2 |
| 1 | Fix `validate:docs` (FU-052) | ✅ | `734e5ed` · [Report-fu-052-validate-docs-16-06-26.md](Report-fu-052-validate-docs-16-06-26.md) · §1B ✅ PULITO |
| 2 | E2E Calendario post-riordino fasce | ✅ | `734e5ed` · [Report-e2e-calendario-display-order-16-06-26.md](Report-e2e-calendario-display-order-16-06-26.md) · §2B saltato (commit diretto post-esecutore) |
| 3 | FIX 9 — Admin (JSON + Personalizza Form) | ✅ §3B ⚠️1 (doc gap) | [Report-fix9-admin-compilable-categories-17-06-26.md](Report-fix9-admin-compilable-categories-17-06-26.md) · validate **780/780** · §3B: logica ✅ PULITA, gap doc (ADMIN_SETTINGS_CONTEXT / PRENOTA_FORM_CONFIG_CONTEXT / ADMIN_TEST_SUITE_INDEX non aggiornati col campo) → ok per §4, da chiudere in §4/§5 |
| 4 | FIX 9 — Pubblico + riepilogo + test/E2E | ⬜ | **prossimo** |
| 5 | Rev-D milestone D (gate + skill) | ⬜ | — |

**Gate finali milestone (dopo §5 ✅):**
`npm run validate:docs` ✅ · `npm run validate` ⬜ · `npx playwright test e2e/admin-calendar-blindatura.spec.ts --workers=1` ✅ · E2E FIX 9 ⬜

---

## 0. Regole comuni (leggere prima di ogni prompt)

- **Branch:** `env/test` — se diverso, fermati e avvisa Matteo.
- **DB:** solo TEST `docnnernvpyrbwuzzach`. **PROD** `rwuxgvld` vietato per scritture/migrazioni.
- **Non usare** `supabase db push`.
- **Working tree** può essere sporco (lavori Prenota 16-06-26): non revertire file altrui.
- **LOCK / divieti:**
  - **Non toccare** `src/components/ui/Modal.tsx` (`z-[10050]`, `createPortal`).
  - **Non toccare** `useCreateBookingRequest` salvo prova contraria documentata nel report.
  - FIX 9: **nessuna migrazione DB** in v1 — se serve DDL, **fermati** e chiedi conferma a Matteo.
- **Preflight lettura** (almeno §0 APP_CONTEXT + skill area del task):
  - Sempre: `AGENTS.md`, `docs/APP_CONTEXT_SKILL.md`, `docs/Comunicazione-Skill/VOCABOLARIO.md`
  - FIX 9: `docs/Admin-Skill/ADMIN_SKILL.md`, `docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md`, `docs/Prenota-Skill/PRENOTA_SKILL.md`, `docs/Prenota-Skill/contesto/PRENOTA_FORM_CONFIG_CONTEXT.md`, `docs/Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md`, `docs/Testing-Skill/TESTING_SKILL.md`
- **Chiusura esecutore:** report in `docs/Sessioni di lavoro/16-06-26/` + riga in `docs/SESSION_LOG.md` + allineamento skill §7.2 se il diff cambia comportamento documentato.
- **Commit/push:** solo se Matteo dice «fai report finale» o chiede esplicitamente commit.

---

## 1. Fix `validate:docs` (FU-052)

### 1A — Prompt esecutore ✅ Fatto (`734e5ed`)

```text
Profilo: Esecuzione
Modalità: light
Skill da leggere: docs/APP_CONTEXT_SKILL.md §0
Non caricare: skill FIX 9, Prenota layout completo
Output attesi: FU-052 sistemato in docs/FOLLOW_UP.md; npm run validate:docs verde; report light + SESSION_LOG. Niente output in più senza chiedere Sì/No.

Branch: env/test.

## Obiettivo

Ripristinare `npm run validate:docs` verde senza reintrodurre lo script SQL rimosso.

## Problema verificato

`npm run validate:docs` fallisce su:
`docs/FOLLOW_UP.md:9 -> supabase/scripts/seed_e2e_test_tenants.sql`

## Cosa fare

1. Esegui `npm run validate:docs` e conferma l'errore.
2. In `docs/FOLLOW_UP.md`, riga **FU-052**: rimuovi o riformula il link checkable al path `supabase/scripts/seed_e2e_test_tenants.sql`.
   - Usa riferimento **non-checkable**, es. backtick `seed_e2e_test_tenants.sql` o frase «il vecchio script SQL di seed E2E, rimosso il 16-06-26».
   - **Non** reintrodurre il file SQL.
   - **Non** aggiungere allowlist per un file rimosso apposta.
3. Mantieni il senso di FU-052: seed E2E va fatto con `supabase.auth.admin.createUser()` / portale Auth, mai INSERT diretto in `auth.users`.
4. Verifica: `npm run validate:docs` verde.

## Fuori scope

- Codice app, E2E, FIX 9, altri file FOLLOW_UP salvo link rotti emersi dallo stesso comando.

## Criterio di fatto

- `npm run validate:docs` exit 0
- FU-052 ancora tracciato e comprensibile
```

### 1B — Prompt revisore ✅ Fatto (verdetto PULITO)

```text
Profilo: Verifica
Modalità: light
Skill da leggere: docs/Comunicazione-Skill/CONTROVERIFICA.md (controlli 1–2)
Non modificare file. Solo verdetto.

## Mandato

Controverifica rapida §1 validate:docs. Matteo non ha chiesto QA UI.

1. Rilancia `npm run validate:docs`.
2. Leggi FU-052 in `docs/FOLLOW_UP.md`: nessun link a path file rimosso; contenuto ancora utile.
3. Confronta report esecutore §1 con diff reale.

## Output

- Verdetto: ✅ PULITO oppure ⚠️ N PROBLEMI
- Una riga: pronto per §2 sì/no
- Se ⚠️: prompt grezzo per prepara-prompt
```

---

## 2. E2E Calendario — `display_order` fasce nel digest ✅

### 2A — Prompt esecutore ✅ Fatto (`734e5ed`)

**Deliverable:** `e2e/admin-calendar-blindatura.spec.ts` (scenario «ordine fasce digest»), helper `service_slots` in `supabaseStaging.ts`, `ADMIN_TEST_SUITE_INDEX.md` aggiornato. Fix slug seed `test-classic` (env duplicato).

```text
Profilo: Esecuzione
Modalità: standard
Skill da leggere: docs/Admin-Skill/ADMIN_SKILL.md, docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md, docs/Testing-Skill/TESTING_SKILL.md, docs/per-ui-design-skill/BOOKING_CALENDAR_LAYOUT_CONTEXT.md (digest fasce)
Non caricare: FIX 9, Prenota pubblica
Output attesi: estensione e2e/admin-calendar-blindatura.spec.ts; spec verde con --workers=1; report + SESSION_LOG; aggiornamento ADMIN_TEST_SUITE_INDEX se nuovo scenario documentato. Niente output in più senza chiedere Sì/No.

Branch: env/test. DB: solo TEST staging via e2e/helpers/supabaseStaging.ts.

## Obiettivo

Coprire con E2E che, dopo **riordino manuale** delle fasce orarie in Impostazioni, il **calendario/digest** rispetta `display_order` salvato.

## Cosa fare

Estendi `e2e/admin-calendar-blindatura.spec.ts`:

1. **Setup** (beforeAll / helper): snapshot/restore `restaurant_settings` rilevanti; usa pattern già nello spec (`getRestaurantSettingSnapshot`, `restoreRestaurantSettingSnapshot`, `upsertRestaurantSettingValue`).
2. **Seed:** almeno **3 fasce** Classic in `service_slots` con `display_order` **non cronologico** (ordine volutamente invertito rispetto all'orario).
3. **Prenotazioni:** crea prenotazioni **accepted** che cadono in ciascuna fascia (prefisso cleanup esistente tipo `E2E-CAL-`).
4. **UI:** login → `/admin/calendario` → seleziona il giorno.
5. **Assert:**
   - header fasce nel digest nello **stesso ordine** del `display_order` salvato;
   - ogni prenotazione sotto la **fascia corretta**.
6. **Cleanup:** `afterAll` / `finally` — delete prenotazioni seed + restore snapshot settings.

## Comandi

- `npx playwright test e2e/admin-calendar-blindatura.spec.ts --workers=1`
- Se fallisce per credenziali/slug: correggi `.env.local.test` o usa fallback slug già nello spec — **non mascherare** con skip silenzioso se le credenziali ci sono.

## Fuori scope

- FIX 9, Impostazioni UI (M4 chiusa), modifica digest logic salvo bug dimostrato dal test.
- Non toccare Modal.tsx.

## Criterio di fatto

- Spec estesa passa in locale/staging TEST
- Report con comando Playwright esatto e dati seed usati
```

### 2B — Prompt revisore ⏭️ Saltato (commit `734e5ed` post-esecutore; report §11 completo)

```text
Profilo: Verifica
Modalità: standard
Skill da leggere: docs/Testing-Skill/TESTING_SKILL.md §4, docs/Comunicazione-Skill/CONTROVERIFICA.md
Non modificare codice salvo fix minimo al test se flaky documentato nel report.

## Mandato

Controverifica §2 E2E Calendario.

1. Leggi report §2 e diff su `e2e/admin-calendar-blindatura.spec.ts` + helper.
2. Rilancia: `npx playwright test e2e/admin-calendar-blindatura.spec.ts --workers=1`
3. Verifica:
   - test asserta **ordine** fasce, non solo presenza;
   - cleanup/restore non lascia sporco staging;
   - nessun skip ingiustificato con credenziali presenti.
4. Se il follow-up «E2E calendario post-riordino fasce» è chiuso: segnala aggiornamento da fare in MASTERPLAN / ADMIN_TEST_SUITE_INDEX / FOLLOW_UP (senza editare — solo elenco per §5 o commit doc).

## Output

- Verdetto ✅/⚠️
- Tabella: assert coperto | cleanup ok | spec stabile
- Raccomandazione: procedere §3 FIX 9 sì/no
```

---

## 3. FIX 9 — Admin (JSON + Personalizza Form) ⬜ **PROSSIMO**

> **Prerequisiti:** §1 ✅ · §2 ✅ · branch `env/test` con commit `734e5ed` (o successivo).

### 3A — Prompt esecutore

```text
Profilo: Esecuzione
Modalità: deep
Skill da leggere: docs/Admin-Skill/ADMIN_SKILL.md, docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md, docs/Prenota-Skill/contesto/PRENOTA_FORM_CONFIG_CONTEXT.md, docs/Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md, docs/Testing-Skill/TESTING_SKILL.md
Non caricare: APP_CONTEXT intero
Output attesi: campo JSON compilable_category_keys + UI admin toggle + test parse/admin; npm run validate verde; report deep. Niente output in più senza chiedere Sì/No.

Se scopri che serve migrazione DB → FERMATI, chiedi Sì/No a Matteo, non procedere.

Branch: env/test.

## Obiettivo (FIX 9 — fase admin)

In `booking_public_form_config`, per ogni sottotab card, permettere di marcare quali categorie sono **compilabili** dal cliente.

## Modello dati

- Aggiungi a `sub_tabs[]`:
  - `compilable_category_keys?: string[]`
- **Default assente** = tutte le categorie visibili sono compilabili (backward compatibility config vecchie).
- **Nessuna migrazione SQL** in v1 — solo JSON in `restaurant_settings.booking_public_form_config`.

## Admin — BookingFormConfigPanel

Nella sezione **«Categorie e ingredienti visibili»** (card scorrevole con preset):

- Mostra **toggle per categoria** solo se **Menù personalizzabile** ON (`is_fixed_menu === false`).
- Toggle ON → categoria compilabile dal cliente.
- Toggle OFF → categoria visibile ma **non** selezionabile in Pagina Prenota (implementazione pubblica in §4).
- Con Menù personalizzabile OFF: toggle **sparisce** e **non** deve sporcare/persistere `compilable_category_keys` inutilmente.

## Test obbligatori (Vitest)

- Estendi `bookingPublicFormConfig.test.ts`: parse/serialize nuovo campo, config legacy senza campo, round-trip.
- Test admin `BookingFormConfigPanel` (file blindatura settings esistente o nuovo mirato):
  - toggle visibile solo con menù personalizzabile ON;
  - salvataggio JSON corretto;
  - config legacy invariata.

Marcatori: `// @admin-blindatura: settings-form-config` o tag coerente con index esistente.

## Fuori scope §3

- MenuSelection / BookingSummarySidebar / Pagina Prenota (§4).
- useCreateBookingRequest, Modal.tsx, migrazioni.
- E2E Playwright FIX 9 (§4).

## Criterio di fatto

- Types + parse + serialize + UI admin + test mirati verdi
- `npm run validate` verde
- Report con esempio JSON before/after
```

### 3B — Prompt revisore

```text
Profilo: Verifica
Modalità: standard
Skill da leggere: docs/Prenota-Skill/contesto/PRENOTA_FORM_CONFIG_CONTEXT.md, docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md, docs/Testing-Skill/TESTING_SKILL.md §7

## Mandato

Controverifica §3 FIX 9 admin — prova a rompere il layer config.

1. Rilancia test mirati citati nel report §3 + `npm run validate`.
2. Verifica codice:
   - default assente = tutte compilabili;
   - toggle OFF con menù personalizzabile ON persiste chiavi corrette;
   - passaggio menù personalizzabile OFF non lascia JSON sporco;
   - nessuna migrazione aggiunta.
3. Config legacy (JSON senza `compilable_category_keys`) — parse non rompe.

## Output

- Verdetto ✅/⚠️
- Elenco gap da portare in §4 se il pubblico non può ancora consumare il campo
- OK per §4 sì/no
```

---

## 4. FIX 9 — Pubblico + riepilogo + test/E2E

> **Prerequisito:** §3A mergeato o stesso branch con campo JSON + admin funzionante.

### 4A — Prompt esecutore

```text
Profilo: Esecuzione
Modalità: deep
Skill da leggere: docs/Prenota-Skill/PRENOTA_SKILL.md, docs/Prenota-Skill/contesto/PRENOTA_FORM_CONFIG_CONTEXT.md, docs/Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md, docs/Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md, docs/Testing-Skill/TESTING_SKILL.md
Non caricare: Modal.tsx, migrazioni DB
Output attesi: MenuSelection + BookingSummarySidebar + test unit/E2E smoke FIX 9; npm run validate verde; report deep + skill §7.2 file elencati sotto. Niente output in più senza chiedere Sì/No.

Branch: env/test.

## Obiettivo (FIX 9 — fase pubblica)

Consumare `sub_tabs[].compilable_category_keys` sulla Pagina Prenota e nel riepilogo.

## Comportamento pubblico — MenuSelection / compose

- Categoria **non compilabile**: resta **visibile**; **nessuna checkbox** sugli item; item non entrano in `menu_selection`.
- Categoria **compilabile**: comportamento identico a oggi.
- Mix compilabile + non compilabile sulla stessa card.
- Vale per menù preselezionato e compilato manualmente (stesso `BookingMenuComposeGrid`).

## Riepilogo — BookingSummarySidebar

- Prezzi categorie **non compilabili** **esclusi** dal totale.
- Categorie compilabili: invariate.

## Flusso dati

- Propaga il campo dal resolver/config pubblica fino a MenuSelection e sidebar (leggi PRENOTA_DATA_FLOW_CONTEXT).
- **Non** modificare `useCreateBookingRequest`: lo snapshot si riduce perché gli item non selezionabili non vengono selezionati.

## Test obbligatori

**Vitest / component:**
- MenuSelection: categoria non compilabile visibile senza checkbox; compilabile invariata; mix.
- BookingSummarySidebar (o test dedicato): totale esclude categorie non compilabili.
- Estendi test esistenti prima di crearne di nuovi (TESTING_SKILL §1).

**E2E Playwright** (nuovo spec o estensione esistente Prenota admin path):
- Viewport: **375 / 900 / 1256** (+ **700** se layout card/categorie lo richiede).
- Casi:
  1. admin: toggle categoria appare con «Menù personalizzabile» ON;
  2. admin: toggle sparisce con OFF;
  3. pubblico: categoria OFF visibile senza spunte;
  4. pubblico: prezzo categoria OFF non nel riepilogo;
  5. submit: `menu_selection` non contiene item non compilabili.

Staging TEST only; credenziali `.env.local.test`.

## Allineamento skill §7.2 (obbligatorio in chiusura)

Aggiorna se il diff lo richiede:
- `docs/Prenota-Skill/contesto/PRENOTA_FORM_CONFIG_CONTEXT.md`
- `docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md`
- `docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md`
- `docs/Prenota-Skill/contesto/PRENOTA_TEST_SUITE_INDEX.md`
- `docs/STATO_BLINDATURA_CHECKLIST.md`
- `docs/MASTERPLAN_BLINDATURA.md` (Milestone D / FIX 9)

## Fuori scope

- Modal.tsx, migrazioni, refactor M4 Impostazioni oltre ciò che serve per FIX 9.

## Criterio di fatto

- `npm run validate` verde
- Comando E2E FIX 9 dichiarato nel report ed eseguito con esito
```

### 4B — Prompt revisore (pre-Rev-D)

```text
Profilo: Verifica
Modalità: standard
Skill da leggere: docs/Testing-Skill/TESTING_SKILL.md, docs/Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md

## Mandato

Controverifica §4 FIX 9 pubblico — smoke tecnico prima di Rev-D.

1. Rilancia test citati nel report §4 + E2E FIX 9.
2. Grep: nessun item non compilabile finisce in `menu_selection` / payload submit (code review).
3. Sidebar: totale coerente con regola esclusione.
4. Skill elencate in §4A: verifica che siano aggiornate o segnala gap per §5.

## Output

- Verdetto ✅/⚠️
- Tabella casi plan vs copertura test
- Pronto per §5 Rev-D sì/no
```

---

## 5. Rev-D — Milestone D (gate + skill + rompi FIX 9)

> **Prerequisiti:** §1–§4 completati (o esplicitamente saltati con nota in tabella stato).
> Agente **diverso** da chi ha eseguito §3A/§4A.

### 5B — Prompt revisore Rev-D (unico prompt §5)

```text
Profilo: Verifica
Modalità: deep
Skill da leggere per intero: docs/Comunicazione-Skill/CONTROVERIFICA.md, docs/MASTERPLAN_BLINDATURA.md, docs/STATO_BLINDATURA_CHECKLIST.md
Skill area: PRENOTA_FORM_CONFIG_CONTEXT, ADMIN_SETTINGS_CONTEXT, ADMIN_TEST_SUITE_INDEX, PRENOTA_TEST_SUITE_INDEX
Non modificare codice. Solo giudizio + eventuali prompt grezzi per prepara-prompt.

Branch: env/test.

## Mandato

Revisione Milestone D completa. Matteo può aver già fatto QA UI FIX 9 — tu verifichi diff, test, skill, gate.

## Input

- Report §1–§4 in `docs/Sessioni di lavoro/16-06-26/`
- Diff git del capitolo Milestone D
- Plan FIX 9 (campo JSON, admin toggle, pubblico, sidebar, no migrazione v1)

## Gate finali (rilancia tutti)

1. `npm run validate:docs`
2. `npm run validate`
3. `npx playwright test e2e/admin-calendar-blindatura.spec.ts --workers=1`
4. E2E FIX 9 — comando dal report §4

## Rompi FIX 9 (obbligatorio)

Provare attivamente (test manuale o test aggiuntivi solo se già nel diff — non scrivere codice):

| Caso | Atteso |
|------|--------|
| Config vecchia senza `compilable_category_keys` | Tutte categorie compilabili come oggi |
| Tutte categorie non compilabili | UI coerente; submit/validazione sensata |
| Nessuna categoria visibile | Nessuna regressione |
| Cambio tipologia dopo selezione | Stato menù/riepilogo coerente |
| Menù personalizzabile ON ↔ OFF in admin | Toggle e JSON puliti |
| Reload admin e pubblico | Persistenza corretta |
| Viewport 375 / 900 / 1256 | Nessuna regressione layout M0 |

## Blindatura regressione

- **M0 Prenota** e **M4 Impostazioni** restano blindate (nessun touch Modal.tsx; settings-* ancora verdi).
- Se un test M4/M0 rosso nel diff → ⚠️ obbligatorio.

## Controlli CONTROVERIFICA (1–4)

1. Dati report = diff reale
2. Skill/context/index/checklist/masterplan allineati (§7.2)
3. Scope creep vs plan
4. Coerenza report §1–§4

## Follow-up

- Se §2 ha chiuso E2E calendario post-riordino: verifica riga aggiornata in MASTERPLAN / ADMIN_TEST_SUITE_INDEX / FOLLOW_UP
- FU-051 resta fuori cancello — non confonderlo con Milestone D

## Output

1. **Verdetto:** ✅ MILESTONE D CHIUSA oppure ⚠️ N BLOCCHI
2. **Tabella gate:** comando | esito
3. **Tabella skill audit:** file | ok/stale
4. **FIX 9 rompi:** caso | esito
5. Se ⚠️: PROMPT GREZZO per prepara-prompt per ogni blocco
6. **Raccomandazione una riga:** «commit + push» / «serve giro fix prima del commit»
```

---

## Appendice — mappa chat / agenti

| Step | Tipo chat | Durata stimata |
|------|-----------|----------------|
| §1A | Esecuzione light | ~15 min |
| §1B | Verifica light | ~10 min |
| §2A | Esecuzione standard | ~1–2 h |
| §2B | Verifica standard | ~30 min |
| §3A | Esecuzione deep | ~2–3 h |
| §3B | Verifica standard | ~45 min |
| §4A | Esecuzione deep | ~3–4 h |
| §4B | Verifica standard | ~45 min |
| §5B | Rev-D deep | ~1–2 h |

**Parallelo possibile:** §1A poi §2A su branch diversi solo se Matteo coordina merge; **sequenza consigliata** lineare §1→§2→§3→§4→§5.

**Completato 17-06-26:** §1+§2 in commit `734e5ed`. **Riprendi da §3A.**

**Dopo Milestone D chiusa:** QA manuale anteprime M4 (Matteo) = conferma esterna, **non** riapertura M4/Modal.
