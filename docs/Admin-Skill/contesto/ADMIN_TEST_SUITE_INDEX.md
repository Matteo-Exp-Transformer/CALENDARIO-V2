# ADMIN — Test Suite Index iniziale

> Inventario dei test esistenti collegati all'area admin. Non e ancora piano test completo:
> la fase successiva dovra trasformare i flussi critici in scenari verificati.
> Per il ciclo di blindatura usare `../PLAN_BLINDATURA_ADMIN.md`.

## 0. Marcatori blindatura Admin

Ogni test creato o consolidato per la blindatura prodotto deve avere in testa:

```ts
// @admin-blindatura: <fronte>
// Copre: <flusso utente/dati blindato>
```

Fronti previsti:

| Marcatore | Area |
|---|---|
| `@admin-blindatura: shell-login` | Login, route protetta, redirect |
| `@admin-blindatura: shell-edition` | Classic/Pro/Enterprise e feature flags |
| `@admin-blindatura: shell-sidebar` | Sidebar, sezioni e ritorno a Prenotazioni |
| `@admin-blindatura: shell-dirty-guard` | Cambio tab/sezione con modifiche non salvate |
| `@admin-blindatura: shell-logout` | Logout con o senza dirty state |
| `@admin-blindatura: shell-refresh-back` | Refresh/back su sotto-route Admin |
| `@admin-blindatura: prenotazioni` | Flussi booking operativi |
| `@admin-blindatura: calendario` | Tab Calendario admin (M2 Area 2-bis) |
| `@admin-blindatura: settings` | Impostazioni, salvataggi e Personalizza Form |
| `@admin-blindatura: menu-magazzino` | Tab Menu, categorie, ingredienti, sync |
| `@admin-blindatura: servizio` | Sale, tavoli, slot, walk-in, briefing |
| `@admin-blindatura: crm` | Clienti e booking collegate |
| `@admin-blindatura: home-analytics` | Home, KPI e analytics |
| `@admin-blindatura: fallback-prod-ready` | Fallback, mock, hardcoded, codice morto |

## 1. E2E admin

| File | Area |
|---|---|
| `e2e/admin-login.spec.ts` | login admin |
| `e2e/admin-shell-blindatura.spec.ts` | shell refresh/back, dirty guard, logout (FU-042) |
| `e2e/admin-classic-tabs.spec.ts` | tab Classic |
| `e2e/admin-booking-mgmt.spec.ts` | gestione prenotazioni admin |
| `e2e/menu-crud.spec.ts` | CRUD menu |
| `e2e/pro/pro-login.spec.ts` | login Pro |
| `e2e/pro/pro-sidebar-nav.spec.ts` | sidebar Pro — `aside` con `role="complementary"` (non `navigation`); ritorno dashboard da CRM via pulsante X |
| `e2e/pro/pro-home.spec.ts` | Home Pro |
| `e2e/pro/pro-crm.spec.ts` | CRM Pro |
| `e2e/edition-classic.spec.ts` | gating Classic |
| `e2e/edition-classic-data-protection.spec.ts` | protezione dati Classic |
| `e2e/edition-upgrade.spec.ts` | upgrade edition/feature |
| `e2e/public-booking.spec.ts` | collegamento admin/Prenota lato pubblico |

## 2. Unit/component per prenotazioni

- `src/features/booking/hooks/__tests__/useBookingMutations.test.tsx`
- `src/features/booking/hooks/__tests__/useAdminBookingRequests.test.tsx`
- `src/features/booking/utils/__tests__/capacityCalculator.test.ts`
- `src/features/booking/utils/__tests__/CONTROLLA_ORARIO-PRENOTAZIONI.test.ts`
- `src/features/booking/utils/__tests__/unassignedBookingsFilter.test.ts`
- `src/features/booking/utils/__tests__/tableCheckout.test.ts`
- `src/features/booking/components/__tests__/DetailsTab.placement.test.tsx`

## 3. Unit/component per settings/Prenota config

- `src/features/booking/constants/__tests__/bookingPublicFormConfig.test.ts`
- `src/features/booking/constants/__tests__/bookingPublicFormConfig.malformed.flusso-dati.test.ts`
- `src/features/booking/constants/__tests__/menuPromo.test.ts`
- `src/features/booking/lib/__tests__/restaurantSettingRegistry.stripPhoto.test.ts`
- `src/features/booking/components/__tests__/BookingRequestForm.flussoUtente.test.tsx`

