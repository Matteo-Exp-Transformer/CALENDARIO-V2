# Contratto eval senior — `mss.senior-eval/0.1.0`

> **Stato:** sperimentale, non congelato per una prima eval prospettica.
> **Package:** `mss.senior-eval-pack/0.1.0`.
> **Owner:** questo file possiede oggetti, campi, comparabilità e rettifiche delle eval senior.
> Può referenziare `mss.session/0.1.1`, ma non lo modifica e non presume che una capsula di sessione
> costituisca già un'eval.

## 1. Scopo e non-scopo

Il contratto permette di osservare separatamente:

1. configurazione dell'agente;
2. metodologia applicata;
3. seduta e condizioni reali;
4. architettura o output prodotto;
5. processo di valutazione;
6. rettifiche e decisioni successive.

Non assegna un voto generico “senior”, non valuta psicologia o valore personale di Matteo, non
promuove livelli professionali e non autorizza confronti fra istanze non comparabili.

## 2. Livelli informativi che non si fondono

| Livello | Contenuto | Chi può produrlo | Può cambiare la storia? |
|---|---|---|---|
| `raw_event` | evento, prompt, output o misura osservabile | writer/capture operator | no, dopo finalizzazione |
| `observation` | descrizione attribuita di ciò che è accaduto | osservatore dichiarato | no; si rettifica |
| `annotation` | interpretazione collegata a fonti | analista dichiarato | no; può essere contraddetta |
| `evaluation` | applicazione di criteri congelati | evaluator autorizzato | no; nuova eval o rettifica |
| `verdict` | esito secondo protocollo | evaluator/adjudicator definiti prima | no; revisione successiva separata |
| `decision` | scelta operativa | Matteo o owner esplicitamente delegato | non riscrive eval/verdetto |
| `rectification` | correzione append-only | autore autorizzato con prova | conserva bersaglio e motivo |

Ogni record dichiara `evidence_type`, provenienza, autore, stato di verifica e limiti. Una sintesi
non sostituisce la fonte primaria.

## 3. Identità e versioni

Prefissi stabili:

| Oggetto | Formato ID |
|---|---|
| seduta | `SEP-SES-<YYYYMMDD>-<NNN>` |
| metodo | `SEP-MET-<slug>-<versione>` |
| configurazione agente | `SEP-AGC-<provider>-<runtime>-<NNN>` |
| output/architettura | `SEP-OUT-<slug>-<versione>` |
| protocollo eval | `SEP-PRO-<slug>-<versione>` |
| eval | `SEP-EVL-<YYYYMMDD>-<NNN>` |
| verdetto | `SEP-VRD-<YYYYMMDD>-<NNN>` |
| decisione | `SEP-DEC-<YYYYMMDD>-<NNN>` |
| rettifica | `SEP-AMD-<YYYYMMDD>-<NNN>` |

Gli ID non si riusano. Le versioni sono immutabili per istanza: una modifica sostanziale crea una
nuova versione. Prompt e contesto hanno digest o riferimento stabile quando disponibili; in caso
contrario si usa `non_noto` con motivazione.

## 4. Oggetti obbligatori

### 4.1 Configurazione agente

```text
agent_config_id:
provider:
model:
model_version_or_snapshot:
runtime:
surface:
reasoning_level:
available_tools: []
tools_actually_used: []
declared_role:
authorization:
  read: []
  write: []
  forbid: []
context_received_refs: []
packages_actually_loaded: []
unknowns_and_limits: []
```

Non dedurre modello, reasoning o strumenti dall'output. `Disponibile` e `usato` sono campi distinti.

### 4.2 Metodologia

```text
method_id:
name:
version:
status: proposed | calibration | prospective | deprecated | retired
sequence: []
criteria_refs: []
checkpoints: []
relationship_with_matteo:
source_use:
uncertainty_handling:
conflict_handling:
verification_form:
applicability_conditions: []
known_non_applicability: []
variants_and_parent_refs: []
owner_ref:
```

Una variante che cambia sequenza, criteri, checkpoint o forma di verifica riceve nuova versione.

### 4.3 Seduta osservata

```text
session_id:
date:
session_family:
declared_role:
agent_config_ref:
method_ref:
objective:
task_definition_ref:
prompt_version_ref:
context_version_refs: []
environment:
authorization_ref:
checkpoints_observed: []
interactions_with_matteo: []
outputs: []
controls_run: []
declared_outcome:
subsequent_review_refs: []
confounders: []
open_items: []
evidence_type: historical | calibration | prospective_instance
completeness: complete | partial | fragmentary | unknown
verification_status: self_report | unverified | independently_verified | contradicted | mixed
comparability: non_comparabile | comparable_with_protocol_ref
source_refs: []
```

### 4.4 Architettura o output

```text
output_id:
output_type: architecture | governance | method | implementation | evidence | register | view
canonical_version:
recipient:
intended_use:
coherence:
coverage:
routability:
maintainability:
verifiability:
metaskillsystem_compatibility:
introduced_debt: []
acceptance_criterion_ref:
verification_or_use_evidence_refs: []
conceived_by:
decided_by:
directed_by:
authored_by:
verified_by: []
owner_ref:
```

Persona, Sistema e Output restano assi separati. Un esito Sistema non dimostra capacità Persona;
un'attività di Matteo non certifica l'agente; l'esistenza di un file non prova il valore dell'output.

### 4.5 Processo di eval

