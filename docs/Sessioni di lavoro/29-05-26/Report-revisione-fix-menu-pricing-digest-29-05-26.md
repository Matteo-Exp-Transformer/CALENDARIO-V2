# Report revisione — Fix prezzo menù digest (INC-01 / INC-07)

## Tipo sessione

| Campo | Valore |
|-------|--------|
| **Profilo** | Verifica (revisore) |
| **Modalità** | standard |
| **Oggetto** | Revisione fix `menuPricing.ts` + doc FU-015/FU-016 |
| **Report esecutore** | [Report-fix-menu-pricing-digest-29-05-26.md](Report-fix-menu-pricing-digest-29-05-26.md) |
| **Baseline mappa** | [Report-mappatura-booking-request-card-29-05-26.md](Report-mappatura-booking-request-card-29-05-26.md) |
| **Run revisione** | 2ª passata — 29-05-26 (dev server attivo, QA browser completato) |

---

## Verdetto

**Approva**

Fix codice, test automatici, documentazione e QA browser su admin **test-pro** confermano allineamento digest ↔ espanso per i casi campione INC-01 e INC-07.

---

## Checklist revisione

| # | Voce | Esito | Evidenza |
|---|------|-------|----------|
| 1 | `npm run validate` OK | **OK** | 222 test verdi (eslint + tsc + vitest) |
| 2 | Test INC-01 e INC-07 Vitest | **OK** | `menuPricing.test.ts` L30-71; `-t "INC-01\|INC-07"` pass |
| 3 | Pending `8e2d7cf6…` digest €8.00 = espanso | **OK** | Browser `http://localhost:5176/admin` — digest «Menù : €8.00/persona» = espanso «PREZZO MENÙ: €8.00/persona», totale €168.00 |
| 4 | Pending `6fcf30fe…` digest €13.98 = espanso | **OK** | Digest «Menù : €13.98/persona» = espanso «PREZZO MENÙ: €13.98/persona», totale €153.78 (non €2'425) |
| 5 | Calendario stesso helper digest | **OK (codice)** | `DigestBookingListRow` → `getResolvedMenuPriceDisplay`; stessa policy post-fix. Digest lista giorno non spot-checkato in browser (pending non compaiono in «Prenotazioni con menu» finché non accettate) |
| 6 | `BOOKING_REQUEST_CARD_CONTEXT` §3 | **OK** | «DB vince» + link report fix |
| 7 | GUIDA §1 e §5 | **OK** | Colonne menù/promo/source; `booking_menu_promos` + vetrina; solo nota obsoleto su `booking_vol_au_vent_*` |
| 8 | FU-015 / FU-016 | **Fatto** | `docs/FOLLOW_UP.md` |

---

## QA browser (revisore — test-pro, 1280px)

Ambiente: `docnnernvp`, login `test-pro@p.com`, dev `http://localhost:5176/admin`.

| ID | Caso | Digest | Espanso | Esito |
|----|------|--------|---------|-------|
| M1 | `8e2d7cf6…` asdasdassadasdas | €8.00/persona | €8.00/persona · €168.00 tot | **OK** |
| M2 | `6fcf30fe…` aasdasdas | €13.98/persona | €13.98/persona · €153.78 tot | **OK** |
| M3 | Coerenza visiva card 1 | Screenshot revisore | — | **OK** |
| M4 | Calendario digest riga prezzo | Non testato su pending (solo accepted in lista giorno) | — | **N/A** — INC-02 coperto da stesso helper |

---

## Codice revisionato

Policy in `getResolvedMenuPriceDisplay` (`menuPricing.ts` L72-74):

```typescript
if (fromDb) {
  return fromDb
}
```

Overlay somma `menu_selection.items` solo se totali DB assenti (legacy).

---

## Documentazione

| File | Stato |
|------|--------|
| `BOOKING_REQUEST_CARD_CONTEXT.md` §3 | Aggiornato, coerente |
| `GUIDA_USO_QUERIES_CONTROVERIFICA.md` §1/§5 | Aggiornato |
| `FOLLOW_UP.md` FU-015, FU-016 | Chiusi |
| `SESSION_LOG.md` | Riga fix + revisione |

---

## Debiti restanti (fuori scope fix)

| ID | Nota |
|----|------|
| INC-03 | Archivio senza prezzo menù |
| INC-04 / FU-001 | Modal dettaglio calendario senza prezzo menù |

---

## Derivazione errori

| Aspetto | Classificazione |
|---------|-----------------|
| Bug INC-01/07 | **bug preesistente** — risolto |
| Fix revisore | **corretto** — nessuna regressione osservata |

---

## File toccati in revisione

| File | Modifica |
|------|----------|
| `docs/Sessioni di lavoro/29-05-26/Report-revisione-fix-menu-pricing-digest-29-05-26.md` | Aggiornato — verdetto **Approva**, QA browser M1/M2 |
| `docs/SESSION_LOG.md` | Riga revisione aggiornata |
| `src/` | Nessuna modifica |

---

## Sintesi per Matteo

In **Admin → Prenotazioni → Richieste in attesa**, le due pending di test mostrano ora lo **stesso prezzo menù** nella card chiusa e nel pannello aperto (€8 e €13.98/persona). Il fix in **`menuPricing.ts`** fa sì che digest e calendario rispettino i totali salvati in **`booking_requests`** al momento della prenotazione del cliente.
