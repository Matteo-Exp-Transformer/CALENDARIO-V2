# Revisione indipendente — ciclo T6 Codex + chiusura riserve M12

> **Per:** Cursor senior (Composer), famiglia **diversa** da OpenAI/Codex.
> **Branch:** `env/test` · **NO commit/push** salvo «sì» esplicito di Matteo a fine seduta.
> **Preferenza Matteo:** chiudere le riserve M12 **se** non si chiudono da sole con l'uso normale del sistema; altrimenti documentare «accettata / backlog» e proseguire.

---

```text
Profilo: Verifica
Modalità: deep
Skill da leggere:
  - docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md
  - docs/MetaSkillSystem/SCHEDA_CHIUSURA_META_R1.md
  - docs/MetaSkillSystem/PROMPT_ORCHESTRATOR_MSS_24-08-26.md (§6, §7)
  - docs/MetaSkillSystem/PLAN_V0.md (§4-bis S4/S8/R1, ciclo T6 duodecimo, D17, M12)
Non caricare: APP_CONTEXT intero · docs/_lavoro/ · src/ · DB · corpus storico non puntato
Output attesi: un report di revisione + judgments R1 + capsula generata; tabella riserve con raccomandazione CHIUDI / AUTO / ACCETTA / BACKLOG; nessuna modifica codice salvo handoff esplicito
```

---

## 1. Ruolo

Sei **revisore indipendente Cursor** del ciclo T6 orchestrato da Codex. Codex ha già prodotto esecutori, controverifiche interne OpenAI e report orchestratore. **Non fidarti**: rifai diff e comandi.

Obiettivo doppio:
1. **Verdetto tecnico** su R1 + SK-4 + SK-8 + report orchestratore.
2. **Piano riserve M12**: per ciascuna riserva, dire se va chiusa ora, si chiude da sola dopo commit/uso, va accettata permanentemente, o va in backlog separato.

---

## 2. Artefatti Codex (leggere tutti)

| Tipo | Path |
|------|------|
| Mandato | `Prompt-orchestratore-codex-R1-SK4-SK8-24-08-26.md` |
| Orchestratore | `Report-orchestratore-t6-r1-sk4-sk8-24-08-26.md` |
| R1 esecutore / revisore | `Report-r1-completamento-t6-24-08-26.md` · `Report-controverifica-r1-t6-24-08-26.md` |
| SK-4 esecutore / revisore | `Report-sk4-completamento-t6-24-08-26.md` · `Report-controverifica-sk4-t6-24-08-26.md` |
| SK-8 esecutore / revisore | `Report-sk8-promozione-t6-24-08-26.md` · `Report-controverifica-sk8-t6-24-08-26.md` |
| Owner (solo lettura) | `PLAN_V0.md` §4-bis · ciclo T6 · `CRUSCOTTO_MATTEO_MSS.md` |

---

## 3. Passo 0

```bash
git rev-parse HEAD
git status --porcelain
npm run mss:status
npm run mss:query -- --verifica
```

HEAD atteso ciclo: `6ec9dbaddae62a643e713096495d26f2bb640904`. Tutto T6 è ancora **uncommitted** (26 file circa).

---

## 4. Protocollo §6 — riesegui tu

### Gate globali (tutti exit 0 attesi)

```bash
node --check scripts/mss/core.mjs scripts/mss/adapter.mjs scripts/mss/review.mjs
node --check docs/MetaSkillSystem/tests/h1/run.mjs docs/MetaSkillSystem/tests/tools/run.mjs
npm run test:mss
npm run test:mss:tools
npm run validate:docs
npm run validate:mss:views
npm run validate:mss:all
git diff --check
```

Validazione `--require-capsule` su **tutti e sette** i report T6 (6 mandati + orchestratore).

### Prove mirate

| Mandato | Prova | Non vacuo se… |
|---------|-------|----------------|
| R1 | test `capsule: R1 — tre soli giudizi…` | mutazione rompe validità capsula |
| SK-4 B1 | due legacy nuovi staged identici | senza separazione committed → primo verde |
| SK-4 B2/B3 | Report/Verbale in sotto-cartella | deny con modalità deep |
| SK-4 D18 | grep regex path + test tools | `review.mjs` ≠ `REPORT_PATH_RE` |
| SK-8 | test nominato cwd esterna | cwd=repo root → rosso |

Misura SK-8: `npm run test:mss` **non** deve raddoppiare la suite (~35s vs ~62s baseline orchestratore).

---

## 5. Matrice riserve M12 — valuta e classifica

