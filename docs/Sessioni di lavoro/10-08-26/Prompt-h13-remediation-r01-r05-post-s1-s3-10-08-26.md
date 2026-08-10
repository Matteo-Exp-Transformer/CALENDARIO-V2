# Prompt — H-1.3 remediation (H13-R01…R05) · post decisione S1→S3

> **Uso:** nuova chat Agent · profilo **Esecuzione/Meta tecnico** · modalità **deep**.
> **NON è** review indipendente. **NON è** track-L5 “sanatoria”. **NON è** F5 path-rewrite.
> **Fonte decisioni:** chat reasoning/plan post-F4 · Matteo = **S1 poi S3** · F5 rimandato ad hoc.
> **Owner SYS-1:** `docs/MetaSkillSystem/PLAN_V0.md` (non riscrivere stato a caso).
> **Owner pack (solo allineo narrativo):** `MASTERPLAN_V0.md` / `HANDOFF_SENIOR_V0.md` — H-1.3 **non** si sana nel pack.
> **Verdetto autorevole:** `Report-revisione-indipendente-h1-3-metaskillsystem-10-08-26.md` = **FAIL**.
> Commit solo con «lavoro ok»/«fai report finale». Push solo con Sì. WP-1 vietato.

Copia da «Profilo:» in giù nella chat nuova.

---

