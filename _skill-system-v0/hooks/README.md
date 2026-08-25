# hooks/ — enforcement vero (fine-chat + guard PROD)

> Questi file portano due fasi critiche da governance soft (l'agente *dovrebbe*) a **enforcement
> vero**: una macchina che legge i file/payload e ferma o rilancia l'agente. Sono opzionali — copiali
> nel progetto solo se l'IDE/piattaforma supporta gli hook di lifecycle.

## Cosa c'è qui

| File | Evento | Cosa fa |
|------|--------|---------|
| `fine-sessione-nudge.mjs` | `stop` (Cursor) | Q/R §11 su report fresco (**ricorsivo**, `report-paths.mjs`); validatore MSS; silenzio se tutto verde. Cold-check al pre-commit. |
| `guard-prod.mjs` | `beforeMCPExecution` + `beforeShellExecution` (Cursor) | Ferma le **scritture sul DB di PRODUZIONE** (via MCP o shell) e chiede conferma (`permission: "ask"`). Letture e operazioni su TEST passano lisce. Riconosce PROD dal **nome del server MCP**, non dall'URL. |
| `fine-sessione-senior.mjs` | `Stop` (Claude Code) | **AVANZATO/OPZIONALE.** Gemello del nudge (v6, 23-08-26): Q/R §11 + validatore MSS; silenzio se entrambi verdi. Richiede `scripts/mss/` nel repo. Sintassi Claude Code (`stop_hook_active`, `decision:block`). |
| `hooks.json` | — | Registra gli hook Cursor: `stop` (loop_limit 3) + `beforeMCPExecution`/`beforeShellExecution` (guard-prod). |

## Perché v4 (da «titolo» a «risposta»)

Le versioni v1-v3 controllavano la **presenza del titolo** di una sezione: un titolo con sotto il
vuoto passava. La **v4** controlla che ogni domanda di chiusura abbia una **risposta piena**. Per
rispondere a «i dati corrispondono al diff?» e «i file correlati sono allineati?» l'agente DEVE
rileggere diff e file → la verifica intelligente la fa lui, l'hook controlla solo che abbia risposto.
È il meccanismo più forte senza un agente-revisore separato. Le 6 domande stanno in
`comunicazione/CHIUSURA_SESSIONE.md` §11.

## Come si installa (Cursor)

1. Copia gli script dove preferisci (es. `.cursor/hooks/`).
2. Fondi il contenuto di `hooks.json` in `.cursor/hooks.json` (se ne hai già uno, **unisci** le
   sezioni invece di sovrascrivere). Allinea i `command` ai percorsi reali.
3. Verifica che `node` sia sul PATH dell'IDE.
4. Verifica che Git invochi davvero Husky: `git config core.hooksPath` deve restituire `.husky`.
   Se restituisce `nul`, riattiva con `git config core.hooksPath .husky`. Su Windows il file
   `.husky/pre-commit` deve iniziare con `#!/usr/bin/env sh`, altrimenti Git puo fallire con
   `cannot spawn .husky/pre-commit`.
5. Per il guard-prod: apri `guard-prod.mjs` e adatta i valori in « CONFIG DA ADATTARE » (nome server
   MCP prod/test, comandi shell). Senza questo passaggio non riconosce il tuo ambiente.

Per Claude Code: registra gli hook in `.claude/settings.local.json` (`PreToolUse` per guard-prod,
`Stop` per `fine-sessione-senior.mjs`).

## Da adattare negli script (segnati in « CONFIG » in testa a ogni file)

- **nudge (v6):** nessuna CONFIG locale — discovery e cartella report vivono in
  `scripts/mss/report-paths.mjs`; Q/R in `scripts/mss/report-questions.mjs`; validazione in
  `scripts/mss/adapter.mjs`. Richiede `scripts/mss/` nel repo (stesso requisito del senior).
- **guard-prod:** `PROD_MCP_RE` / `TEST_MCP_RE` (nome server MCP), `SHELL_PROD_RE` (comandi CLI).
- **senior:** path citati nei messaggi (`EVOLUZIONE_DOC`, `TEMPLATE_V0_DIR`) se li rinomini.

## Limiti onesti

- **Gira solo su IDE locale.** Gli hook `stop`/`beforeMCPExecution` NON girano sui Cloud/remote
  Agents, né su Codex/Claude senza cablaggio locale. **Non esiste hook Cloud installabile** su quelle
  piattaforme: non prometterlo. Fallback misurato (Opzione B / M-E2-C): checklist obbligatoria in
  `comunicazione/CHIUSURA_SESSIONE.md` («Cloud / Codex / Claude…») + gate CI post-hoc
  `validate:mss:changed` su push/PR (report standard/deep senza capsula → CI rossa).
- **Verifica i file/payload, non la chat.** L'hook sa se una risposta *esiste ed è piena*, non se è
  *vera*: per questo il cold-check va eseguito come guardia separata al commit.
- **guard-prod = `ask`, non `deny`.** Ferma e chiede conferma, non vieta del tutto (una scrittura prod
  a volte è legittima). Nota Claude Code: un `ask` NON vince un `allow` già concesso in settings — togli
  gli `allow` espliciti sui tool di scrittura PROD perché la guard morda.

> Mappa di quali hook iniettano/bloccano per piattaforma: `comunicazione/EVOLUZIONE_SKILLS.md`
> §2-quater.
