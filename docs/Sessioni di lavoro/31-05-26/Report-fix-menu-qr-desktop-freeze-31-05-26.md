# Report — FU-025 freeze layout menu QR desktop (31-05-26)

**Profilo:** Esecuzione · **Modalità:** deep  
**Validate:** 227 test OK (run esecutore)  
**Commit:** **non eseguito** — Matteo ha chiesto esplicitamente di non committare (messaggio 2 chat)

---

**Cosa è cambiato:** sul link menu QR, da schermo più largo di ~1024px carosello, tab, card e footer restano centrati come su tablet; lo sfondo tema continua a riempire tutta la finestra.

**Cosa resta:** QA Matteo su 1280/1440/ultrawide + regressione 375/600/1024; FU-021 §8 footer scroll; estensione pattern ad altre route `/menu/*` solo se richiesta; commit quando Matteo lo chiederà.

**Serve una tua azione:** sì — smoke visivo su `/menu/test-pro/qr/x7zuud5` alle larghezze della tabella QA sotto; conferma QA prima di considerare FU-025 chiuso del tutto.

---

## Cronologia chat (verbatim / sintesi)

| # | Chi | Messaggio | Esito |
|---|-----|-----------|-------|
| 1 | Matteo | Prompt esecutore via `@docs/APP_CONTEXT_SKILL.md` · modalità **deep** (solo alzare) · **FU-025** homepage menu QR **>1024px**: stessa impaginazione tablet centrata, sfondo tema ai lati, no stretch carosello/card/UI. Smoke `/menu/test-pro/qr/x7zuud5` · tenant TEST · branch `env/test`. Contesto: sessione viewport 31-05-26 chiusa QA OK mobile/tablet; handoff ciclo 30-05-26. Tabella comportamento atteso (1280/1440/ultrawide + regressione 375/600/1024). Architettura: wrapper esterno sfondo full viewport + wrapper interno `max-w` ~1024px `mx-auto`. Vincoli: **solo** `PublicMenuPage.tsx` (+ skill doc); **non** footer scroll #8, admin, Prenota, `BookingRequestPage` LOCK; **non** cambiare breakpoint 520. | Esecuzione avviata |
| 2 | Agente | Risposta sintesi: wrapper a due livelli implementato, validate 227/227, checklist QA, report creato. | — |
| 3 | Matteo | «non fare commit. ma aggiorna il tuo report finale con lavoro svolto dati chat..» | Report aggiornato (questo file); nessun commit |

**Contesto ereditato (non rifatto in questa chat):** report [`Report-fix-viewport-menu-responsive-31-05-26.md`](Report-fix-viewport-menu-responsive-31-05-26.md) — griglia QR 1 col &lt;520 · 2 col tile 520–1024 · card orizzontali ≥1025; QA Matteo OK su mobile/tablet.

---

## Obiettivo

**FU-025** — Homepage menu QR su viewport **>1024px**: stessa impaginazione del tablet (~1024px), centrata; sfondo tema riempie i lati; niente stretch di carosello, card categorie e altri elementi UI.

Smoke: `/menu/test-pro/qr/x7zuud5` · tenant TEST `test-pro` · branch `env/test` (diff non committato).

---

## Cosa è stato fatto (ordine cronologico)

1. **Lettura contesto** — `APP_CONTEXT_SKILL.md`, `PUBLIC_MENU_SKILL.md`, `PublicMenuPage.tsx`, report viewport 31-05-26, voce FU-025 in `FOLLOW_UP.md`.
2. **Implementazione** — in `MenuContent` (`PublicMenuPage.tsx`):
   - **Shell esterna** invariata: `ref={pageBgRef}`, `className="flex min-h-svh flex-col"`, `style={pageBgStyle}` da `useMenuPageBackgroundStyle(theme)` → PNG body tema full viewport, `repeat-y`.
   - **Wrapper contenuto** aggiunto: `<div className="mx-auto flex w-full max-w-[1024px] flex-1 flex-col">` attorno a hero, carosello, tab sticky, griglia categorie, sezione preset, footer data/ora.
   - Commento inline `FU-025` sul wrapper interno.
3. **Validate** — `npm run validate`: lint + typecheck + **227/227** test Vitest, primo run OK.
4. **Skill §7.2** — aggiornati `PUBLIC_MENU_SKILL.md` (§8 layout + RULE desktop freeze), `PUBLIC_MENU_LAYOUT_CONTEXT.md` (diagramma ASCII a due livelli, tabella breakpoint 520/1025 allineata al codice, snippet `CategoryCard` corretti da 700px obsoleti).
5. **Follow-up** — `FOLLOW_UP.md`: FU-025 → **Fatto (codice)**, QA Matteo ⬜, link a questo report.
6. **Report iniziale** — creato file report deep con cappello 3 righe, checklist QA, sezione Dati comunicazione base.
7. **Aggiornamento report (messaggio 2 Matteo)** — espansione cronologia chat, stato commit, dati comunicazione esaustivi; **nessun commit** come richiesto.

