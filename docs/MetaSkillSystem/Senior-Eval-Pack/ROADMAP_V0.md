# Roadmap — Senior Eval Pack v0

> Vista della sequenza. **Non possiede stato:** gate e prossimo passo vivi vivono in
> [`../PLAN_V0.md`](../PLAN_V0.md). Il blocco fra marcatori e generato; fuori resta prosa umana.

> ## ⚠️ Questa roadmap copre una traccia **parcheggiata** — aggiornato 25-08-2026
>
> Il percorso `SEP-*` qui sotto **non è il fronte di lavoro attuale**. Dal 21-08-2026 la traccia
> viva è **`SK-*`**: lo «scheletro con attrezzi» di `../PLAN_V0.md` §4-bis, con il target in §16.
>
> Parcheggiata **non** vuol dire annullata. Stato di `SEP-G5`, `WP-1`, `H-1.3` e prossimo gate:
> **solo** dall'owner o dal blocco generato sotto — non da questa nota.
>
> **Se cerchi il prossimo passo:** apri `../PLAN_V0.md` §4-bis / §15, oppure il blocco generato
> sotto / `HANDOFF_SENIOR_V0.md` §3. Il punto 9 qui sotto indicava «plan directory/export/sandbox»
> come prossimo atomico: quel task è **congelato dalla decisione `D15`** di Matteo.

## Percorso

1. **Bootstrap e catalogazione storica** — fissare identità, owner e progressive disclosure; creare
   record per seduta e sintesi trasversali senza eval retroattive (`SEP-0`, `SEP-1`).
2. **Congelare il primo contratto eval** — sottoporre prima struttura e contratto alla review
   indipendente, poi versionare il protocollo approvato (`SEP-2`, `SEP-4`, `SEP-5`, gate `SEP-G1`).
3. **Conservare la prima calibrazione** — usare questa fondazione come prova del flusso, mai come
   campione comparabile (`SEP-3`).
4. **Eseguire la prima eval prospettica** — fissare compito, condizioni, criteri, denominatore,
   ruoli e conseguenze prima dell'output (`SEP-6`, gate `SEP-G2` e `SEP-G3`).
5. **Revisionare indipendentemente** — revisore distinto, controprove, esiti criterio-per-criterio e
   decisione di Matteo separata (`SEP-7`).
6. **Confrontare due metodologie in modo controllato** — usare soltanto istanze che superano la
   checklist; nessuna classifica automatica (`SEP-8`, gate `SEP-G4`).
7. **Consolidare il routing** — usare evidenze d'uso per correggere le rotte senza duplicare owner o
   aprire nuovi router implicitamente (`SEP-9`).
8. **Analizzare la struttura di archiviazione** — inventario read-only di file, link, owner,
   sovrapposizioni e vincoli (`SEP-10`). *Vista storica 10-08-2026:* A1–A4 + B1 + B2 chiuse nel
   disegno; B2 = `ADEGUATO_CON_RISERVE`; D1–D5 registrate (`024`). Lo stato vivo resta nel masterplan.
9. **Preparare / avviare la migrazione documentale controllata** — matrice source→target, ordine,
   test, rollback e autorizzazione per fase (`SEP-11`, gate `SEP-G5`). ~~Prossimo atomico = plan
   directory/export/sandbox~~ → **CONGELATO il 21-08-2026 dalla decisione `D15`**
   (`../PLAN_V0.md` §16.4). F5 resta fuori. SEP-5 bloccato finché l'owner non dice altrimenti.
10. **Passare da sperimentale ad affidabile** — solo dopo almeno un ciclo prospettico revisionato,
    debiti critici risolti o accettati e decisione esplicita di Matteo (`SEP-12`).

## Traccia viva — `SK-*` (dal 21-08-2026)

Ordine dichiarato (resta valido, non e stato): **prima cio che e gratis e sblocca, poi cio che
legge, poi cio che scrive.**

<!-- mss:generated roadmap-senior inizio -->
> Generato da `npm run generate:mss:views` leggendo il solo owner [`PLAN_V0.md`](../PLAN_V0.md).
> Questa vista non possiede stato: se il controllo anti-stale e rosso, rigenerala; non correggerla a mano.

## Gate vivo (da owner)

