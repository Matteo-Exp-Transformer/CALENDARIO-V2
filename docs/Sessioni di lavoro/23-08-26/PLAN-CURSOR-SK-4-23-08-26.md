# Piano condiviso CURSOR — `SK-4` chiusura tre bypass enforcement

> Data: 23-08-2026
> Stato del documento: **PIANO OPERATIVO — pronto per lancio parallelo**
> Branch di lavoro: `env/test`
> Owner operativo del ciclo: questo file. Gli agenti esecutori lo leggono; lo aggiorna solo il
> coordinatore (senior / prepara-prompt) per evitare stati concorrenti.
> **Gemello parallelo (Codex):** `PLAN-CODEX-SK-11-SK-5-23-08-26.md` — **nessuna sovrapposizione**
> su test attrezzi, lint `.mjs`, CI. Codex **non** tocca `adapter.mjs`.

## 1. Risultato da ottenere

Chiudere i **tre bypass dell'enforcement** già provati (non ipotizzati), come definito in
`PLAN_V0.md` §4-bis riga `S4`:

| ID | Attacco | Stato oggi | Chiusura attesa |
|---|---|---|---|
| B1 | Coppia legacy `mss.session/0.1.0` + `mss-v0.1-wp0.1-freeze-1` rende **opzionale** `controls` | `validate:mss OK` su capsula senza prove | **Record nuovi** con coppia legacy → **FAIL**; storico **non riscritto**, ancora leggibile |
| B2 | Report in **sotto-cartella** fuori dal pre-commit | filtro `[^/]+` in `adapter.mjs` riga 13; ~**22 report reali** fuori perimetro (V5, 21-08) | Staged/modificati in sotto-cartella → **validati** |
| B3 | **Prefisso nome** diverso da `Report-` (es. `Verbale-`) | esce dal regex | Prefissi concordati → **validati** |

**Prova di chiusura del pacchetto:** i tre attacchi documentati vengono **respinti** con comando,
non a parole.

**Fuori perimetro SK-4 (backlog esplicito):**

- `rule_id_version` testo libero · campi strutturati per gate/file toccati
- messaggio hook su `_skill-system-v0/`
- `SK-11` / `SK-5` / `SK-7`
- suite attrezzi `mss:query`/`mss:status` (`docs/MetaSkillSystem/tests/tools/**`)
- refactor importabilità `query.mjs` / `status.mjs` (SK-11)
- move/rename archivio, DB, `src/`

## 2. Stato reale ricostruito

- `SK-6` **CHIUSO** (D16, 23-08): `mss:query` delega `core.mjs::applyAmendmentsView()`.
- Prove bypass: `MAPPA-MSS-consulenza-esterna-21-08-26.md` §6 (V3, V5, V6);
  `Report-consulenza-esterna-fable-mss-21-08-26.md` §2.1;
  `HANDOFF_SENIOR_V0.md` «Problema strutturale» punto 2.
- **Codice oggi:**
  - `adapter.mjs` riga 13: `REPORT_RE = /^docs\/Sessioni di lavoro\/[^/]+\/Report-.*\.md$/i`
  - `git-adapter.mjs` `collectGitHeadHistory()` righe 114–116: **duplicato** del filtro, non usa
    `isMssRelevantPath()`
  - `query.mjs` riga 49: filtro lettura più largo (`.*`) — **divergenza fino a SK-4**
  - `core.mjs` righe 302–303: `controls` obbligatorio solo se `schema_version !== '0.1.0'`
- `CONTRATTO_CAPSULA_SESSIONE_V0.md`: avviso in testa; corpo §3 ancora 0.1.0/freeze-1.
- **D18:** una sola implementazione per regola path; esportare da `adapter.mjs`, importare altrove.

## 3. Decisioni di Matteo — gate di lancio

