# Fix — Pagina Prenota: sfondo full-page hero `cover` senza banda crema (31-05-26)

**Ruolo:** esecutore (standard)  
**File:** `src/pages/BookingRequestPage.tsx`  
**Follow-up:** FU-028 (estensione full-page) · contesto [footer scroll](./Report-fix-prenota-footer-scroll-sfondo-31-05-26.md)

---

## Sintesi (1 riga)

Foto preset **pagina intera** (`full-01`…`04`): layer hero `absolute` con `min-h-svh` + `background-size: cover` (prima viewport coperta); sotto resta crema; layer scrolla col documento — nessun salto footer. `npm run validate` verde.

---

## Dati comunicazione

| Campo | Valore |
|-------|--------|
| **Schermata** | **Pagina Prenota** — form pubblico del cliente (`/prenota/:slug`). Con sfondo «Pagina intera» la foto copre il primo schermo; scorrendo il form compare la tinta crema; in fondo la card bianca Orari/Contatti. |
| **Effetto per il ristoratore** | Il preset scelto in **Impostazioni → Pagina Prenota** (anteprima sfondo, opzione `full-0x`) non mostra più «metà foto / metà crema» sul primo schermo mobile. Scorrendo fino al footer e risalendo, lo sfondo non salta né lampeggia. |
| **Componente** | `BookingRequestPage.tsx` — pagina che compone header, form, sticky bar e footer. |
| **Storage** | `restaurant_settings.public_booking_page_background` — id foto intera (`full-01`…`full-04`). Con **striscia laterale** attiva (`public_booking_strip_photo`) lo sfondo pagina resta crema `#faf7f1` (invariato). |

---

## Problema e soluzione

### Causa

Layer foto full-page con `absolute inset-0` (altezza = intero documento) e `background-size: 100% auto`: l'immagine occupava solo la sua altezza naturale in proporzione alla larghezza viewport → banda crema visibile a metà primo schermo (375px portrait).

### Fix

| Aspetto | Prima | Dopo |
|---------|--------|------|
| Posizionamento foto | `absolute inset-0` (tutto il documento) | `absolute inset-x-0 top-0 min-h-svh` (solo hero prima viewport) |
| `background-size` | `100% auto` | `cover` |
| Oltre prima viewport | Crema sotto metà immagine (effetto «taglio») | Crema intenzionale sotto hero |
| Scroll footer | `absolute` scrollabile (fix 31-05-26) | **Invariato** — niente `fixed` |
| Tile / gradiente | layer `absolute inset-0` | **Invariato** |

Il `cover` limitato a `min-h-svh` evita lo zoom eccessivo che si avrebbe applicando `cover` sull'intera altezza del form lungo.

---

## QA automatico (esecutore)

| Dove | Cosa | Esito |
|------|------|--------|
| `npm run validate` | lint + typecheck + 227 test | ✅ |

### Checklist QA Matteo

| Dove | Cosa fai | OK se… |
|------|----------|--------|
| Pagina Prenota TEST, preset **pagina intera** (`full-0x`) | DevTools ~375px: primo schermo | Foto **copre** tutta la viewport, niente banda crema a metà |
| Stesso | Scroll fino footer Orari/Contatti, risali 2–3 volte | **Nessun salto/lampeggio** sfondo |
| Stesso | 834px e 1280px | Idem |
| Con **tile** o **gradiente** (se usati) | Smoke rapido | Nessuna regressione |

URL esempio: `http://localhost:5173/prenota/test-pro`

---

## File toccati

- `src/pages/BookingRequestPage.tsx` — layer hero full-page
- `docs/per-ui-design-skill/BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` — §2 aggiornato
- `docs/SESSION_LOG.md` — riga sessione

**Commit:** non eseguito (salvo richiesta Matteo).
