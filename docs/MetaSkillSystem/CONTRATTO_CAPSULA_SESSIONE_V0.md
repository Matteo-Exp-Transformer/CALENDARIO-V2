# Contratto della capsula di sessione — schema `mss.session/0.1.1`

> 🟡 **AVVISO OPERATIVO — aggiornato 23-08-2026 (`SK-4` E3). Leggi prima di scrivere una capsula.**
>
> **Versione viva del contratto:** **`mss.session/0.1.1`** + **`mss-v0.1-wp0.1-freeze-2`**
> — fonte autorevole del motore: `scripts/mss/rules.mjs` righe 3–6. Il corpo di questo file è
> allineato a quella coppia.
>
> **Enforcement validator attivo (wave 1 `SK-4` merge 23-08-26).** I tre bypass documentati in
> `PLAN_V0.md` §4-bis (`S4`) sono chiusi nel motore: record **nuovi** con coppia legacy
> `0.1.0` / `freeze-1` → `MSS-LEGACY-NEW-FORBIDDEN`; report/verbali in sotto-cartella e con
> prefisso `Verbale-` entrano nel perimetro pre-commit. **Non usare la coppia legacy per produrre
> capsule nuove:** scrivi sempre la coppia viva e includi `controls` (vedi §4).
>
> **Coppia legacy — solo lettura.** `mss.session/0.1.0` + `mss-v0.1-wp0.1-freeze-1` serve a
> **leggere** record storici già finalizzati, non a crearne di nuovi. Lo storico non va riscritto.
>
> Fonte bypass e prova A/B/C: `docs/Sessioni di lavoro/21-08-26/MAPPA-MSS-consulenza-esterna-21-08-26.md` §6.

> **Stato:** congelabile per `WP-0.1`; efficacia non ancora osservata.
> **System revision:** `mss-v0.1-wp0.1-freeze-2`
> **Funzione:** conservare l'evento minimo di ogni chat sostanziale. Il report racconta; i record
> JSONL permettono di ricostruire. Questo contratto non sceglie l'event store definitivo.

Nessun campo vuoto viene riempito a plausibilità: usare `nessuno`, `non_osservato`,
`non_applicabile:<motivo>` o `non_noto`. Un valore obbligatorio con placeholder invalida il record.

## 1. Unità e separazioni obbligatorie

La capsula è un piccolo **bundle append-only** di record JSON, uno per riga:

1. un `session_event`, che registra contratto, fatti e risultato osservabile della seduta;
2. zero o più `annotation`, ciascuna appartenente a un solo asse primario
   `persona | sistema | output`;
3. eventuali `amendment`, che correggono senza riscrivere un record finalizzato.

Il record base non è “verità oggettiva”: è la prima registrazione attribuita e proveniente da fonti
esplicite. Resta però immutabile dopo la finalizzazione. Interpretazioni, G/O/E, stato probatorio,
classificazione prodotto e letture successive vivono nelle annotazioni, non nel fatto grezzo.

Ogni riga è JSON valido, UTF-8, senza commenti né newline interne. Ordine delle chiavi e spaziatura
non sono semantici. Il validator futuro deve parsare JSON, non confrontare testo byte-per-byte.

## 2. Dove vive

### Report e verbali (standard/deep)

- Sezione `Capsula MetaSkillSystem` del report o verbale proprietario, in un unico blocco fenced
  `jsonl`. Prima riga `session_event`, righe successive annotazioni/rettifiche.
- **Path ammessi** sotto `docs/Sessioni di lavoro/`, con **profondità arbitraria** sotto la
  cartella-data (es. `23-08-26/sub/Report-….md` è valido).
- **Prefissi nome file ammessi:** `Report-` e `Verbale-` (estensione `.md`, case-insensitive sul
  prefisso).
