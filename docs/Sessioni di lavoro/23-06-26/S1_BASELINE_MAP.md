# S1 — Baseline Map: Durata Config (Settings → Personalizza Form)

> **Prodotto da:** esecutore read-only 23-06-26.
> **Input:** `docs/MASTERPLAN_SERVIZIO.md` §7 (S1) + `docs/Sessioni di lavoro/23-06-26/S1_PLAN.md`.
> **Status:** READ-ONLY — nessun codice modificato, nessun commit, nessuna scrittura DB.

---

## 1. STORAGE — Conferma JSON / nessuna migrazione DB

**Risposta:** ✅ CONFERMATA. Tutta la struttura `BookingMode` / `SubTab` / `CustomStaffPreset` vive
esclusivamente in righe `setting_value` (tipo `jsonb`) della tabella `restaurant_settings`.

### Flusso di lettura/scrittura

| Layer | File | Riga chiave |
|---|---|---|
| Hook query | [`src/features/booking/hooks/useRestaurantSetting.ts`](../../src/features/booking/hooks/useRestaurantSetting.ts) | `:28` `.eq('setting_key', key)` → `parseFromDb` |
| Hook mutation | stesso file | `:97` upsert `onConflict: 'tenant_id,setting_key'` |
| Registry entry | [`src/features/booking/lib/restaurantSettingRegistry.ts`](../../src/features/booking/lib/restaurantSettingRegistry.ts) | `:576` chiave `'booking_public_form_config'` |
| Chiave DB | stessa riga | `setting_key = 'booking_public_form_config'`, `setting_value = { booking_modes: [...] }` |

### Cosa succede al parse
Il registry entry `booking_public_form_config` (`:576-689`) esegue:
1. `hasUsableBookingModesInRaw(raw)` — ritorna `null` se non c'è nulla di salvato.
2. Ricostruisce ogni `BookingMode` (inclusi i `sub_tabs[]`) con `parseSubTabFromUnknown`.
3. Passa tutto a `normalizeBookingPublicFormConfig` (clamp testi, validate display).
4. `serializeToDb` scrive il JSON grezzo (`:680` `value as unknown as Json`).

### `CustomStaffPreset`
Vive nella chiave separata `'booking_custom_staff_presets'` (`:504-512` del registry).
Il suo schema Zod è `customStaffPresetRowSchema` (`:221-230`). I preset vengono **linkati**
alle `SubTab` via `SubTab.preset_id`; le SubTab (con eventuale durata) stanno in
`booking_public_form_config`, i preset in `booking_custom_staff_presets`.

> **Conclusione: nessuna migrazione DB necessaria per S1.** Aggiungere `duration` a
> `SubTab` e `default_duration` a `BookingMode` / `CustomStaffPreset` è puramente
> additivo: i parser leggono solo i campi che conoscono, i campi assenti rimangono
> `undefined`, il comportamento odierno è invariato.

---

## 2. TIPI — Punti esatti di intervento

### 2a. `SubTab.duration?: number`

**File:** [`src/features/booking/constants/bookingPublicFormConfig.ts`](../../src/features/booking/constants/bookingPublicFormConfig.ts)

| Azione | Riga di riferimento | Descrizione |
|---|---|---|
| **Aggiunta tipo** | `:374` (dopo `compilable_category_keys?`) | `duration?: number` — minuti, opzionale; assente = nessuna durata |
| **Parse difensivo** in `parseSubTabFromUnknown` | `:543–654` | Aggiungere blocco analogo a `price_per_person` (`:558-561`): `if (typeof o.duration === 'number' && o.duration >= MIN && o.duration <= MAX) duration = o.duration` |
| **Scrittura nel parsed** | `:632-652` (costruzione oggetto `parsed`) | Aggiungere `duration` allo spread |
| **Normalize/clamp** in `normalizeBookingPublicFormConfig` | `:776-856` (mapping `base: SubTab`) | Aggiungere clamp analogo a `price_per_person`: se fuori range → `undefined` (non scrivere mai valori non validi) |

### 2b. `BookingMode.default_duration?: number`

**File:** stesso — [`bookingPublicFormConfig.ts`](../../src/features/booking/constants/bookingPublicFormConfig.ts)

| Azione | Riga di riferimento | Descrizione |
|---|---|---|
| **Aggiunta tipo** su `BookingMode` | `:484` (dopo `capabilities?`) | `default_duration?: number` — minuti, opzionale |
| **Parse difensivo** nel registry | [`restaurantSettingRegistry.ts`](../../src/features/booking/lib/restaurantSettingRegistry.ts) `:591-676` (loop `booking_modes`) | Aggiungere lettura `mode.default_duration` con clamp min/max, analogo a come si legge `mode.label` |
| **Normalize/clamp** | `normalizeBookingPublicFormConfig` `:843-854` (costruzione `return` di ciascun `mode`) | Aggiungere `...(clampedDuration != null ? { default_duration: clampedDuration } : {})` per non scrivere il default se assente |

