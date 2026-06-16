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
| `@admin-blindatura: menu-magazzino-sync` | Rename/delete categoria → sync QR + form (controtest parziale) |
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
| `e2e/admin-calendar-blindatura.spec.ts` | smoke Calendario: badge mese con limite/>100%, badge senza limite, digest, nuova prenotazione, **ordine fasce digest post-riordino `display_order`** |
| `e2e/admin-settings-blindatura.spec.ts` | smoke Impostazioni: anagrafica, footer, dirty guard tema, anteprime tema/sfondo 375/900/1256 |
| `e2e/admin-menu-magazzino-blindatura.spec.ts` | Menu/Magazzino: toggle disponibilità, propagazione Prenota/QR, responsive |
| `e2e/admin-menu-magazzino-ct.spec.ts` | Menu/Magazzino controtest browser |
| `e2e/pro/pro-login.spec.ts` | login Pro |
| `e2e/pro/pro-sidebar-nav.spec.ts` | sidebar Pro — `aside` con `role="complementary"` (non `navigation`); ritorno dashboard da CRM via pulsante X |
| `e2e/pro/pro-home.spec.ts` | Home Pro |
| `e2e/pro/pro-crm.spec.ts` | CRM Pro smoke: Rubrica, Personalizza email, stati vuoti stabili |
| `e2e/pro/pro-service.spec.ts` | Servizio Pro smoke: apertura da sidebar, Lista/Mappa, ritorno dashboard |
| `e2e/pro/pro-analytics.spec.ts` | Analytics Pro smoke: KPI/stati vuoti, periodi e filtro turno |
| `e2e/edition-classic.spec.ts` | gating Classic |
| `e2e/edition-classic-data-protection.spec.ts` | protezione dati Classic |
| `e2e/edition-upgrade.spec.ts` | upgrade edition/feature |
| `e2e/public-booking.spec.ts` | collegamento admin/Prenota lato pubblico |
| `e2e/menu-crud.spec.ts` | suite legacy saltata: sostituita da `admin-menu-magazzino-*` |

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
- `src/features/booking/lib/__tests__/restaurantSettingRegistry.dailyGuestLimit.adminBlindatura.test.ts`
- `src/features/booking/components/__tests__/BookingRequestForm.flussoUtente.test.tsx`

### E2E smoke settings / calendario

- `e2e/admin-calendar-blindatura.spec.ts` -> smoke browser su badge mese con limite/>100%, badge senza limite, digest e `+ Nuova prenotazione`
- `e2e/admin-settings-blindatura.spec.ts` -> smoke browser su anagrafica, footer, dirty guard tema e modali anteprima tema/sfondo 375/900/1256

### 3-bis. M4 Impostazioni — `@admin-blindatura: settings-*` (15-06-26)

