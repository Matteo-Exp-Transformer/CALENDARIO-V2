---
name: senior-eval-handoff
description: >-
  Ponte operativo permanente tra le sessioni del Senior Eval Pack. Indica da dove
  ripartire e registra i passaggi fra senior senza diventare owner dello stato.
---

# Handoff senior — `mss.senior-eval-handoff/0.1.0`

> **Package:** `mss.senior-eval-pack/0.1.0` · **Stato:** sperimentale.
> **Owner di questo documento:** continuità operativa e registro dei passaggi fra senior.
> **Non possiede lo stato:** stato, gate e prossimo task autorizzato restano in
> `MASTERPLAN_V0.md` (pack) e in [`../PLAN_V0.md`](../PLAN_V0.md) (SYS-1).

## 1. Funzione

Questo è il punto di ripartenza dopo l'entry point del pacchetto. Serve a evitare che ogni senior
ricostruisca da zero l'ultima superficie di lavoro, i tentativi già svolti e il rapporto tra
prossimo task, prove e gate.

L'handoff:

- punta agli owner e al report più recente;
- espone un'istantanea operativa attribuita e datata;
- registra metodi, fallimenti, contraddizioni e limiti;
- conserva un registro append-only delle sessioni senior;
- viene aggiornato come ultimo atto documentale di ogni sessione del pacchetto.

Non sostituisce:

- il masterplan per stato e gate;
- il catalogo per storia di sedute e metodi;
- il contratto per forma e validità delle eval;
- il report completo della singola sessione;
- `../PLAN_V0.md` per lo stato globale di `SYS-1`.

## 2. Ordine di ingresso del prossimo senior

1. Apri `SENIOR_EVAL_SKILL.md` e identifica la rotta.
2. Leggi questo handoff per conoscere l'ultimo punto operativo (blocco generato §3).
3. Verifica stato e gate direttamente in `MASTERPLAN_V0.md` e `../PLAN_V0.md`; in caso di
   divergenza vince l'owner SYS-1.
4. Apri il report puntato dall'handoff per le prove complete.
5. Usa `CATALOGO_SEDUTE_E_METODI_V0.md` per precedenti e metodi; usa
   `CONTRATTO_EVAL_SENIOR_V0.md` prima di progettare o giudicare una seduta.
6. Dichiara ruolo, autorità, output e tipo di evidenza prima di lavorare.
7. Se il compito cambia owner, gate o perimetro, STOP e checkpoint con Matteo.

## 3. Handoff attivo

> Questa sezione e una vista sostituibile (marcatori). Deve riportare sempre fonte e revisione
> derivate dall'owner. Non promuove autonomamente alcuno stato. In caso di divergenza con
> `../PLAN_V0.md`, vince l'owner. Le istantanee manuali stratificate pre-D14 sono state ritirate:
> la storia resta nel registro §7 e nei report puntati.

<!-- mss:generated handoff-senior inizio -->
> Generato da `npm run generate:mss:views` leggendo il solo owner [`PLAN_V0.md`](../PLAN_V0.md).
> Questa vista non possiede stato: se il controllo anti-stale e rosso, rigenerala; non correggerla a mano.

### Istantanea attiva

- **Ultimo ciclo chiuso:** `T13` **CHIUSO**
- **Ciclo:** Ventesimo ciclo del 25-08-2026
- **Atti del ciclo (puntatori owner):**
  - [`Decisioni-T12-QABC-25-08-26.md`](../../Sessioni%20di%20lavoro/25-08-26/Decisioni-T12-QABC-25-08-26.md)
  - [`Report-chiusura-residui-t13-25-08-26.md`](../../Sessioni%20di%20lavoro/25-08-26/Report-chiusura-residui-t13-25-08-26.md)
- **Prossima azione autorizzata:** `T14` (WP-1 ombra in corso: istanza 1 blindatura Servizio fatta; istanza 2 checklist QA fatta; collaudo umano Servizio in corso — completare prove + esiti OK/KO; revisione fredda dopo; cutover vietato; non chiudere WP-1)
- **R1:** CHIUSO CON RISERVE — M12 soddisfatto; riserva busta ridotta in T2
- **`H-1.3` (M):** _PASS 25-08-26 — ✅ riserva H13-POST-L01 CHIUSA 24-08-26 (M13); ✅ T7 B-E2-CI chiuso (SK-5); ✅ Opzione B M-E2-A..D CHIUSE (CI post-hoc no-verify; Report/Verbale unstaged; Cloud checklist+CI; light deny MSS-LIGHT-NO-EVENT); residui umani misurati in COVERAGE_MATRIX_H1.json (--no-verify Git, hook Cloud non installabile, JSONL/fixture unstaged, legacy/undeclared) — non stale «bypass intenzionali accettati»_
- **`WP-1` (M):** _IN PILOTA — ombra (D27 25-08-26; cutover vietato; istanza 1 blindatura Servizio fatta; istanza 2 checklist QA fatta; collaudo umano in corso ~12/26)_
- **Owner di stato:** [`../PLAN_V0.md`](../PLAN_V0.md) — in caso di divergenza vince l'owner.
- **Cruscotto:** [`../CRUSCOTTO_MATTEO_MSS.md`](../CRUSCOTTO_MATTEO_MSS.md) (stesso generatore).

