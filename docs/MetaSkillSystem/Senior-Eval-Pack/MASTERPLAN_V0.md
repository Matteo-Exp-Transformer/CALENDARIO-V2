# Masterplan — Senior Eval Pack v0

> **Package:** `mss.senior-eval-pack/0.1.0` · **Stato del pacchetto:** gate
> **`SEP-G1_PASS_CON_RISERVE`** accettato da Matteo il 10-08-2026 (convalida Cursor-only; indipendenza
> **non** piena). HIGH `SEP-F01` sanato; debito MEDIUM/LOW `SEP-D08` ancora aperto.
> **Owner:** questo file è l'unico proprietario di stato, gate, debito e prossimo passo interni.
> Lo stato globale di `SYS-1` resta esclusivamente in `../PLAN_V0.md`.

## 1. Mandato

Costruire un sottosistema documentale che consenta di:

1. ricostruire con provenienza come configurazioni senior e metodologie hanno lavorato;
2. distinguere storia, calibrazione ed eval prospettica;
3. valutare seduta, metodo e output senza fondere Persona, Sistema e Output;
4. rettificare interpretazioni senza riscrivere il passato;
5. arrivare, soltanto dopo gate espliciti, a confronti controllati e non classificatori.

Il pacchetto non valuta il valore personale o professionale di Matteo, non assegna livelli agli
agenti, non sana H-1.3 e non apre `WP-1`.

## 2. Principi di governo

- **Owner unico:** questo masterplan possiede lo stato interno; la roadmap è soltanto una vista.
- **Continuità derivata:** l'handoff possiede il passaggio operativo, non stato o gate; in caso di
  divergenza vince questo masterplan.
- **Prospettico prima del comparativo:** nessuna eval valida nasce da criteri formulati dopo
  l'output.
- **Provenienza prima della sintesi:** self-report, osservazione, verifica e decisione restano
  attribuiti.
- **Il negativo conta:** esiti negativi, contraddetti, ignoti e non osservati non vengono rimossi né
  convertiti in successi.
- **Revisione distinta:** chi costruisce o conduce non può autocertificare l'indipendenza.
- **Nessun trascinamento di autorità:** il pacchetto non modifica kernel, validator, hook, fixture,
  manifest o piano globale.

## 3. Stati ammessi

| Stato | Significato |
|---|---|
| `NON_INIZIATO` | lavoro autorizzabile ma non avviato |
| `IN_CORSO` | lavoro aperto con output non ancora chiudibile |
| `CHIUSO_NEL_DISEGNO` | artefatto documentale presente; efficacia non dimostrata |
| `CHIUSO_COME_CALIBRAZIONE` | flusso esercitato, ma non produce una eval comparabile |
| `BLOCCATO_DA_GATE` | dipendenza o decisione esplicita ancora mancante |
| `CONTRADDETTO` | una verifica successiva invalida il precedente esito senza cancellarlo |

Questi stati valgono soltanto per i work package elencati qui e non aggiornano `SYS-1`.

## 4. Stato corrente al 10-08-2026

