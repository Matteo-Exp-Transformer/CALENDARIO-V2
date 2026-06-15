# TESTING — Mini-pack d'area (ingresso rapido)

> **Cos'è.** Ingresso ~1 schermata per **test Vitest, E2E Playwright, staging, QA manuale**. **Non
> duplica** il protocollo: per il testo pieno apri `TESTING_SKILL.md` + context.
> Design: `Sessioni di lavoro/12-06-26/Design-wp-e1-mini-pack-area-12-06-26.md`.

## 1. Trigger
«test Vitest» · «spec Playwright / E2E» · «staging Supabase» · «test che fallisce» · «CI / copertura»
· profilo **Verifica** («revisiona / verifica / controlla / debugga / non funziona»).

## 2. Carica subito
- **`TESTING_SKILL.md`** (intero) — Vitest vs Playwright, comandi, **§7 protocollo QA manuale**.
- `MANUALE_BLINDATURA.md` se stai **blindando** una sezione (quali test, quando il «rompi» è dovuto).
- `TESTING_CONTEXT.md` / `TESTING_PATTERNS.md` per mappa test e snippet pronti.

## 3. Divieti top-3
1. **Nessun test tocca PROD** (`rwuxgvld`). Vitest → mock `vi.mock` + MSW (zero chiamate reali);
   Playwright → solo staging `docnnernvp`, credenziali in `.env.local.test`.
2. **Prima di un test nuovo: cerca se esiste già** uno utile vicino alla funzione/hook; estendilo con
   un `it` nella stessa `describe` invece di duplicare.
3. **Profilo Verifica = QA manuale obbligatorio (§7):** `npm run validate` poi stessi casi funzionali
   su **375×812 / 834×1194 / 1280×800** + tabella esiti nel report. Una sola larghezza non basta.

## 4. Mappa file
| Se il task tocca… | Apri |
|---|---|
| Quando/come usare il testing, comandi, QA manuale §7 | `TESTING_SKILL.md` |
| Blindare una sezione (sequenza test, cancello «blindato») | `MANUALE_BLINDATURA.md` |
| Mappa completa test, setup MSW, ricreare staging | `TESTING_CONTEXT.md` |
| Snippet pronti Vitest/Playwright/edition | `TESTING_PATTERNS.md` |
| Guida operativa comandi/troubleshooting | `tests/README.md` |
| Codice applicativo (non i test) | skill dell'area (ADMIN_CLASSIC, DB, …) |

## 5. LOCK (solo link)
- **DB PROD off-limits ai test** (`rwuxgvld`) → `TESTING_SKILL.md` §1.
- **Viewport standard 375/834/1280** (+400px solo admin Calendario) → `TESTING_SKILL.md` §7.2.
- **`npm run validate`** è il gate pre-PR (lint + typecheck + Vitest) → §3 + §7.1.
