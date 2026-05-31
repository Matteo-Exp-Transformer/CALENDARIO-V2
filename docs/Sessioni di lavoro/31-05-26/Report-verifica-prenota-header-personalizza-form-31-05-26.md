# Verifica + fix — header Prenota allineato + loop Personalizza form (31-05-26)

**Ruolo:** esecutore · profilo **Verifica + fix**  
**File principali:** `src/pages/BookingRequestPage.tsx`, `src/features/booking/components/settings/BookingFormConfigPanel.tsx`, `src/features/booking/components/settings/BookingFormPromoSection.tsx`  
**Stato:** codice **non committato** · validate **✅ 227** · QA automatico header **✅** · QA automatico loop admin **✅** · QA visivo Matteo **⬜** (conferma browser)

---

## Sintesi (1 riga)

Rimosso il «bleed» dell’header che annullava il padding della colonna; header e card condividono `px-8 md:px-10`; eliminato loop React in Personalizza form (effect duplicato autosave + array `[]` instabile nelle promo).

---

## Dati comunicazione

| Campo | Valore |
|-------|--------|
| **Schermata (pubblico)** | **Pagina Prenota** — `/prenota/:slug`. Nome ristorante, titolo, descrizione sopra le card tipologia. |
| **Effetto atteso (pubblico)** | Titolo e form **stesso rientro** a sinistra/destra; più margine laterale rispetto al bleed precedente; footer Orari/Contatti **ancora a tutta larghezza**. |
| **Schermata (admin)** | **Impostazioni** → tab **Personalizza Form**. Editor titolo pagina, modalità, promo, sfondo Prenota. |
| **Effetto atteso (admin)** | Tab si apre **senza** schermo bianco né errore console «Maximum update depth exceeded». |
| **Componente** | `BookingRequestPage.tsx` (layout colonna); `BookingFormConfigPanel.tsx`; `BookingFormPromoSection.tsx` (sezione promo). |
| **Storage** | `restaurant_settings.booking_public_form_config` (titolo/descrizione/header_styles); `booking_menu_promos` (promo — sync locale da DB). Sfondo: `public_booking_page_background`, `public_booking_strip_photo` — **non modificati** in questa sessione. |

---

## 1. Bug header disallineato — ✅ fix + prova automatica

### Sintomo (Matteo)
Header pubblico più largo o spostato rispetto alle card del form sotto; sessione precedente dichiarava «sistemato» ma in app **no**.

### Causa root (confermata nel codice)
- Colonna contenuto: `px-14` / `px-8` (con striscia).
- Wrapper header: `-mx-14` / `-mx-8` (`headerBleed`) → **cancellava** il padding solo sull’header.
- Extra `px-2` su `h1` e sul blocco titolo/descrizione → ulteriore offset.

### Fix
| Prima | Dopo |
|-------|------|
| `BOOKING_PAGE_CONTENT_PAD_FULL = px-14 md:px-16` + `HEADER_BLEED -mx-*` | `px-8 md:px-10 lg:px-10` su **tutta** la colonna |
| Header con `headerBleed` | Header **dentro** la stessa colonna, senza `-mx` |
| `h1` / wrapper con `px-2` | Rimossi |

**Invariati (LOCK §0):** griglia striscia `20vw/25vw`, footer fuori griglia, sfondo `fixed inset-0` full-page, spacer sticky `h-20`.

### QA automatico — allineamento bordo sinistro `h1` vs `[data-testid="booking-mode-cards"]` (tolleranza 2px, staging `.env.local.test`)

| Viewport | h1.x | cards.x | Esito |
|----------|------|---------|-------|
| 375×812 | 32.0 | 32.0 | ✅ |
| 834×1194 | 40.0 | 40.0 | ✅ |
| 1280×800 | 40.0 | 40.0 | ✅ |

### QA Matteo ⬜