- **Ultimo ciclo chiuso:** `T13` **CHIUSO**
- **Titolo ciclo:** Ventesimo ciclo del 25-08-2026
- **Prossima azione:** `T14` (prima istanza WP-1 ombra: blindatura Admin Servizio — test, fix e protezione funzioni del cantiere; revisione fredda dopo l'istanza; cutover vietato; `src/` solo nel perimetro Servizio scelto)
- **R1:** CHIUSO CON RISERVE — M12 soddisfatto; riserva busta ridotta in T2

## Lavagna pacchetti (M)

*Fatte 17 · Con riserva 0 · Da fare 5 · Non classificate 3*

| Fatte | Con riserva | Da fare |
|---|---|---|
| `WP-0` Parametri macro e prima capsula del sistema | — | `WP-2` Mining storico normalizzato |
| `MP-0` Report osservazioni e masterplan unico | — | `WP-3` Kernel, manifest e pacchetti |
| `WP-0.1` Hardening prima del primo pilota | — | `WP-4` Preflight, registro Output e viste |
| `H-1.1` Integrità append-only e semantica eventi | — | `WP-5` Nuova suite di validazione |
| `H-1.3` Amendment, staged e parità tra superfici | — | `WP-6` Decisione di cutover |
| `SK-0` Sbloccare i cancelli globali (lint, test, validate) | — | — |
| `SK-1` Punto di ripristino con tag annotato | — | — |
| `SK-2` Comando «dove siamo» in sola lettura | — | — |
| `SK-3` Revisione seduta in sola lettura | — | — |
| `SK-4` Chiusura bypass e contratto capsula | — | — |
| `SK-5` Controlli MSS in CI su env/test | — | — |
| `SK-6` Interrogazione capsule in sola lettura | — | — |
| `SK-7` Generazione capsule da checklist | — | — |
| `SK-8` Suite test eseguibile da cwd esterna | — | — |
| `SK-9` Spostamento file con aggiornamento riferimenti | — | — |
| `SK-10` Manuale operativo e bootstrap | — | — |
| `SK-11` Test automatici degli attrezzi MSS | — | — |

**Non classificate (M):**
- `H-1` Validator e hook rapidi (prima tranche) — _chiusura invalidata dalla revisione H-1.1_
- `WP-1` Piloti reali in modalità ombra (autorizzato; cutover vietato) — _IN PILOTA — ombra (D27 riaperta 25-08-26 verbatim; cutover vietato; prima istanza = Admin Servizio blindatura/test)_
- `E-2` Enforcement superiore (ancora da decidere) — _buco intenzionale_

## Riserve aperte

- `SK-6` (Interrogazione capsule in sola lettura): ⚠️ copertura test del lettore parziale (suite tools, non H-1 intero) · rettificato 22-08-26: capsula `SK-6` corretta con `amendment`; criterio revisori su `recorded_by.role` · ✅ **23-08-26 vista effettiva:** `query.mjs` delega `core.mjs::applyAmendmentsView()` · ✅ **23-08-26 P1:** `--fail` usa denominatori calcolati, non literal storici · revisioni/controlli: numero mobile → `npm run mss:query -- --verifica` · **Matteo ha dichiarato `SK-6` CHIUSO (`D16`)**

## Prossimo passo

Completare `T14`. `WP-1` resta _IN PILOTA — ombra (D27 riaperta 25-08-26 verbatim; cutover vietato; prima istanza = Admin Servizio blindatura/test)_ (`H-1.3` PASS ≠ via libera pilota).

## Dati mobili

Nessun conteggio di test, sedute, controlli o HEAD e congelato qui. Chiedilo al momento a:
- `npm run mss:status`
- `npm run mss:query -- --verifica` / `--fail`
- `npm run test:mss:tools` / `npm run validate:mss:all`

<!-- mss:generated roadmap-senior fine -->

## Lettura operativa

- Per sapere dove siamo o quale gate blocca il passo successivo: `MASTERPLAN_V0.md` (pack) e
  [`../PLAN_V0.md`](../PLAN_V0.md) (SYS-1).
- Per costruire o giudicare un'istanza: `CONTRATTO_EVAL_SENIOR_V0.md`.
- Per precedenti e famiglie metodologiche: `CATALOGO_SEDUTE_E_METODI_V0.md`.
- Per scegliere il documento minimo da aprire: `SENIOR_EVAL_SKILL.md`.
- Per riprendere l'ultimo lavoro e chiudere una nuova sessione: `HANDOFF_SENIOR_V0.md`; il suo
  prossimo task va sempre verificato nell'owner.
- Per lo stato globale del MetaSkillSystem: `../PLAN_V0.md`; questa roadmap non lo replica.

Ogni sessione senior completa il ciclo catalogo → masterplan → eventuale roadmap → report e
verifiche → handoff. L'handoff è l'ultimo aggiornamento, non un nuovo passo della roadmap.
