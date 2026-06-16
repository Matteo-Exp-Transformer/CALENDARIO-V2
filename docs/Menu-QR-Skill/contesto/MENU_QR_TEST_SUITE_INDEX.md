# MENU QR — Indice test (cosa è blindato, dove aggiungere)

> **Cos'è.** L'inventario dei test dell'area Menu QR: cosa è già coperto, dove aggiungere quando
> tocchi qualcosa. Skill entry: `../MENU_QR_SKILL.md`. Girali con `npm run test` (Vitest).
> **Verificato nel codice il 16-06-26** (lista file reale, non da report).

---

## Test esistenti (8 file Vitest + 1 E2E)

| File | Cosa blinda |
|---|---|
| `src/features/booking/utils/__tests__/menuQrValidation.test.ts` | **Requisiti del form QR** (`validateMenuQrSettings`): rifiuta senza categoria / senza ingrediente visibile / senza carosello completo / con slide incompleta; ordine dei messaggi. È il cuore della «parte viva» (§4 dello skill). |
| `src/features/booking/utils/__tests__/menuQrCategoryOrder.test.ts` | Ordinamento categorie da `category_filter` (la sequenza dell'array = ordine di visualizzazione). |
| `src/features/booking/utils/__tests__/menuQrStorage.test.ts` | Helper storage/prefill foto (`buildCatalogPrefillForKeys`, refresh prefill catalogo → QR). |
| `src/features/booking/utils/__tests__/menuQrCategoryKeySync.test.ts` | Sync rename/delete di una chiave categoria sui QR (pure functions). |
| `src/features/booking/utils/__tests__/menuQrItemSortOverrides.test.ts` | Override ordine piatti per-QR (`parseItemSortOverrides`, `applyQrItemSortOverride`). |
| `src/features/public-menu/__tests__/categoryIcons.test.ts` | Risoluzione icone categoria (mapping Phosphor/Lucide, default `lucide_salad`, mai emoji). |
| `src/features/booking/components/__tests__/menuQrCategoryFieldCap.test.tsx` | **FU-MQR-1**: cap titolo (30) / descrizione (70) card categoria — valori + taglio difensivo via `AdminFieldWithCharCount`. |
| `src/features/booking/components/__tests__/menuQrPresetImport.test.ts` | Import preset staff nel QR (`computeImportFromPreset`): categorie + hidden item precompilati, carosello escluso. |
| `e2e/public-menu-qr.spec.ts` | Flusso cliente pubblico: homepage QR, apertura categoria, browser back, shortCode mancante, fallback `/menu/:slug`; visual checklist seedata con carosello, tema, ordine categorie da `category_filter`, footer data/ora e card categoria senza foto con default `lucide_salad` (no immagine/emoji). |

---

## Dove aggiungere test quando tocchi…

| Modifica | Test da aggiungere/estendere |
|---|---|
| Nuovo requisito o messaggio nel form QR | `menuQrValidation.test.ts` |
| Cap titoli/descrizioni categoria (FU-MQR-1) | `menuQrCategoryFieldCap.test.tsx` (già presente) |
| Ordine/filtro categorie | `menuQrCategoryOrder.test.ts` |
| Rename/delete categoria propagato ai QR | `menuQrCategoryKeySync.test.ts` |
| Icone categoria | `categoryIcons.test.ts` |
| Ordinamento piatti per-QR (`item_sort_overrides`) | `menuQrItemSortOverrides.test.ts` |
| Importa-da-preset nel modal QR | `menuQrPresetImport.test.ts` |
| Flusso cliente pubblico QR | `e2e/public-menu-qr.spec.ts` |
| Hero foto, swipe carosello, temi e footer data/ora | E2E seedato in `public-menu-qr.spec.ts`; resta manuale solo il gesto swipe/asset reali quando tocchi la UI |

---

## Buchi di copertura noti (onesti)

- **E2E pubblica** copre flusso cliente base + visual checklist seedata per carousel, tema, ordine
  categorie, footer e icona default sulle card senza foto. Restano da guardare a mano solo gesture
  swipe e asset reali quando si tocca il rendering.
- **Codice preset**: rimosso il 06-06-26 (`PublicMenuPresetPage`, rami `content_type`, colonne DB).
  Non esiste più nulla da testare lì.
