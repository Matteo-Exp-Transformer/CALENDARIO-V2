# Report revisione — Fix menu admin modali (30-05-26)

**Profilo:** Verifica (deep) · revisore post-sessione Prompt 1  
**Report esecutore:** [Report-fix-menu-admin-modali-30-05-26.md](./Report-fix-menu-admin-modali-30-05-26.md)  
**Ambiente QA:** `npm run dev` · TEST `docnnernvp` · tenant `test-pro` · credenziali `.env.local.test`  
**Commit/worktree:** branch `env/test`, diff non committato (12 file tracked + 3 untracked)

---

## Verdetto

**Approvato con riserve**

Il grosso del Prompt 1 è implementato correttamente (validate verde, guard modali, carosello copy, icona admin per-QR, migrazione TEST). Restano **2 KO solo su mobile 375px** (titolo card categorie + scroll modifica card in fondo) che bloccano la dichiarazione «Approvato» pieno. **Non avviare Prompt 2 esecutore** finché Matteo non accetta le riserve o non chiude i fix mobile.

---

## Gate automatico (F)

| Controllo | Esito | Evidenza |
|-----------|-------|----------|
| `npm run validate` | **OK** | lint + typecheck + **227/227** Vitest (30-05-26, revisore) |
| LOCK violati | **OK** | Nessun file `LOCK` toccato nel diff |
| Report esecutore §7.1 | **Parziale** | Presenti Dati comunicazione, Derivazione errori, Scalabilità multi-tenant; QA manuale lasciata vuota (corretto — eseguita dal revisore) |
| Report esecutore §7.2 skill | **OK** | `MENU_ADMIN_CONTEXT.md`, `PUBLIC_MENU_SKILL.md`, `FOLLOW_UP.md` aggiornati |
| Migrazione 042 TEST | **OK** | Colonna `icon` su `menu_qrcode_categories`; migration `20260530180818` su TEST |
| `DB_MIGRATIONS_CONTEXT.md` | **Non aggiornato** | Migrazione citata in `PUBLIC_MENU_SKILL.md` ma non in tabella migrazioni DB skill — debito doc minore |

---

## Checklist obiettivi A–E

| ID | Obiettivo | Esito | Evidenza |
|----|-----------|-------|----------|
| **A** | Scroll form categorie | **KO mobile / OK tablet+desktop** | Playwright: modifica ultima card → form `y=-1690` fuori viewport (375); tablet/desktop `OK`. «Nuova categoria» scroll **OK** su tutti e 3 viewport. Regressione scroll ingrediente **OK** desktop (1280, ultimo ingrediente categoria espansa). |
| **B** | Card categorie responsive | **KO mobile / OK tablet+desktop** | 375px: `<p>` titolo `width:0`, `height:173` su «Antipasti» → impilamento lettera-per-lettera. 834px: `w:95,h:22`. 1280px: `w:147,h:22`. |
| **C** | Carosello copy D6=B | **OK** | Placeholder `Esempio: Specialità della casa`; nessuna toolbar precompilata; slide nuova in codice senza `eyebrow` (`useCarouselPhotoUpload`); pubblico `/menu/test-pro/qr/x7zuud5` → **0** occorrenze testo «Specialità della casa». Nota: slide esistenti possono avere eyebrow salvato in DB (es. `dolci`) — non è prefill admin. |
| **D** | Guard dati non salvati D4=B parziale | **OK** (scope) | `MenuQrModal`: Esc + overlay + modale «Annullare le modifiche?»; `Resta qui` funziona. Overlay «Categorie Menu»: X + Esc con dirty → stessa guard. Salvataggio chiude senza guard (codice `MenuQrManager` + reset baseline). `isPending` blocca chiusura (`closeOnOverlayClick={!isPending}`). **Non testato:** save lento con tap overlay durante pending. |
| **E** | Icona categoria per QR D3=A | **OK** (admin) / **Non testato** (persist reload) | Picker Phosphor visibile in modale QR; payload `icon` in `useUpsertMenuQrcodeCategoriesBatch`; colonna TEST presente; scope per-QR (non `menu_categories`). Persistenza dopo Salva + riapertura modale **non testata** in browser. Pubblico: icona override **non** ancora in homepage (previsto Prompt 2). |

