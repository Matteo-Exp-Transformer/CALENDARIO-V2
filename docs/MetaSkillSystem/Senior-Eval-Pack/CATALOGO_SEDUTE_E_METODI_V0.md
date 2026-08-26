# Catalogo sedute e metodi — baseline storica v0

> **Package:** `mss.senior-eval-pack/0.1.0` · **Stato:** baseline storica sperimentale.
> **Owner:** questo file possiede record e rettifiche della catalogazione, non lo stato del cantiere.
> Per lo stato vivo leggere `MASTERPLAN_V0.md`.

## 1. Regole di lettura

- I record sono sintesi con puntatori: non sostituiscono report, prompt o prove.
- Tutte le sedute qui catalogate sono `non_comparabile`: il contratto eval senior non era congelato
  prima della loro esecuzione.
- `Self-report`, revisione indipendente e decisione di Matteo restano distinti.
- Un risultato dichiarato verde resta storico anche quando una revisione successiva lo contraddice.
- Non sono presenti punteggi, ranking o inferenze psicologiche.
- Materiale privato è soltanto referenziato quando la fonte pubblica ne dichiara l'esistenza; non è
  stato copiato né usato per costruire questo catalogo.

## 2. Configurazioni agente osservate

### `SEP-AGC-openai-codex-001`

- Provider/modello: OpenAI · GPT-5; versione/snapshot non esposti.
- Runtime/superficie: Codex · workspace locale/API.
- Ragionamento: modalità di seduta deep/Meta quando dichiarata; parametro runtime non noto.
- Ruoli osservati: coordinatore Meta, writer, supervisor/implementer, revisore indipendente.
- Strumenti realmente registrati: PowerShell, Git, `apply_patch`, Node.js, TypeScript, ESLint,
  Vitest; insieme variabile per seduta.
- Limite: la stessa etichetta modello non rende comparabili sedute con prompt, contesto, ruolo e
  strumenti diversi.

### `SEP-AGC-xai-cursor-001`

- Provider/modello: xAI/Cursor · Cursor Grok 4.5; snapshot non esposto.
- Runtime/superficie: Cursor Agent.
- Ragionamento: sedute deep dichiarate; parametro runtime non noto.
- Ruoli osservati: prepara-prompt/capture, conduttore elicitation/capture.
- Strumenti realmente registrati nelle capsule: variabili per seduta; dettaglio nelle fonti.
- Limite: output valutativi e self-report personali restano fuori dal perimetro di questo catalogo.

### `SEP-AGC-unknown-c9-001`

- Provider, modello, runtime e reasoning: non ricostruiti dalla fonte consultata.
- Ruolo osservato: agente in prova, seguito da valutatore distinto.
- Uso: solo precedente causale del cantiere; non confrontare con le configurazioni sopra.

## 3. Metodologie osservate

### `SEP-MET-foundation-co-design-0.1`

- Sequenza: ricognizione dall'alto → immagini/obiettivi di Matteo → traduzione in contratti →
  checkpoint progressivi → collaudi freddi → correzione → handoff.
- Criteri ripetuti: macro prima dei micro; owner unico; Persona/Sistema/Output separati; G/O/E;
  nessuna osservazione come dato valido.
- Valore osservabile: ha prodotto il primo disegno instradabile e ha lasciato che due collaudi
  smentissero la bozza.
- Limite: metodo e oggetto sono nati insieme; calibrazione, non eval.

### `SEP-MET-contract-writer-0.1`

- Sequenza: caricare owner → chiudere un work package delimitato → scrivere contratto/protocollo →
  fixture di forma → controlli mirati → report/handoff.
- Criteri: versionamento, append-only, protocollo fissato prima dell'istanza, buchi dichiarati.
- Valore osservabile: ha separato light e Markdown, fissato 20 target e 14 fixture.
- Limite: verifiche prevalentemente self-report e di forma.

### `SEP-MET-counterexample-hardening-0.1`

- Sequenza: riprodurre falsi positivi prima del fix → chiarire contratto owner → implementazione
  mirata → regressioni permanenti → suite/adapter/hook → report dei bypass.
- Criteri: denominatori espliciti, codici regola stabili, parità superfici, nessuna sovradichiarazione
  CI/E3, suite senza rewrite.
