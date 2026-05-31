# Report revisione — Fix homepage Menu QR pubblico mobile (30-05-26)

**Profilo:** Verifica (deep) · Prompt 2 pubblico  
**Report esecutore:** [Report-fix-menu-qr-pubblico-mobile-30-05-26.md](./Report-fix-menu-qr-pubblico-mobile-30-05-26.md)  
**Ambiente QA:** `npm run dev` · TEST `docnnernvp` · tenant `test-pro` · QR `x7zuud5`  
**Scope:** homepage `PublicMenuPage` · FU-019 pagine figlie fuori scope salvo regressione

---

**Cosa è cambiato:** Sul telefono del cliente, la homepage del menù QR ha card categorie verticali (foto/icona + titolo in overlay), tab sticky allineate, icone Phosphor al posto delle emoji, sfondo tema che scorre senza flash.

**Cosa resta:** FU-019 pagine figlie categoria/preset; FU-021 punto (2) asset header pagina categoria; commit quando Matteo vuole (includere `categoryIcons.ts` + migrazione `042` untracked).

**Serve una tua azione:** no per il fix — sì solo se vuoi commit/push del ciclo.

---

## Verdetto

**Approvato** — ciclo Menu QR fix (Prompt 1 + Prompt 2) chiuso; commit quando Matteo vuole.

---

## Gate automatico

| Controllo | Esito | Evidenza |
|-----------|-------|----------|
| `npm run validate` | **OK** | lint + typecheck + **227/227** Vitest (30-05-26, revisore) |
| LOCK violati | **OK** | Nessun file LOCK nel diff Prompt 2 |
| Prompt 1 admin | **Non rivalutato** | Approvato con riserve 30-05-26 — salvo regressione |
| Report esecutore §7 | **OK** | Report presente; QA browser delegata al revisore (come da protocollo) |
| File untracked | **Attenzione commit** | `src/features/public-menu/categoryIcons.ts`, `supabase/migrations/042_menu_qrcode_categories_icon.sql` — vanno inclusi nel commit Prompt 2 |

---

## Checklist obiettivi 1–7

| ID | Obiettivo | Esito | Evidenza |
|----|-----------|-------|----------|
| **1** | Card ≤700px verticali stile Prenota + tap → ingredienti | **OK** | 375px: hero `aspect-video` visibile, titolo uppercase overlay, `display:block`; tap → `/c/antipasti` |
| **2** | Card ≥700px orizzontali thumb + titolo + descrizione | **OK** | 834/1280: `display:flex`, thumb `aspect-square` visibile, `.line-clamp-2` visibile |
| **3** | Tab categorie sticky, icona+testo allineati mobile | **OK** | Scroll 400px → barra `top:0`, opacità ~0.97; pill `inline-flex`, `deltaY` icona/testo = **0** |
| **4** | Senza foto: Phosphor da `menu_qrcode_categories.icon`, no emoji | **OK** | 4 card senza foto → SVG Phosphor; `hasEmoji: false`. Override admin testato (TEST): `fritti.icon='flame'` → SVG 40px; ripristinato `null` post-QA |
| **5** | Tema `rustic_terracotta` mobile = body PNG desktop | **OK** | 375px: `url(.../rustic-terracotta-body.png)`, `repeat-y`, fallback `#9a3412`, nessun `header` PNG in homepage |
| **6** | Audit 5 temi (FU-021 smoke) | **OK** | Tutti e 5 `theme_key` su 375px: body PNG corretto + `repeat-y` + `100% auto` (vedi tabella sotto) |
| **7** | Scroll footer: sfondo stabile, no flash JS | **OK** | Homepage: `repeat-y` / `100%` / `url` invariati a scroll 0 → fondo → 0 su 375/834/1280 |

**Regressione FU-019 (fuori scope):** navigazione tap homepage → `PublicMenuCategoryPage` **OK** (`/c/antipasti` carica). Non testato tema/hidden su pagina figlia.

---

## QA manuale responsive (TESTING_SKILL §7)

**Data:** 30-05-26 · **Strumento:** Playwright MCP · **URL:** `/menu/test-pro/qr/x7zuud5`

