# Patch owner proposta — `PLAN_V0.md` per ciclo M-T8

**Baseline:** `env/test` @ `764d862` (fix `0a86c81` · report esecutore `3c3677d` · controverifica `764d862`)  
**Applicare:** orchestratore senior **dopo** firma verbatim Matteo su SK-10 e commit M-T8 (non prima).  
**NON promuovere** `H-1.3` a PASS pulito in questo patch.

---

## 1. Intestazione (righe 8–11)

**Sostituire:**

```markdown
> **Ultimo movimento:** **P2A in corso** — manuale operativo locale
> [`MANUALE_OPERATIVO_MSS_V0.md`](MANUALE_OPERATIVO_MSS_V0.md) (`SK-10`, non chiuso; `R8` non
> soddisfatto). Audit e P1 restano in [`AUDIT_STATO_REALE_23-08-26.md`](AUDIT_STATO_REALE_23-08-26.md)
> e report P1. `SK-7` gate A/B; `H-1.3` `PASS_CON_RISERVE`; `WP-1` **NO-GO**.
```

**Con:**

```markdown
> **Ultimo movimento:** **M-T8** — pubblicazione T7+T9+Opzione B; **`SK-10` CHIUSO** (firma Matteo
> [`Report-chiusura-sk10-firma-matteo-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Report-chiusura-sk10-firma-matteo-25-08-26.md));
> prossimo lavoro **E2 / H-1.3** (famiglie `M-E2-*`, non `WP-1`). `H-1.3` resta **`PASS_CON_RISERVE`**
> (bypass E2 intenzionali non sanati). Audit P1 in [`AUDIT_STATO_REALE_23-08-26.md`](AUDIT_STATO_REALE_23-08-26.md).
> `WP-1` **NO-GO** · `D27` chiusa finché Matteo non riapre in chat dedicata.
```

*(Se firma ancora in attesa al momento del commit tecnico: lasciare `SK-10` = `PROVATO` in intestazione finché la firma non è incollata.)*

---

## 2. §4-bis riga S10 (SK-10)

**Sostituire stato:**

`| S10 | \`SK-10\` — … | **\`PROVATO\` 24-08-26 (\`M-D\`); riserva \`N6\` chiusa da \`M-G\` CHIUSO (\`M12\`)** |`

**Con:**

`| S10 | \`SK-10\` — manuale utente + intervista di bootstrap | **\`CHIUSO\` 25-08-26 — firma Matteo post-M-T8 (\`M12\` atti M-D/M-G + R8 T9)** | ✅ \`P2A\`: [\`MANUALE_OPERATIVO_MSS_V0.md\`](MANUALE_OPERATIVO_MSS_V0.md) · ✅ \`P2B\`: \`mss:export\` + \`mss:doctor\` · ✅ \`N6\` chiuso \`M-G\` · ✅ \`R8\` rieseguito T9 · ✅ controverifica M12 T7 \`PULITO\` su Opzione B · Atti: [\`Report-chiusura-sk10-firma-matteo-25-08-26.md\`](../Sessioni%20di%20lavoro/25-08-26/Report-chiusura-sk10-firma-matteo-25-08-26.md) |`

---

## 3. §15 — Riserve T7 (blocco ~935–942)

**Sostituire le righe R-T7-01/02 con:**

