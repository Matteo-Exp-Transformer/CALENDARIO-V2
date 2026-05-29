# Report revisione — Mappatura BookingRequestCard (29-05-26)

## Tipo sessione

| Campo | Valore |
|-------|--------|
| **Profilo** | Verifica (controverifica mappa fase 1, nessun fix codice) |
| **Modalità** | deep |
| **Input** | [Report mappatura](Report-mappatura-booking-request-card-29-05-26.md), [BOOKING_REQUEST_CARD_CONTEXT.md](../../per-ui-design-skill/BOOKING_REQUEST_CARD_CONTEXT.md), TESTING_SKILL §7 |
| **Ambiente** | TEST `docnnernvp` · tenant **test-pro** (`2deb4d6e-ff8c-462a-92da-5a6d731a9dee`) · `npm run dev` · login `test-pro@p.com` |

---

## Verdetto globale

### **Approva con riserve**

La mappa fase 1 è **sostanzialmente corretta** su flusso, colonne DB, root cause INC-01 e debiti INC-03…06. Si può passare alla fase 3 (fix `menuPricing`) con le riserve sotto.

| Riserva | Dettaglio |
|---------|-----------|
| **Scenario A nuovo submit** | Tentativo revisore (`RevTest-A-290526`) su `/prenota/test-pro` **non** ha creato riga in DB (submit bloccato in automazione browser; evidenza INC-01 da **campione esistente** `8e2d7cf6…`). |
| **Sidebar Prenota** | Su config attuale test-pro il riepilogo laterale (1280px) **non** mostra righe «Prezzo menù / totale» — solo card «222,00€ a persona» nel form; confronto prezzi admin basato su DB + card espansa. |
| **INC-07** | Caso opposto a INC-01 già accennato in mappa — **confermato** su pending `6fcf30fe…`; includere nel fix fase 3. |

---

## Query SQL (MCP `user-supabase-test`)

| # | Query | Esito |
|---|--------|-------|
| Q1 | `organizations` slug/id | **OK** — `test-pro` = `2deb4d6e-ff8c-462a-92da-5a6d731a9dee` |
| Settings | `booking_menu_promos`, `booking_public_form_config`, `public_booking_strip_photo`, `public_booking_page_background`, `booking_custom_staff_presets` su test-pro | **OK** (5 chiavi presenti) |
| Campione | `8e2d7cf6-c57a-486d-b5e6-d8552b771f55` | **OK** — ancora `pending`; `menu_total_per_person=8`, `menu_total_booking=168`, `menu_selection.items=[]`, `menu_promo_labels=["dsfsdfsdf"]`, `booking_source=public`, `source=public_form` |
| Ultime 5 test-pro | SELECT esteso report | **OK** — allineato a mappa |

---

## Campione regressione `8e2d7cf6-c57a-486d-b5e6-d8552b771f55`

| Controllo | Esito |
|-----------|--------|
| Ancora pending su test-pro | **Sì** |
| Admin → Richieste in attesa → card `asdasdassadasdas` | **Digest:** riga «Menù :» **senza** importo corretto (equivalente **€0.00/persona** da `getResolvedMenuPriceDisplay`). **Espanso:** «Prezzo Menù: €8.00/persona», «Prezzo Totale: €168.00». |
| Promo digest/espanso | «dsfsdfsdf» — coerente con DB |
| Root cause codice | Confermata: `menuPricing.ts` L71-87 — `if (fromDb) return overlay` con `baseTotal === 0` e `items: []` |

---

## Scenario A — Menù a prezzo fisso (INC-01)

**Metodo:** regressione campione `8e2d7cf6…` (submit manuale Matteo, stesso pattern menù fisso card + `items` vuoti) + tentativo nuovo submit revisore.

**Config tentativo revisore:** Rinfresco di Laurea → card «Opzione menu sa» **222,00€ a persona**, 10 ospiti, privacy accettata — submit **non** persistito.

### Tabella confronto (campione `8e2d7cf6…`)

| Campo | Sidebar Prenota (atteso) | Digest card | Espanso card | DB (SQL) | OK? |
|-------|--------------------------|-------------|--------------|----------|-----|
| Prezzo / persona | €8,00 (da card/prezzo fisso salvato) | **€0.00/persona** (overlay somma righe) | **€8.00/persona** | `menu_total_per_person` = **8** | **NO** |
| Totale prenotazione | €168,00 (8 × 21 ospiti) | (non mostrato in digest) | **€168.00** | `menu_total_booking` = **168** | **NO** (digest) |
| Promo | label vista in form | «dsfsdfsdf» | «dsfsdfsdf» | `["dsfsdfsdf"]` | **Sì** |
| `menu_selection.items` | `[]` al submit | — | lista vuota / nessun prodotto | `{"items":[]}` | **Sì** (DB) |
| Nome / ospiti / data | — | coerente | coerente | `asdasdassadasdas`, 21, 29/05 | **Sì** |

