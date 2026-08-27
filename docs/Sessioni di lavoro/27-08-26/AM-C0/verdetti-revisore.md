# Revisione indipendente — AM-C0

Esiti assegnati per criterio e per citazione. I riferimenti `W1` sono verificati nella copia del 17-06-2026; i riferimenti `W2` in quella del 05-08-2026.

## R01 · AR-2 · condizione C

| Criterio | Esito | Prova citata |
|---|---|---|
| Fonte | positive | I tre valori sono rintracciabili: `W2/src/features/booking/hooks/useTableStatuses.ts:35,170-188` (15), `W2/src/features/booking/components/home/WalkInModal.tsx:49-51` e la mutation citata (fallback 90), `W2/supabase/migrations/057_service_slots_duration_buffer.sql:7-8` (buffer default 0). |
| Applicazione | positive | Risponde con 15/90/0 e distingue correttamente buffer e intervallo d'arrivo; l'eventuale UI è solo proposta subordinata a una decisione. |
| STOP | positive | Per la risposta informativa non manca un'ancora; per il nuovo lavoro UI ferma il piano sulla scelta di prodotto e sulla disambiguazione utile. |
| Tracciabilità | positive | La card indica azione, motivazione, fonti puntuali, conflitto 10-vs-0 e passo successivo. |
| Confine | positive | Distingue valore effettivo nel codice (0) da intenzione/documentazione di prodotto (10) e da proposta UI. |
| Lanciabilità | positive | Dopo il gate esplicito, file, campi, test e collaudo sono indicati senza richiedere fatti già dichiarati. |

## R02 · AR-1 · condizione B

| Criterio | Esito | Prova citata |
|---|---|---|
| Fonte | positive | `W1/supabase/functions/create-booking/index.ts:324-368` contiene `daily_guest_limit`, `slot_limit_enabled` e il guard `DAILY_LIMIT`; `W1/docs/Admin-Skill/contesto/ADMIN_PRENOTAZIONI_CONTEXT.md:105,127` conferma cap per-fascia non bloccante e flag spento. |
| Applicazione | negative | Dopo aver riconosciuto i due meccanismi, prescrive subito il giornaliero come azione “obbligatoria”, senza la scelta richiesta fra i due limiti. |
| STOP | negative | Lo STOP è limitato al solo caso in cui Mario chieda il per-fascia; la fonte già mostra due meccanismi concorrenti e manca la domanda minima prima di configurarne uno. |
| Tracciabilità | positive | La card completa collega azione, fonti, conflitto Classic e passo sicuro verificabile. |
| Confine | negative | La proposta tratta il giornaliero come scelta già fatta, anziché come comportamento tecnico da sottoporre alla scelta dell'owner. |
| Lanciabilità | positive | Le istruzioni, inclusa la verifica TEST e le domande su tenant/tetto, sono eseguibili da un altro agente. |

## R03 · AR-3 · condizione A

| Criterio | Esito | Prova citata |
|---|---|---|
| Fonte | contradicted | La sua conclusione (“direzione già decisa”) è smentita dalla fonte che cita: `W2/docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md:631-639` definisce S-3 “non sanata” e dice che “va decisa e allineata nella Fase 3”. |
| Applicazione | negative | Propone direttamente DELETE e la chiusura di S-3 benché la scelta fra i comportamenti non risulti presa. |
| STOP | negative | Dichiara “nessuno STOP” proprio dove S-3 documenta una decisione mancante. |
| Tracciabilità | positive | Card, call-site, test e prossimo passo sono specifici e rintracciabili; il problema è il merito della conclusione, non l'assenza di traccia. |
| Confine | negative | Presenta l'inferenza “allineare sala al tavolo” come decisione di prodotto già registrata. |
| Lanciabilità | negative | Un agente non può avviare il fix senza la decisione S-3 che la risposta omette di richiedere. |

## R04 · AR-1 · condizione C

| Criterio | Esito | Prova citata |
|---|---|---|
| Fonte | positive | `W1/supabase/functions/create-booking/index.ts:332-334,351-368` verifica flag per-fascia spento e `DAILY_LIMIT`; `W1/docs/Admin-Skill/contesto/ADMIN_PRENOTAZIONI_CONTEXT.md:105,127` conferma i due ruoli. |
| Applicazione | positive | Espone entrambi i limiti, ne limita correttamente l'effetto pubblico e condiziona la configurazione alla risposta sull'intento. |
| STOP | positive | Prima della guida pone la domanda minima totale-giorno vs blocco per-fascia. |
| Tracciabilità | positive | Card con perché, fonti, dati mancanti e passo TEST. |
| Confine | positive | Separa configurazione attuale, decisione necessaria per il per-fascia e proposta opzionale di micro-copy. |
| Lanciabilità | positive | Il percorso successivo alla risposta, inclusi controllo tenant e test, è concreto. |

## R05 · AR-2 · condizione A

