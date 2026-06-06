# MENU QR — Indice test (cosa è blindato, dove aggiungere)

> **Cos'è.** L'inventario dei test dell'area Menu QR: cosa è già coperto, dove aggiungere quando
> tocchi qualcosa. Skill entry: `../MENU_QR_SKILL.md`. Girali con `npm run test` (Vitest).
> **Verificato nel codice il 06-06-26** (lista file reale, non da report).

---

## Test esistenti (6 file)

| File | Cosa blinda |
|---|---|
| `src/features/booking/utils/__tests__/menuQrValidation.test.ts` | **Requisiti del form QR** (`validateMenuQrSettings`): rifiuta senza categoria / senza ingrediente visibile / senza carosello completo / con slide incompleta; ordine dei messaggi. È il cuore della «parte viva» (§4 dello skill). |
| `src/features/booking/utils/__tests__/menuQrCategoryOrder.test.ts` | Ordinamento categorie da `category_filter` (la sequenza dell'array = ordine di visualizzazione). |
| `src/features/booking/utils/__tests__/menuQrStorage.test.ts` | Helper storage/prefill foto (`buildCatalogPrefillForKeys`, refresh prefill catalogo → QR). |
| `src/features/booking/utils/__tests__/menuQrCategoryKeySync.test.ts` | Sync rename/delete di una chiave categoria sui QR (pure functions). |
| `src/features/public-menu/__tests__/categoryIcons.test.ts` | Risoluzione icone categoria (mapping Phosphor/Lucide, default `lucide_salad`, mai emoji). |
| `src/features/booking/components/__tests__/menuQrCategoryFieldCap.test.tsx` | **FU-MQR-1**: cap titolo (30) / descrizione (70) card categoria — valori + taglio difensivo via `AdminFieldWithCharCount`. |

---

## Dove aggiungere test quando tocchi…

| Modifica | Test da aggiungere/estendere |
|---|---|
| Nuovo requisito o messaggio nel form QR | `menuQrValidation.test.ts` |
| Cap titoli/descrizioni categoria (FU-MQR-1) | `menuQrCategoryFieldCap.test.tsx` (già presente) |
| Ordine/filtro categorie | `menuQrCategoryOrder.test.ts` |
| Rename/delete categoria propagato ai QR | `menuQrCategoryKeySync.test.ts` |
| Icone categoria | `categoryIcons.test.ts` |

---

## Buchi di copertura noti (onesti)

- **Pagine pubbliche** (`PublicMenuPage`, `PublicMenuCategoryPage`) non hanno test di rendering
  dedicati: il comportamento è verificato a occhio. Se si toccano gli invarianti pubblici
  (`tenantReady`, `supabasePublic`, filtro `hidden_menu_item_ids`) vale la pena aggiungerli.
- **Codice preset**: rimosso il 06-06-26 (`PublicMenuPresetPage`, rami `content_type`, colonne DB).
  Non esiste più nulla da testare lì.
