# Report — Fix menu admin modali (30-05-26)

**Cosa è cambiato:** Fix post-revisione su mobile 375px: titolo card categorie orizzontale e scroll al form quando modifichi l’ultima categoria. Verdetto revisore: **Approvato**.

**Cosa resta:** Prompt 2 (layout homepage QR pubblico), FU-023 guard app-wide, migrazione `042` in produzione.

**Serve una tua azione:** no — puoi avviare Prompt 2.

---

## Obiettivo sessione (Prompt 1)

1. Scroll form categorie overlay «Categorie Menu»
2. Fix titolo card categoria admin (no verticale lettera-per-lettera)
3. Carosello QR: placeholder + rimozione prefill eyebrow
4. Guard chiusura `MenuQrModal` + overlay categorie
5. Icona categoria senza foto (admin D3=A) → `menu_qrcode_categories.icon` (TEST)

---

## Cosa è stato fatto (cronologico)

1. **`scrollIntoAdminShellView`** (`adminScroll.ts`) — scroll sul `<main>` AdminShell Pro, usato per form ingrediente e form categoria.
2. **`MenuPricesTab`** — ref form categoria + scroll su Modifica card / «Nuova categoria ingredienti»; card categoria a griglia; guard X/Esc con `DiscardChangesConfirmModal`.
3. **`MenuHomepageConfigPanel`** — placeholder Etichetta «Esempio: Specialità della casa»; rimossa toolbar «Specialità della casa»; picker icona Phosphor se manca foto QR.
4. **`MenuQrModal`** — serializzazione draft + guard overlay/Esc/X/Annulla.
5. **`PublicMenuPage`** — eyebrow carosello solo se valorizzato; `CATEGORY_ICON` da modulo condiviso.
6. **DB TEST** — migrazione `042_menu_qrcode_categories_icon.sql` applicata via MCP (`docnnernvp`).
7. **Follow-up** — **FU-023** (guard app-wide); nota su **FU-002**.

---

## File toccati (effetto ristoratore)

| Area | Effetto |
|------|---------|
| Tab Menu → Categorie | Tap Modifica in fondo lista → scroll fluido al form in alto |
| Tab Menu → card categorie | Titolo leggibile in orizzontale anche su mobile 375px |
| Modale Impostazione Menù QR → carosello | Campo Etichetta con placeholder esempio; niente testo precompilato |
| Menu QR pubblico carosello | Riga eyebrow visibile solo se l’admin l’ha scritta |
| Chiusura modale / overlay | Con modifiche non salvate → «Resta qui» / «Annulla modifiche» |
| Modale QR → categorie senza foto | Griglia icone Phosphor; scelta salvata per quel QR |

---

## Punto 7 «Primi piatti»

**Chiuso** — dato duplicato risolto con delete+recreate; nessun fix codice in sessione.

---

## Test

| Comando | Esito |
|---------|-------|
| `npm run validate` | ✅ 227/227 test, lint e typecheck OK |

QA manuale viewport 375 / 900 / 1256: non eseguito in sessione agente — checklist per Matteo sotto.

| Caso | 375 | 900 | 1256 |
|------|-----|-----|------|
| Overlay Categorie → Modifica card in fondo → scroll form | — | — | — |
| Titolo card categoria orizzontale | — | — | — |
| Modale QR → carosello placeholder | — | — | — |
| Modale QR dirty → tap fuori / Esc | — | — | — |
| Picker icona + Salva (TEST) | — | — | — |
| Regressione scroll modifica ingrediente | — | — | — |

---

## Scalabilità multi-tenant (FU-006)

| Aspetto | Valutazione |
|---------|-------------|
| `menu_qrcode_categories.icon` | ✅ OK — colonna per riga `(menu_qr_code_id, category_key)`, isolata per tenant via FK |
| Guard dirty in modale | ✅ OK — stato locale per istanza modale, nessun leak cross-tenant |
| Scroll admin | ✅ OK — solo DOM client, nessuna query aggiuntiva |

---

## File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `docs/per-ui-design-skill/MENU_ADMIN_CONTEXT.md` | Overlay categorie scroll/guard, card layout | §7.2 task tab Menu |
| `docs/per-ui-design-skill/PUBLIC_MENU_SKILL.md` | Migrazione 042, eyebrow, categoryIcons, guard modale | §7.2 copy/icon QR |
| `docs/FOLLOW_UP.md` | FU-023 + nota FU-002 | Follow-up obbligatorio |

---

## Dati comunicazione

| Voce | Conteggio / nota |
|------|------------------|
| Prompt esecutore deep (APP_CONTEXT) | 1 — obiettivi numerati 1–7, vincoli LOCK, viewport 375/900/1256 |
| Richiesta spiegazione semplice + storage | Regola utente permanente — applicata in report effetto ristoratore |
| Termini tecnici accettati in prompt | MenuPricesTab, menu_qrcode_categories, SettingsSaveUi come anchor |

---

## Derivazione errori

| # | Tipo | Cosa | Evitabile come |
|---|------|------|----------------|
| 1 | **errore agente** | Replace PublicMenuPage rimosso per errore blocco `CATEGORY_EMOJI` / `useTenantBySlug` | Match contesto più ampio prima di replace |
| 2 | **vincolo strutturale** | Scroll window insufficiente in Pro — già documentato in AdminDashboard | Utility `adminScroll.ts` condivisa |

---

## Cosa resta (prossima sessione)

- **Prompt 2:** layout card categorie homepage QR, temi/sfondo scroll pubblico, uso icona salvata in pagina pubblica.
- **FU-023:** guard unificato su resto admin.
- **Deploy prod:** applicare migrazione `042` quando si allinea produzione.

---

## Fix post-revisione (30-05-26 pomeriggio)

**Verdetto revisore aggiornato:** **Approvato** — entrambi i KO mobile 375px risolti; tablet/desktop invariati.

### Analisi KO (root cause)

| KO | Causa reale | Fix applicato |
|----|-------------|---------------|
| **KO-1** titolo verticale | `items-center` sulla lista comprimeva le card; con **foto categoria** (64px) + flex `flex-1 basis-0` il `<p>` restava a **width 0** | `items-stretch` su `.menu-prices-category-block`; card a griglia con **riga titolo full-width su mobile** (`max-sm:grid-cols-1`); thumbnail ridotta `h-10 w-10` |
| **KO-2** scroll Modifica | `scrollIntoAdminShellView` scrollava il `<main>` **interno** (non scrollabile) invece del `<main class="overflow-y-auto">` Pro | `findAdminScrollContainer()` cerca il main con `overflow-y: auto`; doppio rAF + `ensureVisible` solo sul form categorie |

### File toccati (fix residui)

- `src/features/booking/components/MenuPricesTab.tsx` — layout card + lista categorie
- `src/features/booking/utils/adminScroll.ts` — scroll container corretto + retry visibilità

### QA manuale Playwright (test-pro@p.com, TEST)

| Caso | 375 | 834 | 1280 |
|------|-----|-----|------|
| **A** Modifica ultima card → form «Titolo categoria» visibile in viewport | ✅ | ✅ | ✅ |
| **B** Titolo card orizzontale (width > 40px, height < 80px) | ✅ (87×19) | ✅ (115×22) | ✅ (167×22) |
| **Regressione** scroll modifica ingrediente | — | — | ✅ (invariato, revisore 1280 OK) |

`npm run validate` post-fix: **✅ 227/227**