- Valore osservabile: ogni ciclo ha trovato e chiuso classi reali di falsi positivi.
- Limite: l'implementatore ha anche prodotto il self-report; chiusure successive sono state
  contraddette da revisioni più forti.

### `SEP-MET-independent-adversarial-review-0.1`

- Sequenza: fotografia Git → contratto ricostruito dalle fonti → matrice requisito/prova →
  controprove isolate → gate e benchmark → findings per severità → verdetto unico.
- Criteri: nessuna fiducia nel riepilogo; stesso input su superfici; casi storici/path/stage atomico;
  separazione problemi globali e perimetro.
- Valore osservabile: ha trovato due HIGH e tre finding non rilevati dalla suite verde.
- Limite: una sola revisione H-1.3; non è un confronto tra senior.

### `SEP-MET-cfg00-roleplay-0.1`

- Sequenza: lettura idiografica → roleplay della voce → correzioni live di Matteo → spunto privato →
  capsula ombra.
- Valore osservabile: ha mostrato che documenti di metodo e ritmo quotidiano non sono equivalenti.
- Limite: criterio raffinato durante la seduta; non comparabile.

### `SEP-MET-cfg01-elicitation-0.1`

- Componenti: PEACE, Cognitive Interview semplificata, McAdams, 5P non clinica, Challenge
  post-account, scenari inventati.
- Evoluzione osservata: rimosso il precarico della trama precedente; Challenge ammessa solo su
  incoerenze dette da Matteo e in linguaggio concreto.
- Valore osservabile: i rifiuti e le correzioni sono diventati dati sul metodo.
- Limite: configurazione corretta durante S-C/S-D; calibrazione.

### `SEP-MET-cfg02-measured-0.1`

- Sequenza: misura/costrutto dichiarati prima → eval E1–E5 → stimolo → account libero → deepen →
  Challenge controllata → verbatim-fonte → ponte additivo.
- Valore osservabile: in S-F l'apertura non ha richiesto correzioni; attribuzione di idee e decisioni
  più chiara.
- Limite: eval E1–E5 riguarda la seduta di elicitation, non è un protocollo di confronto senior.

## 4. Record storici per seduta

### `SEP-SES-20260809-000` — precedente causale C9

- Data/tipo/ruolo: 09-08-26 · collaudo cieco del binario valutazione · agente in prova + valutatore.
- Obiettivo/contesto: verificare cinque controlli di routing/owner/LOCK con chiave fissata prima.
- Metodo/checkpoint: esecuzione cieca → transcript → valutazione C1–C5 → ripristino separato degli
  edit dell'istanza.
- Output/verifiche/esito dichiarato: verdetto `fallisce 1/5`; file ripristinati e ricontrollati.
- Revisione/rettifica: C9 è stato poi abbandonato come nuova prova; il MetaSkillSystem conserva il
  fallimento come origine, non come propria istanza.
- Confermato/smentito/aperto: confermata utilità di chiave pre-fissata e valutatore separato;
  smentita sufficienza della sola dichiarazione di FASE PIANO; aperto allora il redesign.
- Evidenza: report diretto; completezza `partial` per questo pacchetto; stato `independently_verified`
  per l'esito C1–C5 dichiarato dal valutatore; comparabilità `non_comparabile`.
- Fonte: `docs/Sessioni di lavoro/09-08-26/Report-collaudo-cieco-valutazione-seduta5-09-08-26.md`.

### `SEP-SES-20260809-001` — fondazione MetaSkillSystem v0

- Config/metodo: `SEP-AGC-openai-codex-001` · `SEP-MET-foundation-co-design-0.1`.
- Tipo/ruolo/obiettivo: Meta/deep; coordinatore Meta con audit freddi; costruire una cattura che non
  perda Persona, Sistema e Output.
- Contesto: tre giorni di lavoro crescita/valutazione, routing e chiusura; materiale personale
  confinato e non copiato qui.
- Checkpoint/interazioni: decisioni progressive di Matteo su referenza, organismo/chiavi, priorità
  raccolta, terzo asse Output e autorizzazione a procedere.
