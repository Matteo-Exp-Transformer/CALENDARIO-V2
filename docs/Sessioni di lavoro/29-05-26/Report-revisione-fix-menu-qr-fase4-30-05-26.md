# Report revisione fix — Ciclo Menu QR Fase 4 (30-05-26)

## Revisione finale post-merge `main`

**Data:** 30-05-26  
**Profilo:** Verifica · **Modalità:** deep (chiusura ciclo)  
**Base codice:** `main` @ `dd315a3` (merge `b3216d7` + fix `5b9c40c`)  
**Ciclo:** [Mappa F1](Report-mappatura-menu-qr-admin-pubblico-29-05-26.md) → [Revisione F2](Report-revisione-mappatura-menu-qr-admin-pubblico-29-05-26.md) → [Fix F3](Report-fix-menu-qr-fase3-29-05-26.md) → **F4 (questo)**

- **Cosa è cambiato:** revisore conferma su `main` che i fix Fase 3 in scope sono nel codice e passano `validate`; ciclo Menu QR **chiuso** lato revisore.
- **Cosa resta:** INC-03/06/15 e debiti FU-017…021; **ricreare QR di test** su TEST (campione `5f9n79b` eliminato); asset PNG scroll **FU-021**.
- **Serve una tua azione:** no per chiusura ciclo — opzionale nuovo QR test-pro per QA futuri.

---

## Verdetto globale

### **Approva con riserve**

| Motivo approvazione | Motivo riserva |
|---------------------|----------------|
| `npm run validate` **OK** (227 test) su `main` | QA browser **revisore non ripetibile**: su TEST **0** righe in `menu_qr_codes` per `test-pro` (QR `5f9n79b` assente — probabile eliminazione durante test Fase 3 con Modal) |
| Fix in scope F3 presenti in codice (INC-01, INC-09, validazione modale, header categoria D2) | INC-03/06/15 **posticipati per scelta prodotto** — non regressioni |
| QA umano Matteo **3 round OK** documentato in report F3 | DB prod: solo lettura precedente merge — **nessuna nuova migrazione** richiesta |

**Ciclo Menu QR (mappa → revisione → fix → revisione fix):** ✅ **chiuso** con riserve sopra.

---

## Gate automatico

| Check | Esito |
|-------|-------|
| `npm run validate` su `main` | **OK** — 28 file test, **227** test |
| Merge `env/test` → `main` | **OK** — `b3216d7` pushato |
| DB prod (read-only, post-merge) | **OK** — schema Menu QR 036/037 + `040` (verifica sessione merge 30-05-26) |

---

## Controverifica fix vs handoff Fase 2/3

| ID / tema | Scope Fase 3 | Esito revisore | Evidenza |
|-----------|--------------|----------------|----------|
| **INC-01** | Header = Anagrafica `restaurant_name` | **Risolto** | `PublicMenuPage.tsx` L787 `useRestaurantName()`; SQL test-pro: `restaurant_name` «Trattoria da Matteo» |
| **INC-09** | Categoria non in `category_filter` | **Risolto** | `isCategoryInQrFilter` + messaggio «non fa parte di questo menù QR» L194–204 `PublicMenuCategoryPage.tsx` |
| **Validazione modale** | Salva solo se nome + carosello + ≥1 cat | **Risolto** | `menuQrValidation.ts` + `isMenuQrSettingsValid` in `MenuQrModal.tsx` |
| **Modal UX** | Post-Salva, elimina QR/slide/foto | **Risolto** | `MenuQrManager.tsx` — pattern confermato da Matteo |
| **INC-04 / D2** | Header categoria a tema | **Parziale** | `getMenuTheme` + `categoryHeaderBackgroundStyle` — corpo pagina ancora `bg-stone-50` |
| **INC-08** | Titolo override su pagina categoria | **Aperto** | `usePublicCategoryLabel` → solo `menu_categories.label` |
| **INC-03/06** | Preset / mixed | **Posticipato** | `MenuNavTabs` L445 `usePresets` invariato — coerente con scope |
| **INC-15/16** | Preset page hidden / tenantReady | **Aperto** | `PublicMenuPresetPage.tsx` invariato |
| **INC-02/05/07/10–12** | Come mappa F1 | **Invariato** | Nessuna regressione attesa |
| **INC-11** | Doc layout obsoleto | **Risolto** | `PUBLIC_MENU_LAYOUT_CONTEXT.md` §7 aggiornato in F3 |

