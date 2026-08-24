# Mandato `M-A` + `M-B` — protezioni e cancelli (24-08-2026)

> Affidato dall'orchestratore a un esecutore **Sonnet**. Perimetro chiuso, **una famiglia**,
> **un solo report** (≤ 150 righe) e **una sola capsula**. Fonte del mandato:
> [`PROMPT_ORCHESTRATOR_MSS_24-08-26.md`](../../MetaSkillSystem/PROMPT_ORCHESTRATOR_MSS_24-08-26.md) §4 · §8.

## 0. Che cosa NON devi leggere

Non aprire il corpus dei report. Ti bastano: questo mandato, il
[`MANUALE_OPERATIVO_MSS_V0.md`](../../MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md), e i file elencati
nel perimetro. **Non** leggere `PLAN_V0.md` intero.

## 1. Fatti già verificati dall'orchestratore — non rifarli, partono da qui

| Fatto | Comando che lo prova |
|---|---|
| `.claude/hooks/guard-prod.mjs` esiste ma è **untracked** | `git ls-files --error-unmatch .claude/hooks/guard-prod.mjs` → errore |
| `.claude/settings.local.json` esiste ed è **untracked** | idem |
| **Causa comune**: `.git/info/exclude` contiene la riga `.claude/` — un file **locale, non versionato**: nessun altro può vederla | `git check-ignore -v .claude/hooks/guard-prod.mjs` |
| In `.claude/` sono tracciati solo `CLAUDE.md` e `hooks/fine-sessione-senior.mjs` (aggiunti con `-f`) | `git ls-files .claude/` |
| La suite `test:mss` prova **solo** i due hook Cursor | `docs/MetaSkillSystem/tests/h1/run.mjs` righe 50-51 |
| Nessun test nomina `guard-prod` | `grep -rl guard-prod docs/MetaSkillSystem/tests/` |
| `git tag -l` è **vuoto** | `git tag -l` non stampa nulla |
| `scripts/doc-path-check-allowlist.json` è un array di **26** stringhe | — |
| `validate:docs` è **verde** in locale (0 path rotti) | `npm run validate:docs` → exit 0 |
| `npm run validate` = `lint && typecheck && test && test:mss:tools` | `package.json` |
| Il blocco `hooks` di `settings.local.json` non contiene segreti né path assoluti: usa `$CLAUDE_PROJECT_DIR` | — |

## 2. Gli otto fix — stato finale atteso

### `A1` — la guardia PROD di Claude entra in git

`git add -f .claude/hooks/guard-prod.mjs`. **Non committare.** Dichiara nel report che il file è
*staged*, e che diventa davvero tracciato al commit di Matteo.

### `A4` — il cablaggio dell'hook diventa riproducibile

1. Crea `.claude/settings.json` (**tracciato**, `git add -f`) con **solo** il blocco `hooks`, verbatim:

```json
{
  "hooks": {
    "Stop": [
      { "hooks": [ { "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/fine-sessione-senior.mjs" } ] }
    ],
    "PreToolUse": [
      { "matcher": "mcp__claude_ai_Supabase__.*|Bash|PowerShell",
        "hooks": [ { "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/guard-prod.mjs" } ] }
    ]
  }
}
```

2. **Vietato** copiare il blocco `permissions` di `settings.local.json`: sono 89 voci con path
   assoluti della macchina di Matteo. Resta personale.
3. Sposta l'esclusione dal locale al versionato: aggiungi a `.gitignore` **solo**
   `.claude/settings.local.json` e `.claude/mcp.json` (con un commento che dice perché), e **togli la
   riga `.claude/` da `.git/info/exclude`**. È la causa radice di `A1`/`A4`: un'esclusione che
   nessuno può vedere rende invisibili i file nuovi senza che alcun test diventi rosso.
4. Verifica che dopo la modifica `git status` **non** mostri `.claude/settings.local.json` né
   `.claude/mcp.json` fra gli untracked.

### `A2` — la guardia PROD ha dei test

Le tre copie **divergono legittimamente** (Cursor usa `permission`, Claude usa
`hookSpecificOutput.permissionDecision`, il kit è un template generico con `PROD_SERVER_NAME`):
**non unificarle in un modulo condiviso** — la copia del kit deve restare autonoma per il bootstrap
in repo vergine (`R8`). Quello che va condiviso è il **corpus di casi**, non il codice.

Scrivi una tabella di casi unica ed eseguila contro `.cursor/hooks/guard-prod.mjs` e
`.claude/hooks/guard-prod.mjs` (spawn del processo, payload su stdin, asserzione sulla decisione):

| Caso | Atteso |
|---|---|
| MCP `…Supabase__execute_sql` con `DELETE FROM …` | **ask** |
| MCP `…Supabase__execute_sql` con `SELECT …` | allow |
| MCP `…Supabase__apply_migration` | **ask** |
| MCP `…Supabase_test__apply_migration` | allow |
| MCP `…Supabase__list_tables` | allow |
| shell `supabase db push --include-all` | **ask** |
| payload illeggibile / vuoto | allow (fail-open dichiarato) |

Attenzione: i due hook parlano protocolli diversi (Cursor riceve `command` senza `tool_name` per il
ramo shell; Claude riceve `tool_name: "Bash"` con `tool_input.command`). Il corpus dei casi è
condiviso, l'adattatore di payload/asserzione è per-piattaforma.

