# Report sessione — Fix bug orario prenotazioni (+2h)

Data: 2026-05-15  
Branch: `Sviluppo-Dashboard-laterale`

---

## Contesto

In questa sessione è stato analizzato, risolto e testato il bug per cui le prenotazioni — in particolare i walk-in — mostravano l'orario sbagliato (+2h in estate, +1h in inverno) in diverse parti dell'app.

---

## Causa radice

Il problema nasce da un'incompatibilità tra due modelli:

- `createBookingDateTime` salva l'orario con offset `+00:00` (es. `2026-05-15T20:15:00+00:00`), trattandolo come "cifre congelate".
- PostgreSQL `timestamptz` lo interpreta come istante UTC reale: 20:15 UTC = 22:15 in Italy CEST.
- Al ritorno dal DB, PostgREST può restituire la stringa con l'offset del server (`22:15+02:00`), oppure il browser costruisce un oggetto `Date` che vale 22:15 locali.
- Qualsiasi lettura delle cifre letterali dalla stringa (`extractTimeFromISO`) o formattazione tramite `Date` (`format(new Date(iso), 'HH:mm')`) produce l'orario sbagliato.

Il campo `desired_time` (tipo `TIME` di Postgres, senza conversioni di fuso) è l'ancora corretta: `getAccurateStartTime` lo preferisce sempre. Il problema emerge quando manca o non viene propagato.

---

## Fix 1 — Garanzia `desired_time` all'accettazione

**File**: `src/features/booking/hooks/useBookingMutations.ts`

`useAcceptBooking` ora scrive sempre `desired_time` nel DB. Se il chiamante non lo passa, lo deriva da `confirmedStart` con `extractTimeFromISO` — che funziona perché la stringa è ancora nella forma `+00:00` prima che PostgreSQL la tocchi.

Effetto: il ristoratore accetta una prenotazione → l'orario compare corretto in calendario, digest e Home.

---

## Fix 2 — Sezione "prossime 3 ore" in Home

**File**: `src/pages/AdminHomePage.tsx` + `src/features/booking/hooks/useHomeStats.ts`

La Home mostrava l'orario dei walk-in usando `format(b.start, 'HH:mm')` su un oggetto `Date` costruito da `confirmed_start`. In CEST il browser converte `20:15+00:00` in 22:15 locali → display +2h.

Fix:
- `useHomeStats` ora calcola `start_time: string` direttamente da `desired_time` (se presente) o da `extractTimeFromISO(confirmed_start)` — stessa fonte di verità usata dal resto dell'app.
- `AdminHomePage` mostra `b.start_time` direttamente, senza passare per `Date`.
- Rimosso anche il codice di diagnostica lasciato da un agente precedente (`fetch` verso `127.0.0.1:7934`).

Effetto: il ristoratore aggiunge un walk-in alle 20:15 → nella sezione "prossime 3 ore" compare 20:15, non 22:15.

---

## Test creato

**File**: `src/features/booking/utils/__tests__/CONTROLLA_ORARIO-PRENOTAZIONI.test.ts` (19 test, 4 sezioni)

- **A — Scrittura**: `createBookingDateTime` produce sempre `+00:00` con le cifre esatte.
- **B — Lettura**: `getAccurateStartTime` restituisce l'orario corretto in tutti i formati Postgres; `desired_time` vince sempre su `confirmed_start` anche con offset `+02:00`/`+01:00`.
- **C — Ciclo completo**: prenotazione pubblica, walk-in, accettazione admin — orario input = orario display.
- **D — Invarianti**: regole che non devono mai cambiare (offset, leggibilità, priorità `desired_time`).

Se questo test fallisce dopo una modifica a `dateUtils.ts` o alle mutations, c'è un bug di orario in corso.

---

## File skill aggiornati

- **`docs/ADMIN_CLASSIC_SKILL.md`**: aggiunta sezione §4b "Modello orario prenotazioni — REGOLA CRITICA". Snapshot §4 aggiornato con i fix di `useBookingMutations`, `useHomeStats`, `AdminHomePage`.
- **`docs/Testing-Skill/TESTING_CONTEXT.md`**: aggiunto `CONTROLLA_ORARIO-PRENOTAZIONI` alla mappa Vitest. Contatore 58 → 77.
- **`docs/APP_CONTEXT_SKILL.md`**: aggiunta riga per task su data/ora nella tabella §0. Aggiunta regola sub-task (la domanda "quale skill?" va riposta a ogni sotto-task, non solo all'inizio sessione). Aggiornato §7.2 con casi specifici per mutations che scrivono `confirmed_start`/`desired_time`.

---

## Risultato finale

```
npm run validate → 77 Vitest ✅  typecheck ✅  lint ✅
```

---

## Cosa resta aperto

Il fallback su `confirmed_start` quando `desired_time` è null (record molto vecchi pre-fix) è ancora vulnerabile se il DB restituisce offset non-zero. Per i record nuovi il problema è eliminato. Il test D documenta questa limitazione residua.