Per **ogni** riga compila: **Stato verificato** · **Raccomandazione** (`CHIUDI_ORA` | `AUTO_POST_COMMIT` | `AUTO_USO` | `ACCETTA` | `BACKLOG`) · **Azione concreta**.

| ID | Riserva | Cosa dice Codex |
|----|---------|-----------------|
| **R1-A** | Amendment esecutore T6 su record R1 **storico** con `independently_verified` (stesso attore) | Non conta come M12 aggiuntivo; resta autoritaria controverifica Cursor mattina |
| **R1-B** | Campi busta `non_osservato` (area, observed_outcome) | Costanti R1_MODE_CONSTANTS, non riapertura |
| **T6-ORPHAN** | `--verify` → `MSS-AMENDMENT-ORPHAN` su record in report **untracked** | Fail-closed corretto; amendment dopo visibilità canonica |
| **T6-FAM** | Controverifiche T6 tutte **OpenAI** (gpt-5.6-sol vs gpt-5); D17 = avviso non gate | Cursor colma gap famiglia per decisione Matteo |
| **SK4-ASSERT** | Capsula controverifica SK-4: assertion Output troppo forte su amendment non emesso | Esclusa da orchestratore come evidenza; rettifica post-commit |
| **SK4/SK8-SIG** | Firma formale Matteo pendente | Non è bug; gate umano M12 consumato da firma |
| **H13-E2** | H-1.3 PASS_CON_RISERVE (bypass E2) | **Fuori T6** — non dichiarare PASS pulito |

**Regola Matteo:** se la riserva si chiude **automaticamente** al primo commit + `--verify` riuscito, o al primo uso agente con scheda R1, classifica `AUTO_*` e **non** aprire mandato codice. Se serve fix motore o amendment documentato, classifica `CHIUDI_ORA` con mandato minimo.

---

## 6. Decisione richiesta nel report

Al termine, una sezione **«Raccomandazione a Matteo»** con **una** di queste linee (motivata):

### Opzione A — Chiudi riserve, poi commit
- Cursor conferma PASS / PASS_CON_RISERVE su ciclo T6.
- Matteo firma SK-4 + SK-8.
- Commit unico T6 → batch `--verify` sui record Sistema (evidence_ref path completi ai report).
- Eventuale amendment assertion SK4-ASSERT.
- **Prossimo lavoro:** pilota/WP-1 solo se Matteo riapre D27; altrimenti backlog opzionale (hook Q/R, require-capsule staged).

### Opzione B — Prosegui senza mandato riserve
- Riserve T6-ORPHAN e SK4-ASSERT = `AUTO_POST_COMMIT` (documentare procedura in handoff).
- R1-A, R1-B, T6-FAM = `ACCETTA` con Cursor come unica controverifica famiglia diversa del ciclo.
- Matteo firma + commit; nessun fix codice aggiuntivo.

### Opzione C — Respingi / fix mirato
- Almeno una controprova B1–B3 o SK-8 **rossa** al rieseguire.
- Elenca fix minimo e **non** firmare.

---

## 7. Output

1. `docs/Sessioni di lavoro/24-08-26/Report-revisione-indipendente-ciclo-t6-codex-24-08-26.md`
   - Verdetto globale PASS / PASS_CON_RISERVE / FAIL
   - Tabella M12 (R1, SK-4, SK-8) con colonna **Cursor rieseguito**
   - Matrice riserve §5 compilata
   - Raccomandazione Opzione A/B/C
   - Q1–Q6 verbatim (`CHIUSURA_SESSIONE.md`)

2. `judgments-revisione-indipendente-ciclo-t6-codex-24-08-26.json` (tre assi R1)

3. Capsula via `mss:capsule --append-to` (mai header manuale).

---

## 8. Divieti

- Non modificare codice, PLAN, cruscotto, report Codex
- Non commit/push senza sì Matteo
- Non dichiarare SK-4/SK-8 CHIUSO (solo firma Matteo dopo tuo verdetto)
- Non riaprire verdetto M12 storico R1 mattina
- Non aprire WP-1, SK-10, prodotto
- Non forzare `--verify` se ORPHAN: documenta; proponi retry **dopo** commit come procedura

---

## 9. Messaggio Matteo (preferenza riserve)

«Preferirei chiudere le riserve sempre che non si chiudano da sole utilizzando il sistema in futuro.»

Interpretazione operativa per il revisore:
- **AUTO_USO / AUTO_POST_COMMIT** → non aprire pacchetti tecnici; spiega il lifecycle.
- **CHIUDI_ORA** → solo se resta un buco strutturale dopo commit simulato o prova d'uso.
- Distinguere **riserve di processo** (firma, untracked) da **riserve di correttezza** (controprova rossa).
