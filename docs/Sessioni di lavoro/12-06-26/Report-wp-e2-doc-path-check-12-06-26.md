# Report WP-E2 — Check automatico path docs — 12-06-26

**Cosa è cambiato:** design approvato per uno script che trova link `.md` rotti nei documenti vivi — quando, cosa controllare, dove gira (validate + CI), hard fail.
**Cosa resta:** implementazione (`FU-ALL-DOCPATH`); WP-E1 e WP-E3 ancora ⬜ nel masterplan.
**Serve una tua azione:** no per il design; sì per il WP implementativo (sessione Esecuzione separata).

---

## Decisioni Matteo (intervista 3 fasi)

| Tema | Scelta |
|------|--------|
| Perimetro | **P1b** — `docs/` esclusi Sessioni, `_lavoro`, Archivio |
| Estrazione | **T1b** — link markdown + path `docs/...` inline (no T1c) |
| Esclusioni | **X1** URL esterni · **X2** solo fenced code · **X3** allowlist JSON · **X4** via P1b |
| Runtime | **R2d** — `validate:docs` + CI GitHub, **no** pre-commit |
| Errori | **E3a** — hard fail |

Fonte design versionata: `Design-wp-e2-doc-path-check-12-06-26.md`.

---

## File toccati

| File | Perché |
|------|--------|
| `docs/Sessioni di lavoro/12-06-26/Design-wp-e2-doc-path-check-12-06-26.md` | Design canonico implementazione |
| `docs/MASTERPLAN_ALLINEAMENTO.md` | WP-E2 ✅ |
| `docs/FOLLOW_UP.md` | FU-ALL-DOCPATH |

Nessuno script/hook creato (scope design WP-E2).

---

## Test

`npm run validate` — invariato (nessun nuovo script ancora).

---

## File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| Nessuna skill area | — | Solo design Meta; implementazione non tocca comportamento app |

---

## Cosa resta

- **FU-ALL-DOCPATH:** script + validate:docs + CI
- **WP-E1** mini-pack · **WP-E3** anti-storia

---

## Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: «se possiamo farli noi si se richiede agente senior dimmelo.» · «procediamo.» · «P1. B X . decidiamo come consiglato nel plan o indicami tu soluzioni professionali. T . uguale aiutami a scegliere.» · «R2. D E3. A»

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Riaperti Design file (P1b, T1b, R2d, E3a, allowlist seed), masterplan riga WP-E2 ✅, FOLLOW_UP FU-ALL-DOCPATH, `.github/workflows/ci.yml` (oggi senza step docs — coerente con «da implementare»), `.gitignore` (`docs/_lavoro/` escluso).

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Nessuna skill area — WP-E2 è solo design infrastruttura docs. APP_CONTEXT non aggiornato di proposito fino a implementazione.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?
✅ R4: Non implementato script, non modificato `package.json` né CI — cancello WP-E2 è solo decisione Meta. Non eseguito scan link rotti su repo (prima run = WP FU-ALL-DOCPATH).

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti?
✅ R5: Attrito basso; miglioria: dopo FU-ALL-DOCPATH aggiungere una riga in `APP_CONTEXT_SKILL.md` §5 comandi (`validate:docs`) — in implementazione, non qui.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco?
✅ R6: Giusto — masterplan WP-E2 + stato pre-commit/husky bastavano.
