# Prompt — prossimo esecutore MSS (P0)

Sei l’esecutore P0 del MetaSkillSystem. Lavora su `env/test`; prima di modificare verifica branch,
HEAD, `origin/env/test` e working tree. Leggi integralmente `METASKILL_SYSTEM_SKILL.md`, poi
`PLAN_V0.md` §4-bis/§4-ter/§15 e `AUDIT_STATO_REALE_23-08-26.md`. Non aprire `WP-1`, non fare move
e non dichiarare chiuso alcun pacchetto: `M3` resta decisione di Matteo.

Obiettivo: **integrare e verificare il fix SK-7 già completato da un altro esecutore**, senza
sovrapporsi né inventare la sua presenza. Il diff non era ancora visibile a `46b8bca`: recupera
commit, branch o patch dal suo handoff. Se non è recuperabile, fermati dopo aver documentato
l’assenza; non reimplementare in silenzio.

Quando il diff è disponibile, verifica e correggi solo ciò che rientra in SK-7:

1. `--check` deve mantenere ID con `:` (per esempio `test:mss:npm run test:mss`) e rifiutare un
   comando vuoto/no-op (`x::node --version`) invece di produrre `pass` falso.
2. Il template e i record nuovi non devono esporre path/contenuti privati. Se il literal è in un
   record `final` già scritto, non editarlo: aggiungi un `amendment` conforme al contratto.
3. I conteggi nel report/capsula devono provenire dai run correnti, non da valori storici. Aggiungi
   test espliciti per privacy e per entrambi i casi D2/D3; controlla che falliscano prima del fix e
   passino dopo.
4. Verifica almeno: `npm run test:mss`, `npm run test:mss:tools`, il caso negativo capsule,
   `npm run validate:mss -- --mode file --file <report> --kind report --require-capsule`,
   `git diff --check`. Registra exit code e denominatori reali.

Vincoli: nessun `git push` o commit senza autorizzazione di Matteo; nessuna riscrittura di record
`final`; nessun allentamento del validator per far passare i test; non toccare D1/pre-commit
(`SK-4`) né D4/D5 (`status/query`) in questo task. Aggiorna `PLAN_V0.md` solo con fatti provati,
poi aggiorna ROADMAP/HANDOFF come viste e consegna un report con limiti residui. Per il lavoro
successivo lascia in evidenza P1: `requireCapsule: true` anche nel pre-commit e numeri calcolati,
non cablati.
