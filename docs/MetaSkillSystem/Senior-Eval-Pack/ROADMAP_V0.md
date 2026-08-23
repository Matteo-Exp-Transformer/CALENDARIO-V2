# Roadmap — Senior Eval Pack v0

> Vista statica della sequenza definita in `MASTERPLAN_V0.md`.
> Non possiede stato, gate, decisioni vive o percentuali di avanzamento.

> ## ⚠️ Questa roadmap copre una traccia **parcheggiata** — aggiornato 22-08-2026
>
> Il percorso `SEP-*` qui sotto **non è il fronte di lavoro attuale**. Dal 21-08-2026 la traccia
> viva è **`SK-*`**: lo «scheletro con attrezzi» di `../PLAN_V0.md` §4-bis, con il target in §16.
>
> Parcheggiata **non** vuol dire annullata, e nessuno stato è stato promosso: `SEP-G5` **non** è
> PASS, `WP-1` resta **NO-GO**, `H-1.3` resta `PASS_CON_RISERVE` (non PASS pulito).
>
> **Se cerchi il prossimo passo, non è in questo file:** apri `../PLAN_V0.md` §4-bis e
> `HANDOFF_SENIOR_V0.md` §3. Il punto 9 qui sotto indicava «plan directory/export/sandbox» come
> prossimo atomico: quel task è **congelato dalla decisione `D15`** di Matteo.

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
   sovrapposizioni e vincoli (`SEP-10`). *Vista 10-08-2026:* A1–A4 + B1 + B2 chiuse nel disegno;
   B2 = `ADEGUATO_CON_RISERVE`; D1–D5 registrate (`024`); lo stato vivo resta nel masterplan.
9. **Preparare / avviare la migrazione documentale controllata** — matrice source→target, ordine,
   test, rollback e autorizzazione per fase (`SEP-11`, gate `SEP-G5`). *Vista 21-08-2026:*
   F1–F3+review e F4-doc chiusi; baseline L5+hook committed e pushed in `ee0ab39`; H-1.3 =
   **`PASS_CON_RISERVE`** (non PASS pulito); preparazione `036` chiusa documentalmente in `037`.
   ~~Prossimo atomico = plan directory/export/sandbox~~ → **CONGELATO il 21-08-2026 dalla
   decisione `D15`** (`../PLAN_V0.md` §16.4): riordinare l'albero prima di avere gli attrezzi
   ripeterebbe il costo misurato del primo move. F5 resta fuori. SEP-5 bloccato; **SEP-G5 non
   PASS**; WP-1 **NO-GO**.
10. **Passare da sperimentale ad affidabile** — solo dopo almeno un ciclo prospettico revisionato,
    debiti critici risolti o accettati e decisione esplicita di Matteo (`SEP-12`).

## Traccia viva — `SK-*` (dal 21-08-2026)

> Vista, non owner. Lo stato vero è in `../PLAN_V0.md` §4-bis; in caso di divergenza vince quello.
> Ordine dichiarato: **prima ciò che è gratis e sblocca, poi ciò che legge, poi ciò che scrive.**

| # | Pacchetto | Stato al 23-08-2026 |
|---|---|---|
| `SK-0` | sbloccare i cancelli globali | **CHIUSO E OSSERVATO** 21-08 — erano tre righe di configurazione; `npm run validate` **exit 0 per la prima volta** |
| `SK-6` | `mss:query` — il **lettore** delle capsule | **CHIUSO 23-08-26 (D16)** — vista effettiva applicata; `query.mjs` delega `core.mjs::applyAmendmentsView()`. Report: `docs/Sessioni di lavoro/23-08-26/Report-vista-effettiva-mss-query-23-08-26.md` |
| `SK-4` | chiusura dei tre bypass + allineo contratto | **`PROVATO` 23-08-26** — E1–E4 + R1 completati; chiusura formale solo Matteo. Owner: `PLAN_V0.md` §4-bis `S4` · report [`Report-ciclo-SK-4-23-08-26.md`](../../Sessioni%20di%20lavoro/23-08-26/Report-ciclo-SK-4-23-08-26.md) |
| `SK-11` | test sugli attrezzi `mss:*` | **`A1–A4 IMPLEMENTATI` 23-08-26** — suite tools estesa (16 post-Fase B); **in attesa revisione integrata E**. Owner: `PLAN_V0.md` §4-bis `S11` |
| `SK-5` / D1-A | controlli MSS in CI | **`implementazione self_report` (Fase C)** — job `mss` separato da `ci`; simulazione locale verde; **GA remota non osservata**; revisione E |
| `SK-7` | `mss:capsule` — lo **scrittore** | `NON INIZIATO` — **non** prossimo passo immediato (dopo E + push, non prima) |
| `SK-1`·`SK-2`·`SK-3`·`SK-8`·`SK-9` | ripristino · path · `mss:review` · radice suite · `mss:move` | `SK-2`/`SK-8` implementati non allineati · resto `NON INIZIATO` |
| `SK-10` | manuale + bootstrap | **`IN CORSO — P2A`** — vedi [`../MANUALE_OPERATIVO_MSS_V0.md`](../MANUALE_OPERATIVO_MSS_V0.md); P2B export non provato |