| Marcatore | File | Casi |
|---|---|---|
| `settings-registry` | `restaurantSettingRegistry.settingsM4.adminBlindatura.test.ts` | 5 — nome obbligatorio, contatti opzionali, cap 45/65/30/120, daily 0/vuoto |
| `settings-anagrafica-ui` | `settingsAnagraficaUi.settingsM4.adminBlindatura.test.tsx` | 8 — contatti vuoti OK, nome vuoto blocca con toast+scroll+pulse, modale pubblica una volta, guard pill, errore save, save aggregato |
| `settings-save-guard` | `settingsSaveGuard.settingsM4.adminBlindatura.test.tsx` | 12 — footer unico padre, modale pubblica singola, no doppia mutation, fail+retry, guard pill/logout durante pending, guard «Salva e continua» durante save pubblico, FIX 4 scroll+pulse su primo errore nome/orari |
| `settings-time-slots` | `settingsTimeSlots.settingsM4.adminBlindatura.test.tsx` + `bookingTimeSlots.settingsM4.adminBlindatura.test.ts` + `restaurantSettingRegistry.slotGuestCapacities.settingsM4.adminBlindatura.test.ts` | 24 — enable/disable, add, delete modale in-app (Annulla/Conferma, no `window.confirm`), overlap blocca save con scroll+pulse, overnight hint, cap per-fascia vs `daily_guest_limit`, cap invalido/alto, delete+save→`deleteServiceSlot`, mutation fail+retry, FIX 3 riordino manuale con `display_order` e capienze per-id |
| `settings-theme` | `appTheme.settingsM4.adminBlindatura.test.ts` + `settingsTheme.settingsM4.adminBlindatura.test.tsx` | 13 — dirty tema, anteprima senza persist, Annulla ripristina, Salva `app_theme` senza sfondo Prenota, ID/asset sconosciuti safe, isolamento Prenota/Menu QR |
| `settings-business-hours` | `businessHours.settingsM4.adminBlindatura.test.ts` | tutti chiusi → no sezione; overlap admin; parse pubblico safe |
| `settings-business-hours-editor` | `businessHoursEditor.settingsM4.adminBlindatura.test.tsx` | 4 (FIX 2, 16-06-26) — giorno chiuso→aperto popola pranzo 06:30–16:30 + cena 17:30–23:30 insieme; giorno con apertura esistente: "Aggiungi apertura" non sovrascrive, solo append; Annulla (rispunta Chiuso) ripristina lo snapshot, non i nuovi default; overlap manuale resta bloccato |
| `settings-modal-framing` | `modalFraming.settingsM4.adminBlindatura.test.tsx` (`src/components/ui/__tests__/`) | 3 (FIX 7, 16-06-26) — apertura modale: focus + scrollIntoView block:start sul dialog; z-[10050] non toccato; modale chiusa non chiama scrollIntoView |
| `settings-background` | `settingsBackground.adminBlindatura.test.ts` + `publicBookingSurface.test.ts` | XOR striscia/full-page; legacy gradient/tile → neutro; superficie light = crema |
| `settings-form-config` | `settingsFormConfig.settingsM4.adminBlindatura.test.tsx` | 12 — delete card/carosello (D-M1); zero modalità; cap header/modalità/card; config null/legacy; pubblico legacy parseFromDb |
| `settings-promo` | `settingsPromo.settingsM4.adminBlindatura.test.tsx` | 8 — FIX 6: delete/toggle/apply solo locale+dirty, nessuna mutation autonoma; `ref.save()` persiste dal footer; fail save rilanciato; `ref.cancel()` ripristina; label da config |
| `settings-carousel-crud` | `settingsCarouselCrud.settingsM4.adminBlindatura.test.ts` + `settingsCarouselCrud.settingsM4.adminBlindatura.test.tsx` | 12 — crea carosello; add/replace/delete/reorder slide (upload mock); testi slide; salva+parseFromDb; legacy/null safe; effetto Prenota pubblico |

Gate Batch 1/2 (15-06-26, agg. §5A/§5B P2): run aggregato **35 test** verdi — `settingsFormConfig.settingsM4`, `settingsPromo.settingsM4`, `settingsBackground.adminBlindatura`, `publicBookingSurface`.

Gate Area B2 (16-06-26): run aggregato **35 test** verdi — `settingsSaveGuard.settingsM4` 12/12, `settingsTimeSlots.settingsM4` 15/15, `settingsPromo.settingsM4` 8/8.

**QA browser Area 3 / M4 (16-06-26):** Fase D rompi + viewport documentati; addendum finale `admin-settings-blindatura.spec.ts` **6/6** su **375 / 900 / 1256** copre footer/guard e modali anteprima tema + sfondo senza click intercettati, console pulita. **FU-009** upload foto carosello reale Supabase + overlay pubblico verificato su TEST (`Report-finale-area3-impostazioni-15-06-26.md`). **M4 Impostazioni = blindata** (16-06-26). Residuo infra: Playwright admin login headless locale intermittente — non blocca blindatura.

## 3-ter. Area 3 — Impostazioni locale (M4) — blindato ✅ (16-06-26)

