# Verifica — Card categorie Menu QR (layout 30/70 senza foto)

**Data 1ª passata:** 01-06-26 (pre-implementazione)  
**Data 2ª passata (revisione):** 01-06-26 — lavoro eseguito  
**Profilo:** Verifica (TESTING_SKILL §7)  
**Ambiente:** `npm run dev` → `localhost:5173` · Supabase **TEST** (`docnnernvpyrbwuzzach`)  
**Gate automatico:** `npm run validate` → **263** test OK  

## URL e dati usati

| Tenant | Slug | shortCode | Tema | Mix `category_images` |
|--------|------|-----------|------|------------------------|
| test-pro | `test-pro` | `x7zuud5` | `green_wellness` (chiaro) | Solo `primi_piatti` con foto; altre senza |
| da-tommaso | `da-tommaso` | `m24gnw3` | `mediterranean_teal` | Solo `bevande` con foto |

Pagina: **`/menu/<slug>/qr/<shortCode>`** — `CategoryCard` + `categoryCardNoPhotoBackgroundStyle()` in `src/features/public-menu/categoryHeaderBackgroundStyle.ts`.

---

## Sintesi V1 / V2 / V3 (revisione post-implementazione)

| Profilo | Esito | Nota |
|---------|-------|------|
| **V1** mobile ~375px | **OK** | 1 colonna; senza foto = riga **30%** icona (bianco) + **70%** `headerImage` + titolo; no descrizione; con foto = tile verticale invariata |
| **V2** tablet ~834px | **OK** | 2 colonne; stessa card 30/70; no overflow titoli |
| **V3** desktop ≥1100px | **OK** | Card orizzontale thumb + descrizione; senza foto **non** usa 30/70 (thumb `w-20` + icona) |

---

## QA manuale responsive (Playwright MCP — 2ª passata)

| ID | Criterio | mobile 375 | tablet 834 | desktop 1100 / 1280 |
|----|----------|------------|------------|---------------------|
| **G1** | Griglia: 1 col / 2 col / 2 col | **OK** | **OK** | **OK** |
| **C0** | Card **con** foto: tile verticale &lt;1025 | **OK** | **OK** | **OK** (orizzontale ≥1025) |
| **C1** | Senza foto: **30%** icona + **70%** titolo (no descrizione) | **OK** | **OK** | N/A |
| **C2** | Senza foto: **`headerImage`** nel **70%**, non `bodyImage` | **OK** | **OK** | N/A |
| **C3** | Desktop ≥1025: thumb + descrizione; non 30/70 | N/A | N/A | **OK** |
| **O1** | Overflow titolo/icona tra colonne tablet | **OK** | **OK** | — |

### Misure campione (senza foto «Antipasti», test-pro)

| Viewport | Layout | Split | `header` nel 70% | Altezza card |
|----------|--------|-------|------------------|--------------|
| 375px | `row-30-70` | 30% / 70% | `green-wellness-header.png` | ~64px |
| 834px | `row-30-70` | 30% / 70% | sì | ~72–159px* |
| 1100px | thumb orizzontale | — | no (solo icona in thumb) | ~96px |

\*In griglia 2 col le righe **si allungano** (`items-stretch`) se la card affianca ha foto alta — comportamento atteso, non overflow testo.

---

## Temi

| Tema | @375 senza foto | `headerImage` nel 70% | Sfondo pagina |
|------|-----------------|------------------------|---------------|
| `green_wellness` | OK | OK (`…-header.png`) | `bodyImage` OK |
| `mediterranean_teal` | OK | OK | `bodyImage` OK |

Su TEST non c’è QR attivo `dark_gold`; secondo tema verificato con teal.

**Leggibilità:** titolo usa `theme.headerTextColor` sulla fascia header (es. scuro su wellness, bianco su teal). Nessun overflow sui campioni; **fallback banda sotto testo** non necessario al momento — **Matteo valuta** solo su titoli molto lunghi / tema scuro reale se serve.

---

## Nota mockup vs codice

`mockup-menu-qr-card-categoria-mobile.html` metteva il PNG header nel **30%** sinistro. Il brief di verifica chiedeva **30% icona | 70% header + titolo** — il codice segue il **brief** (icona a sinistra su bianco, header a destra). Coerente con `CategoryCard` attuale.

---

## 1ª passata (storico — pre-implementazione)

| Profilo | Esito |
|---------|-------|
| V1 / V2 | **KO** — solo tile verticale |
| V3 | **OK** |

Fix suggeriti in quella passata → **implementati** (`theme` su `CategoryCard`, ramo `w-[30%]` / `w-[70%]`, helper `categoryCardNoPhotoBackgroundStyle`).

---

## Dati comunicazione

- Matteo: «revisiona adesso, lavoro non era stato eseguito» → 2ª passata conferma implementazione **OK** su V1–V3 e temi campione.
- QA browser: Playwright; Matteo può confermare visivo su device reale.

---

*Report revisore — nessun commit.*
