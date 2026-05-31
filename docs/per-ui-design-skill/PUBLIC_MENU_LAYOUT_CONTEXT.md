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
> Ultima revisione: 2026-05-31 — wrapper desktop FU-025, griglia 520/1025, sfondo repeat-y su shell scrollabile

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

- Pill: `inline-flex items-center gap-1.5` + `leading-none` — icona Phosphor 16px + testo allineati su mobile
- Icona: `resolveMenuQrCategoryIcon(menu_qrcode_categories.icon, category_key)` (solo quando mostra categorie)

### `CategoryCard`

**Griglia categorie** (in `MenuContent`):

| Viewport | Colonne | Layout card |
|----------|---------|-------------|
| &lt;520px | 1 | verticale `aspect-[7/2]` |
| 520–1024px | 2 | verticale `aspect-[5/2]` (tile) |
| ≥1025px | 2 | orizzontale (thumb + titolo + descrizione) |

**Breakpoint layout card: 1025px** (tile verticale sotto, riga orizzontale sopra). Soglia griglia 2 col: **520px** (invariata).

**Desktop largo (&gt;1024px viewport):** il wrapper `max-w-[1024px] mx-auto` congela la larghezza del contenuto; lo sfondo tema resta full viewport. I breakpoint Tailwind restano legati alla **viewport** (es. card orizzontale da 1025px anche se la colonna è 1024px).

**≤1024px — verticale** (tile, anche in griglia 2 col tablet):

```tsx
<Link className="block rounded-xl ... min-[1025px]:flex min-[1025px]:rounded-2xl">
  <div className="relative min-[1025px]:hidden">
    <div className="aspect-[7/2] min-[520px]:aspect-[5/2] ...">
      {imageUrl ? <img /> : <CategoryIcon className="size-6 min-[520px]:size-7" />}
      ...
      <h2 className="text-xs min-[520px]:text-sm uppercase">{displayTitle}</h2>
    </div>
  </div>
</Link>
```

**≥1025px — orizzontale** con thumb quadrato (`w-20` → `w-24` da 900px viewport):

```tsx
<Link className="... min-[1025px]:flex min-h-[80px] min-[900px]:min-h-[88px]">
  <div className="aspect-square w-20 min-[900px]:w-24 shrink-0 bg-stone-100">
    {imageUrl
      ? <img className="h-full w-full object-cover" />
      : <CategoryIcon size={32} />  ← Phosphor da override o CATEGORY_ICON
    }
  </div>
  <div className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3">
    <p className="text-sm font-semibold text-gray-900 leading-snug">{displayTitle}</p>
    {displayDesc && (
      <p className="mt-1 text-xs text-gray-500 leading-snug line-clamp-2">{displayDesc}</p>
    )}
  </div>
  <div className="flex shrink-0 items-center pr-3 text-gray-300">
    <ChevronRight size={18} />
  </div>
</Link>
```

**Titolo, descrizione, icona**: leggono prima `menu_qrcode_categories` (override QR per `menu_qr_code_id`), fallback su `menu_categories` / `CATEGORY_ICON`.

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