## 4. Unit/component per menu magazzino/QR

- `src/features/booking/hooks/__tests__/useMenuCategories.test.tsx`
- `src/features/booking/components/__tests__/PresetMenuBuilder.prodReady.test.tsx`
- `src/features/booking/components/__tests__/menuQrCategoryFieldCap.test.tsx`
- `src/features/booking/utils/__tests__/menuQrCategoryKeySync.test.ts`
- `src/features/booking/utils/__tests__/menuQrStorage.test.ts`
- `src/features/booking/utils/__tests__/menuQrValidation.test.ts`
- `src/features/booking/utils/__tests__/menuQrCategoryOrder.test.ts`
- `src/features/booking/services/__tests__/bookingFormResolver.test.ts`
- `src/features/booking/services/__tests__/bookingFormResolver.flusso-dati.test.ts`

## 5. Unit/component per servizio/features

- `src/config/__tests__/features.test.ts`
- `src/hooks/__tests__/useFeatures.test.tsx`
- `src/features/booking/hooks/__tests__/useServiceSlots.test.tsx`
- `src/features/booking/utils/__tests__/serviceSlotBookingFilter.test.ts`
- `src/features/booking/utils/__tests__/unassignedBookingsFilter.test.ts`
- `src/features/booking/utils/__tests__/tableCheckout.test.ts`

## 6. CRM

- `e2e/pro/pro-crm.spec.ts`
- `src/features/booking/utils/__tests__/createBookingCustomerUpsert.test.ts`

## 7. Buchi iniziali da trasformare in test

- ~~Logout con dirty state.~~ ✅ chiuso M1 — §9 / `admin-shell-blindatura.spec.ts`
- ~~Refresh/back da sezioni interne non URL.~~ ✅ chiuso M1 — §9 / `admin-shell-blindatura.spec.ts` (refresh/back URL; eventuale tab state-only → §9)
- Home con `features.home=false` e sidebar attiva.
- Delete cliente CRM con booking collegate.
- Rename/delete categoria menu con sync QR/Prenota.
- Walk-in tavolo occupato.
- Service slot override `date_from/date_to`.
- Analytics booking create fuori periodo ma evento dentro periodo.

## 8-bis. Area 2-bis — Tab Calendario (M2)

Stato: **Fase A–B + Fase C chiusi 11-06-26** — 29 test Vitest `@admin-blindatura: calendario`, validate **511**; controtest «rompi» → 13 finding (0 ALTO), report `Report-fase-c-controtest-calendario-11-06-26.md`. Nessun E2E calendario (decisione Matteo). **Resta:** batch fix **FU-047** + QA responsive badge opzionale.

### Mapping scenari PLAN §3-ter.3 → test

| # | Scenario | File / describe |
|---|---|---|
| 1 | Solo accettate (no-show assenti; digest senza orario) | `sumGuestsByDate.adminBlindatura.test.ts` (pending/rejected/deleted/no-show) + `calendario.adminBlindatura.test.tsx` → events FC + digest |
| 2 | Badge % — senza limite conteggio; con limite solo %; >100% reale | `calendario.adminBlindatura.test.tsx` → `dayCellDidMount` + `restaurantSettingRegistry.dailyGuestLimit.adminBlindatura.test.ts` (0=illimitato) |
| 3 | Gate tavolo Classic assente / Pro+servizio presente | `calendario.adminBlindatura.test.tsx` → pallino `Assegna tavolo` |
| 4 | Crea da giorno — `dateClick` seleziona; pulsante apre form; giorno pieno non blocca | `calendario.adminBlindatura.test.tsx` → `dateClick` + `AdminBookingForm` mock `initialDate` |
| 5 | No drag&drop — config FC senza `editable`/`eventDrop`/`selectable` | `calendario.adminBlindatura.test.tsx` → assert props mock FullCalendar |
| 6 | Elimina solo da modale dettaglio — conferma custom, no `window.confirm` | `calendario.adminBlindatura.test.tsx` → digest → `BookingDetailsModal` → `BookingDangerActionModal` |

### File test marcati

- `src/features/booking/utils/__tests__/sumGuestsByDate.adminBlindatura.test.ts` (7) → conteggio coperti/giorno (stesso criterio blocco pubblico `DAILY_LIMIT`).
- `src/features/booking/lib/__tests__/restaurantSettingRegistry.dailyGuestLimit.adminBlindatura.test.ts` (9) → limite giornaliero `0`/vuoto = illimitato (fix salvataggio Impostazioni).
- `src/features/booking/components/__tests__/calendario.adminBlindatura.test.tsx` (13) → UI `BookingCalendar`: badge, gate tavolo, crea-da-giorno, no DnD, elimina da dettaglio.

