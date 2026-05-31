# Pagina Prenota — sfondo fixed, asset sfondo3, padding colonna (31-05-26)

**Ruolo:** esecutore  
**File principali:** `src/pages/BookingRequestPage.tsx`, `public/asset/sfondo intero/full-0N-*.webp`, `src/features/booking/constants/bookingPageBackground.ts`, `docs/per-ui-design-skill/BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` §2  
**Stato:** codice + asset **non committati** · QA Matteo **⬜ header** · validate **✅ 227**

---

## Sintesi (1 riga)

Sfondo full-page **fisso** (`fixed` + `cover`); asset sostituiti con set **sfondo 3**; padding colonna contenuto **aumentato**; tentativi padding hanno **disallineato l’header** — fix finale con costanti px/-mx condivise **non confermato** da Matteo.

---

## Dati comunicazione

| Campo | Valore |
|-------|--------|
| **Schermata** | **Pagina Prenota** — link pubblico prenotazione (`/prenota/:slug`). Header (nome ristorante, titolo, descrizione), form, footer bianco Orari/Contatti. |
| **Effetto atteso** | Foto sfondo ferma mentre il cliente scorre; più spazio ai lati su form/card; titolo centrato sulle card come prima. |
| **Componente** | `BookingRequestPage.tsx` — layout colonna destra, layer sfondo, header pubblico. |
| **Storage** | `restaurant_settings.public_booking_page_background` — id `full-01`…`full-04` (invariato). `public_booking_strip_photo` — se valorizzato, striscia ON e sfondo pagina crema. |

---

## 1. Sfondo full-page fixed — ✅ implementato

### Brief
- Mobile (<768px): portrait, immagine **fissa**, contenuto scrolla sopra.
- Desktop (≥768px): landscape, stesso comportamento.
- `background-size: cover`, `background-position: top center`, `no-repeat`.
- Root fallback crema `#faf7f1` solo primo paint / immagine assente.
- Striscia laterale ON, tile/gradienti legacy, footer, griglia LOCK §0 — **non toccati**.

### Implementazione
- Layer foto: `absolute inset-0` + `100% auto` → **`fixed inset-0`** + `cover` + `top center`.
- iOS: `position: fixed` sul div (non `background-attachment: fixed`).
- Helper `fullPagePhotoLayerStyle()` in `BookingRequestPage.tsx`.
- Doc §2 aggiornata (trade-off footer: sfondo resta ancorato alla viewport).

### QA automatico
| Check | Esito |
|-------|--------|
| `npm run validate` | ✅ 227 test |

### QA Matteo ⬜
| Dove | Cosa fai | OK se… |
|------|----------|--------|
| Prenota, striscia OFF, sfondo full-0x | 375px: scroll form ↔ footer | Foto **ferma**, form/footer scorrono sopra |
| Idem | 1280px | Idem con asset landscape |
| Footer | Scroll fondo | Accettato trade-off: sfondo non scrolla col footer |

---

## 2. Asset sfondo — ✅ sostituiti (set attivo: sfondo 3)

### Step eseguiti
1. **`immagini di prova/sfondo2/`** → convertiti PNG→WebP → `public/asset/sfondo intero/full-01…04` (portrait/landscape per dimensioni reali; su `(a)` nomi invertiti rispetto a b/c/d).
2. **`immagini di prova/sfondo 3/`** → stessa destinazione, **sovrascrittura** set sfondo2.
3. Rimossi `preset-01-landscape.png` e `preset-01-portrait.png` (non referenziati dal codice).

### Mappa sfondo 3 (attiva)
| Preset | Landscape (≥768px) | Portrait (<768px) |
|--------|-------------------|-------------------|
| full-01 | `(a).png` 1672×941 | `(a)mobile.png` 941×1672 |
| full-02 | `(b).png` | `(b)mobile.png` |
| full-03 | `(c).png` | `(c)mobile.png` |
| full-04 | `(e).png` | `(e)mobile.png` |

Commenti aggiornati in `bookingPageBackground.ts` e `BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` §2.

**Nota:** hard refresh (Ctrl+F5) necessario — stessi nomi file, cache browser.

---

## 3. Padding colonna contenuto — ⚠️ fatto con errori header

### Brief
- Aumentare padding orizzontale colonna (header + form + sidebar + spacer).
- Footer Orari/Contatti: **non modificare**.

