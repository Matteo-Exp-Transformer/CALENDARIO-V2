# S3 — Handoff: Intervalli di arrivo

**Cosa è cambiato:** nella Pagina Prenota il cliente sceglie solo orari validi per fascia; senza fasce resta l'orario libero.
**Cosa resta:** verifica di accettazione di Matteo; rollout PROD separato e non autorizzato.
**Serve una tua azione:** sì — prova Pagina Prenota e Servizio → Fasce con la checklist in fondo.

## Stato consegnato

- Branch `env/test`, base `be12b73`; working tree non committato preservato e completato.
- Nessun commit, push o accesso PROD.
- TEST `docnnernvpyrbwuzzach`: migrazioni 059–062 verificate e registrate; tipi rigenerati.
- `create-booking` distribuita solo su TEST con `verify_jwt:false`.

## Implementazione

- Pagina Prenota: orari raggruppati per fascia, step relativo all'inizio, cutoff, durata, tardivo,
  overnight; cambio data/card/ospiti mantiene l'ora solo se ancora valida.
- Fallback: fasce assenti o `booking_time_slots_enabled=false` → selettore libero precedente.
- Capacità: RPC chiamata solo con `slot_limit_enabled=true`; conta coperti `accepted`, ignora pending/no-show.
- Edge: valida input manipolati e salva `duration_minutes`, source `public_form`, rule version 1.
- Admin: creazione, accettazione e modifica preservano snapshot presenti; i legacy congelano la
  durata effettiva del programma admin. `desired_time` resta allineato a `confirmed_start`.
- Servizio Pro: campo per-fascia 15/30/60 + «Altro», range 5–120. Nessun campo Classic o toggle tardivo.

## Migrazioni e sicurezza

- `059`: colonna + constraint 5–120.
- `060`: disponibilità anonima minimale, input validati, tutte le fasce, cap override/base/legacy.
- `061`: configurazione pubblica minimale e sole soglie operative.
- `062`: estensione retrocompatibile di `update_service_slot(jsonb)`.
- RPC: `search_path=public,pg_temp`, revoke da `PUBLIC/authenticated`, grant solo `anon` dove serve.
- Advisor: warning intenzionali sulle due RPC anon `SECURITY DEFINER`; altri warning preesistenti fuori scope.

## D40 e autorizzazione 063

Matteo ha autorizzato `063` dopo la prima diagnosi. La lettura completa ha però mostrato che ogni
invio pubblico nasce `pending`, e D36 vieta di contarlo come capacità. Due pending concorrenti non
superano quindi la capacità occupata; contarli violerebbe il dominio, non contarli renderebbe il lock
inutile. `063` non è stata creata. L'admin resta volutamente “warning, non blocco”.

## Verifiche eseguite

- `npm run validate`: verde dopo le correzioni finali.
- Unit: 18 casi derivazione slot; 6 casi Edge; hook RPC/gate; snapshot admin; feedback errori.
- Smoke Edge TEST: orario 11:32 rifiutato `INVALID_ARRIVAL_STEP`; 12:01 accettato e snapshot 60 /
  `public_form` / 1, nonostante source/version falsi dal browser. Record QA eliminato.
- Test transazionale DB con rollback: fascia piena nascosta; pending enorme ignorato come previsto D36.
- QA Pagina Prenota: picker, selezione, submit e assenza overflow a 375×812, 834×1194, 1280×800.
- QA Servizio Pro: campo intervallo raggiungibile negli stessi tre viewport.
- Controtest: dati malformati, confini, flusso cambio scelta, limiti step/durata, responsive.

## Difetti trovati e metodo

1. RPC interrotta usava colonne inesistenti e lasciava `EXECUTE` a `PUBLIC`: confronto schema reale,
   definizioni installate e permessi prima del repair.
2. Prima versione pivot usava `max(boolean)`: prova reale TEST ha fallito; corretto con `bool_or`.
3. Bridge slot ricreava array a ogni render: QA browser ha rilevato instabilità; memoizzazione + update idempotente.
4. Smoke E2E cercava il submit interno da 1256px, mentre il breakpoint reale è 1600px; locator e
   assert allineati al comportamento consolidato, incluso locator inline non ambiguo col toast.

## Punti non testati

- `deno test` non eseguito: Deno non è installato e non è stato installato senza autorizzazione.
- Il doppio invio HTTP simultaneo è stato intercettato dal rate limit con 429 prima della capacità;
  la semantica pending/accepted è stata verificata in transazione DB e nei test puri.
- Nessun test, migrazione o deploy PROD.

## Checklist per Matteo

- [ ] Pagina Prenota → scegli una data: aprendo **Ora** vedi orari divisi per fascia.
- [ ] Cambia card/data: l'orario resta se valido; altrimenti sparisce e richiede nuova scelta.
- [ ] Servizio → Fasce → Modifica: vedi **Intervallo di arrivo** con 15/30/60 e «Altro».
- [ ] Imposta un valore diverso su TEST e riapri Prenota: gli orari partono dall'inizio fascia con quel passo.
- [ ] Se disattivi le fasce su TEST, in Prenota torna il selettore orario libero.
