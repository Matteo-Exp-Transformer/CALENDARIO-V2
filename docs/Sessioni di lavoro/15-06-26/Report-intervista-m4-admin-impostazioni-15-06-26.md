# Report — M4 Admin Impostazioni / Personalizza Form (Fase A + B)

**Data:** 15-06-26
**Profilo:** orchestratore senior M4 · branch `env/test` · **solo documentazione + mappatura read-only** (nessun fix codice)
**Scope:** tab Impostazioni (`RestaurantSettingsTab` + `BookingFormConfigPanel`) ↔ impatto Pagina Prenota
**Escluso:** working tree CRM/email (non toccato)

- **Cosa è cambiato:** decisioni intervista M4 consolidate in doc; mappatura codice↔decisioni con tabella gap e checklist Fase C.
- **Cosa resta:** implementazione gap (Fase C), test `@admin-blindatura: settings`, E2E smoke 375/834/1280.
- **Serve una tua azione:** no (prossimo passo = agente Fase C con questo report).

---

## 1. Decisioni intervista M4 (fonte Matteo)

| # | Tema | Decisione |
|---|------|-----------|
| D1 | Permessi | Admin e staff **non distinti**: chi accede all'admin può modificare Impostazioni. |
| D2 | Nome locale | **Obbligatorio** al salvataggio. Se assente prima del primo salvataggio → in Prenota **nessun nome finto** (no fallback inventato). |
| D3 | Contatti | Email, telefono, indirizzo **opzionali**; se vuoti **non compaiono** nel footer Prenota. |
| D4 | Cap UI anagrafica | Nome **45** (già deciso FU-032), email **65**, telefono **30**, indirizzo **120**. Registry/UI coerenti; input non oltre cap. |
| D5 | Orari apertura | **Opzionali**: possono essere nascosti/disattivati; **non bloccano** prenotazioni. |
| D6 | Orari malformati | Admin: **blocca salvataggio**. Pubblico: **non crasha**, **non mostra** orari invalidi/assenti. |
| D7 | Fasce/capienze | Admin può **sempre sforare** con avviso (non blocco). |
| D8 | Limite giornaliero | `daily_guest_limit`: blocca **solo Prenota pubblica**; admin può sforare con avviso. **0/vuoto = nessun limite**. |
| D9 | Finestra prenotazione | `booking_window_days`: limita **solo il cliente**; admin può andare oltre con avviso. |

> **Nota (15-06-26, post Fase C):** D9 e gap **G16** sono **superati dalla rimozione fuoriscope** in Fase C — la chiave resta solo nel registry; nessuna UI né consumer pubblico. Vedi [Report Fase C](Report-fase-c-m4-admin-impostazioni-15-06-26.md) §Fuoriscope.
| D10 | Timezone | Setting **tecnico nascosto**, default **Italia / `Europe/Rome`**, **nessuna UI Classic**. |
| D11 | Tema admin | `app_theme` = **solo back-office**, non cambia Prenota/QR. |
| D12 | Presentazione form | **Card scorrevole** e **Carosello** entrambi **core**. Cambio presentazione → conferma distruttiva (cancella sottotab). FU-009 resta QA CRUD slide admin. |
| D13 | Salvataggio / guard | **Un solo** percorso «Salva modifiche» + `PublicDataSaveConfirmModal` + dirty guard su cambio tab/sezione/logout **per area modificata**. |
| D14 | Classic production | Form non configurato → **EmptyState chiaro**; niente fallback inventati su `/prenota`. |
| D15 | Fuori M4 | Pro/CRM/Servizio → tracciare **M5** se emerge in mappa. |

---

## 2. Inventario file mappati (read-only)

### 2.1 Admin — Impostazioni