### Rettifica di stato — audit tecnico 23-08-26

La tabella appena sopra è una fotografia precedente all’audit e non va usata per avviare lavoro.
La vista attuale è `../PLAN_V0.md` §4-ter, con fonte
[`../AUDIT_STATO_REALE_23-08-26.md`](../AUDIT_STATO_REALE_23-08-26.md):

- `SK-4` e `SK-5` sono **aperti**, non chiusi: D1 rende il pre-commit più debole della CI.
- `SK-7` è **aperto**: P0 ha documentato l’**assenza** del fix dichiarato (nessun artefatto
  recuperabile); D2/D3 restano vivi a `46b8bca`. Non è “non iniziato” e non è verificato verde.
- `SK-8` è implementato ma mai dichiarato, `SK-2` esiste ma riporta stato stale, `SK-11` ha 23
  test verdi ma copertura insufficiente e numeri sbagliati in documentazione/output.
- **Ordine operativo aggiornato:** P0 (assenza) → **gate Matteo A/B** → ~~P1 D1/D4/D5~~ **P1 chiuso**
  → **P2A** manuale locale (**in corso**) → **P2B** export/bootstrap → P3 → P4.
  Manuale: [`../MANUALE_OPERATIVO_MSS_V0.md`](../MANUALE_OPERATIVO_MSS_V0.md) · Report P1:
  `../../Sessioni di lavoro/23-08-26/Report-p1-d1-d4-d5-23-08-26.md`.

**Perché questo ordine, in una riga ciascuno.** `SK-4` per primo perché il 22-08 tre dei suoi
bypass sono stati **incontrati lavorando**, e uno di essi nasconde una **seduta di revisione**: il
buco copre proprio le prove che il sistema esiste per raccogliere. Poi `SK-11`+`SK-5`, perché
nello stesso giorno la **stessa classe di difetto è ricomparsa tre volte** — un difetto identico che
si ripete misura l'assenza di test, non la disattenzione di chi scrive. `SK-7` **dopo**, perché un
generatore che scrive in un archivio non presidiato moltiplica il problema invece di risolverlo.

**Debito trasversale scoperto il 22-08, ✅ CHIUSO il 23-08:** il sistema **sapeva registrare cose
che non sapeva rileggere**. `mss:query` leggeva gli stati grezzi e non applicava gli amendment che
il contratto §6 prescrive. Dal 23-08 li applica: `--verifica`, `--fail`, riepilogo e `--json`
mostrano **grezzo ed effettivo affiancati** (la differenza fra i due è essa stessa un dato), e le
catene che non si risolvono sono elencate, mai riparate. La logica **non è duplicata**: `query.mjs`
delega a `core.mjs::applyAmendmentsView()`, la stessa funzione del validator.

**Piani sessione 23-08-26 (vista, non owner):** esecuzione **completata** su `SK-4` (Cursor),
**A1–A4** Codex `SK-11`, **Fasi B/C** post-revisione (`self_report`), **Fase D** documentale
(rettifiche append-only + igiene whitespace). Commit storico locale **`d1598b6`** (M1, no rewrite).
Modifiche B/C tracked non committate oltre quel commit. Registro:
`docs/Sessioni di lavoro/23-08-26/INDICE-SESSIONE-23-08-26.md` · owner in `PLAN_V0.md` §4-bis.

**Prossimo passo autorizzato:** revisione integrata **E**, poi gate locale e decisione push (M2).
Nessuna GitHub Actions reale osservata. `validate:docs`: 17 workspace / 26 checkout pulito.

## Lettura operativa

- Per sapere dove siamo o quale gate blocca il passo successivo: `MASTERPLAN_V0.md`.
- Per costruire o giudicare un'istanza: `CONTRATTO_EVAL_SENIOR_V0.md`.
- Per precedenti e famiglie metodologiche: `CATALOGO_SEDUTE_E_METODI_V0.md`.
- Per scegliere il documento minimo da aprire: `SENIOR_EVAL_SKILL.md`.
- Per riprendere l'ultimo lavoro e chiudere una nuova sessione: `HANDOFF_SENIOR_V0.md`; il suo
  prossimo task va sempre verificato nel masterplan.
- Per lo stato globale del MetaSkillSystem: `../PLAN_V0.md`; questa roadmap non lo replica.

Ogni sessione senior completa il ciclo catalogo → masterplan → eventuale roadmap → report e
verifiche → handoff. L'handoff è l'ultimo aggiornamento, non un nuovo passo della roadmap.