```markdown
- **R-T7-01:** ⚠️ **APERTA** — commit parziali T7+Opzione B su `origin/env/test` (`0a86c81`–`764d862`); restano file untracked / atti M-T8 finché Matteo non autorizza push finale del ciclo pubblicazione.
- **R-T7-02:** ✅ **CHIUSA** 25-08-26 — controverifica M12 Codex **PULITO** su Opzione B F1–F3: [`Report-controverifica-indipendente-fix-m12-t7-codex-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Report-controverifica-indipendente-fix-m12-t7-codex-25-08-26.md) · fix `0a86c81`.
```

*(R-T7-03 … R-T7-06: invariati.)*

---

## 4. §15 — Riserve T9 / pre-T8 (blocco ~969–974)

**Sostituire:**

```markdown
- **R-T9-01:** `parsePlanGate()` riconosce solo cicli `M-*` → «ultimo chiuso» mostra `M-F` invece di T6/T7.
- **R-T9-02:** template kit `_skill-system-v0/hooks/fine-sessione-nudge.mjs` divergenza da Cursor prod (v5 / mente fredda).
- **R-T9-03:** `PROTOCOLLO_PRIMO_PILOTA_V0_1.md` versione/schema legacy vs contratto vivo.
```

**Con:**

```markdown
- **R-T9-01:** ✅ **CHIUSA** 25-08-26 — `plan-parse.mjs` riconosce `M-*` e `T\d+`; fix Opzione B `0a86c81`; M12 Codex **PULITO** (F1: ultimo chiuso T6, prossimo T8).
- **R-T9-02:** ✅ **CHIUSA** 25-08-26 — parità kit/produzione hook nudge; fix `0a86c81`; prove `complete` / `missing-qr` / `no-capsule` in `test:mss` (N3).
- **R-T9-03:** ✅ **CHIUSA** 25-08-26 — protocollo `1.0.1`, coppia viva `0.1.1`/`freeze-2`; `--force-legacy` rifiutato; fix `0a86c81` + M12 F3.
```

---

## 5. §15 — Chiusura T9 + nuova sezione M-T8 (append dopo chiusura T9 ~976–981)

**Aggiornare chiusura T9:**

```markdown
#### Chiusura formale ciclo `T9` — 25-08-2026

- **Ciclo `T9`:** **CHIUSO** (4 famiglie + inventari + orchestratore; riserve meccaniche R-T9-01/02/03 chiuse da Opzione B + M12).
- **Commit:** fix `0a86c81`, atti `3c3677d`/`764d862` su `env/test` (push condizionato a sì Matteo per residui M-T8).
```

**Append:**

```markdown
### Sedicesimo ciclo del 25-08-2026 — `M-T8` pubblicazione + SK-10 (orchestratore senior)

Mandato: [`PLAN-CHIUSURA-RIMANENZE-MSS-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/PLAN-CHIUSURA-RIMANENZE-MSS-25-08-26.md) · P0.2–P0.4.

| Atto | Esito | Riferimento |
|---|---|---|
| Pubblicazione T7+T9+Opzione B | **eseguito** (commit locali/remoti parziali) | `0a86c81` · `3c3677d` · `764d862` |
| Owner allineato R-T9/R-T7-02 | **patch applicata** | questo file §15 |
| SK-10 firma Matteo | **CHIUSO** | [`Report-chiusura-sk10-firma-matteo-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Report-chiusura-sk10-firma-matteo-25-08-26.md) |
| Report orchestratore M-T8 | **consegnato** | [`Report-orchestratore-m-t8-pubblicazione-sk10-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Report-orchestratore-m-t8-pubblicazione-sk10-25-08-26.md) |

**Riserve residue post-M-T8 (deliberate, non bug):**

- **R-T7-01:** push/residui WT finché Matteo non autorizza.
- **R-T7-03 … R-T7-06:** invariati.
- **H-1.3:** **`PASS_CON_RISERVE`** — **non** promosso a PASS pulito.

**Prossima azione autorizzata:** famiglie **E2 / H-1.3** (`M-E2-A` … `M-E2-D`, poi `M-H13-PASS` solo dopo prove) — vedi [`PLAN-CHIUSURA-RIMANENZE-MSS-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/PLAN-CHIUSURA-RIMANENZE-MSS-25-08-26.md) §P1.

**Esplicitamente fuori:** `WP-1`, riapertura `D27`, `H-1.3` PASS pulito, lavoro `src/`.
```

---

## 6. §15 — Prossima azione globale (sostituire occorrenze «Prossima azione autorizzata: `T8`»)

**Con:**

```markdown
**Prossima azione autorizzata:** **E2 / H-1.3** — chiusura reale bypass (`M-E2-A` no-verify · `M-E2-B` unstaged · `M-E2-C` Cloud/Codex fallback · `M-E2-D` light). **`WP-1` resta NO-GO.** Riapertura pilota solo chat dedicata `D27` **dopo** E2 dimostrato.
```

---

## 7. Gate post-patch

```powershell
npm run validate:mss:views
npm run mss:status   # atteso: ultimo T9 o M-T8 chiuso; prossimo E2/H-1.3; SK-10 CHIUSO
```
