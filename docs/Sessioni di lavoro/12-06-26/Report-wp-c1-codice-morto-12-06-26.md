# WP-C1 — Eliminare codice morto — 12-06-26

**Cosa è cambiato:** rimossi tre componenti booking/Menu QR mai collegati al resto dell'app; gli agenti non trovano più file fantasma che sembrano usati ma non lo sono.
**Cosa resta:** hook `useBookingRequests.ts` (ancora usato da Prenota); export orfani `useBookingRequests` / `useUpdateBookingStatus` nel file — fuori scope (vietato rifattorare mutations); `sendBookingCancelledEmail` vive in `useEmailNotifications.ts`, non in `email.ts`.
**Serve una tua azione:** no.

---

## Verifica import (rg su `src/`, `tests/`, dynamic import)

| Candidato | Import statici | Dynamic import | Esito |
|-----------|----------------|----------------|-------|
| `AcceptBookingModal.tsx` | **0** (solo commento in `AdminBookingForm.tsx`) | 0 | **Cancellato** |
| `BookingCrossShineSubmitButton.tsx` | **0** | 0 | **Cancellato** |
| `PublicMenuPageHeader.tsx` | **0** | 0 | **Cancellato** |
| `useBookingRequests.ts` (file) | **2** — `BookingRequestForm.tsx` (`useCreateBookingRequest`); mock in `BookingRequestForm.flussoUtente.test.tsx` | 0 | **Lasciato** |
| `useUpdateBookingStatus.ts` (file separato) | N/A — file **non esiste** | — | N/A |
| `useUpdateBookingStatus` (export in `useBookingRequests.ts`) | **0** | 0 | **Lasciato** (no refactor WP) |
| `useBookingRequests` (export hook lista) | **0** | 0 | **Lasciato** (stesso file, import file > 0) |
| `sendBookingCancelledEmail` in `src/lib/email.ts` | N/A — simbolo **assente** da `email.ts` | — | Niente da rimuovere |
| `sendBookingCancelledEmail` in `useEmailNotifications.ts` | **0** chiamanti (fuori lista WP) | 0 | Non toccato |

Comando usato per ogni simbolo/file: `rg` su pattern import/`from '…path…'` in `src/` e `tests/`; controllo aggiuntivo `import(` per dynamic import — nessun match sui tre componenti cancellati.

---

## Cancellato

- `src/features/booking/components/AcceptBookingModal.tsx`
- `src/features/booking/components/publicBooking/BookingCrossShineSubmitButton.tsx`
- `src/features/booking/components/PublicMenuPageHeader.tsx`

---

## Lasciato (con motivo)

- `src/features/booking/hooks/useBookingRequests.ts` — importato da form Prenota pubblico (`useCreateBookingRequest`).
- Export orfani nello stesso file — WP vieta rifattorizzare booking mutations in questo passo.
- `src/lib/email.ts` — intatto; `sendBookingCancelledEmail` non è in questo modulo.

---

## Test eseguiti

| Comando | Esito |
|---------|-------|
| `npm run validate` | ✅ verde — **557** test passed |

---

## File docs aggiornati

| File | Modifica |
|------|----------|
| `docs/MASTERPLAN_ALLINEAMENTO.md` | WP-C1 ⬜ → ✅ + link report |
| `docs/SESSION_LOG.md` | +1 riga |

**Skill area:** nessuna — solo delete codice non referenziato, nessun layout/comportamento descritto in skill toccato dal diff.

---

## Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: Prompt esecutivo WP-C1 (branch env/test, Profilo Esecuzione light): grep import su candidati masterplan; delete solo se import=0; lasciare useBookingRequests se import>0; sendBookingCancelledEmail solo se orfana in email.ts; validate verde; report + MASTERPLAN + SESSION_LOG; vietato refactor mutations.

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero?
✅ R2: Ri-verificato git status — 3 file D (AcceptBookingModal, BookingCrossShineSubmitButton, PublicMenuPageHeader); useBookingRequests.ts presente; rg import useCreateBookingRequest in BookingRequestForm; validate 557 passed.

❓ Q3 — File correlati allineati?
✅ R3: MASTERPLAN WP-C1 ✅, SESSION_LOG aggiornato. Nessuna skill area da allineare (delete orfani, zero cambio comportamento UI).

❓ Q4 — Cosa NON hai fatto?
✅ R4: Non rimosso useBookingRequests (2 import); non refactor export orfani useUpdateBookingStatus; non toccato sendBookingCancelledEmail in useEmailNotifications; commit/push fuori scope.

❓ Q5 — Attrito + miglioria?
✅ R5: Attrito nullo. Proposta: rimuovere commento stale «AcceptBookingModal» in AdminBookingForm in passaggio futuro light.

❓ Q6 — Contesto & hook?
✅ R6: MASTERPLAN WP-C1 + rg sufficienti; pre-commit ha richiesto questa sezione Q/R — normale.

Report pronto.
