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
> `MASTERPLAN_V0.md`.

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
2. Leggi questo handoff per conoscere l'ultimo punto operativo.
3. Verifica stato e gate direttamente in `MASTERPLAN_V0.md`; in caso di divergenza vince il
   masterplan.
4. Apri il report puntato dall'handoff per le prove complete.
5. Usa `CATALOGO_SEDUTE_E_METODI_V0.md` per precedenti e metodi; usa
   `CONTRATTO_EVAL_SENIOR_V0.md` prima di progettare o giudicare una seduta.
6. Dichiara ruolo, autorità, output e tipo di evidenza prima di lavorare.
7. Se il compito cambia owner, gate o perimetro, STOP e checkpoint con Matteo.

## 3. Handoff attivo

> Questa sezione è una vista sostituibile. Deve riportare sempre fonte e revisione. Non promuove
> autonomamente alcuno stato. In caso di divergenza con `MASTERPLAN_V0.md`, vince il masterplan.

- **Aggiornato il:** 10-08-2026.
- **Sessione:** `SEP-SES-20260810-031` (prepara go/no-go + chiusura + commit review; correlazione `021`–`030`).
- **Autore:** Cursor Grok 4.5, ruolo Meta prepara + commit (NON esecutore F4).
- **Configurazione:** `SEP-AGC-xai-cursor-001`.
- **Metodo:** B1 F4 → prompt go/no-go A/B/C/D → allineo owner → commit slice review.
- **Tipo di evidenza:** report `031` + prompt go/no-go + commit review `030`.
- **Verifica:** stage senza L5; validate:mss; allineamento MASTERPLAN.
- **Comparabilità:** `non_comparabile`.
- **Masterplan letto:** `MASTERPLAN_V0.md` — `SEP-G1_PASS_CON_RISERVE`; `SEP-10` chiuso;
  `SEP-11` = **`IN_CORSO`** con review ADEGUATO committed; **SEP-G5 non PASS**.
- **Ultimo report:**
  `docs/Sessioni di lavoro/10-08-26/Report-prepara-post-f3-review-chiusura-commit-10-08-26.md`
  (review: `Report-sep-11-post-f3-review-breve-10-08-26.md`).
- **Prompt prossimo task:**
  `docs/Sessioni di lavoro/10-08-26/Prompt-sep-11-go-nogo-post-f3-review-10-08-26.md`.
- **Catena prove:** `031` ← `030` review ADEGUATO ← `029`/`028` F3 ← …
- **Git:** `env/test`; review+prepara committed in `031`; **no push**; L5 fuori.

### Quadro generale (per ripartenza senior — MSS)

1. **Due owner:** pack → `MASTERPLAN_V0`; SYS-1 → `PLAN_V0` (non sanare H-1.3 qui).
2. **Onda:** SEP-10 → F1+F2 → B2-F01 → F3 → review ADEGUATO → **commit+prompt go/no-go `031`**.
3. **Freeze:** L5/L6; stub D5 attivo.
4. **Link M03:** L1+L2 ok; PLAN leave-as-history.
5. **Gate:** G1 con riserve; G5 **non** PASS.
6. **Fuori corsia:** H-1.3, WP-1, SEP-5, F5+, Valutazione Personale.

### Fatto osservato

Review `030` ADEGUATO committed. Prompt go/no-go pronto (A push · B F4-doc · C F4-L5-track · D stop). F4 non eseguito. Push no.

### Effetto prodotto

- review in git;
- ripartenza con decisione atomica senza auto-F4.

### Problema strutturale corrente

Go/no-go ancora da eseguire. Rumore L5 in WT. G5 non PASS.

### Cosa non è dimostrato

- push; F4; cutover/G5; H-1.3.

### Prossimo task atomico derivato

**Go/no-go** col prompt sopra (o stop). **STOP** su F4 auto / L5 path-rewrite / PLAN rewrite / G5 PASS / H-1.3 sanato / push senza Sì.

### Gate

`SEP-G1` = `PASS_CON_RISERVE`. `SEP-G5` **non** PASS.

### STOP e decisioni di Matteo

- STOP: F4 auto, move, L5 path-rewrite, PLAN rewrite, G5 PASS, H-1.3 sanato, push senza Sì.
- Chiuse: Cursor-only; D1–D5; F3+review ADEGUATO committed; no push (finora).
- Aperte: A/B/C/D go/no-go.

## 4. Chiusura obbligatoria di ogni sessione senior

L'agente chiude nell'ordine seguente:

1. separa fatti, inferenze, proposte e decisioni di Matteo;
2. finalizza output, prove, fallimenti, confondenti e limiti;
3. aggiunge al catalogo un record della seduta e versiona il metodo se è realmente cambiato;
4. aggiorna il masterplan solo per stati o gate realmente variati;
5. riallinea la roadmap soltanto come vista, se necessario;
6. produce un report senior completo con capsula `mss.session/0.1.1`;
7. esegue validator capsula, `npm run test:mss`, controlli owner/routing e `git diff --check` sul
   perimetro posseduto;
8. fotografa Git finale e verifica che lo staging non sia cambiato senza mandato;
9. **come ultimo atto**, sostituisce l'handoff attivo e aggiunge una voce al registro append-only.

Se una verifica fallisce, l'handoff riporta il fallimento e il blocco: non descrive il lavoro come
chiuso. Se report, catalogo e masterplan divergono, STOP; correggere l'owner competente prima di
aggiornare questa vista.

## 5. Campi minimi dell'handoff attivo

Ogni aggiornamento conserva almeno:

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

- La sezione attiva può essere sostituita soltanto dopo un nuovo report finalizzato.
- Il registro non si riscrive: una correzione aggiunge una voce `RETTIFICA` con target, motivo,
  autore, fonte e relazione `amends`, `supersedes_interpretation` o `contradicts`.
- Una rettifica dell'handoff non cambia retroattivamente catalogo, report o masterplan.
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

Il registro dimostra soltanto che il passaggio è stato dichiarato e documentato. La verifica si
legge nel report collegato e nel successivo eventuale record di review.