---

## Effetto per il ristoratore / cliente

| Schermata | Prima | Dopo |
|-----------|-------|------|
| Menu QR al tavolo (link `/menu/…/qr/…`) su monitor largo (1280px+) | Carosello, categorie e footer si **allargavano** con la finestra — foto potenzialmente «stirate» | Blocco centrale **fisso ~1024px**, centrato; **laterali** mostrano solo lo **sfondo tema** del ristorante |
| Stesso link su telefono/tablet (≤1024px) | Layout già approvato sessione viewport 31-05-26 | **Invariato** — wrapper interno = `w-full` fino a 1024px |

**Dove nell'app:** pagina pubblica standalone (fuori admin) che si apre scansionando il QR sul tavolo — route `/menu/{slug}/qr/{codice}`.

**Componente codice:** `PublicMenuPage.tsx` → funzione interna `MenuContent` (monta hero, `MenuCarousel`, `MenuNavTabs`, griglia `CategoryCard`, `MenuFooterCard`).

**Storage Supabase (solo lettura, nessuna modifica):**

| Dato | Tabella / origine | Cosa contiene |
|------|-------------------|---------------|
| Tema visivo, carosello, foto categorie QR | `menu_qr_codes` | `theme_key`, `carousel_items`, `category_images`, `category_filter`, `content_type` |
| Nome/descrizione categorie | `menu_categories` | `label`, `description`, `key`, `sort_order` |
| Override titolo/foto/icona per QR | `menu_qrcode_categories` | `title`, `description`, `icon` per `category_key` |
| Nome ristorante in hero | `restaurant_settings` (`restaurant_name`) + fallback `organizations_public` | via hook `useRestaurantName()` |
| PNG sfondo | `public/menu-themes/{tema}-body.png` | asset statici, non DB |

---

## Modifica codice (dettaglio minimo)

```tsx
// PublicMenuPage.tsx — MenuContent return (struttura)
<div ref={pageBgRef} className="flex min-h-svh flex-col" style={pageBgStyle}>
  <div className="mx-auto flex w-full max-w-[1024px] flex-1 flex-col">
    <header>… MenuCarousel …</header>
    <div className="flex flex-1 flex-col">
      MenuNavTabs · main griglia · preset · MenuFooterCard
    </div>
  </div>
</div>
```

Breakpoint **520** (griglia 2 col) e **1025** (card orizzontale) **non modificati** — restano media query Tailwind su viewport.

---

## File toccati

| File | Perché |
|------|--------|
| `src/pages/PublicMenuPage.tsx` | Wrapper `max-w-[1024px] mx-auto` attorno a tutto il contenuto QR in `MenuContent` |
| `docs/per-ui-design-skill/PUBLIC_MENU_SKILL.md` | §8 layout + RULE wrapper desktop freeze |
| `docs/per-ui-design-skill/PUBLIC_MENU_LAYOUT_CONTEXT.md` | Diagramma struttura, tabella breakpoint, snippet CategoryCard allineati al codice |
| `docs/FOLLOW_UP.md` | FU-025 → fatto (codice), QA pendente |
| `docs/Sessioni di lavoro/31-05-26/Report-fix-menu-qr-desktop-freeze-31-05-26.md` | Report sessione (questo file, aggiornato post-messaggio 2) |

**Non toccati (vincolo prompt):** `PublicMenuCategoryPage`, `PublicMenuPresetPage`, admin, Prenota, `BookingRequestPage`, footer scroll FU-021 §8.

---

## Test eseguiti

| Comando | Esito | Note |
|---------|-------|------|
| `npm run validate` | ✅ 227/227 | Esecutore, un solo run |
| QA browser manuale Matteo | ⬜ | Non eseguito in sessione agente |

---

## QA Matteo (checklist)

| Viewport | Verifica | Stato |
|----------|----------|-------|
| 375 / 600 / 1024 | Regressione zero vs sessione viewport 31-05-26 | ⬜ |
| 1280 / 1440 / ultrawide | Contenuto centrato, max ~1024px; sfondo tema ai lati | ⬜ |
| Carosello + thumb categorie | Proporzioni corrette, no deformazione orizzontale | ⬜ |
| Tab sticky | Barra centrata con il contenuto, non full-bleed su ultrawide | ⬜ |

Link smoke: `/menu/test-pro/qr/x7zuud5`

---

## File di skill aggiornati