- Perimetro validator/pre-commit (decisione `G1`+`G2`, `SK-4`):

  ```text
  /^docs\/Sessioni di lavoro\/.+\/(Report|Verbale)-.*\.md$/i
  ```

  Un file fuori da questo perimetro non entra nell'enforcement automatico su staged/modificati.

### Light

- File pilot-only `docs/Sessioni di lavoro/GG-MM-AA/eventi-light/<record_id>.jsonl`, con una riga
  `session_event` e le eventuali annotazioni sulle righe successive. La riga narrativa in
  `docs/SESSION_LOG.md` contiene soltanto il link al file e l'`event_id`; non contiene la capsula.

### Chat interrotta/compact

- Blocco `jsonl` nel prompt di proseguimento o handoff. Il nuovo segmento conserva `session_id` e
  `correlation_id`, incrementa `segment_no` e collega `continues_record_id`; la seduta successiva
  ha un nuovo `session_id` ma conserva il `correlation_id` e cita il record precedente in
  `causation_record_id`.

### Valutazione personale

- La capsula non crea un settimo owner. Vive nel verbale/evento primario; gli altri proprietari
  ricevono soltanto le transizioni che già possiedono. Dati e prove privati non vengono copiati in
  un evento git-tracked: si usa un riferimento stabile autorizzato.

Il file light è un supporto temporaneo del pilota, non una decisione sullo store definitivo. Un file
per evento evita collisioni fra writer; nessun indice/proiezione viene aggiornato dall'agente oltre
alla normale riga narrativa di `SESSION_LOG.md`.

## 3. Identità comune a ogni record

Ogni `session_event`, `annotation` e `amendment` contiene:

```text
schema_version: mss.session/0.1.1
system_revision: mss-v0.1-wp0.1-freeze-2
record_type: session_event | annotation | amendment
record_id: mss-rec-<UUIDv7>
session_id: mss-ses-<UUIDv7>
correlation_id: mss-cor-<UUIDv7>
segment_no: intero >= 1
capture_key: <session_id>/<segment_no>/<record_type>/<ordinal>
created_at: RFC3339 con timezone
finalization: draft | final
recorded_by:
  actor_id:
  actor_type: matteo | agente | congiunto | terzo | sistema
  role:
  agent_runtime:
    provider:
    model:
    runtime:
    surface:
  tools_used: []
packages_loaded:
  - package_id:
    package_version_or_revision:
    source_ref:
```

`agent_runtime` vale `non_applicabile:<motivo>` per un autore umano. `packages_loaded` registra ciò
che è stato realmente aperto, non ciò che il routing avrebbe voluto aprire. `recorded_by` è l'autore
del record, distinto dagli attori descritti nel suo contenuto.

### Coppia legacy — solo lettura (non produrre record nuovi)

Per **leggere** capsule già finalizzate prima del passaggio a `0.1.1`/`freeze-2`:

```text
schema_version: mss.session/0.1.0
system_revision: mss-v0.1-wp0.1-freeze-1
```

Su questa coppia il validator storico non richiede `controls`. **Vietato** usarla su record nuovi:
con la coppia viva `controls` è obbligatorio (§4). Dopo `SK-4` E2 il motore rifiuterà la coppia
legacy su record nuovi (`MSS-LEGACY-NEW-FORBIDDEN`).

### Regole ID, compact e retry

- UUIDv7 è generato localmente dal writer; il prefisso rende il tipo leggibile, l'UUID evita il
  progressivo centrale e le collisioni fra agenti.
- `capture_key` viene assegnata **prima** del primo tentativo di persistenza e riusata in ogni retry.
- Stessa `capture_key` + stesso contenuto canonico = retry idempotente, si conserva un solo record.
- Stessa `capture_key` + contenuto diverso = conflitto: la seconda scrittura è rifiutata; dopo una
  finalizzazione si usa `amendment`.
- Due record con lo stesso `record_id`, oppure due record diversi con la stessa `capture_key`, sono
  invalidi nel perimetro controllabile salvo il retry identico appena descritto.
