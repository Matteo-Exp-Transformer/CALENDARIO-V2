---
name: public-menu-layout
description: >-
  Dettaglio struttura componenti, griglie, icone e regole visive della pagina
  pubblica menu QR (PublicMenuPage). Leggere quando si toccano layout, card categorie,
  carosello, header tema, tab sticky, o sovrapposizione testo su immagini.
---

# PublicMenuPage — Layout & Componenti

> File principale: `src/pages/PublicMenuPage.tsx`
> Skill entry point: `docs/per-ui-design-skill/PUBLIC_MENU_SKILL.md`
> Ultima revisione: 2026-06-01 — FU-025 esteso a `PublicMenuCategoryPage`; costante `publicMenuLayout.ts`; griglia 520, sfondo repeat-y homepage

---

## 1. Struttura visiva dall'alto verso il basso

```
┌──────────────────────────────────────────────────────────────┐
│  Shell pagina (full viewport) — useMenuPageBackgroundStyle     │
│  bodyImage repeat-y, scrolla col contenuto; lati desktop     │
│  ┌────────────────────────────────────────┐                  │
│  │  Wrapper contenuto max-w-[1024px]      │  ← centrato      │
│  │  mx-auto — invisibile, no bordo        │    oltre 1024px  │
│  │  ┌──────────────────────────────────┐  │                  │
│  │  │ <header> nome + MenuCarousel      │  │                  │
│  │  │ MenuNavTabs (sticky top-0)        │  │                  │
│  │  │ Griglia categorie (main)          │  │                  │
│  │  │ Footer data/ora (mt-auto)       │  │                  │
│  │  └──────────────────────────────────┘  │                  │
│  └────────────────────────────────────────┘                  │
└──────────────────────────────────────────────────────────────┘
```

Pagina: `useMenuPageBackgroundStyle()` sul **wrapper esterno scrollabile** — **solo `bodyImage`**, `100% auto`, `repeat-y`. Il **wrapper interno** (`max-w-[1024px] mx-auto`) congela larghezza UI oltre 1024px senza casella visibile. **`headerImage` non usato in homepage** — solo in `PublicMenuCategoryPage` (barra sticky ~56px).

| Pagina | Asset sfondo |
|--------|----------------|
| Homepage `PublicMenuPage` | `bodyImage` — `100% auto`, `repeat-y` sul container che scrolla |
| Categoria `PublicMenuCategoryPage` | `headerImage` — crop top sulla barra sticky; corpo `bg-stone-50` |

**Costante condivisa FU-025:** `PUBLIC_MENU_CONTENT_MAX_WIDTH_CLASS` in `src/features/public-menu/publicMenuLayout.ts` — usata in `PublicMenuPage` e `PublicMenuCategoryPage`.

### `PublicMenuCategoryPage` — due livelli (01-06-26)

```
┌──────────────────────────────────────────────────────────────┐
│  Shell esterna — min-h-svh bg-stone-50 (full viewport)       │
│  ┌────────────────────────────────────────┐                  │
│  │  PUBLIC_MENU_CONTENT_MAX_WIDTH_CLASS   │  ← centrato      │
│  │  + min-h-svh                           │    oltre 1024px  │
│  │  ┌──────────────────────────────────┐  │                  │
│  │  │ <header> sticky PNG tema (~56px) │  │                  │
│  │  │ <main> lista piatti (px-4)       │  │                  │
│  │  └──────────────────────────────────┘  │                  │
│  └────────────────────────────────────────┘                  │
└──────────────────────────────────────────────────────────────┘
```

Header sticky resta **dentro** la colonna 1024px (non full-bleed su ultrawide). Sotto 1024px viewport la colonna è `w-full` — comportamento invariato rispetto al mobile precedente.

---

## 2. Temi

**File**: `src/features/public-menu/menuThemes.ts`

Ogni tema definisce: `accentColor`, `headerTextColor`, `headerImage`, `bodyImage`, `headerFallbackBg`, `bodyFallbackBg`, **`tabBarStickyRgb`** (sfondo barra tab quando sticky).

