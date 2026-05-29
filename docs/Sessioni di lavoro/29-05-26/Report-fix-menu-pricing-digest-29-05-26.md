# Report — Fix prezzo menù digest admin/calendario (29-05-26)

## Tipo sessione

| Campo | Valore |
|-------|--------|
| **Profilo** | Esecuzione |
| **Modalità** | standard |
| **Scope** | INC-01, INC-07, INC-02 — `menuPricing.ts` + test + doc |
| **Fuori scope** | ArchiveTab, DetailsTab, Pagina Prenota, edge submit, layout BookingRequestCard |

---

## Problema e fix

**Prima:** in Admin → Prenotazioni → Richieste in attesa, la card chiusa (digest) mostrava un prezzo menù **sbagliato** (€0 o somma ingredienti), mentre aprendo la card il prezzo era **corretto** (quello salvato in database al momento della prenotazione).

**Causa:** la funzione `getResolvedMenuPriceDisplay` in `menuPricing.ts` preferiva la somma delle righe in `menu_selection.items` anche quando in DB c’erano già `menu_total_per_person` e `menu_total_booking` dal submit.

**Policy applicata (decisione prodotto):** se `menu_total_per_person > 0` → **sempre** usare i totali DB (`fromDb`) per digest, calendario ed espanso. Overlay da somma righe **solo** se i totali DB mancano e la somma items > 0 (legacy).

---

## Modifiche codice

| File | Modifica |
|------|----------|
| `src/features/booking/utils/menuPricing.ts` | `getResolvedMenuPriceDisplay`: early return `fromDb` se valido; overlay solo senza DB |
| `src/features/booking/utils/__tests__/menuPricing.test.ts` | **Nuovo** — 5 test (INC-01, INC-07, fallback, tavolo, formatEuro) |

**Non toccati:** `BookingRequestCard.tsx` (layout LOCK), `ArchiveTab`, `DetailsTab`, submit/edge.

---

## Bug risolti

| ID | Prima | Dopo (QA admin test-pro) |
|----|-------|--------------------------|
| **INC-01** | Digest €0.00/persona, espanso €8.00 | Digest **€8.00/persona** (`8e2d7cf6…`) |
| **INC-07** | Digest €2'425.00/persona, espanso €13.98 | Digest **€13.98/persona** (`6fcf30fe…`) |
| **INC-02** | Calendario stesso helper errato | Stesso fix → parità con digest card |

---

## Verifica automatica

```
npm run validate → OK
  eslint + tsc + Vitest 222 test (inclusi 5 menuPricing.test.ts)
```

---

## QA manuale post-fix (TEST test-pro)

| ID | Caso | Esito | Nota |
|----|------|-------|------|
| M1 | Pending `8e2d7cf6…` digest | **OK** | «Menù : €8.00/persona» |
| M2 | Pending `6fcf30fe…` digest | **OK** | «Menù : €13.98/persona» (non €2'425) |
| M3 | Espanso card 8e2d7cf6 | **OK** | Invariato €8 / €168 |
| M4 | Viewport | **1280** | Spot-check lista pending |

Ambiente: `docnnernvp`, tenant test-pro, admin già loggato in dev locale.

---

## Documentazione aggiornata

| File | Modifica |
|------|----------|
| `docs/per-ui-design-skill/BOOKING_REQUEST_CARD_CONTEXT.md` | §3 invariante «DB vince» + link report |
| `docs/_lavoro/Per matteo/GUIDA_USO_QUERIES_CONTROVERIFICA.md` | §1 colonne menù/promo/source; §5 chiavi promo/vetrina |
| `docs/FOLLOW_UP.md` | **FU-015** e **FU-016** → Fatto |
| `docs/SESSION_LOG.md` | +1 riga |

---

## Dati comunicazione (per Matteo)

| Dove nell’app | Cosa vede il ristoratore | Componente | Storage |
|---------------|---------------------------|------------|---------|
| **Admin → Prenotazioni → Richieste in attesa** | Card chiusa: ora il prezzo menù nel riepilogo **coincide** con quello che vede aprendo la card (es. €8/persona, non più €0) | **`BookingRequestCard`** digest usa `getResolvedMenuPriceDisplay` | Lettura **`booking_requests.menu_total_per_person`**, **`menu_total_booking`** (salvati al submit da Pagina Prenota) |
| **Admin → Calendario** | Riga digest giorno: stesso prezzo menù corretto | **`DigestBookingListRow`** | Stessa tabella **`booking_requests`** |
| **Card espansa** | Invariata — già leggeva il DB | pannello espanso **`BookingRequestCard`** | Stesse colonne |
| **Archivio / modal calendario** | **Invariato** — ancora senza blocco prezzo menù (debiti INC-03/04, FU-001) | `ArchiveBookingCard`, `DetailsTab` | — |

In pratica: quando il cliente prenota, il form salva i totali in **`booking_requests`**. Ora digest e calendario **rispettano quel snapshot**, invece di ricalcolare (male) dalla lista ingredienti.

---

## Debiti restanti (fuori scope)

| ID | Nota |
|----|------|
| INC-03 | Archivio senza prezzo/promo menù |
| INC-04 / FU-001 | Modal dettaglio calendario senza prezzo menù |

---

## Chiusura APP_CONTEXT §7

| § | Azione |
|---|--------|
| **7.1 Report** | Questo file |
| **7.2 Skill/context** | `BOOKING_REQUEST_CARD_CONTEXT.md` §3 aggiornato; nessuna nuova RULE in ADMIN_CLASSIC (fix isolato in helper) |
| **Follow-up** | FU-015, FU-016 chiusi |

---

## Criteri di fatto

| Criterio | Stato |
|----------|--------|
| `npm run validate` verde | ✅ |
| Digest `8e2d7cf6…` €8.00/persona | ✅ |
| Digest `6fcf30fe…` €13.98/persona | ✅ |
| Context + GUIDA aggiornati | ✅ |
| Report sessione | ✅ |
