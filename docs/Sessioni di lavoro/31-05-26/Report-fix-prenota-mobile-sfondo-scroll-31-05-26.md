# Report finale — Pagina Prenota: sfondo full-page mobile stabile in scroll (31-05-26) · **CHIUSO ✅**

**Ruolo:** esecutore (deep) · chiusura ciclo FU-028  
**File:** `BookingRequestPage.tsx`, `useBookingPublicViewport.ts`, `index.css`  
**Commit:** `cd10c64` su `env/test` (pushato)  
**Contesto ciclo:** [tile/gradiente FU-028](Report-fix-prenota-footer-scroll-sfondo-31-05-26.md) · [meta-analisi Prenota vs QR](Report-meta-analisi-routing-prenota-vs-menu-qr-31-05-26.md)

---

## Sintesi (1 riga)

Layer foto full-page: `fixed` con altezza **`100lvh`** + hook viewport dedicato Prenota — crop stabile su scroll footer↔top su **Android Chrome**; **QA Matteo OK** («fixato, ottimo lavoro»). Tile/gradiente e griglia LOCK invariati. `npm run validate` ✅ 227. **FU-028 rimosso da `FOLLOW_UP.md`.**

---

## Dati comunicazione

| Campo | Valore |
|-------|--------|
| **Schermata** | **Pagina Prenota** — form pubblico che il cliente apre dal link del ristorante (`/prenota/:slug`, es. `test-pro`). Sfondo foto intera ferma; form e footer bianco Orari/Contatti scorrono sopra. |
| **Effetto per il ristoratore** | La foto scelta in **Impostazioni → Pagina Prenota** (preset `full-01`…`full-04`) **non “salta” più** quando il cliente scorre fino al footer e risale — soprattutto su **Android Chrome** con barra URL che si nasconde/mostra. |
| **Componente** | `BookingRequestPage.tsx` — layer sfondo portrait/landscape; `useBookingPublicViewport.ts` — meta viewport solo su questa route. |
| **Storage** | `restaurant_settings.public_booking_page_background` — id foto intera (`full-0x`) o tile/gradiente legacy. `public_booking_strip_photo` — se valorizzato, striscia ON e sfondo pagina crema (fix non applicato in quella modalità). |

### Dati comunicazione estesa (doppio livello)

**Dove nell’app (cliente)**  
Il cliente apre il link prenotazione del ristorante (es. da QR o sito). Vede nome locale, titolo pagina, card tipologia/menù, form dati e in fondo la fascia bianca **Orari** e **Contatti**. Con sfondo **foto a pagina intera** attivo, la foto resta ferma dietro mentre lui scorre il form.

**Cosa fa il ristoratore (admin)**  
In **Impostazioni → Pagina Prenota** (anteprima sfondo) sceglie un preset **foto intera** (`full-01`…`full-04`) e lascia **disattivata** la striscia laterale. Non deve fare nulla in più: il comportamento è automatico sulla pagina pubblica.

**Componenti tecnici (riferimento agenti)**  
- `BookingRequestPage.tsx` — composizione layout, due layer foto (portrait mobile / landscape desktop), footer, sticky bar.  
- `useBookingPublicViewport.ts` — hook montato solo su `/prenota/:slug`; imposta meta viewport e classe `html.booking-public-viewport`.  
- `src/index.css` — regole CSS per quella classe (mirror pattern Menu QR).

**Storage DB (Supabase)**  
Tabella `restaurant_settings`, chiavi per tenant:

| Chiave | Cosa contiene | Ruolo in questo fix |
|--------|---------------|---------------------|
| `public_booking_page_background` | Id preset: `full-01`…`full-04` (foto intera), oppure id tile/gradiente legacy | Fix attivo quando valore = `full-0x` e striscia off |
| `public_booking_strip_photo` | Id striscia `strip-01`…`strip-06` oppure `''` (nessuna) | Se valorizzato → pagina crema, **nessun** layer full-page |

**Prima vs dopo (effetto percepito)**  
| Prima | Dopo |
|-------|------|
| Scorrendo verso il footer (e risalendo) la foto sembrava **spostarsi** o fare un micro “reload” — senza spinner, su qualsiasi preset foto | Scroll fluido: la foto resta **ferma** con lo stesso ritaglio; form e footer scorrono sopra |

**Conferma Matteo:** Android Chrome, sfondo full-page, striscia OFF — **OK** («fixato, ottimo lavoro»).