| File | Ruolo |
|------|--------|
| `RestaurantSettingsTab.tsx` | Tab pill Anagrafica / Personalizza form; anagrafica, orari, fasce Classic, limite giornaliero, tema admin, footer Salva anagrafica |
| `BookingFormConfigPanel.tsx` | Personalizza form: modalità, card/carosello, header, promo, sfondo Prenota (via prop), footer Salva form |
| `BusinessHoursEditor.tsx` | Editor orari per giorno + checkbox «Chiuso» |
| `SettingsSaveUi.tsx` | `SettingsSaveFooter`, `PublicDataSaveConfirmModal`, guard modale navigazione |
| `UnsavedChangesContext.tsx` | Guard globale multi-sorgente (`restaurant-settings`, `booking-form-config`, …) |
| `restaurantSettingRegistry.ts` | Parse/validate/serialize tutte le chiavi V1 |
| `useRestaurantSetting.ts` / `useUpsertRestaurantSetting` | Lettura + upsert con `registry.validate()` |
| `useDebouncedSettingsAutosave.ts` | Autosave debug anagrafica (inerte su PROD — FU-004) |

### 2.2 Cross-impatto Prenota

| File | Ruolo |
|------|--------|
| `BookingRequestPage.tsx` | Header nome, footer Orari+Contatti, EmptyState form |
| `useRestaurantName.ts` | Nome locale pubblico (⚠️ fallback `organizationName`) |
| `useBusinessHours.ts` | Orari pubblici (null se assenti/invalidi) |
| `BookingRequestForm.tsx` | Validazione data/ora vs `businessHours` |
| `BookingSummarySidebar.tsx` | Riepilogo (telefono opzionale in prop) |
| `create-booking/index.ts` | `DAILY_LIMIT` pubblico; **nessun** check `booking_window_days` |

### 2.3 Limiti admin prenotazione

| File | Ruolo |
|------|--------|
| `AdminBookingForm.tsx` | Avviso capienza (incl. limite giornaliero) **non bloccante** |
| `adminBookingForm.dailyLimit.adminBlindatura.test.tsx` | Test avviso admin vs limite giornaliero |

### 2.4 Whitelist anon

| Fonte | Note |
|-------|------|
| `047_restrict_anon_restaurant_settings.sql` | 11 chiavi pubbliche; `timezone`, `booking_window_days`, `daily_guest_limit` **solo admin** |

---

## 3. Tabella gap — decisione vs codice vs test

Legenda esito: ✅ conforme · ⚠️ parziale · ❌ gap · 🔵 voluto/doc · ⬜ test mancante

