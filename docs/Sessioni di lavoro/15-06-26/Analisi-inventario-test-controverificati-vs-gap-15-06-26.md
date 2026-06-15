# Analisi inventario test — controverificati vs gap E2E (handoff senior)

**Data:** 15-06-26 · **Branch:** `env/test` · **Validate:** `npm run validate` → **598/598** (74 file Vitest)  
**Destinatario:** agente senior — decidere quali E2E «flusso utente reale» mancano per area.

**Fonti:** `ADMIN_TEST_SUITE_INDEX.md`, `PRENOTA_TEST_SUITE_INDEX.md`, `MENU_QR_TEST_SUITE_INDEX.md`, report sessioni 06–15/06/26, grep `@admin-blindatura` / `@prenota-blindatura`, cartella `e2e/`.

---

## Come leggere le due categorie

| Categoria | Significato | Criterio ammissione |
|-----------|-------------|---------------------|
| **A — Controverificati funzionanti** | Test che **proteggono comportamento reale** con evidenza di esecuzione: `validate` verde oggi, **oppure** Playwright su staging TEST con report «passed», **oppure** QA browser/documentato con OK Matteo o revisore «Approva». Esclusi i soli mock senza pass E2E dove l’area richiede browser (es. shell M1). |
| **B — Presenti ma non bastano per flusso utente reale** | Test utili ma **non sostituiscono** un utente che clicca: mock pesanti, «CSS-equivalent», spec mai eseguita su staging, zero copertura rendering pubblico, buchi espliciti negli index skill. **Non** significa «test sospetti/falsi» — molti Vitest blindatura sono corretti ma insufficienti per E2E end-to-end. |

---

## Categoria A — Controverificati funzionanti

### A1. Vitest blindatura — suite `@admin-blindatura` (validate 598, 15-06-26)

Eseguiti in CI locale via `npm run validate`. Conteggio da `ADMIN_TEST_SUITE_INDEX.md` + file marcati.

| Fronte | File principali | Test ≈ | Evidenza extra |
|--------|-----------------|--------|----------------|
| **Shell** | `adminShellRouting.test.ts`, `adminShellTabFlash.test.tsx`, `AdminDashboard.adminRouting.test.tsx`, `UnsavedChangesContext.adminBlindatura.test.tsx` | ~12 | E2E FU-042 (sotto) |
| **Prenotazioni** | `useBookingMutations.prenotazioni.adminBlindatura.test.tsx` (17), `prenotazioni.adminBlindatura.test.tsx` (15), `bookingDetailsModal.u3u9` (2) | 35 | E2E FU-043 |
| **Calendario** | `calendario.adminBlindatura.test.tsx` (18), `sumGuestsByDate`, `dailyGuestLimit`, `bookingCalendarGuard`, `bookingEventTransform`, `useCapacityCheck`, `adminBookingForm.dailyLimit` | 41 M2 | Revisione «Approva con riserve» 11-06; **no E2E calendario** (decisione Matteo) |
| **Menu magazzino** | `menuMagazzinoLimits` (9), `menuMagazzinoAvailability` (9), `menuMagazzinoSync` (9) | 27 | E2E M3 + CT (sotto) |
| **Servizio guard** | `servizioModalsGuard.adminBlindatura.test.tsx` (3) | 3 | Controverifica 🔶 12-06 (smoke browser opzionale) |
| **Auth tenant** | `TenantContext.test.tsx`, `useAdminAuth.test.tsx` | — | Ciclo 6 FU-AUTH-3 |

Altri Vitest **senza** marcatore blindatura ma in validate verde: utility prenotazioni, menu pricing, resolver, `m6ProdReadyPatterns`, ecc. — utili, non elencati uno a uno (vedi `src/**/__tests__`).

### A2. Vitest blindatura — Pagina Prenota `@prenota-blindatura`

| Fronte | File | Evidenza |
|--------|------|----------|
| flusso-dati | `bookingFormResolver.flusso-dati`, `bookingPublicFormConfig.malformed`, `buildPresetMenuSelection.flusso-dati`, `orderCategoryKeys.staleKeys` | FU-036; validate verde |
| flusso-utente | `bookingTotals.flussoUtente`, `BookingRequestForm.flussoUtente`, `BookingSummarySidebar.capability`, `privacyPolicyNavigation` | QA Matteo 05-06 capability |
| server-config | `bookingClientEdgeLimitsSync`, `restaurantSettingRegistry.stripPhoto`, `presetMenuDisplay` | Probe edge FU-031 runtime TEST |

**Aggiunte Ciclo 8 / email (15-06-26):** `publicBookingSurface.test.ts` (5), `useBookingPublicScrollRowAlign.test.tsx` (4), `buildBookingEmailSummary.test.ts` (5+) — validate verde.