---

## Diagnosi root cause

### Sintomo (Matteo, Android Chrome)

- Nessuno spinner / re-download asset.
- Crop foto sembra spostarsi ai confini scroll (footer ↔ top).
- Succede con qualsiasi preset `full-0x` → bug implementazione layer, **non** dipendente dal file foto.

### Ipotesi confermate

| ID | Verdetto | Evidenza |
|----|----------|----------|
| **H1** Viewport mobile dinamico (barra URL Android) | **Confermata** | `fixed inset-0` segue altezza viewport visibile; Prenota non aveva hook viewport (Menu QR sì) |
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

- Nuovo hook `src/hooks/useBookingPublicViewport.ts`
- Meta: `width=device-width, initial-scale=1.0, interactive-widget=resizes-content, viewport-fit=cover`
- Classe `html.booking-public-viewport` + CSS in `index.css` (pattern analogo Menu QR, classe separata)
- Montato **solo** in `BookingRequestPage`; cleanup on unmount

### B — Layer fixed con altezza stabile

- Costante `FULL_PAGE_PHOTO_LAYER_CLASS`: `fixed top-0 left-0 right-0 h-[100lvh] min-h-[100svh] -z-10`
- Portrait `<768px`, landscape `≥768px` — stesso pattern
- **Non** `inset-0`, **non** `100dvh`

### Invariato (LOCK / FU-028 tile path)

- Griglia striscia, footer fuori griglia, spacer, header padding `px-8 md:px-10`
- Tile legacy + gradienti su layer `absolute` scrollabile (fix sessione precedente)
- Striscia ON → crema `#faf7f1`
- Menu QR, asset WebP, DB

---

## Compatibilità mobile sfondo

| Ambiente | Esito | Nota |
|----------|-------|------|
| Playwright 375×812 | ✅ altezza + backgroundPosition stabili | Non sostituisce device reale |
| Playwright 834 / 1280 | ✅ landscape, footer full-width | — |
| **Android Chrome (Matteo)** | ✅ **OK** | Scroll footer↔top — nessun salto crop |
| iOS Safari | ⬜ non testato | `lvh` + fixed già usati altrove; smoke opzionale |

---

## QA

| Check | Esito |
|-------|--------|
| `npm run validate` | ✅ 227 test |
| 375px scroll 3 cicli (auto) | ✅ heightStable |
| 834px / 1280px (auto) | ✅ heightStable, footer width = viewport |
| Network scroll | ✅ solo load iniziale asset |
| **Matteo Android Chrome** | ✅ «fixato, ottimo lavoro» |

Smoke opzionali non eseguiti: tile/gradiente su slug texture, striscia ON, iOS — nessuna segnalazione regressione.

---

## Ciclo chiuso

| Fase | Stato |
|------|--------|
| Fix tile/gradiente scroll (FU-028 codice) | ✅ |
| Fix full-page mobile Android | ✅ |
| QA Matteo device reale | ✅ |
| Report + skill §2 | ✅ |
| FU-028 | ✅ **rimosso da tabella follow-up** |

---

## Derivazione errori (processo)

| # | Cosa è successo | Causa | Come evitare |
|---|-----------------|-------|--------------|
| 1 | Fix #8 applicato su Menu QR invece che Prenota | Misrouting checklist ciclo Menu QR | Gate URL smoke nel prompt (Prenota vs QR) — vedi meta-analisi 31-05-26 |
| 2 | FU-028 chiuso a codice ma KO su full-page mobile | Primo fix toccava solo tile/gradiente; tenant TEST usa spesso `full-0x` | QA esplicito per **modalità sfondo attiva in admin**, non solo path tile |
| 3 | Sintomo attribuito a preset foto | Matteo: succede con tutte le foto | Diagnosi su layer/viewport, non su asset |

---

## File toccati

- `src/hooks/useBookingPublicViewport.ts` — nuovo
- `src/pages/BookingRequestPage.tsx` — hook + layer `100lvh`
- `src/index.css` — `html.booking-public-viewport`
- `docs/per-ui-design-skill/BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` — §2
- `docs/FOLLOW_UP.md` — FU-028 **rimosso**
- `docs/SESSION_LOG.md` — riga sessione

**Commit:** `cd10c64` — `fix(prenota): stabilizza crop sfondo full-page su mobile Android` (push `origin/env/test`).