| ID | Work package | Stato corrente | Evidenza e limite |
|---|---|---|---|
| `SEP-0` | Fondazione a cinque file e rotta esterna | `CHIUSO_NEL_DISEGNO` | struttura confermata da Matteo; controlli locali della seduta; review indipendente eseguita con FAIL (vedi `SEP-4`) |
| `SEP-1` | Baseline storica di sedute e metodi | `CHIUSO_NEL_DISEGNO` | record source-derived; lacune e frammenti dichiarati; nessuna eval retroattiva |
| `SEP-2` | Contratto eval senior `0.1.0` | `CHIUSO_NEL_DISEGNO` | schema sperimentale prodotto nella calibrazione; non congelato per uso prospettico |
| `SEP-3` | Bootstrap e prima calibrazione del pacchetto | `CHIUSO_COME_CALIBRAZIONE` | seduta `SEP-SES-20260810-015`; self-report/unverified; non comparabile |
| `SEP-3A` | Handoff operativo permanente | `CHIUSO_NEL_DISEGNO` | seduta `SEP-SES-20260810-016`; sesto documento autorizzato successivamente da Matteo; efficacia futura non osservata |
| `SEP-4` | Revisione indipendente di struttura e contratto | `CHIUSO_COME_CALIBRAZIONE` | review `017` → `SEP-G1_FAIL` (HIGH F01); remediation `018` sanato F01; accettazione formale `020` → **`SEP-G1_PASS_CON_RISERVE`** (Cursor-only; riserve R1–R3); MEDIUM/LOW restano `SEP-D08` |
| `SEP-5` | Freeze del primo protocollo prospettico | `BLOCCATO_DA_GATE` | gate G1 accettato con riserve **non** apre automaticamente SEP-5; servono ancora decisioni preventive di Matteo sul freeze |
| `SEP-6` | Prima eval senior prospettica | `BLOCCATO_DA_GATE` | richiede `SEP-G2`; non può riusare questa calibrazione come campione |
| `SEP-7` | Revisione indipendente della prima eval | `BLOCCATO_DA_GATE` | richiede istanza `SEP-6` finalizzata e materiale di review definito |
| `SEP-8` | Primo confronto controllato | `BLOCCATO_DA_GATE` | richiede almeno due istanze comparabili; vietato anticipare ranking |
| `SEP-9` | Consolidamento del routing | `BLOCCATO_DA_GATE` | richiede evidenza d'uso delle rotte; nessun secondo router senza mandato |
| `SEP-10` | Analisi read-only dell'archiviazione | `CHIUSO_NEL_DISEGNO` | A1–A4 + B1 + B2 (`Report-B2-review-piano-migrazione.md`); B1 self-report «PRONTO PER DECISIONE»; B2 = **`ADEGUATO_CON_RISERVE`** (HIGH B2-F01 M03 link); **nessuna** migrazione; **SEP-G5 non PASS** |
| `SEP-11` | Piano di migrazione controllata | `IN_CORSO` (F3+review ADEGUATO **committed**; go/no-go aperto) | F1+F2 (`025`); D2 `6336c19`; B2-F01 (`026`); go/no-go F3 (`027`); F3 M03 (`028`); prepara+commit (`029`); review (`030` **ADEGUATO**); prepara+commit review (`031`); **SEP-G5 non PASS**; push no; F4 non eseguito |
| `SEP-12` | Promozione da sperimentale ad affidabile | `BLOCCATO_DA_GATE` | richiede review, uso prospettico, debiti accettati e decisione esplicita di Matteo |

### 4-bis. Registro append-only delle transizioni WP

> Anti-overwrite silenzioso della sola cella corrente (mitigazione minima finding `SEP-F05`).
> Non sostituisce i report; non dichiara gate.