| ID | Decisione | Stato codice | Evidenza (file/riga) | Test esistenti | Esito |
|----|-----------|--------------|----------------------|----------------|-------|
| G1 | D1 Permessi unificati | Nessun gate staff separato su Impostazioni | `AdminDashboard` → `RestaurantSettingsTab` per tutti gli admin loggati | E2E shell login | ✅ |
| G2 | D2 Nome obbligatorio al Salva | Registry rifiuta stringa vuota; UI **non** disabilita Salva se nome vuoto | `restaurantNameSchema` min(1); `saveDisabled` ignora nome (`RestaurantSettingsTab.tsx` ~1448) | ⬜ | ⚠️ |
| G3 | D2 No nome finto in Prenota | Fallback a `organizationName` se `restaurant_name` assente | `useRestaurantName.ts` L45 `?? organizationName` | ⬜ | ❌ |
| G4 | D3 Contatti opzionali | Email/tel: validate accetta vuoto. **Indirizzo: obbligatorio** in registry | `contact_address` → `genericTextSchema.min(1)` (`restaurantSettingRegistry.ts` L118, L470-477) | ⬜ | ❌ |
| G5 | D3 Contatti vuoti → footer | Footer contatti solo se almeno un campo valorizzato | `BookingRequestPage.tsx` L175-178 | ⬜ | ✅ |
| G6 | D4 Cap nome 45 | Costante **40**, test atteso 40 | `bookingPrenotaTextLimits.ts` L23 `restaurantName: 40`; test L13 «max 40» | Test esiste ma valore **≠ 45** | ❌ |
| G7 | D4 Cap email 65 / tel 30 / addr 120 | Input anagrafica **senza** `maxLength`; registry email max **200**, phone max **50**, address max **200** | `RestaurantSettingsTab.tsx` L1065-1120; schemi Zod L118-120 | ⬜ | ❌ |
| G8 | D5 Orari opzionali, no blocco prenotazioni | Orari usati solo per validazione cliente se presenti; nessun blocco admin | `BookingRequestForm` + `isValidBookingDateTime` | `businessHoursValidation.test.ts` parziale | ✅ |
| G9 | D6 Orari assenti → niente sezione pubblica | Se DB vuoto: oggetto tutti `null` → footer mostra **tutti i giorni «Chiuso»** | `parseBusinessHoursFromDb` → oggetto valido; `showHoursSection = isLoading \|\| businessHours != null` (L176) — **non** usa `hasAnyBusinessHoursConfigured` | ⬜ | ❌ |
| G10 | D6 Malformato admin blocca Salva | Overlap fasce → `validateBusinessHours` + `saveDisabled` | `RestaurantSettingsTab.tsx` L357, L1448 | `businessHoursValidation.test.ts` | ✅ |
| G11 | D6 Malformato pubblico safe | `useBusinessHours` → `null` se parse fallisce; pagina non crasha | `useBusinessHours.ts` L33-37 | `m6ProdReadyPatterns` (no demo inject) | ✅ |
| G12 | D7 Fasce admin avviso non blocco | Classic: `validateEditingSlots` **blocca** Salva se overlap/malformato; capienza card → warning in prenotazioni admin | Coerente M2 per **capienza**; fasce Classic = blocco struttura al Salva (decisione D6 orari, non capienza) | `@admin-blindatura: prenotazioni` | ✅ capienza · 🔵 fasce = validazione struttura |
| G13 | D8 Limite giornaliero pubblico | Edge `DAILY_LIMIT` + UI input in Impostazioni | `create-booking` L349-366; `RestaurantSettingsTab` L1146+ | `restaurantSettingRegistry.dailyGuestLimit.adminBlindatura.test.ts` | ✅ |
| G14 | D8 Admin sforo con avviso | `CapacityWarningModal` non bloccante | `AdminBookingForm.tsx` L369-387 | `adminBookingForm.dailyLimit.adminBlindatura.test.tsx` | ✅ |
| G15 | D8 0/vuoto = illimitato | Registry + UI placeholder «Nessun limite» | `daily_guest_limit` serialize sentinella -1 | Test registry daily limit | ✅ |
| G16 | D9 Finestra prenotazione | Chiave in registry **orfana**: nessuna UI admin, nessun enforcement pubblico, nessun avviso admin | Solo `restaurantSettingRegistry.ts`; grep `src/` = 0 consumer | ⬜ | ❌ |
| G17 | D10 Timezone nascosto | Nessuna UI; chiave **mai** letta/scritta in app; **zero** occorrenze `Europe/Rome` in repo | Registry + migrazione 047 commento | ⬜ | ⚠️ doc/seed |
| G18 | D11 Tema solo admin | `app_theme` letto con `{ authenticated: true }`; non in whitelist anon | `RestaurantSettingsTab` sezione tema | — | ✅ |
| G19 | D12 Card + Carosello core | Entrambi in `SubTabAddButtons`; cambio presentazione con modale distruttiva | `BookingFormConfigPanel.tsx` L218-320, L1660+ | FU-007/008 fix | ✅ |
| G20 | D13 Salva + modale pubblica | Due footer separati (Anagrafica vs Personalizza form), **due** modali `PublicDataSaveConfirmModal`; guard globale unificato su navigazione | `RestaurantSettingsTab` L1442-1460; `BookingFormConfigPanel` L1794-1812; `switchSettingsTab` → `confirmNavigation` | FU-005 chiuso | ⚠️ |
| G21 | D13 Un guard modifiche pubbliche | Due sorgenti dirty distinte: `restaurant-settings` e `booking-form-config` | `UnsavedChangesContext` multi-entry | E2E shell dirty guard | ⚠️ |
| G22 | D14 EmptyState form | `formConfig === null` → messaggio chiaro | `BookingRequestPage.tsx` L307-320 | M6 fallback report | ✅ |
| G23 | D14 No fallback config | `parseFromDb` → null se assente | registry `booking_public_form_config` | M6 test | ✅ |

---

## 4. Finding attesi — esito verifica