| Chiave | Label | PNG disponibili |
|--------|-------|----------------|
| `mediterranean_teal` | Mediterranean Teal | header + body |
| `cream_sage` | Cream Sage | header + body |
| `dark_gold` | Dark Gold | header + body |
| `rustic_terracotta` | Rustic Terracotta | header + body |
| `green_wellness` | Green Wellness | header + body |

PNG in `public/menu-themes/` con naming `{tema-key}-header.png` / `{tema-key}-body.png`.

**`getMenuTheme(key)`** — funzione da usare sempre nei componenti UI (mai leggere `theme_key` diretto).

---

## 3. Componenti — dove toccare cosa

### `MenuCarousel`

| Elemento | Valore | Note |
|----------|--------|------|
| Altezza slide con foto | `h-52` | Cambia qui per slide più alte/basse |
| Placeholder senza foto | `h-28 bg-transparent/15` | Mantiene spazio — non nasconde la sezione |
| Overlay testo | `linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 50%)` | Gradiente orizzontale 40% sx |
| Posizione testo | `absolute inset-y-0 left-0 w-1/2` | Solo sul 50% sinistro |
| Cuore | Phosphor `Heart weight="fill"` | Colore `theme.accentColor` |
| Pallini | `width: activeIdx ? 16 : 8; height: 8` | **`<button>`** cliccabili → `goToSlide(i)`; `min-h-11 min-w-11`, `touch-manipulation` |
| Label sopra carosello | — | **Rimossa** — solo badge dentro slide |

### `MenuNavTabs`

Sticky in cima durante lo scroll. Usa preset se `presets.length > 0`, altrimenti categorie.

```tsx
{/* sentinel 1px + barra sticky */}
<div ref={sentinelRef} className="h-px" />
<div className="sticky top-0 z-10 ..." style={{
  backgroundColor: `rgba(${theme.tabBarStickyRgb}, opacity)`, // 0 → ~0.97 in ~56px scroll dopo lock
  backdropFilter: blur progressivo,
}} />
```

Trasparente finché la barra non si blocca in alto; poi sfondo e blur aumentano mentre scorri (~56px) così le card sotto restano leggibili.

Scroll orizzontale: classe `.scrollbar-hide` in `index.css` (niente barra su mobile/desktop). **Desktop (`md+`)**: frecce sx/dx semi-opache (`theme.tabBarStickyRgb`) se c’è overflow; **mobile**: solo swipe, senza frecce.

- Pill: fill `rgba(tabBarStickyRgb, 0.92)` (sempre visibile, anche con barra trasparente) + bordo/testo `accentColor`; `inline-flex items-center gap-1.5` + `leading-none` — icona Phosphor 16px + testo allineati su mobile
- Icona: `resolveMenuQrCategoryIcon(menu_qrcode_categories.icon, category_key)` (solo quando mostra categorie)

### `CategoryCard`

**Griglia categorie** (in `MenuContent`):

| Viewport | Colonne | Layout card |
|----------|---------|-------------|
| &lt;520px | 1 | con foto: tile `aspect-[7/2]`; senza foto: riga **30%** icona + **70%** `headerImage` |
| ≥520px | 2 | stesso layout card; aspect foto `5/2` da 520px |

**Nessun layout orizzontale thumb da 1025px** — desktop usa le stesse card del tablet dentro `max-w-[1024px]`. Soglia griglia 2 col: **520px**.

**Con foto** — tile verticale, titolo su gradiente in basso (tutte le larghezze).

**Senza foto** — riga 30/70: icona su bianco a sinistra; titolo (+ descrizione opzionale sotto il titolo) nella fascia `theme.headerImage` a destra (`categoryCardNoPhotoBackgroundStyle`), testo in `headerTextColor`. Se **almeno una** categoria ha foto in `category_images`, le card senza foto usano `aspect-[7/2]` sotto 520px e `aspect-[5/2]` da 520px come le tile con foto (`matchPhotoTileHeight`). Senza mix foto: `min-h-[64px]` mobile, `min-h-[72px]` da 520px.