---

## QA manuale responsive (TESTING_SKILL §7)

**Data:** 30-05-26 · **Strumento:** Playwright MCP · **Tenant:** test-pro · **QR smoke:** `x7zuud5`

| Caso | Mobile 375 | Tablet 834 | Desktop 1280 |
|------|------------|------------|--------------|
| **A** Modifica card categoria in fondo → form visibile | **KO** | OK | OK |
| **A** «Nuova categoria ingredienti» → form visibile | OK | OK | OK |
| **A** Regressione scroll modifica ingrediente | Non testato | Non testato | OK |
| **B** Titolo card orizzontale (no lettera/riga) | **KO** | OK | OK |
| **C** Placeholder Etichetta carosello QR | OK | OK | OK |
| **C** Slide esistente: no prefill obbligatorio admin | OK (dato DB) | OK | OK |
| **C** Pubblico: no fallback eyebrow hardcoded | OK (375 smoke) | — | — |
| **D** Guard overlay categorie (dirty + X) | OK | OK | OK |
| **D** Guard MenuQrModal (dirty + Esc/overlay) | OK | OK | OK |
| **D** Chiusura dopo Salva / isPending | Non testato | Non testato | Non testato |
| **E** Picker icona categoria senza foto | OK | OK | OK |
| **E** Salva + ricarica icona | Non testato | Non testato | Non testato |

**Spot-check adiacenti (codice + parziale browser):**

| Elemento | Esito |
|----------|-------|
| Modale elimina categoria | OK — `Modal` conferma invariato in `MenuPricesTab` |
| Preset / viewMode `qr_codes` | OK — nessuna regressione evidente nel diff |
| `PublicMenuPage` carosello eyebrow | OK — render condizionale `{eyebrow ? … : null}` |

---

## Analisi KO prioritizzati

### 1. [P0 mobile] B — Titolo card verticale (375px)

**Dove:** Admin → tab **Menu** → overlay **Categorie Menu** → card lista (`AdminMenuCategoryLabelCard` in `MenuPricesTab.tsx`).

**Cosa vede il ristoratore:** su telefono i nomi categoria (es. «Antipasti») scendono **una lettera per riga** invece di andare a capo per parola.

**Causa probabile:** colonna titolo nel flex interno ha **larghezza 0** (`getBoundingClientRect().width === 0`); il testo si impila in verticale. Griglia esterna `grid-cols-[minmax(0,1fr)_auto]` ok su tablet+, insufficiente sul flex interno mobile.

**Fix minimo suggerito:** in `AdminMenuCategoryLabelCard`, sul `<p>` titolo aggiungere `flex-1 w-full` (o `flex-1 min-w-0` sul wrapper testo) così la colonna testo riceve larghezza > 0 su 375px. Verificare su dispositivo reale / emulatore 375.

### 2. [P0 mobile] A — Scroll modifica categoria in fondo lista

**Dove:** stesso overlay **Categorie Menu**; tap **Modifica** sull’ultima card con lista lunga.

**Cosa vede il ristoratore:** il form «Titolo categoria» resta **fuori schermo sopra** (~1690px fuori viewport) dopo lo scroll.

**Causa probabile:** `scrollIntoAdminShellView` calcola `targetTop` quando il form è già sopra il viewport (dopo scroll alla card in fondo) e porta `main.scrollTop` a ~2404 senza riportare il form in vista.

**Fix minimo suggerito:** in `useLayoutEffect` categorie, dopo apertura form da Modifica, chiamare scroll con doppio `requestAnimationFrame` o fallback `element.scrollIntoView({ block: 'start' })` se `getBoundingClientRect().top < mainRect.top`; oppure scrollare sempre il `categoryFormCardRef` con `block:'start'` sul container `main`.