- Output/verifiche: ingresso MSS, parametri, capsula e piano iniziali; tre collaudi freddi, di cui i
  primi due hanno trovato forma light incompleta e ambiguità file/prodotto.
- Esito dichiarato: `WP-0` chiuso nel disegno; nel report `WP-1` descritto inizialmente come aperto in
  ombra.
- Revisione successiva: `WP-0.1` ha congelato il protocollo e riportato `WP-1` a bloccato/non iniziato.
- Confermato/smentito/aperto: confermati i tre assi e la modalità ombra; smentita la prontezza del
  primo disegno; aperti hardening e validazione.
- Evidenza: report + artefatti owner + commit Git; completezza `complete` per il perimetro pubblico;
  verifica `mixed`; comparabilità `non_comparabile`.
- Fonte: `docs/Sessioni di lavoro/09-08-26/Report-ciclo-metaskillsystem-v0-avvio-e-cattura-09-08-26.md`.

### `SEP-SES-20260809-002` — osservazioni architetturali e masterplan unico

- Config/metodo: configurazione non separata dal ciclo di fondazione; lettura architetturale a
  quattro prospettive.
- Obiettivo: registrare 23 lacune/rischi e trasformare `PLAN_V0.md` nell'unico owner dello stato
  `SYS-1`.
- Output/verifiche: Report 001 con provenienza; decisioni approvate confluite nel masterplan.
- Esito dichiarato: direzione corretta ma sistema ancora contratto documentale, non store/router
  formalizzato/enforcement autonomo.
- Revisione successiva: molte osservazioni hanno generato `WP-0.1`, H-1 e H-1.1; H-1.3 dimostra che
  alcune lacune di enforcement restano.
- Evidenza: analisi source-derived; completezza `complete`; verifica `mixed`; comparabilità
  `non_comparabile`.
- Fonte: `docs/MetaSkillSystem/archive/osservazioni/REPORT_001_OSSERVAZIONI_ARCHITETTURALI_09-08-26.md` (stub TTL al path storico root).

### `SEP-SES-20260809-003` — completamento `WP-0.1`

- Config/metodo: `SEP-AGC-openai-codex-001` · `SEP-MET-contract-writer-0.1`.
- Ruolo/obiettivo: writer unico; versionare evento/annotazioni/rettifiche e congelare il primo
  protocollo prima del pilota.
- Contesto/checkpoint: fonti MSS proprietarie e vincoli privacy; nessuna modifica applicativa.
- Output: schema `0.1.0`, protocollo `1.0.0`, 20 target, 14 fixture minime, forma light JSONL.
- Verifiche/esito: parsing, unicità ID/capture key, link mirati e diff-check verdi; `WP-0.1` chiuso
  nel disegno, H-1 aperto, WP-1 bloccato.
- Revisione successiva: H-1 ha portato schema a `0.1.1`; storia `0.1.0` conservata.
- Confermato/smentito/aperto: confermata la necessità del freeze prospettico; efficacia non
  dimostrata; aperti validator/hook.
- Evidenza: self-report con controlli meccanici; completezza `complete`; verifica `self_report`;
  comparabilità `non_comparabile`.
- Fonte: `docs/Sessioni di lavoro/09-08-26/Report-completamento-wp-0-1-metaskillsystem-09-08-26.md`.

### `SEP-SES-20260809-004` — prima implementazione H-1 e revisione fredda intermedia

- Config/metodo: configurazione non isolata; antecedente di
  `SEP-MET-counterexample-hardening-0.1`.
- Obiettivo: materializzare validator e superfici rapide.
- Esito dichiarato/invalidazione: una prima implementazione risultò verde meccanicamente; una
  revisione fredda trovò cinque falsi positivi.
- Output/revisione: i dettagli sono ricostruiti dal log del masterplan e dal report hardening
  successivo; non è stato trovato un report autonomo della prima implementazione/revisione.
- Confermato/smentito/aperto: confermata insufficienza dei test di presenza; smentita la chiusura
  iniziale; aperto hardening avversariale.
- Evidenza: `source_derived`, completezza `fragmentary`, verifica `contradicted`, comparabilità
  `non_comparabile`.
- Fonti: `docs/MetaSkillSystem/PLAN_V0.md` §14; report H-1 successivo.

### `SEP-SES-20260809-005` — hardening H-1