**Titolo e icona**: override `menu_qrcode_categories` → fallback `menu_categories` / `resolveMenuQrCategoryIcon`.

### `MenuFooterCard`

Card larga `mx-4 mb-6`. Aggiorna `new Date()` ogni 60s via `setInterval`. Usa `Intl.DateTimeFormat('it-IT')`.

---

## 4. Regole testo sovrapposto su immagini carosello

Gradiente orizzontale (non verticale come nel vecchio layout):

```css
background: linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 50%)
```

Il testo è posizionato in assoluto sul 50% sinistro (`inset-y-0 left-0 w-1/2`), non in basso. Testo sempre `text-white`.

---

## 5. Config dati — cosa controlla cosa

| Impostazione | Dove si salva (admin) | Dove si usa (pubblico) |
|---|---|---|
| Tema visivo | `MenuHomepageConfigPanel` → "Tema homepage" | `getMenuTheme(homepageConfig.theme_key)` in `MenuContent` |
| Foto carosello | "Specialità della casa" (titolo + descrizione slide) | `carouselItems` via `usePublicMenuHomepageConfig` |
| Foto categoria | "Foto categorie" | `categoryImages[cat.key]` come `imageUrl` in `CategoryCard` |
| Titolo card QR | "Titoli e descrizioni card categorie" → campo Titolo | `menu_qrcode_categories.title` (override) o `menu_categories.label` |
| Icona card/tab (senza foto) | Modale QR → picker icona Phosphor | `menu_qrcode_categories.icon` → `resolveMenuQrCategoryIcon()` |

| Descrizione card QR | "Titoli e descrizioni card categorie" → campo Descrizione | `menu_qrcode_categories.description` (override) o `menu_categories.description` |

**Hook pubblici** (per-QR, post-migrazione 036):
- `usePublicMenuQr` / `usePublicDefaultMenuQr` — risolve QR + `theme_key`, `carousel_items`, `category_images`
- `usePublicMenuQrcodeCategories(menuQrCodeId)` — override titoli/descrizioni/**icon** card QR

**Hook admin**:
- `useMenuHomepageConfig()` — lettura autenticata
- `useUpsertMenuHomepageConfig()` — salva carousel_items + category_images + theme_key
- `useMenuQrcodeCategories()` — lettura override per admin
- `useUpsertMenuQrcodeCategory()` — upsert singolo override per `(tenant_id, category_key)`

---

## 6. Icone Phosphor — come aggiungere una nuova categoria

1. Aggiungi la coppia `key: IconComponent` in `CATEGORY_ICON` (`src/features/public-menu/categoryIcons.ts`)
2. Aggiungi l'opzione corrispondente in `MENU_QR_CATEGORY_ICON_OPTIONS` se deve essere selezionabile nel modale QR admin
3. Il pubblico usa `resolveMenuQrCategoryIcon(override.icon, category_key)` — nessuna emoji

---

## 7. Cosa NON toccare senza skill aggiuntiva

| Area | Skill da caricare prima |
|------|------------------------|
| Hook `useMenuQrCodes` / logica QR code | `PUBLIC_MENU_SKILL.md` §6 |
| Pagina `PublicMenuCategoryPage` (lista piatti) | Leggere l'intero file prima |
| `MenuHomepageConfigPanel` — upload storage | `PUBLIC_MENU_SKILL.md` §4 + §7 |
| `menu_qrcode_categories` / colonne per-QR su `menu_qr_codes` | `DB_SKILL.md` + `DB_SCHEMA_CONTEXT.md` + `PUBLIC_MENU_DATA_FLOW_CONTEXT.md` |
| `menuThemes.ts` — aggiungere/modificare un tema | Aggiornare anche PNG in `public/menu-themes/` e CHECK in migrazione 034 |
