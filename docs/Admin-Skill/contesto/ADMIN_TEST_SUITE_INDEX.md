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
| `e2e/admin-classic-tabs.spec.ts` | tab Classic |
| `e2e/admin-booking-mgmt.spec.ts` | gestione prenotazioni admin |
| `e2e/menu-crud.spec.ts` | CRUD menu |
| `e2e/pro/pro-login.spec.ts` | login Pro |
| `e2e/pro/pro-sidebar-nav.spec.ts` | sidebar Pro |
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

- Logout con dirty state.
- Refresh/back da sezioni interne non URL.
- Home con `features.home=false` e sidebar attiva.
- Delete cliente CRM con booking collegate.
- Rename/delete categoria menu con sync QR/Prenota.
- Walk-in tavolo occupato.
- Service slot override `date_from/date_to`.
- Analytics booking create fuori periodo ma evento dentro periodo.

## 8. Area 2 — Prenotazioni operative

Stato: **Fase D completata 07-06-26** — finding raccolti, fix in attesa decisione Matteo.

Test marcati (24 test, verdi):

- `src/features/booking/hooks/__tests__/useBookingMutations.prenotazioni.adminBlindatura.test.tsx` (14) →
  accept/reject/soft-delete/restore/requeue/no-show + **LIMIT mutation payload** (L8–L15: testi lunghi,
  ospiti 0/negativi/enormi, date mezzanotte/passato/+10 anni).
- `src/features/booking/components/__tests__/prenotazioni.adminBlindatura.test.tsx` (10) → conferme
  coerenti archivio (no `window.confirm`) + `BookingDangerActionModal` + **LIMIT UI archivio** (L1–L5:
  testi lunghi, ospiti anomali, 200 card) + **LIMIT capienza** (L6–L7: bordo esatto e +1).
- `e2e/admin-booking-mgmt.spec.ts` → marcatore E2E (staging, solo Desktop Chrome).

Componente conferma riusabile: `BookingDangerActionModal.tsx` (Elimina, No-show, Reinserisci,
Riporta in attesa, Rifiuta).

Fase D — esiti controtest (07-06-26):

| Fronte | Esito | Finding principali |
|---|---|---|
| Flusso dati | 7 finding | **D1 ALTO** race pending→accepted sovrascritto; D2/D3 MEDIO doppio accept email + contatore usage |
| Flusso utente | 10 finding | **U6** drawer stale; U2 annulla modifica; U3/U4/U5/U7/U8 doppio submit / tab unmount / scroll |
| Limit test | 15 test aggiunti | L4/L10–L12 FU validazione ospiti; L14 FU integrazione PastStartTimeWarningModal |
| Responsive | analisi statica | **R1 ALTO** 375px bottoni fuori viewport con textarea; R2 MEDIO bottoni affiancati |

act() warning risolti in `prenotazioni.adminBlindatura.test.tsx` (ArchiveTab expand/modale).

Buchi residui (post-Fase D):

- Fix prodotto su finding D1, R1, U2, U6 (priorità — decisione Matteo).
- E2E Playwright su accept capienza/orario passato (warning non blocco) con dati staging.
- E2E responsive 375/834/1280 su modali conferma (E1–E5 suggeriti dal sub-agent responsive).
- Test component `PendingRequestsTab` su `CapacityWarningModal` / `PastStartTimeWarningModal`.
- Test `BookingDetailsModal` — annulla modifica, no doppio toast, drawer stale.
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
- **Buco:** test dedicato `@admin-blindatura: shell-dirty-guard` su `UnsavedChangesContext` — file
  `UnsavedChangesContext.adminBlindatura.test.tsx` **non ancora creato** (guard coperto indirettamente
  da AdminShell routing/logout test).
- `src/components/layout/__tests__/adminShellTabFlash.test.tsx` ->
  `@admin-blindatura: shell-refresh-back` su **assenza di flash** al cambio tab dashboard e al cambio
  sezione sidebar (la schermata vecchia non riappare per un render intermedio). Regressione del bug
  "stato duplicato tab/sezione che si rincorre con l'URL", risolto 06-06-26 derivando da URL.

Test esistenti ancora candidati da valutare nel giro E2E completo:

- `e2e/pro/pro-login.spec.ts` -> candidato `@admin-blindatura: shell-login`.
- `e2e/pro/pro-home.spec.ts` -> candidato `@admin-blindatura: shell-sidebar` / `shell-edition`.
- `e2e/edition-classic.spec.ts` -> candidato `@admin-blindatura: shell-edition`.
- `e2e/edition-upgrade.spec.ts` -> candidato `@admin-blindatura: shell-edition`.

Buchi / controlli residui Shell:

- E2E reale su `/admin/crm` refresh e back browser con tenant Pro configurato.
- E2E reale su logout dirty dentro una schermata impostazioni con handler di salvataggio attivo.
- Verifica che la action `settings` latente resti non esposta o venga rimossa in Area Settings.