| Finding atteso | Esito |
|----------------|-------|
| `contact_address` validato obbligatorio → deve essere opzionale | **Confermato** (G4) |
| Cap UI contatti coerenti, no input oltre cap | **Confermato** (G7) |
| Orari disattivati → footer senza sezione Orari | **Confermato** (G9) — oggi mostra «Chiuso» per ogni giorno |
| Timezone tecnico/nascosto, documentato | **Parziale** (G17) — nascosto sì, default `Europe/Rome` non implementato |
| Un solo footer + modale dati pubblici | **Parziale** (G20) — un footer **per sotto-tab** Impostazioni, non uno unico cross-tab |
| Nome assente → no finto in Prenota | **Confermato gap** (G3) — fallback `organizationName` |

---

## 5. Debiti nuovi (non duplicano FU-009 / FU-023)

| ID proposto | Descrizione | Priorità Fase C |
|-------------|-------------|-----------------|
| **FU-M4-1** | **`booking_window_days` orfano** — UI Impostazioni + limite data in `BookingRequestForm` + check edge `create-booking` + avviso non bloccante `AdminBookingForm` | Alta |
| **FU-M4-2** | **`useRestaurantName`**: rimuovere fallback `organizationName` su Pagina Prenota (D2) | Alta |
| **FU-M4-3** | **Anagrafica contatti**: `contact_address` opzionale + cap 65/30/120 in costanti, UI, registry Zod | Alta |
| **FU-M4-4** | **Nome locale cap 45**: riallineare a FU-032 (oggi regressione a 40 in costante/test) | Media |
| **FU-M4-5** | **Footer orari Prenota**: usare `hasAnyBusinessHoursConfigured` — se nessun giorno aperto, nascondere intera sezione Orari | Media |
| **FU-M4-6** | **Salva anagrafica**: bloccare footer se `restaurant_name` trim vuoto (prima della modale pubblica) | Media |
| **FU-M4-7** | **Timezone default** `Europe/Rome` in parse/seed tecnico + nota in `ADMIN_SETTINGS_CONTEXT` (senza UI) | Bassa |

**Promosso in FOLLOW_UP:** riga consolidata **FU-M4** (15-06-26). Dettaglio sotto-tabella FU-M4-1…7 resta checklist interna Fase C.

**Residui già noti (non duplicare):**

- **FU-009** — QA CRUD slide carosello admin (DOM vuoto 29-05-26).
- **FU-023** — pattern guard modale app-wide (Personalizza form già coperto via `booking-form-config`).

---

## 6. Checklist implementazione Fase C

### 6.1 Anagrafica e registry

- [ ] `bookingPrenotaTextLimits.ts`: aggiungere `contactEmail: 65`, `contactPhone: 30`, `contactAddress: 120`; riportare `restaurantName: 45` (G6/G7).
- [ ] `restaurantSettingRegistry.ts`: `contact_address` validate come email/tel (vuoto OK); schemi max allineati; `restaurant_name` max 45.
- [ ] `RestaurantSettingsTab.tsx`: `maxLength` + contatori su email/tel/indirizzo; `saveDisabled` se nome vuoto; clamp onChange.
- [ ] `useRestaurantName.ts`: **non** fallback `organizationName` (o gate: fallback solo admin shell, non `/prenota`).
- [ ] Test `@admin-blindatura: settings-registry` — nome obbligatorio, contatti opzionali, cap contatti, daily 0/vuoto.

### 6.2 Orari

- [ ] `BookingRequestPage.tsx`: `showHoursSection` = `hasAnyBusinessHoursConfigured(businessHours)` (non solo `!= null`); durante loading comportamento esplicito.
- [ ] Verificare admin: tutti giorni chiusi → salvataggio OK; overlap → blocco (già OK).
- [ ] Test `@admin-blindatura: settings-business-hours` — tutti vuoti = sezione pubblica nascosta; malformato admin non salva; pubblico non crasha.

### 6.3 Limiti prenotazione

- [ ] **FU-M4-1**: input `booking_window_days` in `RestaurantSettingsTab` (Classic, vicino limite giornaliero).
- [ ] `BookingRequestForm.tsx`: max date = oggi + N giorni (leggere setting authenticated o esporre cap pubblico sicuro).
- [ ] `create-booking/index.ts`: rifiuto 400 se data oltre finestra (solo pubblico).
- [ ] `AdminBookingForm.tsx`: avviso non bloccante se data oltre finestra (pattern capienza).
- [ ] Test admin booking window + edge.

### 6.4 Salvataggio / guard

