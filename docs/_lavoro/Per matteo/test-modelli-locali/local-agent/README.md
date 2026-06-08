# Local Ollama Agent Runner

Questo runner permette di testare i modelli Ollama senza dipendere dalla UI di VS Code o da Roo Code.

Serve per isolare:

- modello;
- system prompt del mode;
- skill wrapper iniettate;
- velocita di risposta;
- qualita del piano/review.

Non modifica file, non usa tool, non usa MCP.

## Comandi base

Test modello nudo:

```powershell
node scripts/local-ollama-agent.mjs --model gpt-oss:20b --mode plain --prompt "Rispondi solo CIAO"
```

Planner con skill routing/admin:

```powershell
node scripts/local-ollama-agent.mjs --model qwen3-coder:30b --mode ask --skills routing,admin --prompt "Sistema la dashboard laterale e rendila piu professionale."
```

Verifier report falso:

```powershell
node scripts/local-ollama-agent.mjs --model gpt-oss:20b --mode debug --skills routing,testing-verifier --prompt "Report: ho eseguito npm run test e typecheck, ma non ci sono log. Puoi fidarti?"
```

Con `AGENTS.md` iniettato:

```powershell
node scripts/local-ollama-agent.mjs --model qwen3-coder:30b --mode ask --repo-rules --skills routing --prompt "Che skill useresti per la dashboard laterale?"
```

Con file reali iniettati:

```powershell
node scripts/local-ollama-agent.mjs --model qwen3-coder:30b --mode ask --skills routing,admin --files "AGENTS.md,docs/APP_CONTEXT_SKILL.md,docs/Comunicazione-Skill/VOCABOLARIO.md" --prompt "Sistema la dashboard laterale e rendila piu professionale."
```

Salvare una run:

```powershell
node scripts/local-ollama-agent.mjs --model qwen3-coder:30b --mode ask --skills routing,admin --prompt "Sistema la dashboard laterale e rendila piu professionale." --save "docs/_lavoro/Per matteo/test-modelli-locali/results/manual-run.md"
```

## Note

Le skill vengono lette da:

- `docs/_lavoro/Per matteo/test-modelli-locali/local-agent/skills/<skill>.md`, se presenti;

Il runner e il canale piu pulito per misurare tempo e qualita del modello, perche evita prompt e tool
nascosti della UI.