| ID | Decisione | Raccomandazione | Stato |
|---|---|---|---|
| `G1` | Allargare pre-commit ai report in **sotto-cartella** (~22 report oggi esclusi) | **Sì** — misurare conteggio esatto a baseline | **AUTORIZZATA da Matteo il 23-08-26** |
| `G2` | Prefissi ammessi oltre `Report-` | **Sì a `Verbale-`** (V6); no wildcard su ogni `.md` | **AUTORIZZATA da Matteo il 23-08-26** |
| `G3` | Legacy: bloccare solo **record nuovi** vs vietare del tutto | **Solo nuovi** — storico 0.1.0 resta leggibile | **AUTORIZZATA da Matteo il 23-08-26** |
| `G4` | Ri-allineare **contratto** a `0.1.1`/`freeze-2` come versione viva | **Sì** | **AUTORIZZATA da Matteo il 23-08-26** |
| `G5` | Fixture H-1 supplemental per B1 (es. `FX-I11`) | **Sì, una sola** — in `test:mss`, non SK-11 | **AUTORIZZATA da Matteo il 23-08-26** |
| `G6` | Lancio parallelo con Codex SK-11 attivo | **Sì** se rispettata matrice file §5; SK-11 **non** tocca `adapter.mjs` | **AUTORIZZATA da Matteo il 23-08-26** |

✅ **Gate sbloccato** — Matteo, chat 23-08-26: «autorizzo g1 g2 g3 g4 g5 g6 sk-4». Wave 1 può partire.

Regex path **proposta** (default se G1+G2 = Sì):

```text
/^docs\/Sessioni di lavoro\/.+\/(Report|Verbale)-.*\.md$/i
```

## 4. Vincoli non negoziabili

### 4.1 Contesto da caricare

1. `docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md` intero.
2. `PLAN_V0.md` §4-bis (`S4`), §15 (`D16`–`D19`), §16.
3. `CONTRATTO_CAPSULA_SESSIONE_V0.md` (avviso, §2, §3, §5–§6).
4. `adapter.mjs`, `git-adapter.mjs`, `core.mjs` (vitali + legacy), `rules.mjs`.
5. `MAPPA-MSS-consulenza-esterna-21-08-26.md` §6.
6. Voci 23-08-26 in `EVOLUZIONE_SKILLS.md` (D18).

**Non** caricare `TESTING_SKILL.md` salvo revisore che verifica `test:mss`.

### 4.2 Scrittura per pacchetto (matrice conflitti)

| Path / area | E1 path | E2 legacy | E3 contratto | E4 integrazione | SK-11 Codex |
|---|---|---|---|---|---|
| `scripts/mss/adapter.mjs` | **Sì** | No | No | lettura | **No** |
| `scripts/mss/git-adapter.mjs` | **Sì** | No | No | lettura | No |
| `scripts/mss/query.mjs` | **Sì** (solo import costante) | No | No | messaggi SK-4 | **Sì** (refactor) |
| `scripts/mss/core.mjs` | No | **Sì** | No | lettura | Sì |
| `scripts/mss/rules.mjs` | No | **Sì** | No | lettura | Sì |
| `CONTRATTO_CAPSULA_SESSIONE_V0.md` | No | No | **Sì** | lettura | No |
| `fixtures/v0.1/**` + manifest | No | **Sì** (se G5) | No | verifica | No |
| `PLAN_V0.md` §4-bis riga S4 | No | No | No | **Sì** (post-prove) | No |
| `docs/MetaSkillSystem/tests/tools/**` | No | No | No | No | **Sì** |

**Regola conflitto `query.mjs`:** E1 modifica **solo** import della costante esportata e commenti
SK-4; niente refactor CLI. SK-11 parte **dopo** merge wave 1 o su branch coordinato.

### 4.3 Regole architetturali

- **Un solo owner regex path:** `adapter.mjs` esporta costante + `isMssRelevantPath()`; altri importano.
- **Un solo owner regola legacy:** `core.mjs` + codice in `rules.mjs`.
- Storico: capsule `final` esistenti **non** si modificano.
- `npm run validate` verde **non** prova `scripts/` — usare `node --check`, `test:mss`, `validate:mss`.
- Artefatti di prova temporanei sotto `23-08-26/_prova-sk4/` — **rimossi** prima della chiusura.

## 5. Organizzazione multi-agente (≥3 modelli in parallelo)

