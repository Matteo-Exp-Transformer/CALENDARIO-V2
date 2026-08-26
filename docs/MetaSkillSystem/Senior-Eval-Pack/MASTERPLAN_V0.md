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

## 4. Stato corrente al 21-08-2026

| ID | Work package | Stato corrente | Evidenza e limite |
|---|---|---|---|
| `SEP-0` | Fondazione a cinque file e rotta esterna | `CHIUSO_NEL_DISEGNO` | struttura confermata da Matteo; controlli locali della seduta; review indipendente eseguita con FAIL (vedi `SEP-4`) |
| `SEP-1` | Baseline storica di sedute e metodi | `CHIUSO_NEL_DISEGNO` | record source-derived; lacune e frammenti dichiarati; nessuna eval retroattiva |
| `SEP-2` | Contratto eval senior `0.1.0` | `CHIUSO_NEL_DISEGNO` | schema sperimentale prodotto nella calibrazione; non congelato per uso prospettico |
| `SEP-3` | Bootstrap e prima calibrazione del pacchetto | `CHIUSO_COME_CALIBRAZIONE` | seduta `SEP-SES-20260810-015`; self-report/unverified; non comparabile |
| `SEP-3A` | Handoff operativo permanente | `CHIUSO_NEL_DISEGNO` | seduta `SEP-SES-20260810-016`; sesto documento autorizzato successivamente da Matteo; efficacia futura non osservata |
| `SEP-4` | Revisione indipendente di struttura e contratto | `CHIUSO_COME_CALIBRAZIONE` | review `017` → `SEP-G1_FAIL` (HIGH F01); remediation `018` sanato F01; accettazione formale `020` → **`SEP-G1_PASS_CON_RISERVE`** (Cursor-only; riserve R1–R3); MEDIUM/LOW restano `SEP-D08` |
| `SEP-5` | Freeze del primo protocollo prospettico | `IN_CORSO` | piano operativo AM-01…03 formalizzato su decisione di Matteo 26-08-2026; il 27-08 aggiunge `AM-C0`, calibrazione read-only per testare fonti/STOP prima del freeze reale; `SEP-G2` resta non passato finché cicli, casi, ruoli, esiti e digest dell'istanza non sono congelati prima dell'esecuzione |
| `SEP-6` | Prima eval senior prospettica | `BLOCCATO_DA_GATE` | richiede `SEP-G2`; non può riusare questa calibrazione come campione |
| `SEP-7` | Revisione indipendente della prima eval | `BLOCCATO_DA_GATE` | richiede istanza `SEP-6` finalizzata e materiale di review definito |
| `SEP-8` | Primo confronto controllato | `BLOCCATO_DA_GATE` | richiede almeno due istanze comparabili; vietato anticipare ranking |
| `SEP-9` | Consolidamento del routing | `BLOCCATO_DA_GATE` | richiede evidenza d'uso delle rotte; nessun secondo router senza mandato |
| `SEP-10` | Analisi read-only dell'archiviazione | `CHIUSO_NEL_DISEGNO` | A1–A4 + B1 + B2 (`Report-B2-review-piano-migrazione.md`); B1 self-report «PRONTO PER DECISIONE»; B2 = **`ADEGUATO_CON_RISERVE`** (HIGH B2-F01 M03 link); **nessuna** migrazione; **SEP-G5 non PASS** |
| `SEP-11` | Piano di migrazione controllata | `IN_CORSO` (H-1.3 = **PASS_CON_RISERVE**; track L5 **committed+pushed** `ee0ab39`; prossimo = plan directory) | F1–F4-doc; remediation R01–R05; review post = **PASS_CON_RISERVE** (H13-POST-L01); **SEP-G5 non PASS**; WP-1 **NO-GO**; path L5 invariati; F5/move vietati finché plan directory approvato |
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
| 10-08-2026 | `SEP-11` (pulizia solidi + backlog dedicati) | `IN_CORSO` invariato · bordo pulito; prossimo = **F4-doc** | `Report-sep-11-pulizia-solidi-backlog-dedicati-10-08-26.md` | Meta writer `SEP-AGC-xai-cursor-001` (`SEP-SES-20260810-032`) | A/B/C=Sì; push ahead; go/no-go superseded; dedicati F4-doc · H-1.3/L5 · SEP-5; no F4 exec; G5 non PASS |
| 10-08-2026 | `SEP-11` (F4-doc track Sessioni) | `IN_CORSO` · **F4-doc fatto**; prossimo = **H-1.3/F4-L5** | `Report-sep-11-f4-doc-track-sessioni-10-08-26.md` | Meta writer `SEP-AGC-xai-cursor-001` (`SEP-SES-20260810-033`) | whitelist 11 path tracked; slice A=`032` inclusa; zero path change; zero L5; G5 non PASS; H-1.3 non sanato |
| 10-08-2026 | `SEP-11` (H-1.3 review post-remediation) | `IN_CORSO` · H-1.3 **PASS_CON_RISERVE**; WP-1 NO-GO | `Report-revisione-indipendente-h13-post-remediation-10-08-26.md` | Verifica senior indipendente `SEP-AGC-xai-cursor-001` (`SEP-SES-20260810-034`) | controprove R01–R03 tengono; riserva H13-POST-L01; G5 non PASS; zero fix |
| 10-08-2026 | `SEP-11` (track/commit baseline L5) | `IN_CORSO` · track L5+hook+report **pushed** `ee0ab39`; prossimo = **plan directory** | `Report-track-commit-h13-l5-pass-con-riserve-10-08-26.md` | Meta writer `SEP-AGC-xai-cursor-001` (`SEP-SES-20260810-035`) | path invariati; PASS_CON_RISERVE; WP-1 NO-GO; G5 non PASS; commit+push fatti |
| 10-08-2026 | `SEP-11` (prepara plan directory) | `IN_CORSO` · prompt plan directory pronto; zero move | `Prompt-plan-directory-export-sandbox-mss-10-08-26.md` | Meta prepara `SEP-AGC-xai-cursor-001` (`SEP-SES-20260810-036`) | FU-SEP-11-DIR-PLAN aperto; F5 exec non avviato; WP-1 chiuso |
| 21-08-2026 | `SEP-11` (chiusura documentale preparazione `036`) | `IN_CORSO` invariato · fonti vive allineate; prossimo = **plan directory** | `Report-chiusura-documentale-preparazione-036-21-08-26.md` | Meta documentation closure (`SEP-SES-20260821-037`) | corretti riferimenti superati; roadmap/handoff/prompt coerenti; zero F5/move/sandbox; pubblicazione docs non eseguita |
| 21-08-2026 | `SEP-11` (plan directory) | `IN_CORSO` invariato · **plan prodotto**, zero move; D9 decisa ed eseguita | `Report-plan-directory-export-sandbox-mss-21-08-26.md` | Meta plan `SEP-AGC-anthropic-claudecode-001` (`SEP-SES-20260821-038`) | albero/export/sandbox progettati; `PLAN-F01` HIGH (accoppiamento per profondità); D6/D7/D8/D10 aperte; SEP-G5 non PASS |
| 21-08-2026 | §7 (rettifica di coerenza) | nessun cambio di stato · **due righe rettificate** | `MAPPA-MSS-consulenza-esterna-21-08-26.md` §7 · `Report-consulenza-esterna-fable-mss-21-08-26.md` | Consulente esterno `SEP-AGC-anthropic-fable-001` (`SEP-SES-20260821-039`) | §7 dichiarava H-1.3 `FAIL` contro §4/§6/§4-bis dello stesso file, e accusava `PLAN_V0` di essere stale quando non lo era; rettifica **append**, testo originale barrato e conservato; nessun gate dichiarato |
| 26-08-2026 | `SEP-5` | `BLOCCATO_DA_GATE` → `IN_CORSO` | `PIANO_MEMORIA_OPERATIVA_AGENTE_MATTEO_V0.md` + report piano operativo 26-08-26 | Meta senior Codex (`SEP-SES-20260826-040`) | Matteo ratifica la direzione «Agente Matteo»; AM-01/02/03 ricevono formato prospettico completo. Mancano ancora freeze specifici di tre cicli, cinque casi e revisore: `SEP-G2` non passa e nessuna eval parte. |

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