| Dove | Cosa fai | OK se… |
|------|----------|--------|
| Prenota, senza striscia | Desktop + mobile | Nome ristorante e card tipologia **allineati**; margini laterali visibili ma coerenti |
| Prenota, striscia ON | Idem | Stesso allineamento nella colonna destra (padding `px-8 md:px-10`) |
| Footer | Scroll in fondo | Barra bianca Orari/Contatti **da bordo a bordo** (non rientrata come il form) |

---

## 2. Loop «Maximum update depth» — Personalizza form — ✅ fix + prova automatica

### Sintomo
Possibile crash/loop aprendo **Impostazioni → Personalizza Form** (React: maximum update depth).

### Cause (due)

1. **`BookingFormConfigPanel.tsx`** — `useEffect(() => headerAutosave.cancelPending(), [tenantId, headerAutosave])`  
   - `headerAutosave` è un **oggetto nuovo** ogni render → effect ad ogni render → `cancelPending` → `setState` → loop.  
   - **Fix:** effect **rimosso**; `useDebouncedSettingsAutosave` già esegue `cancelPending` al cambio `tenantId` (righe 230–232 del hook).

2. **`BookingFormPromoSection.tsx`** — `const { data: savedPromos = [] }`  
   - Mentre la query è in loading, `[]` default è un **array nuovo** ogni render.  
   - `useEffect` sync `setPromos(savedPromos)` → re-render infinito.  
   - **Fix:** costante modulo `EMPTY_MENU_PROMOS` + `savedPromosRaw ?? EMPTY_MENU_PROMOS`.

### QA automatico (Playwright, login staging)

| Step | Errori «Maximum update depth» |
|------|-------------------------------|
| Dopo tab **Impostazioni** | 0 |
| Dopo click **Personalizza Form** | 0 (prima: 23+) |

### QA Matteo ⬜

| Dove | Cosa fai | OK se… |
|------|----------|--------|
| Admin → Impostazioni → Personalizza Form | Apri tab, attendi 3 s | Pagina stabile; console **senza** loop depth |
| Idem | Modifica titolo pagina (autosave dev) | Salva senza blocchi |

---

## 3. Validazione tecnica

```text
npm run validate  →  ✅ ESLint + tsc + 227 test Vitest
```

E2E smoke: `e2e/public-booking.spec.ts` «la pagina si apre correttamente» — ✅ (server locale 5173, reuse).

---

## 4. File toccati (diff logico)

| File | Modifica |
|------|----------|
| `src/pages/BookingRequestPage.tsx` | Padding unificato; rimossi bleed e `px-2` header |
| `src/features/booking/components/settings/BookingFormConfigPanel.tsx` | Rimosso `useEffect` duplicato su `headerAutosave` |
| `src/features/booking/components/settings/BookingFormPromoSection.tsx` | `EMPTY_MENU_PROMOS` stabile |

**Non toccati:** asset WebP, `RestaurantSettingsTab.tsx`, footer, `BookingPhotoStrip`, doc layout (opzionale aggiornare § padding in `BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` al commit).

---

## 5. Relazione con report precedente

| Report | Rapporto |
|--------|----------|
| [Report-prenota-sfondo-fixed-padding-31-05-26.md](./Report-prenota-sfondo-fixed-padding-31-05-26.md) | Stessa area padding/header; questa sessione **chiude** il KO header con fix bleed + QA misurato; sostituisce i tentativi `px-14`/`-mx` documentati lì |

---

## 6. Follow-up / debiti

| ID | Priorità | Nota |
|----|----------|------|
| — | — | Nessun FU nuovo; conferma visiva Matteo su Prenota (striscia ON/OFF) e Personalizza form |

---

## 7. Checklist chiusura sessione (agente)

- [x] Causa header documentata e fix in codice
- [x] Loop admin identificato (2 cause) e fix in codice
- [x] `npm run validate` verde
- [x] QA automatico 3 viewport header
- [x] QA automatico loop Personalizza form
- [ ] QA visivo Matteo ⬜
- [ ] Commit su richiesta Matteo