### 2c. `CustomStaffPreset.default_duration?: number`

**File:** [`src/features/booking/constants/presetMenus.ts`](../../src/features/booking/constants/presetMenus.ts)

| Azione | Riga di riferimento | Descrizione |
|---|---|---|
| **Aggiunta tipo** su `CustomStaffPreset` | `:68` (dopo `visible_on_booking?`) | `default_duration?: number` — minuti, opzionale |
| **Parse difensivo** nel registry | [`restaurantSettingRegistry.ts`](../../src/features/booking/lib/restaurantSettingRegistry.ts) `:242-254` (`parseBookingCustomStaffPresetsFromDb`) | Aggiungere lettura `row.default_duration` con clamp, analogo a `price_per_person` (`:251`) |
| **Schema Zod** | stesso file `:221-230` (`customStaffPresetRowSchema`) | Aggiungere `default_duration: z.number().int().min(MIN).max(MAX).optional()` |
| **Serialize** | `:507` `serializeToDb: (value) => value as unknown as Json` | Già generico — nessuna modifica |

### Costanti min/max suggerite (da confermare in Q-S1-1)

```
DURATION_MIN = 30   // min — D13 dice picker da 90, ma "altro" apre free field; 30 è pavimento sicuro
DURATION_MAX = 360  // 6h — proposta plan
```

Queste costanti andrebbero estratte in un file condiviso (es. `bookingDurationLimits.ts`) oppure
dichiarate inline nel parser (pattern già usato per text limits in `bookingPrenotaTextLimits.ts`).

---

## 3. UI — Punti esatti nell'editor card e nell'editor tipologia

### 3a. Editor card (SubTab) — picker durata

**File:** [`src/features/booking/components/settings/BookingFormConfigPanel.tsx`](../../src/features/booking/components/settings/BookingFormConfigPanel.tsx)
**Funzione:** `renderSubTabEditor` (interna, chiamata a `:1985` e `:2089`)

Il **pattern di riferimento** è `renderPriceInput` / `cardPriceSection` a **riga ~1172–1200**:
- `renderPriceInput` (~`:1172`) costruisce l'`<Input type="number">` con `onChange → patchTab({ price_per_person: ... })`.
- `cardPriceSection` (~`:1194-1200`) lo wrappa in un `<div>` con `<Label>`.

**Posizione di inserimento:** subito dopo `cardPriceSection` (o dopo `carouselPriceSection` per
il carosello) — **anche il carosello ha una durata** secondo la gerarchia D35 (la card domina).
Il picker va inserito **solo per `tab.display === 'cards'`** in S1 (il carosello è un caso
borderline da chiarire in Q-S1-2 / Q-S1-4).

Pattern UI da usare (D13: valori pronti + "Altro"):
```tsx
// dopo cardPriceSection, attorno a riga ~1200
<div className="mt-4 w-full min-w-0 space-y-1.5">
  <Label className="block text-sm">Durata tavolo (opzionale)</Label>
  <DurationPicker
    value={tab.duration}
    onChange={(v) => patchTab({ duration: v })}
  />
</div>
```

**Componente picker riutilizzabile esistente:** NO — non esiste un componente generico `DurationPicker`
nel codebase. Va creato come piccolo componente locale o inline. Pattern suggerito: `<select>`
con opzioni fisse 90/120/150/180 + opzione "Altro" che rivela un `<Input type="number">`.
Modello minimale analogo ai `<select>` già presenti nella panel (es. riga ~`:1394`
`select preset_id`).

### 3b. Editor tipologia (BookingMode)

**File:** stesso — `BookingFormConfigPanel.tsx`
**Sezione:** il blocco `{isOpen && (...)}` che si apre a **riga ~1791**, dentro il `.map` delle mode.

**Posizione di inserimento:** subito dopo il blocco "Icona" (riga ~`:1918-1925`) e prima del
toggle "Abilita Card o Carosello" (riga ~`:1927`). Stesso pattern DurationPicker, ma chiama
`updateMode(mode.id, { default_duration: v })`.

> **Nota implementativa:** `updateMode` è una funzione locale al componente che fa
> `setConfig(prev => ... modes.map(m => m.id === id ? { ...m, ...patch } : m) ...)`.
> Aggiungere `default_duration` al tipo di patch è sufficiente — nessuna firma da modificare
> a livello di hook.

