# Design — Check automatico path nei docs (WP-E2)

> **Stato:** approvato Matteo 12-06-26 (intervista Meta AL-E).
> **Implementazione:** WP separato — vedi `FU-ALL-DOCPATH` in `docs/FOLLOW_UP.md`.
> Questo file è la fonte per lo script; non sostituisce il masterplan.

---

## Obiettivo

Intercettare link e path in file `.md` «vivi» che puntano a file inesistenti nel repo, prima che si ripetano i disallineamenti corretti in milestone AL-A.

---

## Perimetro (P1b)

**Inclusi:** tutti i `.md` sotto `docs/` eccetto:

| Esclusione | Motivo |
|------------|--------|
| `docs/Sessioni di lavoro/**` | Report storici — link legacy accettabili |
| `docs/_lavoro/**` | Privato / gitignored |
| `docs/Archivio/**` | Storico prodotto |

**Estensione opzionale** (WP implementativo, non bloccante design): `.cursor/rules/*.mdc`, `AGENTS.md` — stesso motore e allowlist.

---

## Cosa estrarre (T1b)

1. Link markdown: `[testo](percorso)` — path relativo o assoluto repo.
2. Path inline espliciti: `` `docs/Area/File.md` `` e occorrenze testuali `docs/.../*.md` fuori da fenced blocks.

**Non** estrarre (T1c vietato): nomi skill senza path (`PRENOTA_SKILL`, `vedi §4`).

---

## Cosa ignorare (X)

| Regola | Dettaglio |
|--------|-----------|
| **X1** URL esterni | `http://`, `https://`, `mailto:` — skip |
| **X2** Fenced code | Nessun check dentro `` ``` ... ``` `` |
| **X3** File in arrivo | `scripts/doc-path-check-allowlist.json` — path + `reason` + `fu` opzionale |
| **X4** `_lavoro` | Coperto da esclusione P1b; link **da** doc vivo **verso** `_lavoro/` = **FAIL** |

### Allowlist iniziale (seed WP implementativo)

```json
[
  {
    "path": "docs/legal/sub-processors.md",
    "reason": "Da pubblicare — FU-LEGAL-2",
    "fu": "FU-LEGAL-2"
  }
]
```

Rimuovere voci quando il file esiste.

---

## Dove gira (R2d)

| Ambiente | Comportamento |
|----------|----------------|
| **Locale** | `npm run validate:docs` — parte di `npm run validate` (dopo lint/typecheck/test o inserito prima dei test, da decidere in implementazione) |
| **CI** | Step in `.github/workflows/ci.yml` dopo install: `npm run validate:docs` |
| **Pre-commit** | **No** — evita frizione su commit doc-only |

---

## Comportamento errori (E3a)

- Exit code **1** se ≥1 path rotto.
- Output: `file:line:path` — path atteso vs assenza su filesystem.
- Nessun warn-only in CI né in validate.

---

## Esempi

| Caso | Input | Esito |
|------|-------|-------|
| Buono | `[Prenota](docs/Prenota-Skill/PRENOTA_SKILL.md)` | OK se file esiste |
| Rotto | `docs/Menu-QR-Skill/PUBLIC_MENU_SKILL.md` | FAIL |
| Ignorato | `https://supabase.com/legal/dpa` | skip |
| Allowlist | `docs/legal/sub-processors.md` | OK finché in allowlist |
| Rotto privato | `docs/_lavoro/Per matteo/foo.md` citato da skill viva | FAIL |

---

## WP implementativo — scope atteso

1. `scripts/check-doc-paths.mjs` (o `.ts` se preferito coerenza repo — oggi script sono `.mjs`).
2. `scripts/doc-path-check-allowlist.json`.
3. `package.json`: `"validate:docs": "node scripts/check-doc-paths.mjs"`.
4. Aggiornare `"validate"` per includere `validate:docs`.
5. Step CI in `ci.yml`.
6. Prima esecuzione: fix link rotti nei docs vivi **oppure** allowlist temporanea documentata nel report implementativo.

**Vietato nel WP implementativo:** modificare contenuto funzionale delle skill oltre ai link rotti; non controllare `Sessioni di lavoro/`.

---

## Riferimenti

- `docs/MASTERPLAN_ALLINEAMENTO.md` — WP-E2
- Report chiusura: `Report-wp-e2-doc-path-check-12-06-26.md`
