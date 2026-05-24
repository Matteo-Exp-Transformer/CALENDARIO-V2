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
> Ultima revisione: 2026-05-24 — redesign homepage con temi, carousel overlay, tab sticky, griglia 2-col

---

## 1. Struttura visiva dall'alto verso il basso

```
┌─────────────────────────────────────┐
│  <header> — SOLO headerImage         │
│  Nome ristorante + fregio             │
│  MenuCarousel (badge solo in slide)   │
│  ○ ● ○  pallini tema                  │
├─────────────────────────────────────┤
│  <div flex-1> — SOLO bodyImage        │
│  MenuNavTabs (sticky top-0)           │
│  Griglia categorie (main, no bg)      │
│  … contenuto scroll …                 │
│  Footer data/ora (mt-auto in fondo)   │
└─────────────────────────────────────┘
```

Pagina: `themePageBackgroundStyle()` — header `100% × min(48vh,420px)`; body `100% auto` + `background-position-y: var(--menu-header-band)` (mai `cover` sul body: stirava la sfumatura su tutta la pagina). **Asset:** sfumatura bianca ≈ **2/5 altezza** del PNG; sotto l’immagine body resta `bodyFallbackBg` (per temi scuri conviene un fallback scuro, non crema).

| Layer | background-size | Perché |
|-------|-----------------|--------|
| header | `100% × fascia hero` | Come mockup, fade in basso alla fascia |
| body | `100% auto` | Proporzioni file rispettate (~40% bianco in alto) |

---

## 2. Temi

**File**: `src/features/public-menu/menuThemes.ts`

Ogni tema definisce: `accentColor`, `headerTextColor`, `headerImage`, `bodyImage`, `headerFallbackBg`, `bodyFallbackBg`.

| Chiave | Label | PNG disponibili |
|--------|-------|----------------|
| `mediterranean_teal` | Mediterranean Teal | header + body |
| `cream_sage` | Cream Sage | header + body |
| `dark_gold` | Dark Gold | header + body |
| `rustic_terracotta` | Rustic Terracotta | header (body = duplicato header) |
| `wine_bistrot` | Wine Bistrot | nessuno (solo CSS fallback) |

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
| Pallini | `width: activeIdx ? 16 : 8; height: 8` | Colore `accentColor` (attivo) / `#d6d3d1` |

### `MenuNavTabs`

Sticky in cima durante lo scroll. Usa preset se `presets.length > 0`, altrimenti categorie.

```tsx
<div className="sticky top-0 z-10 flex justify-center overflow-x-auto scrollbar-hide bg-transparent py-3 px-4 gap-2">
```

- Pill: `border` + `color` impostati con `theme.accentColor` via style inline
- Icona Phosphor da `CATEGORY_ICON` (solo quando mostra categorie)

### `CategoryCard`

Griglia a 2 colonne sopra 400px. Layout orizzontale con thumb quadrato:

```tsx
<Link className="flex overflow-hidden rounded-2xl bg-white shadow-sm min-h-[88px]">
  <div className="aspect-square w-24 shrink-0 bg-stone-100">  ← thumb 1:1
    {imageUrl
      ? <img className="h-full w-full object-cover" />
      : <div className="flex h-full w-full items-center justify-center text-3xl">{emoji}</div>
    }
  </div>
  <div className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3">
    <p className="text-sm font-semibold text-gray-900 leading-snug">{displayTitle}</p>
    {displayDesc && (
      <p className="mt-1 text-xs text-gray-500 leading-snug line-clamp-2">{displayDesc}</p>
    )}
  </div>
  <div className="flex shrink-0 items-center pr-3 text-gray-300">
    <ChevronRight size={18} />  ← da lucide-react
  </div>
</Link>
```

**Titolo e descrizione**: leggono prima `menu_qrcode_categories` (override QR-specifico), fallback su `menu_categories.label/description`.

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
| Descrizione card QR | "Titoli e descrizioni card categorie" → campo Descrizione | `menu_qrcode_categories.description` (override) o `menu_categories.description` |

**Hook pubblici**:
- `usePublicMenuHomepageConfig(tenantId)` — tema + carosello + foto categorie
- `usePublicMenuQrcodeCategories(tenantId)` — override titoli/descrizioni card QR

**Hook admin**:
- `useMenuHomepageConfig()` — lettura autenticata
- `useUpsertMenuHomepageConfig()` — salva carousel_items + category_images + theme_key
- `useMenuQrcodeCategories()` — lettura override per admin
- `useUpsertMenuQrcodeCategory()` — upsert singolo override per `(tenant_id, category_key)`

---

## 6. Icone Phosphor — come aggiungere una nuova categoria

1. Importa l'icona da `@phosphor-icons/react` in cima a `PublicMenuPage.tsx`
2. Aggiungi la coppia `key: IconComponent` in `CATEGORY_ICON`
3. Aggiungi la coppia `key: '🔣'` in `CATEGORY_EMOJI` (fallback nelle card senza immagine)
4. Nessun altro file da toccare

---

## 7. Cosa NON toccare senza skill aggiuntiva

| Area | Skill da caricare prima |
|------|------------------------|
| Hook `useMenuQrCodes` / logica QR code | `PUBLIC_MENU_SKILL.md` §6 |
| Pagina `PublicMenuCategoryPage` (lista piatti) | Leggere l'intero file prima |
| `MenuHomepageConfigPanel` — upload storage | `PUBLIC_MENU_SKILL.md` §4 + §7 |
| `menu_homepage_config` / `menu_qrcode_categories` | `DB_SKILL.md` + `DB_SCHEMA_CONTEXT.md` |
| `menuThemes.ts` — aggiungere/modificare un tema | Aggiornare anche PNG in `public/menu-themes/` e CHECK in migrazione 034 |
