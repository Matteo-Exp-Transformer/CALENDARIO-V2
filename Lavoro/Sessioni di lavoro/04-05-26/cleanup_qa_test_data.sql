-- Pulizia mirata dati creati durante QA post-RLS (eseguire in SQL Editor dopo conferma).
-- NON usare TRUNCATE. Revisionare la lista WHERE prima di RUN.

BEGIN;

-- Booking generate da stress concorrente e prove REST/UI
DELETE FROM public.booking_requests
WHERE client_email IN (
  'stress@test.local',
  'qa@test.local',
  'qa-plan@test.local',
  'afterfix@test.local'
)
OR client_name LIKE 'stress-%'
OR client_name IN ('E2E retest', 'plan-suite', 'after-fix');

-- Seed cross-tenant usati per S1.6/S1.7 (rimuovere solo se non servono più ai test)
-- DELETE FROM public.booking_requests
-- WHERE client_email IN ('seedA@test.local', 'seedB@test.local');

COMMIT;

-- Utenti Auth QA (*.rls@example.com / password debole): rimozione solo da Dashboard Auth
-- oppure tramite Admin API — non incluso qui per evitare cancellazioni accidentali.