### Wave 1 — tre esecutori **in parallelo** (zero overlap file)

| Slot | Ruolo | Prompt | File in proprietà | Modello suggerito |
|---|---|---|---|---|
| **E1** | Perimetro path B2+B3 | `Prompt-sk4-e1-perimetro-path-23-08-26.md` | `adapter.mjs`, `git-adapter.mjs`, `query.mjs` (minimo) | Cursor Agent 1 |
| **E2** | Legacy B1 (+ fixture G5) | `Prompt-sk4-e2-legacy-core-23-08-26.md` | `core.mjs`, `rules.mjs`, fixture opz. | Cursor Agent 2 / Codex |
| **E3** | Allineo contratto | `Prompt-sk4-e3-contratto-23-08-26.md` | `CONTRATTO_CAPSULA_SESSIONE_V0.md` | terzo modello (es. Claude) |

**Coordinatore:** verifica G1–G6, aggiorna registro §9, **non** scrive codice applicativo.

Gate Wave 1: ciascun esecutore consegna mini-report in
`Report-sk4-e{N}-*-23-08-26.md` + aggiorna riga propria in §9.

### Wave 2 — integrazione **sequenziale** (un solo agente)

| Slot | Ruolo | Prompt |
|---|---|---|
| **E4** | Integrazione + dimostrazioni B1–B3 | `Prompt-sk4-e4-integrazione-23-08-26.md` |

Parte **solo** quando E1+E2+E3 = `COMPLETATO` in §9. Nessun file di Wave 1 in modifica salvo bug
bloccante documentato nel piano.

### Wave 3 — revisione **indipendente** (fuori dal parallelismo esecutori)

| Slot | Ruolo | Prompt |
|---|---|---|
| **R1** | Revisore indipendente | `Prompt-sk4-revisione-indipendente-23-08-26.md` |

Famiglia di modello **diversa** consigliata (D17), non gate. Non corregge codice: solo report
revisione + eventuale handoff fix.

### Ruoli non esecutori

| Ruolo | Può dichiarare SK-4 chiuso? |
|---|---|
| Coordinatore / senior | No |
| E1–E4 | No |
| R1 | No |
| **Matteo** | **Sì** |

## 6. Piano esecutivo per slot

### E1 — Perimetro path (B2 + B3)

1. Esportare `REPORT_PATH_RE` (o equivalente) da `adapter.mjs`; aggiornare `isMssRelevantPath()`.
2. `git-adapter.mjs`: `collectGitHeadHistory()` usa **`isMssRelevantPath()`** — eliminare duplicato.
3. `query.mjs`: importare costante condivisa; rimuovere regex locale (D18).
4. `node --check` sui tre file.
5. Mini-report con conteggio report entrati nel perimetro (comando + numero, non a memoria).

### E2 — Legacy record nuovi (B1)

1. In `core.mjs`, negare coppia legacy su record **nuovi** (criterio G3).
2. Nuovo codice regola in `rules.mjs` (nome proposto: `MSS-LEGACY-NEW-FORBIDDEN`).
3. Se G5: una fixture supplemental + manifest; **non** toccare hash frozen.
4. `npm run test:mss` verde.
5. Mini-report: prova capsula sintetica legacy-new → FAIL (exit + codice).

### E3 — Contratto (G4)

1. Aggiornare corpo §3 a `0.1.1` / `freeze-2`; sezione storico 0.1.0 separata.
2. §2: path ammessi coerenti con regex approvata in G1/G2.
3. Ridurre avviso in testa quando B1 è implementato (E2) — se E2 non pronto, avviso resta.
4. Mini-report: cosa ha cambiato rispetto all'avviso precedente.

### E4 — Integrazione

1. Merge logico delle tre wave (git diff unificato).
2. Dimostrazioni obbligatorie B1, B2, B3 (tabella §7).
3. `npm run test:mss`, `validate:docs` baseline 17, `mss:query --verifica`.
4. Report unico: `Report-ciclo-SK-4-23-08-26.md`.
5. Aggiornare `PLAN_V0.md` §4-bis riga `S4` **solo** con prove; chiusura = Matteo.