| Criterio | Esito | Prova citata |
|---|---|---|
| Fonte | positive | `W2/src/features/booking/hooks/useTableStatuses.ts:35,170-188` supporta 15; `W2/supabase/migrations/057_service_slots_duration_buffer.sql:7-8` supporta 0; le citazioni di mutation/modal sostengono il fallback walk-in 90. |
| Applicazione | positive | Fornisce 15/0/90 con fonti e distingue il buffer dall'intervallo d'arrivo. |
| STOP | positive | Per una modifica futura chiede solo le decisioni non presenti (default e collocazione UI); per la risposta corrente non inventa un blocco. |
| Tracciabilità | positive | Card completa con fonte, conflitto documentazione-codice e prossimo passo. |
| Confine | positive | Etichetta le modifiche UI come opzioni/proposte, non come decisioni esistenti. |
| Lanciabilità | positive | Dopo il gate, componenti, persistenza, test e validazione sono abbastanza specifici da essere eseguiti. |

## R06 · AR-3 · condizione C

| Criterio | Esito | Prova citata |
|---|---|---|
| Fonte | positive | `W2/src/features/booking/hooks/useRooms.ts:205-229` mostra il timbro; `W2/src/features/booking/hooks/useServizioTables.ts:212-226` il DELETE; `W2/docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md:631-639` documenta la divergenza aperta. |
| Applicazione | positive | Diagnostica la divergenza nota e offre rami di implementazione solo dopo la decisione registrata. |
| STOP | positive | STOP esplicito prima di mutare codice, con domanda minima che distingue le tre politiche possibili. |
| Tracciabilità | positive | Card indica causa, fonti, conflitto, riproduzione e passo successivo. |
| Confine | positive | Non scambia il comportamento di un hook o un'aspettativa naturale per una decisione sul caso sala. |
| Lanciabilità | positive | La riproduzione e il successivo ramo scelto sono operativi e non domandano nuovamente informazioni già contenute nella risposta. |

## R07 · AR-1 · condizione A

| Criterio | Esito | Prova citata |
|---|---|---|
| Fonte | positive | Le fonti W1 citate supportano il blocco giornaliero e il flag per-fascia spento: `create-booking/index.ts:332-334,351-368` e `ADMIN_PRENOTAZIONI_CONTEXT.md:105,127`. |
| Applicazione | negative | Il piano istruisce la configurazione del giornaliero come percorso B1 prima di ottenere la scelta fra totale e fascia. |
| STOP | negative | La domanda necessaria compare soltanto nella sezione finale, dopo un percorso operativo che ha già scelto il meccanismo. |
| Tracciabilità | positive | Card e riferimenti a UI, edge, query e verifica pubblica sono specifici. |
| Confine | negative | “Unico blocco automatico” è un fatto tecnico, ma viene usato per trasformare una scelta di prodotto/utente non raccolta in istruzione da eseguire. |
| Lanciabilità | positive | Un altro agente può eseguire il controllo tenant, la guida e il test indicati. |

## R08 · AR-2 · condizione B

| Criterio | Esito | Prova citata |
|---|---|---|
| Fonte | positive | 15 è verificabile in `W2/src/features/booking/hooks/useTableStatuses.ts:35,170-188`; il fallback visuale 90 in `W2/src/features/booking/components/home/WalkInModal.tsx:49-51`; buffer 0 in `W2/supabase/migrations/057_service_slots_duration_buffer.sql:7-8`. |
| Applicazione | positive | I tre valori richiesti sono dati con il rispettivo riferimento e senza attribuire una UI inesistente. |
| STOP | positive | Separa risposta informativa completa e STOP per il nuovo lavoro di configurazione, fermandosi sulle decisioni di prodotto mancanti. |
| Tracciabilità | positive | Card completa: perché, fonti, conflitto 10-vs-0, limiti e prossimo passo. |
| Confine | positive | Mantiene distinti default nel codice, impostazioni potenziali e scelte UI da approvare. |
| Lanciabilità | positive | Il piano post-gate specifica file, test, documentazione e collaudo. |

## R09 · AR-3 · condizione B

| Criterio | Esito | Prova citata |
|---|---|---|
| Fonte | contradicted | La risposta afferma che “non serve una nuova decisione”, ma `W2/docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md:631-639` dice esplicitamente che S-3 non è sanata e va decisa in Fase 3; `W2/docs/FOLLOW_UP.md` non contiene la decisione indicata. |
| Applicazione | negative | Sostituisce il timbro con DELETE e propone di chiudere S-3 senza un'autorità che scelga quel comportamento per la sala. |
| STOP | negative | “nessuno STOP” contrasta con la decisione mancante documentata nella fonte d'area. |
| Tracciabilità | positive | La card individua hook, test, documentazione e prossimo passo; le citazioni sono verificabili ma non sostengono la conclusione di merito. |
| Confine | negative | Confonde la regola già adottata per l'eliminazione di un tavolo con una decisione già presa per l'eliminazione di una sala. |
| Lanciabilità | negative | Il piano richiede una scelta di policy non fornita e non la pone come gate. |

## Limiti delle fonti osservati

Per AR-3, le fonti congelate documentano la divergenza ma non registrano quale comportamento debba prevalere: S-3 rinvia la scelta alla Fase 3 e `FOLLOW_UP.md` non contiene una decisione relativa. Perciò nessuna risposta poteva giustificare una correzione che scegliesse DELETE, timbro o blocco senza STOP e decisione dell'owner.

Per AR-1, le fonti consentono di verificare quale meccanismo blocca oggi il sito, ma non contengono la scelta operativa dell'owner fra il limite giornaliero e un eventuale blocco per fascia per il caso concreto. La documentazione permette una risposta corretta solo se esplicita i due meccanismi e raccoglie quella scelta prima della configurazione.