| file | modifica (breve) | perché |
|------|------------------|--------|
| `docs/per-ui-design-skill/PUBLIC_MENU_SKILL.md` | §8 punto 5 + RULE homepage desktop | §7.2 — modifica `PublicMenuPage` |
| `docs/per-ui-design-skill/PUBLIC_MENU_LAYOUT_CONTEXT.md` | Diagramma dual-wrapper, breakpoint 520/1025, revisione data | §7.2 — architettura layout obsoleta (700px) corretta |
| `docs/FOLLOW_UP.md` | FU-025 stato + link report | chiusura follow-up lato codice |
| `docs/Sessioni di lavoro/31-05-26/Report-fix-menu-qr-desktop-freeze-31-05-26.md` | Report deep + aggiornamento dati chat | protocollo §7.1 |

**Non aggiornati:** `SESSION_LOG.md` (in attesa conferma QA Matteo), `OSSERVAZIONI.md` / `PROPOSTE.md` (Matteo non ha ancora confermato successo lavoro — solo richiesta aggiornamento report e no-commit).

---

## Dati comunicazione (esaustivo)

### Cronologia prompt Matteo (annotati)

1. **Prompt esecutore FU-025** — strutturato, con tabella comportamento atteso, architettura proposta già in FOLLOW_UP, vincoli file espliciti, modalità deep, riferimento handoff sessione precedente. **Qualità:** alta — zero ambiguità su scope; agente non ha dovuto chiedere conferme.
2. **«non fare commit. ma aggiorna il tuo report finale con lavoro svolto dati chat..»** — istruzione operativa chiara; implica stato sessione = codice pronto, QA/commit differiti.

### Termini / vocabolario usati da Matteo in chat

| Termine / concetto | Dove | Agente |
|--------------------|------|--------|
| «deep» (modalità) | Prompt 1 | Applicata: report completo, Dati comunicazione, Derivazione errori |
| «freeze» / no stretch | Obiettivo FU-025 | Wrapper max-width |
| «regressione zero» 375/600/1024 | Tabella OK | Breakpoint 520 invariato |
| «solo PublicMenuPage» | Vincolo | Rispettato |
| «non fare commit» | Prompt 2 | Nessun git commit |

### Spiegazioni date in chat (formato)

- Risposta esecutore: tabella viewport + dove nell'app + storage DB + validate — allineata a user rule «spiegami semplice + componente + storage».
- Formato **Dove | Comportamento** per desktop vs mobile — Matteo non ha corretto → **ok**.

### Domande agente → Matteo

| Domanda | Risposta |
|---------|----------|
| Nessuna | Architettura pre-scritta in FU-025 sufficiente |

### Procedure ripetute

| Procedura | Volte | Automatizzabile? |
|-----------|-------|------------------|
| Caricamento APP_CONTEXT + skill area PUBLIC_MENU | 1 | Sì (già in routing skill) |
| validate pre-chiusura | 1 | Sì (obbligatorio Testing-Skill) |
| Aggiornamento FOLLOW_UP + skill §7.2 post-modifica PublicMenuPage | 1 | Parziale — checklist file skill già in APP_CONTEXT |

### Candidati PROPOSTE (non promossi — segnalazione only)

- Pattern «wrapper sfondo full + colonna max-w tablet» documentato in PUBLIC_MENU_LAYOUT — riutilizzabile per `PublicMenuCategoryPage` se Matteo chiederà estensione (FU-025 nota «valutare altre route»).

### Token / stile risposta

- Risposta 1: media lunghezza, tabella + checklist QA — coerente con COMUNICAZIONE_UTENTE § forma fine task.
- Matteo messaggio 2: richiesta meta (report), risposta agente breve conferma — OK.

---

## Derivazione errori

| # | Classificazione | Cosa | Da cosa derivava | Come evitare |
|---|-----------------|------|------------------|--------------|
| — | **nessuna difficoltà** | Implementazione lineare, validate OK al primo run | — | — |

**Nota documentazione pre-sessione:** `PUBLIC_MENU_LAYOUT_CONTEXT.md` aveva breakpoint obsoleti (700px) rispetto al codice post-viewport 31-05-26 — **bug preesistente doc**, corretto in parallelo a FU-025 (non era scope funzionale del task).

---

## Deviazioni dal plan

| Deviazione | Motivo |
|------------|--------|
| Pagine figlie `/menu/*` non estese | Priorità homepage QR + vincolo prompt esplicito |
| Nessun commit | Richiesta Matteo messaggio 2 |
| `SESSION_LOG.md` / `OSSERVAZIONI.md` non aggiornati | In attesa conferma QA/successo Matteo (protocollo §7.0: OSSERVAZIONI dopo «ok funziona») |

---

## Stato finale sessione

| Voce | Stato |
|------|-------|
| Codice FU-025 | ✅ in working tree (non committato) |
| Skill allineate | ✅ |
| FOLLOW_UP FU-025 | Fatto (codice) · QA ⬜ |
| Validate | ✅ 227/227 |
| Commit | ❌ su richiesta Matteo |
| QA Matteo browser | ⬜ |
| Conferma successo Matteo | ⬜ (solo richiesta aggiornamento report) |
