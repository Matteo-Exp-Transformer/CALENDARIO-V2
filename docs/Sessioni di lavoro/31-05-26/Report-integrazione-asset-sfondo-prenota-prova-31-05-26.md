# Integrazione asset sfondo Pagina Prenota — prove (a)(b)(c)(d) (31-05-26)

**Ruolo:** esecutore (standard)  
**Scope:** WebP preset `full-01`…`full-04`, costanti, griglia admin. **Nessuna** modifica CSS `BookingRequestPage.tsx`.

---

## Sintesi (1 riga)

Le 8 PNG in `immagini di prova/` sono state convertite in WebP (q=80) in `public/asset/sfondo intero/`; aggiunto preset **`full-04`**; griglia admin 2×2 / 4 colonne; `npm run validate` verde (227 test). QA visivo Matteo ⬜.

---

## Mapping sorgente → asset

| Coppia | Landscape (sorgente) | Portrait (sorgente) | Destino | Dimensioni finali | Peso KB |
|--------|----------------------|---------------------|---------|-------------------|---------|
| **(a)** | `prova sfondo pagina prenota (a).png` | `mobileprova sfondo pagina prenota (a).png` | `full-01-landscape.webp` + `full-01-portrait.webp` | 1672×941 / 941×1672 | 137 / 89 |
| **(b)** | `… (b).png` | `mobileprova … (b).png` | `full-02-*` | idem | 147 / 141 |
| **(c)** | `… (c).png` | `mobileprova … (c).png` | `full-03-*` | idem | 211 / 147 |
| **(d)** | `… (d).png` | `mobileprova … (d).png` | `full-04-*` (**nuovo**) | idem | 93 / 75 |

**Note export**

- PNG sorgente: **1672×941** (≈16:9) e **941×1672** (≈9:16) — aspect ratio corretto; **nessun** ridimensionamento (inferiori a 2560×1440 / 1440×2560 documentati ma proporzionali).
- WebP qualità **80** (range richiesto 78–82), tool **sharp** (sessione locale, non aggiunto a `package.json`).
- Sostituiti i 6 file `full-01`…`03`; creati `full-04-landscape.webp` e `full-04-portrait.webp`.

**URL pubblici** (helper invariato):  
`{BASE_URL}asset/sfondo%20intero/full-0N-landscape.webp` · `…-portrait.webp`  
(`bookingFullPageBackgroundPublicHref` in `bookingPageBackground.ts`).

---

## Dati comunicazione

| Campo | Valore |
|-------|--------|
| **Schermata** | **Pagina Prenota** — pagina pubblica del cliente (`/prenota/:slug`). Con modalità «pagina intera» (senza striscia laterale) lo sfondo è la foto a tutta pagina dietro header e form. |
| **Effetto per il ristoratore** | In **Admin → Impostazioni → Personalizza form → Pagina Prenota → Sfondo pagina intera** vede **4** anteprime («Sfondo 1»…«Sfondo 4»). Scegliendo **Sfondo 4** i clienti vedono la coppia immagini **(d)**; su telefono la versione verticale, da tablet/desktop in su la orizzontale. |
| **Componente** | `RestaurantSettingsTab.tsx` — sezione personalizzazione sfondo; `bookingPageBackground.ts` — elenco id `full-01`…`full-04` e URL file. Rendering sfondo: `BookingRequestPage.tsx` (non modificato in questa sessione). |
| **Storage** | `restaurant_settings.public_booking_page_background` — stringa id (`full-01` … `full-04`, oppure tile/gradiente). Se è attiva la **striscia laterale** (`public_booking_strip_photo`), questo campo non viene usato per lo sfondo (resta crema `#faf7f1`). |

---

## Modifiche codice

| File | Modifica |
|------|----------|
| `src/features/booking/constants/bookingPageBackground.ts` | `BOOKING_FULL_PAGE_BACKGROUND_IDS` + `'full-04'`; commento path WebP |
| `src/features/booking/components/RestaurantSettingsTab.tsx` | Griglia preset pagina intera: `grid-cols-2 sm:grid-cols-4` |
| `public/asset/sfondo intero/*.webp` | 8 file WebP (6 aggiornati + 2 nuovi) |
| `docs/per-ui-design-skill/BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` §2 | «3 preset» → «4 preset `full-01..04`» |

**Non toccato:** `BookingRequestPage.tsx` (CSS `100% auto`, scroll documento — commit `d98d9b8` / `f0681b8`).

---

## QA automatico (esecutore)

| Controllo | Esito |
|-----------|--------|
| `npm run validate` | ✅ 227 test |
| File `full-04-*.webp` presenti in `public/asset/sfondo intero/` | ✅ |
| `isBookingFullPageBackgroundId('full-04')` via costante | ✅ |

### Checklist QA Matteo

| Dove | Cosa fai | OK se… |
|------|----------|--------|
| Admin → Personalizza form → **Sfondo pagina intera** | Conta anteprime, seleziona **Sfondo 4** | 4 card; anteprima = coppia **(d)** |
| `/prenota/test-pro` (o slug TEST) | Ruota `full-01`…`04`, hard refresh | Nessun 404 su `asset/sfondo%20intero/full-0X-*.webp` |
| Mobile &lt;768px vs ≥768px | Stesso preset | Portrait vs landscape corretti |

---

## Git / cartella prove

- **`immagini di prova/`** — resta **non tracciata** (solo riferimento locale); **non** includere nei commit produzione salvo richiesta esplicita.
- Opzionale futuro: voce `.gitignore` per `immagini di prova/` se si vuole evitare `git status` rumoroso.

**Commit:** non eseguito (attesa richiesta Matteo).

---

## Follow-up

- Hero full-page `100vh` + `cover` → sessione separata post-QA asset (fuori scope).
