# Report — Mappa read-only Impostazioni locale + decisioni prodotto

**Data:** 15-06-26  
**Profilo:** Verifica deep (mapper senior) · branch `env/test`  
**Scope:** pagina Admin → tab **Impostazioni locale** (`RestaurantSettingsTab` + figli)  
**Output sessione:** matrice elemento → dati → vincoli → salvataggio → effetto → conflitti → test → gap  
**Codice:** nessuna modifica in questa sessione (solo documentazione)

- **Cosa è cambiato:** mappa completa §3-quater.5 del piano blindatura; due decisioni prodotto chiuse da Matteo (delete card/carosello, sfondi gradiente).
- **Cosa resta:** implementazione decisioni, test mancanti (`settings-time-slots`, `settings-theme`, `settings-background`, `settings-form-config`, `settings-carousel-crud`, `settings-promo`), FU-009, Fase D rompi, E2E smoke 375/834/1280.
- **Serve una tua azione:** no per la mappa; sì per il ciclo implementazione/test successivo.

---

## 1. Obiettivo e metodo

Mappatura read-only di **ogni elemento visibile** in Impostazioni locale, allineata a:

- `docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md` §3-quater.5
- `docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md`
- `docs/Prenota-Skill/contesto/PRENOTA_FORM_CONFIG_CONTEXT.md`
- `docs/Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md`

File codice ispezionati: `RestaurantSettingsTab`, `BookingFormConfigPanel`, `BookingFormPromoSection`, `BookingFormCarouselEditor`, `BusinessHoursEditor`, `SettingsSaveUi`, `restaurantSettingRegistry`.

**Escluso di proposito:** `booking_window_days` (fuoriscope M4).

---

## 2. Decisioni prodotto chiuse in questa sessione (Matteo)

### D-M1 — Eliminazione card / carosello: **chiedi conferma**

| Prima (codice attuale) | Dopo (decisione) |
|------------------------|------------------|
| Cestino su card salvata (lista + editor) e su carosello **elimina in memoria senza modale** | **Modale di conferma in-app** prima di rimuovere, sullo stesso pattern di «Elimina fascia oraria» (`RestaurantSettingsTab` → `deleteConfirmSlot`) e delete promo (`BookingFormPromoSection`) |

**Implementazione attesa (prossimo ciclo):**

- `BookingFormConfigPanel.tsx`: stato `deleteConfirmSubTab` (modeId, subTabId, titolo riepilogo); modale «Eliminare card/carosello?» con Annulla / Elimina.
- Applicare sia al cestino nella **riga collassata** sia al cestino nell’**editor embedded**.
- Il persist resta al footer «Salva modifiche» (come oggi per le fasce): la modale conferma solo la rimozione dallo **stato locale** + `modesDirty`.

**Test da aggiungere:** `settings-form-config` — delete card/carosello mostra modale; annulla non rimuove; conferma alza dirty.

---

### D-M2 — Sfondi gradiente: **eliminiamo i gradienti**

| Prima | Dopo (decisione) |
|-------|------------------|
| `public_booking_page_background` poteva essere `gradient-*` (legacy DB + costanti in `bookingPageBackground.ts`); rendering su `BookingRequestPage` con layer scrollabile e colore radice marrone `#2d2013` | **Niente gradienti** come sfondo tenant: né in admin né in pubblico. Scelte admin restano solo **striscia laterale** (`strip-01…06`) o **pagina intera** (`full-01…04`). |

**Fallback crema `#faf7f1` — raccomandazione tecnica (da confermare in implementazione):**

| Uso | Tenere? | Motivo |
|-----|---------|--------|
| Modalità **striscia** (sfondo colonna destra crema) | **Sì** | Comportamento prodotto consolidato (`PRENOTA_LAYOUT_CONTEXT` §2) |
| **Primo paint** / immagine full-page **non caricata** | **Sì** | Resilienza UX (errore rete/asset); non è una «scelta grafica» del ristoratore |
| Tenant **senza** striscia e **senza** full-page (es. dopo migrate-on-read) | **Sì** | Superficie `light` con crema invece del vecchio gradiente/tile |
| Colore radice marrone `BOOKING_PAGE_GRADIENT_ROOT_FALLBACK_COLOR` | **No** | Va sostituito con crema o rimosso insieme al path gradiente |

