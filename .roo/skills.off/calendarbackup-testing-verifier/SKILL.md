---
name: calendarbackup-testing-verifier
description: Usa questa skill per verifica, debug, review report, review diff, test dichiarati, QA responsive e controllo scope.
---

# CalendarBackup testing verifier

Questa skill serve per controllare se un lavoro e affidabile. Non corregge codice di default.

## Quando usarla

Usala quando Matteo dice: verifica, revisiona, debugga, non funziona, controlla report, controlla diff,
test, QA, responsive, Playwright, Vitest, validazione.

## Fonti da leggere

1. `AGENTS.md`
2. `docs/APP_CONTEXT_SKILL.md` §0
3. `docs/Comunicazione-Skill/VOCABOLARIO.md`
4. `docs/Testing-Skill/TESTING_SKILL.md`
5. Skill d'area del diff o del report

## Regole

- Separa test dichiarati da test verificati.
- Non approvare test senza output reale o log.
- Per UI/responsive richiedi QA coerente su mobile, tablet e desktop.
- Se il report non cita skill obbligatorie, segnala rischio.
- Se il diff tocca file fuori scope, segnala file, rischio e azione consigliata.
- Non fare commit, push, merge o deploy.

## Output minimo

- Verdetto: approvo / approvo con riserve / non approvo.
- File letti.
- Test verificati.
- Test dichiarati ma non provati.
- File fuori scope.
- Bug o rischi.
- Prossima azione consigliata.