- Config/metodo: `SEP-AGC-openai-codex-001` · `SEP-MET-counterexample-hardening-0.1`.
- Ruolo/obiettivo: supervisor/implementer; respingere cinque bundle falsamente validi e uniformare
  core, CLI, stop e pre-commit.
- Checkpoint: controprove prima del fix; contratto owner chiarito; fixture negative via manifest;
  suite anti-rewrite e repository Git temporanei.
- Output/verifiche: schema `0.1.1`, 32 fixture, 13 gruppi integrativi; typecheck/lint/Vitest mirati
  verdi; globale rosso su Archives dichiarato separatamente.
- Esito dichiarato: H-1 chiuso nel disegno, G2/O1/E2 locale; nessun E3/CI.
- Revisione successiva: H-1.1 ha invalidato la chiusura dopo 17 nuove controprove inizialmente rosse.
- Confermato/smentito/aperto: confermata efficacia del metodo counterexample-first; smentita
  completezza della suite; aperta integrità append-only/semantica.
- Evidenza: self-report + suite locale; completezza `complete`; verifica `contradicted` sul verdetto
  di chiusura e confermata sui cinque casi; comparabilità `non_comparabile`.
- Fonte: `docs/Sessioni di lavoro/09-08-26/Report-hardening-h1-metaskillsystem-09-08-26.md`.

### `SEP-SES-20260810-006` — hardening H-1.1

- Config/metodo: `SEP-AGC-openai-codex-001` · `SEP-MET-counterexample-hardening-0.1`.
- Ruolo/obiettivo: supervisor/implementer; proteggere append-only HEAD/staged, semantica assi,
  versioni/modalità, storia e frozen.
- Checkpoint: 17 fallimenti riprodotti prima dei fix; fingerprint aggiunto dopo cold reread del primo
  verde.
- Output/verifiche: 41 fixture, 19 gruppi, 14 node-check, 1346 Vitest mirati verdi; bypass e globale
  rosso dichiarati.
- Esito dichiarato: H-1.1 chiuso nel disegno e pronto per revisione esterna; WP-1 non iniziato.
- Revisione successiva: H-1.3 ha trovato due HIGH, divergenza CLI staged e copertura sovradichiarata.
- Confermato/smentito/aperto: confermati fingerprint e confronto HEAD/staged sui casi provati;
  smentita prontezza complessiva; aperta remediation H13-R01…R05.
- Evidenza: self-report + suite locale; completezza `complete`; verifica `contradicted` sul go/no-go;
  comparabilità `non_comparabile`.
- Fonte: `docs/Sessioni di lavoro/10-08-26/Report-hardening-h1-1-metaskillsystem-10-08-26.md`.

### `SEP-SES-20260810-007` — frammento H-1.2 compatibility amendment

- Config/metodo: `SEP-AGC-openai-codex-001`; metodo non ricostruito integralmente.
- Obiettivo/output: rettificare append-only l'`owner_ref` dell'annotazione Output H-1 senza
  riscriverla.
- Verifiche/esito: un amendment final è incorporato nel report H-1; target e valore corrente sono
  stati poi esaminati da H-1.3.
- Revisione successiva: H-1.3 conferma che questo caso concreto è materialmente coerente, ma dimostra
  che il validator non proteggerebbe un `previous_value_or_hash` storico falso futuro.
- Evidenza: record incorporato + revisione H-1.3; completezza `fragmentary`; verifica `mixed`;
  comparabilità `non_comparabile`.
- Limite: nessun report narrativo H-1.2 autonomo trovato nella ricognizione mirata.
- Fonti: report H-1 § capsula; report H-1.3 §§8–9.

### `SEP-SES-20260810-008` — revisione indipendente H-1.3

- Config/metodo: `SEP-AGC-openai-codex-001` ·
  `SEP-MET-independent-adversarial-review-0.1`.
- Ruolo/obiettivo: revisore senior indipendente; verificare H-1.1 senza applicare fix.
- Contesto/checkpoint: fotografia Git; contratto ricostruito; matrice requisito-prova; prove su
  target storico, path inesistente, stage manifest+fixture e parità superfici.
