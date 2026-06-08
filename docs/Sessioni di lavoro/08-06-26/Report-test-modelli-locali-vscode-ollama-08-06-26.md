# Report finale - test modelli locali VS Code/Ollama - 08-06-26

## Obiettivo

Riorientare la strategia di test dei modelli locali da Roo Code a una procedura piu stabile basata su:

- VS Code Chat con custom agent/prompt file leggeri;
- runner locale diretto su Ollama per test ripetibili;
- prompt e skill ridotti, pensati per modelli medio-bassi;
- separazione chiara tra planning, esecuzione controllata, verifica e architettura.

## Contesto letto

- `AGENTS.md`
- `docs/APP_CONTEXT_SKILL.md`
- `docs/Comunicazione-Skill/VOCABOLARIO.md`
- `docs/Testing-Skill/TESTING_SKILL.md`
- `docs/_lavoro/Per matteo/STRATEGIA_TEST_MODELLI_LOCALI.md`
- `docs/_lavoro/Per matteo/test-modelli-locali/README.md`
- `docs/_lavoro/Per matteo/test-modelli-locali/GUIDA_TEST_MANUALE_VSCODE.md`
- documenti e report di sessione usati per capire task reali della repo
- documentazione ufficiale VS Code su custom instructions, custom agents e prompt files

## Modifiche effettuate

### Strategia e documentazione

- Aggiornata la strategia: Roo Code non e piu il canale principale per i test locali.
- Aggiornata la guida manuale per testare i modelli da VS Code Chat e da runner Ollama.
- Aggiornato il README della suite test modelli locali.
- Rimosso il documento operativo vecchio sui Roo modes.
- Aggiornati i prompt fixture per evitare indizi e scelte guidate nei test di planning/reasoning.

### VS Code Chat

Creati file workspace per allineare la chat ai test:

- `.github/copilot-instructions.md`
- `.github/agents/local-ask-planner.agent.md`
- `.github/agents/local-code-guarded.agent.md`
- `.github/agents/local-debug-verifier.agent.md`
- `.github/agents/local-architect-draft.agent.md`
- `.github/prompts/local-smoke.prompt.md`
- `.github/prompts/local-test-ask-dashboard.prompt.md`
- `.github/prompts/local-test-debug-report.prompt.md`
- `.vscode/settings.json`

Questi file permettono di testare agenti leggeri in VS Code senza caricare tutto il sistema Roo.

### Runner diretto Ollama

Creato:

- `scripts/local-ollama-agent.mjs`

Il runner permette test ripetibili da terminale con:

- modello;
- mode;
- skill locali;
- file esplicitamente iniettati;
- temperatura;
- context window;
- salvataggio output.

Il runner include una protezione importante: il modello non puo dichiarare come "letti" file che non sono stati davvero iniettati nel prompt.

## Test eseguiti

- `ollama list` per verificare modelli disponibili.
- Chiamate dirette a Ollama API `/api/generate`.
- Smoke `gpt-oss:20b` con risposta `CIAO`.
- Smoke `qwen3-coder:30b` con risposta `CIAO`.
- `node --check scripts/local-ollama-agent.mjs`.
- Test runner in mode `plain`.
- Test runner in mode `ask` con skill leggere.

## Risultati osservati

- Ollama e i modelli funzionano da terminale/API.
- `gpt-oss:20b` ha risposto rapidamente negli smoke piu piccoli.
- `qwen3-coder:30b` ha risposto correttamente, ma diventa molto lento quando il contesto cresce.
- Roo Code ha smesso di rispondere anche a prompt minimi, mentre gli stessi modelli funzionavano da terminale: il problema sembra nel canale Roo/configurazione/UI/tooling, non nei modelli o in Ollama.
- I modelli locali soffrono molto quando ricevono troppe regole e troppi file insieme.
- Per questi modelli conviene un system prompt leggero, skill brevi e file iniettati solo quando servono.

## Test non eseguiti

- Smoke completo dentro VS Code Chat dopo reload della finestra.
- Test executor reale con modifica codice.
- Test DB/RLS/Auth.
- Test comparativo esteso 32k vs 128k.
- Push remoto.

## Rischi residui

- I nomi dei tool disponibili negli agent file VS Code possono cambiare in base alla versione/estensione installata.
- I modelli locali possono ancora inventare letture o test se usati fuori dal runner.
- Contesti lunghi peggiorano molto velocita e affidabilita.
- Gli agenti locali non sono ancora promossi a esecutori affidabili: vanno usati prima come planner/reviewer su task piccoli.

## Follow-up consigliato

1. Fare reload di VS Code.
2. Verificare che compaiano gli agenti custom in Chat.
3. Eseguire `local-smoke.prompt.md` con `gpt-oss:20b` e `qwen3-coder:30b`.
4. Eseguire il test dashboard ambiguo con agent planner.
5. Eseguire il test report falso con agent verifier.
6. Registrare tempi, errori e qualita in `report-comparativo.md`.
7. Promuovere un modello a `code` solo dopo test executor controllati su branch dedicato.

## Conferme operative

- Nessun commit/push/merge eseguito prima di questo report.
- Nessuna modifica DB eseguita.
- Nessun deploy eseguito.
- Nessuna modifica applicativa intenzionale inclusa in questa sessione.

## 11. Domande di chiusura

❓ Q1 — Prompt verbatim rispettato?
✅ R1: Si. La richiesta iniziale era chiudere il lavoro sui test modelli locali con report finale e commit; poi e arrivata la richiesta esplicita "fai commit di tutto e lasciamo work tree completamente pulito". Ho quindi cambiato da commit selettivo a commit totale del working tree.

❓ Q2 — Dati = diff reale?
✅ R2: Si. Prima del commit ho controllato `git diff --cached --stat`, `git diff --cached --check` e `git status --short`. Il diff finale include configurazione VS Code/Ollama, runner locale, documentazione, skill Roo disattivate, modifiche e2e/app gia presenti, helper e immagini di prova.

❓ Q3 — File correlati allineati?
✅ R3: Si per l'area test modelli locali: strategia, README, guida manuale, prompt fixture, runner, mode/skill locali, agent VS Code e prompt VS Code sono allineati alla nuova strategia senza Roo come canale principale.

❓ Q4 — Cosa NON e stato fatto?
✅ R4: Non ho eseguito push remoto. Non ho fatto test completi Playwright/build sull'intero diff, perche il commit include anche modifiche pregresse non prodotte in questa ultima fase. Ho eseguito controllo sintattico del runner e controllo whitespace del diff staged.

❓ Q5 — Attrito + miglioria?
✅ R5: Attrito principale: Roo Code non rispondeva piu pur avendo Ollama funzionante da terminale/API, quindi il canale Roo e stato scartato per i test. Miglioria: separare VS Code Chat leggera da runner Ollama ripetibile riduce il rischio di contesto eccessivo e rende i test confrontabili.

❓ Q6 — Contesto giusto + hook utile?
✅ R6: Si. Il contesto giusto era AGENTS, skill routing/comunicazione/testing, documenti strategici e report sessione. L'hook fine-sessione e stato utile: ha bloccato il primo commit per report incompleto e ha imposto questa sezione Q/R prima della chiusura.