**Immediato:** eseguire prima la calibrazione read-only `AM-C0`: analisi di solidità del pacchetto,
intervista di Matteo sulle sole fonti di metodo e decisione autorizzate, chiave sigillata di cinque
casi e review Codex cieca delle risposte Cursor Base/Pacchetto. La forma è in
`PROTOCOLLO_CALIBRAZIONE_ALLINEAMENTO_AM_V0.md`. Se la calibrazione mostra fonti insufficienti,
conflitti o STOP mancanti, correggere il pacchetto e non congelare istanze reali. Soltanto dopo
questa decisione si congelano tre aperture/modifiche Servizio reali, cinque casi AM-03, ruoli,
fonti, esiti, tetto di ripetizione e digest. Non avviare `SEP-6`.

**H-1.3 = `PASS_CON_RISERVE`** (review `034`; riserva H13-POST-L01). **Non** è PASS pulito.
**WP-1 = NO-GO** (non aprire). **SEP-G5 non PASS**.

**Backlog dedicati (max 3 vivi):** (1) ~~F4-doc~~ · (2) ~~H-1.3 remediation+review+track `ee0ab39`~~ ·
(3) freeze prospettico AM (`SEP-5` in corso); il piano directory/export/sandbox resta storia
congelata e non autorizza move/F5.
`SEP-D08` resta debito pack, **non** prossimo atomico.

