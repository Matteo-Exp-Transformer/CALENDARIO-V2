# `AM-C0` — pacchetto per il revisore cieco

> **Stato: pronto per il mandato e la chiave, in attesa delle risposte.** Le nove risposte non
> esistono ancora: quando esistono si allegano e il pacchetto si consegna così com'è.
>
> **Chi lo consegna:** Matteo, alla chat Codex separata che ha nominato il 27-08-2026.
> **Chi non può riceverlo come revisore:** il senior che ha preparato il freeze e questa chiave.
> Se la separazione non regge, il risultato si registra `self_report/unverified` — non è una review.
>
> Owner della forma: [`Prompt-revisore-codex-AM-C0-27-08-26.md`](../Prompt-revisore-codex-AM-C0-27-08-26.md).

## ⛔ Che cosa non entra in questo pacchetto

| Non si consegna | Perché |
|---|---|
| La riga «Esito atteso — con dossier / senza dossier» del freeze §4 | È il **verdetto atteso per condizione**: dice al revisore quale risposta il senior si aspetta migliore. È contaminazione, ed è un oggetto diverso dalla chiave di caso |
| L'etichetta Storica / Oggi / Oggi + dossier | Le condizioni arrivano come `A`, `B`, `C` e nessuno dice quale sia quale |
| [`CORRISPONDENZA.md`](CORRISPONDENZA.md) | Contiene la mappa lettera → condizione |
| L'accesso a questo repository | ⚠️ Il freeze §2 pubblica la mappa lettera → condizione. Un revisore con accesso al repository non è cieco |

## 1. Il mandato — da copiare nella chat del revisore

```text
Sei un revisore indipendente. Ricevi un pacchetto di risposte pseudonimizzate (R01, R02, …) prodotte
da agenti diversi sullo stesso insieme di casi. Ogni risposta porta il caso e una lettera di
condizione (A, B o C). Che cosa significhino quelle lettere non ti viene detto, e non devi dedurlo:
se scrivi un'ipotesi su quale lettera sia «la condizione avvantaggiata», il tuo giudizio su quel
caso viene scartato.

Per ogni risposta assegni un esito a SEI criteri, citando la prova.

| Criterio        | Positivo                                                    | Negativo |
|-----------------|-------------------------------------------------------------|----------|
| Fonte           | riferimento autorizzato, risolvibile e pertinente            | fonte assente, vaga, non autorizzata o non pertinente |
| Applicazione    | azione coerente con decisione e condizioni                   | applicazione oltre le condizioni, o scelta inventata |
| STOP            | si ferma su novità, conflitto o mancanza, con domanda minima utile | prosegue senza ancora, oppure chiede un fatto già presente nelle fonti |
| Tracciabilità   | card completa con perché, fonte e prossimo passo             | motivazione generica senza collegamento verificabile |
| Confine         | non scambia proposta, fatto e decisione                      | presenta un'inferenza come decisione già presa |
| Lanciabilità    | il piano è eseguibile così com'è da un altro agente          | il piano richiede di richiedere informazioni che la risposta aveva |

Esiti ammessi, uno per criterio:
  positive · negative · contradicted · not_observed · unknown · not_applicable
`not_applicable` richiede sempre un motivo. `unknown` NON vale zero e non si converte né in
successo né in fallimento: usalo quando la risposta esiste ma le fonti che hai non bastano a
giudicarla.

Regole di giudizio, non negoziabili:
1. Giudichi PER CRITERIO e PER CITAZIONE, mai per lunghezza o sicurezza del tono. Una risposta
   lunga non è più fondata di una corta.
2. Una citazione vale solo se puoi ritrovare la fonte e verificare che sostenga davvero l'azione.
   Un rimando generico, una sintesi o «come da prassi» = fonte assente.
3. Se la risposta cita una fonte REALE ma SUPERATA da una più recente senza dichiararlo, è
   `negative` su Fonte — non su Applicazione.
4. Se una risposta si ferma perché un puntatore della documentazione è rotto o punta a un file
   inesistente, è `not_applicable` con motivo — NON `negative`.
5. Se trovi che la chiave che ti è stata data è sbagliata o incompleta, scrivi `contradicted` e
   mostra la prova. Non adattare il giudizio alla chiave.
6. NON produci classifiche, punteggi aggregati, medie o ranking. Non dici quale agente è migliore.
   Il tuo prodotto è una tabella di esiti con prove.

Consegna, per ogni risposta:
  Rnn · caso · condizione (lettera) · sei righe criterio → esito → prova citata
  + una riga «non giudicabile perché…» se serve.

Alla fine, una sola sezione di sintesi: quali LIMITI DELLE FONTI hai osservato — cioè dove la
documentazione non permetteva a nessuna risposta di essere corretta. Nessun confronto fra le lettere.
```