Pattern: mock `@fullcalendar/react` cattura props (`dateClick`, `dayCellDidMount`, assenza drag); `AdminBookingForm` mock per `initialDate`; `BookingDetailsModal` reale con tab stub + mutation mock.

### Buchi residui (post Fase C)

- **Batch fix FU-047** — finding C-D/U/L/R (priorità C-D2, C-U1, C-L1, C-R1).
- **Lacune test** — FU-REV-CAL-1/2/3/4 (vedi report revisione + Fase C §8).
- **QA browser** badge responsive 375/834/1280 (opzionale se QA dev 11-06 ancora valido).
- **E2E Playwright calendario** — fuori scope; opzionale.

---

## 8. Area 2 — Prenotazioni operative

Stato: **Fase D + FU-046 chiusi 07-06-26** — batch1 D1/R1/D4/D5/D2 + batch2 D3/U1/U2/U4/U5/U6/U7/U10; bloccanti ALTO+MEDIO risolti; restano U3/U9/D6-D7/L* + QA reale (FU-043).

Test marcati (32 test, verdi):

- `src/features/booking/hooks/__tests__/useBookingMutations.prenotazioni.adminBlindatura.test.tsx` (17) →
  accept/reject/soft-delete/restore/requeue/no-show + **race guard pending** (D1) + **restore azzera cancellation_*** (D5) + **restore con orario fornito** (D4 affinamento 07-06-26) + **LIMIT mutation payload** (L8–L15).
- `src/features/booking/components/__tests__/prenotazioni.adminBlindatura.test.tsx` (15) → conferme
  coerenti archivio + **D4 modale orario reinserisci senza slot salvati** + **R1/D2 modal layout** + **U4 doppio click guard sincrono** + LIMIT UI/capienza.
- **D3 contatore restore** (migrazione `044`): controtestato direttamente su DB TEST (ciclo accetta→elimina→reinserisci, `bookings_count` invariato al restore); logica del trigger SQL, nessun unit.
- `e2e/admin-booking-mgmt.spec.ts` → marcatore E2E (staging, solo Desktop Chrome).

Componente conferma riusabile: `BookingDangerActionModal.tsx` (Elimina, No-show, Reinserisci con orari
già salvati, Riporta in attesa, Rifiuta) — **R1:** `max-h-[90vh]`, area scroll, bottoni `flex-col sm:flex-row`.
Modale orario reinserisci: `RestoreBookingTimeModal.tsx` (deleted senza slot confermati).

Fase D — esiti controtest (07-06-26) post-fix batch:

| Fronte | Esito | Finding principali |
|---|---|---|
| Flusso dati | D1/D5/D3 ✅ | Race pending guard; restore pulisce `cancellation_*`; **D3 contatore restore (migr. 044)** |
| Flusso utente | D2/D4/U2/U6/U7 ✅ | No doppio submit; reinserisci orario; **annulla ripristina campi (U2); drawer auto-chiusura (U6); chiusura bloccata in save (U7)** |
| Limit test | 15 test | L4/L10–L12 FU validazione ospiti (fuori batch) |
| Responsive | R1 ✅ QA browser | 375/834/1280: bottoni Elimina/Rifiuta in viewport con textarea piena |

act() warning risolti in `prenotazioni.adminBlindatura.test.tsx` (ArchiveTab expand/modale).

Buchi residui (post-batch):

- **U3** tab switch durante mutation (vincolo strutturale dashboard); **U9** banner errore inline (toast già presente); **D6/D7** guard DB difensivi; L4/L10–L12 validazione ospiti; test integrazione PendingRequestsTab warning capienza/orario passato; **QA browser reale modali admin loggato** (FU-043).
- E2E Playwright su accept capienza/orario passato (warning non blocco) con dati staging.
- E2E responsive modali conferma in admin loggato (E1–E5).
- Test email fallita non blocca mutation (§6 `ADMIN_PRENOTAZIONI_CONTEXT.md`).

## 9. Area 1 — Shell (aggiornamento decisioni 06-06-26)

Matteo: **Area 1 ✅ PROD solo con E2E browser reali** (non basta solo unit). Strategia test: provare a
rompere layout responsive e logiche conflittuali, verificare che l'app protegga l'utente.

