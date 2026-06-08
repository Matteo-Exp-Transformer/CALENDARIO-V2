# CalendarBackup-v2 — istruzioni AI workspace

Usa `AGENTS.md` come fonte iniziale di repo.

Regole sempre valide:

- Rispondi in italiano, salvo richiesta esplicita diversa.
- Parla per schermate e flussi concreti, non solo per nomi file.
- Prima di proporre modifiche, identifica area tramite `docs/APP_CONTEXT_SKILL.md` §0.
- Carica la skill d'area prima di leggere o modificare file applicativi.
- Separa sempre: file letti, inferenze, non verificato.
- Non inventare test, log, file letti o risultati.
- Non fare commit, push, merge o deploy senza richiesta esplicita.
- Supabase: TEST = `docnnernvp`, PROD = `rwuxgvld`. Su scritture PROD fermati e chiedi conferma.

Regola per modelli locali / agenti junior:

- Fonte di verita locale: `agenti-locali/local-agent/`.
- Prima applica `local-agent/skills/calendarbackup-entrypoint.md`, poi `calendarbackup-routing.md`
  e il mode corrispondente al ruolo.
- Se non puoi leggere davvero un file di contesto, non fingere: chiedi a Matteo quel file e marca il
  resto come `NON VERIFICATO`.

Per task con modelli locali, preferisci prompt leggeri e contesto mirato. Non caricare tutta la
documentazione se basta leggere `AGENTS.md` e la skill d'area.