Stato: **cancello M4 Impostazioni chiuso** — Vitest `settings-*` **120/120** (17 file, gate Batch 1/2 **35/35** incluso); `npm run validate` **758/758** al 16-06-26; E2E smoke `admin-settings-blindatura.spec.ts` **6/6** copre anagrafica/footer/dirty guard e anteprime tema/sfondo su 375/900/1256; report finale [`Report-finale-area3-impostazioni-15-06-26.md`](../../Sessioni%20di%20lavoro/15-06-26/Blindatura%20ADMIN/Report-finale-area3-impostazioni-15-06-26.md). Prompt sequenziali: [`Prompt-agenti-test-blindatura-admin-impostazioni.md`](../../Sessioni%20di%20lavoro/15-06-26/Blindatura%20ADMIN/Prompt-agenti-test-blindatura-admin-impostazioni.md). Residuo fuori cancello: **FU-051** date mock; ~~copertura E2E calendario post-riordino fasce~~ ✅ chiuso 17-06-26 (`admin-calendar-blindatura.spec.ts` scenario `display_order`).

## 4. Unit/component per menu magazzino/QR

- `src/features/booking/hooks/__tests__/useMenuCategories.test.tsx`
- `src/features/booking/components/__tests__/menuPricesEditClose.adminBlindatura.test.tsx` — FIX 1 (batch UX 9-fix, Area A): chiude il form di Modifica Prodotto dopo «Salva» con lo stesso reset usato da «Nuovo Prodotto»; rompi Modifica→Annulla→Modifica riparte pulito
- `src/features/booking/components/__tests__/PresetMenuBuilder.prodReady.test.tsx`
- `src/features/booking/components/__tests__/menuQrCategoryFieldCap.test.tsx`
- `src/features/booking/utils/__tests__/menuQrCategoryKeySync.test.ts`
- `src/features/booking/utils/__tests__/bookingFormCategoryKeySync.test.ts`
- `src/features/booking/services/__tests__/menuMagazzinoSync.adminBlindatura.test.ts`
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
- `src/features/booking/components/__tests__/servizioModalsGuard.adminBlindatura.test.tsx` (3) → **FU-023** guard discard modale sala (`RoomConfigModal`: dirty → Annulla → `DiscardChangesConfirmModal`; Resta qui / Annulla modifiche). Tavolo/slot/walk-in: stesso pattern codice + anti-regressione `m6ProdReadyPatterns` (12-06-26).
- `e2e/pro/pro-service.spec.ts` → `@admin-blindatura: servizio` smoke browser Pro senza scritture DB (sidebar → Servizio, Lista/Mappa, Nuova sala, X ritorno dashboard).

## 6. CRM

- `e2e/pro/pro-crm.spec.ts`
- `src/features/booking/utils/__tests__/createBookingCustomerUpsert.test.ts`

## 6-bis. Home / Analytics Pro

- `e2e/pro/pro-home.spec.ts` → Home Pro come entry point e nav verso Calendario/CRM/Servizio.
- `e2e/pro/pro-analytics.spec.ts` → `@admin-blindatura: home-analytics` smoke Analytics: heading, KPI/stati vuoti, periodi, filtro turno.

## 6-ter. Run E2E completo

Run Codex 16-06-26:

```bash
npx playwright test --workers=1
```

Esito: **58 passed, 16 skipped**. Gli skip sono prerequisiti assenti (`E2E_VALID_INVITE_TOKEN` /
credenziali Classic dedicate non valide in questo staging) o suite legacy (`menu-crud`) sostituita dai
test Menu/Magazzino di blindatura.

Addendum visual checklist (16-06-26): `public-booking-smoke.spec.ts` copre sfondo striscia/full-page/
crema + footer Orari assente + EmptyState form non configurato; `public-menu-qr.spec.ts` copre
carosello, tema, ordine categorie, footer data/ora e icona default card senza foto con seed/cleanup
su TEST. `admin-calendar-blindatura.spec.ts` esteso a badge senza limite e oltre 100% reale.

## 7. Buchi iniziali da trasformare in test