---

## QA browser revisore (TESTING_SKILL §7)

**Tentativo:** `localhost:5175` (build `dd315a3`) — dopo 5s: **«Menù QR non trovato»**.

**Causa:** MCP TEST — `SELECT … FROM menu_qr_codes WHERE tenant_id = test-pro` → **0 righe**; `5f9n79b` assente.

| ID | Caso | 375 | 834 | 1280 | Nota |
|----|------|-----|-----|------|------|
| M1–M6 | Smoke pubblico campione | **Non testato** | **Non testato** | **Non testato** | Delegato a **QA Matteo F3** (OK) + **FU-022** seed nuovo QR |
| INC-09 guard | `/c/primi` messaggio blocco | — | — | — | Codice verificato; browser N/A senza QR attivo |

**Tabella F2 (30-05-26 mattina)** con `5f9n79b` resta valida come evidenza storica; non ripetuta oggi per assenza dato TEST.

---

## QA admin

| Controllo | Esito |
|-----------|-------|
| Modale QR round 2–3 Matteo | **OK** (report F3) |
| Revisore live | **Non eseguito** (nessun `.env.local.test`) |

---

## Giudizio INC post-fix (sintesi)

| ID | Stato dopo F4 |
|----|----------------|
| INC-01, INC-09, INC-11 | **Chiusi** |
| INC-04 | **Parziale** (header categoria) |
| INC-03, INC-06 | **Aperti** (posticipati) |
| INC-08, INC-15, INC-16, INC-02, INC-05 | **Aperti** (pre-esistenti / fuori scope) |
| INC-07, INC-10, INC-12 | **Accettati** / dati |

---

## Dati comunicazione (per Matteo)

| Dove | Effetto |
|------|---------|
| **Homepage menu QR sul telefono** | Il cliente vede il **nome in Anagrafica** (non più solo il nome organizzazione Supabase). |
| **Link categoria spenta nel modale** | Messaggio chiaro + torna al menu — non lista piatti «fantasma». |
| **Modale QR in admin** | Non si salva un menu vuoto: servono categorie + carosello completo; **Salva** grigio finché manca qualcosa; conferme in **Modal** (ti è piaciuto il pattern). |
| **Pagina categoria** | Fascia in alto con colori/immagine del **tema scelto nel QR**; sotto resta sfondo chiaro come prima. |

**Storage:** invariato — `menu_qr_codes`, `menu_qrcode_categories`, `restaurant_settings.restaurant_name`.

---

## Debiti residui

| ID | Nota |
|----|------|
| FU-017/018/019 | Invariati |
| FU-021 | Asset PNG scroll temi QR |
| **FU-022** (nuovo) | Ricreare almeno 1 QR attivo su tenant `test-pro` (TEST) per QA automatici / revisore |
| FU-020 | Solo se si riapre INC-06 (mixed) |

---

## Handoff post-ciclo

| Prossimo lavoro | Quando |
|-----------------|--------|
| INC-03/06 UI preset | Sessione prodotto dedicata |
| INC-15 hidden su preset page | Con INC-03 o fix separato |
| FU-021 asset temi | Prompt/asset sessione |
| Nuovo ciclo su altra area | — |

---

## Metodo Fase 4

1. `main` @ merge Menu QR + `npm run validate`.
2. Spot-check file F3 vs INC.
3. SQL TEST: assenza QR campione.
4. Playwright: conferma «non trovato» coerente con DB.
5. Nessuna modifica `src/`.

**Verdetto:** **Approva con riserve** — ciclo chiuso; codice su `main` pronto per uso; ripopolare TEST per QA futuri.