## 7. Dimostrazioni B1–B3 (E4 + R1)

| Bypass | Procedura | Prova da registrare |
|---|---|---|
| B1 | File temporaneo: capsula nuova `0.1.0`/`freeze-1` senza `controls` | exit ≠ 0, codice regola |
| B2 | `23-08-26/_prova-sk4/sub/Report-….md` capsula invalida, staged | pre-commit / validate staged → deny |
| B3 | Stesso con `Verbale-….md` se G2 | idem B2 |

Ripristinare worktree; nessun artefatto committato.

## 8. Report e chiusura

**Report unificato:** `docs/Sessioni di lavoro/23-08-26/Report-ciclo-SK-4-23-08-26.md`

**Mini-report wave 1:**

- `Report-sk4-e1-perimetro-path-23-08-26.md`
- `Report-sk4-e2-legacy-core-23-08-26.md`
- `Report-sk4-e3-contratto-23-08-26.md`

Capsula: UUIDv7, schema/revision da `rules.mjs` righe 3–6, `segment_no: 1`, `self_report`,
`controls` con exit code reali.

Domande di chiusura — **verbatim** da `CHIUSURA_SESSIONE.md` §11:

```text
❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1:

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2:

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3:

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4:

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, scrivi «nessuna osservazione» e cosa hai verificato.)
✅ R5:

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6:
```

## 9. Registro avanzamento

| Slot | Stato | Agente / modello | Prova / handoff |
|---|---|---|---|
| Piano | `COMPLETATO` | Cursor prepara-prompt | file creati 23-08-26 |
| G1–G6 | `AUTORIZZATE` | Matteo | chat 23-08-26 |
| **E1** path | `COMPLETATO` | Cursor Agent (Composer) | [Report-sk4-e1-perimetro-path-23-08-26.md](./Report-sk4-e1-perimetro-path-23-08-26.md) |
| **E2** legacy | `COMPLETATO` | Cursor Agent E2 | `Report-sk4-e2-legacy-core-23-08-26.md` · `MSS-LEGACY-NEW-FORBIDDEN` · FX-I11 · test:mss 42 fixture |
| **E3** contratto | `COMPLETATO` | Cursor Agent (E3) | `Report-sk4-e3-contratto-23-08-26.md` — contratto allineato 0.1.1/freeze-2; §2 path G1/G2; §4 controls |
| **E4** integrazione | `COMPLETATO` | Cursor Agent E4 | [Report-ciclo-SK-4-23-08-26.md](./Report-ciclo-SK-4-23-08-26.md) · dimostrazioni B1–B3 · wiring `historicalSnapshots`/`headContent` in `adapter.mjs` |
| **R1** revisione | `COMPLETATO` | Cursor Agent R1 (Composer) | [Report-sk4-revisione-indipendente-23-08-26.md](./Report-sk4-revisione-indipendente-23-08-26.md) · B1–B3 controprove verdi · raccomandazione **accetta** · 2 note non bloccanti |
| Chiusura SK-4 | `NON INIZIATO` | Matteo | — |

## 10. Criterio di arresto

Fermarsi e aggiornare handoff se:

- G1–G6 non risolte in §3;
- serve toccare file di un altro slot Wave 1;
- serve suite SK-11, CI, o refactor `query.mjs` oltre import costante;
- modifica rompe fixture **frozen**;
- diff su capsule storiche;
- push non autorizzato per dimostrare pre-commit.

## 11. Prompt di avvio — indice

| File | Destinatario |
|---|---|
| `Prompt-sk4-e1-perimetro-path-23-08-26.md` | Esecutore E1 |
| `Prompt-sk4-e2-legacy-core-23-08-26.md` | Esecutore E2 |
| `Prompt-sk4-e3-contratto-23-08-26.md` | Esecutore E3 |
| `Prompt-sk4-e4-integrazione-23-08-26.md` | Esecutore E4 (dopo Wave 1) |
| `Prompt-sk4-revisione-indipendente-23-08-26.md` | Revisore R1 |
| `HANDOFF-CURSOR-SK-4-23-08-26.md` | Coordinatore / senior |