**Non serve** un’opzione admin «Nessuno sfondo»: se Mario non sceglie striscia né full-page, il pubblico vede **crema neutra** (superficie `light`), non un preset decorativo.

**Implementazione attesa (prossimo ciclo):**

1. `restaurantSettingRegistry.ts` — `parseFromDb` per `public_booking_page_background`: id `gradient-*` (e valutare anche `tile-*` legacy) → `null` o default tecnico; **nessun** gradiente serializzato da admin.
2. `BookingRequestPage.tsx` — rimuovere ramo `isBookingPageGradientId` / `bookingPageGradientCss` / layer tile legacy se Matteo conferma estensione a tutti i non-full/non-strip (coerente con «solo striscia o full o crema»).
3. `bookingPageBackground.ts` — deprecare/rimuovere `BOOKING_PAGE_GRADIENT_PRESETS`, helper gradient; tenere `BOOKING_PAGE_NEUTRAL_BACKGROUND_COLOR`.
4. `resolvePublicBookingSurface` — superficie `light` = crema; aggiornare test `publicBookingSurface.test.ts`.
5. Skill: `PRENOTA_LAYOUT_CONTEXT.md` §2 (tabella superfici), `ADMIN_SETTINGS_CONTEXT.md` (sfondo XOR), `PLAN_BLINDATURA_ADMIN.md` §3-quater.5.A riga sfondo.

**Test:** `settings-background` + regressione superficie pubblica.

---

## 3. Sintesi mappa per blocco (stato blindatura)

| Blocco schermata | Stato | Note |
|------------------|-------|------|
| Ingresso pill + guard | Parziale **blindato** | Vitest guard pill; gap QA responsive durante save |
| Anagrafica + contatti | **Blindato** | M4 + `settings-registry` / `settings-anagrafica-ui` |
| Orari apertura | **Blindato** logica | `settings-business-hours`; gap QA viewport |
| Limite giornaliero | **Blindato** registry | gap smoke UI vuoto/0/1000 |
| Fasce Classic | **Gap** | Nessun `settings-time-slots`; mappa conflitti incompleta |
| Tema app | **Gap** | Nessun `settings-theme` |
| Intestazione Prenota | **Voluto/doc** | gap test form-config / responsive font |
| Modalità + card | **Voluto/doc** | **D-M1** aggiunge modale delete |
| Carosello | **Gap** FU-009 | Nessun `settings-carousel-crud` |
| Promo | **Voluto/doc** | silent save OK; copy modale delete promo **sbagliata** («prossimo salvataggio» ma `saveSilently` immediato) — fix tecnico, non decisione prodotto |
| Sfondo Prenota | **Gap** | **D-M2** semplifica modello; `settings-background` assente |
| Salvataggio globale | **Blindato** core M4 | gap rompi browser (doppio click, mutation fail) |

**Area 3 non è ancora «blindata»** (criterio §3-quater.6): matrice completata in questo report; gap test/QA e FU-009 aperti.

---

## 4. Architettura dati (riferimento rapido)

| Cosa vede Mario | Dove si salva | Client |
|-----------------|---------------|--------|
| Anagrafica, orari, limite giorno, tema, sfondo, config form, promo | `restaurant_settings` (chiave/valore per tenant) | `supabase` autenticato |
| Fasce orarie Classic (nome, orari) | tabella `service_slots` | idem |
| Capienze per fascia | `restaurant_settings.slot_guest_capacities` (map id→numero) | idem |
| Foto slide carosello | Storage `menu-photos` + URL in `booking_public_form_config` | upload admin |
| Preset menù (import card) | `booking_custom_staff_presets` (tab Menu, **lettura** qui) | idem |

**Non visibile in Impostazioni:** `timezone`, `booking_window_days`, `booking_placement_areas`, `walk_in_max_guests`, `booking_staff_presets_visible`.

---

## 5. Salvataggio e conflitti (comportamento consolidato)

| Pattern | Dove |
|---------|------|
| Footer unico + `PublicDataSaveConfirmModal` padre | `RestaurantSettingsTab` (`hideSaveUi` sul figlio) |
| Anagrafica batch | `handleSave` — nome, contatti, orari, limite, fasce, capienze, tema, sfondo |
| Personalizza form | `BookingFormConfigPanel.saveAll()` via ref — header, modalità, promo dirty, sfondo dirty |
| Promo apply/delete/toggle | **`saveSilently`** immediato; se fallisce → `promoDirty` per retry footer |
| Guard navigazione | `UnsavedChangesContext` — cambio pill, sezione admin, logout |
| Autosave | Solo dev (`VITE_SETTINGS_AUTOSAVE`); PROD inerte (FU-004) |

