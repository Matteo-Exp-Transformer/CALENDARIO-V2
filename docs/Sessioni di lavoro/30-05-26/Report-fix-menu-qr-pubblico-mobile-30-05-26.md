# Report — Fix homepage Menu QR pubblico mobile

**Data:** 30-05-26  
**Modalità:** deep  
**Branch:** env/test  
**Smoke URL:** `/menu/test-pro/qr/x7zuud5`

---

**Cosa è cambiato:** Sul telefono, la homepage del menù QR mostra le categorie come grandi card verticali (foto o icona + titolo in overlay), tab sticky allineate, sfondo tema che scorre senza salti.

**Cosa resta:** QA manuale browser sui 5 temi (checklist FU-021); pagine figlie categoria/preset fuori scope (FU-019).

**Serve una tua azione:** sì — verifica visiva su 375 / 834 / 1280 px e conferma commit se OK.

---

## Obiettivo

Homepage `PublicMenuPage` mobile-first: card categorie verticali ≤700px, icone Phosphor da admin, fix tema terracotta e scroll footer, tab sticky allineate.

## Cosa è stato fatto (cronologico)

1. **`CategoryCard` responsive (≤700px / >700px)**
   - Sotto 700px: layout verticale stile shell chiusa Pagina Prenota (`BookingMenuCategoryCard` layout `stack`) — hero `aspect-video`, gradiente overlay, titolo uppercase in basso, tap → stesso `Link` alla pagina ingredienti.
   - Sopra 700px: layout orizzontale invariato (thumb 1:1 + titolo + descrizione + chevron).
   - Senza foto: icona Phosphor da `menu_qrcode_categories.icon` (admin) via `resolveMenuQrCategoryIcon()`, fallback `CATEGORY_ICON` — rimossa mappa emoji `CATEGORY_EMOJI`.

2. **`MenuNavTabs`**
   - Icona per categoria da `resolveMenuQrCategoryIcon(override.icon, category_key)`.
   - Pill `inline-flex items-center gap-1.5 leading-none` — icona 16px e testo allineati su mobile.

3. **Sfondo scroll (`useMenuPageBackgroundStyle`)**
   - Eliminato switch JS single PNG → layer multipli (causa flash al footer).
   - Ora: `background-repeat: repeat-y` + `background-size: 100% auto` fin dal primo paint — stesso `bodyImage` mobile e desktop per tutti i temi (incluso `rustic_terracotta`).

4. **Skill system**
   - Aggiornati `PUBLIC_MENU_SKILL.md`, `PUBLIC_MENU_LAYOUT_CONTEXT.md`, checklist FU-021.

## File toccati

| File | Perché (effetto ristoratore/cliente) |
|------|--------------------------------------|
| `src/pages/PublicMenuPage.tsx` | Homepage QR: card verticali mobile, icone admin, sfondo stabile |
| `docs/per-ui-design-skill/PUBLIC_MENU_SKILL.md` | Regole layout mobile + icone + sfondo |
| `docs/per-ui-design-skill/PUBLIC_MENU_LAYOUT_CONTEXT.md` | Dettaglio componenti CategoryCard / MenuNavTabs |
| `docs/FOLLOW_UP.md` | FU-021 checklist temi mobile homepage |

## Domande e risposte

Nessuna domanda in sessione — prompt esecutore completo.

## Test eseguiti

| Test | Esito |
|------|-------|
| `npm run validate` (lint + typecheck + 227 test) | ✅ Verde |

**QA browser manuale (375 / 834 / 1280):** non eseguito in questa sessione — da fare su smoke URL con tutti i `theme_key` (checklist FU-021).

## File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `PUBLIC_MENU_SKILL.md` | Layout §8 + regole §9 | §7.2 post-modifica PublicMenuPage |
| `PUBLIC_MENU_LAYOUT_CONTEXT.md` | CategoryCard, MenuNavTabs, icone, sfondo | §7.2 |
| `FOLLOW_UP.md` | FU-021 checklist temi mobile | Fix scroll homepage parziale |

## Dati comunicazione

- **Prompt Matteo:** esecutore deep, obiettivi numerati 1–5, vincoli branch TEST, FU-019/023, superfici QA 375/834/1280, report obbligatorio §7.
- **Formato richiesto:** spiegazioni schermata + storage DB (regola utente) — applicata nel report file table.
- **Termini usati:** PublicMenuPage, MenuNavTabs, menu_qrcode_categories.icon, theme_key, FU-021.
- **Automatizzabile:** checklist temi in FU-021 riutilizzabile per sessioni revisione; validate già in CI.

## Derivazione errori

| # | Tipo | Cosa | Evitabile come |
|---|------|------|----------------|
| — | nessuna difficoltà | Implementazione lineare su file già letto | — |

**Nota tecnica (bug preesistente):** il flash scroll derivava da `useLayoutEffect` che passava da `backgroundRepeat: no-repeat` a layer multipli dopo load/ResizeObserver — risolto con `repeat-y` CSS puro.

## Audit temi — homepage mobile (FU-021)

Stesso asset `bodyImage` per mobile e desktop (`menuThemes.ts` → `public/menu-themes/{tema}-body.png`).

| theme_key | body PNG | Fix scroll 30-05-26 | QA mobile 375px |
|-----------|----------|---------------------|-----------------|
| `mediterranean_teal` | ✅ | ✅ codice | ☐ da verificare |
| `cream_sage` | ✅ | ✅ codice | ☐ da verificare |
| `dark_gold` | ✅ | ✅ codice | ☐ da verificare |
| `rustic_terracotta` | ✅ | ✅ codice (repeat-y, fallback `#9a3412`) | ☐ da verificare |
| `green_wellness` | ✅ | ✅ codice | ☐ da verificare |

## Cosa resta

- QA manuale browser 375 / 834 / 1280 su smoke QR + 5 temi (spuntare checklist FU-021).
- FU-019: pagine figlie (`PublicMenuCategoryPage` / preset) — fuori scope salvo regressione.
- FU-021 punto (2): asset header pagina categoria — sessione dedicata asset PNG.

## Deviazioni dal plan

Nessuna — breakpoint card 700px come da prompt (griglia resta 1 col / 2 col da 400px).