- Un compact non apre una seconda sessione: mantiene `session_id`, incrementa `segment_no` e indica
  `continues_record_id`. Un nuovo agente/chat continua la catena con nuovo `session_id`, stesso
  `correlation_id` e `causation_record_id` verso l'ultimo record ricevuto.

## 4. `session_event`: busta e fatto base

Il contenuto `event` è obbligatorio e non contiene annotazioni dei tre assi.

```text
event:
  event_id: mss-evt-<UUIDv7>
  event_kind: session_close | compact_snapshot | interruption | invalidation
  occurred_at:
  continues_record_id: nessuno | <record_id>
  causation_record_id: nessuno | <record_id>
  intent_user:
  session_type: light | standard | deep | meta | valutativa
  capsule_status: completa | interrotta | invalidata
  role_key:
  area:
  environment:
  authorization:
    read: []
    write: []
    forbid: []
  authorized_outputs: []
  route:
    chosen:
    alternatives_or_conflicts: [] | nessuno
  observed_outcome:
  open_items: [] | nessuno
  controls: [] | nessuno
  subject_runtime:
    actor_id:
    provider:
    model:
    runtime:
    surface:
  privacy:
    classification: public | internal | personal | sensitive | sealed_test
    capture_basis: user_request | operational_need | explicit_consent | non_applicabile:<motivo>
    allowed_content: []
    prohibited_content: []
    redactions: [] | nessuno
    external_release: forbidden | requires_confirmation | allowed
    retention: undecided_wp0.1
    rectification_route: amendment
  owner_refs: []
  source_refs: []
```

### `controls` — prove delle verifiche (obbligatorio su record nuovi)

Su ogni `session_event` a schema **`0.1.1`** / **`freeze-2`**, il campo `controls` è **vitale**:
non può mancare. Valori ammessi:

- **`nessuno`** — dichiarazione esplicita che nessun controllo misurabile è stato eseguito in seduta
  (raro; va giustificato in `observed_outcome` o nelle annotazioni).
- **Array di oggetti controllo** — una voce per ogni verifica eseguita con criterio e esito misurabile.

Ogni oggetto controllo contiene:

```text
control_id:       identificatore stabile del controllo (es. nome gate o comando)
criterio:         cosa si misura / quale condizione deve valere
esito:            pass | fail | non_applicabile | non_noto
numeratore:       intero >= 0 (quanto soddisfatto)
denominatore:     intero > 0 (totale misurato; numeratore <= denominatore)
esecutore:        chi ha eseguito il controllo (actor_id o ruolo)
evidence_refs:    [] di ref risolvibili verso log, report, output del comando
```

`controls` registra *che cosa è stato davvero verificato*, con criterio, numeratore, denominatore ed
esecutore — distinto dalle annotazioni degli assi, che interpretano Persona/Sistema/Output. Un record
nuovo senza `controls` (o con array vuoto al posto di `nessuno` dichiarato) fallisce la validazione
(`MSS-VITAL-MISSING :: event.controls`). Sulla coppia legacy §3 il campo resta opzionale solo per
**lettura** dello storico.

Ogni owner/fonte usa un riferimento risolvibile nel perimetro disponibile:

```text
ref_id:
owner_id:
uri_or_path:
stable_anchor_or_event_id:
revision_or_hash:
sensitivity:
```

Per una fonte viva servono anchor/ID stabile più revisione o hash; una riga è sufficiente soltanto
in un verbale congelato. Il registro owner completo resta a `WP-3`: nel pilota basta che ogni ref
punti a un artefatto esistente e dichiari chi ne possiede lo stato.

`capsule_status` descrive la validità della capsula come fonte di apprendimento, non il successo
tecnico del task. Se prima di una scrittura mancano ruolo, autorità, privacy, owner o rotta: STOP.

## 5. `annotation`: Persona, Sistema e Output