---

## 4. INCROCIO MENU (M3)

**Risposta: incrocio PARZIALE — controtest menu-magazzino opportunistico, non obbligatorio.**

### Analisi dettagliata

| Componente | Condiviso con Menu (M3)? | Note |
|---|---|---|
| `SubTab` (tipo) | ✅ Importato da Menu QR (icone `MenuQrCategoryIconKey`) | Solo il **tipo icona** è condiviso; nessuna logica menu dipende da `duration` |
| `CustomStaffPreset` | ✅ Usato in Menu (tab Menu → `MenuPricesTab.tsx`) | `default_duration` è campo aggiuntivo; `MenuPricesTab` non tocca questo campo |
| `bookingPublicFormConfig.ts` | Usato da settings e pagina pubblica, non dal menu | |
| `presetMenus.ts` | Usato da `MenuPricesTab.tsx` e da `menuMagazzinoSync` | `menuMagazzinoSync.adminBlindatura.test.ts` copre sync ingredienti/categorie, non `duration` |
| `filterMenuCategoriesForPublic`, `filterMenuItemsForPublic` | Importati nella panel (riga `:54-55`) | Funzioni di visibilità magazzino: indipendenti da `duration` |

**Conclusione:** La durata è un **nuovo campo additivo** su `SubTab` e `CustomStaffPreset`.
Le funzioni Menu (sync categorie, visibilità magazzino, `BookingFormCarouselEditor`) non
leggono `duration` / `default_duration` e non vengono toccate.

Il file `menuMagazzinoSync.adminBlindatura.test.ts` testa la sincronizzazione dei campi
`hidden_category_keys`, `hidden_item_ids`, `category_order_keys` — nessuno dei quali è
coinvolto in S1.

**Raccomandazione:** rieseguire anche la suite menu-magazzino (`npm run test -- menuMagazzinoSync`)
come controtest di regressione passiva (costo basso, rischio quasi zero), ma non è un
blocco per S1. L'obbligo formale riguarda solo le suite `settings-*`.

---

## 5. SUITE DI REGRESSIONE

Le suite `*.settingsM4.adminBlindatura.test.tsx` che coprono **Personalizza Form** e che
vanno rieseguite dopo la build S1:

| File | Coverage rilevante per S1 |
|---|---|
| [`settingsFormConfig.settingsM4.adminBlindatura.test.tsx`](../../src/features/booking/components/__tests__/settingsFormConfig.settingsM4.adminBlindatura.test.tsx) | CRUD mode/SubTab, save, reload — core del parser |
| [`settingsFormConfigCompilable.settingsM4.adminBlindatura.test.tsx`](../../src/features/booking/components/__tests__/settingsFormConfigCompilable.settingsM4.adminBlindatura.test.tsx) | Campi opzionali card (`is_fixed_menu`, `compilable_category_keys`) — pattern analogo a `duration` |
| [`settingsFormConfigHeader.settingsM4.adminBlindatura.test.tsx`](../../src/features/booking/components/__tests__/settingsFormConfigHeader.settingsM4.adminBlindatura.test.tsx) | Header/stili — meno rilevante, ma fa parte del normalizer |
| [`settingsCarouselCrud.settingsM4.adminBlindatura.test.tsx`](../../src/features/booking/components/__tests__/settingsCarouselCrud.settingsM4.adminBlindatura.test.tsx) | CRUD carosello — rilevante se si aggiunge duration anche al carosello |
| [`settingsSaveGuard.settingsM4.adminBlindatura.test.tsx`](../../src/features/booking/components/__tests__/settingsSaveGuard.settingsM4.adminBlindatura.test.tsx) | Guard salvataggio — non toccata da S1, ma va rimane verde |
| [`settingsPromo.settingsM4.adminBlindatura.test.tsx`](../../src/features/booking/components/__tests__/settingsPromo.settingsM4.adminBlindatura.test.tsx) | Promo — non toccata |
| [`settingsAnagraficaUi.settingsM4.adminBlindatura.test.tsx`](../../src/features/booking/components/__tests__/settingsAnagraficaUi.settingsM4.adminBlindatura.test.tsx) | Anagrafica — non toccata |
| [`settingsTheme.settingsM4.adminBlindatura.test.tsx`](../../src/features/booking/components/__tests__/settingsTheme.settingsM4.adminBlindatura.test.tsx) | Tema — non toccata |
| [`settingsTimeSlots.settingsM4.adminBlindatura.test.tsx`](../../src/features/booking/components/__tests__/settingsTimeSlots.settingsM4.adminBlindatura.test.tsx) | Fasce orarie — non toccata |
| [`businessHoursEditor.settingsM4.adminBlindatura.test.tsx`](../../src/features/booking/components/__tests__/businessHoursEditor.settingsM4.adminBlindatura.test.tsx) | Business hours — non toccata |