Profilo: Meta / Esecuzione (H-1.3 remediation writer — NON revisore indipendente)
Modalità: deep (alzabile; mai abbassare)
Skill da leggere: docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md; docs/MetaSkillSystem/PLAN_V0.md (solo sezioni H-1 / gate / enforcement — leave-as-history su narrazioni stale); docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md (regole amendment); docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md (§6 backlog); docs/MetaSkillSystem/Senior-Eval-Pack/HANDOFF_SENIOR_V0.md; docs/Sessioni di lavoro/10-08-26/Report-revisione-indipendente-h1-3-metaskillsystem-10-08-26.md (intero: findings R01–R05 + riproduzioni); docs/Testing-Skill/TESTING_SKILL.md (§ prove / anti “verde fuorviante”); docs/FOLLOW_UP.md (FU-SEP-11-H13-L5); docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md; docs/Comunicazione-Skill/VOCABOLARIO.md
Prove obbligatorie: foto Git; inventario stash@{0}; restore **whitelist L5 only**; riprodurre FAIL R01/R02 prima del fix; regressioni permanenti; `npm run test:mss`; controprove §4.1/§4.3 del report H-1.3; validate:mss sul report; **non** dichiarare H-1.3 PASS
Mandato Matteo: UNA seduta di **remediation** H13-R01…R05 sul motore MSS. Ordine deciso: **S1 (piano fatto) → S3 (questa exec)**. Aprire freeze L5 **solo** per restore+fix+test. F5 path-rewrite **fuori**. Track git dei path L5 **ammesso** come conseguenza del fix (path invariati), ma il report deve dire esplicitamente: **verdetto H-1.3 resta FAIL finché nuova review indipendente**. Zero WP-1. Zero G5 PASS. Zero `_lavoro`.
Non caricare: docs/_lavoro/** (contenuti); src/ app; F5 relocate; SEP-5 freeze; Valutazione Personale; riscrittura ampia PLAN_V0 stato; claim PASS/G5; pop grezzo dello stash intero
Output attesi (in ordine):
  1) F0 foto Git + `git stash list` + classificazione stash@{0}: **L5** vs **rumore**
  2) Restore mirato L5 sul disco (**no** `stash pop` cieco). Domanda Sì/No a Matteo solo se un path borderline non è in whitelist
  3) Riproduzione pre-fix: R01 historicalWrong + R02 missingPath (come §4.1) devono fallire il contratto (oggi passano — documenta)
  4) Fix codice: R01+R02 **obbligatori**; R03+R04 **in scope**; R05 **in scope se a basso rischio**
  5) Regressioni permanenti in suite/matrice (le tre riproduzioni della review + parità staged)
  6) Gate: `npm run test:mss` + controprove manuali post-fix + `node --check` moduli toccati; ESLint Node mirato se tocchi git-adapter
  7) Report remediation + capsula; allineo FU/HANDOFF/MASTERPLAN solo narrativo («remediation fatta; PASS solo dopo review»)
  8) Commit/push solo con mandato; **prossimo atomo dichiarato** = review indipendente H-1.3 (prompt dedicato, chat nuova)
L'esecutore può solo ALZARE la modalità, mai abbassarla.

════════════════════════════════════════
OBIETTIVO
════════════════════════════════════════

Chiudere i finding HIGH (e MEDIUM/LOW in scope) della review H-1.3 con fix + regressioni, senza
autocertificare il PASS. Dopo questa chat serve una **review fredda separata** prima di qualsiasi
decisione WP-1.

════════════════════════════════════════
QUADRO (non perdere)
════════════════════════════════════════

- Branch: `env/test`. Post F4-doc: HEAD tipico `ecaa74e` / sync origin; WT **clean** all’avvio reasoning.
- L5 **non** è sul disco: è in `stash@{0}` (`wip: L5+rumore pre reasoning/plan H13`) insieme a rumore
  (hooks Cursor, Comunicazione ERRORI/OSS/PROP, pezzi CONTRATTO/PROTOCOLLO, ecc.).
- In git oggi: quasi zero L5 (solo ~2 fixture FX-V02 + `package.json` tracked). Restore ≠ sanatoria.
- Solidi chiusi (non riaprire): SEP-10 · F1–F3+stub · F4-doc · G1 PASS_CON_RISERVE · D1–D5.
- Gate: **SEP-G5 non PASS** · H-1.3 review = **FAIL** · suite verde ≠ PASS.
- F5 path-rewrite: **rimandato** (task ad hoc dopo, se merita).
- Due owner: pack ≠ SYS-1; non “sanare” H-1.3 riscrivendo lo stato pack come se fosse PASS.

════════════════════════════════════════
WHITELIST RESTORE / TOUCH (L5)
════════════════════════════════════════

**Ripristinare e potenzialmente committare (path invariati):**

- `scripts/mss/**` (almeno: `core.mjs`, `cli.mjs`, `adapter.mjs`, `git-adapter.mjs`, e moduli usati)
- `docs/MetaSkillSystem/tests/h1/**` (`run.mjs`, `fixture-factory.mjs`, …)
- `docs/MetaSkillSystem/fixtures/v0.1/**` (intere; fingerprint frozen — **non** riscrivere fixture frozen
  salvo necessità dimostrata + Sì Matteo)
- `docs/MetaSkillSystem/COVERAGE_MATRIX_H1.json`
- `package.json` **solo** se già nello stash e serve agli script mss (diff minimo)

**NON ripristinare da stash in questa chat (rumore):**

- `.cursor/hooks/**`
- `docs/Comunicazione-Skill/ERRORI_PROCESSO.md` · `OSSERVAZIONI.md` · `PROPOSTE.md`
- modifiche ampie a `CONTRATTO_CAPSULA_SESSIONE_V0.md` / `PROTOCOLLO_PRIMO_PILOTA_V0_1.md`
  salvo **diff minimo** obbligatorio per R01/R02 (se serve chiarire encoding `previous` — chiedi Sì)

**Come restore (PowerShell-safe):**

1. Elenca: `git stash show -u --name-only "stash@{0}"`
2. Checkout selettivo dei path L5 dallo stash (untracked tipicamente su `stash@{0}^3`):
   - preferisci restore per directory/whitelist, **mai** `git stash pop`
3. Dopo restore: `git status` — verifica che rumore **non** sia tornato
4. Lascia lo stash intatto finché Matteo non autorizza drop (dopo commit ok)

════════════════════════════════════════
FINDINGS — SCOPE
════════════════════════════════════════

| ID | Sev | Trattamento |
|---|---|---|
| H13-R01 | HIGH | **FIX obbligatorio** — `previous` anche su target storico |
| H13-R02 | HIGH | **FIX obbligatorio** — deny su `field_path` invalido/assente (no fail-open) |
| H13-R03 | MEDIUM | **FIX in scope** — CLI staged usa snapshot completo |
| H13-R04 | MEDIUM | **FIX in scope** — suite/matrice non sovradichiarino copertura |
| H13-R05 | LOW | **FIX se banale** — warning ESLint `git-adapter.mjs` |

Fuori scope: WP-1 · SEP-5 · F5 relocate · G5 PASS · privato L6 · “track tutto il rumore stash”.

════════════════════════════════════════
METODO
════════════════════════════════════════

1. Leggi report H-1.3 findings + riproduzioni; dichiara ruolo **writer remediation**.
2. F0 + classifica stash; restore whitelist L5.
3. Riproduci R01/R02 **prima** del fix (evidenza nel report).
4. Implementa fix minimi + regressioni permanenti (API/CLI/pre-commit dove pertinente).
5. Rilancia suite ufficiale + controprove review; documenta verde **post-fix** senza dire PASS globale.
6. Report remediation in `docs/Sessioni di lavoro/10-08-26/`; capsula; allineo FU
   `FU-SEP-11-H13-L5` → stato «remediation fatta; manca review»; HANDOFF/MASTERPLAN narrativi.
7. Commit solo con mandato; **non** aprire review nella stessa chat.

Criterio di fatto
- R01/R02 non più fail-open sulle riproduzioni della review
- Regressioni presenti e verdi
- Report dice: **H-1.3 non PASS** finché review indipendente
- Zero path-rewrite F5; zero WP-1; rumore stash non committato

Prossimo atomo (dichiarare in chiusura, non eseguire)
- Chat **Verifica** indipendente H-1.3 (prompt dedicato post-remediation)

════════════════════════════════════════
STOP
════════════════════════════════════════

`stash pop` grezzo; claim PASS/G5; WP-1; F5; `_lavoro`; commit rumore hooks/Comunicazione;
riscrittura frozen fixture senza Sì; review autocertificata nella stessa seduta; push senza Sì.