Ogni annotazione contiene un solo `axis`, punta a uno o più record fonte e conserva chi la dichiara
e chi la verifica. Il fatto può quindi restare immutato mentre tassonomia o giudizio cambiano.

```text
annotation:
  annotation_id: mss-ann-<UUIDv7>
  axis: persona | sistema | output
  subject_record_ids: []
  delta: nessuno | <prima -> dopo> | creato | modificato | verificato | usato | scartato
  assertions: []
  asserted_by:
    actor_id:
    role:
    basis: self_report | direct_observation | source_derived | joint_statement
  verification:
    status: self_report | unverified | independently_verified | contradicted | not_applicable
    verified_by: []
    verified_at: non_applicabile | <RFC3339>
    criterion_ref: non_applicabile | <ref>
    evidence_refs: []
    notes:
```

`independently_verified` richiede almeno un verificatore diverso da esecutore, autore del record e
soggetto della dichiarazione. `self_report` non può essere presentato come verifica. Una rettifica
successiva può cambiare lo stato dell'annotazione senza modificare la dichiarazione originaria.

### Persona

Le assertion Persona registrano soltanto segnali osservati: `signal`, `actor`, `assistance`,
`origin`, `source_ref`, `effect`, `evidence_state` e confini/correzioni. Valori ammessi per assistenza:
`spontaneo | guidato | suggerito_agente | congiunto`; per origine:
`naturale | sonda_trasparente | test_sigillato | inferenza`. Una chat ordinaria non alza livelli.

### Sistema

Le assertion Sistema separano `rule_id/version`, evento attivante,
`decision_or_output_changed`, e `G`, `O`, `E`. La sola citazione di una regola si annota come
`lettura dichiarata; applicazione non provata`. Violazioni, correzioni, guasti e recuperi restano
assertion distinte e fontate.