**Conflitti noti ancora aperti (oltre D-M1 / D-M2):**

- Delete promo: testo modale ≠ comportamento silent save.
- Card/carosello: delete senza conferma → **chiuso da D-M1** (da implementare).
- Sfondo legacy gradiente/tile in DB vs UI strip/full → **chiuso da D-M2** (migrate-on-read + crema).
- Cambio pill / sezione durante `upsert.isPending` — da Fase D rompi.
- Bozza card aperta + cambio pill — guard dovrebbe intercettare (verificare in QA).

---

## 6. Inventario test

### Esistenti (M4)

| Marcatore | File |
|-----------|------|
| `settings-registry` | `restaurantSettingRegistry.settingsM4.adminBlindatura.test.ts` |
| `settings-anagrafica-ui` | `settingsAnagraficaUi.settingsM4.adminBlindatura.test.tsx` |
| `settings-business-hours` | `businessHours.settingsM4.adminBlindatura.test.ts` |
| (parziale) | `restaurantSettingRegistry.stripPhoto.test.ts`, `dailyGuestLimit.adminBlindatura.test.ts`, `bookingPublicFormConfig.*`, `menuPromo.test.ts`, `bookingFormResolver.*` |

### Da costruire (piano §3-quater.5.C)

`settings-map` (opzionale contract), `settings-save-guard`, `settings-time-slots`, `settings-theme`, `settings-background`, `settings-form-config`, `settings-carousel-crud` (FU-009), `settings-promo`.

### QA manuale residuo

- E2E/smoke Impostazioni 375 / 834 / 1280
- FU-009 CRUD slide carosello end-to-end
- Fase D «rompi» esplicito

---

## 7. Backlog implementazione prioritizzato (post-report)

1. **D-M1** — modale conferma delete card/carosello + test.
2. **D-M2** — rimozione path gradiente (e tile legacy se inclusi) + migrate-on-read + crema; aggiornare skill layout.
3. Fix copy modale delete promo (allineamento a silent save).
4. Test `settings-time-slots`, `settings-theme`, `settings-background`, `settings-form-config`, `settings-carousel-crud`, `settings-promo`.
5. Allineare `PRENOTA_FORM_CONFIG_CONTEXT.md` (promo: silent save, non footer lista).
6. Aggiornare `ADMIN_SETTINGS_CONTEXT.md` e `ADMIN_TEST_SUITE_INDEX.md` a fine ciclo implementazione.
7. FU-009 + Fase D + `npm run validate` verde come gate §3-quater.6.

---

## 8. La lettura della sessione (agente)

La pagina Impostazioni locale è **funzionalmente matura** dopo M4 Fase C su anagrafica, orari, salvataggio unificato e registry — ma **non è blindata end-to-end**: mancano soprattutto test su fasce Classic, tema, sfondo, form-config, carosello e promo UI.

Le due decisioni di Matteo riducono ambiguità prodotto importanti: la delete card/carosello allinea l’UX al resto dell’admin (conferma prima di perdere lavoro); l’eliminazione dei gradienti semplifica il modello mentale «striscia **oppure** full-page **oppure** crema tecnica», coerente con la UI admin già ridotta a due pill sfondo.

Il fallback crema **non va confuso** con un quarto tema grafico: è il colore di sicurezza per striscia-mode, assenza scelta decorativa e errori di caricamento foto — tenerlo è ragionevole; il marrone `#2d2013` legato ai gradienti invece va via con D-M2.

---

## 9. Riferimenti

- Piano: `docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md` §3-quater.5–6
- Context vivo: `docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md`
- Intervista M4: `docs/Sessioni di lavoro/15-06-26/Blindatura ADMIN/Report-intervista-m4-admin-impostazioni-15-06-26.md`
- Fase C codice: `docs/Sessioni di lavoro/15-06-26/Report-fase-c-m4-admin-impostazioni-15-06-26.md`
- Hand-off orchestrator: `docs/Sessioni di lavoro/15-06-26/Blindatura ADMIN/Hand-Off senior orchestrator.md`