- [ ] Confermare con Matteo se D13 richiede **footer unico cross-tab** (Anagrafica+Form) o solo «un footer per tab, una modale» → **Implementato 15-06-26 Fase C:** footer + modale unificati in `RestaurantSettingsTab`.
- [ ] Se unificazione: dirty combinato + single `PublicDataSaveConfirmModal` in `RestaurantSettingsTab` padre.
- [ ] Test component: modale dati pubblici **una volta** per salvataggio anagrafica; guard su switch pill Anagrafica↔Form.

### 6.5 Personalizza form

- [ ] Nessun fix presentazione card/carosello salvo esito QA FU-009.
- [ ] Regression test cambio presentazione → modale + wipe sottotab.

### 6.6 E2E / smoke

- [ ] Viewport **375 / 834 / 1280**: Anagrafica save blocked nome vuoto; contatti vuoti OK; footer Prenota senza orari se disattivati; EmptyState tenant senza config; guard uscita con dirty.

### 6.7 Chiusura area

- [ ] `npm run validate` verde.
- [ ] Aggiornare `ADMIN_TEST_SUITE_INDEX.md` marcatori `@admin-blindatura: settings-*`.
- [ ] `PLAN_BLINDATURA_ADMIN.md` Area 3 → stato mappa chiusa / Fase C in corso.

---

## 7. Test minimi richiesti (marcatore proposto)

```ts
// @admin-blindatura: settings-registry
// Copre: nome obbligatorio, contatti opzionali, cap contatti, daily_guest_limit vuoto/0

// @admin-blindatura: settings-anagrafica-ui
// Copre: saveDisabled nome vuoto, contatti vuoti salvabili, PublicDataSaveConfirmModal una volta

// @admin-blindatura: settings-business-hours
// Copre: tutti chiusi → footer Prenota senza Orari; overlap → admin non salva; pubblico safe
```

> **Nota (15-06-26):** il marcatore `settings-booking-window` (D9/G16) è **superato dalla rimozione fuoriscope** in Fase C — non costruire test operativi per `booking_window_days` finché Matteo non riapre la decisione.

---

## 8. Prompt pronto — Fase C

```text
Profilo: agente senior M4 Admin Impostazioni — Fase C implementazione.
Branch: env/test. PROD sola lettura. NON toccare working tree CRM/email.

Parti da:
- docs/Sessioni di lavoro/15-06-26/Report-intervista-m4-admin-impostazioni-15-06-26.md (§3 gap + §6 checklist)
- docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md § Decisioni intervista M4
- docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md §3-quater

Implementa SOLO gap ❌/⚠️ confermati in §3 (ordine: G4/G7/G6/G3 → G9 → G16 → G2/G20 se Matteo conferma unificazione footer).
Test: §7. npm run validate verde. Report sessione Fase C in docs/Sessioni di lavoro/15-06-26/.
```

---

## 9. Test eseguiti in Fase B

| Comando | Esito |
|---------|-------|
| Mappatura grep + lettura file sorgente | Completata (read-only) |
| `npm run validate` | **Non eseguito** (Fase B senza modifiche codice) |

---

## 10. File skill aggiornati (Fase A)