- Output/verifiche: finding H13-R01…R05; suite ufficiale ancora verde; controprove riproducibili,
  benchmark, fingerprint e gate workspace.
- Esito: **FAIL — remediation necessaria prima di qualsiasi decisione WP1**.
- Confermato/smentito/aperto: confermate diverse protezioni frozen/modalità; smentita completezza
  amendment/parità; aperti fix separato e nuova revisione indipendente.
- Evidenza: revisione indipendente diretta; completezza `complete`; stato
  `independently_verified` per il verdetto tecnico corrente; comparabilità `non_comparabile`.
- Fonte: `docs/Sessioni di lavoro/10-08-26/Report-revisione-indipendente-h1-3-metaskillsystem-10-08-26.md`.

### `SEP-SES-20260809-009` — S-A, CFG-00 roleplay idiografico

- Config/metodo: `SEP-AGC-xai-cursor-001` · `SEP-MET-cfg00-roleplay-0.1`.
- Ruolo/obiettivo: capture operator/writer; provare una lettura idiografica e la cattura MSS ombra.
- Checkpoint/interazioni: tre correzioni di Matteo al ritratto; decisione di conservare soltanto uno
  spunto privato non approvato interamente.
- Output/verifiche: report/capsula validati; dettaglio privato non copiato.
- Esito/revisione: metodo utile per falsificazione live, ma primo ritratto troppo derivato dai
  documenti; ha generato CFG-01.
- Evidenza: self-report + correzioni osservate; completezza `partial` senza materiale privato;
  verifica `mixed`; comparabilità `non_comparabile`.
- Fonte: `docs/Sessioni di lavoro/09-08-26/Report-lettura-idiografica-capsula-mss-09-08-26.md`.

### `SEP-SES-20260809-010` — S-B, progettazione CFG-01

- Config/metodo: `SEP-AGC-xai-cursor-001` · preparazione di
  `SEP-MET-cfg01-elicitation-0.1`.
- Ruolo/obiettivo: prepara-prompt e capture; costruire una configurazione professionale riusabile.
- Contesto/metodo: fonti pubbliche PEACE/CI/McAdams/5P, Challenge controllata; registro metodi
  privato e confronto dichiarato con S-A.
- Output/verifiche: prompt pronto, capsula valida; fantasticazione non eseguita in questa seduta.
- Esito/revisione: CFG-01 predisposta; S-C ha mostrato contaminazione iniziale dalla trama S-A.
- Evidenza: report di predisposizione; completezza `complete`; verifica `contradicted` soltanto sul
  presupposto anti-contaminazione incompleto; comparabilità `non_comparabile`.
- Fonte: `docs/Sessioni di lavoro/09-08-26/Report-prepara-prompt-fantasticazione-elicitation-v2-09-08-26.md`.

### `SEP-SES-20260809-011` — S-C, esecuzione CFG-01

- Config/metodo: `SEP-AGC-xai-cursor-001` · `SEP-MET-cfg01-elicitation-0.1`.
- Ruolo/obiettivo: conduttore/capture; far emergere account da scenari inventati e osservare il
  metodo.
- Checkpoint/interazioni: scenari iniziali rifiutati perché precaricati; ricalibrazione fuori
  comfort; Challenge post-account; chiusura su mandato.
- Output/verifiche: spunto e registro privati, report/capsula, prompt di continuazione;
  `validate:mss` verde.
- Esito/revisione: CFG-01 eseguita; rifiuti interpretati come dato di contaminazione; successiva S-D
  prova la variante corretta.
- Evidenza: self-report + correzioni dirette; completezza `partial` senza verbatim privati; verifica
  `mixed`; comparabilità `non_comparabile`.
- Fonte: `docs/Sessioni di lavoro/09-08-26/Report-fantasticazione-cfg01-reazione-09-08-26.md`.

### `SEP-SES-20260810-012` — S-D, proseguimento CFG-01

- Config/metodo: `SEP-AGC-xai-cursor-001` · `SEP-MET-cfg01-elicitation-0.1` variante corretta.
- Checkpoint/interazioni: tre scenari; Challenge concreta o riformulata; una correzione sulla forma
  astratta della Challenge.
