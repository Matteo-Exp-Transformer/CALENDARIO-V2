# Report WP-E1 — Mini-pack per area — 12-06-26

**Cosa è cambiato:** design approvato per ingressi leggeri per area (mini-pack in docs + puntatori Cursor + indice §0.0b) senza duplicare LOCK.
**Cosa resta:** implementazione FU-ALL-TIER Imp-1/2/3; WP-E3 ancora ⬜; FU-ALL-DOCPATH (script path docs).
**Serve una tua azione:** no per il design; sì per avviare Imp-1 quando vuoi i primi due mini-pack.

---

## Decisioni Matteo

| Tema | Scelta |
|------|--------|
| Dove | **L1c** ibrido — contenuto `docs/`, Cursor puntatore |
| Formato | **F1a** — 5 sezioni, ≤80 righe |
| Rollout | **P1** (Prenota + Menu QR) → **A3** (Admin unico) → **A4→A7** |
| Profili | **R1a** — mini-pack per area; §0.0 invariato |
| APP_CONTEXT | **H2b** — nuovo **§0.0b** indice mini-pack |
| Nome file | **N2a** — `docs/<Area>-Skill/*_MINI.md` |
| Manutenzione | **M3a** + **M3b leggero** in report |
| Admin | **A3a** — un solo `ADMIN_MINI.md` |

Fonte: `Design-wp-e1-mini-pack-area-12-06-26.md`.

---

## File toccati

| File | Perché |
|------|--------|
| `Design-wp-e1-mini-pack-area-12-06-26.md` | Design canonico |
| `MASTERPLAN_ALLINEAMENTO.md` | WP-E1 ✅ |
| `FOLLOW_UP.md` | FU-ALL-TIER → Aperto con Imp-1/2/3 |

Nessun `*_MINI.md` creato (scope design).

---

## Test

`npm run validate` — invariato.

---

## File di skill aggiornati

Nessuno — implementazione aggiungerà §0.0b e i mini-pack.

---

## Cosa resta

- **FU-ALL-TIER Imp-1:** PRENOTA_MINI + MENU_QR_MINI + §0.0b + 2 Cursor skills
- **Imp-2:** ADMIN_MINI
- **Imp-3:** magazzino, DB, marketing/legal, testing
- **WP-E3** anti-storia
- **FU-ALL-DOCPATH**

---

## Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: «procedi con B .» (WP-E1) · «L1c . F1. A P.1 , poi A3 , poi il resto in sequenza R1. A» · «H2. B N2.A M3A + M3B leggero. A3.A»

❓ Q2 — Dati = diff reale?
✅ R2: Riaperti Design (L1c, F1a, H2b, N2a, rollout P1→A3→A4-7, A3a, M3a/b), masterplan WP-E1 ✅, FU-ALL-TIER aggiornato, `.cursor/skills/calendarbackup-app-context/SKILL.md` come modello puntatore.

❓ Q3 — File correlati allineati?
✅ R3: APP_CONTEXT non modificato di proposito — §0.0b arriva in Imp-1. Nessun test/codice.

❓ Q4 — Cosa NON hai fatto?
✅ R4: Zero file MINI, zero §0.0b, zero nuove Cursor skills — cancello WP-E1 è solo Meta design.

❓ Q5 — Attrito + miglioria?
✅ R5: Attrito basso; dopo Imp-1 valutare se `PREPARA_PROMPT_SKILL` deve citare mini-pack nel prompt generato.

❓ Q6 — Contesto & hook?
✅ R6: Giusto — §4d + skill Cursor esistente + tabella §0 bastavano.
