# Report — Fasce orarie: UX stato, «Per sempre», chiusura servizio

Data: 16-05-26 · Area: Pagina **Servizio** → `ServiceSlotsManager.tsx`

## Obiettivo

Migliorare la gestione delle fasce orarie in Pro: pallino stato più chiaro, distinguere modifiche permanenti da quelle a tempo, chiudere un servizio con un pulsante dedicato invece di impostare 0 turni nel form.

---

## 1. Pallino stato override (ActiveTodayBadge)

**Prima:** verde «Limite attivo» / grigio «In programma» al centro della card.

**Dopo:**
- Solo **verde** «Attiva oggi», e **solo** se oggi un override governa la fascia (`resolveSlotOverride`).
- Nessun badge se ci sono solo override futuri.
- **Mobile:** badge compatto nel subtitle; da `sm` centrato nell’header.
- Componente rinominato `ActiveTodayBadge` (ex `LimitStatusDot`).

**File:** `ServiceSlotsManager.tsx` — `CollapsibleCard` resta LOCKED (solo uso).

---

## 2. «Per sempre» = impostazioni base (non «limite»)

**Comportamento DB (invariato):** «Per sempre» aggiorna solo `service_slots`, non `service_slot_overrides`.

**UX aggiornata:**
- Card: «N **Modifiche a tempo**» (non «Limiti Impostati»).
- Form con «Per sempre»: titolo «Tipo di salvataggio», box che spiega aggiornamento **impostazioni base**.
- Toast al salvataggio permanente: «Impostazioni base di «…» aggiornate» (non «Limite coperti»).
- Override in elenco: etichette «Turni» / «Coperti» (non «Limite Turni»).

---

## 3. Chiusura servizio (pulsante ✕)

**Per Anna:** in ogni riga fascia, accanto a modifica/elimina:
- **✕** → chiude il servizio (nessun tavolo disponibile in quella fascia).
- **↺** (stesso posto) → riapre con i turni che c’erano prima.

**Effetto visivo:** riga/card opaca (`opacity-55`), badge «Servizio chiuso».

**Storage (`service_slots`):**

| Campo | Ruolo |
|-------|--------|
| `max_turns = 0` | Servizio chiuso (equivale al vecchio «0 turni») |
| `max_turns_resume` | Turni salvati alla chiusura; ripristinati alla riapertura |

**Migrazione:** `023_service_slots_max_turns_resume.sql` — colonna + estensione RPC `update_service_slot(jsonb)`.

**Form:** campo turni ≥ 1 o vuoto (illimitato); **non** si accetta più 0 nel form.

**Helper:** `isServiceSlotClosed(slot)` in `useServiceSlots.ts`.

**Assegnazione tavoli:** invariato — `max_turns === 0` già bloccava i turni in `useTableAssignments`.

---

## File toccati

| File | Modifica |
|------|----------|
| `src/features/booking/components/servizio/ServiceSlotsManager.tsx` | UI badge, chiusura, copy |
| `src/features/booking/hooks/useServiceSlots.ts` | `max_turns_resume`, `isServiceSlotClosed`, `skipToast` |
| `src/types/database.ts` | tipo `max_turns_resume` |
| `supabase/migrations/023_service_slots_max_turns_resume.sql` | nuovo |
| `docs/Dashboard-laterale-skill/ADMIN_PAGES_CONTEXT.md` | regole fasce aggiornate |
| `docs/Database-Skill/DB_MIGRATIONS_CONTEXT.md` | riga 023 |

---

## Deploy DB

Applicare **023** sul server di **test** (`docnnernvp`) prima del test manuale. Non applicata a produzione in questa sessione.

---

## Validazione

`npm run typecheck` · `npm run lint` · test `useServiceSlots` 4/4 OK.

## Test manuale suggerito

1. Fascia con override futuri ma non oggi → nessun pallino verde.
2. «Per sempre» su una fascia → non aumenta il conteggio modifiche a tempo.
3. ✕ su Colazione → opaca, «Servizio chiuso», assegnazione tavoli bloccata.
4. ↺ → torna ai turni precedenti.