| Data | WP | Da → A | Fonte | Autore | Motivo |
|---|---|---|---|---|---|
| 10-08-2026 | `SEP-4` | `NON_INIZIATO` → `CHIUSO_COME_CALIBRAZIONE` | `Report-revisione-indipendente-sep4-senior-eval-pack-metaskillsystem-10-08-26.md` + `Report-remediation-sep-f01-post-sep4-metaskillsystem-10-08-26.md` | writer remediation `SEP-AGC-xai-cursor-001` (`SEP-SES-20260810-018`) | review indipendente eseguita con `SEP-G1_FAIL`; F01 sanato; gate resta FAIL fino a ri-review |
| 10-08-2026 | `SEP-G1` (gate) | FAIL / rimando soft → **`PASS_CON_RISERVE`** | `Report-accettazione-sep-g1-pass-con-riserve-cursor-only-10-08-26.md` | Meta writer `SEP-AGC-xai-cursor-001` (`SEP-SES-20260810-020`) | decisione Matteo Cursor-only; riserve R1 indipendenza soft, R2 debito D08, R3 enforcement soft; **non** PASS pulito |
| 10-08-2026 | `SEP-10` | `NON_INIZIATO` → `IN_CORSO` | plan `sep-10_archiviazione_mss_430c9c1d` + report A1–A4 in `docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/` | Meta writer `SEP-AGC-xai-cursor-001` (`SEP-SES-20260810-021`) | sola analisi read-only; zero migrazione/cutover |
| 10-08-2026 | `SEP-10` | `IN_CORSO` → `CHIUSO_NEL_DISEGNO` | `Report-B1-sintesi-piano-migrazione.md` (punti 1–10 + telemetria) | Meta writer `SEP-AGC-xai-cursor-001` (`SEP-SES-20260810-022`) | sintesi piano PRONTO PER DECISIONE; zero rename/move; B2 e SEP-11 non avviati |
| 10-08-2026 | `SEP-10` (review B2) | `CHIUSO_NEL_DISEGNO` (invariato) + nota B2 | `Report-B2-review-piano-migrazione.md` | Verifica revisore `SEP-AGC-xai-cursor-001` (`SEP-SES-20260810-023`) | verdetto `ADEGUATO_CON_RISERVE`; HIGH B2-F01; **SEP-G5 non PASS**; zero rename/move; SEP-11 resta bloccato |
| 10-08-2026 | `SEP-11` (decisioni) | `BLOCCATO_DA_GATE` → `NON_INIZIATO` con perimetro F1+F2 autorizzato | `Report-decisioni-d1-d5-perimetro-sep11-f1-f2-10-08-26.md` | Meta registrar `SEP-AGC-xai-cursor-001` (`SEP-SES-20260810-024`) | D1=b · D2=c · D3=a · D4=a · D5=a; F3 bloccato (B2-F01); zero rename/move in `024` |
| 10-08-2026 | `SEP-11` (F1+F2) | `NON_INIZIATO` → `IN_CORSO` (F1+F2 chiusi; F3+ aperti solo dopo B2-F01) | `Report-sep-11-f1-f2-archive-shell-indice-10-08-26.md` | Meta writer `SEP-AGC-xai-cursor-001` (`SEP-SES-20260810-025`) | create-only archive shell + indice; zero move; D2 slice staged; SEP-G5 non PASS |
| 10-08-2026 | `SEP-11` (B2-F01 / D09) | `IN_CORSO` invariato · debito D09 → inventario completo | `Addendum-M03-link-REPORT_001-B2-F01-10-08-26.md` + report remediation `026` | Meta writer `SEP-AGC-xai-cursor-001` (`SEP-SES-20260810-026`) | `rg` completo; M03 supersede; policy PLAN_V0 leave-as-history; **F3 non autorizzato**; SEP-G5 non PASS |
| 10-08-2026 | `SEP-11` (go/no-go + mandato F3) | `IN_CORSO` · F3 **autorizzato** (non eseguito) | `Report-go-nogo-b2-f01-e-mandato-f3-10-08-26.md` + `Prompt-sep-11-f3-move-report001-10-08-26.md` | Meta go/no-go+prepara `SEP-AGC-xai-cursor-001` (`SEP-SES-20260810-027`) | review `026` ADEGUATO; commit remediation; no push; F3 solo in chat nuova col prompt |
| 10-08-2026 | `SEP-11` (F3 / M03) | `IN_CORSO` · **F3 eseguito**; G5 non PASS | `Report-sep-11-f3-move-report001-10-08-26.md` | Meta writer F3 `SEP-AGC-xai-cursor-001` (`SEP-SES-20260810-028`) | `git mv` → `archive/osservazioni/`; stub D5 al path vecchio; L1+L2 update; PLAN leave-as-history; no push; no G5 PASS |
| 10-08-2026 | `SEP-11` (post-F3 prepara+commit) | `IN_CORSO` · F3 **committed**; prossimo = review breve | `Report-prepara-post-f3-allineo-commit-10-08-26.md` + `Prompt-sep-11-post-f3-review-breve-10-08-26.md` | Meta prepara `SEP-AGC-xai-cursor-001` (`SEP-SES-20260810-029`) | allineo docs; prompt review; commit F3; no push; SEP-G5 non PASS |
| 10-08-2026 | `SEP-11` (post-F3 review breve) | `IN_CORSO` · F3 **review ADEGUATO**; prossimo = stop/decisione Matteo | `Report-sep-11-post-f3-review-breve-10-08-26.md` | Verifica revisore `SEP-AGC-xai-cursor-001` (`SEP-SES-20260810-030`) | checklist path/stub/L1-L2/PLAN/rg; G5 non PASS; no push; no F4 |
| 10-08-2026 | `SEP-11` (post-review prepara+commit) | `IN_CORSO` · review **committed**; prossimo = go/no-go | `Report-prepara-post-f3-review-chiusura-commit-10-08-26.md` + `Prompt-sep-11-go-nogo-post-f3-review-10-08-26.md` | Meta prepara `SEP-AGC-xai-cursor-001` (`SEP-SES-20260810-031`) | commit review; prompt A/B/C/D; no push; no F4 exec; SEP-G5 non PASS |

## 5. Gate

### `SEP-G1` — contratto revisionabile

Si supera soltanto quando una revisione indipendente:

- ricostruisce requisiti, owner e confini senza usare il verdetto atteso;
- tenta controesempi su freeze, attribuzione, comparabilità, rettifiche e indipendenza;
- non lascia finding HIGH irrisolti;
- separa difetti del contratto da difetti di una futura implementazione;
- produce un verdetto attribuito e fonti riproducibili.