### A3. Vitest — Menu QR (6 file, index 06-06-26)

`menuQrValidation`, `menuQrCategoryOrder`, `menuQrStorage`, `menuQrCategoryKeySync`, `categoryIcons`, `menuQrCategoryFieldCap` — tutti in validate. **Nessun E2E Menu QR dedicato** oltre propagazione in M3.

### A4. Playwright E2E — esecuzione documentata su staging TEST

Richiedono `.env.local.test` + `npx playwright test` (spesso `--workers=1`).

| Spec | Marcatore / area | Test ≈ | Report esecuzione |
|------|------------------|--------|-------------------|
| `e2e/admin-shell-blindatura.spec.ts` | shell refresh/back, dirty, logout | 5 | FU-042 chiuso 10-06 — **19 passed** suite shell |
| `e2e/admin-booking-mgmt.spec.ts` | prenotazioni-e2e | 7 | FU-043 11-06 — staging, 375/834 |
| `e2e/admin-menu-magazzino-blindatura.spec.ts` | menu-magazzino | 3 viewport | M3 11-06 — Matteo T1–T5 OK |
| `e2e/admin-menu-magazzino-ct.spec.ts` | menu-magazzino-ct | 1 | Ciclo 8 15-06 — **1 passed** |
| `e2e/public-booking.spec.ts` | Pagina Prenota pubblica | 5 | In index; **nessun report «N passed» recente** in SESSION_LOG — candidato **ri-esecuzione** prima di promuovere ad A pieno |

**E2E presenti, marcati parzialmente, esecuzione non tracciata in report recente** (restano utili ma senior dovrebbe rieseguire una volta):

- `e2e/admin-login.spec.ts` — shell-login  
- `e2e/admin-classic-tabs.spec.ts` — shell-edition + soft-delete  
- `e2e/pro/pro-login.spec.ts`, `pro-sidebar-nav.spec.ts`, `pro-home.spec.ts`, `pro-crm.spec.ts`  
- `e2e/edition-classic.spec.ts`, `edition-classic-data-protection.spec.ts`, `edition-upgrade.spec.ts`  
- `e2e/menu-crud.spec.ts`  
- `e2e/invite-flow.spec.ts`  

### A5. QA browser / Playwright documentati fuori da `e2e/`

| Area | Evidenza | Nota |
|------|----------|------|
| Prenota centratura C1/C3 | FU-038/039 — Playwright `/prenota/test` 375–1280 OK | Report 10-06 |
| Prenota viewport/menu | FU-024/025/027 — QA Matteo OK 31-05 | |
| Menu QR smoke pubblico | FU-022 — `/menu/test-pro/qr/x7zuud5` OK revisore 30-05 | |
| FU-026 card layout | Screenshot agente 375/834/1280 15-06 | Accettazione Matteo lavoro ok |
| Email Brevo | Script + admin accetta/rifiuta — Matteo Gmail OK 15-06 | Non Playwright |

### A6. Edge / DB controverificati (non Vitest/E2E UI)

| Oggetto | Evidenza |
|---------|----------|
| `create-booking` limiti testo | FU-031 probe TEST v7 |
| `send-email` Brevo | TEST deploy + script `_test-email-once.mjs` |
| Migrazione 044 contatore restore | FU-049 PROD con conferma Matteo |

---

## Categoria B — Non bastano per flusso utente reale (gap / debolezze)

### B1. Aree senza E2E Playwright dedicato (solo Vitest o QA manuale)

| Area | Cosa c’è oggi | Cosa manca per «utente reale» |
|------|---------------|-------------------------------|
| **Tab Calendario** | 41 Vitest RTL + mock FullCalendar | E2E: click giorno, digest, badge %, apri dettaglio, elimina; FU-048 turni Pro |
| **Pagina Prenota** | 10 file `@prenota-blindatura` + `public-booking.spec.ts` (5 test, run non documentato) | E2E: card+carosello+menù+submit+sidebar; responsive 375/1256; **email post-accetta non in E2E** |
| **Menu QR pubblico** | 6 Vitest utils; smoke una tantum FU-022 | E2E: homepage, categoria, ordine piatti FU-MQR-2, import preset Ciclo 3 |
| **Personalizza form** | Vitest resolver/config | E2E: salva vetrina, guard, carosello CRUD |
| **Impostazioni / salvataggio** | Vitest parziale; E2E dirty guard usa **tema** non anagrafica | E2E: footer Salva, modale dati pubblici FU-005, autosave OFF prod |
| **Email transazionale** | Unit `buildBookingEmailSummary` | E2E o integration: accetta → `email_logs` + (opzionale) inbox test |
| **Servizio Pro** | 3 Vitest guard modali | E2E: sale, tavoli, slot, walk-in, assegnazione tavolo |
| **CRM Pro** | `pro-crm.spec.ts` (non tracciato run recente) | E2E: delete cliente con booking, note, guard pannello |
| **Analytics / Home Pro** | `pro-home.spec.ts` | E2E con `features.home=false` |
| **Invito admin** | `invite-flow.spec.ts` | Ri-esecuzione + registrazione completa |