### Prossimo task atomico

Completare `T14`. `WP-1` resta _IN PILOTA — ombra (D27 25-08-26; cutover vietato; istanza 1 blindatura Servizio fatta; istanza 2 checklist QA fatta; collaudo umano in corso ~12/26)_ (`H-1.3` PASS ≠ via libera pilota).

### STOP invariati (da M, non da memoria)

- Non aprire `WP-1` se M lo tiene NO-GO.
- Non promuovere gate SEP/`SEP-G5` da questa vista.
- Non correggere a mano il blocco fra marcatori: rigenera con `npm run generate:mss:views`.

## Dati mobili

Nessun conteggio di test, sedute, controlli o HEAD e congelato qui. Chiedilo al momento a:
- `npm run mss:status`
- `npm run mss:query -- --verifica` / `--fail`
- `npm run test:mss:tools` / `npm run validate:mss:all`

<!-- mss:generated handoff-senior fine -->
## 4. Chiusura obbligatoria di ogni sessione senior

L'agente chiude nell'ordine seguente:

1. separa fatti, inferenze, proposte e decisioni di Matteo;
2. finalizza output, prove, fallimenti, confondenti e limiti;
3. aggiunge al catalogo un record della seduta e versiona il metodo se è realmente cambiato;
4. aggiorna il masterplan solo per stati o gate realmente variati;
5. dopo mutazioni all'owner, rigenera le viste con `npm run generate:mss:views` (ROADMAP/HANDOFF
   incluso) — non rettificare a mano il blocco fra marcatori;
6. produce un report senior completo con capsula `mss.session/0.1.1`;
7. esegue validator capsula, `npm run test:mss`, controlli owner/routing e `git diff --check` sul
   perimetro posseduto;
8. fotografa Git finale e verifica che lo staging non sia cambiato senza mandato;
9. **come ultimo atto**, aggiunge una voce al registro append-only §7 (l'istantanea attiva §3 e
   generata, non riscritta a mano).

Se una verifica fallisce, l'handoff riporta il fallimento e il blocco: non descrive il lavoro come
chiuso. Se report, catalogo e masterplan divergono, STOP; correggere l'owner competente prima di
aggiornare questa vista.

## 5. Campi minimi dell'handoff attivo

Il blocco §3 e derivato da `PLAN_V0` (gate, ciclo, STOP da M). Campi umani aggiuntivi (metodo,
comparabilità, debito narrativo) restano nel report della seduta e, se serve, in una voce §7.
Il generatore non congela HEAD ne conteggi di test.

Ogni aggiornamento umano al registro §7 conserva almeno:

- data, `session_id`, autore, ruolo e configurazione agente;
- metodo/versione, tipo di evidenza, verifica e comparabilità;
- revisione del masterplan e report sorgente;
- problema affrontato e perimetro autorizzato;
- output e file modificati;
- prove eseguite e risultato;
- cosa ha funzionato, fallito, contraddetto o non è stato osservato;
- modifiche concorrenti preservate;
- debito e rischi introdotti;
- prossimo task atomico derivato, gate, STOP e decisioni di Matteo.

Non copiare nel handoff intere narrative, capsule o dati privati: usare puntatori risolvibili.

## 6. Rettifiche

- La sezione attiva (§3) si aggiorna solo via `npm run generate:mss:views` dopo un owner aggiornato.
- Il registro §7 non si riscrive: una correzione aggiunge una voce `RETTIFICA` con target, motivo,
  autore, fonte e relazione `amends`, `supersedes_interpretation` o `contradicts`.
- Una rettifica del registro non cambia retroattivamente catalogo, report o masterplan.
- Un conflitto irrisolto resta visibile e blocca l'uso della vista come punto di ripartenza.

## 7. Registro append-only