**Fatto in track `035`:** whitelist L5 + 2 hook + report/prompt H-1.3 **committed+pushed**
(`ee0ab39`); path invariati; `test:mss` verde al track. Stash@{0} intatto (rumore Comunicazione).

**Fatto in prepara `036`:** prompt plan directory scritto; FU-SEP-11-DIR-PLAN aperto; HANDOFF SHA
allineato a `ee0ab39`.

**Fatto in chiusura documentale `037`:** rimossi i riferimenti operativi superati, roadmap e
handoff riallineati, report/capsula e indici aggiunti. Nessuna modifica allo stato di `SEP-11`,
nessun F5 e nessuna sandbox creata.

**Fatto in review `034`:** controprove R01–R03 indipendenti; verdetto **PASS_CON_RISERVE**;
WP-1 NO-GO; zero fix.

**Fatto in remediation H13:** restore whitelist L5 (no stash pop); fix R01–R05; 2 hook;
suite 41+32 verde.

**Fatto in `033`:** track whitelist Sessioni MSS (11 path) + slice A docs `032`/owner;
**zero** L5 nello stage F4; G5 non PASS.

**Fatto in `032`:** A/B/C = Sì; **push** ahead su `env/test`; solidi chiusi.

**Vietato senza nuovo mandato:** claim H-1.3 PASS *pulito* (senza riserve); path rewrite / F5;
move; `_lavoro`; claim SEP-G5 PASS; WP-1; SEP-5 auto; stash drop senza Sì.

**Non automatico:** `SEP-5` è in corso solo come disegno del freeze; richiede ancora decisioni
specifiche di Matteo per superare `SEP-G2` o aprire un'istanza.

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
- ~~Il verdetto corrente H-1.3 resta `FAIL`; remediation e nuova review sono fuori perimetro.~~
  **RETTIFICATO 21-08-26:** H-1.3 è `PASS_CON_RISERVE` dal 10-08-26 (review `034`, riserva
  `H13-POST-L01`), come già dichiarato da §4 riga `SEP-11`, da §6 e dal registro §4-bis di **questo
  stesso file**. La riga barrata era rimasta congelata a prima della review ed è stata segnalata dal
  test a freddo della consulenza esterna: un agente che entrava dalla rotta «dipendenze» leggeva
  `FAIL`, uno che entrava dalla tabella di stato leggeva `PASS_CON_RISERVE`. Resta vero che
  remediation e nuova review sono fuori perimetro del pacchetto.
- ~~`../PLAN_V0.md` descrive ancora uno stato precedente a H-1.3. Questa divergenza è registrata come
  vincolo esterno e non viene corretta senza mandato sullo stato globale.~~
  **RETTIFICATO 21-08-26:** la divergenza **non esiste più**. `../PLAN_V0.md` riporta `H-1.3` =
  `PASS_CON_RISERVE` nella tabella §4 e nel log §14 dal 10-08-26. Questa nota di debito si era
  auto-fossilizzata: descriveva un disallineamento già sanato e induceva a diffidare dell'owner
  globale senza motivo.
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

- scelte sul **plan directory/export/sandbox**: albero target, contenuto export, forma della sandbox
  e ordine delle eventuali fasi esecutive; nessun F5 prima dell'approvazione;
- calibrazione `AM-C0`: fonti autorizzate, cinque chiavi, configurazione Cursor comparabile e revisore Codex cieco;
- tre cicli Servizio reali, cinque casi AM-03 e configurazione della prima istanza (`SEP-5`/`SEP-G2`), solo dopo la calibrazione;
- ruoli evaluator/revisore, esiti, conseguenze e tetto delle ripetizioni da congelare;
- eventuale autorizzazione a nuovo enforcement (F02/F03) o remediation `SEP-D08`;
- soglia qualitativa per promuovere il pacchetto da sperimentale ad affidabile;
- eventuale riapertura indipendenza forte se diventa disponibile un AGC/modello distinto;
- allineo `PLAN_V0` / WP-1 (fuori da questa corsia).

**Decisioni già prese (non riaprire senza nuova evidenza):**
`SEP-G1_PASS_CON_RISERVE` + Cursor-only (`020`); priorità post-gate = `SEP-10` (plan
`.cursor/plans/sep-10_archiviazione_mss_430c9c1d.plan.md` — **tenere**, non rifare);
allineamento method_ref `015` → `SEP-MET-foundation-co-design-0.1` (remediation `018`);
rimando soft `019` superato dalla formalizzazione `020`;
**D1–D5** (`024`): F1+F2 · slice track · `archive/` · freeze L5 · TTL redirect 30gg;
**F3** eseguito+committed+**review ADEGUATO** (`028`–`031`);
**A/B/C pulizia `032`:** push sì · F4-doc dedicato sì · corsia H-1.3/L5 sì;
go/no-go generico **superseded** da backlog dedicati;
**F4-doc `033`:** A = includi slice `032` nello stesso perimetro commit; whitelist tracked.

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