- Output/verifiche: append allo spunto privato, registro, report/capsula e log; validator verde.
- Esito/revisione: anti-trama ha retto; Challenge contaminata quando agganciata alla cornice agente.
- Confermato/aperto: confermata la variante “solo incoerenze dette dal soggetto”; 5P rimasta bozza.
- Evidenza: self-report + correzione osservata; completezza `partial`; verifica `mixed`;
  comparabilità `non_comparabile`.
- Fonte: `docs/Sessioni di lavoro/10-08-26/Report-proseguimento-cfg01-fantasticazione-10-08-26.md`.

### `SEP-SES-20260810-013` — S-E, progettazione in uso CFG-02

- Config/metodo: `SEP-AGC-xai-cursor-001` · `SEP-MET-cfg02-measured-0.1`.
- Obiettivo/interazione: condurre fantasticazione leggera; Matteo introduce misura professionale
  pre-stimolo, eval E1–E5, conservazione verbatim e ponte additivo.
- Checkpoint: quattro account/deepen; Challenge; decisioni di metodo attribuite separatamente.
- Output/verifiche: tipo-seduta aggiornato, report/capsula, fonti private referenziate; validator
  verde.
- Esito/revisione: CFG-02 nasce durante la seduta; S-F ne osserva una seconda applicazione.
- Confermato/aperto: confermata necessità di dichiarare misura prima; nessuna prova comparativa o
  validazione indipendente.
- Evidenza: calibrazione co-progettata; completezza `partial`; verifica `self_report/unverified`;
  comparabilità `non_comparabile`.
- Fonte: `docs/Sessioni di lavoro/10-08-26/Report-fantasticazione-cfg02-evals-flusso-10-08-26.md`.

### `SEP-SES-20260810-014` — S-F, seconda applicazione CFG-02

- Config/metodo: `SEP-AGC-xai-cursor-001` · `SEP-MET-cfg02-measured-0.1`.
- Checkpoint/interazioni: misura dichiarata a ogni giro; tre account/deepen; Challenge risolta;
  chiusura completa.
- Output/verifiche: spunto/registro privati referenziati, report con ponte additivo, capsula e log;
  validator verde.
- Esito dichiarato: nessuna correzione d'apertura; deepen necessario quando l'account restava sul
  clima strategico invece che sull'azione.
- Revisione/aperti: nessuna revisione indipendente; non è prova che CFG-02 sia superiore a CFG-01.
- Evidenza: self-report con interazioni osservate; completezza `partial`; verifica `unverified`;
  comparabilità `non_comparabile`.
- Fonte: `docs/Sessioni di lavoro/10-08-26/Report-fantasticazione-cfg02-carico-giudizio-allineamento-10-08-26.md`.

### `SEP-SES-20260810-015` — bootstrap di questo pacchetto

- Config/metodo: `SEP-AGC-openai-codex-001` · `SEP-MET-foundation-co-design-0.1`.
- Ruolo/obiettivo: unico Meta senior; ricostruire la storia e fondare il pacchetto senza delega.
- Contesto/checkpoint: fonti obbligatorie e ricognizione mirata; checkpoint con Matteo; conferma di
  struttura, ID e granularità prima delle scritture.
- Output: cinque documenti del pacchetto, rotta esterna minima e report deep con capsula.
- Verifiche: link/owner/routing/progressive disclosure, anti-ranking, validator capsula,
  `npm run test:mss` e diff-check mirato; risultati nel report della seduta.
- Esito: bootstrap e calibrazione; contratto progettato nella stessa seduta.
- Decisioni Matteo: struttura a cinque file; ID `mss.senior-eval-pack`; record per seduta più sintesi
  trasversali.
- Revisione successiva: `SEP-SES-20260810-017` (SEP-4) → `SEP-G1_FAIL` su metodo orfano; sanato in
  remediation `SEP-SES-20260810-018` senza dichiarare il gate PASS.
- Evidenza: evento reale + self-report dell'agente + decisioni esplicite di Matteo; completezza
  `complete` per il perimetro autorizzato; verifica `self_report/unverified`; comparabilità
  `non_comparabile`.
- Fonte: `docs/Sessioni di lavoro/10-08-26/Report-fondazione-senior-eval-pack-metaskillsystem-10-08-26.md`.