### B2. Test «deboli» per definizione (utili ma non browser)

| Pattern | Esempi | Perché in B |
|---------|--------|-------------|
| Mock FC / modali | `calendario.adminBlindatura` | Non prova FullCalendar reale né CSS badge |
| CSS-equivalent | FU-045 modali 375px | Report 07-06: no browser reale su R1 |
| MSW / mock Supabase | Tutti Vitest hook | Logica OK, rete/RLS/sessione no |
| Component senza rendering pagina | `BookingRequestForm.flussoUtente` | Non prova scroll/sticky/sfondo Prenota |
| Deno `log.test.ts` | FU-LOG-1-H | Fuori da `npm run validate`; runner separato |

### B3. Buchi espliciti negli index skill (da trasformare in E2E o Vitest)

| ID / voce | Fonte |
|-----------|--------|
| `menuQrItemSortOverrides` test file | MENU_QR_TEST_SUITE_INDEX |
| Import preset QR modal | MENU_QR_TEST_SUITE_INDEX |
| `PublicMenuPage` / `PublicMenuCategoryPage` rendering | MENU_QR_TEST_SUITE_INDEX |
| Walk-in tavolo occupato | ADMIN_TEST_SUITE_INDEX §7 |
| Delete cliente CRM con booking | ADMIN_TEST_SUITE_INDEX §7 |
| Analytics fuori periodo | ADMIN_TEST_SUITE_INDEX §7 |
| FU-010 estensione Servizio modali | Report Ciclo 8 — Sì/No |
| FU-M3-QA-CT copre solo **1** scenario CT | Non sostituisce blindatura E2E base M3 su tutti i viewport |

### B4. CI / operatività

- **`npm run validate`** — solo Vitest + lint (598 test); **Playwright non in validate**.
- **E2E** — richiedono staging + credenziali; non tutti i report citano data ultimo run.
- **Raccomandazione senior:** script «smoke E2E minimo» per area (grep `@admin-blindatura` in `e2e/`) con output archiviato in report.

---

## Matrice rapida area → stato E2E flusso reale

| Area app | Vitest blindatura | E2E staging documentato | Flusso utente reale coperto? |
|----------|-------------------|-------------------------|------------------------------|
| Shell login/logout/refresh | ✅ | ✅ FU-042 | **Sì** (parziale: no tutte le tab) |
| Edition Classic/Pro | ✅ | ⚠️ spec esistono, run vecchio | **Parziale** |
| Prenotazioni operative | ✅ 35 | ✅ FU-043 | **Sì** (warning accept; no email) |
| Calendario | ✅ 41 | ❌ | **No** (solo unit + QA manuale badge) |
| Menu magazzino | ✅ 27 | ✅ M3 + CT | **Sì** (toggle; no rename/delete E2E) |
| Pagina Prenota | ✅ 10 | ⚠️ `public-booking` | **Parziale** |
| Menu QR pubblico | ✅ 6 utils | ⚠️ smoke una tantum | **No** |
| Servizio / CRM / Analytics | ⚠️ guard only | ⚠️ pro-* specs | **No** |
| Email Brevo | ✅ builder | ❌ | **No** (manuale Matteo) |
| Impostazioni / Personalizza | ⚠️ | ❌ | **No** |

Legenda: ✅ = evidenza forte · ⚠️ = presente ma da ri-eseguire/estendere · ❌ = assente

---

## Proposta priorità per agente senior (solo orientamento)

1. **P0 — Rieseguire e archiviare** tutti gli `e2e/*.spec.ts` su staging (`--workers=1`) → aggiornare questa analisi con conteggi pass/fail.
2. **P1 — E2E mancanti ad alto valore:** Calendario (1 spec), Prenota end-to-end card+carosello (estendere `public-booking`), email accetta → `email_logs`.
3. **P2 — Menu QR pubblico** (homepage + categoria + sort piatti).
4. **P3 — M4/M5:** Impostazioni save, Servizio, CRM delete.

---

## Riferimenti

- Report lavoro agente: [Report-finale-15-06-26-ciclo8-email-fu026.md](./Report-finale-15-06-26-ciclo8-email-fu026.md)
- Index: `docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md`, `docs/Prenota-Skill/contesto/PRENOTA_TEST_SUITE_INDEX.md`, `docs/Menu-QR-Skill/contesto/MENU_QR_TEST_SUITE_INDEX.md`
- Osservazione Matteo E2E completi: `docs/Comunicazione-Skill/OSSERVAZIONI.md` (riga 59+)
