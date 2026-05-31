# Report — ciclo #8 sfondo scroll · Prompt B + revert (31-05-26)

**Profilo:** Esecuzione (Prompt B deep → revert light)  
**Validate:** 227 test OK (ultimo run post-revert)  
**Commit:** non eseguito (salvo richiesta Matteo)

---

**Stato finale:** Prompt B **annullato in codice**. Homepage menu QR ripristinata con **sfondo che scorre col contenuto** (`repeat-y` sul wrapper scrollabile). **#8 QR non segnato OK** — il sintomo segnalato era su **Pagina Prenota**, non sul link QR.

**Cosa resta:** nuovo prompt su `BookingRequestPage.tsx` (tile legacy / scroll footer Prenota) — vedi [meta-analisi](./Report-meta-analisi-routing-prenota-vs-menu-qr-31-05-26.md) · **FU-028**.

**Serve una tua azione:** no su Menu QR (revert confermato); sì quando apri sessione fix **Pagina Prenota**.

---

## Cronologia sessione

| Fase | Cosa | Esito |
|------|------|-------|
| **Prompt B (deep)** | Layer `fixed inset-0 -z-10` su `PublicMenuPage` per evitare salto sfondo al footer QR | Codice + Playwright OK; QA Matteo segnato OK poi **revocato** |
| **Meta-analisi** | Matteo: fix su schermata sbagliata — sintomo reale su Pagina Prenota | [Report meta-analisi](./Report-meta-analisi-routing-prenota-vs-menu-qr-31-05-26.md) |
| **Revert (light)** | Ripristino sfondo scrollabile su Menu QR (preferenza Matteo) | ✅ codice + docs + validate 227 OK |

---

## Obiettivo originale (Prompt B — non più valido per QR)

Checklist ciclo #8 / FU-021 §1 — homepage menu QR: scroll footer senza salto sfondo. Smoke: `/menu/test-pro/qr/x7zuud5`.

**Esito:** obiettivo **ritirato** per Menu QR — misrouting confermato da Matteo.

---

## Prompt B — cosa era stato fatto (poi revertato)

| Prima (pre-Prompt B) | Dopo Prompt B (revertato il 31-05-26) |
|----------------------|----------------------------------------|
| PNG tema sul **div che scrolla** (`min-h-svh` + `repeat-y`) | PNG su **layer fisso** `fixed inset-0 -z-10` |
| Sfondo si muoveva col documento | Sfondo ancorato al viewport |

Implementazione temporanea: `useMenuPageBackgroundStyle` invariato; nuovo div fixed; FU-025 intatto (`max-w-[1024px]`).

Playwright 375/834/1280: layer fisso stabile. **Matteo:** nessun problema percepito su Menu QR prima del fix — il layer fixed non risolveva un bug reale su quella schermata.

---

## Revert 31-05-26 — stato codice attuale

**File:** `src/pages/PublicMenuPage.tsx` → `MenuContent`

| Elemento | Stato attuale |
|----------|---------------|
| Wrapper esterno | `flex min-h-svh flex-col` + **`style={pageBgStyle}`** (scrolla col contenuto) |
| Layer fixed | **Rimosso** |
| Wrapper interno FU-025 | `mx-auto max-w-[1024px] flex-1 flex-col` — **invariato** |
| Commenti | `repeat-y` sul wrapper scrollabile |

**Helper** `useMenuPageBackgroundStyle`: stessi valori CSS (`bodyImage`, `100% auto`, `repeat-y`, `bodyFallbackBg`).

**Non toccato:** `BookingRequestPage.tsx`.

---

## Dati comunicazione

### Menu QR (schermata interessata dal revert)

| | |
|--|--|
| **Schermata** | **Homepage menu QR** — pagina dal QR sul tavolo (`/menu/{slug}/qr/{codice}`): nome, carosello, categorie, footer data/ora. |
| **Dopo revert** | Comportamento **come prima del Prompt B**: lo **sfondo tema scorre insieme** a titolo, card e footer (PNG `repeat-y` sul container pagina). |
| **Perché revert** | Il salto sfondo segnalato in checklist #8 era su **Pagina Prenota**, non qui. Matteo preferisce sfondo scrollabile su Menu QR. |
| **Componente** | `PublicMenuPage` → `MenuContent` + `useMenuPageBackgroundStyle` |
| **Storage** | `menu_qr_codes.theme_key`; PNG in `public/menu-themes/{tema}-body.png` — nessuna modifica DB. |

### Pagina Prenota (dove andrà il fix vero)

| | |
|--|--|
| **Schermata** | **Pagina Prenota** — form pubblico `/prenota/...` |
| **Componente** | `BookingRequestPage.tsx` |
| **Storage** | `restaurant_settings.public_booking_page_background` (gradiente, tile legacy, foto full-page, striscia) |
| **Prossimo lavoro** | Tile legacy con `repeat-y` sul root scrollabile — stesso pattern che Prompt B aveva “fixato” per errore su QR |

Dettaglio: [meta-analisi](./Report-meta-analisi-routing-prenota-vs-menu-qr-31-05-26.md).

---

## Test eseguiti

| Test | Quando | Esito |
|------|--------|-------|
| `npm run validate` | Post Prompt B | ✅ 227/227 |
| Playwright scroll 375/834/1280 (layer fixed) | Post Prompt B | ✅ |
| `npm run validate` | Post revert | ✅ 227/227 |

**QA Matteo #8 (Menu QR):** **ANNULLATO** — non applicabile; checklist #8 ciclo Menu QR resta **aperta** lato Prenota / da riclassificare.

---

## File toccati (intera sessione)

| File | Modifica |
|------|----------|
| `src/pages/PublicMenuPage.tsx` | Prompt B layer fixed → **revert** sfondo scrollabile |
| `docs/per-ui-design-skill/PUBLIC_MENU_LAYOUT_CONTEXT.md` | Diagramma fixed → **ripristinato** shell scrollabile |
| `docs/FOLLOW_UP.md` | Nota FU-021 (sessione Prompt B) |
| `docs/SESSION_LOG.md` | Voci Prompt B + revert |
| `docs/Sessioni di lavoro/30-05-26/Report-prepara-prompt-ciclo-menu-qr-fix-30-05-26.md` | Handoff #8 |
| `docs/Sessioni di lavoro/31-05-26/Report-meta-analisi-routing-prenota-vs-menu-qr-31-05-26.md` | Meta-analisi misrouting |

---

## FU-021 — nota punto (1)

- Prompt B su Menu QR: **revertito** — nessun fix #8 chiuso su homepage QR.
- Checklist 5 temi mobile homepage: resta valida per QA generale temi, **non** per chiudere #8 scroll footer QR.
- Fix scroll footer atteso su **Pagina Prenota** → **FU-028** (vedi meta-analisi).

---

## Deviazioni dal plan

| Deviazione | Motivo |
|------------|--------|
| Fix applicato su schermata errata (Prompt B) | Handoff ciclo #8 puntava a Menu QR; sintomo reale su Prenota |
| Revert completo su QR | Preferenza Matteo + meta-analisi confermata |
| `BookingRequestPage` non toccato | Fuori scope revert; prossima sessione dedicata |
