# MENU QR — Mappa limiti testo (numeri ↔ codice)

> **Cos'è.** La mappa dei cap di caratteri del Menu QR: dove vivono nel codice, quanto valgono, e
> **perché**. Il **valore è sempre nel codice** (single source of truth); questo file lo **specchia e
> spiega**. Skill entry: `../MENU_QR_SKILL.md` (vedi §3 «limiti voluti» e §4 «form vivo»).
> Principio comune ai cap admin: **anti-rottura mobile** — la card pubblica regge poco testo, il cap
> impedisce a Mario di sfondare il layout. Non sono numeri arbitrari.

---

## A. Già cappati (admin scrive → cliente vede)

| Campo (cosa scrive Mario) | Cap | Costante | Dove vive (codice) | Contatore UI |
|---|---|---|---|---|
| **Nome QR** | 80 | — (`maxLength={80}` inline) | `MenuQrModal.tsx` (Input «Nome QR *») | no |
| Carosello — **Etichetta** (eyebrow) | 40 | `CAROUSEL_SLIDE_EYEBROW_MAX` | `MenuHomepageConfigPanel.tsx` | sì (`AdminFieldWithCharCount`) |
| Carosello — **Titolo slide** | 60 | `CAROUSEL_SLIDE_TITLE_MAX` | idem | sì |
| Carosello — **Descrizione breve** | 125 | `CAROUSEL_SLIDE_DESCRIPTION_MAX` | idem | sì |
| Card categoria — **Titolo card** | 30 | `QR_CATEGORY_TITLE_MAX` | `MenuHomepageConfigPanel.tsx` (`MenuQrCategoryCardsSection`) | sì (`AdminFieldWithCharCount`) |
| Card categoria — **Descrizione breve** | 70 | `QR_CATEGORY_DESCRIPTION_MAX` | idem | sì |

Le costanti carosello + categoria sono definite in cima a `MenuHomepageConfigPanel.tsx` e usate sia nel
`maxLength` dei campi sia nel taglio difensivo `value.slice(0, maxLen)` dentro `AdminFieldWithCharCount`.

> ⚠️ **Non confondere con Prenota.** La Pagina Prenota usa limiti carosello **separati** (19/18/38),
> tarati su una card più piccola. Stessi nomi concettuali, numeri diversi, file diverso
> (`bookingPublicFormConfig.ts`). Cambiare uno non tocca l'altro. Vedi `../../Prenota-Skill/`.

---

## B. FU-MQR-1 — titoli/descrizioni categoria per-QR ✅ CAPPATO (06-06-26)

> Era la lacuna emersa nella mappatura: i due campi erano `<input>` nudi senza `maxLength`. **Chiuso
> nella blindatura del 06-06-26.**

**Dove:** `MenuHomepageConfigPanel.tsx`, dentro `MenuQrCategoryCardsSection`. I due campi **titolo card**
e **descrizione card** (scritti su `overrideDrafts[cat.key].title` / `.description`) ora usano
`AdminFieldWithCharCount` con `maxLength` + taglio difensivo + contatore, come il carosello.

**Valori decisi con Matteo:** titolo **30** (`QR_CATEGORY_TITLE_MAX`), descrizione **70**
(`QR_CATEGORY_DESCRIPTION_MAX`) — tarati sullo spazio della card «senza foto» 30/70 (vedi
`MENU_QR_LAYOUT_CONTEXT.md` §3 `CategoryCard`).

**Nota di blindatura (controtest responsive):** il cap copre l'**override QR**; quando il titolo ricade
sul fallback `menu_categories.label` (magazzino, **senza** cap) il troncamento visivo è garantito dal
`line-clamp-2` aggiunto ai due `<h2>` titolo in `PublicMenuPage.tsx`. Cappare `menu_categories.label`
resterebbe lavoro dell'area Menu admin (magazzino condiviso con Prenota), fuori scope qui.

**Test:** `src/features/booking/components/__tests__/menuQrCategoryFieldCap.test.tsx` (blinda 30/70 +
taglio). Vedi `MENU_QR_TEST_SUITE_INDEX.md`.

---

## C. Senza cap perché NON è testo libero del cliente

- I **piatti** (`menu_items` nome/descrizione) e i **nomi categoria magazzino** (`menu_categories`)
  appartengono all'area **Menu admin**, non al QR: eventuali cap si decidono lì
  (`../../per-ui-design-skill/MENU_ADMIN_CONTEXT.md`). Il QR li **mostra**, non li scrive.
- Anna (cliente) **non scrive testo** sul Menu QR (è sola consultazione): nessun cap lato cliente,
  a differenza di Prenota dove Anna compila il form.