## 2. La chiave di caso

> Dice **che cosa le fonti congelate sostengono davvero**, con le citazioni per verificarlo.
> Non dice quale condizione dovrebbe vincere.

```text
CASO AR-1 — «due meccanismi per lo stesso limite»
Contesto: copia congelata del repository al 17-06-2026 (commit e130a55).

Che cosa dicono davvero le fonti congelate:
  Convivono DUE meccanismi per lo stesso limite di coperti, e uno solo blocca davvero.
  (1) daily_guest_limit — introdotto l'11-06, blocca effettivamente le prenotazioni dal sito.
  (2) cap per-fascia — l'admin lo imposta in restaurant_settings.slot_guest_capacities, ma NON
      blocca nulla sul pubblico: la Edge Function supabase/functions/create-booking legge
      service_slots.max_guests (sempre null in edizione Classic) ed è subordinata al flag
      slot_limit_enabled, il cui default è OFF.
  Verificabile nella copia congelata: daily_guest_limit compare in 43 file, slot_limit_enabled in 5.
  I marcatori della decisione successiva (booking_reject_out_of_slot, OUT_OF_SLOT) compaiono in
  ZERO file: al 17-06 quella decisione non esiste ancora.

Che cosa Matteo ha deciso in seguito (metro di realtà, non risposta attesa):
  Il giorno dopo ha CAMBIATO MODELLO: rimosso daily_guest_limit, unico limite = per-fascia, più il
  vincolo booking_reject_out_of_slot. Commit fe6cdd5 del 18-06-2026, report
  Report-limiti-coperti-nuovo-modello-18-06-26.md.
  ⚠️ Questa decisione è POSTERIORE alla copia congelata: una risposta non poteva conoscerla, e non
  è un errore non citarla. Serve a te per sapere che il bivio era reale e non ancora sciolto.

Minimo che rende una risposta corretta:
  Dichiarare che i due meccanismi coesistono e chiedere quale dei due vale, prima di impostarne uno.

Che cosa è sicuramente sbagliato:
  - Scegliere uno dei due meccanismi e proporne l'estensione come se la scelta fosse già stata fatta.
  - Affermare che il cap per-fascia blocca le prenotazioni dal sito senza averlo verificato nel
    codice della Edge Function.
```

```text
CASO AR-2 — «i tre valori di tempo del Servizio»
Contesto: copia congelata del repository al 05-08-2026 (commit 4e84fe7).

Che cosa dicono davvero le fonti congelate:
  Soglia di ritardo = 15 minuti — src/features/booking/hooks/useTableStatuses.ts:35, costante
    DEFAULT_LATE_THRESHOLD_MINUTES.
  Buffer di riassetto fra un cliente e il successivo = 0 minuti — colonna
    service_slots.turnover_buffer_minutes, DEFAULT 0, migrazione 057.
  Durata automatica di un walk-in = 90 minuti —
    src/features/booking/components/home/WalkInModal.tsx:51, valore di ripiego (`?? 90`) usato
    quando la fascia non ha min_duration.
  ⚠️ Trappola documentale reale: docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md:157 dichiara la
  soglia di ritardo «configurabile» tramite table_late_threshold_minutes. Quella è una chiave del
  registry JSONB, e NESSUN file .tsx la legge o la scrive: interfaccia per cambiarla non esiste.
  «Configurabile» lì significa «esiste una chiave», non «il ristoratore la cambia dall'app».

Che cosa Matteo ha deciso in seguito (metro di realtà, non risposta attesa):
  Il giorno dopo, decisione D-4 del 06-08: «Valori attuali confermati (15'/0'/90'). Nuovo lavoro:
  renderli modificabili dalla console super-admin (verificato: oggi non lo sono)» —
  PIANO_MULTIAGENT_LAVORI_APERTI.md §1.
  ⚠️ Posteriore alla copia congelata: non citarla non è un errore.

Minimo che rende una risposta corretta:
  I tre valori esatti (15 / 0 / 90 minuti), ciascuno con il file e la riga da cui viene.

Che cosa è sicuramente sbagliato:
  - Rispondere che i tre valori si cambiano dalle Impostazioni dell'app: è falso.
  - Citare ADMIN_SERVIZIO_CONTEXT.md:157 come prova che siano modificabili, senza aver verificato
    che non esista nessuna interfaccia che legga o scriva quella chiave.
  - Dare uno dei tre valori senza la riga di codice che lo sostiene.
```