### Valori padding
| Stato | Full-page (no striscia) | Con striscia laterale |
|-------|---------------------------|------------------------|
| **Originale (git HEAD)** | `px-6 md:px-10 min-[900px]:px-6 lg:px-8` | stesso |
| **Attuale (non committato)** | `px-14 md:px-16 lg:px-16` | `px-8 md:px-10 lg:px-10` |

Footer: wrapper `px-0` + inner `px-6 md:px-10` — **invariato**.

---

## 4. Errori commessi (header disallineato)

### Sintomo segnalato da Matteo
Screenshot desktop: titolo «Trattoria da Matteo» e sottotitoli **spostati a sinistra** rispetto alle card/form sotto — non centrati sulla colonna contenuto.

### Causa root (ultima analisi)
Breakpoint **sovrapposti** su colonna e header (`md:`, `min-[900px]:`, `lg:`): Tailwind poteva applicare **valori diversi** a `px-*` colonna e `-mx-*` header (es. colonna `px-14` ma header `-mx-16`) → bleed asimmetrico → testo `textAlign: center` geometricamente storto.

### Cronologia tentativi (tutti insufficienti o peggiorativi fino all’ultimo)
| # | Azione | Esito |
|---|--------|--------|
| 1 | Aumento `px-*` + sync `-mx-*` | OK in teoria |
| 2 | Matteo: «annulla header» → ripristinati vecchi `-mx-6` con `px` già alto | **Header storto** |
| 3 | Re-sync `-mx` con `px` ma ancora `min-[900px]:` in conflitto | **Ancora storto** (screenshot) |
| 4 | Costanti condivise `BOOKING_PAGE_CONTENT_PAD_*` / `BOOKING_PAGE_HEADER_BLEED_*`; rimossi `min-[900px]:`; variante strip vs full-page | Fix **plausibile**, **⬜ non verificato** da Matteo |

### Fix finale in codice (da confermare)
```tsx
const BOOKING_PAGE_CONTENT_PAD_FULL = 'px-14 md:px-16 lg:px-16'
const BOOKING_PAGE_HEADER_BLEED_FULL = '-mx-14 md:-mx-16 lg:-mx-16'
// idem _STRIP con px-8 md:px-10 lg:px-10
```

---

## 5. File modificati (git diff vs HEAD)

```
BookingRequestPage.tsx              — sfondo fixed + padding + costanti header
bookingPageBackground.ts            — commenti asset sfondo3
BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md — §2 sfondo fixed + asset
8× full-0N-{landscape,portrait}.webp — set sfondo3
RestaurantSettingsTab.tsx             — 2 righe (minore, pre-esistente in sessione)
```

---

## 6. Cosa NON è stato toccato

- Footer wrapper / padding footer interno
- Griglia striscia, `BookingPhotoStrip`, spacer sticky bar
- `BookingRequestForm`, sidebar, sticky bar
- DB / Supabase / `restaurant_settings` valori
- Tile legacy, gradienti (layer scrollabile invariato)

---

## 7. QA automatico sessione

| Check | Esito |
|-------|--------|
| `npm run validate` (tutte le iterazioni) | ✅ lint + typecheck + 227 test |

**Non eseguito:** QA manuale sistematico 375×812 / 1280×800 post-fix header; screenshot post-fix costanti condivise.

---

## 8. Checklist chiusura (Matteo)

| Dove | Cosa fai | OK se… |
|------|----------|--------|
| Prenota full-page | Hard refresh | Nuove foto set sfondo 3 visibili |
| Prenota full-page | 375px / 1280px scroll | Sfondo fisso, form scorre; footer full-width |
| Prenota full-page | Guarda header vs card sotto | Titolo **centrato** sulla colonna form |
| Prenota | Confronto padding | Più spazio ai lati rispetto a prima; footer uguale |
| Admin Impostazioni | Anteprima full-01…04 | Miniature coerenti con pagina pubblica |

Se header **ancora storto:** considerare rimuovere del tutto il bleed `-mx-*` e lasciare header **dentro** lo stesso padding del form (allineamento garantito, header leggermente più stretto).

---

## 9. Verdetto esecutore

| Area | Esito |
|------|--------|
| Sfondo fixed + cover | ✅ come brief |
| Asset sfondo3 | ✅ deploy file |
| Padding aumentato | ✅ valori più alti del baseline |
| Header centrato | ❌ **rotto durante iterazioni**; ultimo fix **non validato** |
| Comunicazione / iterazioni padding | ❌ troppi giri, regressioni evitabili con QA visivo prima di chiudere |

**Sessione fermata su richiesta Matteo** — nessun ulteriore intervento fino a nuova istruzione.
