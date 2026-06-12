# Report — Fix guard fantasma post-modale Calendario admin

> Profilo Esecuzione · modalità **standard** · branch `env/test` · Edition Pro · 12-06-26.

---

## 1. Cappello

- **Effetto per il ristoratore:** dopo aver chiuso la modale prenotazione sul **Calendario** (dettaglio o Nuova prenotazione), cambiare tab (Prenotazioni, Archivio, Menu, Impostazioni) o voce sidebar Pro (Home, Servizio, CRM, …) **non** riapre più il dialog «Modifiche non salvate» se non ci sono davvero bozze aperte altrove. Con dirty reale in **Impostazioni** il guard resta attivo (M1).
- **Cosa resta:** niente.
- **Serve azione Matteo:** **no** — smoke Pro fatto da Matteo (12-06-26).

---

## 2. Cosa è stato fatto

### Diagnosi (prima del fix)

| Sorgente `registerUnsavedSource` | Dove | Id |
|----------------------------------|------|-----|
| Anagrafica / tema / orari Impostazioni | `RestaurantSettingsTab` | `restaurant-settings` |
| Personalizza form (sotto-tab Impostazioni) | `BookingFormConfigPanel` | `booking-form-config` |
| Modale calendario (dettaglio edit / nuova prenotazione) | `BookingCalendar` | `calendar-modal` |

**Causa root:** il dialog navigazione (`UnsavedNavigationGuardModal`) usa lo stato `guardOpen` separato dalle entry dirty. Scenario tipico: edit in modale calendario → tentativo cambio tab → guard aperto → chiusura modale (X / Salva / Annulla) che **azzera** `calendar-modal` ma **non** chiude `guardOpen` → il dialog resta visibile e sembra bloccare ogni navigazione anche senza dirty reale.

**Non era** (solo) un mancato `clearUnsavedSource` sul calendario: la chiusura modale già azzerava la sorgente via `useEffect`, ma il dialog globale restava montato.

### Fix

1. **`UnsavedChangesContext`** — `useEffect`: quando `hasUnsavedChanges` diventa `false` e `guardOpen` è ancora `true`, chiama `closeGuard(false)` (dismiss stale, resta sulla schermata).
2. **`BookingCalendar`** — `clearUnsavedSource('calendar-modal')` sincrono in `closeDetailsModal` / `closeCreateModal`; cleanup garantito on unmount.
3. **`BookingDetailsModal`** / **`AdminBookingForm`** — cleanup unmount: `onEditDirtyChange(false)` / `onDirtyChange(false)` (solo wiring guard, LOCK rispettato).

---

## 3. File toccati e perché

| File | Perché |
|------|--------|
| `UnsavedChangesContext.tsx` | Chiude guard stale quando le sorgenti dirty si azzerano |
| `BookingCalendar.tsx` | Clear sincrono + unmount cleanup sorgente `calendar-modal` |
| `BookingDetailsModal.tsx` | Reset dirty parent on unmount (wiring C-U2) |
| `AdminBookingForm.tsx` | Reset dirty parent on unmount (wiring C-U2) |
| `UnsavedChangesContext.adminBlindatura.test.tsx` | +1 test guard stale |
| `bookingCalendarGuard.adminBlindatura.test.tsx` | +2 test chiusura modale → navigazione libera |
| `ADMIN_SHELL_NAV_CONTEXT.md` §7 | Comportamento guard stale documentato |
| `ADMIN_TEST_SUITE_INDEX.md` | Conteggio test aggiornato |

---

## 4. Test eseguiti e risultato

- `npx vitest run` sui file guard → **6/6** pass.
- `npm run validate` → **557/557** verde (lint + typecheck + Vitest).

---

## 5. File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `ADMIN_SHELL_NAV_CONTEXT.md` §7 | Bullet auto-chiusura guard stale | Comportamento reale post-fix |
| `ADMIN_TEST_SUITE_INDEX.md` | Conteggio test guard + nota stale | Indice blindatura admin |
| `SESSION_LOG.md` | Riga sessione | Cronologia |

---

## 6. Dati comunicazione