**File unit** da AGGIUNGERE in S1 (nuovi):
- `bookingPublicFormConfig.test.ts` esiste già (`:constants/__tests__/`) — estenderlo con casi:
  durata valida, fuori range, assente, `undefined` corretto nel normalized.
- Nuovo file (o sezione) per `CustomStaffPreset.default_duration` nel registry.

---

## 6. MICRO-DECISIONI NUOVE (per l'intervista con Matteo)

Le Q-S1-1..4 già nel plan restano invariate. Emergono queste ambiguità aggiuntive:

### M-S1-A — Durata sul carosello?
Il carosello (`SubTab.display === 'carousel'`) rappresenta anch'esso una card scelta dal
cliente. Secondo D35 "la card vince sempre". Va aggiunto `duration` anche alle SubTab
carosello? Il parser `parseSubTabFromUnknown` tratta `carousel` con path separato
(`:654` `return display === 'carousel' ? migrateLegacyCarouselSubTab(parsed) : parsed`).
**Proposta:** sì, anche il carosello porta durata (stesso campo); la UI picker potrebbe
comparire in `carouselPriceSection` (riga ~`:1203`). Decidere con Matteo.

### M-S1-B — `DurationPicker` come componente separato o inline?
Il pattern corrente del panel è usare elementi inline (`<select>`, `<Input>`) senza
estrarre sub-componenti. Un `DurationPicker` separato facilita il riuso (editor tipologia +
editor card + eventuale editor preset), ma introduce un nuovo file. **Proposta:** componente
locale nel file panel (non esportato), non un file separato. Decidere con Matteo.

### M-S1-C — `default_duration` sul `CustomStaffPreset` è S1 o S2?
Il plan §2 prevede il campo `default_duration` sul preset come 2° gradino della gerarchia.
Ma il preset si edita nella **tab Menu** (`MenuPricesTab.tsx`), non in Personalizza Form.
Aggiungere la UI picker al preset richiederebbe toccare anche `MenuPricesTab` → area Menu
(M3, blindata). Se in S1 si aggiunge solo il **tipo** e il **parser** di
`CustomStaffPreset.default_duration` (senza UI), la UI può seguire in S2/S3 con M3
riaperta. **Alternativa:** aggiungere il picker anche in `MenuPricesTab` già in S1 come
piccolo edit locale. Da decidere con Matteo prima della build.

### M-S1-D — Clamp o arrotondamento step?
Il picker mostra 90/120/150/180 + "Altro". Il campo "Altro" accetta valore libero. La
proposta del parser è clampare nel range [MIN, MAX] senza arrotondare. Ma se il
ristoratore digita 73, lo si conserva così oppure si arrotonda al multiplo di 15 più vicino?
**Proposta:** conservare il valore libero senza arrotondamento (solo clamp min/max).
Aggiungere alla lista Q-S1-1.

---

## Riepilogo esecutivo (5 righe)

1. **Migrazione DB:** ❌ NO — tutto il JSONB sta in `restaurant_settings.setting_value`, chiave
   `booking_public_form_config` (+ `booking_custom_staff_presets`). S1 è puramente additivo.
2. **File da toccare (tipi + parser + normalizer):**
   - `src/features/booking/constants/bookingPublicFormConfig.ts` (SubTab + BookingMode)
   - `src/features/booking/constants/presetMenus.ts` (CustomStaffPreset)
   - `src/features/booking/lib/restaurantSettingRegistry.ts` (parse + Zod schema)
   - `src/features/booking/components/settings/BookingFormConfigPanel.tsx` (UI picker)
3. **File da toccare (UI):** solo `BookingFormConfigPanel.tsx` — no nuovi file obbligatori,
   ma un `DurationPicker` locale è consigliato.
4. **Suite da rieseguire:** `settingsFormConfig*` + `settingsCarouselCrud*` (M4 obbligatorie);
   `menuMagazzinoSync` (opportunistico); unit `bookingPublicFormConfig.test.ts` (da estendere).
5. **Decisioni aperte che bloccano la build:** Q-S1-1 (min/max), Q-S1-2 (tipologia in S1 o no),
   Q-S1-3 (`default_duration` preset in S1 o S2), + M-S1-A (carosello), M-S1-C (UI preset).

---

*Creato 23-06-26, esecutore read-only. Prossimo passo: Fase 2 — Intervista-di-sezione con Matteo.*