---

## Scenario B — Menù personalizzabile (caso secondario)

**Metodo:** pending esistente `6fcf30fe-d4f6-4649-a4e3-8207a46f1b15` (`aasdasdas`, `rinfresco_laurea`).

### Tabella confronto

| Campo | Sidebar Prenota (atteso) | Digest card | Espanso card | DB (SQL) | OK? |
|-------|--------------------------|-------------|--------------|----------|-----|
| Prezzo / persona | ~€13,98 (totale salvato da form) | **€2'425.00/persona** (somma righe: 16+18+22+23+23+2323) | **€13.98/persona** | `menu_total_per_person` = **13.98** | **NO** |
| Totale | €153,78 | — | **€153.78** | `menu_total_booking` = **153.78** | **NO** (digest) |
| Prodotti | 6 righe composte | — | lista 6 prodotti con prezzi riga | `menu_selection.items` (6 elementi) | **Sì** (espanso/DB) |
| Preset | — | — | «Caraffe e un gustoso aperitivo rustico!» | `preset_menu` valorizzato | **Sì** |

**Nota:** stesso meccanismo di INC-01, effetto **invertito** quando la somma `items` >> `menu_total_per_person` → **INC-07**.

---

## Giudizio incoerenze

| ID | Esito revisore | Evidenza |
|----|----------------|----------|
| **INC-01** | **Confermato** | UI admin campione `8e2d7cf6…` + SQL + `menuPricing.ts` L87 |
| **INC-02** | **Confermato** | `DigestBookingListRow` usa `getResolvedMenuPriceDisplay` (`BookingCalendar.tsx` L139); stessa logica del digest card |
| **INC-03** | **Debito product** (accettabile short-term) | `ArchiveBookingCard` in `ArchiveTab.tsx`: nessun import `menuPricing` / `menu_promo` — card «Cazzone» accettata senza prezzo/promo menù in digest/espanso |
| **INC-04** | **Confermato** | `DetailsTab.tsx`: solo `InfoRow` promo (L135-136); nessun blocco prezzo menù/prodotti |
| **INC-05** | **Confermato** | `GUIDA_USO_QUERIES_CONTROVERIFICA.md` §1 SELECT senza `menu_selection`, `menu_promo_labels`, `source`; §5 ancora `booking_vol_au_vent_promo_*` |
| **INC-06** | **Confermato** (informativo) | Campione: `booking_source=public`, `source=public_form` |
| **INC-07** | **Nuovo — Confermato** | Pending `6fcf30fe…`: digest €2'425 vs DB €13,98; già ipotizzato per `41d4b70c…` in mappa |

---

## Superfici aggiuntive (spot-check)

| Superficie | Esito |
|------------|--------|
| **ArchiveTab** | Digest accettata/rifiutata: nome, data, ospiti, telefono, email, note — **mancano** promo menù, prezzo menù, prodotti (coerente INC-03) |
| **Viewport 375px** (admin, Archivio) | Digest leggibile: telefono/email/note visibili nel nome accessibile pulsante card; **nessun** prezzo menù in digest (comportamento atteso o assenza campo) |
| **Calendario digest** | Non ispezionata cella giorno singola; **confermato da codice** parità helper con INC-02 |

### QA manuale responsive (TESTING_SKILL §7)

| ID | Caso | mobile 375 | tablet 834 | desktop 1280 |
|----|------|------------|------------|----------------|
| R1 | Digest pending INC-01 leggibile | OK (testo troncato ma promo/tel visibili) | Non ripetuto | OK (card espansa €8 vs digest €0) |
| R2 | Archivio senza prezzo menù | OK spot | — | — |
| P1 | Submit nuovo scenario A end-to-end | **Non completato** (DB vuoto su `RevTest%`) | — | Form compilato, sidebar senza righe € |

---

## Dati comunicazione (per Matteo)