Debiti chiusi in codice:

- `AdminAuthProvider` — sessione admin condivisa (fix doppio hook).
- Rimosso percorso `settings` latente sidebar + `restaurantSettingsSignal`.

Stato: **intervista chiusa, blindatura avviata**.

Decisioni Matteo recepite nei test:

- staff/admin stesso accesso;
- Classic senza sidebar;
- Pro/Enterprise con sidebar e feature modulabili;
- Home nascosta se `features.home=false`;
- logout bloccato dal guard modifiche non salvate;
- refresh/back migliorati con sotto-route per sezioni shell e tab dashboard;
- fallback header neutro `Sistema Gestionale Prenotazioni`.

Test marcati o creati:

- `e2e/admin-login.spec.ts` -> `@admin-blindatura: shell-login`.
- `e2e/admin-classic-tabs.spec.ts` -> `@admin-blindatura: shell-edition`.
- `e2e/pro/pro-sidebar-nav.spec.ts` -> `@admin-blindatura: shell-sidebar`.
- `src/components/layout/__tests__/adminShellRouting.test.ts`:
  - `@admin-blindatura: shell-edition` su Classic e route Pro non accessibili;
  - `@admin-blindatura: shell-sidebar` su `features.home=false`;
  - `@admin-blindatura: shell-refresh-back` su path canonici, risoluzione route e URL tab dashboard
    (`/admin/calendario`, `/admin/prenotazioni`, `/admin/archivio`, `/admin/menu`,
    `/admin/impostazioni`);
  - `@admin-blindatura: shell-logout` su logout subordinato al guard.
- `src/pages/__tests__/AdminDashboard.adminRouting.test.tsx` -> `@admin-blindatura: shell-refresh-back`
  su URL `/admin/prenotazioni` (tab Prenotazioni, non Calendario) e cambio tab via NavItem.
- `src/config/__tests__/features.test.ts` -> `@admin-blindatura: shell-edition` su QR Menu
  aggiungibile/rimuovibile via override.
- `src/contexts/__tests__/UnsavedChangesContext.adminBlindatura.test.tsx` ->
  `@admin-blindatura: shell-dirty-guard` (creato 06-06; E2E dirty/logout anche in `admin-shell-blindatura.spec.ts`).
- `src/components/layout/__tests__/adminShellTabFlash.test.tsx` ->
  `@admin-blindatura: shell-refresh-back` su **assenza di flash** al cambio tab dashboard e al cambio
  sezione sidebar (la schermata vecchia non riappare per un render intermedio). Regressione del bug
  "stato duplicato tab/sezione che si rincorre con l'URL", risolto 06-06-26 derivando da URL.

Test esistenti ancora candidati da valutare nel giro E2E completo:

- `e2e/pro/pro-login.spec.ts` -> candidato `@admin-blindatura: shell-login`.
- `e2e/pro/pro-home.spec.ts` -> candidato `@admin-blindatura: shell-sidebar` / `shell-edition`.
- `e2e/edition-classic.spec.ts` -> candidato `@admin-blindatura: shell-edition`.
- `e2e/edition-upgrade.spec.ts` -> candidato `@admin-blindatura: shell-edition`.

E2E FU-042 chiusi (10-06-26) in `e2e/admin-shell-blindatura.spec.ts`:

- `@admin-blindatura: shell-refresh-back` — Pro: reload `/admin/crm`, CRM→Servizio→browser back; Classic:
  reload `/admin/prenotazioni` mantiene tab Prenotazioni.
- `@admin-blindatura: shell-dirty-guard` + `shell-logout` — Classic: cambio tema Impostazioni senza Salva →
  logout → modale guard → Resta qui / Annulla e continua.

Allineamenti mirati suite esistente (stesso giro):

- `e2e/admin-login.spec.ts` — selettori logout/toast errore aggiornati.
- `e2e/pro/pro-sidebar-nav.spec.ts` — sidebar `complementary` (non `navigation`); rimosso bottone
  Prenotazioni in sidebar (ritorno dashboard via X da CRM).

Buchi / controlli residui Shell (fuori M1):

- Verifica che la action `settings` latente resti non esposta o venga rimossa in Area Settings (M4).
- E2E anagrafica testo con autosave OFF (comportamento prod FU-004) — oggi dirty guard E2E usa tema
  (non in autosave) per affidabilità in `npm run dev`.
