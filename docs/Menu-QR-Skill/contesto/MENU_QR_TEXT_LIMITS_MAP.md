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

Le 3 costanti carosello sono definite in cima a `MenuHomepageConfigPanel.tsx` e usate sia nel
`maxLength` dei campi sia nel taglio difensivo `value.slice(0, maxLen)` (funzione `updateField`).

> ⚠️ **Non confondere con Prenota.** La Pagina Prenota usa limiti carosello **separati** (19/18/38),
> tarati su una card più piccola. Stessi nomi concettuali, numeri diversi, file diverso
> (`bookingPublicFormConfig.ts`). Cambiare uno non tocca l'altro. Vedi `../../Prenota-Skill/`.

---

## B. DA CAPPARE — questione aperta FU-MQR-1 (titoli/descrizioni categoria per-QR)

> Decisione 06-06-26 (Matteo): **vanno cappati**. Oggi **non** lo sono — è la lacuna emersa nella
> mappatura. Niente fix in questa sessione (solo mappatura): qui resta tracciato dove e come.

**Dove vive il buco:** `MenuHomepageConfigPanel.tsx`, dentro `MenuQrCategoryCardsSection`, i due
`<input type="text">` per **titolo card** e **descrizione card** della categoria (scritti su
`overrideDrafts[cat.key].title` / `.description`). Sono input nudi: **nessun `maxLength`, nessun
`AdminFieldWithCharCount`** — a differenza del carosello accanto.

**Cosa fare quando si esegue:**
1. Definire due costanti vicino a `CAROUSEL_SLIDE_*` (es. `QR_CATEGORY_TITLE_MAX`,
   `QR_CATEGORY_DESCRIPTION_MAX`) con limiti tarati sullo spazio reale della card categoria
   (riferirsi alla card «senza foto» 30/70 e «con foto» del layout — vedi `MENU_QR_LAYOUT_CONTEXT.md`
   §3 `CategoryCard`). Valori da decidere con Matteo (principio: stare nello spazio della card mobile).
2. Sostituire i due `<input>` nudi con `AdminFieldWithCharCount` (coerenza col carosello: contatore +
   `maxLength` + taglio difensivo).
3. Aggiungere un test che blinda il taglio (vedi `MENU_QR_TEST_SUITE_INDEX.md`).

Tracciato anche in `../MENU_QR_SKILL.md` §5 e (se usato) `docs/FOLLOW_UP.md`.

---

## C. Senza cap perché NON è testo libero del cliente

- I **piatti** (`menu_items` nome/descrizione) e i **nomi categoria magazzino** (`menu_categories`)
  appartengono all'area **Menu admin**, non al QR: eventuali cap si decidono lì
  (`../../per-ui-design-skill/MENU_ADMIN_CONTEXT.md`). Il QR li **mostra**, non li scrive.
- Anna (cliente) **non scrive testo** sul Menu QR (è sola consultazione): nessun cap lato cliente,
  a differenza di Prenota dove Anna compila il form.
