# Report — Fix bug orario prenotazioni (+2h) e contratto test

Data: 2026-05-14  
Branch: `Sviluppo-Dashboard-laterale`

---

## Problema di partenza

Alcune prenotazioni mostravano l'orario sbagliato nell'app: ad esempio una prenotazione inserita alle 20:15 compariva alle 22:15 nel calendario e nel digest. L'errore cresceva in base al fuso orario (in estate +2h, in inverno +1h).

---

## Analisi della causa

Il problema veniva da come i due "mondi" si parlavano in modo incompatibile:

- `createBookingDateTime` salva l'orario come stringa ISO con offset `+00:00` (es. `20:15+00:00`), pensando di "congelare" le cifre.
- PostgreSQL `timestamptz` non è "testo": interpreta `20:15+00:00` come le 20:15 UTC reali, cioè le 22:15 in Italia in estate.
- Quando il dato torna dal DB, PostgREST può restituire la stringa con l'offset del server (es. `22:15+02:00`).
- `extractTimeFromISO` legge le cifre letterali dalla stringa → legge `22:15` invece di `20:15`.

Il campo `desired_time` (tipo `TIME` di Postgres, nessuna conversione di fuso) era la difesa naturale: `getAccurateStartTime` lo preferisce sempre. Ma se mancava dal record, il display usava il fallback su `confirmed_start` e mostrava l'orario sbagliato.

---

## Fix applicato

**File: `src/features/booking/hooks/useBookingMutations.ts`**

In `useAcceptBooking`, `desired_time` è ora **sempre scritto** nel DB al momento dell'accettazione di una prenotazione. Se il chiamante non lo passa esplicitamente, viene derivato da `confirmedStart` con `extractTimeFromISO` — che funziona perché in quel momento la stringa è ancora nella nostra forma `+00:00`, prima che PostgreSQL la tocchi.

Prima: `desired_time` veniva scritto solo se il chiamante passava `desiredTime` esplicitamente. Per prenotazioni vecchie o edge case, poteva restare `null`.

Dopo: nessun record accettato può avere `desired_time = null` — il motore dell'accettazione lo garantisce sempre.

---

## Test di non-regressione creato

**File: `src/features/booking/utils/__tests__/CONTROLLA_ORARIO-PRENOTAZIONI.test.ts`**

19 test in 4 sezioni:

- **A — Scrittura**: verifica che `createBookingDateTime` produca sempre `+00:00` con le cifre esatte, per orari di pranzo, sera, mezzanotte, attraversamento mezzanotte, fine mese.
- **B — Lettura**: verifica che `getAccurateStartTime` restituisca l'orario corretto da `desired_time` in tutti i formati Postgres (`HH:mm`, `HH:mm:ss`), e che `desired_time` vinca sempre anche quando `confirmed_start` arriva con offset `+02:00` (CEST) o `+01:00` (CET).
- **C — Ciclo completo**: tre scenari end-to-end (prenotazione pubblica, walk-in, accettazione admin) che verificano che l'orario inserito dall'utente esca identico dal display.
- **D — Invarianti**: regole che non devono mai cambiare — `+00:00` su tutti gli orari, leggibilità per ogni ora del giorno, e che `desired_time` vinca su qualunque offset di `confirmed_start`.

---

## File skill aggiornati

- **`docs/ADMIN_CLASSIC_SKILL.md`**: aggiunta sezione §4b "Modello orario prenotazioni — REGOLA CRITICA" con spiegazione del problema, soluzione adottata, tabella funzioni, regole operative. Aggiornato snapshot §4 con nota sul fix `useBookingMutations`.
- **`docs/Testing-Skill/TESTING_CONTEXT.md`**: aggiunto `CONTROLLA_ORARIO-PRENOTAZIONI` alla mappa test Vitest. Contatore aggiornato 58 → 77. Nota sul ruolo di test di non-regressione.

---

## Test finali

```
npm run validate → 77 Vitest ✅ + typecheck ✅ + lint ✅
```

---

## Cosa resta

Il fallback su `confirmed_start` (quando `desired_time` è null — prenotazioni molto vecchie pre-fix) è ancora vulnerabile se il DB restituisce offset non-zero. Il test "D — Invarianti" documenta questa limitazione. La soluzione architetturale completa (Direzione A del report tecnico originale) richiederebbe di cambiare anche come si leggono i record storici, ma per i record nuovi il problema è eliminato.