Per la copia del kit `_skill-system-v0/hooks/guard-prod.mjs`, che è un template non eseguibile così
com'è, basta un test statico: `node --check` passa **e** i marcatori `⚠️ ADATTA` esistono ancora. Se
qualcuno vi cablasse dati reali del progetto, il test diventa rosso.

### `A3` — l'hook di chiusura di Claude ha dei test

`.claude/hooks/fine-sessione-senior.mjs` va coperto **nella stessa suite** in cui vivono già gli hook
Cursor (`docs/MetaSkillSystem/tests/h1/run.mjs`, dove sono già definiti `stopHookPath` e
`precommitHookPath`). Copri almeno il comportamento deciso in `D24`: **silenzio** a controlli verdi e
domande complete, **parla** se una risposta manca o la capsula è davvero rossa.

### `B1`/`B2` — i cancelli si separano

In `package.json`:

- `validate:app` = `npm run lint && npm run typecheck && npm run test`
- `validate:mss:all` = `npm run test:mss && npm run test:mss:tools && npm run validate:docs`
- `validate` = `npm run validate:app && npm run validate:mss:all`

In `.github/workflows/ci.yml`, nel job `mss`, sostituisci i due step «MSS validator tests» e «MSS
tools tests» con un unico step che lancia `npm run validate:mss:all`. Motivo: `R7` chiede che il
cancello sia **lo stesso comando** su tutti i canali. **Non toccare** la separazione dei due job
`ci`/`mss`: la revisione la dichiara corretta e va conservata.

### `B3` — il punto di ripristino esiste

Crea il tag **annotato** `mss/baseline-h13` su `HEAD`, con messaggio che dice quali cancelli erano
verdi quando è stato posato. È un'operazione **locale**: il push del tag lo autorizza Matteo.
Aggiungi al manuale operativo (§5, riga «Tag ripristino») la procedura di ritorno in due righe.
**Nessun test** su questo: un test che pretende un tag non ancora pushato renderebbe rossa la CI.

### `B4` — l'allowlist non può più crescere di nascosto

In `scripts/check-doc-paths.mjs` introduci un tetto dichiarato (`ALLOWLIST_MAX`) pari alla dimensione
attuale dell'allowlist. Se il file supera il tetto → **exit 1** con un messaggio che cita `D21`
(«vietato azzerare il contatore ammorbidendo il controllo»). Se scende sotto, stampa un avviso che
invita ad abbassare il tetto: la cricchetta deve poter stringere, mai allargarsi da sola.

## 3. Come vanno chiamati i test — è un requisito, non uno stile

Ogni difetto chiuso deve avere **un test che lo nomina**, sul modello già in casa
(`parseCheckSpec — D3 storico ambiguo rifiutato`). Il nome del caso contiene l'ID: `A1`, `A2`, `A3`,
`A4`, `B4`. Senza questo, la prossima regressione non è riconoscibile e la controverifica ti rimanda
il lavoro indietro.

## 4. Comandi da eseguire e da registrare in `controls[]`

```
npm run validate:app
npm run validate:mss:all
npm run test:mss
npm run test:mss:tools
npm run validate:docs
git ls-files --error-unmatch .claude/hooks/guard-prod.mjs .claude/settings.json
git tag -n1 -l "mss/baseline-*"
```

Registra gli **esiti reali**. Se qualcosa è rosso, **si dice**: un rosso dichiarato vale più di un
verde inventato.

## 5. Consegna

Un solo file `docs/Sessioni di lavoro/24-08-26/Report-ma-mb-protezioni-cancelli-24-08-26.md`,
**≤ 150 righe**, con le sezioni obbligatorie di
[`CHIUSURA_SESSIONE.md`](../../Comunicazione-Skill/CHIUSURA_SESSIONE.md) Parte A, `controls[]` con
**una riga per fix** (otto righe), e la capsula generata **con l'attrezzo**:

```
npm run mss:capsule -- --model <modello> --judgments <file.json> --check "A1=>..." --append-to "<report>"
npm run validate:mss -- --mode file --file "<report>" --kind report --require-capsule
```

⚠️ **`N1` è noto e aperto**: `mss:capsule` esce `0` e **scrive** anche se i giudizi violano il
validator. Perciò `validate:mss` sul report è **obbligatorio** dopo la generazione. Se esce rosso,
correggi i giudizi e rigenera — **non** ammorbidire il validator.

## 6. STOP — vincoli non negoziabili

- **Nessun commit, nessun push, nessun tag pushato.** Solo `git add` dove indicato sopra.
- **Non toccare** `docs/Sessioni di lavoro/23-08-26/Report-revisione-skill-chiusura-e-hook-23-08-26.md`:
  ha modifiche in corso di Matteo, staged e non. Preservale.
- **Nessun `move`/rinomina di file** (decisione `D15`: `mss:move` non esiste ancora).
- **Nessuna modifica a `scripts/mss/core.mjs`**: è il perimetro del mandato `M-C`, non del tuo.
- **Nessun allentamento di un validator** per far passare un test.
- **Nessuna voce nuova in allowlist** al posto di un fix (`D21`).
- **Nessuna scrittura su database**, nessun comando Supabase.
- **Numeri mobili citati come comando, non come valore** (conteggi di test, di sedute, di path).
- Se un fix richiede di uscire dal perimetro, **fermati e chiedi**: non aggirarlo con una copia
  (`D18`: «dobbiamo snellire, non duplicare»).
