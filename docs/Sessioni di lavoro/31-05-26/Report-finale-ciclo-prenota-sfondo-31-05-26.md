# Report finale — Ciclo sfondo Pagina Prenota (31-05-26)

**Modalità:** standard · **Chiusura ciclo** con QA Matteo ✅  
**Branch di lavoro:** `env/test` (commit non richiesto in questa sessione)

---

## 1. Sintesi per Matteo

| Schermata | Cosa vede il ristoratore / cliente |
|-----------|-------------------------------------|
| **Pagina Prenota** (`/prenota/:slug`) | Sfondo foto **fisso** (non scorre); modulo, titoli e card **più distanziati dai bordi**; header allineato al form; footer Orari/Contatti **a tutta larghezza** come prima |
| **Admin → Impostazioni → Personalizza form** | Tab apre **senza errori in console**; anteprime sfondo full-01…04 ok |

**Storage:** `restaurant_settings.public_booking_page_background` (es. `full-01`) + file in `public/asset/sfondo intero/full-NN-{portrait|landscape}.webp`.

---

## 2. Decisione prodotto finale (dopo iterazioni)

1. **Sfondo full-page:** immagine **bloccata** sulla viewport (`fixed` + `cover`); il **contenuto scrolla sopra** — niente repeat-y, niente fogli altissimi, niente hero+crema sotto.
2. **Asset:** 4 preset WebP portrait/landscape (set **sfondo 3**, ~941×1672 / ~1672×941) — adatti al cover su uno schermo.
3. **Padding laterale:** header + form + sticky con **stesso inset** (`px-8 md:px-10`); **footer escluso** (edge-to-edge).
4. **Admin Personalizza form:** niente loop React all’apertura tab.

Iterazioni scartate nel ciclo: scroll sheet 7200px, repeat-y, hero `min-h-svh` + crema, padding con `-mx` sull’header (disallineava titolo vs card).

---

## 3. Lavoro svolto (cronologia tecnica)

| Fase | File / area | Esito |
|------|-------------|--------|
| Footer scroll tile/gradiente | `BookingRequestPage` layer `absolute` | ✅ (sessione precedente) |
| Integrazione asset full-01…04 | `public/asset/sfondo intero/`, admin anteprime | ✅ |
| Tentativi display (hero, repeat-y) | CSS full-page | ❌ rifiutati da Matteo |
| **Sfondo fixed + cover** | `BookingRequestPage.tsx`, §2 layout context | ✅ strategia attuale |
| Asset sfondo3 | 8 WebP sostituiti | ✅ |
| Padding colonna ↑ | `px-8 md:px-10` | ✅ |
| Regressione header (bleed `-mx-14`) | Esecutore intermedio | ❌ → **fix revisione** |
| Loop Personalizza form | `BookingFormConfigPanel`, `BookingFormPromoSection` | ✅ fix |

---

## 4. Fix revisione (sessione corrente)

### 4.1 Header allineato al form

**Problema:** colonna con `px-14` + wrapper header con `-mx-14` → titolo quasi a filo schermo, card form rientrate.

**Fix in `BookingRequestPage.tsx`:**
- Costanti `BOOKING_PAGE_CONTENT_PAD_*` → `px-8 md:px-10 lg:px-10`
- Rimosso `headerBleed` / `-mx-*` sull’header
- Rimosso `px-2` extra su h1/h2 (offset spurio)
- Header, form e sticky condividono `contentColumnPad`

### 4.2 Loop «Maximum update depth» — Personalizza form

**Cause:**
1. `useEffect(..., [tenantId, headerAutosave])` — `headerAutosave` oggetto nuovo ogni render → `cancelPending()` → setState → loop. **Rimosso** (il hook autosave già cancella su `tenantId`).
2. `savedPromos = data ?? []` inline in `BookingFormPromoSection` — array nuovo ogni render → loop sync. **Fix:** `EMPTY_MENU_PROMOS` costante modulo.

---

## 5. Stato codice attuale (riferimento)

**Sfondo full-page** — layer `fixed inset-0 -z-10`, portrait `<768px`, landscape `≥768px`, `cover` + `top center`, `no-repeat`.

**Padding** — colonna contenuto: `px-8 md:px-10 lg:px-10` (full-page e striscia stessa scala).

**Footer** — fuori colonna padded, `w-full`, invariato.

---

## 6. Verifiche

| Check | Esito |
|-------|--------|
| `npm run validate` | ✅ 227 test |
| QA automatico agente (header 375/834/1280, loop admin) | ✅ |
| **QA Matteo — header allineato** | ✅ |
| **QA Matteo — console Personalizza form** | ✅ nessun errore |
| QA Matteo — scroll footer vs sfondo fixed (salto/lampeggio) | ⬜ opzionale |
| QA Matteo — tile/gradiente legacy scroll | ⬜ (FU-028 residuo se serve) |

---

## 7. File toccati nel ciclo (cumulativo)

- `src/pages/BookingRequestPage.tsx`
- `src/features/booking/constants/bookingPageBackground.ts`
- `src/features/booking/components/RestaurantSettingsTab.tsx`
- `src/features/booking/components/settings/BookingFormConfigPanel.tsx`
- `src/features/booking/components/settings/BookingFormPromoSection.tsx`
- `public/asset/sfondo intero/full-01..04-{portrait,landscape}.webp`
- `docs/per-ui-design-skill/BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` §2

---

## 8. Dati comunicazione

- **Pattern utile:** decisioni UX (fixed vs scroll vs repeat) vanno in cima al prompt; l’esecutore aveva implementato padding+bleed senza allineare header — revisione obbligatoria su “stesso inset”.
- **Bug classico React:** dipendere da oggetti hook non memoizzati (`headerAutosave`) o `?? []` inline in `useEffect`.
- **Messaggio Matteo chiusura:** «non vedo errore in console e header è ok».

---

## 9. Follow-up

| ID | Nota |
|----|------|
| FU-028 | Display sfondo — **chiusura display full-page fixed** se Matteo non segnala altro; resta verifica tile/gradiente scroll |
| — | Commit+push `env/test` quando Matteo chiede preview mobile/prod |

---

## 10. Skill §7.2

Allineato: `BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` §2 (fixed + cover, asset sfondo3, trade-off footer).