### `SEP-G2` — protocollo prospettico congelato

Si supera soltanto quando, **prima** della seduta, Matteo approva o delega esplicitamente:

- compito, condizioni, configurazione nota/non nota e metodo/versione;
- criteri, denominatore, prove ammesse ed esiti possibili;
- conseguenza di ogni esito e tetto delle ripetizioni;
- ruoli separati, regola di contaminazione e materiale escluso;
- criterio di comparabilità e timestamp/digest del freeze.

### `SEP-G3` — istanza valutabile

Si supera soltanto se l'esecuzione non cambia a caldo il protocollo, conserva gli eventi necessari,
registra scostamenti e produce un record completo. Un cambio sostanziale chiude l'istanza come
calibrazione e apre una nuova versione.

### `SEP-G4` — confronto controllato

Si supera soltanto con almeno due istanze che soddisfano la checklist di comparabilità del contratto,
revisione indipendente compatibile e decisione preventiva di Matteo sulla forma della sintesi. Il
gate non autorizza automaticamente punteggi aggregati o classifiche.

### `SEP-G5` — migrazione autorizzabile

Si supera soltanto dopo analisi read-only, mappa source→target, owner, rollback, privacy, test e
conferma esplicita del perimetro di scrittura. Fino ad allora l'archivio resta invariato.

## 6. Prossimo passo atomico

**Immediato:** **go/no-go** col prompt
`docs/Sessioni di lavoro/10-08-26/Prompt-sep-11-go-nogo-post-f3-review-10-08-26.md`
(oppure **stop**). Opzioni: (A) push · (B) F4-doc · (C) F4-L5-track · (D) stop.
**Non** eseguire F4 in automatico. **SEP-G5 non PASS**. **Push no** finché Matteo non dice Sì.

F3 review (`030`) ADEGUATO e committed (`031`): path/stub/L1-L2/PLAN ok.

**Vietato senza nuovo mandato:** esecuzione F4; altri move; touch path L5; `_lavoro`;
rewrite stato `PLAN_V0`; claim SEP-G5 PASS; sanatoria H-1.3; WP-1; SEP-5; F5+.

**Non automatico:** `SEP-5` resta bloccato da decisioni freeze separate.

**Decisione Matteo 10-08-2026 (CHIUSA — non riaprire senza nuova evidenza):**
accetta `SEP-G1_PASS_CON_RISERVE` con convalida **Cursor-only** (nessun budget per altri modelli);
vuole proseguire oltre il blocco indipendenza. Fonte:
`docs/Sessioni di lavoro/10-08-26/Report-accettazione-sep-g1-pass-con-riserve-cursor-only-10-08-26.md`.

**Decisione Matteo 10-08-2026 (CHIUSA — D1–D5):** D1=(b) F1+F2 · D2=(c) slice track pack+analisi ·
D3=(a) `archive/` nuovo · D4=(a) freeze L5 · D5=(a) TTL 30gg + `rg` zero. Fonte: report `024`.

**Decisione Matteo 10-08-2026 (CHIUSA — go/no-go F3):** no push; commit remediation `026`;
**F3 autorizzato** per chat nuova col prompt file (`027`). Fonte: report `027`.

**Esecuzione F3:** chat `028` (questo ciclo) — mandato prompt `027` rispettato.

**Storia (non rivivere come blocco):** rimando soft di `019` e bozza Ask BLOCKED erano contesto;
il verdetto formale vive nel report `020`.

**Riserve vive del gate:** R1 indipendenza soft stesso AGC · R2 debito `SEP-D08` · R3 enforcement
freeze/attribuzione soft.

## 7. Dipendenze e vincoli esterni

- `mss.session/0.1.1` è referenziato per la capsula, non posseduto.
- Il verdetto corrente H-1.3 resta `FAIL`; remediation e nuova review sono fuori perimetro.
- `../PLAN_V0.md` descrive ancora uno stato precedente a H-1.3. Questa divergenza è registrata come
  vincolo esterno e non viene corretta senza mandato sullo stato globale.
- `WP-1` resta non autorizzato; nessun record di questo pacchetto lo apre implicitamente.
- Le fonti private restano nei loro owner: il catalogo conserva solo puntatori e limiti.

## 8. Debito e rischi aperti