- ~~Logout con dirty state.~~ ✅ chiuso M1 — §9 / `admin-shell-blindatura.spec.ts`
- ~~Refresh/back da sezioni interne non URL.~~ ✅ chiuso M1 — §9 / `admin-shell-blindatura.spec.ts` (refresh/back URL; eventuale tab state-only → §9)
- Home con `features.home=false` e sidebar attiva.
- Delete cliente CRM con booking collegate.
- ~~Rename/delete categoria menu con sync QR/Prenota.~~ ✅ Vitest `@admin-blindatura: menu-magazzino-sync` (FU-M3-3, 11-06-26).
- Walk-in tavolo occupato.
- Service slot override `date_from/date_to`.
- Analytics booking create fuori periodo ma evento dentro periodo.

## 8-bis. Area 2-bis — Tab Calendario (M2)

Stato: **batch A+B FU-047 + classificazione doc (11-06-26)** — **41** test Vitest `@admin-blindatura: calendario` (+ **2** test No-show `bookingDetailsModal.noShow`, **fuori** conteggio M2), validate **527** verde. FU-047 **chiuso**: finding Fase C tutti fix o voluto/differito (§5-ter punti 21–22, layout §7-ter). E2E smoke `admin-calendar-blindatura.spec.ts` aggiunto per badge/digest/form. Prossimo cancello: QA badge §9.

### Mapping scenari PLAN §3-ter.3 → test

| # | Scenario | File / describe |
|---|---|---|
| 1 | Solo accettate (no-show/pending assenti; digest senza orario) | `sumGuestsByDate.adminBlindatura.test.ts` (pending/rejected/deleted/no-show) + `calendario.adminBlindatura.test.tsx` → events FC + digest (FU-REV-CAL-1) |
| 2 | Badge % — senza limite conteggio; con limite solo %; 100%=high; >100% over | `calendario.adminBlindatura.test.tsx` → `dayCellDidMount` + registry daily limit |
| 2-bis | Navigazione mese FC → `datesSet` sync `selectedDate` | `calendario.adminBlindatura.test.tsx` → handler `datesSet` |
| 2-ter | Avviso sforo giornaliero form admin (non bloccante) | `adminBookingForm.dailyLimit.adminBlindatura.test.tsx` |
| 2-quater | `sumGuestsByDate` / transform / `useCapacityCheck` allineati | `sumGuestsByDate`, `bookingEventTransform`, `useCapacityCheck` test dedicati |
| 3 | Gate tavolo Classic assente / Pro+slot / Pro senza slot (FU-REV-CAL-2) | `calendario.adminBlindatura.test.tsx` → pallino `Assegna tavolo` + servizio on + `slots:[]` |
| 4 | Crea da giorno — `dateClick` seleziona; pulsante apre form; giorno pieno non blocca | `calendario.adminBlindatura.test.tsx` → `dateClick` + `AdminBookingForm` mock `initialDate` |
| 5 | No drag&drop — config FC senza `editable`/`eventDrop`/`selectable` | `calendario.adminBlindatura.test.tsx` → assert props mock FullCalendar |
| 6 | Elimina solo da modale dettaglio — conferma custom, no `window.confirm` | `calendario.adminBlindatura.test.tsx` → digest → `BookingDetailsModal` → `BookingDangerActionModal` |

### File test marcati