---

## Cosa decide Matteo (max 3 righe)

1. **Accetti le riserve** (tablet/desktop ok, solo mobile da rifinire) e parti con Prompt 2 pubblico, **oppure** blocchi e fai una mini-sessione fix solo su 375px (card titolo + scroll)?
2. **FU-022:** su TEST risulta di nuovo un QR usabile per `test-pro` (`x7zuud5`) — vuoi chiudere la riga follow-up?
3. **Persistenza icona QR:** serve smoke «Salva icona → riapri modale» prima del merge, o basta Prompt 2 per l’uso pubblico?

---

## Fix follow-up (non implementati dal revisore)

| Priorità | File / area | Comportamento atteso |
|----------|-------------|----------------------|
| P0 | `MenuPricesTab.tsx` → `AdminMenuCategoryLabelCard` | Titolo orizzontale a 375px |
| P0 | `adminScroll.ts` o `useLayoutEffect` categorie | Modifica ultima card → form in alto visibile su mobile |
| P2 | `DB_MIGRATIONS_CONTEXT.md` | Riga migrazione `042` |
| P3 | QA | Salva icona + reload modale; guard durante `isPending` |

---

## Note punti 7 / adiacenti

- **Punto 7 «Primi piatti»:** chiuso come da esecutore; nessun messaggio errore nuovo introdotto nel diff.
- **FU-023:** confermato aperto — guard solo `MenuQrModal` + overlay categorie; resto app in follow-up.
- **FU-002:** nota esecutore corretta — estensione parziale Prompt 1.

---

## Revisione fix post-revisione (30-05-26 pomeriggio)

**Profilo:** Verifica (standard) · conferma/smentita KO-1 e KO-2 mobile  
**Addendum esecutore:** [Report-fix-menu-admin-modali-30-05-26.md](./Report-fix-menu-admin-modali-30-05-26.md) § Fix post-revisione  
**Gate:** `npm run validate` **OK** (227/227, revisore indipendente)

### Verifica codice (grep)

| Controllo | Esito |
|-----------|-------|
| `findAdminScrollContainer` → `<main>` con `overflow-y: auto/scroll` | **OK** — `adminScroll.ts` L2–18 |
| `scrollIntoAdminShellView` + `ensureVisible` + doppio rAF | **OK** — `adminScroll.ts` L59–78; `MenuPricesTab` L1047–1053 |
| `AdminMenuCategoryLabelCard` — titolo non a width 0 | **OK** — `flex-1 min-w-0`, `max-sm:grid-cols-1`, `w-full min-w-0` su wrapper (L307–338) |
| Diff limitato ai KO | **OK** — `MenuPricesTab.tsx` + `adminScroll.ts` (fix layout/scroll); nessuna modifica a carosello, guard, icona |

### QA Playwright (test-pro, TEST, 30-05-26)

| Caso | 375 | 834 | 1280 |
|------|-----|-----|------|
| **B** — Titolo «Antipasti» orizzontale (width>40, height<80) | **OK** (87×19) | **OK** | **OK** |
| **A** — Modifica ULTIMA card → form «Titolo categoria» in viewport | **OK** | **OK** | **OK** |
| **A** — «Nuova categoria» → form visibile (regressione) | **OK** | **OK** | **OK** |
| Regressione scroll modifica ingrediente | — | — | **OK** |
| Spot: guard overlay Categorie (dirty + X) | **OK** | — | — |
| Spot: guard MenuQrModal (dirty + Esc) | **OK** | — | — |

**KO-1 e KO-2:** **smentiti** — fix esecutore confermati su 375px.

### Verdetto finale Prompt 1

**Approvato** — Prompt 1 chiuso; Matteo può avviare **Prompt 2** (pubblico).
