# Fix — Pagina Prenota: sfondo full-page mobile stabile in scroll (31-05-26)

**Ruolo:** esecutore (deep)  
**File:** `BookingRequestPage.tsx`, `useBookingPublicViewport.ts`, `index.css`  
**Follow-up:** FU-028 (QA full-page mobile) · contesto [FU-028 tile/gradiente](Report-fix-prenota-footer-scroll-sfondo-31-05-26.md)

---

## Sintesi (1 riga)

Layer foto full-page: `fixed` con altezza **`100lvh`** + hook viewport Prenota (`interactive-widget=resizes-content`) — crop stabile su scroll footer↔top; tile/gradiente e griglia LOCK invariati. `npm run validate` ✅ 227.

---

## Dati comunicazione

| Campo | Valore |
|-------|--------|
| **Schermata** | **Pagina Prenota** — form pubblico che il cliente apre dal link del ristorante (`/prenota/:slug`, es. `test-pro`). Sfondo foto intera fermo; form e footer bianco Orari/Contatti scorrono sopra. |
| **Effetto per il ristoratore** | La foto scelta in **Impostazioni → Pagina Prenota** (preset `full-01`…`full-04`) **non “salta” più** quando il cliente scorre fino al footer e risale — soprattutto su **Android Chrome** con barra URL che si nasconde/mostra. |
| **Componente** | `BookingRequestPage.tsx` — layer sfondo portrait/landscape; `useBookingPublicViewport.ts` — meta viewport solo su questa route. |
| **Storage** | `restaurant_settings.public_booking_page_background` — id foto intera (`full-0x`) o tile/gradiente legacy. `public_booking_strip_photo` — se valorizzato, striscia ON e sfondo pagina crema (fix non applicato in quella modalità). |

---

## Diagnosi root cause

### Sintomo (Matteo, Android Chrome)

- Nessuno spinner / re-download asset.
- Crop foto sembra spostarsi ai confini scroll (footer ↔ top).
- Succede con qualsiasi preset `full-0x` → bug implementazione layer, non asset.

### Ipotesi confermate

| ID | Verdetto | Evidenza |
|----|----------|----------|
| **H1** Viewport mobile dinamico (barra URL) | **Confermata** | `fixed inset-0` segue altezza viewport visibile; Prenota non aveva hook viewport (Menu QR sì) |
| **H2** `cover` su layer fixed ricalcola crop | **Confermata** | Altezza box variabile → `background-size: cover` ridisegna crop |
| **H3** Footer bianco vs foto | Secondaria | Amplifica percezione, non spiega tutti i preset |
| **H4** `min-h-screen` | Secondaria | Non modificato in questo fix |
| **H5** Stacking `isolate/-z-10` | Smentita | Non correlato |

### Misure Playwright (375×812, `/prenota/test-pro`, full-page attivo)

**Prima del fix** (`fixed inset-0`):

| Punto scroll | layerHeight | backgroundPosition | backgroundSize | Re-fetch portrait |
|--------------|-------------|-------------------|----------------|-------------------|
| top | 812px | 50% 0% | cover | 2 richieste iniziali |
| footer (3 cicli) | 812px | 50% 0% | cover | 0 in scroll |

Nota: emulazione desktop Playwright **non** simula hide/show barra URL Android — altezza restava 812px ma il sintomo reale su device è coerente con H1+H2.

**Dopo il fix** (`h-[100lvh]` + `useBookingPublicViewport`):

| Punto scroll | layerHeight | htmlClass | viewport meta |
|--------------|-------------|-----------|---------------|
| top | 812px | `booking-public-viewport` | `interactive-widget=resizes-content` |
| footer (3 cicli) | 812px | idem | idem |
| Δ altezza | **0** | — | — |

**834×1194 / 1280×800:** layer landscape visibile, altezza stabile post-scroll; footer full-width OK.

---

## Implementazione

### A — Viewport Prenota (`useBookingPublicViewport`)

- Nuovo hook [`src/hooks/useBookingPublicViewport.ts`](../../../src/hooks/useBookingPublicViewport.ts)
- Meta: `width=device-width, initial-scale=1.0, interactive-widget=resizes-content, viewport-fit=cover`
- Classe `html.booking-public-viewport` + CSS in `index.css` (mirror Menu QR)
- Montato **solo** in `BookingRequestPage`; cleanup on unmount

### B — Layer fixed con altezza stabile

- Costante `FULL_PAGE_PHOTO_LAYER_CLASS`: `fixed top-0 left-0 right-0 h-[100lvh] min-h-[100svh] -z-10`
- Portrait `<768px`, landscape `≥768px` — stesso pattern
- **Non** `inset-0`, **non** `100dvh`

### Invariato (LOCK / FU-028)

- Griglia striscia, footer fuori griglia, spacer, header padding
- Tile legacy + gradienti su layer `absolute` scrollabile
- Striscia ON → crema `#faf7f1`
- Menu QR, asset WebP, DB

---

## Compatibilità mobile sfondo

| Ambiente | Esito automatico | Nota |
|----------|------------------|------|
| Playwright 375×812 | ✅ altezza + backgroundPosition stabili | Non sostituisce device reale |
| Playwright 834 / 1280 | ✅ landscape, footer full-width | — |
| **Android Chrome (Matteo)** | ⬜ smoke manuale | Priorità — conferma assenza salto crop |
| iOS Safari | ⬜ non testato in sessione | `lvh` + fixed pattern già usato altrove |

---

## QA automatico

| Check | Esito |
|-------|--------|
| `npm run validate` | ✅ 227 test |
| 375px scroll 3 cicli | ✅ heightStable |
| 834px / 1280px | ✅ heightStable, footer width = viewport |
| Network scroll | ✅ solo load iniziale asset portrait/landscape |

### QA Matteo (chiusura FU-028 full-page)

| Dove | Cosa | OK se… |
|------|------|--------|
| Android Chrome, `/prenota/test-pro`, striscia OFF, `full-0x` | 3× scroll footer ↔ top | **Nessun salto** crop foto |
| 834px tablet | Idem + form leggibile | Idem |
| 1280px desktop | Foto landscape fissa | Nessuna regressione |
| Tile/gradiente (se slug con texture) | Scroll footer | Nessuna regressione FU-028 |
| Striscia ON | Smoke | Crema + striscia OK |

---

## File toccati

- `src/hooks/useBookingPublicViewport.ts` — nuovo
- `src/pages/BookingRequestPage.tsx` — hook + layer `100lvh`
- `src/index.css` — `html.booking-public-viewport`
- `docs/per-ui-design-skill/BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` — §2
- `docs/FOLLOW_UP.md` — FU-028
- `docs/SESSION_LOG.md`

**Commit:** non eseguito (salvo richiesta esplicita Matteo).