`G`, `O` ed `E` non sono punteggi inventabili dal writer: significano rispettivamente governance,
osservazione ed enforcement e usano la scala definita in
[`PARAMETRI_MACRO_V0.md` §5](PARAMETRI_MACRO_V0.md#5-validazione-delle-regole-tre-misure-indipendenti).
Per una regola critica vale il valore più debole; se la misura non è stata osservata va dichiarata,
non stimata per plausibilità.

### Output e quinto gate canonico

Ogni entità Output ha un solo tipo primario e ID stabile:

```text
output_id:
primary_type: prodotto | processo | prova | governance | registro
canonical_version:
recipient:
problem_or_job:
intended_use:
conceived_by:
decided_by:
directed_by:
authored_by:
verified_by:
acceptance_criterion:
verification_or_use_evidence:
verification_status:
owner_ref:
privacy_release:
support_files: []
relations_no_double_count: []
product_candidate:
  recipient: pass | fail
  problem_or_job: pass | fail
  canonical_version: pass | fail
  fixed_acceptance_criterion: pass | fail
  verification_or_use_evidence: pass | fail
  result: eligible | not_eligible
```

Il quinto gate è sempre **evidenza di verifica o uso**. Privacy/autorizzazione d'uscita restano
vitali, ma non lo sostituiscono. `eligible` richiede cinque `pass`; altrimenti l'entità resta
artefatto/supporto e non viene contata come prodotto. Una suite di test è processo, il suo run è
prova; il report è registro; i file sorgente sono normalmente supporti del deliverable.

## 6. `amendment`: rettifica append-only

Un record `final` non viene modificato o cancellato. La rettifica aggiunge:

```text
amendment:
  amendment_id: mss-amd-<UUIDv7>
  target_record_id:
  relation: amends | supersedes
  reason:
  changes:
    - field_path:
      previous_value_or_hash:
      corrected_value:
  evidence_refs: []
  effective_at:
```

- `amends` corregge o integra campi puntuali; ciò che non è citato resta corrente.
- `supersedes` sostituisce l'intero significato corrente del target, che resta comunque leggibile.
- Motivo, autore (`recorded_by`) e data (`created_at`/`effective_at`) sono obbligatori.
- **`previous_value_or_hash` porta il valore, mai un digest** — chiude la riserva `H13-POST-L01`.
  Il campo contiene il **valore effettivo** che il target ha prima della rettifica, nella sua forma
  nativa (stringa, numero, oggetto, array). Il confronto avviene fra la **forma canonica** del valore
  sul target e la forma canonica di questo campo (`canonicalJson` su entrambi i lati), quindi
  l'ordine delle chiavi di un oggetto non conta e nessuna codifica va dichiarata. **Nessun algoritmo
  di hash è previsto o supportato:** scrivere qui un digest — sha256 o altro — produce
  `MSS-AMENDMENT-PREVIOUS-MISMATCH`, perché verrebbe confrontato come stringa letterale contro il
  valore vero. Il nome del campo conserva `_or_hash` per compatibilità storica con i record già
  scritti: è un residuo del nome, non una seconda forma ammessa. Prova nelle due direzioni:
  `npm run test:mss` (gruppo `H13-POST-L01 — previous_value_or_hash è il valore, mai un digest`).
- Una vista applica la catena in ordine di `effective_at`; rettifiche concorrenti incompatibili
  restano `conflict_unresolved`, non vengono risolte per ordine arbitrario.
- Un errore scoperto prima di `final` può correggere il draft. Dopo `final`, solo append.

## 7. Privacy minima del pilota

Si cattura soltanto ciò che serve a ricostruire contratto, evento, tre delta e verifica. È vietato:

- inferire psicologia, difficoltà o dati sensibili non dichiarati e non pertinenti;
- copiare in git contenuti `personal`, `sensitive` o `sealed_test` quando basta un ref autorizzato;
- esporre chiavi, secret, materiale sigillato o dati di terzi non necessari;
- ampliare destinatari o uso rispetto a `external_release`;
- usare il pilota per promuovere livelli Persona.

Classificazione, contenuti ammessi/vietati, redazioni, confine d'uscita e via di rettifica sono
obbligatori nell'evento. La durata di conservazione resta deliberatamente
`undecided_wp0.1`; prima di mining esterno deve essere decisa in `IDEA-MSS-01`. Fino ad allora non si
duplica materiale privato e si applica minimizzazione.

## 8. Forma light canonica

La light usa **lo stesso schema**, non una seconda abbreviazione. Il file `.jsonl` contiene almeno
un `session_event` completo; le tre annotazioni possono avere `delta: nessuno`, ma non essere omesse
se la chiusura dichiara che gli assi sono stati valutati. Esempio di link nel log:

```markdown
| 10-08-26 | Fix locale … · `event:mss-evt-…` | [Evento light](Sessioni%20di%20lavoro/10-08-26/eventi-light/mss-rec-….jsonl) |
```

Il record non usa `|`, escaping Markdown o una mini-grammatica parallela. Il validator futuro apre
il link, legge ogni riga JSON e applica le stesse regole di standard/deep.

## 9. Chiusura valida

Prima di chiudere devono essere ricostruibili: chi ha deciso cosa, controllo e denominatore, output
cambiati, owner, aperti, schema/system revision, produttore/runtime/strumenti, privacy e stato di
verifica. I tre assi devono comparire come annotazioni o come dichiarazione esplicita e verificabile
`nessuno`; non possono sparire in silenzio.

Nelle sessioni deep o Meta, l'handoff indica stato vero, decisioni da non riaprire, autorizzazioni,
divieti, prossimo task atomico e gate. La capsula resta record; l'handoff è una vista operativa e non
duplica valori dinamici posseduti altrove.

Il primo pilota e le fixture minime sono congelati in
[`PROTOCOLLO_PRIMO_PILOTA_V0_1.md`](PROTOCOLLO_PRIMO_PILOTA_V0_1.md).
