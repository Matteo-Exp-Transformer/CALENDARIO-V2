# Fix — Pagina Prenota: sfondo scroll footer senza salto (31-05-26)

**Ruolo:** esecutore (deep)  
**File:** `src/pages/BookingRequestPage.tsx`  
**Follow-up:** FU-028 · contesto [meta-analisi](./Report-meta-analisi-routing-prenota-vs-menu-qr-31-05-26.md)

---

## Sintesi (1 riga)

Tile legacy e gradienti usano un layer **`absolute`** alto quanto il documento (sfondo che **scrolla** col contenuto); niente `fixed` per tile/gradiente. Foto full-page invariate (`fixed`). `npm run validate` verde.

---

## Dati comunicazione

| Campo | Valore |
|-------|--------|
| **Schermata** | **Pagina Prenota** — form pubblico che il cliente apre dal link del ristorante (`/prenota/:slug`, es. `test-pro`). In fondo: card bianca **Orari** e **Contatti**. |
| **Effetto per il ristoratore** | La texture o il gradiente scelto in **Impostazioni → Pagina Prenota** (anteprima sfondo) resta allineata mentre il cliente scorre fino al footer e risale, senza “salti” o lampeggi del motivo. |
| **Componente** | `BookingRequestPage.tsx` — pagina che compone header, form, sticky bar e footer. |
| **Storage** | `restaurant_settings.public_booking_page_background` — valore testuale: id **tile** (`tile-01`…), id **gradiente** (`noce-classico`, …), id **foto intera** (`full-01`…). Con **striscia laterale** attiva (`public_booking_strip_photo`) lo sfondo pagina è solo crema `#faf7f1` (la striscia ha le sue foto). |

---

## Approccio — salto eliminato mantenendo sfondo scrollabile

### Vincolo Matteo (non negoziabile)

- Lo sfondo tile/gradiente deve **muoversi con la pagina** → **vietato** `position: fixed` (come revert Menu QR #8).
- Le **foto full-page** restano sui layer `fixed inset-0` già presenti — non toccati.

### Cosa causava il salto (ipotesi confermata in codice)

1. **Tile `repeat-y`** e **gradiente `cover`** erano applicati sul **root scrollabile** (`div.min-h-screen` con `style` inline). In scroll lungo + transizione al **footer bianco**, il browser può ricalcolare il painting del background sul box che cresce con il contenuto → percezione di salto/lampeggio.
2. **`background-size: cover`** sul gradiente lega il ridimensionamento all’altezza del box root (che cambia con form/footer), non stabile rispetto al solo scroll.

### Soluzione implementata

| Path | Prima | Dopo |
|------|--------|------|
| Tile legacy | `repeat-y` + `100% auto` sul root | Stessi valori su layer figlio `absolute inset-0 -z-10` (altezza = intero documento) |
| Gradiente | `cover` sul root | `100% 100%` sullo stesso layer (gradiente esteso all’altezza documento, senza ricalcolo `cover` in scroll) |
| Root | background completo inline | Solo **colore fallback** (`BOOKING_PAGE_GRADIENT_ROOT_FALLBACK_COLOR` o crema striscia / full-page) |
| Foto full-page | `fixed` portrait/landscape | **Invariato** |

Il layer `absolute` **non** è `fixed`: scorre con il root perché è ancorato al contenitore `relative` che cresce con form + footer.

### Cosa NON si è fatto (documentato)

| Tentativo scartato | Motivo |
|--------------------|--------|
| Layer `fixed inset-0` per tile (fix QR Prompt B) | Contrario al vincolo prodotto Prenota |
| Switch JS single/layer post-load | Preferenza CSS; rischio flash |
| Modifica foto full-page | Fuori scope salvo bug dimostrato |

---

## QA automatico (esecutore)

| Dove | Cosa | Esito |
|------|------|--------|
| `npm run validate` | lint + typecheck + 227 test | ✅ |
| Playwright locale `/prenota/test-pro` | Tenant TEST: sfondo **full-02** (layer `fixed` foto — path invariato); 3 cicli scroll footer ↔ top: `backgroundPosition` stabile | ✅ regressione full-page |
| Playwright tile su slug DB `tile-01` | In dev locale le pagine caricate hanno mostrato comunque preset **full-page** (probabile mismatch env Supabase vs MCP test) | ⬜ **smoke tile/gradiente: Matteo** su tenant con texture attiva |

### Checklist QA Matteo (obbligatoria per chiusura FU-028)

| Dove | Cosa fai | OK se… |
|------|----------|--------|
| Pagina Prenota tenant TEST (o slug con **texture** attiva in admin) | DevTools ~375px: scroll fino footer Orari/Contatti, risali 2–3 volte | Texture/gradiente **scorre** con la pagina, **nessun salto** |
| Stesso | 834px e 1280px | Idem |
| Con **tile** legacy in admin | Ripeti | Idem |
| Con **gradiente** o **striscia** (se usati) | Smoke rapido | Nessuna regressione evidente |
| Con **foto intera** (`full-0x`) | Smoke rapido | Comportamento come prima (foto fissa, form leggibile) |

URL esempio: `http://localhost:5173/prenota/test-pro` (full-page) · per tile verificare lo slug dove in admin è selezionata una **texture** (non foto intera).

---

## File toccati

- `src/pages/BookingRequestPage.tsx` — layer scrollabile tile/gradiente
- `docs/per-ui-design-skill/BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` — nota §2 tile/gradiente scrollabile
- `docs/FOLLOW_UP.md` — FU-028 aggiornato
- `docs/SESSION_LOG.md` — riga sessione

**Commit:** non eseguito (richiesta sessione).