#### RETTIFICA · `SEP-RECT-20260810-015-method-ref` · amends `SEP-SES-20260810-015`

- **Data:** 10-08-2026.
- **Autore:** Cursor Grok 4.5 · ruolo writer remediation · `SEP-AGC-xai-cursor-001` ·
  sessione `SEP-SES-20260810-018`.
- **Relazione:** `amends` (correzione referenziale; non cancella la storia dell'errore).
- **Prima (citazione errata conservata):** `method_ref` =
  `SEP-MET-senior-eval-bootstrap-0.1` (assente da §3 Metodologie osservate).
- **Dopo:** `method_ref` = `SEP-MET-foundation-co-design-0.1` (già definito in §3; stesso metodo
  usato dal record gemello `SEP-SES-20260810-016` e descritto come fondazione/calibrazione nel
  report fondazione).
- **Motivo:** finding `SEP-F01` HIGH in
  `Report-revisione-indipendente-sep4-senior-eval-pack-metaskillsystem-10-08-26.md` — ID metodo
  orfano; allineamento preferito rispetto a inventare un nuovo metodo bootstrap.
- **Fonte remediation:**
  `docs/Sessioni di lavoro/10-08-26/Report-remediation-sep-f01-post-sep4-metaskillsystem-10-08-26.md`.
- **Non dimostrato da questa rettifica:** chiusura di `SEP-G1`; sanatoria di finding MEDIUM/LOW.

### `SEP-SES-20260810-016` — creazione dell'handoff permanente

- Config/metodo: `SEP-AGC-openai-codex-001` · `SEP-MET-foundation-co-design-0.1`.
- Ruolo/obiettivo: Meta senior writer; trasformare la continuità fra senior in un artefatto
  governato e obbligatorio a fine sessione.
- Contesto/checkpoint: fondazione già finalizzata; Matteo autorizza esplicitamente il sesto
  documento con “crea tu handoff” dopo averne approvato la funzione nel prompt preparato.
- Output: `HANDOFF_SENIOR_V0.md`, rotta interna, confine owner nel masterplan, vista roadmap,
  record catalogo e report con capsula.
- Metodo/workflow: owner unico → handoff derivato → registro append-only → chiusura
  report/verifiche/handoff.
- Esito: handoff chiuso nel disegno; uso da parte del prossimo senior non ancora osservato.
- Confermato/smentito/aperto: confermata la necessità di un punto stabile di ripartenza; nessuna
  prova ancora sull'efficacia; aperta la review indipendente `SEP-4` estesa a sei documenti.
- Evidenza: decisione diretta di Matteo + self-report e controlli locali; completezza `complete` per
  il perimetro; verifica `self_report/unverified`; comparabilità `non_comparabile`.
- Fonte: `docs/Sessioni di lavoro/10-08-26/Report-creazione-handoff-senior-eval-pack-metaskillsystem-10-08-26.md`.

### `SEP-SES-20260826-040` — consolidamento prospettico «Agente Matteo»

- Config/metodo: `SEP-AGC-openai-codex-001` · `SEP-MET-foundation-co-design-0.1`.
- Ruolo/obiettivo: Meta senior; trasformare la direzione ratificata da Matteo in piano operativo
  senza creare memoria parallela, autonomia generale o dati fittizi.
- Output: cartolina operativa obbligatoria; limiti di fonte/STOP; protocolli AM-01, AM-02 e AM-03
  con denominatori, fonti, esiti, evidenze, confondenti, ruoli e conseguenze.
- Stato attribuito: `SEP-5` passa a `IN_CORSO` perché il disegno del freeze è completo. Non passa
  `SEP-G2`: mancano tre cicli reali, cinque casi AM-03, ruoli nominati e freeze datati.
- Evidenza/limite: decisione diretta di Matteo nel mandato e controlli documentali della seduta;
  completezza `complete` per il disegno, `self_report` per l'esecuzione, nessuna revisione fredda e
  nessuna istanza prospettica svolta.
- Comparabilità: `non_comparabile`.
- Fonte: `docs/Sessioni di lavoro/26-08-26/Report-piano-operativo-agente-matteo-26-08-26.md`.

### `SEP-SES-20260827-041` — disegno della calibrazione di allineamento

- Config/metodo: Meta senior Codex · evoluzione documentale di `SEP-MET-foundation-co-design-0.1`; il metodo di test `AM-C0` è soltanto disegnato, non ancora esercitato.
- Ruolo/obiettivo: trasformare la richiesta di Matteo in una prova controllata della memoria decisionale, senza copiare dati privati, giudicare persone o attribuire differenze a modelli non comparabili.
- Output: protocollo `AM-C0`; scheda decisione con citazione, condizioni e STOP; canovaccio di cinque casi; sequenza Cursor Base/Pacchetto e revisore Codex cieco; prompt di passaggio al senior Claude.
- Stato attribuito: `SEP-5` resta `IN_CORSO`; non esistono ancora fonti autorizzate, chiave sigillata, configurazioni Cursor, risposte o verdetti. `SEP-G2` non passa.
- Evidenza/limite: decisione diretta di Matteo nella chat del 27-08-2026 e ricostruzione di fonti owner del 26-08; nessuna esecuzione del test e nessuna revisione fredda.
- Comparabilità: `non_comparabile` finché il freeze non registra configurazioni e condizioni identiche salvo il pacchetto.
- Fonte: `docs/Sessioni di lavoro/27-08-26/Report-preparazione-calibrazione-allineamento-mss-27-08-26.md`.

## 5. Sintesi trasversale

### Cosa ha prodotto valore osservabile

- Criteri e denominatori fissati prima dell'esito hanno reso contestabili le conclusioni.
- Controprove eseguite **prima** del fix hanno trovato falsi positivi che il verde precedente non
  mostrava.
- Revisioni indipendenti con prove nuove hanno corretto chiusure sovrastimate.
- Owner unici e separazione fatto/annotazione/verdetto hanno ridotto riscritture narrative.
- Nelle sedute di metodo, le correzioni di Matteo e i rifiuti degli stimoli sono diventati dati invece
  di essere interpretati come fallimenti del soggetto.
- Versionare le varianti CFG ha impedito di presentare una metodologia mutata come identica.

### Chiusure invalidate

1. prima implementazione H-1 verde → invalidata da cinque falsi positivi;
2. H-1 hardening chiuso nel disegno → invalidato da 17 buchi H-1.1;
3. H-1.1 verde/pronto per review → H-1.3 `FAIL` su R01…R05;
4. formulazioni iniziali delle metodologie CFG → corrette durante S-C/S-D/S-E, quindi non utilizzabili
   come baseline retroattiva.

### Errori per origine

- **Metodo:** criteri incompleti, Challenge su cornice agente, revisione non abbastanza avversariale.
- **Contesto:** precarico di ipotesi precedenti, snapshot/stato ereditato non aggiornato.
- **Implementazione:** fail-open su assertion/path/amendment e filtro CLI staged parziale.
- **Verifica:** suite verde con casi mancanti; parità provata su input troppo semplice.
- **Governance:** stato globale stale rispetto al verdetto H-1.3; nessuna modifica arbitraria fatta
  in questa fondazione.

### Buchi aperti

- remediation H13-R01…R05 e nuova revisione indipendente;
- freeze del primo protocollo eval senior prospettico;
- scelta preventiva di compito, condizioni, denominatore e conseguenze per tutti gli esiti;
- prima istanza prospettica, revisione indipendente e decisione di Matteo;
- campione sufficiente prima di qualunque aggregazione o ranking;
- analisi read-only dell'archiviazione e successivo piano di migrazione, ancora non eseguiti.

## 6. Limiti della ricostruzione

- Git contiene un solo checkpoint MetaSkillSystem (`7632443`, 09-08-26); H-1 e lavori successivi
  sono presenti nel working tree non committato. La cronologia Git non separa quindi tutti i delta.
- Non è stato trovato un report autonomo per la prima revisione fredda H-1 né per H-1.2; quei record
  sono dichiarati frammentari e derivati da fonti successive.
- Le fonti storiche sono report e capsule prodotti dagli stessi agenti, salvo H-1.3 e il valutatore
  C9. Non diventano automaticamente verità indipendente.
- Materiale privato e verbatim personali non sono stati aperti per questa catalogazione; i report
  pubblici ne forniscono soltanto puntatori e sintesi.