- `src/features/booking/utils/__tests__/sumGuestsByDate.adminBlindatura.test.ts` (7) → conteggio coperti/giorno (stesso criterio blocco pubblico `DAILY_LIMIT`).
- `src/features/booking/lib/__tests__/restaurantSettingRegistry.dailyGuestLimit.adminBlindatura.test.ts` (9) → limite giornaliero `0`/vuoto = illimitato (fix salvataggio Impostazioni).
- `src/features/booking/components/__tests__/calendario.adminBlindatura.test.tsx` (18) → UI `BookingCalendar`: badge, datesSet, gate tavolo (+ Pro slot vuoti), pending assenti, crea-da-giorno, no DnD, elimina da dettaglio (render con `UnsavedChangesProvider`).
- `src/features/booking/components/__tests__/bookingCalendarGuard.adminBlindatura.test.tsx` (4) → **C-U2** guard tab: dirty → modale Salva/Annulla/Resta; pulito → nessun guard; chiusura modale → guard stale assente.
- `src/features/booking/components/__tests__/bookingCalendarTab.adminBlindatura.test.tsx` (1) → C-U4 Riprova su errore `useAcceptedBookings`.
- `src/features/booking/components/__tests__/adminBookingForm.dailyLimit.adminBlindatura.test.tsx` (1) → FU-REV-CAL-3 avviso giornaliero.
- `src/features/booking/utils/__tests__/bookingEventTransform.adminBlindatura.test.ts` (2) → no-show + confirmed_end in transform.
- `src/features/booking/hooks/__tests__/useCapacityCheck.adminBlindatura.test.ts` (2) → no-show esclusi per-fascia.
- `src/features/booking/components/__tests__/bookingDetailsModal.noShow.adminBlindatura.test.tsx` (2) → pulsante No-show su orario **inizio** (addendum Matteo batch B); **fuori** conteggio M2 41.
- `e2e/admin-calendar-blindatura.spec.ts` → smoke browser su badge mese con limite/>100%, badge senza limite, digest, pending/no-show, `+ Nuova prenotazione`, **ordine fasce digest rispetto a `display_order` salvato (3 fasce non cronologiche + prenotazioni per fascia)**.

Pattern: mock `@fullcalendar/react` cattura props (`dateClick`, `dayCellDidMount`, assenza drag); `AdminBookingForm` mock per `initialDate`; `BookingDetailsModal` reale con tab stub + mutation mock.

### Buchi residui (post classificazione FU-047)

- **C-U2** — ✅ **chiuso 11-06-26** (guard tab modale calendario dirty); doc §5-ter punto 22 + test `bookingCalendarGuard`.
- **C-U3** — ⬜ **FU-048** (copy/toggle turni Pro, M5 — non blocca M2 Classic).
- **C-R2** — ✅ **voluto** (badge % solo vista mese); doc §5-ter punto 20 + layout §7-bis.
- **Lacune test** — FU-REV-CAL-4 (nota selettori RTL digest, opzionale); **C-U2 overlay** — test guard copre solo cambio tab simulato, non click overlay (QA manuale Matteo).
- **Deploy edge** — `create-booking` C-D5 parser: fix in repo; deploy TEST su richiesta Matteo.
- **QA browser** badge 375/834/1280 — **cancello Blindato** (MANUALE §9).
- **E2E Playwright calendario** — smoke browser aggiunto su staging TEST (`admin-calendar-blindatura.spec.ts`).

---

## 8. Area 2 — Prenotazioni operative

Stato: **✅ cancello M2 operative chiuso 11-06-26 (FU-043)** — Fase D + FU-046 batch + E2E Playwright staging + QA browser 375/834. **U3/U9 chiusi 12-06-26.** Residui non bloccanti: D6-D7/L* (follow-up).

Test marcati Vitest (35 test core `@admin-blindatura: prenotazioni`, verdi):

- `src/features/booking/hooks/__tests__/useBookingMutations.prenotazioni.adminBlindatura.test.tsx` (17) →
  accept/reject/soft-delete/restore/requeue/no-show + **race guard pending** (D1) + **restore azzera cancellation_*** (D5) + **restore con orario fornito** (D4 affinamento 07-06-26) + **LIMIT mutation payload** (L8–L15).
- `src/features/booking/components/__tests__/prenotazioni.adminBlindatura.test.tsx` (15) → conferme
  coerenti archivio + **D4 modale orario reinserisci senza slot salvati** + **R1/D2 modal layout** + **U4 doppio click guard sincrono** + LIMIT UI/capienza.
