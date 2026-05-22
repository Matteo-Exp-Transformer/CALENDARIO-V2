# Report — A5: Check disponibilità fascia nel form pubblico

**Data**: 22-05-26  
**Branch**: `Sviluppo-Dashboard-laterale`  
**Stato**: ✅ Verificato funzionante su Pro, ✅ Verificato funzionante su Classic (dopo fix dati TEST)

---

## Cosa è stato fatto

### Diagnosi bug A5

Il blocco capacità nella pagina pubblica non scattava. Indagine su 5 ipotesi:

1. **`confirmed_start` null** — escluso: prenotazioni accepted su `ristorante-test-pro` avevano `confirmed_start` valorizzato.
2. **`desired_time` fuori da ogni fascia** — escluso: le fasce coprono 07:00-04:00.
3. **`max_guests` null su tutte le fasce** — ✅ **CAUSA PRINCIPALE su entrambi i tenant TEST**: tutte le fasce di `ristorante-test-classic` e `da-mario` avevano `max_guests = null` → nessun cap attivo.
4. **`booking_time_slots_enabled` false** — escluso: Classic aveva il flag `true`, Pro non aveva il flag (default `true`).
5. **`daily_guest_limit = -1`** — ✅ **CAUSA SECONDARIA su Classic**: limite giornaliero illimitato → check giornaliero mai scattato.

**Conclusione**: il codice (EF `create-booking`, EF `check-slot-availability`, hook `useCheckSlotAvailability`, integrazione in `BookingRequestForm`) è **corretto**. Il bug era dati di test non configurati per innescare il blocco.

### Fix dati TEST applicati via MCP

Su `ristorante-test-pro` (`11111111-1111-1111-1111-111111111111`):
- Fascia **Cena** (19:31-22:30): `max_guests` → 5
- Inserita prenotazione `accepted` per 22-05-26 20:00, 4 ospiti → resta 1 posto

Su `ristorante-test-classic` (`22222222-2222-2222-2222-222222222222`):
- Fascia **Ce** (19:31-22:30): `max_guests` → 5
- `daily_guest_limit` → 20 (era -1)
- Inserita prenotazione `accepted` per 22-05-26 20:00, 4 ospiti → resta 1 posto

### Verifica manuale confermata da Matteo

- **Pro** (`/ristorante-test-pro`, ore 20:00, 2 ospiti): ✅ bloccato con messaggio fascia
- **Classic** (`/ristorante-test-classic`, ore 20:00, 2 ospiti): ✅ bloccato con messaggio fascia

---

## File toccati

**Nessun file sorgente modificato** — il codice era già corretto. Solo dati DB TEST aggiornati via MCP.

File già presenti e funzionanti:
- `supabase/functions/create-booking/index.ts` — guard server-side (blocca al submit)
- `supabase/functions/check-slot-availability/index.ts` — EF pre-check client
- `src/features/booking/hooks/useCheckSlotAvailability.ts` — hook che chiama la EF
- `src/features/booking/components/BookingRequestForm.tsx` — integra il check pre-submit

---

## Architettura del check (confermata funzionante)

```
Cliente preme "Invia Prenotazione"
  ↓
[Client-side] useCheckSlotAvailability → EF check-slot-availability
  → se non disponibile: toast errore + blocco UI, form NON inviato
  ↓ (solo se disponibile)
[Server-side] EF create-booking → stesso check identico
  → se nel frattempo la fascia si è riempita: 409 SLOT_LIMIT
  → se ok: INSERT booking_requests
```

La doppia guardia (client + server) copre sia l'UX immediata sia la race condition.

---

## Domande poste e risposte

| Domanda | Risposta |
|---------|----------|
| Il blocco non scatta su Classic, è un bug nel codice? | No — i dati TEST avevano max_guests null e daily_limit -1 |
| Il calcolo coperti disponibili è corretto? | Sì: `cap - occupied` dove `occupied` = sum guests prenotazioni accepted nella stessa fascia per la data |

---

## Test eseguiti

- `npm run validate` non ri-eseguito (nessun file sorgente modificato)
- Verifica manuale: Pro ✅, Classic ✅

---

## Stato piano master

| Punto | Stato |
|-------|-------|
| A1 — Test motore N-slot | ✅ completato (sessione precedente) |
| A2 — Sezione Fuori fascia | ✅ completato (sessione precedente) |
| A3 — Cap 3 colonne wrapping | ✅ completato (sessione precedente) |
| A4 — validate verde + verifica manuale | ✅ completato |
| **A5 — Check disponibilità fascia pubblica** | ✅ **verificato funzionante** |
| B1 — Verifiche manuali TEST (13 punti) | ⬜ prossimo passo |
| B2 — Skill DB aggiornati | ⬜ |
| B3 — Decisione 019 | ⬜ |
| B4 — Ispezione prod read-only | ⬜ |

---

## Prossima sessione

Fase B del piano master:
- **B1**: eseguire la checklist 13 punti su TEST (Classic + Pro)
- **B2**: aggiornare DATABASE.md, DB_MIGRATIONS_CONTEXT.md, DB_SCHEMA_CONTEXT.md
- **B3**: decidere il destino di `019_cleanup_booking_time_slots`
- **B4**: ispezione prod read-only (SELECT count su restaurant_settings, service_slots, service_slot_overrides)