| Dove nell’app | Cosa vede il ristoratore | Componente | Storage |
|---------------|---------------------------|------------|---------|
| **Pagina Prenota** `/prenota/test-pro` | Sceglie tipologia/card; prezzo sulla **card** (es. 222€/persona); riepilogo laterale oggi mostra soprattutto data/ora/ospiti | `BookingRequestForm`, `BookingSummarySidebar` | Submit → **`booking_requests`**; vetrina in **`restaurant_settings.booking_public_form_config`**; promo in **`booking_menu_promos`** |
| **Admin → Prenotazioni → Richieste in attesa** | Card chiusa: digest con **prezzo menù sbagliato** se `items` vuoti o somma ≠ DB; aperta: prezzo **corretto** da colonne DB | **`BookingRequestCard`** in `PendingRequestsTab` | Lettura **`booking_requests`**; promo da **`menu_promo_labels`** + fallback settings |
| **Admin → Calendario** | Riga giorno: stesso rischio digest del prezzo menù | **`DigestBookingListRow`** | Stessa riga **`booking_requests`** |
| **Admin → Archivio** | Storico senza prezzo/promo menù in card | **`ArchiveBookingCard`** in `ArchiveTab` | Stessa tabella, status accettata/rifiutata |
| **Modal da calendario** | Promo sì; **no** prezzo menù | **`DetailsTab`** | **FU-001** |

---

## Derivazione errori (revisione)

| Problema | Causa (confermata) | Classificazione |
|----------|-------------------|-----------------|
| Digest €0 con DB €8 | `getResolvedMenuPriceDisplay` preferisce overlay a somma 0 | Bug preesistente — **non** submit/DB |
| Digest €2425 con DB €13,98 | Stesso helper con somma righe > 0 | Bug preesistente (INC-07) |
| GUIDA SQL fuorviante | Doc non aggiornata post-promo v2 | **FU-015** — non chiudere in revisione |

---

## Raccomandazioni fase 3 (solo indicazioni, no codice)

1. **`src/features/booking/utils/menuPricing.ts`** — in `getResolvedMenuPriceDisplay`:
   - se `baseTotal === 0` e `fromDb` valido → usare `fromDb`;
   - se `baseTotal > 0` e `fromDb` valido → policy esplicita (preferire DB per menù fisso card, overlay solo per composizione pura) — decidere con Matteo per INC-07.
2. **Test Vitest** nuovo file es. `menuPricing.test.ts`:
   - caso INC-01: `menu_total_per_person=8`, `items=[]`, `rinfresco_laurea` → digest helper = €8;
   - caso INC-07: `menu_total_per_person=18`, items con somma alta → digest = €18 (o policy scelta).
3. **Regression UI:** campione `8e2d7cf6…` dopo fix — digest deve mostrare €8.00/persona.
4. **Product:** Archive + DetailsTab — allineare a pending o lasciare debito (FU-001 / nota in report fix).
5. **FU-015:** aggiornare GUIDA con SELECT del report mappa § «Query aggiornate».

---

## Prompt fix — input per esecutore

```
Profilo: Esecuzione. Modalità: standard/deep.

Obiettivo: fix display prezzo menù digest/calendario (INC-01 + INC-07).

INC confermate:
- INC-01: items=[] + menu_total_per_person>0 → digest €0 (espanso OK)
- INC-07: items con somma >> menu_total_per_person → digest usa somma (espanso OK)
- INC-02: parità DigestBookingListRow (stesso fix menuPricing)

Prenotazioni test su TEST test-pro:
- 8e2d7cf6-c57a-486d-b5e6-d8552b771f55 (pending, €8, items [])
- 6fcf30fe-d4f6-4649-a4e3-8207a46f1b15 (pending, €13.98 vs somma €2425)
- 41d4b70c-f522-4968-9058-12f6cf6e32d4 (accepted, caso estremo menu_prezzo_fisso)

Fix minimo:
- menuPricing.ts getResolvedMenuPriceDisplay
- test unitari menuPricing
- npm run validate

Fuori scope sessione: Archive/DetailsTab (decisione product), GUIDA (FU-015 doc), email prenotazione.

Input: Report-revisione-mappatura-booking-request-card-29-05-26.md + BOOKING_REQUEST_CARD_CONTEXT.md
```

---

## Criteri di fatto (revisione)

| Criterio | Stato |
|----------|--------|
| INC-01 confermato/smentito con evidenza | **Confermato** (UI + SQL + codice) |
| ≥1 submit manuale scenario A documentato | **Parziale** — campione Matteo + tentativo revisore non in DB |
| Scenario B documentato | **Sì** (`6fcf30fe…`) |
| Nessuna modifica `src/` | **Sì** |
| Report revisione + SESSION_LOG | **Sì** |

---

## File toccati (solo docs)

| File | Azione |
|------|--------|
| `docs/Sessioni di lavoro/29-05-26/Report-revisione-mappatura-booking-request-card-29-05-26.md` | Creato |
| `docs/SESSION_LOG.md` | +1 riga |
| `docs/FOLLOW_UP.md` | Nota su INC-07 in FU-016 (testo) |
