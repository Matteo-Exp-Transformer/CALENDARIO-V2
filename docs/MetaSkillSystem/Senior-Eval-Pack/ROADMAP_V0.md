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

| # | Pacchetto | Stato al 22-08-2026 |
|---|---|---|
| `SK-0` | sbloccare i cancelli globali | **CHIUSO E OSSERVATO** 21-08 — erano tre righe di configurazione; `npm run validate` **exit 0 per la prima volta** |
| `SK-6` | `mss:query` — il **lettore** delle capsule | **esiste e funziona**; revisionato da una famiglia di modello diversa; **chiusura non decisa: decide Matteo** |
| `SK-4` | chiusura dei tre bypass + allineo contratto | `NON INIZIATO` — **i tre bypass sono provati**, non ipotizzati |
| `SK-11` | test sugli attrezzi `mss:*` | `NON INIZIATO` — oggi **nessun attrezzo ha un solo test** |
| `SK-5` | controlli MSS in CI | `NON INIZIATO` — la CI gira **solo su `main`** e non contiene nulla di MSS |
| `SK-7` | `mss:capsule` — lo **scrittore** | `NON INIZIATO` — ha già un mandato pronto, ma vedi l'ordine qui sotto |
| `SK-1`·`SK-2`·`SK-3`·`SK-8`·`SK-9`·`SK-10` | ripristino · path · `mss:review` · radice suite · `mss:move` · … | `NON INIZIATO` |

**Perché questo ordine, in una riga ciascuno.** `SK-4` per primo perché il 22-08 tre dei suoi
bypass sono stati **incontrati lavorando**, e uno di essi nasconde una **seduta di revisione**: il
buco copre proprio le prove che il sistema esiste per raccogliere. Poi `SK-11`+`SK-5`, perché
nello stesso giorno la **stessa classe di difetto è ricomparsa tre volte** — un difetto identico che
si ripete misura l'assenza di test, non la disattenzione di chi scrive. `SK-7` **dopo**, perché un
generatore che scrive in un archivio non presidiato moltiplica il problema invece di risolverlo.

**Debito trasversale scoperto il 22-08:** il sistema **sa registrare cose che non sa rileggere**.
`mss:query` legge gli stati grezzi e **non applica gli amendment**, mentre il contratto §6
prescrive una vista che applichi la catena per `effective_at`. Il limite è ora **dichiarato in
output**; **non è risolto**, e va deciso se rientra in `SK-4` o merita un pacchetto suo.

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