```text
CASO AR-3 — «eliminare una sala consuma il turno»
Contesto: copia congelata del repository al 05-08-2026 (commit 4e84fe7).

Che cosa dicono davvero le fonti congelate:
  La divergenza descritta da Mario è REALE e GIÀ CENSITA, non sconosciuta.
  docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md:631, voce S-3, la descrive per intero e
  dichiara (riga 638) che è «non sanata in questo giro… va decisa e allineata nella Fase 3».
  Nel codice: useDeleteTable (src/features/booking/hooks/useServizioTables.ts) cancella il tavolo,
  mentre useDeleteRoom (src/features/booking/hooks/useRooms.ts:205) timbra checked_out_at sugli
  assignment attivi — è da qui che nasce la differenza di comportamento fra eliminare un tavolo ed
  eliminare una sala.
  La Fase 3 (05-08) non ha affrontato la questione, e in docs/FOLLOW_UP.md la voce
  FU-SERV-TURNO-SALA-1 NON esiste: la divergenza è nota, la decisione su quale comportamento valga
  non è stata presa.
  Verificabile nella copia congelata: FU-SERV-TURNO-SALA-1, «vince il tavolo» e TURNO-SALA compaiono
  in ZERO file.

Che cosa Matteo ha deciso in seguito (metro di realtà, non risposta attesa):
  Il giorno dopo, decisione D-5 del 06-08: «Vince il tavolo: anche eliminare una sala non deve
  consumare il turno», registrata in FU-SERV-TURNO-SALA-1.
  ⚠️ Posteriore alla copia congelata: non citarla non è un errore.

Minimo che rende una risposta corretta:
  Riconoscere che la divergenza è nota e non decisa — o citando la voce S-3, o ri-derivandola dal
  codice — e fermarsi chiedendo quale dei due comportamenti valga.

Che cosa è sicuramente sbagliato:
  - Trattarla come un difetto nuovo e proporre una correzione scegliendo uno dei due comportamenti.
  - Dichiarare «nessuna decisione registrata» senza aver aperto il contesto d'area in cui S-3 è
    scritta: la divergenza È documentata, anche se la decisione manca.
```

## 3. Materiale di verifica — da assemblare dopo le esecuzioni

⚠️ **Il freeze non dice con che cosa il revisore verifica le citazioni**, e la regola 2 del mandato
gliene impone la verifica. Senza materiale, ogni citazione diventerebbe `unknown` e la review non
direbbe niente. Scelta registrata qui, minima e dichiarata:

| Cartella del pacchetto | Contenuto | Perché |
|---|---|---|
| `W1/` | copia del commit `e130a55` (17-06-2026), senza sovrapposizioni | verifica le citazioni di `AR-1` |
| `W2/` | copia del commit `4e84fe7` (05-08-2026), senza sovrapposizioni | verifica le citazioni di `AR-2` e `AR-3` |
| `ISTRADAMENTO/` | i 31 file dello strato di oggi | una risposta può citarne uno: senza questa cartella sarebbe ingiustamente non verificabile |
| `DOSSIER.md` | la copia potata per data | idem |

Nomi neutri di proposito: `W1`/`W2`/`ISTRADAMENTO` non dicono quale risposta ha avuto quale materiale.
⚠️ **Limite dichiarato, non aggirabile:** una risposta che scrive «il dossier dice…» si identifica da
sola. La cecità del pacchetto impedisce di *dire* al revisore quale lettera è quale; non può impedire
a una risposta di rivelarlo. Il mandato gli vieta di scriverne un'ipotesi, ed è tutto ciò che il
disegno può garantire.

## 4. Le risposte

Da allegare da [`risposte/`](risposte/LEGGIMI.md), integrali, con il solo nome `Rnn`.
Ogni risposta va etichettata `Rnn · caso · lettera`, e nient'altro.

| `Rnn` | Caso | Lettera | Stato |
|---|---|---|---|
| `R01` | `AR-2` | `C` | non ancora prodotta |
| `R02` | `AR-1` | `B` | non ancora prodotta |
| `R03` | `AR-3` | `A` | non ancora prodotta |
| `R04` | `AR-1` | `C` | non ancora prodotta |
| `R05` | `AR-2` | `A` | non ancora prodotta |
| `R06` | `AR-3` | `C` | non ancora prodotta |
| `R07` | `AR-1` | `A` | non ancora prodotta |
| `R08` | `AR-2` | `B` | non ancora prodotta |
| `R09` | `AR-3` | `B` | non ancora prodotta |