| Caso | 375 | 834 | 1280 |
|------|-----|-----|------|
| **1** Card verticali + tap navigazione | **OK** | N/A (≥700 → orizzontale) | N/A |
| **2** Card orizzontali + descrizione | N/A | **OK** | **OK** |
| **3** Tab icona+testo | **OK** | **OK** | **OK** |
| **4** Icona Phosphor senza foto | **OK** | **OK** | **OK** |
| **5** Terracotta sfondo body PNG mobile | **OK** | — (smoke 375) | — |
| **7** Scroll footer no flash | **OK** | **OK** | **OK** |

Note viewport:
- Breakpoint card **700px** (`min-[700px]:`): 834px mostra layout orizzontale — coerente con decisione Matteo (≤700 verticale, >700 orizzontale).
- Griglia categorie: 1 col sotto 400px, 2 col da 400px — invariata.

---

## Audit temi homepage mobile 375px (FU-021)

| `theme_key` | Body PNG in computed style | `repeat-y` | Esito revisore |
|-------------|---------------------------|------------|----------------|
| `mediterranean_teal` | `mediterranean-teal-body.png` | sì | OK |
| `cream_sage` | `cream-sage-body.png` | sì | OK |
| `dark_gold` | `dark-gold-body.png` | sì | OK |
| `rustic_terracotta` | `rustic-terracotta-body.png` | sì | OK |
| `green_wellness` | `green-wellness-body.png` | sì | OK |

Metodo: UPDATE temporaneo `menu_qr_codes.theme_key` su TEST + reload pagina; ripristinato `green_wellness` a fine QA.

---

## Confronto codice vs decisioni 30-05-26

| Decisione | Implementazione | OK |
|-----------|-----------------|-----|
| Card mobile stile shell chiusa Prenota | `CategoryCard` verticale `aspect-video` + gradiente + titolo overlay | ✅ |
| Breakpoint 700px | `min-[700px]:hidden` / `min-[700px]:flex` | ✅ |
| Icone admin per-QR | `resolveMenuQrCategoryIcon(ov?.icon, category.key)` in card + tab | ✅ |
| No emoji | Rimossa `CATEGORY_EMOJI`; logica in `categoryIcons.ts` | ✅ |
| Sfondo scroll CSS puro | `useMenuPageBackgroundStyle()` — rimosso `useLayoutEffect` + layer JS | ✅ |
| Terracotta stesso body mobile/desktop | Solo `bodyImage`, no `headerImage` in homepage | ✅ |

---

## Derivazione errori

| # | Tipo | Cosa | Evitabile come |
|---|------|------|----------------|
| — | nessuna difficoltà | QA lineare; esecutore aveva lasciato browser QA al revisore (corretto) | — |
| — | bug preesistente (risolto) | Flash scroll da switch JS single→multi layer | Già documentato in report esecutore |

---

## File di skill aggiornati (esecutore)

| File | Modifica | Perché |
|------|----------|--------|
| `PUBLIC_MENU_SKILL.md` | Layout §8 mobile | §7.2 post-modifica |
| `PUBLIC_MENU_LAYOUT_CONTEXT.md` | CategoryCard, sfondo, icone | §7.2 |
| `FOLLOW_UP.md` | FU-021 checklist homepage | Fix scroll parziale → verificato revisore |

**Revisore:** nessun aggiornamento skill aggiuntivo richiesto.

---

## Follow-up post-approvazione

| ID | Stato | Nota |
|----|-------|------|
| FU-019 | Aperto | Pagine figlie — fuori scope Prompt 2 |
| FU-021 (1) | **Verificato revisore** | Checklist 5 temi homepage 375px spuntata in questo report |
| FU-021 (2) | Aperto | Asset header `PublicMenuCategoryPage` — sessione asset dedicata |

---

## Una riga per Matteo

**Approvato** — homepage Menu QR mobile OK su 375/834/1280; terracotta e scroll footer a posto; puoi committare quando vuoi (ricorda `categoryIcons.ts` + migrazione 042).