```text
eval_id:
protocol_ref:
observed_session_ref:
observed_agent_config_ref:
observed_method_ref:
observed_output_refs: []
self_report_author:
evaluator:
reviewer:
reviewer_independence:
criteria_frozen_at:
session_started_at:
task_definition_ref:
conditions_ref:
denominator:
criterion_results: []
evidence_refs: []
confounders: []
limits: []
comparison_eligibility:
verdict_ref:
matteo_decision_ref:
```

Ogni `criterion_result` contiene:

```text
criterion_id:
criterion_version:
expected_observation:
outcome: positive | negative | contradicted | not_observed | unknown | not_applicable
numerator:
denominator:
evidence_refs: []
author:
verification_status:
notes:
```

`not_applicable` richiede motivo. `unknown` non viene trasformato in zero. Ogni controllo numerico
ha denominatore maggiore di zero e numeratore coerente.

## 5. Congelamento prospettico

Prima dell'avvio di una seduta valutabile devono esistere e non poter cambiare a caldo:

- protocollo e versione;
- compito e condizioni;
- configurazione agente nota o campi dichiarati `non_noto`;
- metodologia/versione da osservare;
- criteri, denominatore e prove ammesse;
- tutti gli esiti possibili e la conseguenza di ciascuno;
- tetto di ripetizioni anche per esito negativo o grigio;
- ruoli di esecutore, autore self-report, evaluator, revisore e adjudicator;
- regola di contaminazione e materiale escluso;
- criterio di comparabilità.

Se uno di questi elementi viene definito dopo aver visto l'output, la seduta resta calibrazione o
storia. Una correzione utile all'oggetto non salva retroattivamente l'istanza: apre una nuova versione
e una nuova istanza.

## 6. Indipendenza e attribuzione

- `self_report` è sempre attribuito al suo autore e non è verifica.
- Un revisore è indipendente soltanto se non coincide con esecutore, autore del record, autore della
  dichiarazione o soggetto valutato e non ha ricevuto il verdetto atteso quando il protocollo richiede
  cecità.
- Attività, criteri o checkpoint introdotti da Matteo non vengono attribuiti all'agente.
- Testo o struttura materialmente prodotti dall'agente non vengono attribuiti a Matteo; la sua regia,
  decisione o approvazione sono campi separati.
- Una decisione finale resta di Matteo salvo delega esplicita e registrata.

## 7. Comparabilità

Due sedute o metodi sono confrontabili solo se hanno:

1. stesso protocollo e versione, oppure mapping approvato prima delle istanze;
2. compiti equivalenti e condizioni comparabili;
3. configurazioni agente note nelle differenze rilevanti;
4. stessa versione dei criteri;
5. stesso denominatore e stessa politica di esito/ripetizione;
6. prove di qualità equivalente;
7. confondenti registrati e accettati prima del confronto;
8. indipendenza dei revisori compatibile.

In mancanza di una condizione: `comparability: non_comparabile`. Sono comunque ammessi confronti
qualitativi di ipotesi, purché dichiarati come proposte e non come verdetti.

Punteggi aggregati, ranking e classifiche sono vietati finché non esistono un campione sufficiente,
una soglia fissata prima dell'analisi e una decisione esplicita di Matteo.

## 8. G/O/E per regole critiche

Ogni regola critica registra separatamente:

```text
rule_id_version:
G: 0 | 1 | 2
O: 0 | 1 | 2 | 3
E: 0 | 1 | 2 | 3
trigger_event:
decision_or_output_changed:
evidence_refs: []
known_bypasses: []
```

La maturità è il minimo fra G, O ed E. Markdown senza controllo tecnico non supera E1. Un hook
locale o pre-commit non diventa E3 se è aggirabile o non copre tutte le superfici.

## 9. Rettifiche append-only

Un record finalizzato non si cancella e non si riscrive. La rettifica aggiunge:

```text
rectification_id:
target_id:
relation: amends | supersedes_interpretation | contradicts
reason:
changes: []
evidence_refs: []
authored_by:
effective_at:
verification_status:
```

- `amends` corregge campi puntuali.
- `supersedes_interpretation` sostituisce una lettura corrente, non il fatto storico.
- `contradicts` conserva due letture incompatibili con provenienza e data.
- Conflitti non risolti restano espliciti; l'ordine fisico non decide quale versione è vera.
- Una vista può mostrare lo stato corrente soltanto applicando rettifiche risolvibili e attribuite.

## 10. Enforcement dichiarato

| Regola | Stato 0.1.0 | Tipo |
|---|---|---|
| ID e campi presenti nei documenti | verificabile manualmente; nessun validator dedicato | governance soft |
| Separazione self-report/revisione/decisione | verificabile da record, non garantita dalla macchina | governance soft |
| Freeze criterio prima dell'istanza | verificabile da timestamp/fonti se conservati | preflight manuale |
| Comparabilità | giudizio umano con checklist | non enforceable automaticamente |
| Divieto ranking | ricerca testuale possibile, significato ancora umano | governance soft |
| Rettifica append-only | procedura documentale; `mss.session/0.1.1` protegge solo le proprie capsule | governance soft |
| Indipendenza effettiva | richiede identità e controllo del materiale ricevuto | controllo umano |

Il pacchetto non modifica validator, hook o fixture H-1.x. Un futuro enforcement richiede work
package e autorizzazione separati.

## 11. Regola per lo storico

Le sedute anteriori al congelamento di questo contratto sono `historical` o `calibration`, mai eval
retroattive. Il catalogo può descrivere metodi, risultati dichiarati, revisioni e contraddizioni,
ma non assegnare punteggi. Completezza e stato di verifica appartengono a ogni record, non alla
reputazione dell'agente.