| Sessione | Data | Ruolo/configurazione | Metodo | Risultato attribuito | Verifica | Comparabilità | Report |
|---|---|---|---|---|---|---|---|
| `SEP-SES-20260810-015` | 10-08-2026 | Meta senior · `SEP-AGC-openai-codex-001` | `SEP-MET-foundation-co-design-0.1` | fondati cinque documenti, contratto, catalogo e rotta esterna | `self_report/unverified` | `non_comparabile` | `Report-fondazione-senior-eval-pack-metaskillsystem-10-08-26.md` |
| `RETTIFICA` → `015` | 10-08-2026 | writer remediation · `SEP-AGC-xai-cursor-001` · `SEP-SES-20260810-018` | `amends` method_ref | prima: testo ambiguo «bootstrap/foundation co-design» / catalogo orfano `SEP-MET-senior-eval-bootstrap-0.1`; dopo: ID canonico `SEP-MET-foundation-co-design-0.1` | rettifica documentale | `non_comparabile` | `Report-remediation-sep-f01-post-sep4-metaskillsystem-10-08-26.md` |
| `SEP-SES-20260810-016` | 10-08-2026 | Meta senior · `SEP-AGC-openai-codex-001` | `SEP-MET-foundation-co-design-0.1` | creato e integrato l'handoff permanente; efficacia futura non osservata | `self_report/unverified` | `non_comparabile` | `Report-creazione-handoff-senior-eval-pack-metaskillsystem-10-08-26.md` |
| `SEP-SES-20260810-017` | 10-08-2026 | revisore indipendente · `SEP-AGC-xai-cursor-001` | `SEP-MET-independent-adversarial-review-0.1` | `SEP-G1_FAIL`; HIGH `SEP-F01` metodo orfano; pack non modificato in review | `independently_verified` (review) | `non_comparabile` | `Report-revisione-indipendente-sep4-senior-eval-pack-metaskillsystem-10-08-26.md` |
| `SEP-SES-20260810-018` | 10-08-2026 | Meta writer remediation · `SEP-AGC-xai-cursor-001` | rettifica F01 + chiusura stato | F01 sanato; SEP-4 aggiornato; **non** `SEP-G1_PASS` | `self_report/unverified` sul gate | `non_comparabile` | `Report-remediation-sep-f01-post-sep4-metaskillsystem-10-08-26.md` |
| `SEP-SES-20260810-019` | 10-08-2026 | Meta prepara/orchestratore · `SEP-AGC-xai-cursor-001` | chiusura + prepara controverifica | Matteo rimanda PASS; soft check non formale; prossimo = controverifica | `self_report/unverified` | `non_comparabile` | `Report-orchestrazione-sep-g1-pass-rimandato-controverifica-10-08-26.md` |
| `SEP-SES-20260810-020` | 10-08-2026 | Meta writer accettazione · `SEP-AGC-xai-cursor-001` | accettazione gate con riserve | **`SEP-G1_PASS_CON_RISERVE`** (R1–R3; Cursor-only) | decisione Matteo + ri-check F01 | `non_comparabile` | `Report-accettazione-sep-g1-pass-con-riserve-cursor-only-10-08-26.md` |
| `SEP-SES-20260810-021` | 10-08-2026 | Meta writer SEP-10 · `SEP-AGC-xai-cursor-001` | plan A1–A4 read-only | A1–A4 complete; SEP-10 `IN_CORSO`; zero migrazione | `self_report/unverified` | `non_comparabile` | `Report-sep-10-a1-a4-ricognizione-archiviazione-10-08-26.md` |
| `SEP-SES-20260810-022` | 10-08-2026 | Meta writer SEP-10 B1 · `SEP-AGC-xai-cursor-001` | Prompt-B1 sintesi | PIANO PRONTO PER DECISIONE; SEP-10 `CHIUSO_NEL_DISEGNO`; zero move | `validate:mss` OK + self_report | `non_comparabile` | `SEP-10-archiviazione/Report-B1-sintesi-piano-migrazione.md` |
| `SEP-SES-20260810-023` | 10-08-2026 | Verifica revisore SEP-10 B2 · `SEP-AGC-xai-cursor-001` | Prompt-B2 review avversariale | `ADEGUATO_CON_RISERVE`; HIGH B2-F01; SEP-G5 non PASS; zero move | `validate:mss` OK + self_report capsula | `non_comparabile` | `SEP-10-archiviazione/Report-B2-review-piano-migrazione.md` |
| `SEP-SES-20260810-024` | 10-08-2026 | Meta registrar decisioni · `SEP-AGC-xai-cursor-001` | registrazione D1–D5 + perimetro | D1=b D2=c D3=a D4=a D5=a; F1+F2 autorizzati; F3 bloccato; zero move | decisione Matteo + allineamento owner | `non_comparabile` | `Report-decisioni-d1-d5-perimetro-sep11-f1-f2-10-08-26.md` |
| `SEP-SES-20260810-025` | 10-08-2026 | Meta writer F1+F2 · `SEP-AGC-xai-cursor-001` | create-only archive + indice | F1+F2 fatti; SEP-11 `IN_CORSO`; zero move; D2 staged; F3 bloccato | `validate:mss` + diff-check | `non_comparabile` | `Report-sep-11-f1-f2-archive-shell-indice-10-08-26.md` |
| `SEP-SES-20260810-026` | 10-08-2026 | Meta writer B2-F01 · `SEP-AGC-xai-cursor-001` | inventario `rg` + Addendum-M03 + policy PLAN_V0 | SEP-D09 inventario sanato; F3 non autorizzato; zero move; SEP-G5 non PASS | `validate:mss` + diff-check | `non_comparabile` | `Report-remediation-b2-f01-link-report001-pre-f3-10-08-26.md` |
| `SEP-SES-20260810-027` | 10-08-2026 | Meta go/no-go + prepara · `SEP-AGC-xai-cursor-001` | review 026 + commit + prompt F3 | 026 ADEGUATO; F3 autorizzato non eseguito; no push; quadro handoff | decisione Matteo + allineamento owner | `non_comparabile` | `Report-go-nogo-b2-f01-e-mandato-f3-10-08-26.md` |
| `SEP-SES-20260810-028` | 10-08-2026 | Meta writer F3 · `SEP-AGC-xai-cursor-001` | F3 M03 move+stub+L1/L2 | REPORT_001 → archive/osservazioni; stub D5; PLAN leave-as-history; SEP-G5 non PASS | `validate:mss` + diff-check + rg | `non_comparabile` | `Report-sep-11-f3-move-report001-10-08-26.md` |
| `SEP-SES-20260810-029` | 10-08-2026 | Meta prepara + commit · `SEP-AGC-xai-cursor-001` | prepara review + allineo + commit F3 | prompt review pronto; F3 committed; no push; G5 non PASS | decisione Matteo + allineamento owner | `non_comparabile` | `Report-prepara-post-f3-allineo-commit-10-08-26.md` |
| `SEP-SES-20260810-030` | 10-08-2026 | Verifica revisore F3 · `SEP-AGC-xai-cursor-001` | review breve prove M03 | **ADEGUATO**; path/stub/L1-L2/PLAN ok; G5 non PASS; no F4 | `validate:mss` + diff-check + rg | `non_comparabile` | `Report-sep-11-post-f3-review-breve-10-08-26.md` |
| `SEP-SES-20260810-031` | 10-08-2026 | Meta prepara + commit · `SEP-AGC-xai-cursor-001` | prepara go/no-go + commit review | prompt A/B/C/D pronto; review committed; no push; no F4 exec | decisione Matteo + allineamento owner | `non_comparabile` | `Report-prepara-post-f3-review-chiusura-commit-10-08-26.md` |
| `SEP-SES-20260810-032` | 10-08-2026 | Meta pulizia · `SEP-AGC-xai-cursor-001` | pulizia solidi + backlog dedicati | A/B/C=Sì; push; go/no-go superseded; prossimo=F4-doc; G5 non PASS | decisione Matteo + allineamento owner | `non_comparabile` | `Report-sep-11-pulizia-solidi-backlog-dedicati-10-08-26.md` |
| `SEP-SES-20260810-033` | 10-08-2026 | Meta writer F4-doc · `SEP-AGC-xai-cursor-001` | track whitelist Sessioni + slice A | F4-doc fatto; 11 path + docs `032`; zero L5/move; prossimo=H-1.3/L5; G5 non PASS | `validate:mss` + diff-check | `non_comparabile` | `Report-sep-11-f4-doc-track-sessioni-10-08-26.md` |
| `SEP-SES-20260810-034` | 10-08-2026 | Verifica senior indipendente H-1.3 · `SEP-AGC-xai-cursor-001` | review post-remediation | **PASS_CON_RISERVE**; H13-POST-L01; WP-1 NO-GO; G5 non PASS | controprove + `test:mss` | `non_comparabile` | `Report-revisione-indipendente-h13-post-remediation-10-08-26.md` |
| `SEP-SES-20260810-035` | 10-08-2026 | Meta writer track L5 · `SEP-AGC-xai-cursor-001` | track/commit baseline H-1.3 | L5+2 hook+report staged; path invariati; prossimo=plan directory; G5 non PASS | `test:mss` + validate:mss + diff-check | `non_comparabile` | `Report-track-commit-h13-l5-pass-con-riserve-10-08-26.md` |
| `SEP-SES-20260810-036` | 10-08-2026 | Meta prepara · `SEP-AGC-xai-cursor-001` | prompt plan directory/export/sandbox | prompt pronto; zero move/F5; allineo parziale rimasto nel WT | fonte prompt + Git | `non_comparabile` | `Prompt-plan-directory-export-sandbox-mss-10-08-26.md` |
| `SEP-SES-20260821-037` | 21-08-2026 | Meta documentation closure · Codex | chiusura append-only preparazione `036` | riferimenti superati corretti; roadmap/handoff allineati; prossimo=plan directory; zero F5/sandbox | validate:mss + diff-check + ricerca riferimenti | `non_comparabile` | `Report-chiusura-documentale-preparazione-036-21-08-26.md` |
| `RETTIFICA` → `037` | 22-08-2026 | supervisione · Anthropic Claude Opus 5 | `amends` prossimo-task | prima: «prossimo = plan directory/export/sandbox»; dopo: quel task e **congelato da `D15`** (21-08, `PLAN_V0` §16.4) e la traccia viva e `SK-*`, non `SEP-*`. L'handoff dirigeva il prossimo senior su lavoro fermato | rettifica documentale; gate invariati | `non_comparabile` | `Report-fix-sk6-22-08-26.md` |
| `mss-ses-01a0294a-…-e8583922a38e` | 22-08-2026 | esecutore `SK-6` · Anthropic Claude Opus 5 | costruire il **lettore** prima dello scrittore (`D12`) | `npm run mss:query` (sola lettura, 5 domande). Scoperto: `independently_verified` **mai** usato in 43 sedute e `verified_by` sempre vuoto, **ma le review erano state fatte davvero**. `SK-6` **non** dichiarato chiuso | `test:mss` exit 0 · `validate:mss` OK · tre affermazioni tracciate ai report d'origine | `non_comparabile` | `Report-sk6-mss-query-22-08-26.md` |
| `mss-ses-01a02b3d-…-82eae5366f7d` | 22-08-2026 | **revisore indipendente · OpenAI Codex** (famiglia diversa) | censimento con parser scritto **fuori dal repo**, che non importa `query.mjs`; hash del bersaglio fotografato 3 volte | **6 affermazioni confermate su 7, 1 contraddetta** (conteggio revisori). Trovato difetto nuovo: `mss:query` **non applica gli amendment**. **Primo uso reale del meccanismo di rettifica** in tutta la storia del sistema | `validate:mss` OK sulla sua capsula; misure riprodotte in modo indipendente | `non_comparabile` | `Report-revisione-indipendente-sk6-codex-22-08-26.md` |
| `mss-ses-01a02b3b-…-54e73e38192e` | 22-08-2026 | esecutore fix · Anthropic Claude Sonnet 5 | rettifica **append-only**, mai riscrittura di record `final` | criterio revisori da `controls[].esecutore` a `recorded_by.role` (soprainsieme stretto, **0 controlli persi**); capsula `SK-6` corretta con `amendment`; specchio `PLAN_V0` riallineato; limite «vista grezza, non effettiva» **dichiarato in output** | `test:mss` exit 0 · `validate:mss` OK su 2 report · `node --check` exit 0 · elenco attori ispezionato: **0 falsi positivi** | `non_comparabile` | `Report-fix-sk6-22-08-26.md` |
| `mss-ses-01a02d5f-…-a5292391b4bd` | 23-08-2026 | esecutore vista effettiva · Anthropic Claude Sonnet 5 + revisione Opus | applicare catena amendment in `mss:query` (`D16`–`D19`) | vista effettiva in `--verifica`/`--json`; `applyAmendmentsView()` esportata da `core.mjs`; `SK-6` **CHIUSO** | `test:mss` exit 0 · `mss:query --verifica` exit 0 · commit `449cd70` | `non_comparabile` | `Report-vista-effettiva-mss-query-23-08-26.md` |
| chiusura senior 23-08-26 | 23-08-2026 | Meta senior ripresa · Cursor Auto | chiusura ciclo pianificazione post-Stop-hook #2 | allineati ROADMAP riga `SK-6`, HANDOFF operativo, hook gitignore, template v.0 playbook | `mss:status` · `grep SK-6` · `git check-ignore` | `non_comparabile` | `Report-senior-chiusura-sessione-23-08-26.md` |

Il registro dimostra soltanto che il passaggio è stato dichiarato e documentato. La verifica si
legge nel report collegato e nel successivo eventuale record di review.