- `src/features/booking/components/__tests__/bookingDetailsModal.u3u9.adminBlindatura.test.tsx` (2) → **U3** blocking source durante mutation; **U9** banner `role="alert"` su save fallito.
- `src/contexts/__tests__/UnsavedChangesContext.adminBlindatura.test.tsx` (1, tag prenotazioni) → **U3** `confirmNavigation` con blocking senza modale dirty.
- **D3 contatore restore** (migrazione `044`): controtestato direttamente su DB TEST (ciclo accetta→elimina→reinserisci, `bookings_count` invariato al restore); logica del trigger SQL, nessun unit.
- `e2e/admin-booking-mgmt.spec.ts` → `@admin-blindatura: prenotazioni-e2e` (**7 test**, staging TEST):
  - accept capienza superata → `CapacityWarningModal` → Procedi → `accepted`;
  - accept orario passato → `PastStartTimeWarningModal` → Procedi → `accepted`;
  - Rifiuta/Elimina con textarea lunga — bottoni in viewport a **375** e **834** (admin loggato);
  - seed/cleanup via `e2e/helpers/supabaseStaging.ts` (service role, prefisso `E2E-FU043-`);
  - progetti Playwright: `chromium` + `mobile-chrome` + `tablet-chrome` (`grep`/`grepInvert` su `@viewport:*`).
  - **Nota:** esecuzione consigliata `--workers=1` (seed DB condiviso).

Componente conferma riusabile: `BookingDangerActionModal.tsx` (Elimina, No-show, Reinserisci con orari
già salvati, Riporta in attesa, Rifiuta) — **R1:** `max-h-[90vh]`, area scroll, bottoni `flex-col sm:flex-row`.
Modale orario reinserisci: `RestoreBookingTimeModal.tsx` (deleted senza slot confermati).

Fase D — esiti controtest (07-06-26) post-fix batch:

| Fronte | Esito | Finding principali |
|---|---|---|
| Flusso dati | D1/D5/D3 ✅ | Race pending guard; restore pulisce `cancellation_*`; **D3 contatore restore (migr. 044)** |
| Flusso utente | D2/D4/U2/U6/U7 ✅ | No doppio submit; reinserisci orario; **annulla ripristina campi (U2); drawer auto-chiusura (U6); chiusura bloccata in save (U7)** |
| Limit test | 15 test | L4/L10–L12 FU validazione ospiti (fuori batch) |
| Responsive | R1 ✅ QA browser | 375/834: E2E Playwright admin loggato (FU-043); 1280 coperto da unit R1 |

act() warning risolti in `prenotazioni.adminBlindatura.test.tsx` (ArchiveTab expand/modale).

Buchi residui (post FU-043, non bloccanti cancello M2):

- **D6/D7** guard DB difensivi; **L4/L10–L12** validazione ospiti.
- Test email fallita non blocca mutation (§6 `ADMIN_PRENOTAZIONI_CONTEXT.md`).

**U3/U9 chiusi 12-06-26:** blocking tab durante mutation (`UnsavedChangesContext.registerBlockingSource` + `BookingDetailsModal`); banner errore inline su save fallito. Test **+3** (`bookingDetailsModal.u3u9` ×2, `UnsavedChangesContext` blocking ×1); suite `@admin-blindatura: prenotazioni` **35**; validate verde (576 test totali al tree 12-06-26, include modifiche parallele M6).

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
- `src/contexts/__tests__/UnsavedChangesContext.adminBlindatura.test.tsx` (2) ->
  `@admin-blindatura: shell-dirty-guard` (creato 06-06; E2E dirty/logout anche in `admin-shell-blindatura.spec.ts`).
  Include chiusura guard stale quando le sorgenti dirty si azzerano.
- `src/components/layout/__tests__/adminShellTabFlash.test.tsx` ->
  `@admin-blindatura: shell-refresh-back` su **assenza di flash** al cambio tab dashboard e al cambio
  sezione sidebar (la schermata vecchia non riappare per un render intermedio). Regressione del bug
  "stato duplicato tab/sezione che si rincorre con l'URL", risolto 06-06-26 derivando da URL.

### 8-ter. M3 Menu magazzino — limiti + availability + sync (11-06-26)

