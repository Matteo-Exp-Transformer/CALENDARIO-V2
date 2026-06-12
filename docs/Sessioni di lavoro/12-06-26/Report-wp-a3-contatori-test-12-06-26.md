# WP-A3 — Contatori test hardcoded nei docs — 12-06-26

**Cosa è cambiato:** nei documenti vivi che gli agenti consultano per i test, i numeri fissi della suite (29, 137/137, 54, ~480…) sono stati sostituiti con la regola «`npm run test` / `npm run validate` deve essere verde» — così i doc non invecchiano quando aggiungi test.
**Cosa resta:** WP-A4 e resto milestone AL-A; inventario per-file in `tests/README.md` § «Test Vitest esistenti» (tabella `# test` per singolo file — debito minore, fuori dal grep sui contatori suite).
**Serve una tua azione:** no.

---

## 2. Cosa è stato fatto

1. Grep mirato su `.md` vivi (esclusi `docs/Sessioni di lavoro/` e `docs/_lavoro/`) — trovati contatori suite in 9 file operativi oltre ai 2 target noti.
2. Sostituiti tutti i contatori suite hardcoded con formulazioni senza numero (comando + esito atteso).
3. Report storici in `Sessioni di lavoro/` lasciati invariati (come da masterplan).
4. `CHANGELOG.md` v2.1.0 lasciato invariato — nota storica di release, non istruzione operativa.
5. `npm run validate` verde.
6. `MASTERPLAN_ALLINEAMENTO.md` — WP-A3 ✅ + link report.

---

## 3. File toccati — sostituzioni (prima → dopo)

| File | Prima | Dopo |
|------|-------|------|
| `.claude/CLAUDE.md` | `# 29 test Vitest (run mode)` | `# npm run test deve essere verde (run mode)` |
| `docs/APP_CONTEXT_SKILL.md` §5 | `# Vitest — tutti devono passare (137/137)` | `# Vitest — npm run test deve essere verde` |
| `README.md` (tabella doc) | `29 test Vitest + suite Playwright…` | `Vitest (npm run test deve essere verde) + suite Playwright…` |
| `README.md` (comandi) | `# 29 test Vitest` | `# npm run test deve essere verde` |
| `CONTRIBUTING.md` | `(lint + typecheck + 29 test)` | `(lint + typecheck + test — deve essere verde)` |
| `docs/Testing-Skill/TESTING_SKILL.md` | `# 54 test Vitest — veloci…` | `# npm run test deve essere verde — veloci…` |
| `docs/Testing-Skill/TESTING_SKILL.md` | `# Solo test edition (7 test su staging)` | `# Solo test edition su staging — deve essere verde` |
| `tests/README.md` | `# 54 test Vitest in run mode…` | `# npm run test deve essere verde…` |
| `tests/README.md` | `# Solo i 7 test edition su staging` | `# Solo test edition su staging — deve essere verde` |
| `docs/MASTERPLAN_BLINDATURA.md` §8 | `~480 test Vitest` | `test` (senza conteggio) |
| `docs/MASTERPLAN_ALLINEAMENTO.md` | WP-A3 ⬜ | WP-A3 ✅ + link report |

---

## 4. Test eseguiti e risultato

| Comando | Esito |
|---------|-------|
| `npm run validate` | ✅ verde (lint + typecheck + test) |
| Grep `(29 test\|137/137\|54 test\|~480 test)` su file vivi modificati | ✅ nessun match |

---

## 5. File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `docs/APP_CONTEXT_SKILL.md` | §5 comandi test | Router agenti — fonte comandi |
| `docs/Testing-Skill/TESTING_SKILL.md` | §3 comandi | Skill area test |
| `docs/MASTERPLAN_BLINDATURA.md` | §8 verifica merge | Doc vivo con contatore suite |
| `docs/MASTERPLAN_ALLINEAMENTO.md` | WP-A3 ✅ | Cancello milestone |
| `.claude/CLAUDE.md` | Comandi test | Gemello operativo agenti Claude |
| `README.md`, `CONTRIBUTING.md`, `tests/README.md` | Comandi/checklist test | Onboarding e PR checklist |

