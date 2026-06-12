# Report WP-E3 — Anti-storia + protocollo §7 — 12-06-26

**Cosa è cambiato:** regole scritte per tenere la cronologia nei report e le skill «oggi + divieti»; piano per §8 APP_CONTEXT, potatura Menu QR, snellimento §7.
**Cosa resta:** FU-ALL-ANTISTORIA Imp-E3-3/1/2; FU-ALL-TIER; FU-ALL-DOCPATH.
**Serve una tua azione:** no per il design; sì per avviare Imp-E3-3 quando vuoi la regola §8 nel repo.

---

## Decisioni Matteo

| Tema | Scelta |
|------|--------|
| Anti-storia | **S1b** — report = storia; skill = stato + max 3 righe guardrail + link |
| Migrazione | **S2a** Menu QR + **S2b** on-touch altrove |
| §7.2 | **K1a** — tabella resta in APP_CONTEXT |
| Spezzatura §7 | **H7b** — §7.0 breve + §7.1 + §7.2 in APP_CONTEXT; terminali/dettaglio in CHIUSURA |
| Grilletti | **Z2a** — nessuna modifica `comandi-base` |
| Regola canonica | **R3a** — nuovo **§8** APP_CONTEXT |
| Ordine implementazione | **O3b** — §8 → Menu QR → snellire §7 |

Fonte: `Design-wp-e3-anti-storia-protocollo-7-12-06-26.md`.

---

## File toccati

| File | Perché |
|------|--------|
| Design WP-E3 | Canonico implementazione |
| `MASTERPLAN_ALLINEAMENTO.md` | WP-E3 ✅ |
| `FOLLOW_UP.md` | FU-ALL-ANTISTORIA |

Nessuna modifica a skill vive né §7/§8 ancora.

---

## Test

`npm run validate` — invariato.

---

## Milestone AL-E

Con WP-E3 design ✅, tutti i WP delle righe 59–63 masterplan hanno almeno il design chiuso (F1, F2, E1, E2, E3). Implementazioni aperte: FU-ALL-TIER, FU-ALL-DOCPATH, FU-ALL-ANTISTORIA.

---

## Domande di chiusura

❓ Q1 — Prompt ricevuti?
✅ R1: «1. WP E3» · «S1B S2. seguo tuo consiglio. K1.A» · «H7.B Z2.A R3.AO3.B»

❓ Q2 — Dati = diff reale?
✅ R2: Design con S1b/S2a/b/H7b/R3a/O3b; masterplan WP-E3 ✅; FU-ALL-ANTISTORIA; grep Menu QR conferma blocchi «Storia» ancora presenti (potatura = Imp-E3-1).

❓ Q3 — File correlati allineati?
✅ R3: APP_CONTEXT/CHIUSURA non modificati — arrivano in Imp-E3-2/3. VOCABOLARIO intatto per scelta WP.

❓ Q4 — Cosa NON hai fatto?
✅ R4: Nessun §8, nessuna potatura Menu QR, nessuno snellimento §7 — scope design WP-E3.

❓ Q5 — Attrito + miglioria?
✅ R5: Attrito basso; dopo Imp-E3-2 verificare hook legge ancora CHIUSURA senza riferimenti a §7.3 rimosso.

❓ Q6 — Contesto & hook?
✅ R6: Giusto — lettura §7 APP_CONTEXT + CHIUSURA header + grep storia Menu QR.