Stato: **Fase 1+2+3 + QA E2E base** — 9 test `@admin-blindatura: menu-magazzino-limits` + **9** test
`@admin-blindatura: menu-magazzino-availability` (+1 catalogo admin config QR/card 11-06-26) + 9 test
`@admin-blindatura: menu-magazzino-sync`; E2E Playwright `@admin-blindatura: menu-magazzino` su 1280/375/834;
validate **554** verde.
**Blindato ✅ 11-06-26** — report [`Report-finale-m3-menu-blindato-11-06-26.md`](../Sessioni%20di%20lavoro/11-06-26/Report-finale-m3-menu-blindato-11-06-26.md).
Debiti fuori cancello: ~~**FU-M3-QA-CT**~~ chiuso Ciclo 8 (15-06-26) — spec CT sotto.

| File | Cosa copre |
|---|---|
| `src/features/booking/constants/__tests__/menuMagazzinoLimits.adminBlindatura.test.ts` | Soglie 7/12/6/6; retroattività (blocca solo +1); conteggio per categoria; cap 24/24/79 allineati a FU-030 |
| `src/features/booking/constants/__tests__/menuMagazzinoAvailability.adminBlindatura.test.ts` | Default `is_available` true; categoria/item off; preset+magazzino; QR hidden+magazzino; snapshot intatto; catalogo admin config (filter pubblico) |
| `src/features/booking/services/__tests__/menuMagazzinoSync.adminBlindatura.test.ts` | Rename/delete sync orchestrato (`syncMenuCategoryKeyRename`/`Delete`): QR filter+images, `menu_qrcode_categories`, `hidden_category_keys`/`category_order_keys` form; messaggi modale; **3 controtest parziale** (QR ok/form fail; 2° QR fail; delete ok/form fail); rename con `is_available` off + filtri pubblici |
| `e2e/admin-menu-magazzino-blindatura.spec.ts` | FU-M3-QA-E2E: login staging TEST, toggle categoria/prodotto da Admin Menu, niente toggle disponibilità nell'overlay categoria, propagazione pubblica Menu QR + Prenota, viewport 1280/375/834, teardown `is_available` + dati E2E. Eseguire con `--workers=1` perché i progetti condividono dati staging temporanei |
| `e2e/admin-menu-magazzino-ct.spec.ts` | **FU-M3-QA-CT** (Ciclo 8): controtest «rompi» toggle item — doppio click, refresh con `is_available=false`, «Crea / Modifica Prodotto» durante PATCH lenta; tag `@admin-blindatura: menu-magazzino-ct`; `--workers=1` |

~~Prossimo batch M3 (opzionale): controtest browser extra doppio click/refresh/mutation (**FU-M3-QA-CT**, sessioni future).~~

Test Pro consolidati nel giro E2E completo 16-06-26:

- `e2e/pro/pro-login.spec.ts` -> `@admin-blindatura: shell-login`.
- `e2e/pro/pro-home.spec.ts` -> `@admin-blindatura: home-analytics`.
- `e2e/pro/pro-sidebar-nav.spec.ts` -> `@admin-blindatura: shell-sidebar`.
- `e2e/pro/pro-crm.spec.ts` -> `@admin-blindatura: crm`.
- `e2e/pro/pro-service.spec.ts` -> `@admin-blindatura: servizio`.
- `e2e/pro/pro-analytics.spec.ts` -> `@admin-blindatura: home-analytics`.

`e2e/edition-classic.spec.ts` e `e2e/edition-upgrade.spec.ts` restano validi ma saltano se le credenziali
Classic dedicate non sono configurate correttamente nello staging locale.

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

- ~~Action `settings` latente sidebar~~ — rimossa; Impostazioni resta tab dashboard
  (`/admin/impostazioni`), coperta dal routing shell.
- E2E anagrafica testo con autosave OFF (comportamento prod FU-004) — oggi dirty guard E2E usa tema
  (non in autosave) per affidabilità in `npm run dev`.
