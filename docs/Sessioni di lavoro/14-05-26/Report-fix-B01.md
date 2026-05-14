# Report fix B01 — create-booking non salvava clienti nel CRM

Data: 2026-05-14

## Causa root

La Edge Function `create-booking` (quella che riceve le prenotazioni dal form pubblico) salvava correttamente la prenotazione ma non scriveva nulla nella tabella `customers`. Risultato: l'admin Pro aprendo la sezione CRM non vedeva nessun cliente arrivato dal form — solo quelli inseriti manualmente.

## Fix applicato

In `supabase/functions/create-booking/index.ts`, subito dopo l'insert della prenotazione, è stato aggiunto un blocco upsert su `customers`:

- se il cliente con quella email non esiste per quel ristorante → viene creato con `source = 'synced'`
- se esiste già → viene aggiornato solo `updated_at` (non si sovrascrivono nome o telefono inseriti manualmente dall'admin)
- se l'email è vuota → nessuna operazione su customers

La Edge Function usa già `service_role`, che bypassa le RLS. Il trigger `enforce_customer_tenant` sulla tabella `customers` controlla `auth.role()` e agisce solo per chiamanti `authenticated` — con service role viene saltato. Nessuna migrazione necessaria, la tabella `customers` con tutte le colonne richieste esiste dalla migrazione `006`.

## Test aggiunti

File: `src/features/booking/utils/__tests__/createBookingCustomerUpsert.test.ts`

4 test Vitest con client Supabase mockato:
1. nuova email → INSERT con source=synced
2. email con spazi e maiuscole → normalizzata prima dell'insert
3. email già presente → UPDATE updated_at, nessun INSERT duplicato
4. email vuota → nessuna chiamata a customers

## File toccati

- `supabase/functions/create-booking/index.ts` — aggiunto blocco upsert customers
- `src/features/booking/utils/__tests__/createBookingCustomerUpsert.test.ts` — nuovo file test

## Validate

```
lint:      0 warning
typecheck: 0 errori
test:      58/58 pass (+4 nuovi rispetto ai 54 precedenti)
```

## Cosa resta (bug aperti)

B02, B03, B04 ancora aperti — vedi `docs/Testing-Skill/TESTING_CONTEXT.md`.