| ID | Debito/rischio | Trattamento richiesto |
|---|---|---|
| `SEP-D01` | contratto scritto dallo stesso agente che fonda il pacchetto | review `SEP-4` eseguita; gate accettato **con riserve** (`PASS_CON_RISERVE`); debito di provenienza resta |
| `SEP-D08` | finding MEDIUM/LOW aperti post-SEP-4 (`SEP-F02`…`SEP-F09` escluso F01 sanato) | debito accettato; riserva R2 del gate; remediation ampia fuori perimetro corrente |
| `SEP-D02` | ricostruzione storica basata in larga parte su report degli esecutori | mantenere stati di verifica e cercare prove primarie soltanto quando autorizzato |
| `SEP-D03` | report autonomi H-1 iniziale/H-1.2 non trovati | conservare record frammentari; non colmare per inferenza |
| `SEP-D04` | nessun validator dedicato al contratto eval senior | dichiarare enforcement soft; futuro WP separato se autorizzato |
| `SEP-D05` | rischio di confondere CFG E1–E5 con una scala comparativa senior | mantenere domini distinti e nessun riuso senza nuovo protocollo |
| `SEP-D06` | roadmap potrebbe diventare un secondo owner | aggiornare la vista solo dopo il masterplan e senza stati vivi |
| `SEP-D07` | handoff attivo stale o trasformato in secondo masterplan | aggiornamento obbligatorio dopo report/verifiche; masterplan prevale su ogni divergenza |
| `SEP-D09` | B2-F01: M03 `link_da_aggiornare` incompleto (CATALOGO + PLAN_V0) | **inventario sanato** (`026`); mandato F3 (`027`); **F3 eseguito** (`028`); review **ADEGUATO** (`030`); stub D5 attivo; PLAN leave-as-history |

## 9. Decisioni aperte e condizioni operative

Decisioni ancora appartenenti a Matteo:

- esito post-F3 — **review ADEGUATO** (`030`) + commit (`031`); resta go/no-go A/B/C/D;
- push dei commit locali — **no** finché non lo chiede (prompt go/no-go);
- compito e configurazione della prima eval prospettica (`SEP-5`/`SEP-G2`);
- criteri, conseguenze e tetto delle ripetizioni da congelare;
- eventuale autorizzazione a nuovo enforcement (F02/F03) o remediation `SEP-D08`;
- soglia qualitativa per promuovere il pacchetto da sperimentale ad affidabile;
- eventuale riapertura indipendenza forte se diventa disponibile un AGC/modello distinto;
- corsia separata H-1.3 / allineo `PLAN_V0` / WP-1.

**Decisioni già prese (non riaprire senza nuova evidenza):**
`SEP-G1_PASS_CON_RISERVE` + Cursor-only (`020`); priorità post-gate = `SEP-10` (plan
`.cursor/plans/sep-10_archiviazione_mss_430c9c1d.plan.md` — **tenere**, non rifare);
allineamento method_ref `015` → `SEP-MET-foundation-co-design-0.1` (remediation `018`);
rimando soft `019` superato dalla formalizzazione `020`;
**D1–D5** (`024`): F1+F2 · slice track · `archive/` · freeze L5 · TTL redirect 30gg;
**no push** (`027`/`029`/`030`/`031`); **F3** eseguito+committed+**review ADEGUATO**;
prompt **go/no-go** pronto (`031`).

**Pausa:** fermarsi su conflitto di owner, mutazione post hoc del protocollo, fonte privata non
autorizzata, finding HIGH, contaminazione della review o necessità di scrivere fuori perimetro.

**Revisione:** è obbligatoria prima del freeze prospettico, dopo la prima eval e dopo ogni modifica
sostanziale a contratto, comparabilità o routing.

**Chiusura:** un work package chiude soltanto con output presente, fonti e limiti dichiarati,
controlli previsti eseguiti e gate soddisfatto. Il pacchetto può diventare affidabile solo dopo
almeno un ciclo prospettico revisionato, debiti critici risolti/accettati e decisione di Matteo.

**Crescita:** nuovi record entrano nel catalogo; nuove regole versionano il contratto; nuovi stati
entrano qui; nuove viste derivano dagli owner. L'handoff viene aggiornato per ultimo e punta agli
artefatti appena finalizzati. Non si creano file sciolti quando un owner esistente può contenere il
dato.

## 10. Regola di aggiornamento

Ogni cambio di stato aggiunge data, fonte, autore e motivo in questo file o in un registro futuro
esplicitamente promosso a owner. Una rettifica non cancella lo stato storico. `ROADMAP_V0.md` può
essere riallineata dopo il cambio, ma non può anticiparlo né contraddirlo.