| File | Modifica | Perché |
|------|----------|--------|
| `docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md` | § Decisioni intervista M4 | Stato stabile area |
| `docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md` | §3-quater Area 3 | Dettaglio M4 nel piano blindatura |
| `docs/Sessioni di lavoro/15-06-26/Report-intervista-m4-admin-impostazioni-15-06-26.md` | Creato | Report intervista + mappa gap |
| `docs/FOLLOW_UP.md` | Riga **FU-M4** | Debito consolidato Fase C (post-mappa) |

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) «M4 Admin Impostazioni / Personalizza Form — Piano Agenti» con sintesi obiettivo, decisioni fissate (D1–D15), Fase A documentazione, Fase B mappatura read-only, Fase C solo dopo gap, vincoli branch env/test / no PROD / no working tree CRM-email, output atteso report + context + tabella gap + checklist Fase C, chiusura «se non hai dubbi esegui il plan». (2) «⚠️ FINE-SESSIONE — la sezione «Domande di chiusura» (CHIUSURA_SESSIONE §11) non è completa… Aggiungila e rispondi» con obbligo di rileggere diff e file per Q2/Q3.

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Diff sessione = **solo docs** (`git diff --stat`: 3 file tracked + report untracked nuovo): `PLAN_BLINDATURA_ADMIN.md` +49 righe (§3-quater + tabella area 3 + registro stati 🟡), `ADMIN_SETTINGS_CONTEXT.md` +55 righe (§8 decisioni M4), `FOLLOW_UP.md` +1 riga FU-M4. **Riaperti ora per controverifica gap citati nel report (codice invariato):** `bookingPrenotaTextLimits.ts` → `restaurantName: 40` (non 45, G6 confermato); `useRestaurantName.ts` L45 → fallback `organizationName` (G3); `restaurantSettingRegistry.ts` → `genericTextSchema.min(1)` su indirizzo (G4); grep `booking_window_days` in `src/` → solo registry, zero consumer (G16); `BookingRequestPage.tsx` L176 → `showHoursSection = isLoading || businessHours != null` (G9). **Correzione report:** §10 diceva «FOLLOW_UP non aggiornato» ma il diff include già FU-M4 — allineato in tabella §10 sopra.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: **Aggiornati in sessione:** `ADMIN_SETTINGS_CONTEXT.md` (decisioni + divieti + link report), `PLAN_BLINDATURA_ADMIN.md` (§3-quater + stato area 3), `FOLLOW_UP.md` (FU-M4), report M4. **Verificati NON toccati (corretto per Fase A+B):** `ADMIN_TEST_SUITE_INDEX.md` (marcatori `@admin-blindatura: settings-*` restano Fase C), `PRENOTA_LAYOUT_CONTEXT.md` / `PRENOTA_FORM_CONFIG_CONTEXT.md` (nessun cambio comportamento ancora), `src/types/database.ts` e codice app (zero diff applicativo). **Non aggiornato:** `docs/SESSION_LOG.md` — sessione doc-only, da riga in chiusura commit se Matteo chiede report finale.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: **Non fatto per scope esplicito:** Fase C (fix codice), `npm run validate`, test `@admin-blindatura: settings-*`, E2E 375/834/1280, aggiornamento `ADMIN_TEST_SUITE_INDEX.md`, promozione singole righe FU-M4-1…7 in FOLLOW_UP (consolidate in FU-M4). **Non fatto per vincolo working tree:** nessun file CRM/email nel diff. **Micro-debito doc:** §5 report ancora elenca FU-M4-1…7 come «non aggiunti a FOLLOW_UP» mentre §10/FOLLOW_UP reale ha FU-M4 consolidato — coerenza operativa ok, numerazione interna §5 resta checklist Fase C.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: **Attrito:** il piano M4 elenca ~15 file da mappare ma non un mini-indice «leggi prima questi 3 hook» → rischio di grep dispersivo; **miglioria:** in `ADMIN_SETTINGS_CONTEXT.md` §2 aggiungere sotto-tabella «file ordine lettura mappa» (registry → RestaurantSettingsTab → BookingRequestPage) come già fatto in PLAN §3-quater.2.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: **Contesto giusto** — ADMIN skill + PLAN Area 3 + CHIUSURA format sufficienti per Fase A+B senza aprire CRM skill. **Hook fine-sessione utile:** ha intercettato §11 mancante (report aveva «La mia lettura» al posto delle 6 Q/R); senza quel nudge il report sarebbe passato incompleto. **Rumore zero** sui comandi base (profilo esecuzione rispettato: doc first, no codice).

---

## 12. La mia lettura della sessione

**Impressioni:** il codice M2/M6 ha già coperto bene limite giornaliero, EmptyState form, modale dati pubblici (FU-005) e presentazione card/carosello. I gap più grossi sono **orfani di product** (`booking_window_days`), **regressioni** (cap nome 40 vs 45), e **fallback** (`organizationName`, indirizzo obbligatorio, sezione Orari «tutto chiuso»).

**Difficoltà:** working tree sporco CRM/email — mappatura limitata a file settings/Prenota senza toccare il diff aperto.

**Miglioria suggerita:** nel registry, separare schemi «testo opzionale» da `genericTextSchema` obbligatorio — oggi `contact_address` condivide pattern che non scala per altri campi opzionali futuri.