- Prompt esecutivo completo con diagnosi richiesta, vincoli LOCK/C-U2, output 1–6.
- Richiesta esplicita: minimo diff, Vitest regressione, validate verde, report standard.

---

## 7. Analisi flusso prompt

| Metrica | Valore |
|---------|--------|
| Prompt sostanziali Matteo | 1 (mandato esecuzione) |
| Correzioni dopo 1ª risposta | 0 |
| Follow-up generati | 0 |
| Modalità alzata | no (standard sufficiente) |

---

## 8. La TUA lettura della sessione

- **Impressioni:** il prompt con mappa sorgenti dirty + percorsi Pro ha orientato subito verso `UnsavedChangesContext`; test «guard stale» ha confermato la causa in un colpo solo.
- **Difficoltà:** il mock C-U2 originale (`onEditDirtyChange(isOpen)`) non riproduceva il bug; serviva test esplicito su azzeramento sorgenti con dialog ancora aperto.
- **Miglioria (dato):** in `ADMIN_PRENOTAZIONI_CONTEXT` §5-ter.22 aggiungere nota «guard stale» cross-link a §7 shell — opzionale, non bloccante.

---

## 9. Derivazione errori

| Causa | Cosa | Come evitare |
|-------|------|--------------|
| **bug preesistente** | `guardOpen` non sincronizzato con `entries` vuote | Test «clear dirty → dialog assente» in `UnsavedChangesContext` |
| **errore agente (C-U2 11-06)** | Fix C-U2 non considerava chiusura modale con guard tab già aperto | Nei prompt guard: elencare «guard tab aperto + chiusura modale» come scenario regressione |

---

## 10. Cosa resta

Niente. Smoke Pro (tab + sidebar dopo chiusura modale calendario) **OK Matteo 12-06-26**. Regressione Impostazioni dirty → guard sì: coperta da test M1 esistente, non toccato in questa sessione.

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) Prompt esecutivo unico (Profilo Esecuzione, modalità standard, skill ADMIN + ADMIN_SHELL §7 + ADMIN_PRENOTAZIONI §5-ter.22 + ADMIN_CLASSIC LOCK, obiettivo bug guard fantasma post-modale calendario Pro, output 1–6, branch env/test, vincoli C-U2/LOCK, validate + report). (2) «lavoro ok . smoke fatto.»

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero?
✅ R2: Ri-verificato: `UnsavedChangesContext.tsx` effect `hasUnsavedChanges && !guardOpen` → `closeGuard(false)`; `BookingCalendar` sync clear + unmount effect; test +2/+1; `npm run validate` **557/557**; `useBookingMutations` non toccato.

❓ Q3 — File correlati allineati?
✅ R3: `ADMIN_SHELL_NAV_CONTEXT.md` §7, `ADMIN_TEST_SUITE_INDEX.md`, `SESSION_LOG.md`. Nessun cambio §5-ter.22 prenotazioni (comportamento C-U2 invariato; fix è layer shell context).

❓ Q4 — Cosa NON hai fatto?
✅ R4: Non fatto: commit/push (non richiesti), E2E Playwright, refactor globale salvataggio admin. Smoke Pro fatto **da Matteo** (non MCP agente). Regressione Impostazioni dirty non duplicata (test M1 già presente).

❓ Q5 — Attrito + miglioria?
✅ R5: Attrito minimo; miglioria: test integrato «tab guard → chiudi modale → tab libera» ora in `bookingCalendarGuard.adminBlindatura.test.tsx`.

❓ Q6 — Contesto & hook?
✅ R6: Skill caricate sufficienti; nessun hook stop in sessione.

---

## 12. Self-review (pre-chiusura)

1. **Dati = diff** — OK: validate 557, file e cause root allineati al diff.
2. **Skill allineate** — OK: §7 shell + test index.
3. **Q1–Q6** — OK.
4. **Tono utente** — OK: cappello per tab/sidebar Pro, non nomi-file isolati.

---

## 13. Accettazione

**Matteo — «lavoro ok» + smoke fatto** (12-06-26): task accettato. Nessun commit in questa chiusura.

---

*Fix eseguito 12-06-26 — agente Esecuzione, modalità standard. Chiusura: lavoro ok.*