---

## 6. Dati comunicazione

- **Prompt:** unico prompt esecutivo WP-A3 con scope chiuso (solo doc, no src, no commit).
- **Formato efficace:** target noti + grep + elenco sostituzioni nel report — zero ambiguità.
- **Non toccato per scelta:** report in `Sessioni di lavoro/`, `CHANGELOG.md` v2.1.0 (snapshot storico).

---

## 7. Analisi flusso prompt, efficienza e statistiche

- Prompt sostanziali Matteo: **1**
- Correzioni dopo 1ª risposta: **0**
- Follow-up generati: **0**
- Modalità alzata: **no** (standard)

---

## 8. La tua lettura della sessione

**Impressioni:** WP meccanico perfetto per sessione doc-only; passi masterplan corrispondevano al testo reale dei file target (29 e 137/137 confermati prima della sostituzione).

**Difficoltà:** grep ha trovato più file vivi del minimo (README, CONTRIBUTING, TESTING_SKILL, tests/README, MASTERPLAN_BLINDATURA) — tutti equivalenti al problema «contatore suite che marca», quindi bonificati nello stesso WP.

**Migliorie suggerite (dato):** la tabella inventario in `tests/README.md` (conteggi per singolo file test) resta un secondo fronte di drift — candidato WP futuro o generazione automatica; `CHANGELOG.md` release note potrebbe avere regola esplicita «numeri snapshot ok se datati».

---

## 9. Derivazione errori

Nessuna difficoltà tecnica — solo bonifica doc.

---

## 10. Cosa resta per la prossima sessione

- **WP-A4** — fix puntuali APP_CONTEXT / ADMIN_CLASSIC (prossimo AL-A).
- Debito minore: tabella `# test` per file in `tests/README.md` § «Test Vitest esistenti».

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: Prompt esecutivo WP-A3 completo (Profilo Esecuzione, modalità standard, skill MASTERPLAN WP-A3 + APP_CONTEXT §5, output attesi: rimozione contatori, masterplan ✅, report, SESSION_LOG 1 riga, niente altro senza Sì/No; vietato src/commit/WP-A4/numeri aggiornati).

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Riaperti `.claude/CLAUDE.md:76`, `APP_CONTEXT_SKILL.md:369`, README, CONTRIBUTING, TESTING_SKILL §3, tests/README comandi, MASTERPLAN_BLINDATURA §8, MASTERPLAN_ALLINEAMENTO tabella WP-A3. Grep post-fix sui file vivi modificati: zero match su 29/137/54/~480. `npm run validate` exit 0 rieseguito in sessione.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Aggiornati tutti i doc operativi che citavano contatori suite (tabella §3). Non toccati: report storici Sessioni, CHANGELOG release note, `SESSION_LOG` righe storiche (solo nuova riga aggiunta), `AGENTS.md` (nessun contatore suite). Nessun file `src/` o skill area funzionale (Prenota/Menu QR) — solo routing test/comandi.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non fatto per mandato: WP-A4+, src/, commit/push, sostituire 29 con 557 (vietato), bonifica tabella per-file in tests/README § inventario, modifica CHANGELOG v2.1.0 (snapshot storico), report in Sessioni di lavoro/. Ne sono certo perché esplicitamente vietato o fuori scope equivalente.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: Attrito minimo: grep restituisce anche report Sessioni — filtro mentale necessario; proposta: script WP-E2 con esclusione path già definita nel masterplan per evitare rumore grep manuale.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto giusto — WP atomico + passi numerati bastavano senza caricare skill d'area codice. Nessun hook runtime rilevante in questa sessione doc-only.

---

## 12. Self-review

1. Dati = diff reale — verificato grep + rilettura righe modificate.
2. File correlati — tabella §5 completa.
3. Q1–Q6 con sostanza.
4. Tono utente nel cappello.

Report pronto.
